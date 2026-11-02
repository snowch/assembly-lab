// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { READER_STRINGS as R } from "../../packages/views/src/strings.reader";
import { readingsOfPattern, patternOf, shown } from "../../packages/views/src/readings";
import { openLesson, bit } from "./module1";

const grouped = (value: number) => shown(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
for (const theme of ["light", "dark"] as const) {
  test(`compact readings progress from one bit to the top bit and comparison in ${theme}`, async ({
    page,
  }) => {
    await page.goto("#/");
    await page.locator("select").selectOption(theme);
    await openLesson(page, "same-bits-two-readings");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    for (const prose of await page
      .locator(
        '.lesson-section[data-kind="question"] > .prose, .lesson-section[data-kind="investigation"] > .prose',
      )
      .all()) {
      await expect(prose).not.toContainText(/\bsigned\b|two’s complement|−2,147/);
    }
    const reader = page.locator("#ix-read-register");
    const pattern = () =>
      reader
        .locator(".al-toggle")
        .evaluateAll((buttons) =>
          buttons
            .map((button) => (button.getAttribute("aria-pressed") === "true" ? "1" : "0"))
            .join(""),
        );
    await expect(reader.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(1);
    await expect(bit(reader, 0)).toHaveAttribute("aria-pressed", "true");
    await expect(reader.locator('.al-reader-totals [data-reading="unsigned"]')).toHaveText("1");
    await expect(reader.locator('[data-selected-bit="0"]')).toBeVisible();
    await reader.locator("details.al-calc summary").click();
    await expect(reader.locator('[data-sum="signed"]')).toHaveCount(0);
    await reader.getByRole("button", { name: R.presetTop, exact: true }).click();
    expect(await pattern()).toBe(patternOf(1n << 31n));
    await expect(
      reader.locator('[data-selected-bit="31"] [data-metric="weight"] [data-cell="unsigned"]'),
    ).toHaveText("+2,147,483,648");
    const before = await pattern();
    await reader.getByRole("button", { name: R.views.signed, exact: true }).click();
    expect(await pattern()).toBe(before);
    await expect(reader.locator(".al-reader-guidance")).toContainText("two’s complement");
    await expect(reader.locator('[data-sum="unsigned"]')).toHaveCount(0);
    await expect(reader.locator('[data-sum="signed"]')).toBeVisible();
    await expect(
      reader.locator('[data-selected-bit="31"] [data-metric="weight"] [data-cell="signed"]'),
    ).toHaveText("−2,147,483,648");
    await bit(reader, 31).click();
    await expect(
      reader.locator('[data-selected-bit="31"] [data-metric="weight"] [data-cell="signed"]'),
    ).toHaveText("−2,147,483,648");
    await expect(
      reader.locator('[data-selected-bit="31"] [data-metric="contribution"] [data-cell="signed"]'),
    ).toHaveText("0");
    await reader.getByRole("button", { name: R.views.compare, exact: true }).click();
    await expect(reader.locator("[data-sum]")).toHaveCount(2);
    await expect(reader.locator('.al-reader-totals [data-reading="unsigned"]')).toHaveText("0");
    await expect(reader.locator('.al-reader-totals [data-reading="signed"]')).toHaveText("0");
    await reader.getByRole("button", { name: R.reset, exact: true }).click();
    expect(await pattern()).toBe(patternOf(1));
    await expect(
      reader.getByRole("button", { name: R.views.unsigned, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(reader.locator('[data-sum="signed"]')).toHaveCount(0);
    await page.reload();
    expect(await pattern()).toBe(patternOf(1));
  });

  test(`prediction conceals its result until commitment and restores exploration in ${theme}`, async ({
    page,
  }) => {
    await page.goto("#/");
    await page.locator("select").selectOption(theme);
    await openLesson(page, "same-bits-two-readings");
    const reader = page.locator("#ix-read-register");
    await expect(reader.getByRole("button", { name: R.predictEntry, exact: true })).toBeVisible();
    await reader.getByRole("button", { name: R.views.compare, exact: true }).click();
    await reader.locator("details.al-calc summary").click();
    await reader.getByRole("button", { name: R.predictEntry, exact: true }).click();
    await expect(reader.locator('[data-prediction="pending"]')).toBeVisible();
    await expect(bit(reader, 0)).toHaveAttribute("aria-pressed", "false");
    await expect(bit(reader, 31)).toHaveAttribute("aria-pressed", "true");
    await expect(bit(reader, 0)).toBeDisabled();
    await expect(
      reader.locator(".al-reader-totals, [data-sum], .al-selected-bit, .al-prediction-results"),
    ).toHaveCount(0);
    await expect(reader).not.toContainText("2,147,483,649");
    await expect(reader).not.toContainText("−2,147,483,647");
    await reader.getByRole("button", { name: R.prediction.choices.unsigned, exact: true }).click();
    await expect(reader).toContainText(R.prediction.incorrect);
    const after = readingsOfPattern(patternOf(0x80000001));
    for (const reading of ["unsigned", "signed"] as const) {
      await expect(
        reader.locator(`.al-prediction-results [data-phase="after"] [data-cell="${reading}"]`),
      ).toHaveText(grouped(after[reading]));
    }
    await reader.getByRole("button", { name: R.prediction.explore, exact: true }).click();
    await expect(
      reader.getByRole("button", { name: R.views.compare, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(bit(reader, 0)).toBeEnabled();
    await expect(bit(reader, 0)).toHaveAttribute("aria-pressed", "true");
    await reader.getByRole("button", { name: R.predictEntry, exact: true }).click();
    await reader.getByRole("button", { name: R.prediction.choices.both, exact: true }).click();
    await expect(reader).toContainText(R.prediction.correct);
    await reader.getByRole("button", { name: R.reset, exact: true }).click();
    await expect(reader.locator("[data-prediction]")).toHaveCount(0);
    await expect(reader.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(1);
  });

  for (const width of [320, 390, 1280]) {
    test(`compact numbered bits and calculation fit ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("#/");
      await page.locator("select").selectOption(theme);
      await openLesson(page, "same-bits-two-readings");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const reader = page.locator("#ix-read-register");
      await reader.getByRole("button", { name: R.presetTop, exact: true }).click();
      for (const mode of ["unsigned", "signed", "compare"] as const) {
        await reader.getByRole("button", { name: R.views[mode], exact: true }).click();
        const buttons = await reader.locator(".al-toggle").evaluateAll((els) =>
          els.map((el) => ({
            box: el.getBoundingClientRect().toJSON(),
            label: el.querySelector(".al-toggle-n")?.textContent,
          })),
        );
        expect(buttons.map((b) => b.label)).toEqual(
          Array.from({ length: 32 }, (_, i) => String(31 - i)),
        );
        for (const { box } of buttons) {
          expect(box.height).toBeGreaterThanOrEqual(40);
          expect(box.x).toBeGreaterThanOrEqual(0);
          expect(box.right).toBeLessThanOrEqual(width);
        }
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          ),
        ).toBe(0);
        for (const panel of await reader.locator(".al-selected-bit, .al-reader-totals").all()) {
          expect(await panel.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(
            1,
          );
        }
      }
      // Long all-ones totals must fit their cells, even when the overall table fits.
      for (let position = 30; position >= 0; position--) {
        await bit(reader, position).click();
        await expect(bit(reader, position)).toHaveAttribute("aria-pressed", "true");
      }
      await expect(reader.locator('.al-reader-totals [data-reading="unsigned"]')).toHaveText(
        "4,294,967,295",
      );
      for (const cell of await reader.locator(".al-top-table td").all()) {
        expect(await cell.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
      }
      const marker = await reader.locator(".al-top-flag").boundingBox();
      const button = await bit(reader, 31).boundingBox();
      expect(Math.abs(marker!.x + marker!.width / 2 - button!.x - button!.width / 2)).toBeLessThan(
        1,
      );
    });
  }
}
