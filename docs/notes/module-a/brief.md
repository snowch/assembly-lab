# Optional A: checked brief and drafting contract

One lesson, `same-c-on-a32`, module 12, order 0. The goal is to read three A32 listings
using the mechanisms learned on A64, while noticing differences in syntax and target features.
All prior modules are prerequisites. Follow `docs/style.md`; do not imply an A32 simulator.

## Checked facts

The exact requests and responses in `compiler/` were fetched on 17 October 2026. A32 uses
GCC 15.2.0 (`carmg1520`), `-O1 -marm -march=armv7-a`. A64 uses GCC 16.1.0
(`carm64g1610`), `-O1`. These are two particular compilations, not claims about what every
compiler must emit. `-marm` selects A32 rather than Thumb; `-march=armv7-a` selects the baseline
architecture. Hardware integer divide is optional on that target, so this GCC configuration
does not assume it. A32 is an instruction set in the 32-bit execution state, not a synonym
for every Arm processor. A64 uses the 64-bit execution state, even for `w` operations.

- `limit_trip(unsigned distance,unsigned limit)` returns the smaller operand. A32:
  `cmp r0,r1; movcs r0,r1; bx lr`. A64: `cmp w0,w1; csel w0,w0,w1,ls; ret`.
  The A32 `cs` suffix applies the carry-set condition to that move. After unsigned compare
  it copies the limit when distance is greater than or equal to the limit. Equal values
  produce the same result whichever is chosen. On A64 `csel` chooses its first value when
  `ls` holds and its second otherwise. Both implement the same C function.
- A32's `r0` and `r1` hold these 32-bit parameters; `r0` holds the result. They are not A64
  `w` views of wider `x` registers. `lr` is the A32 link register alias for `r14`; `bx lr`
  returns to the saved address in this leaf function. A64's recorded return is `ret`.
- Prediction: A64 `limit_trip(80,50)` returns 50, computed by the simulator. Alternatives
  80, 0, 130 are wrong. Keep explanation of this input's result behind the prediction.
- Challenge 1 extracts the conditional move mnemonic and return mnemonic from the actual
  A32 record. These are `movcs` and `bx`; the grader reads the record, not copied answers.
- Failure prediction: the actual A32 move line does not assemble in the course A64 assembler.
  The experiment asks that assembler after commitment. Replacing the register spelling alone
  does not add A32 conditional instruction syntax to A64. Do not frame rejection by the
  subset assembler as proof about every instruction in the full A64 architecture.
- `service_marker(void)` returns 1001. A32 GCC emits `movw r0,#1001; bx lr`; A64 GCC emits
  `mov w0,1001; ret`. In A32 `movw` puts a 16-bit immediate into the low half and clears the
  upper half; `movt` can set the upper half, but is not needed here. The `w` in the A32
  mnemonic is not an A64 `w` register prefix. Constant choice deliberately needs the wider
  A32 immediate; 1000 was rejected as an example because GCC emitted ordinary `mov`.
- `average_trip(unsigned distance,unsigned trips)` divides. A32 GCC emits
  `push {r4,lr}; bl __aeabi_uidiv; pop {r4,pc}`. The helper is a library function, not an
  A32 instruction; `bl` is the call. Saving two registers keeps the stack 8-byte aligned
  for this A32 calling convention. The saved `lr` is restored to `pc` to return; `r4` is
  preserved and provides padding. Do not present the A64 16-byte stack rule as the A32 rule.
  A64 GCC emits `udiv w0,w0,w1; ret`. A32 implementations with divide extensions can use
  hardware divide; this baseline listing does not prove all A32 division needs a helper.
- `average_trip(95,4)` returns 23 on the A64 simulator. The C comparison is restricted to
  nonzero divisors. No claim is made about what this A32 helper does for zero.
- Final challenge fields: A32 marker mnemonic, A32 division helper's name, A64 divide
  mnemonic, and A64 `average_trip(95,4)` result. First three answers come from actual
  recorded tokens; the fourth from the simulator.

All figures reuse recorded listing pairs and the A64 stepper. A new recorded-prediction uses
the selected recorded line as input to the existing A64 assembler. A32 listings are static
compiler evidence, not executable inputs to the course machine. The A64 versions are in the
GNU as/QEMU corpus. No A32 timing, trace, or simulated result is displayed.

## Prose files and exact contract

Draft `content/lessons/same-c-on-a32.prose.ts` exporting `PROSE`, and
`content/lessons/same-c-on-a32.labels.ts` exporting `LABELS`, all `as const`.
Keep a canonical copy in `docs/notes/module-a/prose.md`.

PROSE string keys: question, motivation, prediction, predictionQuestion, predictionExplain,
investigation, construction, failureExperiment, failureQuestion, failureExplain, explanation,
generalisation, reflection, compilerNoteSummary, compilerNote, divisionNoteSummary, divisionNote,
readTask, readFeedback, finalTask, finalFeedback, modelVsReality, originalityNote.
PROSE arrays: readHints and finalHints, each exactly five strings.

LABELS: title; objectives(string array); titles with ten section-kind keys; captions with
limitPair,predict,step,read,syntax,markerPair,divisionPair,final; sides:{a32,a64};
options:{prediction:[{value,label} for 80,50,0,130],syntax:[{value,label} for rejected,accepted]};
challenges:{read:{title,fields:{conditional,return}},final:{title,fields:{constant,helper,divide,result}}}.

UI copy in `packages/views/src/strings.recorded.ts` export `RECORDED_STRINGS`:
`accepted` and `rejected` sentences about the course A64 assembler accepting/refusing the line;
`token(value:string)` says what the recorded listing contains;
`result(value:string)` says what the A64 simulator returns;
`wrong` generic failure directing learner to the specified listing/operation without revealing
the answer. Existing shared unanswered-label strings are reused.

Section sequence: paired limit listings; why transferable knowledge helps; result prediction;
gated A64 stepper and comparison explanation; read challenge; syntax failure prediction;
constant pair; division pair and closed stack/target note; final challenge; reflection.
