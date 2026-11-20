// Copyright © 2026 Christopher Snow

// Canonical drafting record: docs/notes/counter-zero-optional-borrow/copy.md.
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
  borrowLabel: "Borrow needed",
  decimalLabel: "Unsigned decimal reading",
  pendingCarry: "—",
  retainedLabel: "Bits stored",
  trailLabel: "Recent stored readings",
  forwardWrapped: (width: number) =>
    `The extra carry lies beyond the ${width} stored bits. The stored bits wrap to zero.`,
  backwardWrapped: (width: number, range: number) =>
    `Subtraction must borrow one group of ${range} from the next position. Taking one leaves ${range - 1} in ${width} bits.`,
  forwardNormal: "The addition stays within the stored bits. Carry out is zero.",
  backwardNormal:
    "The subtraction stays at or above zero. No borrow from beyond the stored bits is needed.",
  architectureNote:
    "The carry shown belongs to this four-bit example. At its actual register width, `adds` records carry in C; `add` leaves flags unchanged.",
  borrowTitle: "Optional: subtract one and inspect the borrow",
  borrowIntro: (width: number) =>
    `The processor’s arithmetic and logic unit (ALU) can subtract when an instruction such as \`sub\` requests it. Subtracting one is a decrement. This separate ${width}-bit counter explores subtraction; it does not reverse time or undo an earlier operation.`,
  borrowInstruction:
    "Press −1 once from zero. Inspect Borrow needed and the stored reading. Keep pressing to count down through further wraps. Reset starts this counter at zero.",
  borrowInitialNote: "The dash means no subtraction is shown yet.",
  borrowArchitectureNote:
    "This marker shows borrow beyond the four stored bits. At the instruction’s width, `subs` sets C to 1 for no borrow; `sub` leaves flags unchanged.",
  initialStatus: (stored: number) => `Stored reading: ${stored}. No step is shown.`,
  stepStatus: (direction: number, stored: number, marker: number) =>
    direction === 1
      ? `Added one. Stored reading: ${stored}. Carry out: ${marker}.`
      : `Subtracted one. Stored reading: ${stored}. Borrow needed: ${marker}.`,
} as const;
