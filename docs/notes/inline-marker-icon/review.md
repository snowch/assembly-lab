# Inline marker: independent review

Copyright © 2026 Christopher Snow

Read the written brief, two-file prose diff and existing listing marker renderer/CSS.
Reviewed the actual production build on a separate preview at port 4187, using fresh
Chromium contexts at 375 × 900 and 1280 × 900 in both light and dark themes. Confirmed
actual rendered themes and inspected screenshots of all four paragraph variants plus
the phone-dark and desktop-light existing listing markers. No app source was edited.

## Initial finding

**Medium: text presentation is not honoured by the actual browser/font combination.**
The paragraph “The marker ▶︎ shows which instruction runs next” displays a white play
triangle inside an orange square in all four contexts. The DOM does contain U+25B6 and
U+FE0E as intended, but the rendered result is a coloured emoji rather than the requested
plain matching marker. Its measured glyph box is 22 px wide at 18 px paragraph text.
The existing next-instruction marker is a plain CSS right-pointing triangle in the
app's accent colour. The orange square is a different visual object and conflicts
with the brief's explicit no-emoji requirement.

Direction: select a reliably text-only triangle codepoint without an emoji mapping, or
render the matching geometric shape, and verify the actual browser output again. Do not
assume that adding the variation selector establishes the rendered presentation.

Initial screenshots and measurements are `/tmp/inline-marker-<width>-<theme>-paragraph.png`,
`/tmp/inline-marker-<width>-<theme>-listing.png` and `/tmp/inline-marker-review.json`.
This finding comes from actual image inspection, not merely Unicode/source inference.

## Source accuracy and unaffected checks

The surrounding program-counter definition and distinction between next and executed
instructions remain unchanged. The canonical prose record matches the paragraph. The
existing next marker is produced by the next-row selector and has a separate “Runs next”
accessible label; the filled executed-row treatment remains distinct. No platform,
model, listing or CSS semantics were changed by the attempted inline insertion.

The marker remains immediately after its named word. The paragraph wraps normally,
retains its full context and uses the normal 18 px prose size and theme foreground.
No replacement-glyph box was seen, but the coloured emoji is the blocking presentation
problem. No page overflow occurred: widths remained 375/375 and 1280/1280. No page
errors were observed. No broad lesson review or full test suite was run.

## Final verification

The managing session accepted the medium finding. A separate drafting pass selected
U+25B8 (▸), a text-only small right-pointing triangle, and replaced the attempted sequence
in both the source paragraph and canonical record. No CSS, renderer or platform change
was needed.

Independently rechecked the final `index-Bp6g45DS.js` build in fresh Chromium contexts at
both widths and both themes. Visually inspected all four new paragraph screenshots,
not just the codepoints. The icon is now a plain foreground triangle, with no orange
square, emoji colouring, replacement box or baseline disruption. Its width is 9 px at
18 px prose, matching the direction/shape of the listing's existing plain triangle.
It remains immediately after “marker”, with the explanatory sentence and program-counter
definition intact.

Final actual foregrounds are rgb(16,26,24) in light and rgb(232,238,237) in dark; the glyph
inherits the paragraph's text styling. Rendered themes match each requested theme. Page
scroll/client widths remain 375/375 and 1280/1280, with no page errors. The canonical text
and source paragraph both contain U+25B8 and no variation selector.

Final screenshots and measurements are
`/tmp/inline-marker-final-<width>-<theme>-paragraph.png` and
`/tmp/inline-marker-final-review.json`. The initial four failed visual results above are
preserved separately; a successful correction does not change what the earlier build
rendered. The medium finding is resolved. No learner, visual or source-accuracy blocker
remains within this narrowly scoped correction.
