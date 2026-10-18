// Copyright © 2026 Christopher Snow

import type { Artifact, Challenge } from "@platform/lesson-schema";
import type { Verdict, VerdictFailure } from "@platform/lesson-runtime";
import { z } from "zod";
import { RecordedQuerySchema, recordedAnswer } from "./recorded";
import { VIEW_STRINGS as S, plain } from "./strings";
import { RECORDED_STRINGS as R } from "./strings.recorded";

export const RECORDED_TOKENS = "recorded-tokens";
const normal = (value: string) => value.replaceAll("`", "").trim().toLowerCase();
export function gradeRecorded(challenge: Challenge, artifact: Artifact): Verdict {
  if (challenge.tests.kind !== "answers") throw new Error("Recorded queries require answer cases");
  const queries = z
    .record(z.string(), RecordedQuerySchema)
    .parse(challenge.initial.data?.["queries"]);
  const answers = { ...challenge.initial.answers, ...artifact.answers },
    cases = challenge.tests.cases;
  const fields = [...new Set(cases.flatMap((c) => Object.keys(c.expect)))];
  const missing = fields.filter((field) => !normal(answers[field] ?? ""));
  if (missing.length)
    return {
      passed: false,
      total: cases.length,
      failures: [],
      blocked: S.answers.unanswered(
        missing
          .map((id) => plain(challenge.fields.find((field) => field.id === id)?.label ?? id))
          .join(", "),
      ),
    };
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    for (const [field, key] of Object.entries(c.expect)) {
      const query = queries[String(key)];
      if (!query) throw new Error("Missing recorded query");
      const expected = recordedAnswer(query);
      if (normal(answers[field] ?? "") !== normal(expected))
        failures.push({
          index,
          label: plain(c.label),
          inputs: {},
          actual: {},
          expected: {},
          detail: String(c.given[`feedback.${field}`] ?? R.wrong),
        });
    }
  });
  return { passed: failures.length === 0, total: cases.length, failures };
}
