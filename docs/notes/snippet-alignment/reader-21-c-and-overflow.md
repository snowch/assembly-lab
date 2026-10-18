# Reader review: lesson 21, C overflow and machine results

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026 as a learner who knows Before you start and lessons 00–20 only. Read `CLAUDE.md`, both passes in `docs/style.md`, and the snippet-alignment brief. Browser work used the immutable preview at `http://127.0.0.1:4266/assembly-lab/#/lesson/c-and-overflow`, Chromium through Node Playwright, at 1280 × 900 and 375 × 900 in both light and dark themes. No lesson code or tests were changed.

## Findings

No new snippet-alignment or prerequisite finding was confirmed. Severity: none. Direction: retain the distinctions and explanations described below. This is a focused learner review, not an independent verification of the recorded compiler output.

- **Optimised C and assembly remain understandable.** “Why does the recorded compiler output return true without performing an addition?” is answered by the following explanation of defined signed inputs. The original `return distance + 1 > distance;` is paired with the ordinary compilation's constant-result instruction and return. The wrapping compilation pairs the same source expression with its comparison sequence. The prose explicitly says the compiler can compare the original input with the limit “instead of literally adding one.” The pairing therefore does not claim the source expression executes operation by operation.
- **Compiler records are distinct from the teaching association.** “Compiler's C line references” opens a separate record with the explanation, “They may point to a brace instead of the C operation an instruction carries out.” The ordinary listing preserves its original references to line 4, while the teaching pair uses the return expression on line 3. The wrapping stepper highlights line 3 throughout its four instructions, including the return, without highlighting the closing brace.
- **Full source and repeated excerpts are distinguishable.** The final gated listing exposes “Complete C source”, followed by “The instructions stay in their original order. A C line appears again when later instructions also relate to it.” Its complete source retains the header, declaration, braces and both return paths. The excerpts retain branch order and labels.
- **The shared-return explanation addresses the multi-source case.** “The instruction may combine their operations or serve different paths through the function. Highlighting these statements does not mean they all run at that step.” This appears before the final listing's paired excerpts and makes its shared return association intelligible. This figure is static; I make no claim to have stepped or observed highlights within it.
- **Phone wrapping preserves each pair.** The longer C expression wraps inside its source block, with the associated instructions immediately below. Labels, line numbers and return-control notes remain readable. The comparison retains distinct ordinary and wrapping headings; its changed instructions remain marked in both themes, while the common return is unmarked.
- **Current pair and Next are visible together.** In the wrapping stepper at 375 × 900, the complete active pair occupied approximately y=71–351 and Next y=428–472 in the recorded run. The listing container itself began above the viewport, but the relevant pair did not. All four steps and Reset followed by Next kept the source expression, current instruction and control visible. The desktop run also kept the pair and Next together. No occurrence of the coordinator's known residual R08 was observed in these lesson-specific interactions.

## Gates and actual checks

Each of the four fresh browser contexts began with both steppers gated. Selected a prediction option and used the ordinary “Check your prediction” button for each prediction; no progress seed or DOM reveal bypass was used. Stepped both experiments through their returns, then used Reset and Next. The direct machine experiment remained assembly-only, without an invented C association.

The final listing initially said, “Pass the challenge above first. The figure opens once you have passed it.” To inspect that listing, entered the repository's supplied final reference through the challenge editor and pressed Run tests. The listing then appeared. The reference and exercise answer are intentionally not reproduced here. Did not solve the first construction challenge or exhaust unrelated error/hint flows.

Opened the introductory and final listings' compiler-reference details in all four combinations. Inspected the comparison markings, complete final C source, repeated excerpts and new multi-source explanation. Captured actual viewport screenshots after every step, in addition to element screenshots for full static figures. Document scroll width equalled 1280 or 375 respectively in all contexts; no page errors were recorded. No full test suite was run.

All browser checks above used 4266. The subsequently announced 4267 geometry build was not needed to resolve a finding here and was not reviewed.

## Assumed knowledge

No newly unexplained assumption was confirmed. Before you start includes `int`, `unsigned`, `return`, and `if`/`else`. Branch labels and a shared return have appeared earlier; the branches lesson explicitly says, “Both paths end at the one `ret` under `.L7`.” Lesson 19 explains, “The C source specifies the result for each defined input, not one mandatory instruction sequence.” Those prerequisites support the new source relationships without requiring later lessons.

This lesson explains the compiler/C23 settings in its compiler note, introduces `<limits.h>` and its bounds in the motivation, defines undefined behaviour, explains the scope of `-fwrapv`, and explains the additional settings used to retain the final branch. The new multi-source note uses already taught statements, instructions and paths. No additional compiler-debugging knowledge is required to use the optional original references.

## Prior review and evidence

The earlier `docs/notes/clarity-review-2/21-c-and-overflow.md` records no retained chapter finding. No old clarity finding is relabelled as new here. The shared R08 warning was treated separately and not counted as a new issue.

Reproduction script: `/tmp/snippet21-review.mjs`. Browser logs: `/tmp/snippet21-4266-{1280,375}-{light,dark}.json`. Logs and final-listing screenshots contain legitimately revealed exercise material and should remain review evidence rather than learner-facing examples.

Screenshots inspected include:

- `/tmp/snippet21-4266-375-light-intro.png`: wrapped original source and constant-result pairing.
- `/tmp/snippet21-4266-1280-light-compare-increment-options.png` and `/tmp/snippet21-4266-375-light-compare-increment-options.png`: comparison order and differing instruction marks.
- `/tmp/snippet21-4266-375-dark-raw.png`: original brace references and their explanation.
- `/tmp/snippet21-4266-1280-light-step-wrap-increment-step1-viewport.png` and `/tmp/snippet21-4266-1280-dark-step-wrap-increment-step3-viewport.png`: desktop current pair with Next.
- `/tmp/snippet21-4266-375-light-step-wrap-increment-step1-viewport.png`, `/tmp/snippet21-4266-375-light-step-wrap-increment-reset-next-viewport.png`, and `/tmp/snippet21-4266-375-dark-step-wrap-increment-step4-viewport.png`: actual phone viewport after stepping and reset.
- `/tmp/snippet21-4266-1280-light-safe.png` and `/tmp/snippet21-4266-375-dark-safe.png`: complete source, repeated excerpts and multi-source explanation after the legitimate challenge gate.
