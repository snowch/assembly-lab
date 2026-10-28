// Copyright © 2026 Christopher Snow

// What the two Module 3 specs share: opening a lesson, the page's pointer, a prediction committed,
// the bits of a row read back from the page, and the verdict's pieces.

import { expect, type Locator, type Page } from "@playwright/test";
import { LESSONS } from "@al/content";

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
  await expect(page.locator("section.lesson-section")).toHaveCount(
    LESSONS.find((lesson) => lesson.id === id)!.sections.length,
  );
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

export const challenge = (page: Page, id: string) =>
  page.locator(`section.challenge[data-challenge="${id}"]`);
export const status = (c: Locator) => c.locator(".challenge-status");
export const run = (c: Locator) => c.getByRole("button", { name: S.challenge.run });
export const passing = (total: number) => format(S.challenge.passing, { total });
export const failing = (passed: number, total: number) =>
  format(S.challenge.failing, { passed, total });

/** The page's pointer: a tap on a touch screen, a click with a mouse. */
export async function press(page: Page, target: Locator): Promise<void> {
  if (page.viewportSize()!.width < 500) await target.tap();
  else await target.click();
}

/** Chooses an option and checks the prediction. */
export async function commit(page: Page, id: string, option: string | RegExp): Promise<Locator> {
  const figure = page.locator(`#ix-${id}`);
  await figure.scrollIntoViewIfNeeded();
  await figure.getByRole("radio", { name: option }).check();
  await figure.getByRole("button", { name: V.prediction.commit }).click();
  return figure;
}

/** The 32 bits of a row of a figure, highest first, as the page draws them. */
export const rowBits = (figure: Locator, row: string) =>
  figure
    .locator(`[data-row="${row}"] .al-bit`)
    .evaluateAll((cells) => cells.map((c) => c.textContent).join(""));

/** The bit numbers a mark is on in a row of a figure. */
export const marked = (figure: Locator, row: string, mark: string) =>
  figure
    .locator(`[data-row="${row}"] .al-bit[data-${mark}="true"]`)
    .evaluateAll((cells) =>
      cells.map((c) => Number(c.getAttribute("data-bit"))).sort((a, b) => a - b),
    );

/** A word as 32 bits, highest first. */
export const pad32 = (n: number): string => (n >>> 0).toString(2).padStart(32, "0");

/** The value written beside a row, as text. */
export const rowValue = (figure: Locator, row: string) =>
  figure.locator(`[data-row="${row}"] .al-reg-value`);

/** A chip in a named group of a figure or a challenge's editor. */
export const chip = (scope: Locator, group: string, name: string) =>
  scope.getByRole("group", { name: group, exact: true }).getByRole("button", { name, exact: true });
