// Copyright © 2026 Christopher Snow

// The approved full-page replacement: real examples, gates and registered challenge work.
// Old grid-only checks are replaced here by checks of the same mechanisms in the new controls.
import { expect, test, type Page, type Locator } from "@playwright/test";
import { S, FLAGS_LESSON_SECTIONS } from "../../packages/views/src/flags-lesson/strings";
import { FLAGS_VIEW_SLOT } from "../../packages/views/src/flags-lesson/state";
import { flagsModel } from "../../packages/views/src/flags-lesson/model";
import { LOGIC_COPY } from "../../packages/views/src/flags-lesson/strings.logic";
import { PLUS } from "../../content/lessons/adding-and-the-flags.listings";

const KEY = "assembly-lab:v1:adding-and-the-flags";
const URL = "#/lesson/adding-and-the-flags";
const digits = ["n", "z", "c", "v"] as const;
const correct = [
  [0, 1, 1, 0],
  [0, 0, 0, 0],
  [0, 1, 1, 1],
  [1, 0, 0, 1],
  [1, 0, 0, 0],
  [0, 1, 0, 0],
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
  test(`dedicated carry pane explains both overflow directions before comparison (${theme})`, async ({
    page,
  }) => {
    await open(page, theme);
    const pane = page.locator("#carryproof");
    await expect(pane.getByRole("heading", { level: 2 })).toHaveText(
      "Why unequal carries mean signed overflow",
    );
    await expect(page.locator("#checkranges > .next-link")).toHaveAttribute("href", "#carryproof");
    await expect(pane.locator(".next-link")).toHaveAttribute("href", "#compare");
    await navigateOutline(page, "carryproof");
    await expect(page).toHaveURL(/#\/lesson\/adding-and-the-flags$/);
    await expect(pane.locator(".carry-rule")).toContainText(
      "V = 1 when the carry into the sign bit differs from the carry out",
    );
    await expect(page.locator("#compare .carry-rule")).toHaveCount(0);
    const expected = [
      {
        exact: "7 + 1 = 8",
        bits: ["0111", "0001", "1000"],
        column: "0 + 0 + 1 = 1",
        incoming: "1",
        outgoing: "0",
        kept: "1",
        signed: "−8",
      },
      {
        exact: "−8 + (−1) = −9",
        bits: ["1000", "1111", "0111"],
        column: "1 + 1 + 0 = 10",
        incoming: "0",
        outgoing: "1",
        kept: "0",
        signed: "7",
      },
    ];
    for (const [i, example] of expected.entries()) {
      const worked = pane.locator(`[data-proof-example="${i}"]`);
      await expect(worked.locator(".carry-proof-equation strong")).toHaveText(example.exact);
      await expect(worked.locator(".carry-proof-pattern")).toHaveText(example.bits);
      for (const [row, label] of ["First input", "Second input", "Stored result"].entries())
        await expect(
          worked.getByRole("img", { name: `${label}: ${example.bits[row]}` }),
        ).toBeVisible();
      await expect(worked.locator("[data-proof-column]")).toHaveText(example.column);
      await expect(worked.locator("[data-proof-in]")).toHaveText(example.incoming);
      await expect(worked.locator("[data-proof-out]")).toHaveText(example.outgoing);
      await expect(worked.locator("[data-proof-kept]")).toHaveText(example.kept);
      await expect(worked.locator(".carry-proof-reading")).toContainText(
        `read as ${example.signed}.`,
      );
      await expect(worked.locator(".carry-proof-verdict")).toContainText("V = 1");
      await expect(worked).toContainText("wrong sign because the exact sum does not fit");
    }
    await expect(pane.locator(".carry-proof-matching")).toContainText(
      "Its outgoing carry therefore equals its incoming carry",
    );
    const check = pane.locator(".carry-proof-check");
    await expect(check.locator("[data-proof-in]")).toHaveText("1");
    await expect(check.locator("[data-proof-out]")).toHaveText("1");
    await expect(check.locator("details > div")).toBeHidden();
    await check.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(check.locator("details > div")).toBeVisible();
    await expect(check.locator("details > div")).toContainText("The carries match, so V = 0");
    await expect(check.locator("details > div")).toContainText("−3 + 4 = 1");
    await expect(check.locator("details > div")).toContainText("0001, read as 1");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
  });
  test(`six practice cases and complete equations fit the available card width (${theme})`, async ({
    page,
  }) => {
    await open(page, theme);
    await expect(page.locator("#caseTabs button")).toHaveCount(6);
    await expect(page.locator("#practicePosition")).toHaveText("Case 1 of 6");
    await expect(page.locator("#followup .flag")).toHaveCount(0);
    for (const [i, values] of correct.entries()) {
      await commitCase(page, i, values);
      if (i < correct.length - 1) {
        await expect(page.locator("#challenge-predict-flags")).toHaveAttribute(
          "data-complete",
          "false",
        );
        await expect(page.locator("#followup .flag")).toHaveCount(0);
      }
      if (i === 2) {
        await expect(page.locator("#nextCase")).toBeEnabled();
        await page.locator("#nextCase").click();
        await expect(page.locator("#practicePosition")).toHaveText("Case 4 of 6");
        await expect(page.locator("#realForm input:checked")).toHaveCount(0);
      }
    }
    await expect(page.locator("#practicePosition")).toHaveText("Case 6 of 6");
    await expect(page.locator("#nextCase")).toBeDisabled();
    await expect(page.locator("#challenge-predict-flags")).toHaveAttribute("data-complete", "true");
    const disclosure = page.locator("#followup .carry-disclosure");
    await disclosure.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(disclosure).toHaveAttribute("open");
    for (const width of [320, 375, 834, 920, 1280]) {
      await page.setViewportSize({ width, height: 1000 });
      if (width === 375)
        await page.addStyleTag({
          content:
            ".reading-equation,.followup-equation { font-family: 'DejaVu Sans', sans-serif !important; }",
        });
      await page.evaluate(() => document.fonts.ready);
      for (const index of [0, 2, 3, 4, 5]) {
        await page.locator(`#caseTabs button[data-case="${index}"]`).click();
        await expect(disclosure).toHaveAttribute("open");
        const geometry = await page.locator("#realpractice").evaluate((root) => {
          const notes = [...root.querySelectorAll<HTMLElement>(".math-notes")];
          const panels = notes.map((note) => {
            const cards = [...note.querySelectorAll<HTMLElement>(".fit-cell")];
            const [a, b] = cards.map((card) => card.getBoundingClientRect());
            return {
              width: note.clientWidth,
              paired: a!.left !== b!.left,
              overlap: a!.left === b!.left ? b!.top < a!.bottom : b!.left < a!.right,
              valuesFit: [...note.querySelectorAll(".reading-equation bdi")].every((value) => {
                const card = value.closest(".fit-cell")!.getBoundingClientRect();
                const text = document.createRange();
                text.selectNodeContents(value);
                const lines = [...text.getClientRects()];
                return (
                  lines.length === 1 &&
                  lines.every((line) => line.left >= card.left && line.right <= card.right)
                );
              }),
            };
          });
          const summary = root
            .querySelector(".carry-disclosure > summary")!
            .getBoundingClientRect();
          const previous = root.querySelector("#followup .math-notes")!.getBoundingClientRect();
          const carry = root.querySelector(".carry-disclosure")!.getBoundingClientRect();
          const tabs = [...root.querySelectorAll("#caseTabs button")].map((button) =>
            button.getBoundingClientRect(),
          );
          return {
            panels,
            carryGap: carry.top - previous.bottom,
            summaryHeight: summary.height,
            tabHeights: tabs.map((tab) => tab.height),
            tabRows: new Set(tabs.map((tab) => tab.top)).size,
            tabWidth:
              root.querySelector("#challenge-predict-flags")!.clientWidth -
              parseFloat(
                getComputedStyle(root.querySelector("#challenge-predict-flags")!).paddingLeft,
              ) *
                2,
            overflow: document.documentElement.scrollWidth > innerWidth,
            hexFits: [...root.querySelectorAll(".followup-equation bdi")].every((value) => {
              const box = value.parentElement!.getBoundingClientRect();
              const text = document.createRange();
              text.selectNodeContents(value);
              return [...text.getClientRects()].every(
                (line) => line.left >= box.left && line.right <= box.right,
              );
            }),
          };
        });
        expect(geometry.panels).toHaveLength(2);
        for (const panel of geometry.panels) {
          expect(panel.paired).toBe(panel.width >= 600);
          expect(panel.overlap).toBe(false);
          expect(panel.valuesFit).toBe(true);
        }
        expect(geometry.carryGap).toBeGreaterThanOrEqual(24);
        expect(geometry.summaryHeight).toBeGreaterThanOrEqual(44);
        expect(geometry.tabHeights.every((height) => height >= 52)).toBe(true);
        expect(geometry.tabRows).toBe(geometry.tabWidth >= 600 ? 1 : 2);
        expect(geometry.overflow).toBe(false);
        expect(geometry.hexFits).toBe(true);
      }
    }
    await disclosure.locator("summary").focus();
    await page.keyboard.press("Space");
    await expect(disclosure).not.toHaveAttribute("open");
  });
  test(`input display preserves predictions and checked results in every reading (${theme})`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const selector = page.getByRole("group", { name: S.armInputDisplayLabel, exact: true });
    const formats = [
      [S.armInputHex, "0x7fffffff + 0x00000001", "hex"],
      [S.armInputUnsigned, "2,147,483,647 + 1", "unsigned"],
      [S.armInputSigned, "2,147,483,647 + 1", "signed"],
    ] as const;
    for (const width of [320, 375, 834, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await open(page, theme);
      // Navigating to the same hash keeps the mounted lesson; a reload starts a new display choice.
      await page.reload();
      await expect(
        selector.getByRole("button", { name: S.armInputHex, exact: true }),
      ).toHaveAttribute("aria-pressed", "true");
      if (width === 375)
        await page.addStyleTag({
          content: "#armInputFormats button { font-family: 'DejaVu Sans', sans-serif; }",
        });
      await page.evaluate(() => document.fonts.ready);
      for (const [label, expression, format] of formats) {
        const button = selector.getByRole("button", { name: label, exact: true });
        await button.focus();
        await page.keyboard.press(format === "signed" ? "Space" : "Enter");
        await expect(button).toBeFocused();
        await expect(button).toHaveAttribute("type", "button");
        await expect(button).toHaveAttribute("aria-pressed", "true");
        await expect(selector.locator('[aria-pressed="true"]')).toHaveCount(1);
        await expect(page.locator("#armInputValues")).toHaveText(expression);
        await expect(page.locator("#armInputReadingsMatch")).toBeVisible({
          visible: format !== "hex",
        });
        await expect(page.locator("#armFeedback")).toBeEmpty();
        await expect(
          page.locator("#arm [data-fixed-result],#arm [data-result-reading]"),
        ).toHaveCount(0);
        const geometry = await selector.evaluate((node) => ({
          overflow: document.documentElement.scrollWidth > window.innerWidth,
          buttons: [...node.querySelectorAll("button")].map((button) => {
            const box = button.getBoundingClientRect();
            const text = document.createRange();
            text.selectNodeContents(button);
            return {
              height: box.height,
              contained: [...text.getClientRects()].every(
                (line) =>
                  line.left >= box.left &&
                  line.right <= box.right &&
                  line.top >= box.top &&
                  line.bottom <= box.bottom,
              ),
            };
          }),
        }));
        expect(geometry.overflow).toBe(false);
        for (const button of geometry.buttons) {
          expect(button.height).toBeGreaterThanOrEqual(44);
          expect(button.contained).toBe(true);
        }
      }
      await expect(page.locator("#armRanges")).toContainText("4,294,967,295");
      await expect(page.locator("#armRanges")).toContainText("−2,147,483,648");
    }

    await choose(page, "arm-choice", 0);
    const draft = await stored(page);
    await selector.getByRole("button", { name: S.armInputUnsigned, exact: true }).click();
    await expect(page.locator('input[name="arm-choice"][value="0"]')).toBeChecked();
    expect(await stored(page)).toEqual(draft);
    await expect(page.locator("#armFeedback")).toBeEmpty();
    await page.locator("#armForm button[type=submit]").click();
    await expect(page.locator("#armFeedback [data-correct]")).toHaveAttribute(
      "data-correct",
      "false",
    );
    await expect(page.locator('[data-result-reading="unsigned"]')).toHaveText("2,147,483,648");
    await expect(page.locator('[data-result-reading="signed"]')).toHaveText("−2,147,483,648");
    const saved = await stored(page);
    const feedback = await page.locator("#armFeedback").innerHTML();
    const result = await page.locator("[data-fixed-result]").elementHandle();
    for (const [label, expression] of formats) {
      await selector.getByRole("button", { name: label, exact: true }).click();
      await expect(page.locator("#armInputValues")).toHaveText(expression);
      expect(await stored(page)).toEqual(saved);
      expect(await page.locator("#armFeedback").innerHTML()).toBe(feedback);
      expect(await result!.evaluate((node) => node.isConnected)).toBe(true);
    }
    await page.reload();
    await expect(
      selector.getByRole("button", { name: S.armInputHex, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-result-reading="unsigned"]')).toHaveText("2,147,483,648");
    await expect(page.locator('[data-result-reading="signed"]')).toHaveText("−2,147,483,648");
    await expect(page.locator("#arm details")).toHaveCount(0);
    await selector.getByRole("button", { name: S.armInputSigned, exact: true }).click();
    await page.locator("#clearPrediction").click();
    await expect(
      selector.getByRole("button", { name: S.armInputSigned, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#arm [data-fixed-result],#arm [data-result-reading]")).toHaveCount(
      0,
    );
    await expect(page.locator("#armFeedback")).toBeEmpty();
    await expect(page.locator('input[name="arm-choice"]:checked')).toHaveCount(0);
    expect(errors).toEqual([]);
  });
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
      await expect(page.locator("#arm [data-fixed-result], #followup .flag")).toHaveCount(0);
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
      await expect(page.locator("#armFeedback [data-fixed-result]")).toHaveCount(0);
      await choose(page, "arm-choice", 1);
      await page.locator("#armForm button[type=submit]").click();
      await expect(page.locator("#armFeedback [data-correct]")).toHaveAttribute(
        "data-correct",
        "true",
      );
      await expect(page.locator("#armFeedback [data-fixed-result]")).toHaveCount(1);
      await page.locator("#clearPrediction").click();
      await expect(page.locator("#armFeedback [data-fixed-result]")).toHaveCount(0);
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
    await expect(page.locator("#arm [data-fixed-result],#arm [data-result-reading]")).toHaveCount(
      0,
    );
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
    await expect(page.locator("#arm [data-fixed-result],#arm [data-result-reading]")).toHaveCount(
      0,
    );
    await page.locator("#clearMini").click();
    await expect(page.locator("#miniForm input:checked")).toHaveCount(0);
  });
  test(`checked feedback compares both result readings without extra panels (${theme})`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await open(page, theme);
    await expect(page.locator("#arm details,#armInspection,#explorer,#columnTrace")).toHaveCount(0);
    await expect(page.locator("#armFeedback [data-fixed-result]")).toHaveCount(0);
    await page.locator("#armForm button[type=submit]").click();
    await expect(page.locator("#armFeedback")).toHaveText(S.choosePrediction);
    await expect(page.locator("#armFeedback [data-fixed-result]")).toHaveCount(0);
    const model = flagsModel(PLUS, 32, 0x7fffffff, 1);
    for (const choice of [0, 1, 2, 3]) {
      await choose(page, "arm-choice", choice);
      await expect(page.locator("#armFeedback")).toBeEmpty();
      await page.locator("#armForm button[type=submit]").click();
      await expect(page.locator("#armFeedback [data-correct]")).toHaveAttribute(
        "data-correct",
        String(choice === 1),
      );
      expect((await stored(page)).slots["predict-readings"]).toEqual({
        choice: ["both", "unsigned", "signed", "neither"][choice],
      });
      await expect(page.locator("#armFeedback [data-fixed-result]")).toHaveText(model.result.hex);
      for (const reading of ["unsigned", "signed"] as const) {
        await expect(page.locator(`[data-result-reading="${reading}"]`)).toBeVisible();
        await expect(page.locator(`[data-result-reading="${reading}"]`)).toHaveText(
          BigInt(model.result[reading]).toLocaleString("en-GB").replace(/^-/, "−"),
        );
      }
      await expect(page.locator("#armFeedback")).toContainText("Exact sum: 2,147,483,648");
      await expect(page.locator("#armFeedback")).toContainText(S.armUnsignedMatch);
      await expect(page.locator("#armFeedback")).toContainText(S.armSignedDifference);
      await expect(page.locator("#armFeedback")).toContainText(`C = ${model.flags.c}`);
      await expect(page.locator("#armFeedback")).toContainText(`V = ${model.flags.v}`);
      await expect(page.locator("#armFeedback")).toContainText(S.armExplanation);
      await expect(page.locator("#arm details,#armInspection,#explorer,#columnTrace")).toHaveCount(
        0,
      );
      const feedback = await page.locator("#armFeedback").innerHTML();
      await page.reload();
      expect(await page.locator("#armFeedback").innerHTML()).toBe(feedback);
    }
    // Legacy presentation fields cannot recreate removed panels or bypass an unsubmitted draft.
    await page.evaluate(
      ([key, slot]) => {
        const value = JSON.parse(localStorage.getItem(key)!);
        Object.assign(value.slots[slot].arm, {
          open: true,
          bits: true,
          trace: true,
          done: 32,
          reading: "signed",
          draft: 1,
        });
        localStorage.setItem(key, JSON.stringify(value));
      },
      [KEY, FLAGS_VIEW_SLOT] as const,
    );
    await page.reload();
    await expect(page.locator('input[name="arm-choice"][value="1"]')).toBeChecked();
    await expect(page.locator("#armFeedback")).toBeEmpty();
    await expect(page.locator("#arm details,#armInspection,#explorer,#columnTrace")).toHaveCount(0);
    await page.locator("#armForm button[type=submit]").click();
    await expect(page.locator("#armFeedback [data-correct]")).toHaveAttribute(
      "data-correct",
      "true",
    );
    await expect(page.locator("#flagsLogic")).toHaveCount(1);
    await page.locator("#clearPrediction").click();
    await expect(page.locator("#armFeedback")).toBeEmpty();
    await expect(page.locator('input[name="arm-choice"]:checked')).toHaveCount(0);
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
      "fourth-n": "1",
      "fourth-z": "0",
      "fourth-c": "0",
      "fourth-v": "1",
      "fifth-n": "1",
      "fifth-z": "0",
      "fifth-c": "0",
      "fifth-v": "0",
      "sixth-n": "0",
      "sixth-z": "1",
      "sixth-c": "0",
      "sixth-v": "0",
    });
    expect(saved.challenges["predict-flags"].firstPassedAt).toBeDefined();
    await page.reload();
    await expect(c).toHaveAttribute("data-complete", "true");
    await expect(c.locator(".hints-list li")).toHaveCount(1);
    await page.locator('#caseTabs button[data-case="2"]').click();
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
    await expect(page.locator("#challenge-predict-flags")).toHaveAttribute(
      "data-complete",
      "false",
    );
    for (let i = 0; i < 3; i++)
      await expect(page.locator(`#caseTabs button[data-case="${i}"] .pass-mark`)).toHaveText(
        S.passed,
      );
    for (let i = 3; i < correct.length; i++) {
      await page.locator(`#caseTabs button[data-case="${i}"]`).click();
      await expect(page.locator("#realForm input:checked")).toHaveCount(0);
      await commitCase(page, i, correct[i]!);
    }
    await expect(page.locator("#challenge-predict-flags")).toHaveAttribute("data-complete", "true");
    await expect(page.locator("#armFeedback [data-fixed-result]")).toHaveCount(1);
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
    await expect(
      page.locator("#followup .flag,#arm [data-fixed-result],#arm [data-result-reading]"),
    ).toHaveCount(0);
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
