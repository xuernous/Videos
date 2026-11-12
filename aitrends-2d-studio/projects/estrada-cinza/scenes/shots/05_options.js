// shots/05_options.js — s34–s44: the four ways to Kolvar (bus, taxi, stolen car, on foot), the vote, the end line.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, radGrad, rng, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street, road, signpost } from '../sets/exteriors.js';
import { wt, popLabel, optionBadge, warnTag, rimOf, FIRE, bus, car, sirenWash, OPT, SIREN_R, SIREN_B, backpack } from '../sets/kit.js';
import { withBag } from './03_leave.js';
import { YOU, SOLDIER, DRIVER } from '../cast.js';

const at = (info, g) => g - info.shot.start;   // absolute word time -> shot time

// s34 — "A: Ônibus. Dezoito marcos."  old bus at a foggy stop
registerShot('s34', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.4 + 0.06 * k, x: V(60, 80) - 40 * k, y: V(90, 150) };
  const { GY, M } = road(g, t, cam, { fog: 0.9, poles: false });
  layer(g, cam, 1, (g) => {
    // bus stop shelter
    const sx = E.W / 2 - V(330, 300); seg(g, [[sx - 80, GY + 40], [sx - 80, GY - 300]], 8, '#0b0c14'); seg(g, [[sx + 80, GY + 40], [sx + 80, GY - 300]], 8, '#0b0c14'); g.fillStyle = '#0b0c14'; g.fillRect(sx - 110, GY - 320, 220, 26); rr(g, sx - 30, GY - 400, 60, 60, 30); g.fillStyle = shade('#3a6a4a', -0.2); g.fill(); text(g, 'P', sx, GY - 370, { size: 36, color: '#fff', font: FONTS.ui, weight: 900 });
    bus(g, E.W / 2 + V(250, 200) - 60 * k, GY + 60, V(0.95, 0.85), { facing: -1, rim: M.rim, color: shade('#5a6070', -0.25) });
    withBag(g, { x: sx + 20, y: GY + 50, s: 1.2, facing: 1, outfit: YOU, pose: breathe(POSES.stand, t), expr: 'worried', look: [0.6, 0], rim: { color: '#fff1c0', dir: [1, -0.2] } });
  });
  optionBadge(g, t, { letter: 'A', title: 'ÔNIBUS', price: '18 MARCOS', at: 0.05, priceAt: at(info, 82.68) });
} });

// s35 — "Rápido, mas tem barreira policial na estrada."  roadblock
registerShot('s35', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.45 + 0.08 * k, x: 0, y: V(90, 150) };
  const { GY, M, horizon } = road(g, t, cam, { fog: 0.6, roll: t * 0.6 });
  const tb = at(info, 85.28);
  layer(g, cam, 0.85, (g) => sirenWash(g, t, E.W / 2, GY - 120, V(900, 800), 0.4 + 0.6 * ease.out(prog(t, tb - 0.3, tb + 0.2)), 5));
  layer(g, cam, 1, (g) => {
    // striped barrier across the road
    const by = GY + 40, bw = V(900, 760); g.save(); g.beginPath(); g.rect(E.W / 2 - bw / 2, by - 150, bw, 36); g.clip(); for (let i = -20; i < 40; i++) poly(g, [[E.W / 2 - bw / 2 + i * 50, by - 150], [E.W / 2 - bw / 2 + i * 50 + 25, by - 150], [E.W / 2 - bw / 2 + i * 50 - 11, by - 114], [E.W / 2 - bw / 2 + i * 50 - 36, by - 114]], '#d8d8de'); g.restore();
    g.fillStyle = alpha('#c02a2a', 0.85); g.save(); g.beginPath(); g.rect(E.W / 2 - bw / 2, by - 150, bw, 36); g.globalCompositeOperation = 'multiply'; g.fill(); g.restore();
    for (const dx of [-bw / 2 + 30, bw / 2 - 30]) seg(g, [[E.W / 2 + dx, by], [E.W / 2 + dx, by - 150]], 14, '#0b0c14');
    // police with flashlights
    for (const [x, f, ph] of [[E.W / 2 - 230, 1, 0], [E.W / 2 + 240, -1, 2]]) {
      drawFigure(g, { x, y: GY - 10, s: 1.3, facing: f, outfit: SOLDIER, pose: { ...POSES.point, hF: [62, -150], eF: [32, -156] }, expr: 'angry', rim: { color: '#eef3ff', dir: [0, -1] } });
      const sw = Math.PI / 2 + 0.25 * f * Math.sin(t * 2 + ph); g.save(); g.globalCompositeOperation = 'lighter'; FX.lightCone(g, x + f * 80, GY - 160, { angle: sw, spread: 0.2, len: 700, color: '#f0f4ff', a: 0.25 }); g.restore();
    }
  });
  warnTag(g, t, 'BARREIRA POLICIAL', { at: tb, y: E.H * 0.13 });
} });

// s36 — "B: Táxi. Sessenta marcos."  taxi under a street lamp
registerShot('s36', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.06 * k, x: V(60, 60) - 50 * k, y: V(110, 170) };
  const { GY, M } = street(g, t, cam, { fire: 0.3, smoke: true, banner: false, lamps: false });
  layer(g, cam, 1, (g) => {
    FX.lampPost(g, E.W / 2 - 300, GY - 10, 520, { light: M.practical, a: 0.28, color: '#0c0d14' }); FX.pool(g, E.W / 2 - 263, GY + 20, 300, 60, M.practical, 0.45);
    car(g, E.W / 2 + 80, GY + 60, V(1.1, 1.0), { facing: -1, taxi: true, rim: M.practical, color: '#2c2e38' });
    withBag(g, { x: E.W / 2 - 250, y: GY + 60, s: 1.25, facing: 1, outfit: YOU, pose: breathe(POSES.stand, t), expr: 'nervous', look: [0.5, 0], rim: { color: M.practical, dir: [-0.5, -1] } });
  });
  optionBadge(g, t, { letter: 'B', title: 'TÁXI', price: '60 MARCOS', at: 0.05, priceAt: at(info, 88.28) });
} });

// s37 — "Discreto… se o motorista não for informante."  rear-view mirror, the driver glances
registerShot('s37', { draw(g, t, info) {
  const ui = S().ui, M = mood('night'), ti = at(info, 92.06), tm = at(info, 91.18);
  // dark car interior with passing streetlights
  backdrop(g, ['#05060b', '#0c0e18']);
  const pass = (t * 0.7) % 1; glow(g, lerp(-200, E.W + 200, pass), E.H * 0.3, 700, M.practical, 0.25);
  // windshield
  g.fillStyle = linGrad(g, 0, 0, 0, E.H * 0.6, [shade(M.sky[0], -0.2), shade(M.sky[1], -0.3)]); g.beginPath(); g.moveTo(-50, E.H * 0.08); g.quadraticCurveTo(E.W / 2, -20, E.W + 50, E.H * 0.08); g.lineTo(E.W + 50, E.H * 0.62); g.lineTo(-50, E.H * 0.62); g.closePath(); g.fill();
  for (let i = 0; i < 5; i++) { const x = ((i * 300 - t * 500) % (E.W + 400) + E.W + 400) % (E.W + 400) - 200; seg(g, [[x, E.H * 0.62], [x + 10, E.H * 0.3]], 8, '#0b0c14'); glow(g, x + 10, E.H * 0.3, 80, M.practical, 0.5); }
  g.fillStyle = '#05060a'; g.fillRect(-50, E.H * 0.62, E.W + 100, E.H);
  // the mirror
  const z = 1 + 0.08 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.36;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.rotate(-0.04);
  seg(g, [[0, -E.H], [0, -160]], 18, '#0b0c14');
  rr(g, -420, -150, 840, 300, 60); g.fillStyle = '#16161e'; g.fill();
  g.save(); rr(g, -400, -130, 800, 260, 48); g.clip();
  g.fillStyle = linGrad(g, 0, -130, 0, 130, ['#1a1e2e', '#0c0e18']); g.fillRect(-400, -130, 800, 260);
  const glance = ease.inOut(prog(t, tm, tm + 0.4));
  bigFace(g, 60, 50, 150, { outfit: DRIVER, expr: t > ti ? 'smirk' : 'neutral', rimColor: M.practical, rimSide: 1, look: [lerp(0.8, -0.6, glance), 0] });
  g.fillStyle = alpha('#ffffff', 0.06); poly(g, [[-400, -130], [-200, -130], [-420, 130]], alpha('#ffffff', 0.06));
  g.restore(); g.restore();
  // a notepad + radio on the dashboard: the informant hint
  if (t > ti) { const kk = ease.out(prog(t, ti, ti + 0.4)); g.save(); g.globalAlpha *= kk; rr(g, E.W / 2 + 140, E.H * 0.66, 200, 120, 12); g.fillStyle = '#2a2a30'; g.fill(); circle(g, E.W / 2 + 190, E.H * 0.66 + 60, 26, '#111'); seg(g, [[E.W / 2 + 300, E.H * 0.66], [E.W / 2 + 330, E.H * 0.6]], 5, '#2a2a30'); circle(g, E.W / 2 + 300, E.H * 0.66 + 40, 7, SIREN_R); glow(g, E.W / 2 + 300, E.H * 0.66 + 40, 40, SIREN_R, 0.6); g.restore(); }
  warnTag(g, t, 'INFORMANTE?', { at: ti, y: E.H * 0.56 });
} });

// s38 — "C: Roubar um carro. De graça."  you crouched at an old car door with a wire
registerShot('s38', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.6 + 0.06 * k, x: V(30, 20), y: V(120, 180) };
  const { GY, M } = street(g, t, cam, { fire: 0.4, banner: false, lamps: true });
  veil(g, '#000', 0.2);
  layer(g, cam, 1, (g) => {
    car(g, E.W / 2 + 140, GY + 60, V(1.15, 1.05), { facing: -1, rim: M.rim, lights: false, color: '#3a3428' });
    const jig = Math.sin(t * 16) * 4;
    withBag(g, { x: E.W / 2 - 170, y: GY + 60, s: 1.4, facing: 1, outfit: YOU, pose: { ...POSES.crouch, hF: [58 + jig, -92], eF: [36, -84] }, expr: 'nervous', look: [0.8, -0.2], rim: rimOf(M, [-0.6, -1]) });
    seg(g, [[E.W / 2 - 170 + 58 * 1.4 + jig, GY + 60 - 92 * 1.4], [E.W / 2 - 40, GY - 80]], 3, '#c8c8d0');
  });
  optionBadge(g, t, { letter: 'C', title: 'ROUBAR UM CARRO', price: 'GRÁTIS', priceColor: S().ui.good, at: 0.05, priceAt: at(info, 95.1) });
} });

// s39 — "Mas, se a polícia descobrir, vem atrás de você."  police car chase
registerShot('s39', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), [sx, sy] = shake(t, 6, 3), cam = { z: 1.5, x: sx, y: V(110, 170) + sy };
  const { GY, M } = road(g, t, { ...cam, x: sx + t * 400 }, { fog: 0.4, poles: false, roll: t * 3 });
  const tp = at(info, 96.42);
  layer(g, cam, 1, (g) => {
    car(g, E.W / 2 + 230, GY + 70, 0.95, { facing: 1, color: '#3a3428', rim: M.rim });
    const pin = ease.out(prog(t, tp - 0.4, tp + 0.4)), px = lerp(-500, E.W / 2 - 320 + 40 * Math.sin(t * 3), pin);
    car(g, px, GY + 90, 0.95, { facing: 1, police: true, t, color: '#20222c' });
    sirenWash(g, t, px, GY - 60, 600, pin, 8);
  });
  FX.speedLines(g, t, { cx: E.W * 0.9, cy: E.H * 0.6, count: 50, a: 0.18, inner: 300 });
  warnTag(g, t, 'POLÍCIA ATRÁS DE VOCÊ', { at: at(info, 97.68), y: E.H * 0.13 });
} });

// s40 — "D: A pé. De graça."  walking alone on the grey road
registerShot('s40', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.06 * k, x: 0, y: V(100, 160) };
  const { GY, M } = road(g, t, cam, { fog: 0.7, roll: t * 0.25 });
  layer(g, cam, 1, (g) => {
    const s = lerp(1.6, 1.45, k);
    withBag(g, { x: E.W / 2 + 20, y: GY + 130 - k * 30, s, facing: -1, outfit: YOU, pose: walkPose(t * 2 * Math.PI * 0.9), expr: 'determined', look: [0.2, -0.2], rim: rimOf(M, [0.4, -1]) });
  });
  optionBadge(g, t, { letter: 'D', title: 'A PÉ', price: 'GRÁTIS', priceColor: S().ui.good, at: 0.05, priceAt: at(info, 100.56) });
} });

// s41 — "Três dias de caminhada, e o seu corpo vai cobrar."  3D endless grey road, days tick by
registerShot('s41', {
  kind: '3d',
  init(T) {
    const M = mood('night'), { THREE } = T;
    const st = T.stage({ mood: 'night', fov: V(36, 52), fog: [12, 70], keyPos: [5, 10, 18], keyIntensity: 1.8, ambient: 1.2, bloom: 0.6 });
    st.add(T.ground(300, 400, shade(M.grass, -0.55)));
    const rd = T.box(4, 0.02, 400, shade(M.road, 0.05), 0, 0.01, -150); st.add(rd);
    for (let z = 40; z > -340; z -= 6) st.add(T.box(0.15, 0.03, 2.4, '#c8c8d0', 0, 0.02, z));
    const r = rng(5);
    for (let z = 40; z > -340; z -= 14) { st.add(T.cyl(0.08, 0.1, 6, '#0b0c14', 3.4, 3, z)); st.add(T.box(1.6, 0.08, 0.08, '#0b0c14', 3.4, 5.7, z)); }
    for (let i = 0; i < 90; i++) { const side = i % 2 ? 1 : -1; st.add(T.pine3D(side * (8 + r() * 30), 30 - r() * 360, 0.8 + r() * 0.8, shade(M.wall, -0.65))); }
    const you = T.figure3D(YOU, { rim: M.rim }); you.rotation.y = Math.PI / 2; st.add(you);   // faces -z (away, down the road)
    const bag = T.box(0.36, 0.45, 0.2, '#4a4038', 0, 1.15, 0.16); you.add(bag);
    return { stage: st, you };
  },
  draw(s, t, info, T) {
    const tc = at(info, 103.32), slow = ease.inOut(prog(t, tc - 0.3, tc + 0.8)), sp = lerp(1.3, 0.55, slow);
    const z = -(t * 1.3 - Math.max(0, t - tc) * (1.3 - sp) * 0.5);
    s.you.position.set(0.6, 0, z);
    const ph = t * 2 * Math.PI * lerp(0.9, 0.55, slow), base = walkPose(ph);
    s.you.setPose(slow > 0.5 ? { ...base, head: [14, -196], sh: [8, -168] } : base);
    T.dolly(s.stage.camera, t, [[0, { pos: [3.2, 2.2, z + 5.5], look: [0.6, 1.0, z - 2], fov: V(36, 54) }], [info.dur, { pos: [2.2, 2.8, z + 5.0], look: [0.6, 1.0, z - 3], fov: V(36, 52) }]]);
    s.stage.camera.position.z = z + lerp(5.5, 5.0, t / info.dur); s.stage.camera.lookAt(0.6, 1.0, z - 2.5);
  },
  overlay(g, t, info) {
    const ui = S().ui, t3 = at(info, 101.4);
    const day = t < t3 + 0.3 ? 1 : t < t3 + 0.8 ? 2 : 3, kk = ease.outBack(prog(t, t3, t3 + 0.35));
    if (kk > 0) { text(g, 'DIA', E.W / 2, E.H * 0.1, { size: V(48, 54), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 10, alpha: clamp(kk) }); text(g, String(day), E.W / 2, E.H * 0.1 + V(110, 120), { size: V(150, 170), color: ui.gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(ui.gold, 0.6), alpha: clamp(kk) }); }
    const tc = at(info, 103.32); if (t > tc) warnTag(g, t, 'O CORPO VAI COBRAR', { at: tc, y: E.H * 0.3 });
  },
});

// option card for the vote screens
function card(g, t, L, title, sub, y, k, vote = 0) {
  if (k <= 0) return; const ui = S().ui, col = OPT()[L], w = V(820, 900), h = V(150, 170);
  g.save(); g.translate(E.W / 2, y); g.scale(k, k);
  rr(g, -w / 2, -h / 2, w, h, h / 2); g.fillStyle = 'rgba(8,10,20,.8)'; g.fill();
  if (vote > 0) { g.save(); rr(g, -w / 2, -h / 2, w, h, h / 2); g.clip(); g.fillStyle = alpha(col, 0.25); g.fillRect(-w / 2, -h / 2, w * vote, h); g.restore(); }
  rr(g, -w / 2, -h / 2, w, h, h / 2); g.strokeStyle = col; g.lineWidth = 6; g.stroke();
  circle(g, -w / 2 + h / 2, 0, h * 0.36, col); text(g, L, -w / 2 + h / 2, 4, { size: h * 0.46, color: '#0a0b14', font: FONTS.ui, weight: 900 });
  text(g, title, -w / 2 + h * 1.05, -h * 0.13, { size: V(50, 54), color: ui.cream, font: FONTS.title, weight: 700, align: 'left', spacing: 3 });
  text(g, sub, -w / 2 + h * 1.05, h * 0.22, { size: V(30, 34), color: alpha(col, 0.95), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  g.restore();
}
const CARDS = [['A', 'ÔNIBUS', '18 MARCOS · BARREIRA'], ['B', 'TÁXI', '60 MARCOS · INFORMANTE?'], ['C', 'ROUBAR UM CARRO', 'GRÁTIS · POLÍCIA'], ['D', 'A PÉ', 'GRÁTIS · 3 DIAS']];
const voteBg = (g, t) => { const M = mood('night'); blurLayer(g, 16, (g) => road(g, t, { z: 1.3, y: V(80, 140) }, { cross: true, fog: 0.8 })); veil(g, '#04050c', 0.55); };

// s42 — "Comente A, B, C ou D."
registerShot('s42', { draw(g, t, info) {
  const ui = S().ui; voteBg(g, t);
  text(g, 'COMENTE', E.W / 2, E.H * 0.12, { size: V(96, 108), color: ui.gold, font: FONTS.title, weight: 700, spacing: 8, glow: 28, glowColor: alpha(ui.gold, 0.6), alpha: ease.out(prog(t, 0.05, 0.4)) });
  const times = [105.46, 106.26, 106.62, 107.1].map(x => at(info, x));
  CARDS.forEach(([L, ti, sub], i) => card(g, t, L, ti, sub, E.H * (0.24 + i * 0.115), ease.outBack(prog(t, times[i] - 0.1, times[i] + 0.3))));
  FX.dust(g, t, { count: 30, color: ui.gold, a: 0.25 });
} });

// s43 — "A mais votada decide o próximo episódio."
registerShot('s43', { draw(g, t, info) {
  const ui = S().ui; voteBg(g, t);
  text(g, 'A MAIS VOTADA', E.W / 2, E.H * 0.12, { size: V(84, 92), color: ui.cream, font: FONTS.title, weight: 700, spacing: 6, glow: 20, glowColor: alpha(ui.cream, 0.4) });
  const vk = ease.inOut(prog(t, 0.3, 2.2)), votes = [0.62, 0.48, 0.71, 0.55];
  CARDS.forEach(([L, ti, sub], i) => card(g, t, L, ti, sub, E.H * (0.24 + i * 0.115), 1, votes[i] * vk));
  const tp = at(info, 109.18), kp = ease.outBack(prog(t, tp, tp + 0.4));
  if (kp > 0) { g.save(); g.translate(E.W / 2, E.H * 0.73); g.scale(kp, kp); rr(g, -V(380, 400), -60, V(760, 800), 120, 60); g.fillStyle = alpha(ui.gold, 0.15); g.fill(); g.strokeStyle = ui.gold; g.lineWidth = 5; g.stroke(); text(g, 'DECIDE O PRÓXIMO EPISÓDIO', 0, 4, { size: V(40, 44), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); }
  FX.dust(g, t, { count: 30, color: ui.gold, a: 0.25 });
} });

// s44 — "Em Valdória, toda escolha tem um preço."  the crossroads, the end line
registerShot('s44', { draw(g, t, info) {
  const ui = S().ui, k = ease.inOut(t / info.dur), cam = { z: 1.15 + 0.12 * k, x: 0, y: V(60, 120) };
  const { GY, M } = road(g, t, cam, { cross: true, fog: 0.9 });
  layer(g, cam, 1, (g) => {
    signpost(g, E.W / 2 + 120, GY + 70, 1.0, t + 5, {});
    withBag(g, { x: E.W / 2 - 120, y: GY + 80, s: 1.3, facing: 1, outfit: YOU, pose: breathe(POSES.stand, t), expr: 'determined', look: [0.4, -0.6], rim: rimOf(M, [-0.6, -1]) });
  });
  FX.fog(g, GY - 20, 300, M.fog, 0.4);
  const tv = at(info, 110.62), te = at(info, 111.48), tp = at(info, 112.62);
  text(g, 'Em Valdória,', E.W / 2, E.H * 0.13, { size: V(64, 70), font: FONTS.serif, weight: 900, italic: true, color: ui.cream, alpha: ease.out(prog(t, tv - 0.1, tv + 0.4)), glow: 16, glowColor: alpha(ui.cream, 0.4) });
  text(g, 'toda escolha', E.W / 2, E.H * 0.2, { size: V(84, 92), font: FONTS.serif, weight: 900, italic: true, color: ui.cream, alpha: ease.out(prog(t, te - 0.1, te + 0.4)), glow: 16, glowColor: alpha(ui.cream, 0.4) });
  const kp = ease.outBack(prog(t, tp, tp + 0.5));
  if (kp > 0) { g.save(); g.translate(E.W / 2, E.H * 0.28); g.scale(0.9 + 0.1 * kp, 0.9 + 0.1 * kp); text(g, 'tem um preço.', 0, 0, { size: V(96, 104), font: FONTS.serif, weight: 900, italic: true, color: ui.gold, alpha: clamp(kp), glow: 26, glowColor: alpha(ui.gold, 0.6) }); g.restore(); }
  veil(g, '#000', ease.inOut(prog(t, info.dur - 0.9, info.dur)));
} });
