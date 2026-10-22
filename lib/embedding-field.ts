// Interactive background: a 2-D "embedding space" of points in a few clusters.
// The pointer acts as a query vector and links to its k nearest neighbours,
// the same idea as the vector search in the case studies. With no pointer
// (touch, idle) the query drifts on its own so the page is alive at rest.
// Framework-free so it runs in the static preview and in the Next.js component.

export type FieldOptions = { density?: number; k?: number; seed?: number; label?: boolean };

export function startEmbeddingField(canvas: HTMLCanvasElement, host: HTMLElement, opts: FieldOptions = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const k = opts.k ?? 6;
  const showLabel = opts.label ?? true;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let seed = opts.seed ?? 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const gauss = () => {
    let u = 0;
    for (let i = 0; i < 4; i++) u += rand();
    return (u - 2) / 2;
  };

  type Pt = { bx: number; by: number; ph: number; amp: number; c: number; r: number };
  let pts: Pt[] = [];
  let w = 0;
  let h = 0;
  let dpr = 1;
  let colors = { ink: "#000", muted: "#888", accent: "#23d", spans: ["#888", "#2a8", "#23d"] };

  function readColors() {
    const cs = getComputedStyle(host);
    const v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
    colors = {
      ink: v("--ink", "#111"),
      muted: v("--muted", "#888"),
      accent: v("--accent", "#2340d6"),
      spans: [v("--span-1", "#8a97b3"), v("--span-2", "#2a8a7d"), v("--span-3", "#2340d6")],
    };
  }

  function build() {
    const rect = host.getBoundingClientRect();
    w = Math.max(1, rect.width);
    h = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    seed = opts.seed ?? 7;
    const count = Math.round(((w * h) / 6500) * (opts.density ?? 1));
    // On wide screens keep clusters to the right half so they don't sit behind the text.
    const x0 = w >= 960 ? 0.52 : 0.08;
    const clusters = Array.from({ length: 5 }, (_, i) => ({
      x: x0 * w + rand() * (0.96 - x0) * w,
      y: 0.12 * h + rand() * 0.76 * h,
      s: Math.min(w, h) * (0.1 + rand() * 0.1),
      c: i % 3,
    }));
    pts = Array.from({ length: Math.min(count, 260) }, () => {
      const cl = clusters[Math.floor(rand() * clusters.length)];
      const loose = rand() < 0.22;
      return {
        bx: loose ? rand() * w : cl.x + gauss() * cl.s * 1.6,
        by: loose ? rand() * h : cl.y + gauss() * cl.s,
        ph: rand() * Math.PI * 2,
        amp: 3 + rand() * 6,
        c: loose ? -1 : cl.c,
        r: 1.8 + rand() * 2,
      };
    });
  }

  let pointer: { x: number; y: number } | null = null;
  let lastMove = 0;
  const onMove = (e: PointerEvent) => {
    if (e.pointerType === "touch") return;
    const r = host.getBoundingClientRect();
    pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    lastMove = performance.now();
    // -1..1 offsets for a parallax background (used by .hero-bg in CSS)
    host.style.setProperty("--mx", ((pointer.x / r.width) * 2 - 1).toFixed(3));
    host.style.setProperty("--my", ((pointer.y / r.height) * 2 - 1).toFixed(3));
  };
  const onLeave = () => {
    pointer = null;
    host.style.setProperty("--mx", "0");
    host.style.setProperty("--my", "0");
  };
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);

  function frame(t: number) {
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const time = reduceMotion ? 0 : t / 1000;

    const usePointer = pointer && t - lastMove < 4000;
    const q = usePointer
      ? pointer!
      : {
          x: w * (0.62 + 0.26 * Math.sin(time * 0.23)),
          y: h * (0.5 + 0.32 * Math.sin(time * 0.31 + 1)),
        };

    const pos = pts.map((p) => ({
      x: p.bx + Math.sin(time * 0.5 + p.ph) * p.amp,
      y: p.by + Math.cos(time * 0.4 + p.ph) * p.amp,
      p,
    }));

    // k nearest neighbours of the query
    const ranked = pos
      .map((o, i) => ({ i, d: Math.hypot(o.x - q.x, o.y - q.y) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
    const near = new Set(ranked.map((r) => r.i));
    const maxD = Math.hypot(w, h);

    // faint graph edges between close points, so clusters read as structure
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.muted;
    const link = Math.min(w, h) * 0.09;
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const d = Math.hypot(pos[i].x - pos[j].x, pos[i].y - pos[j].y);
        if (d < link) {
          ctx.globalAlpha = 0.16 * (1 - d / link);
          ctx.beginPath();
          ctx.moveTo(pos[i].x, pos[i].y);
          ctx.lineTo(pos[j].x, pos[j].y);
          ctx.stroke();
        }
      }
    }

    for (const r of ranked) {
      const o = pos[r.i];
      ctx.globalAlpha = Math.max(0.25, 0.8 * (1 - r.d / (maxD * 0.5)));
      ctx.strokeStyle = colors.accent;
      ctx.beginPath();
      ctx.moveTo(q.x, q.y);
      ctx.lineTo(o.x, o.y);
      ctx.stroke();
    }

    pos.forEach((o, i) => {
      const hit = near.has(i);
      ctx.globalAlpha = hit ? 1 : 0.5;
      ctx.fillStyle = hit ? colors.accent : o.p.c < 0 ? colors.muted : colors.spans[o.p.c];
      ctx.beginPath();
      ctx.arc(o.x, o.y, hit ? o.p.r + 1.6 : o.p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // query marker
    ctx.globalAlpha = 1;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(q.x, q.y, 7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.arc(q.x, q.y, 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (showLabel && w >= 700 && ranked.length) {
      const sim = 1 - ranked[0].d / maxD;
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = colors.muted;
      ctx.font = '11px "IBM Plex Mono", ui-monospace, monospace';
      const text = `query · top-${k} · sim ${sim.toFixed(2)}`;
      const tx = Math.min(q.x + 12, w - ctx.measureText(text).width - 8);
      ctx.fillText(text, tx, Math.max(14, q.y - 12));
    }
    ctx.globalAlpha = 1;
  }

  let raf = 0;
  let visible = true;
  const loop = (t: number) => {
    frame(t);
    if (!reduceMotion && visible && !document.hidden) raf = requestAnimationFrame(loop);
  };
  const restart = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(loop);
  };

  readColors();
  build();
  restart();

  const ro = new ResizeObserver(() => {
    build();
    restart();
  });
  ro.observe(host);

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) restart();
  });
  io.observe(host);

  const onVis = () => !document.hidden && restart();
  document.addEventListener("visibilitychange", onVis);

  // Repaint when the theme changes (system setting or data-theme toggle).
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onTheme = () => {
    readColors();
    restart();
  };
  mq.addEventListener("change", onTheme);
  const mo = new MutationObserver(onTheme);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class"] });

  // In reduced-motion mode the pointer still works, one frame per move.
  const onMoveStatic = () => reduceMotion && restart();
  host.addEventListener("pointermove", onMoveStatic);

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    mo.disconnect();
    mq.removeEventListener("change", onTheme);
    document.removeEventListener("visibilitychange", onVis);
    host.removeEventListener("pointermove", onMove);
    host.removeEventListener("pointermove", onMoveStatic);
    host.removeEventListener("pointerleave", onLeave);
  };
}
