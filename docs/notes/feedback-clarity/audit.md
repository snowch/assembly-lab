# Feedback audit coverage and dispositions

Source baseline: e838d6a3470b20310b6ee5e3d58986d53f0db0f0; implementation base is its merged source tree at 08b10e21e8238e74188c31e586c6ea75215622b5. Auditors followed the published pacing transformations, not only the older authoring groups.

## Modules 0–3 (22)

- `one-addition`
- `adding-a-constant`
- `tiny-function`
- `returning-to-caller`
- `subtraction-and-reuse`
- `instructions-in-sequence`
- `meet-the-machine`
- `one-pattern-three-readings`
- `same-bits-two-readings`
- `four-bit-arithmetic`
- `arithmetic-on-register-bits`
- `constants-and-widths`
- `building-constants`
- `register-widths`
- `adding-and-the-flags`
- `flags-and-overflow`
- `subtracting-and-the-tick-counter`
- `subtraction-flags-and-negation`
- `masks`
- `reading-and-writing-fields`
- `shifts`
- `shifts-and-signed-division`

## Modules 4–8 (23)

- `compare-and-choose`
- `conditions-and-boolean-results`
- `branches`
- `zero-and-threshold-branches`
- `register-and-bit-branches`
- `counting-up`
- `writing-an-upward-loop`
- `counting-down`
- `testing-before-and-after`
- `stopping-when-work-ends`
- `memory-and-addresses`
- `transfer-widths`
- `loading-widths`
- `extending-register-values`
- `array-addresses`
- `traversing-arrays`
- `zero-terminated-strings`
- `products-and-widths`
- `widening-products`
- `reading-product-halves`
- `division-and-remainders`
- `consumption-calculation`
- `dividing-by-a-constant`

## Modules 9–13 and A/B (30)

- `calls-and-returns`
- `preserving-values-across-calls`
- `recursive-calls`
- `making-recursive-progress`
- `from-c-to-instructions`
- `equivalent-trip-charge`
- `change-c-calculation`
- `cap-charge-in-c`
- `compile-a-loop`
- `write-assembly-loop`
- `change-loop-boundary`
- `repeated-shifts-in-c`
- `c-and-overflow`
- `checked-arithmetic`
- `checked-addition`
- `from-function-to-executable`
- `loading-and-startup`
- `runtime-startup`
- `debug-native-instructions`
- `stepping-native-function`
- `diagnosing-native-failure`
- `raspberry-pi-5`
- `raspberry-pi-boot`
- `capture-pi-boot`
- `restore-pi-boot`
- `same-c-on-a32`
- `a32-conditions`
- `a32-constants`
- `a32-division-helper`
- `twos-complement`

## Shared modes checked

`run-registers` (including memory), `run-c`, `registers-at-return`, `hex-registers-at-return`, `instruction-at-entry`, `outcomes-at-return`, `smallest-setting-flag`, `bit-readings`, `pattern-readings`, `registers-after`, `branch-outcomes`, `four-bit-subtraction`, and `recorded-tokens`. Prediction paths include trace/model/probe/run/count/loop/memory/recorded predictions and the reading sequence.

## Supported findings

Accepted: selected-constant feedback; unmeasured flag claims for invalid ranges; explicit signed-reading false positives; decimal notation inconsistency; A32 field actions and numeric spelling false negatives; branch condition/count observations; reading and generic field correction actions; write-versus-lost-input wording; stale pacing reference. Exact source locations and checked facts are in the adjacent brief and changed code/tests.

The old branch counting guidance was present and useful. It is retained; measured high/low feedback supplements it. The updated defaults do not replace more specific authored guidance.

## Rejected or deferred hypotheses

- Several graders can theoretically produce more than one failure per case, but current lessons using those modes have one field per case. Negative counts were not a current-page finding; no runtime or failure aggregation change was made.
- Mechanism teaching before a prediction is not itself answer leakage. No supported broader gate defect was identified.
- Withholding expected numeric/token answers is intentional. The changes supply observations and correction methods after submission, not answer keys.
- C23 narrowing was checked against docs/sources.md and did not survive as a finding.
- Existing constructed-bit feedback hardcodes a signed reading only where the current task is signed. No hypothetical unsigned-task rewrite was made.
- Addition carry guidance is not reused for subtraction's borrow semantics.

All audit findings and clean-page coverage are source observations. Facts/recorded listings and test assertions were inspected; those inspections are not claimed as executed tests or evidence of novice learning.
