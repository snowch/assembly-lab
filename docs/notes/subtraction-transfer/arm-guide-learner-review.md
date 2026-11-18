# Arm-to-RISC-V appendix: independent learner review

Copyright © 2026 Christopher Snow

## Scope and preparation

Reviewed one appendix at `http://localhost:4430/assembly-lab/#/lesson/moving-to-riscv` from its rendered page before reading the drafting rationale. Read the binding authoring/style instructions and earlier call/stack preparation. This is an independent agent review and functional browser check, not a novice learning study.

The reader can read simple C and small binary values, and has completed the earlier Arm course. In particular, register/input/destination roles, two's-complement readings, W/X widths, NZCV, unsigned comparisons, calls/returns, stack preservation, and the distinction between the browser simulator and native GNU/QEMU work have prior preparation. The appendix defines the cross-ISA calling convention mappings, identifies the zero-register naming difference, and describes function bodies, top-level fragments and supplied runtime code before the transfer activity.

New assumed knowledge found: the name `xv6` is used without identifying its operating-system role. The learner knows Linux and QEMU from the earlier course but has not been required to know xv6. The RISC-V pseudo-instructions in the caller are supported by the accompanying explanation of loading arguments, calling, copying the result and jumping past a function body.

## Findings

### Medium: the fresh-experiment direction points to the wrong place

Under **Run the RISC-V version**, the page says, “Apply the exercise below in RISC-V too.” **Translate an adjusted difference** occurs earlier in the page, before **What each lab supplies**. A reader following the stated direction reaches only continuation links and references, so the instruction can make the existing task hard to find.

Correction direction: name the existing exercise without an incorrect relative direction, or point upwards accurately. No rewrite or source change was made by this reviewer.

### Low: identify xv6's role at first use

The page says, “A CPU emulator runs the executable as an xv6 user process.” It later contrasts xv6 and Linux system calls, but never identifies xv6 as the operating system. The distinction between the instruction set, emulator and operating environment is a main purpose of this appendix.

Correction direction: briefly identify xv6's OS role at the first mention. No additional OS tutorial is needed.

### Low: the fresh-task title appears three times in succession

“Translate an adjusted difference” appears as the section heading, exercise caption and card heading. The repetition is especially conspicuous on a phone. The task contract and controls themselves remain readable and usable.

Correction direction: reduce local duplicate labelling if the existing component contract permits it. This is an existing general challenge-rendering pattern, so a broad renderer change is not required to close this appendix review.

## Built-page checks

Four fresh Chromium contexts passed: desktop 1280×900 and phone 375×900, each with selected light and dark preferences. Confirmed the actual theme attribute and rendered background, not just the select value. Inspected captured register-role and exercise screenshots across both widths and themes.

- Read-only foreign RISC-V function code is labelled separately from the native Arm function. The native editor contains only its starter on first arrival.
- The worked two-argument function is explained before the fresh three-argument task. The latter's complete reference is absent before hints are requested.
- Submitted an incorrect W-width calculation, activated **Run tests** from the keyboard, and observed rejection of its wide-input case with named inputs, actual and expected values.
- Submitted the native 64-bit reference and observed all five tests pass. Reload preserved its text and checked result in all four contexts.
- Essential argument/result/preservation obligations and **Run tests** instructions remain visible without opening a note.
- No page exceptions or page-level horizontal overflow occurred. Tables wrap on the phone while keeping columns distinguishable; code and controls remain legible.

The first browser harness expected the literal word “failed” for a rejected submission. The UI correctly reports “Tests passed: 4 of 5” with the rejected case. That harness exited nonzero; after correcting its assertion to the actual documented result format, the complete four-context rerun passed. This was a review-harness error, not a product correction.

## Cross-lab action verification

Followed the page's **Tools → Projects → New project**, **Assembly fragment**, naming and **Create project** route using a fresh local RISC-V browser context. Copied the caller from the actual rendered Arm guide into the visible CodeMirror editor. The worked run and the requested adjusted run produced the intended relationship in the default result display. **Inspect registers → All** exposed the argument/result registers and retained inputs described by the guide.

Independently opened **Tools → Program** through its actual tab. The selected tab's `aria-controls` panel was visible and showed the user's fragment inside supplied entry, initialisation, capture/reporting and data sections, with read-only source clearly labelled. This confirms that the guide names an available inspection path.

Full cross-lab phone/stepping verification is recorded in the final follow-up below when its browser run completes. Existing saved production learner work was never accessed: all review activity used fresh local contexts.

## Evidence boundary

The visible route defines the new register/environment distinctions, demonstrates a small complete translation, and gives a fresh application with executable feedback. These checks establish functional behaviour and expose wording issues. They do not establish that a novice can transfer independently without coaching, and no assistive-technology study was conducted.

## Cross-lab browser follow-up

The complete caller route passed on desktop/light and phone/dark: creating a separate assembly-fragment project, running the worked caller, making the requested fresh adjustment, finding the returned value in the default display, and using **Inspect registers → All** to inspect the named registers. **Start stepping** rebuilt the edited project and enabled **Step instruction**. The source line and pause information remained in context. Both runs had no page exceptions or horizontal overflow; screenshots were inspected.

The exploratory harness initially guessed a Program panel id and a stepping button id. The final inspection used the real Program tab's `aria-controls`, and the real **Start stepping** accessible name; those controls and their visible states were confirmed. The exploratory selector probes were not counted as product test failures or as successful panel assertions.

## Final production-build closure check

Reloaded the rebuilt production bundle in four fresh contexts, 1280/375 × actual light/dark. All three findings are resolved:

- The transfer experiment now states its requested calculation and named edits directly; it no longer points to an exercise “below”.
- The first environment description identifies the **xv6 operating system**.
- The fresh task has a distinct **Run the Arm version** section heading, an argument-focused caption, and one card heading carrying the function task's title. The former three consecutive identical headings are gone. Inspected the new phone/dark capture.

Also verified the final action ordering: the guide tells the reader to copy the caller before opening the destination project. The exact caller code remains unchanged from the previously executed browser checks. The guide now explicitly says supplied entry/setup runs before the pause at the first instruction **in your fragment**, matching the inspected stepping boundary. No new page exceptions or horizontal overflow appeared in these four closure contexts. Functional code tests were not repeated for these wording-only corrections.
