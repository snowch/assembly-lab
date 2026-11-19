// Copyright © 2026 Christopher Snow

// Canonical drafting record: docs/notes/restore-counter-wrap/copy.md.
export const COUNTER_WRAP_STRINGS = {
  title: "How a counter wraps",
  caption: "Count forward, then inspect the stored bits.",
  intro: (width: number, realWidth: number) =>
    `A counter stores a count. Each tick adds one. This teaching counter keeps only ${width} bits; the program later uses ${realWidth}-bit registers.`,
  instruction:
    "Use +1 until Bits stored shows 0000. The example pauses there. Use −1 to revisit the previous tick.",
  previous: "−1",
  previousLabel: "−1, revisit the previous tick",
  advance: "+1",
  advanceLabel: "+1, advance one tick",
  reset: "Reset",
  initialNote: "The dash means no +1 tick is shown at the starting reading.",
  carryLabel: "Carry from +1",
  decimalLabel: "Decimal reading",
  pendingCarry: "—",
  retainedLabel: "Bits stored",
  trailLabel: "Counter readings in counting order",
  wrapped: (width: number) =>
    `The carry out is outside the ${width} stored positions. The counter keeps only the low ${width} bits, so its reading becomes zero. This is a wrap.`,
  architectureNote:
    "The carry shown belongs to this four-bit example. Arm `adds` records carry out for its actual register width; `add` leaves C unchanged.",
  next: (earlier: number, later: number) =>
    `The next pane uses the earlier reading \`${earlier}\` and the later reading \`${later}\` to calculate elapsed ticks.`,
  initialStatus: (stored: number) => `Starting reading: ${stored}. No +1 tick is shown.`,
  stepStatus: (ticks: number, stored: number, carry: number) =>
    `Viewing tick ${ticks}. Stored reading: ${stored}. Carry from +1: ${carry}.`,
} as const;
