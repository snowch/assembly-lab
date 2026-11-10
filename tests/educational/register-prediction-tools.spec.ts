// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { designProblems } from "./design";
import { watchErrors } from "./module1";

for (const theme of ["light", "dark"] as const) {
  test(`register prediction scratch tools remain independent in ${theme}`, async ({
    page,
    isMobile,
  }) => {
    const errors = watchErrors(page);
    await page.goto("#/lesson/register-widths");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const c = page.locator("#ix-predict-two-registers"),
      calc = c.locator(".al-calculator").first(),
      notes = c.locator(".al-working-notes");
    const x = c.locator('[data-field="x1"] input'),
      w = c.locator('[data-field="w2"] input');
    await expect(x).toHaveValue("");
    await expect(w).toHaveValue("");
    await expect(x).toHaveAttribute("inputmode", "text");
    await expect(w).toHaveAttribute("inputmode", "text");
    await expect(calc).toHaveJSProperty("open", false);
    await expect(notes).toHaveJSProperty("open", false);
    await expect(c).toContainText("hexadecimal numbers beginning with");
    await calc.locator("summary").focus();
    await page.keyboard.press("Enter");
    const expression = calc.getByLabel("Calculation", { exact: true });
    await expect(expression).toHaveValue("");
    await expression.fill("0xffffffffffffffff + 1");
    await expression.press("Enter");
    await expect(expression).toBeFocused();
    await expect(calc.getByRole("status")).toContainText("18,446,744,073,709,551,616");
    await expect(calc.getByRole("status")).toContainText("0x10000000000000000");
    await expect(x).toHaveValue("");
    await expect(w).toHaveValue("");
    await expect(c.getByText("No tests run yet", { exact: true })).toBeVisible();
    await expect(c.getByRole("button", { name: "Show hint (1 of 5)", exact: true })).toBeVisible();
    await notes.locator("summary").click();
    let working = notes.getByLabel("Your working notes", { exact: true });
    await working.fill("Track the last write to each register.");
    await expect(page.locator("#ix-x3-halves .al-locked")).toBeVisible();
    await page.reload();
    await expect(calc).toHaveJSProperty("open", false);
    await expect(notes).toHaveJSProperty("open", false);
    await notes.locator("summary").click();
    working = notes.getByLabel("Your working notes", { exact: true });
    await expect(working).toHaveValue("Track the last write to each register.");
    await expect(x).toHaveValue("");
    await expect(w).toHaveValue("");
    await x.fill("0xffffffff00000005");
    await w.fill("0xf4240");
    await c.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(c.locator(".verdict-failure h4")).toHaveText(["x1 at the end"]);
    await working.fill("Recheck the width of the last write.");
    await expect(c.locator(".verdict-failure h4")).toHaveText(["x1 at the end"]);
    await calc.locator("summary").click();
    await expect(expression).toHaveValue("");
    await expression.fill("0x2a + 2^8");
    await expression.press("Enter");
    await expect(calc.getByRole("status")).toContainText("298");
    await expect(calc.getByRole("status")).toContainText("0x12a");
    await expect(x).toHaveValue("0xffffffff00000005");
    await expect(c.locator(".verdict-failure h4")).toHaveText(["x1 at the end"]);
    await x.fill("0x5");
    await c.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await working.fill("Keep the lower half while replacing the upper half.");
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await c.getByRole("button", { name: "Clear work: Predict two registers", exact: true }).click();
    await c.getByRole("button", { name: "Discard work", exact: true }).click();
    await notes.locator("summary").click();
    await expect(x).toHaveValue("");
    await expect(w).toHaveValue("");
    await expect(working).toHaveValue("Keep the lower half while replacing the upper half.");
    await expect(c.getByText("Work cleared", { exact: true })).toBeVisible();
    await x.fill("17");
    await notes.getByRole("button", { name: "Clear notes", exact: true }).click();
    await expect(working).toHaveValue("");
    await expect(x).toHaveValue("17");
    await page.reload();
    await notes.locator("summary").click();
    await expect(working).toHaveValue("");
    await expect(x).toHaveValue("17");
    await expect(page.locator("#ix-x3-halves .al-locked")).toBeVisible();
    expect(await designProblems(page, isMobile)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
