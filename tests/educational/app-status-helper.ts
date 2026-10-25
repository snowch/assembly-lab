// Copyright © 2026 Christopher Snow

import { expect, type Page } from "@playwright/test";

/** Use the same app-level control from the front page and every lesson. */
export async function openStatus(page: Page) {
  const status = page.locator(".app-status");
  const summary = status.locator("summary").first();
  if (!(await status.evaluate((element) => (element as HTMLDetailsElement).open))) {
    await summary.click();
  }
  return status;
}

export async function downloadOffline(page: Page) {
  const status = await openStatus(page);
  await status.getByRole("button", { name: "Download for offline use", exact: true }).click();
  await expect(status.getByText("Available offline", { exact: true })).toBeVisible({
    timeout: 30_000,
  });
}

export async function offlineReady(page: Page) {
  const status = await openStatus(page);
  await expect(status.getByText("Available offline", { exact: true })).toBeVisible({
    timeout: 30_000,
  });
}

export async function checkForUpdates(page: Page) {
  const status = await openStatus(page);
  await status.getByRole("button", { name: /^(Check for updates|Retry)$/ }).click();
  return status;
}

export async function prepareUpdate(page: Page) {
  const status = await checkForUpdates(page);
  await expect(
    status.locator('[data-version="available"]').getByText("Update available", { exact: true }),
  ).toBeVisible();
  await status.getByRole("button", { name: "Update", exact: true }).click();
  await expect(status.getByRole("button", { name: "Restart to update", exact: true })).toBeVisible({
    timeout: 30_000,
  });
  return status;
}

export async function restartUpdate(page: Page) {
  const status = await openStatus(page);
  await status.getByRole("button", { name: "Restart to update", exact: true }).click();
}

/** Natural worker replacement must really finish before testing a retained release pointer. */
export async function waitForRuntime(observer: Page, scope: string, version: string) {
  await observer.waitForFunction(
    async ({ scope, version }) => {
      const registration = await navigator.serviceWorker.getRegistration(scope);
      const worker = registration?.active;
      if (!worker || worker.state !== "activated" || registration?.waiting) return false;
      return new Promise<boolean>((resolve) => {
        const channel = new MessageChannel();
        const timer = setTimeout(() => {
          channel.port1.close();
          resolve(false);
        }, 1000);
        channel.port1.onmessage = (event) => {
          clearTimeout(timer);
          channel.port1.close();
          resolve(event.data?.runtimeVersion === version);
        };
        worker.postMessage({ type: "OFFLINE_STATUS" }, [channel.port2]);
      });
    },
    { scope, version },
  );
}
