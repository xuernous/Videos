// shots/03_ending.js — s32–s59: the mock test, game over, the checkpoint, the report card, the weekend, the end.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, linGrad, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, dining, BED, DIN, groundY, controller, tvColor, tvScreen } from '../sets/home.js';
import { classroom, schoolDesk } from '../sets/school.js';
import { hudWorld, hudFrame, banner, scan, NEON } from '../sets/hud.js';
import { wt, rimOf, bgBlur, faceShot, sweat, boletim, testPaper, gameCase, stamp, bpBack, PAPER, BAD, GOOD } from '../sets/kit.js';
import { hand, arm, kidGaming, dinner, GAME_SIT, SIT_TALK } from './01_open.js';
import { deskScene, DESK_WRITE } from './02_mission.js';
import { KID, MOM } from '../cast.js';

const zoomAt = (g, cx, cy, z, fn) => { g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); fn(); g.restore(); };
const CLASS_WRITE = { ...POSES.sit, head: [12, -178], eF: [30, -120], hF: [58, -128], eB: [22, -122], hB: [48, -126] };

// kid at the front desk in the classroom (s32, s33)
function testDesk(g, t, info, o) {
  const cam = o.cam, { M, GY, CX } = classroom(g, t, cam, { board: 'SIMULADO', students: true, papers: true, clockSpeed: o.clockSpeed ?? 6 });
  layer(g, cam, 1, (g) => {
    const x = CX - V(80, 110), s = 2.1, f = { x, y: GY, s, facing: 1, outfit: KID, pose: o.pose(t), expr: o.expr(t), look: [1, 0.5], rim: rimOf(M, [-1, -0.4]), blink: (t % 3.2) > 3.1 };
    FX.chair(g, x - 10, GY, 1.5, shade(M.dark, -0.5)); drawFigure(g, f);
    schoolDesk(g, x + V(110, 110), GY, 1.55, M, { paper: true });
    o.extra?.(g, f, M);
  });
  FX.dust(g, t, { count: 50, color: M.key, a: 0.3 });
}
// s32 — "Aí vem o simulado de matemática."
registerShot('s32', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  testDesk(g, t, info, { cam: { z: 1.2 + 0.12 * k, y: V(40, 100) }, pose: (t) => breathe(POSES.sit, t, 1, 2), expr: () => 'worried' });
} });
// s33 — "Você treinou. Você confia."
registerShot('s33', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), tc = wt('confia', info, 1.3);
  testDesk(g, t, info, { cam: { z: 1.75 + 0.06 * k, x: -V(30, 40), y: V(100, 190) }, pose: (t) => ({ ...CLASS_WRITE, hF: [58 + Math.sin(t * 22) * 6, -128 + Math.cos(t * 17) * 3] }), expr: (t) => (t < tc ? 'determined' : 'smirk'),
    extra: (g, f, M) => { const [hx, hy] = hand(f); seg(g, [[hx, hy], [hx + 30, hy - 40]], 6, S().ui.gold); FX.speedLines(g, t, { cx: hx, cy: hy, count: 24, inner: 60, a: 0.3, color: S().ui.cream }); } });
} });
// s34 — "Nota: cinco."
registerShot('s34', { draw(g, t, info) {
  bgBlur(g, t, 'classroom', { z: 1.6, y: -V(200, 300), veil: 0.55, set: { board: 'SIMULADO' } });
  const t5 = wt('cinco', info, 0.95), z = 1 + 0.06 * ease.inOut(t / info.dur), [sx, sy] = t > t5 ? shake(t, 18 * (1 - prog(t, t5, t5 + 0.5)), 18) : [0, 0];
  zoomAt(g, E.W / 2 + sx, E.H * 0.45 + sy, z, () => {
    const p = testPaper(g, t, E.W / 2, E.H * 0.47, V(660, 760), { title: 'SIMULADO', marks: [0, 1, 2, 3, 4, 5].map((k) => ({ k, at: 0.05 + k * 0.08, kind: [0, 2, 3].includes(k) ? 'x' : 'v' })) });
    text(g, 'NOTA', p.x + p.w * 0.62, p.y + p.h * 0.075, { size: V(36, 40), color: alpha('#2a2430', 0.7), font: FONTS.ui, weight: 900 });
    stamp(g, t, p.x + p.w * 0.82, p.y + p.h * 0.1, V(90, 100), '5', BAD(), t5, { glow: 14 });
  });
  if (t > t5) veil(g, BAD(), 0.15 * (1 - prog(t, t5, t5 + 0.6)), 'lighter');
} });
// s35 — "Você joga a mochila no canto e pensa:"
registerShot('s35', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.3 + 0.06 * k, x: V(60, 80), y: V(40, 120) }, tj = wt('joga', info, 0.4) + 0.15, th = tj + 0.55;
  const { M, B, GY } = bedroom(g, t, cam, { tv: 0, lamp: 0, bag: true });
  veil(g, '#05030a', 0.15);
  layer(g, cam, 1, (g) => {
    const x = E.W / 2 - V(200, 170), THROW_B = { ...POSES.stand, eF: [-10, -170], hF: [-40, -200], eB: [-20, -140], hB: [-30, -110] }, THROW_F = { ...POSES.point, eF: [36, -182], hF: [70, -200] };
    const f = { x, y: GY, s: 2.3, facing: 1, outfit: KID, pose: breathe(posesAt(t, [[0, POSES.sad], [tj - 0.35, THROW_B], [tj, THROW_F], [th + 0.4, POSES.sad]], 0.2), t), expr: t < th ? 'angry' : 'sad', look: [1, 0], rim: { color: M.rim, dir: [-1, -0.4], w: 5 } };
    drawFigure(g, f);
    // the backpack: in hand -> arc -> slumps in the corner
    const u = prog(t, tj, th), bc = shade(S().ui.blueprint, -0.45);
    let bx, by, rot = 0;
    if (t < tj) { const [hx, hy] = hand(f); bx = hx; by = hy + 40; }
    else if (u < 1) { bx = lerp(x + 160, E.W + V(100, 40), u); by = lerp(GY - 460, GY - 50, u) - Math.sin(u * Math.PI) * 260; rot = u * 6; }
    else { bx = E.W + V(100, 40); by = GY - 50; rot = 0.4; }
    g.save(); g.translate(bx, by); g.rotate(rot); rr(g, -70, -80, 140, 160, 34); g.fillStyle = M.rim; g.fill(); rr(g, -64, -74, 128, 148, 30); g.fillStyle = bc; g.fill(); rr(g, -46, 0, 92, 50, 14); g.fillStyle = shade(bc, -0.3); g.fill(); g.restore();
    if (t > th && t < th + 0.5) FX.rings(g, E.W + V(100, 40), GY - 40, t - th, { count: 2, r0: 60, r1: 200, color: M.rim, a: 0.5, speed: 2 });
  });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });
// s36 — "Pronto. Game over."
registerShot('s36', { draw(g, t, info) {
  const tg = wt('Game', info, 0.9);
  faceShot(g, t, info, { who: KID, expr: 'sad', look: [0, 0.5], rimSide: -1, push: 0.05, y: V(140, 220), set: { tv: 0 }, veil: 0.55 });
  const a = prog(t, tg - 0.05, tg + 0.15);
  if (a > 0) {
    veil(g, '#1a0006', 0.35 * a);
    const y = E.H * 0.24, size = V(150, 160), j = (Math.floor(t * 18) % 3) - 1;
    text(g, 'GAME OVER', E.W / 2 - 8 + j * 6, y, { size, color: alpha('#00e5ff', 0.6 * a), font: FONTS.title, spacing: 4 });
    text(g, 'GAME OVER', E.W / 2 + 8 - j * 6, y, { size, color: alpha('#ff2266', 0.6 * a), font: FONTS.title, spacing: 4 });
    text(g, 'GAME OVER', E.W / 2, y, { size, color: BAD(), font: FONTS.title, spacing: 4, alpha: a, glow: 30, glowColor: alpha(BAD(), 0.8) });
    if (Math.floor(t * 9) % 4 === 0) { g.fillStyle = alpha(BAD(), 0.25); g.fillRect(0, y - 30 + j * 40, E.W, 14); }
  }
  scan(g, t, 0.08);
} });
// s37 — "Só que game over, você sabe melhor que ninguém, significa uma coisa só:"  CONTINUE? countdown
registerShot('s37', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.55 + 0.12 * k, x: V(120, 120), y: V(60, 140) }, n = Math.max(5, 9 - Math.floor(t)), ui = S().ui;
  const content = (g, x, y, w, h) => { g.fillStyle = '#05030a'; g.fillRect(x, y, w, h); text(g, 'CONTINUE?', x + w / 2, y + h * 0.35, { size: h * 0.2, color: ui.gold, font: FONTS.title, glow: 14, glowColor: alpha(ui.gold, 0.8) }); text(g, String(n), x + w / 2, y + h * 0.7, { size: h * 0.32, color: '#ffffff', font: FONTS.ui, weight: 900 }); };
  const { M, B, GY } = bedroom(g, t, cam, { tv: 1, tvContent: content, bag: false, lamp: 0 });
  layer(g, cam, 1, (g) => {
    const lift = prog(t, info.dur - 1.6, info.dur - 0.6), HEAD_DOWN = { ...POSES.sit, head: [24, -158], sh: [10, -140], eF: [34, -100], hF: [50, -80], eB: [26, -100], hB: [42, -80] };
    drawFigure(g, { x: B.bagX - V(40, 60), y: GY, s: 2.1, facing: 1, outfit: KID, pose: breathe(lift > 0 ? posesAt(lift, [[0, HEAD_DOWN], [0.3, POSES.sit]], 0.6) : HEAD_DOWN, t, 0.8), expr: lift > 0.5 ? 'determined' : 'sad', look: lift > 0.5 ? [1, -0.3] : [0.5, 0.8], rim: { color: ui.gold, dir: [1, -0.3], w: 5 } });
  });
  const pulse = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
  text(g, String(n), E.W / 2, V(190, 330), { size: V(130, 150) * (1 + 0.06 * pulse), color: ui.gold, font: FONTS.ui, weight: 900, glow: 26, glowColor: alpha(ui.gold, 0.6) });
  FX.dust(g, t, { count: 40, color: tvColor(), a: 0.3 });
} });
// s38 — "tentar de novo."
registerShot('s38', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.3 + 0.06 * k, y: V(60, 120) }, tp = 0.25;
  const { GY, N } = hudWorld(g, t, cam, { speed: 1.4 });
  layer(g, cam, 1, (g) => { FX.pool(g, E.W / 2, GY + 6, 260, 40, N.good, 0.5);
    drawFigure(g, { x: E.W / 2 - V(40, 30), y: GY - Math.sin(clamp((t - 0.35) / 0.5) * Math.PI) * 80, s: 2.4, facing: 1, outfit: KID, pose: posesAt(t, [[0, POSES.crouch], [0.35, POSES.jump], [0.85, POSES.cheer]], 0.2), expr: 'determined', look: [1, -0.3], rim: { color: N.good, dir: [1, -0.4], w: 6 } }); });
  const press = prog(t, tp, tp + 0.12) * (1 - prog(t, tp + 0.15, tp + 0.3));
  g.save(); g.translate(E.W / 2, E.H * 0.12); g.scale(1 - 0.08 * press, 1 - 0.08 * press);
  const w = V(660, 700), h = V(140, 150); rr(g, -w / 2, -h / 2, w, h, h / 2); g.fillStyle = mix(shade(N.good, -0.6), N.good, press); g.fill(); g.strokeStyle = N.good; g.lineWidth = 6; g.stroke();
  text(g, 'TENTAR DE NOVO', 0, 4, { size: V(62, 66), color: press > 0.5 ? '#04140b' : N.good, font: FONTS.title, glow: 18, glowColor: alpha(N.good, 0.8), spacing: 2 }); g.restore();
  if (t > tp) veil(g, '#ffffff', 0.5 * (1 - prog(t, tp, tp + 0.35)), 'lighter');
  scan(g, t, 0.06);
} });
// s39 — "Você volta pro checkpoint."
registerShot('s39', { draw(g, t, info) {
  const tc = wt('checkpoint', info, 1.0), ui = S().ui;
  deskScene(g, t, info, { notebook: 'open', expr: () => 'determined',
    deskExtra: (g, B, M) => { const fx = B.deskX0 + V(250, 200), fy = B.deskTop, a = prog(t, tc - 0.3, tc + 0.2);
      seg(g, [[fx, fy], [fx, fy - 170]], 6, '#d8d4e0'); const wv = Math.sin(t * 5) * 8; poly(g, [[fx, fy - 170], [fx + 100, fy - 140 + wv], [fx, fy - 110]], mix('#555566', GOOD(), a));
      if (a > 0) { glow(g, fx + 40, fy - 140, 220, GOOD(), 0.5 * a); text(g, 'CHECKPOINT', fx + 40, fy - 230, { size: 34, color: GOOD(), font: FONTS.ui, weight: 900, spacing: 3, alpha: a, glow: 12, glowColor: alpha(GOOD(), 0.7) }); } } });
  const a = prog(t, tc, tc + 0.3);
  if (a > 0) UI.badge(g, { str: 'CHECKPOINT SALVO', a, size: V(40, 46), y: V(120, 260), color: GOOD() });
} });
// s40 — "Refaz cada questão errada."
registerShot('s40', { draw(g, t, info) {
  bgBlur(g, t, 'bedroom', { z: 1.8, x: -V(350, 280), y: -V(150, 250), veil: 0.5, set: { tv: 0, lamp: 1, notebook: 'open' } });
  const bad = [0, 2, 3], z = 1 + 0.05 * ease.inOut(t / info.dur);
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => {
    const marks = [0, 1, 2, 3, 4, 5].map((k) => { const i = bad.indexOf(k); if (i < 0) return { k, at: -1, kind: 'v' }; const tf = 0.35 + i * 0.5; return t < tf ? { k, at: -1, kind: 'x' } : { k, at: tf, kind: 'v' }; });
    testPaper(g, t, E.W / 2, E.H * 0.47, V(660, 760), { title: 'SIMULADO · REFEITO', marks });
  });
  FX.dust(g, t, { count: 30, color: mood('night').practical, a: 0.3 });
} });
// s41 — "Uma por uma."  timelapse: the moon races, the stack grows
registerShot('s41', { draw(g, t, info) {
  const p = prog(t, 0, info.dur), n = 1 + Math.floor(p * 11.99), ui = S().ui;
  deskScene(g, t, info, { moonX: lerp(0.1, 0.95, p), notebook: 'open', pose: (t) => breathe({ ...DESK_WRITE, hF: [54 + Math.sin(t * 30) * 6, -132] }, t * 3, 0.6, 3),
    deskExtra: (g, B, M) => { for (let i = 0; i < n; i++) { rr(g, B.deskX0 + V(260, 220) + Math.sin(i * 2) * 6, B.deskTop - 6 - i * 7, 120, 6, 2); g.fillStyle = mix(PAPER(), M.practical, 0.25); g.fill(); } } });
  UI.readout(g, { value: `${n}/12`, x: E.W / 2, y: V(140, 300), align: 'center', size: V(96, 110), color: n === 12 ? GOOD() : ui.gold });
} });
// s42 — "Último dia de aula."
registerShot('s42', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.1 + 0.08 * k, x: -30 * k, y: V(30, 80) };
  const { M } = classroom(g, t, cam, { mood: 'golden', board: 'FÉRIAS!', students: false });
  FX.dust(g, t, { count: 70, color: M.key, a: 0.45 });
  UI.badge(g, { str: 'ÚLTIMO DIA', a: prog(t, 0.1, 0.4), size: V(46, 52), y: V(120, 260) });
} });
// s43 — "Boletim na mão da sua mãe."
const ROWS = () => [{ label: 'PORTUGUÊS' }, { label: 'HISTÓRIA' }, { label: 'MATEMÁTICA' }];
registerShot('s43', { draw(g, t, info) {
  const M = mood('interiorWarm');
  bgBlur(g, t, 'dining', { z: 1.6, y: -V(150, 260), veil: 0.5 });
  const k = ease.out(prog(t, 0, 0.8)), z = 1 + 0.05 * t / info.dur, cy = lerp(E.H * 0.7, E.H * 0.44, k);
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => {
    const b = boletim(g, t, E.W / 2, cy, V(680, 760), ROWS(), { hide: [0, 1, 2], rot: 0.02 });
    for (const sx of [-1, 1]) arm(g, E.W / 2 + sx * V(560, 520), cy + V(700, 800), E.W / 2 + sx * (b.w * 0.5 + 10), cy + b.h * 0.12, MOM.color, M, V(80, 90));
  });
  glow(g, E.W / 2, -60, E.W * 0.8, M.practical, 0.3);
  FX.dust(g, t, { count: 30, color: M.practical, a: 0.3 });
} });
// s44 — "Ela lê em silêncio."
const READ = { ...POSES.sit, head: [10, -176], eF: [26, -128], hF: [46, -150], eB: [20, -126], hB: [40, -148] };
registerShot('s44', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  const { M } = dinner(g, t, info, { cam: { z: 1.45 + 0.08 * k, y: V(60, 160) },
    kidPose: (t) => breathe(POSES.sit, t, 1.6, 1), kidExpr: () => 'nervous', momPose: () => breathe(READ, t, 0.4, 2), momExpr: () => 'neutral',
    onTable: (g, D) => { const s = 1.6, hx = D.momX - 46 * s, hy = D.GY - 150 * s; rr(g, hx - 70, hy - 60, 90, 120, 6); g.fillStyle = PAPER(); g.fill(); } });
  const D = DIN(); layer(g, { z: 1.45 + 0.08 * k, y: V(60, 160) }, 1, (g) => sweat(g, D.kidX + 20, D.GY - 300, 46, t));
} });
// s45 — "Português: oito."  s46 — "História: sete e meio."
registerShot('s45', { draw(g, t, info) {
  bgBlur(g, t, 'dining', { z: 1.6, y: -V(150, 260), veil: 0.55 });
  const rows = ROWS(); rows[0].grade = '8'; rows[0].good = true; rows[0].at = wt('oito', info, 1.2); rows[0].glow = true;
  const z = 1 + 0.05 * ease.inOut(t / info.dur);
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => boletim(g, t, E.W / 2, E.H * 0.45, V(700, 820), rows, { focus: 0, hide: [1, 2] }));
  if (t > rows[0].at) veil(g, GOOD(), 0.1 * (1 - prog(t, rows[0].at, rows[0].at + 0.6)), 'lighter');
} });
registerShot('s46', { draw(g, t, info) {
  bgBlur(g, t, 'dining', { z: 1.6, y: -V(150, 260), veil: 0.55 });
  const rows = ROWS(); rows[0].grade = '8'; rows[0].good = true; rows[0].at = -5; rows[1].grade = '7,5'; rows[1].good = true; rows[1].at = wt('sete', info, 1.2); rows[1].glow = true;
  const z = 1.03 + 0.05 * ease.inOut(t / info.dur);
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => boletim(g, t, E.W / 2, E.H * 0.45, V(700, 820), rows, { focus: 1, hide: [2] }));
  if (t > rows[1].at) veil(g, GOOD(), 0.1 * (1 - prog(t, rows[1].at, rows[1].at + 0.6)), 'lighter');
} });
// s47 — "Matemática..."  holding his breath
registerShot('s47', { draw(g, t, info) {
  faceShot(g, t, info, { who: KID, where: 'dining', expr: 'nervous', look: [0.3, 0.4], rimSide: 1, push: 0.12, y: V(80, 160), shakeAmp: 3,
    under: (g, cx, cy, r) => FX.rings(g, cx, cy, t, { count: 3, r0: r * 1.05, r1: r * 1.7, color: BAD(), a: 0.35, speed: 1.6, w: 4 }), over: (g, cx, cy, r) => sweat(g, cx, cy, r, t) });
  veil(g, '#000', 0.15 + 0.1 * Math.sin(t * Math.PI * 3.2));
} });
// s48 — "Sete."  FREEZE: the 7 lands, particles hang
registerShot('s48', { draw(g, t, info) {
  bgBlur(g, t, 'dining', { z: 1.6, y: -V(150, 260), veil: 0.6 });
  const rows = ROWS(); rows[0].grade = '8'; rows[0].good = true; rows[0].at = -5; rows[1].grade = '7,5'; rows[1].good = true; rows[1].at = -5; rows[2].grade = '7'; rows[2].good = true; rows[2].at = 0.12; rows[2].glow = true;
  const z = 1.25 + 0.03 * t, W = V(700, 820), h = W * 1.25, rowY = E.H * 0.45 + 0.29 * h;
  g.save(); g.translate(E.W / 2, E.H * 0.47); g.rotate(0.02 * t); g.scale(z, z); g.translate(-E.W / 2 - V(60, 70), -rowY);
  boletim(g, t, E.W / 2, E.H * 0.45, W, rows, { focus: 2 }); g.restore();
  veil(g, '#6fb8ff', 0.08, 'lighter');
  FX.drops(g, t, { count: 60, color: '#d8ecff', drift: 2 });
  FX.sparkle(g, E.W * 0.7, E.H * 0.33, 60 + 10 * Math.sin(t * 3), GOOD());
  UI.badge(g, { str: '7,0', size: V(48, 56), y: V(120, 260), color: GOOD() });
} });
// s49 — "Raspando."  needle settles on 7,0
registerShot('s49', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, cx = E.W / 2, cy = E.H * 0.5, r = V(380, 420);
  g.strokeStyle = alpha(ui.blueprint, 0.4); g.lineWidth = 18; g.beginPath(); g.arc(cx, cy, r, Math.PI, Math.PI * 2); g.stroke();
  g.strokeStyle = BAD(); g.beginPath(); g.arc(cx, cy, r, Math.PI, Math.PI * 1.7); g.stroke();
  g.strokeStyle = GOOD(); g.beginPath(); g.arc(cx, cy, r, Math.PI * 1.7, Math.PI * 2); g.stroke();
  for (let i = 0; i <= 10; i++) { const a = Math.PI + i / 10 * Math.PI; text(g, String(i), cx + Math.cos(a) * (r - 70), cy + Math.sin(a) * (r - 70), { size: V(34, 38), color: i === 7 ? ui.gold : ui.sub, font: FONTS.ui, weight: 900 }); }
  const v = 7 - 0.5 * Math.exp(-t * 3) * Math.cos(t * 14), a = Math.PI + v / 10 * Math.PI;
  seg(g, [[cx, cy], [cx + Math.cos(a) * r * 0.92, cy + Math.sin(a) * r * 0.92]], 12, ui.cream); circle(g, cx, cy, 26, ui.cream);
  text(g, '7,0', cx, cy + V(130, 150), { size: V(110, 120), color: GOOD(), font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(GOOD(), 0.6) });
  text(g, 'NA RISCA', cx, cy + V(240, 260), { size: V(46, 52), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 8 });
} });
// s50 — "Mas sete."  joy
registerShot('s50', { draw(g, t, info) {
  const ui = S().ui, cols = [ui.gold, GOOD(), ui.accent, NEON().a];
  faceShot(g, t, info, { who: KID, where: 'dining', expr: 'joy', look: [0, -0.2], rimSide: -1, push: 0.08, y: V(100, 180) });
  const r = rng(5); for (let i = 0; i < 60; i++) { const x = r() * E.W, y = ((r() * E.H * 0.8 + t * (300 + r() * 300)) % (E.H * 0.9)) - 50; g.save(); g.translate(x, y); g.rotate(t * 4 + i); g.fillStyle = cols[i % 4]; g.fillRect(-10, -5, 20, 10); g.restore(); }
  for (let i = 0; i < 4; i++) FX.sparkle(g, E.W * (0.2 + 0.2 * i), E.H * (0.2 + 0.1 * (i % 2)), 30 + 10 * Math.sin(t * 6 + i), ui.gold);
} });

// ---------- the weekend ----------
const DL = (p, ui) => (g, x, y, w, h) => {
  g.fillStyle = '#07060e'; g.fillRect(x, y, w, h); glow(g, x + w / 2, y + h * 0.4, w * 0.6, ui.accent, 0.25);
  text(g, 'GTA 6', x + w / 2, y + h * 0.3, { size: h * 0.2, color: '#ffffff', font: FONTS.title, glow: 16, glowColor: alpha(ui.accent, 0.9) });
  text(g, p >= 1 ? 'PRONTO PARA JOGAR' : 'BAIXANDO...', x + w / 2, y + h * 0.52, { size: h * 0.075, color: p >= 1 ? GOOD() : ui.cream, font: FONTS.ui, weight: 900, spacing: 3 });
  const bx = x + w * 0.12, bw = w * 0.76, by = y + h * 0.65, bh = h * 0.07;
  rr(g, bx, by, bw, bh, bh / 2); g.fillStyle = alpha('#ffffff', 0.12); g.fill(); rr(g, bx, by, Math.max(bh, bw * p), bh, bh / 2); g.fillStyle = p >= 1 ? GOOD() : ui.accent; g.fill();
  text(g, `${Math.floor(p * 100)}%`, x + w / 2, y + h * 0.85, { size: h * 0.12, color: p >= 1 ? GOOD() : ui.gold, font: FONTS.ui, weight: 900 });
};
// s51 — "No fim de semana,"
registerShot('s51', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12 + 0.07 * k, x: V(40, 60), y: V(30, 60) }, ui = S().ui;
  const { M, B } = bedroom(g, t, cam, { day: true, tv: 1, tvContent: DL(0.05, ui) });
  layer(g, cam, 1, (g) => kidGaming(g, t, B, M, { expr: 'smile', pad: true, rimC: M.rim }));
  FX.dust(g, t, { count: 60, color: M.key, a: 0.4 });
  UI.badge(g, { str: 'SÁBADO', a: prog(t, 0.1, 0.4), size: V(46, 52), y: V(120, 260) });
} });
// s52 — "a barra de download do GTA 6 chega a cem por cento."
registerShot('s52', { draw(g, t, info) {
  const ui = S().ui, tc = wt('cento', info, 3.3), p = ease.inOut(prog(t, 0.2, tc)), done = t > tc;
  bgBlur(g, t, 'bedroom', { z: 1.9, x: V(450, 330), y: -V(80, 150), veil: 0.5, set: { day: true, tv: 1 } });
  const w = V(1300, 940), h = w * 0.58, z = 1 + 0.06 * ease.inOut(t / info.dur);
  zoomAt(g, E.W / 2, E.H * 0.42, z, () => { glow(g, E.W / 2, E.H * 0.42, w, done ? GOOD() : ui.accent, 0.35); tvScreen(g, E.W / 2 - w / 2, E.H * 0.42 - h / 2, w, h, t, 1, DL(done ? 1 : p * 0.99, ui)); });
  if (done) { const a = prog(t, tc, tc + 0.3); FX.sparkle(g, E.W * 0.82, E.H * 0.3, 50 * a, GOOD()); FX.sparkle(g, E.W * 0.18, E.H * 0.55, 40 * a, ui.gold); }
} });
// s53 — "E você liga o console, claro."
registerShot('s53', { draw(g, t, info) {
  const M = mood('golden'), TVC = tvColor(), tp = 0.6, on = prog(t, tp, tp + 0.4);
  bgBlur(g, t, 'bedroom', { z: 1.8, x: V(400, 300), y: -V(0, 40), veil: 0.55, set: { day: true, tv: on } });
  const z = 1 + 0.06 * ease.inOut(t / info.dur);
  zoomAt(g, E.W / 2, E.H * 0.5, z, () => {
    const cx = E.W / 2, cy = E.H * 0.52, w = V(900, 820), h = V(200, 200);
    glow(g, cx, cy, w, TVC, 0.4 * on);
    rr(g, cx - w / 2, cy - h / 2, w, h, 26); g.fillStyle = '#0b0b12'; g.fill(); g.strokeStyle = alpha(M.rim, 0.35); g.lineWidth = 4; g.stroke();
    rr(g, cx - w / 2 + 30, cy - 10, w - 160, 8, 4); g.fillStyle = alpha(TVC, 0.2 + 0.8 * on); g.fill();
    const bx = cx + w / 2 - 80; circle(g, bx, cy, 34, '#1a1a26'); ring(g, bx, cy, 34, 4, alpha(TVC, 0.3 + 0.7 * on)); seg(g, [[bx, cy - 16], [bx, cy - 2]], 5, alpha(TVC, 0.4 + 0.6 * on)); g.strokeStyle = alpha(TVC, 0.4 + 0.6 * on); g.lineWidth = 5; g.beginPath(); g.arc(bx, cy, 14, -Math.PI * 0.3, Math.PI * 1.3); g.stroke();
    if (on > 0) glow(g, bx, cy, 160, TVC, 0.6 * on);
    const press = ease.inOut(prog(t, 0.1, tp)) - 0.4 * ease.inOut(prog(t, tp + 0.1, tp + 0.6));
    arm(g, cx + V(700, 640), cy + V(700, 800), lerp(cx + V(500, 460), bx + 20, press), lerp(cy + V(400, 460), cy + 40, press), KID.color, M, V(80, 90));
  });
  if (on > 0) veil(g, TVC, 0.12 * (1 - prog(t, tp, tp + 0.8)), 'lighter');
} });
// s54 — "Mas tem uma coisa que você não conta pra ninguém:"  finger to lips
registerShot('s54', { draw(g, t, info) {
  const tn = wt('ninguém', info, 2.2) - 0.6, f = ease.inOut(prog(t, tn, tn + 0.4));
  faceShot(g, t, info, { who: KID, expr: 'smirk', look: [0, 0], rimSide: 1, rimColor: mood('golden').rim, push: 0.05, y: V(120, 200), set: { day: true, tv: 1 }, bgx: V(200, 150),
    over: (g, cx, cy, r, M) => { if (f <= 0) return; const fx = cx + r * 0.05, fy = lerp(cy + r * 1.8, cy + r * 0.25, f);
      seg(g, [[fx + r * 0.3, cy + r * 2], [fx, fy + r * 0.2]], r * 0.36, KID.color);
      rr(g, fx - r * 0.1 - 4, fy - r * 0.42 - 4, r * 0.2 + 8, r * 0.8 + 8, r * 0.1); g.fillStyle = M.rim; g.fill(); rr(g, fx - r * 0.1, fy - r * 0.42, r * 0.2, r * 0.8, r * 0.1); g.fillStyle = S().ink; g.fill(); } });
  if (f > 0.8) text(g, 'SHHH', E.W / 2 + V(220, 230), E.H * 0.25, { size: V(70, 80), color: S().ui.cream, font: FONTS.title, alpha: prog(t, tn + 0.3, tn + 0.6), spacing: 6 });
} });
// s55 — "a melhor fase da semana não foi abrir o jogo."
registerShot('s55', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.45 + 0.08 * k, x: V(90, 110), y: V(70, 150) }, ui = S().ui, tn = wt('não', info, 1.7);
  const menu = (g, x, y, w, h) => { g.fillStyle = '#07060e'; g.fillRect(x, y, w, h); glow(g, x + w / 2, y + h * 0.4, w * 0.6, ui.accent, 0.3); text(g, 'GTA 6', x + w / 2, y + h * 0.35, { size: h * 0.22, color: '#fff', font: FONTS.title, glow: 14, glowColor: alpha(ui.accent, 0.9) }); rr(g, x + w * 0.3, y + h * 0.6, w * 0.4, h * 0.16, h * 0.08); g.fillStyle = ui.accent; g.fill(); text(g, 'JOGAR', x + w / 2, y + h * 0.685, { size: h * 0.09, color: '#fff', font: FONTS.ui, weight: 900 }); };
  const { M, B } = bedroom(g, t, cam, { day: true, tv: 1, tvContent: menu });
  layer(g, cam, 1, (g) => kidGaming(g, t, B, M, { expr: t > tn ? 'smile' : 'neutral', rimC: M.rim, pose: t > tn ? { ...GAME_SIT, head: [-6, -178] } : GAME_SIT }));
  FX.dust(g, t, { count: 50, color: M.key, a: 0.4 });
} });
// s56 — "Foi ver aquele sete."  the report card on the wall, the 7 circled
registerShot('s56', { draw(g, t, info) {
  const ui = S().ui;
  bgBlur(g, t, 'bedroom', { z: 2.2, x: V(140, 110), y: -V(560, 720), veil: 0.35, blur: 10, set: { day: true, tv: 1 } });
  const rows = ROWS(); rows[0].grade = '8'; rows[0].good = true; rows[0].at = -5; rows[1].grade = '7,5'; rows[1].good = true; rows[1].at = -5; rows[2].grade = '7'; rows[2].good = true; rows[2].at = -5; rows[2].glow = true;
  const z = 1.0 + 0.1 * ease.inOut(t / info.dur), tc = wt('sete', info, 0.95);
  zoomAt(g, E.W / 2, E.H * 0.55, z, () => {
    const b = boletim(g, t, E.W / 2, E.H * 0.42, V(620, 700), rows, { rot: -0.04, focus: 2,
      extra: (g, x, y, w, h) => { const cx = x + w * 0.79, cy = y + h * 0.3 + 2 * h * 0.2 + h * 0.09, p = ease.inOut(prog(t, tc - 0.4, tc + 0.3));
        g.strokeStyle = ui.gold; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.ellipse(cx, cy, w * 0.17, h * 0.09, -0.2, -Math.PI * 0.6, -Math.PI * 0.6 + Math.PI * 2.1 * p); g.stroke(); } });
    for (const [dx, dy] of [[-0.42, -0.5], [0.42, -0.5]]) { g.save(); g.translate(E.W / 2 + dx * b.w * 1.02, E.H * 0.42 + dy * b.h * 1.01); g.rotate(dx * 0.6); g.fillStyle = alpha('#f2ead0', 0.75); g.fillRect(-60, -18, 120, 36); g.restore(); }
  });
  const st = ease.outBack(prog(t, tc + 0.2, tc + 0.6)); if (st > 0) { g.save(); g.translate(E.W * 0.8, E.H * 0.6); g.scale(st, st); g.rotate(t * 0.5); poly(g, Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? 40 : 95; return [Math.cos(a) * rr2, Math.sin(a) * rr2]; }), ui.gold); g.restore(); glow(g, E.W * 0.8, E.H * 0.6, 220, ui.gold, 0.4 * st); }
  blurLayer(g, 12, (g) => drawFigure(g, { x: E.W * 0.12, y: E.H * 1.08, s: 4.2, facing: 1, outfit: KID, pose: POSES.stand, expr: 'smile', look: [1, -0.4], rim: { color: mood('golden').rim, dir: [1, -0.3], w: 8 }, shadow: false }));
  FX.dust(g, t, { count: 50, color: mood('golden').key, a: 0.4 });
} });
// s57 — "E você? Aceitaria o acordo?"
registerShot('s57', { draw(g, t, info) {
  const M = mood('night');
  const ui = S().ui, GY = E.H * 0.66;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, [shade(M.dark, -0.4), shade(M.wall, -0.3), shade(ui.accent, -0.6)]); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  glow(g, E.W / 2, GY, E.W * 0.6, ui.accent, 0.3); FX.pool(g, E.W / 2, GY + 10, 420, 60, ui.accent, 0.4);
  const a1 = ease.out(prog(t, 0.15, 0.6)), a2 = ease.out(prog(t, wt('Aceitaria', info, 0.9) - 0.1, wt('Aceitaria', info, 0.9) + 0.4));
  text(g, 'E você?', E.W / 2, E.H * 0.17, { size: V(70, 80), font: FONTS.serif, weight: 900, italic: true, color: ui.cream, alpha: a1, glow: 16, glowColor: alpha(ui.accent, 0.5) });
  text(g, 'Aceitaria o acordo?', E.W / 2, E.H * 0.25, { size: V(80, 90), font: FONTS.serif, weight: 900, italic: true, color: ui.gold, alpha: a2, glow: 20, glowColor: alpha(ui.gold, 0.5) });
  const sp = ease.outBack(prog(t, 1.2, 1.6));
  if (sp > 0) { g.save(); g.translate(E.W / 2, E.H * 0.34); g.scale(sp, sp); UI.bubble(g, -V(230, 230), 0, { w: 120, h: 70 }); rr(g, -130, -40, 360, 80, 40); g.fillStyle = '#e0302a'; g.fill(); text(g, 'INSCREVA-SE', 50, 3, { size: 38, color: '#fff', font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); }
  const s = 2.2;
  drawFigure(g, { x: E.W / 2 - V(170, 170), y: GY, s, facing: 1, outfit: KID, pose: breathe(POSES.shrug, t, 1, 1), expr: 'thinking', look: [0.4, -0.3], rim: { color: ui.accent, dir: [0, -1], w: 6 } });
  drawFigure(g, { x: E.W / 2 + V(170, 170), y: GY, s, facing: -1, outfit: MOM, pose: breathe(POSES.crossArms, t, 1, 2), expr: 'smirk', look: [-0.6, 0], rim: { color: ui.accent, dir: [0, -1], w: 6 } });
  gameCase(g, E.W / 2, GY - V(90, 100), V(170, 190), { rot: Math.sin(t * 1.5) * 0.06 });
  FX.dust(g, t, { count: 40, color: S().ui.accent, a: 0.3 });
} });
// s58 — "Porque a sua mãe... acabou de fazer"
registerShot('s58', { draw(g, t, info) {
  const k = ease.out(prog(t, 0.2, 1.1));
  faceShot(g, t, info, { who: MOM, where: 'dining', expr: 'smirk', look: [0.2, 0.1], rimSide: -1, push: 0.07, x: V(60, 80), y: V(40, 100) });
  g.save(); g.translate(lerp(-300, E.W * 0.24, k), E.H * 0.68); gameCase(g, 0, 0, V(340, 360), { rot: -0.1 + 0.05 * k }); g.restore();
} });
// s59 — "a proposta mais perigosa da sua vida."  pull out + the title returns
registerShot('s59', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  dinner(g, t, info, { cam: { z: 1.5 - 0.4 * k, y: V(60, 160) - V(40, 100) * k },
    kidPose: (t) => breathe(POSES.sit, t, 1, 1), kidExpr: () => 'awe', momPose: (t) => breathe(SIT_TALK, t, 1, 2), momExpr: () => 'smirk',
    onTable: (g, D) => gameCase(g, D.CX - 10, D.tableTop - 74, 140, { rot: -0.05, glowA: 0.8 }) });
  veil(g, '#06040a', 0.35 * prog(t, 0.8, 1.6));
  UI.titleCard(g, Math.max(0, t - 0.9), { lines: ['A PROPOSTA', 'MAIS PERIGOSA'], sub: 'DA SUA VIDA', dur: 99, y: E.H * 0.24 });
} });
