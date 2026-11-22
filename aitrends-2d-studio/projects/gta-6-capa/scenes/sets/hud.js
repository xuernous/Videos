// sets/hud.js — the "game world": neon grid floor, outlined skyline, HUD frame corners, scanlines, banners.
import { E, V, S, mood, layer, rr, seg, circle, ring, poly, linGrad, glow, alpha, shade, mix, lerp, clamp, ease, prog, text, measure, FONTS, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { groundY } from './home.js';

export const NEON = () => { const ui = S().ui; return { a: mood('interiorCool').practical, b: ui.accent, gold: ui.gold, good: ui.good, cream: ui.cream }; };

// o: { horizon (y), speed, tint }
export function hudWorld(g, t, cam, o = {}) {
  const M = mood('void'), N = NEON(), GY = groundY(), CX = E.W / 2, HY = o.horizon ?? GY - V(260, 380);
  layer(g, cam, 0.3, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, HY, [shade(M.dark, -0.5), shade(M.wall, -0.2), mix(M.wall, N.b, 0.25)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, HY + E.H);
    FX.stars(g, t, { area: [-E.W * 0.5, -E.H * 0.3, E.W * 2, HY + E.H * 0.2], count: 90, seed: 21, color: N.cream });
    // big neon sun
    const sx = CX + (o.sunX ?? 0), sy = HY - V(240, 300), sr = V(220, 230);
    glow(g, sx, sy, sr * 2.4, N.b, 0.35);
    g.save(); g.beginPath(); g.arc(sx, sy, sr, 0, Math.PI * 2); g.clip();
    g.fillStyle = linGrad(g, 0, sy - sr, 0, sy + sr, [N.gold, N.b]); g.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
    for (let i = 0; i < 7; i++) { const yy = sy + sr * (0.05 + i * 0.14); g.fillStyle = shade(M.wall, -0.2); g.fillRect(sx - sr, yy, sr * 2, 4 + i * 2.2); }
    g.restore();
  });
  layer(g, cam, 0.5, (g) => {
    // outlined skyline
    const r = rng(31); let x = -E.W * 0.6;
    while (x < E.W * 1.7) { const w = 60 + r() * 120, h = 120 + r() ** 1.4 * V(360, 520); g.fillStyle = shade(M.dark, -0.3); g.fillRect(x, HY - h, w, h + 2);
      g.strokeStyle = alpha(r() < 0.5 ? N.a : N.b, 0.55); g.lineWidth = 2.5; g.strokeRect(x + 1, HY - h + 1, w - 2, h);
      g.fillStyle = alpha(N.a, 0.35); for (let wy = HY - h + 16; wy < HY - 14; wy += 26) for (let wx = x + 12; wx < x + w - 14; wx += 22) if (r() < 0.25) g.fillRect(wx, wy, 8, 10);
      x += w + 10 + r() * 30; }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, HY, 0, E.H * 1.4, [shade(M.dark, -0.2), shade(M.dark, -0.6)]); g.fillRect(-E.W * 1.5, HY, E.W * 4, E.H * 2);
    g.fillStyle = alpha(N.b, 0.6); g.fillRect(-E.W * 1.5, HY - 2, E.W * 4, 4); glow(g, CX, HY, E.W * 0.9, N.b, 0.25);
    // perspective grid
    g.strokeStyle = alpha(N.a, 0.45); g.lineWidth = 2;
    for (let i = -24; i <= 24; i++) { g.beginPath(); g.moveTo(CX + i * 40, HY); g.lineTo(CX + i * V(420, 300), E.H * 1.6); g.stroke(); }
    const sp = o.speed ?? 0.6;
    for (let k = 0; k < 14; k++) { const u = ((k + t * sp) % 14) / 14, y = HY + Math.pow(u, 2.2) * (E.H * 1.6 - HY); g.globalAlpha = 0.2 + 0.6 * u; g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); }
    g.globalAlpha = 1;
  });
  return { GY, CX, M, HY, N };
}

// scanlines + chromatic edge (call at the very end of a HUD shot)
export function scan(g, t, a = 0.08) {
  g.save(); g.fillStyle = alpha('#000', a); const off = (t * 40) % 6; for (let y = -6 + off; y < E.H; y += 6) g.fillRect(0, y, E.W, 2); g.restore();
}
// corner brackets + optional top label / bottom label
export function hudFrame(g, t, o = {}) {
  const N = NEON(), m = V(60, 70), L = V(110, 120), c = o.color || N.a, a = o.a ?? 1, top = o.top ?? V(70, 210), bot = o.bot ?? E.H - V(70, 520);
  g.save(); g.globalAlpha *= a;
  for (const [x, y, sx, sy] of [[m, top, 1, 1], [E.W - m, top, -1, 1], [m, bot, 1, -1], [E.W - m, bot, -1, -1]]) seg(g, [[x + sx * L, y], [x, y], [x, y + sy * L]], 6, alpha(c, 0.85));
  if (o.label) { text(g, o.label, m + 20, top + V(40, 50), { size: V(30, 34), color: c, font: FONTS.ui, weight: 900, align: 'left', spacing: 4, glow: 12, glowColor: alpha(c, 0.7) }); }
  if (o.right) { text(g, o.right, E.W - m - 20, top + V(40, 50), { size: V(30, 34), color: N.gold, font: FONTS.ui, weight: 900, align: 'right', spacing: 2, glow: 12, glowColor: alpha(N.gold, 0.7) }); }
  g.restore();
}
// mission banner: pill with a label, pops in at `at`
export function banner(g, t, str, o = {}) {
  const N = NEON(), at = o.at ?? 0, k = ease.outBack(prog(t, at, at + 0.4)), a = clamp(prog(t, at, at + 0.2)) * (o.a ?? 1);
  if (a <= 0) return;
  const size = o.size ?? V(64, 70), y = o.y ?? E.H * 0.2, c = o.color || N.gold, w = measure(g, str, size, FONTS.title, 700) + size * 1.4, h = size * 1.6;
  g.save(); g.globalAlpha *= a; g.translate(E.W / 2, y); g.scale(k, k);
  rr(g, -w / 2, -h / 2, w, h, h / 2); g.fillStyle = alpha(shade(c, -0.8), 0.85); g.fill(); g.strokeStyle = c; g.lineWidth = 5; g.stroke();
  glow(g, 0, 0, w * 0.7, c, 0.2);
  if (o.sub) text(g, o.sub, 0, -h * 0.85, { size: size * 0.42, color: N.cream, font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, str, 0, 4, { size, color: c, font: FONTS.title, weight: 700, spacing: 3, glow: 20, glowColor: alpha(c, 0.8) });
  g.restore();
}
// heart row (health)
export function hearts(g, x, y, n, full, size, t, col) {
  for (let i = 0; i < n; i++) {
    const cx = x + i * size * 1.25, on = i < full, pul = on ? 1 + 0.06 * Math.sin(t * 6 + i) : 1, s = size * pul;
    g.save(); g.translate(cx, y); g.scale(s / 40, s / 40);
    g.beginPath(); g.moveTo(0, 14); g.bezierCurveTo(-36, -10, -18, -38, 0, -18); g.bezierCurveTo(18, -38, 36, -10, 0, 14); g.closePath();
    g.fillStyle = on ? col : alpha(col, 0.15); g.fill(); g.strokeStyle = alpha(col, 0.8); g.lineWidth = 3; g.stroke(); g.restore();
    if (on) glow(g, cx, y - size * 0.15, size, col, 0.25);
  }
}
// crosshair
export function crosshair(g, x, y, r, col, a = 1) {
  g.save(); g.globalAlpha *= a; ring(g, x, y, r, 5, col); ring(g, x, y, r * 0.35, 3, alpha(col, 0.7));
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) seg(g, [[x + dx * r * 0.6, y + dy * r * 0.6], [x + dx * r * 1.35, y + dy * r * 1.35]], 5, col);
  circle(g, x, y, 5, col); g.restore();
}
