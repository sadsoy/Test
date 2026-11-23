// audio.mjs: the whole soundtrack, synthesized: original score + sound effects on the picture's cues, then the mix.
//   node scripts/audio.mjs   ->  out/audio/music.wav, out/audio/sfx.wav, out/audio/mix.wav (narration ducks the music)
// Cues come from the page itself (window.CUES, src/cues.js), so sound and picture share one timeline.
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const SR = 48000;
mkdirSync('out/audio', { recursive: true });
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--allow-file-access-from-files'] });
const pg = await b.newPage(); await pg.goto(pathToFileURL(resolve('studio.html')).href + '?render'); await pg.waitForFunction('window.ready === true');
const { CUES, DURN, TRANS_T } = await pg.evaluate(() => ({ CUES: window.CUES, DURN: DUR, TRANS_T: SCENES.map(s => s[0]) }));
await b.close();
const N = Math.ceil((DURN + .3) * SR);
writeFileSync('out/audio/cues.json', JSON.stringify(CUES, null, 1));

// ---------- tools ----------
let seed = 12345; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647, noise = () => rnd() * 2 - 1;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const stereo = () => [new Float32Array(N), new Float32Array(N)];
function add(bus, t, sig, g = 1, pan = 0) {
  const i0 = Math.round(t * SR), gl = g * Math.cos((pan + 1) * Math.PI / 4) * Math.SQRT2, gr = g * Math.sin((pan + 1) * Math.PI / 4) * Math.SQRT2;
  for (let i = 0; i < sig.length; i++) { const j = i0 + i; if (j < 0 || j >= N) continue; bus[0][j] += sig[i] * gl; bus[1][j] += sig[i] * gr; }
}
const env = (n, a, d, curve = 4) => { const e = new Float32Array(n), na = Math.max(1, Math.round(a * SR)); for (let i = 0; i < n; i++) e[i] = i < na ? i / na : Math.exp(-curve * (i - na) / (d * SR)); return e; };
// state-variable filter with a per-sample cutoff function; mode 'lp' | 'bp' | 'hp'
function svf(x, fc, q = .7, mode = 'bp') {
  const y = new Float32Array(x.length); let lo = 0, bd = 0;
  for (let i = 0; i < x.length; i++) {
    const f = 2 * Math.sin(Math.PI * Math.min(.45, (typeof fc === 'function' ? fc(i / SR) : fc) / SR));
    lo += f * bd; const hi = x[i] - lo - (1 / q) * bd; bd += f * hi; y[i] = mode === 'lp' ? lo : mode === 'hp' ? hi : bd;
  }
  return y;
}
const nz = n => { const a = new Float32Array(n); for (let i = 0; i < n; i++) a[i] = noise(); return a; };
function sine(n, f, ph = 0) { const a = new Float32Array(n); let p = ph; for (let i = 0; i < n; i++) { a[i] = Math.sin(p); p += 2 * Math.PI * (typeof f === 'function' ? f(i / SR) : f) / SR; } return a; }
const mul = (a, b) => a.map((v, i) => v * (typeof b === 'function' ? b(i / SR) : b[i]));

// ---------- instruments ----------
function pluck(f, dur, bright = .5) {   // Karplus-Strong: a kalimba-ish paper pluck
  const n = Math.round(dur * SR), L = Math.max(2, Math.round(SR / f)), buf = new Float32Array(L), out = new Float32Array(n);
  for (let i = 0; i < L; i++) buf[i] = noise() * (1 - bright) + Math.sin(i / L * 2 * Math.PI) * bright;
  let k = 0; for (let i = 0; i < n; i++) { const a = buf[k], b2 = buf[(k + 1) % L]; out[i] = a; buf[k] = .5 * (a + b2) * .996; k = (k + 1) % L; }
  return mul(out, env(n, .002, dur * .6, 3));
}
function bell(f, dur, bright = 1) {     // music box / celesta: inharmonic partials
  const n = Math.round(dur * SR), o = new Float32Array(n);
  [[1, 1, 1], [2, .35 * bright, 1.6], [3.01, .12 * bright, 2.4], [4.2, .06 * bright, 3.5]].forEach(([m, g, dk]) => { const s = sine(n, f * m), e = env(n, .003, dur / dk, 3.5); for (let i = 0; i < n; i++) o[i] += s[i] * e[i] * g; });
  return o;
}
function pad(fs, dur, cut = 1400) {     // soft detuned saw pad, slow swell
  const n = Math.round(dur * SR), o = new Float32Array(n);
  fs.forEach(f => [-.08, .07].forEach(dt => { let p = rnd(); const inc = f * Math.pow(2, dt / 12) / SR; for (let i = 0; i < n; i++) { o[i] += (2 * p - 1) * .5; p += inc; if (p >= 1) p -= 1; } }));
  const y = svf(o, cut, .6, 'lp'), a = Math.min(.9, dur * .4), r = Math.min(1.2, dur * .4);
  for (let i = 0; i < n; i++) { const t = i / SR; y[i] *= Math.min(1, t / a) * Math.min(1, (dur - t) / r) / fs.length; }
  return y;
}
function bass(f, dur) { const n = Math.round(dur * SR), s = sine(n, f), s2 = sine(n, f * 2); const e = env(n, .01, dur * .7, 2.5); return s.map((v, i) => Math.tanh((v + .25 * s2[i]) * 1.6) * e[i]); }
function kick() { const n = Math.round(.35 * SR); return mul(sine(n, t => 45 + 90 * Math.exp(-t * 28)), env(n, .002, .25, 5)); }
function shaker() { const n = Math.round(.08 * SR); return mul(svf(nz(n), 7000, 1.2, 'hp'), env(n, .004, .05, 5)); }

// ---------- score: an original piece in D minor → F major, 96 BPM ----------
const BPM = 96, BT = 60 / BPM, BAR = 4 * BT, mus = stereo();
const CH = { Dm9: [50, 57, 60, 64, 65], Bbmaj7: [46, 53, 57, 62, 65], F: [41, 53, 57, 60, 65], C: [48, 55, 60, 64, 67], Dm: [50, 57, 62, 65, 69], Gm: [43, 55, 58, 62, 67], A: [45, 57, 61, 64, 69], 'C/E': [40, 55, 60, 64, 67], Bb: [46, 53, 58, 62, 65], Fadd9: [41, 53, 57, 60, 67], C69: [48, 55, 60, 62, 69], Am7: [45, 57, 60, 64, 67], Fmaj7: [41, 57, 60, 64, 65], G6: [43, 55, 59, 62, 64], Em7: [40, 55, 59, 62, 64], Dm7: [38, 57, 60, 62, 65] };
// [start s, chord, length s, section]
const PLAN = [];
const sec = (t0, t1, chords, name) => { let t = t0, i = 0; while (t < t1 - .05) { const len = Math.min(BAR, t1 - t); PLAN.push([t, chords[i % chords.length], len, name]); t += len; i++; } };
sec(0, 5.1, ['Am7', 'C69'], 'hook');
sec(5.1, 16.75, ['C69', 'Am7', 'Fmaj7', 'G6'], 'explain');
sec(16.75, 29.65, ['Am7', 'Fmaj7', 'Dm7', 'Em7'], 'drama');
sec(29.65, DURN + .2, ['Fmaj7', 'G6', 'C69', 'Am7', 'C69'], 'outro');
// C major pentatonic (C D E G A): the gentle, river-night colour of the festival, in an original tune
const MELO = { hook: [76, 74, 72, 69], explain: [79, 76, 74, 72, 76, 81], drama: [76, 74, 72, 69, 72], outro: [81, 79, 76, 74, 72, 76, 79] };
PLAN.forEach(([t, ch, len, name], bi) => {
  const notes = CH[ch];
  add(mus, t, pad(notes.slice(1).map(mtof), len + .6, name === 'drama' ? 900 : 1500), name === 'hook' ? .22 : .17, 0);
  if (name !== 'hook') add(mus, t, bass(mtof(notes[0] - 12 + (name === 'drama' ? 0 : 12)), len * .95), name === 'drama' ? .22 : .15, 0);
  // plucked arpeggio, 8ths (16ths in the drama)
  const step = name === 'drama' ? BT / 4 : BT / 2, arp = [1, 2, 3, 4, 3, 2];
  if (name !== 'hook') for (let s = 0, k = 0; s < len - .02; s += step, k++) add(mus, t + s, pluck(mtof(notes[arp[k % arp.length]] + 12), .7, .4), (name === 'drama' ? .09 : .11) * (k % 4 === 0 ? 1.2 : .8), k % 2 ? .35 : -.35);
  // music-box melody, one note per beat with rests
  const mel = MELO[name];
  for (let s = 0, k = 0; s < len - .05; s += BT * (name === 'hook' ? 1 : 2), k++) if ((bi + k) % 3 !== 2 || name === 'outro') add(mus, t + s, bell(mtof(mel[(bi * 2 + k) % mel.length]), 1.6, .8), name === 'outro' ? .11 : .075, .2);
  // rhythm in the middle sections
  if (['explain', 'drama', 'wobble'].includes(name)) for (let s = 0, k = 0; s < len - .02; s += BT, k++) { add(mus, t + s, kick(), name === 'drama' ? .32 : .2, 0); add(mus, t + s + BT / 2, shaker(), .05, .5); }
});
// a soft riser into the first zoom and into the outro
[[3.9, 1.2], [28.5, 1.15]].forEach(([t, d]) => { const n = Math.round(d * SR); add(mus, t, mul(svf(nz(n), x => 300 + 5000 * (x / d) ** 2, 1.5, 'bp'), x => (x / d) ** 2), .1, 0); });
// light stereo echo on the music bus
for (let c = 0; c < 2; c++) { const D = Math.round((c ? .31 : .27) * SR), m = mus[c]; for (let i = D; i < N; i++) m[i] += m[i - D] * .22; }

// ---------- sound effects ----------
const fx = stereo();
const FX = {
  pop: () => { const n = Math.round(.12 * SR); return mul(sine(n, t => 340 + 500 * Math.exp(-t * 40)), env(n, .002, .07, 4)); },
  pop2: () => { const n = Math.round(.12 * SR); return mul(sine(n, t => 560 + 700 * Math.exp(-t * 40)), env(n, .002, .06, 4)); },
  shimmer: () => { const n = Math.round(1.4 * SR), o = new Float32Array(n); for (let k = 0; k < 14; k++) { const s = bell(mtof([86, 88, 91, 93, 95, 98][k % 6]), .9, .5), at = Math.round(k * .055 * SR); for (let i = 0; i < s.length && at + i < n; i++) o[at + i] += s[i] * .18 * (1 - k / 16); } return o; },
  wobble: () => { const n = Math.round(.7 * SR); return mul(sine(n, t => 200 + 30 * Math.sin(t * 30)), env(n, .05, .45, 2)); },
  boing: () => { const n = Math.round(.6 * SR); return mul(sine(n, t => 260 + 160 * Math.exp(-t * 6) * Math.cos(t * 50)), env(n, .003, .4, 3)); },
  whoosh: d => { const n = Math.round((d || .6) * SR); return mul(svf(nz(n), x => 400 + 3000 * Math.sin(Math.PI * x / (d || .6)), 1.2, 'bp'), x => Math.sin(Math.PI * x / (d || .6)) ** 2); },
  swish: () => FX.whoosh(.35),
  zip: () => { const n = Math.round(.45 * SR); return mul(svf(nz(n), x => 4000 * Math.exp(-x * 6) + 300, 2, 'bp'), x => Math.sin(Math.PI * x / .45)); },
  paper: () => { const n = Math.round(.5 * SR), o = svf(nz(n), 2500, .8, 'bp'); for (let i = 0; i < n; i++) o[i] *= (rnd() < .02 ? 3 : .35) * Math.sin(Math.PI * i / n); return o; },
  wipe: () => { const d = .75, n = Math.round(d * SR), o = svf(nz(n), x => 800 + 2600 * Math.sin(Math.PI * x / d), 1, 'bp'); for (let i = 0; i < n; i++) o[i] *= (rnd() < .015 ? 2.4 : .6) * Math.sin(Math.PI * i / n) ** 1.5; return o; },
  whirr: (d, g) => { const n = Math.round(d * SR), slow = g > 1; return mul(svf(nz(n), x => (slow ? 1400 - 900 * (x / d) : 1100), 3, 'bp'), x => (.55 + .45 * Math.sin(2 * Math.PI * (slow ? 16 * x - 7 * x * x / d : 9 * x))) * Math.min(1, x / .15) * Math.min(1, (d - x) / .3)); },
  hum: d => { const n = Math.round(d * SR); return mul(sine(n, 55).map((v, i) => v + .5 * Math.sin(2 * Math.PI * 82.5 * i / SR)), x => Math.min(1, x / .8) * Math.min(1, (d - x) / .8) * (.8 + .2 * Math.sin(x * 12))); },
  brake: d => { const n = Math.round(d * SR); return mul(svf(nz(n), x => 2600 - 1700 * (x / d), 8, 'bp'), x => Math.min(1, x / .1) * (1 - x / d) ** 1.5 * (.7 + .3 * Math.sin(x * 70))); },
  click: () => { const n = Math.round(.25 * SR), o = new Float32Array(n); [0, .07].forEach((t0, k) => { const s = mul(svf(nz(Math.round(.03 * SR)), 5000, 2, 'hp'), env(Math.round(.03 * SR), .001, .01, 4)), p = mul(sine(Math.round(.15 * SR), 2400 - 400 * k), env(Math.round(.15 * SR), .001, .05, 4)); const at = Math.round(t0 * SR); s.forEach((v, i) => o[at + i] += v * .8); p.forEach((v, i) => { if (at + i < n) o[at + i] += v * .35; }); }); return o; },
  stamp: () => { const n = Math.round(.6 * SR), s = mul(sine(n, t => 40 + 80 * Math.exp(-t * 20)), env(n, .002, .35, 4)), z = mul(svf(nz(n), 500, .8, 'lp'), env(n, .001, .08, 4)); return s.map((v, i) => Math.tanh(1.5 * (v + z[i] * 1.5))); },
  swipe: () => { const n = Math.round(.25 * SR); return mul(svf(nz(n), x => 2000 + 3000 * x / .25, 1.5, 'bp'), x => Math.sin(Math.PI * x / .25)); },
  swell: d => { const n = Math.round(d * SR), o = mul(svf(nz(n), x => 500 + 6000 * (x / d) ** 2, 1, 'bp'), x => (x / d) ** 2 * .6); [65, 69, 72, 77].forEach(m => { const s = sine(n, mtof(m)); for (let i = 0; i < n; i++) o[i] += s[i] * .12 * (i / n) ** 1.5; }); return o; },
  tick: () => { const n = Math.round(.03 * SR); return mul(sine(n, 1900), env(n, .001, .012, 4)); },
  ding: () => bell(mtof(91), 1.4, 1),
  water: d => { const n = Math.round(d * SR); return mul(svf(nz(n), 650, .7, 'lp'), x => (.55 + .45 * Math.sin(x * 2.1) * Math.sin(x * 3.7 + 1)) * Math.min(1, x / .6) * Math.min(1, (d - x) / .6)); },
  splash: () => { const n = Math.round(.5 * SR), o = mul(svf(nz(n), x => 2200 - 1500 * x, 1, 'bp'), env(n, .005, .18, 4)); for (let k = 0; k < 4; k++) { const b = mul(sine(Math.round(.06 * SR), x => 500 + 900 * x / .06 + k * 120), env(Math.round(.06 * SR), .002, .03, 4)), at = Math.round((.08 + k * .05) * SR); b.forEach((v, i) => { if (at + i < n) o[at + i] += v * .3; }); } return o; },
  motor: d => { const n = Math.round(d * SR), s = sine(n, 72), s2 = sine(n, 144), z = svf(nz(n), 300, 1, 'lp'); return s.map((v, i) => { const x = i / SR; return (v * .6 + s2[i] * .3 + z[i] * .4) * (.6 + .4 * Math.sin(2 * Math.PI * 16 * x)) * Math.min(1, x / .5) * Math.min(1, (d - x) / .6); }); },
  grind: d => { const n = Math.round(d * SR), z = svf(nz(n), 900, 1.5, 'bp'), w = sine(n, 380); return z.map((v, i) => { const x = i / SR; return (v * (.6 + .4 * Math.sin(2 * Math.PI * 28 * x)) + w[i] * .15) * Math.min(1, x / .2) * Math.min(1, (d - x) / .4); }); },
  thud: () => { const n = Math.round(.3 * SR); return mul(sine(n, t => 40 + 40 * Math.exp(-t * 25)), env(n, .002, .15, 4)); },
  bubble: d => { const n = Math.round(d * SR), o = new Float32Array(n); for (let k = 0; k < d * 9; k++) { const m = Math.round(.05 * SR), f0 = 400 + 700 * rnd(), b = mul(sine(m, x => f0 + 1800 * x), env(m, .002, .025, 4)), at = Math.round(rnd() * (n - m)); b.forEach((v, i) => o[at + i] += v * .5); } return o; },
  chime: () => { const n = Math.round(2 * SR), o = new Float32Array(n); [77, 81, 84, 89].forEach((m, k) => { const s = bell(mtof(m), 1.6, .8), at = Math.round(k * .12 * SR); for (let i = 0; i < s.length && at + i < n; i++) o[at + i] += s[i] * .5; }); return o; },
};
const LEVEL = { pop: .32, pop2: .26, shimmer: .5, wobble: .18, boing: .25, whoosh: .32, swish: .2, zip: .25, paper: .35, wipe: .45, whirr: .09, hum: .14, brake: .1, click: .5, stamp: .55, swipe: .25, swell: .32, tick: .25, ding: .3, chime: .4, water: .12, splash: .3, motor: .13, grind: .14, thud: .4, bubble: .2 };
for (const c of CUES) { if (!FX[c.type]) { console.warn('no sfx', c.type); continue; } add(fx, c.t, FX[c.type](c.d, c.g), (LEVEL[c.type] || .3) * c.g, (rnd() - .5) * .4); }

// ---------- write ----------
function wav(path, [L, R]) {
  let pk = 0; for (let i = 0; i < N; i++) pk = Math.max(pk, Math.abs(L[i]), Math.abs(R[i]));
  const g = pk > .98 ? .98 / pk : 1, buf = Buffer.alloc(44 + N * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) { buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4); buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4); }
  writeFileSync(path, buf); console.log(path, 'peak', pk.toFixed(2));
}
wav('out/audio/music.wav', mus); wav('out/audio/sfx.wav', fx);
// mix: narration on top, music ducked under it (sidechain), sfx; then two-pass loudness to -14 LUFS / -1.5 dBTP
const FIL = '[0:a]loudnorm=I=-16:TP=-2:LRA=11,aformat=channel_layouts=stereo,asplit=2[v][vk];' +
  '[1:a]loudnorm=I=-25:TP=-6[m0];[m0][vk]sidechaincompress=threshold=0.03:ratio=5:attack=40:release=450[m];' +
  '[2:a]volume=-9dB[s];[v][m][s]amix=inputs=3:normalize=0:duration=longest,atrim=0:' + DURN.toFixed(3) + ',afade=t=out:st=' + (DURN - .5).toFixed(3) + ':d=0.5[pre]';
const probe = execFileSync('sh', ['-c', `ffmpeg -hide_banner -i out/voice/narration.wav -i out/audio/music.wav -i out/audio/sfx.wav -filter_complex "${FIL};[pre]loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1`]).toString();
const j = JSON.parse(probe.slice(probe.lastIndexOf('{'), probe.lastIndexOf('}') + 1));
execFileSync('sh', ['-c', `ffmpeg -y -loglevel error -i out/voice/narration.wav -i out/audio/music.wav -i out/audio/sfx.wav -filter_complex "${FIL};[pre]loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true,aresample=48000" -c:a pcm_s16le out/audio/mix.wav`]);
console.log('mix.wav  measured in', j.input_i, 'LUFS → -14');
