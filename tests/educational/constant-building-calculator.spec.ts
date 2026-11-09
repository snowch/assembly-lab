// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { openLesson, watchErrors, stored } from "./module1";
import { designProblems } from "./design";

for (const theme of ["light", "dark"] as const) {
  test(`constant-building calculator is optional scratch work in ${theme}`, async ({
    page,
    isMobile,
  }) => {
    const errors = watchErrors(page);
    await page.goto("#/");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    await openLesson(page, "building-constants");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.getByText(/Doubling 1 sixteen times/)).toBeVisible();
    const exercise = page.locator('section.challenge[data-challenge="build-1000000"]');
    const calculator = exercise.locator(".al-calculator");
    const summary = calculator.locator("summary");
    await expect(calculator).not.toHaveAttribute("open", "");
    await expect(calculator.getByLabel("Calculation", { exact: true })).toHaveCount(0);
    await expect(page.locator("#ix-solution-halves .al-locked")).toBeVisible();
    await exercise.getByRole("button", { name: "Text", exact: true }).click();
    const assembly = exercise.locator("textarea");
    const initial = await assembly.inputValue();
    await exercise.getByRole("button", { name: /^Show hint/ }).click();
    const before = await stored(page, "building-constants");
    await summary.focus();
    await page.keyboard.press("Enter");
    expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    const input = calculator.getByLabel("Calculation", { exact: true });
    await expect(input).toHaveValue("");
    await expect(calculator).toContainText("keeping the whole-number part towards zero");
    await input.fill("131075 / 65536");
    await input.press("Enter");
    await expect(input).toBeFocused();
    await expect(calculator.getByRole("status")).toHaveText("Result: 2");
    await input.fill("131075 - 2 * 65536");
    await expect(calculator.getByRole("status")).toBeEmpty();
    await input.press("Enter");
    await expect(calculator.getByRole("status")).toHaveText("Result: 3");
    await expect(assembly).toHaveValue(initial);
    await expect(exercise.getByText("No tests run yet", { exact: true })).toBeVisible();
    await expect(page.locator("#ix-solution-halves .al-locked")).toBeVisible();
    expect(await stored(page, "building-constants")).toEqual(before);
    await exercise.getByRole("button", { name: "Tap", exact: true }).click();
    await expect(input).toHaveValue("131075 - 2 * 65536");
    await input.fill("2 / 0");
    await calculator.getByRole("button", { name: "Calculate", exact: true }).click();
    await expect(calculator.getByRole("status")).toHaveText("You cannot divide by zero.");
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await summary.click();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(input).toHaveValue("2 / 0");
    await input.fill("2^16");
    await input.press("Enter");
    await expect(calculator.getByRole("status")).toHaveText("Result: 65,536");
    await exercise.getByRole("button", { name: "Text", exact: true }).click();
    await expect(assembly).toHaveValue(initial);
    expect(await designProblems(page, isMobile)).toEqual([]);
    await assembly.fill("mov w0, 16960\nmovk w0, 15, lsl 16\nret");
    await exercise.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(exercise.locator(".challenge-complete")).toBeVisible();
    await expect(page.locator("#ix-solution-halves .al-locked")).toHaveCount(0);
    await page.reload();
    await expect(exercise.locator(".challenge-complete")).toBeVisible();
    await expect(assembly).toHaveValue("mov w0, 16960\nmovk w0, 15, lsl 16\nret");
    await expect(calculator).not.toHaveAttribute("open", "");
    expect(errors).toEqual([]);
  });
}
