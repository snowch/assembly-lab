// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { describe, expect, it } from "vitest";
import {
  counterWrap,
  counterChange,
  counterExplorerView,
  moveCounterExplorer,
  restoreCounterExplorer,
} from "./counter-wrap";
import { CounterWrap } from "./interactives/CounterWrap";
import { COUNTER_WRAP_STRINGS as S } from "./strings.counter-wrap";

const figure = (store: LessonStore) =>
  render(
    <CounterWrap
      lesson={{} as Lesson}
      store={store}
      interactive={Interactive.parse({
        id: "counter-wrap",
        kind: "counter-wrap",
        caption: S.caption,
        timeModel: "steps",
        props: {},
      })}
    />,
  );

describe("the counter-wrap preparation", () => {
  it("computes retained bits, carries and all shorter-than-a-turn intervals", () => {
    for (let start = 0; start < 16; start++)
      for (let ticks = 0; ticks < 16; ticks++) {
        const model = counterWrap(ticks, start);
        expect(model.value.unsigned).toBe((start + ticks) % 16);
        expect(model.elapsed.unsigned).toBe(ticks);
        expect(model.readings.map((r) => r.unsigned)).toEqual(
          Array.from({ length: ticks + 1 }, (_, i) => (start + i) % 16),
        );
        if (model.addition) {
          expect(model.addition.carryOut).toBe(model.addition.a.unsigned === 15 ? 1 : 0);
          expect(model.addition.fullSum).toBe(model.addition.a.unsigned + 1);
        }
      }
    for (const ticks of [-1, 0.5, 16, NaN]) expect(() => counterWrap(ticks)).toThrow();
    for (const start of [-1, 0.5, 16, NaN]) expect(() => counterWrap(0, start)).toThrow();
  });

  it("checks both arithmetic boundaries for every stored value", () => {
    for (let before = 0; before < 16; before++) {
      for (const direction of [-1, 1] as const) {
        const change = counterChange(before, direction);
        const exact = before + direction;
        expect(change.result.unsigned).toBe(Number(BigInt.asUintN(4, BigInt(exact))));
        expect(change.result.pattern).toBe(change.result.unsigned.toString(2).padStart(4, "0"));
        expect(change.marker).toBe(direction === 1 ? Number(before === 15) : Number(before === 0));
        expect(exact).toBe(change.result.unsigned + direction * change.marker * 16);
        expect(change.carryOut).toBe(direction === 1 ? Number(before === 15) : Number(before >= 1));
      }
    }
  });

  it("can circle repeatedly in either direction with a bounded actual history", () => {
    let state = restoreCounterExplorer(undefined);
    for (const direction of [1, -1] as const) {
      for (let step = 0; step < 48; step++) {
        const before = counterExplorerView(state).value.unsigned;
        state = moveCounterExplorer(state, direction);
        expect(counterExplorerView(state).value.unsigned).toBe((before + direction + 16) % 16);
        expect(state.readings.length).toBeLessThanOrEqual(5);
      }
      expect(counterExplorerView(state).value.unsigned).toBe(0);
    }
  });

  it("starts at zero and keeps optional subtraction independent of forward ticks", () => {
    const storage = memoryStorage();
    const store = new LessonStore(storage, "assembly-lab", "wrap-test");
    store.setSlot("write-elapsed", { draft: "keep learner code" });
    store.setSlot("predict-elapsed", { choice: "made" });
    const view = figure(store);
    const forward = view.container.querySelector('[data-counter-pane="forward"]')!;
    const borrow = view.container.querySelector('[data-counter-pane="borrow"]')!;
    expect(forward.querySelector('[data-reading="decimal"]')).toHaveTextContent("0");
    expect(forward.querySelector('[data-reading="carry"]')).toHaveTextContent(S.pendingCarry);
    expect(view.container.querySelector("details")).not.toHaveAttribute("open");
    expect(forward.querySelectorAll("button")).toHaveLength(2);
    const plus = forward.querySelector("button")!;
    const minus = borrow.querySelector("button")!;
    for (let i = 0; i < 16; i++) fireEvent.click(plus);
    expect(forward.querySelector('[data-reading="stored"]')).toHaveTextContent("0000");
    expect(forward.querySelector('[data-reading="carry"]')).toHaveTextContent("1");
    expect(store.slot("counter-wrap:state-v2")).toEqual({ readings: [12, 13, 14, 15, 0] });
    fireEvent.click(minus);
    expect(borrow.querySelector('[data-reading="borrow-decimal"]')).toHaveTextContent("15");
    expect(borrow.querySelector('[data-reading="borrow-carry"]')).toHaveTextContent("0");
    expect(borrow.querySelector('[data-reading="borrow-explanation"]')).toHaveTextContent(
      "Subtracting one from zero goes below the unsigned range. Keeping only 4 result bits gives 1111 (15 unsigned).",
    );
    expect(borrow.querySelector('[data-reading="borrow-marker-label"]')).toHaveTextContent(
      "C after subs",
    );
    expect(borrow.querySelector('[data-reading="borrow-rule"] li:first-child')).toHaveTextContent(
      "C = 0: Borrow needed.",
    );
    expect(borrow.querySelector('[data-reading="borrow-rule"] li:last-child')).toHaveTextContent(
      "C = 1: No borrow needed.",
    );
    expect(borrow.querySelector('[role="status"]')).toHaveTextContent(S.stepStatus(-1, 15, 0));
    fireEvent.click(minus);
    expect(borrow.querySelector('[data-reading="borrow-carry"]')).toHaveTextContent("1");
    expect(borrow.querySelector('[data-reading="borrow-decimal"]')).toHaveTextContent("14");
    expect(forward.querySelector('[data-reading="decimal"]')).toHaveTextContent("0");
    const savedBorrow = store.slot("counter-wrap:borrow-state-v1");
    fireEvent.click(forward.querySelectorAll("button")[1]!);
    expect(store.slot("counter-wrap:borrow-state-v1")).toEqual(savedBorrow);
    expect(forward.querySelector('[data-reading="carry"]')).toHaveTextContent(S.pendingCarry);
    view.unmount();
    const restored = new LessonStore(storage, "assembly-lab", "wrap-test");
    const next = figure(restored);
    expect(next.container.querySelector('[data-reading="borrow-decimal"]')).toHaveTextContent("14");
    expect(next.container.querySelector('[data-reading="borrow-carry"]')).toHaveTextContent("1");
    const borrowReset = next.container
      .querySelector('[data-counter-pane="borrow"]')!
      .querySelectorAll("button")[1]!;
    fireEvent.click(borrowReset);
    expect(next.container.querySelector('[data-reading="borrow-stored"]')).toHaveTextContent(
      "0000",
    );
    expect(next.container.querySelector('[data-reading="borrow-carry"]')).toHaveTextContent(
      S.pendingCarry,
    );
    expect(restored.slot("write-elapsed")).toEqual({ draft: "keep learner code" });
    expect(restored.slot("predict-elapsed")).toEqual({ choice: "made" });
  });

  it("restores an old subtraction without relabelling its borrow as carry", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "old-subtraction");
    store.setSlot("counter-wrap:state-v2", { readings: [0, 15] });
    const view = figure(store);
    expect(view.container.querySelector('[data-reading="decimal"]')).toHaveTextContent("15");
    expect(view.container.querySelector('[data-reading="carry"]')).toHaveTextContent(
      S.pendingCarry,
    );
    expect(store.slot("counter-wrap:state-v2")).toEqual({ readings: [0, 15] });
    fireEvent.click(screen.getByRole("button", { name: S.advanceLabel }));
    expect(view.container.querySelector('[data-reading="decimal"]')).toHaveTextContent("0");
    expect(view.container.querySelector('[data-reading="carry"]')).toHaveTextContent("1");
  });

  it("preserves old displayed progress until the first real step, and rejects corrupt histories", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "legacy-wrap");
    store.setSlot("counter-wrap:ticks", 2);
    const view = figure(store);
    expect(view.container.querySelector('[data-reading="decimal"]')).toHaveTextContent("15");
    expect(store.slot("counter-wrap:state-v2")).toBeUndefined();
    fireEvent.click(screen.getByRole("button", { name: S.advanceLabel }));
    expect(view.container.querySelector('[data-reading="decimal"]')).toHaveTextContent("0");
    expect(store.slot("counter-wrap:ticks")).toBe(2);
    expect(store.slot("counter-wrap:state-v2")).toEqual({ readings: [13, 14, 15, 0] });
    for (const saved of [
      null,
      -1,
      [],
      {},
      { readings: [] },
      { readings: Array(1) },
      { readings: [0, 2] },
      { readings: [16] },
      { readings: [NaN] },
      { readings: [0, 1, 2, 3, 4, 5] },
    ]) {
      expect(restoreCounterExplorer(saved)).toEqual({ readings: [0] });
    }
    expect(restoreCounterExplorer(undefined, 3)).toEqual({ readings: [13, 14, 15, 0] });
    expect(restoreCounterExplorer({ readings: [0, 15, 0, 1] })).toEqual({
      readings: [0, 15, 0, 1],
    });
  });
});
