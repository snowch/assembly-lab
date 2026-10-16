// Copyright © 2026 Christopher Snow

// The shell's own words. The plan's words are in content/plan/plan.ts. The managing session
// replaces the placeholders with checked drafts; a string marked DRAFT was added by the scaffold
// and has not been through that process.

export const STRINGS = {
  title: "Assembly Lab",
  subtitle: "From a line of C to the bits in a register",
  intro:
    "You drive a real processor's instruction set, one instruction at a time. After each instruction, you see what changed: the bits in each register, the four flags and memory, with the line of C it came from shown beside it. Before each run, you predict what will happen, and you write small programs that tests check. Everything runs in your browser.",
  statusNote:
    "The plan below is under the author's review. There are no lessons yet, and the first ones are written after the plan is approved.",
  /** The label on a module that has no lessons yet. */
  status: {
    planned: "Planned",
    // DRAFT
    drafting: "Being written",
    // DRAFT
    published: "Published",
  },

  // DRAFT: what a search result and a shared link's preview show under the title (at most 155
  // characters; static-page.ts writes it into the page).
  description:
    "Drive a real instruction set one instruction at a time, with the C that compiled to each beside it. Runs in your browser.",
  // DRAFT: for a browser that runs no scripts, under the cover's words (static-page.ts).
  noScript: "This course runs in your browser, so it needs JavaScript.",
  // DRAFT: the plan's module label, "Module 4" and "Module A".
  module: (label: string) => `Module ${label}`,
  // DRAFT: a page's name in the browser's tab, after its own name; the front page keeps the title.
  pageTitle: (page: string) => `${page} / Assembly Lab`,

  // DRAFT: the skip link, the theme control and its three choices.
  skip: "Skip to content",
  theme: "Theme",
  themeAuto: "System",
  themeLight: "Light",
  themeDark: "Dark",

  // DRAFT: the pages for an address the course does not have.
  missing: (path: string) => `There is no page at ${path}.`,
  noLesson: (id: string) => `There is no lesson called ${id}.`,
  backToPlan: "Back to the course plan",

  // DRAFT: the book's stand-ins while no lesson has an interactive, an editor or a challenge.
  noEditor: "This course has no challenges yet, so there is nothing to edit.",
  noGrader: "This course has no challenges yet, so nothing can be graded.",

  /** Under the plan, on every page. */
  copyright: "© 2026 Christopher Snow",
  // DRAFT: the footer's link to the companion courses, and the label that names them.
  companions: {
    label: "Companion courses",
    /** Before the footer's links. */
    intro:
      "This course is one of three ways to know one machine. Digital Design builds a computer from gates. The notes From gates to a compiled if explain what the bits mean. This course drives a real processor.",
    digitalDesign: "Digital Design",
    notes: "From gates to a compiled if",
    hub: "All of the author's courses",
  },
};

/** Where the footer's links go. */
export const COMPANION_LINKS = {
  digitalDesign: "https://snowch.github.io/digital-design/",
  notes: "https://snowch.github.io/programmer-calculator/docs/notes.html",
  hub: "https://snowch.github.io/",
} as const;
