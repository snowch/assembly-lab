// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { COUNTER_WRAP_STRINGS as S } from "../../packages/views/src/strings.counter-wrap";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";

for (const theme of ["light", "dark"])
  test(`forward wrap starts at zero and optional borrow is independent in ${theme}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("#/lesson/subtracting-and-the-tick-counter");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    const wrap = page.locator("#ix-counter-wrap");
    const forward = wrap.locator('[data-counter-pane="forward"]');
    const borrow = wrap.locator('[data-counter-pane="borrow"]');
    const details = wrap.locator("details");
    const bits = forward.locator('[data-reading="stored"]');
    const decimal = forward.locator('[data-reading="decimal"]');
    const marker = forward.locator('[data-reading="carry"]');
    const plus = forward.getByRole("button", { name: S.advanceLabel });
    await expect(details).not.toHaveAttribute("open");
    await expect(borrow).not.toBeVisible();
    await expect(bits).toHaveText("0000");
    await expect(decimal).toHaveText("0");
    await expect(marker).toHaveText(S.pendingCarry);
    await expect(forward.locator('[data-reading="marker-label"]')).toHaveText(
      "Carry flag C after adds",
    );
    await expect(forward).not.toContainText("Borrow");
    await expect(forward.getByRole("button")).toHaveCount(2);
    await plus.focus();
    const baseline = (await plus.boundingBox())!.y;
    for (let step = 1; step <= 16; step++) {
      await page.keyboard.press(step % 2 ? "Enter" : "Space");
      await expect(decimal).toHaveText(String(step % 16));
      await expect(marker).toHaveText(step === 16 ? "1" : "0");
      await expect(plus).toBeFocused();
      expect(Math.abs((await plus.boundingBox())!.y - baseline)).toBeLessThan(1);
    }
    const display = (await forward.locator(".al-counter-wrap-split").boundingBox())!;
    expect(display.y + display.height).toBeLessThan(baseline);
    const bitsBox = (await bits.boundingBox())!;
    const decimalBox = (await decimal.boundingBox())!;
    expect(decimalBox.y).toBeGreaterThan(bitsBox.y + bitsBox.height);
    const prediction = page.locator("#ix-predict-elapsed");
    await prediction.getByRole("radio", { name: /^2000$/ }).check();
    await prediction.getByRole("button", { name: V.prediction.commit }).click();
    await expect(page.locator('#ix-counter-ring [data-reading="elapsed-summary"]')).toContainText(
      "2000",
    );
    await details.locator("summary").click();
    const minus = borrow.getByRole("button", { name: S.previousLabel });
    await minus.focus();
    const lowerBaseline = (await minus.boundingBox())!.y;
    await page.keyboard.press("Enter");
    await expect(borrow.locator('[data-reading="borrow-stored"]')).toHaveText("1111");
    await expect(borrow.locator('[data-reading="borrow-decimal"]')).toHaveText("15");
    await expect(borrow.locator('[data-reading="borrow-carry"]')).toHaveText("0");
    await expect(borrow.locator('[data-reading="borrow-marker-label"]')).toHaveText(
      "Carry flag C after subs",
    );
    await expect(borrow.locator('[data-reading="borrow-rule"] li').nth(0)).toHaveText(
      "C = 0: Borrow needed. The unsigned subtraction went below zero.",
    );
    await expect(borrow.locator('[data-reading="borrow-rule"] li').nth(1)).toHaveText(
      "C = 1: No borrow needed. The unsigned subtraction stayed at or above zero.",
    );
    expect(
      await borrow
        .locator('[data-reading="borrow-rule"]')
        .evaluate((el) => el.previousElementSibling?.getAttribute("data-reading")),
    ).toBe("borrow-explanation");
    await expect(borrow.locator('[data-reading="borrow-explanation"]')).toHaveText(
      "Subtracting one from zero goes below the unsigned range. Keeping only 4 result bits gives 1111 (15 unsigned).",
    );
    for (let step = 0; step < 16; step++) {
      await minus.click();
      await expect(borrow.locator('[data-reading="borrow-carry"]')).toHaveText(
        step === 15 ? "0" : "1",
      );
      expect(Math.abs((await minus.boundingBox())!.y - lowerBaseline)).toBeLessThan(1);
    }
    await expect(borrow.locator('[data-reading="borrow-decimal"]')).toHaveText("15");
    await expect(decimal).toHaveText("0");
    await expect(marker).toHaveText("1");
    await page.reload();
    await expect(details).not.toHaveAttribute("open");
    await expect(decimal).toHaveText("0");
    await expect(marker).toHaveText("1");
    await forward.getByRole("button", { name: S.reset, exact: true }).click();
    await expect(marker).toHaveText(S.pendingCarry);
    await details.locator("summary").click();
    await expect(borrow.locator('[data-reading="borrow-decimal"]')).toHaveText("15");
    await expect(borrow.locator('[data-reading="borrow-carry"]')).toHaveText("0");
    await borrow.getByRole("button", { name: S.reset, exact: true }).click();
    await expect(borrow.locator('[data-reading="borrow-stored"]')).toHaveText("0000");
    await expect(borrow.locator('[data-reading="borrow-carry"]')).toHaveText(S.pendingCarry);
    await expect(prediction.getByRole("radio", { name: /^2000$/ })).toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });

for (const theme of ["light", "dark"])
  test(`both panes keep controls below results at 320px in ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("#/lesson/subtracting-and-the-tick-counter");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    const wrap = page.locator("#ix-counter-wrap");
    for (const direction of ["forward", "borrow"]) {
      if (direction === "borrow") await wrap.locator("summary").click();
      const pane = wrap.locator(`[data-counter-pane="${direction}"]`);
      const button = pane.getByRole("button").first();
      await button.focus();
      const baseline = (await button.boundingBox())!.y;
      for (let step = 0; step < 20; step++) {
        await button.click();
        expect(Math.abs((await button.boundingBox())!.y - baseline)).toBeLessThan(1);
        const result = (await pane.locator(".al-counter-wrap-split").boundingBox())!;
        expect(result.y + result.height).toBeLessThan(baseline);
      }
    }
    const actual = await page
      .locator("body")
      .evaluate((node) => getComputedStyle(node).backgroundColor);
    expect(actual).toBe(theme === "light" ? "rgb(247, 250, 248)" : "rgb(16, 27, 26)");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
