// render.mjs — turns the NOVA 404 sources into files, with the same headless Chrome the video engine uses.
//   node brand_identity/src/render.mjs svg <in.svg> <out.png> [scale] [bg]   SVG → PNG (transparent unless bg is given)
//   node brand_identity/src/render.mjs page <in.html> <out.png> <w> <h>       an HTML page (waits for window.done) → PNG
//   node brand_identity/src/render.mjs pdf <in.html> <out.pdf>                 an HTML document → PDF (A4 landscape pages)
//   node brand_identity/src/render.mjs frames <page?query> <dir> <w> <h> <dur> [fps]  animation frames via window.renderAt(t)
//   node brand_identity/src/render.mjs batch <jobs.json>                       many jobs, one browser
import puppeteer from 'puppeteer-core';
import fs from 'fs';
import { resolve } from 'path';
import { pathToFileURL } from 'url';

const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true,
  args: ['--no-sandbox', '--allow-file-access-from-files', '--use-gl=angle', '--font-render-hinting=none'] });
const url = f => { const [file, q] = f.split('?'); return pathToFileURL(resolve(file)).href + (q ? '?' + q : ''); };

async function svgPng(inp, out, scale = 1, bg = null) {
  // open the SVG file itself (a blank page may not load file:// images) and scale with the device pixel ratio
  const src = fs.readFileSync(inp, 'utf8'), m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(src), w = Math.round(+m[1]), h = Math.round(+m[2]);
  const page = await browser.newPage(); await page.setViewport({ width: w, height: h, deviceScaleFactor: scale });
  await page.goto(url(inp), { waitUntil: 'networkidle0' });
  if (bg) await page.evaluate(c => { document.documentElement.style.background = c; }, bg);
  await page.screenshot({ path: out, omitBackground: !bg, clip: { x: 0, y: 0, width: w, height: h } }); await page.close();
}
async function pagePng(inp, out, w, h) {
  const page = await browser.newPage(); page.on('pageerror', e => console.log('[page error]', e.message)); page.on('console', m => m.type() === 'error' && console.log('[page]', m.text()));
  await page.setViewport({ width: +w, height: +h }); await page.goto(url(inp), { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.done === true', { timeout: 120000 });
  await page.screenshot({ path: out, omitBackground: true, clip: { x: 0, y: 0, width: +w, height: +h } }); await page.close();
}
// a run of frames from a stage page: window.renderAt(t) for t = i / fps, saved as dir/f00000.png
async function frames(inp, dir, w, h, dur, fps = 30) {
  const page = await browser.newPage(); page.on('pageerror', e => console.log('[page error]', e.message));
  await page.setViewport({ width: +w, height: +h }); await page.goto(url(inp), { waitUntil: 'networkidle0' });
  await page.waitForFunction('window.done === true', { timeout: 120000 }); fs.mkdirSync(dir, { recursive: true });
  const n = Math.round(dur * fps);
  for (let i = 0; i < n; i++) { await page.evaluate(t => window.renderAt(t), i / fps);
    await page.screenshot({ path: `${dir}/f${String(i).padStart(5, '0')}.png`, clip: { x: 0, y: 0, width: +w, height: +h } }); }
  await page.close();
}
async function pdf(inp, out) {
  const page = await browser.newPage(); page.on('pageerror', e => console.log('[page error]', e.message));
  await page.goto(url(inp), { waitUntil: 'networkidle0' }); await page.waitForFunction('window.done === true', { timeout: 120000 });
  await page.pdf({ path: out, width: '1600px', height: '900px', printBackground: true, preferCSSPageSize: true }); await page.close();
}
const [cmd, ...a] = process.argv.slice(2);
const jobs = cmd === 'batch' ? JSON.parse(fs.readFileSync(a[0], 'utf8')) : [[cmd, ...a]];
for (const [c, ...p] of jobs) {
  if (c === 'svg') await svgPng(p[0], p[1], +(p[2] || 1), p[3] || null);
  else if (c === 'page') await pagePng(...p);
  else if (c === 'pdf') await pdf(...p);
  else if (c === 'frames') await frames(...p);
  console.log('wrote', p[1]);
}
await browser.close();
