#!/usr/bin/env node
/*
 * scaffold.mjs - create a motion video folder from the project template.
 *   node scaffold.mjs [target-dir] [--no-install]
 * Copies motion.js, render.mjs, check-copy.mjs, preview.mjs, package.json, .gitignore and the
 * starter video.html (never overwriting an existing video.html), writes brief.md and storyboard.md
 * stubs from the templates when absent, then runs npm install.
 */
import { cpSync, existsSync, mkdirSync, copyFileSync, readdirSync } from "node:fs";
import { resolve, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const here = dirname(fileURLToPath(import.meta.url));
const skill = resolve(here, "..");
const template = join(skill, "assets", "project-template");
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const noInstall = process.argv.includes("--no-install");
const target = resolve(args[0] || "motion-video");

mkdirSync(join(target, "assets", "screens"), { recursive: true });
mkdirSync(join(target, "out"), { recursive: true });

for (const f of readdirSync(template)) {
  const src = join(template, f), dst = join(target, f);
  if (f === "video.html" && existsSync(dst)) { console.log(`keep   ${dst}`); continue; }
  cpSync(src, dst, { recursive: true });
  console.log(`${existsSync(dst) ? "write " : "copy  "} ${dst}`);
}
for (const [tpl, name] of [["brief-template.md", "brief.md"], ["storyboard-template.md", "storyboard.md"]]) {
  const dst = join(target, name);
  if (!existsSync(dst)) { copyFileSync(join(skill, "assets", tpl), dst); console.log(`write  ${dst}`); }
}

if (!noInstall) {
  console.log("npm install ...");
  const r = spawnSync("npm", ["install", "--no-audit", "--no-fund"], { cwd: target, stdio: "inherit" });
  if (r.status !== 0) console.error("npm install failed; run it by hand in " + target);
}
console.log(`\nVideo folder ready: ${target}
  preview : cd ${target} && node preview.mjs   (then open http://localhost:4800/video.html)
  sheet   : node render.mjs --sheet --out out/sheet.png
  render  : node render.mjs --out out/video.mp4
  chrome  : if no browser launches, run: npx playwright install chromium`);
