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
