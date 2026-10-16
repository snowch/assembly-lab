// Copyright © 2026 Christopher Snow

// @al/views: the course's figures, assembly editor and grader, and the Book that joins them to the
// platform's runtime.

export { BOOK_ID, ChallengeEditor, STEPS, createBook } from "./book";
export { AssemblyEditor, SYMBOLS } from "./AssemblyEditor";
export { AnswerEditor } from "./AnswerEditor";
export {
  REGISTERS_AT_RETURN,
  RUN_REGISTERS,
  grade,
  gradeAnswers,
  gradeWritten,
  isWritten,
} from "./grader";
export { INTERACTIVES } from "./interactives";
export { assemblyOf, cLinesOf, deleteLine, parseListing } from "./listing";
export type { DeleteSpec, ListingLine, RecordedProgram } from "./listing";
export { errorSentence, sentence, stopSentence } from "./messages";
export { ListingView, RegisterRow, withCode } from "./parts";
export { VIEW_STRINGS, quoted } from "./strings";
export { fieldList } from "./fields";
export { bitsOf, traceOf, viewAt, wValue, wValueAsInt } from "./trace";
export { traceText } from "./traceText";
export {
  NO_BITS,
  MINUS,
  isPattern,
  patternOf,
  readingsOf,
  readingsOfPattern,
  readingsOfValue,
  shown,
  stateHolding,
  wholeNumber,
  worths,
} from "./readings";
export type { Readings } from "./readings";
export { BIT_READINGS, PATTERN_READINGS, REGISTERS_AFTER } from "./readingGraders";
export { compareListings } from "./interactives/ListingCompare";
export { tryMov } from "./interactives/ConstantTester";
export type { StepView, Trace, TraceCall } from "./trace";
export { ARITH_STRINGS } from "./strings.arith";
export { FlagsRow } from "./FlagsRow";
export { additionSteps, bitAt, flagDigits, hex32 } from "./arith";
export { OUTCOMES_AT_RETURN, SMALLEST_SETTING_FLAG } from "./grader-arith";
export { COUNTER_VALUES, ringReading } from "./ring";
export { MODULE1_STRINGS } from "./strings.module1";
export { introducedOf } from "./interactives/props";
