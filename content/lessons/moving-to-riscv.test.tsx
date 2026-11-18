// Copyright © 2026 Christopher Snow

import { readFileSync } from "node:fs";
import { expect, it } from "vitest";
import { gradeWritten, traceOf } from "@al/views";
import { checkLesson } from "@platform/lesson-schema";
import { LESSONS } from ".";
import { TRANSFER_PROSE as P } from "./moving-to-riscv.prose";
import { TRANSFER_DIFFERENCE, ADJUSTED_DIFFERENCE, TRANSFER_CASES } from "./transfer.listings";

const lesson = LESSONS.find((item) => item.id === "moving-to-riscv")!;
const challenge = lesson.challenges[0]!;

it("publishes an optional transfer guide with the actual native-tested functions", () => {
  expect(checkLesson(lesson)).toEqual([]);
  expect(lesson.module).toBe(18);
  const corpus = readFileSync(
    new URL("../../scripts/real-tools/corpus/transfer-functions.s", import.meta.url),
    "utf8",
  );
  expect(corpus).toContain(TRANSFER_DIFFERENCE.listing);
  expect(corpus).toContain(
    ADJUSTED_DIFFERENCE.split("\n")
      .map((line) => "  " + line)
      .join("\n"),
  );
  expect(P.worked.armSource).toBe(TRANSFER_DIFFERENCE.listing);
  const worked = traceOf(TRANSFER_DIFFERENCE, {
    entry: "difference",
    args: [
      { value: 53, width: 64 },
      { value: 40, width: 64 },
    ],
  });
  expect(worked.result.final.x[0]).toBe(13n);
  expect(
    lesson.sections.some((section) => section.prose.includes("both functions return `13`")),
  ).toBe(true);
});

it("checks fresh64-bit calls, preservation and width instead of accepting a32-bit imitation", async () => {
  const correct = await gradeWritten(challenge, { text: ADJUSTED_DIFFERENCE });
  expect(correct.passed).toBe(true);
  expect((await gradeWritten(challenge, { text: "ret" })).passed).toBe(false);
  expect(
    (await gradeWritten(challenge, { text: "sub w0, w0, w1\nadd w0, w0, w2\nret" })).passed,
  ).toBe(false);
  expect(
    (await gradeWritten(challenge, { text: "sub x0, x1, x0\nadd x0, x0, x2\nret" })).passed,
  ).toBe(false);
  expect(
    (await gradeWritten(challenge, { text: "sub x1, x0, x1\nadd x0, x1, x2\nret" })).passed,
  ).toBe(false);
  if (challenge.tests.kind !== "answers")
    throw new Error("Transfer exercise must use answer cases.");
  expect(challenge.tests.cases).toHaveLength(TRANSFER_CASES.length);
});
