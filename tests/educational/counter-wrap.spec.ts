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
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText(S.pendingCarry);
    await expect(wrap.locator('[data-reading="decimal"]')).toHaveText("13");
    await expect(wrap.locator('[data-reading="sum"]')).toHaveCount(0);
    await expect(wrap.locator(".al-counter-wrap-split > code")).toHaveCount(0);
    const bitsBox = await wrap.locator('[data-reading="stored"]').boundingBox();
    const decimalBox = await wrap.locator('[data-reading="decimal"]').boundingBox();
    expect(decimalBox!.y).toBeGreaterThan(bitsBox!.y + bitsBox!.height);
    expect(
      Math.abs(decimalBox!.x + decimalBox!.width / 2 - bitsBox!.x - bitsBox!.width / 2),
    ).toBeLessThan(1);
    await expect(wrap).toContainText("keeps only 4 bits");
    await expect(wrap).toContainText("32-bit registers");
    await expect(ring.locator(".al-locked")).toBeVisible();
    const advance = wrap.getByRole("button", { name: S.advanceLabel });
    const previous = wrap.getByRole("button", { name: S.previousLabel });
    await expect(previous).toBeEnabled();
    await advance.focus();
    const control = await advance.boundingBox();
    expect(control!.y + control!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    await page.keyboard.press("Enter");
    await expect(wrap.locator('[data-reading="decimal"]')).toHaveText("14");
    await expect(wrap.locator('[data-reading="stored"]')).toHaveText("1110");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText("0");
    await expect(advance).toBeEnabled();
    expect(Math.abs((await advance.boundingBox())!.y - control!.y)).toBeLessThan(1);
    await page.keyboard.press("Space");
    await expect(wrap.locator('[data-reading="decimal"]')).toHaveText("15");
    await expect(wrap.locator('[data-reading="stored"]')).toHaveText("1111");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText("0");
    await expect(advance).toBeEnabled();
    expect(Math.abs((await advance.boundingBox())!.y - control!.y)).toBeLessThan(1);
    await page.keyboard.press("Enter");
    await expect(wrap.locator('[data-reading="decimal"]')).toHaveText("0");
    await expect(wrap.locator('[data-reading="stored"]')).toHaveText("0000");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText("1");
    await expect(advance).toBeEnabled();
    await expect(advance).toBeFocused();
    expect(Math.abs((await advance.boundingBox())!.y - control!.y)).toBeLessThan(1);
    await expect(wrap.locator('[data-reading="marker-label"]')).toHaveText(S.carryLabel);
    const display = await wrap.locator(".al-counter-wrap-split").boundingBox();
    expect(display!.y + display!.height).toBeLessThan(control!.y);
    await previous.focus();
    await page.keyboard.press("Space");
    await expect(wrap.locator('[data-reading="stored"]')).toHaveText("1111");
    await expect(wrap.locator('[data-reading="decimal"]')).toHaveText("15");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText("1");
    await expect(wrap.locator('[data-reading="marker-label"]')).toHaveText(S.borrowLabel);
    await expect(wrap.locator('[data-reading="explanation"]')).toHaveText(S.backwardWrapped(4, 16));
    expect(Math.abs((await previous.boundingBox())!.y - control!.y)).toBeLessThan(1);
    await advance.focus();
    await page.keyboard.press("Enter");
    await expect(wrap.locator('[data-reading="decimal"]')).toHaveText("0");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText("1");
    for (let step = 0; step < 16; step++) await advance.click();
    await expect(wrap.locator('[data-reading="decimal"]')).toHaveText("0");
    await expect(wrap.locator(".al-counter-wrap-trail code")).toHaveCount(5);
    for (let step = 0; step < 16; step++) await previous.click();
    await expect(wrap.locator('[data-reading="decimal"]')).toHaveText("0");
    await expect(wrap.locator('[data-reading="marker-label"]')).toHaveText(S.borrowLabel);
    expect(Math.abs((await previous.boundingBox())!.y - control!.y)).toBeLessThan(1);
    await expect(ring.locator(".al-locked")).toBeVisible();
    const prediction = page.locator("#ix-predict-elapsed");
    await prediction.getByRole("radio", { name: /^2000$/ }).check();
    await prediction.getByRole("button", { name: V.prediction.commit }).click();
    await expect(ring.locator('[data-reading="elapsed-summary"]')).toContainText("2000");
    await page.reload();
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText("0");
    await expect(wrap.locator('[data-reading="marker-label"]')).toHaveText(S.borrowLabel);
    await wrap.getByRole("button", { name: S.reset, exact: true }).click();
    await expect(wrap.locator('[data-reading="stored"]')).toHaveText("1101");
    await expect(wrap.locator('[data-reading="decimal"]')).toHaveText("13");
    await expect(wrap.locator('[data-reading="carry"]')).toHaveText(S.pendingCarry);
    await expect(previous).toBeEnabled();
    await expect(prediction.getByRole("radio", { name: /^2000$/ })).toBeChecked();
    await expect(ring.locator('[data-reading="elapsed-summary"]')).toContainText("2000");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });

for (const theme of ["light", "dark"])
  test(`controls stay below the changing result at 320px in ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("#/lesson/subtracting-and-the-tick-counter");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    const wrap = page.locator("#ix-counter-wrap");
    const plus = wrap.getByRole("button", { name: S.advanceLabel });
    const minus = wrap.getByRole("button", { name: S.previousLabel });
    await plus.focus();
    const baseline = (await plus.boundingBox())!.y;
    for (let step = 0; step < 20; step++) {
      await plus.click();
      expect(Math.abs((await plus.boundingBox())!.y - baseline)).toBeLessThan(1);
    }
    for (let step = 0; step < 20; step++) {
      await minus.click();
      expect(Math.abs((await minus.boundingBox())!.y - baseline)).toBeLessThan(1);
      const result = (await wrap.locator(".al-counter-wrap-split").boundingBox())!;
      expect(result.y + result.height).toBeLessThan(baseline);
    }
    await expect(wrap.locator('[data-reading="decimal"]')).toHaveText("13");
    const actual = await page
      .locator("body")
      .evaluate((node) => getComputedStyle(node).backgroundColor);
    expect(actual).toBe(theme === "light" ? "rgb(247, 250, 248)" : "rgb(16, 27, 26)");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
