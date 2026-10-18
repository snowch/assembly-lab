# Learner review: lesson 23, The same C on 32-bit Arm

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026 on the immutable preview at `http://127.0.0.1:4267/assembly-lab/#/lesson/same-c-on-a32`. Scope: C/instruction alignment, full source and compiler references, comparison marks, A32 bookkeeping and return notes, prediction gating and A64 current-step presentation. Read `CLAUDE.md`, `docs/style.md` and this review's `brief.md`. Learner perspective assumes only Before you start and lessons 00–22.

## Findings

No new actionable snippet-alignment finding. No high or medium issue observed. Both sentence and understanding passes support the new annotations in this lesson.

- “No C statement is linked to this instruction.” appears beside the A32 save before the helper call. The complete source remains available above it. The accompanying “The A32 call and saved registers” note explains why registers are saved and restored. The separation does not suggest that saving registers performs division.
- “Returns to the code that called this function.” appears beneath both forms of A32 return, including the saved-register return, and beneath A64 returns. The instruction remains associated with the C return line while this note distinguishes returning control from calculating its value. The explanatory prose accurately distinguishes the leaf return from loading the saved address into the program counter.
- “These are the compiler's original line references. They may point to a brace instead of the C operation an instruction carries out.” makes the expanded records understandable alongside the teaching associations. Checked the records against `a32.listings.ts`: the limit's A32 references still point to line 4, while its teaching row uses line 3; the average's A32 records retain lines 2, 3 and 4. Labels and instruction order remain intact.
- “Complete C source” and “The instructions stay in their original order. A C line appears again when later instructions also relate to it.” distinguish the average's full function from its instruction-linked excerpt. All four source lines remain present; the unlinked bookkeeping does not disappear.
- “Step through the A64 version; the A32 record remains static.” correctly describes the interaction. This review makes no claim to have executed A32 or its helper.

The comparison markings remain visible as contrasting instruction backgrounds with a left border in both themes. Their accessible text is “This instruction differs from the other listing”. The desktop places target panels beside one another; each panel keeps its C operation and related instructions together. On the phone the target panels stack, with source text immediately preceding its instruction group. Wrapped function signatures and the conditional expression remain contained in their rows.

## Earlier review and assumptions

The pre-existing low-severity terminology issue remains separately recorded in `docs/notes/clarity-review-2/23-same-c-on-a32.md`: “it writes a 16-bit immediate into the low half of a register and clears the upper half.” The direction remains to connect “immediate” with the already taught constant at its first use. This is a duplicate, not a new snippet-alignment finding. The earlier hint-heading issue was not re-exercised in this focused pass and is not newly asserted here.

The page assumes unsigned arithmetic/comparison, conditional selection, division, link registers, saving registers, stack alignment, compiler settings and the distinction between C return values and machine control flow. Earlier lessons supply those concepts. In particular, `compare-and-choose.prose.ts` explicitly explains the `?:` expression; `meet-the-machine.prose.ts` explains `-O1`; and `calls-and-returns.prose.ts` defines a leaf function. The page itself introduces execution state, A32 register names, the condition suffix, target flags, the helper call, register-list braces and the program counter's role in the saved-register return. No additional unexplained assumption introduced by the alignment work was found.

## Actual checks and evidence

Used installed Playwright through Node and Chromium in four fresh contexts: 1280 × 900 and 375 × 900, each with light and dark selected through the actual theme control. Captured sixteen actual figure screenshots and four expanded-page text snapshots. Visually inspected representative screenshots across all four configurations, including the desktop light expanded compiler records, desktop dark limit pair, phone light division pair and phone dark current-step figure.

In every context:

- Confirmed the investigation initially says “Check your prediction above first. The figure opens once you have checked it.”
- Selected a prediction through its radio control and pressed “Check your prediction”; no storage or application-state bypass was used.
- Stepped the revealed A64 limit figure through all three instructions. After the first step, displayed C line 3 was highlighted, the comparison was the last-run instruction and the selection was marked “Runs next”. The ending page text read “Ran ret. The function returned.”
- Expanded all details, inspected original compiler line references and the saved-register explanation, and confirmed nine visible return-control notes after reveal.
- Measured document width equal to viewport width: 1280/1280 and 375/375. No browser page errors were captured.

Evidence: `/tmp/reader23-snippet.mjs`; `/tmp/reader23-{1280,375}-{light,dark}.txt`; `/tmp/reader23-{1280,375}-{light,dark}-{limit,division,step,division-records}.png`.

The first script used an incorrect label locator for the theme control and timed out before screenshots; the corrected run used the rendered select and completed all four contexts. Two diagnostic counters used unsuitable selectors/text casing (difference-title count and capitalised return match); findings above use the screenshots, accessible page text and actual “Ran ret. The function returned.” text instead. No challenge answers were entered, no challenges/hints suite was run, and no full test suite, source edit or test edit was performed. Only this report was added to the repository.
