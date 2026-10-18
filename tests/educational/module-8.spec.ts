// Copyright © 2026 Christopher Snow
import { expect, test, type Page } from "@playwright/test";
import { LESSONS } from "@al/content";
import { traceOf, viewAt, type MemoryTraceCall } from "../../packages/views/src/trace";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";
import { designProblems } from "./design";
import {
  challenge,
  commit,
  figureOverflow,
  openLesson,
  passing,
  press,
  run,
  status,
  storageKey,
  watchErrors,
} from "./module1";
const routes = ["products-and-widths", "division-and-remainders"];
const lesson = (id: string) => LESSONS.find((l) => l.id === id)!;
const figures = (id: string) => lesson(id).sections.flatMap((s) => s.interactives);
type Props = {
  program: { c: string; listing: string };
  call: MemoryTraceCall;
  registers: string[];
  after?: string;
  options: { value: string; label: string }[];
  measure: { register: string };
};
const hex = (value: bigint, width: number) =>
  `0x${BigInt.asUintN(width, value)
    .toString(16)
    .padStart(width / 4, "0")}`;
async function unlock(page: Page, route: string) {
  for (const figure of figures(route).filter((f) => f.kind === "memory-prediction")) {
    const p = figure.props as unknown as Props;
    const r = traceOf(p.program, p.call);
    const answer = hex(r.result.final.x[0]!, p.measure.register.startsWith("x") ? 64 : 32);
    const option = p.options.find((o) => o.value === answer)!;
    await commit(page, figure.id, option.label.replaceAll("`", ""));
  }
}
for (const route of routes) {
  for (const theme of ["light", "dark"]) {
    test(`${route}: diagrams fit in ${theme} and predictions stay gated`, async ({
      page,
    }, info) => {
      const errors = watchErrors(page);
      await page.goto("#/");
      await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      await page.reload();
      await openLesson(page, route);
      await expect(page.locator(".al-outcome")).toHaveCount(0);
      await expect(
        page.locator('[data-figure="product-halves"],[data-figure="division-parts"]'),
      ).toHaveCount(0);
      await unlock(page, route);
      await expect(page.locator(".interactive-problem,.interactive-missing")).toHaveCount(0);
      await expect(
        page.locator('[data-figure="product-halves"],[data-figure="division-parts"]'),
      ).toHaveCount(1);
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
  test(`${route}: every displayed register follows model steps`, async ({ page }) => {
    await openLesson(page, route);
    await unlock(page, route);
    for (const f of figures(route).filter((f) => f.kind === "memory-stepper")) {
      const p = f.props as unknown as Props;
      const trace = traceOf(p.program, p.call);
      const figure = page.locator(`#ix-${f.id}`);
      for (let k = 0; k <= trace.result.steps.length; k++) {
        await expect(figure.locator('[data-figure="memory-stepper"]')).toHaveAttribute(
          "data-k",
          String(k),
        );
        for (const register of p.registers)
          await expect(figure.locator(`[data-register="${register}"] code`).nth(1)).toHaveText(
            hex(
              viewAt(trace, k).state.x[Number(register.slice(1))]!,
              register.startsWith("x") ? 64 : 32,
            ),
          );
        if (k < trace.result.steps.length)
          await press(page, figure.getByRole("button", { name: V.stepper.next }));
      }
      await expect(figure.getByRole("button", { name: V.stepper.next })).toBeDisabled();
    }
  });
}
for (const item of [
  { route: routes[0]!, id: "write-scaled-total", wrong: "mul w0, w0, w1\nret" },
  { route: routes[0]!, id: "write-wide-product", wrong: "smull x0, w0, w1\nret" },
  { route: routes[1]!, id: "write-remainder", wrong: "udiv w2, w0, w1\nmsub w0, w2, w1, w0\nret" },
  {
    route: routes[1]!,
    id: "write-consumption",
    wrong: "mov w2, #100\nmul w0, w0, w2\nudiv x0, x0, x1\nret",
  },
]) {
  test(`${item.id}: wrong work fails and correct work survives reload and clear`, async ({
    page,
  }) => {
    const data = lesson(item.route).challenges.find((c) => c.id === item.id)!;
    if (data.tests.kind !== "answers") throw Error("Expected answers");
    await openLesson(page, item.route);
    const c = challenge(page, item.id);
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toBeVisible();
    await box.fill(item.wrong);
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toBeVisible();
    await box.fill(data.reference.text!);
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(data.tests.cases.length));
    await page.reload();
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.evaluate(
      ({ key, id, text }) => {
        const state = JSON.parse(localStorage.getItem(key)!);
        state.challenges[id].artifact.text = text;
        localStorage.setItem(key, JSON.stringify(state));
      },
      { key: storageKey(item.route), id: item.id, text: item.wrong },
    );
    await page.reload();
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(box).toHaveValue(data.initial.text!);
  });
}
test("phone builds four-operand multiply-add with operand chips", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "the phone editor uses taps");
  await openLesson(page, routes[0]!);
  const c = challenge(page, "write-scaled-total");
  await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
  for (const [i, operands] of [["madd", "w0", "w0", "w1", "w2"], ["ret"]].entries()) {
    await press(
      page,
      i === 0
        ? c.locator(".asm-line-button").first()
        : c.getByRole("button", { name: V.editor.addBelow }),
    );
    for (const [position, value] of operands.entries())
      await press(
        page,
        c
          .getByRole("group", {
            name: position === 0 ? V.editor.instruction : V.editor.operand(position),
            exact: true,
          })
          .getByRole("button", { name: value, exact: true }),
      );
  }
  await press(page, c.getByRole("button", { name: V.editor.done, exact: true }));
  await expect(c.locator(".asm-error")).toHaveCount(0);
  await press(page, run(c));
  await expect(c.locator(".challenge-complete")).toBeVisible();
  expect(await designProblems(page, true)).toEqual([]);
});
