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
        kind: item.kind,
        showCompilerLines: item.kind === "function",
        program: primitiveProgram(item),
        call: { entry: item.entry, args: [...item.args] },
        registers: [...item.registers],
        steps: item.instructions.length,
        predict:
          item.kind === "operation" &&
          item.entry !== "primitive_add" &&
          item.instructions.length === 1,
      })),
    },
  });
  const props = { lesson: {} as Lesson, interactive, store };
  return { ...render(<PrimitiveOperation {...props} />), props, storage, user: userEvent.setup() };
}

async function reachPrediction(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: S.run }));
  await user.click(screen.getByRole("button", { name: S.continue }));
  await user.click(screen.getByRole("button", { name: S.run }));
  await user.click(screen.getByRole("button", { name: S.run }));
  await user.click(screen.getByRole("button", { name: S.continue }));
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

  it("runs a complete tiny function after the first addition and returns without writing w0", async () => {
    const { container, user } = setup();
    await user.click(screen.getByRole("button", { name: S.run }));
    await user.click(screen.getByRole("button", { name: S.continue }));
    expect(screen.getByRole("heading")).toHaveTextContent("Return from a tiny function");
    expect(container.querySelectorAll(".al-cline")).toHaveLength(4);
    expect(container.querySelectorAll(".al-insn")).toHaveLength(2);
    expect(container.querySelector('.al-insn[data-next="true"]')).toHaveTextContent(
      "add w0, w0, 1",
    );
    expect(container.querySelectorAll('.al-cline[data-lit="true"]')).toHaveLength(0);
    const register = () => container.querySelector('[data-register="w0"]')!;
    expect(register().querySelector(".al-dreg-value")).toHaveTextContent("7");
    expect(container.querySelector(".al-primitive-caller")).toHaveTextContent(S.callArgument(7));
    expect(screen.getByText(S.callerWaiting)).toBeInTheDocument();
    expect(screen.queryByText(S.callerReturned(8))).toBeNull();
    expect(container.querySelector(".al-primitive-result")).toBeNull();
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(register().querySelector(".al-dreg-value")).toHaveTextContent("8");
    expect(register()).toHaveAttribute("data-changed", "true");
    expect(container.querySelector('.al-insn[data-ran="true"]')).toHaveTextContent("add w0, w0, 1");
    expect(container.querySelector('.al-insn[data-next="true"]')).toHaveTextContent("ret");
    expect(container.querySelector('.al-cline[data-lit="true"]')).toHaveTextContent(
      "return n + 1;",
    );
    expect(screen.getByText(S.callerWaiting)).toBeInTheDocument();
    // Viewing either pane must not execute ret or resume the caller.
    await user.click(screen.getByRole("button", { name: S.showInstructions }));
    expect(screen.getByRole("button", { name: S.showC })).toBeInTheDocument();
    expect(screen.getByText(S.callerWaiting)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: S.showC }));
    expect(screen.getByRole("button", { name: S.showInstructions })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(S.functionAfterAdd);
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(register().querySelector(".al-dreg-value")).toHaveTextContent("8");
    expect(register()).toHaveAttribute("data-changed", "false");
    expect(container.querySelector('.al-insn[data-ran="true"]')).toHaveTextContent("ret");
    expect(container.querySelector('.al-insn[data-next="true"]')).toBeNull();
    expect(screen.getByText(S.callerReturned(8))).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(S.functionReturned);
    expect(screen.getByRole("button", { name: S.continue })).toBeEnabled();
  });

  it("restores a paused function with its caller waiting and clears it on Start again", async () => {
    const { props, storage, unmount, user } = setup();
    act(() =>
      props.store.setSlot("first-operations", { stage: 1, entry: "increment_int", step: 1 }),
    );
    unmount();
    const restored = render(
      <PrimitiveOperation
        {...props}
        store={new LessonStore(storage, "assembly-lab", "primitive-test")}
      />,
    );
    expect(screen.getByRole("heading")).toHaveTextContent("Return from a tiny function");
    expect(screen.getByText(S.callerWaiting)).toBeInTheDocument();
    expect(
      restored.container.querySelector('[data-register="w0"] .al-dreg-value'),
    ).toHaveTextContent("8");
    expect(screen.queryByText(S.callerReturned(8))).toBeNull();
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(screen.getByText(S.callerReturned(8))).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: S.restart }));
    expect(screen.getByRole("heading")).toHaveTextContent("Add into a different register");
    expect(restored.container.querySelector(".al-primitive-caller")).toBeNull();
    expect(restored.container.querySelector(".al-primitive-result")).toBeNull();
  });

  it("keeps an old saved destination prediction on that operation instead of opening the inserted function", async () => {
    const { container, props, user } = setup();
    act(() => props.store.setSlot("first-operations", { stage: 1, step: 1, prediction: "14" }));
    expect(screen.getByRole("heading")).toHaveTextContent("Choose a different destination");
    expect(container.querySelector(".al-primitive")).toHaveAttribute("data-stage", "2");
    expect(screen.getByRole("status")).toHaveTextContent("Your prediction: 14");
    expect(screen.getByRole("status")).toHaveTextContent("w1 = 19");
    expect(container.querySelector(".al-primitive-caller")).toBeNull();
    await user.click(screen.getByRole("button", { name: S.continue }));
    expect(screen.getByRole("heading")).toHaveTextContent(
      "Read a register, then replace its value",
    );
  });

  it("requires an independent prediction, gives model feedback even when wrong, and restores the completed state", async () => {
    const { container, props, storage, unmount, user } = setup();
    await reachPrediction(user);
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
    await reachPrediction(user);
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
