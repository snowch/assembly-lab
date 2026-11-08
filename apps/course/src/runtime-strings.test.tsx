// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LESSONS } from "@al/content";
import {
  ChallengeRunner,
  LessonStore,
  memoryStorage,
  StringsContext,
} from "@platform/lesson-runtime";

import { createBook } from "./book";
import { RUNTIME_STRINGS } from "./runtime-strings";

const book = createBook();
const lesson = LESSONS.find((lesson) =>
  lesson.challenges.some((challenge) => challenge.id === "build-1000000"),
)!;
const original = lesson.challenges.find((challenge) => challenge.id === "build-1000000")!;

describe("the course's challenge feedback", () => {
  it.each([1, 3])("keeps a %i-case verdict grammatical, visible and accessible", (total) => {
    if (original.tests.kind !== "answers") throw new Error("Expected the register grader");
    const exampleCase = original.tests.cases[0]!;
    const challenge = {
      ...original,
      tests: { ...original.tests, cases: Array.from({ length: total }, () => exampleCase) },
    };
    const store = new LessonStore(memoryStorage(), book.id, lesson.id);
    store.setChallenge(challenge.id, (saved) => ({
      ...saved,
      artifact: { text: "mov w0, 0\nret" },
      attempts: 1,
    }));
    const mount = () =>
      render(
        <StringsContext.Provider value={RUNTIME_STRINGS}>
          <ChallengeRunner book={book} lesson={lesson} challenge={challenge} store={store} />
        </StringsContext.Provider>,
      );
    const first = mount();
    expect(screen.getByRole("status")).toHaveTextContent(`Tests passed: 0 of ${total}.`);
    expect(screen.getByRole("list", { name: `Tests passed: 0 of ${total}.` })).toBeVisible();
    first.unmount();

    store.setChallenge(challenge.id, (saved) => ({ ...saved, artifact: challenge.reference }));
    mount();
    expect(screen.getByRole("status")).toHaveTextContent(`Tests passed: ${total} of ${total}.`);
    expect(screen.queryByRole("list", { name: /Tests passed/ })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: RUNTIME_STRINGS.challenge.run }));
    expect(screen.getByRole("status")).toHaveTextContent(`Tests passed: ${total} of ${total}.`);
  });
});
