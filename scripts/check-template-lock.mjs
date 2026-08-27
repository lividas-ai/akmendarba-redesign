#!/usr/bin/env node

import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";
import { lstat, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

const CONTRACT_FIELDS = new Set([
  "$schema",
  "version",
  "lockedPaths",
  "replaceableRoots",
  "clientGeneratedPaths",
  "notes",
]);

const REQUIRED_CONTRACT_FIELDS = [
  "version",
  "lockedPaths",
  "replaceableRoots",
  "clientGeneratedPaths",
  "notes",
];

const GLOB_CACHE = new Map();

function compareText(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function describeSource(source) {
  return source ? ` in ${source}` : "";
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateContractPath(value, fieldName, index) {
  const label = `${fieldName}[${index}]`;

  if (typeof value !== "string" || value.length === 0) {
    return `${label} must be a non-empty string.`;
  }

  if (value.trim() !== value) {
    return `${label} must not have leading or trailing whitespace.`;
  }

  if (value.includes("\\")) {
    return `${label} must use forward slashes.`;
  }

  if (isAbsolute(value) || /^[A-Za-z]:\//.test(value)) {
    return `${label} must be relative to the template root.`;
  }

  const segments = value.split("/");
  if (segments.some((segment) => segment === "" || segment === "." || segment === "..")) {
    return `${label} must be a normalized relative path without empty, '.' or '..' segments.`;
  }

  return null;
}

function validateStringArray(contract, fieldName, issues) {
  const value = contract[fieldName];

  if (!Array.isArray(value) || value.length === 0) {
    issues.push(`${fieldName} must be a non-empty array.`);
    return;
  }

  const seen = new Set();
  value.forEach((entry, index) => {
    const pathIssue = validateContractPath(entry, fieldName, index);
    if (pathIssue) {
      issues.push(pathIssue);
      return;
    }

    if (seen.has(entry)) {
      issues.push(`${fieldName} must contain unique entries; '${entry}' is duplicated.`);
    }
    seen.add(entry);
  });
}

/**
 * Validate the repository's template lock contract without mutating it.
 */
export function validateLockContract(contract, { source } = {}) {
  const issues = [];

  if (!isPlainObject(contract)) {
    throw new TypeError(`Template lock${describeSource(source)} must be a JSON object.`);
  }

  for (const field of REQUIRED_CONTRACT_FIELDS) {
    if (!Object.hasOwn(contract, field)) {
      issues.push(`Missing required field '${field}'.`);
    }
  }

  for (const field of Object.keys(contract)) {
    if (!CONTRACT_FIELDS.has(field)) {
      issues.push(`Unknown field '${field}'.`);
    }
  }

  if (!Number.isInteger(contract.version) || contract.version < 1) {
    issues.push("version must be an integer greater than or equal to 1.");
  }

  if (Object.hasOwn(contract, "$schema") && typeof contract.$schema !== "string") {
    issues.push("$schema must be a string when present.");
  }

  validateStringArray(contract, "lockedPaths", issues);
  validateStringArray(contract, "replaceableRoots", issues);
  validateStringArray(contract, "clientGeneratedPaths", issues);

  if (typeof contract.notes !== "string" || contract.notes.length === 0) {
    issues.push("notes must be a non-empty string.");
  }

  if (issues.length > 0) {
    throw new TypeError(
      `Invalid template lock${describeSource(source)}:\n${issues.map((issue) => `- ${issue}`).join("\n")}`,
    );
  }

  return contract;
}

export async function readLockContract(lockFilePath) {
  let source;
  try {
    source = await readFile(lockFilePath, "utf8");
  } catch (error) {
    throw new Error(`Unable to read template lock at ${lockFilePath}: ${error.message}`, {
      cause: error,
    });
  }

  let contract;
  try {
    contract = JSON.parse(source);
  } catch (error) {
    throw new SyntaxError(`Invalid JSON in template lock at ${lockFilePath}: ${error.message}`, {
      cause: error,
    });
  }

  return validateLockContract(contract, { source: lockFilePath });
}

function normalizeCandidatePath(candidatePath) {
  if (typeof candidatePath !== "string" || candidatePath.length === 0) {
    throw new TypeError("candidatePath must be a non-empty string.");
  }

  const normalized = candidatePath.replaceAll("\\", "/").replace(/^\.\//, "");
  const issue = validateContractPath(normalized, "candidatePath", 0);
  if (issue) {
    throw new TypeError(issue.replace("candidatePath[0]", "candidatePath"));
  }

  return normalized;
}

function literalPathContains(rootPath, candidatePath) {
  return candidatePath === rootPath || candidatePath.startsWith(`${rootPath}/`);
}

function escapeRegExpCharacter(character) {
  return /[\\^$.*+?()[\]{}|]/.test(character) ? `\\${character}` : character;
}

function globToRegExp(pattern) {
  const cached = GLOB_CACHE.get(pattern);
  if (cached) return cached;

  let source = "^";
  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];

    if (character === "*") {
      if (pattern[index + 1] === "*") {
        index += 1;
        if (pattern[index + 1] === "/") {
          index += 1;
          source += "(?:.*/)?";
        } else {
          source += ".*";
        }
      } else {
        source += "[^/]*";
      }
      continue;
    }

    if (character === "?") {
      source += "[^/]";
      continue;
    }

    source += escapeRegExpCharacter(character);
  }

  const expression = new RegExp(`${source}$`);
  GLOB_CACHE.set(pattern, expression);
  return expression;
}

function matchesGeneratedPath(candidatePath, pattern) {
  if (globToRegExp(pattern).test(candidatePath)) return true;

  if (pattern.endsWith("/**") && candidatePath === pattern.slice(0, -3)) {
    return true;
  }

  if (!/[?*]/.test(pattern)) {
    return literalPathContains(pattern, candidatePath);
  }

  return false;
}

/**
 * Classify a repository-relative path. Locked paths intentionally win over every
 * generated or replaceable declaration, including overlapping broad globs.
 */
export function classifyContractPath(candidatePath, contract) {
  validateLockContract(contract);
  const normalized = normalizeCandidatePath(candidatePath);

  if (contract.lockedPaths.some((lockedPath) => literalPathContains(lockedPath, normalized))) {
    return "locked";
  }

  if (contract.clientGeneratedPaths.some((pattern) => matchesGeneratedPath(normalized, pattern))) {
    return "clientGenerated";
  }

  if (contract.replaceableRoots.some((rootPath) => literalPathContains(rootPath, normalized))) {
    return "replaceable";
  }

  return "template";
}

function resolveContractPath(rootDir, contractPath) {
  const absolutePath = resolve(rootDir, ...contractPath.split("/"));
  const relativePath = relative(rootDir, absolutePath);

  if (relativePath === ".." || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) {
    throw new Error(`Contract path escapes the template root: ${contractPath}`);
  }

  return absolutePath;
}

async function hashFile(absolutePath) {
  const hash = createHash("sha256");
  let bytes = 0;

  for await (const chunk of createReadStream(absolutePath)) {
    bytes += chunk.length;
    hash.update(chunk);
  }

  return { bytes, sha256: hash.digest("hex") };
}

async function collectDirectoryFiles(absoluteDirectory, rootDir, recordsByPath) {
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  entries.sort((left, right) => compareText(left.name, right.name));

  for (const entry of entries) {
    const absolutePath = resolve(absoluteDirectory, entry.name);
    const repositoryPath = relative(rootDir, absolutePath).split(sep).join("/");

    if (entry.isSymbolicLink()) {
      throw new Error(`Locked paths may not contain symbolic links: ${repositoryPath}`);
    }

    if (entry.isDirectory()) {
      await collectDirectoryFiles(absolutePath, rootDir, recordsByPath);
      continue;
    }

    if (!entry.isFile()) {
      throw new Error(`Locked paths may contain only regular files and directories: ${repositoryPath}`);
    }

    if (!recordsByPath.has(repositoryPath)) {
      recordsByPath.set(repositoryPath, {
        path: repositoryPath,
        ...(await hashFile(absolutePath)),
      });
    }
  }
}

async function inspectLockedTarget(rootDir, lockedPath) {
  const absolutePath = resolveContractPath(rootDir, lockedPath);
  try {
    return { absolutePath, stats: await lstat(absolutePath) };
  } catch (error) {
    if (error?.code === "ENOENT") {
      return { absolutePath, missing: true };
    }
    throw new Error(`Unable to inspect locked path '${lockedPath}': ${error.message}`, {
      cause: error,
    });
  }
}

/**
 * Create a deterministic snapshot of every file covered by lockedPaths.
 * Directories are traversed recursively; duplicate coverage is de-duplicated.
 */
export async function createLockSnapshot({ rootDir = process.cwd(), contract }) {
  const validatedContract = validateLockContract(contract);
  const absoluteRoot = resolve(rootDir);
  const targets = [];
  const missingPaths = [];

  for (const lockedPath of validatedContract.lockedPaths) {
    const target = await inspectLockedTarget(absoluteRoot, lockedPath);
    if (target.missing) {
      missingPaths.push(lockedPath);
    } else {
      targets.push({ ...target, lockedPath });
    }
  }

  if (missingPaths.length > 0) {
    throw new Error(
      `Locked ${missingPaths.length === 1 ? "path does" : "paths do"} not exist (lockedPaths are literal; globs are not expanded):\n${missingPaths
        .map((lockedPath) => `- ${lockedPath}`)
        .join("\n")}`,
    );
  }

  const recordsByPath = new Map();
  for (const target of targets) {
    if (target.stats.isSymbolicLink()) {
      throw new Error(`Locked paths may not be symbolic links: ${target.lockedPath}`);
    }

    if (target.stats.isDirectory()) {
      await collectDirectoryFiles(target.absolutePath, absoluteRoot, recordsByPath);
      continue;
    }

    if (!target.stats.isFile()) {
      throw new Error(`Locked path must be a regular file or directory: ${target.lockedPath}`);
    }

    if (!recordsByPath.has(target.lockedPath)) {
      recordsByPath.set(target.lockedPath, {
        path: target.lockedPath,
        ...(await hashFile(target.absolutePath)),
      });
    }
  }

  return {
    version: 1,
    algorithm: "sha256",
    lockVersion: validatedContract.version,
    records: [...recordsByPath.values()].sort((left, right) => compareText(left.path, right.path)),
  };
}

export function validateLockSnapshot(snapshot, { source } = {}) {
  const issues = [];

  if (!isPlainObject(snapshot)) {
    throw new TypeError(`Template lock snapshot${describeSource(source)} must be a JSON object.`);
  }

  if (snapshot.version !== 1) {
    issues.push("version must be 1.");
  }
  if (snapshot.algorithm !== "sha256") {
    issues.push("algorithm must be 'sha256'.");
  }
  if (!Number.isInteger(snapshot.lockVersion) || snapshot.lockVersion < 1) {
    issues.push("lockVersion must be an integer greater than or equal to 1.");
  }
  if (!Array.isArray(snapshot.records)) {
    issues.push("records must be an array.");
  } else {
    const seen = new Set();
    snapshot.records.forEach((record, index) => {
      if (!isPlainObject(record)) {
        issues.push(`records[${index}] must be an object.`);
        return;
      }

      const pathIssue = validateContractPath(record.path, "records.path", index);
      if (pathIssue) issues.push(pathIssue);
      if (typeof record.sha256 !== "string" || !/^[a-f0-9]{64}$/.test(record.sha256)) {
        issues.push(`records[${index}].sha256 must be a lowercase SHA-256 digest.`);
      }
      if (!Number.isInteger(record.bytes) || record.bytes < 0) {
        issues.push(`records[${index}].bytes must be a non-negative integer.`);
      }
      if (typeof record.path === "string" && seen.has(record.path)) {
        issues.push(`records must contain unique paths; '${record.path}' is duplicated.`);
      }
      seen.add(record.path);
    });
  }

  if (issues.length > 0) {
    throw new TypeError(
      `Invalid template lock snapshot${describeSource(source)}:\n${issues
        .map((issue) => `- ${issue}`)
        .join("\n")}`,
    );
  }

  return snapshot;
}

export async function readLockSnapshot(snapshotFilePath) {
  let source;
  try {
    source = await readFile(snapshotFilePath, "utf8");
  } catch (error) {
    throw new Error(`Unable to read template lock snapshot at ${snapshotFilePath}: ${error.message}`, {
      cause: error,
    });
  }

  let snapshot;
  try {
    snapshot = JSON.parse(source);
  } catch (error) {
    throw new SyntaxError(`Invalid JSON in template lock snapshot at ${snapshotFilePath}: ${error.message}`, {
      cause: error,
    });
  }

  return validateLockSnapshot(snapshot, { source: snapshotFilePath });
}

export function compareLockSnapshots(expectedSnapshot, actualSnapshot) {
  const expected = validateLockSnapshot(expectedSnapshot);
  const actual = validateLockSnapshot(actualSnapshot);
  const expectedByPath = new Map(expected.records.map((record) => [record.path, record]));
  const actualByPath = new Map(actual.records.map((record) => [record.path, record]));

  const missing = expected.records
    .filter((record) => !actualByPath.has(record.path))
    .map((record) => record.path)
    .sort();
  const added = actual.records
    .filter((record) => !expectedByPath.has(record.path))
    .map((record) => record.path)
    .sort();
  const changed = actual.records
    .filter((record) => {
      const previous = expectedByPath.get(record.path);
      return previous && (previous.sha256 !== record.sha256 || previous.bytes !== record.bytes);
    })
    .map((record) => record.path)
    .sort();
  const metadata = [];

  if (expected.version !== actual.version) metadata.push("version");
  if (expected.algorithm !== actual.algorithm) metadata.push("algorithm");
  if (expected.lockVersion !== actual.lockVersion) metadata.push("lockVersion");

  return {
    matches: missing.length === 0 && added.length === 0 && changed.length === 0 && metadata.length === 0,
    missing,
    added,
    changed,
    metadata,
  };
}

/**
 * Parse and validate template.lock.json, snapshot all locked files, and optionally
 * compare the result with a previously persisted snapshot JSON file.
 */
export async function checkTemplateLock({
  rootDir = process.cwd(),
  lockFile = "template.lock.json",
  snapshotFile,
} = {}) {
  const absoluteRoot = resolve(rootDir);
  const lockFilePath = isAbsolute(lockFile) ? lockFile : resolve(absoluteRoot, lockFile);
  const contract = await readLockContract(lockFilePath);
  const snapshot = await createLockSnapshot({ rootDir: absoluteRoot, contract });

  if (!snapshotFile) {
    return { ok: true, contract, snapshot, comparison: null };
  }

  const snapshotFilePath = isAbsolute(snapshotFile)
    ? snapshotFile
    : resolve(absoluteRoot, snapshotFile);
  const expectedSnapshot = await readLockSnapshot(snapshotFilePath);
  const comparison = compareLockSnapshots(expectedSnapshot, snapshot);

  return { ok: comparison.matches, contract, snapshot, comparison };
}

function parseCliArguments(argv) {
  const options = {
    rootDir: process.cwd(),
    lockFile: "template.lock.json",
    snapshotFile: undefined,
    writeSnapshotFile: undefined,
    json: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--json") {
      options.json = true;
    } else if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else if (argument === "--root" || argument === "--lock" || argument === "--snapshot" || argument === "--write-snapshot") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error(`${argument} requires a path.`);
      }
      index += 1;
      if (argument === "--root") options.rootDir = value;
      if (argument === "--lock") options.lockFile = value;
      if (argument === "--snapshot") options.snapshotFile = value;
      if (argument === "--write-snapshot") options.writeSnapshotFile = value;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function formatComparison(comparison) {
  const lines = ["Template lock snapshot mismatch."];
  for (const field of ["missing", "added", "changed"]) {
    if (comparison[field].length > 0) {
      lines.push(`${field}:`);
      lines.push(...comparison[field].map((path) => `  - ${path}`));
    }
  }
  if (comparison.metadata.length > 0) {
    lines.push(`metadata: ${comparison.metadata.join(", ")}`);
  }
  return lines.join("\n");
}

async function main(argv) {
  const options = parseCliArguments(argv);
  if (options.help) {
    console.log(
      [
        "Usage: node scripts/check-template-lock.mjs [options]",
        "",
        "Options:",
        "  --root <path>      Template root (default: current directory)",
        "  --lock <path>      Lock contract relative to root (default: template.lock.json)",
        "  --snapshot <path>  Optional snapshot JSON to compare",
        "  --write-snapshot <path>  Persist the computed snapshot JSON",
        "  --json             Print the computed snapshot/result as JSON",
        "  -h, --help         Show this help",
      ].join("\n"),
    );
    return;
  }

  const result = await checkTemplateLock(options);
  if (options.writeSnapshotFile) {
    const outputPath = isAbsolute(options.writeSnapshotFile)
      ? options.writeSnapshotFile
      : resolve(options.rootDir, options.writeSnapshotFile);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(result.snapshot, null, 2)}\n`, "utf8");
  }
  if (options.json) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.ok) {
    const suffix = result.comparison ? " and matches the supplied snapshot" : "";
    const writeSuffix = options.writeSnapshotFile ? `; snapshot written to ${options.writeSnapshotFile}` : "";
    console.log(
      `Template lock is valid${suffix}: ${result.contract.lockedPaths.length} locked paths, ${result.snapshot.records.length} files${writeSuffix}.`,
    );
  } else {
    console.error(formatComparison(result.comparison));
  }

  if (!result.ok) process.exitCode = 1;
}

const entryPoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : null;
if (entryPoint === import.meta.url) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
