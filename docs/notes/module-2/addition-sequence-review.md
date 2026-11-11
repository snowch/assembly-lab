# Putting the addition beside its explanation

11 November 2026. The user approved the earlier sequencing recommendation and a more
explicit signed/unsigned prediction task. This revision implements both in M2, L1,
“Addition and its flags”. The earlier PR125 had changed prediction wording only; its
sequencing recommendation was not an implementation.

## Learning-design brief

The observable task is to work out a sum under each input reading, check the appropriate
32-bit range, and use result bits and carries to explain N, Z, C and V in a fresh addition.
M1, L3 already defines, demonstrates and practises carrying and bridges to 32 bits. That
supports a short carry reminder here. Further circuit design and compiler overflow idioms
remain outside the essential route.

The existing calculated figure stays immediately after that reminder. Its local guidance
names the controls and distinguishes revealing columns from executing instructions. The
following visible explanation uses the result and its top carry marks to explain the four
flags and C versus V. The optional GCC disclosure follows the rules. A fresh-exercise lead
then sits directly above the existing three-addition task.

The schema requires selected sections to follow their declared order. Rather than change
the shared platform or insert an explanation stage before construction, the published
construction section now contains the flag meanings and their application under “Reading
the four flags”. The unsplit source carries the same explanation after its calculation.
The published follow-on lesson does not duplicate the moved GCC disclosure. Existing
programs, input calls, figure ids, option values, grading and gates remain unchanged.

## Draft and independent review

A separate GPT-6.1 Sol Medium agent drafted the copy from the checked brief. Sol High
learner and Sol Extra High technical reviewers independently read the actual published
lessons, prerequisites and implementation and inspected the built route. The local
learning-design skill supplied the prerequisite, essential-route and locality checks.

Accepted: the published prerequisite teaches bit weights but does not explicitly display
both full 32-bit ranges. The old source generalisation that supplied them is omitted by
its published pacing composition. The revised question now supplies generic unsigned and
signed bounds visibly before the choices. This is preparation, not the worked input sum.
Both reviewers independently checked that correction in the final build. The existing
facts test now also pins the unsigned maximum and the next addition's wrap to model results.

Rejected: another four-bit carry activity is needed. The actual prerequisite already
defines, demonstrates and practises that mechanism. Rejected: changing labels requires a
saved-work migration. The option values and storage shape are unchanged. Neither the
worked prediction result nor the fresh exercise's solutions appear before their gates.

## Verification

Final focused checks: six files and 136 tests passed, including canonical prose fidelity,
numerical/model facts, rendering, shared arithmetic figures and unchanged string contracts.
An earlier focused run failed one vocabulary assertion because ordinary “Compare” collided
with a later reserved course term; the copy was corrected and the guard retained. The draft's
initial fidelity attempt ran no tests while an intermediate section order was invalid; the
final structure preserves the existing four-section order. These earlier failures are not
reported as passes.

Independent technical checks included the relevant GNU/QEMU corpus: 16 calls, 52 instruction
states and no differences, plus boundary and carry comparisons. The new guidance prop is
optional; sibling subtraction figures render with their existing controls and no new guidance.
The shared platform is unedited.

Both reviewers and the managing session checked 375×812 and 1280×800 in rendered light and
dark themes: initial and selected states, every prediction choice, commitment and restore,
column and group reveal, Show all and Reset, the exercise gate and optional GCC note. The
learner reviewer additionally checked keyboard operation and exercise failure, pass, restored
work and clearing. The generic bounds are visible with the optional note closed. No page-level
horizontal overflow, console/page errors or raw Markdown were observed.

The reminder's start is about 219 px from the calculation caption on the phone, compared
with 1,106 px in the earlier review. There are 24 px between the reminder's bottom and that
caption, and 16 px between the guidance's bottom and its controls, in all four combinations.
The managing session's first browser harness queried a wrapper instead of the adder child
for its state attribute; the corrected full run passed. These checks are not a human novice
study or screen-reader validation. Final full-suite, exact-tree CI, merge and public-build
verification are recorded in the pull request separately from these focused checks.
