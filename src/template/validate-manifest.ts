import type {
  ActionTarget,
  Block,
  EvidenceRef,
  NavigationItem,
  ParityMatrix,
  SiteManifest,
  TextValue,
} from "@/template/schema";

export type ValidationSeverity = "error" | "warning";

export type ValidationIssue = {
  code: string;
  message: string;
  path: string;
  severity: ValidationSeverity;
};

type ValidationMode = "draft" | "release";

const publicationAllowsRender = (publication: string) => publication === "published";

function duplicateValues(values: readonly string[]) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function evidenceFromText(text: TextValue): readonly EvidenceRef[] {
  return text.origin === "ui" ? [] : text.evidence;
}

const placeholderPattern = /\[(?:confirm|patvirtinti|todo|tbd)[^\]]*\]|\b(?:lorem ipsum|todo|tbd)\b/i;

function textValuesFromBlock(block: Block): readonly TextValue[] {
  switch (block.type) {
    case "hero":
      return [
        block.data.eyebrow,
        block.data.heading,
        block.data.body,
        ...(block.data.actions ?? []).map((action) => action.label),
      ].filter((value): value is TextValue => value !== undefined);
    case "richText":
      return [block.data.heading, ...block.data.paragraphs].filter(
        (value): value is TextValue => value !== undefined,
      );
    case "media":
      return block.data.caption ? [block.data.caption] : [];
    case "collection":
      return block.data.heading ? [block.data.heading] : [];
    case "facts":
      return [
        block.data.heading,
        ...block.data.items.flatMap((item) => [item.label, item.value]),
      ].filter((value): value is TextValue => value !== undefined);
    case "process":
      return [
        block.data.heading,
        ...block.data.steps.flatMap((step) => [step.title, step.body]),
      ].filter((value): value is TextValue => value !== undefined);
    case "gallery":
      return block.data.heading ? [block.data.heading] : [];
    case "callToAction":
      return [
        block.data.heading,
        block.data.body,
        ...block.data.actions.map((action) => action.label),
      ].filter((value): value is TextValue => value !== undefined);
    case "function":
      return [];
    default:
      return [];
  }
}

function mediaIdsFromBlock(block: Block): readonly string[] {
  switch (block.type) {
    case "hero":
      return block.data.mediaId ? [block.data.mediaId] : [];
    case "media":
    case "gallery":
      return block.data.mediaIds;
    default:
      return [];
  }
}

function targetsFromBlock(block: Block): readonly ActionTarget[] {
  if (block.type === "hero" || block.type === "callToAction") {
    return (block.data.actions ?? []).map((action) => action.target);
  }
  if (block.type === "function") {
    return [{ kind: "function", functionId: block.data.functionId }];
  }
  return [];
}

function parityIssues(parity: ParityMatrix, path: string, mode: ValidationMode): ValidationIssue[] {
  if (mode === "draft") return [];
  return (Object.entries(parity) as [keyof ParityMatrix, ParityMatrix[keyof ParityMatrix]][])
    .filter(([, result]) => !["equivalent", "adapted"].includes(result.status))
    .map(([device, result]) => ({
      code: "release-parity-incomplete",
      message: `${device} parity is ${result.status}; production requires equivalent or adapted.`,
      path: `${path}.parity.${device}`,
      severity: "error" as const,
    }));
}

function validateTarget(
  target: ActionTarget,
  path: string,
  pageIds: ReadonlySet<string>,
  functionIds: ReadonlySet<string>,
  sourceIds: ReadonlySet<string>,
): ValidationIssue[] {
  if (target.kind === "page" && !pageIds.has(target.pageId)) {
    return [{ code: "unknown-page-target", message: `Unknown page ${target.pageId}.`, path, severity: "error" }];
  }
  if (target.kind === "function" && !functionIds.has(target.functionId)) {
    return [{ code: "unknown-function-target", message: `Unknown function ${target.functionId}.`, path, severity: "error" }];
  }
  if (target.kind === "external") {
    return target.evidence
      .filter((reference) => !sourceIds.has(reference.sourceId))
      .map((reference) => ({
        code: "unknown-external-evidence",
        message: `Unknown source ${reference.sourceId}.`,
        path,
        severity: "error" as const,
      }));
  }
  return [];
}

function flattenNavigation(items: readonly NavigationItem[]): readonly NavigationItem[] {
  return items.flatMap((item) => [item, ...flattenNavigation(item.children ?? [])]);
}

export function validateSiteManifest(manifest: SiteManifest, mode: ValidationMode = "draft") {
  const issues: ValidationIssue[] = [];
  const sourceIds = new Set(manifest.sources.map((source) => source.id));
  const mediaIds = new Set(manifest.media.map((media) => media.id));
  const functionIds = new Set(manifest.functions.map((fn) => fn.id));
  const pageIds = new Set(manifest.pages.map((page) => page.id));
  const publishedPageIds = new Set(
    manifest.pages.filter((page) => publicationAllowsRender(page.publication)).map((page) => page.id),
  );

  for (const duplicate of duplicateValues(manifest.sourceCoverage.map((record) => record.sourceId))) {
    issues.push({
      code: "duplicate-source-coverage",
      message: `Source ${duplicate} has more than one coverage record.`,
      path: "sourceCoverage",
      severity: "error",
    });
  }

  const coveredSourceIds = new Set(manifest.sourceCoverage.map((record) => record.sourceId));
  for (const source of manifest.sources) {
    if (!coveredSourceIds.has(source.id)) {
      issues.push({
        code: "missing-source-coverage",
        message: `Source ${source.id} is not mapped to the new site.`,
        path: "sourceCoverage",
        severity: mode === "release" ? "error" : "warning",
      });
    }
  }

  for (const [index, coverage] of manifest.sourceCoverage.entries()) {
    const path = `sourceCoverage[${index}]`;
    if (!sourceIds.has(coverage.sourceId)) {
      issues.push({
        code: "unknown-covered-source",
        message: `Coverage references unknown source ${coverage.sourceId}.`,
        path,
        severity: "error",
      });
    }

    for (const destination of coverage.destinations ?? []) {
      const destinationExists =
        destination.kind === "page"
          ? pageIds.has(destination.id)
          : destination.kind === "media"
            ? mediaIds.has(destination.id)
            : functionIds.has(destination.id);
      if (!destinationExists) {
        issues.push({
          code: "unknown-coverage-destination",
          message: `Coverage references unknown ${destination.kind} ${destination.id}.`,
          path,
          severity: "error",
        });
      }
    }

    if (mode === "release" && coverage.status === "blocked") {
      issues.push({
        code: "blocked-source-coverage",
        message: `Source ${coverage.sourceId} remains blocked: ${coverage.rationale}`,
        path,
        severity: "error",
      });
    }
  }

  for (const [kind, values] of [
    ["source", manifest.sources.map((source) => source.id)],
    ["media", manifest.media.map((media) => media.id)],
    ["function", manifest.functions.map((fn) => fn.id)],
    ["page", manifest.pages.map((page) => page.id)],
    ["path", manifest.pages.map((page) => page.path)],
  ] as const) {
    for (const duplicate of duplicateValues(values)) {
      issues.push({
        code: `duplicate-${kind}`,
        message: `Duplicate ${kind} value ${duplicate}.`,
        path: kind,
        severity: "error",
      });
    }
  }

  for (const duplicate of duplicateValues(
    manifest.functions.flatMap((fn) => (fn.capability ? [fn.capability.capabilityId] : [])),
  )) {
    issues.push({
      code: "duplicate-function-capability",
      message: `Duplicate function capability ${duplicate}.`,
      path: "functions",
      severity: "error",
    });
  }

  if (!pageIds.has(manifest.homePageId)) {
    issues.push({ code: "unknown-home-page", message: "homePageId does not resolve.", path: "homePageId", severity: "error" });
  }
  if (!pageIds.has(manifest.primaryPageId)) {
    issues.push({ code: "unknown-primary-page", message: "primaryPageId does not resolve.", path: "primaryPageId", severity: "error" });
  }

  const validateEvidence = (references: readonly EvidenceRef[], path: string) => {
    for (const reference of references) {
      if (!sourceIds.has(reference.sourceId)) {
        issues.push({
          code: "unknown-evidence-source",
          message: `Evidence references unknown source ${reference.sourceId}.`,
          path,
          severity: "error",
        });
      }
    }
  };

  const validateTextValue = (text: TextValue, path: string) => {
    validateEvidence(evidenceFromText(text), path);
    if (text.value.trim().length === 0) {
      issues.push({ code: "empty-text-value", message: "Text values cannot be empty.", path, severity: "error" });
    }
    if (text.origin !== "ui" && text.evidence.length === 0) {
      issues.push({ code: "missing-text-evidence", message: "Factual text requires evidence.", path, severity: "error" });
    }
    if (text.origin === "derived" && text.derivation.trim().length === 0) {
      issues.push({ code: "missing-derivation", message: "Derived text requires a derivation note.", path, severity: "error" });
    }
    if (text.origin !== "ui" && placeholderPattern.test(text.value)) {
      issues.push({
        code: "placeholder-factual-text",
        message: "Factual text contains a placeholder token.",
        path,
        severity: mode === "release" ? "error" : "warning",
      });
    }
  };

  for (const [index, media] of manifest.media.entries()) {
    const path = `media[${index}]`;
    validateEvidence(media.provenance.evidence, `${path}.provenance`);
    if (!media.decorative && !media.alt) {
      issues.push({ code: "missing-media-alt", message: "Meaningful media requires alt text.", path, severity: "error" });
    }
    if (media.alt) validateTextValue(media.alt, `${path}.alt`);
    if (mode === "release" && media.provenance.rights === "unknown") {
      issues.push({ code: "unknown-media-rights", message: "Published media rights are unknown.", path, severity: "error" });
    }
    issues.push(...parityIssues(media.parity, path, mode));
  }

  for (const [index, fn] of manifest.functions.entries()) {
    const path = `functions[${index}]`;
    validateEvidence(fn.evidence, `${path}.evidence`);

    if (fn.capability) {
      validateEvidence(fn.capability.evidence, `${path}.capability.evidence`);
      validateTextValue(fn.capability.label, `${path}.capability.label`);
      if (fn.capability.evidence.length === 0) {
        issues.push({
          code: "missing-function-capability-evidence",
          message: `Function capability ${fn.capability.capabilityId} requires evidence.`,
          path: `${path}.capability.evidence`,
          severity: "error",
        });
      }
      if (fn.capability.experienceId.trim().length === 0) {
        issues.push({
          code: "empty-function-experience-id",
          message: "Function capability experienceId cannot be empty.",
          path: `${path}.capability.experienceId`,
          severity: "error",
        });
      }
      if (fn.capability.capabilityId.trim().length === 0) {
        issues.push({
          code: "empty-function-capability-id",
          message: "Function capability capabilityId cannot be empty.",
          path: `${path}.capability.capabilityId`,
          severity: "error",
        });
      }
    }

    const blocker = fn.integrationBlocker;
    if (fn.integrationStatus === "complete" && blocker) {
      issues.push({
        code: "unexpected-integration-blocker",
        message: `Complete function ${fn.id} cannot retain an integration blocker.`,
        path: `${path}.integrationBlocker`,
        severity: "error",
      });
    }
    if (fn.integrationStatus !== "complete" && !blocker) {
      issues.push({
        code: "missing-integration-blocker",
        message: `${fn.integrationStatus} function ${fn.id} requires a traceable integration blocker.`,
        path: `${path}.integrationBlocker`,
        severity: "error",
      });
    }
    if (blocker) {
      if (!sourceIds.has(blocker.sourceId)) {
        issues.push({
          code: "unknown-integration-blocker-source",
          message: `Integration blocker references unknown source ${blocker.sourceId}.`,
          path: `${path}.integrationBlocker.sourceId`,
          severity: "error",
        });
      }
      if (blocker.functionId !== fn.id) {
        issues.push({
          code: "integration-blocker-function-mismatch",
          message: `Integration blocker belongs to ${blocker.functionId}, not ${fn.id}.`,
          path: `${path}.integrationBlocker.functionId`,
          severity: "error",
        });
      }
      if (blocker.publication !== fn.publication) {
        issues.push({
          code: "integration-blocker-publication-mismatch",
          message: `Integration blocker publication ${blocker.publication} does not match ${fn.publication}.`,
          path: `${path}.integrationBlocker.publication`,
          severity: "error",
        });
      }
      if (blocker.rationale.trim().length === 0) {
        issues.push({
          code: "integration-blocker-without-rationale",
          message: `Integration blocker for ${fn.id} requires a rationale.`,
          path: `${path}.integrationBlocker.rationale`,
          severity: "error",
        });
      }
      if (blocker.approval) {
        if (!sourceIds.has(blocker.approval.sourceId)) {
          issues.push({
            code: "unknown-integration-approval-source",
            message: `Integration approval references unknown source ${blocker.approval.sourceId}.`,
            path: `${path}.integrationBlocker.approval.sourceId`,
            severity: "error",
          });
        }
        if (blocker.approval.by.trim().length === 0 || blocker.approval.at.trim().length === 0) {
          issues.push({
            code: "incomplete-integration-approval",
            message: `Integration approval for ${fn.id} requires approver and date.`,
            path: `${path}.integrationBlocker.approval`,
            severity: "error",
          });
        }
        if (!["defer", "withhold", "proceed-frontend-only"].includes(blocker.approval.decision)) {
          issues.push({
            code: "invalid-integration-approval-decision",
            message: `Integration approval for ${fn.id} has an unsupported decision.`,
            path: `${path}.integrationBlocker.approval.decision`,
            severity: "error",
          });
        }
      }

      if (
        mode === "release" &&
        fn.publication !== "published" &&
        fn.integrationStatus !== "complete" &&
        !blocker.approval
      ) {
        issues.push({
          code: "unapproved-unpublished-function-blocker",
          message: `Unpublished blocked function ${fn.id} requires an explicit client approval before release.`,
          path: `${path}.integrationBlocker.approval`,
          severity: "error",
        });
      }

      if (
        blocker.approval &&
        ((fn.publication === "withheld" && blocker.approval.decision !== "withhold") ||
          ((fn.publication === "draft" || fn.publication === "ready") &&
            blocker.approval.decision !== "defer")
        )
      ) {
        issues.push({
          code: "integration-approval-decision-mismatch",
          message: `Approval decision ${blocker.approval.decision} does not match ${fn.publication} publication.`,
          path: `${path}.integrationBlocker.approval.decision`,
          severity: "error",
        });
      }
    }

    if (fn.publication === "published" && fn.integrationStatus !== "complete") {
      issues.push({
        code: "incomplete-published-function",
        message: `Published function ${fn.id} is ${fn.integrationStatus}.`,
        path,
        severity: mode === "release" ? "error" : "warning",
      });
    }
    issues.push(...parityIssues(fn.parity, path, fn.publication === "published" ? mode : "draft"));
  }

  for (const [pageIndex, page] of manifest.pages.entries()) {
    const pagePath = `pages[${pageIndex}]`;
    const published = page.publication === "published";
    validateTextValue(page.title, `${pagePath}.title`);
    if (page.navigationTitle) validateTextValue(page.navigationTitle, `${pagePath}.navigationTitle`);
    if (page.parentPageId && !pageIds.has(page.parentPageId)) {
      issues.push({ code: "unknown-parent-page", message: `Unknown parent ${page.parentPageId}.`, path: pagePath, severity: "error" });
    }
    if (published && page.blocks.filter((block) => block.publication === "published").length === 0) {
      issues.push({ code: "empty-published-page", message: "Published page has no published blocks.", path: pagePath, severity: "error" });
    }
    if (page.seo) {
      validateTextValue(page.seo.title, `${pagePath}.seo.title`);
      if (page.seo.description) validateTextValue(page.seo.description, `${pagePath}.seo.description`);
      if (page.seo.imageMediaId && !mediaIds.has(page.seo.imageMediaId)) {
        issues.push({ code: "unknown-seo-media", message: `Unknown media ${page.seo.imageMediaId}.`, path: pagePath, severity: "error" });
      }
    }
    issues.push(...parityIssues(page.parity, pagePath, published ? mode : "draft"));

    for (const [blockIndex, block] of page.blocks.entries()) {
      const blockPath = `${pagePath}.blocks[${blockIndex}]`;
      for (const text of textValuesFromBlock(block)) validateTextValue(text, blockPath);
      for (const mediaId of mediaIdsFromBlock(block)) {
        if (!mediaIds.has(mediaId)) {
          issues.push({ code: "unknown-block-media", message: `Unknown media ${mediaId}.`, path: blockPath, severity: "error" });
        }
      }
      if (block.type === "collection") {
        for (const itemPageId of block.data.itemPageIds) {
          if (!pageIds.has(itemPageId)) {
            issues.push({ code: "unknown-collection-page", message: `Unknown page ${itemPageId}.`, path: blockPath, severity: "error" });
          }
        }
      }
      for (const target of targetsFromBlock(block)) {
        issues.push(...validateTarget(target, blockPath, pageIds, functionIds, sourceIds));
      }
      issues.push(...parityIssues(block.parity, blockPath, published && block.publication === "published" ? mode : "draft"));
    }
  }

  const navigationItems = flattenNavigation([
    ...manifest.navigation.primary,
    ...manifest.navigation.utility,
    ...manifest.navigation.footer,
  ]);
  for (const [index, item] of navigationItems.entries()) {
    const path = `navigation[${index}]`;
    validateTextValue(item.label, `${path}.label`);
    issues.push(...validateTarget(item.target, path, pageIds, functionIds, sourceIds));
    if (item.target.kind === "page" && !publishedPageIds.has(item.target.pageId)) {
      issues.push({ code: "navigation-to-unpublished-page", message: `Navigation points to unpublished page ${item.target.pageId}.`, path, severity: "error" });
    }
    if (item.mediaId && !mediaIds.has(item.mediaId)) {
      issues.push({ code: "unknown-navigation-media", message: `Unknown media ${item.mediaId}.`, path, severity: "error" });
    }
  }

  const destinationKey = (item: NavigationItem) =>
    item.target.kind === "page"
      ? `page:${item.target.pageId}`
      : item.target.kind === "function"
        ? `function:${item.target.functionId}`
        : `external:${item.target.url}`;

  const validateNavigationSiblings = (items: readonly NavigationItem[], path: string) => {
    for (const destination of duplicateValues(items.map(destinationKey))) {
      issues.push({
        code: "duplicate-navigation-destination",
        message: `Navigation repeats destination ${destination} in the same menu level.`,
        path,
        severity: "error",
      });
    }
    items.forEach((item, index) => validateNavigationSiblings(item.children ?? [], `${path}[${index}].children`));
  };

  validateNavigationSiblings(manifest.navigation.primary, "navigation.primary");
  validateNavigationSiblings(manifest.navigation.utility, "navigation.utility");
  validateNavigationSiblings(manifest.navigation.footer, "navigation.footer");

  const reachablePageIds = new Set<string>([manifest.homePageId]);
  for (const item of navigationItems) {
    if (item.target.kind === "page") reachablePageIds.add(item.target.pageId);
  }
  for (const page of manifest.pages.filter((candidate) => candidate.publication === "published")) {
    for (const block of page.blocks.filter((candidate) => candidate.publication === "published")) {
      if (block.type === "collection") block.data.itemPageIds.forEach((id) => reachablePageIds.add(id));
      for (const target of targetsFromBlock(block)) {
        if (target.kind === "page") reachablePageIds.add(target.pageId);
      }
    }
  }

  let addedParentChild = true;
  while (addedParentChild) {
    addedParentChild = false;
    for (const page of manifest.pages) {
      if (page.parentPageId && reachablePageIds.has(page.parentPageId) && !reachablePageIds.has(page.id)) {
        reachablePageIds.add(page.id);
        addedParentChild = true;
      }
    }
  }

  for (const page of manifest.pages.filter((candidate) => candidate.publication === "published")) {
    if (!reachablePageIds.has(page.id)) {
      issues.push({
        code: "orphan-published-page",
        message: `Published page ${page.id} is not reachable from navigation, a published parent, collection, or action.`,
        path: `pages.${page.id}`,
        severity: mode === "release" ? "error" : "warning",
      });
    }
  }

  return issues;
}

export function assertValidSiteManifest(manifest: SiteManifest, mode: ValidationMode = "draft") {
  const errors = validateSiteManifest(manifest, mode).filter((issue) => issue.severity === "error");
  if (errors.length > 0) {
    const details = errors.map((issue) => `${issue.code} at ${issue.path}: ${issue.message}`).join("\n");
    throw new Error(`Client manifest validation failed:\n${details}`);
  }
  return manifest;
}
