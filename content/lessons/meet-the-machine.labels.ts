// Copyright © 2026 Christopher Snow

// Module 0's titles, objectives, captions, option labels and field labels. Those that
// docs/notes/module-0/prose.md gives are kept word for word (a section title that holds code has its
// backticks taken out, because the page draws a section's title as plain text). A caption the prose
// file does not give is marked DRAFT, and so is any other label it does not give.

import { SYNTHESIS_COPY } from "./fundamentals.prose";

export const LABELS = {
  objectives: SYNTHESIS_COPY.objectives,
  titles: {
    question: "What does the processor do?",
    motivation: SYNTHESIS_COPY.motivationTitle,
    prediction: "Connect the operations to a function",
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
      "The four instructions GCC made from trip_distance, paired with their related C statements. The line ending in a colon, trip_distance:, is the function's name.",
    stepper:
      "trip_distance(120, 85, 42, 15), one instruction at a time. A register with an outline was written by the last instruction. The highlighted C statement and instruction show what just ran; the arrow marks the next instruction.",
    // DRAFT
    argRegisters:
      "The four C parameters and the registers they arrive in; the first instruction follows.",
    predictTotal: "A prediction about where total is kept after the first instruction runs.",
    // The prose file gives no caption for these figures; these were drafted by Haiku.
    predictNoRet: "A prediction about what w0 holds when the run ends without ret.",
    noRet:
      "trip_distance(120, 85, 42, 15) again, with a switch that deletes ret. In memory, fuel_used comes after trip_distance.",
    fix: "The editor shows the instructions GCC made for fuel_used from the mistaken C.",
    trace: "The five instructions GCC made for km_to_service, and the call to trace.",
  },
  options: {
    total: [
      { value: "w0", label: "In `w0`, which now holds `leg1 + leg2`." },
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
  // The button that commits the ret experiment's prediction: a discovery experiment, not a recall
  // question, so its action promises the run's result rather than a verdict (docs/notes/module-0/
  // prose.md, section 6: "See what happens").
  commit: {
    noRet: "See what happens",
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
