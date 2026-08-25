import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { applications, materialCategories } from "@/data/content";
import { Wordmark } from "@/components/wordmark";

type FooterGroupProps = {
  label: string;
  ariaLabel: string;
  children: React.ReactNode;
};

function FooterGroup({ label, ariaLabel, children }: FooterGroupProps) {
  return (
    <>
      <div className="site-footer__group-desktop">
        <p>{label}</p>
        <nav aria-label={ariaLabel}>{children}</nav>
      </div>
      <details className="site-footer__group">
        <summary>
          <span>{label}</span>
          <ChevronDown aria-hidden="true" size={17} strokeWidth={1.3} />
        </summary>
        <nav aria-label={ariaLabel}>{children}</nav>
      </details>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner content-shell">
        <div className="site-footer__lead">
          <Wordmark inverse />
          <p>Natūralaus akmens gaminiai pagal individualų projektą.</p>
          <Link className="site-footer__project-link" href="/projektas">
            Aptarkime projektą <ArrowUpRight aria-hidden="true" size={20} />
          </Link>
        </div>

        <div className="site-footer__directories">
          <FooterGroup label="Gaminiai" ariaLabel="Gaminiai">
            <Link href="/gaminiai">Visi gaminiai</Link>
            {applications.map((application) => (
              <Link href={application.href} key={application.id}>
                {application.shortTitle}
              </Link>
            ))}
          </FooterGroup>

          <FooterGroup label="Akmuo" ariaLabel="Akmens rūšys">
            <Link href="/akmuo">Visa akmens kolekcija</Link>
            {materialCategories.map((category) => (
              <Link href={category.href} key={category.id}>
                {category.name}
              </Link>
            ))}
            <Link href="/akmuo?rodyti=issaugoti">Išsaugoti akmenys</Link>
          </FooterGroup>

          <FooterGroup label="Įmonė" ariaLabel="Apie įmonę ir darbą">
            <Link href="/projektai">Projektai</Link>
            <Link href="/kaip-dirbame">Kaip dirbame</Link>
            <Link href="/profesionalams">Profesionalams</Link>
            <Link href="/apie-mus">Apie mus</Link>
            <Link href="/zurnalas">Žurnalas</Link>
            <Link href="/memorialai">Memorialai</Link>
            <Link href="/kontaktai">Kontaktai</Link>
          </FooterGroup>

          <FooterGroup label="Kontaktai" ariaLabel="Granit Decor kontaktai">
            <a href="tel:+37065023784">+370 650 23784</a>
            <a href="mailto:stone@granitdecor.lt">stone@granitdecor.lt</a>
            <a href="https://www.google.com/maps/search/?api=1&query=K%C4%99stu%C4%8Dio+g.+1%2C+Lentvaris" target="_blank" rel="noreferrer">
              Kęstučio g. 1, Lentvaris
            </a>
            <span>I–V 8:00–16:00</span>
          </FooterGroup>
        </div>
      </div>

      <div className="site-footer__bottom content-shell">
        <span>© {new Date().getFullYear()} Granit Decor, UAB</span>
        <div>
          <Link href="/privatumas">Privatumas</Link>
          <Link href="/naudojimo-salygos">Naudojimo sąlygos</Link>
        </div>
        <a className="site-footer__top" href="#turinys">
          Į viršų ↑
        </a>
      </div>
    </footer>
  );
}
