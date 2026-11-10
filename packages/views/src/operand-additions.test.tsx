// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { PrimitiveOperation } from "./interactives/PrimitiveOperation";
import { PROSE } from "../../../content/lessons/constants-and-widths.prose";
import {
  SHIFTED_IMMEDIATE_ADD,
  SHIFTED_REGISTER_ADD,
} from "../../../content/lessons/operand-additions";

describe("one addition with an input modifier", () => {
  it.each([
    {
      program: SHIFTED_REGISTER_ADD,
      entry: "add_scaled_register",
      args: [12, 7, 0],
      registers: [0, 1, 2],
      destination: "w2",
      source: "w0",
      sourceValue: "12",
      input: "w1 = 7",
      formed: "14",
      modifier: "lsl #1",
      result: "w2 = 26",
      kept: "w0, w1 keep their values",
    },
    {
      program: SHIFTED_IMMEDIATE_ADD,
      entry: "add_scaled_constant",
      args: [{ value: 65536, width: 64 }, 0, 0],
      registers: [0, 2],
      destination: "x2",
      source: "x0",
      sourceValue: "65536",
      input: "Constant 3",
      formed: "12288",
      modifier: "lsl #12",
      result: "x2 = 77824",
      kept: "x0 keeps its value",
    },
    {
      program: SHIFTED_IMMEDIATE_ADD,
      entry: "add_scaled_constant",
      args: [{ value: "9007199254740993", width: 64 }, 0, 0],
      registers: [0, 2],
      destination: "x2",
      source: "x0",
      sourceValue: "9007199254740993",
      input: "Constant 3",
      formed: "12288",
      modifier: "lsl #12",
      result: "x2 = 9007199254753281",
      kept: "x0 keeps its value",
    },
  ])("keeps the stored input distinct from the formed operand in $entry", async (item) => {
    const storage = memoryStorage();
    const store = new LessonStore(storage, "assembly-lab", item.entry);
    const interactive = Interactive.parse({
      id: "one-add",
      kind: "primitive-operation",
      timeModel: "steps",
      caption: "Input formation",
      props: {
        stage: {
          title: item.entry === "add_scaled_constant" ? "" : item.entry,
          prose: "",
          ...(item.entry === "add_scaled_constant"
            ? {
                instructionNote: PROSE.immediateAdd.instructionNote,
                actionProse: PROSE.immediateAdd.actionProse,
              }
            : {}),
          program: item.program,
          call: { entry: item.entry, args: item.args },
          registers: item.registers,
        },
        notes: item.entry === "add_scaled_constant" ? [PROSE.immediateAddNote] : [],
      },
    });
    const props = { lesson: {} as Lesson, interactive, store };
    const view = render(<PrimitiveOperation {...props} />);
    const user = userEvent.setup();
    expect(view.container.querySelector(".al-instruction-choice")).toBeNull();
    const note = view.container.querySelector("details");
    if (item.entry === "add_scaled_constant") {
      expect(note).not.toBeNull();
      expect(note).not.toHaveAttribute("open");
    } else {
      expect(note).toBeNull();
    }
    const preview = view.container.querySelector(".al-primitive-preview")!;
    expect(preview).toHaveTextContent(item.input);
    expect(
      Array.from(
        preview.querySelectorAll(".al-primitive-transform code"),
        (code) => code.textContent,
      ),
    ).toEqual([item.modifier, item.formed]);
    expect(preview).toHaveTextContent(`${item.destination} = ?`);
    expect(
      view.container.querySelector(`[data-register="${item.source}"] .al-dreg-value`),
    ).toHaveTextContent(item.sourceValue);
    expect(view.container).not.toHaveTextContent(item.result);
    await user.click(screen.getByRole("button", { name: "Run the instruction" }));
    expect(screen.getByRole("status")).toHaveTextContent(item.result);
    expect(screen.getByRole("status")).toHaveTextContent(item.kept);
    view.unmount();
    const restored = render(<PrimitiveOperation {...props} />);
    expect(screen.getByRole("status")).toHaveTextContent(item.result);

    await user.click(screen.getByRole("button", { name: "Start again" }));
    expect(restored.container.querySelector(".al-primitive-preview")).toHaveTextContent(
      `${item.destination} = ?`,
    );
    if (item.entry === "add_scaled_constant") {
      const restoredNote = restored.container.querySelector("details")!;
      expect(restoredNote).not.toHaveAttribute("open");
      await user.click(screen.getByText(PROSE.immediateAddNote.summary, { exact: true }));
      expect(restoredNote).toHaveAttribute("open");
      expect(screen.getByRole("link", { name: "Arm’s ADD (immediate) reference" })).toHaveAttribute(
        "href",
        "https://developer.arm.com/documentation/ddi0602/2025-12/Base-Instructions/ADD--immediate---Add-immediate-value-",
      );
      await user.click(screen.getByText(PROSE.immediateAddNote.summary, { exact: true }));
      expect(restoredNote).not.toHaveAttribute("open");
    }
    expect(screen.queryByRole("status")).toBeNull();
    restored.unmount();
  });
});
