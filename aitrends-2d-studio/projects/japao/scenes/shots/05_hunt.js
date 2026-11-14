// shots/05_hunt.js — Velkun's fort, Sabeth the hunter, fear of the dark, Goruun on the bridge.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, shake, rng, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { enemyCamp, fireOn } from '../sets/camp.js';
import { forest } from '../sets/misc.js';
import { fort, warehouse, waterfall, bridge } from '../sets/fort.js';
import { drawChar, rider, drawDog, faceShot, nameCard, sheath, banner, push, rimOf, blinkAt, PZ, arrow, flame, embers, grassBlades, talkRings, drawSword, KZ_RED, STEEL } from '../sets/lib.js';
import { HAYATO, SAYO, VELKUN, SABETH, GORUUN, SOLDIER, IKI } from '../cast.js';
import { wt } from './01_open.js';
import { markShot } from './03_attack.js';

const tk = (info, a, b) => talkAmount(info.globalT, info.shot.start + a, info.shot.start + b);
const PRISONER = { top: 'tshirt', color: '#4a4440', head: 'bun', x: [] };
const forestBg = (o = {}) => (g, t) => forest(g, t, { z: o.z ?? 1.5, x: o.x ?? 0, y: o.y ?? -60 }, o);

// s115 — "Velkun, o Engenheiro,"
registerShot('s115', { draw(g, t, info) {
  UI.blueprint(g); const bp = S().ui.blueprint, k = ease.out(prog(t, 0, 1.4));
  g.save(); g.globalAlpha = 0.7; g.strokeStyle = bp; g.lineWidth = 3; for (let i = 0; i < 9; i++) { const x = E.W * 0.45 + i * 100; g.beginPath(); g.moveTo(x, E.H * 0.75); g.lineTo(x, E.H * 0.75 - 300 * k); g.lineTo(x + 50, E.H * 0.75 - 330 * k); g.stroke(); } g.strokeRect(E.W * 0.45 - 40, E.H * 0.75 - 460 * k, 120, 460 * k); g.strokeRect(E.W * 0.45 + 820, E.H * 0.75 - 460 * k, 120, 460 * k); g.restore();
  drawChar(g, { x: E.W * 0.28, y: E.H * 0.86, s: 1.9, facing: 1, outfit: VELKUN, pose: breathe({ ...POSES.holdFront }, t), expr: 'smirk', rim: { color: bp, dir: [1, -0.4], w: 5 }, prop: 'paper' });
  nameCard(g, t, info.dur, 'VELKUN', 'O ENGENHEIRO', { x: E.W * 0.52, y: E.H * 0.2 });
} });
// s116 — "ergueu em Hakata um forte que ninguém podia invadir."
registerShot('s116', { draw(g, t, info) { const cam = push(t, info, { z0: 0.95, dz: 0.08, y0: -20 }); fort(g, t, cam); FX.dust(g, t, { count: 20, color: '#cfe0ff', a: 0.2 }); } });
// s117 — "Hayato não invadiu."
registerShot('s117', { draw(g, t, info) {
  const cam = push(t, info, { z0: 0.85, dz: 0.03, x0: 160 }), geo = fort(g, t, cam);
  g.fillStyle = '#05040a'; g.beginPath(); g.moveTo(-50, E.H + 20); g.quadraticCurveTo(E.W * 0.25, E.H * 0.7, E.W * 0.55, E.H + 20); g.fill();
  drawChar(g, { x: E.W * 0.27, y: E.H * 0.79, s: 1.9, facing: 1, outfit: HAYATO, pose: breathe(POSES.crouch, t), expr: 'determined', rim: rimOf(geo.M, [0.6, -1], 6), weapon: ['bowBack', 'sheath'] });
} });
// s118 — "Primeiro, libertou os prisioneiros japoneses que tinham sido forçados a construí-lo."
registerShot('s118', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.5, 1.6), dz: 0.05, x0: -100, y0: 150 }), geo = fort(g, t, cam); const cut = 1.4;
  layer(g, cam, 1, (g) => { for (let i = 0; i < 4; i++) { const x = geo.CX - 120 + i * 150, freed = t > cut + i * 0.4, run = Math.max(0, t - cut - i * 0.4 - 0.4); drawChar(g, { x: x - run * 380, y: geo.GY, s: 1.15, facing: freed ? -1 : 1, outfit: PRISONER, pose: !freed ? breathe({ ...POSES.kneel, eF: [-10, -110], hF: [-30, -100], eB: [-12, -108], hB: [-30, -96] }, t, 0.5, i) : run > 0 ? walkPose(run * 9, { run: true }) : POSES.stand, expr: freed ? 'surprised' : 'sad', rim: rimOf(geo.M, [0.5, -1], 4) }); }
    const hx = geo.CX - 360 + Math.min(1, t / cut) * 200 + prog(t, cut, info.dur) * 400; drawChar(g, { x: hx, y: geo.GY, s: 1.2, facing: 1, outfit: HAYATO, pose: t < cut ? walkPose(t * 4, { stride: 14 }) : PZ.slash, expr: 'determined', rim: rimOf(geo.M, [0.5, -1], 4), weapon: t > cut - 0.3 ? 'sword' : 'sheath', swordAng: -0.2 }); });
} });
// s119 — "Depois, numa noite de vento,"
registerShot('s119', { draw(g, t, info) { const cam = push(t, info, { z0: 1.05, dz: 0.04, x0: -60, dx: 120 }); fort(g, t, cam, { wind: 1 }); grassBlades(g, t * 2.5, { y: E.H + 20, count: 80, h: 300, color: '#06050a', wind: 2.5, seed: 7 }); FX.dust(g, t * 3, { count: 60, color: '#cfe0ff', a: 0.25, speed: 10 }); } });
// s120 — "disparou seis flechas acesas no feno dos armazéns."
registerShot('s120', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, dz: 0.04 }), geo = fort(g, t, cam, { wind: 1, fire: 0.25 * prog(t, 2.5, info.dur) });
  layer(g, cam, 0.8, (g) => { for (let i = 0; i < 3; i++) warehouse(g, geo.fortX - 300 + i * 300, geo.GY - 40, 180); });
  layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 760, y: geo.GY + 20, s: 1.1, facing: 1, outfit: HAYATO, pose: PZ.aimUp, drawK: (t * 1.2) % 1 < 0.7 ? 1 : 0, expr: 'determined', rim: { color: '#ff9a5a', dir: [1, -0.4], w: 4 }, weapon: ['bow', 'sheath'] });
    for (let i = 0; i < 6; i++) { const t0 = 0.3 + i * 0.75, p = prog(t, t0, t0 + 1.0); if (p <= 0) continue; const x0 = geo.CX - 680, y0 = geo.GY - 260, x1 = geo.fortX - 300 + (i % 3) * 300, y1 = geo.GY - 140; const x = lerp(x0, x1, p), y = lerp(y0, y1, p) - Math.sin(p * Math.PI) * 360; if (p < 1) arrow(g, x, y, Math.atan2((y1 - y0) - Math.cos(p * Math.PI) * 360 * Math.PI, x1 - x0), 0.9, { fire: 1, t: t + i, trail: 120 }); else flame(g, x1 + (i - 2) * 20, y1, 30, t + i); } });
  const n = Math.min(6, Math.floor(prog(t, 0.3, 0.3 + 6 * 0.75) * 6 + 0.001)); UI.badge(g, { str: `${n} / 6`, size: V(52, 56), a: prog(t, 0.2, 0.5) });
} });
// s121/s122 — chain reaction blueprint
function chain(g, t, info, stage) {
  UI.blueprint(g); const ui = S().ui, bp = ui.blueprint, items = [['FOGO', '#ff8a3a'], ['ÓLEO', '#d8b04a'], ['PICHE', '#9a8aff']], xs = [0.2, 0.5, 0.8];
  items.forEach(([lab, c], i) => { const on = i < stage ? 1 : i === stage ? ease.out(prog(t, 0.3, 0.8)) : 0, x = E.W * xs[i], y = E.H * 0.48, show = i <= stage ? 1 : 0.25;
    g.save(); g.globalAlpha = show; ring(g, x, y, 120, 5, mix(bp, c, on)); if (on > 0) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y, 220, c, 0.35 * on); g.restore(); }
    if (i === 0) flame(g, x, y + 50, 60, t); if (i === 1) { rr(g, x - 50, y - 60, 100, 120, 14); g.fillStyle = mix('#3a3020', c, on * 0.6); g.fill(); seg(g, [[x - 50, y - 20], [x + 50, y - 20]], 5, '#1a1410'); seg(g, [[x - 50, y + 20], [x + 50, y + 20]], 5, '#1a1410'); } if (i === 2) { rr(g, x - 60, y - 40, 120, 90, 10); g.fillStyle = mix('#1a1420', c, on * 0.5); g.fill(); circle(g, x, y - 40, 60, '#0a080c'); }
    text(g, lab, x, y + 180, { size: 46, font: FONTS.ui, weight: 900, color: mix(ui.cream, c, on), spacing: 6 }); g.restore();
    if (i > 0) { const p = i < stage ? 1 : i === stage ? ease.out(prog(t, 0.1, 0.5)) : 0; const ax = E.W * xs[i - 1] + 140, bx = E.W * xs[i] - 140; seg(g, [[ax, y], [lerp(ax, bx, p), y]], 6, ui.gold); if (p > 0.98) poly(g, [[bx + 10, y], [bx - 14, y - 14], [bx - 14, y + 14]], ui.gold); } });
  if (stage === 2) { const b = prog(t, 0.9, 1.5); if (b > 0) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.8, E.H * 0.48, 900 * ease.out(b), '#ffb050', 0.6 * (1 - b * 0.6)); g.restore(); } }
}
registerShot('s121', { draw(g, t, info) { chain(g, t, info, 1); } });
registerShot('s122', { draw(g, t, info) { const [sx, sy] = shake(t, t > 0.9 && t < 1.5 ? 10 : 0, 20); g.save(); g.translate(sx, sy); chain(g, t, info, 2); g.restore(); } });
// s123 — "O forte queimou com seu criador dentro."
registerShot('s123', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, dz: 0.12, x0: 0, dx: 110, y0: -20, dy: -40 }), geo = fort(g, t, cam, { fire: 1, wind: 0.6 });
  layer(g, cam, 0.55, (g) => { const tx = geo.fortX + 240, top = geo.GY - 360; drawFigure(g, { x: tx, y: top - 70, s: 0.45, facing: -1, outfit: VELKUN, pose: POSES.handsOnHead, expr: 'shocked', rim: { color: '#ffb050', dir: [0, -1], w: 3 } }); });
} });
registerShot('s124', { draw(g, t, info) { markShot(g, t, info, 3); } });
// s125 — "O império mandou Sabeth, o Caçador,"
registerShot('s125', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, dz: 0.05, x0: -60, y0: 110 }), geo = forest(g, t, cam, { mood: 'dusk', moon: false });
  layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 160, y: geo.GY, s: 1.6, facing: 1, outfit: SABETH, pose: breathe(POSES.relaxed, t), expr: 'smirk', rim: rimOf(geo.M, [-1, -0.4], 5), weapon: ['bowBack', 'sheath'] }); drawDog(g, geo.CX + 110, geo.GY + 10, 1.4, 1, t, { run: false, rim: rimOf(geo.M, [-1, -0.4]) }); drawDog(g, geo.CX - 420, geo.GY + 20, 1.3, -1, t + 1, { run: false, rim: rimOf(geo.M, [-1, -0.4]) }); });
  nameCard(g, t, info.dur, 'SABETH', 'O CAÇADOR', { a: prog(t, wt('sabeth', info, 1) - 0.2, wt('sabeth', info, 1) + 0.2) });
} });
// s126 — "com seus cães e rastreadores."
registerShot('s126', { draw(g, t, info) {
  const cam = { z: 1.2, x: 180 * t, y: 60 }, geo = forest(g, t, cam, { mood: 'dusk', moon: false });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 4; i++) drawDog(g, geo.CX - 500 + i * 230 + t * 260, geo.GY + 10 + (i % 2) * 18, 1.2, 1, t + i * 0.3, { rim: rimOf(geo.M, [-1, -0.4]) }); for (let i = 0; i < 2; i++) drawChar(g, { x: geo.CX - 780 + i * 160 + t * 250, y: geo.GY, s: 1.15, facing: 1, outfit: SOLDIER, pose: walkPose(t * 7 + i, { run: true }), expr: 'determined', rim: rimOf(geo.M, [-1, -0.4]) }); });
} });
// s127 — "Ele nunca tinha falhado."
registerShot('s127', { draw(g, t, info) { faceShot(g, t, info, { bg: forestBg({ mood: 'dusk', moon: false }), who: SABETH, expr: 'smirk', mood: 'dusk', rimSide: -1, look: [0.4, 0] }); } });
// s128/s129 — footprints in the mud
function prints(g, t, info, kid) {
  backdrop(g, ['#2a2018', '#1a120c']); const r = rng(8); for (let i = 0; i < 60; i++) circle(g, r() * E.W, r() * E.H, 6 + r() * 20, alpha('#0e0a06', 0.4)); for (let i = 0; i < 30; i++) seg(g, [[r() * E.W, r() * E.H], [r() * E.W + 30, r() * E.H + 10]], 4, alpha('#3a2a1c', 0.6));
  const z = 1 + 0.06 * t / info.dur; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.rotate(-0.4); g.translate(-E.W / 2, -E.H / 2);
  const foot = (x, y, s, sd) => { g.fillStyle = '#0c0805'; g.beginPath(); g.ellipse(x, y, 34 * s, 80 * s, 0, 0, Math.PI * 2); g.fill(); g.beginPath(); g.ellipse(x, y - 110 * s, 28 * s, 36 * s, 0, 0, Math.PI * 2); g.fill(); };
  for (let i = 0; i < 5; i++) foot(E.W * 0.12 + i * 380, E.H * 0.42 + (i % 2) * 90, 0.9, i % 2);
  if (kid) for (let i = 0; i < 8; i++) { const a = prog(t, 0.2 + i * 0.12, 0.4 + i * 0.12); if (a > 0) { g.save(); g.globalAlpha = a; foot(E.W * 0.1 + i * 240, E.H * 0.66 + (i % 2) * 50, 0.48, i % 2); g.restore(); } }
  g.restore(); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.3, E.H * 0.2, 800, '#c8b0ff', 0.08); g.restore();
}
registerShot('s128', { draw(g, t, info) { prints(g, t, info, false); UI.badge(g, { str: 'DIA 4', size: V(52, 56), a: prog(t, wt('quatro', info, 0.4) - 0.1, wt('quatro', info, 0.4) + 0.3) }); } });
registerShot('s129', { draw(g, t, info) { prints(g, t, info, true); UI.badge(g, { str: 'DIA 4', size: V(52, 56) }); } });
// s130 — "Pela primeira vez, Hayato sentiu medo."
registerShot('s130', { draw(g, t, info) { faceShot(g, t, info, { bg: forestBg({ mood: 'dusk', moon: false }), who: HAYATO, expr: 'scared', mood: 'dusk', rimSide: 1, look: [-0.5, 0.1], push: 0.1, shakeAmp: 1.5 }); } });
// s131 — "Escondeu Sayo numa caverna atrás de uma cachoeira e disse:"
registerShot('s131', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.05, dz: 0.05, x0: -40, dx: 80 }), geo = waterfall(g, t, cam);
  layer(g, cam, 1, (g) => { const x = geo.CX - 700 + Math.min(t, info.dur * 0.85) * 160; drawChar(g, { x, y: geo.GY, s: 1.0, facing: 1, outfit: HAYATO, pose: walkPose(t * 5), expr: 'worried', rim: rimOf(geo.M, [-0.6, -1], 4), weapon: ['sheath', 'bowBack'] }); drawChar(g, { x: x - 80, y: geo.GY + 4, s: 1.0, facing: 1, outfit: SAYO, pose: walkPose(t * 7), expr: 'scared', rim: rimOf(geo.M, [-0.6, -1], 4) }); });
} });
// s132 — "Se eu não voltar, vá para o leste."  inside the cave, falls in front
registerShot('s132', { draw(g, t, info) {
  backdrop(g, ['#08070c', '#120e14']); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W / 2, E.H * 0.6, 700, '#ffb070', 0.12); g.restore();
  const z = 1 + 0.05 * t / info.dur; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); const GY = E.H * 0.86;
  g.fillStyle = '#0c0a10'; g.fillRect(0, GY, E.W, E.H); flame(g, E.W * 0.5, GY - 4, 22, t); FX.pool(g, E.W * 0.5, GY, 300, 40, '#ff9a4a', 0.3);
  drawChar(g, { x: E.W * 0.38, y: GY, s: 1.8, facing: 1, outfit: HAYATO, pose: breathe({ ...POSES.kneel, eF: [34, -116], hF: [58, -130] }, t), expr: 'sad', talk: tk(info, 0, info.dur - 0.2), rim: { color: '#ffb070', dir: [1, -0.3], w: 5 }, weapon: 'sheath' });
  drawChar(g, { x: E.W * 0.64, y: GY, s: 1.8, facing: -1, outfit: SAYO, pose: breathe(POSES.stand, t, 1.2, 2), expr: 'cry', rim: { color: '#ffb070', dir: [-1, -0.3], w: 5 } });
  g.restore();
  for (let i = 0; i < 60; i++) { const x = (i / 60) * E.W + Math.sin(i * 5) * 10; g.strokeStyle = alpha('#cfe0ff', 0.03 + 0.025 * ((i * 7) % 5)); g.lineWidth = 6; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } FX.rain(g, t, { count: 120, angle: 0, speed: 1600, color: '#e0ecff', a: 0.25, len: 80 });
} });
// s133 — "Depois, deixou que o encontrassem."
registerShot('s133', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.4, dz: 0.05, y0: 100 }), geo = forest(g, t, cam, { mood: 'dusk', moon: false }); const snap = 1.0;
  layer(g, cam, 1, (g) => { const bx = geo.CX + 60; drawChar(g, { x: geo.CX - 120, y: geo.GY, s: 1.5, facing: 1, outfit: HAYATO, pose: t < snap ? POSES.holdFront : POSES.relaxed, look: t > snap ? [-1, 0] : [0, 0.5], expr: 'determined', rim: rimOf(geo.M, [-1, -0.4]), weapon: ['sheath', 'bowBack'] }); const br = t < snap ? 0 : 0.5; seg(g, [[bx - 60, geo.GY - 210], [bx, geo.GY - 230]], 8, '#1a1210'); seg(g, [[bx, geo.GY - 230], [bx + 70 * Math.cos(br), geo.GY - 230 + 70 * Math.sin(br)]], 8, '#1a1210'); if (t > snap && t < snap + 0.6) FX.rings(g, bx, geo.GY - 230, t - snap, { color: '#fff1e6', r0: 10, r1: 90, a: 0.5 }); });
} });
// s134 — "Por seis dias, Sabeth o perseguiu."
registerShot('s134', { draw(g, t, info) {
  const cam = { z: 1.15, x: 260 * t, y: 40 }, geo = forest(g, t, cam, { mood: 'night' });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 3; i++) drawDog(g, geo.CX - 300 + i * 200 + t * 380, geo.GY + 10 + (i % 2) * 14, 1.2, 1, t + i * 0.3, { rim: rimOf(geo.M, [-0.6, -1]) }); drawChar(g, { x: geo.CX - 600 + t * 370, y: geo.GY, s: 1.2, facing: 1, outfit: SABETH, pose: walkPose(t * 8, { run: true }), expr: 'angry', rim: rimOf(geo.M, [-0.6, -1]), weapon: 'bowBack' }); });
  UI.badge(g, { str: `DIA ${1 + Math.min(5, Math.floor(prog(t, 0, info.dur - 0.2) * 6))}`, size: V(52, 56) });
} });
// s135 — top-down: the trail led to a clearing
registerShot('s135', { draw(g, t, info) {
  backdrop(g, ['#0e1a14', '#0a120e']); const r = rng(11); for (let i = 0; i < 200; i++) { const x = r() * E.W, y = r() * E.H; if (Math.hypot(x - E.W * 0.78, y - E.H * 0.45) < 170) continue; circle(g, x, y, 24 + r() * 30, mix('#0e2a1c', '#1a3a26', r())); }
  circle(g, E.W * 0.78, E.H * 0.45, 160, alpha('#3a5a3a', 0.6)); const ui = S().ui;
  const path = (u) => [lerp(E.W * 0.08, E.W * 0.78, u), E.H * 0.6 + Math.sin(u * 9) * 160 - u * 120]; const p = ease.inOut(prog(t, 0.2, info.dur - 0.5));
  g.setLineDash([14, 14]); g.strokeStyle = alpha(ui.gold, 0.9); g.lineWidth = 5; g.beginPath(); for (let i = 0; i <= 100; i++) { const [x, y] = path(i / 100 * p); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.setLineDash([]);
  const [hx, hy] = path(p); circle(g, hx, hy, 14, '#d64a33'); glow(g, hx, hy, 50, '#d64a33', 0.6); for (let k = 1; k <= 4; k++) { const [dx, dy] = path(Math.max(0, p - 0.06 * k)); circle(g, dx, dy, 9, ui.cream); }
  if (p > 0.95) { const a = prog(t, info.dur - 0.6, info.dur - 0.3); seg(g, [[E.W * 0.78 - 40, E.H * 0.45 - 40], [E.W * 0.78 + 40, E.H * 0.45 + 40]], 8, alpha(ui.accent, a)); seg(g, [[E.W * 0.78 + 40, E.H * 0.45 - 40], [E.W * 0.78 - 40, E.H * 0.45 + 40]], 8, alpha(ui.accent, a)); }
  text(g, 'CLAREIRA', E.W * 0.78, E.H * 0.45 - 200, { size: 36, font: FONTS.ui, weight: 900, color: ui.cream, spacing: 6, alpha: prog(t, 1.5, 2) });
} });
// s136 — "O último rastreador ouviu Sabeth gritar para a floresta:"
registerShot('s136', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.6, dz: 0.06, x0: -200, y0: 120 }), geo = forest(g, t, cam, { mood: 'night' });
  layer(g, cam, 1, (g) => { g.fillStyle = '#05040a'; g.fillRect(geo.CX - 120, -E.H, 110, geo.GY + E.H + 40); drawChar(g, { x: geo.CX - 230, y: geo.GY, s: 1.4, facing: -1, outfit: SOLDIER, pose: breathe(POSES.crouch, t, 2), expr: 'scared', look: [1, -0.2], rim: rimOf(geo.M, [-0.6, -1]) }); });
  FX.rings(g, E.W * 0.85, E.H * 0.4, t, { color: '#ffd0c0', r0: 30, r1: 220, a: 0.3, count: 4 });
} });
// s137 — "O que é você?"
registerShot('s137', { draw(g, t, info) { faceShot(g, t, info, { bg: forestBg({ mood: 'night' }), who: SABETH, expr: 'scared', talk: tk(info, 0, info.dur - 0.1), mood: 'night', rimSide: 1, look: [-0.6, -0.2], shakeAmp: 3, over: (g, cx, cy, r) => talkRings(g, cx - r * 1.1, cy, t) }); } });
// s138 — "A floresta não respondeu."
registerShot('s138', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.08 }); forest(g, t, cam, { mood: 'night' }); veil(g, '#000', 0.3); FX.fog(g, E.H * 0.55, 400, '#8a90c0', 0.25); } });
registerShot('s139', { draw(g, t, info) { markShot(g, t, info, 4, { mood: 'night', glowC: '#8a9aff' }); } });
// s140 — "Quando Hayato voltou à cachoeira, Sayo ainda estava lá."
registerShot('s140', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.25, dz: 0.05, x0: 60, y0: 60 }), geo = waterfall(g, t, cam, { mood: 'dusk', part: true, cave: 1 });
  layer(g, cam, 1, (g) => { const out = ease.out(prog(t, 1.2, 2.6)); drawChar(g, { x: geo.fallX - out * 300, y: geo.GY - 10 + out * 10, s: 1.2, facing: -1, outfit: SAYO, pose: out < 1 ? walkPose(t * 7) : POSES.stand, expr: t > 2 ? 'joy' : 'surprised', rim: rimOf(geo.M, [-1, -0.4]), alpha: 0.4 + 0.6 * clamp(out * 2) }); drawChar(g, { x: geo.CX - 700 + Math.min(t, 1.8) * 160, y: geo.GY, s: 1.2, facing: 1, outfit: HAYATO, pose: t < 1.8 ? walkPose(t * 4.2, { stride: 14 }) : POSES.stand, expr: 'surprised', rim: rimOf(geo.M, [-1, -0.4]), weapon: ['sheath', 'bowBack'] }); });
} });
// s141 — "Não tinha ido para o leste."
registerShot('s141', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.8, 1.9), dz: 0.06, x0: -140, y0: 200 }), geo = waterfall(g, t, cam, { mood: 'dusk', part: true, cave: 1 });
  layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 230, y: geo.GY, s: 1.25, facing: 1, outfit: HAYATO, pose: breathe(PZ.hug, t, 0.5), expr: 'happy', rim: rimOf(geo.M, [-1, -0.4]), weapon: 'sheath' }); drawChar(g, { x: geo.CX - 120, y: geo.GY, s: 1.25, facing: -1, outfit: SAYO, pose: breathe({ ...POSES.stand, eF: [30, -150], hF: [46, -160], eB: [26, -146], hB: [44, -156] }, t, 0.5, 2), expr: 'joy', rim: rimOf(geo.M, [-1, -0.4]) }); });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });
// s142 — "Os soldados pararam de sair à noite."
function huddle(g, t, info, cam, o = {}) {
  const geo = enemyCamp(g, t, cam, { fires: 0 }); layer(g, cam, 1, (g) => { const fx = geo.CX; flame(g, fx, geo.GY - 10, 56, t); FX.pool(g, fx, geo.GY, 560, 90, '#ff9a4a', 0.4);
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2, x = fx + Math.cos(a) * 240, f = Math.cos(a) > 0 ? -1 : 1; drawChar(g, { x, y: geo.GY + Math.sin(a) * 26, s: 1.0, facing: f, outfit: SOLDIER, pose: breathe(PZ.sitFire, t, 1, i), expr: i % 2 ? 'scared' : 'nervous', look: [-f, 0], rim: { color: '#ffb070', dir: [-f, -0.3], w: 4 } }); } });
  g.save(); g.globalCompositeOperation = 'source-over'; g.fillStyle = 'radial-gradient'; g.restore(); const vg = g.createRadialGradient(E.W / 2, E.H * 0.7, 200, E.W / 2, E.H * 0.7, 1000); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(0,0,0,${o.dark ?? 0.85})`); g.fillStyle = vg; g.fillRect(0, 0, E.W, E.H);
  return geo;
}
registerShot('s142', { draw(g, t, info) { huddle(g, t, info, push(t, info, { z0: 1.3, dz: 0.05, y0: 100 })); } });
// s143 — "As fogueiras ficavam acesas até o amanhecer."
registerShot('s143', { draw(g, t, info) { const p = prog(t, 0, info.dur); huddle(g, t * 3, info, push(t, info, { z0: 1.1, dz: 0.03, y0: 60 }), { dark: 0.85 - 0.5 * p }); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.8, E.H * 0.4, 1200, '#ff9a6a', 0.3 * ease.in(p)); g.restore(); UI.badge(g, { str: p < 0.8 ? 'NOITE' : 'AMANHECER', size: V(46, 50) }); } });
// s144 — "O império mais poderoso daquele mar tinha aprendido a temer o escuro."
registerShot('s144', { draw(g, t, info) { faceShot(g, t, info, { bg: (g, t) => enemyCamp(g, t, { z: 1.5, y: 40 }), who: SOLDIER, expr: 'scared', mood: 'night', rimColor: '#ffb070', rimSide: -1, look: [1, 0], push: 0.12, x: -200, blinkP: 1.8 }); veil(g, '#000', 0.25 * prog(t, 1, info.dur)); } });
// s145 — "Então veio Goruun, o Gigante,"
registerShot('s145', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, dz: 0.06, y0: -60, dy: -30 }), geo = bridge(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX + 60, y: geo.GY + 10, s: 2.1, facing: -1, outfit: GORUUN, pose: breathe({ ...POSES.relaxed, eF: [20, -150], hF: [40, -120] }, t, 1.5), expr: 'angry', rim: rimOf(geo.M, [1, -0.5], 7), weapon: 'mace', maceAng: -1.0 }));
  nameCard(g, t, info.dur, 'GORUUN', 'O GIGANTE');
} });
// s146 — "campeão do exército, que o desafiou a um duelo sobre uma ponte."
function bankCrowd(g, geo, t, o = {}) { for (let i = 0; i < 18; i++) { const sd = i % 2 ? 1 : -1, k = Math.floor(i / 2); drawFigure(g, { x: geo.CX + sd * (820 + k * 70), y: geo.GY + 30 + (k % 3) * 20, s: 0.7, facing: -sd, outfit: SOLDIER, pose: breathe(o.cheer ? (Math.sin(t * 6 + i) > 0 ? POSES.cheer : POSES.stand) : POSES.stand, t, 1, i), expr: o.expr || 'smirk', rim: rimOf(geo.M, [1, -0.5], 3) }); } }
registerShot('s146', { draw(g, t, info) { const cam = push(t, info, { z0: 0.9, dz: 0.05 }), geo = bridge(g, t, cam, { mood: 'dusk' }); layer(g, cam, 1, (g) => { bankCrowd(g, geo, t); drawChar(g, { x: geo.CX, y: geo.GY + 10, s: 1.5, facing: -1, outfit: GORUUN, pose: breathe(POSES.crossArms, t), expr: 'smirk', rim: rimOf(geo.M, [1, -0.5], 4), weapon: 'mace', maceAng: -1.4 }); }); } });
// s147 — "Por sete dias, ninguém apareceu, e os soldados riram."
registerShot('s147', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.04, x0: -200 }), geo = bridge(g, t * 2, cam, { mood: 'dusk' }); layer(g, cam, 1, (g) => { bankCrowd(g, geo, t, { cheer: t > 2, expr: t > 2 ? 'joy' : 'smirk' }); drawChar(g, { x: geo.CX, y: geo.GY + 10, s: 1.5, facing: -1, outfit: GORUUN, pose: breathe(POSES.crossArms, t), expr: 'smirk', rim: rimOf(geo.M, [1, -0.5], 4), weapon: 'mace', maceAng: -1.4 }); }); UI.badge(g, { str: `DIA ${1 + Math.min(6, Math.floor(prog(t, 0, 2.2) * 7))}`, size: V(52, 56) }); } });
// s148 — "No oitavo dia, Hayato apareceu."
registerShot('s148', { draw(g, t, info) { const cam = push(t, info, { z0: 1.2, dz: 0.05, x0: -260, y0: 60 }), geo = bridge(g, t, cam, { mood: 'dusk', fog: 1 }); layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX - 760 + Math.min(t, 2) * 90, y: geo.GY + 10, s: 1.25, facing: 1, outfit: HAYATO, pose: t < 2 ? walkPose(t * 4, { stride: 14 }) : POSES.stand, expr: 'determined', rim: rimOf(geo.M, [1, -0.5]), weapon: 'sheath', alpha: 0.4 + 0.6 * prog(t, 0, 1.2) })); UI.badge(g, { str: 'DIA 8', size: V(52, 56) }); } });
// s149 — "Sem arco."   s150 — "Só a tachi."
registerShot('s149', { draw(g, t, info) { blurLayer(g, 12, (g) => bridge(g, t, { z: 1.6, y: 120 }, { fog: 1 })); veil(g, '#08060a', 0.35); const z = 1 + 0.05 * t; g.save(); g.translate(E.W / 2, E.H * 0.7); g.scale(z, z); g.fillStyle = '#1a1210'; g.fillRect(-900, 40, 1800, 300); g.strokeStyle = S().ink; g.lineWidth = 14; g.beginPath(); g.moveTo(-600, 20); g.quadraticCurveTo(0, -60, 600, 30); g.stroke(); seg(g, [[-600, 20], [600, 30]], 3, alpha('#d8d0c0', 0.7)); g.restore(); } });
registerShot('s150', { draw(g, t, info) { blurLayer(g, 12, (g) => bridge(g, t, { z: 1.6, y: 120 }, { fog: 1 })); veil(g, '#08060a', 0.35); const k = ease.inOut(t / info.dur); g.fillStyle = '#262c44'; g.fillRect(0, E.H * 0.2, E.W, E.H * 0.8); seg(g, [[E.W * 0.1, E.H * 0.7], [E.W * 0.9, E.H * 0.52]], 34, '#120808'); seg(g, [[E.W * 0.62, E.H * 0.565], [E.W * 0.95, E.H * 0.48]], 40, '#16100e'); g.fillStyle = '#0c0a0a'; g.beginPath(); g.ellipse(E.W * 0.62, E.H * 0.565, 14, 60, -0.2, 0, Math.PI * 2); g.fill(); const hx = E.W * (0.82 - 0.04 * k); seg(g, [[hx, E.H * 0.52], [hx + 40, E.H * 0.2]], 60, '#262c44'); circle(g, hx, E.H * 0.51, 52, S().ink); for (let i = 0; i < 4; i++) seg(g, [[hx - 40 + i * 26, E.H * 0.47], [hx - 40 + i * 26, E.H * 0.56]], 20, S().ink); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.6, E.H * 0.56, 120, '#fff2d8', 0.4 * prog(t, 0.2, 0.6)); g.restore(); } });
// s151 — "Desviou de cada golpe da maça"
registerShot('s151', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.3, 1.4), dz: 0.04, y0: 0 }), geo = bridge(g, t, cam, { mood: 'dusk', fog: 0.4 }); const sw = (t * 0.9) % 1, ang = -1.6 + ease.inOut(clamp(sw * 1.6)) * 2.2;
  layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX + 200, y: geo.GY + 10, s: 2.1, facing: -1, outfit: GORUUN, pose: { ...POSES.ready, eF: [30, -170], hF: [44, -170] }, expr: 'angry', rim: rimOf(geo.M, [1, -0.5], 6), weapon: 'mace', maceAng: ang }); const dodge = sw > 0.35 && sw < 0.75; drawChar(g, { x: geo.CX - 260 - (dodge ? 60 : 0), y: geo.GY + 10 - (dodge && Math.floor(t * 0.9) % 2 ? 60 : 0), s: 1.35, facing: 1, outfit: HAYATO, pose: dodge ? (Math.floor(t * 0.9) % 2 ? POSES.jump : POSES.crouch) : PZ.guard, expr: 'determined', rim: rimOf(geo.M, [1, -0.5]), weapon: 'sword', swordAng: -0.6 }); });
  if (Math.abs(((t * 0.9) % 1) - 0.4) < 0.05) FX.speedLines(g, t, { count: 30, a: 0.25 });
} });
// s152 — "até a ponte ceder sob o peso do gigante."
registerShot('s152', { draw(g, t, info) {
  const br = ease.in(prog(t, 0.3, 1.4)), [sx, sy] = shake(t, br > 0 && br < 1 ? 12 : 2, 18); const cam = { z: 1.1, x: sx, y: sy }, geo = bridge(g, t, cam, { mood: 'dusk', broken: br, fog: 0.3 });
  layer(g, cam, 1, (g) => { const fall = ease.in(prog(t, 1.0, info.dur)); drawChar(g, { x: geo.CX + 20, y: geo.GY + 10 + fall * 700 + br * 80, s: 1.8, facing: -1, outfit: GORUUN, pose: br > 0.6 ? POSES.fall : POSES.ready, rot: fall * 1.2, expr: 'shocked', rim: rimOf(geo.M, [1, -0.5], 5), weapon: 'mace', maceAng: -2 }); drawChar(g, { x: geo.CX - 520, y: geo.GY + 10, s: 1.2, facing: 1, outfit: HAYATO, pose: PZ.guard, expr: 'determined', rim: rimOf(geo.M, [1, -0.5]), weapon: 'sword', swordAng: -0.6 }); });
  if (br > 0.5) for (let i = 0; i < 10; i++) { const r = rng(i), p = prog(t, 0.8, info.dur); rr(g, E.W / 2 - 80 + r() * 160, E.H * 0.6 + p * (300 + r() * 300), 30, 12, 3); g.fillStyle = '#1a1210'; g.fill(); }
} });
// s153 — "Um único movimento." freeze
registerShot('s153', { draw(g, t, info) {
  const cam = { z: 1.3 + 0.03 * t, x: 0, y: -30, r: -0.03 }, geo = bridge(g, 0, cam, { mood: 'dusk', broken: 0.7, fog: 0.3 });
  layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX + 120, y: geo.GY + 60, s: 1.7, facing: -1, outfit: GORUUN, pose: POSES.fall, rot: 0.3, expr: 'shocked', rim: rimOf(geo.M, [1, -0.5], 5), weapon: 'mace', maceAng: -2.2 }); drawChar(g, { x: geo.CX - 140, y: geo.GY - 60, s: 1.4, facing: 1, outfit: HAYATO, pose: PZ.slash, expr: 'determined', rim: { color: '#ffffff', dir: [1, -0.5], w: 6 }, weapon: 'sword', swordAng: 0.1, gleam: 0.5 }); });
  veil(g, '#1a2a60', 0.22); g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha('#ffffff', 0.7); g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.arc(E.W * 0.47, E.H * 0.5, 300, -1.2, 0.5); g.stroke(); g.restore();
  FX.drops(g, t, { count: 70, rMin: 2, rMax: 9 }); UI.badge(g, { str: '1', size: V(60, 64) });
} });
// s154 — "Quando ele atravessou entre os soldados, ninguém levantou a arma."
registerShot('s154', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, dz: 0.05, x0: -80, dx: 160, y0: 100 }), geo = bridge(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 10; i++) { const x = geo.CX - 700 + i * 160, sd = i % 2 ? 1 : -1; drawChar(g, { x, y: geo.GY + 60 + (sd > 0 ? 40 : -10), s: 1.0, facing: x < geo.CX - 300 + t * 160 ? 1 : -1, outfit: SOLDIER, pose: breathe({ ...POSES.stand }, t, 1, i), expr: 'awe', rim: rimOf(geo.M, [1, -0.5], 3), weapon: 'spear', spearAng: -1.5 + ease.out(prog(t, i * 0.2, i * 0.2 + 0.6)) * 1.2 }); } drawChar(g, { x: geo.CX - 500 + t * 260, y: geo.GY + 50, s: 1.15, facing: 1, outfit: HAYATO, pose: walkPose(t * 4.4, { stride: 16 }), expr: 'neutral', face: { mouth: 'smallFlat' }, rim: rimOf(geo.M, [1, -0.5]), weapon: 'sheath' }); });
} });
registerShot('s155', { draw(g, t, info) { markShot(g, t, info, 5); } });
// s156 — "E, desta vez, havia testemunhas."
registerShot('s156', { draw(g, t, info) {
  blurLayer(g, 12, (g) => bridge(g, t, { z: 1.5, y: 100 })); veil(g, '#08060a', 0.4);
  [[-560, 220, 0.9], [0, 300, 1], [560, 240, 0.8]].forEach(([dx, r, d], i) => bigFace(g, E.W / 2 + dx, E.H * 0.66 + (1 - d) * 80, r * (1 + 0.03 * t), { outfit: SOLDIER, expr: 'awe', look: [i === 0 ? 0.5 : i === 2 ? -0.5 : 0, 0], rimColor: mood('dusk').rim, rimSide: -1, blink: blinkAt(t + i, 3) }));
} });
// s157 — "Nas fogueiras, diziam que ele não tinha sombra"
registerShot('s157', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.4, dz: 0.05, y0: 100 }), geo = enemyCamp(g, t, cam, { fires: 0 });
  layer(g, cam, 1, (g) => { flame(g, geo.CX, geo.GY - 10, 50, t); FX.pool(g, geo.CX, geo.GY, 500, 80, '#ff9a4a', 0.4); drawChar(g, { x: geo.CX - 260, y: geo.GY, s: 1.3, facing: 1, outfit: SOLDIER, pose: breathe({ ...PZ.sitFire, eF: [30, -120], hF: [56 + Math.sin(t * 5) * 12, -150] }, t), expr: 'scared', talk: 0.3 + 0.4 * Math.abs(Math.sin(t * 6)), rim: { color: '#ffb070', dir: [1, -0.3], w: 5 } }); drawChar(g, { x: geo.CX + 260, y: geo.GY, s: 1.3, facing: -1, outfit: SOLDIER, pose: breathe(PZ.sitFire, t, 1, 2), expr: 'shocked', rim: { color: '#ffb070', dir: [-1, -0.3], w: 5 } });
    g.save(); g.globalAlpha = 0.5 + 0.2 * Math.sin(t * 2); drawChar(g, { x: geo.CX + 640, y: geo.GY - 100, s: 1.0, facing: -1, outfit: HAYATO, pose: POSES.stand, expr: 'determined', rim: { color: '#bfd0ff', dir: [0, -1], w: 6 }, shadow: false, weapon: 'sheath' }); g.restore(); });
} });
// s158 — "e que o rio ficou vermelho até o mar."
registerShot('s158', { draw(g, t, info) { const k = ease.inOut(t / info.dur); bridge(g, t, { z: 1.0 - 0.08 * k, x: 300 * k, y: 120 }, { mood: 'dusk', red: 0.6 + 0.3 * k, broken: 1 }); veil(g, '#200406', 0.15); } });
