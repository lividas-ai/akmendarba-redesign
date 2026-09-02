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
let checks = 0;

function assert(condition, message) {
  checks += 1;
  if (!condition) throw new Error(message);
}

async function verifyContactForm(viewport, screenshotName) {
  const page = await browser.newPage({ viewport });
  const browserErrors = [];
  const localFailedResponses = [];
  const postRequests = [];

  page.on("pageerror", (error) => browserErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("WebSocket connection")) {
      browserErrors.push(message.text());
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && response.url().startsWith(baseUrl)) {
      localFailedResponses.push(`${response.status()} ${response.url()}`);
    }
  });
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url().startsWith(baseUrl)) {
      postRequests.push(request.url());
    }
  });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (value) => {
          window.__copiedContactDraft = value;
        },
      },
    });
  });

  try {
    await page.goto(`${baseUrl}/kontaktai/?akmenys=granitas,marmuras`, { waitUntil: "networkidle" });
    const cookieButton = page.getByRole("button", { name: "Supratau" });
    if ((await cookieButton.count()) > 0 && await cookieButton.isVisible()) await cookieButton.click();
    const form = page.locator("form.demo-form");
    assert(await form.isVisible(), `Contact form is not visible at ${viewport.width}px`);
    assert(await form.getByText("Granitas", { exact: true }).isVisible(), "Granite selection is missing from form context");
    assert(await form.getByText("Marmuras", { exact: true }).isVisible(), "Marble selection is missing from form context");

    const categoryLabels = await form.locator("#contact-project-type option").allTextContents();
    assert(
      JSON.stringify(categoryLabels.map((label) => label.trim())) ===
        JSON.stringify(["Pasirinkite", "Paminklai", "Kapo dengimai", "Aksesuarai", "Vidaus ir išorės apdaila"]),
      `Unexpected category choices: ${categoryLabels.join(" | ")}`,
    );

    await form.getByRole("button", { name: "Parengti užklausos juodraštį" }).click();
    await page.waitForFunction(() => document.activeElement?.id === "contact-name");
    assert(
      await form.getByLabel("Vardas").evaluate((element) => element === document.activeElement),
      "Invalid submission did not focus the first field",
    );
    assert((await form.locator("[role='alert']").count()) >= 4, "Required-field validation messages are missing");

    await form.getByLabel("Vardas").fill("Testinis klientas");
    await form.getByLabel("El. paštas").fill("testas@example.com");
    await form.getByLabel("Darbų kategorija").selectOption({ label: "Paminklai" });
    await form.getByLabel("Trumpas darbų aprašymas").fill("Reikia konsultacijos dėl granito gaminio.");
    await form.locator("input[name='consent']").check();
    if (screenshotName) {
      await page.locator("section.contact-form-section").screenshot({ path: `.migration/qa/${screenshotName}` });
    }
    await form.getByRole("button", { name: "Parengti užklausos juodraštį" }).click();

    const result = page.locator(".demo-form__result");
    assert(await result.isVisible(), "Local enquiry summary did not appear");
    await page.waitForFunction(() => document.activeElement?.classList.contains("demo-form__result"));
    assert(await result.evaluate((element) => element === document.activeElement), "Result did not receive focus after form preparation");
    assert(await result.getByText("Duomenys nebuvo išsiųsti.", { exact: true }).isVisible(), "No-delivery disclosure is missing");
    assert(await result.getByText("Granitas, Marmuras", { exact: true }).isVisible(), "Selected materials are missing from summary");
    const mailtoHref = await result.getByRole("link", { name: /Atidaryti el. laišką/ }).getAttribute("href");
    assert(mailtoHref?.startsWith("mailto:info@akmendarba.lt?"), "Mail draft does not use the verified Akmendarba address");
    assert(mailtoHref?.includes("Granitas%2C%20Marmuras"), "Mail draft does not carry the selected materials");

    await result.getByRole("button", { name: "Kopijuoti juodraštį" }).click();
    assert(await result.getByRole("button", { name: "Juodraštis nukopijuotas" }).isVisible(), "Copy action did not report success");
    const copiedDraft = await page.evaluate(() => window.__copiedContactDraft ?? "");
    assert(copiedDraft.includes("Pasirinktos medžiagos: Granitas, Marmuras"), "Copied draft is missing selected materials");

    await result.getByRole("button", { name: "Taisyti duomenis" }).click();
    await page.waitForFunction(() => document.activeElement?.id === "contact-name");
    assert(await page.locator("#contact-name").evaluate((element) => element === document.activeElement), "Edit action did not restore form focus");
    assert(postRequests.length === 0, `The frontend-only form made POST requests: ${postRequests.join(" | ")}`);

    const fit = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert(fit.scrollWidth <= fit.clientWidth + 1, `Contact page overflows at ${viewport.width}px`);
    assert(browserErrors.length === 0, `Browser errors at ${viewport.width}px: ${browserErrors.join(" | ")}`);
    assert(localFailedResponses.length === 0, `Failed local responses at ${viewport.width}px: ${localFailedResponses.join(" | ")}`);
  } finally {
    await page.close();
  }
}

try {
  await verifyContactForm({ width: 1280, height: 900 }, "contact-form-desktop.png");
  await verifyContactForm({ width: 768, height: 1024 });
  await verifyContactForm({ width: 390, height: 844 }, "contact-form-mobile.png");
  await verifyContactForm({ width: 320, height: 700 });
  console.log(JSON.stringify({ checks, viewports: [1280, 768, 390, 320], failures: [] }, null, 2));
} finally {
  await browser.close();
}
