# Lesson 04 independent learner/checker review

Read-only review of the final implementation candidate at `http://localhost:4291/assembly-lab/#/lesson/subtracting-and-the-tick-counter`, 2026-10-18. This reader did not author the changes. Read CLAUDE, style and authoring instructions; read the lesson prose, labels, structure and listings before the accepted audit and verification plan. Earlier prerequisite review was targeted: the front-page C/arithmetic panel, Module 0 operands and register writes, Module 1 signed/unsigned/hexadecimal readings, and the previous addition lesson's column arithmetic and flags.

## Verdict

M1/M2, N5 and the local occurrences of shared S1/S2/N4 are corrected. R04-1 was independently rechecked after correction and is closed. No outstanding finding remains in this scoped review.

## Finding R04-1 — low, CLOSED after independent final-build recheck: the moved ring introduced subtraction flags before their explanation

The unlocked ring shows **“C after subs”** and **“0 (a borrow was needed)”**. Its preceding investigation prose explains only the counter ring and enlarged strip. `subs` is first explained in `subtractionInvestigation` at `content/lessons/subtracting-and-the-tick-counter.prose.ts:31`; borrow and subtraction's C meaning arrive at line45. That whole lead now follows the ring (`subtracting-and-the-tick-counter.ts`, counter-ring then subtract-wrapped). The previous lesson explains addition flags, but neither subtraction's C rule nor the instruction `subs`.

Effect: moving the ring restored adjacency to its explanation, but one row now assumes knowledge taught afterwards. A learner can understand the elapsed-time drawing yet cannot interpret its final row from the text encountered so far.

Evidence: actual four-configuration rendered ring text in `reader04-browser.json`; screenshots `reader04-ring-375-light.png` and `reader04-ring-1280-dark.png`. The same row appears in both other configurations.

Direction: keep this ring focused on the elapsed count, or provide the minimum prerequisite before its subtraction-flag row. Preserve the restored ring/prose adjacency and the prediction gate. This does not require moving the full subtraction explanation ahead of the ring again.

## Accepted fix checks

- **M1 full sum:** the explanation explicitly adds the inverted second input to `a`, then adds1; the full sum includes `a`. The zero-subtrahend case and reflection also retain it. The four-bit worked example demonstrates the same addition. No false implication that the first input can be omitted remains.
- **M2 operand referent:** the prose uses `b` and “the input being subtracted”; captions say “second number” after listing two input numbers. This no longer conflicts with Module0's three-operand assembly numbering.
- **N5 adjacency:** counter-ring follows the ring/strip explanation immediately; the subtraction explanation is the lead of the first adder. “The two figures below” now encounters the two adders, not the ring. Subject to R04-1, the sequencing correction works.
- **S1 activity units:** prediction cards say Prediction; ring says Diagram; adders say Calculation; written/manual exercises say Exercise; the genuine instruction stepper retains Stepped. Opening Calculation explains that columns are parts of one instruction. Reset followed by Next column reveals column0, matching its status and diagram.
- **S2 writes versus changes:** the negation stepper's caption distinguishes an outlined register write from a flag's changed value. The first instruction writes the same bit pattern to its destination, which is outlined; only changed flags are outlined. The caption correctly explains this state.
- **N4 input-state labels:** prediction input registers have visible “Before the run” context, retained after checking. The time qualifier is readable at phone width.
- The two hint ladders have appropriate concept/mistake/example/partial/full progression in source. The construction starter was run and all five hint disclosures opened in each configuration; no new help/control mismatch was evident.

## Assumed untaught knowledge

The only relevant gap found is the `subs`/borrow row in R04-1. Binary arithmetic is an explicit prerequisite; signed/unsigned and hexadecimal arrive earlier; registers/operands/return appear in Module0; carry, flags, columns and overflow appear in the preceding lesson. Tick/wrap, negation and modulo are explained locally. This assessment targeted relevant prerequisites rather than exhaustively rereading every earlier interaction.

## Actual browser coverage and limits

Real Chromium at375×900 and1280×900, each light/dark, with fresh page storage. Theme used raw `assembly-lab:v1:theme` values and the script asserted actual `html[data-theme]` equals the requested theme. All four combinations completed with no page errors and no document horizontal overflow.

Each combination: fresh page and locked figures; both prediction cards selected and checked; ring unlocked; Calculation disclosure opened; wrapped adder Reset then Next column; negation stepper unlocked and advanced one instruction; construction starter Run tests; all five construction hints opened. Saved full initial-page screenshots, rendered initial text, ring/adder/negation screenshots and structured evidence. Visually inspected relevant screenshots across all four configuration combinations.

Did not solve either challenge or unlock the successful-construction adder. Did not exercise every alternate prediction answer, every adder column, persistent restored progress or every possible submission. No full suite or build was run by this reader. Source review covers the complete lesson strings, but the browser coverage is representative, not exhaustive.

Evidence: `reader04-browser.cjs`, `reader04-browser.json`, `reader04-browser.log`, and `reader04-*.png` / `reader04-initial-*.txt` in this directory. No repository files changed.

## Final-build correction recheck

Rechecked the revised production build on port4291 in fresh browser contexts at375/1280, light/dark, asserting actual `html[data-theme]`. The investigation now introduces `subs`, identifies the subtraction as `a - b`, defines when it needs a borrow, and explains C before the ring. Ring/strip guidance remains immediately before the ring. The later adder explanation explicitly connects its carry to the already-introduced no-borrow rule. The full-sum correction is retained.

The ordering probe asserts rendered positions for those definitions, ring guidance, ring caption, flag row, subtraction-as-addition lead and carry connection. All four configurations passed. The ring remained locked before prediction and unlocked after checking. The broader previous interaction script was rerun successfully against this build as well. Actual corrected-order screenshots were inspected for phone light and desktop dark; four-config DOM/order/theme assertions supplement that visual inspection.

Evidence: `reader04-order-recheck.cjs`, `reader04-order-recheck.json`, `reader04-corrected-order-*.png`; refreshed `reader04-browser.json` and earlier screenshots. R04-1 is closed; no source changes were made by this reviewer.
