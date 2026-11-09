// Copyright © 2026 Christopher Snow

// Separately drafted; canonical copy: docs/notes/c-integer-types-appendix/prose.md.
export const LABELS = {
  title: "C integer types and register widths",
  line: "Optional reference: compare the widths and readings in three recorded C return values.",
  objectives: [
    "Explain why the recorded long example uses x0 while the int and unsigned examples use w0.",
    "Explain how the int and unsigned examples return the same bits with different readings.",
  ],
  titles: {
    width: "long uses 64 bits on this target",
    readings: "int and unsigned return the same bits here",
  },
  captions: {
    long: "A long return value, with its recorded instructions.",
    int: "An int return value, with its recorded instructions.",
    unsigned: "An unsigned return value, with its recorded instructions.",
  },
} as const;
