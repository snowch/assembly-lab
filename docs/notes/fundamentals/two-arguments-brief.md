# Two arguments in A tiny function

Copyright © 2026 Christopher Snow

## Request and learning objective

Add a visible two-parameter example after the existing increment function, then merge once
checks pass. The learner should connect argument order to incoming w0/w1, distinguish the
addition preparing the w0 result from RET returning control, and see the second input remain
unwritten by this particular function. This is not an ABI promise to preserve w1.

## Checked facts and prior knowledge

- Earlier One addition teaches register-source addition and inputs/destination; Adding a
  constant teaches a destination also supplying its old input value. The current lesson already
  defines caller/argument and demonstrates increment_int through ADD and RET.
- The new function is add_ints with two int parameters and one return expression. The actual
  GCC 16.1.0 request/response, compiler identity, preserved references and AAPCS64 checks are in
  [the source brief](../module-0/two-arguments/README.md).
- The model and GNU/QEMU agree on the original call, original caller inputs, separate ADD/RET
  steps and unchanged second input. The new corpus also checks safe fresh signed cases.
- Whole-lesson wording follows docs/style.md and the drafting/review process in CLAUDE.md.

## Implementation decisions

Use the existing construction section and shared primitive function view. Show both examples
without an activity selector or prerequisite gate. Keep the original figure ID and challenge
unchanged. Reuse the established call arrow, register tiles, shared numbered C/assembly listing,
and Run / Start again controls. Extend the diagram to label each incoming register separately;
only the first tile becomes result ready/result. Caller arguments come from the initial model
state and stay fixed while registers change. Each example retains its own persisted step.

Do not add a three-parameter program, another arithmetic operation, call instructions, stack
machinery or another introductory compiler-reference disclosure. Keep the raw new compiler
references in the source record and use checked semantic C associations in the paired view.

## Separate passes

A separate drafting agent wrote the local explanation, figure captions, objectives, shared
argument labels and canonical records from the checked facts. An independent learner reads the
whole lesson knowing only the front page and the two preceding lessons. An independent technical
reviewer checks the sources, actual compiler output, differential execution, source associations,
shared view and final built states, including the original single-argument example.
