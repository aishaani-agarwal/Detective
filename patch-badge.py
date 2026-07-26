#!/usr/bin/env python3
"""
patch-badge.py — detective's name + badge number.

WHAT CHANGES
1. First visit (or after clearing the badge): a card at the desk asks for
   your name, then issues a 5-character badge number (e.g. #A7K2M).
   Saved in the browser — return visits show a one-click "Confirm & enter"
   card instead of retyping.
2. Your name + badge show in the corner of both screens, next to the
   CONFIDENTIAL stamp.
3. Your name travels with every /api/interrogate call. The server checks it
   against a strict name-shape pattern (never trusted verbatim) and, if it
   passes, tells the suspect once — so they can address you as
   "Detective <name>" naturally, not on every line.

Touches server.js and public/index.html. Does not touch openDrawer/closeDrawer
or any other existing function.

Run once:  python3 patch-badge.py
Safe to run twice.
"""
import os, re, sys

def main():
    root = os.path.dirname(os.path.abspath(__file__))
    sp = os.path.join(root, "server.js")
    fp = os.path.join(root, "public", "index.html")
    if not (os.path.exists(sp) and os.path.exists(fp)):
        print("Run this from inside the detective folder (needs server.js and public/index.html)."); sys.exit(1)

    # ================= server.js =================
    s = open(sp, encoding="utf-8").read()
    changed_server = False

    # ---- 1. sanitizer, dropped in right after userKeyFrom() ----
    if "sanitizeDetectiveName" in s:
        print("  = server.js — sanitizer already present")
    else:
        anchor = '''function userKeyFrom(req) {
  const k = (req.headers["x-user-gemini-key"] || "").trim();
  return /^[A-Za-z0-9._\\-]{20,120}$/.test(k) ? k : "";
}'''
        if anchor not in s:
            print("  ! server.js — couldn't find userKeyFrom(), skipped sanitizer"); sys.exit(1)
        addition = anchor + '''

// the detective's own name, typed in at the desk — used only so suspects
// can address them by it. Never trusted beyond "does this look like a name".
function sanitizeDetectiveName(raw) {
  const s = String(raw || "").trim().slice(0, 24);
  return /^[A-Za-z][A-Za-z .'\\-]{0,23}$/.test(s) ? s : "";
}'''
        s = s.replace(anchor, addition, 1)
        changed_server = True
        print("  ✔ server.js — sanitizeDetectiveName() added")

    # ---- 2. interrogate handler: read + validate the name ----
    old_destructure = "  const { caseId, suspectId, messages } = req.body || {};\n  const c = CASES[caseId];\n  const suspect = c && c.suspects[suspectId];"
    if "detectiveNameRaw" in s:
        print("  = server.js — interrogate handler already reads detectiveName")
    else:
        if old_destructure not in s:
            print("  ! server.js — couldn't find the interrogate destructure, skipped"); sys.exit(1)
        new_destructure = '''  const { caseId, suspectId, messages, detectiveName: detectiveNameRaw } = req.body || {};
  const c = CASES[caseId];
  const suspect = c && c.suspects[suspectId];
  const detectiveName = sanitizeDetectiveName(detectiveNameRaw);
  // suspect.system, plus one line telling them your name — only if it passed the shape check
  const suspectSystem = suspect && (detectiveName
    ? suspect.system + `\\n\\nThe detective questioning you just gave their name as ${detectiveName}. Once or twice in this conversation — not every line, the way a real person uses a name they were just told — address them as "Detective ${detectiveName}". Never use any other name for them.`
    : suspect.system);'''
        s = s.replace(old_destructure, new_destructure, 1)
        changed_server = True
        print("  ✔ server.js — interrogate handler builds a name-aware system prompt")

    # ---- 3. use suspectSystem instead of suspect.system in both calls ----
    if "text: suspectSystem" in s:
        print("  = server.js — Gemini call already uses suspectSystem")
    else:
        old1 = "systemInstruction: { parts: [{ text: suspect.system }] },"
        if old1 not in s:
            print("  ! server.js — Gemini systemInstruction line not found, skipped"); sys.exit(1)
        s = s.replace(old1, "systemInstruction: { parts: [{ text: suspectSystem }] },", 1)
        changed_server = True
        print("  ✔ server.js — Gemini call uses suspectSystem")

    if "backupChat(suspectSystem, messages)" in s:
        print("  = server.js — backup chat already uses suspectSystem")
    else:
        old2 = "if (!reply) reply = await backupChat(suspect.system, messages);"
        if old2 not in s:
            print("  ! server.js — backupChat line not found, skipped"); sys.exit(1)
        s = s.replace(old2, "if (!reply) reply = await backupChat(suspectSystem, messages);", 1)
        changed_server = True
        print("  ✔ server.js — backup chat uses suspectSystem")

    if changed_server:
        open(sp, "w", encoding="utf-8").write(s)

    # ================= public/index.html =================
    h = open(fp, encoding="utf-8").read()
    changed_html = False

    # ---- 1. CSS: badge + its row wrapper ----
    if ".badge{" in h:
        print("  = index.html — badge CSS already present")
    else:
        css_anchor = "  .confidential{font-family:'Special Elite',monospace;border:3px solid var(--stamp);color:var(--stamp);padding:6px 14px;font-size:14px;letter-spacing:.25em;transform:rotate(-6deg);text-transform:uppercase;user-select:none;opacity:.92;align-self:center}"
        if css_anchor not in h:
            print("  ! index.html — .confidential CSS rule not found, skipped"); sys.exit(1)
        css_addition = css_anchor + '''
  .hdr-right{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .badge{display:none;font-family:'Special Elite',monospace;border:2px solid var(--tape);color:var(--tape);padding:5px 11px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;user-select:none;opacity:.9;align-self:center}
  #badgeModal input{width:100%;font-family:'IBM Plex Sans',sans-serif;font-size:15px;padding:9px 10px;border:1px solid var(--line);border-radius:2px;margin:10px 0;background:var(--paper-2);color:var(--ink)}'''
        h = h.replace(css_anchor, css_addition, 1)
        changed_html = True
        print("  ✔ index.html — badge CSS added")

    # ---- 2. header markup: wrap the CONFIDENTIAL stamp with a badge slot (both headers) ----
    if 'class="hdr-right"' in h:
        print("  = index.html — header badge slot already present")
    else:
        old_hdr = '<div class="confidential">Confidential</div>'
        n = h.count(old_hdr)
        if n < 2:
            print(f"  ! index.html — expected 2 header stamps, found {n}, skipped"); sys.exit(1)
        new_hdr = '<div class="hdr-right"><div class="badge"></div><div class="confidential">Confidential</div></div>'
        h = h.replace(old_hdr, new_hdr)  # replaces both
        changed_html = True
        print(f"  ✔ index.html — badge slot added to {n} header(s)")

    # ---- 3. new overlay markup, right after the verdict overlay ----
    if 'id="badgeOverlay"' in h:
        print("  = index.html — badge overlay markup already present")
    else:
        verdict_block = '''<!-- verdict modal -->
<div class="overlay" id="verdictOverlay">
  <div class="modal" id="verdictModal"></div>
</div>'''
        if verdict_block not in h:
            print("  ! index.html — verdict overlay block not found, skipped"); sys.exit(1)
        badge_block = verdict_block + '''

<!-- badge / detective identity modal -->
<div class="overlay" id="badgeOverlay">
  <div class="modal" id="badgeModal"></div>
</div>'''
        h = h.replace(verdict_block, badge_block, 1)
        changed_html = True
        print("  ✔ index.html — badge overlay markup added")

    # ---- 4. state: DETECTIVE var, next to the other top-level state ----
    if "let DETECTIVE" in h:
        print("  = index.html — DETECTIVE state var already present")
    else:
        old_state = "let voiceOn = false;"
        if old_state not in h:
            print("  ! index.html — voiceOn state line not found, skipped"); sys.exit(1)
        h = h.replace(old_state, old_state + "\nlet DETECTIVE = null;             // { name, badge } once signed in at the desk", 1)
        changed_html = True
        print("  ✔ index.html — DETECTIVE state var added")

    # ---- 5. badge functions, dropped in right after the BYOK key button wiring ----
    if "function showBadgeModal" in h:
        print("  = index.html — badge functions already present")
    else:
        anchor = '''  refreshKeyBtn();
};

let audioNow = null;             // currently playing Audio element'''
        if anchor not in h:
            print("  ! index.html — keyBtn wiring block not found, skipped"); sys.exit(1)
        funcs = '''  refreshKeyBtn();
};

/* ---- detective identity: a name typed once, a badge issued once ---- */
const BADGE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O or 1/I, easy to read back
function makeBadgeNumber(){
  let out = "";
  for(let i=0;i<5;i++) out += BADGE_CHARS[Math.floor(Math.random()*BADGE_CHARS.length)];
  return out;
}
function loadDetective(){ try{ return JSON.parse(localStorage.getItem("detective") || "null"); }catch(e){ return null; } }
function saveDetective(d){ try{ localStorage.setItem("detective", JSON.stringify(d)); }catch(e){} }
function renderBadge(){
  document.querySelectorAll(".badge").forEach(el=>{
    el.style.display = DETECTIVE ? "" : "none";
    el.textContent = DETECTIVE ? `Det. ${DETECTIVE.name} · #${DETECTIVE.badge}` : "";
  });
}
function showBadgeModal(){
  const existing = loadDetective();
  const ov = $("badgeOverlay"), m = $("badgeModal");
  if(existing){
    m.innerHTML = `
      <h2>Welcome back, Detective.</h2>
      <p>Badge <b>#${esc(existing.badge)}</b>, issued to <b>${esc(existing.name)}</b>.</p>
      <div class="accuse-actions">
        <button class="close" id="badgeNotMe">Not me</button>
        <button id="badgeContinue">Confirm &amp; enter →</button>
      </div>`;
    ov.classList.add("show");
    $("badgeContinue").onclick = ()=>{ DETECTIVE = existing; renderBadge(); ov.classList.remove("show"); };
    $("badgeNotMe").onclick = ()=>{ try{ localStorage.removeItem("detective"); }catch(e){} showBadgeModal(); };
  } else {
    m.innerHTML = `
      <h2>Sign in at the desk.</h2>
      <p>Give your name for the case files. You'll be issued a badge number.</p>
      <input id="badgeNameInput" type="text" maxlength="24" placeholder="Your name">
      <div class="accuse-actions"><button id="badgeSubmit">Get my badge →</button></div>
      <p class="minor" id="badgeHint"></p>`;
    ov.classList.add("show");
    const submit = ()=>{
      const name = $("badgeNameInput").value.trim();
      if(!name){ $("badgeHint").textContent = "The desk sergeant needs a name first."; return; }
      const d = { name: name.slice(0,24), badge: makeBadgeNumber() };
      saveDetective(d); DETECTIVE = d; renderBadge();
      ov.classList.remove("show");
    };
    $("badgeSubmit").onclick = submit;
    $("badgeNameInput").addEventListener("keydown", e=>{ if(e.key==="Enter") submit(); });
    setTimeout(()=>{ const el=$("badgeNameInput"); if(el) el.focus(); }, 50);
  }
}

let audioNow = null;             // currently playing Audio element'''
        h = h.replace(anchor, funcs, 1)
        changed_html = True
        print("  ✔ index.html — badge functions added")

    # ---- 6. send the name with every interrogation ----
    if "detectiveName: DETECTIVE" in h:
        print("  = index.html — interrogate call already sends detectiveName")
    else:
        old_fetch = '''body:JSON.stringify({ caseId: CASE.id, suspectId: current,
        // send only role+content — cached audio (_audio) is huge and stays in the browser
        messages: histories[current].map(m => ({ role: m.role, content: m.content })) })'''
        if old_fetch not in h:
            print("  ! index.html — interrogate fetch body not found, skipped"); sys.exit(1)
        new_fetch = '''body:JSON.stringify({ caseId: CASE.id, suspectId: current,
        detectiveName: DETECTIVE ? DETECTIVE.name : "",
        // send only role+content — cached audio (_audio) is huge and stays in the browser
        messages: histories[current].map(m => ({ role: m.role, content: m.content })) })'''
        h = h.replace(old_fetch, new_fetch, 1)
        changed_html = True
        print("  ✔ index.html — interrogate call sends detectiveName")

    # ---- 7. show the badge card at boot ----
    if "DETECTIVE = loadDetective();" in h:
        print("  = index.html — boot already calls showBadgeModal()")
    else:
        old_boot = '''/* ================= boot ================= */
loadCatalog();'''
        if old_boot not in h:
            print("  ! index.html — boot block not found, skipped"); sys.exit(1)
        new_boot = '''/* ================= boot ================= */
loadCatalog();
DETECTIVE = loadDetective();
renderBadge();
showBadgeModal();'''
        h = h.replace(old_boot, new_boot, 1)
        changed_html = True
        print("  ✔ index.html — boot shows the badge card and renders any saved badge")

    if changed_html:
        open(fp, "w", encoding="utf-8").write(h)

    print("\nRestart the server (Ctrl+C, then npm start), then hard-refresh the page.\n")

if __name__ == "__main__":
    main()
