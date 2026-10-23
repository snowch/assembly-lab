// Copyright © 2026 Christopher Snow

// What the two lessons of Module 1 share in the browser: the page's errors, opening a lesson, the
// pointer a screen has, a prediction's commit, a challenge's controls, and a check that Module 1's
// figures stay inside the boxes that hold them.

import { expect, type Locator, type Page } from "@playwright/test";

import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { DEFAULT_STRINGS as S, format } from "../../platform/lesson-runtime/src/strings";

/** Everything the page logs as an error, or throws, until the test ends. */
export function watchErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`page: ${e.message}`));
  return errors;
}

export async function openLesson(page: Page, id: string): Promise<void> {
  await page.goto(`#/lesson/${id}`);
  await expect(page.locator("section.lesson-section")).toHaveCount(10);
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

export const storageKey = (id: string) => `assembly-lab:v1:${id}`;

export const stored = (page: Page, id: string) =>
  page.evaluate((k) => JSON.parse(localStorage.getItem(k) ?? "null"), storageKey(id));

export const challenge = (page: Page, id: string) =>
  page.locator(`section.challenge[data-challenge="${id}"]`);
export const status = (c: Locator) => c.locator(".challenge-status");
export const run = (c: Locator) => c.getByRole("button", { name: S.challenge.run });
export const passing = (total: number) => format(S.challenge.passing, { total });
export const failing = (passed: number, total: number) =>
  format(S.challenge.failing, { passed, total });
export const { blocked, complete } = S.challenge;

/** The page's pointer: a tap on a touch screen, a click with a mouse. */
export async function press(page: Page, target: Locator): Promise<void> {
  if (page.viewportSize()!.width < 500) await target.tap();
  else await target.click();
}

/** Chooses an option of a prediction and checks it. */
export async function commit(page: Page, id: string, option: string | RegExp): Promise<Locator> {
  const figure = page.locator(`#ix-${id}`);
  await figure.scrollIntoViewIfNeeded();
  await figure.getByRole("radio", { name: option, exact: typeof option === "string" }).check();
  await press(page, figure.getByRole("button", { name: V.prediction.commit }));
  return figure;
}

export const registerValue = (figure: Locator, name: string) =>
  figure.locator(`[data-register="${name}"] :is(.al-reg-value, .al-dreg-value)`);

/** A bit's button, in a figure or a challenge: bit 31 is the top bit. */
export const bit = (where: Locator, n: number) =>
  where.getByRole("button", { name: V.toggles.bit(n), exact: true });

/** Presses the bits of a pattern (32 characters, the top bit first) that are 1. */
export async function setBits(page: Page, where: Locator, pattern: string): Promise<void> {
  for (let i = 0; i < 32; i++) if (pattern[i] === "1") await press(page, bit(where, 31 - i));
}

/**
 * Module 1's figures are inside the boxes that hold them: no row of bits, reading, comparison or
 * register wider than its box, and nothing outside the page's width.
 */
export async function figureOverflow(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const out: string[] = [];
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== "hidden";
    };
    for (const el of document.querySelectorAll(
      ".al-toggles, .al-nibble, .al-readings, .al-reading, .al-pattern, .al-top-table, .al-compare-row, .al-wide, .al-half, .al-h16-pair, .al-h16, .al-tester, .answer-hex",
    )) {
      if (!visible(el)) continue;
      if (el.scrollWidth > el.clientWidth + 1)
        out.push(`${el.className} is ${el.scrollWidth - el.clientWidth}px wider than its box`);
    }
    const width = document.documentElement.clientWidth;
    for (const el of document.querySelectorAll("figure.interactive *")) {
      // A listing scrolls sideways as one contained piece, so its children can sit past the
      // page's width inside it; the listing itself, not the page, carries that scroll.
      if (!visible(el) || el.closest(".visually-hidden") || el.closest(".al-listing")) continue;
      const r = el.getBoundingClientRect();
      if (r.right > width + 1)
        out.push(`${el.className || el.tagName} reaches ${Math.round(r.right)}px`);
    }
    return out;
  });
}
