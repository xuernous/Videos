// sets/exteriors.js — Grâvia streets (concrete blocks, sodium lamps, smoke, fire glow), the border (fence, wire, watchtower,
// searchlight, free city beyond), the grey road (fog, poles, crossroads signposts) and the Valdória map.
import { E, V, S, mood, layer, blurLayer, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, rng, text, FONTS, ease, prog, clamp, lerp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { smoke, fire, FIRE, sirenWash, wireCoil, OPT } from './kit.js';

const GYf = () => E.H * V(0.8, 0.68);

// Soviet-style apartment block
export function block(g, x, y, w, h, M, o = {}) {
  const col = o.color || shade(M.wall, -0.35), r = rng(o.seed || 1);
  g.fillStyle = col; g.fillRect(x, y - h, w, h);
  g.fillStyle = alpha('#000', 0.25); for (let yy = y - h + 40; yy < y; yy += 70) g.fillRect(x, yy, w, 4);
  const cols = Math.max(2, Math.round(w / 70)), rows = Math.max(2, Math.round(h / 70));
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows - 1; j++) {
    const wx = x + 18 + i * (w - 36) / cols, wy = y - h + 54 + j * 70, ww = (w - 36) / cols - 16;
    const lit = r() < (o.lit ?? 0.15);
    g.fillStyle = lit ? alpha(M.practical, 0.85) : alpha('#000', 0.35); g.fillRect(wx, wy, ww, 34);
    if (lit) glow(g, wx + ww / 2, wy + 17, 40, M.practical, 0.25);
  }
  if (o.rim) { g.fillStyle = alpha(o.rim, 0.25); g.fillRect(x, y - h, 4, h); }
}

// ---------- street ----------
// o: {fire: 0..1, smoke: true, siren: 0..1, dawn: 0..1, lamps: true, blocks}
export function street(g, t, cam, o = {}) {
  const N = mood('night'), D = mood('storm'), M = o.dawn ? { ...N, sky: [mix(N.sky[0], D.sky[1], o.dawn), mix(N.sky[1], D.sky[2], o.dawn), mix(N.sky[2], '#7a7a96', o.dawn)] } : N;
  const GY = GYf(), CX = E.W / 2, fireK = o.fire ?? 0.6;
  layer(g, cam, 0.12, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H * 0.5, 0, GY, M.sky); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H * 1.2);
    if (!o.dawn) FX.stars(g, t, { area: [-E.W, -E.H * 0.4, E.W * 3, E.H * 0.6], count: 80 });
    glow(g, CX + V(300, 200), GY - 80, V(1200, 1000), FIRE(), 0.35 * fireK);
  });
  layer(g, cam, 0.3, (g) => {
    FX.skyline(g, { x: -E.W, y: GY - V(80, 120), w: E.W * 3, minH: 120, maxH: V(420, 520), color: shade(M.wall, -0.55), windowColor: alpha(M.practical, 0.6), lit: 0.06, seed: 31, minW: 60, maxW: 160 });
    if (o.smoke !== false) { smoke(g, CX + V(260, 200), GY - V(300, 360), t, { h: V(1100, 1300), w: V(200, 180), color: shade(M.wall, -0.3), a: 0.55, seed: 5, lit: FIRE() }); smoke(g, CX - V(500, 380), GY - V(260, 320), t, { h: V(900, 1100), w: V(150, 140), color: shade(M.wall, -0.35), a: 0.45, seed: 9 }); }
    if (o.siren) sirenWash(g, t, CX + (o.sirenX ?? V(400, 300)), GY - 200, V(700, 600), o.siren);
  });
  layer(g, cam, 0.55, (g) => {
    const blocks = o.blocks || [[-V(980, 760), V(420, 360), V(760, 900)], [-V(520, 360), V(380, 320), V(560, 700)], [V(160, 120), V(420, 330), V(820, 980)], [V(640, 520), V(400, 360), V(620, 760)]];
    blocks.forEach(([dx, w, h], i) => block(g, CX + dx, GY - 40, w, h, M, { seed: 3 + i, lit: 0.1 + (i % 2) * 0.08, rim: alpha(FIRE(), 0.4) }));
    // propaganda banner with Vesk's emblem
    if (o.banner !== false) { const bx = CX + V(230, 160), by = GY - V(700, 840); g.fillStyle = shade('#7a1c22', -0.2); g.fillRect(bx, by, V(220, 200), V(360, 380)); circle(g, bx + V(110, 100), by + V(140, 150), 50, shade('#e8c070', -0.3)); circle(g, bx + V(110, 100), by + V(140, 150), 34, shade('#7a1c22', -0.2)); }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 40, 0, GY + 700, [shade(M.road, -0.1), shade(M.dark, -0.4)]); g.fillRect(-E.W * 1.5, GY - 40, E.W * 4, E.H * 2);
    g.fillStyle = shade(M.road, 0.08); g.fillRect(-E.W * 1.5, GY - 40, E.W * 4, 14);  // kerb
    for (let x = -E.W; x < E.W * 2.5; x += 260) { g.fillStyle = alpha('#d8d8e0', 0.12); g.fillRect(x, GY + 200, 130, 10); }
    if (o.lamps !== false) for (const lx of [CX - V(420, 300), CX + V(560, 420)]) { FX.lampPost(g, lx, GY - 30, V(440, 480), { light: N.practical, a: 0.22, color: '#0c0d14' }); FX.pool(g, lx + 37, GY, 240, 50, N.practical, 0.3); }
    if (o.wet !== false) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, [alpha(FIRE(), 0.08 * fireK), alpha(FIRE(), 0)]); g.fillRect(-E.W, GY, E.W * 3, 300); g.restore(); }
  });
  return { GY, CX, M };
}

// factory with chimneys (burning)
export function factory(g, t, x, y, s, M) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const col = shade(M.wall, -0.6);
  for (const [cx, h] of [[-260, 620], [-120, 700], [40, 560]]) { g.fillStyle = col; g.fillRect(cx, -h, 70, h); g.fillStyle = alpha('#ff6a3a', 0.25); g.fillRect(cx, -h, 70, 14); }
  g.fillStyle = col; g.fillRect(-420, -300, 840, 300);
  for (let i = 0; i < 5; i++) poly(g, [[-420 + i * 168, -300], [-336 + i * 168, -380], [-252 + i * 168, -300]], col);
  for (let i = 0; i < 9; i++) { g.fillStyle = alpha(FIRE(), 0.8 * (0.6 + 0.4 * Math.sin(t * 9 + i))); g.fillRect(-380 + i * 88, -220, 56, 80); }
  g.restore();
}

// ---------- border ----------
// o: {search: true, freeCity: 1, sweep}
export function border(g, t, cam, o = {}) {
  const M = mood('night'), GY = GYf(), CX = E.W / 2, gold = mood('golden');
  layer(g, cam, 0.12, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H * 0.5, 0, GY, [M.sky[0], M.sky[1], shade(M.sky[2], 0.05)]); g.fillRect(-E.W * 2, -E.H, E.W * 5, GY + E.H * 1.2);
    FX.stars(g, t, { area: [-E.W, -E.H * 0.4, E.W * 3, E.H * 0.9], count: 120, seed: 8 });
    // the free city's warm glow beyond
    glow(g, CX, GY - 100, V(1100, 900), gold.key, 0.4 * (o.freeCity ?? 0.6));
  });
  layer(g, cam, 0.3, (g) => {
    FX.skyline(g, { x: CX - V(700, 520), y: GY - V(120, 160), w: V(1400, 1040), minH: 60, maxH: V(260, 300), color: shade(gold.wall, -0.55), windowColor: gold.practical, lit: 0.5 * (o.freeCity ?? 0.6), seed: 44 });
    FX.hills(g, { y: GY - V(110, 150), amp: 30, color: shade(M.wall, -0.6), seed: 3 });
  });
  layer(g, cam, 0.55, (g) => {
    // no-man's land strip
    g.fillStyle = linGrad(g, 0, GY - 120, 0, GY, [shade(M.grass, -0.65), shade(M.floor, -0.3)]); g.fillRect(-E.W * 1.5, GY - 120, E.W * 4, 140);
    // watchtower
    const tx = CX + (o.towerX ?? V(380, 300)), ty = GY - 80;
    seg(g, [[tx - 60, ty], [tx - 30, ty - 520]], 10, '#0b0c14'); seg(g, [[tx + 60, ty], [tx + 30, ty - 520]], 10, '#0b0c14'); seg(g, [[tx - 50, ty - 160], [tx + 50, ty - 320]], 6, '#0b0c14'); seg(g, [[tx + 50, ty - 160], [tx - 50, ty - 320]], 6, '#0b0c14');
    g.fillStyle = '#0b0c14'; g.fillRect(tx - 80, ty - 620, 160, 110); poly(g, [[tx - 100, ty - 620], [tx + 100, ty - 620], [tx, ty - 690]], '#0b0c14');
    g.fillStyle = alpha(M.practical, 0.6); g.fillRect(tx - 60, ty - 600, 120, 40);
    if (o.search !== false) {
      const sw = o.sweep ?? (Math.PI * 0.62 + Math.sin(t * 0.9) * 0.45);
      g.save(); g.globalCompositeOperation = 'lighter';
      FX.lightCone(g, tx - 40, ty - 570, { angle: sw, spread: 0.13, len: V(1800, 1700), color: '#eef3ff', a: 0.28 });
      g.restore(); glow(g, tx - 40, ty - 570, 70, '#ffffff', 0.9);
      const hx = tx - 40 + Math.cos(sw) * (GY + 20 - (ty - 570)) / Math.max(0.2, Math.sin(sw));
      FX.pool(g, hx, GY + 40, 260, 50, '#eef3ff', 0.35);
    }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 700, [shade(M.floor, -0.1), shade(M.dark, -0.45)]); g.fillRect(-E.W * 1.5, GY - 4, E.W * 4, E.H * 2);
  });
  return { GY, CX, M };
}
// fence (posts + mesh + wire coil on top) drawn at the character plane or foreground
export function fence(g, t, y, h, M, o = {}) {
  const col = o.color || '#0b0c14', x0 = -E.W, x1 = E.W * 2, step = o.step || 260;
  g.strokeStyle = alpha(o.mesh || shade(M.rim, -0.45), o.meshA ?? 0.35); g.lineWidth = 1.6; g.beginPath();
  for (let x = x0; x < x1; x += 34) { g.moveTo(x, y); g.lineTo(x + h * 0.5, y - h); g.moveTo(x + h * 0.5, y); g.lineTo(x, y - h); }
  g.stroke();
  for (let x = x0; x < x1; x += step) { seg(g, [[x, y + 10], [x, y - h - 10], [x + 30, y - h - 50]], 10, col); }
  seg(g, [[x0, y - h], [x1, y - h]], 4, col); seg(g, [[x0, y - h * 0.5], [x1, y - h * 0.5]], 3, alpha(col, 0.8));
  wireCoil(g, x0, x1, y - h - 40, 34, alpha(o.wire || shade(M.rim, -0.2), 0.8), 3);
}

// ---------- the grey road ----------
// o: {fog: 0.5, poles: true, cross: false, dawn: 0}
export function road(g, t, cam, o = {}) {
  const M = mood('night'), GY = GYf(), CX = E.W / 2, horizon = GY - V(260, 420);
  layer(g, cam, 0.1, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H * 0.6, 0, horizon + 40, [M.sky[0], M.sky[1], mix(M.sky[2], M.fog, 0.6)]); g.fillRect(-E.W * 2, -E.H, E.W * 5, horizon + E.H * 1.1);
    FX.stars(g, t, { area: [-E.W, -E.H * 0.4, E.W * 3, horizon], count: 90, seed: 13 });
    if (o.moon !== false) FX.moon(g, CX - V(500, 260), horizon - V(600, 820), 34);
    glow(g, CX + V(600, 300), horizon, V(900, 700), FIRE(), 0.18 * (o.fireGlow ?? 1));
  });
  layer(g, cam, 0.3, (g) => {
    FX.hills(g, { y: horizon + 10, amp: 40, color: shade(M.wall, -0.55), seed: 6, freq: 0.003 });
    for (let i = 0; i < 26; i++) { const x = -E.W + i * 130 + ((i * 53) % 70); if (Math.abs(x - CX) > 160) FX.pine(g, x, horizon + 20, 0.5 + ((i * 7) % 5) * 0.08, shade(M.wall, -0.7)); }
  });
  layer(g, cam, 0.85, (g) => {
    // fields
    g.fillStyle = linGrad(g, 0, horizon, 0, GY + 700, [shade(M.grass, -0.6), shade(M.dark, -0.5)]); g.fillRect(-E.W * 1.5, horizon, E.W * 4, E.H * 2);
    // the road in perspective toward the vanishing point
    const vx = CX + (o.vx ?? 0), bw = V(1700, 1500);
    poly(g, [[vx - 14, horizon], [vx + 14, horizon], [vx + bw / 2, E.H * 1.4], [vx - bw / 2, E.H * 1.4]], shade(M.road, -0.05));
    g.fillStyle = alpha('#e8e8ee', 0.35);
    for (let i = 0; i < 14; i++) { const u0 = ((i + (o.roll ?? 0)) / 14) ** 2.2, u1 = ((i + 0.45 + (o.roll ?? 0)) / 14) ** 2.2; const y0 = lerp(horizon, E.H * 1.4, u0), y1 = lerp(horizon, E.H * 1.4, u1); const w0 = lerp(1, 18, u0), w1 = lerp(1, 18, u1); poly(g, [[vx - w0 / 2, y0], [vx + w0 / 2, y0], [vx + w1 / 2, y1], [vx - w1 / 2, y1]], alpha('#e8e8ee', 0.35)); }
    if (o.cross) { poly(g, [[-E.W, GY - 40], [E.W * 2, GY - 40], [E.W * 2, GY + 70], [-E.W, GY + 70]], shade(M.road, -0.02)); }
    // telegraph poles receding
    if (o.poles !== false) for (let i = 0; i < 8; i++) { const u = (i / 8) ** 2, y = lerp(horizon, E.H * 1.2, u), h = lerp(30, 900, u), x = vx + lerp(20, bw * 0.7, u); seg(g, [[x, y], [x, y - h]], lerp(2, 16, u), '#0b0c14'); seg(g, [[x - h * 0.12, y - h * 0.92], [x + h * 0.12, y - h * 0.92]], lerp(1.5, 10, u), '#0b0c14'); }
  });
  // fog bands
  FX.fog(g, horizon - 120, 300, M.fog, 0.45 * (o.fog ?? 0.6));
  return { GY, CX, M, horizon };
}
// crossroads signpost with four arrows A-D
export function signpost(g, x, y, s, t, o = {}) {
  const ui = S().ui, C = OPT(), a = o.a ?? 1;
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha *= a;
  seg(g, [[0, 0], [0, -520]], 16, '#0b0c14');
  const arrows = [['A', -1, -480], ['B', 1, -400], ['C', -1, -320], ['D', 1, -240]];
  arrows.forEach(([L, d, yy], i) => {
    const k = ease.outBack(prog(t, (o.at ?? 0) + i * 0.25, (o.at ?? 0) + i * 0.25 + 0.35)); if (k <= 0) return;
    g.save(); g.translate(0, yy); g.scale(d * k, k);
    poly(g, [[0, -30], [170, -30], [210, 0], [170, 30], [0, 30]], shade(C[L], -0.35));
    g.restore();
    text(g, L, d * 110, yy + 3, { size: 44, color: '#fff3e0', font: FONTS.ui, weight: 900, alpha: clamp(k) });
    glow(g, d * 110, yy, 90, C[L], 0.18 * clamp(k));
  });
  g.restore();
}

// ---------- map of Valdória ----------
// coordinates in a 0..1 box; projected into the frame. o: {fires: 0..1, route: 0..1, kolvar: 0..1, zoom}
export const MAPPTS = { gravia: [0.42, 0.34], kolvar: [0.46, 0.52], border: [0.62, 0.86] };
const OUTLINE = [[0.2, 0.08], [0.48, 0.04], [0.74, 0.12], [0.86, 0.3], [0.8, 0.5], [0.88, 0.7], [0.72, 0.9], [0.5, 0.95], [0.32, 0.86], [0.18, 0.7], [0.12, 0.48], [0.16, 0.26]];
const CITIES = [[0.42, 0.34], [0.3, 0.2], [0.62, 0.22], [0.7, 0.42], [0.28, 0.5], [0.46, 0.52], [0.58, 0.66], [0.36, 0.72], [0.66, 0.8], [0.22, 0.36], [0.52, 0.12], [0.76, 0.62]];
export function mapProj(o = {}) { const mw = V(1300, 960) * (o.zoom ?? 1), mh = mw * 1.2, x0 = E.W / 2 - mw / 2 + (o.ox ?? 0), y0 = E.H * V(0.55, 0.47) - mh / 2 + (o.oy ?? 0); return (p) => [x0 + p[0] * mw, y0 + p[1] * mh]; }
export function valdoriaMap(g, t, o = {}) {
  const ui = S().ui, c = UI.bpStroke(), P = mapProj(o);
  UI.blueprint(g, { grid: 60, a: 0.06 });
  glow(g, E.W / 2, E.H * 0.47, E.W, '#2a3a6a', 0.25);
  // country fill + outline
  g.beginPath(); OUTLINE.forEach((p, i) => { const [x, y] = P(p); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath();
  g.fillStyle = alpha(c, 0.07); g.fill(); g.strokeStyle = alpha(c, 0.8); g.lineWidth = 5; g.setLineDash([]); g.stroke();
  // border (south-east edge) in coral, dashed
  g.save(); g.setLineDash([22, 14]); g.strokeStyle = alpha(ui.accent, 0.9 * (o.border ?? 0.4)); g.lineWidth = 7; g.beginPath(); [[0.32, 0.86], [0.5, 0.95], [0.72, 0.9], [0.88, 0.7]].forEach((p, i) => { const [x, y] = P(p); i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); g.restore();
  // cities
  CITIES.forEach((p, i) => { const [x, y] = P(p); circle(g, x, y, 9, alpha(c, 0.8)); });
  // fires popping on each city
  if (o.fires) CITIES.forEach((p, i) => { const k = ease.outBack(prog(o.fires, i / CITIES.length, i / CITIES.length + 0.15)); if (k <= 0) return; const [x, y] = P(p); glow(g, x, y, 90 * k, FIRE(), 0.6); fire(g, x, y + 10, 34 * k, 60 * k, t + i, { seed: i + 1, a: 0.9 }); });
  // labels
  const lab = (p, s, col, a = 1, dy = -44) => { const [x, y] = P(p); text(g, s, x, y + dy, { size: V(38, 42), color: col, font: FONTS.ui, weight: 900, spacing: 3, alpha: a, stroke: 8, strokeColor: 'rgba(5,10,20,.8)' }); };
  if (o.labels !== false) lab(MAPPTS.gravia, 'GRÂVIA', ui.cream, o.gravia ?? 1);
  if (o.kolvar) { const [x, y] = P(MAPPTS.kolvar); const k = ease.outBack(clamp(o.kolvar)); g.save(); g.translate(x, y); g.scale(k, k); circle(g, 0, -50, 26, ui.gold); poly(g, [[-20, -36], [20, -36], [0, 0]], ui.gold); circle(g, 0, -50, 10, ui.bpBg); g.restore(); lab(MAPPTS.kolvar, 'KOLVAR', ui.gold, clamp(o.kolvar * 2), 40); }
  if (o.borderLabel) lab(MAPPTS.border, 'FRONTEIRA', ui.accent, o.borderLabel, 50);
  return P;
}
// dashed route drawn progressively between points
export function route(g, P, pts, k, col, w = 8) {
  if (k <= 0) return; const seg2 = pts.map(P); let total = 0; const L = []; for (let i = 1; i < seg2.length; i++) { const d = Math.hypot(seg2[i][0] - seg2[i - 1][0], seg2[i][1] - seg2[i - 1][1]); L.push(d); total += d; }
  let rem = total * clamp(k); g.save(); g.setLineDash([18, 12]); g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(...seg2[0]);
  let end = seg2[0];
  for (let i = 1; i < seg2.length && rem > 0; i++) { const f = Math.min(1, rem / L[i - 1]); end = [lerp(seg2[i - 1][0], seg2[i][0], f), lerp(seg2[i - 1][1], seg2[i][1], f)]; g.lineTo(...end); rem -= L[i - 1]; }
  g.stroke(); g.restore(); glow(g, end[0], end[1], 60, col, 0.6); circle(g, end[0], end[1], 10, col);
}
