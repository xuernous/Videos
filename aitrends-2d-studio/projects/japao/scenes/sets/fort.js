// sets/fort.js — Velkun's fort at Hakata (night, optional fire), the waterfall + cave, the bridge over the river.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng, noise, clamp, lerp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { flame, embers, smoke, banner, sea } from './lib.js';
import { pineJ } from './coast.js';

// fort(g,t,cam,{fire:0..1, wind:0..1})
export function fort(g, t, cam, o = {}) {
  const M = mood('night'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, fire = o.fire || 0, wood = shade('#2a1e1a', -0.2);
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, E.H], count: 160 }); FX.moon(g, CX - 620, 150, 26); FX.clouds(g, { y: 120, h: 240, color: '#8a90c0', a: 0.12 + 0.1 * (o.wind || 0), seed: 3 }); });
  layer(g, cam, 0.25, (g) => sea(g, t, GY - 330, M, { color: shade(M.sky[1], -0.3) }));
  layer(g, cam, 0.55, (g) => {
    const fx = CX + (o.fortX ?? 120), top = GY - 360;
    for (let x = fx - 700; x < fx + 700; x += 30) { const h = 300 + noise(x * 0.04, 2) * 14; poly(g, [[x, GY - 40], [x + 28, GY - 40], [x + 28, GY - 40 - h], [x + 14, GY - 58 - h], [x, GY - 40 - h]], wood); }
    for (const tx of [fx - 700, fx - 230, fx + 240, fx + 700]) { g.fillStyle = shade(wood, -0.2); g.fillRect(tx - 60, top - 160, 120, 480); poly(g, [[tx - 90, top - 160], [tx + 90, top - 160], [tx, top - 260]], shade(wood, -0.35)); g.fillStyle = alpha('#ffb060', 0.6 * (1 - fire * 0.5)); g.fillRect(tx - 18, top - 110, 36, 40); }
    for (let k = 0; k < 3; k++) banner(g, fx - 460 + k * 470, top - 330, 80, 54, t + k, { wind: 0.5 + 1.5 * (o.wind || 0) });
    if (fire > 0) { for (let i = 0; i < 9; i++) { const x = fx - 640 + i * 160, s = (50 + (i % 3) * 30) * clamp(fire * 1.6 - (i % 4) * 0.15); if (s > 2) flame(g, x, GY - 340 + (i % 2) * 40, s, t + i, i % 2 ? '#ff7a2a' : '#ff9a3a'); } for (let i = 0; i < 5; i++) smoke(g, t + i, fx - 500 + i * 250, GY - 420, { color: '#1a1418', a: 0.5 * fire, w: 110, rise: 900, seed: i + 11 }); }
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 40, 0, E.H, [shade(M.floor, -0.3), shade(M.dark, -0.55)]); g.fillRect(-E.W, GY - 40, E.W * 3, E.H * 2); if (fire) FX.pool(g, CX, GY, 1400, 120, '#ff6a2a', 0.35 * fire); });
  if (fire > 0) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, CX, GY - 300, 1100, '#ff5a1a', 0.22 * fire); g.restore(); embers(g, t, { count: Math.round(80 * fire), speed: 140, size: 3 }); }
  return { GY, CX, M, fortX: CX + (o.fortX ?? 120) };
}
export function warehouse(g, x, y, w, col = '#22181a') { g.fillStyle = col; g.fillRect(x - w / 2, y - w * 0.5, w, w * 0.5); poly(g, [[x - w * 0.6, y - w * 0.5], [x + w * 0.6, y - w * 0.5], [x, y - w * 0.85]], shade(col, -0.3)); g.fillStyle = '#c9a060'; for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(x - w * 0.35 + i * w * 0.18, y - 8, w * 0.08, w * 0.05, 0, 0, Math.PI * 2); g.fill(); } }

// waterfall with a dark cave behind it
export function waterfall(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, rock = shade(M.dark, -0.1), wx = CX + (o.fallX ?? 120);
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, E.H], count: 140 }); FX.moon(g, CX - 560, 140, 28); });
  layer(g, cam, 0.4, (g) => { for (let i = -5; i < 9; i++) pineJ(g, CX - 1000 + i * 210, GY - 360, 1.2, shade(M.dark, -0.35)); });
  layer(g, cam, 0.7, (g) => {
    g.fillStyle = rock; g.beginPath(); g.moveTo(-E.W, E.H * 2); g.lineTo(-E.W, GY - 520); g.lineTo(wx - 260, GY - 560); g.lineTo(wx + 280, GY - 580); g.lineTo(E.W * 2, GY - 500); g.lineTo(E.W * 2, E.H * 2); g.closePath(); g.fill();
    g.fillStyle = '#05040a'; g.beginPath(); g.ellipse(wx, GY - 180, 200, 230, 0, Math.PI, Math.PI * 2); g.fillRect(wx - 200, GY - 180, 400, 180); g.fill();
    if (o.cave) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, wx, GY - 100, 260, '#ffb070', 0.18 * o.cave); g.restore(); }
    const fw = 340, fa = o.part ? 0.35 : 0.6; for (let i = 0; i < 40; i++) { const x = wx - fw / 2 + (i / 40) * fw + Math.sin(i * 7) * 6, ph = (t * 1.6 + i * 0.37) % 1; g.strokeStyle = alpha('#cfe0ff', fa * (0.4 + 0.6 * ((i * 13) % 7) / 7)); g.lineWidth = 6; g.beginPath(); g.moveTo(x, GY - 560); g.lineTo(x + 2, GY - 20); g.stroke(); circle(g, x, GY - 560 + ph * 540, 4, alpha('#ffffff', 0.5)); }
    g.fillStyle = linGrad(g, 0, GY - 30, 0, E.H, [mix('#5a6a9a', M.dark, 0.5), shade(M.dark, -0.5)]); g.fillRect(-E.W, GY - 30, E.W * 3, E.H * 2);
    FX.fog(g, GY - 120, 220, '#cfe0ff', 0.3); FX.rings(g, wx, GY - 10, t, { color: '#e0ecff', r0: 60, r1: 260, a: 0.25, count: 3 });
  });
  return { GY, CX, M, fallX: wx };
}
// wooden bridge over a river; o.broken 0..1 (sag + gap)
export function bridge(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = E.H * V(0.62, 0.55), CX = E.W / 2, wood = '#1a1210', red = o.red || 0;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX + 500, GY - 300, 46, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.25, (g) => { FX.hills(g, { y: GY - 60, amp: 140, color: mix(M.sky[1], M.dark, 0.6), seed: 41 }); for (let i = -6; i < 8; i++) pineJ(g, CX + i * 230, GY - 40 + (i % 2) * 10, 1.1, shade(M.dark, -0.3)); });
  layer(g, cam, 0.6, (g) => {
    g.fillStyle = linGrad(g, 0, GY + 40, 0, E.H, [mix(mix('#4a5a80', '#a01818', red), M.dark, 0.35), shade(M.dark, -0.4)]); g.fillRect(-E.W, GY + 40, E.W * 3, E.H * 2);
    g.strokeStyle = alpha(mix('#cfe0ff', '#ff6a5a', red), 0.18); g.lineWidth = 3; for (let i = 0; i < 18; i++) { const y = GY + 60 + i * i * 2.4; g.beginPath(); for (let x = -E.W; x < E.W * 2; x += 160) { const xx = x + ((t * 120 + i * 40) % 160); g.moveTo(xx, y); g.lineTo(xx + 60, y); } g.stroke(); }
    for (const sd of [-1, 1]) { g.fillStyle = shade(M.grass, -0.5); g.beginPath(); g.moveTo(CX + sd * 700, GY + 30); g.lineTo(CX + sd * 2400, GY - 20); g.lineTo(CX + sd * 2400, E.H * 2); g.lineTo(CX + sd * 900, E.H * 2); g.closePath(); g.fill(); }
  });
  layer(g, cam, 0.85, (g) => {
    const br = o.broken || 0, L = CX - 760, R = CX + 760, sag = (x) => br * 140 * Math.max(0, 1 - Math.abs(x - CX) / 300);
    for (const px of [CX - 520, CX - 180, CX + 180, CX + 520]) seg(g, [[px, GY + 10], [px, E.H + 200]], 24, wood);
    for (let x = L; x < R; x += 22) { if (br > 0.5 && Math.abs(x - CX) < 80 * br) continue; g.fillStyle = shade(wood, (x % 44) ? 0.05 : -0.1); g.fillRect(x, GY - 10 + sag(x), 20, 22); }
    for (const dy of [-70, -36]) { g.strokeStyle = wood; g.lineWidth = 8; g.beginPath(); for (let x = L; x <= R; x += 20) { const y = GY + dy + sag(x); if (br > 0.5 && Math.abs(x - CX) < 80 * br) { g.stroke(); g.beginPath(); continue; } x === L ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
    for (let x = L; x <= R; x += 120) seg(g, [[x, GY - 10 + sag(x)], [x, GY - 74 + sag(x)]], 8, wood);
  });
  if (o.fog) layer(g, cam, 0.9, (g) => FX.fog(g, GY - 260, 420, M.fog, 0.45 * o.fog));
  return { GY, CX, M };
}
