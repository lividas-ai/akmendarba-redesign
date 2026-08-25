/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputDir = path.join(root, ".design/navigation-system/screenshots");
const baseUrl = "http://127.0.0.1:3000";
const phase = process.env.IMAGE_FIT_PHASE || "before";

const desktopRoutes = [
  ["homepage", "/"],
  ["products", "/gaminiai/"],
  ["product-detail", "/gaminiai/virtuves-stalvirsiai/"],
  ["projects", "/projektai/"],
  ["project-detail", "/projektai/granit-decor-darbai-30/"],
  ["stones", "/akmuo/"],
  ["stone-detail", "/akmuo/statuario/"],
  ["process", "/kaip-dirbame/"],
  ["professionals", "/profesionalams/"],
  ["about", "/apie-mus/"],
  ["journal", "/zurnalas/"],
  ["memorials", "/memorialai/"],
  ["project-request", "/projektas/"],
];

async function preparePage(page, route) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const step = Math.max(480, Math.floor(innerHeight * 0.75));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 45));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(180);
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });

  try {
    const desktop = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
    for (const [name, route] of desktopRoutes) {
      await preparePage(desktop, route);
      await desktop.screenshot({
        path: path.join(outputDir, `image-fit-${phase}-${name}-desktop-1280.png`),
        fullPage: true,
      });

      if (name === "homepage") {
        const projects = desktop.locator(".home-projects");
        if (await projects.count()) {
          await projects.screenshot({ path: path.join(outputDir, `image-fit-${phase}-home-projects-desktop-1280.png`) });
        }
      }
    }
    await desktop.close();

    for (const [suffix, viewport] of [
      ["tablet-768", { width: 768, height: 1024 }],
      ["mobile-375", { width: 375, height: 812 }],
    ]) {
      const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
      await preparePage(page, "/");
      await page.screenshot({
        path: path.join(outputDir, `image-fit-${phase}-homepage-${suffix}.png`),
        fullPage: true,
      });
      await page.close();
    }
  } finally {
    await browser.close();
  }
})();
