// Loads content.json and gives it types. Edit content.json, not this file.
// If you change the shape of content.json (rename or remove a field), the build
// will report exactly which field is wrong.
import data from "./content.json";

type Link = { label: string; url: string };
type Metric = { value: string; label: string };

export type CaseStudy = {
  context: string;
  title: string;
  summary: string;
  stack: string[];
  metrics: Metric[];
  pipeline: { step: string; detail: string }[];
  pipelineNote: string;
  details: string[];
};

export type EarlierProject = {
  context: string;
  title: string;
  kind: string;
  summary: string;
  metrics: Metric[];
  stack: string[];
};

export type Skill = { name: string; note: string; also: string[] };

export type Content = {
  site: { url: string; title: string; description: string; footer: string };
  nav: { intro: string; work: string; experience: string; skills: string; contact: string; ariaLabel: string };
  profile: {
    name: string;
    status: string;
    photo: string;
    photoAlt: string;
    email: string;
    resume: { label: string; file: string };
    links: Link[];
  };
  hero: {
    eyebrow: string;
    tagline: string;
    intro: string;
    ctaLabel: string;
    hint: string;
    backgroundImage: string;
    trace: { label: string; root: string; title: string; ariaLabel: string; running: string; now: string };
    career: { company: string; start: string; end: string; projects: string; color: string }[];
  };
  introVideo: {
    eyebrow: string;
    youtubeId: string;
    mp4: string;
    poster: string;
    playLabel: string;
    title: string;
    duration: string;
    heading: string;
    summary: string;
    topics: string[];
  };
  work: {
    eyebrow: string;
    heading: string;
    intro: string;
    detailsLabel: string;
    modal: { close: string; results: string; flow: string; approach: string; stack: string };
    caseStudies: CaseStudy[];
    earlier: { heading: string; context: string; projects: EarlierProject[] };
  };
  experience: {
    eyebrow: string;
    heading: string;
    roles: { when: string; title: string; company: string; summary: string }[];
  };
  skills: {
    eyebrow: string;
    heading: string;
    hint: string;
    legend: string;
    usedIn: string;
    and: string;
    notUsed: string;
    groups: { group: string; skills: Skill[] }[];
  };
  credentials: {
    eyebrow: string;
    heading: string;
    certifications: { name: string; issuer: string }[];
    education: { name: string; issuer: string }[];
  };
  contact: {
    eyebrow: string;
    heading: string;
    text: string;
    backgroundImage: string;
    copyLabel: string;
    copiedLabel: string;
    selectedLabel: string;
  };
};

export const content: Content = data;
