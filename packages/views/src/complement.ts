// Copyright © 2026 Christopher Snow

// Four-bit explanatory patterns, read through the same simulated register as
// the 32-bit reader. Padding with zeros preserves the unsigned value; repeating
// the highest bit gives the equivalent 32-bit two’s complement signed value.
// This is a small representation model, not a four-bit Arm processor.
import { readingsOfPattern, readingsOfValue, patternOf } from "./readings";

export function fourBitReadings(pattern: string) {
  if (!/^[01]{4}$/.test(pattern)) throw new Error("A four-bit pattern is required.");
  const unsigned = readingsOfPattern(pattern.padStart(32, "0")).unsigned;
  const signed = readingsOfPattern(pattern.padStart(32, pattern[0]!)).signed;
  const places = [...pattern].map((bit, index) => {
    const single = "0000".split("");
    single[index] = "1";
    const bits = single.join("");
    const unsignedWeight = readingsOfPattern(bits.padStart(32, "0")).unsigned;
    const signedWeight = readingsOfPattern(bits.padStart(32, bits[0]!)).signed;
    return {
      index: 3 - index,
      set: bit === "1",
      unsignedWeight,
      signedWeight,
      unsigned: bit === "1" ? unsignedWeight : 0,
      signed: bit === "1" ? signedWeight : 0,
    };
  });
  return { pattern, unsigned, signed, places };
}

export const FOUR_BIT_LIMITS = {
  unsignedMin: fourBitReadings("0000").unsigned,
  unsignedMax: fourBitReadings("1111").unsigned,
  signedMin: fourBitReadings("1000").signed,
  signedMax: fourBitReadings("0111").signed,
};

export function fourBitNegation(pattern: string) {
  const before = fourBitReadings(pattern);
  const inverted = fourBitReadings([...pattern].map((bit) => (bit === "1" ? "0" : "1")).join(""));
  const fullSum = readingsOfValue(inverted.unsigned + 1).unsigned;
  const after = fourBitReadings(patternOf(fullSum).slice(-4));
  return {
    before,
    inverted,
    fullSum,
    fullPattern: fullSum.toString(2).padStart(4, "0"),
    after,
    discarded: fullSum > FOUR_BIT_LIMITS.unsignedMax,
    outsideSignedRange: -before.signed > FOUR_BIT_LIMITS.signedMax,
  };
}
