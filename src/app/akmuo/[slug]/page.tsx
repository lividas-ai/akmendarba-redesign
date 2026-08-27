import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { materialCategories } from "@/client/content";
import { materials } from "@/client/materials";
import { MaterialDetailActions } from "@/components/materials/material-detail-actions";
import { RelatedMaterials } from "@/components/materials/related-materials";

type MaterialDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return materials.map((material) => ({ slug: material.slug }));
}

export async function generateMetadata({ params }: MaterialDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const material = materials.find((item) => item.slug === slug);
  if (!material) return {};

  const category = materialCategories.find((item) => item.id === material.category);

  return {
    title: `${material.name} · ${category?.name ?? "Natūralus akmuo"}`,
    description: `${material.name} — ${category?.name.toLocaleLowerCase("lt-LT") ?? "natūralaus akmens"} kolekcijos vaizdas. Išsaugokite šį variantą savo projektui.`,
    openGraph: {
      title: `${material.name} | Granit Decor`,
      description: "Natūralaus akmens kolekcijos vaizdas projekto atrankai.",
      images: [{ url: material.localPath, alt: `${material.name} akmens katalogo vaizdas` }],
    },
  };
}

export default async function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  const { slug } = await params;
  const material = materials.find((item) => item.slug === slug);
  if (!material) notFound();

  const category = materialCategories.find((item) => item.id === material.category);
  if (!category) notFound();

  const related = materials
    .filter((item) => item.category === material.category && item.slug !== material.slug)
    .sort((left, right) => Number(right.featured) - Number(left.featured) || left.name.localeCompare(right.name, "lt-LT"))
    .slice(0, 4);

  return (
    <article className="material-detail-page">
      <header className="material-detail-hero">
        <figure className="material-detail-hero__media">
          <Image
            alt={`${material.name} akmens katalogo vaizdas`}
            fill
            loading="eager"
            priority
            sizes="(min-width: 64rem) 58vw, 100vw"
            src={material.localPath}
          />
          <figcaption>Kolekcijos vaizdas · konkreti plokštė gali skirtis</figcaption>
        </figure>

        <div className="material-detail-hero__content">
          <nav className="material-breadcrumb" aria-label="Naršymo kelias">
            <Link href="/akmuo">
              <ArrowLeft aria-hidden="true" size={15} />
              Akmens kolekcija
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/akmuo?tipas=${material.category}`}>{category.name}</Link>
          </nav>

          <div className="material-detail-hero__identity">
            <p className="eyebrow">{category.name}</p>
            <h1>{material.name}</h1>
            <p className="material-detail-hero__character">{category.visualCharacter}</p>
          </div>

          <MaterialDetailActions name={material.name} slug={material.slug} />

          <aside className="material-variation-note material-detail-hero__notice">
            <strong>Kiekviena plokštė yra skirtinga.</strong>
            <span>
              Atspalvį, gyslų kryptį ir rašto mastelį tikriname pagal konkrečią projektui skirtą plokštę.
            </span>
          </aside>
        </div>
      </header>

      <section className="material-reading section" aria-labelledby="material-reading-title">
        <div className="content-shell material-reading__grid">
          <header>
            <h2 id="material-reading-title">Kaip vertinti akmens vaizdą.</h2>
          </header>

          <div className="material-reading__copy">
            <p>{category.description}</p>
            <dl>
              <div>
                <dt>Katalogo pavadinimas</dt>
                <dd>{material.name}</dd>
              </div>
              <div>
                <dt>Akmens rūšis</dt>
                <dd>{category.name}</dd>
              </div>
              <div>
                <dt>Šiame puslapyje</dt>
                <dd>Vienas kolekcijos vaizdas</dd>
              </div>
            </dl>
            <p className="material-reading__disclosure">
              Kilmę, apdailą, matmenis, prieinamumą ir tinkamumą jūsų gaminiui patvirtiname projekto aptarimo metu.
            </p>
          </div>
        </div>
      </section>

      <RelatedMaterials categoryName={category.name} materials={related} />
    </article>
  );
}
