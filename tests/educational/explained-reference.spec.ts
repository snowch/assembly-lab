// Copyright © 2026 Christopher Snow

import { setTheme } from "./theme-helper";

import { expect, test } from "@playwright/test";

for (const theme of ["light", "dark"] as const) {
  test(`explained forms, boundaries and prepared contexts in ${theme}`, async ({ page }) => {
    await page.goto("#/lesson/subtracting-and-the-tick-counter");
    await setTheme(page, theme);
    const source = page.locator(".asm-editor textarea").first();
    await source.fill("add w0, w0, 4294966296");
    const syntax = page.getByRole("button", { name: "Syntax for add", exact: true });
    await syntax.click();
    const panel = page.getByRole("dialog", { name: "Instruction reference", exact: true });
    const add = panel.locator('[data-mnemonic="add"]');
    const immediate = add.locator('[data-form="immediate"]');
    await expect(immediate).toHaveAttribute("open", "");
    await expect(add.locator(".reference-form").first()).toHaveAttribute("data-form", "immediate");
    await expect(add.getByText(/ADD can encode only certain immediate values/)).toBeVisible();
    const limitRule = immediate.locator(".reference-essential-rules > li").first();
    await expect(limitRule).toBeInViewport({ ratio: 1 });
    const position = await limitRule.boundingBox();
    expect(position!.y).toBeGreaterThan(0);
    expect(position!.y + position!.height).toBeLessThan(page.viewportSize()!.height);
    await expect(limitRule).toContainText("4095");
    const first = immediate.locator(".reference-worked-example").first();
    await expect(first.getByRole("heading", { name: "Before", exact: true })).toBeVisible();
    await expect(first.getByRole("heading", { name: "Instruction", exact: true })).toBeVisible();
    await expect(
      first.getByRole("heading", { name: "After this instruction", exact: true }),
    ).toBeVisible();
    await expect(immediate.locator(".reference-mistakes")).toContainText("#4097");
    await expect(immediate.locator(".reference-mistakes")).toContainText("4294966296");
    await immediate.locator(".reference-more-examples > summary").click();
    await expect(immediate.locator(".reference-more-examples")).toContainText("#4096");
    await expect(add.locator(".reference-advanced-forms")).not.toHaveAttribute("open");
    await panel.getByRole("button", { name: "Close", exact: true }).click();
    await expect(syntax).toBeFocused();
    await expect(source).toHaveValue("add w0, w0, 4294966296");
    await source.fill("mov w8, #3");
    await page.getByRole("button", { name: "Syntax for mov", exact: true }).click();
    await expect(panel.getByText("Not allowed in this exercise.", { exact: true })).toBeInViewport({
      ratio: 1,
    });
    await panel.getByRole("button", { name: "Close", exact: true }).click();
    await source.fill("add w0, w0, 4294966296");
    await page.getByRole("button", { name: "Reference", exact: true }).click();
    await panel.getByRole("button", { name: "All browser instructions", exact: true }).click();
    const search = panel.getByRole("searchbox");
    for (const mnemonic of ["strb", "sxtb", "b.eq", "ret"]) {
      await search.fill(mnemonic);
      const entry = panel.locator(".reference-entries > details[open]").first();
      const example = entry.locator(".reference-worked-example").first();
      await expect(example).toBeVisible();
      if (mnemonic === "strb") {
        await expect(example).toContainText("Contents at .Lvalue (1 byte)");
        await expect(example.locator('[data-state="before"]')).toContainText("309");
        await expect(example.locator('[data-state="after"]')).toContainText("53");
      }
      if (mnemonic === "b.eq") {
        await expect(example).toContainText("Branch taken");
      }
      await example.locator(".reference-complete-example > summary").click();
      const header = example.locator(".reference-program-header");
      await expect(header).toBeVisible();
      await expect(header.locator("dt code")).toHaveText([
        ".text",
        ".global reference_example",
        "reference_example:",
      ]);
      await expect(header).toContainText("not a reserved command");
      await expect(example).toContainText(
        ".global alone does not choose where execution starts or call the code.",
      );
      const mark = example.locator(".reference-complete-example mark");
      await expect(mark).toHaveCount(1);
      expect(
        await mark.evaluate((node) => parseFloat(getComputedStyle(node).fontSize)),
      ).toBeGreaterThanOrEqual(12);
      expect(
        await example.locator(".reference-complete-example pre > code").evaluate((node) => {
          const mark = node.querySelector("mark")!;
          const text = [...node.childNodes].find(
            (child) => child.nodeType === Node.TEXT_NODE && child.previousSibling === mark,
          );
          return text?.textContent?.startsWith("\n") ?? false;
        }),
      ).toBe(true);
      const dialogOverflow = await panel.evaluate((node) => node.scrollWidth > node.clientWidth);
      expect(dialogOverflow).toBe(false);
    }
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Reference", exact: true })).toBeFocused();
    await expect(source).toHaveValue("add w0, w0, 4294966296");
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
      false,
    );
    await page.reload();
    await expect(source).toHaveValue("add w0, w0, 4294966296");
  });
}
