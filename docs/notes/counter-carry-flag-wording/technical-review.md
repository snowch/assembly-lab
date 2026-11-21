# Independent technical review: carry flag wording

Copyright © 2026 Christopher Snow

Reviewed the current Arm-only diff, brief, wording draft, model provenance and built lesson. The reviewer did not author the changed implementation or copy and made no implementation changes or commits. This is functional/source verification, not evidence of novice learning effectiveness or physical hardware behaviour.

## Findings

No open technical finding.

Both fields render the approved labels “Carry flag C after adds” and “Carry flag C after subs”, with the instruction names formatted as code. The intros qualify the flags before use: this is a four-bit teaching counter showing how the named instruction **would** update C **at that width**. The nearby notes distinguish actual 32/64-bit instructions and plain add/sub preserving C. Normal and wrapped feedback says “updates … to 0/1”, avoiding the ambiguous shorthand “set C”. Accessible status reports the same instruction and C value as the visible field; initial status says no operation is shown yet.

The distinction matters: the model's 15+1 carries beyond four bits and displays C=1, whereas real 32- or 64-bit adds of those same numeric operands gives 16 and C=0. The new copy does not claim a real four-bit Arm instruction or actual-width flag execution in the miniature. The unchanged model computes the four-bit carry; this narrow patch changes wording and layout only. The approved zero-minus-one boundary sentence and C0/C1 bullets remain unchanged. No physical lending mechanism is introduced.

The changed-file list and diff confirm no changes to counter arithmetic, four-bit helpers, storage keys/formats or prediction gating. Existing step provenance remains direction-filtered. The optional decrement remains independent and initially closed; its controls remain below results and above its feedback and rules. The required forward route remains intact.

## Independent built-browser verification

Used an owned Vite preview at port 4592 and the current built page. Passed six contexts: 320, 375 and 1440 px, each in actual light and dark themes. Checked painted backgrounds numerically, rather than merely checking the selected preference.

For each pane in every context, seventeen keyboard operations covered all sixteen starting values and a repeated boundary. Visible flag, unsigned reading and accessible status matched the existing rules throughout. Initial and Reset values were zero/dash. Keyboard focus stayed on the operation button; its vertical position changed by exactly 0 px throughout the operations. The bounded labels stayed within 128 px, and the displayed C and stored-bit boxes had equal top coordinates at all tested widths. No page errors or horizontal page overflow occurred.

Program drafts and uncommitted elapsed predictions entered before counter use remained unchanged; the prediction-gated ring stayed locked. Independently exercised actual operations and page reload: forward wrap retained zero/C1, while optional zero-minus-one retained 15/C0. Saved-history fixtures retained both readings and the matching C values; opposite-direction histories retained their reading while suppressing the incompatible marker. Both resets remained independent.

Visually inspected phone dark, phone light and desktop light captures. Labels wrap cleanly and C stays beside the stored bits; controls and feedback remain readable. Captures, executable harnesses and result JSON are outside Git at `/workspace/work/counter-carry-flag-wording-review/` (`browser.mjs`, `reload.mjs`, `browser-results.json`, PNGs).

No new native arithmetic corpus was necessary: the arithmetic has no diff, and the independent GNU/QEMU evidence for both widths and all decrement inputs is recorded in `../counter-subtraction-c/technical-review.md`. That prior evidence is not presented as a fresh run. No RISC-V review or changes were made. Full-suite and publication checks remain the parent's responsibility; no human novice study was performed.
