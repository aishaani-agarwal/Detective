// ============================================================
// scripts/voice-setup.js — one-time local voice setup.
// Downloads the Kokoro model (~90MB, once) and generates a test
// clip for each character voice so you can hear them before playing.
//
//   npm run voice-setup
// ============================================================
const fs = require("fs");
const path = require("path");
const { speakLocal, CAST } = require("../lib-voice.js");

const OUT = path.join(__dirname, "..", "public", "generated", "voice");
fs.mkdirSync(OUT, { recursive: true });

const LINES = {
  Charon: "I ran clean boats for thirty years, detective. You can ask anyone on that dock.",
  Puck:   "I was at my desk the whole evening. I did not leave it, not once, I swear.",
  Kore:   "I have nothing to hide. Ask me whatever you like, I will answer all of it.",
  Aoede:  "I authenticated it in good faith. My reputation is the only thing I have."
};

(async () => {
  console.log("\n🎙  Local voice setup — this downloads the model once, then voices are free forever.\n");
  const names = Object.keys(CAST);
  let ok = 0;
  for (const name of names) {
    const cast = CAST[name];
    process.stdout.write(`  ${name.padEnd(7)} → ${cast.voice.padEnd(10)} `);
    const started = Date.now();
    try {
      const wav = await speakLocal(LINES[name] || "Testing the interrogation room microphone.", name);
      const file = path.join(OUT, `_test-${name}.wav`);
      fs.writeFileSync(file, wav);
      console.log(`✔  ${(Date.now() - started) / 1000}s  →  ${path.relative(process.cwd(), file)}`);
      ok++;
    } catch (err) {
      console.log("✘ " + err.message);
    }
  }
  console.log(`\n${ok}/${names.length} voices ready.`);
  if (ok) {
    console.log("Open the files above to hear each character voice.");
    console.log("Now run:  npm start   — voices are unlimited from here on.\n");
  } else {
    console.log("Nothing generated. Make sure you ran:  npm install kokoro-js\n");
  }
})();
