// Copyright © 2026 Christopher Snow

// These browser checks follow the machine's memory and register states, including the bytes a
// store must leave alone and the upper half that a write to a W register clears.
import { expect, test, type Page } from "@playwright/test";
import { LESSONS } from "@al/content";
import {
  memoryAt,
  traceOf,
  viewAt,
  type MemoryTraceCall,
  type Trace,
} from "../../packages/views/src/trace";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";
import { READ_SENSORS_TEXT } from "../../content/lessons/memory.listings";
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
  stored,
  watchErrors,
} from "./module1";

const MEMORY = "memory-and-addresses";
const WIDTHS = "loading-widths";
const lesson = (id: string) => LESSONS.find((item) => item.id === id)!;
const figures = (id: string) => lesson(id).sections.flatMap((s) => s.interactives ?? []);
const plain = (s: string) => s.replaceAll("`", "");
const byteHex = (n: number) => n.toString(16).padStart(2, "0");
const registerHex = (trace: Trace, k: number, name: string) => {
  const width = name.startsWith("w") ? 32 : 64;
  return `0x${BigInt.asUintN(width, viewAt(trace, k).state.x[Number(name.slice(1))]!)
    .toString(16)
    .padStart(width / 4, "0")}`;
};

interface FigureProps {
  program: { listing: string };
  call: MemoryTraceCall;
  registers: string[];
  memory?: { address: number; length: number };
  after?: string;
  extension?: boolean;
  cases?: (Pick<FigureProps, "program" | "call" | "registers"> & { label: string })[];
}
interface PredictionProps extends FigureProps {
  options: { value: string; label: string }[];
  measure:
    | { kind: "register-at-end"; register: string }
    | { kind: "memory-at-end"; address: number; length: number };
}
const propsOf = (route: string, id: string) =>
  figures(route).find((f) => f.id === id)!.props as unknown as FigureProps;
const predictions = [MEMORY, WIDTHS].flatMap((route) =>
  figures(route)
    .filter((f) => f.kind === "memory-prediction")
    .map((f) => ({ route, id: f.id, props: f.props as unknown as PredictionProps })),
);

function answerOf(props: PredictionProps): string {
  const trace = traceOf(props.program, props.call);
  expect(trace.result.stop.kind).toBe("returned");
  return props.measure.kind === "register-at-end"
    ? registerHex(trace, trace.result.steps.length, props.measure.register)
    : [...trace.result.read(props.measure.address, props.measure.length)!].map(byteHex).join(" ");
}

async function unlock(page: Page, route: string, id?: string) {
  const needed = predictions.filter((p) => p.route === route && (id === undefined || p.id === id));
  for (const p of needed) {
    const option = p.props.options.find((o) => o.value === answerOf(p.props))!;
    await commit(page, p.id, plain(option.label));
  }
}

async function checkState(page: Page, id: string, props: FigureProps, trace: Trace, k: number) {
  const figure = page.locator(`#ix-${id}`);
  await expect(figure.locator('[data-figure="memory-stepper"]')).toHaveAttribute(
    "data-k",
    String(k),
  );
  for (const name of props.registers)
    await expect(figure.locator(`[data-register="${name}"] code`).nth(1)).toHaveText(
      registerHex(trace, k, name),
    );
  if (props.memory) {
    const bytes = memoryAt(trace, k, props.memory.address, props.memory.length)!;
    await expect(figure.locator(".al-memory-cells .al-memory-value")).toHaveText(
      bytes.map(byteHex),
    );
    for (const [index] of bytes.entries())
      await expect(figure.locator(".al-memory-cells li").nth(index)).toHaveAttribute(
        "data-address",
        `0x${(props.memory.address + index).toString(16)}`,
      );
  }
}

for (const route of [MEMORY, WIDTHS]) {
  test(`${route}: ten sections, two challenges and no browser errors`, async ({ page }) => {
    const errors = watchErrors(page);
    await openLesson(page, route);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson(route).title);
    await expect(page.locator("section.challenge")).toHaveCount(2);
    await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  for (const theme of ["light", "dark"]) {
    test(`${route}: memory diagrams and controls fit in ${theme}`, async ({ page }, info) => {
      const errors = watchErrors(page);
      await page.goto("#/");
      await page.evaluate((value) => localStorage.setItem("assembly-lab:v1:theme", value), theme);
      await page.reload();
      await openLesson(page, route);
      await unlock(page, route);
      for (const f of figures(route).filter((item) => item.kind === "memory-stepper"))
        await press(
          page,
          page.locator(`#ix-${f.id}`).getByRole("button", { name: V.stepper.next }),
        );
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
      expect(await page.locator(".al-memory-transfer").count()).toBeGreaterThan(0);
      expect(errors).toEqual([]);
    });
  }

  test(`${route}: every stepper shows model registers and bytes, then rewinds cleanly`, async ({
    page,
  }) => {
    await openLesson(page, route);
    await unlock(page, route);
    for (const f of figures(route).filter((item) => item.kind === "memory-stepper")) {
      const props = f.props as unknown as FigureProps;
      const trace = traceOf(props.program, props.call);
      const figure = page.locator(`#ix-${f.id}`);
      await checkState(page, f.id, props, trace, 0);
      for (let k = 1; k <= trace.result.steps.length; k++) {
        await press(page, figure.getByRole("button", { name: V.stepper.next }));
        await checkState(page, f.id, props, trace, k);
      }
      await expect(figure.getByRole("button", { name: V.stepper.next })).toBeDisabled();
      await press(page, figure.getByRole("button", { name: V.stepper.back }));
      await checkState(page, f.id, props, trace, trace.result.steps.length - 1);
      await press(page, figure.getByRole("button", { name: V.stepper.reset }));
      await checkState(page, f.id, props, trace, 0);
      await expect(figure.locator(".al-memory-transfer")).toHaveCount(0);
    }
  });
}

for (const p of predictions) {
  test(`${p.id}: answers stay hidden until committed, persist, and disappear when saved work is removed`, async ({
    page,
  }) => {
    await openLesson(page, p.route);
    const figure = page.locator(`#ix-${p.id}`);
    const right = p.props.options.find((o) => o.value === answerOf(p.props))!;
    const wrong = p.props.options.find((o) => o.value !== right.value)!;
    const gated = figures(p.route).filter((f) => (f.props as { after?: string }).after === p.id);
    expect(gated.length).toBeGreaterThan(0);
    await expect(figure.locator(".al-outcome")).toHaveCount(0);
    await expect(figure.getByRole("button", { name: V.prediction.commit })).toBeDisabled();
    for (const f of gated) await expect(page.locator(`#ix-${f.id} .al-locked`)).toBeVisible();
    await figure.getByRole("radio", { name: plain(right.label), exact: true }).check();
    await expect(figure.locator(".al-outcome")).toHaveCount(0);
    for (const f of gated) await expect(page.locator(`#ix-${f.id} .al-locked`)).toBeVisible();
    await press(page, figure.getByRole("button", { name: V.prediction.commit }));
    await expect(figure.locator(".al-match")).toBeVisible();
    for (const f of gated) await expect(page.locator(`#ix-${f.id} .al-locked`)).toHaveCount(0);
    await commit(page, p.id, plain(wrong.label));
    await expect(figure.locator(".al-nomatch")).toBeVisible();
    await page.reload();
    await expect(figure.locator(".al-nomatch")).toBeVisible();
    await page.evaluate((key) => localStorage.removeItem(key), storageKey(p.route));
    await page.reload();
    await expect(figure.locator(".al-outcome")).toHaveCount(0);
    for (const f of gated) await expect(page.locator(`#ix-${f.id} .al-locked`)).toBeVisible();
  });
}

test("store widths mark only the bytes written, including a neighbouring-byte corruption", async ({
  page,
}) => {
  await openLesson(page, MEMORY);
  await unlock(page, MEMORY, "predict-wide-fuel-store");
  for (const id of ["step-wide-fuel-store", "step-byte-fuel-store", "step-half-pulse-store"]) {
    const props = propsOf(MEMORY, id);
    const trace = traceOf(props.program, props.call);
    const figure = page.locator(`#ix-${id}`);
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
    const store = trace.result.steps[0]!.stores[0]!;
    await expect(figure.locator('.al-memory-cells [data-access="stored"]')).toHaveCount(
      store.after.length,
    );
    const initial = memoryAt(trace, 0, props.memory!.address, props.memory!.length)!;
    const after = memoryAt(trace, 1, props.memory!.address, props.memory!.length)!;
    expect(after.slice(store.after.length)).toEqual(initial.slice(store.after.length));
    await checkState(page, id, props, trace, 1);
  }
});

test("sign extension to W fills its low word while clearing the upper half; extension to X fills both halves", async ({
  page,
}) => {
  await openLesson(page, WIDTHS);
  await unlock(page, WIDTHS, "predict-signed-gradient");
  for (const [id, selected, loaded, signed, cleared] of [
    ["step-signed-gradient", null, 1, 3, 4],
    ["step-unsigned-fuel", 5, 1, 7, 0],
    ["step-unsigned-fuel", 3, 2, 2, 4],
    ["step-unsigned-fuel", 4, 4, 4, 0],
  ] as const) {
    const figure = page.locator(`#ix-${id}`);
    const base = propsOf(WIDTHS, id);
    const props = selected === null ? base : { ...base, ...base.cases![selected]! };
    const trace = traceOf(props.program, props.call);
    const reset = figure.getByRole("button", { name: V.stepper.reset });
    if (await reset.isEnabled()) await press(page, reset);
    if (selected !== null) await figure.getByRole("combobox").selectOption(String(selected));
    await press(page, figure.getByRole("button", { name: V.stepper.next }));
    const diagram = figure.locator(".al-memory-register-bytes");
    await expect(diagram.locator('[data-role="loaded"]')).toHaveCount(loaded);
    await expect(diagram.locator('[data-role="signFill"]')).toHaveCount(signed);
    await expect(diagram.locator('[data-role="clearedUpper"]')).toHaveCount(cleared);
    const x0 = viewAt(trace, 1).state.x[0]!;
    for (let byte = 0; byte < 8; byte++)
      await expect(diagram.locator(`[data-byte="${byte}"] .al-memory-value`)).toHaveText(
        byteHex(Number((x0 >> BigInt(8 * byte)) & 255n)),
      );
  }
});

const writes = [
  { route: MEMORY, id: "write-save-distance", wrong: "str x1, [x0]\nret" },
  {
    route: MEMORY,
    id: "write-copy-distance",
    wrong: "ldr w2, [x0]\nstr w2, [x0]\nmov w0, w2\nret",
  },
  { route: WIDTHS, id: "write-adjust-gradient", wrong: "ldrb w2, [x0]\nadd w0, w2, w1\nret" },
  { route: WIDTHS, id: "write-read-sensors", wrong: READ_SENSORS_TEXT.replace("ldrsb", "ldrb") },
];

for (const item of writes) {
  const data = lesson(item.route).challenges.find((c) => c.id === item.id)!;
  if (data.tests.kind !== "answers") throw new Error("Module 6 uses register and memory cases.");
  const caseCount = data.tests.cases.length;
  test(`${item.id}: starter and plausible wrong instructions fail, reference passes`, async ({
    page,
  }) => {
    await openLesson(page, item.route);
    const c = challenge(page, item.id);
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await expect(box).toHaveValue(data.initial.text!);
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toBeVisible();
    await box.fill(item.wrong);
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toBeVisible();
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await box.fill(data.reference.text!);
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(caseCount));
    await expect(c.locator(".challenge-complete")).toBeVisible();
  });

  test(`${item.id}: reload regrades persisted work and Clear work restores the starter`, async ({
    page,
  }) => {
    await openLesson(page, item.route);
    const c = challenge(page, item.id);
    await c.getByRole("textbox", { name: V.editor.textLabel }).fill(data.reference.text!);
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.reload();
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.evaluate(
      ({ key, id, text }) => {
        const saved = JSON.parse(localStorage.getItem(key)!);
        saved.challenges[id].artifact.text = text;
        localStorage.setItem(key, JSON.stringify(saved));
      },
      { key: storageKey(item.route), id: item.id, text: item.wrong },
    );
    await page.reload();
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(c.getByRole("textbox", { name: V.editor.textLabel })).toHaveValue(
      data.initial.text!,
    );
    await page.reload();
    await expect(c.getByRole("textbox", { name: V.editor.textLabel })).toHaveValue(
      data.initial.text!,
    );
  });
}

test("a phone learner builds the complete sensor reader with address chips", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "phone", "the phone editor uses taps");
  const errors = watchErrors(page);
  await openLesson(page, WIDTHS);
  const c = challenge(page, "write-read-sensors");
  await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
  await expect(c.getByRole("textbox")).toHaveCount(0);
  const lines = [
    ["ldrsb", "w1", "[x0, #4]"],
    ["ldrb", "w2", "[x0, #5]"],
    ["ldrh", "w3", "[x0, #6]"],
    ["ldr", "w0", "[x0]"],
    ["ret"],
  ];
  for (const [index, operands] of lines.entries()) {
    await press(
      page,
      index === 0
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
  expect((await stored(page, WIDTHS)).challenges["write-read-sensors"].artifact.text).toBe(
    READ_SENSORS_TEXT,
  );
  await press(page, run(c));
  await expect(c.locator(".challenge-complete")).toBeVisible();
  expect(await designProblems(page, true)).toEqual([]);
  expect(await figureOverflow(page)).toEqual([]);
  expect(errors).toEqual([]);
});
