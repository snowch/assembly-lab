<!-- Copyright © 2026 Christopher Snow -->

# Independent review: header calculator workspace

Reviewer: separate `carry_review` agent, which did not draft or implement the workspace. Inspected actual product source and initial built UI before reading the author's brief. Applied repository authoring/learning-design guidance in separate learner/interface and technical passes. No product edits by this reviewer.

## Learner and interface pass

Calculate keeps A, B and Result in distinct labelled rows with one set of bit positions and one shared horizontal scroll region. The input patterns remain visible after calculating; chaining requires the explicit “Use result as A” action. An unapplied entry for A remains separate from the loaded Value A. Changing B clears the result rather than showing an old answer against new inputs. Unknown output cells and “Choose Calculate” distinguish an uncomputed result.

Edit bits has a separate named tab and edits A explicitly. The optional 16-bit-half editor sits in that view, leaving the calculation's inputs and result together. The width guidance explicitly explains truncation and zero-filled widening even in Signed mode; scratch-work copy says these controls do not run instructions. No course answers or simulator state are read into the calculator.

The global header can be opened before the course introduces signed/unsigned readings or hexadecimal. The former header tool provided short local definitions beneath those readouts. The initial workspace omitted those definitions; that accepted prerequisite regression is corrected and verified below. Earlier course lessons do teach the concepts, but their availability later in the course does not make them prior knowledge for every header-tool user.

## Browser evidence

Initial inspection covered 320/375/834/1280px in light/dark, asset `index-CYbT1Shg.js`. No page or panel overflow occurred; the header stayed 62px on phones and 68px on larger screens. The GitHub link is a plain named anchor, with no fabricated count or star operation. The initial candidate had a scroll-restoration defect described below.

Final functional matrix covered the same eight contexts after the scroll correction and rebase, asset `index-DIAqvecD.js`. Verified:

- Exact 32-bit maximum plus one and 64-bit maximum plus one, including distinct full and retained results, with A preserved.
- Signed 64-bit minimum minus one, and a left shift by 63 with an explicitly unsigned full-shift label. A shift count of 64 is rejected locally and does not retain a stale result.
- Pending A entry, B-result invalidation, explicit chaining and unknown result cells.
- Identical x coordinates for the same bit positions in A/B/Result at 64 bits; high/low shortcuts and shared scrolling.
- Initial low-bit alignment, plus an arbitrary offset of 273px retained through close/reopen. Initial maximum offsets were 743px at 320, 688px at 375, and 477px in the larger dialog contexts.
- Calculate/Edit tab keyboard selection; editor Space, Home and Arrow Down; four-column phone and eight-column larger editor layouts; 44px button targets.
- Half editing, an open half disclosure through view changes, exact value and view through close/reopen and a real lesson route change, with saved lesson work unchanged.

The no-JavaScript static header was independently checked at 320/1280px. It exposes the same plain “Star on GitHub” destination and stays within the page. Final editor captures were inspected on phone light and desktop dark. Screen-reader-user, zoom/high-contrast and physical-touch testing were not performed.

## Technical pass

The workspace uses the existing machine calculator for parsing, widths/readings, arithmetic and half replacement. It does not introduce a second arithmetic model. Exact patterns/results are decimal strings backed by BigInt. The display formatter groups full-precision decimal digits and hexadecimal nibbles without converting values through Number.

Independently bundled the actual pure workspace helpers and checked 448 boundary combinations against separately computed BigInt expectations: 32/64 bits, both readings, add/subtract and boundary shifts. Checked modulo-width retained patterns, exact full values and preservation of A. All passed. This review does not claim a new Arm or C execution guarantee: the tool is scratch arithmetic and explicitly does not execute instructions.

Result traces are recomputed from A, parsed B, width, reading and operation. Restoring a trace requires its source metadata to match; supplied output fields are recomputed. Source inspection confirms edit/apply/settings changes invalidate traces, while a pending A entry remains unapplied. Existing contextual `ProgrammerCalculator` and its exercise component are unchanged.

The header retains the former handoff key `header-calculator::ProgrammerCalculator.global.widths`. Independently seeded valid one-shot browser handoffs for legacy and new workspace snapshots: exact patterns, drafts, reading/width and operands restored; legacy full output is labelled “Previous full result”; new matching trace metadata regenerates the correct result rather than trusting corrupt supplied output; saved scroll is restored and the one-shot storage is consumed. Read the actual component handoff unit test that migrates old ProgrammerCalculator to Workspace and then another Workspace. This reviewer did not execute a full service-worker update/reload transaction; the browser seed checks and source/unit-test inspection are narrower evidence.

## Findings and challenged concerns

- **Medium, initial shared-scroll restoration (`CalculatorWorkspace.tsx`, layout effect). Accepted and corrected.** The child measured the dialog before its parent opened it. At 375px the initial offset was 0; Low bits moved to 688, but closing/reopening returned to 0. The correction waits for a nonzero visible size before aligning and disconnects its observer afterwards. The eight-context final matrix independently verifies low-bit defaults and custom-offset restoration. It does not repeatedly force the scroll position while the user moves it.
- **Medium, local interpretation definitions (`CalculatorWorkspace.tsx`, readouts).** The initial workspace labels signed/unsigned/hexadecimal outputs but drops the old global tool's `signedHelp`/`unsignedHelp` and `hexHelp`. Direction: retain those existing concise definitions near Value A, without repeating them beside every result. Accepted and corrected by reusing the existing short definitions beside Value A only. Final verification is recorded below.
- Rejected: entering a new A draft must immediately invalidate an existing result. Value A remains the loaded pattern until Apply; the input is explicitly an entry field. Keeping the current calculation while that draft changes is consistent with the tool's two-step loading action.
- Rejected: the B row should remain during a shift. A shift amount counts positions rather than supplying a second word-sized operand; its decimal count field is named locally.
- Rejected: hiding the bit editor or half editor loses functionality. Both remain named, keyboard accessible and preserve their exact arithmetic; their placement removes unrelated controls from calculation comparison.
- Rejected: the legacy full output should be presented as a fresh result. Legacy state lacks the new source snapshot. Labelling it previous preserves pending work without inventing a calculation trace.

## Evidence, harness history and limits

Scripts, screenshots and JSON are under `/workspace/output/calculator-workspace-review/`: `initial.json`, `functional.json`, `model-results.json`, `handoff.json` and their associated scripts. The initial scroll probe is retained as `reopen-scroll.cjs`. The first functional harness stopped at a label-based locator for an implicitly labelled select; the browser accessibility snapshot exposed the correct “Operation” combobox. A role-based locator corrected the harness. The failed run remains separate (`functional-first.cjs`); the corrected eight-context pass does not change its outcome.

The managing session owns repository tests, full checks and publishing. No full-suite pass is claimed here. No novice study was performed. Expert interface review, exact arithmetic checks and browser interaction do not establish learning effectiveness or complete accessibility conformance.

## Final readout correction and disposition

The managing session restored the existing selected-reading definition and hexadecimal definition in Value A, without repeating them in the result. Independently rechecked final asset `index-B4KvN1gF.js` at 320/375/834/1280px, light/dark. The correct unsigned definition is visible initially; switching to Signed shows its negative-weight definition. The hexadecimal definition remains visible. A 64-bit signed boundary value and calculated result still fit, and the result group does not duplicate the helpers. No page or dialog overflow occurs in any of the eight contexts. Final phone-light and desktop-dark captures were inspected.

Evidence: `definitions.json`, `definitions.cjs` and `final-*-readouts.png` in the review evidence directory. Arithmetic, state and dialog behaviour did not change in this correction, so the preceding functional/model/handoff evidence remains applicable with its recorded asset identity. Both accepted medium findings are closed. No remaining blocking learner/interface or technical finding identified. Full-suite and release status remain the managing session's responsibility.
