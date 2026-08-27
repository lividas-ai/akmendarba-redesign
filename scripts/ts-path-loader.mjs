import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const sourceRoot = path.join(projectRoot, "src");
const sourceExtensions = [".ts", ".tsx", ".mts", ".mjs", ".js"];

function isFile(candidate) {
  try {
    return existsSync(candidate) && statSync(candidate).isFile();
  } catch {
    return false;
  }
}

function resolveSourcePath(specifier) {
  const relativePath = specifier.slice(2);
  const candidate = path.resolve(sourceRoot, relativePath);

  if (isFile(candidate)) return candidate;

  for (const extension of sourceExtensions) {
    const withExtension = `${candidate}${extension}`;
    if (isFile(withExtension)) return withExtension;
  }

  for (const extension of sourceExtensions) {
    const indexFile = path.join(candidate, `index${extension}`);
    if (isFile(indexFile)) return indexFile;
  }

  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (!specifier.startsWith("@/")) return nextResolve(specifier, context);

  const resolvedPath = resolveSourcePath(specifier);
  if (!resolvedPath) {
    throw new Error(`Cannot resolve project alias ${specifier} from ${sourceRoot}.`);
  }

  return {
    shortCircuit: true,
    url: pathToFileURL(resolvedPath).href,
  };
}
