// Copyright © 2026 Christopher Snow

import type { Artifact, Challenge } from "@platform/lesson-schema";
import type { Verdict, VerdictFailure } from "@platform/lesson-runtime";
import { fourBitSubtraction } from "./four-bit-arithmetic";
import { VIEW_STRINGS as S, plain } from "./strings";

export const FOUR_BIT_SUBTRACTION = "four-bit-subtraction";

/** Grade the miniature against model-derived patterns, never a stored completion mark. */
export function gradeFourBitSubtraction(challenge: Challenge, artifact: Artifact): Verdict {
  if (challenge.tests.kind !== "answers") throw new Error("Four-bit arithmetic needs answer cases");
  const cases = challenge.tests.cases;
  const answers = { ...challenge.initial.answers, ...artifact.answers };
  const fields = [...new Set(cases.flatMap((c) => Object.keys(c.expect)))];
  const missing = fields.filter((id) => !(answers[id] ?? "").trim());
  if (missing.length)
    return {
      passed: false,
      total: cases.length,
      failures: [],
      blocked: S.answers.unanswered(
        missing
          .map((id) => plain(challenge.fields.find((f) => f.id === id)?.label ?? id))
          .join(", "),
      ),
    };
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const computed = fourBitSubtraction(Number(c.given["a"]), Number(c.given["b"]));
    const expected: Record<string, string> = {
      negated: computed.negation.after.pattern,
      result: computed.result.pattern,
      carry: "discard",
    };
    for (const [field, query] of Object.entries(c.expect)) {
      const want = expected[String(query)];
      if (want === undefined) throw new Error("Unknown four-bit answer query");
      const value = (answers[field] ?? "").replace(/\s/g, "");
      if (value !== want)
        failures.push({
          index,
          label: plain(c.label),
          inputs: {},
          actual: {},
          expected: {},
          detail: plain(String(c.given[`feedback.${field}`] ?? "")),
        });
    }
  });
  return { passed: failures.length === 0, total: cases.length, failures };
}
