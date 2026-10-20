#!/usr/bin/env node
/*
 * grade.mjs - programmatic checks on a motion-video run's outputs.
 *   node grade.mjs <outputs-dir> [--accent #ee2e7f] [--forbid "credit,price,introducing"] [--min 20 --max 32]
 * Prints a grading.json-shaped result ({ expectations: [{ text, passed, evidence }] }) to stdout
 * and writes grading.json next to the outputs dir.
 */
import { readdirSync, readFileSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const dir = resolve(args[0]);
const opt = {};
for (let i = 1; i < args.length; i += 2) opt[args[i].replace(/^--/, "")] = args[i + 1];
const minDur = parseFloat(opt.min || "20"), maxDur = parseFloat(opt.max || "32");
const forbid = (opt.forbid || "introducing").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
const accent = (opt.accent || "").toLowerCase();

function findFiles(d, pred, out = []) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (f === "node_modules") continue;
    const st = statSync(p);
    if (st.isDirectory()) findFiles(p, pred, out); else if (pred(p)) out.push(p);
  }
  return out;
}
const mp4s = findFiles(dir, (p) => p.endsWith(".mp4"));
const htmls = findFiles(dir, (p) => p.endsWith("video.html"));
const briefs = findFiles(dir, (p) => p.endsWith("brief.md"));
const boards = findFiles(dir, (p) => p.endsWith("storyboard.md"));
const E = [];
const add = (text, passed, evidence) => E.push({ text, passed: !!passed, evidence });

// The final MP4: pick the largest (checkpoint clips are smaller).
const mp4 = mp4s.sort((a, b) => statSync(b).size - statSync(a).size)[0];
add("An MP4 file was produced", !!mp4, mp4 ? `${mp4} (${(statSync(mp4).size / 1e6).toFixed(2)} MB)` : "no .mp4 under outputs");
let dur = null, w = null, h = null;
if (mp4) {
  const r = spawnSync("ffprobe", ["-v", "error", "-show_entries", "stream=width,height:format=duration", "-of", "json", mp4], { encoding: "utf8" });
  try {
    const j = JSON.parse(r.stdout);
    dur = parseFloat(j.format.duration); w = j.streams[0].width; h = j.streams[0].height;
  } catch {}
  add(`Duration between ${minDur}s and ${maxDur}s`, dur != null && dur >= minDur && dur <= maxDur, `duration ${dur}s`);
  add("Resolution is 1920x1080 (16:9)", w === 1920 && h === 1080, `${w}x${h}`);
  add("File size under 12 MB", statSync(mp4).size < 12e6, `${(statSync(mp4).size / 1e6).toFixed(2)} MB`);
}

// Source and copy.
const html = htmls[0] ? readFileSync(htmls[0], "utf8") : "";
add("video.html (the editable source) exists", !!htmls[0], htmls[0] || "none");
if (html) {
  const stage = (html.match(/<[^>]*data-stage[\s\S]*$/) || [html])[0];
  const text = stage.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(" ").filter(Boolean).length;
  add("No em dash in on-screen copy", !/—/.test(text), /—/.test(text) ? "em dash found" : "none");
  const wps = dur ? words / dur : null;
  add("On-screen words at or under 4.5 per second of runtime", wps != null && wps <= 4.5, `${words} words / ${dur}s = ${wps ? wps.toFixed(2) : "?"} w/s`);
  for (const f of forbid) add(`Forbidden word absent from on-screen copy: "${f}"`, !text.toLowerCase().includes(f), text.toLowerCase().includes(f) ? "present" : "absent");
  if (accent) add(`Brand accent ${accent} used in the source`, html.toLowerCase().includes(accent), html.toLowerCase().includes(accent) ? "found" : "not found");
  add("Pure function of time (no setTimeout/setInterval/Date.now/Math.random/@keyframes)", !/setTimeout\(|setInterval\(|Date\.now\(|Math\.random\(|@keyframes/.test(html), "scan of video.html");
  add("Exposes the Claude Motion seek contract (window.__seek)", /__seek/.test(html) || /motion\.js/.test(html), "motion.js include or __seek present");
  const scenes = (html.match(/data-scene=/g) || []).length;
  add("Three or more scenes", scenes >= 3, `${scenes} scenes`);
}
add("brief.md exists with an Assumptions section", !!briefs[0] && /assum/i.test(readFileSync(briefs[0], "utf8")), briefs[0] || "none");
add("storyboard.md exists with a scene table", !!boards[0] && /\|/.test(readFileSync(boards[0], "utf8")), boards[0] || "none");

const result = { expectations: E, passed: E.filter((e) => e.passed).length, total: E.length };
console.log(JSON.stringify(result, null, 2));
writeFileSync(join(dirname(dir), "grading.json"), JSON.stringify(result, null, 2));
