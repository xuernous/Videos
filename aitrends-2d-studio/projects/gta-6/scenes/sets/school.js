// sets/school.js — classroom: tall windows (left), chalkboard, wall clock, desk rows.
import { E, V, S, mood, layer, rr, seg, circle, ring, poly, linGrad, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { groundY, wallBase } from './home.js';

export function schoolDesk(g, x, y, s, M, o = {}) {
  const dk = shade(M.dark, -0.4), top = y - 92 * s, hw = 92 * s;
  g.fillStyle = shade(M.floor, 0.05); g.fillRect(x - hw, top - 8 * s, hw * 2, 10 * s);
  g.fillStyle = dk; g.fillRect(x - hw, top + 2 * s, hw * 2, 16 * s);
  seg(g, [[x - hw + 12 * s, top], [x - hw + 12 * s, y]], 7 * s, dk); seg(g, [[x + hw - 12 * s, top], [x + hw - 12 * s, y]], 7 * s, dk);
  if (o.paper) { poly(g, [[x - 50 * s, top - 8 * s], [x + 40 * s, top - 11 * s], [x + 52 * s, top - 6 * s], [x - 40 * s, top - 4 * s]], mix('#efe6d2', M.key, 0.2)); }
}

// o: { mood:'interiorCool'|'golden', board:'SIMULADO', clockT, students:true, sun }
export function classroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), sky = mood(o.mood === 'golden' ? 'golden' : 'day'), CX = E.W / 2, GY = groundY(), WB = wallBase();
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, WB, [shade(M.dark, -0.4), shade(M.wall, -0.4), shade(M.wall, -0.2)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, WB + E.H + 4);
    // windows on the left wall
    for (let i = 0; i < 2; i++) {
      const wx = CX - V(1100, 860) + i * V(380, 330), wy = WB - V(820, 960), ww = V(300, 260), wh = V(640, 760);
      glow(g, wx + ww / 2, wy + wh / 2, ww * 1.3, sky.key, 0.18);
      FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 3, frame: shade(M.dark, -0.3), bar: 9 }, (g, x, y, w, h) => {
        g.fillStyle = linGrad(g, 0, y, 0, y + h, sky.sky); g.fillRect(x, y, w, h);
        if (o.mood === 'golden') FX.sun(g, x + w * 0.5, y + h * 0.62, 34, '#fff6e0', sky.key, 4);
        FX.tree(g, x + w * 0.6, y + h + 30, 2.2, shade(sky.grass, -0.45));
      });
    }
    // chalkboard
    const bx = CX - V(300, 230), by = WB - V(720, 820), bw = V(900, 680), bh = V(380, 400);
    rr(g, bx - 16, by - 16, bw + 32, bh + 32, 8); g.fillStyle = shade(M.dark, -0.2); g.fill();
    g.fillStyle = linGrad(g, bx, by, bx + bw, by + bh, [shade(M.grass, -0.55), shade(M.grass, -0.68)]); g.fillRect(bx, by, bw, bh);
    g.strokeStyle = alpha('#ffffff', 0.08); g.lineWidth = 6; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(bx + 40 + i * 180, by + bh * 0.7); g.quadraticCurveTo(bx + 120 + i * 180, by + bh * 0.55, bx + 200 + i * 180, by + bh * 0.75); g.stroke(); }
    if (o.board) text(g, o.board, bx + bw / 2, by + bh * 0.42, { size: V(84, 78), color: alpha('#f4f0e6', 0.92), font: FONTS.title, weight: 700, spacing: 4 });
    else { text(g, '7 × 8 = ?', bx + bw * 0.35, by + bh * 0.35, { size: V(60, 56), color: alpha('#f4f0e6', 0.6), font: FONTS.title }); text(g, 'x² + 2x', bx + bw * 0.62, by + bh * 0.66, { size: V(50, 48), color: alpha('#f4f0e6', 0.45), font: FONTS.title }); }
    g.fillStyle = shade(M.dark, -0.1); g.fillRect(bx, by + bh + 16, bw, 12);
    // wall clock
    const ck = CX + V(560, 420), cy = WB - V(880, 1000);
    FX.clock(g, ck, cy, V(70, 64), o.clockT ?? t, { face: mix('#f2efe8', M.key, 0.2), ink: '#1a1622', red: S().ui.accent, speed: o.clockSpeed ?? 1 });
    g.fillStyle = alpha('#000', 0.3); g.fillRect(-E.W, WB - 10, E.W * 4, 10);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, WB, 0, E.H * 1.4, [shade(M.floor, -0.45), shade(M.floor, -0.25)]); g.fillRect(-E.W * 1.5, WB, E.W * 4, E.H * 2);
    FX.floorLines(g, WB, E.H * 1.6, alpha('#000', 0.2), 0.08);
    FX.pool(g, CX - V(260, 200), GY + 20, V(700, 600), V(130, 160), sky.key, o.mood === 'golden' ? 0.35 : 0.18);
    if (o.mood === 'golden') FX.godRays(g, CX - V(900, 720), WB - V(700, 820), { count: 8, angle: 0.55, spread: 0.5, len: V(2000, 2200), color: sky.key, a: 0.09, t });
  });
  // back row of desks (+ optional students)
  layer(g, cam, 0.8, (g) => {
    const yb = WB + V(70, 90);
    for (let i = -2; i <= 3; i++) {
      const x = CX + i * V(320, 270);
      if (o.students && i !== 0 && i !== 3) drawFigure(g, { x, y: yb, s: 0.95, facing: 1, outfit: { kid: true }, pose: breathe(POSES.sit, t, 1, i + 4), expr: 'neutral', dim: true, rim: { color: M.rim, dir: [-1, -0.4], w: 3 }, blink: (t % (2.7 + i * 0.3)) > (2.6 + i * 0.3) });
      schoolDesk(g, x + 40, yb, 0.85, M, { paper: o.papers });
    }
  });
  return { GY, CX, M, WB, sky };
}
