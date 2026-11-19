// Copyright © 2026 Christopher Snow

// Authored functions, not compiler output. Both are checked by the native corpus.
export const TRANSFER_DIFFERENCE = {
  c: "",
  listing: "difference:\n  sub x0, x0, x1\n  ret",
} as const;

export const ADJUSTED_DIFFERENCE = "sub x0, x0, x1\nadd x0, x0, x2\nret";

export const TRANSFER_CASES = [
  ["53", "40", "5"],
  ["4294967350", "40", "5"],
  ["8", "18446744073709551608", "3"],
  ["18446744073709551615", "0", "2"],
  ["40", "40", "0"],
] as const;
