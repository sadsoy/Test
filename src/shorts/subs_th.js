// subs_th.js: Thai subtitles for the Short, drawn by composite() over the finished frame (drawOverlay hook in core.js).
//
// Thai has no spaces between words, only between phrases, so a line is shown phrase by phrase in karaoke style: the
// whole line rises in as the voice starts, the phrase being spoken turns yellow and lifts, phrases already said stay
// white, those to come are dimmer. Phrase onsets come from the loudness envelope of each line (NARR, narration.js):
// the voiced frames are shared out by character count, then each onset snaps to the nearest dip in the voice.
// ph(key, i) gives a phrase's onset, so the animation can hit the words too.

const SUBT = { size: 54, y: 1455, maxW: 860, font: s => `600 ${s}px "Kanit", sans-serif`, hi: '#FFD84D', said: '#FFFFFF', ahead: 'rgba(255,255,255,.62)', ink: '#1E1A24' };
let SUB_Y = null;                                    // a shot may move the subtitles for its own length (set every frame)

const PHR = (() => {
  const out = {};
  for (const [t0, t1, key, text, env] of NARR) {
    const words = text.split(' ').filter(Boolean), chars = words.reduce((s, w) => s + w.length, 0), voiced = [];
    [...env].forEach((v, i) => { if (+v >= 3) voiced.push(i); });
    let c = 0;
    out[key] = words.map((w, j) => {
      let f = voiced[Math.floor(c / chars * voiced.length)] ?? 0; c += w.length;
      if (j > 0) {                                   // snap to the quietest frame within 0.2 s, the gap between phrases
        let best = f, bv = 99; for (let d = -6; d <= 6; d++) { const v = +(env[f + d] ?? 9); if (v < bv) { bv = v; best = f + d; } } f = best;
        while (+(env[f] ?? 9) < 3 && f < env.length - 1) f++;      // then forward to where the voice starts again
      }
      const set = typeof PHON !== 'undefined' && PHON[key] ? PHON[key][j] : null;     // phrases.js, when it has the line
      return { txt: w, on: set ?? t0 + (j ? f : 0) / 30 };
    });
  }
  return out;
})();
const ph = (key, i = 0) => (PHR[key][Math.min(i, PHR[key].length - 1)] || {}).on ?? NT[key][0];
const lineEnd = key => NT[key][1];

let SUBM = null;
function subWidth(txt, size) { if (!SUBM) SUBM = document.createElement('canvas').getContext('2d'); SUBM.font = SUBT.font(size); return SUBM.measureText(txt).width; }

function drawOverlay(c, t) {
  if (window.CLEAN) return;
  const L = NARR.findIndex(([a, b], i) => t >= a - .12 && t < Math.min(b + .35, i + 1 < NARR.length ? NARR[i + 1][0] - .12 : 1e9));
  if (L < 0) return;
  const [a, b, key] = NARR[L], P = PHR[key], size = SUBT.size, gap = size * .32;
  // rows: fill greedily by phrase
  const rows = [[]]; let w = 0;
  P.forEach((p, i) => { const pw = subWidth(p.txt, size); if (rows[rows.length - 1].length && w + gap + pw > SUBT.maxW) { rows.push([]); w = 0; } rows[rows.length - 1].push(i); w += (w ? gap : 0) + pw; });
  const inK = easeOut(seg(t, a - .12, a + .12)), outK = seg(t, b + .1, b + .35), y0 = (SUB_Y ?? SUBT.y) - (rows.length - 1) * size * .62 + (1 - inK) * 26 - outK * 20;
  c.save(); c.globalAlpha = clamp(inK) * (1 - outK); c.textBaseline = 'middle'; c.lineJoin = 'round';
  rows.forEach((row, r) => {
    const rw = row.reduce((s, i, j) => s + subWidth(P[i].txt, size) + (j ? gap : 0), 0);
    let x = W / 2 - rw / 2; const y = y0 + r * size * 1.24;
    for (const i of row) {
      const p = P[i], pw = subWidth(p.txt, size), next = i + 1 < P.length ? P[i + 1].on : b + .1, now = t >= p.on && t < next, said = t >= next;
      const k = now ? backOut(seg(t, p.on, p.on + .18)) : 0, sc = 1 + .06 * k, lift = 6 * k;
      c.save(); c.translate(x + pw / 2, y - lift); c.scale(sc, sc); c.font = SUBT.font(size); c.textAlign = 'center';
      c.shadowColor = 'rgba(20,14,20,.55)'; c.shadowBlur = 14; c.shadowOffsetY = 5;
      c.lineWidth = size * .2; c.strokeStyle = SUBT.ink; c.strokeText(p.txt, 0, 0);
      c.shadowColor = 'transparent'; c.fillStyle = now ? SUBT.hi : said ? SUBT.said : SUBT.ahead; c.fillText(p.txt, 0, 0);
      c.restore(); x += pw + gap;
    }
  });
  c.restore();
}
