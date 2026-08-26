import { pathToFileURL } from "node:url";

const playwrightModule = process.env.PLAYWRIGHT_MODULE;
const playwrightImport = playwrightModule
  ? await import(pathToFileURL(playwrightModule).href)
  : await import("playwright");
const { chromium } = playwrightImport.default ?? playwrightImport;

const browser = await chromium.launch({
  headless: true,
  ...(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {}),
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 1,
  isMobile: true,
  hasTouch: true,
});
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const errors = [];

page.on("pageerror", (error) => errors.push(String(error)));
page.on("console", (message) => {
  if (message.type() === "error" && !message.text().includes("WebSocket connection")) errors.push(message.text());
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.locator(".site-header__menu-button").click();
  assert(await page.locator("dialog.mobile-menu").evaluate((dialog) => dialog.open), "Mobile menu did not open");
  await page.locator(".mobile-menu__primary button").first().click();
  assert(await page.locator(".mobile-menu__track").getAttribute("data-submenu"), "Mobile submenu did not open");
  await page.getByRole("button", { name: "Grįžti į pagrindinį meniu" }).click();
  await page.getByRole("button", { name: "Uždaryti meniu" }).first().click();

  await page.goto(`${baseUrl}/akmuo/`, { waitUntil: "networkidle" });
  await page.locator(".materials-hero__index a").filter({ hasText: "Marmuras" }).click();
  await page.waitForFunction(() => document.querySelector(".material-category-filters button[aria-pressed='true']")?.textContent?.includes("Marmuras"));
  assert(new URL(page.url()).searchParams.get("tipas") === "marmuras", "Same-page material query navigation did not update the catalogue");
  await page.locator(".material-category-filters button").filter({ hasText: /^Visi/ }).click();
  const initialMaterials = await page.locator(".material-plate").count();
  assert(initialMaterials === 24, `Expected 24 initial materials, received ${initialMaterials}`);
  await page.locator(".material-gallery-progress button").click();
  assert((await page.locator(".material-plate").count()) === 48, "Material load-more did not reveal the next set");
  await page.locator(".material-plate__image-button").first().click();
  assert(await page.locator("dialog.material-quick-view").evaluate((dialog) => dialog.open), "Material quick view did not open");
  await page.getByRole("button", { name: "Uždaryti greitą peržiūrą" }).click();
  await page.locator(".material-plate__actions button").first().click();
  assert((await page.locator(".header-tool--saved").getAttribute("aria-label"))?.endsWith("1"), "Saved-stone count did not update");

  await page.goto(`${baseUrl}/projektai/`, { waitUntil: "networkidle" });
  await page.locator("button[aria-label^='Atverti nuotrauką']").first().click();
  const galleryDialog = page.locator("dialog").filter({ has: page.getByRole("button", { name: "Uždaryti nuotrauką" }) });
  assert(await galleryDialog.evaluate((dialog) => dialog.open), "Portfolio lightbox did not open");
  await page.getByRole("button", { name: "Uždaryti nuotrauką" }).click();

  await page.goto(`${baseUrl}/projektai/granit-decor-darbai-03/`, { waitUntil: "networkidle" });
  const swipeRail = page.locator("[data-project-gallery]").first();
  assert((await swipeRail.count()) === 1, "Project mobile gallery rail is missing");
  const horizontal = await swipeRail.evaluate((element) => element.scrollWidth > element.clientWidth);
  assert(horizontal, "Project mobile gallery is not horizontally swipeable");

  await page.goto(`${baseUrl}/projektas/`, { waitUntil: "networkidle" });
  await page.locator(".planner-choice").first().click();
  await page.getByRole("button", { name: "Tęsti" }).click();
  assert((await page.locator("input[type='file']").count()) > 0, "Project planner is missing the file upload control");
  assert(errors.length === 0, `Browser errors: ${errors.join(" | ")}`);

  const noJavaScriptPage = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    javaScriptEnabled: false,
  });
  await noJavaScriptPage.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  const noJavaScriptReveal = await noJavaScriptPage.locator("[data-reveal]").first().evaluate((element) => ({
    opacity: getComputedStyle(element).opacity,
    revealReady: element.hasAttribute("data-reveal-ready"),
  }));
  assert(noJavaScriptReveal.opacity !== "0" && !noJavaScriptReveal.revealReady, "Reveal content is hidden when JavaScript is unavailable");
  await noJavaScriptPage.close();

  console.log(JSON.stringify({ checks: 12, failures: [] }, null, 2));
} finally {
  await browser.close();
}
