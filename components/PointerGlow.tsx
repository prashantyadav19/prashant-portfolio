"use client";

import { useEffect } from "react";

// Moves a soft spotlight under the mouse in any section marked with `data-glow`.
// Renders nothing; it only sets --gx / --gy on the section being hovered.
export default function PointerGlow() {
  useEffect(() => {
    let active: HTMLElement | null = null;
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = (e.target as Element | null)?.closest<HTMLElement>("[data-glow]") ?? null;
        if (active && active !== el) active.removeAttribute("data-glow-on");
        active = el;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--gx", `${e.clientX - r.left}px`);
        el.style.setProperty("--gy", `${e.clientY - r.top}px`);
        el.setAttribute("data-glow-on", "");
      });
    };
    const onLeave = () => active?.removeAttribute("data-glow-on");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}
