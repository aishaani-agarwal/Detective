// ============================================================
// online.js — two to four detectives, different laptops, one case.
//
// HOW IT WORKS
// Netlify functions forget you the moment they answer, so they can't hold a
// shared room. Supabase gives us a live channel instead: everyone in a room
// subscribes to the same channel name and anything one person does is
// broadcast to the rest. No database tables, no logins — just the channel.
//
// WHO PAYS FOR THE AI
// Whoever asks a question makes the API call and then broadcasts the answer,
// so a room of four costs the same as one player, and nobody's browser
// answers the same question twice.
//
// IF ANYTHING IS MISSING
// No config file, no internet, Supabase down — every function here turns into
// a no-op and the game stays exactly as it was on your own. Solo play must
// never break because multiplayer is unavailable.
// ============================================================

window.ONLINE = (function () {
  const CODE_CHARS = "ACDEFHJKLMNPRTVWXY3479";   // no O/0, no I/1
  let sb = null;          // supabase client
  let channel = null;     // the room
  let code = null;        // room code
  let me = null;          // { id, name, badge, host }
  let handlers = {};      // event -> [fn]
  let connected = false;
  let lastError = null;

  function configured() {
    return !!(window.SUPA_URL && window.SUPA_KEY && window.supabase);
  }

  // People copy the REST URL ("…supabase.co/rest/v1") from the dashboard far more
  // often than the plain project URL. Realtime needs the bare host, so trim it.
  function projectUrl() {
    return String(window.SUPA_URL || "")
      .trim()
      .replace(/\/+$/, "")
      .replace(/\/rest\/v1$/i, "")
      .replace(/\/auth\/v1$/i, "")
      .replace(/\/realtime\/v1$/i, "");
  }

  function client() {
    if (sb) return sb;
    if (!configured()) return null;
    try {
      sb = window.supabase.createClient(projectUrl(), window.SUPA_KEY, {
        realtime: { params: { eventsPerSecond: 20 } }
      });
    } catch (e) { sb = null; }
    return sb;
  }

  function makeCode() {
    let out = "";
    for (let i = 0; i < 4; i++) out += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    return out;
  }

  function on(event, fn) {
    (handlers[event] = handlers[event] || []).push(fn);
  }
  function emit(event, payload) {
    (handlers[event] || []).forEach(fn => { try { fn(payload); } catch (e) {} });
  }

  // everyone currently in the room, from Supabase presence
  function roster() {
    if (!channel) return [];
    let state = {};
    try { state = channel.presenceState() || {}; } catch (e) { return []; }
    const out = [];
    for (const key of Object.keys(state)) {
      const entry = (state[key] || [])[0];
      if (entry) out.push(entry);
    }
    return out.sort((a, b) => (a.joined || 0) - (b.joined || 0));
  }

  function hostOf() { return roster().find(p => p.host) || null; }

  // ---- join a channel and start listening ----
  function connect(roomCode, asHost, caseId) {
    return new Promise((resolve, reject) => {
      const c = client();
      if (!c) return reject(new Error("Online play isn't set up on this copy."));

      code = String(roomCode).toUpperCase();
      me = {
        id: Math.random().toString(36).slice(2, 10),
        name: (window.DETECTIVE && DETECTIVE.name) || "Detective",
        badge: (window.DETECTIVE && DETECTIVE.badge) || "",
        host: !!asHost,
        caseId: caseId || null,
        joined: Date.now()
      };

      channel = c.channel("room:" + code, { config: { presence: { key: me.id } } });

      // anything anyone does arrives here
      ["ask", "reply", "pin", "unpin", "select", "busy", "idle", "vote", "verdict", "case", "left"]
        .forEach(ev => channel.on("broadcast", { event: ev }, ({ payload }) => {
          if (payload && payload.from === me.id) return;   // don't echo yourself
          emit(ev, payload);
        }));

      channel.on("presence", { event: "sync" }, () => emit("roster", roster()));
      channel.on("presence", { event: "join" }, () => emit("roster", roster()));
      channel.on("presence", { event: "leave" }, () => emit("roster", roster()));

      let settled = false;
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          lastError = "timed out after 20s — the websocket never opened";
          console.warn("[online] " + lastError, { url: window.SUPA_URL });
          reject(new Error("Timed out reaching Supabase. Open the console for details."));
        }
      }, 20000);

      channel.subscribe(async (status, err) => {
        console.log("[online] channel status:", status, err || "");
        if (status === "SUBSCRIBED" && !settled) {
          settled = true; clearTimeout(timer);
          connected = true;
          try { await channel.track(me); } catch (e) { console.warn("[online] presence track failed", e); }
          resolve({ code, me });
        } else if ((status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") && !settled) {
          settled = true; clearTimeout(timer);
          lastError = status + (err ? (": " + (err.message || err)) : "");
          console.warn("[online] " + lastError);
          reject(new Error(status === "CHANNEL_ERROR"
            ? "Supabase refused the room" + (err && err.message ? (" — " + err.message) : "") + ". Check the console."
            : "The connection closed before the room opened. Check the console."));
        }
      });
    });
  }

  async function createRoom(caseId) {
    const c = makeCode();
    return connect(c, true, caseId || null);
  }

  // the host picks the case after opening the room, so tell everyone when they do
  async function setCase(caseId) {
    if (!channel || !me) return;
    me.caseId = caseId;
    try { await channel.track(me); } catch (e) {}
    send("case", { caseId });
  }

  async function joinRoom(roomCode) {
    const res = await connect(roomCode, false, null);
    // give the host a moment to announce the case; if there isn't one yet,
    // join anyway and wait — the "case" broadcast will pull you in.
    for (let i = 0; i < 8; i++) {
      const host = hostOf();
      if (host && host.caseId) return Object.assign(res, { caseId: host.caseId });
      await new Promise(r => setTimeout(r, 250));
    }
    return Object.assign(res, { caseId: null, waiting: true });
  }

  function send(event, payload) {
    if (!channel || !connected) return;
    try {
      channel.send({ type: "broadcast", event, payload: Object.assign({ from: me.id, by: me.name }, payload || {}) });
    } catch (e) {}
  }

  function leave() {
    try { if (channel) { send("left", {}); channel.unsubscribe(); } } catch (e) {}
    channel = null; connected = false; code = null;
    handlers = {};
  }

  // Run ONLINE.diagnose() in the browser console to see exactly where it breaks.
  async function diagnose() {
    const report = {
      "supabase library loaded": !!window.supabase,
      "SUPA_URL present": !!window.SUPA_URL,
      "SUPA_URL as written": String(window.SUPA_URL || ""),
      "URL used for realtime": projectUrl(),
      "URL is the plain project URL": /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(projectUrl()),
      "you pasted the REST URL (auto-corrected)": /\/rest\/v1/i.test(String(window.SUPA_URL || "")),
      "SUPA_KEY present": !!window.SUPA_KEY,
      "SUPA_KEY length": String(window.SUPA_KEY || "").length,
      "key shape": String(window.SUPA_KEY || "").startsWith("sb_publishable_") ? "publishable (new style) ✔"
                   : String(window.SUPA_KEY || "").split(".").length === 3 ? "anon JWT (old style) ✔"
                   : "unrecognised — is this the right key?",
      "client created": !!client(),
      "last error": lastError
    };
    console.table(report);
    if (client()) {
      try {
        const t = client().channel("diag:" + Math.random().toString(36).slice(2, 7));
        await new Promise((res, rej) => {
          const to = setTimeout(() => rej(new Error("no response in 12s")), 12000);
          t.subscribe((st, e) => {
            console.log("[diagnose] status:", st, e || "");
            if (st === "SUBSCRIBED") { clearTimeout(to); t.unsubscribe(); res(); }
            if (st === "CHANNEL_ERROR" || st === "CLOSED") { clearTimeout(to); rej(e || new Error(st)); }
          });
        });
        console.log("%c[diagnose] realtime works — rooms should open", "color:#3f7a52");
      } catch (e) {
        console.warn("[diagnose] realtime failed:", e.message || e);
        if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(projectUrl()))
          console.warn("[diagnose] your SUPA_URL still isn't the plain project URL — it should look exactly like https://yourproject.supabase.co");
      }
    }
    return report;
  }

  return {
    available: configured,
    diagnose,
    lastError: () => lastError,
    createRoom, joinRoom, setCase, leave, send, on,
    roster, hostOf,
    isOn: () => connected,
    isHost: () => !!(me && me.host),
    myId: () => me && me.id,
    myName: () => me && me.name,
    code: () => code
  };
})();
