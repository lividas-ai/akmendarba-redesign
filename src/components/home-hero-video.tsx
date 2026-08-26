"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

type NetworkInformation = EventTarget & {
  effectiveType?: string;
  saveData?: boolean;
};

export function HomeHeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const resumeAfterVisibilityRef = useRef(false);
  const resumeAfterIntersectionRef = useRef(false);
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;

    const syncMotionPreference = () => {
      const constrainedConnection = Boolean(
        connection?.saveData ||
          connection?.effectiveType === "slow-2g" ||
          connection?.effectiveType === "2g" ||
          connection?.effectiveType === "3g",
      );
      const allowed = !motionQuery.matches && !constrainedConnection;
      if (!allowed) {
        videoRef.current?.pause();
        setPlaying(false);
        setHasStarted(false);
      }
      setMotionAllowed(allowed);
    };

    syncMotionPreference();
    motionQuery.addEventListener("change", syncMotionPreference);
    connection?.addEventListener("change", syncMotionPreference);
    return () => {
      motionQuery.removeEventListener("change", syncMotionPreference);
      connection?.removeEventListener("change", syncMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (!motionAllowed) return;

    const handleVisibilityChange = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        resumeAfterVisibilityRef.current = !video.paused && !userPausedRef.current;
        video.pause();
        return;
      }

      if (resumeAfterVisibilityRef.current && !userPausedRef.current) {
        void video.play().catch(() => setPlaying(false));
      }
      resumeAfterVisibilityRef.current = false;
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [motionAllowed]);

  useEffect(() => {
    if (!motionAllowed) return;
    const video = videoRef.current;
    if (!video || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          resumeAfterIntersectionRef.current = !video.paused && !userPausedRef.current;
          video.pause();
          return;
        }

        if (resumeAfterIntersectionRef.current && !userPausedRef.current && !document.hidden) {
          void video.play().catch(() => setPlaying(false));
        }
        resumeAfterIntersectionRef.current = false;
      },
      { threshold: 0.12 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [motionAllowed]);

  async function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      userPausedRef.current = false;
      try {
        await video.play();
      } catch {
        setPlaying(false);
      }
      return;
    }

    userPausedRef.current = true;
    video.pause();
  }

  if (!motionAllowed) return null;

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
        onPause={() => setPlaying(false)}
        onPlaying={() => {
          setHasStarted(true);
          setPlaying(true);
        }}
        playsInline
        preload="metadata"
        ref={videoRef}
        tabIndex={-1}
      >
        <source
          media="(max-width: 69.999rem) and (orientation: portrait)"
          src="/assets/video/granit-decor-kitchen-orbit-v2-mobile-portrait.mp4"
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
