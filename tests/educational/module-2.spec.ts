// Copyright © 2026 Christopher Snow

// Module 2, Adding, subtracting and the flags, in a browser, on the built site, at desktop and phone
// widths. Lesson 1: the lesson loads without an error; both predictions commit before they reveal; the
// adder's values after each column are the model's, and its flags appear only after the last; the
// four-flag prediction and the smallest overflow reject wrong answers and accept the reference; a
// completion survives a reload and is graded again; Clear work removes it; and the page keeps the look
// the shell's own pages keep. Lesson 2: the same, and the construction challenge is completed by
// typing (at the desktop width) and by tapping alone (at the phone width), the tempting answer is
// refused by the gate, and the ring and the stepper show the model's values.

import { expect, test, type Locator, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { ARITH_STRINGS as A } from "../../packages/views/src/strings.arith";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { additionSteps, bitAt, flagDigits } from "../../packages/views/src/arith";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import { DEFAULT_STRINGS as S, format } from "../../platform/lesson-runtime/src/strings";

import { PLUS, SUM_FLAGS } from "../../content/lessons/adding-and-the-flags.listings";
import {
  ELAPSED,
  ELAPSED_SUBS,
  NEGATE_FLAGS,
} from "../../content/lessons/subtracting-and-the-tick-counter.listings";
import { designProblems } from "./design";

const ONE = "adding-and-the-flags";
const TWO = "subtracting-and-the-tick-counter";
const lesson = (id: string) => LESSONS.find((l) => l.id === id)!;
const key = (id: string) => `assembly-lab:v1:${id}`;

/** The failure experiment's call: `w2` is for the `adds`, `w0` and `w1` for the `add`. */
const SUM_CALL = { entry: "sum_flags", args: [0x7fffffff, 1, 0xffffffff] };

/** Everything the page logs as an error, or throws, until the test ends. */
function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`page: ${e.message}`));
  return errors;
}

async function openLesson(page: Page, id: string): Promise<void> {
  await page.goto(`#/lesson/${id}`);
  await expect(page.locator("section.lesson-section")).toHaveCount(10);
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

const challenge = (page: Page, id: string) =>
  page.locator(`section.challenge[data-challenge="${id}"]`);
const status = (c: Locator) => c.locator(".challenge-status");
const run = (c: Locator) => c.getByRole("button", { name: S.challenge.run });
const passing = (total: number) => format(S.challenge.passing, { total });
const failing = (passed: number, total: number) => format(S.challenge.failing, { passed, total });

/** The page's pointer: a tap on a touch screen, a click with a mouse. */
async function press(page: Page, target: Locator): Promise<void> {
  if (page.viewportSize()!.width < 500) await target.tap();
  else await target.click();
}

/** Chooses an option and checks the prediction. */
async function commit(page: Page, id: string, option: string | RegExp): Promise<Locator> {
  const figure = page.locator(`#ix-${id}`);
  await figure.scrollIntoViewIfNeeded();
  await figure.getByRole("radio", { name: option }).check();
  await figure.getByRole("button", { name: V.prediction.commit }).click();
  return figure;
}

const registerValue = (figure: Locator, name: string) =>
  figure.locator(`[data-register="${name}"] .al-reg-value`);
const flagValues = (figure: Locator) =>
  figure.locator(".al-flag").evaluateAll((els) => els.map((e) => e.getAttribute("data-value")));
const stored = (page: Page, id: string) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), key(id));

/** Every prediction in a lesson: it commits before it reveals, and the model says what matches. */
async function predictionCommitsBeforeItReveals(
  page: Page,
  id: string,
  right: string | RegExp,
  wrong: string | RegExp,
) {
  const figure = page.locator(`#ix-${id}`);
  await figure.scrollIntoViewIfNeeded();
  await expect(figure.locator(".al-outcome")).toHaveCount(0);
  await expect(figure.getByRole("button", { name: V.prediction.commit })).toBeDisabled();
  await figure.getByRole("radio", { name: right }).check();
  // A choice is not a commitment: nothing is shown until it is checked.
  await expect(figure.locator(".al-outcome")).toHaveCount(0);
  await press(page, figure.getByRole("button", { name: V.prediction.commit }));
  await expect(figure.locator(".al-match")).toContainText(V.prediction.match);
  await expect(figure.locator(".al-outcome .prose")).toBeVisible();
  // The learner may choose again; the model, not the lesson, says what matches.
  await figure.getByRole("radio", { name: wrong }).check();
  await press(page, figure.getByRole("button", { name: V.prediction.commit }));
  await expect(figure.locator(".al-nomatch")).toContainText(V.prediction.noMatch);
}

// ---------------------------------------------------------------------------------------------
// Lesson 1

test.describe("lesson 1, Adding, and the four flags", () => {
  test("loads with no console error, ten sections, two challenges and a closed note", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page, ONE);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson(ONE).title);
    await expect(page.locator("section.challenge")).toHaveCount(2);
    await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
    await expect(page).toHaveTitle(`${lesson(ONE).title} / Assembly Lab`);
    const note = page.locator("details.lesson-details");
    await expect(note).toHaveCount(1);
    await expect(note).not.toHaveAttribute("open", "");
    await press(page, note.locator("summary"));
    await expect(note.locator("pre")).toContainText("cset");
    expect(errors).toEqual([]);
  });

  test("the two predictions commit before they reveal, and the model says which is right", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    await predictionCommitsBeforeItReveals(page, "predict-readings", "Only the unsigned", "Both");
    const readings = page.locator("#ix-predict-readings .al-match");
    // The unsigned reading is right and the signed reading wrong, because the model's answer is.
    const record = additionSteps(traceOf(PLUS, { entry: "plus", args: [0x7fffffff, 1] }))[0]!
      .addition!;
    expect(record.carryOut).toBe(0);
    expect(record.result).toBe(0x80000000n);
    await page
      .locator("#ix-predict-readings")
      .getByRole("radio", { name: "Only the unsigned" })
      .check();
    await press(
      page,
      page.locator("#ix-predict-readings").getByRole("button", { name: V.prediction.commit }),
    );
    await expect(readings).toContainText(A.prediction.readings(true, false));
    // The adds leaves N and C at 1 (1010), so the model says C is set and V clear, and the add
    // keeps that: not 1001, which the add's own addition would give, and not 0000.
    const flags = flagDigits(traceOf(SUM_FLAGS, SUM_CALL).result.final.flags);
    expect(flags).toEqual([1, 0, 1, 0]);
    await predictionCommitsBeforeItReveals(
      page,
      "predict-add-flags",
      /^N and C are still 1/,
      "All four are 0",
    );
    await page
      .locator("#ix-predict-add-flags")
      .getByRole("radio", { name: /^N and C are still 1/ })
      .check();
    await press(
      page,
      page.locator("#ix-predict-add-flags").getByRole("button", { name: V.prediction.commit }),
    );
    await expect(page.locator("#ix-predict-add-flags .al-match")).toContainText(
      A.prediction.flagsAt(...flags),
    );
  });

  test("a commitment is kept, and is still there after a reload", async ({ page }) => {
    await openLesson(page, ONE);
    await commit(page, "predict-readings", "Only the unsigned");
    await page.reload();
    await expect(page.locator("#ix-predict-readings .al-match")).toBeVisible();
    await expect(page.locator("#ix-add-columns .al-locked")).toHaveCount(0);
  });

  test.describe("the adder", () => {
    const record = additionSteps(traceOf(PLUS, { entry: "plus", args: [0x7fffffff, 1] }))[0]!
      .addition!;
    const cell = (figure: Locator, row: string, column: number) =>
      figure.locator(`[data-row="${row}"][data-col="${column}"]`);

    test("stays shut until the prediction before it is checked", async ({ page }) => {
      await openLesson(page, ONE);
      const adder = page.locator("#ix-add-columns");
      await expect(adder.locator(".al-locked")).toBeVisible();
      await expect(adder.getByRole("button", { name: A.adder.next })).toHaveCount(0);
      await commit(page, "predict-readings", "Only the unsigned");
      await expect(adder.locator(".al-locked")).toHaveCount(0);
    });

    test("draws each column from the model's record: the answer bit and the carry into the next column", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      await commit(page, "predict-readings", "Only the unsigned");
      const adder = page.locator("#ix-add-columns");
      await adder.scrollIntoViewIfNeeded();
      // The two numbers are whole at the start; the answer and the flags are not.
      for (const column of [0, 15, 31]) {
        await expect(cell(adder, "a", column)).toHaveAttribute(
          "data-value",
          String(bitAt(record.a, column)),
        );
        await expect(cell(adder, "b", column)).toHaveAttribute(
          "data-value",
          String(bitAt(record.b, column)),
        );
        await expect(cell(adder, "sum", column)).toHaveAttribute("data-shown", "false");
      }
      await expect(adder.locator(".al-flags")).toHaveAttribute("data-known", "false");
      const next = adder.getByRole("button", { name: A.adder.next });
      for (let column = 0; column < 32; column++) {
        await press(page, next);
        await expect(cell(adder, "sum", column)).toHaveAttribute(
          "data-value",
          String(bitAt(record.result, column)),
        );
        const into = column === 31 ? record.carryOut : bitAt(record.carries, column + 1);
        await expect(cell(adder, "carry", column + 1)).toHaveAttribute("data-value", String(into));
        if (column < 31)
          await expect(adder.locator(".al-flags")).toHaveAttribute("data-known", "false");
      }
      await expect(next).toBeDisabled();
      await expect(adder.locator("[role=status]")).toContainText(A.adder.done);
      // N 1, Z 0, C 0, V 1: the flags the simulator left.
      expect(await flagValues(adder)).toEqual(["1", "0", "0", "1"]);
      await expect(adder.locator('[data-top="in"]')).toHaveAttribute("data-value", "1");
      await expect(adder.locator('[data-top="out"]')).toHaveAttribute("data-value", "0");
      await expect(cell(adder, "sum", 31)).toHaveAttribute("data-value", "1");
    });

    test("goes back a column, shows every column at once, and starts again", async ({ page }) => {
      await openLesson(page, ONE);
      await commit(page, "predict-readings", "Only the unsigned");
      const adder = page.locator("#ix-add-columns");
      await adder.scrollIntoViewIfNeeded();
      await press(page, adder.getByRole("button", { name: A.adder.all }));
      await expect(adder.locator(".al-flags")).toHaveAttribute("data-known", "true");
      await press(page, adder.getByRole("button", { name: A.adder.back }));
      await expect(adder.locator(".al-flags")).toHaveAttribute("data-known", "false");
      await expect(cell(adder, "sum", 31)).toHaveAttribute("data-shown", "false");
      await press(page, adder.getByRole("button", { name: A.adder.reset }));
      await expect(cell(adder, "sum", 0)).toHaveAttribute("data-shown", "false");
      await expect(adder.getByRole("button", { name: A.adder.back })).toBeDisabled();
    });
  });

  test("the stepper after the failure experiment's prediction: adds, then add, the flags the adds left kept and w0 the model's", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    const stepper = page.locator("#ix-step-add");
    await expect(stepper.locator(".al-locked")).toBeVisible();
    await commit(page, "predict-add-flags", /^N and C are still 1/);
    await stepper.scrollIntoViewIfNeeded();
    const model = traceOf(SUM_FLAGS, SUM_CALL);
    const next = stepper.getByRole("button", { name: V.stepper.next });
    await expect(registerValue(stepper, "w0")).toHaveText("2147483647");
    for (const k of [1, 2, 3]) {
      await press(page, next);
      for (const [n, name] of [
        [0, "w0"],
        [1, "w1"],
        [2, "w2"],
        [3, "w3"],
      ] as const)
        await expect(registerValue(stepper, name)).toHaveText(
          String(wValue(viewAt(model, k).state, n)),
        );
      // The adds sets N and C; the add and the ret leave them as they were.
      expect(await flagValues(stepper)).toEqual(
        flagDigits(viewAt(model, k).state.flags).map(String),
      );
      expect(await flagValues(stepper)).toEqual(["1", "0", "1", "0"]);
    }
    await expect(registerValue(stepper, "w0")).toHaveText("2147483648");
    await expect(registerValue(stepper, "w3")).toHaveText("4294967294");
    await expect(next).toBeDisabled();
  });

  test.describe("the four-flag prediction", () => {
    const ANSWERS: Record<string, string> = {
      "first-n": "0",
      "first-z": "1",
      "first-c": "1",
      "first-v": "0",
      "second-n": "0",
      "second-z": "0",
      "second-c": "0",
      "second-v": "0",
      "third-n": "0",
      "third-z": "1",
      "third-c": "1",
      "third-v": "1",
    };
    const choose = async (page: Page, c: Locator, answers: Record<string, string>) => {
      for (const [id, value] of Object.entries(answers))
        await press(page, c.locator(`[data-field="${id}"] input[value="${value}"]`));
    };

    test("asks for twelve choices, none made, and the program it is about", async ({ page }) => {
      await openLesson(page, ONE);
      const c = challenge(page, "predict-flags");
      await c.scrollIntoViewIfNeeded();
      await expect(c.locator(".answer-choice")).toHaveCount(12);
      await expect(c.locator("input[type=radio]:checked")).toHaveCount(0);
      await expect(c.locator(".al-insn .al-text")).toHaveText(["adds w0, w0, w1", "ret"]);
      await expect(c.locator(".al-c")).toHaveCount(0);
    });

    test("is completed by tapping the twelve choices, on a phone and on a desk", async ({
      page,
    }) => {
      const errors = watchErrors(page);
      await openLesson(page, ONE);
      const c = challenge(page, "predict-flags");
      await c.scrollIntoViewIfNeeded();
      await choose(page, c, ANSWERS);
      await press(page, run(c));
      await expect(status(c)).toHaveText(passing(3));
      await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
      expect((await stored(page, ONE)).challenges["predict-flags"].artifact.answers).toEqual(
        ANSWERS,
      );
      expect(errors).toEqual([]);
    });

    test("asks for every choice before it grades anything", async ({ page }) => {
      await openLesson(page, ONE);
      const c = challenge(page, "predict-flags");
      await c.scrollIntoViewIfNeeded();
      const { "third-v": _left, ...rest } = ANSWERS;
      await choose(page, c, rest);
      await press(page, run(c));
      await expect(status(c)).toHaveText(S.challenge.blocked);
      // Twelve choices are not listed: the sentence says to choose, and names none of them.
      await expect(c.locator(".verdict.blocked")).toHaveText(A.grader.chooseFirst);
    });

    test("opens the adder on 1 plus 0xffffffff only once the choices pass, and draws C 1 and Z 1", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      const adder = page.locator("#ix-add-carry-out");
      const c = challenge(page, "predict-flags");
      await adder.scrollIntoViewIfNeeded();
      await expect(adder.locator(".al-locked")).toHaveText(A.adder.lockedUntilPassed);
      await expect(adder.getByRole("button", { name: A.adder.next })).toHaveCount(0);
      // A wrong choice leaves it shut.
      await c.scrollIntoViewIfNeeded();
      await choose(page, c, { ...ANSWERS, "third-v": "0" });
      await press(page, run(c));
      await expect(adder.locator(".al-locked")).toBeVisible();
      await choose(page, c, ANSWERS);
      await press(page, run(c));
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await expect(adder.locator(".al-locked")).toHaveCount(0);
      await adder.scrollIntoViewIfNeeded();
      const model = traceOf(PLUS, { entry: "plus", args: [1, 0xffffffff] });
      const record = additionSteps(model)[0]!.addition!;
      await press(page, adder.getByRole("button", { name: A.adder.all }));
      expect(await flagValues(adder)).toEqual(flagDigits(model.result.final.flags).map(String));
      expect(await flagValues(adder)).toEqual(["0", "1", "1", "0"]);
      await expect(adder.locator('[data-top="in"]')).toHaveAttribute(
        "data-value",
        String(bitAt(record.carries, 31)),
      );
      await expect(adder.locator('[data-top="out"]')).toHaveAttribute(
        "data-value",
        String(record.carryOut),
      );
      await expect(adder.locator('[data-top="out"]')).toHaveAttribute("data-value", "1");
      // The last status says this is the top bit and what V compares, and the key is visible text.
      await expect(adder.locator("[role=status]")).toContainText(A.adder.topBit);
      await expect(adder.locator(".al-adder-key")).toBeVisible();
      await expect(adder.locator(".al-adder-key")).toHaveText(A.adder.topKey);
      // A reload grades the saved work again, and the adder is still open.
      await page.reload();
      await expect(page.locator("#ix-add-carry-out .al-locked")).toHaveCount(0);
    });

    test("rejects a wrong flag, names the addition and not the flag, and does not complete", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      const c = challenge(page, "predict-flags");
      await c.scrollIntoViewIfNeeded();
      // C and V taken for each other in the third addition: the one the hints warn about.
      await choose(page, c, { ...ANSWERS, "third-v": "0" });
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(2, 3));
      await expect(c.locator(".verdict-failure h4")).toHaveText(["0x80000000 plus 0x80000000"]);
      // The failure says a flag is wrong, in a sentence, and shows no empty lists.
      await expect(c.locator(".verdict-failure .verdict-detail")).toHaveText(A.grader.flagWrong);
      await expect(c.locator(".verdict-values")).toHaveCount(0);
      await expect(c.locator(".verdict")).not.toContainText(/third-v|V for/);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
    });

    test("fails the starting point, which has chosen nothing, and a run of all zeros", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      const c = challenge(page, "predict-flags");
      await c.scrollIntoViewIfNeeded();
      await press(page, run(c));
      await expect(status(c)).toHaveText(S.challenge.blocked);
      const zeros = Object.fromEntries(Object.keys(ANSWERS).map((id) => [id, "0"]));
      await choose(page, c, zeros);
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(1, 3));
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
    });

    test("survives a reload, graded again, and is gone when the work is cleared", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      let c = challenge(page, "predict-flags");
      await c.scrollIntoViewIfNeeded();
      await choose(page, c, ANSWERS);
      await press(page, run(c));
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await page.reload();
      c = challenge(page, "predict-flags");
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await expect(c.locator('[data-field="third-v"] input[value="1"]')).toBeChecked();
      // Change the stored work to work that fails: the page does not believe the old completion.
      await page.evaluate((k) => {
        const s = JSON.parse(localStorage.getItem(k)!);
        s.challenges["predict-flags"].artifact.answers["first-c"] = "0";
        localStorage.setItem(k, JSON.stringify(s));
      }, key(ONE));
      await page.reload();
      c = challenge(page, "predict-flags");
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await expect(status(c)).toHaveText(failing(2, 3));
      await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
      await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
      await expect(status(c)).toHaveText(S.challenge.resetDone);
      await expect(c.locator("input[type=radio]:checked")).toHaveCount(0);
      expect((await stored(page, ONE)).challenges["predict-flags"]).toBeUndefined();
    });
  });

  test.describe("the smallest overflow", () => {
    const answer = async (c: Locator, text: string) =>
      c.locator('[data-field="number"] input').fill(text);

    test("shows the program it is about, and asks for one number", async ({ page }) => {
      await openLesson(page, ONE);
      const c = challenge(page, "smallest-overflow");
      await c.scrollIntoViewIfNeeded();
      await expect(c.locator(".al-insn .al-text")).toHaveText(["adds w0, w0, w1", "ret"]);
      await expect(c.locator(".answer-field")).toHaveCount(1);
    });

    test("rejects 1, which does not overflow, and 3, which is not the smallest, without saying 2", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      const c = challenge(page, "smallest-overflow");
      await c.scrollIntoViewIfNeeded();
      await answer(c, "1");
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(0, 1));
      await expect(c.locator(".verdict-detail")).toHaveText(A.grader.flagClear("V"));
      await answer(c, "3");
      await press(page, run(c));
      await expect(c.locator(".verdict-detail")).toHaveText(A.grader.notSmallest);
      await expect(c.locator(".verdict")).not.toContainText(/\b2\b/);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
    });

    test("asks for a whole number before it grades", async ({ page }) => {
      await openLesson(page, ONE);
      const c = challenge(page, "smallest-overflow");
      await c.scrollIntoViewIfNeeded();
      await press(page, run(c));
      await expect(c.locator(".verdict.blocked")).toContainText("Nothing is graded until");
      await answer(c, "two");
      await press(page, run(c));
      await expect(c.locator(".verdict.blocked")).toContainText("whole number");
    });

    test("accepts the reference, keeps it over a reload, and drops it when the work changes", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      let c = challenge(page, "smallest-overflow");
      await c.scrollIntoViewIfNeeded();
      const reference = lesson(ONE).challenges.find((x) => x.id === "smallest-overflow")!.reference
        .answers!["number"]!;
      await answer(c, reference);
      await press(page, run(c));
      await expect(status(c)).toHaveText(passing(1));
      await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
      await page.reload();
      c = challenge(page, "smallest-overflow");
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await expect(c.locator('[data-field="number"] input')).toHaveValue(reference);
      await answer(c, "4");
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
    });
  });

  test.describe("the look of the lesson page", () => {
    test("text is legible, controls are reachable, nothing scrolls sideways, prose keeps its measure", async ({
      page,
    }, info) => {
      await openLesson(page, ONE);
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    });

    test("and so are the figures once they have been used: the adder part way, a verdict shown, the note open", async ({
      page,
    }, info) => {
      const phone = info.project.name === "phone";
      await openLesson(page, ONE);
      await commit(page, "predict-readings", "Both");
      const adder = page.locator("#ix-add-columns");
      for (let k = 0; k < 6; k++)
        await press(page, adder.getByRole("button", { name: A.adder.next }));
      await press(page, page.locator("details.lesson-details summary"));
      expect(await designProblems(page, phone)).toEqual([]);
      await press(page, adder.getByRole("button", { name: A.adder.all }));
      await commit(page, "predict-add-flags", "All four are 0");
      const stepper = page.locator("#ix-step-add");
      await press(page, stepper.getByRole("button", { name: V.stepper.next }));
      const flags = challenge(page, "predict-flags");
      await press(page, flags.locator('[data-field="first-n"] input[value="1"]'));
      await press(page, run(flags));
      await press(page, flags.getByRole("button", { name: /Show hint/ }));
      const overflow = challenge(page, "smallest-overflow");
      await overflow.locator('[data-field="number"] input').fill("1");
      await press(page, run(overflow));
      expect(await designProblems(page, phone)).toEqual([]);
    });

    test("the adder's 33 places fit the screen, on a phone and on a desk", async ({ page }) => {
      await openLesson(page, ONE);
      await commit(page, "predict-readings", "Both");
      const adder = page.locator("#ix-add-columns");
      await adder.scrollIntoViewIfNeeded();
      const box = (await adder.locator('[data-row="carry"] .al-adder-cells').boundingBox())!;
      const width = page.viewportSize()!.width;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      await expect(adder.locator('[data-row="carry"] .al-adder-cell')).toHaveCount(33);
      await expect(adder.locator('[data-row="sum"] .al-adder-group')).toHaveCount(5);
    });
  });

  for (const theme of ["light", "dark"] as const) {
    test(`the adder is drawn in the ${theme} theme, with filled bits, carries and flags told apart`, async ({
      page,
    }) => {
      await page.goto("#/");
      await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      await page.reload();
      await openLesson(page, ONE);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await commit(page, "predict-readings", "Only the unsigned");
      const adder = page.locator("#ix-add-columns");
      await press(page, adder.getByRole("button", { name: A.adder.all }));
      const colours = await adder.evaluate((el) => {
        const paint = (selector: string) =>
          getComputedStyle(el.querySelector(selector)!).backgroundColor;
        return {
          on: paint('[data-row="a"][data-value="1"]'),
          off: paint('[data-row="b"][data-value="0"]'),
          carry: paint('[data-row="carry"][data-value="1"]'),
          flagOn: paint('.al-flag[data-value="1"]'),
          flagOff: paint('.al-flag[data-value="0"]'),
        };
      });
      expect(colours.on).not.toBe(colours.off);
      expect(colours.flagOn).not.toBe(colours.flagOff);
      expect(colours.carry).not.toBe(colours.off);
    });
  }

  test("the way back leads to the front page, where the lesson is listed", async ({ page }) => {
    await openLesson(page, ONE);
    await press(page, page.locator("a.back-link").first());
    await expect(page.locator(`.module-lessons li[data-lesson="${ONE}"] a`)).toHaveText(
      lesson(ONE).title,
    );
  });
});

// ---------------------------------------------------------------------------------------------
// Lesson 2

const ELAPSED_CALL = { entry: "elapsed", args: [1000, 4294966296] };
const WRITE = "write-elapsed";
const STEP = "one-step-past";

test.describe("lesson 2, Subtracting, and the tick counter", () => {
  test("loads with no console error, ten sections and two challenges", async ({ page }) => {
    const errors = watchErrors(page);
    await openLesson(page, TWO);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson(TWO).title);
    await expect(page.locator("section.challenge")).toHaveCount(2);
    await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
    await expect(page).toHaveTitle(`${lesson(TWO).title} / Assembly Lab`);
    expect(errors).toEqual([]);
  });

  test("the prediction about elapsed commits before it reveals, and the model says 2000", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    const figure = page.locator("#ix-predict-elapsed");
    await figure.scrollIntoViewIfNeeded();
    // The figure shows the recorded function and the two readings, and nothing of the run.
    await expect(figure.locator(".al-insn .al-text")).toHaveText(["sub w0, w0, w1", "ret"]);
    await expect(figure.locator(".al-cline")).toHaveCount(1);
    await expect(registerValue(figure, "w0")).toHaveText("1000");
    await expect(registerValue(figure, "w1")).toHaveText("4294966296");
    await predictionCommitsBeforeItReveals(page, "predict-elapsed", /^2000$/, /^4294965296$/);
    const model = traceOf(ELAPSED, ELAPSED_CALL);
    expect(wValue(model.result.final, 0)).toBe(2000);
    await figure.getByRole("radio", { name: /^2000$/ }).check();
    await press(page, figure.getByRole("button", { name: V.prediction.commit }));
    await expect(figure.locator(".al-match")).toContainText("w0 held 2000");
  });

  test("the ring stays shut until the prediction is checked, then shows the model's distance and C", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    const ring = page.locator("#ix-counter-ring");
    await expect(ring.locator(".al-locked")).toBeVisible();
    await commit(page, "predict-elapsed", /^2000$/);
    await ring.scrollIntoViewIfNeeded();
    const row = (name: string) => ring.locator(`[data-row="${name}"] dd`);
    await expect(row("then")).toHaveText("4294966296");
    await expect(row("now")).toHaveText("1000");
    await expect(row("elapsed")).toHaveText("2000");
    await expect(row("c")).toContainText("0");
    await expect(row("c")).toContainText(A.ring.borrowed);
    await expect(ring.locator("svg")).toHaveAttribute("data-wrapped", "true");
    await expect(ring.locator('[data-mark="wrap"]')).toHaveCount(1);
    const box = (await ring.locator("svg").boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  });

  test.describe("the adder drawing elapsed_subs", () => {
    const SUBS = { c: "", listing: ELAPSED_SUBS.listing };
    const drawn = [
      { id: "subtract-wrapped", args: [1000, 4294966296], flags: ["0", "0", "0", "0"], out: "0" },
      { id: "subtract-no-wrap", args: [9000, 2500], flags: ["0", "0", "1", "0"], out: "1" },
    ];

    for (const d of drawn) {
      test(`${d.id}: shut until the prediction is checked, then draws the model's subtraction and C ${d.flags[2]}`, async ({
        page,
      }) => {
        await openLesson(page, TWO);
        const adder = page.locator(`#ix-${d.id}`);
        await adder.scrollIntoViewIfNeeded();
        await expect(adder.locator(".al-locked")).toBeVisible();
        await commit(page, "predict-elapsed", /^2000$/);
        await expect(adder.locator(".al-locked")).toHaveCount(0);
        const model = traceOf(SUBS, { entry: "elapsed_subs", args: d.args });
        const record = additionSteps(model)[0]!.addition!;
        expect(record.subtraction).toBe(true);
        const cell = (row: string, column: number) =>
          adder.locator(`[data-row="${row}"][data-col="${column}"]`);
        // The second number is drawn turned over, bit for bit as the model has it, and 1 is carried in.
        await expect(adder.locator('[data-row="b"]').first()).toContainText(
          A.adder.turnedOver("w1"),
        );
        for (const column of [0, 3, 10, 20, 31])
          await expect(cell("b", column)).toHaveAttribute(
            "data-value",
            String(bitAt(record.b, column)),
          );
        await press(page, adder.getByRole("button", { name: A.adder.next }));
        await expect(cell("carry", 0)).toHaveAttribute("data-value", "1");
        await press(page, adder.getByRole("button", { name: A.adder.all }));
        expect(await flagValues(adder)).toEqual(d.flags);
        expect(await flagValues(adder)).toEqual(flagDigits(model.result.final.flags).map(String));
        await expect(adder.locator('[data-top="out"]')).toHaveAttribute("data-value", d.out);
        await expect(adder.locator("[role=status]")).toContainText(A.adder.topBit);
        await expect(adder.locator(".al-adder-key")).toBeVisible();
      });
    }
  });

  test.describe("the construction challenge", () => {
    test("is completed by typing, at the desktop width", async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "typing is the desktop width's way in");
      const errors = watchErrors(page);
      await openLesson(page, TWO);
      const c = challenge(page, WRITE);
      await c.scrollIntoViewIfNeeded();
      const box = c.getByRole("textbox", { name: V.editor.textLabel });
      await expect(box).toHaveValue("ret");
      await expect(box).toHaveAttribute("autocapitalize", "off");
      await box.fill("");
      await box.pressSequentially("sub w0, w0, w1\nret");
      await run(c).click();
      await expect(status(c)).toHaveText(passing(4));
      await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
      expect(errors).toEqual([]);
    });

    test("is completed by tapping alone, at the phone width", async ({ page }, info) => {
      test.skip(info.project.name !== "phone", "tapping is the phone width's way in");
      const errors = watchErrors(page);
      await openLesson(page, TWO);
      const c = challenge(page, WRITE);
      await c.scrollIntoViewIfNeeded();
      await c.getByRole("button", { name: V.editor.tap, exact: true }).tap();
      // No text box in this mode: nothing can be typed.
      await expect(c.getByRole("textbox")).toHaveCount(0);
      await c.locator(".asm-line-button").first().tap();
      const chip = (group: string, name: string) =>
        c
          .getByRole("group", { name: group, exact: true })
          .getByRole("button", { name, exact: true });
      await chip(V.editor.instruction, "sub").tap();
      await chip(V.editor.operand(1), "w0").tap();
      await chip(V.editor.operand(2), "w0").tap();
      await chip(V.editor.operand(3), "w1").tap();
      await c.getByRole("button", { name: V.editor.addBelow }).tap();
      await chip(V.editor.instruction, "ret").tap();
      await expect(c.locator(".asm-line-button")).toHaveCount(2);
      await expect(c.locator(".asm-line-button").first()).toContainText("sub w0, w0, w1");
      await run(c).tap();
      await expect(status(c)).toHaveText(passing(4));
      await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
      expect((await stored(page, TWO)).challenges[WRITE].artifact.text).toBe("sub w0, w0, w1\nret");
      expect(errors).toEqual([]);
    });

    test("offers the instructions of the gate and the two registers, and no other", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      const c = challenge(page, WRITE);
      await c.scrollIntoViewIfNeeded();
      await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
      await press(page, c.locator(".asm-line-button").first());
      const chips = (group: string) =>
        c.getByRole("group", { name: group, exact: true }).locator("button.chip");
      // A line that holds ret has no operands; choose an instruction that has them.
      await press(page, chips(V.editor.instruction).filter({ hasText: /^sub$/ }));
      // neg is not met until the failure experiment, so the gate and the chips leave it out.
      await expect(chips(V.editor.instruction)).toHaveText(["add", "sub", "adds", "subs", "ret"]);
      await expect(chips(V.editor.operand(1))).toHaveText(["w0", "w1"]);
    });

    test("fails the starting point on all four calls, and says what it returned", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      const c = challenge(page, WRITE);
      await c.scrollIntoViewIfNeeded();
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(0, 4));
      await expect(c.locator(".verdict-failure h4")).toHaveText([
        "elapsed(5000, 1000)",
        "elapsed(86400000, 3600000)",
        "elapsed(250, 4294967046)",
        "elapsed(30, 4294966296)",
      ]);
      await expect(c.locator(".verdict-failure").first()).toContainText("w0=5000");
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
    });

    test("rejects the operands the wrong way round and an addition, and refuses the tempting answer", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      const c = challenge(page, WRITE);
      await c.scrollIntoViewIfNeeded();
      const box = c.getByRole("textbox", { name: V.editor.textLabel });
      await box.fill("sub w0, w1, w0\nret");
      await press(page, run(c));
      await expect(status(c)).not.toHaveText(passing(4));
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      // The values of a failure are shown as the unsigned numbers they are, never negative.
      await expect(c.locator(".verdict-failure").first()).toContainText("w0=4294963296");
      await expect(c.locator(".verdict-failure").first()).toContainText("w0=4000");
      await expect(c.locator(".verdict")).not.toContainText("w0=-");
      await box.fill("add w0, w0, w1\nret");
      await press(page, run(c));
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      // A test for the wrap, then 2^32 added, needs instructions the lesson has not met.
      await box.fill("cmp w0, w1\nsub w0, w0, w1\nret");
      await expect(c.locator(".asm-problems")).toContainText("Line 1");
      await expect(c.locator(".asm-problems")).toContainText("cmp");
      await press(page, run(c));
      await expect(status(c)).toHaveText(S.challenge.blocked);
      await expect(c.locator(".verdict.blocked")).toContainText("cmp");
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
    });

    test("survives a reload, graded again, and goes back to the starting point when cleared", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      let c = challenge(page, WRITE);
      await c.scrollIntoViewIfNeeded();
      const box = c.getByRole("textbox", { name: V.editor.textLabel });
      await box.fill("sub w0, w0, w1\nret");
      await press(page, run(c));
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await page.reload();
      c = challenge(page, WRITE);
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await page.evaluate((k) => {
        const s = JSON.parse(localStorage.getItem(k)!);
        s.challenges["write-elapsed"].artifact.text = "sub w0, w1, w0\nret";
        localStorage.setItem(k, JSON.stringify(s));
      }, key(TWO));
      await page.reload();
      c = challenge(page, WRITE);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
      await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await expect(c.getByRole("textbox", { name: V.editor.textLabel })).toHaveValue("ret");
    });
  });

  test("the failure experiment: negs on 0x80000000 holds 0x80000000, with N and V set", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    const stepper = page.locator("#ix-step-negs");
    await expect(stepper.locator(".al-locked")).toBeVisible();
    await predictionCommitsBeforeItReveals(page, "predict-negs", /unchanged/, /^`?0x7fffffff`?$/);
    await expect(page.locator("#ix-predict-negs .al-nomatch")).toContainText(
      "w0 held 0x80000000 when the run ended. N was 1, Z was 0, C was 0 and V was 1.",
    );
    await expect(stepper.locator(".al-locked")).toHaveCount(0);
    await stepper.scrollIntoViewIfNeeded();
    const model = traceOf(NEGATE_FLAGS, { entry: "negate_flags", args: [0x80000000] });
    await expect(registerValue(stepper, "w0")).toHaveText("2147483648");
    expect(await flagValues(stepper)).toEqual(["0", "0", "0", "0"]);
    await press(page, stepper.getByRole("button", { name: V.stepper.next }));
    expect(wValue(viewAt(model, 1).state, 0)).toBe(0x80000000);
    await expect(registerValue(stepper, "w0")).toHaveText("2147483648");
    expect(await flagValues(stepper)).toEqual(["1", "0", "0", "1"]);
    await expect(stepper.locator(".al-flag[data-changed='true']")).toHaveCount(2);
    await press(page, stepper.getByRole("button", { name: V.stepper.next }));
    await expect(stepper.getByRole("button", { name: V.stepper.next })).toBeDisabled();
  });

  test.describe("one step past the top", () => {
    const fill = async (c: Locator, result: string, flag: string) => {
      await c.locator('[data-field="result"] input').fill(result);
      await c.locator('[data-field="c"] input').fill(flag);
    };

    test("shows the subtraction it is about, and asks for two numbers", async ({ page }) => {
      await openLesson(page, TWO);
      const c = challenge(page, STEP);
      await c.scrollIntoViewIfNeeded();
      await expect(c.locator(".al-insn .al-text")).toHaveText(["subs w0, w0, w1", "ret"]);
      await expect(c.locator(".answer-field")).toHaveCount(2);
    });

    test("rejects a wrong result and a wrong C, naming which, and never saying the value", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      const c = challenge(page, STEP);
      await c.scrollIntoViewIfNeeded();
      await fill(c, "4294967295", "0");
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(1, 2));
      await expect(c.locator(".verdict-failure h4")).toHaveText([
        "The result of elapsed(0, 4294967295)",
      ]);
      await fill(c, "1", "1");
      await press(page, run(c));
      await expect(c.locator(".verdict-failure h4")).toHaveText(["C after subs"]);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await expect(c.locator(".verdict")).not.toContainText(/\b1\b.*\b0\b/);
    });

    test("asks for both numbers before it grades anything", async ({ page }) => {
      await openLesson(page, TWO);
      const c = challenge(page, STEP);
      await c.scrollIntoViewIfNeeded();
      await c.locator('[data-field="result"] input').fill("1");
      await press(page, run(c));
      await expect(status(c)).toHaveText(S.challenge.blocked);
      await expect(c.locator(".verdict.blocked")).toContainText("C after");
    });

    test("accepts the reference, keeps it over a reload, and goes when the work is cleared", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      let c = challenge(page, STEP);
      await c.scrollIntoViewIfNeeded();
      const answers = lesson(TWO).challenges.find((x) => x.id === STEP)!.reference.answers!;
      await fill(c, answers["result"]!, answers["c"]!);
      await press(page, run(c));
      await expect(status(c)).toHaveText(passing(2));
      await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
      await page.reload();
      c = challenge(page, STEP);
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await expect(c.locator('[data-field="result"] input')).toHaveValue(answers["result"]!);
      await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
      await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await expect(c.locator('[data-field="result"] input')).toHaveValue("");
      await page.reload();
      await expect(challenge(page, STEP).locator(".challenge-complete")).toHaveCount(0);
    });
  });

  test.describe("the look of the lesson page", () => {
    test("text is legible, controls are reachable, nothing scrolls sideways, prose keeps its measure", async ({
      page,
    }, info) => {
      await openLesson(page, TWO);
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    });

    test("and so are the figures once they have been used, the tap editor open and verdicts shown", async ({
      page,
    }, info) => {
      const phone = info.project.name === "phone";
      await openLesson(page, TWO);
      await commit(page, "predict-elapsed", /^0$/);
      await commit(page, "predict-negs", /^0$/);
      const stepper = page.locator("#ix-step-negs");
      await press(page, stepper.getByRole("button", { name: V.stepper.next }));
      const write = challenge(page, WRITE);
      await press(page, write.getByRole("button", { name: V.editor.tap, exact: true }));
      await press(page, write.locator(".asm-line-button").first());
      await press(page, run(write));
      const step = challenge(page, STEP);
      await step.locator('[data-field="result"] input').fill("2");
      await step.locator('[data-field="c"] input').fill("1");
      await press(page, run(step));
      await press(page, step.getByRole("button", { name: /Show hint/ }));
      expect(await designProblems(page, phone)).toEqual([]);
      await press(page, write.getByRole("button", { name: V.editor.text, exact: true }));
      await write.getByRole("textbox", { name: V.editor.textLabel }).fill("cmp w0, w1");
      expect(await designProblems(page, phone)).toEqual([]);
    });
  });

  for (const theme of ["light", "dark"] as const) {
    test(`the ring is drawn in the ${theme} theme, with the ring, the wrap and the spans told apart`, async ({
      page,
    }) => {
      await page.goto("#/");
      await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      await page.reload();
      await openLesson(page, TWO);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await commit(page, "predict-elapsed", /^2000$/);
      const colours = await page.locator("#ix-counter-ring svg").evaluate((svg) => {
        const stroke = (selector: string) => getComputedStyle(svg.querySelector(selector)!).stroke;
        const fill = (selector: string) => getComputedStyle(svg.querySelector(selector)!).fill;
        return {
          ring: stroke(".al-ring-circle"),
          wrap: stroke(".al-ring-wrap"),
          background: getComputedStyle(document.body).backgroundColor,
          spot: fill(".al-ring-spot"),
        };
      });
      expect(colours.ring).not.toBe(colours.wrap);
      expect(colours.ring).not.toBe(colours.background);
      expect(colours.spot).not.toBe(colours.background);
    });
  }
});
