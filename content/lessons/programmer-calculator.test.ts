// Copyright © 2026 Christopher Snow

import { expect, it } from "vitest";
import { LESSONS } from ".";

it.each([
  ["one-pattern-three-readings", "read-register"],
  ["same-bits-two-readings", "reading-explore"],
  ["four-bit-arithmetic", "four-bit-width"],
  ["building-constants", "movk-halves"],
])("keeps teaching figures without a duplicate scratch calculator: %s", (lessonId, figureId) => {
  const lesson = LESSONS.find((x) => x.id === lessonId)!;
  const figures = lesson.sections.flatMap((section) => section.interactives);
  expect(figures.filter((figure) => figure.kind === "programmer-calculator")).toEqual([]);
  expect(figures.map((figure) => figure.id)).toContain(figureId);
});

it("keeps register scratch work and existing arithmetic helpers independent of grading", () => {
  const widths = LESSONS.find((l) => l.id === "register-widths")!;
  const prediction = widths.challenges.find((c) => c.id === "predict-two-registers")!;
  expect(prediction.initial.data).toMatchObject({
    predictionTools: true,
    numberFormat: "decimal-or-hex",
  });
  expect(prediction.initial.answers ?? {}).toEqual({});
  const halves = LESSONS.find((l) => l.id === "building-constants")!;
  expect(halves.challenges.find((c) => c.id === "build-1000000")!.initial.data).toMatchObject({
    calculator: { division: "whole" },
  });
  const readings = LESSONS.find((l) => l.id === "same-bits-two-readings")!;
  expect(readings.challenges.find((c) => c.id === "make-minus-three")!.initial.data).toMatchObject({
    calculator: ["unsigned"],
  });
});
