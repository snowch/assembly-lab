// Copyright © 2026 Christopher Snow

import { expect, it } from "vitest";
import { LESSONS } from ".";

it.each([
  ["one-pattern-three-readings", "hexadecimal-calculator", "hexadecimal"],
  ["same-bits-two-readings", "readings-calculator", "readings"],
  ["four-bit-arithmetic", "four-bit-calculator", "arithmetic"],
  ["building-constants", "halves-calculator", "halves"],
])("offers only the lesson's optional calculator: %s", (lessonId, figureId, preset) => {
  const lesson = LESSONS.find((x) => x.id === lessonId)!;
  const figures = lesson.sections.flatMap((s) => s.interactives);
  const tools = figures.filter((f) => f.kind === "programmer-calculator");
  expect(tools).toHaveLength(1);
  expect(tools[0]).toMatchObject({
    id: figureId,
    role: "experiment",
    timeModel: "none",
    props: { preset },
  });
  expect(tools[0]!.props).not.toHaveProperty("answers");
  expect(tools[0]!.props).not.toHaveProperty("fromChallenge");
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
