# Technical and accessibility review: completion styling

Independent reviewer; no component, CSS or persistence edits. Reviewed the brief, repository
guidance, `docs/style.md` and the implementation diff. Model/effort inherited from the managing
session. No open finding within the styling change.

## Source and semantics

- The native `type="button"`, approved action labels, storage-note description and toggle
  handler remain intact. `data-complete` supplies styling; persistence, grading and strings
  are unchanged. The scoped selectors do not restyle other course buttons.
- The circle/check SVG is decorative (`aria-hidden="true"`), has no accessible name and is
  outside the tab order. The accessible button names remain exactly “Mark lesson complete”
  and “Mark lesson incomplete”. The changing label communicates the action independently of
  colour and icon shape.
- The specific hover selectors take precedence over the generic button hover rule. The
  existing `:focus-visible` outline remains present in both completion states.

## Final built-site checks

Chromium used build `58255c71e62a30a21bf25412baf6ecc4d08345f808455accc670c2e4b00b0257`
at port 4411. Actual theme attributes and computed colours were checked. The matrix covered
375, 481, 600, 800 and 1280 pixels in light/dark on `one-addition`, `adding-a-constant`,
`raspberry-pi-boot` and `same-c-on-a32`: **40 footer cases and 240 measured states**.

- Initial, hover, keyboard focus, marked, marked hover and undo passed in every footer case.
  Enter marked, Space undid and the same button retained focus. Tab moved to the next link;
  the SVG added no stop. The accessible description still names the storage note.
- The final button is 343 pixels wide at 375 and 240 pixels at the other sampled widths. It
  is 48 pixels tall when stacked, and 70.03 pixels when sharing a row with navigation cards.
  The icon stays 24 × 24 pixels. Labels, icons and controls remain contained without overlap
  or horizontal page overflow. Final screenshots were inspected at phone, desktop and the
  intermediate wrapping width.
- The learner review's accepted low-severity finding was the longer undo label moving Next
  onto another row at 481 on `raspberry-pi-boot`. The final 15rem wrapper, capped at 100% and
  full-width below 30rem, closes it. Initial/marked/undo button and link document coordinates
  and sizes were compared in every case; the maximum difference was 0 pixels.

Contrast ratios use actual computed foreground/background colours, including stable hover
colours after transitions finished. The icon uses the same foreground as the text.

| Pair | Light | Dark |
| --- | ---: | ---: |
| Initial text/icon | 8.13:1 | 10.49:1 |
| Initial hover text/icon | 11.37:1 | 13.56:1 |
| Marked text/icon | 6.81:1 | 7.78:1 |
| Marked hover text/icon | 9.53:1 | 10.06:1 |
| Keyboard outline against surrounding page | 4.76:1 | 8.09:1 |
| Minimum border against surrounding page | 7.47:1 | 10.08:1 |

The keyboard outline is 3 pixels solid with a 2-pixel offset. No page errors occurred.
`npm test -- apps/course/src/lesson-completion.test.tsx` passed **1 file, 6 tests**, exit 0,
before the final width-only CSS correction. Final browser checks cover that correction.

## Separate issues and limits

At 481 on `same-c-on-a32`, the unchanged recorded limit/service-marker/average source links
are 28 pixels tall. The page-wide `designProblems` helper reports them in both themes when
run with its phone checks. This is outside the changed footer and was kept separate by the
managing session. The helper returned no other issues across the final matrix; no threshold
was changed. Revisit those source-link targets in a separate layout change.

The first preliminary probe exited 1 on those existing source-link reports. A second probe
was interrupted before its 1280 checks when the production directory was rebuilt; the theme
selector was unavailable and it exited 1. The complete final matrix exited 0 with the known
source-link reports recorded explicitly. Later passes do not alter those earlier outcomes.

Evidence is in `/tmp/completion-style-technical-final/results.json`, `summary.json` and adjacent
screenshots. Earlier partial evidence is in `/tmp/completion-style-technical/`. This review did
not run the full suite, use a physical touchscreen or conduct a screen-reader session.

Status: styling and accessibility review ready; accepted wrap finding independently verified.
