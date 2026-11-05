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
const field = (id: string) => screen.getByRole("textbox", { name: names[id]! });

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

describe("aligned four-bit answer editor", () => {
  it("supplies only the public first input and keeps the existing answer identities", () => {
    const { container } = editor();
    expect(container.querySelector('[data-row="first"] code')).toHaveTextContent("0110");
    for (const id of ["negated", "result"]) {
      expect(field(id)).toHaveValue("");
      expect(field(id)).toHaveAttribute("id", `answer-${challenge.id}-${id}`);
      expect(field(id)).toHaveAttribute("inputmode", "numeric");
      expect(field(id)).not.toHaveAttribute("maxlength");
    }
    for (const bit of [3, 2, 1, 0])
      expect(screen.getByRole("textbox", { name: S.carryNote(bit) })).toHaveValue("");
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(
      screen.getAllByRole("radio").every((input) => !(input as HTMLInputElement).checked),
    ).toBe(true);
  });

  it("normalises pasted whitespace while preserving invalid, partial and five-bit work", async () => {
    const user = userEvent.setup();
    const view = editor();
    await user.click(field("result"));
    await user.paste(" 00 11 ");
    expect(field("result")).toHaveValue("0011");
    expect(view.saved().answers?.["result"]).toBe("0011");
    for (const value of ["1", "00x1", "10011"]) {
      fireEvent.change(field("result"), { target: { value } });
      expect(field("result")).toHaveValue(value);
      expect(view.saved().answers?.["result"]).toBe(value);
      expect(
        grade(challenge, {
          ...view.saved(),
          answers: { ...challenge.reference.answers, result: value },
        }).passed,
      ).toBe(false);
    }
    fireEvent.change(field("negated"), { target: { value: "1100" } });
    expect(field("negated")).toHaveValue("1100");
    expect(field("result")).toHaveValue("10011");
  });

  it("keeps optional notes separate from answers, restores both and leaves grading unchanged", () => {
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
    fireEvent.change(field("negated"), { target: { value: "1100" } });
    expect(view.saved().data?.["fourBitCarryNotes"]).toEqual({ "2": "9" });
    expect(grade(challenge, view.saved()).passed).toBe(false);
    const saved = view.saved();
    view.unmount();
    const restored = editor(saved);
    expect(field("negated")).toHaveValue("1100");
    expect(screen.getByRole("textbox", { name: S.carryNote(2) })).toHaveValue("9");
    restored.unmount();
    editor();
    expect(field("negated")).toHaveValue("");
    expect(screen.getByRole("textbox", { name: S.carryNote(2) })).toHaveValue("");
  });

  it("leaves answer editors without the explicit configuration unchanged", () => {
    const { container } = editor({}, { ...challenge, initial: { answers: {} } });
    expect(container.querySelector(".al-four-workspace")).toBeNull();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(field("negated")).toHaveValue("");
  });
});
