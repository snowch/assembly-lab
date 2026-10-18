<!-- Copyright © 2026 Christopher Snow -->

# Independent learner review: Counting up

Reviewed only lesson 09, `counting-up`, as a learner who knows the front-page prerequisites and lessons 00–08. Read `CLAUDE.md`, `docs/style.md`, the snippet-alignment brief and the previous `clarity-review-2/09-counting-up.md`. Browser review used the final immutable preview at `http://127.0.0.1:4264/assembly-lab/#/lesson/counting-up`.

## Findings

No new alignment or prerequisite finding survives this review. No high- or medium-severity regression found.

**Low, existing issue only: the noun “trace” remains unexplained.** The rendered model note says, “The simulator limits how many instructions it runs in one trace. Reaching that limit means the trace stopped”. As the earlier review records, a learner must infer whether this means the recorded instructions, the function run or the figure. Direction: explain the bounded record or use the established wording about a run. This is retained L10, not a new alignment finding. The browser review read the note but did not trigger the instruction limit. The earlier review's M6 hint-heading issue is outside the changed snippets; this pass did not expose the hint ladder and makes no new browser claim about it.

## Pairing and experiment context

- The complete function is visibly separate under “Complete C source”. The explanation “The instructions stay in their original order. A C line appears again when later instructions also relate to it” prepares the reader for repeated condition excerpts. At desktop width the excerpt and associated instructions occupy the same row; on the phone each excerpt is immediately followed by its instructions. The repeated line 6 does not pretend to be a second statement in the complete C function.
- The loop's assembly remains in order: initial comparison and branch, `.L3`, shift, increment, later comparison and branch, `.L2`, return. The paired excerpts follow that order. The line containing `tick++` follows the brightness operation in the excerpts, while the complete source retains the original `for` header. This makes the actual order of execution understandable.
- Stepping highlights C line 6 for the test instructions and branches, line 8 for the shift and line 7 for the increment. All occurrences of the same C line highlight together, including the complete source. The last executed assembly instruction is marked separately from the next-instruction arrow. After the backward branch, the next arrow moves to the shift. This does not suggest that both copies of the condition execute at once.
- A separate final-step check highlighted line 9, `return brightness;`, with `ret`; the compiler detail still records line 10. “Returns to the code that called this function” prevents the pairing from implying that `ret` calculates the result.
- This lesson has no instruction associated with several distinct C lines. Its repeated excerpts test multiple displayed copies of one source line, not a multi-source instruction. I make no claim to have tested the latter here.
- The edited experiment remains understandable from its immediately preceding statement: “The program below has its backward branch changed from `bne .L3` to `beq .L3`. The other instructions are unchanged.” Its caption repeats that the backward branch changed. Keeping the original C beside the changed instructions provides the comparison context; the prose does not claim the changed assembly implements that C correctly.

**Considered and rejected: the edited experiment's compiler detail.** I initially questioned the `beq .L3` row under “Compiler's C line references”. The strongest contrary reading holds: “These are the compiler's original line references” promises the original references, not an unedited instruction listing. Those references remain unchanged, and the nearby experiment text explicitly identifies the edit. There is no sufficient basis for a finding that the page calls this instruction compiler-produced. No change requested.

## Assumed knowledge

No new unexplained term is introduced by the alignment presentation. The front-page panel explicitly includes `int`, `unsigned`, returns and `for`/`while` loops. This lesson explains `brightness >>= 1`, `tick++`, loop, body and iteration. Earlier lessons supply shifts, registers, unsigned conditions, flags, labels and taken/not-taken branches.

I checked the earlier explanations before treating the new captions as gaps. `meet-the-machine.prose.ts` calls GCC “a C compiler”, explains the optimisation setting `-O1`, and says: “GCC's original line references are kept in the compiler details.” It also explains that those references can point to a closing brace rather than the performed operation. `branches.prose.ts` defines a label as a name ending in a colon and explains conditional branches using the previously taught flags. `compare-and-choose.prose.ts` defines the unsigned `cs` condition. Thus “C operations”, “instructions”, “line references” and the branch notation need no new prerequisite finding here. The unsupported noun “trace” is the existing issue above.

## Actual checks and evidence

Used installed Playwright with Chromium in four fresh contexts: 1280 × 900 and 375 × 900, each in light and dark themes. Inspected actual screenshot pixels, not just DOM text. Read the rendered lesson, inspected the original and changed listings and their expanded compiler details, and checked the source associations against the visible C.

In every configuration, three result figures initially remained gated. Selecting a prediction left all three gated; pressing “Check your prediction” opened its related figures. The changed-run figure stayed locked until its own prediction was checked. Used these ordinary controls, without storage seeding or altering application state. Advanced the main stepper through the first backward branch and subsequent shift in all four contexts. An additional phone run reached `ret` to check its source highlight. No construction or final challenge was solved, and no challenge answers are included here.

No document or paired-row horizontal overflow and no page JavaScript errors occurred in the checked states. The complete function's long argument line wraps on the phone while retaining its line number. The paired rows remain distinct and readable in both themes. This is a focused review, not a full suite or a claim about every possible run.

Evidence is temporary browser output:

- [Browser script](/tmp/reader09-browser.cjs), [observations](/tmp/reader09/report.json), [final-step script](/tmp/reader09-return.cjs), [final-step observations](/tmp/reader09/return.json).
- [Desktop light original](/tmp/reader09/1280-light-pair.png), [desktop dark backward-branch highlight](/tmp/reader09/1280-dark-step6.png), [desktop light increment highlight](/tmp/reader09/1280-light-step4.png).
- [Phone light original](/tmp/reader09/375-light-pair.png), [phone dark original](/tmp/reader09/375-dark-pair.png), [phone return highlight](/tmp/reader09/375-light-return.png).
- [Phone dark changed compiler references](/tmp/reader09/375-dark-changed-raw.png). Additional original/changed details, step screenshots and rendered text for all four configurations are under `/tmp/reader09/`.

Only this review note was added. No application or test edits, build, full-suite run or commit performed.
