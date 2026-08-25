import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd(), "out");
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
};

function safePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const withIndex = decoded.endsWith("/") ? `${decoded}index.html` : decoded;
  const normalized = normalize(withIndex).replace(/^([.][.][/\\])+/, "");
  const candidate = resolve(join(root, normalized));
  return candidate.startsWith(root) ? candidate : null;
}

const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
    let filePath = safePath(pathname);
    if (!filePath) throw new Error("unsafe-path");

    let details = await stat(filePath).catch(() => null);
    if (details?.isDirectory()) {
      filePath = join(filePath, "index.html");
      details = await stat(filePath).catch(() => null);
    }
    if (!details?.isFile()) {
      const routeIndex = `${filePath}/index.html`;
      const routeDetails = await stat(routeIndex).catch(() => null);
      if (routeDetails?.isFile()) {
        filePath = routeIndex;
        details = routeDetails;
      }
    }
    if (!details?.isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const contentType = mimeTypes[extname(filePath)] ?? "application/octet-stream";
    const rangeHeader = request.headers.range;
    if (rangeHeader) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader);
      if (!match) {
        response.writeHead(416, { "Content-Range": `bytes */${details.size}` });
        response.end();
        return;
      }

      const [, rawStart, rawEnd] = match;
      let start = rawStart ? Number(rawStart) : Math.max(0, details.size - Number(rawEnd || 0));
      let end = rawEnd && rawStart ? Number(rawEnd) : details.size - 1;
      start = Math.max(0, start);
      end = Math.min(details.size - 1, end);

      if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
        response.writeHead(416, { "Content-Range": `bytes */${details.size}` });
        response.end();
        return;
      }

      response.writeHead(206, {
        "Accept-Ranges": "bytes",
        "Cache-Control": "no-store",
        "Content-Length": end - start + 1,
        "Content-Range": `bytes ${start}-${end}/${details.size}`,
        "Content-Type": contentType,
      });
      if (request.method === "HEAD") {
        response.end();
        return;
      }
      createReadStream(filePath, { start, end }).pipe(response);
      return;
    }

    response.writeHead(200, {
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store",
      "Content-Length": details.size,
      "Content-Type": contentType,
    });
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Server error");
  }
});

server.listen(3000, "127.0.0.1", () => {
  process.stdout.write("Static QA server ready on http://127.0.0.1:3000\n");
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
