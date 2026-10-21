#!/usr/bin/env node
/*
 * beats.mjs - beat grid for a soundtrack, no Python, no native modules.
 *
 *   node beats.mjs assets/music.mp3 [--out beats.json] [--fps 30] [--bpm 117.5] [--max 60]
 *   --max limits the hits and the swell to the first N seconds (the part a short film will use).
 *   node beats.mjs --check video.html beats.json [--tolerance 2]
 *
 * Decodes the track in headless Chrome's WebAudio, builds an onset-strength envelope (spectral
 * flux on a log-spaced bank), estimates the tempo by autocorrelation in the 70 to 180 BPM window,
 * then walks a beat grid through the envelope so each beat snaps to the nearest onset. Writes:
 *   { bpm, beat, beats: [s...], bars: [s...], hits: [{t, strength}], swell: {t, rms}, duration }
 * `beats` are every beat, `bars` every fourth, `hits` the 16 strongest onsets (snares, drops),
 * `swell` the loudest sustained moment (the place to land the product reveal).
 *
 * --check reads a video.html, finds the scene starts and reports which ones sit more than
 * `tolerance` frames from the nearest beat, with the beat to move to.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const argv = process.argv.slice(2);
const args = {}; const positional = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith("--")) { const k = argv[i].slice(2); const v = argv[i + 1]; if (v == null || v.startsWith("--")) args[k] = true; else { args[k] = v; i++; } }
  else positional.push(argv[i]);
}
const fps = parseFloat(args.fps || "30");

if (args.check) {
  const ok = check(resolve(typeof args.check === "string" ? args.check : positional[0]), resolve(typeof args.check === "string" ? positional[0] : positional[1]), parseFloat(args.tolerance || "2"));
  process.exit(ok ? 0 : 1);
}

const file = resolve(positional[0] || "");
if (!positional[0]) { console.error("usage: node beats.mjs <track> [--out beats.json]"); process.exit(1); }
const out = resolve(args.out || "beats.json");
const { chromium } = await import("playwright").catch(() => import("playwright-core"));
const browser = await chromium.launch({ channel: "chrome", headless: true }).catch(() => chromium.launch({ headless: true }));
const page = await browser.newPage();
await page.goto("about:blank");
const bytes = readFileSync(file);
const result = await page.evaluate(async ({ b64, fps, bpmHint, priorWidth, harm, maxSeconds }) => {
  const bin = atob(b64); const buf = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  const ctx = new OfflineAudioContext(1, 1, 22050);
  const audio = await ctx.decodeAudioData(buf.buffer);
  const sr = audio.sampleRate, x = audio.getChannelData(0), duration = audio.duration;
  // --- onset strength: log-magnitude spectral flux over 512-sample hops, 1024-sample frames
  const N = 1024, H = 512, nFrames = Math.floor((x.length - N) / H);
  const win = new Float32Array(N); for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N);
  const re = new Float32Array(N), im = new Float32Array(N);
  function fft(re, im) { // in-place radix-2
    const n = re.length; for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
    for (let len = 2; len <= n; len <<= 1) { const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang); for (let i = 0; i < n; i += len) { let cr = 1, ci = 0; for (let k = 0; k < len / 2; k++) { const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr; re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } }
  }
  // Log-spaced band edges between 30 Hz and 8 kHz (24 bands).
  const bands = []; for (let b = 0; b <= 24; b++) bands.push(Math.round((30 * Math.pow(8000 / 30, b / 24)) / (sr / N)));
  let prev = new Float32Array(24);
  const onset = new Float32Array(nFrames), rms = new Float32Array(nFrames);
  for (let f = 0; f < nFrames; f++) {
    let e = 0;
    for (let i = 0; i < N; i++) { const v = x[f * H + i]; re[i] = v * win[i]; im[i] = 0; e += v * v; }
    rms[f] = Math.sqrt(e / N);
    fft(re, im);
    const cur = new Float32Array(24);
    for (let b = 0; b < 24; b++) { let s = 0; for (let k = bands[b]; k < bands[b + 1]; k++) s += Math.hypot(re[k], im[k]); cur[b] = Math.log1p(s); }
    let flux = 0; for (let b = 0; b < 24; b++) flux += Math.max(0, cur[b] - prev[b]);
    onset[f] = flux; prev = cur;
  }
  // Normalise and remove the local mean (adaptive threshold) so loud sections do not dominate.
  const env = new Float32Array(nFrames);
  const W = 16;
  for (let f = 0; f < nFrames; f++) { let m = 0, c = 0; for (let k = Math.max(0, f - W); k < Math.min(nFrames, f + W); k++) { m += onset[k]; c++; } env[f] = Math.max(0, onset[f] - m / c); }
  const frameT = H / sr;
  // --- tempo by autocorrelation of the envelope, 60 to 200 BPM, with a log-Gaussian prior around
  // 120 BPM (one octave wide) and a harmonic sum (lag, 2 lag, 3 lag) so a beat is preferred over its
  // 3:2 and 2:1 relatives. `bpmHint` (--bpm) pins the tempo and only the phase is estimated.
  const acRaw = (lag) => { let s = 0; for (let f = 0; f + lag < nFrames; f++) s += env[f] * env[f + lag]; return s; };
  const acCache = new Map(); const ac = (lag) => { lag = Math.round(lag); if (!acCache.has(lag)) acCache.set(lag, lag < nFrames ? acRaw(lag) : 0); return acCache.get(lag); };
  const minLag = Math.round(60 / 200 / frameT), maxLag = Math.round(60 / 60 / frameT);
  const candidates = [];
  for (let lag = minLag; lag <= maxLag; lag++) {
    const bpmL = 60 / (lag * frameT);
    const prior = Math.exp(-0.5 * Math.pow(Math.log2(bpmL / 120) / priorWidth, 2));
    const score = (ac(lag) + harm * ac(2 * lag)) * prior;
    candidates.push({ lag, bpm: bpmL, score });
  }
  candidates.sort((a, b) => b.score - a.score);
  let bestLag = candidates[0].lag;
  if (bpmHint) bestLag = 60 / bpmHint / frameT;
  const y0 = ac(Math.floor(bestLag) - 1), y1 = ac(Math.floor(bestLag)), y2 = ac(Math.floor(bestLag) + 1);
  const denom = y0 - 2 * y1 + y2; const shift = bpmHint ? bestLag - Math.floor(bestLag) : denom !== 0 ? (0.5 * (y0 - y2)) / denom : 0;
  const beat = bpmHint ? 60 / bpmHint : (Math.floor(bestLag) + shift) * frameT; const bpm = 60 / beat;
  // Other plausible tempos (distinct by more than 3%), reported so a human can veto the pick.
  const alternatives = []; for (const c of candidates) { if (alternatives.length >= 3) break; if (Math.abs(c.bpm - bpm) / bpm > 0.03 && alternatives.every((a) => Math.abs(a - c.bpm) / c.bpm > 0.03)) alternatives.push(+c.bpm.toFixed(1)); }
  // --- phase: choose the offset within one beat that maximises onset energy on the grid
  let bestOff = 0, bestScore = -1;
  for (let off = 0; off < beat; off += frameT) { let s = 0; for (let t = off; t < duration; t += beat) { const f = Math.round(t / frameT); if (f < nFrames) s += env[f]; } if (s > bestScore) { bestScore = s; bestOff = off; } }
  // --- beats: grid walk, each beat snapped to the strongest onset within +-12% of a beat
  const beats = []; let t = bestOff; const tol = beat * 0.12;
  while (t < duration) {
    let bf = Math.round(t / frameT), bv = -1;
    for (let f = Math.round((t - tol) / frameT); f <= Math.round((t + tol) / frameT); f++) if (f >= 0 && f < nFrames && env[f] > bv) { bv = env[f]; bf = f; }
    const snapped = bv > 0 ? bf * frameT : t;
    beats.push(+snapped.toFixed(3));
    t = snapped + beat;
  }
  // --- bars: assume 4/4, downbeat = the beat phase with the most energy over the track
  let barOff = 0, barBest = -1;
  for (let k = 0; k < 4; k++) { let s = 0; for (let i = k; i < beats.length; i += 4) { const f = Math.round(beats[i] / frameT); if (f < nFrames) s += env[f]; } if (s > barBest) { barBest = s; barOff = k; } }
  const bars = beats.filter((_, i) => (i - barOff) % 4 === 0);
  // --- hits: the 16 strongest onsets at least a half beat apart
  const maxF = Math.min(nFrames, Math.round(maxSeconds / frameT));
  const idx = Array.from(env.keys()).filter((f) => f * frameT > 0.15 && f < maxF).sort((a, b) => env[b] - env[a]);
  const hits = []; const minGap = beat / 2 / frameT;
  for (const f of idx) { if (hits.length >= 16) break; if (hits.every((h) => Math.abs(h.f - f) > minGap)) hits.push({ f, strength: env[f] }); }
  const maxEnv = hits.length > 1 ? hits[1].strength : hits.length ? hits[0].strength : 1;
  const hitsOut = hits.map((h) => ({ t: +(h.f * frameT).toFixed(3), strength: +Math.min(1, h.strength / maxEnv).toFixed(2) })).sort((a, b) => a.t - b.t);
  // --- swell: loudest 1-second RMS window
  const win1 = Math.round(1 / frameT); let sw = 0, swT = 0;
  for (let f = 0; f + win1 < maxF; f++) { let s = 0; for (let k = 0; k < win1; k++) s += rms[f + k]; if (s > sw) { sw = s; swT = (f + win1 / 2) * frameT; } }
  return { bpm: +bpm.toFixed(2), beat: +beat.toFixed(4), alternatives, beats, bars, hits: hitsOut, swell: { t: +swT.toFixed(2), rms: +(sw / win1).toFixed(3) }, duration: +duration.toFixed(2) };
}, { b64: bytes.toString("base64"), fps, bpmHint: args.bpm ? parseFloat(args.bpm) : 0, priorWidth: parseFloat(args["prior-width"] || "0.5"), harm: parseFloat(args.harm || "0"), maxSeconds: parseFloat(args.max || "60") });
await browser.close();
result.file = file; result.fps = fps;
writeFileSync(out, JSON.stringify(result, null, 2));
console.log(`[beats] ${result.bpm} BPM (${result.beat}s per beat), ${result.beats.length} beats, ${result.bars.length} bars, ${result.duration}s -> ${out}`);
if (result.alternatives.length) console.log(`[beats] other plausible tempos: ${result.alternatives.join(", ")} BPM (pass --bpm N to pin one; half and double tempos are the usual confusions)`);
console.log(`[beats] first beats: ${result.beats.slice(0, 8).join(", ")}  bars start: ${result.bars.slice(0, 6).join(", ")}`);
console.log(`[beats] strongest hits: ${result.hits.filter((h) => h.strength >= 0.6).map((h) => `${h.t}s`).join(", ")}`);
console.log(`[beats] swell at ${result.swell.t}s; grid for scene starts: every ${result.beat}s from ${result.beats[0]}s, bars every ${(result.beat * 4).toFixed(3)}s`);

function check(htmlPath, beatsPath, tolerance) {
  const html = readFileSync(htmlPath, "utf8"); const b = JSON.parse(readFileSync(beatsPath, "utf8"));
  const lit = html.slice(html.indexOf("defineVideo("));
  const si = lit.indexOf("scenes");
  let depth = 0, started = false; const starts = []; let cur = null;
  for (let i = lit.indexOf("[", si); i < lit.length; i++) {
    const c = lit[i];
    if (c === "[" || c === "{") { depth++; started = true; if (depth === 2) cur = { text: "" }; continue; }
    if (c === "]" || c === "}") {
      if (depth === 2 && cur) {
        const id = (cur.text.match(/\bid\s*:\s*"([^"]+)"/) || [])[1];
        const st = (cur.text.match(/\bstart\s*:\s*([\d.]+)/) || [])[1];
        const du = (cur.text.match(/\bdur\s*:\s*([\d.]+)/) || [])[1];
        const en = (cur.text.match(/\bend\s*:\s*([\d.]+)/) || [])[1];
        starts.push({ id: id || `scene ${starts.length + 1}`, t: st != null ? parseFloat(st) : null, dur: du != null ? parseFloat(du) : null, end: en != null ? parseFloat(en) : null });
        cur = null;
      }
      depth--; if (started && depth === 0) break; continue;
    }
    if (depth === 2 && cur) cur.text += c;
  }
  // Scenes without an explicit start follow the previous one (the runtime's rule).
  let prevEnd = 0;
  for (const x of starts) {
    if (x.t == null) x.t = prevEnd;
    prevEnd = x.end != null ? x.end : x.t + (x.dur != null ? x.dur : 3);
  }
  const known = starts.filter((x) => Number.isFinite(x.t));
  if (!known.length) { console.log("no scenes found in defineVideo; is this a motion video.html?"); return false; }
  const frame = 1 / (b.fps || 30);
  let off = 0;
  for (const s of known) {
    const nearest = b.beats.reduce((p, c) => (Math.abs(c - s.t) < Math.abs(p - s.t) ? c : p), b.beats[0]);
    const d = (s.t - nearest) / frame;
    const onBar = b.bars.some((x) => Math.abs(x - nearest) < 1e-3);
    if (Math.abs(d) > tolerance) { off++; console.log(`off-beat: scene "${s.id}" starts at ${s.t}s, nearest beat ${nearest}s (${d.toFixed(1)} frames away)${onBar ? ", a bar line" : ""}`); }
    else console.log(`on-beat : scene "${s.id}" at ${s.t}s${onBar ? " (bar line)" : ""}`);
  }
  console.log(off ? `${off} scene start(s) off the beat grid` : "every scene start is on the beat grid");
  return off === 0;
}
