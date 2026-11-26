// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";

for (const theme of ["light", "dark"])
  test(`focused negation starts from an ordinary value and keeps narrow flag choices inside their groups in ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("#/lesson/subtraction-flags-and-negation");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe(
      theme === "light" ? "rgb(247, 250, 248)" : "rgb(16, 27, 26)",
    );
    const bridge = page.locator("#ix-carry-means-no-borrow .al-sub-bridge");
    await expect(bridge).toBeVisible();
    await expect(bridge.locator('[data-bridge-row="b"] code')).toHaveText("0011");
    await expect(bridge.locator('[data-bridge-row="inverted"] code')).toHaveText("1100");
    await expect(bridge.locator('[data-bridge-row="all-ones"] code')).toHaveText("1111");
    await expect(bridge.locator("[data-bridge-carry]")).toHaveText("1");
    await expect(bridge.locator("[data-bridge-result]")).toHaveText("0101");
    const wide = page.locator("#ix-carry-means-no-borrow .al-adder .al-sub-bridge-wide");
    await expect(wide).toContainText("4,294,967,295");
    await expect(wide).toContainText("4,294,967,296");
    await expect(
      page.locator("#ix-carry-means-no-borrow .al-subtraction-panes > .al-figure"),
    ).toHaveCount(3);
    const boundary = page.locator("#ix-carry-means-no-borrow .al-sub-boundary");
    await expect(boundary).toBeVisible();
    await expect(boundary.locator("[data-boundary-sum]")).toHaveText([
      "01110",
      "01111",
      "10000",
      "10001",
    ]);
    await expect(boundary.locator("[data-boundary-carry]")).toHaveText(["0", "0", "1", "1"]);
    await expect(boundary.locator("[data-boundary-bits]")).toHaveText([
      "1110",
      "1111",
      "0000",
      "0001",
    ]);
    await expect(boundary.locator("[data-boundary-reading]")).toHaveText(["14", "15", "0", "1"]);
    await expect(
      boundary.locator('[data-boundary-operand="a"] .al-sub-boundary-digits'),
    ).toHaveText(["0110", "0111", "1000", "1001"]);
    await expect(
      boundary.locator('[data-boundary-operand="inverted"] .al-sub-boundary-digits'),
    ).toHaveText(["0111", "0111", "0111", "0111"]);
    await expect(
      boundary.locator('[data-boundary-operand="one"] .al-sub-boundary-digits'),
    ).toHaveText(["0001", "0001", "0001", "0001"]);
    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await boundary
          .locator(".al-sub-boundary-grid")
          .evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length),
      ).toBe(width === 320 ? 2 : 4);
      const alignment = await boundary.evaluate((node) =>
        [...node.querySelectorAll("[data-boundary-a]")].flatMap((example) => {
          const result = [
            ...example.querySelectorAll("[data-boundary-bits] .al-sub-boundary-digits > span"),
          ].map((digit) => {
            const box = digit.getBoundingClientRect();
            return box.x + box.width / 2;
          });
          const outgoing = example.querySelector("[data-boundary-carry]")!.getBoundingClientRect();
          const reading = example.querySelector("[data-boundary-reading]")!.getBoundingClientRect();
          const bits = example.querySelector("[data-boundary-bits]")!.getBoundingClientRect();
          const offsets = [reading.x + reading.width / 2 - bits.x - bits.width / 2];
          for (const digit of example.querySelectorAll(
            "[data-boundary-bits] .al-sub-boundary-digits > span",
          )) {
            const box = digit.getBoundingClientRect();
            offsets.push(box.y + box.height / 2 - outgoing.y - outgoing.height / 2);
          }
          for (const operand of example.querySelectorAll("[data-boundary-operand]"))
            [...operand.querySelectorAll(".al-sub-boundary-digits > span")].forEach(
              (digit, index) => {
                const box = digit.getBoundingClientRect();
                offsets.push(box.x + box.width / 2 - result[index]!);
              },
            );
          return offsets;
        }),
      );
      for (const offset of alignment) expect(Math.abs(offset)).toBeLessThanOrEqual(1);
      for (const label of await boundary
        .locator(".al-sub-boundary-label, .al-sub-boundary-number")
        .all())
        expect(await label.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await page.setViewportSize({ width: 320, height: 900 });
    const firstPane = (await bridge.boundingBox())!;
    const secondPane = (await page.locator("#ix-carry-means-no-borrow .al-adder").boundingBox())!;
    expect(secondPane.y).toBeGreaterThan(firstPane.y + firstPane.height);
    const boundaryBounds = (await boundary.boundingBox())!;
    expect(boundaryBounds.y).toBeGreaterThan(firstPane.y + firstPane.height);
    expect(secondPane.y).toBeGreaterThan(boundaryBounds.y + boundaryBounds.height);
    expect(
      await page
        .locator("#ix-carry-means-no-borrow .al-subtraction-panes")
        .evaluate((node) => getComputedStyle(node).borderTopWidth),
    ).toBe("0px");
    for (const pane of await page
      .locator("#ix-carry-means-no-borrow .al-subtraction-panes > .al-figure")
      .all()) {
      expect(await pane.evaluate((node) => getComputedStyle(node).borderTopStyle)).toBe("solid");
    }
    const bridgeBounds = (await bridge.boundingBox())!;
    for (const header of await bridge.locator(".al-sub-bridge-head > span").all()) {
      expect(await header.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    }
    for (const label of await bridge
      .locator(".al-sub-bridge-row > *, .al-sub-bridge-output > *")
      .all()) {
      const box = (await label.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(bridgeBounds.x - 1);
      expect(box.x + box.width).toBeLessThanOrEqual(bridgeBounds.x + bridgeBounds.width + 1);
    }
    await expect(
      page.locator(
        "#ix-subtract-own, #ix-subtract-wrapped, #ix-counter-ring, #challenge-one-step-past",
      ),
    ).toHaveCount(0);
    await expect(page.locator("#ix-step-negs .al-locked")).toBeVisible();
    const ordinary = page.locator("#ix-negate-an-ordinary-value");
    await expect(ordinary.locator('.al-reg[data-register="w0"] .al-reg-value')).toHaveText("5");
    await ordinary.getByRole("button", { name: V.stepper.next, exact: true }).click();
    await expect(ordinary.locator('.al-reg[data-register="w0"] .al-reg-value')).toHaveText(
      "4294967291",
    );
    expect(await ordinary.locator(".al-flag .al-flag-value").allTextContents()).toEqual([
      "1",
      "0",
      "0",
      "0",
    ]);
    const challenge = page.locator("#challenge-negation-flags");
    await expect(challenge.locator(".answer-group")).toHaveCount(2);
    await expect(challenge.getByRole("radio", { checked: true })).toHaveCount(0);
    const fields = challenge.locator("fieldset.answer-choice");
    await expect(fields).toHaveCount(4);
    for (const field of await fields.all()) {
      const parent = (await field.boundingBox())!;
      for (const option of await field.locator("label.answer-option").all()) {
        const box = (await option.boundingBox())!;
        expect(box.x).toBeGreaterThanOrEqual(parent.x - 1);
        expect(box.x + box.width).toBeLessThanOrEqual(parent.x + parent.width + 1);
        expect(box.height).toBeGreaterThanOrEqual(40);
      }
    }
    await challenge.locator('[data-field="zero-c"] input[value="1"]').focus();
    await page.keyboard.press("Space");
    await expect(challenge.locator('[data-field="zero-c"] input[value="1"]')).toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });
