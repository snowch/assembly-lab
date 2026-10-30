// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { RegisterStateLabel, registerStateText } from "./RegisterStateLabel";
import { StepperFigure } from "./interactives/StepperFigure";
import { WordStepperFigure } from "./interactives/WordStepperFigure";
import { WideStepper } from "./interactives/WideStepper";
import { MemoryStepper } from "./interactives/MemoryStepper";
import { StackStepper } from "./interactives/StackStepper";
import { ReturningToCaller } from "./interactives/ReturningToCaller";
import { NativeFigure } from "./interactives/NativeFigure";
import { RETURNING_STRINGS as R } from "./strings.returning";
import { RETURNING_PROGRAM } from "../../../content/lessons/returning-to-caller.example";
import { PrimitiveOperation } from "./interactives/PrimitiveOperation";
import { PRIMITIVE_STRINGS as P } from "./strings.primitive";
import { traceOf, viewAt } from "./trace";
import { traceText } from "./traceText";

const program = { c: "", listing: "f:\n add w0, w0, w1\n ret" };
const call = { entry: "f", args: [4, 3] };
const BEFORE = "Before the first instruction";
const AFTER = "After add w0, w0, w1";
const FINAL = "Final values";

function figure(View: typeof StepperFigure, kind: string, props: Record<string, unknown>) {
  const interactive = Interactive.parse({
    id: "state",
    kind,
    timeModel: "steps",
    caption: "c",
    props,
  });
  return render(
    <View
      lesson={{} as Lesson}
      interactive={interactive}
      store={new LessonStore(memoryStorage(), "assembly-lab", "register-state")}
    />,
  );
}

describe("the moment described by a register bank", () => {
  it("follows actual executed branches and clamped preset positions", () => {
    const trace = traceOf(
      { listing: "f:\n b .Lend\n mov w0, 99\n.Lend:\n add w0, w0, w1\n ret" },
      call,
    );
    expect(registerStateText(trace, viewAt(trace, -1))).toBe(BEFORE);
    expect(registerStateText(trace, viewAt(trace, 1))).toBe("After `b .Lend`");
    expect(registerStateText(trace, viewAt(trace, 2))).toBe("After `add w0, w0, w1`");
    expect(registerStateText(trace, viewAt(trace, 999))).toBe(FINAL);
  });

  it("names the last completed instruction when the next one faults", () => {
    const trace = traceOf({ listing: "f:\n add w0, w0, w1\n ldr w2, [x3]\n ret" }, call);
    expect(trace.result.stop.kind).toBe("fault");
    expect(trace.result.steps).toHaveLength(1);
    expect(registerStateText(trace, viewAt(trace, 1))).toBe("After `add w0, w0, w1`");
  });

  it("keeps the initial moment when no instruction completes", () => {
    const trace = traceOf({ listing: "f:\n ldr w0, [x1]\n ret" }, { entry: "f", args: [] });
    expect(trace.result.stop.kind).toBe("fault");
    expect(trace.result.steps).toHaveLength(0);
    expect(registerStateText(trace, viewAt(trace, 100))).toBe(BEFORE);
  });

  it("does not call limits, fall-through faults or intentional prefixes final", () => {
    const bounded = traceOf({ listing: "f:\n add w0, w0, w1\n b f" }, { ...call, maxSteps: 2 });
    expect(bounded.result.stop.kind).toBe("limit");
    expect(registerStateText(bounded, viewAt(bounded, 2))).toBe("After `b f`");
    const noReturn = traceText("add w0, w0, w1", [4, 3]);
    expect(noReturn.result.stop.kind).toBe("fault");
    expect(registerStateText(noReturn, viewAt(noReturn, 1))).toBe("After `add w0, w0, w1`");
    const complete = traceOf(program, call);
    expect(registerStateText(complete, viewAt(complete, 1))).toBe("After `add w0, w0, w1`");
  });

  it("renders instructions as code without a duplicate live announcement", () => {
    const trace = traceOf(program, call);
    const { container, rerender } = render(
      <RegisterStateLabel trace={trace} view={viewAt(trace, 1)} />,
    );
    expect(container.querySelector("code")).toHaveTextContent("add w0, w0, w1");
    expect(container.querySelector(".al-register-state")).toHaveAttribute("data-state", "after");
    expect(container.querySelector('[role="status"], [aria-live]')).toBeNull();
    rerender(<RegisterStateLabel trace={trace} view={viewAt(trace, 2)} />);
    expect(container.querySelector(".al-register-state")).toHaveTextContent(FINAL);
    rerender(<RegisterStateLabel trace={trace} view={viewAt(trace, 0)} />);
    expect(container.querySelector(".al-register-state")).toHaveTextContent(BEFORE);
  });
});

describe("register labels in the stepping controls", () => {
  const families = [
    { name: "stepper bits", View: StepperFigure, kind: "stepper", props: { registers: [0, 1] } },
    {
      name: "stepper decimal",
      View: StepperFigure,
      kind: "stepper",
      props: { registers: [0, 1], decimal: true },
    },
    { name: "word", View: WordStepperFigure, kind: "word-stepper", props: { registers: [0, 1] } },
    { name: "wide", View: WideStepper, kind: "wide-stepper", props: { register: 0 } },
    {
      name: "wide named",
      View: WideStepper,
      kind: "wide-stepper",
      props: { register: 0, mode: "x64-named" },
    },
    {
      name: "wide halves",
      View: WideStepper,
      kind: "wide-stepper",
      props: { register: 0, mode: "w16" },
    },
    {
      name: "memory",
      View: MemoryStepper,
      kind: "memory-stepper",
      props: { registers: ["w0", "w1"] },
    },
    {
      name: "stack",
      View: StackStepper,
      kind: "stack-stepper",
      props: { registers: ["w0", "w1"] },
    },
  ];
  it.each(families)(
    "keeps $name labels in agreement with Next, Back and Reset",
    async ({ View, kind, props }) => {
      const user = userEvent.setup();
      const { container } = figure(View, kind, { program, call, ...props });
      const label = () => container.querySelector(".al-register-state")!;
      expect(container.querySelectorAll(".al-register-state")).toHaveLength(1);
      expect(label()).toHaveTextContent(BEFORE);
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(label()).toHaveTextContent(AFTER);
      await user.click(screen.getByRole("button", { name: "Next" }));
      expect(label()).toHaveTextContent(FINAL);
      await user.click(screen.getByRole("button", { name: "Back" }));
      expect(label()).toHaveTextContent(AFTER);
      await user.click(screen.getByRole("button", { name: "Reset" }));
      expect(label()).toHaveTextContent(BEFORE);
    },
  );

  it("uses a nonzero preset and resets to the actual first state", async () => {
    const user = userEvent.setup();
    const { container } = figure(StackStepper, "stack-stepper", {
      program,
      call,
      registers: ["w0"],
      initialStep: 1,
    });
    expect(container.querySelector(".al-register-state")).toHaveTextContent(AFTER);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(container.querySelector(".al-register-state")).toHaveTextContent(BEFORE);
  });

  it("labels the model comparison while keeping recorded values in their recording context", async () => {
    const user = userEvent.setup();
    const { container } = figure(NativeFigure, "native-tools", {
      stages: [],
      program,
      call,
      recorded: [
        [4, 3, 0, 0],
        [7, 3, 0, 0],
        [7, 3, 0, 0],
      ],
      labels: {
        next: "Next instruction",
        ran: "Ran",
        recorded: "Recorded",
        model: "Model",
        recordedNote: "Recorded output",
        stops: ["Before", "After addition", "Returned"],
        returnToMain: "Returned",
        pc: "PC",
      },
    });
    expect(container.querySelector('[data-native-side="recorded"] .al-register-state')).toBeNull();
    const label = () => container.querySelector('[data-native-side="model"] .al-register-state');
    expect(label()).toHaveTextContent(BEFORE);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(label()).toHaveTextContent(AFTER);
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(label()).toHaveTextContent(FINAL);
  });

  it("keeps the hidden caller setup out of the initial label, names visible steps, and stops at the prefix", async () => {
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
    const oldFonts = Object.getOwnPropertyDescriptor(document, "fonts");
    Object.defineProperty(document, "fonts", {
      configurable: true,
      value: { ready: Promise.resolve() },
    });
    try {
      const user = userEvent.setup();
      const { container } = figure(ReturningToCaller, "returning-to-caller", {
        program: RETURNING_PROGRAM,
        call: { entry: "caller", args: [7, 0] },
        functionProgram: { c: "", listing: "increment_int:\n add w0, w0, 1\n ret" },
        startStep: 1,
        endStep: 5,
        callerLabel: "caller_continues",
        functionLabel: "increment_int",
      });
      const label = () => container.querySelector(".al-returning-registers > p");
      expect(label()).toHaveTextContent(R.beforeCall);
      expect(container.textContent).not.toContain("stp x29");
      await user.click(screen.getByRole("button", { name: R.run }));
      expect(label()).toHaveTextContent("After bl increment_int");
      await user.click(screen.getByRole("button", { name: R.back }));
      expect(label()).toHaveTextContent(R.beforeCall);
      for (let step = 0; step < 4; step++)
        await user.click(screen.getByRole("button", { name: R.run }));
      expect(label()).toHaveTextContent("After add w1, w0, w0");
      expect(label()).not.toHaveTextContent(FINAL);
      await user.click(screen.getByRole("button", { name: R.reset }));
      expect(label()).toHaveTextContent(R.beforeCall);
    } finally {
      vi.unstubAllGlobals();
      if (oldFonts) Object.defineProperty(document, "fonts", oldFonts);
      else Reflect.deleteProperty(document, "fonts");
    }
  });

  it("keeps a bounded primitive after its named instruction and a returning function final", async () => {
    const user = userEvent.setup();
    const stage = { title: "Arithmetic", prose: "", program, call, registers: [0, 1], steps: 2 };
    const { container, unmount } = figure(PrimitiveOperation, "primitive-operation", {
      stage: {
        ...stage,
        program: { c: "", listing: "f:\n add w0, w0, w1\n add w1, w1, w0\n ret" },
      },
    });
    await user.click(screen.getByRole("button", { name: P.run }));
    await user.click(screen.getByRole("button", { name: P.run }));
    expect(container.querySelector(".al-register-state")).toHaveTextContent("After add w1, w1, w0");
    unmount();
    const fn = figure(PrimitiveOperation, "primitive-operation", {
      stage: { ...stage, kind: "function" },
    });
    await user.click(screen.getByRole("button", { name: P.run }));
    expect(fn.container.querySelector(".al-register-state")).toHaveTextContent(AFTER);
    await user.click(screen.getByRole("button", { name: P.run }));
    expect(fn.container.querySelector(".al-register-state")).toHaveTextContent(FINAL);
    await user.click(screen.getByRole("button", { name: P.restart }));
    expect(fn.container.querySelector(".al-register-state")).toHaveTextContent(BEFORE);
  });
});
