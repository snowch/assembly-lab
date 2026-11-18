// Copyright © 2026 Christopher Snow

// Canonical drafting record: docs/notes/elapsed-learning-design/copy.md.
export const ELAPSED_COUNTER_STRINGS = {
  summary: (now: number, then: number, elapsed: number, width: number) =>
    `Keeping the low ${width} bits of \`${now} - ${then}\` gives \`${elapsed}\` ticks: the same forward distance shown on the ring.`,
  rule: (range: number, width: number) =>
    `When \`now\` is less than \`then\`, the forward distance is \`(${range} - then) + now\` ticks. This is \`now - then\` plus one full turn, which does not change the low ${width} bits. The subtraction therefore keeps that same forward distance. This measures elapsed ticks only when the counter advances normally and fewer than ${range} ticks, one full turn, pass between readings.`,
} as const;
