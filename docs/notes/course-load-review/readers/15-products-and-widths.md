# Products and their widths

Module 8; assigned review order 15 (zero-based inventory position; sixteenth lesson in the parsed registry). Lesson `products-and-widths`. Review of built commit f1fdf35, with no course changes.

## Prior knowledge and novelty

The earlier lessons already establish 32/64-bit register views, clearing the upper half on a `w` write, hexadecimal, signed versus unsigned interpretations, wrapping addition/subtraction, signed overflow qualifications, shifts, conditional execution/control flow, memory widths, extension, arrays and strings. In particular, **Loading different widths / Extend bits already in a register** explicitly teaches “A C **cast** requests a conversion”. Constants and widths introduces the target's 64-bit `long`; the introductory compiler disclosure explains `-O1`. These are available prerequisites rather than new obstacles here. No definite unexplained prerequisite was found in the reviewed material.

New mechanisms are multiplication's retained low bits; multiply-and-add and multiply-and-subtract operand roles; full 32-by-32 widening multiplication with signed/unsigned choice; conversion before multiplication; and obtaining the high half of a 64-by-64 product. “Product” and the bit ranges of both halves are defined locally.

The first prediction requires ordinary multiplication, low-bit truncation and a familiar `w0` destination. It follows a two-instruction example and an explicit rule. It does not demand simultaneous use of widening, multiply-add and high-half selection. The scaled-addition construction then applies familiar addition to a freshly demonstrated multiplication. This is an appropriately bounded first attempt, despite the later instruction family being sizeable.

## Confirmed finding

### Medium: two adjacent product views require tracking different execution moments without saying so

**Evidence:** In **Read both halves of a product**, both figures have the exact caption “Compare the high and low halves for the same input bits.” The first is labelled “STEPPED”, the second “DIAGRAM”. After committing the late-widening prediction, the stepper begins at step 0 with destination registers uncomputed, while the diagram already contains both completed products. At step 2 the status says “Ran `umulh x3, x0, x1`. Next: `smulh x4, x0, x1`.” The register view still has an initial `x4`, but the diagram's signed high half is already the eventual result. Reset returns the stepper to 0 while leaving that final diagram visible. This was reproduced at both widths and themes.

**Competing tasks:** A learner meeting high-half instructions must associate three destinations with two 128-bit products, distinguish signedness, and additionally infer that the adjacent matching-caption figure is a completed-run comparison independent of Next/Reset. On the phone the five-register state fills much of a screen, so comparing with the diagram also requires scrolling. The problem is the missing execution-moment relationship, not the number of registers or the presence of a useful second representation.

**Smallest direction:** Explicitly identify the diagram as the completed-run comparison and state its relationship to the independent stepper. Consider placing the comparison after the learner completes the three relevant instructions if a cue alone proves insufficient. Synchronising both views would be a larger option, not necessary to fix the immediate ambiguity.

**Evidence files:** `/tmp/course-load-review/products-and-widths-375-light-halves-middle.png`, `products-and-widths-1280-dark-halves-diagram.png`, and `products-and-widths-states.cjs`/its execution output. Source confirms the independence: `packages/views/src/interactives/ProductHalves.tsx` computes a complete trace once the prediction slot exists; `packages/views/src/products.ts` takes its halves from `trace.result.final.x`. `MemoryStepper.tsx` maintains its own local step index. This is no prediction-answer leak: the committed prediction uses a different example, and the high-half activity is an investigation.

## Design recommendations, not additional confirmed overload

- **Low-priority sequence refinement:** In **Preserve the full product**, the explanation moves from `umull`/`smull` and the cast to “`msub` combines multiplication and subtraction.” Three separate steppers then cover those mechanisms. The subtraction case interrupts the width/signedness progression before **Read both halves of a product**. Consider grouping `msub` with the earlier `madd` investigation or making it a clearly secondary extension after widening practice. The paragraph already explains operand roles and supplies a small example, so this is a coherence improvement, not evidence that a reasonable learner cannot proceed.
- The static **scaled_total** listing repeats the same paired listing immediately in its stepper. Consolidating those would reduce phone scrolling, but there is insufficient evidence to rank this as substantial overload. Keep the C/assembly relationship if consolidating.

## Treatments worth keeping

- The late-widening failure isolates a familiar `w` write before introducing full-width multiplication. It gives the wider instruction a concrete purpose and reuses prior register-view knowledge.
- Signed and unsigned widening examples use equivalent input bits with a simple scale. They separate interpretation from width rather than introducing unrelated arithmetic.
- The product-halves diagram labels both exact bit ranges and lays high and low halves beside each other; its repeated low half makes the invariant visible. Keep this representation while clarifying its execution moment.
- The first construction comes before the later widening family. The final challenge asks for the full unsigned product and does not require combining every new instruction. Seven multiplication mnemonics are not, by themselves, evidence of seven simultaneous unpractised demands.
- Prediction gates hold subsequent execution until a choice is committed; initial screenshots showed locked follow-up figures. Feedback and executable investigation then become available. No meaningful prediction was bypassed by an earlier figure in the states reviewed.

## Browser and source coverage; limits

Read all ten sections, normal compiler/width disclosure, reflection disclosure, model-versus-reality note, both challenge prompts/interfaces, and the relevant `MemoryPrediction`, `MemoryStepper`, `ProductHalves`, product computation and strings implementations. Prerequisite checks used only earlier entries in `/tmp/course-load-review/lessons.json`.

Fresh Chromium contexts at 375×900 and 1280×900 in each actual light/dark theme covered: initial full page; both prediction choices committed (one initial offered choice each, without attempting every option); every available stepper after its first instruction; normal disclosures opened; and the high-half stepper at initial, middle, completion and reset. Actual body backgrounds were light `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`. No document-wide horizontal overflow occurred in those contexts. Focused screenshots supplement full-page initial/stepped/disclosure captures under `/tmp/course-load-review/products-and-widths-*`.

Challenge editors were inspected initially but no solutions, submissions or answer hints were exercised. Alternative prediction feedback, editor failure/success states, persisted restoration, keyboard-only interaction and external compiler comparisons were not tested. No rebuild, compiler-service call or application edit was made. The note reports a bounded instructional/interface review, not a usability study or a technical revalidation of the ISA.
