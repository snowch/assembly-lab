# Drafting record: C and instruction alignment

This separate drafting pass used `brief.md`, `inventory.md`, the recorded Module 0
listings, and `docs/style.md`. It changes shared listing labels and the Module 0
caption and notes. It does not supply or validate the other lessons' source maps.

## Checked facts

- `TRIP_DISTANCE` keeps its four instructions in order: two additions, subtraction,
  and return. The arithmetic statements are displayed C lines 3, 4 and 5; the
  return statement is line 6. GCC's recorded references remain 3, 4, 7 and 7.
- The course's teaching associations and GCC's original references are separate.
  The original references will be available in a closed compiler-details section.
- A return instruction sends control back to the caller. The shared return label
  says only this, because it also appears before Module 0 defines registers and
  beside functions that return no value. The Module 0 note explains separately
  that `ret` does not calculate or move that function's result.
- Some source excerpts repeat because assembly order is preserved. A complete C
  source view supplies the original source order. An instruction can have no
  linked source statement, including support instructions and deliberately wrong
  instructions inserted for an exercise. The shared empty-association label must
  describe only the absent link, not claim that every such instruction is useful.
- The revised stepper highlights the related C and the last instruction together;
  its arrow still identifies the next instruction. The raw reference chip no
  longer carries the primary explanation.

## Draft decisions

The shared labels use “C operations”, “Complete C source”, and “Compiler's C line
references”. The latter section states that a compiler reference may identify a
brace instead of the operation an instruction performs. The shared label says
“compiler” because the renderer also displays the course compiler's output;
only the Module 0 note identifies the recorded references specifically as GCC's.
Repeated excerpts are
described as related C, rather than asserting that every modified or deliberately
broken listing implements the adjacent statement correctly.

The Module 0 caption now promises paired statements and instructions, without
claiming they are positioned according to GCC's original references. Its stepper
caption names the visible highlights without depending on a dark chip or theme.
The explanatory note identifies subtraction with line 5 and return with line 6;
it preserves the factual GCC reference to line 7. It avoids naming the result's
register before the learner's prediction. The compiler option note now places
`-g` line references in compiler details rather than beside the main instructions.

Both closing passes in `docs/style.md` were applied to this draft. Independent
review must confirm these words against the completed browser implementation,
including narrow layouts, repeated source excerpts, and return annotations.

## Branches and comparison details

A follow-up drafting pass removes the same obsolete layout promise from the
Branches caption and opening paragraph, with matching changes to the Module 4
canonical prose. `DESCRIBE.sourceLines` associates `cmn` with line 5, `mov w0, -2`
with line 6, and `csel` with lines 5–7. The raw listing still records C7 for all
three. The revised paragraph states those related operations and identifies the
original compiler references separately. It does not alter the instruction
sequence or give an execution count for the following prediction.

The shared `sourceConnections` disclosure reads “How the instructions relate to
C”. The comparison view will show it only after the learner commits a prediction,
so the label does not expose hidden instructions early.

A targeted search of all lesson prose and captions found no other promise that
raw compiler references determine visual alignment. The local-compiler lessons
describe source associations and repeated highlights without claiming a
one-to-one match; those sentences remain applicable. Module 0's opening prose
says instructions are “beside the C”, which describes the desktop layout but
not the narrow layout's stacked pairs. That small wording issue was reported to
the managing session for its renderer review.

## Instructions associated with several C statements

The conditional `multiSourceNote` explains that several related source statements
are not a C execution trace. Its two cases are both needed: one instruction can
combine operations, such as decrementing a counter and setting flags for its loop
condition, or serve statements on different paths, such as a shared return. The
last sentence states what a learner cannot infer from highlighting several lines:
it does not mean all those C statements run at that step. The note introduces no
new instruction or numerical claim and does not change any teaching association.
The renderer will show it only where an instruction has more than one linked C
line. Independent review should check the wording with both combined-operation
and alternative-path examples, especially the exhausted-capacity path in
`LABEL_LENGTH`.
