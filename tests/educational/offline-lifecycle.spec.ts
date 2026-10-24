// Copyright © 2026 Christopher Snow

// Real production assets, release manifests and service workers run behind a private
// origin. Release variants are rebuilt through the production manifest generator;
// no fake worker, download progress or activation timer stands in for the browser.

import { expect, test, type Page } from "@playwright/test";

import { deployment } from "./offline-site";
import { STRINGS } from "../../apps/course/src/strings";
import { LESSONS } from "@al/content";
import { COMPILER_STRINGS as C } from "../../packages/views/src/strings.compiler";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import {
  checkForUpdates,
  downloadOffline,
  offlineReady,
  openStatus,
  prepareUpdate,
  restartUpdate,
  waitForRuntime,
} from "./app-status-helper";

const base = "/assembly-lab/";
const unrelatedCache = "other-course:release-1";

async function controlled(page: Page, url: string) {
  await page.goto(url);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

async function cacheNames(page: Page) {
  return (await page.evaluate(() => caches.keys())).sort();
}

async function currentBuild(page: Page) {
  return page.locator('meta[name="course-build-id"]').getAttribute("content");
}

async function expectRelease(page: Page, marker: string, buildId: string) {
  await expect(page.locator('meta[name="offline-test-release"]')).toHaveAttribute(
    "content",
    marker,
  );
  await expect(page.locator('meta[name="course-build-id"]')).toHaveAttribute("content", buildId);
}

test("checking the published release never downloads the course or reads GitHub main", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    const external: string[] = [];
    page.on("request", (request) => {
      if (request.url().includes("api.github.com")) external.push(request.url());
    });
    await controlled(page, site.url);
    const panel = await checkForUpdates(page);
    await expect(panel.locator('[data-version="current"]')).toBeVisible();
    await expect(panel.locator('[data-offline="idle"]')).toBeVisible();
    expect(site.requests).not.toContain(`GET ${base}native/assembly-lab-native.zip`);
    expect(site.requests).not.toContain(`GET ${base}native/Makefile`);
    expect(external).toEqual([]);
    const published = site.publish("published");
    await checkForUpdates(page);
    await expect(panel.locator('[data-version="available"]')).toBeVisible();
    expect(await currentBuild(page)).toBe(site.initial.buildId);
    expect(published.buildId).not.toBe(site.initial.buildId);
    expect(site.requests).not.toContain(`GET ${base}native/Makefile`);
    await panel.locator("summary").first().click();
    await expect(panel.locator("summary").first()).toContainText("Update available");
  } finally {
    await context.close();
    await site.close();
  }
});

test("detect, download, defer and explicit restart reload every app tab while preserving work", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const first = await context.newPage();
    await controlled(first, `${site.url}#/lesson/from-c-to-instructions`);
    await downloadOffline(first);
    await first.getByLabel(STRINGS.theme).selectOption("dark");
    const code = "unsigned cap_charge(unsigned a, unsigned b) { return a + b; }";
    const editor = first.locator("#challenge-write-cap-charge").getByRole("textbox");
    await editor.fill(code);
    const second = await context.newPage();
    await controlled(second, `${site.url}#/lesson/meet-the-machine`);
    const answer = second.locator("#challenge-trace-the-call").getByRole("textbox").first();
    await answer.fill("123");
    await second.getByLabel(STRINGS.theme).selectOption("light");
    const observer = await context.newPage();
    await observer.goto(`${site.origin}/another-course/`);
    await observer.evaluate(async (name) => {
      const cache = await caches.open(name);
      await cache.put("/another-course/saved", new Response("Sibling work"));
    }, unrelatedCache);
    const oldCaches = await cacheNames(first);
    const next = site.publish("explicit-restart");
    const panel = await prepareUpdate(first);
    expect(site.requests).toContain(`GET ${base}native/Makefile`);
    await panel.getByRole("button", { name: "Later", exact: true }).click();
    expect(await currentBuild(first)).toBe(site.initial.buildId);
    expect(await currentBuild(second)).toBe(site.initial.buildId);
    await expect(panel.locator("summary").first()).toContainText("Update ready");
    let firstReloads = 0;
    let secondReloads = 0;
    first.on("framenavigated", (frame) => {
      if (frame === first.mainFrame()) firstReloads++;
    });
    second.on("framenavigated", (frame) => {
      if (frame === second.mainFrame()) secondReloads++;
    });
    site.connected(false);
    await context.setOffline(true);
    await restartUpdate(first);
    for (const page of [first, second]) {
      await expectRelease(page, "explicit-restart", next.buildId);
      await offlineReady(page);
    }
    await expect(first.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(second.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(editor).toHaveValue(code);
    await expect(answer).toHaveValue("123");
    await expect(first).toHaveURL(`${site.url}#/lesson/from-c-to-instructions`);
    await expect(second).toHaveURL(`${site.url}#/lesson/meet-the-machine`);
    expect([firstReloads, secondReloads]).toEqual([1, 1]);
    const current = await cacheNames(first);
    expect(current).toContain(unrelatedCache);
    const replacementCache = current.find(
      (name) => name.startsWith("assembly-lab-offline:") && name.endsWith(next.buildId),
    );
    expect(replacementCache).toBeTruthy();
    // The active-pointer protocol can retain a verified previous release for recovery.
    // Its cache is removed only by safe cleanup or explicit scoped removal.
    for (const name of oldCaches.filter((name) => name.startsWith("assembly-lab-offline:"))) {
      if (current.includes(name)) {
        expect(
          await first.evaluate(async (key) => (await (await caches.open(key)).keys()).length, name),
        ).toBeGreaterThan(0);
      }
    }
    expect(
      await observer.evaluate(
        async (name) => (await (await caches.open(name)).match("/another-course/saved"))?.text(),
        unrelatedCache,
      ),
    ).toBe("Sibling work");
  } finally {
    await context.close();
    await site.close();
  }
});

test("restart refuses memory-only edits, input composition and an unsaved theme, then can retry", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const first = await context.newPage();
    await controlled(first, site.url);
    const second = await context.newPage();
    await controlled(second, `${site.url}#/lesson/from-c-to-instructions`);
    await second.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new Error("Storage full");
      };
      window.addEventListener(
        "restore-test-storage",
        () => {
          Storage.prototype.setItem = original;
        },
        { once: true },
      );
    });
    const editor = second.locator("#challenge-write-cap-charge").getByRole("textbox");
    await editor.fill("unsigned unsaved(unsigned value) { return value; }");
    const next = site.publish("safe-retry");
    await prepareUpdate(first);
    await restartUpdate(first);
    await expect(first.getByRole("alert")).toContainText(/saved|unsaved/i);
    await openStatus(second);
    await expect(second.getByRole("alert")).toContainText(/saved|unsaved/i);
    for (const page of [first, second]) {
      await expect(page.locator("main")).not.toHaveAttribute("inert");
      expect(await currentBuild(page)).toBe(site.initial.buildId);
    }
    await expect(editor).toHaveValue("unsigned unsaved(unsigned value) { return value; }");
    await second.evaluate(() => window.dispatchEvent(new Event("restore-test-storage")));
    const savedCode = "unsigned saved(unsigned value) { return value; }";
    await editor.fill(savedCode);
    await second.evaluate(() => document.dispatchEvent(new CompositionEvent("compositionstart")));
    await restartUpdate(first);
    await expect(first.getByRole("alert")).toContainText(/saved|unsaved/i);
    await expect(editor).toHaveValue(savedCode);
    await second.evaluate(() => document.dispatchEvent(new CompositionEvent("compositionend")));
    await first.evaluate(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new Error("Storage full");
      };
      window.addEventListener(
        "restore-test-storage",
        () => {
          Storage.prototype.setItem = original;
        },
        { once: true },
      );
    });
    await first.getByLabel(STRINGS.theme).selectOption("dark");
    await restartUpdate(first);
    await expect(first.getByRole("alert")).toContainText(/saved|unsaved/i);
    await expect(first.locator("html")).toHaveAttribute("data-theme", "dark");
    await first.evaluate(() => window.dispatchEvent(new Event("restore-test-storage")));
    await first.getByLabel(STRINGS.theme).selectOption("auto");
    await restartUpdate(first);
    await expectRelease(second, "safe-retry", next.buildId);
    await expect(editor).toHaveValue(savedCode);
  } finally {
    await context.close();
    await site.close();
  }
});

test("an unresponsive in-scope window blocks restart until it is closed", async ({ context }) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, site.url);
    const legacy = await context.newPage();
    await legacy.goto(`${site.url}legacy.html`);
    const next = site.publish("after-legacy");
    await prepareUpdate(page);
    await restartUpdate(page);
    await expect(page.getByRole("alert")).toContainText(/respond|tabs|tab/i, { timeout: 10000 });
    await expect(page.locator("main")).not.toHaveAttribute("inert");
    expect(await currentBuild(page)).toBe(site.initial.buildId);
    await legacy.close();
    await restartUpdate(page);
    await expectRelease(page, "after-legacy", next.buildId);
  } finally {
    await context.close();
    await site.close();
  }
});

for (const corrupt of [false, true]) {
  test(`${corrupt ? "wrong bytes" : "a failed download"} preserves the complete older release and resumes`, async ({
    context,
  }) => {
    const site = await deployment();
    try {
      const page = await context.newPage();
      await controlled(page, site.url);
      await downloadOffline(page);
      const next = site.publish("repair");
      site.failure(`${base}native/Makefile`, corrupt);
      const panel = await checkForUpdates(page);
      await expect(panel.locator('[data-version="available"]')).toBeVisible();
      await panel.getByRole("button", { name: "Update", exact: true }).click();
      await expect(panel.getByRole("alert")).toBeVisible({ timeout: 30000 });
      expect(await currentBuild(page)).toBe(site.initial.buildId);
      site.connected(false);
      await context.setOffline(true);
      expect((await page.reload())?.fromServiceWorker()).toBe(true);
      await offlineReady(page);
      expect(await currentBuild(page)).toBe(site.initial.buildId);
      site.connected(true);
      await context.setOffline(false);
      site.failure();
      await prepareUpdate(page);
      await restartUpdate(page);
      await expectRelease(page, "repair", next.buildId);
    } finally {
      await context.close();
      await site.close();
    }
  });
}

test("an interrupted first download resumes verified assets and removal preserves user and sibling data", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, `${site.url}#/lesson/from-c-to-instructions`);
    const code = "unsigned kept(unsigned value) { return value; }";
    const editor = page.locator("#challenge-write-cap-charge").getByRole("textbox");
    await editor.fill(code);
    const before = await page.evaluate(() => ({ ...localStorage }));
    await page.evaluate(async (name) => {
      const cache = await caches.open(name);
      await cache.put("/another-course/asset", new Response("Keep me"));
      localStorage.setItem("sibling-answer", "keep");
    }, unrelatedCache);
    site.delay(`${base}native/Makefile`, 10000);
    const panel = await openStatus(page);
    await panel.getByRole("button", { name: "Download for offline use", exact: true }).click();
    await expect(panel.locator('[data-offline="saving"]')).toBeVisible();
    await expect.poll(() => site.requests.includes(`GET ${base}native/Makefile`)).toBe(true);
    const progress = panel.getByRole("progressbar");
    await expect(progress).toHaveAttribute("max", String(site.initial.totalBytes));
    const savedBytes = Number(await progress.getAttribute("value"));
    expect(savedBytes).toBeGreaterThan(0);
    expect(savedBytes).toBeLessThan(site.initial.totalBytes);
    await panel.getByRole("button", { name: /Cancel download/ }).click();
    await expect(panel.locator('[data-offline="incomplete"]')).toBeVisible();
    site.delay();
    await panel.getByRole("button", { name: "Resume download", exact: true }).click();
    await offlineReady(page);
    await panel.getByRole("button", { name: "Remove offline copy", exact: true }).click();
    // Removal requires a second explicit confirmation rather than deleting on opening.
    const confirm = panel
      .getByRole("button", {
        name: /Remove offline copy|Remove saved copy|Remove now|Confirm removal/,
        exact: true,
      })
      .last();
    await expect(confirm).toBeVisible();
    await confirm.click();
    await expect(panel.locator('[data-offline="idle"]')).toBeVisible();
    expect(
      await page.evaluate(async () => {
        let entries = 0;
        for (const name of await caches.keys()) {
          if (name.startsWith("assembly-lab-offline:"))
            entries += (await (await caches.open(name)).keys()).length;
        }
        return entries;
      }),
    ).toBe(0);
    await expect(editor).toHaveValue(code);
    expect(await page.evaluate(() => localStorage.getItem("sibling-answer"))).toBe("keep");
    for (const [key, value] of Object.entries(before))
      expect(await page.evaluate((k) => localStorage.getItem(k), key)).toBe(value);
    expect(
      await page.evaluate(
        async (name) => (await (await caches.open(name)).match("/another-course/asset"))?.text(),
        unrelatedCache,
      ),
    ).toBe("Keep me");
    await downloadOffline(page);
    site.connected(false);
    await context.setOffline(true);
    expect((await page.reload())?.fromServiceWorker()).toBe(true);
    await expect(editor).toHaveValue(code);
  } finally {
    await context.close();
    await site.close();
  }
});

for (const mode of ["malformed", "failure", "timeout"] as const) {
  test(`${mode} release checks never claim freshness and can retry`, async ({ context }) => {
    const site = await deployment();
    try {
      const page = await context.newPage();
      await controlled(page, site.url);
      const panel = await checkForUpdates(page);
      await expect(panel.locator('[data-version="current"]')).toBeVisible();
      site.metadata(mode);
      await checkForUpdates(page);
      await expect(panel.locator('[data-version="error"]')).toBeVisible({ timeout: 10000 });
      await expect(panel.locator('[data-version="current"]')).toHaveCount(0);
      site.metadata("valid");
      await panel.getByRole("button", { name: "Retry", exact: true }).click();
      await expect(panel.locator('[data-version="current"]')).toBeVisible();
      site.connected(false);
      await context.setOffline(true);
      await expect(panel.locator('[data-version="offline"]')).toBeVisible();
      await expect(panel.locator('[data-version="current"]')).toHaveCount(0);
    } finally {
      await context.close();
      await site.close();
    }
  });
}

test("release checks bypass cached metadata and unrelated resources still reach the network", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, site.url);
    await downloadOffline(page);
    await page.evaluate(
      async ({ name, url, body }) => {
        const cache = await caches.open(name);
        await cache.put(
          url,
          new Response(body, { headers: { "Content-Type": "application/json" } }),
        );
      },
      {
        name: "stale-metadata",
        url: `${site.url}release.json`,
        body: site.original.get("release.json")!.toString(),
      },
    );
    const next = site.publish("network-metadata");
    const panel = await checkForUpdates(page);
    await expect(panel.locator('[data-version="available"]')).toBeVisible();
    expect(next.buildId).not.toBe(await currentBuild(page));
    for (const item of [
      { path: `${base}release.json?check=direct`, method: "GET" },
      { path: "/another-course/index.html", method: "GET" },
      { path: "/assembly-lab-extra/index.html", method: "GET" },
      { path: `${base}unknown.txt`, method: "GET" },
      { path: `${base}sw.js`, method: "GET" },
      { path: `${base}index.html`, method: "POST" },
      { path: `${base}index.html?arbitrary-fetch`, method: "GET" },
    ]) {
      const url = `${site.origin}${item.path}`;
      const response = page.waitForResponse(
        (candidate) => candidate.url() === url && candidate.request().method() === item.method,
      );
      const payload = await page.evaluate(
        async ({ url, method }) => {
          const response = await fetch(url, { method });
          return url.includes("release.json")
            ? ((await response.json()) as { buildId: string })
            : null;
        },
        { url, method: item.method },
      );
      const received = await response;
      expect(site.requests).toContain(`${item.method} ${item.path.split("?")[0]}`);
      if (!item.path.startsWith(base) || item.method !== "GET") {
        expect(received.fromServiceWorker(), `${item.method} ${item.path}`).toBe(false);
      }
      if (item.path.startsWith(`${base}release.json`)) {
        expect(payload?.buildId).toBe(next.buildId);
      }
      // A forwarding service-worker fetch may be reported as fromServiceWorker;
      // reaching the server and receiving the newly published body proves bypass.
      if (item.method === "GET")
        expect(
          await page.evaluate(async (url) => {
            for (const name of await caches.keys()) {
              if (name === "stale-metadata") continue;
              if (await (await caches.open(name)).match(url)) return true;
            }
            return false;
          }, url),
        ).toBe(false);
    }
  } finally {
    await context.close();
    await site.close();
  }
});

test("Later keeps the running release after every app window is closed and reopened", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, `${site.url}#/lesson/one-addition`);
    await downloadOffline(page);
    const next = site.publish("after-later");
    const panel = await prepareUpdate(page);
    await panel.getByRole("button", { name: "Later", exact: true }).click();
    expect(await currentBuild(page)).toBe(site.initial.buildId);
    const observer = await context.newPage();
    await observer.goto(`${site.origin}/observer`);
    await page.close();
    await waitForRuntime(observer, site.url, next.buildId);
    // Fresh document, not an SPA navigation, with no surviving app window.
    const reopened = await context.newPage();
    await controlled(reopened, `${site.url}#/lesson/one-addition`);
    expect(await currentBuild(reopened)).toBe(site.initial.buildId);
    const status = await openStatus(reopened);
    await expect(status.locator('[data-version="ready"]')).toBeVisible();
    await restartUpdate(reopened);
    await expectRelease(reopened, "after-later", next.buildId);
  } finally {
    await context.close();
    await site.close();
  }
});

test("evicted prepared bytes block restart and repairing the update permits a safe retry", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, site.url);
    await downloadOffline(page);
    const next = site.publish("repaired-activation");
    await prepareUpdate(page);
    await page.evaluate(async (buildId) => {
      const name = (await caches.keys()).find(
        (key) => key.startsWith("assembly-lab-offline:") && key.endsWith(buildId),
      );
      if (!name) throw new Error("Missing prepared release cache");
      const cache = await caches.open(name);
      const entries = await cache.keys();
      const file = entries.find((request) => request.url.endsWith("/native/Makefile"));
      if (!file) throw new Error("Missing prepared downloadable asset");
      await cache.delete(file);
    }, next.buildId);
    await restartUpdate(page);
    await expect(page.getByRole("alert")).toContainText(/incomplete|prepare/i);
    await expect(page.locator("main")).not.toHaveAttribute("inert");
    expect(await currentBuild(page)).toBe(site.initial.buildId);
    await prepareUpdate(page);
    await restartUpdate(page);
    await expectRelease(page, "repaired-activation", next.buildId);
  } finally {
    await context.close();
    await site.close();
  }
});

test("storage exhaustion preserves the complete copy and the update can recover", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, site.url);
    await downloadOffline(page);
    const session = await context.newCDPSession(page);
    await session.send("Storage.overrideQuotaForOrigin", { origin: site.origin, quotaSize: 1 });
    const next = site.publish("after-quota");
    const panel = await checkForUpdates(page);
    await expect(panel.locator('[data-version="available"]')).toBeVisible();
    await panel.getByRole("button", { name: "Update", exact: true }).click();
    await expect(panel.getByRole("alert")).toBeVisible({ timeout: 30000 });
    expect(await currentBuild(page)).toBe(site.initial.buildId);
    await offlineReady(page);
    await session.send("Storage.overrideQuotaForOrigin", {
      origin: site.origin,
      quotaSize: 100_000_000,
    });
    await prepareUpdate(page);
    await restartUpdate(page);
    await expectRelease(page, "after-quota", next.buildId);
  } finally {
    await context.close();
    await site.close();
  }
});

test("an online-only refreshed app completes the published runtime update before saving offline", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, site.url);
    const next = site.publish("online-refresh");
    await page.reload();
    await expectRelease(page, "online-refresh", next.buildId);
    const mismatch = await openStatus(page);
    await expect(
      mismatch.getByRole("button", { name: "Download for offline use", exact: true }),
    ).toBeDisabled();
    await prepareUpdate(page);
    // The loaded HTML already names B: its identity cannot signal completion of
    // this runtime-only restart. Wait for the new document before opening its panel.
    const restarted = page.waitForEvent("domcontentloaded");
    await restartUpdate(page);
    await restarted;
    await expect(page.locator('.app-status [data-version="current"]')).toBeAttached();
    await expect(page.locator('.app-status [data-offline="idle"]')).toBeAttached();
    await downloadOffline(page);
    site.connected(false);
    await context.setOffline(true);
    expect((await page.reload())?.fromServiceWorker()).toBe(true);
    await expectRelease(page, "online-refresh", next.buildId);
    await offlineReady(page);
  } finally {
    await context.close();
    await site.close();
  }
});

test("a real in-flight compiler request blocks restart until processing finishes", async ({
  context,
}) => {
  const site = await deployment();
  let unblock = () => {};
  const held = new Promise<void>((resolve) => {
    unblock = resolve;
  });
  try {
    await context.route("https://godbolt.org/api/compiler/*/compile", async (route) => {
      await held;
      await route.abort("failed");
    });
    const first = await context.newPage();
    await controlled(first, site.url);
    const second = await context.newPage();
    await controlled(second, `${site.url}#/lesson/from-c-to-instructions`);
    const lesson = LESSONS.find((item) => item.id === "from-c-to-instructions")!;
    for (const figure of lesson.sections.flatMap((section) => section.interactives)) {
      if (figure.kind !== "trace-prediction") continue;
      const prediction = second.locator(`#ix-${figure.id}`);
      await prediction.getByRole("radio").first().check();
      await prediction.getByRole("button", { name: V.prediction.commit, exact: true }).click();
    }
    const compiler = second.locator("#ix-play-from-c-to-instructions");
    await compiler.locator("summary").filter({ hasText: C.playground.compare }).click();
    const next = site.publish("after-processing");
    await prepareUpdate(first);
    await compiler.getByRole("button", { name: C.playground.compare, exact: true }).click();
    await expect(compiler.locator('[aria-busy="true"]')).toBeVisible();
    await restartUpdate(first);
    await expect(first.getByRole("alert")).toContainText(/operation|running|unfinished/i);
    expect(await currentBuild(first)).toBe(site.initial.buildId);
    expect(await currentBuild(second)).toBe(site.initial.buildId);
    await expect(second.locator("main")).not.toHaveAttribute("inert");
    unblock();
    await expect(compiler.locator('[aria-busy="true"]')).toHaveCount(0);
    await restartUpdate(first);
    await expectRelease(second, "after-processing", next.buildId);
  } finally {
    unblock();
    await context.close();
    await site.close();
  }
});

test("cancelling an update retains the complete release and permits preparation later", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, site.url);
    await downloadOffline(page);
    const next = site.publish("after-cancel");
    site.requests.length = 0;
    site.delay(`${base}native/Makefile`, 10000);
    const panel = await checkForUpdates(page);
    await expect(panel.locator('[data-version="available"]')).toBeVisible();
    await panel.getByRole("button", { name: "Update", exact: true }).click();
    await expect(panel.locator('[data-version="downloading"]')).toBeVisible();
    await expect.poll(() => site.requests.includes(`GET ${base}native/Makefile`)).toBe(true);
    await panel.getByRole("button", { name: "Cancel download", exact: true }).click();
    await expect(panel.locator('[data-version="downloading"]')).toHaveCount(0);
    expect(await currentBuild(page)).toBe(site.initial.buildId);
    site.connected(false);
    await context.setOffline(true);
    expect((await page.reload())?.fromServiceWorker()).toBe(true);
    await offlineReady(page);
    expect(await currentBuild(page)).toBe(site.initial.buildId);
    site.delay();
    site.connected(true);
    await context.setOffline(false);
    await prepareUpdate(page);
    await restartUpdate(page);
    await expectRelease(page, "after-cancel", next.buildId);
  } finally {
    await context.close();
    await site.close();
  }
});

test("safe restart preserves each tab's current simulation view and unfinished answer", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const first = await context.newPage();
    await controlled(first, `${site.url}#/lesson/one-addition`);
    const operation = first.locator("#ix-worked-addition [data-figure='primitive-operation']");
    await operation.getByRole("button", { name: "Run the instruction", exact: true }).click();
    await expect(operation).toHaveAttribute("data-k", "1");
    const answer = first.locator("#challenge-trace-addition").getByRole("textbox").first();
    await answer.fill("123");
    const second = await context.newPage();
    await controlled(second, `${site.url}#/lesson/meet-the-machine`);
    const stepper = second.locator("#ix-step-trip [data-figure='stepper']");
    await stepper.getByRole("button", { name: V.stepper.next, exact: true }).click();
    await stepper.getByRole("button", { name: V.stepper.next, exact: true }).click();
    await stepper.getByRole("button", { name: "Show the bits", exact: true }).click();
    await expect(stepper).toHaveAttribute("data-k", "2");
    await expect(stepper.locator(".al-registers")).toHaveAttribute("data-view", "bits");
    const before = await stepper.locator(".al-status").innerText();
    const prediction = second.locator("#ix-predict-no-ret").getByRole("radio").first();
    await prediction.check();
    await expect(second.locator("#ix-step-no-ret .al-locked")).toHaveCount(1);
    const next = site.publish("view-handoff");
    await prepareUpdate(first);
    await restartUpdate(first);
    await expectRelease(first, "view-handoff", next.buildId);
    await expectRelease(second, "view-handoff", next.buildId);
    await expect(operation).toHaveAttribute("data-k", "1");
    await expect(answer).toHaveValue("123");
    await expect(stepper).toHaveAttribute("data-k", "2");
    await expect(stepper.locator(".al-registers")).toHaveAttribute("data-view", "bits");
    await expect(stepper.locator(".al-status")).toHaveText(before);
    await expect(prediction).toBeChecked();
    await expect(second.locator("#ix-step-no-ret .al-locked")).toHaveCount(1);
    // The snapshot belongs only to the coordinated restart, not ordinary refresh.
    await second.reload();
    await expect(stepper).toHaveAttribute("data-k", "0");
    await expect(stepper.locator(".al-registers")).toHaveAttribute("data-view", "decimal");
    await expect(prediction).not.toBeChecked();
  } finally {
    await context.close();
    await site.close();
  }
});

test("saving and removing the app leaves a broader sibling worker registration intact", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const observer = await context.newPage();
    await observer.goto(`${site.origin}/observer`);
    await observer.evaluate(async () => {
      await navigator.serviceWorker.register("/root-sw.js", { scope: "/" });
      await navigator.serviceWorker.ready;
    });
    const page = await context.newPage();
    await controlled(page, site.url);
    await expect
      .poll(() =>
        page.evaluate(
          async () => (await navigator.serviceWorker.getRegistration(location.href))?.scope,
        ),
      )
      .toBe(site.url);
    await downloadOffline(page);
    const panel = await openStatus(page);
    await panel.getByRole("button", { name: "Remove offline copy", exact: true }).click();
    await panel
      .locator(".remove-confirmation")
      .getByRole("button", { name: "Remove offline copy", exact: true })
      .click();
    await expect(panel.locator('[data-offline="idle"]')).toBeVisible();
    const scopes = await observer.evaluate(async () =>
      (await navigator.serviceWorker.getRegistrations()).map((registration) => ({
        scope: registration.scope,
        active: registration.active?.state,
      })),
    );
    expect(scopes).toContainEqual({ scope: `${site.origin}/`, active: "activated" });
  } finally {
    await context.close();
    await site.close();
  }
});

test("removing an offline copy after deferred runtime replacement still permits updating", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, `${site.url}#/lesson/from-c-to-instructions`);
    await downloadOffline(page);
    const code = "unsigned preserved(unsigned value) { return value + 23; }";
    await page.locator("#challenge-write-cap-charge").getByRole("textbox").fill(code);
    await page.getByLabel(STRINGS.theme).selectOption("dark");
    const next = site.publish("after-remove-pending");
    const firstPanel = await prepareUpdate(page);
    await firstPanel.getByRole("button", { name: "Later", exact: true }).click();
    const observer = await context.newPage();
    await observer.goto(`${site.origin}/observer`);
    await page.close();
    await waitForRuntime(observer, site.url, next.buildId);
    const reopened = await context.newPage();
    await controlled(reopened, `${site.url}#/lesson/from-c-to-instructions`);
    expect(await currentBuild(reopened)).toBe(site.initial.buildId);
    const panel = await openStatus(reopened);
    await panel.getByRole("button", { name: "Remove offline copy", exact: true }).click();
    await panel
      .locator(".remove-confirmation")
      .getByRole("button", { name: "Remove offline copy", exact: true })
      .click();
    await expect(panel.locator('[data-offline="idle"]')).toBeVisible();
    expect(
      await reopened.evaluate(async () => {
        let count = 0;
        for (const name of await caches.keys())
          if (name.startsWith("assembly-lab-offline:"))
            count += (await (await caches.open(name)).keys()).length;
        return count;
      }),
    ).toBe(0);
    const editor = reopened.locator("#challenge-write-cap-charge").getByRole("textbox");
    await expect(editor).toHaveValue(code);
    expect(await currentBuild(reopened)).toBe(site.initial.buildId);
    await prepareUpdate(reopened);
    await restartUpdate(reopened);
    await expectRelease(reopened, "after-remove-pending", next.buildId);
    await expect(editor).toHaveValue(code);
    await downloadOffline(reopened);
    site.connected(false);
    await context.setOffline(true);
    expect((await reopened.reload())?.fromServiceWorker()).toBe(true);
    await expectRelease(reopened, "after-remove-pending", next.buildId);
    await expect(editor).toHaveValue(code);
    await expect(reopened.locator("html")).toHaveAttribute("data-theme", "dark");
  } finally {
    await context.close();
    await site.close();
  }
});

test("cancel is offered only when preparation reaches cancellable asset downloads", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, site.url);
    await downloadOffline(page);
    const next = site.publish("cancel-supported-phase");
    site.requests.length = 0;
    site.delay(`${base}sw.js`, 3000);
    const panel = await checkForUpdates(page);
    await expect(panel.locator('[data-version="available"]')).toBeVisible();
    await panel.getByRole("button", { name: "Update", exact: true }).click();
    await expect(panel.locator('[data-version="downloading"]')).toBeVisible();
    await expect.poll(() => site.requests.includes(`GET ${base}sw.js`)).toBe(true);
    await expect(panel.getByRole("button", { name: "Cancel download", exact: true })).toHaveCount(
      0,
    );
    // The already pending script response retains its delay. Hold the next real
    // asset response so the cancellable phase is observable without a fake timer.
    site.delay(`${base}native/Makefile`, 10000);
    await expect
      .poll(() => site.requests.includes(`GET ${base}native/Makefile`), { timeout: 10000 })
      .toBe(true);
    await panel.getByRole("button", { name: "Cancel download", exact: true }).click();
    await expect(panel.locator('[data-version="downloading"]')).toHaveCount(0);
    expect(await currentBuild(page)).toBe(site.initial.buildId);
    await offlineReady(page);
    site.delay();
    await prepareUpdate(page);
    await restartUpdate(page);
    await expectRelease(page, "cancel-supported-phase", next.buildId);
  } finally {
    await context.close();
    await site.close();
  }
});

test("a newer waiting release remains actionable after a deferred restart is refused", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await controlled(page, site.url);
    await downloadOffline(page);
    const originalBuild = await currentBuild(page);
    site.publish("superseded-deferred");
    await prepareUpdate(page);
    const latest = site.publish("latest-after-deferred");
    await page.evaluate(async () => {
      await (await navigator.serviceWorker.getRegistration())?.update();
    });
    const inventory = () =>
      page.evaluate(async () => {
        const registration = await navigator.serviceWorker.getRegistration();
        const worker = registration?.waiting ?? registration?.active;
        if (!worker) return null;
        return new Promise<{
          runtimeVersion?: string;
          pendingVersion?: string;
          pendingPrepared?: boolean;
        } | null>((resolve) => {
          const channel = new MessageChannel();
          const timer = setTimeout(() => {
            channel.port1.close();
            resolve(null);
          }, 1000);
          channel.port1.onmessage = (event) => {
            clearTimeout(timer);
            channel.port1.close();
            resolve(event.data);
          };
          worker.postMessage({ type: "OFFLINE_STATUS" }, [channel.port2]);
        });
      });
    await expect.poll(async () => (await inventory())?.runtimeVersion).toBe(latest.buildId);
    await checkForUpdates(page);
    await restartUpdate(page);
    const panel = await openStatus(page);
    await expect(panel.getByRole("alert")).toContainText(/newer|latest/i);
    await expect(page.locator("main")).not.toHaveAttribute("inert");
    expect(await currentBuild(page)).toBe(originalBuild);
    // Refresh can rediscover the still-saved B preparation. It must not hide
    // the action that prepares the newer published C release.
    await checkForUpdates(page);
    await panel.getByRole("button", { name: "Update", exact: true }).click();
    await expect
      .poll(
        async () => {
          const snapshot = await inventory();
          return snapshot?.pendingVersion === latest.buildId && snapshot.pendingPrepared;
        },
        { timeout: 30000 },
      )
      .toBe(true);
    await expect(panel.locator('[data-version="ready"]')).toBeVisible();
    await restartUpdate(page);
    await expectRelease(page, "latest-after-deferred", latest.buildId);
    await offlineReady(page);
  } finally {
    await context.close();
    await site.close();
  }
});
