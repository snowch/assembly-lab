// Copyright © 2026 Christopher Snow

// Module 2 after the carries were drawn where they matter, in a browser, on the built site, at desktop
// and phone widths, and at 360 pixels. The adder steps by column, by group of four and all at once,
// and reaches the same state each way; the column just worked and the carries at bit 31 are the
// model's; the flags challenge is three groups of choices, names a wrong flag and keeps the answers
// the learner chose; the stepper marks what changed and says what an add left alone; the ring's strip
// shows the two stretches and their total; the two subtraction figures open at their final states;
// and nothing is shown before the prediction or the challenge it follows.

import { expect, test, type Locator, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { ARITH_STRINGS as A } from "../../packages/views/src/strings.arith";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { additionSteps, bitAt } from "../../packages/views/src/arith";
import { traceOf } from "../../packages/views/src/trace";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";

import { PLUS } from "../../content/lessons/adding-and-the-flags.listings";
import { designProblems } from "./design";

const ONE = "adding-and-the-flags";
const TWO = "subtracting-and-the-tick-counter";
const lesson = (id: string) => LESSONS.find((l) => l.id === id)!;

async function openLesson(page: Page, id: string): Promise<void> {
  await page.goto(`#/lesson/${id}`);
  await expect(page.locator("section.lesson-section")).toHaveCount(10);
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

/** The page's pointer: a tap on the phone project, a click with a mouse. */
async function press(_page: Page, target: Locator): Promise<void> {
  if (test.info().project.name === "phone") await target.tap();
  else await target.click();
}

async function commit(page: Page, id: string, option: string | RegExp): Promise<Locator> {
  const figure = page.locator(`#ix-${id}`);
  await figure.scrollIntoViewIfNeeded();
  await figure.getByRole("radio", { name: option }).check();
  await figure.getByRole("button", { name: V.prediction.commit }).click();
  return figure;
}

const challenge = (page: Page, id: string) =>
  page.locator(`section.challenge[data-challenge="${id}"]`);
const run = (c: Locator) => c.getByRole("button", { name: S.challenge.run });
const flagValues = (figure: Locator) =>
  figure.locator(".al-flag").evaluateAll((els) => els.map((e) => e.getAttribute("data-value")));

/** What the grid of an adder shows: every cell's value, row by row, and the flags. */
const gridOf = (figure: Locator) =>
  figure.evaluate((el) => ({
    cells: [...el.querySelectorAll(".al-adder-cell[data-row]")].map(
      (c) =>
        `${c.getAttribute("data-row")}${c.getAttribute("data-col")}=${c.getAttribute("data-value")}`,
    ),
    flags: [...el.querySelectorAll(".al-flag")].map((f) => f.getAttribute("data-value")),
    panel: el.querySelector(".al-adder-final")?.textContent ?? null,
    done: el.querySelector(".al-adder")?.getAttribute("data-done") ?? null,
  }));

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

test.describe("lesson 1, the adder by column, by group and all at once", () => {
  const record = additionSteps(traceOf(PLUS, { entry: "plus", args: [0x7fffffff, 1] }))[0]!
    .addition!;

  test("a group move says which columns it worked, and reaches the state 32 single steps reach", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    await commit(page, "predict-readings", "Only the unsigned");
    const adder = page.locator("#ix-add-columns");
    await adder.scrollIntoViewIfNeeded();
    const group = adder.getByRole("button", { name: A.adder.nextGroup });
    await press(page, group);
    await expect(adder.locator("[role=status]")).toContainText("Columns 0 to 3 worked.");
    await press(page, group);
    await expect(adder.locator("[role=status]")).toContainText("Columns 4 to 7 worked.");
    for (let i = 0; i < 6; i++) await press(page, group);
    const byGroups = await gridOf(adder);
    expect(byGroups.done).toBe("32");
    await press(page, adder.getByRole("button", { name: A.adder.reset }));
    for (let i = 0; i < 32; i++)
      await press(page, adder.getByRole("button", { name: A.adder.next }));
    expect(await gridOf(adder)).toEqual(byGroups);
    await press(page, adder.getByRole("button", { name: A.adder.reset }));
    await press(page, adder.getByRole("button", { name: A.adder.all }));
    expect(await gridOf(adder)).toEqual(byGroups);
  });

  test("the column just worked is the model's, and Back restores the column before", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    await commit(page, "predict-readings", "Only the unsigned");
    const adder = page.locator("#ix-add-columns");
    await adder.scrollIntoViewIfNeeded();
    const next = adder.getByRole("button", { name: A.adder.next });
    const calc = (key: string) => adder.locator(`.al-adder-calc [data-calc="${key}"] dd`);
    for (let column = 0; column < 6; column++) await press(page, next);
    await expect(adder.locator(".al-adder-calc-head")).toHaveText("Column 5");
    await expect(calc("carry-in")).toHaveText(String(bitAt(record.carries, 5)));
    await expect(calc("a")).toHaveText(String(bitAt(record.a, 5)));
    await expect(calc("b")).toHaveText(String(bitAt(record.b, 5)));
    await expect(calc("kept")).toHaveText(String(bitAt(record.result, 5)));
    await expect(calc("carry-out")).toHaveText(String(bitAt(record.carries, 6)));
    await press(page, adder.getByRole("button", { name: A.adder.back }));
    await expect(adder.locator(".al-adder-calc-head")).toHaveText("Column 4");
    await expect(calc("carry-in")).toHaveText(String(bitAt(record.carries, 4)));
  });

  test("the carries at bit 31 and the lines for C and V show only when column 31 is done, and bit 31 is labelled", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    await commit(page, "predict-readings", "Only the unsigned");
    const adder = page.locator("#ix-add-columns");
    await adder.scrollIntoViewIfNeeded();
    await expect(adder.locator(".al-adder-final")).toHaveCount(0);
    await expect(adder.locator('[data-mark="top"]')).toHaveText("bit 31");
    await expect(adder.locator('[data-mark="low"]')).toHaveText("bit 0");
    await expect(adder.locator('[data-row="sum"][data-col="31"]')).toHaveAttribute(
      "data-top-bit",
      "true",
    );
    for (let i = 0; i < 7; i++)
      await press(page, adder.getByRole("button", { name: A.adder.nextGroup }));
    await expect(adder.locator(".al-adder-final")).toHaveCount(0);
    await press(page, adder.getByRole("button", { name: A.adder.nextGroup }));
    const line = (key: string) => adder.locator(`.al-adder-final [data-line="${key}"]`);
    await expect(line("into")).toHaveText("Carry into bit 31: 1");
    await expect(line("out")).toHaveText("Carry out of bit 31: 0");
    await expect(line("c")).toHaveText("C = 0: no carry left bit 31, so the unsigned result fits");
    await expect(line("v")).toHaveText(
      "V = 1: the carries differ (1 in, 0 out), so the signed result does not fit",
    );
    expect(await flagValues(adder)).toEqual(["1", "0", "0", "1"]);
  });

  test("keeps its 33 places aligned at 360 pixels, with no sideways scroll, in every row", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openLesson(page, ONE);
    await commit(page, "predict-readings", "Only the unsigned");
    const adder = page.locator("#ix-add-columns");
    await adder.scrollIntoViewIfNeeded();
    for (let i = 0; i < 3; i++)
      await press(page, adder.getByRole("button", { name: A.adder.nextGroup }));
    await press(page, adder.getByRole("button", { name: A.adder.all }));
    // Every row's place for each column sits at one x, to a pixel, so the columns line up.
    const xs = await adder.evaluate((el) => {
      const out: Record<string, number[]> = {};
      for (const c of el.querySelectorAll(".al-adder-cell[data-row][data-col]")) {
        const col = c.getAttribute("data-col")!;
        (out[col] ??= []).push(Math.round(c.getBoundingClientRect().left));
      }
      return out;
    });
    expect(Object.keys(xs)).toHaveLength(33);
    for (const [col, values] of Object.entries(xs)) {
      if (col === "32") continue;
      expect(Math.max(...values) - Math.min(...values), `column ${col}`).toBeLessThanOrEqual(1);
    }
    const box = (await adder.locator('[data-row="carry"] .al-adder-cells').boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(360);
    expect(await designProblems(page, true)).toEqual([]);
  });

  for (const theme of ["light", "dark"] as const) {
    test(`shows the figure, the calculation and the panel in the ${theme} theme`, async ({
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
        const paint = (selector: string, prop: "backgroundColor" | "borderLeftColor") =>
          getComputedStyle(el.querySelector(selector)!)[prop];
        return {
          panelC: paint('.al-adder-final [data-line="c"]', "borderLeftColor"),
          panelInto: paint('.al-adder-final [data-line="into"]', "borderLeftColor"),
          calc: paint(".al-adder-calc", "backgroundColor"),
          page: getComputedStyle(document.body).backgroundColor,
        };
      });
      // The two lines for C and V are set apart from the two carries by a line colour as well as bold.
      expect(colours.panelC).not.toBe(colours.panelInto);
      expect(colours.calc).not.toBe(colours.page);
    });
  }
});

test.describe("lesson 1, the flags challenge in groups", () => {
  test("is three groups, one for each addition, each with a row of N, Z, C and V, none chosen", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    const c = challenge(page, "predict-flags");
    await c.scrollIntoViewIfNeeded();
    const groups = c.locator("fieldset.answer-group");
    await expect(groups).toHaveCount(3);
    await expect(groups.locator(":scope > legend")).toHaveText([
      "0xffffffff plus 1",
      "5 plus 3",
      "0x80000000 plus 0x80000000",
    ]);
    for (let g = 0; g < 3; g++)
      await expect(groups.nth(g).locator(".answer-compact > legend")).toHaveText([
        "N",
        "Z",
        "C",
        "V",
      ]);
    await expect(c.locator("input[type=radio]:checked")).toHaveCount(0);
  });

  test("names each wrong flag with its rule, never its value, and keeps the answers chosen when the learner tries again", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    const c = challenge(page, "predict-flags");
    await c.scrollIntoViewIfNeeded();
    const wrong = { ...ANSWERS, "third-c": "0", "third-v": "0", "second-n": "1" };
    await choose(page, c, wrong);
    await press(page, run(c));
    await expect(c.locator(".verdict-failure h4")).toHaveText([
      "5 plus 3",
      "0x80000000 plus 0x80000000",
    ]);
    const details = c.locator(".verdict-failure .verdict-detail");
    await expect(details.nth(0)).toHaveText(A.grader.flagRuleLine("N", A.grader.flagRule.n));
    await expect(details.nth(1)).toHaveText(
      `${A.grader.flagRuleLine("C", A.grader.flagRule.c)} ${A.grader.flagRuleLine("V", A.grader.flagRule.v)}`,
    );
    // The answers that were right stay chosen, and so do the wrong ones, to be mended.
    for (const [id, value] of Object.entries(wrong))
      await expect(c.locator(`[data-field="${id}"] input[value="${value}"]`), id).toBeChecked();
    await choose(page, c, { "second-n": "0", "third-c": "1", "third-v": "1" });
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
  });

  test("shows the text after the flags challenge only once it passes, with the adder it opens", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    const adder = page.locator("#ix-add-carry-out");
    const c = challenge(page, "predict-flags");
    await adder.scrollIntoViewIfNeeded();
    await expect(adder.locator(".al-adder-note")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText(
      "C and V are separate tests, one for each",
    );
    await c.scrollIntoViewIfNeeded();
    await choose(page, c, { ...ANSWERS, "third-v": "0" });
    await press(page, run(c));
    await expect(adder.locator(".al-adder-note")).toHaveCount(0);
    await choose(page, c, ANSWERS);
    await press(page, run(c));
    await expect(adder.locator(".al-adder-note")).toContainText(
      "C and V are separate tests, one for each reading",
    );
    await adder.scrollIntoViewIfNeeded();
    await press(page, adder.getByRole("button", { name: A.adder.all }));
    await expect(adder.locator('.al-adder-final [data-line="v"]')).toHaveText(
      A.adder.final.v(0, 1, 1),
    );
  });
});

test.describe("lesson 1, add against adds", () => {
  test("marks what changed by an outline and a word, and says what the add left alone only after it", async ({
    page,
  }) => {
    await openLesson(page, ONE);
    await commit(page, "predict-add-flags", /^N and C are still 1/);
    const stepper = page.locator("#ix-step-add");
    await stepper.scrollIntoViewIfNeeded();
    const next = stepper.getByRole("button", { name: V.stepper.next });
    const status = stepper.locator("[role=status]");
    const taggedRegisters = () =>
      stepper
        .locator(".al-reg-tag")
        .evaluateAll((els) => els.map((e) => e.closest(".al-reg")?.getAttribute("data-register")));
    const taggedFlags = () =>
      stepper
        .locator(".al-flag-tag")
        .evaluateAll((els) => els.map((e) => e.closest(".al-flag")?.getAttribute("data-flag")));
    await expect(stepper.locator(".al-reg-tag, .al-flag-tag")).toHaveCount(0);
    await press(page, next);
    expect(await taggedRegisters()).toEqual(["w3"]);
    expect(await taggedFlags()).toEqual(["n", "c"]);
    await expect(stepper.locator(".al-flag[data-changed='true']")).toHaveCount(2);
    await expect(status).not.toContainText("were not updated");
    await press(page, next);
    expect(await taggedRegisters()).toEqual(["w0"]);
    expect(await taggedFlags()).toEqual([]);
    await expect(stepper.locator(".al-flag[data-changed='true']")).toHaveCount(0);
    await expect(status).toContainText("w0 changed. N, Z, C and V were not updated by add.");
    await press(page, next);
    await expect(status).not.toContainText("were not updated");
    // The flags say what they record.
    await expect(stepper.locator(".al-flag-explain")).toHaveText([
      "top bit",
      "result is zero",
      "carry out",
      "signed overflow",
    ]);
  });

  test("keeps the stepper legible at 360 pixels, the four flags in two rows of two", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openLesson(page, ONE);
    await commit(page, "predict-add-flags", /^N and C are still 1/);
    const stepper = page.locator("#ix-step-add");
    await press(page, stepper.getByRole("button", { name: V.stepper.next }));
    await stepper.scrollIntoViewIfNeeded();
    const rows = await stepper
      .locator(".al-flag")
      .evaluateAll((els) => [
        ...new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))),
      ]);
    expect(rows).toHaveLength(2);
    expect(await designProblems(page, true)).toEqual([]);
  });
});

test.describe("lesson 2, the ring's strip and the subtraction figures", () => {
  test("the strip shows then, the wrap, now, the ticks before and after it and the total, counting forward", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    await expect(page.locator("#ix-counter-ring .al-locked")).toBeVisible();
    await commit(page, "predict-elapsed", /^2000$/);
    const ring = page.locator("#ix-counter-ring");
    await ring.scrollIntoViewIfNeeded();
    const svg = ring.locator("svg");
    await expect(svg).toContainText("4294966296");
    await expect(svg.locator('[data-mark="wrap"]')).toContainText("4294967295 to 0");
    await expect(svg.locator('[data-segment="before"]')).toHaveText("1000");
    await expect(svg.locator('text[data-segment="after"]')).toHaveText("1000");
    await expect(svg.locator('[data-segment="total"]')).toHaveText(
      `2000 ${A.ring.ticks} ${A.ring.inAll}`,
    );
    await expect(svg).toContainText(A.ring.direction);
    await expect(svg).toContainText(`${A.ring.ticks} ${A.ring.beforeWrap}`);
    await expect(svg).toContainText(`${A.ring.ticks} ${A.ring.afterWrap}`);
    await expect(page.locator("main")).not.toContainText(/how many (times|wraps) the counter/);
  });

  test("the strip fits 360 pixels, and the text in it is no smaller than 11 pixels once scaled", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openLesson(page, TWO);
    await commit(page, "predict-elapsed", /^2000$/);
    const ring = page.locator("#ix-counter-ring");
    await ring.scrollIntoViewIfNeeded();
    const sizes = await ring.locator("svg").evaluate((svg) => {
      const scale = svg.getBoundingClientRect().width / 320;
      return [...svg.querySelectorAll("text")].map(
        (t) => parseFloat(getComputedStyle(t).fontSize) * scale,
      );
    });
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(11);
    const box = (await ring.locator("svg").boundingBox())!;
    expect(box.x + box.width).toBeLessThanOrEqual(360);
    expect(await designProblems(page, true)).toEqual([]);
  });

  for (const d of [
    {
      id: "subtract-wrapped",
      c: "C = 0: a borrow was needed",
      result: "Result: 0x000007d0, which is 2000",
    },
    { id: "subtract-no-wrap", c: "C = 1: no borrow", result: "Result: 0x00001964, which is 6500" },
  ]) {
    test(`${d.id} opens at its final state, with the second operand as given and then changed`, async ({
      page,
    }) => {
      await openLesson(page, TWO);
      const figure = page.locator(`#ix-${d.id}`);
      await expect(figure.locator(".al-locked")).toBeVisible();
      await expect(figure.locator(".al-adder-final")).toHaveCount(0);
      await commit(page, "predict-elapsed", /^2000$/);
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator('.al-adder-final [data-line="result"]')).toHaveText(d.result);
      await expect(figure.locator('.al-adder-final [data-line="c"]')).toHaveText(d.c);
      await expect(figure.locator('.al-adder-row[data-row="b-given"]')).toBeVisible();
      await expect(figure.locator('.al-adder-row[data-row="b"]')).toContainText(
        A.adder.turnedOver("w1"),
      );
      // The result and C come before the grid in the figure: it opens on its final state.
      const order = await figure.evaluate((el) => {
        const a = el.querySelector(".al-adder-final")!.getBoundingClientRect().top;
        const b = el.querySelector(".al-adder-rows")!.getBoundingClientRect().top;
        return a < b;
      });
      expect(order).toBe(true);
    });
  }

  test("the two subtraction figures keep their rows inside 360 pixels, one under the other, with no sideways scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openLesson(page, TWO);
    await commit(page, "predict-elapsed", /^2000$/);
    for (const id of ["subtract-wrapped", "subtract-no-wrap"]) {
      const figure = page.locator(`#ix-${id}`);
      await figure.scrollIntoViewIfNeeded();
      await press(page, figure.getByRole("button", { name: A.adder.reset }));
      await press(page, figure.getByRole("button", { name: A.adder.nextGroup }));
      const box = (await figure.locator('[data-row="b-given"] .al-adder-cells').boundingBox())!;
      expect(box.x + box.width).toBeLessThanOrEqual(360);
    }
    expect(await designProblems(page, true)).toEqual([]);
  });

  test("the negs explanation and its three lines come only after the prediction is checked", async ({
    page,
  }) => {
    await openLesson(page, TWO);
    const figure = page.locator("#ix-predict-negs");
    await figure.scrollIntoViewIfNeeded();
    await expect(page.locator("main")).not.toContainText("the largest signed 32-bit value");
    await figure.getByRole("radio", { name: /unchanged/ }).check();
    await expect(page.locator("main")).not.toContainText("the largest signed 32-bit value");
    await figure.getByRole("button", { name: V.prediction.commit }).click();
    await expect(figure.locator(".al-outcome pre")).toContainText(
      "the largest signed 32-bit value   +2147483647",
    );
    await expect(figure.locator(".al-outcome pre")).toContainText("−2147483648");
  });

  test("the closed answer to the last question stays closed until it is opened", async ({
    page,
  }) => {
    for (const id of [ONE, TWO]) {
      await openLesson(page, id);
      const answer = page.locator('section[data-kind="reflection"] details.lesson-details');
      await expect(answer).not.toHaveAttribute("open", "");
      await expect(answer.locator("summary")).toHaveText("Answer");
      await press(page, answer.locator("summary"));
      await expect(answer).toHaveAttribute("open", "");
      await expect(answer).toContainText(id === ONE ? "C is 1 and V is 0" : "592, and C is 0");
    }
  });

  test("the adder after the construction challenge opens only once elapsed passes, and says what the subtraction kept", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "desktop", "typing is the desktop width's way in");
    await openLesson(page, TWO);
    const own = page.locator("#ix-subtract-own");
    const c = challenge(page, "write-elapsed");
    await own.scrollIntoViewIfNeeded();
    await expect(own.locator(".al-locked")).toBeVisible();
    await expect(own.locator(".al-adder-note")).toHaveCount(0);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await box.fill("add w0, w0, w1\nret");
    await run(c).click();
    await expect(own.locator(".al-locked")).toBeVisible();
    await box.fill("sub w0, w0, w1\nret");
    await run(c).click();
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await expect(own.locator(".al-locked")).toHaveCount(0);
    await expect(own.locator(".al-adder-note")).toContainText(
      "A single 32-bit subtraction keeps the low 32 bits of now - then.",
    );
    await expect(own.locator('.al-adder-final [data-line="result"]')).toHaveText(
      "Result: 0x000001f4, which is 500",
    );
    await expect(own.locator('.al-adder-final [data-line="c"]')).toHaveText(
      "C = 0: a borrow was needed",
    );
    // The task shown next to the editor says where the operands arrive, and not the answer.
    await expect(c.locator(".challenge-task")).toContainText(
      "now arrives in w0, then arrives in w1, and the result goes back in w0.",
    );
    expect(lesson(TWO).challenges.find((x) => x.id === "write-elapsed")!.task).not.toContain(
      "sub w0, w0, w1",
    );
  });
});
