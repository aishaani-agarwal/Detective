#!/usr/bin/env python3
"""
patch-batch4-cases.py — ten more cases, four of them murders.

  Northern Lights     Homicide  · easy    Iceland writers' retreat
  Prize Day           Homicide  · easy    English boarding school
  Base Camp           Homicide  · medium  Karakoram expedition
  The Chapel of Rest  Homicide  · hard    New Orleans funeral home
  Dead Air            Theft     · easy    Kingston recording studio
  Deep Six            Theft     · medium  Azores salvage vessel
  Carbon              Fraud     · medium  Pará, Brazil
  The Ninth Wave      Sabotage  · medium  Orkney tidal array
  Milk Run            Narcotics · medium  Irish border
  Bunker              Narcotics · hard    Piraeus

Takes the cabinet to 39 cases. Homicide becomes the biggest drawer, at 10.

Run once:  python3 patch-batch4-cases.py
Safe to run twice.
"""
import os, sys

NEW_IDS = ["northern-lights", "base-camp", "prize-day", "chapel-of-rest", "dead-air",
           "deep-six", "carbon", "ninth-wave", "milk-run", "bunker"]

PORTRAITS = {
 "northern-lights": {
   "sigrun": "Icelandic woman, 49, wool sweater, hair in a loose bun, calm composed face, timber lodge interior at night",
   "keiko":  "Japanese woman, 37, dark cardigan and reading glasses pushed up, exacting quiet expression, book-lined room",
   "pall":   "Young Icelandic man, 33, pale, tousled hair, thin sweater, eager anxious smile, dark window behind" },
 "base-camp": {
   "dawa":   "Nepali climbing sirdar man, 41, weathered sun-darkened face, down jacket and beanie, spare steady gaze, high altitude camp",
   "priya":  "Indian expedition doctor woman, 36, down jacket, hair tied back, clipped clinical expression, tent interior with medical kit",
   "elliot": "British expedition leader man, 52, glasses, expensive down jacket, hearty commercial smile, snow and tents behind" },
 "prize-day": {
   "verity": "English deputy headmistress, 51, tailored suit, greying hair pinned up, clipped institutional expression, school quad",
   "tom":    "English schoolboy of eighteen, blazer and tie, confident performed smile, marquee on a school lawn",
   "graham": "English school bursar man, 56, moustache, tweed jacket and tie, fussy proper expression, wood-panelled bursary office" },
 "chapel-of-rest": {
   "celeste":"New Orleans funeral director woman, 61, elegant dark dress, silver hair, gracious formal face, chapel interior with candles",
   "dev":    "Young American night attendant man, 28, rumpled shirt and tie, jumpy anxious expression, dim funeral home corridor",
   "antoine":"New Orleans embalmer man, 53, glasses, surgical gown over shirt, courteous unshockable face, preparation room" },
 "dead-air": {
   "kessi":  "Young Jamaican singer woman, 26, braids, hoop earrings, guarded warm expression, recording studio live room",
   "junior": "Jamaican session bassist man, 44, greying locs and moustache, open shirt, wry unhurried face, bass guitar visible",
   "delroy": "Jamaican studio engineer man, 38, glasses, headphones round neck, friendly quick expression, mixing desk glow" },
 "deep-six": {
   "ines":   "Portuguese marine conservator woman, 35, lab coat over fleece, hair tied back, exacting expression, ship conservation lab",
   "tobias": "American expedition backer man, 58, moustache, expensive polo and deck shoes, expansive confident face, salvage vessel deck",
   "markus": "Portuguese-South African dive supervisor man, 47, glasses, dive crew jacket, methodical calm expression, decompression chamber behind" },
 "carbon": {
   "beatriz":"Brazilian project director woman, 47, linen blazer, hair in a low bun, polished guarded expression, office with forest maps",
   "joaquim":"Brazilian field auditor man, 39, moustache, field shirt and cap, plain uncomfortable expression, forest edge",
   "rafael": "Brazilian technical lead man, 44, glasses, short-sleeved shirt, articulate confident face, screens with satellite imagery" },
 "ninth-wave": {
   "morven": "Scottish engineer woman, 36, waterproof jacket and hard hat under arm, hair tied back, direct expression, harbour with turbines",
   "petra":  "Swedish investment representative woman, 52, sharp coat, short blonde hair, cool unsentimental face, windswept pier",
   "callum": "Orcadian marine technician man, 44, moustache, worn waterproofs, dry weathered face, grey sea behind" },
 "milk-run": {
   "sinead": "Northern Irish depot supervisor woman, 46, fleece and hi-vis, hair short, brisk dry expression, dairy tanker depot",
   "davy":   "Young Northern Irish tanker driver man, 34, hoodie and work trousers, nervy chatty face, tanker cab",
   "gerry":  "Northern Irish tank inspector man, 57, grey moustache, overalls and clipboard, affable rambling expression, stainless tanker behind" },
 "bunker": {
   "stavros":"Greek chief officer man, 48, moustache, ship's uniform shirt with epaulettes, formal weary face, ship deck at night",
   "liza":   "Filipina second engineer woman, 33, boiler suit, hair tied back, precise guarded expression, engine control room",
   "panos":  "Greek bunker surveyor man, 51, glasses, hi-vis over polo, affable talkative face, floodlit deck and fuel manifold" }
}

CAST = {
 "northern-lights:sigrun": ("bf_emma", 1.00), "northern-lights:keiko": ("af_nicole", 1.02), "northern-lights:pall": ("am_puck", 1.12),
 "base-camp:dawa": ("hm_omega", 0.98), "base-camp:priya": ("hf_alpha", 1.10), "base-camp:elliot": ("bm_fable", 1.06),
 "prize-day:verity": ("bf_emma", 1.02), "prize-day:tom": ("am_puck", 1.12), "prize-day:graham": ("bm_george", 0.98),
 "chapel-of-rest:celeste": ("af_nicole", 0.98), "chapel-of-rest:dev": ("am_puck", 1.14), "chapel-of-rest:antoine": ("am_fenrir", 0.96),
 "dead-air:kessi": ("af_heart", 1.08), "dead-air:junior": ("am_onyx", 0.96), "dead-air:delroy": ("bm_fable", 1.14),
 "deep-six:ines": ("pf_dora", 1.06), "deep-six:tobias": ("am_fenrir", 1.02), "deep-six:markus": ("pm_alex", 1.00),
 "carbon:beatriz": ("pf_dora", 1.04), "carbon:joaquim": ("pm_santa", 1.00), "carbon:rafael": ("pm_alex", 1.08),
 "ninth-wave:morven": ("bf_isabella", 1.08), "ninth-wave:petra": ("bf_emma", 0.98), "ninth-wave:callum": ("bm_george", 0.94),
 "milk-run:sinead": ("bf_isabella", 1.06), "milk-run:davy": ("am_puck", 1.14), "milk-run:gerry": ("bm_george", 0.96),
 "bunker:stavros": ("am_fenrir", 0.98), "bunker:liza": ("af_heart", 1.08), "bunker:panos": ("bm_fable", 1.10)
}

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    cdir = os.path.join(root, "cases")
    if not os.path.isdir(cdir):
        print("Run this from inside the detective folder."); sys.exit(1)

    missing = [i for i in NEW_IDS if not os.path.exists(os.path.join(cdir, i + ".js"))]
    if missing:
        print("  ! not in cases/ yet: " + ", ".join(missing))
        print("    move the downloaded case files into cases/ first."); sys.exit(1)

    ip = os.path.join(cdir, "index.js")
    s = open(ip, encoding="utf-8").read()
    added = [i for i in NEW_IDS if f'./{i}.js' not in s]
    if added:
        anchor = '  require("./airside.js")'
        if anchor not in s:
            print("  ! couldn't find where to add them in cases/index.js"); sys.exit(1)
        s = s.replace(anchor, anchor + ",\n" + ",\n".join(f'  require("./{i}.js")' for i in added), 1)
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
            lines = "".join(f'  "{k}":{" " * max(1, 32 - len(k))}{{ voice: "{v[0]}", speed: {v[1]} }},\n' for k, v in new.items())
            s = s.replace('const CAST = {\n', 'const CAST = {\n' + lines, 1)
            open(lv, "w", encoding="utf-8").write(s)
            print(f"  ✔ lib-voice.js — {len(new)} suspects cast")
        else:
            print("  = lib-voice.js already cast them")

    print("\nRestart the server. Run `npm run images` when you want the new portraits.\n")

if __name__ == "__main__":
    main()
