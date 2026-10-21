#!/usr/bin/env node
/*
 * selftest.mjs - regression checks on the runtime, run against a scaffolded video folder.
 *   node selftest.mjs <video-folder>
 * Loads the folder's video.html headless, seeks through it, and asserts: every scene renders,
 * camera transforms are finite (a NaN silently drops the whole transform), cursor targets
 * resolve, transitions overlap (both scenes visible inside a transition window) and never
 * double-expose outside it, and no page errors. Exit 1 on any failure.
 */
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const dir = resolve(process.argv[2] || ".");
const req = createRequire(join(dir, "package.json"));
const { chromium } = req("playwright");
const browser = await chromium.launch({ channel: "chrome", headless: true }).catch(() => chromium.launch({ headless: true }));
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [];
page.on("pageerror", (e) => errors.push("page error: " + e.message));
page.on("console", (m) => { if (m.type() === "warning" && /\[motion\]/.test(m.text())) errors.push("runtime warning: " + m.text()); });
await page.goto(pathToFileURL(join(dir, "video.html")).href + "?__render=1");
await page.waitForFunction(() => window.__videoMeta && window.__seek);
await page.evaluate(() => window.__ready);

const report = await page.evaluate(() => {
  const v = window.Motion.video, out = { scenes: [], finite: true, overlapOk: true, notes: [] };
  const vis = () => v.scenes.filter((s) => v.sceneEls.get(s.id).style.display !== "none").map((s) => s.id);
  for (const s of v.scenes) {
    const mid = (s._start + s._end) / 2;
    window.__seek(mid);
    const shown = vis();
    out.scenes.push({ id: s.id, shownAtMid: shown });
    if (!shown.includes(s.id)) out.notes.push(`scene ${s.id} not visible at its midpoint`);
    if (shown.length > 1) { out.overlapOk = false; out.notes.push(`double exposure at ${mid}s: ${shown.join(", ")}`); }
    const tr = s._camEl && s._camEl.style.transform;
    if (tr && /NaN|undefined/.test(tr)) { out.finite = false; out.notes.push(`camera transform in ${s.id} is ${tr}`); }
    // Camera at the end of the scene too (targets and clamps).
    window.__seek(s._end - 0.05);
    const tr2 = s._camEl && s._camEl.style.transform;
    if (tr2 && /NaN|undefined/.test(tr2)) { out.finite = false; out.notes.push(`camera transform in ${s.id} near its end is ${tr2}`); }
    // Inside a transition window both scenes should be visible.
    const idx = v.scenes.indexOf(s), next = v.scenes[idx + 1];
    if (next && next.transition && next.transition.type !== "cut") {
      const d = next.transition.dur != null ? next.transition.dur : 0.5;
      window.__seek(next._start - d / 2);
      const both = vis();
      if (!(both.includes(s.id) && both.includes(next.id))) out.notes.push(`transition into ${next.id} does not overlap at ${next._start - d / 2}s (visible: ${both.join(", ")})`);
    }
  }
  for (const t of v.scenes.flatMap((s) => s._tracks)) for (const k of t.kfs) if (k.target) out.notes.push(`unresolved cursor target ${k.target}`);
  return out;
});
await browser.close();

const fails = [...errors, ...report.notes];
if (fails.length) { console.log("selftest FAILED"); for (const f of fails) console.log("  " + f); process.exit(1); }
console.log(`selftest ok: ${report.scenes.length} scenes, camera finite, transitions overlap, no runtime warnings`);
