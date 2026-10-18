// Copyright © 2026 Christopher Snow

import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import type { Plugin } from "vite";

export const WORKER_FILE = "sw.js";
const workerPath = fileURLToPath(new URL("./worker.js", import.meta.url));
const excluded = (path: string) => path === WORKER_FILE || path.endsWith(".map");

export interface OfflineFile {
  path: string;
  bytes: string | Uint8Array;
}

/** Stable release identity includes worker behaviour as well as every cached byte. */
export function renderWorker(template: string, files: readonly OfflineFile[]): string {
  const sorted = [...files]
    .filter((file) => !excluded(file.path))
    .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
  if (!sorted.some((file) => file.path === "index.html")) {
    throw new Error("Offline build requires index.html");
  }
  const manifest = sorted.map((file) => ({
    path: file.path,
    integrity: `sha256-${createHash("sha256").update(file.bytes).digest("base64")}`,
  }));
  const version = createHash("sha256")
    .update(template)
    .update(JSON.stringify(manifest))
    .digest("hex");
  return template.replace("__OFFLINE_RELEASE__", JSON.stringify({ version, files: manifest }));
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

/** Precache the completed Vite output, including public files Vite copies separately. */
export function offlineApp(): Plugin {
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
    generateBundle: {
      order: "post",
      async handler(_options, bundle) {
        const files = new Map<string, OfflineFile>();
        if (publicDir) {
          for (const file of await publicFiles(publicDir)) files.set(file.path, file);
        }
        // The emitted bundle wins if an output name also appears in public/.
        for (const output of Object.values(bundle)) {
          files.set(output.fileName, {
            path: output.fileName,
            bytes: output.type === "chunk" ? output.code : output.source,
          });
        }
        const template = await readFile(workerPath, "utf8");
        this.emitFile({
          type: "asset",
          fileName: WORKER_FILE,
          source: renderWorker(template, [...files.values()]),
        });
      },
    },
  };
}
