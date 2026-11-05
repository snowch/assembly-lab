// Copyright © 2026 Christopher Snow

// Module 1 browser regressions: arithmetic predictions and model traces, construction of −3,
// persisted challenge work and the lesson layout. The required readings sequence is checked in
// bit-weights.spec.ts.

import { expect, test, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { readingsOfPattern, patternOf } from "../../packages/views/src/readings";
import { MODULE1_STRINGS as M1 } from "../../packages/views/src/strings.module1";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";

import { TRIP_REMAINING, TRIP_REMAINING_U } from "../../content/lessons/module-1.listings";
import { CALL_COMPARISON_STRINGS as C } from "../../packages/views/src/strings.call-comparison";
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

test.describe("one subtraction with two C types", () => {
  const figure = (page: Page) => page.locator("#ix-compare-int-unsigned");

  test("shows the two complete C functions and starting arguments before revealing any instructions", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page, "arithmetic-on-register-bits");
    const f = figure(page);
    await expect(f.locator('[data-call-state="unpredicted"]')).toBeVisible();
    await expect(f.locator(".al-cline .al-src")).toHaveText([
      ...TRIP_REMAINING.c.split("\n"),
      ...TRIP_REMAINING_U.c.split("\n"),
    ]);
    await expect(f.locator(".al-compare-inputs")).toHaveText(C.startingInputs("3, 5"));
    await expect(f.locator(".al-insn, .al-outcome, [data-call-side]")).toHaveCount(0);
    await expect(f.getByRole("button", { name: C.callBoth })).toHaveCount(0);
    await f.getByRole("radio", { name: "The instructions are identical.", exact: true }).check();
    await expect(f.locator(".al-insn, .al-outcome, [data-call-side]")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  for (const identical of [true, false]) {
    test(`a ${identical ? "matching" : "different"} prediction reveals the recorded paired listings, before either call runs`, async ({
      page,
    }) => {
      await openLesson(page, "arithmetic-on-register-bits");
      await commit(
        page,
        "compare-int-unsigned",
        identical ? "The instructions are identical." : "The instructions differ.",
      );
      const f = figure(page);
      await expect(f.locator(identical ? ".al-match" : ".al-nomatch")).toBeVisible();
      await expect(f.locator('[data-call-state="ready"]')).toBeVisible();
      await expect(f.locator(".al-listing")).toHaveCount(2);
      await expect(f.locator(".al-insn .al-text")).toHaveText([
        "sub w0, w0, w1",
        "ret",
        "sub w0, w0, w1",
        "ret",
      ]);
      await expect(f.locator(".al-insn .al-ctag")).toHaveText(["3", "3", "3", "3"]);
      await expect(f.locator(".al-cline .al-src")).toHaveText([
        ...TRIP_REMAINING.c.split("\n"),
        ...TRIP_REMAINING_U.c.split("\n"),
      ]);
      await expect(f.locator("[data-call-side], [data-return-explanation]")).toHaveCount(0);
      await expect(f.getByRole("button", { name: C.callBoth })).toBeEnabled();
      await expect(f.locator(".al-compare-summary")).toHaveText(V.compare.allSame(2));
    });
  }

  test("runs both calls and shows the same 32 bits with each C return type's value", async ({
    page,
  }) => {
    await openLesson(page, "arithmetic-on-register-bits");
    await commit(page, "compare-int-unsigned", "The instructions are identical.");
    const f = figure(page);
    await press(page, f.getByRole("button", { name: C.callBoth, exact: true }));
    await expect(f.locator('[data-call-state="returned"]')).toBeVisible();
    for (const [side, type, value] of [
      ["left", "signed", "-2"],
      ["right", "unsigned", "4294967294"],
    ]) {
      const result = f.locator(`[data-call-side="${side}"]`);
      await expect(result.locator("[data-return-bits] .al-bit")).toHaveText([
        ..."1".repeat(31),
        "0",
      ]);
      await expect(result.locator("[data-return-hex]")).toHaveText("0xfffffffe");
      await expect(result.locator(`[data-return-reading="${type}"]`)).toHaveAttribute(
        "data-return-value",
        value!,
      );
    }
    await expect(f.locator('[data-same-bits="true"]')).toHaveText(C.sameBits);
    const explanation = f.locator("[data-return-explanation]");
    await expect(explanation).toContainText("2147483646 − 2147483648 = -2");
    await expect(explanation).toContainText("2147483646 + 2147483648 = 4294967294");
    await expect(explanation).toContainText("without a type tag");
    await expect(explanation.locator("a")).toHaveAttribute(
      "href",
      "#/lesson/same-bits-two-readings",
    );

    await expect(f.getByRole("button", { name: C.callBoth, exact: true })).toBeDisabled();
    await press(page, f.getByRole("button", { name: C.resetCalls, exact: true }));
    await expect(f.locator("[data-call-side], [data-return-explanation]")).toHaveCount(0);
    await expect(f.locator(".al-listing")).toHaveCount(2);
    await expect(f.locator(".al-match")).toBeVisible();
    await expect(f.getByRole("button", { name: C.callBoth, exact: true })).toBeEnabled();
  });

  test("retains the checked prediction and returned model results after reloading", async ({
    page,
  }) => {
    await openLesson(page, "arithmetic-on-register-bits");
    await commit(page, "compare-int-unsigned", "The instructions are identical.");
    await press(page, figure(page).getByRole("button", { name: C.callBoth, exact: true }));
    await page.reload();
    await expect(figure(page).locator(".al-match")).toBeVisible();
    await expect(figure(page).locator(".al-listing")).toHaveCount(2);
    await expect(figure(page).locator('[data-return-reading="signed"]')).toHaveAttribute(
      "data-return-value",
      "-2",
    );
    await expect(figure(page).locator('[data-return-reading="unsigned"]')).toHaveAttribute(
      "data-return-value",
      "4294967294",
    );
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
    const compiler = note(page, "question");
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
    await commit(page, "compare-int-unsigned", "The instructions differ.");
    await press(
      page,
      page
        .locator("#ix-compare-int-unsigned")
        .getByRole("button", { name: C.callBoth, exact: true }),
    );
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
