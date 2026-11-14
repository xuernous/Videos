// sets/night.js — the night beach after the attack, the ravine of stones, the tall grass/mud field, dawn sky.
import { E, V, mood, layer, blurLayer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng, noise, clamp, lerp, ease } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { sea, cairn, grassBlades, smoke, embers, hut } from './lib.js';
import { pineJ } from './coast.js';

// beachNight(g,t,cam,{covered: n shapes in a row, ghosts, moonX})
export function beachNight(g, t, cam, o = {}) {
  const M = mood('night'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, HY = GY - V(230, 400);
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, HY + E.H], count: 200 }); FX.moon(g, CX + (o.moonX ?? -380), HY - 360, 40); });
  layer(g, cam, 0.25, (g) => { sea(g, t, HY, M, { color: shade(M.sky[1], -0.25) }); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const y = HY + 10 + i * i * 2; g.fillStyle = alpha(M.key, 0.12 - i * 0.007); g.fillRect(CX + (o.moonX ?? -380) - 30 - i * 6 + Math.sin(t * 1.5 + i) * 8, y, 60 + i * 12, 3); } g.restore(); });
  layer(g, cam, 0.5, (g) => { g.fillStyle = shade(M.dark, -0.3); g.beginPath(); g.moveTo(CX + 300, HY + 20); g.quadraticCurveTo(CX + 800, HY - 240, CX + 1600, HY - 260); g.lineTo(CX + 1700, GY); g.lineTo(CX + 300, GY); g.closePath(); g.fill(); for (let i = 0; i < 5; i++) { seg(g, [[CX + 520 + i * 160, HY + 30 - i * 30], [CX + 530 + i * 160, HY - 40 - i * 30]], 10, '#120c10'); } if (o.smoke !== false) for (let i = 0; i < 3; i++) smoke(g, t + i * 2, CX + 560 + i * 200, HY - 60 - i * 20, { color: '#3a3448', a: 0.25, w: 60, rise: 600, seed: i + 7 }); });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 120, 0, E.H, [mix('#8a8aa0', M.floor, 0.6), shade(M.dark, -0.4)]); g.beginPath(); g.moveTo(-E.W, GY - 110); for (let x = -E.W; x <= E.W * 2; x += 60) g.lineTo(x, GY - 105 + noise(x * 0.004, 5) * 18); g.lineTo(E.W * 2, E.H * 2); g.lineTo(-E.W, E.H * 2); g.closePath(); g.fill();
    g.strokeStyle = alpha('#dfe6ff', 0.2); g.lineWidth = 3; g.beginPath(); for (let x = -E.W; x <= E.W * 2; x += 30) { const y = GY - 110 + noise(x * 0.004, 5) * 18 + Math.sin(t * 0.7 + x * 0.01) * 5; x === -E.W ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
    const n = o.covered ?? 0, x0 = CX + (o.rowX ?? -760), step = o.step ?? 62;
    for (let i = 0; i < n; i++) { const x = x0 + i * step, y = GY - 46 + (i % 2) * 6; g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(x, y + 8, 30, 8, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = i === n - 1 && o.blue ? '#2c4a70' : mix('#b8b4c8', M.dark, 0.45); g.beginPath(); g.moveTo(x - 26, y + 4); g.quadraticCurveTo(x - 30, y - 24, x - 6, y - 30); g.quadraticCurveTo(x + 24, y - 30, x + 28, y + 4); g.closePath(); g.fill(); }
  });
  return { GY, CX, M, HY };
}
// ravine behind the beach: rocky walls, cairns (count can grow)
export function ravine(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, rock = shade(M.dark, -0.15);
  layer(g, cam, 0.1, (g) => { backdrop(g, o.dawn ? [mix(M.sky[0], '#4a3a5a', o.dawn), mix(M.sky[2] || M.sky[1], '#e8956b', o.dawn)] : M.sky); FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, E.H * 1.2], count: Math.round(180 * (1 - (o.dawn || 0))) }); if (o.moon !== false) { const a = o.moonA ?? 0; FX.moon(g, CX - 500 + a * 1000, 260 - Math.sin(a * Math.PI) * 140, 30); } });
  layer(g, cam, 0.45, (g) => { for (const sd of [-1, 1]) { g.fillStyle = rock; g.beginPath(); g.moveTo(CX + sd * 2000, E.H * 2); g.lineTo(CX + sd * 2000, -200); for (let k = 0; k <= 10; k++) { const yy = -200 + k * (GY + 200) / 10; g.lineTo(CX + sd * (480 + noise(k * 0.9, sd + 4) * 120 + k * 22), yy); } g.lineTo(CX + sd * 760, E.H * 2); g.closePath(); g.fill(); } });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 40, 0, E.H, [shade(M.floor, -0.2), shade(M.dark, -0.5)]); g.fillRect(-E.W, GY - 40, E.W * 3, E.H * 2);
    const n = o.cairns ?? 0, r = rng(3); for (let i = 0; i < Math.floor(n); i++) { const row = Math.floor(i / 10), col = i % 10; const x = CX - 520 + col * 112 + (row % 2) * 50, y = GY - 30 + row * 52; cairn(g, x, y, 0.75 + row * 0.12, 3 + (i % 3), mix('#5a5466', M.dark, 0.35), mix('#a8a0b8', M.dark, 0.4), i + 1); }
  });
  return { GY, CX, M };
}
// tall grass field / mud (low camera)
export function grassField(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = E.H * V(0.82, 0.7), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); if (o.fireGlow) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, CX + 300, GY - 200, 900, '#ff6a2a', 0.35 * o.fireGlow); g.restore(); } });
  layer(g, cam, 0.3, (g) => { for (let i = 0; i < 6; i++) hut(g, CX - 300 + i * 200, GY - 230, 120, { wall: shade(M.wall, -0.5), roof: shade(M.dark, -0.4), fire: o.fireGlow ? 1 : 0, t: t + i }); if (o.fireGlow) for (let i = 0; i < 3; i++) smoke(g, t + i, CX - 200 + i * 300, GY - 300, { color: '#2a2028', a: 0.45, w: 90, seed: i }); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 80, 0, E.H, ['#2a2018', '#100a08']); g.fillRect(-E.W, GY - 80, E.W * 3, E.H * 2); grassBlades(g, t, { y: GY, count: 140, h: 200, color: shade(M.grass, -0.6), x0: -E.W * 0.5, x1: E.W * 1.5, seed: 4 }); });
  return { GY, CX, M };
}
