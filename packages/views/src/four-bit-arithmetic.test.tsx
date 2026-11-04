// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { describe, expect, it, vi } from "vitest";
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
  return [...container.querySelectorAll(`[data-row="${name}"][data-bit] .al-four-value`)]
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
    next.focus();
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
      const column = model.columns[done - 1]!;
      expect(container.querySelector('[data-carry-source="true"]')?.textContent).toBe(
        String(column.carryOut),
      );
      expect(container.querySelector('[data-destination="kept"] .al-four-value')?.textContent).toBe(
        String(column.kept),
      );
      expect(
        container.querySelector('[data-destination="carry"] .al-four-value')?.textContent,
      ).toBe(String(column.carryOut));
      expect(container.querySelectorAll("[data-destination]")).toHaveLength(2);
      expect(container.querySelector('[data-active="true"]')?.getAttribute("data-bit")).toBe(
        String(column.bit),
      );
      expect(document.activeElement).toBe(next);
      expect(screen.getByRole("status").textContent).toContain(
        done === model.columns.length
          ? S.complete(model.result.pattern, model.carryOut)
          : S.column(column),
      );
    }
    expect(next).toHaveAttribute("aria-disabled", "true");
    expect(next).not.toBeDisabled();
    fireEvent.click(next);
    expect(row(container, "result")).toBe(model.result.pattern);
    expect(container.querySelector('[data-outside="true"]')?.textContent).toContain(
      String(model.carryOut),
    );
    expect(container.querySelector('[data-reading="unsigned"]')?.textContent).toBe(
      shown(model.result.unsigned),
    );
    fireEvent.click(screen.getByRole("button", { name: S.reset }));
    expect(row(container, "result")).toBe("????");
    expect(row(container, "carry")).toBe("???0");
    expect(next).toHaveAttribute("aria-disabled", "false");
    expect(container.querySelectorAll("[data-destination]")).toHaveLength(0);
    expect(container.querySelector(".al-four-carry-path")?.getAttribute("d")).toBe("");
    expect(container.querySelector("[data-reading]")).toBeNull();
  });

  it("connects exact source and destination edges and redraws after resize", () => {
    let destinationX = 100;
    const rect = (x: number, y: number, width: number, height: number) => ({
      x,
      y,
      top: y,
      left: x,
      width,
      height,
      right: x + width,
      bottom: y + height,
      toJSON() {},
    });
    const bounds = vi
      .spyOn(Element.prototype, "getBoundingClientRect")
      .mockImplementation(function () {
        if (this.classList.contains("al-four-diagram")) return rect(10, 20, 300, 400);
        if (this.matches('[data-carry-source="true"]')) return rect(190, 60, 40, 40);
        if (this.matches('[data-destination="carry"]')) return rect(destinationX, 180, 50, 50);
        if (this.classList.contains("al-four-route-space")) return rect(10, 120, 300, 80);
        return rect(0, 0, 0, 0);
      });
    try {
      const { container } = figure("addition");
      const next = screen.getByRole("button", { name: S.nextColumn });
      fireEvent.click(next);
      const path = container.querySelector(".al-four-carry-path")!;
      expect(path.getAttribute("d")).toBe("M 200 80 V 108 H 115 V 160");
      expect(container.querySelector("marker")?.getAttribute("refX")).toBe("8");
      destinationX = 130;
      fireEvent(window, new Event("resize"));
      expect(path.getAttribute("d")).toBe("M 200 80 V 108 H 145 V 160");
      for (let step = 1; step < 4; step++) fireEvent.click(next);
      expect(container.querySelector('[data-destination="carry"]')).toHaveAttribute(
        "data-outside",
        "true",
      );
      expect(path.getAttribute("d")).toBe("M 200 80 V 108 H 145 V 160");
      fireEvent.click(screen.getByRole("button", { name: S.reset }));
      expect(path.getAttribute("d")).toBe("");
    } finally {
      bounds.mockRestore();
    }
  });

  it("keeps the computed extra carry outside the four complete result columns", () => {
    const { a, b } = FOUR_BIT_EXAMPLES.width;
    const model = fourBitAddition(a, b);
    const { container } = figure("width");
    expect(container.querySelector('[data-reading="pattern"]')?.textContent).toBe(
      model.result.pattern,
    );
    const outside = container.querySelector('[data-outside="true"]');
    expect(outside?.textContent).toBe(String(model.carryOut));
    expect(outside?.getAttribute("aria-label")).toContain(S.outside);
    expect(container.querySelector(".al-four-grid")).toBeNull();
    expect(container.querySelector(".al-four-connector")).toBeNull();
    expect(container.textContent).toContain(S.wrapSummary(model.fullPattern, model.result.pattern));
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
    expect(container.querySelector(".al-four-compact-addition")?.textContent).toBe(
      `${model.a.pattern} + ${model.negation.after.pattern} = ${model.result.pattern}`,
    );
    expect(container.querySelector(".al-four-opposite")?.textContent).toContain(
      shown(model.negation.after.signed),
    );
    expect(container.querySelector('[data-reading="pattern"]')?.textContent).toBe(
      model.result.pattern,
    );
    expect(container.querySelector(".al-four-grid")).toBeNull();
    expect(container.querySelector(".al-four-connector")).toBeNull();
    expect(container.querySelector('[data-reading="signed"]')?.textContent).toContain(
      shown(model.result.signed),
    );
    expect(screen.queryByRole("tab")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
});
