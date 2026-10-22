// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-12/prose.md.
export const LABELS = {
  title: "Build and boot an assembly program",
  objectives: [
    "assemble and link an ARM64 boot image without C;",
    "explain loading, the entry point, stack setup and storage initialisation;",
    "run a bare-metal trip check through the serial device.",
  ],
  titles: {
    question: "What runs before the trip function?",
    motivation: "Source, tools and the emulated machine",
    prediction: "Predict the function result",
    investigation: "Assemble and place the boot image",
    construction: "Boot the assembly program",
    failureExperiment: "Buildable code with a wrong calculation",
    explanation: "Prepare the machine and send bytes",
    generalisation: "Loading, entry and firmware",
    challenge: "Repair the boot image’s trip function",
    reflection: "What you now know",
  },
  captions: {
    listing: "The handwritten trip function used by the boot image.",
    pipeline: "Follow the files from assembly source through linking to the emulated machine.",
    predict: "Predict the result for the four labelled inputs.",
    step: "Follow the assembly function in the browser model.",
    predictFailure: "Predict the modified function before inspecting its output.",
    stepFailure: "Find the arithmetic effect of the changed instruction.",
    final: "Repair the function, then rebuild the boot image.",
  },
  options: {
    prediction: [
      {
        value: "232",
        label: "232",
      },
      {
        value: "247",
        label: "247",
      },
      {
        value: "262",
        label: "262",
      },
    ],
    failure: [
      {
        value: "232",
        label: "232",
      },
      {
        value: "247",
        label: "247",
      },
      {
        value: "262",
        label: "262",
      },
    ],
  },
  challenges: {
    final: {
      title: "Repair trip_distance",
      tests: [
        "Subtract the trip correction",
        "Use a different set of distances",
        "Handle zero distances and correction",
        "Subtract a correction from zero",
      ],
    },
  },
} as const;
