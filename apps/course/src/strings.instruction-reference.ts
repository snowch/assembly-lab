// Copyright © 2026 Christopher Snow

/** Quick lookup beside the exercise; instruction facts live in the checked catalog. */
export const REFERENCE_STRINGS = {
  button: "Reference",
  title: "Instruction reference",
  close: "Close",
  search: "Search instructions",
  searchPlaceholder: "Instruction name or operation",
  scope: "Show instructions",
  allowedHere: "Allowed here",
  allInstructions: "All browser instructions",
  exercise: "Exercise",
  scopeNote:
    "These forms work in the browser simulator. Each exercise still limits which instructions you can use.",
  noExercise: "No assembly exercise is selected on this page.",
  noResults: "No instructions match your search in this list.",
  notation: "Reading the syntax",
  syntax: "Syntax",
  rules: "Operand rules",
  flags: "Flags",
  examples: "Examples",
  official: "Arm reference",
  unavailable: "Not allowed in this exercise.",
  shown: (count: number) => `${count} ${count === 1 ? "instruction" : "instructions"}`,
  context: (title: string) => `Exercise: ${title}`,
} as const;

export const THEME_TITLE = (label: string): string => `Theme: ${label}`;
