// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-12/prose.md.
export const LABELS = {
  title: "Debug instructions and choose an execution environment",
  objectives: [
    "compare native instruction stops with the browser model;",
    "find the first differing result in a controlled bug;",
    "run a standalone Linux assembly program.",
  ],
  titles: {
    question: "Where does the native calculation first go wrong?",
    motivation: "Stop the live process with GDB",
    prediction: "Execute one instruction",
    investigation: "Compare registers and the next instruction",
    construction: "Finish and close the debugging session",
    failureExperiment: "Locate the first differing stop",
    explanation: "Request a Linux service",
    generalisation: "Start without the C runtime",
    challenge: "Apply the correction twice",
    reflection: "What you now know",
  },
  captions: {
    predict: "Predict the low 32 bits after the first addition.",
    trace: "Compare a browser-model stop with the recorded GDB stop.",
    step: "Step the familiar arithmetic function.",
    predictFailure: "Identify the first differing arithmetic result.",
    stepFailure:
      "Compare recorded and modelled stops for the modified function. Use the original figure above to find where their results diverge from the original function.",
    final: "Check the revised function with the same contract in both environments.",
  },
  options: {
    prediction: [
      {
        value: "120",
        label: "120",
      },
      {
        value: "205",
        label: "205",
      },
      {
        value: "247",
        label: "247",
      },
    ],
    failure: [
      {
        value: "1",
        label: "After the first arithmetic instruction",
      },
      {
        value: "2",
        label: "After the second arithmetic instruction",
      },
      {
        value: "3",
        label: "After the third arithmetic instruction",
      },
    ],
  },
  challenges: {
    final: {
      title: "Subtract the correction twice",
      tests: [
        "Apply both trip corrections",
        "Use a different set of distances",
        "Handle all zero inputs",
        "Return a negative corrected value",
      ],
    },
  },
  native: {
    recorded: "Recorded GNU/QEMU/GDB run",
    browser: "Browser model",
    next: "Next instruction",
    ran: "Instruction just executed",
    before: "At the function breakpoint",
    after: "After the instruction",
    notLive: "This page steps a recording. Use GDB in your terminal to inspect a live process.",
    pcOffset: "PC relative to the function entry",
    returned: "Returned to the C caller",
    good: "Original function",
    broken: "Modified third instruction",
    sources: "Source files",
    objects: "Object files",
    link: "Linked ELF executable",
    execute: "QEMU user mode",
    process: "Running Linux process",
    copy: "Copy commands",
    copied: "Commands copied",
    pipeline: [
      {
        name: "Source",
        detail: "main.c and trip_distance.s",
      },
      {
        name: "Object files",
        detail: "GCC compiles C; GNU as assembles instructions",
      },
      {
        name: "Link",
        detail: "GNU tools join the function with startup code and the C library",
      },
      {
        name: "Executable file",
        detail: "The trip file contains machine code and loading information",
      },
      {
        name: "QEMU user mode",
        detail: "Emulates AArch64 instructions and forwards Linux requests",
      },
      {
        name: "Running program",
        detail: "Instructions execute using registers and memory",
      },
    ],
    model: "Browser model",
    stepEntries: [
      "At the function breakpoint",
      "After the first addition",
      "After the second addition",
      "After the third arithmetic instruction",
      "After returning to the C caller",
    ],
    previous: "Previous stop",
    nextStop: "Next stop",
    reset: "Reset comparison",
    correct: "Original function",
    registers: "Register values at this stop",
    returnToMain: "Returned to the C caller",
    recordedNote:
      "The native values are the low 32 bits of the recorded x registers. The browser values come from its instruction model.",
    stops: [
      "At the function breakpoint",
      "After the first addition",
      "After the second addition",
      "After the third arithmetic instruction",
      "After returning to the C caller",
    ],
    pc: "Program counter relative to trip_distance",
    referenceRun: "Reference run",
    referenceEnvironment: "Reference environment",
    versions: "Tool versions",
  },
} as const;
