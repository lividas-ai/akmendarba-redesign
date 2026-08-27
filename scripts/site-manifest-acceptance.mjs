import { stat } from "node:fs/promises";
import path from "node:path";

const parityStatuses = [
  "equivalent",
  "adapted",
  "intentional-omit",
  "pending",
  "failed",
  "blocked",
];
const parityDevices = ["desktop", "tablet", "mobile"];
const acceptedParityStatuses = new Set(["equivalent", "adapted"]);
const coverageStatuses = ["migrated", "adapted", "intentional-omit", "blocked"];

function countBy(values, selector) {
  const counts = new Map();
  for (const value of values) {
    const key = String(selector(value));
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

function countFor(counts, key) {
  return counts[key] ?? 0;
}

function addIssue(issues, issue) {
  const duplicate = issues.some(
    (candidate) =>
      candidate.code === issue.code &&
      candidate.path === issue.path &&
      candidate.message === issue.message &&
      candidate.severity === issue.severity,
  );
  if (!duplicate) issues.push(issue);
}

function mergeIssues(...issueGroups) {
  const merged = [];
  for (const group of issueGroups) {
    for (const issue of group) addIssue(merged, issue);
  }
  return merged;
}

function collectEvidenceReferences(value, pathName = "manifest", references = []) {
  if (!value || typeof value !== "object") return references;

  if (Array.isArray(value)) {
    value.forEach((item, index) => collectEvidenceReferences(item, `${pathName}[${index}]`, references));
    return references;
  }

  for (const [key, item] of Object.entries(value)) {
    const itemPath = `${pathName}.${key}`;
    if (key === "evidence" && Array.isArray(item)) {
      item.forEach((reference, index) => {
        if (reference && typeof reference === "object" && typeof reference.sourceId === "string") {
          references.push({ sourceId: reference.sourceId, path: `${itemPath}[${index}]` });
        }
      });
    }
    collectEvidenceReferences(item, itemPath, references);
  }

  return references;
}

function validateCoverageShape(manifest) {
  const issues = [];
  const records = Array.isArray(manifest.sourceCoverage) ? manifest.sourceCoverage : [];

  for (const [index, coverage] of records.entries()) {
    const issuePath = `sourceCoverage[${index}]`;
    const destinations = Array.isArray(coverage.destinations) ? coverage.destinations : [];

    if (!coverageStatuses.includes(coverage.status)) {
      issues.push({
        code: "invalid-coverage-status",
        message: `Coverage ${coverage.sourceId} has unsupported status ${String(coverage.status)}.`,
        path: issuePath,
        severity: "error",
      });
    }

    if (typeof coverage.reviewedAt !== "string" || coverage.reviewedAt.trim().length === 0) {
      issues.push({
        code: "coverage-without-review-date",
        message: `Coverage ${coverage.sourceId} has no review date.`,
        path: issuePath,
        severity: "error",
      });
    }

    if (["migrated", "adapted"].includes(coverage.status) && destinations.length === 0) {
      issues.push({
        code: "coverage-without-destination",
        message: `Coverage ${coverage.sourceId} is ${coverage.status} but has no destination.`,
        path: issuePath,
        severity: "error",
      });
    }

    if (coverage.status === "intentional-omit") {
      const approval = coverage.approval;
      if (
        typeof coverage.rationale !== "string" ||
        coverage.rationale.trim().length === 0 ||
        !approval ||
        typeof approval.by !== "string" ||
        approval.by.trim().length === 0 ||
        typeof approval.at !== "string" ||
        approval.at.trim().length === 0
      ) {
        issues.push({
          code: "unapproved-intentional-omit",
          message: `Coverage ${coverage.sourceId} is intentionally omitted without a complete rationale and approval.`,
          path: issuePath,
          severity: "error",
        });
      }
    }

    if (
      coverage.status === "blocked" &&
      (typeof coverage.rationale !== "string" || coverage.rationale.trim().length === 0)
    ) {
      issues.push({
        code: "blocked-coverage-without-rationale",
        message: `Coverage ${coverage.sourceId} is blocked without a rationale.`,
        path: issuePath,
        severity: "error",
      });
    }
  }

  return issues;
}

function fallbackEvidenceIssues(manifest, evidenceReferences) {
  if (Array.isArray(manifest.sourceCoverage)) return [];

  const issues = [];
  const sources = new Map((manifest.sources ?? []).map((source) => [source.id, source]));
  const referencedSourceIds = new Set(evidenceReferences.map((reference) => reference.sourceId));

  for (const sourceId of referencedSourceIds) {
    const source = sources.get(sourceId);
    if (!source) continue;
    if (source.kind === "url" && source.status !== "captured") {
      issues.push({
        code: "unresolved-evidence-source",
        message: `Referenced source ${sourceId} is ${source.status}.`,
        path: "sources",
        severity: "error",
      });
    }
  }

  return issues;
}

function classifyMediaSource(src) {
  if (typeof src !== "string" || src.trim().length === 0) return "invalid";
  if (src.startsWith("//") || /^[a-z][a-z\d+.-]*:/i.test(src)) return "external";
  return "local";
}

function resolvePublicMediaPath(src, projectRoot) {
  let pathname = src;
  try {
    pathname = decodeURIComponent(src.split(/[?#]/, 1)[0]);
  } catch {
    return { error: "The media path contains invalid percent encoding." };
  }

  const publicRoot = path.resolve(projectRoot, "public");
  const relativePath = pathname.replace(/^[/\\]+/, "");
  const filePath = path.resolve(publicRoot, relativePath);
  const insidePublic = filePath === publicRoot || filePath.startsWith(`${publicRoot}${path.sep}`);

  if (!insidePublic || filePath === publicRoot) {
    return { error: "The media path does not resolve to a file inside public/." };
  }

  return { filePath, publicPath: `/${relativePath.split(path.sep).join("/")}` };
}

async function inspectLocalMedia(manifest, projectRoot) {
  const variants = [];
  const issues = [];

  for (const [mediaIndex, media] of manifest.media.entries()) {
    for (const [variantIndex, variant] of media.variants.entries()) {
      const variantPath = `media[${mediaIndex}].variants[${variantIndex}]`;
      const sourceType = classifyMediaSource(variant.src);
      const result = {
        mediaId: media.id,
        src: variant.src,
        sourceType,
        exists: sourceType === "external",
        bytes: null,
        filePath: null,
      };

      if (sourceType === "invalid") {
        issues.push({
          code: "invalid-media-source",
          message: `Media ${media.id} has an empty or invalid source.`,
          path: variantPath,
          severity: "error",
        });
        variants.push(result);
        continue;
      }

      if (sourceType === "external") {
        variants.push(result);
        continue;
      }

      const resolved = resolvePublicMediaPath(variant.src, projectRoot);
      if (resolved.error) {
        issues.push({
          code: "unsafe-local-media-path",
          message: `Media ${media.id}: ${resolved.error}`,
          path: variantPath,
          severity: "error",
        });
        variants.push(result);
        continue;
      }

      result.filePath = resolved.filePath;
      try {
        const fileDetails = await stat(resolved.filePath);
        result.exists = fileDetails.isFile();
        result.bytes = fileDetails.isFile() ? fileDetails.size : null;
      } catch {
        result.exists = false;
      }

      if (!result.exists) {
        issues.push({
          code: "missing-local-media",
          message: `Media ${media.id} references missing local file ${resolved.publicPath}.`,
          path: variantPath,
          severity: "error",
        });
      }

      variants.push(result);
    }
  }

  const uniqueLocalFiles = new Map();
  for (const variant of variants) {
    if (variant.sourceType !== "local" || !variant.exists || !variant.filePath) continue;
    if (!uniqueLocalFiles.has(variant.filePath)) uniqueLocalFiles.set(variant.filePath, variant.bytes ?? 0);
  }

  return {
    variants,
    issues,
    uniqueLocalFileCount: uniqueLocalFiles.size,
    uniqueLocalBytes: [...uniqueLocalFiles.values()].reduce((total, size) => total + size, 0),
  };
}

function parityEntities(manifest) {
  const pageEntities = manifest.pages.map((page) => ({
    entityType: "page",
    id: page.id,
    activeForRelease: page.publication === "published",
    parity: page.parity,
  }));
  const mediaEntities = manifest.media.map((media) => ({
    entityType: "media",
    id: media.id,
    activeForRelease: true,
    parity: media.parity,
  }));
  const functionEntities = manifest.functions.map((fn) => ({
    entityType: "function",
    id: fn.id,
    activeForRelease: fn.publication === "published",
    parity: fn.parity,
  }));
  const blockEntities = manifest.pages.flatMap((page) =>
    page.blocks.map((block) => ({
      entityType: "block",
      id: `${page.id}/${block.id}`,
      activeForRelease: page.publication === "published" && block.publication === "published",
      parity: block.parity,
    })),
  );

  return [...pageEntities, ...mediaEntities, ...functionEntities, ...blockEntities];
}

function summarizeParity(entities) {
  const entityTypes = ["page", "media", "function", "block"];
  const summary = {};

  for (const entityType of entityTypes) {
    const matching = entities.filter((entity) => entity.entityType === entityType);
    summary[entityType] = {};
    for (const device of parityDevices) {
      summary[entityType][device] = Object.fromEntries(
        parityStatuses.map((status) => [
          status,
          matching.filter((entity) => entity.parity?.[device]?.status === status).length,
        ]),
      );
      summary[entityType][device].total = matching.length;
    }
  }

  const unresolved = entities.flatMap((entity) => {
    if (!entity.activeForRelease) return [];
    return parityDevices.flatMap((device) => {
      const status = entity.parity?.[device]?.status ?? "missing";
      return acceptedParityStatuses.has(status)
        ? []
        : [{ entityType: entity.entityType, id: entity.id, device, status }];
    });
  });

  return { summary, unresolved };
}

function issueCategory(code) {
  if (code.includes("parity")) return "parity";
  if (code.includes("coverage") || code.includes("evidence") || code.includes("source")) return "evidence";
  if (code.includes("rights")) return "rights";
  if (code.includes("function") || code.includes("integration")) return "function";
  if (code.includes("media")) return "media";
  return "structure";
}

function describeIssuePath(manifest, issuePath) {
  const match = /^(pages|media|functions|sourceCoverage)\[(\d+)]/.exec(issuePath);
  if (!match) return issuePath;
  const index = Number(match[2]);
  const collection =
    match[1] === "pages"
      ? manifest.pages
      : match[1] === "media"
        ? manifest.media
        : match[1] === "functions"
          ? manifest.functions
          : manifest.sourceCoverage ?? [];
  const entity = collection[index];
  const id = entity?.id ?? entity?.sourceId;
  return id ? `${issuePath} (${id})` : issuePath;
}

function formatBreakdown(counts) {
  const entries = Object.entries(counts);
  return entries.length === 0 ? "none" : entries.map(([key, value]) => `${key}: ${value}`).join(", ");
}

function markdownTable(headers, rows) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KiB", "MiB", "GiB"];
  let value = bytes;
  let unit = "B";
  for (const candidate of units) {
    value /= 1024;
    unit = candidate;
    if (value < 1024) break;
  }
  return `${value.toFixed(2)} ${unit}`;
}

function renderIssues(manifest, issues, emptyMessage, limit = Number.POSITIVE_INFINITY) {
  if (issues.length === 0) return emptyMessage;
  const visibleIssues = issues.slice(0, limit);
  const rendered = visibleIssues
    .map(
      (issue) =>
        `- **${issue.severity.toUpperCase()} · ${issue.code}** — ${describeIssuePath(manifest, issue.path)} — ${issue.message}`,
    )
    .join("\n");
  const hiddenCount = issues.length - visibleIssues.length;
  return hiddenCount > 0
    ? `${rendered}\n- **${hiddenCount} additional issues are not expanded here; the totals above remain exact.**`
    : rendered;
}

function renderParitySummary(parity) {
  const rows = [];
  for (const entityType of ["page", "media", "function", "block"]) {
    for (const device of parityDevices) {
      const counts = parity.summary[entityType][device];
      rows.push([
        entityType,
        device,
        String(counts.total),
        String(countFor(counts, "equivalent")),
        String(countFor(counts, "adapted")),
        String(countFor(counts, "intentional-omit")),
        String(countFor(counts, "pending")),
        String(countFor(counts, "failed")),
        String(countFor(counts, "blocked")),
      ]);
    }
  }
  return markdownTable(
    ["Entity", "Device", "Total", "Equivalent", "Adapted", "Intentional omit", "Pending", "Failed", "Blocked"],
    rows,
  );
}

function renderReport(report) {
  const lines = [
    "# Site manifest acceptance report",
    "",
    `- Site ID: \`${report.siteId}\``,
    `- Schema version: \`${report.schemaVersion}\``,
    `- Validation mode: \`${report.mode}\``,
    `- Current-mode acceptance: **${report.currentPass ? "PASS" : "FAIL"}**`,
    `- Release readiness: **${report.releaseReady ? "READY" : "BLOCKED"}**`,
    "",
    "## Exact inventory",
    "",
    markdownTable(
      ["Entity", "Count"],
      [
        ["Pages", String(report.inventory.pages.total)],
        ["Media assets", String(report.inventory.media.total)],
        ["Media variants", String(report.inventory.media.variants)],
        ["Functions", String(report.inventory.functions.total)],
        ["Sources", String(report.inventory.sources.total)],
        ["Source coverage records", String(report.inventory.coverage.total)],
        ["Evidence references", String(report.inventory.evidence.references)],
      ],
    ),
    "",
    `- Pages by publication: ${formatBreakdown(report.inventory.pages.byPublication)}`,
    `- Pages by kind: ${formatBreakdown(report.inventory.pages.byKind)}`,
    `- Media by kind: ${formatBreakdown(report.inventory.media.byKind)}`,
    `- Media rights: ${formatBreakdown(report.inventory.media.byRights)}`,
    `- Functions by type: ${formatBreakdown(report.inventory.functions.byType)}`,
    `- Functions by integration: ${formatBreakdown(report.inventory.functions.byIntegration)}`,
    `- Sources by kind: ${formatBreakdown(report.inventory.sources.byKind)}`,
    `- URL source status: ${formatBreakdown(report.inventory.sources.byUrlStatus)}`,
    `- Coverage status: ${formatBreakdown(report.inventory.coverage.byStatus)}`,
    `- Coverage destinations: ${report.inventory.coverage.destinations}`,
    `- Unique evidence sources referenced: ${report.inventory.evidence.uniqueSources}`,
    "",
    "## Parity",
    "",
    renderParitySummary(report.parity),
    "",
    `Release-active unresolved parity checks: **${report.parity.unresolved.length}**`,
  ];

  if (report.parity.unresolved.length > 0) {
    const visibleParityIssues = report.parity.unresolved.slice(0, 40);
    lines.push(
      "",
      ...visibleParityIssues.map(
        (item) => `- ${item.entityType} \`${item.id}\` · ${item.device}: \`${item.status}\``,
      ),
    );
    const hiddenParityIssues = report.parity.unresolved.length - visibleParityIssues.length;
    if (hiddenParityIssues > 0) {
      lines.push(`- **${hiddenParityIssues} additional parity issues are not expanded here; the total remains exact.**`);
    }
  }

  lines.push(
    "",
    "## Local media",
    "",
    `- Local variants: ${report.localMedia.localVariants}`,
    `- External variants: ${report.localMedia.externalVariants}`,
    `- Invalid variants: ${report.localMedia.invalidVariants}`,
    `- Existing local variants: ${report.localMedia.existingLocalVariants}`,
    `- Missing local variants: ${report.localMedia.missingLocalVariants}`,
    `- Unique existing local files: ${report.localMedia.uniqueLocalFileCount}`,
    `- Unique local file bytes: ${report.localMedia.uniqueLocalBytes} (${formatBytes(report.localMedia.uniqueLocalBytes)})`,
    "",
    "## Current-mode validation",
    "",
    `- Total: ${report.currentIssues.length}`,
    `- By severity: ${formatBreakdown(report.currentIssuesBySeverity)}`,
    `- By category: ${formatBreakdown(report.currentIssuesByCategory)}`,
    `- By code: ${formatBreakdown(report.currentIssuesByCode)}`,
    "",
    renderIssues(report.manifest, report.currentIssues, "No current-mode issues.", 40),
    "",
    "## Release blockers",
    "",
    `- Total: ${report.releaseBlockers.length}`,
    `- By category: ${formatBreakdown(report.releaseBlockersByCategory)}`,
    `- By code: ${formatBreakdown(report.releaseBlockersByCode)}`,
    "",
    renderIssues(report.manifest, report.releaseBlockers, "No unresolved release blockers.", 40),
  );

  return `${lines.join("\n")}\n`;
}

export async function buildSiteManifestAcceptance({
  manifest,
  projectRoot,
  mode = "draft",
  draftIssues = [],
  releaseIssues = [],
}) {
  if (mode !== "draft" && mode !== "release") throw new Error(`Unsupported validation mode: ${mode}.`);

  const evidenceReferences = collectEvidenceReferences(manifest);
  const coverageShapeIssues = validateCoverageShape(manifest);
  const fallbackIssues = fallbackEvidenceIssues(manifest, evidenceReferences);
  const localMediaInspection = await inspectLocalMedia(manifest, projectRoot);
  const sharedIssues = mergeIssues(coverageShapeIssues, localMediaInspection.issues);
  const releaseOnlyIssues = mergeIssues(fallbackIssues);
  const currentValidationIssues = mode === "release" ? releaseIssues : draftIssues;
  const currentIssues = mergeIssues(currentValidationIssues, sharedIssues, mode === "release" ? releaseOnlyIssues : []);
  const releaseBlockers = mergeIssues(releaseIssues, sharedIssues, releaseOnlyIssues).filter(
    (issue) => issue.severity === "error",
  );
  const currentPass = currentIssues.every((issue) => issue.severity !== "error");
  const parity = summarizeParity(parityEntities(manifest));
  const coverage = Array.isArray(manifest.sourceCoverage) ? manifest.sourceCoverage : [];
  const urlSources = manifest.sources.filter((source) => source.kind === "url");
  const localVariants = localMediaInspection.variants.filter((variant) => variant.sourceType === "local");

  const report = {
    manifest,
    mode,
    siteId: manifest.siteId,
    schemaVersion: manifest.schemaVersion,
    currentPass,
    releaseReady: releaseBlockers.length === 0,
    currentIssues,
    currentIssuesBySeverity: countBy(currentIssues, (issue) => issue.severity),
    currentIssuesByCategory: countBy(currentIssues, (issue) => issueCategory(issue.code)),
    currentIssuesByCode: countBy(currentIssues, (issue) => issue.code),
    releaseBlockers,
    releaseBlockersByCategory: countBy(releaseBlockers, (issue) => issueCategory(issue.code)),
    releaseBlockersByCode: countBy(releaseBlockers, (issue) => issue.code),
    inventory: {
      pages: {
        total: manifest.pages.length,
        byPublication: countBy(manifest.pages, (page) => page.publication),
        byKind: countBy(manifest.pages, (page) => page.kind),
      },
      media: {
        total: manifest.media.length,
        variants: manifest.media.reduce((total, media) => total + media.variants.length, 0),
        byKind: countBy(manifest.media, (media) => media.kind),
        byRights: countBy(manifest.media, (media) => media.provenance.rights),
      },
      functions: {
        total: manifest.functions.length,
        byType: countBy(manifest.functions, (fn) => fn.type),
        byIntegration: countBy(manifest.functions, (fn) => fn.integrationStatus),
        byPublication: countBy(manifest.functions, (fn) => fn.publication),
      },
      sources: {
        total: manifest.sources.length,
        byKind: countBy(manifest.sources, (source) => source.kind),
        byUrlStatus: countBy(urlSources, (source) => source.status),
      },
      coverage: {
        total: coverage.length,
        byStatus: countBy(coverage, (record) => record.status),
        destinations: coverage.reduce(
          (total, record) => total + (Array.isArray(record.destinations) ? record.destinations.length : 0),
          0,
        ),
      },
      evidence: {
        references: evidenceReferences.length,
        uniqueSources: new Set(evidenceReferences.map((reference) => reference.sourceId)).size,
      },
    },
    parity,
    localMedia: {
      localVariants: localVariants.length,
      externalVariants: localMediaInspection.variants.filter((variant) => variant.sourceType === "external").length,
      invalidVariants: localMediaInspection.variants.filter((variant) => variant.sourceType === "invalid").length,
      existingLocalVariants: localVariants.filter((variant) => variant.exists).length,
      missingLocalVariants: localVariants.filter((variant) => !variant.exists).length,
      uniqueLocalFileCount: localMediaInspection.uniqueLocalFileCount,
      uniqueLocalBytes: localMediaInspection.uniqueLocalBytes,
    },
  };

  return { ...report, markdown: renderReport(report) };
}
