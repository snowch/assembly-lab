# Independent learner review: redundant prompts

Reviewer: independent GPT-6.1 session, High effort, 28 October 2026. This session did not draft or edit product content. It read `AGENTS.md`, `CLAUDE.md`, `docs/authoring.md` and `docs/style.md`, then the actual prose of all 34 published lessons in course order, the lesson index, the Fundamentals rendering structure and the prerequisite material. It formed its assessment before reading the drafting notes or the managing session's audit. No product files were edited.

## Scope and judgement

The user identified standalone follow-up questions in *Subtraction and reuse*. The relevant distinction is between a repeated prompt that creates an extra section and a supported activity with a concrete task, model evidence, feedback or an answer. A question mark alone does not establish padding.

The initial pass identified six standalone Fundamentals sections as candidates. A closer comparison of each later closing question with the preceding explanation and just-completed challenge identified fourteen further repeated recaps in Modules 5–11. Having a closed Answer makes a prompt supported; it does not by itself give the prompt distinct work. Retain real predictions, exercise tasks, diagnostic hints, fresh-input closings and practical transfer tasks.

| Lesson and location | Quotation | Severity and learner effect | Direction |
| --- | --- | --- | --- |
| One addition, construction | “Read the result back through the instruction: which operand names the register that was written?” | Minor repetition. The prediction already identifies the destination, and the worked figure demonstrates it before the fresh-input challenge tests it. This section adds no new example, feedback or result. | Remove the standalone follow-up section. Keep the operand explanation, worked figure and challenge. |
| One addition, failure experiment | “Did either input register lose its value when the instruction read it?” | Minor repetition. The question has no separate changed program or activity. The adjacent explanation states the rule and the graded challenge checks it. Calling this an experiment makes an ordinary restatement look like another task. | Remove the standalone follow-up section. Keep the input-preservation explanation. |
| Subtraction and reuse, construction | “In the subtraction, which old value was read before being replaced?” | Minor repetition. The worked subtraction has already supplied the situation, the explanation gives read-before-write, and the final challenge changes inputs. | Remove the standalone follow-up section without losing the rule or practice. |
| Subtraction and reuse, failure experiment | “Would swapping the subtraction inputs give the same result?” | Minor repetition. There is no supplied swapped run or feedback attached to this question. Operand order is directly explained and used in the challenge. | Remove the standalone follow-up section; retain the subtraction-order rule. |
| Instructions in sequence, prediction | “Which register does the first instruction write? Which instruction will read that result?” | Minor repetition. This is a separate prose-only section before the figure, while motivation, the figure description and later explanation already identify the dependency. | Remove the repeated question section while preserving the introduction to carrying state forward. |
| Instructions in sequence, construction | “After the addition, pause. Which value will the subtraction read from `w2`?” | Minor repetition and misplaced instruction. It follows the section containing the stepper, so it can arrive after the learner has already completed both steps. | Remove the separate question. If an observation direction is needed, place it beside the stepper as part of its instructions. |

## Later closing questions: comparative assessment

The first pass provisionally retained these because each had a closed answer and a clear source in the lesson. That was too permissive for the user’s request. On rereading the question against its preceding explanation and challenge, none adds a fresh input, changed contract or new investigation. All are minor repetition; remove the trailing question and its repeated answer, keeping the summary bullets. This judgement comes from the lesson text, not the drafting rationale.

| Lesson | Closing quotation | Evidence of repetition |
| --- | --- | --- |
| Counting up | “Why does GCC test for inequality at the bottom of `dim_up`, even though the C tests whether `tick` is below `end`?” | Explanation already gives the initial-test and counter-progression argument. |
| Counting down | “Why does `dim_until_dark` need its initial check for a zero tick count even though it also checks for zero brightness?” | The final task and hints already distinguish no requested work from no useful remaining work. |
| Memory and addresses | “Why does `strb w1, [x0]` need an `x` register even though it writes only one byte?” | Explanation directly distinguishes address-register width from transfer width. |
| Loading widths | “Why does `ldrsb w0, [x0]` produce a different full `x0` value from `ldrsb x0, [x0]` for a negative byte?” | Motivation and investigation explicitly separate extension to the chosen destination from clearing the upper half on a `w` write. |
| Array addresses | “Why does `p + 1` move by four bytes when `p` points to an `unsigned` on this target?” | Explanation directly teaches C pointer arithmetic in elements for this same type. |
| Zero-terminated strings | “Why is the capacity still necessary when a byte array is expected to contain text?” | Motivation and generalisation explicitly explain the missing-terminator case and readable-region boundary. |
| Products and widths | “Why must a C cast appear before a multiplication when its purpose is to preserve a wider result?” | Explanation directly contrasts conversion before multiplication with widening an already completed narrow result. |
| Division and remainders | “Why can an average be wrong even when its final value would fit in the return register?” | The challenge introduction states this same intermediate-product problem before the learner implements its solution. |
| Calls and returns | “Why is saving only `w19` insufficient when your function changes register 19?” | Investigation explicitly requires preserving every bit, including when the calculation uses a `w` view. The final challenge/hints repeat that preservation requirement. |
| Recursive calls | “Why can `lit_count` use less saved state than `fade_sum`?” | Generalisation already compares their needs for the original brightness and the return address. |
| From C to instructions | “Why can two compilers produce different assembly for this function without disagreeing about its result?” | Explanation and generalisation explicitly distinguish fixed patterns, optimiser transformations and preserved source behaviour. |
| Compile a loop | “Why can shifting right by one 32 times be valid C when shifting a 32-bit value right by 32 once is not?” | Generalisation explicitly contrasts these same repeated and single operations immediately before the challenge. |
| C and overflow | “Why can the ordinary compilation return true without adding, while the `-fwrapv` compilation needs to distinguish the maximum input?” | Motivation, investigation and the failure experiment already explain both compiler contracts. |
| Checked arithmetic | “How do C types affect machine code beyond choosing signed or unsigned instructions?” | The page has just taught conversions, promotions, mixed comparisons and checked-result contracts; the answer recaps these ideas. Retain its distinct optional formatting and run-time-check material, giving that material its own accurate detail title. |

The sequence prediction was initially a removal candidate. It has more potential value than the later “pause” question because it precedes the figure, but the actual motivation already states the dependency and the worked figure demonstrates it. Final judgement: removal preserves preparation. The sequence’s additional prose-only failure section, “Using the starting value of `w2` again would lose the addition’s result”, can also be removed because the explanation immediately supplies the same state-carrying rule. These are seven removed Fundamentals sections in total: two in addition, two in subtraction, and three in sequence.

## Coverage in prerequisite order

Each row was read as someone who has completed the preceding lessons, including the front page's stated C prerequisites. “Keep” means no additional removal candidate within this task's scope; it is not a new technical audit of every claim.

| Lesson | Assessment of prompts and preparation |
| --- | --- |
| One addition | Remove the two repeated standalone follow-ups above. Register, input, destination and simulator definitions precede the complete one-instruction demonstration and the fresh-input challenge. No smaller bridge is needed. |
| Adding a constant | Keep. Two complete examples distinguish a separate destination from input reuse before the changed-constant challenge. Directions operate the figures; they do not add an unsupported quiz. |
| A tiny function | Keep. One argument and two arguments are each demonstrated before the fresh-call challenge. The caller and return are introduced locally. |
| Returning to the caller | Keep. It defines the return-address mechanism, demonstrates the call/return/caller sequence and then changes the input. The optional reference detail is evidence, not padding. |
| Subtraction and reuse | Remove the two identified sections. Addition reuse is demonstrated before subtraction composes reuse with operand order. The smaller addition example and the subtraction figure provide the bridge; preserve both. |
| Instructions in sequence | Remove the prediction, construction and repeated prose-only failure section. The two-instruction figure is the smallest complete dependency example before the changed-input sequence challenge. Preserve the program-counter explanation and state-carrying rule. |
| Putting it together | Keep. This is the first synthesis of mechanisms already practised. Repair, removed-return prediction and trace tasks use distinct contracts. Targeted wrong-answer questions have feedback roles. |
| One pattern, three readings | Keep. Prediction and bit-editing tasks teach different operations. The closing new pattern has a closed answer. |
| Constants and widths | Keep. The fitting-constant prediction, construction, register-width experiment and closing new-register case have distinct inputs and support. |
| Adding and the flags | Keep. Predictions, flag entry and boundary challenge practise different consequences. The closing fresh addition has an answer. |
| Subtracting and the tick counter | Keep. Counter-wrap, borrow, negation and boundary tasks are supported by the ring/calculation examples. The closing readings are a fresh case with an answer. |
| Masks and fields | Keep. The field-planning prediction provides a useful bridge before composing masking, shifting and OR. The closing independent operations have explicit starting-state rules and an answer. |
| Shifts, and the type that picks one | Keep. Different rounding and operand-shift tasks are supported. The closing changed negative input has an answer. |
| Compare and choose | Keep. The comparison/condition/select demonstration prepares the composition. Diagnostic questions locate wrong solutions; the closing condition comparison has an answer. |
| Branches | Keep. Path prediction, construction, boundary change and fresh closing bit test do different work and have evidence or feedback. |
| Counting up | Remove its repeated closing question/answer. Preserve the initial guard and progression explanation, all loop activities and summary bullets. |
| Counting down | Remove its repeated closing question/answer. Preserve both stopping conditions and their supported composition in the final exercise. |
| Memory and addresses | Remove its repeated closing question/answer. Preserve the explicit address-width/transfer-width distinction and the store/copy activities. |
| Loading widths | Remove its repeated closing question/answer. Preserve the explanation of extension, destination width and mixed-field composition. |
| Array addresses | Remove its repeated closing question/answer. Preserve the pointer-arithmetic explanation, complete addressing examples and array-loop practice. |
| Zero-terminated strings | Remove its repeated closing question/answer. Preserve the missing-terminator and valid-capacity explanation before the bounded scan. |
| Products and widths | Remove its repeated closing question/answer. Preserve the conversion-before-operation explanation and the widening demonstrations. |
| Division and remainders | Remove its repeated closing question/answer. Preserve the wide-intermediate preparation and the scaled-division challenge. |
| Calls and returns | Remove its repeated closing question/answer. Preserve the small relay example, full-register convention and saved-value composition. |
| Recursive calls | Remove its repeated closing question/answer. Preserve the explicit comparison of the two recursive functions’ saved-state needs. |
| From C to instructions | Remove its repeated closing question/answer. Preserve compiler editing, equivalent assembly and the capped calculation. |
| Compile a loop | Remove its repeated closing question/answer. Preserve the repeated-shift versus invalid single-count distinction before its challenge. |
| C and overflow | Remove its repeated closing question/answer. Preserve the two compiler contracts and the distinction between assembly and C behaviour. |
| Checked arithmetic | Remove its repeated closing question and recap answer paragraph. Preserve the distinct optional formatting/sanitizer detail under an accurate title. |
| From function to executable | Keep. The closing rebuild question has practical transfer to the source/object/executable chain and an answer. |
| Debug native instructions | Keep. The closing porting question is grounded in the inspected loading/startup/device path and has an answer. |
| Raspberry Pi 5 | Keep. The closing asks learners to compare supplied files and identify board responsibilities. It is an actionable transfer activity tied to the port, rather than a second arithmetic quiz. |
| Booting the Pi 5 | Keep. The final observation questions direct the required hardware-test record and distinguish actual evidence from an expected message. Removing them would weaken the test's purpose. |
| The same C on A32 | Keep. Listing-reading exercises and the assembler experiment each have concrete checked outputs. The ending states a reading strategy instead of adding a follow-up quiz. |

## Assumed knowledge and scope limits

The removal candidates need only concepts already taught locally or in earlier Fundamentals lessons: operand order, reading without writing, destination reuse and using updated state in the next instruction. Their removal need not create a knowledge gap. Keep the complete examples, essential mechanism explanations and graded fresh-input practice.

No newly unexplained prerequisite was found that would be caused by these removals. This review does not claim a fresh whole-course terminology or technical-source audit. Later lessons were read for the requested redundancy distinction and preparation for their retained activities.

## Built-page verification

Checked the final frozen production preview at `http://localhost:4399/assembly-lab/` in Chromium, at desktop 1280 × 900 and phone 375 × 812, each in light and dark: 68 changed-lesson/viewport/theme combinations. All 17 changed lessons are covered: the three Fundamentals pages in the findings above and all fourteen Module 5–11 lessons in the comparative table.

- Visually inspected the 68 captured ending views in four contact sheets. The shorter pages retain their challenge or summary, ordinary lesson navigation and readable spacing. No empty removed-section headings or orphaned Answer disclosure remains.
- Confirmed the actual rendered theme using `html[data-theme]` and computed body backgrounds: light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`. No horizontal page overflow or JavaScript page error occurred in the 68 combinations.
- The built Fundamentals section counts are 7 for One addition, 7 for Subtraction and reuse, and 5 for Instructions in sequence. Ran every worked example on those pages, reloaded its completed state, then reset it. The sequence still runs both instructions and retains its preparation and fresh-input challenge.
- On each of the fourteen later changed pages, selected and committed the first prediction and reloaded it. On the twelve with a matching exposed ordinary stepper, executed its next instruction and reset it. The two compiler pages retain their compiler controls; this check did not exercise a compiler run.
- Submitted the initial challenge state on all seventeen pages in each combination. This checks that the preserved controls respond; reference-solution grading and all alternate solution paths were outside this review.
- Opened and closed Checked arithmetic’s retained **Formatting and run-time checks** disclosure in each combination. Its formatting and sanitizer material remains, under the corrected title.

Result: no learner-facing regression or remaining removal candidate found in the affected sections. No fix is required by this review.

Local review evidence: `/tmp/redundant-learner-browser/results.json`, four `sheet-*.png` contact sheets and the individual ending screenshots in the same directory. The harness is `/tmp/redundant-learner-browser.mjs`; its completed run log is `/tmp/redundant-learner-browser.log`.

All 34 lessons received the source/prerequisite review above. Only the seventeen changed lessons received this browser pass. No build, full suite, native execution or physical hardware test was run by this reviewer. Full-suite results belong to the managing session’s record, not this focused check.
