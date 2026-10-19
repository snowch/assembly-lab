# Lesson 13: Array addresses and moving pointers

Independent reader/checker; no lesson edits. Read the lesson prose, labels, questions, figure structure, recorded listings and both hint ladders before consulting the accepted audit. Applied CLAUDE.md, docs/style.md and docs/authoring.md. Review model inherited from the coordinating session; no override.

## Verdict

Pass for accepted N13 (array element grouping), N14 (count/end-pointer register reuse), and the local shared role/hint changes. No blocking or new clear regression found within this review's scope.

- N13: all memory steppers declare four-byte element groups. The built page shows Element 0 through Element 3 with four address-labelled byte cards inside each bordered group. At 375 pixels each element stays intact while its bytes wrap into two columns; at 1280 pixels its four bytes fit one row. The unscaled-load experiment visibly highlights bytes spanning two elements, preserving the intended demonstration. Gates still hide memory steppers until the relevant prediction is checked.
- N14: the main explanation now says, “After calculating the end address, this listing no longer needs the count in `w1`. The load reuses `w1` for each array element.” It also explicitly explains GCC's replacement of the decreasing count with an end-address comparison and the absence of a separate decrement instruction. This agrees with `arrays.listings.ts` SUM_TRIPS: end address calculated before the load reuses the count register, with pointer/end comparison later. The actual figure after its first load matches that explanation. No compiler output was rearranged to force a separate decrement into the listing.
- Both prediction cards visibly say Prediction, exercises say Exercise, and real instruction steppers retain Stepped. Their relevant interaction is now described accurately.
- Both hint ladders align with their fixed headings: the mistake rungs identify a genuine error, smaller-example rungs use a concrete reduced case, and later rungs supply increasing help. No challenge answer is reproduced here.

## Browser evidence

Checked Chromium against `http://localhost:4292/assembly-lab/#/lesson/array-addresses` in fresh contexts at 375 and 1280 pixels, light and dark. Set raw `assembly-lab:v1:theme` strings and asserted the resulting HTML theme. An initial exploratory read used 4291; all recorded four-configuration probes use 4292.

In every configuration: initial locked state; first prediction/check; selected-load initial and after states; one instruction in each of the offset/pre-index/post-index steppers; failure prediction/check and cross-element load; first five instructions of the compiled sum through register reuse. Four groups of four bytes were present, with no page horizontal overflow or page errors. Screenshots `reader13-{width}-{theme}-{initial,after,cross-element,sum-reuse}.png` and machine observations `reader13-evidence.json` sit beside this report. Visually inspected representative phone light, phone dark and desktop light images; all four configurations have recorded screenshots and measured layout evidence.

Additionally, on desktop, ran each untouched challenge starter and opened all five hints. Both starters failed their tests as expected; feedback listed input/actual/expected states without presupposing a branch or other unexecuted operation. No successful solutions or exhaustive alternative submissions were executed.

## Assumed knowledge

No newly exposed prerequisite gap found. Front-page prerequisites explicitly include arrays and simple C loops. The lesson itself defines element/index and pre/post-index addressing, explains pointer arithmetic and `*trips++`, and now explains `+=` locally. Relevant preceding lessons introduce pointers and `const` (memory-and-addresses), zero extension (loading-widths), shared w/x register views and unsigned wrapping, branch conditions and counting loops. The `uxtw` extension is explained at its first local use. This is a targeted prerequisite check of relevant earlier passages, not a fresh exhaustive reread of all earlier lessons.

## Limits

This review verifies the accepted local corrections and representative changed interactions. It is not a full regression suite, accessibility audit, QEMU run, or certification of every saved state and arbitrary challenge submission. No new finding requiring a correction direction was substantiated.
