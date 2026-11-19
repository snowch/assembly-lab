// Copyright © 2026 Christopher Snow

// Canonical drafting record: docs/notes/restore-counter-wrap/copy.md.
export const COUNTER_WRAP_STRINGS = {
  title: "How a counter wraps",
  caption: "Count forward, then inspect the stored bits.",
  intro: (width: number, realWidth: number) =>
    `A counter stores a count. Each tick adds one. This teaching counter keeps only ${width} bits; the program later uses ${realWidth}-bit registers.`,
  instruction:
    "Choose Advance one tick twice. Each press adds one to the stored count. Watch Carry out and Bits stored when the count reaches zero.",
  advance: "Advance one tick",
  reset: "Reset",
  initialLabel: "Starting reading",
  initialNote: "No tick has advanced yet, so no addition is shown.",
  carryLabel: "Carry out",
  retainedLabel: "Bits stored",
  trailLabel: "Counter readings in counting order",
  noCarry: (width: number) => `The full sum fits in ${width} bits, so the carry out is 0.`,
  wrapped: (width: number) =>
    `The carry out is outside the ${width} stored positions. The counter keeps only the low ${width} bits, so its reading becomes zero. This is a wrap.`,
  architectureNote:
    "The carry shown belongs to this four-bit example. Arm `adds` records carry out for its actual register width; `add` leaves C unchanged.",
  next: (earlier: number, later: number) =>
    `The next pane uses the earlier reading \`${earlier}\` and the later reading \`${later}\` to calculate elapsed ticks.`,
  initialStatus: (stored: number) => `Starting counter reading: ${stored}. No ticks have advanced.`,
  stepStatus: (ticks: number, stored: number, carry: number) =>
    `Ticks advanced: ${ticks}. Stored reading: ${stored}. Carry out: ${carry}.`,
} as const;
