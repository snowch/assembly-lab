// Copyright © 2026 Christopher Snow

import { expect, test, type Locator } from "@playwright/test";
import { designProblems } from "./design";

// Check the drawn arrow, including its head, actually reaches both destinations.
async function expectConnectedCarry(addition: Locator) {
  const geometry = await addition.evaluate((root) => {
    const path = root.querySelector<SVGPathElement>(".al-four-carry-path")!;
    const diagram = root.querySelector(".al-four-diagram")!.getBoundingClientRect();
    const source = root.querySelector('[data-carry-source="true"]')!.getBoundingClientRect();
    const target = root.querySelector('[data-destination="carry"]')!.getBoundingClientRect();
    const length = path.getTotalLength();
    const start = path.getPointAtLength(0);
    const end = path.getPointAtLength(length);
    const shaft = path.getPointAtLength(length - 16);
    return {
      startX: start.x - (source.left + source.width / 2 - diagram.left),
      startY: start.y - (source.bottom - diagram.top),
      endX: end.x - (target.left + target.width / 2 - diagram.left),
      endY: end.y - (target.top - diagram.top),
      shaftX: shaft.x - end.x,
      shaftHeight: end.y - shaft.y,
    };
  });
  for (const key of ["startX", "startY", "endX", "endY", "shaftX"] as const) {
    expect(Math.abs(geometry[key])).toBeLessThan(1);
  }
  expect(geometry.shaftHeight).toBeGreaterThan(15);
}

for (const theme of ["light", "dark"] as const) {
  test(`four-bit arithmetic teaches carries and grades fresh subtraction in ${theme}`, async ({
    page,
  }, info) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("#/");
    await page.locator("select").selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await page.getByRole("link", { name: "Arithmetic with four bits", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Arithmetic with four bits");
    const addition = page.locator("#ix-four-bit-addition");
    const result = addition.locator('[data-row="result"] .al-four-value');
    await expect(result).toHaveText(["?", "?", "?", "?"]);
    await expect(addition.locator('[data-row="carry"] .al-four-value')).toHaveText([
      "?",
      "?",
      "?",
      "0",
    ]);
    await expect(addition.locator('[data-row="a"] .al-four-value')).toHaveText([
      "0",
      "0",
      "1",
      "1",
    ]);
    await expect(addition.locator('[data-row="b"] .al-four-value')).toHaveText([
      "0",
      "0",
      "0",
      "1",
    ]);
    const next = addition.getByRole("button", { name: "Next column" });
    await next.focus();
    await page.keyboard.press("Space");
    await expect(result).toHaveText(["?", "?", "?", "0"]);
    await expect(addition.locator('[data-destination="carry"] .al-four-value')).toHaveText("1");
    await expect(addition.locator('[data-destination="kept"] .al-four-value')).toHaveText("0");
    await expectConnectedCarry(addition);
    for (let i = 0; i < 3; i++) await next.click();
    await expect(result).toHaveText(["0", "1", "0", "0"]);
    await expect(next).toBeDisabled();
    await expectConnectedCarry(addition);
    await expect(addition.locator('[data-reading="unsigned"]')).toHaveText("4");
    await addition.getByRole("button", { name: "Reset", exact: true }).click();
    await expect(result).toHaveText(["?", "?", "?", "?"]);
    await expect(next).toBeEnabled();

    const wrap = page.locator("#ix-four-bit-width");
    await expect(wrap.locator('[data-outside="true"] .al-four-value')).toHaveText("1");
    await expect(wrap.locator('[data-reading="pattern"]')).toHaveText("0000");
    const subtraction = page.locator("#ix-four-bit-subtraction");
    await expect(subtraction.locator("[data-stage]")).toHaveText(["0101", "1010", "1011"]);
    await expect(subtraction.locator('[data-reading="pattern"]')).toHaveText("1110");
    await expect(page.locator(".al-four-walkthrough")).toHaveCount(1);
    await expect(subtraction.locator('[data-reading="signed"]')).toHaveText("−8 + 4 + 2 = −2");

    const challenge = page.locator("#ix-four-bit-practice");
    const solved = page.locator("#ix-four-bit-solved");
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".verdict.blocked")).toBeVisible();
    await challenge.getByRole("textbox", { name: "Opposite of 0011", exact: true }).fill("1100");
    await challenge
      .getByRole("textbox", { name: "Retained result of 0110 minus 0011", exact: true })
      .fill("0011");
    await challenge.getByRole("radio", { name: "Discard it outside the four result bits" }).check();
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".verdict-failure")).toHaveCount(1);
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await challenge.getByRole("textbox", { name: "Opposite of 0011", exact: true }).fill("1101");
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".challenge-complete")).toBeVisible();
    await expect(solved).toContainText("Keeping the low four bits");
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    await page.reload();
    await expect(challenge.locator(".challenge-complete")).toBeVisible();
    await expect(solved).toContainText("Keeping the low four bits");
    await challenge.getByRole("button", { name: "Clear work: Try 6 − 3", exact: true }).click();
    await challenge.getByRole("button", { name: "Discard work", exact: true }).click();
    await expect(challenge.locator(".challenge-complete")).toHaveCount(0);
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Previous lesson Signed and unsigned readings/ }),
    ).toBeVisible();
    await page.getByRole("link", { name: /Next lesson Arithmetic on register bits/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Arithmetic on register bits");
    expect(errors).toEqual([]);
  });
}
