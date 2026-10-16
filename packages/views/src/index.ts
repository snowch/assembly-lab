// Copyright © 2026 Christopher Snow

// @al/views: the course's figures, assembly editor and grader, and the Book that joins them to the
// platform's runtime.

export { BOOK_ID, ChallengeEditor, STEPS, createBook } from "./book";
export { AssemblyEditor, SYMBOLS } from "./AssemblyEditor";
export { AnswerEditor } from "./AnswerEditor";
export {
  HEX_REGISTERS_AT_RETURN,
  INSTRUCTION_AT_ENTRY,
  REGISTERS_AT_RETURN,
  RUN_REGISTERS,
  grade,
  gradeAnswers,
  gradeInstructions,
  gradeWritten,
  isWritten,
} from "./grader";
export { INTERACTIVES } from "./interactives";
export { assemblyOf, cLinesOf, deleteLine, parseListing } from "./listing";
export type { DeleteSpec, ListingLine, RecordedProgram } from "./listing";
export { errorSentence, sentence, stopSentence } from "./messages";
export { ListingView, RegisterRow, withCode } from "./parts";
export { VIEW_STRINGS } from "./strings";
export { bitsOf, traceOf, viewAt, wValue, wValueAsInt } from "./trace";
export type { StepView, Trace, TraceCall } from "./trace";
