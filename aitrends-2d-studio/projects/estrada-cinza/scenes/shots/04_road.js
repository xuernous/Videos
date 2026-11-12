// shots/04_road.js — s27–s33: out into the smoke, sirens, the 540 km to the border, the fence, Kolvar, the crossroads.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street, border, fence, road, signpost, valdoriaMap, route, MAPPTS } from '../sets/exteriors.js';
import { wt, popLabel, money, rimOf, FIRE, embers, smoke, dog, rifle, sirenWash } from '../sets/kit.js';
import { withBag } from './03_leave.js';
import { YOU, SOLDIER } from '../cast.js';

// s27 — "Lá fora, Grâvia ainda cheira a fumaça."  you step out of the block, smoke over the city
registerShot('s27', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.35 + 0.06 * k, x: -V(120, 100) + 50 * k, y: V(70, 140) };
  const { GY, M } = street(g, t, cam, { fire: 0.9, banner: false });
  layer(g, cam, 0.9, (g) => {
    // building entrance with a dim bulb (left)
    const dx = E.W / 2 - V(560, 420); g.fillStyle = shade(M.wall, -0.55); g.fillRect(dx - 160, GY - 520, 360, 490);
    g.fillStyle = '#05060b'; g.fillRect(dx - 40, GY - 300, 140, 270); circle(g, dx + 30, GY - 330, 10, M.practical); glow(g, dx + 30, GY - 330, 160, M.practical, 0.5);
  });
  layer(g, cam, 1, (g) => {
    const x = E.W / 2 - V(420, 320) + t * 130;
    withBag(g, { x, y: GY + 30, s: 1.35, facing: 1, outfit: YOU, pose: walkPose(t * 2 * Math.PI * 0.8), expr: 'worried', look: [0.4, -0.5], rim: { color: FIRE(), dir: [1, -0.5] } });
  });
  smoke(g, E.W * 0.7, E.H * 0.8, t, { h: E.H, w: 300, color: '#202230', a: 0.45, seed: 22 });
  embers(g, t, { count: 30, a: 0.6 });
  popLabel(g, t, 'GRÂVIA', { at: wt('gr', info, 0.6), y: E.H * 0.12, color: S().ui.cream, size: V(80, 90), spacing: 10 });
} });

// s28 — "Ao longe, sirenes."  OTS: you look back; red/blue flashes on distant blocks
registerShot('s28', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.25 + 0.05 * k, x: -V(80, 60), y: V(40, 100) };
  const { GY, M } = street(g, t, cam, { fire: 0.5, siren: 1, sirenX: -V(200, 150), banner: false, lamps: false });
  layer(g, cam, 0.4, (g) => { const ts = wt('sirenes', info, 0.7); sirenWash(g, t, E.W / 2 - V(200, 150), GY - 300, V(900, 800), ease.out(prog(t, ts - 0.4, ts + 0.3)) * 1.4, 6); });
  blurLayer(g, 8, (g) => withBag(g, { x: E.W * 0.74, y: E.H * 1.12, s: 3.4, facing: -1, outfit: YOU, pose: POSES.stand, expr: 'worried', look: [0.6, -0.2], rim: { color: SIREN(t), dir: [-1, -0.3], w: 6 } }));
  FX.dust(g, t, { count: 30, color: '#ffffff', a: 0.2 });
} });
const SIREN = (t) => (Math.sin(t * 6 * Math.PI) > 0 ? '#ff6a6a' : '#6a9aff');

// s29 — "Até a fronteira são quinhentos e quarenta quilômetros."  route to the border, 540 KM
registerShot('s29', { draw(g, t, info) {
  const ui = S().ui, z = 1 + 0.05 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  const tf = wt('fronteira', info, 0.4), tq = wt('quinhentos', info, 1.0), tk = wt('quil', info, 2.6);
  const P = valdoriaMap(g, t, { border: 0.4 + 0.6 * ease.out(prog(t, tf, tf + 0.4)), borderLabel: ease.out(prog(t, tf, tf + 0.4)) });
  route(g, P, [MAPPTS.gravia, [0.44, 0.48], [0.52, 0.66], [0.58, 0.78], MAPPTS.border], ease.inOut(prog(t, tq - 0.3, tk + 0.4)), ui.gold);
  g.restore();
  money(g, t, lerp(0, 540, ease.out(prog(t, tq, tk))), { unit: 'QUILÔMETROS', y: E.H * 0.1, size: V(120, 130), a: ease.out(prog(t, tq - 0.1, tq + 0.2)) });
} });

// s30 — "Arame farpado, cães e soldados com ordem de atirar."  the border: wire, dogs, soldiers, searchlight
registerShot('s30', { draw(g, t, info) {
  const ui = S().ui, k = ease.inOut(t / info.dur), cam = { z: 1.4 + 0.08 * k, x: 0, y: V(60, 120) };
  const ta = wt('arame', info, 0.15), tc = wt('ces', info, 1.2), ts = wt('soldados', info, 1.7), tt = wt('atirar', info, 3.2);
  const { GY, M } = border(g, t, cam, { freeCity: 0.4 });
  layer(g, cam, 1, (g) => {
    // soldiers behind the fence
    const ks = ease.out(prog(t, ts, ts + 0.4));
    for (const [x, f] of [[E.W / 2 - 160, 1], [E.W / 2 + 200, -1]]) { g.save(); g.globalAlpha *= ks; drawFigure(g, { x, y: GY - 40, s: 1.2, facing: f, outfit: SOLDIER, pose: POSES.holdFront, expr: 'angry', rim: { color: '#eef3ff', dir: [0, -1] } }); rifle(g, x, GY - 40, 1.2, f); g.restore(); }
    // dog
    const kd = ease.out(prog(t, tc, tc + 0.35));
    if (kd > 0) { g.save(); g.globalAlpha *= kd; FX.pool(g, E.W / 2 - 10, GY + 10, 260, 50, '#eef3ff', 0.4); glow(g, E.W / 2 - 10, GY - 120, 260, '#cfd9ff', 0.25); dog(g, E.W / 2 - 80 + (1 - kd) * -200, GY + 10, 1.25, '#07080e', { facing: 1, bark: Math.max(0, Math.sin(t * 9)), run: 0, t, rim: '#eef3ff' }); g.restore(); }
  });
  layer(g, cam, 1.15, (g) => { const kw = ease.out(prog(t, ta - 0.1, ta + 0.4)); g.save(); g.globalAlpha *= 0.4 + 0.6 * kw; fence(g, t, GY + 160, 520, M, { wire: kw > 0 ? mix(shade(M.rim, -0.2), '#ffffff', kw * 0.5) : undefined }); g.restore(); });
  if (t > tt) { const f = 1 - prog(t, tt, tt + 0.25); veil(g, '#ffffff', 0.25 * f, 'lighter'); }
  const lab = (at, nx, str, col) => { if (t < at || t > nx) return; popLabel(g, t, str, { at, y: E.H * 0.12, color: col, size: V(80, 90), out: nx - 0.3 }); };
  lab(ta, tc, 'ARAME FARPADO', ui.cream); lab(tc, ts, 'CÃES', ui.cream); lab(ts, tt, 'SOLDADOS', ui.cream); lab(tt, 99, 'ORDEM DE ATIRAR', ui.accent);
} });

// s31 — "Do outro lado: uma vida melhor."  you at the fence, warm free city beyond
registerShot('s31', { draw(g, t, info) {
  const ui = S().ui, k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.1 * k, x: 0, y: V(80, 140) };
  const { GY, M } = border(g, t, cam, { freeCity: 1.4, search: false, towerX: V(700, 600) });
  layer(g, cam, 1, (g) => {
    fence(g, t, GY + 20, 420, M, { mesh: mood('golden').rim, meshA: 0.35 });
    drawFigure(g, { x: E.W / 2 - 40, y: GY + 120, s: 1.5, facing: 1, outfit: YOU, pose: breathe({ ...POSES.reach, hF: [50, -220], eF: [30, -190] }, t), expr: 'awe', look: [0.6, -0.4], rim: { color: mood('golden').rim, dir: [1, -0.6] } });
  });
  popLabel(g, t, 'UMA VIDA MELHOR', { at: wt('vida', info, 1.1), y: E.H * 0.13, color: mood('golden').key, size: V(76, 84) });
  FX.dust(g, t, { count: 40, color: mood('golden').key, a: 0.35 });
} });

// s32 — "Primeiro destino: Kolvar. Cento e vinte quilômetros ao sul."
registerShot('s32', { draw(g, t, info) {
  const ui = S().ui, tk = wt('kolvar', info, 1.2), tc = wt('cento', info, 1.5), ts = wt('sul', info, 3.3);
  const z = lerp(1.0, 1.35, ease.inOut(prog(t, 0, info.dur)));
  g.save(); g.translate(E.W / 2, E.H * 0.43); g.scale(z, z); g.translate(-E.W / 2, -E.H * 0.43);
  const P = valdoriaMap(g, t, { kolvar: ease.out(prog(t, tk, tk + 0.5)), border: 0.3 });
  route(g, P, [MAPPTS.gravia, MAPPTS.kolvar], ease.inOut(prog(t, tc - 0.2, ts)), ui.gold);
  g.restore();
  money(g, t, lerp(0, 120, ease.out(prog(t, tc, ts))), { unit: 'KM AO SUL', y: E.H * 0.1, size: V(120, 130), a: ease.out(prog(t, tc - 0.1, tc + 0.2)) });
  popLabel(g, t, '1º DESTINO', { at: 0.1, y: E.H * 0.1, size: V(70, 76), color: ui.cream, out: tc - 0.3 });
} });

// s33 — "E você tem quatro jeitos de chegar lá."  foggy crossroads, four signs
registerShot('s33', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.45 + 0.06 * k, x: 0, y: V(80, 150) };
  const { GY, M } = road(g, t, cam, { cross: true, fog: 0.8 });
  const tq = wt('quatro', info, 1.0);
  layer(g, cam, 1, (g) => {
    signpost(g, E.W / 2 + 150, GY + 70, 1.15, t, { at: tq });
    withBag(g, { x: E.W / 2 - 170, y: GY + 90, s: 1.5, facing: 1, outfit: YOU, pose: breathe(POSES.think, t), expr: 'thinking', look: [0.6, -0.5], rim: rimOf(M, [-0.6, -1]) });
  });
  FX.fog(g, GY - 40, 260, M.fog, 0.35);
  popLabel(g, t, '4 CAMINHOS', { at: tq, y: E.H * 0.13, size: V(84, 92) });
  FX.dust(g, t, { count: 40, color: M.key, a: 0.25 });
} });
