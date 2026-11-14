<!-- Copyright © 2026 Christopher Snow -->

# Independent review: shared flags navigation

Reviewer: separate `carry_review` agent, which did not author the change. Read the actual diff and built page before the author's brief, under the repository authoring/learning-design guidance. No product edits made.

## Learner and interface pass

The flags lesson now offers the same explicit “Back to the course plan” link as its neighbour. The existing “On this page” outline remains the navigation within this lesson: eight entries, shown as a sidebar at desktop and a labelled disclosure on a phone. The course-plan link supplies navigation across modules/lessons; it does not replace that outline.

At the bottom, the recap remains intact and is followed by one shared completion control and one shared Previous/Next lesson pair. The authored duplicate next-lesson link and calculator reminder/link are gone. Both previous and next destinations still have their lesson number and title. The header Calculator remains available, including its accessible name when represented by an icon on a phone. No new navigation vocabulary or learner-facing prose is introduced.

Inspected actual top/bottom rendering in ten Chromium contexts: 320/375/834/1280px in explicit light/dark, plus 375/1280px System mode with a dark browser preference. Verified the actual theme and back-link colour. The top return link is visible below the sticky header in every context. No page overflow, clipped bottom cards or page errors occurred. Captures include phone light and desktop dark top/bottom views.

Each context verified one explicit course-plan return link, one shared lesson navigation pair, exactly one destination link to the next flags lesson, four recap items, eight outline entries in each responsive outline and one completion button. The authored end contains no links. The header calculator opens by keyboard, closes and returns focus to its trigger without changing saved lesson work.

Exercised the shared Next link to `flags-and-overflow`, checked that neighbour's course-plan return and shared navigation, then used Previous to return. A saved miniature choice survived. Keyboard Enter on the flags course-plan link returns to the plan; the actual Module 2 lesson link returns to flags with the saved choice preserved. These checks use real link destinations, not a replacement page navigation.

No new missing prerequisite, distracting teaching content or blocking interface finding identified.

## Technical pass

`App.tsx` removes only the special-case exclusion around the existing shared `.lesson-back` paragraph. It reuses `STRINGS.backToPlan`, the existing root destination and existing styles. The shared completion row, previous/next calculation and cards are unchanged. The neighbouring lesson uses the same path as before.

The authored flags end now renders only its recap. Removed string properties correspond to the removed duplicate link/reminder and have no remaining flags references. A source search finds no remaining authored `.next-link` with a cross-lesson `#/lesson/` destination in this template. Internal section links and optional prerequisite/hardware references retain their separate purposes.

Arithmetic, grading, reveal gates, storage handlers, section list and calculator code are untouched. Browser round trips support that source inspection by preserving actual saved work. This navigation-only change makes no new architecture or numerical claim.

## Findings and challenged concerns

No blocking finding; no product correction requested.

- Rejected: the recap should be removed with the duplicate links. It summarises the lesson's four rules and serves a teaching purpose; only redundant navigation was removed.
- Rejected: the old register-width lesson link must remain to make the calculator accessible. The header's named Calculator opens directly on the flags page and returns focus correctly; the shared previous card already links to register widths.
- Rejected: adding another global chapter picker is necessary for this fix. The course-plan return and existing eight-section outline cover the distinct cross-course and within-lesson routes shown in the reviewed page. This does not claim a user study of discoverability.

## Evidence, harness history and limits

Candidate asset: `index-BwPs4Wxl.js`, served at port 4194. Evidence, ten top/bottom screenshot pairs and scripts are in `/workspace/output/flags-navigation-review/`; `evidence.json` records actual themes, geometry, asset identity and page errors.

The first independent harness stopped after a successful plan return because `.plan-modules` matched five plan groups and Playwright required a unique element. This was a harness assertion failure, not a navigation failure. The original harness is retained as `review-first.cjs`. The corrected harness targets Module 2 and clicks its actual lesson link; all ten contexts passed. This record does not relabel the original command as passing.

The managing session owns focused/full-suite and publishing results. No novice or assistive-technology user test was performed. Expert inspection and keyboard/browser checks do not establish complete accessibility conformance or proven navigation discoverability.
