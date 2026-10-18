// Copyright © 2026 Christopher Snow
import type { Verdict, VerdictFailure } from "@platform/lesson-runtime";
import type { Artifact, Challenge } from "@platform/lesson-schema";
import { COMPILER_DIAGNOSTICS } from "../../compiler/src/strings";
import { stopSentence } from "./messages";
import { runC } from "./compilerRun";
import { COMPILER_STRINGS as C } from "./strings.compiler";
export const RUN_C = "run-c";
export function gradeC(challenge: Challenge, artifact: Artifact): Verdict {
  if (challenge.tests.kind !== "answers") throw Error("C challenges require answer cases");
  const cases = challenge.tests.cases,
    total = cases.length,
    source = artifact.text ?? challenge.initial.text ?? "";
  if (source.trim() === "") return { passed: false, total, failures: [], blocked: C.grader.empty };
  const failures: VerdictFailure[] = [];
  for (const [index, test] of cases.entries()) {
    const args: number[] = [];
    for (let i = 0; test.given[`w${i}`] !== undefined; i++) args.push(Number(test.given[`w${i}`]));
    const result = runC(source, args),
      inputs = Object.fromEntries(args.map((n, i) => [`w${i}`, String(n)]));
    if (!result.ok) {
      const detail =
        result.diagnostics
          .map((d) => C.playground.diagnostic(d.line, d.column, COMPILER_DIAGNOSTICS[d.code]))
          .join("\n") ||
        (result.stage === "machine"
          ? (stopSentence(result.stop) ?? C.playground.machineFailed)
          : C.grader.undefinedRun);
      if (result.stage === "compile")
        return { passed: false, total, failures: [], blocked: detail };
      failures.push({ index, label: test.label, inputs, actual: {}, expected: {}, detail });
      continue;
    }
    const expected = Number(test.expect["w0"]);
    if (result.value !== expected)
      failures.push({
        index,
        label: test.label,
        inputs,
        actual: { w0: String(result.value) },
        expected: { w0: String(expected) },
      });
  }
  return { passed: failures.length === 0, total, failures };
}
