from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / ".test-deps"))

from playwright.sync_api import sync_playwright

SCREENSHOTS = ROOT / "tests" / "screenshots"
SCREENSHOTS.mkdir(parents=True, exist_ok=True)
BROWSER_CANDIDATES = sorted(
    (Path.home() / "Library" / "Caches" / "ms-playwright").glob(
        "chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell"
    )
)


def inspect_home(page, name: str, width: int, height: int):
    page.set_viewport_size({"width": width, "height": height})
    page.goto("http://localhost:3000/", wait_until="networkidle")
    page.wait_for_timeout(1700)

    assert page.locator("h1").inner_text().strip().startswith("Akmens sprendimai")
    assert page.get_by_role("link", name="Pradėti projektą").first.is_visible()
    assert page.locator(".application-card").count() == 6
    assert page.locator(".material-editorial-card").count() == 5
    assert page.locator(".project-editorial-card").count() == 3

    page.screenshot(path=str(SCREENSHOTS / f"home-{name}-fold.png"))

    for section_name, selector in [
        ("applications", ".home-applications"),
        ("materials", ".home-materials"),
        ("projects", ".home-projects"),
        ("process", ".home-process"),
        ("final", ".home-final"),
    ]:
        page.locator(selector).scroll_into_view_if_needed()
        page.wait_for_timeout(900)
        page.screenshot(path=str(SCREENSHOTS / f"home-{name}-{section_name}.png"))

    page.screenshot(path=str(SCREENSHOTS / f"home-{name}.png"), full_page=True)


with sync_playwright() as playwright:
    launch_options = {"headless": True}
    if BROWSER_CANDIDATES:
        launch_options["executable_path"] = str(BROWSER_CANDIDATES[-1])
    browser = playwright.chromium.launch(**launch_options)
    page = browser.new_page()
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

    inspect_home(page, "desktop", 1440, 1000)
    inspect_home(page, "mobile", 390, 844)

    print(f"Console errors: {len(console_errors)}")
    for error in console_errors:
        print(error)

    print(f"Failed responses: {len(failed_responses)}")
    for response in failed_responses:
        print(response)

    browser.close()

    if console_errors or failed_responses:
        raise SystemExit(1)
