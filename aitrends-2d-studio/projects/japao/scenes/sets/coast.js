// sets/coast.js — Iki: jade bay, beach, pines, thatched village. Variants: dawn/golden/dusk/night, burning, fleet on the horizon.
// Also: seaView (open sea + fleet), hillTop (grassy crest above the sea), beachNight.
import { E, V, S, mood, layer, blurLayer, backdrop, rr, seg, circle, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, noise, clamp, lerp, ease, prog } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { sea, fleet, hut, smoke, embers, flame, grassBlades, ship } from './lib.js';

export const JADE = '#3fae9a';
export const coastGround = () => E.H * V(0.8, 0.7);
// coast(g, t, cam, {mood, fleet:0..1, fleetCount, burn:0..1, smoke, village:true, horizon})
export function coast(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = coastGround(), CX = E.W / 2, HY = GY - V(250, 420);
  layer(g, cam, 0.1, (g) => {
    backdrop(g, M.sky);
    if (o.mood === 'night') { FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, HY + E.H] }); if (o.moon !== false) FX.moon(g, CX + 420, HY - 420, 34); }
    else FX.sun(g, CX + (o.sunX ?? 520), HY - (o.sunY ?? 120), 56, '#fff3dc', M.key, 5);
    FX.clouds(g, { y: HY - 520, h: 260, color: mix(M.key, '#ffffff', 0.4), a: 0.12, seed: 4 });
  });
  layer(g, cam, 0.2, (g) => {
    FX.hills(g, { y: HY + 4, amp: 70, color: mix(M.sky[1], shade(M.dark, -0.2), 0.7), freq: 0.003, seed: 3 });      // far islands
  });
  layer(g, cam, 0.25, (g) => {
    sea(g, t, HY, M, { jade: o.mood === 'night' ? null : JADE, color: mix(M.sky[0], shade(M.dark, -0.1), 0.5) });
    FX.lensStreak(g, CX + (o.sunX ?? 520), HY, E.W * 1.4, M.key, o.mood === 'night' ? 0.1 : 0.25, 3);
    if (o.fleet) fleet(g, t, { count: o.fleetCount ?? 70, y: HY - 6, s0: 0.07, s1: 0.16, rows: 3, appear: o.fleet, x0: -E.W * 0.5, x1: E.W * 1.5, hull: shade(M.dark, -0.5), sail: mix('#a3202a', M.dark, 0.25) });
  });
  layer(g, cam, 0.5, (g) => {                                   // headland with pines + village on the right
    g.fillStyle = shade(M.dark, -0.05); g.beginPath(); g.moveTo(CX + 200, HY + 30); g.quadraticCurveTo(CX + 700, HY - 260, CX + 1500, HY - 300); g.lineTo(CX + 1700, GY); g.lineTo(CX + 200, GY); g.closePath(); g.fill();
    for (let i = 0; i < 9; i++) pineJ(g, CX + 520 + i * 120, HY - 120 - i * 18 + (i % 2) * 20, 0.8 + (i % 3) * 0.15, shade(M.dark, -0.35));
    if (o.village !== false) { const r = rng(9); for (let i = 0; i < 6; i++) { const hx = CX + 420 + i * 150, hy = HY + 40 - i * 26; hut(g, hx, hy, 110 + r() * 30, { wall: shade(M.wall, -0.4), roof: shade(M.dark, -0.3), lit: o.mood === 'night' && !o.burn ? 0.6 : (o.burn ? 0 : 0.15), light: M.practical, fire: o.burn ? clamp(o.burn * 1.5 - i * 0.12) : 0, t: t + i }); }
      if (o.burn) for (let i = 0; i < 4; i++) smoke(g, t + i * 3, CX + 450 + i * 210, HY - 40 - i * 30, { color: shade(M.dark, -0.4), a: 0.4 * o.burn, w: 70, rise: 700, seed: i + 2 }); }
  });
  layer(g, cam, 0.85, (g) => {                                  // beach + surf
    g.fillStyle = linGrad(g, 0, HY + 60, 0, GY + 300, [mix('#c9b38a', M.floor, 0.55), shade(M.floor, -0.15), shade(M.dark, -0.2)]);
    g.beginPath(); g.moveTo(-E.W, GY - 120); for (let x = -E.W; x <= E.W * 2; x += 60) g.lineTo(x, GY - 110 + noise(x * 0.004, 2) * 22); g.lineTo(E.W * 2, E.H * 2); g.lineTo(-E.W, E.H * 2); g.closePath(); g.fill();
    g.strokeStyle = alpha('#f4efe6', 0.25); g.lineWidth = 3; for (let k = 0; k < 2; k++) { g.beginPath(); for (let x = -E.W; x <= E.W * 2; x += 30) { const y = GY - 116 + k * 10 + noise(x * 0.004, 2) * 22 + Math.sin(t * 0.8 + x * 0.01 + k) * 4; x === -E.W ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    if (o.mood !== 'night') FX.pool(g, CX - 200, GY + 10, 700, 60, M.key, 0.12);
  });
  if (o.burn) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, CX + 700, HY, 900, '#ff7030', 0.18 * o.burn); g.restore(); }
  return { GY, CX, M, HY };
}
export function pineJ(g, x, y, s, col) {          // Japanese black pine: trunk + flat layered canopies
  seg(g, [[x, y], [x - 10 * s, y - 70 * s], [x + 8 * s, y - 130 * s]], 9 * s, col);
  for (const [dx, dy, w] of [[-30, -70, 60], [24, -110, 70], [-6, -150, 54]]) { g.fillStyle = col; g.beginPath(); g.ellipse(x + dx * s, y + dy * s, w * s, 16 * s, 0, 0, Math.PI * 2); g.fill(); }
}
// open sea toward the horizon, fleet strip. o: {mood, fleet, count, near (big ships), calm}
export function seaView(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), HY = E.H * (o.hy ?? 0.52), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); if (o.mood === 'night' || o.mood === 'storm') FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, HY + E.H], count: o.mood === 'storm' ? 0 : 140 }); else FX.sun(g, CX - 300, HY - 40, 50, '#fff3dc', M.key, 6); FX.clouds(g, { y: HY - 400, h: 260, color: M.key, a: 0.1, seed: 8 }); });
  layer(g, cam, 0.3, (g) => {
    sea(g, t, HY, M, { calm: o.calm || 0 }); FX.lensStreak(g, CX - 300, HY, E.W * 1.6, M.key, 0.3, 3);
    if (o.fleet) fleet(g, t, { count: o.count ?? 90, y: HY - 4, s0: 0.06, s1: 0.2, rows: 4, appear: o.fleet, x0: -E.W, x1: E.W * 2, hull: shade(M.dark, -0.5), sail: o.sail || mix('#a3202a', M.dark, 0.2), seed: o.seed ?? 31 });
  });
  return { M, HY, CX };
}
// grassy hilltop overlooking the sea (figure on the crest)
export function hillTop(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), CX = E.W / 2, GY = E.H * V(0.74, 0.66), HY = E.H * 0.6;
  const sv = seaView(g, t, cam, { ...o, hy: 0.6, mood: o.mood || 'golden' });
  layer(g, cam, 0.7, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 60, 0, E.H, [shade(M.grass, -0.45), shade(M.dark, -0.4)]);
    g.beginPath(); g.moveTo(-E.W, E.H * 2); g.lineTo(-E.W, GY + 120); g.quadraticCurveTo(CX - 300, GY - 40, CX + 80, GY); g.quadraticCurveTo(CX + 600, GY + 30, E.W * 2, GY + 180); g.lineTo(E.W * 2, E.H * 2); g.closePath(); g.fill();
    pineJ(g, CX - 520, GY + 20, 1.5, shade(M.dark, -0.5));
  });
  return { GY, CX, M, HY: sv.HY };
}
