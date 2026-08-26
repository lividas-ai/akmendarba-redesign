import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const playwrightModule = process.env.PLAYWRIGHT_MODULE;
const playwrightImport = playwrightModule
  ? await import(pathToFileURL(playwrightModule).href)
  : await import("playwright");
const playwright = playwrightImport.default ?? playwrightImport;

const { chromium } = playwright;
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = process.env.MOBILE_AUDIT_DIR ?? "/private/tmp/granit-decor-mobile-audit";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM;
const viewportFilter = process.env.MOBILE_AUDIT_VIEWPORT;
const routeFilter = process.env.MOBILE_AUDIT_ROUTE;
const reducedMotion = process.env.MOBILE_AUDIT_MOTION ?? "reduce";

const routes = [
  ["home", "/"],
  ["products", "/gaminiai/"],
  ["product", "/gaminiai/virtuves-stalvirsiai/"],
  ["stones", "/akmuo/"],
  ["stone", "/akmuo/calacatta-paonazzo/"],
  ["projects", "/projektai/"],
  ["project", "/projektai/granit-decor-darbai-03/"],
  ["process", "/kaip-dirbame/"],
  ["planner", "/projektas/"],
  ["professionals", "/profesionalams/"],
  ["about", "/apie-mus/"],
  ["contact", "/kontaktai/"],
];

const viewports = [
  ["small", { width: 360, height: 800 }],
  ["standard", { width: 390, height: 844 }],
  ["large", { width: 430, height: 932 }],
];

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});

const results = [];

for (const [viewportName, viewport] of viewports.filter(([name]) => !viewportFilter || name === viewportFilter)) {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });

  const consoleErrors = [];
  const failedResponses = [];
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("WebSocket connection")) {
      consoleErrors.push(message.text());
    }
  });
  page.on("pageerror", (error) => consoleErrors.push(String(error)));
  page.on("response", (response) => {
    if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
  });

  for (const [name, route] of routes.filter(([name, route]) => !routeFilter || name === routeFilter || route === routeFilter)) {
    consoleErrors.length = 0;
    failedResponses.length = 0;
    await page.emulateMedia({ reducedMotion });
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(250);

    await page.screenshot({
      path: path.join(outputDir, `${viewportName}-${name}-fold.png`),
      animations: "disabled",
    });

    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const viewportWidth = window.innerWidth;
      const overflow = doc.scrollWidth - viewportWidth;
      const overflowElements = [...document.querySelectorAll("body *")]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === "string" ? element.className : "",
            left: Math.round(rect.left),
            right: Math.round(rect.right),
            width: Math.round(rect.width),
          };
        })
        .filter((item) => item.right > viewportWidth + 1 || item.left < -1)
        .slice(0, 20);

      const undersizedTargets = [...document.querySelectorAll("a, button, summary, input, select, textarea")]
        .filter((element) => {
          const style = getComputedStyle(element);
          if (style.display === "none" || style.visibility === "hidden") return false;
          const rect = element.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
        })
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName.toLowerCase(),
            text: (element.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 80),
            className: typeof element.className === "string" ? element.className : "",
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        })
        .slice(0, 40);

      const brokenImages = [...document.images]
        .filter((image) => image.complete && image.naturalWidth === 0)
        .map((image) => image.currentSrc || image.src);

      return {
        scrollWidth: doc.scrollWidth,
        viewportWidth,
        documentHeight: doc.scrollHeight,
        overflow,
        overflowElements,
        undersizedTargets,
        brokenImages,
        h1: document.querySelector("h1")?.textContent?.trim().replace(/\s+/g, " ") ?? null,
      };
    });

    await page.evaluate(async () => {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      const stride = Math.max(480, Math.floor(window.innerHeight * 0.75));
      for (let y = 0; y < document.documentElement.scrollHeight; y += stride) {
        window.scrollTo(0, y);
        await new Promise((resolve) => window.setTimeout(resolve, 80));
      }
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
    });
    await page.waitForTimeout(250);

    await page.screenshot({
      path: path.join(outputDir, `${viewportName}-${name}.png`),
      fullPage: true,
      animations: "disabled",
    });

    results.push({
      viewport: viewportName,
      route,
      ...metrics,
      consoleErrors: [...consoleErrors],
      failedResponses: [...failedResponses],
    });
  }

  await page.close();
}

await browser.close();
await fs.writeFile(path.join(outputDir, "results.json"), JSON.stringify(results, null, 2));

const failures = results.filter(
  (result) =>
    result.overflow > 1 ||
    result.brokenImages.length > 0 ||
    result.consoleErrors.length > 0 ||
    result.failedResponses.length > 0,
);

console.log(JSON.stringify({ outputDir, checks: results.length, failures }, null, 2));
process.exitCode = failures.length > 0 ? 1 : 0;
