// Copyright © 2026 Christopher Snow

import { expect, test, type Locator, type Page } from "@playwright/test";
import { fourBitReadings } from "@al/views";
import { readingsOfPattern, patternOf, shown } from "../../packages/views/src/readings";
import { designProblems } from "./design";
import { lessonLabel } from "./lesson-references";
import { openLesson, watchErrors } from "./module1";

const figure = (page: Page, stage: string) => page.locator(`#ix-reading-${stage}`);
const task = (page: Page, kind: "practice" | "transfer") =>
  page.locator(`[data-reading-task="${kind}"]`);
const field = (form: Locator, name: string) => form.locator(`[name="${name}"]`);
const grouped = (value: number) => shown(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
const practice = fourBitReadings("1001");
const transfer = readingsOfPattern(patternOf((1n << 31n) + 2n));

async function fillTask(form: Locator, values: { unsigned: number; signed: number }) {
  await field(form, "unsigned").fill(grouped(values.unsigned));
  await field(form, "signed").fill(grouped(values.signed));
  await field(form, "reason").fill(
    "The highest weight is negative only for the signed reading. The lower weights stay positive. Reading changes no stored bit.",
  );
  const cleared = field(form, "cleared");
  if (await cleared.count())
    await cleared.fill("The highest position keeps its weight but a clear bit contributes zero.");
}

for (const theme of ["light", "dark"] as const) {
  test(`worked unsigned, signed and 32-bit examples are visible on the required route in ${theme}`, async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await page.goto("#/");
    await page.locator("select").selectOption(theme);
    await openLesson(page, "same-bits-two-readings");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    expect(
      await page
        .locator(".al-reading-sequence")
        .evaluateAll((figures) => figures.map((el) => el.getAttribute("data-stage"))),
    ).toEqual(["unsigned", "signed", "practice", "explore", "bridge", "transfer"]);
    expect(
      await page
        .locator('.lesson-section[data-kind="motivation"] > figure')
        .evaluateAll((figures) => figures.map((el) => el.id)),
    ).toEqual(["ix-reading-signed", "ix-reading-practice", "ix-reading-explore"]);
    await expect(page.locator('.lesson-section[data-kind="reflection"]')).toHaveCount(0);
    const appendix = page.locator("#ix-make-minus-three-solved > .figure-after a");
    await expect(appendix).toHaveText(
      lessonLabel("twos-complement", "More about two’s complement in Appendix B"),
    );
    await expect(appendix).toHaveAttribute("href", "#/lesson/twos-complement");
    await expect(appendix).toBeVisible();
    const unsigned = figure(page, "unsigned");
    const signed = figure(page, "signed");
    const bridge = figure(page, "bridge");
    for (const panel of [unsigned, signed]) {
      await expect(panel).toBeVisible();
      await expect(panel.locator("[data-sum]").first()).toBeVisible();
      await expect(panel.locator("details:not([open]) [data-sum]")).toHaveCount(0);
    }
    await expect(unsigned.getByRole("row").nth(2).getByRole("cell")).toHaveText([
      "0",
      "0",
      "1",
      "1",
    ]);
    await expect(unsigned.getByRole("row").nth(3).getByRole("cell")).toHaveText([
      "1",
      "0",
      "1",
      "1",
    ]);
    await expect(signed.getByRole("row").nth(1).getByRole("cell")).toHaveText(["1", "0", "1", "1"]);
    await expect(signed).toContainText("0011");
    await expect(signed.locator('[data-sum="signed"]').first()).toContainText(
      `= ${shown(fourBitReadings("1011").signed)}`,
    );
    await expect(bridge).toBeVisible();
    await expect(bridge.locator("code").filter({ hasText: " + 0 = " })).toHaveCount(2);
    await expect(bridge).toContainText("31");
    await expect(bridge).toContainText("2,147,483,648");
    await expect(bridge).toContainText("−2,147,483,648");
    for (const kind of ["practice", "transfer"] as const) {
      const form = task(page, kind);
      await expect(form.locator("[data-feedback]")).toHaveCount(0);
      await expect(field(form, "unsigned")).toHaveValue("");
      await expect(field(form, "signed")).toHaveValue("");
      await expect(form.locator("[data-sum]")).toHaveCount(0);
    }
    await expect(task(page, "transfer")).not.toContainText(grouped(transfer.unsigned));
    await expect(task(page, "transfer")).not.toContainText(grouped(transfer.signed));
    await expect(
      page.locator('#ix-read-register, [data-challenge="two-readings-each"]'),
    ).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test(`practice validates numbers and required explanations before unlocking exploration in ${theme}`, async ({
    page,
  }) => {
    await page.goto("#/");
    await page.locator("select").selectOption(theme);
    await openLesson(page, "same-bits-two-readings");
    const form = task(page, "practice");
    const explore = figure(page, "explore");
    await expect(explore.locator("button[data-bit]")).toHaveCount(0);
    const check = form.getByRole("button", { name: "Check readings", exact: true });
    await check.click();
    await expect(form.locator("[data-feedback]")).toHaveCount(0);
    await expect(field(form, "unsigned")).toBeFocused();
    await fillTask(form, practice);
    for (const invalid of ["9 cats", "9.5", "1,23", "0x9"]) {
      await field(form, "unsigned").fill(invalid);
      await check.click();
      await expect(form.locator("[data-feedback]")).toHaveCount(0);
      await expect(form.getByRole("status")).toContainText(
        "Enter decimal whole numbers and complete each explanation.",
      );
      await expect(explore.locator("button[data-bit]")).toHaveCount(0);
    }
    await field(form, "unsigned").fill(String(practice.unsigned));
    await field(form, "reason").fill(" ");
    await check.click();
    await expect(form.locator("[data-feedback]")).toHaveCount(0);
    await expect(explore.locator("button[data-bit]")).toHaveCount(0);
    await fillTask(form, practice);
    // The typographic minus sign is the notation used in the worked examples.
    await check.focus();
    await page.keyboard.press("Enter");
    await expect(form.getByRole("status")).toContainText(
      "Only your numeric readings are checked automatically.",
    );
    await expect(form.getByRole("status")).toContainText("Both readings match the model.");
    await expect(explore.locator("button[data-bit]")).toHaveCount(4);
  });

  test(`transfer, practice and exploration keep independent work and reset state in ${theme}`, async ({
    page,
  }) => {
    await page.goto("#/");
    await page.locator("select").selectOption(theme);
    await openLesson(page, "same-bits-two-readings");
    const small = task(page, "practice");
    const large = task(page, "transfer");
    await expect(large.locator("[data-pattern]")).toHaveAttribute("data-pattern", transfer.pattern);
    await fillTask(large, transfer);
    await field(large, "cleared").fill(" ");
    await large.getByRole("button", { name: "Check readings", exact: true }).click();
    await expect(large.locator("[data-feedback]")).toHaveCount(0);
    await fillTask(large, { unsigned: 0, signed: 0 });
    await large.getByRole("button", { name: "Check readings", exact: true }).click();
    await expect(large.getByRole("status")).toContainText(
      "At least one reading differs from the model.",
    );
    await expect(large.getByRole("status")).toContainText(grouped(transfer.unsigned));
    await expect(large.getByRole("status")).toContainText(grouped(transfer.signed));
    await fillTask(large, transfer);
    await large.getByRole("button", { name: "Check readings", exact: true }).click();
    await expect(large.getByRole("status")).toContainText("Both readings match the model.");
    await page.reload();
    await expect(field(large, "cleared")).toHaveValue(
      "The highest position keeps its weight but a clear bit contributes zero.",
    );
    await expect(large.getByRole("status")).toContainText(
      "Only your numeric readings are checked automatically.",
    );
    await expect(small.locator("[data-feedback]")).toHaveCount(0);
    await expect(field(small, "unsigned")).toHaveValue("");
    // Any complete attempt opens exploration, including an incorrect numeric attempt.
    await fillTask(small, { unsigned: 0, signed: 0 });
    await small.getByRole("button", { name: "Check readings", exact: true }).click();
    await expect(small.getByRole("status")).toContainText(
      "At least one reading differs from the model.",
    );
    const before = await large.innerText();
    const explore = figure(page, "explore");
    await explore.locator("summary").click();
    const top = explore.locator('button[data-bit="3"]');
    await top.focus();
    await page.keyboard.press("Space");
    await expect(top).toHaveAttribute("aria-pressed", "true");
    await expect(explore.locator('[data-sum="signed"]')).toContainText("= −5");
    await explore.getByRole("button", { name: /reset/i }).click();
    await expect(top).toHaveAttribute("aria-pressed", "false");
    await expect(explore.locator('[data-sum="signed"]')).toContainText("= 3");
    expect(await large.innerText()).toBe(before);
    await expect(large.locator("[data-pattern]")).toHaveAttribute("data-pattern", transfer.pattern);
    await expect(field(large, "unsigned")).toHaveValue(grouped(transfer.unsigned));
    await expect(field(large, "signed")).toHaveValue(grouped(transfer.signed));
    await small.getByRole("button", { name: "Try again", exact: true }).click();
    await expect(small.locator("[data-feedback]")).toHaveCount(0);
    await expect(large.getByRole("status")).toBeVisible();
    await expect(field(large, "unsigned")).toHaveValue(grouped(transfer.unsigned));
    await expect(explore.locator("button[data-bit]")).toHaveCount(0);
  });

  test(`the sequence and submitted feedback fit 320px in ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto("#/");
    await page.locator("select").selectOption(theme);
    await openLesson(page, "same-bits-two-readings");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    expect(await designProblems(page, true)).toEqual([]);
    for (const kind of ["practice", "transfer"] as const) {
      const form = task(page, kind);
      await fillTask(form, kind === "practice" ? practice : transfer);
      await form.getByRole("button", { name: "Check readings", exact: true }).click();
      await expect(form.getByRole("status")).toBeVisible();
    }
    const contrasts = await page
      .locator("[data-reading-task] input, [data-reading-task] textarea")
      .evaluateAll((controls) => {
        const colour = (text: string) => {
          const parts = text.match(/[\d.]+/g)!.map(Number);
          return { rgb: parts.slice(0, 3), alpha: parts[3] ?? 1 };
        };
        const over = (front: ReturnType<typeof colour>, back: number[]) =>
          front.rgb.map((channel, i) => channel * front.alpha + back[i]! * (1 - front.alpha));
        const luminance = (rgb: number[]) =>
          rgb
            .map((channel) => {
              const s = channel / 255;
              return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
            })
            .reduce((total, channel, i) => total + channel * [0.2126, 0.7152, 0.0722][i]!, 0);
        return controls.map((control) => {
          const ancestry: Element[] = [];
          for (let el: Element | null = control; el; el = el.parentElement) ancestry.unshift(el);
          const background = ancestry.reduce(
            (back, el) => over(colour(getComputedStyle(el).backgroundColor), back),
            [255, 255, 255],
          );
          const style = getComputedStyle(control);
          const foreground = over(colour(style.color), background);
          const light = luminance(foreground),
            dark = luminance(background);
          return {
            field: `${control.closest("[data-reading-task]")!.getAttribute("data-reading-task")}.${control.getAttribute("name")}`,
            value: (control as HTMLInputElement | HTMLTextAreaElement).value,
            foreground: style.color,
            background: style.backgroundColor,
            ratio: (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05),
          };
        });
      });
    expect(contrasts).toHaveLength(7);
    for (const contrast of contrasts) {
      expect(contrast.value.trim(), contrast.field).not.toBe("");
      expect(
        contrast.ratio,
        `${contrast.field}: ${contrast.foreground} on ${contrast.background}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
    const explore = figure(page, "explore");
    await explore.locator("summary").click();
    for (const control of await explore.locator("button[data-bit]").all()) {
      const box = await control.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(40);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    }
    const overflow = await page
      .locator('[id^="ix-reading-"]')
      .evaluateAll((figures) =>
        figures.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.id),
      );
    expect(overflow).toEqual([]);
    expect(await designProblems(page, true)).toEqual([]);
  });
}
