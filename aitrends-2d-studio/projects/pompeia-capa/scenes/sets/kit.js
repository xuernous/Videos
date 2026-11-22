// sets/kit.js — word timing, face close-ups, blueprint background, big gold numbers.
import { E, V, S, mood, blurLayer, veil, ease, prog, clamp, shake, wordTime, glow, alpha, text, FONTS } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import { street, bakery, digsite } from './pompeii.js';

export const wt = (w, info, d) => { const x = wordTime(w, info.shot.start - 0.05); return x != null && x < info.shot.end + 0.5 ? x - info.shot.start : d; };
export const zoomAt = (g, cx, cy, z, fn) => { g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); fn(); g.restore(); };
export function bgBlur(g, t, where = 'street', o = {}) {
  const cam = { z: o.z ?? 1.6, x: o.x ?? 0, y: o.y ?? -V(200, 300) };
  blurLayer(g, o.blur ?? 14, (g) => (where === 'bakery' ? bakery(g, t, cam, o.set || {}) : where === 'dig' ? digsite(g, t, cam, o.set || {}) : street(g, t, cam, o.set || {})));
  veil(g, '#06050c', o.veil ?? 0.4);
}
// o: {who, expr, look, rimSide, rimColor, where, set, push, x, y, r, shakeAmp, under, over, blink}
export function faceShot(g, t, info, o) {
  bgBlur(g, t, o.where, { set: o.set, x: o.bgx ?? 0, veil: o.veil });
  const M = mood(o.where === 'bakery' ? 'interiorWarm' : o.where === 'dig' ? 'golden' : 'dusk');
  const r = (o.r ?? V(300, 330)) * (1 + (o.push ?? 0.05) * t / Math.max(1, info.dur));
  let cx = E.W / 2 + (o.x ?? 0), cy = E.H * V(0.6, 0.5) + (o.y ?? 0);
  if (o.shakeAmp) { const [sx, sy] = shake(t, o.shakeAmp, 9); cx += sx; cy += sy; }
  o.under?.(g, cx, cy, r, M);
  bigFace(g, cx, cy, r, { outfit: o.who, expr: o.expr, look: o.look, rimColor: o.rimColor || M.rim, rimSide: o.rimSide ?? -1, tilt: o.tilt, blink: o.blink ?? ((t % 3.3) > 3.18) });
  o.over?.(g, cx, cy, r, M);
  return { cx, cy, r, M };
}
export function bpBack(g, t) {
  const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  g.strokeStyle = alpha(ui.blueprint, 0.08); g.lineWidth = 1.5; const s = 60, o = (t * 6) % s;
  for (let x = -s + o; x < E.W + s; x += s) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); }
  for (let y = -s + o; y < E.H + s; y += s) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  glow(g, E.W / 2, E.H * 0.45, E.W, ui.blueprint, 0.08);
}
// big glowing number/label that pops at `at`
export function bigNum(g, t, str, x, y, at, o = {}) {
  const k = ease.outBack(prog(t, at - 0.1, at + 0.3)); if (k <= 0) return;
  const ui = S().ui, c = o.color || ui.gold;
  g.save(); g.translate(x, y); g.scale(k, k);
  if (o.label) text(g, o.label, 0, -(o.size ?? V(130, 150)) * 0.72, { size: (o.size ?? V(130, 150)) * 0.32, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, str, 0, 0, { size: o.size ?? V(130, 150), color: c, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(c, 0.6), stroke: o.stroke ?? 0, strokeColor: '#000' });
  g.restore();
}
