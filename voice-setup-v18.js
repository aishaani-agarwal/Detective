// ============================================================
// scripts/voice-setup.js — one-time local voice setup + audition.
// Downloads the Kokoro model (~90MB, once) and generates a sample
// clip for EVERY suspect so you can hear the casting before playing.
//
//   npm run voice-setup
// ============================================================
const fs = require("fs");
const path = require("path");
const { speakLocal, castFor } = require("../lib-voice.js");
const { CASES } = require("../cases");

const OUT = path.join(__dirname, "..", "public", "generated", "voice", "_audition");
fs.mkdirSync(OUT, { recursive: true });

const LINE = "I have told you where I was, detective. Ask me again if you like, the answer does not change.";

(async () => {
  console.log("\n🎙  Local voice setup — downloads the model once, then voices are unlimited.\n");
  let ok = 0, fail = 0;
  for (const caseId of Object.keys(CASES)) {
    const c = CASES[caseId];
    console.log(`\n  ${c.title}`);
    for (const suspectId of Object.keys(c.suspects)) {
      const s = c.suspects[suspectId];
      const cast = castFor({ caseId, suspectId, voiceType: s.voice.name });
      process.stdout.write(`    ${s.public.name.padEnd(20)} ${cast.voice.padEnd(13)} `);
      const t0 = Date.now();
      try {
        const wav = await speakLocal(LINE, { caseId, suspectId, voiceType: s.voice.name });
        fs.writeFileSync(path.join(OUT, `${caseId}-${suspectId}.wav`), wav);
        console.log(`✔ ${((Date.now() - t0) / 1000).toFixed(1)}s`);
        ok++;
      } catch (err) {
        console.log("✘ " + err.message.slice(0, 80));
        fail++;
        if (fail >= 3) { console.log("\n  Too many failures — is kokoro-js installed? (npm install kokoro-js)\n"); process.exit(1); }
      }
    }
  }
  console.log(`\n${ok} voices ready. Listen to them in:\n  ${path.relative(process.cwd(), OUT)}\n`);
  console.log("Don't like a voice? Edit the CAST map at the top of lib-voice.js and re-run this.\n");
})();
