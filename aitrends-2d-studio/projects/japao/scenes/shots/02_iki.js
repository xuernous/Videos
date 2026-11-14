// shots/02_iki.js — Iki and its thirty, the Empire of Kezhar, the sails on the horizon.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, shake, rng, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { coast, seaView, hillTop, pineJ, JADE } from '../sets/coast.js';
import { fireCamp, fireOn } from '../sets/camp.js';
import { throne } from '../sets/throne.js';
import { mapBase, PLACES, LAND } from '../sets/map.js';
import { plain, scriptorium } from '../sets/misc.js';
import { drawChar, rider, drawHorse, faceShot, nameCard, sheath, banner, ship, push, rimOf, blinkAt, PZ, arrow, talkRings, KZ_RED, GOLD } from '../sets/lib.js';
import { HAYATO, JIRO, SADAYUKI, IKI, TARVOS, SOLDIER, SCRIBE } from '../cast.js';
import { wt } from './01_open.js';

const coastBg = (o = {}) => (g, t) => coast(g, t, { z: o.z ?? 1.5, x: o.x ?? 0, y: o.y ?? -80 }, { mood: o.mood || 'golden', ...o });

// s023 — "Iki era uma ilha pequena, de baías cor de jade," — 3D orbit of the island
registerShot('s023', { kind: '3d',
  init(T) {
    const M = mood('golden'), { THREE } = T;
    const st = T.stage({ mood: 'golden', fov: V(34, 50), fog: [30, 120], keyPos: [-20, 18, 10], keyIntensity: 2.4, ambient: 1.1 });
    const water = T.plane(400, 400, new THREE.MeshStandardMaterial({ color: new THREE.Color(mix(JADE, '#1d3a50', 0.45)), roughness: 0.35, metalness: 0.1 })); water.rotation.x = -Math.PI / 2; st.add(water);
    const shallow = T.cyl(9.5, 10.5, 0.1, new THREE.MeshStandardMaterial({ color: new THREE.Color(JADE), roughness: 0.4, transparent: true, opacity: 0.75 }), 0, 0.02, 0, 40); st.add(shallow);
    st.add(T.cyl(7.6, 8.4, 0.5, '#c9b38a', 0, 0.15, 0, 36));
    const hill = T.sphere(6.2, T.mat(shade(M.grass, -0.15), { flat: true })); hill.scale.set(1, 0.42, 0.9); hill.position.set(0, 0.2, 0); st.add(hill);
    const h2 = T.sphere(3, T.mat(shade(M.grass, -0.25), { flat: true })); h2.scale.set(1, 0.7, 1); h2.position.set(-2.4, 1.5, -1); st.add(h2);
    for (let i = 0; i < 26; i++) { const a = i * 2.39, r = 2.5 + (i % 5) * 0.9; st.add(T.cone(0.45, 1.6, shade(M.dark, -0.1), Math.cos(a) * r, 2.1 - r * 0.22, Math.sin(a) * r * 0.85, 6)); }
    for (let i = 0; i < 7; i++) { const a = 0.4 + i * 0.25, x = Math.cos(a) * 6.4, z = Math.sin(a) * 6.0; st.add(T.box(0.7, 0.45, 0.6, shade(M.wall, -0.2), x, 0.6, z)); const roof = T.cone(0.62, 0.5, shade(M.dark, 0.05), x, 1.05, z, 4); roof.rotation.y = Math.PI / 4; st.add(roof); }
    for (let i = 0; i < 4; i++) { const b = T.box(0.6, 0.12, 0.2, '#2a1a12', 8.8 + i * 0.5, 0.1, 2 + i * 0.6); st.add(b); }
    return { stage: st };
  },
  draw(s, t, info, T) { T.orbit(s.stage.camera, t, { target: [0, 1, 0], radius: [22, 18], height: [9, 7], from: -0.6, to: 0.35, dur: info.dur }); },
  overlay(g, t, info) { FX.lensStreak(g, E.W * 0.2, E.H * 0.25, E.W * 1.2, '#ffe0b0', 0.12); },
});
// s024 — "guardada por apenas trinta guerreiros."
registerShot('s024', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.02 + 0.05 * k, x: -30 * k, y: 30 };
  const geo = coast(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 30; i++) { const x = geo.CX - 760 + i * 52 + (i % 2) * 8, y = geo.GY - 20 + (i % 3) * 14, o = { x, y, s: 0.52, facing: 1, outfit: i === 13 ? HAYATO : i === 14 ? JIRO : i === 15 ? SADAYUKI : IKI, pose: breathe(POSES.stand, t, 0.6, i), expr: 'neutral', rim: rimOf(geo.M, [1, -0.6], 3), weapon: i % 3 === 0 ? 'spear' : 'bowBack', spearAng: -1.45 }; drawChar(g, o); } });
  const n = Math.round(30 * ease.out(prog(t, 0.6, 2.2))); UI.readout(g, { value: String(n), label: 'GUERREIROS', x: E.W - V(380, 300), y: V(160, 220), size: V(84, 90), a: prog(t, 0.5, 0.8) });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });
// s025 — "Naquela época, samurai ainda não era um título."
registerShot('s025', { draw(g, t, info) {
  UI.blueprint(g); const ui = S().ui, bp = ui.blueprint, k = ease.out(prog(t, 0.1, 0.6));
  text(g, 'SAMURAI', E.W / 2, E.H * 0.36, { size: 120, color: ui.gold, glow: 30, glowColor: alpha(ui.gold, 0.6), spacing: 14, alpha: k });
  const t2 = wt('título', info, 1.6), k2 = prog(t, t2 - 0.4, t2);
  text(g, 'TÍTULO', E.W / 2, E.H * 0.6, { size: 70, font: FONTS.ui, weight: 900, color: ui.cream, spacing: 8, alpha: k2 * 0.8 });
  if (k2 > 0) { const p = ease.out(prog(t, t2, t2 + 0.3)); seg(g, [[E.W / 2 - 200, E.H * 0.6], [E.W / 2 - 200 + 400 * p, E.H * 0.6]], 8, ui.accent); }
  UI.lineFigure(g, { x: E.W * 0.2, y: E.H * 0.78, s: 1.2, pose: PZ.bow, color: alpha(bp, 0.9 * k) });
  UI.lineFigure(g, { x: E.W * 0.8, y: E.H * 0.78, s: 1.2, pose: POSES.stand, color: alpha(bp, 0.9 * k), facing: -1 });
} });
// s026 — "Era quem servia."
registerShot('s026', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.15, 1.2), dz: 0.05, x0: -60, y0: 40 }); const geo = coast(g, t, cam, { mood: 'dusk', sunX: -300, sunY: 30 });
  layer(g, cam, 1, (g) => {
    drawChar(g, { x: geo.CX - 260, y: geo.GY, s: 1.45, facing: 1, outfit: SADAYUKI, pose: breathe(POSES.relaxed, t), expr: 'smile', rim: rimOf(geo.M, [-1, -0.4]), weapon: 'sheath', blink: blinkAt(t, 3.4) });
    drawChar(g, { x: geo.CX + 180, y: geo.GY, s: 1.45, facing: -1, outfit: HAYATO, pose: posesAt(t, [[0, 'kneel'], [0.3, PZ.bow]], 0.5), expr: 'neutral', rim: rimOf(geo.M, [-1, -0.4]), weapon: 'sheath' });
  });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });
// s027 — "Hayato tinha vinte e quatro anos,"
registerShot('s027', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.5, 1.6), dz: 0.06, x0: 160, y0: -80 }); const geo = coast(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX + 120, y: geo.GY + 10, s: 1.9, facing: -1, outfit: HAYATO, pose: breathe(POSES.relaxed, t), expr: 'determined', rim: rimOf(geo.M, [1, -0.5], 6), weapon: ['sheath', 'bowBack', 'quiver'], blink: blinkAt(t, 3.0) }));
  UI.readout(g, { value: '24', label: 'ANOS', x: V(220, 120), y: E.H * 0.3, size: V(110, 120), a: prog(t, wt('vinte', info, 0.8) - 0.1, wt('vinte', info, 0.8) + 0.3) });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });
// s028 — "um arco certeiro"
registerShot('s028', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.3, 1.4), dz: 0.04, x0: -200, y0: -40 }); const geo = coast(g, t, cam, { mood: 'golden' });
  const rel = 0.45;
  layer(g, cam, 1, (g) => {
    const tx = geo.CX + 640, ty = geo.GY - 180; seg(g, [[tx, geo.GY], [tx, ty]], 8, S().ink); circle(g, tx, ty, 70, '#c9b07a'); ring(g, tx, ty, 50, 10, KZ_RED); circle(g, tx, ty, 16, KZ_RED);
    drawChar(g, { x: geo.CX - 520, y: geo.GY, s: 1.6, facing: 1, outfit: HAYATO, pose: t < rel ? PZ.aim : PZ.release, drawK: t < rel ? ease.out(prog(t, 0, rel)) : 0, expr: 'determined', rim: rimOf(geo.M, [1, -0.5]), weapon: ['bow', 'sheath', 'quiver'] });
    const p = prog(t, rel, rel + 0.25); if (p > 0 && p < 1) arrow(g, lerp(geo.CX - 400, tx - 40, p), lerp(geo.GY - 282, ty, p), 0.02, 1.3, { trail: 200 }); if (p >= 1) { arrow(g, tx - 30, ty, 0.02, 1.3); FX.rings(g, tx, ty, t - rel, { color: '#fff2c8', r0: 20, r1: 120, a: 0.6 * (1 - prog(t, rel + 0.25, rel + 0.8)) }); }
  });
} });
// s029 — "e a tachi que herdou do pai."
registerShot('s029', { draw(g, t, info) {
  blurLayer(g, 14, coastBg({ z: 1.8, x: 300, mood: 'dusk', sunX: -300, sunY: 30 })); veil(g, '#0a0608', 0.4);
  const k = ease.inOut(t / info.dur); sheath(g, E.W / 2 + 40 - 60 * k, E.H * 0.52, V(1500, 1000) * (1 + 0.05 * k), t, { marks: 0, rot: -0.1 + 0.02 * k });
  g.save(); g.globalCompositeOperation = 'lighter'; const gx = lerp(E.W * 0.2, E.W * 0.75, ease.inOut(prog(t, 0.3, 1.8))); glow(g, gx, E.H * 0.5 - (gx - E.W / 2) * 0.1, 120, '#fff2d8', 0.5 * Math.sin(Math.PI * prog(t, 0.3, 1.8))); g.restore();
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });
// campfire group (s030–s033)
const SEATS = [[-620, IKI, 1], [-420, IKI, 1], [-200, JIRO, 1], [-20, HAYATO, 1], [260, SADAYUKI, -1], [460, IKI, -1], [660, IKI, -1]];
function fireGroup(g, t, info, cam, o = {}) {
  const geo = fireCamp(g, t, cam, { fireX: 120 }); const M = geo.M, fire = { color: '#ffb070', dir: [1, -0.2], w: 5 };
  layer(g, cam, 1, (g) => { SEATS.forEach(([dx, of, f], i) => { const x = geo.CX + dx, rim = { color: '#ffb070', dir: [Math.sign(geo.fireX - x) || 1, -0.3], w: 5 }; const ov = o.pose?.(i, t); drawChar(g, { x, y: geo.GY, s: o.s ?? 1.25, facing: f, outfit: of, pose: breathe(ov || PZ.sitFire, t, 1, i), expr: o.expr?.(i, t) || (i % 2 ? 'smile' : 'happy'), rim, talk: o.talk?.(i, t) || 0, blink: blinkAt(t + i, 3 + i * 0.2) }); }); fireOn(g, geo.fireX, geo.GY, t, 1.2); });
  return geo;
}
// s030 — "Conhecia cada um dos trinta."
registerShot('s030', { draw(g, t, info) { fireGroup(g, t, info, push(t, info, { z0: V(1.05, 1.2), dz: 0.05, x0: -180, dx: 300, y0: -20 })); FX.dust(g, t, { count: 20, color: '#ffc090', a: 0.3 }); } });
// s031 — "O velho comandante Sadayuki, de voz baixa."
registerShot('s031', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.9, 2.0), dz: 0.06, x0: 260, y0: 230 }); fireGroup(g, t, info, cam, { s: 1.25, pose: (i, t) => (i === 4 ? posesAt(t, [[0, PZ.sitFire], [0.5, { ...PZ.sitFire, eF: [30, -110], hF: [52, -126] }]]) : null), expr: (i) => (i === 4 ? 'smile' : 'neutral') });
  nameCard(g, t, info.dur, 'SADAYUKI', 'O VELHO COMANDANTE');
} });
// s032 — "E Jirō, seu melhor amigo,"
registerShot('s032', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.9, 2.0), dz: 0.05, x0: -160, y0: 230 }); fireGroup(g, t, info, cam, { pose: (i, t) => (i === 2 ? posesAt(t, [[0, PZ.sitFire], [0.4, { ...PZ.sitFire, eF: [40, -120], hF: [74, -126] }]]) : null), expr: (i) => (i === 2 ? 'joy' : i === 3 ? 'smile' : 'neutral') });
  nameCard(g, t, info.dur, 'JIRO', 'O MELHOR AMIGO');
} });
// s033 — "que perdia todas as apostas e pagava com saquê."
registerShot('s033', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(2.2, 2.3), dz: 0.05, x0: -120, y0: 250 }); const lose = wt('apostas', info, 1.0);
  fireGroup(g, t, info, cam, { s: 1.25, expr: (i, t) => (i === 2 ? (t < lose ? 'happy' : t < lose + 1 ? 'shocked' : 'smirk') : i === 3 ? (t > lose ? 'joy' : 'smile') : 'neutral'), pose: (i, t) => (i === 2 && t > lose + 1 ? { ...PZ.sitFire, eF: [34, -126], hF: [66, -138] } : null) });
  layer(g, cam, 1, (g) => { const cx = E.W / 2 - 230, cy = E.H * V(0.8, 0.68) - 6; rr(g, cx - 40, cy - 8, 80, 10, 3); g.fillStyle = '#2a1a12'; g.fill(); for (const [dx, n] of [[-16, 1], [14, 2]]) { rr(g, cx + dx - 9, cy - 26, 18, 18, 3); g.fillStyle = '#efe4d0'; g.fill(); circle(g, cx + dx, cy - 17, 2.5, KZ_RED); } });
} });
// s034 — "Do outro lado do mar,"
registerShot('s034', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); mapBase(g, t, { z: 1.6 - 0.3 * k, x: lerp(220, -120, k), y: lerp(100, -100, k) }, { labels: [{ at: 'iki', str: 'IKI' }, { at: 'kezhar', str: '???', a: prog(t, 0.6, 1.2), color: '#ff8a7a' }] });
} });
// s035 — "o Império de Kezhar tinha engolido reinos inteiros em três gerações."
registerShot('s035', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), g3 = wt('três', info, 3.5);
  mapBase(g, t, { z: 1.25, x: -240, y: -160 }, { red: ease.inOut(prog(t, 0.4, g3 + 0.8)) * 1.0, borders: true, labels: [{ at: 'kezhar', str: 'KEZHAR', color: '#ff8a7a', size: 40, a: prog(t, 0.2, 0.6) }] });
  const n = 1 + Math.min(2, Math.floor(prog(t, 0.6, g3 + 0.2) * 3)); UI.badge(g, { str: `${n}ª GERAÇÃO`, size: V(46, 50), a: prog(t, 0.6, 0.9) });
} });
// s036 — "Tinha cavalaria pesada,"
registerShot('s036', { draw(g, t, info) {
  const cam = { z: 1.1, x: 140 * t, y: 0 }, geo = plain(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 6; i++) { const x = geo.CX - 900 + i * 210 + t * 520 - (i % 2) * 60, y = geo.GY + (i % 3) * 22; const o = rider(g, x, y, 1.0, 1, t + i * 0.13, { outfit: SOLDIER, pose: PZ.ride, expr: 'angry', rim: rimOf(geo.M, [-1, -0.4], 4), weapon: 'spear', spearAng: -0.4, spearLen: 360 }, { rim: rimOf(geo.M, [-1, -0.4], 4), speed: 2 }); if (i % 2 === 0) banner(g, x - 30, y - 420, 70, 46, t + i, { wind: 2 }); } });
  FX.dust(g, t, { count: 80, color: '#e0b090', a: 0.35, speed: 40 });
  blurLayer(g, 10, (g) => FX.fog(g, E.H * 0.7, 300, '#c08a7a', 0.25), cam, 1.4);
} });
// s037 — "engenheiros,"
function trebuchet(g, x, y, s, t, col) { seg(g, [[x - 80 * s, y], [x, y - 200 * s], [x + 80 * s, y]], 12 * s, col); seg(g, [[x - 110 * s, y], [x + 110 * s, y]], 12 * s, col); const a = -0.9 + Math.sin(t * 1.2) * 0.5; seg(g, [[x - Math.cos(a) * 220 * s, y - 200 * s - Math.sin(a) * 220 * s], [x + Math.cos(a) * 90 * s, y - 200 * s + Math.sin(a) * 90 * s]], 10 * s, col); rr(g, x + Math.cos(a) * 90 * s - 26 * s, y - 200 * s + Math.sin(a) * 90 * s, 52 * s, 46 * s, 6); g.fillStyle = col; g.fill(); }
registerShot('s037', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.15, dz: 0.05, x0: -60, dx: 60 }), geo = plain(g, t, cam, { mood: 'dusk', sunX: 300 });
  layer(g, cam, 0.7, (g) => { for (let i = 0; i < 3; i++) trebuchet(g, geo.CX - 500 + i * 500, geo.GY - 40, 1.1 - i * 0.15, t + i, shade(geo.M.dark, -0.4)); });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 4; i++) drawChar(g, { x: geo.CX - 600 + i * 380, y: geo.GY + 10, s: 1.0, facing: 1, outfit: SOLDIER, pose: breathe(i % 2 ? POSES.reach : POSES.holdFront, t, 1, i), expr: 'determined', rim: rimOf(geo.M, [-1, -0.4], 4) }); });
} });
// s038 — "uma frota tomada de povos que já não existiam"
registerShot('s038', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05 + 0.04 * k, x: -60 * k }, sv = seaView(g, t, cam, { mood: 'dusk' });
  layer(g, cam, 0.6, (g) => { const cols = ['#5a6a8a', '#6a8a6a', '#8a7a5a', '#7a5a7a', '#5a7a8a']; for (let i = 0; i < 5; i++) { g.save(); g.globalAlpha = 0.55 + 0.1 * Math.sin(t + i); ship(g, sv.CX - 700 + i * 360, sv.HY + 60 + (i % 2) * 40, 0.75 + (i % 2) * 0.2, { t, sail: cols[i], emblem: false, sails: i % 2 ? 2 : 1 }); g.restore(); } });
  layer(g, cam, 0.7, (g) => FX.fog(g, sv.HY - 60, 260, '#c0a0b0', 0.35));
} });
// s039 — "e escribas que registravam tudo, os Escreventes."
registerShot('s039', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.1, dz: 0.08, x0: -40, dx: 80 }), geo = scriptorium(g, t, cam);
  layer(g, cam, 1, (g) => { for (let k = -1; k <= 1; k++) for (const sd of [-1, 1]) { const x = geo.CX + k * 620 + sd * 120; drawChar(g, { x, y: geo.GY, s: 1.15, facing: -sd, outfit: SCRIBE, pose: breathe({ ...POSES.sit, eF: [24, -120], hF: [44 + Math.sin(t * 9 + x) * 4, -122] }, t, 0.6, x), expr: 'thinking', rim: { color: '#ffc070', dir: [sd * -1, -0.4], w: 4 } }); } });
  nameCard(g, t, info.dur, 'OS ESCREVENTES', 'REGISTRAVAM TUDO', { a: prog(t, wt('escreventes', info, 4) - 0.6, wt('escreventes', info, 4)) });
} });
// s040 — "No topo, o Imperador Tarvos,"
registerShot('s040', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.0, dz: 0.14, y0: 0, dy: -60 }), geo = throne(g, t, cam);
  layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 30, y: geo.seatY + 4, s: 1.1, facing: 1, outfit: TARVOS, pose: breathe(POSES.sitBack, t, 0.5), expr: 'smirk', rim: { color: '#ffb070', dir: [0, -1], w: 4 } });
    for (const sx of [-1, 1]) for (let i = 0; i < 2; i++) drawChar(g, { x: geo.CX + sx * (260 + i * 120), y: geo.GY + 30 + i * 30, s: 1.05, facing: -sx, outfit: SOLDIER, pose: POSES.stand, expr: 'determined', rim: { color: '#ff9a5a', dir: [sx, -0.3], w: 4 }, weapon: 'spear', spearAng: -1.5 }); });
  nameCard(g, t, info.dur, 'TARVOS', 'IMPERADOR DE KEZHAR', { a: prog(t, wt('tarvos', info, 1) - 0.2, wt('tarvos', info, 1) + 0.2) });
} });
// s041 — "que nunca tinha perdido uma guerra."
registerShot('s041', { draw(g, t, info) {
  faceShot(g, t, info, { bg: (g, t) => throne(g, t, { z: 1.6, y: -260 }), who: TARVOS, expr: 'smirk', mood: 'interiorWarm', rimColor: '#ffb070', rimSide: 1, look: [-0.3, 0] });
  UI.readout(g, { value: '0', label: 'DERROTAS', x: V(150, 90), y: E.H * 0.3, size: V(110, 120), color: S().ui.accent, a: prog(t, wt('perdido', info, 1) - 0.2, wt('perdido', info, 1) + 0.2) });
} });
// s042 — "E que agora queria o mar."
registerShot('s042', { draw(g, t, info) {
  blurLayer(g, 12, (g) => throne(g, t, { z: 1.4, y: -200 })); veil(g, '#08040a', 0.4);
  const k = ease.inOut(t / info.dur), z = 1 + 0.06 * k; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  g.save(); g.translate(E.W / 2, E.H * 0.55); g.rotate(-0.04); rr(g, -720, -330, 1440, 660, 10); g.fillStyle = linGrad(g, 0, -330, 0, 330, ['#d8c39a', '#b89a6a']); g.fill(); g.restore();
  g.save(); g.translate(E.W / 2 - 960 * 0.6, E.H * 0.55 - 540 * 0.6 + 40); g.scale(0.6, 0.6); for (const pts of Object.values(LAND)) { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(...p) : g.moveTo(...p))); g.closePath(); g.fillStyle = alpha('#8a6a40', 0.5); g.fill(); g.strokeStyle = '#5a3a20'; g.lineWidth = 4; g.stroke(); } g.restore();
  const close = ease.inOut(prog(t, 0.6, 1.2)), hx = E.W * 0.55, hy = E.H * 0.6, ink = S().ink;
  seg(g, [[hx + 40, hy + 40], [E.W + 300, E.H + 300]], 120, '#4a0f16'); circle(g, hx, hy, 70, ink);
  for (let i = 0; i < 4; i++) { const a = -2.4 + i * 0.32, L = lerp(120, 40, close); seg(g, [[hx - 20, hy - 20], [hx - 20 + Math.cos(a) * L, hy - 20 + Math.sin(a) * L]], 30, ink); }
  g.restore();
} });
// s043 — "Naquela manhã, o comandante o mandou ao norte da ilha numa tarefa menor."
registerShot('s043', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.15, 1.25), dz: 0.05, x0: -40, y0: 20 }), geo = coast(g, t, cam, { mood: 'golden', sunX: -400, sunY: 80 }); const go = wt('tarefa', info, 2.5);
  layer(g, cam, 1, (g) => {
    drawChar(g, { x: geo.CX - 360, y: geo.GY, s: 1.35, facing: 1, outfit: SADAYUKI, pose: posesAt(t, [[0, POSES.relaxed], [0.4, POSES.point]]), expr: 'neutral', rim: rimOf(geo.M, [-1, -0.4]), weapon: 'sheath' });
    const hx = geo.CX + 120 + ease.in(prog(t, go, info.dur)) * 900; rider(g, hx, geo.GY + 20, 1.05, 1, t, { outfit: HAYATO, pose: PZ.ride, expr: 'determined', rim: rimOf(geo.M, [-1, -0.4]), weapon: ['bowBack'] }, { gallop: t > go, rim: rimOf(geo.M, [-1, -0.4]) });
  });
} });
// s044 — "Na volta, do alto de uma colina,"
registerShot('s044', { draw(g, t, info) {
  const cam = push(t, info, { z0: 1.05, dz: 0.06, x0: -100, dx: 60 }), geo = hillTop(g, t, cam, { mood: 'golden' });
  layer(g, cam, 1, (g) => { const x = geo.CX - 300 + ease.out(prog(t, 0, info.dur * 0.7)) * 300; rider(g, x, geo.GY + 8, 0.85, 1, t, { outfit: HAYATO, pose: PZ.ride, expr: 'neutral', rim: rimOf(geo.M, [1, -0.5]), weapon: ['bowBack'] }, { gallop: t < info.dur * 0.7, speed: 1.2, rim: rimOf(geo.M, [1, -0.5]) }); });
  FX.dust(g, t, { count: 20, color: '#ffe2bd', a: 0.3 });
} });
// s045 — "ele viu as velas."
registerShot('s045', { draw(g, t, info) {
  faceShot(g, t, info, { bg: (g, t) => hillTop(g, t, { z: 1.5, y: -160 }, { mood: 'golden', fleet: 0.6, count: 60 }), who: HAYATO, expr: t < 0.5 ? 'neutral' : 'shocked', mood: 'golden', rimSide: 1, look: [0.6, 0.1], push: 0.1,
    over: (g, cx, cy, r) => { for (let i = 0; i < 2; i++) { const ex = cx + (i ? 0.34 : -0.34) * r, ey = cy - 0.08 * r; for (let k = 0; k < 3; k++) poly(g, [[ex - 8 + k * 9, ey + 4], [ex - 2 + k * 9, ey + 4], [ex - 5 + k * 9, ey - 8]], alpha(KZ_RED, 0.8 * prog(t, 0.5, 1))); } } });
} });
// s046 — "Primeiro dezenas."   s047 — "Depois, centenas."
registerShot('s046', { draw(g, t, info) { const cam = push(t, info, { z0: 1.3, dz: 0.05, x0: 0, y0: 40 }); seaView(g, t, cam, { mood: 'golden', fleet: 0.12 + 0.08 * prog(t, 0, info.dur), count: 220, seed: 32 }); } });
registerShot('s047', { draw(g, t, info) { const k = ease.out(prog(t, 0, info.dur)); seaView(g, t, { z: 1.3 - 0.3 * k, x: 0, y: 40 - 40 * k }, { mood: 'golden', fleet: 0.25 + 0.75 * k, count: 220, seed: 32 }); } });
// s048 — "Nos mastros, um lobo negro sobre fundo vermelho."
registerShot('s048', { draw(g, t, info) {
  const M = mood('golden'); backdrop(g, M.sky); FX.sun(g, E.W * 0.2, E.H * 0.7, 60, '#fff3dc', M.key, 5); FX.clouds(g, { y: 200, h: 300, color: '#ffe0c0', a: 0.15 });
  const k = ease.inOut(t / info.dur), z = 1 + 0.06 * k; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  banner(g, E.W * 0.22, E.H * 0.15, V(1100, 700), V(620, 520), t, { wind: 0.7, pole: '#120a0c' }); g.restore();
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });
