// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-12/prose.md.
export const LABELS = {
  title: "Follow startup and debug the boot image",
  objectives: [
    "inspect the entry point, prepared stack and zeroed storage in GDB;",
    "compare booted instruction stops with the browser model;",
    "locate a wrong result and check a revised assembly function.",
  ],
  titles: {
    question: "Where does the booted calculation first go wrong?",
    motivation: "Stop startup with GDB",
    prediction: "Execute one instruction",
    investigation: "Compare registers and the next instruction",
    construction: "Inspect the saved result and close the session",
    failureExperiment: "Locate the first differing stop",
    explanation: "Separate loading, startup and calculation",
    generalisation: "Check the environment’s entry conditions",
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
    final: "Check the revised function in the browser and a bootable assembly test image.",
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
    notLive:
      "This page steps a recording. Use GDB in your terminal to inspect the machine you boot.",
    pcOffset: "PC relative to the function entry",
    returned: "Returned to the assembly caller",
    good: "Original function",
    broken: "Modified third instruction",
    sources: "Source files",
    objects: "Object files",
    link: "Linked ELF executable",
    execute: "QEMU system mode",
    process: "Booted bare-metal program",
    copy: "Copy commands",
    copied: "Commands copied",
    pipeline: [
      {
        name: "Assembly sources",
        detail: "boot.s supplies startup and output; trip_distance.s supplies the calculation",
      },
      {
        name: "Object files",
        detail: "GNU as translates each source file into machine code and references",
      },
      {
        name: "Linker and memory layout",
        detail: "GNU ld joins the objects using boot.ld and chooses _start as the entry",
      },
      {
        name: "ELF boot image",
        detail: "boot.elf contains code, data and segment loading information",
      },
      {
        name: "QEMU direct ELF load",
        detail: "QEMU loads the segments into RAM and starts at the recorded ELF entry",
      },
      {
        name: "Startup and the program",
        detail:
          "Startup prepares the stack and storage; the caller checks the trip and writes UART bytes",
      },
    ],
    model: "Browser model",
    stepEntries: [
      "At the function breakpoint",
      "After the first addition",
      "After the second addition",
      "After the third arithmetic instruction",
      "After returning to the assembly caller",
    ],
    previous: "Previous stop",
    nextStop: "Next stop",
    reset: "Reset comparison",
    correct: "Original function",
    registers: "Register values at this stop",
    returnToMain: "Returned to the assembly caller",
    recordedNote:
      "The native values are the low 32 bits of the recorded x registers. The browser values come from its instruction model.",
    stops: [
      "At the function breakpoint",
      "After the first addition",
      "After the second addition",
      "After the third arithmetic instruction",
      "After returning to the assembly caller",
    ],
    pc: "Program counter relative to trip_distance",
    referenceRun: "Reference run",
    referenceEnvironment: "Reference environment",
    versions: "Tool versions",
    boot: {
      title: "Recorded loading and startup",
      recordedNote:
        "These states were recorded with GNU tools, QEMU and GDB, a debugger that inspects a running machine and controls when it stops. At the entry stop, the verifier deliberately wrote 0xa5a5a5a5 to result with GDB. Startup then cleared it. The marker demonstrates the zeroing loop; it is not a claim that QEMU left uninitialised garbage. The diagram is a recording, not a machine running in this page.",
      pc: "Next instruction address (PC)",
      sp: "Stack pointer (SP)",
      result: "Stored result (32-bit word)",
      memory: "Selected address ranges on QEMU virt",
      rangeNote:
        "Ranges are ordered by address and are not drawn to scale. Each end address is exclusive. The code range contains instructions; the image also includes message bytes and initialised data.",
      stops: [
        "At _start, after GDB writes the test marker",
        "At boot_ready, after stack setup and storage clearing",
        "At halt, after saving the trip result and sending its report",
      ],
      regions: {
        code: "Program instructions in RAM",
        bss: "Zero-initialised result storage",
        stack: "Reserved stack space",
        uart: "PL011 UART device registers",
      },
    },
  },
} as const;
