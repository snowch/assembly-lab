// Copyright © 2026 Christopher Snow

import { expect, test } from "@playwright/test";
import { LESSONS } from "@al/content";
import { SMALL_CALL } from "../../content/lessons/prerequisite-bridges";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { traceOf } from "../../packages/views/src/trace";
import { memoryRegister } from "../../packages/views/src/memoryFigure";
import { designProblems } from "./design";
import { commit, watchErrors } from "./module3";

for (const theme of ["light", "dark"] as const) {
  test(`register OR before field writing in ${theme}`, async ({ page, isMobile }) => {
    const errors = watchErrors(page);
    await page.goto("#/lesson/masks");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const fig = page.locator("#ix-register-source-or");
    await expect(fig.locator('[data-row="detail-second"]')).toHaveAttribute("data-value", "8");
    await expect(fig.locator('[data-row="detail-result"]')).toHaveAttribute("data-value", "13");
    await expect(fig.locator(".al-code-c, [data-row=detail-mask]")).toHaveCount(0);
    await expect(
      fig.getByRole("link", { name: "Arm’s ORR (immediate) reference" }),
    ).toHaveAttribute(
      "href",
      "https://developer.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ORR--immediate---Bitwise-OR--immediate--",
    );
    const old = page.locator("#ix-mask-bits");
    await expect(old.locator(".al-locked")).toHaveCount(1);
    const prediction = LESSONS.find((l) => l.id === "masks")!
      .sections.flatMap((s) => s.interactives)
      .find((f) => f.id === "predict-minus-five")!;
    const options = prediction.props["options"] as { label: string }[];
    await commit(page, "predict-minus-five", options[0]!.label);
    await expect(old.locator(".al-locked")).toHaveCount(0);
    const second = fig.getByLabel(V.bitOps.inputLabel("w1"), { exact: true });
    await second.fill("0x101");
    await expect(fig.locator('[data-row="detail-second"]')).toHaveAttribute("data-value", "257");
    await expect(fig.locator('[data-row="detail-result"]')).toHaveAttribute("data-value", "261");
    await expect(old.getByLabel(V.bitOps.inputLabel("w0"), { exact: true })).toHaveValue("0xf");
    const ids = await page.locator("input[id]").evaluateAll((nodes) => nodes.map((n) => n.id));
    expect(new Set(ids).size).toBe(ids.length);
    await second.fill("invalid");
    await expect(fig.locator(".al-problem")).toBeVisible();
    await expect(fig.locator('[data-row="detail-result"]')).toHaveCount(0);
    await expect(old.locator('[data-row="detail-result"]')).toBeVisible();
    await page.reload();
    await expect(second).toHaveValue("0x8");
    await expect(fig.locator('[data-row="detail-result"]')).toHaveAttribute("data-value", "13");
    expect(await designProblems(page, isMobile)).toEqual([]);
    expect(errors).toEqual([]);
  });

  test(`smaller returning caller before the reserve in ${theme}`, async ({ page, isMobile }) => {
    const errors = watchErrors(page);
    await page.goto("#/lesson/calls-and-returns");
    await page.getByRole("combobox", { name: "Theme", exact: true }).selectOption(theme);
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    const fig = page.locator("#ix-step-small-returning-call");
    const full = page.locator("#ix-calls-and-returns-listing");
    expect(
      await fig.evaluate((el) =>
        Boolean(
          el.compareDocumentPosition(document.querySelector("#ix-calls-and-returns-listing")!) &
          Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ),
    ).toBe(true);
    await expect(fig.locator(".al-locked")).toHaveCount(0);
    await expect(full).toContainText("trip_report");
    await expect(page.locator("#ix-step-calls-and-returns .al-locked")).toHaveCount(1);
    await expect(fig).toContainText("sp to be a multiple of 16");
    const trace = traceOf(SMALL_CALL, { entry: "relay_distance", args: [128] });
    for (let k = 1; k <= trace.result.steps.length; k++) {
      await fig.getByRole("button", { name: V.stepper.next, exact: true }).click();
      await expect(fig.locator('[data-figure="stack-stepper"]')).toHaveAttribute(
        "data-k",
        String(k),
      );
      await expect(fig.locator('[data-register="w0"] code').nth(1)).toHaveText(
        memoryRegister(trace, k, "w0"),
      );
      await expect(fig.locator('[data-register="x30"] code').nth(1)).toHaveText(
        memoryRegister(trace, k, "x30"),
      );
    }
    await expect(fig.locator(".al-stack-frame")).toHaveCount(0);
    await fig.getByRole("button", { name: V.stepper.back, exact: true }).click();
    await fig.getByRole("button", { name: V.stepper.reset, exact: true }).click();
    await expect(fig.locator('[data-figure="stack-stepper"]')).toHaveAttribute("data-k", "0");
    await page.reload();
    await expect(fig.locator('[data-figure="stack-stepper"]')).toHaveAttribute("data-k", "0");
    await expect(page.locator("#ix-step-calls-and-returns .al-locked")).toHaveCount(1);
    expect(await designProblems(page, isMobile)).toEqual([]);
    expect(errors).toEqual([]);
  });
}
