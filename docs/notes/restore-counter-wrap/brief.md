# Restore the counter-wrap preparation

Copyright © 2026 Christopher Snow

## Checked state and authorised scope

The published elapsed-ticks page currently has the worked four-bit subtraction, the gated 32-bit prediction/ring and the writing exercise. It has no counter-wrap figure or Advance one tick button (verified in a real browser). Commit adccdc8 removed the earlier wrap component/model/styles/tests. The user asks to restore a simple wrap example before the subtraction-as-addition pane. Existing authorisation includes merging and verifying publication.

## Outcome and route

Explain why a counter's next reading can be zero, then use subtraction to recover elapsed ticks across that transition. Restore a separate visible pane before the current subtraction pane. Preserve the existing 32-bit prediction gate and writing challenge. Teach counter increment separately from calculating the interval.

Prerequisites: Module 1 teaches four-place binary, retained low bits and two readings; earlier Module 2 teaches addition and C/V. The new pane itself must identify a counter, define tick and wrap, and label the four-bit miniature versus the actual 32-bit program. Do not depend on later prose for these definitions.

Worked preparation: the existing fourBitAddition model produces 14 + 1 = 15 (1110 + 0001 = 1111, carry 0), then 15 + 1 = 16 (1111 + 0001 = 1 | 0000, carry 1). Its counter trail is 14 → 15 → 0. These are mathematical four-place views of machine-backed addition; they do not simulate four-bit Arm registers or set C for four bits. The permanent module1-four-bit native corpus already checks both additions. The next pane uses the same earlier reading 14 and later reading 0, calculating four-bit 0 − 14 = 2. Original independent application uses different 32-bit readings and remains gated; the written exercise checks fresh inputs.

Hypothesised misconceptions: a counter resets as an unrelated event; carry belongs in the stored counter; incrementing the counter and computing elapsed ticks are the same operation; a four-bit carry is the C value of the actual 32-bit instruction. The carry/stored split, labelled operation, explicit bridge and next-pane join must distinguish them. These are design hypotheses, not observed novice responses.

## Interface and implementation constraints

Reuse the existing arithmetic model and original figure semantics, simplifying surplus readouts and the confusing Last tick heading. A small two-click advance from 14 through 15 to 0 supports the same path as the next pane. Keep the completed carry visible; Reset changes this figure only. Preserve unrelated saved code, prediction and challenge slots. Accept legacy saved progress conservatively without overwriting it automatically. Show essential instructions in the open. Restore a discoverable section heading and keep the subtraction in its own pane; the existing real-width motivation can join its prediction without losing prose. Do not reintroduce borrow/flags detours.

Each action must say which completed addition is shown. Show a full mathematical equation and adjacent carry/stored-bit split; no ambiguous Last tick title and no duplicate result table. An initial reading has no completed addition. State how to encounter the wrap by using the actual button name.

## Verification and independent review

Draft copy in a separate agent from these facts and docs/style.md; then edit for accuracy/clarity. Obtain separate learner and technical reviews of the whole built lesson at phone/desktop and light/dark, including keyboard initial/advanced/reset/restored states, original gate and saved-work isolation. Test the genuine regression: wrap precedes subtraction, which precedes prediction/ring, and the carry remains outside the four stored bits. Verify native arithmetic. Full check/CI results must be recorded separately from focused passes and failures. No novice participant is available; reviews and functional checks do not prove learning effectiveness.
