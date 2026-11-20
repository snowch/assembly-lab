// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ChallengeEditorProps, Verdict } from "@platform/lesson-runtime";
import type { Artifact, Lesson } from "@platform/lesson-schema";
import { AssemblyEditor } from "./AssemblyEditor";
import { InstructionHelpProvider } from "./instruction-help";
import { INSTRUCTION_HELP_STRINGS as HELP } from "./strings.instruction-help";
import { VIEW_STRINGS as S } from "./strings";
import { gradeWritten } from "./grader";
import { written } from "./testing";

const invalid = "add w0, w0, 4294966296\nret";
const props = (text = invalid): ChallengeEditorProps => ({
  lesson: {} as Lesson,
  challenge: written,
  artifact: { text },
  onChange: vi.fn(),
});

function RunHarness() {
  const [artifact, setArtifact] = useState<Artifact>({ text: invalid });
  const [verdict, setVerdict] = useState<Verdict>();
  return (
    <>
      <AssemblyEditor
        {...props()}
        artifact={artifact}
        verdict={verdict}
        onChange={(next) => {
          setArtifact(next);
          setVerdict(undefined);
        }}
      />
      <button onClick={() => setVerdict(gradeWritten(written, artifact))}>Run</button>
      {verdict?.blocked && <p data-testid="blocked">{verdict.blocked}</p>}
    </>
  );
}

beforeEach(() => localStorage.clear());

describe("instruction help from the assembly editor", () => {
  it("works without a shell reference provider", () => {
    render(<AssemblyEditor {...props()} />);
    expect(screen.queryByRole("button", { name: HELP.syntax("add") })).not.toBeInTheDocument();
    expect(screen.getByRole("list", { name: S.editor.problems })).toBeInTheDocument();
  });

  it("opens the first invalid instruction in the exact exercise without editing saved source", async () => {
    const open = vi.fn();
    const rememberChallenge = vi.fn();
    const editor = props();
    render(
      <InstructionHelpProvider value={{ open, rememberChallenge }}>
        <AssemblyEditor {...editor} />
      </InstructionHelpProvider>,
    );
    fireEvent.focus(screen.getByRole("textbox", { name: S.editor.textLabel }));
    expect(rememberChallenge).toHaveBeenCalledWith(written.id);
    await userEvent.click(screen.getByRole("button", { name: HELP.syntax("add") }));
    expect(open).toHaveBeenCalledExactlyOnceWith({
      challengeId: written.id,
      mnemonic: "add",
      formId: "immediate",
      issueKey: "immediate.addsub",
    });
    expect(editor.onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toHaveValue(invalid);
  });

  it.each(["", "madeup w0, w0", "ret"])(
    "offers the exercise reference when no supported error instruction exists: %j",
    async (text) => {
      const open = vi.fn();
      render(
        <InstructionHelpProvider value={{ open, rememberChallenge: vi.fn() }}>
          <AssemblyEditor {...props(text)} />
        </InstructionHelpProvider>,
      );
      await userEvent.click(screen.getByRole("button", { name: HELP.reference }));
      expect(open).toHaveBeenCalledExactlyOnceWith({ challengeId: written.id });
    },
  );

  it("finds conditional branch help even when the instruction follows a label", async () => {
    const open = vi.fn();
    render(
      <InstructionHelpProvider value={{ open, rememberChallenge: vi.fn() }}>
        <AssemblyEditor {...props("again: b.eq missing")} />
      </InstructionHelpProvider>,
    );
    await userEvent.click(screen.getByRole("button", { name: HELP.syntax("b.cond") }));
    expect(open).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        challengeId: written.id,
        mnemonic: "b.cond",
        formId: "label-condition",
      }),
    );
  });
});

describe("one assembly diagnostic after Run tests", () => {
  it("shows one live diagnostic, moves it to the blocked verdict and restores live feedback on edit", async () => {
    render(<RunHarness />);
    expect(screen.getByRole("list", { name: S.editor.problems })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /^Run$/ }));
    expect(screen.queryByRole("list", { name: S.editor.problems })).not.toBeInTheDocument();
    expect(screen.getByTestId("blocked")).toHaveTextContent("4294966296");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "sub w0, w0, 4294966296" } });
    expect(screen.queryByTestId("blocked")).not.toBeInTheDocument();
    expect(screen.getByRole("list", { name: S.editor.problems })).toBeInTheDocument();
  });

  it("keeps live diagnostics beside a different blocked result", () => {
    const editor = props();
    render(
      <AssemblyEditor
        {...editor}
        verdict={{ passed: false, total: 1, failures: [], blocked: "A different problem." }}
      />,
    );
    expect(screen.getByRole("list", { name: S.editor.problems })).toBeInTheDocument();
  });

  it("keeps changed diagnostics visible when a stale verdict is passed", () => {
    const verdict = gradeWritten(written, { text: invalid });
    render(<AssemblyEditor {...props("add w0, w0, 5000")} verdict={verdict} />);
    expect(screen.getByRole("list", { name: S.editor.problems })).toHaveTextContent("5000");
  });

  it("also suppresses repeated tap diagnostics while preserving each invalid line", async () => {
    const verdict = gradeWritten(written, { text: invalid });
    render(<AssemblyEditor {...props()} verdict={verdict} />);
    await userEvent.click(screen.getByRole("button", { name: S.editor.tap }));
    const invalidLine = screen.getByRole("button", { name: /add w0, w0, 4294966296/ });
    expect(invalidLine).toHaveAttribute("aria-invalid", "true");
    expect(document.querySelector(".asm-error")).toBeNull();
    await userEvent.click(invalidLine);
    expect(screen.getByRole("group", { name: S.editor.instruction })).toBeInTheDocument();
  });
});
