// Copyright © 2026 Christopher Snow

// Fundamentals are separate lessons, discoverable before any instruction is run. Drive the
// smaller examples, their independent practice and their ordinary lesson navigation at both widths.
import { expect, test, type Locator, type Page } from "@playwright/test";
import { LESSONS } from "@al/content";
import { INCREMENT_INT } from "../../content/lessons/meet-the-machine.listings";
import { PRIMITIVE_STRINGS as P } from "../../packages/views/src/strings.primitive";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";
import { designProblems } from "./design";
import { challenge, openLesson, passing, press, run, status, watchErrors } from "./module1";

const IDS = [
  "one-addition",
  "tiny-function",
  "subtraction-and-reuse",
  "instructions-in-sequence",
  "meet-the-machine",
] as const;
const lessons = IDS.map((id) => LESSONS.find((lesson) => lesson.id === id)!);
const figure = (page: Page, id: string) => page.locator(`#ix-${id}`);
const current = (where: Locator, name: string) =>
  where.locator(`[data-register="${name}"] .al-dreg-value`);

async function resetExample(page: Page, where: Locator) {
  await press(page, where.getByRole("button", { name: P.restart, exact: true }));
  await expect(where.locator(".al-primitive")).toHaveAttribute("data-k", "0");
  await expect(where.locator(".al-primitive-result")).toHaveCount(0);
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`visible Fundamentals in ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((value) => {
        localStorage.setItem("assembly-lab:v1:theme", value);
      }, theme);
    });

    test("the course plan exposes every lesson and each leads to the next without running an activity", async ({
      page,
    }) => {
      const errors = watchErrors(page);
      await page.goto("#/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const module = page.locator('.plan-module[data-module="meet-the-machine"]');
      await expect(module.getByRole("heading")).toContainText("Fundamentals");
      const links = module.locator(".module-lessons a");
      await expect(links).toHaveCount(IDS.length);
      await expect(links).toHaveText(lessons.map((lesson) => lesson.title));
      for (let index = 0; index < IDS.length; index++) {
        await expect(links.nth(index)).toHaveAttribute("href", `#/lesson/${IDS[index]}`);
        await press(page, links.nth(index));
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(lessons[index]!.title);
        await expect(page.getByRole("button", { name: "Next activity", exact: true })).toHaveCount(
          0,
        );
        if (index < IDS.length - 1) {
          const next = page.locator('.lesson-nav a[href="#/lesson/' + IDS[index + 1] + '"]');
          await expect(next).toBeVisible();
          await press(page, next);
          await expect(page.getByRole("heading", { level: 1 })).toHaveText(
            lessons[index + 1]!.title,
          );
        }
        await page.goto("#/");
      }
      expect(errors).toEqual([]);
    });

    test("the opening explains register views and links to the detailed lesson and official references", async ({
      page,
      isMobile,
    }) => {
      const errors = watchErrors(page);
      await openLesson(page, "one-addition");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const views = figure(page, "register-views");
      await expect(views.getByRole("img")).toHaveAccessibleName(
        "x0 names one 64-bit register. w0 names its lower 32 bits.",
      );
      const geometry = await views.locator(".al-register-view").evaluate((el) => {
        const full = el.getBoundingClientRect();
        const lower = el.querySelector(".al-register-view-lower")!.getBoundingClientRect();
        return {
          left: full.left,
          right: full.right,
          mid: (full.left + full.right) / 2,
          lowLeft: lower.left,
          lowRight: lower.right,
        };
      });
      expect(Math.abs(geometry.lowLeft - geometry.mid)).toBeLessThan(2);
      expect(geometry.lowRight).toBeLessThanOrEqual(geometry.right);
      const motivation = page.locator('.lesson-section[data-kind="motivation"]');
      const references = motivation.locator("details");
      await expect(references).not.toHaveAttribute("open");
      await references.locator("summary").click();
      await expect(references).toHaveAttribute("open");
      await expect(
        references.getByRole("link", { name: "Arm’s instruction reference" }),
      ).toHaveAttribute(
        "href",
        "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--shifted-register---Add-optionally-shifted-register-",
      );
      await expect(
        references.getByRole("link", { name: "architecture reference manual" }),
      ).toHaveAttribute("href", "https://developer.arm.com/documentation/ddi0487/latest/");
      expect(await designProblems(page, isMobile)).toEqual([]);
      await press(page, views.getByRole("link", { name: "Constants and widths", exact: true }));
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Constants and widths");
      await expect(
        page.locator('.lesson-section[data-kind="failureExperiment"] .section-title'),
      ).toHaveText("Two names, one register");
      expect(errors).toEqual([]);
    });

    test("one addition ends with its exercise and omits generic closing notes", async ({
      page,
    }) => {
      const errors = watchErrors(page);
      await openLesson(page, "one-addition");
      const article = page.locator('article[data-lesson="one-addition"]');
      await expect(article.locator(".lesson-section")).toHaveCount(9);
      await expect(article.locator(".lesson-section").last()).toHaveAttribute(
        "data-kind",
        "challenge",
      );
      await expect(article.locator('[data-kind="reflection"]')).toHaveCount(0);
      await expect(article.locator(".lesson-model-note, .lesson-model-vs-reality")).toHaveCount(0);
      const worked = figure(page, "worked-addition");
      await expect(worked.locator(".time-model-toggle, .time-model-note")).toHaveCount(0);
      await expect(worked.locator(".badge.time-model")).toHaveText("Step by step");
      await expect(worked.getByRole("button", { name: P.run, exact: true })).toBeVisible();
      await page.locator('.lesson-nav a[href="#/lesson/tiny-function"]').click();
      await expect(
        page.locator('article[data-lesson="tiny-function"] .lesson-model-note'),
      ).toHaveCount(1);
      await expect(
        page.locator('article[data-lesson="tiny-function"] .lesson-model-vs-reality'),
      ).toHaveCount(1);
      expect(errors).toEqual([]);
    });

    test("one addition starts with only its inputs, preserves its result and resets locally", async ({
      page,
      isMobile,
    }) => {
      const errors = watchErrors(page);
      await openLesson(page, "one-addition");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const addition = figure(page, "worked-addition");
      await expect(addition.locator(".al-primitive-instructions li")).toHaveText([
        /add w2, w0, w1/,
      ]);
      await expect(current(addition, "w0")).toHaveText("12");
      await expect(current(addition, "w1")).toHaveText("7");
      await expect(current(addition, "w2")).toHaveText("0");
      await expect(addition.locator(".al-primitive-result")).toHaveCount(0);
      await expect(addition.locator(".al-listing")).toHaveCount(0);
      await press(page, addition.getByRole("button", { name: P.run, exact: true }));
      await expect(addition.getByRole("status")).toContainText("w2 = 19");
      await expect(addition.getByRole("status")).toContainText("w0, w1 keep their values");
      await expect(addition.getByRole("button", { name: P.run, exact: true })).toHaveCount(0);
      await page.reload();
      await expect(addition.getByRole("status")).toContainText("w2 = 19");
      await resetExample(page, addition);
      await page.reload();
      await expect(addition.locator(".al-primitive-result")).toHaveCount(0);
      expect(await designProblems(page, isMobile)).toEqual([]);
      expect(errors).toEqual([]);
    });

    test("the tiny function distinguishes calculating the result from returning it, including restore and reset", async ({
      page,
      isMobile,
    }) => {
      const errors = watchErrors(page);
      await openLesson(page, "tiny-function");
      // App status remains in the header; no automatic offline banner moves the listing.
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const fn = figure(page, "worked-function");
      await expect(fn.locator(".al-cline .al-src")).toHaveText(INCREMENT_INT.c.split("\n"));
      await expect(fn.locator(".al-insn .al-text")).toHaveText(["add w0, w0, 1", "ret"]);
      await expect(fn.locator(".al-insn .al-ctag")).toHaveText(["3", "3"]);
      await expect(fn.locator(".al-compiler-lines")).not.toHaveAttribute("open");
      const listing = fn.locator(".al-listing");
      const geometry = await listing.evaluate((el) => {
        const c = el.querySelector(".al-c")!.getBoundingClientRect();
        const asm = el.querySelector(".al-asm")!.getBoundingClientRect();
        return { cRight: c.right, asmLeft: asm.left, cTop: c.top, asmTop: asm.top };
      });
      expect(geometry.asmLeft).toBeGreaterThanOrEqual(geometry.cRight - 1);
      expect(Math.abs(geometry.cTop - geometry.asmTop)).toBeLessThan(1);
      await expect(fn.getByRole("button", { name: /^Show (C|instructions)$/ })).toHaveCount(0);
      // Complete source panes stay side by side. Native sideways scrolling moves only the
      // listing, at phone/tablet widths and after resizing from a wide viewport.
      for (const width of [375, 768, 1280]) {
        await page.setViewportSize({ width, height: 900 });
        await listing.scrollIntoViewIfNeeded();
        const pageScroll = await page.evaluate(() => window.scrollY);
        const bounds = await listing.evaluate((el) => ({
          viewport: el.clientWidth,
          content: el.scrollWidth,
        }));
        await listing.evaluate((el) => {
          el.scrollLeft = el.scrollWidth;
        });
        if (bounds.content > bounds.viewport) {
          expect(await listing.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
          expect(
            await listing.evaluate((el) => {
              const outer = el.getBoundingClientRect();
              const asm = el.querySelector(".al-asm")!.getBoundingClientRect();
              return asm.right <= outer.right + 2 && asm.right > outer.left;
            }),
          ).toBe(true);
          await listing.focus();
          await expect(listing).toBeFocused();
          const before = await listing.evaluate((el) => el.scrollLeft);
          await page.keyboard.press("ArrowLeft");
          await expect.poll(() => listing.evaluate((el) => el.scrollLeft)).toBeLessThan(before);
        }
        await listing.evaluate((el) => {
          el.scrollLeft = 0;
        });
        expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
          true,
        );
      }
      await page.setViewportSize({ width: isMobile ? 375 : 1280, height: isMobile ? 812 : 800 });
      const caller = fn.locator(".al-primitive-caller");
      await expect(current(fn, "w0")).toHaveText("7");
      await expect(caller).toHaveAttribute("data-caller-returned", "false");
      await expect(caller).toContainText(P.callerWaiting);
      await expect(fn.getByText(P.callerReturned(8))).toHaveCount(0);
      await press(page, fn.getByRole("button", { name: P.run, exact: true }));
      await expect(current(fn, "w0")).toHaveText("8");
      await expect(fn.locator('[data-register="w0"]')).toHaveAttribute("data-changed", "true");
      await expect(fn.locator('.al-insn[data-next="true"] .al-text')).toHaveText("ret");
      await expect(caller).toHaveAttribute("data-caller-returned", "false");
      await expect(fn.getByText(P.callerReturned(8))).toHaveCount(0);
      await page.reload();
      await expect(current(fn, "w0")).toHaveText("8");
      await expect(caller).toContainText(P.callerWaiting);
      await expect(fn.locator('.al-insn[data-next="true"] .al-text')).toHaveText("ret");
      await press(page, fn.getByRole("button", { name: P.run, exact: true }));
      await expect(current(fn, "w0")).toHaveText("8");
      await expect(fn.locator('[data-register="w0"]')).toHaveAttribute("data-changed", "false");
      await expect(caller).toHaveAttribute("data-caller-returned", "true");
      await expect(caller).toContainText(P.callerReturned(8));
      await expect(fn.locator('.al-insn[data-ran="true"] .al-text')).toHaveText("ret");
      await expect(fn.locator('.al-insn[data-next="true"]')).toHaveCount(0);
      await page.reload();
      await expect(caller).toContainText(P.callerReturned(8));
      await resetExample(page, fn);
      await expect(current(fn, "w0")).toHaveText("7");
      await expect(caller).toHaveAttribute("data-caller-returned", "false");
      expect(await designProblems(page, isMobile)).toEqual([]);
      expect(errors).toEqual([]);
    });

    test("reuse and subtraction are both visible and run independently", async ({
      page,
      isMobile,
    }) => {
      await openLesson(page, "subtraction-and-reuse");
      const reuse = figure(page, "worked-reuse");
      const subtraction = figure(page, "worked-subtraction");
      await expect(reuse.locator(".al-primitive")).toHaveAttribute("data-k", "0");
      await expect(subtraction.locator(".al-primitive")).toHaveAttribute("data-k", "0");
      await expect(reuse.getByRole("button", { name: P.run, exact: true })).toBeVisible();
      await expect(subtraction.getByRole("button", { name: P.run, exact: true })).toBeVisible();
      await press(page, reuse.getByRole("button", { name: P.run, exact: true }));
      await expect(reuse.getByRole("status")).toContainText("w0 = 13");
      await expect(subtraction.locator(".al-primitive-result")).toHaveCount(0);
      await press(page, subtraction.getByRole("button", { name: P.run, exact: true }));
      await expect(subtraction.getByRole("status")).toContainText("w1 = 14");
      await expect(subtraction.getByRole("status")).toContainText("w0 keeps its value");
      await page.reload();
      await expect(reuse.getByRole("status")).toContainText("w0 = 13");
      await expect(subtraction.getByRole("status")).toContainText("w1 = 14");
      await resetExample(page, subtraction);
      await expect(reuse.getByRole("status")).toContainText("w0 = 13");
      expect(await designProblems(page, isMobile)).toEqual([]);
    });

    test("the sequence marker follows each instruction and reset restores both inputs and position", async ({
      page,
      isMobile,
    }) => {
      await openLesson(page, "instructions-in-sequence");
      const sequence = figure(page, "worked-sequence");
      await expect(sequence.locator('li[data-next="true"]')).toContainText("add w2, w0, w1");
      await expect(current(sequence, "w2")).toHaveText("0");
      await press(page, sequence.getByRole("button", { name: P.run, exact: true }));
      await expect(current(sequence, "w2")).toHaveText("11");
      await expect(sequence.locator('li[data-next="true"]')).toContainText("sub w2, w2, w1");
      await expect(sequence.locator('li[data-ran="true"]')).toContainText("add w2, w0, w1");
      await page.reload();
      await expect(current(sequence, "w2")).toHaveText("11");
      await expect(sequence.locator('li[data-next="true"]')).toContainText("sub w2, w2, w1");
      await press(page, sequence.getByRole("button", { name: P.run, exact: true }));
      await expect(current(sequence, "w2")).toHaveText("8");
      await expect(current(sequence, "w1")).toHaveText("3");
      await expect(sequence.locator('li[data-next="true"]')).toHaveCount(0);
      await resetExample(page, sequence);
      await expect(current(sequence, "w2")).toHaveText("0");
      await expect(sequence.locator('li[data-next="true"]')).toContainText("add w2, w0, w1");
      expect(await designProblems(page, isMobile)).toEqual([]);
    });

    for (const lesson of lessons.slice(0, 4)) {
      test(`${lesson.title}: practice starts blank, rejects a wrong answer and preserves checked work`, async ({
        page,
        isMobile,
      }) => {
        await openLesson(page, lesson.id);
        const exercise = lesson.challenges[0]!;
        if (exercise.tests.kind !== "answers") throw new Error("Expected answer tests");
        const c = challenge(page, exercise.id);
        await expect(c).toBeVisible();
        await expect(c.locator(".answer-field input")).toHaveCount(exercise.fields.length);
        for (const field of exercise.fields)
          await expect(c.locator(`[data-field="${field.id}"] input`)).toHaveValue("");
        await expect(c.locator(".verdict-failure, .challenge-complete")).toHaveCount(0);
        // The worked example has not supplied or submitted the separate practice answers.
        for (const field of exercise.fields)
          await c.locator(`[data-field="${field.id}"] input`).fill("-999");
        await press(page, run(c));
        await expect(c.locator(".challenge-complete")).toHaveCount(0);
        await expect(status(c)).not.toHaveText(passing(exercise.tests.cases.length));
        for (const [id, value] of Object.entries(exercise.reference.answers!))
          await c.locator(`[data-field="${id}"] input`).fill(value);
        await press(page, run(c));
        await expect(c.locator(".challenge-complete")).toBeVisible();
        await expect(status(c)).toHaveText(passing(exercise.tests.cases.length));
        await page.reload();
        await expect(c.locator(".challenge-complete")).toBeVisible();
        for (const [id, value] of Object.entries(exercise.reference.answers!))
          await expect(c.locator(`[data-field="${id}"] input`)).toHaveValue(value);
        await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
        await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
        await expect(c.locator(".challenge-complete")).toHaveCount(0);
        await page.reload();
        for (const field of exercise.fields)
          await expect(c.locator(`[data-field="${field.id}"] input`)).toHaveValue("");
        expect(await designProblems(page, isMobile)).toEqual([]);
      });
    }
  });
}
