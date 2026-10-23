# From C to instructions: independent learner/checker

23 October 2026. Checked the final production site at `http://127.0.0.1:4322/assembly-lab/#/lesson/from-c-to-instructions`. No application edits or build, challenge submissions, hints/answers, or external compiler requests.

Read AGENTS.md/CLAUDE.md, the ten lesson sections and optional notes, challenge task descriptions, lesson source, CEditor, CompilerPlayground and compilerRun. Checked prerequisites against the front-page entry requirements and earlier prose: Module 0 defines GCC, listing, argument/return registers and optimisation settings; constants-and-widths teaches movk and 16-bit halves; products-and-widths teaches unsigned multiplication and wrapping. Basic C control flow is an entry prerequisite. Named locals, temporary working registers, immediate and movz are explained locally before their use. No confirmed new unexplained prerequisite found.

## Final-build browser coverage

Four fresh sequential Chromium contexts at 375×900 and 1280×900, each actual light and dark. Verified html theme and computed body backgrounds: `rgb(243, 246, 245)` and `rgb(16, 22, 21)`. Both playgrounds initially remain locked. Committed both predictions using the first available option; a wrong choice still unlocks inspection.

In every context, opening “Build C from statements” initially selects `unsigned charge = distance * rate;`, beyond the copyright comment and function header. The unsupported-line recovery message is absent. This confirms the earlier low-severity statement-mode entry finding is closed. Direction: retain this executable-statement selection when extending the editor.

Switched back to “Edit C text”, changed the playground's fixed charge, compiled locally and ran. The resulting listing and current-operation source line reflect the edited source. Stepped four instructions: the source-associated product assignment and its destination write agree, and the compact register bank distinguishes the written local from working registers. The current-operation card identifies the upcoming instruction and its own related C line separately from the instruction just run. Back returns position 4 to 3; Reset restores position 0. Desktop paired C/instructions and phone-contained listing remain readable in both themes; the nearby current-operation card preserves source context when instructions are off-screen horizontally. No page horizontal overflow: document widths exactly 375 and 1280 respectively. No page errors or external requests.

## Findings and limits

No remaining high, medium or low finding established in this bounded pass. No challenge answer is recorded here. The small compiler's fixed patterns, local evaluator-before-machine check and separate optional GCC service are correctly distinguished in the inspected prose and source.

Browser coverage was deliberately limited to initial gates, both commits, first playground statement-mode entry, one source edit, local compile/run, four steps, Back and Reset. Did not execute the second playground, exhaust statement-editor operations, submit exercises, open hints/answers, invoke GCC, run a complete execution trace, or run native/full-suite tests. Source inspection supports the evaluator/assembly comparison; this is not an independent compiler correctness audit.

Evidence: `/tmp/course-load-check/check19.mjs`, `check19.json` and `check19-{375,1280}-{light,dark}.png`. All four figure screenshots inspected.
