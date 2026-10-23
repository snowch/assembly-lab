// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { PrimitiveOperation } from "./interactives/PrimitiveOperation";
import { PRIMITIVE_STRINGS as S } from "./strings.primitive";
import {
  PRIMITIVE_PROGRAMS,
  primitiveProgram,
} from "../../../content/lessons/meet-the-machine.primitives";
import { PROSE } from "../../../content/lessons/meet-the-machine.prose";

function setup() {
  const storage = memoryStorage();
  const store = new LessonStore(storage, "assembly-lab", "primitive-test");
  const interactive = Interactive.parse({
    id: "first-operations",
    kind: "primitive-operation",
    timeModel: "steps",
    caption: "Arithmetic",
    props: {
      stages: PRIMITIVE_PROGRAMS.map((item, index) => ({
        ...PROSE.primitiveStages[index],
        program: primitiveProgram(item),
        call: { entry: item.entry, args: [...item.args] },
        registers: [...item.registers],
        steps: item.instructions.length,
        predict: index > 0 && index < 4,
      })),
    },
  });
  const props = { lesson: {} as Lesson, interactive, store };
  return { ...render(<PrimitiveOperation {...props} />), props, storage, user: userEvent.setup() };
}

describe("first arithmetic applications", () => {
  it("shows a worked addition first and hides later tasks and results until their turn", async () => {
    const { container, user } = setup();
    expect(screen.getByRole("heading")).toHaveTextContent("Add into a different register");
    expect(container.querySelector(".al-primitive-result")).toBeNull();
    expect(screen.queryByRole("button", { name: S.continue })).toBeNull();
    expect(screen.queryByRole("spinbutton")).toBeNull();
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(screen.getByRole("status")).toHaveTextContent("w2 = 19");
    expect(screen.getByRole("status")).toHaveTextContent("w0, w1 keep their values");
    expect(container.querySelectorAll(".al-primitive-instructions li")).toHaveLength(1);
    expect(container.textContent).not.toContain("ret");
  });

  it("requires an independent prediction, gives model feedback even when wrong, and restores the completed state", async () => {
    const { container, props, storage, unmount, user } = setup();
    await user.click(screen.getByRole("button", { name: S.run }));
    await user.click(screen.getByRole("button", { name: S.continue }));
    expect(screen.getByRole("button", { name: S.check })).toBeDisabled();
    expect(container.querySelector(".al-primitive-result")).toBeNull();
    await user.type(screen.getByRole("spinbutton"), "14");
    await user.click(screen.getByRole("button", { name: S.check }));
    expect(screen.getByRole("status")).toHaveTextContent(S.incorrect);
    expect(screen.getByRole("status")).toHaveTextContent("Your prediction: 14");
    expect(screen.getByRole("status")).toHaveTextContent("w1 = 19");
    unmount();
    const restoredStore = new LessonStore(storage, "assembly-lab", "primitive-test");
    render(<PrimitiveOperation {...props} store={restoredStore} />);
    expect(screen.getByRole("status")).toHaveTextContent("Your prediction: 14");
    expect(screen.getByRole("status")).toHaveTextContent("w1 = 19");
    expect(screen.getByRole("button", { name: S.continue })).toBeEnabled();
  });

  it("reads the old destination value, then subtracts in operand order", async () => {
    const { user } = setup();
    await user.click(screen.getByRole("button", { name: S.run }));
    await user.click(screen.getByRole("button", { name: S.continue }));
    await user.type(screen.getByRole("spinbutton"), "19");
    await user.click(screen.getByRole("button", { name: S.check }));
    await user.click(screen.getByRole("button", { name: S.continue }));
    await user.type(screen.getByRole("spinbutton"), "13");
    await user.click(screen.getByRole("button", { name: S.check }));
    expect(screen.getByRole("status")).toHaveTextContent("Read w0 = 9");
    expect(screen.getByRole("status")).toHaveTextContent("Write w0 = 13");
    expect(screen.getByRole("status")).toHaveTextContent(S.reused("w0"));
    await user.click(screen.getByRole("button", { name: S.continue }));
    await user.type(screen.getByRole("spinbutton"), "14");
    await user.click(screen.getByRole("button", { name: S.check }));
    expect(screen.getByRole("status")).toHaveTextContent("Write w1 = 14");
    expect(screen.getByRole("status")).toHaveTextContent(S.correct);
  });

  it("moves the sequence marker and carries the first result into the second instruction", async () => {
    const { container, props, user } = setup();
    act(() => props.store.setSlot("first-operations", { stage: 4, step: 0 }));
    // Store subscribers update the already mounted activity.
    const instructions = () => container.querySelectorAll(".al-primitive-instructions li");
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(instructions()[1]).toHaveAttribute("data-next", "true");
    expect(
      within(screen.getByRole("group", { name: S.current })).getByText("11"),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(screen.getByRole("status")).toHaveTextContent("Read w2 = 11");
    expect(screen.getByRole("status")).toHaveTextContent("Write w2 = 8");
    expect(screen.getByText(S.complete)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: S.restart }));
    expect(container.querySelector(".al-primitive-result")).toBeNull();
    expect(screen.getByRole("heading")).toHaveTextContent("Add into a different register");
  });
});
