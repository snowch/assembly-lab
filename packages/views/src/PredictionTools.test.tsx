// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Challenge, type Lesson } from "@platform/lesson-schema";
import { AnswerEditor } from "./AnswerEditor";
import { PREDICTION_TOOLS as S } from "./strings.prediction-tools";

const challenge = Challenge.parse({
  id: "scratch-registers",
  title: "Registers",
  task: "Predict.",
  gradedDirection: "answer",
  fields: [{ id: "value", kind: "number", label: "Register value" }],
  initial: { data: { numberFormat: "decimal-or-hex", predictionTools: true } },
  tests: { kind: "answers", grader: "test", cases: [{ label: "value", expect: { value: 9 } }] },
  hints: ["a", "b", "c", "d", "e"],
  reference: { answers: { value: "9" } },
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});
function open(view: ReturnType<typeof render>, title: string) {
  const summary = view.getByText(title, { selector: "summary" });
  const details = summary.closest("details")!;
  details.open = true;
  fireEvent(details, new Event("toggle"));
}
function editor(lesson = "tools-test", change = vi.fn()) {
  return (
    <AnswerEditor
      challenge={challenge}
      lesson={{ id: lesson } as Lesson}
      artifact={{ answers: { value: "17" } }}
      onChange={change}
    />
  );
}
it("offers a separate calculator and keeps notes out of answer artifacts", () => {
  const change = vi.fn(),
    submit = vi.fn((e) => e.preventDefault());
  const view = render(<form onSubmit={submit}>{editor("tools-test", change)}</form>);
  expect(view.container.querySelectorAll("details[open]")).toHaveLength(0);
  expect(view.getByLabelText("Register value")).toHaveAttribute("inputmode", "text");
  const link = view.getByRole("link", { name: S.programmerCalculator.label });
  expect(link).toHaveAttribute("href", S.programmerCalculator.href);
  expect(link).toHaveAttribute("target", "_blank");
  expect(link).toHaveAttribute("rel", "noopener noreferrer");
  expect(link).toHaveAccessibleDescription(S.programmerCalculator.newTab);
  expect(view.queryByLabelText("Calculation")).toBeNull();
  expect(view.getByText(S.programmerCalculator.help)).toBeVisible();
  open(view, S.summary);
  const notes = view.getByLabelText(S.label);
  expect(notes).toHaveValue("");
  fireEvent.change(notes, { target: { value: "Track each write separately" } });
  expect(view.getByLabelText("Register value")).toHaveValue("17");
  expect(change).not.toHaveBeenCalled();
  expect(submit).not.toHaveBeenCalled();
});
it("keeps notes across a remount and isolates them by lesson/challenge", () => {
  let view = render(editor());
  open(view, S.summary);
  fireEvent.change(view.getByLabelText(S.label), { target: { value: "My calculation" } });
  view.unmount();
  view = render(editor());
  open(view, S.summary);
  expect(view.getByLabelText(S.label)).toHaveValue("My calculation");
  view.rerender(editor("other-lesson"));
  open(view, S.summary);
  expect(view.getByLabelText(S.label)).toHaveValue("");
  view.unmount();
  view = render(editor());
  open(view, S.summary);
  expect(view.getByLabelText(S.label)).toHaveValue("My calculation");
  fireEvent.click(view.getByRole("button", { name: S.clear }));
  expect(view.getByLabelText(S.label)).toHaveValue("");
  view.unmount();
  view = render(editor());
  open(view, S.summary);
  expect(view.getByLabelText(S.label)).toHaveValue("");
});
it("retains editable text on observed storage write or clear failure", () => {
  const view = render(editor("write-failure"));
  open(view, S.summary);
  const notes = view.getByLabelText(S.label);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw Error("unavailable");
  });
  fireEvent.change(notes, { target: { value: "Keep this calculation" } });
  expect(notes).toHaveValue("Keep this calculation");
  expect(view.getByRole("status")).toHaveTextContent(S.storageFailure);
  vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
    throw Error("unavailable");
  });
  fireEvent.click(view.getByRole("button", { name: S.clear }));
  expect(notes).toHaveValue("Keep this calculation");
});

it("retains unsaved notes when the graded editor remounts", () => {
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw Error("unavailable");
  });
  let view = render(editor("blocked-storage"));
  open(view, S.summary);
  fireEvent.change(view.getByLabelText(S.label), { target: { value: "Unsaved calculation" } });
  view.unmount();
  view = render(editor("blocked-storage"));
  open(view, S.summary);
  expect(view.getByLabelText(S.label)).toHaveValue("Unsaved calculation");
  expect(view.getByRole("status")).toHaveTextContent(S.storageFailure);
  vi.restoreAllMocks();
  fireEvent.change(view.getByLabelText(S.label), { target: { value: "Saved on retry" } });
  expect(view.getByText(S.help)).toBeVisible();
  fireEvent.click(view.getByRole("button", { name: S.clear }));
  view.unmount();
  view = render(editor("blocked-storage"));
  open(view, S.summary);
  expect(view.getByLabelText(S.label)).toHaveValue("");
});

it("explains an observed read failure and still accepts notes", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw Error("blocked");
  });
  const view = render(editor("read-failure"));
  open(view, S.summary);
  expect(view.getByRole("status")).toHaveTextContent(S.storageFailure);
  fireEvent.change(view.getByLabelText(S.label), { target: { value: "New working" } });
  expect(view.getByLabelText(S.label)).toHaveValue("New working");
});
