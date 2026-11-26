// Copyright © 2026 Christopher Snow

import { setTheme } from "./theme-helper";

import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`reference lookup, exercise scope and diagnostic recovery in ${theme}`, async ({ page }) => {
    await page.goto("#/lesson/subtracting-and-the-tick-counter");
    const themeControl = page.locator(".theme-settings select");
    await setTheme(page, theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const box = page.locator('.asm-editor[data-mode="text"] textarea').first();
    await box.fill("add w0, w0, 4294966296");
    const editor = page.locator(".asm-editor").first();
    const help = editor.getByRole("button", { name: "Syntax for add", exact: true });
    await help.click();
    const panel = page.getByRole("dialog", { name: "Instruction reference", exact: true });
    const search = panel.getByRole("searchbox", { name: "Search instructions" });
    await expect(search).toBeFocused();
    await expect(search).toHaveValue("add");
    await expect(panel.getByRole("button", { name: "Allowed here", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(panel.getByText(/16773120/).first()).toBeVisible();
    await expect(panel.getByText(/4095/).first()).toBeVisible();
    await search.fill("");
    const allowedNames = await panel
      .locator(".reference-entries > details > summary > code")
      .allTextContents();
    expect(allowedNames.sort()).toEqual(["add", "adds", "ret", "sub", "subs"]);
    await panel.getByRole("button", { name: "All browser instructions", exact: true }).click();
    await search.fill("mul");
    expect(await panel.locator(".reference-entries > details").count()).toBeGreaterThan(1);
    await search.fill("mul ");
    expect(await panel.locator(".reference-entries > details").count()).toBeGreaterThan(1);
    await search.fill("b.eq");
    await expect(panel.locator(".reference-entries > details > summary > code")).toHaveText(
      "b.cond",
    );
    await search.fill("nop");
    await expect(panel.getByText("Not allowed in this exercise.")).toBeVisible();
    await panel.getByRole("button", { name: "Close", exact: true }).click();
    await expect(help).toBeFocused();
    await expect(box).toHaveValue("add w0, w0, 4294966296");
    const host = page.locator('[data-challenge="write-elapsed"]');
    // Grading reports the same parse fault only once; editing restores the live diagnostic.
    await host.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(editor.locator(".asm-problems")).toHaveCount(0);
    await expect(box).toHaveAttribute("aria-invalid", "true");
    expect((await host.innerText()).match(/must be from 0 to 4095/g)).toHaveLength(1);
    await box.fill("add w0, w0, 4294966295");
    await expect(editor.locator(".asm-problems")).toHaveCount(1);
    const textBefore = await box.inputValue();
    await page.getByRole("button", { name: "Reference", exact: true }).click();
    await expect(search).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(panel).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Reference", exact: true })).toBeFocused();
    await page.reload();
    await expect(box).toHaveValue(textBefore);
    await expect(themeControl).toHaveValue(theme);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  });
}

test("compact header, keyboard theme choice and calculator/reference coordination", async ({
  page,
}) => {
  await page.goto("#/");
  for (const width of [320, 375, 414, 430, 768, 834, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    // Keep the original compactness bounds while retaining named subject tools.
    const headerLimit = width === 320 ? 236 : width <= 430 ? 184 : width < 1000 ? 144 : 96;
    expect((await page.locator(".shell-header").boundingBox())!.height).toBeLessThanOrEqual(
      headerLimit,
    );
    await expect(page.locator(".shell-header .brand > span")).toBeVisible();
    for (const name of ["Calculator", "Reference"]) {
      const tool = page.getByRole("button", { name, exact: true });
      await expect(tool.locator(":scope > span")).toBeVisible();
      await expect(tool.locator(":scope > span")).toHaveText(name);
    }
    const themeControl = page.locator("#theme-toggle");
    await expect(themeControl).toHaveAccessibleName(/Switch to (light|dark) theme/);
    const themeBox = (await themeControl.boundingBox())!;
    expect(themeBox.width).toBeGreaterThanOrEqual(48);
    expect(themeBox.height).toBe(48);
    expect(await themeControl.evaluate((element) => getComputedStyle(element).opacity)).toBe("1");
    for (const control of [
      page.getByRole("button", { name: "Calculator", exact: true }),
      page.getByRole("button", { name: "Reference", exact: true }),
      themeControl,
    ]) {
      const bounds = (await control.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
      expect(bounds.height).toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
  }
  await setTheme(page, "dark");
  const themeControl = page.locator("#theme-toggle");
  await themeControl.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("button", { name: "Calculator", exact: true }).click();
  const calculator = page.getByRole("dialog", { name: "Programmer calculator" });
  await calculator.getByRole("textbox", { name: "Value A", exact: true }).fill("42");
  await page.getByRole("button", { name: "Reference", exact: true }).click();
  await expect(calculator).not.toBeVisible();
  const reference = page.getByRole("dialog", { name: "Instruction reference", exact: true });
  await expect(reference).toBeVisible();
  await page.getByRole("button", { name: "Calculator", exact: true }).click();
  await expect(reference).toHaveCount(0);
  await expect(calculator.getByRole("textbox", { name: "Value A", exact: true })).toHaveValue("42");
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Reference", exact: true }).click();
  await expect(reference).toHaveAttribute("aria-modal", "true");
  await reference.getByRole("searchbox").press("Shift+Tab");
  expect(await reference.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(reference).toBeVisible();
  await expect(reference).not.toHaveAttribute("aria-modal", "true");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
});

for (const theme of ["light", "dark"] as const) {
  test(`desktop tools leave the wrapped header usable in ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 });
    await page.goto("#/lesson/one-addition");
    const themeControl = page.locator("#theme-toggle");
    await setTheme(page, theme);
    await page.evaluate(() => document.fonts.ready);
    const operation = page.locator("#ix-worked-addition [data-figure='primitive-operation']");
    await operation.getByRole("button", { name: "Run the instruction", exact: true }).click();
    await expect(operation).toHaveAttribute("data-k", "1");
    const calculator = page.getByRole("dialog", { name: "Programmer calculator", exact: true });
    const reference = page.getByRole("dialog", { name: "Instruction reference", exact: true });
    const belowHeader = async (panel: import("@playwright/test").Locator) => {
      await expect(panel).toBeVisible();
      expect(await panel.evaluate((node) => node.matches(":modal"))).toBe(false);
      await expect
        .poll(async () => {
          const header = await page.locator(".shell-header").boundingBox();
          const box = await panel.boundingBox();
          return box!.y - (header!.y + header!.height);
        })
        .toBeGreaterThanOrEqual(11.5);
    };
    for (const width of [768, 834, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.getByRole("button", { name: "Calculator", exact: true }).click();
      await belowHeader(calculator);
      await calculator.getByRole("textbox", { name: "Value A", exact: true }).fill("42");
      // A real pointer must reach the direct action while the tool is open.
      await themeControl.click();
      await expect(page.locator("html")).toHaveAttribute(
        "data-theme",
        theme === "dark" ? "light" : "dark",
      );
      await themeControl.click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(calculator.getByRole("textbox", { name: "Value A", exact: true })).toHaveValue(
        "42",
      );
      await page.getByRole("button", { name: "Reference", exact: true }).click();
      await belowHeader(reference);
      await reference.getByRole("searchbox").fill("add");
      await page.getByRole("button", { name: "Calculator", exact: true }).click();
      await expect(reference).toHaveCount(0);
      await belowHeader(calculator);
      await expect(calculator.getByRole("textbox", { name: "Value A", exact: true })).toHaveValue(
        "42",
      );
      await calculator.getByRole("button", { name: "Close calculator", exact: true }).click();
      await expect(operation).toHaveAttribute("data-k", "1");
    }
  });
}
