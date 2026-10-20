#!/usr/bin/env node
/*
 * render.mjs - render a motion video.html to MP4 (or a still / contact sheet).
 *
 *   node render.mjs                         # video.html -> out/video.mp4
 *   node render.mjs --in video.html --out out/launch.mp4 --audio assets/music.mp3
 *   node render.mjs --still 3.2 --out out/frame.png   # one frame at 3.2s
 *   node render.mjs --sheet --out out/sheet.png       # 12-frame contact sheet for review
 *   node render.mjs --from 4 --to 9 --out out/scene2.mp4   # a slice
 *   node render.mjs --scale 2                          # 2x supersampled (4K from a 1080p stage)
 *
 * Deterministic: every frame comes from window.__seek(t). Needs Node 18+, playwright and ffmpeg
 * (system ffmpeg or the ffmpeg-static package). First run may download Chromium (~150MB) unless
 * Google Chrome is installed, in which case it is reused.
 */
import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, rmSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const args = parseArgs(process.argv.slice(2));
const inPath = resolve(args.in || "video.html");
const still = args.still != null ? parseFloat(args.still) : null;
const sheet = !!args.sheet;
const scale = parseFloat(args.scale || "1");
const outPath = resolve(args.out || (still != null ? "out/frame.png" : sheet ? "out/sheet.png" : "out/video.mp4"));
const workers = Math.max(1, parseInt(args.workers || "3", 10));
const crf = args.crf || "16";
mkdirSync(dirname(outPath), { recursive: true });

if (!existsSync(inPath)) die(`Input not found: ${inPath}`);

const { chromium } = await importPlaywright();
const ffmpeg = findFfmpeg();

const browser = await launch(chromium);
const url = pathToFileURL(inPath).href + "?__render=1";

// Probe metadata with one page.
const probe = await newPage(browser, url, 1920, 1080, scale);
const meta = await probe.evaluate(() => window.__videoMeta);
if (!meta) die("Page did not expose window.__videoMeta. Is motion.js loaded and defineVideo() called?");
await probe.close();
const fps = parseFloat(args.fps || meta.fps || 30);
const W = meta.width, H = meta.height;
log(`${W}x${H} @ ${fps}fps, ${meta.duration}s, scale ${scale}`);

if (still != null) {
  const page = await newPage(browser, url, W, H, scale);
  await seekAndShoot(page, still, outPath);
  await page.close();
  await browser.close();
  log(`still -> ${outPath}`);
  process.exit(0);
}

const from = args.from != null ? parseFloat(args.from) : 0;
const to = args.to != null ? parseFloat(args.to) : meta.duration;
const totalFrames = Math.max(1, Math.round((to - from) * fps));
const frameDir = join(tmpdir(), `motion-frames-${process.pid}`);
rmSync(frameDir, { recursive: true, force: true });
mkdirSync(frameDir, { recursive: true });

if (sheet) {
  const n = parseInt(args.n || "12", 10);
  const page = await newPage(browser, url, W, H, scale);
  const times = [];
  for (let i = 0; i < n; i++) times.push(from + ((to - from) * (i + 0.5)) / n);
  for (let i = 0; i < n; i++) await seekAndShoot(page, times[i], join(frameDir, `frame_${pad(i)}.png`));
  await page.close();
  await browser.close();
  const cols = n <= 6 ? n : 4;
  const rows = Math.ceil(n / cols);
  // Each tile downscaled so the sheet stays readable (~480px wide tiles).
  const tileW = 480, tileH = Math.round((tileW * H) / W);
  run(ffmpeg, [
    "-y", "-framerate", "1", "-i", join(frameDir, "frame_%05d.png"),
    "-vf", `scale=${tileW}:${tileH},tile=${cols}x${rows}:padding=6:margin=6:color=#222222`,
    "-frames:v", "1", outPath,
  ]);
  writeFileSync(outPath.replace(/\.png$/, ".json"), JSON.stringify({ times }, null, 2));
  rmSync(frameDir, { recursive: true, force: true });
  log(`contact sheet (${n} frames, times in ${outPath.replace(/\.png$/, ".json")}) -> ${outPath}`);
  process.exit(0);
}

// Full render: split frames across workers, each with its own page.
const t0 = Date.now();
const perWorker = Math.ceil(totalFrames / workers);
const jobs = [];
for (let w = 0; w < workers; w++) {
  const start = w * perWorker, end = Math.min(totalFrames, start + perWorker);
  if (start >= end) break;
  jobs.push((async () => {
    const page = await newPage(browser, url, W, H, scale);
    for (let i = start; i < end; i++) {
      const t = from + i / fps;
      await seekAndShoot(page, t, join(frameDir, `frame_${pad(i)}.png`));
      if (i % 30 === 0) progress(i, totalFrames, t0);
    }
    await page.close();
  })());
}
await Promise.all(jobs);
await browser.close();
log(`captured ${totalFrames} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

const ff = ["-y", "-framerate", String(fps), "-i", join(frameDir, "frame_%05d.png")];
if (args.audio) ff.push("-i", resolve(args.audio));
ff.push("-c:v", "libx264", "-preset", "slow", "-crf", crf, "-pix_fmt", "yuv420p", "-movflags", "+faststart");
if (scale !== 1 && !args.keepScale) ff.push("-vf", `scale=${W}:${H}:flags=lanczos`);
if (args.audio) ff.push("-c:a", "aac", "-b:a", "192k", "-shortest");
ff.push(outPath);
run(ffmpeg, ff);
rmSync(frameDir, { recursive: true, force: true });
log(`mp4 -> ${outPath}`);

// ---------- helpers ----------
async function newPage(browser, url, w, h, dsf) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dsf, reducedMotion: "no-preference" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.error("[page error]", e.message));
  await page.goto(url, { waitUntil: "load" });
  await page.waitForFunction(() => window.__videoMeta && window.__seek, null, { timeout: 20000 });
  await page.evaluate(() => window.__ready);
  return page;
}

async function seekAndShoot(page, t, file) {
  await page.evaluate((t) => window.__seek(t), t);
  // Two animation frames so layout and fonts settle before capture.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await page.screenshot({ path: file, type: "png", clip: { x: 0, y: 0, width: W, height: H } });
}

async function launch(chromium) {
  // Prefer the installed Google Chrome (no download). Fall back to Playwright's Chromium.
  for (const channel of ["chrome", undefined]) {
    try {
      return await chromium.launch({ channel, headless: true, args: ["--force-color-profile=srgb", "--disable-lcd-text", "--font-render-hinting=none", "--hide-scrollbars"] });
    } catch (e) {
      if (channel === undefined) {
        console.error("Could not launch a browser. Run: npx playwright install chromium");
        die(e.message);
      }
    }
  }
}

async function importPlaywright() {
  try { return await import("playwright"); } catch {}
  try { return await import("playwright-core"); } catch {}
  die("playwright is not installed. Run: npm install   (in this video folder)");
}

function findFfmpeg() {
  const sys = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  if (sys.status === 0) return "ffmpeg";
  try { return createRequire(import.meta.url)("ffmpeg-static"); } catch {}
  die("ffmpeg not found. Install it (brew install ffmpeg) or: npm install ffmpeg-static");
}

function run(cmd, a) {
  const r = spawnSync(cmd, a, { stdio: ["ignore", "inherit", "pipe"] });
  if (r.status !== 0) { console.error(String(r.stderr)); die(`${cmd} failed`); }
}

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const k = a.slice(2);
    const next = argv[i + 1];
    if (next == null || next.startsWith("--")) o[k] = true;
    else { o[k] = next; i++; }
  }
  return o;
}
function pad(n) { return String(n).padStart(5, "0"); }
function log(m) { console.log(`[render] ${m}`); }
function die(m) { console.error(`[render] ${m}`); process.exit(1); }
function progress(i, n, t0) {
  const el = (Date.now() - t0) / 1000;
  const eta = i > 0 ? ((el / i) * (n - i)).toFixed(0) : "?";
  process.stdout.write(`\r[render] frame ${i}/${n}  ${el.toFixed(0)}s elapsed, ~${eta}s left   `);
  if (i + 30 >= n) process.stdout.write("\n");
}
