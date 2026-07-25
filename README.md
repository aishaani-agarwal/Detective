# 🔎 Detective

**An AI interrogation game.** You get a case file, three suspects, and one arrest warrant. All three suspects are lying about something — but only one of them is the culprit. Your job is to catch them saying something impossible.

Nine cases: a Diwali-night murder in Bangalore, a Vermeer stolen from an Amsterdam gala, a doping sabotage in a Norwegian blizzard, €4.2M won at a Monte Carlo baccarat table, forty kilos welded into a yacht's keel, a forged Turner at a London auction house, and more.

---

## How it plays

Every suspect is played by an LLM working from a private character brief that only the server ever sees. Each brief contains a secret the suspect is hiding, and — for the guilty one — two specific cracks:

1. **A physical impossibility.** Their alibi contains a detail that could not have happened: they describe bright gallery lights during a fifteen-minute emergency blackout, or a sunrise during a whiteout blizzard, or walking through an airlock that was sealed and tagged out.
2. **Knowledge they shouldn't have.** They mention a detail the police never released — that the canvas was *cut* from its frame, that the drug came from a *pen*, that the contaminant *glows under UV*.

The guilty suspect will not confess to pressure, accusation, or bluffing. They confess **only** when the player confronts them with the specific contradiction. The two innocent suspects each guard a non-criminal secret; crack those, and the confessions chain into evidence pointing at the real culprit.

When you're ready, you request an arrest warrant — and you have to **write your reasoning**. An LLM judge that knows the true solution grades your argument:

- **solid / partial** → the warrant is granted, and you live with your accusation
- **invalid** → *WARRANT DENIED*, the case stays open, and the commissioner tells you to bring evidence instead of feelings

---

## Features

- **9 hand-written cases** across murder, art theft, doping sabotage, casino fraud, smuggling, forgery, and industrial sabotage
- **Voice interrogation** — speak your questions out loud; the suspect answers aloud and the mic re-opens automatically for a real back-and-forth
- **Per-character neural voices** with fitting accents — 18 distinct voices cast across 27 suspects, generated locally
- **AI-generated noir portraits and scene art**, produced once and cached
- **Reasoning-graded accusations** via an LLM judge
- **A pinboard notebook** for the statements you don't trust
- **No spoiler leakage** — verified: nothing the browser receives contains the solution

---

## Architecture

```
Browser  ──►  Express server  ──►  AI providers
   │              │
   │              ├── suspect briefs, guilt, truth, confession rules   (server-side only)
   │              ├── /api/interrogate   chat, with fallback chain
   │              ├── /api/verdict       reasoning judge
   │              ├── /api/speak         voice, with fallback chain
   │              └── /api/image         portraits + scenes, cached to disk
   │
   └── receives only: public case facts, suspect names/roles, generated art
```

**The secrets never leave the server.** The browser payload is filtered to public fields, and a check confirms no suspect prompt, guilt flag, or solution text is reachable from the client. You cannot win by opening DevTools.

### Resilience

Free AI tiers fail constantly — different quotas, different limits, sometimes mid-session. The interesting engineering here is what happens when they do:

- **Circuit breakers.** A provider that reports quota exhaustion is benched rather than retried on every request. Bench length is read from the provider's own retry hint, and repeat offences back off exponentially up to 30 minutes.
- **Layered fallbacks.** Chat falls back across three providers; voice across four. Every layer is optional, so no single outage can take the game down.
- **Fail-fast on dead layers.** A voice layer that fails twice is skipped entirely for ten minutes instead of adding latency to every request.
- **Rate-limit awareness.** Requests to shared services are serialized and paced; `429` responses are treated as "wait", parsed for the retry delay, and retried — never as a fatal error.
- **Caching everywhere.** Generated images and every spoken line are written to disk, so repeat content costs nothing.
- **Local inference.** The primary voice engine is an 82M-parameter ONNX TTS model running on the host CPU — unlimited, no key, no rate limit, works offline.
- **Bring-your-own-key.** Players can supply their own free API key, stored only in their browser and sent per request, so quota scales per player instead of per host.

---

## Tech

Node.js · Express · vanilla JS frontend (no framework) · Gemini / Groq APIs · Kokoro-82M ONNX for local TTS · Web Speech API for voice input · Flux for image generation

The frontend is a single hand-written HTML file: a noir design system built from paper textures, typewriter type, tape, tilted polaroids, a rubber CONFIDENTIAL stamp, and a filing-cabinet drawer you pull cases out of.

---

## Running it

```bash
npm install
cp .env.example .env      # add your keys
npm run voice-setup       # one-time: downloads the local voice model, auditions all 27 suspects
npm start                 # http://localhost:3000
```

Optional: `npm run images` pre-generates all portraits and scene art.

All keys are optional — the game degrades gracefully rather than breaking. Keys go in `.env`, which is gitignored and never reaches the browser.

---

## Design notes

The hardest part of this project wasn't calling an LLM. It was making a suspect who lies *consistently*, holds a secret under pressure, and breaks only for the right reason — and then making sure the game still works when the model behind them stops answering.

---

Built by [Aishaani Agarwal](https://github.com/aishaani-agarwal).