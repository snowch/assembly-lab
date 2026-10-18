<!-- Copyright © 2026 Christopher Snow -->

# Second clarity review: From C to instructions

Independent reader, 18 October 2026. Review only, with the front-page prerequisites and earlier lessons as assumed knowledge. Formed the findings before consulting the first review. One existing low-severity issue remains, and one further occurrence belongs to the existing hint-heading issue. No new independent category of problem found.

## Findings

### C19-1 — Low: an established idea gets an unexplained new name

Quote: “`movz` places a 16-bit immediate in a selected part of the destination and clears the other bits.” ([prose](../../../content/lessons/from-c-to-instructions.prose.ts), line 11).

Module 1 calls a number written inside an instruction a constant (`constants-and-widths.prose.ts:16`). Neither that explanation nor the earlier lessons connects “immediate” to the familiar idea. The surrounding paragraph mentions constants, but the new noun still makes the learner infer whether this is another kind of value while learning `movz`.

Direction: use the established term or explicitly connect the new name to the number written in the instruction. This duplicates retained **L17**, still open.

### C19-2 — Low: a correct arithmetic rule sits under “Common mistake”

Quote: “The multiplication and addition both have unsigned 32-bit wrapping results.” (`content/lessons/from-c-to-instructions.prose.ts:25`). The browser displays this second hint under **Common mistake**.

The sentence states the intended rule. A learner interpreting the heading literally could take wrapping to be the error to avoid. The exercise task explains that keeping the low bits is required, so the surrounding context resolves the conflict, but the help requires an unnecessary reinterpretation.

Direction: make the hint identify the mistaken assumption it addresses, without changing the shared platform. This is an additional occurrence of retained **M6**, not a new independent issue.

## Prerequisites and understanding

Read the whole lesson prose, headings, objectives, captions, predictions and their explanations, both exercises, all ten hints, test labels, reflection answer and model-versus-reality note. Read the lesson wiring, compiler playground, compiler editor strings and compiler diagnostic strings. The prose explains the path from parameters through working registers and the local variable to the return register. The completed browser runs show that mechanism and explicitly identify the two calculated results.

- Module 0 explains GCC, listings and optimisation settings. The local note distinguishes the course compiler from GCC.
- Module 1 explains constants, `#`, register widths and `movk`; the missing connection is specifically “immediate” in C19-1.
- Earlier arithmetic and multiplication lessons establish unsigned wrapping. The cap task explains that comparison follows wrapping.
- Local declarations, initialisation, expressions, `if`, loops and `return` belong to the front-page C prerequisites. Earlier call lessons establish parameters and the return register.
- “Intermediate working values” receives its explanation immediately. The investigation explains what the C evaluator checks and when the assembly runs. No separate unexplained-knowledge issue was retained for these terms.

After this assessment, checked [the first lesson review](../english-review/19-from-c-to-instructions.md) and [its accepted issue list](../english-review/README.md). L17 remains applicable; C19-2 extends M6. No previously rejected suggestion is revived.

## Browser coverage

Used Chromium against `http://127.0.0.1:4253/assembly-lab/#/lesson/from-c-to-instructions` at **1280 × 900** and **375 × 900**, each in **light and dark** themes. Read rendered text and inspected screenshots in all four configurations. Document width matched viewport width in each.

In each configuration, checked all offered choices for both predictions, ran both exercise starting points, revealed all five hints for each exercise, compiled both playgrounds locally, ran their unchanged example inputs and stepped both listings to completion. Opened the page details after the playgrounds unlocked, including the supported C subset and GCC comparison explanation. No GCC request was sent. Alternate source programs, successful exercise submissions, statement-editor operations and every diagnostic path were not exercised in this pass; their explanatory strings were read in source.

Temporary evidence: `/tmp/clarity2-19.mjs`, `/tmp/clarity2-19-{width}-{theme}.txt`, full-page screenshots with the same stems, and individual screenshots suffixed `-write-trip-charge`, `-write-cap-charge`, `-play-from-c-to-instructions` and `-play-from-c-to-instructions-wrong`. These captures contain exercised answers; this report does not reproduce challenge solutions. No learner text, code or build output was changed.
