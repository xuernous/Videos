// sets/kit.js — shared helpers for "A Estrada Cinza": timing, smoke/fire, sirens, face close-ups, option badges,
// money counter, and simple silhouettes (tank, bus, car, dog, rifle, backpack).
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, linGrad, radGrad, rng, noise } from '/engine/core.js';
import { drawFigure, POSES, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';

// word time relative to the shot start (fallback d seconds). Use ASCII fragments: accents are stripped by wordTime.
export const wt = (w, info, d) => { const x = wordTime(w, info.shot.start - 0.05); return (x != null && x < info.shot.end + 0.3 ? x : info.shot.start + d) - info.shot.start; };
export const GYv = () => E.H * V(0.8, 0.68);
export const rimOf = (M, d = [0, -1], w) => ({ color: M.rim, dir: d, ...(w ? { w } : {}) });
export const FIRE = () => mix(mood('night').practical, '#ff4a1a', 0.45);
export const SIREN_R = '#ff3b3b', SIREN_B = '#3b7bff';
export const OPT = () => { const ui = S().ui; return { A: ui.gold, B: '#6fa8ff', C: ui.accent, D: ui.good }; };

// rising smoke plume (drawn as soft overlapping puffs), deterministic
export function smoke(g, x, y, t, o = {}) {
  const { h = 900, w = 160, color = '#3a3a4a', a = 0.5, seed = 1, count = 14, lit = null, drift = 0.25 } = o;
  const r = rng(seed);
  for (let i = 0; i < count; i++) {
    const ph = ((t * 0.08 * (0.8 + r() * 0.4)) + i / count) % 1, rad = w * (0.4 + ph * 1.4) * (0.8 + r() * 0.4);
    const px = x + Math.sin(ph * 3 + i) * w * 0.3 + ph * h * drift, py = y - ph * h;
    g.fillStyle = radGrad(g, px, py, 0, rad, [alpha(color, a * (1 - ph) * 0.9), alpha(color, 0)]);
    g.beginPath(); g.arc(px, py, rad, 0, Math.PI * 2); g.fill();
    if (lit && ph < 0.35) glow(g, px, py + rad * 0.3, rad * 0.9, lit, 0.12 * (1 - ph / 0.35));
  }
}
// flickering fire on a base line
export function fire(g, x, y, w, h, t, o = {}) {
  const c = o.color || FIRE(), core = o.core || '#ffd27a', seed = o.seed || 3;
  glow(g, x, y - h * 0.3, Math.max(w, h) * 2.2, c, 0.45 * (o.a ?? 1));
  g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha *= (o.a ?? 1);
  const n = Math.max(3, Math.round(w / 26));
  for (let i = 0; i < n; i++) {
    const fx = x - w / 2 + (i + 0.5) * w / n, fh = h * (0.55 + 0.45 * (0.5 + 0.5 * noise(t * 3.1 + i * 1.7, seed)));
    const fw = (w / n) * 1.3;
    g.fillStyle = linGrad(g, 0, y - fh, 0, y, [alpha(core, 0), alpha(c, 0.75), alpha(core, 0.9)]);
    g.beginPath(); g.moveTo(fx - fw / 2, y); g.quadraticCurveTo(fx - fw * 0.4, y - fh * 0.5, fx + noise(t * 2 + i, seed + 4) * fw * 0.3, y - fh); g.quadraticCurveTo(fx + fw * 0.4, y - fh * 0.5, fx + fw / 2, y); g.closePath(); g.fill();
  }
  g.restore();
}
// sparks / embers drifting up
export function embers(g, t, o = {}) {
  const { count = 40, area = [0, 0, E.W, E.H], color = '#ffb070', seed = 8, speed = 90, a = 0.8 } = o; const r = rng(seed);
  g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < count; i++) { const x0 = area[0] + r() * area[2], y0 = r() * area[3], sp = speed * (0.6 + r()), y = area[1] + area[3] - ((y0 + t * sp) % area[3]), x = x0 + Math.sin(t * 1.5 + i) * 18; circle(g, x, y, 1.5 + r() * 2.2, alpha(color, a * (0.4 + 0.6 * r()))); }
  g.restore();
}
// red/blue police flash wash (k = 0..1 intensity)
export function sirenWash(g, t, x, y, R, k = 1, speed = 5) {
  const p = Math.sin(t * speed * Math.PI), red = Math.max(0, p), blue = Math.max(0, -p);
  glow(g, x, y, R, SIREN_R, 0.4 * red * k); glow(g, x, y, R, SIREN_B, 0.4 * blue * k);
}

// giant face close-up over a blurred, darkened background. o: {who, expr, look, rimSide, rimColor, push, bg(g,t), y, r, over, under, tilt, talk}
export function faceShot(g, t, info, o) {
  if (o.bg) { blurLayer(g, o.blur ?? 14, (g) => o.bg(g, t)); veil(g, '#05060c', o.veil ?? 0.42); }
  const M = o.M || mood('night');
  const r = (o.r ?? V(300, 330)) * (1 + (o.push ?? 0.05) * t / Math.max(1, info.dur));
  let cx = E.W / 2 + (o.x ?? 0), cy = E.H * V(0.6, 0.47) + (o.y ?? 0);
  if (o.shakeAmp) { const [sx, sy] = shake(t, o.shakeAmp, 9); cx += sx; cy += sy; }
  o.under?.(g, cx, cy, r, M);
  bigFace(g, cx, cy, r, { outfit: o.who, expr: o.expr, talk: o.talk || 0, look: o.look, rimColor: o.rimColor || M.rim, rimSide: o.rimSide ?? -1, tilt: o.tilt, blink: o.blink ?? ((t % 3.3) > 3.18) });
  hoodRing(g, cx, cy, r, o.who);
  o.over?.(g, cx, cy, r, M);
  return { cx, cy, r, M };
}
// yellow hoodie collar around a big face (only for YOU)
function hoodRing(g, cx, cy, r, who) {
  if (!who || who.top !== 'hoodie') return;
  g.save(); g.strokeStyle = shade(who.color, -0.3); g.lineWidth = r * 0.16; g.beginPath(); g.arc(cx, cy + r * 0.05, r * 1.08, Math.PI * 0.62, Math.PI * 0.95); g.stroke();
  g.beginPath(); g.arc(cx, cy + r * 0.05, r * 1.08, Math.PI * 0.05, Math.PI * 0.38); g.stroke(); g.restore();
  seg(g, [[cx - r * 0.22, cy + r * 1.05], [cx - r * 0.26, cy + r * 1.45]], r * 0.035, shade(who.color, 0.5));
  seg(g, [[cx + r * 0.22, cy + r * 1.05], [cx + r * 0.26, cy + r * 1.45]], r * 0.035, shade(who.color, 0.5));
}

// pop-in label with glow. o: {size, color, font, spacing, at, y, x, sub, subColor}
export function popLabel(g, t, str, o = {}) {
  const at = o.at ?? 0.2, k = ease.outBack(prog(t, at, at + 0.4)), a = clamp(k) * (o.out != null ? 1 - prog(t, o.out, o.out + 0.3) : 1);
  if (a <= 0) return;
  const col = o.color || S().ui.gold, x = o.x ?? E.W / 2, y = o.y ?? E.H * 0.17, size = o.size ?? V(96, 110);
  g.save(); g.translate(x, y); g.scale(0.85 + 0.15 * k, 0.85 + 0.15 * k);
  text(g, str, 0, 0, { size, color: col, font: o.font || FONTS.ui, weight: 900, spacing: o.spacing ?? 4, glow: 26, glowColor: alpha(col, 0.6), alpha: a, stroke: o.stroke ?? 0, strokeColor: 'rgba(0,0,0,.6)' });
  if (o.sub) text(g, o.sub, 0, size * 0.78, { size: size * 0.38, color: o.subColor || S().ui.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: a * 0.9 });
  g.restore();
}
// option badge: circle with the letter + title + price pill. o: {letter, title, price, priceColor, at, y}
export function optionBadge(g, t, o) {
  const ui = S().ui, col = OPT()[o.letter], at = o.at ?? 0.05, k = ease.outBack(prog(t, at, at + 0.4)); if (k <= 0) return;
  const y = o.y ?? E.H * 0.13, cx = E.W / 2;
  g.save(); g.translate(cx, y); g.scale(k, k);
  const tw = Math.max(V(300, 300), o.title.length * V(46, 50));
  rr(g, -tw / 2 - 80, -66, tw + 160, 132, 66); g.fillStyle = 'rgba(8,10,20,.72)'; g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.stroke();
  circle(g, -tw / 2 - 14, 0, 50, col); text(g, o.letter, -tw / 2 - 14, 4, { size: 66, color: '#0a0b14', font: FONTS.ui, weight: 900 });
  text(g, o.title, 38, 4, { size: V(64, 70), color: ui.cream, font: FONTS.title, weight: 700, spacing: 4 });
  g.restore();
  if (o.price) {
    const pt = o.priceAt ?? at + 0.8, kp = ease.outBack(prog(t, pt, pt + 0.35)); if (kp <= 0) return;
    g.save(); g.translate(cx, y + 150); g.scale(kp, kp);
    const pc = o.priceColor || ui.gold;
    text(g, o.price, 0, 0, { size: V(70, 78), color: pc, font: FONTS.ui, weight: 900, spacing: 3, glow: 22, glowColor: alpha(pc, 0.6), stroke: 10, strokeColor: 'rgba(0,0,0,.55)' });
    g.restore();
  }
}
// warning tag (coral) e.g. "BARREIRA POLICIAL"
export function warnTag(g, t, str, o = {}) {
  const ui = S().ui, at = o.at ?? 0.3, k = ease.outBack(prog(t, at, at + 0.35)); if (k <= 0) return;
  const y = o.y ?? E.H * 0.2, col = o.color || ui.accent, w = measure(g, str, V(46, 50), FONTS.ui, 900) + str.length * 3 + 150;
  g.save(); g.translate(E.W / 2, y); g.scale(k, k);
  rr(g, -w / 2, -46, w, 92, 18); g.fillStyle = alpha(col, 0.16); g.fill(); g.strokeStyle = col; g.lineWidth = 5; g.stroke();
  poly(g, [[-w / 2 + 34, 22], [-w / 2 + 62, -26], [-w / 2 + 90, 22]], col); text(g, '!', -w / 2 + 62, 6, { size: 34, color: '#0a0b14', font: FONTS.ui, weight: 900 });
  text(g, str, -w / 2 + 110, 4, { align: 'left', size: V(46, 50), color: col, font: FONTS.ui, weight: 900, spacing: 3 });
  g.restore();
}
// "412 MARCOS" money counter
export function money(g, t, value, o = {}) {
  const ui = S().ui, a = o.a ?? 1; if (a <= 0) return; const x = o.x ?? E.W / 2, y = o.y ?? E.H * 0.16, col = o.color || ui.gold;
  text(g, String(Math.round(value)), x, y, { size: o.size ?? V(150, 170), color: col, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(col, 0.6), alpha: a, stroke: 12, strokeColor: 'rgba(0,0,0,.5)' });
  text(g, o.unit ?? 'MARCOS', x, y + (o.size ?? V(150, 170)) * 0.72, { size: V(44, 50), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 10, alpha: a * 0.9 });
}

// ---------- silhouettes ----------
export function backpack(g, x, y, s = 1, col = '#4a4038', open = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -46, -120, 92, 120, 26); g.fillStyle = col; g.fill();
  rr(g, -38, -60, 76, 44, 12); g.fillStyle = shade(col, -0.25); g.fill();
  seg(g, [[-24, -120], [-20, -138], [20, -138], [24, -120]], 7, shade(col, -0.35));
  g.restore();
}
export function tank(g, x, y, s = 1, col = '#11131c', o = {}) {
  g.save(); g.translate(x, y); g.scale(s * (o.facing ?? 1), s);
  rr(g, -260, -70, 520, 70, 34); g.fillStyle = col; g.fill();
  for (let i = 0; i < 7; i++) circle(g, -210 + i * 70, -34, 24, shade(col, 0.12));
  poly(g, [[-230, -70], [230, -70], [200, -130], [-200, -130]], shade(col, 0.05));
  rr(g, -110, -200, 200, 80, 30); g.fillStyle = shade(col, 0.08); g.fill();
  seg(g, [[80, -165], [330 + (o.gun ?? 0), -175]], 18, shade(col, 0.08));
  if (o.rim) { seg(g, [[-200, -131], [200, -131]], 3, alpha(o.rim, 0.7)); seg(g, [[-108, -201], [88, -201]], 3, alpha(o.rim, 0.7)); seg(g, [[90, -175], [330 + (o.gun ?? 0), -184]], 2.5, alpha(o.rim, 0.6)); }
  g.restore();
}
export function bus(g, x, y, s = 1, o = {}) {
  const body = o.color || '#5a6070', win = o.win || '#ffd08a';
  g.save(); g.translate(x, y); g.scale(s * (o.facing ?? 1), s);
  rr(g, -330, -260, 660, 230, 30); g.fillStyle = body; g.fill();
  g.fillStyle = shade(body, -0.35); g.fillRect(-330, -110, 660, 22);
  for (let i = 0; i < 6; i++) { g.fillStyle = alpha(win, 0.75 * (o.lit ?? 1)); g.fillRect(-300 + i * 96, -230, 78, 86); }
  g.fillStyle = shade(body, -0.5); g.fillRect(250, -230, 60, 190);
  circle(g, -200, -30, 40, '#0a0b12'); circle(g, 200, -30, 40, '#0a0b12'); circle(g, -200, -30, 16, '#3a3c48'); circle(g, 200, -30, 16, '#3a3c48');
  if (o.lights !== false) { circle(g, 322, -70, 14, '#fff3cc'); glow(g, 330, -70, 160, '#fff1c0', 0.55); }
  if (o.rim) seg(g, [[-320, -261], [320, -261]], 3, alpha(o.rim, 0.8));
  g.restore();
  if (o.lights !== false && o.beam !== false) FX.lightCone(g, x + 330 * s * (o.facing ?? 1), y - 70 * s, { angle: (o.facing ?? 1) > 0 ? 0.05 : Math.PI - 0.05, spread: 0.32, len: 900 * s, color: '#fff1c0', a: 0.18 });
}
export function car(g, x, y, s = 1, o = {}) {
  const body = o.color || '#3c3f4c', f = o.facing ?? 1;
  g.save(); g.translate(x, y); g.scale(s * f, s);
  g.fillStyle = body; g.beginPath(); g.moveTo(-240, -40); g.lineTo(-240, -100); g.lineTo(-150, -110); g.lineTo(-90, -180); g.lineTo(90, -180); g.lineTo(150, -110); g.lineTo(240, -96); g.lineTo(240, -40); g.closePath(); g.fill();
  g.fillStyle = alpha(o.win || '#1a2030', 0.95); poly(g, [[-80, -168], [-6, -168], [-6, -112], [-136, -112]], g.fillStyle); poly(g, [[6, -168], [80, -168], [134, -112], [6, -112]], alpha(o.win || '#1a2030', 0.95));
  circle(g, -150, -38, 36, '#08090f'); circle(g, 150, -38, 36, '#08090f'); circle(g, -150, -38, 14, '#3a3c48'); circle(g, 150, -38, 14, '#3a3c48');
  if (o.taxi) { rr(g, -40, -206, 80, 26, 6); g.fillStyle = '#e8c23a'; g.fill(); g.save(); g.scale(f, 1); text(g, 'TÁXI', 0, -192, { size: 20, color: '#1a1a1a', font: FONTS.ui, weight: 900 }); g.restore(); for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? '#e8c23a' : '#14141a'; g.fillRect(-200 + i * 40, -72, 40, 14); } }
  if (o.police) { const p = Math.sin((o.t || 0) * 16) > 0; rr(g, -44, -200, 40, 20, 5); g.fillStyle = p ? SIREN_R : shade(SIREN_R, -0.6); g.fill(); rr(g, 4, -200, 40, 20, 5); g.fillStyle = p ? shade(SIREN_B, -0.6) : SIREN_B; g.fill(); glow(g, -24, -190, 160, SIREN_R, p ? 0.6 : 0.05); glow(g, 24, -190, 160, SIREN_B, p ? 0.05 : 0.6); g.fillStyle = '#d8dce6'; g.fillRect(-240, -80, 480, 14); }
  if (o.lights !== false) { circle(g, 236, -70, 10, '#fff3cc'); glow(g, 240, -70, 120, '#fff1c0', 0.5); circle(g, -236, -70, 8, '#ff3a3a'); glow(g, -240, -70, 60, '#ff3a3a', 0.4); }
  if (o.rim) seg(g, [[-88, -181], [88, -181]], 3, alpha(o.rim, 0.8));
  g.restore();
}
export function dog(g, x, y, s = 1, col = '#0a0b12', o = {}) {
  g.save(); g.translate(x, y); g.scale(s * (o.facing ?? 1), s);
  const bark = o.bark || 0;
  seg(g, [[-60, -70], [50, -74]], 34, col);                       // body
  seg(g, [[50, -78], [80, -112 - bark * 6]], 22, col);             // neck
  g.fillStyle = col; g.beginPath(); g.ellipse(96, -122 - bark * 6, 30, 20, 0.2, 0, Math.PI * 2); g.fill(); // head
  seg(g, [[112, -118 - bark * 6], [140, -110 - bark * 4]], 16, col); // snout
  if (bark > 0.3) seg(g, [[118, -104], [138, -96]], 8, col);
  poly(g, [[82, -138 - bark * 6], [92, -168 - bark * 6], [102, -140 - bark * 6]], col); // ear
  for (const [hx, ph] of [[-50, 0], [-30, 1.5], [36, 0.7], [54, 2.2]]) seg(g, [[hx, -64], [hx + Math.sin((o.t || 0) * 10 + ph) * 6 * (o.run || 0), 0]], 10, col);
  seg(g, [[-66, -78], [-96, -110]], 9, col);                        // tail
  if (o.rim) { g.strokeStyle = alpha(o.rim, 0.7); g.lineWidth = 3; g.beginPath(); g.moveTo(-60, -88); g.lineTo(50, -92); g.stroke(); }
  g.restore();
}
// rifle held across the chest — draw on top of a figure using its pose & placement
export function rifle(g, fx, fy, s, facing = 1, col = '#0a0b12') {
  const p = POSES.holdFront; g.save(); g.translate(fx, fy); g.scale(s * facing, s);
  seg(g, [[p.hB[0] - 30, p.hB[1] + 30], [p.hF[0] + 60, p.hF[1] - 30]], 9, col);
  seg(g, [[p.hB[0] - 30, p.hB[1] + 30], [p.hB[0] - 50, p.hB[1] + 52]], 14, col);
  g.restore();
}
// barbed-wire coil along a line
export function wireCoil(g, x0, x1, y, r, col, w = 3) {
  g.strokeStyle = col; g.lineWidth = w; g.beginPath();
  for (let x = x0; x <= x1; x += 4) { const a = (x - x0) / (r * 0.55); const yy = y + Math.sin(a) * r, xx = x + Math.cos(a) * r * 0.5; x === x0 ? g.moveTo(xx, yy) : g.lineTo(xx, yy); }
  g.stroke();
  for (let x = x0; x <= x1; x += r * 0.9) { seg(g, [[x - 8, y - r - 8], [x + 8, y - r + 8]], 2, col); seg(g, [[x + 8, y - r - 8], [x - 8, y - r + 8]], 2, col); }
}
