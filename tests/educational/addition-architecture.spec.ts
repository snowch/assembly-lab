// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { ADD_ARCHITECTURE_STRINGS as C } from "../../packages/views/src/strings.add-architecture";
import { designProblems } from "./design";
import { openLesson, watchErrors } from "./module1";

const S = C.assembly;
for (const width of [375, 700, 1280])
  for (const theme of ["light", "dark"] as const) {
    test(`one 32-bit ADD and its cropped detail at ${width}px in ${theme}`, async ({ page }) => {
      const errors = watchErrors(page);
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem("assembly-lab:v1:theme", value),
        theme,
      );
      await openLesson(page, "four-bit-arithmetic");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const figure = page.locator("#ix-add-architecture");
      await expect(figure.getByRole("textbox", { name: "w0", exact: true })).toHaveValue("3");
      await expect(figure.locator('[data-register="w2"]')).toHaveText("0");
      await expect(figure.locator("[data-output]")).toHaveCount(0);
      const run = figure.getByRole("button", { name: S.runAdd, exact: true });
      await run.scrollIntoViewIfNeeded();
      await run.focus();
      const scroll = await page.evaluate(() => scrollY);
      await page.keyboard.press("Enter");
      await expect(run).toBeFocused();
      expect(await page.evaluate(() => scrollY)).toBe(scroll);
      await expect(figure.locator('[data-register="w2"]')).toHaveText("6");
      await expect(figure.locator('[data-output="sum"]')).toHaveText("1");
      await expect(figure.locator('[data-output="carry"]')).toHaveText("1");
      await expect(figure.locator(".al-add-equation")).toHaveAttribute(
        "aria-label",
        /1 \+ 1 \+ 1 = 3, written 11 in binary/,
      );
      await expect(figure.locator(".al-bit")).toHaveCount(32);
      await figure.getByRole("textbox", { name: "w0", exact: true }).fill("15");
      await figure.getByRole("textbox", { name: "w1", exact: true }).fill("1");
      await figure.getByRole("button", { name: S.useInputs, exact: true }).click();
      await run.click();
      const bit3 = figure.getByRole("button", { name: "Bit 3", exact: true });
      await bit3.click();
      await page.mouse.move(0, 0);
      await bit3.evaluate((element) =>
        Promise.all(element.getAnimations().map((animation) => animation.finished)),
      );
      const selectedAppearance = await bit3.evaluate((element) => {
        const style = getComputedStyle(element);
        return [style.color, style.backgroundColor];
      });
      await bit3.hover();
      await bit3.evaluate((element) =>
        Promise.all(element.getAnimations().map((animation) => animation.finished)),
      );
      expect(
        await bit3.evaluate((element) => {
          const style = getComputedStyle(element);
          return [style.color, style.backgroundColor];
        }),
      ).toEqual(selectedAppearance);
      await expect(figure.locator('[data-register="w2"]')).toHaveText("16");
      await expect(figure.locator('[data-output="carry"]')).toHaveText("1");
      await expect(figure).toContainText("Carry out to bit 4");
      await figure.getByRole("textbox", { name: "w0", exact: true }).fill("0xffffffff");
      await figure.getByRole("textbox", { name: "w1", exact: true }).fill("0");
      await figure.getByRole("button", { name: S.useInputs, exact: true }).click();
      await run.click();
      await expect(figure.locator('[data-register="w0"]')).toHaveText("4294967295");
      await expect(figure.locator('[data-register="w2"]')).toHaveText("4294967295");
      const wrapped = await figure.locator("[data-register]").evaluateAll((elements) =>
        elements.flatMap((element) => {
          const range = document.createRange();
          range.selectNodeContents(element.firstChild!);
          const lines = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)));
          return lines.size === 1 && element.scrollWidth <= element.clientWidth + 1
            ? []
            : [element.textContent];
        }),
      );
      expect(wrapped).toEqual([]);
      expect(await designProblems(page, width < 500)).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      await figure.getByRole("button", { name: S.reset, exact: true }).click();
      await expect(figure.locator('[data-register="w2"]')).toHaveText("0");
      await expect(figure.locator("[data-output]")).toHaveCount(0);
      expect(errors).toEqual([]);
    });
  }

test("loads saved inputs and instruction state after refresh, and rejects invalid new inputs", async ({
  page,
}) => {
  await openLesson(page, "four-bit-arithmetic");
  const figure = page.locator("#ix-add-architecture");
  await figure.getByRole("textbox", { name: "w0", exact: true }).fill("0xffffffff");
  await figure.getByRole("textbox", { name: "w1", exact: true }).fill("1");
  await figure.getByRole("button", { name: S.useInputs, exact: true }).click();
  await figure.getByRole("button", { name: S.runAdd, exact: true }).click();
  await page.reload();
  await expect(figure.locator('[data-register="w2"]')).toHaveText("0");
  await expect(figure.locator('[data-executed="true"]')).toBeVisible();
  await expect(figure.locator(".al-bit")).toHaveText([..."0".repeat(32)]);
  await figure.getByRole("textbox", { name: "w0", exact: true }).fill("4294967296");
  await figure.getByRole("button", { name: S.useInputs, exact: true }).click();
  await expect(figure.getByRole("alert")).toContainText("4294967295");
  await expect(figure.locator('[data-register="w0"]')).toHaveText("4294967295");
  await figure.getByRole("button", { name: S.back, exact: true }).click();
  await expect(figure.locator("[data-output]")).toHaveCount(0);
  await expect(figure.locator('[data-register="w2"]')).toHaveText("0");
});
