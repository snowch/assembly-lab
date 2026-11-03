# GitHub star header review

Independent Codex reviewer (session model and effort), separate from the implementation and copy drafting agents. Reviewed `CLAUDE.md`, `docs/style.md`, the shell changes and the production build at `http://localhost:4173/assembly-lab/` on `feat/github-star-link`.

## Copy approval

The separate copy agent approved “Star on GitHub”, a decorative star hidden from assistive technology, and ordinary same-tab navigation to `https://github.com/snowch/assembly-lab`. It separately confirmed compact “Star” through 640px, with “on GitHub” visually hidden and retained in the accessible name. No extra tooltip, count or state was approved. This small label has no separate draft file.

## Learner and UX pass

The link reads as a small secondary action beside the course name. The sentence and understanding passes in `docs/style.md` found no copy issue: the label names the action and destination directly. It adds no assembly knowledge prerequisite. Familiarity with GitHub's star feature is relevant only to this optional external action.

Inspected actual screenshots of the cover and “One addition” at 320, 375 and 1280px, in both rendered themes, with and without JavaScript. The no-script lesson hash displays the existing static cover. At 320px the visible Theme label is hidden, but its selector remains named “Theme” in the accessibility tree and works by keyboard. At 375px the label is visible. Course identity, star link and controls remain readable without overlap.

One low-severity layout finding was accepted and corrected: at 800px the initial full label pushed “Theme” alone onto a second row, increasing the header from 61px to 113px. Removing only the new link restored the single row. The implementation now keeps compact “Star” through 900px. Independent verification of the rebuilt site confirms a 61px single-row header at 800 and 900px, and the full label on one row at 901 and 1280px. At 641px the header still wraps, without increasing its existing height or losing controls. The 320/375px arrangement is unchanged. The finding is closed.

## Technical pass

A focused Playwright Chromium capture first checked 48 combinations. After the correction and rebuild, the final capture passed 64 combinations: 320/375/640/641/800/900/901/1280px, cover/lesson, light/dark, JavaScript enabled/disabled. Actual header colours confirmed the rendered themes. All combinations retained the exact accessible name “Star on GitHub”, no horizontal page overflow, a target at least 57.6 × 44px, and an opened status panel contained within the 900px-high viewport. No page exceptions or external requests occurred before navigation. Final screenshots at the corrected widths, breakpoint boundaries and original phone/desktop anchors were visually inspected as well as measured.

Pointer activation and Enter produced an ordinary same-tab GET document navigation to the exact repository URL, intercepted locally. Tab reaches the link in order; focus is visibly outlined. At 320px the status disclosure opens and closes with Enter, and Tab reaches the named native theme selector. Keyboard selection changes the theme and returns to System.

Measured contrast against the rendered header, light/dark respectively: default text 6.60:1/7.32:1; underlined hover 11.37:1/12.06:1; 3px focus outline 5.18:1/7.48:1. Inspected actual focus screenshots in both themes, including the static header.

Source inspection confirms one shared repository constant matching `origin`, escaped static output, shared copy and styles, decorative `aria-hidden` star, and a plain anchor in both headers. There is no count, star API action, click handler, persisted star state or simulated success state.

## Evidence and limits

Temporary screenshots and JSON measurements are in `/tmp/github-star-review/` and `/tmp/github-star-review-final/`. The first capture attempt completed the layout matrix, then stopped on a review-script assertion that expected a different CSS outline serialization. Correcting that assertion and rerunning passed all 48 cases and the keyboard/navigation checks. This was not an application failure. The final 64-case capture also repeated focus and Enter navigation in both themes, with and without JavaScript.

No application or test files were edited by this reviewer. No full suite was run here; the managing session records `npm run check` separately. Live GitHub navigation and account-level starring were not exercised. No findings remain open.

## Managing session verification

The focused static-page test passed: 1 file, 15 tests. The subsequent full `npm run check`
completed with exit status 0 on the final application changes: formatting, copyright,
platform integrity, strict TypeScript, 174 unit/integration files (3,118 tests), production
build, and 1,412 browser tests passed with 20 skips. No failures or focused reruns were
needed. A brief progress-monitor transport interruption did not interrupt the test process.
`git diff --check` also passed. GitHub CI and deployment are checked after publication.
