// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { LESSONS, WHERE_NEXT, PLAYGROUND_STARTER } from "@al/content";
import { STRINGS } from "../../apps/course/src/strings";
import { COMPILER_STRINGS as C } from "../../packages/views/src/strings.compiler";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { challenge, passing, press, run, status, watchErrors } from "./module1";
import { downloadOffline, offlineReady, openStatus } from "./app-status-helper";
import { designProblems } from "./design";
import { deployment } from "./offline-site";

test("the whole course reopens offline, including lessons never visited online", async ({
  page,
  context,
}) => {
  const site = await deployment();
  try {
    test.setTimeout(120_000);
    const errors = watchErrors(page);
    const session = await context.newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });
    await page.goto(site.url);
    await downloadOffline(page);
    const downloadFiles = await page.evaluate(async () => {
      const release = (await (
        await fetch(new URL("release.json", location.href), { cache: "no-store" })
      ).json()) as {
        assets: { path: string; bytes: number; integrity: string }[];
      };
      return release.assets.filter(
        (file) => file.path.startsWith("native/") || file.path === "examples/trip-playground.s",
      );
    });
    expect(downloadFiles.length).toBeGreaterThan(0);
    expect(downloadFiles.some((file) => file.path === "examples/trip-playground.s")).toBe(true);
    site.connected(false);
    await context.setOffline(true);
    for (const lesson of LESSONS) {
      const response = await page.goto(
        new URL(`./?offline-check=${lesson.id}#/lesson/${lesson.id}`, site.url).href,
      );
      expect(response?.fromServiceWorker()).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
      await expect(page.locator("section.lesson-section")).toHaveCount(lesson.sections.length);
      await offlineReady(page);
      await expect(page.locator(".app-status > summary")).toBeVisible();
    }
    const nextResponse = await page.goto(
      new URL("./?offline-check=where-next#/where-next", site.url).href,
    );
    expect(nextResponse?.fromServiceWorker()).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(WHERE_NEXT.title);
    await expect(page.locator(".where-next-starter code")).toHaveText(PLAYGROUND_STARTER);
    const downloadResults = await page.evaluate(async (files) => {
      const results = [];
      for (const file of files) {
        const response = await fetch(new URL(file.path, location.href));
        const body = await response.arrayBuffer();
        const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", body));
        results.push({
          path: file.path,
          ok: response.ok,
          bytes: body.byteLength,
          integrity: `sha256-${btoa(String.fromCharCode(...hash))}`,
        });
      }
      await document.fonts.ready;
      return results;
    }, downloadFiles);
    expect(downloadResults).toEqual(downloadFiles.map((file) => ({ ...file, ok: true })));
    expect(errors).toEqual([]);
  } finally {
    await context.close();
    await site.close();
  }
});

test("offline compilation, exercise grading and saved work survive closing and reopening a tab", async ({
  page,
  context,
}) => {
  const site = await deployment();
  try {
    await page.goto(site.url);
    await downloadOffline(page);
    await page.getByLabel(STRINGS.theme).selectOption("dark");
    site.connected(false);
    await context.setOffline(true);
    const url = new URL("./#/lesson/from-c-to-instructions", page.url()).href;
    await page.close();
    const reopened = await context.newPage();
    const errors = watchErrors(reopened);
    const session = await context.newCDPSession(reopened);
    await session.send("Network.enable");
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });
    expect((await reopened.goto(url))?.fromServiceWorker()).toBe(true);
    await expect(reopened.getByLabel(STRINGS.theme)).toHaveValue("dark");

    const lesson = LESSONS.find((l) => l.id === "from-c-to-instructions")!;
    const exercise = lesson.challenges.find((c) => c.id === "write-cap-charge")!;
    if (exercise.tests.kind !== "answers") throw new Error("Expected a C exercise");
    const c = challenge(reopened, exercise.id);
    await press(reopened, run(c));
    await expect(c.locator(".verdict-failure").first()).toBeVisible();
    await c.getByRole("textbox", { name: C.editor.source }).fill(exercise.reference.text!);
    await press(reopened, run(c));
    await expect(status(c)).toHaveText(passing(exercise.tests.cases.length));
    await reopened.reload();
    await expect(c.getByRole("textbox", { name: C.editor.source })).toHaveValue(
      exercise.reference.text!,
    );
    await expect(c.locator(".challenge-complete")).toBeVisible();

    // A committed prediction opens the compiler; compilation itself needs no server.
    for (const figure of lesson.sections.flatMap((s) => s.interactives)) {
      if (figure.kind !== "trace-prediction") continue;
      const prediction = reopened.locator(`#ix-${figure.id}`);
      await prediction.getByRole("radio").first().check();
      await press(reopened, prediction.getByRole("button", { name: V.prediction.commit }));
    }
    const compiler = reopened.locator("#ix-play-from-c-to-instructions");
    await compiler
      .getByRole("textbox", { name: C.editor.source })
      .fill("unsigned sum(unsigned a, unsigned b, unsigned c) { return a + b + c; }");
    await press(reopened, compiler.getByRole("button", { name: C.playground.run, exact: true }));
    await expect(compiler.locator("[data-compiler-step]")).toBeVisible();
    await press(reopened, compiler.getByRole("button", { name: V.stepper.next, exact: true }));
    await expect(compiler.locator("[data-compiler-step]")).toHaveAttribute(
      "data-compiler-step",
      "1",
    );
    const next = compiler.getByRole("button", { name: V.stepper.next, exact: true });
    while (await next.isEnabled()) await press(reopened, next);
    await expect(compiler.getByRole("status")).toContainText("both return");
    expect(errors).toEqual([]);
    await compiler.locator("summary").filter({ hasText: C.playground.compare }).click();
    await press(
      reopened,
      compiler.getByRole("button", { name: C.playground.compare, exact: true }),
    );
    await expect(compiler.getByText(C.playground.failed, { exact: true })).toBeVisible();
  } finally {
    await context.close();
    await site.close();
  }
});

test("losing cached files removes readiness and an explicit repair restores the copy", async ({
  page,
  context,
}) => {
  await page.goto("#/");
  await downloadOffline(page);
  await context.setOffline(true);
  await page.evaluate(async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("assembly-lab-offline:")) await caches.delete(key);
    }
    window.dispatchEvent(new Event("offline"));
  });
  const panel = await openStatus(page);
  await expect(panel.getByText("Available offline", { exact: true })).toHaveCount(0);
  await context.setOffline(false);
  const repair = panel.getByRole("button", {
    name: /Resume download|Download for offline use|Retry download/,
  });
  await repair.click();
  await offlineReady(page);
  await context.setOffline(true);
  expect((await page.reload())?.fromServiceWorker()).toBe(true);
  await offlineReady(page);
});

test("a browser that cannot save the course still runs the online app", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "serviceWorker", { value: undefined });
  });
  await page.goto("#/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(STRINGS.title);
  const panel = await openStatus(page);
  await expect(panel.getByText("Offline access unavailable", { exact: true })).toBeVisible();
});

for (const theme of ["light", "dark"] as const) {
  test(`App status is reachable with a keyboard and readable in ${theme}`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("#/lesson/one-addition");
    await page.getByLabel(STRINGS.theme).selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const panel = page.locator(".app-status");
    const summary = panel.locator("summary").first();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(panel).toHaveAttribute("open", "");
    await expect(panel.getByRole("heading", { name: "Version", exact: true })).toBeVisible();
    await expect(panel.getByRole("heading", { name: "Offline access", exact: true })).toBeVisible();
    await expect(panel.getByRole("status").first()).toBeVisible();
    await expect(
      panel.getByRole("button", { name: "Download for offline use", exact: true }),
    ).toBeVisible();
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(panel).not.toHaveAttribute("open");
    await expect(summary).toBeFocused();
  });
}
