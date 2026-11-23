// shorts_audio.mjs: the music and sound effects of the clean-energy Short, made in code (no samples), and the mix.
// The score follows the story arc (100 BPM, D minor → D major → suspense → warm, open ending); the SFX hit the same
// beats as the picture: they read the narration timing (src/shorts/narration.js) and the phrase onsets (subs_th.js),
// exactly as the scenes do. Writes out/shorts/audio/{music,sfx}.wav and the final mix.wav (-14 LUFS, -1.5 dBTP).
// The score is synthesized here because scripts/render_music.swift needs macOS; scripts/sfx.mjs is the model for the SFX.
// Usage: node scripts/shorts_audio.mjs
import fs from 'fs';
import vm from 'vm';
import { spawnSync } from 'child_process';

const ctx = vm.createContext({ console });
vm.runInContext(fs.readFileSync('src/shorts/narration.js', 'utf8') + '\n' + fs.readFileSync('src/shorts/phrases.js', 'utf8') + '\n' + fs.readFileSync('src/shorts/subs_th.js', 'utf8')
  + '\nconst W = 1080, clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));', ctx);
const NT = vm.runInContext('NT', ctx), ph = (k, i = 0) => vm.runInContext(`ph(${JSON.stringify(k)}, ${i})`, ctx);
const DUR = 39.9, SR = 48000, N = Math.ceil(DUR * SR), TAU = Math.PI * 2;
// the cuts, as in clean_energy.js
const CUT = { c2: NT.n02[0] - .12, c3: NT.n04[0] - .2, c4: NT.n06[0] - .19, c5: NT.n07[0] - .1, c6: NT.n08[0] - .1, c7: NT.n09[0] - .19, c8: NT.n10[0] - .13 };

// ---------- tools ----------
const L = new Float32Array(N), R = new Float32Array(N), FL = new Float32Array(N), FR = new Float32Array(N);
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const midi = n => 440 * Math.pow(2, (n - 69) / 12);
class LP { constructor() { this.y = 0; } run(x, f) { this.y += (1 - Math.exp(-TAU * f / SR)) * (x - this.y); return this.y; } }
class SVF { constructor() { this.l = this.b = 0; } run(x, f, q = .7) { const F = 2 * Math.sin(Math.PI * Math.min(f, SR / 6) / SR); this.l += F * this.b; const h = x - this.l - this.b / q; this.b += F * h; return { l: this.l, b: this.b, h }; } }
const add = (A, B, i, l, r) => { if (i >= 0 && i < N) { A[i] += l; B[i] += r; } };
const pan = p => [Math.cos((p + 1) * Math.PI / 4), Math.sin((p + 1) * Math.PI / 4)];

// ---------- score ----------
const BPM = 100, BEAT = 60 / BPM, BAR = 4 * BEAT;
const SEC = { a: [0, CUT.c3], b: [CUT.c3, CUT.c4], c: [CUT.c4, CUT.c7], d: [CUT.c7, DUR] };
// chords per section (MIDI roots and voicings), changing every bar from the section start
const CH = {
  a: [[38, 50, 53, 57], [38, 50, 53, 58], [36, 48, 52, 55], [38, 50, 53, 57], [34, 46, 50, 53]],          // Dm Dm(b6) C Dm Bb
  b: [[38, 50, 54, 57], [33, 45, 52, 57], [35, 47, 50, 54], [31, 43, 50, 55]],                            // D A Bm G
  c: [[35, 47, 50, 54], [31, 43, 47, 50], [35, 47, 50, 54], [33, 45, 49, 52], [35, 47, 50, 54]],          // Bm G Bm A Bm
  d: [[31, 43, 50, 55], [38, 50, 54, 57], [33, 45, 52, 57], [35, 47, 50, 54], [31, 43, 50, 57, 62]],      // G D A Bm G(add9) — open end
};
const chordAt = t => { for (const k of ['a', 'b', 'c', 'd']) { const [a, b] = SEC[k]; if (t >= a && t < b) { const i = Math.min(CH[k].length - 1, Math.floor((t - a) / BAR)); return { k, ch: CH[k][i], st: a + i * BAR, sec: k }; } } return { k: 'd', ch: CH.d[4], st: DUR, sec: 'd' }; };

// pad: detuned saws through a lowpass that opens with the story; chords crossfade at bar lines
function pad() {
  const lp1 = new SVF(), lp2 = new SVF(), ph = new Float64Array(16), r = rng(3);
  const cut = t => t < SEC.a[1] ? 380 + 80 * Math.sin(t * .7) : t < SEC.b[1] ? 1200 + 900 * Math.min(1, (t - SEC.b[0]) / 3) : t < SEC.c[1] ? 520 : 900 + 1500 * Math.min(1, (t - SEC.d[0]) / 6);
  const amp = t => (t < SEC.a[1] ? .16 : t < SEC.b[1] ? .14 : t < SEC.c[1] ? .1 : .16) * Math.min(1, t / 1.5) * Math.min(1, (DUR - t) / 2.2);
  for (let i = 0; i < N; i++) {
    const t = i / SR, { ch } = chordAt(t); let sl = 0, sr = 0;
    ch.forEach((n, j) => { for (let d = 0; d < 2; d++) { const k = j * 2 + d, f = midi(n + (d ? .09 : -.08)); ph[k] = (ph[k] + f / SR) % 1; const s = 2 * ph[k] - 1; if (d) sr += s; else sl += s; } });
    const c = cut(t), a = amp(t) / ch.length;
    add(L, R, i, lp1.run(sl, c, .8).l * a, lp2.run(sr, c, .8).l * a);
  }
}
// a low pulse on eighths (the machines) in A, a soft kick on beats in B and D
function rhythm() {
  for (let b = 0; b * BEAT / 2 < DUR; b++) {
    const t0 = b * BEAT / 2, { sec } = chordAt(t0 + .001);
    if (sec === 'a' && t0 > .6) {                                             // mechanical chug: filtered noise + low thump
      const r = rng(b), lp = new LP(), acc = b % 4 === 0 ? 1 : .55;
      for (let i = 0; i < SR * .12; i++) { const t = i / SR, e = Math.exp(-t * 38) * acc; add(L, R, Math.round(t0 * SR) + i, lp.run(r() * 2 - 1, 900) * .2 * e + Math.sin(TAU * 55 * t) * .22 * e * (b % 2 ? 0 : 1), lp.y * .2 * e + Math.sin(TAU * 55 * t) * .22 * e * (b % 2 ? 0 : 1)); }
    }
    if ((sec === 'b' || (sec === 'd' && t0 > SEC.d[0] + BAR)) && b % 2 === 0 && t0 < DUR - 1.2) {   // kick
      for (let i = 0; i < SR * .3; i++) { const t = i / SR, f = 48 + 90 * Math.exp(-t * 30), s = Math.sin(TAU * f * t) * Math.exp(-t * 11) * .42; add(L, R, Math.round(t0 * SR) + i, s, s); }
      if (b % 4 === 2) { const r = rng(b * 7), hp = new SVF(); for (let i = 0; i < SR * .06; i++) { const t = i / SR, s = hp.run(r() * 2 - 1, 7000).h * Math.exp(-t * 60) * .08; add(L, R, Math.round((t0 + BEAT / 2) * SR) + i, s, s * .8); } }
    }
    if (sec === 'c') {                                                          // the clock of the hard part
      const r = rng(b * 13), bp = new SVF(); for (let i = 0; i < SR * .03; i++) { const t = i / SR, s = bp.run(r() * 2 - 1, b % 2 ? 2600 : 3400, 4).b * Math.exp(-t * 140) * .25; add(L, R, Math.round(t0 * SR) + i, s * .7, s); }
    }
  }
}
// plucked arpeggios (Karplus–Strong) in B and D; low piano notes in C
function pluck(t0, f, amp, p = 0) {
  const n = Math.round(SR / f), buf = new Float32Array(n), r = rng(Math.round(f * 100 + t0 * 10)); for (let i = 0; i < n; i++) buf[i] = r() * 2 - 1;
  const [gl, gr] = pan(p); let k = 0, prev = 0;
  for (let i = 0; i < SR * 1.4; i++) { const v = buf[k], nv = .5 * (v + buf[(k + 1) % n]) * .996; buf[k] = nv; k = (k + 1) % n; const s = (v * .7 + prev * .3) * amp * Math.min(1, i / 40); prev = v; add(L, R, Math.round(t0 * SR) + i, s * gl, s * gr); }
}
function piano(t0, f, amp, p = 0) {
  const [gl, gr] = pan(p);
  for (let i = 0; i < SR * 2.2; i++) { const t = i / SR, e = Math.exp(-t * 2.2) * Math.min(1, t * 400), s = (Math.sin(TAU * f * t) + .45 * Math.sin(TAU * 2 * f * t) * Math.exp(-t * 3) + .2 * Math.sin(TAU * 3.01 * f * t) * Math.exp(-t * 5)) * e * amp; add(L, R, Math.round(t0 * SR) + i, s * gl, s * gr); }
}
function melody() {
  for (let s = 0; s * BEAT / 4 < DUR - 1.5; s++) {
    const t0 = s * BEAT / 4, { sec, ch } = chordAt(t0 + .001);
    if ((sec === 'b' || sec === 'd') && t0 > SEC[sec][0] + (sec === 'd' ? 1.2 : .3)) {
      const pat = [0, 2, 1, 3, 2, 1, 3, 2], n = ch[1 + pat[s % 8] % (ch.length - 1)] + 12 + (s % 16 >= 8 ? 12 : 0);
      pluck(t0, midi(n), sec === 'd' ? .2 : .16, s % 2 ? .45 : -.45);
    }
    if (sec === 'c' && s % 8 === 0) piano(t0, midi(ch[0] + 12 + (s % 16 ? 7 : 0)), .2, -.2);
  }
  piano(SEC.d[1] - 2.6, midi(62), .16, 0); piano(SEC.d[1] - 2.6, midi(69), .12, .3); piano(SEC.d[1] - 2.6, midi(74), .1, -.3);   // the open last chord
}

// ---------- sound effects ----------
function noiseBurst(t0, d, f0, f1, amp, o = {}) {        // a filtered-noise gesture: whoosh, paper slide, puff
  const r = rng(Math.round(t0 * 1000) + (o.seed || 0)), bp = new SVF(), [gl, gr] = pan(o.pan || 0);
  for (let i = 0; i < SR * d; i++) { const k = i / (SR * d), e = Math.sin(Math.PI * Math.pow(k, o.shape || 1)) ** 2, f = f0 * Math.pow(f1 / f0, k), s = bp.run(r() * 2 - 1, f, o.q || 1.2).b * e * amp; add(FL, FR, Math.round(t0 * SR) + i, s * gl, s * gr); }
}
function thump(t0, f = 70, amp = .5, d = .35) { for (let i = 0; i < SR * d; i++) { const t = i / SR, s = Math.sin(TAU * (f + 60 * Math.exp(-t * 25)) * t) * Math.exp(-t * 9) * amp; add(FL, FR, Math.round(t0 * SR) + i, s, s); } }
function paperTap(t0, amp = .35, p = 0) { noiseBurst(t0, .07, 2400, 1400, amp, { q: .8, pan: p, shape: .4 }); thump(t0, 110, amp * .35, .12); }
function chime(t0, notes, amp = .14, p = 0) { const [gl, gr] = pan(p); notes.forEach((n, j) => { const f = midi(n); for (let i = 0; i < SR * 1.6; i++) { const t = i / SR, s = (Math.sin(TAU * f * t) + .3 * Math.sin(TAU * f * 2.76 * t) * Math.exp(-t * 6)) * Math.exp(-t * 3) * Math.min(1, t * 800) * amp; add(FL, FR, Math.round((t0 + j * .07) * SR) + i, s * gl, s * gr); } }); }
function zap(t0, amp = .12, d = .35) { const r = rng(Math.round(t0 * 77)); for (let i = 0; i < SR * d; i++) { const t = i / SR, f = 300 + 1800 * t / d, s = (Math.sign(Math.sin(TAU * f * t)) * .3 + (r() - .5) * .5) * Math.exp(-t * 9) * amp; add(FL, FR, Math.round(t0 * SR) + i, s * .8, s); } }
function snip(t0) { for (const d of [0, .09]) { noiseBurst(t0 + d, .045, 6000, 3500, .5, { q: 2, shape: .3 }); thump(t0 + d, 900, .08, .04); } }
function stamp(t0) { thump(t0, 55, .7, .5); noiseBurst(t0, .12, 1200, 300, .5, { q: .7, shape: .2 }); }
function hum(t0, t1, amp = .05) { for (let i = Math.round(t0 * SR); i < Math.min(N, Math.round(t1 * SR)); i++) { const t = i / SR, e = Math.min(1, (t - t0) / .4, (t1 - t) / .4), s = (Math.sin(TAU * 100 * t) + .4 * Math.sin(TAU * 200 * t) + .2 * Math.sin(TAU * 300 * t)) * e * amp; add(FL, FR, i, s, s); } }

function sfx() {
  // 1 hook: the three fuel icons plug in, the snip, the title
  paperTap(.15, .3); [1, 2, 3].forEach((k, j) => paperTap(ph('n01', k) + (k === 1 ? .25 : 0), .38, [-.5, 0, .5][j]));
  const snap = ph('n01', 4); snip(snap - .02); noiseBurst(snap + .05, .8, 900, 200, .3, { shape: .4 }); thump(snap, 60, .5, .6);
  // 2 setup: whoosh in, the ring fills, the CO2 load
  noiseBurst(CUT.c2 - .25, .55, 300, 2200, .28, { shape: .7 });
  noiseBurst(ph('n02', 1) - .1, .9, 500, 1800, .12, { q: 3 }); paperTap(ph('n02', 1) - .1, .3);
  thump(ph('n03', 2) - .1, 45, .45, .9); noiseBurst(ph('n03', 2), 1.8, 150, 90, .35, { q: .6 }); paperTap(ph('n03', 2) + .3, .35);
  // the paper sheet wipe to the clean world, sunrise chime, panels unfolding, the -90% drop
  noiseBurst(CUT.c3 - .3, .6, 600, 4000, .4, { q: .7, shape: .6 }); noiseBurst(CUT.c3 + .05, .5, 3500, 900, .3, { q: .7 });
  chime(NT.n04[0] + .2, [74, 78, 81, 86], .1, .2);
  for (let i = 0; i < 12; i++) paperTap(ph('n04', 0) + i * .1 + .05, .1 + .02 * (i % 3), (i % 3 - 1) * .5);
  noiseBurst(ph('n04', 1), .8, 2400, 300, .18, { q: 2 }); paperTap(ph('n04', 1) + .8, .3);
  // night: wind dies, batteries rise and click on, the grid lights
  noiseBurst(ph('n05', 0) - .2, 2.2, 700, 250, .12, { q: .5 });
  for (let i = 0; i < 3; i++) { thump(ph('n05', 1) + i * .08, 90, .25, .2); zap(ph('n05', 1) + .45 + i * .06, .07); }
  hum(ph('n05', 1) + .4, CUT.c4 + .2, .025);
  chime(ph('n05', 2) - .1, [81, 85, 88], .09, -.2); zap(ph('n05', 2), .08, .5);
  // 4 turning point: whoosh in, five tiles drop, the electricity tile lights
  noiseBurst(CUT.c4 - .3, .5, 2000, 200, .3);
  for (let i = 0; i < 5; i++) { thump(NT.n06[0] + .05 + i * .14, 80 - i * 4, .3, .25); paperTap(NT.n06[0] + .05 + i * .14, .2); }
  thump(ph('n06', 1), 42, .7, .9); zap(ph('n06', 1), .1, .4); chime(ph('n06', 1) + .05, [69, 73, 76], .08);
  paperTap(ph('n06', 2) + .1, .3);
  // the hard sectors pop in, then the stamp
  for (let p = 0; p < 4; p++) paperTap(ph('n07', p) - .1, .4, [-.4, .4, -.4, .4][p]);
  stamp(ph('n07', 4) - .03);
  // minerals: six ores drop on the EV, one on the petrol car, the ×6 card, the "clean is not impact-free" card
  const six = ph('n08', 1); for (let i = 0; i < 6; i++) { thump(six + .05 + i * .16, 95 + i * 6, .35, .2); paperTap(six + .05 + i * .16, .18, -.4); }
  thump(six + .05, 80, .3, .2); paperTap(six + .95, .4, .4);
  stamp(ph('n08', 2) - .03); noiseBurst(ph('n08', 2) + .1, 1.6, 400, 200, .14, { q: .6 });
  // 5 the air clears; the planet wired; the question
  noiseBurst(CUT.c7 - .2, 1.6, 300, 3000, .18, { q: .5 }); chime(ph('n09', 1), [74, 79, 83, 86, 91], .09, .3); paperTap(ph('n09', 2), .3);
  noiseBurst(CUT.c8 - .3, .9, 200, 900, .2, { q: .6 }); for (let i = 0; i < 6; i++) zap(NT.n10[0] + .4 + i * .22, .045, .25);
  paperTap(ph('n10', 2) - .05, .35); thump(ph('n10', 2) + .25, 50, .55, 1.0); chime(ph('n10', 2) + .25, [74, 81, 86, 88], .1);
}

function writeWav(file, A, B) {
  const buf = Buffer.alloc(44 + N * 8), w = (o, s) => buf.write(s, o);
  w(0, 'RIFF'); buf.writeUInt32LE(36 + N * 8, 4); w(8, 'WAVE'); w(12, 'fmt '); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(3, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 8, 28); buf.writeUInt16LE(8, 32); buf.writeUInt16LE(32, 34); w(36, 'data'); buf.writeUInt32LE(N * 8, 40);
  for (let i = 0; i < N; i++) { buf.writeFloatLE(A[i], 44 + i * 8); buf.writeFloatLE(B[i], 48 + i * 8); }
  fs.writeFileSync(file, buf);
}
pad(); rhythm(); melody(); sfx();
fs.mkdirSync('out/shorts/audio', { recursive: true });
writeWav('out/shorts/audio/music.wav', L, R); writeWav('out/shorts/audio/sfx.wav', FL, FR);

// ---------- mix: narration on top, the music ducks under it, then two-pass loudnorm to -14 LUFS / -1.5 dBTP ----------
const ff = a => { const p = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...a], { encoding: 'utf8', maxBuffer: 1 << 26 }); if (p.status) throw new Error(p.stderr.slice(-800)); return p.stderr; };
const lufs = f => +[...ff(['-i', f, '-af', 'ebur128', '-f', 'null', '-']).matchAll(/I:\s+(-?[\d.]+) LUFS/g)].pop()[1];
const SRC = { voice: 'out/shorts/audio/narration.wav', music: 'out/shorts/audio/music.wav', sfx: 'out/shorts/audio/sfx.wav' };
const LEVEL = { voice: -16, music: -27, sfx: -25 };
const gain = Object.fromEntries(Object.entries(SRC).map(([k, f]) => [k, +(LEVEL[k] - lufs(f)).toFixed(2)]));
console.log('gains dB', JSON.stringify(gain));
const v = (i, k) => `[${i}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo,volume=${gain[k]}dB`;
const graph = last => [`${v(0, 'voice')},highpass=f=70,acompressor=threshold=0.1:ratio=3:attack=5:release=120,asplit=2[d][k]`, `${v(1, 'music')}[m]`,
  `[m][k]sidechaincompress=threshold=0.02:ratio=6:attack=40:release=500[md]`, `${v(2, 'sfx')}[s]`,
  `[d][md][s]amix=inputs=3:normalize=0,atrim=0:${DUR},afade=t=out:st=${(DUR - .6).toFixed(2)}:d=0.6,${last}[out]`].join(';');
const inputs = Object.values(SRC).flatMap(f => ['-i', f]), base = 'loudnorm=I=-14:TP=-1.5:LRA=11';
const m = JSON.parse(/\{[^{}]*"input_i"[^{}]*\}/.exec(ff([...inputs, '-filter_complex', graph(`${base}:print_format=json`), '-map', '[out]', '-f', 'null', '-']))[0]);
ff(['-y', ...inputs, '-filter_complex', graph(`${base}:linear=true:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset},aresample=48000`),
  '-map', '[out]', '-c:a', 'pcm_s24le', 'out/shorts/audio/mix.wav']);
console.log(`out/shorts/audio/mix.wav: ${lufs('out/shorts/audio/mix.wav')} LUFS`, 'cuts', JSON.stringify(Object.fromEntries(Object.entries(CUT).map(([k, x]) => [k, +x.toFixed(2)]))));
