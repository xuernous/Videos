// sets/lib.js — shared building blocks for "Japão": character extras + weapons, horse, dog, ships, wolf banner,
// the sheath with its marks, the generals roster, name cards, lyrics, face close-ups.
import { E, V, S, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, shake, rng, noise, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, linGrad, radGrad, backdrop, wordTime } from '/engine/core.js';
import { drawFigure, POSES, bigFace, headPos, breathe, walkPose, blendPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';

export const KZ_RED = '#a3202a', GOLD = '#e8b84a', STEEL = '#dfe6f0';
export const rimOf = (M, dir = [0, -1], w = 5) => ({ color: M.rim, dir, w });
export const blinkAt = (t, p = 3.1) => (t % p) > p - 0.12;

// ---------- extra poses ----------
export const PZ = {
  aim:    { head: [6, -207], sh: [1, -173], hip: [0, -100], eF: [34, -174], hF: [66, -176], eB: [-20, -170], hB: [10, -182], kF: [12, -50], fF: [18, 0], kB: [-8, -50], fB: [-18, 0] },
  aimUp:  { head: [4, -208], sh: [0, -173], hip: [0, -100], eF: [30, -196], hF: [56, -214], eB: [-20, -176], hB: [8, -190], kF: [12, -50], fF: [18, 0], kB: [-8, -50], fB: [-18, 0] },
  release:{ head: [6, -207], sh: [1, -173], hip: [0, -100], eF: [34, -174], hF: [66, -176], eB: [-30, -168], hB: [-34, -150], kF: [12, -50], fF: [18, 0], kB: [-8, -50], fB: [-18, 0] },
  guard:  { head: [8, -200], sh: [3, -168], hip: [0, -96], eF: [26, -138], hF: [40, -150], eB: [18, -136], hB: [34, -148], kF: [22, -48], fF: [26, 0], kB: [-14, -48], fB: [-26, 0] },
  slash:  { head: [14, -194], sh: [8, -162], hip: [0, -92], eF: [40, -150], hF: [72, -140], eB: [30, -146], hB: [62, -138], kF: [34, -46], fF: [44, 0], kB: [-20, -44], fB: [-40, 0] },
  raise:  { head: [4, -204], sh: [0, -172], hip: [0, -98], eF: [16, -200], hF: [10, -236], eB: [10, -200], hB: [4, -234], kF: [14, -48], fF: [18, 0], kB: [-12, -48], fB: [-22, 0] },
  ride:   { head: [8, -206], sh: [4, -172], hip: [0, -100], eF: [24, -140], hF: [42, -128], eB: [16, -140], hB: [34, -126], kF: [26, -70], fF: [16, -32], kB: [20, -70], fB: [10, -32] },
  rideAim:{ head: [6, -207], sh: [1, -173], hip: [0, -100], eF: [34, -174], hF: [66, -176], eB: [-20, -170], hB: [10, -182], kF: [26, -70], fF: [16, -32], kB: [20, -70], fB: [10, -32] },
  bow:    { head: [30, -168], sh: [16, -146], hip: [0, -72], eF: [30, -100], hF: [40, -76], eB: [24, -100], hB: [34, -76], kF: [44, -74], fF: [46, 0], kB: [40, -72], fB: [38, 0] },
  kneelLook:{ head: [16, -170], sh: [8, -136], hip: [0, -62], eF: [26, -100], hF: [44, -90], eB: [6, -100], hB: [10, -70], kF: [36, -46], fF: [36, 0], kB: [-6, -4], fB: [-48, 0] },
  place:  { head: [30, -150], sh: [18, -122], hip: [0, -64], eF: [38, -84], hF: [52, -50], eB: [30, -86], hB: [44, -52], kF: [34, -50], fF: [24, 0], kB: [-6, -40], fB: [-30, 0] },
  climb:  { head: [10, -210], sh: [4, -176], hip: [0, -100], eF: [20, -210], hF: [22, -250], eB: [14, -150], hB: [24, -170], kF: [22, -90], fF: [16, -60], kB: [-4, -50], fB: [-10, 0] },
  tiptoe: { head: [16, -190], sh: [8, -158], hip: [0, -90], eF: [26, -128], hF: [40, -138], eB: [-10, -126], hB: [-24, -110], kF: [22, -46], fF: [26, -6], kB: [-12, -46], fB: [-24, -4] },
  hug:    { head: [16, -170], sh: [8, -136], hip: [0, -62], eF: [34, -130], hF: [48, -140], eB: [28, -126], hB: [44, -130], kF: [36, -46], fF: [36, 0], kB: [-6, -4], fB: [-48, 0] },
  carry:  { head: [6, -206], sh: [2, -172], hip: [0, -100], eF: [20, -196], hF: [16, -222], eB: [10, -196], hB: [6, -222], kF: [6, -50], fF: [6, 0], kB: [-6, -50], fB: [-12, 0] },
  sitFire:{ head: [10, -150], sh: [4, -118], hip: [0, -48], eF: [28, -84], hF: [40, -60], eB: [20, -86], hB: [34, -62], kF: [40, -60], fF: [52, 0], kB: [34, -56], fB: [44, 0] },
  lieSide:{ head: [3, -208], sh: [0, -174], hip: [0, -100], eF: [20, -150], hF: [30, -122], eB: [-12, -138], hB: [-20, -104], kF: [14, -52], fF: [6, -4], kB: [-4, -50], fB: [-6, 0] },
};

// world coords of a pose point for a figure option object
export function wp(o, k) { const p = o.pose || POSES.stand, s = (o.s ?? 1) * (o.outfit?.kid ? 0.72 : 1), f = o.facing ?? 1; return [o.x + p[k][0] * f * s, o.y + p[k][1] * s]; }
function scaleOf(o) { return (o.s ?? 1) * (o.outfit?.kid ? 0.72 : 1); }

// draw something twice: offset in rim colour, then in ink (keeps props readable on dark sets)
export function rimmed(g, rim, fn, ink = S().ink) { if (rim) { g.save(); g.translate(rim.dir[0] * (rim.w || 4), rim.dir[1] * (rim.w || 4)); fn(g, rim.color, true); g.restore(); } fn(g, ink, false); }

// ---------- weapons (world space) ----------
export function drawSword(g, x, y, ang, len, o = {}) {      // tachi: curved blade from the hand, slight upward curve
  const { ink = S().ink, steel = STEEL, w = 7, gleam = 0, a = 1 } = o;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(ang);
  seg(g, [[-len * 0.22, 0], [0, 0]], w * 1.6, ink);                           // grip
  rr(g, -3, -w * 1.6, 6, w * 3.2, 2); g.fillStyle = ink; g.fill();           // tsuba
  g.fillStyle = steel; g.beginPath(); g.moveTo(4, -w * 0.5); g.quadraticCurveTo(len * 0.55, -w * 0.9 - len * 0.05, len, -len * 0.09); g.quadraticCurveTo(len * 0.55, w * 0.4 - len * 0.03, 4, w * 0.5); g.closePath(); g.fill();
  if (gleam > 0) { g.save(); g.globalCompositeOperation = 'lighter'; const gx = len * (0.2 + 0.7 * gleam); glow(g, gx, -len * 0.04, 40, '#ffffff', 0.8 * Math.sin(gleam * Math.PI)); g.restore(); }
  g.restore();
}
export function drawSheathAtHip(g, o, ink) {                // saya on the left hip, angled back
  const [hx, hy] = wp(o, 'hip'), s = scaleOf(o), f = o.facing ?? 1;
  seg(g, [[hx + 26 * f * s, hy - 14 * s], [hx - 58 * f * s, hy + 14 * s]], 7 * s, ink);
  seg(g, [[hx + 26 * f * s, hy - 14 * s], [hx + 46 * f * s, hy - 22 * s]], 8 * s, ink);
}
export function drawBow(g, o, ink, drawK = 1) {             // yumi in the near hand; string to the far hand when aiming
  const [bx, by] = wp(o, 'hF'), [sx, sy] = wp(o, 'hB'), s = scaleOf(o), f = o.facing ?? 1;
  const top = [bx - 6 * f * s, by - 112 * s], bot = [bx - 4 * f * s, by + 70 * s], bend = 22 * f * s;
  g.strokeStyle = ink; g.lineWidth = 6 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(...top); g.quadraticCurveTo(bx + bend, by - 30 * s, bx, by); g.quadraticCurveTo(bx + bend * 0.8, by + 30 * s, ...bot); g.stroke();
  const nock = drawK > 0 ? [lerp(bx - 8 * f * s, sx, drawK), lerp(by - 20 * s, sy, drawK)] : [bx - 8 * f * s, by - 20 * s];
  seg(g, [top, nock, bot], 1.6 * s, alpha(o.stringColor || '#d8d0c0', 0.9));
  if (o.arrow !== false && drawK > 0.2) seg(g, [nock, [bx + 30 * f * s, by - 2 * s]], 3 * s, ink);
}
export function drawBowBack(g, o, ink) { const [sx, sy] = wp(o, 'sh'), s = scaleOf(o), f = o.facing ?? 1; g.strokeStyle = ink; g.lineWidth = 5 * s; g.beginPath(); g.moveTo(sx - 30 * f * s, sy - 70 * s); g.quadraticCurveTo(sx - 46 * f * s, sy + 20 * s, sx - 22 * f * s, sy + 96 * s); g.stroke(); seg(g, [[sx - 30 * f * s, sy - 70 * s], [sx - 22 * f * s, sy + 96 * s]], 1.4 * s, alpha('#d8d0c0', 0.6)); }
export function drawQuiver(g, o, ink) { const [sx, sy] = wp(o, 'sh'), s = scaleOf(o), f = o.facing ?? 1; seg(g, [[sx - 16 * f * s, sy - 6 * s], [sx - 6 * f * s, sy + 60 * s]], 12 * s, ink); for (let i = 0; i < 3; i++) seg(g, [[sx - (18 + i * 4) * f * s, sy - 6 * s], [sx - (24 + i * 5) * f * s, sy - 26 * s]], 2 * s, ink); }
export function drawSpear(g, o, ink, len = 300) { const [hx, hy] = wp(o, 'hF'), s = scaleOf(o), a = o.spearAng ?? -1.35, f = o.facing ?? 1; const dx = Math.cos(a) * f, dy = Math.sin(a); seg(g, [[hx - dx * len * 0.35 * s, hy - dy * len * 0.35 * s], [hx + dx * len * 0.65 * s, hy + dy * len * 0.65 * s]], 4.5 * s, ink); const tx = hx + dx * len * 0.65 * s, ty = hy + dy * len * 0.65 * s; poly(g, [[tx + dx * 30 * s, ty + dy * 30 * s], [tx - dy * 7 * s, ty + dx * 7 * s], [tx + dy * 7 * s, ty - dx * 7 * s]], ink); }
export function drawMace(g, o, ink) { const [hx, hy] = wp(o, 'hF'), s = scaleOf(o), a = o.maceAng ?? -1.2, f = o.facing ?? 1; const ex = hx + Math.cos(a) * f * 110 * s, ey = hy + Math.sin(a) * 110 * s; seg(g, [[hx, hy], [ex, ey]], 9 * s, ink); circle(g, ex, ey, 26 * s, ink); for (let i = 0; i < 8; i++) { const b = i * Math.PI / 4; poly(g, [[ex + Math.cos(b) * 40 * s, ey + Math.sin(b) * 40 * s], [ex + Math.cos(b + 0.3) * 22 * s, ey + Math.sin(b + 0.3) * 22 * s], [ex + Math.cos(b - 0.3) * 22 * s, ey + Math.sin(b - 0.3) * 22 * s]], ink); } }
export function drawTorch(g, o, ink, t = 0, fireCol = '#ffb04a') { const [hx, hy] = wp(o, 'hF'), s = scaleOf(o); seg(g, [[hx, hy + 20 * s], [hx + 6 * s, hy - 40 * s]], 6 * s, ink); flame(g, hx + 6 * s, hy - 44 * s, 18 * s, t, fireCol); }

// ---------- character wrapper ----------
// drawChar(g, {...drawFigure opts, outfit (with x extras), weapon: 'sword'|'sheath'|'bow'|'bowBack'|'spear'|'mace'|'torch'|[..], swordAng, drawK})
export function drawChar(g, o) {
  const st = S(), ink = o.ink || st.ink, rim = o.rim === false ? null : (o.rim || null);
  const weapons = [].concat(o.weapon || []);
  const back = (gg, c, isRim) => { for (const w of weapons) { if (w === 'bowBack') drawBowBack(gg, o, c); if (w === 'quiver') drawQuiver(gg, o, c); if (w === 'sheath' && !isRim) drawSheathAtHip(gg, o, c); } };
  g.save(); if (o.alpha != null) g.globalAlpha *= o.alpha;
  rimmed(g, rim, back, ink);
  g.restore();
  drawFigure(g, o);
  g.save(); if (o.alpha != null) g.globalAlpha *= o.alpha;
  const front = (gg, c, isRim) => {
    extras(gg, o, c, isRim);
    for (const w of weapons) {
      if (w === 'sword') { const [hx, hy] = wp(o, 'hF'); const f = o.facing ?? 1; const a = o.swordAng ?? -0.9; drawSword(gg, hx, hy, f > 0 ? a : Math.PI - a, (o.swordLen ?? 150) * scaleOf(o), { ink: c, steel: isRim ? c : (o.steel || STEEL), w: 6 * scaleOf(o), gleam: isRim ? 0 : (o.gleam || 0) }); }
      if (w === 'bow') drawBow(gg, o, c, o.drawK ?? 0);
      if (w === 'spear') drawSpear(gg, o, c, o.spearLen ?? 300);
      if (w === 'mace') drawMace(gg, o, c);
      if (w === 'torch') { const [hx, hy] = wp(o, 'hF'), s = scaleOf(o); seg(gg, [[hx, hy + 20 * s], [hx + 6 * s, hy - 40 * s]], 6 * s, c); }
      if (w === 'sheath' && !isRim) { /* drawn behind */ }
    }
  };
  rimmed(g, rim, front, ink);
  for (const w of weapons) if (w === 'torch') { const [hx, hy] = wp(o, 'hF'), s = scaleOf(o); flame(g, hx + 6 * s, hy - 44 * s, 18 * s, o.t ?? 0); }
  g.restore();
}
function extras(g, o, c, isRim) {
  const xs = o.outfit?.x || []; if (!xs.length) return;
  const [hx, hy, r] = headPos(o), f = o.facing ?? 1;
  for (const x of xs) {
    if (x === 'topknot') { circle(g, hx - 4 * f * r / 26, hy - r * 1.02, r * 0.3, c); seg(g, [[hx - 4 * f * r / 26, hy - r * 1.0], [hx - 22 * f * r / 26, hy - r * 1.22]], r * 0.22, c); }
    if (x === 'helmet') { g.fillStyle = c; g.beginPath(); g.ellipse(hx, hy - r * 0.25, r * 1.1, r * 0.95, 0, Math.PI, Math.PI * 2); g.fill(); poly(g, [[hx - r * 0.18, hy - r * 1.05], [hx + r * 0.18, hy - r * 1.05], [hx, hy - r * 1.7]], c); if (!isRim) { seg(g, [[hx - r * 1.15, hy - r * 0.22], [hx + r * 1.15, hy - r * 0.22]], r * 0.16, shade(KZ_RED, -0.2)); } }
    if (x === 'crown') { const col = isRim ? c : GOLD; poly(g, [[hx - r * 0.75, hy - r * 0.7], [hx + r * 0.75, hy - r * 0.7], [hx + r * 0.85, hy - r * 1.35], [hx + r * 0.42, hy - r * 1.0], [hx, hy - r * 1.5], [hx - r * 0.42, hy - r * 1.0], [hx - r * 0.85, hy - r * 1.35]], col); if (!isRim) glow(g, hx, hy - r * 1.1, r * 1.6, GOLD, 0.25); }
    if (x === 'eboshi') { poly(g, [[hx - r * 0.7, hy - r * 0.6], [hx + r * 0.5, hy - r * 0.62], [hx + r * 0.25, hy - r * 2.0], [hx - r * 0.45, hy - r * 1.7]].map(([px, py]) => [hx + (px - hx) * f, py]), c); }
    if (x === 'kasa') { poly(g, [[hx - r * 1.9, hy - r * 0.45], [hx + r * 1.9, hy - r * 0.45], [hx, hy - r * 1.45]], isRim ? c : '#8a7a50'); if (!isRim) seg(g, [[hx - r * 1.9, hy - r * 0.45], [hx + r * 1.9, hy - r * 0.45]], r * 0.12, '#5a4a30'); }
    if (x === 'beard' && !isRim) { g.fillStyle = '#e8e2d6'; g.beginPath(); g.moveTo(hx + f * r * 0.05, hy + r * 0.45); g.quadraticCurveTo(hx + f * r * 0.55, hy + r * 1.35, hx + f * r * 0.85, hy + r * 0.35); g.closePath(); g.fill(); }
  }
}

// ---------- fire ----------
export function flame(g, x, y, s, t, col = '#ffb04a') {
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y - s * 0.4, s * 4.2, col, 0.35);
  for (let i = 0; i < 3; i++) { const k = 1 - i * 0.28, fl = Math.sin(t * 13 + i * 2) * 0.12 + Math.sin(t * 7.3 + i) * 0.08; g.fillStyle = i === 2 ? '#fff4d0' : i === 1 ? '#ffd27a' : col;
    g.beginPath(); g.moveTo(x - s * 0.55 * k, y); g.quadraticCurveTo(x - s * 0.6 * k, y - s * 0.9 * k, x + fl * s, y - s * (1.9 + fl) * k); g.quadraticCurveTo(x + s * 0.6 * k, y - s * 0.9 * k, x + s * 0.55 * k, y); g.closePath(); g.fill(); }
  g.restore();
}
export function embers(g, t, o = {}) { const { seed = 21, count = 60, area = [0, 0, E.W, E.H], color = '#ffb060', speed = 60, size = 2.4 } = o; const r = rng(seed); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < count; i++) { const sp = 0.5 + r(), x = area[0] + ((r() * area[2] + Math.sin(t * 1.3 + i) * 30) % area[2]), y = area[1] + area[3] - (((r() * area[3]) + t * speed * sp) % area[3]); const a = 0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i)); glow(g, x, y, size * 4, color, a * 0.6); circle(g, x, y, size * 0.6, alpha('#fff0c0', a)); } g.restore(); }
export function smoke(g, t, x, y, o = {}) { const { seed = 4, count = 9, color = '#2a2230', a = 0.35, w = 120, rise = 500 } = o; const r = rng(seed); for (let i = 0; i < count; i++) { const ph = ((t * 0.08 + r()) % 1), rr2 = w * (0.6 + ph * 1.8); g.fillStyle = alpha(color, a * (1 - ph)); g.beginPath(); g.arc(x + noise(ph * 3 + i, seed) * 80 + ph * 160, y - ph * rise, rr2, 0, Math.PI * 2); g.fill(); } }

// ---------- animals ----------
// horse facing +x, hooves at y; gallop phase; s ~ 1 → 170 units tall
export function drawHorse(g, x, y, s, f, t, o = {}) {
  const { gallop = true, speed = 1.6, ink = S().ink, rim = null, sink = 0, rearing = 0, phase0 = 0 } = o;
  const body = (gg, c) => {
    gg.save(); gg.translate(x, y + sink * s); gg.scale(f * s, s);
    const ph = t * speed * Math.PI * 2 + phase0, bob = gallop ? Math.sin(ph * 2) * 5 : Math.sin(t * 2) * 1;
    gg.rotate(-rearing * 0.5);
    const leg = (hx, hy, a, b) => { const kx = hx + Math.sin(a) * 26, ky = hy + 44; const fx = kx + Math.sin(b) * 26, fy = ky + 44 - Math.max(0, Math.cos(b)) * 6; seg(gg, [[hx, hy], [kx, ky], [fx, fy]], 9, c); };
    const L = gallop ? [ph, ph + 0.6, ph + Math.PI, ph + Math.PI + 0.5] : [0.1, -0.1, 0.15, -0.15];
    const k = gallop ? 1 : 0.3;
    leg(40, -98 + bob, Math.sin(L[0]) * 0.7 * k, Math.sin(L[0] - 0.8) * 0.9 * k); leg(-48, -98 + bob, Math.sin(L[2]) * 0.7 * k, Math.sin(L[2] + 0.6) * 0.6 * k);
    gg.fillStyle = c; gg.beginPath(); gg.ellipse(-4, -112 + bob, 70, 30, 0, 0, Math.PI * 2); gg.fill();
    poly(gg, [[34, -128 + bob], [60, -100 + bob], [96, -170 + bob], [74, -186 + bob]], c);
    gg.save(); gg.translate(96, -178 + bob); gg.rotate(0.55); gg.beginPath(); gg.ellipse(10, 0, 32, 13, 0, 0, Math.PI * 2); gg.fill(); gg.restore();
    poly(gg, [[80, -196 + bob], [86, -214 + bob], [92, -192 + bob]], c);
    gg.strokeStyle = c; gg.lineWidth = 9; gg.lineCap = 'round'; gg.beginPath(); gg.moveTo(-70, -122 + bob); gg.quadraticCurveTo(-104, -110 + bob + Math.sin(ph) * 6, -110, -70 + bob + Math.sin(ph) * 8); gg.stroke();
    for (let i = 0; i < 4; i++) seg(gg, [[48 + i * 9, -150 - i * 10 + bob], [36 + i * 9, -146 - i * 10 + bob + Math.sin(ph + i) * 3]], 5, c);
    leg(48, -98 + bob, Math.sin(L[1]) * 0.7 * k, Math.sin(L[1] - 0.8) * 0.9 * k); leg(-40, -98 + bob, Math.sin(L[3]) * 0.7 * k, Math.sin(L[3] + 0.6) * 0.6 * k);
    gg.restore();
  };
  if (rim) { g.save(); g.translate(rim.dir[0] * (rim.w || 4), rim.dir[1] * (rim.w || 4)); body(g, rim.color); g.restore(); }
  if (!sink) { g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(x, y + 2, 90 * s, 9 * s, 0, 0, Math.PI * 2); g.fill(); }
  body(g, ink);
  const bob = gallop ? Math.sin((t * speed * Math.PI * 2 + phase0) * 2) * 5 : 0;
  return { saddle: [x - 4 * f * s, y + (-140 + bob + sink) * s] };
}
// a rider on a horse: returns the figure option object used
export function rider(g, hx, hy, hs, f, t, fig, horseO = {}) {
  const h = drawHorse(g, hx, hy, hs, f, t, horseO);
  const fs = fig.s ?? hs * 1.0;
  const o = { pose: PZ.ride, ...fig, x: h.saddle[0], y: h.saddle[1] + 100 * fs, s: fs, facing: f, shadow: false };
  drawChar(g, o); return o;
}
export function drawDog(g, x, y, s, f, t, o = {}) {
  const { ink = S().ink, rim = null, run = true } = o;
  const body = (gg, c) => { gg.save(); gg.translate(x, y); gg.scale(f * s, s); const ph = t * 9, bob = run ? Math.sin(ph * 2) * 3 : 0;
    const leg = (lx, a) => seg(gg, [[lx, -34 + bob], [lx + Math.sin(a) * 14, -14], [lx + Math.sin(a) * 18, 0]], 5, c);
    leg(18, run ? Math.sin(ph) : 0.1); leg(-22, run ? Math.sin(ph + Math.PI) : -0.1);
    gg.fillStyle = c; gg.beginPath(); gg.ellipse(0, -40 + bob, 32, 12, 0, 0, Math.PI * 2); gg.fill();
    poly(gg, [[22, -46 + bob], [44, -62 + bob], [62, -52 + bob], [44, -40 + bob]], c); poly(gg, [[38, -60 + bob], [42, -76 + bob], [48, -60 + bob]], c);
    seg(gg, [[-30, -44 + bob], [-48, -58 + bob + Math.sin(ph) * 4]], 4, c);
    leg(26, run ? Math.sin(ph + 0.7) : -0.1); leg(-14, run ? Math.sin(ph + Math.PI + 0.7) : 0.1); gg.restore(); };
  if (rim) { g.save(); g.translate(rim.dir[0] * 3, rim.dir[1] * 3); body(g, rim.color); g.restore(); }
  body(g, ink);
}

// ---------- the black wolf on red ----------
const WOLF = [[0, 0.88], [0.26, 0.5], [0.58, 0.12], [0.66, -0.3], [0.52, -0.96], [0.24, -0.46], [0, -0.38], [-0.24, -0.46], [-0.52, -0.96], [-0.66, -0.3], [-0.58, 0.12], [-0.26, 0.5]];
export function wolfEmblem(g, x, y, r, col = '#0a0708', eye = KZ_RED) {
  poly(g, WOLF.map(([a, b]) => [x + a * r, y + b * r]), col);
  poly(g, [[x - r * 0.36, y - 0.08 * r], [x - r * 0.1, y + 0.02 * r], [x - r * 0.3, y + 0.06 * r]], eye);
  poly(g, [[x + r * 0.36, y - 0.08 * r], [x + r * 0.1, y + 0.02 * r], [x + r * 0.3, y + 0.06 * r]], eye);
  poly(g, [[x - r * 0.1, y + 0.62 * r], [x + r * 0.1, y + 0.62 * r], [x, y + 0.76 * r]], eye);
}
// waving banner on a pole: red cloth + wolf. (x,y) = pole top
export function banner(g, x, y, w, h, t, o = {}) {
  const { pole = S().ink, cloth = KZ_RED, f = 1, wind = 1, emblem = true, a = 1 } = o;
  g.save(); g.globalAlpha *= a; seg(g, [[x, y - 6], [x, y + h * 2.2]], Math.max(3, w * 0.05), pole);
  const N = 14, pts = []; for (let i = 0; i <= N; i++) { const u = i / N; pts.push([x + f * u * w, y + Math.sin(t * 4 * wind - u * 5) * 10 * u * wind]); }
  g.fillStyle = cloth; g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); for (let i = N; i >= 0; i--) g.lineTo(pts[i][0], pts[i][1] + h); g.closePath(); g.fill();
  g.fillStyle = 'rgba(0,0,0,.25)'; for (let i = 0; i < N; i += 2) { const p = pts[i], q = pts[i + 1]; if (Math.sin(t * 4 * wind - (i / N) * 5) > 0.3) { g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.lineTo(q[0], q[1] + h); g.lineTo(p[0], p[1] + h); g.fill(); } }
  if (emblem) { const m = pts[Math.round(N * 0.55)]; wolfEmblem(g, m[0], m[1] + h * 0.5, h * 0.36, '#0a0708', '#e04a3a'); }
  g.restore();
}

// ---------- ships ----------
// ship: waterline at (x,y). s=1 → hull 260 wide. o: {sail:'red'|'dark'|colour, f, t, tilt, lit, emblem}
export function ship(g, x, y, s, o = {}) {
  const { f = 1, t = 0, tilt = 0, hull = '#120d10', sail = KZ_RED, emblem = true, lit = 0, rimC = null, sails = 1, bob = 1 } = o;
  g.save(); g.translate(x, y + Math.sin(t * 1.3 + x * 0.01) * 3 * s * bob); g.rotate(tilt + Math.sin(t * 0.9 + x * 0.02) * 0.02 * bob); g.scale(f * s, s);
  const H = () => { g.beginPath(); g.moveTo(-130, -40); g.lineTo(150, -48); g.quadraticCurveTo(140, -10, 100, 10); g.lineTo(-100, 10); g.quadraticCurveTo(-130, -10, -140, -56); g.closePath(); };
  if (rimC) { g.save(); g.translate(0, -3); H(); g.fillStyle = rimC; g.fill(); g.restore(); }
  H(); g.fillStyle = hull; g.fill();
  g.fillStyle = shade(hull, 0.1); g.fillRect(-120, -36, 250, 6);
  if (lit) for (let i = 0; i < 5; i++) { circle(g, -80 + i * 42, -20, 4, alpha('#ffc070', lit)); glow(g, -80 + i * 42, -20, 30, '#ffb050', lit * 0.5); }
  const mast = (mx, mh, sw) => {
    seg(g, [[mx, -40], [mx, -40 - mh]], 7, hull); seg(g, [[mx - sw / 2, -40 - mh + 12], [mx + sw / 2, -40 - mh + 12]], 5, hull);
    const sy0 = -40 - mh + 14, sh = mh * 0.62; g.fillStyle = sail; g.beginPath(); g.moveTo(mx - sw / 2, sy0); g.lineTo(mx + sw / 2, sy0); g.quadraticCurveTo(mx + sw / 2 + 14, sy0 + sh / 2, mx + sw / 2, sy0 + sh); g.lineTo(mx - sw / 2, sy0 + sh); g.quadraticCurveTo(mx - sw / 2 + 14, sy0 + sh / 2, mx - sw / 2, sy0); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 3; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(mx - sw / 2, sy0 + sh * k / 4); g.lineTo(mx + sw / 2, sy0 + sh * k / 4); g.stroke(); }
    if (emblem) wolfEmblem(g, mx + 4, sy0 + sh * 0.5, sh * 0.3, '#0a0708', alpha('#000', 0));
    const fl = (u) => [mx + u * 50, -40 - mh - 6 + Math.sin(t * 5 - u * 4) * 5 * u]; g.fillStyle = sail; g.beginPath(); g.moveTo(mx, -40 - mh); for (let k = 0; k <= 6; k++) { const p = fl(k / 6); g.lineTo(p[0], p[1]); } for (let k = 6; k >= 0; k--) { const p = fl(k / 6); g.lineTo(p[0], p[1] + 12); } g.fill();
  };
  mast(10, 230, 160); if (sails > 1) mast(-80, 170, 110);
  g.restore();
}
// a far fleet strip: many small ships along the horizon. count, spread, y horizon.
export function fleet(g, t, o = {}) { const { seed = 31, count = 40, x0 = -E.W * 0.5, x1 = E.W * 1.5, y = E.H * 0.5, s0 = 0.12, s1 = 0.3, hull = '#120d10', sail = KZ_RED, rows = 3, appear = 1, rimC = null } = o; const r = rng(seed); const items = []; for (let i = 0; i < count; i++) items.push({ x: lerp(x0, x1, r()), row: Math.floor(r() * rows), k: r(), f: r() < 0.5 ? 1 : -1 }); items.sort((a, b) => a.row - b.row); for (const it of items) { if (it.k > appear) continue; const s = lerp(s0, s1, it.row / Math.max(1, rows - 1)); ship(g, it.x, y + it.row * 26 * (s / s0) * 0.5, s, { f: it.f, t, hull, sail, emblem: s > 0.18, rimC, sails: it.k < 0.4 ? 2 : 1 }); } }

// sea: horizon band + waves. y = horizon.
export function sea(g, t, y, M, o = {}) {
  const { color = shade(M.sky[0], -0.2), deep = shade(M.dark, -0.3), glint = M.key, jade = null, calm = 0, a = 1 } = o;
  g.fillStyle = linGrad(g, 0, y, 0, E.H * 1.6, [jade ? mix(jade, color, 0.35) : color, deep]); g.fillRect(-E.W, y, E.W * 3, E.H * 2);
  g.strokeStyle = alpha(glint, 0.16 * a); g.lineWidth = 2;
  for (let i = 0; i < 26; i++) { const yy = y + 6 + i * i * 2.2, sp = (1 - calm) * (10 + i * 3); for (let k = -4; k < 14; k++) { const xx = ((k * 220 + i * 97 + t * sp) % (E.W * 2.4)) - E.W * 0.6; g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + 40 + i * 6, yy); g.stroke(); } }
}

// ---------- the sheath (central motif) ----------
// sheathInsert: big horizontal saya with N marks. newMark: index (1-based) that is being cut at cutAt (seconds into the shot)
export function sheath(g, cx, cy, len, t, o = {}) {
  const { marks = 0, newMark = 0, cutAt = 0.4, rot = -0.08, lit = '#ffd59a', highlight = 0, hiFrom = 1, hiTo = 0, old = false } = o;
  g.save(); g.translate(cx, cy); g.rotate(rot);
  const L = len, Hh = len * 0.045;
  const shape = () => { g.beginPath(); g.moveTo(-L / 2, -Hh); g.quadraticCurveTo(0, -Hh * 2.2, L / 2 - L * 0.32, -Hh * 1.4); g.lineTo(L / 2 - L * 0.32, Hh * 1.2); g.quadraticCurveTo(0, Hh * 0.2, -L / 2, Hh); g.quadraticCurveTo(-L / 2 - Hh, 0, -L / 2, -Hh); g.closePath(); };
  g.save(); g.translate(0, -5); shape(); g.fillStyle = alpha(lit, 0.9); g.fill(); g.restore();
  shape(); g.fillStyle = linGrad(g, 0, -Hh * 2, 0, Hh * 1.4, [old ? '#3a2418' : '#2a1414', old ? '#1a0e0a' : '#120808']); g.fill();
  g.strokeStyle = alpha(lit, 0.35); g.lineWidth = 3; g.beginPath(); g.moveTo(-L / 2 + 20, -Hh * 0.9); g.quadraticCurveTo(0, -Hh * 1.9, L / 2 - L * 0.34, -Hh * 1.25); g.stroke();
  // tsuba + grip
  const gx = L / 2 - L * 0.32; g.fillStyle = '#0c0a0a'; g.beginPath(); g.ellipse(gx + 8, -Hh * 0.1, 12, Hh * 2.4, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = alpha(GOLD, 0.6); g.lineWidth = 3; g.beginPath(); g.ellipse(gx + 8, -Hh * 0.1, 12, Hh * 2.4, 0, 0, Math.PI * 2); g.stroke();
  rr(g, gx + 20, -Hh * 1.1, L * 0.3, Hh * 2.0, Hh * 0.6); g.fillStyle = '#16100e'; g.fill();
  g.strokeStyle = alpha('#c9b8a0', 0.55); g.lineWidth = 3; for (let x = gx + 34; x < gx + 20 + L * 0.3 - 10; x += 26) { g.beginPath(); g.moveTo(x, -Hh * 1.05); g.lineTo(x + 13, Hh * 0.85); g.moveTo(x + 13, -Hh * 1.05); g.lineTo(x, Hh * 0.85); g.stroke(); }
  // marks: notches along the top edge, from the mouth (right) toward the tip
  const markX = (i) => gx - 70 - (i - 1) * L * 0.055;
  for (let i = 1; i <= marks; i++) {
    let k = 1; if (i === newMark) k = ease.out(prog(t, cutAt, cutAt + 0.35));
    if (k <= 0) continue;
    const x = markX(i), yTop = -Hh * (1.25 + 0.6 * (1 - Math.abs(x) / (L / 2))), deep = i === 8 ? 1.5 : 1, tw = i === 8 ? 0.35 : 0;
    const hi = highlight && i >= hiFrom && i <= hiTo ? highlight : 0;
    g.save(); g.translate(x, yTop); g.rotate(tw);
    const d = Hh * 1.3 * deep * k;
    poly(g, [[-6, -2], [6, -2], [1.5, d]], mix('#c9a676', '#fff2c8', hi));
    if (hi > 0) { g.globalCompositeOperation = 'lighter'; glow(g, 0, d * 0.4, 46, '#ffd27a', hi * 0.7); }
    g.restore();
    if (i === newMark && t > cutAt && t < cutAt + 0.6) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, yTop, 80, '#fff2c8', 1 - prog(t, cutAt, cutAt + 0.6)); g.restore(); }
  }
  g.restore();
  return { markX: (i) => [cx + Math.cos(rot) * markX(i), cy + Math.sin(rot) * markX(i)] };
}
export const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
export function knife(g, x, y, ang, s = 1, col = S().ink, steel = STEEL) { g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s); rr(g, -150, -14, 110, 28, 10); g.fillStyle = col; g.fill(); g.fillStyle = steel; g.beginPath(); g.moveTo(-40, -10); g.lineTo(60, -6); g.lineTo(80, 4); g.lineTo(-40, 10); g.closePath(); g.fill(); g.restore(); }

// ---------- roster of generals ----------
export const ROSTER = [
  { n: 'ORDEK', e: 'O PRIMEIRO A DESEMBARCAR' }, { n: 'HARSA', e: 'SENHORA DOS CAVALOS' }, { n: 'VELKUN', e: 'O ENGENHEIRO' }, { n: 'SABETH', e: 'O CAÇADOR' },
  { n: 'GORUUN', e: 'O GIGANTE' }, { n: 'MASANOBU', e: 'O TRAIDOR' }, { n: 'ISHKAR', e: 'O IRMÃO' }, { n: 'TARVOS', e: 'O IMPERADOR' },
];
// roster(g, t, {shown: n slots visible (can be fractional for pop-in), crossed: n crossed, crossAt: [times], unknown: hide names})
export function roster(g, t, o = {}) {
  const { shown = 8, crossed = 0, crossT = null, y = E.H * 0.5, names = true, a = 1, silhouettes = null, hot = -1 } = o;
  const ui = S().ui, n = 8, gap = Math.min(220, E.W * 0.86 / n), x0 = E.W / 2 - gap * (n - 1) / 2;
  g.save(); g.globalAlpha *= a;
  for (let i = 0; i < n; i++) {
    const k = clamp(shown - i); if (k <= 0) continue; const x = x0 + i * gap, s = ease.outBack(k);
    g.save(); g.translate(x, y); g.scale(s, s);
    rr(g, -gap * 0.42, -190, gap * 0.84, 330, 16); g.fillStyle = alpha('#0a0608', 0.75); g.fill(); g.strokeStyle = alpha(i === hot ? ui.gold : ui.cream, i === hot ? 0.9 : 0.25); g.lineWidth = 2; g.stroke();
    const sil = silhouettes?.[i]; const fo = { x: 0, y: 70, s: 0.95, facing: 1, outfit: sil || { top: 'trench', color: '#1a1416', x: ['helmet'] }, pose: POSES.stand, expr: 'determined', rim: { color: alpha(ui.cream, 0.6), dir: [0, -1], w: 3 }, shadow: false };
    drawChar(g, fo);
    if (names) text(g, ROSTER[i].n, 0, 112, { size: 24, font: FONTS.ui, weight: 900, color: ui.cream, spacing: 2 });
    let ck = i < crossed ? 1 : 0; if (crossT && crossT[i] != null) ck = ease.out(prog(t, crossT[i], crossT[i] + 0.3));
    if (ck > 0) { g.save(); g.globalCompositeOperation = 'source-over'; seg(g, [[-gap * 0.36, -170], [lerp(-gap * 0.36, gap * 0.36, ck), lerp(-170, 126, ck)]], 12, '#d23a2a'); g.restore(); if (ck > 0.99) { g.fillStyle = alpha('#000', 0.35); rr(g, -gap * 0.42, -190, gap * 0.84, 330, 16); g.fill(); } }
    g.restore();
  }
  g.restore();
}
// lower-third name card for a character intro
export function nameCard(g, t, dur, name, epithet, o = {}) {
  const { x = V(140, 80), y = E.H * V(0.74, 0.7), color = S().ui.gold, a: aa = 1 } = o; const ui = S().ui;
  const a = clamp(Math.min((t - 0.2) / 0.4, (dur - t) / 0.35)) * aa; if (a <= 0) return;
  const sl = ease.out(prog(t, 0.2, 0.8));
  g.save(); g.globalAlpha *= a;
  g.fillStyle = color; g.fillRect(x, y - 52, 6, 104);
  text(g, name, x + 28 + (1 - sl) * -30, y - 16, { size: V(64, 70), color, align: 'left', glow: 18, glowColor: alpha(color, 0.5), spacing: 3 });
  if (epithet) text(g, epithet, x + 30 + (1 - sl) * -20, y + 34, { size: V(28, 32), color: ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 4, alpha: 0.85 });
  g.restore();
}
// song lyrics in serif italic, lines appear on their first word
export function lyrics(g, t, info, lines, o = {}) {
  const { y = E.H * 0.24, size = V(54, 56), color = '#f6ecd8', gap = 1.18 } = o;
  const gt = info.globalT, after = info.shot.start - 0.2;
  lines.forEach((ln, i) => {
    const wt = o.times?.[i] ?? wordTime(ln.split(' ')[0], after) ?? info.shot.start + i;
    const a = clamp((gt - wt + 0.15) / 0.5) * clamp((info.shot.end - gt) / 0.4);
    if (a <= 0) return;
    text(g, ln, E.W / 2, y + i * size * gap, { size, font: FONTS.serif, weight: 900, italic: true, color, glow: 20, glowColor: 'rgba(255,190,110,.55)', alpha: a });
  });
}
// a big glowing roman numeral for the marks
export function markNumeral(g, t, n, o = {}) { const { x = E.W * 0.78, y = E.H * 0.42, size = V(170, 190), color = '#ffd27a' } = o; const k = ease.outBack(prog(t, o.at ?? 0.5, (o.at ?? 0.5) + 0.45)); if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); text(g, ROMAN[n], 0, 0, { size, font: FONTS.serif, weight: 900, color, glow: 40, glowColor: alpha(color, 0.75), spacing: 6 }); g.restore(); }

// ---------- face close-up ----------
// faceShot(g, t, info, {bg:(g,t)=>..., who, expr, talk, look, rimColor, rimSide, x, y, r, push, tilt, mood, veilA, blur, over, under})
export function faceShot(g, t, info, o) {
  const M = o.M || mood(o.mood || 'night');
  if (o.bg) { blurLayer(g, o.blur ?? 14, (gg) => o.bg(gg, t)); veil(g, '#06050a', o.veilA ?? 0.42); }
  const r = (o.r ?? V(290, 330)) * (1 + (o.push ?? 0.05) * ease.inOut(t / Math.max(0.5, info.dur)));
  let cx = E.W / 2 + (o.x ?? 0), cy = E.H * V(0.6, 0.52) + (o.y ?? 0);
  if (o.shakeAmp) { const [sx, sy] = shake(t, o.shakeAmp, 8); cx += sx; cy += sy; }
  o.under?.(g, cx, cy, r, M);
  bigFace(g, cx, cy, r, { outfit: o.who, expr: typeof o.expr === 'function' ? o.expr(t) : o.expr, talk: o.talk || 0, look: o.look, rimColor: o.rimColor || M.rim, rimSide: o.rimSide ?? -1, tilt: o.tilt, blink: o.blink ?? blinkAt(t, o.blinkP || 3.3) });
  bigExtras(g, cx, cy, r, o.who, o.tilt || 0);
  o.over?.(g, cx, cy, r, M);
  return { cx, cy, r, M };
}
function bigExtras(g, cx, cy, r, who, tilt) {
  const xs = who?.x || []; g.save(); g.translate(cx, cy); g.rotate(tilt); const ink = S().ink;
  for (const x of xs) {
    if (x === 'topknot') { circle(g, -r * 0.1, -r * 1.05, r * 0.26, ink); seg(g, [[-r * 0.1, -r * 1.0], [-r * 0.45, -r * 1.25]], r * 0.2, ink); }
    if (x === 'helmet') { g.fillStyle = '#100c0e'; g.beginPath(); g.ellipse(0, -r * 0.3, r * 1.1, r * 0.95, 0, Math.PI, Math.PI * 2); g.fill(); poly(g, [[-r * 0.14, -r * 1.1], [r * 0.14, -r * 1.1], [0, -r * 1.6]], '#100c0e'); seg(g, [[-r * 1.12, -r * 0.3], [r * 1.12, -r * 0.3]], r * 0.12, shade(KZ_RED, -0.2)); }
    if (x === 'crown') { poly(g, [[-r * 0.75, -r * 0.78], [r * 0.75, -r * 0.78], [r * 0.85, -r * 1.35], [r * 0.42, -r * 1.02], [0, -r * 1.5], [-r * 0.42, -r * 1.02], [-r * 0.85, -r * 1.35]], GOLD); glow(g, 0, -r * 1.1, r * 1.2, GOLD, 0.25); }
    if (x === 'eboshi') poly(g, [[-r * 0.7, -r * 0.7], [r * 0.6, -r * 0.72], [r * 0.3, -r * 1.9], [-r * 0.45, -r * 1.65]], ink);
    if (x === 'kasa') { poly(g, [[-r * 1.7, -r * 0.5], [r * 1.7, -r * 0.5], [0, -r * 1.3]], '#8a7a50'); }
    if (x === 'beard') { g.fillStyle = '#e8e2d6'; g.beginPath(); g.moveTo(-r * 0.35, r * 0.62); g.quadraticCurveTo(0, r * 1.25, r * 0.35, r * 0.62); g.quadraticCurveTo(0, r * 0.8, -r * 0.35, r * 0.62); g.fill(); }
  }
  g.restore();
}
// speaking rings beside a head
export function talkRings(g, x, y, t, col = '#fff1e6') { FX.rings(g, x, y, t, { count: 3, r0: 30, r1: 120, color: col, a: 0.35, speed: 1.6 }); }

// mud/grass blades (foreground)
export function grassBlades(g, t, o = {}) { const { seed = 41, y = E.H, count = 90, h = 260, color = '#0c0a0c', x0 = -100, x1 = E.W + 100, wind = 1 } = o; const r = rng(seed); g.fillStyle = color; for (let i = 0; i < count; i++) { const x = lerp(x0, x1, r()), hh = h * (0.5 + r() * 0.7), w = 6 + r() * 10, sw = Math.sin(t * 1.4 * wind + i) * 14 * wind + 20 * (r() - 0.5); g.beginPath(); g.moveTo(x - w / 2, y); g.quadraticCurveTo(x + sw * 0.4, y - hh * 0.6, x + sw, y - hh); g.quadraticCurveTo(x + sw * 0.4 + 2, y - hh * 0.6, x + w / 2, y); g.closePath(); g.fill(); } }
// thatched hut silhouette (Japanese village)
export function hut(g, x, y, w, o = {}) { const { wall = '#2a2028', roof = '#1a1418', lit = 0, fire = 0, t = 0, light = '#ffc070' } = o; const h = w * 0.45; g.fillStyle = wall; g.fillRect(x - w / 2, y - h, w, h); if (lit) { g.fillStyle = alpha(light, lit); g.fillRect(x - w * 0.15, y - h * 0.7, w * 0.3, h * 0.45); glow(g, x, y - h * 0.5, w * 0.6, light, lit * 0.25); } poly(g, [[x - w * 0.62, y - h + 4], [x + w * 0.62, y - h + 4], [x + w * 0.28, y - h - w * 0.42], [x - w * 0.28, y - h - w * 0.42]], roof); seg(g, [[x - w * 0.32, y - h - w * 0.42], [x + w * 0.32, y - h - w * 0.42]], 6, shade(roof, -0.3)); if (fire) { flame(g, x - w * 0.2, y - h - w * 0.2, w * 0.18 * fire, t, '#ff9a3a'); flame(g, x + w * 0.15, y - h - w * 0.25, w * 0.22 * fire, t + 1.3, '#ff7a2a'); } }
// stone cairn of n stones
export function cairn(g, x, y, s, n = 4, col = '#3a3540', hi = '#6a6070', seed = 1) { const r = rng(seed); let yy = y; for (let i = 0; i < n; i++) { const w = (34 - i * 5) * s * (0.85 + r() * 0.3), h = (16 - i * 1.5) * s; g.fillStyle = col; g.beginPath(); g.ellipse(x + (r() - 0.5) * 4 * s, yy - h, w, h, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = alpha(hi, 0.6); g.beginPath(); g.ellipse(x - w * 0.25, yy - h * 1.5, w * 0.5, h * 0.35, 0, 0, Math.PI * 2); g.fill(); yy -= h * 1.75; } }
// pagoda-ish torii gate
export function torii(g, x, y, s, col = '#8a1a1a') { const c = col; seg(g, [[x - 80 * s, y], [x - 70 * s, y - 220 * s]], 16 * s, c); seg(g, [[x + 80 * s, y], [x + 70 * s, y - 220 * s]], 16 * s, c); seg(g, [[x - 110 * s, y - 180 * s], [x + 110 * s, y - 180 * s]], 12 * s, c); g.fillStyle = c; g.beginPath(); g.moveTo(x - 140 * s, y - 236 * s); g.quadraticCurveTo(x, y - 212 * s, x + 140 * s, y - 236 * s); g.lineTo(x + 130 * s, y - 214 * s); g.quadraticCurveTo(x, y - 196 * s, x - 130 * s, y - 214 * s); g.closePath(); g.fill(); }
// arrow in flight (world), with motion trail
export function arrow(g, x, y, ang, s = 1, o = {}) { const { ink = S().ink, trail = 0, fire = 0, t = 0 } = o; g.save(); g.translate(x, y); g.rotate(ang); if (trail) { g.fillStyle = linGrad(g, -trail, 0, 0, 0, ['rgba(255,240,220,0)', alpha(fire ? '#ffb050' : '#fff3e0', 0.55)]); g.fillRect(-trail, -2 * s, trail, 4 * s); } seg(g, [[-60 * s, 0], [40 * s, 0]], 3.5 * s, ink); poly(g, [[52 * s, 0], [36 * s, -7 * s], [36 * s, 7 * s]], ink); poly(g, [[-60 * s, 0], [-74 * s, -8 * s], [-52 * s, 0], [-74 * s, 8 * s]], ink); g.restore(); if (fire) flame(g, x + Math.cos(ang) * 40 * s, y + Math.sin(ang) * 40 * s, 14 * s, t, '#ff9a3a'); }
// moving camera helper: push + drift over the shot
export const push = (t, info, o = {}) => { const k = ease.inOut(t / info.dur); return { z: (o.z0 ?? 1) + (o.dz ?? 0.06) * k, x: (o.x0 ?? 0) + (o.dx ?? 0) * k, y: (o.y0 ?? 0) + (o.dy ?? 0) * k, r: o.r ?? 0 }; };
