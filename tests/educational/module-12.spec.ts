// Copyright © 2026 Christopher Snow
import { expect, test, type Locator } from "@playwright/test";
import { LESSONS } from "@al/content";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { LABELS as NATIVE_LABELS } from "../../content/lessons/debug-native-instructions.labels";
import EVIDENCE from "../../content/lessons/module-12.evidence.json" with { type: "json" };
import { LABELS as DIAGRAM_LABELS } from "../../content/lessons/native-diagrams.labels";
import { openLesson, commit, challenge, run, status, passing, watchErrors } from "./module1";

async function expectInlineExplanation(control: Locator) {
  await expect(control).toBeFocused();
  await expect(control).toHaveAttribute("aria-expanded", "true");
  const regionId = await control.getAttribute("aria-controls");
  const detail = control.page().locator(`[id="${regionId}"]`);
  await expect(detail).toBeVisible();
  const buttonBox = (await control.boundingBox())!;
  const detailBox = (await detail.boundingBox())!;
  // Independent phone/desktop review measured zero gap. Catch the former distant
  // description while allowing subpixel rounding at the shared boundary.
  expect(Math.abs(detailBox.y - buttonBox.y - buttonBox.height)).toBeLessThanOrEqual(4);
}

for (const theme of ["light", "dark"] as const) {
  for (const id of ["from-function-to-executable", "debug-native-instructions"]) {
    test(`${id}: native evidence, challenge and restored work in ${theme}`, async ({ page }) => {
      await page.addInitScript(
        (value) => localStorage.setItem("assembly-lab:v1:theme", value),
        theme,
      );
      const errors = watchErrors(page);
      await openLesson(page, id);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const debug = id === "debug-native-instructions";
      if (debug) {
        await expect(page.locator("#ix-native-gdb-stops [data-native-side]")).toHaveCount(0);
        await commit(page, "predict-native-step", "205");
        const trace = page.locator("#ix-native-gdb-stops");
        for (let k = 0; k < 5; k++) {
          const native = trace.locator('[data-native-side="recorded"] .al-dreg-value');
          await expect(trace.locator('[data-native-side="model"] .al-dreg-value')).toHaveText(
            await native.allTextContents(),
          );
          if (k < 4) await trace.getByRole("button", { name: V.stepper.next, exact: true }).click();
        }
        await expect(trace.locator('[data-changed="true"]')).toHaveCount(0);
        await trace.getByRole("button", { name: V.stepper.reset, exact: true }).click();
        await expect(trace.locator('[data-native-side="recorded"] .al-dreg-value')).toHaveText([
          "120",
          "85",
          "42",
          "15",
        ]);
        await commit(page, "predict-native-divergence", "After the third arithmetic instruction");
      } else {
        await expect(page.locator("#ix-native-run-output pre")).toHaveCount(0);
        await expect(page.locator("#ix-native-boot-startup [data-native-boot]")).toHaveCount(0);
        await expect(page.locator("[data-native-diagram]")).toHaveCount(0);
        await commit(page, "predict-native-result", "232");
        await expect(page.locator("#ix-native-run-output pre")).toHaveCount(2);
        const flow = page.locator('[data-native-diagram="flow"]');
        await flow.locator('[data-flow-stage="trip"]').focus();
        await page.keyboard.press("Enter");
        await expectInlineExplanation(flow.locator('[data-flow-stage="trip"]'));
        await expect(flow.getByRole("status")).toContainText("trip_distance");
        await expect(flow.locator('[data-flow-stage="trip"]')).toHaveAttribute(
          "aria-pressed",
          "true",
        );
        const memory = page.locator('[data-native-diagram="memory"]');
        for (const section of EVIDENCE.boot.image.sections) {
          const row = memory.locator(`[data-elf-section="${section.name}"]`);
          await row.focus();
          await page.keyboard.press("Space");
          await expectInlineExplanation(row);
          await expect(row).toHaveAttribute("aria-pressed", "true");
          await expect(memory.getByRole("status")).toContainText(section.name);
          if (section.fileSize === 0) {
            await expect(row.locator(".al-elf-source code")).toHaveCount(0);
            await expect(row).toHaveAccessibleName(new RegExp(DIAGRAM_LABELS.memory.notStored));
          }
        }
        await expect(memory.locator("[data-native-stack]")).toContainText(
          `0x${EVIDENCE.boot.stackFrame.frameSp.toString(16)}`,
        );
        const boot = page.locator("#ix-native-boot-startup");
        for (const [index, stop] of EVIDENCE.boot.startupStops.entries()) {
          await boot
            .getByRole("button", { name: NATIVE_LABELS.native.boot.stops[index], exact: true })
            .click();
          for (const key of ["pc", "sp", "result"] as const)
            await expect(
              boot.locator(
                `[data-${key === "result" ? "memory" : "register"}="${key}"] .al-dreg-value`,
              ),
            ).toHaveText(`0x${stop[key].toString(16)}`);
        }
        await boot
          .getByRole("button", { name: NATIVE_LABELS.native.boot.stops[0], exact: true })
          .click();
        await expect(boot.locator('[data-memory="result"] .al-dreg-value')).toHaveText(
          `0x${EVIDENCE.boot.startupStops[0]!.result.toString(16)}`,
        );
        const response = await page.request.get("native/assembly-lab-native.zip");
        expect(response.ok()).toBe(true);
        expect((await response.body()).subarray(0, 2).toString()).toBe("PK");
        await commit(page, "predict-native-bug", "262");
      }
      const data = LESSONS.find((l) => l.id === id)!.challenges[0]!;
      const exercise = challenge(page, data.id);
      await run(exercise).click();
      await expect(status(exercise)).not.toContainText(passing(4));
      const textarea = exercise.locator("textarea");
      // Keyboard editing is available in both projects, independently of the tap palette.
      if (!(await textarea.isVisible()))
        await exercise.getByRole("button", { name: /Type/ }).click();
      await textarea.fill(data.reference.text!);
      await run(exercise).click();
      await expect(status(exercise)).toContainText(passing(4));
      await page.reload();
      await expect(status(challenge(page, data.id))).toContainText(passing(4));
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
    });
  }
}
