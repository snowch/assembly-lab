// Copyright © 2026 Christopher Snow

import { expect, test, type Page } from "@playwright/test";
import { LESSONS } from "@al/content";
import { STRINGS } from "../../apps/course/src/strings";
import { COMPILER_STRINGS as C } from "../../packages/views/src/strings.compiler";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { challenge, passing, press, run, status, watchErrors } from "./module1";

async function saved(page: Page) {
  await expect(page.locator('[data-offline="ready"]')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator(".offline-status")).toContainText(STRINGS.offline.ready);
}

test("the whole course reopens offline, including lessons never visited online", async ({
  page,
  context,
}) => {
  test.setTimeout(120_000);
  const errors = watchErrors(page);
  const session = await context.newCDPSession(page);
  await session.send("Network.enable");
  await session.send("Network.setCacheDisabled", { cacheDisabled: true });
  await page.goto("#/");
  await saved(page);
  const offlineStatus = page.locator(".offline-status");
  await expect(offlineStatus.locator(".offline-current")).toBeInViewport();
  const explanation = offlineStatus.getByText(STRINGS.offline.downloadExplanation, { exact: true });
  await expect(explanation).toBeHidden();
  await offlineStatus.getByText(STRINGS.offline.detailsLabel, { exact: true }).click();
  await expect(explanation).toBeVisible();
  await offlineStatus.getByText(STRINGS.offline.detailsLabel, { exact: true }).click();
  await context.setOffline(true);
  for (const lesson of LESSONS) {
    const response = await page.goto(`./?offline-check=${lesson.id}#/lesson/${lesson.id}`);
    expect(response?.fromServiceWorker()).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
    await expect(page.locator("section.lesson-section")).toHaveCount(10);
    await saved(page);
    await expect(page.locator(".offline-current")).toBeInViewport();
  }
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
  expect(errors).toEqual([]);
});

test("offline compilation, exercise grading and saved work survive closing and reopening a tab", async ({
  page,
  context,
}) => {
  await page.goto("#/");
  await saved(page);
  await page.getByLabel(STRINGS.theme).selectOption("dark");
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
  await expect(compiler.locator("[data-compiler-step]")).toHaveAttribute("data-compiler-step", "1");
  const next = compiler.getByRole("button", { name: V.stepper.next, exact: true });
  while (await next.isEnabled()) await press(reopened, next);
  await expect(compiler.getByRole("status")).toContainText("both return");
  expect(errors).toEqual([]);
  await compiler.locator("summary").filter({ hasText: C.playground.compare }).click();
  await press(reopened, compiler.getByRole("button", { name: C.playground.compare, exact: true }));
  await expect(compiler.getByText(C.playground.failed, { exact: true })).toBeVisible();
});

test("losing cached files removes the ready claim and reconnecting repairs the copy", async ({
  page,
  context,
}) => {
  await page.goto("#/");
  await saved(page);
  await context.setOffline(true);
  await page.evaluate(async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("assembly-lab-offline:")) await caches.delete(key);
    }
    window.dispatchEvent(new Event("offline"));
  });
  await expect(page.locator('[data-offline="unavailable"]')).toBeVisible();
  await context.setOffline(false);
  await saved(page);
  await context.setOffline(true);
  expect((await page.reload())?.fromServiceWorker()).toBe(true);
  await saved(page);
});

test("a browser that cannot save the course still runs the online app", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "serviceWorker", { value: undefined });
  });
  await page.goto("#/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(STRINGS.title);
  await expect(page.locator('[data-offline="unsupported"]')).toBeVisible();
});
