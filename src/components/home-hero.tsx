import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomeHeroVideo } from "@/components/home-hero-video";
import { siteCopy } from "@/data/content";

export function HomeHero() {
  return (
    <section className="home-hero home-hero--cinematic" aria-labelledby="home-hero-title">
      <figure className="home-hero__media">
        <Image
          className="home-hero__poster"
          src="/assets/video/granit-decor-kitchen-orbit-poster.webp"
          alt="Granit Decor virtuvė su lenkta natūralaus akmens sala, akmens sienų apdaila ir individualiai gamintais baldais"
          fill
          loading="eager"
          priority
          sizes="100vw"
        />
        <HomeHeroVideo />
      </figure>

      <div className="home-hero__copy">
        <h1 className="home-hero__title" id="home-hero-title">
          <span>Akmens sprendimai</span>
          <span>jūsų erdvei.</span>
        </h1>

        <p className="home-hero__body">{siteCopy.hero.body}</p>

        <Link className="home-hero__text-action" href={siteCopy.hero.primaryAction.href}>
          <span>{siteCopy.hero.primaryAction.label}</span>
          <ArrowRight aria-hidden="true" size={17} strokeWidth={1.45} />
        </Link>
      </div>

      <Link className="home-hero__project" href="/projektai">
        <span>Lenkta akmens sala</span>
        <ArrowRight aria-hidden="true" size={16} strokeWidth={1.4} />
      </Link>
    </section>
  );
}
