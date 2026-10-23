# Independent check 10: Counting down

Copyright © 2026 Christopher Snow

## Verdict and direction

No confirmed remaining high, medium or low finding in the reviewed change. The ordinary countdown now presents decimal registers with optional bits while retaining the remaining count, flags, instruction count and backward-branch status. The earlier reader's optional decimal-first design recommendation is implemented without removing the mechanism the learner must follow. Preserve these state and branch cues when changing the shared stepper.

Checked the final supplied production site at `http://127.0.0.1:4322/assembly-lab/#/lesson/counting-down`. This checker made no application change and ran no build.

## Prerequisites and sequence

Read AGENTS.md/CLAUDE.md, all ten lesson sections, labels, both exercise tasks and hint sequences, recorded loop listings, StepperFigure, trace and branch-path sources, and the Module 5 compiler/source record. Reviewed preceding Counting up prose and earlier-course prerequisite evidence. Unsigned wrap, subtraction flags, logical shifts, zero tests, labels, backwards branches, calling registers, compiler settings and editor controls precede this lesson. Counting up already supplies the dimming context, body/iteration distinction and initial loop test. Here `while (ticks != 0)` and `ticks--` receive local explanation. The required motivation explains how subtraction supplies Z before the first prediction. No confirmed untaught prerequisite blocks the reviewed work.

The later `do` failure and unsigned comparison are introduced after countdown practice. The failure explicitly states its trace limit; the explanation distinguishes that limit from program termination. The final task locally explains why useful shifts have a bound. These remain appropriate synthesis of prior operations, rather than evidence of overload from the number of representations alone.

## Browser evidence

Fresh independent contexts covered 375×900 and 1280×900, each in light and dark. Computed body backgrounds confirmed actual palettes: light `rgb(243, 246, 245)`, dark `rgb(16, 22, 21)`. The script's inspected html dataset field was absent, so it is not used as theme evidence.

In all four contexts the ordinary, failure and wrong-loop steppers initially displayed “Check your prediction above first.” Selecting the first ordinary prediction option alone retained its lock; checking the prediction opened its dependent stepper. After four ordinary steps, status explicitly reported the taken backward branch and its next instruction. The remaining counter and brightness were decimal, with all four flags and “Instructions run” still visible. “Show the bits” changed the register group to its bits view; “Hide the bits” restored decimal presentation. The optional view preserved the run position. Back restored the preceding instruction state; Reset restored the unexecuted state and initial registers/count.

Committed the later failure prediction and stepped its countdown five instructions; also stepped the course-written comparison loop four instructions. These exposed the remaining count, flags and branch status with decimal presentation. Ran both unchanged starting exercises, including the bounded final synthesis, and observed failed test feedback with labelled inputs, actual and expected results. No solution was entered, and none is reproduced here.

No page horizontal overflow occurred in initial or final exercised states: document widths were exactly 375 and 1280 respectively. No captured page errors occurred. The phone paired listing remains a contained horizontal region, with current-operation status beside controls. Directly inspected ordinary-step captures for phone light and desktop dark; the smaller decimal state is legible and the status remains adjacent to controls.

Artifacts: `/tmp/course-load-implementation/check10.cjs`, `check10.log`, and `check10-{375,1280}-{light,dark}-{initial,step}.png`. The final script rerun explicitly exercised the bits switch in every context.

## Limits

Read-only source review covers complete traces, challenge references, graduated hints and external-source citations. Browser coverage is bounded to the states above: successful synthesis grading, all trace-limit/return states, every selectable history run, reload persistence, keyboard-only operation, assistive technology and every numerical case were not checked. Initial full-page captures were recorded but not individually visually inspected; direct screenshot inspection covered the two representative stepped views stated above. No QEMU, external compiler call or full-suite run was performed. This is a presentation and sequence check, not measured novice-learning evidence.
