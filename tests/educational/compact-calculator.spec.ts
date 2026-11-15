// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { COMPACT_CALCULATOR as D } from "../../packages/views/src/strings.compact-calculator";
import { inspectCalculator } from "./calculator-helpers";

function luminance(color: string) {
  const parts = color
    .match(/[\d.]+/g)!
    .slice(0, 3)
    .map(Number)
    .map((n) => n / 255)
    .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4));
  return parts[0]! * 0.2126 + parts[1]! * 0.7152 + parts[2]! * 0.0722;
}

for (const theme of ["light", "dark"] as const) {
  test(`compact calculator result, reading, flags and error recovery in ${theme}`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [width, height] of [
      [320, 900],
      [375, 667],
      [1280, 900],
    ]) {
      await page.setViewportSize({ width: width!, height: height! });
      await page.goto("#/lesson/adding-and-the-flags");
      // A same-route visit retains the global tool. Each geometry case needs a fresh document.
      await page.reload();
      await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
      await page.getByRole("button", { name: "Calculator", exact: true }).click();
      const panel = page.getByRole("dialog", { name: "Programmer calculator", exact: true });
      const calculate = panel.getByRole("button", { name: "Calculate", exact: true });
      const a = panel.getByRole("textbox", { name: "Value A", exact: true });
      const b = panel.getByRole("textbox", { name: "Value B", exact: true });
      const result = panel.getByRole("group", { name: "Retained result", exact: true });
      await expect(panel.locator(".workspace-inspection")).not.toHaveAttribute("open");
      await expect(panel.locator(".workspace-help-details")).not.toHaveAttribute("open");
      const initial = await calculate.boundingBox();
      expect(initial!.y + initial!.height).toBeLessThanOrEqual(height!);
      await calculate.hover();
      const colours = await calculate.evaluate((node) => ({
        fg: getComputedStyle(node).color,
        bg: getComputedStyle(node).backgroundColor,
      }));
      const [low, high] = [luminance(colours.fg), luminance(colours.bg)].sort((a, b) => a - b);
      expect((high! + 0.05) / (low! + 0.05)).toBeGreaterThanOrEqual(4.5);
      await a.fill("0x7fffffff");
      await b.fill("1");
      await calculate.click();
      await expect(result.locator("[data-pattern]")).toHaveAttribute("data-pattern", "2147483648");
      await expect(result.locator('[data-reading="unsigned"]')).toHaveText("2,147,483,648");
      const order = await panel.evaluate((node) => ({
        result: node.querySelector(".workspace-result")!.getBoundingClientRect().bottom,
        inspection: node.querySelector(".workspace-inspection")!.getBoundingClientRect().top,
      }));
      expect(order.result).toBeLessThanOrEqual(order.inspection);
      await expect(panel.locator("[data-flag]")).toHaveCount(0);
      await panel.getByRole("button", { name: "Signed", exact: true }).click();
      await expect(result.locator('[data-reading="signed"]')).toHaveText("-2,147,483,648");
      await expect(panel.locator(".workspace-exact")).toHaveText("Exact signed sum: 2,147,483,648");
      await expect(panel.locator(".workspace-range")).toContainText("outside the 32-bit range");
      await panel.getByRole("checkbox", { name: D.showFlags }).check();
      for (const [flag, value] of [
        ["n", "1"],
        ["z", "0"],
        ["c", "0"],
        ["v", "1"],
      ])
        await expect(panel.locator(`[data-flag="${flag}"]`)).toHaveAttribute("data-value", value!);
      await panel.getByRole("button", { name: "Unsigned", exact: true }).click();
      await expect(result.locator('[data-reading="unsigned"]')).toHaveText("2,147,483,648");
      await expect(panel.locator('[data-flag="v"]')).toHaveAttribute("data-value", "1");
      await a.fill("0x100000000");
      await calculate.click();
      await expect(a).toBeFocused();
      await expect(a).toHaveValue("0x100000000");
      await expect(result).toHaveCount(0);
      const error = panel.getByRole("alert");
      await expect(error).toContainText("more than 32 bits");
      const geometry = await error.evaluate((node) => ({
        error: node.getBoundingClientRect().toJSON(),
        heading: node
          .closest("dialog")!
          .querySelector(".header-calculator-heading")!
          .getBoundingClientRect()
          .toJSON(),
        panel: node.closest("dialog")!.getBoundingClientRect().toJSON(),
      }));
      expect(geometry.error.y).toBeGreaterThanOrEqual(geometry.heading.bottom);
      expect(geometry.error.bottom).toBeLessThanOrEqual(geometry.panel.bottom);
      await panel.getByRole("button", { name: "64 bits", exact: true }).click();
      await expect(a).toHaveValue("0x100000000");
      await expect(panel.locator(".workspace-feedback")).toContainText(
        "Previously invalid entries were kept unchanged",
      );
      await calculate.click();
      await expect(result.locator('[data-reading="unsigned"]')).toHaveText("4,294,967,297");
      await panel.getByRole("button", { name: "32 bits", exact: true }).click();
      await a.fill("0");
      await b.fill("1");
      await panel
        .getByRole("combobox", { name: "Operation", exact: true })
        .selectOption("subtract");
      await calculate.click();
      await expect(result.locator("[data-pattern]")).toHaveAttribute("data-pattern", "4294967295");
      await expect(panel.locator('[data-flag="c"]')).toHaveAttribute("data-value", "0");
      await expect(panel.getByText(D.cSubLabel, { exact: true })).toBeVisible();
      await expect(panel.locator(".workspace-range")).toContainText("outside the 32-bit range");
      await inspectCalculator(panel);
      await panel.getByRole("button", { name: D.editBits, exact: true }).click();
      await panel.getByRole("button", { name: "Bit 0", exact: true }).click();
      await expect(result).toHaveCount(0);
      await expect(panel.locator("[data-flag]")).toHaveCount(0);
      await panel.getByRole("button", { name: "Close calculator", exact: true }).click();
    }
    expect(errors).toEqual([]);
  });
}
