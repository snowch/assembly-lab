// Copyright © 2026 Christopher Snow

// Each deployment has its own HTTP origin. The files come from the production build;
// only a harmless HTML marker changes between releases. Real browser workers perform
// installation, integrity checks, cache cleanup and the handover between releases.
import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

import { expect, test, type Page } from "@playwright/test";

import { renderWorker } from "../../apps/course/offline/plugin";
import { STRINGS } from "../../apps/course/src/strings";

const base = "/assembly-lab/";
const dist = resolve("apps/course/dist");
const templatePath = resolve("apps/course/offline/worker.js");
const unrelatedCache = "other-course:release-1";

async function readFiles(directory: string, prefix = ""): Promise<Map<string, Buffer>> {
  const result = new Map<string, Buffer>();
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = `${prefix}${entry.name}`;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      for (const [key, bytes] of await readFiles(path, `${name}/`)) result.set(key, bytes);
    } else {
      result.set(name, await readFile(path));
    }
  }
  return result;
}

async function deployment() {
  const original = await readFiles(dist);
  const template = await readFile(templatePath, "utf8");
  expect(original.has("sw.js"), "Build the production app before running offline tests").toBe(true);
  let files = new Map(original);
  let failedPath: string | undefined;
  let corruptResponse = false;
  const requests: string[] = [];
  const server = createServer((request, response) => {
    const path = new URL(request.url ?? "/", "http://localhost").pathname;
    requests.push(`${request.method} ${path}`);
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("Access-Control-Allow-Origin", "*");
    if (path === failedPath) {
      response
        .writeHead(corruptResponse ? 200 : 503)
        .end(corruptResponse ? "Bytes from the wrong release" : "Temporarily unavailable");
      return;
    }
    if (!path.startsWith(base) || request.method !== "GET") {
      response.setHeader("Content-Type", "text/html");
      response.end("<!doctype html><title>Another app</title><p>Network response</p>");
      return;
    }
    const name = path.slice(base.length) || "index.html";
    const bytes = files.get(name);
    if (!bytes) {
      response.writeHead(404).end("Unknown resource");
      return;
    }
    const type = name.endsWith(".html")
      ? "text/html"
      : name.endsWith(".js")
        ? "text/javascript"
        : name.endsWith(".css")
          ? "text/css"
          : name.endsWith(".woff2")
            ? "font/woff2"
            : name.endsWith(".json") || name.endsWith(".webmanifest")
              ? "application/json"
              : "application/octet-stream";
    response.setHeader("Content-Type", type);
    response.end(bytes);
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("Missing test server port");
  const origin = `http://127.0.0.1:${address.port}`;
  return {
    origin,
    url: `${origin}${base}`,
    requests,
    original,
    publish(marker: string, failure?: string, corrupt = false) {
      files = new Map(original);
      const html = original.get("index.html")!.toString();
      files.set(
        "index.html",
        Buffer.from(
          html.replace("</head>", `<meta name="offline-test-release" content="${marker}"></head>`),
        ),
      );
      files.set(
        "sw.js",
        Buffer.from(
          renderWorker(
            template,
            [...files].map(([path, bytes]) => ({ path, bytes })),
          ),
        ),
      );
      failedPath = failure;
      corruptResponse = corrupt;
    },
    async close() {
      server.closeAllConnections();
      await new Promise<void>((done, reject) =>
        server.close((error) => (error ? reject(error) : done())),
      );
    },
  };
}

async function controlled(page: Page, url: string) {
  await page.goto(url);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

async function cacheNames(page: Page) {
  return (await page.evaluate(() => caches.keys())).sort();
}

async function update(page: Page): Promise<string> {
  return page.evaluate(async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) throw new Error("Missing worker registration");
    const settled = new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Worker update did not settle")), 20_000);
      registration.addEventListener(
        "updatefound",
        () => {
          const worker = registration.installing;
          if (!worker) return;
          worker.addEventListener("statechange", () => {
            if (worker.state === "installed" || worker.state === "redundant") {
              clearTimeout(timeout);
              resolve(worker.state);
            }
          });
        },
        { once: true },
      );
    });
    await registration.update();
    return settled;
  });
}

test("an update waits for every old tab and removes only this app's old cache", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const first = await context.newPage();
    await controlled(first, site.url);
    const second = await context.newPage();
    await controlled(second, site.url);
    const originalCaches = await cacheNames(first);
    expect(originalCaches).toHaveLength(1);
    // Keep an out-of-scope client open so we can observe activation after both app tabs close.
    const observer = await context.newPage();
    await observer.goto(`${site.origin}/another-course/`);
    await observer.evaluate(async (name) => {
      const cache = await caches.open(name);
      await cache.put("/another-course/saved", new Response("Another course's work"));
    }, unrelatedCache);
    site.publish("next");
    expect(await update(first)).toBe("installed");
    await expect
      .poll(() =>
        first.evaluate(async () => !!(await navigator.serviceWorker.getRegistration())?.waiting),
      )
      .toBe(true);
    await first.reload();
    await expect(first.locator('meta[name="offline-test-release"]')).toHaveCount(0);
    await first.close();
    expect(
      await second.evaluate(
        async () => !!(await navigator.serviceWorker.getRegistration())?.waiting,
      ),
    ).toBe(true);
    await second.reload();
    await expect(second.locator('meta[name="offline-test-release"]')).toHaveCount(0);
    await second.close();
    await expect
      .poll(() =>
        observer.evaluate(async (scope) => {
          const registration = await navigator.serviceWorker.getRegistration(scope);
          return registration?.active?.state === "activated" && !registration.waiting;
        }, site.url),
      )
      .toBe(true);
    await context.setOffline(true);
    await observer.goto(`${site.url}#/lesson/array-addresses`);
    await expect(observer.locator('meta[name="offline-test-release"]')).toHaveAttribute(
      "content",
      "next",
    );
    await expect(observer.getByRole("heading", { level: 1 })).toBeVisible();
    const currentCaches = await cacheNames(observer);
    expect(currentCaches).toContain(unrelatedCache);
    expect(currentCaches).not.toContain(originalCaches[0]);
    expect(currentCaches).toHaveLength(2);
    expect(
      await observer.evaluate(
        async (name) => (await (await caches.open(name)).match("/another-course/saved"))?.text(),
        unrelatedCache,
      ),
    ).toBe("Another course's work");
  } finally {
    await context.close();
    await site.close();
  }
});

for (const corrupt of [false, true]) {
  test(`${corrupt ? "HTTP 200 with incorrect bytes" : "A failed download"} rejects the new release and preserves the working offline app`, async ({
    context,
  }) => {
    const site = await deployment();
    try {
      const page = await context.newPage();
      await controlled(page, site.url);
      const originalCaches = await cacheNames(page);
      const font = [...site.original.keys()].find((path) => path.endsWith(".woff2"));
      expect(font).toBeTruthy();
      site.requests.length = 0;
      site.publish("incomplete", `${base}${font}`, corrupt);
      expect(await update(page)).toBe("redundant");
      expect(site.requests).toContain(`GET ${base}${font}`);
      expect(
        await page.evaluate(
          async () => !!(await navigator.serviceWorker.getRegistration())?.waiting,
        ),
      ).toBe(false);
      expect(await cacheNames(page)).toEqual(originalCaches);
      await context.setOffline(true);
      await page.reload();
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(page.locator('meta[name="offline-test-release"]')).toHaveCount(0);
    } finally {
      await context.close();
      await site.close();
    }
  });
}

test("unrelated paths, API posts and unlisted resources bypass the worker", async ({ context }) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, site.url);
    const cases = [
      { path: "/another-course/index.html", method: "GET" },
      { path: "/assembly-lab-extra/index.html", method: "GET" },
      { path: `${base}unknown.txt`, method: "GET" },
      { path: `${base}sw.js`, method: "GET" },
      { path: `${base}index.html`, method: "POST" },
      { path: `${base}index.html?arbitrary-fetch`, method: "GET" },
    ];
    const map = [...site.original.keys()].find((path) => path.endsWith(".map"));
    if (map) cases.push({ path: `${base}${map}`, method: "GET" });
    for (const request of cases) {
      const url = `${site.origin}${request.path}`;
      const response = page.waitForResponse(
        (candidate) => candidate.url() === url && candidate.request().method() === request.method,
      );
      await page.evaluate(
        async ({ url, method }) => {
          await fetch(url, { method });
        },
        { url, method: request.method },
      );
      expect((await response).fromServiceWorker(), `${request.method} ${request.path}`).toBe(false);
    }
    const cached = await page.evaluate(async () =>
      (
        await Promise.all(
          (await caches.keys()).map(async (name) =>
            (await (await caches.open(name)).keys()).map((request) => request.url),
          ),
        )
      ).flat(),
    );
    for (const request of cases.filter((request) => request.method === "GET")) {
      expect(cached).not.toContain(`${site.origin}${request.path}`);
    }
    await context.setOffline(true);
    expect(
      await page.evaluate(async () => {
        try {
          await fetch("/another-course/index.html");
          return "unexpected response";
        } catch {
          return "offline";
        }
      }),
    ).toBe("offline");
  } finally {
    await context.close();
    await site.close();
  }
});

test("a failed first download reports failure and can recover on a later online visit", async ({
  context,
}) => {
  const site = await deployment();
  try {
    site.publish("first", `${base}icon-maskable-512.png`);
    const page = await context.newPage();
    await page.goto(site.url);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(STRINGS.offline.unavailable, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => navigator.serviceWorker.controller)).toBeNull();
    expect(await cacheNames(page)).toEqual([]);
    site.publish("first");
    await controlled(page, site.url);
    await expect(page.getByText(STRINGS.offline.ready, { exact: true })).toBeVisible();
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  } finally {
    await context.close();
    await site.close();
  }
});

test("a waiting update remains available when the active release's cache is lost", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, site.url);
    const originalCaches = await cacheNames(page);
    expect(originalCaches).toHaveLength(1);
    const observer = await context.newPage();
    await observer.goto(`${site.origin}/another-course/`);
    site.publish("saved-update");
    expect(await update(page)).toBe("installed");
    await expect(page.getByText(STRINGS.offline.updateWaiting, { exact: true })).toBeVisible();
    await context.setOffline(true);
    await page.evaluate(async (names) => {
      for (const name of names) await caches.delete(name);
      window.dispatchEvent(new Event("offline"));
    }, originalCaches);
    await expect(page.getByText(STRINGS.offline.unavailable, { exact: true })).toBeVisible();
    await expect(page.getByText(STRINGS.offline.ready, { exact: true })).toHaveCount(0);
    await expect(page.getByText(STRINGS.offline.updateWaiting, { exact: true })).toBeVisible();
    await page.close();
    await expect
      .poll(() =>
        observer.evaluate(async (scope) => {
          const registration = await navigator.serviceWorker.getRegistration(scope);
          return registration?.active?.state === "activated" && !registration.waiting;
        }, site.url),
      )
      .toBe(true);
    await observer.goto(site.url);
    await expect(observer.locator('meta[name="offline-test-release"]')).toHaveAttribute(
      "content",
      "saved-update",
    );
    await expect(observer.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(observer.getByText(STRINGS.offline.ready, { exact: true })).toBeVisible();
  } finally {
    await context.close();
    await site.close();
  }
});
