# Independent reader and technical review: The same C on 32-bit Arm

Reviewed 18 October 2026. Reviewer did not draft or implement this lesson.

Scope: one optional lesson, with the learner assumed to have completed Modules 0–11.
Read `CLAUDE.md`, `docs/style.md`, and `docs/authoring.md`; inspected the actual built
page at `http://localhost:4204/assembly-lab/#/lesson/same-c-on-a32`, its source,
recorded compiler output, grader, and architecture sources. No production files
were changed and no build was run. The served snapshot predates pending hint
revisions, so this note does not repeat those known hint findings.

## Findings

### A-R1 — Medium: static compiler records are labelled as simulator execution

**Page quotation:** the three paired listings display **“STEPPED”**. Opening that
badge displays: “Each step runs one instruction on the course's simulator.”

**Evidence:** reproduced in all four viewport/theme combinations. The first pair's
opened badge is captured in `/tmp/reader-optional/375-light-mislabel.png`. All three
`listing-pair` figures in `same-c-on-a32.ts` declare `timeModel: "steps"`, although
`ListingPairFigure.tsx` only renders recorded text. The platform already supports
`timeModel: "none"` for figures that execute nothing.

**Learner effect:** the UI directly contradicts the distinction this lesson is
teaching between recorded A32 output and runnable A64 programs. The first pair
looks like a simulator figure, but has no stepping controls.

**Direction:** classify the three static pairs as figures without a time model.
Also inspect the record-only token exercise and assembler-acceptance experiment:
the simulator-step badge describes neither operation accurately. Keep the badge
where the figure actually executes the A64 simulator.

### A-R2 — Low: the opening introduces execution-state jargon without explaining it

**Page quotation:** “The other targets A32, an instruction set in Arm's 32-bit
execution state.” The compiler note similarly says “A64 uses Arm's 64-bit execution
state even when an instruction operates on `w` registers.”

**Evidence:** no earlier lesson prose explains “execution state”; the term first
appears here. The following section clearly explains the different register names
and widths, but does not define the newly introduced term. “Baseline architecture”
is also used in the compiler note before its practical consequence is given in the
division section.

**Learner effect:** the reader must infer what the processor's state has to do with
its instruction set and why running a 32-bit operation does not change that state.
This is a small clarity problem rather than a factual error or exercise blocker.

**Direction:** briefly give the ordinary-language meaning of execution state where
it first appears. Explain baseline in terms of the features the compiler may
assume, or use that concrete description without the extra term.

## Browser checks

Fresh contexts at 1280×800 and 375×812, each in light and dark themes:

- All prose, compiler notes, three listing pairs, prediction controls, two exercises,
  hints, and model-versus-reality note were inspected.
- The first A64 trace begins locked. Checking an incorrect prediction unlocks it;
  the feedback distinguishes the prediction from the computed result.
- The syntax experiment gives feedback from the real course assembler after a
  choice is committed.
- Both exercises block empty submissions, reject incorrect submissions, accept
  their references, and retain successful work after reload.
- All five hints can be opened for each exercise. Pending changes to their wording
  require a later check of the rebuilt page.
- Both A64 steppers advance to return and disable Next at the end.
- No JavaScript page errors, horizontal page scrolling, or overflowing figure boxes.
  Phone controls checked were at least 40 pixels high.
- The paired listings remain legible: side by side on desktop, vertically stacked
  on phone. Both themes distinguish the highlighted instructions from their panels.

Evidence: `/tmp/reader-optional/results.json`, `page.txt`, `review.mjs`, full-page
initial/finished screenshots and focused division screenshots for all four
combinations. Screenshots include exercised states and therefore are review
artifacts, not learner-facing material.

## Technical checks

The focused facts, rendering/grading, recorded-query, and canonical-prose suites
passed: four files, 26 tests. Inspection confirms that token answers are extracted
from the retained listing, the numerical answer comes from the A64 simulator,
and the syntax answer comes from the course assembler. Stored verdicts are not the
source of correctness. This review does not repeat the already recorded GNU
as/QEMU run.

The six retained compiler responses agree with the displayed code and source
mapping. The request options agree with the module's evidence note, which records the
compiler IDs and versions. The page correctly limits claims to those
compilations and does not claim to run A32 or its division library.

Independently downloaded and read:

- AAPCS32, 2025Q4: core argument/result registers, the link-register alias,
  callee-preserved registers, and eight-byte stack alignment at a public interface.
  The shown save/restore sequence is consistent with these rules.
- Arm's public instruction-reference mirror, MOV immediate A2, MOV register, and
  MOVT: zero-extension of the wider immediate, conditional execution, and preserving
  the low half when writing the upper half. These support the lesson's claims.
- GCC 15.2 `gcc/config/arm/arm-cpus.in`: the baseline Armv7-A feature group excludes
  the A32/Thumb divide feature additions present in Armv7VE. This supports the
  target-specific division claim alongside the actual recorded compiler output.

Copies are under `/tmp/reader-optional/` as `aapcs32.txt`, `mov_i.txt`, `mov_r.txt`,
`movt.txt`, and `arm-cpus.txt`. The precise URLs are recorded in
`docs/notes/module-a/listings.md`.

No incorrect architecture or C-semantics claim was found in this pass.

## Assumed knowledge

The learner can obtain the necessary comparison, flags, C conditional-expression,
register-width, call/return, stack-alignment, and integer-division knowledge from
prior lessons. The previous calls lesson explicitly defines a leaf function;
Module 0 explains the GCC optimisation setting; the comparison lesson explains
C's conditional operator. “Mnemonic” is paired with “instruction name” in the
exercise directions. New register names, the link-register alias, brace syntax,
and the program counter are explained here. The unexplained execution-state term
and the delayed explanation of baseline are covered by A-R2 above.

The prose otherwise follows a clear sequence: compare a known calculation, identify
new syntax, then explain a target feature that changes the implementation. The
most consequential remaining problem is the misleading simulator badge, not the
technical explanations.
