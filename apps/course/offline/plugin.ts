// Copyright © 2026 Christopher Snow

import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join, posix } from "node:path";
import { fileURLToPath } from "node:url";

import type { Plugin } from "vite";

export const WORKER_FILE = "sw.js";
export const RELEASE_FILE = "release.json";
export const BUILD_MARKER = "__COURSE_BUILD_ID__";
// Migrate away from filenames whose old bytes embedded a particular release ID.
export const CSS_ASSET_PATTERN = "assets/[name]-[hash]-relative-v1[extname]";
const workerPath = fileURLToPath(new URL("./worker.js", import.meta.url));
const excluded = (path: string) =>
  path === WORKER_FILE ||
  path === RELEASE_FILE ||
  path.startsWith("releases/") ||
  path.endsWith(".map");

export interface OfflineFile {
  path: string;
  bytes: string | Uint8Array;
}
export interface SourceVersion {
  sha: string;
  committedAt: string;
}
const digest = (bytes: string | Uint8Array) => createHash("sha256").update(bytes).digest("base64");
const describe = (file: OfflineFile) => ({
  path: file.path,
  bytes: Buffer.byteLength(file.bytes),
  integrity: `sha256-${digest(file.bytes)}`,
});

/** Hash the normalized HTML before embedding the ID, then hash its final bytes for integrity. */
export function renderRelease(
  template: string,
  files: readonly OfflineFile[],
  source: SourceVersion | null = null,
) {
  const sorted = [...files]
    .filter((file) => !excluded(file.path))
    .map((file) =>
      file.path === "index.html"
        ? {
            ...file,
            // Pin runtime entry points before hashing; normalise an already built
            // document too (release fixtures and reproducible packaging).
            bytes: Buffer.from(file.bytes)
              .toString("utf8")
              .replace(/releases\/[a-f0-9]{64}\/(?=assets\/)/g, "")
              .replace(
                /((?:src|href)=["'][^"']*?)(assets\/[^"']+)(["'])/g,
                `$1releases/${BUILD_MARKER}/$2$3`,
              ),
          }
        : file.path.endsWith(".css")
          ? {
              ...file,
              bytes: Buffer.from(file.bytes)
                .toString("utf8")
                .replace(
                  /(url\(["']?)(\/[^)"']*?\/|\/)((?:assets|fonts)\/[^)"']+)(["']?\))/g,
                  (original, open: string, prefix: string, target: string, close: string) => {
                    if (prefix.startsWith("//")) return original;
                    const separator = target.search(/[?#]/);
                    const path = separator < 0 ? target : target.slice(0, separator);
                    const suffix = separator < 0 ? "" : target.slice(separator);
                    // The same bytes resolve inside canonical and immutable trees.
                    return `${open}${posix.relative(posix.dirname(file.path), path)}${suffix}${close}`;
                  },
                ),
            }
          : file,
    )
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  if (!sorted.some((file) => file.path === "index.html")) {
    throw new Error("Offline build requires index.html");
  }
  const buildId = createHash("sha256")
    .update(template)
    .update(JSON.stringify(sorted.map(describe)))
    .update(JSON.stringify(source))
    .digest("hex");
  const embedded = sorted.map((file) =>
    file.path === "index.html"
      ? {
          ...file,
          bytes: Buffer.from(file.bytes).toString("utf8").replaceAll(BUILD_MARKER, buildId),
        }
      : file,
  );
  const assets = embedded.map(describe);
  const totalBytes = assets.reduce((sum, asset) => sum + asset.bytes, 0);
  const worker = template.replace(
    "__OFFLINE_RELEASE__",
    JSON.stringify({ version: buildId, files: assets, totalBytes }),
  );
  return {
    files: embedded,
    worker,
    metadata: {
      schemaVersion: 1,
      buildId,
      commit: source?.sha ?? null,
      committedAt: source?.committedAt ?? null,
      assets,
      totalBytes,
      worker: describe({ path: WORKER_FILE, bytes: worker }),
    },
  };
}

/** Compatibility helper used by the worker's model tests. */
export function renderWorker(template: string, files: readonly OfflineFile[]): string {
  return renderRelease(template, files).worker;
}

async function publicFiles(directory: string, prefix = ""): Promise<OfflineFile[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(
    entries.map(async (entry): Promise<OfflineFile[]> => {
      const path = `${prefix}${entry.name}`;
      const absolute = join(directory, entry.name);
      if (entry.isDirectory()) return publicFiles(absolute, `${path}/`);
      if (excluded(path)) return [];
      return [{ path, bytes: await readFile(absolute) }];
    }),
  );
  return groups.flat();
}

/** Publish an integrity manifest; installing the worker does not download the course. */
export function offlineApp(source: SourceVersion | null = null): Plugin {
  let publicDir: string | false = false;
  return {
    name: "assembly-lab-offline",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      publicDir = config.publicDir;
      if (!config.base.startsWith("/") || !config.base.endsWith("/")) {
        throw new Error("Offline support requires an absolute path base ending with /");
      }
    },
    transformIndexHtml: {
      order: "post",
      handler: () => [{ tag: "meta", attrs: { name: "course-build-id", content: BUILD_MARKER } }],
    },
    generateBundle: {
      order: "post",
      async handler(_options, bundle) {
        const files = new Map<string, OfflineFile>();
        if (publicDir) {
          for (const file of await publicFiles(publicDir)) files.set(file.path, file);
        }
        for (const output of Object.values(bundle)) {
          files.set(output.fileName, {
            path: output.fileName,
            bytes: output.type === "chunk" ? output.code : output.source,
          });
        }
        const template = await readFile(workerPath, "utf8");
        const release = renderRelease(template, [...files.values()], source);
        const html = bundle["index.html"];
        const finalHtml = release.files.find((file) => file.path === "index.html");
        if (html?.type !== "asset" || !finalHtml) throw new Error("Missing generated app HTML");
        html.source = finalHtml.bytes;
        for (const file of release.files) {
          const output = bundle[file.path];
          if (output?.type === "asset") output.source = file.bytes;
        }
        this.emitFile({ type: "asset", fileName: WORKER_FILE, source: release.worker });
        this.emitFile({
          type: "asset",
          fileName: RELEASE_FILE,
          source: `${JSON.stringify(release.metadata)}\n`,
        });
        this.emitFile({
          type: "asset",
          fileName: `releases/${release.metadata.buildId}/${RELEASE_FILE}`,
          source: `${JSON.stringify(release.metadata)}\n`,
        });
        // Immutable copies let a document finish loading its own runtime while
        // the canonical URLs move to another deployment. Cache keys stay canonical.
        for (const file of release.files)
          this.emitFile({
            type: "asset",
            fileName: `releases/${release.metadata.buildId}/${file.path}`,
            source: file.bytes,
          });
      },
    },
  };
}
