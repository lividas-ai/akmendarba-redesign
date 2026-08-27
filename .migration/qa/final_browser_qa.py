from __future__ import annotations

import json
import os
import time
from pathlib import Path

from playwright.sync_api import Error, TimeoutError, sync_playwright


BASE_URL = os.environ.get("QA_BASE_URL", "http://127.0.0.1:4173").rstrip("/")
OUTPUT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


results: list[dict[str, object]] = []
console_messages: list[dict[str, str]] = []
request_failures: list[dict[str, str]] = []


def record(name: str, passed: bool, detail: object = "") -> None:
    results.append({"name": name, "passed": passed, "detail": detail})


def wait_for_ready(page) -> None:
    try:
        page.wait_for_load_state("networkidle", timeout=30_000)
    except TimeoutError:
        record("networkidle reached", False, page.url)
    page.wait_for_timeout(750)


def goto(page, path: str):
    response = page.goto(f"{BASE_URL}{path}", wait_until="domcontentloaded", timeout=45_000)
    wait_for_ready(page)
    status = response.status if response else None
    record(f"GET {path}", status == 200, status)
    return response


def viewport_geometry(page) -> dict[str, object]:
    return page.evaluate(
        """
        () => ({
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        })
        """
    )


def element_box(page, selector: str) -> dict[str, float] | None:
    return page.eval_on_selector(
        selector,
        """
        (element) => {
          const rect = element.getBoundingClientRect();
          return {x: rect.x, y: rect.y, width: rect.width, height: rect.height,
                  top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left};
        }
        """,
    )


def check_no_overflow(page, label: str) -> None:
    geometry = viewport_geometry(page)
    record(f"{label}: no document horizontal overflow", not geometry["overflow"], geometry)


def check_visible_heading(page, label: str) -> None:
    headings = page.locator("h1")
    count = headings.count()
    visible = count > 0 and headings.first.is_visible()
    text = headings.first.inner_text().strip() if visible else ""
    record(f"{label}: visible H1", bool(visible and text), {"count": count, "text": text})


def check_home_video(page, viewport_name: str) -> None:
    video = page.locator(".home-hero__video")
    record(f"{viewport_name}: hero video exists", video.count() == 1, video.count())
    if video.count() != 1:
        return

    try:
        page.wait_for_function(
            """() => {
              const video = document.querySelector('.home-hero__video');
              return video && !video.paused && video.currentTime > 0;
            }""",
            timeout=18_000,
        )
    except TimeoutError:
        pass

    state = video.evaluate(
        """
        (element) => ({
          autoplay: element.autoplay,
          muted: element.muted,
          loop: element.loop,
          playsInline: element.playsInline,
          paused: element.paused,
          currentTime: element.currentTime,
          currentSrc: element.currentSrc,
          readyState: element.readyState,
          networkState: element.networkState,
          videoWidth: element.videoWidth,
          videoHeight: element.videoHeight,
          error: element.error ? {code: element.error.code, message: element.error.message} : null,
        })
        """
    )
    should_be_mobile = viewport_name in {"tablet", "mobile", "narrow"}
    expected_source = (
        "granit-decor-kitchen-orbit-v3-mobile-parity-810x1440.mp4"
        if should_be_mobile
        else "granit-decor-kitchen-orbit-v2-desktop-2560.mp4"
    )
    record(f"{viewport_name}: correct hero source selected", expected_source in state["currentSrc"], state)
    record(
        f"{viewport_name}: hero autoplay is active",
        bool(
            state["autoplay"]
            and state["muted"]
            and state["loop"]
            and state["playsInline"]
            and not state["paused"]
            and state["currentTime"] > 0
            and state["readyState"] >= 2
            and not state["error"]
        ),
        state,
    )

    hero_box = element_box(page, ".home-hero")
    video_box = element_box(page, ".home-hero__video")
    geometry = viewport_geometry(page)
    first_view_visible = bool(
        hero_box
        and video_box
        and hero_box["top"] < geometry["viewportHeight"]
        and hero_box["bottom"] > 0
        and video_box["top"] < geometry["viewportHeight"]
        and video_box["bottom"] > 0
        and video_box["width"] >= geometry["viewportWidth"] - 2
    )
    record(
        f"{viewport_name}: hero media fills first viewport width",
        first_view_visible,
        {"hero": hero_box, "video": video_box, "viewport": geometry},
    )

    playback_button = page.locator(".home-hero__playback")
    record(
        f"{viewport_name}: playback control is visible and named",
        playback_button.count() == 1
        and playback_button.is_visible()
        and bool(playback_button.get_attribute("aria-label")),
        playback_button.get_attribute("aria-label") if playback_button.count() else None,
    )

    primary_action = page.locator(".home-hero__text-action")
    secondary_action = page.locator(".home-hero__project")
    if primary_action.count() == 1 and secondary_action.count() == 1 and secondary_action.is_visible():
        primary_box = element_box(page, ".home-hero__text-action")
        secondary_box = element_box(page, ".home-hero__project")
        overlaps = bool(
            primary_box
            and secondary_box
            and primary_box["left"] < secondary_box["right"]
            and primary_box["right"] > secondary_box["left"]
            and primary_box["top"] < secondary_box["bottom"]
            and primary_box["bottom"] > secondary_box["top"]
        )
        record(
            f"{viewport_name}: hero actions do not overlap",
            not overlaps,
            {"primary": primary_box, "secondary": secondary_box},
        )


def check_desktop_navigation(page) -> None:
    nav = page.locator(".site-header__nav")
    record("desktop: primary navigation visible", nav.is_visible(), nav.count())

    for menu_id, label in (("gaminiai", "Gaminiai"), ("akmuo", "Akmuo"), ("projektai", "Projektai"), ("kaip-dirbame", "Kaip dirbame")):
        trigger = page.locator(f"#site-header-{menu_id}-trigger")
        trigger.click()
        panel = page.locator(f"#site-header-{menu_id}-panel")
        panel.wait_for(state="visible", timeout=5_000)
        panel.hover()
        page.wait_for_timeout(400)
        still_visible = panel.is_visible() and trigger.get_attribute("aria-expanded") == "true"
        images = panel.locator("img")
        if images.count():
            try:
                page.wait_for_function(
                    "selector => [...document.querySelectorAll(selector)].every(img => img.complete && img.naturalWidth > 0)",
                    arg=f"#{panel.get_attribute('id')} img",
                    timeout=8_000,
                )
            except TimeoutError:
                pass
        loaded_images = 0
        for index in range(images.count()):
            if images.nth(index).evaluate("img => img.complete && img.naturalWidth > 0"):
                loaded_images += 1
        record(
            f"desktop: {label} dropdown pins and remains selectable",
            still_visible,
            {"images": images.count(), "loadedImages": loaded_images},
        )
        if menu_id != "kaip-dirbame":
            record(
                f"desktop: {label} dropdown images loaded",
                images.count() > 0 and loaded_images == images.count(),
                {"images": images.count(), "loadedImages": loaded_images},
            )
        page.keyboard.press("Escape")
        panel.wait_for(state="hidden", timeout=5_000)
        page.wait_for_timeout(200)

    direct_links = page.locator(".site-header__nav a.site-header__nav-link")
    direct_texts = [direct_links.nth(index).inner_text().strip() for index in range(direct_links.count())]
    direct_triggers = page.locator("#site-header-profesionalams-trigger, #site-header-apie-mus-trigger").count()
    record(
        "desktop: Professionals and About are direct links without dropdowns",
        "Profesionalams" in direct_texts and "Apie mus" in direct_texts and direct_triggers == 0,
        {"directLinks": direct_texts, "unexpectedTriggers": direct_triggers},
    )


def check_mobile_navigation(page, viewport_name: str) -> None:
    menu_button = page.locator(".site-header__menu-button")
    record(f"{viewport_name}: menu button visible", menu_button.is_visible(), menu_button.count())
    menu_button.click()
    dialog = page.locator("dialog.mobile-menu")
    dialog.wait_for(state="visible", timeout=5_000)
    record(f"{viewport_name}: mobile menu opens", dialog.evaluate("dialog => dialog.open"), "dialog.open")

    root_nav = dialog.locator(".mobile-menu__primary")
    for label in ("Gaminiai", "Akmuo"):
        root_nav.get_by_role("button", name=label, exact=True).click()
        section = dialog.locator(".mobile-menu__pane--section")
        section_name = section.locator(".mobile-menu__top--section strong").inner_text().strip()
        tiles = section.locator(".mobile-menu__visual-tile")
        images = section.locator(".mobile-menu__visual-tile img")
        if images.count():
            try:
                page.wait_for_function(
                    "() => [...document.querySelectorAll('.mobile-menu__pane--section .mobile-menu__visual-tile img')].every(img => img.complete && img.naturalWidth > 0)",
                    timeout=8_000,
                )
            except TimeoutError:
                pass
        loaded = sum(
            1
            for index in range(images.count())
            if images.nth(index).evaluate("img => img.complete && img.naturalWidth > 0")
        )
        record(
            f"{viewport_name}: {label} submenu has compact visual guidance",
            section_name == label and tiles.count() > 0 and loaded == images.count(),
            {"section": section_name, "tiles": tiles.count(), "images": images.count(), "loadedImages": loaded},
        )
        section.locator(".mobile-menu__top--section button").first.click()
        page.wait_for_timeout(200)

    direct_prof = root_nav.get_by_role("link", name="Profesionalams", exact=True).count()
    direct_about = root_nav.get_by_role("link", name="Apie mus", exact=True).count()
    record(
        f"{viewport_name}: Professionals and About remain direct links",
        direct_prof == 1 and direct_about == 1,
        {"professionals": direct_prof, "about": direct_about},
    )
    dialog.locator(".mobile-menu__close").first.click()
    dialog.wait_for(state="hidden", timeout=5_000)


def check_route(page, path: str, label: str, screenshot_name: str) -> None:
    goto(page, path)
    check_visible_heading(page, label)
    check_no_overflow(page, label)
    page.screenshot(path=str(OUTPUT_DIR / screenshot_name), full_page=False)
    response = page.reload(wait_until="domcontentloaded", timeout=45_000)
    wait_for_ready(page)
    status = response.status if response else None
    record(f"{label}: direct refresh", status == 200, status)


def check_planner(page) -> None:
    goto(page, "/projektas/")
    check_visible_heading(page, "planner")
    check_no_overflow(page, "planner")

    local_notice = page.locator(".planner-aside__privacy")
    notice_text = local_notice.inner_text().strip() if local_notice.count() else ""
    record(
        "planner: demo does not claim to send data or files",
        "nėra siunčiami" in notice_text,
        notice_text,
    )

    page.locator("#planner-project-type input[type=radio]").first.evaluate("input => input.click()")
    page.get_by_role("button", name="Tęsti", exact=True).click()
    page.locator("#planner-files").wait_for(state="attached", timeout=5_000)
    file_input = page.locator("#planner-files")
    record(
        "planner: accepts project drawing/image formats",
        file_input.get_attribute("multiple") is not None
        and all(ext in (file_input.get_attribute("accept") or "") for ext in (".pdf", ".dwg", ".dxf", ".jpg", ".png", ".heic")),
        {"accept": file_input.get_attribute("accept"), "multiple": file_input.get_attribute("multiple")},
    )
    file_input.set_input_files(
        {"name": "demo-project.pdf", "mimeType": "application/pdf", "buffer": b"%PDF-1.4\n% QA fixture\n"}
    )
    file_item = page.locator(".planner-file-list li")
    upload_note = page.locator(".planner-upload__local-note")
    upload_note_text = upload_note.inner_text().strip() if upload_note.count() else ""
    record(
        "planner: selected file appears locally",
        file_item.count() == 1 and "demo-project.pdf" in file_item.first.inner_text(),
        file_item.first.inner_text().strip() if file_item.count() else "",
    )
    record(
        "planner: file lifetime is disclosed",
        "tik šiame puslapyje" in upload_note_text and "perkrovimo" in upload_note_text,
        upload_note_text,
    )
    page.screenshot(path=str(OUTPUT_DIR / "planner-file-upload-mobile.png"), full_page=False)

    page.reload(wait_until="domcontentloaded", timeout=45_000)
    wait_for_ready(page)
    persisted_file_names = page.get_by_text("demo-project.pdf", exact=False).count()
    record("planner: file is not falsely persisted after refresh", persisted_file_names == 0, persisted_file_names)


def attach_event_logging(page, scope: str) -> None:
    def on_console(message) -> None:
        if message.type in {"error", "warning"}:
            console_messages.append({"scope": scope, "type": message.type, "text": message.text})

    def on_request_failed(request) -> None:
        failure = request.failure or "unknown failure"
        request_failures.append({"scope": scope, "method": request.method, "url": request.url, "failure": failure})

    page.on("console", on_console)
    page.on("requestfailed", on_request_failed)


def run() -> int:
    with sync_playwright() as playwright:
        chrome_path = os.environ.get(
            "QA_CHROME_PATH",
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
        )
        browser = playwright.chromium.launch(
            headless=True,
            executable_path=chrome_path if Path(chrome_path).exists() else None,
        )

        viewports = {
            "desktop": {"width": 1440, "height": 900},
            "tablet": {"width": 768, "height": 1024},
            "mobile": {"width": 390, "height": 844},
            "narrow": {"width": 320, "height": 700},
        }

        for viewport_name, viewport in viewports.items():
            context = browser.new_context(viewport=viewport, locale="lt-LT")
            page = context.new_page()
            attach_event_logging(page, viewport_name)
            goto(page, "/")
            check_no_overflow(page, f"{viewport_name} home")
            check_visible_heading(page, f"{viewport_name} home")
            check_home_video(page, viewport_name)
            if viewport_name == "desktop":
                check_desktop_navigation(page)
            else:
                check_mobile_navigation(page, viewport_name)
            page.screenshot(path=str(OUTPUT_DIR / f"home-{viewport_name}.png"), full_page=False)
            context.close()

        context = browser.new_context(viewport={"width": 390, "height": 844}, locale="lt-LT")
        page = context.new_page()
        attach_event_logging(page, "routes-mobile")
        check_route(page, "/akmuo/calacatta-paonazzo/", "material page", "material-mobile.png")
        check_route(page, "/gaminiai/virtuves-stalvirsiai/", "product page", "product-mobile.png")
        check_route(page, "/projektai/granit-decor-darbai-03/", "project page", "project-mobile.png")
        project_images = page.locator("main img")
        visible_images = sum(1 for index in range(project_images.count()) if project_images.nth(index).is_visible())
        record(
            "project page: structured multi-image story",
            project_images.count() >= 3 and visible_images >= 1,
            {"images": project_images.count(), "visibleInCurrentViewport": visible_images},
        )
        check_planner(page)
        context.close()

        browser.close()

    unexpected_console = [item for item in console_messages if item["type"] == "error"]
    meaningful_failures = [
        item
        for item in request_failures
        if "ERR_ABORTED" not in item["failure"] and not item["url"].startswith("data:")
    ]
    record("no browser console errors", len(unexpected_console) == 0, unexpected_console)
    record("no meaningful request failures", len(meaningful_failures) == 0, meaningful_failures)

    report = {
        "baseUrl": BASE_URL,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "summary": {
            "checks": len(results),
            "passed": sum(1 for item in results if item["passed"]),
            "failed": sum(1 for item in results if not item["passed"]),
            "consoleMessages": len(console_messages),
            "requestFailures": len(request_failures),
        },
        "results": results,
        "consoleMessages": console_messages,
        "requestFailures": request_failures,
    }
    (OUTPUT_DIR / "final-browser-qa.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n")

    markdown = [
        "# Final browser QA",
        "",
        f"- Base URL: `{BASE_URL}`",
        f"- Checks: {report['summary']['checks']}",
        f"- Passed: {report['summary']['passed']}",
        f"- Failed: {report['summary']['failed']}",
        f"- Console warnings/errors captured: {len(console_messages)}",
        f"- Request failures captured: {len(request_failures)}",
        "",
        "## Checks",
        "",
    ]
    for item in results:
        marker = "PASS" if item["passed"] else "FAIL"
        detail = json.dumps(item["detail"], ensure_ascii=False) if not isinstance(item["detail"], str) else item["detail"]
        markdown.append(f"- **{marker}** — {item['name']} — {detail}")
    markdown.extend(["", "## Console messages", ""])
    markdown.extend(f"- `{item['scope']}` {item['type']}: {item['text']}" for item in console_messages)
    if not console_messages:
        markdown.append("- None")
    markdown.extend(["", "## Request failures", ""])
    markdown.extend(
        f"- `{item['scope']}` {item['method']} {item['url']} — {item['failure']}" for item in request_failures
    )
    if not request_failures:
        markdown.append("- None")
    (OUTPUT_DIR / "final-browser-qa.md").write_text("\n".join(markdown) + "\n")

    return 1 if report["summary"]["failed"] else 0


if __name__ == "__main__":
    try:
        raise SystemExit(run())
    except Error as error:
        (OUTPUT_DIR / "fatal-error.txt").write_text(f"{type(error).__name__}: {error}\n")
        raise
