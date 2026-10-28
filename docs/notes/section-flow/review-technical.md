# Independent technical review: section flow

Reviewer: separate technical-review agent/session, 28 October 2026. The reviewer did not draft or edit product changes. The assessment began with the lessons, prerequisites, repository instructions and named source records; it did not use the drafting rationale or audit record to form its findings.

## Source scope

Read the 34 lessons in course order, including their prose and relevant figure configuration, against the before state at `864a90d`. Read `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, `docs/sources.md`, the plan and visual-language rules. Inspected shared `LessonView`, storage/gate semantics, the changed CSS and test assertions.

The parsed before/after comparison covers all 34 lessons, all 266 interactive figures and every challenge. Figure identity, kind, time model, role, caption and complete props are identical, in the same sequence, after excluding only the outer prose fields `lead` and `after`. Challenge data and prerequisites are identical. Section detail contents and their relative order are identical. The comparison is recorded in `/tmp/section-flow-technical-source-results.json`; snapshots are `/tmp/section-flow-technical-base.json` and `/tmp/section-flow-technical-final.json`.

There are 301 sections before and 271 after; 15 lessons change their section structure, title or placement of prose. No new technical prose appears. The only deleted prose is the opening framing and repeated compiler recap in Putting it together. Its compiler version and setting remain beside the compiled example, and its compiler note retains the comparison with `-O0`.

Checked these technical constraints explicitly:

- Register, instruction and operand definitions precede the first addition. Read-before-write, the definition of `sub`, and the distinction between consecutive operations and fresh examples precede their uses.
- The result explanations moved into figure `after` fields retain their position after the relevant figure. The generic operand rules do not disclose a fresh exercise's values. The introductory signed/unsigned reading explanation remains between the original subtraction and the following addition prediction.
- Prediction questions, options, explanation payloads and downstream `props.after` references are unchanged. A section move does not change their storage keys. `LessonView` renders outer `lead` before the caption and outer `after` after the interactive body; those fields are distinct from a component's prediction-gate prop.
- The constants-in-halves statement now follows the solution-halves figure. The separate shifted-immediate activity retains its own descriptive heading and its operand-range qualification.
- Width and signedness statements remain local, including writing `w` clearing the upper half of its `x` register, narrow-load extension, unsigned wrapping, signed C overflow, incoming low-width guarantees, widening before multiplication/division and calling-convention preservation.
- Module 12 keeps recorded native output distinct from browser execution and retains external tool/setup procedures. Module 13 still says “Hardware verification is pending” and preserves its build-versus-physical-test limitation. A32 records remain explicitly static; interactive execution remains A64 only.
- The CSS removes the special rules that made surplus Fundamentals headings visually hidden. The retained headings use their normal layout. Only generic authoring-stage labels are hidden. The new authoring guidance explicitly preserves definitions, prediction gates and result ordering while requiring real section consolidation.
- Test changes inspected replace positional section assumptions with semantic section lookup or actual lesson length. Numeric/model, gate, note, source-pairing, restored-work and interaction assertions are retained. The highlighting setup now waits for the actual trip listing; it does not remove a highlight assertion.

No supported technical defect found in source. This is a review of the consolidation, not a new certification of all pre-existing ISA, C or native claims. No new primary-source access or native/hardware run was needed to assess unchanged technical content.

## Browser scope

Reviewed the frozen production build at `http://localhost:4399/assembly-lab/` with Chromium, at 1280 × 800 and 375 × 812, in actual rendered light and dark themes. Each of the 34 lessons was opened in a fresh context for each viewport/theme combination: 136 initial page checks. These checked the rendered lesson and section titles, normal visible heading layout, hidden generic stage labels, mounted figures, absent prediction outcomes, absence of broken figures or console/page errors, and absence of page-level horizontal overflow. Each pass also checked all 93 figures gated by a prediction's `props.after`; every gate was initially closed.

Focused interactions covered these patterns in all four viewport/theme combinations:

- Putting it together: selecting an option still hides the result; “See what happens” commits it; the following stepper unlocks; Next advances; Reset restores its initial view; reloading restores the committed prediction and unlocked stepper. The final `after` explanation remains readable beneath the figure.
- One pattern, three readings; Calls, returns and the stack; and the native GDB comparison: initial gate, choice, commit, Next, Reset and committed state after reload.
- Elapsed-time counter, bit mask and shift figures: initial gate, uncommitted choice, committed reveal and restoration after reload.
- Addition columns: prediction gate, column reveal, Reset, and the local calculation-role note. The note remains available and distinguishes revealing arithmetic columns from executing another instruction.
- Native recorded startup: prediction gate, recorded stop selection, return to the first stop and restoration of the prediction. The figure visibly identifies itself as recorded evidence.
- The subtraction-repair challenge: reference solution passes and the completed work is restored and regraded after reload. No solution is reproduced in this note.

Visual screenshot inspection sampled One addition, Putting it together, addition columns, Calls, returns and the stack, and recorded native startup, including both widths and themes. The phone listing contains its own horizontal scroll; the moved prose remains readable at the course's normal measure. The inspection was not a manual visual rereading of every viewport of all 34 long pages.

Artifacts: `/tmp/section-flow-technical-browser/results.json`, `/tmp/section-flow-technical-browser/focused-results.json`, screenshots in that directory, and the browser audit scripts/logs beside it. The broad custom audit records four harness errors: it initially looked for a generic “Check” button in the Removing ret prediction, whose real button is “See what happens”. Those errors remain in its original JSON/log. The separate focused run uses that visible label and passes all four configurations. It also adds actual column reveal/reset checks, because a column control is not called Next. Neither result is represented as a product failure or silently removed from the original record.

## Findings and limits

No supported technical finding. No new unexplained prerequisite was introduced by these moves. The current CSS, authoring guidance and test changes also have no supported technical finding after independent source and built-page review. No finding needs a rewrite or correction direction.

This review did not run the full CI suite, GNU/QEMU differential checks, native tool procedures, external GCC requests or a physical Pi test. Existing correctness payloads are unchanged; full-suite outcomes belong in the managing session's validation record, with any initial failures and subsequent reruns reported separately. Browser activity coverage is the focused scope above, not every challenge and every state on all 34 pages.

## Final source and validation follow-up

Independently reviewed the final root diff and validation record. The latest Fundamentals browser assertion requires the three observed descriptive headings, and its tiny-function selector checks the same argument explanation in the retained investigation section. No meaningful behaviour assertion was removed. Re-parsing all 34 lessons before the CI correction confirmed complete data identical to the frozen review snapshot after the unused-label cleanup.

The validation record's content, unit, canonical and build totals/durations match their logs. A minor documentation finding was raised because wording described pending CI, merge and deployment outcomes as recorded. The requested direction was to mark those outcomes pending until evidence existed. Independently verified the correction to “will be recorded” and explicit pending status. That note correction required no product change.

## CI gate correction review

The first full CI run subsequently found a real presentation invariant that this review missed. The Constants and widths solution figure had the outer `after` sentence “A constant that does not fit in one `mov` is built half by half, with `mov` then `movk`.” `LessonView` renders that prose even when `WideStepper` returns its locked placeholder. The unchanged browser assertion requires the locked solution figure to contain no solution instruction words. The initial review exercised prediction-dependent gates but did not exercise this `fromChallenge` gate. Its earlier no-finding conclusion did not establish that this state was correct.

The accepted correction removes the duplicate outer recap and its unused prose/canonical record. This is the smallest correction: the construction still explains the `mov`/`movk` rule before the challenge. The shifted-constant ADD heading and activity remain. No gate, test assertion, program, challenge or expected result changes.

Independently checked the corrected production build on port 4399 at 1280 × 800 and 375 × 812, in actual light and dark themes. All four combinations passed these checks:

- Initial solution figure: locked placeholder, no instruction rows, halves, Next control, solution-introduction words, outer recap or solution instruction words.
- Passing learner work: introduction and the learner's instruction listing/halves appear; Next advances and Reset returns to the first state. Reload restores and regrades the passing work.
- Editing the passing work to an invalid result: the solution figure closes immediately, before running tests, and remains closed after running tests and reloading. Introduction and solution content are absent throughout.
- Passing again, then Clear work and Discard work: the figure closes and stays closed after reload. No page overflow or console/page error occurred in any checked state.

Screenshots were inspected for desktop/phone, light/dark locked, passing and invalid states. Results and screenshots are in `/tmp/section-flow-technical-constants/`; the script and log are alongside that directory. All states above pass in `results.json`, with no harness errors.

Expanded the source audit to every outer `lead` and `after` in all 34 parsed lessons, checking prediction gates, `fromChallenge`, `afterChallenge`, and primitive-operation result hiding. After the correction, eight new outer `after` fields remain: three Fundamentals operand/state explanations; Putting it together's generic execution explanation and final tracing advice; the signed/unsigned definition; warning-word motivation; and unsigned shift motivation. None contains a learner-specific solution, solution-introduction wording, or the computed answer to its associated question. The generic explanation under the gated Removing ret figure names no predicted value and occupied the same reading position as a separate section before this change. No remaining new outer prose is attached to a challenge-derived gate. The pre-existing register-view `after` and subtraction-calculation `lead` are unchanged. The complete inventory is `/tmp/section-flow-technical-prose-gates.json`.

Reviewed the added validation history against the correction, build and focused logs: 81 tests in three files, 12 unchanged solution-stepper browser tests, build/type checks and their stated durations agree. The original CI failures and skips remain recorded separately; corrected exact-head CI and deployment are still marked pending. The correction closes the CI finding, and the expanded audit found no further issue. Review notes are frozen at this point for the correction commit.
