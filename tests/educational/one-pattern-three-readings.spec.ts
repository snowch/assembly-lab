// Copyright © 2026 Christopher Snow

// Module 1 browser regressions: arithmetic predictions and model traces, construction of −3,
// persisted challenge work and the lesson layout. The required readings sequence is checked in
// bit-weights.spec.ts.

import { expect, test, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { assemble } from "@al/machine";
import { readingsOfPattern, patternOf } from "../../packages/views/src/readings";
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

const LESSON_ID = "same-bits-two-readings";
const lesson = LESSONS.find((l) => l.id === LESSON_ID)!;
const MAKE = "make-minus-three";
const openLesson = (page: Page, id = LESSON_ID) => open(page, id);

const ONES = "1".repeat(32);
const MINUS_12 = patternOf(-12);
const MINUS_3 = patternOf(-3);

test("the lesson loads with no console error, selected sections, and its construction challenge", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await openLesson(page, "same-bits-two-readings");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
  await expect(page.locator("section.challenge")).toHaveCount(1);
  await expect(challenge(page, MAKE)).toBeVisible();
  await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
  await expect(page.locator("a.back-link").first()).toHaveAttribute("href", "#/");
  await expect(page).toHaveTitle(`${lesson.title} / Assembly Lab`);
  expect(errors).toEqual([]);
});

test.describe("the first figure", () => {
  test("shows fuel_used(50, 38) with the C and the instructions GCC recorded, and 4294967284 in w0 after the subtraction", async ({
    page,
  }) => {
    await openLesson(page, "arithmetic-on-register-bits");
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
    await openLesson(page, "arithmetic-on-register-bits");
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
      await openLesson(page, "arithmetic-on-register-bits");
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
      await expect(figure.locator(".al-outcome")).toContainText("The run ended with w0 holding 0");
      await expect(figure.locator(".al-outcome .prose")).toContainText(
        PROSE.predictionExplain.split("\n")[0]!.replaceAll("`", "").slice(0, 40),
      );
    });
  }

  test("the stepper then shows the model's values: 4294967284 after the sub, 0 after the add", async ({
    page,
  }) => {
    await openLesson(page, "arithmetic-on-register-bits");
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
    await openLesson(page, "arithmetic-on-register-bits");
    await commit(page, "predict-add-12", "0");
    await page.reload();
    await expect(page.locator("#ix-predict-add-12 .al-match")).toBeVisible();
    await expect(page.locator("#ix-step-add-12 .al-locked")).toHaveCount(0);
  });
});

test.describe("the two listings compared", () => {
  const figure = (page: Page) => page.locator("#ix-compare-int-unsigned");

  test("shows the C of both functions, and nothing of their listings until the prediction is checked", async ({
    page,
  }) => {
    await openLesson(page, "arithmetic-on-register-bits");
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
    await openLesson(page, "arithmetic-on-register-bits");
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
    await openLesson(page, "arithmetic-on-register-bits");
    await commit(page, "compare-int-unsigned", /^It adds a check/);
    await expect(figure(page).locator(".al-nomatch")).toContainText(V.prediction.noMatch);
    await expect(figure(page).locator('.al-compare-row[data-same="true"]')).toHaveCount(2);
  });

  test("a commitment is kept after a reload, with the comparison", async ({ page }) => {
    await openLesson(page, "arithmetic-on-register-bits");
    await commit(page, "compare-int-unsigned", /^Nothing/);
    await page.reload();
    await expect(figure(page).locator(".al-match")).toBeVisible();
    await expect(figure(page).locator(".al-compare-row")).toHaveCount(2);
  });
});

test.describe("Make −3", () => {
  const answerBox = (page: Page) => challenge(page, MAKE).locator('[data-field="unsigned"] input');

  test("is blocked until the number is given, and says which", async ({ page }) => {
    await openLesson(page, "same-bits-two-readings");
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
    await openLesson(page, "same-bits-two-readings");
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await setBits(page, c, MINUS_12);
    await answerBox(page).fill("4294967284");
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(1, 2));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["the bits of w0"]);
    await expect(c.locator(".verdict-detail")).toHaveText(V.readings.bitsRead("−12"));
    await expect(c.locator(".verdict")).not.toContainText("4294967293");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("rejects the correct bits with a number that is not their unsigned reading", async ({
    page,
  }) => {
    await openLesson(page, "same-bits-two-readings");
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await setBits(page, c, MINUS_3);
    await answerBox(page).fill("-3");
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(1, 2));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["its unsigned reading"]);
    await expect(c.locator(".verdict")).not.toContainText("4294967293");
  });

  test("is completed by setting the target bits and giving their unsigned reading", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page, "same-bits-two-readings");
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await setBits(page, c, MINUS_3);
    await expect(c.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(31);
    await answerBox(page).fill(String(readingsOfPattern(MINUS_3).unsigned));
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(2));
    await expect(c.locator(".challenge-complete")).toHaveText(complete);
    expect(
      (await stored(page, "same-bits-two-readings")).challenges[MAKE].artifact.answers.bits,
    ).toBe(MINUS_3);
    expect(errors).toEqual([]);
  });

  test("keeps the bits after a reload, and grades them again", async ({ page }) => {
    await openLesson(page, "same-bits-two-readings");
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await setBits(page, c, MINUS_3);
    await answerBox(page).fill("4294967293");
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.reload();
    await expect(challenge(page, MAKE).locator(".challenge-complete")).toBeVisible();
    await expect(challenge(page, MAKE).locator('.al-toggle[aria-pressed="true"]')).toHaveCount(31);
    // What was kept is the work: change it in storage to bits that read otherwise, and the page
    // does not believe the old completion.
    await page.evaluate(
      ([k, pattern]) => {
        const s = JSON.parse(localStorage.getItem(k!)!);
        s.challenges["make-minus-three"].artifact.answers.bits = pattern;
        localStorage.setItem(k!, JSON.stringify(s));
      },
      [`assembly-lab:v1:same-bits-two-readings`, MINUS_12],
    );
    await page.reload();
    await expect(challenge(page, MAKE).locator(".challenge-complete")).toHaveCount(0);
    await expect(status(challenge(page, MAKE))).toHaveText(failing(0, 2));
  });

  test("goes when the work is cleared, with the bits", async ({ page }) => {
    await openLesson(page, "same-bits-two-readings");
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await setBits(page, c, MINUS_3);
    await answerBox(page).fill("4294967293");
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await expect(status(c)).toHaveText(S.challenge.resetDone);
    await expect(c.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(0);
    await expect(answerBox(page)).toHaveValue("");
    expect((await stored(page, "same-bits-two-readings")).challenges[MAKE]).toBeUndefined();
  });
});

test.describe("Make −3, with the bits typed in hexadecimal", () => {
  const box = (page: Page) =>
    challenge(page, MAKE).getByRole("textbox", { name: M1.hexEntry.label });
  const answerBox = (page: Page) => challenge(page, MAKE).locator('[data-field="unsigned"] input');
  const pressed = (page: Page) => challenge(page, MAKE).locator('.al-toggle[aria-pressed="true"]');
  const solved =
    "0xfffffffd has every bit set except bit 1. The top bit contributes −2147483648; the other set bits add to 2147483645. Their sum is −3. The unsigned reading is 4294967293.";

  test("has a box beside the 32 buttons, which starts as the bits are and fills in no answer", async ({
    page,
  }) => {
    await openLesson(page, "same-bits-two-readings");
    await challenge(page, MAKE).scrollIntoViewIfNeeded();
    await expect(box(page)).toHaveValue("0x00000000");
    await expect(pressed(page)).toHaveCount(0);
    await expect(answerBox(page)).toHaveValue("");
    expect((await stored(page, "same-bits-two-readings"))?.challenges?.[MAKE]).toBeUndefined();
  });

  test("sets all 32 bits when ffffffff or 0xffffffff is typed, and stores them as 32 characters", async ({
    page,
  }) => {
    await openLesson(page, "same-bits-two-readings");
    await challenge(page, MAKE).scrollIntoViewIfNeeded();
    for (const text of ["ffffffff", "0xffffffff"]) {
      await box(page).fill("");
      await box(page).fill(text);
      await expect(pressed(page), text).toHaveCount(32);
      expect(
        (await stored(page, "same-bits-two-readings")).challenges[MAKE].artifact.answers.bits,
        text,
      ).toBe(ONES);
      await press(page, bit(challenge(page, MAKE), 5));
      await expect(pressed(page), text).toHaveCount(31);
      await expect(box(page), text).toHaveValue("0xffffffdf");
    }
  });

  test("accepts the grouped unsigned reading shown by the teaching figure", async ({ page }) => {
    await openLesson(page, "same-bits-two-readings");
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await box(page).fill("0xfffffffd");
    await answerBox(page).fill("4,294,967,293");
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(2));
    await expect(c.locator(".challenge-complete")).toHaveText(complete);
  });

  test("puts the digits in the box when a bit is pressed", async ({ page }) => {
    await openLesson(page, "same-bits-two-readings");
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
    await openLesson(page, "same-bits-two-readings");
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await press(page, bit(c, 4));
    const before = (await stored(page, "same-bits-two-readings")).challenges[MAKE].artifact.answers
      .bits;
    const actions = c.locator(".challenge-actions");
    // Measured inside the challenge: a stored-state update re-renders figures elsewhere on the
    // page, and a fractional scroll offset or scroll anchoring can shift every page coordinate
    // without anything in this challenge having moved. The page's own width is held by the
    // design checks; this test holds the challenge still.
    const position = () =>
      actions.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        const challenge = el.closest(".challenge")!.getBoundingClientRect();
        return {
          relativeY: rect.y - challenge.y,
          challengeH: challenge.height,
          width: rect.width,
          height: rect.height,
        };
      });
    const original = await position();
    for (const text of ["xyz", "fffffffff", "0xg1"]) {
      await box(page).fill(text);
      await expect(c.locator(".answer-hex-problem"), text).toHaveText(M1.hexEntry.invalid);
      await expect(box(page), text).toHaveAttribute("aria-invalid", "true");
      expect(
        (await stored(page, "same-bits-two-readings")).challenges[MAKE].artifact.answers.bits,
        text,
      ).toBe(before);
      const current = await position();
      expect(current.relativeY, text).toBe(original.relativeY);
      expect(current.challengeH, text).toBe(original.challengeH);
      expect(current.width, text).toBe(original.width);
      expect(current.height, text).toBe(original.height);
    }
    await box(page).fill("10");
    await expect(c.locator(".answer-hex-problem")).toHaveText("");
    await expect(pressed(page)).toHaveCount(1);
  });

  test("is completed with the bits typed, graded as before, and only then shows the words about the solved challenge", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page, "same-bits-two-readings");
    const c = challenge(page, MAKE);
    await c.scrollIntoViewIfNeeded();
    await expect(page.getByText(solved)).toHaveCount(0);
    // All bits but one, and the right unsigned reading for them, is not Make −3.
    await box(page).fill("fffffffe");
    await answerBox(page).fill("4294967294");
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(1, 2));
    await expect(c.locator(".verdict")).not.toContainText("4294967293");
    await expect(page.getByText(solved)).toHaveCount(0);
    await box(page).fill("0xfffffffd");
    await answerBox(page).fill("4294967293");
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(2));
    await expect(c.locator(".challenge-complete")).toHaveText(complete);
    await expect(page.getByText(solved)).toBeVisible();
    // The words are the lesson's own, in the section after the challenge.
    expect(PROSE.constructionSolved.replaceAll("`", "")).toBe(solved);
    await expect(page.locator("#ix-make-minus-three-solved code")).toHaveText("0xfffffffd");
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
    await openLesson(page, "same-bits-two-readings");
    await challenge(page, MAKE).scrollIntoViewIfNeeded();
    const b = await box(page).boundingBox();
    if (info.project.name === "phone") expect(b!.height).toBeGreaterThanOrEqual(40);
    expect(b!.x + b!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
  });
});

test.describe("the compiler note and the readings route", () => {
  const note = (page: Page, kind: string) =>
    page.locator(`section.lesson-section[data-kind="${kind}"] details.lesson-details`);

  test("has the compiler note shut beside the comparison", async ({ page }) => {
    await openLesson(page, "same-bits-two-readings");
    await openLesson(page, "arithmetic-on-register-bits");
    const compiler = note(page, "failureExperiment");
    await compiler.scrollIntoViewIfNeeded();
    await expect(compiler.locator("summary")).toHaveText("Which compiler?");
    await expect(compiler).not.toHaveAttribute("open", "");
    await press(page, compiler.locator("summary"));
    await expect(compiler).toHaveAttribute("open", "");
    await expect(compiler).toContainText("GCC 16.1");
  });

  test("shows the readings unit at its own route and title", async ({ page }) => {
    await openLesson(page, "same-bits-two-readings");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
    await expect(page).toHaveTitle(`${lesson.title} / Assembly Lab`);
    expect(page.url()).toContain("#/lesson/same-bits-two-readings");
  });
});

test.describe("the look of the lesson page", () => {
  test("text is legible, controls are reachable, nothing scrolls sideways, prose keeps its measure", async ({
    page,
  }, info) => {
    await openLesson(page, "same-bits-two-readings");
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    expect(await figureOverflow(page)).toEqual([]);
  });

  test("and so are the figures once they have been used, with verdicts and hints open", async ({
    page,
  }, info) => {
    const phone = info.project.name === "phone";
    await openLesson(page, "same-bits-two-readings");
    await openLesson(page, "arithmetic-on-register-bits");
    await press(
      page,
      page.locator("#ix-run-fuel-used").getByRole("button", { name: V.stepper.next }),
    );
    await commit(page, "predict-add-12", "24");
    const step = page.locator("#ix-step-add-12");
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    await commit(page, "compare-int-unsigned", /^Nothing/);
    expect(await designProblems(page, phone)).toEqual([]);
    await openLesson(page, "same-bits-two-readings");
    const make = challenge(page, MAKE);
    await setBits(page, make, MINUS_12);
    await make.locator('[data-field="unsigned"] input').fill("1");
    await press(page, run(make));
    await press(page, make.getByRole("button", { name: /Show hint/ }));
    expect(await designProblems(page, phone)).toEqual([]);
    expect(await figureOverflow(page)).toEqual([]);
  });
});
