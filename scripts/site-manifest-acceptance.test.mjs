import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateSiteManifest } from "../src/template/validate-manifest.ts";
import { buildSiteManifestAcceptance } from "./site-manifest-acceptance.mjs";

const acceptedParity = {
  desktop: { status: "equivalent", checkedAt: "2026-08-27" },
  tablet: { status: "adapted", checkedAt: "2026-08-27" },
  mobile: { status: "adapted", checkedAt: "2026-08-27" },
};

function evidence(sourceId = "source-home") {
  return [{ sourceId }];
}

function sourceText(value) {
  return { value, origin: "source", evidence: evidence() };
}

function fixtureManifest() {
  const title = sourceText("Verified title");
  return {
    schemaVersion: "1.0.0",
    siteId: "fixture-site",
    defaultLocale: "en-US",
    brand: { name: sourceText("Fixture brand"), logoMediaId: "media-hero", accent: "#123456" },
    homePageId: "page-home",
    primaryPageId: "page-home",
    sources: [
      {
        id: "source-home",
        kind: "url",
        url: "https://example.com/",
        retrievedAt: "2026-08-27T00:00:00Z",
        status: "captured",
      },
    ],
    sourceCoverage: [
      {
        sourceId: "source-home",
        status: "migrated",
        destinations: [
          { kind: "page", id: "page-home" },
          { kind: "media", id: "media-hero" },
          { kind: "function", id: "function-contact" },
        ],
        reviewedAt: "2026-08-27",
      },
    ],
    media: [
      {
        id: "media-hero",
        kind: "image",
        decorative: true,
        variants: [{ src: "/assets/hero.webp", mimeType: "image/webp" }],
        provenance: { evidence: evidence(), rights: "confirmed" },
        parity: structuredClone(acceptedParity),
      },
    ],
    functions: [
      {
        id: "function-contact",
        type: "form",
        implementationKey: "fixture.contact",
        config: { delivery: "fixture" },
        evidence: evidence(),
        publication: "published",
        testFixtureIds: ["fixture-contact"],
        parity: structuredClone(acceptedParity),
        integrationStatus: "complete",
      },
    ],
    pages: [
      {
        id: "page-home",
        path: "/",
        kind: "home",
        title,
        navigationTitle: title,
        publication: "published",
        blocks: [
          {
            id: "page-home-hero",
            type: "hero",
            publication: "published",
            data: { heading: title, mediaId: "media-hero" },
            parity: structuredClone(acceptedParity),
          },
          {
            id: "page-home-contact",
            type: "function",
            publication: "published",
            data: { functionId: "function-contact" },
            parity: structuredClone(acceptedParity),
          },
        ],
        seo: { title, imageMediaId: "media-hero" },
        parity: structuredClone(acceptedParity),
      },
    ],
    navigation: { primary: [], utility: [], footer: [] },
  };
}

async function withFixtureProject(callback) {
  const projectRoot = await mkdtemp(path.join(os.tmpdir(), "manifest-acceptance-"));
  try {
    await mkdir(path.join(projectRoot, "public", "assets"), { recursive: true });
    await writeFile(path.join(projectRoot, "public", "assets", "hero.webp"), "fixture", "utf8");
    return await callback(projectRoot);
  } finally {
    await rm(projectRoot, { recursive: true, force: true });
  }
}

async function buildReport(manifest, projectRoot, mode = "draft") {
  return buildSiteManifestAcceptance({
    manifest,
    projectRoot,
    mode,
    draftIssues: validateSiteManifest(manifest, "draft"),
    releaseIssues: validateSiteManifest(manifest, "release"),
  });
}

test("reports exact inventory, parity, and local media for a release-ready manifest", async () => {
  await withFixtureProject(async (projectRoot) => {
    const report = await buildReport(fixtureManifest(), projectRoot, "release");

    assert.equal(report.currentPass, true);
    assert.equal(report.releaseReady, true);
    assert.equal(report.inventory.pages.total, 1);
    assert.equal(report.inventory.media.total, 1);
    assert.equal(report.inventory.media.variants, 1);
    assert.equal(report.inventory.functions.total, 1);
    assert.equal(report.inventory.coverage.destinations, 3);
    assert.equal(report.localMedia.existingLocalVariants, 1);
    assert.equal(report.localMedia.missingLocalVariants, 0);
    assert.equal(report.parity.summary.page.mobile.adapted, 1);
    assert.match(report.markdown, /Current-mode acceptance: \*\*PASS\*\*/);
    assert.match(report.markdown, /Release readiness: \*\*READY\*\*/);
    assert.match(report.markdown, /\| Pages \| 1 \|/);
  });
});

test("draft passes while release reports exact parity, coverage, rights, and function blockers", async () => {
  await withFixtureProject(async (projectRoot) => {
    const manifest = fixtureManifest();
    manifest.sourceCoverage[0] = {
      sourceId: "source-home",
      status: "blocked",
      reviewedAt: "2026-08-27",
      rationale: "Destination review is unresolved.",
    };
    manifest.media[0].provenance.rights = "unknown";
    manifest.functions[0].integrationStatus = "frontend-only";
    manifest.functions[0].integrationBlocker = {
      sourceId: "source-home",
      functionId: "function-contact",
      publication: "published",
      rationale: "Delivery is not connected.",
    };
    manifest.functions[0].blockedReason = "Delivery is not connected.";
    manifest.pages[0].parity.mobile = { status: "pending" };

    const report = await buildReport(manifest, projectRoot, "draft");

    assert.equal(report.currentPass, true);
    assert.equal(report.releaseReady, false);
    assert.equal(report.releaseBlockersByCategory.evidence, 1);
    assert.equal(report.releaseBlockersByCategory.rights, 1);
    assert.equal(report.releaseBlockersByCategory.function, 1);
    assert.equal(report.releaseBlockersByCategory.parity, 1);
    assert.deepEqual(report.parity.unresolved, [
      { entityType: "page", id: "page-home", device: "mobile", status: "pending" },
    ]);
    assert.match(report.markdown, /blocked-source-coverage/);
    assert.match(report.markdown, /unknown-media-rights/);
    assert.match(report.markdown, /incomplete-published-function/);
    assert.match(report.markdown, /release-parity-incomplete/);
  });
});

test("missing local media fails draft acceptance", async () => {
  await withFixtureProject(async (projectRoot) => {
    const manifest = fixtureManifest();
    manifest.media[0].variants[0].src = "/assets/missing.webp";
    const report = await buildReport(manifest, projectRoot, "draft");

    assert.equal(report.currentPass, false);
    assert.equal(report.releaseReady, false);
    assert.equal(report.localMedia.missingLocalVariants, 1);
    assert.equal(report.currentIssues.some((issue) => issue.code === "missing-local-media"), true);
  });
});

test("intentional omission requires a rationale and explicit approval", async () => {
  await withFixtureProject(async (projectRoot) => {
    const manifest = fixtureManifest();
    manifest.sourceCoverage[0] = {
      sourceId: "source-home",
      status: "intentional-omit",
      reviewedAt: "2026-08-27",
      rationale: "",
    };
    const report = await buildReport(manifest, projectRoot, "draft");

    assert.equal(report.currentPass, false);
    assert.equal(report.currentIssues.some((issue) => issue.code === "unapproved-intentional-omit"), true);
  });
});

test("a source without a coverage mapping blocks release but remains visible as a draft warning", async () => {
  await withFixtureProject(async (projectRoot) => {
    const manifest = fixtureManifest();
    manifest.sourceCoverage = [];
    const report = await buildReport(manifest, projectRoot, "draft");

    assert.equal(report.currentPass, true);
    assert.equal(report.currentIssues.some((issue) => issue.code === "missing-source-coverage"), true);
    assert.equal(report.releaseReady, false);
    assert.equal(report.releaseBlockersByCategory.evidence, 1);
    assert.equal(report.releaseBlockers.some((issue) => issue.code === "missing-source-coverage"), true);
  });
});

for (const publication of ["draft", "ready", "withheld"]) {
  test(`release ignores parity and integration blockers for a ${publication} function`, async () => {
    await withFixtureProject(async (projectRoot) => {
      const manifest = fixtureManifest();
      const fn = manifest.functions[0];
      fn.publication = publication;
      fn.integrationStatus = "blocked";
      fn.parity = {
        desktop: { status: "blocked" },
        tablet: { status: "pending" },
        mobile: { status: "failed" },
      };
      fn.integrationBlocker = {
        sourceId: "source-home",
        functionId: fn.id,
        publication,
        rationale: "Private delivery credentials are not available.",
        approval: {
          sourceId: "source-home",
          by: "Fixture client",
          at: "2026-08-27",
          decision: publication === "withheld" ? "withhold" : "defer",
        },
      };
      manifest.pages[0].blocks = manifest.pages[0].blocks.filter(
        (block) => block.type !== "function",
      );

      const report = await buildReport(manifest, projectRoot, "release");

      assert.equal(report.currentPass, true);
      assert.equal(report.releaseReady, true);
      assert.deepEqual(report.parity.unresolved, []);
      assert.equal(
        report.releaseBlockers.some((issue) => issue.code === "incomplete-published-function"),
        false,
      );
      assert.equal(
        report.releaseBlockers.some((issue) => issue.code === "release-parity-incomplete"),
        false,
      );
    });
  });
}

test("one visible tool can split published local calculation from withheld remote delivery", async () => {
  await withFixtureProject(async (projectRoot) => {
    const manifest = fixtureManifest();
    manifest.functions[0].type = "calculator";
    manifest.functions[0].implementationKey = "fixture.quote-calculation";
    manifest.functions[0].capability = {
      experienceId: "experience-quote",
      capabilityId: "capability-quote-calculation",
      kind: "calculation",
      execution: "local",
      label: sourceText("Quote calculation"),
      evidence: evidence(),
    };
    manifest.functions.push({
      id: "function-quote-delivery",
      type: "custom",
      implementationKey: "fixture.quote-delivery",
      config: { provider: "private-crm" },
      evidence: evidence(),
      publication: "withheld",
      testFixtureIds: ["fixture-quote-delivery"],
      parity: {
        desktop: { status: "blocked" },
        tablet: { status: "blocked" },
        mobile: { status: "blocked" },
      },
      integrationStatus: "blocked",
      capability: {
        experienceId: "experience-quote",
        capabilityId: "capability-quote-delivery",
        kind: "delivery",
        execution: "remote",
        label: sourceText("Send quote request"),
        evidence: evidence(),
      },
      integrationBlocker: {
        sourceId: "source-home",
        functionId: "function-quote-delivery",
        publication: "withheld",
        rationale: "The private CRM requires credentials and API documentation.",
        approval: {
          sourceId: "source-home",
          by: "Fixture client",
          at: "2026-08-27",
          decision: "withhold",
        },
      },
    });
    manifest.sourceCoverage[0].destinations.push({
      kind: "function",
      id: "function-quote-delivery",
    });

    const report = await buildReport(manifest, projectRoot, "release");

    assert.equal(report.currentPass, true);
    assert.equal(report.releaseReady, true);
    assert.equal(report.inventory.functions.total, 2);
    assert.deepEqual(report.parity.unresolved, []);
  });
});

test("published functions remain strict for integration and parity", async () => {
  await withFixtureProject(async (projectRoot) => {
    const manifest = fixtureManifest();
    const fn = manifest.functions[0];
    fn.integrationStatus = "frontend-only";
    fn.parity.mobile = { status: "blocked" };
    fn.integrationBlocker = {
      sourceId: "source-home",
      functionId: fn.id,
      publication: "published",
      rationale: "Remote delivery is not connected.",
    };

    const report = await buildReport(manifest, projectRoot, "release");

    assert.equal(report.currentPass, false);
    assert.equal(report.releaseReady, false);
    assert.equal(
      report.releaseBlockers.some((issue) => issue.code === "incomplete-published-function"),
      true,
    );
    assert.equal(
      report.releaseBlockers.some(
        (issue) => issue.code === "release-parity-incomplete" && issue.path.includes("functions[0]"),
      ),
      true,
    );
    assert.deepEqual(report.parity.unresolved, [
      { entityType: "function", id: fn.id, device: "mobile", status: "blocked" },
    ]);
  });
});

test("an unpublished blocked function requires explicit matching approval for release", async () => {
  await withFixtureProject(async (projectRoot) => {
    const manifest = fixtureManifest();
    const fn = manifest.functions[0];
    fn.publication = "withheld";
    fn.integrationStatus = "blocked";
    fn.integrationBlocker = {
      sourceId: "source-home",
      functionId: fn.id,
      publication: "withheld",
      rationale: "Private delivery credentials are not available.",
    };
    manifest.pages[0].blocks = manifest.pages[0].blocks.filter(
      (block) => block.type !== "function",
    );

    let report = await buildReport(manifest, projectRoot, "release");
    assert.equal(report.currentPass, false);
    assert.equal(
      report.releaseBlockers.some(
        (issue) => issue.code === "unapproved-unpublished-function-blocker",
      ),
      true,
    );

    fn.integrationBlocker.approval = {
      sourceId: "source-home",
      by: "Fixture client",
      at: "2026-08-27",
      decision: "defer",
    };
    report = await buildReport(manifest, projectRoot, "release");
    assert.equal(
      report.releaseBlockers.some(
        (issue) => issue.code === "integration-approval-decision-mismatch",
      ),
      true,
    );
  });
});

test("blocked integrations validate source, function, publication, rationale, and approval linkage", async () => {
  await withFixtureProject(async () => {
    const manifest = fixtureManifest();
    const fn = manifest.functions[0];
    fn.publication = "withheld";
    fn.integrationStatus = "blocked";
    fn.capability = {
      experienceId: "experience-contact",
      capabilityId: "capability-contact-delivery",
      kind: "delivery",
      execution: "remote",
      label: sourceText("Contact delivery"),
      evidence: [],
    };
    fn.integrationBlocker = {
      sourceId: "source-missing",
      functionId: "function-wrong",
      publication: "draft",
      rationale: "",
      approval: {
        sourceId: "approval-missing",
        by: "",
        at: "",
        decision: "unsupported",
      },
    };
    manifest.pages[0].blocks = manifest.pages[0].blocks.filter(
      (block) => block.type !== "function",
    );

    const issues = validateSiteManifest(manifest, "release");
    const codes = new Set(issues.map((issue) => issue.code));

    assert.equal(codes.has("missing-function-capability-evidence"), true);
    assert.equal(codes.has("unknown-integration-blocker-source"), true);
    assert.equal(codes.has("integration-blocker-function-mismatch"), true);
    assert.equal(codes.has("integration-blocker-publication-mismatch"), true);
    assert.equal(codes.has("integration-blocker-without-rationale"), true);
    assert.equal(codes.has("unknown-integration-approval-source"), true);
    assert.equal(codes.has("incomplete-integration-approval"), true);
    assert.equal(codes.has("invalid-integration-approval-decision"), true);
    assert.equal(codes.has("incomplete-published-function"), false);
    assert.equal(codes.has("release-parity-incomplete"), false);
  });
});
