// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Challenge, type Artifact, type Lesson } from "@platform/lesson-schema";
import { describe, expect, it } from "vitest";
import { fourBitArithmetic } from "../../../content/lessons/four-bit-arithmetic";
import { ChallengeEditor } from "./book";
import { grade } from "./grader";
import { FOUR_BIT_STRINGS as S } from "./strings.four-bit-arithmetic";

const challenge = Challenge.parse(fourBitArithmetic.challenges?.[0]);
const names = Object.fromEntries(challenge.fields.map((f) => [f.id, f.label]));
const field = (id: string, bit = 3) =>
  screen.getByRole("textbox", { name: S.answerBit(names[id]!, bit) });
const values = (id: string) =>
  [3, 2, 1, 0].map((bit) => (field(id, bit) as HTMLInputElement).value);
const paste = (id: string, text: string, bit = 3) =>
  fireEvent.paste(field(id, bit), { clipboardData: { getData: () => text } });

function editor(initial: Artifact = challenge.initial, selected = challenge) {
  let current = initial;
  function Harness() {
    const [artifact, setArtifact] = useState(initial);
    return (
      <ChallengeEditor
        lesson={{ id: "four-bit-arithmetic" } as Lesson}
        challenge={selected}
        artifact={artifact}
        onChange={(next) => {
          current = next;
          setArtifact(next);
        }}
      />
    );
  }
  return { ...render(<Harness />), saved: () => current };
}

describe("four-bit answer cells", () => {
  it("supplies only public bits and gives every editable position an accessible name", () => {
    const { container } = editor();
    expect(
      [...container.querySelectorAll('[data-row="first"] code')]
        .map((cell) => cell.textContent)
        .join(""),
    ).toBe("0110");
    for (const id of ["negated", "result"]) {
      expect(screen.getByRole("group", { name: names[id]! })).toBeInTheDocument();
      expect(values(id)).toEqual(["", "", "", ""]);
      for (const bit of [3, 2, 1, 0]) {
        expect(field(id, bit)).toHaveAttribute("inputmode", "numeric");
        expect(field(id, bit)).not.toHaveAttribute("maxlength");
      }
    }
    for (const bit of [3, 2, 1, 0])
      expect(screen.getByRole("textbox", { name: S.carryNote(bit) })).toHaveValue("");
    expect(screen.getAllByRole("textbox")).toHaveLength(12);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(
      screen.getAllByRole("radio").every((input) => !(input as HTMLInputElement).checked),
    ).toBe(true);
  });

  it("pastes complete patterns from any cell and rejects malformed or overlong attempts explicitly", () => {
    const view = editor();
    paste("result", " 00 11 ", 1);
    expect(values("result")).toEqual(["0", "0", "1", "1"]);
    expect(view.saved().answers?.["result"]).toBe("0011");
    for (const value of ["00x1", "10011", "2"]) {
      paste("result", value);
      expect(screen.getByRole("alert")).toHaveTextContent(S.bitEntryError);
      expect(values("result")).toEqual(["0", "0", "1", "1"]);
      expect(view.saved().answers?.["result"]).toBe("0011");
    }
    paste("result", "11", 0);
    expect(screen.getByRole("alert")).toHaveTextContent(S.bitEntryError);
    expect(view.saved().answers?.["result"]).toBe("0011");
    paste("result", "10", 1);
    expect(values("result")).toEqual(["0", "0", "1", "0"]);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("keeps holes in their columns without supplying leading zeroes and restores them", () => {
    const view = editor();
    paste("result", "11", 1);
    expect(values("result")).toEqual(["", "", "1", "1"]);
    expect(view.saved().answers?.["result"]).toBe("__11");
    expect(
      grade(challenge, { answers: { ...challenge.reference.answers, result: "__11" } }).passed,
    ).toBe(false);
    const saved = view.saved();
    view.unmount();
    editor(saved);
    expect(values("result")).toEqual(["", "", "1", "1"]);
    fireEvent.change(field("result", 3), { target: { value: "0" } });
    fireEvent.change(field("result", 2), { target: { value: "0" } });
    expect(values("result")).toEqual(["0", "0", "1", "1"]);
  });

  it("supports typing, arrows, replacement, backspace and delete without inserting bits", async () => {
    const user = userEvent.setup();
    const view = editor();
    await user.click(field("result"));
    await user.keyboard("0011");
    expect(values("result")).toEqual(["0", "0", "1", "1"]);
    expect(field("result", 0)).toHaveFocus();
    await user.keyboard("1");
    expect(screen.getByRole("alert")).toHaveTextContent(S.bitEntryError);
    expect(view.saved().answers?.["result"]).toBe("0011");
    await user.keyboard("{ArrowLeft}{Backspace}");
    expect(values("result")).toEqual(["0", "0", "", "1"]);
    expect(field("result", 1)).toHaveFocus();
    await user.keyboard("{Backspace}");
    expect(values("result")).toEqual(["0", "", "", "1"]);
    expect(field("result", 2)).toHaveFocus();
    await user.keyboard("{Home}{Delete}{End}{Delete}");
    expect(values("result")).toEqual(["", "", "", ""]);
    expect(view.saved().answers?.["result"]).toBe("");
    await user.keyboard("{Home}1{ArrowLeft}0");
    expect(values("result")).toEqual(["0", "", "", ""]);
  });

  it("keeps notes separate, restores saved work and leaves the existing grader authoritative", () => {
    const initial = {
      ...challenge.initial,
      answers: { ...challenge.reference.answers },
      data: { ...challenge.initial.data, unrelated: "preserved" },
    };
    const view = editor(initial);
    fireEvent.change(screen.getByRole("textbox", { name: S.carryNote(2) }), {
      target: { value: "9" },
    });
    expect(view.saved().data).toMatchObject({
      unrelated: "preserved",
      fourBitCarryNotes: { "2": "9" },
    });
    expect(view.saved().answers).toEqual(challenge.reference.answers);
    expect(grade(challenge, view.saved()).passed).toBe(true);
    paste("negated", "1100");
    expect(view.saved().data?.["fourBitCarryNotes"]).toEqual({ "2": "9" });
    expect(grade(challenge, view.saved()).passed).toBe(false);
    const saved = view.saved();
    view.unmount();
    const restored = editor(saved);
    expect(values("negated")).toEqual(["1", "1", "0", "0"]);
    expect(screen.getByRole("textbox", { name: S.carryNote(2) })).toHaveValue("9");
    restored.unmount();
    editor();
    expect(values("negated")).toEqual(["", "", "", ""]);
    expect(screen.getByRole("textbox", { name: S.carryNote(2) })).toHaveValue("");
  });

  it("retains malformed saved patterns visibly and cannot make them pass by rendering", () => {
    const view = editor({ answers: { ...challenge.reference.answers, result: "10011" } });
    expect(screen.getByRole("alert")).toHaveTextContent(S.savedBitEntry("10011"));
    expect(values("result")).toEqual(["", "", "", ""]);
    expect(view.saved().answers?.["result"]).toBe("10011");
    expect(grade(challenge, view.saved()).passed).toBe(false);
    fireEvent.change(field("result", 0), { target: { value: "1" } });
    expect(view.saved().answers?.["result"]).toBe("___1");
    expect(grade(challenge, view.saved()).passed).toBe(false);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("leaves answer editors without the explicit configuration unchanged", () => {
    const { container } = editor({}, { ...challenge, initial: { answers: {} } });
    expect(container.querySelector(".al-four-workspace")).toBeNull();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getByRole("textbox", { name: names["negated"]! })).toHaveValue("");
  });
});
