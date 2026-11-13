# Six-case flag practice copy draft

Separate Codex drafting pass on 13 November 2026 from the checked `brief.md` and
the new model facts in `packages/views/src/flags-lesson/practice.test.ts`. Read
`AGENTS.md`, `CLAUDE.md`, `docs/style.md`, the authoring guidance, the canonical
lesson/labels/prose, the paired Module 2 prose record, and the authored flags
strings and practice rendering. This pass uses the inherited session model and
effort. Proposed strings and precise integration guidance are in
`/workspace/scratch/flags-practice-copy.md`. No product files were edited.

The three added presentation labels are “Adding 2 near the signed limit”,
“One input with its top bit set” and “Two zero inputs”. They name input
properties already taught by the lesson. They do not name the result or any
flag value. Canonical labels name only the supplied input additions. All first
three case IDs, labels and order remain unchanged.

The authored sidebar now needs “Try six additions”. Other authored directions
already describe one independent addition at a time and completion of every
case, so they need no change. The generic challenge task retains its group
instructions and extends its input list to six. Its title, caption and
construction paragraph change their count together. The paired prose record
must receive the identical heading, paragraph and task. The originality note
changes its practice count to six.

The first four hints remain true and unchanged. The fifth hint extends the
existing full answer to all six cases, using the model-checked new flag values.
Keep five hints and the existing reveal order. Pin the additional numerical
claims in the lesson's facts tests. No numerical answers appear in case labels
or initial instructions. The named follow-up still reverses the first case's
inputs, so its existing explanation and labels remain accurate. The spacing
work needs no new learner copy.

Sentence pass: short input labels, familiar words, no new jargon; numerical
answers confined to the final hint. Idea pass: retain the existing four-flag
procedure; use the supplied input expressions as the concrete task; preserve the one-case presentation
and its checking gate. Source audit also identifies structural comments and
tests that count three cases, while preserving unrelated uses of “three” and
historical review evidence. The scratch draft lists those joins explicitly.

Verification: `npx vitest run packages/views/src/flags-lesson/practice.test.ts`
exited 0, with one file and three tests passed. `git diff --check` exited 0.

This is a source and copy pass. The managing session must check accuracy and
integrate the draft, then obtain independent learner/UX and technical reviews
of the built candidate and record rendered-page verification separately.
