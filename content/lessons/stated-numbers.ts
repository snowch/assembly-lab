// Copyright © 2026 Christopher Snow

// For the facts tests: the numbers a lesson's words state, found in its text, so a test can hold
// each to what the model produced. Hexadecimal numbers are found first and kept as written (lower
// case), then groups of eight binary digits written as `0010 1010`, then every other number once
// names such as `w0`, `-O1` and `halve_count` have been taken out of the text.

export interface StatedNumbers {
  /** Hexadecimal numbers as written, lower case: `0x2a`. */
  readonly hex: readonly string[];
  /** Groups of binary digits, written as `0010 1010`. */
  readonly binary: readonly string[];
  /** Every other number: a minus sign is not part of it (`-5` gives 5). */
  readonly decimal: readonly number[];
}

export function statedNumbers(texts: readonly string[]): StatedNumbers {
  let text = texts.join("\n").replace(/−/g, "-");
  const hex = [...text.matchAll(/\b0x[0-9a-f]+\b/gi)].map((m) => m[0].toLowerCase());
  text = text.replace(/\b0x[0-9a-f]+\b/gi, " ");
  const binary = [...text.matchAll(/\b[01]{4} [01]{4}\b/g)].map((m) => m[0]);
  text = text.replace(/\b[01]{4} [01]{4}\b/g, " ");
  // Names such as w0, leg1 and -O1 hold digits that are not numbers.
  text = text.replace(/[A-Za-z_][A-Za-z_0-9]*/g, " ");
  const decimal = [...text.matchAll(/\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
  return { hex, binary, decimal };
}

/** A word as the lessons write it in hexadecimal. */
export const hexOf = (value: bigint | number): string =>
  `0x${BigInt.asUintN(32, BigInt(value)).toString(16)}`;
