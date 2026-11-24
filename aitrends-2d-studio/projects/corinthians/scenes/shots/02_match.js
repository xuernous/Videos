// shots/02_match.js — s18–s34: the match, halftime, the bench, the flashback, the fan, the expiry date.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace, soccerBall, headPos } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { stadium, locker, office, bench, clockChip, bpBack, bigNum, stampText, bgBlur, faceShot, sweat, wt, zoomAt, WHITE, BLACKJ } from '../sets/club.js';
import { COACH, FAN, PLAYER, RIVAL } from '../cast.js';

const rim = (M, d = [0, -1], w = 5) => ({ color: M.rim, dir: d, w });
const scoreboard = (home, away, clock) => (g, CX, top) => { const w = V(520, 500), h = V(150, 150), x = CX - w / 2, y = top + V(20, 70);
  rr(g, x, y, w, h, 12); g.fillStyle = '#050507'; g.fill(); g.strokeStyle = '#2a2a33'; g.lineWidth = 6; g.stroke();
  text(g, 'COR', x + w * 0.16, y + h * 0.38, { size: 40, color: WHITE, font: FONTS.ui, weight: 900 }); text(g, 'GAL', x + w * 0.84, y + h * 0.38, { size: 40, color: WHITE, font: FONTS.ui, weight: 900 });
  text(g, `${home}  x  ${away}`, x + w / 2, y + h * 0.38, { size: 64, color: '#ffcc33', font: FONTS.ui, weight: 900, glow: 14, glowColor: 'rgba(255,200,40,.7)' });
  if (clock) text(g, clock, x + w / 2, y + h * 0.8, { size: 34, color: '#ff5050', font: FONTS.ui, weight: 900 }); };

// s18 — "Oito da noite, bola rola."  3D stadium swoop
registerShot('s18', { kind: '3d',
  init(T) {
    const M = mood('night'), st = T.stage({ mood: 'night', fov: V(40, 56), fog: [40, 160], keyPos: [0, 30, 10], keyIntensity: 1.6, ambient: 1.0 });
    st.add(T.ground(110, 70, mix(M.grass, '#2a7a3a', 0.5)));
    for (const z of [-26, 26]) { const c = T.crowd3D({ rows: 14, perRow: 90, width: 100, step: 0.8, rise: 0.55, colors: [WHITE, '#2a2a30', '#5a5a66', '#d8d4cc'], z0: z * 1.05, y0: 0 }); if (z > 0) c.rotation.y = Math.PI; st.add(c); }
    for (const [x, z] of [[-48, -30], [48, -30], [-48, 30], [48, 30]]) { st.add(T.cyl(0.4, 0.5, 26, '#15141c', x, 13, z)); const l = T.windowPane(6, 3, { glowColor: '#fffbe8', cols: 3, rows: 2, power: 1.6 }); l.position.set(x, 26, z); l.lookAt(0, 0, 0); st.add(l); }
    for (const x of [-52, 52]) { st.add(T.box(0.25, 2.4, 0.25, '#ffffff', x, 1.2, -3.6), T.box(0.25, 2.4, 0.25, '#ffffff', x, 1.2, 3.6), T.box(0.25, 0.25, 7.4, '#ffffff', x, 2.4, 0)); }
    const line = T.box(0.25, 0.02, 64, '#ffffff', 0, 0.02, 0); st.add(line);
    const players = [];
    for (let i = 0; i < 6; i++) { const p = T.figure3D(PLAYER(String(i + 4)), { rim: M.rim, pose: POSES.ready }); p.position.set(-4 - (i % 3) * 6, 0, -12 + i * 5); st.add(p); players.push(p);
      const q = T.figure3D(RIVAL(String(i + 4)), { rim: M.rim, pose: POSES.ready }); q.position.set(4 + (i % 3) * 6, 0, -12 + i * 5); q.rotation.y = Math.PI; st.add(q); }
    st.add(T.sphere(0.25, '#ffffff', 0, 0.25, 0));
    return { stage: st };
  },
  draw(s, t, info, T) { T.dolly(s.stage.camera, t, [[0, { pos: [-30, 30, 50], look: [0, 0, 0], fov: V(40, 56) }], [info.dur, { pos: [-8, 5, 16], look: [0, 1, 0], fov: V(40, 56) }]]); },
  overlay(g, t, info) { clockChip(g, t, '20:00', { at: 0.1 }); },
});
// s19 — "Não deu nem trinta segundos."
registerShot('s19', { draw(g, t, info) {
  const sec = Math.min(28, Math.floor(t / info.dur * 31)), k = ease.inOut(t / info.dur), cam = { z: 1.25 + 0.06 * k, x: t * 60, y: V(30, 60) };
  const { M, GY } = stadium(g, t, cam, { crowd: 0.6, scoreboard: scoreboard(0, 0, `00:${String(sec).padStart(2, '0')}`) });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 3; i++) { const x = E.W * 0.1 + i * 200 + t * 420; drawFigure(g, { x, y: GY + V(40, 70) + (i % 2) * 40, s: 1.6, facing: 1, outfit: RIVAL(String(7 + i)), pose: walkPose(t * 2 * Math.PI * 1.6 + i, { run: true }), expr: 'determined', rim: rim(M, [-0.6, -0.8]) }); }
    soccerBall(g, E.W * 0.1 + 520 + t * 430, GY + V(80, 110), 18, t * 10); });
  bigNum(g, t, `${sec}s`, E.W / 2, E.H * 0.74, 0.1, { size: V(120, 130), color: '#ff5050', stroke: 12 });
} });
// s20 — "Gol do Galo."
registerShot('s20', { draw(g, t, info) {
  const M = mood('night'), [sx, sy] = shake(t, 18 * (1 - prog(t, 0.2, 1)), 16), cam = { z: 1.35, x: sx, y: V(60, 120) + sy };
  const { GY } = stadium(g, t, cam, { crowd: 0.9 });
  layer(g, cam, 1, (g) => {
    const gx = E.W * 0.6, top = GY - V(330, 360), p = ease.out(prog(t, 0, 0.25)), bulge = Math.sin(clamp(prog(t, 0.2, 0.7)) * Math.PI) * 60;
    g.strokeStyle = alpha('#ffffff', 0.35); g.lineWidth = 2; for (let i = 0; i <= 10; i++) { g.beginPath(); g.moveTo(gx + i * 30, top); g.quadraticCurveTo(gx + i * 30 + bulge * 0.6, (top + GY) / 2, gx + i * 30, GY); g.stroke(); g.beginPath(); g.moveTo(gx, top + i * (GY - top) / 10); g.lineTo(gx + 300 + bulge * 0.3, top + i * (GY - top) / 10); g.stroke(); }
    seg(g, [[gx, GY], [gx, top], [gx + 320, top]], 14, '#ffffff');
    drawFigure(g, { x: E.W * 0.22, y: GY, s: 2.0, facing: 1, outfit: RIVAL('11'), pose: posesAt(t, [[0, POSES.kick], [0.4, POSES.cheer]], 0.2), expr: 'joy', rim: rim(M, [-0.6, -0.8]) });
    soccerBall(g, lerp(E.W * 0.32, gx + 120 + bulge, p), lerp(GY - 60, top + 140, p), 20, t * 14);
  });
  if (t < 0.3) veil(g, '#ffffff', 0.6 * (1 - t / 0.3), 'lighter');
  bigNum(g, t, '0 x 1', E.W / 2, E.H * 0.18, 0.25, { size: V(150, 160), color: '#ffcc33', stroke: 14, label: 'GOL DO GALO' });
} });
// s21 — "De um cara que não tinha feito um gol na temporada inteira."
registerShot('s21', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, tt = wt('temporada', info, 2.3);
  drawFigure(g, { x: E.W * 0.3, y: E.H * 0.72, s: 2.4, facing: 1, outfit: RIVAL('11'), pose: breathe(POSES.cheer, t), expr: 'joy', rim: { color: ui.blueprint, dir: [0, -1], w: 6 } });
  const cx = E.W * 0.68, cy = E.H * 0.45; rr(g, cx - V(220, 200), cy - 200, V(440, 400), 400, 24); g.fillStyle = ui.card; g.fill(); g.strokeStyle = ui.cardLine; g.lineWidth = 3; g.stroke();
  text(g, 'GOLS NA', cx, cy - 140, { size: V(36, 38), color: ui.text, font: FONTS.ui, weight: 900, spacing: 3 }); text(g, 'TEMPORADA', cx, cy - 95, { size: V(36, 38), color: ui.text, font: FONTS.ui, weight: 900, spacing: 3 });
  const n = t > tt ? 1 : 0, pop = 1 + 0.3 * (1 - ease.out(prog(t, tt, tt + 0.4))) * n;
  g.save(); g.translate(cx, cy + 50); g.scale(pop, pop); text(g, String(n), 0, 0, { size: V(200, 220), color: n ? ui.good : ui.accent, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(n ? ui.good : ui.accent, 0.6) }); g.restore();
  text(g, 'ANTES: 0', cx, cy + 170, { size: V(32, 34), color: ui.sub, font: FONTS.ui, weight: 900, alpha: n });
} });
// s22 — "Na temporada inteira, porra."
registerShot('s22', { draw(g, t, info) {
  faceShot(g, t, info, { who: COACH, where: 'stadium', set: { crowd: 0.9 }, expr: 'angry', look: [0, 0], rimSide: 1, rimColor: '#fffbe8', push: 0.08, y: V(140, 220), shakeAmp: 4 + 6 * prog(t, 1.6, 2.0),
    over: (g, cx, cy, r) => { sweat(g, cx, cy, r, t); for (let i = 0; i < 3; i++) { const a = -2.2 + i * 0.5; seg(g, [[cx + Math.cos(a) * r * 1.15, cy + Math.sin(a) * r * 1.15], [cx + Math.cos(a) * r * 1.4, cy + Math.sin(a) * r * 1.4]], 12, '#ff5050'); } } });
  veil(g, '#ff2020', 0.06 + 0.04 * Math.sin(t * 8), 'lighter');
} });
// s23 — "Oito e um. A Fiel já pediu sua cabeça."
registerShot('s23', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), tb = wt('A Fiel', info, 0.9), cam = { z: 1.2 + 0.08 * k, y: -V(60, 140) * k };
  const { M, GY } = stadium(g, t, cam, { crowd: 1, banners: t > tb ? ['FORA', 'FORA', 'FORA'] : [] });
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.5, y: GY + V(60, 90), s: 1.3, facing: 1, outfit: COACH, pose: breathe(POSES.sad, t), expr: 'sad', look: [0, -1], rim: rim(M, [0, -1]) }));
  clockChip(g, t, '20:01', { at: 0.05 });
} });
// s24 — "Intervalo. Você faz a palestra da sua vida."
registerShot('s24', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.3 + 0.07 * k, x: V(40, 30), y: V(40, 100) }, tp = wt('palestra', info, 1.6);
  const board = (g, x, y, w, h) => { g.strokeStyle = '#2a7a3a'; g.lineWidth = 4; g.strokeRect(x + 20, y + 20, w - 40, h - 40); seg(g, [[x + w / 2, y + 20], [x + w / 2, y + h - 20]], 3, '#2a7a3a'); for (let i = 0; i < 4; i++) { text(g, 'O', x + w * (0.2 + i * 0.12), y + h * (0.3 + (i % 2) * 0.35), { size: 34, color: '#1a1a6a', font: FONTS.ui, weight: 900 }); text(g, 'X', x + w * (0.62 + i * 0.08), y + h * (0.25 + (i % 3) * 0.22), { size: 34, color: '#d02020', font: FONTS.ui, weight: 900 }); }
    const p = prog(t, tp, tp + 1.5); g.strokeStyle = '#d02020'; g.lineWidth = 5; g.beginPath(); for (let i = 0; i <= 30 * p; i++) { const u = i / 30, xx = x + w * (0.25 + 0.5 * u), yy = y + h * (0.7 - 0.4 * Math.sin(u * 3)); i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); };
  const { M, GY, WB } = locker(g, t, cam, { board });
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 3; i++) drawFigure(g, { x: E.W * (0.52 + i * 0.16), y: GY - 10, s: 1.6, facing: -1, outfit: PLAYER(String(5 + i * 3)), pose: breathe(POSES.sit, t, 1, i), expr: i === 1 ? 'sleepy' : 'neutral', look: [-1, -0.2], rim: rim(M, [0, -1], 4) });
    drawFigure(g, { x: E.W * 0.2, y: GY, s: 2.0, facing: 1, outfit: COACH, pose: posesAt(t, [[0, POSES.explain], [0.8, POSES.point], [1.6, POSES.explain], [2.4, POSES.pointUp]]), expr: 'determined', talk: 0.6 + 0.4 * Math.sin(t * 10), look: [1, 0], rim: rim(M, [1, -0.4]) });
    FX.rings(g, E.W * 0.2 + 30, GY - 400, t, { count: 3, r0: 40, r1: 160, color: '#ffffff', a: 0.35 });
  });
  UI.badge(g, { str: 'INTERVALO', size: V(46, 52), y: V(120, 260), a: prog(t, 0.05, 0.3) });
} });
// s25 — "O time volta pior."  arrows running backwards
registerShot('s25', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, x0 = E.W * 0.12, x1 = E.W * 0.88, y0 = E.H * 0.24, y1 = E.H * 0.72;
  g.fillStyle = alpha('#2a7a3a', 0.35); g.fillRect(x0, y0, x1 - x0, y1 - y0); g.strokeStyle = alpha('#ffffff', 0.6); g.lineWidth = 4; g.strokeRect(x0, y0, x1 - x0, y1 - y0); seg(g, [[x0, (y0 + y1) / 2], [x1, (y0 + y1) / 2]], 3, alpha('#ffffff', 0.6)); ring(g, E.W / 2, (y0 + y1) / 2, 70, 3, alpha('#ffffff', 0.6));
  const p = ease.inOut(prog(t, 0.1, info.dur - 0.3));
  for (let i = 0; i < 10; i++) { const r = rng(i + 3), x = lerp(x0 + 60, x1 - 60, r()), ys = lerp((y0 + y1) / 2 - 40, y0 + 60, r()), y = lerp(ys, ys + (y1 - y0) * 0.35, p); circle(g, x, y, 18, WHITE); seg(g, [[x, ys], [x, y - 22]], 4, alpha('#ff5050', 0.8)); poly(g, [[x - 10, y - 24], [x + 10, y - 24], [x, y - 8]], '#ff5050'); }
  bigNum(g, t, 'PIOR', E.W / 2, E.H * 0.14, 0.5, { size: V(120, 130), color: '#ff5050', stroke: 12 });
} });
// s26 — "Nove da noite, você olha pro banco procurando uma solução."   s27 — "O banco olha de volta."
function benchRow(g, t, GY, M, s, faceCam) {
  bench(g, E.W * 0.1, GY, M, 6, s);
  for (let i = 0; i < 5; i++) { const x = E.W * 0.16 + i * 120 * s; drawFigure(g, { x, y: GY - 10, s: 1.3 * s / 1.2, facing: -1, outfit: PLAYER(String(12 + i)), pose: breathe(POSES.sit, t, 1, i), expr: 'neutral', look: faceCam ? [0, 0] : [-1, 0], rim: rim(M, [0, -1], 4), blink: (t % (2.7 + i * 0.4)) > (2.6 + i * 0.4) }); }
}
registerShot('s26', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.3 + 0.06 * k, x: -V(60, 40) * k, y: V(40, 90) }, tb = wt('banco', info, 1.8);
  const { M, GY } = stadium(g, t, cam, { crowd: 0.5 });
  layer(g, cam, 1, (g) => { benchRow(g, t, GY, M, 1.2, false); drawFigure(g, { x: E.W * 0.85, y: GY + V(60, 90), s: 2.0, facing: t > tb ? -1 : 1, outfit: COACH, pose: breathe(t > tb ? POSES.think : POSES.handsOnHead, t), expr: t > tb ? 'thinking' : 'worried', look: t > tb ? [-1, 0] : [1, -0.3], rim: rim(M, [0, -1]) }); });
  clockChip(g, t, '21:00', { at: 0.1 });
} });
registerShot('s27', { draw(g, t, info) {
  const M = mood('night'); bgBlur(g, t, 'stadium', { z: 1.5, veil: 0.45, set: { crowd: 0.3 } });
  const z = 1 + 0.06 * ease.inOut(t / info.dur);
  zoomAt(g, E.W / 2, E.H * 0.5, z, () => { g.fillStyle = alpha('#cfe6ff', 0.1); g.fillRect(-100, E.H * 0.28, E.W + 200, E.H * 0.36); g.fillStyle = shade(M.dark, -0.4); g.fillRect(-100, E.H * 0.26, E.W + 200, 30);
    for (let i = 0; i < 4; i++) { const x = E.W * (0.14 + i * 0.24), y = E.H * 0.45 + (i % 2) * 20; bigFace(g, x, y, V(110, 120), { outfit: PLAYER(String(12 + i)), expr: 'neutral', face: { mouth: 'flat', eyes: 'dot' }, look: [0, 0], rimColor: M.rim, rimSide: i % 2 ? 1 : -1, blink: (t % (2.2 + i * 0.3)) > (2.1 + i * 0.3) }); } });
  if (t > 0.7) text(g, '...', E.W / 2, E.H * 0.75, { size: V(120, 130), color: S().ui.cream, font: FONTS.title, alpha: prog(t, 0.7, 1.0) });
} });
// s28 — "Mas calma. Quarta passada, quatro a zero no Botafogo."  warm flashback
registerShot('s28', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.15 + 0.07 * k, y: V(20, 50) }, t4 = wt('quatro', info, 2.1);
  const { M, GY } = stadium(g, t, cam, { phase: 'warm', crowd: 1, scoreboard: scoreboard(t > t4 ? 4 : 0, 0, 'FIM') });
  layer(g, cam, 1, (g) => { for (let i = 0; i < 3; i++) drawFigure(g, { x: E.W * (0.25 + i * 0.25), y: GY + V(50, 80) - Math.abs(Math.sin(t * 5 + i)) * 50, s: 1.5, facing: i % 2 ? -1 : 1, outfit: PLAYER(String([9, 10, 7][i])), pose: POSES.cheer, expr: 'joy', rim: rim(M, [0, -1]) }); });
  veil(g, '#a07040', 0.15, 'multiply');
  UI.badge(g, { str: 'QUARTA PASSADA', size: V(44, 50), y: V(120, 260), a: prog(t, 0.6, 0.9) });
  bigNum(g, t, '4 x 0', E.W / 2, E.H * 0.82, t4, { size: V(140, 150), color: '#ffcc33', stroke: 12 });
} });
// s29 — "Hat-trick do Caio César."
registerShot('s29', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.6 + 0.06 * k, y: V(80, 170) };
  const { M, GY } = stadium(g, t, cam, { phase: 'warm', crowd: 1 });
  layer(g, cam, 1, (g) => { const f = { x: E.W * 0.45, y: GY + V(40, 60), s: 2.3, facing: 1, outfit: PLAYER('9'), pose: breathe({ ...POSES.cheer }, t), expr: 'joy', rim: rim(M, [0, -1]) }; drawFigure(g, f);
    for (let i = 0; i < 3; i++) { const a = ease.outBack(prog(t, 0.2 + i * 0.3, 0.5 + i * 0.3)); if (a > 0) { g.save(); g.translate(E.W * (0.3 + i * 0.2), GY - V(780, 860) + Math.sin(t * 3 + i) * 10); g.scale(a, a); soccerBall(g, 0, 0, 40, t * 2 + i); g.restore(); } } });
  veil(g, '#a07040', 0.15, 'multiply');
  bigNum(g, t, 'HAT-TRICK', E.W / 2, E.H * 0.16, 0.9, { size: V(130, 140), color: '#ffcc33', stroke: 14 });
} });
// s30 — "Corintiano te manda tomar no cu na segunda e te pede em casamento na quarta."
registerShot('s30', { draw(g, t, info) {
  const tq = wt('casamento', info, 3.4) - 0.3, after = t > tq, k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.05 * k, y: V(80, 170) };
  const { M, GY } = stadium(g, t, cam, { phase: after ? 'warm' : 'night', crowd: 0.7 });
  layer(g, cam, 1, (g) => { const f = { x: E.W * 0.45, y: GY + V(40, 60), s: 2.2, facing: 1, outfit: FAN, pose: after ? breathe({ ...POSES.kneel, eF: [36, -140], hF: [64, -150] }, t) : breathe(POSES.point, t, 2), expr: after ? 'joy' : 'angry', talk: after ? 0 : 0.5 + 0.5 * Math.sin(t * 12), look: [1, after ? -0.4 : 0], rim: rim(M, [0, -1]) };
    drawFigure(g, f); if (!after) FX.rings(g, f.x + 40, f.y - 420, t, { count: 3, r0: 40, r1: 180, color: '#ff5050', a: 0.4 });
    else { const p = headPos(f); const hx = f.x + 64 * f.s, hy = f.y - 150 * f.s; ring(g, hx + 10, hy - 20, 22, 8, '#ffcc33'); FX.sparkle(g, hx + 10, hy - 42, 30, '#ffffff'); for (let i = 0; i < 6; i++) { const u = (t * 0.5 + i / 6) % 1; text(g, '♥', f.x - 150 + i * 60, f.y - 500 - u * 200, { size: 50, color: '#ff5080', alpha: Math.sin(u * Math.PI) }); } } });
  if (t > tq - 0.1 && t < tq + 0.2) veil(g, '#ffffff', 0.4, 'lighter');
  UI.badge(g, { str: after ? 'QUARTA' : 'SEGUNDA', size: V(70, 80), y: V(150, 300), color: after ? '#ffcc33' : '#ff5050' });
} });
// s31 — "No Corinthians, técnico não tem contrato."
registerShot('s31', { draw(g, t, info) {
  bgBlur(g, t, 'office', { z: 1.6, veil: 0.45 }); const tc = wt('contrato.', info, 1.9), z = 1 + 0.05 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.46, w = V(620, 680), h = w * 1.3;
  zoomAt(g, cx, cy, z, () => { g.save(); g.translate(cx, cy); g.rotate(-0.03); g.fillStyle = alpha('#000', 0.35); rr(g, -w / 2 + 16, -h / 2 + 22, w, h, 8); g.fill(); rr(g, -w / 2, -h / 2, w, h, 8); g.fillStyle = '#f3efe4'; g.fill();
    text(g, 'CONTRATO', 0, -h * 0.38, { size: w * 0.11, color: '#2a2430', font: FONTS.serif, weight: 900 }); for (let i = 0; i < 8; i++) seg(g, [[-w * 0.38, -h * 0.25 + i * h * 0.07], [w * (0.38 - (i % 3) * 0.08), -h * 0.25 + i * h * 0.07]], 4, alpha('#3a3a5a', 0.35)); seg(g, [[w * 0.05, h * 0.38], [w * 0.38, h * 0.38]], 3, '#2a2430'); text(g, 'TÉCNICO', w * 0.21, h * 0.43, { size: 22, color: '#2a2430', font: FONTS.ui, weight: 900 }); g.restore();
    const p = ease.out(prog(t, tc, tc + 0.25)); if (p > 0) { seg(g, [[cx - w * 0.45, cy - h * 0.45], [lerp(cx - w * 0.45, cx + w * 0.45, p), lerp(cy - h * 0.45, cy + h * 0.45, p)]], 30, alpha('#d02020', 0.9)); seg(g, [[cx + w * 0.45, cy - h * 0.45], [lerp(cx + w * 0.45, cx - w * 0.45, p), lerp(cy - h * 0.45, cy + h * 0.45, p)]], 30, alpha('#d02020', 0.9)); } });
} });
// s32 — "Tem prazo de validade."
registerShot('s32', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.7 + 0.06 * k, x: V(40, 20), y: V(90, 190) }, tv = wt('validade.', info, 1.15);
  const { M, GY } = office(g, t, cam, { chair: false });
  layer(g, cam, 1, (g) => { const f = { x: E.W * 0.45, y: GY, s: 2.2, facing: 1, outfit: COACH, pose: breathe(POSES.stand, t), expr: t > tv ? 'shocked' : 'neutral', look: [0, 0.4], rim: rim(M, [-1, -0.4]) }; drawFigure(g, f);
    const p = ease.outBack(prog(t, tv - 0.15, tv + 0.15)); if (p > 0) { const lx = f.x + 6 * f.s, ly = f.y - 145 * f.s; g.save(); g.translate(lx, ly); g.rotate(-0.12); g.scale(p, p); rr(g, -120, -60, 240, 120, 10); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#2a2430'; g.lineWidth = 3; g.stroke();
      for (let i = 0; i < 22; i++) g.fillRect(-100 + i * 8, -44, i % 3 ? 3 : 5, 44); g.fillStyle = '#2a2430'; text(g, 'VALIDADE:', 0, 22, { size: 26, color: '#2a2430', font: FONTS.ui, weight: 900 }); text(g, 'QUARTA', 0, 46, { size: 26, color: '#d02020', font: FONTS.ui, weight: 900 }); g.restore(); } });
  bigNum(g, t, 'PRAZO DE VALIDADE', E.W / 2, E.H * 0.16, tv, { size: V(84, 90), color: '#ff5050', stroke: 10 });
} });
// s33 — "Se esse vexame acontece de verdade,"  floodlights powering on
registerShot('s33', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.05 + 0.06 * k, y: V(0, 20) }, L = prog(t, 0.4, 0.5) * 0.5 + prog(t, 1.0, 1.1) * 0.5;
  stadium(g, t, cam, { lights: L, crowd: 0.2 });
  veil(g, '#000', 0.35 * (1 - L));
} });
// s34 — "quarta, oito da noite, a gente descobre."
registerShot('s34', { draw(g, t, info) {
  faceShot(g, t, info, { who: COACH, where: 'stadium', set: { crowd: 0.6 }, expr: 'worried', look: [0.2, -0.3], rimSide: 1, rimColor: '#fffbe8', push: 0.06, y: V(260, 360), over: (g, cx, cy, r) => { sweat(g, cx, cy, r, t); sweat(g, cx - r * 1.45, cy + r * 0.1, r * 0.9, t + 0.5); } });
  UI.titleCard(g, t, { lines: ['QUARTA', '20:00'], sub: 'A GENTE DESCOBRE', dur: info.dur + 1, y: E.H * 0.2 });
} });
