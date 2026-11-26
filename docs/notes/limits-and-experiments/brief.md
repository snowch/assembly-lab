# Meaningful limits: design and verification brief

## Scope and outcome

The user asked to make experimentation a habit: predict, run and explain at meaningful limits,
without a checklist on every page. They also asked whether the simulated Arm course can support
this as well as the RISC-V course that compiles and runs programs. Work here concerns Arm only.
Use its actual controls and qualify teaching models. Do not imply that a diagram is a native run.

Observable outcome: given an unfamiliar value and a stated width, explain what the tool accepts,
what bits remain, and what evidence distinguishes rejected input from a computed result.
Later applications ask which bits a shift loses and why the changed loop branch repeats.

The local learning-design skill, CLAUDE.md, authoring guide and style closing passes govern this
work. Separate copy was drafted by bidirectional_counter_copy; technical and learner agents are
independent of the implementation and drafting sessions. No novice study is claimed.

## Preparation and sequence

The preceding Reading the bits lessons introduce binary place values, signed and unsigned readings.
The four-bit lesson follows those, before instruction arithmetic. Add one storage experiment before
addition/carry, retaining all existing section, challenge and saved-work identities.

1. Predict what remains from decimal100 at four kept bits; reveal computed upper/low positions.
2. Inspect original place weights, Value removed and Kept value; relate them to full groups of16.
3. Try14/15/16 at four bits; then100 at eight bits. Explain which limit changed.
4. Existing addition/carry/subtraction figures continue unchanged.

The later shifts lesson already teaches lsl. Its live input accepts all three proposed words;
lsl1 loses the high bit while the invalid33-bit input is rejected. The upward-loop lesson already
teaches branch conditions and body counts. Its changedBEQ gets one additional prepared one-step
interval, leaving the existing assessment and prediction gate unchanged.

## Checked facts and implementation

The storage view accepts decimal0–255, a named tool limit, and keeps4 or8 bits within a real32-bit
AND calculation. It is a storage projection, not an immediate assembler input or an invented Arm
register. Decimal100 is1100100; keeping four bits gives0100=4 and removes96 (weights64+32).
Its discarded prefix reads6 groups of16, not a removed value of6. At eight bits100 fits unchanged.
This activity introduces no flag. The actual32-bit calculation holds100.

The operation executes supported A64 masking in the simulator. Both entrypoints and all authored
inputs are in the GNU/QEMU differential corpus. An exhaustive512-case independent modulo/place
oracle checks every accepted input at both widths. The local subtraction boundary view separately
states4-bit unsigned0–15 and distinguishes actual32-bit instruction width.

Shifts: lsl1 of0x7fffffff/0x80000000/0x80000001 gives0xfffffffe/0/2. These are all valid32-bit
inputs; 0x100000000 is rejected. The figure updates automatically and has no Run control.
Loop: dim_up(128,4,5) with originalBNE performs one body/returns64; brokenBEQ performs two/returns32.
The figure displays completed bars together after the original prediction; selecting a call changes
its brightness history. It is not an instruction stepper. All new native cases are in the corpus.

## Misconceptions and evidence

- “100 cannot be used because the result keeps four bits”: full input accepts it; output is4.
- “Discarded110 means subtract6”: original place weights and Value removed show96; groups show6×16.
- “A rejected value wrapped to zero”: invalid input has no result;16→0 is a valid storage trial.
- “Wider reading changes the same bits”: Kept width changes the projection, not decimal interpretation.
- “An incorrect guess is an execution error”: prediction feedback is separate from source validation.
- “The changedBEQ always ends after one body”: the second prepared interval supplies a counterexample.

These are design hypotheses informed by the user's questions, not measured learner outcomes.

## Course audit and choice

Source-level audit inspected actual published LESSONS as well as grouped source lessons. Existing
flag, negation, comparison, loop, product, array, string, division and C lessons already include
purposeful limits and explicit contracts. Retain those. Only three gaps receive new activities:
early storage widths, shift output/input distinction, and the broken-loop one-step contrast.
The byte-store/C-shift suggestions from planning are alternatives, not missing requirements;
existing transfer-width and repeated-shift activities already teach their central boundary.
Do not add presets that disclose fresh assessment answers, unsafe array reads, or UI-free instructions.

Authoring guidance now records this selection rule. Reviews and final validation are recorded
separately below/in adjacent evidence notes; passing tests cannot establish novice understanding.
