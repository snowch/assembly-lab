// Copyright © 2026 Christopher Snow

// Module 3, lesson 1, Masks and fields, in a browser, on the built site, at desktop and phone
// widths: the lesson loads without an error; the warning word and the bit figure show what the
// model computes; both predictions commit before they reveal, and the figures that wait for them
// stay shut until they are checked; the written challenge is completed by typing (at the desktop
// width) and by tapping alone, a sign key included (at the phone width); wrong answers are
// rejected; the answers challenge reads hexadecimal and rejects a wrong word without giving the
// right one; a completion survives a reload and is graded again; Clear work removes it; and the
// page keeps the look the shell's own pages keep, in both themes.

import { expect, test } from "@playwright/test";

import { LESSONS } from "@al/content";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";

import {
  CLEAR_DOOR,
  GEAR_OF,
  RECORDED_FUNCTIONS,
  SET_GEAR_REFERENCE_TEXT,
  SET_GEAR_WITHOUT_CLEAR,
} from "../../content/lessons/logic-shifts-masks.listings";
import { designProblems } from "./design";
import {
  challenge,
  chip,
  commit,
  failing,
  marked,
  openLesson,
  pad32,
  passing,
  press,
  rowBits,
  rowValue,
  run,
  status,
  watchErrors,
} from "./module3";

const LESSON_ID = "masks";
const STORAGE_KEY = `assembly-lab:v1:${LESSON_ID}`;
const lesson = LESSONS.find((l) => l.id === LESSON_ID)!;
const SET = "write-set-gear";
const THREE = "trace-three-results";
const open = (page: Parameters<typeof openLesson>[0]) => openLesson(page, LESSON_ID);

const stored = (page: import("@playwright/test").Page) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), STORAGE_KEY);

/** What a recorded function returns in w0 for a call, from the model. */
const model = (name: keyof typeof RECORDED_FUNCTIONS, ...args: number[]) =>
  wValue(traceOf(RECORDED_FUNCTIONS[name], { entry: name, args }).result.final, 0);
const hexOf = (n: number) => `0x${(n >>> 0).toString(16)}`;

test("the lesson loads with no console error, ten sections, and its two challenges", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await open(page);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
  await expect(page.locator("section.challenge")).toHaveCount(2);
  await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
  await expect(page.locator("a.back-link").first()).toHaveAttribute("href", "#/");
  await expect(page).toHaveTitle(`${lesson.title} / Assembly Lab`);
  expect(errors).toEqual([]);
});

test.describe("the warning word", () => {
  test("is the model's word: 32 bits in four groups of eight, and a key that reads each labelled bit from it", async ({
    page,
  }) => {
    await open(page);
    const figure = page.locator("#ix-warning-word");
    const trace = traceOf(GEAR_OF, { entry: "gear_of", args: [0x35] });
    const word = wValue(viewAt(trace, 0).state, 0);
    expect(await rowBits(figure, "word")).toBe(pad32(word));
    await expect(figure.locator(".al-bit")).toHaveCount(32);
    await expect(figure.locator(".al-bit-group:not(.al-ruler-group)")).toHaveCount(4);
    // The key reads the word: fuel low and door open are set, service due and lights are not.
    const key = (k: string) => figure.locator(`[data-key="${k}"] td`);
    await expect(key("0-0")).toHaveText(["fuel low", String(word & 1)]);
    await expect(key("1-1")).toHaveText(["service due", String((word >> 1) & 1)]);
    await expect(key("2-2")).toHaveText(["door open", String((word >> 2) & 1)]);
    await expect(key("3-3")).toHaveText(["lights on", String((word >> 3) & 1)]);
    await expect(key("4-6")).toHaveText(["gear", String(wValue(trace.result.final, 0))]);
  });
});

test.describe("the two predictions commit before they reveal", () => {
  for (const [id, right, wrong] of [
    ["predict-minus-five", /^−5 is 0xfffffffb/, /^the compiler subtracts/],
    ["predict-no-clear", "0x75", "0x55"],
  ] as const) {
    test(id, async ({ page }) => {
      await open(page);
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
    });
  }

  test("the first shows the model's run on a word with every bit set: only bit 2 came out 0", async ({
    page,
  }) => {
    await open(page);
    const figure = await commit(page, "predict-minus-five", /^−5 is 0xfffffffb/);
    const model = traceOf(CLEAR_DOOR, { entry: "clear_door", args: [0xffffffff] });
    const after = wValue(model.result.final, 0);
    expect(await rowBits(figure, "ran-before")).toBe(pad32(0xffffffff));
    expect(await rowBits(figure, "ran-after")).toBe(pad32(after));
    expect(await marked(figure, "ran-after", "changed")).toEqual([2]);
    await expect(figure.locator(".al-outcome")).toContainText("Only bit 2 came out 0");
  });

  test("a commitment is kept, and is still there after a reload", async ({ page }) => {
    await open(page);
    await commit(page, "predict-minus-five", /^−5 is 0xfffffffb/);
    await page.reload();
    await expect(page.locator("#ix-predict-minus-five .al-match")).toBeVisible();
    await expect(page.locator("#ix-mask-bits .al-locked")).toHaveCount(0);
  });
});

test.describe("the bit figure", () => {
  test("stays shut until the prediction before it is checked", async ({ page }) => {
    await open(page);
    const figure = page.locator("#ix-mask-bits");
    await expect(figure.locator(".al-locked")).toBeVisible();
    await expect(figure.locator(".al-bit")).toHaveCount(0);
    await commit(page, "predict-minus-five", /^−5 is 0xfffffffb/);
    await expect(figure.locator(".al-locked")).toHaveCount(0);
  });

  test("starts on clear_door(0xf), which the model says is 0xb, with bit 2 outlined", async ({
    page,
  }) => {
    await open(page);
    await commit(page, "predict-minus-five", /^−5 is 0xfffffffb/);
    const figure = page.locator("#ix-mask-bits");
    await figure.scrollIntoViewIfNeeded();
    const want = model("clear_door", 0xf);
    expect(want).toBe(0xb);
    expect(await rowBits(figure, "word")).toBe(pad32(0xf));
    expect(await rowBits(figure, "mask")).toBe(pad32(-5));
    expect(await rowBits(figure, "result")).toBe(pad32(want));
    await expect(rowValue(figure, "mask")).toContainText("0xfffffffb (-5)");
    expect(await marked(figure, "result", "changed")).toEqual([2]);
    await expect(figure.locator(".al-code-ins")).toHaveText("and w0, w0, -5");
    await expect(figure.getByRole("status")).toContainText("w0 holds 0xb, which is 11.");
    await expect(figure.locator('[data-key="2-2"] td')).toHaveText(["door open", "1", "0"]);
  });

  test("gives the model's answer for each function on each word the learner types", async ({
    page,
  }) => {
    await open(page);
    await commit(page, "predict-minus-five", /^−5 is 0xfffffffb/);
    const figure = page.locator("#ix-mask-bits");
    await figure.scrollIntoViewIfNeeded();
    const word = figure.getByLabel(V.bitOps.inputLabel("w0"));
    // `set_gear` is not here: its recipe is the construction challenge's answer.
    for (const name of ["warn_fuel", "clear_door", "toggle_lights", "gear_of"] as const) {
      await press(page, chip(figure, V.bitOps.functions, name));
      await expect(chip(figure, V.bitOps.functions, name)).toHaveAttribute("aria-pressed", "true");
      await expect(chip(figure, V.bitOps.functions, "set_gear" as string)).toHaveCount(0);
      for (const w of [0, 0xf, 0x35, 0xffffffff]) {
        await word.fill(hexOf(w));
        const want = model(name, w);
        const label = `${name}(${hexOf(w)})`;
        expect(await rowBits(figure, "word"), label).toBe(pad32(w));
        expect(await rowBits(figure, "result"), label).toBe(pad32(want));
        await expect(rowValue(figure, "result"), label).toContainText(hexOf(want));
        if (name !== "gear_of")
          expect(await marked(figure, "result", "changed"), label).toEqual(
            [...Array(32).keys()].filter((i) => ((w ^ want) >>> i) & 1),
          );
      }
    }
  });

  test("underlines the gear field in the word for gear_of, and shows the gear at the bottom of the answer", async ({
    page,
  }) => {
    await open(page);
    await commit(page, "predict-minus-five", /^−5 is 0xfffffffb/);
    const figure = page.locator("#ix-mask-bits");
    await figure.scrollIntoViewIfNeeded();
    await press(page, chip(figure, V.bitOps.functions, "gear_of"));
    await figure.getByLabel(V.bitOps.inputLabel("w0")).fill("0x35");
    expect(await marked(figure, "word", "field")).toEqual([4, 5, 6]);
    expect(await marked(figure, "result", "field")).toEqual([0, 1, 2]);
    expect(await rowBits(figure, "result")).toBe(pad32(3));
    await expect(figure.locator(".al-key")).toHaveCount(0);
  });

  test("keeps the last word it could read, and says so, when the learner types something else", async ({
    page,
  }) => {
    await open(page);
    await commit(page, "predict-minus-five", /^−5 is 0xfffffffb/);
    const figure = page.locator("#ix-mask-bits");
    await figure.scrollIntoViewIfNeeded();
    await figure.getByLabel(V.bitOps.inputLabel("w0")).fill("banana");
    await expect(figure.getByText(V.bitOps.inputProblem)).toBeVisible();
    expect(await rowBits(figure, "word")).toBe(pad32(0xf));
  });
});

test.describe("the stepper after the second prediction", () => {
  test("stays shut until the prediction is checked, then shows the model's run of set_gear(0x35, 5) without the clear", async ({
    page,
  }) => {
    await open(page);
    const stepper = page.locator("#ix-step-no-clear");
    await stepper.scrollIntoViewIfNeeded();
    await expect(stepper.locator(".al-locked")).toBeVisible();
    await expect(stepper.getByRole("button", { name: V.stepper.next })).toHaveCount(0);
    await commit(page, "predict-no-clear", "0x75");
    await expect(stepper.locator(".al-locked")).toHaveCount(0);
    const next = stepper.getByRole("button", { name: V.stepper.next });
    const trace = traceOf(SET_GEAR_WITHOUT_CLEAR, { entry: "set_gear", args: [0x35, 5] });
    // The instructions alone: no C was made into them.
    await expect(stepper.locator(".al-c")).toHaveCount(0);
    await expect(stepper.locator(".al-insn .al-text")).toHaveText([
      "and w1, w1, 7",
      "lsl w1, w1, 4",
      "orr w0, w0, w1",
      "ret",
    ]);
    for (let k = 0; k <= 4; k++) {
      const state = viewAt(trace, k).state;
      for (const n of [0, 1]) {
        const value = wValue(state, n);
        expect(await rowBits(stepper, `w${n}`)).toBe(pad32(value));
        await expect(rowValue(stepper, `w${n}`)).toHaveText(`${hexOf(value)} (${value})`);
      }
      if (k < 4) await press(page, next);
    }
    await expect(next).toBeDisabled();
    await expect(rowValue(stepper, "w0")).toHaveText("0x75 (117)");
    await expect(stepper.locator("[role=status]")).toContainText(V.stepper.ended);
  });
});

test.describe("the written challenge", () => {
  test("is completed by typing, at the desktop width", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "typing is the desktop width's way in");
    const errors = watchErrors(page);
    await open(page);
    const c = challenge(page, SET);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await expect(box).toHaveValue("ret");
    await expect(box).toHaveAttribute("autocapitalize", "off");
    await box.fill("");
    await box.pressSequentially(SET_GEAR_REFERENCE_TEXT);
    await run(c).click();
    await expect(status(c)).toHaveText(passing(4));
    await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
    expect(errors).toEqual([]);
  });

  test("is completed by tapping alone, at the phone width: chips, a number pad and a sign key", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "phone", "tapping is the phone width's way in");
    const errors = watchErrors(page);
    await open(page);
    const c = challenge(page, SET);
    await c.scrollIntoViewIfNeeded();
    await c.getByRole("button", { name: V.editor.tap, exact: true }).tap();
    // No text box in this mode: nothing can be typed.
    await expect(c.getByRole("textbox")).toHaveCount(0);
    const pad = c.getByRole("group", { name: V.editor.numberPad });
    const digits = async (n: string) => {
      for (const d of n) await pad.getByRole("button", { name: d, exact: true }).tap();
    };
    const number = async (operand: number, n: string) => {
      await chip(c, V.editor.operand(operand), V.editor.number).tap();
      await digits(n);
    };
    const line = async (instruction: string, operands: string[], n?: string) => {
      await chip(c, V.editor.instruction, instruction).tap();
      for (const [i, r] of operands.entries()) await chip(c, V.editor.operand(i + 1), r).tap();
      if (n !== undefined) await number(operands.length + 1, n);
    };
    // The starting `ret` is line 1: change it into the first instruction, then add the rest below.
    await c.locator(".asm-line-button").first().tap();
    await line("and", ["w1", "w1"], "7");
    await c.getByRole("button", { name: V.editor.addBelow }).tap();
    await line("lsl", ["w1", "w1"], "4");
    await c.getByRole("button", { name: V.editor.addBelow }).tap();
    await line("and", ["w0", "w0"], "113");
    // -113 is every bit set except bits 4 to 6: the sign key makes the mask negative.
    await pad.getByRole("button", { name: V.tap.sign }).tap();
    await expect(pad.locator("output")).toHaveText(V.editor.numberShown("-113"));
    await c.getByRole("button", { name: V.editor.addBelow }).tap();
    await line("orr", ["w0", "w0", "w1"]);
    await c.getByRole("button", { name: V.editor.addBelow }).tap();
    await chip(c, V.editor.instruction, "ret").tap();
    await expect(c.locator(".asm-line-button")).toHaveCount(5);
    await run(c).tap();
    await expect(status(c)).toHaveText(passing(4));
    await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
    expect((await stored(page)).challenges[SET].artifact.text).toBe(
      "and w1, w1, #7\nlsl w1, w1, #4\nand w0, w0, #-113\norr w0, w0, w1\nret",
    );
    expect(errors).toEqual([]);
  });

  test("keeps the text when the learner switches between the two modes", async ({ page }) => {
    await open(page);
    const c = challenge(page, SET);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await box.fill("and w1, w1, 7\nlsl w1, w1, 4");
    await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
    await expect(c.locator(".asm-line-button")).toHaveCount(2);
    await expect(c.locator(".asm-line-button").nth(1)).toContainText("lsl w1, w1, 4");
    await press(page, c.getByRole("button", { name: V.editor.text, exact: true }));
    await expect(box).toHaveValue("and w1, w1, 7\nlsl w1, w1, 4");
  });
});

test.describe("a wrong answer is rejected", () => {
  test("the starting point fails every call, and says what it returned", async ({ page }) => {
    await open(page);
    const c = challenge(page, SET);
    await c.scrollIntoViewIfNeeded();
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(0, 4));
    await expect(c.locator(".verdict-failure h4")).toHaveText([
      "set_gear(0x35, 5)",
      "set_gear(0, 7)",
      "set_gear(0xffffffff, 0)",
      "set_gear(0x1234, 13)",
    ]);
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("leaving out the clear fails the calls that need it; leaving out the mask on g fails the large g", async ({
    page,
  }) => {
    await open(page);
    const c = challenge(page, SET);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await box.fill("and w1, w1, 7\nlsl w1, w1, 4\norr w0, w0, w1\nret");
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(1, 4));
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await box.fill("lsl w1, w1, 4\nand w0, w0, -113\norr w0, w0, w1\nret");
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(3, 4));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["set_gear(0x1234, 13)"]);
  });

  test("GCC's own bfi is refused, as an instruction the challenge does not allow", async ({
    page,
  }) => {
    await open(page);
    const c = challenge(page, SET);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await box.fill("bfi w0, w1, 4, 3\nret");
    // The lesson teaches bfi, so the gate says what the challenge allows, not that bfi is not met.
    await expect(c.locator(".asm-problems")).toContainText("allows only");
    await expect(c.locator(".asm-problems")).not.toContainText("not met");
    await press(page, run(c));
    await expect(status(c)).toHaveText(S.challenge.blocked);
    await expect(c.locator(".verdict.blocked")).toContainText("allows only");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("the chips offer only the task's instructions", async ({ page }) => {
    await open(page);
    const c = challenge(page, SET);
    await c.scrollIntoViewIfNeeded();
    await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
    await press(page, c.locator(".asm-line-button").first());
    await expect(
      c.getByRole("group", { name: V.editor.instruction, exact: true }).getByRole("button"),
    ).toHaveText(["and", "orr", "lsl", "ret"]);
  });
});

test.describe("the answers challenge", () => {
  const fill = async (c: import("@playwright/test").Locator, a: string, b: string, g: string) => {
    await c.locator('[data-field="after_orr"] input').fill(a);
    await c.locator('[data-field="after_and"] input').fill(b);
    await c.locator('[data-field="the_gear"] input').fill(g);
  };

  test("asks for three words, and shows no program", async ({ page }) => {
    await open(page);
    const c = challenge(page, THREE);
    await c.scrollIntoViewIfNeeded();
    await expect(c.locator(".answer-field")).toHaveCount(3);
    await expect(c.locator(".al-insn")).toHaveCount(0);
    await expect(c.locator(".answer-label")).toHaveText(["after orr", "after and", "the gear"]);
  });

  test("rejects a wrong word by name, and never gives the right one", async ({ page }) => {
    await open(page);
    const c = challenge(page, THREE);
    await c.scrollIntoViewIfNeeded();
    await fill(c, "0x2b", "0x2a", "0x2");
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(2, 3));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["after and"]);
    await expect(c.locator(".verdict")).not.toContainText("0x22");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("asks for every answer first, and for hexadecimal", async ({ page }) => {
    await open(page);
    const c = challenge(page, THREE);
    await c.scrollIntoViewIfNeeded();
    await c.locator('[data-field="after_orr"] input').fill("0x2b");
    await press(page, run(c));
    await expect(status(c)).toHaveText(S.challenge.blocked);
    await expect(c.locator(".verdict.blocked")).toContainText("the gear");
    await fill(c, "0x2b", "banana", "0x2");
    await press(page, run(c));
    await expect(c.locator(".verdict.blocked")).toContainText("hexadecimal");
  });

  test("accepts the reference, with or without 0x", async ({ page }) => {
    await open(page);
    const c = challenge(page, THREE);
    await c.scrollIntoViewIfNeeded();
    const answers = lesson.challenges.find((x) => x.id === THREE)!.reference.answers!;
    await fill(c, answers["after_orr"]!, answers["after_and"]!, answers["the_gear"]!);
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(3));
    await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
    await fill(c, "2B", "22", "2");
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(3));
  });
});

test.describe("a completion", () => {
  async function complete(page: import("@playwright/test").Page) {
    const c = challenge(page, THREE);
    await c.scrollIntoViewIfNeeded();
    await c.locator('[data-field="after_orr"] input').fill("0x2b");
    await c.locator('[data-field="after_and"] input').fill("0x22");
    await c.locator('[data-field="the_gear"] input').fill("0x2");
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    return c;
  }

  test("survives a reload, graded again, not read from a mark", async ({ page }) => {
    await open(page);
    await complete(page);
    await page.reload();
    const c = challenge(page, THREE);
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await expect(c.locator('[data-field="after_and"] input')).toHaveValue("0x22");
    // What was kept is the work. Change it in storage to work that fails: the page does not
    // believe the old completion.
    await page.evaluate((k) => {
      const s = JSON.parse(localStorage.getItem(k)!);
      s.challenges["trace-three-results"].artifact.answers.after_and = "0x0";
      localStorage.setItem(k, JSON.stringify(s));
    }, STORAGE_KEY);
    await page.reload();
    await expect(challenge(page, THREE).locator(".challenge-complete")).toHaveCount(0);
    await expect(status(challenge(page, THREE))).toHaveText(failing(2, 3));
  });

  test("goes when the work is cleared, and stays gone after a reload", async ({ page }) => {
    await open(page);
    const c = await complete(page);
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await expect(status(c)).toHaveText(S.challenge.resetDone);
    await expect(c.locator('[data-field="after_orr"] input')).toHaveValue("");
    expect((await stored(page)).challenges[THREE]).toBeUndefined();
    await page.reload();
    await expect(challenge(page, THREE).locator(".challenge-complete")).toHaveCount(0);
  });

  test("of the written challenge survives a reload, and is cleared back to the starting point", async ({
    page,
  }) => {
    await open(page);
    const c = challenge(page, SET);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await box.fill(SET_GEAR_REFERENCE_TEXT);
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.reload();
    await expect(challenge(page, SET).locator(".challenge-complete")).toBeVisible();
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await expect(box).toHaveValue("ret");
  });
});

test.describe("the look of the lesson page", () => {
  test("text is legible, controls are reachable, nothing scrolls sideways, prose keeps its measure", async ({
    page,
  }, info) => {
    await open(page);
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
  });

  test("and so are the figures once they have been used, the editor open and a verdict shown", async ({
    page,
  }, info) => {
    const phone = info.project.name === "phone";
    await open(page);
    await commit(page, "predict-minus-five", /^−5 is 0xfffffffb/);
    await commit(page, "predict-no-clear", "0x55");
    const bits = page.locator("#ix-mask-bits");
    await bits.scrollIntoViewIfNeeded();
    await press(page, chip(bits, V.bitOps.functions, "toggle_lights"));
    await bits.getByLabel(V.bitOps.inputLabel("w0")).fill("0x35");
    await press(page, chip(bits, V.bitOps.functions, "gear_of"));
    const step = page.locator("#ix-step-no-clear");
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    const set = challenge(page, SET);
    await press(page, set.getByRole("button", { name: V.editor.tap, exact: true }));
    await press(page, set.locator(".asm-line-button").first());
    await press(page, chip(set, V.editor.instruction, "and"));
    await press(page, chip(set, V.editor.operand(3), V.editor.number));
    await press(page, run(set));
    const three = challenge(page, THREE);
    await three.locator('[data-field="after_orr"] input').fill("1");
    await three.locator('[data-field="after_and"] input').fill("2");
    await three.locator('[data-field="the_gear"] input').fill("3");
    await press(page, run(three));
    await press(page, three.getByRole("button", { name: /Show hint/ }));
    expect(await designProblems(page, phone)).toEqual([]);
    // The text mode too, with a problem listed.
    await press(page, set.getByRole("button", { name: V.editor.text, exact: true }));
    await set.getByRole("textbox", { name: V.editor.textLabel }).fill("mov w0, w1");
    expect(await designProblems(page, phone)).toEqual([]);
  });

  test("a row of 32 cells fits the screen, on a phone and on a desk, and the key does not scroll", async ({
    page,
  }) => {
    await open(page);
    const figure = page.locator("#ix-warning-word");
    const row = figure.locator("[data-row='word']");
    await row.scrollIntoViewIfNeeded();
    const box = (await row.boundingBox())!;
    const width = page.viewportSize()!.width;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    await expect(row.locator(".al-bit")).toHaveCount(32);
    const key = (await figure.locator(".al-key").boundingBox())!;
    expect(key.x + key.width).toBeLessThanOrEqual(width);
  });
});

test.describe("both themes", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`the figures are drawn in the ${theme} theme, with the filled bits and the marks visible`, async ({
      page,
    }) => {
      await page.goto("#/");
      await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      await page.reload();
      await open(page);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await commit(page, "predict-minus-five", /^−5 is 0xfffffffb/);
      const figure = page.locator("#ix-mask-bits");
      await figure.scrollIntoViewIfNeeded();
      const look = await figure.evaluate((el) => {
        const on = el.querySelector('[data-row="result"] .al-bit[data-on="true"]')!;
        const off = el.querySelector('[data-row="result"] .al-bit[data-on="false"]')!;
        const changed = el.querySelector('[data-row="result"] .al-bit[data-changed="true"]')!;
        const plain = el.querySelector('[data-row="result"] .al-bit[data-changed="false"]')!;
        return {
          on: getComputedStyle(on).backgroundColor,
          off: getComputedStyle(off).backgroundColor,
          outline: getComputedStyle(changed).outlineStyle,
          plainOutline: getComputedStyle(plain).outlineStyle,
          outlineColour: getComputedStyle(changed).outlineColor,
        };
      });
      expect(look.on).not.toBe(look.off);
      expect(look.outline).toBe("solid");
      expect(look.plainOutline).toBe("none");
      expect(look.outlineColour).not.toBe(look.off);
    });
  }
});
