import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { activeSiteConfig } from "@/client";
import type { ClientLink } from "@/template/client-config";

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

function FooterLink({ link }: { link: ClientLink }) {
  if (link.external || link.href.startsWith("http") || link.href.startsWith("tel:") || link.href.startsWith("mailto:")) {
    const opensNewWindow = link.external && link.href.startsWith("http");
    return (
      <a href={link.href} target={opensNewWindow ? "_blank" : undefined} rel={opensNewWindow ? "noreferrer" : undefined}>
        {link.label}
      </a>
    );
  }
  return <Link href={link.href}>{link.label}</Link>;
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner content-shell">
        <div className="site-footer__lead">
          <Wordmark inverse />
          {activeSiteConfig.footer.summary ? <p>{activeSiteConfig.footer.summary}</p> : null}
          {activeSiteConfig.footer.primaryAction ? (
            <Link className="site-footer__project-link" href={activeSiteConfig.footer.primaryAction.href}>
              {activeSiteConfig.footer.primaryAction.label} <ArrowUpRight aria-hidden="true" size={20} />
            </Link>
          ) : null}
        </div>

        <div className="site-footer__directories">
          {activeSiteConfig.footer.groups.map((group) => (
            <FooterGroup label={group.label} ariaLabel={group.ariaLabel} key={group.id}>
              {group.links.map((link) => <FooterLink link={link} key={`${group.id}-${link.href}`} />)}
            </FooterGroup>
          ))}

          {activeSiteConfig.contact.phone || activeSiteConfig.contact.email || activeSiteConfig.contact.address || activeSiteConfig.contact.openingHours ? (
            <FooterGroup label="Kontaktai" ariaLabel={`${activeSiteConfig.identity.name} kontaktai`}>
              {activeSiteConfig.contact.phone ? <a href={activeSiteConfig.contact.phone.href}>{activeSiteConfig.contact.phone.display}</a> : null}
              {activeSiteConfig.contact.email ? <a href={activeSiteConfig.contact.email.href}>{activeSiteConfig.contact.email.display}</a> : null}
              {activeSiteConfig.contact.address ? <FooterLink link={activeSiteConfig.contact.address} /> : null}
              {activeSiteConfig.contact.openingHours ? <span>{activeSiteConfig.contact.openingHours}</span> : null}
            </FooterGroup>
          ) : null}
        </div>
      </div>

      <div className="site-footer__bottom content-shell">
        <span>© {new Date().getFullYear()} {activeSiteConfig.identity.legalCopyrightName}</span>
        <div>
          {activeSiteConfig.footer.legalLinks.map((link) => <FooterLink link={link} key={link.href} />)}
        </div>
        <a className="site-footer__top" href="#turinys">
          {activeSiteConfig.ui.backToTop}
        </a>
      </div>
    </footer>
  );
}
