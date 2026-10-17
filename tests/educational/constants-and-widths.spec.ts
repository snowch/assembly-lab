// Copyright © 2026 Christopher Snow

// Module 1, lesson 2, Constants and widths, in a browser, on the built site, at desktop and phone
// widths: the lesson loads without an error; the listings are the recorded ones; both predictions
// commit before they reveal, and what follows each stays shut until it is checked; the constant
// tester gives the answer of the course's assembler for any number typed, and w0 as the model
// leaves it; the register drawn as two halves is the model's after each step; the written challenge
// is completed by typing (at the desktop width) and by tapping alone (at the phone width); the
// answers challenge compares 64 bits; wrong answers are rejected without the right value; a
// completion survives a reload and is graded again; Clear work removes it; and the page keeps the
// look the shell's own pages keep.

import { expect, test, type Locator, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { TEXT_BASE, assemble, message, run, stateAfter } from "@al/machine";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { MODULE1_STRINGS } from "../../packages/views/src/strings.module1";
import { PROSE } from "../../content/lessons/constants-and-widths.prose";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";

import {
  FOUR_INSTRUCTIONS,
  MOVK_EXAMPLE,
  ODOMETER_LIMIT_START_TEXT,
  ODOMETER_LIMIT_TEXT,
  SERVICE_INTERVAL,
  WIDTHS,
} from "../../content/lessons/module-1.listings";
import { designProblems } from "./design";
import {
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
  run as runTests,
  status,
  stored,
  watchErrors,
} from "./module1";

const LESSON_ID = "constants-and-widths";
const lesson = LESSONS.find((l) => l.id === LESSON_ID)!;
const BUILD = "build-1000000";
const TWO = "predict-two-registers";
const openLesson = (page: Page) => open(page, LESSON_ID);

/** What the model does with `mov w0, <text>`: w0 afterwards, or the assembler's sentence. */
function movResult(text: string): { w0: bigint } | { sentence: string } {
  const { program, errors } = assemble(`mov w0, ${text}\nret\n`);
  if (!program) return { sentence: message(errors[0]!.key, errors[0]!.params).replaceAll("`", "") };
  return { w0: run(program, { entry: TEXT_BASE }).final.x[0]! };
}

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

test.describe("the listing figure", () => {
  test("shows the C of service_interval and the instructions GCC recorded for it, and nothing of odometer_limit", async ({
    page,
  }) => {
    await openLesson(page);
    const figure = page.locator("#ix-service-interval");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-cline .al-src")).toHaveText([
      "int service_interval(void) { return 30000; }",
    ]);
    await expect(figure.locator(".al-label")).toHaveText(["service_interval:"]);
    await expect(figure.locator(".al-insn .al-text")).toHaveText(["mov w0, 30000", "ret"]);
    await expect(figure.locator(".al-ctag")).toHaveText(["1", "1"]);
    // The two instructions for 1000000 are the first challenge's answer: the figure holds neither.
    await expect(figure).not.toContainText("odometer_limit");
    await expect(figure).not.toContainText("16960");
    await expect(figure).not.toContainText("movk");
  });
});

test.describe("the prediction about which numbers fit", () => {
  for (const [option, match] of [
    ["65536", true],
    ["70000", false],
    ["100000", false],
    ["1000000", false],
  ] as const) {
    test(`commits before it reveals: ${option} ${match ? "matches" : "does not match"} the assembler`, async ({
      page,
    }) => {
      await openLesson(page);
      const figure = page.locator("#ix-predict-fits");
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator(".al-outcome")).toHaveCount(0);
      await expect(figure.getByRole("button", { name: V.prediction.commit })).toBeDisabled();
      await figure.getByRole("radio", { name: option, exact: true }).check();
      await expect(figure.locator(".al-outcome")).toHaveCount(0);
      await press(page, figure.getByRole("button", { name: V.prediction.commit }));
      await expect(figure.locator(match ? ".al-match" : ".al-nomatch")).toContainText(
        match ? V.prediction.match : V.prediction.noMatch,
      );
      // The model's own result: the assembler took 65536, and refused the other three.
      await expect(figure.locator(".al-outcome")).toContainText(
        V.fits.one("65536", 3).replace(/`/g, ""),
      );
      await expect(figure.locator(".al-outcome .prose")).toContainText(
        PROSE.predictionExplain.replace(/`/g, ""),
      );
    });
  }

  test("the assembler takes exactly 65536 of the four, as the page says", async () => {
    const options = ["65536", "70000", "100000", "1000000"];
    expect(options.filter((o) => "w0" in movResult(o))).toEqual(["65536"]);
  });

  test("a commitment is kept, and is still there after a reload", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-fits", "65536");
    await page.reload();
    await expect(page.locator("#ix-predict-fits .al-match")).toBeVisible();
    await expect(page.locator("#ix-try-a-number .al-locked")).toHaveCount(0);
  });
});

test.describe("the constant tester", () => {
  const tester = (page: Page) => page.locator("#ix-try-a-number");
  const typeNumber = async (page: Page, text: string) => {
    await tester(page).getByRole("textbox", { name: V.tester.input }).fill(text);
  };

  test("stays shut until the prediction before it is checked", async ({ page }) => {
    await openLesson(page);
    await expect(tester(page).locator(".al-locked")).toBeVisible();
    await expect(tester(page).getByRole("textbox")).toHaveCount(0);
    await commit(page, "predict-fits", "70000");
    await expect(tester(page).locator(".al-locked")).toHaveCount(0);
    await expect(tester(page).getByRole("textbox", { name: V.tester.input })).toBeVisible();
    await expect(tester(page).locator(".al-tester-result")).toContainText(
      V.tester.empty.replaceAll("`", ""),
    );
  });

  for (const n of [
    "30000",
    "65535",
    "65536",
    "65537",
    "-1",
    "4294967295",
    "0x10000",
    "0x00010001",
  ]) {
    test(`takes ${n} in one instruction and shows w0 as the model leaves it`, async ({ page }) => {
      await openLesson(page);
      await commit(page, "predict-fits", "65536");
      const model = movResult(n);
      if (!("w0" in model)) throw new Error(`${n} should assemble`);
      await tester(page).scrollIntoViewIfNeeded();
      await typeNumber(page, n);
      await expect(tester(page).locator(".al-match")).toContainText(
        `mov w0, ${n} is one instruction`,
      );
      await expect(registerValue(tester(page), "w0")).toHaveText(String(model.w0));
      await expect(
        tester(page).locator('[data-register="w0"] .al-bit[data-on="true"]'),
      ).toHaveCount(model.w0.toString(2).replaceAll("0", "").length);
    });
  }

  for (const n of ["70000", "100000", "1000000", "4294967296", "0x12345"]) {
    test(`refuses ${n} with the assembler's own sentence, and shows no register`, async ({
      page,
    }) => {
      await openLesson(page);
      await commit(page, "predict-fits", "65536");
      const model = movResult(n);
      if (!("sentence" in model)) throw new Error(`${n} should not assemble`);
      await tester(page).scrollIntoViewIfNeeded();
      await typeNumber(page, n);
      await expect(tester(page).locator(".al-nomatch")).toHaveText(model.sentence);
      await expect(tester(page).locator("[data-register]")).toHaveCount(0);
    });
  }

  test("draws w0 as two labelled 16-bit halves with a rule between them, inside the box", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-fits", "65536");
    await tester(page).scrollIntoViewIfNeeded();
    await typeNumber(page, "65536");
    const halves = tester(page).locator('[data-register="w0"] .al-half16');
    await expect(halves.locator(".al-half16-name")).toHaveText([
      MODULE1_STRINGS.register.upperHalf,
      MODULE1_STRINGS.register.lowerHalf,
    ]);
    // 65536 is bit 16, the lowest bit of the upper half.
    await expect(halves.nth(0).locator('.al-bit[data-on="true"]')).toHaveCount(1);
    await expect(halves.nth(1).locator('.al-bit[data-on="true"]')).toHaveCount(0);
    await expect(halves.nth(0).locator(".al-bit")).toHaveCount(16);
    await expect(halves.nth(1).locator(".al-bit")).toHaveCount(16);
    // The rule between them is drawn, and the halves sit side by side.
    const rule = await halves.nth(1).evaluate((el) => getComputedStyle(el).borderLeftWidth);
    expect(parseFloat(rule)).toBeGreaterThan(0);
    const [a, b] = await halves.evaluateAll((els) =>
      els.map((el) => el.getBoundingClientRect().toJSON()),
    );
    expect(b.left).toBeGreaterThanOrEqual(a.right);
    await expect(
      tester(page).locator('[data-register="w0"] .al-half16-name').first(),
    ).toBeVisible();
    expect(await figureOverflow(page)).toEqual([]);
    expect(await designProblems(page, page.viewportSize()!.width < 500)).toEqual([]);
    // A number the assembler refuses shows no bits at all.
    await typeNumber(page, "1000000");
    await expect(tester(page).locator(".al-half16, .al-bit")).toHaveCount(0);
  });

  test("says 'no single instruction' for 1000000, as the lesson's prose says it will", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-fits", "65536");
    await tester(page).scrollIntoViewIfNeeded();
    await typeNumber(page, "1000000");
    await expect(tester(page).locator(".al-nomatch")).toContainText(
      "No single instruction can put",
    );
  });

  test("does not hand text that is not a number to the assembler", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-fits", "65536");
    await tester(page).scrollIntoViewIfNeeded();
    await typeNumber(page, "w1");
    await expect(tester(page).locator(".al-tester-result")).toHaveText(
      V.tester.notNumber.replaceAll("`", ""),
    );
    await expect(tester(page).locator("[data-register]")).toHaveCount(0);
  });

  test("keeps the closed note closed until it is opened", async ({ page }) => {
    await openLesson(page);
    const note = page.locator("section[data-kind='investigation'] details.lesson-details");
    await expect(note.locator("summary")).toHaveText("Other patterns that fit");
    await expect(note).not.toHaveAttribute("open", "");
    await expect(note.locator(".prose")).toBeHidden();
    await press(page, note.locator("summary"));
    await expect(note.locator(".prose")).toContainText("65537 (0x00010001) fits.");
  });
});

test.describe("the written challenge", () => {
  const box = (page: Page) =>
    challenge(page, BUILD).getByRole("textbox", { name: V.editor.textLabel });
  const lines = (page: Page) => challenge(page, BUILD).locator(".asm-line-button");

  test("starts from the text that does not assemble, and says so against line 1", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, BUILD);
    await c.scrollIntoViewIfNeeded();
    await expect(box(page)).toHaveValue(ODOMETER_LIMIT_START_TEXT);
    await expect(c.locator(".asm-problems")).toContainText("Line 1");
    await expect(c.locator(".asm-problems")).toContainText("No single instruction can put");
    await press(page, runTests(c));
    await expect(status(c)).toHaveText(blocked);
    await expect(c.locator(".verdict.blocked")).toContainText(
      "Line 1: No single instruction can put 1000000 in a register.",
    );
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("is completed by typing, at the desktop width", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop", "typing is the desktop width's way in");
    const errors = watchErrors(page);
    await openLesson(page);
    const c = challenge(page, BUILD);
    await c.scrollIntoViewIfNeeded();
    await expect(box(page)).toHaveAttribute("autocapitalize", "off");
    await expect(box(page)).toHaveAttribute("autocorrect", "off");
    await expect(box(page)).toHaveAttribute("spellcheck", "false");
    await box(page).fill("");
    await box(page).pressSequentially(ODOMETER_LIMIT_TEXT);
    await expect(c.locator(".asm-problems")).toHaveCount(0);
    await runTests(c).click();
    await expect(status(c)).toHaveText(passing(1));
    await expect(c.locator(".challenge-complete")).toHaveText(complete);
    expect(errors).toEqual([]);
  });

  test("is completed by tapping alone, at the phone width", async ({ page }, info) => {
    test.skip(info.project.name !== "phone", "tapping is the phone width's way in");
    const errors = watchErrors(page);
    await openLesson(page);
    const c = challenge(page, BUILD);
    await c.scrollIntoViewIfNeeded();
    await c.getByRole("button", { name: V.editor.tap, exact: true }).tap();
    // No text box in this mode: nothing can be typed.
    await expect(c.getByRole("textbox")).toHaveCount(0);
    const chip = (group: string, name: string) =>
      c.getByRole("group", { name: group, exact: true }).getByRole("button", { name, exact: true });
    const pad = c.getByRole("group", { name: V.editor.numberPad, exact: true });
    const digits = async (text: string) => {
      for (const d of text) await pad.getByRole("button", { name: d, exact: true }).tap();
    };
    // The first line holds 1000000: take that number out and put the lower half in.
    await lines(page).first().tap();
    await pad.getByRole("button", { name: V.editor.clearNumber }).tap();
    await digits("16960");
    await expect(lines(page).first()).toContainText("mov w0, #16960");
    // A second line, below it, takes the upper half with movk.
    await c.getByRole("button", { name: V.editor.addBelow }).tap();
    await chip(V.editor.instruction, "movk").tap();
    await chip(V.editor.operand(1), "w0").tap();
    await digits("15");
    await chip(V.editor.operand(3), "lsl 16").tap();
    await expect(lines(page).nth(1)).toContainText("movk w0, #15, lsl 16");
    await expect(lines(page).nth(2)).toContainText("ret");
    await expect(c.locator(".asm-error")).toHaveCount(0);
    await runTests(c).tap();
    await expect(status(c)).toHaveText(passing(1));
    await expect(c.locator(".challenge-complete")).toHaveText(complete);
    expect((await stored(page, LESSON_ID)).challenges[BUILD].artifact.text).toBe(
      "mov w0, #16960\nmovk w0, #15, lsl 16\nret",
    );
    expect(errors).toEqual([]);
  });

  test("builds the whole answer from chips and the number pad, from nothing", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, BUILD);
    await c.scrollIntoViewIfNeeded();
    await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
    for (let k = 0; k < 2; k++) {
      await press(page, lines(page).first());
      await press(page, c.getByRole("button", { name: V.editor.remove }));
    }
    await press(page, c.getByRole("button", { name: V.editor.addFirst }));
    const chip = (group: string, name: string) =>
      c.getByRole("group", { name: group, exact: true }).getByRole("button", { name, exact: true });
    const pad = c.getByRole("group", { name: V.editor.numberPad, exact: true });
    await press(page, chip(V.editor.instruction, "mov"));
    await press(page, chip(V.editor.operand(1), "w0"));
    await press(page, chip(V.editor.operand(2), V.editor.number));
    for (const d of "16960") await press(page, pad.getByRole("button", { name: d, exact: true }));
    await press(page, c.getByRole("button", { name: V.editor.addBelow }));
    await press(page, chip(V.editor.instruction, "movk"));
    await press(page, chip(V.editor.operand(1), "w0"));
    for (const d of "15") await press(page, pad.getByRole("button", { name: d, exact: true }));
    await press(page, chip(V.editor.operand(3), "lsl 16"));
    await press(page, c.getByRole("button", { name: V.editor.addBelow }));
    await press(page, chip(V.editor.instruction, "ret"));
    await press(page, runTests(c));
    await expect(status(c)).toHaveText(passing(1));
  });

  test("offers only the instructions the lesson allows, and only w0", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, BUILD);
    await c.scrollIntoViewIfNeeded();
    await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
    await press(page, lines(page).first());
    await expect(
      c.getByRole("group", { name: V.editor.instruction, exact: true }).getByRole("button"),
    ).toHaveText(["mov", "movk", "ret"]);
    await expect(
      c.getByRole("group", { name: V.editor.operand(1), exact: true }).getByRole("button"),
    ).toHaveText(["w0"]);
    await expect(
      c
        .getByRole("group", { name: V.editor.operand(2), exact: true })
        .locator(".asm-chips")
        .getByRole("button"),
    ).toHaveText(["w0", V.editor.number]);
  });

  test("rejects the lower half alone, and says what w0 held", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, BUILD);
    await c.scrollIntoViewIfNeeded();
    await box(page).fill("mov w0, 16960\nret");
    await press(page, runTests(c));
    await expect(status(c)).toHaveText(failing(0, 1));
    await expect(c.locator(".verdict-failure").first()).toContainText("w0=16960");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("rejects a second mov, which replaces the whole register, and an instruction not yet met", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, BUILD);
    await c.scrollIntoViewIfNeeded();
    await box(page).fill("mov w0, 16960\nmov w0, 15\nret");
    await press(page, runTests(c));
    await expect(status(c)).toHaveText(failing(0, 1));
    await expect(c.locator(".verdict-failure").first()).toContainText("w0=15");
    await box(page).fill("mov w0, 16960\nadd w0, w0, 1\nret");
    // `add` is from Module 0, so the sentence says what this challenge allows, not that it is new.
    const allowedHere = message("gate.notAllowedHere", { allowed: "`mov`, `movk` and `ret`" });
    await expect(c.locator(".asm-problems")).toContainText(allowedHere.replaceAll("`", ""));
    await expect(c.locator(".asm-problems")).not.toContainText("not met");
    await press(page, runTests(c));
    await expect(status(c)).toHaveText(blocked);
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    // An instruction no lesson has introduced is still one the learner has not met.
    await box(page).fill("mov w0, 16960\nb done\nret");
    await expect(c.locator(".asm-problems")).toContainText("You have not met b yet");
  });

  test("offers a comma and w on the keyboard row, and w0 alone in the tap mode", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, BUILD);
    await c.scrollIntoViewIfNeeded();
    await press(page, c.getByRole("button", { name: V.editor.text, exact: true }));
    await expect(c.locator(".asm-bar .asm-key")).toHaveText([",", "w"]);
  });

  test("keeps a completion through a reload, grades it again, and is cleared back to the starting text", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, BUILD);
    await c.scrollIntoViewIfNeeded();
    await box(page).fill(ODOMETER_LIMIT_TEXT);
    await press(page, runTests(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.reload();
    await expect(challenge(page, BUILD).locator(".challenge-complete")).toBeVisible();
    await expect(box(page)).toHaveValue(ODOMETER_LIMIT_TEXT);
    // The work is what is kept: change it in storage to work that fails.
    await page.evaluate((k) => {
      const s = JSON.parse(localStorage.getItem(k)!);
      s.challenges["build-1000000"].artifact.text = "mov w0, 16960\nret";
      localStorage.setItem(k, JSON.stringify(s));
    }, `assembly-lab:v1:${LESSON_ID}`);
    await page.reload();
    await expect(challenge(page, BUILD).locator(".challenge-complete")).toHaveCount(0);
    await expect(status(challenge(page, BUILD))).toHaveText(failing(0, 1));
    const again = challenge(page, BUILD);
    await press(page, again.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, again.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(box(page)).toHaveValue(ODOMETER_LIMIT_START_TEXT);
    expect((await stored(page, LESSON_ID)).challenges[BUILD]).toBeUndefined();
  });
});

test.describe("the prediction about the lower name", () => {
  const halves = (page: Page) => page.locator("#ix-x3-halves");

  test("the register drawn as two halves stays shut until the prediction is checked", async ({
    page,
  }) => {
    await openLesson(page);
    await expect(halves(page).locator(".al-locked")).toBeVisible();
    await expect(halves(page).getByRole("button", { name: V.stepper.next })).toHaveCount(0);
    await commit(page, "predict-width", "The lower 32 bits set and the upper 32 cleared.");
    await expect(halves(page).locator(".al-locked")).toHaveCount(0);
  });

  for (const [option, match] of [
    ["All 64 bits set, as before.", false],
    ["The lower 32 bits set and the upper 32 cleared.", true],
    ["The lower 32 bits set and the upper 32 unknown.", false],
    ["The run stops with an error.", false],
  ] as const) {
    test(`commits before it reveals: "${option}" ${match ? "matches" : "does not match"} the run`, async ({
      page,
    }) => {
      await openLesson(page);
      const figure = page.locator("#ix-predict-width");
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator(".al-outcome")).toHaveCount(0);
      await figure.getByRole("radio", { name: option, exact: true }).check();
      await expect(figure.locator(".al-outcome")).toHaveCount(0);
      await press(page, figure.getByRole("button", { name: V.prediction.commit }));
      await expect(figure.locator(match ? ".al-match" : ".al-nomatch")).toContainText(
        match ? V.prediction.match : V.prediction.noMatch,
      );
      await expect(figure.locator(".al-outcome")).toContainText(
        "x3 held 0x00000000ffffffff when the run ended.",
      );
      await expect(figure.locator(".al-outcome .prose")).toContainText(
        "Writing a w name always clears the upper 32 bits of the x register.",
      );
    });
  }

  test("then shows x3 as the model has it after each step, in two halves of 32 bits", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-width", "The lower 32 bits set and the upper 32 cleared.");
    const figure = halves(page);
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-insn .al-text")).toHaveText([
      "mov x3, -1",
      "mov w3, -1",
      "ret",
    ]);
    await expect(figure.locator(".al-pane.al-c")).toHaveCount(0);
    await expect(figure.locator(".al-half-name")).toContainText([
      V.wide.upper,
      MODULE1_STRINGS.wide.lower,
    ]);
    await expect(figure.locator(".al-half-alias")).toHaveText("w3");
    const { program } = assemble(WIDTHS.listing.replace(/ C\d+$/gm, "") + "\n");
    const result = run(program!, { entry: TEXT_BASE });
    const hex = (k: number) =>
      `0x${BigInt.asUintN(64, stateAfter(result, k - 1).x[3]!)
        .toString(16)
        .padStart(16, "0")}`;
    const next = figure.getByRole("button", { name: V.stepper.next });
    const x3 = figure.locator('[data-register="x3"]');
    await expect(x3.locator(".al-reg-value")).toHaveText("0x0000000000000000");
    await expect(x3).toHaveAttribute("data-changed", "false");
    await press(page, next);
    await expect(x3.locator(".al-reg-value")).toHaveText(hex(1));
    await expect(x3.locator(".al-reg-value")).toHaveText("0xffffffffffffffff");
    await expect(x3).toHaveAttribute("data-changed", "true");
    await expect(x3.locator('[data-half="upper"] .al-bit[data-on="true"]')).toHaveCount(32);
    await expect(x3.locator('[data-half="lower"] .al-bit[data-on="true"]')).toHaveCount(32);
    await press(page, next);
    await expect(x3.locator(".al-reg-value")).toHaveText(hex(2));
    await expect(x3.locator(".al-reg-value")).toHaveText("0x00000000ffffffff");
    await expect(x3.locator('[data-half="upper"] .al-bit[data-on="true"]')).toHaveCount(0);
    await expect(x3.locator('[data-half="lower"] .al-bit[data-on="true"]')).toHaveCount(32);
    await press(page, next);
    await expect(x3.locator(".al-reg-value")).toHaveText(hex(3));
    await expect(next).toBeDisabled();
    await expect(figure.locator("[role=status]")).toContainText(V.stepper.ended);
    await press(page, figure.getByRole("button", { name: V.stepper.back }));
    await expect(x3.locator(".al-reg-value")).toHaveText("0x00000000ffffffff");
    await press(page, figure.getByRole("button", { name: V.stepper.reset }));
    await expect(x3.locator(".al-reg-value")).toHaveText("0x0000000000000000");
  });

  test("a commitment is kept, and is still there after a reload", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-width", "All 64 bits set, as before.");
    await page.reload();
    await expect(page.locator("#ix-predict-width .al-nomatch")).toBeVisible();
    await expect(halves(page).locator(".al-locked")).toHaveCount(0);
  });

  test("a register's two halves fit the screen", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-width", "All 64 bits set, as before.");
    const x3 = halves(page).locator('[data-register="x3"]');
    await x3.scrollIntoViewIfNeeded();
    const box = (await x3.boundingBox())!;
    const width = page.viewportSize()!.width;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    await expect(x3.locator(".al-bit")).toHaveCount(64);
  });
});

test.describe("the answers challenge", () => {
  const fill = async (page: Page, x1: string, w2: string) => {
    const c = challenge(page, TWO);
    await c.scrollIntoViewIfNeeded();
    await c.locator('[data-field="x1"] input').fill(x1);
    await c.locator('[data-field="w2"] input').fill(w2);
  };

  test("shows the four instructions and asks for two numbers", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, TWO);
    await c.scrollIntoViewIfNeeded();
    await expect(c.locator(".al-insn .al-text")).toHaveText(FOUR_INSTRUCTIONS.listing.split("\n"));
    await expect(c.locator(".al-pane.al-c")).toHaveCount(0);
    await expect(c.locator(".answer-field")).toHaveCount(2);
  });

  test("asks for both numbers before it grades anything", async ({ page }) => {
    await openLesson(page);
    const c = challenge(page, TWO);
    await c.scrollIntoViewIfNeeded();
    await c.locator('[data-field="x1"] input').fill("5");
    await press(page, runTests(c));
    await expect(status(c)).toHaveText(blocked);
    await expect(c.locator(".verdict.blocked")).toContainText("w2 at the end");
  });

  test("refuses a hexadecimal answer by saying the answer is written in decimal", async ({
    page,
  }) => {
    await openLesson(page);
    await fill(page, "0x5", "1000000");
    const c = challenge(page, TWO);
    await press(page, runTests(c));
    await expect(status(c)).toHaveText(blocked);
    await expect(c.locator(".verdict.blocked")).toHaveText(
      "The answer for x1 at the end must be a whole number written in decimal.",
    );
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("rejects x1 as it would be if writing w1 kept the upper half, a number of 64 bits", async ({
    page,
  }) => {
    await openLesson(page);
    await fill(page, String(0xffffffff00000005n), "1000000");
    const c = challenge(page, TWO);
    await press(page, runTests(c));
    await expect(status(c)).toHaveText(failing(1, 2));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["x1 at the end"]);
    await expect(c.locator(".verdict-detail")).toHaveText(V.readings.registerWrong("x1"));
    await expect(c.locator(".verdict")).not.toContainText("5 ");
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("rejects w2 as the lower half alone, and as a number of more than 32 bits", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, TWO);
    await fill(page, "5", "16960");
    await press(page, runTests(c));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["w2 at the end"]);
    await c.locator('[data-field="w2"] input').fill(String(1000000 + 2 ** 32));
    await press(page, runTests(c));
    await expect(c.locator(".verdict-failure h4")).toHaveText(["w2 at the end"]);
    await expect(c.locator(".verdict")).not.toContainText("1000000");
  });

  test("accepts the reference", async ({ page }) => {
    await openLesson(page);
    const answers = lesson.challenges.find((x) => x.id === TWO)!.reference.answers!;
    await fill(page, answers["x1"]!, answers["w2"]!);
    const c = challenge(page, TWO);
    await press(page, runTests(c));
    await expect(status(c)).toHaveText(passing(2));
    await expect(c.locator(".challenge-complete")).toHaveText(complete);
  });

  test("keeps a completion through a reload, grades it again, and goes when cleared", async ({
    page,
  }) => {
    await openLesson(page);
    await fill(page, "5", "1000000");
    const c = challenge(page, TWO);
    await press(page, runTests(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.reload();
    await expect(challenge(page, TWO).locator(".challenge-complete")).toBeVisible();
    await expect(challenge(page, TWO).locator('[data-field="w2"] input')).toHaveValue("1000000");
    await page.evaluate((k) => {
      const s = JSON.parse(localStorage.getItem(k)!);
      s.challenges["predict-two-registers"].artifact.answers.x1 = "4294967301";
      localStorage.setItem(k, JSON.stringify(s));
    }, `assembly-lab:v1:${LESSON_ID}`);
    await page.reload();
    await expect(challenge(page, TWO).locator(".challenge-complete")).toHaveCount(0);
    await expect(status(challenge(page, TWO))).toHaveText(failing(1, 2));
    const again = challenge(page, TWO);
    await press(page, again.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, again.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(again.locator('[data-field="x1"] input')).toHaveValue("");
    expect((await stored(page, LESSON_ID)).challenges[TWO]).toBeUndefined();
  });
});

test.describe("the halves of sixteen", () => {
  const figureOf = (page: Page, id: string) => page.locator(`#ix-${id}`);
  const halves = (figure: Locator) =>
    figure.locator(".al-h16").evaluateAll((els) =>
      els.map((h) => ({
        half: h.getAttribute("data-half"),
        digits: [...h.querySelectorAll(".al-h16-digit")].map((d) => d.textContent).join(""),
        bits: [...h.querySelectorAll(".al-bit")].map((b) => b.textContent).join(""),
        tag: (h.querySelector(".al-h16-tag")?.textContent ?? "").trim(),
      })),
    );
  const next = (figure: Locator) => figure.getByRole("button", { name: V.stepper.next });
  /** What w0 holds in the model after k instructions of a listing. */
  const w0After = (listing: string, k: number) => {
    const { program } = assemble(listing.replace(/ C\d+$/gm, "") + "\n");
    return BigInt.asUintN(32, stateAfter(run(program!, { entry: TEXT_BASE }), k - 1).x[0]!);
  };
  const hex4 = (n: bigint) => n.toString(16).padStart(8, "0");

  test("draws mov w0, 30000 as 0000 over 7530, the boundary between them, from the recorded listing", async ({
    page,
  }) => {
    await openLesson(page);
    const figure = figureOf(page, "service-halves");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-insn .al-text")).toHaveText(["mov w0, 30000", "ret"]);
    expect(await halves(figure)).toEqual([
      { half: "upper", digits: "0000", bits: "0".repeat(16), tag: "" },
      { half: "lower", digits: "0000", bits: "0".repeat(16), tag: "" },
    ]);
    await press(page, next(figure));
    const value = w0After(SERVICE_INTERVAL.listing, 1);
    expect(value).toBe(30000n);
    const [upper, lower] = await halves(figure);
    expect([upper!.digits, lower!.digits]).toEqual([hex4(value).slice(0, 4), hex4(value).slice(4)]);
    expect([upper!.digits, lower!.digits]).toEqual(["0000", "7530"]);
    expect(lower!.bits).toBe("0111010100110000");
    expect([upper!.tag, lower!.tag]).toEqual(["new", "new"]);
    await expect(figure.locator(".al-reg-hex")).toHaveText("0x00007530");
    await expect(registerValue(figure, "w0")).toHaveText("30000");
    await expect(figure.locator("[role=status]")).toContainText("Ran mov w0, 30000.");
  });

  test("draws the worked example: both halves new after the mov, then the upper new and the lower kept after the movk", async ({
    page,
  }) => {
    await openLesson(page);
    const figure = figureOf(page, "movk-halves");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-insn .al-text")).toHaveText([
      "mov w0, 3",
      "movk w0, 2, lsl 16",
      "ret",
    ]);
    await expect(figure.locator(".al-pane.al-c")).toHaveCount(0);
    await press(page, next(figure));
    expect((await halves(figure)).map((h) => [h.digits, h.tag])).toEqual([
      ["0000", "new"],
      ["0003", "new"],
    ]);
    expect(w0After(MOVK_EXAMPLE.listing, 1)).toBe(3n);
    await press(page, next(figure));
    expect((await halves(figure)).map((h) => [h.digits, h.tag])).toEqual([
      ["0002", "new"],
      ["0003", "kept"],
    ]);
    expect(hex4(w0After(MOVK_EXAMPLE.listing, 2))).toBe("00020003");
    await expect(figure.locator(".al-reg-hex")).toHaveText("0x00020003");
    await expect(registerValue(figure, "w0")).toHaveText("131075");
    await expect(figure.locator("[role=status]")).toContainText("Ran movk w0, 2, lsl 16.");
    // A new half has a solid outline and a kept one a dashed outline, besides their words.
    const lines = await figure
      .locator(".al-h16-groups")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).borderTopStyle));
    expect(lines).toEqual(["solid", "dashed"]);
    await press(page, figure.getByRole("button", { name: V.stepper.back }));
    expect((await halves(figure)).map((h) => [h.digits, h.tag])).toEqual([
      ["0000", "new"],
      ["0003", "new"],
    ]);
    await press(page, figure.getByRole("button", { name: V.stepper.reset }));
    expect((await halves(figure)).map((h) => h.tag)).toEqual(["", ""]);
  });

  test("writes each digit over its own four bits, and names the halves upper then lower", async ({
    page,
  }) => {
    await openLesson(page);
    const figure = figureOf(page, "service-halves");
    await figure.scrollIntoViewIfNeeded();
    await press(page, next(figure));
    const groups = await figure.locator(".al-h16-group").evaluateAll((els) =>
      els.map((g) => ({
        digit: g.querySelector(".al-h16-digit")!.textContent,
        bits: [...g.querySelectorAll(".al-bit")].map((b) => b.textContent).join(""),
        box: g.getBoundingClientRect().toJSON(),
        digitBox: g.querySelector(".al-h16-digit")!.getBoundingClientRect().toJSON(),
        bitsBox: g.querySelector(".al-h16-bits")!.getBoundingClientRect().toJSON(),
      })),
    );
    expect(groups).toHaveLength(8);
    for (const g of groups) {
      expect(parseInt(g.bits, 2).toString(16)).toBe(g.digit);
      // The digit is over its four bits, inside their width.
      expect(g.digitBox.y + g.digitBox.height).toBeLessThanOrEqual(g.bitsBox.y + 1);
      expect(g.digitBox.x + g.digitBox.width / 2).toBeGreaterThan(g.bitsBox.x);
      expect(g.digitBox.x + g.digitBox.width / 2).toBeLessThan(g.bitsBox.x + g.bitsBox.width);
    }
    await expect(figure.locator(".al-h16 .al-half-name")).toHaveText([
      MODULE1_STRINGS.register.upperHalf,
      MODULE1_STRINGS.register.lowerHalf,
    ]);
  });

  test("puts the halves side by side on a desk and one above the other on a phone, with a rule between them", async ({
    page,
  }, info) => {
    await openLesson(page);
    const figure = figureOf(page, "movk-halves");
    await figure.scrollIntoViewIfNeeded();
    const [upper, lower] = await figure
      .locator(".al-h16")
      .evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON()));
    if (info.project.name === "phone") {
      expect(lower.y).toBeGreaterThan(upper.y + upper.height - 1);
      expect(Math.abs(lower.x - upper.x)).toBeLessThan(2);
    } else {
      expect(lower.x).toBeGreaterThan(upper.x + upper.width - 1);
      expect(Math.abs(lower.y - upper.y)).toBeLessThan(2);
    }
    const phone = info.project.name === "phone";
    const rule = await figure
      .locator(".al-h16")
      .nth(1)
      .evaluate((e, onPhone) => {
        const cs = getComputedStyle(e);
        return onPhone
          ? [cs.borderTopStyle, cs.borderTopWidth]
          : [cs.borderLeftStyle, cs.borderLeftWidth];
      }, phone);
    expect(rule).toEqual(["solid", "2px"]);
    expect(await figureOverflow(page)).toEqual([]);
  });

  test("shows the same halves in the dark and the light theme, with a 1 and a 0 told apart", async ({
    page,
  }) => {
    for (const theme of ["light", "dark"] as const) {
      await page.goto("#/");
      await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      await page.reload();
      await openLesson(page);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const figure = figureOf(page, "service-halves");
      await figure.scrollIntoViewIfNeeded();
      await press(page, next(figure));
      const colours = await figure.evaluate((el) => {
        const on = el.querySelector('.al-bit[data-on="true"]')!;
        const off = el.querySelector('.al-bit[data-on="false"]')!;
        return [getComputedStyle(on).backgroundColor, getComputedStyle(off).backgroundColor];
      });
      expect(colours[0], theme).not.toBe(colours[1]);
      expect(await designProblems(page, page.viewportSize()!.width < 500), theme).toEqual([]);
    }
  });
});

test.describe("the stepper through the learner's own solution", () => {
  const box = (page: Page) =>
    challenge(page, BUILD).getByRole("textbox", { name: V.editor.textLabel });
  const stepper = (page: Page) => page.locator("#ix-solution-halves");
  const words = "Step through your solution below";
  const solve = async (page: Page, text: string) => {
    const c = challenge(page, BUILD);
    await c.scrollIntoViewIfNeeded();
    await box(page).fill(text);
    await press(page, runTests(c));
  };
  const halves = (figure: Locator) =>
    figure
      .locator(".al-h16")
      .evaluateAll((els) =>
        els.map(
          (h) =>
            `${[...h.querySelectorAll(".al-h16-digit")].map((d) => d.textContent).join("")} ${(h.querySelector(".al-h16-tag")?.textContent ?? "").trim()}`,
        ),
      );

  test("shows nothing of a solution, and not the words that introduce it, before Build 1000000 is passed", async ({
    page,
  }) => {
    await openLesson(page);
    await stepper(page).scrollIntoViewIfNeeded();
    await expect(stepper(page).locator(".al-locked")).toBeVisible();
    await expect(stepper(page).locator(".al-h16")).toHaveCount(0);
    await expect(stepper(page).locator(".al-insn")).toHaveCount(0);
    await expect(stepper(page).getByRole("button", { name: V.stepper.next })).toHaveCount(0);
    await expect(page.getByText(words)).toHaveCount(0);
    // The lower half alone is not a pass either.
    await solve(page, "mov w0, 16960\nret");
    await expect(stepper(page).locator(".al-locked")).toBeVisible();
    await expect(page.getByText(words)).toHaveCount(0);
    // The reference solution is not on the page for the learner, in the stepper or around it.
    await expect(stepper(page)).not.toContainText("movk");
    await expect(stepper(page)).not.toContainText("0xf");
  });

  test("opens when the usual solution passes, and steps it: the upper half new, the lower kept", async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page);
    await solve(page, ODOMETER_LIMIT_TEXT);
    await expect(challenge(page, BUILD).locator(".challenge-complete")).toBeVisible();
    await expect(page.getByText(words)).toBeVisible();
    const f = stepper(page);
    await f.scrollIntoViewIfNeeded();
    await expect(f.locator(".al-locked")).toHaveCount(0);
    await expect(f.locator(".al-insn .al-text")).toHaveText([
      "mov w0, 16960",
      "movk w0, 0xf, lsl 16",
      "ret",
    ]);
    expect(await halves(f)).toEqual(["0000 ", "0000 "]);
    const next = f.getByRole("button", { name: V.stepper.next });
    await press(page, next);
    expect(await halves(f)).toEqual(["0000 new", "4240 new"]);
    await press(page, next);
    expect(await halves(f)).toEqual(["000f new", "4240 kept"]);
    await expect(registerValue(f, "w0")).toHaveText("1000000");
    await expect(f.locator(".al-reg-hex")).toHaveText("0x000f4240");
    await expect(f.locator("[role=status]")).toContainText("Ran movk w0, 0xf, lsl 16.");
    await press(page, next);
    await expect(next).toBeDisabled();
    await expect(f.locator("[role=status]")).toContainText(V.stepper.ended);
    expect(await figureOverflow(page)).toEqual([]);
    expect(errors).toEqual([]);
  });

  test("steps a different passing solution, mov then movk then movk, as that solution runs", async ({
    page,
  }) => {
    await openLesson(page);
    await solve(page, "mov w0, 1\nmovk w0, 15, lsl 16\nmovk w0, 16960\nret");
    await expect(challenge(page, BUILD).locator(".challenge-complete")).toBeVisible();
    const f = stepper(page);
    await f.scrollIntoViewIfNeeded();
    await expect(f.locator(".al-insn .al-text")).toHaveText([
      "mov w0, 1",
      "movk w0, 15, lsl 16",
      "movk w0, 16960",
      "ret",
    ]);
    const next = f.getByRole("button", { name: V.stepper.next });
    const seen: string[][] = [];
    for (let i = 0; i < 3; i++) {
      await press(page, next);
      seen.push(await halves(f));
    }
    expect(seen).toEqual([
      ["0000 new", "0001 new"],
      ["000f new", "0001 kept"],
      ["000f kept", "4240 new"],
    ]);
  });

  test("steps a solution typed with # and written lower half first with movk, as the tap editor builds it", async ({
    page,
  }) => {
    await openLesson(page);
    await solve(page, "movk w0, #16960\nmovk w0, #15, lsl 16\nret");
    await expect(challenge(page, BUILD).locator(".challenge-complete")).toBeVisible();
    const f = stepper(page);
    await f.scrollIntoViewIfNeeded();
    const next = f.getByRole("button", { name: V.stepper.next });
    await press(page, next);
    expect(await halves(f)).toEqual(["0000 kept", "4240 new"]);
    await press(page, next);
    expect(await halves(f)).toEqual(["000f new", "4240 kept"]);
    await expect(registerValue(f, "w0")).toHaveText("1000000");
  });

  test("shuts again if the saved work stops passing, and opens from the saved work after a reload", async ({
    page,
  }) => {
    await openLesson(page);
    await solve(page, ODOMETER_LIMIT_TEXT);
    await expect(stepper(page).locator(".al-h16")).toHaveCount(2);
    await page.reload();
    await expect(stepper(page).locator(".al-h16")).toHaveCount(2);
    await expect(page.getByText(words)).toBeVisible();
    // What was kept is the work: change it in storage to a program that fails, and the page does
    // not believe the old completion.
    await page.evaluate((k) => {
      const s = JSON.parse(localStorage.getItem(k)!);
      s.challenges["build-1000000"].artifact.text = "mov w0, 16960\nret";
      localStorage.setItem(k, JSON.stringify(s));
    }, `assembly-lab:v1:${LESSON_ID}`);
    await page.reload();
    await expect(stepper(page).locator(".al-locked")).toBeVisible();
    await expect(stepper(page).locator(".al-h16")).toHaveCount(0);
    await expect(page.getByText(words)).toHaveCount(0);
  });

  test("goes when the work is cleared, with the words that introduce it", async ({ page }) => {
    await openLesson(page);
    await solve(page, ODOMETER_LIMIT_TEXT);
    await expect(page.getByText(words)).toBeVisible();
    const c = challenge(page, BUILD);
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(page.getByText(words)).toHaveCount(0);
    await expect(stepper(page).locator(".al-locked")).toBeVisible();
  });
});

test.describe("x3 and w3 as one register", () => {
  const figure = (page: Page) => page.locator("#ix-x3-halves");
  const half = (page: Page, which: string) =>
    figure(page).locator(`[data-register="x3"] [data-half="${which}"]`);
  const tag = (page: Page, which: string) => half(page, which).locator(".al-half-tag");
  const next = (page: Page) => figure(page).getByRole("button", { name: V.stepper.next });

  test("is headed x3: 64 bits, with the halves Upper 32 bits and Lower 32 bits, and w3 marking the lower", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-width", "The lower 32 bits set and the upper 32 cleared.");
    await figure(page).scrollIntoViewIfNeeded();
    await expect(figure(page).locator(".al-wide-named .al-reg-name")).toHaveText(
      MODULE1_STRINGS.wide.heading("x3"),
    );
    await expect(figure(page).locator(".al-wide-named .al-reg-name")).toHaveText("x3: 64 bits");
    await expect(half(page, "upper").locator(".al-half-name")).toContainText("Upper 32 bits");
    await expect(half(page, "lower").locator(".al-half-name")).toContainText("Lower 32 bits");
    await expect(half(page, "lower").locator(".al-half-alias")).toHaveText("w3");
    await expect(half(page, "upper").locator(".al-half-alias")).toHaveCount(0);
    // One register: one box holds both halves, and nothing else is named w3 or x3.
    await expect(figure(page).locator("[data-register]")).toHaveCount(1);
    const box = (await figure(page).locator('[data-register="x3"]').boundingBox())!;
    for (const which of ["upper", "lower"]) {
      const h = (await half(page, which).boundingBox())!;
      expect(h.x).toBeGreaterThanOrEqual(box.x - 1);
      expect(h.x + h.width).toBeLessThanOrEqual(box.x + box.width + 1);
      expect(h.y).toBeGreaterThanOrEqual(box.y - 1);
      expect(h.y + h.height).toBeLessThanOrEqual(box.y + box.height + 1);
    }
  });

  test("says in words what each step did: both halves written, then the upper cleared and the lower written", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-width", "The lower 32 bits set and the upper 32 cleared.");
    await figure(page).scrollIntoViewIfNeeded();
    const note = figure(page).locator(".al-wide-note");
    await expect(tag(page, "upper")).toHaveText("");
    await expect(note).toHaveText("");
    await press(page, next(page));
    await expect(tag(page, "upper")).toHaveText("written");
    await expect(tag(page, "lower")).toHaveText("written");
    await expect(note).toHaveText("");
    await press(page, next(page));
    await expect(tag(page, "upper")).toHaveText("cleared");
    await expect(tag(page, "lower")).toHaveText("written");
    await expect(note).toHaveText("Writing w3 cleared the upper 32 bits of x3.");
    await expect(figure(page).locator('[data-register="x3"] .al-reg-value')).toHaveText(
      "0x00000000ffffffff",
    );
    // A cleared half is outlined with a dashed line, a written one with a solid line.
    const lines = await figure(page)
      .locator("[data-half]")
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).borderTopStyle));
    expect(lines).toEqual(["dashed", "solid"]);
    await press(page, next(page));
    await expect(note).toHaveText("");
  });

  test("keeps the halves labelled, one above the other, on a phone, and inside the box", async ({
    page,
  }, info) => {
    await openLesson(page);
    await commit(page, "predict-width", "The lower 32 bits set and the upper 32 cleared.");
    await figure(page).scrollIntoViewIfNeeded();
    await press(page, next(page));
    await press(page, next(page));
    const upper = (await half(page, "upper").boundingBox())!;
    const lower = (await half(page, "lower").boundingBox())!;
    if (info.project.name === "phone") expect(lower.y).toBeGreaterThan(upper.y + upper.height - 2);
    await expect(half(page, "upper").locator(".al-half-name")).toBeVisible();
    await expect(half(page, "lower").locator(".al-half-name")).toBeVisible();
    expect(await figureOverflow(page)).toEqual([]);
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
  });
});

test.describe("the closed notes and the closing question", () => {
  const note = (page: Page, kind: string) =>
    page.locator(`section.lesson-section[data-kind="${kind}"] details.lesson-details`);

  test("has the compiler note shut at the start, and opens it", async ({ page }) => {
    await openLesson(page);
    const n = note(page, "question");
    await expect(n.locator("summary")).toHaveText("Which compiler?");
    await expect(n).not.toHaveAttribute("open", "");
    await expect(n.locator(".prose")).toBeHidden();
    await press(page, n.locator("summary"));
    await expect(n.locator(".prose")).toContainText("GCC 16.1");
    await expect(n.locator(".prose")).toContainText("-O1");
  });

  test("closes with what you now know, the question about x5, and its answer shut", async ({
    page,
  }) => {
    await openLesson(page);
    const last = page.locator('section.lesson-section[data-kind="reflection"]');
    await last.scrollIntoViewIfNeeded();
    await expect(last.locator(".section-title")).toHaveText("What you now know");
    await expect(last.locator(".prose").first()).toContainText("mov w5, 7");
    const answer = note(page, "reflection");
    await expect(answer.locator("summary")).toHaveText("Answer");
    await expect(answer.locator(".prose")).toBeHidden();
    await press(page, answer.locator("summary"));
    await expect(answer.locator(".prose")).toContainText("x5 holds 7.");
    // The model agrees.
    const { program } = assemble("mov x5, -1\nmov w5, 7\nret\n");
    expect(run(program!, { entry: TEXT_BASE }).final.x[5]).toBe(7n);
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

  test("and so are the figures once they have been used, the tap editor open and verdicts shown", async ({
    page,
  }, info) => {
    const phone = info.project.name === "phone";
    await openLesson(page);
    await commit(page, "predict-fits", "1000000");
    const tester = page.locator("#ix-try-a-number");
    await tester.getByRole("textbox", { name: V.tester.input }).fill("1000000");
    await expect(tester.locator(".al-nomatch")).toBeVisible();
    await press(page, page.locator("section[data-kind='investigation'] details summary"));
    await commit(page, "predict-width", "All 64 bits set, as before.");
    const halves = page.locator("#ix-x3-halves");
    await press(page, halves.getByRole("button", { name: V.stepper.next }));
    const build = challenge(page, BUILD);
    await press(page, build.getByRole("button", { name: V.editor.tap, exact: true }));
    await press(page, build.locator(".asm-line-button").first());
    await press(page, runTests(build));
    await press(page, build.getByRole("button", { name: /Show hint/ }));
    const two = challenge(page, TWO);
    await two.locator('[data-field="x1"] input').fill("1");
    await two.locator('[data-field="w2"] input').fill("2");
    await press(page, runTests(two));
    expect(await designProblems(page, phone)).toEqual([]);
    expect(await figureOverflow(page)).toEqual([]);
    // The text mode too, with a problem listed.
    await press(page, build.getByRole("button", { name: V.editor.text, exact: true }));
    await build.getByRole("textbox", { name: V.editor.textLabel }).fill("add w0, w0, 1");
    expect(await designProblems(page, phone)).toEqual([]);
  });

  test("the tester with the longest result, w0 drawn as 32 bits, fits the width of the screen", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-fits", "65536");
    const tester = page.locator("#ix-try-a-number");
    await tester.getByRole("textbox", { name: V.tester.input }).fill("-1");
    await expect(tester.locator('[data-register="w0"] .al-bit')).toHaveCount(32);
    expect(await figureOverflow(page)).toEqual([]);
  });
});

test.describe("both themes", () => {
  for (const theme of ["light", "dark"] as const) {
    test(`the register in halves is drawn in the ${theme} theme, with filled and empty bits told apart`, async ({
      page,
    }) => {
      await page.goto("#/");
      await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      await page.reload();
      await openLesson(page);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await commit(page, "predict-width", "All 64 bits set, as before.");
      const figure = page.locator("#ix-x3-halves");
      await press(page, figure.getByRole("button", { name: V.stepper.next }));
      await press(page, figure.getByRole("button", { name: V.stepper.next }));
      const colours = await figure.evaluate((el) => {
        const on = el.querySelector('.al-bit[data-on="true"]')!;
        const off = el.querySelector('.al-bit[data-on="false"]')!;
        return [getComputedStyle(on).backgroundColor, getComputedStyle(off).backgroundColor];
      });
      expect(colours[0]).not.toBe(colours[1]);
      expect(await designProblems(page, page.viewportSize()!.width < 500)).toEqual([]);
    });
  }
});
