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
      headReference: root.querySelector<SVGMarkerElement>("marker")!.refX.baseVal.value,
    };
  });
  for (const key of ["startX", "startY", "endX", "endY", "shaftX"] as const) {
    expect(Math.abs(geometry[key])).toBeLessThan(1);
  }
  expect(geometry.shaftHeight).toBeGreaterThan(15);
  expect(geometry.headReference).toBe(8);
}

// Measure visible character centres, rather than relying on shared CSS classes.
async function expectAlignedBits(workspace: Locator) {
  const geometry = await workspace.evaluate(async (root) => {
    await document.fonts.ready;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    const patterns = [...root.querySelectorAll<HTMLElement>(".al-four-pattern")].map((element) => {
      const style = getComputedStyle(element);
      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const advance = context.measureText("0").width;
      const left =
        element.getBoundingClientRect().left +
        parseFloat(style.borderLeftWidth) +
        parseFloat(style.paddingLeft) -
        element.scrollLeft;
      return Array.from({ length: 4 }, (_, index) => left + (index + 0.5) * advance);
    });
    const notes = [...root.querySelectorAll<HTMLInputElement>(".al-four-carry-notes input")].map(
      (element) => {
        const box = element.getBoundingClientRect();
        return box.left + box.width / 2;
      },
    );
    return { patterns, notes };
  });
  expect(geometry.patterns).toHaveLength(3);
  for (const row of [...geometry.patterns.slice(1), geometry.notes]) {
    row.forEach((centre, index) =>
      expect(Math.abs(centre - geometry.patterns[0]![index]!)).toBeLessThan(1),
    );
  }
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
    const workspace = challenge.locator(".al-four-workspace");
    const notes = workspace.locator(".al-four-carry-notes input");
    await expect(workspace.locator('[data-row="first"] code')).toHaveText("0110");
    await expect(notes).toHaveCount(4);
    for (const note of await notes.all()) await expect(note).toHaveValue("");
    await expectAlignedBits(workspace);
    await notes.first().fill("9"); // Scratch notes are deliberately ungraded.
    await page.reload();
    await expect(notes.first()).toHaveValue("9");
    await expect(
      challenge.getByRole("textbox", { name: "Opposite of 0011", exact: true }),
    ).toHaveValue("");
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".verdict.blocked")).toBeVisible();
    await challenge.getByRole("textbox", { name: "Opposite of 0011", exact: true }).fill("1100");
    await challenge
      .getByRole("textbox", { name: "Retained result of 0110 minus 0011", exact: true })
      .fill("0011");
    await challenge.getByRole("radio", { name: "Discard it outside the four result bits" }).check();
    await expectAlignedBits(workspace);
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".verdict-failure")).toHaveCount(1);
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await challenge.getByRole("textbox", { name: "Opposite of 0011", exact: true }).fill("1101");
    const answer = challenge.getByRole("textbox", {
      name: "Retained result of 0110 minus 0011",
      exact: true,
    });
    await answer.fill("10011");
    await expect(answer).toHaveValue("10011");
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".verdict-failure")).toHaveCount(1);
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await answer.fill("00 11");
    await expect(answer).toHaveValue("0011");
    await expectAlignedBits(workspace);
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".challenge-complete")).toBeVisible();
    await expect(solved).toContainText("Keeping the low four bits");
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    await page.reload();
    await expect(challenge.locator(".challenge-complete")).toBeVisible();
    await expect(notes.first()).toHaveValue("9");
    await expect(solved).toContainText("Keeping the low four bits");
    await challenge.getByRole("button", { name: "Clear work: Try 6 − 3", exact: true }).click();
    await challenge.getByRole("button", { name: "Discard work", exact: true }).click();
    await expect(challenge.locator(".challenge-complete")).toHaveCount(0);
    for (const note of await notes.all()) await expect(note).toHaveValue("");
    await expect(
      challenge.getByRole("textbox", { name: "Opposite of 0011", exact: true }),
    ).toHaveValue("");
    await expect(answer).toHaveValue("");
    await expectAlignedBits(workspace);
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: /Previous lesson Signed and unsigned readings/ }),
    ).toBeVisible();
    await page.getByRole("link", { name: /Next lesson Arithmetic on register bits/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Arithmetic on register bits");
    expect(errors).toEqual([]);
  });
}
