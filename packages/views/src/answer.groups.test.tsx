// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Answers that are chosen, drawn in groups, and graded with the rule of each wrong flag. A challenge
// may name groups in `initial.data.editor.groups`: each is a heading and the choices it holds, drawn
// as a compact row. Without it the editor is as it always was. A case may ask for the rule of each
// wrong flag (`given.feedback` is "rule"): its letter and what it is, never its value.

import { render, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Challenge, type Lesson } from "@platform/lesson-schema";

import { AnswerEditor } from "./AnswerEditor";
import { grade } from "./grader";
import { ARITH_STRINGS as A } from "./strings.arith";

const PLUS = { c: "", listing: "plus:\n  adds w0, w0, w1\n  ret" };
const ZERO_OR_ONE = [
  { value: "0", label: "0" },
  { value: "1", label: "1" },
];
const ADDITIONS = [
  { id: "first", text: "`0xffffffff` plus 1", w0: 0xffffffff, w1: 1 },
  { id: "second", text: "5 plus 3", w0: 5, w1: 3 },
];
const FLAGS = ["N", "Z", "C", "V"];

function challenge(grouped: boolean, rule: boolean) {
  return Challenge.parse({
    id: "flags",
    title: "Flags",
    task: "Give the flags.",
    gradedDirection: "answer",
    fields: ADDITIONS.flatMap((a) =>
      FLAGS.map((f) => ({
        id: `${a.id}-${f.toLowerCase()}`,
        label: `${f} for ${a.text}`,
        kind: "choice",
        options: ZERO_OR_ONE,
      })),
    ),
    initial: {
      data: {
        program: PLUS,
        ...(grouped
          ? {
              editor: {
                groups: ADDITIONS.map((a) => ({
                  label: a.text,
                  fields: FLAGS.map((f) => ({ id: `${a.id}-${f.toLowerCase()}`, label: f })),
                })),
              },
            }
          : {}),
      },
    },
    tests: {
      kind: "answers",
      grader: "outcomes-at-return",
      cases: ADDITIONS.map((a) => ({
        label: a.text,
        given: { entry: "plus", w0: a.w0, w1: a.w1, ...(rule ? { feedback: "rule" } : {}) },
        expect: Object.fromEntries(
          FLAGS.map((f) => [`${a.id}-${f.toLowerCase()}`, f.toLowerCase()]),
        ),
      })),
    },
    hints: ["a", "b", "c", "d", "e"],
    reference: {
      answers: {
        "first-n": "0",
        "first-z": "1",
        "first-c": "1",
        "first-v": "0",
        "second-n": "0",
        "second-z": "0",
        "second-c": "0",
        "second-v": "0",
      },
    },
  });
}

function editor(c: Challenge, artifact = {}, onChange: (a: object) => void = () => {}) {
  return render(
    <AnswerEditor lesson={{} as Lesson} challenge={c} artifact={artifact} onChange={onChange} />,
  );
}

// Rendering a whole lesson and pressing its buttons takes a while on a busy machine.
vi.setConfig({ testTimeout: 30_000 });

describe("answers chosen in groups", () => {
  it("draws one group for each addition, headed by it, with a compact row of N, Z, C and V in each", () => {
    const { container } = editor(challenge(true, false));
    const groups = container.querySelectorAll("fieldset.answer-group");
    expect(groups).toHaveLength(2);
    expect([...groups].map((g) => g.querySelector("legend")?.textContent)).toEqual([
      "0xffffffff plus 1",
      "5 plus 3",
    ]);
    for (const g of groups) {
      expect([...g.querySelectorAll(".answer-compact > legend")].map((l) => l.textContent)).toEqual(
        FLAGS,
      );
      expect(g.querySelectorAll("input[type=radio]")).toHaveLength(8);
    }
    expect(container.querySelectorAll("input[type=radio]:checked")).toHaveLength(0);
  });

  it("keeps each field by its own id, so the answers and the grader see the same fields as ever", async () => {
    const user = userEvent.setup();
    let artifact: { answers?: Record<string, string> } = {};
    const { container } = editor(challenge(true, false), artifact, (a) => (artifact = a));
    const first = container.querySelector('[data-field="first-c"]') as HTMLElement;
    await user.click(within(first).getByRole("radio", { name: "1" }));
    expect(artifact.answers).toEqual({ "first-c": "1" });
    expect(container.querySelectorAll(".answer-choice")).toHaveLength(8);
  });

  it("draws each field once: a choice that a group holds is not drawn again", () => {
    const { container } = editor(challenge(true, false));
    expect(container.querySelectorAll('[data-field="first-n"]')).toHaveLength(1);
    expect(container.querySelectorAll("input[type=radio]")).toHaveLength(16);
  });

  it("is the editor it always was for a challenge with no groups", () => {
    const { container } = editor(challenge(false, false));
    expect(container.querySelector(".answer-groups")).toBeNull();
    expect(container.querySelectorAll("fieldset.answer-choice")).toHaveLength(8);
    expect(container.querySelector("legend")?.textContent).toBe("N for 0xffffffff plus 1");
  });

  it("shows the checked answers it is given", () => {
    const { container } = editor(challenge(true, false), { answers: { "second-v": "1" } });
    expect(
      (container.querySelector('[data-field="second-v"] input[value="1"]') as HTMLInputElement)
        .checked,
    ).toBe(true);
  });
});

describe("a wrong flag, told by its rule", () => {
  const c = challenge(true, true);
  const right = c.reference.answers!;

  it("names each wrong flag with its own sentence, and nothing for the flags that are right", () => {
    const wrong = { ...right, "first-n": "1", "first-c": "0", "first-v": "1" };
    const verdict = grade(c, { answers: wrong });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures).toHaveLength(1);
    expect(verdict.failures[0]?.label).toBe("0xffffffff plus 1");
    expect(verdict.failures[0]?.detail).toBe(
      [
        A.grader.flagRuleLine("N", A.grader.flagRule.n),
        A.grader.flagRuleLine("C", A.grader.flagRule.c),
        A.grader.flagRuleLine("V", A.grader.flagRule.v),
      ].join(" "),
    );
    expect(verdict.failures[0]?.detail).not.toContain("Z:");
  });

  it("says the item's own words for each flag", () => {
    expect(A.grader.flagRule).toEqual({
      n: "N is the top bit of the 32-bit result.",
      z: "Z is 1 only when all 32 result bits are 0.",
      c: "C is the carry out of the top bit. Check whether a carry leaves bit 31.",
      v: "Compare the carry into the top bit with the carry out of it.",
    });
  });

  it("never says the value a wrong flag should have", () => {
    for (const flag of ["n", "z", "c", "v"]) {
      const value = flag === "z" || flag === "c" ? "0" : "1";
      const verdict = grade(c, { answers: { ...right, [`first-${flag}`]: value } });
      const detail = verdict.failures[0]?.detail ?? "";
      expect(detail, flag).toMatch(new RegExp(`^${flag.toUpperCase()}: `));
      // The sentences name no flag value: no "is 1" or "is 0" for the flag asked about but Z's rule,
      // which says when Z is 1 in general, of any addition.
      expect(JSON.stringify(verdict.failures[0]?.actual ?? {})).toBe("{}");
      expect(JSON.stringify(verdict.failures[0]?.expected ?? {})).toBe("{}");
    }
  });

  it("passes the right answers, and the answers stay: grading changes nothing the learner chose", () => {
    const answers = { ...right, "second-z": "1" };
    const before = JSON.stringify(answers);
    const verdict = grade(c, { answers });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["5 plus 3"]);
    expect(JSON.stringify(answers)).toBe(before);
    expect(grade(c, { answers: right }).passed).toBe(true);
  });

  it("falls back to the fixed sentence when a case does not ask for rules", () => {
    const plain = challenge(true, false);
    const verdict = grade(plain, { answers: { ...right, "first-c": "0" } });
    expect(verdict.failures[0]?.detail).toBe(A.grader.flagWrong);
  });
});
