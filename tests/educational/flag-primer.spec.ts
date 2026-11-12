// Copyright © 2026 Christopher Snow
import { test, expect } from "@playwright/test";
import { FLAG_PRIMER_STRINGS as S } from "../../packages/views/src/strings.flag-primer";

for (const theme of ["light", "dark"]) {
  test(`four-bit flags: fresh practice, restored answers and independent Arm gates (${theme})`, async ({
    page,
  }) => {
    await page.addInitScript(
      (theme) => localStorage.setItem("assembly-lab:v1:theme", theme),
      theme,
    );
    await page.goto("#/lesson/adding-and-the-flags");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const examples = page.locator("#ix-four-bit-flags");
    await expect(examples.locator("[data-focus]")).toHaveCount(4);
    for (const [focus, values] of [
      ["n", "1000"],
      ["z", "0100"],
      ["c", "0010"],
      ["v", "1001"],
    ]) {
      await expect(examples.locator(`[data-focus="${focus}"] .al-flag`)).toHaveCount(4);
      expect(
        await examples
          .locator(`[data-focus="${focus}"] .al-flag`)
          .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("data-value")).join("")),
      ).toBe(values);
    }
    const practice = page.locator("#ix-four-bit-flags-check");
    const prediction = page.locator("#ix-predict-readings");
    const adder = page.locator("#ix-add-columns");
    await expect(practice.locator("[data-primer-feedback]")).toHaveCount(0);
    await expect(adder.getByRole("button", { name: "Show all", exact: true })).toHaveCount(0);
    await practice.getByRole("button", { name: S.check, exact: true }).click();
    await expect(practice.getByRole("status")).toContainText(S.incomplete);
    for (const flag of ["N", "Z", "C", "V"])
      await practice
        .getByRole("group", { name: `Flag ${flag}`, exact: true })
        .getByRole("radio", { name: "0", exact: true })
        .check();
    await practice.getByRole("button", { name: S.check, exact: true }).click();
    await expect(practice.locator("[data-primer-feedback]")).toHaveAttribute(
      "data-correct",
      "false",
    );
    for (const flag of ["C", "V"])
      await practice
        .getByRole("group", { name: `Flag ${flag}`, exact: true })
        .getByRole("radio", { name: "1", exact: true })
        .check();
    await expect(practice.locator("[data-primer-feedback]")).toHaveCount(0);
    await practice.getByRole("button", { name: S.check, exact: true }).click();
    await expect(practice.locator("[data-primer-feedback]")).toHaveAttribute(
      "data-correct",
      "true",
    );
    await page.reload();
    await expect(practice.locator("[data-primer-feedback]")).toHaveAttribute(
      "data-correct",
      "true",
    );
    await expect(adder.getByRole("button", { name: "Show all", exact: true })).toHaveCount(0);
    // An incorrect committed Arm prediction still opens its investigation.
    await prediction.getByRole("radio", { name: "Both", exact: true }).check();
    await prediction.getByRole("button", { name: "Check your prediction", exact: true }).click();
    await expect(adder.getByRole("button", { name: "Show all", exact: true })).toBeVisible();
    await expect(
      page.locator("#ix-add-carry-out").getByRole("button", { name: "Show all", exact: true }),
    ).toHaveCount(0);
    await practice.getByRole("button", { name: S.reset, exact: true }).click();
    await expect(practice.getByRole("radio", { checked: true })).toHaveCount(0);
    await expect(practice.locator("[data-primer-feedback]")).toHaveCount(0);
    await expect(adder.getByRole("button", { name: "Show all", exact: true })).toBeVisible();
    const sizes = await practice.locator(".al-primer-choices label").evaluateAll((nodes) =>
      nodes.map((node) => ({
        w: node.getBoundingClientRect().width,
        h: node.getBoundingClientRect().height,
      })),
    );
    expect(sizes.every(({ w, h }) => w >= 44 && h >= 44)).toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  });
}
