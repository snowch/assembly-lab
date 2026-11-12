// Copyright © 2026 Christopher Snow

import { test, expect, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { LESSONS } from "@al/content";
import { FLAGS_LESSON_SECTIONS } from "@al/views";
import { PREVIEW_STRINGS as S } from "../../apps/course/src/strings.preview";
test.use({ serviceWorkers: "block", contextOptions: { reducedMotion: "reduce" } });
const choose = (p: Page, mode: "current" | "new") =>
  p
    .locator(".style-preview-controls")
    .getByRole("button", { name: mode === "new" ? S.newStyle : S.currentStyle, exact: true })
    .click();
const captureStyle =
  ".style-preview-controls{display:none!important}.shell-header{position:relative!important;top:0!important}.preview-outline-desktop{top:112px!important}";
for (const width of [375, 834, 1280])
  for (const theme of ["light", "dark"] as const) {
    for (let start = 0; start < LESSONS.length; start += 16) {
      const batch = LESSONS.slice(start, start + 16);
      test(`all routes ${width}px ${theme}, lessons ${start + 1}-${start + batch.length}`, async ({
        page,
      }, info) => {
        await page.setViewportSize({ width, height: 1000 });
        await page.addInitScript((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        const shots: Record<string, unknown>[] = [];
        await mkdir(info.outputPath("screenshots"), { recursive: true });
        for (const lesson of batch) {
          await page.goto(`?style=current#/lesson/${lesson.id}`);
          await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
          await page.evaluate(async () => document.fonts.ready);
          const node = await page.locator(".lesson").elementHandle();
          const prose = await page.locator(".lesson .prose").allTextContents();
          for (const mode of ["current", "new"] as const) {
            if (mode === "new") await choose(page, mode);
            await expect(page.locator("html")).toHaveAttribute("data-style-preview", mode);
            expect(await page.evaluate((n) => n === document.querySelector(".lesson"), node)).toBe(
              true,
            );
            expect(await page.locator(".lesson .prose").allTextContents()).toEqual(prose);
            expect(
              await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
              `${lesson.id} ${mode}`,
            ).toBe(true);
            if (mode === "new") {
              if (width <= 760) await page.locator(".preview-outline-mobile > summary").click();
              const nav = page.locator(
                width <= 760 ? ".preview-outline-mobile nav" : ".preview-outline-desktop nav",
              );
              const links = nav.getByRole("link");
              await expect(links).toHaveCount(
                lesson.id === "adding-and-the-flags"
                  ? FLAGS_LESSON_SECTIONS.length
                  : lesson.sections.length,
              );
              const id = (await links.last().getAttribute("href"))!.slice(1);
              await links.last().click();
              await expect(page).toHaveURL(new RegExp(`#/lesson/${lesson.id}$`));
              expect(
                await page.locator(`#${id}`).evaluate((n) => n.contains(document.activeElement)),
              ).toBe(true);
              if (width <= 760)
                await expect(page.locator(".preview-outline-mobile")).not.toHaveAttribute("open");
              const rect = await page.evaluate(() => ({
                heading: document.activeElement!.getBoundingClientRect().top,
                header: document.querySelector(".shell-header")!.getBoundingClientRect().bottom,
              }));
              expect(rect.heading, lesson.id).toBeGreaterThanOrEqual(rect.header - 1);
            }
            await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
            const file = `${lesson.id}-${mode}.jpg`;
            if (process.env["STYLE_PREVIEW_SHOTS"] !== "0")
              await page.screenshot({
                path: info.outputPath("screenshots", file),
                fullPage: true,
                type: "jpeg",
                quality: 85,
                animations: "disabled",
                style: captureStyle,
              });
            shots.push({
              lesson: lesson.id,
              title: lesson.title,
              width,
              theme,
              mode,
              file: `screenshots/${file}`,
            });
          }
          await node?.dispose();
        }
        expect(errors).toEqual([]);
        await writeFile(info.outputPath("screenshots.json"), JSON.stringify(shots, null, 2));
      });
    }
    test(`course pages ${width}px ${theme}`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const shots: Record<string, unknown>[] = [];
      await mkdir(info.outputPath("screenshots"), { recursive: true });
      for (const [id, route] of [
        ["front", "#/"],
        ["where-next", "#/where-next"],
      ]) {
        await page.goto(`?style=current${route}`);
        await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
        for (const mode of ["current", "new"] as const) {
          await choose(page, mode);
          await expect(page.locator("html")).toHaveAttribute("data-style-preview", mode);
          expect(
            await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
          ).toBe(true);
          await page.evaluate(async () => document.fonts.ready);
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
          const file = `${id}-${mode}.jpg`;
          if (process.env["STYLE_PREVIEW_SHOTS"] !== "0")
            await page.screenshot({
              path: info.outputPath("screenshots", file),
              fullPage: true,
              type: "jpeg",
              quality: 85,
              animations: "disabled",
              style: captureStyle,
            });
          shots.push({
            lesson: id,
            title: await page.getByRole("heading", { level: 1 }).textContent(),
            width,
            theme,
            mode,
            file: `screenshots/${file}`,
          });
        }
      }
      expect(errors).toEqual([]);
      await writeFile(info.outputPath("screenshots.json"), JSON.stringify(shots, null, 2));
    });
  }
for (const width of [375, 1280])
  for (const theme of ["light", "dark"] as const) {
    test(`real work survives both layouts ${width}px ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.addInitScript((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto("?style=current#/lesson/register-widths");
      const c = page.locator('[data-challenge="predict-two-registers"]');
      await c.locator('[data-field="x1"] input').fill("0x5");
      await c.locator('[data-field="w2"] input').fill("1000000");
      const calc = page.locator('.al-programmer-calculator[data-preset="widths"]');
      await calc.locator(":scope > summary").click();
      await calc.getByLabel("Value to enter", { exact: true }).fill("42");
      await calc.getByLabel("Value to enter", { exact: true }).press("Enter");
      const node = await c.locator('[data-field="x1"] input').elementHandle();
      await choose(page, "new");
      expect(
        await page.evaluate((n) => n === document.querySelector('[data-field="x1"] input'), node),
      ).toBe(true);
      await expect(calc.locator("output[data-reading]")).toHaveText("42");
      await expect(c.locator('[data-field="x1"] input')).toHaveValue("0x5");
      await c.getByRole("button", { name: "Run tests", exact: true }).click();
      await expect(c.locator(".challenge-complete")).toHaveCount(1);
      await choose(page, "current");
      await expect(c.locator(".challenge-complete")).toHaveCount(1);
      await expect(calc.locator("output[data-reading]")).toHaveText("42");
      await page.reload();
      await expect(c.locator(".challenge-complete")).toHaveCount(1);
      // Ordinary reload resets independent calculator scratch work in the existing course too.
      await expect(calc).not.toHaveAttribute("open");
      await page.goto("?style=new#/lesson/adding-and-the-flags");
      await expect(page.locator("#explorer")).toHaveCount(0);
      await page.locator('input[name="arm-choice"][value="0"]').locator("..").click();
      await page.locator("#armForm button[type=submit]").click();
      await expect(page.locator("#armFeedback [data-correct]")).toHaveAttribute(
        "data-correct",
        "false",
      );
      await page.locator("#explorer > summary").click();
      await page.locator('#readingButtons button[data-reading="signed"]').click();
      await expect(page.locator("[data-reading-value]")).toHaveText("−2,147,483,648");
      await choose(page, "current");
      await expect(page.locator("[data-reading-value]")).toHaveText("−2,147,483,648");
      await choose(page, "new");
      await page.reload();
      await expect(page.locator("[data-reading-value]")).toHaveText("−2,147,483,648");
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.locator(".skip-link").focus();
      expect(
        await page.locator(".skip-link").evaluate((n) => {
          const r = n.getBoundingClientRect();
          return n.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
        }),
      ).toBe(true);
      await page.keyboard.press("Enter");
      await expect(page.locator("#main")).toBeFocused();
      await page.locator(".style-preview-info > summary").click();
      const help = await page.locator(".style-preview-info > div").boundingBox();
      expect(help!.x).toBeGreaterThanOrEqual(0);
      expect(help!.x + help!.width).toBeLessThanOrEqual(width);
      expect(errors).toEqual([]);
    });
  }
