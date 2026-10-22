// Copyright © 2026 Christopher Snow
import { expect, test } from "@playwright/test";
import { LESSONS } from "@al/content";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { openLesson, commit, challenge, run, status, passing, watchErrors } from "./module1";

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
        await commit(page, "predict-native-result", "232");
        await expect(page.locator("#ix-native-run-output pre")).toHaveCount(2);
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
