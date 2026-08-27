import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import type { ComponentType } from "react";
import { HomeHero } from "@/components/home-hero";
import { Reveal } from "@/components/reveal";
import type {
  Action,
  ActionTarget,
  Block,
  JsonValue,
  MediaAsset,
  PageRecord,
  SiteManifest,
} from "@/template/schema";

export type ManifestFunctionRenderer = ComponentType<{ config: JsonValue }>;
export type ManifestFunctionRegistry = Readonly<Record<string, ManifestFunctionRenderer>>;

type ManifestPageRendererProps = {
  manifest: SiteManifest;
  pageId: string;
  functions?: ManifestFunctionRegistry;
};

function publishedBlocks(page: PageRecord) {
  return page.blocks.filter((block) => block.publication === "published");
}

function pageForTarget(manifest: SiteManifest, target: ActionTarget) {
  if (target.kind === "page") {
    return manifest.pages.find((page) => page.id === target.pageId)?.path;
  }
  if (target.kind === "function") {
    return manifest.pages.find((page) =>
      publishedBlocks(page).some(
        (block) => block.type === "function" && block.data.functionId === target.functionId,
      ),
    )?.path;
  }
  return target.url;
}

function ManifestAction({ action, manifest }: { action: Action; manifest: SiteManifest }) {
  const href = pageForTarget(manifest, action.target);
  if (!href) return null;

  const content = (
    <>
      <span>{action.label.value}</span>
      <ArrowRight aria-hidden="true" size={16} strokeWidth={1.45} />
    </>
  );

  return action.target.kind === "external" ? (
    <a className="manifest-action" href={href} rel="noreferrer" target="_blank">
      {content}
    </a>
  ) : (
    <Link className="manifest-action" href={href}>
      {content}
    </Link>
  );
}

function mediaById(manifest: SiteManifest, mediaId: string) {
  return manifest.media.find((media) => media.id === mediaId);
}

function ManifestMedia({ asset, eager = false }: { asset: MediaAsset; eager?: boolean }) {
  const primary = asset.variants[0];
  const alt = asset.alt?.value ?? "";

  if (asset.kind === "image" || asset.kind === "logo") {
    return (
      <figure className="manifest-media" data-kind={asset.kind}>
        <Image
          alt={alt}
          fill
          loading={eager ? "eager" : undefined}
          priority={eager}
          sizes="(min-width: 75rem) 50vw, (min-width: 48rem) 72vw, 92vw"
          src={primary.src}
        />
      </figure>
    );
  }

  if (asset.kind === "video") {
    return (
      <figure className="manifest-media" data-kind="video">
        <video controls playsInline preload="metadata">
          {asset.variants.map((variant) => (
            <source key={`${variant.src}-${variant.mimeType}`} src={variant.src} type={variant.mimeType} />
          ))}
        </video>
      </figure>
    );
  }

  if (asset.kind === "audio") {
    return <audio className="manifest-audio" controls preload="metadata" src={primary.src} />;
  }

  return (
    <a className="manifest-download" download href={primary.src}>
      <Download aria-hidden="true" size={18} strokeWidth={1.45} />
      <span>{asset.alt?.value ?? primary.src.split("/").at(-1) ?? "Download"}</span>
    </a>
  );
}

function ManifestBlock({
  block,
  manifest,
  functions,
}: {
  block: Block;
  manifest: SiteManifest;
  functions: ManifestFunctionRegistry;
}) {
  switch (block.type) {
    case "hero": {
      const media = block.data.mediaId ? mediaById(manifest, block.data.mediaId) : undefined;
      return (
        <header className="manifest-page__hero">
          <div className="content-shell manifest-page__hero-grid">
            <Reveal className="manifest-page__hero-copy">
              {block.data.eyebrow ? <span className="manifest-kicker">{block.data.eyebrow.value}</span> : null}
              <h1>{block.data.heading.value}</h1>
              {block.data.body ? <p>{block.data.body.value}</p> : null}
              {block.data.actions ? (
                <div className="manifest-actions">
                  {block.data.actions.map((action) => (
                    <ManifestAction action={action} key={action.id} manifest={manifest} />
                  ))}
                </div>
              ) : null}
            </Reveal>
            {media ? (
              <Reveal className="manifest-page__hero-media" delay={0.08}>
                <ManifestMedia asset={media} eager />
              </Reveal>
            ) : null}
          </div>
        </header>
      );
    }

    case "richText":
      return (
        <section className="manifest-section">
          <Reveal className="reading-shell manifest-rich-text">
            {block.data.heading ? <h2>{block.data.heading.value}</h2> : null}
            {block.data.paragraphs.map((paragraph, index) => (
              <p key={`${block.id}-paragraph-${index}`}>{paragraph.value}</p>
            ))}
          </Reveal>
        </section>
      );

    case "media":
      return (
        <section className="manifest-section">
          <div className="content-shell manifest-media-row">
            {block.data.mediaIds.map((mediaId, index) => {
              const asset = mediaById(manifest, mediaId);
              return asset ? (
                <Reveal delay={index * 0.06} key={mediaId}>
                  <ManifestMedia asset={asset} />
                </Reveal>
              ) : null;
            })}
          </div>
          {block.data.caption ? <p className="content-shell manifest-caption">{block.data.caption.value}</p> : null}
        </section>
      );

    case "collection":
      return (
        <section className="manifest-section">
          <div className="content-shell">
            {block.data.heading ? <h2 className="manifest-heading">{block.data.heading.value}</h2> : null}
            <div className="manifest-collection" data-presentation={block.data.presentation}>
              {block.data.itemPageIds.map((pageId, index) => {
                const item = manifest.pages.find((page) => page.id === pageId && page.publication === "published");
                if (!item) return null;
                const image = item.seo?.imageMediaId ? mediaById(manifest, item.seo.imageMediaId) : undefined;
                return (
                  <Reveal delay={(index % 4) * 0.055} key={pageId}>
                    <Link className="manifest-collection__item" href={item.path}>
                      {image ? <ManifestMedia asset={image} /> : null}
                      <span>{(item.navigationTitle ?? item.title).value}</span>
                      <ArrowRight aria-hidden="true" size={17} strokeWidth={1.4} />
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      );

    case "facts":
      return (
        <section className="manifest-section manifest-section--soft">
          <div className="content-shell">
            {block.data.heading ? <h2 className="manifest-heading">{block.data.heading.value}</h2> : null}
            <dl className="manifest-facts">
              {block.data.items.map((item, index) => (
                <Reveal delay={(index % 4) * 0.05} key={`${block.id}-${item.label.value}`}>
                  <div>
                    <dt>{item.label.value}</dt>
                    <dd>{item.value.value}</dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </section>
      );

    case "process":
      return (
        <section className="manifest-section manifest-section--inverse">
          <div className="content-shell manifest-process-layout">
            {block.data.heading ? <h2 className="manifest-heading">{block.data.heading.value}</h2> : <span />}
            <ol className="manifest-process">
              {block.data.steps.map((step, index) => (
                <Reveal delay={index * 0.045} key={step.id}>
                  <li>
                    <div>
                      <h3>{step.title.value}</h3>
                      {step.body ? <p>{step.body.value}</p> : null}
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      );

    case "gallery":
      return (
        <section className="manifest-section">
          <div className="content-shell">
            {block.data.heading ? <h2 className="manifest-heading">{block.data.heading.value}</h2> : null}
            <div className="manifest-gallery">
              {block.data.mediaIds.map((mediaId, index) => {
                const asset = mediaById(manifest, mediaId);
                return asset ? (
                  <Reveal delay={(index % 3) * 0.055} key={mediaId}>
                    <ManifestMedia asset={asset} />
                  </Reveal>
                ) : null;
              })}
            </div>
          </div>
        </section>
      );

    case "callToAction":
      return (
        <section className="manifest-cta">
          <div className="content-shell manifest-cta__grid">
            <Reveal>
              {block.data.heading ? <h2>{block.data.heading.value}</h2> : null}
            </Reveal>
            <Reveal className="manifest-cta__content" delay={0.08}>
              {block.data.body ? <p>{block.data.body.value}</p> : null}
              <div className="manifest-actions">
                {block.data.actions.map((action) => (
                  <ManifestAction action={action} key={action.id} manifest={manifest} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      );

    case "function": {
      const record = manifest.functions.find((item) => item.id === block.data.functionId);
      if (!record || record.publication !== "published") return null;
      const FunctionRenderer = functions[record.implementationKey];
      if (!FunctionRenderer) {
        throw new Error(`No renderer registered for published function ${record.implementationKey}.`);
      }
      return (
        <section className="manifest-section" data-function={record.implementationKey}>
          <FunctionRenderer config={record.config} />
        </section>
      );
    }

    default:
      return null;
  }
}

export function ManifestPageRenderer({
  manifest,
  pageId,
  functions = {},
}: ManifestPageRendererProps) {
  const page = manifest.pages.find((candidate) => candidate.id === pageId);
  if (!page || page.publication !== "published") {
    throw new Error(`Published page ${pageId} was not found in the active client manifest.`);
  }

  const blocks = publishedBlocks(page);
  // This expensive template-owned film is intentionally retained for every
  // client copy. It is atmosphere, never evidence of the client's work.
  const hasLockedHero = page.kind === "home";
  const blocksToRender = hasLockedHero && blocks[0]?.type === "hero" ? blocks.slice(1) : blocks;

  return (
    <article className="manifest-page" data-page-kind={page.kind}>
      {hasLockedHero ? <HomeHero /> : null}
      {blocksToRender.map((block) => (
        <ManifestBlock block={block} functions={functions} key={block.id} manifest={manifest} />
      ))}
    </article>
  );
}
