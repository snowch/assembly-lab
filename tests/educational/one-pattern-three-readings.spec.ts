// Copyright © 2026 Christopher Snow

// Module 1, lesson 1, One pattern, three readings, in a browser, on the built site, at desktop and
// phone widths: the lesson loads without an error; the first figure's values are the model's; the
// prediction about adding 12 commits before it reveals, and the stepper after it stays shut until
// it has; the register to read gives the readings the model gives for any bits set, with the sums;
// the comparison of the two listings waits for its prediction and is made by the model; both
// challenges are completed (by setting bits with a mouse or a finger, and typing numbers); wrong
// answers are rejected without the right value; a completion survives a reload and is graded
// again; Clear work removes it; and the page keeps the look the shell's own pages keep.

import { expect, test, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { assemble } from "@al/machine";
import {
  readingsOfPattern,
  worths,
  shown,
  patternOf,
  topBitTable,
} from "../../packages/views/src/readings";
import { MODULE1_STRINGS as M1 } from "../../packages/views/src/strings.module1";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { assemblyOf, parseListing } from "../../packages/views/src/listing";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";

import {
  FUEL_CALL,
  FUEL_USED_WRONG,
  FUEL_USED_WRONG_PLUS_12,
  FUEL_USED_WRONG_U,
} from "../../content/lessons/module-1.listings";
import { PROSE } from "../../content/lessons/one-pattern-three-readings.prose";
import { designProblems } from "./design";
import {
  bit,
  blocked,
  challenge,
  commit,
  complete,
  failing,
  figureOverflow,
  openLesson as open,
  passing,
  press,
  registerValue,
  run,
  setBits,
  status,
  stored,
  watchErrors,
} from "./module1";

const LESSON_ID = "one-pattern-three-readings";
const lesson = LESSONS.find((l) => l.id === LESSON_ID)!;
const MAKE = "make-minus-one";
const READ = "two-readings-each";
const openLesson = (page: Page) => open(page, LESSON_ID);

const ONES = "1".repeat(32);
const MINUS_12 = patternOf(-12);

test("the lesson loads with no console error, ten sections, and its two challenges", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await openLesson(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
  await expect(page.locator("section.challenge")).toHaveCount(2);
  await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
  await expect(page.locator("a.back-link").first()).toHaveAttribute("href", "#/");
  await expect(page).toHaveTitle(`${lesson.title} / Assembly Lab`);
  expect(errors).toEqual([]);
});

test.describe("the first figure", () => {
  test("shows fuel_used(50, 38) with the C and the instructions GCC recorded, and 4294967284 in w0 after the subtraction", async ({
    page,
  }) => {
    await openLesson(page);
    const figure = page.locator("#ix-run-fuel-used");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-cline .al-src")).toHaveText([FUEL_USED_WRONG.c]);
    await expect(figure.locator(".al-insn .al-text")).toHaveText(["sub w0, w1, w0", "ret"]);
    await expect(registerValue(figure, "w0")).toHaveText("50");
    await expect(registerValue(figure, "w1")).toHaveText("38");
    const model = traceOf(FUEL_USED_WRONG, FUEL_CALL);
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
    expect(wValue(viewAt(model, 1).state, 0)).toBe(4294967284);
    await expect(registerValue(figure, "w0")).toHaveText("4294967284");
    await expect(registerValue(figure, "w1")).toHaveText("38");
    await expect(figure.locator('[data-changed="true"]')).toHaveAttribute("data-register", "w0");
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
    await expect(registerValue(figure, "w0")).toHaveText("4294967284");
    await expect(figure.locator("[role=status]")).toContainText(V.stepper.ended);
  });
});

test.describe("the prediction about adding 12", () => {
  test("the stepper after it stays shut until the prediction is checked", async ({ page }) => {
    await openLesson(page);
    const stepper = page.locator("#ix-step-add-12");
    await expect(stepper.locator(".al-locked")).toBeVisible();
    await expect(stepper.getByRole("button", { name: V.stepper.next })).toHaveCount(0);
    await commit(page, "predict-add-12", "0");
    await expect(stepper.locator(".al-locked")).toHaveCount(0);
  });

  for (const [option, match] of [
    ["0", true],
    ["4294967296", false],
    ["24", false],
    [/^the run stops/, false],
  ] as const) {
    test(`commits before it reveals: ${String(option)} ${match ? "matches" : "does not match"} the model`, async ({
      page,
    }) => {
      await openLesson(page);
      const figure = page.locator("#ix-predict-add-12");
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator(".al-outcome")).toHaveCount(0);
      await expect(figure.getByRole("button", { name: V.prediction.commit })).toBeDisabled();
      await figure.getByRole("radio", { name: option, exact: typeof option === "string" }).check();
      // A choice is not a commitment: nothing is shown until it is checked.
      await expect(figure.locator(".al-outcome")).toHaveCount(0);
      await press(page, figure.getByRole("button", { name: V.prediction.commit }));
      await expect(figure.locator(match ? ".al-match" : ".al-nomatch")).toContainText(
        match ? V.prediction.match : V.prediction.noMatch,
      );
      await expect(figure.locator(".al-outcome")).toContainText("held 0 when the run ended");
      await expect(figure.locator(".al-outcome .prose")).toContainText(
        PROSE.predictionExplain.split("\n")[0]!.replaceAll("`", "").slice(0, 40),
      );
    });
  }

  test("the stepper then shows the model's values: 4294967284 after the sub, 0 after the add", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-add-12", "0");
    const figure = page.locator("#ix-step-add-12");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-insn .al-text")).toHaveText([
      "sub w0, w1, w0",
      "add w0, w0, 12",
      "ret",
    ]);
    // The added line has no C line beside it.
    await expect(figure.locator(".al-insn .al-ctag")).toHaveText(["1", "1"]);
    const model = traceOf(FUEL_USED_WRONG_PLUS_12, FUEL_CALL);
    const next = figure.getByRole("button", { name: V.stepper.next });
    for (const k of [1, 2, 3]) {
      await press(page, next);
      const w0 = String(wValue(viewAt(model, k).state, 0));
      await expect(registerValue(figure, "w0")).toHaveText(w0);
    }
    await expect(registerValue(figure, "w0")).toHaveText("0");
    await expect(next).toBeDisabled();
  });

  test("a commitment is kept, and is still there after a reload", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-add-12", "0");
    await page.reload();
    await expect(page.locator("#ix-predict-add-12 .al-match")).toBeVisible();
    await expect(page.locator("#ix-step-add-12 .al-locked")).toHaveCount(0);
  });
});

test.describe("the register to read", () => {
  const reader = (page: Page) => page.locator("#ix-read-register");
  const reading = (page: Page, name: string) => reader(page).locator(`[data-reading="${name}"]`);
  const cell = (page: Page, row: string, column: "unsigned" | "signed") =>
    reader(page).locator(
      `tr[data-row="${row}"] td[data-cell="${column}"], tr[data-row="${row}"] td[data-reading="${column}"]`,
    );
  /** The pattern `w0` holds after fuel_used_wrong(50, 38), from the model: what the figure starts at. */
  const START = patternOf(wValue(traceOf(FUEL_USED_WRONG, FUEL_CALL).result.final, 0));
  const clear = (page: Page) =>
    press(page, reader(page).getByRole("button", { name: M1.reader.clearBits }));
  /** A part of a reading as the table writes it. */
  const part = (n: number) => (n > 0 ? `+${n}` : shown(n));

  /** What the page shows for a pattern is what the model gives. */
  async function expectReadings(page: Page, pattern: string) {
    const r = readingsOfPattern(pattern);
    const t = topBitTable(pattern);
    await expect(reading(page, "hex")).toContainText(`0x${r.digits}`);
    await expect(reading(page, "hex").locator(".al-reading-name")).toHaveText(M1.reader.pattern);
    await expect(cell(page, "top", "unsigned")).toHaveText(part(t.top.unsigned));
    await expect(cell(page, "top", "signed")).toHaveText(part(t.top.signed));
    await expect(cell(page, "other", "unsigned")).toHaveText(part(t.other));
    await expect(cell(page, "other", "signed")).toHaveText(part(t.other));
    await expect(cell(page, "result", "unsigned")).toHaveText(String(r.unsigned));
    await expect(cell(page, "result", "signed")).toHaveText(shown(r.signed));
    for (const way of ["unsigned", "signed"] as const) {
      const terms = worths(pattern, way).map(shown);
      const total = shown(r[way]);
      const want = terms.length === 0 ? "0" : terms.join(" + ");
      await expect(reader(page).locator(`[data-sum="${way}"] .al-sum`)).toHaveText(
        `${want} = ${total}`,
      );
    }
    await expect(reader(page).locator(".al-digit")).toHaveText(r.digits.split(""));
    // Each digit is the hexadecimal digit of its four bits.
    for (let i = 0; i < 8; i++) {
      const four = pattern.slice(i * 4, i * 4 + 4);
      await expect(reader(page).locator(`.al-digit[data-digit="${i}"]`)).toHaveText(
        parseInt(four, 2).toString(16),
      );
    }
  }

  test("starts at the pattern the model leaves in w0, with 29 of the 32 bits set, and the page does not write it", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await expect(reader(page).locator(".al-toggle")).toHaveCount(32);
    await expect(reader(page).locator('.al-toggle[aria-pressed="true"]')).toHaveCount(29);
    await expectReadings(page, START);
    await expect(reading(page, "hex")).toContainText("0xfffffff4");
  });

  test("gives 4294967284 and −12 in the result row, from +2147483648 or −2147483648 and 2147483636", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await expect(cell(page, "top", "unsigned")).toHaveText("+2147483648");
    await expect(cell(page, "top", "signed")).toHaveText("−2147483648");
    await expect(cell(page, "other", "unsigned")).toHaveText("+2147483636");
    await expect(cell(page, "other", "signed")).toHaveText("+2147483636");
    await expect(cell(page, "result", "unsigned")).toHaveText("4294967284");
    await expect(cell(page, "result", "signed")).toHaveText("−12");
  });

  test("has the table's own words: the columns, the rows, and the pattern named as the pattern", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await expect(reader(page).locator("thead th")).toHaveText([V.reader.unsigned, V.reader.signed]);
    await expect(reader(page).locator("tbody th")).toHaveText([
      "Top bit (bit 31)",
      "Other 31 bits",
      "Result",
    ]);
    // The pattern is not in the table of readings.
    await expect(reader(page).locator("table [data-reading='hex']")).toHaveCount(0);
  });

  test("updates both readings when bit 31 is pressed, and the two agree with the top bit at 0", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await press(page, bit(reader(page), 31));
    const without = "0" + START.slice(1);
    await expectReadings(page, without);
    await expect(cell(page, "top", "unsigned")).toHaveText("0");
    await expect(cell(page, "top", "signed")).toHaveText("0");
    const unsigned = await cell(page, "result", "unsigned").textContent();
    await expect(cell(page, "result", "signed")).toHaveText(unsigned!);
    await press(page, bit(reader(page), 31));
    await expectReadings(page, START);
  });

  test("clears every bit with Clear bits, and sets bits from zero", async ({ page }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await clear(page);
    await expect(reader(page).locator('.al-toggle[aria-pressed="true"]')).toHaveCount(0);
    await expectReadings(page, "0".repeat(32));
    await setBits(page, reader(page), MINUS_12);
    await expectReadings(page, MINUS_12);
    await expect(reading(page, "hex")).toContainText("0xfffffff4");
  });

  test("shows plus and minus 2147483648 for the top bit alone, and every other bit the same in both", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await clear(page);
    await press(page, bit(reader(page), 31));
    await expectReadings(page, "1" + "0".repeat(31));
    await expect(reader(page).locator('[data-sum="unsigned"] .al-sum')).toHaveText(
      "2147483648 = 2147483648",
    );
    await expect(reader(page).locator('[data-sum="signed"] .al-sum')).toHaveText(
      "−2147483648 = −2147483648",
    );
    await press(page, bit(reader(page), 31));
    await press(page, bit(reader(page), 5));
    await expectReadings(page, "0".repeat(26) + "100000");
    await expect(cell(page, "result", "unsigned")).toHaveText("32");
    await expect(cell(page, "result", "signed")).toHaveText("32");
  });

  test("a bit pressed twice is back to what it was, and a pattern read again is the same", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await clear(page);
    await press(page, bit(reader(page), 0));
    await expect(bit(reader(page), 0)).toHaveAttribute("aria-pressed", "true");
    await press(page, bit(reader(page), 0));
    await expect(bit(reader(page), 0)).toHaveAttribute("aria-pressed", "false");
    await expectReadings(page, "0".repeat(32));
  });

  test("marks bit 31 as the top bit with a word and a border as well as its worth", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await expect(reader(page).locator(".al-top-flag")).toHaveText(M1.toggles.topBit);
    await expect(reader(page).locator('.al-toggle[data-top="true"]')).toHaveCount(1);
    const style = await bit(reader(page), 31).evaluate((el) => {
      const cs = getComputedStyle(el);
      return [cs.borderTopStyle, cs.borderTopWidth];
    });
    expect(style).toEqual(["double", "4px"]);
    const other = await bit(reader(page), 30).evaluate((el) => getComputedStyle(el).borderTopStyle);
    expect(other).toBe("solid");
  });

  test("outlines the four bits and their digit together when a bit has the focus or the pointer", async ({
    page,
  }, info) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    const lit = reader(page).locator('.al-nibble[data-lit="true"]');
    await expect(lit).toHaveCount(0);
    await bit(reader(page), 21).focus();
    await expect(lit).toHaveCount(1);
    await expect(lit.locator(".al-toggle")).toHaveCount(4);
    await expect(lit.locator(".al-digit")).toHaveAttribute("data-digit", "2");
    // The outline is a line, and the digit is underlined: not colour alone.
    const marks = await lit.evaluate((el) => [
      getComputedStyle(el).outlineStyle,
      getComputedStyle(el).outlineWidth,
      getComputedStyle(el.querySelector(".al-digit")!).textDecorationLine,
    ]);
    expect(marks).toEqual(["solid", "2px", "underline"]);
    await bit(reader(page), 21).blur();
    await expect(lit).toHaveCount(0);
    if (info.project.name === "desktop") {
      await bit(reader(page), 9).hover();
      await expect(lit).toHaveCount(1);
      await expect(lit.locator(".al-digit")).toHaveAttribute("data-digit", "5");
    }
  });

  test("keeps each digit under its four bits at the width of the screen", async ({ page }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    for (let i = 0; i < 8; i++) {
      const nibble = reader(page).locator(".al-nibble").nth(i);
      const bits = await nibble
        .locator(".al-toggle")
        .evaluateAll((els) => els.map((e) => e.getBoundingClientRect()));
      const digit = await nibble.locator(".al-digit").boundingBox();
      expect(digit, `digit ${i}`).not.toBeNull();
      const left = Math.min(...bits.map((b) => b.left));
      const right = Math.max(...bits.map((b) => b.right));
      const bottom = Math.max(...bits.map((b) => b.bottom));
      // The digit is inside the span of its four bits, and below them.
      expect(digit!.x + digit!.width / 2).toBeGreaterThan(left);
      expect(digit!.x + digit!.width / 2).toBeLessThan(right);
      expect(digit!.y).toBeGreaterThanOrEqual(bottom - 1);
    }
  });

  test("holds the sum of every bit in Show calculation, shut at first, opened with the keyboard, and the table does not move", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    const calc = reader(page).locator("details.al-calc");
    const summary = calc.locator("summary");
    await expect(summary).toHaveText("Show calculation");
    await expect(calc).not.toHaveAttribute("open", "");
    await expect(reader(page).locator('[data-sum="unsigned"] .al-sum')).toBeHidden();
    const table = reader(page).locator("table");
    const before = await table.boundingBox();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(calc).toHaveAttribute("open", "");
    await expect(reader(page).locator('[data-sum="unsigned"] .al-sum')).toBeVisible();
    const after = await table.boundingBox();
    expect(after).not.toBeNull();
    expect(before).not.toBeNull();
    expect(after!.width).toBe(before!.width);
    expect(after!.height).toBe(before!.height);
    // Keyboard focus can round the phone's scroll position by a fraction of a CSS pixel.
    // Keep the table's size exact and reject any position change of a pixel or more.
    expect(Math.abs(after!.x - before!.x)).toBeLessThan(1);
    expect(Math.abs(after!.y - before!.y)).toBeLessThan(1);
    expect(await figureOverflow(page)).toEqual([]);
    await page.keyboard.press("Enter");
    await expect(calc).not.toHaveAttribute("open", "");
  });

  test("draws the bits in groups that fit the screen: a byte to a row on a phone, two on a desk", async ({
    page,
  }, info) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    const boxes = await reader(page)
      .locator(".al-toggle")
      .evaluateAll((els) =>
        els.map((e) => {
          const r = e.getBoundingClientRect();
          return { x: r.x, y: r.y, w: r.width, h: r.height };
        }),
      );
    const width = page.viewportSize()!.width;
    for (const b of boxes) {
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.w).toBeLessThanOrEqual(width);
      expect(b.h).toBeGreaterThanOrEqual(40);
      expect(b.w).toBeGreaterThanOrEqual(24);
    }
    const rows = new Set(boxes.map((b) => Math.round(b.y)));
    expect(rows.size).toBe(info.project.name === "phone" ? 4 : 2);
    // The top bit is first, and the bottom bit is last.
    expect(boxes[0]!.x).toBeLessThan(boxes[7]!.x);
    expect(await reader(page).locator(".al-toggle").first().getAttribute("data-bit")).toBe("31");
    expect(await reader(page).locator(".al-toggle").last().getAttribute("data-bit")).toBe("0");
  });

  test("keeps the controls at least 40 pixels tall on a phone, and nothing wider than the screen", async ({
    page,
  }, info) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    if (info.project.name === "phone") {
      for (const control of [
        reader(page).getByRole("button", { name: M1.reader.clearBits }),
        reader(page).locator("details.al-calc summary"),
      ]) {
        const box = await control.boundingBox();
        expect(box!.height).toBeGreaterThanOrEqual(40);
      }
    }
    expect(await figureOverflow(page)).toEqual([]);
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
  });
});

test.describe("the two listings compared", () => {
  const figure = (page: Page) => page.locator("#ix-compare-int-unsigned");

  test("shows the C of both functions, and nothing of their listings until the prediction is checked", async ({
    page,
  }) => {
    await openLesson(page);
    await figure(page).scrollIntoViewIfNeeded();
    await expect(figure(page).locator(".al-cline .al-src")).toHaveText([
      FUEL_USED_WRONG.c,
      FUEL_USED_WRONG_U.c,
    ]);
    await expect(figure(page).locator(".al-compare-result")).toHaveCount(0);
    await expect(figure(page).locator(".al-outcome")).toHaveCount(0);
    await expect(figure(page).getByText("sub w0, w1, w0")).toHaveCount(0);
    await figure(page)
      .getByRole("radio", { name: /^Nothing/ })
      .check();
    await expect(figure(page).locator(".al-compare-result")).toHaveCount(0);
  });

  test("compares the two line by line once checked, and the page's marks are the model's", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "compare-int-unsigned", /^Nothing/);
    const f = figure(page);
    await expect(f.locator(".al-match")).toContainText(V.compare.resultSame);
    // What the model says of the two listings, in the browser and here.
    const ops = (p: { listing: string }) =>
      assemble(assemblyOf(parseListing(p.listing))).program!.instructions.map((i) =>
        JSON.stringify(i.op, (_k, v) => (typeof v === "bigint" ? `${v}n` : v)),
      );
    expect(ops(FUEL_USED_WRONG)).toEqual(ops(FUEL_USED_WRONG_U));
    const rows = f.locator(".al-compare-row");
    await expect(rows).toHaveCount(2);
    await expect(rows.locator('[data-side="left"] code')).toHaveText(["sub w0, w1, w0", "ret"]);
    await expect(rows.locator('[data-side="right"] code')).toHaveText(["sub w0, w1, w0", "ret"]);
    await expect(rows.locator(".al-cmp-mark")).toHaveText([V.compare.same, V.compare.same]);
    await expect(f.locator(".al-compare-summary")).toHaveText(V.compare.allSame(2));
    await expect(f.locator(".al-outcome .prose")).toContainText("Both listings are");
  });

  test("a different answer is told it does not match, and the comparison still shows", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "compare-int-unsigned", /^It adds a check/);
    await expect(figure(page).locator(".al-nomatch")).toContainText(V.prediction.noMatch);
    await expect(figure(page).locator('.al-compare-row[data-same="true"]')).toHaveCount(2);
  });

  test("a commitment is kept after a reload, with the comparison", async ({ page }) => {
    await openLesson(page);
    await commit(page, "compare-int-unsigned", /^Nothing/);
    await page.reload();
    await expect(figure(page).locator(".al-match")).toBeVisible();
    await expect(figure(page).locator(".al-compare-row")).toHaveCount(2);
  });
});

test.describe("Make −1", () => {
  const answerBox = (page: Page) => challenge(page, MAKE).locator('[data-field="unsigned"] input');

  test("is blocked until the number is given, and says which", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await expect(c.locator('[data-field="bits"] .al-toggle')).toHaveCount(32);
    await press(page, run(c));
    await expect(status(c)).toHaveText(blocked);
    await expect(c.locator(".verdict.blocked")).toContainText("its unsigned reading");
  });

  test("rejects the pattern for −12, says what the learner's bits read as, and never the right bits or number", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await setBits(page, c, MINUS_12);
    await answerBox(page).fill("4294967284");
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(1, 2));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["the bits of w0"]);
    await expect(c.locator(".verdict-detail")).toHaveText(V.readings.bitsRead("−12"));
    await expect(c.locator(".verdict")).not.toContainText("4294967295");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("rejects all 32 bits set with a number that is not their unsigned reading", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await setBits(page, c, ONES);
    await answerBox(page).fill("-1");
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(1, 2));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["its unsigned reading"]);
    await expect(c.locator(".verdict")).not.toContainText("4294967295");
  });

  test("is completed by setting all 32 bits and giving their unsigned reading", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page);
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await setBits(page, c, ONES);
    await expect(c.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(32);
    await answerBox(page).fill(String(readingsOfPattern(ONES).unsigned));
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(2));
    await expect(c.locator(".challenge-complete")).toHaveText(complete);
    expect((await stored(page, LESSON_ID)).challenges[MAKE].artifact.answers.bits).toBe(ONES);
    expect(errors).toEqual([]);
  });

  test("keeps the bits after a reload, and grades them again", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await setBits(page, c, ONES);
    await answerBox(page).fill("4294967295");
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.reload();
    await expect(challenge(page, MAKE).locator(".challenge-complete")).toBeVisible();
    await expect(challenge(page, MAKE).locator('.al-toggle[aria-pressed="true"]')).toHaveCount(32);
    // What was kept is the work: change it in storage to bits that read otherwise, and the page
    // does not believe the old completion.
    await page.evaluate(
      ([k, pattern]) => {
        const s = JSON.parse(localStorage.getItem(k!)!);
        s.challenges["make-minus-one"].artifact.answers.bits = pattern;
        localStorage.setItem(k!, JSON.stringify(s));
      },
      [`assembly-lab:v1:${LESSON_ID}`, MINUS_12],
    );
    await page.reload();
    await expect(challenge(page, MAKE).locator(".challenge-complete")).toHaveCount(0);
    await expect(status(challenge(page, MAKE))).toHaveText(failing(0, 2));
  });

  test("goes when the work is cleared, with the bits", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await setBits(page, c, ONES);
    await answerBox(page).fill("4294967295");
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await expect(status(c)).toHaveText(S.challenge.resetDone);
    await expect(c.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(0);
    await expect(answerBox(page)).toHaveValue("");
    expect((await stored(page, LESSON_ID)).challenges[MAKE]).toBeUndefined();
  });
});

test.describe("Make −1, with the bits typed in hexadecimal", () => {
  const box = (page: Page) =>
    challenge(page, MAKE).getByRole("textbox", { name: M1.hexEntry.label });
  const answerBox = (page: Page) => challenge(page, MAKE).locator('[data-field="unsigned"] input');
  const pressed = (page: Page) => challenge(page, MAKE).locator('.al-toggle[aria-pressed="true"]');
  const solved =
    "With all 32 bits set, the signed reading is −1 and the unsigned reading is 4294967295.";

  test("has a box beside the 32 buttons, which starts as the bits are and fills in no answer", async ({
    page,
  }) => {
    await openLesson(page);
    await challenge(page, MAKE).scrollIntoViewIfNeeded();
    await expect(box(page)).toHaveValue("0x00000000");
    await expect(pressed(page)).toHaveCount(0);
    await expect(answerBox(page)).toHaveValue("");
    expect((await stored(page, LESSON_ID))?.challenges?.[MAKE]).toBeUndefined();
  });

  test("sets all 32 bits when ffffffff or 0xffffffff is typed, and stores them as 32 characters", async ({
    page,
  }) => {
    await openLesson(page);
    await challenge(page, MAKE).scrollIntoViewIfNeeded();
    for (const text of ["ffffffff", "0xffffffff"]) {
      await box(page).fill("");
      await box(page).fill(text);
      await expect(pressed(page), text).toHaveCount(32);
      expect((await stored(page, LESSON_ID)).challenges[MAKE].artifact.answers.bits, text).toBe(
        ONES,
      );
      await press(page, bit(challenge(page, MAKE), 5));
      await expect(pressed(page), text).toHaveCount(31);
      await expect(box(page), text).toHaveValue("0xffffffdf");
    }
  });

  test("puts the digits in the box when a bit is pressed", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await press(page, bit(c, 31));
    await expect(box(page)).toHaveValue("0x80000000");
    await press(page, bit(c, 0));
    await expect(box(page)).toHaveValue("0x80000001");
  });

  test("changes no bit for text that is not hexadecimal or has more than eight digits, says so, and does not move the page", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await press(page, bit(c, 4));
    const before = (await stored(page, LESSON_ID)).challenges[MAKE].artifact.answers.bits;
    const actions = c.locator(".challenge-actions");
    const position = () =>
      actions.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const parent = el.closest(".challenge")!.getBoundingClientRect();
        return { y: rect.y, relativeY: rect.y - parent.y, width: rect.width, height: rect.height };
      });
    const original = await position();
    for (const text of ["xyz", "fffffffff", "0xg1"]) {
      await box(page).fill(text);
      await expect(c.locator(".answer-hex-problem"), text).toHaveText(M1.hexEntry.invalid);
      await expect(box(page), text).toHaveAttribute("aria-invalid", "true");
      expect((await stored(page, LESSON_ID)).challenges[MAKE].artifact.answers.bits, text).toBe(
        before,
      );
      const current = await position();
      expect(current.relativeY, text).toBe(original.relativeY);
      expect(current.width, text).toBe(original.width);
      expect(current.height, text).toBe(original.height);
      // Allow subpixel rounding, but still reject movement of half a CSS pixel or more.
      expect(Math.abs(current.y - original.y), text).toBeLessThan(0.5);
    }
    await box(page).fill("10");
    await expect(c.locator(".answer-hex-problem")).toHaveText("");
    await expect(pressed(page)).toHaveCount(1);
  });

  test("is completed with the bits typed, graded as before, and only then shows the words about the solved challenge", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page);
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await expect(page.getByText(solved)).toHaveCount(0);
    // All bits but one, and the right unsigned reading for them, is not Make −1.
    await box(page).fill("fffffffe");
    await answerBox(page).fill("4294967294");
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(1, 2));
    await expect(c.locator(".verdict")).not.toContainText("4294967295");
    await expect(page.getByText(solved)).toHaveCount(0);
    await box(page).fill("0xffffffff");
    await answerBox(page).fill("4294967295");
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(2));
    await expect(c.locator(".challenge-complete")).toHaveText(complete);
    await expect(page.getByText(solved)).toBeVisible();
    // The words are the lesson's own, in the section after the challenge.
    expect(PROSE.constructionSolved).toBe(solved);
    expect(errors).toEqual([]);
    // And they go again if the work stops passing, and after Clear work.
    await press(page, bit(c, 3));
    await expect(page.getByText(solved)).toHaveCount(0);
    await press(page, bit(c, 3));
    await expect(page.getByText(solved)).toBeVisible();
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(page.getByText(solved)).toHaveCount(0);
  });

  test("has the box 40 pixels tall on a phone, inside the screen, in both themes' text sizes", async ({
    page,
  }, info) => {
    await openLesson(page);
    await challenge(page, MAKE).scrollIntoViewIfNeeded();
    const b = await box(page).boundingBox();
    if (info.project.name === "phone") expect(b!.height).toBeGreaterThanOrEqual(40);
    expect(b!.x + b!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
  });
});

test.describe("Two readings each", () => {
  const fill = async (page: Page, values: Record<string, string>) => {
    const c = challenge(page, READ);
    await c.scrollIntoViewIfNeeded();
    for (const [id, v] of Object.entries(values))
      await c.locator(`[data-field="${id}"] input`).fill(v);
  };
  const reference = lesson.challenges.find((x) => x.id === READ)!.reference.answers!;

  test("asks for six numbers, one for each reading of each pattern", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, READ);
    await c.scrollIntoViewIfNeeded();
    await expect(c.locator(".answer-label")).toHaveText([
      "unsigned reading of 0x0000002a",
      "signed reading of 0x0000002a",
      "unsigned reading of 0x80000000",
      "signed reading of 0x80000000",
      "unsigned reading of 0xffffff38",
      "signed reading of 0xffffff38",
    ]);
  });

  test("gives the three signed readings the full keyboard, and the unsigned ones the number keypad", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, READ);
    await c.scrollIntoViewIfNeeded();
    for (const id of ["s1", "s2", "s3"])
      await expect(c.locator(`[data-field="${id}"] input`)).toHaveAttribute("inputmode", "text");
    for (const id of ["u1", "u2", "u3"])
      await expect(c.locator(`[data-field="${id}"] input`)).toHaveAttribute("inputmode", "numeric");
  });

  test("blocks until all six are given, and names the empty ones", async ({ page }) => {
    await openLesson(page);
    await fill(page, { u1: "42" });
    const c = challenge(page, READ);
    await press(page, run(c));
    await expect(status(c)).toHaveText(blocked);
    await expect(c.locator(".verdict.blocked")).toContainText("signed reading of 0x0000002a");
  });

  test("rejects the readings the wrong way round, and never says the right numbers", async ({
    page,
  }) => {
    await openLesson(page);
    await fill(page, {
      u1: "42",
      s1: "42",
      u2: "-2147483648",
      s2: "2147483648",
      u3: "-200",
      s3: "4294967096",
    });
    const c = challenge(page, READ);
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(2, 6));
    await expect(c.locator(".verdict-failure h4")).toHaveCount(4);
    await expect(c.locator(".verdict-detail").first()).toHaveText(
      "That is not what these bits give when read this way.",
    );
    await expect(c.locator(".verdict")).not.toContainText("4294967096");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("accepts the reference, and the minus sign as the lesson prints it", async ({ page }) => {
    await openLesson(page);
    await fill(page, { ...reference, s2: "−2147483648" });
    const c = challenge(page, READ);
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(6));
    await expect(c.locator(".challenge-complete")).toHaveText(complete);
  });

  test("keeps a completion through a reload, grades it again, and goes when cleared", async ({
    page,
  }) => {
    await openLesson(page);
    await fill(page, reference);
    const c = challenge(page, READ);
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.reload();
    await expect(challenge(page, READ).locator(".challenge-complete")).toBeVisible();
    await expect(challenge(page, READ).locator('[data-field="u3"] input')).toHaveValue(
      "4294967096",
    );
    await page.evaluate((k) => {
      const s = JSON.parse(localStorage.getItem(k)!);
      s.challenges["two-readings-each"].artifact.answers.s3 = "200";
      localStorage.setItem(k, JSON.stringify(s));
    }, `assembly-lab:v1:${LESSON_ID}`);
    await page.reload();
    await expect(challenge(page, READ).locator(".challenge-complete")).toHaveCount(0);
    await expect(status(challenge(page, READ))).toHaveText(failing(5, 6));
    const again = challenge(page, READ);
    await press(page, again.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, again.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(again.locator('[data-field="u3"] input')).toHaveValue("");
    expect((await stored(page, LESSON_ID)).challenges[READ]).toBeUndefined();
  });
});

test.describe("the closed notes and the closing question", () => {
  const note = (page: Page, kind: string) =>
    page.locator(`section.lesson-section[data-kind="${kind}"] details.lesson-details`);

  test("has the compiler note shut beside the comparison, and the answer shut at the end", async ({
    page,
  }) => {
    await openLesson(page);
    const compiler = note(page, "failureExperiment");
    await compiler.scrollIntoViewIfNeeded();
    await expect(compiler.locator("summary")).toHaveText("Which compiler?");
    await expect(compiler).not.toHaveAttribute("open", "");
    await press(page, compiler.locator("summary"));
    await expect(compiler).toHaveAttribute("open", "");
    await expect(compiler).toContainText("GCC 16.1");
    const answer = note(page, "reflection");
    await answer.scrollIntoViewIfNeeded();
    await expect(answer.locator("summary")).toHaveText("Answer");
    await expect(answer).not.toHaveAttribute("open", "");
    await expect(answer.locator(".prose")).toBeHidden();
    await press(page, answer.locator("summary"));
    await expect(answer.locator(".prose")).toContainText("2147483649");
    await expect(answer.locator(".prose")).toContainText("−2147483647");
  });

  test("closes with the title What you now know, and the question before its answer", async ({
    page,
  }) => {
    await openLesson(page);
    const last = page.locator('section.lesson-section[data-kind="reflection"]');
    await expect(last.locator(".section-title")).toHaveText("What you now know");
    await expect(last.locator(".prose").first()).toContainText("0x80000001");
    await expect(last.locator(".prose").first()).not.toContainText("2147483649");
  });

  test("keeps its route, and shows its new title on the page and in the tab", async ({ page }) => {
    await openLesson(page);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Same bits, two readings");
    await expect(page).toHaveTitle("Same bits, two readings / Assembly Lab");
    expect(page.url()).toContain("#/lesson/one-pattern-three-readings");
  });
});

test.describe("the look of the lesson page", () => {
  test("text is legible, controls are reachable, nothing scrolls sideways, prose keeps its measure", async ({
    page,
  }, info) => {
    await openLesson(page);
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    expect(await figureOverflow(page)).toEqual([]);
  });

  test("and so are the figures once they have been used, with verdicts and hints open", async ({
    page,
  }, info) => {
    const phone = info.project.name === "phone";
    await openLesson(page);
    await press(
      page,
      page.locator("#ix-run-fuel-used").getByRole("button", { name: V.stepper.next }),
    );
    await commit(page, "predict-add-12", "24");
    const step = page.locator("#ix-step-add-12");
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    // The reader starts at a dense pattern, which makes long sums.
    await press(page, page.locator("#ix-read-register").getByText(M1.reader.showCalculation));
    await commit(page, "compare-int-unsigned", /^Nothing/);
    const make = challenge(page, MAKE);
    await setBits(page, make, MINUS_12);
    await make.locator('[data-field="unsigned"] input').fill("1");
    await press(page, run(make));
    await press(page, make.getByRole("button", { name: /Show hint/ }));
    const read = challenge(page, READ);
    for (const id of ["u1", "s1", "u2", "s2", "u3", "s3"])
      await read.locator(`[data-field="${id}"] input`).fill("0");
    await press(page, run(read));
    expect(await designProblems(page, phone)).toEqual([]);
    expect(await figureOverflow(page)).toEqual([]);
  });

  test("the pattern with the most terms in its sums fits the width of the screen", async ({
    page,
  }) => {
    await openLesson(page);
    const reader = page.locator("#ix-read-register");
    await reader.scrollIntoViewIfNeeded();
    await press(page, reader.getByRole("button", { name: M1.reader.clearBits }));
    await setBits(page, reader, ONES);
    await press(page, reader.getByText(M1.reader.showCalculation));
    await expect(reader.locator('[data-sum="signed"] .al-sum')).toContainText("= −1");
    await expect(reader.locator('tr[data-row="result"] td[data-reading="signed"]')).toHaveText(
      "−1",
    );
    expect(await figureOverflow(page)).toEqual([]);
    expect(await designProblems(page, page.viewportSize()!.width < 500)).toEqual([]);
  });
});

test.describe("both themes", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`the register to read is drawn in the ${theme} theme, with a set bit and a clear bit told apart`, async ({
      page,
    }) => {
      await page.goto("#/");
      await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      await page.reload();
      await openLesson(page);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const reader = page.locator("#ix-read-register");
      await reader.scrollIntoViewIfNeeded();
      await press(page, bit(reader, 31));
      const colours = await reader.evaluate((el) => {
        const on = el.querySelector('.al-toggle[aria-pressed="true"]')!;
        const off = el.querySelector('.al-toggle[aria-pressed="false"]')!;
        return [getComputedStyle(on).backgroundColor, getComputedStyle(off).backgroundColor];
      });
      expect(colours[0]).not.toBe(colours[1]);
      expect(await designProblems(page, page.viewportSize()!.width < 500)).toEqual([]);
    });
  }
});
