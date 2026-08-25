"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function RouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    const scrollToDestination = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const target = hash ? document.getElementById(hash) : null;

      if (target) {
        target.scrollIntoView({ block: "start", behavior: "auto" });
        return;
      }

      if (!hash) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };

    scrollToDestination();

    const frameIds: number[] = [];
    const timeoutIds: number[] = [];

    const resetAcrossFrames = (framesRemaining: number) => {
      const frameId = window.requestAnimationFrame(() => {
        scrollToDestination();
        if (framesRemaining > 1) resetAcrossFrames(framesRemaining - 1);
      });

      frameIds.push(frameId);
    };

    resetAcrossFrames(4);
    timeoutIds.push(window.setTimeout(scrollToDestination, 80));
    timeoutIds.push(window.setTimeout(scrollToDestination, 220));

    return () => {
      frameIds.forEach((frameId) => window.cancelAnimationFrame(frameId));
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [pathname]);

  return null;
}
