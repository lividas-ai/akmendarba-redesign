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
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const baseUrl = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const browserErrors = [];
const failedResponses = [];
let checks = 0;

page.on("pageerror", (error) => browserErrors.push(String(error)));
page.on("console", (message) => {
  if (message.type() === "error" && !message.text().includes("WebSocket connection")) {
    browserErrors.push(message.text());
  }
});
page.on("response", (response) => {
  if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
});

function assert(condition, message) {
  checks += 1;
  if (!condition) throw new Error(message);
}

async function dismissCookieNotice() {
  const button = page.getByRole("button", { name: "Supratau" });
  if ((await button.count()) > 0 && await button.isVisible()) await button.click();
}

try {
  await page.goto(`${baseUrl}/akmuo/`, { waitUntil: "networkidle" });
  await page.evaluate(() => {
    localStorage.removeItem("akmendarba-saved-v1");
    localStorage.removeItem("akmendarba-compare-v1");
  });
  await page.reload({ waitUntil: "networkidle" });
  await dismissCookieNotice();

  const cards = page.locator(".material-plate");
  assert((await cards.count()) === 2, "Expected exactly the two source-backed material directions");
  assert(await page.getByRole("heading", { name: "Granitas", exact: true }).isVisible(), "Granite direction is missing");
  assert(await page.getByRole("heading", { name: "Marmuras", exact: true }).isVisible(), "Marble direction is missing");
  await page.screenshot({ path: ".migration/qa/material-selection-desktop.png", fullPage: true });

  const graniteCard = page.locator("#medziaga-granitas");
  const marbleCard = page.locator("#medziaga-marmuras");
  const saveGranite = graniteCard.locator(".material-icon-button").first();
  await saveGranite.click();
  await page.waitForFunction(() =>
    document.querySelector("#medziaga-granitas .material-icon-button")?.getAttribute("aria-pressed") === "true",
  );
  assert((await saveGranite.getAttribute("aria-pressed")) === "true", "Save control did not become pressed");
  assert(
    JSON.stringify(await page.evaluate(() => JSON.parse(localStorage.getItem("akmendarba-saved-v1") ?? "[]"))) === JSON.stringify(["granitas"]),
    "Saved selection was not persisted",
  );

  const savedHeaderButton = page.getByRole("button", { name: "Išsaugoti akmens variantai: 1" });
  assert(await savedHeaderButton.isVisible(), "Saved-items header control is not visible on desktop");
  await savedHeaderButton.click();
  const savedDialog = page.locator("dialog.saved-stones");
  assert(await savedDialog.evaluate((dialog) => dialog.open), "Saved-items dialog did not open");
  assert(await savedDialog.getByText("Granitas", { exact: true }).isVisible(), "Saved material is missing from the dialog");
  const savedContactHref = await savedDialog.getByRole("link", { name: /Aptarti pasirinkimą/ }).getAttribute("href");
  assert(
    savedContactHref?.startsWith("/kontaktai") && savedContactHref.includes("akmenys=granitas"),
    "Saved selection is not carried into the contact form",
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.saved-stones")?.open);
  assert(await savedHeaderButton.evaluate((element) => element === document.activeElement), "Saved dialog did not restore focus to its trigger");

  await graniteCard.locator(".material-plate__image-button").click();
  const quickView = page.locator("dialog.material-quick-view");
  assert(await quickView.evaluate((dialog) => dialog.open), "Quick-view dialog did not open");
  assert(
    await quickView.getByRole("button", { name: "Uždaryti greitą peržiūrą" }).evaluate((element) => element === document.activeElement),
    "Quick-view close control did not receive focus",
  );
  const quickViewContactHref = await quickView.getByRole("link", { name: /Klausti apie šią medžiagos kryptį/ }).getAttribute("href");
  assert(
    quickViewContactHref?.startsWith("/kontaktai") && quickViewContactHref.includes("akmenys=granitas"),
    "Quick-view selection is not carried into the contact form",
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.material-quick-view")?.open);
  assert(await graniteCard.locator(".material-plate__image-button").evaluate((element) => element === document.activeElement), "Quick view did not restore focus to its trigger");

  await graniteCard.locator(".material-icon-button").nth(1).click();
  await marbleCard.locator(".material-icon-button").nth(1).click();
  assert(await page.getByRole("button", { name: "Palyginti 2" }).isVisible(), "Compare drawer did not become actionable");
  assert(
    JSON.stringify(await page.evaluate(() => JSON.parse(localStorage.getItem("akmendarba-compare-v1") ?? "[]"))) === JSON.stringify(["granitas", "marmuras"]),
    "Compared selection was not persisted",
  );

  await page.reload({ waitUntil: "networkidle" });
  assert(
    (await page.locator("#medziaga-granitas .material-icon-button").first().getAttribute("aria-pressed")) === "true",
    "Saved state was not restored after reload",
  );
  assert(await page.getByRole("button", { name: "Palyginti 2" }).isVisible(), "Compare state was not restored after reload");

  await page.getByRole("button", { name: "Palyginti 2" }).click();
  const comparison = page.locator("dialog.compare-dialog");
  assert(await comparison.evaluate((dialog) => dialog.open), "Comparison dialog did not open");
  assert(
    await comparison.getByRole("button", { name: "Uždaryti palyginimą" }).evaluate((element) => element === document.activeElement),
    "Comparison close control did not receive focus",
  );
  assert((await comparison.locator("tbody tr").count()) === 2, "Comparison contains unsupported criteria");
  const compareContactHref = await comparison.getByRole("link", { name: /Aptarti pasirinkimą/ }).getAttribute("href");
  assert(
    compareContactHref?.startsWith("/kontaktai") && compareContactHref.includes("akmenys=granitas,marmuras"),
    "Compared selections are not carried into the contact form",
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.compare-dialog")?.open);
  assert(await page.getByRole("button", { name: "Palyginti 2" }).evaluate((element) => element === document.activeElement), "Comparison did not restore focus to its trigger");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  const mobileFit = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert(mobileFit.scrollWidth <= mobileFit.clientWidth + 1, "Material selection overflows the mobile viewport");
  assert(await page.getByText("Išsaugoti", { exact: true }).first().isVisible(), "Mobile save label is not visible");
  assert(await page.getByText("Palyginime", { exact: true }).first().isVisible(), "Mobile compare label is not visible");
  await page.screenshot({ path: ".migration/qa/material-selection-mobile.png", fullPage: true });

  await page.getByRole("button", { name: "Išvalyti" }).click();
  await page.waitForFunction(() => document.activeElement?.id === "collection-title");
  assert(await page.locator("#collection-title").evaluate((element) => element === document.activeElement), "Clearing comparison did not move focus to the collection heading");
  await page.getByRole("button", { name: "Atverti meniu" }).click();
  const mobileMenu = page.locator("dialog.mobile-menu");
  assert(await mobileMenu.evaluate((dialog) => dialog.open), "Mobile navigation did not open");
  assert(await mobileMenu.getByRole("link", { name: "Akmuo", exact: true }).isVisible(), "Akmuo is missing from mobile navigation");
  await mobileMenu.getByRole("button", { name: "Uždaryti meniu" }).click();

  for (const viewport of [{ width: 768, height: 1024 }, { width: 320, height: 700 }]) {
    await page.setViewportSize(viewport);
    await page.reload({ waitUntil: "networkidle" });
    const fit = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert(fit.scrollWidth <= fit.clientWidth + 1, `Material selection overflows at ${viewport.width}px`);
  }
  assert(browserErrors.length === 0, `Browser errors: ${browserErrors.join(" | ")}`);
  assert(failedResponses.filter((entry) => entry.includes(baseUrl)).length === 0, `Failed local responses: ${failedResponses.join(" | ")}`);

  console.log(JSON.stringify({ checks, viewports: [1440, 768, 390, 320], failures: [] }, null, 2));
} finally {
  await browser.close();
}
