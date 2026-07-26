#!/usr/bin/env python3
"""
patch-cabinet-data.py — give every case a drawer and a difficulty.

Adds to each case file:
  category : which cabinet drawer it lives in (Homicide, Theft, Fraud, Narcotics, Sabotage)
  level    : "easy" | "medium" | "hard"
and quietly works the difficulty letter into the case number, the way a real
filing system encodes things nobody explains to you:
  47E / 2026   ·   AC-1187M   ·   FBI-LA-30291H

Also teaches the registry to hand those fields to the browser, and adds
category-filtered random assignment for the captain's desk.

Run once:  python3 patch-cabinet-data.py
Safe to run twice.
"""
import re, os, sys

# case id -> (category, level, new case number)
META = {
    "rao-mansion":       ("Homicide",  "easy",   "47E / 2026 · Indiranagar Division"),
    "suryagarh-sangeet": ("Homicide",  "medium", "213M / 2026 · Jodhpur Rural"),
    "studio-seven":      ("Homicide",  "hard",   "88H / 1977 · Bombay CID"),
    "empty-frame":       ("Theft",     "medium", "AC-1187M · Amsterdam Art Crimes"),
    "gold-dust":         ("Sabotage",  "medium", "ADN-77M · Norwegian Anti-Doping / Politi"),
    "house-edge":        ("Fraud",     "hard",   "SP-4402H · Sûreté Publique / Gaming Commission"),
    "dead-weight":       ("Narcotics", "medium", "DEA-MIA-5521M · Joint Task Force"),
    "false-turner":      ("Fraud",     "medium", "AAU-9016M · Metropolitan Police"),
    "scrubbed":          ("Sabotage",  "hard",   "FBI-LA-30291H · FAA Joint Investigation"),
}

CATALOG_OLD = """    difficulty: c.difficulty,
    settingLine: c.settingLine
  }));"""
CATALOG_NEW = """    difficulty: c.difficulty,
    category: c.category || "Homicide",
    level: c.level || "medium",
    settingLine: c.settingLine
  }));"""

RANDOM_OLD = """function randomCaseId() {
  const ids = Object.keys(CASES);
  return ids[Math.floor(Math.random() * ids.length)];
}"""
RANDOM_NEW = """// The captain's desk. Give it a category and it pulls from that drawer only.
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
}"""

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    cdir = os.path.join(root, "cases")
    if not os.path.isdir(cdir):
        print("Run this from inside the detective folder."); sys.exit(1)

    changed = 0
    for cid, (cat, level, caseno) in META.items():
        path = os.path.join(cdir, cid + ".js")
        if not os.path.exists(path):
            print(f"  ! {cid}.js missing — skipped"); continue
        s = open(path, encoding="utf-8").read()
        if "category:" in s:
            print(f"  = {cid}.js already has a drawer"); continue
        # replace the case number, then add category + level right after it
        s2, n = re.subn(r'  caseNo: "[^"]*",',
                        f'  caseNo: "{caseno}",\n  category: "{cat}",\n  level: "{level}",',
                        s, count=1)
        if not n:
            print(f"  ! {cid}.js — no caseNo line found, untouched"); continue
        open(path, "w", encoding="utf-8").write(s2)
        print(f"  ✔ {cid}  →  {cat} drawer, {level}")
        changed += 1

    # registry
    ip = os.path.join(cdir, "index.js")
    s = open(ip, encoding="utf-8").read()
    touched = False
    if "category: c.category" not in s:
        s = s.replace(CATALOG_OLD, CATALOG_NEW, 1); touched = True
    if "function categories()" not in s:
        s = s.replace(RANDOM_OLD, RANDOM_NEW, 1)
        s = s.replace("module.exports = { CASES, catalog, publicCase, randomCaseId };",
                      "module.exports = { CASES, catalog, publicCase, randomCaseId, categories };", 1)
        touched = True
    if touched:
        open(ip, "w", encoding="utf-8").write(s); print("  ✔ cases/index.js updated")
    else:
        print("  = cases/index.js already updated")

    # server: let the captain's desk pull from a single drawer
    sp = os.path.join(root, "server.js")
    if os.path.exists(sp):
        v = open(sp, encoding="utf-8").read()
        if "randomCaseId(req.query.category)" in v:
            print("  = server.js already category-aware")
        else:
            v2 = v.replace("const id = req.query.random ? randomCaseId() : req.query.id;",
                           "const id = req.query.random ? randomCaseId(req.query.category) : req.query.id;", 1)
            if v2 != v:
                open(sp, "w", encoding="utf-8").write(v2); print("  ✔ server.js — captain can pull from one drawer")
            else:
                print("  ! server.js — random route not found, untouched")

    print(f"\n{changed} cases filed. Now copy in the new public/index.html.\n")

if __name__ == "__main__":
    main()
