# Independent review: reference program headers

Copyright © 2026 Christopher Snow

Reviewed on 20 November 2026 by a separate agent that did not draft or edit the implementation. Review covered the Arm source diff and built reference, and RISC-V `content/reference/notation.json` in source. Prerequisites: simple C and small binary numbers; assembly syntax is not assumed.

## Learner review

No blocking findings in the Arm change. The three definitions appear immediately before the complete source within the optional Complete example program disclosure. The assembler is defined before directives. Each directive's definition names its effect. The label line is explicitly distinguished from a command, and the selected starting address is explained separately. Opening this help does not ask learners to alter supplied code or reveal an exercise solution.

Unsupported prerequisite check: section is defined locally as the place where the assembler places code; the linker's joining action is described locally. Earlier branch teaching is not required to read the new label definition. The lesson editor remains unchanged, as the disclosure states. This local worked header is sufficient for reading the prepared example; constructing linker scripts and standalone startup are deferred to the existing native chapter.

One low-severity RISC-V finding: notation's placeholder source is `rs1, rs2`, but the reference also uses `rs` in such forms as `beqz rs, label` and stores. Direction: include `rs` in the same source-register definition. No instruction semantics need changing. Parent notified.

## Technical review

- Arm `buildReferenceExample` emits `.text`, `.global reference_example`, `reference_example:`, and immediately `mov x28, x30`. The new description correctly identifies the first instruction's address.
- The example model explicitly chooses `reference_example` as entry; `.global` does not perform that selection. The explanation matches the actual model contract.
- GNU as `.text` selects the text section. `.global` and `.globl` set global symbol binding; labels define the current position. None is itself an executed instruction. The explanation does not use an incorrect heuristic that every name beginning with a dot is a directive, so local labels such as `.Lfocus:` remain compatible.
- RISC-V `site/course/user.ld` contains `ENTRY(_start)`. The note correctly identifies the supplied script as selecting `_start`, and does not claim that `reference_example` automatically starts a guest program.
- The source header explanation does not imply that exporting a symbol calls it, and explicitly disclaims that inference.

No technical blocking findings.

## Independent browser verification

Started a fresh production preview on port 4191 and drove the built Arm page with Chromium. Examined the completed program header for ADD's register form at desktop 1280×800 and phone 375×812 in both light and dark. Saved screenshots and structured measurements under `.artifacts/reference-headers-review/`.

Actual computed body backgrounds were light `rgb(247, 250, 248)` and dark `rgb(16, 27, 26)`, matching selected preferences. Definition text was 15px, inline source 12.9px. Header and document had no horizontal overflow in any of the four cases. Escape closed the panel and restored the Reference button's focus; the pre-existing edited source remained exact. No page errors were observed. Visually inspected desktop/light and phone/dark screenshots for readable spacing and source/prose separation; measurements cover all four states.

The RISC-V notation was read in source only because its new reference build was still being integrated. This review does not claim full-course regression coverage or evidence that novices learned the distinction. No human novice study or assistive-technology session was run.
