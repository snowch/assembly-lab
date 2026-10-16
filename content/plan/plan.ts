// Copyright © 2026 Christopher Snow

// The course plan as data: the parts, each with its modules, each module with its number, its
// title, one line on what the learner does, and where it stands. The front page and the page for
// a reader whose browser runs no scripts both list the course from here, so they cannot drift
// from each other. A module is `planned` until its lessons are being written, `drafting` while
// they are, and `published` once they are on the site.

export const STATUSES = ["planned", "drafting", "published"] as const;
export type ModuleStatus = (typeof STATUSES)[number];

export interface PlannedModule {
  /** Unique, lower-case, and the stem a lesson's id may start with. */
  readonly id: string;
  /** What the module is called in the course: "0" to "11", and "A" for the optional chapter. */
  readonly label: string;
  readonly title: string;
  /** One line on what the learner does in the module. */
  readonly line: string;
  readonly status: ModuleStatus;
}

export interface PlanPart {
  readonly id: string;
  readonly title: string;
  readonly modules: readonly PlannedModule[];
}

const M = (
  label: string,
  id: string,
  title: string,
  line: string,
  status: ModuleStatus = "planned",
): PlannedModule => ({ id, label, title, line, status });

/** The course's parts, in order. */
export const PARTS: readonly PlanPart[] = [
  {
    id: "state",
    title: "The machine's state",
    modules: [
      M(
        "0",
        "meet-the-machine",
        "Meet the machine",
        "Step through a finished C function and its compiled instructions, watching what each changes.",
      ),
      M(
        "1",
        "registers-and-readings",
        "Registers and readings",
        "Put values in registers and read one bit pattern as unsigned, signed or hexadecimal.",
      ),
      M(
        "2",
        "adding-and-the-flags",
        "Adding, subtracting and the flags",
        "Add and subtract, follow the carries, and predict the four flags.",
      ),
      M(
        "3",
        "logic-shifts-masks",
        "Logic, shifts and masks",
        "Pick bits out of a word, and set, clear and move them.",
      ),
    ],
  },
  {
    id: "control",
    title: "Choosing what runs next",
    modules: [
      M(
        "4",
        "compare-and-branch",
        "Compare and branch",
        "Turn a C if statement into a compare and a branch, for signed and unsigned values.",
      ),
      M("5", "loops", "Loops", "Write counting loops, and find the loop that never ends."),
    ],
  },
  {
    id: "memory",
    title: "Memory and wider values",
    modules: [
      M(
        "6",
        "loads-stores-widths",
        "Loads, stores and widths",
        "Move bytes, halves and words between memory and registers, and see narrow values widened.",
      ),
      M(
        "7",
        "arrays-strings-pointers",
        "Arrays, strings and pointers",
        "Walk through an array and a string by address.",
      ),
      M(
        "8",
        "multiply-and-divide",
        "Multiply and divide",
        "Multiply into a result twice as wide, divide, and meet the cases that go wrong.",
      ),
    ],
  },
  {
    id: "functions",
    title: "Functions and C",
    modules: [
      M(
        "9",
        "calls-and-the-stack",
        "Calls and the stack",
        "Call a function, return from it, and keep values safe on the stack.",
      ),
      M(
        "10",
        "from-c-to-assembly",
        "From C to assembly",
        "Write C, watch it become instructions, and compare with a real compiler.",
      ),
      M(
        "11",
        "where-c-and-the-machine-disagree",
        "Where C and the machine disagree",
        "Find C that the hardware runs differently from how it reads.",
      ),
    ],
  },
];

/** The chapter after the parts, which a learner may skip. */
export const OPTIONAL_PART: PlanPart = {
  id: "optional",
  title: "Optional, after the parts",
  modules: [
    M(
      "A",
      "the-same-programs-on-32-bit-arm",
      "The same programs on 32-bit ARM",
      "Run the course's programs on 32-bit ARM, and see what changed.",
    ),
  ],
};

/** Every part the front page lists, in order, the optional chapter last. */
export const PLAN: readonly PlanPart[] = [...PARTS, OPTIONAL_PART];

/** Every module in the plan, in order. */
export const MODULES: readonly PlannedModule[] = PLAN.flatMap((p) => p.modules);

/** A module by its number: the label a lesson's `module` field holds. */
export function moduleByNumber(n: number): PlannedModule | undefined {
  return MODULES.find((m) => m.label === String(n));
}
