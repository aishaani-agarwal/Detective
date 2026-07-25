// ============================================================
// scripts/generate-images.js — pre-generate EVERY case image
// (27 portraits + 27 scenes) via Pollinations, one every ~16s.
// Already-existing images are skipped, so re-running is safe
// and only fetches whatever is still missing.
//
//   Run with:  npm run images
// ============================================================
const fs = require("fs");
const path = require("path");
const IMG = require("../cases/_prompts.js");
const { allImageTasks, generateToFile } = require("../lib-images.js");

const GEN_DIR = path.join(__dirname, "..", "public", "generated");
fs.mkdirSync(GEN_DIR, { recursive: true });

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  const tasks = allImageTasks(IMG);
  const missing = tasks.filter(t => !fs.existsSync(path.join(GEN_DIR, t.file)));
  console.log(`\n🖼  ${tasks.length} images total · ${tasks.length - missing.length} already done · ${missing.length} to generate`);
  if (!missing.length) { console.log("Nothing to do — every image is already on disk. ✔\n"); return; }
  console.log(`Paced politely (faster with a POLLINATIONS_KEY in .env). Go make chai.\n`);

  let done = 0, failed = [];
  for (const task of missing) {
    const filePath = path.join(GEN_DIR, task.file);
    process.stdout.write(`[${++done}/${missing.length}] ${task.file} ... `);
    try {
      await generateToFile(task, filePath);
      console.log("✔");
    } catch (err) {
      console.log("✘ " + err.message);
      failed.push(task.file);
    }
    if (done < missing.length) await sleep(1_000); // real pacing lives in lib-images
  }

  console.log(`\nDone. ${missing.length - failed.length} generated, ${failed.length} failed.`);
  if (failed.length) console.log("Failed (just run 'npm run images' again to retry only these):\n  " + failed.join("\n  "));
  console.log("");
})();