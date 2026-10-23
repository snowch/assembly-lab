# Reader 17: Calls, returns and the stack

Module 9, first lesson; course position 17 (zero based). Reviewed snapshot f1fdf35, built preview on port 4210. Scope: learning load, not an accuracy verdict or implementation request.

## Prior knowledge and new work

Entry requirements allow small C functions, arguments, return, conditionals, loops and arrays; assembly starts in Module 0. The preceding 17 registry entries in `/tmp/course-load-review/lessons.json` establish register arguments/result, stepping, `ret` returning control, hex, `w`/`x` aliases, arithmetic, branches, memory/byte order, and pre/post-index addressing. In particular `meet-the-machine.prose.ts:27–28,63` already distinguishes returning control from calculating a result. `array-addresses.prose.ts:18` explains both address updates. Ordinary function arguments, a returned value, halving and adding are therefore familiar, not nine simultaneous novelties.

New here: an internal `bl`, replacement of `x30`, two return destinations, stack allocation/release, saved register slots, pair transfers, `sp` alignment, frame pointer, and preservation responsibilities. Caller/callee/leaf are named here. Nine new named terms are substantial, but term count alone does not demonstrate overload. The memory and address-update mechanisms already have practice.

The first prediction asks “What does `trip_report` return in `w0`?” (`calls-and-returns.prose.ts:14`). It can be attempted from the familiar C computation and the supplied inputs without decoding the new prologue. It is an output prediction, not a demand to master all frame mechanics before a first attempt. The first construction reduces the task to return-address preservation; reserve preservation is added only in the final task. I found no high-severity first-attempt block or confirmed missing prerequisite.

## Confirmed finding

**Medium: the stack investigation separates the new cause and effect across more than a phone viewport.** The instruction is “Step through the call and watch the active stack bytes” (`calls-and-returns.prose.ts:18`); caption: “Follow the call, the saved registers and the return.” At the first store and after the helper call the learner must coordinate the executed instruction, `sp`, current `x30`, the saved `x30`, and slot addresses. `StackStepper.tsx:87–165` places the complete paired listing, controls, slider, status, six register summaries and return-target sentence before the stack. All are useful representations; their spatial separation is the avoidable work.

Reproduction: fresh context, commit any first prediction, press Next once for allocation/stores or five times for the helper call. At 375×900 the five-step stack panel is 971.7px high; its top is 593.7px below the top of the Next controls. The stack bytes themselves cannot share a viewport with those controls and current-operation status. At 1280×900 the panel is 635.9px high and starts 474.3px below the controls. These are relative distances, independent of where the browser has scrolled. The phone screenshot `calls-and-returns-375-dark-stack.png` shows readable labelled slots, but no operation/controls; `calls-and-returns-375-light-step5.png` shows the controls/status/registers, with no stack. Desktop step5 similarly pushes the stack below the viewport. Four theme/width contexts agree.

Smallest direction: retain the complete listing and accurate byte display, but keep a compact current operation and stepping controls available beside the stack while it is being inspected. A compact saved-slot overview alongside current register values could further reduce tracking; byte expansion should remain available. Do not remove the saved/current distinction or replace the frame drawing with a table. This is an interface recommendation, not evidence that calls and the stack require separate lessons.

## Design recommendations, not confirmed faults

The opening full `trip_report` listing contains the preservation machinery before its explanation (`calls-and-returns.ts:101–106`; `calls.listings.ts:5–10`). A novice may try to decode every line immediately. However it is labelled a diagram, no action is required there, the next paragraphs explain the call, and the prediction can use C. I would consider a small initial focus on the call/return path before widening to the full frame, but do not rank the initial listing alone as overload.

The investigation introduces pair transfer, frame pointer and preservation rules together. If learner evidence shows difficulty, split the walkthrough into allocation/save, helper call/return, restore/release checkpoints using the existing run. Do not split already familiar pre/post-index or memory operations into new lessons. Full calling-convention responsibility is revisited after the failure example and before the reserve challenge, so its later use is appropriately prepared.

## Keep

- Clear `bl`/`ret` distinction and explicit warning that `ret` need not end the whole program (`prose.ts:11`).
- The same inputs and recorded program connect output prediction and stack walkthrough; the walkthrough is locked until commitment. Normal feedback remains separate from the subsequent stepping task.
- Slot labels group eight bytes per saved register and identify the stored value. Both themes keep addresses and boundaries readable. The diagram distinguishes a saved return address from the live `x30` destination.
- “Restoring sp releases the space; it does not erase the stored bytes” (`strings.stack.ts:29`) addresses a useful misconception locally.
- Smaller first construction, then a failed return experiment, then an explicitly warned helper that changes `w1`. The final task integrates established rules rather than surprising the learner with a new rule.
- Optional compiler details define the extra inlining setting; model limits explain the prepared stack and qualify this GCC frame as one layout, not a universal template.

## Coverage and limits

Read all ten sections, details, challenge briefs, starting programs and grading/preservation requirements in parsed data and lesson source; read `calls.listings.ts` for this lesson's programs, `StackStepper.tsx`, `stack.ts`, `strings.stack.ts`, stack CSS, and `MemoryPrediction.tsx`. No later lesson is counted as prerequisite evidence.

Browser: fresh contexts for 375×900 and 1280×900, each light/dark; actual body backgrounds were rgb(243,246,245) and rgb(16,22,21), not merely requested preferences. Initial document scroll widths matched viewports. Opened recorded compiler details. Checked initial prediction locks, committed first prediction/feedback, stack steps 0,1,3,5,7,10,11, helper entry and return, restored/released frame, Back and Reset. Committed failure prediction and advanced its trace six steps. Viewed stack-focused screenshots in addition to controls/listing screenshots. Scripts and captures use `/tmp/course-load-review/calls-and-returns-*`; textual state/geometry logs are alongside them.

Challenge editing, running tests, hint escalation, the failure trace's final limit state, slider dragging and restored browser progress were not exercised. Challenge/reference code and reflection/model-limit details were read in source; no challenge solutions are reproduced here. No external compiler calls, rebuilds or app changes were made. The single medium finding is confirmed interface tracking; the proposed smaller initial focus remains a design option without observed learner-performance evidence.
