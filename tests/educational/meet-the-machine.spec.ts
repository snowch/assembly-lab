// Copyright © 2026 Christopher Snow

// Module 0, Meet the machine, in a browser, on the built site, at desktop and phone widths: the
// lesson loads without an error; the stepper's values after each Next are the model's; both
// predictions commit before they reveal; the construction challenge is completed by typing (at the
// desktop width) and by tapping alone (at the phone width); a wrong answer is rejected; the answers
// challenge rejects a wrong w1 with the lesson's sentence and accepts the reference; a completion
// survives a reload and is graded again; Clear work removes it; and the page keeps the look the
// shell's own pages keep.

import { expect, test, type Locator, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import { DEFAULT_STRINGS as S, format } from "../../platform/lesson-runtime/src/strings";

import { PROSE } from "../../content/lessons/meet-the-machine.prose";
import { TRIP_DISTANCE } from "../../content/lessons/meet-the-machine.listings";
import { designProblems } from "./design";

const LESSON_ID = "meet-the-machine";
const STORAGE_KEY = `assembly-lab:v1:${LESSON_ID}`;
const lesson = LESSONS.find((l) => l.id === LESSON_ID)!;
const FIX = "fix-fuel-used";
const TRACE = "trace-the-call";

/** Everything the page logs as an error, or throws, until the test ends. */
function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`page: ${e.message}`));
  return errors;
}

async function openLesson(page: Page): Promise<void> {
  await page.goto(`#/lesson/${LESSON_ID}`);
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

const stored = (page: Page) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), STORAGE_KEY);

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

test("the way back leads to the front page", async ({ page }) => {
  await openLesson(page);
  await press(page, page.locator("a.back-link").first());
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Assembly Lab");
});

test.describe("the listing figure", () => {
  test("shows the C with line numbers beside the instructions, each with its recorded C line", async ({
    page,
  }) => {
    await openLesson(page);
    const figure = page.locator("#ix-trip-listing");
    await expect(figure.locator(".al-cline")).toHaveCount(7);
    await expect(figure.locator(".al-insn .al-text")).toHaveText([
      "add w0, w0, w1",
      "add w0, w0, w2",
      "sub w0, w0, w3",
      "ret",
    ]);
    await expect(figure.locator(".al-ctag")).toHaveText(["3", "4", "7", "7"]);
    // The C is beside the instructions on a desk and above them on a phone.
    const [c, asm] = await Promise.all([
      figure.locator(".al-c").boundingBox(),
      figure.locator(".al-asm").boundingBox(),
    ]);
    if ((page.viewportSize()?.width ?? 0) >= 800)
      expect(asm!.x).toBeGreaterThan(c!.x + c!.width - 1);
    else expect(asm!.y).toBeGreaterThan(c!.y + c!.height - 1);
  });
});

test.describe("the stepper", () => {
  test("stays shut until the prediction before it is checked", async ({ page }) => {
    await openLesson(page);
    const stepper = page.locator("#ix-step-trip");
    await expect(stepper.locator(".al-locked")).toBeVisible();
    await expect(stepper.getByRole("button", { name: V.stepper.next })).toHaveCount(0);
    await commit(page, "predict-total", /^In w0/);
    await expect(stepper.locator(".al-locked")).toHaveCount(0);
  });

  test("shows the model's values after each Next: 205, 247, 232, and ret", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    const figure = page.locator("#ix-step-trip");
    await figure.scrollIntoViewIfNeeded();
    const next = figure.getByRole("button", { name: V.stepper.next });
    const model = traceOf(TRIP_DISTANCE, { entry: "trip_distance", args: [120, 85, 42, 15] });
    await expect(registerValue(figure, "w0")).toHaveText("120");
    for (const [k, w0] of [
      [1, "205"],
      [2, "247"],
      [3, "232"],
      [4, "232"],
    ] as const) {
      await press(page, next);
      expect(wValue(viewAt(model, k).state, 0)).toBe(Number(w0));
      await expect(registerValue(figure, "w0")).toHaveText(w0);
      // w1, w2 and w3 never change.
      await expect(registerValue(figure, "w1")).toHaveText("85");
      await expect(registerValue(figure, "w2")).toHaveText("42");
      await expect(registerValue(figure, "w3")).toHaveText("15");
    }
    await expect(next).toBeDisabled();
    await expect(figure.locator('.al-insn[data-next="true"]')).toHaveCount(0);
    await expect(figure.locator("[role=status]")).toContainText(V.stepper.ended);
  });

  test("moves the marker, outlines the register just written and lights the recorded C line", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    const figure = page.locator("#ix-step-trip");
    await figure.scrollIntoViewIfNeeded();
    const marked = () =>
      figure
        .locator(".al-insn")
        .evaluateAll((rows) => rows.findIndex((r) => r.getAttribute("data-next") === "true"));
    expect(await marked()).toBe(0);
    await expect(figure.locator('[data-changed="true"]')).toHaveCount(0);
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
    expect(await marked()).toBe(1);
    await expect(figure.locator('[data-changed="true"]')).toHaveAttribute("data-register", "w0");
    await expect(figure.locator('.al-cline[data-lit="true"]')).toHaveAttribute("data-line", "3");
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
    // The last subtraction is recorded against the closing brace.
    await expect(figure.locator('.al-cline[data-lit="true"]')).toHaveAttribute("data-line", "7");
    await press(page, figure.getByRole("button", { name: V.stepper.back }));
    await expect(registerValue(figure, "w0")).toHaveText("247");
    await press(page, figure.getByRole("button", { name: V.stepper.reset }));
    await expect(registerValue(figure, "w0")).toHaveText("120");
  });

  test("with ret deleted, runs on into fuel_used: 232 minus 85, which is 147, in five instructions", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-no-ret", "147");
    const figure = page.locator("#ix-step-no-ret");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-insn")).toHaveCount(6);
    await press(page, figure.getByRole("checkbox", { name: /Delete the ret line/ }));
    await expect(figure.locator(".al-insn")).toHaveCount(5);
    const next = figure.getByRole("button", { name: V.stepper.next });
    for (let k = 0; k < 3; k++) await press(page, next);
    await expect(registerValue(figure, "w0")).toHaveText("232");
    await press(page, next);
    await expect(registerValue(figure, "w0")).toHaveText("147");
    await press(page, next);
    await expect(next).toBeDisabled();
    await expect(registerValue(figure, "w0")).toHaveText("147");
    await expect(figure.locator("[role=status]")).toContainText(V.stepper.ended);
  });
});

test.describe("the two predictions commit before they reveal", () => {
  for (const [id, right, wrong] of [
    ["predict-total", /^In w0/, /^In w3/],
    ["predict-no-ret", "147", "232"],
  ] as const) {
    test(id, async ({ page }) => {
      await openLesson(page);
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

  test("a commitment is kept, and is still there after a reload", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    await page.reload();
    await expect(page.locator("#ix-predict-total .al-match")).toBeVisible();
    await expect(page.locator("#ix-step-trip .al-locked")).toHaveCount(0);
  });
});

test.describe("the construction challenge", () => {
  test("is completed by typing, at the desktop width", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "typing is the desktop width's way in");
    const errors = watchErrors(page);
    await openLesson(page);
    const c = challenge(page, FIX);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await expect(box).toHaveValue("sub w0, w1, w0\nret");
    await expect(box).toHaveAttribute("autocapitalize", "off");
    await expect(box).toHaveAttribute("autocorrect", "off");
    await expect(box).toHaveAttribute("spellcheck", "false");
    await box.fill("");
    await box.pressSequentially("sub w0, w0, w1\nret");
    await run(c).click();
    await expect(status(c)).toHaveText(passing(3));
    await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
    expect(errors).toEqual([]);
  });

  test("is completed by tapping alone, at the phone width", async ({ page }, info) => {
    test.skip(info.project.name !== "phone", "tapping is the phone width's way in");
    const errors = watchErrors(page);
    await openLesson(page);
    const c = challenge(page, FIX);
    await c.scrollIntoViewIfNeeded();
    await c.getByRole("button", { name: V.editor.tap, exact: true }).tap();
    // No text box in this mode: nothing can be typed.
    await expect(c.getByRole("textbox")).toHaveCount(0);
    await c.locator(".asm-line-button").first().tap();
    await c
      .getByRole("group", { name: V.editor.operand(2) })
      .getByRole("button", { name: "w0" })
      .tap();
    await c
      .getByRole("group", { name: V.editor.operand(3) })
      .getByRole("button", { name: "w1" })
      .tap();
    await expect(c.locator(".asm-line-button").first()).toContainText("sub w0, w0, w1");
    await run(c).tap();
    await expect(status(c)).toHaveText(passing(3));
    await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
    expect((await stored(page)).challenges[FIX].artifact.text).toBe("sub w0, w0, w1\nret");
    expect(errors).toEqual([]);
  });

  test("builds the whole answer from chips and the number pad, from nothing", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, FIX);
    await c.scrollIntoViewIfNeeded();
    await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
    // Take the starting lines out, then build `sub w0, w0, w1` and `ret`.
    for (let k = 0; k < 2; k++) {
      await press(page, c.locator(".asm-line-button").first());
      await press(page, c.getByRole("button", { name: V.editor.remove }));
    }
    await press(page, c.getByRole("button", { name: V.editor.addFirst }));
    const chip = (group: string, name: string) =>
      c.getByRole("group", { name: group, exact: true }).getByRole("button", { name, exact: true });
    await press(page, chip(V.editor.instruction, "sub"));
    await press(page, chip(V.editor.operand(1), "w0"));
    await press(page, chip(V.editor.operand(2), "w0"));
    await press(page, chip(V.editor.operand(3), "w1"));
    await press(page, c.getByRole("button", { name: V.editor.addBelow }));
    await press(page, chip(V.editor.instruction, "ret"));
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(3));
  });

  test("keeps the text when the learner switches between the two modes", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, FIX);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    // Characters from the bar go in at the cursor.
    await box.fill("sub w0 w1");
    await box.evaluate((el: HTMLTextAreaElement) => el.setSelectionRange(6, 6));
    await press(page, c.getByRole("button", { name: V.editor.insert(",") }));
    await expect(box).toHaveValue("sub w0, w1");
    await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
    await expect(c.locator(".asm-line-button")).toHaveCount(1);
    await expect(c.locator(".asm-line-button")).toContainText("sub w0, w1");
    await press(page, c.getByRole("button", { name: V.editor.text, exact: true }));
    await expect(box).toHaveValue("sub w0, w1");
  });
});

test.describe("a wrong answer is rejected", () => {
  test("the starting point fails the two calls it gets wrong, and says what it returned", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, FIX);
    await c.scrollIntoViewIfNeeded();
    await press(page, run(c));
    await expect(status(c)).toHaveText(format(S.challenge.failing, { passed: 1, total: 3 }));
    await expect(c.locator(".verdict-failure h4")).toHaveText([
      "fuel_used(50, 38)",
      "fuel_used(60, 5)",
    ]);
    await expect(c.locator(".verdict-failure").first()).toContainText("w0=-12");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("another wrong order of operands fails, and an instruction the lesson has not met is refused", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, FIX);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await box.fill("sub w0, w1, w0\nsub w0, w0, w1\nret");
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await expect(status(c)).not.toHaveText(passing(3));
    await box.fill("mov w0, w1\nret");
    await expect(c.locator(".asm-problems")).toContainText("Line 1");
    await expect(c.locator(".asm-problems")).toContainText("mov");
    await press(page, run(c));
    await expect(status(c)).toHaveText(S.challenge.blocked);
    await expect(c.locator(".verdict.blocked")).toContainText("mov");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });
});

test.describe("the answers challenge", () => {
  const fill = async (c: Locator, w0: string, w1: string) => {
    await c.locator('[data-field="w0"] input').fill(w0);
    await c.locator('[data-field="w1"] input').fill(w1);
  };

  test("shows the program it is about, and asks for two numbers", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, TRACE);
    await c.scrollIntoViewIfNeeded();
    await expect(c.locator(".al-insn .al-text")).toHaveText([
      "sub w0, w0, w1",
      "sub w0, w0, w2",
      "sub w0, w0, w3",
      "sub w0, w0, #50",
      "ret",
    ]);
    await expect(c.locator(".answer-field")).toHaveCount(2);
  });

  test("answers a wrong w1 with the lesson's sentence, and never the right value", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, TRACE);
    await c.scrollIntoViewIfNeeded();
    await fill(c, "670", "30000");
    await press(page, run(c));
    await expect(status(c)).toHaveText(format(S.challenge.failing, { passed: 1, total: 2 }));
    const failure = c.locator(".verdict-failure");
    await expect(failure).toHaveCount(1);
    await expect(failure.locator(".verdict-detail")).toHaveText(
      PROSE.traceFeedbackW1.replaceAll("`", ""),
    );
    await expect(c.locator(".verdict")).not.toContainText("28750");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("answers a wrong w0 with the lesson's sentence, and never the right value", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, TRACE);
    await c.scrollIntoViewIfNeeded();
    await fill(c, "1250", "28750");
    await press(page, run(c));
    await expect(c.locator(".verdict-detail")).toHaveText(
      PROSE.traceFeedbackW0.replaceAll("`", ""),
    );
    await expect(c.locator(".verdict")).not.toContainText("670");
  });

  test("asks for both numbers before it grades anything", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, TRACE);
    await c.scrollIntoViewIfNeeded();
    await c.locator('[data-field="w0"] input').fill("670");
    await press(page, run(c));
    await expect(status(c)).toHaveText(S.challenge.blocked);
    await expect(c.locator(".verdict.blocked")).toContainText("w1");
  });

  test("accepts the reference", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, TRACE);
    await c.scrollIntoViewIfNeeded();
    const answers = lesson.challenges.find((x) => x.id === TRACE)!.reference.answers!;
    await fill(c, answers["w0"]!, answers["w1"]!);
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(2));
    await expect(c.locator(".challenge-complete")).toHaveText(S.challenge.complete);
  });
});

test.describe("a completion", () => {
  async function complete(page: Page): Promise<Locator> {
    const c = challenge(page, TRACE);
    await c.scrollIntoViewIfNeeded();
    await c.locator('[data-field="w0"] input').fill("670");
    await c.locator('[data-field="w1"] input').fill("28750");
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    return c;
  }

  test("survives a reload, graded again, not read from a mark", async ({ page }) => {
    await openLesson(page);
    await complete(page);
    await page.reload();
    const c = challenge(page, TRACE);
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await expect(c.locator('[data-field="w1"] input')).toHaveValue("28750");
    // What was kept is the work. Change it in storage to work that fails: the page does not
    // believe the old completion.
    await page.evaluate((k) => {
      const s = JSON.parse(localStorage.getItem(k)!);
      s.challenges["trace-the-call"].artifact.answers.w1 = "0";
      localStorage.setItem(k, JSON.stringify(s));
    }, STORAGE_KEY);
    await page.reload();
    await expect(challenge(page, TRACE).locator(".challenge-complete")).toHaveCount(0);
    await expect(status(challenge(page, TRACE))).toHaveText(
      format(S.challenge.failing, { passed: 1, total: 2 }),
    );
  });

  test("goes when the work is cleared, and stays gone after a reload", async ({ page }) => {
    await openLesson(page);
    const c = await complete(page);
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await expect(status(c)).toHaveText(S.challenge.resetDone);
    await expect(c.locator('[data-field="w0"] input')).toHaveValue("");
    expect((await stored(page)).challenges[TRACE]).toBeUndefined();
    await page.reload();
    await expect(challenge(page, TRACE).locator(".challenge-complete")).toHaveCount(0);
  });

  test("of the construction challenge is cleared back to the mistaken instructions", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, FIX);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await box.fill("sub w0, w0, w1\nret");
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.reload();
    await expect(challenge(page, FIX).locator(".challenge-complete")).toBeVisible();
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await expect(box).toHaveValue("sub w0, w1, w0\nret");
  });
});

test.describe("the look of the lesson page", () => {
  test("text is legible, controls are reachable, nothing scrolls sideways, prose keeps its measure", async ({
    page,
  }, info) => {
    await openLesson(page);
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
  });

  test("and so are the figures once they have been used, the tap editor open and a verdict shown", async ({
    page,
  }, info) => {
    const phone = info.project.name === "phone";
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    await commit(page, "predict-no-ret", "232");
    const step = page.locator("#ix-step-trip");
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    const noRet = page.locator("#ix-step-no-ret");
    await press(page, noRet.getByRole("checkbox"));
    const fix = challenge(page, FIX);
    await press(page, fix.getByRole("button", { name: V.editor.tap, exact: true }));
    await press(page, fix.locator(".asm-line-button").first());
    await press(
      page,
      fix
        .getByRole("group", { name: V.editor.operand(3) })
        .getByRole("button", { name: V.editor.number }),
    );
    await press(page, run(fix));
    const trace = challenge(page, TRACE);
    await trace.locator('[data-field="w0"] input').fill("1");
    await trace.locator('[data-field="w1"] input').fill("2");
    await press(page, run(trace));
    await press(page, trace.getByRole("button", { name: /Show hint/ }));
    expect(await designProblems(page, phone)).toEqual([]);
    // The text mode too, with a problem listed.
    await press(page, fix.getByRole("button", { name: V.editor.text, exact: true }));
    await fix.getByRole("textbox", { name: V.editor.textLabel }).fill("mov w0, w1");
    expect(await designProblems(page, phone)).toEqual([]);
  });

  test("a register's 32 cells fit the screen, on a phone and on a desk", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    const row = page.locator("#ix-step-trip [data-register='w0']");
    await row.scrollIntoViewIfNeeded();
    const box = (await row.boundingBox())!;
    const width = page.viewportSize()!.width;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    await expect(row.locator(".al-bit")).toHaveCount(32);
    await expect(row.locator(".al-bit-group")).toHaveCount(4);
  });
});

test.describe("both themes", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`the figures are drawn in the ${theme} theme, with the stepper's marker and filled bits visible`, async ({
      page,
    }) => {
      await page.goto("#/");
      await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      await page.reload();
      await openLesson(page);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await commit(page, "predict-total", /^In w0/);
      const figure = page.locator("#ix-step-trip");
      await press(page, figure.getByRole("button", { name: V.stepper.next }));
      const colours = await figure.evaluate((el) => {
        const on = el.querySelector('.al-bit[data-on="true"]')!;
        const off = el.querySelector('.al-bit[data-on="false"]')!;
        return [getComputedStyle(on).backgroundColor, getComputedStyle(off).backgroundColor];
      });
      expect(colours[0]).not.toBe(colours[1]);
    });
  }
});
