"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const requestPlayback = () => {
      if (userPausedRef.current || document.hidden) return;
      video.muted = true;
      void video
        .play()
        .then(() => {
          setHasStarted(true);
          setPlaying(true);
        })
        .catch(() => setPlaying(false));
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
        return;
      }
      requestPlayback();
    };

    const handlePageShow = () => requestPlayback();

    video.addEventListener("canplay", requestPlayback);
    video.addEventListener("loadedmetadata", requestPlayback);
    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    requestPlayback();

    if (!("IntersectionObserver" in window)) {
      return () => {
        video.removeEventListener("canplay", requestPlayback);
        video.removeEventListener("loadedmetadata", requestPlayback);
        window.removeEventListener("pageshow", handlePageShow);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          video.pause();
          return;
        }
        requestPlayback();
      },
      { threshold: 0.12 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", requestPlayback);
      video.removeEventListener("loadedmetadata", requestPlayback);
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      try {
        await video.play();
        setHasStarted(true);
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
      return;
    }

    userPausedRef.current = true;
    video.pause();
  }

  return (
    <>
      <video
        aria-hidden="true"
        autoPlay
        className="home-hero__video"
        data-playing={hasStarted || undefined}
        disablePictureInPicture
        loop
        muted
        onError={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlaying={() => {
          setHasStarted(true);
          setPlaying(true);
        }}
        playsInline
        poster="/assets/video/granit-decor-kitchen-orbit-poster.webp"
        preload="auto"
        ref={videoRef}
        tabIndex={-1}
      >
        <source
          media="(max-width: 69.999rem) and (orientation: portrait)"
          src="/assets/video/granit-decor-kitchen-orbit-v3-mobile-parity-810x1440.mp4"
          type="video/mp4"
        />
        <source src="/assets/video/granit-decor-kitchen-orbit-v2-desktop-2560.mp4" type="video/mp4" />
      </video>

      <button
        aria-label={playing ? "Sustabdyti animaciją" : "Paleisti animaciją"}
        className="home-hero__playback"
        data-state={playing ? "playing" : "paused"}
        onClick={togglePlayback}
        type="button"
      >
        {playing ? <Pause aria-hidden="true" size={16} strokeWidth={1.45} /> : <Play aria-hidden="true" size={16} strokeWidth={1.45} />}
      </button>
    </>
  );
}
