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
const routes = ["c-and-overflow", "checked-arithmetic"];
const lesson = (id: string) => LESSONS.find((l) => l.id === id)!;
const figures = (id: string) => lesson(id).sections.flatMap((s) => s.interactives);
type Props = {
  program: { c: string; listing: string };
  call: MemoryTraceCall;
  registers: (number | string)[];
  options: { value: string; label: string }[];
  measure: { kind: string; register: string | number; as?: string };
};
const hex = (value: bigint, width = 32) =>
  `0x${BigInt.asUintN(width, value)
    .toString(16)
    .padStart(width / 4, "0")}`;
async function unlock(page: Page, route: string) {
  for (const f of figures(route).filter((f) => f.kind.endsWith("prediction"))) {
    const p = f.props as unknown as Props;
    const trace = traceOf(p.program, p.call);
    const value = trace.result.final.x[0]!;
    const answer =
      f.kind === "memory-prediction" || p.measure.as === "hex"
        ? hex(value)
        : String(BigInt.asUintN(32, value));
    const option = p.options.find((o) => o.value === answer);
    if (!option) throw Error(`${f.id}: no model-derived option ${answer}`);
    await commit(page, f.id, option.label.replaceAll("`", ""));
  }
}
for (const route of routes) {
  for (const theme of ["light", "dark"]) {
    test(`${route}: predictions, figures and notes fit in ${theme}`, async ({ page }, info) => {
      const errors = watchErrors(page);
      await page.goto("#/");
      await page.evaluate((t) => localStorage.setItem("assembly-lab:v1:theme", t), theme);
      await page.reload();
      await openLesson(page, route);
      await expect(page.locator(".al-outcome")).toHaveCount(0);
      await expect(
        page.locator('[data-figure="stepper"],[data-figure="memory-stepper"]'),
      ).toHaveCount(0);
      await unlock(page, route);
      await expect(page.locator(".interactive-problem,.interactive-missing")).toHaveCount(0);
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
}
test("checked addition exposes carry versus overflow and stored bytes", async ({ page }) => {
  await openLesson(page, routes[1]!);
  await unlock(page, routes[1]!);
  const f = figures(routes[1]!).find((f) => f.id === "step-wrong-overflow")!;
  const p = f.props as unknown as Props;
  const trace = traceOf(p.program, p.call);
  const figure = page.locator(`#ix-${f.id}`);
  for (let k = 0; k <= trace.result.steps.length; k++) {
    const state = viewAt(trace, k).state;
    for (const name of ["n", "z", "c", "v"] as const)
      await expect(figure.locator(`[data-flag="${name}"]`)).toHaveAttribute(
        "data-value",
        String(+state.flags[name]),
      );
    for (const name of ["w0", "w1", "x2"])
      await expect(figure.locator(`[data-register="${name}"] code`).nth(1)).toHaveText(
        hex(state.x[Number(name.slice(1))]!, name.startsWith("x") ? 64 : 32),
      );
    if (k < trace.result.steps.length)
      await press(page, figure.getByRole("button", { name: V.stepper.next }));
  }
  await expect(figure.locator('[data-address="0x410003"] .al-memory-value')).toHaveText("80");
  await expect(figure.locator('[data-address="0x410004"] .al-memory-value')).toHaveText("11");
  await expect(figure.getByRole("button", { name: V.stepper.next })).toBeDisabled();
});
for (const item of [
  { route: routes[0]!, id: "write-increment-limit", wrong: "mov w0, #0\nret" },
  { route: routes[0]!, id: "write-safe-increment", wrong: "add w0, w0, #1\nret" },
  { route: routes[1]!, id: "write-fuel-fits", wrong: "cmp w0, #255\ncset w0, le\nret" },
  {
    route: routes[1]!,
    id: "write-checked-trip",
    wrong: "adds w0, w0, w1\nstr w0, [x2]\ncset w0, cs\nret",
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
