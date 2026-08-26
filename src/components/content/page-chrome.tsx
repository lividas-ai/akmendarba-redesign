import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Reveal } from "@/components/reveal";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: readonly BreadcrumbItem[];
  inverse?: boolean;
};

export function Breadcrumbs({ items, inverse = false }: BreadcrumbsProps) {
  return (
    <nav className="content-breadcrumbs" data-inverse={inverse || undefined} aria-label="Kelias puslapyje">
      <ol>
        <li>
          <Link href="/">Pradžia</Link>
        </li>
        {items.map((item) => (
          <li key={`${item.href ?? "current"}-${item.label}`}>
            <span aria-hidden="true">/</span>
            {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

type EditorialHeroProps = {
  eyebrow: string;
  title: string;
  body?: string;
  breadcrumbs: readonly BreadcrumbItem[];
  image?: string;
  imageAlt?: string;
  caption?: string;
  folio?: string;
  tone?: "light" | "inverse" | "clay";
  imagePosition?: string;
  imageRatio?: "portrait" | "vertical" | "square" | "classic" | "landscape" | "wide";
  children?: React.ReactNode;
};

export function EditorialHero({
  eyebrow,
  title,
  body,
  breadcrumbs,
  image,
  imageAlt = "",
  tone = "light",
  imagePosition,
  imageRatio = "landscape",
  children,
}: EditorialHeroProps) {
  const inverse = tone === "inverse";

  return (
    <header className={`content-hero content-hero--${tone}${image ? " content-hero--with-media" : ""}`}>
      <div className="content-hero__copy content-shell">
        <Breadcrumbs items={breadcrumbs} inverse={inverse} />
        <Reveal className="content-hero__heading" y={18}>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {body ? <p>{body}</p> : null}
          {children ? <div className="content-hero__actions">{children}</div> : null}
        </Reveal>
      </div>

      {image ? (
        <figure className="content-hero__media" data-ratio={imageRatio}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            loading="eager"
            priority
            sizes="(min-width: 64rem) 52vw, 86vw"
            style={imagePosition ? { objectPosition: imagePosition } : undefined}
          />
        </figure>
      ) : null}
    </header>
  );
}

type EditorialCtaProps = {
  eyebrow?: string;
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tone?: "light" | "inverse";
};

export function EditorialCta({
  eyebrow = "Jūsų projektas",
  title,
  body,
  actionLabel = "Parengti projekto planą",
  actionHref = "/projektas",
  secondaryLabel,
  secondaryHref,
  tone = "inverse",
}: EditorialCtaProps) {
  return (
    <section className={`content-cta content-cta--${tone}`} aria-label="Kitas žingsnis">
      <div className="content-shell content-cta__grid">
        <Reveal className="content-cta__copy">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </Reveal>
        <Reveal className="content-cta__action" delay={0.1}>
          <p>{body}</p>
          <div>
            <ButtonLink href={actionHref} variant={tone === "inverse" ? "inverse" : "primary"}>
              {actionLabel}
            </ButtonLink>
            {secondaryLabel && secondaryHref ? (
              <Link className="text-link" href={secondaryHref}>
                {secondaryLabel} <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

type ImageSpreadProps = {
  primary: { src: string; alt: string; caption?: string };
  secondary: { src: string; alt: string; caption?: string };
};

export function ImageSpread({ primary, secondary }: ImageSpreadProps) {
  return (
    <div className="image-spread content-shell">
      <Reveal className="image-spread__primary">
        <figure>
          <Image src={primary.src} alt={primary.alt} fill sizes="(min-width: 48rem) 65vw, 74vw" />
        </figure>
      </Reveal>
      <Reveal className="image-spread__secondary" delay={0.12} y={18}>
        <figure>
          <Image src={secondary.src} alt={secondary.alt} fill sizes="(min-width: 48rem) 32vw, 74vw" />
        </figure>
      </Reveal>
    </div>
  );
}
