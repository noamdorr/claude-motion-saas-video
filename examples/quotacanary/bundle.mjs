#!/usr/bin/env node
/*
 * bundle.mjs - inline motion.js and local images into one HTML file you can paste into claude.ai
 * as an artifact, attach to an email, or hand to a community exporter.
 *   node bundle.mjs [video.html] [--out out/video.bundle.html]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname, join, extname } from "node:path";

const args = process.argv.slice(2);
const inPath = resolve(args.find((a) => !a.startsWith("--")) || "video.html");
const outIdx = args.indexOf("--out");
const outPath = resolve(outIdx >= 0 ? args[outIdx + 1] : "out/video.bundle.html");
const base = dirname(inPath);
let html = readFileSync(inPath, "utf8");

// Inline local scripts.
html = html.replace(/<script\s+src="\.\/?([^"]+)"><\/script>/g, (m, src) => {
  const p = join(base, src);
  return existsSync(p) ? `<script>\n${readFileSync(p, "utf8")}\n</script>` : m;
});
// Inline local images as data URIs.
const mime = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".gif": "image/gif" };
html = html.replace(/(src|href)="(\.\/)?(assets\/[^"]+)"/g, (m, attr, _d, rel) => {
  const p = join(base, rel);
  const type = mime[extname(p).toLowerCase()];
  if (!type || !existsSync(p)) return m;
  return `${attr}="data:${type};base64,${readFileSync(p).toString("base64")}"`;
});
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, html);
console.log(`bundle -> ${outPath} (${(html.length / 1024).toFixed(0)} KB)`);
