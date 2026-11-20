// Copyright © 2026 Christopher Snow

// Canonical drafting record: docs/notes/subtraction-transfer/reminder-copy.md.
export const COUNTER_SUBTRACTION_STRINGS = {
  title: "Subtracting with addition",
  caption: "A worked subtraction using a small counter.",
  intro: (width: number, now: number, then: number) =>
    `This worked example uses its own ${width}-bit readings: earlier \`${then}\`, later \`${now}\`. Calculate later minus earlier.`,
  rule: (width: number) =>
    `Invert the earlier reading: change every 0 to 1 and every 1 to 0. Add one, then add the later reading. Keep only the low ${width} result bits.`,
  labels: {
    later: "Later reading (now)",
    earlier: "Earlier reading (then)",
    invert: "Invert the earlier reading",
    addOne: "Add one",
    addLater: "Add the later reading",
    result: "Result bits kept",
    timeline: "Counter readings in counting order",
  },
  summary: (ticks: number) =>
    `The retained result is ${ticks} ticks. It matches the forward path through zero.`,
  bound: (range: number) =>
    `This is the elapsed time only when the counter advances normally and fewer than ${range} ticks, one full turn, pass between readings.`,
  instruction:
    "These rows explain the arithmetic. In your code, one `sub` instruction calculates the result bits.",
  bridge: (smallWidth: number, registerWidth: number) =>
    `The next example uses a ${registerWidth}-bit counter. Apply the same rule to all ${registerWidth} bits of each reading, keeping ${registerWidth} result bits instead of ${smallWidth}.`,
} as const;
