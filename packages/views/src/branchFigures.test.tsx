// @vitest-environment jsdom
// Copyright © 2026 Christopher Snow

// Module 4's figures, rendered: what two functions return, the prediction about a changed listing,
// the two listings with the differing item marked, every condition after one compare, the count of
// instructions, and the listing with an arrow from each branch to its label. Every value on screen
// is the model's; nothing of a prediction's answer shows before the commit.

import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { LessonStore, memoryStorage } from "@platform/lesson-runtime";
import { Interactive, type Lesson } from "@platform/lesson-schema";

import { INTERACTIVES } from "./interactives";
import { ARITH_STRINGS as A } from "./strings.arith";
import { BRANCH_STRINGS as B, CONDITION_ROWS } from "./strings.branch";
import { VIEW_STRINGS as S, plain } from "./strings";

function figure(
  kind: string,
  id: string,
  props: Record<string, unknown>,
  store = new LessonStore(memoryStorage(), "assembly-lab", "test"),
) {
  const View = INTERACTIVES[kind]!;
  const interactive = Interactive.parse({ id, kind, timeModel: "steps", caption: "c", props });
  const view = render(<View lesson={{} as Lesson} interactive={interactive} store={store} />);
  return { ...view, store };
}

const STEEPER_S = {
  c: "int steeper_s(int a, int b) { return a > b ? a : b; }",
  listing: "steeper_s:\n  cmp w1, w0 C1\n  csel w0, w1, w0, ge C1\n  ret C1",
};
const STEEPER_U = {
  c: "unsigned steeper_u(unsigned a, unsigned b) { return a > b ? a : b; }",
  listing: "steeper_u:\n  cmp w1, w0 C1\n  csel w0, w1, w0, cs C1\n  ret C1",
};
const BOTH = { c: [STEEPER_S.c, STEEPER_U.c].join("\n"), listing: STEEPER_S.listing };
const RUNS = [
  { program: STEEPER_S, call: { entry: "steeper_s", args: [0xffffffff, 1] }, reading: "signed" },
  { program: STEEPER_U, call: { entry: "steeper_u", args: [0xffffffff, 1] }, reading: "unsigned" },
];
const DESCRIBE = {
  c: "int describe(int gradient)\n{\n    if (gradient > 10)\n        return 2;\n    if (gradient < -10)\n        return -2;\n    return 0;\n}",
  listing: [
    "describe:",
    "  cmp w0, 10 C3",
    "  bgt .L9 C3",
    "  cmn w0, #10 C7",
    "  mov w0, -2 C7",
    "  csel w0, w0, wzr, lt C7",
    ".L7:",
    "  ret C8",
    ".L9:",
    "  mov w0, 2 C4",
    "  b .L7 C4",
  ].join("\n"),
};

describe("what the functions return", () => {
  it("runs each function on the model: steeper_s returns 1 and steeper_u 4294967295", () => {
    const { container } = figure("listing-runs", "r", { program: BOTH, runs: RUNS });
    const items = [...container.querySelectorAll(".al-run")].map((li) => li.textContent);
    expect(items).toEqual([
      "steeper_s(0xffffffff, 1) returns 1",
      "steeper_u(0xffffffff, 1) returns 4294967295",
    ]);
  });

  it("draws the C of both functions and the instructions of steeper_s alone", () => {
    const { container } = figure("listing-runs", "r", { program: BOTH, runs: RUNS });
    expect(container.querySelectorAll(".al-cline")).toHaveLength(2);
    expect([...container.querySelectorAll(".al-insn .al-text")].map((e) => e.textContent)).toEqual([
      "cmp w1, w0",
      "csel w0, w1, w0, ge",
      "ret",
    ]);
    expect(container.textContent).not.toContain(", cs");
  });
});

describe("the prediction about the changed listing", () => {
  const props = {
    question: "**What does GCC change?**",
    options: [
      { value: "cmp:instruction", label: "Option one" },
      { value: "cmp:operands", label: "Option two" },
      { value: "csel:last", label: "Option three" },
      { value: "csel:instruction", label: "Option four" },
    ],
    explain: "It is the last item.",
    program: BOTH,
    changed: STEEPER_U,
    runs: RUNS,
  };

  it("shows steeper_s's instructions and the two results, and nothing of steeper_u's listing", () => {
    const { container } = figure("listing-change", "p", props);
    expect(container.textContent).toContain("steeper_s(0xffffffff, 1) returns 1");
    expect(container.textContent).not.toContain("csel w0, w1, w0, cs");
    expect(container.querySelector(".al-outcome")).toBeNull();
    expect(screen.getByRole("button", { name: S.prediction.commit })).toBeDisabled();
  });

  it("asks the model after the commit, and the right option is what it found", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("listing-change", "p", props);
    await user.click(screen.getByRole("radio", { name: "Option three" }));
    expect(container.querySelector(".al-outcome")).toBeNull();
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-match")).toHaveTextContent(S.prediction.match);
    expect(container.querySelector(".al-outcome")).toHaveTextContent(
      plain(B.change.said.last("csel")),
    );
    expect(container.querySelector(".al-outcome")).toHaveTextContent("It is the last item.");
  });

  it("says a wrong option does not match, and still says what changed", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("listing-change", "p", props);
    await user.click(screen.getByRole("radio", { name: "Option one" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-nomatch")).toHaveTextContent(S.prediction.noMatch);
    expect(container.querySelector(".al-outcome")).toHaveTextContent("last item");
  });
});

describe("the two listings with the differing item marked", () => {
  it("stays shut until the prediction it names has been checked", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const { container } = figure(
      "listing-diff",
      "d",
      { left: STEEPER_S, right: STEEPER_U, after: "p" },
      store,
    );
    expect(container.querySelector(".al-locked")).not.toBeNull();
    expect(container.querySelectorAll(".al-diff-row")).toHaveLength(0);
  });

  it("marks one item, the last item of csel, once the prediction is checked", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    store.setSlot("p", { choice: "csel:last" });
    const { container } = figure(
      "listing-diff",
      "d",
      { left: STEEPER_S, right: STEEPER_U, after: "p" },
      store,
    );
    const marks = [...container.querySelectorAll("mark.al-diff-item")];
    expect(marks.map((m) => m.textContent?.replace(/\s*\(differs\)$/, ""))).toEqual(["ge", "cs"]);
    expect(container.querySelectorAll(".al-diff-row")).toHaveLength(3);
    expect(container.querySelector(".al-compare-summary")).toHaveTextContent(B.diff.summary(1));
    const row = container.querySelectorAll(".al-diff-row")[1]!;
    expect(row.textContent).toContain("csel w0, w1, w0, ge");
    expect(row.textContent).toContain("csel w0, w1, w0, cs");
  });
});

describe("one compare, every condition", () => {
  const table = (props: Record<string, unknown> = {}) =>
    figure("condition-table", "c", {
      presets: [
        ["8", "8"],
        ["0x7fffffff", "0xffffffff"],
      ],
      ...props,
    });
  const holds = (container: HTMLElement, cond: string) =>
    container.querySelector(`[data-cond="${cond}"]`)!.getAttribute("data-holds");
  const flagValues = (container: HTMLElement) =>
    [...container.querySelectorAll(".al-flag")].map((f) => f.getAttribute("data-value"));

  it("starts at 8 and 8: NZCV 0110, and eq, cs, ls, ge and le hold", () => {
    const { container } = table();
    expect(flagValues(container)).toEqual(["0", "1", "1", "0"]);
    const yes = CONDITION_ROWS.filter((c) => holds(container, c.name) === "true").map(
      (c) => c.name,
    );
    expect(yes).toEqual(["eq", "cs", "ls", "ge", "le"]);
  });

  it("lists the conditions by name, meaning and rule, grouped as the lesson groups them", () => {
    const { container } = table();
    const row = container.querySelector('[data-cond="ge"]')!;
    expect(row).toHaveTextContent("ge");
    expect(row).toHaveTextContent("greater than or equal");
    expect(row).toHaveTextContent("N equals V");
    // The compact view groups the six the lesson leans on; the rest sit behind a closed disclosure.
    const heads = (root: ParentNode) =>
      [...root.querySelectorAll(".al-cond-group-head")].map((h) => h.textContent);
    const more = container.querySelector("details.al-cond-more")!;
    expect(more).not.toHaveAttribute("open");
    expect(heads(container).slice(0, 3)).toEqual(["Equality", "Unsigned order", "Signed order"]);
    expect(heads(more)).toEqual(["Unsigned order", "Signed order", "Others"]);
    expect(more.querySelector("summary")).toHaveTextContent(B.conditions.all);
  });

  it("runs the compare again for a pair that is typed: 0x7fffffff and 0xffffffff leave NZCV 1001", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = table();
    await user.click(screen.getByRole("button", { name: "0x7fffffff and 0xffffffff" }));
    expect(flagValues(container)).toEqual(["1", "0", "0", "1"]);
    expect(holds(container, "ge")).toBe("true");
    expect(holds(container, "lt")).toBe("false");
    expect(holds(container, "cc")).toBe("true");
    expect(holds(container, "cs")).toBe("false");
    expect(container.querySelector('[data-register="w0"] input')).toHaveValue("0x7fffffff");
  });

  it("takes decimal and hexadecimal, shows both readings, and explains a value it cannot use", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = table();
    const first = container.querySelector('[data-register="w0"] input') as HTMLInputElement;
    await user.clear(first);
    await user.type(first, "-5");
    expect(container.querySelector('[data-register="w0"] .al-cond-readings')).toHaveTextContent(
      B.conditions.readings(4294967291, -5),
    );
    await user.clear(first);
    await user.type(first, "banana");
    const problem = container.querySelector('[data-register="w0"] .al-cond-readings')!;
    // The sentence has code in it (`0x`), which is drawn as code and not as backticks.
    expect(problem).toHaveTextContent(S.tester.notNumber.replace(/`/g, ""));
    expect(problem.textContent).not.toContain("`");
    expect(problem.querySelector("code")).toHaveTextContent("0x");
    expect(container.querySelector(".al-cond-list")).toBeNull();
    await user.clear(first);
    await user.type(first, "4294967296");
    expect(container.querySelector('[data-register="w0"] .al-cond-readings')).toHaveTextContent(
      B.conditions.outOfRange,
    );
  });

  it("does not start at the last challenge's pair, in either order", () => {
    const { container } = table({ start: ["8", "8"] });
    const typed = [...container.querySelectorAll("input")].map(
      (i) => (i as HTMLInputElement).value,
    );
    expect(typed).toEqual(["8", "8"]);
  });

  describe("with choices: presets, the pair comes from the buttons only", () => {
    const PRESETS = [
      ["8", "8"],
      ["0x7fffffff", "0xffffffff"],
      ["0xffffffff", "1"],
      ["0x80000000", "1"],
    ];
    const buttons = (container: HTMLElement) =>
      [...container.querySelectorAll(".al-cond-presets button")].map((b) => b.textContent);

    it("has no box to type in, and still names the two values and their readings", () => {
      const { container } = table({ choices: "presets", presets: PRESETS });
      expect(container.querySelectorAll("input")).toHaveLength(0);
      expect(container.querySelector('[data-register="w0"]')).toHaveTextContent(B.conditions.first);
      expect(container.querySelector('[data-register="w1"]')).toHaveTextContent(
        B.conditions.second,
      );
      expect(container.querySelector('[data-register="w0"] .al-cond-readings')).toHaveTextContent(
        B.conditions.readings(8, 8),
      );
      expect(buttons(container)).toEqual([
        "8 and 8",
        "0x7fffffff and 0xffffffff",
        "0xffffffff and 1",
        "0x80000000 and 1",
      ]);
    });

    it("runs the compare for each button: 0xffffffff and 1 leave NZCV 1010, 0x80000000 and 1 leave NZCV 0011", async () => {
      const user = userEvent.setup({ delay: null });
      const { container } = table({ choices: "presets", presets: PRESETS });
      await user.click(screen.getByRole("button", { name: "0xffffffff and 1" }));
      expect(flagValues(container)).toEqual(["1", "0", "1", "0"]);
      // As signed, −1 is below 1; as unsigned, 4294967295 is not.
      expect(holds(container, "lt")).toBe("true");
      expect(holds(container, "cc")).toBe("false");
      expect(container.querySelector('[data-register="w0"] .al-cond-readings')).toHaveTextContent(
        B.conditions.readings(4294967295, -1),
      );
      await user.click(screen.getByRole("button", { name: "0x80000000 and 1" }));
      expect(flagValues(container)).toEqual(["0", "0", "1", "1"]);
      expect(holds(container, "lt")).toBe("true");
      expect(holds(container, "cs")).toBe("true");
      expect(container.querySelector('[data-register="w0"] .al-cond-readings')).toHaveTextContent(
        B.conditions.readings(2147483648, -2147483648),
      );
      expect(container.querySelectorAll("input")).toHaveLength(0);
    });

    it("leaves the default alone: without choices the boxes are there and take a typed pair", async () => {
      const user = userEvent.setup({ delay: null });
      const { container } = table();
      const inputs = container.querySelectorAll("input");
      expect(inputs).toHaveLength(2);
      await user.clear(inputs[0]!);
      await user.type(inputs[0]!, "-5");
      await user.clear(inputs[1]!);
      await user.type(inputs[1]!, "2");
      expect(holds(container, "ge")).toBe("false");
      expect(holds(container, "cs")).toBe("true");
    });
  });

  it("holds the rules exactly as the lesson words them", () => {
    expect(CONDITION_ROWS.map((c) => `${c.name} ${c.means}: ${c.reads}`)).toEqual([
      "eq equal: Z is 1",
      "ne not equal: Z is 0",
      "cs higher or same: C is 1",
      "cc lower: C is 0",
      "hi higher: C is 1 and Z is 0",
      "ls lower or same: C is 0 or Z is 1",
      "ge greater than or equal: N equals V",
      "lt less than: N differs from V",
      "gt greater than: Z is 0 and N equals V",
      "le less than or equal: Z is 1 or N differs from V",
      "vs overflow: V is 1",
    ]);
  });
});

describe("the prediction about how many instructions run", () => {
  const props = {
    question: "**How many?**",
    options: [
      { value: "5", label: "Five" },
      { value: "8", label: "Eight" },
      { value: "6", label: "Six" },
      { value: "3", label: "Three" },
    ],
    explain: "Five ran.",
    program: DESCRIBE,
    call: { entry: "describe", args: [15] },
    inputs: [0],
  };

  it("shows the listing and w0 before the commit, and nothing of the run", () => {
    const { container } = figure("count-prediction", "n", props);
    expect(container.querySelectorAll(".al-insn")).toHaveLength(8);
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent("15");
    expect(container.querySelector(".al-outcome")).toBeNull();
  });

  it("keeps compact loop input values and makes their bits available without committing a prediction", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("count-prediction", "n", { ...props, decimal: true });
    expect(container.querySelectorAll(".al-bit")).toHaveLength(0);
    expect(container.querySelector('[data-register="w0"]')).toHaveTextContent("15");
    const toggle = screen.getByRole("button", { name: "Show the bits" });
    await user.click(toggle);
    expect(container.querySelectorAll(".al-bit")).toHaveLength(32);
    expect(container.querySelector(".al-outcome")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Hide the bits" }));
    expect(container.querySelectorAll(".al-bit")).toHaveLength(0);
    expect(screen.getByRole("button", { name: S.prediction.commit })).toBeDisabled();
  });

  it("counts the steps the model recorded after the commit: five", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("count-prediction", "n", props);
    await user.click(screen.getByRole("radio", { name: "Six" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-nomatch")).not.toBeNull();
    expect(container.querySelector(".al-outcome")).toHaveTextContent(plain(B.count.ran(5)));
    await user.click(screen.getByRole("radio", { name: "Five" }));
    await user.click(screen.getByRole("button", { name: S.prediction.commit }));
    expect(container.querySelector(".al-match")).not.toBeNull();
    expect(screen.getByText(A.prediction.registers)).toBeVisible();
    expect(container.querySelector('[data-register="w0"] .al-reg-value')).toHaveTextContent("15");
  });
});

describe("the stepper with the count of instructions", () => {
  const props = {
    program: DESCRIBE,
    call: { entry: "describe", args: [15] },
    registers: [0],
    flags: true,
    count: true,
  };

  it("says how many instructions have run as each runs", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("stepper", "s", props);
    const count = () => container.querySelector(".al-count")?.textContent;
    expect(count()).toBe(B.stepper.count(0));
    for (let k = 1; k <= 5; k++) {
      await user.click(screen.getByRole("button", { name: S.stepper.next }));
      expect(count()).toBe(B.stepper.count(k));
    }
    expect(screen.getByRole("button", { name: S.stepper.next })).toBeDisabled();
  });

  it("is the stepper of Module 0 when count is not asked for: no count", () => {
    const { container } = figure("stepper", "s", { ...props, count: undefined });
    expect(container.querySelector(".al-count")).toBeNull();
  });

  it("says which label the run has crossed into, after the branch that is taken", async () => {
    const user = userEvent.setup({ delay: null });
    figure("stepper", "s", props);
    await user.click(screen.getByRole("button", { name: S.stepper.next }));
    await user.click(screen.getByRole("button", { name: S.stepper.next }));
    expect(screen.getByRole("status")).toHaveTextContent("Ran bgt .L9.");
    expect(screen.getByRole("status")).toHaveTextContent("Next: mov w0, 2");
  });
});

describe("the listing with an arrow from each branch to its label", () => {
  const props = {
    program: DESCRIBE,
    entry: "describe",
    argument: "gradient",
    start: 15,
    presets: [15, 10, -15, 0],
  };
  const arrows = (container: HTMLElement) =>
    [...container.querySelectorAll(".al-arrow")].map((a) => [
      a.getAttribute("data-label"),
      a.getAttribute("data-state"),
    ]);
  const ran = (container: HTMLElement) =>
    [...container.querySelectorAll(".al-brow-insn")].map((r) => r.getAttribute("data-ran"));

  it("draws bgt and b taken for 15, greys nothing but the three instructions skipped, and says 2 in 5", () => {
    const { container } = figure("branch-listing", "b", props);
    expect(arrows(container)).toEqual([
      [".L9", "taken"],
      [".L7", "taken"],
    ]);
    expect(ran(container)).toEqual([
      "true",
      "true",
      "false",
      "false",
      "false",
      "true",
      "true",
      "true",
    ]);
    expect(container.querySelector(".al-branch-ran")).toHaveTextContent(B.arrows.ranCount(5));
    expect(container.querySelector(".al-branch-returned")).toHaveTextContent(B.arrows.returned(2));
    expect([...container.querySelectorAll(".al-brow .al-btag")].map((t) => t.textContent)).toEqual([
      "taken",
      "taken",
    ]);
  });

  it("draws bgt not taken and b not run for 10, greying the two instructions that did not run", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("branch-listing", "b", props);
    await user.click(screen.getByRole("button", { name: "10" }));
    expect(arrows(container)).toEqual([
      [".L9", "not-taken"],
      [".L7", "not-run"],
    ]);
    expect(ran(container)).toEqual([
      "true",
      "true",
      "true",
      "true",
      "true",
      "true",
      "false",
      "false",
    ]);
    expect(container.querySelector(".al-branch-ran")).toHaveTextContent(B.arrows.ranCount(6));
    expect(container.querySelector(".al-branch-returned")).toHaveTextContent(B.arrows.returned(0));
    // The branch that was not taken, and the one the run never reached, are told apart in words.
    expect([...container.querySelectorAll(".al-brow .al-btag")].map((t) => t.textContent)).toEqual([
      "not taken",
      "not reached",
    ]);
  });

  it("does not draw ret as a branch: two arrows for eight instructions", () => {
    const { container } = figure("branch-listing", "b", props);
    expect(container.querySelectorAll(".al-arrow")).toHaveLength(2);
    expect(container.querySelectorAll(".al-brow-insn")).toHaveLength(8);
    expect(container.querySelectorAll(".al-brow-label")).toHaveLength(3);
  });

  it("puts the two arrows in different lanes, so neither covers the other", () => {
    const { container } = figure("branch-listing", "b", props);
    expect(container.querySelector(".al-blist")).toHaveAttribute("data-lanes", "2");
    const xs = [...container.querySelectorAll(".al-arrow-line")].map((p) => p.getAttribute("d"));
    expect(new Set(xs).size).toBe(2);
  });

  it("reads a gradient that is typed, a negative one included, and refuses what is not a whole number", async () => {
    const user = userEvent.setup({ delay: null });
    const { container } = figure("branch-listing", "b", props);
    const box = screen.getByRole("textbox");
    await user.clear(box);
    await user.type(box, "-15");
    expect(container.querySelector(".al-branch-ran")).toHaveTextContent(B.arrows.ranCount(6));
    expect(container.querySelector(".al-branch-returned")).toHaveTextContent(B.arrows.returned(-2));
    await user.clear(box);
    await user.type(box, "ten");
    expect(container).toHaveTextContent(B.arrows.notWhole);
    expect(container.querySelector(".al-blist")).toBeNull();
    fireEvent.change(box, { target: { value: "2147483648" } });
    expect(container).toHaveTextContent(B.arrows.notWhole);
  });

  it("stays shut until the prediction it names has been checked", () => {
    const store = new LessonStore(memoryStorage(), "assembly-lab", "test");
    const { container } = figure("branch-listing", "b", { ...props, after: "p" }, store);
    expect(container.querySelector(".al-locked")).not.toBeNull();
    expect(container.querySelector(".al-blist")).toBeNull();
  });
});
