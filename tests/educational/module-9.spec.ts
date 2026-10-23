// Copyright © 2026 Christopher Snow
import { expect, test, type Page } from "@playwright/test";
import { LESSONS } from "@al/content";
import { traceOf, viewAt, type MemoryTraceCall } from "../../packages/views/src/trace";
import { stackFrames, stackReturnTarget } from "../../packages/views/src/stack";
import { hexAddress, memoryRegister, hexByte } from "../../packages/views/src/memoryFigure";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { STACK_STRINGS as T } from "../../packages/views/src/strings.stack";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";
import { parseLine } from "../../packages/views/src/tap";
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

const routes = ["calls-and-returns", "recursive-calls"];
const lesson = (route: string) => LESSONS.find((l) => l.id === route)!;
const figures = (route: string) => lesson(route).sections.flatMap((s) => s.interactives);
interface Props {
  program: { listing: string };
  call: MemoryTraceCall;
  registers?: string[];
  after?: string;
  options?: { value: string; label: string }[];
  initialStep?: number;
}
const plain = (s: string) => s.replaceAll("`", "");
function answer(props: Props) {
  const t = traceOf(props.program, props.call);
  return t.result.stop.kind === "returned"
    ? memoryRegister(t, t.result.steps.length, "w0")
    : "limit";
}
async function unlock(page: Page, route: string) {
  for (const f of figures(route).filter((f) => f.kind.endsWith("prediction"))) {
    const p = f.props as unknown as Props;
    await commit(page, f.id, plain(p.options!.find((o) => o.value === answer(p))!.label));
  }
}

for (const route of routes) {
  test(`${route}: gates, committed feedback and persistence`, async ({ page }) => {
    const errors = watchErrors(page);
    await openLesson(page, route);
    await expect(page.locator(".interactive-problem,.interactive-missing")).toHaveCount(0);
    const gatedSteppers = route === "calls-and-returns" ? 2 : 3;
    await expect(page.locator(".al-locked")).toHaveCount(gatedSteppers);
    await unlock(page, route);
    await expect(page.locator(".al-locked")).toHaveCount(0);
    await expect(page.locator(".al-match")).toHaveCount(2);
    await page.reload();
    await expect(page.locator(".al-match")).toHaveCount(2);
    await page.evaluate((k) => localStorage.removeItem(k), storageKey(route));
    await page.reload();
    await expect(page.locator(".al-locked")).toHaveCount(gatedSteppers);
    expect(errors).toEqual([]);
  });
  for (const theme of ["light", "dark"])
    test(`${route}: stack diagram fits ${theme}`, async ({ page }, info) => {
      const errors = watchErrors(page);
      await page.goto("#/");
      await page.evaluate((v) => localStorage.setItem("assembly-lab:v1:theme", v), theme);
      await page.reload();
      await openLesson(page, route);
      await unlock(page, route);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
      expect(errors).toEqual([]);
    });
  test(`${route}: stack frames, registers, returns and rewind match the model`, async ({
    page,
  }) => {
    await openLesson(page, route);
    await unlock(page, route);
    for (const f of figures(route).filter((f) => f.kind === "stack-stepper")) {
      const p = f.props as unknown as Props;
      const trace = traceOf(p.program, p.call);
      const fig = page.locator(`#ix-${f.id}`);
      const slider = fig.getByRole("slider", { name: T.position });
      const checkpoints = [
        0,
        1,
        p.initialStep ?? Math.floor(trace.result.steps.length / 2),
        trace.result.steps.length,
      ];
      for (const k of checkpoints) {
        await slider.fill(String(k));
        await expect(fig.locator('[data-figure="stack-stepper"]')).toHaveAttribute(
          "data-k",
          String(k),
        );
        for (const name of p.registers!)
          await expect(fig.locator(`[data-register="${name}"] code`).nth(1)).toHaveText(
            memoryRegister(trace, k, name),
          );
        await expect(fig.locator('[data-register="sp"] code').nth(1)).toHaveText(
          hexAddress(Number(viewAt(trace, k).state.sp)),
        );
        const frames = stackFrames(trace, k);
        const target = stackReturnTarget(trace, k),
          address = `0x${target.address.toString(16)}`;
        await expect(fig.locator(".al-stack-return-target")).toHaveText(
          target.instruction === null
            ? T.returnOutside(address)
            : T.returnTarget(address, target.instruction),
        );
        await expect(fig.locator(".al-stack-frame")).toHaveCount(frames.length);
        for (const [i, frame] of frames.entries()) {
          const drawn = fig.locator(".al-stack-frame").nth(i);
          await expect(drawn).toHaveAttribute("data-invocation", String(frame.invocation));
          for (const slot of frame.slots)
            await expect(
              drawn.locator(`[data-slot-address="${hexAddress(slot.address)}"] code`),
            ).toHaveText(`0x${slot.value.toString(16)}`);
          await expect(
            fig.locator(".al-stack-frame").nth(i).locator(".al-stack-bytes [data-access] code"),
          ).toHaveText(frame.bytes.map(hexByte));
          const byteDetail = drawn.locator(".al-stack-detail");
          await expect(byteDetail).not.toHaveAttribute("open");
          for (const slot of frame.slots)
            await expect(
              drawn.locator(`.al-stack-slots [data-slot-address="${hexAddress(slot.address)}"]`),
            ).toBeVisible();
          if (i === 0) {
            await expect(drawn.locator(".al-stack-bytes [data-access]").first()).not.toBeVisible();
            await press(page, byteDetail.locator("summary"));
            await expect(drawn.locator(".al-stack-bytes [data-access]").first()).toBeVisible();
            await expect(fig.locator('[data-figure="stack-stepper"]')).toHaveAttribute(
              "data-k",
              String(k),
            );
            await press(page, byteDetail.locator("summary"));
            await expect(drawn.locator(".al-stack-bytes [data-access]").first()).not.toBeVisible();
          }
        }
      }
      await expect(fig.getByRole("button", { name: V.stepper.next })).toBeDisabled();
      if (trace.result.stop.kind === "limit")
        await expect(fig.getByRole("status")).toContainText(String(trace.result.steps.length));
      await press(page, fig.getByRole("button", { name: V.stepper.reset }));
      await expect(fig.locator(".al-stack-frame")).toHaveCount(0);
    }
  });
  for (const cdata of lesson(route).challenges) {
    test(`${cdata.id}: failure, reference, regrade and clear`, async ({ page }) => {
      await openLesson(page, route);
      const c = challenge(page, cdata.id),
        box = c.getByRole("textbox", { name: V.editor.textLabel });
      await press(page, run(c));
      await expect(c.locator(".verdict-failure").first()).toBeVisible();
      await box.fill(cdata.reference.text!);
      await press(page, run(c));
      await expect(status(c)).toHaveText(passing(5));
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await page.reload();
      await expect(c.locator(".challenge-complete")).toBeVisible();
      await page.evaluate(
        ({ key, id, text }) => {
          const saved = JSON.parse(localStorage.getItem(key)!);
          saved.challenges[id].artifact.text = text;
          localStorage.setItem(key, JSON.stringify(saved));
        },
        { key: storageKey(route), id: cdata.id, text: cdata.initial.text! },
      );
      await page.reload();
      await expect(c.locator(".challenge-complete")).toHaveCount(0);
      await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
      await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
      await expect(box).toHaveValue(cdata.initial.text!);
    });
  }
}

test("phone builds a complete nested call with stack-pair and label chips", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "phone", "touch editor");
  await openLesson(page, routes[0]!);
  const data = lesson(routes[0]!).challenges[0]!;
  const c = challenge(page, data.id);
  await c.getByRole("textbox", { name: V.editor.textLabel }).fill("");
  await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
  for (const [index, text] of data.reference.text!.split("\n").entries()) {
    await press(
      page,
      c.getByRole("button", { name: index === 0 ? V.editor.addFirst : V.editor.addBelow }),
    );
    const line = parseLine(text);
    await press(
      page,
      c
        .getByRole("group", { name: V.editor.instruction, exact: true })
        .getByRole("button", { name: line.mnemonic, exact: true }),
    );
    for (const [i, operand] of line.operands.entries()) {
      const group = c.getByRole("group", { name: V.editor.operand(i + 1), exact: true });
      if (/^#?\d+$/.test(operand)) {
        await press(page, group.getByRole("button", { name: V.editor.number, exact: true }));
        for (const digit of operand.replace("#", ""))
          await press(
            page,
            c
              .getByRole("group", { name: V.editor.numberPad, exact: true })
              .getByRole("button", { name: digit, exact: true }),
          );
      } else await press(page, group.getByRole("button", { name: operand, exact: true }));
    }
  }
  await press(page, c.getByRole("button", { name: V.editor.done, exact: true }));
  await expect(c.locator(".asm-error")).toHaveCount(0);
  await press(page, run(c));
  await expect(c.locator(".challenge-complete")).toBeVisible();
  expect(await designProblems(page, true)).toEqual([]);
});
