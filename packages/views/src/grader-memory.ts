// Copyright © 2026 Christopher Snow

// Written memory exercises use the usual register verdict, with exact 64-bit comparisons and an
// optional comparison of every fixture byte. Comparing the whole fixture catches wider stores
// that accidentally overwrite neighbouring fields.
import { DATA_BASE, TEXT_BASE, assemble, run } from "@al/machine";
import type { Artifact, Challenge } from "@platform/lesson-schema";
import type { Verdict, VerdictFailure } from "@platform/lesson-runtime";
import { argumentsGiven, hasMemoryDirective, machineArgs, memoryBytes, withMemory } from "./call";
import { introducedOf } from "./interactives/props";
import { errorSentence, stopSentence } from "./messages";
import { VIEW_STRINGS as S, quoted } from "./strings";
import { MEMORY_RUNTIME_STRINGS } from "./strings.memory-runtime";

type Case = Extract<Challenge["tests"], { kind: "answers" }>["cases"][number];

export function needsMemoryGrader(cases: readonly Case[]): boolean {
  return cases.some((c) =>
    [...Object.keys(c.given), ...Object.keys(c.expect)].some(
      (name) => name === "memory" || /^x\d+$/.test(name),
    ),
  );
}

export function gradeMemoryWritten(challenge: Challenge, artifact: Artifact): Verdict {
  if (challenge.tests.kind !== "answers")
    throw new Error("A written challenge needs answer tests.");
  const { cases } = challenge.tests;
  const text = artifact.text ?? challenge.initial.text ?? "";
  if (text.trim() === "")
    return { passed: false, total: cases.length, failures: [], blocked: S.grader.nothingWritten };
  if (cases.some((c) => c.given["memory"] !== undefined) && hasMemoryDirective(text))
    return {
      passed: false,
      total: cases.length,
      failures: [],
      blocked: MEMORY_RUNTIME_STRINGS.fixtureConflict,
    };
  const options = {
    allowed: new Set(challenge.allowedConstructs),
    introduced: introducedOf(challenge),
  };
  const checked = assemble(text, options);
  if (checked.program === null)
    return {
      passed: false,
      total: cases.length,
      failures: [],
      blocked: checked.errors.map((e) => S.editor.lineProblem(e.line, errorSentence(e))).join("\n"),
    };
  const failures: VerdictFailure[] = [];
  cases.forEach((c, index) => {
    const memory = c.given["memory"] === undefined ? undefined : memoryBytes(c.given["memory"]);
    const built = memory === undefined ? checked : assemble(withMemory(text, memory), options);
    if (built.program === null) throw new Error("The memory fixture did not assemble.");
    const args = argumentsGiven(c.given);
    const inputs: Record<string, string> = {};
    args.forEach((arg, n) => {
      if (typeof arg === "number") inputs[`w${n}`] = String(arg);
      else inputs[`${arg.width === 64 ? "x" : "w"}${n}`] = String(arg.value);
    });
    if (memory !== undefined) inputs["memory"] = memory.join(", ");
    const result = run(built.program, { entry: TEXT_BASE, args: machineArgs(args) });
    const stopped = stopSentence(result.stop);
    if (stopped !== null) {
      failures.push({
        index,
        label: c.label,
        inputs,
        actual: {},
        expected: {},
        detail: quoted(stopped),
      });
      return;
    }
    const actual: Record<string, string> = {};
    const expected: Record<string, string> = {};
    let ok = true;
    for (const [name, want] of Object.entries(c.expect)) {
      if (name === "memory") {
        const bytes = memoryBytes(want);
        if (memory === undefined || bytes.length !== memory.length)
          throw new Error("A memory expectation must cover the whole initial fixture.");
        const read = result.read(DATA_BASE, bytes.length);
        actual[name] = read === undefined ? "" : [...read].join(", ");
        expected[name] = bytes.join(", ");
        if (read === undefined || bytes.some((byte, n) => read[n] !== byte)) ok = false;
        continue;
      }
      const match = /^([wx])([0-9]|[12][0-9]|30)$/.exec(name);
      if (match === null) throw new Error(`${challenge.id}: ${name} is not a register.`);
      const width = match[1] === "w" ? 32 : 64;
      const value = result.final.x[Number(match[2])] ?? 0n;
      const target = machineArgs([{ value: want, width }])[0]!.value;
      const unsigned = (c.given[`reading.${name}`] ?? c.given["reading"]) === "unsigned";
      const read = unsigned ? BigInt.asUintN(width, value) : BigInt.asIntN(width, value);
      const showWant = unsigned ? BigInt.asUintN(width, target) : BigInt.asIntN(width, target);
      actual[name] = String(read);
      expected[name] = String(showWant);
      if (BigInt.asUintN(width, value) !== BigInt.asUintN(width, target)) ok = false;
    }
    if (!ok) failures.push({ index, label: c.label, inputs, actual, expected });
  });
  return { passed: failures.length === 0, total: cases.length, failures };
}
