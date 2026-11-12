// Copyright © 2026 Christopher Snow
import { test, expect } from "@playwright/test";
import { downloadOffline, offlineReady } from "../educational/app-status-helper";
test("root preview works offline and isolates progress by origin", async ({ page, context }) => {
  test.setTimeout(120_000);
  await page.goto("?style=new#/lesson/register-widths");
  await page.locator('[data-challenge="predict-two-registers"] [data-field="x1"] input').fill("5");
  await downloadOffline(page);
  await page.locator(".app-status > summary").click();
  expect(
    new URL(await page.evaluate(async () => (await navigator.serviceWorker.ready).scope)).pathname,
  ).toBe("/");
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('[data-field="x1"] input')).toHaveValue("5");
  await offlineReady(page);
  await page.locator(".app-status > summary").click();
  await page.locator(".style-preview-choices button").first().click();
  await expect(page.locator("html")).toHaveAttribute("data-style-preview", "current");
  await expect(page.locator('[data-field="x1"] input')).toHaveValue("5");
  await context.setOffline(false);
  await page.evaluate(() =>
    localStorage.setItem("assembly-lab:v1:preview-isolation-canary", "only-here"),
  );
  const other = await context.newPage();
  const address = new URL(page.url());
  address.hostname = "127.0.0.1";
  await other.goto(address.href);
  expect(
    await other.evaluate(() => localStorage.getItem("assembly-lab:v1:preview-isolation-canary")),
  ).toBeNull();
  await other.close();
});
