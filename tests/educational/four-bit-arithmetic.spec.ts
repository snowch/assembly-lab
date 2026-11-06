// Copyright © 2026 Christopher Snow

import { expect, test, type Locator } from "@playwright/test";
import { designProblems } from "./design";
import { lessonLabel } from "./lesson-references";

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

// The separate cells must form the same four columns in every working row.
async function expectAlignedBits(workspace: Locator) {
  const geometry = await workspace.evaluate(async (root) => {
    await document.fonts.ready;
    const centres = (selector: string) =>
      [...root.querySelectorAll(selector)].map((element) => {
        const box = element.getBoundingClientRect();
        return { x: box.left + box.width / 2, width: box.width, height: box.height };
      });
    return [
      centres('[data-row="first"] code'),
      centres('[data-row="negated"] input'),
      centres('[data-row="result"] input'),
      centres(".al-four-carry-notes input"),
    ];
  });
  for (const row of geometry) {
    expect(row).toHaveLength(4);
    row.forEach((cell, index) => {
      expect(Math.abs(cell.x - geometry[0]![index]!.x)).toBeLessThan(1);
      expect(cell.width).toBeGreaterThanOrEqual(44);
      expect(cell.height).toBeGreaterThanOrEqual(44);
    });
  }
}

async function expectCells(cells: Locator, values: string[]) {
  await expect(cells).toHaveCount(values.length);
  for (let index = 0; index < values.length; index++)
    await expect(cells.nth(index)).toHaveValue(values[index]!);
}

async function fillCells(cells: Locator, pattern: string) {
  for (let index = 0; index < 4; index++) await cells.nth(index).fill(pattern[index] ?? "");
}

async function paste(cells: Locator, text: string) {
  await cells.first().evaluate((element, value) => {
    const data = new DataTransfer();
    data.setData("text/plain", value);
    element.dispatchEvent(
      new ClipboardEvent("paste", { clipboardData: data, bubbles: true, cancelable: true }),
    );
  }, text);
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
    await page.getByRole("link", { name: lessonLabel("four-bit-arithmetic"), exact: true }).click();
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
    const oppositeGroup = challenge.getByRole("group", { name: "Opposite of 0011", exact: true });
    const answerGroup = challenge.getByRole("group", {
      name: "Retained result of 0110 minus 0011",
      exact: true,
    });
    const opposite = oppositeGroup.locator("input");
    const answer = answerGroup.locator("input");
    await expect(workspace.locator('[data-row="first"] code')).toHaveText(["0", "1", "1", "0"]);
    await expectCells(notes, ["", "", "", ""]);
    await expectCells(opposite, ["", "", "", ""]);
    await expectCells(answer, ["", "", "", ""]);
    await expect(opposite.first()).toHaveAccessibleName("Opposite of 0011, bit 3");
    await expectAlignedBits(workspace);
    await notes.first().fill("9"); // Scratch notes are deliberately ungraded.
    await page.reload();
    await expect(notes.first()).toHaveValue("9");
    await expectCells(opposite, ["", "", "", ""]);
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".verdict.blocked")).toBeVisible();
    await opposite.first().focus();
    await page.keyboard.type("1101");
    await expectCells(opposite, ["1", "1", "0", "1"]);
    await expect(opposite.last()).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(opposite.nth(2)).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(opposite.last()).toBeFocused();
    await answer.nth(2).fill("1");
    await answer.nth(3).fill("1");
    await challenge.getByRole("radio", { name: "Discard it outside the four result bits" }).check();
    await page.reload();
    await expectCells(answer, ["", "", "1", "1"]); // Missing leading zeroes stay missing.
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".verdict-failure")).toHaveCount(1);
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await paste(answer, "10011");
    await expect(answerGroup.getByRole("alert")).toBeVisible();
    await expectCells(answer, ["", "", "1", "1"]); // Overlong paste is not silently truncated.
    await paste(answer, "00x1");
    await expect(answerGroup.getByRole("alert")).toBeVisible();
    await expectCells(answer, ["", "", "1", "1"]);
    await paste(answer, "00 11");
    await expectCells(answer, ["0", "0", "1", "1"]);
    await expect(answerGroup.getByRole("alert")).toHaveCount(0);
    await fillCells(opposite, "1100");
    await expectAlignedBits(workspace);
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".verdict-failure")).toHaveCount(1);
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await fillCells(opposite, "1101");
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".challenge-complete")).toBeVisible();
    await expect(solved).toContainText("Keeping the low four bits");
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    await page.reload();
    await expect(challenge.locator(".challenge-complete")).toBeVisible();
    await expect(notes.first()).toHaveValue("9");
    await expectCells(answer, ["0", "0", "1", "1"]);
    await expect(solved).toContainText("Keeping the low four bits");
    await challenge.getByRole("button", { name: "Clear work: Try 6 − 3", exact: true }).click();
    await challenge.getByRole("button", { name: "Discard work", exact: true }).click();
    await expect(challenge.locator(".challenge-complete")).toHaveCount(0);
    await expectCells(notes, ["", "", "", ""]);
    await expectCells(opposite, ["", "", "", ""]);
    await expectCells(answer, ["", "", "", ""]);
    await expectAlignedBits(workspace);
    await expect(solved.locator(".al-challenge-note")).toHaveCount(0);
    await expect(
      page.getByRole("link", {
        name: `Previous lesson ${lessonLabel("same-bits-two-readings")}`,
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole("link", {
        name: `Next lesson ${lessonLabel("arithmetic-on-register-bits")}`,
        exact: true,
      })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Arithmetic on register bits");
    expect(errors).toEqual([]);
  });
}
