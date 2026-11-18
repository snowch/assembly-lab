// Copyright © 2026 Christopher Snow

// Canonical drafting record: docs/notes/counter-wrap/copy.md.
export const COUNTER_WRAP_STRINGS = {
  title: "See a counter wrap",
  caption: "Advance a four-bit counter to compare each full sum with the bits it stores.",
  modelNote: (width: number, realWidth: number) =>
    `This is a ${width}-bit teaching model. The lesson uses ${realWidth}-bit registers.`,
  instruction: "Choose Advance one tick. Each tick adds one. Watch which bits the counter stores.",
  advance: "Advance one tick",
  reset: "Reset",
  counterLabel: "Stored counter bits",
  startingLabel: "Earlier reading",
  ticksLabel: "Ticks since the earlier reading",
  additionLabel: "Last tick's addition",
  fullSumLabel: "Full sum",
  carryLabel: "Carry out",
  retainedLabel: "Bits stored",
  initialNote: "No tick has advanced yet. There is no completed addition to show.",
  initialStatus: (stored: number) => `Starting reading: ${stored}. No ticks have passed.`,
  stepStatus: (ticks: number, stored: number, fullSum: number, carryOut: number) =>
    `Ticks passed: ${ticks}. Stored reading: ${stored}. Last tick's full sum: ${fullSum}. Carry out: ${carryOut}.`,
  limitNote: (maximumTicks: number) =>
    `This example ends after ${maximumTicks} ticks. Choose Reset to try it again.`,
  carryExplanation:
    "Carry out is the bit beyond the counter's width. It is separate from the bits stored in the counter.",
  wrapExplanation: (fullSum: number, fullPattern: string, pattern: string, stored: number) =>
    `The full sum is ${fullSum}, or ${fullPattern} in binary. The counter stores only the low bits: ${pattern}, read as ${stored}. This is unsigned wrap.`,
  elapsedTitle: "Count the ticks across the wrap",
  elapsedExplanation: (start: number, stored: number, width: number, elapsed: number) =>
    `The earlier reading is ${start}; the later reading is ${stored}. Subtract the earlier reading from the later one and keep the low ${width} bits. The result is ${elapsed}, matching the ticks you advanced.`,
  elapsedAssumption: (range: number) =>
    `This measures elapsed ticks only if the counter advances normally and fewer than ${range} ticks pass between readings.`,
  turnLimit: "The two readings alone cannot tell you how many complete turns the counter made.",
  architectureNote:
    "Unsigned wrap differs from signed overflow V. Arm `adds` updates C for its actual register width; `add` leaves the flags unchanged.",
} as const;
