<!-- Copyright © 2026 Christopher Snow -->

# Learner review: lesson 15, Products and their widths

Independent reader scope: the changed C/instruction presentation and surrounding explanation, assuming only “Before you start” and lessons 00–14. Read `CLAUDE.md`, `docs/style.md` and this review round's `brief.md`. This review changes no lesson code or tests and contains no challenge answers.

## Findings

No new material finding in the snippet-alignment changes.

The statement **“madd w0, w0, w1, w2 performs both operations”** is supported by the visible pairing: `return total + pulses * scale;` sits beside the combined instruction and `ret`. Both execution steps highlight C line 3; neither moves the highlight to the closing brace. The local return note, **“Returns to the code that called this function.”**, distinguishes the return instruction's job from calculating the expression.

The **“Compiler's C line references”** disclosure preserves line 4 for the recorded multiplication and return instructions while the normal figure uses line 3. Its explanation, **“They may point to a brace instead of the C operation an instruction carries out.”**, makes that discrepancy understandable. The complete function remains available: signature, both braces and return statement. Phone wrapping keeps the expression and its instruction group together.

### Existing findings, not new issues

- Shared **R08, medium**, tall steppers separating the active pair from controls, was already assigned for a shared fix. On immutable preview 4265, the `scaled_total` stepper keeps its active C/instruction pair and all three controls in the actual 900-pixel viewport after Next, at both widths and themes. The page scroll position is unchanged by the step. Full C and compiler details remain accessible through the listing's scroll area. This is a focused local check, not a claim about every course stepper.
- The previous clarity review's **L14, low**, concerns **“Its operands are destination, first factor, second factor and value to add.”** Direction remains to identify the instruction meant by “Its”. This is unrelated to the alignment change and is already recorded in `docs/notes/clarity-review-2/15-products-and-widths.md`.
- That review's **L15, low**, concerns **“Multiply inputs that also fit in 32 bits”**. Direction remains to describe the distinguishing product width. It is likewise an existing issue, not an addition from this pass.

## Assumed knowledge and new words

No additional unexplained prerequisite found in the changed presentation.

- The front-page panel requires small C functions, `int`, `unsigned`, arguments, `return`, and basic arithmetic.
- Lesson 00 explains GCC, `-O1`, instructions, listings, operands, compiler line references and the course's separate C-operation pairing. Its line-note explicitly distinguishes calculating a result from `ret` returning control.
- Earlier lessons supply hexadecimal and signed/unsigned readings, the relationship between `w` and `x`, the effect of writing `w`, and 64-bit `long` on this target. Lesson 12 explains a C cast and sign extension.
- This lesson defines **product**, **low half** and **high half**, explains the new multiplication instructions, and states why conversion before multiplication preserves bits. The combined multiply-and-add listing supplies the concrete expression needed to understand its “both operations” wording.

## Actual browser checks

Used installed Playwright with headless Chromium against immutable preview
`http://127.0.0.1:4264/assembly-lab/#/lesson/products-and-widths`, at **375 × 900** and **1280 × 900**, each in **light and dark**.

In all four configurations:

- Viewed the initial listing and the multiply-and-add listing.
- Opened each prediction by selecting an option and pressing **Check your prediction**. No progress seeding or DOM modification was used to reveal gated content.
- Ran all seven steppers through their returns, including the assembly-only examples. C-backed arithmetic and return steps highlighted the displayed return statement. Assembly-only examples had no invented C highlights.
- Opened the compiler-reference disclosure in the multiply-and-add stepper and checked it against the complete C and recorded listing.
- Captured the initial listing, multiply-and-add listing and active step, unsigned widening step, assembly-only product-halves step and open compiler details. Checked screenshots in both themes and both widths.
- Measured document width equal to viewport width in each configuration; no horizontal page overflow.

Then used immutable preview **4265** for the changed bounded-scroll behaviour, again at both widths and both themes. Checked the locked stepper message before committing the prediction, clicked Next after scrolling its control into view, and captured actual viewport screenshots. The active C line, executed instruction and controls all remained visible. `window.scrollY` was unchanged by Next in all four configurations. Also opened and viewed the compiler disclosure inside the phone listing's scroll area.

The lesson has no changed-token comparison widget to exercise: its signed/unsigned comparison uses separate steppers. The visible instruction names, input order and C casts survive the layout change. This pass did not submit challenge solutions, test arbitrary invalid assembly, or run a full automated suite.

## Evidence

Temporary scripts: `/tmp/snippet-reader15.mjs` and `/tmp/snippet-reader15-4265.mjs`.

Evidence directory: `/tmp/snippet-reader15/`.

- `checks.json`: step counts, highlighted C lines and overflow measurements for preview 4264.
- `{375,1280}-{light,dark}.txt`: rendered lesson text after the interactions.
- `{375,1280}-{light,dark}-{intro,madd-listing,step-scaled-total,step-wide-unsigned,step-product-halves,rawrefs}.png`: figure screenshots from preview 4264.
- `4265-checks.json`: gate text, complete C lines, viewport coordinates and before/after scroll positions.
- `4265-{375,1280}-{light,dark}-viewport.png`: actual post-Next viewport screenshots.
- `4265-375-light-detail-viewport.png`: accessible compiler-reference disclosure on the phone.
