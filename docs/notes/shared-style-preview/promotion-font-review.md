# Independent verification: system-font and enlarged-text layout

Accepted for this scope. The cover heading can wrap within the available width, and the prerequisite companion links have explicit touch targets. No existing test threshold is relaxed. No learner text, arithmetic or activity state changes.

This closure session independently inspected the current source/test diff, the earlier independent review's completed browser records, and representative rendered screenshots. It also ran a fresh focused browser check. It did not author or alter the product or tests.

## Candidate identity

The immutable output is `/workspace/scratch/course-style-font-candidate`. Its build ID is `4817a094eb3be589490eddbe2baa26cdfaaca3e10f656b797d99572acd774364`; `release.json` SHA-256 is `c230fc5b0224626d79eaea221f4bc472f80d6023e5c2c66dde8c4fc4ce7e6981`. Footer metadata identifies parent `36e5f801eeb0c8ef42647cefef854c8b34937c69`, because the CSS correction was not committed when this output was built. It is not yet evidence for a later committed-source full check.

The auxiliary tree's `apps/course/dist/release.json` is byte-identical to this candidate. That matters for `offline-site.ts`, which reads its production output relative to the command's working directory, independently of the preview server's outDir.

## Source and regression review

`apps/course/src/styles/app.css` adds `overflow-wrap:anywhere` only to the cover H1. It does not hide or clip overflow. The prerequisite links replace font-dependent block padding with `inline-flex`, centred alignment and a 44px minimum height. Footer companion links already have explicit minimum heights and are unchanged. This is the smallest correction to the two measured causes.

The new `shell.spec.ts` test opens the real prerequisite disclosure, chooses Arial and DejaVu Sans, checks the actual theme attribute, and exercises 100% and 150% root text sizes. The existing two projects supply desktop and phone widths. It checks page containment and both actual link rectangles rather than inspecting the implementation declarations. Existing layout, status and control assertions remain unchanged. The matrix adds 16 width/font/theme/size combinations across the two projects.

## Preserved independent browser evidence

`/tmp/font-review-focused.log` records **30 passed**, no failures or skips, using the repository's single worker and both original projects through `/tmp/font-review.config.ts`. The run covered all 20 App-status layout cases, both new font regression cases, six existing shell legibility/control audits, and both existing prerequisite-link content cases. This includes the formerly failing desktop-project 375px light/dark status states and their 150% text-size phase. The final passing summary is distinct from the earlier CI failure.

`/tmp/font-review-matrix.mjs` and its JSON output independently drove DejaVu Sans at 375/1280px, actual light/dark themes and 100/150% root text size: **8 states passed**. The script checks the full H1 text and text-range containment, visible overflow rather than clipping, link sizes, pointer and Enter activation of both actual hrefs, status-menu bounds, and Escape/focus restoration.

| Width | Text size | Page scroll width | H1 client/scroll width | Both prerequisite links |
| --- | --- | --- | --- | --- |
| 375px | 100% | 375px | 343 / 343px | 44px high |
| 375px | 150% | 375px | 327 / 327px | 44px high |
| 1280px | 100% | 1280px | 672 / 672px | 44px high |
| 1280px | 150% | 1280px | 556 / 556px | 44px high |

Both themes give these dimensions. Actual backgrounds are `rgb(247, 250, 248)` and `rgb(16, 27, 26)`. The phone status panel runs from x16 to 359 and y61 to 726; desktop bounds stay within 1280px. The independent matrix used 950px height; the existing status tests separately cover 375×812, 641×900, 800×1100, 1280×800 and 800×375.

This session visually inspected `/tmp/font-review-viewport-light-100.png`, `...light-150.png`, `...dark-150.png` and prerequisite captures at normal dark and enlarged light settings. The full heading and prose remain readable, the header remains contained, and enlarged text wraps rather than disappearing. At 150% the narrow heading may split within a word; the complete text remains visible. The prerequisite links remain identifiable, separated from surrounding lines and large enough to activate. Element screenshots can include a sticky-header capture artefact; the viewport captures establish the actual header position.

## Fresh closure run

Ran from the auxiliary tree, with the primary checkout's Playwright binary matching the test/config imports:

`/workspace/assembly-lab-mov-width/node_modules/.bin/playwright test -c /tmp/font-review.config.ts /workspace/assembly-lab-mov-width/tests/educational/shell.spec.ts --grep 'cover stays contained' --output /tmp/font-fix-closure-corrected-results`

**Exit 0: 2 passed**, desktop and phone, no skips/retries. Log: `/tmp/font-fix-closure-corrected.log`. The server used the immutable candidate above and was closed by Playwright. This confirms the exact current test source against that built output.

An earlier closure command used `npx` from the auxiliary checkout, selecting its separate Playwright package while the config/tests imported the primary package. It exited 1 during test discovery with “Playwright Test did not expect test() to be called here” / “No tests found”; no product test ran. `/tmp/font-fix-closure.log` retains that harness failure. The corrected two-pass command does not relabel it a pass.

No remaining finding in this correction's scope. This is Chromium evidence and an independent review of preserved browser artifacts, not a full-suite verdict or verification of untested browser engines. The parent must still run the final committed-source required checks and verify publication. Only this report was written by the closure reviewer.
