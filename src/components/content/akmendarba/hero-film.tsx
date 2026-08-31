"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const heroVideo = "/client/akmendarba/hero/akmendarba-granite-cutting-desktop-web-v1.m4v";
const heroVideoMobile = "/client/akmendarba/hero/akmendarba-granite-cutting-mobile-web-v1.m4v";
const heroPoster = "/client/akmendarba/hero/akmendarba-granite-cutting-source-v1.png";

export function AkmendarbaHeroFilm() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const attemptPlayback = () => {
      if (!paused) void video.play().catch(() => undefined);
    };

    attemptPlayback();
    window.addEventListener("pageshow", attemptPlayback);
    document.addEventListener("visibilitychange", attemptPlayback);

    return () => {
      window.removeEventListener("pageshow", attemptPlayback);
      document.removeEventListener("visibilitychange", attemptPlayback);
    };
  }, [paused]);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play().then(() => setPaused(false)).catch(() => undefined);
      return;
    }

    video.pause();
    setPaused(true);
  }

  return (
    <section className="ak-hero" aria-labelledby="ak-hero-title">
      <video
        aria-hidden="true"
        autoPlay
        className="ak-hero__video"
        disablePictureInPicture
        loop
        muted
        playsInline
        poster={heroPoster}
        preload="auto"
        ref={videoRef}
      >
        <source media="(max-width: 767px)" src={heroVideoMobile} type="video/mp4" />
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="ak-hero__veil" />

      <div className="ak-hero__content content-shell">
        <div className="ak-hero__copy">
          <p className="ak-kicker">Akmens apdirbimas · Šiauliai</p>
          <h1 id="ak-hero-title">Natūralaus akmens gaminiai.</h1>
          <p>Projektuojame, gaminame ir montuojame Šiauliuose bei visoje Lietuvoje.</p>
          <div className="ak-hero__actions">
            <Link className="ak-button ak-button--light" href="/paminklai">
              Mūsų produkcija <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.4} />
            </Link>
            <Link className="ak-text-link ak-text-link--light" href="/kontaktai">
              Susisiekti
            </Link>
          </div>
        </div>

        <div className="ak-hero__controls">
          <a href="#paslaugos" aria-label="Toliau į paslaugas">
            <ArrowDown aria-hidden="true" size={18} strokeWidth={1.35} />
          </a>
          <button
            aria-label={paused ? "Paleisti vaizdo įrašą" : "Sustabdyti vaizdo įrašą"}
            onClick={togglePlayback}
            type="button"
          >
            {paused ? <Play aria-hidden="true" size={16} /> : <Pause aria-hidden="true" size={16} />}
          </button>
        </div>
      </div>
    </section>
  );
}
