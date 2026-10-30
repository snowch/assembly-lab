// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { StrictMode } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import {
  PRIMITIVE_PROGRAMS,
  primitiveProgram,
} from "../../../content/lessons/meet-the-machine.primitives";
import { VIEW_STRINGS as S } from "./strings";
import { MODULE0_STRINGS as M0 } from "./strings.module0";

const key = "assembly-lab:update:views:v1";
afterEach(() => {
  cleanup();
  sessionStorage.clear();
  vi.restoreAllMocks();
  vi.resetModules();
});

it("keeps an unsubmitted operation prediction through an explicit Strict Mode restart, once", async () => {
  const { PrimitiveOperation } = await import("./interactives/PrimitiveOperation");
  const handoff = await import("./update-handoff");
  const item = PRIMITIVE_PROGRAMS[0]!;
  const interactive = Interactive.parse({
    id: "sum",
    kind: "primitive-operation",
    timeModel: "steps",
    caption: "One operation",
    props: {
      stage: {
        title: item.entry,
        prose: "",
        kind: item.kind,
        program: primitiveProgram(item),
        call: { entry: item.entry, args: [...item.args] },
        registers: [...item.registers],
        steps: item.instructions.length,
        predict: true,
      },
    },
  });
  const props = {
    lesson: {} as Lesson,
    interactive,
    store: new LessonStore(memoryStorage(), "assembly-lab", "one-addition"),
  };
  const original = render(
    <StrictMode>
      <PrimitiveOperation {...props} />
    </StrictMode>,
  );
  await userEvent.setup().type(screen.getByRole("spinbutton"), "123");
  expect(handoff.prepareViewHandoff()).toBe(true);
  original.unmount();
  vi.resetModules();
  const { PrimitiveOperation: Restored } = await import("./interactives/PrimitiveOperation");
  const mounted = render(
    <StrictMode>
      <Restored {...props} />
    </StrictMode>,
  );
  expect(screen.getByRole("spinbutton")).toHaveValue(123);
  expect(sessionStorage.getItem(key)).toBeNull();
  mounted.unmount();
  render(<Restored {...props} />);
  expect(screen.getByRole("spinbutton")).toHaveValue(null);
});

it("restores the simulator step and bit disclosure, using the model to recompute the state", async () => {
  const { StepperFigure } = await import("./interactives/StepperFigure");
  const handoff = await import("./update-handoff");
  const interactive = Interactive.parse({
    id: "trace",
    kind: "stepper",
    timeModel: "steps",
    caption: "Trace",
    props: {
      program: { c: "", listing: "f:\n add w0, w0, w1\n ret" },
      call: { entry: "f", args: [12, 7] },
      registers: [0, 1],
      flags: false,
      decimal: true,
    },
  });
  const props = {
    lesson: {} as Lesson,
    interactive,
    store: new LessonStore(memoryStorage(), "assembly-lab", "sequence"),
  };
  const original = render(
    <StrictMode>
      <StepperFigure {...props} />
    </StrictMode>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: S.stepper.next }));
  const reveal = screen.getByRole("button", { name: M0.registers.showBits });
  await user.click(reveal);
  expect(handoff.prepareViewHandoff()).toBe(true);
  original.unmount();
  vi.resetModules();
  const { StepperFigure: Restored } = await import("./interactives/StepperFigure");
  const mounted = render(
    <StrictMode>
      <Restored {...props} />
    </StrictMode>,
  );
  expect(mounted.container.querySelector("[data-k]")).toHaveAttribute("data-k", "1");
  expect(screen.getByRole("button", { name: M0.registers.hideBits })).toBeVisible();
  expect(screen.getByRole("status")).toHaveTextContent("add w0, w0, w1");
  expect(mounted.container.querySelector(".al-register-state")).toHaveTextContent(
    "After add w0, w0, w1",
  );
  await user.click(screen.getByRole("button", { name: S.stepper.reset }));
  expect(mounted.container.querySelector(".al-register-state")).toHaveTextContent(
    "Before the first instruction",
  );
});

it("fails safely when a per-tab snapshot cannot be saved and cancellation discards a pending handoff", async () => {
  const handoff = await import("./update-handoff");
  const original = Storage.prototype.setItem;
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("full");
  });
  expect(handoff.prepareViewHandoff()).toBe(false);
  Storage.prototype.setItem = original;
  expect(handoff.prepareViewHandoff()).toBe(true);
  expect(sessionStorage.getItem(key)).not.toBeNull();
  handoff.clearViewHandoff();
  expect(sessionStorage.getItem(key)).toBeNull();
});

it("preserves exact integers and collections without accepting a snapshot from another route", async () => {
  const handoff = await import("./update-handoff");
  function Sample() {
    const [value] = handoff.useHandoffState("number", {
      n: 42n,
      map: new Map([["x", 8n]]),
      bytes: new Uint8Array([9]),
      set: new Set([3]),
    });
    return (
      <output>{`${value.n}/${value.map.get("x")}/${value.bytes[0]}/${value.set.has(3)}`}</output>
    );
  }
  const first = render(
    <handoff.ViewHandoffScope id="test">
      <Sample />
    </handoff.ViewHandoffScope>,
  );
  expect(handoff.prepareViewHandoff()).toBe(true);
  const text = sessionStorage.getItem(key)!;
  expect(text).toContain("bigint");
  first.unmount();
  vi.resetModules();
  const next = await import("./update-handoff");
  function Restored() {
    const [value] = next.useHandoffState("number", {
      n: 0n,
      map: new Map<string, bigint>(),
      bytes: new Uint8Array(),
      set: new Set<number>(),
    });
    return (
      <output>{`${value.n}/${value.map.get("x")}/${value.bytes[0]}/${value.set.has(3)}`}</output>
    );
  }
  const second = render(
    <next.ViewHandoffScope id="test">
      <Restored />
    </next.ViewHandoffScope>,
  );
  expect(screen.getByRole("status")).toHaveTextContent("42/8/9/true");
  second.unmount();
  sessionStorage.setItem(key, text.replace(location.href, "https://another.invalid/"));
  vi.resetModules();
  const third = await import("./update-handoff");
  function Different() {
    const [value] = third.useHandoffState("number", 7);
    return <output>{value}</output>;
  }
  render(
    <third.ViewHandoffScope id="test">
      <Different />
    </third.ViewHandoffScope>,
  );
  expect(screen.getByRole("status")).toHaveTextContent("7");
});

it("preserves a radio draft without committing it or revealing the model result", async () => {
  const { TracePrediction } = await import("./interactives/TracePrediction");
  const handoff = await import("./update-handoff");
  const interactive = Interactive.parse({
    id: "prediction",
    kind: "trace-prediction",
    timeModel: "none",
    caption: "Predict",
    props: {
      question: "Which destination?",
      options: [
        { value: "w0", label: "First register" },
        { value: "w1", label: "Second register" },
      ],
      program: { c: "", listing: "f:\n add w0, w0, w1\n ret" },
      call: { entry: "f", args: [12, 7] },
      measure: { kind: "first-write" },
    },
  });
  const store = new LessonStore(memoryStorage(), "assembly-lab", "radio");
  const props = { lesson: {} as Lesson, interactive, store };
  const original = render(
    <StrictMode>
      <TracePrediction {...props} />
    </StrictMode>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("radio", { name: "Second register" }));
  expect(store.get().slots["prediction"]).toBeUndefined();
  expect(original.container.querySelector(".al-outcome")).toBeNull();
  expect(handoff.prepareViewHandoff()).toBe(true);
  original.unmount();
  vi.resetModules();
  const { TracePrediction: Restored } = await import("./interactives/TracePrediction");
  const next = render(
    <StrictMode>
      <Restored {...props} />
    </StrictMode>,
  );
  expect(screen.getByRole("radio", { name: "Second register" })).toBeChecked();
  expect(store.get().slots["prediction"]).toBeUndefined();
  expect(next.container.querySelector(".al-outcome")).toBeNull();
  await user.click(screen.getByRole("button", { name: S.prediction.commit }));
  expect(store.get().slots["prediction"]).toEqual({ choice: "w1" });
  expect(next.container.querySelector(".al-outcome")).not.toBeNull();
});
