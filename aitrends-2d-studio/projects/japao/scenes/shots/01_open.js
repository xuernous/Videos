// shots/01_open.js — cold open: the chronicle, the scraped name, UV reveal, the generals, the title.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, key, shake, rng, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad } from '/engine/core.js';
import { drawFigure, POSES, breathe, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { archive, page, chronicleCover, bookOpen, UV } from '../sets/archive.js';
import { mapBase, mapBoat, PLACES } from '../sets/map.js';
import { seaView, hillTop, coast } from '../sets/coast.js';
import { drawChar, roster, knife, push, rimOf, blinkAt, wolfEmblem, KZ_RED } from '../sets/lib.js';
import { HAYATO, RESEARCHER, HISTORIAN, ORDEK, HARSA, VELKUN, SABETH, GORUUN, MASANOBU, ISHKAR, TARVOS } from '../cast.js';

export const wt = (w, info, fb = 0) => { const x = wordTime(w, info.shot.start - 0.25); return x == null ? fb : x - info.shot.start; };
export const SIL8 = [ORDEK, HARSA, VELKUN, SABETH, GORUUN, MASANOBU, ISHKAR, TARVOS];
const archBg = (o = {}) => (g, t) => archive(g, t, { z: o.z ?? 1.5, x: o.x ?? 0, y: o.y ?? -120 }, o);
const X = (g, cx, cy, s, k, col = '#d23a2a') => { if (k <= 0) return; const a = ease.out(clamp(k * 2)), b = ease.out(clamp(k * 2 - 1)); seg(g, [[cx - s, cy - s], [lerp(cx - s, cx + s, a), lerp(cy - s, cy + s, a)]], s * 0.16, col); if (b > 0) seg(g, [[cx + s, cy - s], [lerp(cx + s, cx - s, b), lerp(cy - s, cy + s, b)]], s * 0.16, col); };
function bigPage(g, t, info, o = {}) {
  blurLayer(g, 12, archBg({ z: 1.8 })); veil(g, '#05040a', 0.45);
  const z = 1 + 0.05 * ease.inOut(t / info.dur), w = V(1100, 900) * (o.s ?? 1), h = w * 0.7;
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.rotate(o.rot ?? -0.03); g.translate(-w / 2, -h / 2);
  page(g, 0, 0, w, h, t, { seed: o.seed ?? 3, uv: o.uv || 0, reveal: o.reveal || 0, scraped: o.scraped ?? true, tear: o.tear || 0 });
  o.over?.(g, w, h);
  g.restore();
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
}

// s001 — "Existe um documento que não deveria existir."
registerShot('s001', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); const cam = { z: 1 + 0.16 * k, x: -20 * k, y: -60 * k };
  archive(g, t, cam);
  FX.dust(g, t, { count: 60, color: '#ffe2bd', a: 0.35, area: [E.W * 0.3, E.H * 0.2, E.W * 0.5, E.H * 0.6] });
} });
// s002 — "É a crônica oficial de Kezhar,"
registerShot('s002', { draw(g, t, info) {
  blurLayer(g, 14, archBg({ z: 1.7, x: 80 })); veil(g, '#06040a', 0.45);
  const k = ease.inOut(t / info.dur); chronicleCover(g, E.W / 2, E.H * 0.52, V(0.95, 0.9) * (1 + 0.06 * k), t, { rot: -0.05 + 0.03 * k });
  FX.godRays(g, E.W * 0.15, -40, { angle: Math.PI * 0.3, spread: 0.4, len: 1400, color: '#ffd59a', a: 0.06, t });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
} });
// s003 — "um império que quase não deixou rastros."
registerShot('s003', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  mapBase(g, t, { z: 1.25 - 0.1 * k, x: -260, y: -180 }, { red: 1, crumble: ease.in(prog(t, 0.6, info.dur)) * 0.95, labels: [{ at: 'kezhar', str: 'KEZHAR', color: '#ff8a7a', size: 44, a: 1 - prog(t, 1.2, info.dur) }] });
  FX.dust(g, t, { count: 60, color: '#ffb0a0', a: 0.3 * prog(t, 0.6, 2) });
} });
// s004 — "Em oito páginas diferentes,"
registerShot('s004', { draw(g, t, info) {
  blurLayer(g, 14, archBg({ z: 1.6 })); veil(g, '#05040a', 0.5);
  const z = 1 + 0.04 * t; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  for (let i = 0; i < 8; i++) { const c = i % 4, r = Math.floor(i / 4), kk = ease.outBack(prog(t, 0.1 + i * 0.16, 0.45 + i * 0.16)); if (kk <= 0) continue;
    const w = V(330, 220), h = w * 0.72, x = E.W / 2 + (c - 1.5) * (w + 40) - w / 2, y = E.H / 2 + (r - 0.5) * (h + 40) - h / 2;
    g.save(); g.translate(x + w / 2, y + h / 2); g.rotate((i % 3 - 1) * 0.03); g.scale(kk, kk); page(g, -w / 2, -h / 2, w, h, t, { seed: 10 + i }); g.restore(); }
  g.restore();
  UI.badge(g, { str: String(Math.min(8, Math.floor(prog(t, 0.1, 1.5) * 8 + 0.0001))), size: V(64, 70), a: prog(t, 0.2, 0.5) });
} });
// s005 — "alguém raspou um nome com uma lâmina."
function scrapeMacro(g, t, info, o = {}) {
  bigPage(g, t, info, { s: 2.1, seed: 3, rot: -0.06, over: (g, w, h) => {
    const zx = w * 0.27, zy = w * 0.1 + 4 * ((h - w * 0.2) / 11), zw = w * 0.52;
    const sp = o.speed ?? 2.4, u = 0.5 + 0.5 * Math.sin(t * sp * Math.PI), kx = zx + zw * (0.1 + 0.8 * u);
    const r = rng(Math.floor(t * 24)); for (let i = 0; i < 10; i++) circle(g, kx + (r() - 0.5) * 80, zy + r() * 40 - 20 - r() * 60 * ((t * 3) % 1), 2 + r() * 4, alpha('#f4ead0', 0.8));
    seg(g, [[kx - 60, zy + 120], [kx + 300, zy + 600]], 70, '#0e0b12'); knife(g, kx, zy + 20, -0.5 + Math.sin(t * sp * Math.PI) * 0.12, 2.2, '#0e0b12');
  } });
}
registerShot('s005', { draw(g, t, info) { scrapeMacro(g, t, info, { speed: 1.4 }); } });
// s006 — "Não rasgou."   s007 — "Não queimou."
registerShot('s006', { draw(g, t, info) { bigPage(g, t, info, { s: 0.9, seed: 5, tear: ease.out(prog(t, 0.05, 0.35)), over: (g, w, h) => X(g, w / 2, h / 2, h * 0.35, prog(t, 0.35, 0.7)) }); } });
registerShot('s007', { draw(g, t, info) { bigPage(g, t, info, { s: 0.9, seed: 6, over: (g, w, h) => { for (let i = 0; i < 3; i++) { const fx = w * (0.75 + i * 0.08), fy = h * 0.96; g.save(); g.globalCompositeOperation = 'lighter'; glow(g, fx, fy, 160, '#ff8a3a', 0.5); g.restore(); } import_flame(g, w * 0.85, h * 0.98, 70, t); X(g, w / 2, h / 2, h * 0.35, prog(t, 0.3, 0.65)); } }); } });
function import_flame(g, x, y, s, t) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 3; i++) { const k = 1 - i * 0.28, fl = Math.sin(t * 13 + i * 2) * 0.12; g.fillStyle = ['#ff8a3a', '#ffd27a', '#fff4d0'][i]; g.beginPath(); g.moveTo(x - s * 0.55 * k, y); g.quadraticCurveTo(x - s * 0.6 * k, y - s * 0.9 * k, x + fl * s, y - s * 1.9 * k); g.quadraticCurveTo(x + s * 0.6 * k, y - s * 0.9 * k, x + s * 0.55 * k, y); g.closePath(); g.fill(); } g.restore(); }
// s008 — "Raspou."
registerShot('s008', { draw(g, t, info) { scrapeMacro(g, t, info, { speed: 4.5 }); } });
// s009 — "Letra por letra."
registerShot('s009', { draw(g, t, info) {
  bigPage(g, t, info, { s: 1.9, seed: 8, scraped: false, rot: 0.02, over: (g, w, h) => {
    const n = 12, y = h * 0.5, x0 = w * 0.2, step = w * 0.6 / n, r = rng(77);
    for (let i = 0; i < n; i++) { const gone = prog(t, 0.1 + i * 0.08, 0.2 + i * 0.08), x = x0 + i * step;
      g.save(); g.globalAlpha *= 1 - gone; g.strokeStyle = '#3a2418'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y - 30); for (let k = 0; k < 4; k++) g.lineTo(x + (r() - 0.3) * step * 0.7, y - 30 + k * 20 + (r() - 0.5) * 10); g.stroke(); g.restore();
      if (gone > 0 && gone < 1) { g.save(); g.globalCompositeOperation = 'lighter'; glow(g, x, y, 60, '#fff2c8', 0.6 * (1 - gone)); g.restore(); } }
    const kx = x0 + clamp((t - 0.1) / 0.08 / n) * n * step; knife(g, kx + 20, y - 10, -0.4, 1.0, '#0e0b12');
  } });
} });
// s010 — "Como quem tenta apagar não um texto, mas uma pessoa."
registerShot('s010', { draw(g, t, info) {
  bigPage(g, t, info, { s: 1.15, seed: 9, scraped: false, over: (g, w, h) => {
    const er = ease.inOut(prog(t, 0.8, info.dur - 0.2)), fy = h * 0.92;
    g.save(); g.beginPath(); g.rect(0, h * (0.05 + 0.95 * er), w, h); g.clip();
    drawFigure(g, { x: w * 0.5, y: fy, s: h / 300, facing: 1, pose: POSES.stand, outfit: { ...HAYATO }, expr: 'neutral', ink: '#3a2418', inkFar: '#5a3a24', rim: false, shadow: false });
    g.restore();
    if (er > 0 && er < 1) { const ey = h * (0.05 + 0.95 * er); seg(g, [[w * 0.3, ey], [w * 0.7, ey]], 3, alpha('#fff2c8', 0.8)); g.save(); g.globalCompositeOperation = 'lighter'; glow(g, w * 0.5, ey, 200, '#fff2c8', 0.35); g.restore(); knife(g, w * 0.66, ey, -0.2, 0.9, '#0e0b12'); }
  } });
} });
// s011 — "Sob luz ultravioleta,"
registerShot('s011', { draw(g, t, info) {
  const uv = ease.inOut(prog(t, 0.5, 1.4)), k = ease.inOut(t / info.dur), cam = { z: V(1.25, 1.3) + 0.06 * k, x: -60, y: -120 };
  const geo = archive(g, t, cam, { uv, lamp: uv < 0.5 });
  layer(g, cam, 1, (g) => {
    const o = { x: geo.CX - 380, y: geo.GY, s: 1.5, facing: 1, outfit: RESEARCHER, pose: breathe({ ...POSES.holdFront, eF: [26, -160], hF: [52, -176] }, t), expr: uv > 0.5 ? 'awe' : 'thinking', rim: { color: uv > 0.3 ? '#c9a0ff' : '#ffd59a', dir: [1, -0.3], w: 5 } };
    drawFigure(g, o);
    const hx = o.x + 52 * 1.5, hy = o.y - 176 * 1.5; rr(g, hx - 10, hy - 20, 70, 26, 8); g.fillStyle = '#1a1622'; g.fill(); rr(g, hx + 54, hy - 18, 10, 22, 3); g.fillStyle = uv > 0 ? '#e0c8ff' : '#444'; g.fill();
    if (uv > 0) { FX.lightCone(g, hx + 60, hy - 6, { angle: 0.55, spread: 0.6, len: 700, color: UV, a: 0.35 * uv }); }
  });
  veil(g, '#1a0a30', 0.15 * uv, 'source-over');
} });
// s012 — "o nome voltou a aparecer: Kurozane no Hayato."
registerShot('s012', { draw(g, t, info) {
  const k0 = wt('kurozane', info, 1.5);
  blurLayer(g, 14, archBg({ z: 1.8, uv: 1 })); veil(g, '#0a0418', 0.5);
  const z = 1.05 + 0.06 * ease.inOut(t / info.dur), w = V(1300, 960), h = w * 0.7;
  g.save(); g.translate(E.W / 2, E.H / 2 + 60); g.scale(z, z); g.rotate(-0.025); g.translate(-w / 2, -h / 2 - h * 0.08);
  page(g, 0, 0, w, h, t, { seed: 3, uv: 1, reveal: 0 }); const rv = ease.out(prog(t, k0 - 0.4, k0 + 0.9)); text(g, 'KUROZANE NO HAYATO', w / 2, w * 0.1 + 4.5 * ((h - w * 0.2) / 11), { size: V(84, 64), font: FONTS.serif, italic: true, weight: 900, color: '#efe0ff', glow: 40, glowColor: alpha(UV, 1), alpha: rv });
  g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W / 2, E.H * 0.45, 800, UV, 0.25 + 0.15 * prog(t, k0, k0 + 1)); g.restore();
  FX.dust(g, t, { count: 40, color: '#d8b8ff', a: 0.35 });
} });
// s013 — "Os registros japoneses de 1019"
registerShot('s013', { draw(g, t, info) {
  blurLayer(g, 12, archBg({ z: 1.6, x: -200 })); veil(g, '#05040a', 0.4);
  const k = ease.out(prog(t, 0, 1.0)), z = 1 + 0.05 * t / info.dur, w = V(1300, 980) * k, h = V(360, 300), cx = E.W / 2, cy = E.H * 0.5;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.rotate(-0.02);
  rr(g, -w / 2, -h / 2, w, h, 6); g.fillStyle = linGrad(g, 0, -h / 2, 0, h / 2, ['#efe4c8', '#dccba0']); g.fill();
  for (const sx of [-1, 1]) { rr(g, sx * w / 2 - 20, -h / 2 - 20, 40, h + 40, 14); g.fillStyle = '#3a2418'; g.fill(); }
  const r = rng(12); g.strokeStyle = alpha('#2a1a10', 0.8); g.lineWidth = 4; g.lineCap = 'round';
  for (let x = w / 2 - 60; x > -w / 2 + 60; x -= 44) { let y = -h / 2 + 30; while (y < h / 2 - 40) { const L = 10 + r() * 22; g.beginPath(); g.moveTo(x - 8 + r() * 6, y); g.lineTo(x + 8 - r() * 6, y + L); g.stroke(); y += L + 10; } }
  rr(g, -w / 2 + 70, h / 2 - 110, 60, 60, 6); g.fillStyle = alpha('#c2242c', 0.85 * k); g.fill();
  g.restore();
  UI.readout(g, { value: '1019', x: E.W / 2, y: E.H * 0.82, align: 'center', size: V(84, 90), a: prog(t, wt('1019', info, 1.4) - 0.1, wt('1019', info, 1.4) + 0.2) });
} });
// s014 — "falam apenas de um ataque de piratas, breve e repelido."
registerShot('s014', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), ui = S().ui;
  mapBase(g, t, { z: 1.9 - 0.1 * k, x: 180, y: 140 }, { labels: [{ at: 'iki', str: 'IKI', a: 1 }] });
  layer(g, { z: 1.9 - 0.1 * k, x: 180, y: 140 }, 1, (g) => {
    const tb = wt('repelido', info, 4), [ix, iy] = PLACES.iki;
    for (let i = 0; i < 3; i++) { const go = ease.inOut(prog(t, 0.4 + i * 0.15, 2.8)), back = ease.inOut(prog(t, tb - 0.3, tb + 1.2)); const p = go - back * go; const x = lerp(920 - i * 30, ix - 60, p), y = lerp(560 + i * 40, iy - 10 + i * 18, p); mapBoat(g, x, y, 0.9, ui.accent, back > 0 ? -1 : 1); }
    text(g, 'ATAQUE DE PIRATAS', ix + 40, iy - 120, { size: 30, font: FONTS.ui, weight: 900, color: ui.cream, align: 'left', spacing: 3, alpha: prog(t, wt('ataque', info, 1), wt('ataque', info, 1) + 0.4) });
    text(g, 'REPELIDO', ix + 40, iy - 76, { size: 38, font: FONTS.ui, weight: 900, color: ui.gold, align: 'left', spacing: 4, alpha: prog(t, tb, tb + 0.4) });
  });
} });
// s015 — "A crônica de Kezhar conta outra história."
registerShot('s015', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur);
  blurLayer(g, 12, archBg({ z: 1.5 })); veil(g, '#05040a', 0.4);
  g.save(); g.translate(E.W / 2, E.H / 2); const z = 1 + 0.35 * k; g.scale(z, z); g.translate(-E.W / 2 - 260 * k, -E.H / 2);
  g.save(); g.translate(E.W * 0.3, E.H * 0.55); g.rotate(-0.1); rr(g, -40, -200, 80, 400, 30); g.fillStyle = '#3a2418'; g.fill(); rr(g, -26, -180, 52, 360, 10); g.fillStyle = '#e4d6b0'; g.fill(); g.restore();
  chronicleCover(g, E.W * 0.62, E.H * 0.53, 0.62, t, { rot: 0.03 });
  g.restore();
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });
// s016 — "Fala de uma frota que cobriu o horizonte"
registerShot('s016', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); seaView(g, t, { z: 1.08 - 0.06 * k, x: 40 - 80 * k, y: 0 }, { mood: 'dusk', fleet: 0.35 + 0.65 * k, count: 140 });
  FX.dust(g, t, { count: 20, color: '#ffd0b0', a: 0.2 });
} });
// s017 — "e de generais enviados, um após o outro,"
registerShot('s017', { draw(g, t, info) {
  UI.blueprint(g, { a: 0.04 }); veil(g, '#000', 0.35);
  const z = 1 + 0.04 * t / info.dur; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  roster(g, t, { shown: prog(t, 0.15, info.dur - 0.4) * 8 + 0.6, names: false, silhouettes: SIL8, y: E.H * 0.52 }); g.restore();
} });
// s018 — "para caçar uma única coisa."
registerShot('s018', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.0 + 0.1 * k, x: 120 * k };
  const geo = hillTop(g, t, cam, { mood: 'night' });
  layer(g, cam, 1, (g) => drawChar(g, { x: geo.CX + 60, y: geo.GY + 2, s: 0.75, facing: -1, outfit: HAYATO, pose: breathe(POSES.stand, t), expr: 'determined', rim: rimOf(geo.M, [0.6, -1], 4), weapon: ['sheath', 'bowBack'] }));
  FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.25 });
} });
// s019 — "E conta que essa coisa matou todos eles."
registerShot('s019', { draw(g, t, info) {
  UI.blueprint(g, { a: 0.04 }); veil(g, '#000', 0.35);
  const crossT = Array.from({ length: 8 }, (_, i) => 0.35 + i * 0.3); const [sx, sy] = shake(t, t > 0.35 && t < 2.8 ? 3 : 0, 9);
  g.save(); g.translate(sx, sy); roster(g, t, { shown: 8, names: false, silhouettes: SIL8, crossT, y: E.H * 0.52 }); g.restore();
} });
// s020 — "Os historiadores dizem que ele nunca existiu."
registerShot('s020', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: V(1.2, 1.3) + 0.05 * k, x: 40, y: -100 };
  const geo = archive(g, t, cam, { book: false });
  layer(g, cam, 1, (g) => {
    const shakeH = (s) => ({ ...POSES.crossArms, head: [2 + Math.sin(t * 9 + s) * 5 * (t > 0.6 && t < 1.6 ? 1 : 0), -208] });
    drawFigure(g, { x: geo.CX - 260, y: geo.GY, s: 1.5, facing: 1, outfit: HISTORIAN, pose: breathe(shakeH(0), t), expr: 'smirk', rim: { color: '#ffd59a', dir: [1, -0.4], w: 4 } });
    drawFigure(g, { x: geo.CX + 300, y: geo.GY, s: 1.45, facing: -1, outfit: { ...HISTORIAN, color: '#4a3a3a', head: 'curly' }, pose: breathe(shakeH(2), t, 1, 2), expr: 'neutral', rim: { color: '#ffd59a', dir: [-1, -0.4], w: 4 } });
    page(g, geo.CX - 120, geo.deskY - 150, 240, 170, t, { seed: 4 });
  });
  const st = 1.5, sk = ease.out(prog(t, st, st + 0.2)); if (sk > 0) { g.save(); g.translate(E.W / 2 + 10, E.H * 0.5); g.rotate(-0.15); const sc = 1.8 - 0.8 * sk; g.scale(sc, sc); rr(g, -230, -70, 460, 140, 16); g.strokeStyle = alpha('#d23a2a', 0.9 * sk); g.lineWidth = 10; g.stroke(); text(g, 'LENDA', 0, 4, { size: 96, font: FONTS.title, color: alpha('#d23a2a', 0.9 * sk), spacing: 10 }); g.restore(); }
} });
// s021 — "O império que ele destruiu dizia o contrário."
registerShot('s021', { draw(g, t, info) {
  blurLayer(g, 14, archBg({ z: 1.7 })); veil(g, '#06040a', 0.5);
  const k = ease.inOut(t / info.dur), z = 1 + 0.35 * k;
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2 + 40 * k);
  chronicleCover(g, E.W / 2, E.H * 0.53, 0.85, t, { rot: -0.03 });
  g.restore();
  g.save(); g.globalCompositeOperation = 'lighter'; glow(g, E.W / 2, E.H * 0.48, 500 + 300 * k, '#ff4a3a', 0.12 + 0.2 * k); g.restore();
  FX.dust(g, t, { count: 50, color: '#ffb0a0', a: 0.35 });
} });
// s022 — "Primavera de 1019."  title card over Iki at dawn
registerShot('s022', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur); coast(g, t, { z: 1.12 - 0.08 * k, x: -80 + 60 * k, y: -20 }, { mood: 'dusk', sunX: -300, sunY: 40 });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
  veil(g, '#0a0608', 0.25);
  UI.titleCard(g, t, { lines: ['A LENDA DE', 'KUROZANE NO HAYATO'], sub: 'IKI · PRIMAVERA DE 1019', dur: info.dur + 0.4 });
} });
