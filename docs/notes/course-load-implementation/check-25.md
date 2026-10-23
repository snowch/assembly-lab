# Check 25: The same C on 32-bit Arm

Copyright © 2026 Christopher Snow

Independent learner/checker review of `same-c-on-a32`, optional A (registry module 13), on the supplied final build at `http://127.0.0.1:4322/assembly-lab/#/lesson/same-c-on-a32`. No application edits, build, external compiler request or challenge solution.

## Verdict

The medium reference-distance finding is closed. No remaining high, medium or low finding from this focused check.

The direction “Open the recorded limit function beside this exercise” now has a closed local disclosure, “Recorded limit function for this exercise”, immediately before the first exercise. Opening it exposes both complete numbered C/instruction pairs. The final task likewise has separate local “Recorded service-marker function for this exercise” and “Recorded average function for this exercise” disclosures directly before its fields. The learner can read the unfamiliar tokens locally rather than remember them across earlier sections. Both architecture sides remain available.

## Confirmed behaviour

- All ten sections render in each fresh context. All three exercise references start closed; all six answer fields start empty. No prefilled solution appears.
- The initial limit stepper says “Check your prediction above first. The figure opens once you have checked it.” Committing an intentionally incorrect prediction opens it. Next executes and Reset restores the initial state in both A64 steppers.
- Each local reference exposes two paired listings. “Show instructions in both listings” and “Show C in both listings” work. At 375px, the listings contain their horizontal scroll (315px viewport, 588px content; instruction button scrollLeft 273px). At 1280px both panes fit without horizontal scrolling. Complete C is retained: the focused limit reference has four numbered C lines per architecture. No document horizontal overflow occurred in the four configurations.
- The caption “Step through the A64 version; the A32 record remains static” remains local to both steppers. The syntax prediction reports the course A64 assembler's rejection only after commitment; it does not claim to execute A32. The model-versus-reality note explicitly distinguishes static compiler evidence, A64 execution and assembler acceptance.
- Submitted deliberately incorrect nonempty instruction/helper tokens and zero in the numerical field. The exercises report “0 of 2 tests passed” and “0 of 4 tests passed”. Blank submissions separately produce “Tests could not run”, consistent with input validation. No solution, hint progression or successful submission was used.

## Prerequisites and source reading

Read AGENTS.md/CLAUDE.md, all ten current lesson sections and labels, the previous reader's prerequisite inventory, recorded A32/A64 listings, the optional-A checked brief and compiler/source notes, the recorded-query implementation and listing-pair component, relevant educational tests, and earlier definitions of compiler optimisation and leaf functions. The prior course supplies unsigned comparison/flags, conditional selection, register views, division, calls/return addresses, immediate operands and stack preservation. In particular, `meet-the-machine.prose.ts` explains `-O1` as an optimisation setting; `calls-and-returns.prose.ts` defines “A leaf function calls no other function.”

This page locally introduces execution state, A32's register names, condition suffix, constant spelling and helper-call distinction. Optional notes explain target flags and saved-register braces, PC return and A32 stack alignment. No blocking untaught prerequisite was found. The tasks ask for familiar C behaviour and explicitly identified tokens; they do not require the optional save/restore details.

The recorded-query source extracts tokens from recorded instructions, computes the numerical query through the A64 trace, and asks the actual course assembler about syntax acceptance. `a32.listings.ts` retains checked teaching associations; the compiler notes identify the exact GCC versions, flags and raw responses. These are source checks, not a new external architecture audit, compilation or native run.

## Browser evidence and limits

Fresh Playwright Chromium contexts: 375×900 and 1280×900, each light/dark. Actual body backgrounds were `rgb(243, 246, 245)` and `rgb(16, 22, 21)`. Inspected rendered lesson text, initial gates/empty fields/closed references, incorrect commitments, both steppers' Next/Reset, all three reference openings and navigation controls, and unsuccessful answer attempts in each configuration. No page errors were recorded. Reviewed a focused phone reference screenshot visually.

Artifacts: `/tmp/course-load-implementation/check25.cjs`, `check25.log`, `check25-{375,1280}-{light,dark}.png`, and `check25-reference.png`. The script's `cLines` diagnostic used the wrong class selector and reports zero; a separate rendered-DOM check using `.al-cline` confirms eight lines in the paired limit reference, consistent with the screenshot and source. This diagnostic error is not a product defect.

No full suite, rebuild, external compiler call, A32 execution, successful challenge attempt, persistence/reload or exhaustive step-through was performed. Final-build claims apply to the checked lesson and states; later changes affecting these require focused rechecking.
