// shots/01_eruption.js — s01–s14: time travel, the bakery, the eruption, the pumice rain, the two choices.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street, bakery, BAK, oven, loaf, pumice, vesuvius, plume, groundY } from '../sets/pompeii.js';
import { wt, zoomAt, bgBlur, faceShot, bpBack, bigNum } from '../sets/kit.js';
import { BAKER, LOCAL } from '../cast.js';

const rim = (M, d = [0, -1], w = 5) => ({ color: M.rim, dir: d, w });
export const SHADE_EYES = { ...POSES.stand, head: [6, -210], eF: [26, -186], hF: [24, -214] };
// pillow tied on a figure's head
export function pillowOn(g, f, M) {
  const [hx, hy, hr] = headPos(f), c = mix('#efe6d2', M.key, 0.15);
  rr(g, hx - hr * 1.5 - 4, hy - hr * 2.0 - 4, hr * 3 + 8, hr * 1.25 + 8, hr * 0.5); g.fillStyle = M.rim; g.fill();
  rr(g, hx - hr * 1.5, hy - hr * 2.0, hr * 3, hr * 1.25, hr * 0.5); g.fillStyle = c; g.fill();
  seg(g, [[hx - hr * 1.2, hy - hr * 0.9], [hx - hr * 0.95, hy + hr * 0.6]], 3 * (f.s || 1), shade('#8a6a4a', -0.2));
  seg(g, [[hx + hr * 1.2, hy - hr * 0.9], [hx + hr * 0.95, hy + hr * 0.6]], 3 * (f.s || 1), shade('#8a6a4a', -0.2));
}
// a line of locals in the street
export function locals(g, t, GY, M, list, o = {}) {
  list.forEach((p, i) => { const run = p.run ?? o.run, ph = t * 2 * Math.PI * (run ? 1.6 : 0.9) + i, x = p.x + (p.v ?? 0) * t;
    drawFigure(g, { x, y: GY - (p.dy ?? 0), s: p.s ?? 1.1, facing: p.f ?? 1, outfit: LOCAL(i), pose: p.pose ? p.pose : p.v ? walkPose(ph, { run }) : breathe(POSES.stand, t, 1, i), expr: p.expr || 'neutral', look: p.look, dim: p.dim, rim: rim(M, [0, -1], 4), blink: (t % (2.6 + i * 0.3)) > (2.5 + i * 0.3) }); });
}

// s01 — "E se você voltasse no tempo e"  time tunnel, 2026 -> 79
registerShot('s01', { draw(g, t, info) {
  const ui = S().ui, M = mood('void'), cx = E.W / 2, cy = E.H * 0.45;
  g.fillStyle = M.sky[0]; g.fillRect(0, 0, E.W, E.H);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 14; i++) { const u = ((i / 14 + t * 0.6) % 1), r = Math.pow(u, 2.2) * E.H * 1.2; ring(g, cx, cy, r, 3 + u * 10, alpha(i % 2 ? ui.gold : ui.blueprint, 0.5 * u)); }
  g.restore();
  FX.speedLines(g, t, { cx, cy, count: 70, inner: 160, color: ui.cream, a: 0.25 });
  const k = ease.in(prog(t, 0.1, info.dur - 0.2)), yr = Math.round(lerp(2026, 79, k));
  drawFigure(g, { x: cx, y: cy + 110, s: 1.6 - 0.6 * k, facing: 1, outfit: BAKER, pose: POSES.fall, rot: t * 3, expr: 'shocked', rim: rim(M, [0, -1], 5), trail: { count: 4, dx: 0, dy: -30 }, shadow: false });
  text(g, String(yr), cx, V(230, 360), { size: V(150, 180), color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.7) });
  text(g, 'ANO', cx, V(120, 230), { size: V(40, 46), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8 });
} });

// s02 — "acordasse padeiro em Pompeia,"
registerShot('s02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.4 + 0.08 * k, x: -V(80, 120), y: V(50, 130) };
  const { M, GY, CX } = bakery(g, t, cam, { fire: 1, outside: 'day' });
  layer(g, cam, 1, (g) => {
    const tu = 0.7, f = { x: CX - V(60, 40), y: GY, s: 1.9, facing: 1, outfit: BAKER, pose: breathe(posesAt(t, [[0, POSES.sitBack], [tu, POSES.sit], [tu + 0.6, { ...POSES.sit, head: [0, -182] }]], 0.4), t), expr: t < tu ? 'sleepy' : 'surprised', look: t < tu + 0.6 ? [1, 0] : [-1, -0.2], rim: rim(M, [1, -0.4]), blink: t < tu };
    drawFigure(g, f);
  });
  FX.dust(g, t, { count: 60, color: M.practical, a: 0.4 });
} });

// s03 — "no ano 79,"  establishing street + title
registerShot('s03', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05 + 0.06 * k, y: V(0, 30) };
  const { M, GY } = street(g, t, cam, { phase: 'day' });
  layer(g, cam, 1, (g) => locals(g, t, GY, M, [{ x: 120, v: 70, s: 1.0 }, { x: 900, v: -60, f: -1, s: 1.05 }, { x: 600, s: 0.95, dy: 30, dim: true }]));
  FX.dust(g, t, { count: 40, color: M.key, a: 0.35 });
  UI.titleCard(g, t, { lines: ['POMPEIA'], sub: 'ANO 79', dur: info.dur + 0.4, y: E.H * 0.34 });
} });

// s04 — "são quase uma da tarde."  sundial
registerShot('s04', { draw(g, t, info) {
  const M = mood('golden'), ui = S().ui;
  bgBlur(g, t, 'street', { z: 1.5, y: -V(150, 250), veil: 0.35, set: { phase: 'day' } });
  const z = 1 + 0.06 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.52, R = V(380, 420);
  zoomAt(g, cx, cy, z, () => {
    const stone = mix('#d8ccb4', M.key, 0.2);
    g.fillStyle = shade(stone, -0.45); g.beginPath(); g.ellipse(cx, cy + 40, R * 1.05, R * 0.5, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = stone; g.beginPath(); g.ellipse(cx, cy, R, R * 0.48, 0, 0, Math.PI * 2); g.fill();
    ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].forEach((n, i) => { const a = Math.PI + (i + 0.5) / 11 * Math.PI, x = cx + Math.cos(a) * R * 0.82, y = cy + Math.sin(a) * R * 0.4;
      seg(g, [[cx + Math.cos(a) * R * 0.25, cy + Math.sin(a) * R * 0.12], [cx + Math.cos(a) * R * 0.7, cy + Math.sin(a) * R * 0.34]], 3, alpha('#3a2a20', 0.5)); text(g, n, x, y, { size: V(34, 38), color: '#3a2a20', font: FONTS.serif, weight: 900, alpha: n === 'VII' ? 1 : 0.6 }); });
    const a = Math.PI + lerp(5.3, 6.4, ease.inOut(prog(t, 0, info.dur))) / 11 * Math.PI;
    poly(g, [[cx, cy], [cx + Math.cos(a - 0.04) * R * 0.78, cy + Math.sin(a - 0.04) * R * 0.37], [cx + Math.cos(a + 0.04) * R * 0.78, cy + Math.sin(a + 0.04) * R * 0.37]], alpha('#1a1210', 0.55));
    poly(g, [[cx - 14, cy], [cx + 14, cy], [cx, cy - R * 0.6]], shade(stone, -0.5)); seg(g, [[cx, cy - R * 0.6], [cx, cy]], 4, alpha(M.rim, 0.6));
  });
  bigNum(g, t, '13:00', E.W / 2, V(220, 360), wt('uma', info, 0.7), { label: 'QUASE' });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.4 });
} });

// s05 — "A montanha atrás da cidade acabou de explodir."
registerShot('s05', { draw(g, t, info) {
  const te = wt('explodir', info, 2.35), k = ease.inOut(t / info.dur), [sx, sy] = t > te ? shake(t, 22 * (1 - prog(t, te, te + 0.8)), 16) : [0, 0];
  const cam = { z: 1.05 + 0.05 * k, x: sx, y: V(0, 20) + sy };
  const { M, GY } = street(g, t, cam, { phase: 'erupt', plume: prog(t, te - 0.05, te + 1.2) * 0.85, green: t < te });
  layer(g, cam, 1, (g) => {
    const after = t > te + 0.15;
    locals(g, t, GY, M, [{ x: 160, s: 1.0, f: 1, look: after ? [0.4, -1] : [1, 0], expr: after ? 'shocked' : 'neutral', pose: after ? POSES.handsOnHead : null }, { x: 820, s: 1.05, f: -1, look: after ? [0.4, -1] : [-1, 0], expr: after ? 'scared' : 'smile', pose: after ? POSES.pointUp : null }]);
    drawFigure(g, { x: E.W * 0.42, y: GY + V(60, 90), s: 1.8, facing: 1, outfit: BAKER, pose: breathe(after ? SHADE_EYES : POSES.relaxed, t), expr: after ? 'shocked' : 'smile', look: after ? [0.5, -1] : [1, 0], rim: rim(M, [-0.6, -0.8]) });
  });
  if (t > te) veil(g, '#ffffff', 0.7 * (1 - prog(t, te, te + 0.3)), 'lighter');
  if (t > te) veil(g, S().ui.accent, 0.12 * (1 - prog(t, te, te + 1)), 'lighter');
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s06 — "Tem pão no forno."
registerShot('s06', { draw(g, t, info) {
  const M = mood('interiorWarm');
  bgBlur(g, t, 'bakery', { z: 1.6, x: V(300, 250), y: -V(120, 200), veil: 0.4 });
  const z = 1 + 0.07 * ease.inOut(t / info.dur), cx = E.W / 2, by = E.H * 0.66;
  zoomAt(g, cx, E.H * 0.5, z, () => {
    const o = oven(g, cx, by, V(560, 520), M, t, 1, { loaves: false });
    for (let i = -1; i <= 1; i++) loaf(g, cx + i * o.mw * 0.27, o.mouthY - 8, o.mw * 0.12, 0, M);
    const px = lerp(E.W + 200, cx + o.mw * 0.15, ease.out(prog(t, 0.1, 0.7)));
    seg(g, [[px + 40, o.mouthY - 30], [E.W + 600, o.mouthY - 160]], 26, shade('#8a6a4a', -0.2)); rr(g, px - 110, o.mouthY - 46, 170, 26, 12); g.fillStyle = shade('#8a6a4a', -0.1); g.fill();
  });
  FX.dust(g, t, { count: 50, color: M.practical, a: 0.45 });
} });

// s07 — "Uma coluna de cinza sobe 30 quilômetros"  3D
registerShot('s07', { kind: '3d',
  init(T) {
    const M = mood('dusk'), st = T.stage({ mood: 'dusk', fov: V(38, 55), fog: [30, 140], keyPos: [-20, 18, 10], keyIntensity: 2.2, ambient: 0.9 });
    st.add(T.ground(300, 300, M.grass));
    const mtn = T.cone(16, 9, shade(M.dark, 0.1), 0, 4.5, -30, 9); st.add(mtn);
    const r = rng(3); for (let i = 0; i < 60; i++) { const h = 0.6 + r() * 1.2; st.add(T.box(1 + r() * 1.5, h, 1 + r() * 1.5, mix(M.wall, '#b0503a', 0.4), -14 + r() * 28, h / 2, 2 + r() * 12)); }
    for (let i = 0; i < 40; i++) st.add(T.box(1.2, 0.3, 1.2, '#8a3a2a', -14 + r() * 28, 1.4 + r(), 2 + r() * 12));
    const puffs = []; const ash = mix(M.fog, '#5a5058', 0.55);
    for (let i = 0; i < 70; i++) { const s = T.sphere(1, ash, 0, 0, -30); st.add(s); puffs.push({ s, u: i / 70, a: r() * 6.28, d: r() }); }
    const glowS = T.sphere(1.6, S().ui.accent, 0, 9, -30); st.add(glowS);
    return { stage: st, puffs };
  },
  draw(s, t, info, T) {
    const g = clamp(t / info.dur * 1.1 + 0.2);
    s.puffs.forEach((p) => { const H = 34 * g; let x, y, z, rad;
      if (p.u < 0.6) { const u = p.u / 0.6; y = 9 + u * H; x = Math.sin(p.a + u * 3) * (0.6 + u * 2.4); z = -30 + Math.cos(p.a) * 1.2; rad = 1.4 + u * 2.4; }
      else { const u = (p.u - 0.6) / 0.4; y = 9 + H + Math.sin(p.a) * 2; x = Math.cos(p.a) * p.d * 14 * g; z = -30 + Math.sin(p.a) * p.d * 6; rad = 3 + u * 2.5; }
      p.s.position.set(x, y, z); p.s.scale.setScalar(rad * (0.4 + 0.6 * g)); });
    T.dolly(s.stage.camera, t, [[0, { pos: [8, 3, 30], look: [0, 12, -30], fov: V(38, 55) }], [info.dur, { pos: [6, 4, 36], look: [0, 28, -30], fov: V(40, 58) }]]);
  },
  overlay(g, t, info) { const tk = wt('quilômetros', info, 2.2); UI.dimension(g, t, { x1: E.W * 0.86, y1: E.H * 0.62, x2: E.W * 0.86, y2: E.H * 0.12, str: '30 KM', start: tk - 0.3 }); bigNum(g, t, '30 KM', E.W / 2, E.H * 0.78, tk, { size: V(110, 130) }); },
});

// s08 — "com a forma de um pinheiro."  plume vs pine (blueprint)
registerShot('s08', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, c = ui.blueprint, p1 = ease.inOut(prog(t, 0.1, 0.9)), p2 = ease.inOut(prog(t, wt('pinheiro', info, 1.1) - 0.4, wt('pinheiro', info, 1.1) + 0.4));
  const draw = (x, p, kind) => { g.save(); g.strokeStyle = kind ? ui.gold : c; g.lineWidth = 7; g.lineCap = 'round'; g.lineJoin = 'round'; const by = E.H * 0.66, H = V(700, 780);
    g.beginPath(); g.moveTo(x - 40, by); g.lineTo(x - 30, by - H * 0.62 * p); if (p > 0.6) { const q = (p - 0.6) / 0.4; g.quadraticCurveTo(x - 260 * q, by - H * 0.65, x - 220 * q, by - H * 0.82); g.quadraticCurveTo(x, by - H * (0.82 + 0.18 * q), x + 220 * q, by - H * 0.82); g.quadraticCurveTo(x + 260 * q, by - H * 0.65, x + 30, by - H * 0.62); } g.moveTo(x + 40, by); g.lineTo(x + 30, by - H * 0.62 * p); g.stroke(); g.restore(); };
  draw(E.W * 0.28, p1, 0); draw(E.W * 0.72, p2, 1);
  text(g, 'COLUNA', E.W * 0.28, E.H * 0.72, { size: V(44, 48), color: c, font: FONTS.ui, weight: 900, spacing: 4, alpha: p1 });
  text(g, 'PINHEIRO', E.W * 0.72, E.H * 0.72, { size: V(44, 48), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: p2 });
  text(g, '=', E.W / 2, E.H * 0.42, { size: V(120, 140), color: ui.cream, font: FONTS.ui, weight: 900, alpha: p2 });
} });

// s09 — "O sol some,"
registerShot('s09', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.35 + 0.06 * k, x: V(80, 60), y: V(40, 120) }, sun = 1 - prog(t, 0.1, info.dur - 0.2);
  const { M, GY } = street(g, t, cam, { phase: 'erupt', sun });
  veil(g, '#000', 0.45 * (1 - sun));
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.45, y: GY + V(60, 100), s: 2.0, facing: -1, outfit: BAKER, pose: breathe(SHADE_EYES, t), expr: sun < 0.5 ? 'scared' : 'worried', look: [0.3, -1], rim: rim(M, [-0.6, -0.8]) }));
  FX.dust(g, t, { count: 50, color: '#bdb4ac', a: 0.4, speed: -20 });
} });

// s10 — "então começa a chover pedra sem parar."
registerShot('s10', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), [sx, sy] = shake(t, 4, 3), cam = { z: 1.2 + 0.06 * k, x: sx, y: V(20, 60) + sy };
  const { M, GY } = street(g, t, cam, { phase: 'ash', ash: 0.1 + 0.15 * k });
  layer(g, cam, 1, (g) => {
    locals(g, t, GY, M, [{ x: 60, v: 220, run: true, s: 1.05, pose: null, expr: 'scared' }, { x: 1050, v: -240, run: true, f: -1, s: 1.1, expr: 'scared' }, { x: 300, s: 0.95, dy: 40, dim: true, pose: POSES.handsOnHead, expr: 'scared' }]);
    drawFigure(g, { x: E.W * 0.55, y: GY + V(60, 90), s: 1.9, facing: -1, outfit: BAKER, pose: breathe(POSES.handsOnHead, t, 2), expr: 'scared', look: [0, -1], rim: rim(M, [-0.6, -0.8]) });
    const r = rng(20); for (let i = 0; i < 14; i++) { const ph = (t * 1.3 + r()) % 1, x = r() * E.W, h = Math.abs(Math.sin(ph * Math.PI * 2)) * 40 * (1 - ph); circle(g, x, GY + 40 + r() * 140 - h, 7 + r() * 5, alpha('#cfc8c0', 0.8)); }
  });
  pumice(g, t, { count: 140, speed: 1000 });
  FX.dust(g, t, { count: 40, color: '#bdb4ac', a: 0.3 });
} });

// s11 — "Você tem duas escolhas."
const card = (g, t, at, x, label, icon) => { const ui = S().ui, k = ease.outBack(prog(t, at, at + 0.35)); if (k <= 0) return; g.save(); g.translate(x, V(260, 360)); g.scale(k, k);
  const w = V(330, 380), h = V(330, 380); rr(g, -w / 2, -h / 2, w, h, 30); g.fillStyle = ui.card; g.fill(); g.strokeStyle = ui.gold; g.lineWidth = 5; g.stroke();
  text(g, label, 0, -h * 0.34, { size: V(60, 66), color: ui.gold, font: FONTS.ui, weight: 900 }); icon(g, 0, h * 0.12, h * 0.4); g.restore(); };
export const houseIcon = (g, x, y, s) => { const c = S().ui.cream; poly(g, [[x - s * 0.6, y - s * 0.05], [x, y - s * 0.6], [x + s * 0.6, y - s * 0.05]], c); g.fillStyle = c; g.fillRect(x - s * 0.45, y - s * 0.05, s * 0.9, s * 0.6); g.fillStyle = S().ui.card; g.fillRect(x - s * 0.12, y + s * 0.2, s * 0.24, s * 0.35); };
export const runIcon = (g, x, y, s) => UI.lineFigure(g, { x, y: y + s * 0.55, s: s / 230 * 1.0, pose: walkPose(1.2, { run: true }), color: S().ui.cream });
registerShot('s11', { draw(g, t, info) {
  faceShot(g, t, info, { who: BAKER, where: 'bakery', expr: 'worried', look: [0, -0.3], rimSide: 1, push: 0.06, y: V(160, 260), set: { outside: 'ash', fire: 0.7 } });
  card(g, t, wt('duas', info, 0.6), E.W * 0.28, 'A', houseIcon); card(g, t, wt('escolhas', info, 1.0), E.W * 0.72, 'B', runIcon);
} });

// s12 — "Se trancar em casa e esperar passar,"
registerShot('s12', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), thud = Math.max(0, Math.sin(t * 5)) > 0.97 ? 1 : 0, [sx, sy] = shake(t, 3 + 6 * thud, 12), cam = { z: 1.35 + 0.06 * k, x: -V(160, 140) + sx, y: V(50, 120) + sy };
  const door = ease.inOut(prog(t, 0.1, 1.1));
  const { M, GY, B } = bakery(g, t, cam, { fire: 0.6, outside: 'ash', door });
  layer(g, cam, 1, (g) => drawFigure(g, { x: lerp(B.doorX + V(150, 140), B.doorX + V(330, 300), prog(t, 1.2, 1.6)), y: GY, s: 1.9, facing: t < 1.2 ? -1 : 1, outfit: BAKER, pose: breathe(posesAt(t, [[0, POSES.reach], [1.2, POSES.stand], [1.6, POSES.sit]]), t, 1.4), expr: t < 1.2 ? 'determined' : 'nervous', look: t < 1.6 ? [-1, 0] : [0, -1], rim: rim(M, [1, -0.4]) }));
  FX.dust(g, t, { count: 50, color: M.practical, a: 0.4 });
  UI.badge(g, { str: 'A', size: V(80, 90), y: V(140, 280) });
} });

// s13 — "ou fugir no escuro,"  running with a pillow on his head
registerShot('s13', { draw(g, t, info) {
  const x = E.W * 0.25 + t * 280, cam = { z: 1.4, x: t * 250 - V(0, 60), y: V(40, 110) };
  const { M, GY } = street(g, t, cam, { phase: 'night', ash: 0.25, windows: 0.4 });
  veil(g, '#000', 0.2);
  layer(g, cam, 1, (g) => { const f = { x, y: GY + V(60, 90), s: 1.9, facing: 1, outfit: BAKER, pose: walkPose(t * 2 * Math.PI * 1.6, { run: true }), expr: 'scared', look: [1, -0.2], rim: rim(M, [-0.6, -0.8]), trail: { count: 3, dx: -40, a: 0.15 } }; drawFigure(g, f); pillowOn(g, f, M); });
  pumice(g, t, { count: 150, speed: 1100 });
  UI.badge(g, { str: 'B', size: V(80, 90), y: V(140, 280) });
} });

// s14 — "com um travesseiro amarrado na cabeça."
registerShot('s14', { draw(g, t, info) {
  const M = mood('night');
  const { cx, cy, r } = faceShot(g, t, info, { who: BAKER, where: 'street', expr: 'determined', look: [0.3, -0.2], rimSide: -1, rimColor: M.rim, push: 0.06, y: V(200, 300), set: { phase: 'night', ash: 0.2 }, veil: 0.5,
    over: (g, cx, cy, r) => { const c = mix('#efe6d2', M.key, 0.15), tt = wt('travesseiro', info, 0.4), d = ease.out(prog(t, tt - 0.2, tt + 0.3)), py = lerp(cy - r * 3, cy - r * 1.55, d);
      rr(g, cx - r * 1.25 - 8, py - r * 0.45 - 8, r * 2.5 + 16, r * 0.95 + 16, r * 0.4); g.fillStyle = M.rim; g.fill(); rr(g, cx - r * 1.25, py - r * 0.45, r * 2.5, r * 0.95, r * 0.4); g.fillStyle = c; g.fill();
      g.strokeStyle = alpha('#000', 0.12); g.lineWidth = 6; g.beginPath(); g.moveTo(cx - r * 0.9, py); g.quadraticCurveTo(cx, py + r * 0.2, cx + r * 0.9, py); g.stroke();
      const ta = wt('amarrado', info, 0.9); if (t > ta) { const p = ease.out(prog(t, ta, ta + 0.4)); for (const sx of [-1, 1]) seg(g, [[cx + sx * r * 0.95, py + r * 0.2], [cx + sx * r * 0.95, lerp(py + r * 0.2, cy + r * 0.85, p)]], r * 0.07, shade('#8a6a4a', -0.1)); if (p >= 1) { seg(g, [[cx - r * 0.95, cy + r * 0.85], [cx + r * 0.95, cy + r * 0.85]], r * 0.07, shade('#8a6a4a', -0.1)); circle(g, cx, cy + r * 0.88, r * 0.1, shade('#8a6a4a', -0.2)); } }
      for (let i = 0; i < 3; i++) { const ph = (t * 1.2 + i * 0.37) % 1, x0 = cx + (i - 1) * r * 0.7, yy = ph < 0.5 ? lerp(-100, py - r * 0.5, ph * 2) : py - r * 0.5 - Math.sin((ph - 0.5) * 2 * Math.PI) * r * 0.5, xx = ph < 0.5 ? x0 : x0 + (ph - 0.5) * 2 * r * (i - 1 || 1) * 1.2; circle(g, xx, yy, r * 0.09, '#cfc8c0'); } } });
  pumice(g, t, { count: 60, speed: 1000, a: 0.6 });
} });
