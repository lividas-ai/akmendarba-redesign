import { mkdir } from "node:fs/promises";
import { chromium } from "/Users/linas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3000";
const outputDir = new URL("../screenshots/", import.meta.url);
const routes = [
  "/",
  "/gaminiai",
  "/gaminiai/virtuves-stalvirsiai",
  "/akmuo",
  "/akmuo/calacatta-paonazzo",
  "/projektai",
  "/projektai/granit-decor-darbai-03",
  "/kaip-dirbame",
  "/profesionalams",
  "/apie-mus",
  "/projektas",
  "/kontaktai",
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});

const failures = [];

try {
  for (const viewport of [
    { name: "mobile-375", width: 375, height: 812 },
    { name: "tablet-768", width: 768, height: 1024 },
  ]) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "no-preference",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    for (const route of routes) {
      errors.length = 0;
      await page.goto(new URL(route, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 90_000 });
      await page.waitForTimeout(700);

      const result = await page.evaluate(() => {
        const wordmark = document.querySelector(".site-header__inner .wordmark__name");
        const heading = document.querySelector("main h1");
        const largeImages = [...document.querySelectorAll("main img")]
          .map((image) => {
            const rect = image.getBoundingClientRect();
            return { alt: image.getAttribute("alt") ?? "", width: Math.round(rect.width), height: Math.round(rect.height) };
          })
          .filter((image) => image.height > window.innerHeight * 0.92 && image.width > window.innerWidth * 0.85);

        return {
          contentWidth: document.documentElement.scrollWidth,
          heading: heading?.textContent?.trim() ?? null,
          largeImages,
          viewportWidth: document.documentElement.clientWidth,
          wordmarkDisplay: wordmark ? getComputedStyle(wordmark).display : null,
        };
      });

      const routeFailures = [
        ...(result.contentWidth > result.viewportWidth + 1 ? [`horizontal overflow ${result.contentWidth}/${result.viewportWidth}`] : []),
        ...(result.wordmarkDisplay === "none" ? ["wordmark hidden"] : []),
        ...errors,
      ];
      if (routeFailures.length) failures.push({ route, viewport: viewport.name, failures: routeFailures });
      process.stdout.write(`${viewport.name} ${route}: ${JSON.stringify(result)}\n`);

      const screenshotNames = {
        "/gaminiai/virtuves-stalvirsiai": "product",
        "/akmuo/calacatta-paonazzo": "stone",
        "/projektai/granit-decor-darbai-03": "project",
        "/projektas": "project-form",
      };
      if (screenshotNames[route]) {
        await page.screenshot({
          path: new URL(`review-${screenshotNames[route]}-final-${viewport.name}.png`, outputDir).pathname,
          fullPage: false,
        });
      }
    }

    await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90_000 });
    await page.waitForTimeout(900);
    await page.locator(".site-header__menu-button").click();
    await page.waitForFunction(() => document.querySelector("dialog.mobile-menu")?.hasAttribute("open"));

    const rootKinds = await page.evaluate(() =>
      Object.fromEntries(
        ["Profesionalams", "Apie mus"].map((label) => {
          const element = [...document.querySelectorAll(".mobile-menu__primary > *")].find(
            (item) => item.textContent?.trim() === label,
          );
          return [label, element?.tagName ?? null];
        }),
      ),
    );
    if (rootKinds.Profesionalams !== "A" || rootKinds["Apie mus"] !== "A") {
      failures.push({ route: "mobile-menu", viewport: viewport.name, failures: [`direct links mismatch ${JSON.stringify(rootKinds)}`] });
    }
    process.stdout.write(`${viewport.name} direct menu items: ${JSON.stringify(rootKinds)}\n`);

    await page.close();
  }
} finally {
  await browser.close();
}

if (failures.length) {
  process.stderr.write(`${JSON.stringify(failures, null, 2)}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write("Mobile route audit passed.\n");
}
