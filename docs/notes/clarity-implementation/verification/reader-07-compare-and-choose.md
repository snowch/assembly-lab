# Lesson 07 independent reader/checker

Reviewed the current built lesson at `http://localhost:4291/assembly-lab/#/lesson/compare-and-choose`. Read the actual lesson prose, labels, structure, hints and feedback before the accepted audit and coverage plan. Read CLAUDE.md, docs/style.md and docs/authoring.md. Relevant prerequisites checked against the front-page panel and lessons 00–06. No author justification was used. No repository files edited.

## Verdict

**Accept the lesson's reviewed corrections. No remaining accepted local defect or introduced regression found within this coverage.**

- **M4, equal-input feedback:** the failed equal-input case now says, “The returned value is wrong even though the inputs were equal. Check what each source register holds when `csel` runs. Has an earlier instruction overwritten an input?” (`compare-and-choose.prose.ts`, `lessFuelFeedback.equal`). This directs attention to actual source contents and no longer implies exchanging equal inputs repairs the result. Reproduced the feedback in the real browser with an intentionally incorrect submission in all four configurations. The grader selects it for a failed test with equal original arguments; the wording accurately asks rather than asserts whether an overwrite happened.
- **L8, qualification referent:** optional generalisation note says, “The `tst` and `ands` examples below are course-written assembly.” The preceding sentence explicitly says GCC did not use those instructions in the recorded listings. The qualification has a named referent and does not retract the compiler claim for `warning_light`. Opened and inspected the note in all four configurations.
- **N9, original/modified run:** post-prediction explanation starts the two result paragraphs with “In the changed function” and “In a separate run of GCC's original `steeper_u` with the same inputs”. Run identity precedes each result claim. Submitted and inspected this state in all four configurations.
- **Shared roles/state:** both prediction cards visibly say Prediction; locked follow-on comparisons/steppers remain gated until checking. Completed failure prediction retains the explicit visible “Registers before the run” label. The real instruction stepper retains Stepped and its updated caption distinguishes a register write from a flag value change. Stepping twice works in all configurations and paired source/instruction highlights remain visible.
- **Hints:** read both complete ladders in source; opened the first three construction hints in the browser. The Common mistake hints now describe an actual possible mistake. The third construction hint isolates the select operation; the third conditions hint gives a separate simpler equal-input comparison. No heading/content contradiction identified.

## Browser coverage and evidence

Real Chromium via Playwright, fresh browser context per configuration: 375×950 and 1280×950, each light and dark. Theme was set as a raw local-storage string and asserted against `html[data-theme]`. For each configuration: fresh page/full-page capture; initial gates; first prediction submission and unlocked comparison; failure prediction submission and explanation; two instruction steps; intentionally wrong construction submission triggering changed equal-input feedback; first three construction hints; optional generalisation note. No page errors and no document horizontal overflow observed.

Evidence: `07-evidence.json`, script `probe07.mjs`, screenshots `07-{375,1280}-{light,dark}-{initial,comparison,failure-explain,step,equal-feedback,hints,qualification}.png` in this directory. Inspected representative close-up screenshots across all four configurations, including phone light failure explanation, phone dark qualification, desktop light feedback and desktop dark stepper.

Limits: did not execute a successful construction submission, every condition preset, all five browser hint states, every possible incorrect answer, or the final answer exercise. Their prose/labels/hints were read in source. No full suite, build or independent Arm execution was run for this read-only check. This verdict concerns reviewed clarity corrections, not exhaustive functional certification.

## Assumed prior knowledge

No new unexplained prerequisite identified. The front page supplies small C functions, `int`/`unsigned`, comparisons and `if`/`else`. Lessons 00–06 supply operands, register destinations, return convention, compiler/optimisation setting, hexadecimal, signed and unsigned interpretations, flags, subtraction/borrow, masks and shifts. The lesson immediately explains its extra C conditional-expression syntax and `bool`; compare/select/condition terminology and the flag rules are introduced before the construction exercise. Optional `cmn`, `tst` and `ands` are explained locally and are not required to complete the exercises. The provenance's `-O1` and GCC refer back to Module 0's explained settings.
