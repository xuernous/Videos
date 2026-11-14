// shots/thumb.js — YouTube thumbnail candidates (rendered as stills at t=1, 3, 5).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, seg, circle, poly, glow, alpha, shade, mix, text, FONTS, linGrad } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { coast, seaView } from '../sets/coast.js';
import { drawChar, faceShot, PZ, flame, embers, smoke, banner, sheath, wolfEmblem, ship, KZ_RED, GOLD } from '../sets/lib.js';
import { HAYATO, TARVOS } from '../cast.js';

const T = 1.0; // freeze time inside each shot
const big = (g, s, x, y, size, color, o = {}) => text(g, s, x, y, { size, font: FONTS.title, weight: 700, color, align: o.align || 'left', stroke: o.stroke ?? size * 0.12, strokeColor: o.strokeColor || '#0a0608', glow: o.glow ?? 0, glowColor: o.glowColor, spacing: o.spacing ?? 1 });
const vignette = (g, a = 0.55) => { g.save(); const gr = g.createRadialGradient(E.W / 2, E.H / 2, E.H * 0.35, E.W / 2, E.H / 2, E.W * 0.75); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); g.restore(); };
const scratch = (g, x0, y0, x1, y1, w, col = '#e8392a') => { g.save(); g.lineCap = 'round'; seg(g, [[x0, y0], [x1, y1]], w, alpha('#0a0608', 0.9)); seg(g, [[x0, y0 - w * 0.12], [x1, y1 - w * 0.12]], w * 0.62, col); g.restore(); };

// A — "APAGARAM SEU NOME": giant Hayato face, burning coast + red fleet behind
registerShot('t1', { draw(g, t, info) {
  const bg = (gg, tt) => coast(gg, T, { z: 1.25, x: 160, y: -60 }, { mood: 'dusk', fleet: 1, fleetCount: 90, burn: 1, sunX: -500 });
  blurLayer(g, 6, (gg) => bg(gg, T)); veil(g, '#06050a', 0.25);
  const fx = E.W * 0.74; g.save(); g.translate(fx, 0); g.scale(-1, 1); g.translate(-fx, 0);
  faceShot(g, T, info, { who: HAYATO, expr: 'angry', mood: 'dusk', rimColor: '#ff9a4a', rimSide: 1, look: [0.35, 0.05], x: E.W * 0.24, y: E.H * 0.1, r: E.H * 0.37, push: 0, blink: 0 });
  g.restore();
  embers(g, T + 3, { count: 90, area: [0, 0, E.W, E.H], size: 3 });
  vignette(g, 0.5);
  big(g, 'APAGARAM', 80, E.H * 0.24, 168, '#fff3e0');
  big(g, 'SEU NOME', 80, E.H * 0.43, 168, '#ff4a35', { glow: 24, glowColor: 'rgba(255,60,40,.6)' });
  scratch(g, 70, E.H * 0.455, 800, E.H * 0.405, 18);
  sheath(g, 440, E.H * 0.8, 800, 10, { marks: 8, highlight: 1, hiFrom: 1, hiTo: 8, rot: -0.06 });
} });

// B — "1 SAMURAI CONTRA UM IMPÉRIO": lone Hayato on the beach vs the fleet, Tarvos looming in the sky
registerShot('t2', { draw(g, t, info) {
  const M = mood('dusk');
  const r = coast(g, T, { z: 1.0, x: 0, y: 40 }, { mood: 'dusk', fleet: 1, fleetCount: 140, burn: 0.6, village: true, sunX: -200, sunY: 60 });
  // Tarvos looming in the sky, half transparent
  // closer ships with banners
  for (const [x, s] of [[E.W * 0.5, 0.42], [E.W * 0.66, 0.62], [E.W * 0.9, 0.95]]) ship(g, x, r.HY + 30 + s * 40, s, { t: T, f: -1, sail: KZ_RED, hull: '#0d090b' });
  // lone samurai, back to camera, sword drawn
  embers(g, T + 5, { count: 70, area: [0, 0, E.W, E.H], size: 3 });
  const gy = E.H * 0.97;
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.2, gy - 120, 260, '#ff8a3a', 0.35); g.restore();
  drawChar(g, { x: E.W * 0.19, y: gy, s: 2.6, facing: 1, outfit: HAYATO, pose: PZ.guard, expr: 'determined', weapon: ['sword', 'sheath'], swordAng: -0.5, rim: { color: '#ffb070', dir: [1, -0.4], w: 5 }, gleam: 0.8, t: T });
  vignette(g, 0.55);
  big(g, '1 SAMURAI', E.W - 70, E.H * 0.18, 150, '#fff3e0', { align: 'right' });
  big(g, 'CONTRA UM', E.W - 70, E.H * 0.33, 96, '#fff3e0', { align: 'right' });
  big(g, 'IMPÉRIO', E.W - 70, E.H * 0.48, 160, '#ff4a35', { align: 'right', glow: 24, glowColor: 'rgba(255,60,40,.6)' });
} });

// C — "8 MARCAS": the sheath huge, every notch glowing, Hayato in shadow behind
registerShot('t3', { draw(g, t, info) {
  const bg = (gg) => seaView(gg, T, { z: 1.2, y: 0 }, { mood: 'night', fleet: 1, count: 120 });
  blurLayer(g, 10, (gg) => bg(gg, T)); veil(g, '#06050a', 0.5);
  const fx = E.W * 0.75; g.save(); g.translate(fx, 0); g.scale(-1, 1); g.translate(-fx, 0);
  faceShot(g, T, info, { who: HAYATO, expr: 'determined', mood: 'night', rimColor: '#ffcf8a', rimSide: -1, look: [-0.2, 0.35], x: E.W * 0.25, y: -E.H * 0.2, r: E.H * 0.3, push: 0, blink: 0 });
  g.restore();
  veil(g, '#05040a', 0.25);
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W * 0.45, E.H * 0.8, 700, '#ffb050', 0.25); g.restore();
  sheath(g, E.W * 0.5, E.H * 0.84, 1560, 10, { marks: 8, highlight: 1, hiFrom: 1, hiTo: 8, rot: -0.07 });
  vignette(g, 0.6);
  big(g, '8 MARCAS', 80, E.H * 0.22, 190, '#ffd27a', { glow: 30, glowColor: 'rgba(255,190,90,.6)' });
  big(g, 'UMA PARA CADA GENERAL', 86, E.H * 0.38, 62, '#fff3e0', { spacing: 2 });
} });
