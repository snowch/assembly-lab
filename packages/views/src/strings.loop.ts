// Copyright © 2026 Christopher Snow

// Module 5 loop figures. The matching prose is in docs/notes/module-5/prose.md.
export const LOOP_STRINGS = {
  chooseRun: "Choose the inputs to run",
  chart: "Number of dimming operations",
  iterations: (n: number) => `The loop body ran ${n} ${n === 1 ? "time" : "times"}.`,
  partialIterations: (n: number) =>
    `The trace contains ${n} dimming ${n === 1 ? "operation" : "operations"} before the simulator stopped.`,
  history: (register: string) => `${register} after each dimming operation`,
  initial: "Before the first dimming operation",
  iteration: (n: number) => `After dimming operation ${n}`,
  returned: (value: number) => `Returned ${value} in w0.`,
  limited: (steps: number) =>
    `The simulator stopped after ${steps} ${steps === 1 ? "instruction" : "instructions"}. Reaching this limit does not prove that the program runs forever.`,
  noIterations: "The loop body did not run.",
  moreHistory: (n: number) => `${n} more ${n === 1 ? "entry is" : "entries are"} not shown.`,
} as const;
