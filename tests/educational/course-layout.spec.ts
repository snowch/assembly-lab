// Copyright © 2026 Christopher Snow

// The approved appearance is the ordinary course shell, including its real section outline.
// These checks drive production routes rather than retaining a comparison-only build.
import { expect, test, type Page } from "@playwright/test";
import { LESSONS } from "@al/content";
import { FLAGS_LESSON_SECTIONS } from "@al/views";
import { watchErrors } from "./module1";

test.use({ contextOptions: { reducedMotion: "reduce" } });

async function settledScroll(page: Page) {
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

async function outline(page: Page) {
  const phone = page.viewportSize()!.width <= 760;
  if (phone) {
    const disclosure = page.locator(".lesson-outline-mobile");
    if (!(await disclosure.evaluate((el) => (el as HTMLDetailsElement).open))) {
      await disclosure.locator(":scope > summary").focus();
      await page.keyboard.press("Enter");
    }
  }
  return page.locator(phone ? ".lesson-outline-mobile nav" : ".lesson-outline-desktop nav");
}

async function selectSection(page: Page, edge: "first" | "last") {
  const nav = await outline(page);
  const link = edge === "first" ? nav.locator("a").first() : nav.locator("a").last();
  const id = (await link.getAttribute("href"))!.slice(1);
  const hash = new URL(page.url()).hash;
  await link.focus();
  await page.keyboard.press("Enter");
  await settledScroll(page);
  expect(new URL(page.url()).hash).toBe(hash);
  const target = page.locator(`[id="${id}"]`);
  expect(await target.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await expect(link).toHaveAttribute("aria-current", "location");
  const bounds = await page.evaluate(() => ({
    focus: document.activeElement!.getBoundingClientRect().top,
    header: document.querySelector(".shell-header")!.getBoundingClientRect().bottom,
  }));
  expect(bounds.focus).toBeGreaterThanOrEqual(bounds.header - 1);
  if (page.viewportSize()!.width <= 760)
    await expect(page.locator(".lesson-outline-mobile")).not.toHaveAttribute("open");
}

for (const theme of ["light", "dark"] as const) {
  for (let start = 0; start < LESSONS.length; start += 16) {
    const batch = LESSONS.slice(start, start + 16);
    test(`shared outline reaches real sections in ${theme}, lessons ${start + 1}-${start + batch.length}`, async ({
      page,
    }, info) => {
      test.setTimeout(120_000);
      // The desktop project covers both available-column layouts; the phone project covers touch.
      const widths = info.project.name === "phone" ? [375] : [834, 1280];
      await page.addInitScript((value) => {
        localStorage.setItem("assembly-lab:v1:theme", value);
        localStorage.setItem("assembly-lab:v1:style-preview", "current");
      }, theme);
      const errors = watchErrors(page);
      for (const width of widths) {
        await page.setViewportSize({ width, height: 1000 });
        for (const lesson of batch) {
          await page.goto(`?style=current#/lesson/${lesson.id}`);
          await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
          await page.evaluate(async () => document.fonts.ready);
          await expect(page.locator(".lesson-layout")).toHaveCount(1);
          await expect(page.locator(".style-preview-controls,.style-preview-choices")).toHaveCount(
            0,
          );
          await expect(page.locator("html")).not.toHaveAttribute("data-style-preview");
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
          expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
            theme === "light" ? "rgb(247, 250, 248)" : "rgb(16, 27, 26)",
          );
          const nav = await outline(page);
          await expect(nav).toHaveAttribute("aria-label", "On this page");
          const entries =
            lesson.id === "adding-and-the-flags"
              ? FLAGS_LESSON_SECTIONS.map((section) => ({ id: section.id, title: section.label }))
              : lesson.sections.map((section) => ({
                  id: `section-${section.kind}`,
                  title: section.title,
                }));
          await expect(nav.locator("a")).toHaveCount(entries.length);
          for (const entry of entries) {
            await expect(nav.locator(`a[href="#${entry.id}"]`)).toContainText(entry.title);
            await expect(page.locator(`[id="${entry.id}"]`)).toHaveCount(1);
          }
          await selectSection(page, "first");
          await selectSection(page, "last");
          expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
            `${lesson.id} at ${width}px`,
          ).toBe(true);
        }
      }
      expect(errors).toEqual([]);
    });
  }

  test(`shared navigation keeps entered work, grades, hints and notes in ${theme}`, async ({
    page,
  }) => {
    await page.addInitScript(
      (value) => localStorage.setItem("assembly-lab:v1:theme", value),
      theme,
    );
    await page.goto("#/lesson/register-widths");
    const challenge = page.locator('[data-challenge="predict-two-registers"]');
    const x1 = challenge.locator('[data-field="x1"] input');
    await x1.fill("0x5");
    await challenge.locator('[data-field="w2"] input').fill("1000000");
    await challenge.getByRole("button", { name: /Show hint/ }).click();
    const hint = await challenge.locator(".hints-list").textContent();
    const notes = challenge.locator(".al-working-notes");
    await notes.locator(":scope > summary").click();
    await notes
      .getByLabel("Your working notes", { exact: true })
      .fill("Separate the two registers.");
    const calculator = challenge.locator('.al-programmer-calculator[data-preset="widths"]');
    await calculator.locator(":scope > summary").click();
    await calculator.getByLabel("Value to enter", { exact: true }).fill("42");
    await calculator.getByLabel("Value to enter", { exact: true }).press("Enter");
    const node = await x1.elementHandle();
    await selectSection(page, "first");
    await selectSection(page, "last");
    expect(await x1.evaluate((el, before) => el === before, node)).toBe(true);
    await expect(x1).toHaveValue("0x5");
    await expect(calculator.locator("output[data-reading]")).toHaveText("42");
    await expect(challenge.locator(".hints-list")).toHaveText(hint!);
    await expect(notes.getByLabel("Your working notes", { exact: true })).toHaveValue(
      "Separate the two registers.",
    );
    await challenge.getByRole("button", { name: "Run tests", exact: true }).click();
    await expect(challenge.locator(".challenge-complete")).toHaveCount(1);
    await selectSection(page, "first");
    await selectSection(page, "last");
    await expect(challenge.locator(".challenge-complete")).toHaveCount(1);
    await expect(calculator.locator("output[data-reading]")).toHaveText("42");
    await page.reload();
    await expect(challenge.locator(".challenge-complete")).toHaveCount(1);
    await expect(challenge.locator(".hints-list")).toHaveText(hint!);
    await expect(calculator).not.toHaveAttribute("open");
    await notes.locator(":scope > summary").click();
    await expect(notes.getByLabel("Your working notes", { exact: true })).toHaveValue(
      "Separate the two registers.",
    );
    await page.goto("#/lesson/one-addition");
    await page.goto("#/lesson/register-widths");
    await expect(challenge.locator(".challenge-complete")).toHaveCount(1);
    await expect(x1).toHaveValue("0x5");
    await expect(challenge.locator(".hints-list")).toHaveText(hint!);
  });
}

test("the last outline entry stays current at a clamped page bottom and updates when scrolling back", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1200 });
  await page.goto("#/lesson/register-widths");
  await page.evaluate(async () => document.fonts.ready);
  await selectSection(page, "last");
  await expect
    .poll(() =>
      page.evaluate(() => Math.abs(scrollY + innerHeight - document.documentElement.scrollHeight)),
    )
    .toBeLessThanOrEqual(2);
  await selectSection(page, "first");
  await expect(page.locator(".lesson-outline-desktop nav a").last()).not.toHaveAttribute(
    "aria-current",
  );
});

test("the compact header and keyboard skip link work without a preview strip", async ({ page }) => {
  await page.goto("?style=new#/lesson/register-widths");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  const header = await page.locator(".shell-header").boundingBox();
  expect(header!.y).toBe(0);
  expect(header!.height).toBeLessThanOrEqual(page.viewportSize()!.width <= 760 ? 68 : 74);
  await page.locator(".skip-link").focus();
  expect(
    await page.locator(".skip-link").evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return el.contains(
        document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2),
      );
    }),
  ).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  await expect(page).toHaveURL(/#\/lesson\/register-widths$/);
});
