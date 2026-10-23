// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { StackStepper } from "./interactives/StackStepper";
import { STACK_STRINGS as T } from "./strings.stack";
import { VIEW_STRINGS as S } from "./strings";
import { FADE_SUM, REPORT, WRONG_FADE } from "../../../content/lessons/calls.listings";
import { traceOf, memoryAt, viewAt } from "./trace";
import { STACK_TOP } from "@al/machine";
import { hexAddress, hexByte } from "./memoryFigure";
import { stopSentence } from "./messages";

function figure(props: Record<string, unknown> = {}) {
  const interactive = Interactive.parse({
    id: "stack",
    kind: "stack-stepper",
    timeModel: "steps",
    caption: "stack",
    props: {
      program: FADE_SUM,
      call: { entry: "fade_sum", args: [7] },
      registers: ["w0", "x19", "x29", "x30"],
      ...props,
    },
  });
  return render(
    <StackStepper
      lesson={{} as Lesson}
      interactive={interactive}
      store={new LessonStore(memoryStorage(), "assembly-lab", "stack-test")}
    />,
  );
}

describe("computed stack diagram", () => {
  it("does not run or reveal a frame before the prediction is committed", () => {
    const { container } = figure({ after: "predict" });
    expect(screen.getByRole("note")).toHaveTextContent(S.stepper.locked);
    expect(container.querySelector(".al-stack-frames")).toBeNull();
    expect(screen.queryByRole("slider")).toBeNull();
  });
  it("draws each active recursive allocation with its actual memory bytes", () => {
    const { container } = figure({ initialStep: 22 });
    expect(container.querySelectorAll(".al-stack-frame")).toHaveLength(4);
    expect(screen.getByText(T.depth(128))).toBeVisible();
    const trace = traceOf(FADE_SUM, { entry: "fade_sum", args: [7] });
    expect(container.querySelector('[data-register="sp"] .al-dreg-value')).toHaveTextContent(
      hexAddress(Number(viewAt(trace, 22).state.sp)),
    );
    const oldest = container.querySelector(".al-stack-frame")!;
    const offsets = oldest.querySelectorAll(".al-stack-slot-offset");
    expect([...offsets].map((offset) => offset.textContent)).toEqual([
      "+0 to +7",
      "+8 to +15",
      "+16 to +23",
      "+24 to +31",
    ]);
    expect(offsets[0]).toHaveAttribute(
      "aria-label",
      T.slotRange(hexAddress(STACK_TOP - 32), hexAddress(STACK_TOP - 25)),
    );
    expect(oldest.querySelector(".al-stack-frame-range")).toHaveTextContent(
      T.frameRange(hexAddress(STACK_TOP - 32), hexAddress(STACK_TOP - 1)),
    );
    expect(
      [...oldest.querySelectorAll(".al-stack-bytes [data-access] code")].map((e) => e.textContent),
    ).toEqual(memoryAt(trace, 22, STACK_TOP - 32, 32)!.map(hexByte));
  });
  it("identifies recursive calls and distinguishes saved x19 values from the current register", () => {
    const { container } = figure({ initialStep: 25 });
    const trace = traceOf(FADE_SUM, { entry: "fade_sum", args: [7] });
    expect(viewAt(trace, 25).state.x[19]).toBe(0n);
    expect(
      [...container.querySelectorAll(".al-stack-frame")].map((frame) =>
        frame.getAttribute("data-invocation"),
      ),
    ).toEqual(["1", "2", "3", "4"]);
    for (const ordinal of [1, 2, 3, 4])
      expect(screen.getByText(T.invocation(ordinal))).toBeVisible();
    expect(
      [...container.querySelectorAll('[data-saved-register="x19"] code')].map(
        (value) => value.textContent,
      ),
    ).toEqual(["0x0", "0x7", "0x3", "0x1"]);
    expect(container.querySelectorAll(".al-stack-bytes [data-access]")).toHaveLength(128);
    const details = [...container.querySelectorAll(".al-stack-detail")];
    expect(details).toHaveLength(4);
    for (const disclosure of details) expect(disclosure).not.toHaveAttribute("open");
    for (const saved of container.querySelectorAll(".al-stack-slots [data-saved-register]"))
      expect(saved).toBeVisible();
    expect(container.querySelector(".al-stack-bytes [data-access]")).not.toBeVisible();
    for (const group of container.querySelectorAll('[data-saved-slot="true"]'))
      expect(group.querySelectorAll("[data-access]")).toHaveLength(8);
    expect(container.querySelectorAll('[data-saved-slot="false"] [data-access]')).toHaveLength(32);
  });
  it("connects x30 to the actual instruction after bl and updates when stepping back or restoring it", () => {
    const { container } = figure({
      program: REPORT,
      call: { entry: "trip_report", args: [128, 9] },
      initialStep: 4,
    });
    const trace = traceOf(REPORT, { entry: "trip_report", args: [128, 9] });
    const outside = `0x${trace.result.initial.x[30]!.toString(16)}`;
    expect(container.querySelector(".al-stack-return-target")).toHaveTextContent(
      T.returnOutside(outside),
    );
    fireEvent.click(screen.getByRole("button", { name: S.stepper.next }));
    const target = trace.result.steps[4]!.address + 4;
    expect(container.querySelector(".al-stack-return-target")).toHaveTextContent(
      T.returnTarget(`0x${target.toString(16)}`, "add w0, w0, w19"),
    );
    fireEvent.click(screen.getByRole("button", { name: S.stepper.back }));
    expect(container.querySelector(".al-stack-return-target")).toHaveTextContent(
      T.returnOutside(outside),
    );
    fireEvent.change(screen.getByRole("slider", { name: T.position }), { target: { value: "10" } });
    expect(container.querySelector(".al-stack-return-target")).toHaveTextContent(
      T.returnOutside(outside),
    );
  });
  it("reverses stores when moving backwards and releases frames without claiming bytes were erased", () => {
    const { container } = figure({
      program: REPORT,
      call: { entry: "trip_report", args: [128, 9] },
    });
    expect(screen.getByText(T.empty)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: S.stepper.next }));
    expect(container.querySelectorAll(".al-stack-frame")).toHaveLength(1);
    expect(container.querySelectorAll('.al-stack-bytes [data-access="stored"]')).toHaveLength(16);
    const saved = container.querySelector('.al-stack-slots [data-saved-register="x30"]')!;
    expect(saved).toHaveAttribute("data-access", "stored");
    expect(saved).toHaveTextContent(
      `0x${traceOf(REPORT, { entry: "trip_report", args: [128, 9] }).result.initial.x[30]!.toString(16)}`,
    );
    fireEvent.click(screen.getByRole("button", { name: S.stepper.back }));
    expect(screen.getByText(T.empty)).toBeVisible();
    fireEvent.change(screen.getByRole("slider", { name: T.position }), { target: { value: "11" } });
    expect(screen.getByText(T.empty)).toBeVisible();
    expect(screen.getByRole("status")).toHaveTextContent(S.stepper.ended);
    expect(screen.getByRole("button", { name: S.stepper.next })).toBeDisabled();
    expect(screen.getByText(T.active)).toBeVisible();
  });
  it("shows the bounded stop when a recursive argument makes no progress", () => {
    figure({
      program: WRONG_FADE,
      call: { entry: "fade_sum", args: [7], maxSteps: 32 },
      initialStep: 32,
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      stopSentence({ kind: "limit", steps: 32 })!,
    );
    expect(screen.getByRole("button", { name: S.stepper.next })).toBeDisabled();
  });
});
