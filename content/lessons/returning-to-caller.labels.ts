// Copyright © 2026 Christopher Snow

// Separate draft from docs/notes/returning-to-caller/brief.md.
export const RETURNING_LABELS = {
  title: "Returning to the caller",
  objectives: [
    "Follow ret back to an instruction in the caller.",
    "Explain how the caller uses a result held in shared registers.",
  ],
  titles: {
    motivation: "One set of registers",
    investigation: "Follow the return",
    explanation: "Where execution continues",
    challenge: "Return, then use the result",
  },
  captions: {
    figure: "Start inside increment_int, return to the caller, then run its next instruction.",
    challenge: "A fresh argument, followed by the caller’s addition.",
  },
  challenge: {
    title: "Trace the return and the next instruction",
    fields: {
      w0: "`w0` immediately after `ret`",
      w1: "`w1` after the caller’s addition",
    },
  },
} as const;
