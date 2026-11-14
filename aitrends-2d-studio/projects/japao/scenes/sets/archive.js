// sets/archive.js — modern archive (cool, one warm desk lamp; optional UV violet) + the chronicle pages.
import { E, V, S, mood, layer, backdrop, rr, seg, circle, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, text, FONTS, clamp, ease, prog, lerp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { wolfEmblem, KZ_RED } from './lib.js';

export const UV = '#9a5cff';
export function archive(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = E.H * V(0.8, 0.68), CX = E.W / 2, uv = o.uv || 0;
  const wall = shade(M.wall, -0.45), lamp = o.lampX ?? CX + 40;
  layer(g, cam, 0.3, (g) => {
    backdrop(g, [shade(M.dark, -0.4), shade(M.wall, -0.55)]);
    // high window with moonlight
    FX.windowFrame(g, { x: CX - 760, y: GY - 820, w: 300, h: 220, cols: 3, rows: 2, frame: shade(M.dark, -0.5), bar: 10 }, (g, x, y, w, h) => { g.fillStyle = linGrad(g, 0, y, 0, y + h, [M.sky[0], M.sky[1]]); g.fillRect(x, y, w, h); FX.moon(g, x + w * 0.7, y + h * 0.35, 22); });
    FX.godRays(g, CX - 610, GY - 700, { angle: Math.PI * 0.36, spread: 0.3, len: 1100, color: M.key, a: 0.05, t });
  });
  layer(g, cam, 0.6, (g) => {
    const r = rng(5);
    for (let k = -3; k <= 3; k++) {                       // tall shelves full of boxes and spines
      const sx = CX + k * 420 - 170, top = GY - 760; g.fillStyle = shade(wall, -0.25); g.fillRect(sx, top, 340, 760);
      for (let j = 0; j < 6; j++) { const yy = top + 30 + j * 122; g.fillStyle = shade(wall, -0.6); g.fillRect(sx, yy + 96, 340, 10);
        let xx = sx + 10; while (xx < sx + 320) { const w = 14 + r() * 40, h = 50 + r() * 44; g.fillStyle = mix(shade(M.wall, -0.2 - r() * 0.3), '#5a4030', r() * 0.4); g.fillRect(xx, yy + 96 - h, w, h); xx += w + 2 + r() * 6; } }
    }
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.3), shade(M.dark, -0.5)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.3)', 0.08);
    // desk + lamp
    const dy = GY - 150; g.fillStyle = '#1a1210'; g.fillRect(CX - 520, dy, 1040, 22); g.fillRect(CX - 490, dy + 22, 30, 150); g.fillRect(CX + 460, dy + 22, 30, 150);
    seg(g, [[lamp + 330, dy], [lamp + 300, dy - 200], [lamp + 200, dy - 260]], 8, '#141016'); poly(g, [[lamp + 160, dy - 250], [lamp + 240, dy - 290], [lamp + 260, dy - 230], [lamp + 200, dy - 220]], '#141016');
    if (o.lamp !== false) { FX.lightCone(g, lamp + 205, dy - 235, { angle: Math.PI * 0.62, spread: 0.7, len: 420, color: M.practical === '#9fe0ff' ? '#ffd59a' : '#ffd59a', a: 0.3 }); FX.pool(g, lamp - 20, dy + 4, 360, 40, '#ffd59a', 0.35); }
    if (o.book !== false) bookOpen(g, CX - 40, dy + 2, 1, t, { uv, scraped: o.scraped ?? true, name: o.name });
  });
  if (uv > 0) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, CX - 40, GY - 200, 700, UV, 0.35 * uv); g.restore(); }
  return { GY, CX, M, deskY: GY - 150 };
}
// open book on a surface (x,y = spine bottom)
export function bookOpen(g, x, y, s, t, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  poly(g, [[-300, 0], [300, 0], [290, -16], [-290, -16]], '#2a1410');
  for (const sd of [-1, 1]) { g.fillStyle = linGrad(g, 0, -40, sd * 280, -20, ['#d8c8a0', '#efe2c0']); g.beginPath(); g.moveTo(0, -14); g.quadraticCurveTo(sd * 140, -40, sd * 280, -26); g.lineTo(sd * 286, -10); g.quadraticCurveTo(sd * 140, -22, 0, -4); g.closePath(); g.fill(); }
  g.restore();
}
// a parchment page (x,y top-left). o: {lines, scraped:[0..1 region], name, uv, reveal, seed, hand}
export function page(g, x, y, w, h, t, o = {}) {
  const { seed = 3, scraped = true, uv = 0, reveal = 0, name = 'KUROZANE NO HAYATO', tear = 0, burn = 0, letters = 1 } = o, r = rng(seed);
  g.save(); g.translate(x, y);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(10, 14, w, h);
  g.fillStyle = linGrad(g, 0, 0, w, h, uv > 0.5 ? ['#2a1a48', '#3a2460'] : ['#e9dbb6', '#d6c193']); g.fillRect(0, 0, w, h);
  g.strokeStyle = alpha(uv > 0.5 ? '#6a4aa0' : '#5a3a24', 0.75); g.lineWidth = Math.max(1.5, w * 0.006); g.lineCap = 'round';
  const nl = 11, lh = (h - w * 0.2) / nl, sy = Math.floor(nl * 0.42);
  for (let i = 0; i < nl; i++) { const yy = w * 0.1 + i * lh + lh / 2; let xx = w * 0.08; while (xx < w * 0.92) { const ww = w * (0.04 + r() * 0.1); if (!(scraped && i === sy && xx > w * 0.28 && xx < w * 0.78)) { g.beginPath(); g.moveTo(xx, yy); for (let k = 1; k <= 4; k++) g.lineTo(xx + ww * k / 4, yy + (r() - 0.5) * lh * 0.35); g.stroke(); } xx += ww + w * 0.02; } }
  if (scraped) { const zx = w * 0.27, zy = w * 0.1 + sy * lh, zw = w * 0.52, zh = lh; g.fillStyle = uv > 0.5 ? alpha('#1a1030', 0.5) : alpha('#f4ead0', 0.9); rr(g, zx, zy, zw, zh, zh * 0.4); g.fill(); g.strokeStyle = alpha(uv > 0.5 ? '#8a6ad0' : '#b09a70', 0.4); g.lineWidth = 1.2; for (let k = 0; k < 14; k++) { const xx = zx + r() * zw; g.beginPath(); g.moveTo(xx, zy + 3); g.lineTo(xx + 8, zy + zh - 3); g.stroke(); }
    if (reveal > 0) { const sz = Math.min(zh * 0.62, zw / (name.length * 0.62)); text(g, name, zx + zw / 2, zy + zh / 2 + 2, { size: sz, font: FONTS.serif, italic: true, weight: 900, color: '#e8d4ff', glow: 24, glowColor: alpha(UV, 0.95), alpha: reveal }); }
    if (letters < 1) { /* letters vanishing handled by caller */ } }
  if (tear > 0) { g.strokeStyle = '#3a2418'; g.lineWidth = 3; g.beginPath(); g.moveTo(w * 0.5, 0); for (let k = 1; k <= 10; k++) g.lineTo(w * 0.5 + (k % 2 ? 10 : -10), h * k / 10 * tear); g.stroke(); }
  g.restore();
}
// the chronicle closed: leather cover + wolf seal
export function chronicleCover(g, cx, cy, s, t, o = {}) {
  g.save(); g.translate(cx, cy); g.scale(s, s); g.rotate(o.rot ?? -0.04);
  rr(g, -330, -430, 660, 860, 18); g.fillStyle = 'rgba(0,0,0,.4)'; g.fill();
  rr(g, -320, -420, 640, 840, 16); g.fillStyle = linGrad(g, -320, -420, 320, 420, ['#4a2018', '#2a100c']); g.fill();
  g.strokeStyle = alpha('#c9a24a', 0.55); g.lineWidth = 6; rr(g, -280, -380, 560, 760, 10); g.stroke();
  g.fillStyle = KZ_RED; g.beginPath(); g.arc(0, -40, 150, 0, Math.PI * 2); g.fill(); g.strokeStyle = alpha('#c9a24a', 0.7); g.lineWidth = 8; g.stroke();
  wolfEmblem(g, 0, -40, 110, '#0a0708', '#e04a3a');
  text(g, 'KEZHAR', 0, 230, { size: 64, font: FONTS.serif, italic: true, weight: 900, color: '#d8b870', spacing: 10, alpha: 0.85 });
  g.restore();
}
