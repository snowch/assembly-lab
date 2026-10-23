# Constants and widths: independent learning-load review

Module 1; third lesson in course order (review index 02; lesson-local `order: 1`). Snapshot: f1fdf35. Read all ten sections, both challenge definitions, the relevant Module 1 programs, and WideStepper, ConstantTester, ModelPrediction/PredictionBox and relevant assembly-editor implementation. No course changes made.

## Prior knowledge and new work

The entry panel assumes small C functions with `int`, `unsigned`, arguments and `return`, basic arithmetic, and binary/decimal conversion (`apps/course/src/strings.ts:33–46`). Only **Meet the machine** and **Same bits, two readings** precede this lesson in the supplied registry. They teach ordered operands and register overwriting; `ret` and the result in `w0`; editing assembly and testing it; stepping, backing up and resetting; prediction gates; 32-bit patterns, signed/unsigned readings, set/clear, hexadecimal digits and the `0x` prefix. GCC, `-O1`, and the compiler-versus-simulator distinction have been explained. The preceding lesson practises producing the all-set pattern and interpreting it both ways. Consequently hexadecimal and the negative constant here are applications, not independent new mechanisms.

Genuinely new: fixed constants loaded with `mov`; why one instruction cannot contain arbitrary constants; the sufficient one-half rule and assembler testing of exceptions; 16-bit partitioning and decimal quotient/remainder to find the halves; preserving one half with `movk` and selecting the upper half with `lsl 16`; `xN`/`wN` as overlapping views and clearing the upper 32 bits on a `w` write. `void`, `long`, and the unsigned `u` suffix exceed the entry C list but are explained locally before doing work. GNU assembler and assembling are also explained locally. I found no confirmed missing prerequisite needed for the first attempt.

## Overall judgment

No high-severity overload confirmed. This lesson contains two substantial mechanisms, but teaches and practises constant construction before introducing the wider register view. The first task is an application of an explicit sufficient rule to supplied hexadecimal representations; it does not ask the learner to invent an encoding rule or convert all the decimal options. The first writing exercise combines new half selection and decimal decomposition with already familiar editing, register writes and `ret`. That is the main demand peak, but an executable worked example directly precedes it.

The four-instruction final task is reasonable synthesis: two short independent register histories combine the mechanisms already encountered. Its instruction count alone is not evidence of overload.

## Confirmed findings

### Low: discovery of the upper-half clearing rule is presented like a recall test

Quote: “After `mov w3, -1`, what does `x3` hold?” (`constants-and-widths.prose.ts:60–66`). Before committing, the text defines overlapping names and tells the learner that the first instruction sets all 64 bits. It has not told them what a narrow write does to the upper half. All-set, cleared and unknown upper bits are offered as choices. Unlike Module 0's unfamiliar missing-`ret` experiment, this one has no explicit invitation to guess a new behaviour.

Reproduction: fresh lesson, scroll to “Two names, one register”; the drawing is locked and the clearing rule appears only after “Check your prediction.” I committed the all-set choice in every viewport/theme and then stepped the released figure twice. The feedback and drawing do resolve the question well. The obstacle is the learner simultaneously deciding whether this follows from the alias definition and whether they have forgotten a rule. It is a small expectation issue, not several untaught mechanisms required to solve an exercise.

Smallest direction: mark this as a discovery prediction, keeping the gate and the post-commit explanation. Do not move the answer ahead of the attempt.

### Low: the last exercise repeats the complete instruction sequence immediately above its listing

Quote: “The figure shows four instructions: …” (`constants-and-widths.prose.ts:78–80`), followed by “Work out by hand what x1 and w2 hold after the short listing” and the four-line listing in the challenge. On phone the prose wraps every instruction and introduces a second visual traversal before the readable assembly listing. The learner needs the sequence and the two requested final values, but not two copies of the sequence.

Reproduction: fresh lesson, “Four instructions”, at 375px; also present at 1280px. This adds local scanning/duplication, not conceptual novelty. Smallest direction: let the existing listing carry the sequence and retain the moment (“after all four”) in the task. No need to reduce the four operations or split the exercise.

## Design recommendations, not confirmed faults

The construction paragraph at `constants-and-widths.prose.ts:41–46` introduces `movk`, the `lsl 16` modifier, division by 65536/remainder, and optional `#` spelling before the worked figure. “Put 1000000 in w0 …” then requires decomposition, assembly composition and debugging together. There is sufficient teaching to attempt it, and the quotient/remainder example is concrete; I do not classify this as blocked or premature composition.

If learners stall here, the smallest useful change would be a non-graded decomposition checkpoint beside the worked halves, or moving the optional `#` note to the editor. This would diagnose number splitting separately from instruction syntax. It does not justify an extra lesson, teaching the complete constant encoding, or removing the existing worked program. The phrase “Other patterns that fit” is optional, so the exceptions do not have to occupy working memory during construction.

## Keep

- Keep the opening service function intact. It has only a constant write and return, and pairs the already familiar C/assembly views without exposing the construction exercise's solution.
- Keep the supplied hexadecimal splits in the first prediction and the careful word “guarantee”. The learner applies the sufficient rule, rather than mistaking it for an exhaustive encoding rule.
- Keep the tester gated behind that prediction, then allowing arbitrary numbers. I checked a refused two-half constant and an accepted repeated pattern; feedback distinguishes these without making the learner learn the full encoding catalogue.
- Keep the small `mov`/`movk` worked example with separate Next steps and “new”/“kept” labels. At 375px the two 16-bit halves stack cleanly; at 1280px they sit alongside each other. It externalises preservation rather than making the learner remember two intermediate numbers.
- Keep the nested `w3` label inside the 64-bit drawing and the explicit “cleared”/“written” labels after a narrow write. This successfully distinguishes two names from two independent stores. Colour is supplementary in both themes.
- Keep the successful-solution drawing hidden until the construction passes (source-confirmed gate), avoiding a second complete worked answer before the learner attempts the task.

## Browser evidence and limits

Own script: `/tmp/course-load-review/constants-and-widths-browser.cjs`; log of text, actual backgrounds and outcomes: `/tmp/course-load-review/constants-and-widths-browser.log`. Fresh Chromium contexts at 375×900 and 1280×900, each with light and dark preference. Actual body colours were `rgb(243, 246, 245)` and `rgb(16, 22, 21)` respectively; no page horizontal overflow in initial states.

In **all four contexts**: inspected initial lesson; committed the first prediction with a deliberately incorrect choice; entered 70000 and 65537 in the released tester; opened “Other patterns that fit”; advanced the worked `movk` figure through both writes; committed the width prediction with an incorrect choice; advanced the 64-bit figure through both writes and reset it; ran the invalid starting construction through Run tests; opened its first hint; switched its editor to Tap. Screenshots use `/tmp/course-load-review/constants-and-widths-{375|1280}-{light|dark}-{initial|movk|width|committed}.png`. Visually inspected the phone light worked state, phone dark width state, and desktop dark worked state in detail; full-page screenshots preserve remaining states.

Read-only/source-only: successful construction and the learner-solution trace gate; complete hint ladders; final exercise grading and reflection answer. Did not submit a passing solution, exhaust tap-editor chips, test restoration across reload, run a full accessibility/technical audit, or contact an external compiler. The review does not infer actual learner failure rates from one reviewer or recommend removing content based on page length.
