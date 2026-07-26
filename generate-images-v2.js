// ============================================================
// scripts/generate-images.js — make every suspect portrait.
//
// Generates each portrait once and caches it to public/generated/.
// Already-generated images are skipped, so this is safe to stop
// (Ctrl+C) and re-run — it picks up exactly where it left off.
//
//   npm run images
// ============================================================
const fs = require("fs");
const path = require("path");
const IMG = require("../cases/_prompts.js");
const { allImageTasks, generateToFile } = require("../lib-images.js");

const GEN_DIR = path.join(__dirname, "..", "public", "generated");
fs.mkdirSync(GEN_DIR, { recursive: true });

const hasKey = !!(process.env.POLLINATIONS_KEY || "").trim();
const secs = (ms) => Math.round(ms / 1000);
const clock = (s) => s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`;

async function pass(tasks, label) {
  const failed = [];
  const started = Date.now();
  let done = 0;
  for (const task of tasks) {
    const filePath = path.join(GEN_DIR, task.file);
    if (fs.existsSync(filePath)) { done++; continue; }
    const n = ++done;
    const each = n > 1 ? (Date.now() - started) / (n - 1) : 0;
    const left = each ? `  ~${clock(secs(each * (tasks.length - n)))} left` : "";
    process.stdout.write(`  [${String(n).padStart(3)}/${tasks.length}] ${task.file.padEnd(34)}`);
    try {
      await generateToFile(task, filePath);
      console.log(`✔${left}`);
    } catch (err) {
      console.log(`✘ ${err.message.slice(0, 60)}`);
      failed.push(task);
    }
  }
  return failed;
}

(async () => {
  const tasks = allImageTasks(IMG);
  const missing = tasks.filter(t => !fs.existsSync(path.join(GEN_DIR, t.file)));

  console.log(`\n🖼  ${tasks.length} portraits total · ${tasks.length - missing.length} already done · ${missing.length} to make`);
  if (!missing.length) { console.log("Every portrait is on disk. ✔\n"); return; }
  console.log(hasKey
    ? "Pollinations key found — the fast lane. Roughly " + clock(missing.length * 5) + "."
    : "No POLLINATIONS_KEY in .env — the slow lane, roughly " + clock(missing.length * 17) + ".\n   (A free key at enter.pollinations.ai makes this about four times faster.)");
  console.log("Safe to stop with Ctrl+C and re-run later; it resumes.\n");

  let failed = await pass(missing, "first pass");

  if (failed.length) {
    console.log(`\n↻ retrying ${failed.length} that failed…\n`);
    failed = await pass(failed, "retry");
  }

  const stillMissing = tasks.filter(t => !fs.existsSync(path.join(GEN_DIR, t.file)));
  console.log(`\nDone. ${tasks.length - stillMissing.length}/${tasks.length} portraits on disk.`);
  if (stillMissing.length) {
    console.log(`${stillMissing.length} still missing — just run 'npm run images' again, it only retries those:`);
    console.log("  " + stillMissing.slice(0, 12).map(t => t.file).join("\n  ") + (stillMissing.length > 12 ? `\n  …and ${stillMissing.length - 12} more` : ""));
  }
  console.log("");
})();
