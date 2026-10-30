# Independent technical and accessibility review

Reviewed the production build on 30 October 2026 against `brief.md`, `AGENTS.md` and
`CLAUDE.md`. The reviewer did not implement the change or alter product code or tests.
No finding needs a further product change within this scope.

## Built-site checks

The reviewer served the completed build on a separate preview port, 4454. Its assets were
`index-Dwo0bpWB.css` and `index-Dx_5yZ5S.js`. Chromium checked 90 combinations: nine lesson
positions at 375, 480, 481, 600 and 1280 CSS pixels, each in light and dark themes. The actual
rendered backgrounds were `rgb(243, 246, 245)` and `rgb(16, 22, 21)` respectively.

The positions were the first lesson (`one-addition`), middle lesson (`traversing-arrays`),
final lesson (`a32-division-helper`), and both neighbours of the three longest current lesson
titles. Those neighbours were `capture-pi-boot`, `same-c-on-a32`,
`shifts-and-signed-division`, `conditions-and-boolean-results`,
`stepping-native-function` and `raspberry-pi-5`. Their navigation cards exercise, among
others, “Breaking and restoring the Pi calculation”, “Choosing a signed or unsigned
result” and “Finding and repairing a native error”. There were 73 lesson links in the
built course; this was a sample of nine positions, not a browser sweep of every lesson.

- Both “Mark lesson complete” and “Mark lesson incomplete” measured exactly 44px high in
  every default-size case. This matches the actual “Run the instruction”, “Run tests” and
  “Clear work” buttons checked in the first lesson. Completion stayed 343px wide at 375px,
  448px at 480px, and 240px above the stacking breakpoint. Toggling did not change its box.
- Where completion and Next shared a row, their vertical centres matched exactly. At
  1280px the button also matched Previous's vertical centre, including the final lesson
  without Next. The desktop cards measured approximately 70px high, so the button is
  visibly compact between them.
- At 480px the controls stack. At 481px the flex rows can wrap onto separate lines; at
  600px a long Previous card can sit above the completion/Next row. These retain the
  existing responsive rules. The latter row still centres the button beside Next. No
  navigation label was clipped and no checked page scrolled horizontally.
- In every combination, Enter marked the lesson, focus stayed on the button, reload
  restored the mark, touch at 375–600px or Space at 1280px undid it, and another reload
  retained the undone state. The check path appeared only in the marked state; the
  circle remained in both. No page errors were recorded.
- At 375/1280 in both themes, Tab moved from Previous to completion and then to Next.
  Keyboard focus retained the visible 3px orange outline with a 2px offset. The button
  retained its descriptive saved-status text. Settled normal-state text contrast was
  8.13:1 unchecked and 6.81:1 checked in light, 10.49:1 unchecked and 7.78:1 checked in dark.
- Enlarging the root text size to 200% at 375/1280 in both themes increased the button
  minimum and actual height to 88px. The phone labels wrapped to two lines (72px tall)
  inside the button. A separate text-only emulation doubled the label from 15px to 30px
  while leaving the 44px minimum unchanged: both states grew to 74px in both viewports
  and themes. Their 72px labels remained contained, demonstrating content-driven growth
  rather than a fixed height. Neither check introduced button or page overflow.

Screenshots of the first, middle and final navigation states, all three intermediate
widths, enlarged text and the hexadecimal paragraph were inspected. Browser measurements
are in `/tmp/compact-completion-technical-results.json`,
`/tmp/compact-completion-technical-extras.json` and
`/tmp/compact-completion-technical-hex-results.json`; screenshots use the
`/tmp/compact-completion-technical-` prefix. These are local review artifacts.

## Prose and source checks

At 375/1280 in both actual themes, the paragraph beginning “Thirty-two ones and zeros are
hard to read” rendered `0` and `9` as separate `code` elements, followed by the existing
`a` and `f` code elements. The new digits use JetBrains Mono and the same inset background
as the other symbols. Screenshots show the intended styling and normal paragraph wrapping.

Both `content/lessons/one-pattern-three-readings.prose.ts` and the canonical
`docs/notes/module-1/prose.md` differ from HEAD solely by adding the two pairs of backticks.
Removing backticks from before and after yields identical content. No wording,
mathematical claim or prerequisite changes. The existing hexadecimal facts test already
checks the mapping for the endpoint digits and letters.

Source inspection found one shared navigation implementation in `App.tsx`, used by the
lesson routes, with `LessonCompletionButton.tsx` supplying the control. The scoped CSS
change affects that shared use; it does not alter the generic button rules. The generic
`.button` supplies `min-height: 2.75rem`; neither the generic rule nor this completion rule
fixes the height. The completion text, state colours, icon, width, narrow-screen rules,
event handler, saved-status association and storage code remain unchanged.

The existing completion tests were read, including keyboard focus, exercise preservation,
cross-tab storage, final-lesson reopening, invalid records and storage failures. The added
built-site regression compares completion with the actual “Clear bits” button and checks
centres beside Next in both themes. It also asserts rendered digit code nodes. This would
catch the former custom minimum/stretch behaviour, and the existing behavioural assertions
remain intact.

## Findings and limits

No accepted or rejected finding requires follow-up from this review. Retain the small CSS
and markup changes as implemented.

The browser scripts completed without assertion failures on their first run; there was no
failed browser run to replace with a focused pass. This review did not run the unit suite,
Playwright suite or full CI check; the managing session records those results separately.
Cross-tab and exercise-preservation coverage above was read in test source, not rerun here.
Touch was emulated in Chromium. Physical devices, other browser engines and screen-reader
output were not tested. Root-size and label-size overrides emulate enlarged text rather
than a particular browser's zoom or operating-system preference. The review checks this
control and the requested notation edit, not the whole lessons' technical accuracy.
