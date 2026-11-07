// shots/02_envelope.js — yesterday's black envelope, "você aceitou", back to the hall, the Voice, the rules.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { room, roomGround, ALARM } from '../sets/room.js';
import { apt, aptGround, envelope } from '../sets/apt.js';
import { faceShot, speakerInsert, players, wave, bgBlur } from '../sets/kit.js';
import { P77, EXTRA } from '../cast.js';
import { CROWD_A } from './01_open.js';

const wt = (w, info, d) => (wordTime(w, info.shot.start) ?? info.shot.start + d) - info.shot.start;

// s08 — "Ontem, um envelope preto apareceu debaixo da sua porta."
registerShot('s08', { draw(g, t, info) {
  const GY = aptGround(), k = ease.inOut(t / info.dur), cam = { z: 1.15 + 0.25 * k, x: 0, y: V(60, 120) + V(80, 160) * k };
  const { M } = apt(g, t, cam);
  layer(g, cam, 1, (g) => {
    const slide = ease.out(prog(t, 1.4, 2.6)), ex = E.W / 2 + lerp(0, -170, slide), ey = GY + 24 + slide * 26;
    g.save(); g.beginPath(); g.rect(-E.W, GY - 2, E.W * 3, E.H); g.clip();
    envelope(g, ex, ey - 44 * (1 - slide) + 40, 0.9, 0.08 * slide, 0);
    g.restore();
    if (slide > 0) FX.pool(g, ex, ey + 30, 160, 20, M.practical, 0.2 * slide);
  });
  FX.dust(g, t, { count: 30, color: M.practical, a: 0.3 });
  UI.badge(g, { str: 'ONTEM', a: ease.out(prog(t, 0.1, 0.5)) * clamp((info.dur - t) / 0.3), size: V(44, 54) });
} });

// s09 — "Dentro, uma frase."  hands open the envelope under the lamp
registerShot('s09', { draw(g, t, info) {
  blurLayer(g, 14, (g) => apt(g, t, { z: 1.8, x: V(400, 330), y: V(100, 200) })); veil(g, '#07060c', 0.35);
  const M = mood('interiorWarm'), ink = S().ink, z = 1 + 0.05 * t, cx = E.W / 2, cy = E.H * 0.46;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  glow(g, cx + 200, cy - 500, 700, M.key, 0.25);
  const open = ease.inOut(prog(t, 0.3, 1.0)), card = ease.out(prog(t, 0.9, 1.8));
  if (card > 0) { g.save(); g.translate(cx, cy - 40 - card * 170); rr(g, -150, -95, 300, 190, 8); g.fillStyle = '#f2ece0'; g.fill(); for (let i = 0; i < 3; i++) { g.fillStyle = alpha('#2a2230', 0.5); g.fillRect(-110, -40 + i * 34, 220 - i * 40, 10); } g.restore(); }
  envelope(g, cx, cy, 2.4, 0, open);
  for (const sd of [-1, 1]) { const hx = cx + sd * 260, hy = cy + 120; seg(g, [[hx, hy], [cx + sd * 700, hy + 600]], 110, P77.color); rr(g, hx - 70, hy - 70, 140, 120, 50); g.fillStyle = ink; g.fill(); seg(g, [[hx - sd * 40, hy - 40], [hx - sd * 110, hy - 110]], 34, ink); }
  g.restore();
  FX.dust(g, t, { count: 30, color: M.key, a: 0.35 });
} });

// s10 — "Suas dívidas terminam aqui."  the card fills the frame
registerShot('s10', { draw(g, t, info) {
  blurLayer(g, 16, (g) => apt(g, t, { z: 1.6, x: V(500, 360), y: V(150, 260) })); veil(g, '#06050b', 0.5);
  const ui = S().ui, z = 1.0 + 0.06 * ease.inOut(t / info.dur), cx = E.W / 2, cy = E.H * 0.44;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.rotate(-0.03); g.translate(-cx, -cy);
  rr(g, cx - V(420, 440), cy - V(300, 380), V(840, 880), V(600, 760), 14); g.fillStyle = '#efe8da'; g.fill();
  g.strokeStyle = alpha('#2a2230', 0.25); g.lineWidth = 3; g.strokeRect(cx - V(390, 410), cy - V(270, 350), V(780, 820), V(540, 700));
  const words = ['SUAS', 'DÍVIDAS', 'TERMINAM', 'AQUI.'], ts = ['suas', 'dvidas', 'terminam', 'aqui'].map((w, i) => wt(w, info, 0.15 + i * 0.4));
  words.forEach((w, i) => { const a = ease.out(prog(t, ts[i] - 0.05, ts[i] + 0.25)); text(g, w, cx, cy - V(170, 240) + i * V(110, 150), { size: V(84, 100), font: FONTS.serif, weight: 900, italic: true, color: i === 1 ? shade(ui.accent, -0.2) : '#1c1620', alpha: a }); });
  circle(g, cx, cy + V(240, 330), 30, ui.gold); circle(g, cx, cy + V(240, 330), 18, shade(ui.gold, -0.35));
  g.restore();
  FX.dust(g, t, { count: 30, color: '#ffe0c0', a: 0.3 });
} });

// s11 — "Você aceitou."
registerShot('s11', { draw(g, t, info) {
  faceShot(g, t, info, { who: P77, where: 'apt', expr: t < 0.35 ? 'worried' : 'determined', look: [0, 0.3], rimSide: 1, rimColor: mood('interiorWarm').rim, push: 0.05 });
} });

// s12 — "Agora, vai descobrir o preço."  back in the hall, 77 looks up
registerShot('s12', { draw(g, t, info) {
  const GY = roomGround(), k = ease.inOut(t / info.dur), cam = { z: V(1.45, 1.4) + 0.08 * k, x: -V(60, 40) + 40 * k, y: V(40, 140) };
  const { M } = room(g, t, cam);
  layer(g, cam, 1, (g) => {
    drawFigure(g, { x: E.W / 2 + 330, y: GY - 60, s: 1.2, facing: -1, outfit: EXTRA(21), pose: breathe(POSES.crossArms, t, 1, 4), expr: 'worried', rim: { color: M.rim, dir: [0, -1] }, dim: true });
    drawFigure(g, { x: E.W / 2 - 40, y: GY, s: 1.75, facing: 1, outfit: P77, pose: breathe(POSES.stand, t), expr: 'worried', look: [0.4, -0.9], rim: { color: M.rim, dir: [0, -1] } });
  });
  blurLayer(g, 10, (g) => { drawFigure(g, { x: -40, y: E.H + 120, s: 3.4, facing: 1, outfit: EXTRA(6), pose: POSES.stand, expr: 'neutral', rim: { color: M.rim, dir: [1, -0.5] } }); }, cam, 1.6);
  FX.dust(g, t, { count: 40, color: M.key, a: 0.3 });
} });

// s13 — "Os alto-falantes estalam."  crackling speaker
registerShot('s13', { draw(g, t, info) {
  const crack = (Math.sin(t * 37) > 0.6 || (t > 1.0 && t < 1.25)) ? 1 : 0;
  speakerInsert(g, t, info, { voice: 0.3 + 0.7 * crack, ringColor: '#ffffff', over: (g, cx, cy) => {
    if (crack) { for (let i = 0; i < 3; i++) FX.sparkle(g, cx + Math.sin(t * 50 + i * 2) * 260, cy + Math.cos(t * 41 + i) * 260, 30, '#ffffff', 0.8); veil(g, '#ffffff', 0.05, 'lighter'); }
  } });
} });

// s14 — "Uma voz calma, quase gentil, enche a sala."  wide hall, rings from the speakers, everyone looks up
registerShot('s14', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 1.12 - 0.08 * k, y: -V(80, 140) };
  const { M } = room(g, t, cam, { voice: ease.out(prog(t, 0.2, 1.2)), clock: null });
  layer(g, cam, 1, (g) => {
    const up = t > 0.6;
    players(g, t, CROWD_A.map((p, i) => ({ ...p, look: up ? [0, -1] : [0, 0], expr: up ? (i % 2 ? 'surprised' : 'worried') : 'worried' })), M, { s: 1.6 });
    players(g, t, [{ x: E.W / 2 - 60, d: 0.95, who: P77, facing: 1, expr: up ? 'surprised' : 'worried', look: up ? [0.3, -1] : [0, 0] }], M, { s: 1.6 });
  });
  FX.dust(g, t, { count: 50, color: M.key, a: 0.35 });
} });

// s15 — "Bem-vindos."
registerShot('s15', { draw(g, t, info) {
  speakerInsert(g, t, info, { x: V(-60, -40), voice: 1, ringColor: '#ffffff', over: (g, cx, cy) => wave(g, cx, cy + V(470, 520), V(700, 760), 60, t, alpha('#ffffff', 0.8), 0.9) });
} });

// s16 — "Jogo 1. Silêncio."  title card, lines synced to the words
registerShot('s16', { draw(g, t, info) {
  blurLayer(g, 18, (g) => room(g, t, { z: 1.25, y: -V(120, 220) }, { clock: null })); veil(g, '#04040a', 0.65);
  const t2 = wt('silncio', info, 1.0), ui = S().ui;
  const a1 = ease.out(prog(t, 0.05, 0.35)) * clamp((info.dur - t) / 0.3);
  text(g, 'JOGO 1', E.W / 2, E.H * 0.38, { size: V(110, 130) * (1 + 0.02 * t), color: ui.cream, font: FONTS.title, weight: 700, spacing: 8, glow: 30, glowColor: 'rgba(255,90,170,.8)', alpha: a1 });
  const a2 = ease.outBack(prog(t, t2 - 0.05, t2 + 0.35));
  if (a2 > 0) { text(g, 'SILÊNCIO', E.W / 2, E.H * 0.5, { size: V(120, 140) * (0.9 + 0.1 * a2), color: ui.gold, font: FONTS.title, weight: 700, spacing: 10, glow: 34, glowColor: alpha(ui.gold, 0.8), alpha: clamp(a2) * clamp((info.dur - t) / 0.3) });
    const cx = E.W / 2, cy = E.H * 0.62; ring(g, cx, cy, 60, 6, alpha(ui.accent, a2)); seg(g, [[cx - 42, cy + 42], [cx + 42, cy - 42]], 6, alpha(ui.accent, a2)); wave(g, cx, cy, 60, 14, t, alpha(ui.accent, 0.9 * a2), 1, 3); }
  FX.dust(g, t, { count: 30, color: '#ffc0e0', a: 0.3 });
} });

// s17 — "Quem sobreviver ganha 100 mil reais."  gold counter
registerShot('s17', { draw(g, t, info) {
  const ui = S().ui; backdrop(g, [shade(ui.bpBg, -0.4), ui.bpBg]);
  glow(g, E.W / 2, E.H * 0.45, 700, ui.gold, 0.12);
  const t0 = wt('100', info, 1.0), p = ease.inOut(prog(t, t0 - 0.6, t0 + 0.9)), v = Math.round(lerp(0, 100000, p) / 1000) * 1000;
  const str = 'R$ ' + v.toLocaleString('pt-BR');
  text(g, 'QUEM SOBREVIVER GANHA', E.W / 2, E.H * 0.3, { size: V(40, 44), color: ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 0.05, 0.4)) });
  text(g, str, E.W / 2, E.H * 0.42, { size: V(130, 150), color: ui.gold, font: FONTS.ui, weight: 900, glow: 30, glowColor: alpha(ui.gold, 0.6), alpha: ease.out(prog(t, 0.1, 0.4)) });
  // coins rising
  for (let i = 0; i < 14; i++) { const ph = ((t * 0.6 + i * 0.137) % 1), x = E.W * (0.12 + ((i * 0.618) % 1) * 0.76), y = E.H * (0.75 - ph * 0.5), a = Math.sin(ph * Math.PI) * prog(t, 0.3, 0.8);
    g.save(); g.translate(x, y); g.scale(Math.abs(Math.cos(t * 3 + i)) * 0.9 + 0.1, 1); circle(g, 0, 0, 34, alpha(ui.gold, a)); circle(g, 0, 0, 24, alpha(shade(ui.gold, -0.3), a)); g.restore(); }
  FX.dust(g, t, { count: 30, color: ui.gold, a: 0.3 });
} });

// s18 — "Quem fizer qualquer som será eliminado."  blueprint: sound -> trapdoor
registerShot('s18', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), ui = S().ui;
  const tSom = wt('som', info, 1.0), tElim = wt('eliminado', info, 2.0);
  const cx = E.W / 2, fy = E.H * 0.58, tw = 260;
  // floor line + trapdoor
  seg(g, [[cx - 460, fy], [cx - tw / 2, fy]], 4, c); seg(g, [[cx + tw / 2, fy], [cx + 460, fy]], 4, c);
  const op = ease.inOut(prog(t, tElim - 0.2, tElim + 0.3));
  seg(g, [[cx - tw / 2, fy], [cx - tw / 2 + Math.cos(op * 1.4) * tw / 2, fy + Math.sin(op * 1.4) * tw / 2]], 4, c);
  seg(g, [[cx + tw / 2, fy], [cx + tw / 2 - Math.cos(op * 1.4) * tw / 2, fy + Math.sin(op * 1.4) * tw / 2]], 4, c);
  g.setLineDash([10, 10]); seg(g, [[cx - tw / 2, fy], [cx - tw / 2, fy + 380]], 2, alpha(c, 0.4)); seg(g, [[cx + tw / 2, fy], [cx + tw / 2, fy + 380]], 2, alpha(c, 0.4)); g.setLineDash([]);
  const fall = Math.max(0, t - tElim - 0.15), dy = 0.5 * 2400 * fall * fall;
  g.save(); g.beginPath(); g.rect(-E.W, -E.H, E.W * 3, fy + E.H); if (op > 0.2) g.rect(cx - tw / 2, fy, tw, 500); g.clip();
  UI.lineFigure(g, { x: cx, y: fy + dy, s: 1.6, pose: t > tElim ? POSES.fall : POSES.stand, color: alpha(t > tSom ? ui.accent : c, clamp(1 - fall * 2)) });
  g.restore();
  // the sound wave
  const sw = prog(t, tSom - 0.1, tSom + 0.3);
  if (sw > 0) { wave(g, cx + 190, fy - 300, 180, 30, t, ui.accent, sw, 2.5); FX.rings(g, cx + 30, fy - 320, t, { count: 3, r0: 40, r1: 220, color: ui.accent, a: 0.5 * sw, w: 3 }); text(g, 'SOM', cx + 190, fy - 400, { size: V(40, 48), color: ui.accent, font: FONTS.ui, weight: 900, spacing: 4, alpha: sw }); }
  const ea = ease.outBack(prog(t, tElim, tElim + 0.4));
  if (ea > 0) text(g, 'ELIMINADO', cx, E.H * 0.26, { size: V(90, 104) * (0.85 + 0.15 * ea), color: ui.accent, font: FONTS.title, weight: 700, spacing: 6, glow: 26, glowColor: alpha(ui.accent, 0.7), alpha: clamp(ea) });
} });
