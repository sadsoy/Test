// subs.js: karaoke subtitles on a cut-paper card. The whole phrase shows at once; the spoken word turns red and lifts,
// words already said are ink, words to come are soft grey. Key words get a gold paper underline once said.
// Word timing inside a phrase is spread by character count (the take is split into phrases at its pauses).
const SUBT = {
  L1: ['มหาสมุทรแปซิฟิกกำลังส่งสัญญาณ', 'และนักวิทยาศาสตร์กำลังจับตา'],
  L2: ['ปีนี้', 'เอลนีโญมีแนวโน้มจะแรงมาก', 'จนถูกเรียกว่า ซูเปอร์เอลนีโญ'],
  L3: ['เพราะผิวน้ำแปซิฟิกเขตร้อน ตอนกลางและตะวันออก', 'อุ่นกว่าปกติมาก'],
  L4: ['ปกติลมสินค้าพัดน้ำอุ่นไปทางตะวันตก', 'แต่เมื่อลมอ่อนลง', 'น้ำอุ่นก็แผ่ไปทางตะวันออก'],
  L5: ['น้ำเย็นที่ผุดขึ้นนอกชายฝั่งอเมริกาใต้ ก็ลดลง'],
  L6: ['ฝนและอุณหภูมิทั่วโลกจึงเปลี่ยน', 'บางที่มักแล้ง', 'บางที่ฝนตกหนัก', 'แล้วแต่ภูมิภาค'],
  L7: ['เมื่อโลกร้อนขึ้นอยู่แล้ว', 'เอลนีโญที่แรงมาก', 'จึงอาจเพิ่มความเสี่ยงอากาศสุดขั้ว'],
  L8: ['ติดตามประกาศกรมอุตุฯ', 'และเตรียมพร้อมอย่างมีสติ'],
};
const SUB_SPOKEN = {};
const SUB_KEY = ['แปซิฟิก', 'จับตา', 'แรงมาก', 'ซูเปอร์เอลนีโญ', 'อุ่นกว่าปกติ', 'ลมสินค้า', 'ตะวันตก', 'อ่อนลง', 'ตะวันออก', 'น้ำเย็น', 'ลดลง', 'แล้ง', 'ฝนตกหนัก', 'แล้วแต่ภูมิภาค', 'โลกร้อน', 'อาจ', 'สุดขั้ว', 'อย่างมีสติ'];
const SUB_Y = 1478, SUB_MAXW = 820, SUB_SIZE = 62, SUB_LH = 84;
const SEGR = new Intl.Segmenter('th', { granularity: 'word' });
const SUB_LIST = []; TL.lines.forEach(L => L.ph.forEach((p, i) => SUB_LIST.push({ id: L.id, i, a: p[0], b: p[1], text: SUBT[L.id][i] })));
// words from the Thai segmenter, re-joined so compounds never break across rows (ดวง|จันทร์) and numbers stay whole
const SUB_KEEP = ['มหาสมุทร', 'แปซิฟิก', 'สัญญาณ', 'นักวิทยาศาสตร์', 'จับตา', 'เอลนีโญ', 'ซูเปอร์เอลนีโญ', 'แนวโน้ม', 'ผิวน้ำ', 'เขตร้อน', 'ตอนกลาง', 'ตะวันออก', 'ตะวันตก', 'อุ่นกว่าปกติ', 'ลมสินค้า', 'น้ำอุ่น', 'อ่อนลง', 'น้ำเย็น', 'ผุดขึ้น', 'ชายฝั่ง', 'อเมริกาใต้', 'อุณหภูมิ', 'ทั่วโลก', 'ฝนตกหนัก', 'ภูมิภาค', 'โลกร้อน', 'ความเสี่ยง', 'สุดขั้ว', 'ติดตาม', 'ประกาศ', 'กรมอุตุฯ', 'เตรียมพร้อม', 'อย่างมีสติ'];
function subWords(text) {
  const segs = [...SEGR.segment(text)].map(s => ({ w: s.segment, i: s.index })), out = [];
  const spans = []; SUB_KEEP.forEach(k => { let p = text.indexOf(k); while (p >= 0) { spans.push([p, p + k.length]); p = text.indexOf(k, p + 1); } });
  const inSpan = i => spans.find(([a, b]) => i >= a && i < b);
  segs.forEach(s => {
    const prev = out[out.length - 1], sp = inSpan(s.i);
    if (prev && ((sp && prev.i >= sp[0]) || (/^[\d%]/.test(s.w) && /[\d%]$/.test(prev.w)))) prev.w += s.w;
    else out.push({ ...s });
  });
  return out.map(o => o.w);
}
function subs(t) {
  if (window.CLEAN) return;
  let k = -1;
  for (let i = 0; i < SUB_LIST.length; i++) { const s = SUB_LIST[i], next = SUB_LIST[i + 1]; const end = next ? Math.min(next.a - .04, s.b + .6) : s.b + .8; if (t >= s.a - .08 && t < end) k = i; }
  if (k < 0) return;
  const S = SUB_LIST[k], words = subWords(S.text), wt = words.map(w => (SUB_SPOKEN[w] || w).trim().length), tot = wt.reduce((a, b) => a + b, 0) || 1;
  const keyIdx = new Set(); SUB_KEY.forEach(key => { let acc = ''; words.forEach((w, i) => { const st = acc.length; acc += w; const pos = S.text.indexOf(key); if (pos >= 0 && st < pos + key.length && st + w.length > pos) keyIdx.add(i); }); });
  const life = t - (S.a - .08), out = clamp((t - (SUB_LIST[k + 1] ? Math.min(SUB_LIST[k + 1].a - .04, S.b + .6) : S.b + .8) + .12) / .12);
  screen(() => {
    X.font = `700 ${SUB_SIZE}px Kanit, sans-serif`;
    const ws = words.map(w => X.measureText(w).width), total = ws.reduce((a, b) => a + b, 0);
    let rows = [words.map((w, i) => ({ w, i, ww: ws[i] }))];
    if (total > SUB_MAXW) {
      let best = 1, bd = Infinity, acc = 0;
      for (let i = 0; i < words.length - 1; i++) { acc += ws[i]; const d = Math.abs(acc - (total - acc)); if (d < bd && words[i + 1].trim()) { bd = d; best = i + 1; } }
      rows = [rows[0].slice(0, best), rows[0].slice(best)];
    }
    const widths = rows.map(r => r.reduce((a, b) => a + b.ww, 0)), cw = Math.max(...widths) + 76, ch = rows.length * SUB_LH + 34;
    const pop = backOut(clamp(life / .16), 2) * (1 - out);
    if (pop <= .01) return;
    X.translate(W / 2, SUB_Y - (rows.length - 1) * SUB_LH / 2); X.scale(pop, pop); X.rotate(k % 2 ? .012 : -.012);
    cut(rrect(-cw / 2 + 10, -SUB_LH / 2 - 10, cw, ch, 22), '#2A2140', { z: 0, rim: false, alpha: .55 });
    cut(rrect(-cw / 2, -SUB_LH / 2 - 17, cw, ch, 22), C.cream, { z: 2 });
    let c = 0;
    rows.forEach((r, ri) => {
      let x = -widths[ri] / 2; const y = ri * SUB_LH;
      r.forEach(({ w, i, ww }) => {
        const w0 = S.a + (S.b - S.a) * c / tot, w1 = S.a + (S.b - S.a) * (c + wt[i]) / tot; c += wt[i];
        const now = t >= w0 && t < w1, done = t >= w1, lift = now ? -7 * Math.sin(Math.PI * clamp((t - w0) / Math.min(.25, w1 - w0))) : 0;
        if (keyIdx.has(i) && t >= w0) { const u = clamp((t - w0) / .2); cut(rrect(x - 4, y + SUB_SIZE * .38, (ww + 8) * u, 12, 6), C.gold, { z: .5, rim: false }); }
        X.font = `700 ${SUB_SIZE}px Kanit, sans-serif`; X.textAlign = 'left'; X.textBaseline = 'middle';
        X.fillStyle = now ? C.red : done ? C.ink : '#9A90A6'; X.fillText(w, x, y + lift);
        x += ww;
      });
    });
  });
}
