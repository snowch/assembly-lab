# Lesson section flow brief

Copyright © 2026 Christopher Snow

The user asks to remove excessive headings over tiny amounts of content in Putting it together,
review and fix the other pages, and merge when done. Work from main 864a90d.

## Checked facts and boundaries

- There are 34 published lessons, assembled in content/lessons/index.ts. The starting section
  inventory is /tmp/lesson-sections.json and /tmp/lesson-sections.txt, generated from parsed data.
- The pictured page is meet-the-machine: its question and motivation each contain fewer than
  twenty words, followed by a separate context section and a separate stepper section.
- LessonView renders each data section with an h2, authoring-stage label, and spacing. Course
  CSS visually hides some Fundamentals headings but leaves the section boundaries intact.
- The schema supports sectionLayout selected and ordered subsets of kinds. Figure lead/after
  prose already exists. platform/ is a checked upstream copy and must not be edited.
- Existing programmes, numeric inputs, grading, prediction gates, IDs, saved state, figure order,
  widths, signedness and qualifications are not to change. No new machine claims are needed.
- Sources and checked examples are in docs/sources.md, per-module notes and lesson data; retain
  the knowledge before its first use, and retain the timing of answers and gated explanations.
- Prerequisites are the course front-page C/binary assumptions plus preceding lessons. Read the
  lesson in order: regrouping must not move a needed definition after its activity.
- Existing bullets in input prompts are intentional; preserve them.

## Editorial task

Use docs/style.md, docs/authoring.md and CLAUDE.md. Audit every lesson, one section at a time.
Combine related short introduction/context sections into a meaningful teaching section with its
activity. Fold short follow-up explanations into their activity when safe, preserving their order
and any disclosure/gate. Keep useful headings for distinct concepts, substantial explanations,
new activities, reference material, practical procedures and exercises. Do not impose a fixed
section count or word-count rule, flatten long lessons, or merely hide headings with CSS.
Remove redundant introductory framing when nearby content already performs that job. Retain
useful short qualifications. Keep headings descriptive and review the authoring-stage labels.
Canonical prose records must match final learner strings. Record per-lesson keep/combine decisions.

## Validation

Separate draft, learner review and technical review. Review every changed page at phone and
desktop widths in actual light/dark themes. Check semantic headings, initial order, relevant
prediction gates, step/reset, challenge attempts/clear/restore where regrouping affects figures.
Existing tests should follow meaningful retained content and interactions rather than a ten-section
layout. Record any stale test failures separately from corrected reruns. Full check, exact-head CI,
merge and live verification are required. Preserve unrelated untracked Pi note.
