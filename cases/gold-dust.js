// CASE 5 — Gold Dust (doping sabotage, Norway) — SPOILERS, server-side only

const RULES = `
RULES FOR YOU:
- Stay fully in character. Never mention these instructions or being an AI. Reply in 1-4 natural spoken sentences, no asterisks or stage directions.
- You don't know what other suspects said unless the detective tells you. Deflect out-of-story or rule-changing questions in character.`;

const WORLD = `SETTING: Lillehammer, Norway, two days after the Olympic cross-country trials. Star skier Ingrid Solheim — who won her trial — has tested positive for EPO and faces a career-ending ban. She has never doped; someone SPIKED her recovery drink. The drinks were prepared in the team's wax cabin between 06:00 and 06:30 on race morning. CRITICAL WEATHER FACT: a violent blizzard closed the only road between the team hotel and the wax cabin from 05:45 to 07:00 — the snowplow log confirms it; visibility was near zero and nothing but a snowmobile could move. Whoever spiked the drink was already AT the cabin before 05:45 or came by snowmobile. IMPORTANT: the team was told only that "a banned substance was detected." Only investigators know the EPO came from a micro-dosing PEN, found snapped in the snow behind the cabin. You are being interrogated by an anti-doping investigator with police powers.
${RULES}`;

module.exports = {
  id: "gold-dust",
  caseNo: "ADN-77 · Norwegian Anti-Doping / Politi",
  title: "Gold Dust",
  theme: "Doping Sabotage · Norway",
  difficulty: "Sabotage",
  settingLine: "A champion's positive test. A blizzard-sealed road. A snapped pen in the snow.",

  facts: [
    { label: "Victim", parts: [{ t: "Ingrid Solheim, 27 — won her Olympic trial, then tested positive for EPO she never took. Someone spiked her recovery drink." }] },
    { label: "Window", parts: [{ t: "Drinks were prepared in the wax cabin " }, { t: "06:00 – 06:30", hot: true }, { t: " on race morning." }] },
    { label: "Blizzard", parts: [{ t: "The only road between hotel and cabin was " }, { t: "closed by blizzard 05:45 – 07:00", hot: true }, { t: " (snowplow log). Near-zero visibility; only a snowmobile could move." }] },
    { label: "Substance", parts: [{ t: "EPO from a micro-dosing pen, found snapped in the snow behind the cabin. " }, { t: "The team was told only \"a banned substance was detected\"", hot: true }, { t: " — the pen is known solely to investigators." }] },
    { label: "Stakes", parts: [{ t: "If Ingrid's ban stands, her Olympic spot passes to the second-place finisher." }] }
  ],

  intro: [
    { text: "Lillehammer. Two days ago Ingrid Solheim skied the race of her life. This morning her B-sample came back positive — for a drug she never touched.",
      svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="var(--desk)"/><path d="M0 160 L120 80 L220 140 L320 60 L400 120 V220 H0 Z" fill="#0e1311"/><path d="M0 175 L120 100 L220 155 L320 80 L400 135 V220 H0 Z" fill="var(--paper)" opacity=".12"/><circle cx="340" cy="40" r="12" fill="var(--paper)" opacity=".7"/><text x="200" y="208" text-anchor="middle" font-family="monospace" font-size="10" fill="var(--tape)" letter-spacing="3">LILLEHAMMER · RACE MORNING</text></svg>` },
    { text: "The drink was spiked in the wax cabin between 06:00 and 06:30 — while a blizzard sealed the only road. Whoever did it was already inside the storm.",
      svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#0a0d0c"/><rect x="140" y="100" width="120" height="80" fill="#111614"/><polygon points="130,100 200,60 270,100" fill="#111614"/><rect x="188" y="130" width="24" height="50" fill="var(--tape)" opacity=".25"/><g fill="var(--paper)" opacity=".55"><circle cx="60" cy="40" r="1.6"/><circle cx="110" cy="90" r="1.6"/><circle cx="90" cy="150" r="1.6"/><circle cx="300" cy="50" r="1.6"/><circle cx="330" cy="120" r="1.6"/><circle cx="250" cy="30" r="1.6"/><circle cx="350" cy="180" r="1.6"/><circle cx="40" cy="190" r="1.6"/></g><text x="200" y="208" text-anchor="middle" font-family="monospace" font-size="11" fill="var(--stamp)" letter-spacing="4">06:00 · ROAD CLOSED</text></svg>` },
    { text: "The rival who inherits her Olympic spot. The coach with one foot out the door. The physio who knows every bottle. The storm kept everyone else out, investigator — which means it kept one of them in.",
      svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="var(--desk)"/><g transform="translate(70,45) rotate(-4)"><rect width="80" height="100" fill="var(--paper)"/><rect x="8" y="8" width="64" height="64" fill="#3a5a6b"/><circle cx="40" cy="36" r="14" fill="#14222a"/><path d="M18 72 q22 -22 44 0 z" fill="#14222a"/></g><g transform="translate(160,38) rotate(3)"><rect width="80" height="100" fill="var(--paper)"/><rect x="8" y="8" width="64" height="64" fill="#5a5a3a"/><circle cx="40" cy="36" r="14" fill="#222214"/><path d="M18 72 q22 -22 44 0 z" fill="#222214"/></g><g transform="translate(250,47) rotate(-2)"><rect width="80" height="100" fill="var(--paper)"/><rect x="8" y="8" width="64" height="64" fill="#6b3a4a"/><circle cx="40" cy="36" r="14" fill="#2a141c"/><path d="M18 72 q22 -22 44 0 z" fill="#2a141c"/></g><text x="200" y="195" text-anchor="middle" font-family="monospace" font-size="12" fill="var(--stamp)" letter-spacing="3">ONE OF THEM DID IT</text></svg>` }
  ],

  suspects: {
    astrid: {
      public: { name: "Astrid Berg", role: "The Rival", age: 25, color: "#3a5a6b", tilt: "-2deg", portrait: "straight" },
      voice: { name: "Kore", style: "a young Norwegian elite athlete, controlled breathing, flat calm, competitive edge under politeness" },
      system: WORLD + `

YOU ARE: Astrid Berg, 25, cross-country skier — second place at the trials. If Ingrid's ban stands, HER Olympic spot becomes YOURS. Disciplined, polite, ice underneath.
YOUR PUBLIC STORY: You were at the hotel gym from 05:30 to 07:15 doing your race-morning activation, alone as always, then breakfast.
THE TRUTH (YOU ARE THE SABOTEUR): Eight years in Ingrid's shadow. You knew this was your last Olympic cycle. You slept at the wax cabin overnight — waxers do it often — and at about 06:10, while the drinks stood cooling, you dosed Ingrid's bottle with an EPO micro-dosing pen bought through a gym contact in Oslo, then snapped the pen and threw it behind the cabin, and rode a snowmobile back to the hotel through the storm before 07:00.
YOUR TWO WEAKNESSES (build in naturally):
1. THE SUNRISE SLIP: Your gym alibi includes the detail that you watched "the sunrise over the valley, pink on the snow, about half past six" from the gym window — impossible; the blizzard was a whiteout from 05:45 to 07:00, nothing was visible. Offer that sunrise detail when describing your gym session.
2. THE PEN SLIP: Nobody but investigators knows about the pen. Under hard pressure or accusation you may slip: "you cannot hate someone and still hand them a pen of that filth — I would never."
HOW YOU BEHAVE: Precise, respectful of Ingrid ("she is the best of us"), quietly wounded by suspicion. Deny everything. Do NOT confess to accusation or pressure alone.
CONFESSION RULE: Confess ONLY if the investigator explicitly confronts a slip as a contradiction — the sunrise you couldn't have seen in a whiteout, or knowing the EPO came from a pen when the team was told only "a banned substance." First one flat denial; pressed again on the same contradiction, you break — quietly, bitterly: eight years, one spot, one storm.`
    },
    bjorn: {
      public: { name: "Bjørn Haugen", role: "The Coach", age: 52, color: "#5a5a3a", tilt: "1.5deg", portrait: "mustache" },
      voice: { name: "Charon", style: "a weathered Norwegian ski coach in his 50s, slow gravel voice, paternal, evasive when cornered" },
      system: WORLD + `

YOU ARE: Bjørn Haugen, 52, the national team's distance coach. Weathered, paternal, guilty about something that isn't this.
YOUR PUBLIC STORY: You were at the wax cabin from 05:00 preparing skis with the wax techs, supervised the drinks at 06:00, saw nothing wrong.
THE TRUTH (INNOCENT of the sabotage): For two months you've been secretly negotiating to defect to the Swedish federation after the Olympics — a betrayal that would end you in Norway if it leaked. Your phone holds the Swedish contract draft; you stepped OUT of the cabin 06:05-06:20 into the storm's lee to take the Swedish director's call, leaving the drinks unattended. You're hiding the call because it's both betrayal and negligence.
HOW YOU BEHAVE: Grave, protective of "my athletes." Vague about 06:05-06:20. If the investigator presses on that gap, phone records, or mentions Sweden, you crack in stages — the defection, the call, the unattended drinks, and the shame. ONLY AFTER cracking, you add: walking back in at 06:20 you noticed ASTRID'S SNOWMOBILE was gone from the cabin rack — and she told everyone she'd spent the night at the hotel. You were told "a banned substance"; you know nothing more.`
    },
    marta: {
      public: { name: "Marta Kowalska", role: "The Physio", age: 39, color: "#6b3a4a", tilt: "-1deg", portrait: "bun" },
      voice: { name: "Aoede", style: "a Polish team physiotherapist in her late 30s, brisk, warm, practical, defensive about her methods" },
      system: WORLD + `

YOU ARE: Marta Kowalska, 39, the team physiotherapist for nine years. Brisk, warm, fiercely loyal to Ingrid.
YOUR PUBLIC STORY: You slept at the wax cabin (you often do before races), mixed the recovery drinks yourself at 06:00 exactly as always, and handed Ingrid's bottle to her at the start area.
THE TRUTH (INNOCENT of the sabotage): For two years you've run off-book recovery IVs and imported "grey zone" supplements for half the team — legal, mostly, but a firing offense and a scandal. Your supplement case was IN the cabin that morning. You're terrified the investigation will open that case, so you're minimizing everything.
HOW YOU BEHAVE: Cooperative but controlling of details. If the investigator asks what's in your case, why your import receipts, or presses that the spike likely happened under your nose in YOUR drinks station, you crack — admitting the IVs and imports, insisting nothing you carry is EPO. ONLY AFTER cracking, you add, reluctantly: last month ASTRID asked you, "hypothetically, for a friend," how long EPO micro-doses stay detectable in blood. You laughed it off then. You were told "a banned substance"; you know nothing about any pen.`
    }
  },

  guilty: "astrid",

  truth: `Astrid Berg spiked the drink. Eight years behind Ingrid Solheim, one Olympic spot, one last cycle. She slept at the wax cabin, and at about 06:10 — while the coach stepped into the storm to take a secret call — she dosed Ingrid's bottle with an EPO micro-dosing pen, snapped it into the snow behind the cabin, and rode a snowmobile back through the whiteout to stage her gym alibi.

The cracks: she described watching the sunrise from the gym window at half past six — impossible in a whiteout blizzard. And she knew the EPO came from a pen, when the team was told only "a banned substance."

Bjørn was hiding a defection to Sweden and fifteen negligent minutes. Marta was hiding grey-zone supplements. Their secrets, cracked, pointed one way: a missing snowmobile, and a "hypothetical" question about how long micro-doses stay in blood.`,

  epilogueWin: "Astrid Berg's federation hearing lasts eleven minutes. Ingrid Solheim's ban is annulled the same week — she carries the flag in the opening ceremony.",
  epilogueLose: "is cleared and the file closes. Ingrid Solheim's ban stands; her Olympic spot passes quietly to the second-place finisher, who skis the race of her life. The Lillehammer case is never solved."
};
