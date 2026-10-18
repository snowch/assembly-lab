# Fresh clarity review: The same C on 32-bit Arm

Copyright © 2026 Christopher Snow

Review only, 18 October 2026. Lesson 23, `same-c-on-a32`, on the preview described in [the brief](brief.md). No learner text changed. I formed the assessment from the page and sources before reading [the earlier reader report](../english-review/23-same-c-on-a32.md) and [the later-course sceptic report](../english-review/26-sceptic-late.md).

## Findings and earlier-review reconciliation

No distinct new issue category. One retained terminology issue still occurs here, and one further occurrence of the shared hint-heading issue merits inclusion in its existing group.

### L17 remains: “immediate” has not been connected to “constant”

- Quote: “it writes a 16-bit immediate into the low half of a register and clears the upper half.”
- Location: `content/lessons/same-c-on-a32.prose.ts:38`, `explanation`.
- Severity: low; later occurrence of retained L17, not a new issue.
- Learner effect: the learner has been taught constant-building, but this new noun is not explicitly connected to that concept. The preceding `from-c-to-instructions.prose.ts:11` uses the same noun without defining it. Knowing the mechanism does not supply the vocabulary link.
- Direction: resolve the first-use constant/immediate terminology gap in the earlier lesson, then check that the later usage follows it. No separate A32 rewrite is necessarily needed.

### Additional M6 occurrence: a correct distinction under “Common mistake”

- Quote: “A call instruction and the helper name that follows it are different tokens. The helper field asks for the name.”
- Location: `content/lessons/same-c-on-a32.prose.ts:48`, `finalHints[1]`, rendered under **Common mistake** in the final challenge.
- Severity: low for this occurrence; the broader retained issue M6 has its own severity.
- Learner effect: the heading announces a mistake, while the text states the correct distinction. A reader must infer that confusing the two is the mistake. The surrounding task makes the intended action recoverable, so this is a small heading/content mismatch.
- Direction: have the hint identify the actual confusion, or use a heading that describes the advice. Merge this occurrence into M6, not a separate count. The earlier challenge's second hint explicitly tells the reader what not to enter and does not have this problem.

### Earlier rejected “baseline” concern stays rejected

The label “A32: GCC 15.2, baseline Armv7-A” does not create a separate comprehension problem. The compiler note says `-march=armv7-a` determines which processor features GCC may assume. Before the relevant exercise, the generalisation says “With these A32 settings, GCC does not assume a hardware integer-division instruction is available, so it calls a library helper.” It then identifies the optional divide extension. Those explanations provide the concrete consequence needed to read this example.

## Prior knowledge and clarity checks

Read the front-page prerequisites and relevant earlier teaching. Register widths/views and constants come from Modules 0–1; carry and unsigned conditions from Modules 2 and 4; division from Module 8; calling conventions, link registers, stack alignment and leaf functions from Module 9; recorded compiler settings and local compilation from the compiler lessons. `calls-and-returns.prose.ts:38` explicitly defines a leaf function. The immediate terminology gap is recorded above rather than assumed away.

This page explains execution state, A32 registers, the link-register name, the conditional suffix, the constant instructions, the helper function, register-list braces, and the saved-register return. Its A32 figures are explicitly static and its interactive executions explicitly A64. “Mnemonic” is connected to “instruction names” in the construction task and demonstrated in the hints. “Tokens” in the feedback is unnecessary technical language, but the surrounding task already identifies exactly which instruction names to enter; I do not retain it as another comprehension issue. Thumb is identified as another instruction set without requiring the learner to know its syntax. No additional unexplained prerequisite was found.

The comparison progresses clearly from familiar values and conditions to different syntax. The notes state where the compiler configuration matters, and the page avoids implying that every A32 implementation lacks hardware division. Captions identify which figures execute and which are recorded listings. Both sentence and understanding passes were completed; no other actionable clarity issue was found.

## Coverage and browser evidence

Read all ten sections, objectives, headings, captions, field labels, prediction options and explanations, both task descriptions, all ten hints, both feedback strings, expandable compiler and saved-register notes, reflection, and model-versus-reality note. Read `same-c-on-a32.prose.ts`, `same-c-on-a32.labels.ts`, `same-c-on-a32.ts`, and the shared recorded-answer grader and strings. Checked earlier definitions before judging assumed knowledge.

Used the immutable preview at `http://127.0.0.1:4253/assembly-lab/#/lesson/same-c-on-a32` in four fresh Playwright contexts: 1280 × 900 and 375 × 900, each in light and dark themes. Expanded all details. In every context, checked every option in both predictions, submitted empty and then deliberately nonmatching filled answers to both challenges, opened all five hints for each, and stepped both A64 figures through their default calls to return. Read the resulting page text and visually inspected listing-pair and final-hint screenshots across all four configurations. No width/theme-specific English issue; page width equalled viewport width in each configuration. No exhaustive test-input or external-link exercise is claimed.

Temporary evidence: `/tmp/clarity2-23.mjs`, `/tmp/clarity2-23-{1280,375}-{light,dark}.txt`, and corresponding `-pair.png` and `-hints.png` images. The first browser script incorrectly sought a slider on the button-based stepper; it was corrected, and the complete four-configuration run succeeded. No build, test-suite run, commit or learner-source edit was performed by this reviewer. This report omits challenge answers.
