# Independent technical review

Copyright © 2026 Christopher Snow

## Scope and verdict

Reviewed independently from the actual lesson data, source diff, executable model and built
pages. The reviewer did not draft or edit product prose. The drafting agent's account was not
used as evidence for the verdict. The assigned review was GPT-6.1 Sol at Extra High effort.

All 34 lessons were inspected for exercise and prediction input contracts. The final change
affects 52 rendered prose fields across 28 lessons, including 35 challenge tasks. No unresolved
technical or rendering finding remains within this formatting scope.

Compared the loaded lesson objects before editing with the final objects. Only section prose,
challenge tasks and one figure question changed. Programs, compiler source associations,
argument widths, initial artifacts, cases, graders, reference artifacts, fields, IDs, options,
prediction gates and persistence configuration are identical. Read the changed text separately
to check meaning rather than treating unchanged data as proof of accurate wording.

## Exact coverage

Every field below was checked in source and in the final production preview at both widths and
both actual themes. A section's combined prose is counted once even when assembled from several
source strings.

| Lesson | Fields | Rendered material checked |
| --- | ---: | --- |
| `one-addition` | 1 | `trace-addition` task |
| `adding-a-constant` | 1 | `trace-constant` task |
| `tiny-function` | 1 | `trace-two-arguments` task |
| `returning-to-caller` | 1 | `trace-return-and-use` task |
| `subtraction-and-reuse` | 1 | `trace-subtraction` task |
| `instructions-in-sequence` | 1 | `trace-sequence` task |
| `meet-the-machine` | 1 | Prediction prose |
| `adding-and-the-flags` | 1 | Failure experiment prose |
| `subtracting-and-the-tick-counter` | 3 | `write-elapsed` task; prediction prose; reflection prose |
| `masks` | 2 | `write-set-gear` task; `plan-field-write` question |
| `shifts` | 2 | `compare-shifts` task; `pick-instruction` task |
| `compare-and-choose` | 3 | `write-less-fuel` task; `read-four-conditions` task; reflection prose |
| `branches` | 1 | `write-fuel-warning` task |
| `counting-up` | 2 | `write-dim-up` task; `count-dim-up-runs` task |
| `counting-down` | 2 | `write-dim-down` task; `write-dim-until-dark` task |
| `memory-and-addresses` | 3 | `write-save-distance` task; `write-copy-distance` task; failure experiment prose |
| `loading-widths` | 3 | `write-adjust-gradient` task; `write-read-sensors` task; failure experiment prose |
| `array-addresses` | 3 | `write-read-trip` task; `write-sum-trips` task; prediction prose |
| `zero-terminated-strings` | 3 | `write-label-length` task; `write-count-marker` task; prediction prose |
| `products-and-widths` | 2 | `write-scaled-total` task; prediction prose |
| `division-and-remainders` | 3 | `write-remainder` task; `write-consumption` task; prediction prose |
| `calls-and-returns` | 2 | `write-preserve-reserve` task; prediction prose |
| `from-c-to-instructions` | 2 | `write-trip-charge` task; prediction prose |
| `compile-a-loop` | 2 | `write-accumulated-charge` task; prediction prose |
| `checked-arithmetic` | 1 | `write-checked-trip` task |
| `from-function-to-executable` | 2 | `repair-native-trip` task; prediction prose |
| `debug-native-instructions` | 2 | `native-double-correction` task; prediction prose |
| `same-c-on-a32` | 1 | `read-a32-target` task |

The six unchanged lessons were read in source: `one-pattern-three-readings`,
`constants-and-widths`, `recursive-calls`, `c-and-overflow`, `raspberry-pi-5` and
`raspberry-pi-boot`. Their remaining prompts are compact, single-input, already structured, or
do not supply a comparable exercise input contract. They were not part of this review's final
browser matrix.

## Technical evidence

- Ran every challenge reference and initial artifact through the actual course grader: all 56
  references pass their 240 cases; every initial artifact fails. This was a focused model check,
  not the repository test suite.
- Checked the introductory values, operand order and stopping moments against
  `meet-the-machine.primitives.ts`, `fundamentals.ts`, `returning-to-caller.example.ts` and the
  trace used by `returning-to-caller.ts`. The subtraction still asks for the same registers
  after the same instruction. The return exercise still distinguishes the function's return
  from the caller's later addition.
- Checked the arithmetic, counter, mask, shift, comparison and loop contracts against their
  lesson cases and recorded/course-written listings. Independent operations retain their
  original inputs; the two-instruction sequence still shares state in its original order.
  Signed readings, flag timing, wrapping, zero cases and instruction-count rules remain local.
- Checked pointer widths, source/destination adjacency, byte order, load widths, signed
  extension, field offsets, output registers and unchanged-memory requirements against
  `memory.listings.ts`, `arrays.listings.ts` and their lesson cases. The sensor output list
  remains a register assignment contract rather than an instruction execution order.
- Checked `consumption` against its low-32-bit input qualification and wide-product contract.
  Splitting its inputs does not imply that the incoming upper half of `x1` is defined.
- Checked preserved registers and helper clobbers against `calls.listings.ts` and the
  `calls-and-returns.ts` cases. The helper call still requires the original reserve to survive.
- Checked both native trip contracts against `native.listings.ts`, the browser case mappings,
  `apps/course/public/native/trip_distance.s` and `boot.s`. The three distances remain in
  `w0` to `w2`, with the correction in `w3`. The debugger prediction still specifies only the
  low 32 bits of each `x` register before the named instruction. The native commands and their
  sequence are unchanged.
- Checked `checked_trip` against `checked-arithmetic.ts`: the stored operand sum is distinct
  from the returned overflow report, with adjacent-byte preservation and store-before-report
  order retained.
- Compared every nonempty line of the 52 changed rendered strings with the 15 changed canonical
  prose records after removing presentation markup: no missing line. Reviewed the actual diffs
  as well; no answer, hint or feedback was moved into an initial prompt.

## Findings and dispositions

| Finding | Severity | Disposition and independent verification |
| --- | --- | --- |
| New counter and comparison input bullets followed the existing takeaway bullets with no intervening setup paragraph. Markdown merged the two groups. | Medium | Accepted and fixed. Source now introduces the fresh inputs explicitly. In all four browser combinations, each reflection renders separate lists containing six takeaways and two inputs. |
| The A32 comparison still buried distance and trip count in the opening procedure sentence; the bounded-string prediction and compiled-loop prediction also retained paired inputs in prose. | Low | Accepted and fixed. Final lists preserve the original values, the order of opening recordings before running the average, the supplied capacity and the loop's initial total. All three final prompts passed the browser matrix. |
| After the four native input bullets, “their sum” could include the correction. | Medium | Accepted from learner review and independently checked. Final wording names the three distances; it matches the unchanged double-correction program and cases. Verified in the final rendered task. |
| After the checked-add input bullets, “their sum there” left both the operands and destination implicit. | Medium | Accepted from learner review and independently checked. Final wording names distance, adjustment and the result slot. The unchanged model cases pass; the final task renders with those referents explicit. |
| Require every two-register clause to become two bullets, including the compact shared-width contract in `wide_product`. | Low candidate | Rejected. That clause states one shared property concisely. Splitting every shared property or single-input task would extend the requested treatment without resolving a dense setup. |
| Require unordered input lists to replace the explicit “then” execution sequence in the introductory sequence and return exercises. | Low candidate | Rejected. Their ordered prose retains the checked temporal relationship; the new unordered lists describe only simultaneous starting facts. |

The added authoring paragraph accurately records these distinctions: parallel input facts,
separate result timing, ordered execution, independent calls and a paragraph separating fresh
inputs from takeaways. No new technical requirement conflicts with the existing lesson rules.

Reviewed the root's stale-test updates independently. The Module 2 prose test still checks six
takeaways, canonical equality, the ending question and the closed answer. It now counts the
takeaway paragraph separately from the new input list. Both input-register facts and the result
register remain pinned. The existing browser assertion now requires exactly two input list
items, preserves the result assertion and still rejects the solution appearing in the task.

## Final browser verification

Used the frozen production preview at `http://localhost:4399/assembly-lab/`, not a development
server. Chromium viewports were 375 × 900 and 1280 × 900, each in light and dark themes.
All 52 affected fields were checked in every combination: 208 rendered checks, no findings.

For every changed field, compared the actual rendered text, list lengths and code contents with
the final source rendered through `Prose`. Checked visible list markers, item visibility,
viewport bounds, minimum text size and inline monospace formatting. No affected list or page
overflowed sideways. The two reflection lists stayed distinct. Checked the theme attribute and
computed colours: light text/background were `rgb(16, 26, 24)` / `rgb(243, 246, 245)`; dark were
`rgb(232, 238, 237)` / `rgb(16, 22, 21)`.

Ran all 35 changed challenges through their visible controls in all four combinations: initial
artifact rejected, reference entered, passing state reached, and work discarded with the task
unchanged. This is 140 complete challenge cycles. Text fields and textareas retained associated
labels and accepted keyboard focus. The mask prediction's radio choice and commit control
remained usable; its outcome was absent initially, appeared after commitment and restored on
reload. The sequence figure still advanced through both instructions and reset to its initial
step. The subtraction, sensor-record and native double-correction challenge passes also
restored correctly after reload in each combination.

Captured 24 representative prompt screenshots. Visually inspected phone light subtraction,
gradient adjustment, native double correction and A32 comparison; phone dark return and
comparison; desktop light subtraction, gradient adjustment, native double correction and A32
comparison; and desktop dark subtraction, return and comparison. Spacing, inline code and
wrapped list items are readable. Other affected prompts were checked through the rendered DOM
and geometry checks above, rather than all being individually screenshot-read.

The temporary harness and evidence are under `/tmp/scannable-tech-browser.mjs` and
`/tmp/scannable-technical-browser/`. Two preliminary harness attempts failed: an SSR import of
React's CommonJS entry, then an overly broad selector matching both committed prediction nodes.
Corrected only the temporary harness. The complete final run exited 0 with 208 checks and no
findings; the earlier attempts are not reported as successful runs.

This reviewer did not run a build, the full test suite, GNU/QEMU or physical hardware. Native
startup and physical-board behaviour were read only where relevant to the changed wording.
Repository-wide test results belong in the integration check record, separately from these
focused model and browser checks. No product source, platform copy or unrelated Pi brief was
edited by this reviewer.
