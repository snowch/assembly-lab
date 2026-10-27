// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { PRIMITIVE_STRINGS as S } from "../../packages/views/src/strings.primitive";
import { designProblems } from "./design";
import { watchErrors } from "./module3";

for (const theme of ["light", "dark"] as const) {
  test(`two ordered arguments, one result and independent examples in ${theme}`, async ({
    page,
    isMobile,
  }) => {
    const errors = watchErrors(page);
    await page.goto("#/lesson/tiny-function");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const one = page.locator("#ix-worked-function");
    const two = page.locator("#ix-worked-two-argument-function");
    const caller = two.locator(".al-primitive-caller");
    const register = (name: string) => two.locator(`[data-register="${name}"]`);
    const value = (name: string) => register(name).locator(".al-dreg-value");
    await expect(two.getByRole("button", { name: S.run, exact: true })).toBeVisible();
    await expect(two.locator(".al-locked, .al-problem")).toHaveCount(0);
    await expect(caller).toContainText("add_ints(7, 5)");
    await expect(value("w0")).toHaveText("7");
    await expect(value("w1")).toHaveText("5");
    await expect(two).toContainText(S.argumentPathAt(0));
    await expect(two).toContainText(S.argumentPathAt(1));
    await expect(two.locator(".al-cline")).toContainText([
      "int add_ints(int a, int b)",
      "{",
      "return a + b;",
      "}",
    ]);
    await expect(two.locator(".al-compiler-lines")).toHaveCount(0);
    await two.getByRole("button", { name: S.run, exact: true }).click();
    await expect(value("w0")).toHaveText("12");
    await expect(value("w1")).toHaveText("5");
    await expect(register("w0")).toHaveAttribute("data-changed", "true");
    await expect(register("w1")).toHaveAttribute("data-changed", "false");
    await expect(caller).toContainText(S.callerWaiting);
    await expect(caller).toContainText("add_ints(7, 5)");
    await expect(two.locator('.al-insn[data-next="true"]')).toContainText("ret");
    await expect(two.locator('.al-cline[data-lit="true"]')).toContainText("return a + b;");
    await expect(one.locator(".al-primitive")).toHaveAttribute("data-k", "0");
    await page.reload();
    await expect(value("w0")).toHaveText("12");
    await expect(caller).toContainText(S.callerWaiting);
    await two.getByRole("button", { name: S.run, exact: true }).click();
    await expect(caller).toContainText(S.callerReturned(12));
    await expect(caller).toContainText("add_ints(7, 5)");
    await expect(value("w1")).toHaveText("5");
    await expect(register("w0")).toHaveAttribute("data-changed", "false");
    await page.reload();
    await expect(caller).toContainText(S.callerReturned(12));
    await one.getByRole("button", { name: S.run, exact: true }).click();
    await expect(one.locator('[data-register="w0"] .al-dreg-value')).toHaveText("8");
    await two.getByRole("button", { name: S.restart, exact: true }).click();
    await expect(value("w0")).toHaveText("7");
    await expect(value("w1")).toHaveText("5");
    await expect(one.locator(".al-primitive")).toHaveAttribute("data-k", "1");
    expect(await designProblems(page, isMobile)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
