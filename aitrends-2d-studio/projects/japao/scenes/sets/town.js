// sets/town.js — Dazaifu (gate + square), the peasant farmhouse, Najima fortress on its hill, the fever grotto.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng, noise, clamp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { flame, smoke, banner, hut, embers } from './lib.js';
import { pineJ } from './coast.js';

const roofJ = (g, x, y, w, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x - w * 0.62, y); g.quadraticCurveTo(x - w * 0.3, y - w * 0.12, x - w * 0.28, y - w * 0.28); g.lineTo(x + w * 0.28, y - w * 0.28); g.quadraticCurveTo(x + w * 0.3, y - w * 0.12, x + w * 0.62, y); g.closePath(); g.fill(); };
// town(g,t,cam,{mood:'day'|'night', gate: 0..1 open, square:true})
export function town(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, wall = shade(M.wall, -0.15), wood = '#2a1a16';
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); if (o.mood === 'night') { FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, E.H], count: 150 }); FX.moon(g, CX + 500, 160, 26); } else { FX.sun(g, CX - 520, GY - 520, 50, '#fff3dc', M.key, 4); FX.clouds(g, { y: 120, h: 260, color: '#fff', a: 0.12, seed: 4 }); } });
  layer(g, cam, 0.3, (g) => { FX.hills(g, { y: GY - 320, amp: 120, color: mix(M.sky[1], M.dark, 0.5), seed: 51 }); for (let i = -4; i < 6; i++) roofJ(g, CX + i * 300, GY - 300 - (i % 2) * 20, 260, shade(M.dark, -0.2)); });
  layer(g, cam, 0.55, (g) => {
    for (let i = -4; i <= 4; i++) { if (i === 0 && o.gate != null) continue; const x = CX + i * 340; g.fillStyle = shade(wall, (i % 2) * 0.05 - 0.1); g.fillRect(x - 160, GY - 260, 320, 260); for (let k = 0; k < 3; k++) { g.fillStyle = shade(wood, -0.2); g.fillRect(x - 140 + k * 100, GY - 220, 70, 90); } if (o.mood !== 'night') { g.fillStyle = alpha('#fff4e0', 0.12); g.fillRect(x - 160, GY - 260, 320, 6); } else { g.fillStyle = alpha(M.practical, 0.5); g.fillRect(x - 40, GY - 200, 60, 50); } roofJ(g, x, GY - 250, 380, shade(M.dark, -0.35)); }
    if (o.gate != null) { const gw = 420, gh = 420; seg(g, [[CX - gw / 2, GY], [CX - gw / 2, GY - gh]], 40, wood); seg(g, [[CX + gw / 2, GY], [CX + gw / 2, GY - gh]], 40, wood); roofJ(g, CX, GY - gh, gw * 1.4, shade(M.dark, -0.4)); g.fillStyle = o.mood === 'night' ? '#05060c' : mix(M.sky[2] || M.sky[1], '#fff', 0.2); g.fillRect(CX - gw / 2 + 20, GY - gh + 30, gw - 40, gh - 30); const op = o.gate; g.fillStyle = shade(wood, -0.1); g.fillRect(CX - gw / 2 + 20, GY - gh + 30, (gw / 2 - 20) * (1 - op), gh - 30); g.fillRect(CX + (gw / 2 - 20) * op, GY - gh + 30, (gw / 2 - 20) * (1 - op), gh - 30); }
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 20, 0, E.H, [mix('#9a8468', M.floor, 0.5), shade(M.dark, -0.4)]); g.fillRect(-E.W, GY - 20, E.W * 3, E.H * 2); FX.floorLines(g, GY - 10, GY + 400, 'rgba(0,0,0,.15)', 0.1); if (o.mood !== 'night') FX.pool(g, CX, GY + 20, 1000, 80, M.key, 0.12); });
  return { GY, CX, M };
}
export function cart(g, x, y, s, col = '#2a1a12') { rr(g, x - 150 * s, y - 120 * s, 300 * s, 40 * s, 6); g.fillStyle = col; g.fill(); for (const dx of [-90, 90]) { circle(g, x + dx * s, y - 50 * s, 50 * s, col); circle(g, x + dx * s, y - 50 * s, 14 * s, shade(col, 0.2)); } for (let i = 0; i < 4; i++) { g.fillStyle = '#c9b48a'; g.beginPath(); g.ellipse(x - 100 * s + i * 66 * s, y - 140 * s, 34 * s, 22 * s, 0, 0, Math.PI * 2); g.fill(); } }
export function riceBag(g, x, y, s) { g.fillStyle = '#c9b48a'; g.beginPath(); g.ellipse(x, y, 40 * s, 26 * s, 0, 0, Math.PI * 2); g.fill(); seg(g, [[x - 30 * s, y], [x + 30 * s, y]], 3 * s, '#8a7450'); }
// farmhouse with a warm window
export function farm(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = E.H * V(0.8, 0.68), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX + (o.sunX ?? 600), GY - 160, 60, '#fff3dc', M.key, 5); FX.clouds(g, { y: 100, h: 300, color: M.key, a: 0.14 }); });
  layer(g, cam, 0.3, (g) => { FX.hills(g, { y: GY - 160, amp: 120, color: mix(M.sky[1], M.dark, 0.6), seed: 61 }); });
  layer(g, cam, 0.6, (g) => { const hx = CX + (o.houseX ?? -380); hut(g, hx, GY - 20, 520, { wall: shade(M.wall, -0.3), roof: shade(M.dark, -0.25), lit: 0.9, light: M.practical }); FX.pool(g, hx, GY, 400, 50, M.practical, 0.25); seg(g, [[hx + 380, GY], [hx + 380, GY - 160]], 10, '#1a1210'); seg(g, [[hx + 520, GY], [hx + 520, GY - 160]], 10, '#1a1210'); seg(g, [[hx + 370, GY - 150], [hx + 530, GY - 150]], 10, '#1a1210'); for (let i = 0; i < 4; i++) pineJ(g, CX + 500 + i * 220, GY - 20, 1.2, shade(M.dark, -0.4)); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 30, 0, E.H, [shade(M.grass, -0.35), shade(M.dark, -0.5)]); g.fillRect(-E.W, GY - 30, E.W * 3, E.H * 2); poly(g, [[CX + 100, GY - 10], [E.W * 2, GY - 40], [E.W * 2, GY + 60], [CX + 60, GY + 40]], mix('#8a7058', M.floor, 0.5)); });
  return { GY, CX, M };
}
// Najima: fortress on a hill, forest edge in the foreground
export function najima(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, fx = CX + (o.fortX ?? 200), wood = '#1e1614';
  layer(g, cam, 0.1, (g) => { backdrop(g, o.dawn ? [mix(M.sky[0], '#5a4060', o.dawn), mix(M.sky[2] || M.sky[1], '#e8956b', o.dawn)] : M.sky); FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, E.H], count: 160 }); if (o.moon !== false) FX.moon(g, CX - 600, 160, 26); });
  layer(g, cam, 0.35, (g) => {
    g.fillStyle = shade(M.dark, -0.2); g.beginPath(); g.moveTo(fx - 900, GY); g.quadraticCurveTo(fx - 300, GY - 420, fx, GY - 430); g.quadraticCurveTo(fx + 400, GY - 420, fx + 900, GY); g.closePath(); g.fill();
    const top = GY - 420; for (let x = fx - 300; x < fx + 300; x += 26) poly(g, [[x, top], [x + 24, top], [x + 24, top - 120], [x + 12, top - 134], [x, top - 120]], wood);
    for (const tx of [fx - 300, fx + 300]) { g.fillStyle = wood; g.fillRect(tx - 40, top - 220, 80, 230); poly(g, [[tx - 60, top - 220], [tx + 60, top - 220], [tx, top - 290]], shade(wood, -0.3)); if (!o.empty) { g.fillStyle = alpha('#ffb060', 0.7); g.fillRect(tx - 12, top - 180, 24, 28); } }
    if (o.gate) { g.fillStyle = '#05040a'; g.fillRect(fx - 50, top - 110, 100, 110); g.fillStyle = alpha('#ffb060', 0.3 * o.gate); g.fillRect(fx - 50, top - 110, 100 * o.gate, 110); }
    if (!o.empty) for (let k = 0; k < 2; k++) banner(g, fx - 180 + k * 360, top - 280, 60, 40, t + k, { wind: 0.6 });
    if (o.boats) for (let i = 0; i < 3; i++) { const bx = fx + 560 + i * 140, by = GY - 30; poly(g, [[bx - 60, by], [bx + 60, by], [bx + 44, by + 20], [bx - 44, by + 20]], '#120c0c'); flame(g, bx, by - 6, 40 * o.boats, t + i, '#ff7a2a'); }
  });
  layer(g, cam, 0.8, (g) => { g.fillStyle = linGrad(g, 0, GY - 30, 0, E.H, [shade(M.floor, -0.3), shade(M.dark, -0.55)]); g.fillRect(-E.W, GY - 30, E.W * 3, E.H * 2); for (let i = -6; i < 0; i++) pineJ(g, CX - 400 + i * 180, GY + 20, 1.8, shade(M.dark, -0.55)); });
  return { GY, CX, M, fx, top: GY - 420 };
}
// grotto interior (fever)
export function grotto(g, t, cam, o = {}) {
  const M = mood('night'), GY = E.H * V(0.82, 0.7), CX = E.W / 2;
  layer(g, cam, 0.4, (g) => { backdrop(g, ['#07060a', '#141018']); const r = rng(5); for (let i = 0; i < 26; i++) { g.fillStyle = mix('#1a1620', '#2a2430', r()); g.beginPath(); g.ellipse(r() * E.W * 1.4 - E.W * 0.2, r() * GY, 120 + r() * 200, 80 + r() * 120, r(), 0, Math.PI * 2); g.fill(); } g.fillStyle = mix(M.sky[1], '#000', 0.4); g.beginPath(); g.ellipse(CX + (o.mouthX ?? 620), GY - 220, 200, 260, 0, 0, Math.PI * 2); g.fill(); FX.stars(g, t, { area: [CX + 460, GY - 460, 320, 300], count: 20 }); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 20, 0, E.H, ['#1a1418', '#08060a']); g.fillRect(-E.W, GY - 20, E.W * 3, E.H * 2); if (o.fire !== false) { flame(g, CX + (o.fireX ?? 120), GY, 34, t); FX.pool(g, CX + (o.fireX ?? 120), GY + 6, 500, 70, '#ff9a4a', 0.35); } });
  return { GY, CX, M };
}
