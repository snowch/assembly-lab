// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { STRINGS } from "../../apps/course/src/strings";
import { STATUS_STRINGS as S } from "../../apps/course/src/strings.status";
import { setTheme } from "./theme-helper";

for (const colourScheme of ["light", "dark"] as const) {
  test(`header icons follow ${colourScheme} system theme, toggle directly and preserve System settings`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: colourScheme });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("#/lesson/one-addition");
    const toggle = page.locator("#theme-toggle");
    const status = page.locator("#app-status-open");
    await expect(toggle).toHaveAccessibleName(
      colourScheme === "dark" ? STRINGS.themeSwitchLight : STRINGS.themeSwitchDark,
    );
    await expect(status).toHaveAccessibleName(S.headerLabel);
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
    for (const width of [320, 390, 820, 1280]) {
      await page.setViewportSize({ width, height: 920 });
      for (const control of [toggle, status]) {
        const box = (await control.boundingBox())!;
        expect(box.width).toBe(48);
        expect(box.height).toBe(48);
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(width);
        await expect(control).toHaveAttribute("title", /.+/);
        await control.focus();
        expect(
          await control.evaluate((element) => getComputedStyle(element).outlineStyle),
        ).not.toBe("none");
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await expect(page.getByRole("button", { name: "Calculator", exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Reference", exact: true })).toBeVisible();
    }
    await toggle.focus();
    await page.keyboard.press("Enter");
    const explicit = colourScheme === "dark" ? "light" : "dark";
    await expect(page.locator("html")).toHaveAttribute("data-theme", explicit);
    await expect(toggle).toHaveAccessibleName(
      explicit === "dark" ? STRINGS.themeSwitchLight : STRINGS.themeSwitchDark,
    );
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", explicit);
    await setTheme(page, "auto");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
    expect(await page.evaluate(() => localStorage.getItem("assembly-lab:v1:theme"))).toBeNull();
    await page.emulateMedia({ colorScheme: explicit });
    await expect(toggle).toHaveAccessibleName(
      explicit === "dark" ? STRINGS.themeSwitchLight : STRINGS.themeSwitchDark,
    );
    await status.focus();
    await page.keyboard.press("Space");
    const panel = page.locator("#app-status-dialog");
    await expect(panel).toBeVisible();
    expect(await panel.evaluate((element) => element.matches(":modal"))).toBe(true);
    const settings = panel.locator(".theme-settings");
    const summary = settings.locator("summary");
    expect((await summary.boundingBox())!.height).toBeGreaterThanOrEqual(48);
    expect(await summary.evaluate((element) => getComputedStyle(element).display)).toBe(
      "list-item",
    );
    if (!(await settings.evaluate((element) => (element as HTMLDetailsElement).open))) {
      await settings.locator("summary").focus();
      await page.keyboard.press("Enter");
    }
    const nativeChoice = settings.getByRole("combobox", { name: STRINGS.theme, exact: true });
    await nativeChoice.selectOption("dark");
    await nativeChoice.focus();
    await page.keyboard.press("Home");
    await expect(nativeChoice).toHaveValue("auto");
    await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.*/);
    await page.keyboard.press("Tab");
    await page.keyboard.press("Escape");
    await expect(status).toBeFocused();
    expect(errors).toEqual([]);
  });
}
