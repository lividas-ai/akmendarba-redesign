import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GalleryLightbox, type AkGalleryItem } from "@/components/content/akmendarba/gallery-lightbox";
import { Reveal } from "@/components/reveal";
import {
  accessoryGallery,
  finishGallery,
  graveCoveringDedicatedGallery,
  monumentMultiPiece,
  monumentOnePiece,
} from "@/content/akmendarba";

type GalleryPageProps = { params: Promise<{ slug: string }> };

const galleryPages = {
  "paminklu-galerija": {
    title: "Paminklų galerija",
    eyebrow: "Paminklai",
    groups: [
      { title: "Vienos dalies paminklai", items: monumentOnePiece },
      { title: "Kelių dalių paminklai", items: monumentMultiPiece },
    ],
  },
  "kapo-dengimu-galerija": {
    title: "Kapo dengimų galerija",
    eyebrow: "Granito plokštės",
    groups: [{ title: "Kapo dengimai", items: graveCoveringDedicatedGallery }],
  },
  "aksesuaru-galerija": {
    title: "Aksesuarų galerija",
    eyebrow: "Akmens atributika",
    groups: [{ title: "Aksesuarai", items: accessoryGallery }],
  },
  "apdailos-galerija": {
    title: "Apdailos galerija",
    eyebrow: "Vidaus ir išorės apdaila",
    groups: [{ title: "Apdaila", items: finishGallery }],
  },
} as const;

type GallerySlug = keyof typeof galleryPages;

function isGallerySlug(value: string): value is GallerySlug {
  return value in galleryPages;
}

export function generateStaticParams() {
  return Object.keys(galleryPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: GalleryPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isGallerySlug(slug)) return {};
  return { title: galleryPages[slug].title };
}

export default async function GalleryDetailPage({ params }: GalleryPageProps) {
  const { slug } = await params;
  if (!isGallerySlug(slug)) notFound();
  const gallery = galleryPages[slug];

  return (
    <>
      <section className="ak-index-hero" aria-labelledby="ak-gallery-detail-title">
        <div className="content-shell ak-index-hero__inner">
          <Link className="ak-back-link" href="/galerija">
            <ArrowLeft aria-hidden="true" size={15} strokeWidth={1.4} /> Galerija
          </Link>
          <Reveal>
            <p className="ak-kicker">{gallery.eyebrow}</p>
            <h1 id="ak-gallery-detail-title">{gallery.title}.</h1>
          </Reveal>
        </div>
      </section>

      {gallery.groups.map((group, groupIndex) => (
        <section className="ak-gallery-section ak-section" aria-labelledby={`gallery-group-${groupIndex}`} key={group.title}>
          <div className="content-shell">
            <Reveal className="ak-gallery-section__heading">
              <h2 id={`gallery-group-${groupIndex}`}>{group.title}</h2>
            </Reveal>
            <GalleryLightbox items={group.items as readonly AkGalleryItem[]} />
          </div>
        </section>
      ))}
    </>
  );
}
