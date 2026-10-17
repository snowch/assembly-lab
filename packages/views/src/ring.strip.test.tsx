// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The counter's ring, and the strip under it: `then`, the wrap from the largest value to 0, `now`,
// the ticks before the wrap and after it, and their total, with the direction of counting. The two
// stretches are the model's distance split at the wrap, so a test holds their sum to the distance the
// recorded function returns. Nothing the figure says claims to count how many times a counter wrapped.

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";

import { CounterRing } from "./interactives/CounterRing";
import { COUNTER_VALUES, ringReading, segmentsOf } from "./ring";
import { ARITH_STRINGS as A } from "./strings.arith";

const ELAPSED = {
  c: "unsigned elapsed(unsigned now, unsigned then) { return now - then; }",
  listing: "elapsed:\n  sub w0, w0, w1 C1\n  ret C1",
};
const SUBS = { listing: "elapsed_subs:\n  subs w0, w0, w1\n  ret" };

const reading = (now: number, then: number) =>
  ringReading(ELAPSED, SUBS, { entry: "elapsed", args: [now, then] }, "elapsed_subs");

function ring(now: number, then: number) {
  const interactive = Interactive.parse({
    id: "r",
    kind: "counter-ring",
    timeModel: "steps",
    caption: "c",
    props: {
      program: ELAPSED,
      call: { entry: "elapsed", args: [now, then] },
      borrowProgram: SUBS,
      borrowEntry: "elapsed_subs",
    },
  });
  return render(
    <CounterRing
      lesson={{} as Lesson}
      interactive={interactive}
      store={new LessonStore(memoryStorage(), "assembly-lab", "test")}
    />,
  );
}

const text = (container: HTMLElement, selector: string) =>
  container.querySelector(selector)?.textContent;

// Rendering a whole lesson and pressing its buttons takes a while on a busy machine.
vi.setConfig({ testTimeout: 30_000 });

describe("the readings of the ring", () => {
  it("split elapsed(1000, 4294966296) into 1000 ticks before the wrap and 1000 after it: 2000 in all", () => {
    const r = reading(1000, 4294966296);
    expect(r.elapsed).toBe(2000);
    expect(r.borrowed).toBe(true);
    expect(r.segments).toEqual({ before: 1000, after: 1000 });
  });

  it("split elapsed(0, 4294967295) into 1 tick before the wrap and none after it: 1 in all", () => {
    const r = reading(0, 4294967295);
    expect(r.elapsed).toBe(1);
    expect(r.borrowed).toBe(true);
    expect(r.segments).toEqual({ before: 1, after: 0 });
  });

  it("have no split for readings that did not borrow: the whole distance is one stretch", () => {
    const r = reading(5000, 1000);
    expect(r.elapsed).toBe(4000);
    expect(r.borrowed).toBe(false);
    expect(r.segments).toBeNull();
  });

  it("have two segments that sum to the model's elapsed result, for every pair that borrowed", () => {
    const values = [0, 1, 250, 1000, 30, 4294966296, 4294967046, 4294967295, 2 ** 31, 2 ** 31 - 1];
    let borrowed = 0;
    for (const then of values)
      for (const now of values) {
        const r = reading(now, then);
        // The model's subtraction, not the figure's, says whether it borrowed.
        expect(r.borrowed, `${now} - ${then}`).toBe(now < then);
        if (r.segments === null) continue;
        borrowed++;
        expect(r.segments.before + r.segments.after, `${now} - ${then}`).toBe(r.elapsed);
        // The ticks after the wrap are counted from 0 up to now.
        expect(r.segments.after, `${now} - ${then}`).toBe(now);
        expect(r.segments.before, `${now} - ${then}`).toBe(COUNTER_VALUES - then);
      }
    expect(borrowed).toBeGreaterThan(20);
  });

  it("split a distance at the wrap the same way for any then", () => {
    expect(segmentsOf(4294966296, 2000)).toEqual({ before: 1000, after: 1000 });
    expect(segmentsOf(4294967000, 592)).toEqual({ before: 296, after: 296 });
  });
});

describe("the strip under the ring", () => {
  it("shows then, the wrap from 4294967295 to 0, now, the ticks before and after the wrap, and the total", () => {
    const { container } = ring(1000, 4294966296);
    const svg = container.querySelector("svg") as SVGElement;
    expect(svg.textContent).toContain(A.ring.then);
    expect(svg.textContent).toContain("4294966296");
    expect(text(container, '[data-mark="wrap"]')).toContain("4294967295 to 0");
    expect(svg.textContent).toContain(A.ring.now);
    expect(text(container, '[data-segment="before"]')).toBe("1000");
    expect(text(container, '[data-segment="after"][x]')).toBe("1000");
    expect(svg.textContent).toContain(`${A.ring.ticks} ${A.ring.beforeWrap}`);
    expect(svg.textContent).toContain(`${A.ring.ticks} ${A.ring.afterWrap}`);
    expect(text(container, '[data-segment="total"]')).toBe(`2000 ${A.ring.ticks} ${A.ring.inAll}`);
  });

  it("says the direction of counting by an arrowhead on the ring, on the strip, and in words", () => {
    const { container } = ring(1000, 4294966296);
    expect(container.querySelector('[data-mark="direction"]')).not.toBeNull();
    expect(container.querySelectorAll(".al-ring-arrow").length).toBeGreaterThanOrEqual(3);
    expect(container.querySelector("svg")?.textContent).toContain(A.ring.direction);
  });

  it("holds the strip's numbers to the list under it: before plus after is the total", () => {
    const { container } = ring(1000, 4294966296);
    const row = (name: string) => Number(text(container, `[data-row="${name}"] dd`));
    expect(row("before") + row("after")).toBe(row("elapsed"));
    expect(row("elapsed")).toBe(2000);
  });

  it("marks no wrap and gives no split for readings the counter did not wrap between", () => {
    const { container } = ring(5000, 1000);
    expect(container.querySelector('[data-mark="wrap"]')).toBeNull();
    expect(container.querySelector('[data-mark="segments"]')).toBeNull();
    expect(container.querySelector('[data-row="before"]')).toBeNull();
    expect(text(container, '[data-segment="total"]')).toBe(`4000 ${A.ring.ticks} ${A.ring.inAll}`);
  });

  it("draws the wrap at the end of the strip when now is 0, and still draws every stretch with a length", () => {
    const { container } = ring(0, 4294967295);
    const wrap = container.querySelector('[data-mark="wrap"] line') as SVGLineElement;
    expect(Number(wrap.getAttribute("x1"))).toBeLessThan(300);
    for (const line of container.querySelectorAll("line.al-ring-strip")) {
      expect(Number(line.getAttribute("x2"))).toBeGreaterThan(Number(line.getAttribute("x1")));
    }
    expect(text(container, '[data-segment="before"]')).toBe("1");
  });

  it("says nowhere that the figure counts or detects how many wraps happened", () => {
    const { container } = ring(1000, 4294966296);
    const words = [container.textContent ?? "", ...flat(A.ring), ...flat(A.adder.final)];
    for (const w of words)
      expect(w).not.toMatch(
        /how many (times|wraps)|number of wraps|wraps? (were|was) counted|counts? (the )?wraps/i,
      );
  });
});

/** Every string of an object of strings, a function of them said for sample arguments. */
function flat(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (typeof value === "function")
    return flat((value as (...a: unknown[]) => unknown)(1, 2, 3, 4, 5));
  if (value && typeof value === "object") return Object.values(value).flatMap(flat);
  return [];
}
