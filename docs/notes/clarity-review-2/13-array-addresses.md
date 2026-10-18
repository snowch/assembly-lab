<!-- Copyright © 2026 Christopher Snow -->

# Fresh clarity review: Array addresses and moving pointers

Reviewed `array-addresses`, Module 7's first lesson, against the [review brief](brief.md), `CLAUDE.md` and both closing passes in `docs/style.md`. Scope: the whole chapter, with the front-page prerequisites and earlier lessons as prior knowledge. No learner text changed.

## Findings

No new substantive English clarity issue. The prose explains each step from an element index to a byte address, then separates the address selected from changes to the pointer. The three addressing examples use the same destination, making their comparison understandable. The explanation of the loop states the new C syntax before the learner needs to interpret the compiled loop, and the task makes the zero-count case explicit.

This agrees with the [earlier chapter review](../english-review/13-array-addresses.md). I formed this assessment before reading that report. There was no retained chapter-specific issue to close, and no new occurrence needs adding to the retained list.

I also checked the chapter's hints against the earlier review's M6. The indexed-load hint describes the actual error: “Using the index without scaling treats an element count as a byte count” (`array-addresses.prose.ts:25`). The sum hint begins “Do not read the first element when the count is zero” (`:43`). Here the prohibited action and the condition that makes it wrong are explicit. I do not recommend treating that warning as another ambiguous positive instruction under “Common mistake”. Both “Smaller example” hints give a concrete reduced input. No change is recommended merely to make these hints match a preferred sentence pattern.

## Assumed knowledge checked

No additional unexplained prerequisite found.

- The front page permits indexed arrays and C loops. This chapter still defines array, element and index at `array-addresses.prose.ts:6`.
- The preceding memory lesson introduces byte addresses, pointers, dereferencing, `const`, little-endian order and the target's type sizes (`memory-and-addresses.prose.ts`, question, compiler note and motivation).
- Register overlap and the effect of writing a `w` register have been taught and are repeated locally at `array-addresses.prose.ts:11`.
- Shifts and extension are earlier concepts. This chapter explains scaling inside the load's brackets (`:11`), then explains `uxtw` and the combined address calculation (`:36`).
- Pre-index and post-index addressing are defined beside their syntax (`:18`). Pointer arithmetic, `*trips++` and `+=` receive local explanations (`:36`).
- The position immediately after the array and the restriction on reading there are explained directly (`:38`). The compiler note's “array object” is tied to the array already defined, rather than introducing a separate storage model required to complete the exercise.
- The compiler identity and `-O1`, unsigned wrapping, countdown loops and branch conditions are earlier teaching. No later chapter was used to supply these explanations.

## Coverage and evidence

Read all ten sections, objectives, captions, notes, reflection, C and assembly listings, prediction explanations, challenge tasks, test labels and all ten hints. Sources: [prose](../../../content/lessons/array-addresses.prose.ts), [labels](../../../content/lessons/array-addresses.labels.ts), [lesson assembly](../../../content/lessons/array-addresses.ts) and [listings](../../../content/lessons/arrays.listings.ts). Also read the actual shared labels and feedback exposed by the interactions below.

Used Chromium against `http://127.0.0.1:4253/assembly-lab/#/lesson/array-addresses` at 1280 × 900 and 375 × 900, in both light and dark themes. In each of the four configurations:

- Opened both lesson details, including the compiler note and reflection answer.
- Submitted both predictions using the first option, exposing incorrect feedback for the first prediction and correct feedback for the second.
- Ran both unchanged starting challenge programs and read their failed-test feedback.
- Revealed all five hints for each challenge.
- Stepped each of the six memory figures up to three instructions: the five short demonstrations completed, and the sum figure reached its end-address calculation. The sum loop was not run to completion in this fresh pass.
- Read the initial and revealed page text and inspected rendered figure screenshots. Both themes were confirmed from the page state. Page width matched the viewport in all four configurations.

The wording remained understandable at phone width and in both themes. This was a prose review, not exhaustive grading or simulator testing; passing challenge submissions and arbitrary alternative inputs were not exercised.

Temporary evidence: `/tmp/clarity2-13.mjs`, `/tmp/clarity2-13-browser.json`, and `/tmp/clarity2-13-{1280,375}-{light,dark}-{initial,revealed}.txt`; matching `-hints.png` and `-figure.png` screenshots. No build, full test suite, commit or push was run by this reviewer.
