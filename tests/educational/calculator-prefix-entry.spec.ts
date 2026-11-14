// Copyright © 2026 Christopher Snow

import { expect, test, type Locator, type Page } from "@playwright/test";
import { CALCULATOR_ENTRY as E } from "../../packages/views/src/strings.calculator-entry";

async function paste(page: Page, input: Locator, text: string) {
  await page.evaluate((value) => navigator.clipboard.writeText(value), text);
  await input.focus();
  await input.press("ControlOrMeta+A");
  await input.press("ControlOrMeta+V");
  await expect(input).toHaveValue(text);
}

for (const theme of ["light", "dark"] as const) {
  test(`prefix clipboard entry and width mismatches in ${theme}`, async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    for (const width of [320, 375, 834, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("#/lesson/adding-and-the-flags");
      await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
      await page.getByRole("button", { name: "Calculator", exact: true }).click();
      const panel = page.getByRole("dialog", { name: "Programmer calculator", exact: true });
      await expect(panel.getByRole("combobox")).toHaveCount(1);
      await expect(panel.getByText(E.notationHint, { exact: true })).toHaveCount(2);
      const a = panel.getByRole("group", { name: "Value A", exact: true });
      const result = panel.getByRole("group", { name: "Retained result", exact: true });
      const entry = panel.getByLabel("Value to enter", { exact: true });
      const b = panel.getByLabel("Second value", { exact: true });
      const apply = panel.getByRole("button", { name: "Apply", exact: true });
      const calculate = panel.getByRole("button", { name: "Calculate", exact: true });
      await paste(page, entry, "0x7ffffffe");
      await apply.click();
      await expect(a.locator("[data-pattern]")).toHaveAttribute("data-pattern", "2147483646");
      await paste(page, b, "0b10");
      await calculate.click();
      await expect(result.locator("[data-pattern]")).toHaveAttribute("data-pattern", "2147483648");
      await panel.getByRole("button", { name: "Signed", exact: true }).click();
      await panel.getByRole("button", { name: "64 bits", exact: true }).click();
      await paste(page, entry, "0xFFFF FFFF");
      await apply.click();
      await expect(a.locator('output[data-reading="signed"]')).toHaveText("4,294,967,295");
      await paste(page, b, "0B" + "1".repeat(32));
      await calculate.click();
      await expect(result.locator("[data-pattern]")).toHaveAttribute("data-pattern", "8589934590");
      await expect(panel.getByRole("button", { name: "64 bits", exact: true })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await paste(page, entry, "0xFFFFFFFFFFFFFFFF");
      await apply.click();
      await expect(a.locator('output[data-reading="signed"]')).toHaveText("-1");
      await panel.getByRole("button", { name: "32 bits", exact: true }).click();
      await expect(entry).toHaveValue("0xFFFFFFFFFFFFFFFF");
      await apply.click();
      await expect(panel.getByText(E.patternRangeError(32), { exact: true })).toBeVisible();
      await expect(a.locator("[data-pattern]")).toHaveAttribute("data-pattern", "4294967295");
      await expect(panel.getByRole("button", { name: "32 bits", exact: true })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      await paste(page, entry, "0x00000000FFFFFFFF");
      await apply.click();
      await expect(entry).not.toHaveAttribute("aria-invalid", "true");
      await paste(page, b, "0b" + "1".repeat(64));
      await calculate.click();
      await expect(b).toHaveAttribute("aria-invalid", "true");
      await expect(panel.getByText(E.patternRangeError(32), { exact: true })).toBeVisible();
      await expect(result).toHaveCount(0);
      await paste(page, b, "0b" + "0".repeat(32) + "1".repeat(32));
      await calculate.click();
      await expect(result.locator("[data-pattern]")).toHaveAttribute("data-pattern", "4294967294");
      await expect(panel.locator(".workspace-exact")).toHaveText("Full mathematical result: -2");
      await paste(page, entry, "1010");
      await entry.press("Enter");
      await expect(a.locator("[data-pattern]")).toHaveAttribute("data-pattern", "1010");
      await paste(page, b, "0X0000 0001");
      await b.press("Enter");
      await expect(result.locator("[data-pattern]")).toHaveAttribute("data-pattern", "1011");
      await paste(page, b, "0b2");
      await calculate.click();
      await expect(panel.getByText(E.binaryError, { exact: true })).toBeVisible();
      await expect(result).toHaveCount(0);
      await paste(page, entry, "0xFFFFFFFFFFFFFFFF");
      await panel.getByRole("button", { name: "Close calculator", exact: true }).click();
      await page.getByRole("button", { name: "Calculator", exact: true }).click();
      await expect(entry).toHaveValue("0xFFFFFFFFFFFFFFFF");
      expect(await panel.evaluate((n) => n.scrollWidth > n.clientWidth)).toBe(false);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
        false,
      );
      await panel.getByRole("button", { name: "Close calculator", exact: true }).click();
    }
  });
}

test("legacy selected-hex drafts and their result survive the prefix-entry update", async ({
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
                width: 32,
                reading: "unsigned",
                pattern: "7",
                format: "hex",
                entry: "7ffffffe",
                operandFormat: "hex",
                operand: "0b10",
                operation: "add",
                trace: {
                  a: "7",
                  b: "2832",
                  width: 32,
                  reading: "unsigned",
                  operation: "add",
                  pattern: "999",
                  full: "999",
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
  await expect(panel.getByLabel("Value to enter", { exact: true })).toHaveValue("0x7ffffffe");
  await expect(panel.getByLabel("Second value", { exact: true })).toHaveValue("0x0b10");
  await expect(
    panel.getByRole("group", { name: "Value A", exact: true }).locator("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "7");
  await expect(
    panel.getByRole("group", { name: "Retained result", exact: true }).locator("[data-pattern]"),
  ).toHaveAttribute("data-pattern", "2839");
  await expect(panel.locator(".workspace-exact")).toHaveText("Full mathematical result: 2,839");
  expect(
    await page.evaluate(() => sessionStorage.getItem("assembly-lab:update:views:v1")),
  ).toBeNull();
});
