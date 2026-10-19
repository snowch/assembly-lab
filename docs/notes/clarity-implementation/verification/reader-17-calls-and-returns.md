# Lesson 17 independent implementation check

Verdict: accepted local corrections pass. No supported new clarity regression found in the reviewed scope. No application edits made.

## Independence and reading

Fresh reader for only `calls-and-returns`, not an author of the implementation. Read CLAUDE.md, docs/style.md and docs/authoring.md; read current lesson prose, labels, tasks, hints, recorded listings and section structure before reconciling the audit summary/coverage plan. Browser target: final app at http://localhost:4292/assembly-lab/#/lesson/calls-and-returns.

Prerequisite check used front-page Before you start and relevant earlier explanations: Module 0 argument/result registers and compiler settings; width and w/x behaviour; unsigned shifts; recording limits; byte addresses, endian order and pointer notation; array pre-index/post-index addressing. This is a focused prerequisite check, not a reread of every earlier exercise.

## Accepted correction checks

- **M3 paired-store spacing: pass.** Investigation now says “adjacent eight-byte regions” and identifies the second saved value as starting “eight bytes later”. In the browser after the first store, the saved regions start at `0x42ffe0` and `0x42ffe8`; each contains eight address-labelled bytes. The recorded listing still reserves the same frame and executes in its original order. Phone wraps each saved region over two rows without losing its boundary.
- **L16 stack hint units: pass.** The fourth final hint gives byte offsets and states “Each saved value occupies eight bytes.” Read the whole hint ladder in source; opened the first four final hints in each browser configuration. No unstated slot-size convention remains in this hint.
- **N16 walkthrough ordering: pass.** Prediction contains only the prediction card. Investigation defines the pair instructions, frame pointer and preserved-register roles, then presents the single normal report walkthrough. Its initial state remains locked until the prediction is checked. After checking a prediction, all eleven instructions can be followed to return. The separate failure-example walkthrough remains distinct and independently gated.
- **N17 calling-convention introduction: pass.** Main Motivation now says “The shared register and stack rules form a calling convention” and identifies AAPCS64 before Investigation uses that name. The optional compiler note retains compiler settings and defines inlining, so skipping it no longer hides the convention definition.
- **Shared activity roles: pass locally.** Both prediction cards display Prediction, exercises display Exercise, and actual stack steppers retain Stepped. The failure prediction visibly labels its retained inputs “Registers before the run”.

## New findings

None supported. The change preserves the learner's progression from return address, to stack frame, to preservation obligations. No challenge solution was needed to judge these accepted fixes.

## Assumed knowledge

No additional untaught knowledge blocker found. Caller/callee, link register, stack/sp, stack frame, frame pointer, calling convention/AAPCS64 and leaf function are defined in this lesson. The byte/address and pre/post-index knowledge used to explain stores is taught earlier. `-O1` was explained in Module 0; this lesson explains its additional no-inlining setting locally. Function invocation means one call in the immediately surrounding discussion and does not introduce a separate mechanism.

## Browser coverage and limits

Actual Chromium via Playwright, 375×950 and 1280×950, both light and dark; raw localStorage theme preference set and `html[data-theme]` asserted. In all four configurations: inspected initial rendered text and full-page capture; verified the normal stepper gate; checked first prediction; captured and visually inspected first pair store; stepped normal walkthrough to completion; checked failure prediction and advanced its stepper once; opened first four final hints; checked no horizontal document overflow. All four gates held, all four normal runs reached return after eleven steps, no horizontal overflow.

Artifacts adjacent to this report: `reader17-{375,1280}-{light,dark}-initial.png`, `reader17-{375,1280}-{light,dark}-store.png`, rendered-text files and `reader17-evidence.json`. The four store screenshots were directly viewed for readable regions, pairing and theme presentation.

Limits: no authored challenge solution submitted; no exhaustive failure-path/input sweep; no accessibility certification; no full suite/build run; no independent whole-ISA validation. Source claims were compared with recorded listing and browser simulator behaviour, with repository AAPCS64 source reference identified. The coordinator's technical review and root's automated checks remain separate.
