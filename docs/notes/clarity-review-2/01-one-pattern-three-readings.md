# Second clarity review: Same bits, two readings

Reviewed 18 October 2026 by a fresh reader, one lesson only. Baseline is the built preview at `http://127.0.0.1:4253/assembly-lab/#/lesson/one-pattern-three-readings`, including the approved Module 0 simulator sentence. Read `CLAUDE.md`, `docs/style.md` and [the review brief](brief.md). Formed the source findings before consulting the first review. No learner text was changed.

## Verdict

No new material clarity problem found. The chapter explains hexadecimal beside a small example, gives the signed-reading rule before the bit exercises, and connects the repeated subtraction to the learner's preceding work. One shared vocabulary problem remains, already retained as **L4** in [the first review](../english-review/README.md).

## Retained finding

**L4, low, still present — undefined “flags” in the shared simulator note.**

- Source: `packages/views/src/strings.ts:11`, `modelNote`.
- Exact quote: “An instruction can read or change registers, flags or memory.”
- Learner effect: the learner knows registers and memory from Module 0, but cannot yet identify the third item. The front page names flags without defining them. The note therefore assumes a processor concept that its reader has not been taught.
- Direction: use already introduced vocabulary here, or supply a short identification before using the term. This is one shared issue, not a separate fix for every early chapter.
- Reconciliation: independently noticed this term during the initial source pass, then matched it to L4 and the first [lesson 01 report](../english-review/01-one-pattern-three-readings.md). The browser's expanded “How the simulator steps” note confirms the wording remains. No earlier rejected finding is being revived.

## Prerequisite audit

The front-page panel supplies `int`, `unsigned`, function arguments and `return`, basic arithmetic, and binary/decimal conversion. The sole earlier lesson supplies GCC, listings, register names, 32-bit `w` views, argument order, operands, the reversed subtraction, memory, return behaviour and `-O1`. Module 0 also explains a number written directly in an instruction; this chapter explicitly says its added instruction adds 12. None of those is a missing prerequisite here.

This chapter explains hexadecimal, the `0x` prefix, the top bit, signed and unsigned readings, and set/clear. The numbered bit controls run down to zero and support the top-bit identification. The only unexplained assumed knowledge found is the shared flags term above. No later lesson was used to excuse an omission.

## Coverage and evidence

Read every chapter prose string and label, the full lesson structure, both challenges, all ten hints, both prediction explanations, construction success text, compiler disclosure, reflection answer and model-versus-reality note. Read the applicable shared figure and feedback strings in `packages/views/src/strings.ts` and `strings.module1.ts`, plus the reading grader paths. The success note was reviewed in source; a solved challenge was not submitted.

Used Playwright Chromium against the existing immutable build at **1280 × 900** and **375 × 900**, in **light and dark** preferred colour schemes. In all four combinations:

- Read initial and expanded page text; opened all native disclosures, including calculation, compiler and reflection.
- Submitted an incorrect choice for each prediction to expose its feedback and explanations.
- Stepped the first program once; cleared the interactive reader and toggled its top bit.
- Submitted empty work and then zero numeric entries in both challenges, showing blocked and incorrect-answer feedback.
- Revealed all five hints in each challenge and entered invalid hexadecimal text in the construction field.
- Inspected screenshots of the bit-reader figure and the construction challenge with hints and feedback. The table, labels and controls remained readable in both themes and widths. Document width equalled viewport width in all four configurations.

This is an English review, not exhaustive exercise testing; it does not claim every input, success path or browser was exercised.

Workspace evidence:

- Browser scripts: `/tmp/clarity2-01.cjs` and `/tmp/clarity2-01-figures.cjs`.
- Initial full-page captures and text: `/tmp/clarity2-01-{1280,375}-{light,dark}-initial.{png,txt}`.
- Revealed page text: `/tmp/clarity2-01-{1280,375}-{light,dark}-revealed.txt`.
- Visually inspected figure captures: `/tmp/clarity2-01-{1280,375}-{light,dark}-reader.png`.
- Visually inspected feedback/hint captures: `/tmp/clarity2-01-{1280,375}-{light,dark}-challenge.png`.

No challenge answers are reproduced in this report. No tests, build, commit or course edits were made by this reader.
