// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { COUNTER_WRAP_STRINGS as S } from "../../packages/views/src/strings.counter-wrap";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";

for (const theme of ["light", "dark"])
  test(`counter wrap can be advanced, restored and reset in ${theme}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("#/lesson/subtracting-and-the-tick-counter");
    await page.locator("select").first().selectOption(theme);
    const bridge = page.locator("#ix-counter-wrap");
    await expect(bridge.locator(".al-locked")).toBeVisible();
    const prediction = page.locator("#ix-predict-elapsed");
    await prediction.getByRole("radio", { name: /^2000$/ }).check();
    await prediction.getByRole("button", { name: V.prediction.commit }).click();
    await expect(bridge.getByRole("heading", { name: S.title })).toBeVisible();
    await expect(bridge.locator('[data-reading="pattern"]')).toHaveText("1110");
    const advance = bridge.getByRole("button", { name: S.advance });
    await advance.focus();
    await page.keyboard.press("Enter");
    await expect(bridge.locator('[data-reading="decimal"]')).toHaveText("15");
    await page.keyboard.press("Space");
    await expect(bridge.locator('[data-reading="stored"]')).toHaveText("0000");
    await expect(bridge.locator('[data-reading="carry"]')).toHaveText("1");
    await page.keyboard.press("Enter");
    await expect(bridge).toContainText(S.elapsedAssumption(16));
    await expect(bridge.locator('[data-reading="decimal"]')).toHaveText("1");
    await expect(advance).toBeDisabled();
    await page.reload();
    await expect(bridge.locator('[data-reading="ticks"]')).toHaveText("3");
    await bridge.getByRole("button", { name: S.reset, exact: true }).click();
    await expect(bridge.locator('[data-reading="pattern"]')).toHaveText("1110");
    await expect(bridge.locator('[data-reading="carry"]')).toHaveCount(0);
    await expect(prediction.getByRole("radio", { name: /^2000$/ })).toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });
