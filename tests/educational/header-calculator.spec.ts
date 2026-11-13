// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`header calculator in ${theme}: scratch work, focus and lesson isolation`, async ({
    page,
  }) => {
    await page.goto("#/lesson/adding-and-the-flags");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    const trigger = page.getByRole("button", { name: "Calculator", exact: true });
    await trigger.click();
    const panel = page.getByRole("dialog", { name: "Programmer calculator" });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("button", { name: "Close calculator" })).toBeFocused();
    await expect(panel.getByText("Try a short task", { exact: true })).toHaveCount(0);
    await expect(panel.getByRole("link")).toHaveCount(0);
    await panel.getByLabel("Value to enter", { exact: true }).fill("4294967295");
    await panel.getByRole("button", { name: "Apply", exact: true }).click();
    await panel.getByRole("button", { name: "Signed", exact: true }).click();
    await expect(panel.locator('output[data-reading="signed"]')).toHaveText("-1");
    await panel.getByRole("button", { name: "64 bits", exact: true }).click();
    await expect(panel.locator('output[data-reading="signed"]')).toHaveText("4,294,967,295");
    await panel.getByLabel("Second value", { exact: true }).fill("1");
    await panel.getByRole("button", { name: "Calculate", exact: true }).click();
    await expect(panel.locator('output[data-reading="signed"]')).toHaveText("4,294,967,296");
    await panel.getByLabel("Shift amount in bits", { exact: true }).fill("1");
    await panel.getByRole("button", { name: "Shift left", exact: true }).click();
    await expect(panel.locator('output[data-reading="signed"]')).toHaveText("8,589,934,592");
    await panel.getByRole("button", { name: "Close calculator" }).click();
    await expect(panel).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(panel.locator('output[data-reading="signed"]')).toHaveText("8,589,934,592");
    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible();
    await expect(trigger).toBeFocused();
    // A client-side route change retains the global workspace; no answer artifact is written.
    const stored = await page.evaluate(() =>
      localStorage.getItem("assembly-lab:v1:adding-and-the-flags"),
    );
    await page.evaluate(() => {
      location.hash = "#/lesson/one-addition";
    });
    await expect(
      page.getByRole("heading", { name: "One addition", exact: true }).first(),
    ).toBeVisible();
    await trigger.click();
    await expect(panel.locator('output[data-reading="signed"]')).toHaveText("8,589,934,592");
    await expect(panel.getByRole("button", { name: "64 bits", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      await page.evaluate(() => localStorage.getItem("assembly-lab:v1:adding-and-the-flags")),
    ).toBe(stored);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    const box = await panel.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    await panel.getByRole("button", { name: "Reset calculator", exact: true }).click();
    await expect(panel.locator('output[data-reading="unsigned"]')).toHaveText("0");
    await expect(panel.getByRole("button", { name: "32 bits", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
}

test("phone modal traps focus and changing to desktop keeps work", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("#/");
  await page.getByRole("button", { name: "Calculator", exact: true }).click();
  const panel = page.getByRole("dialog", { name: "Programmer calculator" });
  await expect(panel).toHaveAttribute("aria-modal", "true");
  await panel.getByRole("button", { name: "Close calculator" }).press("Shift+Tab");
  expect(await panel.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await panel.getByLabel("Value to enter", { exact: true }).fill("42");
  await panel.getByRole("button", { name: "Apply", exact: true }).click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(panel).toBeVisible();
  await expect(panel).not.toHaveAttribute("aria-modal", "true");
  await expect(panel.locator('output[data-reading="unsigned"]')).toHaveText("42");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});
