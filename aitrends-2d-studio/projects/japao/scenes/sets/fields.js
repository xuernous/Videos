// sets/fields.js — flooded rice paddies (mirror water, dikes) and a country road.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng, noise } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { pineJ } from './coast.js';
import { hut } from './lib.js';

export function paddies(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = E.H * V(0.78, 0.66), CX = E.W / 2, HY = GY - 200;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX + (o.sunX ?? 380), HY - 160, 60, '#fff3dc', M.key, 5); FX.clouds(g, { y: 120, h: 300, color: M.key, a: 0.14, seed: 6 }); });
  layer(g, cam, 0.25, (g) => { FX.hills(g, { y: HY, amp: 180, color: mix(M.sky[1], M.dark, 0.55), freq: 0.0025, seed: 21 }); FX.hills(g, { y: HY + 40, amp: 70, color: shade(M.grass, -0.5), freq: 0.004, seed: 22 }); for (let i = 0; i < 4; i++) hut(g, CX - 640 + i * 120, HY + 20, 70, { wall: shade(M.wall, -0.4), roof: shade(M.dark, -0.3) }); });
  layer(g, cam, 0.7, (g) => {
    g.fillStyle = linGrad(g, 0, HY + 40, 0, E.H * 1.3, [mix(M.sky[2] || M.sky[1], M.sky[0], 0.3), shade(M.sky[0], -0.4)]); g.fillRect(-E.W, HY + 40, E.W * 3, E.H * 2);   // water reflects sky
    g.save(); g.globalCompositeOperation = 'lighter'; FX.pool(g, CX + (o.sunX ?? 380), HY + 140, 260, 300, M.key, 0.25); g.restore();
    const dike = shade(M.grass, -0.55); for (let k = 0; k < 7; k++) { const y = HY + 60 + k * k * 14; g.fillStyle = dike; g.fillRect(-E.W, y, E.W * 3, 6 + k * 2); }
    for (let k = -8; k <= 8; k++) seg(g, [[CX + k * 60, HY + 60], [CX + k * 420, E.H * 1.4]], 5, dike);
    const r = rng(3); g.strokeStyle = alpha(shade(M.grass, -0.2), 0.8); g.lineWidth = 2; for (let i = 0; i < 260; i++) { const y = HY + 70 + r() ** 1.6 * 700, x = -E.W * 0.5 + r() * E.W * 2, h = 6 + (y - HY) * 0.03; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 2, y - h); g.stroke(); }
    g.strokeStyle = alpha('#ffffff', 0.08); for (let i = 0; i < 20; i++) { const y = HY + 80 + i * 30; g.beginPath(); g.moveTo(-E.W, y + Math.sin(t + i) * 2); g.lineTo(E.W * 2, y + Math.sin(t + i) * 2); g.stroke(); }
  });
  return { GY, CX, M, HY };
}
// reflection helper: draw fn mirrored under y (water)
export function reflect(g, y, fn, a = 0.3) { g.save(); g.globalAlpha *= a; g.translate(0, y * 2); g.scale(1, -1); fn(g); g.restore(); }
export function road(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = E.H * V(0.8, 0.68), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX - 500, GY - 300, 50, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.3, (g) => { FX.hills(g, { y: GY - 220, amp: 120, color: mix(M.sky[1], M.dark, 0.6), seed: 31 }); for (let i = -5; i < 8; i++) pineJ(g, CX + i * 260 - 300, GY - 190 + (i % 2) * 14, 1.0, shade(M.dark, -0.3)); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 60, 0, E.H, [shade(M.grass, -0.4), shade(M.dark, -0.5)]); g.fillRect(-E.W, GY - 60, E.W * 3, E.H * 2); poly(g, [[-E.W, GY - 20], [E.W * 2, GY - 50], [E.W * 2, GY + 70], [-E.W, GY + 110]], mix('#8a7058', M.floor, 0.55)); FX.pool(g, CX - 300, GY + 30, 900, 60, M.key, 0.15); });
  return { GY, CX, M };
}
