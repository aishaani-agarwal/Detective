// ============================================================
// CASE REGISTRY — add a new case by requiring it here. That's it.
// ============================================================

const CASES = {};
for (const c of [
  require("./rao-mansion.js"),
  require("./suryagarh-sangeet.js"),
  require("./studio-seven.js"),
  require("./empty-frame.js"),
  require("./gold-dust.js"),
  require("./house-edge.js"),
  require("./dead-weight.js"),
  require("./false-turner.js"),
  require("./scrubbed.js"),
  require("./closing-time.js"),
  require("./salt-and-silver.js"),
  require("./quiet-car.js"),
  require("./night-shift.js"),
  require("./cold-chain.js"),
  require("./ledger.js")
  // add future cases right here
]) {
  CASES[c.id] = c;
}

// The catalog for the case-selection screen: zero spoilers.
function catalog() {
  return Object.values(CASES).map(c => ({
    id: c.id,
    caseNo: c.caseNo,
    title: c.title,
    theme: c.theme,
    difficulty: c.difficulty,
    category: c.category || "Homicide",
    level: c.level || "medium",
    settingLine: c.settingLine
  }));
}

// Everything the browser is allowed to know about one case: still zero spoilers.
// Note: suspect "system" scripts, "voice" configs, "guilty", "truth", epilogues
// are deliberately NOT included.
function publicCase(id) {
  const c = CASES[id];
  if (!c) return null;
  const suspects = {};
  for (const [sid, s] of Object.entries(c.suspects)) {
    suspects[sid] = { ...s.public, id: sid };
  }
  return {
    id: c.id,
    caseNo: c.caseNo,
    title: c.title,
    theme: c.theme,
    settingLine: c.settingLine,
    facts: c.facts,
    suspects
  };
}

// The captain's desk. Give it a category and it pulls from that drawer only.
function randomCaseId(category) {
  let ids = Object.keys(CASES);
  if (category) {
    const filtered = ids.filter(id => (CASES[id].category || "Homicide") === category);
    if (filtered.length) ids = filtered;
  }
  return ids[Math.floor(Math.random() * ids.length)];
}

// Drawer list for the cabinet, with a count on each label.
function categories() {
  const counts = {};
  for (const c of Object.values(CASES)) {
    const cat = c.category || "Homicide";
    counts[cat] = (counts[cat] || 0) + 1;
  }
  return counts;
}

module.exports = { CASES, catalog, publicCase, randomCaseId, categories };
