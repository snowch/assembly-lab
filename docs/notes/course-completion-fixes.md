# Course completion: review findings and decisions

This record connects the independent reviews to the final changes. The first-pass
reader reports remain unchanged so their original evidence and limitations are
visible. Module 7–11 and optional A each have a report for every lesson. The final page-check reports for [Modules 0 and 7–9](course-final-page-check-7-9.md)
and [Modules 10–11 and optional A](course-final-page-check-10-a.md) cover the
resulting built pages, not just these notes.

## Medium findings

| Finding | Decision and correction |
| --- | --- |
| Module 7 introduces `+=` without explanation. | Accepted. Explain the operator before the recorded C loop. The compiler record is unchanged. |
| Module 8 uses undefined behaviour before explaining its consequences. | Accepted. Define it at the first use in the products lesson, before the division lesson relies on it. |
| Module 8's consumption exercise does not detect omitted divisor zero-extension. | Accepted. Seed nonzero upper x1 bits while retaining the stated w1 input. A regression rejects the omitted instruction; the full-width case is also in the QEMU corpus. |
| Module 9's caption reveals the call failure before prediction. | Accepted. Replace it with a neutral description of what to inspect. |
| Module 9's numeric x30 value cannot be connected to a displayed instruction. | Accepted. Resolve the actual address to its next instruction, or identify a return outside the listing. |
| Module 9 assigns saved brightness to the wrong recursive frame. | Accepted. Distinguish a function's saved incoming x19 from its current w19 brightness and the next callee's saved copy. |
| Module 9's byte diagram does not identify saved values. | Accepted. Group and label actual stores, retaining every byte and removing stale annotations after partial overwrites. Call ordinals come from executed calls. |
| Module 10's statement controls obscure replacement and do not load the selection. | Accepted. Load fully supported selected statements, explain unsupported lines without guessing, preview the replacement and identify the replacement action. |
| Module 10 reports instruction-budget exhaustion as a wrong result. | Accepted. Preserve the machine stop reason and use the existing specific diagnostic in the playground and grader. |
| Module 10's ordinary failure detail hides the concrete test values. | Accepted. Omit redundant detail so the platform shows input, actual and expected values. Keep specific compiler and runtime diagnostics. |
| Module 10's phone controls are too far from the next instruction and C line. | Accepted. Show the current next instruction, containing label and mapped C line beside the stepping controls. |
| Module 11 exposes its closing assembly solution beforehand. | Accepted. Move it after the exercise and show it only when the current saved work passes. A stored completion flag alone is insufficient. |
| Module 11 highlights an unchanged `ret` as different. | Accepted. Align common instructions for this comparison. Existing positional comparisons keep their behaviour. |
| Optional A labels static A32 compiler records as simulator execution. | Accepted. Remove the time model from static comparisons and record-only exercises. Keep it for actual A64 execution. The final checker found the same badge on Module 11 static comparisons; static listings throughout new Modules 7–11 now follow the same rule. |
| Optional A's front-page line promises execution on 32-bit Arm. | Accepted during integration review. Describe comparison of recorded compiler output. |

## Clarity and smaller findings

- Replace the introductory sentence questioned by the author with a direct account
  of translating C and following the resulting instructions. Apply the same wording
  to the canonical prose.
- Remove Module 7's redundant “memory value” sentence, name the capacity and
  terminator requirements directly, and avoid an unexplained early use of “caller”.
  Remove the string-prediction caption's explicit byte-count clue.
- Describe Module 8's signed division drawing in terms of size and signed values;
  replace unexplained timing jargon. Record remainder and low-half terminology at
  their actual earlier introductions.
- Simplify Module 9's ABI, guard-page and operating-system language where those
  details are unnecessary to the model limitation being explained.
- Correct Module 10's `movk` cross-reference to Module 1; explain the relevant
  printed instruction forms without assuming “alias” or “encoding”; state the
  maximum-count condition unambiguously.
- Explain Module 11's optional text-to-integer parser and `printf` convention at
  first use. Link the retained diagnostic sources and responses from the lesson.
  Correct the cited C draft division paragraph numbers to 6–7.
- Explain execution state and compiler target features in optional A.
- Give prose links 44-pixel touch targets on phones. The full browser suite found
  three diagnostic links below the course's minimum height; an independent check
  verified all four links, readable paragraph flow and unchanged desktop layout.
- Give the third hint a concrete smaller example and the final hint a complete
  worked solution throughout the new lessons. Keep the canonical prose in sync.
- Add a direct mixed C/assembly metadata regression and remove a stale comment
  about whether optional lessons exist. State the completion plan's reviews and
  validation as requirements rather than premature claims.

## Checked concerns and limits

- A32 simulation was not added. The optional chapter deliberately compares retained
  compiler output; its A64 counterparts are executable and in the QEMU corpus.
- The compiler's evaluator and A64 runner retain separate work limits. Different
  limits are valid; losing or misreporting the actual stop reason was the defect.
- Compiler Explorer remains optional and requires an explicit press after its
  disclosure. Local compilation and exercises work when the request fails.
- Caller preservation is checked across all 64 bits, including seeded upper bits.
  A required call must execute; the presence of unreachable `bl` text does not pass.
- The Module 7 layout test previously assumed the first instruction was a load.
  It now follows the trace to the first load before checking its transfer view.
  Its all-state checks still compare every displayed register and byte at every step.
- Module 11's common-instruction alignment is opt-in; it does not silently change
  the meaning of earlier positional comparisons.
- The platform copy remains unedited. Course-specific mapping, grading and views
  implement the additions within the existing platform contracts.

The independent technical recheck and final built-page checks record whether these
corrections work. The release validation record reports the complete checks and
any remaining limitation; this decision list alone is not evidence of a pass.
