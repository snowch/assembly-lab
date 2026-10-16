// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The tap editor builds `mov` and `movk` lines from chips and the number pad, so Module 1's written
// challenge can be completed on a phone without a keyboard; and the answer editor draws a field of
// bits as 32 buttons.

import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { Challenge, type Artifact, type Lesson } from "@platform/lesson-schema";

import { AnswerEditor } from "./AnswerEditor";
import { AssemblyEditor } from "./AssemblyEditor";
import { gradeWritten } from "./grader";
import { VIEW_STRINGS as S } from "./strings";

const build = Challenge.parse({
  id: "build",
  title: "Build 1000000",
  task: "Build it.",
  gradedDirection: "write",
  palette: ["w0"],
  allowedConstructs: ["mov", "movk", "ret"],
  initial: { text: "mov w0, 1000000\nret" },
  tests: {
    kind: "answers",
    grader: "run-registers",
    cases: [{ label: "odometer_limit()", given: {}, expect: { w0: 1000000 } }],
  },
  hints: ["a", "b", "c", "d", "e"],
  reference: { text: "mov w0, 16960\nmovk w0, 0xf, lsl 16\nret" },
});

const bitsChallenge = Challenge.parse({
  id: "bits",
  title: "Make a pattern",
  task: "Make it.",
  gradedDirection: "answer",
  fields: [
    { id: "bits", label: "the bits of `w0`", kind: "bits", width: 32, weights: "signed" },
    { id: "unsigned", label: "its unsigned reading", kind: "number" },
  ],
  tests: {
    kind: "answers",
    grader: "bit-readings",
    cases: [{ label: "the bits", given: { reading: "signed" }, expect: { bits: -1 } }],
  },
  hints: ["a", "b", "c", "d", "e"],
  reference: { answers: { bits: "1".repeat(32), unsigned: "4294967295" } },
});

function Harness({
  seen,
  start = "",
}: {
  seen: (text: string | undefined) => void;
  start?: string;
}) {
  const [artifact, setArtifact] = useState<Artifact>({ text: start });
  return (
    <AssemblyEditor
      lesson={{} as Lesson}
      challenge={build}
      artifact={artifact}
      onChange={(next) => {
        setArtifact(next);
        seen(next.text);
      }}
    />
  );
}

const group = (name: string) => screen.getByRole("group", { name });
const chip = (g: string, name: string) => within(group(g)).getByRole("button", { name });

beforeEach(() => {
  localStorage.clear();
});

describe("tap mode with mov and movk", () => {
  it("builds the three lines that put 1000000 in w0 from chips and the number pad alone", async () => {
    const user = userEvent.setup({ delay: null });
    let latest: string | undefined;
    render(<Harness seen={(t) => (latest = t)} />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getByRole("button", { name: S.editor.addFirst }));
    await user.click(chip(S.editor.instruction, "mov"));
    await user.click(chip(S.editor.operand(1), "w0"));
    await user.click(
      within(group(S.editor.operand(2))).getByRole("button", { name: S.editor.number }),
    );
    for (const d of "16960")
      await user.click(within(group(S.editor.numberPad)).getByRole("button", { name: d }));
    expect(latest).toBe("mov w0, #16960");
    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    await user.click(chip(S.editor.instruction, "movk"));
    await user.click(chip(S.editor.operand(1), "w0"));
    // The second operand of movk is only a number: the pad is open, and no register is offered.
    expect(within(group(S.editor.operand(2))).queryByRole("button", { name: "w0" })).toBeNull();
    for (const d of "15")
      await user.click(within(group(S.editor.numberPad)).getByRole("button", { name: d }));
    await user.click(chip(S.editor.operand(3), "lsl 16"));
    expect(latest).toBe("mov w0, #16960\nmovk w0, #15, lsl 16");
    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    await user.click(chip(S.editor.instruction, "ret"));
    expect(latest).toBe("mov w0, #16960\nmovk w0, #15, lsl 16\nret");
    expect(screen.queryByRole("list", { name: S.editor.problems })).toBeNull();
    expect(gradeWritten(build, { text: latest ?? "" }).passed).toBe(true);
  });

  it("takes the shift off again when its chip is pressed a second time", async () => {
    const user = userEvent.setup({ delay: null });
    let latest: string | undefined;
    render(<Harness seen={(t) => (latest = t)} />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getByRole("button", { name: S.editor.addFirst }));
    await user.click(chip(S.editor.instruction, "movk"));
    await user.click(chip(S.editor.operand(1), "w0"));
    await user.click(chip(S.editor.operand(3), "lsl 16"));
    expect(latest).toBe("movk w0, , lsl 16");
    await user.click(chip(S.editor.operand(3), "lsl 16"));
    expect(latest).toBe("movk w0");
  });

  it("shows the machine's sentence against the starting line, which is not one instruction", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <AssemblyEditor
        lesson={{} as Lesson}
        challenge={build}
        artifact={{}}
        onChange={() => undefined}
      />,
    );
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    expect(screen.getByText(/No single instruction can put/)).toBeInTheDocument();
  });

  it("keeps the pad open when the last digit of a number goes, so the number can be replaced", async () => {
    const user = userEvent.setup({ delay: null });
    let latest: string | undefined;
    render(<Harness seen={(t) => (latest = t)} start={"mov w0, 1000000\nret"} />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getAllByRole("button", { name: /mov w0, 1000000/ })[0]!);
    await user.click(
      within(group(S.editor.numberPad)).getByRole("button", { name: S.editor.clearNumber }),
    );
    expect(latest).toBe("mov w0\nret");
    for (const d of "16960")
      await user.click(within(group(S.editor.numberPad)).getByRole("button", { name: d }));
    expect(latest).toBe("mov w0, #16960\nret");
  });

  it("opens an existing mov line with its number in the pad and its register pressed", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <AssemblyEditor
        lesson={{} as Lesson}
        challenge={build}
        artifact={{ text: "mov w0, #16960\nret" }}
        onChange={() => undefined}
      />,
    );
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getAllByRole("button", { name: /mov w0, #16960/ })[0]!);
    expect(chip(S.editor.operand(1), "w0")).toHaveAttribute("aria-pressed", "true");
    expect(within(group(S.editor.numberPad)).getByRole("status")).toHaveTextContent("16960");
  });
});

describe("the answer editor with a field of bits", () => {
  function Answers() {
    const [artifact, setArtifact] = useState<Artifact>({});
    return (
      <AnswerEditor
        lesson={{} as Lesson}
        challenge={bitsChallenge}
        artifact={artifact}
        onChange={setArtifact}
      />
    );
  }

  it("draws 32 buttons for the bits and a text box for the number", () => {
    render(<Answers />);
    const bits = within(group("the bits of w0"));
    expect(bits.getAllByRole("button")).toHaveLength(32);
    expect(bits.queryAllByRole("button", { pressed: true })).toHaveLength(0);
    expect(screen.getAllByRole("textbox")).toHaveLength(1);
  });

  it("keeps the bits as 32 characters, and the number apart from them", async () => {
    const user = userEvent.setup({ delay: null });
    let latest: Artifact = {};
    render(
      <AnswerEditor
        lesson={{} as Lesson}
        challenge={bitsChallenge}
        artifact={latest}
        onChange={(a) => (latest = a)}
      />,
    );
    await user.click(screen.getByRole("button", { name: S.toggles.bit(31) }));
    expect(latest.answers?.["bits"]).toBe("1" + "0".repeat(31));
  });
});
