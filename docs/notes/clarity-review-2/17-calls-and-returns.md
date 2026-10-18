<!-- Copyright © 2026 Christopher Snow -->

# Clarity review 2: Calls, returns and the stack

Reviewed `calls-and-returns` against the front-page prerequisites and earlier lessons only. This is a fresh review of the unchanged chapter at baseline `5cb518c`, followed by comparison with the [first review](../english-review/17-calls-and-returns.md). No learner text changed.

## Findings

### M3 retained — medium: consecutive addresses means something different here

- Source: `content/lessons/calls-and-returns.prose.ts:18`, investigation.
- Quote: “then stores the pair of 64-bit registers at consecutive addresses.”
- Learner effect: earlier teaching explicitly says “Consecutive addresses identify consecutive bytes” (`memory-and-addresses.prose.ts:7`). The new sentence can therefore place the starts of two register values one byte apart. The actual diagram groups each saved value into eight bytes: the two displayed starting addresses are `0x42ffe0` and `0x42ffe8`.
- Direction: describe adjacent register-sized regions and distinguish their starting addresses from consecutive byte addresses. Connect the spacing to transfer width. This is the earlier M3, not an additional issue.

### L16 retained — low: a stack slot has no established size or ordering

- Source: `content/lessons/calls-and-returns.prose.ts:45`, final exercise, fourth hint.
- Quote fragment: “the first pair of slots”.
- Learner effect: the page and preceding lessons explain bytes, addresses and transfer widths, but do not define a stack slot. The learner seeking layout help must infer both the size of a slot and which end of the reserved space counts as first. The later complete-solution hint cannot establish that knowledge beforehand.
- Direction: connect this hint to the existing byte and offset vocabulary, or establish the local slot unit and ordering. Preserve its level of help. This remains L16.

### M6 extra occurrence — low locally: a correct instruction appears under “Common mistake”

- Source: `content/lessons/calls-and-returns.prose.ts:43`, final exercise, second hint.
- Quote: “Writing `w19` also changes `x19`. Save the incoming 64-bit value before using this register for the reserve.”
- Browser heading: “Common mistake”.
- Learner effect: the hint states the correct preservation requirement but does not identify the mistake. A learner must supply that missing contrast while the heading appears to classify the following advice as mistaken. The underlying register rule is taught clearly elsewhere; the mismatch is between heading and hint function.
- Direction: identify the omitted preservation step as the mistake. Group this with the existing M6 hint-heading issue; do not count it as a new issue category. The first exercise's second hint does identify an error (“Do not reserve an arbitrary number of bytes”), so it does not need the same finding.

## Understanding and assumed knowledge

The main return-address explanation is clear: `bl` replaces `x30`, the old value must be saved, and `ret` follows the current value. The changed program then demonstrates the consequence. Caller and callee responsibilities are stated separately and connected to the reserve example.

The page explains caller, callee, link register, stack, stack pointer, frame, frame pointer, alignment, calling convention, inlining and leaf function. “Live values” immediately follows “values needed afterwards”; that local explanation is sufficient. AAPCS64 is named as the target's procedure-call standard, with its purpose explained. The note says that frame-pointer policies may differ without requiring the learner to know those other policies.

Prior knowledge checked against the front-page panel and earlier prose:

- Small C functions, arguments and returns are prerequisites; GCC and recorded listings are taught in Module 0.
- Earlier register-width teaching explains `w`/`x` views and upper-bit clearing.
- Module 6 teaches byte addresses, little-endian order and load/store widths.
- `array-addresses.prose.ts:18` explains pre-index and post-index addressing, supporting the Module 7 cross-reference.
- Unsigned arithmetic and logical right shift precede this lesson.

The retained missing assumption is the stack-slot unit in L16. No distinct new prerequisite gap was found. No previously rejected finding is revived.

## Browser and source coverage

Read the full prose and labels, lesson wiring, displayed C and assembly, starter programs, both prediction explanations, both exercises' five hints, test names, reflection answer and model-versus-reality note. Formed the assessment before opening the earlier chapter review. Shared editor and grading text was read where it appeared in the exercised states; this was not a sweep of every possible assembler diagnostic.

Used Chromium on `http://127.0.0.1:4253/assembly-lab/#/lesson/calls-and-returns` at 1280 × 900 and 375 × 900, each in explicit light and dark themes. In all four configurations:

- Expanded lesson details and read the rendered page.
- Submitted every option in both prediction controls, including matching and non-matching feedback.
- Ran both unchanged starter programs and read their failure feedback.
- Opened all ten hints.
- Advanced all three stack steppers to their terminal states, including the failure recording's instruction limit; read intermediate stack-byte and return-address states.

Reviewed screenshots of the rendered exercises and stack display across desktop/phone and light/dark. The findings are present in all four configurations. No horizontal overflow was reported. Did not edit exercise code, run a submitted successful solution, test every input, or audit keyboard and screen-reader behaviour.

Temporary evidence: `/tmp/clarity2-17.mjs`, body/state captures `/tmp/clarity2-17-{1280,375}-{light,dark}.txt`, full-page screenshots of the same stem, and `-write-call-report.png`, `-write-preserve-reserve.png` and `-stack.png` captures. The text captures include intermediate saved-byte groups; the stack screenshots show the terminal state. No build or test suite was run by this reviewer.
