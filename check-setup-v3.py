#!/usr/bin/env python3
"""
check-setup.py — what's actually installed right now?

Some features live in patch scripts that edit public/index.html and server.js
in place. Copying in a fresh page file overwrites them. Run this any time you
want to know what your project currently has, and what to re-run if something
went missing.

  python3 check-setup.py
"""
import os, re, glob, sys

root = os.path.dirname(os.path.abspath(__file__))
def read(*parts):
    p = os.path.join(root, *parts)
    return open(p, encoding="utf-8").read() if os.path.exists(p) else ""

page   = read("public", "index.html")
server = read("server.js")
lvoice = read("lib-voice.js")
limg   = read("lib-images.js")
creg   = read("cases", "index.js")

if not page or not server:
    print("Run this from inside the detective folder."); sys.exit(1)

# feature -> (installed?, which file it lives in, how to restore it)
FEATURES = [
    ("Cabinet select screen",  "cab-grid" in page and "drawerPull" in page,
     "public/index.html", "copy in the latest detective-page-vXX.html"),
    ("Voice interrogation (mic)", "startListening" in page,
     "public/index.html", "copy in the latest detective-page-vXX.html"),
    ("Bring-your-own-key button", "x-user-gemini-key" in page,
     "public/index.html", "copy in the latest detective-page-vXX.html"),
    ("Detective badge + name",  "setupCredentials" in page,
     "public/index.html", "python3 patch-badge-v3.py"),
    ("Suspects know your name", "detectiveLine" in server,
     "server.js", "python3 patch-badge-v3.py"),
    ("Strict verdict judge",    '"thin"' in server and "askJudge" in server,
     "server.js", "python3 patch-judge.py"),
    ("Interrogation depth gate", "askedAccused" in server,
     "server.js", "python3 patch-judge.py"),
    ("Category drawers + levels", "categories" in creg and "req.query.category" in server,
     "cases/index.js + server.js", "python3 patch-cabinet-data.py"),
    ("Local unlimited voices",  "speakLocal" in lvoice and "kokoro" in lvoice,
     "lib-voice.js", "reinstall lib-voice.js"),
    ("Intro scenes removed",    'kind === "scene"' not in limg,
     "lib-images.js + cases", "python3 patch-remove-scenes.py"),
    ("Netlify deployment",      os.path.exists(os.path.join(root, "netlify.toml")),
     "netlify.toml", "recreate netlify.toml"),
]

print("\n  FEATURE                      STATUS   LIVES IN")
print("  " + "-" * 66)
missing = []
for name, ok, where, how in FEATURES:
    print(f"  {name:<28} {'✔ on ' if ok else '✘ OFF'}   {where}")
    if not ok:
        missing.append((name, how))

# case inventory
case_files = [f for f in glob.glob(os.path.join(root, "cases", "*.js"))
              if os.path.basename(f) != "index.js"
              and not os.path.basename(f).startswith("_")]   # _prompts, _themes, etc. aren't cases
registered = len(re.findall(r'require\("\./[a-z0-9\-]+\.js"\)', creg))
levels = {}
cats = {}
for f in case_files:
    src = open(f, encoding="utf-8").read()
    m = re.search(r'level: "(\w+)"', src)
    if m: levels[m.group(1)] = levels.get(m.group(1), 0) + 1
    c = re.search(r'category: "(\w+)"', src)
    if c: cats[c.group(1)] = cats.get(c.group(1), 0) + 1

print(f"\n  Cases on disk: {len(case_files)}   registered: {registered}")
if len(case_files) != registered:
    print("  ! those numbers should match — a case file isn't registered in cases/index.js")
print("  Drawers: " + ", ".join(f"{k} {v}" for k, v in sorted(cats.items())))
print("  Levels : " + ", ".join(f"{k} {v}" for k, v in sorted(levels.items())))

if missing:
    print("\n  To restore what's off:")
    for name, how in missing:
        print(f"    {name:<28} →  {how}")
else:
    print("\n  Everything's installed. \n")
