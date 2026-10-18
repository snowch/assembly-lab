<!-- Copyright © 2026 Christopher Snow -->

# Independent sceptic: later chapters and shared text

18 October 2026. Review against `5cb518c` plus the approved simulator sentence.
Read `CLAUDE.md`, both passes in `docs/style.md` and the [brief](brief.md).
This is an independent check of the reader findings, not a learner-prose edit.
No replacement learner sentences or complete challenge answers are supplied.

Reviewed all fresh reader reports **11–23**, plus the managing session's shared
report **24**. No distinct new issue is accepted by this later-course pass.
The earlier findings remain open; accepted extra hint occurrences extend M6.
One proposed extra occurrence is rejected below. Together with the early
sceptic's one new issue, this leaves **30 distinct English issues: seven medium
and 23 low**, plus the separate stale-status observation.

## Earlier findings that remain open

Checked the quotations against the current source, relevant earlier teaching,
and the implementation where the learner effect depends on it. The following
existing issues remain valid; none adds to the first review's count.

- **M3, medium.** `calls-and-returns.prose.ts:18`: “stores the pair of 64-bit
  registers at consecutive addresses.” The established rule is “Consecutive
  addresses identify consecutive bytes” (`memory-and-addresses.prose.ts:7`).
  Pair storage uses adjacent eight-byte regions, whose starting addresses are
  eight bytes apart. The reader can therefore infer the wrong layout from this
  sentence. Describe adjacent regions and connect their spacing to transfer width.
- **M5, medium.** `division-and-remainders.prose.ts:38,40`: “writing `w1` clears
  the upper half of `x1`” and “`w1` holds unsigned distance in metres.” The first
  statement teaches an executed write, not a guarantee about incoming upper bits.
  `constants-and-widths.prose.ts:66` likewise says “Writing a `w` name always
  clears the upper 32 bits of the `x` register.” The first final-exercise case
  deliberately supplies extra upper bits through `x1`
  (`division-and-remainders.ts:272–279`). State what the narrow input contract
  guarantees and why using it at wider width needs preparation. Do not give the
  exercise implementation away.
- **L12, low.** `memory-and-addresses.prose.ts:71`: “C requires a valid object
  of a suitable type.” Pointer and byte-address teaching does not explain C's
  specialised “object” or these validity/type restrictions. Give the ordinary
  storage/type meaning needed here, without introducing a full C memory model.
- **L13, low.** `loading-widths.prose.ts:77`: “how every C compiler lays out a
  structure” and “managing memory allocation”. The front page expressly excludes
  structs and `malloc` from prerequisites. The local record layout explains the
  supplied bytes, not these two concepts. Explain the limitation using the
  supplied memory, or briefly identify the concepts.
- **L14, low.** `products-and-widths.prose.ts:27`: “Its operands are destination,
  first factor, second factor and value to add.” Earlier investigation teaches
  the combined instruction, but no preceding hint names it; the task also allows
  separate operations. This is a local referent problem. Identify the instruction.
- **L15, low.** `products-and-widths.labels.ts:86`: “Multiply inputs that also
  fit in 32 bits”. Every input in `wideCases` fits in 32 bits. The distinguishing
  property is the product's width, not the inputs' width. Name that property.
- **L16, low.** `calls-and-returns.prose.ts:45`: “the first pair of slots”.
  Bytes, transfer widths and stack frames have explanations, but neither the
  slot's size nor the meaning of “first” has been established. Use the established
  byte/offset vocabulary or define this local unit and ordering.
- **L17, low.** `from-c-to-instructions.prose.ts:11`: “a 16-bit immediate”.
  Earlier `constants-and-widths.prose.ts:16` calls a number written inside an
  instruction a constant. No earlier lesson defines the new noun. The surrounding
  constants paragraph helps but leaves the terminology connection implicit.
  Make that connection or retain the known term. The occurrence in
  `same-c-on-a32.prose.ts:38` belongs to the same issue, not another count.
- **L18, low.** `checked-arithmetic.prose.ts:41`: “GCC normally allows recovery
  after many reports”. The termination contrast suggests continuation but does
  not say whether recovery repairs the operation. The local sanitizer definition
  explains inserted checks, not recovery. State the execution behaviour after a
  report and preserve the limitation to executed paths.

## Hint headings: retained M6, additional locations

The second and third shared headings are “Common mistake” and “Smaller example”
(`platform/lesson-runtime/src/strings.ts:122`). The following recommendations
belong to the existing **M6** category. Do not count each occurrence as a new
issue. Local severity is low for the added locations; the original memory-hint
mismatch remains part of the medium category.

| Lesson and source | Quotation | Decision |
| --- | --- | --- |
| Memory, `memory-and-addresses.prose.ts:34,35,59` | “Use the value in `w1` as the source and the address in `x0` as the destination”; “Put the address register inside square brackets”; “Load four bytes from the address in `x0`” | Retain the original M6 occurrences: correct actions are called mistakes, and generic syntax advice is called an example. |
| Loading widths, `loading-widths.prose.ts:34,64` | “Choose the byte load that fills the added bits with copies of the sign bit”; “The gradient needs a signed byte load” | Accept additional occurrences. Both give the desired rule without identifying the error. The next rungs at lines 35 and 65 also give task guidance rather than a smaller example. |
| Division, `division-and-remainders.prose.ts:25` | “Keep the original dividend available for the final subtraction” | Accept: the heading appears to prohibit the recommended action. |
| Calls, `calls-and-returns.prose.ts:43` | “Writing `w19` also changes `x19`. Save the incoming 64-bit value before using this register for the reserve” | Accept narrowly: the register effect and preservation instruction are correct, but the omitted preservation step is not identified as the mistake. |
| Recursion, `recursive-calls.prose.ts:43` | “The recursive call counts only the levels after the current one” | Accept: the correct meaning of the recursive result appears to be the error. |
| Local compiler, `from-c-to-instructions.prose.ts:25` | “The multiplication and addition both have unsigned 32-bit wrapping results” | Accept: a required arithmetic rule appears under a heading calling it a mistake. |
| Compiled loop, `compile-a-loop.prose.ts:25` | “Start the total at zero and check the zero-count case before the body” | Accept: correct actions appear to be the mistake. |

The smallest correction is to make each affected hint perform its heading's
function while preserving its level of assistance. Do not edit the vendored
platform merely to accommodate these lesson hints.

This is not a demand for a uniform hint sentence pattern. For example,
`array-addresses.prose.ts:43` says “Do not read the first element when the count
is zero”, and `zero-terminated-strings.prose.ts:25` says “A zero capacity permits
no read, even to check for a terminator.” Both identify the prohibited action.
The corresponding clean reader decisions are supported. The products and checked
arithmetic hints likewise identify a misconception or an operation that causes
the error, and their third rungs supply actual examples.

**Reject the proposed A32 M6 occurrence.**
`same-c-on-a32.prose.ts:48` says “A call instruction and the helper name that
follows it are different tokens. The helper field asks for the name.” Unlike a
bare positive instruction, this names the two things that must not be confused
and immediately identifies which the field requires. The heading works as a
warning against that confusion. The generalisation has already distinguished
the call instruction from the helper's name. Requiring an explicit negative
sentence here would be stylistic uniformity, not a necessary clarity fix.
Reader 23's proposal remains in its report; this decision excludes the location
from the accepted M6 additions.

**Keep the earlier A32 baseline rejection.** The label “A32: GCC 15.2, baseline
Armv7-A” has a sufficient local explanation. The compiler note explains that
`-march=armv7-a` selects assumed processor features. Before the exercise,
`same-c-on-a32.prose.ts:40` says “With these A32 settings, GCC does not assume a
hardware integer-division instruction is available”, and contrasts implementations
with the optional divide extension. The learner is given the relevant consequence;
no unexplained architecture taxonomy is needed. Reader 23 correctly preserves
this rejection. Its later use of “immediate” remains part of L17.

Reader 21's clean result is also supported. Its overflow discussion explicitly
defines undefined behaviour, the compiler setting's guarantee, the bounds used
for checking, and saturation. The optional parser example explains its algorithm
before describing the failure. Neither the “Common mistake” nor the “Smaller
example” hints leave their function implicit.

## Independent check of shared report 24

The managing session's [shared report](24-shared-text.md) is accurate about its
scope and retained statuses. Independently ran its stated diff from `d0bf76b`
for `packages/machine/src/strings.ts`, `packages/views/src/strings.ts` and
`packages/compiler/src/strings.ts`; it is empty. Unchanged text alone is not the
reason to retain the findings: the following context checks support them.

- **L4, low:** the shared stepper note says “registers, flags or memory”
  (`packages/views/src/strings.ts:11`). Early lessons expose that note before the
  flags lesson explains the term. Retain as one shared issue, already included in
  the early sceptic's reconciliation; do not count it twice.
- **L19, low:** “a shift or an extend”, “an extend such as” and “is not an extend
  a load or store can use” (`packages/machine/src/strings.ts:54,68,89`). The
  earlier loading lesson defines zero/sign extension, not “an extend” as a noun.
  Use the taught terminology while retaining each operand-form distinction.
- **L20, low:** “The machine does not keep instruction bytes” (`:112`).
  Module 0 says instructions are stored in memory; `run.ts:153–159` shows that
  this particular failure is a simulator representation limit. Identify that
  simulator limitation rather than suggesting a rule about real processors.
- **L21, low:** “missing something, or has too much” (`:36`). The consumers in
  `assemble.ts:367–450` include missing and malformed directive operands as well
  as excess operands. Name the required part or form. A count-only replacement
  would not cover every current consumer.
- **L22, low:** “This line is not an instruction the chips can build”
  (`packages/views/src/strings.ts:157`). The visible mode is Tap and its chooser
  is labelled Instruction. “Chips” has no established interface meaning and can
  suggest processor hardware. Refer to the visible controls or mode.

The front page still says “The other modules are planned”
(`apps/course/src/strings.ts:23`) while all thirteen module entries are labelled
Published draft. The current lesson registry covers those modules. Retain this
separate content-state observation outside the English issue count.

The prerequisite disclosure still contains the same knowledge requirements; it
changes their visibility, not the assumed curriculum. The offline strings at
`apps/course/src/strings.ts:90–104` separately identify saving, readiness,
failure, unsupported browsers, waiting updates, internet-dependent links/GCC,
and browser-data removal. Their actor and required action are clear. No extra
clarity issue is justified by those strings. This review does not revalidate
the implementation of offline caching.

## Independent understanding pass and evidence limits

Read the later explanations and checked their prerequisite chains separately
from the readers' conclusions. Pointer addressing and bounds are established
before the array/string tasks; the string lesson explains capacity, ASCII and
terminators locally. Multiplication distinguishes operand width, result width
and conversion order. Division defines its arithmetic nouns and separates C
requirements from A64 results. Calls supply caller/callee, alignment, frames and
preservation before recursion reuses them. The compiler chapters distinguish
source evaluation from machine execution and explain instruction budgets. C
overflow and checked arithmetic explain their headers, new settings, conversions,
boolean reports, format strings and run-time checks where needed. No additional
independent assumed-knowledge issue survived beyond the retained items above.

Independently read the built calls, local-compiler and A32 pages at 375 pixels in
dark mode, and the expanded front-page prerequisites. These checks confirmed the
quoted pair-store and immediate wording, A32 division explanation, current module
labels and offline footer. Temporary script and text captures:
`/tmp/clarity2-sceptic-late.mjs` and `/tmp/clarity2-sceptic-late-*.txt`.
Reader reports supply the four-configuration interaction coverage; this sceptic
does not claim to repeat all of it or every assembler diagnostic. No app build,
test suite, GCC request or learner-content edit was performed.
