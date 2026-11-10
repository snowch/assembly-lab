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
      calc = c.locator(".al-programmer-calculator"),
      link = c.getByRole("link", { name: "Open full calculator", exact: true }),
      notes = c.locator(".al-working-notes");
    const x = c.locator('[data-field="x1"] input'),
      w = c.locator('[data-field="w2"] input');
    await expect(x).toHaveValue("");
    await expect(w).toHaveValue("");
    await expect(x).toHaveAttribute("inputmode", "text");
    await expect(w).toHaveAttribute("inputmode", "text");
    await expect(c.locator(".al-calculator")).toHaveCount(1);
    await expect(c.getByLabel("Calculation", { exact: true })).toHaveCount(0);
    await expect(notes).toHaveJSProperty("open", false);
    await expect(c).toContainText("hexadecimal numbers beginning with");
    await expect(calc).toHaveJSProperty("open", false);
    await calc.locator(":scope > summary").click();
    await expect(link).toHaveAttribute("href", "https://snowch.github.io/programmer-calculator/");
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link).toHaveAccessibleDescription("Opens in a new tab");
    // CI checks new-tab/state behavior deterministically. Live destination is checked separately.
    await page.context().route("https://snowch.github.io/programmer-calculator/", (route) =>
      route.fulfill({
        contentType: "text/html",
        body: "<!doctype html><title>Calculator test destination</title>",
      }),
    );
    const openCalculator = async () => {
      if (!(await calc.evaluate((el) => (el as HTMLDetailsElement).open)))
        await calc.locator(":scope > summary").click();
      const original = page.url();
      const opened = page.waitForEvent("popup");
      await link.focus();
      await page.keyboard.press("Enter");
      const popup = await opened;
      await popup.waitForLoadState("domcontentloaded");
      expect(popup.url()).toBe("https://snowch.github.io/programmer-calculator/");
      expect(await popup.evaluate(() => window.opener)).toBe(null);
      await popup.close();
      expect(page.url()).toBe(original);
    };
    await openCalculator();
    await expect(x).toHaveValue("");
    await expect(w).toHaveValue("");
    await expect(c.getByText("No tests run yet", { exact: true })).toBeVisible();
    await expect(c.getByRole("button", { name: "Show hint (1 of 5)", exact: true })).toBeVisible();
    await notes.locator("summary").click();
    let working = notes.getByLabel("Your working notes", { exact: true });
    await working.fill("Track the last write to each register.");
    await expect(page.locator("#ix-x3-halves .al-locked")).toBeVisible();
    await page.reload();

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
    await openCalculator();
    await expect(x).toHaveValue("0xffffffff00000005");
    await expect(c.locator(".verdict-failure h4")).toHaveText(["x1 at the end"]);
    await x.fill("0x5");
    await c.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await openCalculator();
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
