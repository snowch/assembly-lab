# Independent technical review: C after subtraction

Copyright © 2026 Christopher Snow

Reviewed the Arm-only local diff against the brief, approved copy, `docs/machine.md`, current arithmetic helpers, storage paths and changed tests. The reviewer did not write the implementation or copy. No implementation edits or commits were made. This review reports functional and source evidence; it does not establish novice learning effectiveness or physical-hardware behaviour.

## Technical findings

No open technical finding in the reviewed change.

- `counterChange(before, -1)` computes C directly from `fourBitSubtraction(before, 1).addition.carryOut`. For this decrement-by-one operation, C is 0 at input 0 and 1 at inputs 1–15. The legacy `marker` remains the inverse borrow indicator; `wrapped` remains true only at input 0. The visible label, displayed value and accessible step status all use C consistently. The direction filter still suppresses a restored opposite-direction operation rather than relabelling it.
- This conclusion is deliberately limited to subtraction by one. It is not a claim that every generic subtraction helper's final addition carry is an Arm subtraction C value; in particular, the helper's wrapped negation of a zero subtrahend needs separate treatment. The current explorer exposes only +1 and −1 and does not introduce that case.
- The boundary feedback is now “Subtracting one from zero goes below the unsigned range. Keeping only 4 result bits gives 1111 (15 unsigned).” Ordinary decrements use a separate sentence with the computed current bits and unsigned reading. The two C-rule bullets immediately follow that sentence and correctly distinguish borrow from no borrow. No physical lender or fifth stored position is claimed.
- “C is calculated for this four-bit model. Real `subs` uses 32- or 64-bit registers; plain `sub` preserves the processor’s flags” accurately qualifies the teaching display. The underlying result helper's plain `sub` does not pretend to write processor flags. The optional introduction names `subs`, and the local rule identifies this as a four-bit model.
- Arithmetic helpers, fresh/reset zero, independent state keys, bounded histories and fixed 13→0 elapsed-time arithmetic have no implementation changes. Persisted state remains only the reading history; C is derived rather than stored. The two additional `carryOut` fields do not write source code, predictions, CPU state or exercise outcomes.
- Optional controls occur below the bits and recent readings but before feedback and the rule bullets. They render once. Required forward controls and copy are unchanged.

## Independent native and model verification

Created and assembled a fresh review-only AArch64 corpus outside the repository using GNU as/ld, then ran it with QEMU. For all 16 starting values, it records the low four result bits and `cset ..., cs` after both `subs w22, w21, #1` and `subs x22, x21, #1`. All 32 native result/C pairs match the current bundled counter model and an independent integer oracle. A further four native checks seed C to 1 or 0 before plain `sub`, at both widths; all retain the seeded value, including a zero-minus-one result.

Commands used the installed tools under `/workspace/native-tools/usr/bin/`, with `LD_LIBRARY_PATH=/workspace/native-tools/usr/lib/x86_64-linux-gnu` for GNU as/ld. The 68-byte output was compared by `/workspace/work/counter-c-review/model.mjs`, bundled from `model-entry.ts` using the repository's esbuild. The same model check verified all 16 forward result/carry cases remain correct. No native or model assertion failed.

Raw review evidence is outside Git under `/workspace/work/counter-c-review/`: `subs-c.s`, `.o`, `.elf`, `.bin`, the model entry/bundle, `browser.mjs`, `browser-results.json` and screenshots.

## Independent built-browser verification

Exercised the current built Arm lesson on owned port 4572 at 320, 375 and 1440 px, in actual light and dark themes. Actual painted ancestor backgrounds were checked numerically. All six contexts passed:

- Optional subtraction initially stayed closed; the required counter stayed at zero. Opening subtraction showed zero and a dash under “C after subs”.
- Seventeen keyboard operations covered all 16 starting inputs and a repeated zero boundary. Bits, unsigned reading and accessible C status agreed at every step. Zero−1 showed 1111, 15 unsigned, C=0; 15−1 showed 1110, 14 unsigned, C=1. The approved boundary sentence, ordinary sentence, generic bullets and architecture qualification rendered as intended.
- Focus remained on −1. Its viewport position stayed within 1 px of its baseline throughout all operations. DOM order confirmed bits/trace → controls → current feedback → C-rule block. No large empty feedback reservation is needed to keep those controls stationary.
- Optional Reset restored zero and a dash. Editing the unrelated assembly draft and selecting an uncommitted elapsed prediction before interacting preserved both; the prediction-gated ring stayed locked. Forward state remained unchanged.
- No page errors or horizontal page overflow occurred. Phone dark and desktop light captures were visually inspected in addition to the automated checks.

Two further phone restoration fixtures passed. Existing `[0,15]` optional history retained stored 15 and now correctly displayed C=0 rather than the old borrow=1. Opposite-direction `[15,0]` retained zero and displayed a dash rather than presenting its addition carry as subtraction C.

No RISC-V files or routes were reviewed for this Arm-only task. Full-suite and publication checks belong to the parent workflow. No human novice study was performed.
