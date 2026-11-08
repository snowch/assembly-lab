# Independent technical review: comparison and count wording

Reviewed 7 November 2026 by a separate Codex reviewer session using `gpt-6.1-sol` with `xhigh`
reasoning and `fork:none`, following the authoring recommendations. The reviewer made no
implementation changes and no commits. The tracked diff and new runtime-feedback test were read
before the drafting brief or author explanations; the new `brief.md` and `draft.md` were not used
as evidence for the verdict.

## Verdict

No remaining technical blocker in the reviewed changes. The wording describes the operation
that the component and simulator perform. One stale control-name description in the canonical
prose record was reported, corrected by the managing session and independently re-read.

Scope: every tracked edit in the comparison/count change, the new
`apps/course/src/runtime-strings.test.tsx`, corresponding simulator and runtime implementations,
published lesson wiring, and canonical prose. The unrelated untracked Module 12 Pi sources brief
was excluded.

## Accepted finding

**T1, low, resolved: canonical state description retained the old control names.**
`docs/notes/course-pacing-implementation/copy.md`, in “Arithmetic comparison revision: checked-facts
brief”, still said “Call both functions” and “Reset calls” while the exact UI block and controls
said “Run comparison” and “Reset comparison”. This would mislead a maintainer using the canonical
record. The smallest correction was to update those two names in the state description. The
managing session made that correction; the reviewer independently re-read the resulting paragraph
and confirmed that its names now agree with the implementation and adjacent exact-string block.

## Technical checks and rejected concerns

- **The listing summary does not equate `sub` with `ret`.** “Both listings have the same machine
  instructions.” describes corresponding operations across two listings. `compareListings`
  assembles each recording and compares `Instruction.op` at the same index. Existing focused
  tests independently assert the two matching rows (`sub`/`sub`, `ret`/`ret`), a differing first
  operation, and an unequal-length comparison. Both rendering branches now use the constant
  string, and a repository-wide caller search found no remaining invocation of `allSame(n)`.

- **One press still performs two independent calls.** The “Run comparison” label does not change
  execution. The component maps over the two recordings and calls `traceOf` separately with
  each recording's entry label and the same `comparison.args`. Each `traceOf` assembles and runs
  its own program. Neither trace consumes the other trace's result. The published lesson supplies
  `[3, 5]` to the signed and unsigned recordings; the revised introduction states that each
  function starts independently from those arguments.

- **Combined bits are conditional, and fault/difference handling remains intact.** `CallResults`
  renders a shared word only when the first return value exists and every call value equals it.
  Differing successful values keep two bit words; a fault retains its own error status and does
  not borrow the successful call's value. The focused call tests exercised those cases, negative
  and positive differences, equal C types, optional working, reset, full lesson reset and restore
  with changed inputs. The new “shared by both calls” label describes equal computed words,
  without claiming that the model calls share a register or execution state.

- **Prediction and execution gates are preserved.** Comparison rows and instructions remain gated
  on the committed prediction. Returned values, arithmetic working and typed readings still
  require both a committed prediction and the call action. Reset comparison removes returned
  results while retaining the committed prediction; a lesson reset closes both gates. These are
  assertions about the component state and computed outputs, independently exercised in jsdom.

- **The type statements fit the actual example.** The two recorded sources change both parameter
  and return types. Their preserved GCC responses contain `sub w0, w0, w1` followed by `ret`.
  The new text says the resulting bits have a C reading for each return type; it does not claim
  that a return type alone determines an expression's arithmetic type. With the published inputs,
  signed −2 is in range and unsigned subtraction wraps to 4294967294. The focused facts test
  confirmed `0xfffffffe` and both readings, with unchanged condition flags. The source references
  remain the target-specific AAPCS64 sizes and N3096 arithmetic rules documented in
  `docs/sources.md`. No new architecture or C-standard behaviour is introduced by these edits.

- **The challenge override uses the supported runtime API.** `Strings.challenge.passing` and
  `.failing` are strings, and `ChallengeRunner` supplies exactly `{total}` for passing and
  `{passed, total}` for failing. The formatter replaces every occurrence, so repeated `{total}`
  in the passing template is supported. `VerdictView` uses that same failing template and slots
  for the failure list's accessible name. `App.tsx` already passes `RUNTIME_STRINGS` to the lesson
  page, so the override reaches the actual course. The platform files remain unedited, and the
  platform synchronisation check passed.

- **The new runtime test checks rendered feedback, not just template text.** Its one-case and
  three-case fixtures use the real course grader through `ChallengeRunner`. For a failed saved
  attempt it asserts the visible status and the named, visible failure list. For a passing saved
  attempt it asserts the status and absence of that list, then presses Run tests and checks the
  passing status again. The fixtures repeat one real case to vary the verdict total, which is
  sufficient for this grammatical change. Partial-pass formatting is also used by existing browser
  helpers; the new test itself does not exercise a mixed verdict.

- **The singular branches have real callers.** The new instruction-count test runs an assembled
  function containing only `ret`, with no arguments, through `CountPrediction` after commitment.
  Its feedback contains “1 instruction, including ret” and excludes “1 instructions”. Existing
  multi-instruction tests remain. The argument-caption tests render `ArgsFigure` with parameter
  arrays of length 1, 2 and 4 and assert the corresponding singular/plural grammar while the
  prediction-dependent reveal remains absent. The schema requires at least one parameter; zero
  is outside this caption's supported input range.

- **Browser expectation updates retain meaningful coverage.** The changed educational helpers
  now use the course runtime strings for passing/failing status expectations. Their formatter and
  verdict assertions remain; they are not weakened to substring checks. Other browser files that
  still import platform defaults use unchanged fields such as reset or blocked, while their
  passing/failing helpers come from the updated shared helpers. The listing browser assertion
  changes from calling the removed count formatter to reading the new summary constant.

## Independent verification

All commands below exited successfully in this reviewer session:

```text
npx vitest run apps/course/src/runtime-strings.test.tsx packages/views/src/interactives/ListingCompare.calls.test.tsx packages/views/src/module1Figures.test.tsx packages/views/src/module0.test.tsx packages/views/src/branchFigures.test.tsx content/lessons/one-pattern-three-readings.facts.test.ts content/lessons/module-1.listings.test.ts content/lessons/pacing.test.ts
8 files passed; 164 tests passed; no failures or skips reported.

npx vitest run content/lessons/c-types-subtraction.test.ts
1 file passed; 3 tests passed; no failures or skips reported.

npm run typecheck
node scripts/sync-platform.mjs --check
git diff --check
```

The second focused command checked the two trip recordings against their saved compiler responses
and the real-tools corpus after locating the dedicated recording test. It was additional source
evidence, not a rerun used to replace a failed command.

## Limits and material risks

This review ran component/facts tests and strict typechecking, and read the app/runtime wiring.
It did not inspect a browser or take screenshots. Phone/desktop rendering, both themes, live-region
announcement behaviour in an assistive technology, and the built-site interaction checks therefore
remain the managing session's separate verification. This review did not run the full check script
or GNU/QEMU differential command; the listed facts and corpus tests do not stand in for those
checks. The change introduces no simulator, machine execution or platform implementation change.

There is no evidence here of observed beginner comprehension. Acceptance concerns the technical
claims, preserved gates and feedback wiring; the independent learner review remains distinct.
