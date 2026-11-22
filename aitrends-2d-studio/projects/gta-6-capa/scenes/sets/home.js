// sets/home.js — the kid's bedroom (TV glow + desk lamp + skyline window) and the dining room (pendant lamp).
import { E, V, S, mood, layer, rr, seg, circle, ring, poly, linGrad, radGrad, glow, alpha, shade, mix, lerp, clamp, text, FONTS, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const groundY = () => E.H * V(0.8, 0.68);
export const wallBase = () => groundY() - V(150, 230);
export const tvColor = () => mood('interiorCool').practical;     // cool screen light (re-themed by the style)

// ---- bedroom geometry (shared by every bedroom shot) ----
export const BED = () => {
  const CX = E.W / 2, GY = groundY();
  return {
    CX, GY,
    tvX: CX + V(420, 300), tvW: V(560, 420), tvH: V(320, 240), tvBot: GY - V(180, 200),
    deskX0: CX - V(780, 580), deskX1: CX - V(250, 110), deskTop: GY - V(170, 190),
    bagX: CX - V(40, 40), chairX: CX - V(200, 150),
  };
};

// TV screen content painter: (g, x, y, w, h) inside the screen rect
export function tvScreen(g, x, y, w, h, t, on, content) {
  rr(g, x - 14, y - 14, w + 28, h + 28, 10); g.fillStyle = '#07070b'; g.fill();
  g.fillStyle = '#05070c'; g.fillRect(x, y, w, h);
  if (on > 0) {
    g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.globalAlpha *= on;
    if (content) content(g, x, y, w, h);
    else { // generic game frame: neon city racing by
      const c = tvColor(), ui = S().ui;
      g.fillStyle = linGrad(g, 0, y, 0, y + h, [shade(ui.accent, -0.55), shade(c, -0.5), '#090a14']); g.fillRect(x, y, w, h);
      FX.sun(g, x + w * 0.5, y + h * 0.5, h * 0.16, mix(ui.gold, '#ffffff', 0.3), ui.accent, 2.2);
      const r = rng(4); for (let i = 0; i < 9; i++) { const bx = x + ((r() * w + t * 120 * (1 + i % 3)) % (w + 80)) - 40, bh = h * (0.18 + r() * 0.3); g.fillStyle = '#0a0b16'; g.fillRect(bx, y + h * 0.72 - bh, 34 + r() * 30, bh); }
      g.fillStyle = '#0b0c18'; g.fillRect(x, y + h * 0.72, w, h);
      for (let i = 0; i < 6; i++) { const yy = y + h * 0.72 + Math.pow(((i + t * 2) % 6) / 6, 2) * h * 0.3; g.fillStyle = alpha(c, 0.5); g.fillRect(x, yy, w, 2); }
    }
    // scanlines + glass sheen
    g.globalAlpha = 0.12 * on; g.fillStyle = '#000'; for (let yy = y; yy < y + h; yy += 5) g.fillRect(x, yy, w, 2);
    g.restore();
  }
  g.fillStyle = linGrad(g, x, y, x + w, y + h, [alpha('#ffffff', 0.07), alpha('#ffffff', 0), alpha('#ffffff', 0.03)]); g.fillRect(x, y, w, h);
}

export function lampDesk(g, x, y, on, M) {
  const ink = shade(M.dark, -0.5);
  seg(g, [[x, y], [x + 10, y - 120], [x + 70, y - 180]], 8, ink);
  rr(g, x - 30, y - 8, 70, 10, 5); g.fillStyle = ink; g.fill();
  g.save(); g.translate(x + 70, y - 180); g.rotate(0.5);
  poly(g, [[-34, 0], [34, 0], [22, -36], [-22, -36]], ink);
  if (on > 0) { g.fillStyle = alpha(M.practical, on); g.fillRect(-30, -2, 60, 6); }
  g.restore();
  if (on > 0) {
    glow(g, x + 80, y - 170, 220, M.practical, 0.45 * on);
    FX.lightCone(g, x + 80, y - 170, { angle: Math.PI / 2 + 0.25, spread: 0.9, len: 420, color: M.practical, a: 0.22 * on });
  }
}

export function notebook(g, x, y, state, M, w = 150) {
  const paper = mix('#efe6d2', M.practical, 0.15);
  if (state === 'open') {
    poly(g, [[x - w, y - 4], [x, y - 12], [x, y], [x - w, y + 6]], paper);
    poly(g, [[x, y - 12], [x + w, y - 4], [x + w, y + 6], [x, y]], shade(paper, -0.06));
    for (let i = 1; i < 4; i++) { seg(g, [[x - w + 14, y - 4 + i * 2.5 - 6], [x - 14, y - 10 + i * 2.5]], 1.2, alpha('#3a6ea5', 0.5)); }
  } else if (state === 'closed') {
    rr(g, x - w * 0.6, y - 14, w * 1.2, 14, 3); g.fillStyle = shade(S().ui.accent, -0.35); g.fill();
    g.fillStyle = alpha(paper, 0.9); g.fillRect(x - w * 0.6, y - 4, w * 1.2, 4);
  }
}

// bedroom set. o: { day, tv (0..1), tvContent(g,x,y,w,h), lamp (0..1), notebook:'open'|'closed'|null, moonX, controllerOnShelf, ledOn, bag (beanbag), chair }
export function bedroom(g, t, cam, o = {}) {
  const day = !!o.day, M = mood(day ? 'golden' : 'night'), B = BED(), { CX, GY } = B, WB = wallBase();
  const TVC = tvColor(), tvOn = o.tv ?? 1, lamp = o.lamp ?? 0, ui = S().ui;
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, WB, [shade(M.dark, -0.4), shade(M.wall, -0.55), shade(M.wall, -0.38)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, WB + E.H + 4);
    // window (left)
    const wx = CX - V(760, 520), wy = WB - V(720, 900), ww = V(560, 420), wh = V(520, 600);
    glow(g, wx + ww / 2, wy + wh / 2, ww * 1.2, M.key, day ? 0.3 : 0.12);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: shade(M.dark, -0.5), bar: 12, blinds: 0 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, M.sky); g.fillRect(x, y, w, h);
      if (!day) { FX.stars(g, t, { area: [x, y, w, h * 0.55], count: 40, seed: 9 }); FX.moon(g, x + w * (o.moonX ?? 0.72), y + h * (o.moonY ?? 0.24), V(26, 30)); }
      else FX.sun(g, x + w * 0.32, y + h * 0.42, V(40, 46), '#fff6e0', M.key, 5);
      FX.skyline(g, { x: x - 20, y: y + h + 4, w: w + 40, minH: 70, maxH: h * 0.55, color: shade(M.dark, day ? 0.05 : -0.1), windowColor: M.practical, lit: day ? 0.04 : 0.32, seed: 3 });
    });
    rr(g, wx - 24, wy + wh, ww + 48, 18, 4); g.fillStyle = shade(M.dark, -0.4); g.fill();
    if (day) FX.godRays(g, wx + ww * 0.3, wy + wh * 0.4, { count: 7, angle: 0.75, spread: 0.6, len: V(1500, 1700), color: M.key, a: 0.08, t });
    // poster (right wall)
    const px = CX + V(160, 120), py = WB - V(820, 980), pw = V(220, 200), ph = V(300, 270);
    rr(g, px, py, pw, ph, 6); g.fillStyle = shade(M.dark, -0.2); g.fill();
    g.save(); g.beginPath(); g.rect(px + 12, py + 12, pw - 24, ph - 24); g.clip();
    g.fillStyle = linGrad(g, 0, py, 0, py + ph, [shade(ui.accent, -0.55), shade(TVC, -0.55)]); g.fillRect(px, py, pw, ph);
    circle(g, px + pw / 2, py + ph * 0.45, pw * 0.26, alpha(ui.gold, 0.55));
    for (let i = 0; i < 5; i++) g.fillRect(px, py + ph * 0.45 + i * 9, pw, 3);
    poly(g, [[px, py + ph], [px + pw * 0.35, py + ph * 0.62], [px + pw * 0.6, py + ph * 0.8], [px + pw, py + ph * 0.58], [px + pw, py + ph]], shade(M.dark, -0.4));
    g.restore();
    // shelf with the controller
    const sx = CX + V(380, 250), sy = WB - V(480, 560);
    rr(g, sx - 160, sy, 320, 14, 4); g.fillStyle = shade(M.dark, -0.35); g.fill();
    for (let i = 0; i < 5; i++) { rr(g, sx - 140 + i * 26, sy - 70 - (i % 2) * 10, 20, 70 + (i % 2) * 10, 3); g.fillStyle = shade(M.wall, -0.2 - i * 0.05); g.fill(); }
    if (o.controllerOnShelf) controller(g, sx + 70, sy - 22, 0.75, M, o.ledOn ?? 0);
    g.fillStyle = alpha('#000', 0.3); g.fillRect(-E.W, WB - 10, E.W * 4, 10);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, WB, 0, E.H * 1.4, [shade(M.floor, -0.55), shade(M.floor, -0.3)]); g.fillRect(-E.W * 1.5, WB, E.W * 4, E.H * 2);
    FX.floorLines(g, WB, E.H * 1.6, alpha('#000', 0.28), 0.09);
    g.fillStyle = alpha(shade(M.wall, -0.15), 0.5); g.beginPath(); g.ellipse(CX + V(140, 120), GY + V(40, 70), V(520, 440), V(90, 120), 0, 0, Math.PI * 2); g.fill();
    if (tvOn > 0) FX.pool(g, B.tvX - V(120, 120), GY + V(30, 50), V(700, 620), V(140, 170), TVC, 0.28 * tvOn);
    if (lamp > 0) FX.pool(g, (B.deskX0 + B.deskX1) / 2, GY + 20, V(420, 380), V(80, 100), M.practical, 0.2 * lamp);
    if (day) FX.pool(g, CX - V(200, 150), GY + V(40, 60), V(600, 500), V(110, 140), M.key, 0.25);
  });
  layer(g, cam, 0.92, (g) => {
    const dk = shade(M.dark, -0.45);
    // desk (left)
    g.fillStyle = dk; g.fillRect(B.deskX0, B.deskTop, B.deskX1 - B.deskX0, 16);
    g.fillStyle = alpha(M.practical, 0.25 + 0.35 * lamp); g.fillRect(B.deskX0, B.deskTop - 2, B.deskX1 - B.deskX0, 4);
    g.fillRect(B.deskX0 + 16, B.deskTop, 14, GY - B.deskTop); g.fillRect(B.deskX1 - 30, B.deskTop, 14, GY - B.deskTop);
    g.fillStyle = shade(M.dark, -0.3); g.fillRect(B.deskX0 + 30, B.deskTop + 16, (B.deskX1 - B.deskX0) * 0.4, 70);
    lampDesk(g, B.deskX0 + 70, B.deskTop, lamp, M);
    if (o.notebook) notebook(g, B.deskX1 - V(170, 140), B.deskTop, o.notebook, M, V(120, 110));
    if (o.deskExtra) o.deskExtra(g, B, M);
    // TV + stand (right)
    const tx = B.tvX - B.tvW / 2, ty = B.tvBot - B.tvH;
    if (tvOn > 0) { glow(g, B.tvX, ty + B.tvH / 2, B.tvW * 1.3, TVC, 0.35 * tvOn); }
    tvScreen(g, tx, ty, B.tvW, B.tvH, t, tvOn, o.tvContent);
    g.fillStyle = dk; g.fillRect(B.tvX - B.tvW * 0.55, B.tvBot + 20, B.tvW * 1.1, GY - B.tvBot - 20);
    g.fillStyle = shade(M.dark, -0.25); g.fillRect(B.tvX - B.tvW * 0.55, B.tvBot + 20, B.tvW * 1.1, 8);
    seg(g, [[B.tvX, B.tvBot + 14], [B.tvX, B.tvBot + 22]], 20, '#07070b');
    // console on the stand
    rr(g, B.tvX - V(170, 150), B.tvBot + 40, V(130, 110), 34, 6); g.fillStyle = '#0b0b12'; g.fill();
    const led = o.consoleLed ?? (tvOn > 0 ? 1 : 0);
    if (led > 0) { circle(g, B.tvX - V(55, 50), B.tvBot + 57, 4, alpha(TVC, led)); glow(g, B.tvX - V(55, 50), B.tvBot + 57, 30, TVC, 0.6 * led); }
    if (o.bag !== false) beanbag(g, B.bagX, GY, M);
    if (o.chair) FX.chair(g, B.chairX, GY, 1.4, dk);
  });
  return { GY, CX, M, WB, B, TVC };
}

export function beanbag(g, x, y, M) {
  g.fillStyle = shade(M.wall, -0.25); g.beginPath(); g.ellipse(x, y - 34, 110, 48, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = alpha(M.rim, 0.12); g.beginPath(); g.ellipse(x + 20, y - 62, 70, 16, 0, Math.PI, 0); g.fill();
}

// small game controller drawn in place (insert-ready at large s)
export function controller(g, x, y, s, M, led = 0) {
  const ink = '#0b0b12';
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = ink; g.beginPath();
  g.moveTo(-70, -20); g.quadraticCurveTo(0, -36, 70, -20); g.quadraticCurveTo(110, 30, 84, 46); g.quadraticCurveTo(60, 56, 40, 20);
  g.lineTo(-40, 20); g.quadraticCurveTo(-60, 56, -84, 46); g.quadraticCurveTo(-110, 30, -70, -20); g.closePath(); g.fill();
  g.strokeStyle = alpha(M.rim, 0.35); g.lineWidth = 3; g.stroke();
  for (const [dx, dy] of [[-48, -4]]) { seg(g, [[dx - 12, dy], [dx + 12, dy]], 7, '#1e1e2a'); seg(g, [[dx, dy - 12], [dx, dy + 12]], 7, '#1e1e2a'); }
  for (const [dx, dy] of [[44, -12], [56, 0], [44, 12], [32, 0]]) circle(g, dx, dy, 5, '#1e1e2a');
  if (led > 0) { rr(g, -18, -24, 36, 5, 2); g.fillStyle = alpha(tvColor(), led); g.fill(); glow(g, 0, -22, 40, tvColor(), 0.5 * led); }
  g.restore();
}

// ---- dining room ----
export const DIN = () => { const CX = E.W / 2, GY = groundY(); return { CX, GY, tableTop: GY - V(120, 130), tableHW: V(460, 360), lampY: GY - V(600, 760), kidX: CX - V(250, 235), momX: CX + V(250, 235) }; };

// o: { lamp (0..1), window:true }
export function dining(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), N = mood('night'), D = DIN(), { CX, GY } = D, WB = wallBase(), L = o.lamp ?? 1;
  layer(g, cam, 0.5, (g) => {
    g.fillStyle = linGrad(g, 0, -E.H, 0, WB, [shade(M.dark, -0.5), shade(M.wall, -0.55), shade(M.wall, -0.35)]); g.fillRect(-E.W * 1.5, -E.H, E.W * 4, WB + E.H + 4);
    // wainscot
    g.fillStyle = shade(M.wall, -0.5); g.fillRect(-E.W * 1.5, WB - V(260, 300), E.W * 4, V(260, 300));
    g.fillStyle = alpha(M.key, 0.08); g.fillRect(-E.W * 1.5, WB - V(262, 302), E.W * 4, 4);
    // night window (left of centre)
    const wx = CX - V(620, 470), wy = WB - V(760, 920), ww = V(420, 320), wh = V(440, 480);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 1, frame: shade(M.dark, -0.4), bar: 10 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, N.sky); g.fillRect(x, y, w, h); FX.stars(g, t, { area: [x, y, w, h * 0.5], count: 26, seed: 12 });
      FX.skyline(g, { x: x - 10, y: y + h + 2, w: w + 20, minH: 60, maxH: h * 0.5, color: shade(N.dark, -0.1), windowColor: N.practical, lit: 0.35, seed: 6 });
    });
    // framed picture + cabinet (right)
    rr(g, CX + V(280, 190), WB - V(780, 900), V(200, 170), V(150, 130), 6); g.fillStyle = shade(M.dark, -0.3); g.fill();
    rr(g, CX + V(296, 204), WB - V(764, 886), V(168, 142), V(118, 102), 4); g.fillStyle = shade(M.key, -0.55); g.fill();
    g.fillStyle = shade(M.dark, -0.35); g.fillRect(CX + V(420, 330), WB - V(420, 520), V(360, 260), V(420, 520));
    g.fillStyle = alpha(M.key, 0.07); g.fillRect(CX + V(420, 330), WB - V(420, 520), 4, V(420, 520));
    g.fillStyle = alpha('#000', 0.3); g.fillRect(-E.W, WB - 10, E.W * 4, 10);
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, WB, 0, E.H * 1.4, [shade(M.floor, -0.55), shade(M.floor, -0.3)]); g.fillRect(-E.W * 1.5, WB, E.W * 4, E.H * 2);
    FX.floorLines(g, WB, E.H * 1.6, alpha('#000', 0.25), 0.09);
    FX.pool(g, CX, GY + 10, V(700, 560), V(140, 160), M.key, 0.3 * L);
  });
  // pendant lamp (depth 0.95 so it parallaxes a bit)
  layer(g, cam, 0.95, (g) => {
    seg(g, [[CX, -E.H], [CX, D.lampY - 60]], 4, '#0a0809');
    poly(g, [[CX - 90, D.lampY], [CX + 90, D.lampY], [CX + 34, D.lampY - 70], [CX - 34, D.lampY - 70]], shade(M.dark, -0.55));
    if (L > 0) {
      g.fillStyle = alpha(mix(M.practical, '#ffffff', 0.5), L); g.beginPath(); g.ellipse(CX, D.lampY, 84, 12, 0, 0, Math.PI * 2); g.fill();
      glow(g, CX, D.lampY + 10, V(420, 380), M.practical, 0.5 * L);
      FX.lightCone(g, CX, D.lampY, { angle: Math.PI / 2, spread: 0.95, len: GY - D.lampY + 200, color: M.practical, a: 0.2 * L });
    }
  });
  // table front (call after drawing seated figures)
  const table = (g, extra) => {
    const dk = shade(M.dark, -0.35), top = D.tableTop, hw = D.tableHW;
    g.fillStyle = shade(M.floor, -0.1); g.fillRect(CX - hw - 10, top - 10, hw * 2 + 20, 14);
    g.fillStyle = alpha(M.key, 0.25 * L); g.fillRect(CX - hw * 0.7, top - 10, hw * 1.4, 3);
    g.fillStyle = dk; g.fillRect(CX - hw, top + 4, hw * 2, 26);
    g.fillRect(CX - hw + 20, top + 30, 18, GY - top - 30); g.fillRect(CX + hw - 38, top + 30, 18, GY - top - 30);
    // plates
    for (const sx of [-1, 1]) { g.fillStyle = mix('#efe8de', M.key, 0.2); g.beginPath(); g.ellipse(CX + sx * hw * 0.5, top - 12, 54, 9, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = shade(M.key, -0.3); g.beginPath(); g.ellipse(CX + sx * hw * 0.5, top - 14, 28, 5, 0, 0, Math.PI * 2); g.fill(); }
    rr(g, CX + hw * 0.18, top - 46, 22, 36, 4); g.fillStyle = alpha('#cfe0ff', 0.35); g.fill();
    extra?.(g, D, M);
  };
  return { GY, CX, M, WB, D, table };
}
