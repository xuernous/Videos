// shots/cover.js — thumbnail: the shocked baker, Vesuvius erupting behind, big title (same layout as the GTA 6 cover).
import { E, V, S, registerShot, mood, blurLayer, veil, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, rng } from '/engine/core.js';
import { bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { street, vesuvius, plume, pumice } from '../sets/pompeii.js';
import { BAKER } from '../cast.js';

function line(g, str, y, size, color, o = {}) {
  const maxW = E.W * (o.maxW ?? 0.92), sz = Math.min(size, size * maxW / Math.max(1, measure(g, str, size, FONTS.title, 700)));
  g.save(); g.translate(E.W / 2, y); g.rotate(o.rot ?? 0);
  text(g, str, 6, 10, { size: sz, color: alpha('#000', 0.6), font: FONTS.title, weight: 700, spacing: o.spacing ?? 2 });
  text(g, str, 0, 0, { size: sz, color, font: FONTS.title, weight: 700, spacing: o.spacing ?? 2, stroke: sz * 0.2, strokeColor: '#1a0804', glow: o.glow ?? 30, glowColor: alpha(o.glowColor || color, 0.8) });
  g.restore();
}
const sweat = (g, cx, cy, r, ph) => { const y = cy - r * 0.5 + ph * r * 0.3; g.fillStyle = alpha('#cfe6ff', 0.85); g.beginPath(); g.moveTo(cx + r * 0.72, y - r * 0.12); g.quadraticCurveTo(cx + r * 0.8, y, cx + r * 0.72, y + r * 0.05); g.quadraticCurveTo(cx + r * 0.64, y, cx + r * 0.72, y - r * 0.12); g.fill(); };

registerShot('cover', { draw(g, t, info) {
  const ui = S().ui, HOT = ui.accent, M = mood('dusk');
  // background: the street under the ash, blurred and darkened
  blurLayer(g, 6, (g) => street(g, 0.4, { z: 1.2, y: V(0, 40) }, { phase: 'ash', ash: 0.3, plume: 0 }));
  veil(g, '#0a0204', 0.55);
  glow(g, E.W * 0.7, E.H * 0.5, E.W * 0.9, HOT, 0.4);
  // shock burst behind the face
  const cx = E.W * 0.36, cy = E.H * 0.74, r = V(280, 300);
  g.save(); g.globalCompositeOperation = 'lighter';
  const rr0 = rng(9); for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2 + rr0() * 0.1, w = 0.05 + rr0() * 0.04;
    g.fillStyle = alpha(i % 2 ? HOT : ui.gold, 0.13); g.beginPath(); g.moveTo(cx + Math.cos(a) * r * 1.05, cy + Math.sin(a) * r * 1.05);
    g.lineTo(cx + Math.cos(a - w) * E.H, cy + Math.sin(a - w) * E.H); g.lineTo(cx + Math.cos(a + w) * E.H, cy + Math.sin(a + w) * E.H); g.closePath(); g.fill(); }
  g.restore();
  // the volcano erupting (sharp)
  const vx = E.W * 0.68, vb = E.H * 0.68, VM = { ...M, dark: '#3a2a30', fog: '#8a7a7e' };
  plume(g, E.W * 0.68 + V(900, 980) * 0.06, vb - V(380, 400), V(300, 280), 1, VM, 1.3, { vent: 1.4 });
  const { craterX, craterY } = vesuvius(g, vx, vb, V(900, 980), V(380, 400), { ...M, dark: '#3a2026' }, { glow: 1.4, lit: true });
  g.save(); g.globalCompositeOperation = 'lighter';
  for (const [dx, len, w] of [[-0.02, 0.55, 14], [0.05, 0.75, 18], [0.11, 0.5, 12]]) { const x0 = craterX + dx * 900, y0 = craterY + 8; g.strokeStyle = alpha(HOT, 0.85); g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(x0 + dx * 1400, y0 + len * 200, x0 + dx * 2600 + (dx > 0 ? 60 : -60), y0 + len * 380); g.stroke(); }
  g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.35; seg(g, [[craterX, craterY], [craterX + Math.cos(a) * 160, craterY + Math.sin(a) * 120]], 10, alpha(HOT, 0.7)); } glow(g, craterX, craterY, 220, HOT, 0.8); g.restore();
  // the shocked baker
  for (const k of [1.2, 1.1]) ring(g, cx, cy, r * k, 6, alpha(HOT, 0.35 / k));
  bigFace(g, cx, cy, r, { outfit: BAKER, expr: 'shocked', look: [0.45, -0.35], rimColor: ui.gold, rimSide: 1, tilt: -0.06, blink: false });
  sweat(g, cx, cy, r, 0.1); sweat(g, cx - r * 1.45, cy + r * 0.1, r * 0.9, 0.5);
  for (const [a, l] of [[-2.3, 1], [-2.0, 0.8], [-1.0, 0.9]]) seg(g, [[cx + Math.cos(a) * r * 1.12, cy + Math.sin(a) * r * 1.12], [cx + Math.cos(a) * r * (1.32 + 0.2 * l), cy + Math.sin(a) * r * (1.32 + 0.2 * l)]], 14, ui.cream);
  // "ANO 79" sticker by the volcano
  g.save(); g.translate(E.W * 0.82, E.H * 0.67); g.rotate(-0.16);
  circle(g, 0, 0, 108, '#1a0804'); circle(g, 0, 0, 98, ui.gold);
  text(g, 'ANO', 0, -34, { size: 34, color: '#3a1408', font: FONTS.ui, weight: 900, spacing: 3 });
  text(g, '79', 0, 20, { size: 70, color: '#3a1408', font: FONTS.ui, weight: 900 });
  g.restore();
  // arrow from the face to the volcano
  g.save(); g.strokeStyle = '#1a0804'; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.moveTo(E.W * 0.33, E.H * 0.555); g.quadraticCurveTo(E.W * 0.38, E.H * 0.47, E.W * 0.5, E.H * 0.47); g.stroke();
  g.strokeStyle = HOT; g.lineWidth = 20; g.stroke(); g.restore();
  poly(g, [[E.W * 0.565, E.H * 0.475], [E.W * 0.495, E.H * 0.448], [E.W * 0.5, E.H * 0.502]], HOT);
  pumice(g, 0.7, { count: 70, speed: 900, a: 0.7 });
  // title
  const T0 = V(150, 210);
  line(g, 'E SE VOCÊ ACORDASSE EM', T0, V(80, 88), ui.cream, { glowColor: HOT, glow: 18 });
  line(g, 'POMPEIA', T0 + V(170, 190), V(220, 250), HOT, { rot: -0.04, spacing: 4, glow: 40 });
  line(g, 'NO DIA DA ERUPÇÃO?', T0 + V(340, 380), V(100, 110), ui.gold, { glow: 24 });
  FX.dust(g, 0.5, { count: 50, color: '#ffd0a0', a: 0.4 });
} });
