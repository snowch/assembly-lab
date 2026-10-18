<!-- Copyright © 2026 Christopher Snow -->

# Reader 14: Strings and the zero byte

Independent learner review of lesson `zero-terminated-strings`, knowing only
“Before you start” and lessons 00–13. Read `CLAUDE.md`, `docs/style.md` and the
[alignment brief](brief.md). This review changes no lesson code or tests and
contains no exercise solution.

## Finding R14-1: explain alternative-path associations (low)

The listing says:

> The instructions stay in their original order. A C line appears again when later instructions also relate to it.

Its `.L2` row pairs `mov x0, x1` with both:

> unsigned long length = 0;
>
> return length;

In “Inspect a bounded scan with no zero byte within its capacity”, after the
shared move, both C lines are highlighted while `x0` visibly contains
`0x0000000000000003`. The status says “Ran mov x0, x1. Next: ret.” The same
initialisation line is highlighted in the complete C source and its earlier
excerpt. A learner may read the highlighted initialisation as an operation
performed again, despite the nonzero value shown immediately below.

The relation is technically defensible: the shared move supplies the zero value
on the zero-capacity entry path and supplies the length on the capacity exit.
It is a static relation across paths, not a dynamic claim that both C operations
executed. The page explains repeated lines, but does not explain that distinction.
Earlier “Branches” says “Both paths end at the one ret under .L7.” That establishes
shared control flow, but does not explicitly explain the meaning of simultaneously
highlighted C operations belonging to alternative paths. The discrepancy here is
more noticeable than several return statements sharing a `ret`, because one
highlighted statement appears to set a value contradicted by the register.

Direction: explain locally, or beside multi-source rows, that related C lines can
belong to different paths through a function. Preserve the checked mapping and
recorded compiler output. No dynamic C execution model is requested. This is a
clarity improvement, not an instruction or compiler accuracy failure. The
coordinator's sceptic independently accepted the concern at low severity.

Evidence: `/tmp/snippet-reader-14-4265-375-light-shared-return.png` and its
`375-dark`, `1280-light`, `1280-dark` counterparts show this state. The JSON files
with the same configuration prefix record the highlights and viewport bounds.

## Shared issue and prior review

The tall-stepper separation is the known shared **R08**, not a new lesson finding.
On preview 4265, the bounded listing scrolls internally to the active pair. After
an ordinary Next click, the active instruction and Back/Next/Reset are visible
together in both themes at both widths. At 375 pixels the shared move sits at
roughly y=372–404 and the controls at y=428–472. Full source remains accessible by
scrolling the listing back to its top. This focused observation supports the
shared fix for this lesson; it is not a claim about every other figure.

The [previous clarity review](../clarity-review-2/14-zero-terminated-strings.md)
reported no lesson-specific issue. R14-1 concerns the newly introduced paired
mapping and highlight presentation, so it is distinct. No previous prose finding
is re-filed.

## What the learner needs to know

No further unexplained prerequisite was found in the reviewed wording.

- The prerequisite panel supplies small functions, `int`, `unsigned`, `return`,
  `if`, `else`, loops and array indexing.
- Lesson 00 explains GCC, `-O1`, compiler line records, and `ret` returning control.
  Its details define `-O1` as requesting shorter and faster code.
- “Memory and addresses” defines pointers, `const`, the AArch64 Linux target,
  little-endian byte order, target type widths, and `w0`/`x0` as views of one register.
- “Loading widths” supplies byte loads and zero extension. “Array addresses”
  supplies indices, byte offsets, pointer increments and post-index addressing.
  Earlier branch lessons supply `cbz`, `cbnz`, labels and the `bne`/`b.ne` notation.
- This lesson defines string, terminator and ASCII in its opening prose. “The C
  loop and its boundary” defines capacity and `break`. The moving-pointer prose
  explicitly says that the byte is read before the pointer advances.
- The new “C operations”, “Complete C source”, compiler-reference and return
  wording uses previously taught terms. Alternative-path interpretation of a
  multi-line association is the specific gap captured by R14-1.

## Actual checks

Read all ten sections, both notes, captions and tasks, relevant recorded and
assembly-only listings, and the shared source-display strings. Checked the
surrounding explanation of capacity, the first-zero rule, empty strings, byte
versus character counts, and the prepared-memory assumptions. No challenge was
solved and no hints were revealed for this pass.

Used installed Playwright with real headless Chromium and screenshots. The full
pass ran against immutable `http://127.0.0.1:4264/assembly-lab/#/lesson/zero-terminated-strings`
at **1280 × 900** and **375 × 900**, each in light and dark. In every configuration:

- Started with fresh storage. All five steppers were gated and none rendered.
- Selected an offered radio option and pressed Check your prediction in both
  predictions. This legitimately opened their figures; no storage seed was used.
- Opened notes and compiler details. Confirmed the complete nine-line C function,
  including braces, remains available. Phone wrapping keeps C line numbers with
  the wrapped operation, and each C excerpt with its instruction group.
- Confirmed the ten recorded instructions and all four labels remain in their
  original order. The optional compiler references remain `2, 4, 3, 5, 5, 6, 4,
  4, 3, 9`, separate from the teaching associations. In particular `ret` remains
  recorded against line 9 while paired with `return length;` on line 8.
- Advanced all five steppers to completion: bounded scan, moving pointer, empty
  label, changed loop, and capacity-limited scan. The recorded state counts,
  including the initial state, were 32, 26, 6, 22 and 21 respectively. Reset was
  also exercised. The C highlights follow the reviewed relation, including loop
  re-entry and the shared return. The three assembly-only steppers acquire no C
  pane or invented mapping.
- Captured complete listing and stepper screenshots, plus the actual viewport
  after Next. No browser page errors and no horizontal document overflow occurred;
  measured document widths matched 1280 or 375. The inspected source cells,
  compiler details and listings had no horizontal overflow.

After the coordinator supplied immutable preview **4265**, checked the updated
bounded stepper in all four configurations. Used a normal Next click, keyboard
activation of Next through the intervening states, and a normal click for the
shared move. Captured the viewport and the full-source panel after scrolling back
to its top. This checks the shared scrolling change and R14-1; unaffected full-page
checks above remain evidence from 4264. No automated suite was run.

Evidence scripts: `/tmp/snippet-reader-14.mjs` and
`/tmp/snippet-reader-14-4265.mjs`. The original pass wrote
`/tmp/snippet-reader-14-{1280|375}-{light|dark}.{json,txt}`, with `-initial.png`,
`-details.png`, `-next-viewport.png`, and `-step-{0..4}-end.png` screenshots.
The follow-up wrote `/tmp/snippet-reader-14-4265-{1280|375}-{light|dark}.json`
and `-next.png`, `-shared-return.png`, `-complete-c.png` screenshots. Inspected
screenshots in both themes and widths, including the expanded compiler detail,
wrapped phone listing and the actual active-pair/control viewport.

## Independent fix check: final immutable preview 4266

**R14-1 closed.** Checked the rendered lesson at
`http://127.0.0.1:4266/assembly-lab/#/lesson/zero-terminated-strings` in Chromium
at 1280 × 900 and 375 × 900, light and dark. The listing now explains:

> Several C statements can relate to one instruction. The instruction may combine their operations or serve different paths through the function. Highlighting these statements does not mean they all run at that step.

This distinguishes combined operations from alternative paths in plain English.
The final sentence directly answers the misleading interpretation identified in
R14-1. It explains a static association without introducing the phrase “static
association” or claiming that the highlights are a C execution trace. “Paths
through the function” is supported by the earlier branch lesson. No additional
term needs explanation here.

Read the note in the initial listing and in the bounded stepper. In all four
configurations, legitimately opened the figure through its prediction, then
advanced to the nonzero-capacity shared move. The two C lines remain highlighted,
and the visible register remains nonzero: with the new explanation, this no
longer claims that `length = 0` executed on that path. The correct mapping is
preserved.

The scrolling fix remains effective. An ordinary Next click leaves the active
shared instruction and Back/Next/Reset together in the viewport: at phone width,
the instruction is at y≈372–404 and controls at y≈428–472. Scrolling the listing
back to its top still exposes the complete nine-line source, including the final
brace. Phone text wraps within its panel; the new paragraph is readable in both
themes. No new actionable finding from this focused check.

Evidence: `/tmp/snippet-reader-14-4266.mjs`; for each width/theme,
`/tmp/snippet-reader-14-4266-{1280|375}-{light|dark}-listing.txt`, `.json`, and
screenshots ending `-initial.png`, `-next.png`, `-shared-return.png` and
`-complete-c.png`. Inspected actual screenshots of the new note, step context and
full-source access. No code, tests or exercise solutions were changed; no full
suite was rerun.
