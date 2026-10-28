// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The first lesson of Module 1 as content: it parses and passes the schema's checks and the term
// gate, it names only figures and a model the book has, it uses only the instructions the course
// has met, each challenge's reference passes its tests and its starting point does not, a wrong
// answer is answered without the right value, and the whole page renders with no figure problem.

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  AnswerEditor,
  INTERACTIVES,
  STEPS,
  VIEW_STRINGS,
  createBook,
  grade,
  parseListing,
} from "@al/views";
import { LessonView, memoryStorage } from "@platform/lesson-runtime";
import {
  SECTION_KINDS,
  checkLesson,
  learnerText,
  modelProblems,
  parseLesson,
  termProblems,
  testCount,
} from "@platform/lesson-schema";

import { LESSONS } from ".";
import { onePatternThreeReadings } from "./one-pattern-three-readings";

const lesson = LESSONS.find((l) => l.id === "one-pattern-three-readings")!;
const book = createBook({ title: "Assembly Lab", lessons: LESSONS });
const challenge = (id: string) => lesson.challenges.find((c) => c.id === id)!;
const text = learnerText(lesson);

/** The programs a lesson's figures and challenges show: the listing of each, as lines of text. */
function programsOf(l: typeof lesson): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (typeof o["listing"] === "string") out.push(o["listing"]);
      Object.values(o).forEach(walk);
    }
  };
  for (const s of l.sections) for (const x of s.interactives) walk(x.props);
  for (const c of l.challenges) walk(c.initial.data);
  return out;
}

const mnemonics = (listing: string) => [
  ...new Set(
    parseListing(listing).flatMap((x) => (x.kind === "instruction" ? [x.text.split(" ")[0]!] : [])),
  ),
];

describe("the lesson", () => {
  it("parses and passes the schema's checks: selected sections in order, every challenge mounted", () => {
    expect(() => parseLesson(onePatternThreeReadings)).not.toThrow();
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((s) => s.kind)).toEqual(
      SECTION_KINDS.filter((kind) => !["motivation", "generalisation"].includes(kind)),
    );
    expect([lesson.module, lesson.order]).toEqual([1, 0]);
  });

  it("introduces its four terms, and passes the term gate with every other lesson", () => {
    expect(lesson.introduces).toEqual([
      "hexadecimal",
      "unsigned reading",
      "signed reading",
      "top bit",
    ]);
    expect(termProblems(LESSONS)).toEqual([]);
  });

  it("uses none of the terms and instructions the second lesson and later modules introduce", () => {
    const withheld =
      /\b(movk?|constants?|[wx] register|flags?|carry|carries|overflow|sign[- ]extension|address(es)?|stack|link register|calling convention)\b/i;
    expect(text.filter((t) => withheld.test(t.replace(/`[^`]*`/g, "")))).toEqual([]);
    // No code span names mov or movk either.
    expect(text.filter((t) => /`mov/.test(t))).toEqual([]);
  });

  it("shows only instructions the lessons so far have introduced: add, sub and ret", () => {
    const shown = programsOf(lesson).flatMap(mnemonics);
    expect(shown.length).toBeGreaterThan(0);
    expect([...new Set(shown)].sort()).toEqual(["add", "ret", "sub"]);
  });

  it("carries an originality note, as the plan states it", () => {
    expect(lesson.originalityNote.textbookExample).toContain("two's complement");
    expect(lesson.originalityNote.howThisDiffers).toContain("Module 0");
  });

  it("names only figures the book has, and only the model the book has a note for", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives)
        if (x.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(x.kind);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
    expect(book.timeModelNotes).toEqual({});
  });

  it("gates the stepper behind the prediction before it, in the same lesson", () => {
    const ids = lesson.sections.flatMap((s) => s.interactives.map((x) => x.id));
    const gated = lesson.sections
      .flatMap((s) => s.interactives)
      .filter((x) => typeof x.props["after"] === "string");
    expect(gated.map((x) => x.id)).toEqual(["step-add-12"]);
    for (const x of gated)
      expect(ids.indexOf(x.props["after"] as string), x.id).toBeLessThan(ids.indexOf(x.id));
  });

  it("asks both predictions before it shows what they are about", () => {
    const kinds = lesson.sections.flatMap((s) => s.interactives.map((x) => [x.id, x.kind]));
    expect(kinds).toEqual([
      ["run-fuel-used", "stepper"],
      ["predict-add-12", "trace-prediction"],
      ["step-add-12", "stepper"],
      ["read-register", "register-reader"],
      ["scratch-minus-one", "register-reader"],
      ["make-minus-one", "challenge"],
      ["make-minus-one-solved", "challenge-note"],
      ["compare-int-unsigned", "listing-compare"],
      ["two-readings-each", "challenge"],
    ]);
  });
});

describe("the improvement pass", () => {
  it("is titled Same bits, two readings, and keeps its id, so its route and its stored work stay", () => {
    expect(lesson.title).toBe("Same bits, two readings");
    expect(lesson.id).toBe("one-pattern-three-readings");
  });

  it("closes with what you now know, a question, and its answer in a closed note", () => {
    const last = lesson.sections.find((section) => section.kind === "reflection")!;
    expect(last.title).toBe("What you now know");
    expect(last.prose).toContain("`0x80000001`");
    expect(last.details?.summary).toBe("Answer");
    expect(last.details?.prose).toContain("2147483649");
    // The answer is in the closed note only, not in the section's open words.
    expect(last.prose).not.toContain("2147483649");
    expect(last.prose).not.toContain("2147483647");
  });

  it("has the compiler note as the comparison's closed note, and the explanation only after the check", () => {
    const section = lesson.sections.find((section) => section.kind === "failureExperiment")!;
    expect(section.details?.summary).toBe("Which compiler?");
    expect(section.details?.prose).toContain("GCC 16.1");
    expect(section.prose).not.toContain("GCC 16.1");
    const compare = section.interactives[0]!;
    expect(String(compare.props["explain"])).toContain("GCC used the same `sub` instruction");
    expect(section.prose).not.toContain("GCC used the same");
  });

  it("starts the register to read at the model's pattern, with the top bit's table, and a hexadecimal box for Make −1", () => {
    const reader = lesson.sections.find((section) => section.kind === "investigation")!
      .interactives[0]!;
    expect(reader.kind).toBe("register-reader");
    expect(reader.props["topBit"]).toBe(true);
    expect(challenge("make-minus-one").initial.data).toEqual({ hexEntry: ["bits"] });
    expect(challenge("two-readings-each").initial.data).toBeUndefined();
  });

  it("shows the words about the solved Make −1 only when the saved work passes", () => {
    const solved =
      "With all 32 bits set, the signed reading is −1 and the unsigned reading is 4294967295.";
    const page = (answers?: Record<string, string>) => {
      const storage = memoryStorage();
      if (answers)
        storage.set(
          `assembly-lab:v1:${lesson.id}`,
          JSON.stringify({
            version: 1,
            slots: {},
            challenges: {
              "make-minus-one": { artifact: { answers }, attempts: 1, hintsRevealed: 0 },
            },
          }),
        );
      return render(<LessonView book={book} lesson={lesson} storage={storage} />);
    };
    for (const answers of [
      undefined,
      { bits: "1".repeat(31) + "0", unsigned: "4294967295" },
      { bits: "1".repeat(32), unsigned: "1" },
    ]) {
      const view = page(answers);
      expect(view.container.textContent, JSON.stringify(answers)).not.toContain(solved);
      view.unmount();
    }
    const passed = page({ bits: "1".repeat(32), unsigned: "4294967295" });
    expect(passed.container.textContent).toContain(solved);
  });
});

describe("the challenges", () => {
  it.each(["make-minus-one", "two-readings-each"])(
    "%s: the reference passes every test and the starting point does not",
    (id) => {
      const c = challenge(id);
      const passing = grade(c, c.reference);
      expect(passing.blocked).toBeUndefined();
      expect(passing.passed).toBe(true);
      expect(passing.total).toBe(testCount(c));
      expect(grade(c, c.initial).passed).toBe(false);
    },
  );

  it("make-minus-one: two tests, on a field of 32 bits and a number", () => {
    const c = challenge("make-minus-one");
    expect(testCount(c)).toBe(2);
    expect(c.fields.map((f) => [f.id, f.kind])).toEqual([
      ["bits", "bits"],
      ["unsigned", "number"],
    ]);
    expect(c.fields[0]).toMatchObject({ width: 32, weights: "signed" });
  });

  it("make-minus-one: the pattern for −12 is wrong, and says what it reads as, not what is right", () => {
    const c = challenge("make-minus-one");
    const verdict = grade(c, {
      answers: { bits: "1".repeat(28) + "0100", unsigned: "4294967284" },
    });
    expect(verdict.passed).toBe(false);
    expect(verdict.failures.map((f) => f.label)).toEqual(["the bits of w0"]);
    expect(verdict.failures[0]?.detail).toBe(VIEW_STRINGS.readings.bitsRead("−12"));
    expect(JSON.stringify(verdict)).not.toContain("4294967295");
  });

  it("make-minus-one: a number that is not the unsigned reading of the learner's bits is wrong", () => {
    const c = challenge("make-minus-one");
    const verdict = grade(c, { answers: { bits: "1".repeat(32), unsigned: "-1" } });
    expect(verdict.failures.map((f) => f.label)).toEqual(["its unsigned reading"]);
    expect(JSON.stringify(verdict)).not.toContain("4294967295");
  });

  it("two-readings-each: six tests, and a pair of readings swapped fails both", () => {
    const c = challenge("two-readings-each");
    expect(testCount(c)).toBe(6);
    const swapped = grade(c, {
      answers: {
        u1: "42",
        s1: "42",
        u2: "-2147483648",
        s2: "2147483648",
        u3: "-200",
        s3: "4294967096",
      },
    });
    expect(swapped.failures.map((f) => f.label)).toEqual([
      "unsigned reading of 0x80000000",
      "signed reading of 0x80000000",
      "unsigned reading of 0xffffff38",
      "signed reading of 0xffffff38",
    ]);
    expect(JSON.stringify(swapped.failures)).not.toMatch(/4294967096|2147483648/);
  });

  it("two-readings-each: the minus sign the lesson prints is accepted as a typed answer", () => {
    const c = challenge("two-readings-each");
    const answers = { ...c.reference.answers, s2: "−2147483648", s3: "−200" };
    expect(grade(c, { answers }).passed).toBe(true);
  });
});

describe("the answer boxes of Two readings each", () => {
  const modeOf = (field: string) => {
    const { container } = render(
      <AnswerEditor
        lesson={{} as typeof lesson}
        challenge={challenge("two-readings-each")}
        artifact={{}}
        onChange={() => {}}
      />,
    );
    return container.querySelector(`[data-field="${field}"] input`)?.getAttribute("inputmode");
  };

  it("give the three signed readings, which are negative or can be, the full keyboard", () => {
    // A number keypad has no minus sign on every phone, and −2147483648 and −200 are answers.
    expect(["s1", "s2", "s3"].map(modeOf)).toEqual(["text", "text", "text"]);
  });

  it("keep the number keypad for the three unsigned readings, which are never negative", () => {
    expect(["u1", "u2", "u3"].map(modeOf)).toEqual(["numeric", "numeric", "numeric"]);
  });

  it("still take the lowest signed answer the keyboard can give them", () => {
    const c = challenge("two-readings-each");
    expect(c.fields.filter((f) => f.min !== undefined).map((f) => [f.id, f.min])).toEqual([
      ["s1", -2147483648],
      ["s2", -2147483648],
      ["s3", -2147483648],
    ]);
  });
});

describe("the page", () => {
  it("renders every section and figure with no problem note", () => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    expect(container.querySelectorAll("section.lesson-section")).toHaveLength(
      lesson.sections.length,
    );
    const problems = [...container.querySelectorAll(".interactive-problem, .interactive-missing")];
    expect(problems.map((p) => p.textContent)).toEqual([]);
    // The stepper that adds 12 waits for its prediction; the comparison waits for its own.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(1);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll(".al-compare-result")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(2);
    expect(container.querySelectorAll('[data-figure="register-reader"]')).toHaveLength(2);
    const scratch = container.querySelector(".al-reader-scratch")!;
    expect(scratch.hasAttribute("open")).toBe(false);
    expect(scratch.querySelector('[data-reading="hex"]')?.textContent).toContain("00000000");
  });
});
