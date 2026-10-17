// Copyright © 2026 Christopher Snow

// Module 4, Compare and branch, in a browser, on the built site, at desktop and phone widths.
// Lesson 1: the lesson loads without an error; the prediction about the changed listing commits
// before it reveals, and the model says which option is right; the two listings open only after it
// and mark the one item that differs; `less_fuel` is completed by typing (desktop) and by tapping
// alone (phone), the signed condition and the instructions the lesson has not met are refused;
// the failure experiment's prediction and stepper show the model's values; the figure of every
// condition shows what the model's own compare gives; the last challenge rejects wrong answers and
// accepts the reference. Lesson 2: the same, with the count of instructions, the arrows from each
// branch to its label, and `fuel_warning` built from labels and branches by typing and by tapping.
// Completion survives a reload and is graded again, Clear work removes it, and every page keeps the
// look the shell's own pages keep.

import { expect, test, type Locator, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { BRANCH_STRINGS as B, CONDITION_ROWS } from "../../packages/views/src/strings.branch";
import { VIEW_STRINGS as V, quoted } from "../../packages/views/src/strings";
import { branchArrows, compareResult } from "../../packages/views/src/branch";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";

import {
  STEEPER_S,
  STEEPER_U,
  STEEPER_U_GE,
} from "../../content/lessons/compare-and-choose.listings";
import {
  DESCRIBE,
  DESCRIBE_BGE,
  FUEL_WARNING_SHARED_RET_TEXT,
  FUEL_WARNING_TEXT,
} from "../../content/lessons/branches.listings";
import { PROSE as P1 } from "../../content/lessons/compare-and-choose.prose";
import { designProblems } from "./design";
import {
  blocked,
  challenge,
  commit,
  complete,
  failing,
  figureOverflow,
  openLesson,
  passing,
  press,
  registerValue,
  run,
  status,
  stored,
  storageKey,
  watchErrors,
} from "./module1";

const ONE = "compare-and-choose";
const TWO = "branches";
const lesson = (id: string) => LESSONS.find((l) => l.id === id)!;
const plain = (text: string) => text.replaceAll("`", "");

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

const chip = (c: Locator, group: string, name: string) =>
  c.getByRole("group", { name: group, exact: true }).getByRole("button", { name, exact: true });

/** Builds a program in the tap editor, one line to a tap-through: `steps` is a list of lines, each a list of taps. */
async function tapLine(page: Page, c: Locator, taps: [string, string][], first: boolean) {
  if (first) await press(page, c.locator(".asm-line-button").first());
  else await press(page, c.getByRole("button", { name: V.editor.addBelow }));
  for (const [group, name] of taps) await press(page, chip(c, group, name));
}

const I = V.editor.instruction;
const O = (n: number) => V.editor.operand(n);

// ---------------------------------------------------------------------------------------------
// Lesson 1

const LESS = "write-less-fuel";
const HOLDS = "read-four-conditions";

test.describe("lesson 1, Compare, and the signed or unsigned condition", () => {
  test("loads with no console error, ten sections, two challenges and no figure problem", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page, ONE);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson(ONE).title);
    await expect(page.locator("section.challenge")).toHaveCount(2);
    await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
    await expect(page).toHaveTitle(`${lesson(ONE).title} / Assembly Lab`);
    expect(errors).toEqual([]);
  });

  test("the first figure shows the C of both functions, one listing, and what each returns, from the model", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    const figure = page.locator("#ix-steeper-runs");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-cline")).toHaveCount(2);
    await expect(figure.locator(".al-insn .al-text")).toHaveText([
      "cmp w1, w0",
      "csel w0, w1, w0, ge",
      "ret",
    ]);
    const s = traceOf(STEEPER_S, { entry: "steeper_s", args: [0xffffffff, 1] });
    const u = traceOf(STEEPER_U, { entry: "steeper_u", args: [0xffffffff, 1] });
    expect(wValue(s.result.final, 0)).toBe(1);
    expect(wValue(u.result.final, 0)).toBe(4294967295);
    await expect(figure.locator(".al-run")).toHaveText([
      "steeper_s(0xffffffff, 1) returns 1",
      "steeper_u(0xffffffff, 1) returns 4294967295",
    ]);
  });

  test("the prediction commits before it reveals, and the model says only the last operand of csel changes", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    const figure = page.locator("#ix-predict-steeper-change");
    await figure.scrollIntoViewIfNeeded();
    // Nothing of steeper_u's instructions is there before the commit.
    await expect(figure.getByText("csel w0, w1, w0, cs")).toHaveCount(0);
    await predictionCommitsBeforeItReveals(
      page,
      "predict-steeper-change",
      /^Only the last operand of csel changes\.$/,
      /^The operands of cmp change\.$/,
    );
    await expect(figure.locator(".al-nomatch")).toContainText(plain(B.change.said.last("csel")));
  });

  test("the two listings stay shut until the prediction is checked, then mark the one item that differs", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    const diff = page.locator("#ix-compare-steeper");
    await expect(diff.locator(".al-locked")).toBeVisible();
    await expect(diff.locator(".al-diff-row")).toHaveCount(0);
    await commit(page, "predict-steeper-change", /^Only the last operand of csel changes\.$/);
    await diff.scrollIntoViewIfNeeded();
    await expect(diff.locator(".al-diff-row")).toHaveCount(3);
    await expect(diff.locator("mark.al-diff-item")).toHaveCount(2);
    await expect(diff.locator("mark.al-diff-item").first()).toContainText("ge");
    await expect(diff.locator("mark.al-diff-item").last()).toContainText("cs");
    await expect(diff.locator('.al-diff-row[data-differs="true"]')).toHaveCount(1);
    await expect(diff.locator(".al-compare-summary")).toHaveText(B.diff.summary(1));
  });

  test("a commitment is kept, and is still there after a reload", async ({ page }) => {
    await openLesson(page, ONE);
    await commit(page, "predict-steeper-change", /^Only the last operand of csel changes\.$/);
    await page.reload();
    await expect(page.locator("#ix-predict-steeper-change .al-match")).toBeVisible();
    await expect(page.locator("#ix-compare-steeper .al-locked")).toHaveCount(0);
  });

  test.describe("the construction challenge, less_fuel", () => {
    test("is completed by typing, at the desktop width", async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "typing is the desktop width's way in");
      const errors = watchErrors(page);
      await openLesson(page, ONE);
      const c = challenge(page, LESS);
      await c.scrollIntoViewIfNeeded();
      const box = c.getByRole("textbox", { name: V.editor.textLabel });
      await expect(box).toHaveValue("ret");
      await box.fill("");
      await box.pressSequentially("cmp w0, w1\ncsel w0, w0, w1, cc\nret");
      await run(c).click();
      await expect(status(c)).toHaveText(passing(5));
      await expect(c.locator(".challenge-complete")).toHaveText(complete);
      expect(errors).toEqual([]);
    });

    test("is completed by tapping alone, at the phone width", async ({ page }, info) => {
      test.skip(info.project.name !== "phone", "tapping is the phone width's way in");
      const errors = watchErrors(page);
      await openLesson(page, ONE);
      const c = challenge(page, LESS);
      await c.scrollIntoViewIfNeeded();
      await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
      // No text box in this mode: nothing can be typed.
      await expect(c.getByRole("textbox")).toHaveCount(0);
      await tapLine(
        page,
        c,
        [
          [I, "cmp"],
          [O(1), "w0"],
          [O(2), "w1"],
        ],
        true,
      );
      await tapLine(
        page,
        c,
        [
          [I, "csel"],
          [O(1), "w0"],
          [O(2), "w0"],
          [O(3), "w1"],
          [O(4), "cc"],
        ],
        false,
      );
      await tapLine(page, c, [[I, "ret"]], false);
      await expect(c.locator(".asm-line-button")).toHaveCount(3);
      await run(c).tap();
      await expect(status(c)).toHaveText(passing(5));
      await expect(c.locator(".challenge-complete")).toHaveText(complete);
      expect((await stored(page, ONE)).challenges[LESS].artifact.text).toBe(
        "cmp w0, w1\ncsel w0, w0, w1, cc\nret",
      );
      expect(errors).toEqual([]);
    });

    test("offers the three instructions of the gate, the two registers and the ten conditions, and no other", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      const c = challenge(page, LESS);
      await c.scrollIntoViewIfNeeded();
      await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
      await press(page, c.locator(".asm-line-button").first());
      const chips = (group: string) =>
        c.getByRole("group", { name: group, exact: true }).locator("button.chip");
      await expect(chips(I)).toHaveText(["cmp", "csel", "ret"]);
      await press(page, chips(I).filter({ hasText: /^csel$/ }));
      await expect(chips(O(1))).toHaveText(["w0", "w1"]);
      await expect(chips(O(4))).toHaveText([
        "eq",
        "ne",
        "cs",
        "cc",
        "hi",
        "ls",
        "ge",
        "lt",
        "gt",
        "le",
      ]);
    });

    test("fails the starting point on (7, 3) and (0x80000000, 1), and says what it returned", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      const c = challenge(page, LESS);
      await c.scrollIntoViewIfNeeded();
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(3, 5));
      await expect(c.locator(".verdict-failure h4")).toHaveText([
        "less_fuel(7, 3)",
        "less_fuel(0x80000000, 1)",
      ]);
      // The first card says what the run shows (the larger value comes back), in the lesson's words;
      // the second keeps the values the grader prints.
      await expect(c.locator(".verdict-failure").first()).toContainText(
        quoted(P1.lessFuelFeedback.larger),
      );
      await expect(c.locator(".verdict-failure").last()).toContainText("w0=2147483648");
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
    });

    test("rejects the signed condition, which fails the two calls with the top bit set, and refuses cset", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      const c = challenge(page, LESS);
      await c.scrollIntoViewIfNeeded();
      const box = c.getByRole("textbox", { name: V.editor.textLabel });
      await box.fill("cmp w0, w1\ncsel w0, w0, w1, lt\nret");
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(3, 5));
      await expect(c.locator(".verdict-failure h4")).toHaveText([
        "less_fuel(0x80000000, 1)",
        "less_fuel(1, 0x80000000)",
      ]);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      // The larger of the two, and the compare the wrong way round, fail too.
      await box.fill("cmp w0, w1\ncsel w0, w0, w1, hi\nret");
      await press(page, run(c));
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      // `cset` is taught in this lesson, so the gate says what the challenge allows and not that
      // `cset` is not met.
      await box.fill("cmp w0, w1\ncset w0, cc\nret");
      await expect(c.locator(".asm-problems")).toContainText("Line 2");
      await expect(c.locator(".asm-problems")).toContainText("allows only");
      await expect(c.locator(".asm-problems")).not.toContainText("not met");
      await press(page, run(c));
      await expect(status(c)).toHaveText(blocked);
      await expect(c.locator(".verdict.blocked")).toContainText("allows only");
    });

    test("survives a reload, graded again, and goes back to the starting point when cleared", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      let c = challenge(page, LESS);
      await c.scrollIntoViewIfNeeded();
      const box = c.getByRole("textbox", { name: V.editor.textLabel });
      await box.fill("cmp w0, w1\ncsel w0, w0, w1, lo\nret");
      await press(page, run(c));
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await page.reload();
      c = challenge(page, LESS);
      await expect(c.locator(".challenge-complete")).toBeVisible();
      // A stored completion is graded again, not believed.
      await page.evaluate(
        ([k, id]) => {
          const s = JSON.parse(localStorage.getItem(k as string)!);
          s.challenges[id as string].artifact.text = "cmp w0, w1\ncsel w0, w0, w1, lt\nret";
          localStorage.setItem(k as string, JSON.stringify(s));
        },
        [storageKey(ONE), LESS],
      );
      await page.reload();
      c = challenge(page, LESS);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
      await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
      await expect(c.getByRole("textbox", { name: V.editor.textLabel })).toHaveValue("ret");
    });
  });

  test("the failure experiment: steeper_u with ge returns 1, and the stepper shows NZCV 1001", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    const stepper = page.locator("#ix-step-steeper-ge");
    await expect(stepper.locator(".al-locked")).toBeVisible();
    const figure = page.locator("#ix-predict-steeper-ge");
    await figure.scrollIntoViewIfNeeded();
    // The figure shows the changed listing and the two registers, and nothing of the run.
    await expect(figure.locator(".al-insn .al-text")).toHaveText([
      "cmp w1, w0",
      "csel w0, w1, w0, ge",
      "ret",
    ]);
    await expect(registerValue(figure, "w0")).toHaveText("2147483648");
    await expect(registerValue(figure, "w1")).toHaveText("1");
    await predictionCommitsBeforeItReveals(page, "predict-steeper-ge", /^1$/, /^2147483648$/);
    const model = traceOf(STEEPER_U_GE, { entry: "steeper_u", args: [0x80000000, 1] });
    expect(wValue(model.result.final, 0)).toBe(1);
    await expect(figure.locator(".al-outcome")).toContainText("w0 held 1");
    await expect(stepper.locator(".al-locked")).toHaveCount(0);
    await stepper.scrollIntoViewIfNeeded();
    const flags = () =>
      stepper
        // The row of four under the registers, not the flags the panel beside it draws again.
        .locator(".al-stepper > .al-flags .al-flag")
        .evaluateAll((els) => els.map((e) => e.getAttribute("data-value")));
    expect(await flags()).toEqual(["0", "0", "0", "0"]);
    await press(page, stepper.getByRole("button", { name: V.stepper.next }));
    expect(await flags()).toEqual(["1", "0", "0", "1"]);
    await press(page, stepper.getByRole("button", { name: V.stepper.next }));
    expect(wValue(viewAt(model, 2).state, 0)).toBe(1);
    await expect(registerValue(stepper, "w0")).toHaveText("1");
    await press(page, stepper.getByRole("button", { name: V.stepper.next }));
    await expect(stepper.getByRole("button", { name: V.stepper.next })).toBeDisabled();
  });

  test.describe("every condition after one compare", () => {
    const figure = (page: Page) => page.locator("#ix-every-condition");
    const holds = async (f: Locator) =>
      Object.fromEntries(
        await f
          .locator(".al-cond")
          .evaluateAll((els) =>
            els.map((e) => [e.getAttribute("data-cond"), e.getAttribute("data-holds")]),
          ),
      );
    const modelHolds = (a: number, b: number) =>
      Object.fromEntries(
        Object.entries(
          compareResult(
            a,
            b,
            CONDITION_ROWS.map((c) => c.name),
          ).holds,
        ).map(([k, v]) => [k, String(v)]),
      );

    test("starts at 8 and 8, never at the last challenge's pair, with the flags and holds the model gives", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      const f = figure(page);
      await f.scrollIntoViewIfNeeded();
      await expect(f.locator('[data-register="w0"] input')).toHaveValue("8");
      await expect(f.locator('[data-register="w1"] input')).toHaveValue("8");
      expect(await holds(f)).toEqual(modelHolds(8, 8));
      const flags = await f
        .locator(".al-flag")
        .evaluateAll((els) => els.map((e) => e.getAttribute("data-value")));
      expect(flags).toEqual(["0", "1", "1", "0"]);
      await expect(f.locator(".al-cond")).toHaveCount(CONDITION_ROWS.length);
    });

    test("runs the compare again for the pair that needs V, and for values that are typed", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      const f = figure(page);
      await f.scrollIntoViewIfNeeded();
      await press(page, f.getByRole("button", { name: "0x7fffffff and 0xffffffff" }));
      expect(await holds(f)).toEqual(modelHolds(0x7fffffff, 0xffffffff));
      expect((await holds(f))["ge"]).toBe("true");
      expect((await holds(f))["cc"]).toBe("true");
      await expect(f.locator('.al-flag[data-flag="v"]')).toHaveAttribute("data-value", "1");
      const first = f.locator('[data-register="w0"] input');
      await first.fill("-5");
      await f.locator('[data-register="w1"] input').fill("2");
      expect(await holds(f)).toEqual(modelHolds(0xfffffffb, 2));
      await expect(f.locator('[data-register="w0"] .al-cond-readings')).toHaveText(
        B.conditions.readings(4294967291, -5),
      );
      // A value that is not a number gives a sentence, and no list that would be about nothing.
      await first.fill("banana");
      // The sentence has `0x` in it, drawn as code, never as backticks.
      await expect(f.locator('[data-register="w0"] .al-cond-readings')).toHaveText(
        V.tester.notNumber.replace(/`/g, ""),
      );
      await expect(f.locator('[data-register="w0"] .al-cond-readings code')).toHaveText("0x");
      await expect(f.locator(".al-cond")).toHaveCount(0);
      await first.fill("4294967296");
      await expect(f.locator('[data-register="w0"] .al-cond-readings')).toHaveText(
        B.conditions.outOfRange,
      );
    });

    test("draws every condition with its name, meaning and rule, and each fits its box", async ({
      page,
    }, info) => {
      await openLesson(page, ONE);
      const f = figure(page);
      await f.scrollIntoViewIfNeeded();
      const ge = f.locator('[data-cond="ge"]');
      await expect(ge).toContainText("greater than or equal");
      await expect(ge).toContainText("N equals V");
      expect(await figureOverflow(page)).toEqual([]);
      const box = (await f.boundingBox())!;
      expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize()!.width);
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    });

    for (const theme of ["light", "dark"] as const) {
      test(`tells a condition that holds from one that does not, in the ${theme} theme`, async ({
        page,
      }) => {
        await page.goto("#/");
        await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
        await page.reload();
        await openLesson(page, ONE);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const colours = await figure(page).evaluate((el) => {
          const paint = (selector: string, property: "color" | "borderLeftColor") =>
            getComputedStyle(el.querySelector(selector)!)[property];
          return {
            yesVerdict: paint('[data-holds="true"] .al-cond-verdict', "color"),
            noVerdict: paint('[data-holds="false"] .al-cond-verdict', "color"),
            yesEdge: paint('[data-holds="true"]', "borderLeftColor"),
            noEdge: paint('[data-holds="false"]', "borderLeftColor"),
          };
        });
        expect(colours.yesVerdict).not.toBe(colours.noVerdict);
        expect(colours.yesEdge).not.toBe(colours.noEdge);
      });
    }
  });

  test.describe("the last challenge, four conditions after one cmp", () => {
    const fill = async (c: Locator, v: Record<string, string>) => {
      for (const [id, value] of Object.entries(v))
        await c.locator(`[data-field="${id}"] input`).fill(value);
    };

    test("shows the compare it is about, and asks for four numbers", async ({ page }) => {
      await openLesson(page, ONE);
      const c = challenge(page, HOLDS);
      await c.scrollIntoViewIfNeeded();
      await expect(c.locator(".al-insn .al-text")).toHaveText(["cmp w0, w1"]);
      await expect(c.locator(".answer-field")).toHaveCount(4);
    });

    test("rejects a wrong answer, naming which condition, and never saying the value", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      const c = challenge(page, HOLDS);
      await c.scrollIntoViewIfNeeded();
      await fill(c, { ge: "1", cs: "1", lt: "1", cc: "0" });
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(3, 4));
      await expect(c.locator(".verdict-failure h4")).toHaveText(["Whether ge holds"]);
      await fill(c, { ge: "1", cs: "0", lt: "0", cc: "1" });
      await press(page, run(c));
      await expect(c.locator(".verdict-failure h4")).toHaveCount(4);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await expect(c.locator(".verdict")).not.toContainText(/\b1\b.*\b0\b/);
    });

    test("asks for every number before it grades anything", async ({ page }) => {
      await openLesson(page, ONE);
      const c = challenge(page, HOLDS);
      await c.scrollIntoViewIfNeeded();
      await fill(c, { ge: "0" });
      await press(page, run(c));
      await expect(status(c)).toHaveText(blocked);
      await expect(c.locator(".verdict.blocked")).toContainText("cs");
    });

    test("accepts the reference, keeps it over a reload, and goes when the work is cleared", async ({
      page,
    }) => {
      await openLesson(page, ONE);
      let c = challenge(page, HOLDS);
      await c.scrollIntoViewIfNeeded();
      const answers = lesson(ONE).challenges.find((x) => x.id === HOLDS)!.reference.answers!;
      await fill(c, answers);
      await press(page, run(c));
      await expect(status(c)).toHaveText(passing(4));
      await expect(c.locator(".challenge-complete")).toHaveText(complete);
      await page.reload();
      c = challenge(page, HOLDS);
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await expect(c.locator('[data-field="cs"] input')).toHaveValue("1");
      await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
      await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await expect(c.locator('[data-field="ge"] input')).toHaveValue("");
    });
  });

  test.describe("the look of the lesson page", () => {
    test("text is legible, controls are reachable, nothing scrolls sideways, prose keeps its measure", async ({
      page,
    }, info) => {
      await openLesson(page, ONE);
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
    });

    test("and so are the figures once they have been used, the tap editor open and verdicts shown", async ({
      page,
    }, info) => {
      const phone = info.project.name === "phone";
      await openLesson(page, ONE);
      await commit(page, "predict-steeper-change", /^The operands of cmp change\.$/);
      await commit(page, "predict-steeper-ge", /^0$/);
      const stepper = page.locator("#ix-step-steeper-ge");
      await press(page, stepper.getByRole("button", { name: V.stepper.next }));
      const less = challenge(page, LESS);
      await press(page, less.getByRole("button", { name: V.editor.tap, exact: true }));
      await press(page, less.locator(".asm-line-button").first());
      await press(page, chip(less, I, "csel"));
      await press(page, run(less));
      const holds = challenge(page, HOLDS);
      await holds.locator('[data-field="ge"] input').fill("1");
      await press(page, run(holds));
      await holds.locator('[data-field="cs"] input').fill("1");
      await holds.locator('[data-field="lt"] input').fill("1");
      await holds.locator('[data-field="cc"] input').fill("1");
      await press(page, run(holds));
      await press(page, holds.getByRole("button", { name: /Show hint/ }));
      expect(await designProblems(page, phone)).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
    });
  });

  test("the way back leads to the front page, where both lessons of the module are listed", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    await press(page, page.locator("a.back-link").first());
    await expect(page.locator(`.module-lessons li[data-lesson="${ONE}"] a`)).toHaveText(
      lesson(ONE).title,
    );
    await expect(page.locator(`.module-lessons li[data-lesson="${TWO}"] a`)).toHaveText(
      lesson(TWO).title,
    );
  });
});

// ---------------------------------------------------------------------------------------------
// Lesson 2

const FUEL = "write-fuel-warning";
const COUNTS = "count-describe-runs";

test.describe("lesson 2, Branches, and the run that skips", () => {
  test("loads with no console error, ten sections and two challenges", async ({ page }) => {
    const errors = watchErrors(page);
    await openLesson(page, TWO);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson(TWO).title);
    await expect(page.locator("section.challenge")).toHaveCount(2);
    await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
    await expect(page).toHaveTitle(`${lesson(TWO).title} / Assembly Lab`);
    expect(errors).toEqual([]);
  });

  test("the first figure shows describe's C and eight instructions, each beside the C line GCC recorded", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    const figure = page.locator("#ix-describe-listing");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-cline")).toHaveCount(8);
    await expect(figure.locator(".al-insn .al-text")).toHaveText([
      "cmp w0, 10",
      "bgt .L9",
      "cmn w0, #10",
      "mov w0, -2",
      "csel w0, w0, wzr, lt",
      "ret",
      "mov w0, 2",
      "b .L7",
    ]);
    await expect(figure.locator(".al-label")).toHaveText([/describe:/, /\.L7:/, /\.L9:/]);
    // The line tags: no instruction is recorded against the second if or against return -2.
    const tags = await figure.locator(".al-ctag").allTextContents();
    expect(tags).toEqual(["3", "3", "7", "7", "7", "8", "4", "4"]);
  });

  test("the prediction about the count commits before it reveals, and the model says five", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    const figure = page.locator("#ix-predict-describe-count");
    await figure.scrollIntoViewIfNeeded();
    await expect(registerValue(figure, "w0")).toHaveText("15");
    await predictionCommitsBeforeItReveals(page, "predict-describe-count", /^5$/, /^8$/);
    const model = traceOf(DESCRIBE, { entry: "describe", args: [15] });
    expect(model.result.steps).toHaveLength(5);
    await expect(figure.locator(".al-nomatch")).toContainText(plain(B.count.ran(5)));
  });

  test("the stepper stays shut until the prediction is checked, then counts the instructions as they run", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    const stepper = page.locator("#ix-step-describe");
    await expect(stepper.locator(".al-locked")).toBeVisible();
    await expect(stepper.getByRole("button", { name: V.stepper.next })).toHaveCount(0);
    await commit(page, "predict-describe-count", /^5$/);
    await stepper.scrollIntoViewIfNeeded();
    const model = traceOf(DESCRIBE, { entry: "describe", args: [15] });
    await expect(stepper.locator(".al-count")).toHaveText(B.stepper.count(0));
    for (let k = 1; k <= 5; k++) {
      await press(page, stepper.getByRole("button", { name: V.stepper.next }));
      await expect(stepper.locator(".al-count")).toHaveText(B.stepper.count(k));
      // The marker follows the run: the branch takes it past three instructions.
      const next = viewAt(model, k).next;
      if (next !== null)
        await expect(stepper.locator('.al-insn[data-next="true"] .al-text')).toHaveText(
          model.lines[next]!.text,
        );
    }
    await expect(stepper.getByRole("button", { name: V.stepper.next })).toBeDisabled();
    expect(wValue(viewAt(model, 5).state, 0)).toBe(2);
    await expect(registerValue(stepper, "w0")).toHaveText("2");
  });

  test.describe("the arrows", () => {
    const figure = (page: Page) => page.locator("#ix-describe-arrows");
    const arrows = async (f: Locator) =>
      f
        .locator(".al-arrow")
        .evaluateAll((els) =>
          els.map((e) => [e.getAttribute("data-label"), e.getAttribute("data-state")]),
        );
    const modelArrows = (g: number) =>
      branchArrows(traceOf(DESCRIBE, { entry: "describe", args: [g] })).map((a) => [
        a.label,
        a.state,
      ]);

    test("stay shut until the prediction is checked", async ({ page }) => {
      await openLesson(page, TWO);
      const f = figure(page);
      await expect(f.locator(".al-locked")).toBeVisible();
      await expect(f.locator(".al-blist")).toHaveCount(0);
      await commit(page, "predict-describe-count", /^5$/);
      await expect(f.locator(".al-blist")).toBeVisible();
    });

    test("go from bgt and b to their labels, taken for 15, with the model's result", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      await commit(page, "predict-describe-count", /^5$/);
      const f = figure(page);
      await f.scrollIntoViewIfNeeded();
      expect(await arrows(f)).toEqual(modelArrows(15));
      expect(await arrows(f)).toEqual([
        [".L9", "taken"],
        [".L7", "taken"],
      ]);
      // ret is not drawn as a branch: two arrows for eight instructions.
      await expect(f.locator(".al-arrow")).toHaveCount(2);
      await expect(f.locator(".al-brow-insn")).toHaveCount(8);
      await expect(f.locator(".al-brow .al-btag")).toHaveText(["taken", "taken"]);
      await expect(f.locator(".al-branch-ran")).toHaveText(B.arrows.ranCount(5));
      await expect(f.locator(".al-branch-returned")).toHaveText(B.arrows.returned(2));
      await expect(f.locator(".al-path-item")).toHaveCount(5);
      // The three instructions the run skipped are greyed.
      await expect(f.locator('.al-brow-insn[data-ran="false"]')).toHaveCount(3);
    });

    test("show bgt not taken and b not run for 10, greying the instructions that did not run", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      await commit(page, "predict-describe-count", /^5$/);
      const f = figure(page);
      await f.scrollIntoViewIfNeeded();
      await press(page, f.getByRole("button", { name: "10", exact: true }));
      expect(await arrows(f)).toEqual(modelArrows(10));
      expect(await arrows(f)).toEqual([
        [".L9", "not-taken"],
        [".L7", "not-run"],
      ]);
      await expect(f.locator(".al-brow .al-btag")).toHaveText(["not taken", "not reached"]);
      await expect(f.locator('.al-brow-insn[data-ran="false"]')).toHaveCount(2);
      await expect(f.locator(".al-branch-ran")).toHaveText(B.arrows.ranCount(6));
      await expect(f.locator(".al-branch-returned")).toHaveText(B.arrows.returned(0));
    });

    test("run the four gradients the text names and no other: there is no box to type a gradient the challenge asks about", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      await commit(page, "predict-describe-count", /^5$/);
      const f = figure(page);
      await f.scrollIntoViewIfNeeded();
      await expect(f.getByRole("textbox")).toHaveCount(0);
      await expect(f.locator(".al-branch-presets button")).toHaveText(["15", "10", "-15", "0"]);
      for (const g of [-15, 0]) {
        await press(page, f.getByRole("button", { name: String(g), exact: true }));
        expect(await arrows(f)).toEqual(modelArrows(g));
        const model = traceOf(DESCRIBE, { entry: "describe", args: [g] });
        await expect(f.locator(".al-branch-ran")).toHaveText(
          B.arrows.ranCount(model.result.steps.length),
        );
        await expect(f.locator(".al-branch-returned")).toHaveText(
          B.arrows.returned(Number(BigInt.asIntN(32, model.result.final.x[0] ?? 0n))),
        );
      }
    });

    test("tag each branch in words and by shape, and list the path in order with ret last", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      await commit(page, "predict-describe-count", /^5$/);
      const f = figure(page);
      await f.scrollIntoViewIfNeeded();
      await expect(f.locator(".al-bstart")).toHaveText(B.arrows.start);
      const path = () => f.locator(".al-path-item code").allTextContents();
      expect(await path()).toEqual(["cmp w0, 10", "bgt .L9", "mov w0, 2", "b .L7", "ret"]);
      await press(page, f.getByRole("button", { name: "10", exact: true }));
      expect((await path()).at(-1)).toBe("ret");
      await expect(f.locator(".al-path-item .al-btag")).toHaveText(["not taken"]);
      // The tag of a branch the run never reached is dotted, of one not taken dashed, of one taken solid.
      const borders = await f
        .locator(".al-brow .al-btag")
        .evaluateAll((els) => els.map((e) => getComputedStyle(e).borderTopStyle));
      expect(borders).toEqual(["dashed", "dotted"]);
      await press(page, f.getByRole("button", { name: "15", exact: true }));
      const taken = await f
        .locator(".al-brow .al-btag")
        .evaluateAll((els) => els.map((e) => getComputedStyle(e).borderTopStyle));
      expect(taken).toEqual(["solid", "solid"]);
    });

    test("fit the screen: the arrows and the listing stay inside their box", async ({ page }) => {
      await openLesson(page, TWO);
      await commit(page, "predict-describe-count", /^5$/);
      const f = figure(page);
      await f.scrollIntoViewIfNeeded();
      const list = (await f.locator(".al-blist").boundingBox())!;
      const svg = (await f.locator(".al-barrows").boundingBox())!;
      const width = page.viewportSize()!.width;
      expect(list.x + list.width).toBeLessThanOrEqual(width);
      expect(svg.x).toBeGreaterThanOrEqual(list.x);
      expect(svg.y).toBeGreaterThanOrEqual(list.y);
      expect(svg.y + svg.height).toBeLessThanOrEqual(list.y + list.height);
      expect(await figureOverflow(page)).toEqual([]);
    });

    for (const theme of ["light", "dark"] as const) {
      test(`draw an arrow taken, not taken and not run differently, in the ${theme} theme`, async ({
        page,
      }) => {
        await page.goto("#/");
        await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
        await page.reload();
        await openLesson(page, TWO);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await commit(page, "predict-describe-count", /^5$/);
        const f = figure(page);
        await press(page, f.getByRole("button", { name: "10", exact: true }));
        const style = await f.evaluate((el) => {
          const paint = (state: string) => {
            const line = el.querySelector(`.al-arrow[data-state="${state}"] .al-arrow-line`)!;
            const cs = getComputedStyle(line);
            return { stroke: cs.stroke, dash: cs.strokeDasharray };
          };
          return { notTaken: paint("not-taken"), notRun: paint("not-run") };
        });
        expect(style.notTaken.dash).not.toBe(style.notRun.dash);
        expect(style.notTaken.stroke).not.toBe(style.notRun.stroke);
        await press(page, f.getByRole("button", { name: "15", exact: true }));
        const taken = await f
          .locator('.al-arrow[data-state="taken"] .al-arrow-line')
          .first()
          .evaluate((e) => ({
            stroke: getComputedStyle(e).stroke,
            dash: getComputedStyle(e).strokeDasharray,
          }));
        expect(taken.dash).toBe("none");
        expect(taken.stroke).not.toBe(style.notTaken.stroke);
      });
    }
  });

  test.describe("the construction challenge, fuel_warning", () => {
    test("is completed by typing, at the desktop width", async ({ page }, info) => {
      test.skip(info.project.name !== "desktop", "typing is the desktop width's way in");
      const errors = watchErrors(page);
      await openLesson(page, TWO);
      const c = challenge(page, FUEL);
      await c.scrollIntoViewIfNeeded();
      const box = c.getByRole("textbox", { name: V.editor.textLabel });
      await expect(box).toHaveValue("mov w0, 0\nret");
      await box.fill("");
      await box.pressSequentially(FUEL_WARNING_TEXT);
      await expect(c.locator(".asm-problems")).toHaveCount(0);
      await run(c).click();
      await expect(status(c)).toHaveText(passing(5));
      await expect(c.locator(".challenge-complete")).toHaveText(complete);
      expect(errors).toEqual([]);
    });

    test("is completed by tapping alone, at the phone width, labels included", async ({
      page,
    }, info) => {
      test.skip(info.project.name !== "phone", "tapping is the phone width's way in");
      const errors = watchErrors(page);
      await openLesson(page, TWO);
      const c = challenge(page, FUEL);
      await c.scrollIntoViewIfNeeded();
      await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
      await expect(c.getByRole("textbox")).toHaveCount(0);
      // The starting point's two lines are replaced, line by line.
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
      await press(page, c.locator(".asm-line-button").first());
      await press(page, c.getByRole("button", { name: V.editor.remove }));
      await press(page, c.locator(".asm-line-button").first());
      await press(page, c.getByRole("button", { name: V.editor.remove }));
      await expect(c.locator(".asm-line-button")).toHaveCount(0);
      await press(page, c.getByRole("button", { name: V.editor.addFirst }));
      await press(page, chip(c, I, "cbz"));
      await press(page, chip(c, O(1), "w0"));
      await press(page, chip(c, O(2), ".Lempty"));
      await tapLine(
        page,
        c,
        [
          [I, "cmp"],
          [O(1), "w0"],
          [O(2), "w1"],
        ],
        false,
      );
      await tapLine(
        page,
        c,
        [
          [I, "b.cc"],
          [O(1), ".Llow"],
        ],
        false,
      );
      await tapLine(
        page,
        c,
        [
          [I, "mov"],
          [O(1), "w0"],
        ],
        false,
      );
      await number("0");
      await tapLine(page, c, [[I, "ret"]], false);
      await tapLine(page, c, [[I, ".Llow:"]], false);
      await tapLine(
        page,
        c,
        [
          [I, "mov"],
          [O(1), "w0"],
        ],
        false,
      );
      await number("1");
      await tapLine(page, c, [[I, "ret"]], false);
      await tapLine(page, c, [[I, ".Lempty:"]], false);
      await tapLine(
        page,
        c,
        [
          [I, "mov"],
          [O(1), "w0"],
        ],
        false,
      );
      await number("2");
      await tapLine(page, c, [[I, "ret"]], false);
      await expect(c.locator(".asm-line-button")).toHaveCount(11);
      await expect(c.locator(".asm-error")).toHaveCount(0);
      await run(c).tap();
      await expect(status(c)).toHaveText(passing(5));
      await expect(c.locator(".challenge-complete")).toHaveText(complete);
      expect((await stored(page, TWO)).challenges[FUEL].artifact.text).toBe(
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
      expect(errors).toEqual([]);
    });

    test("offers the instructions of the gate, a branch under each condition, and a chip for each label", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      const c = challenge(page, FUEL);
      await c.scrollIntoViewIfNeeded();
      await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
      await press(page, c.locator(".asm-line-button").first());
      const chips = (group: string) =>
        c.getByRole("group", { name: group, exact: true }).locator("button.chip");
      await expect(chips(I)).toHaveText([
        "cmp",
        "b.eq",
        "b.ne",
        "b.cs",
        "b.cc",
        "b.hi",
        "b.ls",
        "b.ge",
        "b.lt",
        "b.gt",
        "b.le",
        "cbz",
        "b",
        "mov",
        "ret",
        ".Llow:",
        ".Lok:",
        ".Ldone:",
        ".Lempty:",
      ]);
      await press(page, chips(I).filter({ hasText: /^cbz$/ }));
      await expect(chips(O(1))).toHaveText(["w0", "w1"]);
      await expect(chips(O(2))).toHaveText([".Llow", ".Lok", ".Ldone", ".Lempty"]);
    });

    test("fails the starting point on the first two calls only, and says what it returned", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      const c = challenge(page, FUEL);
      await c.scrollIntoViewIfNeeded();
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(3, 5));
      await expect(c.locator(".verdict-failure h4")).toHaveText([
        "fuel_warning(0, 10)",
        "fuel_warning(9, 10)",
      ]);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
    });

    test("accepts the second answer, with b.cs and two b instructions to one ret, and the GCC spelling blo", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      const c = challenge(page, FUEL);
      await c.scrollIntoViewIfNeeded();
      const box = c.getByRole("textbox", { name: V.editor.textLabel });
      await box.fill(FUEL_WARNING_SHARED_RET_TEXT);
      await press(page, run(c));
      await expect(status(c)).toHaveText(passing(5));
      await box.fill(FUEL_WARNING_TEXT.replace("b.cc", "blo"));
      await press(page, run(c));
      await expect(status(c)).toHaveText(passing(5));
    });

    test("rejects the signed condition, the inclusive condition and the tests in the wrong order, and refuses instructions it has not met", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      const c = challenge(page, FUEL);
      await c.scrollIntoViewIfNeeded();
      const box = c.getByRole("textbox", { name: V.editor.textLabel });
      await box.fill(FUEL_WARNING_TEXT.replace("b.cc", "b.lt"));
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(4, 5));
      await expect(c.locator(".verdict-failure h4")).toHaveText(["fuel_warning(0x80000000, 10)"]);
      await box.fill(FUEL_WARNING_TEXT.replace("b.cc", "b.ls"));
      await press(page, run(c));
      await expect(c.locator(".verdict-failure h4")).toHaveText(["fuel_warning(10, 10)"]);
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
      await expect(c.locator(".verdict-failure h4")).toHaveText(["fuel_warning(0, 10)"]);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      for (const instruction of [
        "cset w0, lo",
        "csel w0, w0, w1, lo",
        "tbz w0, 3, .Llow",
        "bl .Llow",
      ]) {
        await box.fill(`${instruction}\n${FUEL_WARNING_TEXT}`);
        await expect(c.locator(".asm-problems")).toContainText("Line 1");
        await press(page, run(c));
        await expect(status(c)).toHaveText(blocked);
      }
    });

    test("survives a reload, graded again, and goes back to the starting point when cleared", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      let c = challenge(page, FUEL);
      await c.scrollIntoViewIfNeeded();
      const box = c.getByRole("textbox", { name: V.editor.textLabel });
      await box.fill(FUEL_WARNING_TEXT);
      await press(page, run(c));
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await page.reload();
      c = challenge(page, FUEL);
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await page.evaluate(
        ([k, id]) => {
          const s = JSON.parse(localStorage.getItem(k as string)!);
          s.challenges[id as string].artifact.text = "mov w0, 0\nret";
          localStorage.setItem(k as string, JSON.stringify(s));
        },
        [storageKey(TWO), FUEL],
      );
      await page.reload();
      c = challenge(page, FUEL);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
      await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
      await expect(c.getByRole("textbox", { name: V.editor.textLabel })).toHaveValue(
        "mov w0, 0\nret",
      );
    });
  });

  test("the failure experiment: bge for bgt returns 2 for 10, and the model says so", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    const figure = page.locator("#ix-predict-describe-bge");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-insn .al-text").nth(1)).toHaveText("bge .L9");
    await expect(registerValue(figure, "w0")).toHaveText("10");
    await predictionCommitsBeforeItReveals(page, "predict-describe-bge", /^2$/, /^0$/);
    const model = traceOf(DESCRIBE_BGE, { entry: "describe", args: [10] });
    expect(wValue(model.result.final, 0)).toBe(2);
    expect(model.result.steps).toHaveLength(5);
    await expect(figure.locator(".al-nomatch")).toContainText("w0 held 2");
  });

  test("the failure experiment's stepper stays shut until the prediction is checked, then runs bge on describe(10) with the flags and the count", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    const stepper = page.locator("#ix-step-describe-bge");
    await expect(stepper.locator(".al-locked")).toBeVisible();
    await expect(stepper.getByRole("button", { name: V.stepper.next })).toHaveCount(0);
    await commit(page, "predict-describe-bge", /^0$/);
    await stepper.scrollIntoViewIfNeeded();
    const model = traceOf(DESCRIBE_BGE, { entry: "describe", args: [10] });
    await expect(stepper.locator(".al-insn .al-text").nth(1)).toHaveText("bge .L9");
    await expect(stepper.locator(".al-count")).toHaveText(B.stepper.count(0));
    await expect(registerValue(stepper, "w0")).toHaveText("10");
    for (let k = 1; k <= model.result.steps.length; k++) {
      await press(page, stepper.getByRole("button", { name: V.stepper.next }));
      await expect(stepper.locator(".al-count")).toHaveText(B.stepper.count(k));
    }
    // The compare left NZCV 0110 (10 minus 10), bge reads it as taken, and describe(10) returns 2.
    const flags = viewAt(model, 1).state.flags;
    expect([flags.n, flags.z, flags.c, flags.v].map(Number)).toEqual([0, 1, 1, 0]);
    await expect(registerValue(stepper, "w0")).toHaveText("2");
    await expect(stepper.locator(".al-stepper > .al-flags .al-flag")).toHaveCount(4);
  });

  test.describe("the last challenge, the runs of describe", () => {
    const fill = async (c: Locator, v: Record<string, string>) => {
      for (const [id, value] of Object.entries(v))
        await c.locator(`[data-field="${id}"] input`).fill(value);
    };

    test("shows describe's listing, and asks for six numbers", async ({ page }) => {
      await openLesson(page, TWO);
      const c = challenge(page, COUNTS);
      await c.scrollIntoViewIfNeeded();
      await expect(c.locator(".al-insn")).toHaveCount(8);
      await expect(c.locator(".answer-field")).toHaveCount(6);
    });

    test("rejects a wrong number, naming which, and never saying the value", async ({ page }) => {
      await openLesson(page, TWO);
      const c = challenge(page, COUNTS);
      await c.scrollIntoViewIfNeeded();
      const right = lesson(TWO).challenges.find((x) => x.id === COUNTS)!.reference.answers!;
      await fill(c, { ...right, steps11: "6", resultM10: "1" });
      await press(page, run(c));
      await expect(status(c)).toHaveText(failing(4, 6));
      await expect(c.locator(".verdict-failure h4")).toHaveText([
        "instructions run for describe(11)",
        "describe(-10) returns",
      ]);
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
    });

    test("asks for every number before it grades anything", async ({ page }) => {
      await openLesson(page, TWO);
      const c = challenge(page, COUNTS);
      await c.scrollIntoViewIfNeeded();
      await fill(c, { result11: "2" });
      await press(page, run(c));
      await expect(status(c)).toHaveText(blocked);
      await expect(c.locator(".verdict.blocked")).toContainText("instructions run for");
    });

    test("accepts the reference, keeps it over a reload, and goes when the work is cleared", async ({
      page,
    }) => {
      await openLesson(page, TWO);
      let c = challenge(page, COUNTS);
      await c.scrollIntoViewIfNeeded();
      const answers = lesson(TWO).challenges.find((x) => x.id === COUNTS)!.reference.answers!;
      await fill(c, answers);
      await press(page, run(c));
      await expect(status(c)).toHaveText(passing(6));
      await expect(c.locator(".challenge-complete")).toHaveText(complete);
      await page.reload();
      c = challenge(page, COUNTS);
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await expect(c.locator('[data-field="resultM11"] input')).toHaveValue("-2");
      await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
      await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await expect(c.locator('[data-field="result11"] input')).toHaveValue("");
    });
  });

  test.describe("the look of the lesson page", () => {
    test("text is legible, controls are reachable, nothing scrolls sideways, prose keeps its measure", async ({
      page,
    }, info) => {
      await openLesson(page, TWO);
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
    });

    test("and so are the figures once they have been used, the tap editor open and verdicts shown", async ({
      page,
    }, info) => {
      const phone = info.project.name === "phone";
      await openLesson(page, TWO);
      await commit(page, "predict-describe-count", /^6$/);
      await commit(page, "predict-describe-bge", /^0$/);
      const stepper = page.locator("#ix-step-describe");
      await press(page, stepper.getByRole("button", { name: V.stepper.next }));
      await press(page, stepper.getByRole("button", { name: V.stepper.next }));
      await press(
        page,
        page.locator("#ix-describe-arrows").getByRole("button", { name: "10", exact: true }),
      );
      const fuel = challenge(page, FUEL);
      await press(page, fuel.getByRole("button", { name: V.editor.tap, exact: true }));
      await press(page, fuel.locator(".asm-line-button").first());
      await press(page, chip(fuel, I, "b.cc"));
      await press(page, run(fuel));
      const counts = challenge(page, COUNTS);
      await counts.locator('[data-field="result11"] input').fill("9");
      await press(page, run(counts));
      await press(page, counts.getByRole("button", { name: /Show hint/ }));
      expect(await designProblems(page, phone)).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
      await press(page, fuel.getByRole("button", { name: V.editor.text, exact: true }));
      await fuel.getByRole("textbox", { name: V.editor.textLabel }).fill("cmp w0, w1\n.Lx:\nb .Lx");
      expect(await designProblems(page, phone)).toEqual([]);
    });
  });
});
