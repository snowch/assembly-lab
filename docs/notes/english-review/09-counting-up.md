<!-- Copyright © 2026 Christopher Snow -->

# English review: Counting up

Scope: Module 5, lesson 1, `counting-up`. Review only; no course changes. Read against `CLAUDE.md` and `docs/style.md`, as a learner who has completed the preceding nine lessons and none after this one. Severity: low means a local comprehension obstacle; medium means a material risk of misunderstanding the task or mechanism; high means the explanation or task is unusable.

## Finding

1. **Low — unexplained technical noun.** Exact quote: “The simulator limits how many instructions it runs in one trace. Reaching that limit means the trace stopped; it does not establish whether the program would eventually return.” Source: `content/lessons/counting-up.prose.ts:74`.
   - **Effect:** “trace” first appears here as a countable technical object, without explaining whether it means a recorded sequence of executed instructions, the whole function run, or a displayed diagram. That distinction matters to the sentence's claim that stopping a trace need not mean the function returns.
   - **Direction:** Explain what a trace contains and how it relates to the program run at its first noun use, or use the already established vocabulary of runs and executed instructions.
   - **Earlier-definition check:** The preceding lesson prose does not define the noun. `content/lessons/meet-the-machine.labels.ts:43` says “The five instructions GCC made for km_to_service, and the call to trace.” This is a verb describing an activity, not a definition of the bounded object meant here. Source identifiers such as `traceTask` do not reach the learner. No later lesson was used to supply the missing definition.

## Prerequisites checked

Read the front page's “Before you start” (`apps/course/src/strings.ts`) and all preceding lesson prose, including closed notes, in course order: Meet the machine; One pattern, three readings; Constants and widths; Adding and the flags; Subtracting and the tick counter; Masks; Shifts; Compare and choose; Branches.

The front page explicitly allows small C functions with `unsigned`, returns and `for`/`while` loops. This lesson explains `>>=` and `tick++`, so those are not hidden C requirements. Its definitions of loop, body and iteration occur before the exercises.

Earlier teaching supports the other technical vocabulary used here:

- Module 0 defines GCC, listing, instruction, register, operands, stepping and returning a result in `w0`; its compiler note explains `-O1`.
- Module 1 explains hexadecimal, signed/unsigned readings and the width of `w` names; Constants and widths explains optional `#`.
- Subtracting and the tick counter explicitly defines tick and wrap (`:11`).
- Shifts explains `lsr` and unsigned halving with a discarded remainder (`:35`).
- Compare and choose explains `cmp`, equality/inequality and unsigned `cs`/`cc` conditions (`:42`, `:93–103`).
- Branches defines labels, branches and taken/not-taken (`:23–27`), explains GCC/Arm conditional-branch spellings (`:39`), and gives label-writing conventions in its construction task.

The only unsupported assumed term found is the noun “trace” above. “Endpoints”, including the descending case, is made concrete by `start`, `end`, and the explicit at-or-above rule; no separate finding warranted.

## Coverage and browser evidence

Read all ten sections, objectives, captions, run selectors, listing text, both predictions and their explanations, both closed notes, construction and final tasks, all five hints for each challenge, final feedback, generic failed-test feedback, and the model-versus-reality note. Checked lesson structure and listed instruction spellings in `counting-up.ts`, `loops.listings.ts`, and `counting-up.labels.ts`. Also read relevant shared strings in `packages/views/src/strings.ts`, `strings.loop.ts`, `strings.branch.ts`, and runtime strings. No answers are reproduced in this review.

Used the existing built site at `http://localhost:4220/assembly-lab/#/lesson/counting-up` in Chromium, at 1280 × 900 and 375 × 900, with light and dark colour schemes. In each of the four configurations, opened details, committed both predictions to expose the explanations and figures, opened all ten hints, and ran the starting construction and deliberately incorrect final fields to expose feedback. Captured the rendered page text and screenshots. No horizontal overflow occurred in these states; no width- or theme-dependent English ambiguity was found.

Evidence files (temporary, reviewer-owned): `/tmp/english09.mjs`, `/tmp/english09-{1280,375}-{light,dark}.txt`, and corresponding `.png` screenshots. Source inspection also covers limit-related strings that the supplied short runs do not reach. No build or full test suite was run.
