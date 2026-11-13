# Optional flag logic view: checked facts and scope

User approved a collapsed logic-component view based on Bit Lab, beneath the existing four-bit flag examples. User also asked why V uses the carry signals, apparently mistaking its XOR gate for NAND. Goal: connect the already-taught flag behaviour to visible signal paths, without adding required reading or another independent experiment.

## Sources checked

- Assembly Lab `flags-lesson/model.ts` calls the existing `fourBitFlags`/`fourBitAddition` model and reads its actual addition columns. Every column exposes bit, a, b, carryIn, total, kept, carryOut. Four-bit flags use top.kept, zero retained result, top.carryOut and unequal top carries. The 32-bit path uses the recorded addition trace.
- `arith.ts` reads column values and carries directly from the simulator record.
- Bit Lab commit `659ec31dd8e52b8a067c6acbf15cce841f47f004`, `apps/course/src/AluCircuit.tsx`, draws four full-adder blocks, carry wires, a top-result-bit tap for N, an XOR of top carries for V and a NOR of retained bits for Z. Its broader ALU also supports subtraction, logic and shifts; those are outside this addition-only view.
- Both repositories are Christopher Snow's course projects. Bit Lab source copyright and all-rights-reserved notice were inspected; preserve the author notice and record provenance for the user-requested adaptation. Do not copy Bit Lab's separate model or lab state into Assembly Lab.

## Learner and mechanism

The learner has earlier four-bit arithmetic, signed/unsigned readings, and this page's definitions of flags, N/Z, C/V, and signed range checks. Logic gates are optional new background: define each new abbreviation at first use within the disclosure. The required lesson remains understandable with the disclosure closed.

The disclosure stays in section04, directly under the selected comparison example. It replaces/consolidates the existing optional carry-background note rather than adding a second competing explanation. Its model is exactly the selected comparison model, including after switching examples or restoring that selection. The open/closed native disclosure and keyboard focus must survive a change of example. The new view does not change grading, store format, practice state or any later answer gate.

The diagram shows four columns (bit3 left through bit0 right). Each full adder adds its two input bits and incoming carry, producing a retained result bit and an outgoing carry. The initial incoming carry for this addition is zero. Carry travels toward the next more significant column. Display A/B/R mapping near the drawing. Do not make its read-only bit cells look like another editable experiment.

- N copies retained bit3 in this four-bit illustration.
- Z is1 exactly when all retained bits are0. A NOR gate tests this all-zero condition.
- C copies carry out of bit3, for this addition.
- V is1 exactly when carry into bit3 differs from carry out. XOR outputs1 for different inputs and0 for matching inputs.
- The signed-overflow equivalence: two inputs with the same sign yield a retained result with the opposite sign exactly when their mathematical signed sum is outside the signed range. For binary addition this is equivalent to unequal top carries. The model's complete four-bit input space can check both definitions.
- NAND is not the V rule: when both carries are0, V is0 while NAND would be1. Clarify this in the user's answer; add course wording only if useful after independent drafting/review.

Explain that this is a simplified four-bit logic model, not an actual Arm implementation, and that the page's real instruction keeps32 bits. Actual processors may compute carries differently; the drawing explains the arithmetic relationship and flag logic, not circuit timing or physical layout.

Use visible0/1 labels in addition to colour, strong connections with junction dots, a legible XOR symbol/label and a labelled zero detector. Preserve input/result identity, responsive phone/tablet/desktop layout, actual light/dark rendering and native keyboard disclosure. The optional link to Bit Lab remains available. All numeric signal values come from the course model; no screenshot or manually scripted signal state.

## Review and verification

Independent drafting of learner strings required by CLAUDE.md. Then independent learner and technical built-site review of this one lesson, including closed/open disclosure, every example, reload, phone/tablet/desktop and both actual themes. Verify no answer gate leakage. Exhaustively compare the visible four-bit signals/flags with the model and signed-range definition. Preserve all existing test assertions; run focused and full checks, exact-head CI, then merge and public verification under the user's standing merge instruction. Record failures, interrupted runs, skips and negative controls separately from passes.
