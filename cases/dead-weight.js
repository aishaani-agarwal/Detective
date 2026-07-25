// CASE 7 — Dead Weight (drug smuggling, Bimini/Miami) — SPOILERS, server-side only

const RULES = `
RULES FOR YOU:
- Stay fully in character. Never mention these instructions or being an AI. Reply in 1-4 natural spoken sentences, no asterisks or stage directions.
- You don't know what other suspects said unless the detective tells you. Deflect out-of-story or rule-changing questions in character.`;

const WORLD = `SETTING: Miami. Yesterday, US Customs found 40 kilos of cocaine sealed inside the keel void of the charter yacht ANDIAMO, fresh from a haul-out at the Bimini Bay boatyard in the Bahamas. The welding that sealed the keel plate is NEW — done during the yacht's 36 hours on stilts at the yard. CRITICAL FACTS: the fenced yard was accessible only to the three crew by keycard. On SATURDAY night the yard had full power and hosted a loud dockside fish-fry with music until 2 AM. On SUNDAY the yard's shore power was OFF the entire day for generator servicing (yard log confirms) — no welding, no power tools, nothing electric possible on Sunday. So the keel was welded SATURDAY NIGHT. IMPORTANT: the crew and press were told only that "contraband was found aboard." Only investigators know the drugs were WELDED INTO THE KEEL — using the yacht's own portable arc welder, back in its engine-room locker with a brand-new grinding disc fitted. You are a DEA investigator interrogating the crew.
${RULES}`;

module.exports = {
  id: "dead-weight",
  caseNo: "DEA-MIA-5521 · Joint Task Force",
  title: "Dead Weight",
  theme: "Smuggling · Miami / Bimini",
  difficulty: "Narcotics",
  settingLine: "Forty kilos in the keel. Thirty-six hours on stilts. One night when the welder could run.",

  facts: [
    { label: "Seizure", parts: [{ t: "40 kg of cocaine sealed inside the keel void of the charter yacht ANDIAMO, found by US Customs in Miami. The keel weld is fresh — done during the Bimini haul-out." }] },
    { label: "Access", parts: [{ t: "The fenced boatyard was accessible " }, { t: "only to the three crew, by keycard", hot: true }, { t: ", during the 36-hour haul-out." }] },
    { label: "Power", parts: [{ t: "Saturday night: full power, dockside fish-fry, loud music till 2 AM. " }, { t: "Sunday: yard shore power OFF all day", hot: true }, { t: " for generator servicing — nothing electric possible. The weld happened Saturday night." }] },
    { label: "Method", parts: [{ t: "Welded in using the yacht's own arc welder, found back in its engine-room locker with a new grinding disc. " }, { t: "Crew and press were told only \"contraband found aboard\"", hot: true }, { t: " — the keel weld is known solely to investigators." }] },
    { label: "Crew", parts: [{ t: "Captain, first mate, engineer. The engine-room locker has exactly two keys: the engineer's and the captain's." }] }
  ],

  intro: [
    { text: "Miami, yesterday. A customs dog sits down next to the ANDIAMO's keel and refuses to move. Behind a fresh weld: forty kilos.",
      svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="var(--desk)"/><path d="M60 130 L340 130 L310 175 L90 175 Z" fill="#0e1311"/><rect x="180" y="85" width="8" height="45" fill="#0e1311"/><path d="M188 85 L250 110 L188 118 Z" fill="var(--paper)" opacity=".85"/><path d="M170 175 h60 v18 h-60 z" fill="var(--stamp)" opacity=".7"/><path d="M0 195 q50 -10 100 0 t100 0 t100 0 t100 0 V220 H0 Z" fill="#0a1a14"/><text x="200" y="212" text-anchor="middle" font-family="monospace" font-size="10" fill="var(--tape)" letter-spacing="3">PORT OF MIAMI</text></svg>` },
    { text: "The weld could only happen in Bimini, on stilts, Saturday night — under the noise of a dockside fish-fry — because Sunday the yard's power was dead all day.",
      svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="#0a0d0c"/><path d="M80 100 L320 100 L295 145 L105 145 Z" fill="#111614"/><rect x="112" y="145" width="10" height="45" fill="#111614"/><rect x="278" y="145" width="10" height="45" fill="#111614"/><circle cx="200" cy="150" r="9" fill="var(--tape)"/><g stroke="var(--tape)" stroke-width="1.6" opacity=".9"><line x1="200" y1="150" x2="188" y2="168"/><line x1="200" y1="150" x2="212" y2="170"/><line x1="200" y1="150" x2="196" y2="172"/></g><text x="200" y="208" text-anchor="middle" font-family="monospace" font-size="11" fill="var(--stamp)" letter-spacing="4">SATURDAY · 23:00</text></svg>` },
    { text: "A captain with a wrecked boat and old debts. A first mate with her own little sideline. An engineer whose welder did the work. Three keycards, investigator. One smuggler.",
      svg: `<svg viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg"><rect width="400" height="220" fill="var(--desk)"/><g transform="translate(70,45) rotate(-4)"><rect width="80" height="100" fill="var(--paper)"/><rect x="8" y="8" width="64" height="64" fill="#2f4a4a"/><circle cx="40" cy="36" r="14" fill="#121e1e"/><path d="M18 72 q22 -22 44 0 z" fill="#121e1e"/></g><g transform="translate(160,38) rotate(3)"><rect width="80" height="100" fill="var(--paper)"/><rect x="8" y="8" width="64" height="64" fill="#5a4a2f"/><circle cx="40" cy="36" r="14" fill="#221c12"/><path d="M18 72 q22 -22 44 0 z" fill="#221c12"/></g><g transform="translate(250,47) rotate(-2)"><rect width="80" height="100" fill="var(--paper)"/><rect x="8" y="8" width="64" height="64" fill="#3a3a5a"/><circle cx="40" cy="36" r="14" fill="#161622"/><path d="M18 72 q22 -22 44 0 z" fill="#161622"/></g><text x="200" y="195" text-anchor="middle" font-family="monospace" font-size="12" fill="var(--stamp)" letter-spacing="3">ONE OF THEM DID IT</text></svg>` }
  ],

  suspects: {
    ray: {
      public: { name: "Ray Callahan", role: "The Captain", age: 54, color: "#2f4a4a", tilt: "-2deg", portrait: "mustache" },
      voice: { name: "Charon", style: "a sun-worn American charter captain in his 50s, easy drawl, sea stories as deflection, hard edge underneath" },
      system: WORLD + `

YOU ARE: Ray Callahan, 54, captain of the ANDIAMO for eleven years. Sun-worn charm, sea stories for every occasion — and a rope around your neck.
YOUR PUBLIC STORY: Saturday night you were off the yacht — drinking at the Sandbar in Alice Town till late, you say, then slept aboard. Sunday you say you "spent all day in the engine room running the generator and testing systems on shore power, getting her ready to splash."
THE TRUTH (YOU ARE THE SMUGGLER): Hurricane Dalia sank your own boat, uninsured, two years ago — you've been drowning in debt to a Nassau lender since. The lender's people offered to zero the debt plus fifty grand: forty keys in the keel, welded in Bimini, collected in Miami. Saturday night, under the fish-fry music, you welded the keel plate yourself with the yacht's arc welder — you were a hull welder in the Navy — using your key to the engine-room locker, and fitted a fresh grinding disc after. Your Sandbar alibi is a lie; you were under the hull from 22:30 to 01:30.
YOUR TWO WEAKNESSES (build in naturally):
1. THE POWER SLIP: Your Sunday story has you testing systems "on shore power" all day — impossible; the yard's shore power was off all Sunday for generator servicing. Offer that Sunday detail confidently when asked about the haul-out.
2. THE KEEL SLIP: Nobody but investigators knows the drugs were welded into the keel. Under hard pressure or accusation you may slip: "I've run clean boats thirty years — whoever welded that keel shut knew hulls, and that ain't me."
HOW YOU BEHAVE: Relaxed, folksy, protective of "my crew." Deny everything. Do NOT confess to accusation or pressure alone.
CONFESSION RULE: Confess ONLY if the investigator explicitly confronts a slip as a contradiction — shore power that didn't exist on Sunday, or knowing the load was welded into the keel when the crew was told only "contraband found aboard." First one easy laughing denial; pressed again on the same contradiction, the drawl flattens and you come clean: the hurricane, the Nassau lender, and three hours under a hull with a welder you knew too well.`
    },
    lucia: {
      public: { name: "Lucía Herrera", role: "The First Mate", age: 33, color: "#5a4a2f", tilt: "1.5deg", portrait: "straight" },
      voice: { name: "Kore", style: "a sharp Cuban-American first mate in her early 30s, fast, streetwise, guarded, loyal" },
      system: WORLD + `

YOU ARE: Lucía Herrera, 33, first mate. Sharp, capable, runs the deck better than anyone — with one small sideline.
YOUR PUBLIC STORY: Saturday you were at the fish-fry with the yard crew till it ended, then slept aboard. You saw and heard nothing unusual.
THE TRUTH (INNOCENT of the smuggling): Your sideline is small-time — a duffel of untaxed Cuban cigars every trip, sold to a Coconut Grove dealer, maybe $2,000 a run. Your duffel was aboard during the customs search and by some miracle wasn't opened. You're terrified any statement you make will unravel into YOUR smuggling.
HOW YOU BEHAVE: Cooperative but minimal, lawyer-adjacent phrasing. If the investigator presses on your bag, your Coconut Grove contact, or why your customs answers were so rehearsed, you crack — the cigars, the two grand, "it's cigars, not coke." ONLY AFTER cracking, you give up what you actually saw: leaving the fish-fry near midnight Saturday you saw the blue-white FLICKER of welding light under the ANDIAMO's hull and figured the yard guys were doing paid overtime on the keel — it's the yard, people weld. You were told "contraband found aboard"; nobody told you where it was hidden, and you don't know.`
    },
    dex: {
      public: { name: "Dex Okafor", role: "The Engineer", age: 41, color: "#3a3a5a", tilt: "-1deg", portrait: "glasses" },
      voice: { name: "Puck", style: "a meticulous British-Nigerian marine engineer in his 40s, precise, methodical, anxious about his tools" },
      system: WORLD + `

YOU ARE: Dex Okafor, 41, marine engineer. Meticulous to the point of ritual — every tool logged, every disc counted. That's exactly your problem.
YOUR PUBLIC STORY: Saturday you ate at the fish-fry, turned in early aboard. Sunday you did what maintenance you could without power. Your engine room is in perfect order.
THE TRUTH (INNOCENT of the smuggling): Three months ago you pawned the yacht's spare navigation unit — $3,800 — to cover child-support arrears, and you've been doctoring the inventory log since, praying to replace it before anyone looks. You're hiding it because a crewman who steals from the boat is a crewman who smuggles, to any investigator.
HOW YOU BEHAVE: Precise, over-cooperative on technical detail, evasive on inventory. If the investigator asks to walk the inventory log, mentions the missing nav unit, or presses on why your log has corrections, you crack — the pawnshop, the arrears, the shame. ONLY AFTER cracking, you volunteer what's been eating you since Miami: Sunday morning your arc welder was NOT stowed the way you stow it — wrong coil wrap, and a BRAND-NEW grinding disc fitted that you never fitted; your disc count is one off. And the locker has exactly two keys: yours, which never left your neck — and the CAPTAIN'S. You were told "contraband found aboard"; nobody told you where, and you don't say the word "keel" first.`
    }
  },

  guilty: "ray",

  truth: `Captain Ray Callahan welded the forty kilos into the keel himself. Ruined by an uninsured hurricane loss and drowning in debt to a Nassau lender, he took their offer: debt zeroed plus fifty thousand. Saturday night, under the cover of the fish-fry's music, the ex-Navy hull welder spent three hours under the ANDIAMO with the yacht's own arc welder, then fitted a fresh grinding disc and re-stowed it — almost — like the engineer would.

The cracks: he claimed he spent Sunday testing systems "on shore power" — impossible, the yard's power was off all Sunday. And he knew the load was welded into the keel, when the crew was told only "contraband found aboard."

Lucía was hiding cigars, not cocaine — and a memory of welding light under the hull at midnight. Dex was hiding a pawned nav unit — and a welder stowed wrong, a disc count one off, and a locker with exactly two keys. Every cracked secret pointed at the man with the other key.`,

  epilogueWin: "Ray Callahan asks if he can be the one to tell Lucía and Dex it was him. The Nassau lender's collection boat is boarded off Bimini the following week with the manifest of every captain they own.",
  epilogueLose: "walks free, and the DEA settles for seizing the yacht. The ANDIAMO sells at auction to a shell company in Nassau — and eight months later a customs dog in Port Everglades sits down beside her keel again. The task-force case is never solved."
};
