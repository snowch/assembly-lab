// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { describe, expect, it } from "vitest";
import { FourBitArithmetic } from "./interactives/FourBitArithmetic";
import { RETAINED_BITS_STRINGS as S } from "./strings.retained-bits";

function figure() {
  const storage = memoryStorage();
  const props = {
    lesson: {} as Lesson,
    store: new LessonStore(storage, "assembly-lab", "storage-test"),
    interactive: Interactive.parse({
      id: "storage",
      kind: "four-bit-arithmetic",
      caption: "Keep low bits",
      timeModel: "none",
      props: { mode: "storage" },
    }),
  };
  props.store.setSlot("sibling", { answers: { result: "0011" } });
  return { ...render(<FourBitArithmetic {...props} />), props, storage };
}

function change(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe("storage-width experiment", () => {
  it("reveals place values only after an action and treats predictions separately from execution", () => {
    const { container } = figure();
    expect(container.querySelector("[data-storage-value]")).toHaveTextContent("—");
    expect(
      [...container.querySelectorAll("[data-storage-bit]")]
        .map((node) => node.textContent)
        .join(""),
    ).toBe("???????");
    expect(container.querySelector("[data-storage-full]")).toHaveTextContent("1100100");
    change(S.predictionLabel, "100");
    fireEvent.click(screen.getByRole("button", { name: S.keep }));
    expect(container.querySelector("[data-storage-value]")).toHaveTextContent("4");
    expect(container.querySelector("[data-storage-removed]")).toHaveTextContent("96");
    expect(screen.getByRole("status")).toHaveTextContent("100 = 6 × 16 + 4");
    expect(screen.getByRole("status")).toHaveTextContent("You predicted 100");
    expect(screen.queryByRole("alert")).toBeNull();
    change(S.widthLabel, "8");
    expect(container.querySelector("[data-storage-value]")).toHaveTextContent("—");
    fireEvent.click(screen.getByRole("button", { name: S.keep }));
    expect(container.querySelector("[data-storage-value]")).toHaveTextContent("100");
    expect(container.querySelector("[data-storage-removed]")).toHaveTextContent("0");
    expect(screen.getByRole("status")).toHaveTextContent("Your prediction matches");
  });

  it("rejects an invalid full input, but allows a misconception above the selected kept range", () => {
    const { container } = figure();
    change(S.inputLabel, "256");
    fireEvent.click(screen.getByRole("button", { name: S.keep }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Values outside this tool’s range are rejected",
    );
    expect(container.querySelector("[data-storage-value]")).toHaveTextContent("—");
    change(S.inputLabel, "16");
    change(S.predictionLabel, "16");
    fireEvent.click(screen.getByRole("button", { name: S.keep }));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(container.querySelector("[data-storage-value]")).toHaveTextContent("0");
    expect(screen.getByRole("status")).toHaveTextContent("You predicted 16");
  });

  it("restores its own draft and observation, resets locally, and preserves sibling work", () => {
    const view = figure();
    change(S.inputLabel, "255");
    fireEvent.click(screen.getByRole("button", { name: S.keep }));
    view.unmount();
    const restored = render(
      <FourBitArithmetic
        {...view.props}
        store={new LessonStore(view.storage, "assembly-lab", "storage-test")}
      />,
    );
    expect(screen.getByLabelText(S.inputLabel)).toHaveValue("255");
    expect(restored.container.querySelector("[data-storage-value]")).toHaveTextContent("15");
    fireEvent.click(screen.getByRole("button", { name: S.reset }));
    expect(screen.getByLabelText(S.inputLabel)).toHaveValue("100");
    expect(restored.container.querySelector("[data-storage-value]")).toHaveTextContent("—");
    expect(view.props.store.slot("sibling")).toEqual({ answers: { result: "0011" } });
  });

  it("keeps every UI string in the separate drafting record", () => {
    const draft = readFileSync("docs/notes/limits-and-experiments/storage-copy.md", "utf8");
    const recorded = JSON.parse(draft.split("```json\n")[1]!.split("\n```")[0]!);
    expect(recorded).toEqual(S);
  });
});
