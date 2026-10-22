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
      await openLesson(page, "one-pattern-three-readings");
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
      // Later hints are independently reachable: they must not disclose this prediction.
      const make = page.locator('[data-challenge="make-minus-one"]');
      for (let i = 0; i < 3; i++) await make.getByRole("button", { name: /Show hint/ }).click();
      await expect(make).toContainText("positive values add to −12");
      await expect(make).not.toContainText("adding 12 to it gives 0");
      await expect(page.locator("#ix-step-add-12 .al-locked")).toBeVisible();
      await commit(page, "predict-add-12", "24");
      await expect(page.locator("#ix-predict-add-12 .al-outcome")).toContainText("w0 holding 0");
      await expect(page.locator("#ix-step-add-12 .al-locked")).toHaveCount(0);
      const details = page.locator("#ix-read-register details");
      await expect(details).not.toHaveAttribute("open", "");
      await details.getByText(M1.reader.showCalculation, { exact: true }).click();
      await expect(details).toHaveAttribute("open", "");
      expect(await designProblems(page, width < 500)).toEqual([]);
    });
  }
}
