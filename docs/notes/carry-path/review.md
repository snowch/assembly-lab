# Independent learner and technical review

4 November 2026. Reviewer: a separate GPT-6.1 Sol agent, High effort, which did not
write the implementation. The two passes below are distinct. The reviewer inspected
production rendering before reading implementation source, without the builder's rationale.
This is an agent review and browser usability check, not a novice study.

Guidance: repository AGENTS/CLAUDE, docs/authoring.md, docs/style.md, the local
learning-design skill and docs/visual-language.md. Scope: the complete Arithmetic with
four bits lesson, particularly its new addition walkthrough and compact later diagrams.
No implementation files or git state were changed by this reviewer.

## Learner conclusion

No supported material finding remains. Keep the full carry walkthrough in the first
addition and the compact width/subtraction examples. This addresses the reported ambiguity
without repeating the full column visual throughout the lesson.

The learner can follow both outputs without animation. The current equation labels A, B
and incoming carry, then labels the two places of the binary sum Carry and Kept. Both
new destinations have solid prominent outlines and the words Carry or Kept. The persistent
arrow connects the carry place to the next column's incoming carry; the kept bit remains
in the current result column. The current and next column have distinct outlines and
Revealed/Next words. Colour supplements these marks.

The initial incoming carry is visibly zero. Individual reveals include a carry of one,
a carry of zero and a final Carry out outside the four columns. The final arrow has a
complete head and a visible descending shaft. The completion message says there is no
next column. Reset restores unknown results and carries while preserving the starting
inputs. The calculation does not need a remembered animation or a hidden explanation.

The compact width example names Carry out and Low four bits on opposite sides of a
visible boundary. Its caption and following sentence explain what to discard. The
subtraction example retains the original/inverted/opposite sequence and connects its
opposite to the compact addition. It does not repeat the column walkthrough. Phone
connectors point down while Add one remains horizontal and readable.

### Preparation, teaching sequence and fresh application

The published prerequisites require binary digits and positional place values. The
preceding Signed and unsigned readings page demonstrates and practises both readings
of four-bit patterns, including the negative highest weight. That prerequisite page,
the course plan and the complete four-bit page were read in the built browser. The
plan lists this lesson before Arithmetic on register bits.

No new unsupported assumed knowledge was found. Carry is defined before the walkthrough;
invert is defined before subtraction. The miniature is explicitly distinguished from an
Arm register. The visible steps and two small binary sums prepare the column calculation.
A one-column example would demonstrate splitting a sum, but not the destination of its
carry. The chosen example earns its four columns through propagation and stopping.

The full addition demonstrates the mechanism. The separate width example demonstrates
retention at the boundary. Subtraction defines and demonstrates inversion, adding one and
adding the resulting opposite. The fresh exercise asks the learner to apply that
composition, rather than merely repeat the worked result. Its answer and solved note
remain gated. Completion of the walkthrough alone is not evidence of learning.

The existing prose is proportionate to these jobs. The implementation adds no separate
instruction-execution explanation: the existing sentence before the figure already says
that Next column reveals a calculation and does not execute another instruction. The
outcome gives the current destination rather than duplicating the full equation.

## Technical conclusion

No supported material finding remains. Source review checked FourBitArithmetic,
four-bit-arithmetic, arith/columnWork, complement, grader-four-bit, canonical strings,
lesson data/prose and the arithmetic model tests. The executable view derives its data
from the machine model and retains the actual existing addition/subtraction helpers.

Every displayed input, incoming carry, binary sum, kept bit and outgoing carry was checked
against the model data in the browser. Columns remain ordered bit 3 to bit 0 visually and
reveal bit 0 first. Carry zero is revealed and marked just like carry one. At completion,
the destination moves outside the four result columns. The width and subtraction compact
results agree with their model examples. The unchanged grader computes the fresh exercise
through fourBitSubtraction rather than trusting a stored completion mark.

The SVG uses a unique marker ID, a tip reference at x=8 and measured source/target boxes.
Its path meets the source's bottom centre and the destination's top centre. The final
vertical segment is 24 CSS pixels, leaving visible shaft above the 8-pixel arrowhead.
Resize observation updates the route; reset removes it. No scripted animation is needed.

### Browser verification

Final built URL: http://localhost:4318/assembly-lab/#/lesson/four-bit-arithmetic.
Chromium through local Playwright, 375×1000 and 1280×1000, explicitly selected Light and
Dark. Actual rendered themes were checked. Preliminary dev-server rendering was also
inspected; final conclusions concern the built site.

In each of the four viewport/theme combinations:

- Initial state, all four individual reveals, completion and Reset passed. Model inputs,
  incoming carries, kept results and binary-equation accessible names matched. Initial
  and reset states conceal outputs and the unsigned result reading.
- Enter and Space advance columns. Focus stays on Next column. Completion sets
  aria-disabled and another Enter does nothing. Tab reaches Reset; Space restores the
  initial state.
- All four reveals were checked at the original width, opposite width and original width
  again: 48 geometry cases. Endpoints match the boxes, marker refX is 8, final descent is
  at least 24 pixels and connector segments intersect no diagram text. No document-level
  horizontal overflow was observed.
- Width and subtraction were inspected in screenshots and checked against their model
  values. Neither contains a repeated carry walkthrough. The boundary, labels, bit
  patterns, subtraction arrows and signed reading remain readable.
- The fresh exercise starts blank with its solved note absent. An empty submission is
  blocked. An incorrect submission leaves the solution hidden. A successful submission
  reveals it. Reload retains successful work; Clear work removes it and hides the solved
  note again. Review notes intentionally omit the exercise's answers.
- No browser page errors were observed. Cells have explicit accessible names and bit
  columns have named groups. No screen-reader application or touch device was tested;
  assistive-technology coverage is limited to browser semantics and keyboard operation.

The final paragraph-width adjustment was inspected in the built site: current-column and
outcome paragraphs have a computed maximum width of 576px at desktop (60ch). A fresh
focused browser run after that adjustment rechecked the affected rendering and all states.

Screenshots, repeatable focused harness and measured results are under
`/workspace/scratch/carry-path-review/production/final/` and the parent production review
directory. Repository-wide checks and CI results belong to the managing session's record;
this reviewer did not run or claim a full suite.
