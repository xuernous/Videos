// sets/interiors.js — the family flat in Grâvia: bedroom (moonlit window), living room (CRT TV), kitchen (pendant lamp),
// hallway (moon stripes, parents' door). All anchored to GY = E.H*V(0.8,0.68) and CX = E.W/2, walls extended past the frame.
import { E, V, S, mood, layer, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { smoke, FIRE, sirenWash } from './kit.js';

const GYf = () => E.H * V(0.8, 0.68);

// night view through a window: sky, moon, skyline with smoke and a faint fire glow at the horizon
export function nightView(g, x, y, w, h, t, M, o = {}) {
  g.fillStyle = linGrad(g, 0, y, 0, y + h, [M.sky[0], M.sky[1], shade(M.sky[2], 0.05)]); g.fillRect(x, y, w, h);
  FX.stars(g, t, { area: [x, y, w, h * 0.5], count: 30, seed: 3 });
  if (o.moon !== false) FX.moon(g, x + w * 0.72, y + h * 0.2, Math.min(w, h) * 0.07);
  glow(g, x + w * 0.3, y + h, w * 0.7, FIRE(), 0.35 * (o.fire ?? 1));
  smoke(g, x + w * 0.3, y + h * 0.85, t, { h: h * 0.9, w: w * 0.18, color: shade(M.wall, -0.2), a: 0.6, seed: 4, count: 10 });
  FX.skyline(g, { x: x - 10, y: y + h, w: w + 20, minH: h * 0.12, maxH: h * 0.5, color: shade(M.wall, -0.55), windowColor: alpha(M.practical, 0.8), lit: 0.12, seed: 21, minW: 30, maxW: 80 });
  if (o.siren) sirenWash(g, t, x + w * 0.6, y + h * 0.9, w * 0.5, o.siren);
}

// ---------- bedroom ----------
// o: {lamp: 0..1, door: true, bed: true}
export function bedroom(g, t, cam, o = {}) {
  const M = mood('night'), GY = GYf(), CX = E.W / 2;
  const wall = shade(M.wall, -0.2), wallDark = shade(M.wall, -0.6);
  const win = { x: CX - V(700, 470), y: GY - V(700, 980), w: V(420, 380), h: V(460, 560) };
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [wallDark, wall]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H);
    // wallpaper stripes (faint)
    for (let x = -E.W; x < E.W * 2.5; x += 90) { g.fillStyle = alpha('#000', 0.08); g.fillRect(x, -E.H, 30, GY + E.H); }
    FX.windowFrame(g, { ...win, cols: 2, rows: 2, frame: shade(M.wall, -0.75), bar: 12 }, (g, x, y, w, h) => nightView(g, x, y, w, h, t, M, o));
    // curtains
    g.fillStyle = shade('#5a4a60', -0.45); g.fillRect(win.x - 70, win.y - 40, 70, win.h + 120); g.fillRect(win.x + win.w, win.y - 40, 60, win.h + 120);
    g.fillStyle = shade(M.wall, -0.7); g.fillRect(win.x - 90, win.y - 50, win.w + 180, 16);
    // poster (faded) and door frame with pencil height marks (right)
    const dx = CX + V(380, 250), dw = V(240, 230), dh = V(600, 640);
    g.fillStyle = shade(M.wall, -0.72); g.fillRect(dx - 20, GY - dh - 20, dw + 40, dh + 20);
    g.fillStyle = shade('#2a2838', -0.35); g.fillRect(dx, GY - dh, dw, dh);
    g.fillStyle = alpha(M.key, 0.05); g.fillRect(dx, GY - dh, dw * 0.2, dh);
    circle(g, dx + dw * 0.86, GY - dh * 0.47, 8, '#9a8a6a');
    // height marks on the frame
    const marks = [0.42, 0.5, 0.58, 0.66, 0.72, 0.8]; marks.forEach((m, i) => { const yy = GY - dh * m * 1.0; seg(g, [[dx - 20, yy], [dx - 2, yy]], 3, alpha(M.key, 0.35)); });
    g.fillStyle = alpha('#d9d2c0', 0.5); g.fillRect(CX - V(200, 120), GY - V(560, 760), 120, 160); g.fillStyle = alpha('#3a6ea5', 0.35); g.fillRect(CX - V(190, 110), GY - V(548, 748), 100, 70);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.floor, 0.02), shade(M.dark, -0.3)]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.35)', 0.08);
    // moonlight patch on the floor
    g.save(); g.globalCompositeOperation = 'lighter'; poly(g, [[win.x + 40, GY + 10], [win.x + win.w + 40, GY + 10], [win.x + win.w + 260, GY + 220], [win.x + 200, GY + 220]], alpha(M.key, 0.08)); g.restore();
    FX.lightCone(g, win.x + win.w * 0.5, win.y + win.h * 0.4, { angle: Math.PI * 0.42, spread: 0.45, len: V(900, 1100), color: M.key, a: 0.07 });
    if (o.bed !== false) {
      const bx = CX - V(420, 380), bw = V(560, 480);
      FX.bed(g, { x: bx, y: GY + 40, w: bw, color: shade('#4a4a70', -0.35), frame: shade(M.wall, -0.7), pillow: shade('#d8d4e8', -0.45) });
    }
    if (o.lamp) { const lx = CX + V(150, 80), ly = GY + 10; g.fillStyle = shade(M.wall, -0.75); g.fillRect(lx - 90, ly - 140, 180, 140); seg(g, [[lx + 30, ly - 140], [lx + 30, ly - 240]], 5, '#141420'); poly(g, [[lx - 5, ly - 240], [lx + 65, ly - 240], [lx + 50, ly - 285], [lx + 10, ly - 285]], '#2a2430'); glow(g, lx + 30, ly - 236, 300, M.practical, 0.45 * o.lamp); FX.lightCone(g, lx + 30, ly - 240, { angle: Math.PI / 2, spread: 1.0, len: 300, color: M.practical, a: 0.2 * o.lamp }); }
  });
  return { GY, CX, M, win };
}

// ---------- living room ----------
// CRT TV on a cabinet; drawTV(g,x,y,w,h) paints the screen. o: {tvX}
export function crtTV(g, x, y, w, h, t, content, o = {}) {
  const ui = S().ui;
  rr(g, x - w * 0.12, y - h * 0.12, w * 1.42, h * 1.3, 28); g.fillStyle = '#1c1a20'; g.fill();
  rr(g, x - w * 0.12, y - h * 0.12, w * 1.42, h * 1.3, 28); g.strokeStyle = '#2c2a32'; g.lineWidth = 6; g.stroke();
  // knobs panel
  for (let i = 0; i < 2; i++) { circle(g, x + w * 1.16, y + h * (0.2 + i * 0.25), w * 0.05, '#3a3640'); }
  for (let i = 0; i < 6; i++) seg(g, [[x + w * 1.08, y + h * (0.7 + i * 0.05)], [x + w * 1.24, y + h * (0.7 + i * 0.05)]], 3, '#0e0d12');
  g.save(); rr(g, x, y, w, h, w * 0.08); g.clip();
  g.fillStyle = '#0f1a26'; g.fillRect(x, y, w, h);
  content?.(g, x, y, w, h);
  // scanlines + vignette + flicker
  g.fillStyle = 'rgba(0,0,0,.18)'; for (let yy = y; yy < y + h; yy += 5) g.fillRect(x, yy, w, 2);
  g.fillStyle = radGrad(g, x + w / 2, y + h / 2, w * 0.3, w * 0.8, ['rgba(0,0,0,0)', 'rgba(0,0,0,.55)']); g.fillRect(x, y, w, h);
  g.fillStyle = `rgba(200,230,255,${0.04 + 0.03 * Math.sin(t * 37)})`; g.fillRect(x, y, w, h);
  g.restore();
  glow(g, x + w / 2, y + h / 2, w * 1.4, '#8fc0ff', 0.22);
}
export function living(g, t, cam, o = {}) {
  const M = mood('night'), GY = GYf(), CX = E.W / 2;
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(M.wall, -0.7), shade(M.wall, -0.35)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H);
    // framed portrait of Vesk on the wall (mandatory)
    const px = CX + V(420, 300), py = GY - V(720, 900);
    g.fillStyle = '#2a2018'; g.fillRect(px - 70, py - 90, 140, 180); g.fillStyle = shade('#3a3a44', -0.3); g.fillRect(px - 56, py - 76, 112, 152);
    circle(g, px, py - 10, 32, '#0a0b12'); poly(g, [[px - 40, py - 34], [px + 40, py - 34], [px + 30, py - 54], [px - 30, py - 54]], '#7a2026'); g.fillStyle = '#0a0b12'; g.fillRect(px - 50, py + 30, 100, 46);
    // window with heavy curtains (closed)
    g.fillStyle = shade('#4a3a50', -0.55); g.fillRect(CX - V(800, 520), GY - V(760, 960), V(320, 260), V(560, 640));
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.floor, 0.0), shade(M.dark, -0.35)]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
    // rug
    g.fillStyle = alpha('#5a3040', 0.35); g.beginPath(); g.ellipse(CX, GY + 140, V(600, 460), 90, 0, 0, Math.PI * 2); g.fill();
  });
  return { GY, CX, M };
}
export function sofa(g, x, y, w, col = '#2a2836') {
  rr(g, x - w / 2, y - 200, w, 120, 30); g.fillStyle = shade(col, -0.1); g.fill();
  rr(g, x - w / 2 - 30, y - 120, w + 60, 90, 24); g.fillStyle = col; g.fill();
  rr(g, x - w / 2 - 50, y - 150, 60, 120, 24); g.fillStyle = shade(col, 0.05); g.fill(); rr(g, x + w / 2 - 10, y - 150, 60, 120, 24); g.fill();
  seg(g, [[x - w / 2, y - 30], [x - w / 2, y]], 10, '#0c0b10'); seg(g, [[x + w / 2, y - 30], [x + w / 2, y]], 10, '#0c0b10');
}

// ---------- kitchen ----------
export function kitchen(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), N = mood('night'), GY = GYf(), CX = E.W / 2;
  const lampX = CX + (o.lampX ?? 0), lampY = GY - V(560, 700);
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(M.wall, -0.75), shade(M.wall, -0.35)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H);
    // tiles
    for (let y = GY - 360; y < GY; y += 46) for (let x = -E.W; x < E.W * 2.5; x += 46) { g.fillStyle = alpha('#000', ((x + y) / 46) % 2 ? 0.08 : 0.02); g.fillRect(x, y, 44, 44); }
    // cupboards
    for (let i = -2; i < 4; i++) { g.fillStyle = shade(M.wall, -0.55); g.fillRect(CX - V(900, 600) + i * 190, GY - V(860, 1020), 170, 220); }
    // front door (right) — used in s17/s18
    const dx = CX + V(500, 300), dw = V(240, 230), dh = V(600, 640);
    g.fillStyle = shade(M.wall, -0.8); g.fillRect(dx - 18, GY - dh - 18, dw + 36, dh + 18);
    if (o.doorOpen) { g.fillStyle = linGrad(g, 0, GY - dh, 0, GY, [alpha('#cfe0ff', 0.25), alpha('#cfe0ff', 0.05)]); g.fillRect(dx, GY - dh, dw, dh); g.fillStyle = shade('#3a2e32', -0.4); poly(g, [[dx, GY - dh], [dx + dw * 0.25, GY - dh + 30], [dx + dw * 0.25, GY + 20], [dx, GY]], shade('#3a2e32', -0.4)); }
    else { g.fillStyle = shade('#3a2e32', -0.35); g.fillRect(dx, GY - dh, dw, dh); circle(g, dx + dw * 0.14, GY - dh * 0.47, 8, '#a08860'); }
    // pendant lamp
    seg(g, [[lampX, -E.H], [lampX, lampY - 40]], 4, '#0e0c10');
    poly(g, [[lampX - 90, lampY + 10], [lampX + 90, lampY + 10], [lampX + 40, lampY - 46], [lampX - 40, lampY - 46]], '#2a2026');
    glow(g, lampX, lampY + 10, V(420, 460), M.key, 0.5 * (o.lamp ?? 1));
    FX.lightCone(g, lampX, lampY + 10, { angle: Math.PI / 2, spread: 0.9, len: V(700, 760), color: M.key, a: 0.16 * (o.lamp ?? 1) });
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.floor, -0.1), shade(M.dark, -0.4)]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.3)', 0.08);
    FX.pool(g, lampX, GY + 40, V(420, 380), 80, M.key, 0.3 * (o.lamp ?? 1));
  });
  return { GY, CX, M, lampX, lampY };
}
export function table(g, x, y, w, M) {
  g.fillStyle = shade(M.wall, -0.6); g.fillRect(x - w / 2, y - 120, w, 18);
  seg(g, [[x - w / 2 + 20, y - 104], [x - w / 2 + 20, y]], 10, shade(M.wall, -0.7)); seg(g, [[x + w / 2 - 20, y - 104], [x + w / 2 - 20, y]], 10, shade(M.wall, -0.7));
  g.fillStyle = alpha(M.key, 0.25); g.fillRect(x - w / 2, y - 122, w, 3);
}

// ---------- hallway ----------
// o: {doorOpen: 0..1 parents' door gap, parentsDoorX}
export function hall(g, t, cam, o = {}) {
  const M = mood('night'), GY = GYf(), CX = E.W / 2;
  const pdx = CX + (o.parentsDoorX ?? V(160, 60)), dw = V(230, 220), dh = V(600, 640);
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, [shade(M.wall, -0.75), shade(M.wall, -0.4)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H);
    g.fillStyle = shade(M.wall, -0.6); g.fillRect(-E.W * 1.5, GY - 60, E.W * 4, 60);
    // a far window (left) that throws moon stripes
    const wx = CX - V(760, 560), wy = GY - V(620, 820);
    FX.windowFrame(g, { x: wx, y: wy, w: V(200, 180), h: V(380, 420), cols: 1, rows: 3, frame: shade(M.wall, -0.8), bar: 10 }, (g, x, y, w, h) => nightView(g, x, y, w, h, t, M, { fire: 0.6 }));
    // other doors
    for (const dxo of [-V(380, 330), V(620, 520)]) { g.fillStyle = shade(M.wall, -0.75); g.fillRect(CX + dxo - 14, GY - dh - 14, dw + 28, dh + 14); g.fillStyle = shade('#2a2838', -0.45); g.fillRect(CX + dxo, GY - dh, dw, dh); }
    // parents' door (ajar)
    g.fillStyle = shade(M.wall, -0.8); g.fillRect(pdx - 16, GY - dh - 16, dw + 32, dh + 16);
    g.fillStyle = '#05060b'; g.fillRect(pdx, GY - dh, dw, dh);
    const gap = o.doorOpen ?? 0.18;
    g.fillStyle = shade('#2a2838', -0.35); g.fillRect(pdx + dw * gap, GY - dh, dw * (1 - gap), dh);
    circle(g, pdx + dw * (gap + 0.1), GY - dh * 0.47, 7, '#8a7a5a');
    // family photo frames
    g.fillStyle = alpha('#d9d2c0', 0.25); g.fillRect(pdx - V(170, 150), GY - V(480, 520), 90, 70); g.fillRect(pdx - V(170, 150), GY - V(380, 420), 90, 70);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.floor, 0.0), shade(M.dark, -0.35)]); g.fillRect(-E.W * 1.5, GY, E.W * 4, E.H * 2);
    FX.floorLines(g, GY, GY + 700, 'rgba(0,0,0,.35)', 0.08);
    // moon stripes across the floor and wall
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 3; i++) poly(g, [[CX - V(700, 520), GY - V(560, 760) + i * V(130, 140)], [CX - V(560, 400), GY - V(560, 760) + i * V(130, 140)], [CX + V(500, 380), GY + 120 + i * 60], [CX + V(250, 160), GY + 120 + i * 60]], alpha(M.key, 0.045));
    g.restore();
    // runner rug
    g.fillStyle = alpha('#4a2a3a', 0.4); g.fillRect(-E.W, GY + 60, E.W * 3, 70);
  });
  return { GY, CX, M, pdx, dw, dh };
}
