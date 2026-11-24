<!-- Copyright © 2026 Christopher Snow -->

# Carry boundary comparison brief

The user accepted a compact new pane between the existing four-bit worked example and the real 32-bit pane. Show one below, equal and above case together, with b fixed at 8 and a taking 7, 8 and 9. The objective is to locate the exact carry boundary and explain that a equal to b already needs no unsigned borrow, even though the retained result is zero. Do not add controls, a quiz, new prerequisites or a new storage identity.

Prior preparation is the earlier four-bit arithmetic, signed/unsigned readings, addition flags, elapsed subtraction and the worked inversion/carry-in explanation immediately before this pane. The existing lesson and two-pane source were inspected. Main has also gained the shared course style since the earlier task; preserve those new styles and offline code. Final built phone/desktop/theme inspection remains required.

Checked model facts: each comparison is an independent run of the same authored subs w0, w0, w1 program. The original 8−3 worked example and real-width calculation remain unchanged. Here b=8 has four-bit inverse7 and carryin1, so each full sum is a+7+1. For a7 the four-bit full sum15 has carry0 and kept1111 (15 unsigned); a8 gives16, carry1 and kept0000 (0); a9 gives17, carry1 and kept0001 (1). The outside place is worth16. The real32-bit results are4294967295/C0,0/C1,1/C1. A four-bit teaching view is not an Arm register width or architectural flag. Connect it explicitly to the actual32-bit subs rule in the following pane.

Sources are the course assembler/simulator trace, existing subtractionBridge projection and its all256 small-pair tests. Boundary tests pin the three cases. The native differential corpus already checks8/8; add7/8 and9/8 calls for the same native subtract_flags function. No new ISA implementation or source-program text is needed.

Hypotheses to distinguish: thinking only strictly greater inputs give carry1; thinking a zero result implies C0; confusing carryin1 with carryout; reading four retained bits as signed values. The three visible independent cases hold b/inverse/carryin constant and expose the one changed input, full sum and split result. Group the outgoing carry in a dashed frame and four kept bits in a solid frame, with unsigned decimal reading under the bits. Equality must be labelled, not just indicated by colour.

Keep the new pane compact: a short purpose/setup, column labels, three aligned rows and a short equality takeaway/32-bit bridge. All three rows remain visible without tabs or gates beyond the adder's existing gates. Existing negation assessment provides a later fresh independent application; do not disclose its reference answers. Preserve all IDs/gates/source drafts and existing controls. Other adders default to their original single view.

Apply docs/style.md and docs/visual-language.md. Separate copy drafting and independent learner/technical reviews are required by CLAUDE.md. Final checks include header/text containment at narrow widths with the current IBM Plex fonts, both themes, keyboard/control/gate/draft persistence, sibling defaults and shared card styling. Tests and agent reviews are functional/content evidence, not proof of learning effectiveness; no novice session is claimed.
