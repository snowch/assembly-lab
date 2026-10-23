// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { sameCOnA32 } from "../../content/lessons/same-c-on-a32";
import { LABELS } from "../../content/lessons/same-c-on-a32.labels";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { RECORDED_STRINGS as R } from "../../packages/views/src/strings.recorded";
import { AVERAGE_TRIP_A64 } from "../../content/lessons/a32.listings";
import { traceOf, wValue } from "../../packages/views/src/trace";
import { designProblems } from "./design";
import {
  challenge,
  commit,
  figureOverflow,
  openLesson,
  passing,
  press,
  registerValue,
  run,
  status,
  storageKey,
  stored,
  watchErrors,
} from "./module1";

const route = "same-c-on-a32";
test("optional A renders three recorded comparisons and only A64 steppers", async ({ page }) => {
  const errors = watchErrors(page);
  await openLesson(page, route);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(LABELS.title);
  await expect(page.locator('[data-figure="listing-pair"]')).toHaveCount(6);
  await expect(page.locator(".al-recorded-reference")).toHaveCount(3);
  await expect(page.locator(".al-recorded-reference[open]")).toHaveCount(0);
  await expect(page.locator("section.challenge")).toHaveCount(2);
  await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
  await expect(page.locator("#ix-step-a64-limit .al-locked")).toBeVisible();
  await expect(page.locator("#ix-predict-a32-syntax .al-outcome")).toHaveCount(0);
  expect(errors).toEqual([]);
});
for (const theme of ["light", "dark"])
  test(`optional A is readable and usable in ${theme}`, async ({ page }, info) => {
    await page.goto("#/");
    await page.evaluate((value) => localStorage.setItem("assembly-lab:v1:theme", value), theme);
    await page.reload();
    await openLesson(page, route);
    await commit(page, "predict-a32-limit", "50");
    await commit(page, "predict-a32-syntax", LABELS.options.syntax[0].label);
    for (const summary of await page.locator("details summary").all()) await summary.click();
    expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
    expect(await figureOverflow(page)).toEqual([]);
  });
test("the syntax experiment checks the real assembler after commitment and persists", async ({
  page,
}) => {
  await openLesson(page, route);
  const figure = await commit(page, "predict-a32-syntax", LABELS.options.syntax[1].label);
  await expect(figure.getByRole("status")).toContainText(R.rejected);
  await expect(figure.getByRole("status")).toHaveClass(/al-nomatch/);
  await page.reload();
  await expect(page.locator("#ix-predict-a32-syntax").getByRole("status")).toContainText(
    R.rejected,
  );
});
test("the final A64 exercise stepper exposes the actual quotient", async ({ page }) => {
  await openLesson(page, route);
  const figure = page.locator("#ix-step-a64-average");
  const trace = traceOf(AVERAGE_TRIP_A64, { entry: "average_trip", args: [95, 4] });
  await expect(registerValue(figure, "w0")).toHaveText("95");
  for (let i = 0; i < trace.result.steps.length; i++)
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
  await expect(registerValue(figure, "w0")).toHaveText(String(wValue(trace.result.final, 0)));
  await expect(figure.getByRole("button", { name: V.stepper.next })).toBeDisabled();
});
for (const item of sameCOnA32.challenges ?? [])
  test(`${item.id}: wrong answers fail, references pass and restore`, async ({ page }) => {
    await openLesson(page, route);
    const c = challenge(page, item.id);
    await press(page, run(c));
    await expect(status(c)).not.toContainText(passing(item.fields!.length));
    for (const field of item.fields ?? [])
      await c
        .locator(`[data-field="${field.id}"] input`)
        .fill(field.kind === "number" ? "0" : "wrong");
    await press(page, run(c));
    await expect(status(c)).not.toContainText(passing(item.fields!.length));
    for (const [id, value] of Object.entries(item.reference!.answers!))
      await c.locator(`[data-field="${id}"] input`).fill(value);
    await press(page, run(c));
    await expect(status(c)).toContainText(passing(item.fields!.length));
    await page.reload();
    await expect(status(challenge(page, item.id))).toContainText(passing(item.fields!.length));
    const saved = await stored(page, route);
    expect(saved.challenges[item.id].artifact.answers).toEqual(item.reference!.answers);
  });
test("a forged saved pass cannot validate wrong recorded answers", async ({ page }) => {
  await openLesson(page, route);
  const item = sameCOnA32.challenges![0]!,
    c = challenge(page, item.id);
  for (const field of item.fields ?? [])
    await c.locator(`[data-field="${field.id}"] input`).fill("wrong");
  await press(page, run(c));
  await page.evaluate(
    ({ key, id }) => {
      const saved = JSON.parse(localStorage.getItem(key)!);
      saved.challenges[id].verdict = { passed: true, total: 2, failures: [] };
      localStorage.setItem(key, JSON.stringify(saved));
    },
    { key: storageKey(route), id: item.id },
  );
  await page.reload();
  await press(page, run(challenge(page, item.id)));
  await expect(status(challenge(page, item.id))).not.toContainText(passing(2));
});
