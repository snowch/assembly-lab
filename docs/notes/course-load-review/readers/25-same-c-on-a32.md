# Reader 25: The same C on 32-bit Arm

- Lesson: `same-c-on-a32`, optional A (registry module 13), course order 25 (zero based).
- Reviewed built commit: `f1fdf35`, at `http://localhost:4210/assembly-lab/#/lesson/same-c-on-a32`.
- Scope: all ten sections, compiler-target and saved-register disclosures, simulator notes, recorded listing pairs, both prediction types, both exercises and both A64 steppers. Read `same-c-on-a32.ts`, `.prose.ts`, recorded listings, `ListingPairFigure.tsx` and `RecordedPrediction.tsx`; inspected shared rendering through the built page.

## Prerequisites and novelty

The learner has completed orders 0–24 in `/tmp/course-load-review/lessons.json`: unsigned comparison and conditional selection, flags, constants and immediate operands, division, calls/link register, stack preservation/alignment, compiler configuration and native debugging. The leaf-function definition is explicitly present in `calls-and-returns.prose.ts`. The familiar computations here therefore do not introduce several unpractised mechanisms simultaneously.

New material is target transfer: execution state and A32; its independent 32-bit register names and calling convention; condition suffixes on moves; target-specific constant forms; and a helper call when the selected target does not assume hardware division. A32 stack-list syntax, program counter return and 8-byte alignment arrive in an optional disclosure. Compiler-target flags are explained in the target disclosure. I found no essential prerequisite gap that blocks the first task. The first prediction asks for a familiar C result, before requiring interpretation of the new conditional syntax. That is reasonable synthesis, although it provides only limited practice of the new A32 rule.

## Confirmed finding

### Medium: record-reading exercises separate the evidence from the answer fields

Exact directions: “Read the instruction names directly from the A32 record” and “Read the service-marker and average listings, then run the A64 average”. Neither exercise repeats or links directly to its required records. The intervening investigation repeats only the A64 listing, while the first exercise requires the A32 listing near the lesson start.

Reproduction: fresh 375px context, expand the two target disclosures, commit the first prediction, step the limit investigation once, then reach “Read the A32 instruction names”. Its viewport contains the A64 state and exercise introduction, with no A32 record. In this representative state the first record starts at document y=1732 and its first answer field at y=6137. At 1280px these positions are y=1163 and y=4340. These are measured document positions for this state, not a general claim about all user states. The final exercise likewise requires a marker record well above the average stepper and answer fields (phone record y=8586, first final field y=12090).

Competing tasks: remember which architecture/record supplies each token, retain unfamiliar spelling while moving several screens, and distinguish token names from operands. This is avoidable reference tracking, rather than excessive conceptual novelty or merely a long page. Short answers make it possible, but the activity explicitly trains accurate reading of unfamiliar syntax, for which the evidence should remain readily accessible.

Smallest direction: provide the relevant compact recorded excerpt beside each token-reading exercise, or a labelled local reference disclosure/link with an easy return to the fields. Preserve the complete original paired listings for comparison. Do not add more explanation or require memorisation of A32 spellings.

Evidence: `/tmp/course-load-review/same-c-on-a32-375-light-construction.png`; corresponding desktop/dark viewport captures and `same-c-on-a32-post.log` record the same separation.

## Strengths to retain

- “Reuse the mechanism, check the syntax” accurately frames this optional lesson. Three very small familiar functions isolate target differences without asking the learner to build a second machine model.
- The course distinguishes static A32 evidence from live A64 execution repeatedly and locally: “Step through the A64 version; the A32 record remains static.” This prevents an additional tracking ambiguity.
- The conditional-rule explanation handles equality explicitly. The contrast with familiar A64 selection is useful synthesis, not an unjustified demand to learn comparison, carry and selection together.
- The helper-call explanation separates instruction and function name. Detailed save/restore syntax is available without becoming a prerequisite to the token-reading task.
- Prediction gates worked: the limit stepper initially showed “Check your prediction above first”; committing an incorrect prediction opened it and produced feedback. Teaching the familiar C rule before applying it is not an answer-leak finding.
- Actual light/dark rendering was legible; no page-level horizontal overflow at 375 or 1280. Architecture panes stack on phones, while each C/instruction pair retains its contained horizontal listing.

## Recommendations and limits

No high-severity novelty-overload finding. Keep the sequence; first improve reference access at the exercises. A stronger future transfer task could test explanation of a target difference, but that is a design option, not evidence that current retrieval practice is overloaded.

Browser coverage: four independent fresh contexts (375/1280 × light/dark), initial full-page captures and representative interacted captures in every context. Actual body backgrounds were light `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`. Opened compiler-target, saved-register and model-versus-hardware disclosures; submitted an incorrect first prediction; stepped the unlocked limit once; committed the syntax prediction; ran the first exercise with empty fields and opened its first hint; stepped the average once. Captured construction viewport and measured record/field positions in all four contexts. Artifacts use `/tmp/course-load-review/same-c-on-a32-*`.

Did not solve either challenge, open later hints/reference answers in the browser, exhaustively step both functions, exercise reset/back or alternate inputs, call external compiler services, rebuild, or edit the application. Challenge definitions and hint progression were read in source only. The first interaction script timed out on an incorrect heading locator after capturing the phone post-state; the corrected text locator completed all four contexts. No production changes.
