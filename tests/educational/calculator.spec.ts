// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { openLesson, watchErrors } from "./module1";
import { designProblems } from "./design";

for (const theme of ["light", "dark"] as const) {
  test(`optional calculator keeps arithmetic separate from answers in ${theme}`, async ({
    page,
    isMobile,
  }) => {
    const errors = watchErrors(page);
    await page.goto("#/");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    await openLesson(page, "same-bits-two-readings");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.locator(".al-calculator")).toHaveCount(2);
    const transfer = page.locator('[data-reading-task="transfer"]');
    const first = transfer.locator(".al-calculator");
    await expect(first).not.toHaveAttribute("open", "");
    await first.locator("summary").click();
    const calculation = first.getByLabel("Calculation", { exact: true });
    await expect(calculation).toHaveValue("");
    await expect(first.locator(".al-calculator-format code")).toContainText([
      "+",
      "-",
      "*",
      "/",
      "^",
      "2^8",
      "^",
    ]);
    await calculation.fill("2^31 + 8");
    await calculation.press("Enter");
    await expect(calculation).toBeFocused();
    await expect(first.getByRole("status")).toHaveText("Result: 2,147,483,656");
    await expect(transfer.locator('[name="unsigned"]')).toHaveValue("");
    await expect(transfer.locator('[name="signed"]')).toHaveValue("");
    await expect(transfer.locator("[data-feedback]")).toHaveCount(0);
    await calculation.fill("5 / 2");
    await expect(first.getByRole("status")).toBeEmpty();
    await first.getByRole("button", { name: "Calculate", exact: true }).click();
    await expect(first.getByRole("status")).toHaveText(
      "This division does not give a whole number.",
    );
    await calculation.fill("2^-1");
    await calculation.press("Enter");
    await expect(first.getByRole("status")).toHaveText("Use a non-negative whole number after ^.");
    await calculation.fill("2^64");
    await calculation.press("Enter");
    await expect(first.getByRole("status")).toHaveText("Result: 18,446,744,073,709,551,616");

    const exercise = page.locator("#ix-make-minus-three");
    const answer = exercise.getByLabel("its unsigned reading", { exact: true });
    await answer.fill("123");
    const second = exercise.locator(".al-calculator");
    await second.locator("summary").click();
    const scratch = second.getByLabel("Calculation", { exact: true });
    await expect(scratch).toHaveValue("");
    await scratch.fill("(2^3 - 1) * 6");
    await scratch.press("Enter");
    await expect(second.getByRole("status")).toHaveText("Result: 42");
    await expect(answer).toHaveValue("123");
    await expect(exercise.getByText("No tests run yet", { exact: true })).toBeVisible();
    await second.locator("summary").click();
    await second.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(scratch).toHaveValue("(2^3 - 1) * 6");
    await expect(second.getByRole("status")).toHaveText("Result: 42");
    for (const input of [calculation, scratch]) {
      const contrast = await input.evaluate((element) => {
        const style = getComputedStyle(element);
        const luminance = (colour: string) => {
          const rgb = colour
            .match(/[\d.]+/g)!
            .slice(0, 3)
            .map(Number);
          return rgb.reduce((sum, channel, i) => {
            const value = channel / 255;
            return (
              sum +
              (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4) *
                [0.2126, 0.7152, 0.0722][i]!
            );
          }, 0);
        };
        const fg = luminance(style.color),
          bg = luminance(style.backgroundColor);
        return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      });
      expect(contrast).toBeGreaterThanOrEqual(4.5);
    }
    expect(await designProblems(page, isMobile)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
