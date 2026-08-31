import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { galleryDirectories } from "@/content/akmendarba";

export const metadata: Metadata = {
  title: "Galerija",
  description: "Akmendarba paminklų, kapo dengimų, akmens aksesuarų ir apdailos darbų galerijos.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="ak-index-hero" aria-labelledby="ak-gallery-title">
        <div className="content-shell ak-index-hero__inner">
          <Link className="ak-back-link" href="/">
            <ArrowLeft aria-hidden="true" size={15} strokeWidth={1.4} /> Pradžia
          </Link>
          <Reveal>
            <p className="ak-kicker">Atlikti darbai</p>
            <h1 id="ak-gallery-title">Galerija.</h1>
          </Reveal>
        </div>
      </section>

      <section className="ak-gallery-directory ak-section" aria-label="Galerijų kategorijos">
        <div className="content-shell ak-gallery-directory__grid">
          {galleryDirectories.map((directory, index) => (
            <Reveal delay={(index % 2) * 0.07} key={directory.id}>
              <Link className="ak-gallery-directory__card" href={directory.href}>
                <figure>
                  <Image
                    alt={directory.alt}
                    fill
                    loading={index < 2 ? "eager" : "lazy"}
                    sizes="(min-width: 64rem) 50vw, 100vw"
                    src={directory.image}
                  />
                </figure>
                <div>
                  <h2>{directory.title}</h2>
                  <ArrowUpRight aria-hidden="true" size={22} strokeWidth={1.35} />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
