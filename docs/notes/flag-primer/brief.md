# Four-bit flags integration brief

Outcome: use the retained bits and independent signed/unsigned range checks to predict NZCV for unfamiliar additions, then transfer the rules to 32-bit ADDS.

Prerequisites: M1 signed/unsigned readings and four-bit addition/carries; existing optional calculator remains permitted. Source inspection: adding-and-the-flags source and pacing split, existing FourBitArithmetic/FlagsRow/AdderFigure, model AddWithCarry, canonical prose, authoring/style/visual guidance. Earlier browser evaluation is recorded in nzcv-mock/fit-recommendations.md; implementation browser review is separate.

Scope: four-bit teaching miniatures, never claimed as Arm registers/instructions/PSTATE. N top retained bit; Z all zero; C top carry out/unsigned sum too large for addition; V signed exact sum outside range. Real ADDS keeps 32 result bits and updates NZCV; ADD leaves flags alone. Defer subtraction no-borrow to elapsed ticks, persistence experiment to next lesson, hardware detail to optional Bit Lab.

Route: concise definitions and ADD/ADDS purpose; four visible complete miniatures with N/Z focus then two C/V comparisons; one fresh supplied-result formative check; explicit unsolved width bridge; existing 32-bit prediction, gated arithmetic, flags reference and three fresh exercises. No optional control is necessary to see essential teaching. Existing prediction and success gates retained.

Misconception hypotheses: negative implies overflow (N example fits); C and V are opposites (fresh case both); N alone detects overflow (fresh case N clear/V set); wrapping result equals exact sum (readings and exact range checks separate); flags flag only named in card (all four values shown). Success evidence: independently derive mini NZCV, then existing 32-bit challenge. Correct guessing is not proof of understanding. No beginner study performed.

Numerical evidence: helper derives from existing fourBitAddition model's low four columns, not real32 flags. Exhaustive independent modular/signed-range unit test, worked fixture checks, source calls added to GNU/QEMU corpus. New controls native0/1 radio groups, unknown saved state validated, feedback recomputed; editing hides old feedback and reset clears only mini practice.

Review process: production prose drafted independently by flag_primer_draft (Sol medium); learner/UX review Sol high, technical review Sol xhigh. Accepted/rejected findings and verification recorded separately. No installed dedicated interface skill was found in prior discovery; apply course visual-language and independent interface inspection.
