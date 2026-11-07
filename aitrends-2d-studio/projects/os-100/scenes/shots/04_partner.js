// shots/04_partner.js — player 41, the clock hits zero, the money and the pot, 63 left, the debt, the pairs, the question.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, backdrop, linGrad } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { room, roomGround, wallBase, hole, tileQuad, tileCenter, ALARM, depthY, depthS } from '../sets/room.js';
import { faceShot, sweat, counter, chestInsert, clockInsert, mmss, speakerInsert, players, ghost, wave, bgBlur } from '../sets/kit.js';
import { P77, P41, MOM, EXTRA } from '../cast.js';
import { CROWD_A } from './01_open.js';

const wt = (w, info, d) => (wordTime(w, info.shot.start) ?? info.shot.start + d) - info.shot.start;
const rim = (M, d = [0, -1]) => ({ color: M.rim, dir: d });
const ALL_HOLES = [[3, 2, 1], [2, 1, 1], [5, 2, 1], [1, 3, 1], [4, 4, 1], [6, 1, 1], [0, 2, 1], [5, 4, 1], [2, 4, 1]];
const MED = (k = 0, x = 0) => ({ z: V(1.5, 1.5) + 0.06 * k, x, y: V(40, 150) });

// big hand with the scar (s39, s57)
function scarHand(g, cx, cy, r, sleeve, o = {}) {
  const ink = S().ink, M = mood('interiorCool');
  for (const [c, off] of [[M.rim, -6], [ink, 0]]) { g.save(); g.translate(off, off * 0.5);
    seg(g, [[cx + r * 0.5, cy + r * 0.1], [E.W + 600, cy + r * 0.9]], r * 0.42, off ? c : sleeve);
    rr(g, cx - r * 0.55, cy - r * 0.32, r * 1.15, r * 0.62, r * 0.3); g.fillStyle = c; g.fill();
    for (let i = 0; i < 4; i++) seg(g, [[cx - r * 0.2, cy - r * 0.22 + i * r * 0.15], [cx - r * 0.85, cy - r * 0.28 + i * r * 0.16]], r * 0.14, c);
    seg(g, [[cx - r * 0.1, cy + r * 0.24], [cx - r * 0.55, cy + r * 0.45]], r * 0.16, c);
    g.restore(); }
  const sc = o.scar ?? 1; seg(g, [[cx - r * 0.3, cy + r * 0.05], [cx + r * 0.25, cy - r * 0.15]], r * 0.04, alpha('#f6d8ea', 0.85 * sc));
  for (let i = 0; i < 4; i++) { const u = 0.2 + i * 0.2; const px = lerp(cx - r * 0.3, cx + r * 0.25, u), py = lerp(cy + r * 0.05, cy - r * 0.15, u); seg(g, [[px - 6, py - 10], [px + 6, py + 10]], r * 0.018, alpha('#f6d8ea', 0.7 * sc)); }
}

// s38 — "Um homem de uns 50 anos."  41 behind 77, hand over his mouth
registerShot('s38', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = MED(k, -20);
  const { M } = room(g, t, cam, { clock: '02:31' });
  layer(g, cam, 1, (g) => {
    const s = 1.85, x77 = E.W / 2 - 120, x41 = E.W / 2 + 70;
    drawFigure(g, { x: x41, y: GY - 6, s, facing: -1, outfit: P41, pose: { ...POSES.reach, hF: [64, -196], eF: [34, -170] }, expr: 'determined', rim: rim(M) });
    drawFigure(g, { x: x77, y: GY, s, facing: 1, outfit: P77, pose: breathe(POSES.stand, t, 2), expr: 'shocked', look: [1, 0], rim: rim(M) });
    UI.callout(g, t, { at: [x41 + 10, GY - 230 * s], to: [x41 + 260, GY - 230 * s - 220], str: '~50 ANOS', start: 0.7 });
  });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s39 — "Uma cicatriz na mão esquerda."
registerShot('s39', { draw(g, t, info) {
  bgBlur(g, t, 'room', { x: 200, z: 1.9 });
  const z = 1 + 0.08 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.45;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  scarHand(g, cx, cy, V(420, 460), shade(P41.color, -0.1), { scar: prog(t, 0.3, 0.8) });
  g.restore();
  const tc = wt('cicatriz', info, 0.5);
  UI.callout(g, t, { at: [cx - 20, cy - 20], to: [cx - 280, cy - 420], str: 'CICATRIZ', start: tc, color: S().ui.gold });
  FX.dust(g, t, { count: 30, color: '#ffd0e8', a: 0.3 });
} });

// s40 — "No peito, o número 41."
registerShot('s40', { draw(g, t, info) { chestInsert(g, t, info, P41, { at: wt('41', info, 1.0) - 0.1, bgx: -120 }); } });

// s41 — "Ele olha nos seus olhos e balança a cabeça."
registerShot('s41', { draw(g, t, info) {
  const ts = wt('balana', info, 1.5), shakeHead = t > ts ? Math.sin((t - ts) * 9) * 0.12 * (1 - prog(t, ts + 1.2, ts + 1.6)) : 0;
  faceShot(g, t, info, { who: P41, expr: 'determined', look: [0, 0], rimSide: 1, tilt: shakeHead, x: shakeHead * 120, push: 0.05 });
} });

// s42 — "Você engole o grito."
registerShot('s42', { draw(g, t, info) {
  faceShot(g, t, info, { who: P77, expr: t < 0.5 ? 'scared' : 'worried', talk: t < 0.4 ? 0.6 * (1 - t / 0.4) : 0, look: [0.3, 0], rimSide: -1, push: 0.04,
    over: (g, cx, cy, r) => { const k = prog(t, 0.5, 1.3); if (k > 0 && k < 1) circle(g, cx, cy + r * 1.05 + k * r * 0.4, r * 0.06, alpha(S().feature, 0.5 * Math.sin(k * Math.PI))); sweat(g, cx, cy, r, t); } });
} });

// s43 — "O relógio zera."
registerShot('s43', { draw(g, t, info) {
  clockInsert(g, t, info, (t) => (t < 0.35 ? '00:01' : '00:00'), { on: (t) => (t < 0.35 ? 1 : (Math.sin(t * 14) > 0 ? 1 : 0.25)), pulse: true });
} });

// s44 — "Parabéns aos sobreviventes. Diz a voz."  survivors among the holes
registerShot('s44', { draw(g, t, info) {
  const cam = { z: 1.05 + 0.05 * t / info.dur, y: -V(20, 40) };
  const { M } = room(g, t, cam, { holes: ALL_HOLES, clock: '00:00', voice: ease.out(prog(t, 0.2, 1)), ringColor: '#ffffff' });
  layer(g, cam, 1, (g) => {
    const crowd = [[1, 1], [4, 1], [5, 3], [6, 3], [3, 4], [0, 1], [2, 2], [4, 3], [6, 2]];
    crowd.forEach(([j, k], i) => { const [cx, cy] = tileCenter(j, k), s = 0.55 + (cy - wallBase()) / 1100;
      drawFigure(g, { x: cx, y: cy, s, facing: i % 2 ? 1 : -1, outfit: i === 4 ? P77 : i === 7 ? P41 : EXTRA(i * 11 + 2), pose: breathe(i % 3 ? POSES.stand : POSES.sad, t, 1, i), expr: i % 2 ? 'worried' : 'sad', look: [0, -1], rim: rim(M) }); });
  });
  counter(g, 63, ease.out(prog(t, 0.3, 0.6)));
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s45 — "100 mil reais foram depositados no saldo de cada um."  balance card
registerShot('s45', { draw(g, t, info) {
  const ui = S().ui; backdrop(g, [shade(ui.bpBg, -0.4), ui.bpBg]);
  const cw = V(800, 860), ch = V(560, 620), cx = (E.W - cw) / 2, cy = E.H * 0.42 - ch / 2, a = ease.out(prog(t, 0, 0.35));
  g.save(); g.globalAlpha *= a * clamp((info.dur - t) / 0.3);
  rr(g, cx, cy, cw, ch, 32); g.fillStyle = ui.card; g.fill(); g.strokeStyle = ui.cardLine; g.lineWidth = 3; g.stroke();
  text(g, 'JOGADOR 77', cx + 60, cy + 90, { size: V(40, 44), color: ui.text, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  text(g, 'SALDO', cx + 62, cy + 150, { size: V(28, 32), color: ui.sub, font: FONTS.ui, weight: 900, align: 'left', spacing: 4 });
  const td = wt('depositados', info, 1.4), p = ease.inOut(prog(t, td - 0.3, td + 0.8)), v = Math.round(lerp(0, 100000, p) / 500) * 500;
  text(g, 'R$ ' + v.toLocaleString('pt-BR'), cx + cw / 2, cy + ch * 0.62, { size: V(110, 120), color: ui.gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(ui.gold, 0.6) });
  if (p >= 1) { const k = ease.outBack(prog(t, td + 0.8, td + 1.2)); text(g, '+ DEPÓSITO', cx + cw / 2, cy + ch * 0.86, { size: V(34, 38), color: ui.good, font: FONTS.ui, weight: 900, spacing: 3, alpha: clamp(k) }); }
  g.restore();
  FX.dust(g, t, { count: 30, color: ui.gold, a: 0.3 });
} });

// s46 — "O dinheiro dos eliminados foi para o pote."  the jar fills with coins
registerShot('s46', { draw(g, t, info) {
  const ui = S().ui; backdrop(g, [shade(ui.bpBg, -0.5), ui.bpBg]);
  const cx = E.W / 2, by = E.H * 0.66, jw = V(460, 520), jh = V(620, 700), fill = ease.inOut(prog(t, 0.3, info.dur - 0.3));
  glow(g, cx, by - jh * 0.4, 600, ui.gold, 0.12 + 0.12 * fill);
  // falling coins
  for (let i = 0; i < 18; i++) { const ph = (t * 1.3 + i * 0.173) % 1, x = cx + Math.sin(i * 2.4) * jw * 0.3, y = lerp(-80, by - jh * fill * 0.85, ph);
    g.save(); g.translate(x, y); g.scale(Math.abs(Math.cos(t * 6 + i)) * 0.9 + 0.1, 1); circle(g, 0, 0, 26, ui.gold); circle(g, 0, 0, 17, shade(ui.gold, -0.3)); g.restore(); }
  // coins inside
  g.save(); rr(g, cx - jw / 2, by - jh, jw, jh, 60); g.clip();
  const top = by - jh * fill * 0.85; g.fillStyle = linGrad(g, 0, top, 0, by, [ui.gold, shade(ui.gold, -0.45)]); g.fillRect(cx - jw, top, jw * 2, jh);
  for (let r = 0; r < 14; r++) for (let c = 0; c < 9; c++) { const y = by - 20 - r * 46, x = cx - jw / 2 + 30 + c * 52 + (r % 2) * 26; if (y > top) { g.fillStyle = alpha(shade(ui.gold, 0.3), 0.6); g.beginPath(); g.ellipse(x, y, 24, 9, 0, 0, 7); g.fill(); } }
  g.restore();
  rr(g, cx - jw / 2, by - jh, jw, jh, 60); g.strokeStyle = alpha('#ffffff', 0.5); g.lineWidth = 6; g.stroke();
  g.fillStyle = alpha('#ffffff', 0.12); g.fillRect(cx - jw / 2 + 40, by - jh + 60, 26, jh - 140);
  rr(g, cx - jw / 2 - 20, by - jh - 50, jw + 40, 60, 16); g.fillStyle = shade(ui.bpBg, 0.15); g.fill();
  const v = Math.round(3700000 * fill / 100000) * 100000;
  text(g, 'POTE', cx, E.H * 0.16, { size: V(44, 50), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8 });
  text(g, 'R$ ' + v.toLocaleString('pt-BR'), cx, E.H * 0.22, { size: V(96, 108), color: ui.gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(ui.gold, 0.6) });
} });

// s47 — "E lembrem-se, só um de vocês sai daqui com tudo."  the exit door opens; one silhouette
registerShot('s47', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.35 + 0.15 * k, y: V(-40, -60) };
  const td = wt('s', info, 1.4), door = ease.inOut(prog(t, td - 0.2, td + 1.0));
  const { M, WB } = room(g, t, cam, { holes: ALL_HOLES, door, clock: null, speakers: false, lights: 0.4 });
  layer(g, cam, 0.42, (g) => {
    const s = 0.9, wk = prog(t, td + 0.6, info.dur), x = E.W / 2 + lerp(-40, 0, wk);
    if (door > 0.3) drawFigure(g, { x, y: WB - 8, s, facing: 1, outfit: EXTRA(1, { color: S().ink }), pose: walkPose(t * 6.28 * 0.9), expr: 'neutral', rim: { color: '#ffffff', dir: [0, -1], w: 6 }, alpha: prog(door, 0.3, 0.6) });
  });
  if (door > 0.4) text(g, 'SÓ UM', E.W / 2, E.H * 0.18, { size: V(90, 110), color: S().ui.gold, font: FONTS.title, weight: 700, spacing: 8, glow: 28, glowColor: alpha(S().ui.gold, 0.7), alpha: prog(door, 0.4, 0.8) * clamp((info.dur - t) / 0.3) });
  FX.dust(g, t, { count: 50, color: M.key, a: 0.35 });
} });

// s48 — "Você olha em volta."
registerShot('s48', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = MED(k, -40 + 80 * k);
  const { M } = room(g, t, cam, { holes: [[3, 3, 1]] });
  layer(g, cam, 1, (g) => {
    const f = t < 0.7 ? -1 : 1;
    drawFigure(g, { x: E.W / 2, y: GY, s: 1.85, facing: f, outfit: P77, pose: breathe(POSES.stand, t), expr: 'worried', look: [0.6, -0.1], rim: rim(M) });
  });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s49 — "Restam 63."  top-down diagram of the floor
registerShot('s49', { draw(g, t, info) {
  const ui = S().ui, M = mood('interiorCool'); backdrop(g, [shade(M.dark, -0.5), shade(M.dark, -0.3)]);
  const n = 10, sz = V(80, 92), ox = E.W / 2 - (n * sz) / 2, oy = E.H * 0.45 - (n * sz) / 2, rot = 0.04 * t, z = 1 + 0.05 * t;
  g.save(); g.translate(E.W / 2, E.H * 0.45); g.rotate(rot); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.45);
  let alive = 0, cell = 0;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const x = ox + c * sz, y = oy + r * sz, h = ((r * 7 + c * 13) % 100) < 37;
    rr(g, x + 3, y + 3, sz - 6, sz - 6, 6); g.fillStyle = h ? '#030305' : alpha(mix(M.floor, '#dfe5f2', 0.4), 0.55); g.fill();
    if (h) { glow(g, x + sz / 2, y + sz / 2, sz * 0.7, ALARM(), 0.25); }
    else { const isMe = alive === 31, isHim = alive === 33; alive++; const a = ease.out(prog(t, 0.1 + cell * 0.004, 0.4 + cell * 0.004));
      circle(g, x + sz / 2, y + sz / 2, sz * 0.22, alpha(isMe ? P77.color : isHim ? P41.color : '#e8e4f4', a)); if (isMe) FX.rings(g, x + sz / 2, y + sz / 2, t, { count: 2, r0: sz * 0.3, r1: sz * 0.8, color: P77.color, a: 0.6 }); }
    cell++; }
  g.restore();
  const tn = wt('63', info, 0.3), k = ease.outBack(prog(t, tn, tn + 0.4));
  text(g, 'RESTAM', E.W / 2, E.H * 0.1, { size: V(44, 50), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: clamp(k) });
  text(g, '63', E.W / 2, E.H * 0.17, { size: V(150, 170) * (0.85 + 0.15 * k), color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.6), alpha: clamp(k) });
} });

// s50 — "O 41 chega perto e sussurra."
registerShot('s50', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = MED(k);
  const { M } = room(g, t, cam);
  layer(g, cam, 1, (g) => {
    const s = 1.8, walk = prog(t, 0, 1.4), x41 = lerp(E.W + 160, E.W / 2 + 120, ease.out(walk));
    drawFigure(g, { x: E.W / 2 - 150, y: GY, s, facing: 1, outfit: P77, pose: breathe(POSES.stand, t), expr: 'worried', look: [1, 0], rim: rim(M) });
    drawFigure(g, { x: x41, y: GY, s, facing: -1, outfit: P41, pose: walk < 1 ? walkPose(t * 6.28 * 0.9) : posesAt(t, [[1.4, POSES.stand], [1.7, { ...POSES.stand, head: [14, -200] }]]), expr: 'smirk', rim: rim(M) });
  });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s51 — "Agora você me deve uma."  41 whispers
registerShot('s51', { draw(g, t, info) {
  faceShot(g, t, info, { who: P41, expr: t > 1.6 ? 'smirk' : 'neutral', talk: talkAmount(info.globalT, 110.68, 112.74) * 0.6, look: [-0.4, 0], rimSide: 1, x: V(80, 60), push: 0.06,
    over: (g, cx, cy, r) => { if (talkAmount(info.globalT, 110.68, 112.74) > 0) FX.rings(g, cx - r * 0.2, cy + r * 0.4, t, { count: 2, r0: r * 0.3, r1: r * 0.8, color: '#e8f0ff', a: 0.25 }); } });
} });

// s52 — "A voz volta."
registerShot('s52', { draw(g, t, info) { speakerInsert(g, t, info, { voice: ease.out(prog(t, 0.1, 0.6)), ringColor: '#ffffff', x: V(40, 30) }); } });

// pairs diagram (s53, s54)
function pairs(g, t, info, judge) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui;
  const rows = 3, gap = V(220, 300), y0 = E.H * 0.3;
  for (let r = 0; r < rows; r++) { const y = y0 + r * gap, a = ease.out(prog(t, 0.3 + r * 0.25, 0.7 + r * 0.25));
    const xa = E.W / 2 - V(170, 190), xb = E.W / 2 + V(170, 190), win = r % 2;
    g.setLineDash([10, 10]); seg(g, [[xa + 40, y - 120], [xb - 40, y - 120]], 3, alpha(c, 0.5 * a)); g.setLineDash([]);
    const wk = judge ? ease.out(prog(t, judge + r * 0.2, judge + 0.4 + r * 0.2)) : 0;
    [[xa, 0], [xb, 1]].forEach(([x, i]) => { const isWin = i === win, col = wk > 0 ? (isWin ? ui.gold : alpha(ui.accent, 1 - 0.7 * wk)) : alpha(c, a);
      UI.lineFigure(g, { x, y: y + (wk && !isWin ? wk * 30 : 0), s: 0.9, pose: wk && isWin ? POSES.cheer : POSES.stand, color: col, facing: i ? -1 : 1 });
      if (wk && isWin) glow(g, x, y - 110, 120, ui.gold, 0.3 * wk);
      if (wk && !isWin) { seg(g, [[x - 40, y - 200], [x + 40, y - 120]], 6, alpha(ui.accent, wk)); seg(g, [[x + 40, y - 200], [x - 40, y - 120]], 6, alpha(ui.accent, wk)); } });
    text(g, 'DUPLA ' + (r + 1), E.W / 2, y + 40, { size: V(28, 32), color: alpha(c, 0.8), font: FONTS.ui, weight: 900, spacing: 4, alpha: a }); }
  text(g, judge ? 'SÓ UM PASSA' : 'JOGO 2 · DUPLAS', E.W / 2, E.H * 0.13, { size: V(64, 72), color: judge ? ui.gold : ui.cream, font: FONTS.title, weight: 700, spacing: 4, glow: 20, glowColor: alpha(judge ? ui.gold : ui.cream, 0.5), alpha: ease.out(prog(t, 0.05, 0.4)) });
}
// s53 — "No próximo jogo, vocês jogarão em duplas."
registerShot('s53', { draw(g, t, info) { pairs(g, t, info, 0); } });
// s54 — "Só um de cada dupla passa."
registerShot('s54', { draw(g, t, info) { pairs(g, t + 2, info, 2 + Math.max(0.3, wt('passa', info, 1.2) - 0.3)); } });

// spotlight scene (s55, s56)
function spot(g, x, top, GY, a, M) { if (a <= 0) return; FX.lightCone(g, x, top, { angle: Math.PI / 2, spread: 0.32, len: GY - top + 200, color: '#ffffff', a: 0.22 * a }); FX.pool(g, x, GY + 10, 220, 46, '#ffffff', 0.4 * a); }
function spotScene(g, t, info, show41) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: V(1.4, 1.4) + 0.06 * k, y: V(40, 130) };
  const { M } = room(g, t, cam, { lights: 0.15 });
  veil(g, '#000', 0.35);
  const s1 = ease.out(prog(t, 0.05, 0.2)), s2 = show41 ? ease.out(prog(t, wt('41', info, 1.5) - 0.1, wt('41', info, 1.5) + 0.1)) : 0;
  const x77 = E.W / 2 - (show41 ? 190 : 0), x41 = E.W / 2 + 200;
  layer(g, cam, 1, (g) => {
    g.save(); g.globalCompositeOperation = 'lighter'; spot(g, x77, -400, GY, show41 ? 1 : s1, M); spot(g, x41, -400, GY, s2, M); g.restore();
    drawFigure(g, { x: x77, y: GY, s: 1.8, facing: 1, outfit: P77, pose: breathe(POSES.stand, t), expr: show41 ? 'worried' : 'shocked', look: show41 ? [1, 0] : [0, -1], rim: { color: '#ffffff', dir: [0, -1], w: 5 } });
    if (show41) drawFigure(g, { x: x41, y: GY, s: 1.8, facing: -1, outfit: P41, pose: breathe(POSES.crossArms, t, 1, 3), expr: 'neutral', rim: { color: '#ffffff', dir: [0, -1], w: 5 }, alpha: 0.3 + 0.7 * s2 });
    if (s2 > 0) { const p = ease.inOut(prog(t, wt('41', info, 1.5) + 0.2, wt('41', info, 1.5) + 0.9)); seg(g, [[x77 + 40, GY - 260], [lerp(x77 + 40, x41 - 40, p), GY - 260]], 6, alpha(S().ui.gold, 0.9)); glow(g, lerp(x77 + 40, x41 - 40, p), GY - 260, 60, S().ui.gold, 0.8 * p); }
  });
  text(g, '77', x77, E.H * 0.2, { size: V(90, 100), color: P77.color, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(P77.color, 0.7), alpha: s1 * (show41 ? 1 : 1) });
  if (show41) text(g, '41', x41, E.H * 0.2, { size: V(90, 100), color: P41.color, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(P41.color, 0.7), alpha: s2 });
  FX.dust(g, t, { count: 40, color: '#ffffff', a: 0.3 });
}
// s55 — "Jogador 77."
registerShot('s55', { draw(g, t, info) { spotScene(g, t, info, false); } });
// s56 — "Seu parceiro é o jogador 41."
registerShot('s56', { draw(g, t, info) { spotScene(g, t, info, true); } });

// s57 — "Ele salvou sua vida."  memory freeze of the hand
registerShot('s57', { draw(g, t, info) {
  const M = mood('interiorCool');
  bgBlur(g, 0, 'room', { x: -80 });
  const r = V(360, 400) * (1 + 0.02 * t), cx = E.W / 2 - 40, cy = E.H * 0.5;
  bigFace(g, cx, cy, r, { outfit: P77, expr: 'shocked', rimColor: M.rim, rimSide: -1, look: [0.6, 0] });
  scarHand(g, cx + r * 0.05, cy + r * 0.45, r, shade(P41.color, -0.1));
  FX.drops(g, t, { count: 40, color: '#d8e4ff', rMax: 12, drift: 3 });
  g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = 'rgba(128,128,128,.7)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  veil(g, '#8090ff', 0.08, 'lighter');
} });

// s58 — "Mas no próximo jogo, só um de vocês dois sai vivo."  facing each other, one exit
registerShot('s58', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: V(1.35, 1.35) + 0.12 * k, y: V(40, 120) };
  const { M, WB } = room(g, t, cam, { door: 0.5 + 0.5 * prog(t, 0, 1), speakers: false, lights: 0.3 });
  veil(g, ALARM(), 0.06 + 0.04 * Math.sin(t * 3), 'lighter');
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 - 250, y: GY, s: 1.75, facing: 1, outfit: P77, pose: breathe(POSES.stand, t), expr: 'worried', look: [1, 0], rim: { color: '#ffffff', dir: [0.6, -0.8] } });
    drawFigure(g, { x: E.W / 2 + 250, y: GY, s: 1.75, facing: -1, outfit: P41, pose: breathe(POSES.crossArms, t, 1, 2), expr: 'determined', look: [-1, 0], rim: { color: '#ffffff', dir: [-0.6, -0.8] } });
  });
  const tv = wt('vivo', info, 2.6), a = ease.outBack(prog(t, tv, tv + 0.4));
  if (a > 0) text(g, '1', E.W / 2, E.H * 0.22, { size: V(220, 260) * (0.8 + 0.2 * a), color: S().ui.accent, font: FONTS.ui, weight: 900, glow: 34, glowColor: alpha(S().ui.accent, 0.8), alpha: clamp(a) });
  FX.dust(g, t, { count: 40, color: '#ffc0e0', a: 0.3 });
} });

// s59 — "Você confia nele?"  41 half in shadow
registerShot('s59', { draw(g, t, info) {
  faceShot(g, t, info, { who: P41, expr: t > 0.6 ? 'smirk' : 'neutral', look: [-0.2, 0], rimSide: 1, push: 0.06, over: (g, cx, cy, r) => {
    g.save(); g.beginPath(); g.rect(-E.W, -E.H, cx - r * 0.1 + E.W, E.H * 3); g.clip(); veil(g, '#000', 0.55); g.restore(); } });
} });

// s60 — end screen: "Comente A. Se confia. B. Se não confia. A sua escolha decide o jogo 2."
registerShot('s60', { draw(g, t, info) {
  const ui = S().ui, M = mood('interiorCool');
  blurLayer(g, 18, (g) => room(g, t, { z: 1.3, y: -V(60, 120) }, { holes: ALL_HOLES, lights: 0.4 })); veil(g, '#05050c', 0.6);
  text(g, 'Você confia nele?', E.W / 2, E.H * 0.13, { size: V(76, 86), font: FONTS.serif, weight: 900, italic: true, color: ui.cream, glow: 18, glowColor: 'rgba(255,120,200,.5)', alpha: ease.out(prog(t, 0.1, 0.6)) });
  const tA = wt('a', info, 0.1), tB = wt('b', info, 1.8);
  const opt = (x, y, L, s, col, at) => { const k = ease.outBack(prog(t, at, at + 0.4)); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k);
    rr(g, -V(300, 330), -80, V(600, 660), 160, 80); g.fillStyle = alpha(col, 0.15); g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.stroke();
    circle(g, -V(220, 245), 0, 56, col); text(g, L, -V(220, 245), 4, { size: 70, color: '#0a0812', font: FONTS.ui, weight: 900 });
    text(g, s, V(45, 50), 4, { size: V(52, 58), color: col, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); };
  opt(E.W / 2, E.H * 0.25, 'A', 'CONFIA', ui.gold, tA);
  opt(E.W / 2, E.H * 0.355, 'B', 'NÃO CONFIA', ui.accent, tB);
  const GY = E.H * 0.7;
  [[P77, -170, 1, 'worried'], [P41, 170, -1, 'smirk']].forEach(([who, dx, f, ex], i) => { const k = ease.out(prog(t, 0.4 + i * 0.15, 0.9 + i * 0.15));
    drawFigure(g, { x: E.W / 2 + dx * 1.3, y: GY + (1 - k) * 40, s: 2.2, facing: f, outfit: who, pose: breathe(i ? POSES.crossArms : POSES.stand, t, 1, i), expr: ex, alpha: k, rim: { color: M.rim, dir: [0, -1] } }); });
  const tj = wt('jogo', info, 4.5), kj = ease.outBack(prog(t, tj, tj + 0.4));
  if (kj > 0) text(g, 'JOGO 2', E.W / 2, E.H * 0.82, { size: V(100, 120) * (0.85 + 0.15 * kj), color: ui.gold, font: FONTS.title, weight: 700, spacing: 10, glow: 30, glowColor: alpha(ui.gold, 0.7), alpha: clamp(kj) * clamp((info.dur - t) / 0.6) });
  FX.dust(g, t, { count: 40, color: '#ffc0e0', a: 0.3 });
} });
