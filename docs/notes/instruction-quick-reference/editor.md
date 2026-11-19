# Editor syntax help and one diagnostic

Copyright © 2026 Christopher Snow

## Draft facts and copy

- The editor's existing error line number identifies a source line. Its supported mnemonic can select the corresponding public syntax entry.
- The shell needs only the challenge identifier and optional mnemonic. The help context receives no artifact, tests, expected output or reference solution.
- A conditional branch spelling such as `b.eq` belongs to the `b.cond` reference family.
- The controls are labelled **Instruction reference** for the exercise list and **Syntax for add** (with the applicable mnemonic) for an invalid instruction.
- The help button stays available after a failed Run tests, so suppressing a repeated diagnostic does not remove the syntax lookup.

## Behaviour

The editor continues assembling edits against its existing allow-list. It hides its live diagnostic copy only when the blocked verdict matches every current assembly diagnostic, in order. Text mode remains `aria-invalid`; tap mode now marks invalid source-line buttons as well. An unrelated or stale blocked verdict does not suppress current feedback. Changing the artifact clears the platform verdict and restores the live copy. Neither grading, artifacts nor gates change.

Sibling inspection found that CSourceEditor also renders compiler diagnostics, and grader-c can return matching blocked diagnostics. This task's implemented assembly change does not alter CSourceEditor's independent optional compiler/editor API. The parent was notified of that existing pattern.

## Verification

Initial focused command: `npx vitest run packages/views/src/AssemblyEditor.instruction-help.test.tsx packages/views/src/AssemblyEditor.test.tsx`.

Result: 2 files, 29 tests passed. No failing initial focused run. New tests exercise optional-provider behaviour, exact exercise and mnemonic selection, branch-family lookup, unchanged source, generic reference fallback, exact deduplication, changed/unrelated blocked messages, edit restoration and tap invalid state.

The first concurrent typecheck failed: one new test used unsupported Testing Library `exact` role options; this was corrected to an anchored name expression. Other reported errors were in the parent UI while the catalog module was still being drafted. A final full typecheck remains the parent’s responsibility.

These are functional checks, not evidence of learning effectiveness. Independent review and built-site checks remain required in the parent session.
