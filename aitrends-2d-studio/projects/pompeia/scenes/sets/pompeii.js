// sets/pompeii.js — Pompeii street with Vesuvius (phases), the bakery, the dig site, the plume and pumice rain.
import { E, V, S, mood, layer, blurLayer, veil, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, lerp, clamp, ease, prog, text, FONTS, rng, noise } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const groundY = () => E.H * V(0.8, 0.68);
export const wallBase = () => groundY() - V(150, 230);
const TERRA = (M) => mix(M.wall, '#b0503a', 0.45);   // Pompeian red, toned by the mood

// ---- the mountain + plume ----
export function vesuvius(g, cx, baseY, w, h, M, o = {}) {
  const top = baseY - h, c = shade(M.dark, o.lit ? 0.08 : -0.05);
  g.fillStyle = linGrad(g, 0, top, 0, baseY, [shade(c, 0.12), c]);
  g.beginPath(); g.moveTo(cx - w * 0.75, baseY); g.quadraticCurveTo(cx - w * 0.35, top + h * 0.25, cx - w * 0.14, top + h * 0.02);
  g.lineTo(cx - w * 0.04, top + h * 0.08); g.lineTo(cx + w * 0.06, top); g.quadraticCurveTo(cx + w * 0.35, top + h * 0.3, cx + w * 0.8, baseY); g.closePath(); g.fill();
  if (o.green) { g.fillStyle = alpha(M.grass, 0.45); g.beginPath(); g.moveTo(cx - w * 0.75, baseY); g.quadraticCurveTo(cx - w * 0.3, top + h * 0.5, cx, top + h * 0.45); g.quadraticCurveTo(cx + w * 0.35, top + h * 0.55, cx + w * 0.8, baseY); g.closePath(); g.fill(); }
  g.strokeStyle = alpha(M.rim, 0.25); g.lineWidth = 4; g.beginPath(); g.moveTo(cx - w * 0.14, top + h * 0.02); g.quadraticCurveTo(cx - w * 0.35, top + h * 0.25, cx - w * 0.75, baseY); g.stroke();
  if (o.glow) glow(g, cx, top + h * 0.05, w * 0.25, S().ui.accent, 0.5 * o.glow);
  return { craterX: cx, craterY: top + h * 0.04 };
}
// pine-shaped eruption column. grow 0..1
export function plume(g, x, y, scale, grow, M, t, o = {}) {
  if (grow <= 0) return;
  const H = scale * 1.6 * ease.out(clamp(grow * 1.3)), capR = scale * 0.55 * ease.out(clamp((grow - 0.3) / 0.7)), ash = shade(M.fog, -0.35), lit = mix(M.key, '#ffffff', 0.2);
  const r = rng(o.seed ?? 4);
  // trunk
  for (let i = 0; i < 26; i++) { const u = i / 25, yy = y - u * H, rad = scale * (0.05 + 0.1 * u) * (0.9 + 0.2 * noise(t * 0.8 + i, 3));
    circle(g, x + noise(u * 3 + t * 0.3, 7) * scale * 0.04, yy, rad, mix(ash, M.dark, 0.2 + 0.4 * (1 - u))); }
  // umbrella cap
  if (capR > 0) for (let i = 0; i < 34; i++) { const a = r() * Math.PI * 2, d = Math.sqrt(r()), cx = x + Math.cos(a) * capR * 1.4 * d, cy = y - H - scale * 0.05 + Math.sin(a) * capR * 0.45 * d, rad = capR * (0.25 + r() * 0.3) * (1 + 0.05 * Math.sin(t + i));
    circle(g, cx, cy, rad, mix(ash, M.dark, 0.25 + 0.3 * r())); }
  // lit rim on the sun side + glow at the vent
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x - capR * 0.6, y - H - capR * 0.2, capR * 1.2, lit, 0.08); g.restore();
  glow(g, x, y, scale * 0.25, S().ui.accent, 0.6 * (o.vent ?? 1));
  if (o.lightning && Math.sin(t * 7.3) > 0.97) FX.lightning(g, { x1: x + capR * 0.3, y1: y - H, x2: x + capR * 0.6, y2: y - H * 0.5, color: '#ffffff' });
}
// falling pumice stones
export function pumice(g, t, o = {}) {
  const { count = 120, seed = 6, speed = 900, size = 9, a = 0.85, area = [-100, -200, E.W + 200, E.H + 200], color } = o;
  const r = rng(seed), col = color || mix(mood('storm').fog, '#d8d0c8', 0.4);
  for (let i = 0; i < count; i++) { const x0 = area[0] + r() * area[2], sp = speed * (0.6 + r() * 0.8), rad = size * (0.4 + r());
    const y = area[1] + ((r() * area[3] + t * sp) % area[3]), x = x0 + (y - area[1]) * 0.12;
    seg(g, [[x - 4, y - rad * 3], [x, y]], rad * 0.6, alpha(col, a * 0.25)); circle(g, x, y, rad, alpha(col, a)); circle(g, x - rad * 0.3, y - rad * 0.3, rad * 0.35, alpha('#ffffff', 0.3 * a)); }
}

// ---- street ----
// o: { phase: 'day'|'erupt'|'ash'|'night'|'dawn', plume 0..1, sun 0..1, ash 0..1 (ground cover), rain (pumice), roof (collapse 0..1), green }
export function street(g, t, cam, o = {}) {
  const ph = o.phase || 'day', MS = { day: 'golden', erupt: 'dusk', ash: 'storm', night: 'night', dawn: 'storm' }, M = mood(MS[ph]);
  const GY = groundY(), CX = E.W / 2, WB = wallBase(), dark = { day: 0, erupt: 0.1, ash: 0.45, night: 0.55, dawn: 0.35 }[ph];
  layer(g, cam, 0.12, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, ph === 'dawn' ? [shade(M.dark, -0.4), shade(M.wall, -0.2), mix(M.wall, '#a04030', 0.4)] : M.sky); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H);
    if (ph === 'night') FX.stars(g, t, { area: [-E.W, -E.H * 0.5, E.W * 3, E.H * 0.6], count: 40, seed: 2 });
    const sv = o.sun ?? (ph === 'day' || ph === 'erupt' ? 1 : 0);
    if (sv > 0) FX.sun(g, CX - V(500, 300), V(160, 260), V(60, 70), '#fff3dc', M.key, 4 * sv + 0.01);
    const mx = CX + V(160, 100), mb = WB - V(80, 380), mw = V(1500, 1150), mh = V(520, 270);
    const { craterX, craterY } = vesuvius(g, mx, mb, mw, mh, M, { green: o.green ?? ph === 'day', glow: ph !== 'day' && !o.green ? 0.6 : 0 });
    plume(g, craterX, craterY, V(520, 250), o.plume ?? (ph === 'day' ? 0 : 1), M, t, { lightning: ph === 'ash' || ph === 'night' });
    if (dark > 0) { g.fillStyle = alpha(shade(M.dark, -0.5), dark); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H); }
  });
  // far roofs of the city
  layer(g, cam, 0.4, (g) => {
    const r = rng(12); let x = -E.W; const by = WB - V(40, 300);
    while (x < E.W * 2.2) { const w = 120 + r() * 160, h = 70 + r() * 120; g.fillStyle = shade(TERRA(M), -0.55 - dark * 0.3); g.fillRect(x, by - h, w, h + 80);
      poly(g, [[x - 10, by - h], [x + w / 2, by - h - 40], [x + w + 10, by - h]], shade('#8a3a2a', -0.45 - dark * 0.4)); x += w + r() * 20; }
    FX.fog(g, by - 140, 200, M.fog, 0.25 + dark * 0.3);
  });
  // the street: two-storey houses + a colonnade
  layer(g, cam, 0.65, (g) => {
    const wall = shade(TERRA(M), -0.25 - dark * 0.5), top = WB - V(560, 430);
    g.fillStyle = linGrad(g, 0, top, 0, WB, [shade(wall, -0.2), wall]); g.fillRect(-E.W * 1.5, top, E.W * 4, WB - top + 4);
    g.fillStyle = shade(wall, -0.35); g.fillRect(-E.W * 1.5, WB - V(150, 180), E.W * 4, V(150, 180));        // dado band
    // roof edge + tiles (collapsing roof option at centre)
    const rc = o.roof ?? 0;
    for (let x = -E.W; x < E.W * 2.2; x += 60) { const mid = Math.abs(x + 30 - CX) < V(260, 240), sag = mid ? ease.in(rc) * V(260, 320) * Math.sin((x + 30 - CX + V(260, 240)) / (V(520, 480)) * Math.PI) : 0;
      if (mid && rc > 0.85) continue; poly(g, [[x, top + sag], [x + 64, top + sag], [x + 64, top - 46 + sag], [x, top - 40 + sag]], shade('#8a3a2a', -0.25 - dark * 0.5)); }
    // doors / shop openings with warm interiors
    for (let i = -2; i <= 3; i++) { const dx = CX + i * V(520, 430) - V(80, 60), dw = V(170, 160), dh = V(330, 360), lit = ph === 'day' || ph === 'erupt' ? 0.4 : 0.25 * (o.windows ?? 1);
      rr(g, dx, WB - dh, dw, dh, dw / 2); g.fillStyle = shade(M.dark, -0.5); g.fill();
      if (lit > 0) { g.save(); rr(g, dx, WB - dh, dw, dh, dw / 2); g.clip(); g.fillStyle = alpha(M.practical, lit); g.fillRect(dx, WB - dh, dw, dh); g.restore(); glow(g, dx + dw / 2, WB - dh / 2, dh * 0.7, M.practical, lit * 0.5); }
      FX.windowFrame && rr(g, dx + V(260, 220), WB - V(470, 400), 70, 90, 6); g.fillStyle = shade(M.dark, -0.4); g.fill(); }
    // columns in front of the wall
    for (let x = -E.W; x < E.W * 2.2; x += V(260, 240)) { const cw = V(46, 44);
      g.fillStyle = shade(mix(M.wall, '#e8dcc8', 0.5), -0.3 - dark * 0.5); g.fillRect(x, top + 30, cw, WB - top - 30);
      g.fillStyle = alpha(M.rim, 0.18 * (1 - dark)); g.fillRect(x, top + 30, 6, WB - top - 30);
      g.fillStyle = shade(M.dark, -0.2); g.fillRect(x - 10, top + 20, cw + 20, 18); g.fillRect(x - 8, WB - 16, cw + 16, 16); }
    if (rc > 0.85) { const k = prog(rc, 0.85, 1); for (let i = 0; i < 9; i++) circle(g, CX - V(240, 220) + i * V(60, 55), top + V(200, 240) + (i % 3) * 40 + k * 60, 50 + (i % 2) * 30, alpha(M.fog, 0.5 * (1 - k * 0.5))); }
  });
  // paving with stepping stones + ash cover
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, WB, 0, E.H * 1.4, [shade(M.road, -0.4 - dark * 0.3), shade(M.road, -0.15 - dark * 0.3)]); g.fillRect(-E.W * 1.5, WB, E.W * 4, E.H * 2);
    g.fillStyle = shade(M.floor, 0.05 - dark * 0.3); g.fillRect(-E.W * 1.5, WB, E.W * 4, 30);  // sidewalk kerb
    FX.floorLines(g, WB + 30, E.H * 1.6, alpha('#000', 0.22), 0.1);
    const sy = GY + V(70, 120); for (let i = -1; i <= 1; i++) { g.fillStyle = shade(M.floor, 0.12 - dark * 0.3); g.beginPath(); g.ellipse(CX + i * V(170, 150), sy, V(70, 60), V(26, 30), 0, 0, Math.PI * 2); g.fill(); }
    const ash = o.ash ?? 0; if (ash > 0) { g.fillStyle = alpha(mix(M.fog, '#9a9490', 0.5), 0.6 + 0.35 * ash); g.fillRect(-E.W * 1.5, GY - V(120, 160) * ash, E.W * 4, E.H * 2); for (let i = 0; i < 40; i++) { const r = rng(i); circle(g, -200 + r() * (E.W + 400), GY - V(120, 160) * ash + r() * 40, 6 + r() * 10, alpha('#c8c0b8', 0.5)); } }
  });
  return { GY, CX, M, WB, dark };
}

// ---- bakery ----
export const BAK = () => { const CX = E.W / 2, GY = groundY(); return { CX, GY, ovenX: CX + V(380, 250), ovenY: GY - V(20, 30), ovenR: V(300, 260), millX: CX - V(520, 360), doorX: CX - V(170, 160) }; };
export function oven(g, x, baseY, R, M, t, fire = 1, o = {}) {
  const brick = shade(mix(M.wall, '#a04a32', 0.4), -0.25);
  g.fillStyle = shade(brick, -0.3); g.fillRect(x - R * 1.15, baseY - R * 0.55, R * 2.3, R * 0.55);      // base platform
  g.fillStyle = brick; g.beginPath(); g.ellipse(x, baseY - R * 0.55, R * 1.05, R * 0.95, 0, Math.PI, 0); g.fill();   // dome
  g.strokeStyle = alpha('#000', 0.25); g.lineWidth = 3; for (let k = 1; k < 5; k++) { g.beginPath(); g.ellipse(x, baseY - R * 0.55, R * 1.05, R * 0.95 * k / 5, 0, Math.PI, 0); g.stroke(); }
  const mw = R * 0.62, mh = R * 0.5, my = baseY - R * 0.55;
  g.beginPath(); g.moveTo(x - mw / 2, my); g.lineTo(x - mw / 2, my - mh * 0.55); g.arc(x, my - mh * 0.55, mw / 2, Math.PI, 0); g.lineTo(x + mw / 2, my); g.closePath();
  g.fillStyle = fire > 0 ? '#120806' : shade(brick, -0.6); g.fill();
  if (fire > 0) { g.save(); g.clip(); const f = 0.85 + 0.15 * Math.sin(t * 9) * Math.sin(t * 5.3);
    g.fillStyle = radGrad(g, x, my, 0, mw, [alpha('#ffe7a0', fire * f), alpha(M.practical, 0.9 * fire), alpha('#a02a10', 0.6 * fire)]); g.fillRect(x - mw, my - mh * 1.2, mw * 2, mh * 1.3); g.restore();
    glow(g, x, my - mh * 0.3, R * 1.6, M.practical, 0.55 * fire * f); }
  if (o.loaves) for (let i = -1; i <= 1; i++) loaf(g, x + i * mw * 0.28, my - 6, mw * 0.12, o.charred ? 1 : 0, M);
  return { mouthY: my, mw, mh };
}
// Pompeian round loaf with 8 segments; charred 0..1
export function loaf(g, x, y, r, charred, M) {
  const c = mix(mix('#d89a50', M.practical, 0.2), '#1a1210', charred);
  g.fillStyle = c; g.beginPath(); g.ellipse(x, y - r * 0.45, r, r * 0.55, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = alpha(charred > 0.5 ? '#000' : shade(c, -0.4), 0.7); g.lineWidth = Math.max(1.5, r * 0.08);
  for (let k = 0; k < 4; k++) { const a = k / 4 * Math.PI; g.beginPath(); g.moveTo(x - Math.cos(a) * r * 0.9, y - r * 0.45 - Math.sin(a) * r * 0.5); g.lineTo(x + Math.cos(a) * r * 0.9, y - r * 0.45 + Math.sin(a) * r * 0.5); g.stroke(); }
  g.fillStyle = alpha('#ffffff', charred > 0.5 ? 0.06 : 0.18); g.beginPath(); g.ellipse(x - r * 0.3, y - r * 0.7, r * 0.35, r * 0.15, -0.3, 0, Math.PI * 2); g.fill();
}
function millstone(g, x, y, s, M) { const c = shade(mix(M.wall, '#6a6460', 0.6), -0.3); poly(g, [[x - 60 * s, y], [x + 60 * s, y], [x + 20 * s, y - 90 * s], [x - 20 * s, y - 90 * s]], shade(c, -0.15)); poly(g, [[x - 20 * s, y - 90 * s], [x + 20 * s, y - 90 * s], [x + 62 * s, y - 190 * s], [x - 62 * s, y - 190 * s]], c); g.fillStyle = alpha(M.rim, 0.25); g.fillRect(x + 50 * s, y - 188 * s, 6 * s, 96 * s); }
// o: { fire, door (0 open .. 1 closed+barred), outside: 'day'|'ash', shake }
export function bakery(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), B = BAK(), { CX, GY } = B, WB = wallBase(), fire = o.fire ?? 1;
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, WB, [shade(M.dark, -0.5), shade(M.wall, -0.5), shade(M.wall, -0.3)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, WB + E.H + 4);
    g.fillStyle = shade(M.wall, -0.55); g.fillRect(-E.W * 1.5, WB - V(200, 240), E.W * 4, V(200, 240));
    // arched door to the street
    const dx = B.doorX, dw = V(300, 260), dh = V(560, 620), out = o.outside || 'day', OM = mood(out === 'day' ? 'golden' : 'storm');
    g.save(); g.beginPath(); g.moveTo(dx - dw / 2, WB); g.lineTo(dx - dw / 2, WB - dh + dw / 2); g.arc(dx, WB - dh + dw / 2, dw / 2, Math.PI, 0); g.lineTo(dx + dw / 2, WB); g.closePath(); g.clip();
    g.fillStyle = linGrad(g, 0, WB - dh, 0, WB, OM.sky); g.fillRect(dx - dw, WB - dh, dw * 2, dh);
    if (out === 'day') vesuvius(g, dx + 40, WB - 40, dw * 2.2, dh * 0.5, OM, { green: true });
    else { veil(g, '#000', 0.3); pumice(g, t, { count: 30, area: [dx - dw / 2, WB - dh, dw, dh], size: 6 }); }
    if (o.door) { g.fillStyle = shade(M.dark, -0.2); g.fillRect(dx - dw / 2, WB - dh, dw * o.door, dh); for (let k = 0; k < 4; k++) g.fillRect(dx - dw / 2, WB - dh + k * dh / 4, dw * o.door, 6); }
    g.restore();
    if (o.door > 0.95) seg(g, [[dx - dw * 0.6, WB - dh * 0.45], [dx + dw * 0.6, WB - dh * 0.45]], 22, shade('#6a4332', -0.3));
    // shelves with loaves
    const sx = CX + V(80, 40), sy = WB - V(560, 640);
    for (let k = 0; k < 2; k++) { g.fillStyle = shade(M.dark, -0.3); g.fillRect(sx - 160, sy + k * 140, 320, 14); for (let i = 0; i < 4; i++) loaf(g, sx - 120 + i * 80, sy + k * 140, 30, 0, M); }
    g.fillStyle = alpha('#000', 0.3); g.fillRect(-E.W, WB - 10, E.W * 4, 10);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, WB, 0, E.H * 1.4, [shade(M.floor, -0.5), shade(M.floor, -0.25)]); g.fillRect(-E.W * 1.5, WB, E.W * 4, E.H * 2);
    FX.floorLines(g, WB, E.H * 1.6, alpha('#000', 0.25), 0.09);
    FX.pool(g, B.ovenX - V(100, 80), GY + 30, V(700, 600), V(140, 170), M.practical, 0.35 * fire);
  });
  layer(g, cam, 0.92, (g) => {
    millstone(g, B.millX, GY, V(1.5, 1.3), M);
    oven(g, B.ovenX, B.ovenY, B.ovenR, M, t, fire, { loaves: o.loaves });
    // flour sacks
    for (const [dx, s] of [[-V(250, 170), 1], [-V(150, 90), 0.85]]) { const x = CX + dx; g.fillStyle = mix('#d8ccb4', M.key, 0.25); g.beginPath(); g.moveTo(x - 60 * s, GY); g.quadraticCurveTo(x - 70 * s, GY - 120 * s, x - 30 * s, GY - 150 * s); g.lineTo(x + 30 * s, GY - 150 * s); g.quadraticCurveTo(x + 70 * s, GY - 120 * s, x + 60 * s, GY); g.closePath(); g.fill(); g.fillStyle = alpha('#000', 0.2); g.fillRect(x - 60 * s, GY - 40 * s, 120 * s, 6); }
  });
  return { GY, CX, M, WB, B };
}

// ---- dig site (modern, golden day) ----
export function digsite(g, t, cam, o = {}) {
  const M = mood('golden'), GY = groundY(), CX = E.W / 2, WB = wallBase();
  layer(g, cam, 0.15, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, GY, M.sky); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, GY + E.H);
    FX.sun(g, CX - V(400, 300), V(240, 560), V(70, 80), '#fff6e0', M.key, 5);
    vesuvius(g, CX + V(300, 220), WB - V(140, 200), V(1300, 1000), V(380, 460), M, { green: true });
    FX.clouds(g, { y: V(120, 200), color: '#fff3dc', a: 0.12 });
  });
  layer(g, cam, 0.6, (g) => {
    const wall = shade(mix(M.wall, '#b0503a', 0.35), -0.15), r = rng(3);
    for (let i = -3; i <= 4; i++) { const x = CX + i * V(330, 300), w = V(260, 240), h = V(260, 320) + r() * 160;
      g.fillStyle = wall; g.beginPath(); g.moveTo(x, WB); g.lineTo(x, WB - h); for (let k = 0; k <= 6; k++) g.lineTo(x + k * w / 6, WB - h + (k % 2 ? 30 : -10) + r() * 30); g.lineTo(x + w, WB); g.closePath(); g.fill();
      g.fillStyle = alpha(M.rim, 0.15); g.fillRect(x, WB - h, 6, h); }
    FX.godRays(g, CX - V(400, 300), V(240, 560), { count: 8, angle: 1.1, spread: 0.7, len: V(2000, 2200), color: M.key, a: 0.08, t });
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, WB, 0, E.H * 1.4, [shade(mix(M.floor, '#9a7a5a', 0.4), -0.2), shade(M.floor, -0.2)]); g.fillRect(-E.W * 1.5, WB, E.W * 4, E.H * 2);
    g.strokeStyle = alpha('#f2e6c8', 0.5); g.lineWidth = 2; for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(CX + i * 160, WB + 20); g.lineTo(CX + i * 420, E.H * 1.4); g.stroke(); }
    FX.pool(g, CX, GY + 40, V(800, 700), V(150, 180), M.key, 0.25);
  });
  return { GY, CX, M, WB };
}
