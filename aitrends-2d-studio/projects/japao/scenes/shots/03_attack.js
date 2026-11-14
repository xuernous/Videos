// shots/03_attack.js — the attack on Iki, the beach at night, the thirty stones, Ordek, the first mark.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, shake, rng, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { coast, seaView, hillTop } from '../sets/coast.js';
import { enemyCamp, bigTree } from '../sets/camp.js';
import { beachNight, ravine, grassField } from '../sets/night.js';
import { scriptorium } from '../sets/misc.js';
import { drawChar, rider, drawHorse, faceShot, nameCard, sheath, knife, banner, push, rimOf, blinkAt, PZ, arrow, flame, embers, smoke, roster, markNumeral, grassBlades, KZ_RED, GOLD } from '../sets/lib.js';
import { HAYATO, JIRO, IKI, SOLDIER, ORDEK, SCRIBE, PEASANT } from '../cast.js';
import { wt, SIL8 } from './01_open.js';

// ---- the mark shot (reused for all eight) ----
export function markShot(g, t, info, n, o = {}) {
  const M = mood(o.mood || 'dusk');
  backdrop(g, [shade(M.dark, -0.6), shade(M.sky[0], -0.5)]);
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.45, E.H * 0.5, 900, o.glowC || '#ff9a5a', 0.12); g.restore();
  const k = ease.inOut(t / info.dur), cut = o.cutAt ?? 0.15, [sx, sy] = shake(t, t > cut + 0.25 && t < cut + 0.5 ? 6 : 0, 20);
  g.save(); g.translate(sx, sy);
  const sh = sheath(g, E.W * 0.44, E.H * 0.42, V(1450, 980) * (1 + 0.04 * k), t, { marks: n, newMark: n, cutAt: cut + 0.15, rot: -0.07, old: o.old, lit: '#ffb070' });
  const [mx, my] = sh.markX(n), kp = ease.inOut(prog(t, cut, cut + 0.5)); if (kp < 1) knife(g, mx + 40 - kp * 60, my - 90 + kp * 70, -0.9, 1.5, S().ink);
  g.restore();
  markNumeral(g, t, n, { at: cut + 0.3, x: E.W * 0.82, y: E.H * 0.36 });
  g.save(); g.translate(E.W / 2, E.H * 0.8); g.scale(0.5, 0.5); g.translate(-E.W / 2, -E.H * 0.5);
  const cr = Array.from({ length: 8 }, (_, i) => (i < n - 1 ? -1 : i === n - 1 ? cut + 0.5 : null)); roster(g, t, { shown: 8, silhouettes: SIL8, crossT: cr, y: E.H * 0.5, hot: n - 1 }); g.restore();
  FX.dust(g, t, { count: 30, color: '#ffd0a0', a: 0.3 });
}
registerShot('s082', { draw(g, t, info) { markShot(g, t, info, 1); } });

const coastBurn = (o = {}) => (g, t) => coast(g, t, { z: o.z ?? 1.5, x: o.x ?? 0, y: o.y ?? -80 }, { mood: 'dusk', burn: 1, ...o });
// s049 — "Quando chegou, era tarde."
registerShot('s049', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.1, dz: 0.06, x0: 60, dx: -80 }), geo = coast(g, t, cam, { mood: 'dusk', burn: 0.6 + 0.4 * prog(t, 0, info.dur), fleet: 1, fleetCount: 60 });
  layer(g, cam, 1, (g) => { const x = geo.CX - 200 - t * 420; rider(g, x, geo.GY + 20, 1.1, -1, t, { outfit: HAYATO, pose: PZ.ride, expr: 'shocked', rim: { color: '#ff9a5a', dir: [1, -0.4], w: 5 }, weapon: ['bowBack'] }, { rim: { color: '#ff9a5a', dir: [1, -0.4], w: 5 }, speed: 2 }); });
  embers(g, t, { count: 40 });
} });
// s050 — "Eram trinta contra milhares."
registerShot('s050', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.05, dz: 0.05, x0: -40 }), geo = coast(g, t, cam, { mood: 'dusk', burn: 1, fleet: 1, fleetCount: 80, village: true });
  layer(g, cam, 1, (g) => { const rim = { color: '#ff9a5a', dir: [1, -0.4], w: 3 };
    for (let i = 0; i < 30; i++) drawChar(g, { x: geo.CX - 820 + (i % 10) * 34, y: geo.GY - 20 + Math.floor(i / 10) * 26, s: 0.42, facing: 1, outfit: IKI, pose: POSES.ready, expr: 'determined', rim, weapon: 'spear', spearAng: -0.5 });
    const r = rng(5); for (let i = 0; i < 140; i++) { const row = i % 6; drawFigure(g, { x: geo.CX - 120 + (i / 6 | 0) * 40 + r() * 20 - t * 30, y: geo.GY - 40 + row * 22, s: 0.36 + row * 0.02, facing: -1, outfit: SOLDIER, pose: walkPose(t * 6 + i), expr: 'angry', rim }); } });
  UI.readout(g, { value: '30', x: E.W * 0.22, y: E.H * 0.3, align: 'center', size: V(110, 120), color: S().ui.cream, a: prog(t, 0.2, 0.5) });
  text(g, 'VS', E.W * 0.5, E.H * 0.3, { size: 60, font: FONTS.ui, weight: 900, color: S().ui.cream, alpha: prog(t, 0.5, 0.8) });
  UI.readout(g, { value: 'MILHARES', x: E.W * 0.76, y: E.H * 0.3, align: 'center', size: V(100, 110), color: S().ui.accent, a: prog(t, wt('milhares', info, 1) - 0.1, wt('milhares', info, 1) + 0.2) });
  embers(g, t, { count: 30 });
} });
// s051 — "Uma flecha derrubou seu cavalo"
registerShot('s051', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.5, dz: 0.08, y0: 100 }), geo = grassField(g, t * 0.4, cam, { fireGlow: 0.6 }); const hit = 0.7, ts = t < hit ? t : hit + (t - hit) * 0.25;
  layer(g, cam, 1, (g) => { const fall = ease.in(prog(ts, hit, hit + 0.9)); g.save(); const px = geo.CX + 60, py = geo.GY + 20; g.translate(px, py); g.rotate(-fall * 0.9); g.translate(-px, -py);
    rider(g, geo.CX - 200 + ts * 340, geo.GY + 20, 1.2, 1, ts, { outfit: HAYATO, pose: t < hit ? PZ.ride : POSES.fall, expr: t < hit ? 'determined' : 'shocked', rim: { color: '#ff9a5a', dir: [-1, -0.4], w: 5 }, weapon: ['bowBack'] }, { rim: { color: '#ff9a5a', dir: [-1, -0.4], w: 5 }, speed: 2, rearing: fall }); g.restore();
    const ap = prog(t, hit - 0.35, hit); if (ap < 1) arrow(g, lerp(E.W + 100, geo.CX + 60, ap), lerp(geo.GY - 400, geo.GY - 150, ap), Math.PI + 0.4, 1.3, { trail: 220 }); });
  if (t > hit) veil(g, '#203050', 0.15);
} });
// s052 — "e ele caiu na lama, escondido pelo capim."
registerShot('s052', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.4, dz: 0.05, y0: 160 }), geo = grassField(g, t, cam, { fireGlow: 0.8 });
  layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX + 40, y: geo.GY + 30, s: 1.4, facing: 1, outfit: HAYATO, pose: PZ.lieSide, rot: -Math.PI / 2, expr: 'scared', rim: { color: '#ff9a5a', dir: [0.4, -1], w: 5 }, shadow: false }));
  blurLayer(g, 6, (g) => grassBlades(g, t, { y: E.H + 40, count: 70, h: 520, color: '#0a0806', seed: 9 }), cam, 1.3);
} });
// s053 — "Ouviu tudo."
registerShot('s053', { draw(g, t, info) {
  faceShot(g, t, info, { bg: (g, t) => grassField(g, t, { z: 1.6, y: -100 }, { fireGlow: 1 }), who: HAYATO, expr: 'scared', mood: 'dusk', rimColor: '#ff9a5a', rimSide: 1, look: [0.7, -0.2], tilt: -0.25, y: 40, push: 0.08 });
  blurLayer(g, 4, (g) => grassBlades(g, t, { y: E.H + 60, count: 40, h: 700, color: '#0a0806', seed: 12 }));
} });
// s054 — "Os gritos."
registerShot('s054', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, dz: 0.05, x0: 40, y0: 40 }); blurLayer(g, 5, (g) => { const geo = grassField(g, t, cam, { fireGlow: 1 }); layer(g, cam, 0.6, (g) => { for (let i = 0; i < 8; i++) drawFigure(g, { x: geo.CX - 600 + i * 170 + ((t * 300 * (i % 2 ? 1 : -1)) % 300), y: geo.GY - 80, s: 0.8, facing: i % 2 ? 1 : -1, outfit: i % 3 ? SOLDIER : IKI, pose: walkPose(t * 9 + i, { run: true }), rim: { color: '#ff7a3a', dir: [0, -1], w: 4 } }); }); });
  FX.rings(g, E.W * 0.6, E.H * 0.4, t, { color: '#ffb080', r0: 40, r1: 300, a: 0.4, count: 4 });
  grassBlades(g, t, { y: E.H + 40, count: 60, h: 760, color: '#080605', seed: 13 });
} });
// s055 — "O fogo."
registerShot('s055', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.7, dz: 0.06, x0: 560, y0: -160 }); coast(g, t, cam, { mood: 'dusk', burn: 1 });
  embers(g, t, { count: 90, speed: 120, size: 3 }); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.6, E.H * 0.5, 900, '#ff5a1a', 0.18); g.restore();
} });
// s056 — "Depois, o silêncio."
registerShot('s056', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.1, dz: 0.03, x0: 200 }); coast(g, t, cam, { mood: 'dusk', burn: 0.25 });
  veil(g, '#2a2832', 0.35); FX.snow(g, t, { count: 120, color: '#b8b4c0', speed: 30 });
} });
// s057 — "À noite, encontrou os companheiros alinhados na praia, contados como mercadoria."
registerShot('s057', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.05, dz: 0.06, x0: -60, dx: 80 }), geo = beachNight(g, t, cam, { covered: 29, blue: true });
  layer(g, cam, 1, (g) => { const x = geo.CX - 820 + t * 70; drawChar(g, { x, y: geo.GY - 10, s: 1.05, facing: 1, outfit: HAYATO, pose: walkPose(t * 4.5, { stride: 16 }), expr: 'sad', rim: rimOf(geo.M, [-0.6, -1], 4), weapon: 'sheath' }); });
  FX.dust(g, t, { count: 20, color: '#cfe0ff', a: 0.2 });
} });
// s058 — "contados como mercadoria." — chalk tally on a plank
registerShot('s058', { draw(g, t, info) {
  blurLayer(g, 12, (g) => beachNight(g, t, { z: 1.4, y: -100 }, { covered: 29 })); veil(g, '#05060c', 0.45);
  const z = 1 + 0.05 * t / info.dur; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.rotate(-0.04);
  rr(g, -720, -170, 1440, 340, 10); g.fillStyle = linGrad(g, 0, -170, 0, 170, ['#3a2a22', '#22160f']); g.fill(); g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 3; for (let y = -120; y < 170; y += 70) { g.beginPath(); g.moveTo(-720, y); g.lineTo(720, y); g.stroke(); }
  const n = Math.floor(30 * ease.out(prog(t, 0.1, info.dur - 0.2))); for (let i = 0; i < n; i++) { const grp = Math.floor(i / 5), j = i % 5, x = -620 + grp * 210 + j * 34, c = alpha('#e8e2d6', 0.85); if (j < 4) seg(g, [[x, -70], [x + 4, 70]], 9, c); else seg(g, [[x - 150, 40], [x, -40]], 9, c); }
  g.restore();
} });
// s059 — "Jirō estava no fim da fileira, de olhos abertos."
registerShot('s059', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.9, 2.0), dz: 0.06, x0: 900, y0: 200 }), geo = beachNight(g, t, cam, { covered: 29, blue: true });
  layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX - 760 + 28 * 62 + 110, y: geo.GY - 40, s: 1.0, facing: -1, outfit: HAYATO, pose: breathe({ ...POSES.kneel, eF: [30, -96], hF: [52, -60] }, t, 0.5), expr: 'cry', rim: rimOf(geo.M, [-0.5, -1], 4) }));
} });
// s060 — "Ninguém respirava."
registerShot('s060', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.04, y0: 0 }); beachNight(g, t, cam, { covered: 29, blue: true }); } });
// s061 — "Hayato enterrou os trinta sob pedras, numa ravina atrás da praia."
registerShot('s061', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.1, dz: 0.05, x0: -40 }), n = 4 + prog(t, 0, info.dur) * 6, geo = ravine(g, t, cam, { cairns: n, moonA: 0.15 });
  layer(g, cam, 1, (g) => { const i = Math.floor(n), col = i % 10, row = Math.floor(i / 10), x = geo.CX - 520 + col * 112 + (row % 2) * 50; drawChar(g, { x: x - 70, y: geo.GY - 20, s: 1.1, facing: 1, outfit: HAYATO, pose: posesAt((t * 0.8) % 2, [[0, POSES.stand], [0.6, PZ.place], [1.6, POSES.stand]], 0.4), expr: 'sad', rim: rimOf(geo.M, [-0.6, -1], 4) }); });
} });
// s062 — "Levou a noite inteira."
registerShot('s062', { draw(g, t, info) {
  const p = prog(t, 0, info.dur), cam = push(t, info, { z0: 1.0, dz: 0.03 }), geo = ravine(g, t, cam, { cairns: 10 + 20 * p, moonA: 0.15 + 0.8 * p, dawn: ease.in(p) * 0.7 });
  layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX + 640, y: geo.GY + 10, s: 1.0, facing: -1, outfit: HAYATO, pose: p < 0.9 ? posesAt((t * 3) % 1, [[0, POSES.stand], [0.5, PZ.place]], 0.2) : PZ.kneelLook, expr: 'sad', rim: rimOf(geo.M, [-0.6, -1], 4) }));
} });
// s063 — "A culpa de estar vivo o acompanharia para sempre."
registerShot('s063', { draw(g, t, info) { faceShot(g, t, info, { bg: (g, t) => ravine(g, t, { z: 1.5, y: -120 }, { cairns: 30, dawn: 0.7, moon: false }), who: HAYATO, expr: 'sad', mood: 'dusk', rimSide: 1, look: [-0.3, 0.4], push: 0.08, blinkP: 2.6 }); } });
// s064 — "Depois, pegou o arco de Jirō e contou as flechas."
registerShot('s064', { draw(g, t, info) {
  blurLayer(g, 12, (g) => ravine(g, t, { z: 1.6, y: -140 }, { cairns: 30, dawn: 0.75, moon: false })); veil(g, '#08060c', 0.4);
  const z = 1 + 0.05 * t / info.dur, ink = S().ink; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  g.strokeStyle = ink; g.lineWidth = 16; g.beginPath(); g.moveTo(E.W * 0.12, E.H * 0.2); g.quadraticCurveTo(E.W * 0.32, E.H * 0.55, E.W * 0.14, E.H * 0.95); g.stroke(); rr(g, E.W * 0.2, E.H * 0.5, 40, 120, 8); g.fillStyle = '#3a6ea5'; g.fill();
  for (let i = 0; i < 11; i++) { const x = E.W * 0.42 + i * 70, lit = prog(t, wt('contou', info, 1.5) + i * 0.1, wt('contou', info, 1.5) + i * 0.1 + 0.15); g.save(); g.translate(x, E.H * 0.55); g.rotate(-0.25); seg(g, [[0, -260], [0, 200]], 8, mix(ink, '#ffd27a', lit * 0.6)); poly(g, [[0, -290], [-12, -255], [12, -255]], ink); poly(g, [[0, 200], [-16, 240], [0, 220], [16, 240]], mix('#e8e2d6', '#ffd27a', lit)); g.restore(); }
  seg(g, [[E.W * 0.95, E.H * 1.1], [E.W * 0.7, E.H * 0.75]], 70, '#262c44'); circle(g, E.W * 0.69, E.H * 0.73, 40, ink);
  g.restore();
} });
// s065 — "Eram onze."
registerShot('s065', { draw(g, t, info) {
  backdrop(g, ['#14101a', '#241a20']); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W / 2, E.H * 0.55, 800, '#ffb070', 0.15); g.restore();
  const ink = S().ink; for (let i = 0; i < 11; i++) { const x = E.W * 0.17 + i * 120, a = ease.out(prog(t, i * 0.04, i * 0.04 + 0.2)); g.save(); g.globalAlpha = a; seg(g, [[x, E.H * 0.25], [x, E.H * 0.78]], 9, '#c9b48a'); poly(g, [[x, E.H * 0.22], [x - 14, E.H * 0.27], [x + 14, E.H * 0.27]], '#dfe6f0'); poly(g, [[x, E.H * 0.78], [x - 18, E.H * 0.84], [x, E.H * 0.8], [x + 18, E.H * 0.84]], '#e8e2d6'); g.restore(); }
  UI.readout(g, { value: String(Math.round(11 * ease.out(prog(t, 0, 0.5)))), x: E.W / 2, y: E.H * 0.13, align: 'center', size: V(84, 90) });
} });
// s066 — "Durante nove noites, ele observou o acampamento inimigo."
registerShot('s066', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.05, dz: 0.05, x0: 100, y0: -20 }), geo = enemyCamp(g, t, cam);
  blurLayer(g, 3, (g) => { g.fillStyle = '#05040a'; g.beginPath(); g.moveTo(-100, E.H + 50); g.quadraticCurveTo(E.W * 0.2, E.H * 0.72, E.W * 0.45, E.H + 50); g.fill(); drawChar(g, { x: E.W * 0.2, y: E.H * 0.86, s: 2.2, facing: 1, outfit: HAYATO, pose: breathe(POSES.crouch, t), expr: 'determined', rim: rimOf(geo.M, [0.5, -1], 6), weapon: 'bowBack' }); }, null);
  UI.badge(g, { str: `NOITE ${1 + Math.min(8, Math.floor(prog(t, 0.2, info.dur - 0.3) * 9))}`, size: V(48, 52) });
} });
// s067 — "O general Ordek, o Primeiro a Desembarcar,"
registerShot('s067', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.6, 1.7), dz: 0.06, x0: -260, y0: 150 }), geo = enemyCamp(g, t, cam);
  layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 260, y: geo.GY, s: 1.6, facing: 1, outfit: ORDEK, pose: breathe(POSES.crossArms, t), expr: 'angry', rim: { color: '#ff9a5a', dir: [1, -0.3], w: 5 }, weapon: 'sheath' }); flame(g, geo.CX + 20, geo.GY - 20, 50, t); FX.pool(g, geo.CX + 20, geo.GY, 400, 60, '#ff9a4a', 0.35); });
  nameCard(g, t, info.dur, 'ORDEK', 'O PRIMEIRO A DESEMBARCAR');
} });
// s068 — "saía sozinho todas as noites até a paliçada para olhar o mar."
registerShot('s068', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.2, dz: 0.05, x0: 120, y0: 40 }), geo = enemyCamp(g, t, cam, { palisadeX: 0 }); const stop = info.dur * 0.6, x = geo.CX - 600 + Math.min(t, stop) * 200;
  layer(g, cam, 1, (g) => { const o = { x, y: geo.GY - 260, s: 0.9, facing: 1, outfit: ORDEK, pose: t < stop ? walkPose(t * 5.6) : breathe(POSES.stand, t), expr: 'neutral', rim: rimOf(geo.M, [0.6, -1], 4), weapon: 'torch', t }; g.fillStyle = '#0c0a10'; g.fillRect(geo.CX - 1400, geo.GY - 262, 2800, 16); drawChar(g, o); });
} });
// s069 — "Na décima noite, sem lua,"
registerShot('s069', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.05, y0: -40 }); enemyCamp(g, t, cam, { moonless: true, fires: 3 }); veil(g, '#02020a', 0.25); UI.badge(g, { str: 'NOITE 10', size: V(52, 56), a: prog(t, 0.2, 0.5) }); } });
// s070 — "Hayato subiu numa árvore."
registerShot('s070', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.25, dz: 0.05, x0: -380, y0: -60 }), geo = enemyCamp(g, t, cam, { moonless: true, fires: 3 });
  layer(g, cam, 1.05, (g) => { const tx = geo.CX - 760; bigTree(g, tx, geo.GY + 80, 1.3, '#07060c', t); const up = ease.inOut(prog(t, 0, info.dur)); drawChar(g, { x: tx + 26, y: geo.GY + 40 - up * 420, s: 1.0, facing: 1, outfit: HAYATO, pose: (t * 2) % 1 < 0.5 ? PZ.climb : { ...PZ.climb, hF: [26, -230], eB: [18, -210], hB: [24, -250] }, expr: 'determined', rim: { color: '#7a8ad8', dir: [1, -0.4], w: 4 }, weapon: 'bowBack', shadow: false }); });
  veil(g, '#02020a', 0.2);
} });
// s071 — "Tinha onze flechas."
registerShot('s071', { draw(g, t, info) {
  blurLayer(g, 12, (g) => enemyCamp(g, t, { z: 1.5, y: -60 }, { moonless: true })); veil(g, '#02020a', 0.45);
  const z = 1 + 0.06 * t / info.dur; g.save(); g.translate(E.W / 2, E.H * 0.6); g.scale(z, z); g.rotate(0.2);
  rr(g, -110, -40, 220, 560, 30); g.fillStyle = '#2a1a14'; g.fill(); g.strokeStyle = alpha('#c9a24a', 0.5); g.lineWidth = 6; g.stroke();
  for (let i = 0; i < 11; i++) { const x = -80 + (i % 6) * 32 + (i >= 6 ? 16 : 0), y = -60 - (i >= 6 ? 20 : 0); seg(g, [[x, y], [x + (i - 5) * 4, y - 260]], 7, '#c9b48a'); poly(g, [[x + (i - 5) * 4, y - 300], [x + (i - 5) * 4 - 14, y - 250], [x + (i - 5) * 4, y - 262], [x + (i - 5) * 4 + 14, y - 250]], '#e8e2d6'); }
  g.restore(); UI.readout(g, { value: '11', label: 'FLECHAS', x: V(180, 100), y: E.H * 0.3, size: V(96, 100) });
} });
// s072 — "Usou uma." — freeze frame
registerShot('s072', { draw(g, t, info) {
  const cam = { z: 1.35 + 0.04 * t, x: 120, y: -40, r: 0.02 * Math.sin(t * 0.5) }, geo = enemyCamp(g, 0.2, cam, { moonless: true, fires: 3 });
  layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX + 380, y: geo.GY - 270, s: 0.75, facing: 1, outfit: ORDEK, pose: POSES.stand, expr: 'neutral', rim: rimOf(geo.M, [0.6, -1], 3), weapon: 'torch', t: 0.2 }); g.fillStyle = '#0c0a10'; g.fillRect(geo.CX - 1400, geo.GY - 272, 2800, 16); });
  veil(g, '#1a2a60', 0.25, 'source-over');
  const ax = lerp(E.W * 0.12, E.W * 0.58, 0.45 + 0.06 * ease.inOut(t / info.dur)); arrow(g, ax, E.H * 0.42, 0.12, 2.2, { trail: 520 });
  FX.drops(g, t, { count: 60, rMin: 2, rMax: 8, color: '#cfe0ff' }); FX.rings(g, ax + 80, E.H * 0.43, t * 0.4, { color: '#cfe0ff', r0: 30, r1: 200, a: 0.35 });
  UI.badge(g, { str: '1 / 11', size: V(52, 56) });
} });
// s073 — "Mas a crônica registra o que veio depois."
registerShot('s073', { draw(g, t, info) {
  const cam = push(t, info, { z0: 2.0, dz: 0.08, x0: -120, y0: 280 }), geo = scriptorium(g, t, cam);
  layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX - 180, y: geo.GY, s: 1.2, facing: 1, outfit: SCRIBE, pose: breathe({ ...POSES.sit, eF: [24, -120], hF: [56 + Math.sin(t * 10) * 6, -124] }, t, 0.6), expr: 'thinking', rim: { color: '#ffc070', dir: [1, -0.4], w: 4 } }));
} });
// s074 — "Os oficiais de Kezhar mataram dez moradores na praia como castigo."
registerShot('s074', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.3, dz: 0.06, y0: 60 }), geo = beachNight(g, t, cam, { covered: 0, smoke: false }); const dark = ease.inOut(prog(t, 2.2, 3.4));
  layer(g, cam, 1, (g) => { for (let i = 0; i < 10; i++) drawFigure(g, { x: geo.CX - 540 + i * 120, y: geo.GY + 20, s: 0.95, facing: 1, outfit: PEASANT.x ? { top: 'tshirt', color: '#4a4440', head: 'bun' } : PEASANT, pose: breathe({ ...POSES.kneel, head: [14, -160] }, t, 0.4, i), expr: 'scared', rim: { color: '#ff9a5a', dir: [0, -1], w: 3 } });
    for (let i = 0; i < 4; i++) drawChar(g, { x: geo.CX - 480 + i * 330, y: geo.GY - 60, s: 1.0, facing: -1, outfit: SOLDIER, pose: POSES.stand, expr: 'angry', rim: { color: '#ff9a5a', dir: [1, -0.3], w: 4 }, weapon: i % 2 ? 'torch' : 'spear', spearAng: -1.5, t }); });
  UI.readout(g, { value: '10', label: 'MORADORES', x: V(160, 100), y: E.H * 0.26, size: V(96, 100), color: S().ui.accent, a: prog(t, wt('dez', info, 1.2) - 0.1, wt('dez', info, 1.2) + 0.2) });
  veil(g, '#200406', 0.85 * dark);
} });
// s075 — "Hayato assistiu do alto da árvore."
registerShot('s075', { draw(g, t, info) {
  faceShot(g, t, info, { bg: (g, t) => enemyCamp(g, t, { z: 1.5, y: 40 }, { moonless: true }), who: HAYATO, expr: 'shocked', mood: 'night', rimColor: '#ff8a5a', rimSide: 1, look: [0.2, 0.6], tilt: 0.06 });
  blurLayer(g, 8, (g) => { const ink = '#04030a'; for (const [x, y, r] of [[120, 120, 260], [E.W - 80, 160, 300], [200, E.H - 40, 240], [E.W - 200, E.H, 260]]) { g.fillStyle = ink; g.beginPath(); g.ellipse(x, y, r, r * 0.6, 0.4, 0, Math.PI * 2); g.fill(); } });
} });
// s076/s077 — the price: a balance scale
function scale(g, t, tilt, hiR) {
  UI.blueprint(g); const ui = S().ui, bp = ui.blueprint, cx = E.W / 2, cy = E.H * 0.34, L = 520;
  seg(g, [[cx, cy], [cx, E.H * 0.86]], 6, bp); seg(g, [[cx - 140, E.H * 0.86], [cx + 140, E.H * 0.86]], 6, bp); poly(g, [[cx, cy - 30], [cx - 24, cy + 10], [cx + 24, cy + 10]], bp);
  const a = tilt, lx = cx - Math.cos(a) * L, ly = cy - Math.sin(a) * L, rx = cx + Math.cos(a) * L, ry = cy + Math.sin(a) * L; seg(g, [[lx, ly], [rx, ry]], 6, bp);
  for (const [px, py, side] of [[lx, ly, 0], [rx, ry, 1]]) { seg(g, [[px, py], [px - 110, py + 200]], 2, bp); seg(g, [[px, py], [px + 110, py + 200]], 2, bp); seg(g, [[px - 140, py + 200], [px + 140, py + 200]], 6, side && hiR ? ui.accent : bp);
    if (!side) { g.save(); g.translate(px, py + 150); g.rotate(-0.1); seg(g, [[-70, 0], [60, 0]], 6, ui.gold); poly(g, [[78, 0], [56, -12], [56, 12]], ui.gold); g.restore(); text(g, '1 FLECHA', px, py + 260, { size: 34, font: FONTS.ui, weight: 900, color: ui.gold, spacing: 3 }); }
    else { for (let i = 0; i < 10; i++) UI.lineFigure(g, { x: px - 112 + (i % 5) * 56, y: py + 196 - Math.floor(i / 5) * 70, s: 0.3, color: side && hiR ? ui.accent : '#e8f0ff' }); text(g, '10 VIDAS', px, py + 260, { size: 34, font: FONTS.ui, weight: 900, color: hiR ? ui.accent : ui.cream, spacing: 3 }); } }
}
registerShot('s076', { draw(g, t, info) { scale(g, t, -0.06 + 0.06 * Math.sin(t * 2) * (1 - prog(t, 0, 2)), false); } });
registerShot('s077', { draw(g, t, info) { scale(g, t, 0.22 * ease.out(prog(t, 0.1, 1.0)), true); } });
// s078 — "Então decidiu que o preço para o império teria que ser maior."
registerShot('s078', { draw(g, t, info) {
  faceShot(g, t, info, { bg: (g, t) => { enemyCamp(g, t, { z: 1.4, y: 40 }); banner(g, E.W * 0.7, E.H * 0.1, 500, 340, t, { wind: 0.5 }); }, who: HAYATO, expr: 'determined', mood: 'night', rimColor: '#ff7a3a', rimSide: -1, look: [0.2, 0], x: -260, push: 0.1 });
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.2, E.H, 700, '#ff5a1a', 0.2); g.restore();
} });
// s079–s081 — dawn: the first notch
const dawnBg = (g, t) => ravine(g, t, { z: 1.5, y: -120 }, { cairns: 30, dawn: 0.85, moon: false });
registerShot('s079', { draw(g, t, info) {
  blurLayer(g, 14, dawnBg); veil(g, '#0a0608', 0.35); const cut = wt('corte', info, 2.2) - 0.2;
  const k = ease.inOut(t / info.dur), sh = sheath(g, E.W * 0.46, E.H * 0.5, V(1600, 1050) * (1 + 0.06 * k), t, { marks: 1, newMark: 1, cutAt: cut + 0.2, rot: -0.07 });
  const [mx, my] = sh.markX(1), kp = ease.inOut(prog(t, cut - 0.6, cut + 0.5)); knife(g, mx + 140 - kp * 140, my - 200 + kp * 170, -0.9, 1.6, S().ink); seg(g, [[mx + 220 - kp * 140, my - 330 + kp * 170], [E.W + 200, -200]], 80, '#262c44');
} });
registerShot('s080', { draw(g, t, info) { faceShot(g, t, info, { bg: dawnBg, who: HAYATO, expr: 'neutral', face: { mouth: 'smallFlat' }, mood: 'dusk', rimSide: 1, look: [0, 0.3], push: 0.04 }); } });
registerShot('s081', { draw(g, t, info) {
  blurLayer(g, 14, dawnBg); veil(g, '#0a0608', 0.35); const k = ease.inOut(t / info.dur);
  sheath(g, E.W * 0.5, E.H * 0.5, V(2400, 1500) * (1 + 0.05 * k), t, { marks: 1, rot: -0.07, highlight: 0.5 + 0.5 * Math.sin(t * 3), hiFrom: 1, hiTo: 1 });
} });
