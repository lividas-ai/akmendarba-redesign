import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const sourceOrigin = "https://akmendarba.lt";
const outputDirectory = path.resolve("public/client/akmendarba/source");
const evidenceDirectory = path.resolve(".migration/evidence");

await mkdir(outputDirectory, { recursive: true });
await mkdir(evidenceDirectory, { recursive: true });

async function fetchJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "Akmendarba demo migration audit" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

const mediaPages = await Promise.all([
  fetchJson(`${sourceOrigin}/wp-json/wp/v2/media?per_page=100&page=1&_fields=id,date,slug,link,alt_text,caption,media_details,source_url`),
  fetchJson(`${sourceOrigin}/wp-json/wp/v2/media?per_page=100&page=2&_fields=id,date,slug,link,alt_text,caption,media_details,source_url`),
]);

const media = mediaPages.flat();

for (const item of media) {
  const url = new URL(item.source_url);
  const fileName = path.basename(decodeURIComponent(url.pathname));
  const response = await fetch(url, { headers: { "user-agent": "Akmendarba demo migration audit" } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  await writeFile(path.join(outputDirectory, fileName), bytes);
}

await writeFile(
  path.join(evidenceDirectory, "source-media.json"),
  `${JSON.stringify({ capturedAt: new Date().toISOString(), sourceOrigin, count: media.length, media }, null, 2)}\n`,
  "utf8",
);

console.log(`Downloaded ${media.length} public source assets to ${outputDirectory}`);
