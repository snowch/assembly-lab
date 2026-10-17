// Copyright © 2026 Christopher Snow

// Module 0's titles, objectives, captions, option labels and field labels. Those that
// docs/notes/module-0/prose.md gives are kept word for word (a section title that holds code has its
// backticks taken out, because the page draws a section's title as plain text). A caption the prose
// file does not give is marked DRAFT, and so is any other label it does not give.

export const LABELS = {
  objectives: [
    "Step through a compiled function one instruction at a time, and say what each instruction changed.",
    "Say where a function's arguments arrive and where its result leaves.",
    "Fix a compiled function so that it returns the right value.",
    "Say what `ret` does, and what happens without it.",
  ],
  titles: {
    question: "What does the processor do?",
    motivation: "Why the instructions matter",
    prediction: "Where a variable is kept",
    investigation: "Stepping through",
    construction: "Fixing fuel_used",
    failureExperiment: "Removing ret",
    explanation: "How a program runs",
    generalisation: "Other functions",
    challenge: "Kilometres to service",
    reflection: "What you now know",
  },
  // The words on the control that opens a section's closed note (docs/notes/module-0/prose.md,
  // section 10: "Answer (closed by default)").
  details: {
    reflection: "Answer",
  },
  captions: {
    listing:
      "The C function and the four instructions GCC made from it. GCC notes, for each instruction, the C line it came from. Each instruction sits beside that line. The line ending in a colon, trip_distance:, is the function's name.",
    stepper:
      "trip_distance(120, 85, 42, 15), one instruction at a time. A register with an outline has just changed. The lit C line and the dark line-number chip mark the instruction that just ran; the arrow marks the next one.",
    // The prose file gives no caption for these figures; these were drafted by Haiku.
    predictTotal: "A prediction about where the processor keeps total.",
    predictNoRet: "A prediction about what w0 holds when the run ends without ret.",
    noRet:
      "trip_distance(120, 85, 42, 15) again, with a switch that deletes ret. In memory, fuel_used comes after trip_distance.",
    fix: "The editor shows the instructions GCC made for fuel_used from the mistaken C.",
    trace: "The five instructions GCC made for km_to_service, and the call to trace.",
  },
  options: {
    total: [
      { value: "w0", label: "In `w0`, in place of `leg1`." },
      { value: "new-place", label: "In a new place of its own." },
      { value: "not-kept", label: "It does not keep it until the function returns." },
      { value: "w3", label: "In `w3`, in place of `detour`." },
    ],
    noRet: [
      { value: "232", label: "232" },
      { value: "147", label: "147" },
      { value: "error", label: "The run stops with an error" },
      { value: "0", label: "0" },
    ],
  },
  challenges: {
    fix: { title: "Fix the subtraction" },
    trace: {
      title: "Trace the call",
      fields: {
        w0: "`w0` when the function returns",
        w1: "`w1` when the function returns",
      },
      // Plain text, for the name of each test in a verdict.
      tests: {
        w0: "w0 when the function returns",
        w1: "w1 when the function returns",
      },
    },
  },
} as const;
