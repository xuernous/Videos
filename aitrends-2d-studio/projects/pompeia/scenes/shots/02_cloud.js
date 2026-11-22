// shots/02_cloud.js — s15–s28: 18 hours of pumice, the roofs, the burning cloud, the dig, the volcano reveal.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, rng, noise } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street, digsite, oven, loaf, pumice, groundY } from '../sets/pompeii.js';
import { wt, zoomAt, bgBlur, faceShot, bpBack, bigNum } from '../sets/kit.js';
import { locals, SHADE_EYES } from './01_eruption.js';
import { BAKER, ARCH, LOCAL } from '../cast.js';

const rim = (M, d = [0, -1], w = 5) => ({ color: M.rim, dir: d, w });
// ring timer + big value (s15, s18)
function timer(g, p, str, color) { const ui = S().ui, cx = E.W / 2, cy = V(210, 330), r = V(110, 120);
  ring(g, cx, cy, r, 10, alpha(ui.cream, 0.15)); g.strokeStyle = color || ui.gold; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); g.stroke();
  text(g, str, cx, cy + 6, { size: V(76, 84), color: color || ui.gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(color || ui.gold, 0.6) }); }
// rolling cloud wall made of puffs. edge = x of the leading edge
function cloudWall(g, t, edge, GY, M, o = {}) {
  const r = rng(o.seed ?? 5), hot = S().ui.accent, ash = mix(M.fog, '#8a8088', 0.4), H = o.h ?? E.H * 0.9;
  for (let i = 0; i < 70; i++) { const u = r(), y = GY - Math.pow(r(), 0.7) * H, x = edge - r() * E.W * 1.4 - (GY - y) * 0.25 + noise(t * 0.8 + i, 2) * 30, rad = 90 + r() * 180;
    circle(g, x, y, rad * (1 + 0.05 * Math.sin(t * 2 + i)), mix(ash, M.dark, 0.1 + 0.35 * u)); }
  g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 8; i++) glow(g, edge - 200 - i * 180, GY - 30, 260, hot, 0.35); g.restore();
  glow(g, edge, GY - H * 0.3, 400, mix(hot, '#ffd59a', 0.5), 0.2);
}

// s15 — "A chuva dura 18 horas,"
registerShot('s15', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.05 * k, y: V(20, 60) };
  const { M, GY } = street(g, t, cam, { phase: 'night', ash: lerp(0.25, 0.6, k), windows: 0.6 });
  pumice(g, t * 2.5, { count: 170, speed: 1200 });
  const p = ease.inOut(prog(t, wt('18', info, 1.1) - 0.6, info.dur - 0.2)); timer(g, p, `${Math.round(18 * p)}H`);
} });

// s16 — "quase 3 metros de pedra."  cutaway: pumice rising up a house
registerShot('s16', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, c = ui.blueprint, base = E.H * 0.7, hx = E.W * 0.5, hw = V(560, 620), hh = V(520, 560), tm = wt('metros', info, 1.0);
  const lvl = ease.inOut(prog(t, 0.1, tm + 0.4)) * hh * 0.95;
  // pumice fill
  g.save(); g.beginPath(); g.rect(-50, base - lvl, E.W + 100, lvl); g.clip(); g.fillStyle = alpha(mix(c, '#a8a098', 0.5), 0.35); g.fillRect(0, 0, E.W, E.H);
  const r = rng(4); for (let i = 0; i < 220; i++) circle(g, r() * E.W, base - r() * hh, 5 + r() * 8, alpha('#cfc8c0', 0.6)); g.restore();
  g.strokeStyle = c; g.lineWidth = 7; g.lineJoin = 'round';
  g.strokeRect(hx - hw / 2, base - hh, hw, hh); g.beginPath(); g.moveTo(hx - hw / 2 - 40, base - hh); g.lineTo(hx, base - hh - V(220, 240)); g.lineTo(hx + hw / 2 + 40, base - hh); g.stroke();
  g.strokeRect(hx - 60, base - 200, 120, 200);
  seg(g, [[-50, base], [E.W + 50, base]], 6, c);
  UI.lineFigure(g, { x: hx - hw * 0.3, y: base, s: 1.0, pose: POSES.handsOnHead, color: ui.cream });
  UI.dimension(g, t, { x1: hx + hw / 2 + 90, y1: base, x2: hx + hw / 2 + 90, y2: base - hh * 0.95, str: '3 M', start: tm - 0.4 });
  bigNum(g, t, '3 METROS', E.W / 2, E.H * 0.15, tm, { size: V(110, 120) });
} });

// s17 — "De madrugada, os telhados começam a desabar."
registerShot('s17', { draw(g, t, info) {
  const td = wt('desabar', info, 2.4), rc = ease.in(prog(t, td - 1.2, td + 0.1)), [sx, sy] = t > td ? shake(t, 18 * (1 - prog(t, td, td + 0.7)), 18) : [0, 0];
  const k = ease.inOut(t / info.dur), cam = { z: 1.3 + 0.06 * k, x: sx, y: V(-30, -60) + sy };
  const { M, GY } = street(g, t, cam, { phase: 'night', ash: 0.65, roof: rc, windows: 0.3 });
  pumice(g, t, { count: 120, speed: 1000 });
  if (t > td) veil(g, mix(M.fog, '#c8c0b8', 0.5), 0.35 * (1 - prog(t, td, td + 1)));
  UI.badge(g, { str: 'MADRUGADA', a: prog(t, 0.1, 0.4), size: V(44, 50), y: V(120, 260) });
} });

// s18 — "Por volta da 7 da manhã,"
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15 + 0.05 * k, y: V(10, 40) };
  street(g, t, cam, { phase: 'dawn', ash: 0.75, roof: 1, windows: 0 });
  FX.snow(g, t, { count: 120, color: '#c8c0b8', speed: 40 });
  bigNum(g, t, '7:00', E.W / 2, V(250, 380), wt('7', info, 0.7), { label: 'MANHÃ' });
} });

// s19 — "desce uma nuvem de gás e cinza a centenas de graus,"  3D
registerShot('s19', { kind: '3d',
  init(T) {
    const M = mood('storm'), st = T.stage({ mood: 'dusk', fov: V(38, 56), fog: [40, 160], keyPos: [-12, 15, 14], keyIntensity: 2.4, ambient: 1.4 });
    st.add(T.ground(300, 300, shade(M.fog, -0.35)));
    st.add(T.cone(16, 9, shade(M.dark, 0.05), 0, 4.5, -32, 9));
    const r = rng(9); for (let i = 0; i < 70; i++) { const h = 0.5 + r() * 1.0; st.add(T.box(1 + r() * 1.5, h, 1 + r() * 1.5, mix(M.wall, '#8a4a3a', 0.4), -16 + r() * 32, h / 2, 4 + r() * 14)); }
    const puffs = [], hot = S().ui.accent, ash = mix(M.fog, '#b0a6a8', 0.5);
    for (let i = 0; i < 90; i++) { const isHot = i % 5 === 0; const s = T.sphere(1, isHot ? hot : ash, 0, 0, 0); st.add(s); puffs.push({ s, a: r(), b: r(), c: r(), hot: isHot }); }
    return { stage: st, puffs };
  },
  draw(s, t, info, T) {
    const p = t / info.dur;
    s.puffs.forEach((q, i) => { const front = -30 + (0.2 + p * 0.8) * 26 * (0.6 + q.b * 0.4); const x = (q.a - 0.5) * (10 + p * 22), y = Math.max(0.6, 8 * (1 - (front + 30) / 30) + q.c * 3); q.s.position.set(x, y + Math.sin(t * 2 + i) * 0.3, front); q.s.scale.setScalar((q.hot ? 1.0 : 1.6) + q.c * 1.4 + p); });
    T.dolly(s.stage.camera, t, [[0, { pos: [8, 7, 42], look: [0, 4, -18], fov: V(38, 56) }], [info.dur, { pos: [6, 6, 38], look: [0, 3, -10], fov: V(40, 58) }]]);
  },
  overlay(g, t, info) { bigNum(g, t, 'CENTENAS', E.W / 2, E.H * 0.16, wt('centenas', info, 2.3), { size: V(96, 104), color: S().ui.accent, label: 'DE GRAUS' }); },
});

// s20 — "mais de 100 quilômetros por hora."  speedometer
registerShot('s20', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, cx = E.W / 2, cy = E.H * 0.5, r = V(380, 420), t1 = wt('100', info, 0.7);
  g.strokeStyle = alpha(ui.blueprint, 0.4); g.lineWidth = 18; g.beginPath(); g.arc(cx, cy, r, Math.PI * 0.8, Math.PI * 2.2); g.stroke();
  for (let v = 0; v <= 150; v += 25) { const a = Math.PI * 0.8 + v / 150 * Math.PI * 1.4; text(g, String(v), cx + Math.cos(a) * (r - 70), cy + Math.sin(a) * (r - 70), { size: V(32, 36), color: v === 100 ? ui.gold : ui.sub, font: FONTS.ui, weight: 900 }); }
  const v = lerp(0, 112, ease.out(prog(t, t1 - 0.4, t1 + 0.5))) + (t > t1 + 0.5 ? Math.sin(t * 20) * 2 : 0), a = Math.PI * 0.8 + v / 150 * Math.PI * 1.4;
  g.strokeStyle = ui.accent; g.lineWidth = 18; g.beginPath(); g.arc(cx, cy, r, Math.PI * 0.8, a); g.stroke();
  seg(g, [[cx, cy], [cx + Math.cos(a) * r * 0.92, cy + Math.sin(a) * r * 0.92]], 12, ui.cream); circle(g, cx, cy, 26, ui.cream);
  text(g, `${Math.round(v)}+`, cx, cy + V(150, 170), { size: V(120, 130), color: ui.accent, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(ui.accent, 0.6) });
  text(g, 'KM/H', cx, cy + V(260, 280), { size: V(50, 56), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8 });
} });

// s21 — "Ninguém corre mais que isso."  the cloud catches up
registerShot('s21', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15, x: t * 120, y: V(10, 40) };
  const { M, GY } = street(g, t, cam, { phase: 'dawn', ash: 0.55, roof: 1, windows: 0 });
  layer(g, cam, 1, (g) => {
    const hx = E.W * 0.5 + t * 260, edge = E.W * 0.32 + t * 420;
    drawFigure(g, { x: hx, y: GY + V(60, 90), s: 1.6, facing: 1, outfit: BAKER, pose: walkPose(t * 2 * Math.PI * 1.6, { run: true }), expr: 'scared', look: [-1, 0], rim: { color: S().ui.accent, dir: [-1, -0.3], w: 5 }, trail: { count: 3, dx: -40, a: 0.15 } });
    cloudWall(g, t, edge, GY + V(140, 200), M);
  });
  FX.snow(g, t, { count: 90, color: '#c8c0b8', speed: 60 });
} });

// s22 — "A maioria dos moradores fugiu enquanto dava."  the exodus through the gate
registerShot('s22', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15 + 0.05 * k, x: 30 * k, y: V(10, 40) };
  const { M, GY } = street(g, t, cam, { phase: 'erupt', ash: 0.1 });
  layer(g, cam, 1, (g) => {
    const list = []; for (let i = 0; i < 9; i++) list.push({ x: -300 + i * 150, v: 110, s: 0.95 + (i % 3) * 0.08, dy: (i % 2) * 40, expr: 'worried', run: false });
    locals(g, t, GY + V(40, 70), M, list);
    list.forEach((p, i) => { const x = p.x + p.v * t, y = GY + V(40, 70) - p.dy - 150 * p.s; rr(g, x - 30 * p.s, y - 20 * p.s, 60 * p.s, 44 * p.s, 10); g.fillStyle = shade(mix('#d8ccb4', M.key, 0.2), -0.2 - (i % 3) * 0.1); g.fill(); });
    // city gate (right)
    const gx = E.W * 0.86, gw = V(300, 280), gh = V(560, 520), wall = shade(mix(M.wall, '#b0503a', 0.4), -0.35);
    g.fillStyle = wall; g.fillRect(gx - gw, GY - gh - 80, gw * 2.6, gh + 120);
    g.save(); g.beginPath(); g.moveTo(gx - gw / 2, GY + 40); g.lineTo(gx - gw / 2, GY - gh + gw / 2); g.arc(gx, GY - gh + gw / 2, gw / 2, Math.PI, 0); g.lineTo(gx + gw / 2, GY + 40); g.closePath(); g.fillStyle = mix(M.sky[1], M.key, 0.3); g.fill(); g.restore();
    glow(g, gx, GY - gh * 0.4, gh, M.key, 0.4);
  });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.35 });
} });

// s23 — "Morreu quem esperou demais."  silence, ash, a closed door, the light dies
registerShot('s23', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.08 * k, x: -V(80, 70), y: V(-10, -40) };
  street(g, t, cam, { phase: 'dawn', ash: 1, roof: 1, windows: 0 });
  veil(g, '#000', 0.25 + 0.35 * prog(t, 0.6, info.dur));
  FX.snow(g, t, { count: 140, color: '#c8c0b8', speed: 25 });
} });

// s24 — "Seus pães foram encontrados quase 1.800 anos depois,"
registerShot('s24', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.3 + 0.07 * k, x: V(60, 60), y: V(40, 110) };
  const { M, GY, CX } = digsite(g, t, cam);
  layer(g, cam, 1, (g) => {
    const ox = CX + V(220, 170);
    g.save(); g.beginPath(); g.rect(ox - 600, GY - V(420, 380), 1200, 2000); g.clip(); oven(g, ox, GY, V(300, 250), M, t, 0, { loaves: false }); g.restore();
    const brush = { ...POSES.kneel, eF: [36, -110], hF: [62, -104 + Math.sin(t * 8) * 8] };
    drawFigure(g, { x: CX - V(170, 160), y: GY, s: 1.9, facing: 1, outfit: ARCH, pose: brush, expr: 'thinking', look: [1, 0.3], rim: rim(M, [-0.7, -0.6]) });
  });
  FX.dust(g, t, { count: 60, color: M.key, a: 0.45 });
  const t0 = wt('1.800', info, 2.2), p = ease.out(prog(t, t0 - 0.2, t0 + 1.2));
  if (p > 0) { text(g, `${Math.round(1800 * p).toLocaleString('pt-BR')}`, E.W / 2, V(230, 190), { size: V(140, 160), color: S().ui.gold, font: FONTS.ui, weight: 900, stroke: 18, strokeColor: '#2a1408', glow: 26, glowColor: alpha(S().ui.gold, 0.6), alpha: clamp(p * 3) }); text(g, 'ANOS DEPOIS', E.W / 2, V(340, 310), { size: V(44, 50), color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 8, stroke: 10, strokeColor: '#2a1408', alpha: clamp(p * 3) }); }
} });

// s25 — "ainda no forno."  the carbonized loaves
registerShot('s25', { draw(g, t, info) {
  const M = mood('golden');
  bgBlur(g, t, 'dig', { z: 1.6, y: -V(150, 250), veil: 0.35 });
  const z = 1.05 + 0.08 * ease.inOut(t / info.dur), cx = E.W / 2, by = E.H * 0.66;
  zoomAt(g, cx, E.H * 0.5, z, () => {
    const o = oven(g, cx, by, V(560, 520), M, t, 0, { loaves: false });
    g.save(); g.globalCompositeOperation = 'lighter'; FX.lightCone(g, cx - o.mw, o.mouthY - o.mh * 2, { angle: 0.9, spread: 0.35, len: o.mw * 2.5, color: M.key, a: 0.45 }); g.restore();
    for (let i = -1; i <= 1; i++) { glow(g, cx + i * o.mw * 0.27, o.mouthY - 20, o.mw * 0.2, M.key, 0.35); loaf(g, cx + i * o.mw * 0.27, o.mouthY - 8, o.mw * 0.12, 0.85, M); }
  });
  FX.dust(g, t, { count: 60, color: M.key, a: 0.5 });
} });

// s26 — "E o pior, ninguém ali sabia que aquela montanha"  calm before
registerShot('s26', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.07 * k, y: V(0, 30) }, ts = wt('sabia', info, 1.9);
  const { M, GY } = street(g, t, cam, { phase: 'day', green: true });
  layer(g, cam, 1, (g) => locals(g, t, GY, M, [{ x: 200, s: 1.0, pose: breathe(POSES.sit, t, 1, 1), expr: 'smile' }, { x: 330, s: 1.0, f: -1, pose: breathe(POSES.talk, t, 1, 2), expr: 'happy' }, { x: 800, s: 1.05, f: -1, pose: breathe(POSES.relaxed, t, 1, 3), expr: 'smile' }]));
  const a = ease.outBack(prog(t, ts - 0.1, ts + 0.3)); if (a > 0) { g.save(); g.translate(E.W / 2 + V(140, 90), V(300, 520)); g.scale(a, a); text(g, '?', 0, 0, { size: V(180, 200), color: S().ui.gold, font: FONTS.title, glow: 24, glowColor: alpha(S().ui.gold, 0.6) }); g.restore(); }
  FX.dust(g, t, { count: 40, color: M.key, a: 0.35 });
} });

// s27 — "era um vulcão."  cross-section
registerShot('s27', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, c = ui.blueprint, cx = E.W / 2, gy = E.H * 0.42, tv = wt('vulcão', info, 0.8), p = ease.inOut(prog(t, 0, 0.6)), m = ease.out(prog(t, tv - 0.3, tv + 0.4));
  g.strokeStyle = c; g.lineWidth = 7; g.lineJoin = 'round'; g.beginPath(); g.moveTo(cx - V(700, 520), gy); g.lineTo(cx - V(90, 70), gy - V(380, 360) * p); g.lineTo(cx + V(90, 70), gy - V(380, 360) * p); g.lineTo(cx + V(700, 520), gy); g.stroke();
  seg(g, [[-50, gy], [E.W + 50, gy]], 4, alpha(c, 0.5));
  for (let i = 1; i < 6; i++) { g.strokeStyle = alpha(c, 0.15); g.lineWidth = 2; g.beginPath(); g.moveTo(0, gy + i * 90); g.lineTo(E.W, gy + i * 90 + 20); g.stroke(); }
  if (m > 0) { const hot = ui.accent; seg(g, [[cx, gy + V(420, 460) * m], [cx, gy - V(370, 350)]], 26 * m, alpha(hot, 0.85)); g.fillStyle = alpha(hot, 0.85); g.beginPath(); g.ellipse(cx, gy + V(470, 520), V(300, 280) * m, V(140, 150) * m, 0, 0, Math.PI * 2); g.fill(); glow(g, cx, gy + V(470, 520), V(500, 460) * m, hot, 0.5); glow(g, cx, gy - V(370, 350), 160, hot, 0.6 * m);
    text(g, 'MAGMA', cx, gy + V(470, 520), { size: V(44, 48), color: '#2a0a06', font: FONTS.ui, weight: 900, spacing: 6, alpha: m }); }
  bigNum(g, t, 'VULCÃO', E.W / 2, E.H * 0.14, tv, { size: V(130, 140), color: ui.accent });
} });

// s28 — "Agora você sabe."
registerShot('s28', { draw(g, t, info) {
  faceShot(g, t, info, { who: BAKER, where: 'street', expr: 'smirk', look: [0.2, 0], rimSide: -1, push: 0.05, y: V(200, 300), set: { phase: 'erupt' }, bgx: V(100, 100), veil: 0.35 });
  UI.titleCard(g, t, { lines: ['AGORA', 'VOCÊ SABE'], dur: info.dur + 1, y: E.H * 0.2 });
} });
