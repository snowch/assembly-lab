// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { describe, expect, it } from "vitest";
import { counterWrap } from "./counter-wrap";
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

  it("keeps the wrap visible, restores its progress and resets only this example", () => {
    const storage = memoryStorage();
    const store = new LessonStore(storage, "assembly-lab", "wrap-test");
    store.setSlot("write-elapsed", { draft: "keep learner code" });
    store.setSlot("predict-elapsed", { choice: "made" });
    const view = figure(store);
    expect(view.container.querySelector('[data-reading="stored"]')?.textContent).toBe("1101");
    expect(view.container.querySelector('[data-reading="carry"]')).toBeNull();
    const advance = screen.getByRole("button", { name: S.advance });
    fireEvent.click(advance);
    expect(view.container.querySelector('[data-reading="stored"]')?.textContent).toBe("1110");
    expect(view.container.querySelector('[data-reading="sum"]')?.textContent).toBe("13 + 1 = 14");
    expect(view.container.querySelector('[data-reading="carry"]')?.textContent).toBe("0");
    fireEvent.click(advance);
    expect(view.container.querySelector('[data-reading="stored"]')?.textContent).toBe("1111");
    expect(view.container.querySelector('[data-reading="sum"]')?.textContent).toBe("14 + 1 = 15");
    expect(view.container.querySelector('[data-reading="carry"]')?.textContent).toBe("0");
    fireEvent.click(advance);
    expect(view.container.querySelector('[data-reading="stored"]')?.textContent).toBe("0000");
    expect(view.container.querySelector('[data-reading="sum"]')?.textContent).toBe("15 + 1 = 16");
    expect(view.container.querySelector('[data-reading="carry"]')?.textContent).toBe("1");
    expect(advance.getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(advance);
    expect(store.slot("counter-wrap:ticks")).toBe(3);
    view.unmount();
    const restored = new LessonStore(storage, "assembly-lab", "wrap-test");
    const next = figure(restored);
    expect(next.container.querySelector('[data-reading="carry"]')?.textContent).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: S.reset }));
    expect(restored.slot("counter-wrap:ticks")).toBe(0);
    expect(restored.slot("write-elapsed")).toEqual({ draft: "keep learner code" });
    expect(restored.slot("predict-elapsed")).toEqual({ choice: "made" });
  });

  it("resumes previous two-tick progress without overwriting it on render", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "legacy-wrap");
    store.setSlot("counter-wrap:ticks", 2);
    const view = figure(store);
    expect(view.container.querySelector('[data-reading="sum"]')?.textContent).toBe("14 + 1 = 15");
    expect(store.slot("counter-wrap:ticks")).toBe(2);
    fireEvent.click(screen.getByRole("button", { name: S.advance }));
    expect(view.container.querySelector('[data-reading="sum"]')?.textContent).toBe("15 + 1 = 16");
    expect(store.slot("counter-wrap:ticks")).toBe(3);
  });
});
