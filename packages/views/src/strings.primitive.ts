// Copyright © 2026 Christopher Snow

// Opening activity copy, separately drafted from the checked arithmetic/trace brief.
export const PRIMITIVE_STRINGS = {
  progress: (position: number, count: number) => `Activity ${position} of ${count}`,
  before: "Before the instruction",
  current: "Registers now",
  instruction: "Instruction",
  nextInstruction: "Runs next",
  ranInstruction: "Just ran",
  run: "Run the instruction",
  check: "Check and run",
  continue: "Next activity",
  restart: "Start again",
  answer: "Your prediction",
  question: (name: string) => `What value will ${name} hold after this instruction?`,
  correct: "Your prediction matched.",
  incorrect: "Compare your prediction with the result.",
  input: "Read",
  output: "Write",
  unchanged: (names: string) =>
    `${names} ${names.includes(",") ? "keep their values" : "keeps its value"}.`,
  reused: (name: string) =>
    `${name} supplies its old value before the instruction writes its result there.`,
  complete:
    "You have practised addition, subtraction and returning from a function. Now combine them in the trip calculation.",
  stopped: "The activity stops after the instructions shown.",
  caller: "Caller",
  callerCall: (entry: string, input: number) => `${entry}(${input})`,
  callArgument: (value: number) => `Argument supplied: ${value}`,
  callerWaiting: "Waiting for increment_int to return",
  callerReturned: (value: number) => `Resumed with result: ${value}`,
  functionEntry: "The argument is in w0. Run add to prepare the result.",
  functionAfterAdd: "The result is in w0. Run ret to return to the caller.",
  functionReturned: "ret returned to the caller. It left w0 unchanged.",
  functionComplete: "The function has returned to its caller.",
  functionNavigation: "View the function’s C and instructions",
  showInstructions: "Show instructions",
  showC: "Show C",
} as const;
