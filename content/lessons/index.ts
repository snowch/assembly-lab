// Copyright © 2026 Christopher Snow

// The lessons that are written, in course order. Each is a module of this folder, typed by the
// lesson schema; adding one here is what publishes it. Every lesson is parsed when the app starts,
// so an invalid lesson fails fast with its problems listed, and the content tests parse the same
// list. The plan (../plan/plan.ts) works out each module's status from this list.

import { parseLesson, type Lesson } from "@platform/lesson-schema";

import { addingAndTheFlags } from "./adding-and-the-flags";
import { constantsAndWidths } from "./constants-and-widths";
import { meetTheMachine } from "./meet-the-machine";
import { onePatternThreeReadings } from "./one-pattern-three-readings";
import { subtractingAndTheTickCounter } from "./subtracting-and-the-tick-counter";

export const LESSONS: readonly Lesson[] = [
  meetTheMachine,
  onePatternThreeReadings,
  constantsAndWidths,
  addingAndTheFlags,
  subtractingAndTheTickCounter,
].map(parseLesson);
