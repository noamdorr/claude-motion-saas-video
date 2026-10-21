#!/usr/bin/env node
/*
 * preview.mjs - serve the video folder on localhost so the player works with fonts and assets.
 *   node preview.mjs [--port 4800]
 * Then open http://localhost:4800/video.html (Space plays, arrows step frames, 1-9 jump to scenes).
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const port = parseInt(process.argv[process.argv.indexOf("--port") + 1] || "4800", 10);
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".webp": "image/webp", ".mp3": "audio/mpeg", ".json": "application/json", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf" };
createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(req.url.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const file = join(process.cwd(), path === "/" ? "video.html" : path);
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(body);
  } catch {
    res.writeHead(404); res.end("not found");
  }
}).listen(port, () => console.log(`preview: http://localhost:${port}/video.html`));
