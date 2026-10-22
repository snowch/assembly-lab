# Independent learner review: Debug the booted instructions

Reviewer: a separate learner agent, 22 October 2026. This agent did not draft the lesson or
implement its figures, native sources or verifier. Scope: `debug-native-instructions` only.

## Prerequisites

The reader has completed all previous core lessons, including the revised first Module 12
lesson, and none of the optional A32 material. The prior course teaches register views,
arithmetic, flags, loads and stores, branches, function calls, the link register, stack frames
and the stack pointer. The first Module 12 lesson provides the terminal, downloaded source
bundle, GNU assembler and linker, ELF entry and loading, QEMU `virt`, startup, zeroed storage,
serial output and the host escape for leaving QEMU.

## Rendered checks

Reviewed the production preview at
`http://localhost:4182/assembly-lab/#/lesson/debug-native-instructions` in Chromium at
375×900 and 1280×900, each in light and dark themes. Verified the actual `data-theme` value.
Read the rendered page and inspected screenshots, including phone setup, desktop setup,
phone optional comparison and desktop instruction return states.

- Both recorded/model comparisons start locked. Merely choosing an option does not open one;
  focusing the commit button and pressing Enter commits it and opens the comparison.
- The original comparison's five stops agree between recorded and modelled register values.
  The return stop names the assembly caller, shows `ret` as the executed instruction, and
  disables Next. Back and Reset work; Reset restores the function-entry inputs.
- The modified comparison opens only after its own prediction and can be stepped to its return.
- The optional Linux comparison opens using keyboard focus and Enter. It explicitly separates
  Linux services from the boot image and makes the optional C caller unnecessary for the core.
- The starter challenge is rejected. A different valid sequence using permitted instructions
  passes all four behavioural tests and remains passed after reload. No solution is recorded here.
- Download requests for the boot source, linker script, trip function, assembly verifier and zip
  returned 200. The source responses contain source, and the bundle is served as a zip.
- At all four width/theme combinations, document width equals viewport width, visible controls
  are at least 40 pixels tall, and no page or console errors occurred. Long command blocks
  scroll within their own containers.

Selected inspected screenshots:

- [375px light setup](review-images/boot-debug-375-light-setup.png)
- [1280px dark return](review-images/boot-debug-1280-dark-return.png)
- [375px dark optional comparison](review-images/boot-debug-375-dark-optional.png)

The native commands were read against the checked source and lesson, but this learner review
has not independently executed QEMU or GDB. Native execution is a separate technical check.

## Findings

1. **Minor, prerequisite ordering.** The prediction asks “What value will the low 32 bits of
   `x0` hold after one `stepi`?” The first definition, “`stepi` executes one machine instruction”,
   appears in the following investigation. The preceding connection instructions do not use or
   define it. The learner can infer the arithmetic but must guess what the new debugger command
   means. Define the command beside its first prediction use, before asking for its effect.
   The managing agent accepted the finding and moved the definition into the prediction prose.
   Independent rendered verification on the final build (`index-DfqNXiIw.js`) at 375px and
   1280px, both themes, confirms “GDB’s `stepi` command executes one machine instruction” now
   precedes the prediction question. The investigation retains the command and stepping directions.
   Finding closed.

No blocking learner issue was found in the reviewed build. The main path consistently builds,
boots and inspects an assembly-only image. The initial PC, startup preparation, function call,
stored result and serial report are distinguished, and the closing task uses an assembly test
caller rather than requiring C.

## Assumed knowledge

The lesson relies on the earlier course's register widths, arithmetic, loads/stores and function
return convention. It relies on the first Module 12 lesson for the source bundle and tools,
ELF loading, `_start`, `.bss`, `.data`, `stack_top`, UART output and the QEMU exit escape. These
are taught before this lesson. Debugger, breakpoint, port, remote connection, GDB register and
memory inspection syntax, marker injection, detach, `.set`, `.include` and `.word` are explained
locally. The exception convention is named only in the optional Linux comparison and is grounded
by the first lesson's startup/exception explanation. The one actionable missing prerequisite was
`stepi` at its first use above; it is now explained before the question.
