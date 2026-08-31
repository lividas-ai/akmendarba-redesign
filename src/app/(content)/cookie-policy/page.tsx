import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Cookie policy" };

export default function LegacyCookiePolicyPage() {
  return (
    <article className="ak-legal">
      <header className="ak-index-hero">
        <div className="content-shell ak-index-hero__inner">
          <Link className="ak-back-link" href="/slapukai"><ArrowLeft aria-hidden="true" size={15} /> Slapukai</Link>
          <div><h1>Cookie policy.</h1></div>
        </div>
      </header>
      <div className="reading-shell ak-legal__content">
        <p>This site uses cookies — small text files that are placed on your machine to help the site provide a better user experience.</p>
        <p>In general, cookies are used to retain user preferences, store information for things like shopping carts, and provide anonymised tracking data to third-party applications. As a rule, cookies will make your browsing experience better.</p>
        <p>However, you may prefer to disable cookies on this site and on others. The most effective way to do this is to disable cookies in your browser. We suggest consulting the Help section of your browser or visiting the <a href="https://www.aboutcookies.org/" rel="noreferrer" target="_blank">About Cookies website</a>, which offers guidance for modern browsers.</p>
      </div>
    </article>
  );
}
