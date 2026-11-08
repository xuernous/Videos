// shots/01_choice.js — the price of not trusting: 63 left, odd number, player 9, 41's warning.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { room, roomGround, wallBase, hole, ALARM, depthY } from '../sets/room.js';
import { faceShot, sweat, counter, speakerInsert, players, wave, bgBlur } from '../sets/kit.js';
import { redButton, cabinGeo, boothInterior, boothGlass } from '../sets/booth.js';
import { P77, P41, EXTRA } from '../cast.js';

export const wt = (w, info, d) => (wordTime(w, info.shot.start) ?? info.shot.start + d) - info.shot.start;
const rim = (M, d = [0, -1]) => ({ color: M.rim, dir: d });
export const MED = (k = 0, x = 0) => ({ z: V(1.5, 1.5) + 0.06 * k, x, y: V(40, 150) });
const P9 = EXTRA(9);

// s01 — "Você escolheu não confiar,"  77 + the B vote
registerShot('s01', { draw(g, t, info) {
  const ui = S().ui;
  faceShot(g, t, info, { who: P77, expr: 'determined', look: [0.3, 0], rimSide: -1, push: 0.06, y: V(60, 120) });
  const k = ease.outBack(prog(t, 0.6, 1.0)); if (k <= 0) return;
  g.save(); g.translate(E.W / 2, E.H * 0.18); g.scale(k, k);
  rr(g, -V(280, 300), -70, V(560, 600), 140, 70); g.fillStyle = alpha(ui.accent, 0.15); g.fill(); g.strokeStyle = ui.accent; g.lineWidth = 6; g.stroke();
  circle(g, -V(205, 220), 0, 52, ui.accent); text(g, 'B', -V(205, 220), 4, { size: 64, color: '#0a0812', font: FONTS.ui, weight: 900 });
  text(g, 'NÃO CONFIA', V(40, 45), 4, { size: V(50, 54), color: ui.accent, font: FONTS.ui, weight: 900, spacing: 3 });
  g.restore();
} });

// s02 — "e essa escolha tem um preço."  41 in a cold spotlight
registerShot('s02', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: V(1.45, 1.45) + 0.1 * k, y: V(40, 140) };
  const { M } = room(g, t, cam, { lights: 0.15 }); veil(g, '#000', 0.4);
  layer(g, cam, 1, (g) => {
    g.save(); g.globalCompositeOperation = 'lighter'; FX.lightCone(g, E.W / 2 + 60, -400, { angle: Math.PI / 2, spread: 0.3, len: GY + 600, color: '#ffffff', a: 0.2 }); FX.pool(g, E.W / 2 + 60, GY + 10, 220, 46, '#ffffff', 0.4); g.restore();
    drawFigure(g, { x: E.W / 2 + 60, y: GY, s: 1.9, facing: -1, outfit: P41, pose: breathe(POSES.crossArms, t, 1, 2), expr: t > 1.0 ? 'sad' : 'neutral', look: [-0.6, 0], rim: { color: '#ffffff', dir: [0, -1], w: 5 } });
  });
  FX.dust(g, t, { count: 40, color: '#ffffff', a: 0.3 });
} });

// top-down grid of the floor; n alive dots (s03)
export function topGrid(g, t, info, n, label) {
  const ui = S().ui, M = mood('interiorCool'); backdrop(g, [shade(M.dark, -0.5), shade(M.dark, -0.3)]);
  const N = 10, sz = V(80, 92), ox = E.W / 2 - (N * sz) / 2, oy = E.H * 0.47 - (N * sz) / 2, z = 1 + 0.05 * t;
  g.save(); g.translate(E.W / 2, E.H * 0.47); g.rotate(-0.04 * t); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.47);
  let alive = 0;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) { const x = ox + c * sz, y = oy + r * sz, h = ((r * 7 + c * 13) % 100) < 37;
    rr(g, x + 3, y + 3, sz - 6, sz - 6, 6); g.fillStyle = h ? '#030305' : alpha(mix(M.floor, '#dfe5f2', 0.4), 0.55); g.fill();
    if (h) glow(g, x + sz / 2, y + sz / 2, sz * 0.7, ALARM(), 0.25);
    else if (alive < n) { const isMe = alive === 31, isHim = alive === 33; alive++; circle(g, x + sz / 2, y + sz / 2, sz * 0.22, isMe ? P77.color : isHim ? P41.color : '#e8e4f4'); if (isMe) FX.rings(g, x + sz / 2, y + sz / 2, t, { count: 2, r0: sz * 0.3, r1: sz * 0.8, color: P77.color, a: 0.6 }); } }
  g.restore();
  const k = ease.outBack(prog(t, 0.1, 0.5));
  text(g, 'RESTAM', E.W / 2, E.H * 0.1, { size: V(44, 50), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: clamp(k) });
  text(g, label, E.W / 2, E.H * 0.17, { size: V(150, 170) * (0.85 + 0.15 * k), color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.6), alpha: clamp(k) });
}
// s03 — "Restam 63."
registerShot('s03', { draw(g, t, info) { topGrid(g, t, info, 63, '63'); } });

// s04 — "Número ímpar, diz a voz."
registerShot('s04', { draw(g, t, info) {
  const ui = S().ui;
  speakerInsert(g, t, info, { voice: 1, ringColor: '#ffffff', over: (g, cx, cy) => {
    const k = ease.outBack(prog(t, 0.2, 0.6));
    if (k > 0) { text(g, '63', E.W / 2, E.H * 0.72, { size: V(150, 170) * (0.85 + 0.15 * k), color: ui.gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(ui.gold, 0.6), alpha: clamp(k) });
      text(g, 'ÍMPAR', E.W / 2, E.H * 0.72 + V(120, 140), { size: V(54, 62), color: ui.accent, font: FONTS.ui, weight: 900, spacing: 10, alpha: clamp(k) }); } } });
} });

// s05 — "O jogador 9 não tem parceiro."  pairs + a lone player in a spotlight
registerShot('s05', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: 1.18 + 0.12 * k, y: V(0, 60) };
  const { M } = room(g, t, cam, { lights: 0.5 });
  const sp = ease.out(prog(t, 1.3, 1.5));
  layer(g, cam, 1, (g) => {
    const pairs = [[90, 0.3], [380, 0.2], [700, 0.25], [980, 0.35], [-60, 0.62], [1150, 0.6], [220, 0.7], [860, 0.72]];
    pairs.forEach(([x, d], i) => players(g, t, [{ x: x - 40, d, who: EXTRA(i * 2 + 10), facing: 1, expr: 'worried', seed: i }, { x: x + 40, d, who: EXTRA(i * 2 + 11), facing: -1, expr: 'worried', seed: i + 20 }], M, { s: 1.6 }));
    const x9 = E.W / 2, y9 = depthY(0.95);
    if (sp > 0) { g.save(); g.globalCompositeOperation = 'lighter'; FX.lightCone(g, x9, -500, { angle: Math.PI / 2, spread: 0.25, len: y9 + 600, color: '#ffffff', a: 0.22 * sp }); FX.pool(g, x9, y9 + 8, 200, 40, '#ffffff', 0.45 * sp); g.restore(); }
    players(g, t, [{ x: x9, d: 0.95, who: P9, facing: t > 1.6 ? -1 : 1, expr: sp > 0 ? 'scared' : 'worried', look: [0, -0.6] }], M, { s: 1.6 });
    if (t > 1.6) text(g, '9', x9, y9 - 470, { size: V(80, 90), color: S().ui.cream, font: FONTS.ui, weight: 900, glow: 20, glowColor: 'rgba(255,255,255,.5)', alpha: prog(t, 1.6, 1.9) });
  });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s06 — "Silêncio."
registerShot('s06', { draw(g, t, info) {
  faceShot(g, t, info, { who: P9, expr: 'scared', look: [0, -0.4], rimSide: 1, push: 0.08, over: (g, cx, cy, r) => sweat(g, cx, cy, r, t) });
  veil(g, '#000', 0.15);
} });

// s07 — "O jogador 9 foi eliminado."
registerShot('s07', { draw(g, t, info) {
  const GY = roomGround(), tOpen = wt('eliminado', info, 1.3);
  const [sx, sy] = t > tOpen ? shake(t, 16 * (1 - prog(t, tOpen, tOpen + 1)), 18) : [0, 0];
  const cam = { z: 1.5 + 0.04 * t / info.dur, x: sx, y: V(40, 150) + sy };
  const { M } = room(g, t, cam, { lights: 0.4 });
  layer(g, cam, 1, (g) => {
    const x = E.W / 2, open = ease.out(prog(t, tOpen, tOpen + 0.25));
    g.save(); g.globalCompositeOperation = 'lighter'; FX.lightCone(g, x, -500, { angle: Math.PI / 2, spread: 0.25, len: GY + 600, color: '#ffffff', a: 0.2 * (1 - open) }); g.restore();
    hole(g, [[x - 130, GY - 22], [x + 130, GY - 22], [x + 150, GY + 36], [x - 150, GY + 36]], open, t);
    const fall = Math.max(0, t - tOpen - 0.08), dy = 0.5 * 2600 * fall * fall;
    g.save(); g.beginPath(); g.rect(-E.W, -E.H, E.W * 3, GY + 36 + E.H); g.clip();
    drawFigure(g, { x, y: GY + dy, s: 1.75, facing: 1, outfit: P9, pose: t < tOpen ? breathe(POSES.handsOnHead, t, 3) : POSES.fall, expr: t < tOpen ? 'scared' : 'shocked', rim: rim(M), shadow: t < tOpen });
    g.restore();
  });
  if (t > tOpen) veil(g, ALARM(), 0.14 * (1 - prog(t, tOpen, tOpen + 0.8)), 'lighter');
  counter(g, t > tOpen + 0.3 ? 62 : 63, 1);
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// two-shot 77 + 41 in the hall (s08, s12)
function duo(g, t, info, o) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = MED(k, o.camx || 0);
  const { M } = room(g, t, cam, { lights: 0.7 });
  layer(g, cam, 0.9, (g) => players(g, t, [{ x: 80, d: 0.35, who: EXTRA(31), facing: 1 }, { x: 170, d: 0.35, who: EXTRA(32), facing: -1 }, { x: 860, d: 0.3, who: EXTRA(44), facing: 1 }, { x: 950, d: 0.3, who: EXTRA(45), facing: -1 }], M, { s: 1.5 }));
  layer(g, cam, 1, (g) => {
    const s = 1.85, x77 = E.W / 2 - 150, x41 = E.W / 2 + (o.x41 ?? 110);
    drawFigure(g, { x: x41, y: GY, s, facing: -1, outfit: P41, pose: o.p41(t), expr: o.e41(t), talk: o.talk41 ? o.talk41(t) : 0, rim: rim(M) });
    drawFigure(g, { x: x77, y: GY, s, facing: o.f77 ? o.f77(t) : 1, outfit: P77, pose: o.p77(t), expr: o.e77(t), look: [1, 0], rim: rim(M) });
    o.extra?.(g, GY, s, x77, x41);
  });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
}
const GRAB = { ...POSES.reach, eF: [30, -160], hF: [60, -150] };
// s08 — "Enquanto as duplas se formam, o 41 segura seu braço e sussurra."
registerShot('s08', { draw(g, t, info) {
  const tg = wt('segura', info, 2.4), tw = wt('sussurra', info, 3.6);
  duo(g, t, info, { p41: (t) => posesAt(t, [[0, POSES.stand], [tg - 0.2, GRAB], [tw, { ...GRAB, head: [16, -198] }]]), e41: () => 'determined', p77: (t) => breathe(POSES.stand, t), e77: (t) => (t > tg ? 'surprised' : 'worried'), x41: 60,
    extra: (g, GY, s, x77, x41) => { if (t > tw) FX.rings(g, x41 - 20 * s, GY - 200 * s, t, { count: 2, r0: 20, r1: 80, color: '#e8f0ff', a: 0.4 }); } });
} });
// s09 — "Eu já estive aqui antes."
registerShot('s09', { draw(g, t, info) {
  faceShot(g, t, info, { who: P41, expr: 'worried', talk: talkAmount(info.globalT, 19.6, 20.8) * 0.6, look: [-0.4, 0], rimSide: 1, x: V(60, 40), push: 0.05,
    over: (g, cx, cy, r) => { if (talkAmount(info.globalT, 19.6, 20.8) > 0) FX.rings(g, cx - r * 0.2, cy + r * 0.4, t, { count: 2, r0: r * 0.3, r1: r * 0.8, color: '#e8f0ff', a: 0.25 }); } });
} });
// s10 — "Eu sei como esse jogo termina."  ghost booths behind him
registerShot('s10', { draw(g, t, info) {
  const M = mood('interiorCool');
  faceShot(g, t, info, { who: P41, expr: 'sad', talk: talkAmount(info.globalT, 21.34, 22.9) * 0.6, look: [-0.3, 0.2], rimSide: 1, x: V(60, 40), push: 0.06,
    under: (g, cx, cy, r) => { const a = 0.35 * prog(t, 0.2, 1.0); g.save(); g.globalAlpha *= a; g.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) { const x = E.W * (0.05 + i * 0.25), w = V(200, 200), h = V(420, 440); g.strokeStyle = M.key; g.lineWidth = 4; g.strokeRect(x, E.H * 0.18, w, h); seg(g, [[x + w * 0.25, E.H * 0.18 + 14], [x + w * 0.75, E.H * 0.18 + 14]], 6, M.key); }
      g.restore(); } });
} });
// s11 — "Não aperte o botão."  red button, a hand hovers, a warning X
registerShot('s11', { draw(g, t, info) {
  const geo = cabinGeo(), M = mood('interiorCool');
  blurLayer(g, 12, (g) => { boothInterior(g, { x0: -100, x1: E.W + 100, top: E.H * 0.1, GY: E.H * 0.8 }, t); }); veil(g, '#05050b', 0.35);
  const z = 1.0 + 0.08 * ease.inOut(t / info.dur), bx = E.W / 2, by = E.H * 0.55;
  g.save(); g.translate(bx, by); g.scale(z, z); g.translate(-bx, -by);
  redButton(g, bx, by, 4.2, { floor: E.H * 1.3 });
  const hk = ease.inOut(prog(t, 0.1, 1.0)), hx = lerp(E.W + 200, bx + 120, hk), hy = lerp(by - 700, by - 360, hk), ink = S().ink;
  for (const [c, o] of [[M.rim, -5], [ink, 0]]) { g.save(); g.translate(o, o);
    seg(g, [[hx + 60, hy - 40], [E.W + 500, hy - 400]], 120, o ? c : P77.color); rr(g, hx - 70, hy - 50, 150, 120, 50); g.fillStyle = c; g.fill();
    for (let i = 0; i < 4; i++) seg(g, [[hx - 30 + i * 30, hy + 40], [hx - 50 + i * 34, hy + 120]], 28, c); g.restore(); }
  g.restore();
  const xk = ease.outBack(prog(t, 0.9, 1.3));
  if (xk > 0) { const ui = S().ui; g.save(); g.translate(bx, E.H * 0.22); g.scale(xk, xk); ring(g, 0, 0, 110, 10, ui.accent); seg(g, [[-70, -70], [70, 70]], 12, ui.accent); seg(g, [[70, -70], [-70, 70]], 12, ui.accent); g.restore(); glow(g, bx, E.H * 0.22, 200, ui.accent, 0.3 * clamp(xk)); }
} });
// s12 — "Você puxa o braço."
registerShot('s12', { draw(g, t, info) {
  duo(g, t, info, { p41: (t) => posesAt(t, [[0, GRAB], [0.35, POSES.shrug]]), e41: (t) => (t > 0.35 ? 'surprised' : 'determined'), x41: 60,
    p77: (t) => posesAt(t, [[0, POSES.stand], [0.25, { ...POSES.stand, eF: [-24, -140], hF: [-44, -120], head: [-6, -206] }]], 0.15), e77: (t) => (t > 0.25 ? 'angry' : 'surprised') });
} });
// s13 — "Ninguém volta daqui."
registerShot('s13', { draw(g, t, info) { faceShot(g, t, info, { who: P77, expr: 'confused', look: [0.6, 0], rimSide: -1, push: 0.05 }); } });
// s14 — "Então, como ele voltou?"
registerShot('s14', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: V(1.4, 1.4) + 0.14 * k, y: V(40, 140) };
  const { M } = room(g, t, cam, { lights: 0.2 }); veil(g, '#000', 0.4);
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W / 2, y: GY, s: 1.9, facing: -1, outfit: P41, pose: breathe(POSES.stand, t), expr: 'neutral', rim: { color: M.rim, dir: [1, -0.3], w: 5 } }));
  const tq = wt('voltou', info, 1.2), q = ease.outBack(prog(t, tq, tq + 0.4)), ui = S().ui;
  if (q > 0) text(g, '?', E.W / 2, E.H * 0.2, { size: V(260, 300) * (0.8 + 0.2 * q), color: ui.gold, font: FONTS.title, weight: 700, glow: 40, glowColor: alpha(ui.gold, 0.7), alpha: clamp(q) });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });
