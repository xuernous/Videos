// shots/cover.js — thumbnail: shocked gamer, the monitor with the body battery dying, big title (same layout as the other covers).
import { E, V, S, registerShot, mood, blurLayer, veil, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, rng } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { room, monitor, scr } from '../sets/room.js';
import { GAMER } from '../cast.js';

function line(g, str, y, size, color, o = {}) {
  const maxW = E.W * (o.maxW ?? 0.92), sz = Math.min(size, size * maxW / Math.max(1, measure(g, str, size, FONTS.title, 700)));
  g.save(); g.translate(E.W / 2, y); g.rotate(o.rot ?? 0);
  text(g, str, 6, 10, { size: sz, color: alpha('#000', 0.6), font: FONTS.title, weight: 700, spacing: o.spacing ?? 2 });
  text(g, str, 0, 0, { size: sz, color, font: FONTS.title, weight: 700, spacing: o.spacing ?? 2, stroke: sz * 0.2, strokeColor: '#0a0410', glow: o.glow ?? 30, glowColor: alpha(o.glowColor || color, 0.8) });
  g.restore();
}
const sweat = (g, cx, cy, r, ph) => { const y = cy - r * 0.5 + ph * r * 0.3; g.fillStyle = alpha('#cfe6ff', 0.85); g.beginPath(); g.moveTo(cx + r * 0.72, y - r * 0.12); g.quadraticCurveTo(cx + r * 0.8, y, cx + r * 0.72, y + r * 0.05); g.quadraticCurveTo(cx + r * 0.64, y, cx + r * 0.72, y - r * 0.12); g.fill(); };

registerShot('cover', { draw(g, t, info) {
  const ui = S().ui, RED = ui.accent, SC = scr();
  // background: the gamer room at night, blurred
  blurLayer(g, 6, (g) => room(g, 0.3, { z: 1.3, x: V(120, 140), y: V(40, 80) }, { hour: 72, cans: 16, pizza: true, shadows: 0.6 }));
  veil(g, '#06030c', 0.45);
  glow(g, E.W / 2, E.H * 0.62, E.W * 0.9, RED, 0.3);
  // shock burst behind the face
  const cx = E.W * 0.38, cy = E.H * 0.73, r = V(280, 300);
  g.save(); g.globalCompositeOperation = 'lighter';
  const rr0 = rng(9); for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2 + rr0() * 0.1, w = 0.05 + rr0() * 0.04;
    g.fillStyle = alpha(i % 2 ? RED : SC, 0.18); g.beginPath(); g.moveTo(cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 1.05);
    g.lineTo(cx + Math.cos(a - w) * E.H, cy + Math.sin(a - w) * E.H); g.lineTo(cx + Math.cos(a + w) * E.H, cy + Math.sin(a + w) * E.H); g.closePath(); g.fill(); }
  g.restore();
  // the monitor, tilted, with the game and HORA 72
  g.save(); g.translate(E.W * 0.74, E.H * 0.48); g.rotate(0.1);
  const mw = V(460, 440), mh = mw * 0.6; glow(g, 0, 0, mw * 1.1, SC, 0.45);
  monitor(g, -mw / 2, -mh / 2, mw, mh, 1.3, 1);
  rr(g, -mw / 2 + 18, -mh / 2 + 16, 190, 56, 28); g.fillStyle = alpha('#05050a', 0.8); g.fill(); g.strokeStyle = ui.gold; g.lineWidth = 3; g.stroke();
  text(g, 'HORA', -mw / 2 + 64, -mh / 2 + 45, { size: 24, color: ui.cream, font: FONTS.ui, weight: 900 }); text(g, '72', -mw / 2 + 165, -mh / 2 + 46, { size: 40, color: ui.gold, font: FONTS.ui, weight: 900 });
  seg(g, [[0, mh / 2 + 14], [0, mh / 2 + 60]], 18, '#06060a'); rr(g, -70, mh / 2 + 56, 140, 12, 4); g.fillStyle = '#06060a'; g.fill();
  g.restore();
  // body battery sticker (almost empty)
  g.save(); g.translate(E.W * 0.8, E.H * 0.65); g.rotate(-0.14);
  rr(g, -118, -66, 236, 132, 22); g.fillStyle = '#0a0410'; g.fill(); rr(g, -108, -56, 216, 112, 18); g.fillStyle = ui.gold; g.fill();
  rr(g, -86, -30, 140, 60, 10); g.strokeStyle = '#2a1020'; g.lineWidth = 7; g.stroke(); rr(g, 54, -12, 12, 24, 4); g.fillStyle = '#2a1020'; g.fill();
  rr(g, -78, -22, 20, 44, 6); g.fillStyle = RED; g.fill();
  text(g, '7%', 34, 2, { size: 40, color: '#2a1020', font: FONTS.ui, weight: 900 }); text(g, 'CORPO', 0, 44, { size: 22, color: '#2a1020', font: FONTS.ui, weight: 900, spacing: 3 });
  g.restore();
  // the shocked gamer: wide eyes with red veins, sweat
  for (const k of [1.2, 1.1]) ring(g, cx, cy, r * k, 6, alpha(RED, 0.35 / k));
  bigFace(g, cx, cy, r, { outfit: GAMER, expr: 'shocked', look: [0.45, -0.3], rimColor: SC, rimSide: 1, tilt: -0.06, blink: false });
  g.save(); g.translate(cx, cy); g.rotate(-0.06); g.globalAlpha = 0.8;
  for (const dx of [-0.32, 0.32]) for (let i = 0; i < 5; i++) { const a = i * 1.25 + 0.3, ex = dx * r, ey = -r * 0.18; seg(g, [[ex + Math.cos(a) * r * 0.21, ey + Math.sin(a) * r * 0.21], [ex + Math.cos(a) * r * 0.13, ey + Math.sin(a) * r * 0.13 + 4]], 4, RED); }
  g.restore();
  sweat(g, cx, cy, r, 0.1); sweat(g, cx - r * 1.45, cy + r * 0.1, r * 0.9, 0.5);
  for (const [a, l] of [[-2.3, 1], [-2.0, 0.8], [-1.0, 0.9]]) seg(g, [[cx + Math.cos(a) * r * 1.22, cy + Math.sin(a) * r * 1.22], [cx + Math.cos(a) * r * (1.42 + 0.2 * l), cy + Math.sin(a) * r * (1.42 + 0.2 * l)]], 14, ui.cream);
  // arrow from the face to the battery / monitor
  g.save(); g.strokeStyle = '#0a0410'; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.moveTo(E.W * 0.3, E.H * 0.545); g.quadraticCurveTo(E.W * 0.33, E.H * 0.43, E.W * 0.47, E.H * 0.42); g.stroke();
  g.strokeStyle = RED; g.lineWidth = 20; g.stroke(); g.restore();
  poly(g, [[E.W * 0.535, E.H * 0.425], [E.W * 0.465, E.H * 0.397], [E.W * 0.47, E.H * 0.452]], RED);
  // title
  const T0 = V(150, 210);
  line(g, 'E SE VOCÊ JOGASSE GTA 6', T0, V(84, 92), ui.cream, { glowColor: RED, glow: 18 });
  line(g, 'SEM PARAR', T0 + V(170, 190), V(200, 220), RED, { rot: -0.04, spacing: 4, glow: 40 });
  line(g, 'ATÉ O CORPO DESLIGAR?', T0 + V(340, 370), V(96, 104), SC, { glow: 24 });
  FX.dust(g, 0.5, { count: 50, color: '#ffd0e0', a: 0.4 });
} });
