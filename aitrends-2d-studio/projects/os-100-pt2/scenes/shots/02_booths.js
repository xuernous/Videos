// shots/02_booths.js — the glass booths: the rules, the countdown, "não aperte", the lights going out, the press, the empty booth.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { room, roomGround, hole, ALARM, wallClock, speaker } from '../sets/room.js';
import { apt } from '../sets/apt.js';
import { faceShot, sweat, counter, clockInsert, mmss, speakerInsert, ghost, wave } from '../sets/kit.js';
import { cabins, cabinGlassAll, cabinGeo, boothInterior, boothGlass, redButton, boothRow, BTN_RED } from '../sets/booth.js';
import { P77, P41, MOM, EXTRA } from '../cast.js';
import { wt } from './01_choice.js';

const rimC = (M, d = [0, -1]) => ({ color: M.rim, dir: d, w: 5 });
const PRESS = { ...POSES.reach, eF: [34, -150], hF: [62, -132] };
const HANDGLASS = { ...POSES.reach, eF: [30, -186], hF: [58, -214] };
const boothBg = (o = {}) => (g, t) => cabins(g, t, { z: o.z ?? 1.5, x: o.x ?? 0, y: o.y ?? V(60, 120) }, o);

// both booths with figures. o: {cam, lightL, lightR, p77, e77, p41, e41, show41, a41, talk41, look77}
function booths(g, t, info, o = {}) {
  const k = ease.inOut(t / info.dur), cam = o.cam || { z: V(1.0, 1.02) + 0.06 * k, y: V(0, 30) };
  const geo = cabins(g, t, cam, o), { M, GY, L, R } = geo;
  layer(g, cam, 1, (g) => {
    const s = V(1.6, 1.75);
    if (o.show77 !== false) drawFigure(g, { x: L.fig, y: GY, s, facing: 1, outfit: P77, pose: o.p77 ? o.p77(t) : breathe(POSES.stand, t), expr: o.e77 ? o.e77(t) : 'worried', look: o.look77 || [1, 0], rim: rimC(M, [0, -1]), alpha: (o.lightL ?? 1) < 0.1 ? 0.25 : 1 });
    if (o.show41 !== false) drawFigure(g, { x: R.fig, y: GY, s, facing: -1, outfit: P41, pose: o.p41 ? o.p41(t) : breathe(POSES.stand, t, 1, 2), expr: o.e41 ? o.e41(t) : 'determined', talk: o.talk41 ? o.talk41(t) : 0, look: [-1, 0], rim: rimC(M, [0, -1]), alpha: o.a41 ?? 1, dim: (o.lightR ?? 1) < 0.5 });
    o.inside?.(g, geo, s);
  });
  cabinGlassAll(g, t, cam, geo, o);
  o.over?.(g, geo);
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
  return geo;
}

// s15 — "Cada dupla entra em duas cabines de vidro, frente a frente."  3D hall of booths
registerShot('s15', {
  kind: '3d',
  init(T) {
    const M = mood('interiorCool'), { THREE } = T;
    const st = T.stage({ mood: 'interiorCool', fov: V(38, 56), fog: [8, 30], keyPos: [0, 12, 4], keyIntensity: 0.6, ambient: 0.35, sky: [shade(M.dark, -0.7), shade(M.dark, -0.5)] });
    st.add(T.ground(60, 60, shade(M.floor, -0.5)));
    const glassM = new THREE.MeshStandardMaterial({ color: '#9fe0ff', transparent: true, opacity: 0.12, roughness: 0.1, metalness: 0.2, side: THREE.DoubleSide, depthWrite: false });
    const edgeM = new THREE.LineBasicMaterial({ color: M.rim });
    const lightM = T.basic(mix(M.key, '#ffffff', 0.6));
    const booth = (x, z, who) => {
      const box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.4, 1.4), glassM); box.position.set(x, 1.2, z); st.add(box);
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), edgeM); e.position.copy(box.position); st.add(e);
      st.add(T.box(0.8, 0.04, 0.1, lightM, x, 2.36, z));
      const sh = T.shaft(1.2, 2.3, M.key, 0.07); sh.position.set(x, 1.2, z); st.add(sh);
      st.add(T.cyl(0.06, 0.06, 0.9, '#2a2c40', x + (z > 0 ? 0 : 0), 0.45, z + (z > 0 ? -0.45 : 0.45)), T.cyl(0.09, 0.09, 0.06, T.basic(BTN_RED), x, 0.92, z + (z > 0 ? -0.45 : 0.45)));
      const f = T.figure3D(who, { rim: M.rim, pose: POSES.stand }); f.position.set(x, 0, z); f.rotation.y = z > 0 ? Math.PI / 2 : -Math.PI / 2; st.add(f);
    };
    for (let i = -4; i <= 4; i++) { booth(i * 2.2, -1.3, i === 0 ? P77 : EXTRA(i + 20)); booth(i * 2.2, 1.3, i === 0 ? P41 : EXTRA(i + 40)); }
    return { stage: st };
  },
  draw(s, t, info, T) { T.dolly(s.stage.camera, t, [[0, { pos: [-13, 5.5, 0], look: [-2, 0.8, 0] }], [info.dur, { pos: [-8.5, 3.6, 0], look: [3, 1.0, 0] }]]); },
});

// s16 — "Lá dentro, nenhum som passa."  77 knocks; the rings die at the glass
registerShot('s16', { draw(g, t, info) {
  booths(g, t, info, { cam: { z: V(1.25, 1.3), x: -V(140, 120), y: V(20, 60) },
    p77: (t) => posesAt(t, [[0, POSES.stand], [0.4, { ...POSES.reach, hF: [70, -190] }], [0.55, { ...POSES.reach, hF: [60, -186] }], [0.8, { ...POSES.reach, hF: [70, -190] }]], 0.12), e77: () => 'worried',
    inside: (g, geo, s) => { const { L, GY } = geo; g.save(); g.beginPath(); g.rect(L.x0, L.top, L.x1 - L.x0, GY - L.top); g.clip();
      for (const tk of [0.55, 0.95]) if (t > tk) FX.rings(g, L.x1 - 10, GY - 190 * s, t - tk, { count: 3, r0: 10, r1: 260, speed: 1.2, color: '#ffffff', a: 0.5 * (1 - prog(t, tk, tk + 1.2)), w: 3 });
      g.restore(); },
    over: (g, geo) => { const ui = S().ui, a = prog(t, 1.2, 1.5); text(g, '0 dB', (geo.L.x1 + geo.R.x0) / 2, geo.L.top - 60, { size: V(40, 46), color: ui.cream, font: FONTS.ui, weight: 900, alpha: a, spacing: 3 }); } });
} });

// s17 — "Na sua frente, um botão vermelho."
registerShot('s17', { draw(g, t, info) {
  blurLayer(g, 12, boothBg({ z: 2.2, x: -V(250, 230), y: V(250, 300) })); veil(g, '#05050b', 0.3);
  const z = 1.0 + 0.1 * ease.inOut(t / info.dur), bx = E.W / 2, by = E.H * 0.52;
  g.save(); g.translate(bx, by); g.scale(z, z); g.translate(-bx, -by);
  redButton(g, bx, by, 4.4, { floor: E.H * 1.3, glow: 0.6 + 0.4 * ease.out(prog(t, 0.2, 0.8)) });
  g.restore();
  FX.dust(g, t, { count: 30, color: '#ffb0b0', a: 0.3 });
} });

// s18 — "Jogo 2. Dois botões."
registerShot('s18', { draw(g, t, info) {
  blurLayer(g, 18, boothBg({ z: 1.1 })); veil(g, '#04040a', 0.6);
  const ui = S().ui, a1 = ease.out(prog(t, 0.05, 0.35)) * clamp((info.dur - t) / 0.3);
  text(g, 'JOGO 2', E.W / 2, E.H * 0.34, { size: V(120, 140) * (1 + 0.02 * t), color: ui.cream, font: FONTS.title, weight: 700, spacing: 8, glow: 30, glowColor: 'rgba(255,90,170,.8)', alpha: a1 });
  const tb = wt('dois', info, 1.1), k = ease.outBack(prog(t, tb - 0.05, tb + 0.35));
  if (k > 0) { for (const dx of [-1, 1]) { g.save(); g.translate(E.W / 2 + dx * V(200, 210), E.H * 0.56); g.scale(k, k); redButton(g, 0, 0, 2.2, { floor: 160 }); g.restore(); }
    text(g, 'DOIS BOTÕES', E.W / 2, E.H * 0.68, { size: V(56, 64), color: ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: clamp(k) * clamp((info.dur - t) / 0.3) }); }
} });

// s19 — "Diz a voz."  ceiling speaker inside the booth
registerShot('s19', { draw(g, t, info) { speakerInsert(g, t, info, { voice: 1, ringColor: '#ffffff', bg: boothBg({ z: 1.8, y: -V(200, 300) }) }); } });

// blueprint rule diagram: two booths, who presses, the outcome
function rule(g, t, info, o) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui;
  const xs = [E.W / 2 - V(250, 250), E.W / 2 + V(250, 250)], fy = E.H * 0.6, bw = V(300, 400), bh = V(520, 720);
  const tp = o.tPress, tr = o.tResult;
  xs.forEach((x, i) => {
    g.strokeStyle = alpha(c, 0.8); g.lineWidth = 4; g.strokeRect(x - bw / 2, fy - bh, bw, bh);
    const pressed = o.press[i] && t > tp, bxp = x + (i ? -1 : 1) * bw * 0.28;
    seg(g, [[bxp, fy], [bxp, fy - 190]], 6, alpha(c, 0.8)); circle(g, bxp, fy - 200 + (pressed ? 8 : 0), 26, pressed ? BTN_RED : alpha(BTN_RED, 0.6)); if (pressed) glow(g, bxp, fy - 200, 90, BTN_RED, 0.6);
    const pose = o.press[i] ? posesAt(t, [[0, POSES.stand], [tp - 0.25, PRESS]]) : (o.hold ? POSES.crossArms : POSES.stand);
    const res = tr > 0 && t > tr ? o.result[i] : null, col = res === 'win' ? ui.gold : res === 'lose' ? alpha(ui.accent, 0.8) : c;
    UI.lineFigure(g, { x: x - (i ? -1 : 1) * bw * 0.12, y: fy - 6, s: 1.5, pose, color: col, facing: i ? -1 : 1 });
    if (res) { const k = ease.outBack(prog(t, tr, tr + 0.35)); g.save(); g.translate(x, fy - bh - 90); g.scale(k, k);
      if (res === 'win') { ring(g, 0, 0, 56, 7, ui.gold); seg(g, [[-26, 2], [-6, 22], [28, -20]], 9, ui.gold); glow(g, 0, 0, 120, ui.gold, 0.35); }
      else { ring(g, 0, 0, 56, 7, ui.accent); seg(g, [[-24, -24], [24, 24]], 9, ui.accent); seg(g, [[24, -24], [-24, 24]], 9, ui.accent); }
      g.restore(); }
  });
  text(g, o.title, E.W / 2, E.H * 0.13, { size: V(56, 64), color: o.titleColor || ui.cream, font: FONTS.title, weight: 700, spacing: 4, glow: 18, glowColor: alpha(o.titleColor || ui.cream, 0.5), alpha: ease.out(prog(t, 0.05, 0.4)) });
  if (o.label && t > tr) text(g, o.label, E.W / 2, E.H * 0.7, { size: V(50, 58), color: o.labelColor, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tr + 0.1, tr + 0.4)) });
}
// s20 — "Se só um apertar, quem apertou passa."
registerShot('s20', { draw(g, t, info) { rule(g, t, info, { title: 'SÓ UM APERTA', press: [true, false], tPress: wt('apertar', info, 0.9), tResult: wt('passa', info, 2.2), result: ['win', 'lose'], label: 'QUEM APERTOU PASSA', labelColor: S().ui.gold }); } });
// s21 — "Se os dois apertarem, os dois são eliminados."
registerShot('s21', { draw(g, t, info) { rule(g, t, info, { title: 'OS DOIS APERTAM', press: [true, true], tPress: wt('apertarem', info, 0.8), tResult: wt('eliminados', info, 2.3), result: ['lose', 'lose'], label: 'ELIMINADOS', labelColor: S().ui.accent }); } });
// s22 — "Se ninguém apertar, os dois são eliminados."
registerShot('s22', { draw(g, t, info) { rule(g, t, info, { title: 'NINGUÉM APERTA', press: [false, false], hold: true, tPress: 99, tResult: wt('eliminados', info, 2.4), result: ['lose', 'lose'], label: 'ELIMINADOS', labelColor: S().ui.accent }); } });

// booth clock inserts
const bclock = (str, o = {}) => ({ draw(g, t, info) { clockInsert(g, t, info, str, { bg: boothBg({ z: 1.3, y: -V(100, 200) }), ...o }); } });
registerShot('s23', bclock('01:00'));                                                   // "Sessenta segundos."
registerShot('s24', bclock((t) => mmss(60 - Math.max(0, t - 0.3))));                    // "O relógio começa."
registerShot('s28', bclock((t) => mmss(30 - t), { pulse: true }));                     // "Trinta segundos."
registerShot('s31', bclock((t) => mmss(15 - t), { pulse: true, roll: 0.01 }));         // "Quinze segundos."
registerShot('s34', bclock((t) => mmss(5 - t), { pulse: true, roll: 0.02 }));          // "Cinco segundos."

// s25 — "Do outro lado do vidro, o 41 não tira os olhos de você."
registerShot('s25', { draw(g, t, info) {
  booths(g, t, info, { cam: { z: V(1.0, 1.02) + 0.12 * ease.inOut(t / info.dur), x: V(60, 50) * ease.inOut(t / info.dur), y: V(0, 30) }, e77: (t) => 'worried', e41: () => 'determined',
    over: (g, geo) => { const ui = S().ui; g.setLineDash([8, 10]); seg(g, [[geo.L.fig + 30, geo.GY - 330], [geo.R.fig - 30, geo.GY - 330]], 2, alpha(ui.cream, 0.25 * prog(t, 1, 2))); g.setLineDash([]); } });
} });

// 41 behind glass, big face (s26, s27, s33)
function faceGlass(g, t, info, o) {
  const M = mood('interiorCool');
  faceShot(g, t, info, { who: P41, expr: o.expr, talk: o.talk || 0, look: [-0.2, 0], rimSide: 1, x: V(40, 30), push: o.push ?? 0.06, bg: boothBg({ z: 1.8, x: V(300, 280) }), r: o.r,
    over: (g, cx, cy, r) => { o.hand?.(g, cx, cy, r);
      g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) { const x = -200 + ((i * 0.4 + t * 0.04) % 1) * (E.W + 400); poly(g, [[x, 0], [x + 120, 0], [x - 300, E.H], [x - 420, E.H]], alpha('#ffffff', 0.04)); } g.restore();
      g.fillStyle = alpha('#9fe0ff', 0.06); g.fillRect(0, 0, E.W, E.H); } });
}
// s26 — "Os lábios dele se mexem devagar."
registerShot('s26', { draw(g, t, info) { faceGlass(g, t, info, { expr: 'sad', talk: 0.5 + 0.5 * Math.sin(t * 4) }); } });
// s27 — "Não aperte."  (mouthing)
registerShot('s27', { draw(g, t, info) { faceGlass(g, t, info, { expr: 'worried', talk: 0.4 + 0.5 * Math.abs(Math.sin(t * 3.2)), r: V(380, 420), push: 0.1 }); } });

// s29 — "Nas outras cabines, as luzes começam a se apagar."  back row goes dark first
registerShot('s29', { draw(g, t, info) {
  const cam = { z: 1.05 + 0.06 * ease.inOut(t / info.dur), x: -V(30, 40) * t, y: V(0, 40) };
  const order = [12, 5, 9, 7, 11, 4, 3]; // back-row booths, then the far-right front booth
  boothRow(g, t, cam, { off: (i) => { const k = order.indexOf(i); return k < 0 ? 0 : ease.out(prog(t, 0.9 + k * 0.38, 0.98 + k * 0.38)); } });
  FX.dust(g, t, { count: 40, color: mood('interiorCool').key, a: 0.25 });
} });
// s30 — "Uma por uma."  the front row: one, then another
registerShot('s30', { draw(g, t, info) {
  const cam = { z: 1.15 + 0.06 * ease.inOut(t / info.dur), x: V(40, 60), y: V(0, 40) };
  boothRow(g, t, cam, { off: (i) => (i >= 4 || i === 3 ? 1 : i === 0 ? ease.out(prog(t, 0.2, 0.28)) : i === 2 ? ease.out(prog(t, 0.7, 0.78)) : 0) });
  FX.dust(g, t, { count: 40, color: mood('interiorCool').key, a: 0.25 });
} });

// s32 — "Ele coloca a mão aberta no vidro, longe do botão."
registerShot('s32', { draw(g, t, info) {
  const M = mood('interiorCool'), ink = S().ink;
  blurLayer(g, 12, boothBg({ z: 2.0, x: V(260, 240), y: V(100, 150) })); veil(g, '#05050b', 0.3);
  const z = 1 + 0.06 * ease.inOut(t / info.dur), cx = E.W / 2 + 40, cy = E.H * 0.36;
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  redButton(g, E.W * 0.25, E.H * 0.82, 1.6, { floor: E.H * 1.2, glow: 0.5 });
  const k = ease.out(prog(t, 0.2, 0.7)), r = V(240, 260), sc = lerp(0.8, 1, k);
  g.save(); g.translate(cx, cy); g.scale(sc, sc); g.translate(-cx, -cy);
  for (const [c, o] of [[M.rim, -5], [ink, 0]]) { g.save(); g.translate(o, o);
    seg(g, [[cx + r * 0.1, cy + r * 0.6], [cx + r * 0.4, E.H + 300]], r * 0.55, o ? c : shade(P41.color, -0.1));
    circle(g, cx, cy + r * 0.25, r * 0.55, c);
    [-0.5, -0.17, 0.17, 0.5].forEach((a, i) => seg(g, [[cx + a * r * 0.7, cy], [cx + a * r * 0.95, cy - r * (0.85 + (i === 1 || i === 2 ? 0.15 : 0))]], r * 0.2, c));
    seg(g, [[cx - r * 0.45, cy + r * 0.35], [cx - r * 0.95, cy + r * 0.05]], r * 0.2, c);
    g.restore(); }
  seg(g, [[cx - r * 0.3, cy + r * 0.3], [cx + r * 0.25, cy + r * 0.1]], r * 0.04, alpha('#f6d8ea', 0.85));
  g.restore();
  if (k >= 1) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, cx, cy, r * 1.4, M.key, 0.1); g.restore(); }
  g.restore();
  g.fillStyle = alpha('#9fe0ff', 0.06); g.fillRect(0, 0, E.W, E.H);
  g.save(); g.globalCompositeOperation = 'lighter'; poly(g, [[200, 0], [320, 0], [-100, E.H], [-220, E.H]], alpha('#ffffff', 0.05)); g.restore();
} });
// s33 — "Confia em mim."
registerShot('s33', { draw(g, t, info) { faceGlass(g, t, info, { expr: t > 0.8 ? 'smile' : 'worried', talk: talkAmount(info.globalT, 74.74, 75.64) * 0.6 }); } });

// s35 — "Você pensa na sua mãe."  ghost mother beside 77 in the booth
registerShot('s35', { draw(g, t, info) {
  const cam = { z: V(1.45, 1.55), x: -V(230, 220), y: V(60, 120) };
  const geo = cabins(g, t, cam, {}), { M, GY, L } = geo;
  layer(g, cam, 1, (g) => {
    ghost(g, { x: L.x0 + 90, y: GY - 10, s: 1.7, facing: 1, outfit: MOM, pose: POSES.reach, expr: 'sad', color: MOM.color, a: ease.out(prog(t, 0.1, 0.7)) });
    drawFigure(g, { x: L.fig + 30, y: GY, s: V(1.6, 1.75), facing: 1, outfit: P77, pose: breathe(POSES.sad, t, 2), expr: 'sad', rim: rimC(M) });
  });
  cabinGlassAll(g, t, cam, geo);
  veil(g, MOM.color, 0.06, 'lighter');
  FX.dust(g, t, { count: 40, color: MOM.color, a: 0.35 });
} });
// s36 — "Nas dívidas,"  flash of the card
registerShot('s36', { draw(g, t, info) {
  blurLayer(g, 16, (g) => apt(g, t, { z: 1.6, x: V(500, 360), y: V(150, 260) })); veil(g, '#06050b', 0.5);
  const ui = S().ui, z = 1.05 + 0.08 * t, cx = E.W / 2, cy = E.H * 0.44, [sx, sy] = shake(t, 6, 10);
  g.save(); g.translate(cx + sx, cy + sy); g.scale(z, z); g.rotate(0.04); g.translate(-cx, -cy);
  rr(g, cx - V(420, 440), cy - V(300, 380), V(840, 880), V(600, 760), 14); g.fillStyle = '#efe8da'; g.fill();
  ['SUAS', 'DÍVIDAS', 'TERMINAM', 'AQUI.'].forEach((w, i) => text(g, w, cx, cy - V(170, 240) + i * V(110, 150), { size: V(84, 100), font: FONTS.serif, weight: 900, italic: true, color: i === 1 ? shade(ui.accent, -0.2) : '#1c1620' }));
  g.restore();
  veil(g, ALARM(), 0.1, 'lighter');
} });
// s37 — "no chão se abrindo."
registerShot('s37', { draw(g, t, info) {
  const GY = roomGround(), cam = { z: 1.8 + 0.1 * t, y: V(80, 200) };
  room(g, t, cam, { lights: 0.6 });
  layer(g, cam, 1, (g) => { const x = E.W / 2; hole(g, [[x - 150, GY - 26], [x + 150, GY - 26], [x + 175, GY + 40], [x - 175, GY + 40]], ease.out(prog(t, 0.1, 0.6)), t); });
  veil(g, ALARM(), 0.1 + 0.1 * prog(t, 0.1, 0.6), 'lighter');
} });
// s38 — "E aperta."  the hand slams the button
registerShot('s38', { draw(g, t, info) {
  const M = mood('interiorCool'), ink = S().ink, hit = 0.22;
  blurLayer(g, 12, boothBg({ z: 2.2, x: -V(250, 230), y: V(250, 300) })); veil(g, '#05050b', 0.3);
  const [sx, sy] = t > hit ? shake(t, 20 * (1 - prog(t, hit, hit + 0.6)), 30) : [0, 0], bx = E.W / 2 + sx, by = E.H * 0.55 + sy;
  redButton(g, bx, by, 4.4, { floor: E.H * 1.3, press: t > hit ? 1 : 0 });
  const hk = ease.in(prog(t, 0, hit)), hx = bx + 40, hy = lerp(by - 900, by - 250, hk);
  for (const [c, o] of [[M.rim, -5], [ink, 0]]) { g.save(); g.translate(o, o);
    seg(g, [[hx + 40, hy - 80], [E.W + 300, hy - 800]], 150, o ? c : P77.color); rr(g, hx - 110, hy - 90, 220, 170, 70); g.fillStyle = c; g.fill(); g.restore(); }
  if (t > hit) { FX.rings(g, bx, by - 60, t - hit, { count: 3, r0: 80, r1: 600, speed: 1.6, color: BTN_RED, a: 0.6 * (1 - prog(t, hit, hit + 1)) }); veil(g, BTN_RED, 0.25 * (1 - prog(t, hit, hit + 0.5)), 'lighter'); }
} });
// s39 — "A cabine dele fica escura."
registerShot('s39', { draw(g, t, info) {
  const off = t > 0.3 ? (t < 0.5 ? (Math.sin(t * 80) > 0 ? 0.6 : 0) : 0) : 1;
  booths(g, t, info, { cam: { z: V(1.3, 1.4), x: V(160, 150), y: V(20, 60) }, lightR: off, e77: () => 'shocked', p77: () => PRESS, e41: () => 'neutral', a41: off > 0.1 ? 1 : 0.2 });
} });
// s40 — "Quando a luz volta, ela está vazia."
registerShot('s40', { draw(g, t, info) {
  const back = t < 0.4 ? 0 : t < 0.9 ? (Math.sin(t * 60) > 0.3 ? 1 : 0.1) : 1;
  booths(g, t, info, { cam: { z: V(1.45, 1.6) + 0.06 * t / info.dur, x: V(240, 230), y: V(40, 90) }, lightR: back, show41: false, show77: false, dimR: 1 });
  if (back > 0.5 && t > 1.2) { const ui = S().ui; text(g, 'VAZIA', E.W / 2, E.H * 0.16, { size: V(90, 110), color: ui.accent, font: FONTS.title, weight: 700, spacing: 10, glow: 26, glowColor: alpha(ui.accent, 0.7), alpha: prog(t, 1.2, 1.6) }); }
} });
// s41 — "Parabéns aos sobreviventes. Diz a voz."
registerShot('s41', { draw(g, t, info) {
  booths(g, t, info, { show41: false, dimR: 1, lightR: 0.35, e77: () => 'sad', p77: (t) => breathe(POSES.sad, t), look77: [1, 0.2],
    over: (g, geo) => { speaker(g, E.W / 2, geo.L.top - V(110, 130), V(46, 50), { t, voice: 1, ringColor: '#ffffff', reach: 5 }); } });
} });
