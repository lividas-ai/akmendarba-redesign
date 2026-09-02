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
  assert((await cards.count()) === 24, "Expected the first 24 of 137 source-visible references");
  assert(await page.getByText("Rasta 137 iš 137").isVisible(), "Complete 137-reference count is missing");
  assert(await page.getByRole("button", { name: /Medžiaga 6/ }).isVisible(), "Six homepage stone/production visuals are missing");
  assert(await page.getByRole("button", { name: /Vienos dalies 16/ }).isVisible(), "One-piece monument count is wrong");
  assert(await page.getByRole("button", { name: /Kelių dalių 64/ }).isVisible(), "Multi-piece monument count is wrong");
  assert(await page.getByRole("button", { name: /Dengimai 27/ }).isVisible(), "Grave-covering count is wrong");
  assert(await page.getByRole("button", { name: /Aksesuarai 19/ }).isVisible(), "Accessory count is wrong");
  assert(await page.getByRole("button", { name: /Apdaila 5/ }).isVisible(), "Finishing count is wrong");
  await page.screenshot({ path: ".migration/qa/material-selection-desktop.png", fullPage: true });

  await page.getByRole("button", { name: /Apdaila 5/ }).click();
  await page.waitForFunction(() => new URL(window.location.href).searchParams.get("tipas") === "apdaila");
  assert((await cards.count()) === 5, "Finishing filter should show all five public finishing images");
  assert(await page.getByText("Rasta 5 iš 137").isVisible(), "Filtered result count is wrong");
  await page.getByRole("button", { name: /Atkurti visą kolekciją/ }).click();
  assert((await cards.count()) === 24, "Reset did not restore the first catalogue page");

  await page.getByRole("button", { name: /Rodyti daugiau/ }).click();
  assert((await cards.count()) === 48, "Load-more did not reveal the next 24 references");

  const firstCard = page.locator("#medziaga-paminklu-gamyba-karjeras");
  const secondCard = page.locator("#medziaga-granito-blokai-ir-plokstes");
  const thirdCard = page.locator("#medziaga-vidaus-ir-isores-apdaila");
  const fourthCard = page.locator("#medziaga-paminklai-paslaugos-vaizdas");
  const saveFirst = firstCard.locator(".material-icon-button").first();
  await saveFirst.click();
  assert((await saveFirst.getAttribute("aria-pressed")) === "true", "Save control did not become pressed");
  assert(
    JSON.stringify(await page.evaluate(() => JSON.parse(localStorage.getItem("akmendarba-saved-v1") ?? "[]"))) ===
      JSON.stringify(["paminklu-gamyba-karjeras"]),
    "Saved selection was not persisted",
  );

  const savedHeaderButton = page.getByRole("button", { name: "Išsaugoti akmens variantai: 1" });
  assert(await savedHeaderButton.isVisible(), "Saved-items header control is not visible on desktop");
  await savedHeaderButton.click();
  const savedDialog = page.locator("dialog.saved-stones");
  assert(await savedDialog.evaluate((dialog) => dialog.open), "Saved-items dialog did not open");
  assert(await savedDialog.getByText("Paminklų gamyba", { exact: true }).isVisible(), "Saved reference is missing from the dialog");
  const savedContactHref = await savedDialog.getByRole("link", { name: /Aptarti pasirinkimą/ }).getAttribute("href");
  assert(
    savedContactHref?.includes("akmenys=paminklu-gamyba-karjeras"),
    "Saved reference is not carried into the contact form",
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.saved-stones")?.open);

  await firstCard.locator(".material-plate__image-button").click();
  const quickView = page.locator("dialog.material-quick-view");
  assert(await quickView.evaluate((dialog) => dialog.open), "Quick-view dialog did not open");
  assert(await quickView.getByText("Karjeras-s.jpg", { exact: false }).count() === 0, "Internal reference should not become invented marketing copy");
  const quickViewContactHref = await quickView.getByRole("link", { name: /Klausti apie šį pavyzdį/ }).getAttribute("href");
  assert(
    quickViewContactHref?.includes("akmenys=paminklu-gamyba-karjeras"),
    "Quick-view reference is not carried into the contact form",
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.material-quick-view")?.open);

  for (const card of [firstCard, secondCard, thirdCard]) {
    await card.getByRole("button", { name: /Pridėti .* į palyginimą/ }).click();
  }
  assert(await page.getByRole("button", { name: "Palyginti 3" }).isVisible(), "Three-reference comparison did not become actionable");
  assert(
    (await fourthCard.getByRole("button", { name: /Pridėti .* į palyginimą/ }).isDisabled()),
    "A fourth comparison option should be disabled at the three-item limit",
  );

  await page.reload({ waitUntil: "networkidle" });
  assert(
    (await page.locator("#medziaga-paminklu-gamyba-karjeras").getByRole("button", { name: /Pašalinti .* iš išsaugotų/ }).getAttribute("aria-pressed")) === "true",
    "Saved state was not restored after reload",
  );
  assert(await page.getByRole("button", { name: "Palyginti 3" }).isVisible(), "Compare state was not restored after reload");

  await page.getByRole("button", { name: "Palyginti 3" }).click();
  const comparison = page.locator("dialog.compare-dialog");
  assert(await comparison.evaluate((dialog) => dialog.open), "Comparison dialog did not open");
  assert((await comparison.locator("tbody tr").count()) === 3, "Comparison should contain only three evidence-backed criteria");
  const compareContactHref = await comparison.getByRole("link", { name: /Aptarti pasirinkimą/ }).getAttribute("href");
  assert(
    compareContactHref?.includes("paminklu-gamyba-karjeras%2Cgranito-blokai-ir-plokstes%2Cvidaus-ir-isores-apdaila") ||
      compareContactHref?.includes("paminklu-gamyba-karjeras,granito-blokai-ir-plokstes,vidaus-ir-isores-apdaila"),
    "Compared references are not carried into the contact form",
  );
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => !document.querySelector("dialog.compare-dialog")?.open);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  const mobileFit = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert(mobileFit.scrollWidth <= mobileFit.clientWidth + 1, "Material selection overflows the mobile viewport");
  assert(await page.locator(".material-plate").first().getByRole("button", { name: /Pašalinti .* iš išsaugotų/ }).isVisible(), "Mobile save control is missing");
  await page.screenshot({ path: ".migration/qa/material-selection-mobile.png", fullPage: true });

  await page.getByRole("button", { name: "Išvalyti" }).click();
  await page.waitForFunction(() => document.activeElement?.id === "collection-title");
  assert(await page.locator("#collection-title").evaluate((element) => element === document.activeElement), "Clearing comparison did not move focus to the collection heading");

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

  console.log(JSON.stringify({ checks, sourceVisibleReferences: 137, viewports: [1440, 768, 390, 320], failures: [] }, null, 2));
} finally {
  await browser.close();
}
