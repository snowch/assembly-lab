// Copyright © 2026 Christopher Snow

import { setTheme } from "./theme-helper";

import { expect, test } from "@playwright/test";
import { ADJUSTED_DIFFERENCE } from "../../content/lessons/transfer.listings";

for (const theme of ["light", "dark"])
  test(`directional Arm guide runs and preserves a64-bit translation in ${theme}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("#/lesson/moving-to-riscv");
    await setTheme(page, theme);
    await expect(
      page.getByRole("heading", { name: "Moving from Arm to RISC-V", exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "The RISC-V transfer appendix" })).toHaveAttribute(
      "href",
      /riscv-and-arm/,
    );
    const challenge = page.locator("#ix-write-transfer-difference");
    const editor = challenge.locator("textarea");
    if (!(await editor.isVisible())) await challenge.getByRole("button", { name: /Type/ }).click();
    await editor.fill("sub w0, w0, w1\nadd w0, w0, w2\nret");
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge).toContainText("Tests passed: 4 of 5");
    await editor.fill(ADJUSTED_DIFFERENCE);
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge).toContainText("Tests passed: 5 of 5");
    await page.reload();
    await expect(editor).toHaveValue(ADJUSTED_DIFFERENCE);
    await expect(challenge).toContainText("Tests passed: 5 of 5");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });
