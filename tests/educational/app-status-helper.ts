// Copyright © 2026 Christopher Snow

import { expect, type Page } from "@playwright/test";
import { STATUS_STRINGS as S } from "../../apps/course/src/strings.status";

/** Use the same modal and app-level trigger from every course route. */
export async function openStatus(page: Page) {
  const status = page.locator("#app-status-dialog");
  if (!(await status.evaluate((element) => (element as HTMLDialogElement).open))) {
    await page.locator("#app-status-open").click();
  }
  await expect(status).toBeVisible();
  return status;
}
export async function showStatusDetails(page: Page) {
  const status = await openStatus(page);
  const details = status.locator("#app-status-details");
  if (!(await details.evaluate((element) => (element as HTMLDetailsElement).open)))
    await details.locator("summary").click();
  return status;
}
export async function downloadOffline(page: Page) {
  const status = await openStatus(page);
  await status.getByRole("button", { name: S.actions.download, exact: true }).click();
  await expect(status.locator('[data-offline="ready"]')).toBeVisible({ timeout: 30_000 });
  await expect(status.getByText(S.offlineStates.ready, { exact: true })).toBeVisible();
  await status.getByRole("button", { name: S.close, exact: true }).click();
}
export async function offlineReady(page: Page) {
  const status = await openStatus(page);
  await expect(status.locator('[data-offline="ready"]')).toBeVisible({ timeout: 30_000 });
  await expect(status.getByText(S.offlineStates.ready, { exact: true })).toBeVisible();
  await status.getByRole("button", { name: S.close, exact: true }).click();
}
export async function checkForUpdates(page: Page) {
  const status = await showStatusDetails(page);
  await status.getByRole("button", { name: /^(Check for updates|Retry)$/ }).click();
  return status;
}
export async function prepareUpdate(page: Page) {
  const status = await checkForUpdates(page);
  await expect(status.locator("section[data-published-state]")).not.toHaveAttribute(
    "data-published-state",
    "checking",
  );
  await status
    .getByRole("button", { name: /^(Update offline copy|Save offline copy)$/, exact: true })
    .click();
  await expect(status.getByRole("button", { name: S.actions.restart, exact: true })).toBeVisible({
    timeout: 30_000,
  });
  return status;
}
export async function restartUpdate(page: Page) {
  const status = await openStatus(page);
  await status.getByRole("button", { name: S.actions.restart, exact: true }).click();
}
/** Natural worker replacement must finish before testing retained release identity. */
export async function waitForRuntime(observer: Page, scope: string, version: string) {
  await observer.waitForFunction(
    async ({ scope, version }) => {
      const registration = await navigator.serviceWorker.getRegistration(scope),
        worker = registration?.active;
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
