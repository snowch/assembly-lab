// Copyright © 2026 Christopher Snow

import { expect, test, type Locator, type Page } from "@playwright/test";
import { STATUS_STRINGS as S } from "../../apps/course/src/strings.status";
import { deployment } from "./offline-site";
import { checkForUpdates, downloadOffline, prepareUpdate, openStatus } from "./app-status-helper";
async function withinViewport(page: Page, panel: Locator) {
  const box = await panel.boundingBox(),
    viewport = page.viewportSize()!;
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
  expect(await panel.evaluate((el) => el.matches(":modal"))).toBe(true);
}
for (const [width, height] of [
  [390, 844],
  [768, 700],
  [1280, 800],
])
  for (const theme of ["light", "dark"]) {
    test(`status layout ${width}x${height} in ${theme}: one persistent modal and clear course action`, async ({
      page,
    }) => {
      const site = await deployment(),
        errors: string[] = [];
      page.on("pageerror", (error) => errors.push(String(error)));
      try {
        await page.setViewportSize({ width: width!, height: height! });
        await page.goto(site.url);
        await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const status = await checkForUpdates(page),
          trigger = page.locator("#app-status-open"),
          version = trigger.locator("[data-version-status]");
        await expect(version).toHaveText(S.versionStates.current);
        await expect(
          status.getByRole("heading", { name: S.courseHeading, exact: true }),
        ).toHaveCount(1);
        await expect(
          status.getByRole("heading", { name: S.offlineHeading, exact: true }),
        ).toHaveCount(0);
        await expect(status.locator(".running-version")).toHaveText(
          site.initial.commit!.slice(0, 7),
        );
        await withinViewport(page, status);
        await page.keyboard.press("Escape");
        await expect(status).not.toHaveAttribute("open");
        await expect(trigger).toBeFocused();
        await downloadOffline(page);
        await openStatus(page);
        await expect(
          status.getByRole("button", { name: S.actions.download, exact: true }),
        ).toHaveCount(0);
        await status.getByRole("button", { name: S.close, exact: true }).click();
        site.publish("visible-update");
        await checkForUpdates(page);
        await expect(version).toHaveText(S.versionStates.available);
        await prepareUpdate(page);
        await expect(version).toHaveText(S.versionStates.ready);
        await expect(
          status.getByRole("button", { name: S.actions.restart, exact: true }),
        ).toBeVisible();
        await status.getByRole("button", { name: S.actions.later, exact: true }).click();
        await expect(status).not.toHaveAttribute("open");
        await expect(trigger).toBeFocused();
        await expect(version).toHaveText(S.versionStates.ready);
        await page.evaluate(() => (document.documentElement.style.fontSize = "150%"));
        await openStatus(page);
        await withinViewport(page, status);
        expect(errors).toEqual([]);
      } finally {
        await site.close();
      }
    });
  }
