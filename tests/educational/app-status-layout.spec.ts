// Copyright © 2026 Christopher Snow

import { expect, test, type Locator, type Page } from "@playwright/test";
import { deployment } from "./offline-site";
import { checkForUpdates, downloadOffline, prepareUpdate } from "./app-status-helper";

async function withinViewport(page: Page, panel: Locator) {
  const box = await panel.boundingBox();
  const viewport = page.viewportSize()!;
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  const contentHeight = await panel.evaluate((element) => {
    const style = getComputedStyle(element);
    return element.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
  });
  expect(contentHeight).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
}

for (const [width, height] of [
  [375, 812],
  [641, 900],
  [800, 1100],
  [1280, 800],
  [800, 375],
]) {
  for (const theme of ["light", "dark"] as const) {
    test(`status layout ${width}x${height} in ${theme}: independent visible indicators and contained panel`, async ({
      page,
    }) => {
      const site = await deployment();
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(String(error)));
      try {
        await page.setViewportSize({ width: width!, height: height! });
        await page.goto(site.url);
        await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const status = await checkForUpdates(page);
        const summary = status.locator("summary").first();
        const version = summary.locator("[data-version-status]");
        const offline = summary.locator("[data-offline-status]");
        const panel = status.locator(".app-status-panel");
        await expect(version).toHaveText("Up to date");
        await expect(offline).toHaveText("Not saved offline");
        await expect(summary).not.toContainText("Build");
        await expect(summary).not.toContainText(site.initial.commit!.slice(0, 7));
        await expect(panel.locator(".running-version")).toHaveText(
          site.initial.commit!.slice(0, 7),
        );
        await withinViewport(page, panel);
        await summary.press("Escape");
        await expect(status).not.toHaveAttribute("open");
        await expect(summary).toBeFocused();
        await expect(offline).toBeVisible();
        await downloadOffline(page);
        await summary.click();
        await expect(offline).toHaveText("Saved offline");
        site.publish("visible-update");
        await checkForUpdates(page);
        await expect(version).toHaveText("Update available");
        await summary.click();
        await expect(version).toBeVisible();
        await expect(offline).toHaveText("Saved offline");
        await prepareUpdate(page);
        await summary.click();
        await expect(version).toHaveText("Update ready");
        await expect(offline).toHaveText("Saved offline");
        await summary.click();
        await withinViewport(page, panel);
        const later = status.getByRole("button", { name: "Later", exact: true });
        await later.click();
        await expect(status).not.toHaveAttribute("open");
        await expect(summary).toBeFocused();
        await expect(version).toHaveText("Update ready");
        await page.evaluate(() => (document.documentElement.style.fontSize = "150%"));
        await summary.click();
        await withinViewport(page, panel);
        expect(errors).toEqual([]);
      } finally {
        await site.close();
      }
    });
  }
}
