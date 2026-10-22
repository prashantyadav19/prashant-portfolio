"use client";

import { useState } from "react";
import { content, type Skill } from "@/content";

const { skills: copy } = content;
const skillGroups = copy.groups;
const caseStudies = content.work.caseStudies;
const earlierProjects = content.work.earlier.projects;
import { slug } from "@/lib/slug";

type Project = { title: string; context: string; stack: string[]; href: string };

const projects: Project[] = [
  ...caseStudies.map((c) => ({ title: c.title, context: c.context, stack: c.stack, href: `#${slug(c.title)}` })),
  ...earlierProjects.map((p) => ({ title: p.title, context: p.context, stack: p.stack, href: `#${slug(p.title)}` })),
];

function usedIn(s: Skill) {
  const names = [s.name, ...(s.also ?? [])];
  return projects.filter((p) => p.stack.some((t) => names.includes(t)));
}

// Light, row-based skills list. Hover (or tap) a skill to see where it was used;
// clicking pins it so the detail stays open.
export default function SkillsExplorer() {
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hover ?? pinned;

  return (
    <div className="grid gap-4">
      <p className="text-caption text-muted">
        {copy.hint}{" "}
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden="true" /> {copy.legend}
        </span>
      </p>

      <dl className="grid" onMouseLeave={() => setHover(null)}>
        {skillGroups.map(({ group, skills }) => {
          const current = skills.find((s) => s.name === active);
          const used = current ? usedIn(current) : [];
          return (
            <div
              key={group}
              className={`grid gap-x-8 gap-y-2 border-b border-line py-4 transition-colors md:grid-cols-[13em_minmax(0,1fr)] md:items-baseline ${
                current ? "border-l-2 border-l-accent bg-surface/60 pl-3 md:pl-4" : "border-l-2 border-l-transparent pl-3 md:pl-4"
              }`}
            >
              <dt className="font-semibold">{group}</dt>
              <dd className="min-w-0">
                <ul className="-mx-2 flex list-none flex-wrap gap-0.5">
                  {skills.map((s) => {
                    const on = s.name === active;
                    const hasUse = usedIn(s).length > 0;
                    return (
                      <li key={s.name}>
                        <button
                          type="button"
                          aria-pressed={pinned === s.name}
                          onMouseEnter={() => setHover(s.name)}
                          onFocus={() => setHover(s.name)}
                          onBlur={() => setHover(null)}
                          onClick={() => setPinned((p) => (p === s.name ? null : s.name))}
                          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 transition-colors duration-150 ${
                            on ? "bg-accent text-accent-ink" : "hover:bg-accent-soft"
                          }`}
                        >
                          {s.name}
                          {hasUse && (
                            <span
                              className={`inline-block size-1.5 rounded-full ${on ? "bg-accent-ink" : "bg-accent"}`}
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Detail line, expands under the row of the active skill */}
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    current ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                  aria-live="polite"
                >
                  <div className="overflow-hidden">
                    {current && (
                      <p className="pt-2.5 text-sm text-muted">
                        <strong className="font-semibold text-ink">{current.name}</strong>
                        {current.note && <> · {current.note}</>}
                        {" — "}
                        {used.length ? (
                          <>
                            {copy.usedIn}{" "}
                            {used.map((p, i) => (
                              <span key={p.title}>
                                {i > 0 && (i === used.length - 1 ? ` ${copy.and} ` : ", ")}
                                <a href={p.href} className="text-accent underline-offset-2 hover:underline">
                                  {p.title}
                                </a>
                              </span>
                            ))}
                            .
                          </>
                        ) : (
                          copy.notUsed
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
