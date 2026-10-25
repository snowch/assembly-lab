// Copyright © 2026 Christopher Snow

// Canonical copy: docs/notes/fundamentals/prose.md.
export const FUNDAMENTALS_LABELS = {
  addition: {
    title: "One addition",
    objectives: [
      "Identify an addition's inputs and destination.",
      "Work out which register an addition writes and which registers keep their values.",
    ],
    titles: {
      question: "One operation",
      motivation: "Registers and instructions",
      prediction: "Reading add",
      investigation: "Run one addition",
      construction: "Identify the destination",
      failureExperiment: "Reading keeps the input",
      explanation: "Inputs and result",
      generalisation: "A different destination",
      challenge: "Trace a new addition",
    },
    captions: {
      figure: "Press Run the instruction to see the result written to w2.",
      challenge: "A new addition to trace without running it.",
    },
    challenge: {
      title: "Follow the operands",
      fields: { w1: "`w1` after the instruction", w0: "`w0` after the instruction" },
      tests: { w1: "w1 after the instruction", w0: "w0 after the instruction" },
    },
  },
  function: {
    title: "A tiny function",
    objectives: [
      "Follow an integer argument into a function and its result back to the caller.",
      "Explain how preparing a result differs from returning to the caller.",
    ],
    titles: {
      question: "Return an increased value",
      motivation: "A function and its listing",
      prediction: "Preparing the result",
      investigation: "Follow the call",
      construction: "Argument to result",
      failureExperiment: "Ready to return",
      explanation: "What ret does",
      generalisation: "Calling rules and operand rules",
      challenge: "A different argument",
      reflection: "Calculation and return",
    },
    captions: {
      figure: "The complete increment_int function and its caller, one instruction at a time.",
      challenge: "The same function called with a new argument.",
    },
    challenge: {
      title: "Trace increment_int",
      fields: { w0: "Value received by the caller" },
      tests: { w0: "Value received by the caller" },
    },
  },
  subtraction: {
    title: "Subtraction and reuse",
    objectives: [
      "Trace an instruction that reads and writes the same register.",
      "Subtract the third operand from the second and identify the destination.",
    ],
    titles: {
      question: "Read, then replace",
      motivation: "One register in two roles",
      prediction: "Reuse in addition",
      investigation: "Subtraction",
      construction: "Read the subtraction",
      failureExperiment: "Input order matters",
      explanation: "Old value and new value",
      generalisation: "The shared operand rule",
      challenge: "Subtract with new inputs",
      reflection: "Track the old value",
    },
    captions: {
      figure: "An addition that reads w0 and writes its result there.",
      secondFigure: "A separate subtraction with its own starting inputs.",
      challenge: "A fresh subtraction to trace without running it.",
    },
    challenge: {
      title: "Follow the subtraction",
      fields: { w1: "`w1` after the instruction", w0: "`w0` after the instruction" },
      tests: { w1: "w1 after the instruction", w0: "w0 after the instruction" },
    },
  },
  sequence: {
    title: "Instructions in sequence",
    objectives: [
      "Follow register values from one instruction to the next.",
      "Explain what the next-instruction marker represents.",
    ],
    titles: {
      question: "Use the previous result",
      motivation: "One changing state",
      prediction: "Find the connection",
      investigation: "Follow the marker",
      construction: "Pause between instructions",
      failureExperiment: "Keep the intermediate result",
      explanation: "Values and position",
      generalisation: "Continue or return",
      challenge: "Trace both instructions",
      reflection: "Follow the state",
    },
    captions: {
      figure: "Two instructions sharing one set of registers.",
      challenge: "The same sequence with fresh starting values.",
    },
    challenge: {
      title: "Use the previous result",
      fields: { w2: "`w2` after both instructions", w1: "`w1` after both instructions" },
      tests: { w2: "w2 after both instructions", w1: "w1 after both instructions" },
    },
  },
} as const;
