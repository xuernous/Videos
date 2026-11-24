// shots/01_day.js — s01–s17: the coach's day before the match.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { office, OFF, stadium, sky, plane, clockChip, bpBack, bigNum, stampText, bgBlur, faceShot, sweat, wt, zoomAt, WHITE } from '../sets/club.js';
import { COACH, PREZ } from '../cast.js';

const rim = (M, d = [-0.8, -0.5], w = 5) => ({ color: M.rim, dir: d, w });
export const DESK_WRITE = { ...POSES.sit, head: [12, -178], eF: [30, -118], hF: [56, -132], eB: [22, -120], hB: [46, -130] };
// rooster silhouette (generic)
export function rooster(g, x, y, s, c) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = c;
  g.beginPath(); g.ellipse(0, 0, 60, 44, -0.2, 0, Math.PI * 2); g.fill(); circle(g, 50, -54, 24, c);
  poly(g, [[70, -58], [96, -50], [70, -44]], c); for (let i = 0; i < 3; i++) circle(g, 40 + i * 12, -82 + (i % 2) * 4, 9, c); circle(g, 66, -32, 8, c);
  for (let i = 0; i < 4; i++) { g.strokeStyle = c; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.arc(-50, -30, 40 + i * 12, Math.PI * 0.9, Math.PI * 1.55); g.stroke(); }
  seg(g, [[-10, 40], [-14, 80], [-30, 84]], 8, c); seg(g, [[14, 40], [18, 80], [34, 84]], 8, c);
  g.restore();
}
// paper sheet card
function sheet(g, cx, cy, w, h, title, lines, o = {}) {
  g.save(); g.translate(cx, cy); g.rotate(o.rot ?? -0.03);
  g.fillStyle = alpha('#000', 0.35); rr(g, -w / 2 + 16, -h / 2 + 22, w, h, 8); g.fill(); rr(g, -w / 2, -h / 2, w, h, 8); g.fillStyle = '#f3efe4'; g.fill();
  text(g, title, 0, -h / 2 + h * 0.1, { size: w * 0.07, color: '#2a2430', font: FONTS.ui, weight: 900, spacing: 2 });
  for (let i = 0; i < (lines ?? 6); i++) { const r = rng(10 + i); g.strokeStyle = alpha('#3a3a5a', 0.45); g.lineWidth = 3; g.beginPath(); for (let k = 0; k <= 18; k++) { const xx = -w * 0.38 + k * w * 0.042, yy = -h / 2 + h * (0.24 + i * 0.1) + Math.sin(k * 1.7 + i) * 4 + (r() - 0.5) * 4; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
  o.extra?.(g, w, h); g.restore();
}

// s01 — "E se você fosse técnico do Corinthians por um dia?"
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15 + 0.12 * k, y: V(20, 60) };
  const { M, GY } = stadium(g, t, cam, { phase: 'dawn', lights: 0, empty: true });
  layer(g, cam, 1, (g) => { const stop = 1.6, x = lerp(E.W * 0.05, E.W * 0.45, ease.out(prog(t, 0, stop))), walking = t < stop;
    drawFigure(g, { x, y: GY + V(40, 70), s: 2.0, facing: 1, outfit: COACH, pose: walking ? walkPose(t * 2 * Math.PI * 0.9) : breathe(POSES.holdFront, t), expr: t < stop ? 'smile' : 'smirk', look: [1, -0.2], rim: rim(M, [1, -0.5]), prop: 'paper' }); });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.35 });
  const a = ease.outBack(prog(t, wt('técnico', info, 0.7) - 0.1, wt('técnico', info, 0.7) + 0.3)); if (a > 0) { g.save(); g.translate(E.W / 2, V(230, 330)); g.scale(a, a); text(g, 'TÉCNICO', 0, 0, { size: V(120, 130), color: WHITE, font: FONTS.title, glow: 20, glowColor: alpha('#000', 0.8), stroke: 14, strokeColor: '#111', spacing: 6 }); text(g, 'POR UM DIA', 0, V(100, 110), { size: V(52, 58), color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 8 }); g.restore(); }
} });

// s02 — "Porra, logo na quarta contra o Galo?"
registerShot('s02', { draw(g, t, info) {
  bgBlur(g, t, 'office', { z: 1.6, veil: 0.45 }); const ui = S().ui, tq = wt('quarta', info, 1.4), tg = wt('Galo?', info, 2.6);
  const z = 1 + 0.05 * ease.inOut(t / info.dur), cw = V(940, 900), cell = cw / 7, x0 = E.W / 2 - cw / 2, y0 = E.H * 0.3;
  zoomAt(g, E.W / 2, E.H * 0.42, z, () => {
    rr(g, x0 - 20, y0 - 120, cw + 40, cell * 2 + 160, 16); g.fillStyle = '#f3efe4'; g.fill(); g.fillStyle = '#d02020'; rr(g, x0 - 20, y0 - 120, cw + 40, 90, 16); g.fill();
    text(g, 'ESTA SEMANA', E.W / 2, y0 - 75, { size: V(44, 46), color: '#fff', font: FONTS.ui, weight: 900, spacing: 4 });
    ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM'].forEach((d, i) => { const x = x0 + i * cell; text(g, d, x + cell / 2, y0 + 20, { size: V(34, 36), color: '#2a2430', font: FONTS.ui, weight: 900 }); rr(g, x + 6, y0 + 50, cell - 12, cell * 1.3, 10); g.fillStyle = alpha('#2a2430', 0.06); g.fill(); });
    const p = ease.out(prog(t, tq - 0.1, tq + 0.4)), qx = x0 + 2.5 * cell, qy = y0 + 50 + cell * 0.65;
    if (p > 0) { g.strokeStyle = '#d02020'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.ellipse(qx, qy, cell * 0.62, cell * 0.8, -0.1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2.1 * p); g.stroke(); }
    const ga = ease.outBack(prog(t, tg - 0.2, tg + 0.2)); if (ga > 0) { g.save(); g.translate(qx, qy); g.scale(ga, ga); rooster(g, 0, 10, 0.5, '#141416'); g.restore(); }
  });
  const ga = prog(t, tg - 0.1, tg + 0.2); if (ga > 0) text(g, 'x GALO', E.W / 2, E.H * 0.66, { size: V(120, 130), color: WHITE, font: FONTS.title, stroke: 16, strokeColor: '#111', alpha: ga, glow: 20, glowColor: alpha('#d02020', 0.6) });
} });

// s03 — "Parabéns, já pode ir escrevendo o discurso de despedida."
registerShot('s03', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.06 * k, x: V(160, 140), y: V(60, 140) }, ui = S().ui, td = wt('despedida', info, 2.8);
  const { M, O, GY } = office(g, t, cam, { chair: true });
  layer(g, cam, 1, (g) => drawFigure(g, { x: O.chairX + 20, y: GY, s: 2.0, facing: 1, outfit: COACH, pose: { ...DESK_WRITE, hF: [56 + Math.sin(t * 18) * 5, -132] }, expr: t < 1 ? 'smile' : 'sad', look: [1, 0.4], rim: rim(M, [-1, -0.4]) }));
  const r = rng(4), cols = [ui.gold, '#ffffff', ui.accent, '#d02020']; for (let i = 0; i < 50; i++) { const x = r() * E.W, y = ((r() * E.H * 0.5 + t * (200 + r() * 200)) % (E.H * 0.6)), a = 1 - prog(t, 1.2, 2.0); if (a <= 0) break; g.save(); g.translate(x, y); g.rotate(t * 3 + i); g.globalAlpha = a; g.fillStyle = cols[i % 4]; g.fillRect(-9, -4, 18, 8); g.restore(); }
  const pa = ease.outBack(prog(t, 0.05, 0.4)) * (1 - prog(t, 1.2, 1.6)); if (pa > 0) { g.save(); g.translate(E.W / 2, V(250, 360)); g.scale(pa, pa); text(g, 'PARABÉNS!', 0, 0, { size: V(110, 120), color: ui.gold, font: FONTS.title, glow: 24, glowColor: alpha(ui.gold, 0.6), stroke: 12, strokeColor: '#111' }); g.restore(); }
  const sa = ease.out(prog(t, td - 0.6, td)); if (sa > 0) sheet(g, E.W / 2, lerp(E.H * 1.2, E.H * 0.33, sa), V(560, 600), V(720, 760), 'DISCURSO DE DESPEDIDA', 4, { rot: -0.05 });
} });

// s04 — "Oito da manhã, você assume."
registerShot('s04', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.2 + 0.07 * k, x: V(80, 60), y: V(30, 80) }, ta = wt('assume.', info, 1.45);
  const { M, O, GY } = office(g, t, cam, {});
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: O.chairX + V(160, 120), y: GY, s: 1.9, facing: -1, outfit: PREZ, pose: breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.holdFront], [ta, POSES.point]]), t), expr: 'smile', look: [-1, 0], rim: rim(M, [-0.8, -0.5]), prop: t < ta ? 'paper' : null });
    drawFigure(g, { x: O.chairX - V(60, 60), y: GY, s: 1.9, facing: 1, outfit: COACH, pose: breathe(posesAt(t, [[0, POSES.stand], [ta - 0.2, POSES.reach], [ta + 0.3, POSES.holdFront]]), t), expr: t > ta ? 'determined' : 'smile', look: [1, 0], rim: rim(M, [-0.8, -0.5]), prop: t > ta ? 'paper' : null });
  });
  FX.dust(g, t, { count: 50, color: M.key, a: 0.4 });
  clockChip(g, t, '08:00', { at: 0.15 });
} });

// s05 — "Dorival caiu. Diniz caiu."   s06 — "Você é o próximo."
const wallCam = (k) => ({ z: 1.55 + 0.06 * k, x: V(200, 160), y: -V(140, 260) });
registerShot('s05', { draw(g, t, info) {
  const d1 = wt('caiu.', info, 0.56), d2 = d1 + (wt('Diniz', info, 1.4) - d1) + 0.28;
  const { M } = office(g, t, wallCam(ease.inOut(t / info.dur)), { frames: [{ drop: prog(t, d1, d1 + 0.6), rot: 0.02 }, { drop: prog(t, d2, d2 + 0.6), rot: -0.03 }, { who: null, rot: 0 }] });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.4 });
} });
registerShot('s06', { draw(g, t, info) {
  const w = Math.sin(t * 7) * 0.12 * (0.4 + prog(t, 0, info.dur));
  const { M } = office(g, t, { z: 3.6 + 0.15 * t / info.dur, x: V(900, 820), y: -V(1000, 1110) }, { frames: [{ drop: 1 }, { drop: 1 }, { who: COACH, expr: 'worried', rot: w }] });
  const a = ease.outBack(prog(t, wt('próximo.', info, 0.6) - 0.1, wt('próximo.', info, 0.6) + 0.3)); if (a > 0) { g.save(); g.translate(E.W / 2, E.H * 0.2); g.scale(a, a); text(g, 'PRÓXIMO?', 0, 0, { size: V(110, 120), color: S().ui.gold, font: FONTS.title, stroke: 12, strokeColor: '#111', glow: 20, glowColor: alpha(S().ui.gold, 0.6) }); g.restore(); }
} });
// s07 — "Puta que pariu."
registerShot('s07', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.6 + 0.08 * k, x: V(60, 40), y: V(80, 170) };
  const { M, GY } = office(g, t, cam, { chair: false });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.45, y: GY, s: 2.2, facing: 1, outfit: COACH, pose: breathe(posesAt(t, [[0, POSES.facepalm], [0.9, POSES.handsOnHead]]), t, 1.5), expr: t < 0.9 ? 'sad' : 'shocked', look: [0, -0.5], rim: rim(M, [-1, -0.4]) }));
  FX.dust(g, t, { count: 40, color: M.key, a: 0.4 });
} });
// s08 — "Nove horas, você pede reforço."
registerShot('s08', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.45 + 0.06 * k, x: V(160, 120), y: V(20, 60) }, tr = wt('reforço.', info, 1.8);
  const board = (g, x, y, w, h) => { text(g, 'REFORÇOS?', x + w / 2, y + h * 0.17, { size: w * 0.1, color: '#d02020', font: FONTS.title });
    for (let i = 0; i < 3; i++) { const yy = y + h * (0.38 + i * 0.2); seg(g, [[x + w * 0.12, yy + 10], [x + w * 0.7, yy + 10]], 3, alpha('#2a2430', 0.4)); text(g, `${i + 1}.`, x + w * 0.08, yy, { size: w * 0.05, color: '#2a2430', font: FONTS.ui, weight: 900 }); if (t > tr + i * 0.3) text(g, '?', x + w * 0.4, yy - 4, { size: w * 0.09, color: '#2a2430', font: FONTS.title }); } };
  const { M, GY } = office(g, t, cam, { board, chair: false });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.22, y: GY, s: 2.0, facing: 1, outfit: COACH, pose: breathe(POSES.phone, t), expr: 'worried', look: [1, -0.2], rim: rim(M, [-1, -0.4]), prop: 'phone', talk: 0.5 + 0.5 * Math.sin(t * 9) }));
  clockChip(g, t, '09:00', { at: 0.15 });
} });
// s09 — "A dívida é de 2,7 bilhões."
registerShot('s09', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, tb = wt('bilhões.', info, 2.0), p = ease.out(prog(t, 0.3, tb + 0.2)), v = lerp(0, 2.7, p);
  for (let s = 0; s < 6; s++) { const n = Math.floor(lerp(0, 6 + s * 2, p)); for (let i = 0; i < n; i++) { const x = E.W * 0.14 + s * E.W * 0.145, y = E.H * 0.78 - i * 26; g.fillStyle = shade(ui.gold, -0.3); g.beginPath(); g.ellipse(x, y + 8, 56, 16, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = ui.gold; g.beginPath(); g.ellipse(x, y, 56, 16, 0, 0, Math.PI * 2); g.fill(); } }
  text(g, 'DÍVIDA', E.W / 2, E.H * 0.2, { size: V(50, 56), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 10 });
  text(g, `R$ ${v.toFixed(1).replace('.', ',')}`, E.W / 2, E.H * 0.31, { size: V(170, 190), color: '#ff4040', font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha('#ff4040', 0.6) });
  text(g, 'BILHÕES', E.W / 2, E.H * 0.41, { size: V(80, 90), color: '#ff4040', font: FONTS.ui, weight: 900, spacing: 6, alpha: prog(t, tb - 0.2, tb) });
} });
// s10 — "Dá nem pra contratar um gandula parcelado, caralho."
registerShot('s10', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, tp = wt('parcelado,', info, 1.7);
  UI.lineFigure(g, { x: E.W * 0.3, y: E.H * 0.7, s: V(2.0, 2.4), pose: breathe(POSES.holdFront, t), color: ui.blueprint });
  circle(g, E.W * 0.3 + 90, E.H * 0.7 - 330, 40, ui.cream); text(g, 'GANDULA', E.W * 0.3, E.H * 0.75, { size: V(40, 44), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
  g.save(); g.translate(E.W * 0.33, E.H * 0.38); g.rotate(-0.1 + Math.sin(t * 2) * 0.05); seg(g, [[-80, -60], [-10, 0]], 3, ui.cream); poly(g, [[0, -40], [40, -80], [260, -80], [260, 40], [40, 40]], ui.gold); circle(g, 30, -20, 9, ui.bpBg); text(g, '12x', 150, -20, { size: 70, color: '#2a1206', font: FONTS.ui, weight: 900 }); g.restore();
  const mx = E.W * 0.72, my = E.H * 0.55, a = ease.outBack(prog(t, 0.4, 0.8)); g.save(); g.translate(mx, my); g.scale(a, a);
  rr(g, -130, -220, 260, 440, 30); g.fillStyle = '#1a1c26'; g.fill(); g.strokeStyle = alpha(ui.blueprint, 0.6); g.lineWidth = 4; g.stroke();
  rr(g, -100, -190, 200, 140, 12); const bad = t > tp; g.fillStyle = bad ? '#3a0808' : '#0a2a1a'; g.fill(); text(g, bad ? 'RECUSADO' : 'APROXIME', 0, -120, { size: 34, color: bad ? '#ff4040' : ui.good, font: FONTS.ui, weight: 900 });
  for (let i = 0; i < 9; i++) { rr(g, -90 + (i % 3) * 64, -20 + Math.floor(i / 3) * 60, 52, 44, 8); g.fillStyle = '#2a2c38'; g.fill(); } g.restore();
  if (t > tp) { veil(g, '#ff2020', 0.12 * (1 - prog(t, tp, tp + 0.6)), 'lighter'); stampText(g, t, 'RECUSADO', E.W / 2, E.H * 0.18, tp, { size: V(100, 110) }); }
} });
// s11 — "Dez horas, o salário de outubro atrasou."
registerShot('s11', { draw(g, t, info) {
  bgBlur(g, t, 'office', { z: 1.6, veil: 0.45 }); const ui = S().ui, ta = wt('atrasou.', info, 2.5), z = 1 + 0.05 * ease.inOut(t / info.dur);
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => {
    const cw = V(900, 860), cell = cw / 7, x0 = E.W / 2 - cw / 2, y0 = E.H * 0.3;
    rr(g, x0 - 20, y0 - 110, cw + 40, cell * 5 + 140, 16); g.fillStyle = '#f3efe4'; g.fill(); g.fillStyle = '#141416'; rr(g, x0 - 20, y0 - 110, cw + 40, 90, 16); g.fill();
    text(g, 'OUTUBRO', E.W / 2, y0 - 65, { size: V(50, 52), color: '#fff', font: FONTS.ui, weight: 900, spacing: 8 });
    for (let i = 0; i < 31; i++) { const x = x0 + ((i + 2) % 7) * cell, y = y0 + Math.floor((i + 2) / 7) * cell; const pay = i === 4; rr(g, x + 5, y + 5, cell - 10, cell - 10, 8); g.fillStyle = pay ? alpha('#d02020', 0.15) : alpha('#2a2430', 0.05); g.fill(); text(g, String(i + 1), x + cell / 2, y + cell / 2, { size: V(32, 34), color: pay ? '#d02020' : '#2a2430', font: FONTS.ui, weight: 900 }); if (pay) text(g, 'R$', x + cell / 2, y + cell * 0.8, { size: 18, color: '#d02020', font: FONTS.ui, weight: 900 }); }
  });
  stampText(g, t, 'ATRASADO', E.W / 2, E.H * 0.47, ta, { size: V(110, 120) });
  clockChip(g, t, '10:00', { at: 0.1 });
} });
// s12 — "O seu nem pergunta."
registerShot('s12', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.6 + 0.06 * k, x: V(40, 20), y: V(80, 170) };
  const { M, GY } = office(g, t, cam, { chair: false });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.32, y: GY, s: 2.2, facing: 1, outfit: COACH, pose: breathe(posesAt(t, [[0, POSES.holdFront], [1.0, POSES.shrug]]), t), expr: t < 1 ? 'thinking' : 'smirk', look: [1, 0], rim: rim(M, [-1, -0.4]) }));
  sheet(g, E.W * 0.7, E.H * 0.3, V(440, 460), V(560, 580), 'HOLERITE', 2, { rot: 0.06, extra: (g, w, h) => { text(g, 'SALÁRIO:', -w * 0.15, h * 0.12, { size: w * 0.08, color: '#2a2430', font: FONTS.ui, weight: 900 }); text(g, '???', w * 0.25, h * 0.12, { size: w * 0.14, color: '#d02020', font: FONTS.title }); } });
} });
// s13 — "Meio dia, avião pra BH, turbulência."
registerShot('s13', { draw(g, t, info) {
  const tt = wt('turbulência.', info, 2.3), amp = t > tt ? 26 : 4, [sx, sy] = shake(t, amp, 6), cam = { z: 1.0, x: sx, y: sy };
  const { M } = sky(g, t, cam);
  plane(g, E.W / 2 + sx * 1.5, E.H * 0.42 + sy * 2 + Math.sin(t * 2) * 10, V(1.3, 1.4), M);
  const ui = S().ui; rr(g, E.W / 2 - V(200, 200), E.H * 0.2 - 50, V(400, 400), 100, 50); g.fillStyle = alpha('#05050a', 0.7); g.fill(); text(g, 'SP  ✈  BH', E.W / 2, E.H * 0.2, { size: V(56, 60), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
  if (t > tt) bigNum(g, t, 'TURBULÊNCIA', E.W / 2, E.H * 0.62, tt, { size: V(100, 110), color: '#ff4040', stroke: 12 });
  clockChip(g, t, '12:00', { at: 0.1 });
} });
// s14 — "É a coisa mais estável do seu dia."
registerShot('s14', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui;
  text(g, 'ESTABILIDADE', E.W / 2, E.H * 0.26, { size: V(70, 76), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 6 });
  [['AVIÃO', 0.82, ui.good], ['SEU DIA', 0.04, '#ff4040']].forEach(([l, v, c], i) => { const y = E.H * (0.4 + i * 0.16), x = E.W * 0.12, w = E.W * 0.76, p = ease.out(prog(t, 0.3 + i * 0.4, 1.0 + i * 0.4)) * v + (i ? Math.max(0, Math.sin(t * 13)) * 0.02 : 0);
    text(g, l, x, y - 60, { size: V(46, 50), color: ui.cream, font: FONTS.ui, weight: 900, align: 'left' }); rr(g, x, y, w, 70, 35); g.fillStyle = alpha(ui.blueprint, 0.15); g.fill(); rr(g, x, y, Math.max(30, w * p), 70, 35); g.fillStyle = c; g.fill(); text(g, `${Math.round(p * 100)}%`, x + w - 20, y - 60, { size: V(46, 50), color: c, font: FONTS.ui, weight: 900, align: 'right' }); });
} });
// s15 — "Três da tarde, sábado tem eleição."
registerShot('s15', { draw(g, t, info) {
  bgBlur(g, t, 'office', { z: 1.6, veil: 0.45 }); const ui = S().ui, te = wt('eleição.', info, 2.0), z = 1 + 0.06 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.58;
  zoomAt(g, cx, cy, z, () => {
    for (let i = 0; i < 5; i++) { const ph = ((t * 0.9 + i * 0.22) % 1), y = lerp(cy - 600, cy - 160, ease.in(ph)); g.save(); g.translate(cx + (i - 2) * 30, y); g.rotate((i - 2) * 0.2 + ph * 0.6); rr(g, -60, -40, 120, 80, 6); g.fillStyle = '#f3efe4'; g.fill(); seg(g, [[-30, -5], [-10, 15], [30, -20]], 7, '#2a7a3a'); g.restore(); }
    rr(g, cx - 240, cy - 170, 480, 380, 20); g.fillStyle = shade('#3a3a44', -0.2); g.fill(); rr(g, cx - 260, cy - 190, 520, 50, 14); g.fillStyle = '#4a4a56'; g.fill(); g.fillStyle = '#0a0a0e'; g.fillRect(cx - 120, cy - 172, 240, 14);
    text(g, 'URNA', cx, cy + 40, { size: V(70, 76), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8 });
  });
  bigNum(g, t, 'SÁBADO', E.W / 2, E.H * 0.17, wt('sábado', info, 1.4), { size: V(100, 110), label: 'ELEIÇÃO' });
  clockChip(g, t, '15:00', { at: 0.1 });
} });
// s16 — "Seu chefe pode cair antes de você."
registerShot('s16', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), tc = wt('cair', info, 0.95), cam = { z: 1.45 + 0.06 * k, x: V(40, 30), y: V(60, 140) };
  const { M, GY } = office(g, t, cam, { chair: false });
  layer(g, cam, 1, (g) => {
    const px = E.W * 0.38, f = ease.in(prog(t, tc, tc + 0.35)), dk = shade('#3a2a22', -0.3);
    if (f < 0.05) { rr(g, px - 90, GY - 330, 80, 230, 20); g.fillStyle = dk; g.fill(); rr(g, px - 90, GY - 110, 150, 30, 10); g.fill(); seg(g, [[px - 60, GY - 80], [px - 60, GY]], 10, dk); seg(g, [[px + 40, GY - 80], [px + 40, GY]], 10, dk); }
    else { seg(g, [[px - 60, GY - 40], [px - 80, GY]], 10, dk); seg(g, [[px + 40, GY - 30], [px + 70, GY]], 10, dk); rr(g, px - 120, GY - 50 + 30 * f, 150, 30, 10); g.fillStyle = dk; g.fill(); }
    drawFigure(g, { x: px - 20, y: f > 0 ? lerp(GY - 30, GY, f) : GY - 30, s: 1.9, facing: 1, outfit: PREZ, pose: f > 0 ? POSES.fall : breathe(POSES.sitBack, t), rot: f > 0 ? -1.2 * f : 0, expr: f > 0 ? 'shocked' : 'smirk', rim: rim(M, [-1, -0.4]), shadow: f <= 0 });
    drawFigure(g, { x: E.W * 0.75, y: GY, s: 2.0, facing: -1, outfit: COACH, pose: breathe(f > 0.5 ? POSES.handsOnHead : POSES.crossArms, t), expr: f > 0.5 ? 'surprised' : 'neutral', look: [-1, 0.2], rim: rim(M, [-1, -0.4]) });
    if (f > 0.9 && t < tc + 1.2) FX.rings(g, px, GY - 20, t - tc, { count: 2, r0: 60, r1: 220, color: M.rim, a: 0.4, speed: 2 });
  });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.4 });
} });
// s17 — "Seis da tarde, a campanha já foi pior que a do rebaixamento."
registerShot('s17', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, tp = wt('pior', info, 2.1), x0 = E.W * 0.1, x1 = E.W * 0.9, y0 = E.H * 0.3, y1 = E.H * 0.7;
  seg(g, [[x0, y1], [x1, y1]], 4, alpha(ui.blueprint, 0.5)); seg(g, [[x0, y0], [x0, y1]], 4, alpha(ui.blueprint, 0.5)); text(g, 'PONTOS', x0, y0 - 40, { size: V(32, 34), color: ui.sub, font: FONTS.ui, weight: 900, align: 'left' });
  const curve = (k, drop) => (u) => [lerp(x0, x1, u), lerp(y1, y0, u * k) + drop * Math.pow(u, 2) * 120];
  const draw = (f, p, c, dash) => { g.save(); if (dash) g.setLineDash([22, 14]); g.strokeStyle = c; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i <= 60 * p; i++) { const [x, y] = f(i / 60); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore(); };
  const a = ease.inOut(prog(t, 0.2, 1.4)), b = ease.inOut(prog(t, tp - 0.8, tp + 0.4));
  draw(curve(0.55, 0), a, ui.gold, true); if (a > 0.95) text(g, 'REBAIXAMENTO', x1 - 10, y1 - (y1 - y0) * 0.55 - 40, { size: V(36, 40), color: ui.gold, font: FONTS.ui, weight: 900, align: 'right' });
  draw(curve(0.32, 0.6), b, '#ff4040', false); if (b > 0.95) { text(g, 'AGORA', x1 - 10, y1 - (y1 - y0) * 0.32 + 110, { size: V(48, 52), color: '#ff4040', font: FONTS.ui, weight: 900, align: 'right' }); }
  clockChip(g, t, '18:00', { at: 0.1 });
} });
