"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CaseStudy } from "@/content";
import { content } from "@/content";
import { chip } from "@/components/ui";
import { slug } from "@/lib/slug";

const labels = content.work.modal;

// "How it works" button + popup. Uses the native <dialog> element, so focus is
// trapped inside, Esc closes it, and screen readers announce it as a dialog.
export default function CaseStudyModal({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [closing, setClosing] = useState(false);

  function open() {
    setClosing(false);
    ref.current?.showModal();
  }

  // Play the exit animation, then actually close.
  function close() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return ref.current?.close();
    setClosing(true);
    window.setTimeout(() => {
      ref.current?.close();
      setClosing(false);
    }, 220);
  }

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    // Esc: run our animated close instead of the instant default.
    const onCancel = (e: Event) => {
      e.preventDefault();
      close();
    };
    d.addEventListener("cancel", onCancel);
    return () => d.removeEventListener("cancel", onCancel);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="group/btn inline-flex cursor-pointer items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-4 py-2 text-[0.9375rem] font-medium text-accent transition hover:border-accent hover:bg-accent hover:text-accent-ink"
      >
        {content.work.detailsLabel}
        <span aria-hidden="true" className="transition-transform group-hover/btn:translate-x-0.5">
          →
        </span>
      </button>

      <dialog
        ref={ref}
        aria-labelledby={`${slug(study.title)}-title`}
        data-closing={closing || undefined}
        onClick={(e) => {
          // Clicking the dimmed backdrop (the dialog element itself) closes it.
          if (e.target === e.currentTarget) close();
        }}
        className="case-modal m-0 max-h-none max-w-none text-ink backdrop:bg-transparent"
      >
        <div className="case-modal-panel flex max-h-[min(88dvh,820px)] w-[min(820px,100vw)] flex-col overflow-hidden border border-line bg-surface shadow-[0_40px_120px_-30px_rgba(0,0,0,0.55)]">
          {/* Header */}
          <div className="relative flex flex-none items-start justify-between gap-4 overflow-hidden border-b border-line px-6 pt-6 pb-5 sm:px-8">
            <div className="modal-header-glow" aria-hidden="true" />
            <div className="relative grid min-w-0 gap-1.5">
              <p className="eyebrow">{study.context}</p>
              <h3 id={`${slug(study.title)}-title`} className="text-h3 leading-tight font-bold">
                {study.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="relative grid size-10 flex-none cursor-pointer place-items-center rounded-full border border-line bg-paper text-muted transition hover:rotate-90 hover:border-accent hover:text-ink"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="grid gap-8 overflow-y-auto overscroll-contain px-6 py-7 sm:px-8">
            <p className="max-w-[46em] text-muted">{study.summary}</p>

            <section className="grid gap-3">
              <h4 className="eyebrow">{labels.results}</h4>
              <ul className="grid list-none gap-3 sm:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                {study.metrics.map((m, i) => (
                  <li
                    key={m.label}
                    className="modal-rise grid gap-1 rounded-xl border border-line bg-paper px-4 py-3.5"
                    style={{ animationDelay: `${120 + i * 70}ms` }}
                  >
                    <span className="font-display text-h3 leading-tight font-semibold text-accent tabular-nums">
                      {m.value}
                    </span>
                    <span className="text-sm text-muted">{m.label}</span>
                  </li>
                ))}
              </ul>
            </section>

            {study.pipeline.length > 0 && (
              <section className="grid gap-3">
                <h4 className="eyebrow">{labels.flow}</h4>
                <ol className="flow grid list-none gap-2 sm:flex sm:gap-0">
                  {study.pipeline.map((p, i) => (
                    <li
                      key={p.step}
                      className="flow-step relative grid flex-1 gap-0.5 rounded-xl border border-line bg-paper px-3.5 py-3 text-sm"
                      style={{ "--i": i } as CSSProperties}
                    >
                      <span className="font-mono text-[0.68rem] text-accent">{String(i + 1).padStart(2, "0")}</span>
                      <strong className="font-semibold">{p.step}</strong>
                      <span className="font-mono text-[0.72rem] text-muted">{p.detail}</span>
                    </li>
                  ))}
                </ol>
                {study.pipelineNote && <p className="text-caption text-muted">{study.pipelineNote}</p>}
              </section>
            )}

            <section className="grid gap-3">
              <h4 className="eyebrow">{labels.approach}</h4>
              <ul className="grid list-none gap-2.5">
                {study.details.map((d, i) => (
                  <li
                    key={d}
                    className="modal-rise grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2"
                    style={{ animationDelay: `${200 + i * 60}ms` }}
                  >
                    <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-accent-soft text-accent">
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                        <path d="M2 5.2l2 2L8 3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="grid gap-3">
              <h4 className="eyebrow">{labels.stack}</h4>
              <ul className="flex list-none flex-wrap gap-1.5">
                {study.stack.map((s) => (
                  <li key={s} className={chip}>
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </dialog>
    </>
  );
}
