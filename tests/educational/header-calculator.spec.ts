// Copyright © 2026 Christopher Snow

import { setTheme } from "./theme-helper";

import { expect, test } from "@playwright/test";
import { inspectCalculator } from "./calculator-helpers";
import { GITHUB_REPOSITORY } from "../../apps/course/src/strings";

for (const theme of ["light", "dark"] as const) {
  test(`header calculator in ${theme}: scratch work, focus and lesson isolation`, async ({
    page,
  }) => {
    await page.goto("#/lesson/adding-and-the-flags");
    await setTheme(page, theme);
    const trigger = page.getByRole("button", { name: "Calculator", exact: true });
    await trigger.click();
    const panel = page.getByRole("dialog", { name: "Programmer calculator" });
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("button", { name: "Close calculator" })).toBeFocused();
    await expect(panel.getByText("Try a short task", { exact: true })).toHaveCount(0);
    await expect(panel.getByRole("link")).toHaveCount(0);
    await panel.getByRole("textbox", { name: "Value A", exact: true }).fill("4294967295");
    await panel.getByRole("button", { name: "Signed", exact: true }).click();
    const a = panel.getByRole("group", { name: "Value A", exact: true });
    const result = panel.getByRole("group", { name: "Retained result", exact: true });
    await expect(a.locator('output[data-reading="signed"]')).toHaveText("-1");
    await panel.getByRole("button", { name: "64 bits", exact: true }).click();
    await expect(a.locator('output[data-reading="signed"]')).toHaveText("4,294,967,295");
    await panel.getByRole("textbox", { name: "Value B", exact: true }).fill("1");
    await panel.getByRole("button", { name: "Calculate", exact: true }).click();
    await expect(a.locator('output[data-reading="signed"]')).toHaveText("4,294,967,295");
    await expect(result.locator('output[data-reading="signed"]')).toHaveText("4,294,967,296");
    await panel.getByRole("button", { name: "Use result as A", exact: true }).click();
    await panel
      .getByRole("combobox", { name: "Operation", exact: true })
      .selectOption("shift-left");
    await panel.getByLabel("Shift amount (decimal)", { exact: true }).fill("1");
    await panel.getByRole("button", { name: "Calculate", exact: true }).click();
    await expect(a.locator('output[data-reading="signed"]')).toHaveText("4,294,967,296");
    await expect(result.locator('output[data-reading="signed"]')).toHaveText("8,589,934,592");
    await panel.getByRole("button", { name: "Close calculator" }).click();
    await expect(panel).not.toBeVisible();
    await expect(panel.locator("input, select")).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(result.locator('output[data-reading="signed"]')).toHaveText("8,589,934,592");
    await page.keyboard.press("Escape");
    await expect(panel).not.toBeVisible();
    await expect(trigger).toBeFocused();
    // A client-side route change retains the global workspace; no answer artifact is written.
    const stored = await page.evaluate(() =>
      localStorage.getItem("assembly-lab:v1:adding-and-the-flags"),
    );
    await page.evaluate(() => {
      location.hash = "#/lesson/one-addition";
    });
    await expect(
      page.getByRole("heading", { name: "One addition", exact: true }).first(),
    ).toBeVisible();
    await trigger.click();
    await expect(result.locator('output[data-reading="signed"]')).toHaveText("8,589,934,592");
    await expect(panel.getByRole("button", { name: "64 bits", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      await page.evaluate(() => localStorage.getItem("assembly-lab:v1:adding-and-the-flags")),
    ).toBe(stored);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    const box = await panel.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    await panel.getByRole("button", { name: "Reset calculator", exact: true }).click();
    await expect(a.locator('output[data-reading="unsigned"]')).toHaveText("0");
    await expect(panel.getByRole("button", { name: "32 bits", exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
}

test("phone modal traps focus and changing to desktop keeps work", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("#/");
  await page.getByRole("button", { name: "Calculator", exact: true }).click();
  const panel = page.getByRole("dialog", { name: "Programmer calculator" });
  await expect(panel).toHaveAttribute("aria-modal", "true");
  await panel.getByRole("button", { name: "Close calculator" }).press("Shift+Tab");
  expect(await panel.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await panel.getByRole("textbox", { name: "Value A", exact: true }).fill("42");
  await page.setViewportSize({ width: 1280, height: 800 });
  await expect(panel).toBeVisible();
  await expect(panel).not.toHaveAttribute("aria-modal", "true");
  await expect(
    panel
      .getByRole("group", { name: "Value A", exact: true })
      .locator('output[data-reading="unsigned"]'),
  ).toHaveText("42");
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

for (const theme of ["light", "dark"] as const) {
  test(`calculator rows, editing and header tools reflow in ${theme}`, async ({ page }) => {
    for (const width of [320, 375, 834, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("#/");
      await setTheme(page, theme);
      const source = page.locator("footer").getByRole("link", { name: "Source", exact: true });
      await expect(source).toHaveAttribute("href", GITHUB_REPOSITORY);
      const sourceBox = (await source.boundingBox())!;
      expect(sourceBox.height).toBeGreaterThanOrEqual(44);
      expect(sourceBox.x).toBeGreaterThanOrEqual(0);
      expect(sourceBox.x + sourceBox.width).toBeLessThanOrEqual(width);
      for (const name of ["Calculator", "Reference"]) {
        const tool = page.locator("header").getByRole("button", { name, exact: true });
        const box = (await tool.boundingBox())!;
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
      }
      await page.getByRole("button", { name: "Calculator", exact: true }).click();
      const panel = page.getByRole("dialog", { name: "Programmer calculator" });
      const scroll = panel.getByRole("region", { name: "Calculation", exact: true });
      const a = panel.getByRole("group", { name: "Value A", exact: true });
      await expect(panel.getByRole("button", { name: "Apply", exact: true })).toHaveCount(0);
      const aInput = await panel
        .getByRole("textbox", { name: "Value A", exact: true })
        .boundingBox();
      const aPreview = await a.boundingBox();
      const bInput = await panel
        .getByRole("textbox", { name: "Value B", exact: true })
        .boundingBox();
      const bPreview = await panel
        .getByRole("group", { name: "Value B", exact: true })
        .boundingBox();
      const operation = await panel
        .getByRole("combobox", { name: "Operation", exact: true })
        .boundingBox();
      expect(Math.abs(aInput!.width - bInput!.width)).toBeLessThan(1);
      expect(aPreview!.y).toBeGreaterThanOrEqual(aInput!.y + aInput!.height);
      if (width >= 834) {
        expect(Math.abs(aInput!.y - bInput!.y)).toBeLessThan(1);
        expect(bInput!.x).toBeGreaterThanOrEqual(aInput!.x + aInput!.width);
      } else expect(bInput!.y).toBeGreaterThanOrEqual(aPreview!.y + aPreview!.height);
      expect(bPreview!.y).toBeGreaterThanOrEqual(bInput!.y + bInput!.height);
      expect(operation!.y).toBeGreaterThanOrEqual(bPreview!.y + bPreview!.height);
      await panel.getByRole("button", { name: "64 bits", exact: true }).click();
      await panel
        .getByRole("textbox", { name: "Value A", exact: true })
        .fill("18446744073709551615");
      await panel.getByRole("button", { name: "Calculate", exact: true }).click();
      await expect(a.locator("[data-pattern]")).toHaveAttribute(
        "data-pattern",
        "18446744073709551615",
      );
      await expect(panel.locator(".workspace-exact")).toHaveText(
        "Exact unsigned sum: 18,446,744,073,709,551,616",
      );
      await inspectCalculator(panel);
      await expect(panel.locator('[data-row="result"] .workspace-cell')).toHaveCount(64);
      await expect.poll(() => scroll.evaluate((n) => n.scrollLeft)).toBeGreaterThan(0);
      await panel.getByRole("button", { name: "High bits", exact: true }).click();
      await expect.poll(() => scroll.evaluate((n) => n.scrollLeft)).toBe(0);
      // A single scroll container keeps every bit column aligned, including after scrolling.
      const aligned = async () =>
        scroll.evaluate((n) => {
          const rows = [...n.querySelectorAll<HTMLElement>("[data-row]")];
          return Array.from({ length: 64 }, (_, index) => {
            const xs = rows.map(
              (row) => row.querySelector(`[data-bit="${index}"]`)!.getBoundingClientRect().x,
            );
            return Math.max(...xs) - Math.min(...xs);
          });
        });
      expect(Math.max(...(await aligned()))).toBeLessThan(1);
      await scroll.focus();
      await scroll.press("ArrowRight");
      await expect.poll(() => scroll.evaluate((n) => n.scrollLeft)).toBeGreaterThan(0);
      await panel.getByRole("button", { name: "Low bits", exact: true }).click();
      expect(Math.max(...(await aligned()))).toBeLessThan(1);
      const position = await scroll.evaluate((n) => n.scrollLeft);
      await panel.getByRole("button", { name: "Close calculator" }).click();
      await page.getByRole("button", { name: "Calculator", exact: true }).click();
      await expect.poll(() => scroll.evaluate((n) => n.scrollLeft)).toBe(position);
      await panel.getByRole("textbox", { name: "Value B", exact: true }).fill("invalid");
      await expect(
        panel.getByRole("img", { name: "Result: Not calculated", exact: true }),
      ).toBeVisible();
      await panel.getByRole("button", { name: "Calculate", exact: true }).click();
      await expect(panel.getByRole("textbox", { name: "Value B", exact: true })).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      await panel.getByRole("button", { name: "Edit A bits", exact: true }).click();
      const bit0 = panel.getByRole("button", { name: "Bit 0", exact: true });
      await bit0.focus();
      await bit0.press("ArrowLeft");
      await expect(panel.getByRole("button", { name: "Bit 1", exact: true })).toBeFocused();
      await bit0.click();
      await expect(a.locator("[data-pattern]")).toHaveAttribute(
        "data-pattern",
        "18446744073709551614",
      );
      const bitBox = (await bit0.boundingBox())!;
      expect(bitBox.width).toBeGreaterThanOrEqual(44);
      expect(bitBox.height).toBeGreaterThanOrEqual(44);
      await expect(panel.locator(".workspace-halves")).toHaveCount(0);
      await panel.getByRole("button", { name: "32 bits", exact: true }).click();
      const halves = panel.locator(".workspace-halves");
      await expect(halves).not.toHaveAttribute("open");
      await halves.locator("summary").click();
      await expect(halves).toHaveAttribute("open");
      await panel.getByRole("button", { name: "Clear bits", exact: true }).click();
      await panel.getByLabel("Half value in decimal", { exact: true }).fill("15");
      await panel.getByRole("button", { name: "Apply half", exact: true }).click();
      await expect(a.locator("[data-pattern]")).toHaveAttribute("data-pattern", "983040");
      expect(await panel.evaluate((n) => n.scrollWidth > n.clientWidth)).toBe(false);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
        false,
      );
      await panel.getByRole("button", { name: "Reset calculator", exact: true }).click();
      await expect(panel.locator(".workspace-inspection")).not.toHaveAttribute("open");
      await expect(panel.getByRole("button", { name: "Calculate", exact: true })).toHaveCount(1);
      await expect(a.locator("[data-pattern]")).toHaveAttribute("data-pattern", "0");
      await panel.getByRole("button", { name: "Close calculator" }).click();
    }
  });
}

test("the Source footer remains a normal keyboard link and works without scripts", async ({
  page,
  browser,
}) => {
  await page.goto("#/");
  const source = page.locator("footer").getByRole("link", { name: "Source", exact: true });
  await source.focus();
  await expect(source).toBeFocused();
  await page.route("https://github.com/snowch/assembly-lab", (route) =>
    route.fulfill({ body: "repository" }),
  );
  await source.press("Enter");
  await expect(page).toHaveURL("https://github.com/snowch/assembly-lab");
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 800 },
  });
  const plain = await context.newPage();
  await plain.goto(test.info().project.use.baseURL as string);
  const initial = plain.locator("footer").getByRole("link", { name: "Source", exact: true });
  await expect(initial).toBeVisible();
  await expect(initial).toHaveAttribute("href", "https://github.com/snowch/assembly-lab");
  expect(await plain.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await context.close();
});
