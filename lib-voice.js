// ============================================================
// lib-voice.js — LOCAL text-to-speech (Kokoro 82M, ONNX).
//
// Runs entirely on this machine: no API key, no quota, no rate
// limit, no internet after the one-time model download. This is
// the engine that makes voices work forever, for endless messages.
//
// Install once:  npm install kokoro-js
// Warm up once:  npm run voice-setup
// ============================================================
const path = require("path");

const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const SAMPLE_RATE = 24000;

// ---- CASTING: one voice per suspect, chosen for accent, age and role ----
// The model ships 54 voices (Hindi, French, Italian, Spanish, British, American…).
// The JS wrapper only whitelists the English ones, but the model accepts them all,
// so suspects can speak English in a fitting accent. Within any single case the
// three suspects always sound clearly different.
// Edit any line here to re-cast a character, then run `npm run voice-setup` to audition.
const CAST = {
  "service:freja":                 { voice: "bf_isabella", speed: 1.1 },
  "service:ivan":                  { voice: "am_onyx", speed: 0.98 },
  "service:mads":                  { voice: "am_puck", speed: 1.08 },
  "vintage:hugo":                  { voice: "am_puck", speed: 1.1 },
  "vintage:yves":                  { voice: "am_fenrir", speed: 0.94 },
  "vintage:claire":                { voice: "ff_siwis", speed: 1.04 },
  "the-scholarship:denise":        { voice: "af_nicole", speed: 1.06 },
  "the-scholarship:tarun":         { voice: "am_michael", speed: 1.08 },
  "the-scholarship:gregory":       { voice: "am_fenrir", speed: 1.0 },
  "proof:isla":                    { voice: "bf_emma", speed: 1.02 },
  "proof:ewan":                    { voice: "bm_george", speed: 0.94 },
  "proof:dougie":                  { voice: "bm_fable", speed: 1.0 },
  "second-serve:valeria":          { voice: "ef_dora", speed: 1.1 },
  "second-serve:nico":             { voice: "am_puck", speed: 1.12 },
  "second-serve:matias":           { voice: "pm_santa", speed: 1.0 },
  "the-relay:thandiwe":            { voice: "af_heart", speed: 1.08 },
  "the-relay:kagiso":              { voice: "am_michael", speed: 1.1 },
  "the-relay:pieter":              { voice: "am_onyx", speed: 0.98 },
  "airside:yusuf":                 { voice: "am_fenrir", speed: 0.98 },
  "airside:orla":                  { voice: "bf_isabella", speed: 1.12 },
  "airside:dermot":                { voice: "bm_fable", speed: 1.1 },
  "pit-lane:tomas":                { voice: "am_fenrir", speed: 0.98 },
  "pit-lane:dani":                 { voice: "am_puck", speed: 1.12 },
  "pit-lane:elena":                { voice: "ef_dora", speed: 1.06 },
  "deep-freeze:ingvild":           { voice: "bf_emma", speed: 1.0 },
  "deep-freeze:priya":             { voice: "hf_alpha", speed: 1.1 },
  "deep-freeze:rune":              { voice: "am_onyx", speed: 0.98 },
  "box-114:joana":                 { voice: "bf_isabella", speed: 1.02 },
  "box-114:marta":                 { voice: "pf_dora", speed: 1.08 },
  "box-114:rui":                   { voice: "pm_alex", speed: 1.1 },
  "the-understudy:lukas":          { voice: "am_michael", speed: 1.02 },
  "the-understudy:anneke":         { voice: "af_heart", speed: 1.06 },
  "the-understudy:nina":           { voice: "bf_emma", speed: 1.0 },
  "ghost-wards:lorna":             { voice: "af_nicole", speed: 1.12 },
  "ghost-wards:ramon":             { voice: "am_puck", speed: 1.06 },
  "ghost-wards:emil":              { voice: "am_fenrir", speed: 1.0 },
  "slack-water:morag":             { voice: "bf_emma", speed: 0.98 },
  "slack-water:lena":              { voice: "bf_isabella", speed: 1.04 },
  "slack-water:dougal":            { voice: "bm_george", speed: 0.94 },
  "green-room:dev":                { voice: "am_onyx", speed: 1.02 },
  "green-room:saff":               { voice: "af_heart", speed: 1.1 },
  "green-room:joss":               { voice: "am_puck", speed: 1.12 },
  "closing-time:vivienne":         { voice: "af_nicole", speed: 1.02 },
  "closing-time:teddy":            { voice: "am_fenrir", speed: 0.98 },
  "closing-time:roland":           { voice: "am_puck", speed: 1.12 },
  "salt-and-silver:anselmo":       { voice: "pm_santa", speed: 0.98 },
  "salt-and-silver:ignacio":       { voice: "em_alex", speed: 1.1 },
  "salt-and-silver:beatriz":       { voice: "ef_dora", speed: 1.06 },
  "quiet-car:renata":              { voice: "bf_emma", speed: 1.04 },
  "quiet-car:marco":               { voice: "im_nicola", speed: 1.0 },
  "quiet-car:silvan":              { voice: "am_michael", speed: 1.08 },
  "night-shift:fiona":             { voice: "bf_isabella", speed: 1.1 },
  "night-shift:ari":               { voice: "am_puck", speed: 1.12 },
  "night-shift:grant":             { voice: "am_fenrir", speed: 1.02 },
  "cold-chain:wim":                { voice: "am_onyx", speed: 0.98 },
  "cold-chain:yasmin":             { voice: "af_heart", speed: 1.1 },
  "cold-chain:ruud":               { voice: "bm_fable", speed: 1.12 },
  "ledger:jiwoo":                  { voice: "am_puck", speed: 1.08 },
  "ledger:claire":                 { voice: "bf_emma", speed: 1.04 },
  "ledger:daehyun":                { voice: "am_michael", speed: 1.0 },
  // Bangalore — Indian voices
  "rao-mansion:meera":          { voice: "hf_beta",     speed: 1.06 },
  "rao-mansion:arjun":          { voice: "hm_omega",    speed: 1.05 },
  "rao-mansion:divya":          { voice: "hf_alpha",    speed: 1.10 },
  // Jodhpur — Indian voices
  "suryagarh-sangeet:yashwant": { voice: "hm_omega",    speed: 1.00 },
  "suryagarh-sangeet:kamini":   { voice: "hf_beta",     speed: 1.08 },
  "suryagarh-sangeet:aditi":    { voice: "hf_alpha",    speed: 1.12 },
  // Bombay 1977 — Indian voices
  "studio-seven:prem":          { voice: "hm_psi",      speed: 1.10 },
  "studio-seven:farooq":        { voice: "hm_omega",    speed: 1.00 },
  "studio-seven:meenakshi":     { voice: "hf_beta",     speed: 1.04 },
  // Amsterdam — Dutch / French / Italian
  "empty-frame:hendrik":        { voice: "bm_george",   speed: 1.02 },
  "empty-frame:isabelle":       { voice: "ff_siwis",    speed: 1.08 },
  "empty-frame:matteo":         { voice: "im_nicola",   speed: 1.06 },
  // Norway — Nordic / Polish (nearest available)
  "gold-dust:astrid":           { voice: "af_nova",     speed: 1.08 },
  "gold-dust:bjorn":            { voice: "am_fenrir",   speed: 0.98 },
  "gold-dust:marta":            { voice: "bf_isabella", speed: 1.10 },
  // Monte Carlo — French / Portuguese
  "house-edge:emile":           { voice: "pm_alex",     speed: 1.12 },
  "house-edge:rafael":          { voice: "pm_santa",    speed: 1.04 },
  "house-edge:colette":         { voice: "ff_siwis",    speed: 1.02 },
  // Miami / Bimini — American / Cuban / British-Nigerian
  "dead-weight:ray":            { voice: "am_fenrir",   speed: 1.02 },
  "dead-weight:lucia":          { voice: "ef_dora",     speed: 1.12 },
  "dead-weight:dex":            { voice: "bm_george",   speed: 1.06 },
  // London — British / Swedish
  "false-turner:margaux":       { voice: "bf_emma",     speed: 1.04 },
  "false-turner:tom":           { voice: "bm_fable",    speed: 1.12 },
  "false-turner:sophie":        { voice: "bf_isabella", speed: 1.06 },
  // Mojave — American / Russian
  "scrubbed:hannah":            { voice: "af_heart",    speed: 1.12 },
  "scrubbed:marcus":            { voice: "am_michael",  speed: 1.04 },
  "scrubbed:yuri":              { voice: "am_onyx",     speed: 0.98 }
};

// fallback by the character's written voice type
const CAST_BY_TYPE = {
  Charon: { voice: "am_fenrir", speed: 1.00 },
  Puck:   { voice: "am_puck",   speed: 1.10 },
  Kore:   { voice: "af_heart",  speed: 1.10 },
  Aoede:  { voice: "bf_emma",   speed: 1.04 }
};
const DEFAULT_CAST = { voice: "af_heart", speed: 1.08 };

function castFor(who = {}) {
  return CAST[`${who.caseId}:${who.suspectId}`] || CAST_BY_TYPE[who.voiceType] || DEFAULT_CAST;
}

let ttsPromise = null;   // the loading model (started once)
let unavailable = null;  // reason string if the engine can't run

// ---- load the model once, keep it in memory ----
function loadTTS() {
  if (unavailable) return Promise.reject(new Error(unavailable));
  if (!ttsPromise) {
    ttsPromise = (async () => {
      let kokoro;
      try {
        kokoro = await import("kokoro-js");
      } catch (e) {
        unavailable = "kokoro-js is not installed (run: npm install kokoro-js)";
        throw new Error(unavailable);
      }
      // keep the downloaded model inside the project so it persists
      try { kokoro.env.cacheDir = path.join(__dirname, ".model-cache"); } catch {}
      console.log("🎙  Loading local voice engine (first run downloads ~90MB, once)…");
      const tts = await kokoro.KokoroTTS.from_pretrained(MODEL_ID, { dtype: "q8", device: "cpu" });
      // the wrapper whitelists only English voices; the model itself accepts all 54.
      // keep its real job (returning the phonemiser language code) but stop it rejecting ours.
      tts._validate_voice = (v) => (String(v).charAt(0) === "b" ? "b" : "a");
      console.log("🎙  Local voice engine ready — voices are now unlimited.");
      return tts;
    })().catch(err => {
      ttsPromise = null;               // allow a later retry
      if (!unavailable) unavailable = err.message;
      throw err;
    });
  }
  return ttsPromise;
}

// ---- split long replies: the model truncates very long input ----
function chunk(text, max = 320) {
  const sentences = String(text).replace(/\s+/g, " ").trim().match(/[^.!?…]+[.!?…]*\s*/g) || [text];
  const out = [];
  let cur = "";
  for (let s of sentences) {
    s = s.trim();
    while (s.length > max) {
      const cut = s.lastIndexOf(" ", max);
      out.push(s.slice(0, cut > 60 ? cut : max).trim());
      s = s.slice(cut > 60 ? cut : max).trim();
    }
    if ((cur + " " + s).trim().length <= max) cur = (cur + " " + s).trim();
    else { if (cur) out.push(cur); cur = s; }
  }
  if (cur) out.push(cur);
  return out;
}

// ---- float samples → 16-bit PCM WAV buffer ----
function floatToWav(samples, sampleRate = SAMPLE_RATE) {
  const pcm = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    let v = Math.max(-1, Math.min(1, samples[i]));
    pcm.writeInt16LE(Math.round(v * 32767), i * 2);
  }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0);                    h.writeUInt32LE(36 + pcm.length, 4);
  h.write("WAVE", 8);                    h.write("fmt ", 12);
  h.writeUInt32LE(16, 16);               h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);                h.writeUInt32LE(sampleRate, 24);
  h.writeUInt32LE(sampleRate * 2, 28);   h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);               h.write("data", 36);
  h.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([h, pcm]);
}

// ---- generate one spoken line (WAV buffer) ----
async function speakLocal(text, who) {
  const tts = await loadTTS();
  const cast = castFor(who);
  const parts = chunk(text);
  const pieces = [];
  let total = 0;
  for (const part of parts) {
    const audio = await tts.generate(part, { voice: cast.voice, speed: cast.speed });
    const data = audio.audio || audio.data;               // Float32Array of samples
    pieces.push(data);
    total += data.length;
    // a breath between sentences so stitched audio doesn't sound glued
    if (parts.length > 1) { const gap = new Float32Array(Math.round(SAMPLE_RATE * 0.1)); pieces.push(gap); total += gap.length; }
  }
  const all = new Float32Array(total);
  let off = 0;
  for (const p of pieces) { all.set(p, off); off += p.length; }
  return floatToWav(all, SAMPLE_RATE);
}

const isAvailable = () => !unavailable;
const warmUp = () => loadTTS().then(() => true).catch(() => false);

module.exports = { speakLocal, warmUp, isAvailable, floatToWav, chunk, castFor, CAST, CAST_BY_TYPE };
