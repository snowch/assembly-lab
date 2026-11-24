// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`lesson references and introduction links remain optional and fit in ${theme}`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.addInitScript(
      (value) => localStorage.setItem("assembly-lab:v1:theme", value),
      theme,
    );
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const [id, word, fragment] of [
      ["one-addition", "add", "/ADD--shifted-register-"],
      ["adding-a-constant", "add", "/ADD--immediate-"],
      ["returning-to-caller", "bl", "/BL--Branch-with-link-"],
      ["adding-and-the-flags", "adds", "/ADDS--shifted-register-"],
      ["masks", "and", "/AND--immediate-"],
      ["array-addresses", "ldr", "/LDR--register-"],
      ["a32-conditions", "movcs", "/ddi0597/"],
      ["floating-point-conversions", "fcvtzs", "/FCVTZS--scalar--integer-"],
      ["runtime-startup", "wfi", "/WFI--Wait-for-interrupt-"],
    ] as const) {
      await page.goto(`#/lesson/${id}`);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const row = page.locator(".lesson-source-references");
      await expect(row).toHaveCount(1);
      await expect(row).not.toHaveAttribute("open");
      await expect(row.locator('summary [data-symbol="menu_book"]')).toBeVisible();
      await expect(row.locator('summary [data-symbol="menu_book"]')).toHaveAttribute(
        "aria-hidden",
        "true",
      );
      await expect(row.locator(".resource-scope")).toContainText(word.toUpperCase());
      const icon = await row.locator('summary [data-symbol="menu_book"]').boundingBox();
      expect(icon!.width).toBe(24);
      expect(icon!.height).toBe(24);
      const chevron = row.locator('summary [data-symbol="chevron_right"]');
      expect((await chevron.boundingBox())!.width).toBe(20);
      const closedTransform = await chevron.evaluate(
        (element) => getComputedStyle(element).transform,
      );
      const link = page
        .locator(".lesson-layout-content a")
        .filter({ has: page.locator("code") })
        .filter({ hasText: new RegExp(`^${word}(?:\\s|$)`, "i") })
        .first();
      await expect(link).toHaveAttribute("href", new RegExp(fragment));
      expect(
        await page.locator('.lesson-layout-content pre a[href*="support.arm.com"]').count(),
      ).toBe(0);
      const key = `assembly-lab:v1:${id}`;
      const before = await page.evaluate((key) => localStorage.getItem(key), key);
      const summary = row.locator(":scope > summary");
      await summary.focus();
      await summary.press("Enter");
      await expect(row).toHaveAttribute("open");
      expect(await chevron.evaluate((element) => getComputedStyle(element).transform)).not.toBe(
        closedTransform,
      );
      await expect(summary).toBeFocused();
      expect(await row.getByRole("link").count()).toBeGreaterThan(0);
      const geometry = await row.evaluate((node) => ({
        bottom: node.getBoundingClientRect().bottom,
        complete: document.querySelector(".lesson-completion-row")!.getBoundingClientRect().top,
        width: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      expect(geometry.bottom).toBeLessThanOrEqual(geometry.complete);
      expect(geometry.width).toBeLessThanOrEqual(geometry.viewport);
      expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(before);
      await summary.press("Space");
      await expect(row).not.toHaveAttribute("open");
    }
    expect(errors).toEqual([]);
  });
}

test("reference disclosure resets on a new lesson and preserves flags work through theme changes", async ({
  page,
}) => {
  await page.goto("#/lesson/adding-and-the-flags");
  const row = page.locator(".lesson-source-references");
  await page.locator('#caseTabs button[data-case="2"]').click();
  await page.locator('input[name="practice-n"][value="0"]').locator("..").click();
  await row.locator("summary").click();
  await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption("dark");
  await expect(row).toHaveAttribute("open");
  await expect(page.locator('input[name="practice-n"][value="0"]')).toBeChecked();
  await expect(page.locator("#practicePosition")).toHaveText("Case 3 of 6");
  await expect(page.locator("#challenge-predict-flags")).toHaveAttribute("data-complete", "false");
  await expect(page.locator("#arm [data-fixed-result]")).toHaveCount(0);
  await page.locator('.lesson-nav a[data-direction="next"]').click();
  await expect(page.locator(".lesson-source-references")).not.toHaveAttribute("open");
});
