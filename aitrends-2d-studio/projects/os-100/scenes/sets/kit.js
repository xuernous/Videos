// sets/kit.js — shared shot helpers for "Os 100": face close-ups, inserts, the counter badge, ghosts, the Voice.
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad } from '/engine/core.js';
import { drawFigure, POSES, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { room, roomGround, wallClock, speaker, ALARM } from './room.js';
import { apt } from './apt.js';

// blurred, darkened location behind a close-up
export function bgBlur(g, t, where = 'room', o = {}) {
  const cam = { z: o.z ?? 1.6, x: o.x ?? 0, y: o.y ?? -V(200, 380) };
  blurLayer(g, o.blur ?? 14, (g) => (where === 'apt' ? apt(g, t, cam) : room(g, t, cam, o.room || {})));
  veil(g, '#06070e', o.veil ?? 0.4);
}
// giant face close-up with a slow push. o: {who, expr, talk, look, rimSide, tilt, x, y, r, where, room, blink, shakeAmp}
export function faceShot(g, t, info, o) {
  bgBlur(g, t, o.where, { room: o.room, x: o.bgx ?? 0 });
  const M = mood(o.where === 'apt' ? 'interiorWarm' : 'interiorCool');
  const r = (o.r ?? V(300, 340)) * (1 + (o.push ?? 0.04) * t / Math.max(1, info.dur));
  let cx = E.W / 2 + (o.x ?? 0), cy = E.H * V(0.6, 0.5) + (o.y ?? 0);
  if (o.shakeAmp) { const [sx, sy] = shake(t, o.shakeAmp, 9); cx += sx; cy += sy; }
  o.under?.(g, cx, cy, r, M);
  bigFace(g, cx, cy, r, { outfit: o.who, expr: o.expr, talk: o.talk || 0, look: o.look, rimColor: o.rimColor || M.rim, rimSide: o.rimSide ?? -1, tilt: o.tilt, blink: o.blink ?? ((t % 3.2) > 3.08) });
  o.over?.(g, cx, cy, r, M);
  return { cx, cy, r, M };
}
// sweat drop on a big face
export function sweat(g, cx, cy, r, t) { const y = cy - r * 0.5 + ((t * 0.25) % 1) * r * 0.3; g.fillStyle = alpha('#cfe6ff', 0.85); g.beginPath(); g.moveTo(cx + r * 0.72, y - r * 0.12); g.quadraticCurveTo(cx + r * 0.8, y, cx + r * 0.72, y + r * 0.05); g.quadraticCurveTo(cx + r * 0.64, y, cx + r * 0.72, y - r * 0.12); g.fill(); }
// "RESTAM n" counter (top-right)
export function counter(g, n, a = 1) {
  if (a <= 0) return; const ui = S().ui, x = E.W - V(80, 70), y = V(110, 200);
  text(g, 'RESTAM', x, y - V(46, 54), { size: V(26, 30), color: ui.cream, font: FONTS.ui, weight: 900, align: 'right', spacing: 4, alpha: a * 0.8 });
  text(g, String(n), x, y + 10, { size: V(78, 92), color: ui.gold, font: FONTS.ui, weight: 900, align: 'right', glow: 20, glowColor: alpha(ui.gold, 0.6), alpha: a });
}
// translucent ghost figure (a voice from the speakers), glowing outline
export function ghost(g, o) {
  const c = o.color || '#cfe0ff';
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, o.x, o.y - 140 * o.s, 260 * o.s, c, 0.25 * (o.a ?? 1)); g.restore();
  drawFigure(g, { ...o, alpha: 0.5 * (o.a ?? 1), rim: { color: c, dir: [0, -1], w: 6 }, shadow: false });
  drawFigure(g, { ...o, alpha: 0.35 * (o.a ?? 1), rim: { color: c, dir: [0, 1], w: 5 }, shadow: false });
}
// close insert of a jersey chest with the number glowing
export function chestInsert(g, t, info, outfit, o = {}) {
  bgBlur(g, t, 'room', { z: 1.9, x: o.bgx ?? 120 });
  const ui = S().ui, M = mood('interiorCool'), z = 1 + 0.06 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H * 0.5); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.5);
  const cx = E.W / 2, top = E.H * 0.18, w = V(900, 820);
  // shoulders + torso of the jersey
  g.fillStyle = shade(outfit.color, -0.6); g.beginPath(); g.ellipse(cx, top + 40, w * 0.7, 200, 0, Math.PI, 0); g.fill();
  g.fillStyle = outfit.color; g.beginPath(); g.moveTo(cx - w * 0.62, top + 60); g.quadraticCurveTo(cx, top - 70, cx + w * 0.62, top + 60); g.lineTo(cx + w * 0.55, E.H + 200); g.lineTo(cx - w * 0.55, E.H + 200); g.closePath(); g.fill();
  g.fillStyle = S().ink; g.beginPath(); g.ellipse(cx, top - 10, 150, 90, 0, 0, Math.PI); g.fill();
  g.fillStyle = linGrad(g, cx - w * 0.6, 0, cx + w * 0.6, 0, [alpha('#000', 0.45), alpha('#000', 0), alpha(M.rim, 0.18)]); g.fillRect(cx - w * 0.62, top - 80, w * 1.24, E.H);
  const k = ease.outBack(prog(t, o.at ?? 0.6, (o.at ?? 0.6) + 0.5)), lit = prog(t, o.at ?? 0.6, (o.at ?? 0.6) + 0.3);
  text(g, outfit.number, cx, E.H * 0.47, { size: V(380, 420) * (0.9 + 0.1 * k), color: mix(outfit.color2 || '#fff', ui.gold, lit), font: FONTS.ui, weight: 900, glow: 40 * lit, glowColor: alpha(ui.gold, 0.7) });
  g.restore();
  o.hand?.(g);
  FX.dust(g, t, { count: 30, color: M.key, a: 0.3 });
}
// close insert of the red wall clock
export function clockInsert(g, t, info, str, o = {}) {
  const M = mood('interiorCool');
  blurLayer(g, 10, (g) => room(g, t, { z: 1.4, y: -V(500, 700) }, { clock: null })); veil(g, '#05050a', 0.55);
  const z = 1.05 + 0.08 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H * 0.42); g.scale(z, z); if (o.roll) g.rotate(o.roll * Math.sin(t)); g.translate(-E.W / 2, -E.H * 0.42);
  const on = o.on ? o.on(t) : 1;
  wallClock(g, E.W / 2, E.H * 0.42, V(860, 900), typeof str === 'function' ? str(t) : str, { on });
  g.restore();
  if (o.pulse) { const p = (Math.sin(t * 6.28) + 1) / 2; veil(g, ALARM(), 0.06 * p, 'lighter'); }
  FX.dust(g, t, { count: 24, color: '#ffb0a0', a: 0.25 });
}
export const mmss = (sec) => { sec = Math.max(0, Math.ceil(sec)); return String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); };
// close insert of a wall speaker
export function speakerInsert(g, t, info, o = {}) {
  const M = mood('interiorCool');
  blurLayer(g, 12, (g) => room(g, t, { z: 1.5, x: V(300, 330), y: -V(400, 640) }, { speakers: false })); veil(g, '#05060c', 0.45);
  const z = 1 + 0.07 * ease.inOut(t / info.dur), cx = E.W * 0.5 + (o.x ?? 0), cy = E.H * 0.4;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  speaker(g, cx, cy, V(300, 330), { t, voice: o.voice ?? 1, ringColor: o.ringColor, reach: 2.6, ledColor: o.ledColor });
  g.restore();
  o.over?.(g, cx, cy);
}
// small round-capped sound wave (for "sound = danger" or voices)
export function wave(g, x, y, w, h, t, col, a = 1, freq = 9) {
  g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath();
  for (let i = 0; i <= 60; i++) { const u = i / 60, env = Math.sin(u * Math.PI); const yy = y + Math.sin(u * freq * 6.28 + t * 8) * h * env * (0.6 + 0.4 * Math.sin(t * 3 + u * 5)); i ? g.lineTo(x - w / 2 + u * w, yy) : g.moveTo(x - w / 2 + u * w, yy); }
  g.stroke(); g.restore();
}
// background crowd of players standing on the floor. list: [{x, d, who?, facing, pose, expr, seed, look}]
import { depthY, depthS } from './room.js';
import { breathe as _br } from '/engine/rig2d.js';
export function players(g, t, list, M, o = {}) {
  [...list].sort((a, b) => a.d - b.d).forEach((p, i) => {
    const s = depthS(p.d, o.s ?? 1.25) * (p.sMul || 1), y = depthY(p.d) + (p.dy || 0);
    drawFigure(g, { x: p.x, y, s, facing: p.facing ?? 1, outfit: p.who, pose: o.frozen ? (p.pose || POSES.stand) : _br(p.pose || POSES.stand, t, p.breath ?? 1, p.seed ?? i), expr: p.expr || 'worried', look: p.look,
      rim: { color: M.rim, dir: p.rimDir || [0, -1], w: 4 }, dim: p.d < 0.45, blink: (t % (2.6 + (i % 5) * 0.37)) > (2.5 + (i % 5) * 0.37), alpha: p.a });
  });
}
