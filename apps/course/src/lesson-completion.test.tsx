// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { StrictMode } from "react";
import { act, cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, it, vi } from "vitest";
import { LESSONS } from "@al/content";
import { PLAN, lessonsOf } from "@al/content/plan";

import { LessonCompletionButton } from "./LessonCompletionButton";
import {
  completionKey,
  LessonCompletionStore,
  orderLessons,
  useLessonCompletion,
} from "./lesson-completion";
import { FrontPage } from "./pages/FrontPage";
import { lessonHref } from "./route";
import { STRINGS } from "./strings";
import { updateStorage } from "./update-storage";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});

const ordered = orderLessons(LESSONS);
const makeStore = () =>
  new LessonCompletionStore(
    updateStorage(),
    LESSONS.map((lesson) => lesson.id),
  );

function ProgressPlan({ store }: { store: LessonCompletionStore }) {
  const completion = useLessonCompletion(store);
  return <FrontPage completion={completion} />;
}

it("keeps a sensible first visit and continues to the first unfinished lesson, including gaps", () => {
  const store = makeStore();
  const { container, getByRole } = render(<ProgressPlan store={store} />);
  expect(getByRole("link", { name: STRINGS.start })).toHaveAttribute(
    "href",
    lessonHref(ordered[0]!.id),
  );
  expect(container.querySelector(".lesson-complete-mark")).toBeNull();
  // A later mark must not skip the earlier unfinished lesson.
  act(() => store.set(ordered[2]!.id, true));
  expect(
    getByRole("link", { name: `${STRINGS.completion.continue} ${ordered[0]!.title}` }),
  ).toHaveAttribute("href", lessonHref(ordered[0]!.id));
  act(() => store.set(ordered[0]!.id, true));
  expect(container.querySelector(".cover-continue")).toHaveAttribute(
    "href",
    lessonHref(ordered[1]!.id),
  );
});

it("gives plan ticks accessible text in both single-lesson and multiple-lesson modules", () => {
  const modules = PLAN.flatMap((part) => part.modules);
  const single = modules
    .map((module) => lessonsOf(module, LESSONS))
    .find((lessons) => lessons.length === 1)![0]!;
  const multiple = modules
    .map((module) => lessonsOf(module, LESSONS))
    .find((lessons) => lessons.length > 1)![0]!;
  const store = makeStore();
  store.set(single.id, true);
  store.set(multiple.id, true);
  const { container } = render(<ProgressPlan store={store} />);
  for (const lesson of [single, multiple]) {
    const link = container.querySelector(`.plan-module a[href="${lessonHref(lesson.id)}"]`);
    expect(link?.querySelector(".lesson-complete-mark")).toHaveTextContent(
      STRINGS.completion.marked,
    );
    expect(link).toHaveAccessibleName(new RegExp(STRINGS.completion.marked));
  }
});

it("shows a truthful all-marked state while every lesson link remains available", () => {
  const store = makeStore();
  for (const lesson of ordered) store.set(lesson.id, true);
  const { container, getByText } = render(<ProgressPlan store={store} />);
  expect(getByText(STRINGS.completion.all)).toBeVisible();
  expect(container.querySelector(".cover-start")).toBeNull();
  for (const lesson of ordered) {
    expect(
      container.querySelector(`.plan-module a[href="${lessonHref(lesson.id)}"]`),
    ).not.toBeNull();
  }
  act(() => store.set(ordered.at(-1)!.id, false));
  expect(container.querySelector(".cover-continue")).toHaveAttribute(
    "href",
    lessonHref(ordered.at(-1)!.id),
  );
});

it("marks and undoes a reading-only lesson by keyboard without moving focus", async () => {
  // No challenges or exercise state are needed to mount or use this control.
  const store = new LessonCompletionStore(updateStorage(), ["reading-only"]);
  const user = userEvent.setup();
  const { getByRole } = render(
    <StrictMode>
      <LessonCompletionButton store={store} lessonId="reading-only" />
    </StrictMode>,
  );
  const button = getByRole("button", { name: STRINGS.completion.mark });
  button.focus();
  await user.keyboard("{Enter}");
  expect(button).toHaveFocus();
  expect(button).toHaveAccessibleName(STRINGS.completion.undo);
  expect(localStorage.getItem(completionKey("reading-only"))).toBe("true");
  await user.keyboard(" ");
  expect(button).toHaveFocus();
  expect(button).toHaveAccessibleName(STRINGS.completion.mark);
  expect(store.get().completed.size).toBe(0);
});

it("updates the footer and plan from external mark and clear events", () => {
  const store = makeStore();
  const lesson = ordered[0]!;
  const { container, getByRole } = render(
    <>
      <ProgressPlan store={store} />
      <LessonCompletionButton store={store} lessonId={lesson.id} />
    </>,
  );
  act(() => {
    localStorage.setItem(completionKey(lesson.id), "true");
    window.dispatchEvent(
      new StorageEvent("storage", { key: completionKey(lesson.id), newValue: "true" }),
    );
  });
  expect(getByRole("button", { name: STRINGS.completion.undo })).toBeVisible();
  expect(container.querySelector(".lesson-complete-mark")).not.toBeNull();
  act(() => {
    localStorage.clear();
    window.dispatchEvent(new StorageEvent("storage", { key: null }));
  });
  expect(getByRole("button", { name: STRINGS.completion.mark })).toBeVisible();
  expect(container.querySelector(".lesson-complete-mark")).toBeNull();
});

it("replaces the saving claim with a truthful memory-only note even after undoing the only mark", () => {
  const store = makeStore();
  const { getByText, queryByText } = render(<ProgressPlan store={store} />);
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("quota");
  });
  act(() => store.set(ordered[0]!.id, true));
  expect(getByText(STRINGS.completion.unsaved)).toBeVisible();
  expect(queryByText(STRINGS.completion.saved)).toBeNull();
  act(() => store.set(ordered[0]!.id, false));
  expect(getByText(STRINGS.completion.unsaved)).toBeVisible();
});
