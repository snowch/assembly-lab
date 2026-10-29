// Copyright © 2026 Christopher Snow
import { expect, test } from "@playwright/test";
import { RETURNING_STRINGS as S } from "../../packages/views/src/strings.returning";
import { openLesson, watchErrors } from "./module1";
import { designProblems } from "./design";

for (const theme of ["light", "dark"]) {
  test(`ret resumes the visible caller with shared registers in ${theme}`, async ({
    page,
    isMobile,
  }) => {
    const errors = watchErrors(page);
    await page.addInitScript(
      (value) => localStorage.setItem("assembly-lab:v1:theme", value),
      theme,
    );
    await openLesson(page, "tiny-function");
    await page.locator('.lesson-nav a[href="#/lesson/returning-to-caller"]').click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Returning to the caller");
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const figure = page.locator('[data-figure="returning-to-caller"]');
    const value = (name: string) => figure.locator(`[data-register="${name}"] .al-dreg-value`);
    const step = figure.getByRole("button", { name: S.run, exact: true });
    const bank = figure.getByRole("group", { name: S.sharedRegisters, exact: true });
    const moment = bank.locator(".al-returning-moment");
    await expect(bank).toHaveCount(1);
    await expect(bank.locator(".al-returning-target")).toHaveCount(1);
    await expect(moment).toHaveText(S.beforeCall);
    const assertRegisterOrder = async () => {
      const bankBox = await bank.boundingBox();
      const callerBox = await figure.locator(".al-returning-caller").boundingBox();
      const functionBox = await figure.locator(".al-returning-function").boundingBox();
      const momentBox = await moment.boundingBox();
      const w0Box = await bank.locator('[data-register="w0"]').boundingBox();
      const w1Box = await bank.locator('[data-register="w1"]').boundingBox();
      const linkBox = await bank.locator(".al-returning-target").boundingBox();
      expect(bankBox).not.toBeNull();
      expect(callerBox).not.toBeNull();
      expect(functionBox).not.toBeNull();
      expect(momentBox).not.toBeNull();
      expect(w0Box).not.toBeNull();
      expect(w1Box).not.toBeNull();
      expect(linkBox).not.toBeNull();
      const titleBox = (await figure.locator(":scope > h4").boundingBox())!;
      expect(bankBox!.x).toBe(titleBox.x);
      expect(callerBox!.x).toBe(titleBox.x);
      expect(functionBox!.x).toBe(titleBox.x);
      expect(w0Box!.x).toBe(bankBox!.x);
      expect(w0Box!.y).toBe(w1Box!.y);
      expect(w0Box!.x + w0Box!.width).toBeLessThan(w1Box!.x);
      expect(momentBox!.y + momentBox!.height).toBeLessThanOrEqual(w0Box!.y);
      expect(linkBox!.y).toBe(w0Box!.y);
      expect(w1Box!.x + w1Box!.width).toBeLessThan(linkBox!.x);
      expect(bankBox!.y + bankBox!.height).toBeLessThanOrEqual(callerBox!.y);
      expect(callerBox!.y + callerBox!.height).toBeLessThanOrEqual(functionBox!.y);
      // Execution markings must not cross the saved-address connector at the row edge.
      for (const row of await figure.locator(".al-returning-instruction").all()) {
        await expect(row).toHaveCSS("border-left-color", "rgba(0, 0, 0, 0)");
        const next = (await row.getAttribute("data-next")) === "true";
        const ran = (await row.getAttribute("data-ran")) === "true";
        if (next || ran) {
          const code = row.locator(".al-returning-code");
          await expect(code).toHaveCSS("border-left-style", next ? "dotted" : "solid");
          const codeBox = (await code.boundingBox())!;
          const addressBox = (await row.locator(".al-returning-address").boundingBox())!;
          expect(codeBox.x).toBeGreaterThan(addressBox.x + addressBox.width);
        }
      }
    };
    await page.evaluate(() => document.fonts.ready);
    const viewport = page.viewportSize()!;
    for (const width of new Set([viewport.width, 640, 768, 960, 1024, 1280])) {
      await page.setViewportSize({ ...viewport, width });
      await assertRegisterOrder();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        width,
      );
    }
    await page.setViewportSize(viewport);
    await expect(value("w0")).toHaveText("7");
    await expect(value("w1")).toHaveText("0");
    await expect(figure.locator('.al-returning-instruction[data-next="true"]')).toContainText(
      "bl increment_int",
    );
    await expect(figure.locator(".al-returning-target")).toContainText(S.beforeCallTarget);
    const addresses = figure.locator(".al-returning-address");
    await expect(addresses).toHaveCount(2);
    const numbers = (await addresses.allTextContents()).map((text) =>
      Number(text.replace(S.address, "").trim()),
    );
    expect(numbers.every(Number.isSafeInteger)).toBe(true);
    expect(numbers[1]).toBe(numbers[0]! + 4);
    const savedAddress = figure.locator(".al-returning-saved-address");
    const connector = figure.locator(".al-returning-connector-line");
    const assertConnector = async () => {
      await expect(connector).toBeVisible();
      await expect(figure.locator(".al-returning-target")).toHaveAccessibleDescription(
        new RegExp(`^${S.connection}\\s*: ${numbers[1]}, ${S.returnTarget}$`),
      );
      await expect(async () => {
        const points = await connector.evaluate((element) => {
          const path = element as SVGPathElement;
          const matrix = path.getScreenCTM()!;
          const first = path.getPointAtLength(0).matrixTransform(matrix);
          const last = path.getPointAtLength(path.getTotalLength()).matrixTransform(matrix);
          const samples = Array.from({ length: Math.ceil(path.getTotalLength()) + 1 }, (_, n) =>
            path.getPointAtLength(Math.min(n, path.getTotalLength())).matrixTransform(matrix),
          );
          return {
            first: { x: first.x, y: first.y },
            last: { x: last.x, y: last.y },
            left: Math.min(...samples.map((point) => point.x)),
          };
        });
        const link = (await figure.locator(".al-returning-target").boundingBox())!;
        const destination = (await addresses.nth(1).boundingBox())!;
        const frame = (await figure.boundingBox())!;
        expect(points.left).toBeGreaterThan(frame.x);
        expect(points.left).toBeLessThan((await bank.boundingBox())!.x);
        // SVG coordinates round independently of CSS layout; allow at most one pixel.
        expect(Math.abs(points.first.x - (link.x + link.width / 2))).toBeLessThanOrEqual(1);
        expect(Math.abs(points.first.y - (link.y + link.height))).toBeLessThanOrEqual(1);
        expect(Math.abs(points.last.x - (destination.x - 4))).toBeLessThanOrEqual(1);
        expect(
          Math.abs(points.last.y - (destination.y + destination.height / 2)),
        ).toBeLessThanOrEqual(1);
      }).toPass();
    };
    await expect(savedAddress).toHaveCount(0);
    await expect(connector).toHaveCount(0);
    await step.click();
    await expect(moment).toHaveText(S.registersNow);
    await expect(value("w0")).toHaveText("7");
    await expect(value("w1")).toHaveText("0");
    await assertConnector();
    await expect(figure.locator(".al-returning-target")).toHaveAttribute("data-written", "true");
    await expect(savedAddress).toHaveText(String(numbers[1]));
    for (const width of new Set([viewport.width, 640, 768, 960, 1024, 1280])) {
      await page.setViewportSize({ ...viewport, width });
      await assertRegisterOrder();
      await assertConnector();
    }
    await page.setViewportSize(viewport);
    await expect(figure.locator('.al-insn[data-next="true"]')).toContainText("add w0, w0, 1");
    await step.click();
    await expect(value("w0")).toHaveText("8");
    await expect(figure.locator('.al-insn[data-next="true"]')).toContainText("ret");
    await assertRegisterOrder();
    await assertConnector();
    await expect(savedAddress).toHaveText(String(numbers[1]));
    await step.click();
    await expect(value("w0")).toHaveText("8");
    await expect(value("w1")).toHaveText("0");
    await expect(figure.locator('.al-returning-instruction[data-next="true"]')).toContainText(
      "add w1, w0, w0",
    );
    await expect(figure.locator('.al-dreg[data-changed="true"]')).toHaveCount(0);
    await assertConnector();
    await expect(savedAddress).toHaveText(String(numbers[1]));
    await assertRegisterOrder();
    await expect(figure.locator(".al-returning-current")).toContainText("add w1, w0, w0");
    await page.reload();
    await expect(figure).toHaveAttribute("data-k", "3");
    await assertConnector();
    await expect(moment).toHaveText(S.registersNow);
    await expect(savedAddress).toHaveText(String(numbers[1]));
    await step.click();
    await expect(value("w0")).toHaveText("8");
    await expect(value("w1")).toHaveText("16");
    await assertConnector();
    await assertRegisterOrder();
    await expect(step).toBeDisabled();
    await figure.getByRole("button", { name: S.back, exact: true }).click();
    await expect(value("w1")).toHaveText("0");
    await figure.getByRole("button", { name: S.reset, exact: true }).click();
    await expect(value("w0")).toHaveText("7");
    await expect(figure).toHaveAttribute("data-k", "0");
    await expect(connector).toHaveCount(0);
    await expect(moment).toHaveText(S.beforeCall);
    await expect(figure.locator('.al-returning-instruction[data-next="true"]')).toContainText(
      "bl increment_int",
    );
    await expect(figure.locator(".al-returning-target")).toContainText(S.beforeCallTarget);
    await expect(savedAddress).toHaveCount(0);
    await step.click();
    await expect(savedAddress).toHaveText(String(numbers[1]));
    await figure.getByRole("button", { name: S.back, exact: true }).click();
    await expect(savedAddress).toHaveCount(0);
    await expect(moment).toHaveText(S.beforeCall);
    await expect(connector).toHaveCount(0);
    expect(await designProblems(page, isMobile)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("keeps the same machine state when restoring progress from before the call was visible", async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "assembly-lab:v1:returning-to-caller",
      JSON.stringify({
        version: 1,
        challenges: {},
        slots: { "follow-return": { step: 2 } },
      }),
    );
  });
  await openLesson(page, "returning-to-caller");
  const figure = page.locator('[data-figure="returning-to-caller"]');
  await expect(figure).toHaveAttribute("data-k", "3");
  await expect(figure.locator(".al-returning-moment")).toHaveText(S.registersNow);
  await expect(figure.locator('.al-returning-instruction[data-next="true"]')).toContainText(
    "add w1, w0, w0",
  );
  await expect(figure.locator('[data-register="w0"] .al-dreg-value')).toHaveText("8");
  await expect(figure.locator('[data-register="w1"] .al-dreg-value')).toHaveText("0");
  await figure.getByRole("button", { name: S.back, exact: true }).click();
  await expect(figure.locator('.al-insn[data-next="true"]')).toContainText("ret");
  const saved = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem("assembly-lab:v1:returning-to-caller")!).slots[
        "follow-return"
      ],
  );
  expect(saved).toEqual({ step: 2, startStep: 1 });
  await figure.getByRole("button", { name: S.reset, exact: true }).click();
  await expect(figure.locator('.al-returning-instruction[data-next="true"]')).toContainText(
    "bl increment_int",
  );
});
