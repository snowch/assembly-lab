// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { PrimitiveOperation } from "./interactives/PrimitiveOperation";
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
          program: item.program,
          call: { entry: item.entry, args: item.args },
          registers: item.registers,
        },
      },
    });
    const props = { lesson: {} as Lesson, interactive, store };
    const view = render(<PrimitiveOperation {...props} />);
    const user = userEvent.setup();
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
    view.unmount();
    const restored = render(<PrimitiveOperation {...props} />);
    expect(screen.getByRole("status")).toHaveTextContent(item.result);
    await user.click(screen.getByRole("button", { name: "Start again" }));
    expect(restored.container.querySelector(".al-primitive-preview")).toHaveTextContent("w2 = ?");
    expect(screen.queryByRole("status")).toBeNull();
    restored.unmount();
  });
});
