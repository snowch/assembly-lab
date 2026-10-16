// Copyright © 2026 Christopher Snow

// The first lesson of Module 1: its titles, objectives, captions, option labels and field labels.
// Those that docs/notes/module-1/prose.md gives are kept word for word (a section title that holds
// code has its backticks taken out, because the page draws a section's title as plain text). A
// caption the prose file does not give is marked DRAFT, and so is any other label it does not
// give; one-pattern-three-readings.prose.test.ts lists them.

export const LABELS = {
  objectives: [
    "read a register's 32 bits in hexadecimal, and convert hexadecimal back to bits;",
    "read one pattern of bits as an unsigned number and as a signed number;",
    "say what changes, or does not, in the instructions GCC makes when a function's C type changes from `int` to `unsigned`.",
  ],
  titles: {
    question: "Which is right, −12 or 4294967284?",
    motivation: "Why the readings matter",
    prediction: "Adding 12",
    investigation: "Reading the bits",
    construction: "Setting the bits",
    failureExperiment: "The unsigned version",
    explanation: "Bits and readings",
    generalisation: "Every 32-bit pattern",
    challenge: "Three more patterns",
    reflection: "Looking back",
  },
  captions: {
    fuelRun: "fuel_used_wrong(50, 38) as first written; w0 after its subtraction.",
    reader:
      "One register, set bit by bit. The hexadecimal writes the same bits; the unsigned and signed readings each come with their sum.",
    compare: "The two functions side by side, with GCC's listing for each.",
    // The prose file gives no caption for these four figures; Haiku drafted them (16 October 2026).
    predictAdd12:
      "A prediction about what w0 holds after the new instruction runs. The new instruction, add w0, w0, 12, sits before ret in fuel_used_wrong.",
    stepAdd12:
      "fuel_used_wrong(50, 38) again, with add w0, w0, 12 before ret. A register with an outline has just changed.",
    make: "Set each of the 32 bits of w0 with its button, then type one number in the box.",
    read: "Several bit patterns are shown. Type the unsigned reading and the signed reading of each.",
  },
  options: {
    add12: [
      { value: "0", label: "0" },
      { value: "4294967296", label: "4294967296" },
      { value: "24", label: "24" },
      { value: "error", label: "the run stops with an error" },
    ],
    compare: [
      { value: "same", label: "Nothing: the instructions are the same." },
      { value: "other-sub", label: "It uses a different subtraction." },
      { value: "check", label: "It adds a check for a negative answer." },
      { value: "names", label: "It uses different register names." },
    ],
  },
  challenges: {
    make: {
      title: "Make −1",
      fields: {
        bits: "the bits of `w0`",
        unsigned: "its unsigned reading",
      },
    },
    read: {
      title: "Two readings each",
      fields: {
        u1: "unsigned reading of `0x0000002a`",
        s1: "signed reading of `0x0000002a`",
        u2: "unsigned reading of `0x80000000`",
        s2: "signed reading of `0x80000000`",
        u3: "unsigned reading of `0xffffff38`",
        s3: "signed reading of `0xffffff38`",
      },
    },
  },
} as const;
