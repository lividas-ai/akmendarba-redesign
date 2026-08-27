#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildSiteManifestAcceptance } from "./site-manifest-acceptance.mjs";

function usage() {
  return [
    "Usage: node scripts/validate-site-manifest.mjs [options]",
    "",
    "Options:",
    "  --mode <draft|release>  Validation gate to apply (default: draft)",
    "  --output <file>         Also write the Markdown report to a file",
    "  --project-root <path>   Project root containing public/ (default: cwd)",
    "  --help                  Show this help",
  ].join("\n");
}

function parseArguments(argumentsList) {
  const options = { mode: "draft", output: null, projectRoot: process.cwd(), help: false };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }

    const [name, inlineValue] = argument.split("=", 2);
    if (!["--mode", "--output", "--project-root"].includes(name)) {
      throw new Error(`Unknown argument: ${argument}`);
    }

    const value = inlineValue ?? argumentsList[index + 1];
    if (!inlineValue) index += 1;
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${name}.`);

    if (name === "--mode") options.mode = value;
    if (name === "--output") options.output = value;
    if (name === "--project-root") options.projectRoot = path.resolve(value);
  }

  if (!options.help && !["draft", "release"].includes(options.mode)) {
    throw new Error(`Unsupported validation mode: ${options.mode}.`);
  }

  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  const [{ activeSiteManifest }, { validateSiteManifest }] = await Promise.all([
    import("@/client/manifest"),
    import("@/template/validate-manifest"),
  ]);

  const report = await buildSiteManifestAcceptance({
    manifest: activeSiteManifest,
    mode: options.mode,
    projectRoot: options.projectRoot,
    draftIssues: validateSiteManifest(activeSiteManifest, "draft"),
    releaseIssues: validateSiteManifest(activeSiteManifest, "release"),
  });

  process.stdout.write(report.markdown);

  if (options.output) {
    const outputPath = path.resolve(options.output);
    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, report.markdown, "utf8");
    process.stdout.write(`\nReport written to ${outputPath}\n`);
  }

  if (!report.currentPass) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`Site manifest validation could not run: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
