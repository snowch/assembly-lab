// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { Challenge, type Artifact, type Lesson } from "@platform/lesson-schema";
import { LESSONS } from "@al/content";
import { pacingOrigins } from "../../../content/lessons/pacing";
import { AssemblyEditor } from "./AssemblyEditor";
import { gradeWritten } from "./grader";
import { VIEW_STRINGS as S } from "./strings";
import { parseLine } from "./tap";
function Harness({
  lesson,
  challenge,
  seen,
}: {
  lesson: Lesson;
  challenge: Challenge;
  seen: (a: Artifact) => void;
}) {
  const [artifact, setArtifact] = useState<Artifact>({ ...challenge.initial, text: "" });
  return (
    <AssemblyEditor
      lesson={lesson}
      challenge={challenge}
      artifact={artifact}
      onChange={(next) => {
        setArtifact(next);
        seen(next);
      }}
    />
  );
}
const chip = (group: string, name: string) =>
  within(screen.getByRole("group", { name: group })).getByRole("button", { name });
beforeEach(() => localStorage.clear());
const sourceIds = ["array-addresses", "zero-terminated-strings"];
const challenges = LESSONS.filter((lesson) =>
  sourceIds.includes(pacingOrigins.get(lesson.id) ?? lesson.id),
).flatMap((lesson) => lesson.challenges.map((challenge) => ({ lesson, challenge })));

it("retains every published challenge for touch construction", () => {
  expect(challenges.map(({ challenge }) => challenge.id)).toEqual([
    "write-read-trip",
    "write-sum-trips",
    "write-label-length",
    "write-count-marker",
  ]);
});

it.each(challenges)(
  "builds the whole $challenge.id reference in $lesson.id using touch controls",
  async ({ lesson, challenge: input }) => {
    const challenge = Challenge.parse(input);
    let latest: Artifact = {};
    const user = userEvent.setup({ delay: null });
    render(
      <Harness
        lesson={lesson}
        challenge={challenge}
        seen={(a) => {
          latest = a;
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    for (const [index, text] of challenge.reference.text!.split("\n").entries()) {
      await user.click(
        screen.getByRole("button", { name: index === 0 ? S.editor.addFirst : S.editor.addBelow }),
      );
      const line = parseLine(text);
      await user.click(chip(S.editor.instruction, line.mnemonic));
      for (const [i, operand] of line.operands.entries()) {
        if (/^#?\d+$/.test(operand)) {
          await user.click(chip(S.editor.operand(i + 1), S.editor.number));
          const pad = within(screen.getByRole("group", { name: S.editor.numberPad }));
          for (const digit of operand.replace("#", ""))
            await user.click(pad.getByRole("button", { name: digit }));
        } else await user.click(chip(S.editor.operand(i + 1), operand));
      }
    }
    expect(latest.text).toBe(challenge.reference.text);
    expect(gradeWritten(challenge, latest).passed).toBe(true);
    await user.click(screen.getByRole("button", { name: S.editor.text }));
    expect(
      (screen.getByRole("textbox", { name: S.editor.textLabel }) as HTMLTextAreaElement).value,
    ).toBe(latest.text);
  },
  20000,
);
