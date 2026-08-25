from __future__ import annotations

import sys
from pathlib import Path
from urllib.parse import urlparse


PROJECT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT / ".test-deps"))

from playwright.sync_api import expect, sync_playwright


BASE_URL = "http://127.0.0.1:3000"
SCREENSHOTS = PROJECT / ".design" / "navigation-system"
SCREENSHOTS.mkdir(parents=True, exist_ok=True)
PANELS = {
    "Kaip dirbame": ("kaip-dirbame", ["/kaip-dirbame", "/projektas"]),
}
DIRECT_LINKS = {
    "Profesionalams": "/profesionalams",
    "Apie mus": "/apie-mus",
}


def link_paths(locator) -> list[str]:
    return [
        urlparse(href).path.rstrip("/") or "/"
        for href in locator.evaluate_all("els => els.map(el => el.href)")
    ]


browser_candidates = sorted(
    (Path.home() / "Library" / "Caches" / "ms-playwright").glob(
        "chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell"
    )
)

with sync_playwright() as playwright:
    launch_options = {"headless": True}
    if browser_candidates:
        launch_options["executable_path"] = str(browser_candidates[-1])

    browser = playwright.chromium.launch(**launch_options)
    page = browser.new_page(locale="lt-LT", viewport={"width": 1280, "height": 800})
    page.goto(BASE_URL, wait_until="load")

    for label, (menu_id, expected_paths) in PANELS.items():
        trigger = page.get_by_role("button", name=label, exact=True)
        trigger.click()
        panel = page.locator(f"#site-header-{menu_id}-panel")
        expect(panel).to_have_attribute("data-presentation", "plain")
        expect(panel.locator("img")).to_have_count(0)
        links = panel.locator(".site-header__mega-plain-links > a")
        expect(links).to_have_count(len(expected_paths))
        actual_paths = link_paths(links)
        assert actual_paths == expected_paths, (label, actual_paths)
        assert len(actual_paths) == len(set(actual_paths)), (label, actual_paths)
        assert panel.bounding_box()["height"] < 260, f"{label}: panel is not compact"
        trigger.click()

    for label, expected_path in DIRECT_LINKS.items():
        direct_link = page.locator(".site-header__nav").get_by_role(
            "link", name=label, exact=True
        )
        assert link_paths(direct_link) == [expected_path]
        direct_link.hover()
        page.wait_for_timeout(350)
        expect(page.locator(".site-header__mega")).to_have_count(0)
        expect(page.locator(".site-header__scrim")).to_have_count(0)
        direct_link.click()
        expect(page).to_have_url(f"{BASE_URL}{expected_path}/")
        page.goto(BASE_URL, wait_until="load")

    page.get_by_role("button", name="Kaip dirbame", exact=True).click()
    process_links = page.locator("#site-header-kaip-dirbame-panel .site-header__mega-plain-links > a")
    normal_style = process_links.nth(0).evaluate(
        "el => ({ color: getComputedStyle(el).color, weight: getComputedStyle(el).fontWeight })"
    )
    project_style = process_links.nth(1).evaluate(
        "el => ({ color: getComputedStyle(el).color, weight: getComputedStyle(el).fontWeight })"
    )
    assert normal_style != project_style, (normal_style, project_style)
    page.screenshot(
        path=str(SCREENSHOTS / "plain-panel-kaip-dirbame-desktop.png"),
        animations="disabled",
    )

    page.set_viewport_size({"width": 375, "height": 812})
    page.goto(BASE_URL, wait_until="load")
    page.get_by_role("button", name="Meniu").click()
    dialog = page.locator("dialog.mobile-menu")

    for label, (menu_id, expected_paths) in PANELS.items():
        dialog.locator(".mobile-menu__pane--root").get_by_role(
            "button", name=label, exact=True
        ).click()
        page.wait_for_timeout(550)
        track = dialog.locator(".mobile-menu__track")
        expect(track).to_have_attribute("data-submenu", menu_id)
        section_box = dialog.locator(".mobile-menu__pane--section").bounding_box()
        assert section_box and abs(section_box["x"]) <= 1, (label, section_box)
        assert section_box["width"] >= 375, (label, section_box)
        links = dialog.locator(".mobile-menu__plain-links > a")
        expect(links).to_have_count(len(expected_paths))
        actual_paths = link_paths(links)
        assert actual_paths == expected_paths, (label, actual_paths)
        assert len(actual_paths) == len(set(actual_paths)), (label, actual_paths)
        assert dialog.locator(".mobile-menu__section-links img").count() == 0
        heights = links.evaluate_all("els => els.map(el => el.getBoundingClientRect().height)")
        assert all(height >= 44 for height in heights), (label, heights)
        if menu_id == "kaip-dirbame":
            page.screenshot(
                path=str(SCREENSHOTS / "plain-panel-kaip-dirbame-mobile.png"),
                animations="disabled",
            )
        dialog.get_by_role("button", name="Grįžti į pagrindinį meniu").click()
        page.wait_for_timeout(550)

    root_navigation = dialog.locator(".mobile-menu__pane--root").get_by_role(
        "navigation", name="Pagrindinės svetainės skiltys"
    )
    direct_mobile_links = root_navigation.get_by_role("link")
    expect(direct_mobile_links).to_have_count(2)
    heights = direct_mobile_links.evaluate_all(
        "els => els.map(el => el.getBoundingClientRect().height)"
    )
    assert all(height >= 44 for height in heights), heights

    for label, expected_path in DIRECT_LINKS.items():
        direct_link = root_navigation.get_by_role("link", name=label, exact=True)
        assert link_paths(direct_link) == [expected_path]
        direct_link.click()
        expect(page).to_have_url(f"{BASE_URL}{expected_path}/")
        expect(dialog).not_to_have_attribute("open", "")

        if label != list(DIRECT_LINKS)[-1]:
            page.goto(BASE_URL, wait_until="load")
            page.get_by_role("button", name="Meniu").click()
            dialog = page.locator("dialog.mobile-menu")
            root_navigation = dialog.locator(".mobile-menu__pane--root").get_by_role(
                "navigation", name="Pagrindinės svetainės skiltys"
            )

    browser.close()

print("Panel and direct-link navigation: desktop and mobile checks passed")
