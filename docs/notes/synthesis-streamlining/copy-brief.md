# Synthesis copy brief and drafting record

A separate drafting agent revised the open prose after the author approved removing repeated
introductory testing. Sources: the current recorded compiler listings, preceding four Fundamentals
lessons, checked call traces and existing fact tests. Read with docs/style.md and the visual language.

Checked facts supplied before drafting:

- The earlier lessons establish add/sub operands, integer argument/result placement, register reuse,
  instruction sequencing and the program counter.
- The trip function has four integer arguments, arriving in w0–w3 in source order; its compiled
  arithmetic updates w0 before ret. GCC 16.1.0 -O1 produces the recorded four-instruction listing.
- The complete function walkthrough remains; the old static listing and destination-reuse prediction
  are removed. No new program or call is introduced.
- Fuel repair, its hints and tests, the gated missing-return experiment and final independent trace
  remain unchanged. The two adjacent functions in the experiment are explicitly arranged that way;
  a function label alone does not stop sequential execution.
- Full paired C/instructions, source-line associations, compiler qualifications and optional original
  references remain. Long compiler explanations belong beside the one retained stepper as closed notes.

Drafting choices:

- Establish the trip context and four-argument mapping once; follow total through the existing register
  rather than ask the introductory destination question again.
- Give only local controls/mark guidance for the combined-function stepper, without redefining simulator,
  registers or program counter.
- Explain the new failure mechanism locally, and finish with a whole-run takeaway rather than another
  isolated subtraction question.
- Keep repair and independent trace tasks, hints, answer values and failure feedback unchanged.
- Canonical prose now includes all five retained captions rather than historical untracked-caption exceptions.

Five rewritten open prose fields (prediction, investigation, explanation, generalisation, reflection):

| Field | Before words | After words |
| --- | ---: | ---: |
| prediction | 104 | 64 |
| investigation | 172 | 64 |
| explanation | 97 | 40 |
| generalisation | 112 | 51 |
| reflection | 84 | 25 |
| Total | 569 | 244 |

This count excludes the removed prediction/reveal UI and closing-answer strings, retained optional
notes and unchanged exercises. The coordinating agent owns structural migration and verification.
