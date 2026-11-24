// endcard.js: the NOVA 404 subscribe end card (3.8 s), built from the brand kit (nova_brand.js). Append it to any Short.
// The portal opens, the wordmark builds, a paper "กดติดตาม" button pops, gets pressed, turns to "ติดตามแล้ว" and its bell rings.
const DUR = 3.8, PROJECT = { duration: DUR, audio: 'out/audio/mix.wav' };
const VO = [.29, 3.4];                                   // where the voice ("ฝากกดติดตาม โนวา สี่ศูนย์สี่ ไว้ด้วยนะ") is
const PRESS = 1.36;                                      // the button is pressed just after "ฝากกดติดตาม"
function bell(x, y, s, rot, col) {
  X.save(); X.translate(x, y); X.rotate(rot); X.scale(s, s);
  const p = new Path2D(); p.moveTo(-26, 18); p.quadraticCurveTo(-24, -24, 0, -28); p.quadraticCurveTo(24, -24, 26, 18); p.lineTo(32, 26); p.lineTo(-32, 26); p.closePath();
  cut(p, col, 1); cut(Pc(0, 32, 7), col, 1); cut(Pc(0, -31, 5), col, 0, { tex: 0 });
  X.restore();
}
function subscribeButton(t, cx, cy) {
  const pop = novaBack(novaSeg(t, .35, .8)); if (pop <= .01) return;
  const done = t >= PRESS + .06, press = t < PRESS ? 1 - .1 * novaEase(novaSeg(t, PRESS - .1, PRESS)) : .9 + .1 * novaBack(novaSeg(t, PRESS, PRESS + .25));
  const w = done ? 600 : 560, h = 132, col = done ? NOVA.cream : NOVA.gold;
  X.save(); X.translate(cx, cy); X.scale(pop * press, pop * press); X.rotate(-.015);
  cut(Pr(-w / 2, -h / 2, w, h, h / 2), col, 3);
  const ring = done ? .45 * Math.exp(-3.2 * (t - PRESS)) * Math.sin((t - PRESS) * 26) : 0;
  bell(-w / 2 + 84, -2, 1.05, ring, NOVA.ink);
  X.font = `800 64px ${NOVA_FONT.th}`; X.textAlign = 'left'; X.textBaseline = 'middle'; X.fillStyle = NOVA.ink;
  X.fillText(done ? 'ติดตามแล้ว' : 'กดติดตาม', -w / 2 + 150, 4);
  if (done) { const k = novaEase(novaSeg(t, PRESS + .08, PRESS + .3)); X.save(); X.translate(w / 2 - 74, 2); X.scale(k, k); cut(Pc(0, 0, 34), NOVA.teal, 1); X.strokeStyle = NOVA.cream; X.lineWidth = 9; X.lineCap = 'round'; X.lineJoin = 'round'; X.beginPath(); X.moveTo(-14, 1); X.lineTo(-4, 12); X.lineTo(15, -11); X.stroke(); X.restore(); }
  X.restore();
  // a few small novas burst from the bell when it rings
  if (done) for (let i = 0; i < 6; i++) { const u = novaSeg(t, PRESS + .02 + i * .03, PRESS + .7 + i * .03); if (u <= 0 || u >= 1) continue; const a = -Math.PI / 2 + (i - 2.5) * .5, r = 60 + 150 * novaEase(u); novaStar(cx - w / 2 + 84 + Math.cos(a) * r, cy + Math.sin(a) * r, 16 * (1 - u) + 4, { lv: 0, glow: .4 * (1 - u) }); }
}
function frame(t) {
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
  novaSky(t, { n: 60 });
  novaPortal(W / 2, 560, 190, { theme: 'dark', k: novaSeg(t, 0, .8), t, glow: .3 });
  const size = 112, ww = novaWordmarkWidth(size);
  novaWordmark(W / 2 - ww / 2, 930, size, { theme: 'dark', k: novaSeg(t, .3, 1.1), t });
  const tk = novaSeg(t, .8, 1.2);
  if (tk > 0) { X.save(); X.globalAlpha = tk; X.font = `500 40px ${NOVA_FONT.th}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = NOVA.mist; X.fillText('ความรู้ที่หาไม่เจอ… เราหามาให้', W / 2, 1030 + (1 - novaEase(tk)) * 16); X.restore(); }
  subscribeButton(t, W / 2, 1200);
  const lk = novaSeg(t, 1.7, 2.1);
  if (lk > 0) { X.save(); X.globalAlpha = lk; X.font = `600 50px ${NOVA_FONT.th}`; X.textAlign = 'center'; X.textBaseline = 'middle'; X.fillStyle = NOVA.cream; X.fillText('ติดตามไว้ ไม่หลงทางความรู้', W / 2, 1360 + (1 - novaEase(lk)) * 20); X.restore(); }
  X.globalCompositeOperation = 'multiply'; X.drawImage(FRAME_TEX, 0, 0); X.globalCompositeOperation = 'source-over';
}
window.renderAt = async (t, type = 'image/png', q = .92) => { frame(t); return cv.toDataURL(type, q); };
window.renderSheet = async (times, cols = 3, w = 360, crop = null) => {
  const [, , cw, ch] = crop || [0, 0, W, H], h = Math.round(w * ch / cw), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
  sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
  for (let i = 0; i < times.length; i++) { const t0 = performance.now(); frame(times[i]); ms.push(Math.round(performance.now() - t0)); const x = (i % cols) * w, y = Math.floor(i / cols) * h, [cx, cy] = crop || [0, 0]; c.drawImage(cv, cx, cy, cw, ch, x, y, w, h); c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 84, 24); c.fillStyle = '#fff'; c.font = '15px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 17); }
  return { url: sc.toDataURL('image/jpeg', .9), ms };
};
// sound cues for scripts/audio.mjs
window.CUES = [['whoosh', 0, .7], ['pop', .3], ['stamp', 1.0, 0, .5], ['pop2', .4], ['click', PRESS], ['ding', PRESS + .05], ['shimmer', PRESS + .1, 0, .7], ['chime', 3.3, 0, .8]]
  .map(([type, t, d, g]) => ({ type, t, d: d || 0, g: g || 1 }));
const SCENES = [[0, frame]];
(async () => {
  makeTextures();
  await Promise.all(['500 40px Kanit', '600 40px Kanit', '800 40px Kanit', '800 40px Unbounded', '700 40px "Space Mono"'].map(f => document.fonts.load(f, 'กดติดตาม NOVA 404')));
  window.ready = true;
  if (!location.search.includes('render')) { const s = document.getElementById('scrub'), lab = document.getElementById('tt'); s.max = DUR; const go = () => { frame(+s.value); lab.textContent = (+s.value).toFixed(2) + 's'; }; s.addEventListener('input', go); go(); }
})();
