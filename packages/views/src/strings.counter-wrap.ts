// Copyright © 2026 Christopher Snow

// Canonical drafting record: docs/notes/counter-carry-flag-wording/copy.md.
export const COUNTER_WRAP_STRINGS = {
  title: "How a counter wraps",
  caption: "Count forward through the wrap.",
  intro: (width: number, realWidth: number) =>
    `Each tick adds one. This ${width}-bit teaching counter shows how \`adds\` would update the carry flag C at that width. The program later uses ${realWidth}-bit registers. Its readings are unsigned: zero or positive.`,
  instruction:
    "Press +1 to add a tick. Keep pressing until the stored reading returns to zero. Inspect the carry flag C at the wrap. Reset starts at zero.",
  previous: "−1",
  previousLabel: "−1, subtract one",
  advance: "+1",
  advanceLabel: "+1, add one",
  reset: "Reset",
  initialNote: "The dash means no addition is shown yet.",
  carryLabel: "Carry flag C after `adds`",
  subtractionFlagLabel: "Carry flag C after `subs`",
  decimalLabel: "Unsigned decimal reading",
  pendingCarry: "—",
  retainedLabel: "Bits stored",
  trailLabel: "Recent stored readings",
  forwardWrapped: (width: number) =>
    `The ${width} stored bits wrap to zero. This model updates the carry flag C to 1 for the carry beyond them.`,
  backwardWrapped: (width: number, pattern: string, stored: number) =>
    `Subtracting one from zero goes below the unsigned range. Keeping only ${width} result bits gives \`${pattern}\` (${stored} unsigned).`,
  forwardNormal:
    "The addition has no carry beyond the stored bits. This model updates the carry flag C to 0.",
  backwardNormal:
    "Subtracting one stays within the unsigned range, so this model updates the carry flag C to 1.",
  subtractionRule: (width: number) =>
    `This ${width}-bit model shows how Arm \`subs\` updates the carry flag C:`,
  subtractionRules: [
    { flag: "C = 0:", explanation: "Borrow needed. The unsigned subtraction went below zero." },
    {
      flag: "C = 1:",
      explanation: "No borrow needed. The unsigned subtraction stayed at or above zero.",
    },
  ],
  architectureNote: (width: number) =>
    `In this ${width}-bit model, the \`adds\` rule updates the carry flag C to 1 for carry out and 0 otherwise. Real \`adds\` uses 32 or 64 bits; plain \`add\` preserves C.`,
  borrowTitle: "Optional: subtract one and inspect the carry flag C",
  borrowIntro: (width: number) =>
    `Subtracting one is a decrement. This separate ${width}-bit counter shows how \`subs\` would update the carry flag C at that width. It does not reverse time or undo earlier work.`,
  borrowInstruction:
    "Press −1 once from zero. Inspect the carry flag C after `subs` and the stored reading. Keep pressing to count down through further wraps. Reset starts this counter at zero.",
  borrowInitialNote: "The dash means no subtraction is shown yet.",
  borrowArchitectureNote: (width: number) =>
    `This is a ${width}-bit teaching model. Real \`subs\` updates the carry flag C to 0 or 1 at its 32- or 64-bit width. Plain \`sub\` preserves C.`,
  initialStatus: (stored: number) =>
    `Stored reading: ${stored}. Carry flag C: no operation shown yet.`,
  stepStatus: (direction: number, stored: number, carryOut: number) =>
    direction === 1
      ? `Added one. Stored reading: ${stored}. Carry flag C after adds: ${carryOut}.`
      : `Subtracted one. Stored reading: ${stored}. Carry flag C after subs: ${carryOut}.`,
} as const;
