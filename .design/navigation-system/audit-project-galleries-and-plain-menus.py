from __future__ import annotations

import json
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import Page, sync_playwright


ROOT = Path.cwd()
BASE_URL = "http://127.0.0.1:3000"
SCREENSHOT_DIR = ROOT / ".design" / "navigation-system" / "screenshots" / "project-gallery-plain-menu"

PROJECT_ROUTES = {
    "kitchen": "/projektai/granit-decor-darbai-03/",
    "bathroom": "/projektai/granit-decor-darbai-30/",
    "interior": "/projektai/granit-decor-darbai-24/",
}

MENU_DESTINATIONS = {
    "kaip-dirbame": ["/kaip-dirbame", "/projektas"],
    "profesionalams": ["/profesionalams"],
    "apie-mus": ["/apie-mus"],
}


def normalize_href(href: str) -> str:
    parsed = urlparse(href)
    path = parsed.path.rstrip("/") or "/"
    return path


def prepare(page: Page, route: str) -> None:
    page.emulate_media(reduced_motion="reduce")
    page.goto(f"{BASE_URL}{route}", wait_until="networkidle")
    page.locator("main").wait_for(state="visible")
    page.evaluate(
        """
        async () => {
          const step = Math.max(420, Math.floor(innerHeight * 0.7));
          for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
            scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 35));
          }
          scrollTo(0, 0);
        }
        """
    )
    page.wait_for_timeout(180)


def overflow(page: Page) -> float:
    return page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")


def audit_project(page: Page, name: str, route: str) -> dict:
    prepare(page, route)
    images = page.locator("main img")
    records = images.evaluate_all(
        """
        (nodes) => nodes.map((image) => ({
          src: image.currentSrc || image.src,
          alt: image.alt,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        }))
        """
    )
    headings = page.locator("main h2, main h3").all_text_contents()
    page.locator("main").screenshot(path=str(SCREENSHOT_DIR / f"project-{name}-desktop-1470.png"))

    return {
        "route": route,
        "imageCount": len(records),
        "uniqueImageCount": len({record["src"] for record in records}),
        "brokenImages": [record["src"] for record in records if record["naturalWidth"] == 0],
        "missingAltCount": len([record for record in records if not record["alt"].strip()]),
        "headings": [heading.strip() for heading in headings if heading.strip()],
        "horizontalOverflow": overflow(page),
    }


def audit_desktop_menu(page: Page, menu_id: str, expected_paths: list[str]) -> dict:
    page.goto(f"{BASE_URL}/", wait_until="networkidle")
    trigger = page.locator(f"#site-header-{menu_id}-trigger")
    trigger.click()
    panel = page.locator(f"#site-header-{menu_id}-panel")
    panel.wait_for(state="visible")

    links = panel.locator("a[href]")
    hrefs = [normalize_href(href) for href in links.evaluate_all("nodes => nodes.map(node => node.href)")]
    labels = [label.strip() for label in links.all_text_contents()]
    heights = links.evaluate_all("nodes => nodes.map(node => node.getBoundingClientRect().height)")
    panel.screenshot(path=str(SCREENSHOT_DIR / f"menu-{menu_id}-desktop-1470.png"))

    return {
        "expectedPaths": expected_paths,
        "paths": hrefs,
        "labels": labels,
        "uniqueDestinationCount": len(set(hrefs)),
        "imageCount": panel.locator("img").count(),
        "minimumControlHeight": min(heights) if heights else 0,
        "matchesExpected": hrefs == expected_paths,
    }


def audit_mobile_menu(page: Page, menu_id: str, expected_paths: list[str]) -> dict:
    page.goto(f"{BASE_URL}/", wait_until="networkidle")
    page.locator(".site-header__menu-button").click()
    dialog = page.locator(".mobile-menu")
    dialog.wait_for(state="visible")

    label = {
        "kaip-dirbame": "Kaip dirbame",
        "profesionalams": "Profesionalams",
        "apie-mus": "Apie mus",
    }[menu_id]
    page.locator(".mobile-menu__primary").get_by_role("button", name=label, exact=True).click()

    links = page.locator(".mobile-menu__section-links a[href]")
    hrefs = [normalize_href(href) for href in links.evaluate_all("nodes => nodes.map(node => node.href)")]
    heights = links.evaluate_all("nodes => nodes.map(node => node.getBoundingClientRect().height)")
    dialog.screenshot(path=str(SCREENSHOT_DIR / f"menu-{menu_id}-mobile-375.png"))

    return {
        "expectedPaths": expected_paths,
        "paths": hrefs,
        "uniqueDestinationCount": len(set(hrefs)),
        "imageCount": dialog.locator(".mobile-menu__pane--section img").count(),
        "minimumControlHeight": min(heights) if heights else 0,
        "matchesExpected": hrefs == expected_paths,
    }


def main() -> None:
    SCREENSHOT_DIR.mkdir(parents=True, exist_ok=True)
    report: dict[str, object] = {
        "projects": {},
        "desktopMenus": {},
        "mobileMenus": {},
        "consoleErrors": [],
    }
    console_errors: list[str] = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(channel="chrome", headless=True)
        desktop = browser.new_page(viewport={"width": 1470, "height": 956}, device_scale_factor=1)
        desktop.on("pageerror", lambda error: console_errors.append(str(error)))
        desktop.on(
            "console",
            lambda message: console_errors.append(message.text) if message.type == "error" else None,
        )

        for name, route in PROJECT_ROUTES.items():
            report["projects"][name] = audit_project(desktop, name, route)

        for menu_id, expected_paths in MENU_DESTINATIONS.items():
            report["desktopMenus"][menu_id] = audit_desktop_menu(desktop, menu_id, expected_paths)

        desktop.set_viewport_size({"width": 735, "height": 956})
        prepare(desktop, PROJECT_ROUTES["kitchen"])
        report["twoHundredPercentZoomEquivalent"] = {
            "viewport": "735x956",
            "horizontalOverflow": overflow(desktop),
        }

        desktop.set_viewport_size({"width": 1470, "height": 956})
        prepare(desktop, PROJECT_ROUTES["kitchen"])
        desktop.evaluate("document.documentElement.dir = 'rtl'")
        report["rtlMirror"] = {"horizontalOverflow": overflow(desktop)}
        desktop.close()

        mobile = browser.new_page(viewport={"width": 375, "height": 812}, device_scale_factor=1)
        mobile.on("pageerror", lambda error: console_errors.append(str(error)))
        mobile.on(
            "console",
            lambda message: console_errors.append(message.text) if message.type == "error" else None,
        )
        for menu_id, expected_paths in MENU_DESTINATIONS.items():
            report["mobileMenus"][menu_id] = audit_mobile_menu(mobile, menu_id, expected_paths)

        prepare(mobile, PROJECT_ROUTES["kitchen"])
        report["mobileProject"] = {
            "imageCount": mobile.locator("main img").count(),
            "horizontalOverflow": overflow(mobile),
        }
        mobile.locator("main").screenshot(path=str(SCREENSHOT_DIR / "project-kitchen-mobile-375.png"))
        mobile.close()
        browser.close()

    report["consoleErrors"] = sorted(set(console_errors))
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
