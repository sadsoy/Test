// props.js: the cut-paper machines and places of the clean-energy Short. Each prop is drawn at its base point (x, y)
// with a scale s (1 = the size it was designed at on the 1080-wide frame) and takes the time it needs to move.
// Shapes keep their proportions: real chimneys are banded, cooling towers waist in, turbines have three blades on a
// tapered tower, panels tilt toward the sun, battery storage looks like a row of containers.

const FOS = { sky0: '#C2AE93', sky1: '#9A8670', sky2: '#6F6052', smog: '#A39586', smogDk: '#7C6F64', ground: '#5E4D42', groundDk: '#433730',
  metal: '#857970', metalDk: '#514640', brick: '#8C523C', band: '#C9C0B5', flare: '#F29B38', hill: '#7A6A5A', road: '#3B322D' };
const CLN = { sky0: '#D6F0EA', sky1: '#A6DCE6', sky2: '#76C3D9', hill1: '#9AD3A4', hill2: '#67B88A', hill3: '#3F9272', hill4: '#2D735C',
  white: '#F8F5EC', panel: '#2D5B88', panelLt: '#6E9FD0', sun: '#F7C948', sunLt: '#FFE08A', teal: '#2E9C8E', mint: '#BCE8D3', coral: '#EE8B6A' };
const NIGHT = { sky0: '#1E2A4A', sky1: '#2B3A63', sky2: '#3E5285', hill: '#243451', hill2: '#1A2540', glow: '#FFE27A' };

// ---------- weather and sky ----------
function sky(c0, c1, c2) {
  const g = PX.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c0); g.addColorStop(.55, c1); g.addColorStop(1, c2 || c1);
  PX.save(); PX.setTransform(1, 0, 0, 1, 0, 0); PX.fillStyle = g; PX.fillRect(0, 0, W, H);
  PX.globalCompositeOperation = 'multiply'; PX.globalAlpha = .5; PX.fillStyle = FIBER; PX.fillRect(0, 0, W, H); PX.restore();
}
function cloud(x, y, s, col, lv = 2, o = {}) {
  const P = Pu(Pc(x - 70 * s, y, 46 * s), Pc(x, y - 30 * s, 62 * s), Pc(x + 72 * s, y - 4 * s, 44 * s), Pr(x - 116 * s, y - 6 * s, 232 * s, 50 * s, 25 * s));
  cut(P, col, lv, o);
}
// rising smoke or steam: puffs born at (x, y) that grow, drift and fade; amt 0..1 how much
function smoke(x, y, s, t, amt, col = FOS.smog, o = {}) {
  if (amt <= .01) return;
  const n = o.n || 7, rate = o.rate || .32, rise = o.rise || 520, drift = o.drift ?? 140;
  for (let i = 0; i < n; i++) {
    const k = frac(t * rate + i / n + (o.ph || 0)), wob = Math.sin((k * 3 + i) * 2.1) * 18 * s;
    const px = x + drift * s * k * k + wob, py = y - rise * s * k, r = (16 + 76 * Math.pow(k, .8)) * s * (o.size || 1);
    cut(Pc(px, py, r), mixCol(col, o.end || col, k), 2, { alpha: amt * Math.min(1, k * 7) * Math.pow(1 - k, .9), sa: .22 });
  }
}
function sun(x, y, r, t, o = {}) {
  const n = 14, rays = [];
  for (let i = 0; i < n; i++) { const a = i / n * TAU + t * .08, a2 = a + Math.PI / n; rays.push([x + Math.cos(a) * r * 1.55, y + Math.sin(a) * r * 1.55], [x + Math.cos(a2) * r * 1.08, y + Math.sin(a2) * r * 1.08]); }
  shine(x, y, r * 3.2, o.glow || '#FFD66B', o.glowA ?? .7);
  cut(Pp(rays), o.ray || '#FBD872', 1, { sa: .18, alpha: o.alpha });
  cut(Pc(x, y, r * 1.1), o.mid || '#F9C74F', 2, { sa: .2, alpha: o.alpha });
  cut(Pc(x, y, r * .82), o.core || '#FFE49A', 1, { sa: .15, alpha: o.alpha });
}
function moon(x, y, r) { cut(Pc(x, y, r), '#F5EFD8', 2, { sa: .25 }); cut(Pc(x + r * .35, y - r * .2, r * .86), NIGHT.sky0, 0, { tex: 0 }); }
function stars(t, a = 1) { if (a <= 0) return; for (let i = 0; i < 40; i++) { const x = hash(i * 3.1) * W, y = hash(i * 7.7) * H * .5, tw = .5 + .5 * Math.sin(t * 3 + i); shine(x, y, 10 + 6 * tw, '#FFF6D0', a * .5 * tw); } }

// ---------- the fossil world ----------
function chimney(x, y, w, h, t, amt, s = 1) {
  cut(Pp([[x - w / 2, y], [x - w * .38, y - h], [x + w * .38, y - h], [x + w / 2, y]]), FOS.metal, 2);
  for (const k of [.08, .2]) cut(Pr(x - w * .4, y - h + h * k, w * .8, h * .045), FOS.band, 0, { tex: .4 });
  cut(Pr(x - w * .45, y - h - 6 * s, w * .9, 12 * s, 3), FOS.metalDk, 1);
  smoke(x, y - h, s * 1.1, t, amt, '#8D8177', { ph: x * .001, end: '#B9AEA2' });
}
function coolingTower(x, y, w, h, t, amt, s = 1) {
  const pts = [], n = 12;
  for (let i = 0; i <= n; i++) { const k = i / n, half = w / 2 * (.62 + .38 * Math.pow(Math.abs(k - .7) / .7, 1.6)); pts.push([x + half, y - h * k]); }
  for (let i = n; i >= 0; i--) { const k = i / n, half = w / 2 * (.62 + .38 * Math.pow(Math.abs(k - .7) / .7, 1.6)); pts.push([x - half, y - h * k]); }
  cut(Pp(pts), '#B4A89C', 2, { edge: .15 });
  cut(Pe(x, y - h, w * .36, 10 * s), '#6C625B', 0);
  smoke(x, y - h, s * 1.4, t, amt, '#E2DBD2', { ph: .3 + x * .002, drift: 60, rate: .22, end: '#F3EEE7', n: 6 });
}
function coalPlant(x, y, s, t, amt = 1) {
  coolingTower(x + 210 * s, y, 230 * s, 300 * s, t, amt * .9, s);
  chimney(x - 150 * s, y - 90 * s, 46 * s, 420 * s, t, amt, s);
  chimney(x - 60 * s, y - 90 * s, 40 * s, 340 * s, t + 1.3, amt, s);
  cut(Pp([[x - 260 * s, y], [x - 260 * s, y - 120 * s], [x - 120 * s, y - 175 * s], [x + 80 * s, y - 175 * s], [x + 80 * s, y]]), FOS.brick, 3);
  for (let i = 0; i < 5; i++) cut(Pr(x - 230 * s + i * 58 * s, y - 120 * s, 30 * s, 60 * s, 3), '#5A3326', 0, { tex: .3 });
  shine(x - 100 * s, y - 60 * s, 120 * s, FOS.flare, .25 * amt);
}
function refinery(x, y, s, t, amt = 1) {
  for (const [dx, w, h] of [[-230, 120, 110], [-100, 100, 90]]) {                       // storage tanks
    cut(Pr(x + dx * s, y - h * s, w * s, h * s, 4), '#C9BFB2', 2);
    cut(Pe(x + (dx + w / 2) * s, y - h * s, w / 2 * s, 12 * s), '#DDD4C8', 0);
    cut(Pr(x + dx * s, y - h * .55 * s, w * s, 8 * s), '#9F958A', 0);
  }
  const cx = x + 60 * s;                                                                    // distillation columns
  for (const [dx, w, h] of [[0, 44, 360], [70, 34, 280]]) {
    cut(Pr(cx + dx * s - w / 2 * s, y - h * s, w * s, h * s, 8 * s), FOS.metal, 2);
    for (let k = 1; k < 6; k++) cut(Pr(cx + dx * s - w * .6 * s, y - h * s * k / 6, w * 1.2 * s, 6 * s), FOS.metalDk, 0, { tex: .3 });
  }
  strip([[x - 110 * s, y - 70 * s], [cx, y - 70 * s], [cx, y - 200 * s]], '#6E625A', 9 * s, 1);
  strip([[cx + 70 * s, y - 120 * s], [x + 200 * s, y - 120 * s], [x + 200 * s, y - 380 * s]], '#6E625A', 8 * s, 1);
  const fx = x + 200 * s, fy = y - 380 * s, fl = 1 + .18 * Math.sin(t * 17) + .1 * Math.sin(t * 29);        // flare stack
  cut(Pr(fx - 8 * s, fy, 16 * s, 380 * s), FOS.metalDk, 2);
  if (amt > .02) {
    shine(fx, fy - 40 * s, 150 * s * amt, FOS.flare, .8 * amt);
    const fh = 90 * s * fl * amt, flame = [[fx - 16 * s, fy], [fx - 10 * s, fy - fh * .5], [fx + Math.sin(t * 9) * 8 * s, fy - fh], [fx + 12 * s, fy - fh * .45], [fx + 16 * s, fy]];
    cut(Pblob(flame), '#F07B2A', 1, { sa: .15, tex: .3 }); cut(Pblob(flame.map(([px, py]) => [fx + (px - fx) * .55, fy + (py - fy) * .6])), '#FFD36B', 0, { tex: .2 });
    smoke(fx, fy - fh, s * .8, t, amt * .8, '#5E544E', { drift: 200, n: 6, rate: .4 });
  }
}
function pumpjack(x, y, s, t, run = 1) {
  const a = .28 * Math.sin(t * 2.4) * run, px = x, py = y - 150 * s;
  cut(Pr(x - 150 * s, y - 14 * s, 300 * s, 14 * s, 3), FOS.metalDk, 2);
  cut(Pp([[x - 60 * s, y - 12 * s], [px - 6 * s, py], [px + 6 * s, py], [x + 60 * s, y - 12 * s], [x + 40 * s, y - 12 * s], [px, py + 30 * s], [x - 40 * s, y - 12 * s]]), '#6A5E56', 2);
  PX.save(); PX.translate(px, py); PX.rotate(a);
  cut(Pr(-170 * s, -10 * s, 300 * s, 20 * s, 6), '#3E3430', 2);
  cut(Pp([[-170 * s, -24 * s], [-200 * s, -10 * s], [-206 * s, 30 * s], [-170 * s, 50 * s]]), '#3E3430', 2);   // horse head
  PX.restore();
  const hx = px - 200 * s * Math.cos(a), hy = py - 200 * s * Math.sin(a) + 40 * s;
  strip([[hx, hy], [px - 190 * s, y - 14 * s]], '#2A2320', 3 * s, 0);
  cut(Pc(px, py, 10 * s), FOS.band, 1);
  cut(Pr(x + 90 * s, y - 70 * s, 50 * s, 56 * s, 6), FOS.brick, 2);
}
// ---------- vehicles ----------
function car(x, y, s, col, o = {}) {
  const t = o.t || 0, bob = Math.sin(t * 14) * 1.2 * s, f = o.flip ? -1 : 1, X = d => x + d * s * f;
  if (!o.ev) smoke(X(-120), y - 26 * s, s * .45, t, o.smoke ?? .8, '#7C7068', { drift: -260 * f, rise: 120, rate: .9, n: 5 });
  const body = [[X(-118), y - 22 * s + bob], [X(-112), y - 62 * s + bob], [X(-62), y - 70 * s + bob], [X(-34), y - 106 * s + bob], [X(48), y - 106 * s + bob],
    [X(84), y - 68 * s + bob], [X(116), y - 60 * s + bob], [X(122), y - 22 * s + bob]];
  cut(Pblob([...body, [X(0), y - 14 * s + bob]]), col, 2, { edge: .18 });
  cut(Pp([[X(-24), y - 70 * s + bob], [X(-16), y - 96 * s + bob], [X(18), y - 96 * s + bob], [X(18), y - 70 * s + bob]]), '#CDE7F0', 0, { tex: .3 });
  cut(Pp([[X(28), y - 70 * s + bob], [X(28), y - 96 * s + bob], [X(44), y - 96 * s + bob], [X(68), y - 70 * s + bob]]), '#CDE7F0', 0, { tex: .3 });
  if (o.ev) bolt(X(-60), y - 46 * s + bob, 16 * s, '#FFE27A');
  for (const dx of [-70, 72]) { cut(Pc(X(dx), y - 18 * s, 22 * s), '#2B2522', 2); cut(Pc(X(dx), y - 18 * s, 9 * s), '#B9B1A8', 0); }
}
function bolt(x, y, r, col = '#FFD84D', lv = 1, o = {}) {
  cut(Pp([[x + .2 * r, y - r], [x - .55 * r, y + .15 * r], [x - .02 * r, y + .15 * r], [x - .25 * r, y + r], [x + .55 * r, y - .2 * r], [x + .02 * r, y - .2 * r]]), col, lv, o);
}
function bus(x, y, s, col, t = 0) {
  cut(Pr(x - 170 * s, y - 130 * s, 340 * s, 110 * s, 22 * s), col, 2, { edge: .15 });
  for (let i = 0; i < 5; i++) cut(Pr(x - 150 * s + i * 62 * s, y - 112 * s, 48 * s, 40 * s, 6 * s), '#CDE7F0', 0, { tex: .3 });
  cut(Pr(x - 170 * s, y - 60 * s, 340 * s, 10 * s), CLN.white, 0, { tex: .3 });
  bolt(x + 120 * s, y - 50 * s, 13 * s, '#FFE27A', 0);
  for (const dx of [-105, 110]) { cut(Pc(x + dx * s, y - 18 * s, 22 * s), '#2B2522', 2); cut(Pc(x + dx * s, y - 18 * s, 9 * s), '#B9B1A8', 0); }
}
function train(x, y, s, n = 3, col = CLN.white) {
  for (let i = 0; i < n; i++) {
    const x0 = x + i * 262 * s, nose = i === 0;
    const pts = nose ? [[x0 - 120 * s, y], [x0 - 120 * s, y - 50 * s], [x0 - 60 * s, y - 92 * s], [x0 + 130 * s, y - 92 * s], [x0 + 130 * s, y]] : [[x0 - 128 * s, y], [x0 - 128 * s, y - 92 * s], [x0 + 130 * s, y - 92 * s], [x0 + 130 * s, y]];
    cut(Pblob(pts.concat([[x0, y + 2]])), col, 2, { edge: .2 });
    cut(Pr(x0 - 100 * s, y - 40 * s, 230 * s, 9 * s), CLN.teal, 0, { tex: .3 });
    for (let k = 0; k < 4; k++) cut(Pr(x0 - 80 * s + k * 52 * s, y - 78 * s, 36 * s, 28 * s, 5 * s), '#3E6E8E', 0, { tex: .3 });
  }
}
function airplane(x, y, s, col = '#E9E4DA', t = 0) {
  cut(Pblob([[x - 150 * s, y], [x - 120 * s, y - 22 * s], [x + 130 * s, y - 20 * s], [x + 170 * s, y - 4 * s], [x + 130 * s, y + 14 * s], [x - 120 * s, y + 14 * s]]), col, 2, { edge: .2 });
  cut(Pp([[x - 20 * s, y], [x - 80 * s, y + 90 * s], [x - 50 * s, y + 90 * s], [x + 40 * s, y]]), '#CFC8BD', 2);
  cut(Pp([[x - 110 * s, y - 14 * s], [x - 150 * s, y - 80 * s], [x - 126 * s, y - 80 * s], [x - 80 * s, y - 14 * s]]), '#CFC8BD', 1);
  for (let k = 0; k < 6; k++) cut(Pc(x - 60 * s + k * 30 * s, y - 6 * s, 5 * s), '#5C7E95', 0, { tex: 0 });
}
function ship(x, y, s, t = 0, amt = 1) {
  const bob = Math.sin(t * 2) * 4 * s;
  smoke(x + 110 * s, y - 210 * s + bob, s * .9, t, amt, '#5E544E', { drift: -220, n: 6 });
  const cols = ['#D9643A', '#2F7F9E', '#E3B23C', '#5E9E6E', '#B5483A', '#3D6A8F'];
  for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) cut(Pr(x - 200 * s + i * 52 * s, y - 120 * s - r * 40 * s + bob, 50 * s, 38 * s, 2), cols[(i + r * 2) % 6], 1, { tex: .5 });
  cut(Pr(x + 96 * s, y - 210 * s + bob, 36 * s, 90 * s, 4), '#433A35', 2);
  cut(Pr(x + 140 * s, y - 160 * s + bob, 70 * s, 70 * s, 4), '#E9E4DA', 2);
  cut(Pp([[x - 250 * s, y - 80 * s + bob], [x + 250 * s, y - 80 * s + bob], [x + 220 * s, y + bob], [x - 220 * s, y + bob]]), '#4A3F3A', 3);
  cut(Pr(x - 240 * s, y - 34 * s + bob, 470 * s, 10 * s), '#B5483A', 0, { tex: .3 });
}
// ---------- heavy industry ----------
function furnace(x, y, s, t, amt = 1) {               // steel: a blast furnace pouring a glowing ladle
  cut(Pp([[x - 80 * s, y], [x - 60 * s, y - 300 * s], [x - 30 * s, y - 330 * s], [x + 30 * s, y - 330 * s], [x + 60 * s, y - 300 * s], [x + 80 * s, y]]), '#6B5A50', 3);
  for (let k = 1; k < 5; k++) cut(Pr(x - 70 * s, y - k * 66 * s, 140 * s, 10 * s), '#4C3F38', 0, { tex: .3 });
  smoke(x, y - 330 * s, s, t, amt, '#7C7068', { n: 6 });
  const pour = [[x + 80 * s, y - 120 * s], [x + 130 * s, y - 100 * s], [x + 150 * s, y - 40 * s]];
  strip(pour, '#FF9A3C', 14 * s, 0); shine(x + 150 * s, y - 40 * s, 160 * s, '#FF8A2A', .9 * amt);
  cut(Pp([[x + 100 * s, y - 50 * s], [x + 200 * s, y - 50 * s], [x + 185 * s, y], [x + 115 * s, y]]), '#3E3430', 2);
  cut(Pe(x + 150 * s, y - 50 * s, 50 * s, 9 * s), '#FFB347', 0, { tex: .2 });
}
function kiln(x, y, s, t, amt = 1) {                  // cement: a silo and a long rotating kiln drum
  cut(Pr(x - 210 * s, y - 280 * s, 90 * s, 280 * s, 10 * s), '#C9C2B6', 2);
  cut(Pe(x - 165 * s, y - 280 * s, 45 * s, 10 * s), '#DDD7CC', 0);
  PX.save(); PX.translate(x + 20 * s, y - 90 * s); PX.rotate(-.12);
  cut(Pr(-130 * s, -30 * s, 300 * s, 60 * s, 30 * s), '#A3988B', 2);
  for (let k = 0; k < 6; k++) { const ox = ((k * 50 + t * 40) % 300) - 130; cut(Pr(ox * s, -30 * s, 10 * s, 60 * s), '#857A6E', 0, { tex: .3 }); }
  PX.restore();
  shine(x + 180 * s, y - 110 * s, 80 * s, '#FF8A2A', .6 * amt);
  for (const dx of [-60, 100]) cut(Pr(x + dx * s, y - 70 * s, 18 * s, 70 * s), '#6B5A50', 1);
  smoke(x - 165 * s, y - 280 * s, s * .8, t, amt * .7, '#BDB4A8', { n: 5, drift: 80 });
}
// ---------- the clean world ----------
function turbine(x, y, s, ang, o = {}) {
  const hy = y - 520 * s, col = o.col || CLN.white;
  cut(Pp([[x - 13 * s, y], [x - 6 * s, hy], [x + 6 * s, hy], [x + 13 * s, y]]), col, o.lv ?? 2, { edge: .2 });
  cut(Pr(x - 16 * s, hy - 16 * s, 46 * s, 26 * s, 10 * s), mixCol(col, '#B8C4C4', .3), 1);
  for (let i = 0; i < 3; i++) {
    const a = ang + i * TAU / 3, ca = Math.cos(a), sa = Math.sin(a), B = (u, v) => [x + ca * u - sa * v, hy + sa * u + ca * v];
    cut(Pp([B(8 * s, -7 * s), B(80 * s, -13 * s), B(250 * s, -4 * s), B(262 * s, 0), B(250 * s, 4 * s), B(40 * s, 9 * s), B(8 * s, 7 * s)]), col, (o.lv ?? 2) + 1, { edge: .25, sa: .26 });
  }
  cut(Pc(x, hy, 15 * s), mixCol(col, '#9FB0B0', .35), 1);
}
function solarRow(x, y, w, s, k = 1, t = 0, o = {}) {      // one tilted panel row on legs; k = how far it has unfolded
  if (k <= .01) return;
  const h = 70 * s * k, sk = 30 * s;
  cut(Pr(x + w * .2, y - 36 * s, 8 * s, 36 * s), '#6C7A80', 1); cut(Pr(x + w * .75, y - 30 * s, 8 * s, 30 * s), '#6C7A80', 1);
  const P = Pp([[x, y - 26 * s], [x + w, y - 26 * s], [x + w - sk * k, y - 26 * s - h], [x - sk * k, y - 26 * s - h]]);
  cut(P, o.col || CLN.panel, 2, { edge: .3 });
  const c = PX; c.save(); c.clip(P); c.strokeStyle = 'rgba(190,220,255,.55)'; c.lineWidth = 2;
  for (let i = 1; i < 8; i++) { const u = i / 8; c.beginPath(); c.moveTo(x + w * u, y - 26 * s); c.lineTo(x + w * u - sk * k, y - 26 * s - h); c.stroke(); }
  c.beginPath(); c.moveTo(x - sk * k * .5, y - 26 * s - h / 2); c.lineTo(x + w - sk * k * .5, y - 26 * s - h / 2); c.stroke();
  const gx = x + ((t * .35 + x * .0007) % 1.6 - .3) * w;                        // a glint sliding across
  const g = c.createLinearGradient(gx - 40 * s, 0, gx + 40 * s, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  c.fillStyle = g; c.fillRect(x - sk, y - 30 * s - h, w + sk * 2, h + 10); c.restore();
}
function battery(x, y, w, h, charge, t = 0, o = {}) {        // a containerised battery block with its state of charge
  cut(Pr(x, y - h, w, h, 6), o.col || '#ECE7DC', 2, { edge: .2 });
  for (let i = 1; i < 8; i++) cut(Pr(x + w * i / 8 - 2, y - h + 8, 4, h - 16), 'rgba(120,120,110,.25)', 0, { tex: 0 });
  const bx = x + w * .12, by = y - h * .72, bw = w * .76, bh = h * .3;
  cut(Pr(bx, by, bw, bh, 6), '#2D3B40', 0, { tex: .3 });
  const n = 6, lit = charge * n;
  for (let i = 0; i < n; i++) { const a = clamp(lit - i), col = mixCol('#4E6A62', charge > .25 ? '#7BE0A6' : '#F2B84B', a);
    cut(Pr(bx + 6 + i * (bw - 12) / n, by + 6, (bw - 12) / n - 6, bh - 12, 3), col, 0, { tex: 0 }); if (a > .5) shine(bx + 6 + (i + .5) * (bw - 12) / n, by + bh / 2, 30, '#7BE0A6', .25 * a); }
  bolt(x + w / 2, y - h * .22, h * .12, charge > .25 ? '#FFE27A' : '#C9B37A', 0);
}
function pylon(x, y, s, col = '#8E9AA0') {                // a lattice transmission tower; returns its two arm tips
  const top = y - 300 * s, L = [x - 44 * s, y], R = [x + 44 * s, y], TL = [x - 10 * s, top], TR = [x + 10 * s, top];
  strip([L, TL, TR, R], col, 5 * s, 1);
  for (let k = 0; k < 5; k++) { const a = k / 5, b = (k + 1) / 5, l1 = [lerp(L[0], TL[0], a), lerp(y, top, a)], r1 = [lerp(R[0], TR[0], a), lerp(y, top, a)], l2 = [lerp(L[0], TL[0], b), lerp(y, top, b)], r2 = [lerp(R[0], TR[0], b), lerp(y, top, b)];
    strip([l1, r2], col, 2.5 * s, 0); strip([r1, l2], col, 2.5 * s, 0); }
  strip([[x - 70 * s, top + 40 * s], [x + 70 * s, top + 40 * s]], col, 6 * s, 1);
  strip([[x - 50 * s, top + 100 * s], [x + 50 * s, top + 100 * s]], col, 5 * s, 1);
  return { l: [x - 70 * s, top + 44 * s], r: [x + 70 * s, top + 44 * s] };
}
function building(x, y, w, h, col, lit = 0, o = {}) {
  cut(Pr(x, y - h, w, h, o.r ?? 3), col, o.lv ?? 2, { edge: .12 });
  if (o.roof) cut(Pp([[x - 4, y - h], [x + w / 2, y - h - o.roof], [x + w + 4, y - h]]), mixCol(col, '#000000', .15), 1);
  const cw = o.cw || 18, ch = o.ch || 22, gx = o.gx || 14, gy = o.gy || 18;
  const nx = Math.floor((w - gx) / (cw + gx)), ny = Math.floor((h - gy * 2) / (ch + gy)), ox = x + (w - nx * (cw + gx) + gx) / 2;
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const on = hash(i * 13 + j * 7 + x) < lit, wc = on ? (o.win || '#FFE6A3') : mixCol(col, '#000000', .22);
    cut(Pr(ox + i * (cw + gx), y - h + gy + j * (ch + gy), cw, ch, 2), wc, 0, { tex: .25 });
    if (on && o.glow) shine(ox + i * (cw + gx) + cw / 2, y - h + gy + j * (ch + gy) + ch / 2, 26, '#FFD98A', o.glow);
  }
  if (o.solar) for (let i = 0; i < Math.floor(w / 34); i++) cut(Pp([[x + 6 + i * 34, y - h], [x + 34 + i * 34, y - h], [x + 28 + i * 34, y - h - 14], [x + i * 34, y - h - 14]]), CLN.panel, 1, { edge: .3 });
}
function tree(x, y, s, col = CLN.hill3) { cut(Pr(x - 5 * s, y - 40 * s, 10 * s, 40 * s), '#6B5040', 1); cut(Pblob([[x - 34 * s, y - 40 * s], [x - 28 * s, y - 90 * s], [x, y - 120 * s], [x + 28 * s, y - 90 * s], [x + 34 * s, y - 40 * s]]), col, 2); }
function ore(x, y, r, col, seed = 0, lv = 2) {
  const pts = []; for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + hash(seed + i) * .5, q = r * (.75 + .35 * hash(seed * 3 + i)); pts.push([x + Math.cos(a) * q, y + Math.sin(a) * q * .85]); }
  cut(Pp(pts), col, lv, { edge: .25 });
  cut(Pp([pts[0], pts[1], pts[2], [x, y]]), mixCol(col, '#FFFFFF', .25), 0, { tex: .3 });
}
function mine(x, y, w, s, t = 0) {                    // a terraced open pit seen from the side
  const cols = ['#B8835A', '#A06E4A', '#87593B', '#6E472F', '#56372A'];
  for (let i = 0; i < 5; i++) { const ww = w * (1 - i * .17), d = i * 46 * s; cut(Pp([[x - ww / 2, y + d], [x + ww / 2, y + d], [x + ww / 2 - 26 * s, y + d + 46 * s], [x - ww / 2 + 26 * s, y + d + 46 * s]]), cols[i], 1, { sa: .3 }); }
  const k = frac(t * .12), tx = lerp(x - w * .42, x + w * .2, k), ty = y + lerp(0, 120, k) * s;      // haul truck on the ramp
  cut(Pr(tx - 30 * s, ty - 30 * s, 60 * s, 22 * s, 4), '#E3B23C', 2); cut(Pc(tx - 18 * s, ty - 6 * s, 8 * s), '#2B2522', 1); cut(Pc(tx + 18 * s, ty - 6 * s, 8 * s), '#2B2522', 1);
}
// ---------- the planet ----------
const CONT = [[[0, -.55], [.25, -.6], [.35, -.35], [.2, -.1], [.05, -.2], [-.1, -.4]], [[.1, .05], [.3, .0], [.38, .3], [.2, .62], [.05, .4]],
  [[.55, -.5], [.95, -.55], [1.05, -.25], [.85, -.05], [.7, .1], [.6, -.2]], [[.9, .35], [1.05, .32], [1.1, .5], [.95, .55]], [[1.4, -.6], [1.6, -.5], [1.55, -.3], [1.35, -.35]]];
function earth(x, y, r, t, k = 0, o = {}) {           // k: 0 = smog-grey fossil planet, 1 = clean
  shine(x, y, r * 1.5, k > .5 ? '#9FE3FF' : '#C9B9A0', .35);
  cut(Pc(x, y, r * 1.06), mixCol('#9E8F80', '#BDEBF5', k), 3, { sa: .35, tex: .4 });
  cut(Pc(x, y, r), mixCol('#5D7A8A', '#3B8FCB', k), 0, { tex: .6 });
  const c = PX; c.save(); c.clip(Pc(x, y, r));
  const rot = t * (o.spin ?? .06);
  for (let rep = -1; rep <= 1; rep++) CONT.forEach((pts, i) => {
    const P = pts.map(([u, v]) => [x + ((u - frac(rot) * 2 + rep * 2) * r * 1.1), y + v * r]);
    cut(Pblob(P), mixCol('#8A7B62', i % 2 ? '#5DB37E' : '#79C48C', k), 2, { sa: .3 });
  });
  if (k < 1) { c.globalAlpha = (1 - k) * .55; c.fillStyle = '#8F8274'; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.globalAlpha = 1; }
  const g = c.createRadialGradient(x - r * .4, y - r * .45, r * .1, x, y, r * 1.05); g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(.6, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(10,20,40,.35)');
  c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore();
}
