# Subtraction reinforcement brief

Copyright © 2026 Christopher Snow

The requested change reinforces how one 32-bit subtraction produces its returned pattern,
before the learner compares the two C readings. The main lesson outcome remains choosing C
types and checks that fit the meaning of a returned distance.

Preparation is explicit: Signed and unsigned readings teaches bit weights and two readings;
Arithmetic with four bits defines, demonstrates and practises inversion, adding one, adding
the opposite, and keeping a fixed number of low bits. Its fresh subtraction is already the
independent arithmetic practice. This change bridges that method to the actual 32-bit run;
it adds no new assessment or carry-stepper, and no claim about processor timing or flags.
The later return-zero reflection is a fresh application to the C contract.

The hypothesis is that readers may otherwise see the returned pattern as an unexplained jump.
The supporting action is to compare the original operand, its inversion and opposite with
the vertically aligned addition. It must distinguish construction of bits from reading those
bits as C values. Independent browser/technical reviews can expose missing steps; they are not
a novice learning study.

All numeric states come from the two actual simulator traces and auxiliary model ADD runs.
The machine's subtraction record stores the inverted operand and incoming one. The helper
requires matching returned 32-bit subtractions and verifies that adding the first operand to
the model-generated opposite reproduces the actual return word. The new view is opt-in and
retains the existing prediction and call gates, reset and restored-state semantics.

Keep the mechanism visible after calling, use full bit patterns at the real width, share the
existing final word once, and link to the earlier lesson with generated module/lesson numbering.
Source and copy were read before drafting; the final built state is inspected independently
on phone/desktop in both themes. The review records both correction evidence and narrow-screen
limits. No human novice study is claimed.
