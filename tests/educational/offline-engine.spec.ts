// Copyright © 2026 Christopher Snow

import { setTheme } from "./theme-helper";

// Exercise the production worker contract without depending on status-panel copy.
import { expect, test, type Page } from "@playwright/test";
import { deployment } from "./offline-site";

type Snapshot = {
  ok?: boolean;
  ready?: boolean;
  version?: string;
  runtimeVersion?: string;
  pendingVersion?: string;
  pendingPrepared?: boolean;
  consent?: boolean;
};
async function request(
  page: Page,
  type: string,
  payload: Record<string, unknown> = {},
  waiting = false,
): Promise<Snapshot> {
  return page.evaluate(
    async ({ type, payload, waiting }) => {
      const registration = await navigator.serviceWorker.getRegistration();
      const worker = waiting ? registration?.waiting : registration?.active;
      if (!worker) throw new Error("Missing test worker");
      return new Promise<Snapshot>((resolve, reject) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => reject(new Error(`Timed out: ${type}`)), 25000);
        channel.port1.onmessage = ({ data }) => {
          if (data.progress) return;
          clearTimeout(timer);
          channel.port1.close();
          resolve(data);
        };
        worker.postMessage({ type, ...payload }, [channel.port2]);
      });
    },
    { type, payload, waiting },
  );
}
async function open(page: Page, url: string) {
  await page.goto(url);
  await expect.poll(() => page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(true);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}
async function build(page: Page, version: string) {
  await expect(page.locator('meta[name="course-build-id"]')).toHaveAttribute("content", version);
}

test("online B uses current runtime and public assets while complete saved A remains the offline fallback", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const saved = await context.newPage();
    await open(saved, site.url);
    expect(
      await request(saved, "DOWNLOAD_OFFLINE", {
        release: JSON.parse(site.original.get("release.json")!.toString()),
      }),
    ).toMatchObject({ ok: true, ready: true });
    const next = site.publish("fresh-network-B");
    const current = await context.newPage();
    await open(current, site.url);
    await build(current, next.buildId);
    expect(await request(current, "OFFLINE_STATUS")).toMatchObject({
      ready: true,
      version: site.initial.buildId,
    });
    // This unversioned public file changed in B; it must never come from A's cache.
    expect(await current.evaluate(async () => (await fetch("native/Makefile")).text())).toContain(
      "fresh-network-B",
    );
    expect(await current.locator('script[type="module"][src]').getAttribute("src")).toContain(
      `/releases/${next.buildId}/assets/`,
    );
    site.connected(false);
    await context.setOffline(true);
    const offline = await context.newPage();
    await open(offline, `${site.url}#/lesson/one-addition`);
    await build(offline, site.initial.buildId);
    expect(await request(offline, "OFFLINE_STATUS")).toMatchObject({
      ready: true,
      version: site.initial.buildId,
    });
    await expect(
      offline.locator("#ix-worked-addition [data-figure='primitive-operation']"),
    ).toBeVisible();
    await offline.getByRole("button", { name: "Run the instruction", exact: true }).click();
    await expect(
      offline.locator("#ix-worked-addition [data-figure='primitive-operation']"),
    ).toHaveAttribute("data-k", "1");
    // The newer tab keeps its loaded B identity throughout the network change.
    await build(current, next.buildId);
  } finally {
    await context.close();
    await site.close();
  }
});

test("preparing B keeps both tabs open, then coordinated restart opens exact B even after C is published", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const first = await context.newPage();
    await open(first, `${site.url}#/lesson/one-addition`);
    const second = await context.newPage();
    await open(second, `${site.url}#/lesson/meet-the-machine`);
    await setTheme(first, "dark");
    await setTheme(second, "light");
    const next = site.publish("exact-prepared-B");
    await first.evaluate(async () => (await navigator.serviceWorker.getRegistration())!.update());
    await expect
      .poll(async () =>
        first.evaluate(async () => !!(await navigator.serviceWorker.getRegistration())?.waiting),
      )
      .toBe(true);
    expect(
      await request(
        first,
        "PREPARE_RELEASE",
        { release: next, id: "prepare-B", persistent: false },
        true,
      ),
    ).toMatchObject({ ok: true, prepared: true });
    await build(first, site.initial.buildId);
    await build(second, site.initial.buildId);
    expect(await request(first, "OFFLINE_STATUS")).toMatchObject({
      consent: false,
      ready: false,
      pendingVersion: next.buildId,
      pendingPrepared: true,
    });
    const newest = site.publish("ordinary-visit-C");
    let reloads = 0;
    first.on("framenavigated", (frame) => {
      if (frame === first.mainFrame()) reloads++;
    });
    expect(
      await request(first, "ACTIVATE_UPDATE", { id: "restart-B", replaceRuntime: true }, true),
    ).toEqual({ ok: true });
    await build(first, next.buildId);
    await build(second, next.buildId);
    expect(reloads).toBe(1);
    await expect(first.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(second.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(first).toHaveURL(`${site.url}#/lesson/one-addition`);
    await expect(second).toHaveURL(`${site.url}#/lesson/meet-the-machine`);
    expect(await request(first, "OFFLINE_STATUS")).toMatchObject({
      version: next.buildId,
      consent: false,
      ready: false,
    });
    const fresh = await context.newPage();
    await open(fresh, site.url);
    await build(fresh, newest.buildId);
    await build(first, next.buildId);
    site.connected(false);
    await context.setOffline(true);
    const offline = await context.newPage();
    await open(offline, site.url);
    await build(offline, next.buildId);
  } finally {
    await context.close();
    await site.close();
  }
});

test("Reload latest course updates only this online tab without saving the course", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const first = await context.newPage();
    await open(first, `${site.url}#/lesson/one-addition`);
    await setTheme(first, "dark");
    const operation = first.locator("#ix-worked-addition [data-figure='primitive-operation']");
    await operation.getByRole("button", { name: "Run the instruction", exact: true }).click();
    const answer = first.locator("#challenge-trace-addition").getByRole("textbox").first();
    await answer.fill("123");
    const second = await context.newPage();
    await open(second, `${site.url}#/lesson/meet-the-machine`);
    const next = site.publish("current-tab-online-reload");
    site.requests.length = 0;
    await first.locator("#app-status-open").click();
    const panel = first.locator("#app-status-dialog");
    await expect(panel.locator('[data-version="available"]')).toBeVisible();
    await panel.getByRole("button", { name: "Reload latest course", exact: true }).click();
    await build(first, next.buildId);
    await expect(first).toHaveURL(`${site.url}#/lesson/one-addition`);
    await expect(first.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(operation).toHaveAttribute("data-k", "1");
    await expect(answer).toHaveValue("123");
    await build(second, site.initial.buildId);
    expect(await request(first, "OFFLINE_STATUS")).toMatchObject({
      ready: false,
      consent: false,
      pendingVersion: null,
    });
    expect(site.requests.some((path) => /\/native\/Makefile$/.test(path))).toBe(false);
  } finally {
    await context.close();
    await site.close();
  }
});

test("online reload refuses memory-only work, composition and an active lesson operation", async ({
  context,
}) => {
  const site = await deployment();
  try {
    const page = await context.newPage();
    await open(page, `${site.url}#/lesson/cap-charge-in-c`);
    await page.evaluate(() => {
      const setItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new Error("Storage full");
      };
      window.addEventListener(
        "restore-reload-storage",
        () => {
          Storage.prototype.setItem = setItem;
        },
        { once: true },
      );
    });
    const editor = page.locator("#challenge-write-cap-charge").getByRole("textbox");
    const unsaved = "unsigned reload_unsaved(unsigned value) { return value; }";
    await editor.fill(unsaved);
    const next = site.publish("safe-current-tab-reload");
    await page.locator("#app-status-open").click();
    const panel = page.locator("#app-status-dialog");
    const reload = panel.getByRole("button", { name: "Reload latest course", exact: true });
    await expect(reload).toBeVisible();
    await reload.click();
    await expect(panel.getByRole("alert")).toBeVisible();
    await build(page, site.initial.buildId);
    await expect(editor).toHaveValue(unsaved);
    await expect(page.locator("main")).not.toHaveAttribute("inert");
    await page.evaluate(() => window.dispatchEvent(new Event("restore-reload-storage")));
    await panel.getByRole("button", { name: "Close", exact: true }).click();
    const saved = "unsigned reload_saved(unsigned value) { return value + 3; }";
    await editor.fill(saved);
    await page.evaluate(() => document.dispatchEvent(new CompositionEvent("compositionstart")));
    await page.locator("#app-status-open").click();
    await reload.click();
    await expect(panel.getByRole("alert")).toBeVisible();
    await build(page, site.initial.buildId);
    await page.evaluate(() => {
      document.dispatchEvent(new CompositionEvent("compositionend"));
      const busy = document.createElement("div");
      busy.id = "reload-test-busy";
      busy.setAttribute("data-app-busy", "true");
      document.body.append(busy);
    });
    await reload.click();
    await expect(panel.getByRole("alert")).toBeVisible();
    await build(page, site.initial.buildId);
    await page.evaluate(() => document.getElementById("reload-test-busy")!.remove());
    await reload.click();
    await build(page, next.buildId);
    await expect(editor).toHaveValue(saved);
    expect(await request(page, "OFFLINE_STATUS")).toMatchObject({ ready: false, consent: false });
  } finally {
    await context.close();
    await site.close();
  }
});
