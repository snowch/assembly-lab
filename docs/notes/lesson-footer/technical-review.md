# Independent technical review: lesson footer

Accepted for the checked scope after the v2 label-wrapping correction. The completion control is outside the navigation landmark, Previous/Next form a stable pair, and completion remains an explicit browser-local action. No product or test file was edited by this reviewer.

## Build provenance and checks

Read `AGENTS.md`, the relevant `CLAUDE.md` review rules, the written brief, and the current product/test diff. The reviewed v2 is the immutable `/workspace/scratch/lesson-footer-v2`, served at port4482. Build ID: `5b238a85979e3fbcc7c231684642d42a229512add6acd2089b9e83caacaade6d`. Its `release.json` SHA-256 is `13c5cbde0861dd9814382fce7c18f326125cc35e097038d48054f40d4626b172`. Metadata still names parent `2c907d04b246c9258eb385413c8526ae5b1ed7cf` because the revision is uncommitted. This does not certify a later committed build.

Ran `/workspace/scratch/footer-technical-v2-check.mjs` against the real production build. Exit0: **36 route/width/theme cases passed, plus a storage-failure scenario**. The matrix covers375/834/1280px and actual light/dark themes across:

- first lesson `one-addition`;
- final lesson `floating-point-conversions`;
- the user's example `register-widths`;
- the custom flags layout `adding-and-the-flags`;
- `floating-point-rounding`, whose Next link carries the plan's longest lesson title;
- `making-recursive-progress`, the shared post-calls aside/footer boundary.

Each case checks initial and completed controls, transparent default/hover backgrounds, at-least44px hit areas, same button DOM node and retained focus after Enter, durable storage under the existing per-lesson key, restored marks after reload, Space to undo, preserved lesson URL and no page errors. The note remains the button's `aria-describedby` target and a live status. Completion is not inside `nav`. Two-link cards have equal widths/heights/top positions; first/final sole links span the row. Both body theme colours are checked directly, not inferred from the preference. No page overflows horizontally and link boxes stay within the viewport.

The separate blocked-storage scenario keeps a memory-only mark and displays the full existing saving-failure sentence beside it. Undo does not replace that warning with a false saving claim. The narrow page remains contained.

Results and measurements: `/workspace/scratch/footer-technical-v2-results.json`; run log: `/workspace/scratch/footer-technical-v2-check.log`.

## Measurements and visual inspection

For `register-widths`, both themes produce the same dimensions:

| Width | Completion hit height | Final section to footer boundary | Previous/Next dimensions | Completion text glyph bounds, either state |
| --- | --- | --- | --- | --- |
|375px|44px|40px|165.5 ×100.22px each|20px high at15px font|
|834px|44px|48px|292 ×85.83px each|20px high at15px font|
|1280px|44px|48px|374 ×85.83px each|20px high at15px font|

The normal note wraps below the control on the phone and stays alongside it on wider layouts. Its rendered width is343px,393.59px and483.33px respectively; its maximum reading measure remains bounded. Focus uses a visible solid outline. The completion-to-navigation gap is43.5px on the phone, including the note, and16px at the wider sizes.

Inspected `/workspace/scratch/footer-technical-v2-tablet.png`: the unboxed completion row reads as a quieter local action, the browser-local note is adjacent, and both navigation cards align. No large empty region separates the conclusion and controls. The visible control text now stays on one line at all three checked widths in both states. The combined text-range bounds assertion would reject the prior two-line wrap rather than merely counting span elements.

## Source and test findings

The same `LessonCompletionButton`, handler, store, keys and subscriptions remain in use; no grading or navigation is added to the handler. The completed accessible name includes both visible phrases, `Lesson complete · Undo`. The smaller underlined Undo is part of the same button, not a second nested control. The icon is decorative. Arrow glyphs in navigation are hidden from accessible names; M/L link references remain intact.

The saving and failure sentences are unchanged and still accurately scope persistence to this browser/device. Their move into the completion row is appropriate. Sibling use in `FrontPage` continues to use `completion.marked` and its original saving note; those semantics are unchanged. Search found no surviving production/test reference to the old `Mark lesson incomplete` label or removed `lesson-nav-forward` wrapper.

The original completion layout test's same-row/centred assertion became stale with the explicitly requested separation. Its replacement checks completion outside and above navigation, equal paired card geometry and transparent fill. It retains44px minimum size, comparison with the existing Clear bits control and the original hexadecimal-formatting checks; it adds the834px case. No tolerance is widened. Both offline-lifecycle edits only replace the completed accessible-name query; the surrounding cross-tab/update assertions remain unchanged.

Accepted v1 issue: completion text wrapped despite sufficient row space. The original v1 matrix had passed36 semantic/layout cases and storage failure, but its screenshot also showed `Mark lesson complete` on two lines. That finding was reported independently to the parent and is not relabelled a v1 pass for text presentation. V2 removes the negative-margin/padding sizing interaction and uses a baseline-aligned, wrapping label with a non-breaking Undo suffix. The v2 text-bound checks close both initial and completed wrapping at all checked widths/themes.

The first external helper used the wrong exact `getByLabel('Theme')` query and timed out before product assertions. Its log is retained at `/workspace/scratch/footer-technical-harness-first.log`. Correcting the helper to the actual combobox role/name produced the separate v1 and v2 runs. No product assertion or source was altered to hide that harness failure.

## Limits

This is independent Chromium evidence for the named six routes and shared states, plus source review. It is not an80-lesson learner review, a fresh full-suite result, a physical-device test or a guarantee for untested browser engines. The parent remains responsible for final committed-source checks, CI and any publication. No remaining finding in this checked scope.

## Final test-only follow-up: line-count regression

Reviewed the parent's final addition to the existing completion layout test. It measures the actual outer label's rendered height, divides by its computed line height and rounds to assert one line. This is appropriate for this label: its line-height is explicitly inherited from the button, not `normal`; v2's incomplete label is18px high at18px line-height, and the mixed-font completed baseline is18.59375px at18px line-height. Both represent one line. The old wrapped label occupies about36px and must count as two. Rounding admits the real small mixed-font baseline difference without accepting the previous extra line. No existing geometry, hit-size, formatting, transparency or design assertion is removed or relaxed.

Ran the exact final source's four geometry cases using `/workspace/scratch/footer-final-geometry.config.ts` and the primary checkout's Playwright binary:

`/workspace/assembly-lab-mov-width/node_modules/.bin/playwright test -c /workspace/scratch/footer-final-geometry.config.ts /workspace/assembly-lab-mov-width/tests/educational/lesson-completion.spec.ts --grep 'completion sits above'`

The temporary config preserves repository projects, worker count, retry count and timeouts; it selects the immutable v2 outDir and its own port4483/result directory. **Exit0:4passed**, no skips/retries,11.4s. Desktop cases cover834/1280px, phone cases375px; each theme and both control states are exercised repeatedly. Log: `/workspace/scratch/footer-final-geometry.log`. The previously recorded v2 build identity is unchanged.

Then ran the same final test source against an independently preserved immutable v1 snapshot at `/workspace/scratch/footer-technical-v1-snapshot`, verified as build `d64cd20325c1e32b240c911f89c057837e1bdc93781d14c0d1fdb5215533b57c`. Only the temporary config's outDir, port4484 and result directory differ. **Exit1:4failed**, no skips/retries. Every failure is the new line-count assertion at source line57, receiving2 instead of1. This is the expected negative baseline proving that the guard rejects the measured earlier visual fault; it is not a v2 failure. Log/traces remain under `/workspace/scratch/footer-final-geometry-baseline.log` and `/workspace/scratch/footer-final-geometry-baseline-results`.

The final test-only change is independently accepted. Product and test files remain untouched by this reviewer. This focused follow-up does not replace the parent's final committed-source full checks.
