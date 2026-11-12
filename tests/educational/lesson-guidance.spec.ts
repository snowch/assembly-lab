// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { LESSONS } from "@al/content";
import { FLAGS_LESSON_SECTIONS } from "../../packages/views/src/flags-lesson/strings";
import { openLesson, watchErrors } from "./module1";

for (const theme of ["light", "dark"]) {
  test(`lesson guidance stays local without repeated footer blocks in ${theme}`, async ({
    page,
  }) => {
    // This audit visits every lesson in one context; ordinary activity tests retain their limits.
    test.setTimeout(180_000);
    const errors = watchErrors(page);
    await page.addInitScript(
      (value) => localStorage.setItem("assembly-lab:v1:theme", value),
      theme,
    );
    for (const lesson of LESSONS) {
      await openLesson(page, lesson.id);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
      await expect(page.locator(".lesson-model-note, .lesson-model-vs-reality")).toHaveCount(0);
      await expect(
        page.getByRole("heading", { name: "Follow the state", exact: true }),
      ).toHaveCount(0);
      await expect(page.locator(".lesson")).not.toContainText(
        "Between steps, the simulated processor stays as the last instruction left it.",
      );
      // Descriptive headings are the navigation outline, visible to all readers. Authoring
      // stages add no second label, and surplus sections must be removed from data, not hidden.
      const flags = lesson.id === "adding-and-the-flags";
      const headings = page.locator(
        flags ? ".lesson-step > .step-head > h2" : ".lesson-section > h2",
      );
      await expect(headings).toHaveCount(
        flags ? FLAGS_LESSON_SECTIONS.length : lesson.sections.length,
      );
      for (const heading of await headings.all()) {
        await expect(heading.locator(".section-title")).toBeVisible();
        await expect(heading.locator(".section-kind")).toBeHidden();
        expect(await heading.evaluate((el) => getComputedStyle(el).position)).not.toBe("absolute");
      }
      // Removing a note must remove its disclosure, not leave an inert Step by step button.
      await expect(
        page.locator('figure:not([data-role="calculation"]) .time-model-toggle'),
      ).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        lesson.id,
      ).toBe(true);
    }
    // Column reveal is a different interaction, so its local explanation remains available.
    await openLesson(page, "adding-and-the-flags");
    await expect(page.locator("#cvSummary")).toContainText("Signed addition");
    await expect(page.locator("#columnTrace")).toHaveCount(0);
    await page.locator('input[name="arm-choice"][value="0"]').locator("..").click();
    await page.locator("#armForm button[type=submit]").click();
    await page.locator("#columnTrace > summary").click();
    await expect(page.locator("#columnTrace")).toContainText(
      "it does not execute another instruction",
    );
    expect(errors).toEqual([]);
  });
}
