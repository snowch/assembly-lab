# Upper-half doubling review

## Change and editorial checks

Applied the user-approved worth/doubling wording and arrow sequence under Find the two halves. The label says Double each time; upper-half values of 1 and 2 have explicit whole-number contributions. The existing worked equation, procedure, calculator and challenge gates remain in place. Canonical prose is synchronised.

A separate GPT-6.1 Sol Medium copy pass supplied the exact replacement. The managing editor checked the whole lesson's join and both closing style passes. The existing facts test now runs repeated additions and pins every displayed value to its corresponding model state; the numeric guard includes those verified values. No new executable learner example or interaction was added.

## Independent reviews and decisions

Requested configurations: a fresh GPT-6.1 Sol High reader, and a separate GPT-6.1 Sol Extra High technical/sceptic reviewer. Both inspected the built lesson at 375×812 and 1280×800, in actual light and dark themes. Earlier preparation was read in source. Neither authored the learner copy.

No actionable findings remained. Both reviewers confirmed readable arrows, no document overflow, a coherent join to the worked equation, the worked stepper and Reset, calculator operations and the locked solution after testing the invalid starter. The phone sequence wraps onto two lines; desktop uses one. The managing editor also visually inspected phone-light and desktop-dark captures.

The technical review rejected an ellipsis objection: it denotes omitted doublings, while the lead explicitly says sixteen doublings. Model states pin the shown values. The reader is not told the arrows execute instructions. It also rejected a missing-prerequisite objection: the prior lessons define bit 0, doubled unsigned place values, set-bit contributions and the two 16-bit halves. No extra miniature or control is needed for this narrow correction.

Evidence: /tmp/doubling-reader.md, /tmp/doubling-technical.md, their screenshots and structured browser records. The reader did not submit a successful challenge or inspect hints/restored passing work; the technical review also did not test every editor mode. These are bounded agent/source/Chromium checks, not a human novice study or assistive-technology validation.

## Check results

- Initial model/facts run: 1 file, 43 tests passed.
- Final focused suite: 5 files, 81 tests passed, including facts, canonical prose, lesson structure, instruction gates and pacing. This includes the facts tests; do not add the totals together.
- Independent technical facts/canonical rerun: 2 files, 51 tests passed.
- Production build, TypeScript, edited-source formatting and diff-whitespace checks passed. The build retains its existing chunk-size advisory.
- Existing browser cases: 6 passed, no skips or failures, covering worked halves, the locked solution and legibility on desktop/phone.

Full required CI, merge/tree equivalence, exact-commit Pages deployment and live verification are recorded in the pull request when complete. Focused checks above do not imply those release results.

## Final common-unit refinement

The user then asked to explain the common-factor reasoning to readers. A second separate Medium copy pass added the visible connection: upper-bit values are multiples of 65536, the upper half counts whole groups, the lower half contributes less than one group, and whole-number division therefore separates them. No GCD/LCD vocabulary is introduced. Existing worked values and the calculator procedure remain.

The model assertion now runs through bit 31 and checks that every upper-position contribution is divisible by 65536. It also checks the largest lower-half value remains below one group. The numeric guard and shown values are unchanged from the first draft.

Both independent reviewers rechecked the final build in all four actual viewport/theme contexts and updated their reports with distinct final-revision evidence. No actionable findings. The final reader found the reason for division explicit; the final technical review verified all 32 bit values, upper multiples and the lower bound. Calculator, worked step/reset, wrapping and the locked gate were rechecked. The managing editor inspected representative revised-copy screenshots. Earlier review evidence remains separately labelled as superseded.

Final focused checks passed again: 5 files / 81 tests, TypeScript, production build, formatting and diff whitespace; existing browser cases 6 passed with no skips. Independent final facts/canonical rerun: 2 files / 51 passed. These overlapping reruns are not additional unique tests. Superseded-head CI is not release evidence; final workflow, merge and public verification belong to the final PR record.

## Final model-driven visual

The user requested a visual. The worked two-half register now opts into a contribution view; other views and the gated learner-solution figure keep their existing defaults. Each half retains its hexadecimal value and Written/Kept mark. Decimal group/unit counts, contributions and a whole-value equation come from the same current trace state. Plain Number arithmetic is exact throughout this unsigned 32-bit range; no signed bitwise coercion is used. The separately drafted caption introduces groups and units before the figure. Two static contribution-example sentences were removed to avoid repeating what stepping now shows.

The code tests cover initial/MOV/MOVK/RET/Back/Reset, singular labels, the maximum unsigned value, closed bit details and default sibling behaviour. New words are recorded in view-copy.md and the existing reviewed-string inventory; no new controls, generated solution, bit picker or instruction is introduced.

Both independent reviewers checked the complete visual in four actual viewport/theme contexts. Accepted finding: on phone the initially short footer fit one row but the MOVK equation wrapped onto two, moving Next down 32px. The phone footer now always uses a single-column, two-row arrangement. Text size is unchanged. Both reviewers independently verified unchanged footer height, Next document position and scroll position through every worked state with fixed-scroll clicks/taps; contribution cards, sum and controls stay visible together. The original finding and earlier evidence are retained in their reports. A height invariant was added to the existing worked browser case and preserves its numeric/write/keep assertions.

Final evidence: /tmp/doubling-viz-reader.md, /tmp/doubling-viz-technical.md, their fixed-layout JSON records and screenshots. No open findings. The managing editor inspected representative final phone and desktop captures. These remain bounded agent/browser/source checks, not a novice study, full assistive-technology audit or physical-device test.

Visual focused checks: 6 files / 129 tests passed; independent view/string rerun 51 passed; TypeScript, production build, formatting and diff-whitespace passed. First visual browser invocation passed 14 cases, despite the layout issue found independently. The rebuilt final invocation passed the same 14 cases including the new tight height assertion, no skips. No failed command is being reclassified as passed. Superseded copy-only CI is not visual release evidence; final-head CI and live checks are recorded in the PR.
