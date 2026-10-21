// Copyright © 2026 Christopher Snow

// The course's execution highlighting, in a browser, on the built site, at desktop and phone
// widths, in both themes: after the second `add` has run, the C line it carries out and the
// instruction itself carry the same primary treatment (the same fill and the same solid left
// stripe), and the instruction that runs next carries a different one (an arrow and a dotted
// edge, never the executed fill). The styles are read from the rendered rows, so a DOM-only
// agreement cannot pass this: the appearance is what is checked.

import { expect, test, type Locator, type Page } from "@playwright/test";

import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { STRINGS } from "../../apps/course/src/strings";

import { LABELS } from "../../content/lessons/meet-the-machine.labels";

const LESSON_ID = "meet-the-machine";

async function openLesson(page: Page): Promise<void> {
  await page.goto(`#/lesson/${LESSON_ID}`);
  await expect(page.locator("section.lesson-section")).toHaveCount(10);
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

/** Chooses an option and checks the prediction. */
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

/** The page's pointer: a tap on a touch screen, a click with a mouse. */
async function press(page: Page, target: Locator): Promise<void> {
  if (page.viewportSize()!.width < 500) await target.tap();
  else await target.click();
}

/** The row styles that carry the executed/next meanings: the fill, the left edge's style and
 * colour, and the marker column's arrow. */
interface RowStyle {
  background: string;
  borderLeftStyle: string;
  borderLeftColor: string;
  arrow: boolean;
}

async function rowStyle(row: Locator): Promise<RowStyle> {
  return row.evaluate((e) => {
    const cs = getComputedStyle(e);
    return {
      background: cs.backgroundColor,
      borderLeftStyle: cs.borderLeftStyle,
      borderLeftColor: cs.borderLeftColor,
      arrow: getComputedStyle(e.querySelector(".al-mark")!, "::before").borderLeftWidth !== "0px",
    };
  });
}

const themes = [
  { name: "light", value: "light", label: STRINGS.themeLight },
  { name: "dark", value: "dark", label: STRINGS.themeDark },
] as const;

for (const theme of themes) {
  test.describe(`the executed and next rows, ${theme.name} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await openLesson(page);
      await page.getByLabel(STRINGS.theme).selectOption({ label: theme.label });
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme.value);
      await commit(page, "predict-total", /^In w0/);
    });

    test("the C line and the instruction that ran share one treatment, and next is different", async ({
      page,
    }) => {
      const figure = page.locator("#ix-step-trip");
      await figure.scrollIntoViewIfNeeded();
      // Run the two adds: `add w0, w0, w1`, then `add w0, w0, w2`.
      await press(page, figure.getByRole("button", { name: V.stepper.next }));
      await press(page, figure.getByRole("button", { name: V.stepper.next }));

      const litC = figure.locator('.al-cline[data-lit="true"]');
      await expect(litC).toHaveAttribute("data-line", "4");
      const ran = figure.locator('.al-insn[data-ran="true"]');
      await expect(ran.locator(".al-text")).toHaveText("add w0, w0, w2");
      const next = figure.locator('.al-insn[data-next="true"]');
      await expect(next.locator(".al-text")).toHaveText("sub w0, w0, w3");

      const cStyle = await rowStyle(litC);
      const ranStyle = await rowStyle(ran);
      const nextStyle = await rowStyle(next);

      // One execution event, one primary treatment: the C row and the instruction row match.
      expect(ranStyle.background).toBe(cStyle.background);
      expect(ranStyle.borderLeftStyle).toBe("solid");
      expect(ranStyle.borderLeftColor).toBe(cStyle.borderLeftColor);
      expect(cStyle.borderLeftStyle).toBe("solid");
      // The executed fill is the accent's soft fill, not a plain or error background.
      const accentSoft = await page.evaluate(() =>
        getComputedStyle(document.body).getPropertyValue("--accent-soft").trim(),
      );
      expect(ranStyle.background).not.toBe("rgba(0, 0, 0, 0)");
      expect(accentSoft.length).toBeGreaterThan(0);

      // Next is marked, and differently: the arrow is there, the fill is not the executed one,
      // and the edge is not the executed solid stripe.
      expect(nextStyle.arrow).toBe(true);
      expect(ranStyle.arrow).toBe(false);
      expect(nextStyle.background).not.toBe(ranStyle.background);
      expect(nextStyle.borderLeftStyle).toBe("dotted");
      expect(nextStyle.borderLeftColor).not.toBe(ranStyle.borderLeftColor);

      // The marks are legible: the executed text stays readable on its fill.
      const contrast = await figure.evaluate((el) => {
        const row = el.querySelector<HTMLElement>('.al-insn[data-ran="true"] .al-text')!;
        const cs = getComputedStyle(row);
        const bg = getComputedStyle(row.closest(".al-insn")!).backgroundColor;
        return { color: cs.color, background: bg };
      });
      expect(contrast.color).not.toBe(contrast.background);
    });

    test("before the first step only next is marked, and at the end only the last row is", async ({
      page,
    }) => {
      const figure = page.locator("#ix-step-trip");
      await figure.scrollIntoViewIfNeeded();
      // Fresh: the arrow, no executed row, no lit C line.
      await expect(figure.locator('.al-insn[data-ran="true"]')).toHaveCount(0);
      await expect(figure.locator('.al-cline[data-lit="true"]')).toHaveCount(0);
      const firstNext = figure.locator('.al-insn[data-next="true"]');
      await expect(firstNext.locator(".al-text")).toHaveText("add w0, w0, w1");
      const freshStyle = await rowStyle(firstNext);
      expect(freshStyle.arrow).toBe(true);
      expect(freshStyle.background).toBe("rgba(0, 0, 0, 0)");

      // Run to the end: the last instruction keeps the executed treatment, and nothing is next.
      for (let k = 0; k < 4; k++)
        await press(page, figure.getByRole("button", { name: V.stepper.next }));
      await expect(figure.locator('.al-insn[data-next="true"]')).toHaveCount(0);
      const last = figure.locator('.al-insn[data-ran="true"]');
      await expect(last.locator(".al-text")).toHaveText("ret");
      const lastStyle = await rowStyle(last);
      expect(lastStyle.borderLeftStyle).toBe("solid");
      expect(lastStyle.background).not.toBe("rgba(0, 0, 0, 0)");
    });

    test("back and reset return the marks to the earlier and the initial state", async ({
      page,
    }) => {
      const figure = page.locator("#ix-step-trip");
      await figure.scrollIntoViewIfNeeded();
      await press(page, figure.getByRole("button", { name: V.stepper.next }));
      await press(page, figure.getByRole("button", { name: V.stepper.next }));
      await press(page, figure.getByRole("button", { name: V.stepper.back }));
      await expect(figure.locator('.al-insn[data-ran="true"] .al-text')).toHaveText(
        "add w0, w0, w1",
      );
      await expect(figure.locator('.al-cline[data-lit="true"]')).toHaveAttribute("data-line", "3");
      await expect(figure.locator('.al-insn[data-next="true"] .al-text')).toHaveText(
        "add w0, w0, w2",
      );
      await press(page, figure.getByRole("button", { name: V.stepper.reset }));
      await expect(figure.locator('.al-insn[data-ran="true"]')).toHaveCount(0);
      await expect(figure.locator('.al-cline[data-lit="true"]')).toHaveCount(0);
      await expect(figure.locator('.al-insn[data-next="true"] .al-text')).toHaveText(
        "add w0, w0, w1",
      );
    });
  });
}
