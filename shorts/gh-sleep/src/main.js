// main.js: picks the scene, runs the transitions, adds the subtitles and the paper finish; render hooks for render.mjs.
const DUR = TL.duration, PROJECT = { duration: DUR, audio: 'out/audio/mix.wav' };
// at each scene start: 'fade' (the old scene dissolves out over d s), 'wipe' (a torn sheet sweeps over, cut under it), 'cut'
const TRANS = {
  8.7: { type: 'fade', d: .3 }, 22.6: { type: 'fade', d: .4 },
  25.1: { type: 'wipe', d: .62, col: '#F4ECDC', col2: '#2B3A7A', dir: 1 }, 29.85: { type: 'fade', d: .4 }, 34.4: { type: 'fade', d: .45 },
};
const MAIN = X, OFF = document.createElement('canvas'); OFF.width = W; OFF.height = H; const OFFX = OFF.getContext('2d');
function drawScene(fn, t, ctx) {
  X = ctx; X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1; X.globalCompositeOperation = 'source-over';
  X.fillStyle = '#141634'; X.fillRect(0, 0, W, H); SHADOW_RGB = '18,10,34'; fn(t); X = MAIN;
}
function frame(t) {
  let i = 0; while (i + 1 < SCENES.length && t >= SCENES[i + 1][0]) i++;
  drawScene(SCENES[i][1], t, MAIN);
  for (let j = 1; j < SCENES.length; j++) {
    const t0 = SCENES[j][0], tr = TRANS[t0]; if (!tr) continue;
    if (tr.type === 'fade' && t >= t0 && t < t0 + tr.d) { drawScene(SCENES[j - 1][1], t, OFFX); X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1 - ease((t - t0) / tr.d); X.drawImage(OFF, 0, 0); X.restore(); }
    if (tr.type === 'wipe') tearWipe((t - (t0 - tr.d / 2)) / tr.d, tr.col, tr.col2, tr.dir);
  }
  subs(t);
  X.save(); X.setTransform(1, 0, 0, 1, 0, 0); X.globalCompositeOperation = 'multiply'; X.drawImage(FRAME_TEX, 0, 0); X.restore();
}
window.renderAt = async (t, type = 'image/png', q = .92) => { frame(t); return cv.toDataURL(type, q); };
window.renderSheet = async (times, cols = 3, w = 360, crop = null) => {
  const [, , cw, ch] = crop || [0, 0, W, H], h = Math.round(w * ch / cw), rows = Math.ceil(times.length / cols), sc = document.createElement('canvas');
  sc.width = cols * w; sc.height = rows * h; const c = sc.getContext('2d'), ms = [];
  for (let i = 0; i < times.length; i++) {
    const t0 = performance.now(); frame(times[i]); ms.push(Math.round(performance.now() - t0));
    const x = (i % cols) * w, y = Math.floor(i / cols) * h, [cx, cy] = crop || [0, 0];
    c.drawImage(cv, cx, cy, cw, ch, x, y, w, h); c.fillStyle = 'rgba(0,0,0,.65)'; c.fillRect(x, y, 84, 24); c.fillStyle = '#fff'; c.font = '15px sans-serif'; c.fillText(times[i].toFixed(2) + 's', x + 6, y + 17);
  }
  return { url: sc.toDataURL('image/jpeg', .9), ms };
};
window.gpuInfo = () => 'canvas2d';
(async () => {
  makeTextures();
  await Promise.all(['400 60px Kanit', '700 60px Kanit', '800 60px Kanit', '500 60px Mitr'].map(f => document.fonts.load(f, 'ดวงจันทร์ 59%')));
  window.CUES = buildCues();
  window.ready = true;
  if (!location.search.includes('render')) {
    const s = document.getElementById('scrub'), lab = document.getElementById('tt'); s.max = DUR;
    const go = () => { const t0 = performance.now(); frame(+s.value); lab.textContent = `${(+s.value).toFixed(2)}s · ${Math.round(performance.now() - t0)} ms`; };
    s.addEventListener('input', go); s.value = +(new URLSearchParams(location.search).get('t') || 0); go();
  }
})();
