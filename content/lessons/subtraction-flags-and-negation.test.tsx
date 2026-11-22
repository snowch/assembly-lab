// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { URL as NodeURL } from "node:url";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { createBook, grade } from "@al/views";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { checkLesson, learnerText } from "@platform/lesson-schema";
import { LESSONS } from ".";
import { SUBTRACTION_FOCUS_COPY as C } from "./subtraction-flags-and-negation.copy";

const lesson = LESSONS.find((item) => item.id === "subtraction-flags-and-negation")!;
const challenge = lesson.challenges.find((item) => item.id === "negation-flags")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });

describe("focused subtraction flags and negation", () => {
  it("uses the separately drafted canonical copy without restoring retired counter material", () => {
    const note = readFileSync(
      new NodeURL("../../docs/notes/subtraction-flags-focus/copy.md", import.meta.url),
      "utf8",
    );
    expect(JSON.parse(note.match(/```json\n([\s\S]*?)\n```/)![1]!)).toEqual(C);
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((part) => part.title)).toEqual([
      C.recapTitle,
      C.carryTitle,
      C.negationTitle,
      "Negating 0x80000000",
      C.exerciseTitle,
      C.reflectionTitle,
    ]);
    expect(lesson.sections.flatMap((part) => part.interactives).map((part) => part.id)).toEqual([
      "carry-means-no-borrow",
      "negate-an-ordinary-value",
      "predict-negs",
      "step-negs",
      "negation-flags",
    ]);
    expect(learnerText(lesson).join("\n")).not.toMatch(/elapsed\(|ticks|full turn|round the ring/);
    expect(lesson.challenges.map((item) => item.id)).toEqual(["negation-flags"]);
    expect(challenge.fields).toHaveLength(6);
    expect(challenge.hints).toHaveLength(5);
  });

  it("derives each result and flag from the model, rejects wrong results, borrow and signed-fit rules", () => {
    expect(grade(challenge, challenge.reference)).toMatchObject({ passed: true, total: 6 });
    expect(grade(challenge, {})).toHaveProperty("blocked");
    for (const [field, wrong] of [
      ["zero-result", "1"],
      ["zero-c", "0"],
      ["zero-v", "1"],
      ["near-result", "2147483649"],
      ["near-result", "-2147483649"],
      ["near-c", "1"],
      ["near-v", "1"],
    ]) {
      const verdict = grade(challenge, {
        answers: { ...challenge.reference.answers, [field!]: wrong! },
      });
      expect(verdict.passed, field).toBe(false);
      expect(verdict.failures).toHaveLength(1);
      expect(verdict.failures[0]!.actual).toEqual({});
      expect(verdict.failures[0]!.expected).toEqual({});
    }
    expect(grade(challenge, { answers: { result: "1", c: "0" } }).passed).toBe(false);
  });

  it("keeps archived elapsed answers intact without granting completion of the new exercise", () => {
    const storage = memoryStorage();
    const key = `${book.id}:v1:${lesson.id}`;
    const historical = {
      artifact: { answers: { result: "1", c: "0" } },
      attempts: 2,
      hintsRevealed: 1,
      firstPassedAt: "2026-11-21T12:00:00Z",
    };
    storage.set(
      key,
      JSON.stringify({ version: 1, challenges: { "one-step-past": historical }, slots: {} }),
    );
    const { container } = render(<LessonView book={book} lesson={lesson} storage={storage} />);
    const host = container.querySelector("#challenge-negation-flags")!;
    expect(host).toHaveAttribute("data-complete", "false");
    expect(container.querySelector("#challenge-one-step-past")).toBeNull();
    expect(container.querySelector("#ix-step-negs .al-locked")).not.toBeNull();
    expect(container.textContent).not.toContain(C.hints[4]);
    for (const [field, value] of Object.entries(challenge.reference.answers!)) {
      const fieldset = host.querySelector(`[data-field="${field}"]`)!;
      if (field.endsWith("result"))
        fireEvent.change(fieldset.querySelector("input")!, { target: { value } });
      else fireEvent.click(fieldset.querySelector(`input[value="${value}"]`)!);
    }
    fireEvent.click(host.querySelector(".challenge-run")!);
    expect(host).toHaveAttribute("data-complete", "true");
    expect(JSON.parse(storage.get(key)!).challenges["one-step-past"]).toEqual(historical);
    expect(JSON.parse(storage.get(key)!).challenges["negation-flags"].artifact.answers).toEqual(
      challenge.reference.answers,
    );
  });
});
