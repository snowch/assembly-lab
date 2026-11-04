// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { describe, expect, it } from "vitest";
import { FOUR_BIT_EXAMPLES, fourBitAddition, fourBitSubtraction } from "./four-bit-arithmetic";
import { FourBitArithmetic } from "./interactives/FourBitArithmetic";
import { FOUR_BIT_STRINGS as S } from "./strings.four-bit-arithmetic";
import { shown } from "./readings";

function figure(mode: "addition" | "width" | "subtraction") {
  return render(
    <FourBitArithmetic
      lesson={{} as Lesson}
      store={new LessonStore(memoryStorage(), "assembly-lab", "four-bit-test")}
      interactive={Interactive.parse({
        id: mode,
        kind: "four-bit-arithmetic",
        caption: "Four-place calculation",
        timeModel: mode === "addition" ? "steps" : "static",
        props: { mode },
      })}
    />,
  );
}

function row(container: HTMLElement, name: string): string {
  return [...container.querySelectorAll(`[data-row="${name}"] [data-bit]`)]
    .map((cell) => cell.textContent)
    .join("");
}

describe("four-bit arithmetic figure", () => {
  it("shows inputs first, reveals real addition columns right to left, and resets", () => {
    const { a, b } = FOUR_BIT_EXAMPLES.addition;
    const model = fourBitAddition(a, b);
    const { container } = figure("addition");
    expect(row(container, "a")).toBe(model.a.pattern);
    expect(row(container, "b")).toBe(model.b.pattern);
    expect(row(container, "result")).toBe("????");
    expect(row(container, "carry")).toBe("???0");
    expect(screen.getByRole("status").textContent).toContain(S.start);
    expect(container.querySelector("[data-reading]")).toBeNull();
    const next = screen.getByRole("button", { name: S.nextColumn });
    for (let done = 1; done <= model.columns.length; done++) {
      fireEvent.click(next);
      expect(row(container, "result")).toBe(
        "?".repeat(4 - done) + model.result.pattern.slice(-done),
      );
      expect(row(container, "carry")).toBe(
        [...model.columns]
          .reverse()
          .map((column) => (column.bit <= done ? column.carryIn : "?"))
          .join(""),
      );
      expect(screen.getByRole("status").textContent).toContain(S.column(model.columns[done - 1]!));
    }
    expect(next).toBeDisabled();
    expect(container.querySelector('[data-reading="unsigned"]')?.textContent).toBe(
      shown(model.result.unsigned),
    );
    fireEvent.click(screen.getByRole("button", { name: S.reset }));
    expect(row(container, "result")).toBe("????");
    expect(row(container, "carry")).toBe("???0");
    expect(next).toBeEnabled();
    expect(container.querySelector("[data-reading]")).toBeNull();
  });

  it("keeps the computed extra carry outside the four complete result columns", () => {
    const { a, b } = FOUR_BIT_EXAMPLES.width;
    const model = fourBitAddition(a, b);
    const { container } = figure("width");
    expect(row(container, "result")).toBe(model.result.pattern);
    const outside = container.querySelector('[data-outside="true"]');
    expect(outside?.textContent).toBe(String(model.carryOut));
    expect(outside?.querySelector("span")?.getAttribute("aria-label")).toContain(S.outside);
    expect(container.querySelectorAll('[data-row="result"] [data-bit]')).toHaveLength(4);
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector('[data-reading="unsigned"]')?.textContent).toBe(
      shown(model.result.unsigned),
    );
  });

  it("shows inversion, adding one and the actual SUB reading together", () => {
    const { a, b } = FOUR_BIT_EXAMPLES.subtraction;
    const model = fourBitSubtraction(a, b);
    const { container } = figure("subtraction");
    expect(container.querySelector('[data-stage="original"]')?.textContent).toBe(model.b.pattern);
    expect(container.querySelector('[data-stage="inverted"]')?.textContent).toBe(
      model.negation.inverted.pattern,
    );
    expect(container.querySelector('[data-stage="opposite"]')?.textContent).toBe(
      model.negation.after.pattern,
    );
    expect(screen.getByText(S.plusOne)).toBeVisible();
    expect(row(container, "a")).toBe(model.a.pattern);
    expect(row(container, "b")).toBe(model.negation.after.pattern);
    expect(container.querySelector('[data-row="b"] th')?.textContent).toContain(
      shown(model.negation.after.signed),
    );
    expect(row(container, "result")).toBe(model.result.pattern);
    expect(container.querySelector('[data-reading="signed"]')?.textContent).toContain(
      shown(model.result.signed),
    );
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
