// sets/room.js — "o salão branco": cold pale trapdoor floor, tall dark walls, ceiling light strips,
// round wall speakers (the Voice) and a giant red digital clock. Reusable by every room shot.
import { E, V, S, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, lerp, clamp, text, FONTS, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const roomGround = () => E.H * V(0.8, 0.68);
export const wallBase = () => roomGround() - V(150, 230);
export const ALARM = () => S().ui.accent;

// ---- perspective floor grid ----
const COLS = 7, ROWS = 9;
function floorGeom() {
  const WB = wallBase(), Yb = E.H + V(500, 700), VPx = E.W / 2;
  const Wfar = V(2200, 1500), Wnear = V(6200, 4400);
  const rowY = (k) => WB + (Yb - WB) * Math.pow(k / ROWS, 1.7);
  const colX = (j, y) => { const d = (y - WB) / (Yb - WB); const w = lerp(Wfar, Wnear, d); return VPx + (j / COLS - 0.5) * w; };
  return { WB, Yb, rowY, colX };
}
export function tileQuad(j, k) {
  const { rowY, colX } = floorGeom(); const y0 = rowY(k), y1 = rowY(k + 1);
  return [[colX(j, y0), y0], [colX(j + 1, y0), y0], [colX(j + 1, y1), y1], [colX(j, y1), y1]];
}
export const tileCenter = (j, k) => { const q = tileQuad(j, k); return [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[2][1]) / 2]; };
// a trapdoor opening: open 0..1 (grows from the centre), red glow from the pit
export function hole(g, q, open, t = 0) {
  if (open <= 0) return;
  const c = [(q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4, (q[0][1] + q[2][1]) / 2];
  const p = q.map(([x, y]) => [lerp(c[0], x, open), lerp(c[1], y, open)]);
  poly(g, p, '#030305');
  const h = p[2][1] - p[0][1], w = p[1][0] - p[0][0];
  g.save(); g.beginPath(); g.moveTo(...p[0]); p.slice(1).forEach(pt => g.lineTo(...pt)); g.closePath(); g.clip();
  glow(g, c[0], p[0][1] + h * 0.15, Math.max(w, h) * 0.9, ALARM(), 0.35 + 0.1 * Math.sin(t * 6));
  g.restore();
  seg(g, [p[0], p[1]], 3, alpha(shade(mood('interiorCool').key, -0.2), 0.6));
  // the dropped flap hanging into the pit
  if (open > 0.3) { const f = clamp((open - 0.3) / 0.7); poly(g, [p[3], p[2], [lerp(p[2][0], c[0], 0.15), lerp(p[2][1], p[0][1], f * 0.9)], [lerp(p[3][0], c[0], 0.15), lerp(p[3][1], p[0][1], f * 0.9)]], alpha('#9aa3b8', 0.25)); }
}

// ---- wall props ----
export function speaker(g, x, y, r, o = {}) {
  const M = mood('interiorCool'), t = o.t || 0;
  circle(g, x, y, r * 1.18, shade(M.wall, -0.55));
  circle(g, x, y, r, '#0c0d16'); ring(g, x, y, r, r * 0.08, shade(M.wall, 0.15));
  const rr0 = rng(7); for (let i = 0; i < 40; i++) { const a = rr0() * 6.28, d = Math.sqrt(rr0()) * r * 0.8; circle(g, x + Math.cos(a) * d, y + Math.sin(a) * d, r * 0.035, alpha(M.key, 0.25)); }
  circle(g, x, y, r * 0.28, shade(M.wall, -0.2));
  if (o.led !== false) { circle(g, x + r * 0.9, y - r * 0.9, r * 0.07, o.ledColor || ALARM()); glow(g, x + r * 0.9, y - r * 0.9, r * 0.3, o.ledColor || ALARM(), 0.6); }
  if (o.voice) { const a = o.voice; FX.rings(g, x, y, t, { count: 4, r0: r * 1.2, r1: r * (o.reach || 4), speed: 0.7, color: o.ringColor || M.key, a: 0.45 * a, w: 3 }); glow(g, x, y, r * 2.2, o.ringColor || M.key, 0.25 * a); }
}
// giant digital clock "10:00"
export function wallClock(g, x, y, w, str, o = {}) {
  const h = w * 0.42, on = o.on ?? 1, col = o.color || ALARM();
  rr(g, x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32, 18); g.fillStyle = '#07070b'; g.fill();
  rr(g, x - w / 2, y - h / 2, w, h, 10); g.fillStyle = '#120608'; g.fill();
  if (on > 0) {
    text(g, '88:88', x, y + h * 0.04, { size: h * 0.8, color: alpha(col, 0.08), font: FONTS.ui, weight: 900 });
    text(g, str, x, y + h * 0.04, { size: h * 0.8, color: col, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(col, 0.9), alpha: on });
    glow(g, x, y, w * 1.1, col, 0.22 * on);
  }
}
// ceiling light strip with a cold cone
function ceilingLight(g, x, y, w, M, a = 1) {
  rr(g, x - w / 2, y - 10, w, 20, 10); g.fillStyle = mix(M.key, '#ffffff', 0.6); g.fill();
  glow(g, x, y, w * 0.8, M.key, 0.35 * a);
  FX.lightCone(g, x, y, { angle: Math.PI / 2, spread: 0.55, len: V(1300, 1700), color: M.key, a: 0.09 * a });
}

// ---- the set ----
// o: { holes:[[j,k,open]], clock:'10:00', clockOn, speakers:true, voice:0..1, lights:1, mood }
export function room(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorCool'), GY = roomGround(), CX = E.W / 2, WB = wallBase();
  const wall = shade(M.wall, -0.35), wallDark = shade(M.wall, -0.65), L = o.lights ?? 1;
  layer(g, cam, 0.4, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, WB, [shade(M.dark, -0.4), wallDark, wall]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, WB + E.H + 4);
    for (let x = -E.W; x < E.W * 2.5; x += V(240, 220)) { g.fillStyle = alpha(shade(M.wall, -0.8), 0.6); g.fillRect(x, -E.H, 5, WB + E.H); g.fillStyle = alpha(M.key, 0.04); g.fillRect(x + 5, -E.H, 2, WB + E.H); }
    g.fillStyle = alpha(M.key, 0.08); g.fillRect(-E.W, WB - 40, E.W * 4, 6);
    for (const dx of [-1, 0, 1]) ceilingLight(g, CX + dx * V(700, 520), V(70, 110), V(360, 300), M, L);
    if (o.speakers !== false) for (const dx of [-1, 1]) speaker(g, CX + dx * V(560, 330), WB - V(520, 640), V(60, 62), { t: t + dx, voice: o.voice || 0, ringColor: o.ringColor });
    if (o.clock) wallClock(g, CX, WB - V(760, 760), V(420, 460), o.clock, { on: o.clockOn ?? 1 });
    if (o.door) { const dw = V(200, 190), dh = V(380, 420), dop = o.door; g.fillStyle = '#05050a'; g.fillRect(CX - dw / 2, WB - dh, dw, dh); g.fillStyle = mix(M.key, '#ffffff', 0.7); g.fillRect(CX - dw / 2, WB - dh, dw * dop, dh); glow(g, CX, WB - dh / 2, dh * 1.3, M.key, 0.5 * dop); FX.godRays(g, CX, WB - dh * 0.5, { count: 9, angle: Math.PI / 2, spread: 1.2, len: 1400, color: M.key, a: 0.08 * dop, t }); }
  });
  layer(g, cam, 0.85, (g) => {
    const { rowY, colX, Yb } = floorGeom();
    const fl = mix(M.floor, '#dfe5f2', 0.55);
    g.fillStyle = linGrad(g, 0, WB, 0, Yb, [shade(fl, -0.55), shade(fl, -0.3), shade(fl, -0.15)]); g.fillRect(-E.W * 1.5, WB, E.W * 4, Yb - WB + E.H);
    for (const dx of [-1, 0, 1]) FX.pool(g, CX + dx * V(700, 520), GY + V(20, 60), V(520, 460), V(110, 150), mix(M.key, '#ffffff', 0.4), 0.22 * L);
    g.strokeStyle = alpha(shade(M.dark, -0.3), 0.55); g.lineWidth = 3;
    for (let k = 0; k <= ROWS; k++) { const y = rowY(k); g.beginPath(); g.moveTo(-E.W * 1.5, y); g.lineTo(E.W * 2.5, y); g.stroke(); }
    for (let j = -COLS; j <= COLS * 2; j++) { g.beginPath(); g.moveTo(colX(j, WB), WB); g.lineTo(colX(j, Yb), Yb); g.stroke(); }
    g.strokeStyle = alpha('#ffffff', 0.05); g.lineWidth = 1.5;
    for (let k = 0; k <= ROWS; k++) { const y = rowY(k) + 3; g.beginPath(); g.moveTo(-E.W * 1.5, y); g.lineTo(E.W * 2.5, y); g.stroke(); }
    for (const [j, k, op] of o.holes || []) hole(g, tileQuad(j, k), op, t);
    FX.fog(g, WB - 40, V(160, 220), M.fog, 0.25);
  });
  return { GY, CX, M, WB };
}

// generic background player (no colour item) standing somewhere on the floor; depth d 0..1 (0 far, 1 at GY)
export function depthY(d) { const WB = wallBase(), GY = roomGround(); return lerp(WB + V(20, 40), GY, d); }
export function depthS(d, s1 = 1) { return s1 * lerp(0.45, 1, d); }
