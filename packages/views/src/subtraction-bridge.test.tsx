// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { URL as NodeURL } from "node:url";
import { fireEvent, render } from "@testing-library/react";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { describe, expect, it } from "vitest";
import { AdderFigure } from "./interactives/AdderFigure";
import { ARITH_STRINGS } from "./strings.arith";
import { SUBTRACTION_BRIDGE_STRINGS } from "./strings.subtraction-bridge";
import { SUBTRACTION_BOUNDARY_STRINGS } from "./strings.subtraction-boundary";

const program = { listing: "calculate:\nsubs w0, w0, w1\nret", c: "" };
function figure(props: Record<string, unknown> = {}) {
  return render(
    <AdderFigure
      lesson={{} as Lesson}
      store={new LessonStore(memoryStorage(), "assembly-lab", "bridge-test")}
      interactive={Interactive.parse({
        id: "bridge",
        kind: "adder",
        timeModel: "steps",
        caption: "Calculation",
        props: {
          program,
          call: { entry: "calculate", args: [8, 3] },
          opensAtEnd: true,
          detail: true,
          ...props,
        },
      })}
    />,
  );
}

describe("the visible subtraction bridge", () => {
  it("keeps the separate drafting record synchronised", () => {
    const note = readFileSync(
      new NodeURL("../../../docs/notes/subtraction-carry-diagram/copy.md", import.meta.url),
      "utf8",
    );
    expect(JSON.parse(note.match(/```json\n([\s\S]*?)\n```/)![1]!).diagram).toEqual(
      SUBTRACTION_BRIDGE_STRINGS,
    );
    const boundaryNote = readFileSync(
      new NodeURL("../../../docs/notes/subtraction-boundary/copy.md", import.meta.url),
      "utf8",
    );
    expect(JSON.parse(boundaryNote.match(/```json\n([\s\S]*?)\n```/)![1]!)).toEqual(
      SUBTRACTION_BOUNDARY_STRINGS,
    );
  });

  it("makes inversion, carry in and the retained boundary visible before the real instruction", () => {
    const { container, getByRole } = figure({ subtractionBridge: true });
    const bridge = container.querySelector(".al-sub-bridge")!;
    const wide = container.querySelector(".al-adder .al-sub-bridge-wide")!;
    const panes = container.querySelectorAll(".al-subtraction-panes > .al-figure");
    expect(panes).toHaveLength(3);
    const boundary = container.querySelector(".al-sub-boundary")!;
    expect(panes[1]).toBe(boundary);
    expect(
      [...boundary.querySelectorAll("[data-boundary-a]")].map((row) => [
        row.getAttribute("data-boundary-a"),
        row.querySelector("[data-boundary-sum]")!.textContent,
        row.querySelector("[data-boundary-carry]")!.textContent,
        row.querySelector("[data-boundary-bits]")!.textContent,
        row.querySelector("[data-boundary-reading]")!.textContent,
      ]),
    ).toEqual([
      ["7", "15", "0", "1111", "15"],
      ["8", "16", "1", "0000", "0"],
      ["9", "17", "1", "0001", "1"],
    ]);
    expect(boundary.querySelector("button,details")).toBeNull();
    expect(boundary.textContent).not.toMatch(/\{\w+\}/);
    const pattern = (row: string) =>
      bridge.querySelector(`[data-bridge-row="${row}"] code`)?.textContent;
    expect(pattern("b")).toBe("0011");
    expect(pattern("inverted")).toBe("1100");
    expect(pattern("all-ones")).toBe("1111");
    expect(pattern("a")).toBe("1000");
    expect(pattern("carry-in")).toBe("0001");
    expect(bridge.querySelector("[data-bridge-carry]")).toHaveTextContent("1");
    expect(bridge.querySelector("[data-bridge-result]")).toHaveTextContent("0101");
    expect(wide.textContent).toContain("4,294,967,295");
    expect(wide.textContent).toContain("4,294,967,296");
    expect(bridge.querySelector(".al-sub-bridge-wide")).toBeNull();
    expect(container.querySelector(".al-adder .al-sub-bridge")).toBeNull();
    expect(bridge.textContent).not.toMatch(/\{\w+\}/);
    expect(bridge.querySelector("button,details")).toBeNull();
    expect(
      bridge.compareDocumentPosition(container.querySelector(".al-adder-instruction")!) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    fireEvent.click(getByRole("button", { name: ARITH_STRINGS.adder.reset, exact: true }));
    expect(container.querySelector(".al-adder")).toHaveAttribute("data-done", "0");
    expect(boundary.querySelector('[data-boundary-a="8"] [data-boundary-carry]')).toHaveTextContent(
      "1",
    );
    expect(bridge.querySelector("[data-bridge-result]")).toHaveTextContent("0101");
    expect(container.querySelector('[data-row="sum"][data-col="0"]')).toHaveAttribute(
      "data-shown",
      "false",
    );
  });

  it("leaves ordinary adders unchanged and respects their existing prediction gate", () => {
    const ordinary = figure();
    expect(ordinary.container.querySelector(".al-sub-bridge")).toBeNull();
    expect(ordinary.container.querySelector(".al-sub-boundary")).toBeNull();
    ordinary.unmount();
    const gated = figure({ subtractionBridge: true, after: "prediction" });
    expect(gated.container.querySelector(".al-locked")).not.toBeNull();
    expect(gated.container.querySelector(".al-sub-bridge")).toBeNull();
    expect(gated.container.querySelector(".al-sub-boundary")).toBeNull();
  });
});
