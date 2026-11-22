// Copyright © 2026 Christopher Snow

// Module 2 after the carries were drawn where they matter, in a browser, on the built site, at desktop
// and phone widths, and at 360 pixels. The adder steps by column, by group of four and all at once,
// and reaches the same state each way; the column just worked and the carries at bit 31 are the
// model's; the flags challenge is three groups of choices, names a wrong flag and keeps the answers
// the learner chose; the stepper marks what changed and says what an add left alone; the ring's strip
// shows the two stretches and their total; the focused carry example opens at its final state;
// and nothing is shown before the prediction or the challenge it follows.

import { expect, test, type Locator, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { ARITH_STRINGS as A } from "../../packages/views/src/strings.arith";

import { SUBTRACTION_FOCUS_COPY as FOCUS } from "../../content/lessons/subtraction-flags-and-negation.copy";
import { designProblems } from "./design";

const TWO = "subtracting-and-the-tick-counter";
const lesson = (id: string) => LESSONS.find((l) => l.id === id)!;

async function openLesson(page: Page, id: string): Promise<void> {
  await page.goto(`#/lesson/${id}`);
  await expect(page.locator("section.lesson-section")).toHaveCount(lesson(id).sections.length);
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

test.describe("lesson 1, add against adds", () => {
  test("marks what changed by an outline and a word, and says what the add left alone only after it", async ({
    page,
  }) => {
    await openLesson(page, "flags-and-overflow");
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
    await expect(status).toContainText("w0 was written. N, Z, C and V were not updated by add.");
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
    await openLesson(page, "flags-and-overflow");
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
    await openLesson(page, "subtracting-and-the-tick-counter");
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
    await openLesson(page, "subtracting-and-the-tick-counter");
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
      id: "carry-means-no-borrow",
      c: "C = 1: no borrow",
      result: "Result: 0x00000005, which is 5",
    },
  ]) {
    test(`${d.id} opens at its final state, with the second operand as given and then changed`, async ({
      page,
    }) => {
      await openLesson(page, "subtraction-flags-and-negation");
      const figure = page.locator(`#ix-${d.id}`);
      await expect(figure.locator(".al-locked")).toHaveCount(0);
      await expect(figure.locator(".al-adder-final")).toBeVisible();
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

  test("the focused carry diagram keeps its rows inside 360 pixels with no sideways page scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openLesson(page, "subtraction-flags-and-negation");
    for (const id of ["carry-means-no-borrow"]) {
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
    await openLesson(page, "subtraction-flags-and-negation");
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
    for (const id of [TWO, "subtraction-flags-and-negation"]) {
      await openLesson(page, id);
      const answer = page.locator('section[data-kind="reflection"] details.lesson-details');
      await expect(answer).not.toHaveAttribute("open", "");
      await expect(answer.locator("summary")).toHaveText(
        id === TWO ? "Answer" : FOCUS.reflectionSummary,
      );
      await press(page, answer.locator("summary"));
      await expect(answer).toHaveAttribute("open", "");
      if (id === TWO) {
        await expect(answer).toContainText("592 ticks");
        await expect(answer).toContainText("fewer than one full turn");
        await expect(answer).not.toContainText("C is 0");
      } else {
        await expect(answer).toContainText("V remains 1");
        await expect(answer).toContainText("Plain neg does not update V");
      }
    }
  });

  test("ordinary negation opens without saved counter work and reports the same retained bits", async ({
    page,
  }) => {
    await openLesson(page, "subtraction-flags-and-negation");
    const ordinary = page.locator("#ix-negate-an-ordinary-value");
    await ordinary.scrollIntoViewIfNeeded();
    await expect(ordinary.locator(".al-locked")).toHaveCount(0);
    await expect(ordinary.locator('[data-register="w0"] .al-reg-value')).toHaveText("5");
    await press(page, ordinary.getByRole("button", { name: V.stepper.next, exact: true }));
    await expect(ordinary.locator('[data-register="w0"] .al-reg-value')).toHaveText("4294967291");
    await expect(ordinary.locator(".al-flag-value")).toHaveText(["1", "0", "0", "0"]);
    await expect(page.locator("#ix-subtract-own")).toHaveCount(0);
  });
});
