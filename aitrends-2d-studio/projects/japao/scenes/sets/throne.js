// sets/throne.js — Kezhar throne hall: dark stone, tall red wolf banners, braziers, dais, god rays from a high window.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { banner, flame, wolfEmblem, KZ_RED, GOLD } from './lib.js';

export function throne(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), GY = E.H * V(0.82, 0.7), CX = E.W / 2, stone = shade('#2a2026', -0.2);
  layer(g, cam, 0.4, (g) => {
    backdrop(g, [shade(stone, -0.6), stone]);
    FX.windowFrame(g, { x: CX - 120, y: GY - 900, w: 240, h: 360, cols: 2, rows: 3, frame: shade(stone, -0.5), bar: 12, arch: true }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#ffcf8a', '#c86a3a']); g.fillRect(x, y, w, h); });
    FX.godRays(g, CX, GY - 760, { angle: Math.PI / 2, spread: 0.5, len: 1000, color: '#ffc070', a: 0.08, t });
    for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { const px = CX + sx * (360 + k * 330); g.fillStyle = shade(stone, -0.35 + k * 0.05); g.fillRect(px - 50, GY - 1000, 100, 1000); banner(g, px - sx * 110 - 60, GY - 860, 120, 420, t + k, { f: 1, wind: 0.25, cloth: shade(KZ_RED, -0.1) }); }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, E.H, [shade(stone, -0.2), shade(stone, -0.7)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    poly(g, [[CX - 140, GY], [CX + 140, GY], [CX + 600, E.H * 1.5], [CX - 600, E.H * 1.5]], shade(KZ_RED, -0.35));           // carpet
    for (let k = 0; k < 3; k++) { rr(g, CX - 330 + k * 40, GY - 40 - k * 30, 660 - k * 80, 34, 4); g.fillStyle = shade(stone, 0.05 - k * 0.04); g.fill(); }  // dais
    const ty = GY - 120; poly(g, [[CX - 110, ty], [CX + 110, ty], [CX + 90, ty - 320], [CX, ty - 380], [CX - 90, ty - 320]], '#120a0c');                   // throne back
    g.strokeStyle = alpha(GOLD, 0.6); g.lineWidth = 5; g.beginPath(); g.moveTo(CX - 90, ty - 320); g.lineTo(CX, ty - 380); g.lineTo(CX + 90, ty - 320); g.stroke();
    wolfEmblem(g, CX, ty - 290, 44, alpha(GOLD, 0.8), '#120a0c');
    for (const sx of [-1, 1]) { const bx = CX + sx * 480; seg(g, [[bx - 30, GY], [bx, GY - 150], [bx + 30, GY]], 8, '#140c0e'); rr(g, bx - 46, GY - 176, 92, 30, 8); g.fillStyle = '#140c0e'; g.fill(); flame(g, bx, GY - 176, 46, t + sx, '#ff8a3a'); FX.pool(g, bx, GY + 10, 260, 40, '#ff9a4a', 0.3); }
  });
  FX.dust(g, t, { count: 50, color: '#ffc890', a: 0.35 });
  return { GY, CX, M, seatY: GY - 120 };
}
