# Reading explanations in sequence

User finding: the initial prose still teaches unsigned, signed and two's complement together despite the staged figure. Correct the reading sequence, not only the controls.

Checked facts from the simulator-backed reader and the existing reviewed explanation:
- Unsigned bit 0 has weight 1; moving left doubles the weight. Bit 31 is the top bit, unsigned weight 2,147,483,648.
- A 1 contributes its weight; a 0 contributes zero. Sum the contributions.
- Signed 32-bit reading changes only bit 31's weight to −2,147,483,648. All lower weights stay positive. This is two's complement, not sign-and-magnitude.
- Same stored bits; a different reading does not write any register. Both readings agree when the top bit is clear.
- The figure begins with all ones, computed by the existing model run. Preserve editable bits, all three visible view buttons, reset/handoff, current challenge and scratch independence.

Scope: unsigned-only introduction and initial explanation. Show the signed mechanism, C int connection and two's-complement name with the Signed view; comparison explanation with Compare. Put the optional appendix link with the signed/comparison explanation. Each view's full calculation must show only its selected reading(s). No unlock gate, extra page or repeated full figure. Keep essential explanation visible beside its active figure; do not put it only in optional details.

Prior knowledge: front-page basic binary, preceding hexadecimal lesson (including set/clear), Module 0 register names and C functions. Follow docs/style.md, CLAUDE.md and docs/authoring.md. Prefer brief paragraphs and grouped large numbers. Do not repeat all unsigned rules in Signed or explain negative weights in the initial prose. Separate drafting and independent learner/technical reviews required. Tests should check sequence/interaction rather than merely snapshot strings. Sync current canonical prose records; preserve historical reviews.
