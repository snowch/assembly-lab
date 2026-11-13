# Lesson footer refinement validation

The user requested a quieter, better-aligned completion control and Previous/Next navigation. No dedicated design skill was installed in the cloud/executor/local catalogs. The project visual-language/style guidance and separate drafting, learner and technical review passes were used instead.

## Implementation

Completion and its existing browser-local saving/status note sit outside the navigation landmark, above a two-column Previous/Next grid. The same button, handler, store and persistence keys remain. Its completed label is the independently drafted “Lesson complete · Undo”. Both normal and hover backgrounds are transparent. Only trailing section/wrapper spacing is reduced; intermediate teaching sections retain their spacing.

## Preliminary checks and accepted finding

The first built revision passed all 18 existing completion browser cases, the 14 completion unit/integration tests and strict TypeScript. Those passes did not detect a visual defect: both control labels wrapped despite available row space. Independent learner and technical reviews found and measured it. The second revision removes the negative button margin/inline padding and aligns the completed label's status/action as a wrapping inline flex row, keeping the separator with Undo.

The final geometry assertion estimates rendered lines from label height divided by computed line height. Measurements were 18px / 18px for the incomplete label and 18.59375px / 18px for the completed mixed-size label. Both are one line. The independent checker ran the exact revised four geometry cases against the second revision: 4 passed, exit 0. Against the preserved first revision: 4 expected failures, exit 1, all reporting two lines. Existing meaningful height, focus, persistence, containment and coding-notation assertions are retained; no tolerance was lowered.

## Independent built checks

- Learner: six register-widths viewport/theme cases and six storage-failure cases passed. Both states, keyboard focus, restored marks and exercise work were checked.
- Technical: 36 route/width/theme cases plus storage failure passed, covering first/final lessons, long titles, flags and the post-calls note. Default/hover transparency, 44px targets, paired card geometry, same button DOM, Enter/Space, persistence and no automatic navigation were checked.
- Actual normal themes at 375/834/1280px were inspected. The final-section-to-footer boundary gap is 40px on phone and 48px at the wider sizes. Navigation cards share top, height and width.
- A separate parent-run Arial/DejaVu matrix passed 24 width/theme/control-state cases: labels remain on one line, targets stay at least 44px high, and the page stays contained. This is additional focused evidence, not an independent or full-suite verdict.

The immutable second revision reports build `5b238a85…` and parent commit `2c907d0`, because it was built before these changes were committed. These focused results are not a final committed-source full-suite verdict. The exact build identity and browser evidence are in the adjacent independent reports.

## Helper accounting

The first parent capture helper timed out on an exact `getByLabel("Theme")` query before producing screenshots. The corrected combobox-role query produced twelve width/theme/state captures. An initial preview command forwarded flags through the root npm alias incorrectly; that owned server was stopped and the workspace preview command corrected. The technical review records its separate initial Theme-query timeout. These helper failures are not product test failures and are not relabelled as passing commands.

Final committed-source full checks, CI, merge and public verification are recorded in the implementation PR. Earlier focused and negative-regression results remain separate from those final results.
