// shots/01_marathon.js — s01–s20: the marathon hour by hour.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { room, ROOM, scr, led, monitor, can, groundY } from '../sets/room.js';
import { wt, zoomAt, bgBlur, faceShot, bpBack, bigNum, hud } from '../sets/kit.js';
import { GAMER, PLAYER05 } from '../cast.js';

const BAT = { 0: 1, 6: 0.85, 19: 0.6, 24: 0.5, 48: 0.25, 50: 0.2, 72: 0.08 };
const GAME_SIT = { ...POSES.sit, head: [10, -178], eF: [28, -116], hF: [46, -122], eB: [20, -116], hB: [40, -124] };
const SLUMP = { ...POSES.sit, head: [26, -150], sh: [12, -138], eF: [22, -100], hF: [30, -76], eB: [14, -100], hB: [22, -76] };
const hand = (o) => { const p = o.pose, s = o.s ?? 1, f = o.facing ?? 1; return [o.x + p.hF[0] * s * f, o.y + p.hF[1] * s]; };
function pad(g, x, y, s, ledOn = 1) { const ink = '#0b0b12'; g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = ink; g.beginPath(); g.moveTo(-70, -20); g.quadraticCurveTo(0, -36, 70, -20); g.quadraticCurveTo(110, 30, 84, 46); g.quadraticCurveTo(60, 56, 40, 20); g.lineTo(-40, 20); g.quadraticCurveTo(-60, 56, -84, 46); g.quadraticCurveTo(-110, 30, -70, -20); g.closePath(); g.fill(); g.strokeStyle = alpha(scr(), 0.4); g.lineWidth = 3; g.stroke(); if (ledOn) { rr(g, -18, -24, 36, 5, 2); g.fillStyle = led(); g.fill(); } g.restore(); }
// gamer in the chair (most room shots)
function gamer(g, t, M, R, o = {}) {
  const f = { x: R.chairX, y: R.GY, s: o.s ?? 2.0, facing: 1, outfit: GAMER, pose: o.pose ?? breathe(GAME_SIT, t, 0.6, 2), expr: o.expr || 'determined', look: o.look || [1, -0.1], rim: { color: scr(), dir: [1, -0.3], w: 5 }, blink: o.blink ?? ((t % 3.4) > 3.3), shadow: false };
  drawFigure(g, f); if (o.pad !== false) { const [hx, hy] = hand(f); pad(g, hx + 6, hy + 4, 0.42); }
  return f;
}
const lineFig = (g, x, y, s, pose, c) => UI.lineFigure(g, { x, y, s, pose, color: c || S().ui.blueprint });

// s01 — "E se você jogasse GTA 6 sem parar,"
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15 + 0.1 * k, x: V(60, 80), y: V(30, 70) };
  const { M, R } = room(g, t, cam, { hour: 0, cans: 1 });
  layer(g, cam, 1, (g) => gamer(g, t, M, R, { expr: 'smirk' }));
  FX.dust(g, t, { count: 40, color: scr(), a: 0.3 });
} });
// s02 — "até o seu corpo desligar,"  CRT switch-off
registerShot('s02', { draw(g, t, info) {
  const td = wt('desligar', info, 1.3), k = prog(t, td, td + 0.35), k2 = prog(t, td + 0.35, td + 0.7);
  const cy = E.H * 0.5;
  g.save(); g.translate(0, cy); g.scale(1, Math.max(0.004, 1 - ease.in(k))); g.translate(0, -cy);
  faceShot(g, t, info, { who: GAMER, expr: t < td - 0.6 ? 'determined' : 'sleepy', look: [0.2, 0], push: 0.06, y: V(80, 150), set: { hour: 0 } });
  g.restore();
  if (k > 0) { const bh = (E.H / 2) * ease.in(k); g.fillStyle = '#000'; g.fillRect(0, 0, E.W, cy - (E.H / 2 - bh) - 2); g.fillRect(0, cy + (E.H / 2 - bh) + 2, E.W, E.H);
    if (k >= 1) { g.fillStyle = '#000'; g.fillRect(0, 0, E.W, E.H); const w = E.W * (1 - ease.in(k2)); seg(g, [[E.W / 2 - w / 2, cy], [E.W / 2 + w / 2, cy]], 6, '#ffffff'); glow(g, E.W / 2, cy, 120 * (1 - k2) + 20, '#ffffff', 0.8 * (1 - k2 * 0.7)); } }
} });
// s03 — "13 anos de espera,"
registerShot('s03', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, p = ease.inOut(prog(t, 0.1, info.dur - 0.5)), yr = Math.round(lerp(2013, 2026, p));
  for (let i = 0; i < 14; i++) { const x = E.W * 0.1 + i * E.W * 0.8 / 13, on = 2013 + i <= yr; rr(g, x - 18, E.H * 0.58, 36, 36, 8); g.fillStyle = on ? alpha(ui.gold, 0.85) : alpha(ui.blueprint, 0.2); g.fill(); }
  seg(g, [[E.W * 0.1, E.H * 0.58 + 18], [E.W * 0.9, E.H * 0.58 + 18]], 3, alpha(ui.blueprint, 0.4));
  text(g, String(yr), E.W / 2, E.H * 0.42, { size: V(200, 230), color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.6) });
  bigNum(g, t, '13 ANOS', E.W / 2, E.H * 0.24, 0.2, { size: V(96, 110), color: ui.cream, label: 'DE ESPERA' });
} });
// s04 — "você aperta Iniciar,"
registerShot('s04', { draw(g, t, info) {
  const ti = wt('Iniciar', info, 0.85), ui = S().ui, M = mood('night');
  const startScreen = (g, x, y, w, h) => { g.fillStyle = '#07060e'; g.fillRect(x, y, w, h); glow(g, x + w / 2, y + h * 0.45, w * 0.6, ui.accent, 0.35); text(g, 'GTA 6', x + w / 2, y + h * 0.35, { size: h * 0.22, color: '#fff', font: FONTS.title, glow: 14, glowColor: alpha(ui.accent, 0.9) });
    const on = t > ti; rr(g, x + w * 0.3, y + h * 0.6, w * 0.4, h * 0.16, h * 0.08); g.fillStyle = on ? ui.gold : alpha(ui.cream, 0.15); g.fill(); text(g, 'INICIAR', x + w / 2, y + h * 0.685, { size: h * 0.09, color: on ? '#1a1206' : ui.cream, font: FONTS.ui, weight: 900 }); };
  bgBlur(g, t, { z: 2.0, x: V(420, 330), y: -V(120, 200), veil: 0.35, set: { hour: 0, monContent: startScreen } });
  const z = 1 + 0.06 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.6, press = ease.inOut(prog(t, 0.1, ti)) - 0.5 * ease.inOut(prog(t, ti + 0.1, ti + 0.5));
  zoomAt(g, cx, cy, z, () => {
    pad(g, cx, cy, V(4.2, 5.0), t > ti ? 1 : 0.3);
    const bx = cx + V(150, 180), by = cy - V(40, 50); circle(g, bx, by, 26, t > ti ? ui.gold : '#22222e'); if (t > ti) glow(g, bx, by, 120, ui.gold, 0.6 * (1 - prog(t, ti, ti + 0.8)));
    const tx = lerp(bx + 200, bx + 10, press), ty = lerp(by - 260, by - 30, press);
    seg(g, [[E.W + 300, ty - 500], [tx + 30, ty - 40]], 110, mix(GAMER.color, '#000', 0.1)); seg(g, [[tx + 60, ty - 120], [tx, ty]], 70, M.rim); seg(g, [[tx + 60, ty - 120], [tx, ty]], 62, S().ink);
  });
  if (t > ti) veil(g, ui.gold, 0.12 * (1 - prog(t, ti, ti + 0.6)), 'lighter');
} });
// s05 — "Hora 6, você quase não pisca,"
registerShot('s05', { draw(g, t, info) {
  const ui = S().ui;
  faceShot(g, t, info, { who: GAMER, expr: 'surprised', look: [0.1, 0], blink: false, push: 0.07, y: V(120, 200), set: { hour: 6, cans: 3 },
    over: (g, cx, cy, r) => { g.save(); g.globalAlpha *= 0.7; for (const dx of [-0.32, 0.32]) for (let i = 0; i < 4; i++) { const a = i * 1.6 + 0.4, ex = cx + dx * r, ey = cy - r * 0.18; seg(g, [[ex + Math.cos(a) * r * 0.2, ey + Math.sin(a) * r * 0.2], [ex + Math.cos(a) * r * 0.12, ey + Math.sin(a) * r * 0.12 + 3]], 3, ui.accent); } g.restore(); } });
  const a = prog(t, wt('pisca', info, 2.2) - 0.2, wt('pisca', info, 2.2)); if (a > 0) { text(g, 'PISCADAS/MIN', E.W / 2, E.H * 0.25, { size: V(36, 40), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: a }); text(g, '3', E.W / 2, E.H * 0.31, { size: V(110, 120), color: ui.accent, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.accent, 0.6), alpha: a }); }
  hud(g, t, 6, BAT[6], { at: 0.05 });
} });
// s06 — "as pernas formigam,"
registerShot('s06', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, c = ui.blueprint, x = E.W * 0.42, y = E.H * 0.7, s = V(2.4, 2.8);
  seg(g, [[x - 120, y - 72 * s], [x + 80, y - 72 * s]], 6, alpha(c, 0.5)); seg(g, [[x - 110, y - 72 * s], [x - 140, y - 250 * s]], 6, alpha(c, 0.5));
  lineFig(g, x, y, s, POSES.sit);
  const r = rng(3); for (let i = 0; i < 26; i++) { const u = r(), lx = x + lerp(0, 46, u) * s, ly = y - lerp(72, 0, Math.pow(r(), 1.5)) * s, tw = Math.sin(t * 9 + i * 1.7) * 0.5 + 0.5; FX.sparkle(g, lx + (r() - 0.5) * 30, ly, 10 + 14 * tw, i % 2 ? ui.gold : ui.accent, 0.4 + 0.6 * tw); }
  bigNum(g, t, 'FORMIGAMENTO', E.W / 2, E.H * 0.22, 0.2, { size: V(84, 90), color: ui.gold });
  hud(g, t, 6, BAT[6] - 0.05);
} });
// s07 — "Hora 19, seus reflexos são os de alguém que bebeu,"
registerShot('s07', { draw(g, t, info) {
  const ui = S().ui, tl = 1.4, k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.06 * k, x: V(200, 170), y: V(60, 140) };
  const lost = (g, x, y, w, h) => { monitor(g, x, y, w, h, t, 1); if (t > tl) { g.fillStyle = alpha('#000', 0.55); g.fillRect(x, y, w, h); text(g, 'VOCÊ PERDEU', x + w / 2, y + h / 2, { size: h * 0.16, color: ui.accent, font: FONTS.title, glow: 16, glowColor: alpha(ui.accent, 0.8) }); } };
  const { M, R } = room(g, t, cam, { hour: 19, cans: 5, monContent: lost });
  layer(g, cam, 1, (g) => gamer(g, t, M, R, { expr: t > tl ? 'confused' : 'sleepy', pose: breathe(t > tl + 0.3 ? { ...GAME_SIT, hF: [46, -140] } : GAME_SIT, t, 0.6, 2) }));
  const bs = wt('bebeu', info, 3.2) - 0.9;
  UI.compareBars(g, t, { rows: [{ label: 'NORMAL', v: 0.3 }, { label: '19 H', v: 0.78 }], start: bs, color: ui.gold });
  if (t > bs) text(g, 'TEMPO DE REAÇÃO', V(220, 120), E.H - V(320, 600), { size: V(34, 38), color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3, alpha: prog(t, bs, bs + 0.3) });
  hud(g, t, 19, BAT[19], { at: 0.1 });
} });
// brain outline (blueprint)
function brain(g, cx, cy, s, c, w = 7) {
  g.save(); g.strokeStyle = c; g.lineWidth = w; g.lineJoin = 'round'; g.beginPath();
  const pts = [[-1, 0.1], [-0.95, -0.35], [-0.65, -0.7], [-0.2, -0.85], [0.25, -0.82], [0.65, -0.62], [0.95, -0.25], [0.98, 0.15], [0.75, 0.45], [0.35, 0.55], [0.1, 0.75], [-0.15, 0.55], [-0.6, 0.55], [-0.92, 0.38]];
  pts.forEach(([x, y], i) => { const X = cx + x * s, Y = cy + y * s * 0.8; i ? g.quadraticCurveTo(cx + (pts[i - 1][0] + x) / 2 * s * 1.08, cy + (pts[i - 1][1] + y) / 2 * s * 0.88, X, Y) : g.moveTo(X, Y); }); g.closePath(); g.stroke();
  g.lineWidth = w * 0.6; for (const [a, b, c2, d] of [[-0.6, -0.3, -0.2, -0.45], [0.1, -0.5, 0.5, -0.3], [-0.5, 0.15, 0, 0.05], [0.2, 0.05, 0.7, 0.1]]) { g.beginPath(); g.moveTo(cx + a * s, cy + b * s * 0.8); g.quadraticCurveTo(cx + (a + c2) / 2 * s, cy + (b + d) / 2 * s * 0.8 - 30, cx + c2 * s, cy + d * s * 0.8); g.stroke(); }
  g.restore();
}
// s08 — "Hora 24, seu cérebro funciona como de alguém bêbado demais para dirigir,"
registerShot('s08', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, tb = wt('bêbado', info, 3.5), tdv = wt('dirigir', info, 4.7), sway = Math.sin(t * 1.6) * 0.04;
  g.save(); g.translate(E.W / 2, E.H * 0.42); g.rotate(sway); brain(g, 0, 0, V(300, 330), ui.blueprint); g.restore();
  glow(g, E.W / 2, E.H * 0.42, V(400, 420), ui.accent, 0.12 + 0.08 * Math.sin(t * 3));
  bigNum(g, t, '≈ 0,10%', E.W / 2, E.H * 0.67, tb - 0.2, { size: V(110, 120), color: ui.accent, label: 'ÁLCOOL NO SANGUE' });
  const a = ease.outBack(prog(t, tdv - 0.15, tdv + 0.25)); if (a > 0) { g.save(); g.translate(E.W / 2, E.H * 0.17); g.scale(a, a);
    rr(g, -110, -30, 220, 60, 24); g.fillStyle = ui.cream; g.fill(); rr(g, -70, -70, 140, 50, 20); g.fillStyle = ui.cream; g.fill(); circle(g, -60, 34, 26, ui.bpBg); circle(g, 60, 34, 26, ui.bpBg); circle(g, -60, 34, 16, ui.cream); circle(g, 60, 34, 16, ui.cream);
    ring(g, 0, 0, 150, 14, ui.accent); seg(g, [[-105, 105], [105, -105]], 14, ui.accent); g.restore(); }
  hud(g, t, 24, BAT[24], { at: 0.1 });
} });
// s09 — "Hora 48, você apaga por segundos de olhos abertos e nem percebe."
registerShot('s09', { draw(g, t, info) {
  const ui = S().ui, ta = wt('apaga', info, 1.8), tb = ta + 1.7, black = t > ta && t < tb;
  faceShot(g, t, info, { who: GAMER, expr: 'neutral', look: [0, 0.1], blink: false, push: 0.06, y: V(120, 200), set: { hour: 48, cans: 9 }, shakeAmp: 1.5 });
  if (black) { const f = Math.min(prog(t, ta, ta + 0.15), 1 - prog(t, tb - 0.15, tb)); veil(g, '#000', 0.96 * f);
    text(g, 'MICROSSONO', E.W / 2, E.H * 0.45, { size: V(84, 90), color: ui.blueprint, font: FONTS.ui, weight: 900, spacing: 6, alpha: f, glow: 16, glowColor: alpha(ui.blueprint, 0.6) });
    text(g, `${Math.min(2, (t - ta) * 1.25).toFixed(1).replace('.', ',')} s`, E.W / 2, E.H * 0.53, { size: V(70, 76), color: ui.cream, font: FONTS.ui, weight: 900, alpha: f }); }
  if (t > tb) { const a = prog(t, tb, tb + 0.3); text(g, 'NEM PERCEBE', E.W / 2, E.H * 0.2, { size: V(60, 66), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: a }); }
  hud(g, t, 48, BAT[48], { at: 0.1 });
} });
// s10 — "Perto da Hora 50, um jogador coreano morreu assim em 2005,"  3D internet café
registerShot('s10', { kind: '3d',
  init(T) {
    const M = mood('night'), SC = mood('interiorCool').practical, st = T.stage({ mood: 'night', fov: V(40, 56), fog: [6, 30], keyPos: [3, 8, 4], keyIntensity: 0.5, ambient: 0.6 });
    st.add(T.ground(60, 60, shade(M.floor, -0.3)));
    const r = rng(5), empty = { x: 0.6, z: 0 };
    for (let row = -2; row <= 2; row++) for (let i = -6; i <= 6; i++) {
      const x = i * 1.2, z = row * 2.4; st.add(T.box(1.1, 0.06, 0.7, shade(M.dark, -0.2), x, 0.75, z - 0.3), T.box(0.05, 0.75, 0.6, shade(M.dark, -0.3), x - 0.5, 0.37, z - 0.3));
      const scrn = T.windowPane(0.6, 0.38, { glowColor: SC, cols: 1, rows: 1, power: 0.9 }); scrn.position.set(x, 1.05, z - 0.62); st.add(scrn);
      const isEmpty = row === 0 && i === 0;
      st.add(T.box(0.45, 0.06, 0.45, '#1a1622', x, 0.48, z + 0.25), T.box(0.45, 0.6, 0.06, '#1a1622', x, 0.8, z + 0.48));
      if (!isEmpty && r() < 0.7) { const p = T.figure3D(PLAYER05, { rim: M.rim, pose: POSES.sit }); p.position.set(x, 0, z + 0.25); p.rotation.y = Math.PI / 2; st.add(p); }
    }
    const sh = T.shaft(0.9, 5, '#ffffff', 0.06); sh.position.set(0, 2.6, 0.25); st.add(sh);
    return { stage: st };
  },
  draw(s, t, info, T) { T.dolly(s.stage.camera, t, [[0, { pos: [3.5, 3.4, 7.5], look: [0, 0.6, 0], fov: V(40, 56) }], [info.dur, { pos: [2.0, 2.6, 4.6], look: [0, 0.6, 0.2], fov: V(36, 50) }]]); },
  overlay(g, t, info) { const a = prog(t, 0.3, 0.7); UI.badge(g, { str: 'COREIA DO SUL · 2005', a, size: V(40, 44), y: V(330, 470) }); hud(g, t, 50, BAT[50], { at: 0.2 }); },
});
// s11 — "o coração não aguentou."  heart monitor goes flat
registerShot('s11', { draw(g, t, info) {
  const ui = S().ui; g.fillStyle = '#050608'; g.fillRect(0, 0, E.W, E.H);
  for (let y = 0; y < E.H; y += 60) { g.fillStyle = alpha(ui.good, 0.05); g.fillRect(0, y, E.W, 2); }
  const tf = wt('aguentou', info, 1.0), cy = E.H * 0.45, head = (t / info.dur) * E.W * 1.15, col = t > tf ? alpha(ui.cream, 0.6) : ui.accent;
  g.save(); g.strokeStyle = col; g.lineWidth = 6; g.lineJoin = 'round'; g.beginPath();
  for (let x = 0; x <= Math.min(E.W, head); x += 4) { const tt = x / E.W * info.dur * 1.15; let y = cy; if (tt < tf) { const ph = (tt * 2.6) % 1; y = cy - (ph > 0.42 && ph < 0.48 ? 240 * Math.sin((ph - 0.42) / 0.06 * Math.PI) : ph > 0.5 && ph < 0.54 ? -70 : 0) * (1 - 0.5 * (tt / tf)); } x ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke(); g.restore(); glow(g, Math.min(E.W, head), cy, 60, ui.accent, 0.4);
  const a = prog(t, tf, tf + 0.4); text(g, '0', E.W - V(100, 100), E.H * 0.16, { size: V(110, 120), color: alpha(ui.accent, 1 - a * 0.3), font: FONTS.ui, weight: 900, align: 'right' });
  text(g, 'BPM', E.W - V(100, 100), E.H * 0.22, { size: V(36, 40), color: ui.cream, font: FONTS.ui, weight: 900, align: 'right', spacing: 4 });
} });
// s12 — "Hora 72, o quarto começa a mostrar coisas que não estão lá."
registerShot('s12', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), tl = wt('lá', info, 4.4), cam = { z: 1.2 + 0.1 * k, x: -V(60, 80) * k, y: V(30, 80), r: 0.015 * Math.sin(t * 0.9) };
  const { M, R, WB } = room(g, t, cam, { hour: 72, cans: 14, pizza: true, shadows: prog(t, 0.5, 1.6) });
  layer(g, cam, 0.7, (g) => { const a = 0.75 * prog(t, 1.2, 2.0) * (1 - prog(t, tl - 0.2, tl + 0.2)); if (a > 0) drawFigure(g, { x: E.W * 0.12, y: R.GY - 40, s: 2.4, facing: 1, outfit: {}, pose: POSES.stand, expr: 'neutral', blink: true, alpha: a, rim: { color: led(), dir: [1, 0], w: 4 }, shadow: false, ink: '#000' }); });
  layer(g, cam, 1, (g) => gamer(g, t, M, R, { expr: 'scared', look: t > 1.6 ? [-1, -0.1] : [1, 0], pose: breathe({ ...GAME_SIT, head: t > 1.6 ? [0, -180] : GAME_SIT.head }, t, 1.5, 2) }));
  veil(g, '#000', 0.15);
  hud(g, t, 72, BAT[72], { at: 0.1 });
} });
// s13 — "O recorde humano, sem dormir, é de 11 dias,"
registerShot('s13', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, t11 = wt('11', info, 2.3), cell = V(160, 180), x0 = E.W / 2 - cell * 2, y0 = E.H * 0.36;
  for (let i = 0; i < 12; i++) { const x = x0 + (i % 4) * cell, y = y0 + Math.floor(i / 4) * cell, on = i < 11 && t > 0.3 + i * (t11 - 0.3) / 11;
    rr(g, x + 8, y + 8, cell - 16, cell - 16, 14); g.fillStyle = alpha(ui.card, 0.9); g.fill(); g.strokeStyle = alpha(ui.blueprint, 0.4); g.lineWidth = 3; g.stroke();
    text(g, String(i + 1), x + cell / 2, y + cell / 2, { size: V(50, 56), color: on ? alpha(ui.cream, 0.4) : ui.cream, font: FONTS.ui, weight: 900 });
    if (on) { seg(g, [[x + 30, y + 30], [x + cell - 30, y + cell - 30]], 9, ui.accent); seg(g, [[x + cell - 30, y + 30], [x + 30, y + cell - 30]], 9, ui.accent); } }
  bigNum(g, t, '11 DIAS', E.W / 2, E.H * 0.2, t11, { size: V(120, 130), label: 'RECORDE SEM DORMIR' });
} });
// s14 — "mas o corpo pode desistir antes."
registerShot('s14', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, td = wt('desistir', info, 1.1), b = lerp(0.35, 0.03, ease.inOut(prog(t, 0, td + 0.4)));
  lineFig(g, E.W * 0.32, E.H * 0.72, V(2.2, 2.6), breathe(posesAt(t, [[0, POSES.stand], [td, POSES.sad]]), t), ui.blueprint);
  const bx = E.W * 0.55, by = E.H * 0.34, bw = V(300, 320), bh = V(560, 600), col = b > 0.2 ? ui.gold : ui.accent;
  rr(g, bx, by, bw, bh, 30); g.strokeStyle = ui.cream; g.lineWidth = 10; g.stroke(); rr(g, bx + bw * 0.3, by - 34, bw * 0.4, 34, 8); g.fillStyle = ui.cream; g.fill();
  rr(g, bx + 18, by + bh - 18 - (bh - 36) * b, bw - 36, (bh - 36) * b, 18); g.fillStyle = col; g.fill(); if (Math.sin(t * 9) > 0 && b < 0.1) glow(g, bx + bw / 2, by + bh - 40, bw, col, 0.5);
  text(g, `${Math.round(b * 100)}%`, bx + bw / 2, by + bh / 2, { size: V(90, 100), color: ui.cream, font: FONTS.ui, weight: 900 });
} });
// s15 — "O maior perigo nem é o sono,"
registerShot('s15', { draw(g, t, info) {
  const ui = S().ui, ts = wt('sono', info, 1.7), k = ease.inOut(t / info.dur), cam = { z: 1.35 + 0.06 * k, x: V(80, 60), y: V(50, 120) };
  const { M, R } = room(g, t, cam, { hour: 72, cans: 16, pizza: true });
  layer(g, cam, 1, (g) => gamer(g, t, M, R, { pose: breathe(SLUMP, t, 0.5, 2), expr: 'sleepy', blink: true, pad: false }));
  bigNum(g, t, 'SONO', E.W / 2, E.H * 0.2, ts - 0.2, { size: V(140, 150), color: ui.cream });
  const p = ease.out(prog(t, ts + 0.15, ts + 0.45)); if (p > 0) seg(g, [[E.W / 2 - 260, E.H * 0.2 + 30], [E.W / 2 - 260 + 520 * p, E.H * 0.2 - 30]], 16, ui.accent);
  hud(g, t, 72, BAT[72]);
} });
// s16 — "é ficar sentado sem água com o coração no limite."
registerShot('s16', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, ta = wt('água', info, 1.6), tc = wt('coração', info, 2.5), x = E.W * 0.38, y = E.H * 0.72, s = V(2.4, 2.8);
  seg(g, [[x - 120, y - 72 * s], [x + 80, y - 72 * s]], 6, alpha(ui.blueprint, 0.5)); lineFig(g, x, y, s, POSES.sit);
  for (let i = 0; i < 6; i++) { const u = ((t * 0.2 + i / 6) % 1); circle(g, x + lerp(46, 0, u) * s * 0.5, y - lerp(70, 10, u) * s, 6, alpha(ui.accent, 0.6)); }
  const a = ease.outBack(prog(t, ta - 0.2, ta + 0.2)); if (a > 0) { g.save(); g.translate(E.W * 0.76, E.H * 0.42); g.scale(a, a); rr(g, -50, -130, 100, 260, 26); g.strokeStyle = ui.blueprint; g.lineWidth = 7; g.stroke(); rr(g, -24, -170, 48, 40, 8); g.stroke(); seg(g, [[-90, -90], [90, 90]], 14, ui.accent); seg(g, [[90, -90], [-90, 90]], 14, ui.accent); g.restore(); text(g, 'SEM ÁGUA', E.W * 0.76, E.H * 0.42 + 200, { size: V(38, 42), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: clamp(a) }); }
  const hp = prog(t, tc - 0.3, tc), beat = 1 + 0.18 * Math.max(0, Math.sin(t * 2 * Math.PI * 2.6)) * hp;
  if (hp > 0) { const hx = x + 6 * s, hy = y - 150 * s; g.save(); g.translate(hx, hy); g.scale(beat * 2.2, beat * 2.2); g.beginPath(); g.moveTo(0, 14); g.bezierCurveTo(-36, -10, -18, -38, 0, -18); g.bezierCurveTo(18, -38, 36, -10, 0, 14); g.closePath(); g.fillStyle = ui.accent; g.fill(); g.restore(); glow(g, hx, hy, 140, ui.accent, 0.4 * hp);
    bigNum(g, t, '160 BPM', E.W / 2, E.H * 0.18, tc, { size: V(100, 110), color: ui.accent, label: 'NO LIMITE' }); }
  hud(g, t, 72, BAT[72] - 0.03);
} });
// s17 — "E se você sobrevivesse?"
registerShot('s17', { draw(g, t, info) {
  const ui = S().ui;
  faceShot(g, t, info, { who: GAMER, expr: 'sleepy', look: [0, 0.2], push: 0.06, y: V(140, 220), set: { hour: 72, cans: 16 }, blink: (t % 1.4) > 1.0 });
  const a = ease.outBack(prog(t, wt('sobrevivesse?', info, 0.7), wt('sobrevivesse?', info, 0.7) + 0.4)); if (a > 0) { g.save(); g.translate(E.W * 0.78, E.H * 0.24); g.scale(a, a); text(g, '?', 0, 0, { size: V(220, 240), color: ui.gold, font: FONTS.title, glow: 24, glowColor: alpha(ui.gold, 0.6) }); g.restore(); }
} });
// s18 — "Sem dormir, o cérebro não grava memórias,"
registerShot('s18', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, tm = wt('memórias', info, 2.2), fail = t > tm - 0.3;
  brain(g, E.W / 2, E.H * 0.45, V(300, 330), ui.blueprint);
  const on = fail ? (Math.sin(t * 30) > 0.3 ? 0.3 : 1) : (Math.sin(t * 5) > 0 ? 1 : 0.35);
  circle(g, E.W / 2 - 90, E.H * 0.45, 36, alpha(fail ? '#555' : ui.accent, on)); if (!fail) glow(g, E.W / 2 - 90, E.H * 0.45, 100, ui.accent, 0.4 * on);
  text(g, 'REC', E.W / 2 + 40, E.H * 0.45 + 4, { size: V(80, 90), color: fail ? alpha(ui.cream, 0.4) : ui.cream, font: FONTS.ui, weight: 900 });
  if (fail) { const a = prog(t, tm - 0.3, tm); rr(g, E.W / 2 - V(330, 340), E.H * 0.7 - 60, V(660, 680), 120, 24); g.fillStyle = alpha(ui.accent, 0.2 * a); g.fill(); g.strokeStyle = alpha(ui.accent, a); g.lineWidth = 5; g.stroke();
    text(g, 'ERRO AO GRAVAR', E.W / 2, E.H * 0.7, { size: V(60, 64), color: ui.accent, font: FONTS.ui, weight: 900, spacing: 3, alpha: a }); if (Math.floor(t * 12) % 5 === 0) veil(g, ui.accent, 0.06, 'lighter'); }
} });
// memory frames on the wall
function frames(blank, t) { return (g, WB, M) => { const ui = S().ui;
  for (let i = 0; i < 6; i++) { const x = E.W * 0.08 + (i % 3) * E.W * 0.3, y = WB - V(700, 900) + Math.floor(i / 3) * V(230, 250), w = V(240, 280), h = V(170, 190), b = blank[i] ?? 0;
    rr(g, x - 8, y - 8, w + 16, h + 16, 8); g.fillStyle = '#e8e2d4'; g.fill();
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); monitor(g, x, y, w, h, t + i * 3, 1); g.globalAlpha = b; g.fillStyle = '#2a2a33'; g.fillRect(x, y, w, h); g.restore();
    glow(g, x + w / 2, y + h / 2, w * 0.7, ui.accent, 0.15 * (1 - b)); } }; }
// s19 — "você esperou 13 anos e"
registerShot('s19', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15 + 0.12 * k, x: 0, y: -V(80, 220) };
  room(g, t, cam, { hour: 72, cans: 16, frames: frames([], t) });
  bigNum(g, t, '13 ANOS', E.W / 2, E.H * 0.7, wt('13', info, 0.75), { size: V(130, 140), label: 'VOCÊ ESPEROU' });
} });
// s20 — "não ia lembrar de quase nada."
registerShot('s20', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.27 + 0.05 * k, x: 0, y: -V(80, 220) }, blank = [0, 1, 2, 3, 4, 5].map(i => ease.inOut(prog(t, 0.2 + i * 0.25, 0.5 + i * 0.25)) * (i === 4 ? 0.0 : 1));
  blurLayer(g, 3 * prog(t, 1.6, 2.4), (g) => room(g, t, cam, { hour: 72, cans: 16, frames: frames(blank, t) }));
  const fa = prog(t, 1.4, 1.9); if (fa > 0) { veil(g, '#05050a', 0.4 * fa); const M = mood('night'); g.save(); g.globalAlpha *= fa; const r = V(260, 290);
    bigFace(g, E.W / 2, E.H * 0.72, r * (1 + 0.03 * t), { outfit: GAMER, expr: 'confused', look: [0, -0.4], rimColor: scr(), rimSide: 1 }); g.restore(); }
} });
import { bigFace } from '/engine/rig2d.js';
