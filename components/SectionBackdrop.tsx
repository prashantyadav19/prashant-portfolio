import type { CSSProperties } from "react";

// Decorative animated backgrounds, one style per section. The parent section needs
// `relative isolate overflow-hidden` (and `data-glow` for the mouse spotlight).
// All motion is CSS (see "Section backgrounds" in app/globals.css) and stops
// when the visitor has reduced motion turned on.

type Variant = "aurora" | "waveform" | "pipeline" | "commits" | "orbits" | "binary" | "messages";
type Vars = CSSProperties & Record<`--${string}`, string>;

// Small deterministic random generator so server and browser render the same markup.
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export default function SectionBackdrop({ variant }: { variant: Variant }) {
  return (
    <div className={`backdrop backdrop-${variant}`} aria-hidden="true">
      {variant === "waveform" && <Waveform />}
      {variant === "pipeline" && <Pipeline />}
      {variant === "commits" && <Commits />}
      {variant === "orbits" && <Orbits />}
      {variant === "binary" && <Binary />}
      {variant === "messages" && <Messages />}
      <span className="glow" />
    </div>
  );
}

// Intro video: an audio waveform breathing along the bottom edge.
function Waveform() {
  const rand = seeded(11);
  return (
    <div className="wave">
      {Array.from({ length: 84 }, (_, i) => (
        <span
          key={i}
          style={{ "--h": `${25 + Math.round(rand() * 75)}%`, "--d": `${(-i * 0.09).toFixed(2)}s` } as Vars}
        />
      ))}
    </div>
  );
}

// Work: data packets travelling along pipeline tracks.
function Pipeline() {
  const tracks = [
    { y: "14%", dur: "9s", delay: "-2s" },
    { y: "36%", dur: "13s", delay: "-7s" },
    { y: "58%", dur: "10s", delay: "-4s" },
    { y: "80%", dur: "15s", delay: "-11s" },
  ];
  return (
    <>
      {tracks.map((t, i) => (
        <div key={i} className="track" style={{ "--y": t.y } as Vars}>
          <span className="packet" style={{ "--dur": t.dur, "--delay": t.delay } as Vars} />
          <span className="packet" style={{ "--dur": t.dur, "--delay": `calc(${t.delay} - 4.5s)` } as Vars} />
        </div>
      ))}
    </>
  );
}

// Experience: a contribution-graph of squares lighting up over time.
function Commits() {
  const rand = seeded(5);
  return (
    <div className="commits">
      {Array.from({ length: 30 * 7 }, (_, i) => (
        <span
          key={i}
          style={{ "--d": `${(rand() * -12).toFixed(2)}s`, "--l": `${(0.25 + rand() * 0.75).toFixed(2)}` } as Vars}
        />
      ))}
    </div>
  );
}

// Skills: nodes orbiting on concentric rings.
function Orbits() {
  return (
    <div className="orbits">
      <span className="ring" style={{ "--s": "240px", "--dur": "28s" } as Vars}><i /></span>
      <span className="ring" style={{ "--s": "400px", "--dur": "44s" } as Vars}><i /><i className="b" /></span>
      <span className="ring" style={{ "--s": "560px", "--dur": "64s" } as Vars}><i className="b" /></span>
      <span className="ring dashed" style={{ "--s": "720px", "--dur": "90s" } as Vars}><i /></span>
      <span className="core" />
    </div>
  );
}

// Credentials: slow columns of binary drifting down.
function Binary() {
  const rand = seeded(23);
  const cols = 18;
  return (
    <div className="binary">
      {Array.from({ length: cols }, (_, i) => {
        const bits = Array.from({ length: 40 }, () => (rand() > 0.5 ? "1" : "0")).join(" ");
        return (
          <span
            key={i}
            style={
              {
                "--x": `${((i + 0.5) / cols) * 100}%`,
                "--dur": `${22 + Math.round(rand() * 22)}s`,
                "--delay": `${(-rand() * 30).toFixed(1)}s`,
              } as Vars
            }
          >
            {bits} {bits}
          </span>
        );
      })}
    </div>
  );
}

// Contact: chat bubbles rising (some typing "…"), and a signal pinging out.
function Messages() {
  const rand = seeded(42);
  const bubbles = Array.from({ length: 12 }, (_, i) => ({
    x: `${(62 + rand() * 32).toFixed(1)}%`,
    w: `${Math.round(54 + rand() * 90)}px`,
    dur: `${14 + Math.round(rand() * 10)}s`,
    delay: `${(-rand() * 24).toFixed(1)}s`,
    typing: i % 3 === 0,
    mine: i % 2 === 0,
  }));
  return (
    <>
      <div className="ping">
        <span />
        <span />
        <span />
        <i />
      </div>
      {bubbles.map((b, i) => (
        <span
          key={i}
          className={`bubble ${b.mine ? "mine" : ""}`}
          style={{ "--x": b.x, "--w": b.typing ? "52px" : b.w, "--dur": b.dur, "--delay": b.delay } as Vars}
        >
          {b.typing ? (
            <span className="dots">
              <i />
              <i />
              <i />
            </span>
          ) : (
            <span className="lines" />
          )}
        </span>
      ))}
    </>
  );
}
