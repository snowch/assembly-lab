// Copyright © 2026 Christopher Snow

import type { LessonInput } from "@platform/lesson-schema";
import { traceOf } from "@al/views";
import { TRANSFER_PROSE as P } from "./moving-to-riscv.prose";
import { TRANSFER_DIFFERENCE, ADJUSTED_DIFFERENCE, TRANSFER_CASES } from "./transfer.listings";

const worked = traceOf(TRANSFER_DIFFERENCE, {
  entry: "difference",
  args: [
    { value: 53, width: 64 },
    { value: 40, width: 64 },
  ],
});
const cases = TRANSFER_CASES.map(([now, then, adjustment], index) => ({
  label: Object.values(P.practice.caseLabels)[index]!,
  given: { x0: now, x1: then, x2: adjustment, reading: "unsigned" },
  expect: {
    x0: String(BigInt.asUintN(64, BigInt(now) - BigInt(then) + BigInt(adjustment))),
    x1: then,
    x2: adjustment,
  },
}));
const code = (label: string, source: string) => `**${label}**\n\n\`\`\`asm\n${source}\n\`\`\``;

export const movingToRiscv: LessonInput = {
  id: "moving-to-riscv",
  title: P.title,
  module: 18,
  order: 0,
  sectionLayout: "selected",
  showTimeModelNotes: false,
  objectives: [...P.objectives],
  introduces: [],
  sections: [
    { kind: "question", title: P.registers.title, prose: P.intro + "\n\n" + P.registers.prose },
    {
      kind: "motivation",
      title: P.worked.title,
      prose: [
        P.worked.before,
        code(P.worked.armLabel, TRANSFER_DIFFERENCE.listing),
        code(P.worked.riscvLabel, P.worked.riscvSource),
        P.worked.after,
        P.worked.observed(53, 40, worked.result.final.x[0]!),
      ].join("\n\n"),
    },
    { kind: "investigation", title: P.conditions.title, prose: P.conditions.prose },
    {
      kind: "construction",
      title: P.practice.sectionTitle,
      prose: P.practice.before,
      interactives: [
        {
          id: "write-transfer-difference",
          kind: "challenge",
          timeModel: "steps",
          role: "exercise",
          caption: P.practice.caption,
          props: { challengeId: "write-transfer-difference" },
        },
      ],
    },
    { kind: "explanation", title: P.environment.title, prose: P.environment.prose },
    {
      kind: "generalisation",
      title: P.run.title,
      prose: [P.run.before, "```asm\n" + P.run.source + "\n```", P.run.after, P.run.fresh].join(
        "\n\n",
      ),
    },
    { kind: "reflection", title: P.next.title, prose: P.next.prose },
  ],
  challenges: [
    {
      id: "write-transfer-difference",
      title: P.practice.title,
      task: P.practice.task,
      gradedDirection: "write",
      palette: ["x0", "x1", "x2"],
      allowedConstructs: ["sub", "add", "ret"],
      initial: {
        text: "ret",
        data: { editor: { registers: ["x0", "x1", "x2"], symbols: [",", "x"] } },
      },
      tests: { kind: "answers", grader: "run-registers", cases },
      hints: [...P.practice.hints],
      reference: { text: ADJUSTED_DIFFERENCE },
    },
  ],
  modelVsReality: "",
  originalityNote: P.originality,
};
