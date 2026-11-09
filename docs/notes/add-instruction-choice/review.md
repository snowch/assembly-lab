# Choosing and executing ADD review

## Draft and implementation

The approved opening from the separate GPT-6.1 Sol Medium draft is preserved verbatim. A second Medium pass supplied node labels, connector captions and an accessible equivalent. The unused extra title was omitted to avoid another heading; add in the instruction label uses code formatting. Canonical lesson prose and shared-label records are synchronised.

The optional instructionChoice field opts only the shifted-immediate ADD stage into the view. Its purpose paragraph precedes the strip, followed by the original mechanism and limits. The diagram is a static role relationship, not a computed compiler choice or extra executed instruction. Existing model, program, inputs, arithmetic, controls, prediction gate and stored state are unchanged. Default primitive activities retain their existing presentation.

Neutral styling distinguishes the strip from runtime highlights. CSS grid gives the arrows and their connected nodes a shared axis. Full arrow glyphs point right on desktop and down on phones, with relationship captions kept beside their edges. The accessible image description states both alternatives and the order of selection and execution; visual children are hidden from the accessibility tree.

## Independent final-build reviews

Separate GPT-6.1 Sol High learner/UX and Extra High technical/sceptic reviewers inspected the complete affected lesson at 375×812 and 1280×800 in actual light/dark themes. Both accepted the implementation with no in-scope correction. The learner used the learning-design skill; UX checks follow the actual repository visual language, not an unavailable UX skill.

All four contexts passed initial, Run, Start again and restored states. The diagram's markup, geometry and colours remain static. The learner's strip screenshot hashes are identical across those states. Captions are 13px; the strip is about 95px high on desktop and 186px on phones. Complete glyphs remain unclipped, and both arrows have zero measured centre difference on the path axis. No page overflow or page errors were observed; the learner also checked console errors. Keyboard Enter activates Run and Start again. The default shifted-register sibling has no strip and retains its computed behaviour. Running or restoring the ADD activity leaves its neighbour prediction gate independent; only checking that prediction opens its display.

The managing editor also inspected phone and desktop captures, plus containment at the 641px intermediate width. All arrows remain complete and connected in reading order. A browser accessibility-tree check found one complete description; this is not a screen-reader listening test.

## Sceptic decisions and baseline observations

Rejected concerns: the strip needs a full assembler/toolchain sequence (its job is selection versus execution); it simulates another instruction or a live compiler choice (it has no trace-dependent state); a compiler must choose this form for every fixed addition (can choose, the concrete example and visible restrictions qualify it); every primitive gains the strip (optional local opt-in, default sibling inspected); phone arrows lose their relationship (geometry and screenshots show aligned complete glyphs).

Separately scoped baseline: removing the activated Run control leaves activeElement at body, as in the default sibling. The next Tab correctly reaches Start again, with no trap or newly introduced focus regression. The pre-existing later recap read-ahead observation from the prior review is also unchanged. These are not claimed as fixes in this change.

Evidence: /tmp/add-choice-reader.md and /tmp/add-choice-technical.md; their independent harnesses, JSON matrices and screenshots. No novice study, physical-device test, full screen-reader/zoom/forced-colour audit or fresh earlier-lesson browser replay is claimed. Other default siblings were source-inspected; the shifted-register sibling was also driven. The new view addresses the reported orientation gap, but learning effectiveness remains unmeasured.

## Validation

The initial focused suite and final focused rerun each passed 6 files / 68 tests; these are overlapping runs, not added unique-test totals. Independent final canonical rerun: 2 files / 9 tests, also overlapping. TypeScript, production build, edited-source formatting and diff whitespace passed. Existing browser tests, extended for opt-in/default behaviour, static state, reading order, full arrows and centre alignment, passed 8 cases without skips, covering both examples at both widths/themes and restore/reset.

The full local check is running. Final full-suite results, exact tested/merged-tree equivalence, Pages deployment and live verification are recorded separately in the PR. No new model program or ISA operation requires a new native corpus entry; required real-tools CI still checks the existing corpus.
