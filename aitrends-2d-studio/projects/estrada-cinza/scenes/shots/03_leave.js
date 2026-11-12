// shots/03_leave.js — s15–s26: the decision, the parents who can't know, 4 a.m., packing, the parents' door, the note you don't leave.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, radGrad, rng, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, kitchen, table, hall } from '../sets/interiors.js';
import { wt, faceShot, popLabel, money, rimOf, backpack } from '../sets/kit.js';
import { bedBg } from './01_intro.js';
import { YOU, DAD, MOM, SOLDIER } from '../cast.js';

const BAG = '#4a4038';
const ARMS_OUT = { ...POSES.stand, eF: [40, -170], hF: [80, -176], eB: [-36, -170], hB: [-76, -176] };
// figure with a backpack on its back
export function withBag(g, o) { const s = o.s ?? 1, f = o.facing ?? 1; backpack(g, o.x - f * 26 * s, o.y - 96 * s, s * 0.85, BAG); drawFigure(g, o); }

// s15 — "Você decidiu. Vai embora."
registerShot('s15', { draw(g, t, info) {
  const te = wt('embora', info, 1.4);
  faceShot(g, t, info, { who: YOU, expr: t < te - 0.2 ? 'worried' : 'determined', look: t < te - 0.2 ? [0, 0] : [-0.7, -0.1], rimSide: -1, push: 0.09, bg: bedBg({ x: -V(420, 330) }) });
} });

// s16 — "Seus pais não sabem. Não podem saber."  OTS: you (bag) in the dark, parents at the lit table
registerShot('s16', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.55 + 0.06 * k, x: -V(60, 40) + 30 * k, y: V(110, 170) };
  const { GY, M } = kitchen(g, t, cam, { lampX: -V(60, 40) });
  layer(g, cam, 1, (g) => {
    const cx = E.W / 2 - V(60, 40);
    drawFigure(g, { x: cx - 210, y: GY, s: 1.2, facing: 1, outfit: DAD, pose: breathe({ ...POSES.sit, eF: [24, -132], hF: [52, -120] }, t), expr: 'worried', look: [0.4, 0.3], rim: rimOf(M, [0.3, -1]), blink: (t % 3.4) > 3.3 });
    drawFigure(g, { x: cx + 210, y: GY, s: 1.15, facing: -1, outfit: MOM, pose: breathe({ ...POSES.sit, eF: [24, -132], hF: [50, -122] }, t, 1, 3), expr: 'sad', look: [0.2, 0.4], rim: rimOf(M, [-0.3, -1]), blink: (t % 2.9) > 2.8 });
    table(g, cx, GY, 380, M);
    circle(g, cx - 80, GY - 128, 14, '#d8d0c0'); circle(g, cx + 90, GY - 128, 14, '#d8d0c0');
  });
  // foreground: your blurred silhouette with the bag, in the dark hallway side
  blurLayer(g, 10, (g) => { withBag(g, { x: E.W * 0.12, y: E.H * 1.18, s: 3.3, facing: 1, outfit: YOU, pose: POSES.stand, expr: 'worried', rim: { color: M.rim, dir: [1, -0.4], w: 5 } }); });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s17 — "Se souberem, vão tentar te impedir."  imagined: dad blocks the door
registerShot('s17', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.06 * k, x: V(260, 200), y: V(110, 170), r: 0.015 * Math.sin(t * 1.3) };
  const { GY, M } = kitchen(g, t, cam, { lampX: V(150, 100), lamp: 0.5 });
  const dx = E.W / 2 + V(500, 300) + V(115, 110);
  layer(g, cam, 1, (g) => {
    const ki = ease.out(prog(t, 0.3, 0.8));
    drawFigure(g, { x: dx + 120, y: GY, s: 1.25, facing: -1, outfit: MOM, pose: breathe(POSES.handsOnHead, t), expr: 'scared', rim: rimOf(M, [-0.4, -1]) });
    drawFigure(g, { x: dx - 10, y: GY + 10, s: 1.55, facing: -1, outfit: DAD, pose: posesAt(t, [[0, 'stand'], [0.35, ARMS_OUT]]), expr: 'angry', talk: 0.4 * ki * Math.abs(Math.sin(t * 11)), rim: rimOf(M, [-0.4, -1]) });
    withBag(g, { x: dx - 420, y: GY + 20, s: 1.5, facing: 1, outfit: YOU, pose: breathe(POSES.sad, t), expr: 'scared', rim: rimOf(M, [0.5, -1]) });
  });
  // "imagined" treatment: cold desaturated veil + soft edge
  veil(g, '#1a2a4a', 0.25, 'source-over'); g.save(); g.fillStyle = radGrad(g, E.W / 2, E.H / 2, E.H * 0.25, E.H * 0.65, ['rgba(0,0,0,0)', 'rgba(5,8,18,.75)']); g.fillRect(0, 0, E.W, E.H); g.restore();
  popLabel(g, t, 'IMPEDIR', { at: wt('impedir', info, 1.5), y: E.H * 0.14, color: S().ui.accent, size: V(84, 92) });
} });

// s18 — "Ou pior: vão ser punidos por não te entregar."  imagined: soldiers' flashlights at the open door
registerShot('s18', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.08 * k, x: V(200, 160), y: V(110, 170), r: -0.02 };
  const { GY, M } = kitchen(g, t, cam, { lampX: -V(100, 80), lamp: 0.25, doorOpen: true });
  const dx = E.W / 2 + V(500, 300);
  veil(g, '#000', 0.3);
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 2; i++) {
      const x = dx + 20 + i * 110, sw = Math.PI * (0.88 + 0.05 * Math.sin(t * 2 + i * 2));
      drawFigure(g, { x, y: GY + 5, s: 1.45, facing: -1, outfit: SOLDIER, pose: { ...POSES.point, hF: [62, -150], eF: [32, -156] }, expr: 'angry', rim: { color: '#dfe8ff', dir: [1, -0.3] } });
      g.save(); g.globalCompositeOperation = 'lighter'; FX.lightCone(g, x - 95, GY - 220, { angle: sw, spread: 0.22, len: 1100, color: '#f0f4ff', a: 0.3 }); g.restore();
      glow(g, x - 95, GY - 220, 60, '#ffffff', 0.9);
    }
    drawFigure(g, { x: dx - 380, y: GY + 10, s: 1.45, facing: 1, outfit: DAD, pose: breathe(POSES.handsOnHead, t, 2), expr: 'scared', rim: { color: '#f0f4ff', dir: [1, 0] } });
    drawFigure(g, { x: dx - 250, y: GY + 10, s: 1.35, facing: 1, outfit: MOM, pose: breathe(POSES.handsOnHead, t, 2, 4), expr: 'cry', rim: { color: '#f0f4ff', dir: [1, 0] } });
  });
  veil(g, '#1a2a4a', 0.2); g.save(); g.fillStyle = radGrad(g, E.W / 2, E.H / 2, E.H * 0.25, E.H * 0.65, ['rgba(0,0,0,0)', 'rgba(5,8,18,.75)']); g.fillRect(0, 0, E.W, E.H); g.restore();
  popLabel(g, t, 'PUNIDOS', { at: wt('punidos', info, 1.3), y: E.H * 0.14, color: S().ui.accent, size: V(84, 92) });
} });

// s19 — "Quatro da manhã."  alarm clock 04:00
registerShot('s19', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedBg({ z: 1.8, x: V(250, 200), y: V(120, 200) })(g, t)); veil(g, '#03040a', 0.6);
  const z = 1.0 + 0.08 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.47, red = '#ff3a2e';
  g.save(); g.translate(cx, cy); g.scale(z, z);
  rr(g, -300, -150, 600, 300, 50); g.fillStyle = '#121218'; g.fill(); rr(g, -260, -110, 520, 220, 24); g.fillStyle = '#05050a'; g.fill();
  const on = (Math.floor(t * 2) % 2 === 0) || t > 1.2;
  text(g, '04', -130, 4, { size: 170, color: red, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(red, 0.8) });
  text(g, ':', 0, -10, { size: 150, color: red, font: FONTS.ui, weight: 900, alpha: on ? 1 : 0.35 });
  text(g, '00', 130, 4, { size: 170, color: red, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(red, 0.8) });
  g.restore();
  glow(g, cx, cy, 700, red, 0.15);
  FX.dust(g, t, { count: 25, color: '#ff9a90', a: 0.25 });
} });

// s20 — "A casa em silêncio."  dark hallway, you tiptoe
registerShot('s20', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.35 + 0.05 * k, x: -V(80, 60) + 40 * k, y: V(80, 140) };
  const { GY, M } = hall(g, t, cam, { doorOpen: 0.12 });
  veil(g, '#000', 0.15);
  layer(g, cam, 1, (g) => {
    const x = E.W / 2 - V(520, 380) + t * 60, ph = t * 2 * Math.PI * 0.5;
    withBag(g, { x, y: GY + 40, s: 1.15, facing: 1, outfit: YOU, pose: { ...walkPose(ph), head: [10, -200] }, expr: 'nervous', look: [0.6, 0], rim: rimOf(M, [-1, -0.4]) });
  });
  FX.dust(g, t, { count: 50, color: M.key, a: 0.3 });
} });

// s21 — "Na mochila: duas mudas de roupa, um pão duro, uma lanterna, seu documento."  top-down packing
registerShot('s21', { draw(g, t, info) {
  const ui = S().ui, M = mood('night');
  backdrop(g, [shade('#3a3a5c', -0.55), shade('#3a3a5c', -0.7)]);
  // bed sheet folds
  g.strokeStyle = alpha('#000', 0.25); g.lineWidth = 8; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(-100, 200 + i * 340); g.bezierCurveTo(300, 120 + i * 340, 700, 300 + i * 340, 1200, 180 + i * 340); g.stroke(); }
  glow(g, E.W * 0.2, E.H * 0.1, 900, M.key, 0.2);
  const z = 1 + 0.05 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H * 0.46); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.46);
  // open backpack (top-down)
  const bx = E.W / 2, by = E.H * 0.44;
  rr(g, bx - 230, by - 300, 460, 600, 120); g.fillStyle = BAG; g.fill(); rr(g, bx - 180, by - 250, 360, 500, 90); g.fillStyle = shade(BAG, -0.6); g.fill();
  rr(g, bx - 240, by - 360, 480, 90, 40); g.fillStyle = shade(BAG, -0.2); g.fill();
  const item = (word, d, x, y, draw) => { const at = wt(word, info, d), kk = ease.outBack(prog(t, at, at + 0.35)); if (kk <= 0) return; g.save(); g.translate(x, y + (1 - kk) * -120); g.scale(kk, kk); draw(g); g.restore(); };
  // 2 shirts
  item('duas', 0.9, bx - 60, by - 120, (g) => { for (const [dx, c] of [[0, '#5a6a8a'], [36, '#7a5a5a']]) { rr(g, -110 + dx, -70 + dx * 0.6, 220, 140, 14); g.fillStyle = c; g.fill(); seg(g, [[-60 + dx, -70 + dx * 0.6], [0 + dx, -40 + dx * 0.6], [60 + dx, -70 + dx * 0.6]], 6, shade(c, -0.3)); } });
  // hard bread
  item('po', 2.2, bx + 70, by + 40, (g) => { g.fillStyle = '#b07a3a'; g.beginPath(); g.ellipse(0, 0, 120, 58, -0.3, 0, Math.PI * 2); g.fill(); for (let i = -2; i <= 2; i++) seg(g, [[i * 36 - 14, -26 + i * 8], [i * 36 + 14, 22 + i * 8]], 6, '#7a4a20'); });
  // flashlight
  item('lanterna', 3.2, bx - 90, by + 160, (g) => { g.save(); g.rotate(0.5); rr(g, -110, -26, 220, 52, 18); g.fillStyle = '#2a2a34'; g.fill(); rr(g, 70, -38, 60, 76, 12); g.fillStyle = '#3a3a46'; g.fill(); circle(g, 130, 0, 30, '#fff3c0'); glow(g, 130, 0, 140, '#fff1c0', 0.5); g.restore(); });
  // ID document
  item('documento', 4.4, bx + 130, by + 220, (g) => { g.save(); g.rotate(-0.15); rr(g, -120, -80, 240, 160, 12); g.fillStyle = '#5a7a6a'; g.fill(); rr(g, -100, -60, 70, 90, 6); g.fillStyle = '#d8d0c0'; g.fill(); circle(g, -65, -30, 20, '#1a1a22'); g.fillStyle = alpha('#f0ead8', 0.8); for (let l = 0; l < 4; l++) g.fillRect(-14, -50 + l * 26, 110, 10); text(g, 'VALDÓRIA', 40, 62, { size: 18, color: '#f0ead8', font: FONTS.ui, weight: 900 }); g.restore(); });
  g.restore();
  // small labels synced to the words
  const lab = (word, d, str, y, nw, nd) => { const at = wt(word, info, d), nx = nw ? wt(nw, info, nd) : 99; if (t < at || t > nx) return; text(g, str, E.W / 2, y, { size: V(44, 52), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, at, at + 0.25)) * (1 - prog(t, nx - 0.2, nx)), glow: 14, glowColor: alpha(ui.cream, 0.4) }); };
  lab('duas', 0.9, '2 MUDAS DE ROUPA', E.H * 0.1, 'po', 2.2); lab('po', 2.2, 'PÃO DURO', E.H * 0.1, 'lanterna', 3.2); lab('lanterna', 3.2, 'LANTERNA', E.H * 0.1, 'documento', 4.4); lab('documento', 4.4, 'DOCUMENTO', E.H * 0.1);
  FX.dust(g, t, { count: 30, color: M.key, a: 0.25 });
} });

// s22 — "E todo o dinheiro que você juntou na vida."  the roll of notes goes into the bag
registerShot('s22', { draw(g, t, info) {
  const ui = S().ui, M = mood('night');
  blurLayer(g, 14, (g) => bedBg({ z: 1.9, x: -V(380, 300), y: V(150, 220) })(g, t)); veil(g, '#05060c', 0.5);
  const cx = E.W / 2, cy = E.H * 0.62, z = 1 + 0.05 * ease.inOut(t / info.dur);
  g.save(); g.translate(cx, cy); g.scale(z, z);
  // backpack mouth (front view, open)
  rr(g, -330, -200, 660, 520, 120); g.fillStyle = BAG; g.fill(); g.fillStyle = shade(BAG, -0.65); g.beginPath(); g.ellipse(0, -190, 280, 70, 0, 0, Math.PI * 2); g.fill();
  // the roll of banknotes descending
  const d = ease.inOut(prog(t, 0.6, 2.2)), ry = lerp(-620, -170, d);
  g.save(); g.beginPath(); g.rect(-400, -1200, 800, 1010 + (d > 0.85 ? 0 : 400)); g.clip();
  rr(g, -150, ry - 70, 300, 140, 60); g.fillStyle = '#7a9a7a'; g.fill(); g.strokeStyle = '#4a6a4a'; g.lineWidth = 4; for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 50, ry - 66); g.lineTo(i * 50, ry + 66); g.stroke(); }
  rr(g, -20, ry - 74, 40, 148, 8); g.fillStyle = '#b03a2a'; g.fill();
  g.restore();
  // hands (thick capsules) gripping the roll
  if (false) for (const sx of [-1, 1]) { seg(g, [[sx * 420, ry + 340], [sx * 170, ry + 20]], 70, S().ink); seg(g, [[sx * 170, ry + 20], [sx * 150, ry - 30]], 64, S().ink); seg(g, [[sx * 420, ry + 340], [sx * 170, ry + 20]], 8, alpha(M.rim, 0.5)); }
  g.restore();
  const tt = wt('todo', info, 0.3); money(g, t, 412, { y: E.H * 0.15, a: ease.out(prog(t, tt, tt + 0.4)) });
  FX.dust(g, t, { count: 30, color: ui.gold, a: 0.3 });
} });

// s23 — "Você para na porta do quarto dos seus pais."
registerShot('s23', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.6 + 0.06 * k, x: V(40, 40) + 30 * k, y: V(130, 190) };
  const { GY, M, pdx } = hall(g, t, cam, { doorOpen: 0.16 });
  layer(g, cam, 1, (g) => {
    const stop = ease.out(prog(t, 0, 1.0)), x = lerp(pdx - 340, pdx - 150, stop), walking = t < 1.0;
    const pose = walking ? walkPose(t * 2 * Math.PI * 0.55) : breathe(POSES.stand, t);
    withBag(g, { x, y: GY + 30, s: 1.55, facing: 1, outfit: YOU, pose, expr: 'sad', look: [0.7, 0], rim: rimOf(M, [-1, -0.3]), blink: (t % 3.4) > 3.3 });
  });
  FX.dust(g, t, { count: 50, color: M.key, a: 0.3 });
} });

// s24 — "Escuta a respiração deles."  through the door gap: parents asleep, blanket rising and falling
registerShot('s24', { draw(g, t, info) {
  const M = mood('night'), k = ease.inOut(t / info.dur), z = 1 + 0.06 * k;
  backdrop(g, ['#020308', '#05060c']);
  const gx = E.W * 0.5, gw = lerp(V(520, 560), V(600, 640), k);
  g.save(); g.beginPath(); g.rect(gx - gw / 2, -50, gw, E.H + 100); g.clip();
  g.save(); g.translate(E.W / 2, E.H * 0.5); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.5);
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, [shade(M.wall, -0.8), shade(M.wall, -0.6)]); g.fillRect(0, 0, E.W, E.H);
  const cx = E.W / 2, py = E.H * 0.45;
  // headboard + pillows
  rr(g, cx - 420, py - 300, 840, 200, 30); g.fillStyle = shade(M.wall, -0.75); g.fill();
  for (const dx of [-170, 170]) { rr(g, cx + dx - 150, py - 130, 300, 140, 60); g.fillStyle = shade('#c8c4dc', -0.55); g.fill(); }
  const br = Math.sin(t * 2.2), br2 = Math.sin(t * 2.2 + 1.7);
  bigFace(g, cx - 150, py - 50 - br * 4, 95, { outfit: DAD, expr: 'sleepy', rimColor: M.rim, rimSide: -1, tilt: -0.25 });
  bigFace(g, cx + 160, py - 50 - br2 * 4, 90, { outfit: MOM, expr: 'sleepy', rimColor: M.rim, rimSide: 1, tilt: 0.3 });
  // blanket (rises with breathing)
  const by = py + 40 - Math.max(br, br2) * 6;
  g.fillStyle = shade('#5a5a88', -0.4); g.beginPath(); g.moveTo(cx - 460, E.H); g.lineTo(cx - 460, by + 30); g.quadraticCurveTo(cx - 150, by - 30 - br * 10, cx, by + 10); g.quadraticCurveTo(cx + 160, by - 30 - br2 * 10, cx + 460, by + 30); g.lineTo(cx + 460, E.H); g.closePath(); g.fill();
  g.strokeStyle = alpha(M.key, 0.25); g.lineWidth = 5; g.beginPath(); g.moveTo(cx - 460, by + 30); g.quadraticCurveTo(cx - 150, by - 30 - br * 10, cx, by + 10); g.quadraticCurveTo(cx + 160, by - 30 - br2 * 10, cx + 460, by + 30); g.stroke();
  // moonlight beam
  g.save(); g.globalCompositeOperation = 'lighter'; poly(g, [[cx - 600, 0], [cx - 300, 0], [cx + 500, E.H], [cx + 100, E.H]], alpha(M.key, 0.07)); g.restore();
  FX.rings(g, cx - 150, py - 60, t, { count: 2, r0: 110, r1: 220, speed: 0.4, color: M.key, a: 0.18 });
  FX.rings(g, cx + 160, py - 60, t + 0.8, { count: 2, r0: 110, r1: 220, speed: 0.4, color: M.key, a: 0.18 });
  g.restore();
  g.restore();
  // door edges (foreground)
  g.fillStyle = '#07080e'; g.fillRect(gx + gw / 2, -50, 40, E.H + 100); g.fillStyle = alpha(M.key, 0.3); g.fillRect(gx + gw / 2, -50, 4, E.H + 100);
  g.fillStyle = '#07080e'; g.fillRect(gx - gw / 2 - 40, -50, 40, E.H + 100);
  FX.dust(g, t, { count: 30, color: M.key, a: 0.25, area: [gx - gw / 2, 0, gw, E.H] });
} });

// note on a small table, pencil in hand. write: 0..1, crumple: 0..1
function note(g, t, info, write, crumple, drop = 0) {
  const M = mood('night');
  blurLayer(g, 14, (g) => hall(g, t, { z: 1.8, x: -V(200, 160), y: V(200, 260) }, {})); veil(g, '#04050b', 0.5);
  const cx = E.W / 2, cy = E.H * 0.5, z = 1 + 0.05 * ease.inOut(t / info.dur);
  glow(g, cx, cy, 700, M.key, 0.15);
  g.save(); g.translate(cx, cy); g.scale(z, z);
  if (crumple < 1) {
    g.save(); const s = lerp(1, 0.25, ease.in(crumple)); g.scale(s, s); g.rotate(-0.08 + crumple * 1.4);
    poly(g, [[-300, -400], [300, -400], [300 - crumple * 80, 400], [-300 + crumple * 60, 400]], '#d8d2c2');
    g.save(); g.beginPath(); g.rect(-260, -340, 520 * clamp(write), 120); g.clip();
    text(g, 'Mãe, pai,', -250, -280, { size: 84, color: '#2a2a3a', font: FONTS.serif, weight: 900, italic: true, align: 'left' }); g.restore();
    g.strokeStyle = alpha('#3a4a6a', 0.25); g.lineWidth = 3; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(-260, -200 + i * 66); g.lineTo(260, -200 + i * 66); g.stroke(); }
    if (crumple > 0) { g.strokeStyle = alpha('#000', 0.35 * crumple); g.lineWidth = 6; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(-300 + i * 80, -400); g.lineTo(-200 + i * 50, 400); g.stroke(); } }
    g.restore();
  } else { circle(g, 0, 60, 120, '#cfc8b6'); g.strokeStyle = alpha('#000', 0.35); g.lineWidth = 5; for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(0, 60, 40 + i * 12, i, i + 2); g.stroke(); } }
  // hand + pencil
  const px = -250 + 520 * clamp(write) * 0.55 + Math.sin(t * 14) * 8 * (write < 1 ? 1 : 0), py = -260 + drop * 600;
  if (crumple <= 0) { seg(g, [[px + 40, py - 20], [px + 300, py - 180]], 14, '#e0b030'); seg(g, [[px, py], [px + 40, py - 20]], 10, '#2a2a2a'); seg(g, [[px + 120, py - 40], [px + 500, py + 260]], 80, S().ink); circle(g, px + 120, py - 50, 52, S().ink); }
  g.restore();
}
// s25 — "Pensa em deixar um bilhete."
registerShot('s25', { draw(g, t, info) { note(g, t, info, ease.inOut(prog(t, 0.5, info.dur - 0.2)) * 0.95, 0); } });
// s26 — "Não deixa."
registerShot('s26', { draw(g, t, info) { note(g, t, info, 0.95, ease.inOut(prog(t, 0.2, 0.75)), 0); } });
