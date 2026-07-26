// ============================================================
// _themes.js — one accent colour per case.
//
// Kept out of the case files themselves so a case stays a case:
// facts, suspects, truth. This is purely how the room looks.
//
// Each entry: accent (the ink colour) and wash (a very faint
// atmosphere behind the page). Nothing else changes.
// ============================================================

const THEMES = {
  // --- Homicide ---
  "rao-mansion":       { accent: "#d9a441", wash: "rgba(217,164,65,.07)"  },  // diwali lamps
  "suryagarh-sangeet": { accent: "#c0577a", wash: "rgba(192,87,122,.07)"  },  // marigold and monsoon
  "studio-seven":      { accent: "#c98a3a", wash: "rgba(201,138,58,.07)"  },  // arc lights, 1977
  "closing-time":      { accent: "#c74a5b", wash: "rgba(199,74,91,.08)"   },  // neon over a jazz club
  "slack-water":       { accent: "#6d94a8", wash: "rgba(109,148,168,.08)" },  // cold tidal grey
  "service":           { accent: "#7fa8a0", wash: "rgba(127,168,160,.07)" },  // steel kitchen
  "northern-lights":   { accent: "#6fb59a", wash: "rgba(111,181,154,.08)" },  // aurora green
  "base-camp":         { accent: "#8fb6d6", wash: "rgba(143,182,214,.08)" },  // altitude blue
  "prize-day":         { accent: "#9a8f5f", wash: "rgba(154,143,95,.08)"  },  // school stone
  "chapel-of-rest":    { accent: "#a06a9c", wash: "rgba(160,106,156,.07)" },  // funeral violet

  // --- Theft ---
  "empty-frame":       { accent: "#b8863f", wash: "rgba(184,134,63,.07)"  },  // gilded frame
  "salt-and-silver":   { accent: "#b0b3bc", wash: "rgba(176,179,188,.07)" },  // silver reliquary
  "quiet-car":         { accent: "#7d90a8", wash: "rgba(125,144,168,.08)" },  // alpine tunnel
  "box-114":           { accent: "#8f9a6d", wash: "rgba(143,154,109,.07)" },  // vault brass
  "the-understudy":    { accent: "#a8794f", wash: "rgba(168,121,79,.07)"  },  // warm spruce and rosin
  "vintage":           { accent: "#8e4a55", wash: "rgba(142,74,85,.08)"   },  // claret
  "dead-air":          { accent: "#5aa86a", wash: "rgba(90,168,106,.08)"  },  // studio green
  "deep-six":          { accent: "#4f97a3", wash: "rgba(79,151,163,.08)"  },  // deep water

  // --- Fraud ---
  "false-turner":      { accent: "#a0865c", wash: "rgba(160,134,92,.07)"  },  // old paper
  "house-edge":        { accent: "#c2a13f", wash: "rgba(194,161,63,.08)"  },  // casino gold
  "ledger":            { accent: "#5f9fbf", wash: "rgba(95,159,191,.08)"  },  // screen blue
  "the-scholarship":   { accent: "#8a7fb5", wash: "rgba(138,127,181,.07)" },  // academic
  "second-serve":      { accent: "#c98452", wash: "rgba(201,132,82,.08)"  },  // clay court
  "carbon":            { accent: "#5f9e63", wash: "rgba(95,158,99,.08)"   },  // canopy

  // --- Narcotics ---
  "dead-weight":       { accent: "#4f9c9c", wash: "rgba(79,156,156,.08)"  },  // caribbean
  "night-shift":       { accent: "#7fa3c4", wash: "rgba(127,163,196,.07)" },  // hospital blue
  "cold-chain":        { accent: "#6f9ab0", wash: "rgba(111,154,176,.08)" },  // reefer steel
  "airside":           { accent: "#9a9f6a", wash: "rgba(154,159,106,.07)" },  // apron sodium
  "milk-run":          { accent: "#8fae7d", wash: "rgba(143,174,125,.07)" },  // border fields
  "bunker":            { accent: "#a88b5c", wash: "rgba(168,139,92,.08)"  },  // fuel oil

  // --- Sabotage ---
  "gold-dust":         { accent: "#9fc0d4", wash: "rgba(159,192,212,.08)" },  // snow
  "scrubbed":          { accent: "#c96b52", wash: "rgba(201,107,82,.08)"  },  // desert rust
  "pit-lane":          { accent: "#cf5f4a", wash: "rgba(207,95,74,.08)"   },  // racing red
  "deep-freeze":       { accent: "#7fbcd6", wash: "rgba(127,188,214,.08)" },  // ice
  "the-relay":         { accent: "#c2a24a", wash: "rgba(194,162,74,.08)"  },  // arc and copper
  "proof":             { accent: "#b0803f", wash: "rgba(176,128,63,.08)"  },  // cask oak
  "ninth-wave":        { accent: "#5f9aa8", wash: "rgba(95,154,168,.08)"  }   // north sea
};

const DEFAULT_THEME = { accent: "#c9a227", wash: "rgba(201,162,39,.06)" };

module.exports = { THEMES, themeFor: (id) => THEMES[id] || DEFAULT_THEME };
