# Checked fact brief: lessons 00–06

Scope: accepted M1/M2/M6/M7, L2/L5/L6/L7, 06-N1, N1/N2/N5/N7/N8, shared S1 occurrences in lessons 00–06. N3 parser and N4/N6/write labels are shared UI work.

Objectives/prior knowledge: retain each lesson's published objectives and term order. Earlier lessons supply registers/operands, then bits/signed readings/hex, constants/width, flags, masks and shifts. Follow docs/style.md's sentence and explanation passes; no new challenge answers outside existing gated hints/feedback.

Checked facts:
- Module0's bit switch is the shared Show the bits control, toggling all register displays, not a per-register opener (Stepper and strings).
- Opening fuel_used_wrong stepper has no initialStep; starts before subtraction, call inputs50/38; the caption currently says after subtraction (lesson01 data).
- subs arithmetic is a + complement(b) + 1 at32bits; complement(b)=2^32-1-b, full sum=a+2^32-b. Carryout=1 iff a>=b unsigned. Its third assembly operand is b; operand one is destination (machine arithmetic and subtraction facts tests).
- CounterRing is first interactive in subtraction investigation. Current whole prose precedes it; schema supports lead directly before each interactive. Split ring prose from adder explanation using lead, retaining every paragraph and prediction gate.
- Masks prediction runs clear_door on0xffffffff; maskView currently0xf, a distinct run. Use same0xffffffff so low-eight view is an enlargement of prediction run (ProbePrediction). Reflection operations currently assume independent starting0x47.
- SolutionStepper's displayed register may be w1 while preparing gear, or w0 while changing warning word. afterRun cannot always promise warning word.
- GCC integer documentation recorded in docs/sources.md distinguishes negative signed right shift (C compiler chooses and documents result; GCC signextends) from undefined signed leftshift cases (C guarantees no result; GCC supports as extension). docs/notes/module-3/brief.md and recorded listings provide corresponding instruction examples.
- Prediction shift card runs asr only and marks changed bits; later ShiftFigure shows fill/loss for selected instruction. Local explanation must not promise two results marked on current card.
- Hint tuple is concept, common mistake, smaller example, partial answer, answer. Correct rules at rung2 need explicitly identify mistaken alternative; rung3 concrete examples already present in all early hints except setGear's general shift example can be made explicitly illustrative without adding numeric facts.
- Each figure role is optional free string; overrides generic model badge and note. Preserve timeModel semantics. Actual prediction/listing-compare roles=prediction; UI coordination sets remaining activity role vocabulary.
