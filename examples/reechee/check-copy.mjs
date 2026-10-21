#!/usr/bin/env node
/*
 * check-copy.mjs - pre-render checks on the on-screen words of a video.html.
 *
 *   node check-copy.mjs video.html [--max-words-per-second 4.5] [--max-card-words 30]
 *
 * Flags the things that make a product video read as explaining instead of showing, and the
 * punctuation tells that make copy read as machine-written. Exit code 1 on any error so the
 * build step can gate on it. Warnings do not fail.
 *
 * Counting rules: everything inside [data-stage] counts except elements marked data-chrome
 * (menu bars, window titles, fake OS clocks) which are furniture, not copy. The duration comes
 * from the defineVideo({...}) literal: a top-level `duration`, else the last scene's `end`, else
 * the sum of scene-level `dur` values (nested tween durs are ignored).
 */
import { readFileSync } from "node:fs";

const file = process.argv[2] || "video.html";
const opts = {};
for (let i = 3; i < process.argv.length; i += 2) opts[process.argv[i].replace(/^--/, "")] = process.argv[i + 1];
const maxWps = parseFloat(opts["max-words-per-second"] || "4.5");
const targetWps = 4.0;
const maxCard = parseInt(opts["max-card-words"] || "30", 10);

const html = readFileSync(file, "utf8");
const errors = [], warnings = [];

// ---------- tiny tag walker ----------
const VOID = new Set(["br", "img", "input", "hr", "meta", "link", "source", "path", "circle", "rect", "line", "polyline", "polygon", "use", "stop"]);
// Returns the index just past the matching close tag of the element whose open tag starts at `from`.
function elementEnd(src, from) {
  const open = src.indexOf(">", from);
  const name = (src.slice(from + 1, open).match(/^([a-zA-Z0-9-]+)/) || [])[1] || "";
  if (VOID.has(name.toLowerCase()) || src[open - 1] === "/") return open + 1;
  let depth = 1, i = open + 1;
  const re = /<\/?([a-zA-Z0-9-]+)[^>]*?>/g;
  re.lastIndex = i;
  let m;
  while ((m = re.exec(src))) {
    const tag = m[1].toLowerCase();
    if (m[0].startsWith("</")) { if (tag === name.toLowerCase()) { depth--; if (depth === 0) return m.index + m[0].length; } }
    else if (tag === name.toLowerCase() && !m[0].endsWith("/>")) depth++;
  }
  return src.length;
}
function removeElements(src, attrRe) {
  let out = src, idx;
  const re = new RegExp(`<[a-zA-Z0-9-]+[^>]*\\s${attrRe}[^>]*>`, "g");
  while ((idx = out.search(re)) >= 0) out = out.slice(0, idx) + out.slice(elementEnd(out, idx));
  return out;
}
function textOf(src) {
  return src.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}
const words = (t) => (t ? t.split(" ").filter((w) => /[A-Za-z0-9]/.test(w)).length : 0);

// ---------- the stage, minus chrome ----------
const stageStart = html.search(/<[a-zA-Z0-9-]+[^>]*\sdata-stage/);
const stageHtml = stageStart >= 0 ? html.slice(stageStart, elementEnd(html, stageStart)) : html;
const copyHtml = removeElements(stageHtml, "data-chrome");
const text = textOf(copyHtml);

// 1. Punctuation and phrasing tells.
if (/—/.test(text)) errors.push("em dash (U+2014) in on-screen copy; use a period, a comma or a line break");
if (/[‘’“”]/.test(text)) warnings.push("curly quotes in on-screen copy; straight quotes read cleaner at video sizes");
const tells = /\b(seamless(ly)?|effortless(ly)?|unlock the power|game.?changer|revolutioni[sz]e|supercharge|next.?level|cutting.?edge|robust|leverage|elevate|empower|streamline)\b/i;
const m = text.match(tells);
if (m) warnings.push(`marketing filler word on screen: "${m[0]}"`);
if (/\bintroducing\b/i.test(text)) warnings.push('"Introducing" is the most common launch-video opener; try leading with the pain or the result instead');

// 2. Word budget per scene and per card.
let total = 0;
const sceneRe = /<[a-zA-Z0-9-]+[^>]*\sdata-scene="([^"]+)"[^>]*>/g;
let sm;
const perScene = [];
while ((sm = sceneRe.exec(copyHtml))) {
  const inner = copyHtml.slice(sm.index, elementEnd(copyHtml, sm.index));
  const n = words(textOf(inner));
  total += n;
  perScene.push(`${sm[1]} ${n}`);
  const cardRe = /<[a-zA-Z0-9-]+[^>]*\sdata-card[^>]*>/g;
  let cm;
  while ((cm = cardRe.exec(inner))) {
    const cw = words(textOf(inner.slice(cm.index, elementEnd(inner, cm.index))));
    if (cw > maxCard) warnings.push(`scene "${sm[1]}": a product card carries ${cw} words (budget ${maxCard}); show the idea of the screen, not the screen`);
  }
}
if (!perScene.length) total = words(text);

// 3. Duration from the defineVideo literal.
let duration = null;
const defStart = html.indexOf("defineVideo(");
if (defStart >= 0) {
  const lit = html.slice(defStart);
  const top = lit.match(/^defineVideo\(\{[^{}\[\]]*?\bduration\s*:\s*([\d.]+)/);
  if (top) duration = parseFloat(top[1]);
  else {
    const si = lit.indexOf("scenes");
    if (si >= 0) {
      // Walk the scenes array; keys at bracket depth 2 (array = 1, scene object = 2) are scene-level.
      let depth = 0, i = lit.indexOf("[", si), started = false, buf = "", ends = [], durs = [];
      for (; i < lit.length; i++) {
        const c = lit[i];
        if (c === "[" || c === "{") { depth++; started = true; buf = ""; continue; }
        if (c === "]" || c === "}") { depth--; buf = ""; if (started && depth === 0) break; continue; }
        if (depth === 2) {
          buf += c;
          const e = buf.match(/\bend\s*:\s*([\d.]+)\s*$/), d = buf.match(/\bdur\s*:\s*([\d.]+)\s*$/);
          if (e && /[,\s]$/.test(lit[i + 1] || ",")) { ends.push(parseFloat(e[1])); buf = ""; }
          if (d && /[,\s]$/.test(lit[i + 1] || ",")) { durs.push(parseFloat(d[1])); buf = ""; }
        }
      }
      if (ends.length) duration = Math.max(...ends);
      else if (durs.length) duration = durs.reduce((a, b) => a + b, 0);
    }
  }
}
if (duration) {
  const wps = total / duration;
  console.log(`words on screen: ${total} over ${duration}s = ${wps.toFixed(2)} words/second (target ${targetWps}, hard limit ${maxWps})`);
  if (perScene.length) console.log(`per scene: ${perScene.join(", ")}`);
  if (wps > maxWps) errors.push(`too many words for the length: ${total} words in ${duration}s. Cut copy or hold cards longer. A 28s reference film carries about 117 words.`);
  else if (wps > targetWps) warnings.push(`over the ${targetWps} words/second target; fine if the holds are long, but reconsider the longest card`);
} else {
  console.log(`words on screen: ${total} (could not read the duration from defineVideo)`);
}

// 4. Deterministic-runtime tells.
const script = (html.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/g) || []).join("\n");
for (const bad of ["Date.now(", "Math.random(", "setInterval(", "setTimeout(", "requestAnimationFrame("]) {
  if (script.includes(bad)) warnings.push(`"${bad}" found in the video script; the video must be a pure function of time or frames will not match the preview`);
}
if (/@keyframes|animation\s*:/.test(html.replace(/<script[\s\S]*?<\/script>/g, ""))) warnings.push("CSS animation found; the renderer cannot seek CSS animations, drive the motion from tracks instead");

for (const w of warnings) console.log(`warning: ${w}`);
for (const e of errors) console.log(`error: ${e}`);
if (!errors.length && !warnings.length) console.log("copy check: clean");
process.exit(errors.length ? 1 : 0);
