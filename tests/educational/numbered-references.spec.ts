// Copyright © 2026 Christopher Snow

import { expect, test, type Page } from "@playwright/test";
import { LESSONS } from "@al/content";
import { CALL_COMPARISON_STRINGS as C } from "../../packages/views/src/strings.call-comparison";
import { STRINGS } from "../../apps/course/src/strings";
import { designProblems } from "./design";
import { lessonLabel, lessonPosition } from "./lesson-references";
import { commit, openLesson, press, watchErrors } from "./module1";

/** Each rendered internal reference must name the destination's current published position. */
async function expectNumberedReferences(page: Page) {
  const links = await page.locator('main a[href^="#/lesson/"]').evaluateAll((anchors) =>
    anchors.map((anchor) => ({
      href: anchor.getAttribute("href")!,
      text: (anchor.querySelector(".lesson-nav-title") ?? anchor).textContent!.trim(),
    })),
  );
  expect(links.length).toBeGreaterThan(0);
  for (const link of links) {
    const id = link.href.slice("#/lesson/".length);
    expect(link.text, link.href).toMatch(new RegExp(`^${lessonPosition(id)}: `));
    expect(link.text.match(/Module [^,]+, lesson \d+: /g), link.href).toHaveLength(1);
  }
}

for (const theme of ["light", "dark"] as const) {
  test.describe(`numbered course references in ${theme}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(
        (value) => localStorage.setItem("assembly-lab:v1:theme", value),
        theme,
      );
    });

    test("the plan, current position and adjacent lessons agree without changing titles or routes", async ({
      page,
    }) => {
      const errors = watchErrors(page);
      await page.goto("#/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const link = page.getByRole("link", {
        name: "L2: Signed and unsigned readings",
        exact: true,
      });
      await expect(link).toHaveAttribute("href", "#/lesson/same-bits-two-readings");
      await press(page, link);
      await expect(page.locator(".lesson-position")).toBeVisible();
      await expect(page.locator(".lesson-position")).toHaveText("Module 1, lesson 2");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Signed and unsigned readings",
      );
      await expect(page).toHaveTitle(STRINGS.pageTitle("Signed and unsigned readings"));
      expect(new URL(page.url()).hash).toBe("#/lesson/same-bits-two-readings");
      const nav = page.getByRole("navigation", { name: STRINGS.lessonNav });
      await expect(nav.locator('[data-direction="previous"] .lesson-nav-title')).toHaveText(
        "Module 1, lesson 1: Reading hexadecimal",
      );
      await expect(nav.locator('[data-direction="next"] .lesson-nav-title')).toHaveText(
        "Module 1, lesson 3: Arithmetic with four bits",
      );
      await expectNumberedReferences(page);
      await press(page, nav.locator('[data-direction="next"]'));
      await expect(page.locator(".lesson-position")).toHaveText("Module 1, lesson 3");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Arithmetic with four bits");
      expect(new URL(page.url()).hash).toBe("#/lesson/four-bit-arithmetic");
      await press(page, nav.locator('[data-direction="previous"]'));
      await expect(page.locator(".lesson-position")).toHaveText("Module 1, lesson 2");
      expect(errors).toEqual([]);
    });

    test("forward and backward prose references retain their destinations and external reference wording", async ({
      page,
      isMobile,
    }) => {
      const errors = watchErrors(page);
      await openLesson(page, "one-addition");
      const forward = page.locator('#ix-register-views a[href="#/lesson/register-widths"]');
      await expect(forward).toHaveText(lessonLabel("register-widths"));
      await expectNumberedReferences(page);
      const references = page.locator('.lesson-section[data-kind="motivation"] details');
      await press(page, references.locator("summary"));
      await expect(
        references.getByRole("link", { name: "Arm’s instruction reference", exact: true }),
      ).toHaveAttribute(
        "href",
        "https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--shifted-register---Add-optionally-shifted-register-",
      );
      await expect(
        references.getByRole("link", { name: "architecture reference manual", exact: true }),
      ).toHaveAttribute("href", "https://developer.arm.com/documentation/ddi0487/latest/");
      expect(await designProblems(page, isMobile)).toEqual([]);
      await press(page, forward);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Writing w and x registers");
      expect(new URL(page.url()).hash).toBe("#/lesson/register-widths");
      await openLesson(page, "masks");
      const backward = page.locator('article a[href="#/lesson/same-bits-two-readings"]');
      await expect(backward).toHaveText("Module 1, lesson 2: Signed and unsigned readings");
      await expectNumberedReferences(page);
      await press(page, backward);
      await expect(page.locator(".lesson-position")).toHaveText("Module 1, lesson 2");
      expect(new URL(page.url()).hash).toBe("#/lesson/same-bits-two-readings");
      expect(errors).toEqual([]);
    });

    test("optional modules use A and B consistently in the plan, page and navigation", async ({
      page,
      isMobile,
    }) => {
      const errors = watchErrors(page);
      for (const [id, label] of [
        ["same-c-on-a32", "A"],
        ["twos-complement", "B"],
      ] as const) {
        await page.goto("#/");
        const plan = page.locator(`.plan-module a[href="#/lesson/${id}"]`);
        await expect(plan).toHaveText(`L1: ${LESSONS.find((lesson) => lesson.id === id)!.title}`);
        await expect(plan).not.toContainText("Module");
        await expect(
          plan.locator("xpath=ancestor::li[contains(@class, 'plan-module')]//h3"),
        ).toContainText(`Module ${label}`);
        await press(page, plan);
        await expect(page.locator(".lesson-position")).toHaveText(`Module ${label}, lesson 1`);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          LESSONS.find((lesson) => lesson.id === id)!.title,
        );
        expect(new URL(page.url()).hash).toBe(`#/lesson/${id}`);
        await expectNumberedReferences(page);
      }
      const nav = page.getByRole("navigation", { name: STRINGS.lessonNav });
      await expect(nav.locator('[data-direction="next"]')).toHaveCount(0);
      await expect(nav.locator('[data-direction="previous"] .lesson-nav-title')).toHaveText(
        "Module A, lesson 4: A32 division helpers",
      );
      const backward = page.locator('article a[href="#/lesson/same-bits-two-readings"]');
      await expect(backward).toHaveText("Module 1, lesson 2: Signed and unsigned readings");
      expect(await designProblems(page, isMobile)).toEqual([]);
      await press(page, backward);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Signed and unsigned readings",
      );
      expect(errors).toEqual([]);
    });

    test("the JSX bit-weight reference appears numbered only after both calls and remains correct on restore", async ({
      page,
      isMobile,
    }) => {
      const errors = watchErrors(page);
      await openLesson(page, "arithmetic-on-register-bits");
      const figure = page.locator("#ix-compare-int-unsigned");
      const link = figure.locator('a[href="#/lesson/same-bits-two-readings"]');
      await expect(link).toHaveCount(0);
      await commit(page, "compare-int-unsigned", "The instructions are identical.");
      await expect(link).toHaveCount(0);
      await press(page, figure.getByRole("button", { name: C.callBoth, exact: true }));
      await expect(link).toHaveText("Module 1, lesson 2: Signed and unsigned readings");
      await expect(link).toHaveAccessibleName("Module 1, lesson 2: Signed and unsigned readings");
      await expectNumberedReferences(page);
      expect(await designProblems(page, isMobile)).toEqual([]);
      await page.reload();
      await expect(link).toHaveText("Module 1, lesson 2: Signed and unsigned readings");
      await press(page, link);
      await expect(page.locator(".lesson-position")).toHaveText("Module 1, lesson 2");
      expect(new URL(page.url()).hash).toBe("#/lesson/same-bits-two-readings");
      expect(errors).toEqual([]);
    });
  });
}
