// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";

import { MODULE1_STRINGS as M1 } from "../../packages/views/src/strings.module1";
import { CALL_COMPARISON_STRINGS as C } from "../../packages/views/src/strings.call-comparison";
import { commit, figureOverflow, openLesson } from "./module1";
import { designProblems } from "./design";

// The viewport matrix includes phones even in the desktop project; enable the shared tap helper.
test.use({ hasTouch: true });

// Check phone widths explicitly, independently of the project viewport. The first figure
// must never put a result beside a before-state, including after Back and Reset.
for (const width of [360, 375, 416, 1280]) {
  for (const theme of ["light", "dark"] as const) {
    test(`C subtraction comparison and earlier reading stages at ${width}px in ${theme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript((value) => {
        localStorage.setItem("assembly-lab:v1:theme", value);
      }, theme);
      await openLesson(page, "arithmetic-on-register-bits");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const figure = page.locator("#ix-compare-int-unsigned");
      await expect(
        figure.locator(
          "[data-call-side], [data-return-bits], [data-return-explanation], [data-subtraction-work], .al-listing",
        ),
      ).toHaveCount(0);
      await expect(figure.locator(".al-compare-inputs")).toHaveText(C.startingInputs("3, 5"));
      const source = figure.locator('[data-comparison-stage="source"]');
      const prediction = figure.locator('[data-comparison-stage="prediction"]');
      const calls = figure.locator('[data-comparison-stage="calls"]');
      const wrapperStyle = await figure.locator(".al-compare-stages").evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          background: style.backgroundColor,
          border: style.borderTopWidth,
          shadow: style.boxShadow,
          padding: style.padding,
        };
      });
      expect(wrapperStyle).toEqual({
        background: "rgba(0, 0, 0, 0)",
        border: "0px",
        shadow: "none",
        padding: "0px",
      });
      await expect(source.getByRole("heading")).toHaveText(C.sourceHeading);
      await expect(prediction.getByRole("heading")).toHaveText(C.predictionHeading);
      await expect(calls.getByRole("heading")).toHaveText(C.callHeading);
      await expect(calls.getByRole("button", { name: C.callBoth, exact: true })).toBeDisabled();
      const separated = async () => {
        const boxes = await Promise.all(
          [source, prediction, calls].map((stage) => stage.boundingBox()),
        );
        expect(boxes.every(Boolean)).toBe(true);
        for (let i = 1; i < boxes.length; i++) {
          const heading = await [source, prediction, calls][i]!.getByRole("heading").boundingBox();
          // Include the stage's top padding: the heading needs a full 32px from the previous stage.
          expect(heading!.y - (boxes[i - 1]!.y + boxes[i - 1]!.height)).toBeGreaterThanOrEqual(32);
        }
      };
      await separated();
      await commit(page, "compare-int-unsigned", "The instructions are identical.");
      await expect(source.locator(".al-listing")).toHaveCount(2);
      await expect(prediction).toContainText("Both listings use");
      await expect(prediction).not.toContainText("After checking your prediction");
      await expect(calls).toContainText("After checking your prediction");
      await separated();
      await expect(
        figure.locator("[data-call-side], [data-return-bits], [data-return-explanation]"),
      ).toHaveCount(0);
      await figure.getByRole("button", { name: C.callBoth, exact: true }).click();
      await expect(figure.locator('[data-return-reading="signed"]')).toHaveAttribute(
        "data-return-value",
        "-2",
      );
      await expect(figure.locator('[data-return-reading="unsigned"]')).toHaveAttribute(
        "data-return-value",
        "4294967294",
      );
      const work = figure.locator("[data-subtraction-work]");
      await expect(work).toBeVisible();
      await expect(
        calls.locator("[data-subtraction-work], [data-call-side], [data-return-explanation]"),
      ).toHaveCount(0);
      const interpretation = figure.locator(".al-compare-interpretation");
      await expect(
        interpretation.getByRole("heading", { name: C.readingsHeading, exact: true }),
      ).toBeVisible();
      await expect(
        interpretation.getByRole("heading", { name: C.weightsHeading, exact: true }),
      ).toBeVisible();
      await expect(
        work.getByRole("heading", { name: C.subtraction.oppositeHeading, exact: true }),
      ).toBeVisible();
      await expect(
        work.getByRole("heading", { name: C.subtraction.sumHeading, exact: true }),
      ).toBeVisible();
      for (const [row, value] of Object.entries({
        second: 5,
        inverted: 4294967290,
        opposite: 4294967291,
        first: 3,
        "add-opposite": 4294967291,
        result: 4294967294,
      })) {
        await expect(work.locator(`[data-work-row="${row}"]`)).toHaveAttribute(
          "data-work-value",
          String(value),
        );
      }
      const reminder = work.getByRole("link");
      await expect(reminder).toHaveAttribute("href", "#/lesson/four-bit-arithmetic");
      await expect(reminder).toHaveText("Module 1, lesson 3: Arithmetic with four bits");
      await expect(figure.locator('[data-return-bits="shared"]')).toHaveCount(1);
      for (const row of ["shared", "reference"]) {
        await expect(figure.locator(`[data-return-bits="${row}"] .al-bit`)).toHaveText([
          ..."1".repeat(31),
          "0",
        ]);
      }
      await expect(figure.locator("[data-return-hex]")).toHaveText(["0xfffffffe", "0xfffffffe"]);
      await expect(figure.locator("[data-call-side] [data-return-bits]")).toHaveCount(0);
      await expect(figure.locator("[data-call-side]")).toHaveCount(2);
      await expect(figure.locator('[data-return-reading="signed"]')).toContainText("−2 km");
      await expect(figure.locator('[data-return-reading="unsigned"]')).toContainText(
        "4,294,967,294 km",
      );
      const weightTable = figure.locator("[data-return-explanation] table");
      await expect(weightTable).toBeVisible();
      const wrappedNumbers = await weightTable.locator("td").evaluateAll((cells) =>
        cells.flatMap((cell) => {
          if (!cell.textContent?.trim()) return [];
          const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
          const tops = new Set<number>();
          let text: Node | null;
          while ((text = walker.nextNode())) {
            if (!text.textContent?.trim()) continue;
            const range = document.createRange();
            range.selectNodeContents(text);
            for (const rect of range.getClientRects()) tops.add(Math.round(rect.top));
          }
          return tops.size > 1 ? [cell.textContent] : [];
        }),
      );
      expect(wrappedNumbers).toEqual([]);
      expect(
        await weightTable.evaluate((table) => table.scrollWidth - table.clientWidth),
      ).toBeLessThanOrEqual(1);
      expect(await designProblems(page, width < 500)).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
      await figure.getByRole("button", { name: C.resetCalls, exact: true }).click();
      await expect(
        figure.locator("[data-call-side], [data-return-bits], [data-return-explanation]"),
      ).toHaveCount(0);
      await expect(figure.locator(".al-listing")).toHaveCount(2);
      await openLesson(page, "same-bits-two-readings");
      const unsigned = page.locator("#ix-reading-unsigned");
      const signed = page.locator("#ix-reading-signed");
      await expect(unsigned.locator('[data-sum="unsigned"]')).toHaveText([
        "0 + 0 + 2 + 1 = 3",
        "8 + 0 + 2 + 1 = 11",
      ]);
      await expect(signed.locator('[data-sum="signed"]')).toHaveText("−8 + 0 + 2 + 1 = −5");
      await expect(unsigned.locator('[data-sum="unsigned"]').first()).toBeVisible();
      await expect(signed.locator('[data-sum="signed"]')).toBeVisible();
      await expect(page.locator("#ix-reading-bridge")).toContainText(
        "−2,147,483,648 + 0 = −2,147,483,648",
      );
      const transfer = page.locator('[data-reading-task="transfer"]');
      await expect(transfer.locator("[data-feedback]")).toHaveCount(0);
      await expect(transfer).not.toContainText("2,147,483,650");
      await transfer
        .getByRole("textbox", { name: "Unsigned reading", exact: true })
        .fill("2,147,483,650");
      await transfer
        .getByRole("textbox", { name: "Signed reading", exact: true })
        .fill("−2,147,483,646");
      await transfer
        .locator('[name="reason"]')
        .fill("Changing the interpretation leaves every stored bit unchanged.");
      await transfer
        .locator('[name="cleared"]')
        .fill("Clearing bit 31 makes its contribution zero while its weight stays the same.");
      await transfer.getByRole("button", { name: "Check readings", exact: true }).click();
      await expect(transfer.getByRole("status")).toContainText("Both readings match the model.");
      await expect(transfer.getByRole("status")).toContainText(
        "Only your numeric readings are checked automatically.",
      );
      expect(await designProblems(page, width < 500)).toEqual([]);
    });
  }
}

for (const width of [375, 1280]) {
  for (const theme of ["light", "dark"] as const) {
    test(`hexadecimal before numerical readings at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.addInitScript(
        (value) => localStorage.setItem("assembly-lab:v1:theme", value),
        theme,
      );
      await openLesson(page, "one-pattern-three-readings");
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const reader = page.locator("#ix-read-register");
      await expect(
        reader.locator('[data-reading="signed"], [data-reading="unsigned"]'),
      ).toHaveCount(0);
      await expect(reader.locator('[data-reading="hex"] code')).toHaveText("0xfffffff4");
      await reader.getByRole("textbox", { name: M1.hexEntry.label }).fill("0xf4");
      await expect(reader.locator('[data-reading="hex"] code')).toHaveText("0x000000f4");
      await expect(reader.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(5);
      await reader.locator('[data-bit="0"]').click();
      await expect(reader.locator('[data-reading="hex"] code')).toHaveText("0x000000f5");
      await reader.getByRole("button", { name: M1.reader.clearBits }).click();
      await expect(reader.locator('[data-reading="hex"] code')).toHaveText("0x00000000");
      expect(await designProblems(page, width < 500)).toEqual([]);
    });
  }
}
