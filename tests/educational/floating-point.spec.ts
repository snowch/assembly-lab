// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { watchErrors } from "./module1";
import { designProblems } from "./design";

for (const theme of ["light", "dark"] as const) {
  for (const mode of ["bits", "rounding", "arm", "conversions"] as const) {
    test(`floating-point ${mode} remains clear and usable in ${theme}`, async ({
      page,
      context,
      isMobile,
    }) => {
      const errors = watchErrors(page);
      await page.goto(`#/lesson/floating-point-${mode}`);
      await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expect(page.locator(".interactive-problem")).toHaveCount(0);
      await context.setOffline(true);
      const check = page.locator('[data-figure="floating-point-check"]');
      await expect(check.locator("output")).toHaveCount(0);
      await check.getByRole("button", { name: "Check answer", exact: true }).click();
      await expect(check.locator('[role="status"]')).toContainText(
        "Answer the question before checking.",
      );
      if (mode === "bits" || mode === "rounding") {
        const explorer = page.locator('[data-figure="floating-point"]');
        await expect(explorer.getByRole("button", { name: /^Bit / })).toHaveCount(32);
        const entry = explorer.getByLabel("Enter a decimal value", { exact: true });
        if (mode === "bits") {
          await expect(explorer.locator(".al-fp-values").first()).toContainText("9.5");
          await explorer
            .getByRole("button", { name: "Bit 31, Sign, value 0", exact: true })
            .click();
          await expect(explorer.locator(".al-fp-values").first()).toContainText("-9.5");
          await entry.fill("-0");
          await entry.press("Enter");
          await expect(explorer).toContainText("Kind of value: Zero");
          await explorer.getByLabel("Format", { exact: true }).selectOption("64");
          await expect(explorer.getByRole("button", { name: /^Bit / })).toHaveCount(64);
          await entry.fill("1e-310");
          await entry.press("Enter");
          await expect(explorer).toContainText("Kind of value: Subnormal");
          await check.getByLabel(/^Write the binary value/).fill("101.01");
          await check.getByLabel(/^A normal binary32 value/).fill("-2");
          await check.getByLabel(/^A binary32 pattern/).selectOption("subnormal");
        } else {
          await explorer.locator("details").first().locator("summary").click();
          await expect(explorer).toContainText("12.3500003814697265625");
          await explorer.getByLabel("Format", { exact: true }).selectOption("64");
          // Widening current storage must not silently re-encode the pending input.
          await expect(explorer).toContainText("12.3500003814697265625");
          await explorer.getByRole("button", { name: "Apply value", exact: true }).click();
          await expect(explorer).toContainText(
            "12.3499999999999996447286321199499070644378662109375",
          );
          await explorer.getByRole("button", { name: "Reset example", exact: true }).click();
          await entry.fill("16777216");
          await entry.press("Enter");
          await explorer
            .getByRole("button", { name: "Add 1 to the stored value", exact: true })
            .click();
          await expect(explorer.locator(".al-fp-rounding")).toContainText("16777217");
          await expect(explorer.locator(".al-fp-rounding")).toContainText("16777216");
          await entry.fill("NaN");
          await entry.press("Enter");
          await expect(
            explorer.getByRole("button", { name: "Step to next larger value", exact: true }),
          ).toBeDisabled();
          await expect(explorer.locator(".al-fp-rounding")).toContainText(
            "has no place in numeric order",
          );
          await check.getByLabel(/^Round the exact number/).fill("16777220");
        }
        await entry.fill("nonsense");
        await entry.press("Enter");
        await expect(explorer.getByRole("alert")).toBeVisible();
        await explorer.getByRole("button", { name: "Reset example", exact: true }).click();
        await expect(explorer.getByRole("alert")).toHaveCount(0);
        await expect(explorer.getByRole("button", { name: /^Bit / })).toHaveCount(32);
      } else {
        const native = page.locator('[data-figure="floating-point-native"]');
        await expect(native).toContainText("checked recordings");
        await expect(native.locator(".al-fp-recorded-result")).toHaveCount(0);
        const choose = native.getByLabel("Recorded example", { exact: true });
        const ids = await choose
          .locator("option")
          .evaluateAll((options) => options.map((option) => (option as HTMLOptionElement).value));
        for (const id of ids) {
          await choose.selectOption(id);
          await expect(native.locator(".al-fp-recorded-result")).toHaveCount(0);
          await native.getByRole("button", { name: "Show recorded result", exact: true }).click();
          await expect(native.locator(".al-fp-recorded-result")).toBeVisible();
          await expect(native.locator(".al-listing")).toHaveCount(1);
          await native.getByRole("button", { name: "Hide recorded result", exact: true }).click();
          await expect(native.locator(".al-fp-recorded-result")).toHaveCount(0);
        }
        if (mode === "arm") await check.getByLabel(/^Two independent calls/).selectOption("double");
        else {
          await check.getByLabel(/^Convert the finite float/).fill("-6");
          await check.getByLabel(/^For the same binary32 input/).selectOption("fmov");
        }
      }
      await check.getByRole("button", { name: "Check answer", exact: true }).click();
      await expect(check.locator('[role="status"]')).toContainText(
        "That matches the computed result.",
      );
      expect(await designProblems(page, isMobile)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}
