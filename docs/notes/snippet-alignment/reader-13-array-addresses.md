<!-- Copyright © 2026 Christopher Snow -->

# Independent learner review: lesson 13, Array addresses and moving pointers

Read against `CLAUDE.md`, `docs/style.md` and this directory's `brief.md`. Learner scope is the front-page “Before you start” panel and lessons 00–12. This is a fresh browser review of the snippet alignment, not a technical mapping audit or a repeat of the earlier whole-lesson clarity review. No source, test or challenge solution was edited.

## Findings

No new material lesson-specific finding. One occurrence of the known shared issue was observed and checked against its replacement build:

- **R08 duplicate, medium, resolved in the targeted 4265 check.** The caption says “Follow the compiled sum_trips through the trip log”; the control says “Next”. On 4264, ordinary Next clicks at phone width leave the active pair above the viewport because the expanded complete source and paired listing precede the controls. This is the already reported tall-stepper problem, not another issue to rank. Direction: retain a bounded listing with the current pair revealed while keeping the controls nearby. On 4265, all nine checked transitions at both widths and themes kept the complete active pair and Next within the viewport. At 375 light, after the first load the pair occupied approximately y=235–413 and Next began at y=428. The loop-back transition also revealed the earlier pair. Complete C remained accessible by scrolling the listing to its top. Evidence: `/tmp/snippet-reader13-375-light-sum-step5-viewport.png` (4264), `/tmp/snippet-reader13-4265-375-light-step5.png`, `/tmp/snippet-reader13-4265-375-dark-step9.png` and the corresponding JSON geometry.

The earlier `docs/notes/clarity-review-2/13-array-addresses.md` reported no substantive English issue. It is separate prior review evidence; this pass does not claim to have rerun its challenge/hint checks.

## Reading the new pairing

- The opening `read_trip` keeps all four C lines. The return expression pairs with the load and `ret`, with “Returns to the code that called this function” explaining the latter's role. At 375 pixels, the long function declaration wraps within its C cell; its instruction partner stays in the same sequential pair.
- In `sum_trips`, “Complete C source” contains all nine lines, including `count--;`, both braces and the final return. The note “The instructions stay in their original order. A C line appears again when later instructions also relate to it” explains the repeated loop condition and initialisation excerpts. The full source and excerpts are distinguishable.
- `total += *trips++;` is paired with both the post-index load and the addition. Stepping each lights C line 5. The condition's pairs carry the initial empty-case check/end-address preparation and the later compare/branch. The nearby prose explicitly allows a countdown or an end-address comparison, so I did not infer that the displayed C decrement must have its own assembly instruction.
- The opening pointer-copy instruction says “No C statement is linked to this instruction”. After executing it no C line lights. This avoids presenting a brace or a declaration as the operation that moves the pointer.
- Normal highlights use C line 8 for the return, while the optional compiler record retains line 9. “These are the compiler's original line references. They may point to a brace instead of the C operation an instruction carries out” explains the difference. The label and instruction order are retained in that detail.
- The offset, pre-index, post-index and wrong-scale demonstrations remain assembly-only. No C association is invented for them.

## Assumed knowledge

No new unexplained prerequisite found in the reviewed snippets and changed presentation.

The front page permits C function arguments, return, while loops and indexed arrays. Lesson 11 explains pointers, dereferencing, `const`, the target's `long`/pointer sizes, byte order and the relationship between `w0` and `x0`. Lesson 12 explains zero extension. The current lesson defines array/element/index and all three address forms; it explains pointer increment, `*trips++`, `+=` and `uxtw` before the sum figure. Earlier loop lessons supply countdown and branch knowledge. Module 0 explains GCC and `-O1`, and distinguishes recorded compiler references from operation associations. The new complete-source/excerpt note introduces its own display convention locally.

## Actual browser checks and limits

Used installed Playwright with Chromium, a fresh browser page per configuration, at **1280 × 900 and 375 × 900, light and dark**. Themes were confirmed from `data-theme`. Screenshots were captured and visually inspected at each width and theme. Each observed page had document width equal to viewport width and no browser page errors.

On immutable **4264**, in all four configurations:

- Read initial rendered lesson text and the initial listing; confirmed the sum and related figures were gated.
- Submitted both predictions through their radio controls and Check button. No local-storage progress seed was used; only the theme was seeded.
- Ran the demonstrated nonempty `sum_trips` to completion through 17 ordinary Next clicks, recording source highlights after every instruction. Captured the initial figure and selected intermediate states, including its loop-back and return. Exercised Back and Reset; Reset cleared C highlights.
- Opened the compiler-reference detail and closed the complete-C detail; inspected their rendered text and screenshots.
- Stepped each of the other five memory figures once, observing its first memory operation and representation.

On immutable **4265**, in all four configurations, reran only the shared scrolling repair relevant to this lesson: nine sum transitions through the loop-back, viewport/active-pair/control geometry, screenshots after steps 1, 5 and 9, and explicit access to the top of the complete source and the compiler-reference detail. All nine C source lines remained present. This was not a complete fresh rerun of the 4264 matrix against 4265.

No challenge submissions, hints, alternate zero-count execution, arbitrary machine inputs, build or test suite were run. The recorded compiler's empty-case branch was read in the listing, not executed in this fixed-input figure. No challenge answer is included here.

Scripts: `/tmp/snippet-reader13.mjs`, `/tmp/snippet-reader13-final.mjs`, `/tmp/snippet-reader13-access.mjs`. Evidence families: `/tmp/snippet-reader13-{1280,375}-{light,dark}-{initial,revealed}.txt`, matching `.json`, `-listing.png`, `-sum-initial.png`, `-sum-step*.png`, `-raw.png`, `-collapsed.png`, and `-step-*.png`; targeted repair evidence `/tmp/snippet-reader13-4265-{1280,375}-{light,dark}.json`, `-step{1,5,9}.png`, `-source-top.png` and `-raw-bottom.png`.
