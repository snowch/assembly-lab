// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";

import { MODULE1_STRINGS as M1 } from "../../packages/views/src/strings.module1";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { commit, openLesson, registerValue } from "./module1";
import { designProblems } from "./design";

// The viewport matrix includes phones even in the desktop project; enable the shared tap helper.
test.use({ hasTouch: true });

// Check both phone widths explicitly, independently of the project viewport. The first figure
// must never put a result beside a before-state, including after Back and Reset.
for (const width of [360, 375, 1280]) {
  for (const theme of ["light", "dark"] as const) {
    test(`subtraction stages and prediction gate at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((value) => {
        localStorage.setItem("assembly-lab:v1:theme", value);
      }, theme);
      await openLesson(page, "arithmetic-on-register-bits");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const figure = page.locator("#ix-run-fuel-used");
      const phase = figure.locator(".al-reading-phase");
      await expect(phase).toHaveText(M1.opener.before);
      await expect(figure.locator(".al-reading-inputs")).toContainText("at_start → w0 = 50");
      await expect(figure.locator(".al-reading-inputs")).toContainText("at_end → w1 = 38");
      await expect(figure.locator(".al-reading-operation")).toContainText("w1 (38) − w0 (50)");
      await expect(figure.locator(".al-dual-reading")).toHaveCount(0);
      await expect(registerValue(figure, "w0")).toHaveText("50");
      const next = figure.getByRole("button", { name: V.stepper.next, exact: true });
      await next.click();
      await expect(phase).toHaveText(M1.opener.after);
      await expect(figure.locator(".al-reading-inputs")).toHaveCount(0);
      await expect(figure.locator('[data-reading="signed"]')).toHaveText("−12");
      await expect(figure.locator('[data-reading="unsigned"]')).toHaveText("4294967284");
      await expect(figure.locator(".al-dual-reading")).toContainText(M1.opener.sameBits);
      await expect(registerValue(figure, "w0")).toHaveText("4294967284");
      await next.click(); // ret must keep the same readings.
      await expect(figure.locator('[data-reading="signed"]')).toHaveText("−12");
      await figure.getByRole("button", { name: V.stepper.back, exact: true }).click();
      await expect(phase).toHaveText(M1.opener.after);
      await figure.getByRole("button", { name: V.stepper.reset, exact: true }).click();
      await expect(phase).toHaveText(M1.opener.before);
      await expect(figure.locator(".al-dual-reading")).toHaveCount(0);
      await expect(registerValue(figure, "w0")).toHaveText("50");
      await expect(page.locator("#ix-step-add-12 .al-locked")).toBeVisible();
      await expect(page.locator("#ix-predict-add-12 .al-outcome")).toHaveCount(0);
      await commit(page, "predict-add-12", "24");
      await expect(page.locator("#ix-predict-add-12 .al-outcome")).toContainText("w0 holding 0");
      await expect(page.locator("#ix-step-add-12 .al-locked")).toHaveCount(0);
      await openLesson(page, "same-bits-two-readings");
      const unsigned = page.locator("#ix-reading-unsigned");
      const signed = page.locator("#ix-reading-signed");
      await expect(unsigned.locator('[data-sum="unsigned"]')).toHaveText([
        "0 + 0 + 2 + 1 = 3",
        "8 + 0 + 2 + 1 = 11",
      ]);
      await expect(signed.locator('[data-sum="signed"]')).toHaveText("−8 + 0 + 2 + 1 = −5");
      await expect(unsigned.locator('[data-sum="unsigned"]').first()).toBeVisible();
      await expect(signed.locator('[data-sum="signed"]')).toBeVisible();
      await expect(page.locator("#ix-reading-bridge")).toContainText(
        "−2,147,483,648 + 0 = −2,147,483,648",
      );
      const transfer = page.locator('[data-reading-task="transfer"]');
      await expect(transfer.locator("[data-feedback]")).toHaveCount(0);
      await expect(transfer).not.toContainText("2,147,483,650");
      await transfer
        .getByRole("textbox", { name: "Unsigned reading", exact: true })
        .fill("2,147,483,650");
      await transfer
        .getByRole("textbox", { name: "Signed reading", exact: true })
        .fill("−2,147,483,646");
      await transfer
        .locator('[name="reason"]')
        .fill("Changing the interpretation leaves every stored bit unchanged.");
      await transfer
        .locator('[name="cleared"]')
        .fill("Clearing bit 31 makes its contribution zero while its weight stays the same.");
      await transfer.getByRole("button", { name: "Check readings", exact: true }).click();
      await expect(transfer.getByRole("status")).toContainText("Both readings match the model.");
      await expect(transfer.getByRole("status")).toContainText(
        "Only your numeric readings are checked automatically.",
      );
      expect(await designProblems(page, width < 500)).toEqual([]);
    });
  }
}

for (const width of [375, 1280]) {
  for (const theme of ["light", "dark"] as const) {
    test(`hexadecimal before numerical readings at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem("assembly-lab:v1:theme", value),
        theme,
      );
      await openLesson(page, "one-pattern-three-readings");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const reader = page.locator("#ix-read-register");
      await expect(
        reader.locator('[data-reading="signed"], [data-reading="unsigned"]'),
      ).toHaveCount(0);
      await expect(reader.locator('[data-reading="hex"] code')).toHaveText("0xfffffff4");
      await reader.getByRole("textbox", { name: M1.hexEntry.label }).fill("0xf4");
      await expect(reader.locator('[data-reading="hex"] code')).toHaveText("0x000000f4");
      await expect(reader.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(5);
      await reader.locator('[data-bit="0"]').click();
      await expect(reader.locator('[data-reading="hex"] code')).toHaveText("0x000000f5");
      await reader.getByRole("button", { name: M1.reader.clearBits }).click();
      await expect(reader.locator('[data-reading="hex"] code')).toHaveText("0x00000000");
      expect(await designProblems(page, width < 500)).toEqual([]);
    });
  }
}
