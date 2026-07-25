// ============================================================
// lib-images.js — shared image generation via Pollinations
// (free, keyless). Used by server.js and scripts/generate-images.js
// ============================================================
const fs = require("fs");
try { require("dotenv").config(); } catch {}

// ------------------------------------------------------------
// Shared Pollinations traffic controller: every call (image OR
// voice) goes through here, serialized with a polite gap, with
// one automatic retry on 429. A free key from enter.pollinations.ai
// (put POLLINATIONS_KEY=... in .env) shrinks the gap a lot.
// ------------------------------------------------------------
const POLLI_KEY = process.env.POLLINATIONS_KEY || "";
const POLLI_GAP = POLLI_KEY ? 4_000 : 16_000;
let polliChain = Promise.resolve();
let polliLast = 0;

function pacedPolliFetch(url, timeoutMs = 90_000, init = {}, gapMs = POLLI_GAP) {
  const doCall = async () => {
    const wait = Math.max(0, polliLast + gapMs - Date.now());
    if (wait) await new Promise(r => setTimeout(r, wait));
    try {
      let r = await fetchWithTimeout(url, timeoutMs, init);
      if (r.status === 429 || r.status >= 500) {         // rate limited / hiccup → one polite retry
        await new Promise(res => setTimeout(res, POLLI_GAP));
        r = await fetchWithTimeout(url, timeoutMs, init);
      }
      return r;
    } finally {
      polliLast = Date.now();
    }
  };
  const p = polliChain.then(doCall, doCall);
  polliChain = p.catch(() => {});   // the chain itself never breaks
  return p;
}

function fetchWithTimeout(url, ms, init = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  const withKey = POLLI_KEY
    ? url + (url.includes("?") ? "&" : "?") + "key=" + encodeURIComponent(POLLI_KEY)
    : url;
  const headers = Object.assign({}, init.headers || {}, POLLI_KEY ? { Authorization: "Bearer " + POLLI_KEY } : {});
  return fetch(withKey, Object.assign({}, init, { signal: ctrl.signal, headers })).finally(() => clearTimeout(t));
}

// deterministic seed per filename → the same image if ever regenerated
function seedFor(name) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % 100000;
}

// turn ?kind=&caseId=&sid=/&panel= into { prompt, file, w, h } (or null)
function buildImageTask(IMG, q) {
  const { kind, caseId, sid, panel } = q;
  const cp = IMG.prompts[caseId];
  if (kind === "portrait" && cp && cp.suspects[sid]) {
    return {
      prompt: `${IMG.PORTRAIT_STYLE} Subject: ${cp.suspects[sid]}.`,
      file: `${caseId}-${sid}.png`, w: 704, h: 704
    };
  }
  if (kind === "scene" && cp && cp.intro[Number(panel)]) {
    return {
      prompt: `${IMG.SCENE_STYLE} Scene: ${cp.intro[Number(panel)]}.`,
      file: `${caseId}-scene-${Number(panel)}.png`, w: 1024, h: 576
    };
  }
  return null;
}

// every task for every case — used by the pre-generation script
function allImageTasks(IMG) {
  const tasks = [];
  for (const caseId of Object.keys(IMG.prompts)) {
    const cp = IMG.prompts[caseId];
    for (const sid of Object.keys(cp.suspects)) {
      tasks.push(buildImageTask(IMG, { kind: "portrait", caseId, sid }));
    }
    cp.intro.forEach((_, i) => {
      tasks.push(buildImageTask(IMG, { kind: "scene", caseId, panel: String(i) }));
    });
  }
  return tasks;
}

// fetch one image from Pollinations (paced) and save it to disk
async function generateToFile(task, filePath) {
  const url = "https://image.pollinations.ai/prompt/" + encodeURIComponent(task.prompt) +
    `?width=${task.w}&height=${task.h}&model=flux&nologo=true&seed=${seedFor(task.file)}`;
  const r = await pacedPolliFetch(url, 120_000);
  if (!r.ok) throw new Error("pollinations HTTP " + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 5000) throw new Error("response too small — likely an error page, not an image");
  fs.writeFileSync(filePath, buf);
}

// fetch one spoken line from Pollinations (paced) → mp3 buffer
async function speakViaPollinations(text, voice) {
  const url = "https://text.pollinations.ai/" + encodeURIComponent(text) +
    "?model=openai-audio&voice=" + voice;
  const r = await pacedPolliFetch(url, 60_000);
  if (!r.ok) throw new Error("pollinations HTTP " + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 2000) throw new Error("pollinations returned no audio");
  return buf;
}

// chat completion via Pollinations (paced) — the fallback brain when
// Gemini's free-tier chat quota runs out. OpenAI-style messages in,
// plain reply text out. Tries the two known endpoint shapes.
// ------------------------------------------------------------
// Which chat models can WE actually use? Ask Pollinations' live
// model list instead of guessing names. Models that answer 402
// (premium) get blacklisted permanently for this run.
// ------------------------------------------------------------
const FALLBACK_CHAT_MODELS = ["openai-fast", "gpt-5-nano", "gpt-5-mini", "mistral", "gemini", "llama", "openai"];
let polliModelList = null;      // discovered candidates, best first
let workingChatModel = null;    // the confirmed winner
const blacklisted = new Set();  // models that demanded payment

async function getPolliChatModels() {
  if (polliModelList) return polliModelList;
  try {
    const r = await pacedPolliFetch("https://text.pollinations.ai/models", 20_000, {}, 1_000);
    const list = await r.json();
    const usable = (Array.isArray(list) ? list : [])
      .filter(m => m && m.name)
      .filter(m => !/audio|image|video|embed/i.test(m.name + " " + (m.description || "")))
      .filter(m => {
        const tier = (m.tier || "anonymous").toLowerCase();
        return POLLI_KEY ? ["anonymous", "seed"].includes(tier) : tier === "anonymous";
      })
      .map(m => m.name);
    polliModelList = usable.length ? usable : [...FALLBACK_CHAT_MODELS];
  } catch (e) {
    polliModelList = [...FALLBACK_CHAT_MODELS];
  }
  console.log("Pollinations chat candidates:", polliModelList.slice(0, 8).join(", ") + (polliModelList.length > 8 ? " …" : ""));
  return polliModelList;
}

async function chatViaPollinations(systemText, messages) {
  const oaiMessages = [
    { role: "system", content: systemText },
    ...messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }))
  ];
  const endpoints = [
    "https://text.pollinations.ai/openai",
    "https://gen.pollinations.ai/v1/chat/completions"
  ];
  const candidates = workingChatModel
    ? [workingChatModel]
    : (await getPolliChatModels()).filter(m => !blacklisted.has(m));
  let lastErr = null;
  for (const model of candidates) {
    for (const url of endpoints) {
      try {
        // scans move fast (2s gap); once locked in, normal pacing applies
        const gap = workingChatModel === model ? undefined : 2_000;
        const r = await pacedPolliFetch(url, 90_000, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, messages: oaiMessages })
        }, gap);
        if (r.status === 402 || r.status === 403) {
          blacklisted.add(model);
          throw new Error(`model ${model} is premium (HTTP ${r.status}) — blacklisted`);
        }
        if (!r.ok) throw new Error(`pollinations chat HTTP ${r.status} (model ${model})`);
        const data = await r.json();
        const reply = (data?.choices?.[0]?.message?.content || "").trim();
        if (!reply) throw new Error(`pollinations chat empty (model ${model})`);
        if (workingChatModel !== model) console.log("✔ Pollinations chat model locked in:", model);
        workingChatModel = model;
        return reply;
      } catch (e) {
        lastErr = e;
        if (!/HTTP 404/.test(e.message)) break;    // 404 → try other endpoint; anything else → next model
      }
    }
  }
  workingChatModel = null;
  throw lastErr || new Error("pollinations chat failed");
}

// ------------------------------------------------------------
// Groq — the primary backup brain. Real free tier (no card),
// 30 req/min, ~1,000-14,400 req/day depending on model.
// Key from console.groq.com → .env as GROQ_API_KEY=...
// ------------------------------------------------------------
const GROQ_KEY = process.env.GROQ_API_KEY || "";
const GROQ_MODELS = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"];

async function chatViaGroq(systemText, messages) {
  if (!GROQ_KEY) throw new Error("no GROQ_API_KEY in .env");
  const oaiMessages = [
    { role: "system", content: systemText },
    ...messages.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }))
  ];
  let lastErr = null;
  for (const model of GROQ_MODELS) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 60_000);
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + GROQ_KEY },
        body: JSON.stringify({ model, messages: oaiMessages, max_tokens: 500, temperature: 0.9 }),
        signal: ctrl.signal
      }).finally(() => clearTimeout(t));
      if (!r.ok) throw new Error(`groq HTTP ${r.status} (${model})`);
      const data = await r.json();
      const reply = (data?.choices?.[0]?.message?.content || "").trim();
      if (!reply) throw new Error(`groq empty (${model})`);
      return reply;
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

// one call, whole backup chain: Groq first, Pollinations as last resort
async function backupChat(systemText, messages) {
  try {
    return await chatViaGroq(systemText, messages);
  } catch (e1) {
    try {
      return await chatViaPollinations(systemText, messages);
    } catch (e2) {
      throw new Error(e1.message + " | " + e2.message);
    }
  }
}

module.exports = { buildImageTask, allImageTasks, generateToFile, speakViaPollinations, chatViaPollinations, chatViaGroq, backupChat, seedFor, POLLI_KEY_SET: !!POLLI_KEY, GROQ_KEY_SET: !!GROQ_KEY };
