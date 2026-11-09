// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { PrimitiveOperation } from "./interactives/PrimitiveOperation";
import { PRIMITIVE_STRINGS as S } from "./strings.primitive";
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
      input: "w1 = 7",
      formed: "14",
      modifier: "lsl #1",
      result: "w2 = 26",
      kept: "w0, w1 keep their values",
    },
    {
      program: SHIFTED_IMMEDIATE_ADD,
      entry: "add_scaled_constant",
      args: [7, 0, 0],
      registers: [0, 2],
      input: "Constant 1",
      formed: "4096",
      modifier: "lsl #12",
      result: "w2 = 4103",
      kept: "w0 keeps its value",
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
          title: item.entry,
          prose: "",
          ...(item.entry === "add_scaled_constant"
            ? { instructionChoice: PROSE.immediateAdd.instructionChoice }
            : {}),
          program: item.program,
          call: { entry: item.entry, args: item.args },
          registers: item.registers,
        },
      },
    });
    const props = { lesson: {} as Lesson, interactive, store };
    const view = render(<PrimitiveOperation {...props} />);
    const user = userEvent.setup();
    const checkChoice = () => {
      const diagram = screen.queryByRole("img", { name: S.instructionChoice.description });
      if (item.entry === "add_scaled_constant") {
        expect(diagram).toBeVisible();
        expect(diagram).toHaveTextContent(S.instructionChoice.chooser);
        expect(diagram).toHaveTextContent(S.instructionChoice.processor);
        expect(diagram!.querySelector("button")).toBeNull();
        expect(
          diagram!.compareDocumentPosition(
            view.container.querySelector(".al-primitive-preview, .al-primitive-result")!,
          ) & Node.DOCUMENT_POSITION_FOLLOWING,
        ).toBeTruthy();
      } else {
        expect(diagram).toBeNull();
      }
    };
    checkChoice();
    const preview = view.container.querySelector(".al-primitive-preview")!;
    expect(preview).toHaveTextContent(item.input);
    expect(
      Array.from(
        preview.querySelectorAll(".al-primitive-transform code"),
        (code) => code.textContent,
      ),
    ).toEqual([item.modifier, item.formed]);
    expect(preview).toHaveTextContent("w2 = ?");
    expect(view.container).not.toHaveTextContent(item.result);
    await user.click(screen.getByRole("button", { name: "Run the instruction" }));
    expect(screen.getByRole("status")).toHaveTextContent(item.result);
    expect(screen.getByRole("status")).toHaveTextContent(item.kept);
    checkChoice();
    view.unmount();
    const restored = render(<PrimitiveOperation {...props} />);
    expect(screen.getByRole("status")).toHaveTextContent(item.result);
    expect(restored.queryAllByRole("img", { name: S.instructionChoice.description })).toHaveLength(
      item.entry === "add_scaled_constant" ? 1 : 0,
    );
    await user.click(screen.getByRole("button", { name: "Start again" }));
    expect(restored.container.querySelector(".al-primitive-preview")).toHaveTextContent("w2 = ?");
    expect(restored.queryAllByRole("img", { name: S.instructionChoice.description })).toHaveLength(
      item.entry === "add_scaled_constant" ? 1 : 0,
    );
    expect(screen.queryByRole("status")).toBeNull();
    restored.unmount();
  });
});
