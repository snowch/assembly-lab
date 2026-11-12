# Independent review of the compiler-note keyboard test correction

Accepted. This corrects a stale browser expectation without changing the product or weakening note keyboard coverage.

The requested port 4462 was no longer serving. The reviewer served the same immutable v4 candidate from `/workspace/scratch/course-style-production-v4` read-only on port 4463 and measured the real `tiny-function` note after keyboard Enter opened it:

| Width | Command clientWidth | Command scrollWidth | Keyboard path from first summary |
| --- | --- | --- | --- |
| 375px | 281px | 613px | Tab → command `pre`; Tab → second summary |
| 1280px | 636px | 636px | Tab → second summary |

The command has `overflow-x:auto` and no explicit tabindex. Chromium adds its native keyboard stop when it actually scrolls. The old unconditional expectation therefore fails on desktop when the approved reading-column font and available width let the command fit. The phone still exercises the scrolling branch.

Read the exact correction in this detached worktree. It measures `scrollWidth > clientWidth`, sends the first Tab unconditionally, requires the command to receive focus and sends a second Tab only for actual overflow, then always requires the second summary to be focused. All existing Enter/Space, open/closed state, note-content and no-page-overflow assertions remain. The conditional does not skip checking the next focus destination or manufacture focus.

Ran the exact corrected test from this worktree with `AL_PORT=4464 npx playwright test tests/educational/meet-the-machine.spec.ts --grep 'opens a note from the keyboard' --output /tmp/promotion-keyboard-focused-results`. Exit 0: **2 passed**, desktop 1280px and phone 375px, no skips/retries. The independent server used a copied production `dist` from stable `adfdc4b95589ffcc226c1ea863e3146b8a8237a4`; its build ID was `3aa04a99c039388c8d4f087197f79598a4e377278c2204b2ab2eafbda70b0538`, with `release.json` SHA-256 `ec1043e01f246051fd8cbcf9e23cfc9ebf6a65920731287f025f8cd21bda4a89`. The product source is unchanged from the reviewed promotion.

Only this report was authored by the reviewer in the detached worktree. Main-worktree source/tests and its ongoing full check were untouched. Its original stale-expectation failure remains a failed original result; this passing focused correction does not reclassify it or replace the required corrected full check.

Final-test follow-up: the parent then added `await document.fonts.ready` before measuring overflow. This is appropriate: it ensures the native Tab-stop decision and measured width use the loaded font. Reviewed that exact final diff and reran the same focused command with output `/tmp/promotion-keyboard-focused-fonts-results`. Exit 0: **2 passed** again, desktop and phone, no skips/retries. This is separate evidence after the added wait; the earlier two-pass run is not substituted for it. The accepted verdict applies to this final test version.
