// Copyright © 2026 Christopher Snow

// Synthesis titles, captions and control labels. Canonical copy: docs/notes/module-0/prose.md.

import { SYNTHESIS_COPY } from "./fundamentals.prose";

export const LABELS = {
  objectives: SYNTHESIS_COPY.objectives,
  titles: {
    investigation: "Trace trip_distance",
    failureExperiment: "Removing ret",
    challenge: "Kilometres to service",
  },
  captions: {
    stepper: "trip_distance(120, 85, 42, 15), from incoming arguments to the returned result.",
    predictNoRet: "A prediction about what w0 holds when the run ends without ret.",
    noRet:
      "trip_distance(120, 85, 42, 15) again, with a switch that deletes ret. In memory, fuel_used comes after trip_distance.",
    trace: "The five instructions GCC made for km_to_service, and the call to trace.",
  },
  options: {
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
