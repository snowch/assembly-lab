// Copyright © 2026 Christopher Snow

import { expect, type Page } from "@playwright/test";

/** Use the primary action for light/dark; retain the real settings path for System. */
export async function setTheme(page: Page, choice: string | { label: string }) {
  const panel = page.locator("#app-status-dialog");
  const wasOpen = await panel.evaluate((element) => (element as HTMLDialogElement).open);
  const explicit = (typeof choice === "string" ? choice : choice.label).toLowerCase();
  if (explicit === "light" || explicit === "dark") {
    if (wasOpen) await panel.getByRole("button", { name: "Close", exact: true }).click();
    const toggle = page.locator("#theme-toggle");
    await expect(toggle).toHaveAccessibleName(/Switch to (light|dark) theme/);
    const action = `Switch to ${explicit} theme`;
    const opposite = explicit === "dark" ? "light" : "dark";
    // A matching system appearance is not yet an explicit preference. Move away
    // and back so per-tab handoff and denied-storage checks still exercise writes.
    if ((await toggle.getAttribute("aria-label")) !== action) {
      await toggle.click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", opposite);
      await expect(toggle).toHaveAccessibleName(action);
    }
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", explicit);
    await expect(toggle).toHaveAccessibleName(`Switch to ${opposite} theme`);
    if (wasOpen) await page.locator("#app-status-open").click();
    return;
  }
  if (!wasOpen) await page.locator("#app-status-open").click();
  const settings = panel.locator(".theme-settings");
  if (!(await settings.evaluate((element) => (element as HTMLDetailsElement).open)))
    await settings.locator("summary").click();
  const [selected] = await settings
    .getByRole("combobox", { name: "Theme", exact: true })
    .selectOption(choice);
  if (selected === "auto")
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
  else await expect(page.locator("html")).toHaveAttribute("data-theme", selected!);
  if (!wasOpen) await panel.getByRole("button", { name: "Close", exact: true }).click();
}
