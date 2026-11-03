// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";
import { ReadingSequence } from "./ReadingSequence";
import { READING_SEQUENCE as S } from "../strings.reading-sequence";
import { READING_EXAMPLES as E } from "../reading-sequence";

afterEach(cleanup);
function setup(store = new LessonStore(memoryStorage(), "assembly-lab", "same-bits-two-readings")) {
  const view = render(
    <>
      {["unsigned", "signed", "practice", "bridge", "transfer", "explore"].map((stage) => (
        <ReadingSequence
          key={stage}
          store={store}
          lesson={{} as Lesson}
          interactive={Interactive.parse({
            id: `reading-${stage}`,
            kind: "reading-sequence",
            timeModel: "none",
            caption: stage,
            props: { stage },
          })}
        />
      ))}
    </>,
  );
  const task = (stage: string) =>
    within(view.container.querySelector(`[data-reading-task="${stage}"]`)! as HTMLElement);
  return { view, task, store };
}
function fill(task: ReturnType<typeof within>, unsigned: string, signed: string) {
  fireEvent.change(task.getByLabelText(S.unsignedLabel), { target: { value: unsigned } });
  fireEvent.change(task.getByLabelText(S.signedLabel), { target: { value: signed } });
  for (const box of task
    .getAllByRole("textbox")
    .filter((x: HTMLElement) => x.tagName === "TEXTAREA"))
    fireEvent.change(box, {
      target: { value: "A written explanation to compare after submission." },
    });
}
it("teaches both readings without controls while keeping practice totals out of its initial DOM", () => {
  const { view, task } = setup();
  expect(view.container.querySelector('[data-stage="unsigned"]')).toHaveTextContent(
    "8 + 0 + 2 + 1 = 11",
  );
  expect(view.container.querySelector('[data-stage="signed"]')).toHaveTextContent(
    "−8 + 0 + 2 + 1 = −5",
  );
  for (const stage of ["practice", "transfer"]) {
    expect(task(stage).queryByText(S.numericCorrect)).toBeNull();
    expect(view.container.querySelector(`[data-reading-task="${stage}"] [data-sum]`)).toBeNull();
  }
  expect(view.queryByRole("button", { name: "Bit position 3" })).toBeNull();
});
it("does not unlock exploration on malformed inputs and recomputes numeric feedback from the model", () => {
  const { task, view } = setup();
  const p = task("practice");
  fill(p, "0x9", "-7");
  fireEvent.click(p.getByRole("button", { name: S.checkLabel }));
  expect(p.getByRole("status")).toHaveTextContent(S.invalid);
  expect(view.queryByRole("button", { name: "Bit position 3" })).toBeNull();
  fill(p, String(E.practice.unsigned), String(E.practice.signed));
  fireEvent.click(p.getByRole("button", { name: S.checkLabel }));
  expect(p.getByRole("status")).toHaveTextContent(S.numericCorrect);
  expect(p.getByRole("status")).toHaveTextContent(S.reasoningReview);
  expect(view.container.querySelector('[data-stage="explore"] [data-bit="3"]')).not.toBeNull();
  fireEvent.change(p.getByLabelText(S.signedLabel), { target: { value: "-1" } });
  expect(p.getByRole("status")).toBeEmptyDOMElement();
  expect(view.container.querySelector('[data-stage="explore"] [data-bit="3"]')).toBeNull();
  fireEvent.click(p.getByRole("button", { name: S.checkLabel }));
  expect(p.getByRole("status")).toHaveTextContent(S.numericIncorrect);
});
it("persists and rechecks each task independently and resets practice without clearing transfer", () => {
  const { task, store, view } = setup();
  const p = task("practice"),
    t = task("transfer");
  fill(p, "9", "-7");
  fireEvent.click(p.getByRole("button", { name: S.checkLabel }));
  fill(t, "2,147,483,650", "−2,147,483,646");
  fireEvent.click(t.getByRole("button", { name: S.checkLabel }));
  expect(t.getByRole("status")).toHaveTextContent(S.numericCorrect);
  fireEvent.click(p.getByRole("button", { name: S.retryLabel }));
  expect(t.getByRole("status")).toHaveTextContent(S.numericCorrect);
  view.unmount();
  const again = setup(new LessonStore(store.storage, store.bookId, store.lessonId));
  expect(again.task("transfer").getByRole("status")).toHaveTextContent(S.numericCorrect);
  expect(again.task("practice").getByRole("status")).toBeEmptyDOMElement();
});
it("ignores malformed persisted answers and does not trust a submitted flag alone", () => {
  const store = new LessonStore(memoryStorage(), "assembly-lab", "same-bits-two-readings");
  store.setSlot("reading-practice", { submitted: true, unsigned: 9 });
  store.setSlot("reading-transfer", {
    submitted: true,
    unsigned: "0",
    signed: "0",
    reason: "",
    cleared: "",
  });
  const { task, view } = setup(store);
  expect(task("practice").getByRole("status")).toBeEmptyDOMElement();
  expect(task("transfer").getByRole("status")).toBeEmptyDOMElement();
  expect(view.container.querySelector('[data-stage="explore"] [data-bit]')).toBeNull();
});
