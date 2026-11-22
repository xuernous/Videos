// shots/01_open.js — s01–s14: cold open, the gamer, the grades, the dinner proposal.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, linGrad } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, dining, BED, DIN, groundY, controller, tvColor } from '../sets/home.js';
import { classroom, schoolDesk } from '../sets/school.js';
import { wt, rimOf, bgBlur, faceShot, boletim, testPaper, gameCase, stamp, PAPER, BAD, GOOD } from '../sets/kit.js';
import { KID, MOM } from '../cast.js';

// ---------- shared poses / helpers ----------
export const GAME_SIT = { ...POSES.sit, head: [8, -178], eF: [26, -116], hF: [44, -122], eB: [18, -116], hB: [38, -124] };
export const DESK_SLUMP = { ...POSES.sit, head: [34, -146], sh: [14, -140], eF: [40, -112], hF: [62, -122], eB: [30, -112], hB: [54, -124] };
export const EAT = { ...POSES.sit, eF: [24, -118], hF: [44, -140], eB: [16, -112], hB: [36, -100] };
export const SIT_TALK = { ...POSES.sit, eF: [26, -124], hF: [48, -146] };
export const SIT_FINGER = { ...POSES.sit, eF: [20, -160], hF: [26, -204] };
export const SIT_REACH = { ...POSES.sit, head: [12, -176], sh: [6, -144], eF: [40, -134], hF: [74, -128], eB: [30, -128], hB: [64, -124] };
// world position of a figure's front hand
export const hand = (o, which = 'hF') => { const p = o.pose, s = (o.s ?? 1) * (o.outfit?.kid ? 0.72 : 1), f = o.facing ?? 1; return [o.x + p[which][0] * s * f, o.y + p[which][1] * s]; };
// big arm entering an insert: sleeve capsule + ink hand with rim
export function arm(g, x0, y0, x1, y1, sleeve, M, w = 90) {
  const ink = S().ink;
  seg(g, [[x0, y0], [x1, y1]], w + 8, M.rim); seg(g, [[x0, y0], [x1, y1]], w, ink);
  const sx = lerp(x1, x0, 0.22), sy = lerp(y1, y0, 0.22);
  seg(g, [[x0, y0], [sx, sy]], w * 1.35 + 8, M.rim); seg(g, [[x0, y0], [sx, sy]], w * 1.35, sleeve);
  g.fillStyle = alpha('#000', 0.25); g.beginPath(); g.ellipse(sx, sy, w * 0.3, w * 0.66, Math.atan2(y1 - y0, x1 - x0), 0, Math.PI * 2); g.fill();
  rr(g, x1 - w * 0.55 - 4, y1 - w * 0.42 - 4, w * 1.1 + 8, w * 0.84 + 8, w * 0.4); g.fillStyle = M.rim; g.fill();
  rr(g, x1 - w * 0.55, y1 - w * 0.42, w * 1.1, w * 0.84, w * 0.38); g.fillStyle = ink; g.fill();
}
const zoomAt = (g, cx, cy, z, fn) => { g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); fn(); g.restore(); };
// the dining table surface seen close (for inserts)
export function tableClose(g, t, M, y) {
  g.fillStyle = linGrad(g, 0, y, 0, E.H, [shade(M.floor, 0.05), shade(M.floor, -0.35)]); g.fillRect(-E.W, y, E.W * 3, E.H * 2);
  g.fillStyle = alpha(M.key, 0.12); g.fillRect(-E.W, y, E.W * 3, 4);
  FX.pool(g, E.W / 2, y + V(160, 260), V(700, 620), V(160, 220), M.practical, 0.35);
  for (let i = 0; i < 6; i++) { g.fillStyle = alpha('#000', 0.08); g.fillRect(-E.W, y + 60 + i * i * 22, E.W * 3, 2); }
}

// s01 — "Sua mãe acabou de fazer"  the game case slides across the dinner table
registerShot('s01', { draw(g, t, info) {
  const M = mood('interiorWarm');
  bgBlur(g, t, 'dining', { z: 1.5, y: -V(150, 260), veil: 0.5 });
  const z = 1.02 + 0.05 * ease.inOut(t / info.dur);
  zoomAt(g, E.W / 2, E.H * 0.55, z, () => {
    const ty = E.H * V(0.62, 0.6); tableClose(g, t, M, ty);
    const k = ease.out(prog(t, 0.15, 1.2)), cx = lerp(E.W + V(500, 420), E.W / 2, k), cy = ty + V(30, 40);
    g.fillStyle = alpha('#000', 0.4); g.beginPath(); g.ellipse(cx, cy + V(230, 260) * 0.52, V(200, 220), 24, 0, 0, Math.PI * 2); g.fill();
    gameCase(g, cx, cy - V(40, 60), V(460, 520), { rot: -0.06 + 0.06 * k, glowA: 0.5 + 0.5 * k });
    const hx = cx + V(240, 240), hy = cy + V(80, 110);
    arm(g, E.W + 600, hy + 140, hx + 40 * (1 - k), hy, MOM.color, M, V(80, 90));
  });
  glow(g, E.W / 2, -60, E.W * 0.8, M.practical, 0.3);
  FX.dust(g, t, { count: 40, color: M.practical, a: 0.35 });
} });

// s02 — "a proposta mais perigosa da sua vida."  title card over the dinner
registerShot('s02', { draw(g, t, info) {
  const D = DIN(), cam = { z: 1.25 + 0.05 * t / info.dur, y: V(40, 120) };
  blurLayer(g, 6, (g) => {
    const { M, table } = dining(g, t, cam, { lamp: 0.8 });
    layer(g, cam, 1, (g) => {
      FX.chair(g, D.momX + 30, D.GY, 1.6, shade(M.dark, -0.5));
      drawFigure(g, { x: D.momX, y: D.GY, s: 1.6, facing: -1, outfit: MOM, pose: breathe(POSES.sit, t, 1, 3), expr: 'smirk', look: [-0.6, 0], rim: rimOf(M, [-0.7, -0.7]) });
      table(g);
    });
  });
  veil(g, '#07040a', 0.45);
  veil(g, S().ui.accent, 0.08 + 0.04 * Math.sin(t * 3), 'lighter');
  UI.titleCard(g, t, { lines: ['A PROPOSTA', 'MAIS PERIGOSA'], sub: 'DA SUA VIDA', dur: info.dur, y: E.H * 0.42 });
  FX.dust(g, t, { count: 50, color: '#ffd0b0', a: 0.35 });
} });

// kid gaming on the beanbag (s03, s51)
export function kidGaming(g, t, B, M, o = {}) {
  const f = { x: B.bagX - 10, y: B.GY - 42, s: o.s ?? 2.0, facing: 1, outfit: KID, pose: breathe(o.pose || GAME_SIT, t, 0.6, 2), expr: o.expr || 'determined', look: [1, -0.1], rim: { color: o.rimC || tvColor(), dir: [1, -0.3], w: 5 }, blink: o.blink ?? ((t % 3.4) > 3.3), shadow: false };
  drawFigure(g, f);
  if (o.pad !== false) { const [hx, hy] = hand(f); controller(g, hx + 6, hy + 4, 0.42, M, 1); }
  return f;
}
// s03 — "Você tem catorze anos e um talento raro:"
registerShot('s03', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12 + 0.08 * k, x: V(40, 60) - 30 * k, y: V(30, 60) };
  const { M, B } = bedroom(g, t, cam, { tv: 1, lamp: 0 });
  layer(g, cam, 1, (g) => kidGaming(g, t, B, M, { expr: t > wt('talento', info, 2) ? 'smirk' : 'determined' }));
  const a = prog(t, wt('catorze', info, 0.6), wt('catorze', info, 0.6) + 0.3);
  if (a > 0) { const s = ease.outBack(clamp(a)); g.save(); g.translate(E.W - V(90, 90), V(130, 280)); g.scale(s, s); text(g, '14', 0, 0, { size: V(110, 130), color: S().ui.gold, font: FONTS.ui, weight: 900, align: 'right', glow: 24, glowColor: alpha(S().ui.gold, 0.6) }); text(g, 'ANOS', 0, V(80, 95), { size: V(36, 42), color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'right', spacing: 6 }); g.restore(); }
  FX.dust(g, t, { count: 40, color: tvColor(), a: 0.3 });
} });

// s04 — "passar seis horas seguidas no"  over-the-shoulder at the TV, the moon races, 0H -> 6H
registerShot('s04', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.65 + 0.06 * k, x: V(260, 200), y: V(60, 120) };
  const mx = lerp(0.12, 0.9, prog(t, 0.2, info.dur));
  const { M, B } = bedroom(g, t, cam, { tv: 1, moonX: mx, moonY: 0.3 - 0.12 * Math.sin(mx * Math.PI) });
  blurLayer(g, 7, (g) => layer(g, { ...cam, x: cam.x * 0.7, y: cam.y - V(120, 260) }, 1.25, (g) => kidGaming(g, t, B, M, { s: 2.8 })));
  const p = ease.inOut(prog(t, wt('seis', info, 0.5), info.dur - 0.2)), hrs = Math.round(lerp(0, 6, p) * 10) / 10;
  const cx = E.W / 2, cy = V(200, 330), r = V(110, 120), ui = S().ui;
  ring(g, cx, cy, r, 10, alpha(ui.cream, 0.15));
  g.strokeStyle = ui.gold; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p); g.stroke();
  text(g, `${Math.floor(hrs)}H`, cx, cy + 6, { size: V(84, 92), color: ui.gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(ui.gold, 0.6) });
  FX.dust(g, t, { count: 30, color: tvColor(), a: 0.3 });
} });

// s05 — "videogame sem piscar."  wide unblinking eyes, TV flicker
registerShot('s05', { draw(g, t, info) {
  const TVC = tvColor(), fl = 0.5 + 0.5 * Math.sin(t * 13) * Math.sin(t * 5.3);
  faceShot(g, t, info, { who: KID, expr: 'surprised', look: [0.15, 0], rimSide: 1, rimColor: TVC, blink: false, push: 0.08, set: { tv: 1 },
    over: (g, cx, cy, r) => { for (const dx of [-0.32, 0.32]) { g.save(); g.globalCompositeOperation = 'lighter'; rr(g, cx + dx * r + r * 0.02, cy - r * 0.2, r * 0.07, r * 0.05, 3); g.fillStyle = alpha(TVC, 0.7); g.fill(); g.restore(); } } });
  veil(g, TVC, 0.05 + 0.07 * fl, 'lighter');
  const ui = S().ui, a = prog(t, wt('piscar', info, 1), wt('piscar', info, 1) + 0.25);
  if (a > 0) { text(g, 'PISCADAS', E.W / 2, V(130, 250), { size: V(34, 40), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: a }); text(g, '0', E.W / 2, V(210, 350), { size: V(110, 130), color: ui.gold, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(ui.gold, 0.6), alpha: a }); }
} });

// s06 — "Na escola, o talento é outro."  asleep on the desk
registerShot('s06', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.45 + 0.08 * k, x: -V(40, 60), y: V(60, 140) };
  const { M, GY, CX } = classroom(g, t, cam, { students: true });
  layer(g, cam, 1, (g) => {
    const x = CX - V(60, 90), s = 2.1, sn = Math.sin(t * 2.2) * 2;
    FX.chair(g, x - 10, GY, 1.5, shade(M.dark, -0.5));
    drawFigure(g, { x, y: GY, s, facing: 1, outfit: KID, pose: { ...DESK_SLUMP, head: [34, -146 + sn] }, expr: 'sleepy', rim: rimOf(M, [-1, -0.4]), blink: true });
    schoolDesk(g, x + V(95, 95), GY, 1.55, M);
    for (let i = 0; i < 3; i++) { const u = ((t * 0.5 + i / 3) % 1); text(g, 'Z', x + 90 + u * 120 + i * 10, GY - 330 - u * 200, { size: 40 + u * 30, color: S().ui.cream, font: FONTS.title, alpha: Math.sin(u * Math.PI) * 0.85 }); }
  });
  FX.dust(g, t, { count: 50, color: M.key, a: 0.35 });
} });

// s07 — "Português: quatro. História: três."
const ROWS = () => [{ label: 'PORTUGUÊS' }, { label: 'HISTÓRIA' }, { label: 'MATEMÁTICA' }];
registerShot('s07', { draw(g, t, info) {
  bgBlur(g, t, 'classroom', { z: 1.6, y: -V(200, 300), veil: 0.5 });
  const rows = ROWS(); rows[0].grade = '4'; rows[0].at = wt('quatro', info, 1.1); rows[1].grade = '3'; rows[1].at = wt('três', info, 2.9);
  const z = 1 + 0.05 * ease.inOut(t / info.dur), sh = t > rows[1].at ? shake(t, 6 * (1 - prog(t, rows[1].at, rows[1].at + 0.4)), 18) : t > rows[0].at ? shake(t, 6 * (1 - prog(t, rows[0].at, rows[0].at + 0.4)), 18) : [0, 0];
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => boletim(g, t, E.W / 2 + sh[0], E.H * 0.45 + sh[1], V(700, 820), rows, { focus: t < rows[1].at - 0.2 ? 0 : 1 }));
  FX.dust(g, t, { count: 30, color: '#ffe9d2', a: 0.25 });
} });
// s08 — "Matemática... dois."
registerShot('s08', { draw(g, t, info) {
  bgBlur(g, t, 'classroom', { z: 1.6, y: -V(200, 300), veil: 0.6 });
  const rows = ROWS(); rows[0].grade = '4'; rows[0].at = -5; rows[1].grade = '3'; rows[1].at = -5; rows[2].grade = '2'; rows[2].at = wt('dois', info, 1.5); rows[2].glow = true;
  const z = lerp(1.25, 1.75, ease.inOut(prog(t, 0, rows[2].at))), [sx, sy] = t > rows[2].at ? shake(t, 22 * (1 - prog(t, rows[2].at, rows[2].at + 0.6)), 20) : [0, 0];
  const W = V(700, 820), card = { x: E.W / 2 - W / 2, h: W * 1.25 }, rowY = E.H * 0.45 - card.h / 2 + card.h * 0.3 + 2.45 * card.h * 0.2;
  g.save(); g.translate(E.W / 2 + sx, E.H * 0.5 + sy); g.scale(z, z); g.translate(-E.W / 2 - V(60, 70), -rowY);
  boletim(g, t, E.W / 2, E.H * 0.45, W, rows, { focus: 2 }); g.restore();
  if (t > rows[2].at) veil(g, BAD(), 0.18 * (1 - prog(t, rows[2].at, rows[2].at + 0.7)), 'lighter');
  veil(g, '#000', 0.12 * prog(t, 0, rows[2].at));
} });
// s09 — "E o dois ainda veio com um bilhete da professora."
registerShot('s09', { draw(g, t, info) {
  bgBlur(g, t, 'classroom', { z: 1.6, y: -V(200, 300), veil: 0.55 });
  const z = 1.0 + 0.06 * ease.inOut(t / info.dur), tb = wt('bilhete', info, 1.9);
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => {
    const p = testPaper(g, t, E.W / 2 - V(40, 30), E.H * 0.48, V(640, 740), { marks: [0, 1, 2, 3, 4, 5].map(k => ({ k, at: -1, kind: k === 2 ? 'v' : 'x' })) });
    stamp(g, t, p.x + p.w * 0.8, p.y + p.h * 0.12, V(70, 80), '2', BAD(), -1, { glow: 10 });
    // the folded note, clipped top-right, opening on "bilhete"
    const op = ease.out(prog(t, tb - 0.3, tb + 0.4)), nx = p.x + p.w * 0.55, ny = p.y + p.h * 0.16, nw = V(300, 340), nh = V(220, 250);
    g.save(); g.translate(nx, ny); g.rotate(0.12 - 0.08 * op);
    g.fillStyle = alpha('#000', 0.3); rr(g, 14, 16, nw, nh * (0.5 + 0.5 * op), 6); g.fill();
    rr(g, 0, 0, nw, nh * (0.5 + 0.5 * op), 6); g.fillStyle = mix(PAPER(), '#fff8c8', 0.5); g.fill();
    if (op > 0.5) { const a = (op - 0.5) * 2; g.globalAlpha *= a;
      for (let i = 0; i < 3; i++) { g.strokeStyle = BAD(); g.lineWidth = 5; g.beginPath(); for (let k = 0; k <= 12; k++) { const xx = 24 + k * (nw - 120) / 12, yy = 50 + i * 46 + Math.sin(k * 2 + i) * 7; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
      text(g, '!!!', nw - 56, nh * 0.48, { size: V(70, 80), color: BAD(), font: FONTS.title, rotate: 0 }); }
    g.restore();
    rr(g, nx - 10, ny - 30, 26, 70, 10); g.strokeStyle = '#9aa0b0'; g.lineWidth = 6; g.stroke();
  });
  FX.dust(g, t, { count: 30, color: '#ffe9d2', a: 0.25 });
} });

// ---------- dinner ----------
export function dinner(g, t, info, o) {
  const D = DIN(), cam = o.cam;
  const { M, table } = dining(g, t, cam, { lamp: 1 });
  layer(g, cam, 1, (g) => {
    const s = o.s ?? 1.6, dk = shade(M.dark, -0.5);
    FX.chair(g, D.kidX - 30, D.GY, s * 0.95, dk); FX.chair(g, D.momX + 30, D.GY, s * 0.95, dk);
    drawFigure(g, { x: D.kidX, y: D.GY, s: s * 1.15, facing: 1, outfit: KID, pose: o.kidPose(t), expr: o.kidExpr(t), look: [1, -0.25], rim: rimOf(M, [0.7, -0.7]), blink: (t % 3.1) > 3.0 });
    drawFigure(g, { x: D.momX, y: D.GY, s, facing: -1, outfit: MOM, pose: o.momPose(t), expr: o.momExpr(t), talk: o.momTalk ? o.momTalk(t) : 0, look: [-1, 0.1], rim: rimOf(M, [-0.7, -0.7]), blink: (t % 3.7) > 3.6 });
    table(g, o.onTable);
  });
  FX.dust(g, t, { count: 40, color: M.practical, a: 0.3 });
  return { M, D };
}
// s10 — "Aí, no jantar, ela solta:"
registerShot('s10', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), ts = wt('solta', info, 1.6);
  dinner(g, t, info, { cam: { z: 1.0 + 0.1 * k, y: V(0, 40) },
    kidPose: (t) => breathe(posesAt(t, [[0, EAT], [0.9, POSES.sit], [1.3, EAT]]), t, 1, 1), kidExpr: () => 'neutral',
    momPose: (t) => breathe(posesAt(t, [[0, POSES.sit], [ts - 0.2, SIT_TALK]]), t, 1, 2), momExpr: (t) => (t > ts ? 'smirk' : 'neutral'), momTalk: () => talkAmount(info.globalT, 25.6, 27.4) * 0.6 });
} });
// s11 — "Quer o GTA 6?"
registerShot('s11', { draw(g, t, info) {
  const ui = S().ui;
  faceShot(g, t, info, { who: MOM, where: 'dining', expr: 'smirk', talk: talkAmount(info.globalT, 25.6, 27.44), look: [-0.2, 0.1], rimSide: -1, x: V(40, 40), push: 0.05,
    over: (g, cx, cy, r) => { if (talkAmount(info.globalT, 25.6, 27.44) > 0) FX.rings(g, cx - r * 0.1, cy + r * 0.45, t, { count: 2, r0: r * 0.3, r1: r * 0.8, color: '#fff1e6', a: 0.22 }); } });
  const k = ease.outBack(prog(t, wt('GTA', info, 0.9) - 0.1, wt('GTA', info, 0.9) + 0.35));
  if (k > 0) { g.save(); g.translate(E.W * 0.75, E.H * 0.2); g.scale(k, k); gameCase(g, 0, 0, V(300, 320), { rot: 0.12 }); g.restore(); }
} });
// s12 — "Eu compro. Quase quatrocentos e cinquenta reais."
registerShot('s12', { draw(g, t, info) {
  const M = mood('interiorWarm'), ui = S().ui;
  bgBlur(g, t, 'dining', { z: 1.5, y: -V(150, 260), veil: 0.5 });
  const z = 1.0 + 0.07 * ease.inOut(t / info.dur);
  zoomAt(g, E.W / 2, E.H * 0.5, z, () => {
    const ty = E.H * V(0.62, 0.6); tableClose(g, t, M, ty);
    gameCase(g, E.W / 2 - V(80, 60), ty - V(70, 90), V(500, 560), { rot: -0.05 });
    // price tag on a string
    const t0 = wt('quatrocentos', info, 1.1), t1 = wt('reais', info, 2.1), p = ease.out(prog(t, t0 - 0.3, t1)), sw = Math.sin(t * 2.4) * 0.06;
    const px = E.W / 2 - V(20, 40), py = ty - V(420, 520);
    seg(g, [[E.W / 2 + V(80, 70), ty - V(280, 330)], [px - 10, py]], 3, alpha(ui.cream, 0.7));
    g.save(); g.translate(px, py); g.rotate(-0.15 + sw);
    const tw = V(360, 330), th = V(170, 160);
    poly(g, [[0, 0], [40, -th / 2], [tw, -th / 2], [tw, th / 2], [40, th / 2]], ui.gold); circle(g, 26, 0, 9, '#2a2430');
    text(g, 'R$ ' + (lerp(0, 449.9, p)).toFixed(2).replace('.', ','), tw / 2 + 24, 6, { size: V(66, 66), color: '#2a2430', font: FONTS.ui, weight: 900 });
    g.restore();
    const qa = prog(t, t0 - 0.4, t0);
    if (qa > 0) text(g, 'QUASE', px + V(200, 190), py - V(130, 130), { size: V(40, 44), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: qa });
  });
  FX.dust(g, t, { count: 40, color: M.practical, a: 0.35 });
} });
// s13 — "Mas só se você fechar o ano com média sete."
registerShot('s13', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), tm = wt('Mas', info, 0.15), t7 = wt('sete', info, 2.34), ui = S().ui;
  const D = DIN();
  const { M } = dinner(g, t, info, { cam: { z: 1.45 + 0.06 * k, y: V(60, 160) },
    kidPose: (t) => breathe(posesAt(t, [[0, POSES.sit], [0.05, SIT_REACH], [tm + 0.5, POSES.sit]]), t, 1, 1), kidExpr: (t) => (t < tm + 0.4 ? 'joy' : t < t7 ? 'surprised' : 'worried'),
    momPose: (t) => breathe(posesAt(t, [[0, POSES.sit], [tm, SIT_FINGER]]), t, 1, 2), momExpr: () => 'smirk', momTalk: () => talkAmount(info.globalT, 30.76, 34.44) * 0.6,
    onTable: (g, D2) => { const pull = ease.inOut(prog(t, tm, tm + 0.6)); gameCase(g, lerp(D2.CX - 30, D2.CX + 110, pull), D2.tableTop - 74, 140, { rot: -0.05, glowA: 0.6 }); } });
  const a = ease.outBack(prog(t, t7 - 0.1, t7 + 0.3));
  if (a > 0) { g.save(); g.translate(E.W / 2, V(170, 300)); g.scale(a, a); text(g, 'MÉDIA', 0, -V(70, 84), { size: V(44, 52), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 10 }); text(g, '7', 0, V(30, 40), { size: V(170, 200), color: ui.gold, font: FONTS.ui, weight: 900, glow: 34, glowColor: alpha(ui.gold, 0.7) }); g.restore(); }
} });
// s14 — "Em tudo."
registerShot('s14', { draw(g, t, info) {
  const ui = S().ui;
  faceShot(g, t, info, { who: MOM, where: 'dining', expr: 'determined', talk: talkAmount(info.globalT, 33.78, 34.44), look: [0, 0], rimSide: -1, push: 0.07, y: V(60, 120) });
  ['PORT', 'HIST', 'MAT'].forEach((s, i) => {
    const k = ease.outBack(prog(t, 0.1 + i * 0.15, 0.45 + i * 0.15)); if (k <= 0) return;
    const x = E.W / 2 + (i - 1) * V(300, 320), y = V(190, 330), w = V(260, 290), h = V(110, 120);
    g.save(); g.translate(x, y); g.scale(k, k);
    rr(g, -w / 2, -h / 2, w, h, h / 2); g.fillStyle = alpha(shade(ui.gold, -0.8), 0.9); g.fill(); g.strokeStyle = ui.gold; g.lineWidth = 5; g.stroke();
    text(g, s, -w * 0.12, 4, { size: V(40, 44), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); text(g, '7', w * 0.3, 4, { size: V(64, 70), color: ui.gold, font: FONTS.ui, weight: 900, glow: 16, glowColor: alpha(ui.gold, 0.7) });
    g.restore();
  });
} });
