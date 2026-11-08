# Independent learner review: Arithmetic on register bits

Copyright © 2026 Christopher Snow

Reviewed 8 November 2026 by a separate GPT-6.1 Sol learner-review session at High effort, spawned with no inherited conversation, following the authoring recommendations. The reviewer made no lesson implementation edits. The actual git diff, lesson structure, prerequisite copy and review rules were read before the author's written brief or draft. Scope was the removal of the standalone C arithmetic rules section and its joins, including the small result-copy changes and relocated term introductions.

## Verdict

No learner-facing defect found in this change. Removing the section reduces the conceptual burden: the page now follows the concrete trip comparison into a decision about its required return behaviour. It does not ask the learner to understand signed arithmetic outside its range or undefined behaviour to interpret this call.

The change does more than remove a heading. The earlier section's bounds, signed-overflow definition, undefined-behaviour qualification and forward reference are absent from the rendered lesson. The remaining result says “This negative result fits int.” The unsigned result defines the term at the concrete case: “The unsigned subtraction wraps: it keeps the low result bits and reads them as an unsigned value. C defines this behaviour.” The learner retains both the mechanism and the distinction between a defined C result and a useful trip distance.

“Decide what the function should return when the trip exceeds its plan” now starts the closing section, immediately before a question that changes the required return behaviour. “Changing the types alone does not add a check” connects the observed comparison to that application. The closing question asks for a decision the comparison did not already answer. Its reasoning remains behind the initially closed “Check your reasoning” disclosure. No challenge answer is reproduced in this review.

## Prerequisite and preparation check

No newly unsupported assumed knowledge was found. Required knowledge and its source were checked explicitly:

- Small C functions with `int`, `unsigned`, arguments, `return`, `if` and `else` are in the front page's “Before you start” panel.
- Registers, AArch64, operands, `w0`, caller, arguments, GCC, listings, `-O1`, subtraction operand order and `ret` are explained in Module 0's Fundamentals prose. The optional compiler note on this page also explains `-O1` and `-g`.
- Hexadecimal, signed and unsigned positional weights, the highest bit and unchanged stored bits are defined before this lesson. The preceding readings lesson demonstrates the small patterns and 32-bit bridge, then checks fresh readings and construction.
- The immediately preceding four-bit arithmetic lesson defines inversion and the opposite-pattern subtraction procedure, demonstrates the same starting subtraction, and provides a fresh practice. Its explicit next-width bridge prepares the present 32-bit calculation. The current worked subtraction still displays the wider mechanism and links back to the smaller example.
- This page states the 32-bit C type readings and that `unsigned` abbreviates `unsigned int`. It locally defines wrap when the unsigned returned value makes that word useful. Its displayed signed contributions and negative-fit statement are sufficient for this call; removing general signed bounds does not leave its interpretation dependent on a missing rule.

Definitions, demonstration and practice remain distinct. The earlier pages supply smaller complete examples and practice; this page applies those mechanics to independently called C functions and asks a new practical return-rule question. Another small widget or a second arithmetic exercise would repeat preparation already supplied. This is a reviewer judgement about preparation, not evidence from a beginner study.

## Built-site browser checks

Used the production preview at `http://localhost:4524/assembly-lab/`, after the build completed. Chromium/Playwright drove a fresh browser context for each of 375 × 900 and 1280 × 900, in both light and dark. The actual `html[data-theme]` matched each requested theme. Initial full-page captures, returned-value/weight captures and closing-section captures were visually inspected in both widths and themes. The scratch script and captures are in `/workspace/scratch/arithmetic-focus-learner/` and are not committed course assets.

The following checks passed in all four combinations:

- Initial: two sections; complete C sources and labelled independent starting arguments; instructions/results absent; Run comparison disabled; closing reasoning disclosure closed. The rendered article contains neither the deleted section nor overflow/undefined-behaviour terminology.
- Committed prediction: both paired assembly listings appear, while return results remain absent. Run comparison becomes available.
- Run: one shared returned-bit view; separate signed and unsigned C readings; both current typed values agree with the model attributes and displayed cards. The signed negative-fit statement, local wrap explanation and “There is no automatic overrun warning” remain visible. The subtraction work, contribution table and both contribution sums remain present and readable.
- Restored after reload: the committed prediction, paired listings and both model return readings return together.
- Reset comparison: returned bits, readings, arithmetic work and explanation disappear; the committed paired listings stay visible and Run comparison is enabled again.
- Closing disclosure: starts closed and can be opened to inspect the reasoning. The practical contract remains directly above its question.

Measured document widths were 375/375 and 1280/1280 pixels (client/scroll), with no page overflow. No browser console or page errors were recorded. The phone contribution table's numeric entries and stacked sums were legible in the inspected captures.

## Source-only checks and limits

Read the term-home changes and their destination prose. Module 2's addition sequence already defines signed overflow with its signed-range explanation; its metadata now introduces that term. Module 8's multiplication motivation already explains undefined behaviour for an unrepresentable signed product before its following activities; its metadata now introduces that term. These checks concern the meaningful definitions, not just matching term lists.

Read Module 11's `c-and-overflow.prose.ts` and its canonical `docs/notes/module-11/prose.md`: the detailed signed-C rules, compiler comparison and checks before arithmetic remain there. Module 11 was not browser-tested in this review. Prerequisites were read in source, not replayed to completion in this review.

This focused review did not run the full repository check, QEMU differential check, screen-reader testing, a beginner observation or a whole-course term audit. The managing session records automated suite results separately. Browser state checks here used the matching prediction; the alternate prediction path was outside this focused pass.
