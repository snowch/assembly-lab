// Copyright © 2026 Christopher Snow

import { describe, expect, it } from "vitest";
import { checkLesson } from "@platform/lesson-schema";
import { LESSONS, SOURCE_LESSONS } from ".";
import { pacingOrigins } from "./pacing";

const givenKey = (value: unknown): string => JSON.stringify(value);

describe("the published short lesson sequence", () => {
  it("retains every existing exercise test obligation across split fields and pages", () => {
    for (const source of SOURCE_LESSONS) {
      const pages = LESSONS.filter((page) => (pacingOrigins.get(page.id) ?? page.id) === source.id);
      expect(pages.length, source.id).toBeGreaterThan(0);
      const obligations = new Set(
        pages.flatMap((page) =>
          page.challenges.flatMap((challenge) =>
            challenge.tests.kind === "answers"
              ? challenge.tests.cases.flatMap((test) =>
                  Object.entries(test.expect).map(([field, value]) =>
                    JSON.stringify([
                      challenge.tests.kind === "answers" ? challenge.tests.grader : "",
                      givenKey(test.given),
                      field,
                      value,
                    ]),
                  ),
                )
              : [],
          ),
        ),
      );
      for (const challenge of source.challenges) {
        if (challenge.tests.kind !== "answers") continue;
        for (const test of challenge.tests.cases)
          for (const [field, value] of Object.entries(test.expect)) {
            expect(
              obligations.has(
                JSON.stringify([challenge.tests.grader, givenKey(test.given), field, value]),
              ),
              `${source.id}/${challenge.id}: ${givenKey(test.given)} ${field}`,
            ).toBe(true);
          }
      }
    }
  });

  it("has valid independently mounted activities and no cross-page gates", () => {
    for (const lesson of LESSONS) {
      expect(checkLesson(lesson), lesson.id).toEqual([]);
      const figures = lesson.sections.flatMap((section) => section.interactives);
      const ids = new Set(figures.map((figure) => figure.id));
      const challenges = new Set(lesson.challenges.map((challenge) => challenge.id));
      for (const figure of figures) {
        for (const [key, value] of Object.entries(figure.props)) {
          if (key === "after" && typeof value === "string")
            expect(ids.has(value), `${lesson.id}/${figure.id} after ${value}`).toBe(true);
          if (
            ["challengeId", "afterChallenge", "fromChallenge", "afterRun"].includes(key) &&
            typeof value === "string"
          ) {
            expect(challenges.has(value), `${lesson.id}/${figure.id} ${key} ${value}`).toBe(true);
          }
        }
      }
    }
  });

  it("preserves published routes and gives each new unit a contiguous place in its module", () => {
    const ids = new Set(LESSONS.map((lesson) => lesson.id));
    for (const source of SOURCE_LESSONS) expect(ids.has(source.id), source.id).toBe(true);
    for (const module of new Set(LESSONS.map((lesson) => lesson.module))) {
      const units = LESSONS.filter((lesson) => lesson.module === module);
      expect(units.map((lesson) => lesson.order)).toEqual(units.map((_, index) => index));
    }
  });
});
