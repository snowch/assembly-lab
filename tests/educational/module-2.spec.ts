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
import { RUNTIME_STRINGS as S } from "../../apps/course/src/runtime-strings";
import { additionSteps, bitAt, flagDigits } from "../../packages/views/src/arith";
import { FLAGS_LESSON_SECTIONS } from "../../packages/views/src/flags-lesson/strings";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { ARITH_STRINGS as A } from "../../packages/views/src/strings.arith";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import { format } from "../../platform/lesson-runtime/src/strings";

import { SUM_FLAGS } from "../../content/lessons/adding-and-the-flags.listings";
import {
  ELAPSED,
  ELAPSED_SUBS,
  NEGATE_FLAGS,
} from "../../content/lessons/subtracting-and-the-tick-counter.listings";
import { designProblems } from "./design";
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
  await expect(page.locator("section.lesson-section")).toHaveCount(
    id === "adding-and-the-flags" ? FLAGS_LESSON_SECTIONS.length : lesson(id).sections.length,
  );
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
  test("the stepper after the failure experiment's prediction: adds, then add, the flags the adds left kept and w0 the model's", async ({
    page,
  }) => {
    await openLesson(page, "flags-and-overflow");
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

  test.describe("the smallest overflow", () => {
    const answer = async (c: Locator, text: string) =>
      c.locator('[data-field="number"] input').fill(text);

    test("shows the program it is about, and asks for one number", async ({ page }) => {
      await openLesson(page, "flags-and-overflow");
      const c = challenge(page, "smallest-overflow");
      await c.scrollIntoViewIfNeeded();
      await expect(c.locator(".al-insn .al-text")).toHaveText(["adds w0, w0, w1", "ret"]);
      await expect(c.locator(".answer-field")).toHaveCount(1);
    });

    test("rejects 1, which does not overflow, and 3, which is not the smallest, without saying 2", async ({
      page,
    }) => {
      await openLesson(page, "flags-and-overflow");
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
      await openLesson(page, "flags-and-overflow");
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
      await openLesson(page, "flags-and-overflow");
      let c = challenge(page, "smallest-overflow");
      await c.scrollIntoViewIfNeeded();
      const reference = LESSONS.flatMap((unit) => unit.challenges).find(
        (x) => x.id === "smallest-overflow",
      )!.reference.answers!["number"]!;
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
});

// ---------------------------------------------------------------------------------------------
// Lesson 2

const ELAPSED_CALL = { entry: "elapsed", args: [1000, 4294966296] };
const WRITE = "write-elapsed";
const STEP = "one-step-past";

test.describe("lesson 2, Subtracting, and the tick counter", () => {
  test("loads with no console error, selected sections and two challenges", async ({ page }) => {
    const errors = watchErrors(page);
    await openLesson(page, "subtracting-and-the-tick-counter");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson(TWO).title);
    await expect(page.locator("section.challenge")).toHaveCount(1);
    await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
    await expect(page).toHaveTitle(`${lesson(TWO).title} / Assembly Lab`);
    expect(errors).toEqual([]);
  });

  test("the prediction about elapsed commits before it reveals, and the model says 2000", async ({
    page,
  }) => {
    await openLesson(page, "subtracting-and-the-tick-counter");
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
    await expect(figure.locator(".al-match")).toContainText("The run ended with w0 holding 2000.");
  });

  test("the ring stays shut until the prediction is checked, then shows the model's distance and C", async ({
    page,
  }) => {
    await openLesson(page, "subtracting-and-the-tick-counter");
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
    await expect(ring.locator("svg")).toHaveAttribute("data-borrowed", "true");
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
        await openLesson(page, "subtraction-flags-and-negation");
        const adder = page.locator(`#ix-${d.id}`);
        await adder.scrollIntoViewIfNeeded();
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
        // It opens at its final state: the flags, the carry out, and the result and C in words.
        expect(await flagValues(adder)).toEqual(d.flags);
        expect(await flagValues(adder)).toEqual(flagDigits(model.result.final.flags).map(String));
        await expect(adder.locator('[data-top="out"]')).toHaveAttribute("data-value", d.out);
        await expect(adder.locator('.al-adder-final [data-line="c"]')).toHaveText(
          A.adder.final.cSub(Number(d.out)),
        );
        await expect(adder.locator(".al-adder-key")).toBeVisible();
        // Its column-by-column view is there to step through from the start: 1 is carried in first.
        await press(page, adder.getByRole("button", { name: A.adder.reset }));
        await expect(adder.locator(".al-adder-final")).toHaveCount(0);
        await press(page, adder.getByRole("button", { name: A.adder.next }));
        await expect(cell("carry", 0)).toHaveAttribute("data-value", "1");
        await press(page, adder.getByRole("button", { name: A.adder.all }));
        expect(await flagValues(adder)).toEqual(d.flags);
      });
    }
  });

  test.describe("the construction challenge", () => {
    test("is completed by typing, at the desktop width", async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "typing is the desktop width's way in");
      const errors = watchErrors(page);
      await openLesson(page, "subtracting-and-the-tick-counter");
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
      await openLesson(page, "subtracting-and-the-tick-counter");
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
      expect(
        (await stored(page, "subtracting-and-the-tick-counter")).challenges[WRITE].artifact.text,
      ).toBe("sub w0, w0, w1\nret");
      expect(errors).toEqual([]);
    });

    test("offers the instructions of the gate and the two registers, and no other", async ({
      page,
    }) => {
      await openLesson(page, "subtracting-and-the-tick-counter");
      const c = challenge(page, WRITE);
      await c.scrollIntoViewIfNeeded();
      await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
      await press(page, c.locator(".asm-line-button").first());
      const chips = (group: string) =>
        c.getByRole("group", { name: group, exact: true }).locator("button.chip");
      // A line that holds ret has no operands; choose an instruction that has them.
      await press(page, chips(V.editor.instruction).filter({ hasText: /^sub$/ }));
      // neg is taught here but this challenge does not allow it, so the chips leave it out.
      await expect(chips(V.editor.instruction)).toHaveText(["add", "sub", "adds", "subs", "ret"]);
      await expect(chips(V.editor.operand(1))).toHaveText(["w0", "w1"]);
    });

    test("fails the starting point on all four calls, and says what it returned", async ({
      page,
    }) => {
      await openLesson(page, "subtracting-and-the-tick-counter");
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
      await openLesson(page, "subtracting-and-the-tick-counter");
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
      await openLesson(page, "subtracting-and-the-tick-counter");
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
    await openLesson(page, "subtraction-flags-and-negation");
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
      await openLesson(page, "subtraction-flags-and-negation");
      const c = challenge(page, STEP);
      await c.scrollIntoViewIfNeeded();
      await expect(c.locator(".al-insn .al-text")).toHaveText(["subs w0, w0, w1", "ret"]);
      await expect(c.locator(".answer-field")).toHaveCount(2);
    });

    test("rejects a wrong result and a wrong C, naming which, and never saying the value", async ({
      page,
    }) => {
      await openLesson(page, "subtraction-flags-and-negation");
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
      await openLesson(page, "subtraction-flags-and-negation");
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
      await openLesson(page, "subtraction-flags-and-negation");
      let c = challenge(page, STEP);
      await c.scrollIntoViewIfNeeded();
      const answers = LESSONS.flatMap((unit) => unit.challenges).find((x) => x.id === STEP)!
        .reference.answers!;
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
      await openLesson(page, "subtracting-and-the-tick-counter");
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    });

    test("and so are the figures once they have been used, the tap editor open and verdicts shown", async ({
      page,
    }, info) => {
      const phone = info.project.name === "phone";
      await openLesson(page, "subtracting-and-the-tick-counter");
      await commit(page, "predict-elapsed", /^0$/);
      await openLesson(page, "subtraction-flags-and-negation");
      await commit(page, "predict-negs", /^0$/);
      const stepper = page.locator("#ix-step-negs");
      await press(page, stepper.getByRole("button", { name: V.stepper.next }));
      await openLesson(page, "subtracting-and-the-tick-counter");
      const write = challenge(page, WRITE);
      await press(page, write.getByRole("button", { name: V.editor.tap, exact: true }));
      await press(page, write.locator(".asm-line-button").first());
      await press(page, run(write));
      await openLesson(page, "subtraction-flags-and-negation");
      const step = challenge(page, STEP);
      await step.locator('[data-field="result"] input').fill("2");
      await step.locator('[data-field="c"] input').fill("1");
      await press(page, run(step));
      await press(page, step.getByRole("button", { name: /Show hint/ }));
      expect(await designProblems(page, phone)).toEqual([]);
      await openLesson(page, "subtracting-and-the-tick-counter");
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
      await openLesson(page, "subtracting-and-the-tick-counter");
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
