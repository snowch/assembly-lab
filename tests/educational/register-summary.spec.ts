// Copyright © 2026 Christopher Snow
import { expect, test } from "@playwright/test";
import { openLesson, commit } from "./module1";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { MODULE0_STRINGS as M } from "../../packages/views/src/strings.module0";

for (const theme of ["light", "dark"] as const) {
  test(`compact registers wrap by content and retain their bit disclosure in ${theme}`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem("assembly-lab:v1:theme", value),
      theme,
    );
    await openLesson(page, "meet-the-machine");
    await commit(page, "predict-total", /In.*w0/);
    const figure = page.locator("#ix-step-trip");
    for (const width of [320, 360, 375, 390, 430, 812, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const cards = await figure.locator(".al-register-summary").evaluateAll((nodes) =>
        nodes.map((n) => {
          const r = n.getBoundingClientRect();
          return { top: r.top, right: r.right, left: r.left };
        }),
      );
      expect(cards).toHaveLength(4);
      if (width >= 360) expect(new Set(cards.map((r) => Math.round(r.top))).size).toBe(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      ).toBe(true);
    }
    const toggle = figure.getByRole("button", { name: M.registers.showBits });
    expect((await toggle.boundingBox())!.height).toBeGreaterThanOrEqual(40);
    await toggle.click();
    await expect(figure.getByRole("button", { name: M.registers.hideBits })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await expect(figure.locator(".al-bit")).toHaveCount(128);
    await figure.getByRole("button", { name: V.stepper.next, exact: true }).click();
    await figure.getByRole("button", { name: V.stepper.back, exact: true }).click();
    await expect(figure.locator(".al-bit")).toHaveCount(128);
    await figure.getByRole("button", { name: M.registers.hideBits }).click();
    // Text scaling may wrap whole summaries, but must preserve complete values and page containment.
    await page.setViewportSize({ width: 320, height: 900 });
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    await expect(figure.locator(".al-dreg-value")).toHaveText(["120", "85", "42", "15"]);
    expect(
      await figure
        .locator('.al-registers[data-view="decimal"]')
        .evaluate((n) => n.scrollWidth <= n.clientWidth),
    ).toBe(true);
  });
}
