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
    await expect(value("w0")).toHaveText("7");
    await expect(value("w1")).toHaveText("0");
    await expect(figure.locator('.al-returning-instruction[data-next="true"]')).toContainText(
      "bl increment_int",
    );
    await expect(figure.locator(".al-returning-target")).toContainText(S.beforeCallTarget);
    await step.click();
    await expect(value("w0")).toHaveText("7");
    await expect(value("w1")).toHaveText("0");
    await expect(figure.locator(".al-returning-target")).toContainText(S.returnTarget);
    await expect(figure.locator(".al-returning-target")).toHaveAttribute("data-written", "true");
    await expect(figure.locator('.al-insn[data-next="true"]')).toContainText("add w0, w0, 1");
    await step.click();
    await expect(value("w0")).toHaveText("8");
    await expect(figure.locator('.al-insn[data-next="true"]')).toContainText("ret");
    await step.click();
    await expect(value("w0")).toHaveText("8");
    await expect(value("w1")).toHaveText("0");
    await expect(figure.locator('.al-returning-instruction[data-next="true"]')).toContainText(
      "add w1, w0, w0",
    );
    await expect(figure.locator('.al-dreg[data-changed="true"]')).toHaveCount(0);
    const bank = await figure.locator(".al-returning-registers").boundingBox();
    expect(bank).not.toBeNull();
    expect(bank!.y).toBeGreaterThanOrEqual(0);
    expect(bank!.y + bank!.height).toBeLessThanOrEqual(page.viewportSize()!.height);
    await expect(figure.locator(".al-returning-current")).toContainText("add w1, w0, w0");
    await page.reload();
    await expect(figure).toHaveAttribute("data-k", "3");
    await step.click();
    await expect(value("w0")).toHaveText("8");
    await expect(value("w1")).toHaveText("16");
    await expect(step).toBeDisabled();
    await figure.getByRole("button", { name: S.back, exact: true }).click();
    await expect(value("w1")).toHaveText("0");
    await figure.getByRole("button", { name: S.reset, exact: true }).click();
    await expect(value("w0")).toHaveText("7");
    await expect(figure).toHaveAttribute("data-k", "0");
    await expect(figure.locator('.al-returning-instruction[data-next="true"]')).toContainText(
      "bl increment_int",
    );
    await expect(figure.locator(".al-returning-target")).toContainText(S.beforeCallTarget);
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
