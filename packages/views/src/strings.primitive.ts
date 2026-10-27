// Copyright © 2026 Christopher Snow

// Opening activity copy, separately drafted from checked arithmetic and call traces.
// Canonical shared labels: docs/notes/fundamentals/primitive-prose.md.
export const PRIMITIVE_STRINGS = {
  before: "Before the instruction",
  current: "Registers now",
  instruction: "Instruction",
  nextInstruction: "Runs next",
  ranInstruction: "Just ran",
  run: "Run the instruction",
  check: "Check and run",
  restart: "Start again",
  answer: "Your prediction",
  question: (name: string) => `What value will ${name} hold after this instruction?`,
  correct: "Your prediction matched.",
  incorrect: "Compare your prediction with the result.",
  input: "Input",
  constant: "Constant",
  output: "Destination written",
  outputPending: "Destination",
  unchanged: (names: string) =>
    `${names} ${names.includes(",") ? "keep their values" : "keeps its value"}.`,
  reused: (name: string) =>
    `${name} supplies its old value before the instruction writes its result there.`,
  stopped: "The activity stops after the instructions shown.",
  caller: "Caller",
  callerCall: (entry: string, input: number | readonly number[]) =>
    `${entry}(${typeof input === "number" ? input : input.join(", ")})`,
  callerWaiting: "Waiting",
  callerReturned: (value: number) => `Resumed with result: ${value}`,
  functionEntry: "The argument is in w0. Run add to prepare the result.",
  functionEntryMany: (registers: string) =>
    `The arguments are in ${registers}. Run add to prepare the result.`,
  functionAfterAdd: "The result is in w0. Run ret to return to the caller.",
  functionReturned: "ret returned to the caller. It left w0 unchanged.",
  argumentPath: "Argument",
  argumentPathAt: (index: number) =>
    ["First argument", "Second argument", "Third argument"][index] ?? `Argument ${index + 1}`,
  returnPath: "Return to caller",
  result: "Result",
  resultReady: "Result ready",
} as const;
