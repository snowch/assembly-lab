// Copyright © 2026 Christopher Snow

// Canonical drafting record: docs/notes/bidirectional-counter-wrap/copy.md.
export const COUNTER_WRAP_STRINGS = {
  title: "How a counter wraps",
  caption: "Count up and down, then inspect the stored bits.",
  intro: (width: number, realWidth: number) =>
    `Each real counter tick adds one. This teaching counter keeps only ${width} bits; the program later uses ${realWidth}-bit registers. Its readings are unsigned: zero or positive.`,
  instruction:
    "Use +1 until the stored reading wraps to zero, then press −1. Watch Carry out change to Borrow needed. Keep counting in either direction.",
  previous: "−1",
  previousLabel: "−1, subtract one",
  advance: "+1",
  advanceLabel: "+1, add one",
  reset: "Reset",
  initialNote: "The dash means no addition or subtraction is shown yet.",
  initialMarkerLabel: "Carry / borrow",
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
    "These markers belong to this four-bit example. At the instruction's width, Arm `adds` sets C from carry; `subs` sets C to 1 for no borrow. Plain `add` and `sub` leave flags unchanged.",
  initialStatus: (stored: number) => `Stored reading: ${stored}. No step is shown.`,
  stepStatus: (direction: number, stored: number, marker: number) =>
    direction === 1
      ? `Added one. Stored reading: ${stored}. Carry out: ${marker}.`
      : `Subtracted one. Stored reading: ${stored}. Borrow needed: ${marker}.`,
} as const;
