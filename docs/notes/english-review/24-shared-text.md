<!-- Copyright © 2026 Christopher Snow -->

# English review: front page and shared interface text

Reviewed 18 October 2026 against commit `d0bf76b`. Review only; no course text
changed. The managing session reviewed the shared text separately from the
one-lesson reader passes. These findings require an independent sceptic check.

## Findings

### S1. Low: an input error uses “read” in a different sense from the lesson

Quote: “No result is shown until the word can be read.”

Locations: `packages/views/src/strings.ts:226,267`, shown by the bit-operation and
shift figures after an invalid number is entered.

Effect: these lessons use reading a word to mean interpreting its bits as signed
or unsigned. Here the phrase means the interface cannot parse the entered text.
The sentence does not identify the invalid input or say what action makes a result
appear. A preceding validation message helps, so this is a local clarity issue.

Direction: name the input and the requirement for a valid number rather than
reusing the lesson's technical reading vocabulary for parsing.

Evidence: entered invalid text in both figures at both widths and themes; the
exact sentence appears in `/tmp/english-shared-evidence.json`. The figure code
shows that the message belongs to a failed `parseWord` result, not a bit-reading
operation.

### S2. Low: “an extend” is an internal category used as an English noun

Quotes: “`{text}` should be a shift or an extend, such as `lsl 2` or `sxtw`.”;
“`{text}` should be an extend such as `uxtw` or `sxtx`.”;
“`{text}` is not an extend a load or store can use.”

Locations: `packages/machine/src/strings.ts:54,68,89`.

Effect: the lessons explain extending a value and zero/sign extension. They do not
introduce “an extend” as a thing. The error adds a new noun when the learner needs
to identify the accepted operand form.

Direction: use the already taught extension terminology and make the required
operation or operand form explicit. Preserve the examples and the distinction
between shifts and extensions.

Evidence: direct assembler probes produced `operand.shift` and
`shift.extendExpected`; the first diagnostic was also exercised through the
lesson editor in all four browser modes. Probe log: `/tmp/english-errors.log`.

### S3. Low: the instruction-memory error does not identify the model limitation

Quote: “The machine does not keep instruction bytes.”

Location: `packages/machine/src/strings.ts:112`, in `fault.readInstruction`.

Effect: “the machine” can mean the real processor or the course simulator. “Keep”
does not explain why the attempted load cannot read the instruction address. The
sentence can appear to contradict the course's earlier explanation that functions
occupy memory. The intended fact is about this simulator's representation, not
real processors.

Direction: name the course simulator and its specific inability to read
instructions as data bytes. Avoid suggesting that real processors do not store
instructions.

Evidence: a direct model run produced `fault.readInstruction`; a deliberately
invalid instruction-memory load in the memory exercise displayed the message in
all four browser modes. The model represents decoded instructions separately
from data bytes. No reference solution is reproduced in this report.

### S4. Low: the directive error does not name what is missing or excessive

Quote: “`{text}` is missing something, or has too much.”

Location: `packages/machine/src/strings.ts:36`, in `directive.operands`.

Effect: “something” and “too much” identify neither the part of the line at fault
nor the kind of correction. The learner receives a rejection without an
understandable description of it.

Direction: identify the directive's arguments or required form; distinguish missing
from excess input when the diagnostic information permits it.

Evidence: `.zero` without its size produces this message in both a direct assembler
probe and the browser editor. Browser evidence is in
`/tmp/english-shared-errors.json`.

### S5. Low: “chips” names a visual implementation rather than the labelled controls

Quote: “This line is not an instruction the chips can build. Pick an instruction
to replace it.”

Location: `packages/views/src/strings.ts:157`, the assembly tap editor's unsupported
line note.

Effect: the visible mode is labelled “Tap”; “chips” is not a control label or a
concept the course introduces. In a course about processors, it can also suggest
hardware chips. The instruction to choose a replacement is clear, so the obstacle
is confined to the first sentence.

Direction: refer to the visible mode or its buttons by the terms used in the
interface.

Evidence: entered an unsupported line, selected Tap and opened that line in all
four browser modes. The actual note is captured in
`/tmp/english-shared-errors.json`.

## Related content-state observation

The front page says “The other modules are planned”
(`apps/course/src/strings.ts:23`), although every module currently has published
draft lessons. The definite “other modules” suggests an unlisted group. This is
primarily a stale state-dependent sentence rather than a grammar problem. Generate
or condition this part from module status, or omit it when no planned modules
remain. The four front-page captures confirm that no module is labelled Planned.

The early unexplained use of “flags” in the shared simulator note is recorded by
readers 00 and 01; it should be deduplicated into one shared correction rather than
counted for each lesson.

## Coverage and limits

Read all non-test `strings*.ts` files under `packages/views/src`,
`packages/machine/src/strings.ts`, `packages/compiler/src/strings.ts`,
`apps/course/src/strings.ts`, `apps/course/src/runtime-strings.ts`, the plan data,
and the platform lesson runtime's default strings. Checked the source consumers
of the diagnostic and figure messages discussed above. Platform strings about
circuits/signals that are not used by this course are not counted as learner
findings. No platform edit is proposed.

Checked the rendered front page with its prerequisite answer open, invalid-input
bit/shift figures, assembler diagnostics, unsupported tap-editor line and memory
fault feedback in Chromium at 1280 × 900 and 375 × 900, in light and dark themes.
Temporary browser scripts and screenshots are `/tmp/english-shared*.mjs`,
`/tmp/english-shared-front-*.png`, `/tmp/english-shared-{masks,shifts}-*.png` and
the two JSON evidence files named above. Direct-model probe script:
`/tmp/english-errors.mjs`. No course rebuild after the initial review snapshot,
full test suite or course content edits were performed for this shared review.
