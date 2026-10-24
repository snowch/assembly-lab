// Copyright © 2026 Christopher Snow

// Real production releases on an isolated origin, with physical network failure controls.
import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { expect } from "@playwright/test";
import { BUILD_MARKER, renderRelease } from "../../apps/course/offline/plugin";
const base = "/assembly-lab/";
const dist = resolve("apps/course/dist");

async function readFiles(directory: string, prefix = ""): Promise<Map<string, Buffer>> {
  const result = new Map<string, Buffer>();
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = `${prefix}${entry.name}`;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      for (const [key, bytes] of await readFiles(path, `${name}/`)) result.set(key, bytes);
    } else result.set(name, await readFile(path));
  }
  return result;
}

export async function deployment() {
  const original = await readFiles(dist);
  const template = await readFile(resolve("apps/course/offline/worker.js"), "utf8");
  expect(original.has("release.json"), "Build the production app before browser tests").toBe(true);
  const initial = JSON.parse(original.get("release.json")!.toString()) as {
    buildId: string;
    commit: string | null;
    committedAt: string | null;
    totalBytes: number;
  };
  let files = new Map(original);
  let networkAvailable = true;
  let failedPath: string | undefined;
  let corruptResponse = false;
  let delayedPath: string | undefined;
  let delay = 0;
  let metadata: "valid" | "malformed" | "failure" | "timeout" = "valid";
  let cdnCache: "canonical" | "all" | null = null;
  const requests: string[] = [];
  const requestHeaders: { path: string; cacheControl?: string }[] = [];
  const server = createServer((request, response) => {
    const requestedPath = new URL(request.url ?? "/", "http://localhost").pathname;
    const path = decodeURIComponent(requestedPath).replace(/\/+/g, "/");
    requests.push(`${request.method} ${requestedPath}`);
    // Page-level offline emulation does not reliably stop service-worker fetches.
    // Refuse the real HTTP connection as well when a test disconnects this site.
    if (!networkAvailable) {
      request.socket?.destroy();
      return;
    }
    requestHeaders.push({ path, cacheControl: request.headers["cache-control"] });
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Access-Control-Allow-Origin", "*");
    if (path === "/root-sw.js") {
      response.setHeader("Content-Type", "text/javascript");
      response.end(
        "self.addEventListener('install', e => e.waitUntil(self.skipWaiting())); self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));",
      );
      return;
    }
    if (!path.startsWith(base) || request.method !== "GET") {
      response.setHeader("Content-Type", "text/html");
      response.end("<!doctype html><title>Another app</title><p>Network response</p>");
      return;
    }
    const name = path.slice(base.length) || "index.html";
    if (name === "release.json" && metadata !== "valid") {
      if (metadata === "timeout") return;
      response.setHeader("Content-Type", "application/json");
      response.writeHead(metadata === "failure" ? 503 : 200).end('{"buildId":"invented"}');
      return;
    }
    if (path === failedPath) {
      response
        .writeHead(corruptResponse ? 200 : 503)
        .end(corruptResponse ? "Bytes from the wrong release" : "Temporarily unavailable");
      return;
    }
    const cachedMetadata =
      name === "release.json" && cdnCache && (cdnCache === "all" || requestedPath === path);
    if (cachedMetadata) response.setHeader("Age", "300");
    const bytes = cachedMetadata ? original.get(name) : files.get(name);
    if (!bytes) {
      response.writeHead(404).end("Unknown resource");
      return;
    }
    response.setHeader(
      "Content-Type",
      name.endsWith(".html")
        ? "text/html"
        : name.endsWith(".js")
          ? "text/javascript"
          : name.endsWith(".css")
            ? "text/css"
            : name.endsWith(".woff2")
              ? "font/woff2"
              : name.endsWith(".json") || name.endsWith(".webmanifest")
                ? "application/json"
                : "application/octet-stream",
    );
    if (path === delayedPath)
      setTimeout(() => {
        if (!response.destroyed) response.end(bytes);
      }, delay);
    else response.end(bytes);
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing test server port");
  const origin = `http://127.0.0.1:${address.port}`;
  return {
    origin,
    url: `${origin}${base}`,
    initial,
    original,
    requests,
    requestHeaders,
    connected(value: boolean) {
      networkAvailable = value;
    },
    publish(marker: string) {
      const html = original
        .get("index.html")!
        .toString()
        .replace(/(<meta name="course-build-id" content=")[^"]+("\s*\/?>)/, `$1${BUILD_MARKER}$2`)
        .replace("</head>", `<meta name="offline-test-release" content="${marker}"></head>`);
      const input = new Map(original);
      input.set("index.html", Buffer.from(html));
      // An actual changed downloadable asset ensures update tests cannot pass by
      // relabelling an already cached shell without fetching the replacement.
      input.set(
        "native/Makefile",
        Buffer.from(`${original.get("native/Makefile")}\n# ${marker}\n`),
      );
      const built = renderRelease(
        template,
        [...input].map(([path, bytes]) => ({ path, bytes })),
        initial.commit && initial.committedAt
          ? { sha: initial.commit, committedAt: initial.committedAt }
          : null,
      );
      files = new Map(built.files.map((file) => [file.path, Buffer.from(file.bytes)]));
      files.set("sw.js", Buffer.from(built.worker));
      files.set("release.json", Buffer.from(JSON.stringify(built.metadata)));
      return built.metadata;
    },
    failure(path?: string, corrupt = false) {
      failedPath = path;
      corruptResponse = corrupt;
    },
    delay(path?: string, milliseconds = 0) {
      delayedPath = path;
      delay = milliseconds;
    },
    metadata(mode: typeof metadata) {
      metadata = mode;
    },
    cdnCache(mode: typeof cdnCache) {
      cdnCache = mode;
    },
    async close() {
      server.closeAllConnections();
      await new Promise<void>((done, reject) =>
        server.close((error) => (error ? reject(error) : done())),
      );
    },
  };
}
