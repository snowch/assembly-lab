# Independent learner and visual review

Reviewed the production build on 30 October 2026 at
`http://127.0.0.1:4453/assembly-lab/`. Read `AGENTS.md`, `CLAUDE.md`,
`docs/style.md` and this change's brief. The reviewer did not write the product change.
Compared the rendered completion control with option A of the supplied mockup.

**Verdict: pass for the requested change.** No blocking learner or visual finding.

## Browser evidence

Chromium checked these published lessons in both actual light and dark themes at
375, 480, 481, 600, 768 and 1280px widths:

- `one-pattern-three-readings`, published as “Reading hexadecimal”.
- `one-addition`, the first published lesson.
- `a32-division-helper`, the last published lesson.
- `stepping-native-function`, with long neighbouring navigation titles.

These 48 cases each covered unchecked, checked, reload, undo, undo followed by reload,
and keyboard focus. All completion states measured **44px high**, matching the ordinary
“Clear bits” button. State changes kept the same width: 343px at 375px viewport width,
448px at 480px, and 240px above the mobile breakpoint. The button filled the available
navigation width on phones. No tested case had normal-size horizontal page overflow or
a browser page error. Completion persisted after reload; undo also persisted after reload.

At 1280px, the button and both neighbouring cards had exactly the same vertical centre
on each two-sided lesson. In “Reading hexadecimal”, the cards measured 70.03125px high
and the button 44px, leaving 13.015625px above and below it. First/last lesson controls
also centred against their single remaining card. At 600px the existing responsive layout
wrapped Previous onto the line above completion and Next; the button centred against Next.
At 481px the items wrapped without overlap or clipping. The 375px stack remained Previous,
completion, Next. These retain the established responsive arrangement.

An additional ten cases checked `same-c-on-a32` at 375, 481, 600, 768 and 1280px in both
themes, including the long title “Breaking and restoring the Pi calculation”. Titles stayed
readable and contained. Tab/Shift+Tab reached the button with a visible 3px focus outline
and 2px offset. Space marked the lesson complete; Enter undid it. Focus stayed on the button.
The empty-circle/check icon and the checked/unchecked colour difference remained clear.
The checked action remained “Mark lesson incomplete”; the saved-in-this-browser note stayed
beside the navigation.

The rendered root theme and body background were checked, rather than relying on the
selector preference: light was `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)` after reload.
Screenshots were visually inspected for both themes at phone and desktop widths, plus
600px wrapping and first/last/long-title examples.

In “Each group of four bits becomes one digit: `0` to `9`, then `a` to `f` for ten to fifteen”,
the actual paragraph contains separate `code` elements for `0` and `9`. Both use JetBrains
Mono and the same code background as `a` and `f`. Phone and desktop screenshots in both
themes show the intended inline code styling without literal backticks. The surrounding
paragraph still reads clearly. These markup and layout changes introduce no new assumed
learner knowledge. This was a scoped review, not a fresh prerequisite audit of every lesson.

At 200% root text size on a 375px viewport, completion grew to 88px high and wrapped its
label legibly. Its own width remained 343px with no clipped text. The existing hexadecimal
figure overflowed the viewport at this enlarged size: its bit/input/control content extended
to x=425px and the document measured 432px wide. Applying the pre-change completion rules
in the browser produced the same 432px document width. Severity: low, existing and outside this change. The figure containing “The same bits in
hexadecimal” and “Clear bits” needs a separate enlarged-text wrapping review. This is not a
regression from this completion change; no product change was made during review.

## Evidence files and limits

Raw measurements and browser scripts are `/tmp/compact-reader-results.json`,
`/tmp/compact-reader-extras.json`, `/tmp/compact-reader-review.mjs`,
`/tmp/compact-reader-extras.mjs` and `/tmp/compact-reader-enlarge-baseline.mjs`.
Screenshots use `/tmp/compact-reader-*.png`, including the hexadecimal paragraph,
checked long-title controls and enlarged-text example.

The first preview command lost npm's forwarded port flags and started on the default port;
it was stopped before review. The corrected workspace command served the completed build
on 4453. One attempted screenshot read occurred before that screenshot existed; the later
completed screenshot was inspected. Neither was a product failure. The 48-case and
additional ten-case browser runs completed without failed product checks.

Only the note was written. No rebuild, product edit, test edit or commit was performed.
Full CI, technical facts validation, assistive-technology reading and other browser engines
were outside this review; the managing session records CI separately.
