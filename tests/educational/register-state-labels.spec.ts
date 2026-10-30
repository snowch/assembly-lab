// Copyright © 2026 Christopher Snow

// Check the temporal annotation beside actual lesson banks, across each executing renderer.
// Prediction and solution gates are opened through their existing controls.
import { expect, test } from "@playwright/test";
import { LESSONS } from "@al/content";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { COMPILER_STRINGS as C } from "../../packages/views/src/strings.compiler";
import { openLesson, watchErrors } from "./module1";

const examples = [
  { route: "meet-the-machine", kind: "stepper", after: "add w0, w0, w1" },
  { route: "tiny-function", kind: "primitive-operation", after: "add w0, w0, 1" },
  { route: "instructions-in-sequence", kind: "primitive-operation", after: "add w2, w0, w1" },
  { route: "constants-and-widths", kind: "wide-stepper", mode: "w16", after: "mov w0, 30000" },
  { route: "constants-and-widths", kind: "wide-stepper", mode: "x64-named", after: "mov x3, -1" },
  { route: "shifts", kind: "word-stepper" },
  { route: "memory-and-addresses", kind: "memory-stepper" },
  { route: "calls-and-returns", kind: "stack-stepper" },
  { route: "compare-and-choose", kind: "select-stepper" },
  { route: "masks", kind: "solution-stepper" },
  { route: "from-c-to-instructions", kind: "compiler-playground" },
  {
    route: "debug-native-instructions",
    kind: "native-tools",
    id: "native-gdb-stops",
    after: "add w0, w0, w1",
  },
];

for (const example of examples) {
  for (const theme of ["light", "dark"]) {
    test(`${example.route} ${example.kind} ${example.mode ?? ""}: register moment follows the controls in ${theme}`, async ({
      page,
    }) => {
      const errors = watchErrors(page);
      const lesson = LESSONS.find((l) => l.id === example.route)!;
      const item = lesson.sections
        .flatMap((s) => s.interactives)
        .find(
          (f) =>
            f.kind === example.kind &&
            (!example.id || f.id === example.id) &&
            (!example.mode || f.props["mode"] === example.mode),
        )!;
      await openLesson(page, example.route);
      await page.locator(".theme-picker select").selectOption(theme);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      const gate = item.props["after"];
      if (typeof gate === "string") {
        const prediction = page.locator(`#ix-${gate}`);
        await prediction.getByRole("radio").first().check();
        await prediction
          .getByRole("button", { name: /Check your prediction|See what happens/ })
          .click();
      }
      const challengeId =
        item.props["challenge"] ?? item.props["afterRun"] ?? item.props["fromChallenge"];
      if (typeof challengeId === "string") {
        const exercise = lesson.challenges.find((c) => c.id === challengeId)!;
        const editor = page.locator(`section.challenge[data-challenge="${challengeId}"]`);
        await editor
          .getByRole("textbox", { name: V.editor.textLabel })
          .fill(exercise.reference.text!);
        await editor.getByRole("button", { name: "Run tests", exact: true }).click();
        await expect(editor.locator(".challenge-complete")).toBeVisible();
      }
      const figure = page.locator(`#ix-${item.id}`);
      if (example.kind === "compiler-playground") {
        await figure.getByRole("button", { name: C.playground.run, exact: true }).click();
      }
      const label = figure.locator(".al-register-state");
      await expect(label).toHaveCount(1);
      await expect(label).toHaveText("Before the first instruction");
      const next = figure.getByRole("button", { name: /^(Next|Run the instruction)$/ });
      await next.click();
      const executed =
        example.after ??
        (await figure.locator('.al-insn[data-ran="true"] .al-text').first().innerText()).trim();
      await expect(label).toHaveText(`After ${executed}`);
      await expect(label.locator("code")).toHaveText(executed);
      const back = figure.getByRole("button", { name: "Back", exact: true });
      if (await back.count()) {
        await back.click();
        await expect(label).toHaveText("Before the first instruction");
        await next.click();
      }
      await figure.getByRole("button", { name: /^(Reset|Start again)$/ }).click();
      await expect(label).toHaveText("Before the first instruction");
      expect(await label.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
      expect(errors).toEqual([]);
    });
  }
}

test("the complete trip labels the returned values, then Back and Reset restore earlier moments", async ({
  page,
}) => {
  await openLesson(page, "meet-the-machine");
  const figure = page.locator("#ix-step-trip");
  const next = figure.getByRole("button", { name: "Next", exact: true });
  for (let i = 0; i < 4; i++) await next.click();
  await expect(figure.locator(".al-register-state")).toHaveText("Final values");
  await figure.getByRole("button", { name: "Back", exact: true }).click();
  await expect(figure.locator(".al-register-state")).toHaveText("After sub w0, w0, w3");
  await figure.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(figure.locator(".al-register-state")).toHaveText("Before the first instruction");
});
