// shots/02_country.js — s06–s14: the country goes mad — riots, factories, tanks, Vesk on TV, bread lines, censorship, disappearances.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, rng, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street, factory, valdoriaMap } from '../sets/exteriors.js';
import { living, crtTV, sofa } from '../sets/interiors.js';
import { wt, faceShot, popLabel, rimOf, FIRE, fire, embers, smoke, tank, sirenWash } from '../sets/kit.js';
import { YOU, DAD, MOM, VESK, SOLDIER, CITIZEN } from '../cast.js';

// s06 — "O país enlouqueceu."  people running through a burning street
registerShot('s06', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.45 + 0.08 * k, x: -30 + 60 * k, y: V(80, 160), r: -0.03 + 0.02 * Math.sin(t * 2) };
  const { GY, M } = street(g, t, cam, { fire: 1, siren: 0.6 });
  layer(g, cam, 0.9, (g) => { fire(g, E.W / 2 + V(420, 330), GY - 40, 260, 200, t, { seed: 2 }); fire(g, E.W / 2 - V(560, 420), GY - 40, 180, 150, t, { seed: 5 }); });
  layer(g, cam, 1, (g) => {
    const R = rng(4);
    for (let i = 0; i < 6; i++) {
      const sp = 380 + R() * 140, x0 = -420 + i * 220 + R() * 60, ph = t * 2 * Math.PI * 1.6 + i;
      const x = x0 + t * sp, s = 1.05 + (i % 3) * 0.12;
      drawFigure(g, { x, y: GY + (i % 3) * 30, s, facing: 1, outfit: i === 3 ? { top: 'none', head: 'cap', headColor: '#2a2a32' } : CITIZEN, pose: walkPose(ph, { run: true }), expr: 'scared', rim: { color: FIRE(), dir: [1, -0.4] }, blink: false });
    }
  });
  embers(g, t, { count: 60 });
  smoke(g, E.W * 0.2, E.H * 0.9, t, { h: E.H, w: 260, color: '#151622', a: 0.5, seed: 12 });
} });

// s07 — "Revoltas em todas as cidades."  fires pop over every city on the map
registerShot('s07', { draw(g, t, info) {
  const z = 1 + 0.06 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  valdoriaMap(g, t, { fires: prog(t, 0.3, info.dur - 0.2), border: 0.25 });
  g.restore();
  popLabel(g, t, 'REVOLTAS', { at: wt('revoltas', info, 0.1), y: E.H * 0.1, color: S().ui.accent, size: V(84, 92) });
} });

// s08 — "Fábricas queimando."
registerShot('s08', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.25 + 0.08 * k, x: 20 - 50 * k, y: V(40, 90) };
  const { GY, M } = street(g, t, cam, { fire: 1.4, blocks: [], banner: false, lamps: false, smoke: false });
  layer(g, cam, 0.6, (g) => {
    for (const [dx, s0] of [[-60, 0], [200, 4], [380, 7]]) smoke(g, E.W / 2 + dx, GY - V(700, 760), t, { h: V(1100, 1300), w: 200, color: '#2a2a36', a: 0.6, seed: s0 + 3, lit: FIRE() });
    factory(g, t, E.W / 2 + 40, GY - 30, V(1.1, 1.05), M);
    fire(g, E.W / 2 - 100, GY - V(360, 340), 360, 220, t, { seed: 4 }); fire(g, E.W / 2 + 280, GY - V(340, 320), 240, 180, t, { seed: 8 });
    glow(g, E.W / 2, GY - 300, 900, FIRE(), 0.35);
  });
  embers(g, t, { count: 80, speed: 140 });
  FX.lensStreak(g, E.W / 2, GY - V(360, 340), E.W * 1.4, '#ffb070', 0.25);
} });

// s09 — "Tanques nas praças."  tank in a square under a searchlight
registerShot('s09', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.35 + 0.06 * k, x: 40 - 40 * k, y: V(60, 130) };
  const { GY, M } = street(g, t, cam, { fire: 0.5, banner: true });
  layer(g, cam, 0.7, (g) => {
    // statue on a plinth (Vesk, arm raised)
    const sx = E.W / 2 - V(330, 260); g.fillStyle = shade(M.wall, -0.5); g.fillRect(sx - 90, GY - 330, 180, 300);
    drawFigure(g, { x: sx, y: GY - 330, s: 1.3, facing: 1, outfit: { top: 'trench', color: shade(M.wall, -0.4), head: 'cap', headColor: shade(M.wall, -0.4) }, pose: POSES.pointUp, expr: 'neutral', rim: rimOf(M, [1, -0.5]), shadow: false, ink: shade(M.wall, -0.45), inkFar: shade(M.wall, -0.5) });
  });
  layer(g, cam, 1, (g) => {
    g.save(); g.globalCompositeOperation = 'lighter'; FX.lightCone(g, E.W / 2 + 500, -200, { angle: Math.PI * 0.62, spread: 0.18, len: 1900, color: '#e8eeff', a: 0.22 }); g.restore();
    FX.pool(g, E.W / 2 + 30, GY + 40, 420, 60, '#e8eeff', 0.3);
    tank(g, E.W / 2 + 60 - 30 * k, GY + 40, V(1.0, 0.95), '#0c0e16', { facing: -1, rim: M.rim, gun: 10 * Math.sin(t) });
    for (const [x, f] of [[E.W / 2 - 330, 1], [E.W / 2 + 420, -1]]) drawFigure(g, { x, y: GY + 60, s: 1.0, facing: f, outfit: SOLDIER, pose: POSES.holdFront, expr: 'neutral', rim: rimOf(M, [0.4, -1]) });
  });
  FX.dust(g, t, { count: 40, color: '#e8eeff', a: 0.3 });
} });

// TV screen content: Vesk speaking in front of a red flag
export function veskTV(g, x, y, w, h, t, talk = 0.8) {
  g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#5a1a22', '#2a0c12']); g.fillRect(x, y, w, h);
  circle(g, x + w * 0.5, y + h * 0.28, w * 0.12, alpha('#e8c070', 0.35)); circle(g, x + w * 0.5, y + h * 0.28, w * 0.08, '#4a1218');
  bigFace(g, x + w * 0.5, y + h * 0.58, w * 0.24, { outfit: VESK, expr: 'smirk', talk, rimColor: '#ffd0b0', rimSide: -1 });
  // mustache
  g.fillStyle = '#05060a'; g.beginPath(); g.ellipse(x + w * 0.5, y + h * 0.58 + w * 0.06, w * 0.09, w * 0.025, 0, 0, Math.PI * 2); g.fill();
}
// s10 — "Na TV, o Marechal Anton Vesk repete que está tudo sob controle."
registerShot('s10', { draw(g, t, info) {
  const ui = S().ui, k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.12 * k, x: V(40, 50), y: -V(120, 200) };
  const { GY, M } = living(g, t, cam);
  veil(g, '#000', 0.35);
  const talk = 0.3 + 0.7 * Math.abs(Math.sin(t * 13)) * (0.6 + 0.4 * Math.sin(t * 4.1));
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = '#100e14'; g.fillRect(E.W / 2 - 330, GY - 260, 660, 260);   // cabinet
    crtTV(g, E.W / 2 - 290, GY - 760, 470, 380, t, (g, x, y, w, h) => {
      veskTV(g, x, y, w, h, t, talk);
      const tn = wt('marechal', info, 0.6), tc = wt('controle', info, 3.4);
      const a = ease.out(prog(t, tn, tn + 0.3)); g.fillStyle = alpha('#0a0a12', 0.85 * a); g.fillRect(x, y + h - 76, w, 50); text(g, 'MARECHAL ANTON VESK', x + w / 2, y + h - 51, { size: 26, color: '#ffffff', font: FONTS.ui, weight: 900, spacing: 2, alpha: a });
      const kc = ease.outBack(prog(t, tc, tc + 0.35)); if (kc > 0) { g.fillStyle = alpha('#c8202a', 0.92); g.fillRect(x, y + 14, w * clamp(kc), 50); text(g, 'TUDO SOB CONTROLE', x + w / 2, y + 40, { size: 30, color: '#fff', font: FONTS.ui, weight: 900, spacing: 2, alpha: clamp(kc) }); }
    });
    FX.pool(g, E.W / 2, GY + 30, 520, 90, '#8fc0ff', 0.25);
  });
  FX.dust(g, t, { count: 40, color: '#9fc8ff', a: 0.3 });
} });

// s11 — "Ninguém acredita."  the family on the sofa in the TV glow
registerShot('s11', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.9 + 0.08 * k, x: 0, y: V(60, 60) };
  const { GY, M } = living(g, t, cam);
  veil(g, '#000', 0.45);
  layer(g, cam, 1, (g) => {
    sofa(g, E.W / 2, GY + 10, 620, '#22202c');
    const fl = 0.75 + 0.25 * Math.sin(t * 23) * Math.sin(t * 7);
    const tvRim = { color: '#a8cfff', dir: [0, 1], w: 4 };
    drawFigure(g, { x: E.W / 2 - 220, y: GY - 10, s: 1.15, facing: 1, outfit: DAD, pose: POSES.sitBack, expr: 'neutral', look: [0.2, 0], rim: tvRim, face: { eyes: 'dot', mouth: 'flat' } });
    drawFigure(g, { x: E.W / 2 + 230, y: GY - 10, s: 1.15, facing: -1, outfit: MOM, pose: { ...POSES.sit, eF: [20, -140], hF: [-6, -148], eB: [14, -142], hB: [-2, -150] }, expr: 'neutral', rim: tvRim, face: { eyes: 'dot', mouth: 'flat' } });
    drawFigure(g, { x: E.W / 2 + 10, y: GY - 10, s: 1.0, facing: 1, outfit: YOU, pose: { ...POSES.sit, eF: [20, -140], hF: [-6, -148], eB: [14, -142], hB: [-2, -150] }, expr: 'neutral', look: [0.6, 0], rim: tvRim, face: { eyes: 'dot', brows: 'worried', mouth: 'flat' } });
    // blue TV wash from the camera side
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#6aa8ff', 0.08 * fl); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.restore();
  });
  FX.dust(g, t, { count: 30, color: '#9fc8ff', a: 0.25 });
} });

// s12 — "Pão, só com fila."  bread queue at grey dawn
registerShot('s12', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.35 + 0.05 * k, x: V(120, 160) - 120 * k, y: V(70, 140) };
  const { GY, M } = street(g, t, cam, { fire: 0.15, dawn: 0.7, smoke: true, banner: false, lamps: true });
  const shopX = E.W / 2 + V(560, 420);
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = shade(M.wall, -0.4); g.fillRect(shopX - 60, GY - 520, 520, 490);
    g.fillStyle = alpha(M.practical, 0.75); g.fillRect(shopX + 10, GY - 330, 140, 300); glow(g, shopX + 80, GY - 180, 260, M.practical, 0.35);
    rr(g, shopX - 20, GY - 470, 300, 100, 10); g.fillStyle = shade('#3a2a20', -0.2); g.fill();
    text(g, 'PÃO', shopX + 130, GY - 418, { size: 70, color: M.practical, font: FONTS.title, weight: 700, spacing: 8, glow: 18, glowColor: alpha(M.practical, 0.6) });
  });
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 10; i++) {
      const x = shopX - 120 - i * 115, of = i === 6 ? { top: 'dress', color: '#3a3644', head: 'bun' } : i === 3 ? { top: 'trench', color: '#2a2a32', head: 'fedora', headColor: '#2a2a32' } : CITIZEN;
      drawFigure(g, { x, y: GY + 20, s: 1.0, facing: 1, outfit: of, pose: breathe(i % 2 ? POSES.relaxed : POSES.sad, t, 1, i), expr: i % 3 ? 'sad' : 'neutral', rim: rimOf(M, [1, -0.4]), blink: (t % (2.7 + i * 0.3)) > (2.6 + i * 0.3) });
    }
  });
  FX.fog(g, GY - 200, 300, '#8a8aa8', 0.25);
  FX.dust(g, t, { count: 30, color: '#d0d4e8', a: 0.25 });
} });

// s13 — "Notícia, só a dele."  every front page is Vesk
registerShot('s13', { draw(g, t, info) {
  const ui = S().ui; backdrop(g, ['#0c0e16', '#1a1c28']);
  glow(g, E.W / 2, E.H * 0.3, 900, '#ffe0b0', 0.18);
  const papers = [[-220, 360, -0.18], [240, 300, 0.14], [-120, -120, 0.08], [200, -420, -0.12], [0, 60, -0.02]];
  papers.forEach(([dx, dy, rot], i) => {
    const at = i * 0.18, kk = ease.out(prog(t, at, at + 0.35)); if (kk <= 0) return;
    const x = E.W / 2 + dx + (1 - kk) * (i % 2 ? 600 : -600), y = E.H * 0.47 + dy * 0.9;
    g.save(); g.translate(x, y); g.rotate(rot + (1 - kk) * 0.4); const s = 1 + 0.03 * t;
    g.scale(s, s);
    g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(-276, -356, 560, 720);
    g.fillStyle = '#d8d2c2'; g.fillRect(-280, -360, 560, 720);
    text(g, 'A VOZ DA NAÇÃO', 0, -300, { size: 50, color: '#1a1416', font: FONTS.serif, weight: 900 });
    g.fillStyle = '#1a1416'; g.fillRect(-250, -262, 500, 4);
    g.fillStyle = '#8a2028'; g.fillRect(-250, -240, 500, 300);
    bigFace(g, 0, -60, 100, { outfit: VESK, expr: 'smirk', rimColor: '#e0d0c0', rimSide: -1 });
    g.fillStyle = '#05060a'; g.beginPath(); g.ellipse(0, -36, 38, 10, 0, 0, Math.PI * 2); g.fill();
    text(g, ['VESK GARANTE ORDEM', 'O MARECHAL FALA', 'TUDO SOB CONTROLE', 'VESK: VITÓRIA', 'VESK VISITA FÁBRICA'][i], 0, 110, { size: 34, color: '#1a1416', font: FONTS.ui, weight: 900 });
    g.fillStyle = alpha('#1a1416', 0.35); for (let l = 0; l < 6; l++) { g.fillRect(-250, 150 + l * 28, 240, 8); g.fillRect(10, 150 + l * 28, 240, 8); }
    g.restore();
  });
  FX.dust(g, t, { count: 30, color: '#ffe0b0', a: 0.25 });
} });

// s14 — "E quem reclama… some."  a man complains under a lamp; on "some" the lamp blinks and only his cap remains
registerShot('s14', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.6 + 0.08 * k, x: -V(160, 140), y: V(120, 180) };
  const { GY, M } = street(g, t, cam, { fire: 0.2, lamps: false, banner: true });
  const ts = wt('some', info, 1.7), off = t > ts - 0.12 && t < ts + 0.12, gone = t >= ts;
  const lx = E.W / 2 - V(260, 200);
  layer(g, cam, 0.95, (g) => {
    FX.lampPost(g, lx - 37, GY - 20, V(500, 540), { light: M.practical, on: !off, a: 0.3, color: '#0c0d14' });
    if (!off) FX.pool(g, lx, GY + 10, 260, 50, M.practical, 0.45);
  });
  layer(g, cam, 1, (g) => {
    if (!gone) drawFigure(g, { x: lx, y: GY + 10, s: 1.5, facing: 1, outfit: { top: 'none', head: 'cap', headColor: '#4a3a30' }, pose: posesAt(t, [[0, 'talk'], [0.6, 'explain'], [1.2, 'point']]), expr: 'angry', talk: 0.5 + 0.5 * Math.abs(Math.sin(t * 12)), rim: { color: M.practical, dir: [0, -1] } });
    if (!gone) FX.rings(g, lx + 30, GY - 330, t, { count: 2, r0: 40, r1: 120, color: '#ffe0c0', a: 0.35 });
    if (gone) { g.fillStyle = '#4a3a30'; g.beginPath(); g.ellipse(lx + 10, GY + 4, 36, 14, 0, Math.PI, 0); g.fill(); g.fillRect(lx + 10, GY - 2, 50, 6); }
  });
  if (off) veil(g, '#000', 0.6);
  FX.dust(g, t, { count: 30, color: M.practical, a: 0.3 });
} });
