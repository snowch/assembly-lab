// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { LESSONS } from "@al/content";
import { VIEW_STRINGS } from "../../packages/views/src/strings";
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
    const calculation = page.locator('figure[data-role="calculation"]').first();
    const toggle = calculation.locator(".time-model-toggle");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(calculation.locator(".time-model-note")).toHaveText(
      VIEW_STRINGS.figureRoleNotes.calculation,
    );
    expect(errors).toEqual([]);
  });
}
