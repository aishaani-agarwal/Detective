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

// Character casting. Left side = the voice name each suspect was
// written for; right side = the local Kokoro voice + delivery speed.
const CAST = {
  Charon: { voice: "am_fenrir", speed: 0.92 },  // gruff older men
  Puck:   { voice: "am_puck",   speed: 1.02 },  // younger, nervier men
  Kore:   { voice: "af_heart",  speed: 1.00 },  // sharp younger women
  Aoede:  { voice: "bf_emma",   speed: 0.95 }   // cool, composed women
};
const DEFAULT_CAST = { voice: "af_heart", speed: 1.0 };

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
async function speakLocal(text, castName) {
  const tts = await loadTTS();
  const cast = CAST[castName] || DEFAULT_CAST;
  const parts = chunk(text);
  const pieces = [];
  let total = 0;
  for (const part of parts) {
    const audio = await tts.generate(part, { voice: cast.voice, speed: cast.speed });
    const data = audio.audio || audio.data;               // Float32Array of samples
    pieces.push(data);
    total += data.length;
    // a breath between sentences so stitched audio doesn't sound glued
    if (parts.length > 1) { const gap = new Float32Array(Math.round(SAMPLE_RATE * 0.12)); pieces.push(gap); total += gap.length; }
  }
  const all = new Float32Array(total);
  let off = 0;
  for (const p of pieces) { all.set(p, off); off += p.length; }
  return floatToWav(all, SAMPLE_RATE);
}

const isAvailable = () => !unavailable;
const warmUp = () => loadTTS().then(() => true).catch(() => false);

module.exports = { speakLocal, warmUp, isAvailable, floatToWav, chunk, CAST };
