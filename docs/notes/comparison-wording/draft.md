# Comparison wording drafting pass

Separate drafting agent, following `AGENTS.md`, `CLAUDE.md`, the checked-facts brief and `docs/style.md`. No commits or platform edits.

Drafted files:

- `packages/views/src/strings.ts`: comparison success now names matching machine instructions across listings, without a count that could imply each instruction is identical to the next. `allSame` is a string; the managing agent updates callers.
- `packages/views/src/strings.call-comparison.ts`: Run comparison, Reset comparison and Run and compare name the comparison action. The result caption names the returned w0 bits shared by both calls. Internal keys are retained.
- `content/lessons/pacing-1-4.copy.ts`: directions use Run comparison and explain independent simulated calls from the same arguments, shared bit display and separate typed C readings. Existing source introduction distinguishes parameter and return types; prediction feedback still explains the recorded instruction sequence only after commitment.
- `packages/views/src/strings.branch.ts`: instruction noun agrees with the computed count.
- `packages/views/src/strings.module0.ts`: a single argument goes in a register; multiple arguments keep their existing count and ordering explanation.
- `apps/course/src/runtime-strings.ts`: course-only `Strings.challenge` overrides say Tests passed, followed by passed/total counts. The success interface supplies only total, so success repeats its placeholder. Failure uses passed and total. Existing runtime wiring covers both status and failure-list accessible names.
- `docs/notes/course-pacing-implementation/copy.md`: synchronised only the exact pacing JSON entries and exact call-comparison UI source. Previous checked-facts briefs, validation notes, screenshots and review records remain historical.

Checked source: `ListingCompare.tsx` result caption and stage placement; platform `ChallengeRunner.tsx`, `VerdictView.tsx` and `strings.ts` placeholder support; pacing and Module 0/4 canonical-test expectations. No model, listing, prediction gate, activity or control implementation changed in this pass.

Both closing style passes applied to changed copy. The comparison summary names listings, the direction names both independent runs, and the shared result label describes its display. The shared-display explanation describes this fixed matched-call lesson without adding the returned value or repeating the worked calculation. Existing C type qualifications remain beside the activity.

Focused source validation: `npx vitest run content/lessons/pacing-1-4.prose.test.ts content/lessons/meet-the-machine.prose.test.ts content/lessons/module-4.prose.test.ts` passed 43 tests across three files before the final sentence shortening; rerun recorded below. This drafting pass makes no browser-check or independent-review claim. Managing session arranges callers, interaction tests and independent built-site review.

Final rerun after the last sentence shortening: the same three canonical suites passed all 43 tests. Prettier checks on the six changed TypeScript files and `git diff --check` passed.

Managing-session clarity follow-up: replaced “The 1 argument” with “The argument”, shortened the shared-bit caption, and reduced the call introduction to the action, independent simulated runs and one display with two typed readings. Exact canonical blocks synchronised again.

Follow-up validation: all 43 tests in the same three canonical suites passed; formatting checks on the three polished TypeScript files and `git diff --check` passed.

Sibling mismatch summary now says “The machine instructions differ between the listings.” A source/content/docs search found no canonical copy of the replaced mismatch sentence. This keeps both outcomes explicit about comparing listings.
