#!/usr/bin/env python3
"""
patch-batch2-cases.py — register seven new cases.

  Pit Lane          Sabotage  · medium  Barcelona, Formula 3
  Deep Freeze       Sabotage  · hard    Antarctic research station
  Box 114           Theft     · easy    Lisbon bank vault
  The Understudy    Theft     · medium  Vienna concert hall
  Ghost Wards       Fraud     · medium  Manila hospital billing
  Slack Water       Homicide  · medium  Scottish tidal island
  The Green Room    Narcotics · hard    English music festival

Run once:  python3 patch-batch2-cases.py
Safe to run twice.
"""
import os, sys

NEW_IDS = ["pit-lane", "deep-freeze", "box-114", "the-understudy", "ghost-wards", "slack-water", "green-room"]

PORTRAITS = {
 "pit-lane": {
   "tomas":   "Spanish chief mechanic man, 47, grey moustache, team polo shirt and headset around neck, gruff weathered face, motorsport garage at night",
   "dani":    "Young Spanish racing driver man, 21, race suit unzipped to the waist, damp hair, cocky brittle expression, pit lane at dusk",
   "elena":   "Spanish race engineer woman, 34, team softshell jacket, hair tied back, headset, analytical unsmiling face, pit wall with screens" },
 "deep-freeze": {
   "ingvild": "Norwegian polar station leader woman, 51, weathered face, thermal layers and unzipped red parka, calm authority, Antarctic station interior",
   "priya":   "Indian glaciologist woman, 38, fleece and beanie, glasses fogged at the edge, warm anxious expression, polar laboratory",
   "rune":    "Norwegian station engineer man, 44, heavy beard, oil-marked overalls over thermals, dry weathered face, generator shed" },
 "box-114": {
   "joana":   "Portuguese bank manager woman, 52, tailored navy suit, short greying hair, formal composed expression, marble bank interior",
   "marta":   "Portuguese woman, 36, dark coat and simple jewellery, sharp guarded expression, bank lobby",
   "rui":     "Portuguese bank clerk man, 41, glasses, shirtsleeves and tie, mild helpful face, vault corridor with deposit boxes" },
 "the-understudy": {
   "lukas":   "Austrian stage manager man, 49, dark clothes, headset, clipboard, harried precise face, backstage of a concert hall",
   "anneke":  "Dutch concert violinist woman, 33, black concert gown, hair up, poised strained expression, concert hall wings",
   "nina":    "Austrian orchestral violinist woman, 29, black concert dress, hair in a low bun, quiet watchful face, orchestra pit lighting" },
 "ghost-wards": {
   "lorna":   "Filipina hospital billing supervisor woman, 45, office blouse and lanyard, hair clipped up, harried defensive face, hospital admin office",
   "ramon":   "Filipino records officer man, 38, glasses, polo shirt and ID badge, anxious careful expression, server room",
   "emil":    "Filipino hospital director man, 56, white coat over shirt and tie, greying moustache, warm authoritative face, hospital corridor" },
 "slack-water": {
   "morag":   "Scottish woman, 54, wool jumper and scarf, greying hair pinned back, contained grieving face, window with grey sea behind",
   "lena":    "German woman, 41, walking jacket and short practical hair, watchful reserved expression, coastal hotel lounge",
   "dougal":  "Scottish groundsman man, 47, waxed jacket and moustache, weathered ruddy face, slow steady gaze, island shoreline at dusk" },
 "green-room": {
   "dev":     "British-Indian tour manager man, 43, glasses, laminate pass and black jacket, exhausted alert face, festival backstage at night",
   "saff":    "Young Black British security supervisor woman, 30, hi-vis over black, hair braided back, direct unsentimental face, festival gate at night",
   "joss":    "Young British DJ man, 27, streetwear and chains, fresh fade, charming quick smile, festival compound at night" }
}

CAST = {
 "pit-lane:tomas":   ("am_fenrir", 0.98), "pit-lane:dani": ("am_puck", 1.12), "pit-lane:elena": ("ef_dora", 1.06),
 "deep-freeze:ingvild": ("bf_emma", 1.00), "deep-freeze:priya": ("hf_alpha", 1.10), "deep-freeze:rune": ("am_onyx", 0.98),
 "box-114:joana": ("bf_isabella", 1.02), "box-114:marta": ("pf_dora", 1.08), "box-114:rui": ("pm_alex", 1.10),
 "the-understudy:lukas": ("am_michael", 1.02), "the-understudy:anneke": ("af_heart", 1.06), "the-understudy:nina": ("bf_emma", 1.00),
 "ghost-wards:lorna": ("af_nicole", 1.12), "ghost-wards:ramon": ("am_puck", 1.06), "ghost-wards:emil": ("am_fenrir", 1.00),
 "slack-water:morag": ("bf_emma", 0.98), "slack-water:lena": ("bf_isabella", 1.04), "slack-water:dougal": ("bm_george", 0.94),
 "green-room:dev": ("am_onyx", 1.02), "green-room:saff": ("af_heart", 1.10), "green-room:joss": ("am_puck", 1.12)
}

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    cdir = os.path.join(root, "cases")
    if not os.path.isdir(cdir):
        print("Run this from inside the detective folder."); sys.exit(1)

    missing = [i for i in NEW_IDS if not os.path.exists(os.path.join(cdir, i + ".js"))]
    if missing:
        print("  ! not in cases/ yet: " + ", ".join(missing) + "\n    download them and move them into cases/ first.")
        sys.exit(1)

    ip = os.path.join(cdir, "index.js")
    s = open(ip, encoding="utf-8").read()
    added = [i for i in NEW_IDS if f'./{i}.js' not in s]
    if added:
        anchor = '  require("./ledger.js")'
        if anchor not in s:
            print("  ! couldn't find where to add them in cases/index.js"); sys.exit(1)
        block = anchor + ",\n" + ",\n".join(f'  require("./{i}.js")' for i in added)
        s = s.replace(anchor, block, 1)
        open(ip, "w", encoding="utf-8").write(s)
        print(f"  ✔ registry — added {len(added)} cases")
    else:
        print("  = registry already lists them")

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

    print("\nRestart the server. Run `npm run images` when you want the new portraits.\n")

if __name__ == "__main__":
    main()
