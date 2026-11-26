// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { designProblems } from "./design";

for (const theme of ["light", "dark"]) {
  test(`kept bits: predictions, limits, restoration and local reset, ${theme}`, async ({
    page,
  }, info) => {
    await page.goto("#/lesson/four-bit-arithmetic");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    const storage = page.locator(".al-retained-bits");
    await expect(storage.locator("[data-storage-value]")).toHaveText("—");
    await expect(storage.locator("[data-storage-full]")).toHaveText("1100100");
    await storage.getByLabel("Prediction (decimal, optional)").fill("100");
    const keep = storage.getByRole("button", { name: "Keep low bits", exact: true });
    await keep.focus();
    await page.keyboard.press("Enter");
    await expect(keep).toBeFocused();
    await expect(storage.locator("[data-storage-value]")).toHaveText("4");
    await expect(storage.locator("[data-storage-removed]")).toHaveText("96");
    await expect(storage.getByRole("status")).toContainText("You predicted 100");
    await expect(storage.getByRole("status")).toContainText("100 = 6 × 16 + 4");
    await expect(storage.getByRole("alert")).toHaveCount(0);
    for (const [value, result] of [
      ["14", "14"],
      ["15", "15"],
      ["16", "0"],
    ]) {
      await storage.getByLabel("Full decimal value").fill(value!);
      await expect(storage.locator("[data-storage-value]")).toHaveText("—");
      await keep.click();
      await expect(storage.locator("[data-storage-value]")).toHaveText(result!);
    }
    await storage.getByLabel("Full decimal value").fill("100");
    await storage.getByLabel("Kept width").selectOption("8");
    await keep.click();
    await expect(storage.locator("[data-storage-value]")).toHaveText("100");
    const geometry = await storage.evaluate((root) => {
      const card = root.getBoundingClientRect();
      return [...root.querySelectorAll(".al-retained-place")].map((cell) => ({
        left: cell.getBoundingClientRect().left - card.left,
        right: card.right - cell.getBoundingClientRect().right,
      }));
    });
    for (const cell of geometry) {
      expect(cell.left).toBeGreaterThanOrEqual(0);
      expect(cell.right).toBeGreaterThanOrEqual(0);
    }
    if (theme === "dark")
      expect(
        await storage
          .getByLabel("Full decimal value")
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      ).not.toBe("rgb(255, 255, 255)");

    await expect(storage.locator("[data-storage-removed]")).toHaveText("0");
    await expect(storage.getByRole("status")).toContainText("Your prediction matches");
    await page.reload();
    await expect(storage.getByLabel("Kept width")).toHaveValue("8");
    await expect(storage.locator("[data-storage-value]")).toHaveText("100");
    await expect(page.getByRole("combobox", { name: "Theme", exact: true })).toHaveValue(theme);
    await storage.getByLabel("Full decimal value").fill("256");
    await keep.click();
    await expect(storage.getByRole("alert")).toContainText(
      "Values outside this tool’s range are rejected",
    );
    await expect(storage.locator("[data-storage-value]")).toHaveText("—");
    const addition = page.locator('.al-four-arithmetic[data-mode="addition"]');
    await addition.getByRole("button", { name: "Next column", exact: true }).click();
    const before = await addition
      .locator('[data-row="result"][data-bit] .al-four-value')
      .allTextContents();
    await storage.getByRole("button", { name: "Reset", exact: true }).click();
    await expect(storage.getByLabel("Full decimal value")).toHaveValue("100");
    await expect(storage.getByLabel("Kept width")).toHaveValue("4");
    await expect(storage.locator("[data-storage-value]")).toHaveText("—");
    expect(
      await addition.locator('[data-row="result"][data-bit] .al-four-value').allTextContents(),
    ).toEqual(before);
    await keep.click();
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    await storage.getByLabel("Kept width").selectOption("8");
    await keep.click();
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
  });

  test(`shift result width is separate from accepted input, ${theme}`, async ({ page }, info) => {
    await page.goto("#/lesson/shifts");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    const prediction = page.locator("#ix-predict-fill");
    await prediction.getByRole("radio").first().check();
    await prediction.getByRole("button", { name: /Check your prediction/ }).click();
    const shift = page.locator(".al-shift");
    await shift
      .getByRole("group", { name: "Instruction", exact: true })
      .getByRole("button", { name: "lsl", exact: true })
      .click();
    await shift
      .getByRole("group", { name: "Shift by", exact: true })
      .getByRole("button", { name: "1", exact: true })
      .click();
    for (const [input, result] of [
      ["0x7fffffff", "4294967294"],
      ["0x80000000", "0"],
      ["0x80000001", "2"],
    ]) {
      await shift.getByLabel("Value of w0 when the call starts").fill(input!);
      await expect(shift.locator('[data-row="after"]')).toHaveAttribute("data-value", result!);
    }
    await shift.getByLabel("Value of w0 when the call starts").fill("0x100000000");
    await expect(shift.getByRole("note")).toBeVisible();
    await expect(shift.locator('[data-row="after"]')).toHaveCount(0);
    await shift.getByLabel("Value of w0 when the call starts").fill("0x80000001");
    await expect(shift.locator('[data-row="after"]')).toHaveAttribute("data-value", "2");
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
  });
  test(`loop counterexample stays behind its prediction, ${theme}`, async ({ page }, info) => {
    await page.goto("#/lesson/writing-an-upward-loop");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    const prediction = page.locator("#ix-predict-dim-up-beq");
    const runs = page.locator("#ix-dim-up-beq-runs");
    await expect(runs.locator(".al-loop-bar-row")).toHaveCount(0);
    await prediction.getByRole("radio").first().check();
    await prediction.getByRole("button", { name: "Check your prediction", exact: true }).click();
    await expect(runs.locator(".al-loop-bar-row")).toHaveCount(2);
    await expect(runs.locator(".al-loop-bar-row").nth(0)).toHaveAttribute("data-visits", "1");
    await expect(runs.locator(".al-loop-bar-row").nth(1)).toHaveAttribute("data-visits", "2");
    await runs.getByRole("button", { name: "dim_up(128, 4, 5)", exact: true }).click();
    await expect(runs.locator(".al-loop-history strong")).toHaveText(["128", "64", "32"]);
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
  });
}
