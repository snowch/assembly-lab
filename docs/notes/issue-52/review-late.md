# Issue 52: independent learner review, Modules 5–13 and optional A

Reviewer: independent late-course learner reader. Scope: the 19 lessons below,
read separately in course order, assuming the earlier lessons but none of the later
ones. The reviewer did not draft the changes or read the author's audit rationale.
No product changes were made by this reviewer.

## Source reading

Read each complete prose source, its changed paragraphs and the surrounding activity
sequence. The review asks whether removing the shared stepping footer loses guidance,
whether retained qualifications appear before the relevant activity, and whether the
learner can distinguish instruction results, C rules, compiler records, browser
simulation, native emulation and physical-board evidence. It does not re-certify the
technical sources or native tools.

| Lesson | Knowledge assumed from preceding lessons; local introduction checked | Result of source read |
| --- | --- | --- |
| Counting up | Registers, shifts, unsigned ordering and branches; loop/body/iteration and `for` components introduced here. | Trace and trace-budget meaning now appear before the first instruction-count prediction. Counts are explicitly not elapsed time. No additional untaught prerequisite found. |
| Counting down | Counting up and unsigned wrap; decrement and `do`/`while` explained here. | Local failure text still identifies the recording limit. Feedback distinguishes that limit from the reason a loop cannot return. Removing the duplicate footer loses no required action. |
| Memory and addresses | Register widths, hexadecimal and endian prerequisite introduced locally; bytes, addresses, pointers and brackets explained before loads. | Prepared ordinary memory, access permission and valid typed storage are qualified before the first load prediction. The learner is not invited to treat readable memory as a complete C-pointer validity test. |
| Loading widths | Memory widths, signed/unsigned bits and little-endian layout; extension and cast rules introduced locally. | The chosen sensor-record layout and pre-supplied bytes are now identified immediately before that exercise. No claim that a hardware sensor is connected remains. |
| Array addresses | Loads, shifts and pointers; elements and zero-based indices introduced here. | Prepared-memory checking versus C-array bounds is visible before array predictions. The wrong-scale experiment still distinguishes assembly accesses from valid C indexing. |
| Zero-terminated strings | Byte loads, array indices and loops; string terminator, ASCII and capacity explained locally. | The simulator's inability to validate capacity or a terminator is stated before the first prediction. The later moving-pointer example still states its terminator assumption. |
| Products and widths | Width selection, wrapping and extension; product and high/low halves introduced locally. | Signed C overflow qualification is now visible beside multiplication semantics. The high-half diagram explicitly identifies course-written assembly before use. |
| Division and remainders | Products and width selection; quotient/remainder and signed rounding explained here. | Local exceptional-division text already separates A64 from undefined C cases; the constant-divisor comparison already says it is not a timing claim. Removed footer repeated those distinctions. |
| Calls and returns | Fundamental `bl`/`ret`, memory and paired register stores; stack/frame/convention/alignment defined locally. | The first small-call activity now states that an aligned stack and outer return address are supplied. The GCC frame-layout and platform-specific-register limits are beside the first larger frame. |
| Recursive calls | Calling convention and frames; recursion and base case introduced here. | The preset deepest-point state has explicit Back/Next directions. Fixed prepared stack and the absence of real exhaustion behaviour are explained before the deliberately non-progressing recursion. |
| From C to instructions | Earlier C listings and instruction families; local compiler/working-register model explained here. | Language and resource limits appear before editing. Executed-path checking, not arbitrary-C or all-input proof, is stated before running generated code. |
| Compile a loop | Previous local compiler and loop mechanics. | Evaluation budgets and incomplete-run meaning are now adjacent to compiler use. The later always-true-loop explanation distinguishes a tool cutoff from a mathematical termination argument. |
| C and overflow | Flags, signed limits and compiler comparisons; undefined behaviour and saturation explained here. | The small compiler's limited scope is visible before the direct A64 experiment. Compiler-option guarantees and C rules remain separate from instruction results. |
| Checked arithmetic | Conversions, memory stores, flags and prior undefined-behaviour lesson; promotions, `_Bool` and checked arithmetic introduced locally. | Signed-32-bit exercise scope is beside the exercise. Recorded warning/sanitizer links now locally say the simulator does not run `printf` or the reporting function. |
| From function to executable | Assembly calls and memory; assembler/linker, ELF, startup, terminal tools, UART and firmware introduced locally. | Browser arithmetic versus external boot/device execution is explained before its browser prediction. Startup stops remain explicitly recorded GNU/QEMU/GDB states. QEMU serial output does not verify physical timing or clock setup. |
| Debug native instructions | Working Module 12 image and its loading/startup path; debugger, breakpoint and remote connection introduced locally. | The terminal GDB session and page recording are explicitly distinguished before comparing stops. The browser's arithmetic-only scope remains visible. |
| Raspberry Pi 5 | Module 12 tools, startup and UART; probe connection and board boot chain explained here. | Hardware verification is visibly pending at the outset. Wiring is described as a schematic before use, not as pin orientation or a recorded physical run. |
| Raspberry Pi boot | Pi preparation and Module 12 build tools; raw image, checksum, serial settings and exception level explained locally. | Expected messages are identified as source-derived before building/booting. File checks do not become claims of physical success; actual captures remain required. |
| Same C on A32 | A64 arithmetic, calls and compiler records; execution state, A32 register names and syntax introduced here. | Static A32 versus interactive A64 is stated before the comparison prediction. The syntax probe explicitly tests acceptance, not execution. Target-specific division claims remain qualified. |

No new prerequisite gap or answer leak was found in the changed source paragraphs.
Meaningful lesson-specific reflection questions remain; the removed blocks do not
carry an exercise's only required direction.

## Findings

No blocking, major or minor learner finding remains for this change. The retained
qualifications are available before their relevant activities, and no changed
paragraph requires a later lesson to make sense.

## Final browser evidence

Reviewed the parent-confirmed fresh build at
`http://localhost:4399/assembly-lab/` on 2026-10-28. Chromium used fresh contexts
at 375 × 812 with touch/mobile enabled and 1280 × 900 with a mouse, in actual light
and dark themes. All **76 lesson/viewport/theme visits passed**. The DOM's selected
theme and computed background both changed: light `rgb(243, 246, 245)`, dark
`rgb(16, 22, 21)`. No JavaScript page errors or page-level horizontal overflow occurred.

For every lesson and variant, inspected the rendered retained qualification, its
section and its position before the relevant activity; it was not hidden in a
closed detail. Captured each case. Visually inspected phone and desktop captures
for all 19 lessons, with light and dark represented throughout the set. Text and
code wraps remained legible and contained. Neither removed footer block nor an
empty generic stepping disclosure remained. The existing substantive lesson
reflections and activity directions remained available.

The focused browser run committed **136 prediction choices** and exercised **116
Next/reset sequences**. These were review inputs, not challenge solutions. The
initial gates, feedback, next-instruction status and reset state remained coherent.
The matrix below applies in all four viewport/theme variants:

| Lesson | Interaction and local guidance checked | Outcome |
| --- | --- | --- |
| Counting up | Count prediction gate; instruction step/reset; trace qualification before count. | Pass |
| Counting down | Ordinary and zero-count failure gates; both step/reset paths; cutoff wording. | Pass |
| Memory and addresses | First load and failure gates; load/store step/reset; prepared-memory limitation visible first. | Pass |
| Loading widths | First and failure gates; signed/unsigned load step/reset; record-layout scope before exercise. | Pass |
| Array addresses | First and failure gates; indexed and offset load step/reset; C-boundary qualification. | Pass |
| Zero-terminated strings | First and failure gates; bounded and pointer walk step/reset; capacity/terminator assumptions. | Pass |
| Products and widths | First and failure gates; multiply and multiply-add step/reset; C/assembly distinction. | Pass |
| Division and remainders | First and failure gates; quotient/remainder step/reset; exceptional ISA cases identified locally. | Pass |
| Calls and returns | Prediction/failure gates; small caller and report step/reset; supplied stack/outer return identified. | Pass |
| Recursive calls | Prediction/failure gates; ordinary and preset-stack step/reset; prepared-stack limit before failure. | Pass |
| From C to instructions | Prediction/failure gates; Compile C → Run → Next → Reset in the actual compiler activity. | Pass |
| Compile a loop | Prediction/failure gates; compile/run/step/reset; a large finite count reached the evaluator budget, showed a diagnostic and no assembly trace; restoring the original C produced a runnable trace again. | Pass |
| C and overflow | Prediction/failure gates; direct A64 and compiler-option comparison step/reset. | Pass |
| Checked arithmetic | Prediction/failure gates; conversion/promotion step/reset; checked-add scope before challenge. | Pass |
| From function to executable | Prediction/failure gates; correct and modified arithmetic step/reset; browser/native distinction before use. | Pass |
| Debug native instructions | Prediction/failure gates; selected prepared-startup recording; recorded instruction Next changed the stop label, Reset restored the function breakpoint. The page continued to call this a recording. | Pass |
| Raspberry Pi 5 | Initial hardware-pending notice and source-checked connection/boot material. No simulated Pi execution controls were present. | Pass |
| Raspberry Pi boot | Initial source-derived-output qualification and physical-test instructions; no claim that browser use completed the hardware test. | Pass |
| Same C on A32 | Prediction/syntax-probe gates; A64 limit/average step/reset; static A32 qualification before use. | Pass |

The compiler and recording follow-ups also ran in all four variants. They are
focused interaction checks, separate from the parent's full suite. Temporary raw
records and screenshots are in `/tmp/issue52-late/`; the durable outcome is this report.

## Attempts and fixes

- Initial source discovery tried two stale component/test paths; located the actual
  files with `rg --files`. No product issue or fix resulted.
- Preview availability probe before the parent announced the final build found no
  server on port 4399. The final review started only after the parent confirmed the fresh build.

- A provisional Pi reflection finding claimed the commit had moved out of the footer.
  Rejected after checking `App.tsx` and the built page: the `build-version` footer
  still shows the commit and date. The instruction is valid; no product fix was needed.
- Both browser runs passed on their first completed execution. No product change or
  retry was required to obtain the recorded passes.

## Validation boundary

This independent learner pass does not run the full test suite, build, native tools,
or a physical Pi. Those results belong to their separate checks and records.
