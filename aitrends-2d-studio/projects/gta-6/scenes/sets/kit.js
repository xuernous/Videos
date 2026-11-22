// sets/kit.js — shared helpers: word timing, face close-ups, paper inserts (report card, test), game case, phone.
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, linGrad, rng } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { bedroom, dining } from './home.js';
import { classroom } from './school.js';
import { hudWorld } from './hud.js';

// time (s, shot-relative) of the first word matching `w` inside this shot, or fallback d
export const wt = (w, info, d) => { const x = wordTime(w, info.shot.start - 0.05); return x != null && x < info.shot.end + 0.5 ? x - info.shot.start : d; };
export const rimOf = (M, d = [0, -1], w) => ({ color: M.rim, dir: d, ...(w ? { w } : {}) });

// blurred, darkened location behind a close-up / insert
export function bgBlur(g, t, where = 'bedroom', o = {}) {
  const cam = { z: o.z ?? 1.6, x: o.x ?? 0, y: o.y ?? -V(200, 300) };
  blurLayer(g, o.blur ?? 14, (g) => {
    if (where === 'dining') dining(g, t, cam, o.set || {});
    else if (where === 'classroom') classroom(g, t, cam, o.set || {});
    else if (where === 'hud') hudWorld(g, t, cam, o.set || {});
    else bedroom(g, t, cam, o.set || {});
  });
  veil(g, '#06050c', o.veil ?? 0.4);
}
// giant face close-up with a slow push. o: {who, expr, talk, look, rimSide, rimColor, tilt, x, y, r, where, set, push, shakeAmp, under, over}
export function faceShot(g, t, info, o) {
  if (o.bg) { blurLayer(g, 14, (g) => o.bg(g, t)); veil(g, '#06050c', o.veil ?? 0.4); } else bgBlur(g, t, o.where, { set: o.set, x: o.bgx ?? 0, veil: o.veil });
  const M = mood(o.where === 'dining' ? 'interiorWarm' : o.where === 'classroom' ? 'interiorCool' : 'night');
  const r = (o.r ?? V(300, 330)) * (1 + (o.push ?? 0.05) * t / Math.max(1, info.dur));
  let cx = E.W / 2 + (o.x ?? 0), cy = E.H * V(0.6, 0.5) + (o.y ?? 0);
  if (o.shakeAmp) { const [sx, sy] = shake(t, o.shakeAmp, 9); cx += sx; cy += sy; }
  o.under?.(g, cx, cy, r, M);
  bigFace(g, cx, cy, r, { outfit: o.who, expr: o.expr, talk: o.talk || 0, look: o.look, rimColor: o.rimColor || M.rim, rimSide: o.rimSide ?? -1, tilt: o.tilt, blink: o.blink ?? ((t % 3.3) > 3.18) });
  o.over?.(g, cx, cy, r, M);
  return { cx, cy, r, M };
}
export function sweat(g, cx, cy, r, t) { const y = cy - r * 0.5 + ((t * 0.3) % 1) * r * 0.3; g.fillStyle = alpha('#cfe6ff', 0.85); g.beginPath(); g.moveTo(cx + r * 0.72, y - r * 0.12); g.quadraticCurveTo(cx + r * 0.8, y, cx + r * 0.72, y + r * 0.05); g.quadraticCurveTo(cx + r * 0.64, y, cx + r * 0.72, y - r * 0.12); g.fill(); }

// ---- paper ----
export const PAPER = () => mix('#f1e8d4', mood('interiorWarm').key, 0.12);
export const BAD = () => S().ui.accent;
export const GOOD = () => S().ui.good;
// stamped grade: ring + number, slams in at `at` (shot time). returns 0..1 progress
export function stamp(g, t, x, y, r, str, col, at, o = {}) {
  const p = prog(t, at, at + 0.18); if (p <= 0) return 0;
  const s = lerp(o.from ?? 2.2, 1, ease.out(p)), a = clamp(p * 1.5);
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.12); g.scale(s, s); g.globalAlpha *= a * (o.a ?? 1);
  if (o.ring !== false) ring(g, 0, 0, r, r * 0.1, col);
  text(g, str, 0, r * 0.06, { size: r * (o.size ?? 1.25), color: col, font: FONTS.title, weight: 700, glow: o.glow ?? 0, glowColor: alpha(col, 0.7) });
  g.restore();
  return p;
}
// report card. rows: [{label, grade, at, good}] ; o: {title, focus (row index to emphasise), hide (row indices hidden)}
export function boletim(g, t, cx, cy, w, rows, o = {}) {
  const h = w * 1.25, x = cx - w / 2, y = cy - h / 2, ink = '#2a2430', pc = PAPER();
  g.save(); g.translate(cx, cy); g.rotate(o.rot ?? -0.03); g.translate(-cx, -cy);
  g.fillStyle = alpha('#000', 0.35); rr(g, x + 18, y + 24, w, h, 10); g.fill();
  rr(g, x, y, w, h, 10); g.fillStyle = pc; g.fill();
  g.fillStyle = shade(S().ui.blueprint, -0.35); g.fillRect(x, y, w, h * 0.13);
  text(g, o.title || 'BOLETIM', cx, y + h * 0.068, { size: w * 0.085, color: '#f6f1e6', font: FONTS.ui, weight: 900, spacing: w * 0.012 });
  seg(g, [[x + w * 0.08, y + h * 0.2], [x + w * 0.6, y + h * 0.2]], 3, alpha(ink, 0.35));
  text(g, 'ALUNO: VOCÊ', x + w * 0.08, y + h * 0.18, { size: w * 0.04, color: alpha(ink, 0.7), font: FONTS.ui, weight: 900, align: 'left' });
  const rh = h * 0.2, y0 = y + h * 0.3;
  rows.forEach((r, i) => {
    const ry = y0 + i * rh, foc = o.focus == null || o.focus === i ? 1 : 0.45;
    g.fillStyle = alpha(ink, 0.08); g.fillRect(x + w * 0.05, ry + rh * 0.85, w * 0.9, 3);
    text(g, r.label, x + w * 0.08, ry + rh * 0.45, { size: w * 0.07, color: alpha(ink, 0.9 * foc + 0.1), font: FONTS.ui, weight: 900, align: 'left' });
    rr(g, x + w * 0.66, ry + rh * 0.08, w * 0.26, rh * 0.74, 10); g.fillStyle = alpha(ink, 0.06); g.fill();
    if (o.hide?.includes(i)) { rr(g, x + w * 0.66, ry + rh * 0.08, w * 0.26, rh * 0.74, 10); g.fillStyle = alpha(ink, 0.25); g.fill(); return; }
    if (r.grade != null) stamp(g, t, x + w * 0.79, ry + rh * 0.45, rh * 0.36, r.grade, r.good ? GOOD() : BAD(), r.at ?? 0, { size: r.grade.length > 2 ? 0.8 : 1.25, glow: r.glow ? 18 : 0 });
  });
  o.extra?.(g, x, y, w, h);
  g.restore();
  return { x, y, w, h, y0, rh };
}
// test sheet with question lines; marks: [{k (line idx), at, kind:'x'|'v'}]
export function testPaper(g, t, cx, cy, w, o = {}) {
  const h = w * 1.3, x = cx - w / 2, y = cy - h / 2, ink = '#2a2430';
  g.save(); g.translate(cx, cy); g.rotate(o.rot ?? 0.03); g.translate(-cx, -cy);
  g.fillStyle = alpha('#000', 0.35); rr(g, x + 16, y + 22, w, h, 8); g.fill();
  rr(g, x, y, w, h, 8); g.fillStyle = PAPER(); g.fill();
  text(g, o.title || 'MATEMÁTICA', x + w * 0.08, y + h * 0.07, { size: w * 0.06, color: alpha(ink, 0.8), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  const n = o.lines ?? 6, lh = (h * 0.72) / n, y0 = y + h * 0.18;
  for (let i = 0; i < n; i++) {
    const ly = y0 + i * lh; text(g, `${i + 1})`, x + w * 0.08, ly + lh * 0.4, { size: w * 0.045, color: alpha(ink, 0.6), font: FONTS.ui, weight: 900, align: 'left' });
    const r = rng(40 + i); g.strokeStyle = alpha('#3a6ea5', 0.55); g.lineWidth = 3; g.beginPath();
    for (let k = 0; k <= 20; k++) { const xx = x + w * 0.2 + k * w * 0.026, yy = ly + lh * 0.4 + Math.sin(k * 1.7 + i) * 6 + (r() - 0.5) * 6; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke();
  }
  for (const m of o.marks || []) {
    const ly = y0 + m.k * lh + lh * 0.4, mx = x + w * 0.86, p = prog(t, m.at, m.at + 0.2); if (p <= 0) continue;
    if (m.from === 'x' && p >= 1 && t > m.at + 0.25) { /* flipped */ }
    const kind = m.kind;
    g.save(); g.globalAlpha *= clamp(p * 2); const s = w * 0.05;
    if (kind === 'x') { seg(g, [[mx - s, ly - s], [mx - s + 2 * s * p, ly - s + 2 * s * p]], 7, BAD()); if (p > 0.5) seg(g, [[mx + s, ly - s], [mx + s - 2 * s * (p - 0.5) * 2, ly - s + 2 * s * (p - 0.5) * 2]], 7, BAD()); }
    else { seg(g, [[mx - s, ly], [mx - s * 0.3, ly + s * 0.7], [mx - s * 0.3 + 1.6 * s * p, ly + s * 0.7 - 1.9 * s * p]], 8, GOOD()); glow(g, mx, ly, s * 2, GOOD(), 0.25 * p); }
    g.restore();
  }
  o.extra?.(g, x, y, w, h);
  g.restore();
  return { x, y, w, h };
}
// the game case: dark cover, neon sunset stripes, "GTA 6" in plain bold type (no logo)
export function gameCase(g, cx, cy, h, o = {}) {
  const w = h * 0.78, x = cx - w / 2, y = cy - h / 2, ui = S().ui, c = mood('interiorCool').practical;
  g.save(); g.translate(cx, cy); g.rotate(o.rot ?? 0); g.translate(-cx, -cy);
  if (o.glow !== false) glow(g, cx, cy, h * 1.1, ui.accent, 0.3 * (o.glowA ?? 1));
  g.fillStyle = alpha('#000', 0.4); rr(g, x + h * 0.03, y + h * 0.05, w, h, h * 0.03); g.fill();
  rr(g, x, y, w, h, h * 0.03); g.fillStyle = '#0a0b14'; g.fill();
  g.save(); rr(g, x + h * 0.04, y + h * 0.1, w - h * 0.08, h * 0.86, h * 0.02); g.clip();
  g.fillStyle = linGrad(g, 0, y, 0, y + h, [shade(ui.accent, -0.2), shade(ui.accent, -0.55), shade(c, -0.6)]); g.fillRect(x, y, w, h);
  const sy = y + h * 0.56, sr = w * 0.3; g.save(); g.beginPath(); g.arc(cx, sy, sr, 0, Math.PI * 2); g.clip(); g.fillStyle = linGrad(g, 0, sy - sr, 0, sy + sr, [ui.gold, ui.accent]); g.fillRect(cx - sr, sy - sr, sr * 2, sr * 2);
  for (let i = 0; i < 6; i++) { g.fillStyle = shade(ui.accent, -0.55); g.fillRect(cx - sr, sy + sr * (0.1 + i * 0.16), sr * 2, 2 + i * 1.6); } g.restore();
  // palm silhouettes + skyline
  g.fillStyle = '#07070d';
  const r = rng(77); for (let bx = x; bx < x + w; bx += w * 0.09) { const bh = h * (0.1 + r() * 0.18); g.fillRect(bx, y + h * 0.8 - bh, w * 0.085, bh); }
  g.fillRect(x, y + h * 0.8, w, h * 0.2);
  for (const [px, s] of [[x + w * 0.18, 1], [x + w * 0.84, 0.8]]) { seg(g, [[px, y + h * 0.82], [px + 6 * s, y + h * (0.5 - 0.05 * s)]], 7 * s, '#07070d'); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.55; seg(g, [[px + 6 * s, y + h * 0.46], [px + 6 * s + Math.cos(a) * 48 * s, y + h * 0.46 + Math.sin(a) * 30 * s + 18 * s]], 6 * s, '#07070d'); } }
  g.restore();
  text(g, 'GTA 6', cx, y + h * 0.26, { size: w * 0.3, color: '#ffffff', font: FONTS.title, weight: 700, glow: 18, glowColor: alpha(ui.accent, 0.9), spacing: 2 });
  g.fillStyle = alpha('#ffffff', 0.85); g.fillRect(x, y, w, h * 0.065);
  g.fillStyle = linGrad(g, x, y, x + w, y + h, [alpha('#ffffff', 0.18), alpha('#ffffff', 0), alpha('#ffffff', 0.05)]); rr(g, x, y, w, h, h * 0.03); g.fill();
  g.restore();
}
// phone with a chat. msgs: [{at, from (0..2 friend idx), str}]
export function phoneChat(g, t, cx, cy, h, msgs, colors, o = {}) {
  const w = h * 0.5, x = cx - w / 2, y = cy - h / 2, ui = S().ui;
  g.save(); g.translate(cx, cy); g.rotate(o.rot ?? -0.05); g.translate(-cx, -cy);
  glow(g, cx, cy, h * 0.8, mood('interiorCool').practical, 0.3);
  rr(g, x, y, w, h, w * 0.12); g.fillStyle = '#07070b'; g.fill();
  rr(g, x + w * 0.05, y + w * 0.05, w * 0.9, h - w * 0.1, w * 0.09); g.fillStyle = '#121624'; g.fill();
  g.fillStyle = '#1b2034'; g.fillRect(x + w * 0.05, y + w * 0.12, w * 0.9, h * 0.08);
  text(g, o.title || 'SQUAD', cx, y + w * 0.12 + h * 0.04, { size: w * 0.075, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 });
  let yy = y + h * 0.26;
  for (const m of msgs) {
    const k = ease.outBack(prog(t, m.at, m.at + 0.3)); if (k <= 0) continue;
    const bw = Math.min(w * 0.68, measure(g, m.str, w * 0.07, FONTS.ui, 900) + w * 0.12), bh = w * 0.15, me = m.from === 'me';
    const bx = me ? x + w * 0.9 - bw : x + w * 0.22;
    g.save(); g.translate(bx + bw / 2, yy + bh / 2); g.scale(k, k); g.translate(-(bx + bw / 2), -(yy + bh / 2));
    if (!me) circle(g, x + w * 0.13, yy + bh / 2, w * 0.055, colors[m.from]);
    rr(g, bx, yy, bw, bh, bh / 2); g.fillStyle = me ? shade(ui.blueprint, -0.3) : '#2a3150'; g.fill();
    text(g, m.str, bx + bw / 2, yy + bh / 2 + 2, { size: w * 0.07, color: '#f2f4ff', font: FONTS.ui, weight: 900 });
    g.restore(); yy += bh * 1.35;
  }
  g.restore();
}
// blueprint card background with a grid
export function bpBack(g, t) {
  const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  g.strokeStyle = alpha(ui.blueprint, 0.08); g.lineWidth = 1.5; const s = 60, o = (t * 6) % s;
  for (let x = -s + o; x < E.W + s; x += s) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); }
  for (let y = -s + o; y < E.H + s; y += s) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  glow(g, E.W / 2, E.H * 0.45, E.W, ui.blueprint, 0.08);
}
