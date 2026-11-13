# Memory lesson: production promotion review

Independent learner/interface review, 12 November 2026. Read `CLAUDE.md` and
`promotion-brief.md`; reviewed only `memory-and-addresses` in the real built candidate at
`http://localhost:4462/assembly-lab/#/lesson/memory-and-addresses`. No implementation,
test or lesson content was edited for this review.

## Candidate and verdict

No blocker, major or minor learner/interface finding identified. The default appearance,
header, outline, activities and saved work passed the checks below. No corrective rewrite
or implementation change is requested.

This was the uncommitted production candidate, not a build identified completely by the
footer's prior commit `26a742d`. The status panel displayed build prefix `a35d10f08ff1`.
The served entry assets were:

- `/assembly-lab/assets/index-bFhY593i.js`, SHA-256
  `abf14a3e2a7516c0b0ee29d1c3d8d859143e24b530664335dca88bd986e47cd7`.
- `/assembly-lab/assets/index-BBbSWat3.css`, SHA-256
  `72ecbcab88dd83b3ce0c531eeb73cef51bdd9ebf4e82fbde5b3ba09062b655ad`.

Those asset hashes were unchanged after the primary browser run. These findings apply to
that candidate; they do not claim verification of a later commit or public deployment.

## Fresh browser evidence

Headless Chromium/Playwright at 375, 834 and 1280 CSS pixels, viewport height 1000, light
and dark, with isolated storage and reduced motion. Service workers were blocked. The
primary six-context run and the six-context supplemental run both exited 0. All six
primary contexts had no page errors.

- The approved palette is the default even with `?style=current` and the old saved Current
  preference present. There is no comparison strip or `data-style-preview` attribute.
  Actual theme attributes and computed page colours matched explicit light/dark. In a clean
  System context, changing the emulated operating-system theme changed the page colours.
- The header starts at y=0: height 62px on phone and 68px at the wider sizes. The initial
  lesson is below it. The skip link is exposed above the header when focused; Enter focuses
  `#main`. The removed strip leaves no 60px blank band.
- All five outline entries match real section headings. Each was activated by keyboard in
  every viewport/theme. Focus moves to the requested heading, the hash remains
  `#/lesson/memory-and-addresses`, and the phone disclosure closes. Heading tops measured
  95.5–96.5px, leaving at least 27.5px below the header. Selection and settled scrolling give
  the correct current entry. At the document bottom the final entry remains current;
  selecting the first section updates it again.
- Before checking a prediction, both investigations remain gated. Selecting an option and
  navigating by outline does not open them. Separate clean contexts checked both matched
  and unmatched predictions: each gives its appropriate feedback and then opens the figure.
  Reload preserves the checked prediction. No prediction or exercise answer is reproduced here.
- Stepping the load and store highlights the related C line and executed instruction together.
  Current/next instruction text, before/after labels, register-write labels and transfer direction
  remain readable. Keyboard execution leaves focus on Next and does not scroll the page.
  Back returns to the initial state; Reset removes transfer detail and restores initial labels.
  At return, “Final values” replaces the initial label, Next is disabled and the preceding
  instruction's transfer/access markings are removed.
- The four memory bytes correspond to the four register-byte cells by value and address.
  The load leaves its memory bytes unchanged. The store marks four written bytes and preserves
  the following four. Both register-0 views show the write. The diagram states “Register bits:
  low → high, left to right”; address labels, byte boundaries, source/destination treatment and
  bit ranges retain their meaning in both themes. Visible address/range labels measured at
  least 11px without text overflowing their cells.
- The complete numbered C stays beside the instructions in all three paired listings. On
  phone the stepper viewport is 302px around a 588px internal track; at 834px it is 531px
  around that track. The two pane tops align, and horizontal scrolling stays within the listing.
  Both panes fit at 1280px. Executed C/instruction association remains visible after scrolling.
- Draft instructions and two ordered hint rungs survive outline navigation with the same lesson
  and editor DOM nodes. Failed grading, passing grading and a subsequent edit were checked.
  A pass survives navigation and reload; editing removes its completion verdict before the next
  grading. Reload restores edited work and revealed hints and regrades that saved work. The next
  hint remains the third rung. The memory steppers restart before their first instruction on
  reload, as in the existing activity; outline navigation itself preserves their stepped state.
- The App status popup stays inside every viewport and exposes Version and Offline access at
  normal reading size. Paragraph and action text measured at least 16px; buttons measured at
  least 40px high. On phone the panel scrolls to its lower content; at wider sizes the content
  fits. The panel joins the header at its lower border and remains above lesson content.
  Escape closes it and restores focus to its disclosure button.
- No page horizontal overflow in initial, committed, stepped, failed, passing, edited, reset
  or restored states, with the status popup open or closed. Captured initial, status, load and
  store screenshots at all six width/theme combinations; visually inspected selected screenshots
  covering phone/tablet/desktop and both themes.

## Learner assumptions, source checks and limits

The learner is assumed to have completed the earlier lessons: register-width views,
hexadecimal notation, parameters, return values, C/instruction pairing and ordinary activity
controls are prior knowledge. This page defines byte, address, pointer/dereference notation,
const, memory brackets, little-endian order, load/store direction and void before requiring
them. “The brackets mean access memory at that address” and the locally stated byte-order
rule support the prediction rather than leaving the mechanism implicit. I found no additional
unexplained prerequisite in the reviewed material. I did not replay the entire earlier course.

Read-only source inspection covered the lesson data, memory figure, shared register summary,
new layout/offsets and status popup styling. The working diff under `content`, `packages` and
`platform` was empty. This review checks the learner view and model-derived byte relationships;
it is not a fresh ISA, compiler or QEMU audit. No full repository suite, offline download/update
flow, screen-reader software, browser zoom or non-Chromium browser was exercised here.

Temporary scripts, screenshots and measurements are under `/tmp/promotion-memory-review/`.
Three preliminary assertion runs exited 1 for harness assumptions: expecting the popup below
the header's outer border rather than at its 1px joining border; querying a nonexistent
`data-written` marker rather than the visible write flags; and requiring popup scrolling where
the wider popup already fits its content. The corrected checks retain bounds, readability,
write-label and scroll-access assertions. A preliminary DOM-inspection command also exited 1
because `header` matched both the shell and lesson headers. Those original exits remain recorded
as failures of those commands; the final focused passes do not replace their statuses.
