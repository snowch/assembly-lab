// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import {
  createBook,
  INTERACTIVES,
  fourBitReadings,
  FOUR_BIT_LIMITS,
  readingsOfValue,
} from "@al/views";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import { checkLesson, learnerText, modelProblems, termProblems } from "@platform/lesson-schema";
import { LESSONS, SOURCE_LESSONS } from ".";
import { SIGNED_WEIGHTS } from "./twos-complement.prose";

const lesson = LESSONS.find((entry) => entry.id === "twos-complement")!;

it("publishes an independently accessible reference with valid computed figures", () => {
  expect([lesson.module, lesson.order]).toEqual([15, 0]);
  expect(checkLesson(lesson)).toEqual([]);
  expect(modelProblems([lesson], ["steps"])).toEqual([]);
  expect(termProblems(LESSONS)).toEqual([]);
  expect(termProblems(SOURCE_LESSONS)).toEqual([]);
  expect(
    lesson.sections.flatMap((section) => section.interactives.map((ix) => ix.props["mode"])),
  ).toEqual(["readings", "negation"]);
  expect(
    lesson.sections
      .flatMap((section) => section.interactives)
      .every((ix) => ix.kind in INTERACTIVES),
  ).toBe(true);
  const view = render(
    <LessonView
      book={createBook({ title: "Assembly Lab", lessons: LESSONS })}
      lesson={lesson}
      storage={memoryStorage()}
    />,
  );
  expect(
    view.container.querySelectorAll(".interactive-problem, .interactive-missing"),
  ).toHaveLength(0);
  expect(view.container.querySelectorAll(".al-complement")).toHaveLength(2);
});

it("keeps the essential explanation visible in Module 1 and links the correct live pages", () => {
  const main = LESSONS.find((entry) => entry.id === "same-bits-two-readings")!;
  const text = learnerText(main).join("\n");
  expect(text).toContain(SIGNED_WEIGHTS);
  expect(text).toContain("Its unsigned weight is 2147483648.");
  expect(text).not.toContain("It is worth 2147483648.");
  expect(text).toContain("#/lesson/twos-complement");
  const links = [
    ...learnerText(lesson)
      .join("\n")
      .matchAll(/#\/lesson\/([a-z-]+)/g),
  ].map((match) => match[1]);
  expect(links).toEqual(["same-bits-two-readings", "subtraction-flags-and-negation"]);
  for (const id of links) expect(LESSONS.some((entry) => entry.id === id)).toBe(true);
});

it("holds the prose ranges and worked readings to the model", () => {
  expect(fourBitReadings("1010").unsigned).toBe(10);
  expect(fourBitReadings("1010").signed).toBe(-6);
  expect(FOUR_BIT_LIMITS).toEqual({ unsignedMin: 0, unsignedMax: 15, signedMin: -8, signedMax: 7 });
  expect(
    Array.from({ length: 16 }, (_, x) => fourBitReadings(x.toString(2).padStart(4, "0")))
      .map((r) => r.signed)
      .sort((a, b) => a - b),
  ).toEqual(Array.from({ length: 16 }, (_, x) => x - 8));
  expect([
    readingsOfValue(0x80000000).signed,
    readingsOfValue(0x7fffffff).signed,
    readingsOfValue(0xffffffff).unsigned,
  ]).toEqual([-2147483648, 2147483647, 4294967295]);
});
