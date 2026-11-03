// Copyright © 2026 Christopher Snow

import { z } from "zod";
import { fourBitReadings } from "./complement";
import { patternOf, readingsOfPattern, shown, wholeNumber } from "./readings";

export const READING_EXAMPLES = {
  before: fourBitReadings("0011"),
  set: fourBitReadings("1011"),
  practice: fourBitReadings("1001"),
  bridge: readingsOfPattern(patternOf(1n << 31n)),
  transfer: readingsOfPattern(patternOf((1n << 31n) | 2n)),
  cleared: readingsOfPattern(patternOf(2)),
};
export const ReadingAttempt = z.object({
  unsigned: z.string(),
  signed: z.string(),
  reason: z.string(),
  cleared: z.string().default(""),
  submitted: z.boolean(),
});
export type ReadingAttempt = z.infer<typeof ReadingAttempt>;
export const EMPTY_READING_ATTEMPT: ReadingAttempt = {
  unsigned: "",
  signed: "",
  reason: "",
  cleared: "",
  submitted: false,
};
export function readingAttempt(raw: unknown): ReadingAttempt {
  const parsed = ReadingAttempt.safeParse(raw);
  return parsed.success ? parsed.data : EMPTY_READING_ATTEMPT;
}
export function validReadingAttempt(attempt: ReadingAttempt, stage: "practice" | "transfer") {
  return (
    wholeNumber(attempt.unsigned) !== null &&
    wholeNumber(attempt.signed) !== null &&
    attempt.reason.trim() !== "" &&
    (stage === "practice" || attempt.cleared.trim() !== "")
  );
}
export function correctReadings(attempt: ReadingAttempt, stage: "practice" | "transfer") {
  const expected = READING_EXAMPLES[stage];
  return (
    wholeNumber(attempt.unsigned) === BigInt(expected.unsigned) &&
    wholeNumber(attempt.signed) === BigInt(expected.signed)
  );
}
export const groupedReading = (value: number) => shown(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export function smallReadingSum(
  readings: ReturnType<typeof fourBitReadings>,
  way: "unsigned" | "signed",
) {
  return (
    readings.places
      .map((place, i) => {
        const value = place[way];
        return i === 0 ? shown(value) : value < 0 ? ` − ${shown(-value)}` : ` + ${shown(value)}`;
      })
      .join("") + ` = ${shown(readings[way])}`
  );
}
