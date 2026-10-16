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
import { readingsOfPattern, worths, shown, patternOf } from "../../packages/views/src/readings";
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
    await expect(figure.locator(".al-ctag")).toHaveText(["1", "1"]);
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

  /** What the page shows for a pattern is what the model gives. */
  async function expectReadings(page: Page, pattern: string) {
    const r = readingsOfPattern(pattern);
    await expect(reading(page, "hex")).toContainText(`0x${r.digits}`);
    await expect(reading(page, "unsigned").locator(".al-reading-value")).toHaveText(
      String(r.unsigned),
    );
    await expect(reading(page, "signed").locator(".al-reading-value")).toHaveText(shown(r.signed));
    for (const way of ["unsigned", "signed"] as const) {
      const terms = worths(pattern, way).map(shown);
      const total = shown(r[way]);
      const want = terms.length === 0 ? "0" : terms.join(" + ");
      await expect(reading(page, way).locator(".al-sum")).toHaveText(`${want} = ${total}`);
    }
    await expect(reader(page).locator(".al-digit")).toHaveText(r.digits.split(""));
  }

  test("starts with every bit clear: 32 buttons, each a 0", async ({ page }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await expect(reader(page).locator(".al-toggle")).toHaveCount(32);
    await expect(reader(page).locator('.al-toggle[aria-pressed="true"]')).toHaveCount(0);
    await expectReadings(page, "0".repeat(32));
  });

  test("shows the three readings of the pattern w0 holds after the subtraction, each with its sum", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await setBits(page, reader(page), MINUS_12);
    await expectReadings(page, MINUS_12);
    await expect(reading(page, "hex")).toContainText("0xfffffff4");
    await expect(reading(page, "unsigned").locator(".al-reading-value")).toHaveText("4294967284");
    await expect(reading(page, "signed").locator(".al-reading-value")).toHaveText("−12");
  });

  test("shows plus and minus 2147483648 for the top bit alone, and every other bit the same in both", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await press(page, bit(reader(page), 31));
    await expectReadings(page, "1" + "0".repeat(31));
    await expect(reading(page, "unsigned").locator(".al-sum")).toHaveText(
      "2147483648 = 2147483648",
    );
    await expect(reading(page, "signed").locator(".al-sum")).toHaveText(
      "−2147483648 = −2147483648",
    );
    await press(page, bit(reader(page), 31));
    await press(page, bit(reader(page), 5));
    await expectReadings(page, "0".repeat(26) + "100000");
    await expect(reading(page, "unsigned").locator(".al-reading-value")).toHaveText("32");
    await expect(reading(page, "signed").locator(".al-reading-value")).toHaveText("32");
  });

  test("a bit pressed twice is back to 0, and a pattern read again is the same", async ({
    page,
  }) => {
    await openLesson(page);
    await reader(page).scrollIntoViewIfNeeded();
    await press(page, bit(reader(page), 0));
    await expect(bit(reader(page), 0)).toHaveAttribute("aria-pressed", "true");
    await press(page, bit(reader(page), 0));
    await expect(bit(reader(page), 0)).toHaveAttribute("aria-pressed", "false");
    await expectReadings(page, "0".repeat(32));
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
    await expect(c.locator(".verdict-detail")).toHaveText("Your bits read as −12 when signed.");
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
    // A dense pattern makes the longest sums.
    await setBits(page, page.locator("#ix-read-register"), MINUS_12);
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
    await setBits(page, page.locator("#ix-read-register"), ONES);
    const reader = page.locator("#ix-read-register");
    await expect(reader.locator('[data-reading="signed"] .al-sum')).toContainText("= −1");
    expect(await figureOverflow(page)).toEqual([]);
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
