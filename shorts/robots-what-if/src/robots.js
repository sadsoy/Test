// robots.js: robots, people (silhouettes), the factory and the economy props. Feet / bases at y = 0, facing +x.
const R = {
  mint: '#BFE8DC', mintDk: '#8CCBB9', joint: '#2A3A4A', visor: '#FF7A59', steel: '#9AA6B8', steelDk: '#6E7A8E',
  person: '#2D2F66', personLt: '#3E418A', box: '#D9A86B', boxDk: '#B98648', tape: '#F3E3C0', coin: '#F6C445', coinDk: '#D9A21F',
  belt: '#3A4256', floor: '#2A2F48', wall0: '#1C2440', wall1: '#26305A', neon: '#7FF0D8', warm: '#FFB36B', coral: '#FF7A59'
};
// ---------- generic two-segment limb ----------
// from (0,0): upper segment at angle a1 (radians, 0 = +x), lower segment bent by a2 relative to it. Joint discs at the
// shoulder, the elbow/knee and the end, so every bend sits on a visible pivot. Returns the end point.
function limb(a1, L1, a2, L2, w1, w2, col, jcol, z = 1.2, o = {}) {
  const ex = Math.cos(a1) * L1, ey = Math.sin(a1) * L1, b = a1 + a2, fx = ex + Math.cos(b) * L2, fy = ey + Math.sin(b) * L2;
  cut(strip([[0, 0], [ex, ey]], w1, w1 * .9), col, { z, sa: .45 });
  cut(strip([[ex, ey], [fx, fy]], w2, w2 * .85), col, { z: z + .1, sa: .45 });
  if (jcol) { cut(circ(0, 0, w1 * .55, 1), jcol, { z: z + .2 }); cut(circ(ex, ey, w2 * .6, 2), jcol, { z: z + .2 }); }
  else cut(circ(ex, ey, w2 * .5, 2), col, { z: z + .05, rim: false });
  if (o.endCap !== false) cut(circ(fx, fy, w2 * .52, 3), o.capCol || col, { z: z + .15 });
  return [fx, fy, b];
}
// two-bone IK: angles that put the end of (L1, L2) at (tx, ty); bend -1 = elbow up/back, +1 = the other way
function ik(tx, ty, L1, L2, bend = -1) {
  const d = Math.min(Math.hypot(tx, ty), L1 + L2 - .01), c = clamp((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2), -1, 1), e = bend * Math.acos(c);
  return [Math.atan2(ty, tx) - Math.atan2(L2 * Math.sin(e), L1 + L2 * Math.cos(e)), e];
}
// ---------- industrial robot arm ----------
// o.target [x, y] relative to the base (gripper aims there), o.grip 0..1 (closed..open), o.on 0..1 status light
function robotArm(o = {}) {
  const L1 = 150, L2 = 130, sh = [0, -70], tgt = o.target || [180, -60];
  cut(rrect(-70, -26, 140, 26, 8), R.steelDk, { z: 2 });                        // floor plate
  cut(poly([[-46, -26], [46, -26], [30, -70], [-30, -70]]), R.steel, { z: 2 });   // turret
  const [a1, a2] = ik(tgt[0] - sh[0], tgt[1] - sh[1], L1, L2, o.bend ?? 1);
  at(sh[0], sh[1], 1, 0, () => {
    const [fx, fy, b] = limb(a1, L1, a2, L2, 40, 32, R.mint, R.joint, 1.6, { endCap: false });
    // wrist and gripper: always points down toward the work
    at(fx, fy, 1, 0, () => { cut(circ(0, 0, 15, 4), R.joint, { z: 2 }); const g = 6 + 16 * (o.grip ?? .5);
      cut(rrect(-14, 4, 28, 26, 5), R.steel, { z: 1.9 });
      cut(poly([[-g - 8, 28], [-g, 28], [-g + 2, 60], [-g - 6, 60]]), R.steelDk, { z: 1.9 });
      cut(poly([[g + 8, 28], [g, 28], [g - 2, 60], [g + 6, 60]]), R.steelDk, { z: 1.9 }); });
  });
  cut(circ(0, -48, 7, 5), mix('#3A4A5A', R.neon, o.on ?? 0), { z: .4, rim: false }); if ((o.on ?? 0) > 0) glow(0, -48, 30, R.neon, .6 * o.on);
}
// ---------- humanoid robot ----------
// o.walk phase (radians, 0 = standing), o.armL/armR [shoulder, elbow] angles (0 = straight down), o.look
function humanoid(o = {}) {
  const w = o.walk || 0, sw = Math.sin(w), H = 300;
  const hip = [0, -150], shL = [-34, -250], shR = [34, -250];
  const leg = (s, ph) => at(hip[0] + s * 18, hip[1], 1, 0, () => limb(Math.PI / 2 + .35 * Math.sin(ph), 76, Math.max(0, .6 * Math.sin(ph - 1.4)), 72, 30, 26, R.mintDk, R.joint, 1.3, { capCol: R.steelDk }));
  leg(-1, w + Math.PI); leg(1, w);
  cut(rrect(-48, -268, 96, 124, 26), R.mint, { z: 2 });                         // torso
  cut(rrect(-30, -236, 60, 40, 10), R.mintDk, { z: .6, rim: false });             // chest plate
  cut(circ(0, -214, 8, 9), R.neon, { z: .3, rim: false }); glow(0, -214, 30, R.neon, .5);
  cut(rrect(-12, -290, 24, 26, 6), R.joint, { z: 1.6 });                          // neck
  cut(rrect(-40, -360, 80, 72, 24), R.mint, { z: 2.1 });                          // head
  cut(rrect(-28, -338, 56 + 0 * (o.look || 0), 20, 10), R.visor, { z: .5 }); glow(0, -328, 40, R.visor, .4);
  const arm = (p, a) => at(p[0], p[1], 1, 0, () => { const [fx, fy, b] = limb(Math.PI / 2 + a[0], 70, a[1], 66, 24, 20, R.mintDk, R.joint, 2.2, { endCap: false });
    at(fx, fy, 1, b - Math.PI / 2, () => { cut(rrect(-10, 0, 20, 14, 4), R.steel, { z: 2.3 }); cut(poly([[-12, 12], [-6, 12], [-6, 34], [-13, 30]]), R.steelDk, { z: 2.3 }); cut(poly([[12, 12], [6, 12], [6, 34], [13, 30]]), R.steelDk, { z: 2.3 }); }); });
  arm(shL, o.armL || [.15 + .25 * Math.sin(w), -.2]); arm(shR, o.armR || [-.15 - .25 * Math.sin(w), -.2]);
}
// ---------- person (silhouette) ----------
// Adult proportions (~7.5 heads). Hands are left as rounded silhouette ends (no fingers), as the brief allows.
function person(o = {}) {
  const col = o.col || R.person, w = o.walk || 0, s = o.scale || 1;
  at(0, 0, s, 0, () => {
    const hipY = -180, shY = -310;
    const leg = (side, ph) => at(side * 12, hipY, 1, 0, () => limb(Math.PI / 2 + .38 * Math.sin(ph), 92, Math.max(0, .55 * Math.sin(ph - 1.4)), 90, 30, 24, mix(col, '#000000', side < 0 ? .15 : 0), null, 1.4, { capCol: mix(col, '#000000', .2) }));
    leg(-1, w + Math.PI); leg(1, w);
    cut(rrect(-30, shY - 8, 60, 140, 26), col, { z: 1.8 });                       // torso
    cut(rrect(-9, shY - 34, 18, 30, 8), col, { z: 1.6 });                         // neck
    cut(ell(2, shY - 62, 27, 32, 0, 7), col, { z: 1.9 });                          // head
    const arm = (side, a) => at(side * 4, shY + 6, 1, 0, () => limb(Math.PI / 2 + a[0], 84, a[1], 78, 20, 17, mix(col, '#000000', side < 0 ? .15 : 0), null, side < 0 ? 1.3 : 2.1));
    arm(-1, o.armB || [-.3 * Math.sin(w), -.15]); arm(1, o.armF || [.3 * Math.sin(w), -.25]);
  });
}
// ---------- factory and economy props ----------
function factoryHall(t, light = 1) {
  X.fillStyle = R.wall0; X.fillRect(-3000, -3000, 6000, 6000);
  for (let i = 0; i < 9; i++) { const x = -1400 + i * 340; cut(poly([[x, -540], [x + 300, -700], [x + 300, -540]]), R.wall1, { z: 1.2 }); cut(rrect(x + 20, -520, 260, 360, 12), mix('#1A2A4A', '#2E5C7A', light), { z: .6 }); for (let k = 0; k < 3; k++) cut(rrect(x + 30 + k * 85, -510, 70, 340, 6), rgba(R.neon, .12 * light), { z: 0, rim: false }); }
  cut(rrect(-3000, 160, 6000, 2000, 0), R.floor, { z: 1.6 });
  for (let i = 0; i < 12; i++) glow(-1600 + i * 300, -560, 220, '#BFEFFF', .18 * light);
}
function conveyor(t, x0, x1, y, speed) {
  cut(rrect(x0, y, x1 - x0, 34, 17), R.belt, { z: 1.8 });
  for (let x = x0 + 20; x < x1 - 10; x += 60) { const a = t * speed / 20; at(x, y + 17, 1, a, () => { cut(circ(0, 0, 13, x), R.steelDk, { z: .5 }); cut(rrect(-2, -11, 4, 22, 2), R.steel, { z: 0, rim: false }); }); }
  for (let x = x0; x < x1; x += 46) { const xx = x0 + ((x - x0 + t * speed) % (x1 - x0)); cut(rrect(xx, y + 2, 20, 4, 2), rgba('#FFFFFF', .12), { z: 0, rim: false, grain: 0 }); }
  cut(rrect(x0 + 40, y + 34, 24, 126, 6), R.steelDk, { z: 1.4 }); cut(rrect(x1 - 64, y + 34, 24, 126, 6), R.steelDk, { z: 1.4 });
}
function box(s = 1, seed = 1) { at(0, 0, s, 0, () => { cut(rrect(-40, -64, 80, 64, 6), R.box, { z: 1.4 }); cut(poly([[-40, -64], [-30, -78], [50, -78], [40, -64]]), mix(R.box, '#FFFFFF', .2), { z: 1 }); cut(rrect(-6, -64, 12, 64, 2), R.tape, { z: 0, rim: false }); }); }
function coin(r = 22, t = 0, i = 0) { const sx = Math.abs(Math.cos(t * 3 + i)) * .8 + .2; at(0, 0, 1, 0, () => { X.scale(sx, 1); cut(circ(0, 0, r, i), R.coin, { z: 1.2 }); cut(circ(0, 0, r * .72, i + 1), R.coinDk, { z: 0, rim: false }); txt('฿', 0, 1, r * 1.05, R.coin, { weight: 800, sa: 0 }); }); }
function bag(s = 1) { at(0, 0, s, 0, () => { cut(strip(arcPts(0, -70, 22, Math.PI, TAU, 14), 7), R.coral, { z: .8 }); cut(poly([[-38, -70], [38, -70], [46, 0], [-46, 0]]), R.coral, { z: 1.4 }); }); }
function priceTag(s, down) { at(0, 0, s, .15, () => { cut(poly([[-60, -36], [50, -36], [80, 0], [50, 36], [-60, 36]]), C.cream, { z: 1.6 }); cut(circ(56, 0, 8, 3), R.joint, { z: 0, rim: false }); txt('ราคา', -24, -2, 30, C.ink, { weight: 800, sa: 0 }); }); if (down > 0) at(70, 90, 1, 0, () => { cut(strip([[0, -60 * down], [0, 40]], 22), R.coral, { z: 1.2 }); cut(poly([[-34, 30], [34, 30], [0, 76]]), R.coral, { z: 1.2 }); }); }
function tower(h, col = '#3A3F6E') { cut(rrect(-110, -h, 220, h, 10), col, { z: 2.4 }); for (let y = -h + 40; y < -40; y += 60) for (let x = -80; x < 80; x += 54) cut(rrect(x, y, 30, 34, 4), '#F6D58A', { z: 0, rim: false }); cut(poly([[-130, -h], [0, -h - 90], [130, -h]]), mix(col, '#000000', .2), { z: 2 }); }
function shop(t, open = 1) { cut(rrect(-220, -300, 440, 300, 14), '#5A4E8C', { z: 2 }); cut(rrect(-190, -230, 380, 170, 10), '#1E2440', { z: .6 }); glow(0, -150, 200, R.warm, .4 * open); cut(rrect(-230, -330, 460, 50, 12), R.coral, { z: 1.8 }); txt('ร้านค้า', 0, -305, 40, C.cream, { weight: 800, sa: 0 }); cut(rrect(-40, -60, 80, 60, 6), '#3A2D52', { z: .5 }); }
// job icons on paper cards
function jobCard(kind, hl = 0) {
  cut(rrect(-150, -150, 300, 300, 30), mix(C.cream, '#E8F7F2', hl), { z: 2 });
  if (kind === 'office') { cut(rrect(-90, -10, 180, 20, 6), '#8A6A4A', { z: 1 }); cut(rrect(-60, -80, 90, 70, 8), '#3A4A6A', { z: 1.2 }); cut(rrect(40, -50, 40, 40, 4), '#F3F3F3', { z: 1 }); cut(rrect(44, -58, 40, 40, 4), '#FFFFFF', { z: 1.1 }); }
  if (kind === 'nurse') { cut(rrect(-70, -70, 140, 140, 24), '#E9F0F8', { z: 1 }); cut(rrect(-16, -50, 32, 100, 6), R.coral, { z: .8 }); cut(rrect(-50, -16, 100, 32, 6), R.coral, { z: .8 }); }
  if (kind === 'build') { cut(strip(arcPts(0, 10, 70, Math.PI, TAU, 20), 40), '#F6C445', { z: 1.2 }); cut(rrect(-90, 10, 180, 22, 10), '#E0A82A', { z: 1.2 }); }
  if (kind === 'teach') { cut(rrect(-90, -70, 180, 110, 8), '#2E5A48', { z: 1.2 }); cut(rrect(-70, -40, 90, 6, 3), '#E8F2EC', { z: 0, rim: false }); cut(rrect(-70, -16, 120, 6, 3), '#E8F2EC', { z: 0, rim: false }); cut(rrect(-100, 40, 200, 12, 4), '#8A6A4A', { z: 1 }); }
}
// floating "what to do with life" icons
function lifeIcon(kind, s) { at(0, 0, s, 0, () => {
  if (kind === 'book') { cut(poly([[-50, -30], [0, -20], [0, 40], [-50, 30]]), '#F3E3C0', { z: 1.2 }); cut(poly([[50, -30], [0, -20], [0, 40], [50, 30]]), '#FFF3DA', { z: 1.2 }); }
  if (kind === 'brush') { cut(strip([[-40, 40], [30, -30]], 12, 10), '#8A6A4A', { z: 1.2 }); cut(ell(38, -38, 16, 10, -.8, 3), R.coral, { z: 1.2 }); }
  if (kind === 'heart') { const p = new Path2D(); p.moveTo(0, 30); p.bezierCurveTo(-60, -10, -30, -50, 0, -20); p.bezierCurveTo(30, -50, 60, -10, 0, 30); cut(p, R.coral, { z: 1.2 }); }
  if (kind === 'sprout') { cut(strip([[0, 40], [0, -10]], 8), '#5FA35A', { z: 1.2 }); cut(ell(-20, -18, 22, 10, -.5, 4), '#7CC46E', { z: 1.2 }); cut(ell(20, -26, 22, 10, .5, 5), '#7CC46E', { z: 1.2 }); }
  if (kind === 'music') { cut(circ(-18, 26, 14, 6), C.gold, { z: 1.2 }); cut(rrect(-8, -40, 8, 68, 3), C.gold, { z: 1.2 }); cut(poly([[-8, -40], [30, -26], [30, -12], [-8, -26]]), C.gold, { z: 1.2 }); }
}); }
