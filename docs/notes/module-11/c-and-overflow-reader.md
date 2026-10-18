# C overflow and machine results: independent reader and technical review

Reviewed 18 October 2026, independently of the lesson's author and drafting pass. The reviewer used the session's inherited model and effort settings; no model override was requested. Scope: `c-and-overflow`, with the front-page prerequisites and Modules 0–10 available as prior knowledge. No later lesson was treated as a prerequisite. Production files were not edited or rebuilt.

## Method and evidence

Read the actual built page at `http://localhost:4200/assembly-lab/#/lesson/c-and-overflow` in Chromium at 1280 × 800 and 375 × 812, in both light and dark themes. Read all lesson prose, opened the notes, inspected the listings, submitted both predictions, opened both steppers, exercised both written challenges and all ten hints, and switched completed artifacts into Tap mode. Ran the direct A64 stepper to its return. Both prediction gates were initially closed and opened after a checked attempt. The starting artifacts failed the exercises; the supplied reference artifacts passed all six cases apiece in every viewport/theme combination. No browser exceptions or page-level horizontal overflow occurred.

Artifacts are under `/tmp/reader-overflow/`: four initial and four exercised full-page screenshots, three focused stepper screenshots, phone heading/comparison screenshots, rendered text and `results.json`. The screenshot names identify viewport, theme and state. Exercise solutions are deliberately omitted from this review.

Read `CLAUDE.md`, `docs/style.md`, `docs/authoring.md`, the lesson's source/labels/listings, and the original GCC request/response evidence through its facts tests. `npx vitest run content/lessons/c-boundaries.facts.test.ts` passed all 34 tests. Checked the signed-arithmetic and undefined-behaviour claims against N3096 §§3.4.3 and 6.5 paragraph 5 (`/tmp/course-n3096.txt`). The documented compiler options and the recorded instruction sequences are correctly distinguished from standard C guarantees.

## Findings for sceptic review

### Medium: the closing challenge has its complete assembly answer immediately above it

Location/quote: the generalisation figure is captioned “Inspect safe_increment with the conditional kept as a branch.” The immediately following challenge says “Write safe_increment.”

Effect: the final task can be completed by copying the visible complete function. It therefore checks transcription more strongly than whether the learner can construct a guard from the C rule. The earlier limit-test challenge does provide useful construction work, but it does not require the learner to construct the closing task's branch and arithmetic path.

Evidence: `safe-increment-listing` renders the entire recorded function unconditionally before `write-safe-increment`; both the built page and `c-and-overflow.ts` show this order. This conflicts with the instruction in `CLAUDE.md` that no figure or text give a challenge's answer before the learner has worked for it.

Direction: keep the useful recorded example, but make the final construction require a small, meaningful transfer, or disclose the matching complete assembly after the learner's attempt. Preserve the explanation of the boundary check. No replacement answer is proposed here.

### Medium: comparison highlighting labels an unchanged return instruction as different

Location/quote: “Compare the recorded ordinary and -fwrapv compilations.” Both `ret` rows are highlighted; their accessible annotation says “This instruction differs from the other listing”.

Effect: the comparison appears to say that returning itself changed between the compiler options, although both listings end with the same instruction. A reader must infer that the highlight actually compares ordinal positions rather than matching instructions.

Evidence: `/tmp/reader-overflow/phone-compare.png` shows both highlighted return rows. The rendered text contains the quoted annotation after each. `ListingPairFigure.tsx` compares each instruction with the same index in the other listing; the two functions have different instruction counts. The limitation is not explained on this figure.

Direction: either align common instructions before marking differences or describe the positional comparison accurately where the highlighting is introduced. The lesson's intended change should remain easy to identify.

### Low: the optional input note assumes a text parser and accumulation

Location/quote: “A text parser reading −2147483648 cannot first accumulate positive 2147483648 in an int and then negate it.”

Effect: a learner who understands variables, loops, strings and the small compiler may still not know that this describes converting a string of digits into a number. “Accumulate” also leaves the repeated multiply-and-add operation implicit. This makes the practical example more abstract than the otherwise concrete explanation of signed limits.

Evidence: a search of the earlier lesson prose found no explanation of a text parser or the digit-to-integer conversion procedure. The front-page prerequisites do not require text-parsing experience. The note itself explains the arithmetic problem but does not introduce what this program does with its text input.

Direction: identify the conversion task in ordinary words before naming the parser; briefly connect accumulating digits to the intermediate numeric values. Keep the note optional.

## Assumed-knowledge audit

The lesson introduces `INT_MIN`, `INT_MAX`, `<limits.h>`, and `#include` at their first necessary use. It explains undefined behaviour, `-fwrapv`, the additional branch-preserving options, and saturation. Earlier lessons support flags, signed limits, branches, comparison conditions, C's distinction from instruction behaviour, GCC, and `-O1`; these are not new prerequisite gaps.

Two words have weaker support: “compiler contracts” in the investigation heading (the following paragraph explains the guarantee, so this is a low-cost heading clarity opportunity rather than a separate blocking finding), and “text parser” in the optional note (the concrete gap recorded above). “Representable” is anchored by the signed range and previous width lessons.

## Technical conclusions and limits

No incorrect C or A64 semantic claim was found in this lesson. In particular, the explanation does not claim that C signed overflow must wrap; it distinguishes direct instruction execution from the original source, qualifies the GCC option, and restricts each bound subtraction to the sign branch in which it is safe. The minimum-value discussion is correct for the stated target. The displayed C-to-assembly mappings preserve the actual recorded compiler lines, including mappings to closing braces.

The visual layout is readable in both themes and at phone width. Both exercises' hints progress from the intended check to syntax; the last hint is intentionally a solution disclosed by the learner. That is distinct from the unconditional pre-challenge listing in the first finding. The 34 facts tests and this browser review do not replace the final whole-course QEMU and CI checks.
