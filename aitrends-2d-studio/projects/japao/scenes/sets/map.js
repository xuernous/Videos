// sets/map.js — stylised navy map of the sea between the continent (Kezhar), Tsushima, Iki and Kyushu.
import { E, V, S, layer, seg, circle, ring, poly, glow, alpha, shade, mix, rng, text, FONTS, clamp, ease, prog, lerp, linGrad, noise } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';

const wob = (pts, amp, seed) => pts.map(([x, y], i) => [x + noise(i * 1.7, seed) * amp, y + noise(i * 2.3, seed + 3) * amp]);
const ring2 = (cx, cy, rx, ry, n, amp, seed) => wob(Array.from({ length: n }, (_, i) => [cx + Math.cos(i / n * Math.PI * 2) * rx, cy + Math.sin(i / n * Math.PI * 2) * ry]), amp, seed);
export const LAND = {
  continent: wob([[-900, -600], [1500, -600], [1500, -200], [1300, -120], [1120, 40], [980, 120], [900, 260], [860, 420], [800, 560], [740, 610], [690, 520], [640, 380], [560, 300], [420, 330], [240, 280], [80, 360], [-900, 380]], 18, 1),
  tsushima: ring2(1010, 470, 34, 90, 14, 6, 2),
  iki: ring2(1170, 610, 36, 30, 12, 4, 3),
  kyushu: wob([[1240, 700], [1400, 660], [1560, 690], [1700, 640], [1820, 700], [1900, 900], [1880, 1400], [1300, 1400], [1250, 1100], [1300, 980], [1220, 860], [1270, 780]], 16, 4),
  honshu: wob([[1800, 600], [1950, 420], [2300, 300], [2600, 300], [2600, 900], [1960, 760]], 16, 5),
};
export const PLACES = { iki: [1170, 610], tsushima: [1010, 470], hakata: [1330, 720], dazaifu: [1390, 800], kyoto: [2250, 560], kezhar: [420, 80], steppe: [-300, -200], najima: [1480, 740], kyushuN: [1450, 760] };
function shape(g, pts, fill, stroke, w = 2) { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = w; g.stroke(); } }
// mapBase(g, t, cam, {red: 0..1 spread of Kezhar over the continent, redKyushu: 0..1, crumble: 0..1, labels: [..], dim})
export function mapBase(g, t, cam, o = {}) {
  const ui = S().ui, bp = ui.blueprint;
  layer(g, cam, 0.2, (g) => UI.blueprint(g, { grid: 60, a: 0.06 }));
  layer(g, cam, 1, (g) => {
    g.fillStyle = alpha(bp, 0.04); g.fillRect(-E.W, -E.H, E.W * 4, E.H * 4);
    for (let k = 1; k <= 3; k++) for (const pts of Object.values(LAND)) { g.save(); g.globalAlpha = 0.12 / k; shape(g, pts, null, bp, 2 + k * 6); g.restore(); }
    for (const [nm, pts] of Object.entries(LAND)) shape(g, pts, alpha(mix(ui.bpBg, bp, 0.22), 1), alpha(bp, 0.85), 2.5);
    const red = o.red ?? 0;
    if (red > 0) { g.save(); shape(g, LAND.continent, null, null); g.clip(); const [kx, ky] = PLACES.kezhar; const rr = red * 1500;
      g.fillStyle = alpha('#c2242c', 0.55); g.beginPath(); for (let i = 0; i <= 60; i++) { const a = i / 60 * Math.PI * 2, d = rr * (0.85 + 0.15 * noise(i * 0.7 + t * 0.3, 9)); i ? g.lineTo(kx + Math.cos(a) * d, ky + Math.sin(a) * d) : g.moveTo(kx + Math.cos(a) * d, ky + Math.sin(a) * d); } g.closePath(); g.fill();
      if (o.crumble) { const r = rng(4); g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 260; i++) { const x = -900 + r() * 2400, y = -600 + r() * 1000; if (r() < o.crumble) { g.fillStyle = 'rgba(0,0,0,1)'; g.beginPath(); g.arc(x, y, 30 + r() * 70, 0, 7); g.fill(); } } }
      g.restore();
      if (o.borders) { g.save(); g.strokeStyle = alpha('#ff6a5a', 0.4); g.lineWidth = 2; g.setLineDash([10, 10]); for (const [a, b] of [[[100, -600], [260, 290]], [[600, -600], [520, 300]], [[1000, -600], [900, 200]]]) { g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); } g.restore(); }
    }
    if (o.redKyushu) { g.save(); shape(g, LAND.kyushu, null, null); g.clip(); g.fillStyle = alpha('#c2242c', 0.55); g.beginPath(); g.arc(PLACES.hakata[0], PLACES.hakata[1] - 60, o.redKyushu * 420, 0, 7); g.fill(); g.restore(); }
    for (const lb of o.labels || []) { const [x, y] = PLACES[lb.at] || lb.xy; const a = lb.a ?? 1; if (a <= 0) continue; circle(g, x, y, 7, alpha(lb.color || ui.gold, a)); glow(g, x, y, 30, lb.color || ui.gold, 0.5 * a); text(g, lb.str, x + (lb.dx ?? 18), y + (lb.dy ?? -20), { size: lb.size || 30, font: FONTS.ui, weight: 900, color: lb.color || ui.cream, align: lb.align || 'left', spacing: 3, alpha: a }); }
  });
}
// tiny boat glyph on the map
export function mapBoat(g, x, y, s, col, f = 1) { g.save(); g.translate(x, y); g.scale(f * s, s); poly(g, [[-20, 0], [20, 0], [14, 8], [-14, 8]], col); seg(g, [[0, 0], [0, -26]], 2, col); poly(g, [[1, -24], [16, -8], [1, -6]], col); g.restore(); }
