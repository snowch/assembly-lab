# Header calculator learner and UX review

Independent reviewer; 13 November 2026. Reviewed the built candidate served at
`http://localhost:4514/assembly-lab/` with headless Chromium through Playwright.
No product files were edited. Read `CLAUDE.md`, `docs/style.md`, the front page's
prerequisites, the first lesson, and the relevant Module 1 introduction sequence.
The review judges rendered behaviour, not the author's design explanation.

## Findings

1. **Medium: the Close button is unreadable in the rendered dark theme.** Page
   quote: **“Close”**. Its text is `rgb(229, 241, 237)` on the browser's light
   `rgb(239, 239, 239)` button background. The dark desktop screenshot shows the
   near-white text disappearing into that background. The same computed colours
   occur at 375 and 320 pixels. The button measures 56.61 × 32.39 pixels, smaller
   in height than the calculator's other controls. Direction: give the header
   dialog's close control the same theme-aware button treatment and minimum
   target height as the tool controls. This is a browser review finding, not a
   reported failure of an existing test.

2. **Medium: the globally available tool assumes number-reading concepts before
   the course introduces them.** Page quotes: **“Unsigned”**, **“Signed”**,
   **“Hexadecimal”**, and **“Widening fills the new upper bits with zeros, even
   with Signed selected.”** A learner can open this tool on the front page or
   “One addition”. The front page requires binary place values and small C
   functions; its prerequisite details explicitly say Module 1 introduces
   hexadecimal and explains positive and negative bit-pattern readings. The
   current course introduces hexadecimal in “Reading hexadecimal”, then the two
   readings in “Signed and unsigned readings”. The header tool gives entry
   ranges but does not explain these representations before offering them.
   Direction: provide brief local explanations sufficient to choose the reading
   and entry format, while preserving the requested tool-only interaction and
   the separate progressive lesson activities. Binary and decimal arithmetic
   themselves are valid prerequisites; do not report those as missing knowledge.

## Browser checks and measurements

All six combinations of 1280 × 800 desktop, 375 × 812 phone and 320 × 812 phone,
with light and dark selected, were opened and exercised. Actual rendered themes
were confirmed by `data-theme` and computed panel colours, rather than preference
alone: light is `rgb(247, 250, 248)` with text `rgb(25, 49, 48)`; dark is
`rgb(16, 27, 26)` with text `rgb(229, 241, 237)`.

| Viewport | Initial panel rectangle | Panel client/scroll width | Initial vertical content |
| --- | --- | --- | --- |
| 1280 × 800 | x 668, y 78, 600 × 710 | 598 / 598 | 1540 px content in 708 px client height |
| 375 × 812 | x 0, y 0, 375 × 812 | 375 / 375 | 1962 px content |
| 320 × 812 | x 0, y 0, 320 × 812 | 320 / 320 | 2229 px content |

Both themes have the same geometry. Document scroll widths were exactly the
viewport widths. The trigger is 121.47 × 44 pixels on desktop and 44 × 44 pixels
on phones. The tool's 64-bit state also had no horizontal overflow at all three
widths. Vertical panel scrolling is necessary and works; smaller phone width
increases the number of bit rows rather than clipping them.

For each of the six combinations:

- Initial state shows zero, 32 bits and Unsigned. Opening focuses Close.
- Invalid decimal entry `nope` produces the local message “Enter a whole decimal
  number within the range shown.” The input has `aria-invalid`,
  `aria-errormessage`, and the range/error descriptions. This is not a missing
  or remote-feedback defect.
- Applying decimal 42 produces matching decimal/hex readouts; toggling Bit 0
  changes the readout to 43 and its pressed state from false to true.
- Close and Escape both dismiss the tool and restore focus to Calculator.
  Reopening preserves the value.
- The phone dialog declares itself modal. Shift+Tab from Close stays inside the
  native dialog. Resizing phone to desktop preserves the value and, after the
  media-query event settles, removes modal mode and body scroll locking.
  Desktop to 320 pixels likewise preserves the value and enables modal mode.
- No page errors were observed during this script.

A further desktop browser pass navigated to four **existing** lesson routes:
“One addition”, “Reading hexadecimal”, “Signed and unsigned readings”, and
“Building a constant”. Each lesson's rendered h1 was checked. The trigger remained
available, 42 survived each route change, and the dialog contained zero links and
zero “Try a short task” elements. This supplies route evidence independently of
the initial script's obsolete `returning-a-constant` route.

## Assumed knowledge inventory

Binary place value, decimal whole numbers, basic arithmetic, and small C
functions are stated prerequisites. Selecting Signed versus Unsigned and reading
hexadecimal are not stated prerequisites and are finding 2. “Upper”/“lower” bits
and 32/64-bit register widths are introduced in the first lesson; before that,
they are also assumed by the front-page tool. “Shift left” has a readable
control label, but its bit movement and discarded-bit behaviour are described
only after using it; a new learner has not yet had the later shift lesson.
The local width qualifier does explain the calculator's zero-fill behaviour and
clearly distinguishes tool controls from executed instructions.

## Scope and evidence limits

Screenshots `learner-{1280,375,320}-{light,dark}-open.png` and
`learner-browser-evidence.json` retain initial-render evidence in this directory.
This was a focused independent browser review, not a full-suite result. No
existing automated-test command was run by this reviewer, so none is claimed to
have passed or failed. The obsolete route in the existing focused test is a test
coverage issue; the real-route check above passed.

No lesson challenge was solved or answer disclosed. Full arithmetic correctness,
update handoff, refresh behaviour, every course route, screen-reader speech,
physical touch hardware, mobile soft keyboards, browser engines other than
Chromium, and exhaustive keyboard cycling were not tested here. Source was read
to identify the term-introduction order and current route ids, not to infer a
browser pass.

## Candidate 2 verification

Independently revisited `http://localhost:4515/assembly-lab/` at all three widths
in both rendered themes. **Finding 1 is fixed.** Close now measures
70.61 × 44.39 pixels. Its actual colours are light text `rgb(229, 241, 237)` on
`rgb(23, 38, 35)` in dark mode, and `rgb(25, 49, 48)` on white in light mode.
The 320-pixel dark screenshot was visually inspected after this measurement.
The close label is readable and opening still focuses it.

The candidate 2 rerun also confirmed zero panel/document horizontal overflow,
42 → 43 through the bit toggle, Escape focus restoration, retention on an
existing “One addition” route (with the rendered heading checked), and no task
heading or links in the tool. The inner panel border is removed. Evidence is in
`learner-candidate2-evidence.json` and `learner-candidate2-*.png`.

Finding 2 remains a learner review concern in candidate 2. It needs the required
sceptic's decision against the global utility scope and the course's explicit
term-gate rule. There are no remaining observed interaction or layout blockers
in the states this reviewer checked. This verification is focused, not a
full-suite claim; candidate 1's broader initial/error/resize checks are recorded
separately above.

## Final candidate 3 verification

Rechecked the immutable build at `http://localhost:4516/assembly-lab/` in all six
viewport/theme combinations. **Finding 2 is resolved for the utility's stated
scope.** Before the controls, the rendered tool now defines hexadecimal's base,
allowed digits and four-bit grouping, and distinguishes unsigned positive bit
weights from the signed reading's negative highest-bit weight. These are visible
paragraphs, not gated behind optional help. A user who knows the stated binary
place-value prerequisite can now choose the format and reading without first
completing Module 1. The tool still contains no tasks or exercise checks.

Both previously accepted findings are closed in this candidate. The Close
button retains candidate 2's readable theme colours and 70.61 × 44.39 pixel
size. After scrolling to the tool's bottom, it remains at y 97 on desktop and
y 24.59 on both phone widths, wholly inside the viewport, and closes the tool.
The 320-pixel dark and 1280-pixel light scrolled screenshots were visually
inspected. The sticky heading does not cover the controls at the bottom.

Opening focuses Close; closing the scrolled panel and pressing Escape after
entry both restore focus to Calculator. Decimal 42 survives reopening and an
actual “One addition” route change, with that page's heading verified. The
brand has accessible name “Assembly Lab”; its text span is `display:none` at
320/375 pixels and visible at 1280 pixels. Panel/document widths continue to
fit exactly: desktop client/scroll width 598/598, phone 375/375 and 320/320.
Actual theme colours match the earlier measured light/dark palettes. Resizing
again preserves the tool and switches modal mode/body locking appropriately.

Evidence: `learner-candidate3-evidence.json` and
`learner-candidate3-*-scrolled.png`. No additional learner or UX blocker was
observed in these checks. The earlier scope limits still apply: this is a
focused final-browser verification, not a full-suite result or an exhaustive
accessibility audit.

## Final candidate 4 verification (current verdict)

The final build at `http://localhost:4517/assembly-lab/` supersedes candidate 3.
Its compact local definitions keep both review findings closed. Independently
checked 1280 × 800, 375 × 812 and 320 × 812 in both actual rendered themes.
The unsigned readout says “Unsigned: zero or positive.” Selecting Signed changes
that local explanation to “Signed: the highest bit has negative weight.” Both
states place their explanation above the entry field. The hexadecimal readout
has “Hex: digits 0–9 and A–F; four bits per digit.” before the entry format
control. These local explanations cover the utility interaction without adding
exercises; the range beside entry also follows the selected reading.

In every combination, selecting Signed and applying -1 produced decimal -1 and
hexadecimal `0xFFFF FFFF`. Switching to Unsigned preserved that pattern and
showed 4,294,967,295. Initial focus remained on Close. Close stayed visible after
scrolling to the bottom, remained 70.61 × 44.39 pixels, and restored focus to
Calculator when pressed. The persistence note is present at the bottom once.

The entry field now starts at y 627.13 on desktop, y 703.25 at 375 pixels, and
y 754.39 at 320 pixels; its height is 44.39 pixels. The 375-pixel phone shows the
entry and Apply in the first screen. At 320 pixels Apply wraps below the initial
screen and is reached by scrolling. This remains usable with the sticky Close
control and is not an observed blocker. Visually inspected the 375-pixel light
and 320-pixel dark initial screenshots.

Panel rectangles and actual theme colours remain as measured above. Horizontal
client/scroll widths are still 598/598 desktop, 375/375 and 320/320 phones;
document widths match their viewports. There is no observed clipping or theme
regression. Evidence is in `learner-candidate4-evidence.json` and
`learner-candidate4-*.png`. The focused candidate 4 review found no remaining
learner or UX blocker. Earlier route-persistence and resize checks remain
separately recorded; this pass rechecked the final copy/layout, both readings,
entry, initial focus and scrolled Close rather than claiming a full-suite run.
