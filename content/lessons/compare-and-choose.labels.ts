// Copyright © 2026 Christopher Snow

// Lesson 1 of Module 4: the titles, objectives, captions, option labels and field labels.
// docs/notes/module-4/prose.md gives the objectives, the ten titles, the options, the captions of the
// figures it names and the field labels, kept word for word (a title or caption that holds code has
// its backticks taken out, because the page draws those as plain text). A caption or label the file
// does not give is marked DRAFT, and so is the name of each test in a verdict;
// module-4.prose.test.ts lists the marks.

export const LABELS = {
  objectives: [
    "say what `cmp` leaves behind, and which flags each condition reads;",
    "tell the signed conditions from the unsigned ones;",
    "build `less_fuel` from `cmp` and `csel`.",
  ],
  titles: {
    question: "What does GCC change for unsigned?",
    motivation: "Why a decision needs the flags",
    prediction: "Predict the change in steeper_u",
    investigation: "What the last operand of csel asks",
    construction: "Choosing the smaller of two values",
    failureExperiment: "Running steeper_u with ge",
    explanation: "What each condition reads",
    generalisation: "What GCC does for a yes or no answer",
    challenge: "Read four conditions after one cmp",
    reflection: "What you now know",
  },
  captions: {
    runs: "The C of both functions, steeper_s's three instructions, and what each function returns for 0xffffffff and 1.",
    predictChange: "A prediction about what GCC changes in steeper_s to make steeper_u.",
    diff: "steeper_s and steeper_u side by side; the one operand that differs is marked.",
    lessFuel: "The assembly editor, starting from a function that is only ret.",
    // DRAFT
    stepOwn:
      "Your less_fuel, stepped on the test you choose, with the stages of its compare and select.",
    predictGe: "A prediction about what steeper_u returns once its last operand is ge.",
    stepGe:
      "steeper_u with ge in place of cs, on 0x80000000 and 1, with the flags under the registers. An outline marks a register that the instruction wrote, or a flag whose value changed.",
    conditions:
      "Two values you choose, the flags cmp leaves, and each condition beside whether it holds.",
    holds: "The compare, and four conditions to read from the flags it leaves.",
  },
  options: {
    change: [
      { value: "cmp:instruction", label: "`cmp` becomes an instruction made for unsigned values." },
      { value: "cmp:operands", label: "The operands of `cmp` change." },
      { value: "csel:last", label: "Only the last operand of `csel` changes." },
      { value: "csel:instruction", label: "`csel` becomes a different instruction." },
    ],
    ge: [
      { value: "2147483648", label: "`2147483648`" },
      { value: "1", label: "`1`" },
      { value: "0", label: "`0`" },
      { value: "error", label: "the run stops with an error" },
    ],
  },
  challenges: {
    lessFuel: {
      title: "Write less_fuel",
      // The names of the calls, as Module 2's challenge names its own: calls, not sentences.
      tests: [
        "less_fuel(3, 7)",
        "less_fuel(7, 3)",
        "less_fuel(5, 5)",
        "less_fuel(0x80000000, 1)",
        "less_fuel(1, 0x80000000)",
      ],
    },
    holds: {
      title: "Read four conditions after one cmp",
      fields: {
        ge: "`ge`",
        cs: "`cs`",
        lt: "`lt`",
        cc: "`cc`",
      },
      // Plain text, for the name of each test in a verdict.
      tests: {
        ge: "Whether ge holds",
        cs: "Whether cs holds",
        lt: "Whether lt holds",
        cc: "Whether cc holds",
      },
    },
  },
} as const;
