// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The assembly editor's two modes over one text. Tap mode builds a line from chips alone, offers
// only what the challenge allows, and shows the machine's sentence on a line as it is built; text
// mode is a keyboard's box with the characters assembly needs in a bar; the learner moves between
// them without losing a character.

import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import type { Artifact, Lesson } from "@platform/lesson-schema";

import { AssemblyEditor, SYMBOLS } from "./AssemblyEditor";
import { gradeWritten } from "./grader";
import { sentence } from "./messages";
import { VIEW_STRINGS as S } from "./strings";
import { written } from "./testing";

function Harness({ start, seen }: { start: Artifact; seen?: (text: string | undefined) => void }) {
  const [artifact, setArtifact] = useState<Artifact>(start);
  return (
    <AssemblyEditor
      lesson={{} as Lesson}
      challenge={written}
      artifact={artifact}
      onChange={(next) => {
        setArtifact(next);
        seen?.(next.text);
      }}
    />
  );
}

const textBox = () =>
  screen.getByRole("textbox", { name: S.editor.textLabel }) as HTMLTextAreaElement;
const mode = (name: string) => screen.getByRole("button", { name });
const group = (name: string) => screen.getByRole("group", { name });

beforeEach(() => {
  localStorage.clear();
});

describe("tap mode", () => {
  it("builds `sub w0, w0, w1` and `ret` from chips alone, and the grader passes it", async () => {
    const user = userEvent.setup();
    let latest: string | undefined;
    render(<Harness start={{ text: "" }} seen={(t) => (latest = t)} />);
    await user.click(mode(S.editor.tap));
    expect(screen.getByText(S.editor.noLines)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: S.editor.addFirst }));
    await user.click(within(group(S.editor.instruction)).getByRole("button", { name: "sub" }));
    expect(latest).toBe("sub");
    await user.click(within(group(S.editor.operand(1))).getByRole("button", { name: "w0" }));
    await user.click(within(group(S.editor.operand(2))).getByRole("button", { name: "w0" }));
    await user.click(within(group(S.editor.operand(3))).getByRole("button", { name: "w1" }));
    expect(latest).toBe("sub w0, w0, w1");

    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    await user.click(within(group(S.editor.instruction)).getByRole("button", { name: "ret" }));
    expect(latest).toBe("sub w0, w0, w1\nret");
    expect(gradeWritten(written, { text: latest }).passed).toBe(true);
  });

  it("fixes the starting point by tapping its line, then two chips", async () => {
    const user = userEvent.setup();
    let latest: string | undefined;
    render(<Harness start={{ text: "sub w0, w1, w0\nret" }} seen={(t) => (latest = t)} />);
    await user.click(mode(S.editor.tap));
    const rows = screen.getAllByRole("listitem");
    await user.click(within(rows[0]!).getByRole("button", { name: /sub w0, w1, w0/ }));
    await user.click(within(group(S.editor.operand(2))).getByRole("button", { name: "w0" }));
    await user.click(within(group(S.editor.operand(3))).getByRole("button", { name: "w1" }));
    expect(latest).toBe("sub w0, w0, w1\nret");
    expect(gradeWritten(written, { text: latest }).passed).toBe(true);
  });

  it("offers only the instructions the challenge allows and only the registers it offers", async () => {
    const user = userEvent.setup();
    render(<Harness start={{ text: "sub w0, w1, w0" }} />);
    await user.click(mode(S.editor.tap));
    await user.click(screen.getByRole("button", { name: /sub w0, w1, w0/ }));
    const chips = (name: string) =>
      within(group(name))
        .getAllByRole("button")
        .map((b) => b.textContent);
    expect(chips(S.editor.instruction)).toEqual(["add", "sub", "ret"]);
    expect(chips(S.editor.operand(1))).toEqual(["w0", "w1", "w2", "w3"]);
    // The last operand may also be a number.
    expect(chips(S.editor.operand(3))).toEqual(["w0", "w1", "w2", "w3", S.editor.number]);
    expect(within(group(S.editor.operand(1))).getByRole("button", { name: "w0" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("takes a constant from the number pad", async () => {
    const user = userEvent.setup();
    let latest: string | undefined;
    render(<Harness start={{ text: "" }} seen={(t) => (latest = t)} />);
    await user.click(mode(S.editor.tap));
    await user.click(screen.getByRole("button", { name: S.editor.addFirst }));
    await user.click(within(group(S.editor.instruction)).getByRole("button", { name: "add" }));
    await user.click(within(group(S.editor.operand(1))).getByRole("button", { name: "w0" }));
    await user.click(within(group(S.editor.operand(2))).getByRole("button", { name: "w0" }));
    await user.click(
      within(group(S.editor.operand(3))).getByRole("button", { name: S.editor.number }),
    );
    const pad = group(S.editor.numberPad);
    await user.click(within(pad).getByRole("button", { name: "5" }));
    await user.click(within(pad).getByRole("button", { name: "0" }));
    expect(latest).toBe("add w0, w0, #50");
    expect(within(pad).getByText(S.editor.numberShown("50"))).toBeInTheDocument();
    await user.click(within(pad).getByRole("button", { name: S.editor.deleteDigit }));
    expect(latest).toBe("add w0, w0, #5");
    await user.click(within(pad).getByRole("button", { name: S.editor.clearNumber }));
    expect(latest).toBe("add w0, w0");
  });

  it("shows the machine's sentence on the line while the line is being built", async () => {
    const user = userEvent.setup();
    render(<Harness start={{ text: "" }} />);
    await user.click(mode(S.editor.tap));
    await user.click(screen.getByRole("button", { name: S.editor.addFirst }));
    await user.click(within(group(S.editor.instruction)).getByRole("button", { name: "sub" }));
    const row = screen.getByRole("listitem");
    expect(row).toHaveTextContent(sentence("operands.few", { text: "sub" }).replaceAll("`", ""));
    await user.click(within(group(S.editor.operand(1))).getByRole("button", { name: "w0" }));
    await user.click(within(group(S.editor.operand(2))).getByRole("button", { name: "w0" }));
    await user.click(within(group(S.editor.operand(3))).getByRole("button", { name: "w1" }));
    expect(row).not.toHaveTextContent(/needs more operands/);
  });

  it("adds a line below, deletes a line and moves a line up and down", async () => {
    const user = userEvent.setup();
    let latest: string | undefined;
    render(
      <Harness
        start={{ text: "add w0, w0, w1\nsub w0, w0, w2\nret" }}
        seen={(t) => (latest = t)}
      />,
    );
    await user.click(mode(S.editor.tap));
    const open = async (n: number) =>
      user.click(within(screen.getAllByRole("listitem")[n]!).getAllByRole("button")[0]!);
    await open(0);
    await user.click(screen.getByRole("button", { name: S.editor.down }));
    expect(latest).toBe("sub w0, w0, w2\nadd w0, w0, w1\nret");
    await user.click(screen.getByRole("button", { name: S.editor.up }));
    expect(latest).toBe("add w0, w0, w1\nsub w0, w0, w2\nret");
    await user.click(screen.getByRole("button", { name: S.editor.addBelow }));
    expect(latest).toBe("add w0, w0, w1\n\nsub w0, w0, w2\nret");
    await user.click(screen.getByRole("button", { name: S.editor.remove }));
    expect(latest).toBe("add w0, w0, w1\nsub w0, w0, w2\nret");
    expect(screen.queryByRole("group", { name: /Editing line/ })).toBeNull();
  });

  it("will not move the first line up or the last line down", async () => {
    const user = userEvent.setup();
    render(<Harness start={{ text: "add w0, w0, w1\nret" }} />);
    await user.click(mode(S.editor.tap));
    await user.click(within(screen.getAllByRole("listitem")[0]!).getAllByRole("button")[0]!);
    expect(screen.getByRole("button", { name: S.editor.up })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: S.editor.done }));
    await user.click(within(screen.getAllByRole("listitem")[1]!).getAllByRole("button")[0]!);
    expect(screen.getByRole("button", { name: S.editor.down })).toBeDisabled();
  });

  it("opens a line that is not an instruction the chips can build, and says so", async () => {
    const user = userEvent.setup();
    render(<Harness start={{ text: "ldr x0, [x1]" }} />);
    await user.click(mode(S.editor.tap));
    await user.click(screen.getByRole("button", { name: /ldr x0, \[x1\]/ }));
    expect(screen.getByText(S.editor.notEditable)).toBeInTheDocument();
  });
});

describe("text mode", () => {
  it("is a monospaced box with autocorrect, capitalisation and spellcheck off", () => {
    render(<Harness start={{ text: "ret" }} />);
    const box = textBox();
    expect(box).toHaveAttribute("autocapitalize", "off");
    expect(box).toHaveAttribute("autocorrect", "off");
    expect(box).toHaveAttribute("spellcheck", "false");
    expect(box.value).toBe("ret");
    expect(mode(S.editor.text)).toHaveAttribute("aria-pressed", "true");
  });

  it("has a bar that types , [ ] # ! w and x at the cursor", async () => {
    const user = userEvent.setup();
    render(<Harness start={{ text: "add 0" }} />);
    expect(SYMBOLS).toEqual([",", "[", "]", "#", "!", "w", "x"]);
    const box = textBox();
    box.setSelectionRange(4, 4);
    await user.click(screen.getByRole("button", { name: S.editor.insert("#") }));
    expect(box.value).toBe("add #0");
    expect(box.selectionStart).toBe(5);
    await user.click(screen.getByRole("button", { name: S.editor.insert("w") }));
    expect(box.value).toBe("add #w0");
    // A selection is replaced by the character.
    box.setSelectionRange(0, 3);
    await user.click(screen.getByRole("button", { name: S.editor.insert("x") }));
    expect(box.value).toBe("x #w0");
    for (const c of SYMBOLS)
      expect(screen.getByRole("button", { name: S.editor.insert(c) })).toBeInTheDocument();
  });

  it("types into the text, line by line", async () => {
    const user = userEvent.setup();
    let latest: string | undefined;
    render(<Harness start={{ text: "" }} seen={(t) => (latest = t)} />);
    await user.type(textBox(), "sub w0, w0, w1{Enter}ret");
    expect(latest).toBe("sub w0, w0, w1\nret");
  });

  it("lists each problem against its line, in the machine's sentence", async () => {
    const user = userEvent.setup();
    render(<Harness start={{ text: "sub w0, w0, w1\nmov w0, w1" }} />);
    const problems = screen.getByRole("list", { name: S.editor.problems });
    expect(problems).toHaveTextContent(/^Line 2: You have not met mov yet/);
    await user.clear(textBox());
    expect(screen.queryByRole("list", { name: S.editor.problems })).toBeNull();
  });
});

describe("the two modes", () => {
  it("share one text: switching either way loses nothing", async () => {
    const user = userEvent.setup();
    const typed = "sub w0, w0, w1\n\nret\n  add w9";
    render(<Harness start={{ text: typed }} />);
    expect(textBox().value).toBe(typed);
    await user.click(mode(S.editor.tap));
    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    await user.click(mode(S.editor.text));
    expect(textBox().value).toBe(typed);
  });

  it("remembers the mode last used, where the browser keeps it", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<Harness start={{ text: "ret" }} />);
    await user.click(mode(S.editor.tap));
    unmount();
    render(<Harness start={{ text: "ret" }} />);
    expect(mode(S.editor.tap)).toHaveAttribute("aria-pressed", "true");
  });

  it("starts in text mode when the browser keeps nothing", () => {
    render(<Harness start={{ text: "ret" }} />);
    expect(mode(S.editor.tap)).toHaveAttribute("aria-pressed", "false");
  });
});
