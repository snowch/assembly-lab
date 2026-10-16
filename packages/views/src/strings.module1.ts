// Copyright © 2026 Christopher Snow

// The words Module 1's code fixes add to the figures (the 16-bit halves of a register). They are in
// a file of their own so that the modules built beside this one do not all edit strings.ts. Each
// string is marked DRAFT until it has been through the prose process (Haiku drafts, the facts are
// checked); a test counts the marks, so a new one is a decision somebody sees.

export const MODULE1_STRINGS = {
  register: {
    // DRAFT
    upperHalf: "Upper half",
    // DRAFT
    lowerHalf: "Lower half",
  },
} as const;
