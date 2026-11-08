// shots/03_offer.js — the hidden rule, the weight of the empty booth, 200 mil, the Voice's offer, the question.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, backdrop, linGrad } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { room, roomGround, ALARM } from '../sets/room.js';
import { faceShot, sweat, counter, speakerInsert, ghost, wave } from '../sets/kit.js';
import { cabins, cabinGlassAll, cabinGeo, boothInterior, boothGlass, redButton, BTN_RED } from '../sets/booth.js';
import { P77, P41, EXTRA } from '../cast.js';
import { wt } from './01_choice.js';

const boothBg = (o = {}) => (g, t) => cabins(g, t, { z: o.z ?? 1.5, x: o.x ?? 0, y: o.y ?? V(60, 120) }, o);

// s42 — "Agora, a regra que vocês não ouviram."  REGRA OCULTA, a padlock opens
registerShot('s42', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, cx = E.W / 2, cy = E.H * 0.47, z = 1 + 0.05 * t;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  const open = ease.outBack(prog(t, wt('regra', info, 1.0), wt('regra', info, 1.0) + 0.5));
  rr(g, cx - 170, cy - 60, 340, 260, 30); g.strokeStyle = c; g.lineWidth = 10; g.stroke();
  g.strokeStyle = c; g.lineWidth = 14; g.beginPath(); g.arc(cx, cy - 60 - open * 70, 110, Math.PI, 0); g.lineTo(cx + 110, cy - 60 - open * 70 + (open > 0.2 ? -10 : 40)); g.stroke();
  circle(g, cx, cy + 50, 26, c); seg(g, [[cx, cy + 60], [cx, cy + 120]], 14, c);
  if (open > 0.3) glow(g, cx, cy + 60, 260, ui.gold, 0.25 * clamp(open));
  g.restore();
  text(g, 'REGRA OCULTA', cx, E.H * 0.2, { size: V(84, 96), color: ui.gold, font: FONTS.title, weight: 700, spacing: 6, glow: 26, glowColor: alpha(ui.gold, 0.6), alpha: ease.out(prog(t, 0.2, 0.6)) });
} });

// s43 — "Se ninguém apertasse, os dois passariam."  both hold, both pass
registerShot('s43', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui, tr = wt('passariam', info, 2.4);
  const xs = [E.W / 2 - V(250, 250), E.W / 2 + V(250, 250)], fy = E.H * 0.6, bw = V(300, 400), bh = V(520, 720);
  xs.forEach((x, i) => {
    const win = t > tr; g.strokeStyle = alpha(win ? ui.gold : c, 0.8); g.lineWidth = 4; g.strokeRect(x - bw / 2, fy - bh, bw, bh);
    const bxp = x + (i ? -1 : 1) * bw * 0.28; seg(g, [[bxp, fy], [bxp, fy - 190]], 6, alpha(c, 0.8)); circle(g, bxp, fy - 200, 26, alpha(BTN_RED, 0.6));
    UI.lineFigure(g, { x: x - (i ? -1 : 1) * bw * 0.12, y: fy - 6, s: 1.5, pose: win ? POSES.cheer : POSES.crossArms, color: win ? ui.gold : c, facing: i ? -1 : 1 });
    if (win) { const k = ease.outBack(prog(t, tr, tr + 0.35)); g.save(); g.translate(x, fy - bh - 90); g.scale(k, k); ring(g, 0, 0, 56, 7, ui.gold); seg(g, [[-26, 2], [-6, 22], [28, -20]], 9, ui.gold); glow(g, 0, 0, 120, ui.gold, 0.35); g.restore(); }
  });
  text(g, 'NINGUÉM APERTA', E.W / 2, E.H * 0.13, { size: V(56, 64), color: ui.cream, font: FONTS.title, weight: 700, spacing: 4, glow: 18, glowColor: alpha(ui.cream, 0.5), alpha: ease.out(prog(t, 0.05, 0.4)) });
  if (t > tr) text(g, 'OS DOIS PASSAM', E.W / 2, E.H * 0.7, { size: V(58, 66), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, glow: 20, glowColor: alpha(ui.gold, 0.6), alpha: ease.out(prog(t, tr + 0.1, tr + 0.4)) });
} });

// s44 — "O ar some do seu peito."  breath pulled away
registerShot('s44', { draw(g, t, info) {
  faceShot(g, t, info, { who: P77, expr: 'shocked', look: [0, 0.2], rimSide: -1, push: 0.08, bg: boothBg({ z: 1.8, x: -V(250, 230) }),
    over: (g, cx, cy, r) => { for (let i = 0; i < 24; i++) { const ph = (t * 0.7 + i * 0.041) % 1, a = (i * 2.39996), d = r * (0.5 + ph * 1.6); circle(g, cx + Math.cos(a) * d, cy + r * 0.45 + Math.sin(a) * d * 0.6 - ph * r * 0.5, 4 + (1 - ph) * 5, alpha('#cfe6ff', 0.6 * (1 - ph))); } } });
} });

// s45 — "Este jogo nunca foi sobre o botão."  the button dims and cracks
registerShot('s45', { draw(g, t, info) {
  blurLayer(g, 12, boothBg({ z: 2.2, x: -V(250, 230), y: V(250, 300) })); veil(g, '#05050b', 0.4);
  const z = 1.08 - 0.06 * ease.inOut(t / info.dur), bx = E.W / 2, by = E.H * 0.52, tb = wt('boto', info, 1.6);
  g.save(); g.translate(bx, by); g.scale(z, z); g.translate(-bx, -by);
  redButton(g, bx, by, 4.4, { floor: E.H * 1.3, dim: ease.inOut(prog(t, 0.4, tb + 0.3)), crack: ease.out(prog(t, tb, tb + 0.25)) });
  g.restore();
  veil(g, '#000', 0.25 * prog(t, 0.4, info.dur));
} });

// s46 — "Foi sobre confiança."  empty booth, the handprint glows on the glass
registerShot('s46', { draw(g, t, info) {
  const cam = { z: V(1.55, 1.7) + 0.06 * t / info.dur, x: V(240, 230), y: V(60, 110) };
  const geo = cabins(g, t, cam, { lightR: 0.5, dimR: 1 }), { M, R, GY } = geo;
  cabinGlassAll(g, t, cam, geo, { lightR: 0.5 });
  layer(g, cam, 1, (g) => {
    const a = ease.out(prog(t, 0.2, 1.0)), hx = R.x0 + 10, hy = GY - V(420, 470), r = 60;
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha *= a;
    circle(g, hx, hy + r * 0.25, r * 0.55, alpha(M.key, 0.5)); [-0.5, -0.17, 0.17, 0.5].forEach((q, i) => seg(g, [[hx + q * r * 0.7, hy], [hx + q * r * 0.95, hy - r * (0.85 + (i === 1 || i === 2 ? 0.15 : 0))]], r * 0.2, alpha(M.key, 0.5)));
    seg(g, [[hx - r * 0.45, hy + r * 0.35], [hx - r * 0.95, hy + r * 0.05]], r * 0.2, alpha(M.key, 0.5)); glow(g, hx, hy, r * 3, M.key, 0.35);
    g.restore();
  });
  const ui = S().ui, tc = wt('confiana', info, 0.5);
  text(g, 'CONFIANÇA', E.W / 2, E.H * 0.16, { size: V(90, 104), color: ui.gold, font: FONTS.title, weight: 700, spacing: 8, glow: 26, glowColor: alpha(ui.gold, 0.6), alpha: ease.out(prog(t, tc, tc + 0.4)) });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// money card helper
function balance(g, t, info, o) {
  const ui = S().ui; backdrop(g, [shade(ui.bpBg, -0.4), ui.bpBg]);
  const cw = V(800, 860), ch = V(560, 620), cx = (E.W - cw) / 2, cy = (o.y ?? E.H * 0.5) - ch / 2, a = ease.out(prog(t, 0, 0.35));
  g.save(); g.globalAlpha *= a;
  rr(g, cx, cy, cw, ch, 32); g.fillStyle = ui.card; g.fill(); g.strokeStyle = ui.cardLine; g.lineWidth = 3; g.stroke();
  text(g, 'JOGADOR 77', cx + 60, cy + 90, { size: V(40, 44), color: ui.text, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  text(g, 'SALDO', cx + 62, cy + 150, { size: V(28, 32), color: ui.sub, font: FONTS.ui, weight: 900, align: 'left', spacing: 4 });
  const v = Math.round(o.value(t) / 1000) * 1000;
  text(g, 'R$ ' + v.toLocaleString('pt-BR'), cx + cw / 2, cy + ch * 0.6, { size: V(110, 120) * (o.scale || 1), color: o.color || ui.gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(o.color || ui.gold, 0.6) });
  if (o.sub) text(g, o.sub.str, cx + cw / 2, cy + ch * 0.84, { size: V(38, 42), color: o.sub.color, font: FONTS.ui, weight: 900, spacing: 3, alpha: o.sub.a });
  g.restore();
  FX.dust(g, t, { count: 30, color: ui.gold, a: 0.3 });
}
// s47 — "Restam vinte, mais cem mil no seu saldo."
registerShot('s47', { draw(g, t, info) {
  const ui = S().ui, tm = wt('cem', info, 1.6);
  balance(g, t, info, { y: E.H * 0.58, value: (t) => lerp(100000, 200000, ease.inOut(prog(t, tm, tm + 0.9))), sub: { str: '+ R$ 100.000', color: ui.good, a: ease.out(prog(t, tm, tm + 0.3)) } });
  const tv = wt('vinte', info, 0.4), k = ease.outBack(prog(t, tv, tv + 0.4));
  text(g, 'RESTAM', E.W / 2, E.H * 0.13, { size: V(44, 50), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: clamp(k) });
  text(g, '20', E.W / 2, E.H * 0.21, { size: V(150, 170) * (0.85 + 0.15 * k), color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.6), alpha: clamp(k) });
} });
// s48 — "Duzentos mil reais."
registerShot('s48', { draw(g, t, info) { balance(g, t, info, { value: () => 200000, scale: 1 + 0.06 * ease.outBack(prog(t, 0.2, 0.6)) }); } });

// s49 — "E nenhum deles pesa tanto quanto aquela cabine vazia."  the scale tips toward the empty booth
registerShot('s49', { draw(g, t, info) {
  const ui = S().ui, M = mood('interiorCool'); backdrop(g, [shade(M.dark, -0.6), shade(M.dark, -0.35)]);
  const tv = wt('vazia', info, 2.6), tilt = -0.08 + 0.3 * ease.inOut(prog(t, tv - 1.2, tv + 0.4));
  const cx = E.W / 2, py = E.H * 0.3, arm = V(380, 310);
  seg(g, [[cx, py], [cx, E.H * 0.72]], 14, shade(M.rim, -0.3)); rr(g, cx - 140, E.H * 0.72, 280, 24, 10); g.fillStyle = shade(M.rim, -0.3); g.fill();
  const lx = cx - Math.cos(tilt) * arm, ly = py - Math.sin(tilt) * arm, rx = cx + Math.cos(tilt) * arm, ry = py + Math.sin(tilt) * arm;
  seg(g, [[lx, ly], [rx, ry]], 12, M.rim); circle(g, cx, py, 18, M.rim);
  const pan = (x, y, fill) => { seg(g, [[x, y], [x - 110, y + 220]], 3, alpha(M.rim, 0.7)); seg(g, [[x, y], [x + 110, y + 220]], 3, alpha(M.rim, 0.7)); g.fillStyle = shade(M.rim, -0.4); g.beginPath(); g.ellipse(x, y + 224, 130, 20, 0, 0, Math.PI); g.fill(); fill(x, y + 220); };
  pan(lx, ly, (x, y) => { for (let r = 0; r < 4; r++) for (let c = 0; c <= 3 - r; c++) { const px = x - (3 - r) * 28 + c * 56, pyy = y - r * 30; g.fillStyle = ui.gold; g.beginPath(); g.ellipse(px, pyy, 27, 10, 0, 0, 7); g.fill(); g.fillStyle = shade(ui.gold, -0.3); g.fillRect(px - 27, pyy, 54, 9); } text(g, 'R$ 200.000', x, y + 90, { size: V(36, 40), color: ui.gold, font: FONTS.ui, weight: 900 }); });
  pan(rx, ry, (x, y) => { const w = 110, h = 170; g.fillStyle = alpha('#9fe0ff', 0.12); g.fillRect(x - w / 2, y - h, w, h); g.strokeStyle = M.rim; g.lineWidth = 5; g.strokeRect(x - w / 2, y - h, w, h); seg(g, [[x - 25, y - h + 10], [x + 25, y - h + 10]], 5, M.key); glow(g, x, y - h + 10, 90, M.key, 0.3); text(g, 'VAZIA', x, y + 90, { size: V(36, 40), color: ui.accent, font: FONTS.ui, weight: 900 }); });
  FX.dust(g, t, { count: 30, color: M.key, a: 0.3 });
} });

// s50 — "Então, a voz fala só com você."  77 alone in the dark, rings only around him
registerShot('s50', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: V(1.45, 1.45) + 0.1 * k, y: V(40, 140) };
  const { M } = room(g, t, cam, { lights: 0.05, speakers: false }); veil(g, '#000', 0.55);
  layer(g, cam, 1, (g) => {
    FX.rings(g, E.W / 2, GY - 230, t, { count: 4, r0: 120, r1: 520, speed: 0.6, color: '#ffffff', a: 0.4 * ease.out(prog(t, 0.3, 1.0)), w: 3 });
    drawFigure(g, { x: E.W / 2, y: GY, s: 1.9, facing: 1, outfit: P77, pose: breathe(POSES.stand, t), expr: 'worried', look: [0, -0.8], rim: { color: '#ffffff', dir: [0, -1], w: 5 } });
  });
  FX.dust(g, t, { count: 40, color: '#ffffff', a: 0.25 });
} });
// s51 — "Jogador 77."  the spotlight slams
registerShot('s51', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: V(1.45, 1.45) + 0.06 * k, y: V(40, 140) };
  room(g, t, cam, { lights: 0.05, speakers: false }); veil(g, '#000', 0.5);
  const s1 = ease.out(prog(t, 0.05, 0.2));
  layer(g, cam, 1, (g) => {
    g.save(); g.globalCompositeOperation = 'lighter'; FX.lightCone(g, E.W / 2, -400, { angle: Math.PI / 2, spread: 0.3, len: GY + 600, color: '#ffffff', a: 0.22 * s1 }); FX.pool(g, E.W / 2, GY + 10, 220, 46, '#ffffff', 0.45 * s1); g.restore();
    drawFigure(g, { x: E.W / 2, y: GY, s: 1.9, facing: 1, outfit: P77, pose: breathe(POSES.stand, t), expr: 'shocked', look: [0, -1], rim: { color: '#ffffff', dir: [0, -1], w: 5 } });
  });
  text(g, '77', E.W / 2, E.H * 0.2, { size: V(100, 120), color: P77.color, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(P77.color, 0.7), alpha: s1 });
} });
// s52 — "Uma oferta."
registerShot('s52', { draw(g, t, info) {
  const ui = S().ui;
  speakerInsert(g, t, info, { voice: 1, ringColor: '#ffffff', over: () => { const k = ease.outBack(prog(t, 0.15, 0.5)); if (k > 0) text(g, 'OFERTA', E.W / 2, E.H * 0.74, { size: V(100, 120) * (0.85 + 0.15 * k), color: ui.gold, font: FONTS.title, weight: 700, spacing: 10, glow: 28, glowColor: alpha(ui.gold, 0.7), alpha: clamp(k) }); } });
} });
// s53 — "Entregue todo o seu dinheiro"
registerShot('s53', { draw(g, t, info) {
  const ui = S().ui;
  balance(g, t, info, { value: (t) => lerp(200000, 0, ease.inOut(prog(t, 0.6, info.dur - 0.2))), color: mix(ui.gold, ui.accent, prog(t, 0.6, info.dur - 0.2)), sub: { str: 'ENTREGAR TUDO?', color: ui.accent, a: ease.out(prog(t, 0.4, 0.7)) } });
} });
// s54 — "e descubra se o 41 está vivo."  empty booth, a ghostly 41, VIVO?
registerShot('s54', { draw(g, t, info) {
  const cam = { z: V(1.55, 1.7) + 0.08 * ease.inOut(t / info.dur), x: V(240, 230), y: V(60, 110) };
  const geo = cabins(g, t, cam, { lightR: 0.45, dimR: 1 }), { M, R, GY } = geo;
  layer(g, cam, 1, (g) => ghost(g, { x: R.fig, y: GY, s: 1.75, facing: -1, outfit: P41, pose: POSES.stand, expr: 'neutral', color: P41.color, a: 0.35 + 0.25 * Math.sin(t * 3) }));
  cabinGlassAll(g, t, cam, geo, { lightR: 0.45 });
  const ui = S().ui, tv = wt('vivo', info, 2.0), k = ease.outBack(prog(t, tv, tv + 0.4));
  if (k > 0) text(g, 'VIVO?', E.W / 2, E.H * 0.16, { size: V(120, 140) * (0.85 + 0.15 * k), color: P41.color, font: FONTS.title, weight: 700, spacing: 8, glow: 30, glowColor: alpha(P41.color, 0.7), alpha: clamp(k) });
  FX.dust(g, t, { count: 40, color: P41.color, a: 0.3 });
} });
// s55 — "O que você faz?"
registerShot('s55', { draw(g, t, info) { faceShot(g, t, info, { who: P77, expr: 'thinking', rimSide: -1, push: 0.06, bg: boothBg({ z: 1.8, x: -V(250, 230) }) }); } });

// s56 — end screen
registerShot('s56', { draw(g, t, info) {
  const ui = S().ui, M = mood('interiorCool');
  blurLayer(g, 18, boothBg({ z: 1.2, lightR: 0.4, dimR: 1 })); veil(g, '#05050c', 0.6);
  text(g, 'O que você faz?', E.W / 2, E.H * 0.12, { size: V(80, 90), font: FONTS.serif, weight: 900, italic: true, color: ui.cream, glow: 18, glowColor: 'rgba(255,120,200,.5)', alpha: ease.out(prog(t, 0.1, 0.6)) });
  const tA = wt('a', info, 0.1), tB = wt('b', info, 4.0);
  const opt = (y, L, l1, l2, col, at) => { const k = ease.outBack(prog(t, at, at + 0.4)); if (k <= 0) return; g.save(); g.translate(E.W / 2, y); g.scale(k, k);
    rr(g, -V(330, 360), -100, V(660, 720), 200, 60); g.fillStyle = alpha(col, 0.15); g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.stroke();
    circle(g, -V(255, 275), 0, 58, col); text(g, L, -V(255, 275), 4, { size: 72, color: '#0a0812', font: FONTS.ui, weight: 900 });
    text(g, l1, V(50, 55), -30, { size: V(46, 52), color: col, font: FONTS.ui, weight: 900, spacing: 2 }); text(g, l2, V(50, 55), 34, { size: V(30, 34), color: alpha(ui.cream, 0.85), font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); };
  opt(E.H * 0.255, 'A', 'ENTREGA TUDO', 'PARA SABER A VERDADE', ui.gold, tA);
  opt(E.H * 0.385, 'B', 'GUARDA O DINHEIRO', 'E SEGUE EM FRENTE', ui.accent, tB);
  const GY = E.H * 0.74, k = ease.out(prog(t, 0.4, 0.9));
  drawFigure(g, { x: E.W / 2 - 200, y: GY + (1 - k) * 40, s: 2.1, facing: 1, outfit: P77, pose: breathe(POSES.think, t), expr: 'thinking', alpha: k, rim: { color: M.rim, dir: [0, -1] } });
  const bx = E.W / 2 + 230, bw = 230, bh = 520;
  g.fillStyle = alpha('#9fe0ff', 0.08 * k); g.fillRect(bx - bw / 2, GY - bh, bw, bh); g.strokeStyle = alpha(M.rim, k); g.lineWidth = 8; g.strokeRect(bx - bw / 2, GY - bh, bw, bh);
  seg(g, [[bx - 60, GY - bh + 16], [bx + 60, GY - bh + 16]], 8, alpha(M.key, 0.5 * k)); glow(g, bx, GY - bh + 16, 160, M.key, 0.25 * k);
  ghost(g, { x: bx, y: GY - 6, s: 1.7, facing: -1, outfit: P41, pose: POSES.stand, expr: 'neutral', color: P41.color, a: 0.3 * k });
  text(g, '?', bx, GY - bh - 90, { size: 140, color: P41.color, font: FONTS.title, weight: 700, glow: 26, glowColor: alpha(P41.color, 0.7), alpha: k });
  FX.dust(g, t, { count: 40, color: '#ffc0e0', a: 0.3 });
} });
