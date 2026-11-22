// shots/02_mission.js — s15–s31: the math, the friends, the first nights, studying as a game.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, measure, FONTS, linGrad, rng } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, BED, groundY, controller, tvColor } from '../sets/home.js';
import { hudWorld, hudFrame, banner, scan, hearts, crosshair, NEON } from '../sets/hud.js';
import { wt, rimOf, bgBlur, faceShot, testPaper, phoneChat, bpBack, BAD, GOOD, PAPER } from '../sets/kit.js';
import { hand, arm } from './01_open.js';
import { KID, KID_MASK, FRIENDS } from '../cast.js';

const zoomAt = (g, cx, cy, z, fn) => { g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy); fn(); g.restore(); };
const chalk = (g, str, x, y, size, a = 1, col) => text(g, str, x, y, { size, color: col || S().ui.blueprint, font: FONTS.title, weight: 700, alpha: a, glow: 10, glowColor: alpha(col || S().ui.blueprint, 0.5) });
const scribbleOut = (g, x, y, w, p, col) => { if (p <= 0) return; g.save(); g.strokeStyle = col; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); const n = 7; for (let i = 0; i <= n * p; i++) { const u = i / n; const xx = x - w / 2 + u * w, yy = y + (i % 2 ? -18 : 18); i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore(); };
export const DESK_WRITE = { ...POSES.sit, head: [12, -178], eF: [30, -118], hF: [54, -132], eB: [22, -120], hB: [46, -130] };
export const DESK_SLUMP2 = { ...POSES.sit, head: [22, -160], sh: [8, -144], eF: [30, -120], hF: [50, -134], eB: [22, -120], hB: [42, -134] };

// s15 — "Você faz as contas."
registerShot('s15', { draw(g, t, info) {
  const ui = S().ui, syms = ['2', '7', '+', '÷', '4', '?', '×', '3'];
  faceShot(g, t, info, { who: KID, expr: 'thinking', look: [0.4, -0.5], rimSide: 1, rimColor: tvColor(), push: 0.06, y: V(80, 160), set: { tv: 1 },
    under: (g, cx, cy, r) => syms.forEach((s, i) => { const a = i / syms.length * Math.PI * 2 + t * 0.9, rx = r * 1.45, ry = r * 0.5; const x = cx + Math.cos(a) * rx, y = cy - r * 0.9 + Math.sin(a) * ry; if (Math.sin(a) < 0) text(g, s, x, y, { size: V(70, 80), color: i % 2 ? ui.gold : ui.blueprint, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.5), alpha: 0.6 * prog(t, i * 0.06, i * 0.06 + 0.3) }); }),
    over: (g, cx, cy, r) => syms.forEach((s, i) => { const a = i / syms.length * Math.PI * 2 + t * 0.9, rx = r * 1.45, ry = r * 0.5; const x = cx + Math.cos(a) * rx, y = cy - r * 0.9 + Math.sin(a) * ry; if (Math.sin(a) >= 0) text(g, s, x, y, { size: V(90, 100), color: i % 2 ? ui.gold : ui.blueprint, font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(ui.gold, 0.5), alpha: prog(t, i * 0.06, i * 0.06 + 0.3) }); }) });
} });

// s16 — "Mal, porque é matemática."  chalk mess on a blueprint card
registerShot('s16', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, z = 1 + 0.05 * t / info.dur;
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => {
    const L = [['2 + 7 = 27', 0.1, -0.12], ['7 × 4 = 11', 0.5, -0.02], ['28 ÷ 7 = ?', 0.9, 0.08]];
    L.forEach(([s, at, dy], i) => { const a = prog(t, at, at + 0.25), y = E.H * (0.36 + dy), x = E.W / 2 + (i - 1) * 40; chalk(g, s, x, y, V(84, 92), a); if (i < 2) scribbleOut(g, x, y, V(460, 500), prog(t, at + 0.4, at + 0.7), BAD()); });
    for (let i = 0; i < 5; i++) { const a = prog(t, 1.1 + i * 0.12, 1.3 + i * 0.12); const x = E.W * (0.15 + 0.17 * i), y = E.H * 0.18 + Math.sin(t * 3 + i) * 12; chalk(g, '?', x, y, V(80, 90) + i * 6, a, ui.gold); }
    UI.lineFigure(g, { x: E.W / 2, y: E.H * 0.75, s: V(1.6, 1.9), pose: breathe(posesAt(t, [[0, POSES.think], [1.0, POSES.handsOnHead]]), t), color: ui.blueprint });
  });
} });

// s17 — "Mas faz. Quatro semanas."  calendar card
registerShot('s17', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, t4 = wt('Quatro', info, 1.0), z = 1 + 0.04 * t / info.dur;
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => {
    const cw = V(1100, 900), cell = cw / 7, ch = cell * 4, x0 = E.W / 2 - cw / 2, y0 = E.H * 0.42 - ch / 2;
    rr(g, x0 - 30, y0 - 130, cw + 60, ch + 170, 24); g.fillStyle = ui.card; g.fill(); g.strokeStyle = ui.cardLine; g.lineWidth = 3; g.stroke();
    ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach((d, i) => text(g, d, x0 + cell * (i + 0.5), y0 - 60, { size: V(34, 38), color: ui.sub, font: FONTS.ui, weight: 900 }));
    for (let r = 0; r < 4; r++) for (let c = 0; c < 7; c++) { const n = r * 7 + c, on = prog(t, t4 + n * 0.035, t4 + n * 0.035 + 0.15); const x = x0 + c * cell + 6, y = y0 + r * cell + 6;
      rr(g, x, y, cell - 12, cell - 12, 12); g.fillStyle = on > 0 ? alpha(mix(ui.blueprint, ui.gold, r / 3), 0.2 + 0.55 * on) : alpha(ui.text, 0.06); g.fill();
      text(g, String(n + 1), x + (cell - 12) / 2, y + (cell - 12) / 2, { size: V(34, 36), color: on > 0.5 ? '#0b1324' : ui.sub, font: FONTS.ui, weight: 900 }); }
    const a = ease.outBack(prog(t, wt('semanas', info, 1.4) - 0.1, wt('semanas', info, 1.4) + 0.3));
    if (a > 0) { g.save(); g.translate(E.W / 2, y0 + ch + V(150, 190)); g.scale(a, a); text(g, '4 SEMANAS', 0, 0, { size: V(96, 104), color: ui.gold, font: FONTS.title, weight: 700, spacing: 3, glow: 24, glowColor: alpha(ui.gold, 0.6) }); g.restore(); }
  });
} });

// s18 — "Média sete. Partindo do dois."  bar from 2 to the target line at 7
registerShot('s18', { draw(g, t, info) {
  bpBack(g, t); const ui = S().ui, t7 = wt('sete', info, 0.5), t2 = wt('dois', info, 1.9);
  const bx = E.W / 2, base = E.H * 0.72, top = E.H * 0.2, u = (base - top) / 10, bw = V(240, 260);
  seg(g, [[bx - V(380, 400), base], [bx + V(380, 400), base]], 5, alpha(ui.blueprint, 0.6));
  for (let i = 0; i <= 10; i += 2) text(g, String(i), bx - V(420, 440), base - i * u, { size: V(34, 38), color: ui.sub, font: FONTS.ui, weight: 900, align: 'right' });
  const lp = ease.out(prog(t, t7 - 0.15, t7 + 0.35)), ly = base - 7 * u;
  if (lp > 0) { g.save(); g.setLineDash([24, 16]); seg(g, [[bx - V(380, 400), ly], [lerp(bx - V(380, 400), bx + V(380, 400), lp), ly]], 6, ui.gold); g.restore(); text(g, 'MÉDIA 7', bx + V(380, 400), ly - 50, { size: V(52, 58), color: ui.gold, font: FONTS.ui, weight: 900, align: 'right', alpha: lp, glow: 16, glowColor: alpha(ui.gold, 0.6) }); }
  const bp = ease.outBack(prog(t, t2 - 0.1, t2 + 0.35)), bh = 2 * u * clamp(bp, 0, 1.2);
  if (bp > 0) { rr(g, bx - bw / 2, base - bh, bw, bh, 10); g.fillStyle = BAD(); g.fill(); glow(g, bx, base - bh, bw, BAD(), 0.3); text(g, '2', bx, base - bh - 60, { size: V(90, 100), color: BAD(), font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(BAD(), 0.6) }); }
  const ap = ease.out(prog(t, t2 + 0.35, t2 + 0.8));
  if (ap > 0) { const ax = bx + bw / 2 + 70, y1 = base - 2 * u - 20, y2 = lerp(y1, ly + 20, ap); seg(g, [[ax, y1], [ax, y2]], 8, ui.cream); poly(g, [[ax - 22, y2 + 10], [ax + 22, y2 + 10], [ax, y2 - 18]], ui.cream); text(g, '+5', ax + 80, (y1 + y2) / 2, { size: V(80, 90), color: ui.cream, font: FONTS.ui, weight: 900, alpha: ap }); }
} });

// s19 — "E seus amigos já combinaram de jogar juntos no lançamento."
registerShot('s19', { draw(g, t, info) {
  const M = mood('night');
  bgBlur(g, t, 'bedroom', { z: 1.7, x: V(200, 160), y: -V(150, 250), veil: 0.5 });
  const z = 1 + 0.05 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.43;
  zoomAt(g, cx, cy, z, () => {
    phoneChat(g, t, cx, cy, V(900, 1100), [
      { at: 0.2, from: 0, str: 'LANÇAMENTO!!' }, { at: wt('combinaram', info, 1.1), from: 1, str: 'DIA 1 TODO MUNDO' },
      { at: wt('juntos', info, 2.1), from: 2, str: 'BORA JOGAR JUNTOS' }, { at: wt('lançamento', info, 2.8), from: 0, str: 'NINGUÉM FALTA' }], FRIENDS);
    arm(g, cx + V(500, 520), E.H + 300, cx + V(170, 230), cy + V(240, 330), KID.color, M, V(100, 110));
  });
  FX.dust(g, t, { count: 30, color: tvColor(), a: 0.3 });
} });

// s20 — "Sem você, se der errado."  game lobby, your slot empty
registerShot('s20', { draw(g, t, info) {
  const N = NEON(), ui = S().ui;
  blurLayer(g, 10, (g) => hudWorld(g, t, { z: 1.2, y: -V(100, 200) }, { speed: 0.3 })); veil(g, '#05040a', 0.45);
  const z = 1 + 0.04 * t / info.dur, tx = wt('Sem', info, 0.1) + 0.4;
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => {
    text(g, 'LOBBY · LANÇAMENTO', E.W / 2, E.H * 0.16, { size: V(46, 50), color: N.a, font: FONTS.ui, weight: 900, spacing: 4, glow: 14, glowColor: alpha(N.a, 0.6) });
    for (let i = 0; i < 4; i++) {
      const y = E.H * 0.25 + i * V(200, 210), x = E.W / 2 - V(420, 440), w = V(840, 880), h = V(170, 180), me = i === 3;
      rr(g, x, y, w, h, 22); g.fillStyle = me ? alpha(BAD(), 0.08) : alpha('#141a30', 0.9); g.fill(); g.strokeStyle = me ? alpha(BAD(), 0.6) : alpha(N.a, 0.4); g.lineWidth = 4; if (me) g.setLineDash([18, 12]); g.stroke(); g.setLineDash([]);
      if (!me) { circle(g, x + 100, y + h / 2, 52, FRIENDS[i]); text(g, `PLAYER ${i + 1}`, x + 190, y + h / 2, { size: V(44, 48), color: ui.cream, font: FONTS.ui, weight: 900, align: 'left' }); text(g, 'PRONTO', x + w - 40, y + h / 2, { size: V(40, 44), color: GOOD(), font: FONTS.ui, weight: 900, align: 'right', glow: 12, glowColor: alpha(GOOD(), 0.6) }); }
      else { const a = prog(t, tx, tx + 0.3); ring(g, x + 100, y + h / 2, 50, 5, alpha(BAD(), 0.6)); text(g, 'VOCÊ', x + 190, y + h / 2, { size: V(44, 48), color: alpha(ui.cream, 0.5), font: FONTS.ui, weight: 900, align: 'left' });
        if (a > 0) { const s = 1 + 0.4 * (1 - ease.out(a)); g.save(); g.translate(x + w - 90, y + h / 2); g.scale(s, s); seg(g, [[-36, -36], [36, 36]], 12, BAD()); seg(g, [[36, -36], [-36, 36]], 12, BAD()); g.restore(); glow(g, x + w - 90, y + h / 2, 120, BAD(), 0.4 * a); } }
    }
  });
  scan(g, t, 0.06);
} });

// s21 — "Na primeira noite,"  3D night block, push toward the one window with a desk lamp
registerShot('s21', { kind: '3d',
  init(T) {
    const M = mood('night'), st = T.stage({ mood: 'night', fov: V(36, 50), fog: [10, 60], keyPos: [6, 12, 10], keyIntensity: 0.6, ambient: 0.8 });
    st.add(T.ground(120, 120, M.road));
    const main = T.building(14, 18, 8, { color: shade(M.wall, -0.2), win: M.practical, lit: 0.18, seed: 5 }); main.position.set(0, 9, -4); st.add(main);
    const lit = T.windowPane(1.5, 1.7, { glowColor: M.practical, cols: 2, rows: 2, power: 1.4, interior: true }); lit.position.set(1.6, 7.6, 0.02); st.add(lit);
    for (const [x, z, h, sd] of [[-14, -10, 26, 7], [14, -9, 22, 9], [-22, -20, 34, 11], [24, -22, 30, 13]]) { const b = T.building(9, h, 7, { color: shade(M.wall, -0.35), win: M.practical, lit: 0.25, seed: sd }); b.position.set(x, h / 2, z); st.add(b); }
    for (const x of [-7, 7]) st.add(T.tree3D(x, 3.5, 1.1, '#141626'));
    const s = T.shaft(1.6, 6, M.practical, 0.05); s.position.set(1.6, 7.4, 2.5); s.rotation.x = -1.2; st.add(s);
    return { stage: st };
  },
  draw(s, t, info, T) { T.dolly(s.stage.camera, t, [[0, { pos: [-5, 3, 36], look: [1, 7.5, 0], fov: V(36, 50) }], [info.dur, { pos: [0.5, 6, 22], look: [1.5, 7.6, 0], fov: V(32, 44) }]]); },
  overlay(g, t, info) { const a = prog(t, 0.15, 0.45); if (a > 0) UI.badge(g, { str: 'NOITE 1', a, size: V(46, 56), y: V(120, 260) }); FX.stars(g, t, { area: [0, 0, E.W, E.H * 0.25], count: 40, seed: 3 }); },
});

// desk scene helper (s22, s30 bg, s39, s41)
export function deskScene(g, t, info, o = {}) {
  const k = ease.inOut(t / info.dur), cam = o.cam || { z: 1.75 + 0.06 * k, x: -V(330, 260), y: V(80, 170) };
  const { M, B, GY } = bedroom(g, t, cam, { tv: o.tv ?? 0, lamp: o.lamp ?? 1, notebook: o.notebook ?? 'open', chair: false, bag: false, moonX: o.moonX, deskExtra: o.deskExtra, controllerOnShelf: o.shelf, ledOn: o.led });
  layer(g, cam, 1, (g) => {
    FX.chair(g, B.chairX + 30, GY, 1.4, shade(M.dark, -0.5));
    drawFigure(g, { x: B.chairX, y: GY, s: 2.0, facing: -1, outfit: KID, pose: o.pose ? o.pose(t) : breathe(DESK_WRITE, t, 0.6, 3), expr: o.expr ? o.expr(t) : 'determined', look: [-1, 0.3], rim: { color: M.practical, dir: [-1, -0.5], w: 5 }, blink: (t % 3.2) > 3.1 });
    o.front?.(g, B, M, GY);
  });
  FX.dust(g, t, { count: 40, color: M.practical, a: 0.35 });
  return { M, B, GY, cam };
}
// s22 — "você abre o caderno e fecha em três minutos."
registerShot('s22', { draw(g, t, info) {
  const ta = wt('abre', info, 0.4), tf = wt('fecha', info, 1.6), ui = S().ui;
  const [sx, sy] = t > tf ? shake(t, 10 * (1 - prog(t, tf, tf + 0.4)), 18) : [0, 0];
  deskScene(g, t, info, { cam: { z: 1.75 + 0.05 * t / info.dur, x: -V(330, 260) + sx, y: V(80, 170) + sy }, notebook: t < ta || t > tf ? 'closed' : 'open',
    pose: (t) => breathe(posesAt(t, [[0, DESK_WRITE], [tf - 0.1, { ...DESK_WRITE, hF: [54, -150] }], [tf + 0.1, DESK_SLUMP2]]), t, 0.6, 3), expr: (t) => (t < ta + 0.8 ? 'neutral' : t < tf ? 'sleepy' : 'sad') });
  const p = prog(t, ta, tf), sec = Math.round(lerp(0, 180, p)), str = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  UI.readout(g, { value: str, x: E.W / 2, y: V(140, 300), align: 'center', size: V(96, 110), color: t > tf ? BAD() : ui.gold });
} });

// s23 — "Na segunda, vem a ideia."
registerShot('s23', { draw(g, t, info) {
  const ti = wt('ideia', info, 1.4), ui = S().ui, on = prog(t, ti - 0.1, ti + 0.2);
  faceShot(g, t, info, { who: KID, expr: t < ti ? 'thinking' : 'awe', look: t < ti ? [0.3, -0.4] : [0, -0.2], rimSide: -1, rimColor: mood('night').practical, push: 0.07, y: V(100, 180), set: { tv: 0, lamp: 1 }, bgx: -V(300, 250),
    over: (g, cx, cy, r) => { if (on <= 0) return; const by = cy - r * 1.55, s = ease.outBack(on);
      glow(g, cx, by, r * 1.2 * s, ui.gold, 0.5 * on); g.save(); g.translate(cx, by); g.scale(s, s); circle(g, 0, 0, r * 0.32, mix(ui.gold, '#ffffff', 0.4)); rr(g, -r * 0.13, r * 0.26, r * 0.26, r * 0.2, 8); g.fillStyle = '#9aa0b0'; g.fill(); g.restore();
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; seg(g, [[cx + Math.cos(a) * r * 0.45, by + Math.sin(a) * r * 0.45], [cx + Math.cos(a) * r * (0.55 + 0.1 * on), by + Math.sin(a) * r * (0.55 + 0.1 * on)]], 8, alpha(ui.gold, on)); } } });
  const a = prog(t, 0.05, 0.3); UI.badge(g, { str: 'NOITE 2', a, size: V(46, 56), y: V(120, 260) });
} });

// HUD medium of the kid (s24, s38)
function hudKid(g, t, info, o) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.5 + 0.08 * k, y: V(80, 180) };
  const { GY, N } = hudWorld(g, t, cam, { speed: o.speed ?? 0.8 });
  layer(g, cam, 1, (g) => { const f = { x: E.W / 2 - V(60, 40), y: GY, s: 2.4, facing: 1, outfit: o.who || KID, pose: o.pose(t), expr: o.expr(t), look: [1, -0.2], rim: { color: N.a, dir: [1, -0.4], w: 6 }, prop: o.prop };
    FX.pool(g, f.x, GY + 6, 260, 40, N.b, 0.4); drawFigure(g, f); o.extra?.(g, f, N); });
  return { N };
}
// s24 — "E se estudar fosse... uma missão?"
registerShot('s24', { draw(g, t, info) {
  const tm = wt('missão', info, 2.6);
  hudKid(g, t, info, { pose: (t) => breathe(posesAt(t, [[0, POSES.holdFront], [tm, POSES.cheer]]), t), expr: (t) => (t < tm ? 'smirk' : 'joy'),
    extra: (g, f, N) => { const [hx, hy] = hand(f); if (t < tm) { glow(g, hx + 30, hy - 20, 220, N.gold, 0.5); rr(g, hx - 10, hy - 70, 110, 80, 6); g.fillStyle = mix(PAPER(), N.gold, 0.3); g.fill(); } } });
  hudFrame(g, t, { label: 'ESTUDAR.EXE', a: prog(t, 0.1, 0.4) });
  banner(g, t, 'NOVA MISSÃO', { at: tm - 0.1, y: E.H * 0.17, sub: 'OBJETIVO: MÉDIA 7' });
  scan(g, t, 0.06);
} });

// s25 — "A lista de exercícios vira um assalto."  heist with lasers
registerShot('s25', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.55 + 0.06 * k, x: -30 * k, y: V(90, 190) }, ta = wt('assalto', info, 1.6);
  const { GY, N } = hudWorld(g, t, cam, { speed: 0.2 }); veil(g, '#08020a', 0.35);
  layer(g, cam, 1, (g) => {
    g.save(); g.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) { const y = GY - 80 - i * 110 + Math.sin(t * 1.5 + i) * 30; seg(g, [[-200, y + 60], [E.W + 200, y - 60]], 4, alpha(BAD(), 0.75)); glow(g, E.W / 2, y, 60, BAD(), 0.08); }
    g.restore();
    const sx = E.W / 2 + V(160, 170), sy = GY - 10;
    poly(g, [[sx - 150, sy], [sx + 150, sy], [sx + 120, sy - 30], [sx - 120, sy - 30]], mix(PAPER(), N.gold, 0.2)); for (let i = 0; i < 3; i++) seg(g, [[sx - 90, sy - 9 - i * 7], [sx + 80, sy - 9 - i * 7]], 2, alpha('#3a6ea5', 0.6));
    glow(g, sx, sy - 20, 200, N.gold, 0.35);
    drawFigure(g, { x: E.W / 2 - V(140, 130), y: GY, s: 2.3, facing: 1, outfit: KID_MASK, pose: breathe({ ...POSES.crouch, eF: [36, -96], hF: [62, -90] }, t, 0.5), expr: 'determined', look: [1, 0.4], rim: { color: N.a, dir: [1, -0.4], w: 6 }, prop: 'flashlight' });
  });
  hudFrame(g, t, { label: 'MISSÃO 1', right: '$ 0', color: BAD() });
  banner(g, t, 'ASSALTO', { at: ta - 0.15, y: E.H * 0.18, color: BAD() });
  scan(g, t, 0.07);
} });

// s26 — "Cada conta certa, dinheiro no bolso."
registerShot('s26', { draw(g, t, info) {
  const N = NEON(), ui = S().ui;
  blurLayer(g, 10, (g) => hudWorld(g, t, { z: 1.3, y: -V(100, 200) }, { speed: 0.4 })); veil(g, '#05040a', 0.4);
  const marks = [0, 1, 2, 3, 4].map((k) => ({ k, at: 0.35 + k * 0.35, kind: 'v' }));
  const z = 1 + 0.05 * t / info.dur; let cash = 0;
  zoomAt(g, E.W / 2, E.H * 0.45, z, () => {
    const p = testPaper(g, t, E.W / 2 - V(80, 60), E.H * 0.47, V(600, 700), { title: 'EXERCÍCIOS', lines: 5, marks, rot: -0.03 });
    marks.forEach((m, i) => { const u = prog(t, m.at + 0.15, m.at + 0.9); if (t > m.at + 0.15) cash += 250; if (u <= 0 || u >= 1) return;
      const x0 = p.x + p.w * 0.86, y0 = p.y + p.h * (0.18 + 0.72 / 5 * (i + 0.4)), x1 = E.W + 80, y1 = E.H * 0.82, e = ease.in(u);
      g.save(); g.translate(lerp(x0, x1, e), lerp(y0, y1, e) - Math.sin(u * Math.PI) * 160); g.rotate(u * 4); rr(g, -60, -30, 120, 60, 6); g.fillStyle = GOOD(); g.fill(); text(g, '$', 0, 2, { size: 44, color: '#0b2a18', font: FONTS.ui, weight: 900 }); g.restore(); });
  });
  hudFrame(g, t, { label: 'MISSÃO 1', right: '$ ' + cash.toLocaleString('pt-BR') });
  if (cash > 0) text(g, '+$250', E.W - V(120, 120), V(200, 340) - ((t * 1.5) % 1) * 40, { size: V(44, 48), color: GOOD(), font: FONTS.ui, weight: 900, align: 'right', alpha: 1 - ((t * 1.5) % 1) });
  scan(g, t, 0.06);
} });

// s27 — "A tabuada vira treino de mira."
registerShot('s27', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.35 + 0.05 * k, y: V(60, 140) }, ui = S().ui;
  const { GY, N } = hudWorld(g, t, cam, { speed: 0.5 });
  const T = [['7×8', '56', 0.55, E.W * 0.7, E.H * 0.4], ['6×9', '54', 1.15, E.W * 0.36, E.H * 0.33], ['9×4', '36', 1.7, E.W * 0.62, E.H * 0.55]];
  layer(g, cam, 0.9, (g) => T.forEach(([q, a, at, x, y]) => {
    const hit = prog(t, at, at + 0.25), r = V(110, 120);
    for (let i = 3; i >= 1; i--) circle(g, x, y, r * i / 3, i % 2 ? shade(BAD(), -0.2) : PAPER());
    text(g, hit > 0 ? a : q, x, y + 4, { size: V(64, 70), color: hit > 0 ? GOOD() : '#1a1622', font: FONTS.ui, weight: 900, stroke: hit > 0 ? 10 : 0, strokeColor: '#0a0a12' });
    if (hit > 0 && hit < 1) FX.rings(g, x, y, hit, { count: 2, r0: r, r1: r * 2, color: GOOD(), a: 0.7 * (1 - hit), speed: 1 });
  }));
  layer(g, cam, 1, (g) => drawFigure(g, { x: E.W * 0.22, y: GY, s: 2.3, facing: 1, outfit: KID, pose: breathe(POSES.point, t, 0.4), expr: 'determined', look: [1, -0.5], rim: { color: N.a, dir: [1, -0.4], w: 6 }, prop: 'pointer' }));
  // crosshair hops between targets
  let cx = E.W / 2, cy = E.H * 0.4; const pts = [[E.W / 2, E.H * 0.4, 0], ...T.map(v => [v[3], v[4], v[2] - 0.15])];
  for (let i = 1; i < pts.length; i++) { const u = ease.inOut(prog(t, pts[i - 1][2] + 0.1, pts[i][2])); if (u > 0) { cx = lerp(pts[i - 1][0], pts[i][0], u); cy = lerp(pts[i - 1][1], pts[i][1], u); } }
  const sc = 1 + 0.06 * (cam.z - 1); crosshair(g, E.W / 2 + (cx - E.W / 2) * sc, E.H / 2 + (cy - E.H / 2 - cam.y * 0.9) * sc, V(70, 76), N.a);
  hudFrame(g, t, { label: 'TREINO DE MIRA', right: 'TABUADA' });
  scan(g, t, 0.06);
} });

// s28 — "O livro de História? Mapa do território inimigo."  3D book-map
registerShot('s28', { kind: '3d',
  init(T) {
    const M = mood('void'), N = NEON(), st = T.stage({ mood: 'void', fov: V(34, 48), fog: [12, 40], keyPos: [-4, 8, 6], keyIntensity: 1.6, ambient: 0.9 });
    st.add(T.ground(80, 80, shade(M.dark, -0.2)));
    const paper = mix('#efe6d2', N.a, 0.1);
    const pL = T.box(3.2, 0.12, 4.2, paper, -1.62, 0.12, 0); pL.rotation.z = 0.06; const pR = T.box(3.2, 0.12, 4.2, paper, 1.62, 0.12, 0); pR.rotation.z = -0.06;
    st.add(T.box(6.8, 0.1, 4.5, shade(N.b, -0.4), 0, 0.04, 0), pL, pR);
    const r = rng(8);
    for (let i = 0; i < 9; i++) st.add(T.cone(0.35 + r() * 0.35, 0.6 + r() * 0.9, shade(M.grass, 0.1), -2.8 + r() * 2.4, 0.5, -1.6 + r() * 3.2, 5));
    for (let i = 0; i < 7; i++) { const h = 0.3 + r() * 0.6; st.add(T.box(0.35, h, 0.35, shade(M.wall, 0.3), 0.6 + r() * 2.2, 0.2 + h / 2, -1.6 + r() * 3.2)); }
    const flags = [];
    for (const [x, z] of [[1.2, -1.2], [2.4, 0.4], [1.0, 1.3], [2.6, -1.6]]) { st.add(T.cyl(0.03, 0.03, 1.0, '#d8d4e0', x, 0.7, z, 6)); const f = T.box(0.45, 0.28, 0.03, S().ui.accent, x + 0.24, 1.05, z); st.add(f); flags.push(f); }
    st.add(T.box(2.6, 0.03, 0.06, N.gold, -1.6, 0.24, 0.4));
    return { stage: st, flags };
  },
  draw(s, t, info, T) { s.flags.forEach((f, i) => { f.rotation.y = Math.sin(t * 4 + i) * 0.25; }); T.orbit(s.stage.camera, t, { target: [0.4, 0.1, 0.3], radius: V(7, 7.5), height: [8.5, 6.8], from: -0.5, to: 0.45, dur: info.dur }); },
  overlay(g, t, info) { const tm = wt('Mapa', info, 1.5), a = prog(t, tm - 0.1, tm + 0.3); hudFrame(g, t, { label: 'HISTÓRIA', right: a > 0 ? 'TERRITÓRIO INIMIGO' : '', color: NEON().a }); scan(g, t, 0.05); },
});

// s29 — "E a prova... é o chefão."
registerShot('s29', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), tb = wt('chefão', info, 1.4), cam = { z: 1.25 + 0.05 * k, y: V(40, 120) }, ui = S().ui;
  const [sx, sy] = t > tb ? shake(t, 14 * (1 - prog(t, tb, tb + 0.6)), 16) : [0, 0];
  const { GY, N } = hudWorld(g, t, { ...cam, x: sx, y: cam.y + sy }, { speed: 0.3 }); veil(g, BAD(), 0.06, 'lighter');
  layer(g, { ...cam, x: sx, y: cam.y + sy }, 1, (g) => {
    const rise = ease.out(prog(t, 0, 1.0)), bx = E.W * 0.64, bw = V(560, 520), bh = V(800, 760), by = GY - bh * rise + Math.sin(t * 2) * 10;
    glow(g, bx, by + bh / 2, bw * 1.2, BAD(), 0.35);
    g.save(); g.translate(bx, by); g.rotate(Math.sin(t * 1.6) * 0.03);
    rr(g, -bw / 2, 0, bw, bh, 16); g.fillStyle = PAPER(); g.fill(); g.strokeStyle = BAD(); g.lineWidth = 8; g.stroke();
    for (let i = 0; i < 9; i++) seg(g, [[-bw * 0.36, bh * 0.45 + i * 38], [bw * 0.36, bh * 0.45 + i * 38]], 4, alpha('#3a6ea5', 0.4));
    text(g, 'PROVA', 0, bh * 0.08, { size: V(70, 66), color: '#2a2430', font: FONTS.title, weight: 700 });
    for (const dx of [-1, 1]) { circle(g, dx * bw * 0.18, bh * 0.25, 46, '#ffffff'); circle(g, dx * bw * 0.18 - 8, bh * 0.26, 20, '#1a1622'); seg(g, [[dx * bw * 0.32, bh * 0.15], [dx * bw * 0.07, bh * 0.2]], 18, BAD()); }
    g.fillStyle = '#1a1622'; g.beginPath(); g.moveTo(-bw * 0.22, bh * 0.4); for (let i = 0; i <= 8; i++) g.lineTo(-bw * 0.22 + i * bw * 0.055, bh * 0.36 + (i % 2) * 30); g.lineTo(bw * 0.22, bh * 0.44); g.closePath(); g.fill();
    g.restore();
    drawFigure(g, { x: E.W * 0.2, y: GY, s: 1.6, facing: 1, outfit: KID, pose: breathe(POSES.ready, t, 1.4), expr: t > tb ? 'determined' : 'worried', look: [1, -0.6], rim: { color: N.a, dir: [1, -0.4], w: 5 } });
  });
  const ha = prog(t, tb - 0.2, tb + 0.2);
  if (ha > 0) { const x = E.W / 2 - V(380, 400), y = V(190, 300), w = V(760, 800); text(g, 'CHEFÃO: PROVA', E.W / 2, y - 50, { size: V(40, 44), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ha }); rr(g, x, y, w, 36, 18); g.fillStyle = alpha('#000', 0.6 * ha); g.fill(); rr(g, x + 5, y + 5, (w - 10) * ha, 26, 13); g.fillStyle = BAD(); g.fill(); }
  scan(g, t, 0.07);
} });

// s30 — "Pela primeira vez, você deixa o controle desligado."
registerShot('s30', { draw(g, t, info) {
  const M = mood('night'), td = wt('desligado', info, 2.7), led = 1 - prog(t, td - 0.1, td + 0.3);
  blurLayer(g, 7, (g) => deskScene(g, t, info, { cam: { z: 1.35, x: -V(200, 150), y: V(40, 100) } }));
  veil(g, '#05040a', 0.2);
  const z = 1 + 0.06 * ease.inOut(t / info.dur);
  zoomAt(g, E.W / 2, E.H * 0.7, z, () => {
    const sy = E.H * 0.74;
    g.fillStyle = shade(M.dark, -0.5); g.fillRect(-100, sy, E.W + 200, 40); g.fillStyle = alpha(M.rim, 0.25); g.fillRect(-100, sy, E.W + 200, 4); g.fillStyle = alpha('#000', 0.5); g.fillRect(-100, sy + 40, E.W + 200, E.H);
    controller(g, E.W * 0.62, sy - V(60, 70), V(2.6, 3.0), M, led);
    text(g, 'OFF', E.W * 0.62, sy - V(230, 260), { size: V(54, 60), color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: prog(t, td, td + 0.3) * 0.8 });
  });
  FX.dust(g, t, { count: 30, color: M.practical, a: 0.3 });
} });

// s31 — "E, estranhamente, não morre por isso."
registerShot('s31', { draw(g, t, info) {
  const tm = wt('morre', info, 1.9), ui = S().ui;
  faceShot(g, t, info, { who: KID, expr: t < tm ? 'confused' : 'surprised', look: [0, 0.3], rimSide: -1, rimColor: mood('night').practical, push: 0.06, y: V(120, 200), set: { tv: 0, lamp: 1 }, bgx: -V(300, 250) });
  const a = prog(t, 0.2, 0.5);
  text(g, 'VIDA', E.W / 2, V(150, 270), { size: V(38, 44), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 8, alpha: a });
  g.save(); g.globalAlpha *= a; hearts(g, E.W / 2 - V(250, 270), V(240, 370), 5, 5, V(80, 90), t * (t > tm ? 2 : 1), BAD()); g.restore();
  const b = ease.outBack(prog(t, tm, tm + 0.3)); if (b > 0) { g.save(); g.translate(E.W / 2, V(340, 480)); g.scale(b, b); text(g, '100%', 0, 0, { size: V(70, 80), color: GOOD(), font: FONTS.ui, weight: 900, glow: 18, glowColor: alpha(GOOD(), 0.6) }); g.restore(); }
} });
