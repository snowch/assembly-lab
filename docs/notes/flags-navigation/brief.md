<!-- Copyright © 2026 Christopher Snow -->

# Consistent course navigation on the flags lesson

The user supplied screenshots showing duplicate previous/next destinations near the flags recap and the absence of the course-plan return link present on a neighbouring lesson. They also asked whether chapter navigation exists.

Checked source facts: App.tsx already computes one previous/next lesson pair from course ordering and renders it in the shared lesson ending, with the shared completion control. The section sidebar is an on-this-page outline. The course plan supplies the module/lesson list. The special flags template independently renders another next-lesson link plus a link to register-widths, which is also the shared previous lesson. Its calculator reminder predates the working tool in the shared header. App.tsx explicitly suppresses its existing course-plan return paragraph for this special lesson.

Change: remove the two authored recap links and obsolete calculator reminder/labels; retain the recap itself. Render the existing shared Back to the course plan paragraph for this lesson too, while preserving its custom position/hero. Keep shared lesson completion and previous/next cards, section anchors and header calculator. Reuse approved strings: no new teaching prose or navigation labels. No new module picker or alternative navigation system is introduced.

Inspect other custom lesson views and shared shell paths for equivalent duplicate or excluded navigation. Check focused navigation with saved answers, previous/next routes, course-plan return and the header calculator on desktop/phone in light/dark. Review the built top and bottom. Independent review remains required under CLAUDE.md; arithmetic, flags, assessment gates and platform packages are outside this correction.

## Focused verification

Typecheck and build passed. Scoped formatting, copyright and diff checks passed. Six focused browser checks (shared navigation and header calculator, desktop/phone and light/dark) passed. The initial focused command recorded four passes and two harness failures: `.plan-modules` matched five plan groups after successful return. The corrected assertion checks Module 2 and follows its actual lesson link back; the six-check rerun passed. No product change was needed for that correction.

Independent learner/interface and technical review found no blockers across ten width/theme contexts; see `review.md`. Root inspection of the built bottom capture confirms the single shared completion/navigation area. Source search found no other authored cross-lesson `.next-link` in the flags template; the shared App path is the sole special-case back-link exclusion removed. No new teaching claims were drafted, and existing approved labels are reused. Full checks and merge/deployment results are recorded in the pull request after this focused record.
