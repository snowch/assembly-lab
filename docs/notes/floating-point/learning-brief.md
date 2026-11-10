# Optional floating point: learning design and evidence

Apply [the local learning-design skill](../../../.agents/skills/learning-design/SKILL.md).
The introductory outcome is to trace how a stored fractional value becomes an Arm numeric
operation or a C conversion, while keeping representation separate from interpretation.
This is optional Module D; it does not extend the integer browser instruction set.

## Preparation and route

The bits lesson links practised binary weights/readings and w/x widths. It explicitly adds
fractional place values, negative powers and normalisation before the normal field formula.
The worked vehicle distance is 9.5; fresh work asks for a different binary fraction, decoded
normal fields and a reserved exponent state. The exact model supplies decoding and feedback.

The rounding lesson starts with a pump reading which has no finite binary representation.
The learner compares the exact input with current storage, then follows a named Apply/Add 1
sequence at a larger scale. Fresh input checks nearest-even rounding. The interface states
that changing format converts current storage, while Apply encodes the entered decimal again.
Rounding actions precede the full field decoder on a phone. Numeric speed is not assessed.

The Arm lesson introduces the separate floating-point bank and S/D views. Complete C remains
paired with unchanged compiled instructions. Labelled recorded results demonstrate float and
double addition and float multiplication; a fresh width/spacing application checks transfer.
The bank relationship is defined and demonstrated, not separately assessed as mastery.

The conversion lesson gives finite/range conditions before casts and explicitly directs
four independent case comparisons. A fresh truncated-value answer and representation-copy
choice separate numeric conversion from copying bits. Widening is demonstrated, not separately
assessed. Learners see the model-derived converted integer pattern beside the copied pattern
only after a complete submission.

## Misconceptions to probe

These are design hypotheses, not observed novice results:

| Possible wrong rule | Evidence sought |
| --- | --- |
| Floating-point sign has a negative positional weight | Fresh normal-field decoding after sign/scale explanation |
| All exponent states use an implied leading 1 | Fresh classification with zero exponent and nonzero fraction |
| More decimal display digits mean exact decimal storage | Exact input/storage comparison and separate short display |
| More bits recover the original decimal automatically | Format conversion versus reapplying the unchanged exact entry |
| A one-unit increment always changes a float | Exact-before/stored-after comparison and fresh spacing task |
| A cast and bit copy preserve the same thing | Fresh truncation plus copy choice and computed bit patterns |

## Boundaries and checks

The numeric core implements binary32/binary64 nearest-even arithmetic with exact rational
rounding. It classifies all editable encodings, including signed zero, subnormals, infinity and
NaN. Architecture exception state, vector programming, other rounding modes and a browser FP
CPU are deferred. Native compiler cases are checked by GNU/QEMU with FPCR zero; no recording
is presented as a native process running in the page.

The separate prose draft used GPT-6.1 Sol Medium; model/evidence implementation used Sol High.
Four independent one-lesson reader/checkers used Sol High. A separate Sol Extra High technical
review checked primary Arm/AAPCS/C text, numeric boundaries and native execution. Individual
reports retain original findings, accepted/rejected dispositions and final built-state checks.

Phone/desktop, both actual themes, keyboard controls, initial/edited/committed/reset states,
reserved encodings, format changes and fresh feedback were checked in the built site.
These checks and agent reviews are not evidence of novice learning effectiveness. No human
novice study, assistive-technology session or physical Arm hardware test was performed.
