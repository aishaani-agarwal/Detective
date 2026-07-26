#!/usr/bin/env python3
"""
patch-remove-scenes.py — delete the pre-case scene images and their data.

The intro sequence is gone, so the scene panels, their SVG art, their
image-generation prompts and the /api/image scene branch are all dead weight.
This strips them out of:

  cases/*.js        the intro: [...] arrays
  cases/_prompts.js the per-case intro prompts + SCENE_STYLE
  cases/index.js    intro no longer sent to the browser
  lib-images.js     scene branch of the image builder
  scripts/generate-images.js  (unchanged — it just gets fewer tasks)

It also offers to delete the already-generated scene PNGs.
Suspect portraits are untouched.

Run once:  python3 patch-remove-scenes.py
Safe to run twice.
"""
import re, os, sys, glob

def strip_intro_from_case(path):
    s = open(path, encoding="utf-8").read()
    if "\n  intro: [" not in s:
        return False
    # the intro block runs from "  intro: [" to the line "  ],"
    m = re.search(r'\n  intro: \[.*?\n  \],', s, re.S)
    if not m:
        return False
    s = s[:m.start()] + s[m.end():]
    open(path, "w", encoding="utf-8").write(s)
    return True

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    cdir = os.path.join(root, "cases")
    if not os.path.isdir(cdir):
        print("Run this from inside the detective folder."); sys.exit(1)

    # ---- 1. case files ----
    n = 0
    for path in sorted(glob.glob(os.path.join(cdir, "*.js"))):
        if os.path.basename(path) in ("index.js", "_prompts.js"):
            continue
        if strip_intro_from_case(path):
            print(f"  ✔ {os.path.basename(path)} — intro panels removed"); n += 1
        else:
            print(f"  = {os.path.basename(path)} — already clean")

    # ---- 2. prompt library ----
    pp = os.path.join(cdir, "_prompts.js")
    if os.path.exists(pp):
        s = open(pp, encoding="utf-8").read()
        if '"intro"' in s or "intro:" in s:
            s = re.sub(r',?\s*intro: \[.*?\]\s*(?=\})', "\n      ", s, flags=re.S)
            s = re.sub(r'const SCENE_STYLE = .*?;\n', "", s, flags=re.S)
            s = s.replace("  SCENE_STYLE,\n", "")
            s = s.replace("module.exports = {\n  PORTRAIT_STYLE,\n  SCENE_STYLE,", "module.exports = {\n  PORTRAIT_STYLE,")
            open(pp, "w", encoding="utf-8").write(s)
            print("  ✔ _prompts.js — scene prompts removed")
        else:
            print("  = _prompts.js — already clean")

    # ---- 3. registry: stop sending intro to the browser ----
    ip = os.path.join(cdir, "index.js")
    s = open(ip, encoding="utf-8").read()
    if "intro: c.intro" in s:
        s = s.replace("    facts: c.facts,\n    intro: c.intro,\n", "    facts: c.facts,\n")
        s = s.replace("    intro: c.intro,\n", "")
        open(ip, "w", encoding="utf-8").write(s)
        print("  ✔ cases/index.js — intro no longer sent")
    else:
        print("  = cases/index.js — already clean")

    # ---- 4. image builder: portraits only ----
    lp = os.path.join(root, "lib-images.js")
    if os.path.exists(lp):
        s = open(lp, encoding="utf-8").read()
        if 'kind === "scene"' in s:
            s = re.sub(r'  if \(kind === "scene".*?\n  \}\n', "", s, flags=re.S)
            s = re.sub(r'    cp\.intro\.forEach\(.*?\n    \}\);\n', "", s, flags=re.S)
            open(lp, "w", encoding="utf-8").write(s)
            print("  ✔ lib-images.js — scene generation removed")
        else:
            print("  = lib-images.js — already clean")

    # ---- 5. the generated scene PNGs ----
    gen = os.path.join(root, "public", "generated")
    scenes = glob.glob(os.path.join(gen, "*-scene-*.png"))
    if scenes:
        for f in scenes:
            os.remove(f)
        print(f"  ✔ deleted {len(scenes)} generated scene images")
    else:
        print("  = no scene images on disk")

    print("\nDone. Restart the server (Ctrl+C, npm start).\n")

if __name__ == "__main__":
    main()
