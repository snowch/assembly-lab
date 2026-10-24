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

function setup(index = 0, predict = false) {
  const item = PRIMITIVE_PROGRAMS[index]!;
  const storage = memoryStorage();
  const store = new LessonStore(storage, "assembly-lab", "primitive-test");
  const interactive = Interactive.parse({
    id: "operation",
    kind: "primitive-operation",
    timeModel: "steps",
    caption: "Arithmetic",
    props: {
      stage: {
        title: item.entry,
        prose: "",
        kind: item.kind,
        program: primitiveProgram(item),
        call: { entry: item.entry, args: [...item.args] },
        registers: [...item.registers],
        steps: item.instructions.length,
        predict,
        showCompilerLines: item.kind === "function",
      },
    },
  });
  const props = { lesson: {} as Lesson, interactive, store };
  return { ...render(<PrimitiveOperation {...props} />), props, storage, user: userEvent.setup() };
}

describe("a visible single arithmetic activity", () => {
  it("reveals a computed addition without a hidden next activity", async () => {
    const { container, user } = setup();
    expect(container.querySelector(".al-primitive-result")).toBeNull();
    expect(screen.queryByRole("spinbutton")).toBeNull();
    expect(container.querySelector(".al-primitive-preview")).toHaveTextContent("w0 = 12");
    expect(container.querySelector(".al-primitive-preview")).toHaveTextContent("w1 = 7");
    expect(container.querySelector(".al-primitive-preview")).toHaveTextContent("w2 = ?");
    expect(container.querySelector(".al-primitive-preview")).not.toHaveTextContent("19");
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(screen.getByRole("status")).toHaveTextContent("w2 = 19");
    expect(screen.getByRole("status")).toHaveTextContent("w0, w1 keep their values");
    expect(container.querySelectorAll(".al-primitive-instructions li")).toHaveLength(1);
    expect(container.textContent).not.toContain("ret");
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(screen.getByRole("button", { name: S.restart })).toBeEnabled();
  });

  it("prepares the result before returning, pairs C and assembly, and returns without writing w0", async () => {
    const { container, user } = setup(1);
    expect(container.querySelectorAll(".al-cline")).toHaveLength(4);
    expect(container.querySelectorAll(".al-insn")).toHaveLength(2);
    const register = () => container.querySelector('[data-register="w0"]')!;
    expect(register().querySelector(".al-dreg-value")).toHaveTextContent("7");
    expect(screen.getByText(S.callerWaiting)).toBeInTheDocument();
    expect(screen.queryByText(S.callerReturned(8))).toBeNull();
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(register().querySelector(".al-dreg-value")).toHaveTextContent("8");
    expect(register()).toHaveAttribute("data-changed", "true");
    expect(container.querySelector('.al-insn[data-next="true"]')).toHaveTextContent("ret");
    expect(container.querySelector('.al-cline[data-lit="true"]')).toHaveTextContent(
      "return n + 1;",
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
    expect(screen.getByText(S.callerWaiting)).toBeInTheDocument();
    expect(screen.getByText(S.resultReady)).toBeInTheDocument();
    expect(container.querySelector(".al-primitive-call-path")).toHaveAttribute(
      "data-active",
      "false",
    );
    expect(screen.getByRole("status")).toHaveTextContent(S.functionAfterAdd);
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(register().querySelector(".al-dreg-value")).toHaveTextContent("8");
    expect(register()).toHaveAttribute("data-changed", "false");
    expect(container.querySelector('.al-insn[data-ran="true"]')).toHaveTextContent("ret");
    expect(container.querySelector('.al-insn[data-next="true"]')).toBeNull();
    expect(screen.getByText(S.callerReturned(8))).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(S.functionReturned);
    expect(container.querySelector(".al-primitive-call-path")).toHaveAttribute(
      "data-active",
      "true",
    );
    expect(screen.getByText(S.returnPath)).toBeInTheDocument();
  });

  it("restores a paused function and resets that same visible activity", async () => {
    const { props, storage, unmount, user } = setup(1);
    act(() => props.store.setSlot("operation", { step: 1 }));
    unmount();
    const restored = render(
      <PrimitiveOperation
        {...props}
        store={new LessonStore(storage, "assembly-lab", "primitive-test")}
      />,
    );
    expect(screen.getByText(S.callerWaiting)).toBeInTheDocument();
    expect(
      restored.container.querySelector('[data-register="w0"] .al-dreg-value'),
    ).toHaveTextContent("8");
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(screen.getByText(S.callerReturned(8))).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: S.restart }));
    expect(screen.getByRole("heading")).toHaveTextContent("increment_int");
    expect(screen.getByText(S.callerWaiting)).toBeInTheDocument();
    expect(
      restored.container.querySelector('[data-register="w0"] .al-dreg-value'),
    ).toHaveTextContent("7");
  });

  it("requires a prediction and restores submitted feedback", async () => {
    const { props, storage, unmount, user } = setup(2, true);
    expect(screen.getByRole("button", { name: S.check })).toBeDisabled();
    await user.type(screen.getByRole("spinbutton"), "14");
    await user.click(screen.getByRole("button", { name: S.check }));
    expect(screen.getByRole("status")).toHaveTextContent(S.incorrect);
    expect(screen.getByRole("status")).toHaveTextContent("Your prediction: 14");
    expect(screen.getByRole("status")).toHaveTextContent("w1 = 19");
    unmount();
    render(
      <PrimitiveOperation
        {...props}
        store={new LessonStore(storage, "assembly-lab", "primitive-test")}
      />,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Your prediction: 14");
    expect(screen.getByRole("status")).toHaveTextContent("w1 = 19");
  });

  it.each([
    [3, "w0", "13"],
    [4, "w1", "14"],
  ])("reads the old destination before replacing it (%s)", async (index, destination, result) => {
    const { user } = setup(Number(index), true);
    await user.type(screen.getByRole("spinbutton"), String(result));
    await user.click(screen.getByRole("button", { name: S.check }));
    expect(screen.getByRole("status")).toHaveTextContent(`${S.output} ${destination} = ${result}`);
    expect(screen.getByRole("status")).toHaveTextContent(S.reused(String(destination)));
    expect(screen.getByRole("status")).toHaveTextContent(S.correct);
  });

  it("moves the sequence marker and passes the result to the next instruction", async () => {
    const { container, user } = setup(5);
    const instructions = () => container.querySelectorAll(".al-primitive-instructions li");
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(instructions()[1]).toHaveAttribute("data-next", "true");
    expect(
      within(screen.getByRole("group", { name: S.current })).getByText("11"),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: S.run }));
    expect(screen.getByRole("status")).toHaveTextContent(`${S.input} w2 = 11`);
    expect(screen.getByRole("status")).toHaveTextContent(`${S.output} w2 = 8`);
    await user.click(screen.getByRole("button", { name: S.restart }));
    expect(container.querySelector(".al-primitive-result")).toBeNull();
    expect(instructions()[0]).toHaveAttribute("data-next", "true");
  });
});
