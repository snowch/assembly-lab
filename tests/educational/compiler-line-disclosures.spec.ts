// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { LESSONS } from "@al/content";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { openLesson, watchErrors } from "./module1";

const exceptions = new Set(["tiny-function", "meet-the-machine", "branches"]);

for (const theme of ["light", "dark"] as const) {
  test(`compiler references appear only where discussed throughout the course in ${theme}`, async ({
    page,
    isMobile,
  }) => {
    // The standard phone project covers 375px elsewhere; also exercise the narrower 360px view.
    if (isMobile) await page.setViewportSize({ width: 360, height: 812 });
    await page.addInitScript((value) => {
      localStorage.setItem("assembly-lab:v1:theme", value);
    }, theme);
    const errors = watchErrors(page);
    for (const lesson of LESSONS) {
      await openLesson(page, lesson.id);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const disclosure = page.locator(".al-compiler-lines");
      await expect(disclosure, lesson.id).toHaveCount(exceptions.has(lesson.id) ? 1 : 0);
      if (exceptions.has(lesson.id)) {
        const tags = page.locator(".al-insn .al-ctag");
        const checkedLines = await tags.allTextContents();
        expect(checkedLines.length).toBeGreaterThan(0);
        await expect(disclosure).not.toHaveAttribute("open", "");
        await disclosure.getByText(V.listing.compilerLinesSummary, { exact: true }).click();
        await expect(disclosure).toHaveAttribute("open", "");
        expect(await disclosure.locator(".al-compiler-line .al-ctag").count()).toBeGreaterThan(0);
        // Opening raw compiler data must not alter the checked teaching associations.
        await expect(tags).toHaveText(checkedLines);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        ),
        lesson.id,
      ).toBe(false);
    }
    expect(errors).toEqual([]);
  });
}
