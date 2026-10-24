// Copyright © 2026 Christopher Snow

// The course app. One bundle, built under the base path GitHub Pages serves it from
// (/assembly-lab/ on snowch.github.io, an origin the author's other courses share). BASE_PATH
// lets the deploy workflow pass the path Pages reports, and lets a local build serve at the root.
//
// The page's description, what a shared link's preview shows, the icons, and the cover for a
// reader whose browser runs no scripts are written into index.html from the cover's own words
// (static-page.ts), and the manifest a browser installs the course from is written beside it
// (web-manifest.ts). The icons themselves are files in public/, drawn by scripts/icons.mjs.
//
// static-page.ts reads the lessons, to say which modules are published, and Node cannot load the
// lessons by itself: they import TypeScript sources by paths without an extension. So Vite loads
// static-page.ts, as it loads the app, when the page or the manifest is first wanted.
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import react from "@vitejs/plugin-react";
import { createServer, defineConfig, type Plugin } from "vite";

import { offlineApp } from "./offline/plugin";
import { MANIFEST_FILE, webManifest } from "./src/web-manifest";
import type { BuildVersion } from "./src/build-version";

let version: BuildVersion | null = null;
try {
  const [sha, committedAt] = execFileSync("git", ["log", "-1", "--format=%H%n%cI"], {
    cwd: fileURLToPath(new URL("../..", import.meta.url)),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  })
    .trim()
    .split("\n");
  if (sha && /^[a-f0-9]{40}$/.test(sha) && committedAt && Number.isFinite(Date.parse(committedAt)))
    version = { sha, committedAt: new Date(committedAt).toISOString() };
} catch {
  /* A source archive has no commit identity. */
}

type StaticPage = typeof import("./src/static-page");

async function loadStaticPage(root: string): Promise<StaticPage> {
  const server = await createServer({
    root,
    configFile: false,
    logLevel: "silent",
    appType: "custom",
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  try {
    return (await server.ssrLoadModule("/src/static-page.ts")) as StaticPage;
  } finally {
    await server.close();
  }
}

function coverWords(): Plugin {
  let base = "/";
  let root = process.cwd();
  let page: Promise<StaticPage> | undefined;
  const staticPage = () => (page ??= loadStaticPage(root));
  const manifest = async () => {
    const { courseTitle } = await staticPage();
    const title = courseTitle(readFileSync(resolve(root, "index.html"), "utf8"));
    return `${JSON.stringify(webManifest(title), null, 2)}\n`;
  };
  return {
    name: "cover-words",
    configResolved(config) {
      base = config.base;
      root = config.root;
    },
    transformIndexHtml: async (html) => (await staticPage()).staticPage(html, base, version),
    // The development server has no bundle to write the manifest into, so it answers for it.
    configureServer(server) {
      server.middlewares.use(`${base}${MANIFEST_FILE}`, (_request, response, next) => {
        manifest().then((body) => {
          response.setHeader("Content-Type", "application/manifest+json");
          response.end(body);
        }, next);
      });
    },
    async generateBundle() {
      this.emitFile({ type: "asset", fileName: MANIFEST_FILE, source: await manifest() });
    },
  };
}

export default defineConfig({
  define: { __COURSE_VERSION__: JSON.stringify(version) },
  base: process.env.BASE_PATH ?? "/assembly-lab/",
  plugins: [react(), coverWords(), offlineApp(version)],
  build: {
    outDir: "dist",
    sourcemap: true,
    target: "es2022",
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
});
