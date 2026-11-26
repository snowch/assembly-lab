// Copyright © 2026 Christopher Snow

import { setTheme } from "./theme-helper";

import { expect, test } from "@playwright/test";
import { STRINGS } from "../../apps/course/src/strings";
import { openStatus } from "./app-status-helper";

for (const theme of ["light", "dark"] as const) {
  test(`shared cover remains readable in ${theme} and header tools retain their work`, async ({
    page,
  }) => {
    await page.goto("#/");
    await setTheme(page, theme);
    const contrast = await page.locator(".cover-hero h1").evaluate((el) => {
      const rgb = (value: string) =>
        value
          .match(/[\d.]+/g)!
          .slice(0, 3)
          .map(Number);
      const luminance = (value: string) => {
        const [r, g, b] = rgb(value).map((x) => {
          const c = x / 255;
          return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
      };
      const a = luminance(getComputedStyle(el).color),
        b = luminance(getComputedStyle(document.body).backgroundColor);
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    });
    expect(contrast).toBeGreaterThanOrEqual(4.5);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    // The wide-screen tools are intentionally nonmodal. A top modal owns Escape.
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.getByRole("button", { name: "Calculator", exact: true }).click();
    const calculator = page.getByRole("dialog", { name: "Programmer calculator", exact: true });
    await calculator.getByRole("textbox", { name: "Value A", exact: true }).fill("42");
    await openStatus(page);
    await page.keyboard.press("Escape");
    await expect(page.locator("#app-status-dialog")).not.toHaveAttribute("open");
    await expect(calculator.getByRole("textbox", { name: "Value A", exact: true })).toHaveValue(
      "42",
    );
    await calculator.getByRole("button", { name: "Close calculator", exact: true }).click();
    await page.getByRole("button", { name: "Reference", exact: true }).click();
    const reference = page.getByRole("dialog", { name: "Instruction reference", exact: true });
    await reference.getByRole("searchbox").fill("add");
    await openStatus(page);
    await page.keyboard.press("Escape");
    await expect(page.locator("#app-status-dialog")).not.toHaveAttribute("open");
    await expect(reference.getByRole("searchbox")).toHaveValue("add");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(STRINGS.title);
  });
}

test("course outline expands below its location row and keeps the current simulation", async ({
  page,
}) => {
  await page.goto("#/lesson/one-addition");
  const operation = page.locator("#ix-worked-addition [data-figure='primitive-operation']");
  await operation.getByRole("button", { name: "Run the instruction", exact: true }).click();
  await expect(operation).toHaveAttribute("data-k", "1");
  const trigger = page.getByRole("button", { name: "Course lessons", exact: true });
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger).toBeInViewport();
  const before = await trigger.boundingBox();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const after = await trigger.boundingBox();
  expect(after!.y).toBe(before!.y);
  const row = await page.locator(".course-location-row").boundingBox();
  const panel = page.locator("#course-lesson-panel");
  expect((await panel.boundingBox())!.y).toBeGreaterThanOrEqual(row!.y + row!.height);
  await panel.locator('a[aria-current="page"]').click();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(operation).toHaveAttribute("data-k", "1");
  await trigger.click();
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});
