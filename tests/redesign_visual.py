from pathlib import Path
import re
import sys


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".test-deps"))

from playwright.sync_api import expect, sync_playwright


SCREENSHOTS = ROOT / "tests" / "screenshots" / "redesign"
SCREENSHOTS.mkdir(parents=True, exist_ok=True)
BROWSER_CANDIDATES = sorted(
    (Path.home() / "Library" / "Caches" / "ms-playwright").glob(
        "chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell"
    )
)

MEGA_MENUS = (
    ("Gaminiai", "gaminiai", 8),
    ("Akmuo", "akmuo", 5),
    ("Projektai", "projektai", 5),
    ("Kaip dirbame", "kaip-dirbame", 3),
    ("Profesionalams", "profesionalams", 3),
    ("Apie mus", "apie-mus", 3),
)


with sync_playwright() as playwright:
    launch_options = {"headless": True}
    if BROWSER_CANDIDATES:
        launch_options["executable_path"] = str(BROWSER_CANDIDATES[-1])

    browser = playwright.chromium.launch(**launch_options)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    console_errors: list[str] = []
    failed_responses: list[str] = []
    page.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error" and "WebSocket connection" not in message.text
        else None,
    )
    page.on("pageerror", lambda error: console_errors.append(str(error)))
    page.on(
        "response",
        lambda response: failed_responses.append(f"{response.status} {response.url}")
        if response.status >= 400
        else None,
    )

    page.goto("http://127.0.0.1:3000/", wait_until="networkidle")
    expect(page.locator(".site-header__nav-trigger")).to_have_count(6)

    # Every desktop section is a click-pinnable, image-led mega menu.
    for label, menu_id, tile_count in MEGA_MENUS:
        trigger = page.get_by_role("button", name=label, exact=True)
        panel = page.locator(f"#site-header-{menu_id}-panel")
        trigger.click()
        expect(trigger).to_have_attribute("aria-expanded", "true")
        expect(panel).to_be_visible()
        expect(panel.locator(".site-header__mega-tile")).to_have_count(tile_count)
        expect(page.locator(".site-header__scrim")).to_be_visible()
        page.screenshot(path=str(SCREENSHOTS / f"menu-{menu_id}.png"))
        trigger.click()
        expect(trigger).to_have_attribute("aria-expanded", "false")
        expect(panel).to_have_count(0)

    # A pinned section switches directly when another trigger is clicked.
    service_trigger = page.get_by_role("button", name="Gaminiai", exact=True)
    material_trigger = page.get_by_role("button", name="Akmuo", exact=True)
    service_trigger.click()
    material_trigger.click()
    expect(page.locator("#site-header-gaminiai-panel")).to_have_count(0)
    expect(page.locator("#site-header-akmuo-panel")).to_be_visible()
    material_trigger.click()

    # Hovering transfers between sections, and moving into a panel keeps it open.
    page.mouse.move(20, 760)
    service_trigger.hover()
    expect(page.locator("#site-header-gaminiai-panel")).to_be_visible()
    material_trigger.hover()
    material_panel = page.locator("#site-header-akmuo-panel")
    expect(page.locator("#site-header-gaminiai-panel")).to_have_count(0)
    expect(material_panel).to_be_visible()
    material_panel.locator(".site-header__mega-tile").first.hover()
    page.wait_for_timeout(350)
    expect(material_panel).to_be_visible()

    # The dimmed page layer and Escape both close an expanded menu.
    page.locator(".site-header__scrim").click(position={"x": 20, "y": 800})
    expect(material_panel).to_have_count(0)
    service_trigger.click()
    page.keyboard.press("Escape")
    expect(page.locator("#site-header-gaminiai-panel")).to_have_count(0)
    expect(service_trigger).to_be_focused()

    # Salvatori-style utility layers are functional, not decorative.
    search_trigger = page.get_by_role("button", name="Atverti paiešką")
    search_trigger.click()
    search_dialog = page.locator("dialog.site-search")
    expect(search_dialog).to_have_attribute("open", "")
    searchbox = search_dialog.get_by_role(
        "searchbox", name="Ieškokite gaminio, akmens arba projekto"
    )
    expect(searchbox).to_be_focused()
    searchbox.fill("Patagonia")
    expect(search_dialog.get_by_role("link", name="Patagonia", exact=True)).to_be_visible()
    page.screenshot(path=str(SCREENSHOTS / "search-results.png"))
    search_dialog.get_by_role("button", name="Uždaryti paiešką").click()
    expect(search_dialog).not_to_have_attribute("open", "")

    saved_trigger = page.get_by_role("button", name=re.compile(r"^Išsaugoti akmenys:"))
    saved_trigger.click()
    saved_dialog = page.locator("dialog.saved-stones")
    expect(saved_dialog).to_have_attribute("open", "")
    expect(saved_dialog.get_by_role("heading", name="Jūsų kolekcija tuščia.")).to_be_visible()
    page.screenshot(path=str(SCREENSHOTS / "saved-stones-empty.png"))
    page.keyboard.press("Escape")
    expect(saved_dialog).not_to_have_attribute("open", "")

    location_trigger = page.get_by_role("button", name="Lentvaris", exact=True)
    location_trigger.click()
    location_dialog = page.locator("dialog.location-dialog")
    expect(location_dialog).to_have_attribute("open", "")
    expect(location_dialog.get_by_role("heading", name="Lentvaris")).to_be_visible()
    page.screenshot(path=str(SCREENSHOTS / "location-dialog.png"))
    page.keyboard.press("Escape")
    expect(location_dialog).not_to_have_attribute("open", "")

    for name, route in [
        ("gaminiai", "/gaminiai"),
        ("akmuo", "/akmuo"),
        ("kaip-dirbame", "/kaip-dirbame"),
        ("projektai", "/projektai"),
        ("virtuves-stalvirsiai", "/gaminiai/virtuves-stalvirsiai"),
        ("projekto-planas", "/projektas"),
    ]:
        page.goto(f"http://127.0.0.1:3000{route}", wait_until="networkidle")
        page.wait_for_timeout(650)
        page.screenshot(path=str(SCREENSHOTS / f"{name}-fold.png"))

    page.goto("http://127.0.0.1:3000/", wait_until="networkidle")
    page.evaluate("window.scrollTo(0, document.documentElement.scrollHeight)")
    page.locator("main a[href='/projektai/']").first.click()
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(450)
    route_scroll_y = page.evaluate("window.scrollY")
    print(f"Route scroll Y: {route_scroll_y}")
    assert route_scroll_y <= 1

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.goto("http://127.0.0.1:3000/", wait_until="networkidle")
    mobile.get_by_role("button", name="Meniu").click()
    mobile_dialog = mobile.locator("dialog.mobile-menu")
    expect(mobile_dialog).to_have_attribute("open", "")
    mobile_primary = mobile_dialog.get_by_role(
        "navigation", name="Pagrindinės svetainės skiltys"
    )
    expect(mobile_primary.get_by_role("button")).to_have_count(6)
    expect(mobile_primary.get_by_role("button", name="Gaminiai", exact=True)).to_be_focused()
    mobile.wait_for_timeout(500)
    mobile.screenshot(path=str(SCREENSHOTS / "menu-mobile-root.png"))

    mobile_primary.get_by_role("button", name="Gaminiai", exact=True).click()
    mobile_track = mobile_dialog.locator(".mobile-menu__track")
    expect(mobile_track).to_have_attribute("data-submenu", "gaminiai")
    mobile_section = mobile_dialog.locator(".mobile-menu__pane--section")
    expect(mobile_section.locator(".mobile-menu__section-links img")).to_have_count(0)
    expect(mobile_section.locator(".mobile-menu__section-links > div:first-child > a")).to_have_count(8)
    mobile.wait_for_timeout(550)
    expect(
        mobile_section.get_by_role("button", name="Grįžti į pagrindinį meniu")
    ).to_be_focused()
    mobile.screenshot(path=str(SCREENSHOTS / "menu-mobile-gaminiai.png"))

    mobile_section.get_by_role("button", name="Grįžti į pagrindinį meniu").click()
    expect(mobile_track).not_to_have_attribute("data-submenu", re.compile(r".+"))
    expect(mobile_primary.get_by_role("button", name="Gaminiai", exact=True)).to_be_focused()
    mobile_dialog.locator(".mobile-menu__pane--root").get_by_role(
        "button", name="Uždaryti meniu"
    ).click()
    expect(mobile_dialog).not_to_have_attribute("open", "")
    mobile.close()

    browser.close()

    print(f"Console errors: {len(console_errors)}")
    print(f"Failed responses: {len(failed_responses)}")
    if console_errors:
        print("\n".join(console_errors))
    if failed_responses:
        print("\n".join(failed_responses))
    if console_errors or failed_responses:
        raise SystemExit(1)
