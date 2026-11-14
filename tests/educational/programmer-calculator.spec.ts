// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { watchErrors } from "./module1";

const lessons = [
  ["one-pattern-three-readings", "read-register"],
  ["same-bits-two-readings", "reading-explore"],
  ["four-bit-arithmetic", "four-bit-width"],
  ["building-constants", "movk-halves"],
  ["register-widths", "predict-two-registers"],
] as const;

for (const theme of ["light", "dark"] as const) {
  test(`the header calculator replaces duplicate scratch panels in ${theme}`, async ({
    page,
    context,
  }) => {
    const errors = watchErrors(page);
    await page.addInitScript(
      (value) => localStorage.setItem("assembly-lab:v1:theme", value),
      theme,
    );
    for (const [index, [lesson, teachingFigure]] of lessons.entries()) {
      if (index === 0) await page.goto(`#/lesson/${lesson}`);
      else
        await page.evaluate((id) => {
          location.hash = `#/lesson/${id}`;
        }, lesson);
      await expect(page.locator(`#ix-${teachingFigure}`)).toHaveCount(1);
      await expect(page.locator(".al-programmer-calculator")).toHaveCount(0);
      const before = await page.evaluate(
        (id) => localStorage.getItem(`assembly-lab:v1:${id}`),
        lesson,
      );
      const trigger = page.getByRole("button", { name: "Calculator", exact: true });
      await trigger.click();
      const panel = page.getByRole("dialog", { name: "Programmer calculator", exact: true });
      const a = panel.getByRole("textbox", { name: "Value A", exact: true });
      if (index === 0) {
        await context.setOffline(true);
        await a.fill("0xff");
        await panel.getByRole("textbox", { name: "Value B", exact: true }).fill("0b1");
        await panel.getByRole("button", { name: "Calculate", exact: true }).click();
        await context.setOffline(false);
      }
      await expect(a).toHaveValue("0xff");
      await expect(
        panel
          .getByRole("group", { name: "Retained result", exact: true })
          .locator("[data-pattern]"),
      ).toHaveAttribute("data-pattern", "256");
      await panel.getByRole("button", { name: "Close calculator", exact: true }).click();
      await expect(trigger).toBeFocused();
      expect(
        await page.evaluate((id) => localStorage.getItem(`assembly-lab:v1:${id}`), lesson),
      ).toBe(before);
      expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(
        false,
      );
    }
    expect(errors).toEqual([]);
  });
}
