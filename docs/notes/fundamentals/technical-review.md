# Independent technical review

Copyright © 2026 Christopher Snow

23 October 2026. Reviewer did not author the app, lesson, copy or integration changes.
Read the four new lesson definitions and all learner copy, changed synthesis lesson, single-stage
figure, grader, introduction metadata, registry/plan integration, tests, checked compiler listing,
GNU/QEMU corpus, implementation brief and later-activity audit. This is a technical/source review;
independent lesson readers and final built-site checks supply the visual review.

## Findings and decisions

| Finding | Decision and evidence | Verification |
| --- | --- | --- |
| Addition explanation said every instruction reads inputs and writes its destination. | Accepted. `ret` is already the next lesson and has no ordinary-register destination; later branches/stores also make the universal claim false. Scope the explanation to this addition. | Source now says “This addition reads its inputs and writes its destination.” Canonical copy agrees. |
| Sequence generalisation called the worked example “below”, although its figure is above. | Accepted as an avoidable location ambiguity. The fresh-input challenge below is a separate task using the same sequence. | Source now says “The worked arithmetic example…” without a misleading direction. |
| Canonical synthesis question differed between “perform” and “carry out”. | Accepted sync failure encountered during concurrent drafting. Keep the complete bidirectional assertions. | Source and canonical now both say “perform a complete C function”. Focused rerun recorded below. |
| New first challenge is technically graded at return rather than the displayed arithmetic prefix. | Rejected as a result mismatch. Each arithmetic model appends only `ret`; simulator records no register writes for that instruction. Prefix and final register answers therefore agree. Function lesson executes its actual return. | Model tests pin each fresh answer and the wrapper's empty write set; differential corpus covers the exact calls. The wrapper remains hidden from first-lesson learner content. |
| Removing old stage persistence could lose existing exercise work. | Rejected for graded work. Old synthesis lesson and both graded challenge IDs remain unchanged; four new lesson IDs have separate stores. Retired `first-operations` ungraded slot is no longer used. | Source inspection of IDs and lesson-store isolation. New single-stage restore/reset tests check local behaviour. |
| Splitting lessons could introduce unsupported instructions earlier. | Rejected. TAUGHT moves `add`, `ret`, `sub` to their respective lessons and accumulates normally. Answer-only first challenge does not expose its wrapper `ret`. | Introduction and term-gate tests; all registries match metadata. |
| Fresh problem answers might leak through worked examples. | No confirmed exact-case leak. Worked cases and fresh challenge inputs differ; fresh outputs are confined to the final hints/reference. A worked addition happens to share a sum with the fresh addition, but the task changes operands/destination and asks the preserved input too. | Source inspection of sections, captions, stage copy, tasks and hints; browser readers check rendered states. |

## Mechanisms and records

All four new challenges use the existing answer grader and model-derived reference answers.
The first, third and fourth use arithmetic wrappers with no C invented for them. The tiny function
reuses unmodified recorded GCC 16.1.0 output and checked C associations: the two instructions map
to the return expression in the teaching view; original closing-brace debug references remain in
the disclosure. The figure presents argument/result through the model's caller boundary and says
that the actual calling instructions are omitted. No premature `bl`, link-register or stack
mechanism is required.

The component accepts one fixed `stage`, with only instruction position/prediction state. No
production `stages` pager or completion-dependent curriculum navigation remains. Both subtraction
figures are separately embedded. Plan ordering is four new lessons followed by preserved
`meet-the-machine`; that route contains explicit links to the four prerequisites. Ordinary
next/previous lesson links are registry-derived. Numbered C and assembly remain in the existing
paired listing renderer and local pane navigation, not a new rendering implementation.

The implementation brief's arithmetic claims agree with simulator traces and source records.
The later-activity audit covers every one of the 25 subsequent lessons; its bounded result does
not claim a full novice/pacing study. Named comparisons are distinguished from silently replaced
curriculum. It records which representative cases were actually exercised in four browser
contexts and which remaining decisions rely on source. The plan retains module number and stable
module ID while changing its display title, avoiding renumbering later lessons or breaking links.

## Commands and limits

- Initial focused command over six files: **exit 1, 62 passed / 2 failed**. Both failures were
  the synthesis canonical mismatch described above. This original outcome is not replaced by
  the rerun.
- Independent GNU/QEMU commands with exact `--only module0-primitives` and
  `--only module0-increment`, each `--corpus`: **7 calls / 23 instruction states** and
  **5 calls / 15 states**, respectively, **zero differences**.
- Stable-copy focused rerun: **exit 0, 8 files / 172 tests passed**. Covered fundamentals,
  primitive figure, instruction introductions, synthesis schema/grading, canonical prose,
  plan, existing worked/recorded-listing facts and course-wide source associations.

No app files changed by this reviewer. Browser layout, actual themes, pointer/keyboard controls
and visual accessibility are outside this source review and require the independent built-page
checks. A passing source check alone does not certify those properties.

## Follow-up integration review

Reviewed the final `docs/plan.md` Module 0 row: it now lists all five visible lessons, the
small-to-complete-function progression, and fresh-input practice before the synthesis exercises.
The stable module ID/number remain unchanged. Reviewed shell navigation test migration: plan
links are still asserted against every registered lesson, the first-lesson boundary now uses
`one-addition`, next/previous checks use registry order, the preserved synthesis route retains its
own title/address check, and the final optional-lesson boundary remains covered. The changes
preserve the tests' purpose rather than deleting failed assertions.

The four revised third hints now give concrete already-worked examples, matching the shared
“Smaller example” hint role. Checked all stated values against existing trace facts: addition
12 + 7, increment with argument 7, subtraction 20 − 6, and the two-instruction 8/3 sequence.
They do not expose their fresh challenge case. The new intermediate 11 is a computed trace
value already present in figure tests, and must also be included in the prose-number guard.

The separately drafted narrow-screen listing direction is accurate: it says to swipe *within*
the listing between C and instructions. This preserves the existing paired rendering and page
scroll containment. Consumption in the synthesis prose/canonical record and final rendered
verification are pending when this note was written; the draft export alone is not a fix.

Follow-up source verification: the synthesis prediction now appends the navigation direction
immediately before its paired trip listing, and the Module 0 canonical record contains the same
line. The numeric guard now includes 11. Focused rerun of fundamentals, synthesis canonical prose
and plan tests: **exit 0, 3 files / 32 tests passed**. This verifies integration and canonical sync;
the final built-site checker still verifies the cue's rendered visibility and phone gesture.
