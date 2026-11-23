// sets/kit.js — word timing, face close-ups, blueprint background, big numbers, the HORA chip + body battery HUD.
import { E, V, S, mood, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, rr, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import { room } from './room.js';

export const wt = (w, info, d) => { const x = wordTime(w, info.shot.start - 0.05); return x != null && x < info.shot.end + 0.5 ? x - info.shot.start : d; };
export const zoomAt = (g, cx, cy, z, fn) => { g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); fn(); g.restore(); };
export function bgBlur(g, t, o = {}) {
  const cam = { z: o.z ?? 1.7, x: o.x ?? V(250, 200), y: o.y ?? -V(150, 250) };
  blurLayer(g, o.blur ?? 14, (g) => room(g, t, cam, o.set || {}));
  veil(g, '#05050a', o.veil ?? 0.4);
}
export function faceShot(g, t, info, o) {
  bgBlur(g, t, { set: o.set, x: o.bgx, veil: o.veil });
  const M = mood('night'), SC = mood('interiorCool').practical;
  const r = (o.r ?? V(300, 330)) * (1 + (o.push ?? 0.05) * t / Math.max(1, info.dur));
  let cx = E.W / 2 + (o.x ?? 0), cy = E.H * V(0.6, 0.5) + (o.y ?? 0);
  if (o.shakeAmp) { const [sx, sy] = shake(t, o.shakeAmp, 9); cx += sx; cy += sy; }
  o.under?.(g, cx, cy, r, M);
  bigFace(g, cx, cy, r, { outfit: o.who, expr: o.expr, look: o.look, rimColor: o.rimColor || SC, rimSide: o.rimSide ?? 1, tilt: o.tilt, blink: o.blink ?? ((t % 3.3) > 3.18) });
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
export function bigNum(g, t, str, x, y, at, o = {}) {
  const k = ease.outBack(prog(t, at - 0.1, at + 0.3)); if (k <= 0) return;
  const ui = S().ui, c = o.color || ui.gold, size = o.size ?? V(130, 150);
  g.save(); g.translate(x, y); g.scale(k, k);
  if (o.label) text(g, o.label, 0, -size * 0.72, { size: size * 0.32, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, str, 0, 0, { size, color: c, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(c, 0.6), stroke: o.stroke ?? 0, strokeColor: '#000' });
  g.restore();
}
// HUD: "HORA N" chip (top-left) + body battery (top-right). battery 0..1
export function hud(g, t, hour, battery, o = {}) {
  const ui = S().ui, a = o.a ?? 1; if (a <= 0) return;
  const pop = o.at != null ? 1 + 0.25 * (1 - ease.out(prog(t, o.at, o.at + 0.35))) * (t > o.at ? 1 : 0) : 1;
  g.save(); g.globalAlpha *= a;
  const x = V(70, 70), y = V(90, 210), w = V(300, 320), h = V(96, 104);
  g.save(); g.translate(x + w / 2, y + h / 2); g.scale(pop, pop); g.translate(-(x + w / 2), -(y + h / 2));
  rr(g, x, y, w, h, h / 2); g.fillStyle = alpha('#05050a', 0.75); g.fill(); g.strokeStyle = ui.gold; g.lineWidth = 4; g.stroke();
  text(g, 'HORA', x + 34, y + h / 2, { size: V(34, 36), color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  text(g, String(hour), x + w - 34, y + h / 2 + 2, { size: V(62, 66), color: ui.gold, font: FONTS.ui, weight: 900, align: 'right', glow: 16, glowColor: alpha(ui.gold, 0.6) });
  g.restore();
  const bx = E.W - V(70, 70) - V(230, 240), by = y + h * 0.18, bw = V(200, 210), bh = h * 0.64, col = battery > 0.5 ? ui.good : battery > 0.2 ? ui.gold : ui.accent;
  rr(g, bx, by, bw, bh, 12); g.fillStyle = alpha('#05050a', 0.75); g.fill(); g.strokeStyle = alpha(ui.cream, 0.8); g.lineWidth = 4; g.stroke(); rr(g, bx + bw, by + bh * 0.3, 14, bh * 0.4, 4); g.fillStyle = alpha(ui.cream, 0.8); g.fill();
  rr(g, bx + 8, by + 8, Math.max(4, (bw - 16) * battery), bh - 16, 8); g.fillStyle = col; g.fill(); if (battery < 0.2 && Math.sin(t * 8) > 0) glow(g, bx + bw / 2, by + bh / 2, bw, col, 0.4);
  text(g, 'CORPO', bx + bw / 2, by + bh + V(28, 30), { size: V(24, 26), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
  g.restore();
}
