// ui.js: shared scene helpers (load after art.js, before scenes.js). Do not redefine these in scenes.js.
//   ph(id, i)            [start, end] of phrase i of line id (from timing.js)
//   wordAt(id, i, word)  approximate time a word is spoken inside a phrase (by its position in SUBT)
//   label(s, t, a, b, o) a key-word card in the top band (layer(0)); pops at a, leaves at b. o: x, y (-700), size, col, back (null = none), edge, rot
//   wsc(x, y)            screen position of a world point in a par-1 layer (camera without rotation)
//   pin(s, wx, wy, sx, sy, k, col, back, size)  a label card at screen (sx, sy) joined by a leader line to world point (wx, wy)
const LN = Object.fromEntries(TL.lines.map(l => [l.id, l])), ph = (id, i) => LN[id].ph[i];
const wordAt = (id, i, word) => { const s = SUBT[id][i], k = s.indexOf(word), [a, b] = ph(id, i); return k < 0 ? a : lerp(a, b, k / s.length); };
const label = (s, t, a, b, o = {}) => txt(s, o.x || 0, o.y ?? -700, o.size || 84, o.col || C.ink, { pop: seg(t, a, a + .35) * (1 - seg(t, b - .2, b)), back: 'back' in o ? o.back : C.cream, z: 1.6, rot: o.rot ?? -.03, edge: o.edge, weight: o.weight });
const wsc = (x, y) => [W / 2 + CAM.z * (x - CAM.x), H / 2 + CAM.z * (y - CAM.y)];
function pin(s, wx, wy, sx, sy, k, col = C.ink, back = C.cream, size = 50) {
  if (k <= 0) return; const [px, py] = wsc(wx, wy);
  screen(() => { X.globalAlpha = clamp(k * 1.5); cut(strip([[sx, sy], [px, py]], 4, 3), rgba('#FFFFFF', .9), { z: .6, rim: false }); cut(circ(px, py, 8, 3), '#FFFFFF', { z: .6 }); txt(s, sx, sy, size, col, { pop: k, back, z: 1.3, weight: 700 }); });
}
