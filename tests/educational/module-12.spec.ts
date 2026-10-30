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
  expect(Math.abs(detailBox.y - buttonBox.y - buttonBox.height)).toBeLessThanOrEqual(4);
}

async function compareTrace(trace: Locator) {
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
}

for (const theme of ["light", "dark"] as const) {
  for (const id of LESSONS.filter((lesson) => lesson.module === 12).map((lesson) => lesson.id)) {
    test(`${id}: native evidence, practical workflow and restored work in ${theme}`, async ({
      page,
    }) => {
      await page.addInitScript(
        (value) => localStorage.setItem("assembly-lab:v1:theme", value),
        theme,
      );
      const errors = watchErrors(page);
      await openLesson(page, id);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      if (id === "from-function-to-executable") {
        await expect(page.locator("#ix-native-run-output pre")).toHaveCount(0);
        await expect(page.locator("[data-native-diagram]")).toHaveCount(0);
        await commit(page, "predict-native-result", "232");
        await expect(page.locator("#ix-native-run-output pre")).toHaveCount(2);
        const response = await page.request.get("native/assembly-lab-native.zip");
        expect(response.ok()).toBe(true);
        expect((await response.body()).subarray(0, 2).toString()).toBe("PK");
        await commit(page, "predict-native-bug", "262");
      } else if (id === "loading-and-startup") {
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
        await expect(page.locator("#ix-native-boot-startup")).toHaveCount(0);
        await expect(page.locator("main")).toContainText(
          "aarch64-linux-gnu-readelf -h -l boot.elf",
        );
      } else if (id === "runtime-startup") {
        const flow = page.locator('[data-native-diagram="flow"]');
        await flow.locator('[data-flow-stage="trip"]').focus();
        await page.keyboard.press("Enter");
        await expectInlineExplanation(flow.locator('[data-flow-stage="trip"]'));
        await expect(flow.getByRole("status")).toContainText("trip_distance");
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
        await expect(page.locator(".al-locked")).toHaveCount(0);
      } else if (id === "debug-native-instructions") {
        await expect(page.locator("main")).toContainText("target remote 127.0.0.1:1234");
        await expect(page.locator("main")).toContainText("set {unsigned int}&result = 0xa5a5a5a5");
        await expect(page.locator("main")).toContainText("break boot_ready");
        await expect(page.locator("main")).toContainText("detach");
        await expect(page.locator("#ix-native-debug-startup [data-native-boot]")).toHaveCount(1);
        await expect(page.locator("#ix-native-gdb-stops")).toHaveCount(0);
      } else if (id === "stepping-native-function") {
        await expect(page.locator("main")).toContainText("target remote 127.0.0.1:1234");
        await expect(page.locator("main")).toContainText("break trip_distance");
        await expect(page.locator("main")).toContainText("x/1wd &result");
        await expect(page.locator("#ix-native-gdb-stops [data-native-side]")).toHaveCount(0);
        await commit(page, "predict-native-step", "205");
        await compareTrace(page.locator("#ix-native-gdb-stops"));
      } else if (id === "diagnosing-native-failure") {
        await expect(page.locator("main")).toContainText(
          "aarch64-linux-gnu-ld -T boot.ld boot.o trip_distance.o -o boot.elf",
        );
        await expect(page.locator("main")).toContainText("target remote 127.0.0.1:1234");
        await expect(page.locator("#ix-native-gdb-bug [data-native-side]")).toHaveCount(0);
        await expect(
          page.locator("#ix-native-gdb-original-comparison [data-native-side]"),
        ).toHaveCount(0);
        await commit(page, "predict-native-divergence", "After the third arithmetic instruction");
        await compareTrace(page.locator("#ix-native-gdb-original-comparison"));
        await compareTrace(page.locator("#ix-native-gdb-bug"));
      }
      const data = LESSONS.find((lesson) => lesson.id === id)!.challenges[0];
      if (data) {
        const exercise = challenge(page, data.id);
        await run(exercise).click();
        await expect(status(exercise)).not.toContainText(passing(4));
        const textarea = exercise.locator("textarea");
        if (!(await textarea.isVisible()))
          await exercise.getByRole("button", { name: /Type/ }).click();
        await textarea.fill(data.reference.text!);
        await run(exercise).click();
        await expect(status(exercise)).toContainText(passing(4));
        await page.reload();
        await expect(status(challenge(page, data.id))).toContainText(passing(4));
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
    });
  }
}
