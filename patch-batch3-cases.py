#!/usr/bin/env python3
"""
patch-batch3-cases.py — the last seven cases, plus a bigger badge chip.

  Service            Homicide  · easy    Copenhagen restaurant
  Vintage            Theft     · easy    Bordeaux chateau
  The Scholarship    Fraud     · easy    Boston university
  Proof              Sabotage  · medium  Speyside distillery
  Second Serve       Fraud     · medium  Buenos Aires tennis
  The Relay          Sabotage  · hard    Cape Town substation
  Airside            Narcotics · hard    Stansted air freight

That takes the cabinet to 29 cases with every drawer full.
Also makes the corner badge larger and easier to read.

Run once:  python3 patch-batch3-cases.py
Safe to run twice.
"""
import os, sys

NEW_IDS = ["service", "vintage", "the-scholarship", "proof", "second-serve", "the-relay", "airside"]

PORTRAITS = {
 "service": {
   "freja":  "Danish sous chef woman, 31, chef whites with sleeves rolled, hair scraped back, sharp tired face, stainless steel kitchen at night",
   "ivan":   "Bulgarian electrician man, 56, grey moustache, work jacket and tool belt, careful guarded expression, dim service corridor",
   "mads":   "Danish restaurateur man, 49, well-cut dark shirt, greying hair swept back, practised charming smile, empty dining room at night" },
 "vintage": {
   "hugo":   "Young French man, 34, expensive rumpled shirt, tousled hair, faintly petulant expression, chateau interior",
   "yves":   "Old French cellar master, 61, weathered face and white moustache, worn work coat, proud stubborn gaze, barrel cellar by lamplight",
   "claire": "French estate manager woman, 42, tailored blazer, hair in a neat twist, composed commercial expression, chateau office" },
 "the-scholarship": {
   "denise": "African-American financial aid officer woman, 39, cardigan and lanyard, warm tired face, cluttered campus office",
   "tarun":  "Indian-American systems analyst man, 33, glasses, plain shirt, literal unsmiling expression, screens glowing behind",
   "gregory":"American university administrator man, 57, blazer and tie, silver hair and moustache, avuncular confident face, wood-panelled office" },
 "proof": {
   "isla":   "Scottish distillery manager woman, 46, quilted jacket over shirt, hair tied back, measured commercial expression, warehouse of casks",
   "ewan":   "Older Scottish warehouseman, 58, flat cap and work coat, weathered dry face, dim bonded warehouse",
   "dougie": "Scottish distiller man, 52, glasses, wool jumper, quiet thoughtful face, copper stills behind him" },
 "second-serve": {
   "valeria":"Argentine tournament director woman, 48, smart blazer with accreditation pass, dark hair up, brisk political expression, stadium corridor",
   "nico":   "Young Argentine tennis player man, 24, damp hair and training top, proud defensive expression, clay court at dusk",
   "matias": "Argentine chair umpire man, 41, glasses, official polo shirt and cap, formal composed face, umpire's chair" },
 "the-relay": {
   "thandiwe":"South African control room supervisor woman, 43, hi-vis vest over blouse, hair braided back, sharp procedural expression, wall of control screens",
   "kagiso": "Young South African technician man, 29, hard hat and hi-vis, wary guarded face, electrical substation yard",
   "pieter": "South African engineer man, 51, grey moustache, hi-vis over shirt, dry senior expression, substation switchgear" },
 "airside": {
   "yusuf":  "British-Nigerian loadmaster man, 45, hi-vis over flight crew shirt, headset around neck, weary precise face, cargo aircraft hold",
   "orla":   "Young Irish groom woman, 27, padded gilet and yard boots, hair tied back, blunt direct expression, horse transport crate on apron",
   "dermot": "Irish ground handling supervisor man, 50, glasses, hi-vis jacket, chatty open face, floodlit airport apron at night" }
}

CAST = {
 "service:freja": ("bf_isabella", 1.10), "service:ivan": ("am_onyx", 0.98), "service:mads": ("am_puck", 1.08),
 "vintage:hugo": ("am_puck", 1.10), "vintage:yves": ("am_fenrir", 0.94), "vintage:claire": ("ff_siwis", 1.04),
 "the-scholarship:denise": ("af_nicole", 1.06), "the-scholarship:tarun": ("am_michael", 1.08), "the-scholarship:gregory": ("am_fenrir", 1.00),
 "proof:isla": ("bf_emma", 1.02), "proof:ewan": ("bm_george", 0.94), "proof:dougie": ("bm_fable", 1.00),
 "second-serve:valeria": ("ef_dora", 1.10), "second-serve:nico": ("am_puck", 1.12), "second-serve:matias": ("pm_santa", 1.00),
 "the-relay:thandiwe": ("af_heart", 1.08), "the-relay:kagiso": ("am_michael", 1.10), "the-relay:pieter": ("am_onyx", 0.98),
 "airside:yusuf": ("am_fenrir", 0.98), "airside:orla": ("bf_isabella", 1.12), "airside:dermot": ("bm_fable", 1.10)
}

CHIP_SIZE = [
  ("padding:7px 12px;cursor:default;", "padding:10px 16px;cursor:default;"),
  ("#badgeChip .shield{width:16px;height:19px;", "#badgeChip .shield{width:22px;height:26px;"),
  ("#badgeChip .who{font-family:'Special Elite',monospace;font-size:11px;",
   "#badgeChip .who{font-family:'Special Elite',monospace;font-size:15px;"),
  ("#badgeChip .no{display:block;font-size:9px;letter-spacing:.22em;",
   "#badgeChip .no{display:block;font-size:12.5px;letter-spacing:.24em;margin-top:2px;"),
]

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    cdir = os.path.join(root, "cases")
    if not os.path.isdir(cdir):
        print("Run this from inside the detective folder."); sys.exit(1)

    missing = [i for i in NEW_IDS if not os.path.exists(os.path.join(cdir, i + ".js"))]
    if missing:
        print("  ! not in cases/ yet: " + ", ".join(missing) + "\n    move the downloaded case files into cases/ first.")
        sys.exit(1)

    # registry
    ip = os.path.join(cdir, "index.js")
    s = open(ip, encoding="utf-8").read()
    added = [i for i in NEW_IDS if f'./{i}.js' not in s]
    if added:
        anchor = '  require("./green-room.js")'
        if anchor not in s:
            print("  ! couldn't find where to add them in cases/index.js"); sys.exit(1)
        s = s.replace(anchor, anchor + ",\n" + ",\n".join(f'  require("./{i}.js")' for i in added), 1)
        open(ip, "w", encoding="utf-8").write(s)
        print(f"  ✔ registry — added {len(added)} cases")
    else:
        print("  = registry already lists them")

    # portraits
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

    # voices
    lv = os.path.join(root, "lib-voice.js")
    if os.path.exists(lv):
        s = open(lv, encoding="utf-8").read()
        new = {k: v for k, v in CAST.items() if f'"{k}"' not in s}
        if new:
            lines = "".join(f'  "{k}":{" " * max(1, 30 - len(k))}{{ voice: "{v[0]}", speed: {v[1]} }},\n' for k, v in new.items())
            s = s.replace('const CAST = {\n', 'const CAST = {\n' + lines, 1)
            open(lv, "w", encoding="utf-8").write(s)
            print(f"  ✔ lib-voice.js — {len(new)} suspects cast")
        else:
            print("  = lib-voice.js already cast them")

    # bigger badge chip
    fp = os.path.join(root, "public", "index.html")
    page = open(fp, encoding="utf-8").read()
    if "font-size:15px" in page and "#badgeChip .who" in page and "width:22px;height:26px" in page:
        print("  = badge chip already enlarged")
    else:
        before = page
        for old, new in CHIP_SIZE:
            page = page.replace(old, new, 1)
        if page == before:
            print("  ! couldn't find the badge styles to enlarge (page unchanged)")
        else:
            open(fp, "w", encoding="utf-8").write(page)
            ok = "width:22px;height:26px" in open(fp, encoding="utf-8").read()
            print(f"  {'✔' if ok else '✘'} index.html — badge chip enlarged")

    print("\nRestart the server. Run `npm run images` when you want the new portraits.\n")

if __name__ == "__main__":
    main()
