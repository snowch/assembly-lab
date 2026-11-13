// Copyright © 2026 Christopher Snow

// The approved full-page replacement: real examples, gates and registered challenge work.
// Old grid-only checks are replaced here by checks of the same mechanisms in the new controls.
import { expect, test, type Page, type Locator } from "@playwright/test";
import { S, FLAGS_LESSON_SECTIONS } from "../../packages/views/src/flags-lesson/strings";
import { FLAGS_VIEW_SLOT } from "../../packages/views/src/flags-lesson/state";
import { flagsModel } from "../../packages/views/src/flags-lesson/model";
import { LOGIC_COPY } from "../../packages/views/src/flags-lesson/strings.logic";
import { additionSteps, columnWork, traceOf } from "@al/views";
import { PLUS } from "../../content/lessons/adding-and-the-flags.listings";

const KEY = "assembly-lab:v1:adding-and-the-flags";
const URL = "#/lesson/adding-and-the-flags";
const digits = ["n", "z", "c", "v"] as const;
const correct = [
  [0, 1, 1, 0],
  [0, 0, 0, 0],
  [0, 1, 1, 1],
] as const;
async function open(page: Page, theme: "light" | "dark") {
  await page.addInitScript((theme) => localStorage.setItem("assembly-lab:v1:theme", theme), theme);
  await page.goto(URL);
  await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
  await expect(page.locator(".lesson-step")).toHaveCount(FLAGS_LESSON_SECTIONS.length);
  await expect(page.locator("#inspectBits .bit")).toHaveCount(4);
}
async function choose(scope: Page | Locator, name: string, value: number | string) {
  await scope.locator(`input[name="${name}"][value="${value}"]`).locator("..").click();
}
async function fillFlags(page: Page, prefix: string, values: readonly number[]) {
  for (const [i, flag] of digits.entries()) await choose(page, `${prefix}-${flag}`, values[i]!);
}
async function commitCase(page: Page, index: number, values: readonly number[]) {
  await page.locator(`#caseTabs button[data-case="${index}"]`).click();
  await fillFlags(page, "practice", values);
  await page.locator("#realForm button[type=submit]").click();
}
async function stored(page: Page) {
  return page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), KEY);
}

async function navigateOutline(page: Page, id: string) {
  const phone = page.viewportSize()!.width <= 760;
  if (phone) await page.locator(".lesson-outline-mobile > summary").click();
  const nav = page.locator(phone ? ".lesson-outline-mobile nav" : ".lesson-outline-desktop nav");
  const link = nav.locator(`a[href="#${id}"]`);
  await link.click();
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
  await expect(link).toHaveAttribute("aria-current", "location");
  if (phone) await expect(page.locator(".lesson-outline-mobile")).not.toHaveAttribute("open");
}

for (const theme of ["light", "dark"] as const) {
  test(`optional logic follows the example, explains V and stays readable (${theme})`, async ({
    page,
  }) => {
    const examples = [
      ["exampleC", 15, 1],
      ["exampleV", 7, 1],
      ["exampleBoth", 8, 8],
      ["exampleNegative", 8, 15],
    ] as const;
    for (const width of [320, 375, 834, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await open(page, theme);
      const detail = page.locator("#flagsLogic");
      await expect(detail).not.toHaveAttribute("open");
      await detail.locator("summary").focus();
      await page.keyboard.press("Enter");
      await expect(detail).toHaveAttribute("open");
      await expect(detail.locator(".flags-logic-why")).toContainText(LOGIC_COPY.xorWhy);
      await expect(detail.locator(".flags-logic-why")).toContainText(LOGIC_COPY.xorWhyNegative);
      for (const [id, a, b] of examples) {
        const model = flagsModel(PLUS, 4, a, b);
        await page.locator(`#${id}`).click();
        await expect(page.locator(`#${id}`)).toBeFocused();
        await expect(detail).toHaveAttribute("open");
        await expect(detail.locator(".flags-logic-body")).toHaveAttribute(
          "data-logic-a",
          model.a.bits,
        );
        await expect(detail.locator(".flags-logic-body")).toHaveAttribute(
          "data-logic-b",
          model.b.bits,
        );
        await expect(detail.locator(".flags-logic-body")).toHaveAttribute(
          "data-logic-result",
          model.result.bits,
        );
        for (const flag of digits)
          await expect(detail.locator(`[data-logic-output="${flag}"]`)).toHaveText(
            `${flag.toUpperCase()}=${model.flags[flag]}`,
          );
      }
      const geometry = await detail.evaluate((node) => {
        const svg = node.querySelector("svg")!;
        const drawing = svg.getBoundingClientRect();
        const figure = node.querySelector("figure")!.getBoundingClientRect();
        const why = node.querySelector(".flags-logic-why")!.getBoundingClientRect();
        const scroll = node.querySelector(".flags-logic-scroll")!;
        const c = svg.querySelector('[data-logic-output="c"]')!.getBoundingClientRect();
        const carry = svg.querySelector('[data-logic-carry="4"]')!.getBoundingClientRect();
        return {
          labelPixels: (drawing.width / 480) * parseFloat(getComputedStyle(svg).fontSize),
          clippedText: [...svg.querySelectorAll("text")].some((text) => {
            const box = text.getBoundingClientRect();
            return (
              box.top < drawing.top ||
              box.bottom > drawing.bottom ||
              box.left < drawing.left ||
              box.right > drawing.right
            );
          }),
          scrolls: scroll.scrollWidth > scroll.clientWidth,
          cue: getComputedStyle(node.querySelector(".flags-logic-scroll-cue")!).display !== "none",
          verticalScrollbar: scroll.scrollHeight > scroll.clientHeight,
          whyAdjacent:
            why.left >= figure.right
              ? Math.abs(why.top - figure.top) < 1
              : why.top >= figure.bottom && why.top - figure.bottom <= 25,
          cLabelGap: carry.top - c.bottom,
        };
      });
      expect(geometry.labelPixels).toBeGreaterThanOrEqual(18);
      expect(geometry.clippedText).toBe(false);
      expect(geometry.verticalScrollbar).toBe(false);
      expect(geometry.whyAdjacent).toBe(true);
      expect(geometry.cue).toBe(geometry.scrolls);
      expect(geometry.cLabelGap).toBeGreaterThan(0);
      const region = detail.getByRole("region", { name: LOGIC_COPY.regionLabel });
      if (geometry.scrolls) {
        await region.focus();
        await expect(region).toBeFocused();
        const right = await region.evaluate((node) => node.scrollWidth - node.clientWidth);
        // Finish the native key scroll before reversing; scripted jumps race its animation.
        for (let step = 0; step < 8; step++) await region.press("ArrowRight", { delay: 50 });
        await expect.poll(() => region.evaluate((node) => node.scrollLeft)).toBe(right);
        for (let step = 0; step < 8; step++) await region.press("ArrowLeft", { delay: 50 });
        await expect.poll(() => region.evaluate((node) => node.scrollLeft)).toBe(0);
      }
      await expect(page.locator("#explorer, #followup .flag")).toHaveCount(0);
      await expect(page.locator("#challenge-predict-flags")).toHaveAttribute(
        "data-complete",
        "false",
      );
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      await page.reload();
      await expect(detail).not.toHaveAttribute("open");
      await detail.locator("summary").click();
      await expect(detail.locator(".flags-logic-body")).toHaveAttribute("data-logic-a", "1000");
      await expect(detail.locator(".flags-logic-body")).toHaveAttribute("data-logic-b", "1111");
      await detail.locator("summary").focus();
      await page.keyboard.press("Space");
      await expect(detail).not.toHaveAttribute("open");
    }
  });
  test(`prediction input spacing and complete range bounds survive narrow cards (${theme})`, async ({
    page,
  }) => {
    for (const width of [320, 375, 834, 920, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await open(page, theme);
      // A wider fallback font exposed premature pairing between tablet and desktop widths.
      if (width === 375 || width === 920)
        await page.addStyleTag({
          content: "#armRanges .range-choice strong { font-family: 'DejaVu Sans', sans-serif; }",
        });
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.locator("#arm").evaluate((section) => {
        const instruction = section.querySelector(".instruction")!.getBoundingClientRect();
        const caption = section.querySelector(".quiz-heading")!.getBoundingClientRect();
        const card = section.querySelector(".focus-card")!.getBoundingClientRect();
        const ranges = [...section.querySelectorAll(".range-choice")].map((range) => {
          const rect = range.getBoundingClientRect();
          const bounds = [...range.querySelectorAll("bdi")].map((bound) => {
            const text = document.createRange();
            text.selectNodeContents(bound);
            const boxes = [...text.getClientRects()];
            return {
              lines: boxes.length,
              top: boxes[0]!.top,
              contained: boxes.every((box) => box.left >= rect.left && box.right <= rect.right),
            };
          });
          return {
            left: rect.left,
            right: rect.right,
            contained: rect.left >= card.left && rect.right <= card.right,
            text: range.querySelector("strong")!.textContent,
            bounds,
          };
        });
        return { gap: caption.top - instruction.bottom, ranges };
      });
      expect(layout.gap, `instruction/caption gap at ${width}px`).toBeGreaterThanOrEqual(16);
      expect(layout.ranges.map((range) => range.text)).toEqual([
        "0 … 4,294,967,295",
        "−2,147,483,648 … 2,147,483,647",
      ]);
      for (const range of layout.ranges) {
        expect(range.contained).toBe(true);
        expect(range.bounds).toHaveLength(2);
        for (const bound of range.bounds) {
          expect(bound.lines).toBe(1);
          expect(bound.contained).toBe(true);
        }
        // Stacked narrow intervals may wrap between complete bounds. Paired cards must not.
        if (layout.ranges[0]!.left !== layout.ranges[1]!.left)
          expect(range.bounds[0]!.top).toBe(range.bounds[1]!.top);
      }
      if (width < 1280) expect(layout.ranges[0]!.left).toBe(layout.ranges[1]!.left);
      else expect(layout.ranges[0]!.right).toBeLessThan(layout.ranges[1]!.left);
      await expect(page.locator("#explorer")).toHaveCount(0);
      await choose(page, "arm-choice", 1);
      await page.locator("#armForm button[type=submit]").click();
      await expect(page.locator("#armFeedback [data-correct]")).toHaveAttribute(
        "data-correct",
        "true",
      );
      await expect(page.locator("#explorer")).toHaveCount(1);
      await page.locator("#clearPrediction").click();
      await expect(page.locator("#explorer")).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
  });
  test(`approved flags route: complete outline, visible rules, examples and scoped navigation (${theme})`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await open(page, theme);
    await expect(
      page.getByRole("heading", { name: "C is for unsigned. V is for signed.", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".flags-current-position")).toContainText("2");
    await expect(page.locator("#nzSummary")).toContainText(
      "Z = 1 only when every stored result bit is 0",
    );
    await expect(page.locator("#cvSummary")).toContainText("Four bits: −8 to 7");
    const widths = page.viewportSize()!;
    expect(
      await page.locator(".shell-header").evaluate((n) => n.getBoundingClientRect().height),
    ).toBeLessThanOrEqual(widths.width < 760 ? 68 : 74);
    await page.locator("#tabZ").click();
    await expect(page.locator("#inspectVisualTitle")).toHaveText(S.zInspectHint);
    expect(
      await page
        .locator("#inspectBits .bit")
        .evaluateAll((ns) => ns.map((n) => n.firstChild?.textContent).join("")),
    ).toBe("0000");
    await page.locator("#tabN").click();
    await expect(page.locator("#inspectVisualTitle")).toHaveText(S.nInspectHint);
    const examples = [
      ["1111", "0001", "0000", "1", "1", "15 + 1 = 16", "−1 + 1 = 0"],
      ["0111", "0001", "1000", "1", "0", "7 + 1 = 8", "7 + 1 = 8"],
      ["1000", "1000", "0000", "0", "1", "8 + 8 = 16", "−8 + (−8) = −16"],
      ["1000", "1111", "0111", "0", "1", "8 + 15 = 23", "−8 + (−1) = −9"],
    ];
    for (const [i, values] of examples.entries()) {
      await page.locator(`#compare button[data-example="${i}"]`).click();
      for (const [id, want] of [
        ["exampleA", values[0]],
        ["exampleB", values[1]],
        ["exampleR", values[2]],
      ] as const)
        expect(await page.locator(`#${id} .mini-bit`).allTextContents()).toEqual(want!.split(""));
      await expect(page.locator("#exampleCarryIn")).toHaveText(values[3]!);
      await expect(page.locator("#exampleCarryOut")).toHaveText(values[4]!);
      await expect(page.locator("#exampleUnsignedMain")).toHaveText(values[5]!);
      await expect(page.locator("#exampleSignedMain")).toHaveText(values[6]!);
    }
    await page.locator("#tabV").click();
    await page.locator("#negativeBtn").click();
    await expect(page.locator("#overflowEquation")).toHaveText("−8 + (−1) = −9");
    await navigateOutline(page, "compare");
    await expect(page).toHaveURL(/#\/lesson\/adding-and-the-flags$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });
  test(`fresh miniature rejects, checks intent, restores and resets without opening the Arm gate (${theme})`, async ({
    page,
  }) => {
    await open(page, theme);
    await expect(page.locator("#explorer,#columnTrace")).toHaveCount(0);
    await page.locator("#miniForm button[type=submit]").click();
    await expect(page.locator("#miniFeedback")).toHaveText(S.chooseAll);
    await fillFlags(page, "mini", [0, 0, 0, 0]);
    await choose(page, "intent", "v");
    await page.locator("#miniForm button[type=submit]").click();
    await expect(page.locator("#miniFeedback [data-correct]")).toHaveAttribute(
      "data-correct",
      "false",
    );
    await choose(page, "mini-c", 1);
    await choose(page, "intent", "c");
    await expect(page.locator("#miniFeedback [data-correct]")).toHaveCount(0);
    await page.locator("#miniForm button[type=submit]").click();
    await expect(page.locator("#miniFeedback [data-correct]")).toHaveAttribute(
      "data-correct",
      "true",
    );
    await page.reload();
    await expect(page.locator("#miniFeedback [data-correct]")).toHaveAttribute(
      "data-correct",
      "true",
    );
    await expect(page.locator("#explorer,#columnTrace")).toHaveCount(0);
    await page.locator("#clearMini").click();
    await expect(page.locator("#miniForm input:checked")).toHaveCount(0);
  });
  test(`prediction commitment, both bit readings and all real arithmetic columns (${theme})`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await open(page, theme);
    await choose(page, "arm-choice", 0);
    await expect(page.locator("#explorer,#columnTrace")).toHaveCount(0);
    await page.locator("#armForm button[type=submit]").click();
    await expect(page.locator("#armFeedback [data-correct]")).toHaveAttribute(
      "data-correct",
      "false",
    );
    expect((await stored(page)).slots["predict-readings"]).toEqual({ choice: "both" });
    await page.locator("#explorer>summary").click();
    await expect(page.locator("[data-fixed-result]")).toHaveText("0x80000000");
    await expect(page.locator("[data-reading-value]")).toHaveText("2,147,483,648");
    await page.locator("#readingButtons button[data-reading=signed]").click();
    await expect(page.locator("[data-reading-value]")).toHaveText("−2,147,483,648");
    await page.locator("#columnTrace>summary").click();
    const record = additionSteps(traceOf(PLUS, { entry: "plus", args: [0x7fffffff, 1] }))[0]!
      .addition!;
    for (let bit = 0; bit < 32; bit++) {
      await page.locator("#nextCol").click();
      const work = columnWork(record, bit);
      await expect(page.locator("#columnDetail")).toContainText(
        `${work.a} + ${work.b} + ${work.carryIn} = ${work.total}`,
      );
      expect(
        await page
          .locator("#traceRows .trace-line")
          .last()
          .locator(".trace-cell")
          .allTextContents(),
      ).toEqual(
        Array.from({ length: 32 }, (_, i) =>
          31 - i <= bit ? String(columnWork(record, 31 - i).kept) : "?",
        ),
      );
    }
    await expect(page.locator("#nextCol")).toBeDisabled();
    expect(await page.locator("#columnDetail .flag strong").allTextContents()).toEqual([
      "1",
      "0",
      "0",
      "1",
    ]);
    const alignment = await page.locator("#traceRows").evaluate((root) => {
      const rows = Array.from(root.querySelectorAll(".trace-line"));
      return Array.from({ length: 32 }, (_, i) =>
        rows.map((row) => row.querySelectorAll(".trace-cell")[i]!.getBoundingClientRect().x),
      );
    });
    alignment.forEach((xs) => expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(1));
    await expect(page.locator("[data-fixed-result]")).toHaveText("0x80000000");
    await expect(page.locator("#columnDetail .flag")).toHaveCount(4);
    await page.locator("#resetCols").click();
    for (let n = 0; n < 8; n++) await page.locator("#nextGroup").click();
    await expect(page.locator("#columnDetail h4")).toHaveText("Bit 31");
    await page.locator("#prevCol").click();
    await expect(page.locator("#columnDetail h4")).toHaveText("Bit 30");
    await page.locator("#allCols").click();
    await page.reload();
    await expect(page.locator("#columnDetail h4")).toHaveText("Bit 31");
    await choose(page, "arm-choice", 1);
    await expect(page.locator("#armFeedback [data-correct]")).toHaveCount(0);
    await page.locator("#armForm button[type=submit]").click();
    await expect(page.locator("#armFeedback [data-correct]")).toHaveAttribute(
      "data-correct",
      "true",
    );
    await page.locator("#clearPrediction").click();
    await expect(page.locator("#explorer,#columnTrace")).toHaveCount(0);
    expect((await stored(page)).slots["predict-readings"]).toBeUndefined();
    expect(errors).toEqual([]);
  });
  test(`registered case grades, hints, aggregate gate and edit invalidation survive reload (${theme})`, async ({
    page,
  }) => {
    await open(page, theme);
    const c = page.locator("#challenge-predict-flags");
    await expect(c).toHaveAttribute("data-complete", "false");
    await c.getByRole("button", { name: /Show hint/ }).click();
    await expect(c.locator(".hints-list li")).toHaveCount(1);
    await commitCase(page, 0, [1, 0, 0, 1]);
    await expect(page.locator("#caseFeedback [data-correct]")).toHaveAttribute(
      "data-correct",
      "false",
    );
    await expect(page.locator("#caseFeedback")).toContainText("N, Z, C, V");
    await expect(page.locator("#nextCase")).toBeDisabled();
    for (const [i, values] of correct.entries()) await commitCase(page, i, values);
    await expect(c).toHaveAttribute("data-complete", "true");
    await expect(page.locator("#followup .flag")).toHaveCount(4);
    const followupInstruction = await page.locator("#followup .instruction").evaluate((node) => {
      const next = node.nextElementSibling!.getBoundingClientRect();
      return {
        display: getComputedStyle(node).display,
        gap: next.top - node.getBoundingClientRect().bottom,
      };
    });
    expect(followupInstruction.display).toBe("block");
    expect(followupInstruction.gap).toBeGreaterThanOrEqual(16);
    const saved = await stored(page);
    expect(saved.challenges["predict-flags"].artifact.answers).toEqual({
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
    });
    expect(saved.challenges["predict-flags"].firstPassedAt).toBeDefined();
    await page.reload();
    await expect(c).toHaveAttribute("data-complete", "true");
    await expect(c.locator(".hints-list li")).toHaveCount(1);
    await choose(page, "practice-v", 0);
    await expect(c).toHaveAttribute("data-complete", "false");
    await expect(page.locator("#followup .flag")).toHaveCount(0);
    expect((await stored(page)).challenges["predict-flags"].artifact.answers).not.toHaveProperty(
      "third-v",
    );
    await page.reload();
    await expect(c).toHaveAttribute("data-complete", "false");
    await page.locator("#realForm button[type=submit]").click();
    await expect(page.locator("#caseFeedback")).toContainText("V");
    await page.locator("#practiceReset").click();
    await expect(page.locator("#realForm input:checked")).toHaveCount(0);
    await expect(c.locator(".hints-list li")).toHaveCount(0);
  });
  test(`existing work migrates; presentation-only completion and malformed commits cannot open gates (${theme})`, async ({
    page,
  }) => {
    await open(page, theme);
    const old = {
      version: 1,
      challenges: {
        "predict-flags": {
          artifact: {
            answers: {
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
            },
          },
          attempts: 1,
          hintsRevealed: 2,
        },
      },
      slots: { "predict-readings": { choice: "unsigned" } },
    };
    await page.evaluate(([key, data]) => localStorage.setItem(key, JSON.stringify(data)), [
      KEY,
      old,
    ] as const);
    await page.reload();
    await expect(page.locator("#challenge-predict-flags")).toHaveAttribute("data-complete", "true");
    await expect(page.locator("#explorer")).toHaveCount(1);
    await expect(page.locator(".hints-list li")).toHaveCount(2);
    await page.evaluate(
      ([key, slot]) => {
        const v = JSON.parse(localStorage.getItem(key)!);
        v.challenges = {};
        v.slots["predict-readings"] = { choice: ["unsigned"] };
        v.slots[slot].practice.cases.forEach((a: { checked: boolean }) => (a.checked = true));
        localStorage.setItem(key, JSON.stringify(v));
      },
      [KEY, FLAGS_VIEW_SLOT] as const,
    );
    await page.reload();
    await expect(page.locator("#challenge-predict-flags")).toHaveAttribute(
      "data-complete",
      "false",
    );
    await expect(page.locator("#followup .flag,#explorer,#columnTrace")).toHaveCount(0);
  });
}

test("theme, keyboard and shared course navigation preserve flags work", async ({ page }) => {
  await open(page, "light");
  await navigateOutline(page, "smallpractice");
  await expect(page).toHaveURL(/#\/lesson\/adding-and-the-flags$/);
  const n = page.locator('input[name=mini-n][value="0"]');
  await n.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator('input[name=mini-n][value="1"]')).toBeChecked();
  await page.locator(".theme-picker select").selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('input[name=mini-n][value="1"]')).toBeChecked();
  await page.locator(".app-status>summary").click();
  await expect(page.locator(".app-status-panel")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.locator(".lesson-nav-link[data-direction=next]").click();
  await expect(page).toHaveURL(/#\/lesson\/flags-and-overflow$/);
  await expect(page.locator(".al-flags-lesson")).toHaveCount(0);
  await page.locator(".lesson-nav-link[data-direction=previous]").click();
  await expect(page.locator('input[name=mini-n][value="1"]')).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("the approved layout stays legible, unclipped and follows the system theme", async ({
  page,
}) => {
  await open(page, "light");
  const phone = page.viewportSize()!.width < 760;
  const card = await page.locator("#compare>.focus-card").boundingBox();
  expect(card!.width).toBeCloseTo(phone ? 343 : 760, 0);
  if (!phone) expect(card!.x).toBeCloseTo(339, 0);
  const bounds = await page.locator(".example-switcher").evaluate((el) => ({
    outer: el.getBoundingClientRect().toJSON(),
    children: [...el.querySelectorAll("button")].map((b) => b.getBoundingClientRect().toJSON()),
  }));
  bounds.children.forEach((r) => {
    expect(r.x).toBeGreaterThanOrEqual(bounds.outer.x);
    expect(r.right).toBeLessThanOrEqual(bounds.outer.right);
    expect(r.height).toBeGreaterThanOrEqual(44);
  });
  const hitRegions = await page
    .locator(".al-flags-lesson :is(button,summary,input[type=radio],a)")
    .evaluateAll((nodes) =>
      nodes
        .filter(
          (n) =>
            n.getBoundingClientRect().width &&
            n.getBoundingClientRect().height &&
            !n.closest(".visually-hidden"),
        )
        .map((n) => {
          const target = n.matches("input[type=radio]") ? (n.closest("label") ?? n) : n;
          return {
            text: target.textContent?.slice(0, 40),
            height: target.getBoundingClientRect().height,
          };
        }),
    );
  hitRegions.forEach((r) => expect(r.height, r.text ?? "control").toBeGreaterThanOrEqual(40));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.locator(".theme-picker select").selectOption("auto");
  await expect(page.locator("html")).not.toHaveAttribute("data-theme");
  expect(
    await page
      .locator(".al-flags-lesson")
      .evaluate((el) => getComputedStyle(el).getPropertyValue("--ink").trim()),
  ).toBe("#e7eeeb");
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
    "rgb(16, 27, 26)",
  );
  await page.emulateMedia({ colorScheme: "light" });
  expect(
    await page
      .locator(".al-flags-lesson")
      .evaluate((el) => getComputedStyle(el).getPropertyValue("--ink").trim()),
  ).toBe("#162c2d");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("all shared hints remain ordered, saved and insufficient to mark unsubmitted work complete", async ({
  page,
}) => {
  await open(page, "light");
  const c = page.locator("#challenge-predict-flags");
  for (let i = 1; i <= 5; i++) {
    await c.getByRole("button", { name: /Show hint/ }).click();
    await expect(c.locator(".hints-list li")).toHaveCount(i);
  }
  await expect(c.getByRole("button", { name: /Show hint/ })).toHaveCount(0);
  await expect(c).toHaveAttribute("data-complete", "false");
  await page.reload();
  await expect(c.locator(".hints-list li")).toHaveCount(5);
  await expect(c).toHaveAttribute("data-complete", "false");
  await page.locator("#practiceReset").click();
  await expect(c.locator(".hints-list li")).toHaveCount(0);
});
