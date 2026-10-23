// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { CLEAR_DOOR } from "../../../content/lessons/logic-shifts-masks.listings";
import { BitOpsFigure } from "./interactives/BitOpsFigure";
import { VIEW_STRINGS as S } from "./strings";
import { traceOf, wValue } from "./trace";

function mount(after?: string) {
  const interactive = Interactive.parse({
    id: "focused-bits",
    kind: "bit-ops",
    timeModel: "steps",
    caption: "c",
    props: {
      functions: [{ entry: "clear_door", program: CLEAR_DOOR, returns: "word" }],
      word: 0x80000035,
      entries: [{ from: 2, to: 2, label: "door open" }],
      ...(after ? { after } : {}),
    },
  });
  return render(
    <BitOpsFigure
      lesson={{} as Lesson}
      interactive={interactive}
      store={new LessonStore(memoryStorage(), "assembly-lab", "focused-bits")}
    />,
  );
}

const positions = (container: HTMLElement) =>
  [...container.querySelectorAll('[data-row="detail-result"] .al-cell')].map((cell) =>
    Number(cell.getAttribute("data-bit")),
  );

describe("readable bit-operation columns", () => {
  it("starts with eight readable cells while retaining the full model result and all 32 bits", () => {
    const { container } = mount();
    expect(positions(container)).toEqual([7, 6, 5, 4, 3, 2, 1, 0]);
    const expected = wValue(
      traceOf(CLEAR_DOOR, { entry: "clear_door", args: [0x80000035] }).result.final,
      0,
    );
    expect(container.querySelector('[data-row="detail-result"]')).toHaveAttribute(
      "data-value",
      String(expected),
    );
    expect(container.querySelector('[data-row="detail-result"] [data-bit="2"]')).toHaveAttribute(
      "data-changed",
      "true",
    );
    const full = container.querySelector("details")!;
    expect(full.open).toBe(false);
    expect(full.querySelectorAll('[data-row="result"] .al-bit')).toHaveLength(32);
    fireEvent.click(full.querySelector("summary")!);
    expect(full.open).toBe(true);
    expect(container.querySelector('[data-row="result"] [data-bit="31"]')).toHaveTextContent("1");
    expect(container.querySelector('[data-key="2-2"]')).toHaveTextContent("door open10");
  });

  it("keeps the selected high column visible with buttons and arrow keys, and reads its actual values", () => {
    const { container } = mount();
    const group = container.querySelector('[data-view="selected-byte"]')!;
    for (let n = 0; n <= 8; n++)
      fireEvent.click(screen.getByRole("button", { name: S.bitOps.higherBit }));
    expect(positions(container)).toEqual([15, 14, 13, 12, 11, 10, 9, 8]);
    expect(container.querySelector('[data-row="detail-result"] [data-bit="8"]')).toHaveAttribute(
      "data-picked",
      "true",
    );
    expect(container.querySelector('[data-readout="column"]')).toHaveTextContent(
      S.bitOps.column(8, 0, 1, 0),
    );
    fireEvent.keyDown(group, { key: "ArrowRight" });
    expect(positions(container)).toEqual([7, 6, 5, 4, 3, 2, 1, 0]);
    fireEvent.click(container.querySelector('[data-row="detail-word"] [data-bit="2"]')!);
    expect(container.querySelector('[data-readout="column"]')).toHaveTextContent(
      S.bitOps.column(2, 1, 0, 0),
    );
  });

  it("keeps both the readable cells and full word behind the existing prediction gate", () => {
    const { container } = mount("prediction");
    expect(container.querySelector('[data-figure="bit-ops"]')).toBeNull();
    expect(container.querySelector(".al-cell")).toBeNull();
    expect(screen.getByRole("note")).toHaveTextContent(S.stepper.locked);
  });
});
