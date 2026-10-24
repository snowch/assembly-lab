// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";

async function expectEmbeddedIdentity(page: import("@playwright/test").Page) {
  const panel = page.locator(".app-status");
  await panel.locator("summary").click();
  const source = panel.locator('a[href*="github.com/snowch/assembly-lab/commit/"]');
  await expect(source).toHaveCount(1);
  const href = await source.getAttribute("href");
  expect(href).toMatch(/\/commit\/[a-f0-9]{40}$/);
  expect(await source.innerText()).toBe(href!.split("/").at(-1)!.slice(0, 7));
  await expect(panel.getByRole("heading", { name: "Version", exact: true })).toBeVisible();
  await expect(panel.getByRole("heading", { name: "Offline access", exact: true })).toBeVisible();
  await expect(panel).not.toContainText("Up to date");
}

test("the embedded App status is usable before the bundle loads, then is replaced once", async ({
  page,
}) => {
  let resume = () => {};
  const held = new Promise<void>((resolve) => {
    resume = resolve;
  });
  await page.route("**/assets/*.js", async (route) => {
    await held;
    await route.continue();
  });
  try {
    await page.goto("#/lesson/one-addition", { waitUntil: "commit" });
    await expectEmbeddedIdentity(page);
    await expect(page.locator(".shell-header")).toHaveCount(1);
    expect(
      await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length),
    ).toBe(0);
    resume();
    await page.getByRole("heading", { level: 1, name: "One addition", exact: true }).waitFor();
    await expect(page.locator(".shell-header")).toHaveCount(1);
    await expect(page.locator(".app-status")).toHaveCount(1);
    const panel = page.locator(".app-status");
    if (!(await panel.evaluate((el) => (el as HTMLDetailsElement).open)))
      await panel.locator("summary").click();
    await expect(
      panel.getByRole("button", { name: "Check for updates", exact: true }),
    ).toBeVisible();
  } finally {
    resume();
  }
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });
  test("the static cover keeps App status and its source identity", async ({ page }) => {
    await page.goto("#/");
    await expectEmbeddedIdentity(page);
    await expect(page.locator(".shell-header")).toHaveCount(1);
    await expect(page.locator(".app-status")).toContainText(
      "App status checks and offline downloads need JavaScript.",
    );
    await expect(page.locator(".app-status").getByRole("button")).toHaveCount(0);
  });
});
