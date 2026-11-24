// nova_brand.js — the NOVA 404 brand kit for the paper-cut engine (src/shorts/paper.js).
// Load it after paper.js. Everything is drawn as cut paper on PX and is a pure function of the time you pass in,
// so the same calls work in a still (brand_identity/src/stage.html) and in a Short (shorts_<slug>.html).
//
//   NOVA                                   brand colours (same values as color_palette/nova404_palette.json)
//   NOVA_TOPIC[key]                        topic colour, ink (1 = dark text on it, 0 = cream), Thai/English chip text (space, body, nature, earth, mind, myth, whatif, tech)
//   novaStar(x, y, r, o)                   the folded 4-point star (o.rot, o.lv, o.alpha, o.glow)
//   novaPortal(x, y, R, o)                 the symbol: paper rings opening onto the void, the nova coming through
//                                          o.theme 'light'|'dark', o.k 0..1 build-in, o.t time (slow star breathing)
//   novaWordmark(x, y, size, o)            NOVA + 404 label, x = left, y = baseline. o.theme, o.k 0..1 build-in. returns width
//   novaWordmarkWidth(size)                width of the wordmark at that size; novaWordmarkO(x, y, size) where its O (portal) sits
//                                          (o.portal false draws the letters only, so a big portal can fly into place)
//   novaChip(key, x, y, o)                 a topic chip ("อวกาศ" …) on a strip of paper, o.k pop, o.size, o.lang 'th'|'en'
//   novaHook(lines, x, y, o)               the big hook title: cream cards, ink Kanit 800, one gold word ([[word]] marks it)
//   novaSource(txt, x, y, o)               a small source tag in Space Mono ("ที่มา: NASA 2024")
//   novaMyth(x, y, s, k, o)                the "404" stamp for myth-busting: k 0..1 stamps it in, o.label (default 'ความเชื่อผิด')
//   novaSting(t, o)                        2.4 s logo sting (full frame). Use at the end of a Short or as an intro.
//   novaEnd(t, o)                          end card: symbol, wordmark, "ติดตามไว้ ไม่หลงทางความรู้"
//   novaSky(t, o)                          the brand night sky backdrop: deep ink, paper stars, a far paper planet
//
// Rules this file encodes (see brand_guidelines): light from the top-left, so shadows fall right-down; at most four paper
// heights in one frame; gold is light, never a fill for large areas; coral means "404 / myth / warning" only.

const NOVA = { ink: '#1B1F3B', ink2: '#2E3A6E', ink3: '#46559A', deep: '#0E1226', cream: '#F4ECDD', paper: '#EDE3D1',
  gold: '#FFC83D', goldLt: '#FFE08A', goldDk: '#E9A21F', coral: '#E8604C', coralDk: '#B9432F', teal: '#23867A', mist: '#C9CFE6' };
const NOVA_TOPIC = {
  space:  { col: '#5B6BC0', ink: 0, th: 'อวกาศ',        en: 'SPACE' },
  body:   { col: '#E27A92', ink: 1, th: 'ร่างกาย',       en: 'BODY' },
  nature: { col: '#4FA06E', ink: 1, th: 'ธรรมชาติ',      en: 'NATURE' },
  earth:  { col: '#2E9C8E', ink: 1, th: 'โลกของเรา',     en: 'EARTH' },
  mind:   { col: '#8B6CC4', ink: 0, th: 'สมองและจิตใจ',  en: 'MIND' },
  tech:   { col: '#3C8DCB', ink: 0, th: 'วิทย์และเทคโนฯ', en: 'TECH' },
  myth:   { col: '#E8604C', ink: 0, th: 'ความเชื่อผิด',   en: 'MYTH 404' },
  whatif: { col: '#E9A21F', ink: 1, th: 'ถ้าหาก…?',      en: 'WHAT IF' },
};
const NOVA_FONT = { word: '"Unbounded", "Kanit", sans-serif', th: '"Kanit", "Noto Sans Thai", sans-serif', mono: '"Space Mono", monospace' };
const novaClamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const novaBack = x => { x = novaClamp(x); const s = 1.9; return 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const novaEase = x => { x = novaClamp(x); return x * x * (3 - 2 * x); };
const novaSeg = (t, a, b) => novaClamp((t - a) / (b - a));

// ---------- the nova (folded 4-point star) ----------
function novaStarPaths(x, y, r, inner = .24) {
  const p = (a, q) => [x + Math.cos(a) * q, y + Math.sin(a) * q], k = r * inner, D = Math.PI / 4, U = -Math.PI / 2;
  const top = p(U, r), bot = p(-U, r);
  return [Pp([top, p(U - D, k), p(Math.PI, r), p(-U + D, k), bot]), Pp([top, p(U + D, k), p(0, r), p(-U - D, k), bot])];
}
function novaStar(x, y, r, o = {}) {
  if (r <= .5 || (o.alpha ?? 1) <= 0) return;
  if (o.glow) shine(x, y, r * 2.2, NOVA.goldLt, o.glow);
  const c = PX; c.save(); c.translate(x, y); c.rotate(o.rot || 0); c.translate(-x, -y);
  const [L, R] = novaStarPaths(x, y, r, o.inner ?? .24);
  cut(Pu(L, R), o.light || NOVA.goldLt, o.lv ?? 2, { alpha: o.alpha, tex: .45 });
  cut(R, o.dark || NOVA.gold, 0, { alpha: o.alpha, tex: .45 });
  c.restore();
}

// ---------- the symbol ----------
function novaPortal(x, y, R, o = {}) {
  const k = o.k ?? 1, t = o.t ?? 0, th = o.theme || 'light';
  if (k <= 0) return;
  const L = th === 'light' ? [NOVA.ink, NOVA.ink2, NOVA.ink3, NOVA.deep] : [NOVA.cream, NOVA.ink2, NOVA.ink3, NOVA.deep];
  const ring = (i, a, b) => novaBack(novaSeg(k, a, b));                     // each ring pops in after the one outside it
  const s0 = ring(0, 0, .45), s1 = ring(1, .12, .57), s2 = ring(2, .24, .69), s3 = ring(3, .36, .8);
  if (s0 > .01) cut(Pc(x, y, R * s0), L[0], 3, { sa: .38 });
  if (s1 > .01) cut(Pc(x + R * .025, y + R * .02, R * .84 * s1), L[1], 2, { sa: .3 });
  if (s2 > .01) cut(Pc(x + R * .04, y + R * .035, R * .66 * s2), L[2], 2, { sa: .3 });
  if (s3 > .01) cut(Pc(x + R * .05, y + R * .045, R * .48 * s3), L[3], 0, { tex: .3 });
  const ds = novaSeg(k, .7, .9);
  if (ds > 0) {
    cut(Pc(x - R * .2, y + R * .22, R * .035 * ds), NOVA.cream, 0, { tex: 0, alpha: .9 });
    cut(Pc(x + R * .3, y + R * .25, R * .022 * ds), NOVA.cream, 0, { tex: 0, alpha: .7 });
  }
  const sk = novaBack(novaSeg(k, .55, 1)), breathe = 1 + .03 * Math.sin(t * 2.2);
  if (sk > .01) novaStar(x + R * .08, y - R * .07, R * .4 * sk * breathe, { rot: (1 - novaEase(novaSeg(k, .55, 1))) * -1.4, glow: o.glow ?? 0, lv: 2 });
}

// ---------- the wordmark ----------
// proportions match brand_identity/logo/*.svg (Unbounded 800 caps, portal in place of the O, Space Mono 404 on a coral strip)
function novaMeasure(txt, size, font, weight) { const c = PX; c.save(); c.font = `${weight} ${size}px ${font}`; const w = c.measureText(txt).width; c.restore(); return w; }
function novaWordmarkWidth(size) {
  const capH = size * .7, R = capH * .58, ms = size * .44;
  return novaMeasure('N', size, NOVA_FONT.word, 800) + R * 2.04 + size * .045 + novaMeasure('VA', size, NOVA_FONT.word, 800) + size * .14 + novaMeasure('404', ms, NOVA_FONT.mono, 700) + ms * .7;
}
// where the portal (the O) sits in a wordmark drawn at (x, y, size)
function novaWordmarkO(x, y, size) { const capH = size * .7, R = capH * .58; return { x: x + novaMeasure('N', size, NOVA_FONT.word, 800) + R * 1.02 + size * .01, y: y - capH / 2, R }; }
function novaWordmark(x, y, size, o = {}) {
  const c = PX, k = o.k ?? 1, th = o.theme || 'light', ink = th === 'light' ? NOVA.ink : NOVA.cream, a = o.alpha ?? 1;
  const capH = size * .7, R = capH * .58, lv = o.lv ?? 1;
  const letter = (txt, lx, kk) => {
    if (kk <= .01) return;
    c.save(); c.globalAlpha *= a * novaClamp(kk * 2); c.translate(lx, y + (1 - novaEase(kk)) * size * .35);
    c.font = `800 ${size}px ${NOVA_FONT.word}`; c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    c.shadowColor = SHADE + '.32)'; c.shadowBlur = 3 + lv * 5; c.shadowOffsetX = lv * 1.2; c.shadowOffsetY = 1 + lv * 3;
    c.fillStyle = ink; c.fillText(txt, 0, 0); c.restore();
  };
  let gx = x;
  letter('N', gx, novaSeg(k, 0, .35)); gx += novaMeasure('N', size, NOVA_FONT.word, 800);
  const ox = gx + R * 1.02 + size * .01;
  if (o.portal !== false) { c.save(); c.globalAlpha *= a; novaPortal(ox, y - capH / 2, R, { theme: th, k: novaSeg(k, .1, .75), t: o.t, glow: o.glow }); c.restore(); }
  gx = ox + R * 1.02 + size * .035;
  letter('V', gx, novaSeg(k, .2, .55)); gx += novaMeasure('V', size, NOVA_FONT.word, 800);
  letter('A', gx, novaSeg(k, .3, .65)); gx += novaMeasure('A', size, NOVA_FONT.word, 800);
  // 404 label stamps in last
  const ms = size * .44, tw = novaMeasure('404', ms, NOVA_FONT.mono, 700), lx = gx + size * .14, lh = ms * 1.15, ly = y - lh * .95;
  const lw = tw + ms * .7, n = lh * .22, sk = novaBack(novaSeg(k, .7, 1));
  if (sk > .01) {
    c.save(); c.globalAlpha *= a; c.translate(lx + lw / 2, ly + lh / 2); c.rotate(-4 * Math.PI / 180 - (1 - sk) * .5); c.scale(sk, sk); c.translate(-(lx + lw / 2), -(ly + lh / 2));
    cut(Pp([[lx, ly], [lx + lw, ly], [lx + lw - n, ly + lh / 2], [lx + lw, ly + lh], [lx, ly + lh], [lx + n, ly + lh / 2]]), NOVA.coral, 2);
    c.font = `700 ${ms}px ${NOVA_FONT.mono}`; c.textBaseline = 'alphabetic'; c.textAlign = 'left'; c.fillStyle = NOVA.cream;
    c.fillText('404', lx + ms * .35, ly + lh * .78); c.restore();
  }
  return lx + lw - x;
}

// ---------- content pieces ----------
function novaChip(key, x, y, o = {}) {
  const T = NOVA_TOPIC[key] || NOVA_TOPIC.space, txt = o.text || (o.lang === 'en' ? T.en : T.th), size = o.size || 40;
  const k = o.k == null ? 1 : novaBack(o.k); if (k <= .01) return 0;
  const c = PX, en = o.lang === 'en', font = en ? NOVA_FONT.mono : NOVA_FONT.th, wt = en ? 700 : 600;
  const w = novaMeasure(txt, size, font, wt), h = size * 1.5, dot = size * .34, px = size * .5, tot = w + px * 2 + dot * 2.2;
  const x0 = o.align === 'center' ? x - tot / 2 : x;
  c.save(); c.translate(x0, y); c.rotate(o.rot ?? -.03); c.scale(k, k);
  cut(Pr(0, -h / 2, tot, h, h * .22), T.col, 2);
  cut(Pc(px + dot * .6, 0, dot * .55), T.ink ? NOVA.ink : NOVA.cream, 0, { tex: 0 });
  c.font = `${wt} ${size}px ${font}`; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = T.ink ? NOVA.ink : NOVA.cream;
  c.fillText(txt, px + dot * 1.7, size * .05); c.restore();
  return tot;
}
// lines: array of strings; wrap one word in [[ ]] to set it on a gold card
function novaHook(lines, x, y, o = {}) {
  const size = o.size || 92, gap = size * 1.32, c = PX;
  lines.forEach((ln, i) => {
    const kk = o.k == null ? 1 : novaBack(novaSeg(o.k, i * .18, i * .18 + .6)); if (kk <= .01) return;
    const parts = ln.split(/\[\[|\]\]/), ws = parts.map(p => novaMeasure(p, size, NOVA_FONT.th, 800)), tot = ws.reduce((a, b) => a + b, 0);
    const pad = size * .32, cy = y + i * gap, x0 = x - tot / 2;
    c.save(); c.translate(x, cy); c.rotate((i % 2 ? .012 : -.016)); c.scale(kk, kk); c.translate(-x, -cy);
    cut(Pr(x0 - pad, cy - size * .72, tot + pad * 2, size * 1.42, size * .14), o.card || NOVA.cream, 3);
    let gx = x0;
    parts.forEach((p, j) => {
      if (j % 2) cut(Pr(gx - size * .1, cy - size * .6, ws[j] + size * .2, size * 1.18, size * .1), NOVA.gold, 1, { tex: .5 });
      c.font = `800 ${size}px ${NOVA_FONT.th}`; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = o.ink || NOVA.ink;
      c.fillText(p, gx, cy + size * .05); gx += ws[j];
    });
    c.restore();
  });
}
function novaSource(txt, x, y, o = {}) {
  const size = o.size || 26, c = PX, w = novaMeasure(txt, size, NOVA_FONT.mono, 400), pad = size * .5;
  const x0 = o.align === 'right' ? x - w - pad * 2 : o.align === 'center' ? x - w / 2 - pad : x;
  c.save(); c.globalAlpha *= o.alpha ?? 1;
  cut(Pr(x0, y - size * .8, w + pad * 2, size * 1.6, size * .25), o.card || 'rgba(14,18,38,.78)', 0, { tex: 0 });
  c.font = `400 ${size}px ${NOVA_FONT.mono}`; c.textBaseline = 'middle'; c.textAlign = 'left'; c.fillStyle = o.col || NOVA.cream;
  c.fillText(txt, x0 + pad, y + size * .04); c.restore();
}
function novaMyth(x, y, s, k, o = {}) {
  const kk = novaBack(k); if (kk <= .01) return; const c = PX;
  c.save(); c.translate(x, y); c.rotate(-.12 + (1 - kk) * .6); c.scale(kk * s, kk * s);
  const w = 430, h = 200, n = 36;
  cut(Pp([[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2 - n, 0], [w / 2, h / 2], [-w / 2, h / 2], [-w / 2 + n, 0]]), NOVA.coral, 3);
  c.font = `700 120px ${NOVA_FONT.mono}`; c.textAlign = 'center'; c.textBaseline = 'alphabetic'; c.fillStyle = NOVA.cream; c.fillText('404', 0, 34);
  c.font = `600 34px ${NOVA_FONT.th}`; c.textBaseline = 'middle'; c.fillText(o.label || 'ความเชื่อผิด', 0, 74);
  c.restore();
}

// ---------- backdrops and full-frame pieces ----------
function novaSky(t = 0, o = {}) {
  const c = PX, w = o.w || W, h = o.h || H, seed = o.seed || 4;
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, NOVA.deep); g.addColorStop(1, NOVA.ink);
  c.fillStyle = g; c.fillRect(0, 0, w, h);
  for (let i = 0; i < (o.n || 70); i++) {
    const sx = hash(i * 3.7 + seed) * w, sy = hash(i * 9.1 + seed) * h * (o.band || .8), tw = .6 + .4 * Math.sin(t * 2 + i * 1.7), r = 2 + hash(i * 1.3) * 4;
    if (i % 9 === 0) novaStar(sx, sy, r * 3.2, { lv: 0, glow: .35 * tw, alpha: .9 });
    else cut(Pc(sx, sy, r * (.7 + .3 * tw)), NOVA.cream, 0, { tex: 0, alpha: .35 + .45 * tw });
  }
}
function novaSting(t, o = {}) {
  const c = PX, cx = o.x ?? W / 2, cy = o.y ?? H / 2, sc = o.scale ?? (W / 1080);
  novaSky(t, { n: 50 });
  // 1) the portal opens big in the middle, with paper ripples running out of it
  // 2) it flies down into the place of the O while N, V, A and the 404 label build around it
  const size = 150 * sc, ww = novaWordmarkWidth(size), wx = cx - ww / 2, wy = cy + 60 * sc, O = novaWordmarkO(wx, wy, size);
  const R0 = 230 * sc, m = novaEase(novaSeg(t, 1.0, 1.6));
  const px = cx + (O.x - cx) * m, py = cy - 90 * sc + (O.y - (cy - 90 * sc)) * m, R = R0 + (O.R - R0) * m;
  for (let i = 0; i < 3; i++) {
    const e = novaSeg(t, .15 + i * .18, 1.05 + i * .18); if (e <= 0 || e >= 1) continue;
    c.save(); c.globalAlpha = .55 * (1 - e); c.strokeStyle = [NOVA.ink3, NOVA.cream, NOVA.ink3][i]; c.lineWidth = (14 - i * 3) * sc;
    c.shadowColor = SHADE + '.4)'; c.shadowBlur = 12; c.shadowOffsetY = 6;
    c.beginPath(); c.arc(cx, cy - 90 * sc, R0 * (1 + novaEase(e) * 2.6), 0, TAU); c.stroke(); c.restore();
  }
  novaWordmark(wx, wy, size, { theme: 'dark', k: novaSeg(t, 1.25, 2.15), t, portal: false });
  novaPortal(px, py, R, { theme: 'dark', k: novaSeg(t, 0, 1.0), t, glow: .4 * novaSeg(t, .7, 1.1) * (1 - m * .6) });
  const tk = novaSeg(t, 2.0, 2.4);
  if (tk > 0) { c.save(); c.globalAlpha = tk; c.font = `500 ${42 * sc}px ${NOVA_FONT.th}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = NOVA.mist;
    c.fillText(o.tagline || 'ความรู้ที่หาไม่เจอ… เราหามาให้', cx, wy + 110 * sc + (1 - novaEase(tk)) * 20); c.restore(); }
}
function novaEnd(t, o = {}) {
  const c = PX, sc = W / 1080;
  novaSky(t, { n: 60 });
  novaPortal(W / 2, H * .36, 200 * sc, { theme: 'dark', k: novaSeg(t, 0, .9), t, glow: .3 });
  const size = 110 * sc, ww = novaWordmarkWidth(size);
  novaWordmark(W / 2 - ww / 2, H * .36 + 380 * sc, size, { theme: 'dark', k: novaSeg(t, .4, 1.3), t });
  const k = novaSeg(t, 1.0, 1.5);
  if (k > 0) {
    c.save(); c.globalAlpha = k; c.font = `600 ${52 * sc}px ${NOVA_FONT.th}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = NOVA.cream;
    c.fillText(o.line1 || 'ติดตามไว้ ไม่หลงทางความรู้', W / 2, H * .36 + 520 * sc);
    c.font = `400 ${38 * sc}px ${NOVA_FONT.th}`; c.fillStyle = NOVA.mist; c.fillText(o.line2 || 'คลิปหน้า: ' + (o.next || 'เรื่องที่คุณไม่เคยรู้'), W / 2, H * .36 + 600 * sc); c.restore();
  }
}
