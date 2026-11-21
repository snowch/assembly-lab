// Copyright © 2026 Christopher Snow

// Canonical drafting record: docs/notes/counter-subtraction-c/copy.md.
export const COUNTER_WRAP_STRINGS = {
  title: "How a counter wraps",
  caption: "Count forward through the wrap.",
  intro: (width: number, realWidth: number) =>
    `Each tick adds one. This teaching counter keeps only ${width} bits; the program later uses ${realWidth}-bit registers. Its readings are unsigned: zero or positive.`,
  instruction:
    "Press +1 to add a tick. Keep pressing until the stored reading returns to zero. Watch Carry out at the wrap. Reset starts at zero.",
  previous: "−1",
  previousLabel: "−1, subtract one",
  advance: "+1",
  advanceLabel: "+1, add one",
  reset: "Reset",
  initialNote: "The dash means no addition is shown yet.",
  carryLabel: "Carry out",
  subtractionFlagLabel: "C after `subs`",
  decimalLabel: "Unsigned decimal reading",
  pendingCarry: "—",
  retainedLabel: "Bits stored",
  trailLabel: "Recent stored readings",
  forwardWrapped: (width: number) =>
    `The extra carry lies beyond the ${width} stored bits. The stored bits wrap to zero.`,
  backwardWrapped: (width: number, pattern: string, stored: number) =>
    `Subtracting one from zero goes below the unsigned range. Keeping only ${width} result bits gives \`${pattern}\` (${stored} unsigned).`,
  forwardNormal: "The addition stays within the stored bits. Carry out is zero.",
  backwardNormal: (width: number, pattern: string, stored: number) =>
    `Subtracting one stays within the unsigned range. Keeping only ${width} result bits gives \`${pattern}\` (${stored} unsigned).`,
  subtractionRule: (width: number) => `This ${width}-bit model follows the Arm \`subs\` rule:`,
  subtractionRules: [
    { flag: "C = 0:", explanation: "Borrow needed. The unsigned subtraction went below zero." },
    {
      flag: "C = 1:",
      explanation: "No borrow needed. The unsigned subtraction stayed at or above zero.",
    },
  ],
  architectureNote:
    "The carry shown belongs to this four-bit example. At its actual register width, `adds` records carry in C; `add` leaves flags unchanged.",
  borrowTitle: "Optional: subtract one and inspect C",
  borrowIntro: (width: number) =>
    `The processor’s arithmetic and logic unit (ALU) can subtract when an instruction such as \`subs\` requests it. Subtracting one is a decrement. This separate ${width}-bit counter explores subtraction; it does not reverse time or undo an earlier operation.`,
  borrowInstruction:
    "Press −1 once from zero. Inspect C after `subs` and the stored reading. Keep pressing to count down through further wraps. Reset starts this counter at zero.",
  borrowInitialNote: "The dash means no subtraction is shown yet.",
  borrowArchitectureNote:
    "C is calculated for this four-bit model. Real `subs` uses 32- or 64-bit registers; plain `sub` preserves the processor’s flags.",
  initialStatus: (stored: number) => `Stored reading: ${stored}. No step is shown.`,
  stepStatus: (direction: number, stored: number, carryOut: number) =>
    direction === 1
      ? `Added one. Stored reading: ${stored}. Carry out: ${carryOut}.`
      : `Subtracted one. Stored reading: ${stored}. C after subs: ${carryOut}.`,
} as const;
