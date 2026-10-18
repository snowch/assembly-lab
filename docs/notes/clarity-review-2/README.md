# Second whole-course clarity review

Reviewed 18 October 2026 against `5cb518c`, with the approved simulator sentence
applied. This follows the [first whole-course English review](../english-review/README.md).

## Applied change

Module 0 now says:

> The simulator is a JavaScript program that loads with this page and runs in your browser.

The canonical prose uses the same sentence. The surrounding explanation still
distinguishes simulated execution from GCC's recorded instructions. See the
[checked brief](brief.md), [separate drafting record](simulator-sentence.md) and
[independent built-page review](00-meet-the-machine.md).

The other chapter findings below are recommendations; they have not been applied.

## Review outcome

The course is generally clear. The remaining work consists of local corrections
to references, terminology, explanations and help text.

The independent reader and sceptic passes retained **30 outstanding English
issues: 7 medium and 23 low**. The first review's 29 issues remain open; this pass
adds **one new low issue** and identifies more occurrences of the existing
hint-heading problem. A separate low-priority observation concerns stale
front-page module-status text. No high-severity issue was found.

Medium means wording can mislead the learner about a mechanism or corrective
action. Low means a local obstacle with enough surrounding context to continue.

The new finding is **06-N1** in `content/lessons/shifts.prose.ts:30`:

> The figure marks the filled top bit in each case.

The enclosing prediction figure marks changed bits for one operation. Filled-bit
marks and selectable operations belong to a different figure in the next section.
Name the intended figure and the selection needed, or describe only what the
current card shows. This is a local reference correction, not a reason to add a
new diagram. See [reader 06](06-shifts.md) and the [independent decision](25-sceptic-early.md).

## Priorities for the next editing pass

The [first review's ranked list](../english-review/README.md) supplies the existing
IDs and exact correction directions. Work through the medium issues first:

1. Clarify the subtraction inputs and full sum (M1–M2), the spacing of paired
   register stores (M3), and the guarantee for an incoming narrow argument (M5).
   These phrases can teach the wrong mechanism.
2. Make corrective feedback describe the actual failure (M4), and make each
   affected hint fulfil its heading (M6). Review the hint ladders together while
   preserving the shared platform copy.
3. Distinguish the two C rules in the shifts note (M7). Correct the nearby new
   figure reference in the same chapter pass.

Then address the low issues in the original list: ambiguous references, terms used
before explanation, captions that do not match the figure and vague diagnostics.
The stale front-page claim that other modules are planned remains a separate
state-dependent content observation.

## Repeated and rejected suggestions

Several fresh readers found further M6 occurrences. These extend the existing
hint-heading issue, not the number of distinct problems. The sceptic records list
the accepted locations and local severity. M6 does not mean every hint needs a
rewrite: a hint that clearly names a forbidden action can work under “Common
mistake”.

The early sceptic rejected the proposed additional masks occurrence at line 94:
“Each result starts from `0x2a`, not from the one before” already identifies the
incorrect chaining assumption. The original reader proposal is preserved, with
the sceptic decision controlling the accepted list. The first review's rejected
set-bit, signed-result and invalid-input candidates remain rejected because their
surrounding teaching supplies the supposedly missing distinction.

The later sceptic also rejected the proposed A32 hint occurrence at line 48. It
explicitly distinguishes the call instruction from the helper name and says which
one the field requests. The earlier rejected “baseline Armv7-A” concern remains
rejected: the local compiler note and division explanation give the relevant
processor-feature consequence. These decisions do not reopen rejected findings
or increase the issue count.

## Coverage

The parsed course contains **24 lessons, 48 exercises and 240 hints**. Each lesson
had a fresh reader who inspected its prose, captions, hints, feedback, notes and
assumed knowledge. Each used the front-page prerequisites and earlier lessons as
the learner's knowledge, then reconciled the findings with the first review.

Readers used an immutable production build at 1280 and 375 pixels, in light and
dark themes. Each report states its actual interaction coverage; this does not
mean every possible input or feedback branch was exercised in every configuration.
Temporary browser artifacts are recorded for reproducibility but are not committed.
The shared-text follow-up is a source review and explicitly distinguishes itself
from the first review's browser diagnostic probes.

| Module | Lesson | Reader record |
| --- | --- | --- |
| 0 | Meet the machine | [Reader 00](00-meet-the-machine.md) |
| 1 | Same bits, two readings | [Reader 01](01-one-pattern-three-readings.md) |
| 1 | Constants and widths | [Reader 02](02-constants-and-widths.md) |
| 2 | Adding, and the four flags | [Reader 03](03-adding-and-the-flags.md) |
| 2 | Subtracting, and the tick counter | [Reader 04](04-subtracting-and-the-tick-counter.md) |
| 3 | Masks and fields | [Reader 05](05-masks.md) |
| 3 | Shifts, and the type that picks one | [Reader 06](06-shifts.md) |
| 4 | Compare, and the signed or unsigned condition | [Reader 07](07-compare-and-choose.md) |
| 4 | Branches, and the run that skips | [Reader 08](08-branches.md) |
| 5 | Counting up, and the branch backwards | [Reader 09](09-counting-up.md) |
| 5 | Counting down, and knowing when to stop | [Reader 10](10-counting-down.md) |
| 6 | Memory and addresses | [Reader 11](11-memory-and-addresses.md) |
| 6 | Loading different widths | [Reader 12](12-loading-widths.md) |
| 7 | Array addresses and moving pointers | [Reader 13](13-array-addresses.md) |
| 7 | Strings and the zero byte | [Reader 14](14-zero-terminated-strings.md) |
| 8 | Products and their widths | [Reader 15](15-products-and-widths.md) |
| 8 | Division and remainders | [Reader 16](16-division-and-remainders.md) |
| 9 | Calls, returns and the stack | [Reader 17](17-calls-and-returns.md) |
| 9 | Recursive calls and separate frames | [Reader 18](18-recursive-calls.md) |
| 10 | From C to instructions | [Reader 19](19-from-c-to-instructions.md) |
| 10 | Compile a loop and follow its branches | [Reader 20](20-compile-a-loop.md) |
| 11 | C overflow and machine results | [Reader 21](21-c-and-overflow.md) |
| 11 | Conversions and checked arithmetic | [Reader 22](22-checked-arithmetic.md) |
| A | The same C on 32-bit Arm | [Reader 23](23-same-c-on-a32.md) |

Shared wording: [report 24](24-shared-text.md). Independent sceptic decisions:
[early lessons](25-sceptic-early.md) and [later lessons and shared text](26-sceptic-late.md).
The [independent final check](27-final-check.md) verifies the synthesis, counts,
coverage, links and narrow learner-text diff.

Model and effort were inherited from the active session, without overrides. Each
reader was a separate agent, as required by the repository's review process.

## Verification

The sentence passed independent accuracy and learner reviews on the built page,
including desktop and phone in both themes. Its canonical-prose check passed.
The required full `npm run check` completed successfully before commit and push:
formatting, copyright, platform integrity, strict types, **2,638 unit/integration
tests across 132 files**, the production build, and **1,021 browser tests**, with
23 expected viewport-specific skips. The browser stage took 25.4 minutes.
The local run log is `/tmp/clarity-review-2-check.log`; it is temporary evidence,
not a committed artifact. No further learner-text changes followed that run.
