# Independent technical, sceptic and checker review

Reviewed the immutable candidate1 at `http://localhost:4511/assembly-lab/#/lesson/adding-and-the-flags`, served from `/workspace/scratch/flags-compact-result-candidate1`. This reviewer did not draft the copy, implement the change or edit product/tests. Read `CLAUDE.md`, the checked brief, style/visual guidance, the diff, controller, model, state, input formatter, strings, CSS, focused unit/facts tests, both affected educational tests, the course route and the generic lesson's canonical prose/data records.

## Findings and correction checks

1. **Medium, source/test finding, corrected:** `tests/educational/lesson-guidance.spec.ts` still clicked `#columnTrace > summary` and expected its local reveal explanation after that disclosure had been removed. This would make the whole-course guidance audit wait for an impossible interaction. The smallest correction replaces that obsolete interaction with the preserved precommit gate, compact checked values, absence of removed panels and the retained earlier optional circuit's visible explanation. Independently reviewed the revised assertions: whole-course headings, local guidance, overflow and error checks remain. Independently executed the replacement assertions against candidate1 in Chromium at 320/1280px, light/dark; all four combinations passed. The manager separately records the focused whole-course audit result.
2. **Low, source cleanup finding, corrected:** `S.carryNote` became unused when `renderArmInspection` was removed. Its only remaining occurrence was its definition in `strings.ts`; no authored `data-copy` target or other consumer retained it. The manager removed this newly obsolete string. Independently rechecked the diff and repository search: it has no remaining definition/reference, and no rendered target depended on it. This is source-only cleanup after candidate1; the browser checks below cover its unchanged rendered behaviour. The retained `carry()` helper and its strings/styles still serve the section07 follow-up and must stay.

No arithmetic, prediction-gate, practice-grading or rendered-layout defect was found in candidate1.

## Technical accuracy and scope

All checked values use the same existing memoised `flagsModel(PLUS,32,0x7fffffff,1)`. The exact unsigned and signed sums agree for these positive starting inputs. Its stored bits are `0x80000000`; their unsigned reading is `2,147,483,648` and signed reading is `−2,147,483,648`, with C=0 and V=1. `fmt` retains exact BigInt conversion, grouping and the typographic minus sign. The displayed exact sum uses `unsignedSum`; this is accurate here because both operand readings agree. No extra arithmetic, simulator logic or state schema was added.

“The exact signed sum exceeds the signed range. The stored negative reading is valid.” correctly distinguishes the exact mathematical sum from the valid value represented by retained bits. The preceding range cards establish the 32-bit bounds. Earlier section03 explicitly teaches “Add the unsigned inputs for one exact sum, and the signed inputs for the other”, C's unsigned range condition and V's signed range condition. The earlier signed/unsigned lesson states that every 32-bit pattern has both readings, explains hexadecimal, and explains when the readings agree. No new prerequisite or unexplained notation was introduced by this change.

`renderArmFeedback` still requires a canonical commitment and matching draft; source restoration obtains the commitment from `predict-readings`, overriding presentation-only `committed`. Edited unchecked drafts cannot display a different previously checked result. The input display handler still only updates input formatting and pressed states. It does not grade, save new work or rebuild feedback. Clear resets the prediction and canonical slot without changing the input format. Fresh mounts select Hex.

Removed rendering functions, event handlers, element references and CSS belong to the two section06 panels. Searches found no sibling renderer relying on the removed `.byte-groups`, trace-row/cell, column-detail or fixed-result display styles. Earlier four-bit logic has its own renderer and styles; practice/follow-up still needs `carry()` and `.carry-pair`. Legacy panel fields in `state.ts` are accepted compatibility fields and have no remaining rendering consumer. `platform/`, the simulator and challenge schema are unchanged.

The authored S feedback has no duplicated canonical prose string to synchronise. `adding-and-the-flags.prose.ts` and `docs/notes/module-2/prose.md` describe the retained generic lesson's figure/data and remain paired. Deleting or changing that separate figure/prose would broaden this local presentation change. Existing facts tests still validate that data and the recorded arithmetic.

## Independent browser checks

Used repository-native Playwright via `createRequire` and real headless Chromium. `/workspace/scratch/flags-compact-result-technical/review.cjs` exited0; `results.json` records 320px phone and 1280px desktop in both themes. Selected the exact `Theme` combobox, checked actual `html[data-theme]`, and directly viewed all four checked-feedback screenshots. Actual light/dark surfaces, wrapped decimal readings, full feedback and the direct practice route remained readable. No page-level horizontal overflow or page error occurred.

For every width/theme combination independently checked:

- Initial Hex, both range cards, no early result or removed panels, and empty-submit guidance without a reveal.
- Each of the four prediction choices with correct/incorrect grading, one hex result, both decimal readings together, the exact sum, C/V and accurate local explanation; reload restored each checked result.
- Every starting-input display format preserved the stored-work object and checked feedback. Editing a checked prediction hid the result immediately and after reload. Rechecking restored it; clear removed checked values, selection and the canonical prediction slot, including after reload.
- Forged display-only commitment with legacy panel fields could not reveal a result. Malformed draft/commit/reading/column fields and a malformed canonical choice restored without a result or page error. A valid legacy canonical-only prediction migrated successfully when the presentation slot was absent.
- The earlier optional circuit still opened. All three practice cases still graded, completed the canonical challenge, restored completion on reload, and invalidated completion and feedback when a checked answer was edited; a wrong resubmission failed.

`check-guidance.cjs` separately exited0. It exercised the revised local guidance assertions in all four width/theme combinations, including the retained circuit equation and sign-bit explanation. The direct section06 next link reached section07 while preserving the lesson route.

## Sceptic pass on learner review

Read the independent `learner-review.md` after completing the source/browser pass above. Its no-introduced-finding conclusion survives the checks: both readings share one stored hex result, the local signed-range qualification is accurate, stale checked feedback hides on an edited draft, and the route into fresh practice still works. The learner's initial scratch `.check()` interception is correctly recorded as a targeting failure before the successful visible-label rerun; it does not change the exit status of that failed command or establish a product defect.

**L1 accepted as low, pre-existing terminology debt and deferred:** section03 says “The CPU performs one addition.” Independent source search finds no earlier expansion of CPU; fundamentals instead teaches “A register is a small, fast store inside the processor” and defines the simulator as imitating the processor. Being familiar with “processor” does not establish that the unexplained abbreviation has been taught. `git show HEAD:packages/views/src/flags-lesson/strings.ts` contains the identical sentence, so this change neither introduces nor relies further on that term. The smallest direction is to use the taught term in a separate section03 copy follow-up. This low baseline finding does not block the approved local section06 removal, and is recorded rather than silently dismissed or expanded into this implementation.

Rejected concerns, with evidence: the negative stored reading is not out of range (it equals the signed range's inclusive minimum); the exact positive signed sum is the quantity that exceeds the maximum. A single displayed exact sum is appropriate here because both positive starting inputs have matching signed/unsigned readings. Legacy panel flags cannot recreate a panel or bypass canonical commitment (independent restored-state browser checks above). The remaining carry helper is not dead code (section07 follow-up still calls it). No additional change-introduced finding remains open.

## Test review and limits

`npx vitest run packages/views/src/flags-lesson/state.test.ts packages/views/src/flags-lesson/input-display.test.ts content/lessons/adding-and-the-flags.facts.test.ts` exited0: three files, 61 tests passed, no failures/skips. Existing facts pin the stored hex, both numeric readings, exact sum and flags. Existing state tests retain forged/malformed presentation, canonical migration, grading and independent-case invalidation checks.

The `flags-lesson.spec.ts` changes replace deliberately removed explorer/bit/column UI assertions with direct checked-result assertions. They retain meaningful input-format, gate, draft/store, clear/reload, grading and practice assertions, add all four range choices and compare displayed values with the existing model. Arithmetic column/model tests remain; no requirement for a retained interaction was weakened. The stale whole-course guidance assertions were corrected as finding1 records.

These are focused source, unit and Chromium checks. This reviewer did not run the full repository suite, exact-head CI or public deployment checks. Screen-reader speech, physical touch hardware, forced colours and every arbitrary corrupted-storage permutation were not tested. The manager records full-suite/CI/deployment outcomes and any historical failures separately; the passing focused checks here do not replace them.
