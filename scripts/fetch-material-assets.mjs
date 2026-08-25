import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { basename, extname, join } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { materials } from "../src/data/materials.ts";

const runFile = promisify(execFile);
const outputRoot = new URL("../public/assets/materials/", import.meta.url);
const temporaryRoot = await mkdtemp(join(tmpdir(), "granit-decor-materials-"));
const cwebp = "/opt/homebrew/bin/cwebp";

async function fetchAsset(material, index) {
  let response = await fetch(material.optimizedUrl);
  if (!response.ok) response = await fetch(material.sourceUrl);
  if (!response.ok) throw new Error(`${material.name}: HTTP ${response.status}`);

  const extension = extname(new URL(response.url).pathname) || ".jpg";
  const temporaryFile = join(temporaryRoot, `${material.slug}${extension}`);
  const outputFile = new URL(basename(material.localPath), outputRoot);
  await writeFile(temporaryFile, Buffer.from(await response.arrayBuffer()));
  await runFile(cwebp, ["-quiet", "-q", "82", "-resize", "960", "0", temporaryFile, "-o", outputFile.pathname]);

  if ((index + 1) % 10 === 0 || index + 1 === materials.length) {
    process.stdout.write(`Optimized ${index + 1}/${materials.length}\n`);
  }
}

for (let index = 0; index < materials.length; index += 1) {
  await fetchAsset(materials[index], index);
}

process.stdout.write(`Completed ${materials.length} material assets.\n`);
