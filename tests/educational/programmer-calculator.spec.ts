// Copyright © 2026 Christopher Snow

import { expect, test, type Locator } from "@playwright/test";
import { watchErrors } from "./module1";
import { designProblems } from "./design";

const lessons = [
  ["one-pattern-three-readings", "hexadecimal", "32"],
  ["same-bits-two-readings", "readings", "32"],
  ["four-bit-arithmetic", "arithmetic", "4"],
  ["building-constants", "halves", "32"],
  ["register-widths", "widths", "64"],
] as const;
const decimal = (calc: Locator) => calc.locator("output[data-reading]");
const hex = (calc: Locator) => calc.locator("output[data-pattern]");
async function apply(calc: Locator, text: string, format = "decimal") {
  await calc.getByRole("combobox", { name: "Entry format", exact: true }).selectOption(format);
  await calc.getByLabel("Value to enter", { exact: true }).fill(text);
  await calc.getByLabel("Value to enter", { exact: true }).press("Enter");
}
for (const theme of ["light", "dark"] as const) {
  for (const [lesson, preset, bits] of lessons) {
    test(`${preset} programmer calculator is local and independent in ${theme}`, async ({
      page,
      context,
      isMobile,
    }) => {
      const errors = watchErrors(page);
      await page.goto(`#/lesson/${lesson}`);
      await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const calc = page.locator(`.al-programmer-calculator[data-preset="${preset}"]`);
      await expect(calc).toHaveJSProperty("open", false);
      const before = await page.evaluate(
        (id) => localStorage.getItem(`assembly-lab:v1:${id}`),
        lesson,
      );
      await calc.locator(":scope > summary").focus();
      await page.keyboard.press("Enter");
      await expect(calc.locator("button[data-bit]")).toHaveCount(Number(bits));
      // Loaded course code contains the calculator. Its scratch work needs no external service.
      await context.setOffline(true);
      await apply(calc, "42");
      if (preset === "arithmetic") {
        await expect(calc.getByLabel("Value to enter", { exact: true })).toHaveAttribute(
          "aria-invalid",
          "true",
        );
        await expect(decimal(calc)).toHaveText("3");
        await apply(calc, "15");
        await calc.getByRole("button", { name: "Calculate", exact: true }).click();
        await expect(decimal(calc)).toHaveText("0");
        await expect(calc.locator(".al-programmer-result")).toContainText("16");
      } else {
        await expect(decimal(calc)).toHaveText("42");
        await expect(hex(calc)).toContainText("002A");
      }
      if (preset === "readings" || preset === "widths") {
        await apply(calc, preset === "widths" ? "FFFFFFFFFFFFFFFF" : "FFFFFFFF", "hex");
        const pattern = await hex(calc).textContent();
        await calc.getByRole("button", { name: "Signed", exact: true }).click();
        await expect(decimal(calc)).toHaveText("-1");
        await expect(hex(calc)).toHaveText(pattern!);
        await calc.getByRole("button", { name: "Unsigned", exact: true }).click();
        if (preset === "widths") {
          await expect(decimal(calc)).toHaveText("18,446,744,073,709,551,615");
          await calc.getByRole("button", { name: "32 bits", exact: true }).click();
          await calc.getByRole("button", { name: "64 bits", exact: true }).click();
          await expect(hex(calc)).toHaveText("0x0000 0000 FFFF FFFF");
          await apply(calc, "FFFFFFFFFFFFFFFF", "hex");
          await calc.getByLabel("Second value", { exact: true }).fill("18446744073709551615");
          await calc.getByRole("button", { name: "Calculate", exact: true }).click();
          await expect(decimal(calc)).toHaveText("18,446,744,073,709,551,614");
          await expect(calc.locator(".al-programmer-result")).toContainText(
            "36,893,488,147,419,103,230",
          );
          expect(
            await calc.locator(".al-programmer-result .al-programmer-number-group").evaluateAll(
              (groups) =>
                groups.length > 0 &&
                groups.every((group) => {
                  const rects = [...group.getClientRects()].filter(
                    (r) => r.width > 0 && r.height > 0,
                  );
                  const first = rects[0];
                  return (
                    first !== undefined &&
                    rects.every(
                      (r) =>
                        Math.abs(r.top - first.top) < 1 && Math.abs(r.bottom - first.bottom) < 1,
                    )
                  );
                }),
            ),
          ).toBe(true);
        }
      }
      if (preset === "halves") {
        await apply(calc, "00020003", "hex");
        await calc.getByLabel("Half value in decimal", { exact: true }).fill("4");
        await calc.getByRole("button", { name: "Apply half", exact: true }).click();
        await expect(hex(calc)).toHaveText("0x0004 0003");
        await calc.getByLabel("Shift amount in bits", { exact: true }).fill("1");
        await calc.getByRole("button", { name: "Shift left", exact: true }).click();
        await expect(hex(calc)).toHaveText("0x0008 0006");
      }
      const bit = calc.getByRole("button", { name: "Bit 0", exact: true });
      await bit.focus();
      await page.keyboard.press("Space");
      await expect(bit).toBeFocused();
      const working = await hex(calc).textContent();
      await calc.locator(".al-programmer-guide > summary").click();
      const answer = calc.locator(".al-programmer-guide-answers input").first();
      await answer.fill("12");
      await calc.getByRole("button", { name: "Reset guide", exact: true }).click();
      await expect(answer).toHaveValue("");
      await expect(hex(calc)).toHaveText(working!);
      await calc.getByRole("button", { name: "Load task", exact: true }).click();
      await expect(answer).toHaveValue("");
      await expect(
        calc.getByText("Task values loaded in the calculator. Your answer fields are unchanged.", {
          exact: true,
        }),
      ).toBeVisible();
      await calc.getByRole("button", { name: "Go to calculator", exact: true }).click();
      await expect(calc.getByLabel("Value to enter", { exact: true })).toBeFocused();
      await calc.getByRole("button", { name: "Reset calculator", exact: true }).focus();
      await page.keyboard.press("Enter");
      await expect(
        calc.getByRole("button", { name: "Reset calculator", exact: true }),
      ).toBeFocused();
      expect(
        await page.evaluate((id) => localStorage.getItem(`assembly-lab:v1:${id}`), lesson),
      ).toBe(before);
      await context.setOffline(false);
      expect(await designProblems(page, isMobile)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}

test("bit rows use the calculator's available width, including all 32 bits on a wide lesson", async ({
  page,
  isMobile,
}) => {
  test.skip(
    isMobile,
    "Fine-pointer desktop column thresholds; touch targets are checked in each phone preset.",
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("#/lesson/one-pattern-three-readings");
  const calc = page.locator('.al-programmer-calculator[data-preset="hexadecimal"]');
  await calc.locator(":scope > summary").click();
  const grid = calc.locator(".al-programmer-bits");
  const columns = () =>
    grid.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(/\s+/).length);
  for (const [width, expected] of [
    [220, 4],
    [400, 8],
    [700, 16],
  ] as const) {
    await calc.evaluate((el, n) => {
      el.style.maxWidth = `${n}px`;
    }, width);
    await expect.poll(columns).toBe(expected);
  }
  await calc.evaluate((el) => {
    el.style.maxWidth = "";
  });
  await expect.poll(columns).toBe(32);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
