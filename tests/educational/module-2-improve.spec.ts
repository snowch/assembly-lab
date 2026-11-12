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
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { ARITH_STRINGS as A } from "../../packages/views/src/strings.arith";

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
      id: "subtract-wrapped",
      c: "C = 0: a borrow was needed",
      result: "Result: 0x000007d0, which is 2000",
    },
    { id: "subtract-no-wrap", c: "C = 1: no borrow", result: "Result: 0x00001964, which is 6500" },
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

  test("the two subtraction figures keep their rows inside 360 pixels, one under the other, with no sideways scroll", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await openLesson(page, "subtraction-flags-and-negation");
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
    for (const id of ["flags-and-overflow", TWO]) {
      await openLesson(page, id);
      const answer = page.locator('section[data-kind="reflection"] details.lesson-details');
      await expect(answer).not.toHaveAttribute("open", "");
      await expect(answer.locator("summary")).toHaveText("Answer");
      await press(page, answer.locator("summary"));
      await expect(answer).toHaveAttribute("open", "");
      await expect(answer).toContainText(
        id === "flags-and-overflow" ? "C is 1 and V is 0" : "592, and C is 0",
      );
    }
  });

  test("the arithmetic worked example opens without saved counter work and says what the subtraction kept", async ({
    page,
  }) => {
    await openLesson(page, "subtraction-flags-and-negation");
    const own = page.locator("#ix-subtract-own");
    await own.scrollIntoViewIfNeeded();
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
  });
});
