// sets/finale.js — Hakata bay with the lashed fleet (calm / storm), the flagship deck, the cliff,
// the modern harbour and ferry, the hilltop shrine (outside + inside) with the thirty stones.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng, noise, clamp, lerp, ease } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { ship, sea, flame, cairn, torii, banner, KZ_RED, GOLD } from './lib.js';
import { pineJ } from './coast.js';

// bay(g,t,cam,{storm:0..1, sink:0..1 (ships tilt and go down), lights})
export function bay(g, t, cam, o = {}) {
  const st = o.storm || 0, M = mood(st > 0.3 ? 'storm' : 'night'), HY = E.H * 0.5, CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); if (st < 0.5) FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, HY + E.H], count: 140 }); if (st > 0) { FX.clouds(g, { y: 40, h: 300, color: '#0a0c18', a: 0.6 * st, count: 12, seed: 3 }); const fl = (Math.floor(t * 3) % 5 === 0) && st > 0.5; if (fl) { veil(g, '#dfe6ff', 0.25); FX.lightning(g, { seed: Math.floor(t * 3), x1: CX + 300, x2: CX + 100, y2: HY - 20, a: 0.9 }); } } });
  layer(g, cam, 0.25, (g) => { sea(g, t * (1 + st * 2), HY, M, { color: shade(M.sky[1], -0.3), calm: o.calm ? 0.95 : 0 }); if (o.calm) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha(M.key, 0.05); g.fillRect(-E.W, HY, E.W * 3, 4); g.restore(); } });
  layer(g, cam, 0.5, (g) => {
    const r = rng(7), rows = 4;
    for (let row = 0; row < rows; row++) { const s = 0.22 + row * 0.12, y = HY + 20 + row * row * 26 + row * 30, n = 9 - row; for (let i = 0; i < n * 2; i++) { const x = -E.W * 0.4 + i * (E.W * 1.8 / (n * 2)) + (row % 2) * 60, sink = o.sink ? clamp(o.sink * 1.4 - r() * 0.6) : 0, tilt = (Math.sin(t * (0.7 + st) + i) * 0.04 + (sink * (i % 2 ? 0.5 : -0.4))) * (1 + st); g.save(); g.beginPath(); g.rect(x - 400, -2000, 800, y + 2000 + 4); g.clip(); ship(g, x, y + sink * 200 * s * 4, s, { t, tilt, lit: o.lights ? 0.6 * (1 - sink) : 0, emblem: s > 0.3, sail: shade(KZ_RED, -0.15 - 0.2 * (1 - s)) }); g.restore(); if (i < n * 2 - 1) seg(g, [[x + 120 * s, y - 30 * s], [x + (E.W * 1.8 / (n * 2)) - 120 * s, y - 30 * s]], 2, alpha('#d8c8a0', 0.4)); } }
  });
  if (st > 0) { FX.rain(g, t, { count: Math.round(400 * st), angle: 0.25, speed: 2600, a: 0.35 * st }); }
  return { HY, CX, M };
}
function veil(g, c, a) { g.save(); g.fillStyle = alpha(c, a); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.restore(); }
// the flagship deck in the storm. o.tilt (radians), o.mast 0..1 broken
export function deck(g, t, cam, o = {}) {
  const M = mood('storm'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, wood = '#1e1612';
  const flash = (Math.floor((t + (o.seed || 0)) * 2.6) % 6 === 0);
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.clouds(g, { y: 60, h: 300, color: '#0a0c18', a: 0.6, count: 12 }); if (flash || o.flash) { veil(g, '#dfe6ff', 0.3); FX.lightning(g, { seed: Math.floor(t * 2.6), x1: CX - 200, x2: CX - 360, y2: GY - 400 }); } });
  layer(g, cam, 0.3, (g) => { const r = rng(4); for (let i = 0; i < 6; i++) { const x = -E.W * 0.3 + i * 520 + r() * 100; ship(g, x, GY - 280 + (i % 2) * 20, 0.35, { t, tilt: Math.sin(t + i) * 0.15 + (i % 2 ? 0.6 : -0.5) * (o.sinkOthers || 0), sail: shade(KZ_RED, -0.4) }); } sea(g, t * 3, GY - 300, M, { color: shade(M.sky[1], -0.3) }); });
  layer(g, { ...cam, r: (cam.r || 0) + (o.tilt || 0) }, 0.9, (g) => {
    poly(g, [[-E.W, GY], [E.W * 2, GY], [E.W * 2, E.H * 2], [-E.W, E.H * 2]], wood); for (let x = -E.W; x < E.W * 2; x += 90) seg(g, [[x, GY], [x - 300, E.H * 1.5]], 3, 'rgba(0,0,0,.35)');
    seg(g, [[-E.W, GY - 80], [E.W * 2, GY - 80]], 10, wood); for (let x = -E.W; x < E.W * 2; x += 120) seg(g, [[x, GY], [x, GY - 80]], 8, wood);
    const mx = CX + (o.mastX ?? 420), br = o.mast || 0; seg(g, [[mx, GY], [mx, GY - 420]], 26, wood); g.save(); g.translate(mx, GY - 420); g.rotate(br * 1.3); seg(g, [[0, 0], [0, -700]], 24, wood); g.fillStyle = shade(KZ_RED, -0.25); g.fillRect(-200, -640, 400, 320); g.restore();
  });
  if (o.rain !== false) FX.rain(g, t, { count: 380, angle: 0.3, speed: 2800, a: 0.38 });
  return { GY, CX, M, flash };
}
// cliff above the sea (Hayato reads the sky)
export function cliff(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), HY = E.H * 0.56, CX = E.W / 2, GY = E.H * V(0.8, 0.68);
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX + 500, HY - 40, 44, '#fff3dc', M.key, 4); if (o.feathers) { g.strokeStyle = alpha('#fff4e8', 0.35); g.lineWidth = 3; g.lineCap = 'round'; const r = rng(9); for (let i = 0; i < 22; i++) { const x = r() * E.W * 1.4 - E.W * 0.2, y = 60 + r() * 380, L = 140 + r() * 220; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + L * 0.5, y - 30, x + L, y - 10); g.stroke(); for (let k = 1; k < 8; k++) { const u = k / 8; seg(g, [[x + L * u, y - 22 * Math.sin(u * Math.PI) - 4], [x + L * u - 16, y - 22 * Math.sin(u * Math.PI) + 14]], 1.5, alpha('#fff4e8', 0.25)); } } } });
  layer(g, cam, 0.25, (g) => sea(g, t, HY, M, { calm: o.calm ? 0.95 : 0 }));
  layer(g, cam, 0.8, (g) => { g.fillStyle = shade(M.dark, -0.4); g.beginPath(); g.moveTo(-E.W, E.H * 2); g.lineTo(-E.W, GY - 20); g.lineTo(CX + 200, GY - 10); g.lineTo(CX + 300, GY + 120); g.lineTo(CX + 260, E.H * 2); g.closePath(); g.fill(); pineJ(g, CX - 500, GY - 10, 1.6, shade(M.dark, -0.55)); });
  return { GY, CX, M, HY };
}
// modern harbour (golden hour): pier, nets, boats
export function harbor(g, t, cam, o = {}) {
  const M = mood('golden'), HY = E.H * 0.54, GY = E.H * V(0.8, 0.68), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX - 360, HY - 30, 58, '#fff3dc', M.key, 6); FX.clouds(g, { y: 140, h: 260, color: '#ffe0c0', a: 0.16 }); });
  layer(g, cam, 0.2, (g) => { FX.hills(g, { y: HY + 2, amp: 60, color: mix(M.sky[1], M.dark, 0.6), seed: 71 }); });
  layer(g, cam, 0.3, (g) => { sea(g, t, HY, M, { jade: '#3fae9a' }); FX.lensStreak(g, CX - 360, HY, E.W * 1.5, M.key, 0.3, 3); if (o.ferry != null) { const fx = lerp(-300, E.W + 300, o.ferry); g.fillStyle = '#1a1418'; g.beginPath(); g.moveTo(fx - 220, HY + 60); g.lineTo(fx + 240, HY + 60); g.lineTo(fx + 190, HY + 110); g.lineTo(fx - 200, HY + 110); g.closePath(); g.fill(); g.fillRect(fx - 120, HY + 10, 200, 52); g.fillRect(fx - 40, HY - 30, 90, 40); for (let i = 0; i < 5; i++) { g.fillStyle = alpha('#ffd59a', 0.7); g.fillRect(fx - 110 + i * 38, HY + 24, 22, 14); } } });
  layer(g, cam, 0.85, (g) => { g.fillStyle = '#2a1e18'; g.fillRect(-E.W, GY - 40, E.W * 3, 40); for (let x = -E.W; x < E.W * 2; x += 160) seg(g, [[x, GY], [x, E.H + 100]], 18, '#1a120e'); g.fillStyle = linGrad(g, 0, GY, 0, E.H, [shade(M.dark, -0.2), shade(M.dark, -0.5)]); g.fillRect(-E.W, GY, E.W * 3, E.H); if (o.nets !== false) for (let i = 0; i < 3; i++) { const nx = CX + 300 + i * 260; g.strokeStyle = alpha('#c9b48a', 0.5); g.lineWidth = 2; for (let k = 0; k < 8; k++) { g.beginPath(); g.moveTo(nx - 80 + k * 20, GY - 40); g.lineTo(nx - 60 + k * 12, GY - 160); g.stroke(); } seg(g, [[nx - 90, GY - 160], [nx + 40, GY - 160]], 5, '#3a2a1e'); } FX.pool(g, CX - 360, GY - 20, 800, 60, M.key, 0.2); });
  return { GY, CX, M, HY };
}
// hilltop shrine (outside). o: {mood, spring, stones (0..30)}
export function shrine(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, wood = '#2a1612';
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX + 560, GY - 260, 54, '#fff3dc', M.key, 5); FX.clouds(g, { y: 120, h: 300, color: M.key, a: 0.14 }); });
  layer(g, cam, 0.2, (g) => { sea(g, t, GY - 330, M, { jade: '#3fae9a' }); FX.hills(g, { y: GY - 320, amp: 40, color: mix(M.sky[1], M.dark, 0.6), seed: 81 }); });
  layer(g, cam, 0.55, (g) => {
    const sx = CX + (o.shrineX ?? 120), base = GY - 60; rr(g, sx - 300, base - 30, 600, 40, 4); g.fillStyle = shade(M.dark, -0.1); g.fill(); g.fillStyle = shade(M.wall, -0.35); g.fillRect(sx - 230, base - 230, 460, 200); g.fillStyle = alpha(M.practical, 0.55); g.fillRect(sx - 60, base - 180, 120, 150);
    g.fillStyle = shade(M.dark, -0.4); g.beginPath(); g.moveTo(sx - 360, base - 220); g.quadraticCurveTo(sx - 200, base - 260, sx - 160, base - 360); g.lineTo(sx + 160, base - 360); g.quadraticCurveTo(sx + 200, base - 260, sx + 360, base - 220); g.closePath(); g.fill();
    const n = o.stones ?? 30, r = rng(13); for (let i = 0; i < Math.floor(n); i++) { const row = Math.floor(i / 10), col = i % 10; cairn(g, sx - 320 + col * 70 + (row % 2) * 30, base - 250 - row * 26, 0.45 - row * 0.05, 2 + (i % 2), mix('#6a6070', M.dark, 0.4), mix('#b0a8c0', M.dark, 0.4), i + 1); }
    for (let i = -3; i < 0; i++) pineJ(g, sx - 520 + i * 160, base, 1.4, shade(M.dark, -0.45)); for (let i = 1; i < 3; i++) pineJ(g, sx + 360 + i * 170, base, 1.3, shade(M.dark, -0.45));
    if (o.spring) { const r2 = rng(5); for (let i = 0; i < 9; i++) { const tx = sx - 700 + i * 180 + r2() * 40, ty = base - 10; seg(g, [[tx, ty], [tx + 6, ty - 120]], 12, '#2a1a18'); for (let k = 0; k < 5; k++) circle(g, tx + (r2() - 0.5) * 120, ty - 140 - r2() * 80, 40 + r2() * 30, mix('#f2b8cc', M.dark, 0.25)); } }
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 70, 0, E.H, [shade(M.grass, -0.35), shade(M.dark, -0.5)]); g.beginPath(); g.moveTo(-E.W, E.H * 2); g.lineTo(-E.W, GY - 40); g.quadraticCurveTo(CX, GY - 100, E.W * 2, GY - 40); g.lineTo(E.W * 2, E.H * 2); g.closePath(); g.fill(); torii(g, CX - 420, GY - 50, 1.1, shade('#8a1a1a', -0.15)); for (let k = 0; k < 6; k++) rr(g, CX - 520 - k * 30, GY - 40 + k * 26, 200 + k * 60, 14, 4), g.fillStyle = shade(M.dark, -0.2 + k * 0.02), g.fill(); });
  if (o.spring) { const r3 = rng(2); for (let i = 0; i < 50; i++) { const x = (r3() * E.W * 1.2 + t * 60 * (0.5 + r3())) % (E.W * 1.2) - E.W * 0.1, y = (r3() * E.H + t * 40 * (0.5 + r3())) % E.H; g.fillStyle = alpha('#f8c8d8', 0.8); g.beginPath(); g.ellipse(x, y, 5, 3, t + i, 0, Math.PI * 2); g.fill(); } }
  return { GY, CX, M, shrineX: CX + (o.shrineX ?? 120) };
}
// shrine interior: dark wood, a lamp, the tachi on its stand
export function shrineIn(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, wood = '#24140f';
  layer(g, cam, 0.5, (g) => { backdrop(g, [shade(wood, -0.5), shade(wood, -0.2)]); for (let x = -E.W; x < E.W * 2; x += 140) seg(g, [[x, -E.H], [x, GY]], 10, shade(wood, -0.4)); g.fillStyle = shade(wood, -0.1); g.fillRect(-E.W, GY - 420, E.W * 3, 14); rr(g, CX - 380, GY - 360, 760, 300, 10); g.fillStyle = shade(wood, -0.35); g.fill(); });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, E.H, [shade(wood, 0.05), shade(wood, -0.5)]); g.fillRect(-E.W, GY, E.W * 3, E.H); for (const sx of [-1, 1]) { const lx = CX + sx * 520; rr(g, lx - 30, GY - 240, 60, 80, 10); g.fillStyle = '#ffe2a8'; g.fill(); seg(g, [[lx, GY - 160], [lx, GY]], 8, '#140c0a'); FX.pool(g, lx, GY, 300, 40, '#ffd59a', 0.3); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, lx, GY - 200, 200, '#ffd59a', 0.4); g.restore(); } seg(g, [[CX - 300, GY - 110], [CX - 300, GY]], 12, '#140c0a'); seg(g, [[CX + 300, GY - 110], [CX + 300, GY]], 12, '#140c0a'); for (const yy of [GY - 110, GY - 60]) { g.strokeStyle = '#140c0a'; g.lineWidth = 12; g.beginPath(); g.moveTo(CX - 330, yy - 10); g.quadraticCurveTo(CX, yy + 10, CX + 330, yy - 10); g.stroke(); } });
  FX.dust(g, t, { count: 40, color: '#ffd8a8', a: 0.35 });
  return { GY, CX, M, standY: GY - 130 };
}
