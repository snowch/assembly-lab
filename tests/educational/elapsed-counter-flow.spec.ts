// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { COUNTER_WRAP_STRINGS as W } from "../../packages/views/src/strings.counter-wrap";

for (const theme of ["light", "dark"])
  test(`elapsed counter follows the same subtraction through the ring in ${theme}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("#/lesson/subtracting-and-the-tick-counter");
    await page.locator("select").first().selectOption(theme);
    const ring = page.locator("#ix-counter-ring");
    const summary = ring.locator('[data-reading="elapsed-summary"]');
    const reminder = page.locator("#ix-counter-subtraction-reminder");
    const wrap = page.locator("#ix-counter-wrap");
    await expect(wrap.getByRole("button", { name: W.advanceLabel })).toBeVisible();
    expect(
      await wrap.evaluate((node) =>
        Boolean(
          node.compareDocumentPosition(
            document.querySelector("#ix-counter-subtraction-reminder")!,
          ) & Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ),
    ).toBe(true);
    await expect(reminder).toBeVisible();
    await expect(reminder.locator('[data-reading="result"]')).toHaveText("0011");
    await expect(reminder).toContainText("keeping 32 result bits instead of 4");
    expect(
      await reminder.evaluate((node) =>
        Boolean(
          node.compareDocumentPosition(document.querySelector("#ix-predict-elapsed")!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ),
    ).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Counting forward across the wrap" }),
    ).toBeVisible();
    await expect(ring.locator(".al-locked")).toBeVisible();
    await expect(summary).toHaveCount(0);
    const prediction = page.locator("#ix-predict-elapsed");
    await prediction.getByRole("radio", { name: /^2000$/ }).check();
    await prediction.getByRole("button", { name: V.prediction.commit }).click();
    await expect(summary).toBeVisible();
    await expect(summary).toContainText("1000 - 4294966296");
    await expect(summary).toContainText("2000");
    await expect(summary).toContainText("low 32 bits");
    await expect(ring.locator('[data-row="c"]')).toHaveCount(0);
    await expect(ring).toContainText("fewer than 4294967296 ticks");
    await expect(
      page
        .locator("section.lesson-section")
        .filter({ has: page.getByRole("heading", { name: "Writing elapsed yourself" }) }),
    ).toBeVisible();
    await page.reload();
    await expect(summary).toBeVisible();
    await expect(prediction.getByRole("radio", { name: /^2000$/ })).toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });
