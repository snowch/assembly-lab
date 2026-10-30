// Copyright © 2026 Christopher Snow

// Module 4's figures that draw a decision as it is made, on the built site: the three stages of a
// compare, a condition and a select (beside the two listings, beside a stepper and beside the
// learner's own `less_fuel`), the table of conditions with its closed disclosure, the sentence after
// a branch, the two conditions read off one compare, the closed notes, the sentences the graders say,
// and the tap editor at 360 pixels building `fuel_warning` (a label created and renamed, a target
// picked, a conditional branch entered, a line moved and a line removed). Every value is compared with
// what the model gives for the same run.

import { expect, test, type Locator, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { COPY } from "../../content/lessons/pacing-1-4.copy";
import { PROSE as P1 } from "../../content/lessons/compare-and-choose.prose";
import { PROSE as P2 } from "../../content/lessons/branches.prose";
import {
  ARGS,
  LESS_FUEL_SIGNED_TEXT,
  LESS_FUEL_TEXT,
  STEEPER_S,
  STEEPER_U,
  STEEPER_U_GE,
} from "../../content/lessons/compare-and-choose.listings";
import { DESCRIBE, FUEL_WARNING_TEXT, SERVICE } from "../../content/lessons/branches.listings";
import { branchStatusAt } from "../../packages/views/src/branchPath";
import { selectModel } from "../../packages/views/src/select";
import { VIEW_STRINGS as V, quoted } from "../../packages/views/src/strings";
import { BRANCH_STRINGS as B } from "../../packages/views/src/strings.branch";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import { designProblems } from "./design";
import {
  challenge,
  commit,
  complete,
  failing,
  figureOverflow,
  openLesson,
  passing,
  press,
  run,
  status,
  stored,
  watchErrors,
} from "./module1";

const ONE = "compare-and-choose";
const TWO = "branches";
const NAMES = ["a", "b"];
const plain = (text: string) => text.replaceAll("`", "");
const I = V.editor.instruction;
const O = (n: number) => V.editor.operand(n);

const stage = (f: Locator, name: string) => f.locator(`.al-stage[data-stage="${name}"]`);
const flags = (f: Locator) =>
  f.locator(".al-flag").evaluateAll((els) => els.map((e) => e.getAttribute("data-value")));

/** The page does not scroll sideways, and nothing in a figure reaches past the screen. */
async function fits(page: Page) {
  const w = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(w.scroll).toBeLessThanOrEqual(w.client);
  expect(await figureOverflow(page)).toEqual([]);
}

test.describe("lesson 1: the compare, the condition and the select", () => {
  test("beside the two listings: the three stages of the function you choose, from the run", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page, ONE);
    const f = page.locator("#ix-compare-steeper");
    // Nothing of either run is on the page before the prediction is checked.
    await expect(f.locator(".al-stage")).toHaveCount(0);
    await commit(page, "predict-steeper-change", /^Only the last operand of csel changes\.$/);
    await f.scrollIntoViewIfNeeded();
    await expect(f.locator(".al-stage")).toHaveCount(3);
    const s = selectModel(traceOf(STEEPER_S, { entry: "steeper_s", args: [...ARGS] }), NAMES);
    const u = selectModel(traceOf(STEEPER_U, { entry: "steeper_u", args: [...ARGS] }), NAMES);
    // steeper_s: ge reads N = 0 and V = 0, answers yes, and w0 gets w1, which is 1.
    expect(s.select?.after).toBe(1);
    await expect(stage(f, "compare")).toContainText("cmp w1, w0 is b minus a");
    await expect(stage(f, "compare")).toContainText(B.select.noRegister);
    expect(await flags(stage(f, "compare"))).toEqual(["0", "0", "0", "0"]);
    await expect(stage(f, "condition")).toContainText("Flags it read: N = 0, V = 0");
    await expect(stage(f, "condition")).toContainText(B.select.answer(true));
    await expect(f.locator('[data-source="yes"]')).toHaveAttribute("data-chosen", "true");
    await expect(stage(f, "select")).toContainText("w0 now holds 1");
    // Switching to steeper_u changes the selected value, from its own run: cs is no, w0 keeps a.
    await press(page, f.getByRole("button", { name: "steeper_u", exact: true }));
    expect(u.select?.after).toBe(4294967295);
    await expect(stage(f, "condition")).toContainText("Flags it read: C = 0");
    await expect(stage(f, "condition")).toContainText(B.select.answer(false));
    await expect(f.locator('[data-source="no"]')).toHaveAttribute("data-chosen", "true");
    await expect(stage(f, "select")).toContainText("w0 now holds 0xffffffff");
    // Chosen and not chosen differ in text and in shape.
    await expect(f.locator('[data-source="no"] .al-source-tag')).toHaveText(B.select.chosen);
    await expect(f.locator('[data-source="yes"] .al-source-tag')).toHaveText(B.select.notChosen);
    await fits(page);
    expect(errors).toEqual([]);
  });

  test("beside the stepper: each stage shows once its instruction has run, ge and cs on the same flags", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    await commit(page, "predict-steeper-change", /^Only the last operand of csel changes\.$/);
    await commit(page, "predict-steeper-ge", /^1$/);
    const f = page.locator("#ix-step-steeper-ge");
    await f.scrollIntoViewIfNeeded();
    await expect(f.locator('.al-stage[data-done="true"]')).toHaveCount(0);
    await expect(f).not.toContainText("Answer:");
    const model = selectModel(
      traceOf(STEEPER_U_GE, { entry: "steeper_u", args: [0x80000000, 1] }),
      NAMES,
      ["cs"],
    );
    await press(page, f.getByRole("button", { name: V.stepper.next }));
    await expect(stage(f, "compare")).toHaveAttribute("data-done", "true");
    await expect(stage(f, "condition")).toHaveAttribute("data-done", "false");
    await expect(stage(f, "select")).toHaveAttribute("data-done", "false");
    expect(await flags(stage(f, "compare"))).toEqual(["1", "0", "0", "1"]);
    await expect(f).not.toContainText("now holds");
    await press(page, f.getByRole("button", { name: V.stepper.next }));
    await expect(f.locator('[data-cond="ge"]')).toHaveAttribute("data-holds", "true");
    await expect(f.locator('[data-cond="cs"]')).toHaveAttribute("data-holds", "false");
    expect(model.condition?.also[0]?.holds).toBe(false);
    await expect(stage(f, "select")).toContainText("w0 now holds 1");
  });

  test("beside the learner's own less_fuel: shut until the challenge passes, then their own text, stepped", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    const own = page.locator("#ix-step-own-less-fuel");
    await own.scrollIntoViewIfNeeded();
    await expect(own.locator(".al-locked")).toBeVisible();
    await expect(own).not.toContainText(plain(P1.lessFuelAfterPass));
    await expect(own.locator(".al-stage")).toHaveCount(0);
    const c = challenge(page, "write-less-fuel");
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    // A program that fails does not open it.
    await box.fill(LESS_FUEL_SIGNED_TEXT);
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(3, 5));
    await expect(own.locator(".al-locked")).toBeVisible();
    // One that passes does, and it is the learner's own text with its comments left out.
    await box.fill(
      `// the smaller\n${LESS_FUEL_TEXT.replace("cmp w0, w1", "cmp w0, w1 // a minus b")}`,
    );
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(5));
    await own.scrollIntoViewIfNeeded();
    await expect(own).toContainText(plain(P1.lessFuelAfterPass));
    await expect(own.locator(".al-insn .al-text")).toHaveText([
      "cmp w0, w1",
      "csel w0, w0, w1, cc",
      "ret",
    ]);
    await press(page, own.getByRole("button", { name: "less_fuel(0x80000000, 1)" }));
    await press(page, own.getByRole("button", { name: V.stepper.next }));
    await expect(stage(own, "compare")).toContainText("cmp w0, w1 is a minus b");
    await expect(stage(own, "condition")).toHaveAttribute("data-done", "false");
    await press(page, own.getByRole("button", { name: V.stepper.next }));
    await expect(stage(own, "condition")).toContainText(B.select.answer(false));
    await expect(stage(own, "select")).toContainText("w0 now holds 1");
    await fits(page);
  });

  test("the grader says what the run shows: the top bit, the larger value, and nothing for a pass", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    const c = challenge(page, "write-less-fuel");
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await box.fill(LESS_FUEL_SIGNED_TEXT);
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toContainText(
      quoted(P1.lessFuelFeedback.topBit),
    );
    await box.fill("ret");
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toContainText(
      quoted(P1.lessFuelFeedback.larger),
    );
    await box.fill(LESS_FUEL_TEXT);
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toHaveText(complete);
    await expect(c.locator(".verdict-detail")).toHaveCount(0);
  });

  test("the table of conditions: six at first, the rest behind Conditions beyond the first six, which opens from the keyboard", async ({
    page,
  }) => {
    await openLesson(page, "conditions-and-boolean-results");
    const f = page.locator("#ix-every-condition");
    await f.scrollIntoViewIfNeeded();
    await expect(f.locator(".al-cond-compare")).toContainText("cmp w0, w1 with a = w0 and b = w1");
    const more = f.locator("details.al-cond-more");
    await expect(more).not.toHaveAttribute("open", "");
    const shown = await f
      .locator(".al-cond")
      .evaluateAll((els) =>
        els.filter((e) => e.checkVisibility()).map((e) => e.getAttribute("data-cond")),
      );
    expect(shown).toEqual(["eq", "ne", "cs", "cc", "ge", "lt"]);
    await more.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(more).toHaveAttribute("open", "");
    await expect(f.locator(".al-cond:visible")).toHaveCount(11);
    await page.keyboard.press("Enter");
    await expect(more).not.toHaveAttribute("open", "");
    // The group headings are the lesson's: equality, unsigned order, signed order, others.
    await more.locator("summary").click();
    await expect(f.locator(".al-cond-group-head")).toHaveText([
      "Equality",
      "Unsigned order",
      "Signed order",
      "Unsigned order",
      "Signed order",
      "Others",
    ]);
    // After the compare of 0x7fffffff and 0xffffffff, each condition names the flags it read.
    await press(page, f.getByRole("button", { name: "0x7fffffff and 0xffffffff" }));
    await expect(f.locator('[data-cond="ge"]')).toContainText("Reads N = 1, V = 1");
    await expect(f.locator('[data-cond="ge"]')).toHaveAttribute("data-holds", "true");
    await expect(f.locator('[data-cond="lt"]')).toHaveAttribute("data-holds", "false");
    await fits(page);
  });

  test("the notes are closed to begin with, each under its title, and the answer is not in the prose", async ({
    page,
  }) => {
    await openLesson(page, "conditions-and-boolean-results");
    const notes = page.locator("details.lesson-details");
    await expect(notes.locator("summary")).toHaveText([
      P1.explanationNoteSummary,
      COPY.conditions.extensionsSummary,
      P1.reflectionNoteSummary,
    ]);
    for (const n of await notes.all()) await expect(n).not.toHaveAttribute("open", "");
    const last = page.locator('section[data-kind="reflection"]');
    await last.scrollIntoViewIfNeeded();
    await expect(last.locator(".prose").first()).toContainText("Question:");
    await expect(last.locator(".prose").first()).not.toContainText("keeps 2");
    await expect(last).toContainText("What you now know");
    await press(page, last.locator("details summary"));
    await expect(last.locator("details")).toContainText("keeps 2");
  });
});

test.describe("lesson 2: the path, the sentence after a branch, two conditions on one compare", () => {
  const lesson2 = {
    ...LESSONS.find((l) => l.id === TWO)!,
    challenges: LESSONS.filter((l) => l.module === 4).flatMap((l) => l.challenges),
  };

  test("the stepper says what a branch did and what runs next, and the marker's jump shows", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    await commit(page, "predict-describe-count", /^5$/);
    const f = page.locator("#ix-step-describe");
    await f.scrollIntoViewIfNeeded();
    const model = traceOf(DESCRIBE, { entry: "describe", args: [15] });
    const say = () => f.locator(".al-status");
    for (let k = 1; k <= 5; k++) {
      await press(page, f.getByRole("button", { name: V.stepper.next }));
      const sentence = branchStatusAt(model, viewAt(model, k));
      if (sentence !== null) await expect(say()).toHaveText(sentence.replaceAll("`", ""));
      const jumped = k === 2 || k === 4;
      if (jumped)
        await expect(f.locator("[data-figure='stepper']")).toHaveAttribute("data-jump", "true");
      else
        await expect(f.locator("[data-figure='stepper']")).not.toHaveAttribute("data-jump", "true");
    }
    // `bgt` taken to .L9, then b always to .L7.
    expect(branchStatusAt(model, viewAt(model, 2))).toBe(
      "`bgt .L9` was taken. Next: `mov w0, 2` at `.L9`.",
    );
    expect(branchStatusAt(model, viewAt(model, 4))).toBe(
      "`b .L7` always goes to `.L7`. Next: `ret`.",
    );
  });

  test("the jump is marked without motion when motion is reduced", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openLesson(page, TWO);
    await commit(page, "predict-describe-count", /^5$/);
    const f = page.locator("#ix-step-describe");
    await f.scrollIntoViewIfNeeded();
    await press(page, f.getByRole("button", { name: V.stepper.next }));
    await press(page, f.getByRole("button", { name: V.stepper.next }));
    const row = f.locator('.al-insn[data-next="true"]');
    await expect(row.locator(".al-text")).toHaveText("mov w0, 2");
    const style = await row.evaluate((e) => ({
      animation: getComputedStyle(e).animationName,
      outline: getComputedStyle(e).outlineStyle,
    }));
    expect(style.animation).toBe("none");
    expect(style.outline).toBe("solid");
  });

  test("bgt and bge read the same flags: the compare shows gt no and ge yes, and the run takes the branch", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    await commit(page, "predict-describe-bge", /^0$/);
    const f = page.locator("#ix-step-describe-bge");
    await f.scrollIntoViewIfNeeded();
    await expect(f.locator(".al-cond-two")).toHaveCount(0);
    await press(page, f.getByRole("button", { name: V.stepper.next }));
    expect(await flags(f.locator(".al-two"))).toEqual(["0", "1", "1", "0"]);
    await expect(f.locator('[data-cond="gt"]')).toHaveAttribute("data-holds", "false");
    await expect(f.locator('[data-cond="gt"]')).toContainText("Reads N = 0, Z = 1, V = 0");
    await expect(f.locator('[data-cond="ge"]')).toHaveAttribute("data-holds", "true");
    await expect(f.locator('[data-cond="ge"]')).toContainText(
      B.twoConditions.usedBy("bge .L9").replaceAll("`", ""),
    );
    await press(page, f.getByRole("button", { name: V.stepper.next }));
    await expect(f.locator(".al-status")).toHaveText("bge .L9 was taken. Next: mov w0, 2 at .L9.");
    await fits(page);
  });

  test("the notes are closed to begin with, each under its title", async ({ page }) => {
    await openLesson(page, TWO);
    const notes = page.locator("details.lesson-details");
    await expect(notes.locator("summary")).toHaveText([
      P2.questionNoteSummary,
      P2.investigationNoteSummary,
    ]);
    for (const n of await notes.all()) await expect(n).not.toHaveAttribute("open", "");
    await openLesson(page, "register-and-bit-branches");
    await expect(page.locator('section[data-kind="reflection"]')).toContainText(
      "What you now know",
    );
  });

  test("the grader says which of the checks to look at, and tells a wrong count where to look", async ({
    page,
  }) => {
    await openLesson(page, "zero-and-threshold-branches");
    const c = challenge(page, "write-fuel-warning");
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await box.fill(
      [
        "cmp w0, w1",
        "b.cc .Llow",
        "cbz w0, .Lempty",
        "mov w0, 0",
        "ret",
        ".Llow:",
        "mov w0, 1",
        "ret",
        ".Lempty:",
        "mov w0, 2",
        "ret",
      ].join("\n"),
    );
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toContainText(
      quoted(P2.fuelWarningFeedback.zeroFirst),
    );
    // The check for 0 is first and the block under .Lempty has no ret: the run goes on into .Llow.
    // That is not an order fault, and the page does not blame the order.
    await box.fill(
      [
        "cbz w0, .Lempty",
        "cmp w0, w1",
        "b.cc .Llow",
        "mov w0, 0",
        "ret",
        ".Lempty:",
        "mov w0, 2",
        ".Llow:",
        "mov w0, 1",
        "ret",
      ].join("\n"),
    );
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toContainText(
      quoted(P2.fuelWarningFeedback.fellThrough),
    );
    await expect(c.locator(".verdict-failure").first()).not.toContainText(
      quoted(P2.fuelWarningFeedback.zeroFirst),
    );
    await box.fill(FUEL_WARNING_TEXT.replace("b.cc", "b.lt"));
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toContainText(
      quoted(P2.fuelWarningFeedback.topBit),
    );
    await openLesson(page, TWO);
    const counts = challenge(page, "count-describe-runs");
    await counts.scrollIntoViewIfNeeded();
    const answers = lesson2.challenges.find((x) => x.id === "count-describe-runs")!.reference
      .answers!;
    for (const [id, value] of Object.entries({ ...answers, steps11: "6" }))
      await counts.locator(`[data-field="${id}"] input`).fill(value);
    await press(page, run(counts));
    await expect(counts.locator(".verdict-failure")).toHaveCount(1);
    await expect(counts.locator(".verdict-detail")).toHaveText(P2.countsFeedback);
  });
});

test.describe("at 360 pixels", () => {
  test.use({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true });

  test.beforeEach(async ({}, info) => {
    test.skip(info.project.name !== "phone", "360 pixels is the phone's width");
  });

  test("the figures of Module 4 stay inside the screen: the panel, the table, the path and the stepper", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page, ONE);
    await commit(page, "predict-steeper-change", /^Only the last operand of csel changes\.$/);
    await commit(page, "predict-steeper-ge", /^1$/);
    const f = page.locator("#ix-step-steeper-ge");
    await press(page, f.getByRole("button", { name: V.stepper.next }));
    await press(page, f.getByRole("button", { name: V.stepper.next }));
    expect(await designProblems(page, true)).toEqual([]);
    await openLesson(page, "conditions-and-boolean-results");
    await press(page, page.locator("#ix-every-condition details summary"));
    expect(await designProblems(page, true)).toEqual([]);
    await fits(page);
    await openLesson(page, TWO);
    await commit(page, "predict-describe-count", /^5$/);
    const arrows = page.locator("#ix-describe-arrows");
    await arrows.scrollIntoViewIfNeeded();
    for (const g of ["10", "-15", "0", "15"]) {
      await press(page, arrows.getByRole("button", { name: g, exact: true }));
      // A row's tags stay in the row, and the arrows keep to their instructions' rows.
      const rows = await arrows
        .locator(".al-brow")
        .evaluateAll((els) =>
          els.map((e) => [e.scrollWidth - e.clientWidth, e.getBoundingClientRect().height]),
        );
      for (const [over, height] of rows) {
        expect(over).toBeLessThanOrEqual(1);
        expect(height).toBe(36);
      }
    }
    await commit(page, "predict-describe-bge", /^0$/);
    const bge = page.locator("#ix-step-describe-bge");
    await press(page, bge.getByRole("button", { name: V.stepper.next }));
    await press(page, bge.getByRole("button", { name: V.stepper.next }));
    expect(await designProblems(page, true)).toEqual([]);
    await fits(page);
    expect(errors).toEqual([]);
  });

  test("the tap editor builds fuel_warning: creates and renames a label, picks a target, enters a conditional branch, moves a line and removes one", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page, "zero-and-threshold-branches");
    const c = challenge(page, "write-fuel-warning");
    await c.scrollIntoViewIfNeeded();
    await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
    const chip = (group: string, name: string) =>
      c.getByRole("group", { name: group, exact: true }).getByRole("button", { name, exact: true });
    const taps = async (list: [string, string][]) => {
      for (const [group, name] of list) await press(page, chip(group, name));
    };
    const first = async () => {
      await press(page, c.locator(".asm-line-button").first());
      await press(page, c.getByRole("button", { name: V.editor.remove }));
    };
    const addBelow = () => press(page, c.getByRole("button", { name: V.editor.addBelow }));
    const number = async (digit: string) => {
      await press(
        page,
        c
          .getByRole("group", { name: O(2), exact: true })
          .getByRole("button", { name: V.editor.number }),
      );
      await press(
        page,
        c
          .getByRole("group", { name: V.editor.numberPad, exact: true })
          .getByRole("button", { name: digit, exact: true }),
      );
    };
    const text = async () =>
      (await stored(page, "zero-and-threshold-branches")).challenges["write-fuel-warning"].artifact
        .text;
    // Out with the starting point's two lines.
    await first();
    await first();
    await press(page, c.getByRole("button", { name: V.editor.addFirst }));
    // A conditional branch and a target picked: cbz w0, .Lempty.
    await taps([
      [I, "cbz"],
      [O(1), "w0"],
      [O(2), ".Lempty"],
    ]);
    await addBelow();
    await taps([
      [I, "cmp"],
      [O(1), "w0"],
      [O(2), "w1"],
    ]);
    await addBelow();
    // b.cc names a label that the program has not defined yet: the editor says so, in the machine's words.
    await taps([
      [I, "b.cc"],
      [O(1), ".Lok"],
    ]);
    await expect(c.locator(".asm-error").first()).toContainText(".Lempty");
    // The two lines in the wrong order, then the right one by moving: ret, then mov w0, 0.
    await addBelow();
    await taps([[I, "ret"]]);
    await addBelow();
    await taps([
      [I, "mov"],
      [O(1), "w0"],
    ]);
    await number("0");
    await press(page, c.getByRole("button", { name: V.editor.up }));
    await press(page, c.locator(".asm-line-button").nth(4));
    await expect(c.locator(".asm-line-button code")).toHaveText([
      "cbz w0, .Lempty",
      "cmp w0, w1",
      "b.cc .Lok",
      "mov w0, #0",
      "ret",
    ]);
    // A label created on its own line, then the rest of the program.
    await addBelow();
    await taps([[I, ".Lok:"]]);
    await addBelow();
    await taps([
      [I, "mov"],
      [O(1), "w0"],
    ]);
    await number("1");
    await addBelow();
    await taps([[I, "ret"]]);
    await addBelow();
    await taps([[I, ".Lempty:"]]);
    await addBelow();
    await taps([
      [I, "mov"],
      [O(1), "w0"],
    ]);
    await number("2");
    await addBelow();
    await taps([[I, "ret"]]);
    // A stray line, removed.
    await addBelow();
    await taps([[I, "ret"]]);
    await expect(c.locator(".asm-line-button")).toHaveCount(12);
    await press(page, c.getByRole("button", { name: V.editor.remove }));
    await expect(c.locator(".asm-line-button")).toHaveCount(11);
    // Rename .Lok: to .Llow: from the label's own line. The branch to it follows the new name.
    await press(page, c.locator(".asm-line-button").nth(5));
    await taps([[I, ".Llow:"]]);
    await press(page, c.getByRole("button", { name: V.editor.done, exact: true }));
    await expect(c.locator(".asm-error")).toHaveCount(0);
    expect(await text()).toBe(
      [
        "cbz w0, .Lempty",
        "cmp w0, w1",
        "b.cc .Llow",
        "mov w0, #0",
        "ret",
        ".Llow:",
        "mov w0, #1",
        "ret",
        ".Lempty:",
        "mov w0, #2",
        "ret",
      ].join("\n"),
    );
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(5));
    // Every control is reachable at this width: no page scroll sideways, none under 40 pixels.
    expect(await designProblems(page, true)).toEqual([]);
    await fits(page);
    expect(errors).toEqual([]);
  });
});

for (const theme of ["light", "dark"] as const) {
  test(`the register-bit branch unit steps its fixed service call and resets in ${theme}`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem("assembly-lab:v1:theme", value),
      theme,
    );
    await openLesson(page, "register-and-bit-branches");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const figure = page.locator("#ix-follow-service-bit-test");
    const model = traceOf(SERVICE, { entry: "service", args: [0x2a] });
    const value = figure.locator('[data-register="w0"] .al-reg-value');
    const next = figure.getByRole("button", { name: V.stepper.next, exact: true });
    for (let step = 0; step <= model.result.steps.length; step++) {
      await expect(value).toHaveText(String(wValue(viewAt(model, step).state, 0)));
      if (step < model.result.steps.length) await next.click();
    }
    await expect(next).toBeDisabled();
    await figure.getByRole("button", { name: V.stepper.reset, exact: true }).click();
    await expect(value).toHaveText(String(wValue(viewAt(model, 0).state, 0)));
    expect(await designProblems(page, page.viewportSize()!.width < 500)).toEqual([]);
  });
}
