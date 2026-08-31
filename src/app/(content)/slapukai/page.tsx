import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { legalCookiePolicyLt } from "@/content/akmendarba";

export const metadata: Metadata = { title: "Slapukai" };

export default function CookiesPage() {
  return (
    <article className="ak-legal">
      <header className="ak-index-hero">
        <div className="content-shell ak-index-hero__inner">
          <Link className="ak-back-link" href="/"><ArrowLeft aria-hidden="true" size={15} /> Pradžia</Link>
          <Reveal><p className="ak-kicker">Teisinė informacija</p><h1>Slapukai.</h1></Reveal>
        </div>
      </header>
      <div className="reading-shell ak-legal__content">
        <p className="ak-legal__lede">Čia pateikiama informacija, kokius duomenis svetainė gali rinkti, kaip jie naudojami ir kam perduodami.</p>
        {legalCookiePolicyLt.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets?.length ? (
              <ul>
                {section.bullets.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : null}
            {section.links?.length ? (
              <p className="ak-legal__links">
                {section.links.map((link) => (
                  <a href={link.href} key={link.href} rel="noreferrer" target="_blank">{link.label}</a>
                ))}
              </p>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
