# Issue 52: remove repeated simulator guidance

Copyright © 2026 Christopher Snow

## Checked implementation facts and scope

The course supplies one global `steps` note through packages/views/src/book.tsx. The unmodified
platform LessonView renders it in figure disclosures and at the foot of lessons. Removing the
course's timeModelNotes entry removes this automatic repetition without changing simulation,
figure roles, execution badges, grading or stored work. The arithmetic calculation role note
explains a genuinely different interaction and remains. Platform files must remain unedited.

All lesson modelVsReality strings were inventoried before editing. Several are repeated
stepping guidance, arithmetic/circuit disclaimers or ordinary teaching points. Others protect
important conclusions about prepared memory, C undefined behaviour, trace limits versus runtime,
compiler subsets, calling conventions and native/emulated/physical evidence. Audit every current
lesson: remove redundancy, and relocate necessary qualifications beside the relevant activity.
No generic footer is needed when its meaning is already available locally. Preserve source-backed
facts and recorded compiler settings; do not weaken numerical assertions or invent new claims.

The first addition already defines the browser simulator beside Run the instruction. Tiny
function and sequence explicitly instruct learners to run one instruction at a time. Sequence's
'Follow the state' reflection repeats existing instruction reading, so remove its section and
heading, not just its words. Check other standalone generic reminders for the same problem.
Use selected section layouts when removing a section. Keep practical guidance for distinct
interactions (column reveal, trace playback, native commands, predictions and exercises).

## Drafting and review

Read CLAUDE.md, docs/style.md, docs/authoring.md, docs/visual-language.md and relevant source/fact
notes. Separate drafting passes audit modules 0–4 and 5–13/optional A. Keep canonical prose
synchronised; append per-lesson decisions to this directory, with retained qualifications and
where they now appear. Do not edit model programs, exercises or platform files. New wording must
come only from checked existing facts. General execution-versus-timing discussion belongs once,
with the introductory simulator explanation, rather than on every page.

Independent learner and technical reviewers inspect the final build at phone/desktop in both
themes. Evaluate each lesson with only its own prerequisites; record per-lesson scope and findings.
Verify first-use instructions remain, no empty boilerplate headings render, and meaningful
limitations remain visible before the activity they constrain. Preserve failed test/review
attempts separately from passing reruns. Full check and CI remain the merge gate.
