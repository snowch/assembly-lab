<!-- Copyright © 2026 Christopher Snow -->

# Learner review: lesson 18, Recursive calls and separate frames

Reviewed this lesson independently as a learner who knows the front page's “Before you start” and lessons 00–17 only. Read `CLAUDE.md`, `docs/style.md` and this work's `brief.md`. Main browser evidence is the production preview at `http://127.0.0.1:4266/assembly-lab/#/lesson/recursive-calls`; earlier 4265 exploration is not the basis for the final prose assessment.

## Findings

**R08, shared duplicate, medium: the active operation can leave the visible part of a partially scrolled listing.** The status says “Ran str x19, [sp, 16]. Next: mov w19, w0.”, but the executed instruction is above the browser viewport while the “Next” button remains visible. This is an additional occurrence of the known shared scrolling issue, not a new lesson-specific issue.

Reproduction on 4266: submit the first prediction using its normal radio button and “Check your prediction”; in `step-recursive-calls`, move “Instruction position” to 9 and press “Next”. With the controls left in view after slider interaction, at 375 × 900 the listing extends from y = −196.73 to 298.27, the Next button from 314.27 to 358.27, and the executed `str` from −56.02 to −24.02. Moving to position 22 and pressing Next similarly puts `mov x29, sp` at −88.02 to −56.02. At 1280 × 900 the corresponding `str` is at −124.39 to −92.39. The page does not jump. Both themes reproduce it. The learner sees the status but must scroll the page back to recover the actual instruction and its pairing. Direction: reveal the active pair within the intersection of the listing's scroll area and the browser viewport, while retaining the bounded listing and stable page position. Coordinator notified with reproduction and measurements.

**No new lesson-specific alignment or assumed-knowledge finding.** The earlier hint-label concern in `docs/notes/clarity-review-2/18-recursive-calls.md` belongs to the separate clarity work and is not counted again here.

## What the paired presentation communicates

The note says, “The instructions stay in their original order. A C line appears again when later instructions also relate to it.” The full six-line C function is available above the excerpts under “Complete C source”. It lets the reader recover the original ordering instead of mistaking repeated return statements for extra C statements.

The additional note says, “The instruction may combine their operations or serve different paths through the function. Highlighting these statements does not mean they all run at that step.” That qualification matters here: both alternative return statements appear beside `mov w0, w19` and `ret`. Read with the conditional and the preserved branch labels, it makes the shared return path understandable without claiming that both C returns execute. The return annotation, “Returns to the code that called this function.”, explains the control transfer separately from the calculation.

The condition stays paired with `cbnz`; the recursive return expression stays with the shift, recursive call, addition and branch back. The initial saves and the later restores are retained with “No C statement is linked to this instruction.” The motivation explains their purpose, so that label does not imply that they do nothing. `fade_sum:`, `.L2:` and `.L4:` remain visible in their original order.

“Compiler's C line references” is a separate optional disclosure. Its warning that references “may point to a brace” matches the displayed original line-6 references for the return sequence; normal teaching pairs use lines 4 and 5. The details preserve the distinction between the compiler record and the pedagogical relationship.

At phone width each C excerpt sits directly above its instruction group. The long recursive expression wraps without losing its line number or separating it from its paired instructions. Desktop rows retain two aligned columns. Text, borders, highlights and controls remained legible in both themes. There was no horizontal document overflow in the checked configurations.

The failed-recursion recording has assembly alone, with no invented C associations. Its repeated calls and stack context remain available after its own prediction gate. Both exercise starters remain editable assembly; this review did not submit a successful exercise or disclose any challenge solution.

## Assumed knowledge

No new unexplained prerequisite was found in the changed presentation.

- Lesson 17, `calls-and-returns.prose.ts`, supplies the caller/callee relationship, link register, stack pointer, stack frame, saved state, frame pointer and `-fno-inline` context.
- Earlier width and arithmetic lessons establish unsigned wrapping and the `w`/`x` views of a register.
- `shifts.prose.ts` explicitly explains that an unsigned right shift halves the value and drops the remainder. The recursive argument therefore does not require an unexplained rounding convention.
- Earlier branches supply zero/nonzero tests and branch labels. Earlier memory work supplies byte addresses and loads/stores; lesson 17 supplies the stack addressing used here.
- This lesson defines “recursion” and “base case” before the prediction. The new alignment notes explain repeated excerpts, multiple associated source statements and optional compiler line records where they first appear.

## Actual browser checks and evidence

Chromium with installed Playwright, at 1280 × 900 and 375 × 900 in light and dark themes. All four configurations were checked on 4266.

- Verified all three stack figures initially say “Check your prediction above first. The figure opens once you have checked it.” Unlocked them only by submitting the normal prediction controls; no stored-state seed was used.
- Inspected the initial paired listing, complete C disclosure, repeated-source and alternative-path notes, and opened original compiler references.
- In both ordinary stack figures checked recording positions 0, 5, 6, 9, 13, 22 and the end, using Next between selected positions; also checked the failure recording to its end. Measured active instruction/pair, listing, button and page-scroll bounds. The ordinary recordings expose 48 instruction positions and the limited failure recording 32. No Next action in this sampled run moved the page.
- Also ran the primary stepper through all 48 instructions in each width/theme with the listing initially positioned at the viewport top. Every executed instruction stayed visible in that setup; this does not negate the partially scrolled reproduction above.
- Inspected stack context at the supplied deepest-call state, the return sequence and terminal status. Separate active invocation frames remain visible; the main issue is recovering the active instruction when the listing is partly outside the viewport, as described above.
- Read the main prose, captions and task context for whether the changed figures still support the mechanism. Did not rerun a build, unit tests or the full browser suite; did not edit code or tests.

Local evidence: `/tmp/snippet18-reader.mjs`, `/tmp/snippet18-4266-{1280,375}-{light,dark}.json`; screenshots with the same prefix and suffixes `-initial.png`, `-details.png`, `-step-recursive-calls-viewport.png`, `-inspect-recursive-calls-stack-viewport.png` and `-step-recursive-calls-failure-viewport.png`. Full-figure screenshots accompany the viewport captures. Focused follow-up captures use `-complete.png`, `-paired-step.png` and `-stack-context.png`, produced by `/tmp/snippet18-focus.mjs`. These are temporary review artifacts, not repository product assets.

## Focused final fix check: preview 4267

Rechecked the shared R08 occurrence at `http://127.0.0.1:4267/assembly-lab/#/lesson/recursive-calls` in all four width/theme combinations. **The reported occurrence is resolved.** After the same slider positions 9 and 22, Next, Back and Reset all retain the active instruction, its complete paired row and Next in the viewport, without moving the page. Reset also reveals the initial instruction. At 375 × 900, the formerly hidden setup pair now occupies y = 85.28–297.92 and Next y = 314.20–358.20; at 1280 × 900 the pair occupies y = 152.61–297.61 and Next y = 314.08–358.08. All 24 sampled actions have page-scroll delta zero. Inspected final screenshots at both widths and both themes.

The complete six-line C function and optional original compiler references remain accessible in every configuration. Unrelated mapping/prose/gate checks above were not repeated because 4267 retains that material. No open lesson-specific finding remains.

Final evidence: `/tmp/snippet18-final.mjs`, `/tmp/snippet18-4267-{1280,375}-{light,dark}.json`, and screenshots `/tmp/snippet18-4267-{1280,375}-{light,dark}-{9,22}-{Next,Back,Reset}.png`.
