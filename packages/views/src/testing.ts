// Copyright © 2026 Christopher Snow

// Helpers for the views' tests: a program, a written challenge and an answers challenge small
// enough to read, built through the lesson schema so they carry the defaults a lesson's do.

import { Challenge } from "@platform/lesson-schema";

import type { RecordedProgram } from "./listing";

export const TRIP: RecordedProgram = {
  c: [
    "int trip_distance(int leg1, int leg2, int leg3, int detour)",
    "{",
    "    int total = leg1 + leg2;",
    "    total = total + leg3;",
    "    total = total - detour;",
    "    return total;",
    "}",
  ].join("\n"),
  listing: [
    "trip_distance:",
    "  add w0, w0, w1 C3",
    "  add w0, w0, w2 C4",
    "  sub w0, w0, w3 C7",
    "  ret C7",
  ].join("\n"),
};

export const TRIP_AND_FUEL: RecordedProgram = {
  c: TRIP.c,
  listing: [TRIP.listing, "fuel_used:", "  sub w0, w0, w1 C12", "  ret C12"].join("\n"),
};

export const TRIP_CALL = { entry: "trip_distance", args: [120, 85, 42, 15] };

/** A written challenge: fix `sub w0, w1, w0` so that it returns its first argument minus its second. */
export const written = Challenge.parse({
  id: "fix",
  title: "Fix the subtraction",
  task: "Fix it.",
  gradedDirection: "write",
  palette: ["w0", "w1", "w2", "w3"],
  allowedConstructs: ["add", "sub", "ret"],
  initial: { text: "sub w0, w1, w0\nret" },
  tests: {
    kind: "answers",
    grader: "run-registers",
    cases: [
      { label: "fuel_used(50, 38)", given: { w0: 50, w1: 38 }, expect: { w0: 12 } },
      { label: "fuel_used(45, 45)", given: { w0: 45, w1: 45 }, expect: { w0: 0 } },
      { label: "fuel_used(60, 5)", given: { w0: 60, w1: 5 }, expect: { w0: 55 } },
    ],
  },
  hints: ["a", "b", "c", "d", "e"],
  reference: { text: "sub w0, w0, w1\nret" },
});

/** An answers challenge over a three-instruction function. */
export const answers = Challenge.parse({
  id: "trace",
  title: "Trace the call",
  task: "Trace it.",
  gradedDirection: "answer",
  fields: [
    { id: "w0", label: "`w0` at the end", kind: "number" },
    { id: "w1", label: "`w1` at the end", kind: "number" },
  ],
  initial: {
    data: {
      program: {
        c: "int f(int a, int b, int c)\n{\n    return a - b - 5;\n}",
        listing: "f:\n  sub w0, w0, w1 C3\n  sub w0, w0, #5 C3\n  ret C3",
      },
    },
  },
  tests: {
    kind: "answers",
    grader: "registers-at-return",
    cases: [
      {
        label: "w0 at the end",
        given: { entry: "f", w0: 100, w1: 30, w2: 7, "feedback.w0": "Do each sub in turn." },
        expect: { w0: "w0" },
      },
      {
        label: "w1 at the end",
        given: { entry: "f", w0: 100, w1: 30, w2: 7, "feedback.w1": "Which line writes w1?" },
        expect: { w1: "w1" },
      },
    ],
  },
  hints: ["a", "b", "c", "d", "e"],
  reference: { answers: { w0: "65", w1: "30" } },
});
