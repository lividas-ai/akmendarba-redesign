import { mkdir } from "node:fs/promises";
import { chromium } from "/Users/linas/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";

const baseUrl = process.argv[2] ?? "http://127.0.0.1:3000";
const suffix = process.argv[3] ?? "current";
const outputDir = new URL("../screenshots/", import.meta.url);

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});

try {
  const cases = [
    { name: "mobile-320", width: 320, height: 740 },
    { name: "mobile-375", width: 375, height: 812 },
    { name: "mobile-390", width: 390, height: 844 },
    { name: "mobile-430", width: 430, height: 932 },
    { name: "tablet-768", width: 768, height: 1024 },
    { name: "desktop-1280", width: 1280, height: 800 },
  ];

  for (const item of cases) {
    const page = await browser.newPage({
      viewport: { width: item.width, height: item.height },
      deviceScaleFactor: 1,
      reducedMotion: "no-preference",
    });
    page.on("pageerror", (error) => process.stderr.write(`${item.name} page error: ${error.message}\n`));
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        process.stderr.write(`${item.name} console ${message.type()}: ${message.text()}\n`);
      }
    });
    await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90_000 });
    await page.waitForTimeout(2_500);

    const runtime = await page.evaluate(() => {
      const video = document.querySelector(".home-hero__video");
      const wordmark = document.querySelector(".site-header__inner .wordmark__name");
      return {
        currentSrc: video instanceof HTMLVideoElement ? video.currentSrc : null,
        paused: video instanceof HTMLVideoElement ? video.paused : null,
        readyState: video instanceof HTMLVideoElement ? video.readyState : null,
        videoSize: video instanceof HTMLVideoElement ? `${video.videoWidth}x${video.videoHeight}` : null,
        wordmark: wordmark?.textContent?.trim() ?? null,
        wordmarkDisplay: wordmark ? getComputedStyle(wordmark).display : null,
        viewportWidth: document.documentElement.clientWidth,
        contentWidth: document.documentElement.scrollWidth,
      };
    });
    process.stdout.write(`${item.name}: ${JSON.stringify(runtime)}\n`);

    await page.screenshot({
      path: new URL(`review-hero-${suffix}-${item.name}.png`, outputDir).pathname,
      fullPage: false,
    });

    const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let offset = item.height; offset < pageHeight; offset += Math.max(320, Math.floor(item.height * 0.72))) {
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), offset);
      await page.waitForTimeout(90);
    }
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(500);

    await page.screenshot({
      path: new URL(`review-home-${suffix}-${item.name}.png`, outputDir).pathname,
      fullPage: true,
    });

    if (item.width === 375) {
      await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 90_000 });
      await page.waitForTimeout(1_200);
      await page.locator(".site-header__menu-button").evaluate((button) => button.click());
      await page.waitForFunction(() => document.querySelector("dialog.mobile-menu")?.hasAttribute("open"));
      await page.waitForTimeout(450);
      await page.screenshot({
        path: new URL(`review-menu-${suffix}-mobile-375.png`, outputDir).pathname,
        fullPage: false,
      });
      await page.getByRole("button", { name: "Gaminiai", exact: true }).click();
      await page.waitForTimeout(450);
      const tileImages = await page.locator(".mobile-menu__visual-tile img").count();
      process.stdout.write(`mobile-menu-gaminiai: ${tileImages} tile images\n`);
      await page.screenshot({
        path: new URL(`review-menu-gaminiai-${suffix}-mobile-375.png`, outputDir).pathname,
        fullPage: false,
      });
    }

    await page.close();
  }
} finally {
  await browser.close();
}
