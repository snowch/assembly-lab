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
    await expect(boundary.locator("[data-boundary-sum]")).toHaveText(["14", "15", "16", "17"]);
    await expect(boundary.locator("[data-boundary-carry]")).toHaveText(["0", "0", "1", "1"]);
    await expect(boundary.locator("[data-boundary-bits]")).toHaveText([
      "1110",
      "1111",
      "0000",
      "0001",
    ]);
    await expect(boundary.locator("[data-boundary-reading]")).toHaveText(["14", "15", "0", "1"]);
    await expect(boundary.locator(".al-sub-boundary-weights > span")).toHaveText([
      "8",
      "4",
      "2",
      "1",
    ]);
    await expect(boundary.locator("[data-boundary-place]")).toHaveText("16");
    await expect(boundary.locator("[data-boundary-increase]")).toContainText("+1 in adder sum");
    const alignment = await boundary.evaluate((node) => {
      const centers = [...node.querySelectorAll(".al-sub-boundary-weights > span")].map(
        (weight) => {
          const box = weight.getBoundingClientRect();
          return box.x + box.width / 2;
        },
      );
      return [...node.querySelectorAll("[data-boundary-bits]")].flatMap((bits) => {
        const carry = bits
          .closest("[data-boundary-a]")!
          .querySelector("[data-boundary-carry]")!
          .getBoundingClientRect();
        return [...bits.children].map((digit, index) => {
          const box = digit.getBoundingClientRect();
          return [
            box.x + box.width / 2 - centers[index]!,
            box.y + box.height / 2 - carry.y - carry.height / 2,
          ];
        });
      });
    });
    for (const offsets of alignment)
      for (const offset of offsets) expect(Math.abs(offset)).toBeLessThanOrEqual(1);
    for (const cell of await boundary
      .locator(".al-sub-boundary-head > *, .al-sub-boundary-row > *")
      .all()) {
      expect(await cell.evaluate((node) => node.scrollWidth <= node.clientWidth + 1)).toBe(true);
    }
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
