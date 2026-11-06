# Ancillary page layout decisions

Copyright © 2026 Christopher Snow

Scope: the front page (`#/`) and optional progression page (`#/where-next`). Read
`CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and the local learning-design skill.
This is a layout edit of checked copy, rather than a new teaching sequence. The writer
is the ancillary-page agent, separate from the managing session. Independent learner,
technical and browser reviews are coordinated by the managing session.

## Facts and learning route

The progression page supports transferring the familiar trip calculation into an external
workspace, checking the supplied starter, and choosing a suitable environment for a project.
Its prerequisite remains Module 9's calling and return-address rules. Definitions of
assembler directives and exit status precede the activities that use them. The independent
application still changes the program's inputs, predicts the result and checks execution;
reading runtime input and printing remain subsequent extensions.

Checked facts come from `docs/notes/where-next/facts.md`,
`content/where-next.example.ts` and its model tests. Fixed MOV inputs, the result 232,
caller state, tool controls, temporary checks, emulator limitations, offline qualifications
and native/hardware route qualifications are preserved. The front cover's compiler record
and executable values remain in `docs/notes/front-page/cover.md` and `content/cover.ts`.

## Page inventory

| Route and content | Decision | Reason |
| --- | --- | --- |
| `#/`: title, subtitle and introduction | Keep prose and existing cover layout | One connected explanation introduces the course beside its live figure. It is not a parallel set of setup facts or ordered actions. |
| `#/`: Before you start | Keep prerequisite list, C check and current disclosure | C constructs already form a short list. The remaining paragraphs each explain a prerequisite or qualification. No guidance moves into a disclosure. |
| `#/`: course plan and Where next discovery | Keep module/lesson lists and progression link | Existing lists already expose parallel entries and lesson order. |
| `#/`: live cover | Keep source, values and stepping guidance | The paired C/assembly figure already carries the program; converting it to another representation would lose its job. |
| `#/where-next`: introduction and preparation | Keep prose | These establish the optional route and its prerequisite without a long list. |
| `#/where-next`: playground introduction and offline qualification | Keep prose | The debugger definition and offline distinction remain local and visible. |
| `#/where-next`: caller and directives before source | Keep caller explanation; list `.text` and `.global main` meanings | The two directive meanings are parallel facts. Their shared definition remains immediately before them. |
| `#/where-next`: source, download and external link | Keep complete source and existing actions | The starter, download, caller behaviour and external destination remain intact. |
| `#/where-next`: result and exit status | Split the definition from the console action | The learner can locate the definition separately from the instruction for inspecting the expected exit status. |
| `#/where-next`: importing, assembling and stepping | Keep existing numbered steps | They already express an actual ordered procedure, including phone controls and preservation of existing work. |
| `#/where-next`: emulator limits | Use four bullets with reference paragraph afterwards | Library calls, the terminal command, user-program scope and instruction counts are parallel limitations. Hardware-route guidance stays beside its scope limit. |
| `#/where-next`: changing the starter | Separate fixed-input facts from the action | The runtime-input caveat remains before the instruction to edit `main`. |
| `#/where-next`: checking the unchanged starter | Use four numbered steps | Opening checks, adding a check, setting fields and running checks must happen in order. Empty fields and exit code 232 remain explicit. |
| `#/where-next`: input-reading extension and preserving checks | Keep paragraphs | These describe a conditional extension and the reason for saving checks. They do not become another list or new headings. |
| `#/where-next`: environment choices | Keep existing goal bullets | The three routes already form parallel choices with local prerequisites and verification qualifications. |

No headings, controls, disclosures, page-level components or global styles were added.
The exact canonical copy is synchronised in `docs/notes/where-next/prose.md`.

## Verification

Source inspection and focused automated checks are recorded here. Built-page inspection
and independent review are recorded separately by the managing session; this note does
not claim novice learning evidence or physical-board verification.

- `npx vitest run apps/course/src/where-next.test.tsx content/where-next.facts.test.ts content/cover.test.ts`: 3 files and 13 tests passed. This checks the rendered starter, routes and actions, canonical-copy agreement, caller state/result and recorded cover program.
- `npx prettier --check content/where-next.prose.ts docs/notes/where-next/prose.md docs/notes/readability-layout/ancillary.md`: passed.
