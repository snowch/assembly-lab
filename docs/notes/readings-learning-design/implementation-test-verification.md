# Reading the bits: browser regression verification

3 November 2026. Independent regression work against the production integration. This
session wrote the three browser test files named below; it did not write the application
implementation, lesson copy or styling. These are automated browser checks, not a novice
learning study.

## Test changes

`tests/educational/bit-weights.spec.ts` now checks the required worked sequence, fresh-answer
concealment, decimal validation, explanation requirements, numeric-only feedback boundary,
incorrect and correct submissions, saved responses, task and exploration isolation,
keyboard operation, the practice attempt gate and 320-pixel layout in both actual themes.
The populated inputs and textareas also have computed foreground/background contrast
checked against 4.5:1, including alpha compositing through ancestor backgrounds.

`one-pattern-three-readings.spec.ts` retains arithmetic predictions, model traces and the
construction challenge's grading, persistence, hexadecimal input and solved-note gates.
Obsolete published-reader and `two-readings-each` assertions were replaced by the new
sequence coverage. `twos-complement.spec.ts` retains the appendix's computed examples,
keyboard controls and top-bit markers, entering it from the visible signed lesson.

## Executed runs

| Production-build check | Result |
| --- | --- |
| All three files, desktop and phone, `AL_PORT=4186 npx playwright test tests/educational/bit-weights.spec.ts tests/educational/twos-complement.spec.ts tests/educational/one-pattern-three-readings.spec.ts` | 80 cases: 77 passed, 3 failed, no skips; exit 1 |
| After the first styling correction, targeted `--grep '320px\|has the box 40 pixels\|text is legible\|and so are the figures'` on the sequence and construction files | 10 cases: 7 passed, 3 failed, no skips; exit 1 |

All sixteen new sequence cases passed in the first run. All four populated-field contrast
cases passed in the targeted rerun. The same three desktop layout assertions failed in
both runs: the two saved-response notes measured 576 pixels at a 13-pixel font, about 89
characters under the existing test's 85-character limit. Phone layout and the other
arithmetic, construction and appendix behaviour passed. The layout assertions and tolerance
were retained.

The initial `.al-reading-note` width rule lost to `figure.interactive p` in the course CSS.
The final correction uses `.al-reading-sequence p.al-reading-note`, preserving the intended
`65ch` maximum with sufficient specificity. A separate validation-copy correction required
updating one stale expected sentence to include “and complete each explanation”.

## Final rebuilt-page verification

After the managing session's full check rebuilt the production bundle, an independent
Chromium harness visited the preview at `http://localhost:4173/assembly-lab/`. It checked
both `html[data-theme]` values at 1280 and 320 pixels, initially, after valid submissions in
both tasks, and after reload restored their feedback. Both saved-response notes were
measured in all twelve configurations.

| Viewport | Each note's rendered width | Computed maximum | Font size | Estimated line measure |
| --- | --- | --- | --- | --- |
| 1280 pixels, light and dark | 390 pixels | 390 pixels | 13 pixels | 60 characters |
| 320 pixels, light and dark | 262 pixels | 390 pixels | 13 pixels | About 40 characters |

These measurements were unchanged after submission and reload. Both notes satisfied the
existing 85-character limit and stayed inside the viewport. Document scroll width equalled
viewport width in every configuration. The harness completed with exit 0 and observed no
page or console errors. Temporary harness and measurement data are under
`/workspace/scratch/readings-test-verification/`.

This final measurement verifies the CSS correction; it does not change the exit statuses
of the earlier runs. No additional full suite was started by this session. The managing
session's full `npm run check` is recorded separately. Prettier and `git diff --check`
passed for the three changed browser files. No screen-reader or non-Chromium check and no
human learner session was conducted here.

## Later cross-file regression audit

The managing session's full browser run subsequently encountered another stale expectation
in `module1-opener.spec.ts`: after opening the readings lesson, it still sought the retired
reader's closed full-sum disclosure. That readings portion now checks the required visible
unsigned and signed worked sums, the 32-bit bridge, concealed fresh transfer feedback and
a complete independent transfer submission with the numeric-only grading declaration.
All arithmetic stepping, prediction gates, hexadecimal editing and layout checks were retained.

An audit of `tests/educational` for `read-register`, `two-readings-each`,
`scratch-minus-three`, `same-bits-two-readings` and `READER_STRINGS` found no other stale
active-readings selectors. The remaining positive `#ix-read-register` lookup belongs to the
separate hexadecimal lesson; the removed reader, quiz and scratch identifiers are otherwise
used only to check their absence.

The focused command `AL_PORT=4186 npx playwright test tests/educational/module1-opener.spec.ts`
passed all 20 desktop/phone cases, with no failures or skips, in 58.9 seconds (exit 0).
It covered both themes at 360, 375 and 1280 pixels for the arithmetic/readings route, and
375 and 1280 pixels for the hexadecimal route. Its output is recorded temporarily at
`/workspace/scratch/readings-opener-tests.log`. Prettier and `git diff --check` passed for
the changed file. This focused pass does not replace or change the interrupted full run's
result; the managing session owns the full rerun.
