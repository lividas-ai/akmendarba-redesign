/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("node:path");
const { chromium } = require("playwright");

const baseUrl = "http://127.0.0.1:3000";
const route = "/projektai/granit-decor-darbai-30/";
const screenshots = path.join(process.cwd(), ".design/navigation-system/screenshots");
const chromeExecutable = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

(async () => {
  const browser = await chromium.launch({ executablePath: chromeExecutable, headless: true });
  const consoleErrors = [];
  const results = {};

  for (const viewport of [
    { name: "desktop", width: 1280, height: 800 },
    { name: "mobile", width: 375, height: 812 },
  ]) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(`${viewport.name}: ${message.text()}`);
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });

    const imageButtons = page.locator('button[aria-label^="Padidinti vaizdą:"]');
    const boxes = [];
    for (let index = 0; index < (await imageButtons.count()); index += 1) {
      const box = await imageButtons.nth(index).boundingBox();
      if (box) boxes.push(box);
    }

    const collisions = [];
    for (let first = 0; first < boxes.length; first += 1) {
      for (let second = first + 1; second < boxes.length; second += 1) {
        if (overlaps(boxes[first], boxes[second])) collisions.push([first, second]);
      }
    }

    results[viewport.name] = {
      supportingImages: await imageButtons.count(),
      planningActions: await page.getByRole("link", { name: "Parengti projekto planą", exact: true }).count(),
      relatedHeadings: await page.getByRole("heading", { name: "Kiti darbai", exact: true }).count(),
      thematicDisclosure: await page.getByText("Skirtingų Granit Decor darbų vaizdai", { exact: false }).count(),
      collisions,
      overflow: await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    };

    for (let index = 0; index < (await imageButtons.count()); index += 1) {
      await imageButtons.nth(index).scrollIntoViewIfNeeded();
      await page.waitForTimeout(80);
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(300);

    await page.screenshot({
      fullPage: true,
      path: path.join(screenshots, `project-theme-detail-${viewport.name}-${viewport.width}.png`),
    });

    if (viewport.name === "desktop") {
      await imageButtons.first().click();
      await page.locator("dialog[open]").waitFor({ state: "visible" });
      results.desktop.dialogOpen = await page.locator("dialog[open]").count();
      await page.screenshot({
        path: path.join(screenshots, "project-theme-lightbox-desktop-1280.png"),
      });
    }

    await page.close();
  }

  results.consoleErrors = consoleErrors;
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
