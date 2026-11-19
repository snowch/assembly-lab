// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { COUNTER_WRAP_STRINGS as S } from "../../packages/views/src/strings.counter-wrap";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";

for (const theme of ["light", "dark"])
  test(`the wrap precedes subtraction and preserves independent work in ${theme}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("#/lesson/subtracting-and-the-tick-counter");
    await page.locator("select").first().selectOption(theme);
    const wrap = page.locator("#ix-counter-wrap");
    const ring = page.locator("#ix-counter-ring");
    await expect(wrap.locator('[data-reading="stored"]')).toHaveText("1101");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveCount(0);
    await expect(wrap).toContainText("keeps only 4 bits");
    await expect(wrap).toContainText("32-bit registers");
    await expect(ring.locator(".al-locked")).toBeVisible();
    const advance = wrap.getByRole("button", { name: S.advance });
    await advance.focus();
    const control = await advance.boundingBox();
    expect(control!.y + control!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    await page.keyboard.press("Enter");
    await expect(wrap.locator('[data-reading="sum"]')).toHaveText("13 + 1 = 14");
    await expect(wrap.locator('[data-reading="stored"]')).toHaveText("1110");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText("0");
    await expect(advance).toBeEnabled();
    expect(Math.abs((await advance.boundingBox())!.y - control!.y)).toBeLessThan(1);
    await page.keyboard.press("Space");
    await expect(wrap.locator('[data-reading="sum"]')).toHaveText("14 + 1 = 15");
    await expect(wrap.locator('[data-reading="stored"]')).toHaveText("1111");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText("0");
    await expect(advance).toBeEnabled();
    expect(Math.abs((await advance.boundingBox())!.y - control!.y)).toBeLessThan(1);
    await page.keyboard.press("Enter");
    await expect(wrap.locator('[data-reading="sum"]')).toHaveText("15 + 1 = 16");
    await expect(wrap.locator('[data-reading="stored"]')).toHaveText("0000");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText("1");
    await expect(advance).toBeDisabled();
    await expect(advance).toBeFocused();
    expect(Math.abs((await advance.boundingBox())!.y - control!.y)).toBeLessThan(1);
    await expect(ring.locator(".al-locked")).toBeVisible();
    const prediction = page.locator("#ix-predict-elapsed");
    await prediction.getByRole("radio", { name: /^2000$/ }).check();
    await prediction.getByRole("button", { name: V.prediction.commit }).click();
    await expect(ring.locator('[data-reading="elapsed-summary"]')).toContainText("2000");
    await page.reload();
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText("1");
    await wrap.getByRole("button", { name: S.reset, exact: true }).click();
    await expect(wrap.locator('[data-reading="stored"]')).toHaveText("1101");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveCount(0);
    await expect(prediction.getByRole("radio", { name: /^2000$/ })).toBeChecked();
    await expect(ring.locator('[data-reading="elapsed-summary"]')).toContainText("2000");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });
