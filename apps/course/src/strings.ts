// Copyright © 2026 Christopher Snow

// The shell's own words. The plan's words are in content/plan/plan.ts. Every sentence here was
// drafted separately from checked facts (CLAUDE.md); interface labels use standard control names.

/** A part of the footer's sentence: plain words, or the title of a work, set in italics. */
export type CompanionIntroPart = string | { readonly title: string };

/** Where the footer's links go, and the front page's links to the same works. */
export const COMPANION_LINKS = {
  digitalDesign: "https://snowch.github.io/digital-design/",
  notes: "https://snowch.github.io/programmer-calculator/docs/notes.html",
  hub: "https://snowch.github.io/",
} as const;

export const STRINGS = {
  version: {
    commit: "Commit",
    committed: "committed",
    utc: "(UTC)",
    latest: "Up to date ✓",
    latestNote: "Matches the latest commit on GitHub’s main branch at the last check.",
  },
  title: "Assembly Lab",
  subtitle: "From a line of C to the bits in a register",
  intro:
    "Learn assembly by running instructions one at a time in your browser. The simulator supports a subset of 64-bit Arm instructions. In the lessons, you see C code beside its assembly instructions. After each instruction, you can inspect the register values and their bits, the flags and memory. You predict what will happen and write small assembly programs. Automatic checks test your answers and programs.",
  start: "Start with Module 0",
  statusNote:
    'Modules labelled "Published draft" have lessons you can use now. These lessons may change.',
  /** "Before you start", between the status note and the plan: what the course assumes. */
  prereqs: {
    heading: "Before you start",
    showDetails: "Check what you need to know",
    lead: "You need a little C and some basic arithmetic. You do not need any assembly experience.",
    cLead: "You should be able to read small C functions that use:",
    cItems: [
      "`int` and `unsigned` arguments, and `return`.",
      "`if` and `else`.",
      "`for` and `while` loops.",
      "Arrays indexed with `a[i]`.",
    ],
    cNot: "You do not need to know about pointers, structs, `malloc` or the standard library. Module 6 introduces pointers as addresses. You do not need a compiler; the lessons run in your browser.",
    numbers:
      "You should be able to convert binary numbers to decimal and back. Module 1 introduces hexadecimal and explains how bit patterns represent positive and negative numbers.",
    assembly: "Module 0 introduces assembly from the beginning.",
    checkLead:
      "A quick check before you start: what does this function return for `legs_over(100, 120, 85, 140)`?",
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
    checkAnswer:
      "It returns 2. Both 120 and 140 are greater than the limit of 100; 85 is not. If you can follow this example, you are ready to start Module 0.",
    further: `You can use this course without reading the companion resources. [*Digital Design*](${COMPANION_LINKS.digitalDesign}) builds a computer from gates. The notes [*From gates to a compiled if*](${COMPANION_LINKS.notes}) explain more about what bits mean.`,
  },
  /** The label on a module that has no lessons yet. */
  status: {
    planned: "Planned",
    drafting: "Being written",
    published: "Published draft",
  },

  // what a search result and a shared link's preview show under the title (at most 155
  // characters; static-page.ts writes it into the page).
  description:
    "Learn Arm assembly in your browser. Run instructions one at a time, inspect registers and memory, and see how the instructions relate to C.",
  // for a browser that runs no scripts, under the cover's words (static-page.ts).
  noScript:
    "This course runs in your browser, so it needs JavaScript. With JavaScript turned off, you see only this summary of the plan.",
  // the plan's module label, "Module 4" and "Module A".
  module: (label: string) => `Module ${label}`,
  // The name of the list of a module's lessons, for a screen reader, when it has several.
  lessonsOf: (title: string) => `Lessons of ${title}`,
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

  // The way between lessons, at the foot of each one: the lessons in course order.
  // DRAFT
  lessonNav: "Between the lessons",
  // DRAFT
  previousLesson: "Previous lesson",
  // DRAFT
  nextLesson: "Next lesson",

  // Separate prose passes: docs/notes/offline/brief.md and offline-clarity/brief.md.
  offline: {
    preparing:
      "Preparing the course for offline use. Keep this page open and stay connected until it is ready.",
    ready: "Ready to use offline in this browser.",
    detailsLabel: "How offline use works",
    downloadExplanation:
      "When you first open the course online, your browser automatically downloads the whole course. You do not need to open each lesson.",
    readinessExplanation:
      "Wait until the message above says “Ready to use offline in this browser.” You can then return to the course in this browser without an internet connection.",
    unavailable:
      "The course could not be saved for offline use. Reopen it with an internet connection to try again.",
    unsupported:
      "This browser cannot save the course for offline use. You can use it while connected to the internet.",
    updateWaiting:
      "An update is ready. Close every Assembly Lab tab or window, then reopen the course to use the update.",
    limitations:
      "Links to other websites and the optional “Compare with GCC” feature need an internet connection.",
    storage:
      "Clearing this site's browser data removes the saved course. Your browser may also remove it to free space.",
  },

  // the cover's live figure: the name a screen reader gives it, and what it says as it runs.
  cover: {
    // Names the cover's call, which is in no lesson (content/cover.ts).
    figure: "Step through fuel_on_board(38, 6, 10)",
    help: "Press Next to run one instruction. Watch the value and bits in register w0.",
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
      { title: "Digital Design" },
      " builds a computer from gates. The notes ",
      { title: "From gates to a compiled if" },
      " explain what the bits mean. Assembly Lab teaches Arm assembly through a browser simulator.",
    ] as readonly CompanionIntroPart[],
    digitalDesign: "Digital Design",
    notes: "From gates to a compiled if",
    hub: "See all the author's courses and books",
  },
};
