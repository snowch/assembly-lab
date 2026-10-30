// Copyright © 2026 Christopher Snow

// Module 3, lesson 2, Shifts, and the type that picks one, in a browser, on the built site, at
// desktop and phone widths: the lesson loads without an error; the two listings are the recorded
// ones; the shift figure shows what the model computes for every instruction, amount and word;
// both predictions commit before they reveal, and the figures that wait for them stay shut until
// they are checked; the stepper's values after each Next are the model's; each answers challenge
// rejects a wrong answer without giving the right one and accepts the reference; a completion
// survives a reload and is graded again; Clear work removes it; and the page keeps the look the
// shell's own pages keep, in both themes.

import { expect, test, type Locator, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { COMPARISON_STRINGS as C } from "../../packages/views/src/strings.comparison";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { traceOf, viewAt, wValue, wValueAsInt } from "../../packages/views/src/trace";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";

import {
  DIV2,
  HALVE_COUNT,
  HALVE_GRADIENT,
  SHIFT_AMOUNTS,
  SHIFT_OPS,
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

const LESSON_ID = "shifts";
const STORAGE_KEY = `assembly-lab:v1:${LESSON_ID}`;
const lesson = LESSONS.find((l) => l.id === LESSON_ID)!;
const COMPARE = "compare-shifts";
const PICK = "pick-instruction";
const open = (page: Page, id = LESSON_ID) => openLesson(page, id);

const stored = (page: Page) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), STORAGE_KEY);
const hexOf = (n: number) => `0x${(n >>> 0).toString(16)}`;
const FILL = /^A copy of the old top bit/;

test("the lesson loads with no console error, selected sections, and its two challenges", async ({
  page,
}) => {
  const errors = watchErrors(page);
  await open(page, "shifts");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
  await expect(page.locator("section.challenge")).toHaveCount(1);
  await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
  await expect(page.locator("a.back-link").first()).toHaveAttribute("href", "#/");
  await expect(page).toHaveTitle(`${lesson.title} / Assembly Lab`);
  expect(errors).toEqual([]);
});

test.describe("the two listings", () => {
  test("show each C line and its instructions as recorded, and mark the instruction that differs", async ({
    page,
  }) => {
    await open(page, "shifts");
    const figure = page.locator("#ix-halve-compare");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-pair-side > .al-pane-head")).toHaveText(["int", "unsigned"]);
    await expect(figure.locator('[data-side="int"] .al-cline .al-src')).toHaveText(
      HALVE_GRADIENT.c.split("\n"),
    );
    await expect(figure.locator('[data-side="unsigned"] .al-cline .al-src')).toHaveText(
      HALVE_COUNT.c.split("\n"),
    );
    await expect(figure.locator('[data-side="int"] .al-insn .al-text')).toHaveText([
      "asr w0, w0, 1",
      "ret",
    ]);
    await expect(figure.locator('[data-side="unsigned"] .al-insn .al-text')).toHaveText([
      "lsr w0, w0, 1",
      "ret",
    ]);
    await expect(figure.locator('.al-insn[data-differs="true"]')).toHaveCount(2);
    await expect(figure.locator('.al-insn[data-differs="false"]')).toHaveCount(2);
    // Each complete C/instruction pair uses the available width at every viewport.
    const [a, b] = await Promise.all([
      figure.locator('[data-side="int"]').boundingBox(),
      figure.locator('[data-side="unsigned"]').boundingBox(),
    ]);
    expect(b!.y).toBeGreaterThan(a!.y + a!.height - 1);
    expect(Math.abs(b!.width - a!.width)).toBeLessThan(1);
    // Shared navigation reveals the matching pane in both contained listings.
    for (const [label, pane] of [
      [C.instructions, ".al-asm"],
      [C.source, ".al-c"],
    ] as const) {
      await figure.getByRole("button", { name: label, exact: true }).click();
      const startsInside = await figure.locator(".al-listing").evaluateAll(
        (listings, target) =>
          listings.map((listing) => {
            const outer = listing.getBoundingClientRect();
            const inner = listing.querySelector(target)!.getBoundingClientRect();
            return inner.left >= outer.left - 2 && inner.left < outer.right;
          }),
        pane,
      );
      expect(startsInside).toEqual([true, true]);
    }
  });
});

test.describe("the two predictions commit before they reveal", () => {
  for (const [id, right, wrong] of [
    ["predict-fill", FILL, /^A 0$/],
    ["predict-first-add", /^1 when g is negative/, /^31$/],
  ] as const) {
    test(id, async ({ page }) => {
      await open(page, id === "predict-fill" ? "shifts" : "shifts-and-signed-division");
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

  test("the first shows -7 before it is checked, and the model's asr of it after", async ({
    page,
  }) => {
    await open(page, "shifts");
    const figure = page.locator("#ix-predict-fill");
    await figure.scrollIntoViewIfNeeded();
    const trace = traceOf(HALVE_GRADIENT, { entry: "halve_gradient", args: [-7] });
    expect(await rowBits(figure, "start")).toBe(pad32(wValue(viewAt(trace, 0).state, 0)));
    expect(await rowBits(figure, "start")).toBe(pad32(-7));
    await expect(figure.locator("[data-row='ran-after']")).toHaveCount(0);
    await commit(page, "predict-fill", FILL);
    expect(await rowBits(figure, "ran-before")).toBe(pad32(-7));
    expect(await rowBits(figure, "ran-after")).toBe(pad32(wValue(trace.result.final, 0)));
    await expect(figure.locator(".al-outcome")).toContainText("copy of the old top bit");
  });

  test("the second says what the first instruction added, from the model's run", async ({
    page,
  }) => {
    await open(page, "shifts-and-signed-division");
    const figure = await commit(page, "predict-first-add", /^1 when g is negative/);
    await expect(figure.locator(".al-outcome")).toContainText(
      "added 1 to a negative value and 0 to any other",
    );
  });

  test("a commitment is kept, and is still there after a reload", async ({ page }) => {
    await open(page, "shifts");
    await commit(page, "predict-fill", FILL);
    await page.reload();
    await expect(page.locator("#ix-predict-fill .al-match")).toBeVisible();
    await expect(page.locator("#ix-shift-word .al-locked")).toHaveCount(0);
  });
});

test.describe("the shift figure", () => {
  test("stays shut until the prediction before it is checked", async ({ page }) => {
    await open(page, "shifts");
    const figure = page.locator("#ix-shift-word");
    await expect(figure.locator(".al-locked")).toBeVisible();
    await expect(figure.locator(".al-bit")).toHaveCount(0);
    await commit(page, "predict-fill", FILL);
    await expect(figure.locator(".al-locked")).toHaveCount(0);
  });

  test("shows the model's word after each shift by each amount, the bits that fell off and the bits that filled the gap", async ({
    page,
  }) => {
    await open(page, "shifts");
    await commit(page, "predict-fill", FILL);
    const figure = page.locator("#ix-shift-word");
    await figure.scrollIntoViewIfNeeded();
    const input = figure.getByLabel(V.shift.inputLabel);
    for (const word of [0xfffffff9, 0x35, 0x80000001]) {
      await input.fill(hexOf(word));
      for (const op of SHIFT_OPS)
        for (const n of SHIFT_AMOUNTS) {
          await press(page, chip(figure, V.shift.instruction, op));
          await press(page, chip(figure, V.shift.by, String(n)));
          const label = `${op} w0, w0, ${n} on ${hexOf(word)}`;
          const trace = traceOf(
            { listing: `shift:\n  ${op} w0, w0, ${n}\n  ret` },
            { entry: "shift", args: [word] },
          );
          const after = wValue(viewAt(trace, 1).state, 0);
          expect(await rowBits(figure, "before"), label).toBe(pad32(word));
          expect(await rowBits(figure, "after"), label).toBe(pad32(after));
          const before = pad32(word);
          const result = pad32(after);
          // Left: the top bits fall off and the bottom ones are filled; right: the other way about.
          const [fell, filled] =
            op === "lsl"
              ? [before.slice(0, n), result.slice(32 - n)]
              : [before.slice(32 - n), result.slice(0, n)];
          await expect(figure.locator('[data-part="fell"]'), label).toHaveText(
            V.shift.fellOff(fell),
          );
          await expect(figure.locator('[data-part="filled"]'), label).toHaveText(
            V.shift.filledWith(filled),
          );
          const high = [...Array(n).keys()].map((i) => 31 - i).reverse();
          const low = [...Array(n).keys()];
          expect(await marked(figure, "before", "lost"), label).toEqual(op === "lsl" ? high : low);
          expect(await marked(figure, "after", "fill"), label).toEqual(op === "lsl" ? low : high);
        }
    }
  });

  test("asr of -7 by 1 is -4 and lsr of its bits is 2147483644: copies of the top bit, and zeros", async ({
    page,
  }) => {
    await open(page, "shifts");
    await commit(page, "predict-fill", FILL);
    const figure = page.locator("#ix-shift-word");
    await figure.scrollIntoViewIfNeeded();
    await press(page, chip(figure, V.shift.instruction, "asr"));
    await press(page, chip(figure, V.shift.by, "1"));
    await expect(rowValue(figure, "after")).toHaveText("0xfffffffc");
    await expect(figure.getByRole("status")).toContainText(
      "w0 holds 0xfffffffc: 4294967292 as unsigned, -4 as signed.",
    );
    await expect(figure.locator('[data-part="filled"]')).toHaveText("Filled with: 1");
    await press(page, chip(figure, V.shift.instruction, "lsr"));
    await expect(rowValue(figure, "after")).toHaveText("0x7ffffffc");
    await expect(figure.getByRole("status")).toContainText("2147483644 as unsigned");
    await expect(figure.locator('[data-part="filled"]')).toHaveText("Filled with: 0");
  });

  test("says so, and shows no result and never the starting word, when the learner types something it cannot read", async ({
    page,
  }) => {
    await open(page, "shifts");
    await commit(page, "predict-fill", FILL);
    const figure = page.locator("#ix-shift-word");
    await figure.scrollIntoViewIfNeeded();
    await figure.getByLabel(V.shift.inputLabel).fill("banana");
    await expect(figure.getByText(V.shift.inputProblem)).toBeVisible();
    await expect(figure.locator(".al-bit")).toHaveCount(0);
  });
});

test.describe("the stepper after the second prediction", () => {
  test("stays shut until the prediction is checked, then shows the model's div2(-7): -7, -6, -3", async ({
    page,
  }) => {
    await open(page, "shifts-and-signed-division");
    const stepper = page.locator("#ix-step-div2");
    await stepper.scrollIntoViewIfNeeded();
    await expect(stepper.locator(".al-locked")).toBeVisible();
    await expect(stepper.getByRole("button", { name: V.stepper.next })).toHaveCount(0);
    await commit(page, "predict-first-add", /^1 when g is negative/);
    await expect(stepper.locator(".al-locked")).toHaveCount(0);
    const next = stepper.getByRole("button", { name: V.stepper.next });
    const trace = traceOf(DIV2, { entry: "div2", args: [-7] });
    await expect(stepper.locator(".al-insn .al-text")).toHaveText([
      "add w0, w0, w0, lsr 31",
      "asr w0, w0, 1",
      "ret",
    ]);
    for (let k = 0; k <= 3; k++) {
      const state = viewAt(trace, k).state;
      const value = wValue(state, 0);
      expect(await rowBits(stepper, "w0")).toBe(pad32(value));
      await expect(rowValue(stepper, "w0")).toHaveText(
        `${hexOf(value)} (${wValueAsInt(state, 0)})`,
      );
      if (k < 3) await press(page, next);
    }
    await expect(next).toBeDisabled();
    await expect(rowValue(stepper, "w0")).toHaveText("0xfffffffd (-3)");
    await expect(stepper.locator("[role=status]")).toContainText(V.stepper.ended);
    // The related C operation is lit as the instructions run.
    await expect(stepper.locator(".al-c:has(.al-cline)").first()).toBeVisible();
  });
});

test.describe("the comparison challenge", () => {
  const fields = ["asr21", "lsr21", "div21", "asr_neg", "lsr_neg", "div_neg"] as const;
  const fill = async (c: Locator, values: readonly string[]) => {
    for (const [i, f] of fields.entries())
      await c.locator(`[data-field="${f}"] input`).fill(values[i]!);
  };
  const reference = () =>
    LESSONS.flatMap((unit) => unit.challenges).find((x) => x.id === COMPARE)!.reference
      .answers as Record<string, string>;

  test("asks for six numbers and shows no program", async ({ page }) => {
    await open(page, "shifts-and-signed-division");
    const c = challenge(page, COMPARE);
    await c.scrollIntoViewIfNeeded();
    await expect(c.locator(".answer-field")).toHaveCount(6);
    await expect(c.locator(".al-insn")).toHaveCount(0);
    await expect(c.locator(".answer-label")).toHaveText([
      "asr of 21 by 2",
      "lsr of 21 by 2",
      "21 / 4",
      "asr of −21 by 2",
      "lsr of −21 by 2 (−21 taken as unsigned)",
      "-21 / 4",
    ]);
    // A field that takes a negative number gets the full keyboard.
    await expect(c.locator('[data-field="asr_neg"] input')).toHaveAttribute("inputmode", "text");
  });

  test("rejects a wrong answer by name, and never gives the right one", async ({ page }) => {
    await open(page, "shifts-and-signed-division");
    const c = challenge(page, COMPARE);
    await c.scrollIntoViewIfNeeded();
    // The division's answer given for the shift, and the shift's for the division.
    await fill(c, ["5", "5", "5", "-5", "1073741818", "-6"]);
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(4, 6));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["asr of −21 by 2", "-21 / 4"]);
    await expect(c.locator(".verdict")).not.toContainText("-6 ");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    // The unsigned reading is the one asked for.
    await fill(c, ["5", "5", "5", "-6", "-1073741830", "-5"]);
    await press(page, run(c));
    await expect(c.locator(".verdict-failure h4")).toHaveText([
      "lsr of −21 by 2 (−21 taken as unsigned)",
    ]);
  });

  test("asks for every answer first, and for whole numbers", async ({ page }) => {
    await open(page, "shifts-and-signed-division");
    const c = challenge(page, COMPARE);
    await c.scrollIntoViewIfNeeded();
    await c.locator('[data-field="asr21"] input').fill("5");
    await press(page, run(c));
    await expect(status(c)).toHaveText(S.challenge.blocked);
    await expect(c.locator(".verdict.blocked")).toContainText("lsr");
    await fill(c, ["five", "5", "5", "-6", "1073741818", "-5"]);
    await press(page, run(c));
    await expect(c.locator(".verdict.blocked")).toContainText("whole number");
  });

  test("accepts the reference", async ({ page }) => {
    await open(page, "shifts-and-signed-division");
    const c = challenge(page, COMPARE);
    await c.scrollIntoViewIfNeeded();
    const a = reference();
    await fill(
      c,
      fields.map((f) => a[f]!),
    );
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(6));
    await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
  });
});

test.describe("the instruction challenge", () => {
  const fill = async (c: Locator, a: string, b: string, g: string) => {
    await c.locator('[data-field="shr_int"] input').fill(a);
    await c.locator('[data-field="shr_unsigned"] input').fill(b);
    await c.locator('[data-field="shl"] input').fill(g);
  };

  test("asks for three instructions, and shows none of GCC's", async ({ page }) => {
    await open(page, "shifts");
    const c = challenge(page, PICK);
    await c.scrollIntoViewIfNeeded();
    await expect(c.locator(".answer-field")).toHaveCount(3);
    await expect(c.locator(".al-insn")).toHaveCount(0);
    await expect(c.locator(".answer-label")).toHaveText([
      "int x >> 3",
      "unsigned x >> 3",
      "x << 3",
    ]);
  });

  test("rejects a wrong instruction by name, and never gives the right one", async ({ page }) => {
    await open(page, "shifts");
    const c = challenge(page, PICK);
    await c.scrollIntoViewIfNeeded();
    await fill(c, "lsr", "lsr", "lsl");
    await press(page, run(c));
    await expect(status(c)).toHaveText(failing(2, 3));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["int x >> 3"]);
    await expect(c.locator(".verdict")).not.toContainText("asr");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("asks for all three first", async ({ page }) => {
    await open(page, "shifts");
    const c = challenge(page, PICK);
    await c.scrollIntoViewIfNeeded();
    await c.locator('[data-field="shr_int"] input').fill("asr");
    await press(page, run(c));
    await expect(status(c)).toHaveText(S.challenge.blocked);
    await expect(c.locator(".verdict.blocked")).toContainText("x >> 3");
  });

  test("accepts the reference, in any case", async ({ page }) => {
    await open(page, "shifts");
    const c = challenge(page, PICK);
    await c.scrollIntoViewIfNeeded();
    const a = lesson.challenges.find((x) => x.id === PICK)!.reference.answers!;
    await fill(c, a["shr_int"]!, a["shr_unsigned"]!, a["shl"]!);
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(3));
    await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
    await fill(c, "ASR", "Lsr", "lsl");
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(3));
  });
});

test.describe("a completion", () => {
  async function complete(page: Page) {
    const c = challenge(page, PICK);
    await c.scrollIntoViewIfNeeded();
    await c.locator('[data-field="shr_int"] input').fill("asr");
    await c.locator('[data-field="shr_unsigned"] input').fill("lsr");
    await c.locator('[data-field="shl"] input').fill("lsl");
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    return c;
  }

  test("survives a reload, graded again, not read from a mark", async ({ page }) => {
    await open(page, "shifts");
    await complete(page);
    await page.reload();
    const c = challenge(page, PICK);
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await expect(c.locator('[data-field="shr_unsigned"] input')).toHaveValue("lsr");
    // What was kept is the work. Change it in storage to work that fails: the page does not
    // believe the old completion.
    await page.evaluate((k) => {
      const s = JSON.parse(localStorage.getItem(k)!);
      s.challenges["pick-instruction"].artifact.answers.shr_unsigned = "asr";
      localStorage.setItem(k, JSON.stringify(s));
    }, STORAGE_KEY);
    await page.reload();
    await expect(challenge(page, PICK).locator(".challenge-complete")).toHaveCount(0);
    await expect(status(challenge(page, PICK))).toHaveText(failing(2, 3));
  });

  test("goes when the work is cleared, and stays gone after a reload", async ({ page }) => {
    await open(page, "shifts");
    const c = await complete(page);
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await expect(status(c)).toHaveText(S.challenge.resetDone);
    await expect(c.locator('[data-field="shr_int"] input')).toHaveValue("");
    expect((await stored(page)).challenges[PICK]).toBeUndefined();
    await page.reload();
    await expect(challenge(page, PICK).locator(".challenge-complete")).toHaveCount(0);
  });

  test("of the comparison challenge survives a reload too", async ({ page }) => {
    await open(page, "shifts-and-signed-division");
    const c = challenge(page, COMPARE);
    await c.scrollIntoViewIfNeeded();
    const a = LESSONS.flatMap((unit) => unit.challenges).find((x) => x.id === COMPARE)!.reference
      .answers!;
    for (const [id, value] of Object.entries(a))
      await c.locator(`[data-field="${id}"] input`).fill(value);
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.reload();
    await expect(challenge(page, COMPARE).locator(".challenge-complete")).toBeVisible();
    await expect(challenge(page, COMPARE).locator('[data-field="div_neg"] input')).toHaveValue(
      "-5",
    );
  });
});

test.describe("the look of the lesson page", () => {
  test("text is legible, controls are reachable, nothing scrolls sideways, prose keeps its measure", async ({
    page,
  }, info) => {
    await open(page, "shifts");
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
  });

  test("and so are the figures once they have been used and a verdict shown", async ({
    page,
  }, info) => {
    const phone = info.project.name === "phone";
    await open(page, "shifts");
    await commit(page, "predict-fill", FILL);
    const shift = page.locator("#ix-shift-word");
    await shift.scrollIntoViewIfNeeded();
    await press(page, chip(shift, V.shift.instruction, "asr"));
    await press(page, chip(shift, V.shift.by, "8"));
    expect(await designProblems(page, phone)).toEqual([]);
    await open(page, "shifts-and-signed-division");
    await commit(page, "predict-first-add", /^31$/);
    const step = page.locator("#ix-step-div2");
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    const compare = challenge(page, COMPARE);
    await compare.locator('[data-field="asr21"] input').fill("1");
    await compare.locator('[data-field="lsr21"] input').fill("2");
    await compare.locator('[data-field="div21"] input').fill("3");
    await compare.locator('[data-field="asr_neg"] input').fill("4");
    await compare.locator('[data-field="lsr_neg"] input').fill("5");
    await compare.locator('[data-field="div_neg"] input').fill("6");
    await press(page, run(compare));
    await press(page, compare.getByRole("button", { name: /Show hint/ }));
    expect(await designProblems(page, phone)).toEqual([]);
    await open(page, "shifts");
    const pick = challenge(page, PICK);
    await pick.locator('[data-field="shr_int"] input').fill("lsl");
    await press(page, run(pick));
    expect(await designProblems(page, phone)).toEqual([]);
  });

  test("a row of 32 cells fits the screen, on a phone and on a desk", async ({ page }) => {
    await open(page, "shifts");
    await commit(page, "predict-fill", FILL);
    const figure = page.locator("#ix-shift-word");
    const rows = figure.locator("[data-row]");
    await rows.first().scrollIntoViewIfNeeded();
    const width = page.viewportSize()!.width;
    for (const row of ["before", "after"]) {
      const box = (await figure.locator(`[data-row='${row}']`).boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      await expect(figure.locator(`[data-row='${row}'] .al-bit`)).toHaveCount(32);
    }
  });
});

test.describe("both themes", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`the shift figure is drawn in the ${theme} theme, with the bits that fell off and the bits that filled the gap visible`, async ({
      page,
    }) => {
      await page.goto("#/");
      await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      await page.reload();
      await open(page, "shifts");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await commit(page, "predict-fill", FILL);
      const figure = page.locator("#ix-shift-word");
      await figure.scrollIntoViewIfNeeded();
      await press(page, chip(figure, V.shift.instruction, "asr"));
      const look = await figure.evaluate((el) => {
        const style = (sel: string) => getComputedStyle(el.querySelector(sel)!);
        const on = style('[data-row="after"] .al-bit[data-on="true"]');
        const off = style('[data-row="after"] .al-bit[data-on="false"]');
        const lost = style('[data-row="before"] .al-bit[data-lost="true"]');
        const fill = style('[data-row="after"] .al-bit[data-fill="true"]');
        return {
          on: on.backgroundColor,
          off: off.backgroundColor,
          struck: lost.textDecorationLine,
          dashed: fill.outlineStyle,
          fillColour: fill.outlineColor,
        };
      });
      expect(look.on).not.toBe(look.off);
      expect(look.struck).toBe("line-through");
      expect(look.dashed).toBe("dashed");
      expect(look.fillColour).not.toBe(look.off);
    });
  }
});

test.describe("the reworked figures (17 October 2026)", () => {
  test("the shift figure says which way the bits move and what fills the gap, and marks -7's filled top bit for asr and lsr", async ({
    page,
  }) => {
    await open(page, "shifts");
    await commit(page, "predict-fill", /^A copy of the old top bit/);
    const figure = page.locator("#ix-shift-word");
    await figure.scrollIntoViewIfNeeded();
    for (const [op, text, bits] of [
      ["asr", "copies of the old top bit", pad32(0xfffffffc)],
      ["lsr", "zeros", pad32(0x7ffffffc)],
    ] as const) {
      await press(page, chip(figure, V.shift.instruction, op));
      await expect(figure.locator(".al-direction")).toContainText(
        `${op} moves every bit 1 place right`,
      );
      await expect(figure.locator(".al-direction")).toContainText(text);
      expect(await rowBits(figure, "after")).toBe(bits);
      expect(await marked(figure, "after", "fill")).toEqual([31]);
      await expect(figure.locator('[data-row="filled"] .al-mark[data-bit="31"]')).toHaveText("+");
    }
  });

  test("a word the shift figure cannot read gets its message and no result", async ({ page }) => {
    await open(page, "shifts");
    await commit(page, "predict-fill", /^A copy of the old top bit/);
    const figure = page.locator("#ix-shift-word");
    await figure.scrollIntoViewIfNeeded();
    for (const bad of ["", "0x", "4294967296", "banana"]) {
      await figure.getByLabel(V.shift.inputLabel).fill(bad);
      await expect(figure.locator(".al-problem")).toBeVisible();
      await expect(figure.locator(".al-bit")).toHaveCount(0);
    }
    await figure.getByLabel(V.shift.inputLabel).fill("-7");
    await expect(figure.locator(".al-problem")).toHaveCount(0);
  });

  test("the div2 stepper shows w0 before and after, the shifted operand, and a second call for 7", async ({
    page,
  }) => {
    await open(page, "shifts-and-signed-division");
    await commit(page, "predict-first-add", /^1 when/);
    const figure = page.locator("#ix-step-div2");
    await figure.scrollIntoViewIfNeeded();
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
    await expect(figure.locator('.al-facts [data-fact="before"]')).toContainText("(-7)");
    await expect(figure.locator('.al-facts [data-fact="operand"]')).toContainText("0x1 (1)");
    await expect(figure.locator('.al-facts [data-fact="after"]')).toContainText("(-6)");
    await press(page, figure.getByRole("button", { name: "div2(7)", exact: true }));
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
    await expect(figure.locator('.al-facts [data-fact="operand"]')).toContainText("0x0 (0)");
  });
});
