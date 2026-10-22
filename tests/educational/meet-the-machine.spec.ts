// Copyright © 2026 Christopher Snow

// Module 0, Meet the machine, in a browser, on the built site, at desktop and phone widths: the
// lesson loads without an error; the stepper's values after each Next are the model's; both
// predictions commit before they reveal; the construction challenge is completed by typing (at the
// desktop width) and by tapping alone (at the phone width); a wrong answer is rejected; the answers
// challenge rejects a wrong w1 with the lesson's sentence and accepts the reference; a completion
// survives a reload and is graded again; Clear work removes it; and the page keeps the look the
// shell's own pages keep. The stepper's panel of what the last instruction read and wrote, its
// decimal registers with their switch, the two closed notes under the listing, and the ret
// experiment's two connected groups are driven here too.

import { expect, test, type Locator, type Page } from "@playwright/test";

import { LESSONS } from "@al/content";
import { VIEW_STRINGS as V, quoted } from "../../packages/views/src/strings";
import { traceOf, viewAt, wValue } from "../../packages/views/src/trace";
import { DEFAULT_STRINGS as S, format } from "../../platform/lesson-runtime/src/strings";

import { MODULE0_STRINGS as M0 } from "../../packages/views/src/strings.module0";
import { PROSE } from "../../content/lessons/meet-the-machine.prose";
import { LABELS } from "../../content/lessons/meet-the-machine.labels";
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

/** Chooses an option and checks the prediction. The ret experiment's button is its own. */
async function commit(page: Page, id: string, option: string | RegExp): Promise<Locator> {
  const figure = page.locator(`#ix-${id}`);
  await figure.scrollIntoViewIfNeeded();
  await figure.getByRole("radio", { name: option }).check();
  await figure
    .getByRole("button", {
      name: id === "predict-no-ret" ? LABELS.commit.noRet : V.prediction.commit,
    })
    .click();
  return figure;
}

// The registers are drawn as decimal numbers, or as their 32 bits once the switch is pressed.
const registerValue = (figure: Locator, name: string) =>
  figure.locator(`[data-register="${name}"]`).locator(".al-dreg-value, .al-reg-value");

/** The panel's words as one line of text. */
const flowText = async (figure: Locator) =>
  ((await figure.locator(".al-flow").textContent()) ?? "").replace(/\s+/g, " ").trim();

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

test.describe("the operands flow", () => {
  test("draws the reads feeding one operation, and the operation writing the destination, with the connectors on the chips they join", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    const fig = page.locator("#ix-operand-roles");
    await fig.scrollIntoViewIfNeeded();
    // The flow's geometry, measured in the rendered page: each join leg starts under its read
    // chip's centre, the legs meet one arrowhead aligned with the Add chip's centre, and the
    // second connector runs the Add chip's centre to the Write chip's centre. The connectors
    // and the chips share the flow's bounded grid, so their positions agree at any width.
    const ok = await fig.evaluate((el) => {
      const box = (e: Element) => e.getBoundingClientRect();
      const cx = (e: Element) => box(e).left + box(e).width / 2;
      const reads = [...el.querySelectorAll(".al-op-read")];
      const joins = el.querySelectorAll(".al-op-join, .al-op-step");
      if (joins.length !== 2) return { ok: false, why: "joins", joins: joins.length };
      const join = joins[0]!;
      const step = joins[1]!;
      const legs = [...join.querySelectorAll(".al-op-line")];
      const doChip = el.querySelector(".al-op-do")!;
      const writeChip = el.querySelector(".al-op-write")!;
      const head = join.querySelector(".al-op-head");
      if (head === null) return { ok: false, why: "no head" };
      // An SVG path's start x, turned into the page's pixels through its own viewBox.
      const startX = (svg: Element, path: Element) => {
        const units = Number(svg.getAttribute("viewBox")!.split(" ")[2]);
        const x = Number(path.getAttribute("d")!.split(" ")[1]);
        return box(svg).left + (x / units) * box(svg).width;
      };
      const joinSvg = join.querySelector("svg")!;
      const stepSvg = step.querySelector("svg")!;
      const stepLine = step.querySelector(".al-op-line")!;
      const headX = cx(head);
      const legXs = legs.map((l) => startX(joinSvg, l));
      return {
        ok:
          reads.length === legs.length &&
          reads.every((r, i) => Math.abs(legXs[i]! - cx(r)) < 4) &&
          Math.abs(headX - cx(doChip)) < 4 &&
          Math.abs(startX(stepSvg, stepLine) - cx(doChip)) < 4 &&
          Math.abs(cx(stepSvg) - cx(writeChip)) < 4 &&
          box(step).top >= box(doChip).bottom - 1 &&
          box(step).bottom <= box(writeChip).top + 1 &&
          join.querySelectorAll(".al-op-head").length === 1 &&
          // No stray arrows attached to the nodes themselves.
          el.querySelectorAll(".al-op::after").length === 0,
        why: "alignment",
        readCentres: reads.map((r) => Math.round(cx(r))),
        legStartXs: legXs.map((x) => Math.round(x)),
        headX: Math.round(headX),
        doCentre: Math.round(cx(doChip)),
        writeCentre: Math.round(cx(writeChip)),
      };
    });
    expect(ok.ok, JSON.stringify(ok)).toBe(true);
    // The stages read in order, and the page does not overflow sideways.
    await expect(fig.locator(".al-op-read")).toHaveCount(2);
    await expect(fig.locator(".al-op-write code")).toHaveText("w0");
    expect(await designProblems(page, false)).toEqual([]);
  });
});

test.describe("the listing figure", () => {
  test("keeps the C beside its instructions at every width, tags checked lines, and keeps compiler references in details", async ({
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
    // The tag beside each instruction names the C line the pane shows, not the compiler's record.
    await expect(figure.locator(".al-insn .al-ctag")).toHaveText(["3", "4", "5", "6"]);
    const details = figure.locator(".al-compiler-lines");
    await expect(details).not.toHaveAttribute("open");
    // The two panes sit side by side whatever the width: the listing scrolls as one piece, so
    // the instructions stay to the right of the C and the page does not overflow.
    const [c, asm, overflow] = await figure.locator(".al-listing").evaluate((listing) => {
      const cb = listing.querySelector(".al-c")!.getBoundingClientRect();
      const ab = listing.querySelector(".al-asm")!.getBoundingClientRect();
      return [
        { x: cb.x, y: cb.y, width: cb.width, height: cb.height },
        { x: ab.x, y: ab.y, width: ab.width, height: ab.height },
        {
          left: listing.scrollWidth > listing.clientWidth,
          page: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        },
      ] as const;
    });
    expect(asm.x).toBeGreaterThanOrEqual(c.x + c.width - 1);
    expect(Math.abs(asm.y - c.y)).toBeLessThan(1);
    expect(overflow.page).toBe(false);
    await press(page, details.locator("summary"));
    await expect(details.locator(".al-ctag")).toHaveText(["3", "4", "7", "7"]);
  });

  test("hangs two closed notes directly under the listing, in place of an open paragraph", async ({
    page,
  }) => {
    await openLesson(page);
    const figure = page.locator("#ix-trip-listing");
    const notes = figure.locator("details.lesson-details");
    await expect(notes).toHaveCount(2);
    await expect(notes.locator("summary")).toHaveText([
      PROSE.compilerNote.summary,
      PROSE.lineNote.summary,
    ]);
    // Closed by default: the words inside are not on show.
    for (const open of await notes.evaluateAll((els) =>
      els.map((e) => (e as HTMLDetailsElement).open),
    ))
      expect(open).toBe(false);
    await expect(figure.getByText("Line 7 beside")).toHaveCount(0);
    await expect(figure.locator(".figure-after")).toHaveCount(0);
    await expect(page.getByText("The record is there to lead you")).toBeHidden();
    // Directly under the listing, in the reading column.
    const [listing, first] = await Promise.all([
      figure.locator(".al-listing").boundingBox(),
      notes.first().boundingBox(),
    ]);
    expect(first!.y).toBeGreaterThan(listing!.y + listing!.height - 1);
    const cr = await notes.first().evaluate((el) => el.getBoundingClientRect().width);
    expect(cr).toBeLessThanOrEqual(page.viewportSize()!.width);
  });

  test("opens a note from the keyboard, with Enter or Space, and shows its words", async ({
    page,
  }) => {
    await openLesson(page);
    const figure = page.locator("#ix-trip-listing");
    const notes = figure.locator("details.lesson-details");
    const summary = (n: number) => notes.nth(n).locator("summary");
    await summary(0).focus();
    await expect(summary(0)).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(notes.nth(0)).toHaveJSProperty("open", true);
    await expect(notes.nth(0)).toContainText("GCC version 16.1");
    await expect(notes.nth(0)).toContainText("makes twenty instructions");
    await expect(notes.nth(1)).toHaveJSProperty("open", false);
    await page.keyboard.press("Tab");
    await expect(summary(1)).toBeFocused();
    await page.keyboard.press("Space");
    await expect(notes.nth(1)).toHaveJSProperty("open", true);
    await expect(notes.nth(1)).toContainText("sub w0, w0, w3 does the subtraction on line 5");
    await expect(notes.nth(1)).toContainText("records both instructions against line 7");
    await page.keyboard.press("Enter");
    await expect(notes.nth(1)).toHaveJSProperty("open", false);
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

  test("moves the marker, outlines the register just written and lights the related C operation", async ({
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
    // The teaching link follows the subtraction; the compiler tag remains 7 in details.
    await expect(figure.locator('.al-cline[data-lit="true"]')).toHaveAttribute("data-line", "5");
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

test.describe("the stepper's panel of what the last instruction read and wrote", () => {
  test("shows nothing of an instruction before it has run, then the first add: 120 and 85 read, 205 written to w0", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    const figure = page.locator("#ix-step-trip");
    await figure.scrollIntoViewIfNeeded();
    expect(await flowText(figure)).toBe("");
    const next = figure.getByRole("button", { name: V.stepper.next });
    await press(page, next);
    const text = await flowText(figure);
    expect(text).toContain("Reads w0 (120) + w1 (85) → Writes w0 = 205 (w0 was 120)");
    expect(text).toContain("Written: w0");
    expect(text).toContain("Not written: w1, w2, w3");
    // The shapes differ as well as the words: a dashed outline for what was read, a solid one for what was written.
    const [src, dst] = await Promise.all([
      figure
        .locator('[data-role="source"]')
        .first()
        .evaluate((e) => getComputedStyle(e).borderTopStyle),
      figure
        .locator('[data-role="destination"]')
        .evaluate((e) => getComputedStyle(e).borderTopStyle),
    ]);
    expect([src, dst]).toEqual(["dashed", "solid"]);
    await press(page, next);
    expect(await flowText(figure)).toContain(
      "Reads w0 (205) + w2 (42) → Writes w0 = 247 (w0 was 205)",
    );
    await press(page, next);
    const sub = await flowText(figure);
    expect(sub).toContain("Reads w0 (247) − w3 (15) → Writes w0 = 232 (w0 was 247)");
    expect(sub).toContain(M0.flow.subtracts);
    expect(sub).toContain("Not written: w1, w2, w3");
    await press(page, next);
    expect(await flowText(figure)).toContain("does no arithmetic");
    // Back restores the previous panel and the value.
    await press(page, figure.getByRole("button", { name: V.stepper.back }));
    expect(await flowText(figure)).toContain("Reads w0 (247) − w3 (15)");
    await expect(registerValue(figure, "w0")).toHaveText("232");
    await press(page, figure.getByRole("button", { name: V.stepper.back }));
    expect(await flowText(figure)).toContain("Reads w0 (205) + w2 (42)");
    await expect(registerValue(figure, "w0")).toHaveText("247");
  });

  test("shows the sentence about ret only once the run has ended", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    const figure = page.locator("#ix-step-trip");
    await figure.scrollIntoViewIfNeeded();
    const next = figure.getByRole("button", { name: V.stepper.next });
    for (let k = 0; k < 3; k++) await press(page, next);
    await expect(figure.locator(".al-endnote")).toHaveCount(0);
    await press(page, next);
    await expect(figure.locator(".al-endnote")).toContainText(
      "ret returns to the code that called this function. The function's result is whatever w0 holds at that moment.",
    );
  });
});

test.describe("the registers as decimal numbers", () => {
  test("show no bits until the switch is pressed, and the switch works from the keyboard", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    const figure = page.locator("#ix-step-trip");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-bit")).toHaveCount(0);
    await expect(registerValue(figure, "w0")).toHaveText("120");
    const toggle = figure.getByRole("button", { name: M0.registers.showBits });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.focus();
    await page.keyboard.press("Enter");
    const hide = figure.getByRole("button", { name: M0.registers.hideBits });
    await expect(hide).toHaveAttribute("aria-expanded", "true");
    await expect(figure.locator(".al-bit")).toHaveCount(4 * 32);
    await expect(figure.locator("[data-register='w0'] .al-bit-group")).toHaveCount(4);
    await page.keyboard.press("Space");
    await expect(figure.locator(".al-bit")).toHaveCount(0);
  });

  test("mark the written register by an outline and by the word Written", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    const figure = page.locator("#ix-step-trip");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator('[data-changed="true"]')).toHaveCount(0);
    await expect(figure.getByText(M0.registers.changed, { exact: true })).toHaveCount(0);
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
    const changed = figure.locator('[data-changed="true"]');
    await expect(changed).toHaveCount(1);
    await expect(changed).toHaveAttribute("data-register", "w0");
    await expect(changed.getByText(M0.registers.changed, { exact: true })).toBeVisible();
    const outline = await changed.evaluate((e) => getComputedStyle(e).borderTopColor);
    const plain = await figure
      .locator("[data-register='w1']")
      .evaluate((e) => getComputedStyle(e).borderTopColor);
    expect(outline).not.toBe(plain);
  });
});

test.describe("the ret experiment, as two connected groups", () => {
  const groups = (figure: Locator) => figure.locator(".al-group");

  test("shows trip_distance and fuel_used under their labels, and no mark until the run reaches one", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-no-ret", "147");
    const figure = page.locator("#ix-step-no-ret");
    await figure.scrollIntoViewIfNeeded();
    await expect(groups(figure).locator(".al-label")).toHaveText(["trip_distance:", "fuel_used:"]);
    await expect(groups(figure).first().locator(".al-text")).toHaveText([
      "add w0, w0, w1",
      "add w0, w0, w2",
      "sub w0, w0, w3",
      "ret",
    ]);
    await expect(figure.locator(".al-stop, .al-link")).toHaveCount(0);
    expect(await flowText(figure)).toBe("");
    const next = figure.getByRole("button", { name: V.stepper.next });
    for (let k = 0; k < 3; k++) await press(page, next);
    await expect(figure.locator(".al-stop")).toHaveCount(0);
    await press(page, next);
    // With ret present the run stops after trip_distance's ret, and nothing links the groups.
    await expect(groups(figure).first().locator(".al-stop")).toHaveText(/Stopping point/);
    await expect(figure.locator(".al-link")).toHaveCount(0);
    await expect(registerValue(figure, "w0")).toHaveText("232");
  });

  test("with ret deleted, joins the groups only when the run crosses, and the panel shows the extra subtraction", async ({
    page,
  }) => {
    await openLesson(page);
    await commit(page, "predict-no-ret", "232");
    const figure = page.locator("#ix-step-no-ret");
    await figure.scrollIntoViewIfNeeded();
    await press(page, figure.getByRole("checkbox", { name: /Delete the ret line/ }));
    await expect(figure.locator(".al-link")).toHaveCount(0);
    await expect(groups(figure).first().locator(".al-text")).toHaveCount(3);
    const next = figure.getByRole("button", { name: V.stepper.next });
    for (let k = 0; k < 2; k++) await press(page, next);
    await expect(figure.locator(".al-link")).toHaveCount(0);
    await press(page, next);
    const link = figure.locator(".al-link");
    await expect(link).toHaveText("The run crosses from trip_distance into fuel_used.");
    // Between the two groups, as a line and a text label.
    const [first, mid, second] = await Promise.all([
      groups(figure).first().boundingBox(),
      link.boundingBox(),
      groups(figure).last().boundingBox(),
    ]);
    expect(mid!.y).toBeGreaterThanOrEqual(first!.y + first!.height - 1);
    expect(second!.y).toBeGreaterThanOrEqual(mid!.y + mid!.height - 1);
    expect(await flowText(figure)).toContain("The run continues into it.");
    await press(page, next);
    expect(await flowText(figure)).toContain(
      "Reads w0 (232) − w1 (85) → Writes w0 = 147 (w0 was 232)",
    );
    await press(page, next);
    await expect(next).toBeDisabled();
    await expect(registerValue(figure, "w0")).toHaveText("147");
    await expect(groups(figure).last().locator(".al-stop")).toBeVisible();
    // Back, three times: the connector goes with the crossing.
    for (let k = 0; k < 3; k++)
      await press(page, figure.getByRole("button", { name: V.stepper.back }));
    await expect(figure.locator(".al-link")).toHaveCount(0);
  });

  test("shows no run, no groups and no switch before the prediction is checked", async ({
    page,
  }) => {
    await openLesson(page);
    const figure = page.locator("#ix-step-no-ret");
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator(".al-locked")).toBeVisible();
    await expect(figure.locator(".al-group, .al-flow, .al-link, .al-stop, .al-dreg")).toHaveCount(
      0,
    );
    await expect(figure.getByRole("checkbox")).toHaveCount(0);
  });

  test("is reached from the keyboard: the switch with Space, Next with Enter", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-no-ret", "147");
    const figure = page.locator("#ix-step-no-ret");
    await figure.scrollIntoViewIfNeeded();
    const checkbox = figure.getByRole("checkbox", { name: /Delete the ret line/ });
    await checkbox.focus();
    await page.keyboard.press("Space");
    await expect(checkbox).toBeChecked();
    await expect(figure.locator(".al-insn")).toHaveCount(5);
    const next = figure.getByRole("button", { name: V.stepper.next });
    await next.focus();
    for (let k = 0; k < 3; k++) await page.keyboard.press("Enter");
    await expect(figure.locator(".al-link")).toBeVisible();
  });

  test("moves nothing when the learner prefers reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openLesson(page);
    await commit(page, "predict-no-ret", "147");
    const figure = page.locator("#ix-step-no-ret");
    await figure.scrollIntoViewIfNeeded();
    await press(page, figure.getByRole("checkbox"));
    for (let k = 0; k < 3; k++)
      await press(page, figure.getByRole("button", { name: V.stepper.next }));
    const seconds = await figure
      .locator(".al-link")
      .evaluate((e) => parseFloat(getComputedStyle(e).animationDuration));
    expect(seconds).toBeLessThan(0.01);
  });
});

test.describe("the two predictions commit before they reveal", () => {
  test("the ret prediction invites a best guess beside the question, and its button says what it does", async ({
    page,
  }) => {
    await openLesson(page);
    const figure = page.locator("#ix-predict-no-ret");
    await figure.scrollIntoViewIfNeeded();
    const invitation = figure.locator(".prose").first();
    await expect(invitation).toContainText("This is a new situation.");
    await expect(invitation).toContainText("Make your best prediction");
    // The invitation sits directly above the question, and gives away neither answer nor value.
    const question = figure.locator(".prose").nth(1);
    await expect(question).toContainText("With ret deleted");
    await expect(figure.locator(".al-outcome")).toHaveCount(0);
    await expect(figure.getByRole("button", { name: LABELS.commit.noRet })).toBeDisabled();
    await expect(figure.getByRole("button", { name: V.prediction.commit })).toHaveCount(0);
    // The other prediction keeps the ordinary button, with no invitation of its own.
    const total = page.locator("#ix-predict-total");
    await expect(total.getByRole("button", { name: V.prediction.commit })).toBeDisabled();
    await expect(total.locator(".prose").first()).toHaveText(
      PROSE.predictionQuestion.replaceAll("**", "").replaceAll("`", ""),
    );
    await expect(total).not.toContainText("This is a new situation.");
  });

  for (const [id, right, wrong] of [
    ["predict-total", /^In w0/, /^In w3/],
    ["predict-no-ret", "147", "232"],
  ] as const) {
    test(id, async ({ page }) => {
      await openLesson(page);
      const figure = page.locator(`#ix-${id}`);
      await figure.scrollIntoViewIfNeeded();
      await expect(figure.locator(".al-outcome")).toHaveCount(0);
      const commit = figure.getByRole("button", {
        name: id === "predict-no-ret" ? LABELS.commit.noRet : V.prediction.commit,
      });
      await expect(commit).toBeDisabled();
      await figure.getByRole("radio", { name: right }).check();
      // A choice is not a commitment: nothing is shown until it is checked.
      await expect(figure.locator(".al-outcome")).toHaveCount(0);
      await press(page, commit);
      await expect(figure.locator(".al-match")).toContainText(V.prediction.match);
      await expect(figure.locator(".al-outcome .prose")).toBeVisible();
      // The learner may choose again; the model, not the lesson, says what matches.
      await figure.getByRole("radio", { name: wrong }).check();
      await press(page, commit);
      await expect(figure.locator(".al-nomatch")).toContainText(V.prediction.noMatch);
    });
  }

  for (const [id, wrong, sentence] of [
    ["predict-total", /^In a new place/, PROSE.predictionFeedback["new-place"]],
    ["predict-total", /^It does not keep/, PROSE.predictionFeedback["not-kept"]],
    ["predict-total", /^In w3/, PROSE.predictionFeedback.w3],
    ["predict-no-ret", "232", PROSE.failureFeedback["232"]],
    ["predict-no-ret", /^The run stops with an error/, PROSE.failureFeedback.error],
    ["predict-no-ret", "0", PROSE.failureFeedback["0"]],
  ] as const) {
    test(`${id}: choosing ${String(wrong)} wrongly is answered with its sentence, and the right choice with none`, async ({
      page,
    }) => {
      await openLesson(page);
      const figure = await commit(page, id, wrong);
      await expect(figure.locator(".al-nomatch")).toContainText(V.prediction.noMatch);
      await expect(figure.locator(".al-feedback")).toHaveText(sentence.replace(/`/g, ""));
      const right = id === "predict-total" ? /^In w0/ : "147";
      await figure.getByRole("radio", { name: right }).check();
      await press(
        page,
        figure.getByRole("button", {
          name: id === "predict-no-ret" ? LABELS.commit.noRet : V.prediction.commit,
        }),
      );
      await expect(figure.locator(".al-match")).toBeVisible();
      await expect(figure.locator(".al-feedback")).toHaveCount(0);
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

  test("offers the keys this challenge needs: `,` and `w`, registers w0 to w3, no number pad", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, FIX);
    await c.scrollIntoViewIfNeeded();
    await expect(c.getByRole("group", { name: V.editor.symbols }).getByRole("button")).toHaveText([
      ",",
      "w",
    ]);
    await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
    await press(page, c.locator(".asm-line-button").first());
    const third = c.getByRole("group", { name: V.editor.operand(3), exact: true });
    await expect(third.getByRole("button")).toHaveText(["w0", "w1", "w2", "w3"]);
  });

  test("builds the whole answer from chips, from nothing", async ({ page }) => {
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
    // Both failures are the reversed subtraction, so each is answered with the sentence about the
    // order of the operands, which names no value.
    await expect(c.locator(".verdict-detail")).toHaveText([
      quoted(PROSE.fixReversedFeedback),
      quoted(PROSE.fixReversedFeedback),
    ]);
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
  });

  test("any other wrong result keeps the usual card, with the values and without the sentence", async ({
    page,
  }) => {
    await openLesson(page);
    const c = challenge(page, FIX);
    await c.scrollIntoViewIfNeeded();
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await box.fill("add w0, w0, w1\nret");
    await press(page, run(c));
    await expect(c.locator(".verdict-failure")).toHaveCount(3);
    await expect(c.locator(".verdict-detail")).toHaveCount(0);
    await expect(c.locator(".verdict-failure").first()).toContainText("w0=88");
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
    await expect(failure.locator(".verdict-detail")).toHaveText(quoted(PROSE.traceFeedbackW1));
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
    await expect(c.locator(".verdict-detail")).toHaveText(quoted(PROSE.traceFeedbackW0));
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
    // Both notes under the listing open, the bits of the registers shown, and the experiment's run
    // across into fuel_used with its connector drawn.
    for (const summary of await page.locator("#ix-trip-listing summary").all())
      await press(page, summary);
    await press(page, step.getByRole("button", { name: M0.registers.showBits }));
    const noRet = page.locator("#ix-step-no-ret");
    await press(page, noRet.getByRole("checkbox"));
    for (let k = 0; k < 3; k++)
      await press(page, noRet.getByRole("button", { name: V.stepper.next }));
    await expect(noRet.locator(".al-link")).toBeVisible();
    expect(await designProblems(page, phone)).toEqual([]);
    const fix = challenge(page, FIX);
    await press(page, fix.getByRole("button", { name: V.editor.tap, exact: true }));
    await press(page, fix.locator(".asm-line-button").first());
    // This challenge needs no constant: the third operand offers registers and no number pad.
    const third = fix.getByRole("group", { name: V.editor.operand(3) });
    await expect(third.getByRole("button", { name: V.editor.number })).toHaveCount(0);
    await press(page, third.getByRole("button", { name: "w3" }));
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

  test("the page, with every new part open, is 360 pixels wide with no sideways scroll, legible text and controls 40 pixels tall", async ({
    page,
  }, info) => {
    await page.setViewportSize({ width: 360, height: 800 });
    // The phone project taps; the desktop project, resized to 360, still has a mouse.
    const press = (_page: Page, target: Locator) =>
      info.project.name === "phone" ? target.tap() : target.click();
    await openLesson(page);
    await commit(page, "predict-total", /^In a new place/);
    await commit(page, "predict-no-ret", "232");
    for (const summary of await page.locator("#ix-trip-listing summary").all())
      await press(page, summary);
    const step = page.locator("#ix-step-trip");
    await step.scrollIntoViewIfNeeded();
    await press(page, step.getByRole("button", { name: V.stepper.next }));
    expect(await designProblems(page, true)).toEqual([]);
    await press(page, step.getByRole("button", { name: M0.registers.showBits }));
    for (let k = 0; k < 3; k++)
      await press(page, step.getByRole("button", { name: V.stepper.next }));
    expect(await designProblems(page, true)).toEqual([]);
    const noRet = page.locator("#ix-step-no-ret");
    await press(page, noRet.getByRole("checkbox"));
    for (let k = 0; k < 5; k++)
      await press(page, noRet.getByRole("button", { name: V.stepper.next }));
    await expect(noRet.locator(".al-link")).toBeVisible();
    await expect(noRet.locator(".al-stop")).toBeVisible();
    expect(await designProblems(page, true)).toEqual([]);
    const reflection = page.locator("section[data-kind='reflection']");
    await reflection.scrollIntoViewIfNeeded();
    await press(page, reflection.locator("summary"));
    await expect(reflection.locator("details")).toContainText("w2 still holds 9.");
    expect(await designProblems(page, true)).toEqual([]);
  });

  test("a register's 32 cells fit the screen, on a phone and on a desk", async ({ page }) => {
    await openLesson(page);
    await commit(page, "predict-total", /^In w0/);
    await press(
      page,
      page.locator("#ix-step-trip").getByRole("button", { name: M0.registers.showBits }),
    );
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
      await press(page, figure.getByRole("button", { name: M0.registers.showBits }));
      const colours = await figure.evaluate((el) => {
        const on = el.querySelector('.al-bit[data-on="true"]')!;
        const off = el.querySelector('.al-bit[data-on="false"]')!;
        return [getComputedStyle(on).backgroundColor, getComputedStyle(off).backgroundColor];
      });
      expect(colours[0]).not.toBe(colours[1]);
    });
  }
});
