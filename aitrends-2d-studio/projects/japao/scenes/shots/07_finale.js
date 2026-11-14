// shots/07_finale.js — Tarvos crosses the sea, the storm, the duel on the deck, the erasure, the shrine today.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, shake, rng, talkAmount, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { coast, seaView } from '../sets/coast.js';
import { scriptorium } from '../sets/misc.js';
import { throne } from '../sets/throne.js';
import { mapBase, PLACES } from '../sets/map.js';
import { archive, page, UV } from '../sets/archive.js';
import { bay, deck, cliff, harbor, shrine, shrineIn } from '../sets/finale.js';
import { drawChar, faceShot, nameCard, push, rimOf, blinkAt, PZ, arrow, flame, embers, smoke, ship, banner, sheath, knife, lyrics, talkRings, drawSword, KZ_RED, GOLD } from '../sets/lib.js';
import { HAYATO, TARVOS, OLDWOMAN, SCRIBE, RESEARCHER, HISTORIAN, FISHER, MONK, CHILD } from '../cast.js';
import { wt } from './01_open.js';
import { markShot } from './03_attack.js';
import { SONG1, SONG2 } from './04_sayo_harsa.js';

const tk = (info, a, b) => talkAmount(info.globalT, info.shot.start + a, info.shot.start + b);
const deckRim = { color: '#cfd9ff', dir: [0.4, -1], w: 5 };
const OLDFISH = { ...FISHER, head: 'none', x: ['beard'] };

// s210 — "Então o próprio trono atravessou o mar."
registerShot('s210', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05 + 0.05 * k, x: -40 * k }, sv = seaView(g, t, cam, { mood: 'dusk', fleet: 1, count: 120 });
  layer(g, cam, 0.7, (g) => { const x = sv.CX - 80 + t * 30, y = sv.HY + 230; ship(g, x, y, 1.6, { t, sails: 2 }); const dy = y - 40 * 1.6; rr(g, x - 30, dy - 90, 60, 90, 6); g.fillStyle = GOLD; g.fill(); drawChar(g, { x: x + 6, y: dy, s: 0.5, facing: 1, outfit: TARVOS, pose: POSES.sitBack, expr: 'smirk', rim: { color: '#ffc070', dir: [-1, -0.4], w: 3 }, shadow: false }); });
} });
// s211 — "Para atrair o demônio, Tarvos passou a queimar uma aldeia por dia na costa."
registerShot('s211', { draw(g, t, info) { const cam = { z: 1.15, x: -200 + 90 * t, y: -20 }; coast(g, t, cam, { mood: 'dusk', burn: 1, fleet: 1, fleetCount: 80 }); embers(g, t, { count: 50 }); UI.badge(g, { str: `DIA ${1 + Math.min(6, Math.floor(prog(t, 0.3, info.dur - 0.3) * 7))}`, size: V(52, 56) }); } });
// s212 — "Uma velha segurou a mão de Hayato e pediu apenas:"
registerShot('s212', { draw(g, t, info) { const cam = push(t, info, { z0: V(1.8, 1.9), dz: 0.05, x0: 300, y0: 200 }), geo = coast(g, t, cam, { mood: 'dusk', burn: 0.8 }); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX + 160, y: geo.GY, s: 1.4, facing: -1, outfit: HAYATO, pose: breathe({ ...POSES.kneel, eF: [30, -110], hF: [52, -112] }, t), expr: 'sad', rim: { color: '#ff9a5a', dir: [1, -0.4], w: 5 }, weapon: 'sheath' }); drawChar(g, { x: geo.CX - 50, y: geo.GY, s: 1.25, facing: 1, outfit: OLDWOMAN, pose: breathe({ ...POSES.kneel, eF: [30, -110], hF: [58, -120] }, t, 1, 2), expr: 'cry', rim: { color: '#ff9a5a', dir: [1, -0.4], w: 5 } }); }); embers(g, t, { count: 30 }); } });
// s213 — "Faça eles irem embora."
registerShot('s213', { draw(g, t, info) { faceShot(g, t, info, { bg: (g, t) => coast(g, t, { z: 1.6, x: 400, y: -100 }, { mood: 'dusk', burn: 1 }), who: OLDWOMAN, expr: 'cry', talk: tk(info, 0, info.dur - 0.2), mood: 'dusk', rimColor: '#ff9a5a', rimSide: 1, look: [-0.2, -0.3], push: 0.06 }); embers(g, t, { count: 20 }); } });
// s214 — 3D: hundreds of ships lashed together in Hakata bay
registerShot('s214', { kind: '3d',
  init(T) {
    const M = mood('night'), { THREE } = T;
    const st = T.stage({ mood: 'night', fov: V(38, 54), fog: [20, 110], keyPos: [10, 14, -12], keyIntensity: 0.9, ambient: 0.6 });
    const water = T.plane(500, 500, new THREE.MeshStandardMaterial({ color: new THREE.Color('#1a2440'), roughness: 0.3, metalness: 0.2 })); water.rotation.x = -Math.PI / 2; st.add(water);
    const sail = T.mat(shade(KZ_RED, -0.15)), hull = T.mat('#18100e'), lamp = T.basic('#ffc070');
    for (let i = -7; i <= 7; i++) for (let j = 0; j < 9; j++) { const g = new THREE.Group(); g.add(T.box(1.1, 0.5, 3.2, hull, 0, 0.25, 0), T.cyl(0.06, 0.06, 3, '#18100e', 0, 1.8, 0)); const s = T.box(1.6, 1.4, 0.04, sail, 0, 2.1, 0.1); s.rotation.y = Math.PI / 2; g.add(s); const l = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 6), lamp); l.position.set(0.5, 0.7, 1.2); g.add(l); g.position.set(i * 1.6, 0, -j * 3.6); g.rotation.y = (i + j) % 2 ? 0.05 : -0.05; st.add(g); }
    for (let i = -7; i <= 7; i++) st.add(T.box(0.05, 0.05, 32, '#8a7a5a', i * 1.6, 0.45, -14.4));
    return { stage: st };
  },
  draw(s, t, info, T) { T.dolly(s.stage.camera, t, [[0, { pos: [-14, 6, 10], look: [0, 0.5, -10] }], [info.dur, { pos: [-6, 9, 8], look: [2, 0, -14] }]]); },
});
// s215 — "uma cidade flutuante."
registerShot('s215', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.06, y0: -20 }); bay(g, t, cam, { lights: true }); } });
// s216 — "Hayato observou o céu."
registerShot('s216', { draw(g, t, info) { const cam = push(t, info, { z0: 1.3, dz: 0.05, x0: -260, y0: 60 }), geo = cliff(g, t, cam); layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX - 120, y: geo.GY - 10, s: 1.3, facing: 1, outfit: HAYATO, pose: breathe({ ...POSES.stand, head: [8, -212] }, t), look: [0.6, -1], expr: 'thinking', rim: rimOf(geo.M, [1, -0.5]), weapon: ['sheath', 'bowBack'] })); } });
// s217 — "Nuvens como penas."   s218 — birds   s219 — still sea
registerShot('s217', { draw(g, t, info) { cliff(g, t, { z: 1.1, x: 40 * t, y: -260 }, { feathers: true }); } });
registerShot('s218', { draw(g, t, info) { cliff(g, t, push(t, info, { z0: 1.1, dz: 0.03, y0: -140 }), { feathers: true }); const r = rng(5); for (let i = 0; i < 18; i++) { const x = E.W + 100 - ((t * (260 + r() * 120) + r() * 900) % (E.W + 400)), y = 120 + r() * 360, fl = Math.sin(t * 10 + i) * 10, ink = S().ink; g.strokeStyle = ink; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 22, y - fl); g.quadraticCurveTo(x - 8, y - 4, x, y); g.quadraticCurveTo(x + 8, y - 4, x + 22, y - fl); g.stroke(); } text(g, '→ INTERIOR', E.W * 0.14, E.H * 0.2, { size: 0.1, alpha: 0 }); } });
registerShot('s219', { draw(g, t, info) { cliff(g, t * 0.05, push(t, info, { z0: 1.0, dz: 0.05, y0: 40 }), { calm: true }); veil(g, '#1a1020', 0.2); } });
// s220 — "Tarvos vinha das estepes."
registerShot('s220', { draw(g, t, info) { const k = ease.inOut(t / info.dur); mapBase(g, t, { z: 1.0, x: lerp(-500, -900, k), y: -300 }, { red: 1, labels: [{ at: 'steppe', str: 'ESTEPES', color: '#ff8a7a', size: 44 }, { at: 'kezhar', str: 'KEZHAR', size: 34 }] }); } });
// s221 — "Não sabia ler aquilo."
registerShot('s221', { draw(g, t, info) { faceShot(g, t, info, { bg: (g, t) => bay(g, t, { z: 1.4, y: -60 }, { lights: true }), who: TARVOS, expr: 'smirk', mood: 'night', rimColor: '#ffc070', rimSide: -1, look: [0.2, -0.8] }); } });
// s222 — "A tempestade chegou numa noite sem lua."
registerShot('s222', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.05 }); bay(g, t, cam, { storm: ease.out(prog(t, 0, 1.0)) }); } });
// s223 — "Os navios presos uns aos outros afundaram juntos."
registerShot('s223', { draw(g, t, info) { const [sx, sy] = shake(t, 4, 6); bay(g, t, { z: 1.08, x: sx, y: sy }, { storm: 1, sink: ease.in(prog(t, 0.2, info.dur)) }); } });
// s224 — "E um pequeno barco de pesca deslizou entre os cascos."
registerShot('s224', { draw(g, t, info) { const cam = { z: 1.15, x: 0, y: 40 }; bay(g, t, cam, { storm: 1, sink: 0.6 }); const x = E.W * 0.1 + t * 380, y = E.H * 0.86 + Math.sin(t * 3) * 10; g.save(); g.translate(x, y); g.rotate(Math.sin(t * 2.4) * 0.08); poly(g, [[-120, -10], [130, -14], [100, 26], [-90, 26]], '#120c0c'); g.restore(); drawChar(g, { x: x - 10, y: y - 10, s: 0.9, facing: 1, outfit: HAYATO, pose: breathe(POSES.crouch, t), expr: 'determined', rim: deckRim, weapon: 'sheath', shadow: false }); } });
// s225 — "Tarvos o esperava no convés, espada na mão."
registerShot('s225', { draw(g, t, info) { const cam = push(t, info, { z0: 1.25, dz: 0.06, x0: 200, y0: 80 }), geo = deck(g, t, cam); layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX + 220, y: geo.GY + 30, s: 1.5, facing: -1, outfit: TARVOS, pose: breathe(PZ.guard, t), expr: 'smirk', rim: deckRim, weapon: 'sword', swordAng: -0.5, gleam: (t % 2) / 2 })); } });
// s226 — "Eu queria ver o seu rosto", disse.
registerShot('s226', { draw(g, t, info) { faceShot(g, t, info, { bg: (g, t) => deck(g, t, { z: 1.5, y: -60 }), who: TARVOS, expr: 'smirk', talk: tk(info, 0, wt('disse', info, 2) - 0.1), mood: 'storm', rimColor: '#cfd9ff', rimSide: 1, look: [-0.4, 0] }); FX.rain(g, t, { count: 200, angle: 0.3, a: 0.3 }); } });
// s227 — "Foi o duelo mais longo de todos."
registerShot('s227', { draw(g, t, info) {
  const cam = push(t, info, { z0: V(1.5, 1.6), dz: 0.04, y0: 130 }), geo = deck(g, t, cam); const ph = (t * 1.6) % 1, clash = ph > 0.4 && ph < 0.55;
  layer(g, cam, 1, (g) => { const gap = clash ? 150 : 260; drawChar(g, { x: geo.CX - gap, y: geo.GY + 30, s: 1.5, facing: 1, outfit: HAYATO, pose: clash ? PZ.slash : PZ.guard, expr: 'determined', rim: deckRim, weapon: 'sword', swordAng: clash ? -0.2 : -0.7 }); drawChar(g, { x: geo.CX + gap, y: geo.GY + 30, s: 1.5, facing: -1, outfit: TARVOS, pose: clash ? PZ.slash : PZ.guard, expr: 'angry', rim: deckRim, weapon: 'sword', swordAng: clash ? -0.2 : -0.7 }); if (clash) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, geo.CX, geo.GY - 200, 120, '#fff2c8', 0.9); g.restore(); FX.sparkle(g, geo.CX, geo.GY - 200, 70, '#fff2c8'); } });
} });
// s228 — "Ferido, Hayato recuou até a amurada."
registerShot('s228', { draw(g, t, info) { const cam = push(t, info, { z0: 1.4, dz: 0.05, x0: -260, y0: 110 }), geo = deck(g, t, cam); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 560 + (1 - ease.out(prog(t, 0, 1.5))) * 200, y: geo.GY + 30, s: 1.45, facing: 1, outfit: HAYATO, pose: breathe({ ...PZ.guard, head: [12, -190] }, t, 2), expr: 'nervous', rim: deckRim, weapon: 'sword', swordAng: -0.9 }); drawChar(g, { x: geo.CX + 60 - ease.out(prog(t, 0, 1.5)) * 160, y: geo.GY + 30, s: 1.5, facing: -1, outfit: TARVOS, pose: walkPose(t * 3, { stride: 14 }), expr: 'smirk', rim: deckRim, weapon: 'sword', swordAng: -0.4 }); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, geo.CX - 540, geo.GY - 120, 70, '#ff3a2a', 0.4); g.restore(); }); } });
// s229 — "Então uma onda inclinou o navio."
registerShot('s229', { draw(g, t, info) { const tilt = ease.inOut(prog(t, 0.2, 1.4)) * 0.22, cam = { z: 1.3, x: 0, y: 100, r: tilt * 0.6 }, geo = deck(g, t, cam, { tilt: tilt * 0.4 }); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 260, y: geo.GY + 30, s: 1.45, facing: 1, outfit: HAYATO, pose: POSES.ready, expr: 'determined', rim: deckRim, weapon: 'sword', swordAng: -0.6 }); drawChar(g, { x: geo.CX + 260 - tilt * 900, y: geo.GY + 30, s: 1.5, facing: -1, outfit: TARVOS, pose: tilt > 0.1 ? POSES.fall : PZ.guard, expr: tilt > 0.1 ? 'shocked' : 'angry', rim: deckRim, weapon: 'sword', swordAng: -1.5 }); }); FX.rain(g, t, { count: 200, angle: 0.3, a: 0.2 }); } });
// s230 — "Um único movimento." freeze on the deck
registerShot('s230', { draw(g, t, info) { const cam = { z: 1.4 + 0.03 * t, x: 0, y: 100, r: 0.13 }, geo = deck(0 ? g : g, 0.4, cam, { tilt: 0.09, rain: false, flash: true }); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX + 40, y: geo.GY + 30, s: 1.5, facing: -1, outfit: TARVOS, pose: POSES.fall, expr: 'shocked', rim: { color: '#ffffff', dir: [0.4, -1], w: 5 }, weapon: 'sword', swordAng: -2 }); drawChar(g, { x: geo.CX - 200, y: geo.GY + 30, s: 1.5, facing: 1, outfit: HAYATO, pose: PZ.slash, expr: 'determined', rim: { color: '#ffffff', dir: [1, -0.5], w: 6 }, weapon: 'sword', swordAng: 0.1, gleam: 0.5 }); }); veil(g, '#1a2a60', 0.22); g.save(); g.globalCompositeOperation = 'lighter'; g.strokeStyle = alpha('#ffffff', 0.7); g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.arc(E.W * 0.47, E.H * 0.52, 320, -1.1, 0.6); g.stroke(); g.restore(); FX.drops(g, t, { count: 140, rMin: 1.5, rMax: 6 }); } });
// s231 — "Quando o mastro partiu, havia só uma figura de pé no convés."
registerShot('s231', { draw(g, t, info) { const br = ease.in(prog(t, 0.1, 1.2)), fl = t > 1.6 && t < 2.4, cam = push(t, info, { z0: 1.0, dz: 0.08, y0: 20 }), geo = deck(g, t, cam, { mast: br, flash: fl, sinkOthers: 0.8 }); layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX - 100, y: geo.GY + 30, s: 1.25, facing: 1, outfit: HAYATO, pose: breathe(POSES.stand, t, 1.5), expr: 'sad', rim: { color: fl ? '#ffffff' : '#cfd9ff', dir: [0.4, -1], w: fl ? 8 : 5 }, weapon: 'sheath' })); if (fl) veil(g, '#dfe6ff', 0.15); } });
registerShot('s232', { draw(g, t, info) { markShot(g, t, info, 8, { mood: 'storm', glowC: '#9ab0ff' }); FX.rain(g, t, { count: 160, angle: 0.3, a: 0.2 }); } });
// s233 — "Sem imperador, Kezhar se desfez em uma geração."
registerShot('s233', { draw(g, t, info) { const k = ease.inOut(t / info.dur); mapBase(g, t, { z: 1.2 - 0.05 * k, x: -260, y: -160 }, { red: 1, crumble: ease.inOut(prog(t, 0.4, info.dur)) }); FX.dust(g, t, { count: 50, color: '#ffb0a0', a: 0.3 }); } });
// s234 — "E alguém, nos arquivos, raspou aquele nome."
registerShot('s234', { draw(g, t, info) { const cam = push(t, info, { z0: 2.0, dz: 0.08, x0: -120, y0: 280 }), geo = scriptorium(g, t, cam); layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX - 180, y: geo.GY, s: 1.2, facing: 1, outfit: SCRIBE, pose: breathe({ ...POSES.sit, eF: [26, -118], hF: [58 + Math.sin(t * 14) * 8, -122] }, t, 0.6), expr: 'angry', rim: { color: '#ffc070', dir: [1, -0.4], w: 4 } })); } });
// s235 — "Oito vezes."   (also reused for s263)
function eightPages(g, t, info, o = {}) {
  blurLayer(g, 14, (g) => archive(g, t, { z: 1.6, y: -120 }, { uv: o.uv || 0 })); veil(g, '#05040a', 0.5);
  const z = 1 + 0.04 * t; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  for (let i = 0; i < 8; i++) { const c = i % 4, r = Math.floor(i / 4), w = V(330, 220), h = w * 0.72, x = E.W / 2 + (c - 1.5) * (w + 40) - w / 2, y = E.H / 2 + (r - 0.5) * (h + 40) - h / 2, a = ease.out(prog(t, i * 0.07, i * 0.07 + 0.2)); g.save(); g.globalAlpha = a; page(g, x, y, w, h, t, { seed: 10 + i, uv: o.uv ? 1 : 0, reveal: o.uv ? prog(t, 0.2 + i * 0.05, 0.6 + i * 0.05) : 0 }); g.restore(); }
  g.restore();
}
registerShot('s235', { draw(g, t, info) { eightPages(g, t, info); UI.badge(g, { str: '8×', size: V(64, 70), a: prog(t, 0.1, 0.4) }); } });
// s236 — "Porque um império aceita uma derrota."
registerShot('s236', { draw(g, t, info) { const cam = push(t, info, { z0: 1.6, dz: 0.04, y0: -200 }), geo = throne(g, t, cam); veil(g, '#05040a', 0.3); const d = ease.in(prog(t, 0.3, info.dur)); banner(g, E.W * 0.36, E.H * 0.1 + d * 500, 520, 380, t, { wind: 0.4, a: 1 - d * 0.5 }); } });
// s237 — "Mas não aceita que um único homem foi o motivo dela."
registerShot('s237', { draw(g, t, info) { const M = mood('interiorWarm'); backdrop(g, ['#0a0608', '#1a0e10']); const z = 1 + 0.05 * t / info.dur; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); banner(g, E.W * 0.18, E.H * 0.04, V(1300, 800), V(700, 900), t, { wind: 0.25 }); g.restore(); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W / 2, E.H * 0.95, 600, '#ffb070', 0.25); g.restore(); drawChar(g, { x: E.W / 2, y: E.H * 0.92, s: 0.75, facing: 1, outfit: HAYATO, pose: breathe(POSES.stand, t), expr: 'determined', rim: { color: '#ffc070', dir: [0, -1], w: 4 }, weapon: 'sheath' }); } });
// s238 — "Hoje, a pesquisadora que estudou a crônica procurou provas por anos."
function study(g, t, info, o = {}) { const cam = push(t, info, { z0: V(1.25, 1.3), dz: 0.05, x0: -60, y0: -100 }), geo = archive(g, t, cam, { book: o.book ?? true }); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 360, y: geo.GY, s: 1.5, facing: 1, outfit: RESEARCHER, pose: breathe(o.pose || POSES.sit, t), expr: o.expr || 'thinking', rim: { color: '#ffd59a', dir: [1, -0.4], w: 4 } }); for (let i = 0; i < (o.boxes ?? 3); i++) { rr(g, geo.CX + 220 + i * 110, geo.GY - 100, 100, 100, 6); g.fillStyle = '#5a4430'; g.fill(); g.fillStyle = '#3a2a1e'; g.fillRect(geo.CX + 220 + i * 110, geo.GY - 100, 100, 14); } o.extra?.(g, geo); }); return geo; }
registerShot('s238', { draw(g, t, info) { study(g, t, info, { pose: { ...POSES.sit, eF: [24, -118], hF: [52, -130] } }); UI.readout(g, { value: String(2010 + Math.round(12 * ease.inOut(prog(t, 0.6, info.dur - 0.3)))), x: E.W - V(140, 90), y: V(160, 220), align: 'right', size: V(84, 90), a: prog(t, 0.4, 0.8) }); } });
registerShot('s239', { draw(g, t, info) { study(g, t, info, { pose: POSES.sad, expr: 'sad', book: false, boxes: 4 }); } });
// s240 — "Os historiadores concluíram: é só uma lenda."
registerShot('s240', { draw(g, t, info) { blurLayer(g, 12, (g) => archive(g, t, { z: 1.6, y: -120 }, { book: false })); veil(g, '#05040a', 0.4); g.save(); g.translate(E.W / 2, E.H / 2); g.rotate(-0.05); rr(g, -500, -320, 1000, 640, 12); g.fillStyle = '#c9a870'; g.fill(); rr(g, -480, -300, 960, 600, 8); g.fillStyle = '#e8dcc0'; g.fill(); text(g, 'KUROZANE NO HAYATO', -440, -230, { size: 40, font: FONTS.ui, weight: 900, color: '#3a2a1e', align: 'left', spacing: 3 }); for (let i = 0; i < 6; i++) { g.fillStyle = alpha('#3a2a1e', 0.3); g.fillRect(-440, -150 + i * 50, 600 + (i % 3) * 100, 10); } g.restore(); const st = wt('lenda', info, 1.6) - 0.15, sk = ease.out(prog(t, st, st + 0.2)); if (sk > 0) { g.save(); g.translate(E.W / 2 + 120, E.H * 0.56); g.rotate(-0.18); const sc = 1.8 - 0.8 * sk; g.scale(sc, sc); rr(g, -230, -70, 460, 140, 16); g.strokeStyle = alpha('#d23a2a', 0.9 * sk); g.lineWidth = 10; g.stroke(); text(g, 'LENDA', 0, 4, { size: 96, color: alpha('#d23a2a', 0.9 * sk), spacing: 10 }); g.restore(); } } });
// s241 — "Mas, antes de encerrar a pesquisa, ela viajou até Iki."
registerShot('s241', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.04 }); harbor(g, t, cam, { ferry: 0.25 + 0.35 * prog(t, 0, info.dur), nets: false }); } });
// s242–s245 — the fishermen and the song
function fishers(g, t, info, cam, o = {}) { const geo = harbor(g, t, cam); layer(g, cam, 1, (g) => { [[-140, OLDFISH], [80, FISHER], [300, { ...FISHER, color: '#5a3a2a', headColor: '#7a2a2a' }]].forEach(([dx, of], i) => drawChar(g, { x: geo.CX + dx, y: geo.GY - 40, s: 1.25, facing: -1, outfit: of, pose: breathe(o.fp?.(i, t) || (i === 1 ? POSES.holdFront : POSES.relaxed), t, 1, i), expr: o.fe || 'smile', talk: o.sing ? 0.2 + 0.25 * Math.abs(Math.sin(t * 3 + i)) : 0, rim: rimOf(geo.M, [-1, -0.4]) })); if (o.her) drawChar(g, { x: geo.CX - 480, y: geo.GY - 40, s: 1.25, facing: 1, outfit: RESEARCHER, pose: breathe(o.hp || POSES.explain, t), expr: o.he || 'thinking', rim: rimOf(geo.M, [-1, -0.4]) }); }); return geo; }
registerShot('s242', { draw(g, t, info) { fishers(g, t, info, push(t, info, { z0: 1.2, dz: 0.05, y0: 40 }), { sing: true }); lyrics(g, t, info, ['♪'], { times: [info.shot.start + 0.3], y: E.H * 0.2 }); } });
registerShot('s243', { draw(g, t, info) { fishers(g, t, info, push(t, info, { z0: 1.25, dz: 0.04, x0: -120, y0: 50 }), { her: true, fe: 'neutral' }); } });
registerShot('s244', { draw(g, t, info) { fishers(g, t, info, push(t, info, { z0: 1.25, dz: 0.04, x0: -60, y0: 50 }), { her: true, hp: POSES.stand, he: 'surprised', fe: 'smile', fp: (i, t) => ({ ...POSES.relaxed, head: [4 + Math.sin(t * 7 + i) * 5, -207] }) }); } });
registerShot('s245', { draw(g, t, info) { faceShot(g, t, info, { bg: (g, t) => harbor(g, t, { z: 1.6, y: -80 }), who: OLDFISH, expr: 'smile', mood: 'golden', rimSide: -1, look: [-0.3, 0], push: 0.06 }); } });
// s246 — 3D: the shrine on the hill at dusk
registerShot('s246', { kind: '3d',
  init(T) {
    const M = mood('dusk'), { THREE } = T;
    const st = T.stage({ mood: 'dusk', fov: V(36, 52), fog: [20, 90], keyPos: [12, 10, -10], keyIntensity: 2.0, ambient: 0.9 });
    st.add(T.ground(300, 300, shade(M.grass, -0.3)));
    const hill = T.sphere(10, T.mat(shade(M.grass, -0.2), { flat: true })); hill.scale.set(1, 0.4, 1); st.add(hill);
    const top = 4; st.add(T.box(3, 1.6, 2.2, shade(M.wall, -0.3), 0, top + 0.8, -0.5)); const roof = T.cone(2.6, 1.2, shade(M.dark, -0.2), 0, top + 2.2, -0.5, 4); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.8; st.add(roof);
    const win = T.windowPane(0.8, 1.0, { glowColor: M.practical, cols: 2, rows: 2, power: 1.0 }); win.position.set(0, top + 0.7, 0.62); st.add(win);
    const tr = '#8a1a1a'; for (const x of [-0.9, 0.9]) st.add(T.cyl(0.09, 0.1, 2.2, tr, x, top + 1.1 - 0.4, 3.2)); st.add(T.box(2.8, 0.14, 0.2, tr, 0, top + 2.0, 3.2), T.box(2.2, 0.1, 0.16, tr, 0, top + 1.7, 3.2));
    for (let i = 0; i < 30; i++) { const a = -1.2 + (i % 10) * 0.12, r = 3.2 + Math.floor(i / 10) * 0.45; for (let k = 0; k < 3; k++) st.add(T.sphere(0.14 - k * 0.03, T.mat('#5a5462', { flat: true }), Math.sin(a + Math.PI) * r * 0.9, top - 0.15 + k * 0.18 - Math.floor(i / 10) * 0.12, Math.cos(a + Math.PI) * r * 0.6 - 0.8)); }
    for (let i = 0; i < 10; i++) { const a = i * 0.63; st.add(T.cone(0.6, 2.4, shade(M.dark, -0.15), Math.cos(a) * 6.5, 2.2, Math.sin(a) * 6.5, 6)); }
    return { stage: st };
  },
  draw(s, t, info, T) { T.orbit(s.stage.camera, t, { target: [0, 4.6, 0], radius: [13, 11], height: [8, 6.8], from: 0.5, to: -0.2, dur: info.dur }); },
});
// s247 — "Atrás dele, trinta pedras sem nome."
registerShot('s247', { draw(g, t, info) { const cam = push(t, info, { z0: 1.4, dz: 0.1, x0: 120, y0: -120 }); shrine(g, t, cam); UI.readout(g, { value: String(Math.round(30 * ease.out(prog(t, 0.3, 1.6)))), label: 'PEDRAS', x: V(160, 90), y: E.H * 0.24, size: V(96, 100) }); } });
// s248 — "Lá dentro, uma tachi antiga."
registerShot('s248', { draw(g, t, info) { const cam = push(t, info, { z0: 1.0, dz: 0.1, y0: 0, dy: 40 }), geo = shrineIn(g, t, cam); layer(g, cam, 0.85, (g) => sheath(g, geo.CX, geo.standY - 30, 700, t, { marks: 8, rot: -0.03, old: true, lit: '#ffd59a' })); } });
// s249–s251 — the marks
function marksMacro(g, t, info, o = {}) { blurLayer(g, 14, (g) => shrineIn(g, t, { z: 1.6, y: 40 })); veil(g, '#0a0606', 0.35); const k = ease.inOut(t / info.dur); sheath(g, E.W * (o.cx ?? 0.62) - 120 * k, E.H * 0.52, V(2600, 1700) * (1 + 0.05 * k), t, { marks: 8, rot: -0.05, old: true, lit: '#ffd59a', highlight: o.hi || 0, hiFrom: o.from || 1, hiTo: o.to || 0 }); }
registerShot('s249', { draw(g, t, info) { marksMacro(g, t, info, { hi: 0.4 * prog(t, 0.2, 0.6), from: 1, to: 8 }); UI.readout(g, { value: String(Math.round(8 * ease.out(prog(t, 0.2, 1.2)))), label: 'MARCAS', x: V(160, 90), y: E.H * 0.22, size: V(96, 100) }); } });
registerShot('s250', { draw(g, t, info) { marksMacro(g, t, info, { hi: 0.9 * prog(t, 0.1, 0.5), from: 1, to: 7, cx: 0.66 }); } });
registerShot('s251', { draw(g, t, info) { marksMacro(g, t, info, { hi: 0.9 * prog(t, 0.1, 0.5), from: 8, to: 8, cx: 0.78 }); } });
// s252 — "Como se feita por uma mão ferida."
registerShot('s252', { draw(g, t, info) { blurLayer(g, 12, (g) => deck(g, t, { z: 1.4 }, { rain: false })); veil(g, '#0a1030', 0.45); const sh = sheath(g, E.W * 0.5, E.H * 0.5, V(2000, 1300), t, { marks: 8, newMark: 8, cutAt: 1.0, rot: -0.05, lit: '#9ab0ff' }); const [mx, my] = sh.markX(8), kp = ease.inOut(prog(t, 0.3, 1.3)), tremble = Math.sin(t * 40) * 6; knife(g, mx + 140 - kp * 140 + tremble, my - 200 + kp * 170, -0.9, 1.6, S().ink); seg(g, [[mx + 220 - kp * 140 + tremble, my - 330 + kp * 170], [E.W + 200, -200]], 80, '#262c44'); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, mx + 260 - kp * 140, my - 360 + kp * 170, 90, '#ff3a2a', 0.25); g.restore(); FX.rain(g, t, { count: 140, angle: 0.3, a: 0.2 }); } });
// s253 — "Ela perguntou ao monge quem tinha feito aqueles cortes."
registerShot('s253', { draw(g, t, info) { const cam = push(t, info, { z0: V(1.3, 1.4), dz: 0.05, y0: 60 }), geo = shrineIn(g, t, cam); layer(g, cam, 0.85, (g) => sheath(g, geo.CX, geo.standY - 30, 700, t, { marks: 8, rot: -0.03, old: true })); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX - 480, y: geo.GY + 40, s: 1.5, facing: 1, outfit: RESEARCHER, pose: breathe(POSES.explain, t), expr: 'thinking', rim: { color: '#ffd59a', dir: [-1, -0.3], w: 4 } }); drawChar(g, { x: geo.CX + 480, y: geo.GY + 40, s: 1.5, facing: -1, outfit: MONK, pose: breathe(POSES.relaxed, t, 1, 2), expr: 'smile', rim: { color: '#ffd59a', dir: [1, -0.3], w: 4 } }); }); } });
// s254 — "Ele sorriu: Quem fez as marcas pediu para não ser lembrado."
registerShot('s254', { draw(g, t, info) { const st = wt('quem', info, 0.8); faceShot(g, t, info, { bg: (g, t) => shrineIn(g, t, { z: 1.6, y: 40 }), who: MONK, expr: 'smile', talk: tk(info, st, info.dur - 0.1), mood: 'interiorWarm', rimSide: 1, look: [-0.3, 0], push: 0.05 }); } });
// s255 — "Nós respeitamos."
registerShot('s255', { draw(g, t, info) { const cam = push(t, info, { z0: V(1.6, 1.7), dz: 0.04, x0: 200, y0: 160 }), geo = shrineIn(g, t, cam); layer(g, cam, 1, (g) => { drawChar(g, { x: geo.CX + 380, y: geo.GY + 40, s: 1.5, facing: -1, outfit: MONK, pose: posesAt(t, [[0, POSES.relaxed], [0.3, { ...POSES.stand, head: [18, -196], sh: [8, -168] }]], 0.4), expr: 'smile', talk: tk(info, 0, info.dur - 0.2), rim: { color: '#ffd59a', dir: [1, -0.3], w: 4 } }); drawChar(g, { x: geo.CX - 60, y: geo.GY + 40, s: 1.5, facing: 1, outfit: RESEARCHER, pose: breathe(POSES.stand, t), expr: 'smile', rim: { color: '#ffd59a', dir: [-1, -0.3], w: 4 } }); }); } });
// s256 — "E toda primavera, as crianças sobem até lá e cantam:"
const KIDS = ['#f2c21a', '#3fb950', '#f29ac0', '#3a6ea5', '#d64a33', '#8a5ad6'];
function kids(g, geo, t, o = {}) { KIDS.forEach((c, i) => { const climb = o.climb ? ease.inOut(prog(t, i * 0.2, 2.6 + i * 0.2)) : 1; const x = o.climb ? geo.CX - 760 + i * 70 + climb * 600 : geo.CX - 260 + i * 110, y = o.climb ? geo.GY + 120 - climb * 160 : geo.GY - 60; drawChar(g, { x, y, s: 1.0, facing: 1, outfit: CHILD(c), pose: o.climb && climb < 1 ? walkPose(t * 7 + i) : breathe(POSES.stand, t, 1, i), expr: 'happy', talk: o.sing ? 0.2 + 0.3 * Math.abs(Math.sin(t * 3 + i * 0.5)) : 0, rim: rimOf(geo.M, [1, -0.5], 4) }); }); }
registerShot('s256', { draw(g, t, info) { const cam = push(t, info, { z0: 1.1, dz: 0.05, x0: -160, y0: 40 }), geo = shrine(g, t, cam, { mood: 'golden', spring: true }); layer(g, cam, 1, (g) => kids(g, geo, t, { climb: true })); } });
registerShot('s257', { draw(g, t, info) { const cam = push(t, info, { z0: V(1.5, 1.6), dz: 0.05, x0: 60, y0: 120 }), geo = shrine(g, t, cam, { mood: 'golden', spring: true }); layer(g, cam, 1, (g) => kids(g, geo, t, { sing: true })); veil(g, '#05040a', 0.12); lyrics(g, t, info, SONG1, { y: E.H * 0.17 }); } });
registerShot('s258', { draw(g, t, info) { const k = ease.inOut(t / info.dur), cam = { z: 1.2 - 0.1 * k, x: 300 * k, y: -60 * k }; const geo = shrine(g, t, cam, { mood: 'golden', spring: true }); layer(g, cam, 1, (g) => kids(g, geo, t, { sing: true })); veil(g, '#05040a', 0.12); lyrics(g, t, info, SONG2, { y: E.H * 0.17 }); } });
// s259 — "Talvez seja só uma lenda."
registerShot('s259', { draw(g, t, info) { const cam = push(t, info, { z0: 1.1, dz: 0.06 }), geo = shrineIn(g, t, cam); layer(g, cam, 0.85, (g) => sheath(g, geo.CX, geo.standY - 30, 700, t, { marks: 8, rot: -0.03, old: true })); veil(g, '#1a0e14', 0.2); } });
// s260 — "Mas alguém empilhou aquelas trinta pedras."
registerShot('s260', { draw(g, t, info) { const cam = push(t, info, { z0: 1.9, dz: 0.08, x0: 120, y0: -230 }); shrine(g, t, cam, { mood: 'dusk' }); FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 }); } });
registerShot('s261', { draw(g, t, info) { marksMacro(g, t, info, { hi: 0.8 * prog(t, 0.2, 0.8), from: 1, to: 8, cx: 0.64 }); } });
// s262 — "E alguém teve medo suficiente para apagar o nome dele."
registerShot('s262', { draw(g, t, info) { blurLayer(g, 14, (g) => archive(g, t, { z: 1.8, y: -120 }, { uv: 1 })); veil(g, '#0a0418', 0.5); const z = 1.05 + 0.08 * ease.inOut(t / info.dur), w = V(1300, 960), h = w * 0.7; g.save(); g.translate(E.W / 2, E.H / 2 + 60); g.scale(z, z); g.rotate(-0.025); g.translate(-w / 2, -h / 2 - h * 0.08); page(g, 0, 0, w, h, t, { seed: 3, uv: 1 }); text(g, 'KUROZANE NO HAYATO', w / 2, w * 0.1 + 4.5 * ((h - w * 0.2) / 11), { size: V(84, 64), font: FONTS.serif, italic: true, weight: 900, color: '#efe0ff', glow: 40, glowColor: alpha(UV, 1), alpha: 0.6 + 0.4 * Math.sin(t * 2) }); g.restore(); } });
// s263 — "Oito vezes." — final card
registerShot('s263', { draw(g, t, info) { eightPages(g, t, info, { uv: 1 }); const a = prog(t, 0.6, 1.2); veil(g, '#05030a', 0.6 * a); UI.titleCard(g, Math.max(0, t - 0.6), { lines: ['KUROZANE NO HAYATO'], sub: '8 MARCAS · 30 PEDRAS · 1 CANÇÃO', dur: info.dur }); } });
