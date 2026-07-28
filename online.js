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

  function configured() {
    return !!(window.SUPA_URL && window.SUPA_KEY && window.supabase);
  }

  function client() {
    if (sb) return sb;
    if (!configured()) return null;
    try {
      sb = window.supabase.createClient(window.SUPA_URL, window.SUPA_KEY, {
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
        if (!settled) { settled = true; reject(new Error("Couldn't reach the room. Check your connection.")); }
      }, 9000);

      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED" && !settled) {
          settled = true; clearTimeout(timer);
          connected = true;
          try { await channel.track(me); } catch (e) {}
          resolve({ code, me });
        } else if ((status === "CHANNEL_ERROR" || status === "TIMED_OUT") && !settled) {
          settled = true; clearTimeout(timer);
          reject(new Error("The room wouldn't open. Try again in a moment."));
        }
      });
    });
  }

  async function createRoom(caseId) {
    const c = makeCode();
    return connect(c, true, caseId);
  }

  async function joinRoom(roomCode) {
    const res = await connect(roomCode, false, null);
    // the host's presence carries which case the room is working
    for (let i = 0; i < 12; i++) {
      const h = hostOf();
      if (h && h.caseId) return Object.assign(res, { caseId: h.caseId });
      await new Promise(r => setTimeout(r, 250));
    }
    throw new Error("Found the room, but nobody's opened a case in it yet.");
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

  return {
    available: configured,
    createRoom, joinRoom, leave, send, on,
    roster, hostOf,
    isOn: () => connected,
    isHost: () => !!(me && me.host),
    myId: () => me && me.id,
    myName: () => me && me.name,
    code: () => code
  };
})();
