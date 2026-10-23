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
    "You have practised addition, subtraction and running instructions in order. Now connect them to a C function.",
  stopped: "The activity stops after the instructions shown.",
} as const;
