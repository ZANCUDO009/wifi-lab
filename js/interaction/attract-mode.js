/* ── Modo atracción (DI-02): demostración automática tras 30 s sin tocar ── */
let idleT = performance.now(), att = null;
function wake() {
  idleT = performance.now();
  if (att) {
    const a = att; att = null; $('attract').style.display = 'none';
    restoreSnap(a.snap); S.layers.heat = a.heat; S.orbit = a.orbit; ACT.mode(a.mode); $('bOrb').classList.toggle('on', !!a.orbit); HIST.u.length = a.hu; HIST.r = []; S.preset = a.preset; panelsRefresh(); touch(); commit();
  }
}
function attractTick(now) {
  if (!att && now - idleT > 30000 && !S.drag && !modalOn() && !document.hidden) {
    att = { mode: S.mode, orbit: S.orbit, snap: snapState(), heat: S.layers.heat, hu: HIST.u.length, preset: S.preset, t0: now, last: now, i: 0, rx0: { ...S.rx } };
    S.layers.heat = 1; $('attract').style.display = 'block'; S.paused = 0;
  }
  if (!att) return;
  const t = (now - att.t0) / 1000, list = ['dept2', 'refl', 'cowork', 'hotel', 'office'];
  if (now - att.last > 22000) { att.last = now; att.i = (att.i + 1) % list.length; preset(list[att.i]); S.layers.heat = 1; const to3 = att.i % 2 === 1; if (to3 !== (S.mode === '3d')) ACT.mode(to3 ? '3d' : '2d'); S.orbit = to3; }
  if (!att.rxFix) { att.cx = S.W / 2; }
  S.rx = { x: S.W / 2 + (S.W * .35) * Math.cos(t * .35), y: S.H / 2 + (S.H * .32) * Math.sin(t * .5) };
  S.aps[0].x = clamp(S.aps[0].x + Math.sin(t * .8) * .01, 1, S.W - 1);
  dirty = 1; hmD = 1;
}

