// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, it } from "vitest";
import { Challenge, type Artifact, type Lesson } from "@platform/lesson-schema";
import { callsAndReturns } from "../../../content/lessons/calls-and-returns";
import { recursiveCalls } from "../../../content/lessons/recursive-calls";
import { AssemblyEditor } from "./AssemblyEditor";
import { gradeWritten } from "./grader";
import { VIEW_STRINGS as S } from "./strings";
import { parseLine } from "./tap";
function Harness({ challenge, seen }: { challenge: Challenge; seen: (a: Artifact) => void }) {
  const [artifact, setArtifact] = useState<Artifact>({ ...challenge.initial, text: "" });
  return (
    <AssemblyEditor
      lesson={{} as Lesson}
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
it.each([...callsAndReturns.challenges!, ...recursiveCalls.challenges!])(
  "builds the whole $id reference using touch controls",
  async (input) => {
    const challenge = Challenge.parse(input);
    let latest: Artifact = {};
    const user = userEvent.setup({ delay: null });
    render(
      <Harness
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
    expect(latest.text?.replace(/\s+/g, " ").replace(/#/g, "")).toBe(
      challenge.reference.text?.replace(/\s+/g, " ").replace(/#/g, ""),
    );
    expect(gradeWritten(challenge, latest).passed).toBe(true);
    await user.click(screen.getByRole("button", { name: S.editor.text }));
    expect(
      (screen.getByRole("textbox", { name: S.editor.textLabel }) as HTMLTextAreaElement).value,
    ).toBe(latest.text);
  },
  20000,
);
