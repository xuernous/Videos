// sets/booth.js — "as cabines de vidro": a black hall where each pair stands in two lit glass booths facing each other.
// cabins() draws the hall + both booth interiors (call figures afterwards at depth 1), cabinGlass() draws the glass on top.
import { E, V, S, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, lerp, clamp, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const BTN_RED = '#e0302a';
export const boothGround = () => E.H * V(0.8, 0.68);
// geometry of the two facing booths (logical units). L = yours (77), R = his (41)
export function cabinGeo() {
  const GY = boothGround(), top = GY - V(700, 920), gap = V(140, 90), w = V(520, 450), cx = E.W / 2;
  const L = { x0: cx - gap / 2 - w, x1: cx - gap / 2, top, GY }, R = { x0: cx + gap / 2, x1: cx + gap / 2 + w, top, GY };
  L.btn = [L.x1 - V(110, 90), GY - V(190, 215)]; R.btn = [R.x0 + V(110, 90), GY - V(190, 215)];
  L.fig = L.x0 + w * 0.42; R.fig = R.x1 - w * 0.42;
  return { GY, L, R, cx };
}
// red button on a pedestal. press 0..1 pushes the cap down; dim 0..1 kills the glow; crack 0..1
export function redButton(g, x, y, s = 1, o = {}) {
  const GY = o.floor ?? boothGround(), p = o.press || 0, dim = o.dim || 0, M = mood('interiorCool');
  rr(g, x - 26 * s, y, 52 * s, GY - y, 6 * s); g.fillStyle = shade(M.wall, -0.6); g.fill();
  rr(g, x - 46 * s, y - 14 * s, 92 * s, 22 * s, 8 * s); g.fillStyle = shade(M.wall, -0.3); g.fill();
  const cy = y - 14 * s + p * 10 * s, col = mix(BTN_RED, '#3a1414', dim);
  g.fillStyle = col; g.beginPath(); g.ellipse(x, cy, 34 * s, 22 * s, 0, Math.PI, 0); g.fill(); g.fillRect(x - 34 * s, cy, 68 * s, 8 * s);
  g.fillStyle = alpha('#ffffff', 0.35 * (1 - dim)); g.beginPath(); g.ellipse(x - 10 * s, cy - 10 * s, 10 * s, 5 * s, -0.3, 0, 7); g.fill();
  if (dim < 1) glow(g, x, cy - 6 * s, 120 * s, BTN_RED, 0.45 * (1 - dim) * (o.glow ?? 1));
  if (o.crack) { const k = o.crack; g.strokeStyle = alpha('#140808', 0.9); g.lineWidth = 3 * s; g.beginPath(); g.moveTo(x - 4 * s, cy - 20 * s); g.lineTo(x + 6 * s * k, cy - 8 * s); g.lineTo(x - 10 * s * k, cy + 2 * s); g.lineTo(x + 14 * s * k, cy + 6 * s); g.stroke(); }
}
// one booth interior: back wall, floor, ceiling strip + light (light 0..1)
export function boothInterior(g, b, t, o = {}) {
  const M = mood('interiorCool'), L = o.light ?? 1, key = mix(M.key, '#ffffff', 0.5);
  const { x0, x1, top, GY } = b, w = x1 - x0;
  g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(M.wall, -0.55 + 0.25 * L), shade(M.wall, -0.75 + 0.2 * L)]); g.fillRect(x0, top, w, GY - top);
  g.fillStyle = shade(M.floor, -0.5 + 0.35 * L); g.fillRect(x0, GY - 4, w, 24);
  if (L > 0) {
    rr(g, x0 + w * 0.2, top + 14, w * 0.6, 14, 7); g.fillStyle = alpha(key, L); g.fill();
    glow(g, x0 + w / 2, top + 20, w * 0.7, M.key, 0.4 * L);
    g.save(); g.beginPath(); g.rect(x0, top, w, GY - top + 20); g.clip();
    FX.lightCone(g, x0 + w / 2, top + 22, { angle: Math.PI / 2, spread: 0.7, len: GY - top + 60, color: M.key, a: 0.16 * L });
    FX.pool(g, x0 + w / 2, GY + 6, w * 0.45, 22, key, 0.35 * L);
    g.restore();
  }
}
// glass + metal frame drawn over the figures
export function boothGlass(g, b, t, o = {}) {
  const M = mood('interiorCool'), L = o.light ?? 1; const { x0, x1, top, GY } = b, w = x1 - x0;
  g.fillStyle = alpha(mix(M.key, '#9fe0ff', 0.4), 0.05 + 0.04 * L); g.fillRect(x0, top, w, GY - top);
  g.save(); g.beginPath(); g.rect(x0, top, w, GY - top); g.clip(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 3; i++) { const x = x0 + ((i * 0.37 + t * 0.03) % 1) * w * 1.4 - w * 0.2; poly(g, [[x, top], [x + 60 + i * 30, top], [x - 160 + i * 30, GY], [x - 220, GY]], alpha('#ffffff', 0.035)); }
  g.restore();
  const fr = shade(M.wall, -0.75); g.strokeStyle = fr; g.lineWidth = V(14, 12); g.strokeRect(x0, top, w, GY - top);
  seg(g, [[x0 + 4, top + 4], [x1 - 4, top + 4]], 3, alpha(M.rim, 0.5 * (0.4 + 0.6 * L)));
  seg(g, [[x1 - 4, top + 4], [x1 - 4, GY]], 2, alpha(M.rim, 0.35)); seg(g, [[x0 + 4, top + 4], [x0 + 4, GY]], 2, alpha(M.rim, 0.35));
}
// the hall: dark void with faint rows of distant booths, glossy floor; both booth interiors
export function cabins(g, t, cam, o = {}) {
  const M = mood('interiorCool'), geo = cabinGeo(), { GY } = geo;
  layer(g, cam, 0.35, (g) => {
    backdrop(g, [shade(M.dark, -0.7), shade(M.dark, -0.45)]);
    for (let r = 0; r < 2; r++) for (let i = -8; i < 12; i++) { const x = i * V(200, 170) + r * 90, y = GY - V(260, 300) + r * 80, w = V(120, 110), h = V(170, 190), on = (o.farOff ?? 0) <= ((i * 37 + r * 11) % 20) / 20;
      g.fillStyle = on ? alpha(M.key, 0.07) : alpha('#000', 0.3); g.fillRect(x, y - h, w, h); if (on) { glow(g, x + w / 2, y - h, w, M.key, 0.07); g.fillStyle = alpha('#000', 0.5); g.fillRect(x + w * 0.4, y - h * 0.55, w * 0.2, h * 0.55); } }
  });
  layer(g, cam, 0.8, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.floor, -0.55), shade(M.dark, -0.7)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(255,255,255,.03)', 0.1);
  });
  layer(g, cam, 1, (g) => {
    boothInterior(g, geo.L, t, { light: o.lightL ?? 1 }); boothInterior(g, geo.R, t, { light: o.lightR ?? 1 });
    if (o.buttons !== false) { redButton(g, geo.L.btn[0], geo.L.btn[1], 1, { press: o.pressL, dim: o.dimL }); redButton(g, geo.R.btn[0], geo.R.btn[1], 1, { press: o.pressR, dim: o.dimR ?? (1 - (o.lightR ?? 1)) * 0.8 }); }
    // reflections of the booth light on the glossy floor
    for (const [b, l] of [[geo.L, o.lightL ?? 1], [geo.R, o.lightR ?? 1]]) FX.pool(g, (b.x0 + b.x1) / 2, GY + 70, (b.x1 - b.x0) * 0.5, 40, M.key, 0.12 * l);
  });
  return { ...geo, M };
}
export function cabinGlassAll(g, t, cam, geo, o = {}) {
  layer(g, cam, 1, (g) => { boothGlass(g, geo.L, t, { light: o.lightL ?? 1 }); boothGlass(g, geo.R, t, { light: o.lightR ?? 1 }); });
}
// rows of booths (for "as luzes se apagam uma por uma"): a front row and a smaller back row; off(i) -> 0..1 how dark booth i is
// indices 0..3 = front row (left to right), 4.. = back row
export function boothRow(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = boothGround(), key = mix(M.key, '#ffffff', 0.5);
  layer(g, cam, 0.5, (g) => backdrop(g, [shade(M.dark, -0.75), shade(M.dark, -0.5)]));
  const one = (g, x, base, sc, L, seed) => {
    const w = V(300, 300) * sc, h = V(560, 640) * sc, r = rng(seed);
    g.fillStyle = shade(M.wall, -0.75 + 0.3 * L); g.fillRect(x - w / 2, base - h, w, h);
    if (L > 0.02) { rr(g, x - w * 0.3, base - h + 10 * sc, w * 0.6, 12 * sc, 6 * sc); g.fillStyle = alpha(key, L); g.fill(); glow(g, x, base - h + 16 * sc, w * 0.8, M.key, 0.45 * L); FX.lightCone(g, x, base - h + 18 * sc, { angle: Math.PI / 2, spread: 0.7, len: h, color: M.key, a: 0.15 * L }); FX.pool(g, x, base + 4, w * 0.45, 16 * sc, key, 0.3 * L); }
    const fx = x + (r() - 0.5) * w * 0.3, fs = sc * 1.25;
    circle(g, fx, base - 205 * fs, 26 * fs, S().ink); seg(g, [[fx, base - 175 * fs], [fx, base - 100 * fs]], 15 * fs, S().ink); seg(g, [[fx, base - 100 * fs], [fx - 8 * fs, base]], 12 * fs, S().ink); seg(g, [[fx, base - 100 * fs], [fx + 8 * fs, base]], 12 * fs, S().ink);
    seg(g, [[fx, base - 170 * fs], [fx + 6 * fs, base - 100 * fs]], 11 * fs, S().ink);
    if (L > 0.02) { g.save(); g.globalCompositeOperation = 'lighter'; ring(g, fx, base - 205 * fs, 26 * fs + 2, 3, alpha(M.rim, 0.6 * L)); g.restore(); }
    g.fillStyle = alpha(mix(M.key, '#9fe0ff', 0.4), 0.05 + 0.04 * L); g.fillRect(x - w / 2, base - h, w, h);
    g.strokeStyle = shade(M.wall, -0.8); g.lineWidth = 10 * sc; g.strokeRect(x - w / 2, base - h, w, h);
    seg(g, [[x - w / 2 + 3, base - h + 3], [x + w / 2 - 3, base - h + 3]], 2, alpha(M.rim, 0.5 * L));
  };
  layer(g, cam, 0.7, (g) => {
    g.fillStyle = shade(M.dark, -0.6); g.fillRect(-E.W, GY - V(300, 420), E.W * 3, E.H * 2);
    for (let j = 0; j < 9; j++) { const i = 4 + j, L = 1 - (o.off ? o.off(i) : 0); one(g, -E.W * 0.35 + j * V(230, 220), GY - V(300, 420), 0.6, L, i); }
  });
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, E.H, [shade(M.floor, -0.6), shade(M.dark, -0.7)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    for (let i = 0; i < 4; i++) { const L = 1 - (o.off ? o.off(i) : 0); one(g, E.W / 2 + (i - 1.5) * V(340, 340), GY, 1, L, i); }
  });
}
