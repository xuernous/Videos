// shots/01_intro.js — s01–s05: who you are, the last night at home, Valdória 1986 (3D city).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, seg, circle, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, rng } from '/engine/core.js';
import { drawFigure, POSES, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom } from '../sets/interiors.js';
import { wt, faceShot, popLabel, money, rimOf, FIRE } from '../sets/kit.js';
import { YOU } from '../cast.js';

export const bedBg = (o = {}) => (g, t) => bedroom(g, t, { z: o.z ?? 1.5, x: o.x ?? -V(300, 220), y: o.y ?? -V(200, 300) }, o);

// s01 — "Você tem dezesseis anos."
registerShot('s01', { draw(g, t, info) {
  faceShot(g, t, info, { who: YOU, expr: 'worried', look: [-0.3, -0.1], rimSide: -1, push: 0.07, bg: bedBg() });
  popLabel(g, t, '16 ANOS', { at: wt('dezesseis', info, 0.3), y: E.H * 0.13 });
} });

// s02 — "Um metro e sessenta e oito."  against the door frame with pencil marks
registerShot('s02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 2.0 + 0.08 * k, x: V(700, 580) - 30 * k, y: V(120, 170) };
  const { GY, M } = bedroom(g, t, cam, {});
  const dx = E.W / 2 + V(380, 250), s = 1.7, fx = dx - 20, top = GY - (208 + 26) * s;
  layer(g, cam, 0.5, (g) => {
    drawFigure(g, { x: fx, y: GY, s, facing: -1, outfit: YOU, pose: breathe(POSES.stand, t), expr: 'neutral', look: [-0.2, 0], rim: rimOf(M, [-1, -0.3]), blink: (t % 3.1) > 3.0 });
    // pencil mark at the top of the head
    const a = ease.out(prog(t, 0.5, 0.8)); seg(g, [[dx - 28, top], [dx + 4, top]], 5, alpha(S().ui.gold, a));
    UI.dimension(g, t, { x1: fx - 170, y1: GY, x2: fx - 170, y2: top, str: '', start: wt('metro', info, 0.3) });
    const tm = wt('metro', info, 0.3); text(g, '1,68 m', fx - 40, top - 70, { size: 54, color: S().ui.gold, font: FONTS.ui, weight: 900, align: 'center', glow: 12, glowColor: alpha(S().ui.gold, 0.6), alpha: ease.out(prog(t, tm + 0.3, tm + 0.6)) });
  });
  FX.dust(g, t, { count: 30, color: M.key, a: 0.3 });
} });

// s03 — "Quatrocentos e doze marcos na conta."  savings passbook, counter
registerShot('s03', { draw(g, t, info) {
  const ui = S().ui, M = mood('night');
  blurLayer(g, 12, (g) => bedroom(g, t, { z: 1.8, x: V(200, 160), y: V(100, 200) }, { lamp: 1, bed: false })); veil(g, '#05060c', 0.45);
  const z = 1.02 + 0.06 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.58;
  glow(g, cx + 260, cy - 420, 700, M.practical, 0.35);
  g.save(); g.translate(cx, cy); g.scale(z, z); g.rotate(-0.06);
  // open passbook
  rr(g, -360, -230, 720, 470, 18); g.fillStyle = shade('#6a3a3a', -0.35); g.fill();
  rr(g, -340, -215, 330, 440, 8); g.fillStyle = '#dcd4c0'; g.fill(); rr(g, 10, -215, 330, 440, 8); g.fill();
  g.fillStyle = alpha('#000', 0.18); g.fillRect(-12, -215, 24, 440);
  text(g, 'CADERNETA', -175, -170, { size: 30, color: '#6a3a3a', font: FONTS.ui, weight: 900, spacing: 3 });
  text(g, 'DE POUPANÇA', -175, -134, { size: 22, color: '#6a3a3a', font: FONTS.ui, weight: 900, spacing: 3 });
  g.strokeStyle = alpha('#3a3040', 0.35); g.lineWidth = 2; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(30, -170 + i * 48); g.lineTo(320, -170 + i * 48); g.stroke(); }
  const rows = [['12', '5'], ['31', '17'], ['80', '25'], ['140', '20'], ['412', '…']]; rows.forEach(([v], i) => text(g, v, 290, -146 + i * 48, { size: 26, color: '#2a2430', font: FONTS.ui, weight: 900, align: 'right', alpha: i < 4 ? 0.7 : prog(t, 1.6, 2.0) }));
  g.restore();
  glow(g, cx + 160, cy - 160, 600, M.practical, 0.18);
  const t0 = wt('quatrocentos', info, 0.2), t1 = wt('marcos', info, 1.9);
  money(g, t, lerp(0, 412, ease.out(prog(t, t0, t1))), { y: E.H * 0.16, a: ease.out(prog(t, t0 - 0.1, t0 + 0.2)) });
  FX.dust(g, t, { count: 30, color: M.practical, a: 0.35 });
} });

// s04 — "E esta é a última noite que você dorme em casa."  awake in bed, moonlight
registerShot('s04', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.55 + 0.12 * k, x: -V(200, 165), y: V(150, 180) - 20 * k };
  const { GY, M, CX } = bedroom(g, t, cam, {});
  layer(g, cam, 0.85, (g) => {
    const bx = CX - V(420, 380), bw = V(560, 480), s = 0.92;
    drawFigure(g, { x: bx + bw * 0.5, y: GY - 34 + 100 * s, s, facing: 1, rot: -Math.PI / 2, outfit: YOU, pose: POSES.lie, expr: 'worried', look: [0.4, -0.6], rim: rimOf(M, [0, -1]), blink: (t % 3.6) > 3.45 });
    // blanket over the legs
    rr(g, bx + bw * 0.42, GY - 66, bw * 0.58, 52, 22); g.fillStyle = shade('#4a4a70', -0.3); g.fill();
    g.fillStyle = alpha(M.key, 0.18); g.fillRect(bx + bw * 0.42, GY - 66, bw * 0.58, 4);
  });
  FX.dust(g, t, { count: 50, color: M.key, a: 0.3 });
  const a = ease.out(prog(t, wt('ltima', info, 0.8), wt('ltima', info, 0.8) + 0.5));
  text(g, 'A ÚLTIMA NOITE', E.W / 2, E.H * 0.14, { size: V(80, 88), color: S().ui.cream, font: FONTS.title, weight: 700, spacing: 6, glow: 24, glowColor: alpha(M.key, 0.6), alpha: a * (1 - prog(t, info.dur - 0.3, info.dur)) });
} });

// s05 — "Valdória. 1986."  3D night city with burning blocks; title
registerShot('s05', {
  kind: '3d',
  init(T) {
    const M = mood('night'), { THREE } = T, fireC = FIRE();
    const st = T.stage({ mood: 'night', fov: V(40, 58), fog: [20, 85], keyPos: [6, 12, -10], keyIntensity: 0.9, ambient: 0.7, bloom: 0.9 });
    st.add(T.ground(200, 200, M.road, T.tiles(shade(M.road, -0.2), 20, [20, 20])));
    const r = rng(7);
    for (let i = -6; i <= 6; i++) for (let j = -6; j <= 3; j++) {
      if (Math.abs(i) < 1 && j > -2) continue;            // the avenue
      const w = 3 + r() * 2.5, h = 6 + r() * 16, d = 3 + r() * 2;
      const b = T.building(w, h, d, { color: shade(M.wall, -0.2 - r() * 0.2), win: M.practical, lit: 0.08 + r() * 0.12, seed: 10 + i * 13 + j });
      b.position.x = i * 7 + (r() - 0.5); b.position.z = j * 7 + (r() - 0.5); st.add(b);
      if (r() < 0.24) { const L = new THREE.PointLight(new THREE.Color(fireC), 60, 22, 1.5); L.position.set(b.position.x + 1, 1.5, b.position.z + d / 2 + 1); st.add(L); const f = T.sphere(0.9, T.basic(fireC)); f.position.set(b.position.x, 0.6, b.position.z + d / 2 + 0.6); f.scale.set(1.6, 0.8, 1); st.add(f); const sm = T.cyl(1.2, 2.6, 22, T.basic('#3a3a4c', { transparent: true, opacity: 0.25 }), b.position.x + 2, h + 8, b.position.z); st.add(sm); }
    }
    // street lamps along the avenue
    for (let j = -5; j <= 3; j++) for (const sx of [-1.8, 1.8]) { st.add(T.cyl(0.06, 0.08, 4, '#0c0d14', sx, 2, j * 7)); const l = T.sphere(0.18, T.basic(M.practical)); l.position.set(sx, 4.1, j * 7); st.add(l); }
    return { stage: st };
  },
  draw(s, t, info, T) {
    T.orbit(s.stage.camera, t, { target: [0, 3, -6], radius: V(40, 46), height: [26, 20], from: -0.45, to: 0.1, dur: info.dur });
  },
  overlay(g, t, info) {
    const ui = S().ui, ta = wt('valdria', info, 0.15), tb = wt('1986', info, 1.6);
    veil(g, '#000', 0.15);
    text(g, 'A ESTRADA CINZA', E.W / 2, E.H * 0.3, { size: V(40, 44), color: alpha(ui.cream, 0.8), font: FONTS.ui, weight: 900, spacing: 12, alpha: ease.out(prog(t, 0.1, 0.6)) * (1 - prog(t, info.dur - 0.4, info.dur)) });
    const k1 = ease.outBack(prog(t, ta, ta + 0.5)), k2 = ease.outBack(prog(t, tb, tb + 0.45));
    if (k1 > 0) { g.save(); g.translate(E.W / 2, E.H * 0.4); g.scale(0.9 + 0.1 * k1, 0.9 + 0.1 * k1); text(g, 'VALDÓRIA', 0, 0, { size: V(130, 140), color: ui.gold, font: FONTS.title, weight: 700, spacing: 6, glow: 34, glowColor: 'rgba(255,120,40,.8)', alpha: clamp(k1) }); g.restore(); }
    if (k2 > 0) text(g, '1986', E.W / 2, E.H * 0.4 + V(130, 140), { size: V(90, 96), color: ui.cream, font: FONTS.title, weight: 700, spacing: 20, glow: 20, glowColor: alpha(ui.cream, 0.5), alpha: clamp(k2) });
  },
});
