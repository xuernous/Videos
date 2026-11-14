// shots/06_town_najima.js — the traitor of Dazaifu, the farewell to Sayo, the siege of Najima.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, shake, rng, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { beachNight } from '../sets/night.js';
import { forest, hills, scriptorium } from '../sets/misc.js';
import { town, cart, riceBag, farm, najima, grotto } from '../sets/town.js';
import { drawChar, faceShot, nameCard, push, rimOf, blinkAt, PZ, arrow, flame, embers, lyrics, talkRings, roster, KZ_RED, GOLD } from '../sets/lib.js';
import { HAYATO, SAYO, MASANOBU, SOLDIER, PEASANT, FAMILY, ISHKAR, JIRO, IKI, SCRIBE } from '../cast.js';
import { wt, SIL8 } from './01_open.js';
import { markShot } from './03_attack.js';
import { SONG1, SONG2 } from './04_sayo_harsa.js';

const tk = (info, a, b) => talkAmount(info.globalT, info.shot.start + a, info.shot.start + b);
const DISGUISE = { ...HAYATO, head: 'none', x: ['kasa'] };
const townBg = (o = {}) => (g, t) => town(g, t, { z: o.z ?? 1.5, x: o.x ?? 0, y: o.y ?? -80 }, o);
const farmBg = (o = {}) => (g, t) => farm(g, t, { z: o.z ?? 1.5, x: o.x ?? 0, y: o.y ?? -80 }, o);
function ghosts(g, t, xs, y, s, o = {}) { xs.forEach((x, i) => { g.save(); g.globalAlpha = (o.a ?? 0.32) * (0.8 + 0.2 * Math.sin(t * 2 + i)); drawChar(g, { x, y: y + (i % 3) * (o.dy ?? 10), s, facing: o.f?.(i) ?? 1, outfit: i === (o.jiro ?? -1) ? JIRO : IKI, pose: breathe(POSES.stand, t, 1, i), expr: i === (o.jiro ?? -1) ? 'smile' : 'neutral', rim: { color: '#bfe0ff', dir: [0, -1], w: 6 }, shadow: false }); g.restore(); }); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, (xs[0] + xs[xs.length - 1]) / 2, y - 120 * s, 700, '#8ab0ff', 0.12); g.restore(); }

// s159 — "Mas alguém tinha aberto os portões de Dazaifu para o inimigo."
registerShot('s159', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.1, dz: 0.06, y0: 0 }), op = ease.inOut(prog(t, 0.3, 1.6)), geo = town(g, t, cam, { mood: 'night', gate: op });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 10; i++) { const p = prog(t, 1.2 + i * 0.2, info.dur + 1); if (p <= 0) continue; drawChar(g, { x: geo.CX - 60 + (i % 2) * 120, y: geo.GY - 30 + p * 260, s: 0.6 + p * 0.5, facing: i % 2 ? -1 : 1, outfit: SOLDIER, pose: walkPose(t * 5 + i), expr: 'angry', rim: rimOf(geo.M, [0, -1], 3), weapon: 'spear', spearAng: -1.45 }); } });
} });
// s160 — "Fujihara no Masanobu, oficial da corte,"
registerShot('s160', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.6, 1.7), dz: 0.05, x0: 220, y0: 160 }), geo = town(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX + 280, y: geo.GY, s: 1.6, facing: -1, outfit: MASANOBU, pose: breathe(POSES.crossArms, t), expr: 'smirk', rim: rimOf(geo.M, [-1, -0.4], 5) }));
  nameCard(g, t, info.dur, 'FUJIHARA NO MASANOBU', 'OFICIAL DA CORTE');
} });
// s161 — "que trocou mapas e portões por um título."
registerShot('s161', { draw(g, t, info) {
  blurLayer(g, 12, townBg({ mood: 'night', gate: 1 })); veil(g, '#06050a', 0.45); const ink = S().ink, k = ease.inOut(prog(t, 0.2, 1.6));
  const L = [lerp(E.W * 0.12, E.W * 0.38, k), E.H * 0.56], R = [lerp(E.W * 0.88, E.W * 0.62, k), E.H * 0.5];
  seg(g, [[-200, E.H * 0.8], L], 120, '#6a3a8a'); circle(g, L[0] + 40, L[1], 56, ink); g.save(); g.translate(L[0] + 90, L[1] - 20); g.rotate(0.2); rr(g, -20, -110, 40, 220, 14); g.fillStyle = '#d8c39a'; g.fill(); g.restore();
  seg(g, [[E.W + 200, E.H * 0.25], R], 120, '#6e1a20'); circle(g, R[0] - 40, R[1], 56, ink); rr(g, R[0] - 140, R[1] - 50, 80, 80, 10); g.fillStyle = GOLD; g.fill(); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, R[0] - 100, R[1] - 10, 140, GOLD, 0.5); g.restore();
  text(g, 'MAPAS', L[0] + 40, L[1] + 150, { size: 34, font: FONTS.ui, weight: 900, color: S().ui.cream, spacing: 4, alpha: prog(t, 0.5, 0.9) }); text(g, 'TÍTULO', R[0] - 100, R[1] + 150, { size: 34, font: FONTS.ui, weight: 900, color: GOLD, spacing: 4, alpha: prog(t, wt('título', info, 2) - 0.2, wt('título', info, 2) + 0.2) });
} });
// s162 — "Os trinta de Iki tinham morrido porque um homem decidiu"
registerShot('s162', { draw(g, t, info) { const cam = push(t, info, { z0: 1.05, dz: 0.05 }), geo = beachNight(g, t, cam, { smoke: false }); layer(g, cam, 1, (g) => ghosts(g, t, Array.from({ length: 30 }, (_, i) => geo.CX - 800 + i * 55), geo.GY - 30, 0.6, { a: 0.4 })); } });
// s163 — "que eles valiam menos do que um cargo."
registerShot('s163', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = ui.blueprint, cx = E.W / 2, cy = E.H * 0.32, L = 520, a = -0.24 * ease.out(prog(t, 0.3, 1.3)) + 0.03 * Math.sin(t * 3) * (1 - prog(t, 0, 1));
  seg(g, [[cx, cy], [cx, E.H * 0.86]], 6, bp); poly(g, [[cx, cy - 30], [cx - 24, cy + 10], [cx + 24, cy + 10]], bp); const lx = cx - Math.cos(a) * L, ly = cy - Math.sin(a) * L, rx = cx + Math.cos(a) * L, ry = cy + Math.sin(a) * L; seg(g, [[lx, ly], [rx, ry]], 6, bp);
  for (const [px, py, side] of [[lx, ly, 0], [rx, ry, 1]]) { seg(g, [[px, py], [px - 110, py + 200]], 2, bp); seg(g, [[px, py], [px + 110, py + 200]], 2, bp); seg(g, [[px - 140, py + 200], [px + 140, py + 200]], 6, bp); }
  for (let i = 0; i < 30; i++) circle(g, lx - 110 + (i % 10) * 24, ly + 188 - Math.floor(i / 10) * 22, 10, '#a8a0b8'); text(g, 'OS TRINTA', lx, ly + 260, { size: 34, font: FONTS.ui, weight: 900, color: ui.cream, spacing: 3 });
  rr(g, rx - 50, ry + 110, 100, 90, 8); g.fillStyle = GOLD; g.fill(); text(g, 'UM CARGO', rx, ry + 260, { size: 34, font: FONTS.ui, weight: 900, color: GOLD, spacing: 3 });
} });
// s164 — "Hayato entrou em Dazaifu de dia, disfarçado entre camponeses que carregavam arroz."
registerShot('s164', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.15, dz: 0.04, x0: -100, dx: 120, y0: 60 }), geo = town(g, t, cam, { mood: 'golden', gate: 1 });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 6; i++) { const x = geo.CX - 900 + i * 230 + t * 120, o = { x, y: geo.GY + 20 + (i % 2) * 20, s: 1.15, facing: 1, outfit: i === 3 ? DISGUISE : PEASANT, pose: { ...walkPose(t * 4.5 + i), eF: [14, -196], hF: [10, -220], eB: [6, -196], hB: [2, -220] }, expr: i === 3 ? 'determined' : 'neutral', rim: rimOf(geo.M, [-1, -0.4], 4) }; drawChar(g, o); riceBag(g, x + 6, o.y - 248 * 1.15, 1.3); } });
} });
// s165 — "Subiu numa carroça e o desmascarou diante dos próprios guardas,"
function square(g, t, info, cam, o = {}) {
  const geo = town(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => { cart(g, geo.CX - 360, geo.GY + 30, 1.2); drawChar(g, { x: geo.CX - 360, y: geo.GY + 30 - 150, s: 1.3, facing: 1, outfit: o.hat ? DISGUISE : HAYATO, pose: o.hp || POSES.point, expr: o.he || 'angry', talk: o.ht || 0, rim: rimOf(geo.M, [-1, -0.4]), weapon: 'sheath', shadow: false });
    drawChar(g, { x: geo.CX + 380, y: geo.GY + 20, s: 1.3, facing: -1, outfit: MASANOBU, pose: o.mp || breathe(POSES.stand, t), expr: o.me || 'shocked', rim: rimOf(geo.M, [-1, -0.4]) });
    for (let i = 0; i < 4; i++) drawChar(g, { x: geo.CX + 120 + i * 160 + (i > 1 ? 380 : 0), y: geo.GY + 50, s: 1.2, facing: i > 1 ? -1 : 1, outfit: SOLDIER, pose: breathe(POSES.stand, t, 1, i), expr: o.ge || 'surprised', look: [i > 1 ? -1 : 1, 0], rim: rimOf(geo.M, [-1, -0.4]), weapon: 'spear', spearAng: o.spear ? o.spear(i) : -1.45 });
    for (let i = 0; i < 12; i++) drawFigure(g, { x: geo.CX - 900 + i * 160, y: geo.GY - 40, s: 0.8, facing: i % 2 ? 1 : -1, outfit: PEASANT.x ? { top: 'tshirt', color: '#5a5040', head: 'bun' } : PEASANT, pose: breathe(POSES.stand, t, 1, i), expr: 'surprised', rim: rimOf(geo.M, [-1, -0.4], 3) }); });
  return geo;
}
registerShot('s165', { draw(g, t, info) { square(g, t, info, push(t, info, { z0: 1.05, dz: 0.05, y0: 40 }), { hat: t < 1.0, hp: t < 1.0 ? POSES.stand : POSES.point }); } });
// s166 — "perguntando a eles, em voz alta, a quem serviam."
registerShot('s166', { draw(g, t, info) {
  const M = mood('golden'); backdrop(g, M.sky); FX.sun(g, E.W * 0.2, E.H * 0.3, 50, '#fff3dc', M.key, 5); FX.clouds(g, { y: 120, h: 300, color: '#fff', a: 0.15 });
  const z = 1 + 0.05 * t / info.dur; g.save(); g.translate(E.W / 2, E.H); g.scale(z, z); g.translate(-E.W / 2, -E.H);
  drawChar(g, { x: E.W * 0.52, y: E.H * 1.12, s: 3.2, facing: -1, outfit: HAYATO, pose: breathe(POSES.explain, t), expr: 'angry', rim: { color: M.rim, dir: [-1, -0.4], w: 8 }, weapon: 'sheath' }); g.restore();
  talkRings(g, E.W * 0.38, E.H * 0.3, t);
} });
// s167 — "Masanobu gritou que a corte tinha abandonado o sul primeiro."
registerShot('s167', { draw(g, t, info) { const cam = push(t, info, { z0: V(1.8, 1.9), dz: 0.05, x0: 380, y0: 200 }); const geo = square(g, t, info, cam, { mp: breathe(POSES.shrug, t * 2), me: 'angry', he: 'determined', hp: POSES.crossArms }); layer(g, cam, 1, (g) => talkRings(g, geo.CX + 340, geo.GY - 260, t)); } });
// s168 — "Hayato respondeu: A corte nos abandonou."
registerShot('s168', { draw(g, t, info) { const st = wt('a', info, 1.0); faceShot(g, t, info, { bg: townBg({ mood: 'golden', x: -300 }), who: HAYATO, expr: 'determined', talk: tk(info, st, info.dur - 0.1), mood: 'golden', rimSide: -1, look: [0.4, 0], x: -200 }); } });
// s169 — "Você nos vendeu."
registerShot('s169', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.9, 2.0), dz: 0.05, x0: 360, y0: 200 }); square(g, t, info, cam, { me: 'nervous', mp: breathe(POSES.sad, t), ht: tk(info, 0, info.dur - 0.1) });
  blurLayer(g, 10, (g) => { drawChar(g, { x: E.W * 0.12, y: E.H * 1.4, s: 4.0, facing: 1, outfit: HAYATO, pose: POSES.point, expr: 'angry', rim: false }); });
} });
// s170 — "Não é a mesma coisa."
registerShot('s170', { draw(g, t, info) { faceShot(g, t, info, { bg: townBg({ mood: 'golden', x: 300 }), who: HAYATO, expr: 'determined', talk: tk(info, 0, info.dur - 0.1), mood: 'golden', rimSide: 1, look: [-0.3, 0], x: 160, push: 0.08 }); } });
// s171 — "Ninguém defendeu o traidor."
registerShot('s171', { draw(g, t, info) { square(g, t, info, push(t, info, { z0: 1.15, dz: 0.05, x0: 200, y0: 60 }), { ge: 'sad', me: 'scared', mp: posesAt(t, [[0, POSES.stand], [0.8, POSES.kneel]]), hp: POSES.crossArms, he: 'determined', spear: (i) => -1.45 + ease.out(prog(t, 0.2 + i * 0.15, 0.8 + i * 0.15)) * 1.3 }); } });
registerShot('s172', { draw(g, t, info) { markShot(g, t, info, 6); } });
// s173 — "Naquele dia, Hayato percebeu que as pessoas se ajoelhavam quando ele passava."
registerShot('s173', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, dz: 0.04, x0: -120, dx: 200, y0: 60 }), geo = town(g, t, cam, { mood: 'golden' }); const hx = geo.CX - 500 + t * 170;
  layer(g, cam, 1, (g) => { for (let i = 0; i < 9; i++) { const x = geo.CX - 760 + i * 190, kneel = x < hx + 120; drawFigure(g, { x, y: geo.GY + 60 + (i % 2) * 10, s: 1.0, facing: x < hx ? 1 : -1, outfit: { top: 'tshirt', color: ['#5a5040', '#6a5a48', '#4a4a50'][i % 3], head: i % 2 ? 'bun' : 'none' }, pose: kneel ? PZ.bow : POSES.stand, expr: 'awe', rim: rimOf(geo.M, [-1, -0.4], 4) }); }
    drawChar(g, { x: hx, y: geo.GY + 20, s: 1.2, facing: 1, outfit: HAYATO, pose: walkPose(t * 4.5, { stride: 16 }), expr: 'sad', rim: rimOf(geo.M, [-1, -0.4]), weapon: ['sheath', 'bowBack'] }); });
} });
// s174 — "Ninguém mais o chamava pelo nome."   s175 — "Só de oni."
registerShot('s174', { draw(g, t, info) { blurLayer(g, 12, townBg({ mood: 'golden' })); veil(g, '#08060a', 0.5); const str = 'HAYATO'; for (let i = 0; i < str.length; i++) { const a = 1 - prog(t, 0.4 + i * 0.18, 0.8 + i * 0.18); text(g, str[i], E.W / 2 + (i - 2.5) * 130, E.H * 0.46 - (1 - a) * 40, { size: 150, color: S().ui.cream, glow: 20, glowColor: 'rgba(255,200,150,.5)', alpha: a }); } FX.rings(g, E.W * 0.2, E.H * 0.5, t, { color: '#ffd0a0', r0: 20, r1: 160, a: 0.25 }); FX.rings(g, E.W * 0.8, E.H * 0.42, t + 0.5, { color: '#ffd0a0', r0: 20, r1: 160, a: 0.25 }); } });
registerShot('s175', { draw(g, t, info) { blurLayer(g, 12, townBg({ mood: 'golden' })); veil(g, '#08060a', 0.55); const k = ease.outBack(prog(t, 0.05, 0.5)); g.save(); g.translate(E.W / 2, E.H * 0.46); g.scale(k, k); text(g, 'ONI', 0, 0, { size: 220, color: '#ff5a4a', glow: 50, glowColor: 'rgba(255,60,40,.8)', spacing: 20 }); g.restore(); } });
// s176 — "Ele deixou Sayo com uma família de camponeses, onde ela tinha comida e um lar."
registerShot('s176', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.1, dz: 0.05, x0: -100, y0: 40 }), geo = farm(g, t, cam);
  layer(g, cam, 1, (g) => { const fx = geo.CX - 380; drawChar(g, { x: fx - 120, y: geo.GY, s: 1.05, facing: 1, outfit: FAMILY, pose: breathe(POSES.wave, t), expr: 'smile', rim: rimOf(geo.M, [1, -0.5], 4) }); drawChar(g, { x: fx + 0, y: geo.GY, s: 1.0, facing: 1, outfit: { ...FAMILY, top: 'dress', color: '#7a5a5a', head: 'ponytail' }, pose: breathe(POSES.relaxed, t, 1, 2), expr: 'smile', rim: rimOf(geo.M, [1, -0.5], 4) });
    drawChar(g, { x: geo.CX + 60, y: geo.GY + 10, s: 1.05, facing: -1, outfit: SAYO, pose: breathe(POSES.stand, t, 1, 3), expr: 'worried', rim: rimOf(geo.M, [1, -0.5], 4) }); drawChar(g, { x: geo.CX + 220, y: geo.GY + 10, s: 1.1, facing: -1, outfit: HAYATO, pose: breathe(POSES.relaxed, t), expr: 'neutral', rim: rimOf(geo.M, [1, -0.5], 4), weapon: ['sheath', 'bowBack'] }); });
} });
// s177 — "Ajoelhou-se diante dela e disse: Cante a música."
function farewell(g, t, info, cam, o = {}) { const geo = farm(g, t, cam); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX + 120, y: geo.GY + 10, s: 1.5, facing: -1, outfit: HAYATO, pose: breathe(o.hp || { ...POSES.kneel, eF: [30, -120], hF: [50, -136] }, t), expr: o.he || 'sad', talk: o.ht || 0, rim: rimOf(geo.M, [1, -0.5]), weapon: 'sheath' }); drawChar(g, { x: geo.CX - 120, y: geo.GY + 10, s: 1.5, facing: 1, outfit: SAYO, pose: breathe(o.sp || POSES.stand, t, 1.2, 2), expr: o.se || 'sad', rim: rimOf(geo.M, [1, -0.5]), blink: blinkAt(t, 2.6) }); }); return geo; }
registerShot('s177', { draw(g, t, info) { const st = wt('cante', info, 2); farewell(g, t, info, push(t, info, { z0: V(1.7, 1.8), dz: 0.05, y0: 190 }), { hp: posesAt(t, [[0, POSES.stand], [0.6, { ...POSES.kneel, eF: [30, -120], hF: [50, -136] }]], 0.5), ht: tk(info, st, info.dur - 0.1) }); } });
registerShot('s178', { draw(g, t, info) { faceShot(g, t, info, { bg: farmBg(), who: HAYATO, expr: 'sad', talk: tk(info, 0, info.dur - 0.1), mood: 'dusk', rimSide: 1, look: [-0.3, 0.3], x: 140 }); } });
registerShot('s179', { draw(g, t, info) { faceShot(g, t, info, { bg: farmBg({ x: 200 }), who: HAYATO, expr: 'smile', face: { mouth: 'smallSmile' }, talk: tk(info, 0, info.dur - 0.1), mood: 'dusk', rimSide: 1, look: [-0.4, 0.4], x: -120, r: V(330, 360) }); } });
// s180 — "Ela pediu para ir junto."
registerShot('s180', { draw(g, t, info) { faceShot(g, t, info, { bg: farmBg({ x: -200 }), who: SAYO, expr: 'cry', mood: 'dusk', rimSide: -1, look: [0.3, -0.5] }); } });
// s181 — "Ele disse que não."
registerShot('s181', { draw(g, t, info) { farewell(g, t, info, push(t, info, { z0: V(1.7, 1.8), dz: 0.04, y0: 190 }), { hp: { ...POSES.kneel, head: [10 + Math.sin(t * 8) * 6 * (t < 0.8 ? 1 : 0), -168] }, se: 'cry' }); } });
// s182 — "Foi a última vez que se viram."
registerShot('s182', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.04, x0: 60 }), geo = farm(g, t, cam, { sunX: 700 }); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 300, y: geo.GY, s: 0.8, facing: 1, outfit: SAYO, pose: breathe(POSES.stand, t), expr: 'sad', rim: rimOf(geo.M, [1, -0.5], 3) }); drawChar(g, { x: geo.CX + 300 + t * 90, y: geo.GY + 6, s: 0.85, facing: 1, outfit: HAYATO, pose: walkPose(t * 4.2), expr: 'sad', rim: rimOf(geo.M, [1, -0.5], 3), weapon: ['sheath', 'bowBack'] }); }); } });
// s183 — "Ela entenderia mais tarde."
registerShot('s183', { draw(g, t, info) { const cam = push(t, info, { z0: V(2.0, 2.1), dz: 0.05, x0: -300, y0: 230 }), geo = farm(g, t, cam, { sunX: 700 }); layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX - 300, y: geo.GY, s: 1.0, facing: 1, outfit: SAYO, pose: breathe({ ...POSES.stand, head: [6 + Math.sin(t * 2) * 2, -206] }, t), expr: 'sad', look: [1, 0], rim: rimOf(geo.M, [1, -0.5], 5) })); FX.dust(g, t * 2, { count: 30, color: '#ffe2bd', a: 0.3 }); } });
// s184 — "Um nome pode ser caçado."   s185 — "Uma lenda, não."
function nameTarget(g, t, info, dissolve) {
  UI.blueprint(g); const ui = S().ui; const str = 'HAYATO';
  if (!dissolve) { text(g, str, E.W / 2, E.H * 0.48, { size: 170, color: ui.cream, glow: 16, glowColor: 'rgba(255,220,180,.4)', spacing: 14 }); ring(g, E.W / 2, E.H * 0.48, 340, 4, alpha(ui.accent, 0.8)); seg(g, [[E.W / 2 - 420, E.H * 0.48], [E.W / 2 - 260, E.H * 0.48]], 4, ui.accent); seg(g, [[E.W / 2 + 260, E.H * 0.48], [E.W / 2 + 420, E.H * 0.48]], 4, ui.accent);
    for (let i = 0; i < 4; i++) { const p = prog(t, 0.4 + i * 0.25, 0.7 + i * 0.25); if (p <= 0) continue; const a0 = i * 1.6 + 0.4, x = E.W / 2 + Math.cos(a0) * lerp(1100, 120, p), y = E.H * 0.48 + Math.sin(a0) * lerp(700, 80, p); arrow(g, x, y, a0 + Math.PI, 1.3, { ink: ui.gold, trail: p < 1 ? 140 : 0 }); } }
  else { const p = ease.inOut(prog(t, 0.1, 1.4)), r = rng(3); for (let i = 0; i < 160; i++) { const x0 = E.W / 2 + (r() - 0.5) * 900, y0 = E.H * 0.48 + (r() - 0.5) * 160, a = r() * 6.28, d = p * (200 + r() * 600); circle(g, x0 + Math.cos(a) * d, y0 + Math.sin(a) * d - p * 200, 3 + r() * 4, alpha(ui.cream, 0.8 * (1 - p * 0.6))); } text(g, str, E.W / 2, E.H * 0.48, { size: 170, color: ui.cream, spacing: 14 + p * 60, alpha: 1 - p });
    text(g, 'Da lama ele levantou...', E.W / 2, E.H * 0.48, { size: 70, font: FONTS.serif, italic: true, weight: 900, color: '#f6ecd8', glow: 20, glowColor: 'rgba(255,190,110,.55)', alpha: prog(t, 1.0, 1.6) });
    for (let i = 0; i < 3; i++) { const p2 = prog(t, 0.3 + i * 0.25, 1.0 + i * 0.25); if (p2 > 0 && p2 < 1) arrow(g, lerp(-100, E.W + 100, p2), E.H * (0.3 + i * 0.18), 0, 1.2, { ink: ui.gold, trail: 200 }); } }
}
registerShot('s184', { draw(g, t, info) { nameTarget(g, t, info, false); } });
registerShot('s185', { draw(g, t, info) { nameTarget(g, t, info, true); } });
// s186/s187 — the song across the land
registerShot('s186', { draw(g, t, info) { const cam = push(t, info, { z0: 1.05, dz: 0.05, x0: -100, dx: 80 }); hills(g, t, cam, { mood: 'dusk', village: true }); veil(g, '#05040a', 0.15); lyrics(g, t, info, SONG1); } });
registerShot('s187', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.05, x0: 0, dx: 100 }), geo = hills(g, t, cam, { mood: 'dusk' }); layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX + 200 + t * 60, y: geo.GY - 6, s: 0.6, facing: 1, outfit: HAYATO, pose: walkPose(t * 4), expr: 'neutral', rim: rimOf(geo.M, [1, -0.5], 3), weapon: ['sheath', 'bowBack'] })); veil(g, '#05040a', 0.15); lyrics(g, t, info, SONG2); } });
// s188 — "O Imperador Tarvos mandou o próprio irmão, Ishkar,"
registerShot('s188', { draw(g, t, info) { const cam = push(t, info, { z0: V(1.5, 1.6), dz: 0.05, x0: -220, y0: 140 }), geo = najima(g, t, cam); layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX - 300, y: geo.GY, s: 1.6, facing: 1, outfit: ISHKAR, pose: breathe(POSES.relaxed, t), expr: 'determined', rim: rimOf(geo.M, [0.6, -1], 5), weapon: 'sheath' })); nameCard(g, t, info.dur, 'ISHKAR', 'IRMÃO DO IMPERADOR', { a: prog(t, wt('ishkar', info, 2) - 0.2, wt('ishkar', info, 2) + 0.2) }); } });
// s189 — "com mil soldados de elite para a fortaleza de Najima."
registerShot('s189', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.06 }); najima(g, t, cam); UI.readout(g, { value: String(Math.round(1000 * ease.out(prog(t, 0.3, 2.0)))), label: 'SOLDADOS', x: V(180, 100), y: E.H * 0.24, size: V(96, 100) }); nameCard(g, t, info.dur, 'NAJIMA', 'A FORTALEZA', { a: prog(t, wt('najima', info, 4) - 0.3, wt('najima', info, 4)) }); } });
// s190 — "Hayato não atacou."
registerShot('s190', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.03, x0: 100 }), geo = najima(g, t, cam); blurLayer(g, 3, (g) => { g.fillStyle = '#05040a'; g.fillRect(0, 0, 200, E.H); g.fillRect(E.W * 0.3, 0, 120, E.H); drawChar(g, { x: E.W * 0.2, y: E.H * 0.95, s: 2.6, facing: 1, outfit: HAYATO, pose: breathe(POSES.stand, t), expr: 'determined', rim: rimOf(geo.M, [0.6, -1], 7), weapon: ['sheath', 'bowBack'] }); }); } });
// s191 — "Cercou-a."   s192 — "Um homem sitiando mil."
function siegeMap(g, t, info, o = {}) {
  UI.blueprint(g); const ui = S().ui, bp = ui.blueprint, cx = E.W / 2, cy = E.H * 0.5, R = 330;
  rr(g, cx - 90, cy - 90, 180, 180, 10); g.strokeStyle = bp; g.lineWidth = 5; g.stroke(); for (let i = 0; i < 40; i++) { const r = rng(i); circle(g, cx - 70 + r() * 140, cy - 70 + r() * 140, 5, alpha(ui.accent, 0.8)); }
  const p = o.p ?? 1; g.setLineDash([16, 14]); g.strokeStyle = ui.gold; g.lineWidth = 5; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); g.stroke(); g.setLineDash([]);
  const a = -Math.PI / 2 + p * Math.PI * 2 + (o.orbit ? t * 1.5 : 0); circle(g, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 16, '#d64a33'); glow(g, cx + Math.cos(a) * R, cy + Math.sin(a) * R, 60, '#d64a33', 0.6);
  text(g, 'NAJIMA', cx, cy + 140, { size: 32, font: FONTS.ui, weight: 900, color: ui.cream, spacing: 6 });
}
registerShot('s191', { draw(g, t, info) { siegeMap(g, t, info, { p: ease.inOut(prog(t, 0, info.dur - 0.1)) }); } });
registerShot('s192', { draw(g, t, info) { siegeMap(g, t, info, { orbit: true }); UI.readout(g, { value: '1', x: E.W * 0.17, y: E.H * 0.5, align: 'center', size: 140, color: '#ff7a5a', a: prog(t, 0.1, 0.4) }); text(g, 'vs', E.W * 0.17, E.H * 0.62, { size: 40, font: FONTS.ui, weight: 900, color: S().ui.cream, alpha: prog(t, 0.3, 0.6) }); UI.readout(g, { value: '1000', x: E.W * 0.83, y: E.H * 0.5, align: 'center', size: 120, a: prog(t, wt('mil', info, 1) - 0.1, wt('mil', info, 1) + 0.2) }); } });
// s193 — "Patrulhas sumiam."
registerShot('s193', { draw(g, t, info) { const cam = push(t, info, { z0: 1.3, dz: 0.05, y0: 60 }), geo = forest(g, t, cam, { mood: 'night' }); veil(g, '#000', 0.3); layer(g, cam, 1, (g) => { for (let i = 0; i < 3; i++) { const gone = t > 0.25 + i * 0.3; if (gone) continue; drawChar(g, { x: geo.CX - 300 + i * 260 + t * 80, y: geo.GY, s: 1.1, facing: 1, outfit: SOLDIER, pose: walkPose(t * 4 + i), expr: 'nervous', rim: { color: '#ffb070', dir: [0, -1], w: 4 }, weapon: 'torch', t: t + i }); } }); } });
// s194 — "Barcos queimavam."
registerShot('s194', { draw(g, t, info) { const cam = push(t, info, { z0: 1.6, dz: 0.06, x0: 700, y0: 140 }); najima(g, t, cam, { boats: 1 }); embers(g, t, { count: 50 }); } });
// s195 — "Flechas caíam do escuro."
registerShot('s195', { draw(g, t, info) { const cam = push(t, info, { z0: 1.8, dz: 0.05, x0: 200, y0: -260 }), geo = najima(g, t, cam); layer(g, cam, 0.35, (g) => { for (let i = 0; i < 14; i++) { const r = rng(i), t0 = r() * 1.2, p = prog(t, t0, t0 + 0.5); if (p <= 0) continue; const x = geo.fx - 300 + r() * 600, y1 = geo.top - 60 - r() * 60; arrow(g, x - 300 * (1 - p), y1 - 500 * (1 - p), 1.0, 0.7, { trail: p < 1 ? 120 : 0 }); } }); } });
// s196 — "O cerco também cobrou seu preço."
registerShot('s196', { draw(g, t, info) { const cam = push(t, info, { z0: V(1.7, 1.8), dz: 0.05, x0: -250, y0: 200 }), geo = forest(g, t, cam, { mood: 'night' }); layer(g, cam, 1, (g) => { g.fillStyle = '#05040a'; g.fillRect(geo.CX - 470, -E.H, 90, geo.GY + E.H + 30); drawChar(g, { x: geo.CX - 370, y: geo.GY, s: 1.4, facing: 1, outfit: HAYATO, pose: breathe(POSES.sitBack, t, 1.8), expr: 'sleepy', rim: rimOf(geo.M, [0.6, -1]), weapon: 'sheath' }); }); } });
// s197 — "Uma lança atingiu Hayato na lateral do corpo,"
registerShot('s197', { draw(g, t, info) { const cam = push(t, info, { z0: 1.6, dz: 0.04, y0: 150 }), geo = forest(g, t, cam, { mood: 'night' }); const hit = 0.45, [sx, sy] = shake(t, t > hit && t < hit + 0.4 ? 10 : 0, 20); g.save(); g.translate(sx, sy); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX + 260 - ease.out(prog(t, 0, hit)) * 140, y: geo.GY, s: 1.4, facing: -1, outfit: SOLDIER, pose: POSES.reach, expr: 'angry', rim: rimOf(geo.M, [0.6, -1]), weapon: 'spear', spearAng: 0.05, spearLen: 360 }); drawChar(g, { x: geo.CX - 160, y: geo.GY, s: 1.4, facing: 1, outfit: HAYATO, pose: t < hit ? PZ.guard : POSES.fall, expr: t < hit ? 'determined' : 'shocked', rim: rimOf(geo.M, [0.6, -1]), weapon: 'sword', swordAng: -0.5 }); if (t > hit) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, geo.CX - 150, geo.GY - 180, 120, '#ff3a2a', 0.6 * (1 - prog(t, hit, hit + 1))); g.restore(); } }); g.restore(); if (t > hit) veil(g, '#400808', 0.25 * (1 - prog(t, hit, info.dur))); } });
// s198 — "e ele passou cinco dias ardendo em febre numa gruta,"
registerShot('s198', { draw(g, t, info) { const cam = push(t, info, { z0: 1.3, dz: 0.06, y0: 100 }), geo = grotto(g, t, cam); layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX - 140, y: geo.GY - 10, s: 1.4, facing: 1, outfit: HAYATO, pose: PZ.lieSide, rot: -Math.PI / 2, expr: t % 2 < 1 ? 'nervous' : 'sleepy', rim: { color: '#ffb070', dir: [0.3, -1], w: 5 }, shadow: false })); const wob = Math.sin(t * 2) * 0.5 + 0.5; veil(g, '#401010', 0.1 + 0.1 * wob); UI.badge(g, { str: `DIA ${1 + Math.min(4, Math.floor(prog(t, 0, info.dur - 0.2) * 5))}`, size: V(52, 56) }); } });
// s199 — "vendo os trinta de Iki ao seu redor."
registerShot('s199', { draw(g, t, info) { const cam = push(t, info, { z0: 1.05, dz: 0.06, y0: 40 }), geo = grotto(g, t, cam); layer(g, cam, 1, (g) => { ghosts(g, t, Array.from({ length: 14 }, (_, i) => geo.CX - 760 + i * 117), geo.GY - 40, 0.95, { a: 0.35, jiro: 7, f: (i) => (i < 7 ? 1 : -1) }); drawChar(g, { x: geo.CX - 140, y: geo.GY - 10, s: 1.3, facing: 1, outfit: HAYATO, pose: PZ.lieSide, rot: -Math.PI / 2, expr: 'sleepy', rim: { color: '#bfe0ff', dir: [0.3, -1], w: 5 }, shadow: false }); }); } });
// s200 — "Depois, voltou ao cerco."
registerShot('s200', { draw(g, t, info) { const cam = push(t, info, { z0: 1.2, dz: 0.05, x0: 360, y0: 60 }), geo = grotto(g, t, cam, { fire: false }); layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX + 620, y: geo.GY - 10, s: 1.3, facing: 1, outfit: HAYATO, pose: posesAt(t, [[0, POSES.crouch], [0.5, POSES.stand]], 0.6), expr: 'determined', rim: rimOf(geo.M, [0.2, -1], 6), weapon: ['sheath', 'bowBack'] })); } });
// s201 — "Lá dentro, a comida acabou."
registerShot('s201', { draw(g, t, info) { const cam = push(t, info, { z0: 1.2, dz: 0.05, y0: 60 }), geo = scriptorium(g, t, cam, { tables: false }); layer(g, cam, 1, (g) => { for (let i = 0; i < 3; i++) { const bx = geo.CX - 500 + i * 200; rr(g, bx - 60, geo.GY - 150, 120, 150, 14); g.fillStyle = '#2a1e16'; g.fill(); g.fillStyle = '#0a0806'; g.beginPath(); g.ellipse(bx, geo.GY - 150, 60, 14, 0, 0, Math.PI * 2); g.fill(); } for (let i = 0; i < 3; i++) drawChar(g, { x: geo.CX + 160 + i * 200, y: geo.GY, s: 1.2, facing: -1, outfit: SOLDIER, pose: breathe(i === 1 ? POSES.sad : PZ.sitFire, t, 1.5, i), expr: 'sad', rim: { color: '#ffb070', dir: [-1, -0.3], w: 4 } }); }); } });
// s202 — "Os soldados desertavam de madrugada."
registerShot('s202', { draw(g, t, info) { const cam = push(t, info, { z0: 1.6, dz: 0.05, x0: 200, y0: -200 }), geo = najima(g, t, cam, { dawn: 0.6, moon: false }); layer(g, cam, 0.35, (g) => { for (let i = 0; i < 4; i++) { const p = prog(t, i * 0.5, i * 0.5 + 1.4); drawFigure(g, { x: geo.fx - 200 + i * 130 + p * 160, y: geo.top - 130 + p * 330, s: 0.5, facing: 1, outfit: SOLDIER, pose: p < 0.3 ? PZ.climb : walkPose(t * 7 + i, { run: true }), expr: 'scared', rim: { color: '#ffb090', dir: [1, -0.5], w: 3 } }); } }); } });
// s203 — "No quadragésimo dia,"
registerShot('s203', { draw(g, t, info) { najima(g, t, push(t, info, { z0: 1.0, dz: 0.04 }), { dawn: 0.3 }); veil(g, '#05040a', 0.45); UI.readout(g, { value: String(Math.round(1 + 39 * ease.out(prog(t, 0, info.dur - 0.4)))), label: 'DIA', x: E.W / 2, y: E.H * 0.45, align: 'center', size: 170 }); } });
// s204 — "Ishkar saiu sozinho, sem armadura, para negociar."
registerShot('s204', { draw(g, t, info) { const cam = push(t, info, { z0: 1.6, dz: 0.06, x0: 200, y0: -180 }), geo = najima(g, t, cam, { gate: 1, dawn: 0.2 }); layer(g, cam, 0.35, (g) => drawChar(g, { x: geo.fx + t * 40, y: geo.top + ease.out(prog(t, 0.3, info.dur)) * 160, s: 0.55, facing: 1, outfit: { ...ISHKAR }, pose: walkPose(t * 4), expr: 'neutral', rim: rimOf(geo.M, [0, -1], 3) })); } });
// s205 — "Os dois conversaram por muito tempo à beira da floresta."
registerShot('s205', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.06, x0: -60, dx: 60 }), geo = forest(g, t, cam, { mood: 'dusk', moon: false }); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 160, y: geo.GY, s: 1.1, facing: 1, outfit: HAYATO, pose: breathe(PZ.sitFire, t), expr: 'neutral', talk: (t % 4) < 1.6 ? 0.2 + 0.2 * Math.abs(Math.sin(t * 7)) : 0, rim: rimOf(geo.M, [-1, -0.4], 4), weapon: 'sheath' }); drawChar(g, { x: geo.CX + 160, y: geo.GY, s: 1.1, facing: -1, outfit: ISHKAR, pose: breathe(PZ.sitFire, t, 1, 2), expr: 'sad', talk: (t % 4) > 2 && (t % 4) < 3.6 ? 0.2 + 0.2 * Math.abs(Math.sin(t * 7)) : 0, rim: rimOf(geo.M, [-1, -0.4], 4) }); }); } });
// s206 — "Ninguém registrou o que disseram."
registerShot('s206', { draw(g, t, info) { blurLayer(g, 12, (g) => scriptorium(g, t, { z: 1.6, y: 200 })); veil(g, '#08060a', 0.4); const z = 1 + 0.05 * t / info.dur; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); rr(g, -460, -300, 920, 600, 6); g.fillStyle = linGrad(g, 0, -300, 0, 300, ['#efe2c0', '#d8c69a']); g.fill(); g.restore(); const qx = E.W * 0.6 + Math.sin(t * 2) * 10, qy = E.H * 0.45 + Math.cos(t * 1.6) * 8; seg(g, [[qx, qy], [qx + 160, qy - 260]], 6, '#2a1a10'); poly(g, [[qx + 160, qy - 260], [qx + 220, qy - 330], [qx + 120, qy - 230]], '#e8e2d6'); } });
// s207 — "Ishkar não voltou, e os soldados abandonaram Najima naquela noite."
registerShot('s207', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.05 }), geo = najima(g, t, cam, { empty: true, gate: 0.3 }); layer(g, cam, 0.35, (g) => { for (let i = 0; i < 9; i++) { const p = ((t * 0.18 + i / 9) % 1); const x = geo.fx + 80 + p * 900, y = geo.top + 40 + p * 360; flame(g, x, y - 20, 12, t + i); glow(g, x, y - 20, 40, '#ffb060', 0.3); } }); } });
registerShot('s208', { draw(g, t, info) { markShot(g, t, info, 7); } });
// s209 — "O império já não tinha generais para mandar."
registerShot('s209', { draw(g, t, info) { UI.blueprint(g, { a: 0.04 }); veil(g, '#000', 0.35); const z = 1 + 0.06 * t / info.dur; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); roster(g, t, { shown: 8, silhouettes: SIL8, crossed: 7, y: E.H * 0.5, hot: 7 }); g.restore(); g.save(); g.globalCompositeOperation = 'lighter'; const n = 8, gap = Math.min(220, E.W * 0.86 / n), x = E.W / 2 + gap * 3.5; glow(g, x, E.H * 0.48, 260, GOLD, 0.2 + 0.1 * Math.sin(t * 3)); g.restore(); } });
