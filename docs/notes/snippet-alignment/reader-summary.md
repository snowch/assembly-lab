<!-- Copyright © 2026 Christopher Snow -->

# Independent learner review and sceptic decisions

This review concerns the new C/instruction associations, their presentation and
the changed explanation. It does not reopen the separate whole-course prose
backlog. Readers use only the front-page prerequisites and earlier lessons.
Each reader owns one lesson, uses a real Chromium browser, and records actual
interaction and screenshot coverage at 1280 and 375 pixels in both themes.

The coordinator did not author the application changes. It challenged each new
finding against the page, implementation and earlier explanations, inspected
the material screenshot evidence, and reconciled duplicate reports. The four
accepted findings are ranked below. Individual reports retain their original
observations and subsequent checker results.

## Accepted findings

1. **R00, medium: C crossed the visual function boundary after deleting `ret`.**
   The first function's trailing `return` and brace appeared inside the next
   function's box, below the crossing arrow. Correct instruction order did not
   rescue the misleading source ownership. Multi-label examples now retain
   complete C separately and pair only checked excerpts. Reader 00 independently
   verified the correction on preview 4264 in all four configurations.

2. **R08 / SA08-1, medium: tall paired listings separated the active operation
   from Next.** Reader 08 measured the early C/instruction pair far above the
   viewport while the controls remained visible; reader 10 independently
   confirmed the problem. Readers 13 and 18 supplied further occurrences.
   Bounded stepping regions now reveal the current pair by changing only the
   listing’s scroll position and preserving focus. Follow-up review caught a
   residual when part of the region was outside the browser viewport; the reveal
   now uses their visible intersection. Original readers 08 and 10 and the
   recursive-calls reader 18 independently verified the final correction on
   preview 4267 in all four configurations. Other readers' focused checks and
   limits appear in their reports. This is one shared interaction issue, not
   one per chapter.

3. **R01, low: the new comparison disclosure had a small phone target.**
   “How the instructions relate to C” measured 27.9 pixels high. Its summary now
   measures 44 pixels and has visible keyboard focus; reader 01 independently
   checked both keyboard operation and all four viewport/theme combinations on
   preview 4264. The technical reviewer rated this medium; this synthesis uses
   low because the control remained visible and operable, although it violated
   the repository's minimum target requirement. The correction was required
   under either rating.

4. **R14-1, low: multiple highlighted C lines could suggest that alternative
   statements all executed.** The bounded string scan highlighted both a zero
   initialisation and a return while the register held a nonzero length. The
   checked static association is correct across paths; the learner needed its
   meaning explained. A conditional note now distinguishes combined operations
   from alternative paths and says that the highlighted statements need not all
   run at that step. Reader 14 independently checked the note and the original
   state on preview 4266 at both widths and in both themes. The map is unchanged.

## Considered and rejected

- **Compiler-detail provenance in changed-program experiments (readers 07 and
  09).** The disclosure promises “the compiler's original line references”, not
  an unmodified instruction listing. The reference tags are unchanged, and
  nearby prose explicitly identifies the changed operand or branch. The
  proposed inaccurate-provenance finding therefore does not survive the exact
  wording and context. Do not strengthen the disclosure to claim the displayed
  modified instructions are original compiler output.
- **Requiring every duplicate source occurrence or next function to remain
  visible.** The current operation must be understandable at the step controls.
  A distant next function may be outside the internal scroll region while its
  name remains in the next-instruction status. The following step reveals it.
  This does not reorder or hide the listing. In the local compiler, the compact
  current-instruction card can supply the instruction and matching C beside the
  controls even when the full listing's duplicate occurrence is above the
  viewport. This is distinct from R08's original absence of that relationship.
- **Treating shared source associations as a wrong mapping.** Combined
  decrement/condition work and shared returns legitimately connect one
  instruction with several C lines. Technical mapping review checked these
  relations. R14-1 required an explanation of their meaning, not fabricated
  dynamic C execution or removal of valid associations.

## Prerequisites and existing prose findings

The new labels rely on C statements, functions, braces and source line numbers,
then on Module 0's explanations of a compiler, listings and return control.
The new alternative-path note occurs only with a multi-line association; the
earlier branch teaching supplies paths through a function. The sceptic checked
these earlier explanations rather than assuming assembly or compiler knowledge.
No additional unsupported prerequisite survived beyond R14-1's clarified
interpretation of multiple associations.

The earlier clarity reports remain the source of the unrelated wording backlog.
For example, the undefined early use of “flags”, hint-heading mismatches,
subtraction wording and later C terminology are identified as baseline items in
the reader reports, not counted as new regressions. The old Module 0 caption
issue L3 is resolved: the caption now identifies highlights rather than a
theme-dependent “dark” chip. This focused review is not a claim that all prior
prose recommendations have been implemented.

## Coverage and limits

All **24 lessons** have a fresh one-lesson reader report. The four accepted
reader findings, **two medium and two low**, are corrected and independently
checked in built previews. No new actionable reader finding remains open.
The reviews are focused learner checks, not exhaustive challenge-input,
browser-engine or simulator tests. Each report
distinguishes ordinary gate interaction, any reference-program use to inspect a
revealed figure, actual screenshots, source review and untested states. Reports
contain no challenge answers. Temporary screenshots and scripts are evidence,
not repository assets.

Each row includes both widths and themes. The preview column identifies the
immutable builds actually inspected; it does not claim that every lesson or
every interaction was repeated on the final build. Later shared changes received
focused independent checks on the affected paths, and the reports state their
scope. Model and effort were inherited without overrides.

| Lesson | Independent reader | Preview coverage |
| --- | --- | --- |
| 00 Meet the machine | [Reader 00](reader-00-meet-the-machine.md) | 4263; grouping correction checked on 4264 |
| 01 Same bits, two readings | [Reader 01](reader-01-one-pattern-three-readings.md) | 4263; target and keyboard correction checked on 4264 |
| 02 Constants and widths | [Reader 02](reader-02-constants-and-widths.md) | 4263 |
| 03 Adding, and the four flags | [Reader 03](reader-03-adding-and-the-flags.md) | 4263; displayed listings are assembly-only |
| 04 Subtracting, and the tick counter | [Reader 04](reader-04-subtracting-and-the-tick-counter.md) | 4263 |
| 05 Masks and fields | [Reader 05](reader-05-masks.md) | 4264 after 4263 reconnaissance |
| 06 Shifts | [Reader 06](reader-06-shifts.md) | 4263 and 4264 |
| 07 Compare and choose | [Reader 07](reader-07-compare-and-choose.md) | 4263 and 4264 |
| 08 Branches | [Reader 08](reader-08-branches.md) | 4264; scrolling checks on 4265 and 4267 |
| 09 Counting up | [Reader 09](reader-09-counting-up.md) | 4264 |
| 10 Counting down | [Reader 10](reader-10-counting-down.md) | 4264; scrolling checks on 4265 and 4267 |
| 11 Memory and addresses | [Reader 11](reader-11-memory-and-addresses.md) | 4264 |
| 12 Loading different widths | [Reader 12](reader-12-loading-widths.md) | 4264 |
| 13 Array addresses | [Reader 13](reader-13-array-addresses.md) | 4264; focused scrolling check on 4265 |
| 14 Strings and the zero byte | [Reader 14](reader-14-zero-terminated-strings.md) | 4264; scrolling on 4265; explanation checked on 4266 |
| 15 Products and their widths | [Reader 15](reader-15-products-and-widths.md) | 4264; focused scrolling check on 4265 |
| 16 Division and remainders | [Reader 16](reader-16-division-and-remainders.md) | 4264; focused scrolling check on 4265 |
| 17 Calls, returns and the stack | [Reader 17](reader-17-calls-and-returns.md) | 4265; focused cross-function checks on 4266 |
| 18 Recursive calls | [Reader 18](reader-18-recursive-calls.md) | 4266; slider, Next, Back and Reset correction checked on 4267 |
| 19 From C to instructions | [Reader 19](reader-19-from-c-to-instructions.md) | 4266; focused current-source checks on 4267 |
| 20 Compile a loop | [Reader 20](reader-20-compile-a-loop.md) | 4266 reconnaissance; four-configuration checks on 4267 |
| 21 C overflow and machine results | [Reader 21](reader-21-c-and-overflow.md) | 4266 |
| 22 Conversions and checked arithmetic | [Reader 22](reader-22-checked-arithmetic.md) | 4267 |
| 23 The same C on 32-bit Arm | [Reader 23](reader-23-same-c-on-a32.md) | 4267 |

Some recorded exports are not mounted on a lesson page. Readers 03 and 22
explicitly distinguish those records from displayed examples; metadata coverage
and semantic checks for exports belong to the separate technical mapping review.
Dynamic compiler readers 19 and 20 changed source locally and checked that the
associations, original references and highlights were regenerated, rather than
reusing a prepared map. The optional public compiler service was not needed.

The remaining viewport limits are explicit. On some local-compiler states a
duplicate excerpt is above the viewport, while the compact card beside the
controls supplies the correct instruction and C. Before the first step, the
complete source can occupy the bounded region and the first pair may require
internal scrolling. Reader 10 observed a small initial browser scroll-anchor
adjustment in one configuration; later stepping remained stable. These do not
reinstate the original absence of a usable C/instruction relationship. They also
mean this review does not promise that every duplicate is simultaneously visible
or that browser scroll anchoring can never adjust the page.

The coordinator also independently reviewed the engineering README and the
source-association addition to `docs/authoring.md`. Their implementation,
coverage and review-role descriptions match the checked code and review trail;
the README's final automated verification figures remain for the managing
session to fill from its completed runs.
