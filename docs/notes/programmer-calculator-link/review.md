# Programmer calculator link: review and validation

## Change and canonical copy

Replace only the register-width prediction exercise’s inline exact-arithmetic calculator with a normal new-tab link to the existing programmer calculator. Keep Working notes, its persistence and storage-failure fallback, the four-instruction listing, decimal/0x answers, grading, hints and gates unchanged. Earlier calculator integrations and the reusable calculator are retained. Current copy is in copy.md; the older register-prediction-tools record now identifies its aid layout as historical.

A separate GPT-6.1 Sol Medium drafting pass supplied the copy. Independent GPT-6.1 Sol High learner and Extra High technical/sceptic passes inspected the whole lesson and prerequisite sequence, then the built site at 375×812 and 1280×800 in actual light and dark themes. Both found no supported defects. Their full working reports are /tmp/programmer-link-learner.md and /tmp/programmer-link-technical.md in the task environment.

## Independent findings and sceptic checks

The linked page is optional and does not execute, prefill or grade the course listing. Bit/hex/decimal inspection was confirmed with unrelated values and actual clickable bits at 32 and 64 bits. Its flags and width controls are not claimed to implement Arm instructions. The canonical destination is confirmed by its repository README and actual live navigation. The external app’s future availability is outside this change.

The technical reviewer exercised 17 unstubbed keyboard popup visits plus a mouse visit, including initial, filled, failed and passed exercise states and note-storage failure. Source exercise text, answers, notes and stored state were unchanged on return; destination opener was null, referrer empty, URL had no query or fragment, and it began at zero. Normal notes persisted; failed storage retained editable unsaved notes and recovered after storage restoration. The learner independently checked keyboard order, gate independence, note persistence and Clear work retaining notes in all four viewport/theme combinations. Both reviewed earlier calculator siblings in the browser.

Rejected concerns: the external flags are not advertised as Arm flags; earlier calculators were not removed; the old copy record explicitly points to the replacement. A deterministic CI popup stub establishes the navigation/state boundary, not live external reachability. Actual unstubbed browser visits establish the latter separately.

## Managing-session validation before commit

- Focused unit/integration run: six files, 146 tests passed. An overlapping final rerun also passed 146; these are not additive.
- Strict typecheck passed after removing unsupported exact:true from a Testing Library ByRoleOptions test query. The initial command failed with that test-only type error; the corrected string-name matcher retains its exact default behaviour.
- Production build passed (22.27 seconds), with the existing chunk-size warning.
- Focused browser run: 14 passed, no skips, covering this exercise and earlier calculator siblings. Its external destination request is explicitly stubbed.
- Formatting passed after formatting the changed Playwright test. The initial formatting command failed; only test whitespace was corrected.
- Copyright and git diff whitespace checks passed.
- An additional parent browser matrix passed all four viewport/theme cells with real unstubbed keyboard popups, 32/64-bit controls and generic conversions, wrong/malformed/correct grading, notes persistence/independent clears, restored/completed states, hint/gate independence and earlier exact/whole calculator behaviour. No captured page errors or page-level overflow. Representative phone-light closed-aid and desktop-dark expanded-note screenshots were visually inspected.

Parent matrix harness initially failed because its theme-injection init script ran in an opaque popup about:blank. The harness now applies course theme storage only on the course path. Original failure is retained separately; the corrected four-cell run passed. Learner exploratory harness failures on ambiguous verdict locators, external navigation timing and disclosure timing are recorded in that reviewer’s report; corrected runs waited for the observed destination/control and passed. These are not production-suite successes or product defects.

Logs: /tmp/programmer-link-focused.log, /tmp/programmer-link-focused-final.log, /tmp/programmer-link-types.log, /tmp/programmer-link-types-rerun.log, /tmp/programmer-link-build.log, /tmp/programmer-link-format.log, /tmp/programmer-link-format-rerun.log, /tmp/programmer-link-browser.log, /tmp/programmer-link-local-initial.log and /tmp/programmer-link-local-rerun.log. Structured parent observations: /tmp/programmer-link-local.json.

## Limits and release evidence

These are Chromium emulated viewport and agent reviews, not physical-device, novice-study, screen-reader, complete accessibility or complete external arithmetic/flag audits. No machine semantics changed. Full required CI, exact tested tree, merge commit, Pages deployment and public four-cell verification will be recorded in the pull request after completion. Keep focused results distinct from full-suite outcomes, including any skips or failures.
