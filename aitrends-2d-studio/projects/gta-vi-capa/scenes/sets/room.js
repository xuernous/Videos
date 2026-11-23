// sets/room.js — the gamer's room: huge monitor (key light), LED strip, high-back chair, cans piling up, blinds window that follows the hour.
import { E, V, S, mood, layer, blurLayer, veil, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, lerp, clamp, ease, prog, text, FONTS, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const groundY = () => E.H * V(0.8, 0.68);
export const wallBase = () => groundY() - V(150, 230);
export const scr = () => mood('interiorCool').practical;     // monitor light
export const led = () => S().ui.accent;                      // LED strip

export const ROOM = () => { const CX = E.W / 2, GY = groundY(); return { CX, GY, monX: CX + V(330, 250), monW: V(620, 470), monH: V(360, 280), deskTop: GY - V(200, 220), deskX0: CX - V(80, 60), deskX1: CX + V(640, 520), chairX: CX - V(170, 150) }; };

// sky through the window for a given hour of the marathon (start ~20h)
function skyFor(hour) { const h = (20 + hour) % 24; if (h >= 7 && h < 17) return 'day'; if (h >= 5 && h < 7) return 'golden'; if (h >= 17 && h < 20) return 'dusk'; return 'night'; }

// monitor screen painter (default: a sunny neon city racing by — a generic open-world game, no logos)
export function monitor(g, x, y, w, h, t, on, content) {
  rr(g, x - 14, y - 14, w + 28, h + 28, 12); g.fillStyle = '#06060a'; g.fill();
  g.fillStyle = '#05070c'; g.fillRect(x, y, w, h);
  if (on > 0) {
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.globalAlpha *= on;
    if (content) content(g, x, y, w, h);
    else { const ui = S().ui, c = scr();
      g.fillStyle = linGrad(g, 0, y, 0, y + h, [shade(ui.accent, -0.3), mix(ui.gold, ui.accent, 0.5), shade(c, -0.4)]); g.fillRect(x, y, w, h);
      FX.sun(g, x + w * 0.5, y + h * 0.48, h * 0.14, mix(ui.gold, '#ffffff', 0.4), ui.gold, 2);
      const r = rng(4); for (let i = 0; i < 10; i++) { const bx = x + ((r() * w + t * 140 * (1 + i % 3)) % (w + 80)) - 40, bh = h * (0.15 + r() * 0.3); g.fillStyle = '#120a18'; g.fillRect(bx, y + h * 0.7 - bh, 30 + r() * 30, bh); }
      for (const px of [0.15, 0.85]) { seg(g, [[x + w * px, y + h * 0.72], [x + w * px + 6, y + h * 0.42]], 6, '#120a18'); for (let k = 0; k < 6; k++) { const a = -Math.PI / 2 + (k - 2.5) * 0.55; seg(g, [[x + w * px + 6, y + h * 0.42], [x + w * px + 6 + Math.cos(a) * 34, y + h * 0.42 + Math.sin(a) * 22 + 12]], 5, '#120a18'); } }
      g.fillStyle = '#16101e'; g.fillRect(x, y + h * 0.7, w, h * 0.3);
      for (let i = 0; i < 5; i++) { const u = ((i + t * 2) % 5) / 5; g.fillStyle = alpha(ui.gold, 0.6); g.fillRect(x + w / 2 - 4 - u * w * 0.2, y + h * 0.7 + u * u * h * 0.3, 8 + u * 20, 3 + u * 6); } }
    g.globalAlpha = 0.1 * on; g.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 5) g.fillRect(x, yy, w, 2);
    g.restore();
  }
  g.fillStyle = linGrad(g, x, y, x + w, y + h, [alpha('#ffffff', 0.06), alpha('#ffffff', 0), alpha('#ffffff', 0.03)]); g.fillRect(x, y, w, h);
}
export function can(g, x, y, s, k) { const cols = [S().ui.good, S().ui.accent, S().ui.gold]; rr(g, x - 11 * s, y - 40 * s, 22 * s, 40 * s, 4 * s); g.fillStyle = shade(cols[k % 3], -0.25); g.fill(); g.fillStyle = alpha('#ffffff', 0.25); g.fillRect(x - 8 * s, y - 36 * s, 4 * s, 30 * s); g.fillStyle = '#9aa0b0'; g.fillRect(x - 10 * s, y - 42 * s, 20 * s, 4 * s); }
export function gamingChair(g, x, y, s, M, f = 1) {
  const c = shade(M.dark, -0.4), acc = shade(led(), -0.35);
  g.save(); g.translate(x, y); g.scale(f * s, s);
  rr(g, -70, -300, 70, 230, 26); g.fillStyle = c; g.fill(); g.fillStyle = acc; g.fillRect(-58, -290, 10, 200);
  rr(g, -80, -96, 130, 26, 10); g.fillStyle = c; g.fill();
  seg(g, [[-20, -70], [-20, -20]], 12, c); seg(g, [[-70, 0], [30, 0]], 8, c); circle(g, -70, 2, 8, '#000'); circle(g, 30, 2, 8, '#000');
  g.restore();
}

// o: { hour (marathon hour), mon (0..1), monContent, cans (count), pizza, shadows (0..1 hallucination), frames:fn }
export function room(g, t, cam, o = {}) {
  const hour = o.hour ?? 0, M = mood('night'), R = ROOM(), { CX, GY } = R, WB = wallBase(), on = o.mon ?? 1, SC = scr(), L = led();
  const skyM = mood(skyFor(hour));
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, WB, [shade(M.dark, -0.5), shade(M.wall, -0.55), shade(M.wall, -0.4)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, WB + E.H + 4);
    // LED strip under the ceiling
    const ly = WB - V(760, 930); g.fillStyle = L; g.fillRect(-E.W * 1.5, ly, E.W * 4, 6); g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, 0, ly, 0, ly + V(300, 360), [alpha(L, 0.22), alpha(L, 0)]); g.fillRect(-E.W * 1.5, ly, E.W * 4, V(300, 360)); g.restore();
    // window with blinds (left)
    const wx = CX - V(780, 560), wy = WB - V(640, 760), ww = V(420, 320), wh = V(440, 480);
    glow(g, wx + ww / 2, wy + wh / 2, ww, skyM.key, skyFor(hour) === 'day' ? 0.25 : 0.08);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 1, frame: shade(M.dark, -0.5), bar: 10, blinds: 0 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, skyM.sky); g.fillRect(x, y, w, h);
      if (skyFor(hour) === 'night') { FX.stars(g, t, { area: [x, y, w, h * 0.5], count: 26, seed: 8 }); FX.moon(g, x + w * 0.7, y + h * 0.25, 22); }
      else FX.sun(g, x + w * 0.4, y + h * 0.35, 28, '#fff6e0', skyM.key, 3);
      FX.skyline(g, { x: x - 10, y: y + h + 2, w: w + 20, minH: 50, maxH: h * 0.5, color: shade(skyM.dark, -0.1), windowColor: skyM.practical, lit: skyFor(hour) === 'night' ? 0.35 : 0.05, seed: 4 });
      for (let i = 0; i < 22; i++) { g.fillStyle = alpha(shade(M.dark, -0.4), 0.7); g.fillRect(x, y + i * (h / 22), w, h / 22 * 0.45); }
    });
    // poster + shelf
    rr(g, CX + V(80, 40), WB - V(700, 840), V(200, 170), V(270, 230), 6); g.fillStyle = shade(M.dark, -0.2); g.fill();
    g.save(); g.beginPath(); g.rect(CX + V(92, 52), WB - V(688, 828), V(176, 146), V(246, 206)); g.clip(); g.fillStyle = linGrad(g, 0, WB - V(700, 840), 0, WB - V(430, 610), [shade(L, -0.5), shade(SC, -0.6)]); g.fillRect(CX, WB - 900, 400, 400); g.restore();
    if (o.frames) o.frames(g, WB, M);
    g.fillStyle = alpha('#000', 0.3); g.fillRect(-E.W, WB - 10, E.W * 4, 10);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, WB, 0, E.H * 1.4, [shade(M.floor, -0.55), shade(M.floor, -0.3)]); g.fillRect(-E.W * 1.5, WB, E.W * 4, E.H * 2);
    FX.floorLines(g, WB, E.H * 1.6, alpha('#000', 0.28), 0.09);
    if (on > 0) FX.pool(g, R.monX - V(200, 160), GY + V(30, 50), V(800, 680), V(150, 180), SC, 0.3 * on);
    FX.pool(g, CX, GY + V(60, 80), V(900, 760), V(120, 150), L, 0.12);
    if (o.pizza) { g.fillStyle = shade('#c8a070', -0.35); g.beginPath(); g.ellipse(CX - V(420, 330), GY + V(60, 90), 120, 26, 0, 0, Math.PI * 2); g.fill(); }
  });
  layer(g, cam, 0.92, (g) => {
    const dk = shade(M.dark, -0.5);
    g.fillStyle = dk; g.fillRect(R.deskX0, R.deskTop, R.deskX1 - R.deskX0, 18); g.fillStyle = alpha(SC, 0.25 * on); g.fillRect(R.deskX0, R.deskTop - 2, R.deskX1 - R.deskX0, 3);
    g.fillRect(R.deskX0 + 20, R.deskTop, 14, GY - R.deskTop); g.fillStyle = dk; g.fillRect(R.deskX1 - 34, R.deskTop, 14, GY - R.deskTop);
    // PC tower with RGB fan
    const tx = R.deskX1 - V(120, 110); rr(g, tx - 50, GY - 200, 100, 200, 8); g.fillStyle = '#08080d'; g.fill(); ring(g, tx, GY - 130, 30, 5, alpha(L, 0.8)); glow(g, tx, GY - 130, 90, L, 0.4);
    // monitor + stand
    const mx = R.monX - R.monW / 2, my = R.deskTop - V(60, 50) - R.monH;
    if (on > 0) glow(g, R.monX, my + R.monH / 2, R.monW * 1.3, SC, 0.4 * on);
    monitor(g, mx, my, R.monW, R.monH, t, on, o.monContent);
    seg(g, [[R.monX, my + R.monH + 14], [R.monX, R.deskTop]], 18, '#06060a'); rr(g, R.monX - 70, R.deskTop - 10, 140, 12, 4); g.fillStyle = '#06060a'; g.fill();
    // cans on the desk
    const n = o.cans ?? 0; for (let i = 0; i < n; i++) can(g, R.deskX0 + V(70, 50) + (i % 6) * V(34, 30), R.deskTop - Math.floor(i / 6) * 42, 1, i);
    gamingChair(g, R.chairX - V(30, 30), GY, 1.4, M);
  });
  // hallucination: moving shadows, eyes in the dark
  const hs = o.shadows ?? 0;
  if (hs > 0) layer(g, cam, 0.6, (g) => {
    g.save(); g.globalAlpha *= hs;
    for (let i = 0; i < 4; i++) { const x = CX - V(600, 420) + i * V(420, 300) + Math.sin(t * 0.8 + i * 2) * 60, y = WB - V(420, 520) + Math.cos(t * 0.6 + i) * 40;
      g.fillStyle = alpha('#000', 0.55); g.beginPath(); g.ellipse(x, y, 90 + 30 * Math.sin(t + i), 160, Math.sin(t * 0.5 + i) * 0.3, 0, Math.PI * 2); g.fill();
      const bl = (t * 0.7 + i * 0.37) % 1 > 0.92; if (!bl) for (const dx of [-18, 18]) { circle(g, x + dx, y - 50, 7, alpha(mix(L, '#ffffff', 0.4), 0.9)); glow(g, x + dx, y - 50, 24, L, 0.5); } }
    g.restore();
  });
  return { GY, CX, M, WB, R, SC, L };
}
