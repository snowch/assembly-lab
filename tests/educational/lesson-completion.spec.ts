// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { LESSONS } from "@al/content";
import { designProblems } from "./design";

const ordered = [...LESSONS].sort((a, b) => a.module - b.module || a.order - b.order);
const first = ordered[0]!;
const second = ordered[1]!;
const key = (id: string) => `assembly-lab:v1:manual-completion:${id}`;
const mark = "Mark lesson complete";
const undo = "Mark lesson incomplete";

for (const theme of ["light", "dark"]) {
  test(`completion stays compact beside the lesson cards and hexadecimal digits use code in ${theme}`, async ({
    page,
    isMobile,
  }) => {
    await page.goto("#/lesson/one-pattern-three-readings");
    await page.locator(".theme-picker select").selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await page.evaluate(() => document.fonts.ready);

    const digits = page.locator(".lesson-section p").filter({
      hasText: "Each group of four bits becomes one digit",
    });
    for (const digit of ["0", "9", "a", "f"])
      await expect(
        digits
          .locator("code")
          .filter({ hasText: new RegExp(`^${digit}$`) })
          .first(),
      ).toBeVisible();

    const button = page.locator(".lesson-completion button");
    const clear = page.getByRole("button", { name: "Clear bits", exact: true });
    const next = page.locator('.lesson-nav-link[data-direction="next"]');
    for (const complete of [false, true, false]) {
      await expect(button).toHaveAttribute("data-complete", String(complete));
      const buttonBox = await button.boundingBox();
      const clearBox = await clear.boundingBox();
      const nextBox = await next.boundingBox();
      expect(buttonBox!.height).toBeGreaterThanOrEqual(44);
      expect(buttonBox!.height).toBeCloseTo(clearBox!.height, 1);
      if (!isMobile) {
        expect(buttonBox!.height).toBeLessThan(nextBox!.height);
        expect(buttonBox!.y + buttonBox!.height / 2).toBeCloseTo(
          nextBox!.y + nextBox!.height / 2,
          1,
        );
      }
      await button.click();
    }
    expect(await designProblems(page, isMobile)).toEqual([]);
  });

  test(`manual marks guide the next lesson and can be undone in ${theme}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("#/");
    await page.locator(".theme-picker select").selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.locator(".lesson-complete-mark")).toHaveCount(0);
    await page.locator(".cover-start").click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(first.title);
    const button = page.locator(".lesson-completion button");
    await expect(button).toHaveText(mark);
    await button.focus();
    await page.keyboard.press("Enter");
    await expect(button).toHaveText(undo);
    await expect(button).toBeFocused();
    expect(await designProblems(page, page.viewportSize()!.width < 500)).toEqual([]);
    expect(await button.evaluate((el) => el.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
      40,
    );
    await page.locator(".lesson-back a").click();
    await expect(
      page.locator(`a[href="#/lesson/${first.id}"] .lesson-complete-mark`),
    ).toContainText("Marked complete");
    await expect(page.locator(".cover-continue")).toHaveAttribute("href", `#/lesson/${second.id}`);
    await expect(page.locator(".cover-continue")).toContainText(second.title);
    await page.reload();
    await page.locator(".cover-continue").click();
    await expect(page.locator(".lesson-completion button")).toHaveText(mark);
    await page.locator('.lesson-nav-link[data-direction="previous"]').click();
    await page.locator(".lesson-completion button").click();
    await expect(page.locator(".lesson-completion button")).toHaveText(mark);
    await page.locator(".lesson-back a").click();
    await expect(page.locator(".lesson-complete-mark")).toHaveCount(0);
    await expect(page.locator(".cover-start")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });
}

test("navigation and exercise results never mark a lesson; toggling preserves its work", async ({
  page,
}) => {
  await page.goto(`#/lesson/${first.id}`);
  await page.locator('.lesson-nav-link[data-direction="next"]').click();
  await page.locator(".lesson-back a").click();
  await expect(page.locator(".lesson-complete-mark")).toHaveCount(0);
  await page.goto("#/lesson/meet-the-machine");
  const exercise = page.locator("#challenge-trace-the-call");
  await exercise.getByRole("textbox").nth(0).fill("670");
  await exercise.getByRole("textbox").nth(1).fill("28750");
  await exercise.getByRole("button", { name: "Run tests", exact: true }).click();
  await expect(exercise.locator(".challenge-complete")).toBeVisible();
  const button = page.locator(".lesson-completion button");
  await expect(button).toHaveText(mark);
  const before = await page.evaluate(() =>
    localStorage.getItem("assembly-lab:v1:meet-the-machine"),
  );
  await button.click();
  await button.click();
  expect(await page.evaluate(() => localStorage.getItem("assembly-lab:v1:meet-the-machine"))).toBe(
    before,
  );
  await page.reload();
  await expect(button).toHaveText(mark);
  await expect(exercise.getByRole("textbox").nth(0)).toHaveValue("670");
  await expect(exercise.locator(".challenge-complete")).toBeVisible();
});

test("marks and undo stay in sync across tabs without losing other lesson marks", async ({
  context,
}) => {
  const a = await context.newPage();
  const b = await context.newPage();
  await a.goto(`#/lesson/${first.id}`);
  await b.goto(`#/lesson/${first.id}`);
  const aButton = a.locator(".lesson-completion button");
  const bButton = b.locator(".lesson-completion button");
  await aButton.click();
  await expect(bButton).toHaveText(undo);
  await bButton.click();
  await expect(aButton).toHaveText(mark);
  await aButton.click();
  await b.goto(`#/lesson/${second.id}`);
  await b.locator(".lesson-completion button").click();
  await a.locator(".lesson-back a").click();
  await expect(a.locator(".lesson-complete-mark")).toHaveCount(2);
  await expect(a.locator(".cover-continue")).toHaveAttribute("href", `#/lesson/${ordered[2]!.id}`);
  await b.locator(".lesson-completion button").click();
  await expect(a.locator(".lesson-complete-mark")).toHaveCount(1);
  await expect(a.locator(".cover-continue")).toHaveAttribute("href", `#/lesson/${second.id}`);
  await a.reload();
  await expect(a.locator(".lesson-complete-mark")).toHaveCount(1);
  await b.evaluate(() => localStorage.clear());
  await expect(a.locator(".lesson-complete-mark")).toHaveCount(0);
  await expect(a.locator(".cover-start")).toBeVisible();
});

test("all current split lessons can be marked, then the final lesson reopened", async ({
  page,
}) => {
  await page.goto("#/");
  await page.evaluate(
    (ids) => {
      for (const id of ids) localStorage.setItem(`assembly-lab:v1:manual-completion:${id}`, "true");
    },
    ordered.map((l) => l.id),
  );
  await page.reload();
  await expect(
    page.getByText("You have marked all current lessons complete.", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".cover-continue")).toHaveCount(0);
  await expect(page.locator(".lesson-complete-mark")).toHaveCount(ordered.length);
  const final = ordered.at(-1)!;
  await page.locator(`.plan-module a[href="#/lesson/${final.id}"]`).click();
  await expect(page.locator(".lesson-completion button")).toHaveText(undo);
  await page.locator(".lesson-completion button").click();
  await page.locator(".lesson-back a").click();
  await expect(page.locator(".cover-continue")).toHaveAttribute("href", `#/lesson/${final.id}`);
  await expect(
    page.locator(`.plan-module a[href="#/lesson/${final.id}"] .lesson-complete-mark`),
  ).toHaveCount(0);
});

test("corrupt and unknown completion records do not count as finished lessons", async ({
  page,
}) => {
  await page.goto("#/");
  await page.evaluate(
    ({ firstKey, secondKey }) => {
      localStorage.setItem(firstKey, '{"complete":true}');
      localStorage.setItem(secondKey, "broken JSON");
      localStorage.setItem("assembly-lab:v1:manual-completion:removed-lesson", "true");
    },
    { firstKey: key(first.id), secondKey: key(second.id) },
  );
  await page.reload();
  await expect(page.locator(".cover-start")).toBeVisible();
  await expect(page.locator(".lesson-complete-mark")).toHaveCount(0);
  await page.locator(".cover-start").click();
  await page.locator(".lesson-completion button").click();
  await page.reload();
  await expect(page.locator(".lesson-completion button")).toHaveText(undo);
});

test("a storage failure keeps the mark for this visit and tells the learner it was not saved", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key.startsWith("assembly-lab:v1:manual-completion:"))
        throw new DOMException("Quota", "QuotaExceededError");
      return original.call(this, key, value);
    };
  });
  await page.goto(`#/lesson/${first.id}`);
  await page.locator(".lesson-completion button").click();
  await expect(page.locator(".lesson-completion button")).toHaveText(undo);
  await expect(page.getByText(/Lesson marks could not be saved/)).toBeVisible();
  expect(await designProblems(page, page.viewportSize()!.width < 500)).toEqual([]);
  await page.locator(".lesson-back a").click();
  await expect(page.locator(".lesson-complete-mark")).toHaveCount(1);
  await expect(page.getByText(/Lesson marks could not be saved/)).toBeVisible();
  await page.reload();
  await expect(page.locator(".lesson-complete-mark")).toHaveCount(0);
});
