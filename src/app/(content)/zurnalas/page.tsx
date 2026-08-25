import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EditorialCta, EditorialHero } from "@/components/content/page-chrome";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Akmens pasirinkimas ir priežiūra",
  description:
    "Praktiniai Granit Decor gidai apie natūralaus akmens pasirinkimą, virtuvės stalviršio planavimą ir kasdienę paviršių priežiūrą.",
};

const articles = [
  {
    slug: "naturalaus-akmens-prieziura",
    category: "Priežiūra",
    title: "Kaip prižiūrėti natūralų akmenį",
    excerpt:
      "Kasdienis valymas, priemonės, kurių verta vengti, ir kada kreiptis į specialistą.",
    image: "/assets/portfolio/vonios-baldai-stalvirsiai-dvylika.webp",
    alt: "Natūralaus akmens paviršius Granit Decor įrengtoje vonios erdvėje.",
  },
  {
    slug: "kaip-rinktis-virtuves-stalvirsi",
    category: "Pasirinkimas",
    title: "Kaip rinktis akmenį virtuvės stalviršiui",
    excerpt:
      "Naudojimas, virtuvės planas, įranga, rašto mastelis ir priežiūra prieš pasirenkant plokštę.",
    image: "/assets/portfolio/virtuves-baldai-stalvirsiai-trisdesimt-keturi.webp",
    alt: "Natūralaus akmens stalviršis Granit Decor įrengtoje virtuvėje.",
  },
] as const;

export default function JournalPage() {
  return (
    <>
      <EditorialHero
        breadcrumbs={[{ label: "Žurnalas" }]}
        eyebrow="Žurnalas"
        folio="Gidai"
        title="Akmens pasirinkimo ir priežiūros gidai."
        body="Praktinė informacija apie medžiagos pasirinkimą, projekto planavimą ir kasdienę priežiūrą."
        image="/assets/materials/patagonia.webp"
        imageAlt="Kontrastingo Patagonia natūralaus akmens paviršiaus fragmentas."
        imageRatio="square"
        caption="Akmens kolekcijos fragmentas"
      />

      <section className="journal-index section" aria-labelledby="journal-index-title">
        <div className="content-shell journal-index__heading">
          <Reveal>
            <h2 id="journal-index-title">Praktinė informacija vienoje vietoje.</h2>
          </Reveal>
        </div>

        <div className="content-shell journal-index__grid">
          {articles.map((article, index) => (
            <Reveal delay={index * 0.08} key={article.slug}>
              <Link className="journal-card" href={`/zurnalas/${article.slug}`}>
                <figure>
                  <Image src={article.image} alt={article.alt} fill sizes="(min-width: 48rem) 50vw, 100vw" />
                </figure>
                <div>
                  <span>{article.category}</span>
                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>
                  <span className="journal-card__link">
                    Skaityti gidą <ArrowUpRight aria-hidden="true" size={16} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <EditorialCta
        title="Turite klausimą apie konkretų paviršių?"
        body="Nurodykite akmens pavadinimą, paviršiaus vietą ir klausimą. Jei galite, pridėkite nuotrauką."
        actionLabel="Susisiekti"
        actionHref="/kontaktai"
        secondaryLabel="Akmens kolekcija"
        secondaryHref="/akmuo"
      />
    </>
  );
}
