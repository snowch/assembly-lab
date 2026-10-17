// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow
import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { DATA_BASE } from "@al/machine";
import { Challenge, type Artifact, type Lesson } from "@platform/lesson-schema";
import { AssemblyEditor } from "./AssemblyEditor";
import { gradeWritten } from "./grader";
import { VIEW_STRINGS as S } from "./strings";
import { slotsOf, withInstruction } from "./tap";

const base = {
  id: "tap-memory",
  title: "Memory",
  task: "Read the bytes.",
  gradedDirection: "write",
  palette: ["x0", "w0", "w1", "x1"],
  allowedConstructs: ["ldrsb", "ret"],
  initial: {
    text: "",
    data: { editor: { addresses: ["[x0]", "[x0, 2]"], registers: ["w0", "x0"] } },
  },
  tests: {
    kind: "answers",
    grader: "run-registers",
    cases: [
      { label: "reading", given: { x0: DATA_BASE, memory: "0,0,255,0" }, expect: { w0: -1 } },
    ],
  },
  hints: ["a", "b", "c", "d", "e"],
  reference: { text: "ldrsb w0, [x0, 2]\nret" },
};

function Harness({
  challenge,
  seen,
}: {
  challenge: Challenge;
  seen: (artifact: Artifact) => void;
}) {
  const [artifact, setArtifact] = useState<Artifact>(challenge.initial);
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

describe("memory instructions in the tap editor", () => {
  it("builds a complete offset load without a keyboard and offers only configured addresses", async () => {
    const challenge = Challenge.parse(base);
    let latest = challenge.initial;
    const user = userEvent.setup({ delay: null });
    render(
      <Harness
        challenge={challenge}
        seen={(next) => {
          latest = next;
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getByRole("button", { name: S.editor.addFirst }));
    await user.click(chip(S.editor.instruction, "ldrsb"));
    await user.click(chip(S.editor.operand(1), "w0"));
    await user.click(chip(S.editor.operand(2), "[x0, 2]"));
    expect(screen.queryByRole("button", { name: "[x1]" })).toBeNull();
    expect(screen.queryByRole("button", { name: "ldrh" })).toBeNull();
    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    await user.click(chip(S.editor.instruction, "ret"));
    expect(latest.text).toBe("ldrsb w0, [x0, 2]\nret");
    expect(gradeWritten(challenge, latest).passed).toBe(true);
    await user.click(screen.getByRole("button", { name: S.editor.text }));
    expect(
      (screen.getByRole("textbox", { name: S.editor.textLabel }) as HTMLTextAreaElement).value,
    ).toBe(latest.text);
  });

  it("builds an extended add only when the challenge supplies extension choices", async () => {
    const challenge = Challenge.parse({
      ...base,
      allowedConstructs: ["add", "ret"],
      initial: {
        text: "add x0, x0, w1\nret",
        data: { editor: { registers: ["x0", "w1"], extensions: ["sxtw"] } },
      },
      tests: {
        kind: "answers",
        grader: "run-registers",
        cases: [
          {
            label: "reading",
            given: { x0: "0x100000001", w1: -1, reading: "unsigned" },
            expect: { x0: "0x100000000" },
          },
        ],
      },
    });
    let latest = challenge.initial;
    const user = userEvent.setup({ delay: null });
    render(
      <Harness
        challenge={challenge}
        seen={(next) => {
          latest = next;
        }}
      />,
    );
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getByRole("button", { name: /add x0, x0, w1/ }));
    await user.click(chip(S.editor.operand(4), "sxtw"));
    expect(latest.text).toBe("add x0, x0, w1, sxtw\nret");
    expect(gradeWritten(challenge, latest).passed).toBe(true);
    expect(slotsOf("add")).toHaveLength(3);
    expect(
      withInstruction({ mnemonic: "ldr", operands: ["w0", "[x0, 2]"] }, "mov").operands,
    ).toEqual(["w0", ""]);
  });
});
