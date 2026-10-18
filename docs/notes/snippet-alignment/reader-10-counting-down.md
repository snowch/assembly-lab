# Lesson 10: Counting down, and knowing when to stop

Copyright © 2026 Christopher Snow

Independent learner review of the immutable preview at
`http://127.0.0.1:4264/assembly-lab/#/lesson/counting-down`.
Read `CLAUDE.md`, `docs/style.md`, the snippet-alignment brief, the lesson's
prose/labels/wiring, and the earlier explanations relevant to its prerequisites.
Consulted `docs/notes/clarity-review-2/10-counting-down.md` for duplicates.
No application or test files changed; no challenge solution was submitted.

## Finding

### R08 — Shared medium finding: phone stepping separates the active source pair from the controls

Rendered quotations: “Follow the countdown, the brightness and the flags one
instruction at a time.”; “Next”; “Ran `subs w1, w1, #1`.”

At 375 × 900, pressing Next through the initial check, shift and subtraction
leaves the controls and register/flag results visible, but the subtraction's
instruction and its two associated C lines are above the viewport. The next
branch's C excerpt is visible, so the learner sees a highlighted condition but
cannot simultaneously inspect the decrement that produced the changed count and
flags. In the captured viewport, the subtraction row starts at y = −52.7;
its C excerpts start at y = −156.8 and −124.8. This is a viewing issue, not a
missing or incorrect association: scrolling upward reveals the correct pair.

Direction: keep the current instruction and its related C accessible while the
learner uses the step controls on a phone, without losing the register/flag
result. Assess the ordinary viewport after a click, not only a screenshot of the
whole figure. Collapsing Complete C source shortens the figure but does not
remove the distance between the controls and earlier paired rows.

Evidence: [phone viewport after Next](/tmp/snippet-reader10-375-after-next-viewport.png),
[phone viewport after collapsing the full source and stepping](/tmp/snippet-reader10-375-collapsed-after-next-viewport.png).
My independent lesson-10 assessment is low severity because the status names the
last instruction and the source pair remains available by scrolling. The review
coordinator identifies this as independent confirmation of the shared accepted
R08 medium finding (broader desktop/phone evidence is in reader 08); merge this
occurrence there, rather than opening a separate issue. I found no material
mapping or gate regression.

## Pairing and context checks

- The opening listing preserves the complete nine-line C function separately.
  “The instructions stay in their original order. A C line appears again when
  later instructions also relate to it.” explains the repeated condition excerpts.
  The labels and instruction sequence remain readable in order.
- The subtraction is paired with both the condition and decrement. After it runs,
  both C lines light in the complete source and wherever those source lines recur
  in the paired view. The instruction's own mark and the next-instruction arrow
  distinguish instruction execution from source association. I did not treat the
  repeated source highlights as an additional defect.
- “Compiler's C line references” starts closed. When opened, it explicitly calls
  these the compiler's original references and explains that they may identify a
  brace. The countdown's recorded sequence remains 4, 5, 4, 4, 9; the normal return
  pairing identifies the return statement at line 8 instead. The raw record and
  teaching relation are distinguishable.
- The changed `dim_do` source is shown in full in its revealed stepper, including
  `do` and the trailing condition. Its subtraction relates to the decrement and
  condition together. Its prose explains the changed test order before asking
  the learner to use it; it is not silently presented as the original function.
- The `dim_wrong` compiler listing retains the full source and pairs its one
  branch with the condition. The nearby course-written comparison loop remains
  assembly-only, with neither invented C excerpts nor compiler-reference detail.
- Desktop rows align source and instructions. Phone rows stack each C excerpt
  directly above its instruction, with explicit C-line labels. The wrapped
  argument declaration keeps its line number and does not produce horizontal
  scrolling. Light and dark screenshots retain readable text, source highlights,
  instruction highlights and next markers.

## Assumed knowledge and duplicate handling

The learner is assumed to know only Before you start and lessons 00–09. Before
you start supplies small C functions, unsigned arguments, returns and while/for
loops. Module 0 explains GCC, `-O1`, compiler line references, instructions,
register arguments/results and `ret`. Earlier arithmetic/shift/branch lessons
supply unsigned wrapping, right shifts, flags, labels and branch conditions.
The preceding counting-up lesson explicitly introduces loop/body/iteration and
`brightness >>= 1`; this lesson explains `ticks--` and `do` before use.

The new presentation terms are ordinary descriptions: “Complete C source”,
“C operations” and “Compiler's C line references”. The repeated-line explanation
and compiler-detail explanation make their functions clear. I found no new
unprovided prerequisite caused by this change.

The previous review's trace terminology concern (L10), optional C-standard
termination explanation (L11), and hint-heading mismatch (M6) are existing review
items. They are not new snippet-alignment findings and are not duplicated here.
I did not open challenge hints or reproduce challenge answers.

## Actual browser coverage and evidence

Used installed Playwright/Chromium with separate fresh browser contexts at
1280 × 900 and 375 × 900, each in light and dark themes. In every configuration:

- captured initial rendered text and the opening paired listing;
- opened and captured the raw compiler-reference disclosure;
- selected the first option in each prediction, checked that selection alone
  retained the gates, then used Check your prediction to reveal the figures;
- confirmed all six initially gated figures became available through those
  legitimate commits (no storage seed or gate manipulation);
- stepped the countdown through subtraction and the do-loop through subtraction;
- captured the compiler's wrong-loop listing and the assembly-only stepper;
- recorded source highlights, browser page errors and horizontal-overflow measures.

No page errors occurred. Document widths equalled the viewport widths in all four
configurations; no checked source cell, complete-source disclosure or compiler
reference disclosure had horizontal overflow. Read initial and revealed text.
Inspected actual screenshots from all four configurations, including source,
paired highlights, compiler detail, changed C and assembly-only presentation.
An additional fresh phone run captured the viewport immediately after Next and
after collapsing the full C source, to substantiate this R08 occurrence. Did not run a full test
suite, rebuild, change loop-run selections, complete challenges, test keyboard
navigation or audit screen-reader behaviour.

Scripts: [four-configuration browser review](/tmp/snippet-reader10.mjs),
[viewport follow-up](/tmp/snippet-reader10-viewport.mjs).
Measurements: [results](/tmp/snippet-reader10-results.json).

Representative inspected screenshots:

- [desktop light listing](/tmp/snippet-reader10-1280-light-listing.png)
- [desktop dark multi-source highlight](/tmp/snippet-reader10-1280-dark-multi-highlight.png)
- [phone light listing](/tmp/snippet-reader10-375-light-listing.png)
- [phone dark multi-source highlight](/tmp/snippet-reader10-375-dark-multi-highlight.png)
- [desktop light compiler references](/tmp/snippet-reader10-1280-light-refs.png)
- [phone dark do-loop](/tmp/snippet-reader10-375-dark-do.png)
- [desktop dark compiler wrong-loop listing](/tmp/snippet-reader10-1280-dark-wrong.png)
- [phone light assembly-only loop](/tmp/snippet-reader10-375-light-assembly-only.png)

All captures and rendered-text records use the prefix
`/tmp/snippet-reader10-{1280,375}-{light,dark}-`. They include revealed prediction
material and remain outside this report.

## Focused R08 checker follow-up: preview 4265

Checked `http://127.0.0.1:4265/assembly-lab/#/lesson/counting-down` independently
with fresh Playwright contexts at 375 × 900 and 1280 × 900, light and dark.
Used the prediction control normally, then captured ordinary viewport screenshots
immediately after Next through subtraction, loopback and return, followed by Back
and Reset. These are viewport captures, not whole-figure screenshots.

**Outcome: the reported subtraction/stepping burden is fixed; a small Reset
visibility limitation remains on the phone.** The subtraction's two C lines and
instruction, the loopback pair, the return pair, and the pair after Back all remain
visible with the step controls and register/flag results in all four configurations.
The bounded listing scrolls internally. Page scroll stays fixed throughout those
actions (6158 at phone width; 4371 at desktop width). Focus stays on Next and Back
while enabled. On return and Reset, the clicked control becomes disabled and the
browser's active element becomes the body; there is no page-position jump.

At phone width after Reset, the first instruction remains visible near the top
of the viewport but its C condition is just above the viewport. The listing has
returned to that pair internally, yet the top of its bounded area is itself above
the viewport. The source can be recovered by scrolling. This is a residual low
severity limitation, not a recurrence of the original subtraction failure.
Desktop Reset shows the first pair together. If R08's acceptance requires the
full pair after Reset as well as after Next, retain this small occurrence for
follow-up; otherwise the original occurrence is verified fixed.

Complete C source and the original compiler-reference disclosure remain reachable
by scrolling within the bounded listing. Opened the references in all four
configurations and inspected full-source and raw-reference viewport captures.
Document widths still equal viewport widths. This check does not assess the
forthcoming multi-source explanatory wording, other lessons, keyboard navigation
or screen-reader behaviour. No app/test edits or challenge submissions.

Evidence: [focused script](/tmp/snippet-checker10-r08.mjs),
[measurements](/tmp/snippet-checker10-r08-results.json),
[phone light subtraction](/tmp/snippet-checker10-r08-375-light-subs.png),
[phone dark subtraction](/tmp/snippet-checker10-r08-375-dark-subs.png),
[desktop light subtraction](/tmp/snippet-checker10-r08-1280-light-subs.png),
[desktop dark loopback](/tmp/snippet-checker10-r08-1280-dark-loopback.png),
[phone return](/tmp/snippet-checker10-r08-375-light-return.png),
[phone Back](/tmp/snippet-checker10-r08-375-light-back.png),
[phone Reset limitation](/tmp/snippet-checker10-r08-375-light-reset.png),
[desktop Reset](/tmp/snippet-checker10-r08-1280-dark-reset.png),
[full C source](/tmp/snippet-checker10-r08-375-dark-fullsource.png),
[raw compiler references](/tmp/snippet-checker10-r08-1280-dark-rawrefs.png).

## Final focused R08 check: preview 4267

Repeated the focused browser check at
`http://127.0.0.1:4267/assembly-lab/#/lesson/counting-down`, 375 × 900 and
1280 × 900 in light/dark, using fresh contexts and legitimate prediction commits.
Captured the initial state, subtraction with both C lines, loopback, return,
Back, Reset, full-source access and opened compiler-reference access.

**The reported R08 stepping issue and the phone Reset residual are verified
fixed in this lesson.** After Reset, the entire first C/instruction pair is visible
at phone width (approximately y = 0–145), with Next around y = 428. Subtraction,
loopback, return and Back likewise keep their related C/instruction pair and the
controls visible in all four configurations. Inspected ordinary viewport
screenshots in both widths/themes, including the formerly failing phone Reset.
Full C and raw references remain accessible by internal scrolling. No horizontal
document overflow appeared.

Two precise limits to the broader “initial state / no page jump” criterion remain:

- Before the first Next, the bounded pane starts at complete C. When the page is
  scrolled to the controls, the first paired instruction is below the pane's
  visible area. It is accessible by scrolling inside the pane; the first Next
  brings the executed pair into view. This differs from Reset, which now reveals
  the complete first pair automatically.
- The desktop-dark initial first click reproducibly moves page scroll from 4558
  to 4534 (24 pixels), including in a repeat after `document.fonts.ready`.
  Subsequent measured actions, from subtraction through Reset, do not change
  page position. Phone light/dark and desktop light retain the same page
  position from initial state through Reset. I therefore do not claim absolute
  zero page movement for every initial click.

The enabled Next/Back controls retain focus. Return and Reset disable the clicked
control, after which the browser reports body as active; source rows do not take
focus. These observations do not reopen the fixed phone subtraction/Reset
occurrences. They bound this check's conclusion rather than claiming the wider
initial-state criterion passed without qualification.

Evidence: [final script](/tmp/snippet-checker10-final.mjs),
[final measurements](/tmp/snippet-checker10-final-results.json),
[initial-click stability repeat](/tmp/snippet-checker10-final-stability.mjs),
[phone light Reset](/tmp/snippet-checker10-final-375-light-reset.png),
[phone dark Reset](/tmp/snippet-checker10-final-375-dark-reset.png),
[desktop light Reset](/tmp/snippet-checker10-final-1280-light-reset.png),
[phone subtraction](/tmp/snippet-checker10-final-375-light-subs.png),
[desktop dark subtraction](/tmp/snippet-checker10-final-1280-dark-subs.png),
[initial phone view](/tmp/snippet-checker10-final-375-light-initial.png),
[phone compiler references](/tmp/snippet-checker10-final-375-dark-rawrefs.png).
Other captures use `/tmp/snippet-checker10-final-{375,1280}-{light,dark}-` with
`loopback`, `return`, `back` and `fullsource` suffixes. No app/test edits, build,
full-suite run, challenge answers or submissions were part of this check.
