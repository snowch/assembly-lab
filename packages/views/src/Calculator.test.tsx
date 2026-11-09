// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Calculator } from "./Calculator";
import { AssemblyEditor } from "./AssemblyEditor";
import { written } from "./testing";
import { VIEW_STRINGS as S } from "./strings";
import { AnswerEditor } from "./AnswerEditor";
import { Challenge, type Lesson } from "@platform/lesson-schema";

afterEach(cleanup);
function open(container: HTMLElement) {
  const details = container.querySelector("details")!;
  details.open = true;
  fireEvent(details, new Event("toggle"));
}
it("keeps scratch arithmetic separate from the containing exercise and clears stale results", () => {
  const submit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
  const view = render(
    <form onSubmit={submit}>
      <Calculator handoffKey="test" />
    </form>,
  );
  expect(view.queryByRole("textbox")).toBeNull();
  open(view.container);
  const box = view.getByLabelText("Calculation");
  expect(box).toHaveValue("");
  fireEvent.change(box, { target: { value: "200 - 7" } });
  fireEvent.keyDown(box, { key: "Enter" });
  expect(submit).not.toHaveBeenCalled();
  expect(view.getByRole("status")).toHaveTextContent("Result: 193");
  fireEvent.change(box, { target: { value: "2 / 0" } });
  expect(view.getByRole("status")).toBeEmptyDOMElement();
  fireEvent.click(view.getByRole("button", { name: "Calculate" }));
  expect(view.getByRole("status")).toHaveTextContent("You cannot divide by zero.");
  expect(box).toHaveAttribute("aria-invalid", "true");
  expect(submit).not.toHaveBeenCalled();
});
it("is opt-in per answer field and cannot change the answer artifact", () => {
  const challenge = Challenge.parse({
    id: "scratch",
    title: "Scratch",
    task: "Give a number.",
    gradedDirection: "answer",
    fields: [{ id: "answer", kind: "number", label: "Your number" }],
    initial: { data: { calculator: ["answer"] } },
    tests: { kind: "answers", grader: "test", cases: [{ label: "number", expect: { answer: 7 } }] },
    hints: ["a", "b", "c", "d", "e"],
    reference: { answers: { answer: "7" } },
  });
  const change = vi.fn();
  const view = render(
    <AnswerEditor
      challenge={challenge}
      lesson={{} as Lesson}
      artifact={{ answers: { answer: "19" } }}
      onChange={change}
    />,
  );
  open(view.container);
  fireEvent.change(view.getByLabelText("Calculation"), { target: { value: "8 + 4" } });
  fireEvent.click(view.getByRole("button", { name: "Calculate" }));
  expect(view.getByLabelText("Your number")).toHaveValue("19");
  expect(change).not.toHaveBeenCalled();
  view.rerender(
    <AnswerEditor
      challenge={{ ...challenge, initial: {} }}
      lesson={{} as Lesson}
      artifact={{}}
      onChange={change}
    />,
  );
  expect(view.queryByText("Calculator", { selector: "summary" })).toBeNull();
});

it("opts an assembly editor into whole division without changing its code or submitting the form", () => {
  const change = vi.fn();
  const submit = vi.fn((e: { preventDefault: () => void }) => e.preventDefault());
  const challenge = {
    ...written,
    initial: { ...written.initial, data: { calculator: { division: "whole" } } },
  };
  const artifact = { text: written.initial.text };
  const view = render(
    <form onSubmit={submit}>
      <AssemblyEditor
        challenge={challenge}
        lesson={{} as Lesson}
        artifact={artifact}
        onChange={change}
      />
    </form>,
  );
  expect(view.container.querySelector("details")).not.toHaveAttribute("open");
  open(view.container);
  const calculation = view.getByLabelText("Calculation");
  expect(calculation).toHaveValue("");
  fireEvent.change(calculation, { target: { value: "131075 / 65536" } });
  fireEvent.keyDown(calculation, { key: "Enter" });
  expect(view.getByRole("status")).toHaveTextContent("Result: 2");
  fireEvent.click(view.getByRole("button", { name: S.editor.text }));
  expect(view.getByLabelText(S.editor.textLabel)).toHaveValue(artifact.text);
  expect(change).not.toHaveBeenCalled();
  expect(submit).not.toHaveBeenCalled();
  expect(view.getByText(/Division discards any fractional part/)).toBeVisible();
});

it("does not add a calculator to an assembly challenge without the opt-in", () => {
  const view = render(
    <AssemblyEditor challenge={written} lesson={{} as Lesson} artifact={{}} onChange={vi.fn()} />,
  );
  expect(view.queryByText("Calculator", { selector: "summary" })).toBeNull();
});
