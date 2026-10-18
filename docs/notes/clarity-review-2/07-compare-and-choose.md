# Second clarity review: Compare, and the signed or unsigned condition

Copyright © 2026 Christopher Snow

Fresh independent review of `compare-and-choose`, following [the review brief](brief.md), `CLAUDE.md` and both closing passes of `docs/style.md`. The learner knows the front-page prerequisites and the seven earlier lessons, and no later lesson. I assessed the chapter before consulting [the first reader report](../english-review/07-compare-and-choose.md) and [the retained issue list](../english-review/README.md).

## Assessment

The main explanation is clear. It follows the compare, condition and selection in the same order as the figure. It explicitly distinguishes mathematical input order from destination/source order, and explains the C conditional expression and `bool` locally. Two previously identified wording problems remain. A hint has another occurrence of the existing heading/content mismatch. No separate new issue is proposed.

### M4 remains: equal-input feedback misdirects the learner — medium

Location: `content/lessons/compare-and-choose.prose.ts:74`, `lessFuelFeedback.equal`.

> Equal values give the wrong one. Which source does `csel` take when the condition is yes, and which when it is no?

“The wrong one” suggests that one of the equal inputs is the incorrect choice. Choosing between two equal inputs cannot explain a different returned value. The follow-up pushes the learner towards the selection order without establishing which values their sources actually hold. This can lead to fruitless condition changes.

Direction: identify the failed equal-input result and direct attention to actual source contents, without implying that exchanging equal input values fixes it. Reproduced this diagnostic in the current built page with an accepted incorrect program; see [diagnostic capture](/tmp/clarity2-07-equal.txt). This is retained issue **M4**, not a new issue.

### L8 remains: the GCC qualification has an ambiguous referent — low

Location: `content/lessons/compare-and-choose.prose.ts:125`, the closed `warning_light, and tst and ands` note.

> Two more instructions exist in the architecture: `tst` and `ands`. GCC 16.1 at `-O1` did not use either in any listing here. This is not a claim about GCC's output.

The immediately preceding sentence is a claim about GCC's output. “This” therefore appears to retract it, although the intended boundary seems to concern the instruction examples that follow. The learner has to resolve which claims came from recorded compilation and which illustrate the architecture.

Direction: explicitly identify the examples or descriptions being qualified. This is retained issue **L8**, unchanged.

### Additional occurrence of M6: positive guidance under “Common mistake” — low locally

Location: `content/lessons/compare-and-choose.prose.ts:61`, the second `lessFuelHints` item, rendered under the shared **COMMON MISTAKE** heading.

> The values are `unsigned`, so use the unsigned pair of conditions.

The hint itself gives useful direction, but the heading labels that direction as a mistake. This is a smaller mismatch than a missing mechanism: a careful reader can infer the intended warning from “so use”. It still makes the learner resolve an unnecessary conflict between the heading and its text.

Direction: make the rung identify the mistake its heading promises, while retaining the instruction distinction. Merge this occurrence into existing **M6**; do not create another course-wide issue. The same heading/content pattern was visible in the browser before consulting the earlier issue list.

## Assumed knowledge

No additional unexplained prerequisite found. Relevant assumptions have earlier support:

- C arguments, returns, comparisons, `int`, `unsigned` and `if` are in the front-page prerequisites. The question explains `?:`, and Generalisation explains the Boolean type and comparison result.
- Module 0 explains registers, operand order, incoming arguments, the return register, GCC and optimisation level `-O1`.
- Module 1 explains hexadecimal patterns, signed and unsigned readings, the top bit, register widths and constants.
- Module 2 explains NZCV, subtraction flags, borrow, overflow and persistence. Its first model-versus-reality note defines architecture and QEMU.
- Module 3 supplies the warning-word bit example, AND and the right shift used here.

The chapter itself defines `cmp`, condition, selection sources, `cset`, every condition it uses, and the optional `tst`/`ands` operations. The table of conditions and its closed examples support the signed N/V rule. I did not treat the absence of a further proof as an English defect.

## Coverage and evidence

Read all ten sections in `compare-and-choose.prose.ts`, including all notes, both prediction explanations, both tasks and all ten hints, all three specialised feedback messages, after-pass guidance, the reflection answer and model-versus-reality text. Also read `.labels.ts`, lesson configuration and the applicable figure strings in `packages/views/src/strings.branch.ts`.

Used the immutable preview at `http://127.0.0.1:4253/assembly-lab/#/lesson/compare-and-choose`, in Chromium at 1280 × 900 and 375 × 900, with explicit light and dark themes. In all four combinations:

- Opened all lesson-section notes.
- Submitted the first option of both predictions and read their revealed explanations.
- Ran the initial construction and blank final challenge; opened all five hints for each.
- Stepped the modified-function example through its three instructions.
- Selected each of the condition figure's four preset pairs.
- Captured the opened page text and visually inspected the compare/condition/select figure screenshot.

The equal-input diagnostic was additionally reproduced in a separate desktop browser session. The other specialised feedback strings and after-pass text were inspected in source; this pass did not run every submitted program, every prediction option, a successful construction, or the passed solution stepper. It did not open the condition figure's extra-condition disclosure. Those limits do not affect the quoted findings. No page horizontal overflow occurred in the four checked configurations; the figure remains readable when its stages stack on a phone.

Evidence:

- [Browser script](/tmp/clarity2-07.mjs) and [viewport/theme measurements](/tmp/clarity2-07-browser.json).
- [Desktop light text](/tmp/clarity2-07-1280-light.txt), [desktop dark text](/tmp/clarity2-07-1280-dark.txt), [phone light text](/tmp/clarity2-07-375-light.txt), [phone dark text](/tmp/clarity2-07-375-dark.txt).
- [Desktop light figure](/tmp/clarity2-07-1280-light.png), [desktop dark figure](/tmp/clarity2-07-1280-dark.png), [phone light figure](/tmp/clarity2-07-375-light.png), [phone dark figure](/tmp/clarity2-07-375-dark.png).

No earlier rejected finding is reopened. No learner-facing text was edited.
