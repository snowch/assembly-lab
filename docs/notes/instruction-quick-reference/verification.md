# Verification record

Copyright © 2026 Christopher Snow

This is functional and independent review evidence. No novice learner study or screen-reader study was run; it does not establish learning effectiveness.

## Initial failures and corrections

- The first root preview command forwarded CLI arguments through the root npm wrapper incorrectly and served a missing directory (404). Restarted the course workspace preview directly.
- Initial focused browser run: the new contextual-help test used a nested `has` locator that could not match the editor. Stopped after the first timeout; existing six desktop calculator checks had passed. Corrected the locator without weakening behaviour assertions.
- First completed new-reference rerun: 2 passed, 4 failed. Two phone cases exposed focus restoration before the native modal released background inertness. The compact control check measured a 42px native select inside the 44px wrapper. Corrected dismissal order and made the select cover the full target; retained 44px assertions.
- Independent reviews found actual branch spellings such as b.eq were not searchable and the phrase “Allowed in” was ambiguous in the full browser list. Added condition aliases in search, prioritised exact mnemonics and made context neutral (“Exercise”).

## Passing checks

Catalog drafting pass: 88 focused unit checks; GNU assembler accepted all 100 examples. QEMU differential corpus: 100 calls, 914 instruction states, zero differences. Exact snippets are pinned to this corpus. This checks examples, not every possible operand combination.

Editor drafting pass: 29 focused checks across editor and instruction-help tests.

Further final-build checks and exact-head CI results are recorded below when complete.

Final focused reference rerun: 6 browser checks passed, covering desktop and phone projects and both actual themes. Includes keyboard theme choice, 320/375/834/1280 header targets, exact error deduplication, saved source, calculator/reference coordination and phone/desktop resizing.

The first full `npm run check` invocation passed formatting, copyright, platform-copy and type stages and entered unit tests. Main advanced independently with the Arm course naming change during this run; final verification will use the integrated main tree.

## Integration with current main

Main advanced to `d3b9655` (course renamed Arm Assembly Lab). Interrupted the original full check during unit execution (exit130), rebased cleanly and rebuilt. That partial run is not a full-suite pass. Measuring the longer name at 414px found a 91px header from three-line wrapping. Extended the existing logo-only phone treatment through 430px; the brand's accessible name remains the full course title. Added 414/430/768px header checks and a maximum70px header-height assertion. Rechecking integrated build before the exact-head full check.

Independent final integration check: all16 combinations of320/375/414/430/600/768/834/1280px and actual light/dark passed. Header measured62–68px; Calculator, Reference, Star and Theme remained visible and in bounds, theme target44×44, no page overflow. See technical-review.md for separate evidence.
