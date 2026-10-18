# Reader 04: Subtracting, and the tick counter

Reviewed 18 October 2026 against the immutable preview at
`http://127.0.0.1:4263/assembly-lab/#/lesson/subtracting-and-the-tick-counter`.
One-lesson independent learner review; assumes the front-page “Before you start”
and lessons 00–03, and no later lessons. Read `CLAUDE.md`, `docs/style.md`, the
snippet-alignment brief, the rendered lesson and relevant lesson/prerequisite source.
No application or test files changed.

## Findings

No new finding in the changed C/instruction presentation, compiler-reference
explanation, wrapping, instruction markings or relevant reveal gates.

The existing prose concerns in
[clarity review 2, lesson 04](../clarity-review-2/04-subtracting-and-the-tick-counter.md)
remain outside this change: C04-1 (medium, operand numbering), C04-2 (medium,
“full sum”) and C04-3 (low, hint heading). The first two were confirmed in the
current rendered prose; the third was compared in source and the previous review,
not reopened in this browser pass. They are not new snippet-alignment findings.
No additional fix direction is proposed for this patch.

## What the changed view communicates

The prediction presents one complete C source line with both instructions. Its
heading is “C OPERATIONS”; the phone labels the source “C line 1”. The whole
function, including its closing brace, remains visible. There are no reordered
excerpts or missing source lines, so a separate full-source disclosure is not
needed on this lesson. The label stays above its instructions. At desktop width,
the C line and its two associated instructions share one row; on the phone, the
wrapped source stays directly above that instruction group.

The note “Returns to the code that called this function.” makes the purpose of
`ret` explicit without implying another arithmetic calculation. The optional
“Compiler's C line references” disclosure says:

> “These are the compiler's original line references. They may point to a brace instead of the C operation an instruction carries out.”

Both displayed compiler records retain line 1. This agrees with the one-line
recorded function. The disclosure is legible and contained at both widths and in
both themes.

The only C pair here is a prediction, not a C stepper. There is consequently no
stepped semantic C highlight to verify on this lesson. The negation prediction,
its revealed stepper, and the closing challenge remain assembly-only; they gain
neither invented C source nor compiler-reference disclosures. The negation
stepper's next-instruction marker advances after pressing Next and the changed
register/flag outlines remain visible. Its “Ran … Next …” explanation agrees with
the instruction markers. No instruction-order or label regression was observed.

## Assumed knowledge

The paired source assumes elementary `unsigned` C arguments, arithmetic and
`return`, all stated in the front-page prerequisites. It assumes assembly
operands, argument/result registers, labels, `sub`, `ret`, GCC and instruction
stepping from Module 0; hexadecimal, signed/unsigned interpretations and register
widths from Module 1; and the four flags and column addition from the preceding
lesson. This lesson introduces tick, wrap, borrow and negation where needed.

The new compiler-reference disclosure assumes the difference between teaching
associations and compiler records. Module 0's “How are C statements matched to
instructions?” explains that distinction before this lesson, including that
compiler line references may name a closing brace. No new unexplained prerequisite
was identified in the changed presentation. The existing operand-number conflict
is already covered by C04-1.

## Browser coverage and evidence

Used installed Playwright with headless Chromium at **1280 × 900** and
**375 × 900**, each in **light and dark** themes, with a fresh page/context for each
combination. Completed all four on preview **4263**. The later 4264 multi-label
change was announced after these checks; this lesson has one inline C function
and was not rechecked on 4264.

In each combination:

- Read the initial rendered page and captured the C pair with compiler references
  closed, then opened and captured the compiler-reference disclosure.
- Confirmed the ring, both investigation adders, construction result and negation
  stepper initially displayed their respective locked states.
- Selected and checked an incorrect option for both predictions through the page's
  controls, revealing their dependent figures.
- Advanced the revealed negation stepper once and captured its initial and stepped
  state. This is an assembly-only stepping check.
- Completed the construction through its editor and Run tests control to inspect
  the unlocked result figure. No storage seeding or gate bypass was used.
- Measured document width before and after the interactions: 1280/1280 or 375/375
  respectively. The revealed interactive descendants had no right-edge overflow.
  No page exceptions occurred.

The focused screenshots were visually inspected for both themes and widths. No
full test suite or rebuild was run. This pass does not claim exhaustive arithmetic
control coverage or a new review of every hint.

Temporary evidence is in `/tmp/snippet-reader-04/`:

- [Browser script](/tmp/snippet-reader-04/inspect.cjs).
- [Desktop light pair](/tmp/snippet-reader-04/1280-light-paired.png),
  [desktop dark pair](/tmp/snippet-reader-04/1280-dark-paired.png).
- [Phone light compiler references](/tmp/snippet-reader-04/375-light-records.png),
  [phone dark compiler references](/tmp/snippet-reader-04/375-dark-records.png).
- [Phone dark stepper after Next](/tmp/snippet-reader-04/375-dark-step-after.png).
- For each `{1280,375}-{light,dark}` prefix, `-initial.txt`, `-paired.png`,
  `-records.png`, `-step-initial.png`, `-step-after.png`, `-own.png` and
  `-report.json` retain the page text, focused screenshots and measurements.
  These are review evidence, not repository assets.
