import type { CSSProperties } from "react";
import { content } from "@/content";

const { career, trace } = content.hero;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Month index counted from year 0, so subtraction gives a duration in months.
function toMonths(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

function formatDuration(months: number) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return m ? `${y}y ${m}m` : `${y}y`;
}

type Vars = CSSProperties & Record<`--${string}`, string>;

export default function CareerTrace() {
  const now = new Date();
  const nowMonths = now.getFullYear() * 12 + now.getMonth() + now.getDate() / 31;
  const first = toMonths(career[0].start);
  const total = nowMonths - first;
  const pct = (months: number) => `${((months / total) * 100).toFixed(1)}%`;

  const rows = career.map((job) => {
    const start = toMonths(job.start) - first;
    const end = (job.end ? toMonths(job.end) : nowMonths) - first;
    const dur = formatDuration(Math.floor(end - start));
    return {
      ...job,
      style: { "--start": pct(start), "--width": pct(end - start), "--bar": `var(--${job.color})` } as Vars,
      label: job.end ? dur : `${dur} · ${trace.now}`,
    };
  });

  const firstYear = Math.floor(first / 12);
  const ticks: { year: number; left: string }[] = [];
  for (let y = firstYear + 1; y * 12 < nowMonths; y++) {
    if (y % 2 === 0) ticks.push({ year: y, left: pct(y * 12 - first) });
  }

  const startLabel = `${MONTHS[first % 12]} ${firstYear}`;

  return (
    <figure
      className="m-0 min-w-0 rounded-[10px] border border-line bg-surface/70 px-4.5 pt-4.5 pb-3.5 font-mono text-caption shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-md"
      aria-label={trace.ariaLabel}>
      <figcaption className="mb-2.5 flex flex-wrap justify-between gap-3 border-b border-line pb-3 text-muted">
        <span>
          {trace.label} <strong className="font-medium text-ink">{trace.title}</strong>
        </span>
        <span>
          <span className="live-dot mr-1.5 inline-block size-[7px] rounded-full bg-span-2 align-[1px]" aria-hidden="true" />
          {formatDuration(Math.floor(total))} · {trace.running}
        </span>
      </figcaption>
      <ol className="grid list-none gap-0.5">
        <li className="trace-row">
          <span className="trace-name">{trace.root}</span>
          <span className="trace-track">
            <span className="trace-bar" style={{ "--start": "0%", "--width": "100%", "--bar": "var(--ink)" } as Vars} />
            <span className="trace-dur" style={{ "--start": "0%", "--width": "100%" } as Vars}>
              {startLabel} → {trace.now}
            </span>
          </span>
        </li>
        {rows.map((row) => [
          <li className="trace-row" key={row.company}>
            <span className="trace-name">{row.company}</span>
            <span className="trace-track">
              <span className="trace-bar" style={row.style} />
              <span className="trace-dur" style={row.style}>
                {row.label}
              </span>
            </span>
          </li>,
          <li className="trace-row child" key={`${row.company}-projects`}>
            <span className="trace-name">{row.projects}</span>
            <span className="trace-track">
              <span className="trace-bar" style={row.style} />
            </span>
          </li>,
        ])}
      </ol>
      <div className="trace-axis" aria-hidden="true">
        {ticks.map((t) => (
          <span key={t.year} style={{ left: t.left }}>
            {t.year}
          </span>
        ))}
      </div>
    </figure>
  );
}
