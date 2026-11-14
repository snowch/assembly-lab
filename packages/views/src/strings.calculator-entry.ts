// Copyright © 2026 Christopher Snow

// Separate drafting pass from docs/notes/calculator-prefix-entry/brief.md.
export const CALCULATOR_ENTRY = {
  notationHint:
    "Decimal by default. Use 0x for hex or 0b for binary (0 and 1). Prefixes ignore case. Spaces, commas and underscores may separate digits.",
  widthHelp:
    "Short hex and binary patterns get upper zeros, even with Signed selected. Oversized entries are rejected. Entry never changes Width or discards bits. Width buttons keep the loaded A’s low bits when narrowing and add upper zeros when widening.",
  notationError:
    "Enter decimal, hex digits after 0x, or binary digits after 0b. Use a minus sign only with decimal.",
  binaryError: "After 0b, use only binary digits: 0 or 1.",
  patternRangeError: (width: number) =>
    `This pattern needs more than ${width} bits. Width is unchanged and no bits were discarded.`,
  decimalRangeError: (min: string, max: string) =>
    `Enter a whole decimal number from ${min} to ${max}.`,
} as const;
