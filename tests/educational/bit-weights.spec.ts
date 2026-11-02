// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { READER_STRINGS as R } from "../../packages/views/src/strings.reader";
import { bit, openLesson, press } from "./module1";

for (const theme of ["light", "dark"] as const) {
  test(`explanations and full calculations introduce one reading at a time in ${theme}`, async ({
    page,
  }) => {
    await page.goto("#/");
    await page.evaluate((value) => localStorage.setItem("assembly-lab:v1:theme", value), theme);
    await page.reload();
    await openLesson(page, "same-bits-two-readings");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const initialProse = page.locator(
      '.lesson-section[data-kind="question"] > .prose, .lesson-section[data-kind="investigation"] > .prose',
    );
    for (const prose of await initialProse.all()) {
      await expect(prose).not.toContainText(/\bsigned\b|two’s complement|−2,147/);
    }
    const reader = page.locator("#ix-read-register");
    const guidance = reader.locator(".al-reader-guidance");
    await expect(guidance).not.toContainText(/two’s complement|negative|−2,147/);
    await reader.locator("details.al-calc summary").click();
    await expect(reader.locator('[data-sum="unsigned"]')).toBeVisible();
    await expect(reader.locator('[data-sum="signed"]')).toHaveCount(0);
    await bit(reader, 0).click();
    const pattern = (await reader.locator('[data-reading="hex"]').textContent())!;
    await reader.getByRole("button", { name: "Signed", exact: true }).click();
    await expect(guidance).toContainText("two’s complement");
    await expect(guidance).toContainText("−2,147,483,648");
    await expect(reader.locator('[data-sum="signed"]')).toBeVisible();
    await expect(reader.locator('[data-sum="unsigned"]')).toHaveCount(0);
    await expect(reader.locator('[data-reading="hex"]')).toHaveText(pattern);
    await reader.getByRole("button", { name: "Compare", exact: true }).click();
    await expect(guidance).toContainText("Both columns read the same bits");
    await expect(reader.locator('[data-sum="signed"]')).toBeVisible();
    await expect(reader.locator('[data-sum="unsigned"]')).toBeVisible();
    await expect(reader.locator('[data-reading="hex"]')).toHaveText(pattern);
    await reader.getByRole("button", { name: R.reset, exact: true }).click();
    await expect(guidance).not.toContainText("two’s complement");
    await expect(reader.locator('[data-sum="signed"]')).toHaveCount(0);
  });

  test(`Compare keeps readable row labels inside its scroller at 320 pixels in ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("#/");
    await page.evaluate((value) => localStorage.setItem("assembly-lab:v1:theme", value), theme);
    await page.reload();
    await openLesson(page, "same-bits-two-readings");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const reader = page.locator("#ix-read-register");
    // This layout check also narrows the mouse-only desktop project; viewport width alone
    // cannot tell the shared press helper whether the browser supports touch.
    await reader.getByRole("button", { name: R.views.compare, exact: true }).click();
    const labels = await reader.locator(".al-top-table tbody th").evaluateAll((headers) =>
      headers.map((header) => {
        const range = document.createRange();
        range.selectNodeContents(header.firstChild!);
        const style = getComputedStyle(header);
        return {
          width: header.getBoundingClientRect().width,
          textWidth: range.getBoundingClientRect().width,
          lines: range.getClientRects().length,
          padding: parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
        };
      }),
    );
    for (const label of labels) {
      expect(label.lines).toBe(1);
      expect(label.width).toBeGreaterThanOrEqual(label.textWidth + label.padding - 1);
    }
    const scroll = reader.locator(".al-reader-table-scroll");
    expect(await scroll.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
      true,
    );
    const bounds = await scroll.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
    await scroll.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });
    const signed = await reader.locator('.al-top-table [data-reading="signed"]').boundingBox();
    expect(signed!.x + signed!.width).toBeLessThanOrEqual(bounds!.x + bounds!.width + 1);
  });

  test(`selected bit positions stay aligned and contained in the ${theme} theme`, async ({
    page,
  }) => {
    await page.goto("#/");
    await page.evaluate((value) => localStorage.setItem("assembly-lab:v1:theme", value), theme);
    await page.reload();
    await openLesson(page, "same-bits-two-readings");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const reader = page.locator("#ix-read-register");
    await reader.scrollIntoViewIfNeeded();
    await expect(reader.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(32);
    for (const mode of ["unsigned", "signed", "compare"] as const) {
      await press(page, reader.getByRole("button", { name: R.views[mode], exact: true }));
      const geometry = await reader.locator(".al-weight-strip").evaluate((table) => {
        const positions = [31, 30, 3, 2, 1, 0];
        return positions.map((bit) => {
          const cells = [...table.querySelectorAll(`[data-weight-bit="${bit}"]`)];
          return cells.map((cell) => {
            const rect = cell.getBoundingClientRect();
            const style = getComputedStyle(cell);
            return {
              centre: rect.x + rect.width / 2,
              whiteSpace: style.whiteSpace,
              fontSize: parseFloat(style.fontSize),
            };
          });
        });
      });
      for (const column of geometry) {
        expect(
          Math.max(...column.map((cell) => cell.centre)) -
            Math.min(...column.map((cell) => cell.centre)),
        ).toBeLessThan(1);
        expect(column.every((cell) => cell.whiteSpace === "nowrap" && cell.fontSize >= 12)).toBe(
          true,
        );
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
      ).toBe(0);
      await expect(reader.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(32);
    }
    const topFlag = await reader.locator(".al-top-flag").boundingBox();
    const topBit = await bit(reader, 31).boundingBox();
    expect(Math.abs(topFlag!.x + topFlag!.width / 2 - topBit!.x - topBit!.width / 2)).toBeLessThan(
      1,
    );
    await press(page, bit(reader, 31));
    await expect(reader.locator('[data-weight-row="value"] [data-weight-bit="31"]')).toHaveText(
      "0",
    );
    await expect(reader.locator('[data-weight-row="signed"] [data-weight-bit="31"]')).toHaveText(
      "−2,147,483,648",
    );
    if (page.viewportSize()!.width < 500) {
      const scroll = reader.locator(".al-weight-scroll");
      expect(await scroll.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
        true,
      );
      await expect(reader.getByText(R.scrollCue, { exact: false })).toBeVisible();
      await scroll.evaluate((element) => {
        element.scrollLeft = element.scrollWidth;
      });
      const last = await reader
        .locator('[data-weight-row="value"] [data-weight-bit="0"]')
        .boundingBox();
      const viewport = await scroll.boundingBox();
      expect(last!.x + last!.width).toBeLessThanOrEqual(viewport!.x + viewport!.width + 1);
    }
    await press(page, reader.getByRole("button", { name: R.reset, exact: true }));
    await expect(
      reader.getByRole("button", { name: R.views.unsigned, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(reader.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(32);
    await page.reload();
    await expect(
      reader.getByRole("button", { name: R.views.unsigned, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(reader.locator('.al-toggle[aria-pressed="true"]')).toHaveCount(32);
  });
}
