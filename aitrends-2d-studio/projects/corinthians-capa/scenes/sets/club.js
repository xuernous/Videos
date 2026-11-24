// sets/club.js — club office, night stadium (pitch-side view), locker room, the plane; plus HUD clock, face shots and blueprint helpers.
import { E, V, S, mood, layer, blurLayer, veil, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, lerp, clamp, ease, prog, text, measure, FONTS, rng, shake, wordTime } from '/engine/core.js';
import { drawFigure, POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';

export const groundY = () => E.H * V(0.8, 0.68);
export const wallBase = () => groundY() - V(150, 230);
export const wt = (w, info, d) => { const x = wordTime(w, info.shot.start - 0.05); return x != null && x < info.shot.end + 0.5 ? x - info.shot.start : d; };
export const zoomAt = (g, cx, cy, z, fn) => { g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); fn(); g.restore(); };
export const WHITE = '#efece6', BLACKJ = '#141416';

// ---------------- office ----------------
export const OFF = () => { const CX = E.W / 2, GY = groundY(); return { CX, GY, deskX0: CX - V(80, 40), deskX1: CX + V(560, 480), deskTop: GY - V(190, 210), chairX: CX - V(180, 160) }; };
export function frame(g, x, y, w, h, M, o = {}) {
  g.save(); g.translate(x + w / 2, y); g.rotate(o.rot ?? 0); g.translate(-(x + w / 2), -y);
  rr(g, x - 10, y - 10, w + 20, h + 20, 6); g.fillStyle = shade('#8a6a3a', -0.25); g.fill();
  g.fillStyle = shade(M.wall, -0.15); g.fillRect(x, y, w, h);
  if (o.who) { drawFigure(g, { x: x + w / 2, y: y + h + w * 0.25, s: w / 150, facing: 1, outfit: o.who, pose: POSES.stand, expr: o.expr || 'smile', rim: false, shadow: false }); }
  else { circle(g, x + w / 2, y + h * 0.4, w * 0.2, S().ink); g.fillStyle = S().ink; g.beginPath(); g.ellipse(x + w / 2, y + h, w * 0.36, h * 0.32, 0, Math.PI, 0); g.fill(); }
  g.restore();
  seg(g, [[x + w / 2, y - 10], [x + w / 2 - 30, y - 40], [x + w / 2 + 30, y - 40], [x + w / 2, y - 10]], 2, alpha('#000', 0.5)); circle(g, x + w / 2, y - 40, 5, '#9aa0b0');
}
// o: { frames: [{rot, drop}], board: str|null, light }
export function office(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), sky = mood('day'), O = OFF(), { CX, GY } = O, WB = wallBase();
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, WB, [shade(M.dark, -0.45), shade(M.wall, -0.4), shade(M.wall, -0.25)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, WB + E.H + 4);
    // big window over the city (left)
    const wx = CX - V(820, 600), wy = WB - V(700, 820), ww = V(560, 430), wh = V(560, 620);
    glow(g, wx + ww / 2, wy + wh / 2, ww * 1.2, sky.key, 0.2);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 3, rows: 2, frame: shade(M.dark, -0.4), bar: 10, blinds: 0 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, mood('golden').sky); g.fillRect(x, y, w, h); FX.sun(g, x + w * 0.7, y + h * 0.3, 30, '#fff6e0', sky.key, 3);
      FX.skyline(g, { x: x - 10, y: y + h + 4, w: w + 20, minH: 80, maxH: h * 0.7, color: shade(sky.dark, 0.1), windowColor: sky.practical, lit: 0.08, seed: 9 });
    });
    FX.godRays(g, wx + ww * 0.6, wy + wh * 0.3, { count: 7, angle: 0.6, spread: 0.5, len: V(1600, 1800), color: sky.key, a: 0.07, t });
    // trophy shelf
    const sx = CX + V(420, 300), sy = WB - V(560, 660);
    g.fillStyle = shade(M.dark, -0.3); g.fillRect(sx - 170, sy, 340, 14);
    for (let i = 0; i < 3; i++) { const tx = sx - 110 + i * 110, c = mix(S().ui.gold, M.key, 0.3); poly(g, [[tx - 22, sy], [tx + 22, sy], [tx + 10, sy - 20], [tx - 10, sy - 20]], shade(c, -0.3)); seg(g, [[tx, sy - 20], [tx, sy - 50]], 6, c); g.fillStyle = c; g.beginPath(); g.moveTo(tx - 30, sy - 100); g.lineTo(tx + 30, sy - 100); g.quadraticCurveTo(tx + 26, sy - 50, tx, sy - 50); g.quadraticCurveTo(tx - 26, sy - 50, tx - 30, sy - 100); g.fill(); glow(g, tx, sy - 80, 60, c, 0.25); }
    // wall of portraits
    for (const [i, f] of (o.frames || []).entries()) { const fx = CX - V(40, 60) + i * V(220, 200), fy = WB - V(620, 760) + (f.drop ? ease.in(f.drop) * V(700, 900) : 0); if (fy < GY) frame(g, fx, fy, V(150, 140), V(190, 180), M, { rot: (f.rot ?? 0) + (f.drop ? f.drop * 0.8 : 0), who: f.who, expr: f.expr }); }
    if (o.board) { const bx = CX - V(40, 60), by = WB - V(640, 760), bw = V(560, 520), bh = V(360, 380); rr(g, bx - 12, by - 12, bw + 24, bh + 24, 8); g.fillStyle = shade(M.dark, -0.2); g.fill(); g.fillStyle = '#eef0f2'; g.fillRect(bx, by, bw, bh); o.board(g, bx, by, bw, bh); }
    g.fillStyle = alpha('#000', 0.3); g.fillRect(-E.W, WB - 10, E.W * 4, 10);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, WB, 0, E.H * 1.4, [shade(M.floor, -0.45), shade(M.floor, -0.2)]); g.fillRect(-E.W * 1.5, WB, E.W * 4, E.H * 2);
    FX.floorLines(g, WB, E.H * 1.6, alpha('#000', 0.22), 0.09);
    FX.pool(g, CX - V(200, 150), GY + V(40, 60), V(700, 600), V(130, 160), sky.key, 0.25);
  });
  layer(g, cam, 0.92, (g) => {
    const dk = shade(M.dark, -0.4);
    g.fillStyle = shade('#5a3a2a', -0.2); g.fillRect(O.deskX0, O.deskTop, O.deskX1 - O.deskX0, 22); g.fillStyle = dk; g.fillRect(O.deskX0 + 10, O.deskTop + 22, O.deskX1 - O.deskX0 - 20, GY - O.deskTop - 22);
    g.fillStyle = alpha(M.key, 0.2); g.fillRect(O.deskX0, O.deskTop, O.deskX1 - O.deskX0, 3);
    rr(g, O.deskX0 + V(260, 220), O.deskTop - 120, 150, 110, 6); g.fillStyle = '#0b0b12'; g.fill(); g.fillStyle = alpha(mood('interiorCool').practical, 0.5); g.fillRect(O.deskX0 + V(268, 228), O.deskTop - 112, 134, 80);
    o.deskExtra?.(g, O, M);
    if (o.chair !== false) { const x = O.chairX - 30, c = shade('#3a2a22', -0.3); rr(g, x - 80, GY - 360, 90, 280, 30); g.fillStyle = c; g.fill(); rr(g, x - 90, GY - 110, 150, 34, 12); g.fill(); seg(g, [[x - 20, GY - 80], [x - 20, GY - 20]], 14, c); seg(g, [[x - 80, GY], [x + 40, GY]], 10, c); }
  });
  return { GY, CX, M, WB, O, sky };
}

// ---------------- stadium (pitch-side) ----------------
// o: { phase: 'night'|'dawn'|'warm', lights 0..1, crowd 0..1 (cheer), banners, empty }
export function stadium(g, t, cam, o = {}) {
  const ph = o.phase || 'night', M = mood(ph === 'dawn' ? 'dusk' : ph === 'warm' ? 'golden' : 'night'), GY = groundY(), CX = E.W / 2, L = o.lights ?? 1;
  const standTop = GY - V(720, 880), standBot = GY - V(160, 220);
  layer(g, cam, 0.15, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, standTop, M.sky); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, standTop + E.H + 20);
    if (ph === 'night') FX.stars(g, t, { area: [-E.W, -E.H * 0.5, E.W * 3, E.H * 0.6], count: 40, seed: 3 });
    if (ph === 'dawn') FX.sun(g, CX + V(300, 250), standTop + 40, V(60, 70), '#fff3dc', M.key, 4);
  });
  layer(g, cam, 0.45, (g) => {
    // tiers
    g.fillStyle = shade(M.wall, -0.55); poly(g, [[-E.W * 1.5, standBot], [-E.W * 1.5, standTop + 60], [E.W * 2.5, standTop + 60], [E.W * 2.5, standBot]], shade(M.wall, -0.55));
    g.fillStyle = shade(M.dark, -0.4); g.fillRect(-E.W * 1.5, standTop, E.W * 4, 60);
    for (let k = 0; k < 9; k++) { const y = lerp(standTop + 70, standBot - 20, k / 8); g.fillStyle = alpha('#000', 0.25); g.fillRect(-E.W * 1.5, y, E.W * 4, 3); }
    if (!o.empty) { const cols = [WHITE, '#2a2a30', '#5a5a66', '#d8d4cc']; FX.crowd(g, t, { x: -E.W * 0.6, y: standTop + 90, w: E.W * 2.2, rows: 9, rowH: (standBot - standTop - 110) / 9, size: V(1.6, 1.8), colors: cols, cheer: o.crowd ?? 0.4, seed: 7 }); }
    if (o.banners) for (const [i, s] of o.banners.entries()) { const bx = CX + (i - (o.banners.length - 1) / 2) * V(380, 330), by = lerp(standTop, standBot, 0.55) + Math.sin(t * 3 + i) * 6; g.save(); g.translate(bx, by); g.rotate(Math.sin(t * 2 + i) * 0.03); rr(g, -150, -50, 300, 100, 6); g.fillStyle = WHITE; g.fill(); text(g, s, 0, 4, { size: 64, color: '#d02020', font: FONTS.title, weight: 700 }); g.restore(); }
    // floodlight towers
    for (const x of [CX - V(700, 520), CX + V(700, 520)]) { seg(g, [[x, standTop + 60], [x, standTop - V(300, 380)]], 14, shade(M.dark, -0.3)); rr(g, x - 90, standTop - V(380, 460), 180, 80, 6); g.fillStyle = shade(M.dark, -0.5); g.fill();
      if (L > 0) { for (let i = 0; i < 6; i++) circle(g, x - 70 + i * 28, standTop - V(340, 420), 10, alpha('#fffbe8', L)); glow(g, x, standTop - V(340, 420), 260, '#fffbe8', 0.5 * L); FX.lightCone(g, x, standTop - V(340, 420), { angle: Math.PI / 2 + (x < CX ? -0.5 : 0.5) * -1, spread: 0.6, len: V(1600, 1900), color: '#fffbe8', a: 0.08 * L }); } }
    o.scoreboard?.(g, CX, standTop);
  });
  layer(g, cam, 0.85, (g) => {
    const grass = ph === 'warm' ? mix(M.grass, '#6a8a40', 0.3) : mix(M.grass, '#2a6a3a', 0.4);
    g.fillStyle = linGrad(g, 0, standBot, 0, E.H * 1.4, [shade(grass, -0.35 + 0.2 * L), shade(grass, -0.1 + 0.15 * L)]); g.fillRect(-E.W * 1.5, standBot, E.W * 4, E.H * 2);
    for (let i = -8; i < 10; i++) { g.fillStyle = alpha('#ffffff', 0.04); g.beginPath(); g.moveTo(CX + i * 160, standBot); g.lineTo(CX + (i + 0.5) * 160, standBot); g.lineTo(CX + (i + 0.5) * 520, E.H * 1.4); g.lineTo(CX + i * 520, E.H * 1.4); g.fill(); }
    g.fillStyle = alpha('#ffffff', 0.7); g.fillRect(-E.W * 1.5, standBot + 30, E.W * 4, 5);
    g.strokeStyle = alpha('#ffffff', 0.5); g.lineWidth = 5; g.beginPath(); g.ellipse(CX, standBot + 70, V(380, 340), 40, 0, 0, Math.PI * 2); g.stroke();
    FX.pool(g, CX, GY + V(40, 60), V(900, 800), V(160, 200), '#fffbe8', 0.15 * L);
    // advertising boards
    g.fillStyle = shade(M.dark, -0.2); g.fillRect(-E.W * 1.5, standBot - 2, E.W * 4, 32); for (let x = -E.W; x < E.W * 2.5; x += 300) { g.fillStyle = alpha(x % 600 ? '#e8e4dc' : '#d02020', 0.5 * L + 0.1); g.fillRect(x + 10, standBot + 4, 270, 20); }
  });
  return { GY, CX, M, standTop, standBot, L };
}
export function bench(g, x, y, M, n = 4, s = 1, who = []) {
  g.fillStyle = shade(M.dark, -0.4); rr(g, x - 40, y - 260 * s, 80 + n * 120 * s, 40, 16); g.fill(); g.fillStyle = alpha('#cfe6ff', 0.12); g.fillRect(x - 40, y - 230 * s, 80 + n * 120 * s, 210 * s);
  g.fillStyle = shade(M.dark, -0.5); g.fillRect(x - 20, y - 80 * s, 40 + n * 120 * s, 16);
}

// ---------------- locker room ----------------
export function locker(g, t, cam, o = {}) {
  const M = mood('interiorCool'), GY = groundY(), CX = E.W / 2, WB = wallBase();
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, WB, [shade(M.dark, -0.4), shade(M.wall, -0.35), shade(M.wall, -0.2)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, WB + E.H + 4);
    for (let i = -6; i <= 8; i++) { const x = CX + i * V(150, 140); g.fillStyle = i % 2 ? shade(WHITE, -0.55) : shade(BLACKJ, 0.1); g.fillRect(x - 64, WB - V(520, 600), 128, V(520, 600)); for (let k = 0; k < 4; k++) { g.fillStyle = alpha('#000', 0.3); g.fillRect(x - 40, WB - V(500, 580) + k * 14, 80, 5); } circle(g, x + 44, WB - V(300, 340), 6, '#9aa0b0'); }
    // ceiling lights
    for (const dx of [-1, 0, 1]) { rr(g, CX + dx * V(500, 380) - 120, WB - V(820, 980), 240, 18, 9); g.fillStyle = mix(M.key, '#ffffff', 0.6); g.fill(); FX.lightCone(g, CX + dx * V(500, 380), WB - V(810, 970), { angle: Math.PI / 2, spread: 0.6, len: V(1100, 1300), color: M.key, a: 0.07 }); }
    if (o.board) { const bx = CX - V(260, 240), by = WB - V(760, 880), bw = V(520, 480), bh = V(300, 320); rr(g, bx - 10, by - 10, bw + 20, bh + 20, 8); g.fillStyle = shade(M.dark, -0.3); g.fill(); g.fillStyle = '#eef0f2'; g.fillRect(bx, by, bw, bh); o.board(g, bx, by, bw, bh); }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, WB, 0, E.H * 1.4, [shade(M.floor, -0.4), shade(M.floor, -0.15)]); g.fillRect(-E.W * 1.5, WB, E.W * 4, E.H * 2);
    FX.floorLines(g, WB, E.H * 1.6, alpha('#000', 0.2), 0.08); FX.pool(g, CX, GY + V(40, 60), V(800, 700), V(140, 170), M.key, 0.2);
    g.fillStyle = shade('#6a4a32', -0.3); g.fillRect(-E.W, WB + V(60, 80), E.W * 3, 22); g.fillRect(-E.W, WB + V(82, 102), E.W * 3, 30);
  });
  return { GY, CX, M, WB };
}

// ---------------- plane over the clouds ----------------
export function sky(g, t, cam, o = {}) {
  const M = mood('day');
  layer(g, cam, 0.2, (g) => { g.fillStyle = linGrad(g, 0, -E.H, 0, E.H * 1.5, M.sky); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, E.H * 3); FX.sun(g, E.W * 0.8, E.H * 0.15, 50, '#fff6e0', M.key, 4); });
  for (const [d, y, a, sd] of [[0.4, 0.55, 0.5, 2], [0.7, 0.72, 0.7, 5], [1.3, 0.92, 0.9, 8]]) layer(g, { ...cam, x: (cam.x || 0) + t * 300 * d }, d, (g) => { const r = rng(sd); for (let i = 0; i < 14; i++) { const x = -E.W + r() * E.W * 4, yy = E.H * y + r() * 80; for (let k = 0; k < 5; k++) circle(g, x + k * 60, yy - Math.sin(k / 4 * Math.PI) * 50, 70 + r() * 40, alpha('#ffffff', a)); } });
  return { M };
}
export function plane(g, x, y, s, M) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#f2f4f8'; rr(g, -260, -40, 520, 80, 40); g.fill(); poly(g, [[-260, -20], [-330, -110], [-280, -110], [-200, -30]], '#d8dce4');
  poly(g, [[-40, 10], [80, 10], [-10, 120], [-70, 120]], '#d8dce4'); g.fillStyle = '#1a1a24'; for (let i = 0; i < 9; i++) { rr(g, -180 + i * 42, -18, 22, 18, 6); g.fill(); }
  rr(g, 200, -26, 40, 24, 8); g.fill(); g.fillStyle = alpha(M.key, 0.35); g.fillRect(-250, -36, 480, 8);
  g.restore();
}

// ---------------- shared helpers ----------------
export function clockChip(g, t, str, o = {}) {
  const ui = S().ui, at = o.at ?? 0, pop = 1 + 0.25 * (1 - ease.out(prog(t, at, at + 0.35))) * (t > at ? 1 : 0), a = o.a ?? 1;
  const x = V(70, 70), y = V(90, 210), w = V(300, 300), h = V(96, 104);
  g.save(); g.globalAlpha *= a; g.translate(x + w / 2, y + h / 2); g.scale(pop, pop); g.translate(-(x + w / 2), -(y + h / 2));
  rr(g, x, y, w, h, h / 2); g.fillStyle = alpha('#05050a', 0.78); g.fill(); g.strokeStyle = ui.gold; g.lineWidth = 4; g.stroke();
  circle(g, x + 52, y + h / 2, 22, 'transparent'); ring(g, x + 52, y + h / 2, 22, 5, ui.cream); seg(g, [[x + 52, y + h / 2], [x + 52, y + h / 2 - 14]], 4, ui.cream); seg(g, [[x + 52, y + h / 2], [x + 62, y + h / 2 + 4]], 4, ui.cream);
  text(g, str, x + w - 30, y + h / 2 + 2, { size: V(58, 62), color: ui.gold, font: FONTS.ui, weight: 900, align: 'right', glow: 16, glowColor: alpha(ui.gold, 0.6) });
  g.restore();
}
export function bpBack(g, t) {
  const ui = S().ui; g.fillStyle = ui.bpBg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  g.strokeStyle = alpha(ui.blueprint, 0.08); g.lineWidth = 1.5; const s = 60, o = (t * 6) % s;
  for (let x = -s + o; x < E.W + s; x += s) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); }
  for (let y = -s + o; y < E.H + s; y += s) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  glow(g, E.W / 2, E.H * 0.45, E.W, ui.blueprint, 0.08);
}
export function bigNum(g, t, str, x, y, at, o = {}) {
  const k = ease.outBack(prog(t, at - 0.1, at + 0.3)); if (k <= 0) return;
  const ui = S().ui, c = o.color || ui.gold, size = o.size ?? V(130, 150);
  const sz = Math.min(size, size * E.W * 0.9 / Math.max(1, measure(g, str, size, FONTS.ui, 900)));
  g.save(); g.translate(x, y); g.scale(k, k); g.rotate(o.rot ?? 0);
  if (o.label) text(g, o.label, 0, -sz * 0.72, { size: Math.min(sz * 0.32, size * 0.32), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6 });
  text(g, str, 0, 0, { size: sz, color: c, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(c, 0.6), stroke: o.stroke ?? 0, strokeColor: '#000' });
  g.restore();
}
export function stampText(g, t, str, x, y, at, o = {}) {
  const p = prog(t, at, at + 0.18); if (p <= 0) return; const s = lerp(2.2, 1, ease.out(p)), c = o.color || '#d02020', size = o.size ?? V(90, 96);
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.15); g.scale(s, s); g.globalAlpha *= clamp(p * 1.5);
  const w = measure(g, str, size, FONTS.title, 700) + size * 0.8; rr(g, -w / 2, -size * 0.75, w, size * 1.5, 14); g.strokeStyle = c; g.lineWidth = size * 0.1; g.stroke();
  text(g, str, 0, size * 0.06, { size, color: c, font: FONTS.title, weight: 700, spacing: 3 }); g.restore();
}
export function bgBlur(g, t, where, o = {}) {
  const cam = { z: o.z ?? 1.6, x: o.x ?? 0, y: o.y ?? -V(200, 300) };
  blurLayer(g, o.blur ?? 14, (g) => (where === 'office' ? office(g, t, cam, o.set || {}) : where === 'locker' ? locker(g, t, cam, o.set || {}) : stadium(g, t, cam, o.set || {})));
  veil(g, '#06050c', o.veil ?? 0.4);
}
export function faceShot(g, t, info, o) {
  bgBlur(g, t, o.where || 'stadium', { set: o.set, x: o.bgx ?? 0, veil: o.veil });
  const M = mood(o.where === 'office' ? 'interiorWarm' : o.where === 'locker' ? 'interiorCool' : 'night');
  const r = (o.r ?? V(300, 330)) * (1 + (o.push ?? 0.05) * t / Math.max(1, info.dur));
  let cx = E.W / 2 + (o.x ?? 0), cy = E.H * V(0.6, 0.5) + (o.y ?? 0);
  if (o.shakeAmp) { const [sx, sy] = shake(t, o.shakeAmp, 9); cx += sx; cy += sy; }
  o.under?.(g, cx, cy, r, M);
  bigFace(g, cx, cy, r, { outfit: o.who, expr: o.expr, look: o.look, rimColor: o.rimColor || M.rim, rimSide: o.rimSide ?? -1, tilt: o.tilt, blink: o.blink ?? ((t % 3.3) > 3.18) });
  o.over?.(g, cx, cy, r, M);
  return { cx, cy, r, M };
}
export const sweat = (g, cx, cy, r, t) => { const y = cy - r * 0.5 + ((t * 0.3) % 1) * r * 0.3; g.fillStyle = alpha('#cfe6ff', 0.85); g.beginPath(); g.moveTo(cx + r * 0.72, y - r * 0.12); g.quadraticCurveTo(cx + r * 0.8, y, cx + r * 0.72, y + r * 0.05); g.quadraticCurveTo(cx + r * 0.64, y, cx + r * 0.72, y - r * 0.12); g.fill(); };
