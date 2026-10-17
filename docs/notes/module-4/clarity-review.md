# Module 4 clarity review, 17 October 2026

Final repository validation: `npm run check` passed after all lesson edits, with 1,924 unit
and integration tests and 758 browser tests passing (16 skipped). Formatting, copyright,
platform-copy integrity, strict type checking and the production build also passed.

The author requested the same plain-English review and revision applied to Module 1.
Separate Codex agents reviewed and drafted both lessons using the session's selected model
and inherited effort. No model or effort overrides were set.

## Findings and changes

- Explained `csel`'s destination and two source operands before the construction exercise.
- Corrected the summary: `csel` selects register values; `cset` writes 0 or 1.
- Replaced "any name works" for labels with a simple valid naming convention and the
  restriction on register names.
- Distinguished conditions that exclude equality from their opposites, which include it.
- Connected adding 10 with subtracting minus 10 when explaining `cmn` and signed comparison.
- Put the C function in a code block and separated compiler provenance from its explanation.
  Split the failure experiment's modification, instructions and inputs into separate sentences.
- Simplified the condition figure's instructions, leading with the changed operand order.
- Qualified the fuel-warning hint: testing below reserve first misclassifies empty fuel when
  the reserve is positive. The original claim also covered a zero reserve incorrectly.
- Browser review found the new C signature too wide to read without scrolling on a phone.
  Split the parameters over two lines while retaining the recorded C tokens.

The review rejected introducing every condition before construction: the exercise can be
solved using the unsigned condition already taught. The existing overflow note supports the
N/V comparison rule. The initial compiler-change prediction is exploratory and does not need
the complete derivation before the learner commits a prediction.

## Evidence and validation

The simulator's selection and condition rules, assembler label grammar, recorded compiler
listings and existing facts tests support these changes. Canonical prose and lesson strings
were revised together. The listing assertion now recognises the C code block.
The wrong-test-order fact test also checks a zero reserve to support the qualified hint.
All 225 scoped tests passed. Independent source review found no remaining material clarity,
accuracy or premature-answer issue.
The phone layout correction passed 76 prose and listing facts tests. Browser review covered
both lessons at desktop 1280×800 and phone 375×812 in light and dark themes. The signature was
the only finding; there was no page-level horizontal overflow or page error.
After the correction, the reviewer checked the C block in all four viewport and theme
combinations. Both parameters were visible without horizontal scrolling; no findings remained.
