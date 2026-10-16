// Copyright © 2026 Christopher Snow

// The shell's own words. The plan's words are in content/plan/plan.ts. Every sentence here was
// drafted by Haiku from checked facts (CLAUDE.md); the interface labels (the theme control, the
// skip link, "Module 4") are standard control names, kept as the scaffold wrote them.

/** A part of the footer's sentence: plain words, or the title of a work, set in italics. */
export type CompanionIntroPart = string | { readonly title: string };

export const STRINGS = {
  title: "Assembly Lab",
  subtitle: "From a line of C to the bits in a register",
  intro:
    "You drive a real processor's instruction set, 64-bit Arm, one instruction at a time. After each instruction, you see what changed: the bits in each register, the four flags and memory, with the line of C it came from shown beside it. Before each run, you predict what will happen, and you write small programs that tests check. Everything runs in your browser.",
  statusNote:
    "The plan below is under the author's review. Module 0 is written as a draft to try. The other modules are written after the plan is approved.",
  /** "Before you start", between the status note and the plan: what the course assumes. */
  prereqs: {
    heading: "Before you start",
    lead: "The course assumes a little C and a little arithmetic, and no assembly language.",
    cLead: "You need to read small C functions, not write whole programs. That means:",
    cItems: [
      "A function with `int` and `unsigned` arguments, and a `return`.",
      "`if` and `else`.",
      "`for` and `while` loops.",
      "An array indexed with `a[i]`.",
    ],
    cNot: "Pointers, structs, `malloc` and the standard library are not assumed. Module 7 teaches pointers, as addresses. You do not need a compiler. Everything runs in your browser.",
    numbers:
      "You need to convert binary to decimal and back. Hexadecimal and the signed reading of a number are taught in Module 1, so you do not need them first.",
    assembly: "You need no assembly language, because Module 0 starts from nothing.",
    checkLead:
      "A quick check: if you can say what this function returns for `legs_over(100, 120, 85, 140)`, you know enough C.",
    checkCode: `int legs_over(int limit, int a, int b, int c)
{
    int over = 0;
    if (a > limit) over = over + 1;
    if (b > limit) over = over + 1;
    if (c > limit) over = over + 1;
    return over;
}`,
    /** The control that opens the check's answer. A standard control name. */
    checkShow: "Show the answer",
    checkAnswer: "It returns 2, because two of the three legs are longer than the limit.",
    further:
      "Two companion works go deeper. The course never relies on them. *Digital Design* builds the machine from gates. The notes *From gates to a compiled if* go further into what bits mean.",
  },
  /** The label on a module that has no lessons yet. */
  status: {
    planned: "Planned",
    drafting: "Being written",
    published: "Published",
  },

  // what a search result and a shared link's preview show under the title (at most 155
  // characters; static-page.ts writes it into the page).
  description:
    "In your browser, you drive a real processor's instruction set, 64-bit Arm, one instruction at a time, and see beside each one the line of C it came from.",
  // for a browser that runs no scripts, under the cover's words (static-page.ts).
  noScript:
    "This course runs in your browser, so it needs JavaScript. With JavaScript turned off, you see only this summary of the plan.",
  // the plan's module label, "Module 4" and "Module A".
  module: (label: string) => `Module ${label}`,
  // a page's name in the browser's tab, after its own name; the front page keeps the title.
  pageTitle: (page: string) => `${page} / Assembly Lab`,

  // the skip link, the theme control and its three choices.
  skip: "Skip to content",
  theme: "Theme",
  themeAuto: "System",
  themeLight: "Light",
  themeDark: "Dark",

  // the pages for an address the course does not have.
  missing: (path: string) => `The course has no page at the address ${path}.`,
  noLesson: (id: string) => `The course has no lesson named ${id}.`,
  backToPlan: "Back to the course plan",

  // the cover's live figure: the name a screen reader gives it, and what it says as it runs.
  cover: {
    // DRAFT: names the cover's call, which is in no lesson (content/cover.ts).
    figure: "Step through fuel_on_board(38, 6, 10)",
    register: (value: number) => `w0 holds ${value}.`,
  },

  /** Under the plan, on every page. */
  copyright: "© 2026 Christopher Snow",
  // the footer's link to the companion courses, and the label that names them.
  companions: {
    label: "Companion courses",
    /**
     * Before the footer's links, in parts: a part that is a `title` names a work, which the page
     * sets in italics. The parts joined are the sentence, word for word.
     */
    intro: [
      "This course is one of three ways to know one machine. ",
      { title: "Digital Design" },
      " builds a computer from gates. The notes ",
      { title: "From gates to a compiled if" },
      " explain what the bits mean. This course drives a real processor.",
    ] as readonly CompanionIntroPart[],
    digitalDesign: "Digital Design",
    notes: "From gates to a compiled if",
    hub: "See all the author's courses and books",
  },
};

/** Where the footer's links go. */
export const COMPANION_LINKS = {
  digitalDesign: "https://snowch.github.io/digital-design/",
  notes: "https://snowch.github.io/programmer-calculator/docs/notes.html",
  hub: "https://snowch.github.io/",
} as const;
