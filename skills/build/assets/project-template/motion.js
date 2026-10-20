/*
 * motion.js - a tiny time-driven animation runtime for Claude-Motion-style videos.
 *
 * The whole animation is a pure function of time: window.__seek(t) renders the exact
 * frame for second t, so a headless browser can capture every frame deterministically.
 * No requestAnimationFrame state, no CSS @keyframes, no Date.now(), no Math.random().
 *
 * Export contract (compatible with the community "Stage" exporters):
 *   window.__videoMeta -> { width, height, duration, fps }
 *   window.__seek(t)   -> renders frame at t seconds
 *   window.__ready     -> Promise that resolves once fonts and images are loaded
 *   ?__render=1        -> hides the player chrome and renders at exact pixel size
 *
 * Authoring API (see video.html for a worked example):
 *   defineVideo({ width, height, fps, scenes: [...], global: {...}, onFrame(t) })
 *   scene: { id, start, dur, transition: { type, dur }, camera: [...], tracks: {...} }
 *   track: selector -> [ { at, ease, opacity, x, y, scale, rotate, blur, clip, bg, color, count, typed, progress, '--var' } ]
 *          or         -> { stagger, at, dur, from, to, ease }   (one tween per matched element, offset by index)
 *          or         -> { stagger, keyframes: [...] }
 * Times inside a scene are scene-local seconds. `global` tracks use absolute seconds.
 */
(function () {
  "use strict";

  // ---------- easing ----------
  const EASE = {
    linear: (t) => t,
    inQuad: (t) => t * t,
    outQuad: (t) => 1 - (1 - t) * (1 - t),
    inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
    inCubic: (t) => t * t * t,
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outQuart: (t) => 1 - Math.pow(1 - t, 4),
    outQuint: (t) => 1 - Math.pow(1 - t, 5),
    inOutQuint: (t) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
    inExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
    outExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
    inOutExpo: (t) =>
      t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
    outBack: (t) => {
      const c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    },
    // Damped spring with a small overshoot. Settles by t=1.
    spring: (t) => 1 - Math.exp(-6.5 * t) * (Math.cos(9 * t) + 0.72 * Math.sin(9 * t)),
    // Softer spring, almost no overshoot. Good for UI cards landing.
    springSoft: (t) => 1 - Math.exp(-7 * t) * (1 + 7 * t),
  };

  const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
  const lerp = (a, b, p) => a + (b - a) * p;

  function hexToRgb(h) {
    h = h.replace("#", "");
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function lerpColor(a, b, p) {
    const A = hexToRgb(a), B = hexToRgb(b);
    return `rgb(${Math.round(lerp(A[0], B[0], p))},${Math.round(lerp(A[1], B[1], p))},${Math.round(lerp(A[2], B[2], p))})`;
  }

  // Which props mean what. Anything else that starts with "--" becomes a CSS variable.
  const COLOR_PROPS = new Set(["bg", "color", "borderColor"]);
  const TRANSFORM_PROPS = new Set(["x", "y", "scale", "sx", "sy", "rotate", "skewX"]);
  const DEFAULTS = { x: 0, y: 0, scale: 1, sx: 1, sy: 1, rotate: 0, skewX: 0, opacity: 1, blur: 0, progress: 0 };

  // ---------- keyframe evaluation ----------
  // Given a sorted list of keyframes and local time t, return the interpolated props.
  function evalKeyframes(kfs, t) {
    const out = {};
    // Collect every prop name used.
    const props = new Set();
    for (const k of kfs) for (const p in k) if (p !== "at" && p !== "ease") props.add(p);
    for (const p of props) {
      // Find the keyframes that define this prop.
      const defined = kfs.filter((k) => p in k);
      if (!defined.length) continue;
      if (t <= defined[0].at) { out[p] = defined[0][p]; continue; }
      const last = defined[defined.length - 1];
      if (t >= last.at) { out[p] = last[p]; continue; }
      for (let i = 1; i < defined.length; i++) {
        const a = defined[i - 1], b = defined[i];
        if (t >= a.at && t < b.at) {
          const span = b.at - a.at;
          const raw = span <= 0 ? 1 : (t - a.at) / span;
          const ease = typeof b.ease === "function" ? b.ease : EASE[b.ease || "outQuint"] || EASE.outQuint;
          const pr = ease(clamp01(raw));
          out[p] = interpValue(p, a[p], b[p], pr);
          break;
        }
      }
    }
    return out;
  }

  function interpValue(prop, a, b, p) {
    if (COLOR_PROPS.has(prop)) return lerpColor(a, b, p);
    if (Array.isArray(a) && Array.isArray(b)) return a.map((v, i) => lerp(v, b[i], p));
    if (typeof a === "number" && typeof b === "number") return lerp(a, b, p);
    return p < 1 ? a : b;
  }

  // ---------- applying props to an element ----------
  function applyProps(el, props, cache) {
    const st = el.style;
    let transformDirty = false;
    for (const p in props) {
      const v = props[p];
      if (TRANSFORM_PROPS.has(p)) { cache[p] = v; transformDirty = true; continue; }
      switch (p) {
        case "opacity": st.opacity = v; break;
        case "blur": st.filter = v > 0.01 ? `blur(${v}px)` : ""; break;
        case "clip": st.clipPath = `inset(${v[0]}% ${v[1]}% ${v[2]}% ${v[3]}%)`; break;
        case "bg": st.background = v; break;
        case "color": st.color = v; break;
        case "borderColor": st.borderColor = v; break;
        case "w": st.width = v + "px"; break;
        case "h": st.height = v + "px"; break;
        case "progress": st.setProperty("--p", v); break;
        case "count": {
          const fmt = el.dataset.format || "0";
          el.textContent = formatNumber(v, fmt);
          break;
        }
        case "typed": {
          if (el.dataset.text == null) el.dataset.text = el.textContent;
          const full = el.dataset.text;
          const n = Math.round(clamp01(v) * full.length);
          el.textContent = full.slice(0, n);
          if (el.dataset.cursor != null) el.classList.toggle("typing", v > 0 && v < 1);
          break;
        }
        default:
          if (p.startsWith("--")) st.setProperty(p, v);
      }
    }
    if (transformDirty) {
      const c = Object.assign({}, DEFAULTS, cache);
      const parts = [];
      if (c.x || c.y) parts.push(`translate(${c.x}px, ${c.y}px)`);
      if (c.rotate) parts.push(`rotate(${c.rotate}deg)`);
      if (c.skewX) parts.push(`skewX(${c.skewX}deg)`);
      const sx = c.scale * c.sx, sy = c.scale * c.sy;
      if (sx !== 1 || sy !== 1) parts.push(`scale(${sx}, ${sy})`);
      st.transform = parts.join(" ");
    }
  }

  function formatNumber(v, fmt) {
    // fmt examples: "0", "0.0", "0,0", "$0,0", "0%", "0.0%", "+0"
    const m = fmt.match(/^([^0]*)(0(?:,0)?(?:\.0+)?)(.*)$/);
    if (!m) return String(Math.round(v));
    const prefix = m[1], core = m[2], suffix = m[3];
    const decimals = (core.split(".")[1] || "").length;
    const grouped = core.includes(",");
    let s = Math.abs(v).toFixed(decimals);
    if (grouped) {
      const [int, dec] = s.split(".");
      s = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (dec ? "." + dec : "");
    }
    const sign = v < 0 ? "-" : prefix.includes("+") ? "+" : "";
    return sign + prefix.replace("+", "") + s + suffix;
  }

  // ---------- transitions between scenes ----------
  // Returns style props for a scene container given its phase: "in" (entering) or "out" (leaving)
  // and progress p in [0,1]. Keep these subtle; the content tracks carry the motion.
  const TRANSITIONS = {
    cut: { in: () => ({ opacity: 1 }), out: () => ({ opacity: 1 }) },
    fade: {
      in: (p) => ({ opacity: EASE.inOutCubic(p) }),
      out: (p) => ({ opacity: 1 - EASE.inOutCubic(p) }),
    },
    // Incoming scene rises in while the outgoing scene drifts up and fades.
    push: {
      in: (p, s) => ({ opacity: 1, y: (1 - EASE.outQuint(p)) * s.height * 0.12 }),
      out: (p, s) => ({ opacity: 1 - EASE.inCubic(p), y: -EASE.inCubic(p) * s.height * 0.08 }),
    },
    // Z-axis push-through: the outgoing scene flies into the camera, the incoming settles from behind.
    zoom: {
      in: (p) => ({ opacity: EASE.outCubic(Math.min(1, p * 1.6)), scale: lerp(0.92, 1, EASE.outQuint(p)) }),
      out: (p) => ({ opacity: 1 - EASE.inCubic(p), scale: lerp(1, 1.5, EASE.inCubic(p)) }),
    },
    // Horizontal slide: whip-pan feel for "same world, next panel".
    slide: {
      in: (p, s) => ({ opacity: 1, x: (1 - EASE.outExpo(p)) * s.width }),
      out: (p, s) => ({ opacity: 1, x: -EASE.inOutExpo(p) * s.width }),
    },
    // Wipe: incoming scene reveals from the left with a clip mask.
    wipe: {
      in: (p) => ({ opacity: 1, clip: [0, 100 - EASE.inOutQuint(p) * 100, 0, 0] }),
      out: () => ({ opacity: 1 }),
    },
  };

  // ---------- the video ----------
  let video = null;

  function defineVideo(def) {
    const width = def.width || 1920, height = def.height || 1080, fps = def.fps || 30;
    const scenes = (def.scenes || []).map((s, i, arr) => {
      const start = s.start != null ? s.start : i === 0 ? 0 : arr[i - 1]._end;
      const end = s.end != null ? s.end : start + (s.dur != null ? s.dur : 3);
      s._start = start; s._end = end;
      arr[i]._end = end;
      return s;
    });
    const duration = def.duration != null ? def.duration : scenes.length ? scenes[scenes.length - 1]._end : 5;
    video = { def, width, height, fps, duration, scenes, tracks: [], sceneEls: new Map() };
    window.__videoMeta = { width, height, duration, fps };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
    return video;
  }

  // Wrap each word of the text nodes under el in <span class="w">, keeping nested elements
  // (an accent <span> inside a headline survives; its words still get .w spans inside it).
  function wrapWords(node, cls, perChar) {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        const parts = perChar ? Array.from(child.textContent) : child.textContent.split(/(\s+)/);
        for (const part of parts) {
          if (!part) continue;
          if (!perChar && /^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); continue; }
          const span = document.createElement("span");
          span.className = cls;
          span.textContent = perChar && part === " " ? "\u00a0" : part;
          frag.appendChild(span);
        }
        node.replaceChild(frag, child);
      } else if (child.nodeType === 1) wrapWords(child, cls, perChar);
    }
  }
  function splitWords(root) {
    root.querySelectorAll("[data-words]").forEach((el) => { if (!el.dataset.split) { wrapWords(el, "w", false); el.dataset.split = "1"; } });
    root.querySelectorAll("[data-chars]").forEach((el) => { if (!el.dataset.split) { wrapWords(el, "c", true); el.dataset.split = "1"; } });
  }

  // Compile a track spec into { el, keyframes } entries.
  function compileTracks(root, specs, offset) {
    const out = [];
    const seen = new Map(); // el -> Set(prop)
    for (const selector in specs || {}) {
      const spec = specs[selector];
      const els = selector === "self" ? [root] : Array.from(root.querySelectorAll(selector));
      if (!els.length) console.warn("[motion] no elements for track", selector);
      els.forEach((el, i) => {
        let kfs;
        if (Array.isArray(spec)) kfs = spec;
        else if (spec.keyframes) kfs = spec.keyframes.map((k) => Object.assign({}, k, { at: k.at + i * (spec.stagger || 0) }));
        else {
          const at = (spec.at || 0) + i * (spec.stagger || 0);
          kfs = [Object.assign({ at }, spec.from || {}), Object.assign({ at: at + (spec.dur != null ? spec.dur : 0.6), ease: spec.ease }, spec.to || {})];
        }
        kfs = kfs.slice().sort((a, b) => a.at - b.at);
        const props = new Set(kfs.flatMap((k) => Object.keys(k).filter((p) => p !== "at" && p !== "ease" && p !== "target" && p !== "hot" && p !== "align")));
        const prev = seen.get(el) || new Set();
        for (const p of props) if (prev.has(p)) console.warn(`[motion] two tracks write "${p}" on`, el, `(selector ${selector}); the later one wins at every time, including before its first keyframe`);
        props.forEach((p) => prev.add(p));
        seen.set(el, prev);
        out.push({ el, kfs, offset: offset || 0, cache: {} });
      });
    }
    return out;
  }

  function init() {
    const stage = document.querySelector("[data-stage]") || document.body;
    video.stage = stage;
    stage.style.width = video.width + "px";
    stage.style.height = video.height + "px";
    splitWords(stage);

    for (const s of video.scenes) {
      const el = stage.querySelector(`[data-scene="${s.id}"]`);
      if (!el) { console.warn("[motion] missing scene element", s.id); continue; }
      video.sceneEls.set(s.id, el);
      el.style.position = "absolute";
      el.style.inset = "0";
      el.style.display = "none";
      s._tracks = compileTracks(el, s.tracks, 0);
      s._camera = s.camera ? s.camera.map((k) => Object.assign({}, k)).sort((a, b) => a.at - b.at) : null;
      if (s._camera && s._camera.length) {
        // A camera prop that first appears in a later keyframe eases from the neutral value,
        // not from that keyframe's value held since t=0.
        const first = s._camera[0];
        for (const [k, v] of [["x", 0], ["y", 0], ["scale", 1]]) if (!(k in first) && !("target" in first)) first[k] = v;
      }
      s._camEl = el.querySelector(".cam") || el;
      s._cache = {};
    }
    video.globalTracks = compileTracks(stage, video.def.global, 0);
    resolveTargets(stage);

    const params = new URLSearchParams(location.search);
    video.renderMode = params.get("__render") === "1";
    document.documentElement.classList.toggle("render", video.renderMode);

    window.__seek = seek;
    window.__ready = waitReady();
    if (!video.renderMode) buildPlayer();
    seek(0);
    window.__ready.then(() => seek(video.player ? video.player.t : 0));
  }

  // A keyframe may say { target: ".btn", hot: [6, 3] } instead of x/y: the cursor (or any absolutely
  // positioned element at left:0/top:0) moves so its hotspot lands on the center of that element.
  // Measured once at init with every scene shown and no transforms applied, in stage pixels.
  function resolveTargets(stage) {
    const all = [...video.scenes.flatMap((s) => s._tracks || []), ...video.globalTracks];
    const camScenes = video.scenes.filter((s) => s._camera && s._camera.some((k) => k.target));
    if (!all.some((t) => t.kfs.some((k) => k.target)) && !camScenes.length) return;
    const shown = [];
    for (const [, el] of video.sceneEls) { shown.push([el, el.style.display]); el.style.display = "block"; el.style.visibility = "hidden"; }
    const sr = stage.getBoundingClientRect();
    const sc = sr.width / video.width || 1;
    for (const tr of all) {
      for (const k of tr.kfs) {
        if (!k.target) continue;
        const root = tr.el.closest("[data-scene]") || stage;
        const tgt = root.querySelector(k.target) || stage.querySelector(k.target);
        if (!tgt) { console.warn("[motion] target not found", k.target); continue; }
        const r = tgt.getBoundingClientRect();
        const hot = k.hot || tr.el.dataset.hot ? (k.hot || JSON.parse(tr.el.dataset.hot)) : [6, 3];
        const cx = (r.left + r.width * (k.align ? k.align[0] : 0.5) - sr.left) / sc;
        const cy = (r.top + r.height * (k.align ? k.align[1] : 0.5) - sr.top) / sc;
        k.x = Math.round(cx - hot[0]);
        k.y = Math.round(cy - hot[1]);
        delete k.target;
      }
    }
    // Camera keyframes: { at, target: ".sel", scale } looks at the element's center.
    for (const sc of camScenes) {
      const root = video.sceneEls.get(sc.id);
      for (const k of sc._camera) {
        if (!k.target) continue;
        const tgt = root.querySelector(k.target);
        if (!tgt) { console.warn("[motion] camera target not found", k.target); continue; }
        const r = tgt.getBoundingClientRect();
        k.x = Math.round((r.left + r.width / 2 - sr.left) / sc - video.width / 2);
        k.y = Math.round((r.top + r.height / 2 - sr.top) / sc - video.height / 2);
        delete k.target;
      }
    }
    for (const [el, d] of shown) { el.style.display = d; el.style.visibility = ""; }
  }

  function waitReady() {
    const imgs = Array.from(document.images).map(
      (img) => img.complete ? Promise.resolve() : new Promise((r) => { img.onload = r; img.onerror = r; })
    );
    const fonts = document.fonts ? document.fonts.ready : Promise.resolve();
    return Promise.all([fonts, ...imgs]).then(() => true);
  }

  function seek(t) {
    t = Math.max(0, Math.min(video.duration, t));
    video.t = t;
    for (const s of video.scenes) {
      const el = video.sceneEls.get(s.id);
      if (!el) continue;
      const tr = s.transition || { type: "cut", dur: 0 };
      const trIn = TRANSITIONS[tr.type] ? tr : { type: "cut", dur: 0 };
      const inDur = tr.type === "cut" ? 0 : tr.dur != null ? tr.dur : 0.5;
      // The NEXT scene's transition governs how this one leaves.
      const idx = video.scenes.indexOf(s);
      const next = video.scenes[idx + 1];
      const ntr = next && next.transition && TRANSITIONS[next.transition.type] ? next.transition : null;
      const outDur = ntr && ntr.type !== "cut" ? (ntr.dur != null ? ntr.dur : 0.5) : 0;
      // Visible window: a transition of dur d happens in the d seconds before the NEXT scene's
      // start. The incoming scene enters during [start - d, start]; the outgoing scene leaves during
      // [end - d, end] (its end IS the next start). At the grid line the new scene is fully in.
      const visStart = s._start - (idx === 0 ? 0 : inDur);
      const visEnd = s._end;
      const visible = t >= visStart && t < visEnd;
      if (!visible) { el.style.display = "none"; continue; }
      el.style.display = "block";
      const lt = t - s._start;
      // Container transition props
      let cprops = { opacity: 1, x: 0, y: 0, scale: 1 };
      const easeOf = (tr3) => (tr3 && tr3.ease ? (typeof tr3.ease === "function" ? tr3.ease : EASE[tr3.ease] || EASE.linear) : EASE.linear);
      if (inDur > 0 && t < s._start) {
        const p = easeOf(trIn)(clamp01((t - visStart) / inDur));
        Object.assign(cprops, TRANSITIONS[trIn.type].in(p, video));
        el.style.zIndex = 2;
      } else if (outDur > 0 && t >= s._end - outDur) {
        const p = easeOf(ntr)(clamp01((t - (s._end - outDur)) / outDur));
        Object.assign(cprops, TRANSITIONS[ntr.type].out(p, video));
        el.style.zIndex = 1;
      } else {
        el.style.zIndex = 1;
        el.style.clipPath = "";
      }
      if (!("clip" in cprops)) el.style.clipPath = "";
      applyProps(el, cprops, s._cache);
      // Camera
      if (s._camera) {
        const cam = Object.assign({ x: 0, y: 0, scale: 1 }, evalKeyframes(s._camera, lt));
        if (s.cameraClamp !== false && cam.scale > 1) {
          const mx = (video.width / 2) * (1 - 1 / cam.scale), my = (video.height / 2) * (1 - 1 / cam.scale);
          cam.x = Math.max(-mx, Math.min(mx, cam.x)); cam.y = Math.max(-my, Math.min(my, cam.y));
        }
        s._camEl.style.transformOrigin = "50% 50%";
        s._camEl.style.transform = `scale(${cam.scale}) translate(${-cam.x}px, ${-cam.y}px)`;
      }
      for (const tr2 of s._tracks) applyProps(tr2.el, evalKeyframes(tr2.kfs, lt), tr2.cache);
    }
    for (const tr of video.globalTracks) applyProps(tr.el, evalKeyframes(tr.kfs, t), tr.cache);
    if (video.def.onFrame) video.def.onFrame(t, video);
    if (video.player) video.player.update(t);
    return t;
  }

  // ---------- preview player (hidden in render mode) ----------
  function buildPlayer() {
    const stage = video.stage;
    const wrap = document.createElement("div");
    wrap.className = "motion-player";
    wrap.innerHTML = `
      <style>
        html.preview, html.preview body { margin:0; height:100%; background:#111; overflow:hidden; }
        .motion-viewport { position:fixed; inset:0 0 56px 0; display:flex; align-items:center; justify-content:center; }
        .motion-player .bar { position:fixed; left:0; right:0; bottom:0; height:56px; background:#1c1c1e; color:#eee; font:13px/1 -apple-system, Inter, system-ui, sans-serif; display:flex; align-items:center; gap:12px; padding:0 16px; box-sizing:border-box; z-index:99; }
        .motion-player button { background:#333; color:#fff; border:0; border-radius:6px; padding:8px 12px; cursor:pointer; font:inherit; }
        .motion-player button.scene { background:#2a2a2d; color:#bbb; padding:6px 8px; font-size:11px; }
        .motion-player button.scene.on { background:#4b6bfb; color:#fff; }
        .motion-player input[type=range] { flex:1; accent-color:#4b6bfb; }
        .motion-player .time { font-variant-numeric: tabular-nums; min-width:110px; text-align:right; color:#aaa; }
        .motion-player .scenes { display:flex; gap:4px; max-width:40vw; overflow:auto; }
      </style>
      <div class="bar">
        <button class="play">Play</button>
        <input type="range" min="0" max="1" step="0.001" value="0">
        <div class="scenes"></div>
        <div class="time">0.00 / 0.00</div>
      </div>`;
    document.documentElement.classList.add("preview");
    const viewport = document.createElement("div");
    viewport.className = "motion-viewport";
    stage.parentNode.insertBefore(viewport, stage);
    viewport.appendChild(stage);
    document.body.appendChild(wrap);
    stage.style.transformOrigin = "50% 50%";
    stage.style.position = "relative";
    stage.style.overflow = "hidden";
    stage.style.flex = "none";

    const playBtn = wrap.querySelector(".play");
    const range = wrap.querySelector("input");
    const time = wrap.querySelector(".time");
    const scenesEl = wrap.querySelector(".scenes");
    video.scenes.forEach((s) => {
      const b = document.createElement("button");
      b.className = "scene";
      b.textContent = s.id;
      b.onclick = () => { player.t = s._start; seek(player.t); };
      scenesEl.appendChild(b);
    });

    function fit() {
      const vw = viewport.clientWidth, vh = viewport.clientHeight;
      const sc = Math.min(vw / video.width, vh / video.height) * 0.96;
      stage.style.transform = `scale(${sc})`;
      // Scaled element keeps its layout box; center it with margins.
      stage.style.margin = `${(vh - video.height) / 2}px ${(vw - video.width) / 2}px`;
    }
    window.addEventListener("resize", fit);
    fit();

    const player = {
      t: 0, playing: false, t0: 0, tBase: 0,
      update(t) {
        range.value = t / video.duration;
        time.textContent = `${t.toFixed(2)} / ${video.duration.toFixed(2)}`;
        scenesEl.querySelectorAll("button").forEach((b, i) => {
          const s = video.scenes[i];
          b.classList.toggle("on", t >= s._start && t < s._end);
        });
      },
      play() {
        this.playing = true; playBtn.textContent = "Pause";
        this.t0 = performance.now(); this.tBase = this.t >= video.duration - 0.01 ? 0 : this.t;
        const loop = () => {
          if (!this.playing) return;
          this.t = this.tBase + (performance.now() - this.t0) / 1000;
          if (this.t >= video.duration) { this.t = video.duration; seek(this.t); this.pause(); return; }
          seek(this.t);
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      },
      pause() { this.playing = false; playBtn.textContent = "Play"; },
    };
    video.player = player;
    playBtn.onclick = () => (player.playing ? player.pause() : player.play());
    range.oninput = () => { player.pause(); player.t = parseFloat(range.value) * video.duration; seek(player.t); };
    window.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.code === "Space") { e.preventDefault(); playBtn.onclick(); }
      const step = e.shiftKey ? 1 : 1 / video.fps;
      if (e.code === "ArrowRight") { player.pause(); player.t = Math.min(video.duration, player.t + step); seek(player.t); }
      if (e.code === "ArrowLeft") { player.pause(); player.t = Math.max(0, player.t - step); seek(player.t); }
      if (e.code === "Home") { player.pause(); player.t = 0; seek(0); }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= video.scenes.length) { player.pause(); player.t = video.scenes[n - 1]._start; seek(player.t); }
    });
  }

  window.Motion = { defineVideo, EASE, seek: (t) => seek(t), get video() { return video; } };
  window.defineVideo = defineVideo;
})();
