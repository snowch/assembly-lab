// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The tap editor builds the lines Module 4's challenges need from chips and the number pad: a compare,
// `csel` with a condition, a conditional branch (offered under each condition), `cbz` and `b` with a
// label, and a label line itself. So both written challenges can be completed on a phone without a
// keyboard, and the line a chip builds is the line the assembler reads.

import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { Challenge, type Artifact, type Lesson } from "@platform/lesson-schema";

import { AssemblyEditor } from "./AssemblyEditor";
import { gradeWritten } from "./grader";
import { VIEW_STRINGS as S } from "./strings";
import { labelNameOf, lineText, parseLine, slotsOf, withInstruction, withOperand } from "./tap";

const cases = [
  { label: "fuel_warning(0, 10)", given: { w0: 0, w1: 10 }, expect: { w0: 2 } },
  { label: "fuel_warning(9, 10)", given: { w0: 9, w1: 10 }, expect: { w0: 1 } },
  { label: "fuel_warning(10, 10)", given: { w0: 10, w1: 10 }, expect: { w0: 0 } },
  { label: "fuel_warning(200, 10)", given: { w0: 200, w1: 10 }, expect: { w0: 0 } },
  { label: "fuel_warning(0x80000000, 10)", given: { w0: 0x80000000, w1: 10 }, expect: { w0: 0 } },
];

const warning = Challenge.parse({
  id: "warn",
  title: "Write fuel_warning",
  task: "Write it.",
  gradedDirection: "write",
  palette: ["w0", "w1"],
  allowedConstructs: ["cmp", "b.cond", "cbz", "b", "mov", "ret"],
  initial: {
    text: "mov w0, 0\nret",
    data: { editor: { registers: ["w0", "w1"], labels: [".Llow", ".Lempty"] } },
  },
  tests: { kind: "answers", grader: "run-registers", cases },
  hints: ["a", "b", "c", "d", "e"],
  reference: { text: "ret" },
});

const lessFuel = Challenge.parse({
  id: "less",
  title: "Write less_fuel",
  task: "Write it.",
  gradedDirection: "write",
  palette: ["w0", "w1"],
  allowedConstructs: ["cmp", "csel", "ret"],
  initial: { text: "ret" },
  tests: {
    kind: "answers",
    grader: "run-registers",
    cases: [
      { label: "a", given: { w0: 3, w1: 7 }, expect: { w0: 3 } },
      { label: "b", given: { w0: 0x80000000, w1: 1 }, expect: { w0: 1 } },
    ],
  },
  hints: ["a", "b", "c", "d", "e"],
  reference: { text: "ret" },
});

function Harness({
  challenge,
  seen,
  start = "",
}: {
  challenge: typeof warning;
  seen: (text: string | undefined) => void;
  start?: string;
}) {
  const [artifact, setArtifact] = useState<Artifact>({ text: start });
  return (
    <AssemblyEditor
      lesson={{} as Lesson}
      challenge={challenge}
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
const names = (g: string) =>
  within(group(g))
    .getAllByRole("button")
    .map((b) => b.textContent);

beforeEach(() => {
  localStorage.clear();
});

describe("a line of the tap editor, for Module 4's instructions", () => {
  it("has operands for cmp, csel, cbz, cbnz and b, and a label for a conditional branch", () => {
    expect(slotsOf("cmp")).toEqual(["register", "registerOrNumber"]);
    expect(slotsOf("csel")).toEqual(["register", "register", "register", "condition"]);
    expect(slotsOf("cbz")).toEqual(["register", "label"]);
    expect(slotsOf("b")).toEqual(["label"]);
    expect(slotsOf("b.cc")).toEqual(["label"]);
    expect(slotsOf("b.cond")).toBeUndefined();
    expect(slotsOf("bl")).toEqual(["label"]);
  });

  it("reads a label line with its name's case, and builds one from a chip", () => {
    expect(labelNameOf(".Llow:")).toBe(".Llow");
    expect(labelNameOf("  fuel_warning: ")).toBe("fuel_warning");
    expect(labelNameOf("ret")).toBeNull();
    expect(labelNameOf("b .Llow")).toBeNull();
    expect(parseLine(".Llow:")).toEqual({ mnemonic: ".Llow:", operands: [] });
    expect(lineText(withInstruction(parseLine("ret"), ".Llow:"))).toBe(".Llow:");
    // Changing a label line to an instruction leaves no label behind.
    expect(lineText(withInstruction(parseLine(".Llow:"), "ret"))).toBe("ret");
  });

  it("builds b.cc .Llow, cbz w0, .Lempty and csel w0, w0, w1, cc from their pieces", () => {
    let line = withInstruction(parseLine(""), "b.cc");
    line = withOperand(line, 0, ".Llow");
    expect(lineText(line)).toBe("b.cc .Llow");
    line = withOperand(withOperand(withInstruction(parseLine(""), "cbz"), 0, "w0"), 1, ".Lempty");
    expect(lineText(line)).toBe("cbz w0, .Lempty");
    line = withInstruction(parseLine(""), "csel");
    for (const [i, o] of ["w0", "w0", "w1", "cc"].entries()) line = withOperand(line, i, o);
    expect(lineText(line)).toBe("csel w0, w0, w1, cc");
  });
});

describe("tap mode, for less_fuel", () => {
  it("builds cmp w0, w1, csel w0, w0, w1, cc and ret from chips alone, and the grader passes it", async () => {
    const user = userEvent.setup({ delay: null });
    let latest: string | undefined;
    render(<Harness challenge={lessFuel} seen={(t) => (latest = t)} />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getByRole("button", { name: S.editor.addFirst }));
    expect(names(S.editor.instruction)).toEqual(["cmp", "csel", "ret"]);
    await user.click(chip(S.editor.instruction, "cmp"));
    await user.click(chip(S.editor.operand(1), "w0"));
    await user.click(chip(S.editor.operand(2), "w1"));
    expect(latest).toBe("cmp w0, w1");
    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    await user.click(chip(S.editor.instruction, "csel"));
    await user.click(chip(S.editor.operand(1), "w0"));
    await user.click(chip(S.editor.operand(2), "w0"));
    await user.click(chip(S.editor.operand(3), "w1"));
    // The last item is a condition, chosen from chips named as the lessons name them.
    expect(names(S.editor.operand(4))).toEqual([
      "eq",
      "ne",
      "cs",
      "cc",
      "hi",
      "ls",
      "ge",
      "lt",
      "gt",
      "le",
    ]);
    await user.click(chip(S.editor.operand(4), "cc"));
    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    await user.click(chip(S.editor.instruction, "ret"));
    expect(latest).toBe("cmp w0, w1\ncsel w0, w0, w1, cc\nret");
    expect(screen.queryByRole("list", { name: S.editor.problems })).toBeNull();
    expect(gradeWritten(lessFuel, { text: latest ?? "" }).passed).toBe(true);
  });

  it("takes a condition off again when its chip is pressed a second time", async () => {
    const user = userEvent.setup({ delay: null });
    let latest: string | undefined;
    render(<Harness challenge={lessFuel} seen={(t) => (latest = t)} start="csel w0, w0, w1, cc" />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getAllByRole("button", { name: /csel/ })[0]!);
    await user.click(chip(S.editor.operand(4), "cc"));
    expect(latest).toBe("csel w0, w0, w1");
  });
});

describe("tap mode, for fuel_warning", () => {
  it("offers a conditional branch under each condition, cbz, b, mov and cmp, and a chip for each label", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Harness challenge={warning} seen={() => undefined} />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getByRole("button", { name: S.editor.addFirst }));
    expect(names(S.editor.instruction)).toEqual([
      "cmp",
      "b.eq",
      "b.ne",
      "b.cs",
      "b.cc",
      "b.hi",
      "b.ls",
      "b.ge",
      "b.lt",
      "b.gt",
      "b.le",
      "cbz",
      "b",
      "mov",
      "ret",
      ".Llow:",
      ".Lempty:",
    ]);
  });

  it("builds the whole of the reference, label lines included, by tapping alone", async () => {
    const user = userEvent.setup({ delay: null });
    let latest: string | undefined;
    render(<Harness challenge={warning} seen={(t) => (latest = t)} />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getByRole("button", { name: S.editor.addFirst }));
    const next = () => user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    const number = async (digit: string) => {
      await user.click(
        within(group(S.editor.operand(2))).getByRole("button", { name: S.editor.number }),
      );
      await user.click(within(group(S.editor.numberPad)).getByRole("button", { name: digit }));
    };
    // cbz w0, .Lempty
    await user.click(chip(S.editor.instruction, "cbz"));
    await user.click(chip(S.editor.operand(1), "w0"));
    await user.click(chip(S.editor.operand(2), ".Lempty"));
    await next();
    // cmp w0, w1
    await user.click(chip(S.editor.instruction, "cmp"));
    await user.click(chip(S.editor.operand(1), "w0"));
    await user.click(chip(S.editor.operand(2), "w1"));
    await next();
    // b.cc .Llow
    await user.click(chip(S.editor.instruction, "b.cc"));
    await user.click(chip(S.editor.operand(1), ".Llow"));
    await next();
    // mov w0, 0 ; ret
    await user.click(chip(S.editor.instruction, "mov"));
    await user.click(chip(S.editor.operand(1), "w0"));
    await number("0");
    await next();
    await user.click(chip(S.editor.instruction, "ret"));
    await next();
    // .Llow: mov w0, 1 ; ret
    await user.click(chip(S.editor.instruction, ".Llow:"));
    await next();
    await user.click(chip(S.editor.instruction, "mov"));
    await user.click(chip(S.editor.operand(1), "w0"));
    await number("1");
    await next();
    await user.click(chip(S.editor.instruction, "ret"));
    await next();
    // .Lempty: mov w0, 2 ; ret
    await user.click(chip(S.editor.instruction, ".Lempty:"));
    await next();
    await user.click(chip(S.editor.instruction, "mov"));
    await user.click(chip(S.editor.operand(1), "w0"));
    await number("2");
    await next();
    await user.click(chip(S.editor.instruction, "ret"));
    expect(latest).toBe(
      [
        "cbz w0, .Lempty",
        "cmp w0, w1",
        "b.cc .Llow",
        "mov w0, #0",
        "ret",
        ".Llow:",
        "mov w0, #1",
        "ret",
        ".Lempty:",
        "mov w0, #2",
        "ret",
      ].join("\n"),
    );
    expect(screen.queryByRole("list", { name: S.editor.problems })).toBeNull();
    const verdict = gradeWritten(warning, { text: latest ?? "" });
    expect(verdict.blocked).toBeUndefined();
    expect(verdict.passed).toBe(true);
  });

  it("shows a label line's chip as pressed, and does not call a label line something the chips cannot build", async () => {
    const user = userEvent.setup({ delay: null });
    render(<Harness challenge={warning} seen={() => undefined} start={".Llow:\nret"} />);
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    await user.click(screen.getAllByRole("button", { name: /\.Llow:/ })[0]!);
    expect(chip(S.editor.instruction, ".Llow:")).toHaveAttribute("aria-pressed", "true");
    expect(chip(S.editor.instruction, ".Lempty:")).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByText(S.editor.notEditable)).toBeNull();
  });

  it("keeps the text it is given when the mode is switched, a label line included", async () => {
    const user = userEvent.setup({ delay: null });
    render(
      <Harness challenge={warning} seen={() => undefined} start={"b.cc .Llow\n.Llow:\nret"} />,
    );
    await user.click(screen.getByRole("button", { name: S.editor.tap }));
    expect(
      screen.getAllByRole("listitem").map((li) => li.querySelector("code")?.textContent),
    ).toEqual(["b.cc .Llow", ".Llow:", "ret"]);
    await user.click(screen.getByRole("button", { name: S.editor.text }));
    expect(screen.getByRole("textbox", { name: S.editor.textLabel })).toHaveValue(
      "b.cc .Llow\n.Llow:\nret",
    );
  });
});
