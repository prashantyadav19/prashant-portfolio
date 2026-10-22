"use client";

import { useState } from "react";
import { content } from "@/content";

const introVideo = content.introVideo;

// Click-to-load player: nothing from YouTube loads until the visitor presses play,
// which keeps the page fast. Uses `youtubeId` if set, otherwise the `mp4` file.
export default function IntroVideo() {
  const [playing, setPlaying] = useState(false);
  const { youtubeId, mp4, poster, title, duration } = introVideo;
  const autoPoster = youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` : "";
  const posterSrc = poster || autoPoster;

  return (
    <div className="video-dots relative aspect-video max-w-full overflow-hidden rounded-[10px] border border-line">
      {playing ? (
        youtubeId ? (
          <iframe
            className="absolute inset-0 size-full border-0 bg-black"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video className="absolute inset-0 size-full bg-black" src={mp4} poster={poster || undefined} controls autoPlay playsInline />
        )
      ) : (
        <button
          className="group absolute inset-0 grid size-full cursor-pointer place-items-center border-0 bg-transparent p-0 text-ink"
          type="button" onClick={() => setPlaying(true)} aria-label={`${introVideo.playLabel}: ${title}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {posterSrc && <img className="absolute inset-0 size-full object-cover" src={posterSrc} alt="" />}
          <span className="play relative grid size-19 place-items-center rounded-full bg-accent" aria-hidden="true" />
          <span className="absolute right-4 bottom-3.5 left-4 flex items-end justify-between gap-3 text-left">
            <strong className="rounded-md bg-surface px-2.5 py-1 font-display text-lede">{title}</strong>
            <span className="rounded-md bg-surface px-2 py-1 font-mono text-xs text-muted">{duration || introVideo.eyebrow}</span>
          </span>
        </button>
      )}
    </div>
  );
}
