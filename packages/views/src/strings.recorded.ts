// Copyright © 2026 Christopher Snow

// Separately drafted copy for exercises that inspect recorded compiler output.
export const RECORDED_STRINGS = {
  accepted: "The course A64 assembler accepts this line.",
  rejected: "The course A64 assembler rejects this line.",
  token: (value: string) => `The recorded listing contains ${value}.`,
  result: (value: string) => `The A64 simulator returns ${value}.`,
  wrong: "Check the specified listing or run, then try this field again.",
} as const;
