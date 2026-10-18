# Reader 12: Loading different widths

Reviewed 18 October 2026 against the immutable production preview at
`http://127.0.0.1:4264/assembly-lab/#/lesson/loading-widths`.
Fresh one-lesson learner review, assuming only “Before you start” and lessons 00–11.
Read `CLAUDE.md`, `docs/style.md` and this work's `brief.md`. No application or test
files were edited and no challenge solutions were submitted.

## Verdict and findings

No new snippet-alignment finding. The C operations, instructions and raw compiler
references are distinguishable, the complete C remains available, and stepping
highlights the operation instead of the closing brace. No material regression was
observed in the scoped browser checks.

One existing low-severity prerequisite gap remains, already recorded as C12-1 in
[the second clarity review](../clarity-review-2/12-loading-widths.md), and is not a
new alignment issue:

- Exact quotes: “It is not a claim about how every C compiler lays out a structure.”
  and “The prepared bytes and addresses let you study loads without also managing
  memory allocation or a hardware sensor.”
- Severity: low. C structures and memory allocation are invoked without a local
  explanation, although the prerequisite panel explicitly excludes structs and
  `malloc`.
- Direction: explain the limitation using the supplied layout and addresses, or
  briefly identify the unfamiliar concepts. No new syntax lesson is needed.

The previous hint-heading issue C12-2 was not re-reviewed: challenge hints were
outside this focused snippet pass. It is not counted as a new finding.

## What the changed presentation communicates

The nine C-bearing steppers and two static C listings retain all four source
lines, including the function declaration and both braces. They use inline
source rather than repeated excerpts; a separate “Complete C source” disclosure
is unnecessary for these examples. The function labels remain present and the
instruction order is unchanged in the inspected figures.

For example, `return *gradient;` sits with its load and return. After the load,
C line 3 and that instruction are highlighted; after the return, line 3 and
`ret` are highlighted. The accompanying exact wording, “Returns to the code that
called this function.”, explains the return instruction's role. The earlier
Module 0 note already says that `ret` does not calculate or move the result.

The optional “Compiler's C line references” disclosure says, “These are the
compiler's original line references. They may point to a brace instead of the C
operation an instruction carries out.” Opening it shows the recorded line 4
references while the teaching view highlights line 3. This is a clear, useful
distinction rather than a conflicting claim about which operation ran.

Inspected unsigned and signed byte loads, unsigned and signed two-byte loads,
the four-byte signed load into `x0`, the signed byte load into `x0`, the signed
byte cast, the signed 32-to-64 conversion, and the extended addition. Their C
operations remain legible together with their respective instructions. The
static unsigned-byte cast listing keeps GCC's `and` instruction. The separately
identified course-written unsigned-byte extension and the failure experiment
remain assembly-only, with no invented C mappings.

## Prerequisite assumptions checked

The page relies on C return statements, arguments and integer types; assembly
labels and return control; GCC and its optimisation setting; signed bit readings
and hexadecimal; the `w`/`x` register relationship; and pointers, `const`, byte
sizes and memory brackets. These are covered by the prerequisite panel and
previous lessons, not excused by later content:

- Module 0 identifies “GCC, a C compiler” and explains that `-O1` “asks GCC to make
  the code shorter and faster.” Its matching note explains compiler references
  to the closing brace and the difference between calculating a return value
  and returning control.
- The earlier bit-pattern lesson defines hexadecimal and the signed reading.
- The preceding memory lesson says “`*distance` reads the value at that address”
  and “`const` says this function cannot change the value through this pointer.”
  It defines brackets, little-endian ordering, and target type sizes, and says
  `w0` and `x0` are views of the same register.
- This lesson introduces zero/sign extension, cast syntax and byte offsets where
  used. Its cast detail explains what a signal is.

No new unexplained prerequisite was found in the changed figure labels or nearby
prose. The existing structures/allocation gap above remains the exception.

## Actual browser checks and evidence

Used installed Playwright Chromium at actual **1280 × 900** and **375 × 900**,
each with light and dark colour schemes in fresh browser contexts. In every
configuration:

- Verified eleven gates and zero visible memory steppers before prediction
  commitment. Chose the first available radio option and pressed each real
  “Check your prediction” button. Both commitments unlocked the corresponding
  figures. No storage seed or DOM-state reveal was used.
- Opened every visible native details disclosure, including compiler references.
- Stepped all eleven memory steppers from the initial state through return,
  recording the highlighted C lines and instructions at every step. Reset each
  and stepped once more for visual inspection.
- Checked all listing/source-cell/compiler-disclosure widths for overflow.
  Document width equalled viewport width, and no inspected listing container
  overflowed. No browser page errors occurred.
- Captured the initial listing and signed byte, signed halfword, wide signed
  byte, signed cast and extended-addition listings. Visually inspected desktop
  light/dark and phone light/dark captures. Phone declarations wrap within their
  source cell; the relevant source is directly above its instructions, with
  clear C-line and instruction labels. Highlighting is visible in both themes.

Evidence is local, not committed: runner `/tmp/snippet-reader-12.mjs`; per-layout
rendered text and state/geometry records `/tmp/snippet-reader-12-{1280,375}-{light,dark}.{txt,json}`;
screenshots `/tmp/snippet-reader-12-{1280,375}-{light,dark}-initial.png` and
`/tmp/snippet-reader-12-{1280,375}-{light,dark}-step-{0,3,5,7,10}.png`.
Representative inspected screenshots are the 1280-light step-0, 1280-dark step-3,
375-light step-5 and step-10, and 375-dark step-0 captures.

This was a focused learner review, not the full automated suite or an exhaustive
challenge/grader audit. Challenge editors were left unchanged and their hints
were not opened.
