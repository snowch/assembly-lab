# Modules 5–9 readability and layout inventory

6 November 2026. Source review of all 22 published routes, using the published lesson-data export rather than the ten original source lesson records alone. Read `CLAUDE.md`, `docs/style.md`, `docs/authoring.md`, the local learning-design skill, and `docs/visual-language.md` before editing. Browser verification and independent review are recorded separately by the managing session.

The observable outcomes remain those in each published lesson's objectives: trace, construct or diagnose the current mechanism. The prerequisite sequence, examples and fresh applications remain unchanged. The layout hypothesis is that learners can find parallel input/operand facts and follow operating instructions with less rereading when those passages use semantic lists. This is a source-based design judgement, not observed beginner performance.

## Route-by-route decisions

| Published route | Decision | Passage and reason |
| --- | --- | --- |
| `counting-up` | Change | Number the `for` sequence; list incoming register roles. Keep the unsigned entry-test and backward-branch explanations as causal paragraphs. |
| `writing-an-upward-loop` | Change | Number the loop-reading procedure. Preserve the explanation of why inequality is sufficient and why the final increment cannot wrap. |
| `counting-down` | Change | List incoming registers and number the shift/subtract/branch sequence. Keep Z's cause and the zero-count entry rule beside it. |
| `testing-before-and-after` | Change | List `while` and `do` test placement in parallel. Retain zero-count behaviour, finite wraparound and the separate always-true condition explanation. |
| `stopping-when-work-ends` | No change | The page has one short introduction and a focused exercise. Its input registers already use bullets; its stopping rule and 32-shift justification remain essential prose. |
| `memory-and-addresses` | Change | List the three C pointer syntax facts and the two transfer directions. Keep little-endian reconstruction and the overlapping `w0`/`x0` effect together as explanatory paragraphs. |
| `transfer-widths` | Change | List narrow store widths, compare address/value widths in parallel bullets, and expose the three questions for reading a memory instruction. Retain the neighbour-overwrite prediction and memory validity qualification. |
| `loading-widths` | Change | Number the comparison controls' operating steps. Retain zero/sign extension, destination width and upper-half clearing explanations before their applications. Existing sensor-record and register mappings already use lists. |
| `extending-register-values` | Change | List register-only byte extensions in parallel; number the closing comparison procedure. Preserve the cast/compiler distinction and extension-before-addition explanation. |
| `array-addresses` | Change | List address/index register roles and number scaled-address calculation. Preserve pointer replacement, valid-index qualification and the unscaled-access failure. |
| `traversing-arrays` | Change | Put offset, pre-index and post-index effects in parallel bullets. Keep C pointer arithmetic, compiler register reuse and end-address reasoning as paragraphs. |
| `zero-terminated-strings` | No change | Starting bytes/capacity and exercise contracts already use lists. Remaining paragraphs explain the scan's cause, terminator exclusion, valid capacity and byte-versus-character distinction; splitting those into bullets would fragment the reasoning. |
| `products-and-widths` | Change | List the four `madd` operand roles, retaining multiply-then-add and low-32-bit semantics in prose. Initial pulse/scale facts and construction inputs already use lists. |
| `widening-products` | No change | Its three short explanation paragraphs each develop one cause: widening instruction, C conversion before multiplication, signed/unsigned interpretation. The prediction and one-goal exercise are already compact. |
| `reading-product-halves` | Change | List low/high-result instructions in parallel and number the comparison activity. Keep the explanation that the high half comes from full multiplication. |
| `division-and-remainders` | Change | List four division terms, number quotient/remainder instruction steps, and list exceptional A64 division results. Preserve the full remainder relation, signed-rounding argument and C undefined-behaviour distinction. |
| `consumption-calculation` | No change | Exercise input registers already use bullets. The remaining prose explains why widening precedes division, the zero-distance contract and why the incoming upper half must be cleared; these causal qualifications should remain continuous. |
| `dividing-by-a-constant` | Change | Number the recorded multiply/shift sequence and the closing inspection procedure. Retain the widened-product justification and compiler-choice qualification. |
| `calls-and-returns` | Change | List the two saved-register locations in the small caller's stack frame. Keep link-register overwrite, save/restore, stack growth and alignment causes together. |
| `preserving-values-across-calls` | Change | List the three saved-register locations; number the call-preparation/restoration workflow. Preserve all-64-bit preservation and the helper's permitted overwrite. |
| `recursive-calls` | Change | Separate Back/Next controls into parallel bullets. Keep per-invocation frames, saved brightness, deepest-point byte counts and frame release reasoning visible. |
| `making-recursive-progress` | Change | Number base case, smaller problem, returned answer and saved-state planning. Keep the count function's recurrence and addition after return as explanatory prose. |

No new headings were added to learner-facing content. Lists fit narrow screens without a new table; the existing figures continue to carry computed state. Essential maths and technical qualifications remain visible. C/assembly recordings, model inputs/results, prediction gates, challenge contracts, hints and teaching order were not changed.

## Source-join and canonical-record checks

Before editing, inspected every positional selection in `pacing-5-9.ts`. None of these selected source fields changed: `MEMORY.prediction`, `MEMORY.motivation`, `LOAD.generalisation`, `LOAD.questionNote`, `PRODUCT.explanation`, `CALL.explanation`, `RECURSION.explanation`, and `ARRAY.reflection`. Their paragraph/line slices therefore keep their existing boundaries. In particular, the `msub` paragraph remains on the division page and the register-extension arithmetic paragraphs remain on the extension page.

Each changed passage was replaced in its canonical module prose record at the same time as its source string. Only the `pacing-5-9.copy.ts` JSON block was changed in the shared pacing-copy record. No view, global CSS or package file was edited for this band.

## Verification

- Initial focused run: six files, 24 tests passed (Module 5, 6, 8 and 9 canonical prose; Module 5–9 pacing copy; published pacing obligations). Module 7 has no separate canonical prose test file; its canonical passages were checked through exact paired replacement and its existing lesson integration tests are included in the final focused run.
- Final focused run: `npx vitest run` over Module 5–9 lesson integrations, Module 5/6/8/9 canonical prose, Module 5–9 pacing copy and published pacing obligations passed: 11 files, 140 tests, no failures or skips. No test assertions were edited.
- Fresh export compared recursively with the starting published lesson-data export: all 22 routes retain the same object keys, array lengths and non-string values. The only changed leaf fields are 26 section-prose fields and one small-caller figure introduction. No challenge, gate, source mapping or recorded listing differs.
- Scoped Prettier checks and repository `git diff --check` passed. No browser verification or novice learning evidence is claimed here; independent/browser and full-suite results are recorded separately by the managing session.
