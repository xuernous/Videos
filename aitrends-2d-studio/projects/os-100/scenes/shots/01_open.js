// shots/01_open.js — cold open: the clock, the silence rule, the floor that vanishes, the title, waking up, the 99, the number.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { room, roomGround, wallBase, hole, ALARM } from '../sets/room.js';
import { faceShot, sweat, counter, chestInsert, players, wave } from '../sets/kit.js';
import { P77, P41, EXTRA } from '../cast.js';

export const CROWD_A = [
  { x: 120, d: 0.35, who: EXTRA(12), facing: 1, seed: 1 }, { x: 330, d: 0.25, who: EXTRA(58), facing: -1, seed: 2 }, { x: 760, d: 0.3, who: EXTRA(3), facing: -1, seed: 3 },
  { x: 950, d: 0.42, who: EXTRA(90), facing: -1, seed: 4 }, { x: 560, d: 0.15, who: EXTRA(27), facing: 1, seed: 5 }, { x: -60, d: 0.6, who: EXTRA(64), facing: 1, seed: 6 },
  { x: 1150, d: 0.7, who: EXTRA(19), facing: -1, seed: 7 }, { x: 240, d: 0.62, who: EXTRA(33), facing: 1, seed: 8 }, { x: 880, d: 0.66, who: EXTRA(8), facing: -1, seed: 9 },
];

// s01 — "Você tem 10 minutos."  the red clock flickers on above the frozen players
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.0 + 0.07 * k, y: -V(60, 90) * k };
  const on = t < 0.25 ? 0 : t < 0.45 ? (Math.sin(t * 90) > 0 ? 1 : 0.15) : 1;
  const { M } = room(g, t, cam, { clock: '10:00', clockOn: on, lights: 0.55 });
  layer(g, cam, 1, (g) => {
    players(g, t, CROWD_A, M, { frozen: true, s: 1.7 });
    players(g, t, [{ x: E.W / 2 + 40, d: 0.95, who: P77, facing: -1, expr: 'nervous', look: [0.2, -1] }], M, { s: 1.7 });
  });
  veil(g, ALARM(), 0.05 * on, 'lighter');
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s02 — "Se fizer um único som,"  77 holds his breath; a faint red ring hints at the danger of sound
registerShot('s02', { draw(g, t, info) {
  faceShot(g, t, info, { who: P77, expr: 'nervous', look: [0.25, 0], rimSide: -1, push: 0.06,
    over: (g, cx, cy, r) => { sweat(g, cx, cy, r, t); const a = 0.5 * prog(t, 0.6, 1.0); FX.rings(g, cx + r * 0.05, cy + r * 0.42, t, { count: 2, r0: r * 0.15, r1: r * 0.6, speed: 1.2, color: ALARM(), a, w: 4 }); } });
} });

// s03 — "o chão some."  a player's tile drops away
registerShot('s03', { draw(g, t, info) {
  const GY = roomGround(), cam = { z: V(1.5, 1.5), x: V(60, 40), y: V(40, 150) };
  const [sx, sy] = shake(t, 14 * (1 - prog(t, 0.5, 1.3)) * (t > 0.5 ? 1 : 0), 20);
  const { M } = room(g, t, { ...cam, x: cam.x + sx, y: cam.y + sy });
  layer(g, { ...cam, x: cam.x + sx, y: cam.y + sy }, 1, (g) => {
    const x = E.W / 2, open = ease.out(prog(t, 0.3, 0.55));
    const q = [[x - 120, GY - 22], [x + 120, GY - 22], [x + 140, GY + 34], [x - 140, GY + 34]];
    hole(g, q, open, t);
    const fall = Math.max(0, t - 0.42), dy = 0.5 * 2600 * fall * fall;
    g.save(); g.beginPath(); g.rect(-E.W, -E.H, E.W * 3, GY + 34 + E.H); g.clip();
    drawFigure(g, { x, y: GY + dy, s: 1.45, facing: 1, outfit: EXTRA(52), pose: t < 0.42 ? breathe(POSES.stand, t) : POSES.fall, expr: t < 0.35 ? 'worried' : 'scared', rim: { color: M.rim, dir: [0, -1] }, shadow: t < 0.35 });
    g.restore();
    drawFigure(g, { x: x - 360, y: GY, s: 1.45, facing: 1, outfit: EXTRA(5), pose: posesAt(t, [[0, POSES.stand], [0.7, POSES.handsOnHead]]), expr: t > 0.7 ? 'shocked' : 'worried', rim: { color: M.rim, dir: [0, -1] } });
    drawFigure(g, { x: x + 380, y: GY, s: 1.45, facing: -1, outfit: EXTRA(71), pose: posesAt(t, [[0, POSES.stand], [0.75, POSES.crouch]]), expr: t > 0.75 ? 'scared' : 'worried', rim: { color: M.rim, dir: [0, -1] } });
  });
  if (t > 0.5) { const a = 1 - prog(t, 0.5, 1.2); veil(g, ALARM(), 0.12 * a, 'lighter'); FX.speedLines(g, t, { cx: E.W / 2, cy: roomGround(), count: 40, color: '#ffd0c8', a: 0.3 * a }); }
  FX.dust(g, t, { count: 30, color: M.key, a: 0.3 });
} });

// s04 — "Restam 100."  title over the blurred hall
registerShot('s04', { draw(g, t, info) {
  blurLayer(g, 16, (g) => room(g, t, { z: 1.2 + 0.05 * t, y: -V(100, 200) }, { clock: '10:00' })); veil(g, '#05050b', 0.6);
  text(g, 'OS 100', E.W / 2, E.H * 0.3, { size: V(64, 70), color: S().ui.cream, font: FONTS.title, weight: 700, spacing: 14, glow: 20, glowColor: 'rgba(255,120,90,.6)', alpha: ease.out(prog(t, 0.0, 0.5)) * clamp((info.dur - t) / 0.3) });
  UI.titleCard(g, t, { lines: ['RESTAM', '100'], dur: info.dur, y: E.H * 0.47 });
  FX.dust(g, t, { count: 30, color: '#ffc0b0', a: 0.35 });
} });

// s05 — "Você acorda num chão branco e frio."  77 lying on the cold tiles, eyes opening
registerShot('s05', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: V(1.55, 1.6) + 0.1 * k, x: -V(30, 20) * k, y: V(80, 120) };
  const { M } = room(g, t, cam, { lights: 1 });
  layer(g, cam, 1, (g) => {
    const x = E.W / 2 + 20, y = GY + 20;
    g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(x, y + 4, 190, 16, 0, 0, 7); g.fill();
    const open = t > 1.0;
    drawFigure(g, { x, y: y + 100 * 1.4 - 16, s: 1.4, facing: 1, outfit: P77, pose: POSES.lie, rot: -Math.PI / 2, expr: open ? (t > 2.0 ? 'surprised' : 'neutral') : 'sleepy', blink: t > 1 && t < 1.15, look: [0, -1], rim: { color: M.rim, dir: [0, -1] }, shadow: false });
  });
  FX.dust(g, t, { count: 50, color: M.key, a: 0.35 });
  veil(g, '#000', 0.5 * (1 - prog(t, 0, 1.2)));
} });

// s06 — "Ao seu redor, 99 desconhecidos."  3D orbit of the hall full of players
registerShot('s06', {
  kind: '3d',
  init(T) {
    const M = mood('interiorCool'), { THREE } = T;
    const st = T.stage({ mood: 'interiorCool', fov: V(36, 54), fog: [10, 34], keyPos: [0, 14, 2], keyIntensity: 2.2, ambient: 0.9, sky: [shade(M.dark, -0.4), M.dark] });
    st.add(T.ground(60, 60, mix(M.floor, '#dfe5f2', 0.45), T.tiles(mix(M.floor, '#dfe5f2', 0.45), 6, [10, 10])));
    for (const [x, z, w, d] of [[0, -11, 30, 0.4], [0, 11, 30, 0.4], [-11, 0, 0.4, 30], [11, 0, 0.4, 30]]) st.add(T.box(w, 9, d, shade(M.wall, -0.35), x, 4.5, z));
    for (const x of [-5, 0, 5]) { const strip = T.box(4, 0.08, 0.5, T.basic(mix(M.key, '#ffffff', 0.6)), x, 7.5, 0); st.add(strip); const s = T.shaft(3.2, 7.5, M.key, 0.05); s.position.set(x, 3.8, 0); st.add(s); }
    const ctex = T.canvasTex(512, 200, (c, w, h) => { c.fillStyle = '#120608'; c.fillRect(0, 0, w, h); c.fillStyle = ALARM(); c.font = '900 150px Nunito'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.shadowColor = ALARM(); c.shadowBlur = 20; c.fillText('10:00', w / 2, h / 2 + 8); });
    const clock = T.box(3, 1.2, 0.1, new THREE.MeshBasicMaterial({ map: ctex }), 0, 5.5, -10.75); st.add(clock);
    const hero = T.figure3D(P77, { rim: M.rim, pose: POSES.stand }); st.add(hero);
    const r = (i) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
    for (let i = 0; i < 46; i++) { const a = i * 2.39996, d = 1.4 + Math.sqrt(i) * 0.75; const f = T.figure3D(EXTRA(i), { rim: M.rim, pose: [POSES.stand, POSES.crossArms, POSES.relaxed, POSES.handsOnHead][i % 4], s: 0.95 + r(i) * 0.1 }); f.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); f.rotation.y = r(i + 7) * 6.28; st.add(f); }
    return { stage: st };
  },
  draw(s, t, info, T) { T.orbit(s.stage.camera, t, { target: [0, 0.9, 0], radius: [V(10, 12.5), V(8, 9.5)], height: [5.5, 2.2], from: -0.5, to: 0.35, dur: info.dur }); },
  overlay(g, t, info) {
    const tw = (wordTime('99', info.shot.start) ?? info.shot.start + 1.4) - info.shot.start;
    const k = ease.outBack(prog(t, tw, tw + 0.5)), a = prog(t, tw, tw + 0.2) * clamp((info.dur - t) / 0.3);
    if (a > 0) { text(g, '99', E.W / 2, E.H * 0.2, { size: V(200, 240) * (0.8 + 0.2 * k), color: S().ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(S().ui.gold, 0.6), alpha: a }); text(g, 'DESCONHECIDOS', E.W / 2, E.H * 0.2 + V(130, 150), { size: V(40, 46), color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 6, alpha: a }); }
  },
});

// s07 — "No seu peito, um número, 77."
registerShot('s07', { draw(g, t, info) {
  const tw = (wordTime('77', info.shot.start) ?? info.shot.start + 2.0) - info.shot.start;
  chestInsert(g, t, info, P77, { at: tw - 0.1, hand: (g) => {
    const k = ease.inOut(prog(t, 0.2, 1.2)), hx = lerp(E.W + 260, E.W * 0.74, k), hy = E.H * 0.6, ink = S().ink, rim = mood('interiorCool').rim;
    for (const [c, o] of [[rim, -5], [ink, 0]]) { g.save(); g.translate(o, o);
      seg(g, [[hx + 60, hy + 30], [E.W + 400, hy + 380]], 130, o ? c : shade(P77.color, -0.15));
      rr(g, hx - 60, hy - 50, 150, 110, 50); g.fillStyle = c; g.fill();
      for (let i = 0; i < 4; i++) seg(g, [[hx - 20, hy - 30 + i * 28], [hx - 95 - (i === 0 ? 40 : 0), hy - 40 + i * 30]], 30, c);
      g.restore(); }
  } });
} });
