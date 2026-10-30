# Independent learner review: lesson completion

Scope: the learner-controlled mark, lesson-footer navigation and course-plan return action.
Reviewed against `brief.md`, `copy.md`, `CLAUDE.md` and both closing passes in `docs/style.md`.
The reviewer did not draft the copy or implement the feature.

## Source and copy review

No copy or terminology finding. One layout finding was accepted after the browser pass below.

- “Mark lesson complete” and “Mark lesson incomplete” name a deliberate, reversible action.
  “Marked complete” and “You have marked all current lessons complete.” describe the learner’s
  choice without claiming an exercise result, qualification or account-wide progress.
- The mark control sits in the lesson navigation. Its label changes on the same button, and the
  storage note supplies its accessible description. It adds no page heading.
- Both single-lesson module links and multiple-lesson lists receive the tick and its hidden
  “Marked complete” text. Lesson links remain available when all lessons are marked.
- “Continue learning” includes the destination title in the same link. Its source selects the
  first unfinished lesson in the same module/lesson order as previous/next navigation, so later
  marks cannot hide earlier gaps. An unmarked first visit retains “Start with Module 0”.
- “Lesson marks are saved in this browser on this device.” states the local scope plainly.
  The failure note replaces this claim while a mark is unsaved, including when the learner
  undoes the only mark. Storage truthfulness still requires the separate technical and browser
  checks; reading the wording alone does not establish durable saving.

Assumed knowledge introduced by this feature: none beyond ordinary links, buttons and a browser.
The copy does not require a new assembly term or exercise convention. No challenge answers are
part of this review.

## Accepted finding, corrected

**Medium: the completion control groups with Previous rather than Next.** The approved brief
places “Mark lesson complete” beside the next-lesson link. On the first final-build candidate,
“Mark lesson incomplete” sits at x283–469 while “Next lesson / A tiny function” sits at
x995–1136 at 1280 pixels. The button is 12 pixels from Previous and 526 pixels from Next.
At 375 pixels it sits left on its own row, with Next right on the following row. This weakens
its connection to the learner’s onward action. Direction: group the mark/undo control with Next
while preserving previous/next order and keyboard focus. The managing session accepted this
finding and requested a small layout correction.

Independent replacement-build verification: at 1280 pixels the button is now x797–983 and Next
is x995–1136, a 12-pixel gap. At 375 pixels both the button and the full-width Next link begin
at x16, stacked with a 12-pixel gap. Checked both labels in both themes, plus the reading-only
lesson’s longer previous/next titles. The control keeps focus and nothing overlaps or overflows.
The finding is closed. First-candidate evidence is preserved in
`/tmp/lesson-completion-learner-initial`; replacement-build evidence is in
`/tmp/lesson-completion-learner`.

## Independent browser evidence

The reviewer drove Chromium against the production build at `http://localhost:4411/assembly-lab/`
after the managing session’s replacement final-build notice. All focused checks below were
repeated on that build, using the final `assembly-lab:v1:manual-completion:` namespace for
isolated storage fixtures. The disposable scripts and screenshots are in
`/tmp/lesson-completion-learner*`; no repository source or test implementation was changed by
this review. Actual `html[data-theme]` and computed colours confirmed each requested theme.

- Checked 375 × 812 and 1280 × 800 in light and dark, with separate browser contexts. Enter marks
  the lesson; Space undoes it; the same button keeps focus and a visible 3-pixel focus outline.
  In all four combinations the completion button is 44 pixels tall and the sampled previous/next
  links are 70 pixels tall. No overlap, clipped text or horizontal page overflow was observed.
- Checked initial “Start with Module 0”, a later mark leaving an earlier gap, and the Continue
  link’s visible title, accessible destination and first-unfinished address. The gap correctly
  returns to “One addition”.
- Checked plan ticks on a single-lesson module and a multiple-lesson module. Both lesson links
  include “Marked complete” in their accessible names; the visual tick remains distinct and
  readable. All 34 current lesson links remain present with all 34 marks.
- Checked the all-current-lessons state and its removal of Continue in all four combinations.
  Reopened the actual reading-only “Boot and test your Pi” lesson, confirmed no exercise controls
  are present, undid its mark, followed Continue back to that lesson, and marked it by keyboard
  without doing an exercise. The all-complete sentence states the learner’s choice, not an
  assessed result. No new headings are added.
- Injected a quota failure in an isolated phone context. The current-visit mark remains usable;
  the footer and cover show “Lesson marks could not be saved…” instead of the successful-saving
  claim. Reload removes the unsaved mark, matching the warning.
- Computed text contrast from the actual rendered theme tokens: footer storage note 6.07:1 light /
  7.91:1 dark; plan tick 7.47:1 / 10.08:1; cover storage note at the lighter gradient endpoint
  6.69:1 / 8.38:1; Continue text 11.37:1 / 12.24:1. The screenshots agree with the measurements.
  The reviewed browser run emitted no page errors.

## Limits and verdict

This is a focused learner review, not a full educational-suite result. Durable cross-tab,
offline, service-worker update and corruption handling belong to the technical/integration
checks and are not established by these screenshots. No physical touchscreen or assistive
technology session was run; keyboard focus and accessible names were checked in Chromium.

Status: ready. The accepted placement finding is independently verified as corrected; no open
learner-facing finding remains in this scope.
