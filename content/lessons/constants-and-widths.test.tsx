// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// The second lesson of Module 1 as content: it parses and passes the schema's checks and the term
// gate, it names only figures and a model the book has, it uses only the instructions the course
// has met, each challenge's reference passes its tests and its starting point does not, a wrong
// answer is answered without the right value, and the whole page renders with no figure problem.

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ChallengeEditor,
  INTERACTIVES,
  STEPS,
  VIEW_STRINGS,
  createBook,
  fieldList,
  grade,
  introducedOf,
  parseListing,
} from "@al/views";
import { assemble, message } from "@al/machine";
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
import { constantsAndWidths } from "./constants-and-widths";

const lesson = LESSONS.find((l) => l.id === "constants-and-widths")!;
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
  it("parses and passes the schema's checks: ten sections in order, every challenge mounted", () => {
    expect(() => parseLesson(constantsAndWidths)).not.toThrow();
    expect(checkLesson(lesson)).toEqual([]);
    expect(lesson.sections.map((s) => s.kind)).toEqual([...SECTION_KINDS]);
    expect([lesson.module, lesson.order]).toEqual([1, 1]);
  });

  it("introduces its terms, and passes the term gate with every other lesson", () => {
    expect(lesson.introduces).toEqual(["w register", "x register", "remainder"]);
    expect(termProblems(LESSONS)).toEqual([]);
  });

  it("uses none of the terms later modules introduce", () => {
    const withheld =
      /\b(flags?|carry|carries|overflow|sign[- ]extension|address(es)?|stack|link register|calling convention)\b/i;
    expect(text.filter((t) => withheld.test(t))).toEqual([]);
  });

  it("shows only instructions the lessons so far have introduced: add, sub and ret, then mov and movk", () => {
    const shown = programsOf(lesson).flatMap(mnemonics);
    expect([...new Set(shown)].sort()).toEqual(["add", "mov", "movk", "ret"]);
    const written = challenge("build-1000000");
    expect(written.allowedConstructs).toEqual(["mov", "movk", "ret"]);
    expect(written.palette).toEqual(["w0"]);
  });

  it("carries an originality note, as the plan states it", () => {
    expect(lesson.originalityNote.textbookExample).toContain("immediate");
    expect(lesson.originalityNote.howThisDiffers).toContain("mov w0, 1000000");
  });

  it("names only figures the book has, and only the model the book has a note for", () => {
    for (const s of lesson.sections)
      for (const x of s.interactives)
        if (x.kind !== "challenge") expect(Object.keys(INTERACTIVES)).toContain(x.kind);
    expect(modelProblems(LESSONS, [STEPS])).toEqual([]);
    expect(Object.keys(book.timeModelNotes)).toEqual([STEPS]);
  });

  it("gates the tester and the halves behind the predictions before them, in the same lesson", () => {
    const ids = lesson.sections.flatMap((s) => s.interactives.map((x) => x.id));
    const gated = lesson.sections
      .flatMap((s) => s.interactives)
      .filter((x) => typeof x.props["after"] === "string");
    expect(gated.map((x) => [x.id, x.props["after"]])).toEqual([
      ["try-a-number", "predict-fits"],
      ["x3-halves", "predict-width"],
    ]);
    for (const x of gated)
      expect(ids.indexOf(x.props["after"] as string), x.id).toBeLessThan(ids.indexOf(x.id));
  });

  it("puts the closed note after the tester's section prose, as a note the learner opens", () => {
    const investigation = lesson.sections[3]!;
    expect(investigation.details?.summary).toBe("Other patterns that fit");
    expect(investigation.details?.prose).toContain("65537");
  });
});

describe("the improvement pass", () => {
  it("keeps the title, and closes with what you now know, a question and its answer in a closed note", () => {
    expect(lesson.title).toBe("Constants and widths");
    const last = lesson.sections[9]!;
    expect(last.title).toBe("What you now know");
    expect(last.prose).toContain("`mov w5, 7`");
    expect(last.details?.summary).toBe("Answer");
    expect(last.details?.prose).toContain("`x5` holds 7.");
    expect(last.prose).not.toContain("holds 7");
  });

  it("has the compiler note as the first section's closed note", () => {
    const first = lesson.sections[0]!;
    expect(first.details?.summary).toBe("Which compiler?");
    expect(first.details?.prose).toContain("GCC 16.1");
    expect(first.prose).not.toContain("GCC 16.1");
  });

  it("draws w0 in halves of 16 for service_interval, then for the worked movk example, then for the learner's own solution", () => {
    const modes = lesson.sections.flatMap((s) =>
      s.interactives
        .filter((x) => x.kind === "wide-stepper")
        .map((x) => [x.id, x.props["mode"], x.props["register"]]),
    );
    expect(modes).toEqual([
      ["service-halves", "w16", 0],
      ["movk-halves", "w16", 0],
      ["solution-halves", "w16", 0],
      ["x3-halves", "x64-named", 3],
    ]);
  });

  it("takes the solution stepper's program from the saved work for Build 1000000, never from the lesson", () => {
    const stepper = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.id === "solution-halves")!;
    expect(stepper.props["fromChallenge"]).toBe("build-1000000");
    expect(stepper.props["program"]).toBeUndefined();
    expect(JSON.stringify(stepper.props)).not.toMatch(/16960|movk|0xf\b/);
    // Nothing of the reference solution is in the lesson's data before the last challenge's section
    // (which shows four instructions of its own, whose numbers happen to be the same).
    const before = JSON.stringify(
      lesson.sections.slice(0, 8).map((s) => [s.prose, s.details, s.interactives]),
    );
    expect(before).not.toContain("16960");
    expect(before).not.toContain("0xf,");
  });

  it("puts the words for a passed Build 1000000 before the stepper through the solution, gated by the challenge", () => {
    const ids = lesson.sections.flatMap((s) => s.interactives.map((x) => x.id));
    const note = lesson.sections
      .flatMap((s) => s.interactives)
      .find((x) => x.id === "build-1000000-solved")!;
    expect(note.kind).toBe("challenge-note");
    expect(note.props["afterChallenge"]).toBe("build-1000000");
    expect(String(note.props["text"])).toContain("Step through your solution below");
    expect(ids.indexOf("build-1000000")).toBeLessThan(ids.indexOf("build-1000000-solved"));
    expect(ids.indexOf("build-1000000-solved")).toBeLessThan(ids.indexOf("solution-halves"));
  });

  it("shows the solution stepper and its words only when the saved work passes Build 1000000", () => {
    const page = (text?: string) => {
      const storage = memoryStorage();
      if (text !== undefined)
        storage.set(
          `assembly-lab:v1:${lesson.id}`,
          JSON.stringify({
            version: 1,
            slots: {},
            challenges: {
              "build-1000000": { artifact: { text }, attempts: 1, hintsRevealed: 0 },
            },
          }),
        );
      return render(<LessonView book={book} lesson={lesson} storage={storage} />);
    };
    const stepper = (c: HTMLElement) => c.querySelector("#ix-solution-halves")!;
    const words = "Step through your solution below";
    for (const text of [undefined, "mov w0, 16960\nret", "mov w0, 16960\nmovk w0, 15, lsl 16"]) {
      const view = page(text);
      expect(stepper(view.container).querySelector(".al-locked"), String(text)).not.toBeNull();
      expect(stepper(view.container).querySelector(".al-h16"), String(text)).toBeNull();
      expect(stepper(view.container).querySelector(".al-controls"), String(text)).toBeNull();
      expect(view.container.textContent, String(text)).not.toContain(words);
      view.unmount();
    }
    const passed = page("mov w0, 16960\nmovk w0, 15, lsl 16\nret");
    expect(stepper(passed.container).querySelector(".al-locked")).toBeNull();
    expect(stepper(passed.container).querySelectorAll(".al-h16")).toHaveLength(2);
    expect(passed.container.textContent).toContain(words);
  });
});

describe("the challenges", () => {
  it.each(["build-1000000", "predict-two-registers"])(
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

  it("build-1000000: the starting text is blocked with the machine's sentence against line 1", () => {
    const c = challenge("build-1000000");
    const verdict = grade(c, c.initial);
    expect(verdict.passed).toBe(false);
    expect(verdict.blocked).toBe("Line 1: No single instruction can put `1000000` in a register.");
  });

  it("build-1000000: the text the tap editor builds passes, and so does movk alone with the lower half first", () => {
    const c = challenge("build-1000000");
    expect(grade(c, { text: "mov w0, #16960\nmovk w0, #15, lsl 16\nret" }).passed).toBe(true);
    expect(grade(c, { text: "movk w0, #16960\nmovk w0, #15, lsl 16\nret" }).passed).toBe(true);
  });

  it("build-1000000: only the lower half, or no ret, or an instruction not yet met, does not pass", () => {
    const c = challenge("build-1000000");
    const lower = grade(c, { text: "mov w0, 16960\nret" });
    expect(lower.passed).toBe(false);
    expect(lower.failures[0]?.actual).toEqual({ w0: "16960" });
    expect(grade(c, { text: "mov w0, 16960\nmovk w0, 15, lsl 16" }).passed).toBe(false);
    const gate = grade(c, { text: "mov w0, 16960\nadd w0, w0, 1\nret" });
    expect(gate.passed).toBe(false);
    expect(gate.blocked).toContain("Line 2:");
  });

  it("build-1000000: add and sub are met (Module 0) but not allowed here, and the sentence says what is allowed", () => {
    const c = challenge("build-1000000");
    const allowedHere = message("gate.notAllowedHere", { allowed: "`mov`, `movk` and `ret`" });
    expect(allowedHere).toBe("This challenge allows only `mov`, `movk` and `ret`.");
    for (const line of ["add w0, w0, 15", "sub w0, w0, 1"]) {
      const verdict = grade(c, { text: `mov w0, 16960\n${line}\nret` });
      expect(verdict.blocked, line).toBe(`Line 2: ${allowedHere}`);
      expect(verdict.blocked, line).not.toContain("not met");
      expect(verdict.blocked, line).not.toContain("yet");
    }
  });

  it("build-1000000: an instruction no lesson so far has introduced is still not met yet", () => {
    const c = challenge("build-1000000");
    // adds, subs and neg are Module 2's second lesson; b is in no lesson yet.
    for (const line of ["adds w0, w0, 1", "neg w0, w0", "b done"]) {
      const verdict = grade(c, { text: `mov w0, 16960\n${line}\nret` });
      expect(verdict.blocked, line).toContain("You have not met");
      expect(verdict.blocked, line).not.toContain("allows only");
    }
  });

  it("build-1000000: the editor shows the same sentence against the line", () => {
    const c = challenge("build-1000000");
    expect(introducedOf(c)).toEqual(new Set(["add", "sub", "ret", "mov", "movk"]));
    const errors = assemble("mov w0, 1\nadd w0, w0, 15\nret", {
      allowed: new Set(c.allowedConstructs),
      introduced: introducedOf(c),
    }).errors;
    expect(errors.map((e) => [e.line, e.key])).toEqual([[2, "gate.notAllowedHere"]]);
  });

  it("build-1000000: the keyboard row has the comma and w only, and the tap mode only w0", () => {
    const c = challenge("build-1000000");
    expect(c.initial.data?.["editor"]).toEqual({
      symbols: [",", "w"],
      registers: ["w0"],
      numberPad: true,
    });
    const { container } = render(
      <ChallengeEditor lesson={lesson} challenge={c} artifact={c.initial} onChange={() => {}} />,
    );
    expect([...container.querySelectorAll(".asm-bar .asm-key")].map((k) => k.textContent)).toEqual([
      ",",
      "w",
    ]);
  });

  it("the figures before the challenge hold neither of odometer_limit's instructions", () => {
    const construction = lesson.sections.findIndex((s) => s.kind === "construction");
    const props = lesson.sections
      .slice(0, construction)
      .flatMap((s) => s.interactives.map((x) => JSON.stringify(x.props)))
      .join("\n");
    expect(props).not.toContain("16960");
    expect(props).not.toContain("movk");
    expect(props).not.toContain("odometer_limit");
    // service_interval stays, with its test against the recorded listing.
    expect(props).toContain("service_interval");
  });

  it("the words before Build 1000000 give neither of 1000000's halves, in hexadecimal or decimal", () => {
    const construction = lesson.sections.findIndex((s) => s.kind === "construction");
    const words = lesson.sections
      .slice(0, construction)
      .flatMap((s) => [s.title, s.prose, s.details?.prose ?? ""])
      .join("\n");
    // The prediction names 1000000 as the Question's number and prints the halves of the other three.
    expect(words).toContain("0x0001 1170");
    expect(words).toContain("The fourth, 1000000, is the odometer limit from the first section");
    for (const half of ["0x000f 4240", "0x000f4240", "4240", "16960", "0xf,"])
      expect(words).not.toContain(half);
  });

  it("build-1000000: a second mov replaces the whole register, so mov then mov does not pass", () => {
    const c = challenge("build-1000000");
    expect(grade(c, { text: "mov w0, 16960\nmov w0, 15\nret" }).passed).toBe(false);
  });

  it("predict-two-registers: the answer a 32-bit comparison would let through fails", () => {
    const c = challenge("predict-two-registers");
    const kept = grade(c, { answers: { x1: String(0xffffffff00000005n), w2: "1000000" } });
    expect(kept.failures.map((f) => f.label)).toEqual(["x1 at the end"]);
    expect(JSON.stringify(kept)).not.toMatch(/\b5\b/);
    const wrapped = grade(c, { answers: { x1: "5", w2: String(1000000 + 2 ** 32) } });
    expect(wrapped.failures.map((f) => f.label)).toEqual(["w2 at the end"]);
  });

  it("predict-two-registers: a hexadecimal answer is refused as a number not written in decimal, not as 'not a whole number'", () => {
    const c = challenge("predict-two-registers");
    const verdict = grade(c, { answers: { x1: "0x5", w2: "1000000" } });
    expect(verdict.passed).toBe(false);
    expect(verdict.blocked).toBe(VIEW_STRINGS.grader.notWhole("x1 at the end"));
    expect(verdict.blocked).toBe(
      "The answer for x1 at the end must be a whole number written in decimal.",
    );
    // Hexadecimal is still not accepted.
    expect(grade(c, { answers: { x1: "0x5", w2: "0x000f4240" } }).passed).toBe(false);
  });

  it("predict-two-registers: asks for both numbers before it grades anything", () => {
    const c = challenge("predict-two-registers");
    const verdict = grade(c, { answers: { x1: "5" } });
    expect(verdict.blocked).toBe(VIEW_STRINGS.grader.unanswered(fieldList(["w2 at the end"]), 1));
  });
});

describe("the page", () => {
  it("renders every section and figure with no problem note", () => {
    const { container } = render(
      <LessonView book={book} lesson={lesson} storage={memoryStorage()} />,
    );
    expect(container.querySelectorAll("section.lesson-section")).toHaveLength(10);
    const problems = [...container.querySelectorAll(".interactive-problem, .interactive-missing")];
    expect(problems.map((p) => p.textContent)).toEqual([]);
    // The tester and the x3 figure wait for their predictions, and the stepper through the learner's
    // own solution waits for the challenge; nothing of any of them is on the page yet.
    expect(container.querySelectorAll(".al-locked")).toHaveLength(3);
    expect(container.querySelectorAll(".al-outcome")).toHaveLength(0);
    expect(container.querySelectorAll("section.challenge")).toHaveLength(2);
    // The compiler note, the other patterns that fit, and the closing question's answer.
    expect(container.querySelectorAll("details.lesson-details")).toHaveLength(3);
    // The two figures that draw a `w` register in halves of 16 and need nothing first.
    expect(
      container.querySelectorAll('[data-figure="wide-stepper"][data-mode="w16"]'),
    ).toHaveLength(2);
  });
});
