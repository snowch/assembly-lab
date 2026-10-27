// Copyright © 2026 Christopher Snow

// The lessons that are written, in course order. Each is a module of this folder, typed by the
// lesson schema; adding one here is what publishes it. Every lesson is parsed when the app starts,
// so an invalid lesson fails fast with its problems listed, and the content tests parse the same
// list. The plan (../plan/plan.ts) works out each module's status from this list.

import { parseLesson, type Lesson } from "@platform/lesson-schema";

import { addingAndTheFlags } from "./adding-and-the-flags";
import { branches } from "./branches";
import { compareAndChoose } from "./compare-and-choose";
import { constantsAndWidths } from "./constants-and-widths";
import { countingUp } from "./counting-up";
import { countingDown } from "./counting-down";
import { withIntroduced } from "./introduced";
import { arrayAddresses } from "./array-addresses";
import { productsAndWidths } from "./products-and-widths";
import { divisionAndRemainders } from "./division-and-remainders";
import { callsAndReturns } from "./calls-and-returns";
import { recursiveCalls } from "./recursive-calls";
import { fromCToInstructions } from "./from-c-to-instructions";
import { compileALoop } from "./compile-a-loop";
import { cAndOverflow } from "./c-and-overflow";
import { checkedArithmetic } from "./checked-arithmetic";
import { fromFunctionToExecutable } from "./from-function-to-executable";
import { debugNativeInstructions } from "./debug-native-instructions";
import { raspberryPi5 } from "./raspberry-pi-5";
import { raspberryPiBoot } from "./raspberry-pi-boot";
import { sameCOnA32 } from "./same-c-on-a32";
import { zeroTerminatedStrings } from "./zero-terminated-strings";
import { masks } from "./masks";
import { fundamentalsLessons } from "./fundamentals";
import { meetTheMachine } from "./meet-the-machine";
import { memoryAndAddresses } from "./memory-and-addresses";
import { loadingWidths } from "./loading-widths";
import { onePatternThreeReadings } from "./one-pattern-three-readings";
import { shifts } from "./shifts";
import { subtractingAndTheTickCounter } from "./subtracting-and-the-tick-counter";

export const LESSONS: readonly Lesson[] = [
  ...fundamentalsLessons,
  meetTheMachine,
  onePatternThreeReadings,
  constantsAndWidths,
  addingAndTheFlags,
  subtractingAndTheTickCounter,
  masks,
  shifts,
  compareAndChoose,
  branches,
  countingUp,
  countingDown,
  memoryAndAddresses,
  loadingWidths,
  arrayAddresses,
  zeroTerminatedStrings,
  productsAndWidths,
  divisionAndRemainders,
  callsAndReturns,
  recursiveCalls,
  fromCToInstructions,
  compileALoop,
  cAndOverflow,
  checkedArithmetic,
  fromFunctionToExecutable,
  debugNativeInstructions,
  raspberryPi5,
  raspberryPiBoot,
  sameCOnA32,
]
  .map(withIntroduced)
  .map(parseLesson);
