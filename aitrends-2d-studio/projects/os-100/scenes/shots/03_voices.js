// shots/03_voices.js — the clock starts, the voices play, the floor takes the weak, your mother's voice, the hand.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { room, roomGround, wallBase, hole, tileQuad, tileCenter, ALARM, depthY, depthS } from '../sets/room.js';
import { faceShot, sweat, counter, clockInsert, mmss, speakerInsert, players, ghost, wave, bgBlur } from '../sets/kit.js';
import { P77, P41, MOM, EXTRA } from '../cast.js';
import { CROWD_A } from './01_open.js';

const wt = (w, info, d) => (wordTime(w, info.shot.start) ?? info.shot.start + d) - info.shot.start;
const rim = (M, d = [0, -1]) => ({ color: M.rim, dir: d });
const VOICE = ['#ff9ad0', '#9fe0ff', '#ffd47e', '#c9a8ff'];

// s19 — "Na parede, um relógio acende."
registerShot('s19', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.25 + 0.12 * k, y: -V(380, 520) };
  const on = t < 0.4 ? 0 : t < 0.8 ? (Math.sin(t * 70) > 0.2 ? 1 : 0.1) : 1;
  const { M } = room(g, t, cam, { clock: '10:00', clockOn: on, lights: 0.6 });
  layer(g, cam, 1, (g) => players(g, t, CROWD_A.slice(0, 6).map(p => ({ ...p, look: [0, -1], expr: on > 0.5 ? 'surprised' : 'worried' })), M, { s: 1.6 }));
  veil(g, ALARM(), 0.07 * on, 'lighter');
  FX.dust(g, t, { count: 40, color: '#ffb0d0', a: 0.3 });
} });

// s20 — "10 minutos."  countdown starts
registerShot('s20', { draw(g, t, info) { clockInsert(g, t, info, (t) => mmss(600 - Math.max(0, t - 0.6))); } });

// s21 — "Ninguém se mexe."  row of frozen players
registerShot('s21', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: V(1.35, 1.35), x: -V(80, 60) + V(160, 120) * k, y: V(40, 130) };
  const { M } = room(g, t, cam, { clock: '09:47' });
  layer(g, cam, 1, (g) => {
    const row = [[-140, EXTRA(14), 1], [150, EXTRA(66), -1], [430, P77, 1], [700, EXTRA(9), -1], [980, EXTRA(38), -1], [1240, EXTRA(81), 1]];
    row.forEach(([x, who, f], i) => drawFigure(g, { x, y: GY - (i % 2) * 40, s: 1.55 - (i % 2) * 0.1, facing: f, outfit: who, pose: [POSES.stand, POSES.crossArms, POSES.stand, POSES.relaxed, POSES.stand, POSES.crossArms][i], expr: who === P77 ? 'nervous' : ['worried', 'scared', 'nervous'][i % 3], rim: rim(M), blink: false }));
  });
  FX.dust(g, t, { count: 50, color: M.key, a: 0.35 });
} });

// s22 — "Ninguém respira alto."  an anonymous player holding his breath
registerShot('s22', { draw(g, t, info) {
  faceShot(g, t, info, { who: EXTRA(66), expr: 'nervous', look: [-0.3, 0], rimSide: 1, x: V(60, 40), push: 0.06, over: (g, cx, cy, r) => { sweat(g, cx, cy, r, t); seg(g, [[cx - r * 0.22, cy + r * 0.42], [cx + r * 0.22, cy + r * 0.42]], r * 0.09, S().feature); } });
} });

// s23 — "Então, os alto-falantes começam a tocar vozes."  coloured voices pour out of the speakers
registerShot('s23', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.35 - 0.2 * k, y: -V(300, 420) * (1 - k) - V(60, 100) };
  const { M, WB } = room(g, t, cam, { voice: 0.8, ringColor: VOICE[0], clock: '09:12' });
  layer(g, cam, 0.4, (g) => {
    for (const dx of [-1, 1]) { const sx = E.W / 2 + dx * V(560, 330), sy = WB - V(520, 640);
      VOICE.forEach((c, i) => wave(g, sx + dx * (160 + i * 30), sy + (i - 1.5) * 70, 220, 22, t + i, c, 0.8 * prog(t, 0.3 + i * 0.2, 0.8 + i * 0.2), 2 + i)); }
  });
  layer(g, cam, 1, (g) => players(g, t, CROWD_A.map((p, i) => ({ ...p, expr: i % 3 ? 'scared' : 'shocked', look: [0, -0.6] })), M, { s: 1.6 }));
  FX.dust(g, t, { count: 40, color: '#ffc0e0', a: 0.3 });
} });

// s24 — "Vozes conhecidas."
registerShot('s24', { draw(g, t, info) {
  faceShot(g, t, info, { who: P77, expr: 'shocked', look: [0.3, -0.2], rimSide: -1, push: 0.08, under: (g, cx, cy, r) => VOICE.forEach((c, i) => wave(g, cx + (i % 2 ? 1 : -1) * r * 1.05, cy - r * 0.6 + i * r * 0.4, r * 0.8, 24, t + i, c, 0.7, 2 + i)) });
} });

// s25 — "Uma criança, chamando pelo pai."  a father trembles; a ghost child calls behind him
registerShot('s25', { draw(g, t, info) {
  const GY = roomGround(), cam = { z: V(1.45, 1.4) + 0.05 * t / info.dur, x: V(40, 30), y: V(40, 150) };
  const { M } = room(g, t, cam, { voice: 0.5, ringColor: VOICE[1] });
  layer(g, cam, 1, (g) => {
    const tw = (Math.sin(t * 30) * 2);
    ghost(g, { x: E.W / 2 - 230, y: GY - 30, s: 1.45, facing: 1, outfit: { kid: true, top: 'tshirt', color: '#9fe0ff', head: 'curly' }, pose: posesAt(t, [[0, POSES.wave], [0.8, POSES.reach]]), expr: 'cry', talk: talkAmount(info.globalT, 54.2, 55.9), color: VOICE[1], a: ease.out(prog(t, 0, 0.5)) });
    drawFigure(g, { x: E.W / 2 + 170 + tw, y: GY, s: 1.7, facing: -1, outfit: EXTRA(29), pose: breathe(POSES.sad, t, 2), expr: 'cry', rim: rim(M), look: [-1, 0] });
  });
  FX.dust(g, t, { count: 40, color: VOICE[1], a: 0.3 });
} });

// s26 — "Uma mulher chorando um nome."
registerShot('s26', { draw(g, t, info) {
  const GY = roomGround(), cam = { z: V(1.5, 1.45) + 0.06 * t / info.dur, x: -V(30, 20), y: V(40, 150) };
  const { M } = room(g, t, cam, { voice: 0.5, ringColor: VOICE[0] });
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 + 20, y: GY, s: 1.8, facing: 1, outfit: EXTRA(45, { head: 'ponytail' }), pose: breathe(posesAt(t, [[0, POSES.sad], [0.4, POSES.handsOnHead]]), t, 2), expr: 'cry', rim: rim(M) });
    wave(g, E.W / 2 + 330, GY - 520, 260, 30, t, VOICE[0], 0.8, 3);
  });
  FX.dust(g, t, { count: 40, color: VOICE[0], a: 0.3 });
} });

// s27 — "Um homem perto da parede soluça."  small red rings: sound!
registerShot('s27', { draw(g, t, info) {
  const GY = roomGround(), cam = { z: V(1.25, 1.2), x: V(160, 120) + 30 * t / info.dur, y: V(0, 40) };
  const { M, WB } = room(g, t, cam);
  layer(g, cam, 1, (g) => {
    const x = E.W / 2 + 180, y = depthY(0.25), s = depthS(0.25, 1.9);
    const sob = Math.abs(Math.sin(t * 7)) * 6;
    drawFigure(g, { x, y: y + sob * 0.3, s, facing: -1, outfit: EXTRA(17), pose: breathe(POSES.sad, t, 3), expr: 'cry', rim: rim(M) });
    FX.rings(g, x - 10, y - 200 * s, t, { count: 3, r0: 30, r1: 140, color: ALARM(), a: 0.6 * prog(t, 0.6, 1.2), w: 3 });
    players(g, t, [{ x: E.W / 2 - 200, d: 0.9, who: EXTRA(40), facing: 1, expr: 'scared', look: [1, -0.3] }], M, { s: 1.5 });
  });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s28 — "O piso embaixo dele se abre e ele some."
registerShot('s28', { draw(g, t, info) {
  const GY = roomGround(), tOpen = wt('abre', info, 1.5);
  const [sx, sy] = t > tOpen ? shake(t, 16 * (1 - prog(t, tOpen, tOpen + 1)), 18) : [0, 0];
  const cam = { z: V(1.55, 1.5) + 0.05 * t / info.dur, x: V(40, 30) + sx, y: V(40, 150) + sy };
  const { M } = room(g, t, cam);
  layer(g, cam, 1, (g) => {
    const x = E.W / 2 + 40, open = ease.out(prog(t, tOpen, tOpen + 0.25));
    const q = [[x - 130, GY - 22], [x + 130, GY - 22], [x + 150, GY + 36], [x - 150, GY + 36]];
    hole(g, q, open, t);
    const fall = Math.max(0, t - tOpen - 0.08), dy = 0.5 * 2600 * fall * fall;
    g.save(); g.beginPath(); g.rect(-E.W, -E.H, E.W * 3, GY + 36 + E.H); g.clip();
    drawFigure(g, { x, y: GY + dy, s: 1.7, facing: -1, outfit: EXTRA(17), pose: t < tOpen ? breathe(POSES.sad, t, 3) : POSES.fall, expr: t < tOpen ? 'cry' : 'shocked', rim: rim(M), shadow: t < tOpen });
    g.restore();
    if (t > tOpen) glow(g, x, GY, 300, ALARM(), 0.4 * (1 - prog(t, tOpen + 0.5, info.dur)));
  });
  if (t > tOpen) veil(g, ALARM(), 0.12 * (1 - prog(t, tOpen, tOpen + 0.8)), 'lighter');
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s29 — "Depois outro e outro."  holes open across the hall; the counter drops
const HOLES = [[2, 1, 0.15], [5, 2, 0.5], [1, 3, 0.85], [4, 4, 1.15], [6, 1, 1.4], [3, 2, 1.6]];
registerShot('s29', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.05 * t / info.dur, y: -V(40, 60) };
  const holes = [[3, 2, 1]].concat(HOLES.map(([j, k, at]) => [j, k, ease.out(prog(t, at, at + 0.2))]));
  const { M } = room(g, t, cam, { holes, clock: '06:31' });
  layer(g, cam, 1, (g) => {
    const crowd = [[1, 1], [2, 3], [4, 1], [5, 3], [0, 2], [6, 3], [3, 4], [2, 1], [5, 2], [1, 3], [4, 4], [6, 1]];
    crowd.forEach(([j, k], i) => { const h = HOLES.find(([a, b]) => a === j && b === k); const [cx, cy] = tileCenter(j, k);
      const fall = h ? Math.max(0, t - h[2] - 0.05) : 0; if (fall > 0.5) return; const s = 0.55 + (cy - wallBase()) / 1100;
      g.save(); if (h) { g.beginPath(); g.rect(-E.W, -E.H, E.W * 3, cy + 40 * s + E.H); g.clip(); }
      drawFigure(g, { x: cx, y: cy + 0.5 * 2600 * fall * fall, s, facing: i % 2 ? 1 : -1, outfit: EXTRA(i * 7 + 3), pose: fall > 0 ? POSES.fall : breathe(POSES.stand, t, 1, i), expr: 'scared', rim: rim(M), shadow: fall === 0 });
      g.restore(); });
  });
  const n = 99 - HOLES.filter(([, , at]) => t > at).length - Math.floor(prog(t, 1.7, info.dur) * 3);
  counter(g, n, ease.out(prog(t, 0.05, 0.3)));
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s30 — "Faltam 3 minutos."
registerShot('s30', { draw(g, t, info) { clockInsert(g, t, info, (t) => mmss(180 - t), { pulse: true, roll: 0.01 }); } });

// s31 — "Aí você ouve."
registerShot('s31', { draw(g, t, info) {
  faceShot(g, t, info, { who: P77, expr: t < 0.4 ? 'worried' : 'surprised', look: [t < 0.4 ? 0 : -0.9, -0.1], rimSide: -1, push: 0.06 });
} });

// the ghost mother in front of a glowing speaker (s32–s34)
function motherScene(g, t, info, o) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: V(1.5, 1.45) + (o.zoom || 0.06) * k, x: -V(60, 40), y: V(0, 110) };
  const { M, WB } = room(g, t, cam, { voice: 1, ringColor: MOM.color, lights: 0.5 });
  layer(g, cam, 1, (g) => {
    const x = E.W / 2 - 10 + (o.shake ? Math.sin(t * 40) * 6 : 0), y = WB + V(80, 160);
    ghost(g, { x, y, s: 1.9, facing: 1, outfit: MOM, pose: o.pose(t), expr: o.expr, talk: o.talk ? talkAmount(info.globalT, info.shot.start, info.shot.end) : 0, color: MOM.color, a: o.a ? o.a(t) : 1 });
    if (o.talk) FX.rings(g, x + 8, y - 210 * 1.9, t, { count: 3, r0: 70, r1: 200, color: MOM.color, a: 0.5 });
    wave(g, x, y - V(560, 620), 360, 34, t, MOM.color, 0.8, 3);
  });
  if (o.red) veil(g, ALARM(), o.red, 'lighter');
  FX.dust(g, t, { count: 40, color: MOM.color, a: 0.35 });
}
// s32 — "É a voz da sua mãe."
registerShot('s32', { draw(g, t, info) { motherScene(g, t, info, { pose: () => POSES.stand, expr: 'worried', a: (t) => ease.out(prog(t, 0, 0.8)) }); } });
// s33 — "Ela está chamando você."
registerShot('s33', { draw(g, t, info) { motherScene(g, t, info, { pose: (t) => posesAt(t, [[0, POSES.talk], [0.6, POSES.wave]]), expr: 'worried', talk: true }); } });
// s34 — "Pedindo socorro."
registerShot('s34', { draw(g, t, info) { motherScene(g, t, info, { pose: (t) => posesAt(t, [[0, POSES.reach], [0.5, POSES.handsOnHead]]), expr: 'cry', talk: true, shake: true, red: 0.08, zoom: 0.12 }); } });

// s35 — "Sua garganta aperta."  rings closing in
registerShot('s35', { draw(g, t, info) {
  faceShot(g, t, info, { who: P77, expr: 'scared', look: [-0.2, 0], rimSide: -1, push: 0.1, over: (g, cx, cy, r) => {
    for (let i = 0; i < 3; i++) { const ph = 1 - ((t * 0.8 + i / 3) % 1); ring(g, cx, cy + r * 0.9, r * (0.4 + ph * 1.2), 4, alpha(ALARM(), 0.5 * (1 - ph))); }
    sweat(g, cx, cy, r, t); } });
} });

// s36 — "O grito sobe."  mouth starts to open
registerShot('s36', { draw(g, t, info) {
  faceShot(g, t, info, { who: P77, expr: 'scared', talk: 0.2 + 0.6 * prog(t, 0.3, info.dur), r: V(380, 420), rimSide: -1, push: 0.12, shakeAmp: 3 + 8 * prog(t, 0, info.dur),
    over: (g, cx, cy, r) => FX.rings(g, cx, cy + r * 0.45, t, { count: 3, r0: r * 0.2, r1: r * 0.9, color: ALARM(), a: 0.5 * prog(t, 0.3, 1.0), speed: 2 }) });
  veil(g, ALARM(), 0.05 + 0.05 * Math.sin(t * 12), 'lighter');
} });

// s37 — "Você abre a boca e uma mão cobre seu rosto com força."  FREEZE on the hand
registerShot('s37', { draw(g, t, info) {
  const tHand = wt('mo', info, 1.3) - 0.25, frozen = t > tHand + 0.15;
  const M = mood('interiorCool'), ink = S().ink;
  bgBlur(g, frozen ? tHand : t, 'room', { x: -80 });
  const r = V(360, 400) * (1 + 0.03 * Math.min(t, tHand)), [sx, sy] = t > tHand && t < tHand + 0.4 ? shake(t, 18, 30) : [0, 0];
  const cx = E.W / 2 - 40 + sx, cy = E.H * 0.5 + sy;
  bigFace(g, cx, cy, r, { outfit: P77, expr: frozen ? 'shocked' : 'scared', talk: t < tHand ? clamp(0.5 + t) : 0.9, rimColor: M.rim, rimSide: -1, look: frozen ? [0.6, 0] : [0, 0] });
  // the hand slams in from the right and covers the mouth
  const k = ease.out(prog(t, tHand - 0.15, tHand + 0.05)), hx = lerp(E.W + 500, cx + r * 0.05, k), hy = cy + r * 0.45;
  for (const [c, o] of [[M.rim, -6], [ink, 0]]) { g.save(); g.translate(o, o * 0.5);
    seg(g, [[hx + r * 0.5, hy + r * 0.1], [E.W + 600, hy + r * 0.7]], r * 0.42, o ? c : shade(P41.color, -0.1));
    rr(g, hx - r * 0.55, hy - r * 0.32, r * 1.15, r * 0.62, r * 0.3); g.fillStyle = c; g.fill();
    for (let i = 0; i < 4; i++) seg(g, [[hx - r * 0.2, hy - r * 0.22 + i * r * 0.15], [hx - r * 0.85, hy - r * 0.28 + i * r * 0.16]], r * 0.14, c);
    g.restore(); }
  seg(g, [[hx - r * 0.3, hy + r * 0.05], [hx + r * 0.15, hy - r * 0.12]], r * 0.035, alpha('#f0d8e8', 0.7));   // the scar
  if (frozen) {
    FX.drops(g, t, { count: 40, color: '#d8e4ff', rMax: 12, drift: 3 });
    FX.rings(g, hx, hy, t - tHand, { count: 3, r0: r * 0.6, r1: r * 2.2, speed: 0.35, color: '#e8f0ff', a: 0.3 });
    g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.35)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  }
  if (t > tHand && t < tHand + 0.2) veil(g, '#ffffff', 0.6 * (1 - prog(t, tHand, tHand + 0.2)), 'lighter');
} });
