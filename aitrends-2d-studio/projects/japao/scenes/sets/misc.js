// sets/misc.js — plains (cavalry country), scriptorium of the Escreventes, burned temple, rolling hills, forest.
import { E, V, mood, layer, backdrop, blurLayer, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng, noise, clamp, lerp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { flame, smoke, embers, hut, grassBlades } from './lib.js';
import { pineJ } from './coast.js';

export function plain(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = E.H * V(0.8, 0.68), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); FX.sun(g, CX + (o.sunX ?? -420), GY - 260, 70, '#fff3dc', M.key, 5); FX.clouds(g, { y: GY - 700, h: 300, color: M.key, a: 0.14, seed: 2 }); });
  layer(g, cam, 0.25, (g) => { FX.hills(g, { y: GY - 200, amp: 120, color: mix(M.sky[1], M.dark, 0.6), freq: 0.002, seed: 5 }); });
  layer(g, cam, 0.5, (g) => { FX.hills(g, { y: GY - 90, amp: 60, color: shade(M.grass, -0.5), freq: 0.004, seed: 8 }); if (o.village) { for (let i = 0; i < 5; i++) hut(g, CX + 200 + i * 130, GY - 70, 90, { wall: shade(M.wall, -0.4), roof: shade(M.dark, -0.3), fire: o.burn ? 1 : 0, t: t + i }); if (o.burn) for (let i = 0; i < 3; i++) smoke(g, t + i, CX + 260 + i * 200, GY - 150, { color: shade(M.dark, -0.4), a: 0.4, w: 60, seed: i }); } });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 40, 0, E.H, [shade(M.grass, -0.35), shade(M.dark, -0.5)]); g.fillRect(-E.W, GY - 40, E.W * 3, E.H * 2); FX.pool(g, CX + (o.sunX ?? -420), GY, 900, 60, M.key, 0.14); });
  return { GY, CX, M };
}
// scriptorium: long tables, candles, scribes (drawn by shots), shelves of scrolls
export function scriptorium(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, wall = shade('#3a2a24', -0.35);
  layer(g, cam, 0.4, (g) => {
    backdrop(g, [shade(wall, -0.5), wall]); const r = rng(3);
    for (let k = -4; k <= 4; k++) { const x = CX + k * 300; g.fillStyle = shade(wall, -0.3); g.fillRect(x - 130, GY - 700, 260, 560); for (let j = 0; j < 5; j++) for (let i = 0; i < 6; i++) { circle(g, x - 100 + i * 40, GY - 660 + j * 100, 16, mix('#c9b48a', wall, 0.4 + r() * 0.4)); circle(g, x - 100 + i * 40, GY - 660 + j * 100, 6, shade(wall, -0.4)); } }
    for (const sx of [-1, 1]) banner_(g, CX + sx * 760, GY - 760, t);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, E.H, [shade(M.floor, -0.3), shade(M.dark, -0.5)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    if (o.tables !== false) for (let k = -1; k <= 1; k++) { const tx = CX + k * 620, ty = GY - 120; g.fillStyle = '#1a1210'; g.fillRect(tx - 260, ty, 520, 16); g.fillRect(tx - 240, ty + 16, 16, 104); g.fillRect(tx + 224, ty + 16, 16, 104); for (const cx of [tx - 180, tx + 180]) { rr(g, cx - 5, ty - 34, 10, 34, 3); g.fillStyle = '#e8dcc0'; g.fill(); flame(g, cx, ty - 34, 12, t + cx, '#ffb04a'); FX.pool(g, cx, ty + 2, 180, 20, '#ffc070', 0.3); } g.fillStyle = '#e4d6b0'; g.fillRect(tx - 120, ty - 4, 240, 5); }
  });
  FX.dust(g, t, { count: 40, color: '#ffd0a0', a: 0.3 });
  return { GY, CX, M, tableY: GY - 120 };
}
function banner_(g, x, y, t) { g.fillStyle = '#7a1a20'; g.fillRect(x - 60, y, 120, 420); }
// burned temple ruins at grey dawn
export function temple(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, burnt = '#140e10';
  layer(g, cam, 0.1, (g) => { backdrop(g, [mix(M.sky[0], '#555060', 0.5), mix(M.sky[2] || M.sky[1], '#8a7a80', 0.5)]); FX.clouds(g, { y: 100, h: 400, color: '#cfc8d8', a: 0.1, seed: 9 }); });
  layer(g, cam, 0.35, (g) => { FX.hills(g, { y: GY - 160, amp: 80, color: mix(M.dark, '#3a3540', 0.4), seed: 2 }); for (let i = -4; i < 8; i++) pineJ(g, CX - 800 + i * 220, GY - 150, 1, shade(M.dark, -0.3)); });
  layer(g, cam, 0.6, (g) => {
    const x0 = CX + (o.templeX ?? 160); for (const dx of [-260, -90, 90, 260]) { const h = 320 - Math.abs(dx) * 0.3; seg(g, [[x0 + dx, GY - 40], [x0 + dx + 6, GY - 40 - h]], 26, burnt); }
    poly(g, [[x0 - 420, GY - 360], [x0 - 40, GY - 470], [x0 + 120, GY - 430], [x0 - 200, GY - 330]], burnt); seg(g, [[x0 - 300, GY - 300], [x0 + 330, GY - 340]], 18, burnt);
    for (let i = 0; i < 3; i++) smoke(g, t + i * 2, x0 - 200 + i * 200, GY - 200, { color: '#4a4450', a: 0.25, w: 80, rise: 700, seed: i + 5 });
  });
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 40, 0, E.H, [shade(M.floor, -0.2), shade(M.dark, -0.4)]); g.fillRect(-E.W, GY - 40, E.W * 3, E.H * 2); const r = rng(4); for (let i = 0; i < 20; i++) seg(g, [[CX - 900 + r() * 1800, GY - 20 + r() * 80], [CX - 900 + r() * 1800, GY - 10 + r() * 80]], 6, burnt);
    if (o.well !== false) { const wx = CX - 360; rr(g, wx - 90, GY - 90, 180, 90, 10); g.fillStyle = '#3a3238'; g.fill(); g.fillStyle = '#0a0808'; g.beginPath(); g.ellipse(wx, GY - 90, 90, 16, 0, 0, Math.PI * 2); g.fill(); seg(g, [[wx - 80, GY - 90], [wx - 80, GY - 220], [wx + 80, GY - 220], [wx + 80, GY - 90]], 10, burnt); } });
  embers(g, t, { count: 25, color: '#ffa060', speed: 30 });
  return { GY, CX, M, wellX: CX - 360 };
}
// rolling hills with a ridge path (journeys)
export function hills(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = E.H * V(0.78, 0.66), CX = E.W / 2;
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); if (o.mood === 'night') { FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, E.H * 1.4], count: 200 }); FX.moon(g, CX + 500, 180, 28); } else FX.sun(g, CX + (o.sunX ?? 400), GY - 300, 60, '#fff3dc', M.key, 5); });
  layer(g, cam, 0.2, (g) => FX.hills(g, { y: GY - 260, amp: 160, color: mix(M.sky[1], M.dark, 0.55), freq: 0.0025, seed: 11 }));
  layer(g, cam, 0.4, (g) => { FX.hills(g, { y: GY - 120, amp: 100, color: shade(M.grass, -0.45), freq: 0.003, seed: 12 }); if (o.village) for (let i = 0; i < 4; i++) hut(g, CX - 500 + i * 120, GY - 150 + i * 6, 70, { wall: shade(M.wall, -0.4), roof: shade(M.dark, -0.2), lit: 0.7, light: M.practical }); });
  layer(g, cam, 0.8, (g) => { g.fillStyle = linGrad(g, 0, GY - 30, 0, E.H, [shade(M.grass, -0.3), shade(M.dark, -0.45)]); g.beginPath(); g.moveTo(-E.W, E.H * 2); g.lineTo(-E.W, GY); for (let x = -E.W; x <= E.W * 2; x += 40) g.lineTo(x, GY - 10 + noise(x * 0.002, 3) * 30); g.lineTo(E.W * 2, E.H * 2); g.closePath(); g.fill(); for (let i = -4; i < 6; i++) pineJ(g, CX + i * 420 + 120, GY + 30 + (i % 2) * 20, 1.3, shade(M.dark, -0.45)); });
  return { GY, CX, M };
}
// forest (night or day), optional mist, campfire spot, clearing
export function forest(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, dark = shade(M.dark, -0.35);
  layer(g, cam, 0.1, (g) => { backdrop(g, M.sky); if (o.mood === 'night' || !o.mood) { FX.stars(g, t, { area: [-E.W, -E.H, E.W * 3, E.H], count: 120 }); if (o.moon !== false) FX.moon(g, CX + 480, 150, 24); } });
  const trunks = (depth, n, col, seed, w0, gap) => layer(g, cam, depth, (g) => { const r = rng(seed); for (let i = 0; i < n; i++) { const x = -E.W * 0.6 + i * gap + r() * gap * 0.6, w = w0 * (0.7 + r() * 0.6); g.fillStyle = col; g.fillRect(x - w / 2, -E.H, w, GY + E.H + 40); g.beginPath(); g.ellipse(x, GY - 600 - r() * 200, w * 4, w * 2.4, 0, 0, Math.PI * 2); g.fill(); } });
  trunks(0.3, 26, mix(M.sky[1], dark, 0.6), 3, 24, 130); if (o.mist !== false) layer(g, cam, 0.35, (g) => FX.fog(g, GY - 380, 360, M.fog, 0.35));
  trunks(0.55, 18, mix(M.sky[0], dark, 0.82), 5, 40, 190);
  layer(g, cam, 0.85, (g) => { g.fillStyle = linGrad(g, 0, GY - 40, 0, E.H, [shade(M.floor, -0.25), shade(M.dark, -0.55)]); g.fillRect(-E.W, GY - 40, E.W * 3, E.H * 2); if (o.godray !== false && o.mood !== 'day') FX.godRays(g, CX + 480, 150, { angle: Math.PI * 0.62, spread: 0.35, len: 1200, color: M.key, a: 0.05, t }); if (o.fire) FX.pool(g, CX + (o.fireX ?? 0), GY + 10, 700, 110, '#ff9a4a', 0.35); });
  return { GY, CX, M };
}
export function fgTrunks(g, t, cam, o = {}) { blurLayer(g, 10, (g) => { const M = mood(o.mood || 'night'); g.fillStyle = shade(M.dark, -0.6); for (const x of o.xs || [120, E.W - 160]) { g.fillRect(x - 70, -100, 140, E.H + 200); } }, cam, 1.6); }
