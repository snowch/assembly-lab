// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 4's figures that show a run in stages, rendered: the panel of compare, condition and select
// beside the two listings, beside a stepper and beside the learner's own solution; the stepper's
// sentence after a branch; the two conditions read off one compare; the compact table of conditions;
// and the listing that tags each branch and lists the path. Every value on screen is the model's, and
// nothing of a run shows before the learner has stepped to it, answered the prediction it follows or
// passed the challenge it follows.

import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Challenge, Interactive, type Lesson } from "@platform/lesson-schema";

import { conditionsHold } from "./select";
import { INTERACTIVES } from "./interactives";
import { VIEW_STRINGS as S } from "./strings";
import { ARITH_STRINGS as A } from "./strings.arith";
import { BRANCH_STRINGS as B, CONDITION_ROWS } from "./strings.branch";

const store = () => new LessonStore(memoryStorage(), "assembly-lab", "test");

function figure(
  kind: string,
  props: Record<string, unknown>,
  s = store(),
  lesson: Lesson = {} as Lesson,
) {
  const View = INTERACTIVES[kind]!;
  const interactive = Interactive.parse({ id: "f", kind, timeModel: "steps", caption: "c", props });
  return { ...render(<View lesson={lesson} interactive={interactive} store={s} />), store: s };
}

const STEEPER_S = {
  c: "int steeper_s(int a, int b) { return a > b ? a : b; }",
  listing: "steeper_s:\n  cmp w1, w0 C1\n  csel w0, w1, w0, ge C1\n  ret C1",
};
const STEEPER_U = {
  c: "unsigned steeper_u(unsigned a, unsigned b) { return a > b ? a : b; }",
  listing: "steeper_u:\n  cmp w1, w0 C1\n  csel w0, w1, w0, cs C1\n  ret C1",
};
const STEEPER_U_GE = { c: STEEPER_U.c, listing: STEEPER_U.listing.replace(", cs", ", ge") };
const DESCRIBE = (branch: string) => ({
  c: "int describe(int gradient)\n{\n    if (gradient > 10)\n        return 2;\n    if (gradient < -10)\n        return -2;\n    return 0;\n}",
  listing: [
    "describe:",
    "  cmp w0, 10 C3",
    `  ${branch} .L9 C3`,
    "  cmn w0, #10 C7",
    "  mov w0, -2 C7",
    "  csel w0, w0, wzr, lt C7",
    ".L7:",
    "  ret C8",
    ".L9:",
    "  mov w0, 2 C4",
    "  b .L7 C4",
  ].join("\n"),
});
const PANEL = { args: [0xffffffff, 1], names: ["a", "b"] };

const stage = (container: HTMLElement, name: string) =>
  container.querySelector(`.al-stage[data-stage="${name}"]`) as HTMLElement;

describe("the panel beside the two listings", () => {
  const props = { left: STEEPER_S, right: STEEPER_U, after: "p", panel: PANEL };

  it("is not on the page before the prediction is checked", () => {
    const { container } = figure("listing-diff", props);
    expect(container.querySelector(".al-locked")).not.toBeNull();
    expect(container.querySelector(".al-select")).toBeNull();
    expect(container.querySelector(".al-diff-choose")).toBeNull();
  });

  it("draws the three stages of steeper_s on 0xffffffff and 1 from the run", () => {
    const s = store();
    s.setSlot("p", { choice: "csel:last" });
    const { container } = figure("listing-diff", props, s);
    expect(container.querySelectorAll(".al-stage")).toHaveLength(3);
    const compare = stage(container, "compare");
    expect(compare).toHaveTextContent("w0 = a: 0xffffffff (unsigned 4294967295, signed -1)");
    expect(compare).toHaveTextContent("w1 = b: 1");
    expect(compare).toHaveTextContent("cmp w1, w0 is b minus a");
    expect(
      [...compare.querySelectorAll(".al-flag")].map((f) => f.getAttribute("data-value")),
    ).toEqual(["0", "0", "0", "0"]);
    expect(compare).toHaveTextContent(B.select.noRegister);
    const condition = stage(container, "condition");
    expect(condition).toHaveTextContent("csel asks ge (greater than or equal, signed)");
    expect(condition).toHaveTextContent("Rule: N equals V");
    expect(condition).toHaveTextContent("Flags it read: N = 0, V = 0");
    expect(condition).toHaveTextContent(B.select.answer(true));
    const select = stage(container, "select");
    expect(select.querySelector('[data-source="yes"]')).toHaveAttribute("data-chosen", "true");
    expect(select.querySelector('[data-source="no"]')).toHaveAttribute("data-chosen", "false");
    expect(select.querySelector('[data-source="yes"]')).toHaveTextContent("If yes: w1 holds 1");
    expect(select.querySelector('[data-source="no"]')).toHaveTextContent(
      "If no: w0 holds 0xffffffff",
    );
    expect(select).toHaveTextContent("w0 now holds 1");
  });

  it("switches to steeper_u: cs asks about C, answers no, and w0 keeps 0xffffffff", async () => {
    const user = userEvent.setup({ delay: null });
    const s = store();
    s.setSlot("p", { choice: "csel:last" });
    const { container } = figure("listing-diff", props, s);
    const choose = screen.getByRole("group", { name: B.select.choose });
    expect(
      within(choose)
        .getAllByRole("button")
        .map((b) => b.getAttribute("aria-pressed")),
    ).toEqual(["true", "false"]);
    await user.click(within(choose).getByRole("button", { name: "steeper_u" }));
    const condition = stage(container, "condition");
    expect(condition).toHaveTextContent("csel asks cs (higher or same, unsigned)");
    expect(condition).toHaveTextContent("Rule: C is 1");
    expect(condition).toHaveTextContent("Flags it read: C = 0");
    expect(condition).toHaveTextContent(B.select.answer(false));
    const select = stage(container, "select");
    expect(select.querySelector('[data-source="no"]')).toHaveAttribute("data-chosen", "true");
    expect(select.querySelector('[data-source="yes"]')).toHaveAttribute("data-chosen", "false");
    expect(select).toHaveTextContent("w0 now holds 0xffffffff (unsigned 4294967295, signed -1)");
    // The compare is the same for both: the same flags.
    expect(stage(container, "compare")).toHaveTextContent("cmp w1, w0 is b minus a");
  });

  it("tells chosen from not chosen by words and a mark, not by colour alone", () => {
    const s = store();
    s.setSlot("p", { choice: "csel:last" });
    const { container } = figure("listing-diff", props, s);
    const tags = [...container.querySelectorAll(".al-source")].map((r) => [
      r.querySelector(".al-source-tag")?.textContent,
      r.querySelector(".al-cond-glyph")?.textContent,
    ]);
    expect(tags).toEqual([
      [B.select.chosen, "\u25cf"],
      [B.select.notChosen, "\u25cb"],
    ]);
  });
});

describe("the stepper with a panel, and the words after a branch", () => {
  const ge = {
    program: STEEPER_U_GE,
    call: { entry: "steeper_u", args: [0x80000000, 1] },
    registers: [0, 1],
    flags: true,
    panel: { kind: "select", names: ["a", "b"], also: ["cs"] },
  };
  const next = () => screen.getByRole("button", { name: S.stepper.next });

  it("shows no stage before the step that does it has run", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("stepper", ge);
    expect(container.querySelectorAll(".al-stage[data-done='true']")).toHaveLength(0);
    expect(container.querySelectorAll(".al-stage-wait")).toHaveLength(3);
    expect(container).not.toHaveTextContent("Answer:");
    await user.click(next());
    // The compare has run: its stage is there, the other two are not.
    expect(stage(container, "compare").getAttribute("data-done")).toBe("true");
    expect(stage(container, "condition").getAttribute("data-done")).toBe("false");
    expect(stage(container, "select").getAttribute("data-done")).toBe("false");
    expect(
      [...stage(container, "compare").querySelectorAll(".al-flag")].map((f) =>
        f.getAttribute("data-value"),
      ),
    ).toEqual(["1", "0", "0", "1"]);
    expect(container).not.toHaveTextContent("Answer:");
    expect(container).not.toHaveTextContent("now holds");
  });

  it("then reads ge and cs off the same flags and selects w1, after the csel", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("stepper", ge);
    await user.click(next());
    await user.click(next());
    const condition = stage(container, "condition");
    expect(condition.querySelector('[data-cond="ge"]')).toHaveTextContent(
      "Flags it read: N = 1, V = 1",
    );
    expect(condition.querySelector('[data-cond="ge"]')).toHaveAttribute("data-holds", "true");
    expect(condition.querySelector('[data-cond="cs"]')).toHaveTextContent("Flags it read: C = 0");
    expect(condition.querySelector('[data-cond="cs"]')).toHaveAttribute("data-holds", "false");
    expect(stage(container, "select")).toHaveTextContent("w0 now holds 1");
  });

  it("goes back a step and shuts the stages the step undid", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("stepper", ge);
    await user.click(next());
    await user.click(next());
    await user.click(screen.getByRole("button", { name: S.stepper.back }));
    expect(stage(container, "condition").getAttribute("data-done")).toBe("false");
  });

  const describe15 = {
    program: DESCRIBE("bgt"),
    call: { entry: "describe", args: [15] },
    registers: [0],
    flags: true,
    branchStatus: true,
  };

  it("says a branch was taken and what runs next, and marks the jump", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("stepper", describe15);
    expect(container.querySelector("[data-jump]")).toBeNull();
    await user.click(next());
    expect(screen.getByRole("status")).toHaveTextContent("Ran cmp w0, 10.");
    expect(container.querySelector("[data-jump]")).toBeNull();
    await user.click(next());
    expect(screen.getByRole("status")).toHaveTextContent(
      "bgt .L9 was taken. Next: mov w0, 2 at .L9.",
    );
    // The marker is at the instruction jumped to, and the figure says it jumped.
    expect(container.querySelector("[data-figure='stepper']")).toHaveAttribute("data-jump", "true");
    expect(container.querySelector('.al-insn[data-next="true"] .al-text')).toHaveTextContent(
      "mov w0, 2",
    );
    await user.click(next());
    expect(container.querySelector("[data-jump]")).toBeNull();
    await user.click(next());
    expect(screen.getByRole("status")).toHaveTextContent("b .L7 always goes to .L7. Next: ret.");
    expect(container.querySelector("[data-jump]")).not.toBeNull();
  });

  it("says a branch was not taken, for 10, and that the next instruction runs", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("stepper", {
      ...describe15,
      call: { entry: "describe", args: [10] },
    });
    await user.click(next());
    await user.click(next());
    expect(screen.getByRole("status")).toHaveTextContent(
      "bgt .L9 was not taken. Next: cmn w0, #10.",
    );
    expect(container.querySelector("[data-jump]")).toBeNull();
  });

  it("keeps the words every other module has when branchStatus is off", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("stepper", { ...describe15, branchStatus: false });
    await user.click(next());
    await user.click(next());
    expect(screen.getByRole("status")).toHaveTextContent("Ran bgt .L9.");
    expect(screen.getByRole("status")).not.toHaveTextContent("was taken");
    expect(container.querySelector("[data-jump]")).toBeNull();
  });

  it("reads gt and ge off the flags bge's compare leaves, after the compare, and names the one the run uses", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("stepper", {
      program: DESCRIBE("bge"),
      call: { entry: "describe", args: [10] },
      registers: [0],
      flags: true,
      branchStatus: true,
      panel: { kind: "two-conditions", conditions: ["gt", "ge"] },
    });
    expect(container.querySelector(".al-two .al-stage-wait")).not.toBeNull();
    expect(container.querySelector(".al-cond-two")).toBeNull();
    await user.click(next());
    const list = container.querySelector(".al-cond-two")!;
    expect(list.querySelector('[data-cond="gt"]')).toHaveAttribute("data-holds", "false");
    expect(list.querySelector('[data-cond="gt"]')).toHaveTextContent("Reads N = 0, Z = 1, V = 0");
    expect(list.querySelector('[data-cond="ge"]')).toHaveAttribute("data-holds", "true");
    expect(list.querySelector('[data-cond="ge"]')).toHaveTextContent("Reads N = 0, V = 0");
    expect(list.querySelector('[data-cond="ge"]')).toHaveTextContent("used by bge .L9");
    expect(list.querySelector('[data-cond="gt"]')).not.toHaveTextContent("used by");
  });
});

describe("the table of every condition after one compare", () => {
  const table = () =>
    figure("condition-table", {
      presets: [
        ["8", "8"],
        ["0x7fffffff", "0xffffffff"],
      ],
    });
  const names = CONDITION_ROWS.map((r) => r.name);

  it("heads the table with the compare, a = w0 and b = w1, the values and the four flags", () => {
    const { container } = table();
    expect(container.querySelector(".al-cond-compare")).toHaveTextContent(
      "cmp w0, w1 with a = w0 and b = w1",
    );
    expect(container.querySelector('[data-register="w0"] input')).toHaveValue("8");
    expect(container.querySelectorAll(".al-flag")).toHaveLength(4);
  });

  it("shows six conditions and keeps the rest behind a closed disclosure, All condition codes", () => {
    const { container } = table();
    const more = container.querySelector("details.al-cond-more")!;
    expect(more).not.toHaveAttribute("open");
    expect(more.querySelector("summary")).toHaveTextContent("All condition codes");
    const outside = [...container.querySelectorAll(".al-cond")]
      .filter((c) => !more.contains(c))
      .map((c) => c.getAttribute("data-cond"));
    expect(outside).toEqual(["eq", "ne", "cs", "cc", "ge", "lt"]);
    expect([...more.querySelectorAll(".al-cond")].map((c) => c.getAttribute("data-cond"))).toEqual([
      "hi",
      "ls",
      "gt",
      "le",
      "vs",
    ]);
  });

  it("agrees with the simulator at equality, and where the signed subtraction overflows", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = table();
    for (const [pair, a, b] of [
      [null, 8, 8],
      ["0x7fffffff and 0xffffffff", 0x7fffffff, 0xffffffff],
    ] as const) {
      if (pair !== null) await user.click(screen.getByRole("button", { name: pair }));
      const flags = {
        n: container.querySelector('.al-flag[data-flag="n"]')!.getAttribute("data-value") === "1",
        z: container.querySelector('.al-flag[data-flag="z"]')!.getAttribute("data-value") === "1",
        c: container.querySelector('.al-flag[data-flag="c"]')!.getAttribute("data-value") === "1",
        v: container.querySelector('.al-flag[data-flag="v"]')!.getAttribute("data-value") === "1",
      };
      const simulator = conditionsHold(flags, names);
      for (const name of names)
        expect(
          container.querySelector(`[data-cond="${name}"]`)!.getAttribute("data-holds"),
          `${name} after cmp ${a}, ${b}`,
        ).toBe(String(simulator[name]));
    }
    // 0x7fffffff and 0xffffffff leave NZCV 1001: ge reads N = 1, V = 1 and holds; cc holds.
    const ge = container.querySelector('[data-cond="ge"]')!;
    expect(ge).toHaveTextContent("Reads N = 1, V = 1");
    expect(ge).toHaveAttribute("data-holds", "true");
    expect(container.querySelector('[data-cond="lt"]')).toHaveAttribute("data-holds", "false");
    expect(container.querySelector('[data-cond="cc"]')).toHaveAttribute("data-holds", "true");
    expect(container.querySelector('[data-cond="cc"]')).toHaveTextContent("Reads C = 0");
  });

  it("tells yes from no by a mark and a word as well as by colour", () => {
    const { container } = table();
    const yes = container.querySelector('[data-cond="eq"] .al-cond-verdict')!;
    const no = container.querySelector('[data-cond="ne"] .al-cond-verdict')!;
    expect(yes).toHaveTextContent(`\u2713${B.conditions.yes}`);
    expect(no).toHaveTextContent(`\u2717${B.conditions.no}`);
  });
});

describe("the listing that tags each branch and lists the path", () => {
  const props = {
    program: DESCRIBE("bgt"),
    entry: "describe",
    argument: "gradient",
    start: 15,
    presets: [15, 10, -15, 0],
    choices: "presets",
  };
  const tags = (container: HTMLElement) =>
    [...container.querySelectorAll(".al-brow .al-btag")].map((t) => t.textContent);
  const path = (container: HTMLElement) =>
    [...container.querySelectorAll(".al-path-item")].map((li) =>
      li.textContent?.replace(/^\d+/, "").trim(),
    );

  it("offers only the four gradients the text names, never a box that would run the challenge's", () => {
    const { container } = figure("branch-listing", props);
    expect(screen.queryByRole("textbox")).toBeNull();
    const buttons = within(
      container.querySelector(".al-branch-presets") as HTMLElement,
    ).getAllByRole("button");
    expect(buttons.map((b) => b.textContent)).toEqual(["15", "10", "-15", "0"]);
  });

  it("marks the entry, tags both branches taken for 15, and lists the five instructions that ran", () => {
    const { container } = figure("branch-listing", props);
    expect(container.querySelector(".al-bstart")).toHaveTextContent(B.arrows.start);
    expect(container.querySelector(".al-bstart")?.closest(".al-brow")).toHaveTextContent(
      "cmp w0, 10",
    );
    expect(tags(container)).toEqual(["taken", "taken"]);
    expect(path(container)).toEqual([
      "cmp w0, 10",
      "bgt .L9taken",
      "mov w0, 2",
      "b .L7taken",
      "ret",
    ]);
    expect(container.querySelector(".al-branch-ran")).toHaveTextContent("Ran: 5 instructions");
    expect(container.querySelector(".al-branch-returned")).toHaveTextContent("Returned: 2");
    // The taken branch's target is marked.
    expect(
      [...container.querySelectorAll('.al-brow-label[data-jumped="true"]')].map(
        (l) => l.textContent,
      ),
    ).toEqual([`.L7:${B.arrows.jumpedHere}`, `.L9:${B.arrows.jumpedHere}`]);
  });

  it("tells not taken from not reached for 10, and lists six instructions with no b", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("branch-listing", props);
    await user.click(screen.getByRole("button", { name: "10" }));
    expect(tags(container)).toEqual(["not taken", "not reached"]);
    expect(path(container)).toHaveLength(6);
    expect(path(container)[1]).toBe("bgt .L9not taken");
    expect(container.querySelector(".al-branch-ran")).toHaveTextContent("Ran: 6 instructions");
    expect(container.querySelector(".al-branch-returned")).toHaveTextContent("Returned: 0");
    expect(container.querySelector('.al-brow-label[data-jumped="true"]')).toBeNull();
    // A branch the run never reached is not shown as evaluated: no arrow in the taken or not-taken style.
    expect(
      [...container.querySelectorAll(".al-arrow")].map((a) => a.getAttribute("data-state")),
    ).toEqual(["not-taken", "not-run"]);
  });

  it("returns -2 in six for -15 and 0 in six for 0, counting no label and counting ret", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("branch-listing", props);
    await user.click(screen.getByRole("button", { name: "-15" }));
    expect(container.querySelector(".al-branch-returned")).toHaveTextContent("Returned: -2");
    expect(container.querySelector(".al-branch-ran")).toHaveTextContent("Ran: 6 instructions");
    expect(path(container).at(-1)).toBe("ret");
    await user.click(screen.getByRole("button", { name: "0" }));
    expect(container.querySelector(".al-branch-returned")).toHaveTextContent("Returned: 0");
    expect(path(container).filter((p) => /:$/.test(p ?? ""))).toEqual([]);
  });

  it("draws the tag of ret never: it is no branch to a label", () => {
    const { container } = figure("branch-listing", props);
    const ret = [...container.querySelectorAll(".al-brow-insn")].find((r) =>
      /^ret/.test(r.textContent ?? ""),
    )!;
    expect(ret.querySelector(".al-btag")).toBeNull();
    expect(container.querySelectorAll(".al-arrow")).toHaveLength(2);
  });

  it("keeps the box for any value when the figure is not asked to use the buttons only", () => {
    figure("branch-listing", { ...props, choices: "any" });
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("is a labelled list for a screen reader: the path in order, with each branch's outcome in words", () => {
    const { container } = figure("branch-listing", props);
    const list = container.querySelector("ol.al-path")!;
    expect(list).toHaveAttribute("aria-label", B.arrows.path);
    expect(list.textContent).toContain("bgt .L9taken");
  });
});

describe("the learner's own solution, stepped once the challenge is passed", () => {
  const LESS = Challenge.parse({
    id: "write-less-fuel",
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
        {
          label: "less_fuel(3, 7)",
          given: { w0: 3, w1: 7, reading: "unsigned" },
          expect: { w0: 3 },
        },
        {
          label: "less_fuel(0x80000000, 1)",
          given: { w0: 0x80000000, w1: 1, reading: "unsigned" },
          expect: { w0: 1 },
        },
      ],
    },
    hints: ["a", "b", "c", "d", "e"],
    reference: { text: "cmp w0, w1\ncsel w0, w0, w1, cc\nret" },
  });
  const lesson = { challenges: [LESS] } as unknown as Lesson;
  const props = {
    challenge: "write-less-fuel",
    entry: "less_fuel",
    registers: [0, 1],
    intro: "Step through one of the tests below.",
    panel: { kind: "select", names: ["a", "b"], also: [] },
  };
  const save = (s: LessonStore, text: string) =>
    act(() => s.setChallenge("write-less-fuel", (c) => ({ ...c, artifact: { text } })));

  it("shows the lock, and nothing of any run, while the work is missing or wrong", () => {
    const s = store();
    const { container } = figure("solution-stepper", props, s, lesson);
    expect(container.querySelector(".al-locked")).toHaveTextContent(A.adder.lockedUntilPassed);
    expect(container.querySelector(".al-stage")).toBeNull();
    expect(container).not.toHaveTextContent("Step through one of the tests below.");
    save(s, "cmp w0, w1\ncsel w0, w0, w1, lt\nret");
    expect(container.querySelector(".al-locked")).not.toBeNull();
    expect(container.querySelector(".al-stage")).toBeNull();
  });

  it("opens once the saved work passes, says what to do, and runs the learner's own text", async () => {
    const user = userEvent.setup({ delay: null });
    const s = store();
    const { container } = figure("solution-stepper", props, s, lesson);
    save(s, "// the smaller\ncmp w0, w1 // a minus b\ncsel w0, w0, w1, cc\nret");
    expect(container.querySelector(".al-locked")).toBeNull();
    expect(container).toHaveTextContent("Step through one of the tests below.");
    // The learner's own lines, comments left out, are the listing.
    expect([...container.querySelectorAll(".al-insn .al-text")].map((t) => t.textContent)).toEqual([
      "cmp w0, w1",
      "csel w0, w0, w1, cc",
      "ret",
    ]);
    const next = () => screen.getByRole("button", { name: S.stepper.next });
    await user.click(next());
    expect(stage(container, "compare")).toHaveTextContent("cmp w0, w1 is a minus b");
    expect(stage(container, "compare")).toHaveTextContent(B.select.noRegister);
    await user.click(next());
    expect(stage(container, "condition")).toHaveTextContent("csel asks cc (lower, unsigned)");
    expect(stage(container, "condition")).toHaveTextContent(B.select.answer(true));
    expect(stage(container, "select")).toHaveTextContent("w0 now holds 3");
    // Another test: the run starts again, and the stages with it.
    await user.click(screen.getByRole("button", { name: "less_fuel(0x80000000, 1)" }));
    expect(container.querySelector(".al-stage[data-done='true']")).toBeNull();
    await user.click(next());
    await user.click(next());
    expect(stage(container, "condition")).toHaveTextContent(B.select.answer(false));
    expect(stage(container, "select")).toHaveTextContent("w0 now holds 1");
  });

  it("shuts again if the work stops passing", () => {
    const s = store();
    const { container } = figure("solution-stepper", props, s, lesson);
    save(s, LESS.reference.text ?? "");
    expect(container.querySelector(".al-locked")).toBeNull();
    save(s, "ret");
    expect(container.querySelector(".al-locked")).not.toBeNull();
  });
});
