// Copyright © 2026 Christopher Snow

import { expect, test, type Locator } from "@playwright/test";
import { fourBitReadings } from "@al/views";
import { shown } from "../../packages/views/src/readings";
import { designProblems } from "./design";

async function alignedTopBit(figure: Locator) {
  const bit = figure.locator('.al-toggle[data-top="true"]');
  const geometry = await bit.evaluate((button) => {
    const marker = button.querySelector(".al-top-flag")!;
    const b = button.getBoundingClientRect();
    const m = marker.getBoundingClientRect();
    const arrow = getComputedStyle(marker, "::after");
    const shift = new DOMMatrix(arrow.transform).m41;
    return {
      centre: b.x + b.width / 2,
      tip: m.x + parseFloat(arrow.left) + shift + parseFloat(arrow.borderLeftWidth),
      above: m.y + parseFloat(arrow.top) + parseFloat(arrow.borderTopWidth) <= b.y,
    };
  });
  expect(Math.abs(geometry.tip - geometry.centre)).toBeLessThan(0.5);
  expect(geometry.above).toBe(true);
}

for (const theme of ["light", "dark"] as const) {
  test(`appendix, computed examples and top-bit markers work in ${theme}`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.goto("#/");
    await page.locator("select").selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect(page.getByRole("link", { name: "Two’s complement", exact: true })).toBeVisible();
    await page.goto("#/lesson/same-bits-two-readings");
    await expect(
      page.getByText("Its unsigned weight is 2147483648.", { exact: false }),
    ).toBeVisible();
    const reader = page.locator("#ix-read-register");
    await alignedTopBit(reader);
    await reader.getByRole("button", { name: "Bit 31", exact: true }).click();
    await alignedTopBit(reader);
    const scratch = page.locator("#ix-scratch-minus-one");
    await scratch.locator("details.al-reader-scratch > summary").click();
    await alignedTopBit(scratch);
    await expect(page.locator("#ix-make-minus-one-solved code")).toHaveCount(0);
    await page.getByRole("link", { name: "Appendix B: Two’s complement", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Two’s complement");
    const reading = page.locator("#ix-four-bit-readings");
    const negation = page.locator("#ix-four-bit-negation");
    const expected = (pattern: string, kind: "signed" | "unsigned") => {
      const r = fourBitReadings(pattern);
      return `${r.places.map((p) => shown(p[kind])).join(" + ")} = ${shown(r[kind])}`;
    };
    await expect(reading.locator('[data-sum="unsigned"]')).toHaveText(expected("1010", "unsigned"));
    await expect(reading.locator('[data-sum="signed"]')).toHaveText(expected("1010", "signed"));
    await alignedTopBit(reading);
    await alignedTopBit(negation);
    const top = reading.getByRole("button", { name: "Bit 3", exact: true });
    await top.focus();
    await page.keyboard.press("Space");
    await expect(top).toHaveAttribute("aria-pressed", "false");
    await expect(reading.locator('[data-sum="signed"]')).toHaveText(expected("0010", "signed"));
    await expect(negation.locator('[data-value="before"]')).toHaveText("−6");
    await expect(negation.locator('[data-value="after"]')).toHaveText("6");
    await reading.getByRole("button", { name: "Reset to 1010" }).click();
    await expect(reading.locator('[data-sum="signed"]')).toHaveText(expected("1010", "signed"));
    await negation.getByRole("button", { name: "Try zero" }).click();
    await expect(negation.locator('[data-value="after"]')).toHaveText("0");
    await expect(negation.locator(".al-complement-extra")).toHaveText("1");
    await expect(negation.locator("[data-feedback]")).toContainText(
      "There is no separate negative-zero pattern.",
    );
    await negation.getByRole("button", { name: "Try −8" }).click();
    await expect(negation.locator('[data-value="after"]')).toHaveText("−8");
    await expect(negation.locator("[data-feedback]")).toContainText(
      "outside the four-bit signed range",
    );
    await negation.getByRole("button", { name: "Reset to 1010" }).click();
    await expect(negation.locator('[data-value="after"]')).toHaveText("6");
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    await page
      .getByRole("link", { name: "Return to Module 1: Signed and unsigned readings" })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Signed and unsigned readings",
    );
    expect(errors).toEqual([]);
  });
}
