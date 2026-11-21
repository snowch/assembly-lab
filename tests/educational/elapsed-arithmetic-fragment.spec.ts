// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"])
  test(`elapsed arithmetic has prepared inputs and supplied termination in ${theme}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("#/lesson/subtracting-and-the-tick-counter");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    const exercise = page.locator("#challenge-write-elapsed");
    const table = exercise.getByRole("table");
    await expect(table.getByRole("row")).toHaveCount(5);
    await expect(table.getByRole("columnheader")).toHaveText(["now (w0)", "then (w1)"]);
    await expect(table.getByRole("cell")).toHaveText([
      "5,000",
      "1,000",
      "86,400,000",
      "3,600,000",
      "250",
      "4,294,967,046",
      "30",
      "4,294,966,296",
    ]);
    await expect(exercise).toContainText("You do not need to load the large then values");
    const editor = exercise.getByRole("textbox", { name: "Your instructions" });
    await expect(editor).toHaveValue("");
    await expect(exercise).not.toContainText("sub w0, w0, w1");
    await editor.fill("sub w0, w1, w0");
    await exercise.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(exercise).toHaveAttribute("data-complete", "false");
    await editor.fill("sub w0, w0, w1");
    const run = exercise.getByRole("button", { name: "Run tests", exact: true });
    await run.focus();
    await page.keyboard.press("Enter");
    await expect(exercise).toHaveAttribute("data-complete", "true");
    await page.reload();
    await expect(editor).toHaveValue("sub w0, w0, w1");
    await expect(exercise).toHaveAttribute("data-complete", "true");
    // Legacy saved code survives both editor modes and still runs.
    await editor.fill("sub w0, w0, w1\nret");
    await exercise.getByRole("button", { name: "Tap", exact: true }).click();
    await exercise.getByRole("button", { name: "Text", exact: true }).click();
    await expect(editor).toHaveValue("sub w0, w0, w1\nret");
    await run.click();
    await expect(exercise).toHaveAttribute("data-complete", "true");
    await page.reload();
    await expect(editor).toHaveValue("sub w0, w0, w1\nret");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });
