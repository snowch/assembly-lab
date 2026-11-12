# Independent technical review: imported flags layout

Reviewer: a separate technical-review agent. Production integration reviewed under `CLAUDE.md`, not the prototype's prior approval. The independent functional browser pass is complete on build asset `index-Byumy8lp.js`. Final targeted checks also pass on `index-CMsZPj1N.js`, including explicit and automatic themes. No remaining technical or interaction blocker was found within this review's scope.

## Decision

The approved presentation is integrated with the genuine model, canonical prediction and challenge state, existing graders, shared hints and course navigation. The recorded fixes and browser evidence below support proceeding to the project's required full checks and CI. This is not evidence of novice learning effectiveness.

## Scope and source findings

Read the new `packages/views/src/flags-lesson/` model, state, controller, authored markup and React boundary; App integration; the published book/pacing path; shared runtime storage, challenge grading and prediction APIs; and the actual miniature/column/recorded-trace helpers.

Accepted findings and implementation corrections:

- **High, final-column trace:** the initial controller passed the lazy `arm` accessor to `carry` and `flags` rather than `arm()`. The managing agent corrected the source. An early built artifact (`index-AbHV5rAj.js`) independently reproduced the pre-correction error, “Cannot read properties of undefined (reading 'n')”, when revealing all columns. That run failed and is not counted as final verification.
- **Medium, malformed stored prediction:** coercing unknown `predict-readings.choice` through `String` accepted arrays and could throw for an object whose primitive-conversion properties were null. The source now accepts only a recognised string before reconstructing the committed gate.
- **Low, runtime metadata parity:** the initial per-case commit path did not set the shared `firstPassedAt` metadata. It now sets it only when the whole registered challenge grades as passed, preserving its original timestamp. This historical marker is not used to open the follow-up.
- **Integration correction from the managing pass, authored DOM stability:** the `dangerouslySetInnerHTML` prop now uses a stable `AUTHORED_HTML` object, so React updates for the hint portal or theme do not overwrite controller-owned content. Independent browser checks show hints and theme changes preserve the checked inputs, feedback and functioning submit handlers.
- **Medium, selected intent choice in dark mode:** the selected C/V label retained a pale light-theme surface beneath pale dark-theme text, measuring 1.33:1 contrast. Explicit and automatic-dark rules now use the matching themed surface and text; final contrast measurements are recorded below.

Rejected finding:

- The unsplit source lesson declares a smallest-overflow challenge. Initially suspected it became unreachable. The actual book imports published `LESSONS`, whose `pacing-1-4.ts` split assigns only `predict-flags` to this page and assigns the extension to `flags-and-overflow`. `splitLesson` derives challenge ownership from mounted figures. There is no missing registered challenge in this published page; the unsplit provenance group should remain intact.

## Source conclusions

- Numerical drawings call `fourBitFlags` for explicitly labelled miniatures and the recorded `plus` program through `traceOf` for 32-bit execution. Carry columns come from the machine's addition record. The model width is checked before interpreting a real record.
- Saved presentation state is sanitised independently of canonical answers. Per-case submissions update the registered challenge artifact. Editing a case deletes its four committed answer fields. Both case and aggregate gates run the existing grader against current canonical answers; a saved pass marker is not proof.
- Legacy canonical answers and committed range predictions migrate into the new view. The prototype's local-storage namespace is not imported.
- Authored HTML and its reviewed strings are trusted source. Learner-controlled saved choices are reduced to allowed digits/indices/readings and interpolated only through escaped or numerical paths. No iframe, eval, embedded prototype simulator or second persistence namespace is introduced.
- Main scrolling listeners and the scheduled navigation frame are removed/cancelled on teardown. Root queries and local anchor interception are scoped to the mounted lesson. The shared theme, course routes and footer remain owned by the App.
- Shared hints are rendered through the existing `HintLadder` and runtime strings context; preserving the imported panel DOM does not require a parallel hints implementation.

## Verification record

The independent script `check.mjs` passed Chromium at 375×1000 and 1280×1000 in both light and dark themes against emitted asset `index-Byumy8lp.js` (SHA-256 `39a42e3f9636860d3cbda46d7773a6db045e401d49994947bd2588d3f1fc144f`). Script, logs, JSON and screenshots are under `/workspace/scratch/flags-production-review/`.

- Four miniature comparison cases match independently specified input/result patterns, exact signed/unsigned sums and top-bit carries. N/Z tab hints and signed-positive/signed-negative examples remain consistent with their diagrams.
- Native keyboard radio selection and visible focus work. Shared hints persist in the registered challenge. Changing the course theme preserves the current checked work and functioning handlers.
- The registered `predict-readings` slot is written only on commit and removed on clear. An incorrect committed prediction opens the inspection; a fresh or forged presentation-only prediction does not. The result remains `0x80000000` while its displayed reading changes. Real carry-column inspection, including the final bit 31, restores on reload.
- Each submitted real case adds its four canonical fields and increments attempts once. All three cases produce the existing reference artifact and a first-pass timestamp. Reload regrades that work. Editing a case removes its four canonical fields and closes the follow-up while preserving the other cases. A wrong submission stays wrong on reload; clearing resets the registered challenge.
- Genuine SPA navigation away and back preserves work without duplicated submit handlers. Local section links preserve the lesson's hash route. No page error or document overflow occurred in the passing four-state run.
- Additional fresh-context checks migrate legacy valid canonical predictions/grades, reject a legacy wrong result despite `firstPassedAt`, reject a forged all-correct presentation snapshot without canonical answers, sanitize malformed presentation indices/digits and reject malformed canonical prediction arrays or primitive-conversion objects without crashing.

`check-final.log` and `results.json` record the passing run. The earlier pre-rebuild application failure remains in `check.log`. `check-final-first-attempt.log` records a later harness selector failure: it chose the hidden phone sidebar link rather than the visible link to the same section. Restricting that selector to visible anchors completed the same route check; no application edit was needed for this harness correction.

## Final targeted build verification

The last build changes were the selected-intent colour correction and preserving the course heading wrapper when filling its dynamic miniature title. The final targeted pass tested emitted asset `index-CMsZPj1N.js` (SHA-256 `4ece7affcbbc517a406aee952d32b2df3e108f6521513733acb8930e2e34355d`).

`final-targeted.mjs` passed eight Chromium contexts: 375 and 1280 px, each in explicit light, explicit dark, System with a dark preference and System with a light preference.

- Both selected program-flag choices measure **7.50:1** contrast in light and **8.38:1** in dark, including System mode.
- A forged all-correct, already-checked presentation snapshot cannot open the result explorer or follow-up, or supply a case verdict. Submitting its first case creates only that case's four canonical fields and one attempt; it does not create a first-pass timestamp or aggregate completion.
- The dynamic miniature heading retains its `.section-title` wrapper. The final-column model trace works. No page error or document overflow occurs.

Evidence: `final-targeted.log` and `final-targeted.json`. The first targeted attempt clicked “Show all columns” even though the seeded snapshot had already restored column count 32, correctly disabling that button after a real prediction was committed. The harness now resets that view before exercising Show all. The original harness timeout is retained as `final-targeted-first-attempt.log`; no application edit was needed for it.

The complete four-state functional pass and the final eight-state targeted pass are distinct; neither is represented as a full course suite.

## Limits

This review does not claim a full course suite, QEMU run, screen-reader assessment, Safari/physical-device check or novice learning study. The managing agent's required whole-suite and CI results are separate. No new instruction implementation or native recorded program was introduced.

## Additional review: offline outline assertion migration

Reviewed the test-only change in `tests/educational/offline.spec.ts` after the broader local run exposed its stale four-section expectation. **No blocker found.**

The published `adding-and-the-flags` route selects the custom renderer. Its approved semantic outline has seven sections: `read`, `resultflags`, `checkranges`, `compare`, `smallpractice`, `arm` and `realpractice`. These are the stages in `FLAGS_LESSON_SECTIONS` and in the actual rendered page reviewed above. The retained published authoring data has four coarser sections and still supplies the canonical program/challenge data; its section-array length no longer specifies this route's visible outline.

The changed assertion still requires an exact `section.lesson-section` count. It uses the declared seven-stage outline only for this route and retains `lesson.sections.length` for every other published lesson. It does not skip the route, relax the count, or derive the expected value from the DOM being tested. It will still reject an incomplete outline or an old four-section rendering of this route.

All meaningful offline coverage is preserved: every published route remains in the batches; the real HTTP connection and browser network are disabled; the HTTP cache is disabled; each lesson must arrive from the service worker with its exact heading, complete outline, readiness indicator and reachable App status; the Where next page and starter code remain checked; downloaded native/example files retain byte-count and SHA-256 verification; and page errors must remain absent. The separate offline compilation/grading/reload, cache-loss repair, unsupported-browser and keyboard/theme tests are unchanged.

The managing agent reported a focused batch-1 rerun passing on desktop and phone (2 passed). That verifies the changed offline path; it is separate from this read-only test review. The earlier full local run reached approximately test 718 and disappeared without a final exit status. It is **incomplete**, not passed, and neither the focused rerun nor this assertion correction changes that fact. The required complete CI run remains a separate result.

## Independent review: CI sidebar hit-region correction

Reviewed the single declaration added after CI on `baa253c` failed the strict 40 px hit-region assertion at `tests/educational/flags-lesson.spec.ts:384`: `.al-flags-lesson .side-link { min-height: 44px; }`. **No blocker found.** The test remains unchanged. That first CI run remains failed (1,440 browser tests passed, 21 skipped); this focused review does not revise its result or establish a complete replacement CI result.

Read the scoped rule, responsive and theme overrides, local-anchor/active-navigation controller and App route selection. The correction sets an explicit target size where font line metrics previously supplied it. No shared renderer, controller or other lesson style changed.

Independently checked the rebuilt site on port 4432, CSS asset `index-CFgtWGvE.css` (SHA-256 `cb1dde6f62c3fe7f36eca6675bc51f72825668211a5083731b9f427fec66a90a`), in 24 Chromium contexts: widths 375, 834 and 1280; explicit light, explicit dark, System/light and System/dark; actual fonts and forced Arial fallback.

- Every visible interactive target meets the retained 40 px assertion: measured minimum 44 px with actual fonts and 42 px with Arial. Every visible sidebar link is at least 44 px; the sidebar remains hidden at 375 px. An isolated in-browser removal of the new minimum reproduces Arial sidebar heights of 39 px at 1280 and 37 px at 834, while the fixed links measure 44 px.
- The comparison card remains 760 px wide at x=339 on desktop, 596 px at x=212 at 834, and 343 px at x=16 on phone. Its full rectangle is identical before and after the isolated rule change within each font/theme/width context. Light/desktop and dark/tablet screenshots were also visually inspected.
- Sidebar clicks select exactly one active location and preserve `#/lesson/adding-and-the-flags`. Navigating to the next lesson removes the custom renderer and leaves no `.side-link` targets; navigating back restores the renderer and working section navigation. No horizontal overflow or page error occurred on either route. Actual rendered colours match each requested explicit or System preference.

Evidence: `/workspace/scratch/flags-ci-hit-region-review/check.mjs`, `check-final.log`, `check-arial.log`, `results-actual.json`, `results-arial.json` and screenshots. Both final scripts exited 0. The initial harness attempt asserted renderer removal immediately after the URL changed and raced React rendering; its failure is retained in `check-first-attempt.log`. Waiting for the old renderer to detach completed the same check without an application change. This is a focused UI correction review, not a full course, QEMU, screen-reader or physical-device run.
