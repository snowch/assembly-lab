// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The right option is not always in the same place. The model decides which option is right (a
// prediction's answer is never in the lesson's words), so the position of the right option is
// found by committing each option in turn on the rendered lesson and reading which one the model
// matched. In a lesson with two or more predictions, those positions are not all the same: a learner
// who has noticed that the right answer is always first stops reading the others.

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createBook } from "@al/views";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";

import { LESSONS } from ".";

const book = createBook({ title: "Assembly Lab", lessons: LESSONS });

/** The 1-based position of the right option in each prediction of a lesson, in page order. */
const found = new Map<string, number[]>();
function rightPositions(lessonId: string): number[] {
  const known = found.get(lessonId);
  if (known) return known;
  const positions = findPositions(lessonId);
  found.set(lessonId, positions);
  return positions;
}

function findPositions(lessonId: string): number[] {
  const lesson = LESSONS.find((l) => l.id === lessonId)!;
  const { container } = render(
    <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
  );
  const figures = [...container.querySelectorAll("fieldset.prediction-options")].map((f) => {
    const figure = f.closest(".al-figure") as HTMLElement;
    return { figure, options: f.querySelectorAll<HTMLInputElement>("input[type=radio]").length };
  });
  const right: number[] = figures.map(() => 0);
  const most = Math.max(0, ...figures.map((f) => f.options));
  for (let i = 0; i < most; i++) {
    figures.forEach(({ figure, options }, k) => {
      if (i >= options || right[k] !== 0) return;
      fireEvent.click(figure.querySelectorAll<HTMLInputElement>("input[type=radio]")[i]!);
      const commit = [...figure.querySelectorAll<HTMLButtonElement>("button")].find(
        (b) => !b.disabled && b.classList.contains("button"),
      )!;
      fireEvent.click(commit);
      if (figure.querySelector(".al-outcome .al-match") !== null) right[k] = i + 1;
    });
  }
  return right;
}

describe("the order of the options in a lesson's predictions", () => {
  it.each(LESSONS.map((l) => [l.id] as const))(
    "%s: the model's right option is found for every prediction",
    (id) => {
      const positions = rightPositions(id);
      expect(
        positions.every((p) => p > 0),
        `${id}: ${positions.join(", ")}`,
      ).toBe(true);
    },
  );

  it.each(LESSONS.map((l) => [l.id] as const))(
    "%s: with two or more predictions, the right option is not in the same place in all of them",
    (id) => {
      const positions = rightPositions(id);
      if (positions.length < 2) return;
      expect(
        new Set(positions).size,
        `${id}: right options at ${positions.join(", ")}`,
      ).toBeGreaterThan(1);
    },
  );

  it("is tried on lessons with predictions", { timeout: 60000 }, () => {
    const counts = LESSONS.map((l) => rightPositions(l.id).length);
    expect(counts.filter((n) => n >= 2).length).toBeGreaterThanOrEqual(7);
  });
});
