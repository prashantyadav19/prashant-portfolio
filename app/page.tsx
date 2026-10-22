import CareerTrace from "@/components/CareerTrace";
import CaseStudyModal from "@/components/CaseStudyModal";
import CopyEmail from "@/components/CopyEmail";
import EmbeddingField from "@/components/EmbeddingField";
import IntroVideo from "@/components/IntroVideo";
import PointerGlow from "@/components/PointerGlow";
import SectionBackdrop from "@/components/SectionBackdrop";
import SkillsExplorer from "@/components/SkillsExplorer";
import { slug } from "@/lib/slug";
import { btn, btnPrimary, chip, glass, h2, section, sectionHead, sectionInner } from "@/components/ui";
import { content } from "@/content";

const { site, nav, profile, hero, introVideo, work, experience, skills, credentials, contact } = content;

// Rebuild the page once a day so the career timeline stays current.
export const revalidate = 86400;

function Tagline({ text }: { text: string }) {
  // Turns "*highlighted words*" into accent-colored text.
  const parts = text.split(/\*(.+?)\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <em key={i} className="text-accent not-italic">
            {p}
          </em>
        ) : (
          p
        ),
      )}
    </>
  );
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default function Home() {
  const hasVideo = Boolean(introVideo.youtubeId || introVideo.mp4);

  return (
    <>
      <PointerGlow />
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-5 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="wrap flex items-center justify-between gap-4 py-3.5">
          <a className="font-display text-lede font-bold no-underline" href="#top">
            {profile.name}
            <span className="text-accent">.</span>
          </a>
          <nav className="flex flex-wrap gap-3.5 text-[0.9375rem] sm:gap-5" aria-label={nav.ariaLabel}>
            {hasVideo && (
              <a className="hidden text-muted no-underline hover:text-ink sm:inline" href="#intro">{nav.intro}</a>
            )}
            <a className="text-muted no-underline hover:text-ink" href="#work">{nav.work}</a>
            <a className="hidden text-muted no-underline hover:text-ink sm:inline" href="#experience">{nav.experience}</a>
            <a className="hidden text-muted no-underline hover:text-ink sm:inline" href="#skills">{nav.skills}</a>
            <a className="text-muted no-underline hover:text-ink" href="#contact">{nav.contact}</a>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* ── Hero ── */}
        <section className="on-dark relative isolate overflow-hidden bg-paper text-ink">
          {hero.backgroundImage && (
            <div className="hero-bg" style={{ backgroundImage: `url(${hero.backgroundImage})` }} aria-hidden="true" />
          )}
          <EmbeddingField seed={7} />
          <div className="wrap relative z-1 grid items-center gap-12 pt-18 pb-16 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] xl:pt-24 xl:pb-22">
            <div className="grid min-w-0 gap-5.5">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.photo}
                  alt={profile.photoAlt}
                  width={92}
                  height={92}
                  className="size-19 flex-none rounded-full object-cover shadow-[0_0_0_3px_var(--paper),0_0_0_5px_var(--accent)] xl:size-23"
                />
                <div className="grid min-w-0 gap-0.5">
                  <strong className="font-display text-lede font-semibold">{profile.name}</strong>
                  <span className="status font-mono text-caption text-muted">{profile.status}</span>
                </div>
              </div>
              <p className="eyebrow">{hero.eyebrow}</p>
              <h1 className="text-display leading-[1.05] font-bold">
                <Tagline text={hero.tagline} />
              </h1>
              <p className="max-w-[34em] text-lede text-muted">{hero.intro}</p>
              <div className="flex flex-wrap gap-2.5">
                <a className={btnPrimary} href="#contact">{hero.ctaLabel}</a>
                {profile.links.map((l) => (
                  <a key={l.url} className={`${btn} ${glass}`} href={l.url} {...external}>{l.label}</a>
                ))}
                {profile.resume.file && (
                  <a className={`${btn} ${glass}`} href={profile.resume.file} {...external}>{profile.resume.label}</a>
                )}
              </div>
              <p className="field-hint font-mono text-[0.72rem] text-muted">{hero.hint}</p>
            </div>
            <CareerTrace />
          </div>
        </section>

        {/* ── Intro video ── */}
        {hasVideo && (
          <section className={`${section} relative isolate overflow-hidden`} id="intro">
            <div className={sectionInner}>
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:gap-12">
                <IntroVideo />
                <div className="grid min-w-0 gap-3.5">
                  <p className="eyebrow">{introVideo.eyebrow}</p>
                  <h2 className={h2}>{introVideo.heading}</h2>
                  <p className="text-muted">{introVideo.summary}</p>
                  <ol className="grid list-none gap-2.5">
                    {introVideo.topics.map((t, i) => (
                      <li key={t} className="grid grid-cols-[3.2em_minmax(0,1fr)] gap-2 border-t border-line pt-2.5">
                        <span className="pt-0.5 font-mono text-caption text-accent tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {t}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Selected work ── */}
        <section className={`${section} relative isolate overflow-hidden`} id="work" data-glow>
          <SectionBackdrop variant="aurora" />
          <EmbeddingField seed={21} density={0.7} k={5} label={false} />
          <div className={`${sectionInner} relative z-1`}>
            <div className={sectionHead}>
              <p className="eyebrow">{work.eyebrow}</p>
              <h2 className={h2}>{work.heading}</h2>
              <p className="text-muted">{work.intro}</p>
            </div>

            <div className="grid gap-5">
              {work.caseStudies.map((c) => (
                <article
                  key={c.title}
                  id={slug(c.title)}
                  className="grid scroll-mt-24 gap-5.5 rounded-[10px] border border-line bg-surface p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_20px_50px_-30px_var(--accent)] xs:p-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-x-10"
                >
                  <div className="grid min-w-0 content-start gap-3">
                    <p className="eyebrow">{c.context}</p>
                    <h3 className="text-h3 leading-tight font-bold">{c.title}</h3>
                    <p className="max-w-[40em] text-muted">{c.summary}</p>
                    <ul className="flex list-none flex-wrap gap-1.5">
                      {c.stack.map((s) => (
                        <li className={chip} key={s}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <ul className="grid list-none content-start gap-3.5">
                    {c.metrics.map((m) => (
                      <li key={m.label} className="grid gap-0.5 border-l-2 border-accent pl-3.5">
                        <span className="font-display text-h3 leading-tight font-semibold tabular-nums">{m.value}</span>
                        <span className="text-[0.9375rem] text-muted">{m.label}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="col-span-full border-t border-line pt-4">
                    <CaseStudyModal study={c} />
                  </div>
                </article>
              ))}
            </div>

            <div className="grid gap-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-3">
                <h3 className="text-lede font-bold">{work.earlier.heading}</h3>
                <span className="eyebrow">{work.earlier.context}</span>
              </div>
              <div className={`grid gap-5 ${work.earlier.projects.length > 1 ? "md:grid-cols-2" : ""}`}>
                {work.earlier.projects.map((p) => (
                  <article
                    key={p.title}
                    id={slug(p.title)}
                    className="group grid scroll-mt-24 content-start gap-4 rounded-[10px] border border-line bg-surface p-5 transition duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-[0_20px_50px_-30px_var(--accent)] xs:p-6"
                  >
                    <div className="grid gap-1">
                      <h4 className="font-display text-h3 leading-tight font-bold group-hover:text-accent">{p.title}</h4>
                      <p className="font-mono text-caption text-muted">{p.kind}</p>
                    </div>
                    <p className="text-muted">{p.summary}</p>
                    <ul className="flex list-none flex-wrap gap-px overflow-hidden rounded-lg border border-line bg-line">
                      {p.metrics.map((m) => (
                        <li key={m.label} className="grid flex-1 basis-[110px] content-start gap-0.5 bg-paper px-3 py-3">
                          <span className="font-display text-xl leading-tight font-semibold tabular-nums">{m.value}</span>
                          <span className="text-xs leading-snug text-muted">{m.label}</span>
                        </li>
                      ))}
                    </ul>
                    <ul className="flex list-none flex-wrap gap-1.5">
                      {p.stack.map((t) => (
                        <li className={chip} key={t}>{t}</li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Experience ── */}
        <section className={`${section} relative isolate overflow-hidden`} id="experience" data-glow>
          <SectionBackdrop variant="commits" />
          <div className={sectionInner}>
            <div className={sectionHead}>
              <p className="eyebrow">{experience.eyebrow}</p>
              <h2 className={h2}>{experience.heading}</h2>
            </div>
            <ol className="timeline grid list-none">
              {experience.roles.map((r) => (
                <li
                  key={r.company}
                  className="grid gap-x-8 gap-y-1.5 border-b border-line py-5.5 first:pt-0 md:grid-cols-[13em_minmax(0,1fr)]"
                >
                  <span className="pt-1 font-mono text-caption text-muted tabular-nums">{r.when}</span>
                  <div>
                    <h3 className="text-lede font-bold">
                      {r.title} <span className="font-medium text-muted">· {r.company}</span>
                    </h3>
                    <p className="mt-1 max-w-[44em] text-muted">{r.summary}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Skills ── */}
        <section className={`${section} relative isolate overflow-hidden`} id="skills" data-glow>
          <SectionBackdrop variant="orbits" />
          <div className={sectionInner}>
            <div className={sectionHead}>
              <p className="eyebrow">{skills.eyebrow}</p>
              <h2 className={h2}>{skills.heading}</h2>
            </div>
            <SkillsExplorer />
          </div>
        </section>

        {/* ── Credentials ── */}
        <section className={`${section} relative isolate overflow-hidden`} id="credentials" data-glow>
          <SectionBackdrop variant="binary" />
          <div className={sectionInner}>
            <div className={sectionHead}>
              <p className="eyebrow">{credentials.eyebrow}</p>
              <h2 className={h2}>{credentials.heading}</h2>
            </div>
            <div className="grid items-start gap-7 md:grid-cols-[2fr_1fr]">
              {[credentials.certifications, credentials.education].map((list, i) => (
                <ul key={i} className="grid list-none gap-3">
                  {list.map((c) => (
                    <li key={c.name} className="grid gap-0.5 rounded-lg border border-line bg-surface px-4 py-3.5">
                      <strong>{c.name}</strong>
                      <span className="text-[0.9375rem] text-muted">{c.issuer}</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className={`${section} on-dark relative isolate overflow-hidden bg-paper text-ink`} id="contact" data-glow>
          {contact.backgroundImage && (
            <div className="hero-bg contact-bg" style={{ backgroundImage: `url(${contact.backgroundImage})` }} aria-hidden="true" />
          )}
          <SectionBackdrop variant="messages" />
          <div className="wrap relative z-1 grid gap-5.5 py-22">
            <p className="eyebrow">{contact.eyebrow}</p>
            <h2 className="text-display leading-[1.05] font-bold">{contact.heading}</h2>
            <p className="max-w-[36em] text-lede text-muted">{contact.text}</p>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                id="email"
                href={`mailto:${profile.email}`}
                className="min-w-0 rounded-lg border border-line bg-surface px-3.5 py-2.5 font-mono text-lede wrap-anywhere no-underline select-all"
              >
                {profile.email}
              </a>
              <CopyEmail
                email={profile.email}
                labels={{ copy: contact.copyLabel, copied: contact.copiedLabel, selected: contact.selectedLabel }}
              />
              {profile.links.map((l) => (
                <a key={l.url} className={btn} href={l.url} {...external}>{l.label}</a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="wrap flex flex-wrap justify-between gap-3 py-6 text-caption text-muted">
          <span>
            © {new Date().getFullYear()} {profile.name}
          </span>
          <span>{site.footer}</span>
        </div>
      </footer>
    </>
  );
}
