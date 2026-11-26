# Verification and independent review

## Scope

Three changed lessons: Arithmetic with four bits, Shifts, and Writing an upward loop. The local
Subtraction flags and negation pane also clarifies representable input bounds. Browser checks
follow the stated controls, preserving existing predictions, challenges, source identities and work.
No observed novice-learning improvement is claimed.

## Independent findings and corrections

- Learner review found the eight-bit display clipped at320px. Eight-bit output groups now stack
  below400px and each bit/weight has a22px track. Rechecked all eight cells inside the card.
- Learner review found pale dark-theme text on white native inputs/select. Theme-aware surfaces,
  text, borders and placeholder colours now apply. Rechecked actual computed dark colours and
  screenshots, not just the selected preference.
- Technical review requested an explicit bridge for decimal100: a real32-bit register view can
  hold100; selecting four/eight kept bits deliberately reduces the teaching width. Separately
  drafted clarification is now local to the activity and verified in the final build.
- No mathematical or instruction-semantics finding was accepted. The independent512-case
  retained-bit oracle and native comparisons agree. Model output remains hidden until the action;
  full input/place values are visible as preparation.

Storage learner/technical final checks covered320/390/1440px in both actual themes, four/eight
widths,14/15/16,100, invalid256, blank/wrong/correct predictions, keyboard action, reset and reload.
Changing or resetting storage preserved already revealed addition state and saved subtraction work.
The existing arithmetic walkthrough's ordinary-refresh behaviour remains its established transient
handoff behaviour; it is not newly represented as persistent work.

## Focused checks

- Final combined model/content/copy/UI run:101 tests passed across7 files.
- Final canonical relocation run:16 tests passed across2 files (canonical-final.log).
- New browser regression file:12 passed, covering all three activities on phone/desktop in both
  themes. It checks prediction gating, automatic shift updates/rejection, loop history, storage
  restoration, actual bit containment and native-field dark surface.
- Independent native check: storage32 calls/96 instruction states; shift61/183; original loop7/68;
  changed loop2/20. All zero differences. These are focused fixture results, not full-corpus totals.
- Formatting, strict types, copyright and unchanged-platform checks passed before the full run.

Initial candidate failures are retained rather than relabelled as passes. They include the two
product layout/contrast findings above, a test using an unexported parser import, a fact inventory
not yet extended to the new input constants, an initial test-store API mistake, and browser harness
assumptions about control wording/padded hex. The first focused browser run was interrupted with
exit130 after identifying its stale selector; later completed focused runs also failed their stale
expectations. Corrected focused checks have the distinct final results listed above. None of those
initial invocations is claimed to have passed.

The exact-commit full checks, pull-request checks, merge and live revision are recorded in the
pull request and task completion evidence. Focused checks do not substitute for that final gate.
