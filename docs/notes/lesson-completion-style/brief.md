# Completion button styling

The user reported that the completion action looks too plain beside the lesson navigation.
The control currently uses the generic secondary button and is shorter than neighbouring cards.

Scope: improve visual hierarchy and distinguish the marked state on every lesson footer.
Preserve the approved mark/undo labels and all persistence, grading and navigation behaviour.
No new prose is needed; canonical strings remain in lesson-completion/copy.md.

Review the built site at 375 and 1280 pixels in actual light/dark themes, with intermediate
widths where navigation wraps. Cover initial, marked, undo, hover and keyboard focus, plus
first/middle/last lessons. Check contrast, touch size, overflow, accessible name and alignment.
Read CLAUDE.md, docs/style.md and the implementation diff. Independent learner and technical
reviewers must record findings, corrections and checks before commit.
