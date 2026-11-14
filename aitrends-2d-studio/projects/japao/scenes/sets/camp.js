// sets/camp.js — night scenes: the friendly fire of the thirty (fireCamp), the Kezhar camp with palisade (enemyCamp).
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng, noise } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { flame, embers, banner, sea, KZ_RED } from './lib.js';
import { pineJ } from './coast.js';

export function fireCamp(g, t, cam, o = {}) {
  const M = mood('night'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, fx = CX + (o.fireX ?? 0);
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, E.H * 1.2], count: 220 }); FX.moon(g, CX - 600, 160, 26); });
  layer(g, cam, 0.35, (g) => { FX.hills(g, { y: GY - 220, amp: 90, color: shade(M.dark, -0.1), seed: 6 }); for (let i = -6; i < 12; i++) pineJ(g, CX + i * 190 - 900, GY - 200 + (i % 3) * 12, 1.1, shade(M.dark, -0.4)); });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 30, 0, E.H, [shade(M.floor, -0.2), shade(M.dark, -0.5)]); g.fillRect(-E.W, GY - 30, E.W * 3, E.H * 2);
    if (o.fire !== false) { FX.pool(g, fx, GY + 10, 760, 110, '#ff9a4a', 0.38); for (let i = 0; i < 5; i++) seg(g, [[fx - 60 + i * 30, GY + 6], [fx + 40 - i * 20, GY - 18]], 9, '#1a1010'); }
  });
  return { GY, CX, M, fireX: fx };
}
export function fireOn(g, x, y, t, s = 1) { flame(g, x, y, 60 * s, t, '#ff8a3a'); embers(g, t, { area: [x - 200, y - 600, 400, 600], count: 20, speed: 90 }); }

// enemyCamp(g, t, cam, {fires, banners, sea, palisadeX})
export function enemyCamp(g, t, cam, o = {}) {
  const M = mood('night'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, PX = CX + (o.palisadeX ?? 0);
  layer(g, cam, 0.1, (g) => { backdrop(g, o.moonless ? [shade(M.sky[0], -0.5), shade(M.sky[1], -0.4)] : M.sky); FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, E.H], count: o.moonless ? 90 : 180 }); if (!o.moonless) FX.moon(g, CX + 560, 170, 30); });
  layer(g, cam, 0.25, (g) => { sea(g, t, GY - 330, M, { color: shade(M.sky[1], -0.3) }); });
  layer(g, cam, 0.5, (g) => {
    const r = rng(7);
    for (let i = -8; i < 14; i++) { const tx = PX + i * 150 - 600, ty = GY - 150 - (i % 2) * 12; poly(g, [[tx - 60, ty], [tx + 60, ty], [tx, ty - 90]], shade(M.dark, -0.2 - r() * 0.2)); if (r() < 0.45) { g.fillStyle = alpha('#ffb060', 0.5); poly(g, [[tx - 10, ty], [tx + 10, ty], [tx, ty - 26]], alpha('#ffb060', 0.55)); } }
    for (let i = 0; i < (o.fires ?? 5); i++) { const fx = PX - 500 + i * 260, fy = GY - 140; flame(g, fx, fy, 30, t + i, '#ff8a3a'); FX.pool(g, fx, fy + 6, 160, 26, '#ff9a4a', 0.3); }
    if (o.banners !== false) for (let i = 0; i < 4; i++) banner(g, PX - 420 + i * 300, GY - 420, 90, 60, t + i, { wind: 0.6 });
  });
  layer(g, cam, 0.8, (g) => {                                      // palisade wall of sharpened logs
    for (let x = PX - 1400; x < PX + 1400; x += 34) { const h = 230 + noise(x * 0.05, 3) * 16; poly(g, [[x, GY - 40], [x + 30, GY - 40], [x + 30, GY - 40 - h], [x + 15, GY - 60 - h], [x, GY - 40 - h]], shade(M.dark, -0.35)); }
    g.fillStyle = shade(M.dark, -0.45); g.fillRect(PX - 1400, GY - 140, 2800, 12);
    g.fillStyle = linGrad(g, 0, GY - 40, 0, E.H, [shade(M.floor, -0.35), shade(M.dark, -0.6)]); g.fillRect(-E.W, GY - 40, E.W * 3, E.H * 2);
  });
  return { GY, CX, M, PX, wallTop: GY - 270 };
}
// a big tree silhouette (Hayato's perch), foreground
export function bigTree(g, x, y, s, col, t = 0) { seg(g, [[x, y], [x + 10 * s, y - 300 * s], [x - 20 * s, y - 520 * s]], 34 * s, col); seg(g, [[x + 6 * s, y - 330 * s], [x + 180 * s, y - 420 * s]], 16 * s, col); seg(g, [[x - 6 * s, y - 420 * s], [x - 170 * s, y - 500 * s]], 14 * s, col); for (const [dx, dy, r] of [[-20, -560, 150], [150, -450, 110], [-170, -520, 100], [60, -640, 120], [-100, -660, 110]]) { g.fillStyle = col; g.beginPath(); g.ellipse(x + dx * s + Math.sin(t * 0.8 + dx) * 4, y + dy * s, r * s, r * 0.7 * s, 0, 0, Math.PI * 2); g.fill(); } }
