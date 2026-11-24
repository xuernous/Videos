// shots/cover.js — thumbnail: shocked coach, the 0 x 1 scoreboard at 00:28, "VALIDADE: QUARTA" sticker, big title (same layout as the other covers).
import { E, V, S, registerShot, mood, blurLayer, veil, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, rng } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { stadium, sweat, WHITE } from '../sets/club.js';
import { COACH } from '../cast.js';

function line(g, str, y, size, color, o = {}) {
  const maxW = E.W * (o.maxW ?? 0.92), sz = Math.min(size, size * maxW / Math.max(1, measure(g, str, size, FONTS.title, 700)));
  g.save(); g.translate(E.W / 2, y); g.rotate(o.rot ?? 0);
  text(g, str, 6, 10, { size: sz, color: alpha('#000', 0.6), font: FONTS.title, weight: 700, spacing: o.spacing ?? 2 });
  text(g, str, 0, 0, { size: sz, color, font: FONTS.title, weight: 700, spacing: o.spacing ?? 2, stroke: sz * 0.2, strokeColor: '#08080c', glow: o.glow ?? 30, glowColor: alpha(o.glowColor || color, 0.8) });
  g.restore();
}

registerShot('cover', { draw(g, t, info) {
  const ui = S().ui, RED = '#ff3a3a';
  blurLayer(g, 6, (g) => stadium(g, 0.4, { z: 1.25, y: V(-40, -80) }, { crowd: 1, banners: ['FORA', 'FORA', 'FORA'] }));
  veil(g, '#04050c', 0.45);
  glow(g, E.W / 2, E.H * 0.62, E.W * 0.9, RED, 0.25);
  // shock burst
  const cx = E.W * 0.38, cy = E.H * 0.73, r = V(280, 300);
  g.save(); g.globalCompositeOperation = 'lighter';
  const rr0 = rng(9); for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2 + rr0() * 0.1, w = 0.05 + rr0() * 0.04;
    g.fillStyle = alpha(i % 2 ? RED : '#ffffff', 0.13); g.beginPath(); g.moveTo(cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 1.05);
    g.lineTo(cx + Math.cos(a - w) * E.H, cy + Math.sin(a - w) * E.H); g.lineTo(cx + Math.cos(a + w) * E.H, cy + Math.sin(a + w) * E.H); g.closePath(); g.fill(); }
  g.restore();
  // scoreboard 0 x 1, 00:28
  g.save(); g.translate(E.W * 0.72, E.H * 0.49); g.rotate(0.08);
  const w = V(520, 520), h = V(230, 220); glow(g, 0, 0, w, '#ffcc33', 0.25);
  rr(g, -w / 2 - 10, -h / 2 - 10, w + 20, h + 20, 18); g.fillStyle = '#2a2a33'; g.fill(); rr(g, -w / 2, -h / 2, w, h, 12); g.fillStyle = '#050507'; g.fill();
  text(g, 'COR', -w * 0.38, -h * 0.12, { size: 38, color: WHITE, font: FONTS.ui, weight: 900 }); text(g, 'GAL', w * 0.38, -h * 0.12, { size: 38, color: WHITE, font: FONTS.ui, weight: 900 });
  text(g, '0 x 1', 0, -h * 0.1, { size: 80, color: '#ffcc33', font: FONTS.ui, weight: 900, glow: 18, glowColor: 'rgba(255,200,40,.8)' });
  text(g, '00:28', 0, h * 0.3, { size: 50, color: RED, font: FONTS.ui, weight: 900, glow: 12, glowColor: alpha(RED, 0.8) });
  g.restore();
  // "VALIDADE: QUARTA" label sticker
  g.save(); g.translate(E.W * 0.8, E.H * 0.635); g.rotate(-0.14);
  rr(g, -150, -72, 300, 144, 14); g.fillStyle = '#08080c'; g.fill(); rr(g, -140, -62, 280, 124, 10); g.fillStyle = '#ffffff'; g.fill();
  g.fillStyle = '#1a1a22'; for (let i = 0; i < 26; i++) g.fillRect(-118 + i * 9, -48, i % 3 ? 3 : 6, 44);
  text(g, 'VALIDADE:', 0, 18, { size: 30, color: '#1a1a22', font: FONTS.ui, weight: 900, spacing: 2 }); text(g, 'QUARTA', 0, 46, { size: 32, color: '#d02020', font: FONTS.ui, weight: 900, spacing: 3 });
  g.restore();
  // the shocked coach
  for (const k of [1.2, 1.1]) ring(g, cx, cy, r * k, 6, alpha(RED, 0.35 / k));
  bigFace(g, cx, cy, r, { outfit: COACH, expr: 'shocked', look: [0.45, -0.3], rimColor: '#fffbe8', rimSide: 1, tilt: -0.06, blink: false });
  sweat(g, cx, cy, r, 0.1); sweat(g, cx - r * 1.45, cy + r * 0.1, r * 0.9, 0.5);
  for (const [a, l] of [[-2.3, 1], [-2.0, 0.8], [-1.0, 0.9]]) seg(g, [[cx + Math.cos(a) * r * 1.15, cy + Math.sin(a) * r * 1.15], [cx + Math.cos(a) * r * (1.35 + 0.2 * l), cy + Math.sin(a) * r * (1.35 + 0.2 * l)]], 14, ui.cream);
  // arrow to the scoreboard
  g.save(); g.strokeStyle = '#08080c'; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.moveTo(E.W * 0.3, E.H * 0.545); g.quadraticCurveTo(E.W * 0.33, E.H * 0.44, E.W * 0.46, E.H * 0.43); g.stroke();
  g.strokeStyle = RED; g.lineWidth = 20; g.stroke(); g.restore();
  poly(g, [[E.W * 0.525, E.H * 0.433], [E.W * 0.455, E.H * 0.405], [E.W * 0.46, E.H * 0.46]], RED);
  // title
  const T0 = V(150, 210);
  line(g, 'E SE VOCÊ FOSSE', T0, V(90, 96), ui.cream, { glowColor: RED, glow: 18 });
  line(g, 'TÉCNICO', T0 + V(170, 190), V(220, 240), WHITE, { rot: -0.04, spacing: 4, glow: 40, glowColor: RED });
  line(g, 'DO CORINTHIANS POR UM DIA?', T0 + V(340, 370), V(80, 86), '#ffcc33', { glow: 24 });
  FX.dust(g, 0.5, { count: 50, color: '#d8e4ff', a: 0.4 });
} });
