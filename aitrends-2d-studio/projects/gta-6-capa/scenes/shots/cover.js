// shots/cover.js — thumbnail: the shocked kid, mom smirking behind with the game case, big title.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { dining, DIN } from '../sets/home.js';
import { gameCase, sweat } from '../sets/kit.js';
import { KID, MOM } from '../cast.js';

// one title line, auto-fit to width, thick dark outline + glow
function line(g, str, y, size, color, o = {}) {
  const maxW = E.W * (o.maxW ?? 0.92), sz = Math.min(size, size * maxW / Math.max(1, measure(g, str, size, FONTS.title, 700)));
  g.save(); g.translate(E.W / 2, y); g.rotate(o.rot ?? 0);
  text(g, str, 6, 10, { size: sz, color: alpha('#000', 0.6), font: FONTS.title, weight: 700, spacing: o.spacing ?? 2 });
  text(g, str, 0, 0, { size: sz, color, font: FONTS.title, weight: 700, spacing: o.spacing ?? 2, stroke: sz * 0.2, strokeColor: '#0a0410', glow: o.glow ?? 30, glowColor: alpha(o.glowColor || color, 0.8) });
  g.restore();
  return sz;
}

registerShot('cover', { draw(g, t, info) {
  const ui = S().ui, RED = ui.accent, M = mood('interiorWarm'), D = DIN();
  // background: the dinner, mom smirking with the game case, blurred and tinted red
  const cam = { z: 1.35, x: V(160, 180), y: V(60, 120) };
  blurLayer(g, 5, (g) => {
    const { table } = dining(g, 0.3, cam, { lamp: 1 });
    layer(g, cam, 1, (g) => {
      FX.chair(g, D.momX + 30, D.GY, 1.5, shade(M.dark, -0.5));
      drawFigure(g, { x: D.momX, y: D.GY, s: 1.6, facing: -1, outfit: MOM, pose: { ...POSES.sit, eF: [26, -124], hF: [48, -146] }, expr: 'smirk', look: [-1, 0], rim: { color: M.rim, dir: [-0.7, -0.7], w: 6 } });
      table(g);
    });
  });
  veil(g, '#08030c', 0.35);
  glow(g, E.W / 2, E.H * 0.62, E.W * 0.9, RED, 0.35);
  // shock burst behind the face
  const cx = E.W * 0.38, cy = E.H * 0.73, r = V(280, 300);
  g.save(); g.globalCompositeOperation = 'lighter';
  const rr0 = rng(9); for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2 + rr0() * 0.1, w = 0.05 + rr0() * 0.04;
    g.fillStyle = alpha(i % 2 ? RED : ui.gold, 0.22); g.beginPath(); g.moveTo(cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 1.05);
    g.lineTo(cx + Math.cos(a - w) * E.H, cy + Math.sin(a - w) * E.H); g.lineTo(cx + Math.cos(a + w) * E.H, cy + Math.sin(a + w) * E.H); g.closePath(); g.fill(); }
  g.restore();
  // the shocked kid
  for (const k of [1.2, 1.1]) ring(g, cx, cy, r * k, 6, alpha(RED, 0.35 / k));
  bigFace(g, cx, cy, r, { outfit: KID, expr: 'shocked', look: [0.35, -0.15], rimColor: ui.gold, rimSide: 1, tilt: -0.06, blink: false });
  sweat(g, cx, cy, r, 0.2); sweat(g, cx - r * 1.45, cy + r * 0.1, r * 0.9, 0.6);
  for (const [a, l] of [[-2.3, 1], [-2.0, 0.8], [-1.0, 0.9]]) seg(g, [[cx + Math.cos(a) * r * 1.12, cy + Math.sin(a) * r * 1.12], [cx + Math.cos(a) * r * (1.32 + 0.2 * l), cy + Math.sin(a) * r * (1.32 + 0.2 * l)]], 14, ui.cream);
  // the game case, tilted, with the deal sticker
  g.save(); g.translate(E.W * 0.76, E.H * 0.52); gameCase(g, 0, 0, V(400, 440), { rot: 0.14, glowA: 1.2 }); g.restore();
  g.save(); g.translate(E.W * 0.78, E.H * 0.665); g.rotate(-0.16);
  circle(g, 0, 0, 108, '#0a0410'); circle(g, 0, 0, 98, ui.gold);
  text(g, 'SÓ COM', 0, -34, { size: 30, color: '#2a1020', font: FONTS.ui, weight: 900, spacing: 2 });
  text(g, 'MÉDIA 7', 0, 16, { size: 44, color: '#2a1020', font: FONTS.ui, weight: 900 });
  g.restore();
  // red arrow from the face to the case
  g.save(); g.strokeStyle = '#0a0410'; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.moveTo(E.W * 0.33, E.H * 0.54); g.quadraticCurveTo(E.W * 0.38, E.H * 0.44, E.W * 0.52, E.H * 0.45); g.stroke();
  g.strokeStyle = RED; g.lineWidth = 20; g.stroke(); g.restore();
  poly(g, [[E.W * 0.58, E.H * 0.452], [E.W * 0.51, E.H * 0.425], [E.W * 0.515, E.H * 0.48]], RED);
  // title
  const T0 = V(150, 210);
  line(g, 'SUA MÃE FEZ A', T0, V(96, 104), ui.cream, { glowColor: RED, glow: 18 });
  line(g, 'PROPOSTA MAIS', T0 + V(120, 140), V(110, 120), ui.cream, { glowColor: RED, glow: 18 });
  line(g, 'PERIGOSA', T0 + V(280, 320), V(200, 230), RED, { rot: -0.04, spacing: 4, glow: 40 });
  line(g, 'DE SUA VIDA', T0 + V(430, 490), V(110, 120), ui.gold, { glow: 24 });
  FX.dust(g, 0.5, { count: 50, color: '#ffd0e0', a: 0.4 });
} });
