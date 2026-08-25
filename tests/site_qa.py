from __future__ import annotations

import re
import sys
import urllib.request
from html.parser import HTMLParser
from pathlib import Path


PROJECT = Path(__file__).resolve().parents[1]
WORKSPACE = PROJECT.parent
sys.path.insert(0, str(PROJECT / ".test-deps"))

from playwright.sync_api import Page, expect, sync_playwright


BASE_URL = "http://localhost:3000"
OUT = PROJECT / "out"
SCREENSHOTS = WORKSPACE / ".design" / "granit-decor-redesign" / "screenshots"
SCREENSHOTS.mkdir(parents=True, exist_ok=True)
INTERACTIONS_ONLY = "--interactions-only" in sys.argv
CAPTURES_ONLY = "--captures-only" in sys.argv

BROWSER_CANDIDATES = sorted(
    (Path.home() / "Library" / "Caches" / "ms-playwright").glob(
        "chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell"
    )
)

VIEWPORTS = {
    "desktop-1280": {"width": 1280, "height": 800},
    "tablet-768": {"width": 768, "height": 1024},
    "mobile-375": {"width": 375, "height": 812},
}

MEGA_MENUS = (
    ("Gaminiai", "gaminiai", 8),
    ("Akmuo", "akmuo", 5),
    ("Projektai", "projektai", 5),
    ("Kaip dirbame", "kaip-dirbame", 0),
)

DIRECT_PRIMARY_LINKS = (
    ("Profesionalams", "/profesionalams"),
    ("Apie mus", "/apie-mus"),
)


class StructuralParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.lang = ""
        self.h1_count = 0
        self.title_count = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag == "html":
            self.lang = dict(attrs).get("lang") or ""
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "title":
            self.title_count += 1

KEY_PAGES = {
    "homepage": "/",
    "applications": "/gaminiai/",
    "application-detail": "/gaminiai/virtuves-stalvirsiai/",
    "materials": "/akmuo/?tipas=travertinas",
    "material-detail": "/akmuo/patagonia/",
    "projects": "/projektai/",
    "process": "/kaip-dirbame/",
    "planner": "/projektas/",
    "contact": "/kontaktai/",
    "memorials": "/memorialai/",
}


def exported_routes() -> list[str]:
    routes: set[str] = set()
    for html in OUT.rglob("index.html"):
        relative = html.relative_to(OUT)
        parts = list(relative.parts[:-1])
        if not parts:
            routes.add("/")
            continue
        route = "/" + "/".join(parts) + "/"
        if route.startswith("/_not-found"):
            continue
        routes.add(route)
    return sorted(routes)


def wait_for_page(page: Page) -> None:
    page.wait_for_load_state("load")
    page.locator("body").wait_for(state="visible")
    page.wait_for_timeout(420)


def assert_page_integrity(page: Page, route: str, *, check_images: bool = True) -> None:
    assert page.locator("html").get_attribute("lang") == "lt", route
    assert page.locator("main#turinys").count() == 1, route
    assert page.locator("h1").count() == 1, f"{route}: expected exactly one h1"
    assert page.title().strip(), f"{route}: missing title"
    overflow = page.evaluate(
        "document.scrollingElement.scrollWidth - document.scrollingElement.clientWidth"
    )
    if overflow > 1:
        offenders = page.evaluate(
            """
            [...document.querySelectorAll('body *')]
              .map(el => {
                const r = el.getBoundingClientRect();
                return {tag: el.tagName, cls: el.className || '', left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width)};
              })
              .filter(item => item.right > window.innerWidth + 1 || item.left < -1)
              .slice(0, 12)
            """
        )
        raise AssertionError(f"{route}: horizontal overflow of {overflow}px; offenders={offenders}")
    if check_images:
        broken_images = page.locator("img").evaluate_all(
            "els => els.filter(img => img.complete && img.naturalWidth === 0).map(img => img.currentSrc || img.src)"
        )
        assert not broken_images, f"{route}: broken images {broken_images}"


def reveal_page(page: Page) -> None:
    page.evaluate(
        """
        async () => {
          const height = document.documentElement.scrollHeight;
          const stride = Math.max(520, Math.floor(window.innerHeight * 0.82));
          for (let y = 0; y < height; y += stride) {
            window.scrollTo(0, y);
            await new Promise(resolve => setTimeout(resolve, 45));
          }
          window.scrollTo(0, 0);
        }
        """
    )
    page.wait_for_timeout(350)


def capture(page: Page, slug: str, route: str, viewport_name: str) -> None:
    page.emulate_media(reduced_motion="reduce")
    page.set_viewport_size(VIEWPORTS[viewport_name])
    response = page.goto(f"{BASE_URL}{route}", wait_until="domcontentloaded")
    assert response and response.ok, f"{route}: HTTP failure"
    wait_for_page(page)
    assert_page_integrity(page, route)
    reveal_page(page)
    page.add_style_tag(content=".material-plate { content-visibility: visible !important; }")
    page.screenshot(
        path=str(SCREENSHOTS / f"review-{slug}-{viewport_name}.png"),
        full_page=True,
        animations="disabled",
    )


def smoke_all_routes() -> None:
    routes = exported_routes()
    assert len(routes) >= 160, f"Expected the complete static export, found {len(routes)} routes"
    for route in routes:
        with urllib.request.urlopen(f"{BASE_URL}{route}", timeout=5) as response:
            assert response.status == 200, f"{route}: HTTP {response.status}"
            document = response.read().decode("utf-8")
        parser = StructuralParser()
        parser.feed(document)
        assert parser.lang == "lt", f"{route}: missing Lithuanian language"
        expected_h1_count = 0 if route == "/akmuo/" else 1
        assert parser.h1_count == expected_h1_count, f"{route}: expected {expected_h1_count} h1, found {parser.h1_count}"
        assert parser.title_count == 1, f"{route}: missing title"
    print(f"Static route smoke test: {len(routes)} routes passed")


def test_mobile_navigation(page: Page) -> None:
    page.set_viewport_size(VIEWPORTS["mobile-375"])
    page.goto(f"{BASE_URL}/", wait_until="load")
    menu_button = page.get_by_role("button", name="Meniu")
    menu_button.focus()
    menu_button.click()
    dialog = page.locator("dialog.mobile-menu")
    expect(dialog).to_have_attribute("open", "")
    root_pane = dialog.locator(".mobile-menu__pane--root")
    section_pane = dialog.locator(".mobile-menu__pane--section")
    primary_navigation = root_pane.get_by_role(
        "navigation", name="Pagrindinės svetainės skiltys"
    )
    expect(primary_navigation.get_by_role("button")).to_have_count(4)
    for label, _, _ in MEGA_MENUS:
        expect(primary_navigation.get_by_role("button", name=label, exact=True)).to_be_visible()
    expect(primary_navigation.get_by_role("link")).to_have_count(2)
    for label, href in DIRECT_PRIMARY_LINKS:
        actual_href = primary_navigation.get_by_role(
            "link", name=label, exact=True
        ).get_attribute("href")
        assert actual_href and actual_href.rstrip("/") == href
    gaminiai_trigger = primary_navigation.get_by_role("button", name="Gaminiai", exact=True)
    expect(gaminiai_trigger).to_be_focused()
    page.screenshot(
        path=str(SCREENSHOTS / "review-mobile-menu-root-mobile-375.png"),
        animations="disabled",
    )

    gaminiai_trigger.click()
    track = dialog.locator(".mobile-menu__track")
    expect(track).to_have_attribute("data-submenu", "gaminiai")
    expect(root_pane).to_have_attribute("aria-hidden", "true")
    expect(section_pane).to_have_attribute("aria-hidden", "false")
    expect(section_pane.locator(".mobile-menu__section-links img")).to_have_count(0)
    expect(
        section_pane.locator(".mobile-menu__section-links > div:first-child > a")
    ).to_have_count(8)
    expect(section_pane.locator(".mobile-menu__section-actions > a")).to_have_count(7)
    page.wait_for_timeout(550)
    back_button = section_pane.get_by_role("button", name="Grįžti į pagrindinį meniu")
    expect(back_button).to_be_focused()
    page.screenshot(
        path=str(SCREENSHOTS / "review-mobile-menu-gaminiai-mobile-375.png"),
        animations="disabled",
    )

    back_button.click()
    expect(root_pane).to_have_attribute("aria-hidden", "false")
    expect(section_pane).to_have_attribute("aria-hidden", "true")
    expect(gaminiai_trigger).to_be_focused()
    root_pane.get_by_role("button", name="Uždaryti meniu").click()
    expect(dialog).not_to_have_attribute("open", "")
    expect(menu_button).to_be_focused()


def test_content_parity_and_navigation(page: Page) -> None:
    page.set_viewport_size(VIEWPORTS["desktop-1280"])

    page.goto(f"{BASE_URL}/", wait_until="load")
    expect(page.locator(".site-header__nav-trigger")).to_have_count(4)
    for label, href in DIRECT_PRIMARY_LINKS:
        actual_href = page.locator(".site-header__nav").get_by_role(
            "link", name=label, exact=True
        ).get_attribute("href")
        assert actual_href and actual_href.rstrip("/") == href

    # Each first-level section pins on click, exposes the expected image choices,
    # and toggles closed when its trigger is clicked again.
    for label, menu_id, tile_count in MEGA_MENUS:
        trigger = page.get_by_role("button", name=label, exact=True)
        panel = page.locator(f"#site-header-{menu_id}-panel")
        trigger.click()
        expect(trigger).to_have_attribute("aria-expanded", "true")
        expect(panel).to_have_attribute("data-pinned", "true")
        expect(panel.locator(".site-header__mega-tile")).to_have_count(tile_count)
        expect(page.locator(".site-header__scrim")).to_be_visible()
        if menu_id == "gaminiai":
            panel.screenshot(
                path=str(SCREENSHOTS / "review-desktop-service-menu-open-desktop-1280.png"),
                animations="disabled",
            )
        trigger.click()
        expect(trigger).to_have_attribute("aria-expanded", "false")
        expect(panel).to_have_count(0)

    # A pinned menu switches directly to another clicked section.
    service_menu_button = page.get_by_role("button", name="Gaminiai", exact=True)
    material_menu_button = page.get_by_role("button", name="Akmuo", exact=True)
    service_menu_button.click()
    material_menu_button.click()
    expect(page.locator("#site-header-gaminiai-panel")).to_have_count(0)
    expect(page.locator("#site-header-akmuo-panel")).to_be_visible()
    expect(material_menu_button).to_have_attribute("aria-expanded", "true")
    material_menu_button.click()

    # Pointer transfer keeps a panel usable while moving from its trigger into
    # the choices, and swaps sections without leaving a dead hover gap.
    page.mouse.move(20, 740)
    service_menu_button.hover()
    expect(page.locator("#site-header-gaminiai-panel")).to_be_visible()
    material_menu_button.hover()
    material_menu = page.locator("#site-header-akmuo-panel")
    expect(page.locator("#site-header-gaminiai-panel")).to_have_count(0)
    expect(material_menu).to_be_visible()
    material_menu.locator(".site-header__mega-tile").first.hover()
    page.wait_for_timeout(350)
    expect(material_menu).to_be_visible()

    scrim = page.locator(".site-header__scrim")
    expect(scrim).to_be_visible()
    scrim.click(position={"x": 20, "y": 640})
    expect(material_menu).to_have_count(0)
    expect(scrim).to_have_count(0)

    process_menu_button = page.get_by_role("button", name="Kaip dirbame", exact=True)
    process_menu_button.click()
    page.keyboard.press("Escape")
    expect(page.locator("#site-header-kaip-dirbame-panel")).to_have_count(0)
    expect(process_menu_button).to_be_focused()

    # Header utilities use proper modal layers and remain keyboard dismissible.
    search_button = page.get_by_role("button", name="Atverti paiešką")
    search_button.click()
    search_dialog = page.locator("dialog.site-search")
    expect(search_dialog).to_have_attribute("open", "")
    searchbox = search_dialog.get_by_role(
        "searchbox", name="Ieškokite gaminio, akmens arba projekto"
    )
    expect(searchbox).to_be_focused()
    search_focus_style = search_dialog.locator(".site-search__form > div").evaluate(
        "el => ({style: getComputedStyle(el).outlineStyle, width: getComputedStyle(el).outlineWidth})"
    )
    assert search_focus_style == {"style": "solid", "width": "2px"}
    searchbox.fill("Patagonia")
    expect(search_dialog.get_by_role("link", name="Patagonia", exact=True)).to_have_count(1)
    expect(search_dialog.locator("[aria-live='polite']")).to_contain_text("Rasta rezultatų: 1")
    search_dialog.screenshot(
        path=str(SCREENSHOTS / "review-site-search-results-desktop-1280.png"),
        animations="disabled",
    )
    search_dialog.get_by_role("button", name="Uždaryti paiešką").click()
    expect(search_dialog).not_to_have_attribute("open", "")
    expect(search_button).to_be_focused()

    saved_button = page.get_by_role("button", name=re.compile(r"^Išsaugoti akmenys:"))
    saved_button.click()
    saved_dialog = page.locator("dialog.saved-stones")
    expect(saved_dialog).to_have_attribute("open", "")
    expect(saved_dialog.get_by_role("heading", name="Jūsų kolekcija tuščia.")).to_be_visible()
    saved_dialog.screenshot(
        path=str(SCREENSHOTS / "review-saved-stones-empty-desktop-1280.png"),
        animations="disabled",
    )
    page.keyboard.press("Escape")
    expect(saved_dialog).not_to_have_attribute("open", "")
    expect(saved_button).to_be_focused()

    location_button = page.get_by_role("button", name="Lentvaris", exact=True)
    location_button.click()
    location_dialog = page.locator("dialog.location-dialog")
    expect(location_dialog).to_have_attribute("open", "")
    expect(location_dialog.get_by_role("heading", name="Lentvaris")).to_be_visible()
    expect(location_dialog).to_contain_text("Kęstučio g. 1, Lentvaris")
    page.keyboard.press("Escape")
    expect(location_dialog).not_to_have_attribute("open", "")
    expect(location_button).to_be_focused()

    expect(page.locator(".site-footer__group-desktop")).to_have_count(4)
    expect(page.locator(".site-footer__group-desktop").first).to_be_visible()
    expect(page.locator(".site-footer__group").first).to_be_hidden()

    page.goto(f"{BASE_URL}/gaminiai/", wait_until="load")
    expect(page.locator(".service-card")).to_have_count(13)
    service_search = page.get_by_role("searchbox", name="Ieškoti gaminio arba paslaugos")
    service_search.fill("kolonos")
    expect(page.locator(".service-card")).to_have_count(1)
    expect(page.locator(".service-card")).to_contain_text("Kolonos")
    service_search.fill("")
    expect(page.locator(".service-card")).to_have_count(13)

    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    page.locator(".service-card").last.click()
    page.wait_for_url(re.compile(r"/gaminiai/[^/]+/?$"))
    page.wait_for_timeout(450)
    assert page.evaluate("window.scrollY") <= 1, "Client-side route did not reset to the true page top"

    page.goto(f"{BASE_URL}/projektai/", wait_until="load")
    gallery_images = page.get_by_role("button", name=re.compile("Atverti nuotrauką:"))
    expect(gallery_images).to_have_count(18)
    page.get_by_role("button", name="Židiniai", exact=True).click()
    expect(gallery_images).to_have_count(4)
    gallery_images.first.click()
    gallery_dialog = page.locator("dialog").filter(has=page.locator("button[aria-label='Uždaryti nuotrauką']"))
    expect(gallery_dialog).to_have_attribute("open", "")
    page.keyboard.press("Escape")
    expect(page.locator("dialog[open]")).to_have_count(0)

    page.goto(f"{BASE_URL}/projektas/?gaminys=kolonos", wait_until="load")
    expect(page.locator("input[name='project-type'][value='kolonos']")).to_be_checked()

    page.goto(f"{BASE_URL}/", wait_until="load")
    logo = page.locator("img[src$='/assets/brand/granit-decor-logo.png']").first
    expect(logo).to_be_visible()


def test_material_tools(page: Page) -> None:
    page.set_viewport_size(VIEWPORTS["desktop-1280"])
    page.goto(f"{BASE_URL}/akmuo/", wait_until="load")
    page.locator("#kolekcija").scroll_into_view_if_needed()

    search = page.get_by_role("searchbox", name="Ieškoti pagal akmens pavadinimą")
    search.fill("Patagonia")
    expect(page.locator(".material-results__header")).to_contain_text("Rodoma 1 iš 133")
    assert "q=Patagonia" in page.url
    page.get_by_role("button", name="Išvalyti paiešką").click()
    expect(page.locator(".material-results__header")).to_contain_text("Rodoma 133 iš 133")

    quick_trigger = page.get_by_role("button", name=re.compile("Greitai peržiūrėti")).first
    quick_trigger.click()
    quick_dialog = page.locator("dialog.material-quick-view")
    expect(quick_dialog).to_have_attribute("open", "")
    expect(quick_dialog.get_by_role("heading", level=2)).to_be_visible()
    quick_dialog.screenshot(
        path=str(SCREENSHOTS / "review-material-quick-view-desktop-1280.png"),
        animations="disabled",
    )
    quick_dialog.get_by_role("button", name=re.compile("Išsaugoti")).click()
    saved = page.evaluate("JSON.parse(localStorage.getItem('granit-decor-saved-v1') || '[]')")
    assert len(saved) == 1
    page.keyboard.press("Escape")
    expect(quick_dialog).not_to_have_attribute("open", "")
    expect(quick_trigger).to_be_focused()

    saved_button = page.get_by_role("button", name=re.compile(r"^Išsaugoti akmenys: 1$"))
    saved_button.click()
    saved_dialog = page.locator("dialog.saved-stones")
    remove_saved = saved_dialog.get_by_role("button", name=re.compile(r"^Pašalinti .+ iš išsaugotų$"))
    remove_saved.click()
    expect(saved_dialog.get_by_role("status")).to_contain_text("pašalintas iš išsaugotų")
    expect(saved_dialog.get_by_role("link", name="Rinktis akmenį")).to_be_focused()
    page.keyboard.press("Escape")

    compare_buttons = page.locator("button[aria-label*='į palyginimą']")
    compare_buttons.first.click()
    compare_buttons.first.click()
    drawer = page.locator(".compare-drawer")
    expect(drawer).to_contain_text("2 iš 3")
    page.get_by_role("button", name="Palyginti 2").click()
    compare_dialog = page.locator("dialog.compare-dialog")
    expect(compare_dialog).to_have_attribute("open", "")
    expect(compare_dialog.locator("tbody tr")).to_have_count(2)
    compare_dialog.screenshot(
        path=str(SCREENSHOTS / "review-material-compare-desktop-1280.png"),
        animations="disabled",
    )
    page.keyboard.press("Escape")


def test_planner(page: Page) -> None:
    page.set_viewport_size(VIEWPORTS["mobile-375"])
    page.goto(f"{BASE_URL}/projektas/", wait_until="load")
    page.evaluate("localStorage.removeItem('granit-decor-project-plan-v1')")
    page.reload(wait_until="load")
    page.get_by_role("button", name="Tęsti").click()
    expect(page.locator(".planner-error-summary")).to_be_visible()
    page.screenshot(
        path=str(SCREENSHOTS / "review-planner-error-mobile-375.png"),
        full_page=True,
        animations="disabled",
    )

    page.locator("label.planner-choice:has(input[name='project-type'])").first.click()
    page.get_by_role("button", name="Tęsti").click()
    page.locator("#planner-description").fill("Virtuvės stalviršis naujam būstui Vilniuje.")
    page.locator("label.planner-choice:has(input[name='dimensions-status'][value='reikia-matavimo'])").click()
    page.get_by_role("button", name="Tęsti").click()
    page.locator("label.planner-choice:has(input[name='stone-decision'][value='reikia-rekomendacijos'])").click()
    page.get_by_role("button", name="Tęsti").click()
    page.locator("#planner-location").fill("Vilnius")
    page.locator("label.planner-choice:has(input[name='project-stage'])").first.click()
    page.locator("label.planner-choice:has(input[name='timing'])").first.click()
    page.get_by_role("button", name="Tęsti").click()
    page.locator("#planner-name").fill("Testas")
    page.locator("#planner-email").fill("test@example.com")
    page.locator("#planner-consent").click()
    page.get_by_role("button", name="Peržiūrėti planą").click()
    expect(page.get_by_role("heading", name="Jūsų projekto planas")).to_be_visible()
    expect(page.locator(".planner-review__sections")).to_contain_text("Vilnius")

    page.get_by_role("button", name="Kopijuoti santrauką").click()
    expect(page.locator(".planner-export-status")).to_contain_text("nukopijuota")
    with page.expect_download() as download_info:
        page.get_by_role("button", name="Atsisiųsti .txt").click()
    assert download_info.value.suggested_filename.startswith("granit-decor-projekto-planas-")

    page.reload(wait_until="load")
    expect(page.get_by_role("heading", name="Jūsų projekto planas")).to_be_visible()
    expect(page.locator(".planner-resume")).to_be_visible()


def test_contact_form(page: Page) -> None:
    page.set_viewport_size(VIEWPORTS["desktop-1280"])
    page.goto(f"{BASE_URL}/kontaktai/", wait_until="load")
    form = page.locator("form.demo-form")
    form.get_by_label("Vardas").fill("Testas")
    form.get_by_label("El. paštas arba telefonas").fill("test@example.com")
    form.get_by_label("Projekto tipas").select_option(label="Virtuvė")
    form.get_by_label("Trumpas projekto aprašymas").fill("Virtuvės stalviršis ir sala.")
    form.locator("input[name='consent']").check()
    form.get_by_role("button", name="Parengti užklausą").click()
    result = page.locator(".demo-form__result")
    expect(result).to_be_visible()
    expect(result).to_contain_text("duomenys nebuvo išsiųsti")
    result.screenshot(
        path=str(SCREENSHOTS / "review-contact-local-summary-desktop-1280.png"),
        animations="disabled",
    )


def check_keyboard_focus(page: Page) -> None:
    page.set_viewport_size(VIEWPORTS["desktop-1280"])
    page.goto(f"{BASE_URL}/", wait_until="load")
    page.keyboard.press("Tab")
    expect(page.locator(".skip-link")).to_be_focused()
    outline = page.locator(".skip-link").evaluate(
        "el => ({outline: getComputedStyle(el).outlineStyle, transform: getComputedStyle(el).transform})"
    )
    assert outline["outline"] != "none"


def test_motion_fallback(page: Page) -> None:
    page.emulate_media(reduced_motion="no-preference")
    page.set_viewport_size(VIEWPORTS["desktop-1280"])
    page.goto(f"{BASE_URL}/", wait_until="load")
    first_card = page.locator(".application-grid__item").first
    expect(first_card).to_have_css("opacity", "0")
    page.locator(".home-applications").scroll_into_view_if_needed()
    page.wait_for_timeout(1_250)
    expect(first_card).to_have_css("opacity", "1")

    page.emulate_media(reduced_motion="reduce")
    page.reload(wait_until="load")
    expect(page.locator(".application-grid__item").first).to_have_css("opacity", "1")


with sync_playwright() as playwright:
    launch_options = {"headless": True}
    if BROWSER_CANDIDATES:
        launch_options["executable_path"] = str(BROWSER_CANDIDATES[-1])
    browser = playwright.chromium.launch(**launch_options)
    context = browser.new_context(
        color_scheme="light",
        locale="lt-LT",
        permissions=["clipboard-read", "clipboard-write"],
    )
    context.add_init_script(
        """
        if (!sessionStorage.getItem('qa-cleaned')) {
          for (const key of Object.keys(localStorage)) {
            if (key.startsWith('granit-decor-')) localStorage.removeItem(key);
          }
          sessionStorage.setItem('qa-cleaned', 'true');
        }
        """
    )
    console_errors: list[str] = []
    failed_responses: list[str] = []

    def register_page(candidate: Page) -> None:
        candidate.on(
            "console",
            lambda message, current=candidate: console_errors.append(f"{current.url}: {message.text}")
            if message.type == "error"
            else None,
        )
        candidate.on(
            "pageerror",
            lambda error, current=candidate: console_errors.append(f"{current.url}: {error}"),
        )
        candidate.on(
            "response",
            lambda response: failed_responses.append(f"{response.status} {response.url}")
            if response.status >= 400
            else None,
        )

    if not INTERACTIONS_ONLY:
        smoke_all_routes()
        for page_slug, route in KEY_PAGES.items():
            capture_page = context.new_page()
            register_page(capture_page)
            for viewport_name in VIEWPORTS:
                capture(capture_page, page_slug, route, viewport_name)
            capture_page.close()
    if not CAPTURES_ONLY:
        page = context.new_page()
        register_page(page)
        page.emulate_media(reduced_motion="no-preference")
        test_mobile_navigation(page)
        test_content_parity_and_navigation(page)
        test_material_tools(page)
        test_planner(page)
        test_contact_form(page)
        check_keyboard_focus(page)
        test_motion_fallback(page)

    print(f"Screenshots captured: {len(list(SCREENSHOTS.glob('review-*.png')))}")
    print(f"Console errors: {len(console_errors)}")
    for error in console_errors:
        print(error)
    print(f"Failed responses: {len(failed_responses)}")
    for response in failed_responses:
        print(response)

    context.close()
    browser.close()

    if console_errors or failed_responses:
        raise SystemExit(1)
