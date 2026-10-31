# Independent technical review

Reviewer: GPT-6.1 sol, Extra High effort, in a separate agent/session. Reviewed 31 October 2026 (UTC).

Verdict: no blocking technical finding in the appendix, revised signed-weight explanation or marker change. The four-bit representation, fixed-width negation, examples and exceptional feedback agree with the executable model and the named representation source.

## Independence and scope

I first read the actual Git changes, new lesson/component/helper files, model-backed register reader and repository guidance. I reported an initial assessment before consulting any author rationale. I did not read the managing session's draft or justification; the canonical appendix record was inspected only after the initial assessment. Guidance read: `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and `docs/visual-language.md`. I also read the required cloud-environment runtime skill and its environment status; this review needed no external service credentials.

The review covered both source and published lesson registries, Module B/15 in the plan, instruction/term gates, canonical records, model provenance, the rendered Module 1 reader and optional scratch register, both appendix figures, navigation and a previously unvisited appendix reopened offline. I changed no product, test or build file. Browser scripts, results, logs and screenshots are separate files under `/tmp`; my preview uses port 4472.

## Representation and arithmetic evidence

- C23 draft N3096, 6.2.6.2p1 gives unsigned powers of two; p2 makes the signed sign bit worth −2^(N−1), with the other value bits unchanged. Paragraph 6 names this representation two's complement. I checked the primary text in `/tmp/twos-n3096.txt`, rather than relying on the explanatory draft. The page accurately links the representation source and does not claim that C has four-bit Arm registers or that signed C overflow wraps.
- `fourBitReadings` validates exactly four binary digits. Its unsigned reading goes through `readingsOfPattern` with zero padding; its signed reading goes through the same function with copies of the top bit on the left. That reader assembles `mov`/`movk`/`ret`, runs the simulator, and reads its resulting register state. The isolated positional weights also use those simulated states. This gives `[8, 4, 2, 1]` and `[−8, 4, 2, 1]`; the contributions sum to the displayed readings for all 16 inputs.
- The focused helper tests independently compare every result with the low four bits of an assembled and executed model `neg w0, w0`. They also check the inversion `15 − x`, full sum `16 − x`, the sole discarded-bit case (`0000`), and the sole unavailable opposite signed value (`1000`). The actual rendered figures were separately driven through all 16 inputs at 375 px/light.
- The worked `1010` reads as 10 or −6. Its inverse is `0101`; the full sum and retained pattern are `0110`, read as 6. Zero produces full sum `10000`, retaining `0000`. The minimum −8 retains `1000` and displays the specific out-of-range explanation. The lower bound has no positive counterpart; its negation is not presented as successful signed arithmetic.
- The formula uses `x` explicitly as the pattern's unsigned value. Equality of the low four bits of `16 − x` and `0 − x` is a modular representation statement, not a claim equating unsigned and signed C arithmetic. The qualification “when that value fits” is stated before exploration and repeated with the formula.
- The four-bit range 0…15 and −8…7, one zero pattern, all per-position weights, and 32-bit bridge values 2147483648, 4294967295, −2147483648 and 2147483647 are covered by focused model/facts tests. The bridge correctly changes the top-bit weight while preserving the lower weights.
- Each figure is a computed view. The negation figure labels original/inverted/full/retained states and explicitly says it computes them together rather than executing Arm instructions. `timeModel: "none"`, no instruction controls, no fabricated flags and no four-bit hardware schematic agree with that scope. Reading and negation figures have independent editable state and explicit reset controls.

## Integration and canonical records

The appendix appears in `SOURCE_LESSONS` and the published `LESSONS`, maps to optional chapter B with numeric module 15, and is registered as `complement-explorer`. The source/published term gates pass. Its taught-instruction entry is empty and it supplies no instruction challenge; optional representation exploration does not widen an earlier assembler gate.

The published Module 1 explanation remains self-contained and links the live appendix. Both return/follow-up lesson IDs exist; the return link was exercised. The course plan exposes the appendix before visiting Module 1; the built no-JavaScript cover also lists Module B. Whole-course offline coverage enumerates `LESSONS`, while the release manifest includes the containing JS/CSS assets. A real download and fresh offline navigation to the never-before-visited appendix succeeded through the service worker, and its minimum-value control still computed the correct result.

Canonical parity passed for the new appendix JSON record, original Module 1 prose and the published Module 1–4 pacing copy. The main-reader caption was subsequently shortened in source/canonical prose by the managing session; its affected parity check and final built-caption check also passed, as recorded below.

## Browser and geometry review

I served the supplied production build with `npm run preview -w @al/course -- --port 4472 --strictPort`, without rebuilding. An independent Chromium script checked 320, 375, 600 and 1280 CSS-pixel viewports in both actual rendered themes. The requested preference and `html[data-theme]` agreed; computed backgrounds were `#f3f6f5` and `#101615`.

For every viewport/theme pair, I checked the Module 1 main marker initially and after toggling, the opened scratch marker before/after toggling, and both appendix markers. The marker is inside the actual top-bit button. All 48 measured states had exactly 0 px pointer-centre error; the pointer ended approximately 2.41 px above the button. Marker text remained above the controls and did not overlap another bit button. Toggle height was 44 px throughout. There was no page-level horizontal overflow.

The script exercised keyboard Space on an appendix bit, verified figure independence, reset, zero/full extra-bit display, minimum/out-of-range feedback, links and all 16 rendered patterns. It reported no page or console errors. I inspected screenshots from both themes and all four widths, including main/scratch markers and zero/minimum states. The appendix weights, signed sums and discarded bit remained readable and aligned. Screenshots and measurements are in `/tmp/twos-technical-review/`; the script is `/tmp/twos-technical-browser.mjs`, with its passing log in `/tmp/twos-technical-browser.log`.

### Non-blocking inherited observation

At 375 px, the existing scratch reader's bold `−2147483648` result can wrap its final digit; at 320 px, several long values in both existing reader tables wrap. The marker remains correctly attached. This is the existing `.al-top-table` fixed-column/`overflow-wrap: anywhere` behaviour; the change modifies marker placement/vertical space and does not change table widths or number typography. The new four-bit figures do not have this problem. A separate narrow-table improvement could keep each decimal value together. Evidence: `/tmp/twos-technical-review/375-light-scratch.png` and `/tmp/twos-technical-review/320-light-main.png`. This is not a regression introduced by the appendix/marker changes and does not block them.

## Focused verification

- `npx vitest run packages/views/src/complement.test.ts content/lessons/twos-complement.test.tsx content/lessons/twos-complement.prose.test.ts content/plan/plan.test.ts`: exit 0, 4 files / 18 tests.
- `npx vitest run content/lessons/one-pattern-three-readings.prose.test.ts content/lessons/pacing-1-4.copy.test.ts packages/views/src/module1Improve.test.tsx content/lessons/introduced.test.ts`: exit 0, 3 actual files / 60 tests. The supplied `pacing-1-4.copy.test.ts` path does not exist and was not run; the next command covers the correct file.
- `npx vitest run content/lessons/pacing-1-4.prose.test.ts`: exit 0, 1 file / 1 test.
- After the caption-only source edit, `npx vitest run content/lessons/one-pattern-three-readings.prose.test.ts`: exit 0, 1 file / 7 tests, confirming the updated Module 1 caption's canonical parity.
- Independent browser script: exit 0, eight viewport/theme combinations, exhaustive rendered four-bit inputs and a real offline reopen.
- `git diff --check`: exit 0 at the time checked.

These are focused results, not a claim to have run the full check suite or the GNU/QEMU differential suite. No new learner-facing Arm program was added, and I did not rerun native tooling, every course exercise, other browser engines, an assistive-technology session, or actual browser zoom. The extra 320 px check covers a narrow reflow case without claiming a zoom test.

### Original failed/exploratory commands

These outcomes remain separate from subsequent passing verification:

1. An exploratory `rg -n 'sw|precache|offline|manifest|assets' apps/course/vite.config.ts apps/course/src/offline*.ts apps/course/src/status*.ts apps/course/src/*manifest* 2>/dev/null` exited 2 because one optional source glob had no matching files. The later exact-path source inspection passed.
2. The first `node /tmp/twos-technical-browser.mjs` run exited 1 because its assertion read the old heading immediately after clicking the appendix link, before React rendered the target route. Its original log is `/tmp/twos-technical-browser-original-failure.log`. I changed only the temporary harness to await the target figure on each route transition. The rerun passed; the original exit status is still 1.
3. A later exploratory search included the nonexistent glob `packages/views/src/create*` and exited 2 after printing its existing-file matches. This did not run or invalidate any product verification.

## Final caption check

After the managing session rebuilt the caption-only cleanup, I reopened the production page on my separate 4472 preview at 375 px in the actual dark theme. The main reader displayed “One 32-bit pattern, read two ways. Only the top bit's weight differs.”, and the former longer caption was absent. The caption is technically correct: weight distinguishes the readings even when the top bit is clear and therefore contributes zero.

The target button centre and pointer tip both measured 46.9375 px; horizontal error remained 0 px, pointer clearance approximately 2.41 px, and page overflow 0 px. There were no page errors. I inspected `/tmp/twos-technical-review/final-caption-375-dark.png`; its measurements are in `final-caption.json` beside it. This narrow final rerun exited 0 and did not duplicate the full earlier matrix, because the final edit changed only caption text. I then stopped my own preview process with Ctrl-C (intentional process exit 130). No review server remains running on my behalf.

## Supplemental closing review: course tail and Module B mark

The managing session's first complete unit-suite run finished all 170 files with exit 1: 3098 tests passed and three failed. Two failures assumed Appendix A was the final course page; the third required every plan module to have a front-page mark. These full-suite results are separate from my focused checks and remain failed results even after correction.

I independently inspected the subsequent changes in `content/lessons/module-12.test.tsx`, `content/lessons/module-13.test.tsx` and `apps/course/src/pages/icons.tsx`. The Module 12 test still pins `a32-division-helper` as the final lesson of numeric module 14 and now pins `twos-complement`/15 as the course tail. The Module 13 test retains the exact four-page Appendix A list and the exact four-page Pi list; it adds explicit native/QEMU → Pi → A → B boundaries. Those checks preserve the original intent and strengthen the transition coverage while correcting the obsolete last-page assumption. No challenge, hardware-evidence, schema or term-gate assertion was removed.

The new `MODULE_ICONS["twos-complement"]` key exactly matches the plan's Module B ID. Its four-cell row and plus/minus marks are a decorative navigation icon, not an asserted machine state or computed teaching figure. It uses the existing 24-unit SVG wrapper, theme styling and `aria-hidden` semantics beside the visible Module B title. The icon-coverage test still compares the complete set of icon keys to the complete set of planned module IDs.

Independent command `npx vitest run content/lessons/module-12.test.tsx content/lessons/module-13.test.tsx apps/course/src/icons-marks.test.ts` passed: exit 0, 3 files / 20 tests. No product or test changes were made by this reviewer.

After the final icon build, I briefly reopened my separate 4472 preview at 375 px in the actual light theme. Module B showed its visible four-cell/plus/minus mark beside the correct title and link. The 28×28 px SVG had a nonempty path entirely within its 24-unit view box, used the theme's white stroke on the teal tile, and introduced no page overflow. I inspected `/tmp/twos-technical-review/final-module-b-mark-375-light.png`; measurements are in `final-module-b-mark.json` beside it. The title link opened the appendix, and a fresh Module 1 visit still displayed the shortened caption. This final narrow browser check exited 0 with no page errors. I stopped my preview with Ctrl-C (intentional exit 130). No review preview remains running.
