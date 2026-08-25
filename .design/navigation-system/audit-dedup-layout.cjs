/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const baseUrl = "http://127.0.0.1:3000";
const outputDir = path.join(root, ".design/navigation-system/screenshots");

function overlap(left, right) {
  const width = Math.max(0, Math.min(left.x + left.width, right.x + right.width) - Math.max(left.x, right.x));
  const height = Math.max(0, Math.min(left.y + left.height, right.y + right.height) - Math.max(left.y, right.y));
  return width * height;
}

async function prepare(page, route) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const step = Math.max(420, Math.floor(innerHeight * 0.7));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 35));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(160);
}

async function applicationMetrics(page) {
  const boxes = await page.locator(".application-card").evaluateAll((cards) =>
    cards.map((card, index) => {
      const rect = card.getBoundingClientRect();
      return { index, x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    }),
  );

  const collisions = [];
  for (let first = 0; first < boxes.length; first += 1) {
    for (let second = first + 1; second < boxes.length; second += 1) {
      const area = overlap(boxes[first], boxes[second]);
      if (area > 1) collisions.push({ first, second, area: Math.round(area) });
    }
  }

  return { cardCount: boxes.length, boxes, collisions };
}

async function processLinkAudit(page) {
  const normalize = (href) => new URL(href, baseUrl).pathname.replace(/\/$/, "") || "/";

  const mainLinks = await page.locator("main a[href]").evaluateAll((links) =>
    links.map((link) => ({ label: link.textContent.trim().replace(/\s+/g, " "), href: link.href })),
  );
  const groupedMain = Object.groupBy(mainLinks, (link) => normalize(link.href));

  await page.locator("#site-header-kaip-dirbame-trigger").click();
  await page.locator("#site-header-kaip-dirbame-panel").waitFor({ state: "visible" });
  const menuLinks = await page.locator("#site-header-kaip-dirbame-panel a[href]").evaluateAll((links) =>
    links.map((link) => ({ label: link.textContent.trim().replace(/\s+/g, " "), href: link.href })),
  );
  const groupedMenu = Object.groupBy(menuLinks, (link) => normalize(link.href));

  await page.locator("#site-header-kaip-dirbame-panel").screenshot({
    path: path.join(outputDir, "dedup-kaip-dirbame-menu-desktop-1470.png"),
  });

  return {
    mainLinks,
    mainDuplicateDestinations: Object.entries(groupedMain).filter(([, links]) => links.length > 1),
    menuLinks,
    menuDuplicateDestinations: Object.entries(groupedMenu).filter(([, links]) => links.length > 1),
  };
}

(async () => {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const consoleErrors = [];
  const failedRequests = [];
  const report = {};

  try {
    const desktop = await browser.newPage({ viewport: { width: 1470, height: 956 }, deviceScaleFactor: 1 });
    desktop.on("pageerror", (error) => consoleErrors.push(error.message));
    desktop.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    desktop.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()}`));

    await prepare(desktop, "/");
    report.homeDesktop = await applicationMetrics(desktop);
    report.homeDesktop.documentOverflow = await desktop.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    await desktop.locator(".home-applications").screenshot({
      path: path.join(outputDir, "dedup-home-applications-desktop-1470.png"),
    });
    await desktop.locator(".site-footer").scrollIntoViewIfNeeded();
    report.footer = await desktop.locator(".site-footer .wordmark").evaluate((mark) => {
      const rect = mark.getBoundingClientRect();
      const logo = mark.querySelector(".wordmark__logo").getBoundingClientRect();
      const name = mark.querySelector(".wordmark__name");
      const styles = getComputedStyle(name);
      return {
        width: rect.width,
        height: rect.height,
        logoWidth: logo.width,
        logoHeight: logo.height,
        nameDisplay: styles.display,
        nameColor: styles.color,
      };
    });
    await desktop.locator(".site-footer").screenshot({
      path: path.join(outputDir, "dedup-footer-desktop-1470.png"),
    });

    await prepare(desktop, "/akmuo/calacatta-paonazzo/");
    report.material = {
      repeatedSpreadCount: await desktop.locator(".material-detail-spread").count(),
      repeatedProjectBridgeCount: await desktop.locator(".material-project-bridge").count(),
      primaryActionCount: await desktop.getByText("Pridėti prie projekto", { exact: true }).count(),
      overflow: await desktop.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    };
    await desktop.locator("main").screenshot({
      path: path.join(outputDir, "dedup-material-detail-desktop-1470.png"),
    });

    await prepare(desktop, "/projektai/granit-decor-darbai-03/");
    report.project = {
      relatedSectionCount: await desktop.locator(".related-projects").count(),
      otherJobsHeadingCount: await desktop.getByText("Kiti darbai.", { exact: true }).count(),
      overflow: await desktop.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth),
    };
    await desktop.locator("main").screenshot({
      path: path.join(outputDir, "dedup-project-detail-desktop-1470.png"),
    });

    await prepare(desktop, "/kaip-dirbame/");
    report.process = await processLinkAudit(desktop);
    report.process.overflow = await desktop.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    await desktop.locator("main").screenshot({
      path: path.join(outputDir, "dedup-process-desktop-1470.png"),
    });
    await desktop.close();

    const mobile = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 1 });
    mobile.on("pageerror", (error) => consoleErrors.push(error.message));
    mobile.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    mobile.on("requestfailed", (request) => failedRequests.push(`${request.method()} ${request.url()}`));
    await prepare(mobile, "/");
    report.homeMobile = await applicationMetrics(mobile);
    report.homeMobile.documentOverflow = await mobile.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    await mobile.locator(".home-applications").screenshot({
      path: path.join(outputDir, "dedup-home-applications-mobile-375.png"),
    });
    await mobile.locator(".site-footer").scrollIntoViewIfNeeded();
    await mobile.locator(".site-footer").screenshot({
      path: path.join(outputDir, "dedup-footer-mobile-375.png"),
    });
    await mobile.close();

    report.consoleErrors = [...new Set(consoleErrors)];
    report.failedRequests = [...new Set(failedRequests)];
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  } finally {
    await browser.close();
  }
})();
