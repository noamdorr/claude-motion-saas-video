#!/usr/bin/env node
/*
 * check-copy.mjs - pre-render checks on the on-screen words of a video.html.
 *
 *   node check-copy.mjs video.html [--max-words-per-second 4.5] [--max-card-words 30]
 *
 * Flags the things that make a product video read as explaining instead of showing, and the
 * punctuation tells that make copy read as machine-written. Exit code 1 on any error so the
 * build step can gate on it. Warnings do not fail.
 */
import { readFileSync } from "node:fs";

const file = process.argv[2] || "video.html";
const opts = {};
for (let i = 3; i < process.argv.length; i += 2) opts[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
const maxWps = parseFloat(opts["max-words-per-second"] || "4.5");
const maxCard = parseInt(opts["max-card-words"] || "30", 10);

const html = readFileSync(file, "utf8");
const errors = [], warnings = [];

// 1. Punctuation and phrasing tells.
const stageHtml = (html.match(/<[^>]*data-stage[\s\S]*$/) || [html])[0];
const text = stageHtml
  .replace(/<script[\s\S]*?<\/script>/g, " ")
  .replace(/<style[\s\S]*?<\/style>/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ")
  .replace(/\s+/g, " ");
if (/—/.test(text)) errors.push("em dash (U+2014) in on-screen copy; use a period, a comma or a line break");
if (/[‘’“”]/.test(text)) warnings.push("curly quotes in on-screen copy; straight quotes read cleaner at video sizes");
const tells = /\b(seamless(ly)?|effortless(ly)?|unlock the power|game.?changer|revolutioni[sz]e|supercharge|next.?level|cutting.?edge|robust|leverage|elevate|empower|streamline)\b/i;
const m = text.match(tells);
if (m) warnings.push(`marketing filler word on screen: "${m[0]}"`);
if (/\b(introducing)\b/i.test(text)) warnings.push('"Introducing" is the most common launch-video opener; try leading with the pain or the result instead');

// 2. Word budget. Count words inside each scene; a card is any element marked data-card.
const scenes = [...stageHtml.matchAll(/<(section|div)[^>]*data-scene="([^"]+)"[\s\S]*?(?=<(?:section|div)[^>]*data-scene=|$)/g)];
let total = 0;
for (const s of scenes) {
  const inner = s[0].replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const n = inner ? inner.split(" ").length : 0;
  total += n;
  const cards = [...s[0].matchAll(/<[^>]*data-card[^>]*>([\s\S]*?)<\/(?:div|section|article)>/g)];
  for (const c of cards) {
    const cw = c[1].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
    if (cw > maxCard) warnings.push(`scene "${s[2]}": a product card carries ${cw} words (budget ${maxCard}); show the idea of the screen, not the screen`);
  }
}
const durMatch = html.match(/duration\s*:\s*([\d.]+)/) || html.match(/dur\s*:\s*([\d.]+)/g);
let duration = null;
const defMatch = html.match(/defineVideo\(\{[\s\S]*?\}\);?/);
if (defMatch) {
  const noTransitions = defMatch[0].replace(/transition\s*:\s*\{[^}]*\}/g, "");
  const durs = [...noTransitions.matchAll(/\bdur\s*:\s*([\d.]+)/g)].map((x) => parseFloat(x[1]));
  const ends = [...defMatch[0].matchAll(/\bend\s*:\s*([\d.]+)/g)].map((x) => parseFloat(x[1]));
  if (ends.length) duration = Math.max(...ends);
  else if (durs.length) duration = durs.reduce((a, b) => a + b, 0);
}
if (duration) {
  const wps = total / duration;
  console.log(`words on screen: ${total} over ${duration}s = ${wps.toFixed(2)} words/second (budget ${maxWps})`);
  if (wps > maxWps) errors.push(`too many words for the length: ${total} words in ${duration}s. Cut copy or hold cards longer. A 28s reference film carries about 117 words.`);
} else {
  console.log(`words on screen: ${total} (could not read the duration from defineVideo)`);
}

// 3. Deterministic-runtime tells.
const script = (html.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g) || []).join("\n");
for (const bad of ["Date.now(", "Math.random(", "setInterval(", "setTimeout(", "@keyframes", "animation:"]) {
  if (script.includes(bad) || (bad.startsWith("@") && html.includes(bad))) warnings.push(`"${bad}" found; the video must be a pure function of time or frames will not match the preview`);
}

for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.log(`error: ${e}`);
if (!errors.length && !warnings.length) console.log("copy check: clean");
process.exit(errors.length ? 1 : 0);
