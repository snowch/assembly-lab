# Verification record

2 November 2026. Scope: aligned bit weights, an all-ones initial example, named unsigned/signed/comparison views, and a fresh construction exercise.

## Focused checks

- Separate drafting (Medium), implementation (High), learner review (High), and technical review (Extra High) were used. See the adjacent brief, draft and independent reviews.
- Content tests: initial six files / 59 tests passed; fresh anti-copy grader case passed in a 15-test file; final hint facts/prose rerun passed 40 tests.
- UI/model tests: initial 93 passed; restoration file six passed. Initial TypeScript check failed because the restoration test supplied unsupported Testing Library `exact` options. Removing those options preserved exact string matching; typecheck and the six tests then passed.
- Grouped-decimal parser/grader tests: 28 passed, including malformed grouping rejection and precision preservation.
- Production build and formatting passed.
- First affected browser run: 107 passed, five failed. Two failures measured viewport position after keyboard focus scrolled the page; document-relative geometry was unchanged. Three failures treated deliberately clipped weight-table children as page overflow. The corrected checks retain exact dimensions, relative position, container bounds and page-overflow assertions.
- First focused geometry correction run: desktop passed, phone failed on the old overflow helper. After the contained-scroller correction, both passed.
- Final-build affected rerun: 14 passed, two failed before exercising the page because a new 320px test used a touch helper in the mouse-only desktop context. The test now clicks the mode control in either context.
- Final 320px/grouped-answer rerun: six passed, zero failures. A separate implementation-agent 320px rerun also passed four cases. These passing reruns do not change earlier command results.

## Independent browser review

Learner review covered 375/1280px and actual light/dark themes. Technical review additionally covered 320/600px, all 32 single-bit patterns, screenshot inspection, exercise gates, scratch independence, reset and restoration. Accepted fixes: comma-grouped input is accepted; comparison labels remain whole on small screens and the table scrolls within a focusable region. See technical review for final-build verification.

The earlier hexadecimal activity keeps its original subtraction pattern. Full sums remain optional. Coordinated update restoration was tested under StrictMode in jsdom; ordinary reload and saved challenge restoration were tested in Chromium. No physical-device or assistive-technology test is claimed.

Full local/CI results, original command exits, merge and deployed-version verification are recorded in the pull request after execution. HEAD must stay fixed while version-stamp browser checks run.
