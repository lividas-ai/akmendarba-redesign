import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHeroVideo } from "@/components/home-hero-video";
import { activeSiteConfig } from "@/client";

export function HomeHero() {
  return (
    <section className="home-hero home-hero--cinematic" aria-labelledby="home-hero-title">
      <figure className="home-hero__media">
        <picture>
          <source
            media="(max-width: 69.999rem) and (orientation: portrait)"
            srcSet="/assets/video/granit-decor-kitchen-orbit-v3-mobile-parity-poster.webp"
            type="image/webp"
          />
          <Image
            className="home-hero__poster"
            src="/assets/video/granit-decor-kitchen-orbit-poster.webp"
            alt={activeSiteConfig.hero.posterAlt}
            fetchPriority="high"
            fill
            loading="eager"
            sizes="100vw"
          />
        </picture>
        <HomeHeroVideo />
      </figure>

      <div className="home-hero__copy">
        <h1 className="home-hero__title" id="home-hero-title">
          {activeSiteConfig.hero.titleLines.map((line) => <span key={line}>{line}</span>)}
        </h1>

        {activeSiteConfig.hero.body ? <p className="home-hero__body">{activeSiteConfig.hero.body}</p> : null}

        <Link className="home-hero__text-action" href={activeSiteConfig.hero.primaryAction.href}>
          <span>{activeSiteConfig.hero.primaryAction.label}</span>
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.45} />
        </Link>
      </div>

      {activeSiteConfig.hero.projectAction ? (
        <Link className="home-hero__project" href={activeSiteConfig.hero.projectAction.href}>
          <span>{activeSiteConfig.hero.projectAction.label}</span>
          <ArrowRight aria-hidden="true" size={16} strokeWidth={1.4} />
        </Link>
      ) : null}
    </section>
  );
}
