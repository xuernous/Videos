// shots/04_sayo_harsa.js — Sayo, the hills, the song; Harsa and the rice paddies; the court letter; Kurai-Oni.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, shake, rng, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { seaView } from '../sets/coast.js';
import { enemyCamp } from '../sets/camp.js';
import { temple, hills, forest, plain } from '../sets/misc.js';
import { paddies, road, reflect } from '../sets/fields.js';
import { mapBase } from '../sets/map.js';
import { fireOn } from '../sets/camp.js';
import { drawChar, rider, drawHorse, faceShot, nameCard, sheath, banner, push, rimOf, blinkAt, PZ, arrow, flame, embers, lyrics, talkRings, KZ_RED } from '../sets/lib.js';
import { HAYATO, SAYO, HARSA, SOLDIER, MESSENGER, IKI } from '../cast.js';
import { wt } from './01_open.js';
import { markShot } from './03_attack.js';

const tk = (info, a, b) => talkAmount(info.globalT, info.shot.start + a, info.shot.start + b);
const templeBg = (o = {}) => (g, t) => temple(g, t, { z: o.z ?? 1.5, x: o.x ?? 0, y: o.y ?? -100 }, o);
const fireBg = (o = {}) => (g, t) => { const geo = forest(g, t, { z: o.z ?? 1.5, y: o.y ?? -60 }, { fire: true }); };
const SONG1 = ['Da lama ele levantou,', 'pela noite ele voltou,'], SONG2 = ['cada nome que o mar trouxe', 'a lâmina dele levou.'];
export { SONG1, SONG2 };

// s083 — "Foi então que encontrou Sayo,"
registerShot('s083', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.1, dz: 0.05, x0: 60, dx: -60 }), geo = temple(g, t, cam);
  layer(g, cam, 1, (g) => { const stop = info.dur * 0.6; drawChar(g, { x: geo.CX + 300 - Math.min(t, stop) * 220, y: geo.GY, s: 1.2, facing: -1, outfit: HAYATO, pose: t < stop ? walkPose(t * 5.4) : breathe(POSES.stand, t), expr: t < stop ? 'sad' : 'surprised', look: [-1, 0.3], rim: rimOf(geo.M, [1, -0.5]), weapon: ['sheath', 'bowBack'] }); if (t > stop) FX.rings(g, geo.wellX, geo.GY - 100, t, { color: '#fff1e6', r0: 30, r1: 120, a: 0.4 }); });
} });
// s084 — top-down into the dry well
function well(g, t, info, o) {
  backdrop(g, ['#3a3238', '#2a2228']); const r0 = rng(4); for (let i = 0; i < 40; i++) { circle(g, r0() * E.W, r0() * E.H, 10 + r0() * 30, alpha('#1a1418', 0.5)); }
  const z = 1 + (o.push ?? 0.08) * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H / 2; g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  circle(g, cx, cy, 470, '#4a4048'); for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; g.save(); g.translate(cx + Math.cos(a) * 420, cy + Math.sin(a) * 420); g.rotate(a); rr(g, -40, -26, 80, 52, 10); g.fillStyle = i % 2 ? '#5a5058' : '#3a3238'; g.fill(); g.restore(); }
  g.fillStyle = linGrad(g, 0, cy - 380, 0, cy + 380, ['#0a0808', '#1a1410']); g.beginPath(); g.arc(cx, cy, 380, 0, Math.PI * 2); g.fill();
  g.save(); g.beginPath(); g.arc(cx, cy, 378, 0, Math.PI * 2); g.clip(); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, cx - 120, cy - 140, 420, '#c8c0d8', 0.18); g.restore();
  bigFace(g, cx + 20, cy + 40, o.r ?? 170, { outfit: SAYO, expr: o.expr, look: [0, -0.9], rimColor: '#c8c0d8', rimSide: -1, blink: blinkAt(t, 2.8), talk: o.talk || 0 }); g.restore();
  g.restore();
}
registerShot('s084', { draw(g, t, info) { well(g, t, info, { expr: 'scared' }); } });
// s085 — "A mãe nunca voltou para buscá-la."
registerShot('s085', { draw(g, t, info) { faceShot(g, t, info, { bg: templeBg({ z: 1.8 }), who: SAYO, expr: 'sad', mood: 'dusk', rimColor: '#c8c0d8', look: [0.3, -0.4], blinkP: 2.4, veilA: 0.55 }); } });
// s086 — "Ela olhou para ele e perguntou:" — OTS from Sayo
registerShot('s086', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.7, 1.8), dz: 0.05, x0: 200, y0: 100 }), geo = temple(g, t, cam, { well: false });
  layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX + 260, y: geo.GY + 40, s: 1.6, facing: -1, outfit: HAYATO, pose: breathe(POSES.stand, t), expr: 'worried', look: [-0.6, 0.6], rim: rimOf(geo.M, [1, -0.5]), weapon: ['sheath', 'bowBack'] }));
  blurLayer(g, 10, (g) => bigFace(g, E.W * 0.2, E.H * 0.95, 300, { outfit: SAYO, expr: 'neutral', rimColor: '#c8c0d8', rimSide: 1 }));
} });
// s087 — "Você é dos nossos?"
registerShot('s087', { draw(g, t, info) { faceShot(g, t, info, { bg: templeBg({ z: 1.8 }), who: SAYO, expr: 'worried', talk: tk(info, 0, info.dur - 0.1), mood: 'dusk', rimColor: '#c8c0d8', look: [0.2, -0.5], over: (g, cx, cy, r) => talkRings(g, cx + r * 0.9, cy, t) }); } });
// s088 — "Ele não soube responder."
registerShot('s088', { draw(g, t, info) { faceShot(g, t, info, { bg: templeBg({ z: 1.8, x: 300 }), who: HAYATO, expr: 'confused', mood: 'dusk', rimSide: 1, look: [-0.2, 0.6], push: 0.06 }); } });
// s089 — "Hayato a levou consigo para as colinas."
registerShot('s089', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.05, dz: 0.04, x0: -80, dx: 120 }), geo = hills(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => { const x = geo.CX - 400 + t * 110; drawChar(g, { x, y: geo.GY, s: 0.8, facing: 1, outfit: HAYATO, pose: walkPose(t * 5), expr: 'neutral', rim: rimOf(geo.M, [1, -0.5], 3), weapon: ['sheath', 'bowBack'] }); drawChar(g, { x: x - 70, y: geo.GY + 4, s: 0.8, facing: 1, outfit: SAYO, pose: walkPose(t * 7 + 1), expr: 'neutral', rim: rimOf(geo.M, [1, -0.5], 3) }); });
} });
// s090 — "Ensinou-a a andar sem fazer barulho"
registerShot('s090', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, dz: 0.05, x0: -100, y0: 120 }), geo = forest(g, t, cam, { mood: 'dusk', moon: false });
  layer(g, cam, 1, (g) => { const step = (k) => { const c = (t * 0.9 + k) % 1; return { ...PZ.tiptoe, fF: [26 + c * 10, -6 * Math.sin(c * Math.PI)] }; }; const x = geo.CX - 200 + t * 50; drawChar(g, { x, y: geo.GY, s: 1.4, facing: 1, outfit: HAYATO, pose: step(0), expr: 'neutral', rim: rimOf(geo.M, [-1, -0.4]), weapon: 'sheath' }); drawChar(g, { x: x - 210, y: geo.GY + 6, s: 1.4, facing: 1, outfit: SAYO, pose: step(0.5), expr: 'thinking', rim: rimOf(geo.M, [-1, -0.4]) }); });
} });
// s091 — "e a apagar uma fogueira sem fumaça."
registerShot('s091', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.9, dz: 0.06, x0: 0, y0: 230 }), geo = forest(g, t, cam, { fire: true });
  layer(g, cam, 1, (g) => { const f = 1 - ease.inOut(prog(t, 0.6, info.dur - 0.3)); if (f > 0.02) fireOn(g, geo.CX, geo.GY, t, f * 0.9); poly(g, [[geo.CX - 70, geo.GY + 4], [geo.CX + 70, geo.GY + 4], [geo.CX + 40, geo.GY - 30 * (1 - f)], [geo.CX - 40, geo.GY - 30 * (1 - f)]], '#2a1e16');
    drawChar(g, { x: geo.CX - 190, y: geo.GY, s: 1.3, facing: 1, outfit: HAYATO, pose: breathe({ ...POSES.kneel, eF: [40, -80], hF: [70, -50 - Math.abs(Math.sin(t * 4)) * 30] }, t), expr: 'neutral', rim: { color: '#ffb070', dir: [1, -0.3], w: 5 } });
    drawChar(g, { x: geo.CX + 210, y: geo.GY, s: 1.3, facing: -1, outfit: SAYO, pose: breathe(PZ.sitFire, t, 1, 2), expr: 'surprised', rim: { color: '#ffb070', dir: [-1, -0.3], w: 5 } }); });
  veil(g, '#000', 0.3 * prog(t, 0.6, info.dur));
} });
// fire scene with the two of them (s092–s095, s111)
function campTwo(g, t, info, cam, o = {}) {
  const geo = forest(g, t, cam, { fire: true, mist: false });
  layer(g, cam, 1, (g) => { fireOn(g, geo.CX, geo.GY, t, 1);
    drawChar(g, { x: geo.CX - 230, y: geo.GY, s: 1.3, facing: 1, outfit: HAYATO, pose: breathe(o.hp || PZ.sitFire, t), expr: o.he || 'neutral', rim: { color: '#ffb070', dir: [1, -0.3], w: 5 }, weapon: 'sheath', blink: blinkAt(t, 3.6) });
    const so = { x: geo.CX + 220, y: geo.GY, s: 1.3, facing: -1, outfit: SAYO, pose: breathe(o.sp || PZ.sitFire, t, 1.3, 2), expr: o.se || 'happy', talk: o.st || 0, rim: { color: '#ffb070', dir: [-1, -0.3], w: 5 }, blink: blinkAt(t, 2.7) }; drawChar(g, so); o.extra?.(g, geo, so); });
  embers(g, t, { count: 20, area: [E.W * 0.3, 0, E.W * 0.4, E.H] });
  return geo;
}
// s092 — "Ela, em troca, falava o tempo todo."
registerShot('s092', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.7, 1.8), dz: 0.05, y0: 210 }); campTwo(g, t, info, cam, { st: 0.3 + 0.5 * Math.abs(Math.sin(t * 7)), sp: { ...PZ.sitFire, eF: [30, -120], hF: [50 + Math.sin(t * 6) * 10, -140] }, he: 'smirk', extra: (g, geo, so) => { const sx = so.x - 40, sy = so.y - 330; for (let i = 0; i < 3; i++) { const a = clamp(Math.sin(t * 3 - i * 1.2)); if (a > 0) { g.save(); g.globalAlpha = a; UI.bubble(g, sx - i * 60, sy - i * 70, { w: 90, h: 52 }); g.restore(); } } } });
} });
// s093 — "Era a primeira voz em semanas que não estava gritando."
registerShot('s093', { draw(g, t, info) { faceShot(g, t, info, { bg: fireBg(), who: HAYATO, expr: 'smile', face: { mouth: 'smallSmile' }, mood: 'night', rimColor: '#ffb070', rimSide: 1, look: [0.5, 0.2], push: 0.06 }); } });
// s094 — "E, numa noite, ela começou a cantar:"
registerShot('s094', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, dz: 0.06, y0: 90 }), sing = wt('cantar', info, 1.4); campTwo(g, t, info, cam, { st: t > sing ? 0.3 + 0.3 * Math.abs(Math.sin(t * 3)) : 0, se: t > sing ? 'happy' : 'neutral', he: 'neutral' });
} });
// s095 — the song (1/2)
registerShot('s095', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, dz: 0.08, y0: 40 }); campTwo(g, t, info, cam, { st: 0.25 + 0.35 * Math.abs(Math.sin(t * 3.2)), se: 'happy', he: 'smile' });
  veil(g, '#05040a', 0.2); lyrics(g, t, info, SONG1, { y: E.H * 0.2 });
} });
// s096 — the song (2/2): the sheath and the sea
registerShot('s096', { draw(g, t, info) {
  blurLayer(g, 10, (g) => seaView(g, t, { z: 1.2 }, { mood: 'night' })); veil(g, '#05040a', 0.35); const k = ease.inOut(t / info.dur);
  sheath(g, E.W * 0.5, E.H * 0.62, V(1500, 1000) * (1 + 0.05 * k), t, { marks: 1, rot: -0.06, lit: '#a9b8ff' });
  lyrics(g, t, info, SONG2, { y: E.H * 0.2 });
} });
// s097 — "O exército já tinha tomado o norte de Kyushu."
registerShot('s097', { draw(g, t, info) { const k = ease.inOut(t / info.dur); mapBase(g, t, { z: 1.7 - 0.1 * k, x: 360, y: 220 }, { red: 1, redKyushu: ease.out(prog(t, 0.3, 2.2)), labels: [{ at: 'kyushuN', str: 'KYUSHU', dx: 30 }, { at: 'iki', str: 'IKI' }] }); } });
// s098 — "Nas planícies, comandava Harsa,"
registerShot('s098', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.35, dz: 0.06, x0: -120, y0: 80 }), geo = plain(g, t, cam, { mood: 'golden', sunX: 300 });
  layer(g, cam, 1, (g) => { rider(g, geo.CX - 140, geo.GY + 10, 1.4, 1, t, { outfit: HARSA, pose: { ...PZ.ride, eF: [30, -190], hF: [40, -230] }, expr: 'smirk', rim: rimOf(geo.M, [1, -0.5], 5), weapon: 'sword', swordAng: -1.6 }, { gallop: false, rim: rimOf(geo.M, [1, -0.5], 5) }); banner(g, geo.CX + 260, geo.GY - 420, 120, 80, t, { wind: 1 }); });
  nameCard(g, t, info.dur, 'HARSA', 'SENHORA DOS CAVALOS', { a: prog(t, wt('harsa', info, 1) - 0.3, wt('harsa', info, 1)) });
} });
// s099 — "a Senhora dos Cavalos, cuja cavalaria varria aldeias inteiras."
registerShot('s099', { draw(g, t, info) {
  const cam = { z: 1.1, x: 160 * t }, geo = plain(g, t, cam, { mood: 'dusk', village: true, burn: true });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 7; i++) { const x = geo.CX - 1100 + i * 230 + t * 600, y = geo.GY + (i % 3) * 22; rider(g, x, y, 1.0, 1, t + i * 0.2, { outfit: i === 3 ? HARSA : SOLDIER, pose: PZ.ride, expr: 'angry', rim: { color: '#ff9a5a', dir: [-1, -0.4], w: 4 }, weapon: i === 3 ? 'sword' : 'spear', swordAng: -0.6, spearAng: -0.3, spearLen: 340 }, { rim: { color: '#ff9a5a', dir: [-1, -0.4], w: 4 }, speed: 2 }); } });
  FX.dust(g, t, { count: 90, color: '#e0b090', a: 0.4, speed: 50 }); embers(g, t, { count: 30 });
} });
// s100 — "Ninguém vencia cavalaria em campo aberto."
registerShot('s100', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = ui.blueprint, sweep = ease.inOut(prog(t, 0.3, info.dur - 0.3));
  text(g, 'CAMPO ABERTO', E.W / 2, E.H * 0.14, { size: 50, font: FONTS.ui, weight: 900, color: ui.cream, spacing: 8 });
  for (let i = 0; i < 12; i++) { const x = E.W * 0.6 + (i % 4) * 70, y = E.H * 0.4 + Math.floor(i / 4) * 120, hit = sweep * E.W * 1.2 - E.W * 0.15 > x; UI.lineFigure(g, { x, y: y + (hit ? 10 : 0), s: 0.45, pose: hit ? POSES.fall : POSES.stand, color: hit ? alpha(ui.accent, 0.8) : '#e8f0ff' }); }
  for (let k = 0; k < 3; k++) { const x = lerp(-200, E.W + 300, sweep) - k * 160, y = E.H * (0.36 + k * 0.17); g.strokeStyle = ui.gold; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(x - 140, y - 60); g.lineTo(x, y); g.lineTo(x - 140, y + 60); g.stroke(); seg(g, [[x - 600, y], [x - 20, y]], 3, alpha(ui.gold, 0.4)); }
} });
// s101 — "Então Hayato escolheu os arrozais."
registerShot('s101', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.15, dz: 0.06, x0: -40, y0: 60 }), geo = paddies(g, t, cam);
  layer(g, cam, 1, (g) => { const o = { x: geo.CX - 260, y: geo.HY + 160, s: 1.1, facing: 1, outfit: HAYATO, pose: breathe(POSES.stand, t), expr: 'determined', rim: rimOf(geo.M, [1, -0.5]), weapon: ['sheath', 'bowBack'] }; reflect(g, o.y, (g) => drawChar(g, { ...o, shadow: false }), 0.3); drawChar(g, o); });
} });
// s102 — "Provocou Harsa até os campos alagados,"
registerShot('s102', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.05, dz: 0.04, x0: 0, dx: -60 }), geo = paddies(g, t, cam, { mood: 'dusk' }); const rel = 0.9;
  layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 640, y: geo.HY + 200, s: 1.0, facing: 1, outfit: HAYATO, pose: t < rel ? PZ.aim : PZ.release, drawK: t < rel ? 1 : 0, expr: 'determined', rim: rimOf(geo.M, [1, -0.5], 4), weapon: ['bow', 'sheath'] });
    const ap = prog(t, rel, rel + 0.4); if (ap > 0 && ap < 1) arrow(g, lerp(geo.CX - 560, geo.CX + 300, ap), geo.HY + 30 - Math.sin(ap * Math.PI) * 60, 0, 1, { trail: 160 });
    for (let i = 0; i < 5; i++) { const x = geo.CX + 900 - t * 380 + i * 160, y = geo.HY + 120 + (i % 2) * 40; rider(g, x, y, 0.75, -1, t + i * 0.3, { outfit: i === 2 ? HARSA : SOLDIER, pose: PZ.ride, expr: 'angry', rim: rimOf(geo.M, [1, -0.5], 3), weapon: 'spear', spearAng: -0.4 }, { speed: 2, rim: rimOf(geo.M, [1, -0.5], 3) }); }
    for (let i = 0; i < 6; i++) FX.rings(g, geo.CX + 700 - t * 380 + i * 140, geo.HY + 128 + (i % 2) * 40, t + i * 0.3, { color: '#fff', r0: 10, r1: 70, a: 0.3, count: 2 }); });
} });
// s103 — "onde a lama escondia buracos fundos." cross-section
registerShot('s103', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = ui.blueprint, wy = E.H * 0.34, my = E.H * 0.46;
  g.fillStyle = alpha(bp, 0.12); g.fillRect(0, wy, E.W, my - wy); for (let x = 0; x < E.W; x += 40) seg(g, [[x, wy + Math.sin(t * 2 + x * 0.05) * 4], [x + 20, wy + Math.sin(t * 2 + x * 0.05 + 1) * 4]], 3, bp);
  g.fillStyle = alpha('#8a6a40', 0.35); g.fillRect(0, my, E.W, E.H); seg(g, [[0, my], [E.W, my]], 3, alpha('#c9a070', 0.9));
  const holes = [0.25, 0.52, 0.78]; holes.forEach((hx, i) => { const k = ease.out(prog(t, 0.3 + i * 0.3, 0.8 + i * 0.3)), x = E.W * hx, d = 300 * k; g.fillStyle = ui.bpBg; g.beginPath(); g.moveTo(x - 90, my); g.lineTo(x - 60, my + d); g.lineTo(x + 60, my + d); g.lineTo(x + 90, my); g.closePath(); g.fill(); g.strokeStyle = ui.accent; g.lineWidth = 4; g.setLineDash([12, 10]); g.stroke(); g.setLineDash([]); });
  text(g, 'ÁGUA', 60, wy + 50, { size: 34, font: FONTS.ui, weight: 900, color: bp, align: 'left', spacing: 4 }); text(g, 'LAMA', 60, my + 60, { size: 34, font: FONTS.ui, weight: 900, color: '#c9a070', align: 'left', spacing: 4 }); text(g, 'BURACOS', E.W * 0.52, my + 360, { size: 40, font: FONTS.ui, weight: 900, color: ui.accent, spacing: 6, alpha: prog(t, 1.2, 1.6) });
} });
// s104 — "A cavalaria afundou."
registerShot('s104', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, dz: 0.06, x0: 200, y0: 100 }), geo = paddies(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 4; i++) { const x = geo.CX - 360 + i * 300, y = geo.HY + 200 + (i % 2) * 40, sink = 40 + ease.out(prog(t, 0.1 + i * 0.1, 1.2)) * 70; g.save(); g.beginPath(); g.rect(x - 400, -2000, 800, y + 2000 - 2); g.clip(); rider(g, x, y, 0.9, -1, t * 0.4 + i, { outfit: i === 1 ? HARSA : SOLDIER, pose: POSES.fall, expr: 'shocked', rim: rimOf(geo.M, [1, -0.5], 3) }, { gallop: false, sink, rearing: 0.3 + Math.sin(t * 6 + i) * 0.15, rim: rimOf(geo.M, [1, -0.5], 3) }); g.restore(); FX.rings(g, x, y, t + i * 0.2, { color: '#fff', r0: 30, r1: 160, a: 0.45, count: 3 }); for (let k = 0; k < 6; k++) circle(g, x + Math.sin(k * 2 + t * 4) * 80, y - 20 - ((t * 120 + k * 30) % 90), 5, alpha('#e8f0ff', 0.6)); } });
} });
// s105 — "E ele atirou a galope,"   s106 — ghosts ride with him
function gallopShot(g, t, info, ghosts) {
  const cam = { z: 1.25, x: 240 * t, y: 60 }, geo = paddies(g, t, cam, { mood: 'golden', sunX: 200 });
  layer(g, cam, 1, (g) => { const x = geo.CX - 200 + t * 240, y = geo.HY + 170;
    if (ghosts) for (let i = 0; i < 6; i++) { g.save(); g.globalAlpha = 0.28 * prog(t, 0, 0.6); rider(g, x - 200 - i * 150, y - 30 - (i % 2) * 40, 0.8, 1, t + i * 0.25, { outfit: IKI, pose: PZ.rideAim, drawK: 1, expr: 'determined', rim: { color: '#bfe0ff', dir: [0, -1], w: 5 }, weapon: 'bow' }, { speed: 1.8, rim: { color: '#bfe0ff', dir: [0, -1], w: 5 } }); g.restore(); }
    const cyc = (t * 1.2) % 1; rider(g, x, y, 1.05, 1, t, { outfit: HAYATO, pose: cyc < 0.6 ? PZ.rideAim : { ...PZ.rideAim, eB: [-30, -168], hB: [-34, -150] }, drawK: cyc < 0.6 ? cyc / 0.6 : 0, expr: 'determined', rim: rimOf(geo.M, [-1, -0.4], 5), weapon: ['bow'] }, { speed: 1.8, rim: rimOf(geo.M, [-1, -0.4], 5) });
    if (cyc > 0.6) arrow(g, x + 80 + (cyc - 0.6) * 1600, y - 180, 0, 1, { trail: 200 }); });
  FX.speedLines(g, t, { count: 40, a: 0.15, inner: 420 });
}
registerShot('s105', { draw(g, t, info) { gallopShot(g, t, info, false); } });
registerShot('s106', { draw(g, t, info) { gallopShot(g, t, info, true); } });
registerShot('s107', { draw(g, t, info) { markShot(g, t, info, 2); } });
// s108 — "Numa estrada, ele interceptou um mensageiro de Quioto."
registerShot('s108', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.25, dz: 0.05, x0: -40, y0: 60 }), geo = road(g, t, cam); const stop = 1.2;
  layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 420, y: geo.GY + 40, s: 1.3, facing: 1, outfit: HAYATO, pose: PZ.aim, drawK: 1, expr: 'determined', rim: rimOf(geo.M, [-1, -0.4]), weapon: ['bow', 'sheath'] });
    const hx = geo.CX + 600 - Math.min(t, stop) * 300 + (t > stop ? 0 : 0); rider(g, hx, geo.GY + 30, 1.1, -1, t, { outfit: MESSENGER, pose: t < stop ? PZ.ride : { ...PZ.ride, eF: [20, -200], hF: [26, -236] }, expr: t < stop ? 'neutral' : 'scared', rim: rimOf(geo.M, [-1, -0.4]) }, { gallop: t < stop, rearing: t > stop ? 0.25 * Math.sin(Math.PI * prog(t, stop, stop + 0.8)) : 0, rim: rimOf(geo.M, [-1, -0.4]) }); });
  nameCard(g, t, info.dur, 'MENSAGEIRO', 'DA CORTE DE QUIOTO', { a: prog(t, wt('mensageiro', info, 1.5) - 0.2, wt('mensageiro', info, 1.5) + 0.2) });
} });
// s109/s110 — the court letter
function letter(g, t, info, o = {}) {
  blurLayer(g, 12, (g) => road(g, t, { z: 1.6, y: -80 })); veil(g, '#08060a', 0.45);
  const open = ease.out(prog(t, 0, o.open ?? 1)), crush = ease.in(prog(t, o.crushAt ?? 99, (o.crushAt ?? 99) + 0.4)), w = V(1200, 900) * open, h = V(540, 600) * (1 - crush * 0.8), cx = E.W / 2, cy = E.H * 0.5;
  g.save(); g.translate(cx, cy); g.rotate(-0.03 + crush * 0.3); g.scale(1 - crush * 0.5, 1);
  rr(g, -w / 2, -h / 2, w, h, 4); g.fillStyle = linGrad(g, 0, -h / 2, 0, h / 2, ['#f1e6c8', '#ddcca0']); g.fill(); for (const sx of [-1, 1]) { rr(g, sx * w / 2 - 16, -h / 2 - 20, 32, h + 40, 12); g.fillStyle = '#5a1a20'; g.fill(); }
  if (open > 0.9 && !o.quote) { const r = rng(5); g.strokeStyle = alpha('#2a1a10', 0.75); g.lineWidth = 4; for (let x = w / 2 - 70; x > -w / 2 + 60; x -= 46) { let y = -h / 2 + 40; while (y < h / 2 - 50) { const L = 12 + r() * 22; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 3, y + L); g.stroke(); y += L + 10; } } }
  if (o.quote) { const a = prog(t, 0.2, 0.7); text(g, '"deliberado depois', 0, -50, { size: 66, font: FONTS.serif, italic: true, weight: 900, color: '#3a2014', alpha: a }); text(g, 'das cerimônias da estação"', 0, 40, { size: 66, font: FONTS.serif, italic: true, weight: 900, color: '#3a2014', alpha: a }); }
  rr(g, w / 2 - 170, h / 2 - 150, 100, 100, 8); g.fillStyle = alpha('#c2242c', 0.85 * open); g.fill(); g.restore();
  if (o.crushAt) { const hx = cx + 300 - crush * 200, hy = cy + 300 - crush * 200; seg(g, [[hx, hy], [E.W + 200, E.H + 260]], 110, '#262c44'); circle(g, hx, hy, 80, S().ink); }
}
registerShot('s109', { draw(g, t, info) { letter(g, t, info, { open: 1.1 }); } });
registerShot('s110', { draw(g, t, info) { letter(g, t, info, { open: 0.01, quote: true, crushAt: info.dur - 0.9 }); } });
// s111 — "Naquela noite, Sayo perguntou se o exército estava vindo."
registerShot('s111', { draw(g, t, info) { const cam = push(t, info, { z0: V(1.6, 1.7), dz: 0.05, y0: 190 }); campTwo(g, t, info, cam, { se: 'worried', he: 'sad', hp: { ...PZ.sitFire, head: [16, -142] }, st: 0 }); } });
// s112 — "Ninguém está vindo", ele disse.
registerShot('s112', { draw(g, t, info) { faceShot(g, t, info, { bg: fireBg(), who: HAYATO, expr: 'sad', talk: tk(info, 0, wt('ele', info, 1.5)), mood: 'night', rimColor: '#ffb070', rimSide: 1, look: [0.2, 0.5], push: 0.05 }); } });
// s113 — "Os invasores começaram a chamá-lo de Kurai-Oni."
registerShot('s113', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.6, 1.7), dz: 0.05, x0: -100, y0: 180 }), geo = enemyCamp(g, t, cam, { fires: 0 });
  layer(g, cam, 1, (g) => { const fx = geo.CX; flame(g, fx, geo.GY - 10, 46, t); FX.pool(g, fx, geo.GY, 520, 80, '#ff9a4a', 0.35);
    [[-300, 1, 'scared'], [-150, 1, 'worried'], [180, -1, 'nervous'], [330, -1, 'scared']].forEach(([dx, f, e], i) => drawChar(g, { x: fx + dx, y: geo.GY, s: 1.25, facing: f, outfit: SOLDIER, pose: breathe(i === 3 ? POSES.point : PZ.sitFire, t, 1, i), look: [f * -1, 0], expr: e, rim: { color: '#ffb070', dir: [-f, -0.3], w: 5 } }));
    FX.rings(g, fx - 150, geo.GY - 240, t, { color: '#ffd0a0', r0: 20, r1: 90, a: 0.3 }); });
  text(g, 'KURAI-ONI', E.W * 0.5, E.H * 0.2, { size: 46, font: FONTS.ui, weight: 900, color: alpha('#ffd0a0', 0.8), spacing: 10, alpha: prog(t, wt('kurai', info, 2) - 0.1, wt('kurai', info, 2) + 0.3) });
} });
// s114 — "O Demônio Escuro."
registerShot('s114', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, dz: 0.08 }); forest(g, t, cam, { moon: false, godray: false }); veil(g, '#000', 0.55);
  const k = prog(t, 0.2, 0.6); for (const dx of [-30, 30]) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W / 2 + dx, E.H * 0.62, 50, '#ff3a2a', 0.8 * k); g.restore(); circle(g, E.W / 2 + dx, E.H * 0.62, 7 * k, '#ffd0c0'); }
  UI.bigLine(g, t, { str: 'KURAI-ONI', dur: info.dur, y: E.H * 0.32, size: 120, color: '#ff5a4a' });
  text(g, 'O DEMÔNIO ESCURO', E.W / 2, E.H * 0.43, { size: 40, font: FONTS.ui, weight: 900, color: S().ui.cream, spacing: 10, alpha: prog(t, 0.4, 0.8) * clamp((info.dur - t) / 0.3) });
} });
