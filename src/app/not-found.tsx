import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { VeinLine } from "@/components/vein-line";

export default function NotFound() {
  return (
    <section className="fallback-page content-shell">
      <VeinLine className="fallback-page__vein" />
      <span className="fallback-page__code">404</span>
      <h1>Puslapis nerastas.</h1>
      <p>Patikrinkite adresą arba grįžkite į pagrindinį puslapį.</p>
      <div className="fallback-page__actions">
        <Link className="button button--primary" href="/">
          Grįžti į pradžią <ArrowUpRight aria-hidden="true" size={17} />
        </Link>
        <Link className="button button--ghost" href="/galerija">
          Darbų galerija
        </Link>
      </div>
    </section>
  );
}
