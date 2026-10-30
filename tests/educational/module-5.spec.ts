// Copyright © 2026 Christopher Snow

// A learner follows real loop traces, commits predictions before seeing outcomes, and builds
// loops with both editors. The machine supplies the expected counts, values and stop reasons.
import { expect, test, type Page } from "@playwright/test";
import { LESSONS } from "@al/content";
import {
  DIM_UP,
  DIM_UP_BEQ,
  DIM_DOWN,
  DIM_DO,
  DIM_DOWN_WRONG,
  DIM_UP_TEXT,
  DIM_DOWN_TEXT,
  DIM_UNTIL_DARK_TEXT,
} from "../../content/lessons/loops.listings";
import {
  traceOf,
  viewAt,
  wValue,
  type Trace,
  type TraceCall,
} from "../../packages/views/src/trace";
import { VIEW_STRINGS as V } from "../../packages/views/src/strings";
import { LOOP_STRINGS as L } from "../../packages/views/src/strings.loop";
import { DEFAULT_STRINGS as S } from "../../platform/lesson-runtime/src/strings";
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

const UP = "counting-up";
const DOWN = "counting-down";
const WRITE = "writing-an-upward-loop";
const TEST = "testing-before-and-after";
const EARLY = "stopping-when-work-ends";
const lesson = (id: string) => LESSONS.find((item) => item.id === id)!;
const plain = (s: string) => s.replaceAll("`", "");
const interactive = (id: string, figure: string) =>
  lesson(id)
    .sections.flatMap((s) => s.interactives ?? [])
    .find((f) => f.id === figure)!;

// Read the real trace, independently of the figure's loop-summary helper.
function bodyValues(trace: Trace, label: string): number[] {
  const address = trace.program.symbols[label]!.address;
  return trace.result.steps.flatMap((step, i) =>
    step.address === address ? [wValue(viewAt(trace, i + 1).state, 0)] : [],
  );
}

async function choosePrediction(page: Page, route: string, id: string, value: string) {
  const props = interactive(route, id).props as { options: { value: string; label: string }[] };
  const option = props.options.find((item) => item.value === value)!;
  return commit(page, id, plain(option.label));
}

async function checkRuns(page: Page, route: string, id: string) {
  const props = interactive(route, id).props as {
    program: { listing: string };
    bodyLabel: string;
    runs: { label: string; call: TraceCall }[];
  };
  const figure = page.locator(`#ix-${id}`);
  await figure.scrollIntoViewIfNeeded();
  await expect(figure.locator(".al-loop-bar-row")).toHaveCount(props.runs.length);
  for (const [i, item] of props.runs.entries()) {
    const trace = traceOf(props.program, { ...item.call, maxSteps: item.call.maxSteps ?? 256 });
    const values = bodyValues(trace, props.bodyLabel);
    const row = figure.locator(".al-loop-bar-row").nth(i);
    await expect(row).toHaveAttribute("data-visits", String(values.length));
    await expect(row).toHaveAttribute(
      "data-returned",
      String(trace.result.stop.kind === "returned"),
    );
    await press(page, figure.getByRole("button", { name: plain(item.label), exact: true }));
    await expect(row).toHaveAttribute("data-selected", "true");
    await expect(figure.locator(".al-loop-values strong")).toHaveText(
      [wValue(trace.result.initial, 0), ...values.slice(0, 12)].map(String),
    );
    await expect(figure.getByRole("status")).toHaveAttribute("data-stop", trace.result.stop.kind);
    if (trace.result.stop.kind === "returned")
      await expect(figure.getByRole("status")).toHaveText(
        L.returned(wValue(trace.result.final, 0)),
      );
    else {
      await expect(row).toContainText(L.partialIterations(values.length));
      await expect(figure.getByRole("status")).not.toContainText("Returned");
    }
  }
}

for (const route of [UP, WRITE, DOWN, TEST, EARLY]) {
  test(`${route}: selected sections, local challenges and no browser or figure errors`, async ({
    page,
  }) => {
    const errors = watchErrors(page);
    await openLesson(page, route);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson(route).title);
    await expect(page.locator("section.challenge")).toHaveCount(lesson(route).challenges.length);
    await expect(page.locator(".interactive-problem, .interactive-missing")).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  for (const theme of ["light", "dark"]) {
    test(`${route}: readable figures and reachable controls in ${theme}`, async ({
      page,
    }, info) => {
      await page.goto("#/");
      await page.evaluate((value) => localStorage.setItem("assembly-lab:v1:theme", value), theme);
      await page.reload();
      await openLesson(page, route);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      for (const p of predictions.filter((p) => p.route === route))
        await choosePrediction(page, route, p.id, p.right);
      expect(await designProblems(page, info.project.name === "phone")).toEqual([]);
      expect(await figureOverflow(page)).toEqual([]);
      const bars = page.locator(".al-loop-bar");
      if (await bars.count()) {
        const paints = await bars.first().evaluate((el) => ({
          bar: getComputedStyle(el).backgroundColor,
          track: getComputedStyle(el.parentElement!).backgroundColor,
          height: el.getBoundingClientRect().height,
        }));
        expect(paints.bar).not.toBe(paints.track);
        expect(paints.height).toBeGreaterThan(0);
      }
    });
  }
}

const upTrace = traceOf(DIM_UP, { entry: "dim_up", args: [128, 2, 5] });
const downTrace = traceOf(DIM_DOWN, { entry: "dim_down", args: [128, 3] });
const predictions = [
  {
    route: UP,
    id: "predict-dim-up-count",
    right: String(upTrace.result.steps.length),
    gated: ["step-dim-up", "dim-up-runs"],
  },
  {
    route: WRITE,
    id: "predict-dim-up-beq",
    right: String(
      wValue(traceOf(DIM_UP_BEQ, { entry: "dim_up", args: [128, 2, 5] }).result.final, 0),
    ),
    gated: ["dim-up-beq-runs"],
  },
  {
    route: DOWN,
    id: "predict-dim-down-body",
    right: String(bodyValues(downTrace, ".L3").length),
    gated: ["step-dim-down", "dim-down-runs"],
  },
  {
    route: TEST,
    id: "predict-dim-do-zero",
    right: traceOf(DIM_DO, { entry: "dim_do", args: [128, 0], maxSteps: 20 }).result.stop.kind,
    gated: ["step-dim-do-zero", "step-dim-down-wrong"],
  },
];

for (const prediction of predictions) {
  test(`${prediction.id}: selecting does not reveal, committing does, and reload keeps the commitment`, async ({
    page,
  }) => {
    await openLesson(page, prediction.route);
    const f = page.locator(`#ix-${prediction.id}`);
    const props = interactive(prediction.route, prediction.id).props as {
      options: { value: string; label: string }[];
    };
    const right = props.options.find((o) => o.value === prediction.right)!;
    const wrong = props.options.find((o) => o.value !== prediction.right)!;
    await expect(f.locator(".al-outcome")).toHaveCount(0);
    await expect(f.getByRole("button", { name: V.prediction.commit })).toBeDisabled();
    for (const id of prediction.gated)
      await expect(page.locator(`#ix-${id} .al-locked`)).toBeVisible();
    await f.getByRole("radio", { name: plain(right.label), exact: true }).check();
    await expect(f.locator(".al-outcome")).toHaveCount(0);
    for (const id of prediction.gated)
      await expect(page.locator(`#ix-${id} .al-locked`)).toBeVisible();
    await press(page, f.getByRole("button", { name: V.prediction.commit }));
    await expect(f.locator(".al-match")).toBeVisible();
    for (const id of prediction.gated)
      await expect(page.locator(`#ix-${id} .al-locked`)).toHaveCount(0);
    await choosePrediction(page, prediction.route, prediction.id, wrong.value);
    await expect(f.locator(".al-nomatch")).toBeVisible();
    await page.reload();
    await expect(f.locator(".al-nomatch")).toBeVisible();
  });
}

test("counting up: bars count body executions, including zero, and history follows the model", async ({
  page,
}) => {
  await openLesson(page, UP);
  await choosePrediction(page, UP, "predict-dim-up-count", "15");
  await checkRuns(page, UP, "dim-up-runs");
  await expect(page.locator('#ix-dim-up-runs .al-loop-bar-row[data-visits="0"]')).toHaveCount(2);
  await expect(page.locator("#ix-dim-up-runs")).toContainText(L.noIterations);
});

test("changing the backward condition changes the completed run shown", async ({ page }) => {
  await openLesson(page, WRITE);
  await choosePrediction(page, WRITE, "predict-dim-up-beq", "64");
  await checkRuns(page, WRITE, "dim-up-beq-runs");
});

test("counting down: zero skips the body and each nonzero run matches the model", async ({
  page,
}) => {
  await openLesson(page, DOWN);
  await choosePrediction(page, DOWN, "predict-dim-down-body", "3");
  await checkRuns(page, DOWN, "dim-down-runs");
  await expect(page.locator('#ix-dim-down-runs .al-loop-bar-row[data-visits="0"]')).toHaveCount(1);
});

test("do-while at zero and the wrong unsigned comparison show partial traces, never successful returns", async ({
  page,
}) => {
  await openLesson(page, TEST);
  await choosePrediction(page, TEST, "predict-dim-do-zero", "limit");
  const stepper = page.locator("#ix-step-dim-do-zero");
  const doTrace = traceOf(DIM_DO, { entry: "dim_do", args: [128, 0], maxSteps: 20 });
  await press(page, stepper.getByRole("button", { name: V.stepper.next }));
  await press(page, stepper.getByRole("button", { name: V.stepper.next }));
  const wrapped = viewAt(doTrace, 2).state;
  expect(wValue(wrapped, 1)).toBe(0xffffffff);
  expect(wrapped.flags.z).toBe(false);
  await expect(registerValue(stepper, "w1")).toHaveText(String(wValue(wrapped, 1)));
  await expect(stepper.locator('.al-flag[data-flag="z"]')).toHaveAttribute("data-value", "0");
  for (let k = 2; k < doTrace.result.steps.length; k++)
    await press(page, stepper.getByRole("button", { name: V.stepper.next }));
  await expect(stepper.getByRole("button", { name: V.stepper.next })).toBeDisabled();
  await expect(stepper.getByRole("status")).toContainText("20");
  const wrong = traceOf(DIM_DOWN_WRONG, { entry: "dim_down_wrong", args: [128, 3], maxSteps: 20 });
  expect(wrong.result.stop.kind).toBe("limit");
  const wrongStepper = page.locator("#ix-step-dim-down-wrong");
  for (let k = 0; k < wrong.result.steps.length; k++)
    await press(page, wrongStepper.getByRole("button", { name: V.stepper.next }));
  await expect(wrongStepper.getByRole("status")).toContainText("20");
});

test("the stepper makes a taken backward branch and its next instruction visible", async ({
  page,
}) => {
  await openLesson(page, UP);
  await choosePrediction(page, UP, "predict-dim-up-count", "15");
  const f = page.locator("#ix-step-dim-up");
  // The first backward branch follows cmp, bcs, lsr, add and cmp.
  for (let i = 0; i < 6; i++) await press(page, f.getByRole("button", { name: V.stepper.next }));
  await expect(f.locator('[data-figure="stepper"]')).toHaveAttribute("data-jump", "true");
  await expect(f.locator('.al-insn[data-next="true"] .al-text')).toHaveText("lsr w0, w0, 1");
  await expect(f.locator(".al-status")).toContainText("bne .L3 was taken.");
  await expect(f.locator(".al-status")).toContainText("Next: lsr w0, w0, 1 at .L3.");
  await expect(registerValue(f, "w0")).toHaveText(String(wValue(viewAt(upTrace, 6).state, 0)));
  await expect(registerValue(f, "w1")).toHaveText(String(wValue(viewAt(upTrace, 6).state, 1)));
});

test("the wrong-loop stepper shows cmp replacing the subtraction's borrow flag", async ({
  page,
}) => {
  await openLesson(page, TEST);
  await choosePrediction(page, TEST, "predict-dim-do-zero", "limit");
  const f = page.locator("#ix-step-dim-down-wrong");
  const trace = traceOf(DIM_DOWN_WRONG, {
    entry: "dim_down_wrong",
    args: [128, 3],
    maxSteps: 20,
  });
  // Three complete iterations bring the count to zero. On the fourth, subs wraps it;
  // cmp then overwrites C, so bcs continues even though the subtraction borrowed.
  for (let k = 1; k <= 16; k++) {
    await press(page, f.getByRole("button", { name: V.stepper.next }));
    if (k === 14 || k === 15) {
      const state = viewAt(trace, k).state;
      await expect(registerValue(f, "w1")).toHaveText(String(wValue(state, 1)));
      await expect(f.locator('.al-flag[data-flag="c"]')).toHaveAttribute(
        "data-value",
        String(Number(state.flags.c)),
      );
      expect(state.flags.c).toBe(k === 15);
    }
  }
  await expect(f.locator(".al-status")).toContainText("bcs .Lloop was taken.");
  await expect(f.locator('.al-insn[data-next="true"] .al-text')).toHaveText("lsr w0, w0, 1");
  await expect(f.locator('[data-figure="stepper"]')).toHaveAttribute("data-jump", "true");
});

const writes = [
  {
    route: WRITE,
    id: "write-dim-up",
    reference: DIM_UP_TEXT,
    wrong: DIM_UP_TEXT.replace("b.cs done", "b.eq done"),
  },
  {
    route: DOWN,
    id: "write-dim-down",
    reference: DIM_DOWN_TEXT,
    wrong: DIM_DOWN_TEXT.replace("cbz w1, done\n", ""),
  },
  {
    route: EARLY,
    id: "write-dim-until-dark",
    reference: DIM_UNTIL_DARK_TEXT,
    wrong: DIM_DOWN_TEXT,
  },
];

for (const item of writes) {
  test(`${item.id}: starting and plausible wrong loops fail, the reference passes`, async ({
    page,
  }) => {
    await openLesson(page, item.route);
    const c = challenge(page, item.id);
    const box = c.getByRole("textbox", { name: V.editor.textLabel });
    await expect(box).toHaveValue("ret");
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toBeVisible();
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await box.fill(item.wrong);
    await press(page, run(c));
    await expect(c.locator(".verdict-failure").first()).toBeVisible();
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await box.fill(item.reference);
    await press(page, run(c));
    await expect(status(c)).toHaveText(passing(item.id === "write-dim-up" ? 7 : 6));
    await expect(c.locator(".challenge-complete")).toBeVisible();
  });
}

test("the answer capstone grades both results and instruction counts, and names a mistaken count", async ({
  page,
}) => {
  await openLesson(page, UP);
  const c = challenge(page, "count-dim-up-runs");
  await press(page, run(c));
  await expect(c.locator(".challenge-complete")).toHaveCount(0);
  const answers: Record<string, string> = {};
  for (const [suffix, end] of [
    ["Zero", 7],
    ["One", 8],
    ["Two", 9],
  ] as const) {
    const trace = traceOf(DIM_UP, { entry: "dim_up", args: [128, 7, end] });
    answers[`result${suffix}`] = String(wValue(trace.result.final, 0));
    answers[`steps${suffix}`] = String(trace.result.steps.length);
  }
  for (const [id, value] of Object.entries(answers))
    await c.locator(`[data-field="${id}"] input`).fill(value);
  await c.locator('[data-field="stepsTwo"] input').fill(String(Number(answers.stepsTwo) + 1));
  await press(page, run(c));
  await expect(c.locator(".verdict-failure")).toHaveCount(1);
  await expect(c.locator(".verdict-failure")).toContainText("instructions");
  await c.locator('[data-field="stepsTwo"] input').fill(answers.stepsTwo!);
  await press(page, run(c));
  await expect(status(c)).toHaveText(passing(6));
});

for (const item of [writes[0]!, writes[2]!]) {
  test(`${item.id}: reload regrades saved work and Clear work restores the starting point`, async ({
    page,
  }) => {
    await openLesson(page, item.route);
    const c = challenge(page, item.id);
    await c.getByRole("textbox", { name: V.editor.textLabel }).fill(item.reference);
    await press(page, run(c));
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.reload();
    await expect(c.locator(".challenge-complete")).toBeVisible();
    await page.evaluate(
      ({ key, id }) => {
        const saved = JSON.parse(localStorage.getItem(key)!);
        saved.challenges[id].artifact.text = "ret";
        localStorage.setItem(key, JSON.stringify(saved));
      },
      { key: storageKey(item.route), id: item.id },
    );
    await page.reload();
    await expect(c.locator(".challenge-complete")).toHaveCount(0);
    await press(page, c.getByRole("button", { name: new RegExp(`^${S.challenge.reset}`) }));
    await press(page, c.getByRole("button", { name: S.challenge.resetConfirm }));
    await expect(c.getByRole("textbox", { name: V.editor.textLabel })).toHaveValue("ret");
  });
}

test("a phone learner builds a complete countdown loop with labels and a backward branch by tapping", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "phone", "the phone editor uses taps");
  const errors = watchErrors(page);
  await openLesson(page, DOWN);
  const c = challenge(page, "write-dim-down");
  await press(page, c.getByRole("button", { name: V.editor.tap, exact: true }));
  await expect(c.getByRole("textbox")).toHaveCount(0);
  const I = V.editor.instruction;
  const O = (n: number) => V.editor.operand(n);
  const lines: [string, string][][] = [
    [
      [I, "cbz"],
      [O(1), "w1"],
      [O(2), "done"],
    ],
    [[I, "again:"]],
    [
      [I, "lsr"],
      [O(1), "w0"],
      [O(2), "w0"],
    ],
    [
      [I, "subs"],
      [O(1), "w1"],
      [O(2), "w1"],
    ],
    [
      [I, "b.ne"],
      [O(1), "again"],
    ],
    [[I, "done:"]],
    [[I, "ret"]],
  ];
  for (const [index, taps] of lines.entries()) {
    await press(
      page,
      index === 0
        ? c.locator(".asm-line-button").first()
        : c.getByRole("button", { name: V.editor.addBelow }),
    );
    for (const [group, name] of taps)
      await press(
        page,
        c
          .getByRole("group", { name: group, exact: true })
          .getByRole("button", { name, exact: true }),
      );
    if (index === 2 || index === 3) {
      await press(
        page,
        c
          .getByRole("group", { name: O(3), exact: true })
          .getByRole("button", { name: V.editor.number }),
      );
      await press(
        page,
        c
          .getByRole("group", { name: V.editor.numberPad, exact: true })
          .getByRole("button", { name: "1", exact: true }),
      );
    }
  }
  await press(page, c.getByRole("button", { name: V.editor.done, exact: true }));
  await expect(c.locator(".asm-error")).toHaveCount(0);
  expect((await stored(page, DOWN)).challenges["write-dim-down"].artifact.text).toBe(DIM_DOWN_TEXT);
  await press(page, run(c));
  await expect(status(c)).toHaveText(passing(6));
  expect(await designProblems(page, true)).toEqual([]);
  expect(await figureOverflow(page)).toEqual([]);
  expect(errors).toEqual([]);
});
