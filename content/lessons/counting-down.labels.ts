// Copyright © 2026 Christopher Snow

// Lesson 2 of Module 5. Kept word for word in docs/notes/module-5/prose.md.
export const LABELS = {
  title: "Counting down, and knowing when to stop",
  objectives: [
    "use the flags from subtraction to control a countdown;",
    "explain what changes when the loop tests after its body;",
    "write a loop that stops when no useful work remains.",
  ],
  titles: {
    question: "Where does the loop get its flags?",
    motivation: "Counting down to zero",
    prediction: "Count the dimming operations",
    investigation: "Let subs test the remaining count",
    construction: "Write the countdown",
    failureExperiment: "Start a do loop with zero ticks",
    explanation: "Testing before or after the body",
    generalisation: "Why unsigned counts cannot go below zero",
    challenge: "Stop when the display is dark",
    reflection: "What you now know",
  },
  captions: {
    listing: "dim_down in C and the instructions GCC made from it.",
    predict: "Predict how many dimming operations dim_down(128, 3) runs.",
    step: "Follow the countdown, the brightness and the flags one instruction at a time.",
    runs: "Choose a tick count and follow the resulting loop.",
    write: "Write and test a loop that counts down to zero.",
    predictFailure: "Predict whether dim_do(128, 0) returns within the trace limit.",
    stepDoZero:
      "Step through dim_do with a zero tick count and inspect the brightness, remaining count and flags.",
    failureRuns: "Follow the beginning of dim_do with a zero tick count.",
    stepWrong:
      "Step through a course-written loop and inspect the count and flags after subs and cmp.",
    wrong: "A course-written loop that compares an unsigned count with zero after subtracting.",
    wrongCompiler: "dim_wrong in C and GCC's recorded output.",
    final: "Write a loop that stops when either the tick count or the brightness reaches zero.",
  },
  doRun: "dim_do(128, 0)",
  wrongRun: "dim_down_wrong(128, 3)",
  runs: ["dim_down(128, 0)", "dim_down(128, 1)", "dim_down(128, 3)"],
  options: {
    prediction: [
      { value: "0", label: "0" },
      { value: "1", label: "1" },
      { value: "3", label: "3" },
      { value: "4", label: "4" },
    ],
    failure: [
      { value: "returned", label: "The function returns within the trace." },
      { value: "limit", label: "The simulator reaches its instruction limit." },
    ],
  },
  challenges: {
    write: {
      title: "Write dim_down",
      tests: [
        "dim_down(128, 0)",
        "dim_down(128, 1)",
        "dim_down(128, 3)",
        "dim_down(0, 3)",
        "dim_down(0xffffffff, 31)",
        "dim_down(0xffffffff, 32)",
      ],
    },
    final: {
      title: "Write dim_until_dark",
      tests: [
        "dim_until_dark(128, 0)",
        "dim_until_dark(128, 3)",
        "dim_until_dark(0, 0xffffffff)",
        "dim_until_dark(1, 0xffffffff)",
        "dim_until_dark(0xffffffff, 0xffffffff)",
        "dim_until_dark(0xffffffff, 31)",
      ],
    },
  },
} as const;
