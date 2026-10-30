// Copyright © 2026 Christopher Snow

import { lessonForFigure } from "./pacing";
import { expect, test } from "@playwright/test";
import { designProblems } from "./design";
import { watchErrors } from "./module3";

for (const theme of ["light", "dark"] as const) {
  for (const item of [
    {
      lesson: "constants-and-widths",
      figure: "add-shifted-immediate",
      input: "Constant 1",
      modifier: "lsl #12",
      effective: "4096",
      result: "w2 = 4103",
      kept: "w0 keeps its value",
      link: "Arm’s ADD (immediate) reference",
      path: "ADD--immediate---Add-immediate-value-",
    },
    {
      lesson: "shifts",
      figure: "add-shifted-register",
      input: "w1 = 7",
      modifier: "lsl #1",
      effective: "14",
      result: "w2 = 26",
      kept: "w0, w1 keep their values",
      link: "Arm’s ADD (shifted register) reference",
      path: "ADD--shifted-register---Add-optionally-shifted-register-",
    },
  ]) {
    test(`${item.lesson}: one ADD input modifier in ${theme}, including restore and reset`, async ({
      page,
      isMobile,
    }) => {
      const errors = watchErrors(page);
      await page.goto(`#/lesson/${lessonForFigure(item.lesson, item.figure)}`);
      await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const figure = page.locator(`#ix-${item.figure}`);
      await expect(figure.getByRole("link", { name: item.link, exact: true })).toHaveAttribute(
        "href",
        `https://developer.arm.com/documentation/ddi0602/2025-12/Base-Instructions/${item.path}`,
      );
      const lockedBefore = await page.locator(".al-locked").count();
      const preview = figure.locator(".al-primitive-preview");
      await expect(preview).toContainText(item.input);
      await expect(preview.locator(".al-primitive-transform code")).toHaveText([
        item.modifier,
        item.effective,
      ]);
      await expect(preview).toContainText("w2 = ?");
      await expect(figure).not.toContainText(item.result);
      await expect(page.locator(".al-locked")).toHaveCount(lockedBefore);
      await figure.getByRole("button", { name: "Run the instruction", exact: true }).click();
      await expect(figure.getByRole("status")).toContainText(item.result);
      await expect(figure.getByRole("status")).toContainText(item.kept);
      await expect(figure.locator('[data-register="w0"] .al-dreg-value')).toHaveText(
        item.lesson === "shifts" ? "12" : "7",
      );
      if (item.lesson === "shifts")
        await expect(figure.locator('[data-register="w1"] .al-dreg-value')).toHaveText("7");
      await page.reload();
      await expect(figure.getByRole("status")).toContainText(item.result);
      await figure.getByRole("button", { name: "Start again", exact: true }).click();
      await expect(figure.locator(".al-primitive-preview")).toContainText("w2 = ?");
      await expect(figure.getByRole("status")).toHaveCount(0);
      await expect(page.locator(".al-locked")).toHaveCount(lockedBefore);
      expect(await designProblems(page, isMobile)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}
