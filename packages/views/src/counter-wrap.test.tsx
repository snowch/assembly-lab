// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { describe, expect, it } from "vitest";
import { counterWrap } from "./counter-wrap";
import { CounterWrap } from "./interactives/CounterWrap";
import { COUNTER_WRAP_STRINGS as S } from "./strings.counter-wrap";

const figure = (store: LessonStore, after?: string) =>
  render(
    <CounterWrap
      lesson={{} as Lesson}
      store={store}
      interactive={Interactive.parse({
        id: "wrap",
        kind: "counter-wrap",
        caption: S.title,
        timeModel: "steps",
        props: after ? { after } : {},
      })}
    />,
  );

describe("four-place tick counter", () => {
  it("retains the low bits at every boundary and recovers all intervals shorter than a turn", () => {
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
  });
  it("rejects invalid widths, readings and intervals instead of implying complete turns can be recovered", () => {
    for (const ticks of [-1, 0.5, 16, NaN]) expect(() => counterWrap(ticks)).toThrow();
    for (const start of [-1, 0.5, 16, NaN]) expect(() => counterWrap(0, start)).toThrow();
  });
  it("respects the prediction, preserves independent work, and restores only its own tick state", () => {
    const storage = memoryStorage();
    const store = new LessonStore(storage, "assembly-lab", "wrap-test");
    store.setSlot("other-work", { draft: "keep" });
    const first = figure(store, "prediction");
    expect(screen.queryByRole("button")).toBeNull();
    first.unmount();
    store.setSlot("prediction", { choice: "made" });
    const view = figure(store, "prediction");
    expect(view.container.querySelector('[data-reading="pattern"]')?.textContent).toBe("1110");
    expect(view.container.querySelector('[data-reading="carry"]')).toBeNull();
    const advance = screen.getByRole("button", { name: S.advance });
    fireEvent.click(advance);
    fireEvent.click(advance);
    expect(view.container.querySelector('[data-reading="pattern"]')?.textContent).toBe("0000");
    expect(view.container.querySelector('[data-reading="carry"]')?.textContent).toBe("1");
    expect(view.container.textContent).toContain(S.wrapExplanation(16, "10000", "0000", 0));
    fireEvent.click(advance);
    expect(view.container.querySelector('[data-reading="pattern"]')?.textContent).toBe("0001");
    expect(view.container.textContent).toContain(S.elapsedExplanation(14, 1, 4, 3));
    expect(advance.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(advance);
    expect(store.slot("wrap:ticks")).toBe(3);
    view.unmount();
    const restored = new LessonStore(storage, "assembly-lab", "wrap-test");
    figure(restored, "prediction");
    expect(screen.getByRole("status").textContent).toContain("Ticks passed: 3");
    fireEvent.click(screen.getByRole("button", { name: S.reset }));
    expect(restored.slot("wrap:ticks")).toBe(0);
    expect(restored.slot("other-work")).toEqual({ draft: "keep" });
    expect(restored.slot("prediction")).toEqual({ choice: "made" });
  });
});
