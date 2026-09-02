import { pathToFileURL } from "node:url";

const playwrightModule = process.env.PLAYWRIGHT_MODULE;
const playwrightImport = playwrightModule
  ? await import(pathToFileURL(playwrightModule).href)
  : await import("playwright");
const { chromium } = playwrightImport.default ?? playwrightImport;

const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM }
    : {}),
});
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const routes = [
  "/",
  "/apie-mus/",
  "/paminklai/",
  "/kapo-dengimai/",
  "/aksesuarai/",
  "/apdaila/",
  "/akmuo/",
  "/galerija/",
  "/galerija/paminklu-galerija/",
  "/galerija/kapo-dengimu-galerija/",
  "/galerija/aksesuaru-galerija/",
  "/galerija/apdailos-galerija/",
  "/kontaktai/",
  "/slapukai/",
  "/cookie-policy/",
];
const viewports = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "mobile", width: 390, height: 844 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const routeResults = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const pageErrors = [];
    const consoleErrors = [];
    const failedLocalResponses = [];

    page.on("pageerror", (error) => pageErrors.push(String(error)));
    page.on("console", (message) => {
      if (message.type() === "error" && !message.text().includes("WebSocket connection")) {
        consoleErrors.push(message.text());
      }
    });
    page.on("response", (response) => {
      if (response.status() >= 400 && response.url().startsWith(baseUrl)) {
        failedLocalResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    try {
      for (const route of routes) {
        const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
        assert(response?.status() === 200, `${viewport.label} ${route} returned ${response?.status()}`);

        const heading = page.locator("main h1").first();
        assert((await heading.count()) === 1 && await heading.isVisible(), `${viewport.label} ${route} has no visible H1`);
        assert(Boolean((await heading.textContent())?.trim()), `${viewport.label} ${route} has an empty H1`);

        const geometry = await page.evaluate(() => ({
          viewportWidth: document.documentElement.clientWidth,
          documentWidth: document.documentElement.scrollWidth,
        }));
        assert(
          geometry.documentWidth <= geometry.viewportWidth + 1,
          `${viewport.label} ${route} overflows horizontally (${geometry.documentWidth} > ${geometry.viewportWidth})`,
        );

        routeResults.push({
          viewport: viewport.label,
          route,
          status: response.status(),
          heading: (await heading.textContent()).trim(),
          overflow: false,
        });

        if (route === "/") {
          const cookieButton = page.getByRole("button", { name: "Supratau" });
          if ((await cookieButton.count()) > 0 && await cookieButton.isVisible()) await cookieButton.click();

          const video = page.locator(".ak-hero__video");
          assert((await video.count()) === 1, `${viewport.label} homepage hero video is missing`);
          await page.waitForFunction(() => {
            const element = document.querySelector(".ak-hero__video");
            return element instanceof HTMLVideoElement && element.currentTime > 0 && !element.paused;
          });
          const videoState = await video.evaluate((element) => ({
            autoplay: element.autoplay,
            loop: element.loop,
            muted: element.muted,
            playsInline: element.playsInline,
            readyState: element.readyState,
          }));
          assert(
            videoState.autoplay && videoState.loop && videoState.muted && videoState.playsInline && videoState.readyState >= 2,
            `${viewport.label} homepage video is not in the required autoplay-loop state`,
          );
          await page.screenshot({ path: `.migration/qa/home-${viewport.label}.png` });
        }
      }

      assert(pageErrors.length === 0, `${viewport.label} page errors: ${pageErrors.join(" | ")}`);
      assert(consoleErrors.length === 0, `${viewport.label} console errors: ${consoleErrors.join(" | ")}`);
      assert(failedLocalResponses.length === 0, `${viewport.label} failed local responses: ${failedLocalResponses.join(" | ")}`);
    } finally {
      await page.close();
    }
  }

  console.log(JSON.stringify({
    routes: routes.length,
    viewports: viewports.map(({ label, width, height }) => ({ label, width, height })),
    checks: routeResults.length * 4 + viewports.length * 3 + 4,
    routeResults,
    failures: [],
  }, null, 2));
} finally {
  await browser.close();
}
