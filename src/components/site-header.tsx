"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Heart,
  MapPin,
  Menu,
  Search,
  X,
} from "lucide-react";
import { utilityNavigation } from "@/data/content";
import {
  megaNavigation,
  megaNavigationItems,
  type MegaMenuId,
  type MegaNavigationMenu,
  type MegaNavigationPanel,
} from "@/data/mega-navigation";
import { MATERIAL_SAVED_EVENT, readSavedMaterials } from "@/lib/material-storage";
import { LocationDialog } from "@/components/location-dialog";
import { SavedStonesDialog } from "@/components/saved-stones-dialog";
import { SiteSearchDialog } from "@/components/site-search-dialog";
import { Wordmark } from "@/components/wordmark";

function isNavigationActive(pathname: string, href: string) {
  const hrefPath = href.split(/[?#]/, 1)[0];
  return pathname === hrefPath || (hrefPath !== "/" && pathname.startsWith(`${hrefPath}/`));
}

function MegaMenuPanel({
  menu,
  pathname,
  pinned,
  onClose,
  onPointerEnter,
  onPointerLeave,
}: {
  menu: MegaNavigationPanel;
  pathname: string;
  pinned: boolean;
  onClose: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  return (
    <div
      aria-label={menu.ariaLabel}
      className="site-header__mega"
      data-layout={menu.layout}
      data-presentation={menu.presentation}
      data-pinned={pinned || undefined}
      id={`site-header-${menu.id}-panel`}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className="site-header__mega-inner page-shell">
        {menu.presentation === "plain" ? (
          <nav
            aria-label={menu.ariaLabel}
            className="site-header__mega-plain-links"
            data-link-count={menu.railLinks.length}
          >
            {menu.railLinks.map((link) => (
              <Link
                aria-current={isNavigationActive(pathname, link.href) ? "page" : undefined}
                data-project-action={link.href === "/projektas" || undefined}
                href={link.href}
                key={`${menu.id}-${link.href}-${link.label}`}
                onClick={onClose}
              >
                <span>{link.label}</span>
                <ArrowRight aria-hidden="true" size={16} strokeWidth={1.35} />
              </Link>
            ))}
          </nav>
        ) : (
          <>
            <div className="site-header__mega-tiles">
              {menu.tiles.map((tile) => (
                <Link
                  aria-current={isNavigationActive(pathname, tile.href) ? "page" : undefined}
                  className="site-header__mega-tile"
                  href={tile.href}
                  key={tile.id}
                  onClick={onClose}
                >
                  <span className="site-header__mega-visual">
                    <Image alt="" fill loading="eager" sizes="120px" src={tile.image.src} />
                  </span>
                  <span>{tile.label}</span>
                </Link>
              ))}
            </div>

            <div className="site-header__mega-links">
              {menu.railLinks.map((link, index) => (
                <Link
                  data-overview={index === 0 || undefined}
                  data-project-action={link.href === "/projektas" || undefined}
                  href={link.href}
                  key={`${menu.id}-${link.href}-${link.label}`}
                  onClick={onClose}
                >
                  <span>{link.label}</span>
                  <ArrowRight aria-hidden="true" size={15} strokeWidth={1.4} />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <button className="site-header__mega-collapse" type="button" onClick={onClose} aria-label={`Uždaryti ${menu.label} meniu`}>
        <ChevronUp aria-hidden="true" size={15} strokeWidth={1.3} />
      </button>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const mobileDialogRef = useRef<HTMLDialogElement>(null);
  const mobileBackButtonRef = useRef<HTMLButtonElement>(null);
  const mobileSectionTriggerRefs = useRef<Partial<Record<MegaMenuId, HTMLButtonElement | null>>>({});
  const lastMobileSectionRef = useRef<MegaMenuId | null>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const megaCloseTimerRef = useRef<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MegaMenuId | null>(null);
  const [openMegaMenu, setOpenMegaMenu] = useState<MegaMenuId | null>(null);
  const [pinnedMegaMenu, setPinnedMegaMenu] = useState<MegaMenuId | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [savedOpen, setSavedOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const updateSavedCount = () => setSavedCount(readSavedMaterials().length);
    updateSavedCount();
    window.addEventListener("storage", updateSavedCount);
    window.addEventListener(MATERIAL_SAVED_EVENT, updateSavedCount);
    return () => {
      window.removeEventListener("storage", updateSavedCount);
      window.removeEventListener(MATERIAL_SAVED_EVENT, updateSavedCount);
    };
  }, []);

  useEffect(() => {
    let frameId: number | null = null;
    const onScroll = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        frameId = null;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(
    () => () => {
      if (megaCloseTimerRef.current) window.clearTimeout(megaCloseTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setOpenMegaMenu(null);
      setPinnedMegaMenu(null);
      setMobileMenuOpen(false);
      setMobileSection(null);
      setSavedOpen(false);
      setLocationOpen(false);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  useEffect(() => {
    if (!openMegaMenu && !pinnedMegaMenu) return;

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!desktopNavRef.current?.contains(event.target as Node)) {
        setOpenMegaMenu(null);
        setPinnedMegaMenu(null);
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [openMegaMenu, pinnedMegaMenu]);

  useEffect(() => {
    const dialog = mobileDialogRef.current;
    if (!dialog) return;

    if (mobileMenuOpen && !dialog.open) {
      dialog.showModal();
      document.body.dataset.menuOpen = "true";
    } else if (!mobileMenuOpen && dialog.open) {
      dialog.close();
      delete document.body.dataset.menuOpen;
    }

    return () => {
      delete document.body.dataset.menuOpen;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      lastMobileSectionRef.current = null;
      return;
    }

    const returningToSection = lastMobileSectionRef.current;
    if (mobileSection) lastMobileSectionRef.current = mobileSection;

    const frameId = window.requestAnimationFrame(() => {
      if (mobileSection) {
        mobileBackButtonRef.current?.focus({ preventScroll: true });
        return;
      }

      if (returningToSection) {
        mobileSectionTriggerRefs.current[returningToSection]?.focus({ preventScroll: true });
        lastMobileSectionRef.current = null;
        return;
      }

      mobileSectionTriggerRefs.current[megaNavigationItems[0].id]?.focus({ preventScroll: true });
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [mobileMenuOpen, mobileSection]);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
    setMobileSection(null);
  }

  function closeMegaMenus() {
    if (megaCloseTimerRef.current) window.clearTimeout(megaCloseTimerRef.current);
    megaCloseTimerRef.current = null;
    setOpenMegaMenu(null);
    setPinnedMegaMenu(null);
  }

  function cancelMegaClose() {
    if (!megaCloseTimerRef.current) return;
    window.clearTimeout(megaCloseTimerRef.current);
    megaCloseTimerRef.current = null;
  }

  function openMegaFromPointer(menuId: MegaMenuId) {
    cancelMegaClose();
    if (pinnedMegaMenu && pinnedMegaMenu !== menuId) return;
    setOpenMegaMenu(menuId);
  }

  function scheduleMegaClose(menuId: MegaMenuId) {
    cancelMegaClose();
    if (pinnedMegaMenu === menuId) return;
    megaCloseTimerRef.current = window.setTimeout(() => {
      setOpenMegaMenu((current) => (current === menuId ? null : current));
    }, 260);
  }

  function togglePinnedMega(menuId: MegaMenuId) {
    cancelMegaClose();
    if (pinnedMegaMenu === menuId) {
      closeMegaMenus();
      return;
    }

    setPinnedMegaMenu(menuId);
    setOpenMegaMenu(menuId);
  }

  function closeMegaMenuOnBlur(event: ReactFocusEvent<HTMLElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMegaMenus();
  }

  function closeMegaMenuOnEscape(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape") return;

    event.preventDefault();
    event.currentTarget
      .querySelector<HTMLButtonElement>(".site-header__nav-trigger[aria-expanded='true']")
      ?.focus();
    closeMegaMenus();
  }

  function openSearch() {
    closeMegaMenus();
    setSearchOpen(true);
  }

  function openSaved() {
    closeMegaMenus();
    setSavedOpen(true);
  }

  const selectedMobileMenu: MegaNavigationMenu | null = mobileSection
    ? megaNavigation[mobileSection]
    : null;

  return (
    <header className="site-header" data-scrolled={scrolled || undefined}>
      <div className="site-header__inner page-shell">
        <div className="site-header__utility-start">
          <button type="button" onClick={() => setLocationOpen(true)}>
            <MapPin aria-hidden="true" size={14} strokeWidth={1.45} />
            Lentvaris
          </button>
          <Link href="/kontaktai">Kontaktai</Link>
        </div>

        <button
          aria-expanded={mobileMenuOpen}
          aria-haspopup="dialog"
          className="site-header__menu-button"
          type="button"
          onClick={() => {
            closeMegaMenus();
            setMobileMenuOpen(true);
          }}
        >
          <Menu aria-hidden="true" size={20} strokeWidth={1.45} />
          <span>Meniu</span>
        </button>

        <Wordmark />

        <nav
          className="site-header__nav"
          aria-label="Pagrindinis meniu"
          ref={desktopNavRef}
          onBlur={closeMegaMenuOnBlur}
          onKeyDown={closeMegaMenuOnEscape}
        >
          {megaNavigationItems.map((menu) => {
            const active = isNavigationActive(pathname, menu.href);

            if (menu.behavior === "direct") {
              return (
                <div className="site-header__nav-item" key={menu.id}>
                  <Link
                    aria-current={active ? "page" : undefined}
                    className="site-header__nav-link"
                    data-active={active || undefined}
                    href={menu.href}
                    onClick={closeMegaMenus}
                  >
                    {menu.label}
                  </Link>
                </div>
              );
            }

            const expanded = openMegaMenu === menu.id;
            const panelId = `site-header-${menu.id}-panel`;

            return (
              <div
                className="site-header__nav-item"
                data-open={expanded || undefined}
                key={menu.id}
                onPointerEnter={() => openMegaFromPointer(menu.id)}
                onPointerLeave={() => scheduleMegaClose(menu.id)}
              >
                <button
                  aria-controls={panelId}
                  aria-expanded={expanded}
                  className="site-header__nav-link site-header__nav-trigger"
                  data-active={active || expanded || undefined}
                  id={`site-header-${menu.id}-trigger`}
                  type="button"
                  onClick={() => togglePinnedMega(menu.id)}
                >
                  {menu.label}
                </button>

                {expanded ? (
                  <MegaMenuPanel
                    menu={menu}
                    pathname={pathname}
                    pinned={pinnedMegaMenu === menu.id}
                    onClose={closeMegaMenus}
                    onPointerEnter={cancelMegaClose}
                    onPointerLeave={() => scheduleMegaClose(menu.id)}
                  />
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="site-header__tools">
          <button className="header-tool header-tool--search" type="button" onClick={openSearch} aria-label="Atverti paiešką">
            <Search aria-hidden="true" size={17} strokeWidth={1.45} />
            <span>Paieška</span>
          </button>
          <button className="header-tool header-tool--saved" type="button" onClick={openSaved} aria-label={`Išsaugoti akmenys: ${savedCount}`}>
            <Heart aria-hidden="true" size={17} strokeWidth={1.45} />
            <span>Išsaugota</span>
            <small>{savedCount}</small>
          </button>
          <Link className="site-header__cta" href="/projektas">
            Aptarkime projektą
          </Link>
        </div>
      </div>

      {openMegaMenu ? (
        <button aria-label="Uždaryti išskleistą meniu" className="site-header__scrim" type="button" onClick={closeMegaMenus} />
      ) : null}

      <dialog
        aria-label="Svetainės meniu"
        className="mobile-menu"
        ref={mobileDialogRef}
        onClose={() => {
          setMobileMenuOpen(false);
          setMobileSection(null);
        }}
        onCancel={(event) => {
          event.preventDefault();
          closeMobileMenu();
        }}
      >
        <div className="mobile-menu__track" data-submenu={mobileSection || undefined}>
          <section
            className="mobile-menu__pane mobile-menu__pane--root"
            aria-hidden={Boolean(mobileSection)}
            inert={Boolean(mobileSection)}
          >
            <div className="mobile-menu__top mobile-menu__top--root">
              <span aria-hidden="true" />
              <Wordmark onClick={closeMobileMenu} />
              <button className="mobile-menu__close" type="button" onClick={closeMobileMenu} aria-label="Uždaryti meniu">
                <X aria-hidden="true" size={22} strokeWidth={1.4} />
              </button>
            </div>

            <nav className="mobile-menu__primary" aria-label="Pagrindinės svetainės skiltys">
              {megaNavigationItems.map((menu) =>
                menu.behavior === "direct" ? (
                  <Link
                    aria-current={isNavigationActive(pathname, menu.href) ? "page" : undefined}
                    href={menu.href}
                    key={menu.id}
                    onClick={closeMobileMenu}
                  >
                    <span>{menu.label}</span>
                  </Link>
                ) : (
                  <button
                    key={menu.id}
                    ref={(node) => {
                      mobileSectionTriggerRefs.current[menu.id] = node;
                    }}
                    type="button"
                    onClick={() => setMobileSection(menu.id)}
                  >
                    <span>{menu.label}</span>
                    <ChevronRight aria-hidden="true" size={18} strokeWidth={1.35} />
                  </button>
                ),
              )}
            </nav>

            <div className="mobile-menu__root-actions">
              <Link href="/projektas" onClick={closeMobileMenu}>
                Aptarti projektą <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  window.requestAnimationFrame(() => setLocationOpen(true));
                }}
              >
                <MapPin aria-hidden="true" size={15} /> Lentvaris
              </button>
              {utilityNavigation.map((item) => (
                <Link href={item.href} key={item.id} onClick={closeMobileMenu}>
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="mobile-menu__contact">
              <a href="tel:+37065023784">+370 650 23784</a>
              <a href="mailto:stone@granitdecor.lt">stone@granitdecor.lt</a>
            </div>
          </section>

          <section
            className="mobile-menu__pane mobile-menu__pane--section"
            aria-hidden={!mobileSection}
            inert={!mobileSection}
          >
            <div className="mobile-menu__top mobile-menu__top--section">
              <button
                ref={mobileBackButtonRef}
                type="button"
                onClick={() => setMobileSection(null)}
                aria-label="Grįžti į pagrindinį meniu"
              >
                <ChevronLeft aria-hidden="true" size={20} strokeWidth={1.35} />
              </button>
              <strong>{selectedMobileMenu?.label ?? "Skiltis"}</strong>
              <button className="mobile-menu__close" type="button" onClick={closeMobileMenu} aria-label="Uždaryti meniu">
                <X aria-hidden="true" size={22} strokeWidth={1.4} />
              </button>
            </div>

            {selectedMobileMenu?.behavior === "panel" ? (
              <nav
                className="mobile-menu__section-links"
                aria-label={selectedMobileMenu.ariaLabel}
                data-presentation={selectedMobileMenu.presentation}
              >
                {selectedMobileMenu.presentation === "plain" ? (
                  <div className="mobile-menu__plain-links">
                    {selectedMobileMenu.railLinks.map((link) => (
                      <Link
                        aria-current={isNavigationActive(pathname, link.href) ? "page" : undefined}
                        data-project-action={link.href === "/projektas" || undefined}
                        href={link.href}
                        key={`${selectedMobileMenu.id}-${link.href}-${link.label}`}
                        onClick={closeMobileMenu}
                      >
                        <span>{link.label}</span>
                        <ArrowRight aria-hidden="true" size={16} strokeWidth={1.35} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <>
                    <div>
                      {selectedMobileMenu.tiles.map((tile) => (
                        <Link href={tile.href} key={tile.id} onClick={closeMobileMenu}>
                          {tile.label}
                        </Link>
                      ))}
                    </div>
                    <div className="mobile-menu__section-actions">
                      {selectedMobileMenu.railLinks.map((link) => (
                        <Link href={link.href} key={`${selectedMobileMenu.id}-${link.href}-${link.label}`} onClick={closeMobileMenu}>
                          <span>{link.label}</span>
                          <ArrowRight aria-hidden="true" size={16} strokeWidth={1.35} />
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </nav>
            ) : null}
          </section>
        </div>
      </dialog>

      <SiteSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <SavedStonesDialog open={savedOpen} onOpenChange={setSavedOpen} />
      <LocationDialog open={locationOpen} onOpenChange={setLocationOpen} />
    </header>
  );
}
