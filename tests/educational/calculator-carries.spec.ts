// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { CALCULATOR_CARRIES as F } from "../../packages/views/src/strings.calculator-carries";

for (const theme of ["light", "dark"] as const) {
  test(`optional addition carries stay aligned and fresh in ${theme}`, async ({ page }) => {
    for (const width of [320, 375, 834, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("#/lesson/adding-and-the-flags");
      await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
      await page.getByRole("button", { name: "Calculator", exact: true }).click();
      const panel = page.getByRole("dialog", { name: "Programmer calculator", exact: true });
      const toggle = panel.getByRole("button", { name: F.showCarries, exact: true });
      const scroll = panel.getByRole("region", { name: "Calculation", exact: true });
      const entry = panel.getByLabel("Value to enter", { exact: true });
      const b = panel.getByLabel("Second value", { exact: true });
      const apply = panel.getByRole("button", { name: "Apply", exact: true });
      const calculate = panel.getByRole("button", { name: "Calculate", exact: true });
      const setAddition = async (a: string, second: string) => {
        await entry.fill(a);
        await apply.click();
        await b.fill(second);
        await calculate.click();
      };
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      await expect(panel.locator('[data-row="carry"]')).toHaveCount(0);
      expect(await toggle.getAttribute("aria-controls")).toBe(await scroll.getAttribute("id"));
      await toggle.focus();
      await toggle.press("Space");
      await expect(toggle).toBeFocused();
      await expect(panel.getByText(F.unknown, { exact: true })).toBeVisible();
      await expect(panel.locator("[data-flag]")).toHaveCount(0);
      await setAddition("0x7ffffffe", "0x2");
      await expect(panel.locator("[data-carry-into-sign]")).toHaveText("1");
      await expect(panel.locator("[data-carry-out]")).toHaveText("0");
      await expect(panel.getByText(F.cEquation(0), { exact: true })).toBeVisible();
      await expect(panel.getByText(F.vEquation(1, 0, 1), { exact: true })).toBeVisible();
      await expect(panel.locator('[data-row="carry"] .workspace-cell')).toHaveCount(32);
      await expect(panel.locator('[data-row="carry"] [data-bit="0"]')).toHaveText("0");
      await expect(panel.locator('[data-row="carry"] [data-bit="31"]')).toHaveText("1");
      const aligned = async (bits: number) =>
        scroll.evaluate((n, count) => {
          const rows = [...n.querySelectorAll<HTMLElement>("[data-row]")];
          return Array.from({ length: count }, (_, bit) => {
            const xs = rows.map(
              (row) => row.querySelector(`[data-bit="${bit}"]`)!.getBoundingClientRect().x,
            );
            return Math.max(...xs) - Math.min(...xs);
          });
        }, bits);
      expect(Math.max(...(await aligned(32)))).toBeLessThan(1);
      await panel.getByRole("button", { name: "High bits", exact: true }).click();
      await expect.poll(() => scroll.evaluate((n) => n.scrollLeft)).toBe(0);
      const signCell = panel.locator('[data-row="carry"] [data-sign-bit="true"]');
      const cellBox = (await signCell.boundingBox())!;
      const labelBox = (await panel
        .locator('[data-row="carry"] .workspace-row-label')
        .boundingBox())!;
      const scrollBox = (await scroll.boundingBox())!;
      expect(cellBox.x).toBeGreaterThanOrEqual(labelBox.x + labelBox.width);
      expect(cellBox.x + cellBox.width).toBeLessThanOrEqual(scrollBox.x + scrollBox.width);
      // High bits changes the horizontal position. Reach the row vertically as a learner can.
      await signCell.scrollIntoViewIfNeeded();
      await expect.poll(() => scroll.evaluate((n) => n.scrollLeft)).toBe(0);
      await expect(signCell).toBeInViewport();
      await scroll.evaluate((n) => {
        n.scrollLeft = 137;
      });
      await toggle.click();
      await expect(panel.locator('[data-row="carry"]')).toHaveCount(0);
      await toggle.click();
      await expect.poll(() => scroll.evaluate((n) => n.scrollLeft)).toBe(137);
      await panel.getByRole("button", { name: "Signed", exact: true }).click();
      await expect(panel.locator("[data-flag]")).toHaveCount(0);
      await calculate.click();
      await expect(panel.getByText(F.vEquation(1, 0, 1), { exact: true })).toBeVisible();
      await panel.getByRole("button", { name: "64 bits", exact: true }).click();
      await expect(panel.getByText(F.unknown, { exact: true })).toBeVisible();
      await setAddition("0x8000000000000000", "0x8000000000000000");
      await expect(panel.getByText(F.vEquation(0, 1, 1), { exact: true })).toBeVisible();
      await expect(panel.getByText(F.cEquation(1), { exact: true })).toBeVisible();
      await expect(panel.locator('[data-row="carry"] .workspace-cell')).toHaveCount(64);
      expect(Math.max(...(await aligned(64)))).toBeLessThan(1);
      await setAddition("0xFFFFFFFFFFFFFFFF", "1");
      await expect(panel.getByText(F.vEquation(1, 1, 0), { exact: true })).toBeVisible();
      await expect(panel.getByText(F.matching, { exact: true })).toBeVisible();
      await expect(
        panel
          .getByRole("group", { name: "Retained result", exact: true })
          .locator("[data-pattern]"),
      ).toHaveAttribute("data-pattern", "0");
      await b.fill("invalid");
      await calculate.click();
      await expect(panel.locator("[data-flag]")).toHaveCount(0);
      await expect(panel.getByText(F.unknown, { exact: true })).toBeVisible();
      const operation = panel.getByRole("combobox", { name: "Operation", exact: true });
      for (const op of ["subtract", "shift-left"]) {
        await operation.selectOption(op);
        await expect(toggle).toHaveCount(0);
        await expect(panel.locator('[data-row="carry"], [data-flag]')).toHaveCount(0);
      }
      await operation.selectOption("add");
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      await panel.getByRole("button", { name: "Close calculator", exact: true }).click();
      await page.getByRole("button", { name: "Calculator", exact: true }).click();
      await expect(toggle).toHaveAttribute("aria-pressed", "true");
      expect(await panel.evaluate((n) => n.scrollWidth > n.clientWidth)).toBe(false);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
        false,
      );
      await panel.getByRole("button", { name: "Reset calculator", exact: true }).click();
      await expect(toggle).toHaveAttribute("aria-pressed", "false");
      await expect(panel.locator('[data-row="carry"], [data-flag]')).toHaveCount(0);
      await panel.getByRole("button", { name: "Close calculator", exact: true }).click();
    }
  });
}

test("carry visibility restores while saved carry and flag numbers are ignored", async ({
  page,
}) => {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "assembly-lab:update:views:v1",
      JSON.stringify({
        route: location.href,
        values: {
          $viewState: "map",
          value: [
            [
              "header-calculator::ProgrammerCalculator.global.widths",
              {
                entryNotation: "prefix",
                width: 32,
                reading: "unsigned",
                pattern: "2147483646",
                entry: "pending A",
                operand: "0x2",
                operation: "add",
                showCarries: true,
                carries: "999",
                c: 1,
                v: 0,
                trace: {
                  a: "2147483646",
                  b: "2",
                  width: 32,
                  reading: "unsigned",
                  operation: "add",
                  pattern: "999",
                  full: "999",
                  carries: "999",
                  c: 1,
                  v: 0,
                },
              },
            ],
          ],
        },
      }),
    );
  });
  await page.goto("#/lesson/adding-and-the-flags");
  await page.getByRole("button", { name: "Calculator", exact: true }).click();
  const panel = page.getByRole("dialog", { name: "Programmer calculator", exact: true });
  await expect(panel.getByRole("button", { name: F.showCarries, exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(panel.getByLabel("Value to enter", { exact: true })).toHaveValue("pending A");
  await expect(panel.getByText(F.vEquation(1, 0, 1), { exact: true })).toBeVisible();
  await expect(panel.getByText(F.cEquation(0), { exact: true })).toBeVisible();
  await expect(panel.locator('[data-row="carry"] [data-bit="31"]')).toHaveText("1");
  await expect(panel.locator("[data-carry-out]")).toHaveText("0");
  expect(
    await page.evaluate(() => sessionStorage.getItem("assembly-lab:update:views:v1")),
  ).toBeNull();
});
