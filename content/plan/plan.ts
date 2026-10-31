// Copyright © 2026 Christopher Snow

// The course plan as data: the parts, each with its modules, each module with its number, its
// title, one line on what the learner does, and where it stands. The front page and the page for
// a reader whose browser runs no scripts both list the course from here, so they cannot drift
// from each other. A module's status is never typed here: it is worked out from the lessons that
// are written (`statusOf`), so the plan cannot say a module has a lesson it does not have. A module
// is `published` once a lesson of it is on the site and `planned` until then.

import { FUNDAMENTALS_MODULE } from "../lessons/fundamentals.prose";
import { COMPLEMENT_PROSE } from "../lessons/twos-complement.prose";

export const STATUSES = ["planned", "drafting", "published"] as const;
export type ModuleStatus = (typeof STATUSES)[number];

export interface PlannedModule {
  /** Numeric lesson-schema key; optional chapters use 14/15 while displaying A/B. */
  readonly lessonModule: number;
  /** Unique, lower-case, and the stem a lesson's id may start with. */
  readonly id: string;
  /** What the module is called: "0" to "13", or "A"/"B" for optional chapters. */
  readonly label: string;
  readonly title: string;
  /** One line on what the learner does in the module. */
  readonly line: string;
}

export interface PlanPart {
  readonly id: string;
  readonly title: string;
  readonly modules: readonly PlannedModule[];
}

const M = (label: string, id: string, title: string, line: string): PlannedModule => ({
  lessonModule: label === "A" ? 14 : label === "B" ? 15 : Number(label),
  id,
  label,
  title,
  line,
});

/** The course's parts, in order. */
export const PARTS: readonly PlanPart[] = [
  {
    id: "state",
    title: "The machine's state",
    modules: [
      M("0", "meet-the-machine", FUNDAMENTALS_MODULE.title, FUNDAMENTALS_MODULE.line),
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
        "Move values of different sizes between memory and registers. See how a smaller value fills a larger register.",
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
        "Explore what happens when a C program relies on behaviour that the language does not guarantee.",
      ),
      M(
        "12",
        "running-arm64-outside-assembly-lab",
        "Running ARM64 outside Assembly Lab",
        "Assemble a bootable ARM64 program, trace its startup and debug it with GNU tools and QEMU.",
      ),
      M(
        "13",
        "running-on-raspberry-pi-5",
        "Running on Raspberry Pi 5",
        "Boot the assembly trip computer on a Raspberry Pi 5 and test it through its serial connector.",
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
      "Compare the course's A64 programs with recorded 32-bit Arm compiler output.",
    ),
    M("B", "twos-complement", COMPLEMENT_PROSE.title, COMPLEMENT_PROSE.line),
  ],
};

/** Every part the front page lists, in order, the optional chapter last. */
export const PLAN: readonly PlanPart[] = [...PARTS, OPTIONAL_PART];

/** Every module in the plan, in order. */
export const MODULES: readonly PlannedModule[] = PLAN.flatMap((p) => p.modules);

/** A module by its number: the label a lesson's `module` field holds. */
export function moduleByNumber(n: number): PlannedModule | undefined {
  return MODULES.find((m) => m.lessonModule === n);
}

/** What the plan needs to know of a lesson: where it is, and which module it belongs to. */
export interface LessonRef {
  readonly id: string;
  /** The module's number: the label of a numbered module. */
  readonly module: number;
}

/** The lessons of a module, in the order given. */
export function lessonsOf<L extends LessonRef>(
  module: PlannedModule,
  lessons: readonly L[],
): readonly L[] {
  return lessons.filter((l) => l.module === module.lessonModule);
}

/** A module's status, worked out from the lessons that are written. */
export function statusOf(module: PlannedModule, lessons: readonly LessonRef[]): ModuleStatus {
  return lessonsOf(module, lessons).length > 0 ? "published" : "planned";
}
