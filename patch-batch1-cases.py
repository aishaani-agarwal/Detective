#!/usr/bin/env python3
"""
patch-batch1-cases.py — register six new cases.

  Closing Time      Homicide  · easy    Chicago jazz club
  Salt and Silver   Theft     · medium  Seville cathedral treasury
  The Quiet Car     Theft     · hard    Zurich–Milan express
  Night Shift       Narcotics · easy    Melbourne hospital
  Cold Chain        Narcotics · medium  Port of Rotterdam
  Ledger            Fraud     · hard    Seoul crypto exchange

Adds them to the registry, gives every new suspect a portrait prompt and a
cast voice, and leaves the existing nine cases untouched.

Run once:  python3 patch-batch1-cases.py
Safe to run twice.
"""
import os, re, sys

NEW_IDS = ["closing-time", "salt-and-silver", "quiet-car", "night-shift", "cold-chain", "ledger"]

PORTRAITS = {
 "closing-time": {
   "vivienne": "Jazz singer woman, 44, mixed heritage, sequinned dark gown, hair up, tired knowing eyes, backstage of a dim club at night",
   "teddy":    "Older American bartender man, 61, white moustache, rolled shirtsleeves and waistcoat, weathered kind face, behind a dark bar",
   "roland":   "American club manager man, 39, slicked hair, open collar and loosened tie, ingratiating smile that doesn't reach the eyes, dim club interior" },
 "salt-and-silver": {
   "anselmo":  "Elderly Spanish priest, 63, black cassock, wire glasses, thin severe face, candlelit cathedral sacristy",
   "ignacio":  "Spanish security chief man, 45, close beard, dark uniform polo with radio, defensive stance, cathedral cloister at dusk",
   "beatriz":  "Spanish art conservator woman, 38, hair tied back, nitrile gloves and lab coat over dark clothes, cool appraising gaze, conservation studio" },
 "quiet-car": {
   "renata":   "English insurance loss adjuster woman, 41, sharp grey trouser suit, short blonde hair, unreadable composure, train first-class interior",
   "marco":    "Swiss-Italian train manager man, 52, railway uniform and cap, greying moustache, weary official expression, train corridor",
   "silvan":   "Young Swiss courier man, 34, dark suit, neat side part, controlled blank expression, train compartment at night" },
 "night-shift": {
   "fiona":    "Australian intensive care doctor woman, 47, scrubs and lanyard, hair pinned back, exhausted authority, hospital corridor at night",
   "ari":      "Young Australian male nurse, 29, Middle Eastern heritage, scrubs, warm anxious face, hospital ward at night",
   "grant":    "Australian anaesthetic technician man, 38, theatre scrubs and cap around neck, moustache, dry guarded expression, hospital theatre suite" },
 "cold-chain": {
   "wim":      "Dutch crane operator man, 55, high-visibility jacket over fleece, grey moustache, blunt weathered face, container port at night",
   "yasmin":   "Dutch-Moroccan customs inspector woman, 33, uniform jacket with badge, dark hair tied back, sharp guarded expression, port terminal",
   "ruud":     "Dutch refrigeration technician man, 41, work overalls, wire glasses, talkative open face, refrigerated container stack at night" },
 "ledger": {
   "jiwoo":    "Korean security engineer man, 36, glasses, plain dark hoodie over shirt, literal unsmiling expression, server room glow",
   "claire":   "Korean-American compliance officer woman, 44, immaculate charcoal suit, hair in a low bun, polished corporate composure, glass office at night",
   "daehyun":  "Korean executive man, 49, late forties, dark suit and tie, grey at the temples, measured authoritative gaze, corporate boardroom at night" }
}

# accent-fitting local voices; within a case the three never collide
CAST = {
 "closing-time:vivienne": ("af_nicole", 1.02),
 "closing-time:teddy":    ("am_fenrir", 0.98),
 "closing-time:roland":   ("am_puck",   1.12),
 "salt-and-silver:anselmo": ("pm_santa", 0.98),
 "salt-and-silver:ignacio": ("em_alex",  1.10),
 "salt-and-silver:beatriz": ("ef_dora",  1.06),
 "quiet-car:renata": ("bf_emma",     1.04),
 "quiet-car:marco":  ("im_nicola",   1.00),
 "quiet-car:silvan": ("am_michael",  1.08),
 "night-shift:fiona": ("bf_isabella", 1.10),
 "night-shift:ari":   ("am_puck",     1.12),
 "night-shift:grant": ("am_fenrir",   1.02),
 "cold-chain:wim":    ("am_onyx",     0.98),
 "cold-chain:yasmin": ("af_heart",    1.10),
 "cold-chain:ruud":   ("bm_fable",    1.12),
 "ledger:jiwoo":   ("am_puck",     1.08),
 "ledger:claire":  ("bf_emma",     1.04),
 "ledger:daehyun": ("am_michael",  1.00)
}

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    cdir = os.path.join(root, "cases")
    if not os.path.isdir(cdir):
        print("Run this from inside the detective folder."); sys.exit(1)

    missing = [i for i in NEW_IDS if not os.path.exists(os.path.join(cdir, i + ".js"))]
    if missing:
        print("  ! these case files aren't in cases/ yet: " + ", ".join(missing))
        print("    download them first, then re-run this.")
        sys.exit(1)

    # ---- registry ----
    ip = os.path.join(cdir, "index.js")
    s = open(ip, encoding="utf-8").read()
    added = [i for i in NEW_IDS if f'./{i}.js' not in s]
    if added:
        block = "".join(f'  require("./{i}.js"),\n' for i in added)
        s = s.replace('  require("./scrubbed.js")\n', '  require("./scrubbed.js"),\n' + block.rstrip(",\n") + "\n", 1)
        open(ip, "w", encoding="utf-8").write(s)
        print(f"  ✔ registry — added {len(added)} cases")
    else:
        print("  = registry already lists them")

    # ---- portrait prompts ----
    pp = os.path.join(cdir, "_prompts.js")
    s = open(pp, encoding="utf-8").read()
    to_add = {k: v for k, v in PORTRAITS.items() if f'"{k}"' not in s}
    if to_add:
        blocks = []
        for cid, people in to_add.items():
            lines = ",\n".join(f'        {sid}: "{txt}"' for sid, txt in people.items())
            blocks.append(f'    "{cid}": {{\n      suspects: {{\n{lines}\n      }}\n    }}')
        marker = "\n  }\n};\n"
        idx = s.rindex(marker)
        s = s[:idx] + ",\n" + ",\n".join(blocks) + marker + s[idx + len(marker):]
        open(pp, "w", encoding="utf-8").write(s)
        print(f"  ✔ _prompts.js — {len(to_add)} cases of portraits")
    else:
        print("  = _prompts.js already has them")

    # ---- voice casting ----
    lv = os.path.join(root, "lib-voice.js")
    if os.path.exists(lv):
        s = open(lv, encoding="utf-8").read()
        new = {k: v for k, v in CAST.items() if f'"{k}"' not in s}
        if new:
            lines = "".join(f'  "{k}":{" " * max(1, 30 - len(k))}{{ voice: "{v[0]}", speed: {v[1]} }},\n'
                            for k, v in new.items())
            s = s.replace('const CAST = {\n', 'const CAST = {\n' + lines, 1)
            open(lv, "w", encoding="utf-8").write(s)
            print(f"  ✔ lib-voice.js — {len(new)} suspects cast")
        else:
            print("  = lib-voice.js already cast them")

    print("\nRestart the server, then run `npm run images` when you want the new portraits.\n")

if __name__ == "__main__":
    main()
