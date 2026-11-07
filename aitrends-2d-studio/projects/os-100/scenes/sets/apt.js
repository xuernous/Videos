// sets/apt.js — your apartment, the night before: front door with a warm hallway gap, a pile of unpaid bills,
// a desk lamp (the key light) and a night window. Mood: night, with a warm practical.
import { E, V, S, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const aptGround = () => E.H * V(0.8, 0.68);
export function apt(g, t, cam, o = {}) {
  const M = mood('night'), GY = aptGround(), CX = E.W / 2;
  const wall = shade(M.wall, -0.25), wallDark = shade(M.wall, -0.55);
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [wallDark, wall]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H);
    // night window (left)
    const wx = CX - V(820, 560), wy = GY - V(620, 900), ww = V(360, 300), wh = V(420, 520);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(M.wall, -0.7), bar: 10, blinds: 0 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h);
      FX.moon(g, x + w * 0.7, y + h * 0.22, 22);
      FX.skyline(g, { x, y: y + h, w, maxH: h * 0.55, color: shade(M.wall, -0.5), windowColor: alpha(M.practical, 0.7), lit: 0.3, seed: 12 });
    });
    // front door (centre) with warm light leaking under and around it
    const dw = V(260, 300), dh = V(560, 640), dx = CX - dw / 2 + (o.doorX || 0);
    g.fillStyle = shade(M.wall, -0.75); g.fillRect(dx - 18, GY - dh - 18, dw + 36, dh + 18);
    g.fillStyle = linGrad(g, 0, GY - dh, 0, GY, [shade('#3a2e3a', -0.3), shade('#3a2e3a', -0.55)]); g.fillRect(dx, GY - dh, dw, dh);
    for (const [px, py, pw, ph] of [[0.12, 0.08, 0.76, 0.36], [0.12, 0.52, 0.76, 0.4]]) { g.strokeStyle = alpha('#000', 0.35); g.lineWidth = 4; g.strokeRect(dx + dw * px, GY - dh + dh * py, dw * pw, dh * ph); }
    circle(g, dx + dw * 0.85, GY - dh * 0.48, 9, '#c9a46a');
    g.fillStyle = M.practical; g.fillRect(dx, GY - 9, dw, 9); glow(g, dx + dw / 2, GY - 4, dw * 0.9, M.practical, 0.55);
    // bills pinned on the wall
    const r = rng(5); for (let i = 0; i < 5; i++) { const bx = CX + V(330, 250) + r() * 120, by = GY - V(520, 760) + r() * 160; g.save(); g.translate(bx, by); g.rotate((r() - 0.5) * 0.4); g.fillStyle = '#d9d2c0'; g.fillRect(-34, -44, 68, 88); g.fillStyle = alpha(S().ui.accent, 0.8); g.fillRect(-26, -34, 34, 8); g.fillStyle = alpha('#555', 0.6); for (let k = 0; k < 5; k++) g.fillRect(-26, -16 + k * 11, 52, 4); g.restore(); }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.floor, 0.05), shade(M.dark, -0.2)]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.3)', 0.08);
    FX.pool(g, CX + (o.doorX || 0), GY + 30, V(320, 300), V(60, 70), M.practical, 0.35);
    // side table + lamp (right)
    const tx = CX + V(520, 360);
    g.fillStyle = '#17121c'; g.fillRect(tx - 120, GY - 170, 240, 16); seg(g, [[tx - 100, GY - 160], [tx - 100, GY]], 8, '#17121c'); seg(g, [[tx + 100, GY - 160], [tx + 100, GY]], 8, '#17121c');
    seg(g, [[tx + 40, GY - 172], [tx + 40, GY - 300]], 6, '#17121c'); poly(g, [[tx - 5, GY - 300], [tx + 85, GY - 300], [tx + 65, GY - 350], [tx + 15, GY - 350]], '#2a2028');
    glow(g, tx + 40, GY - 290, 380, mood('interiorWarm').key, 0.4); FX.lightCone(g, tx + 40, GY - 300, { angle: Math.PI / 2, spread: 1.1, len: 400, color: mood('interiorWarm').key, a: 0.18 });
    const rr0 = rng(9); for (let i = 0; i < 6; i++) { g.fillStyle = shade('#d9d2c0', -0.1 - rr0() * 0.2); g.save(); g.translate(tx - 60 + rr0() * 80, GY - 176 - i * 4); g.rotate((rr0() - 0.5) * 0.3); g.fillRect(-40, -3, 80, 4); g.restore(); }
  });
  return { GY, CX, M };
}
// a black envelope with a gold wax seal
export function envelope(g, x, y, s = 1, rot = 0, open = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  rr(g, -90, -55, 180, 110, 6); g.fillStyle = '#08070b'; g.fill();
  g.strokeStyle = alpha('#ffffff', 0.12); g.lineWidth = 2; g.strokeRect(-88, -53, 176, 106);
  if (open < 0.5) { poly(g, [[-90, -55], [90, -55], [0, 10 - open * 40]], '#141219'); }
  else { poly(g, [[-90, -55], [90, -55], [0, -55 - (open - 0.5) * 140]], '#141219'); }
  circle(g, 0, 4 - open * 20, 14, S().ui.gold); circle(g, 0, 4 - open * 20, 8, shade(S().ui.gold, -0.3));
  g.restore();
}
