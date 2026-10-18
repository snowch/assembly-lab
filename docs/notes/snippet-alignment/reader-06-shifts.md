# Lesson 06 learner review: Shifts, and the type that picks one

Reviewed 18 October 2026 against `CLAUDE.md`, both closing passes in `docs/style.md`, and [the snippet alignment brief](brief.md). Independent one-lesson reader; no code or test changes.

**Result: no new snippet-alignment finding.** The complete C, instruction pairing, comparison marks, compiler references and stepping highlights are understandable in the inspected build. Existing clarity findings below are not new regressions.

## Actual browser checks

Used installed Playwright with Chromium, initially at `http://127.0.0.1:4263/assembly-lab/#/lesson/shifts`, then repeated the focused checks at the replacement immutable preview `http://127.0.0.1:4264/assembly-lab/#/lesson/shifts`. Both passes used **1280 × 900 and 375 × 900, light and dark**. The final observations below concern 4264.

- Read the rendered initial and revealed lesson text and the surrounding prose for the changed comparison and stepper.
- Verified both dependent figures started locked. Selected the first available prediction option and pressed “Check your prediction” for each gate. No storage seed or gate bypass was used.
- Inspected the comparison with its two “Compiler's C line references” disclosures closed and open. All three snippets on this page contain complete one-line C functions, including their braces and return statements. The two comparison functions remain separate labelled panels; neither needs repeated excerpts in this case.
- Verified the differing shift instructions remain marked, while the common return instruction is unmarked. Labels and instruction order remain visible.
- Stepped the division listing through all three instructions, then used Back, Reset and the positive-call control and stepped its first instruction. Each executed instruction lights the actual complete C line containing the relevant return expression. Since the function occupies one source line, the whole-line highlight includes its braces; it does not replace the operation with a brace-only excerpt. The return instruction has the explicit note “Returns to the code that called this function.”
- Opened the stepper's raw compiler references. The disclosure explicitly says “These are the compiler's original line references. They may point to a brace instead of the C operation an instruction carries out.” The visible references retain line 1 for these one-line functions.
- Viewed actual screenshots of the comparison, open details and stepped states across both widths and themes. Phone wrapping keeps each source block with its instructions; desktop stepping puts them beside one another. No clipping or horizontal page overflow was observed. Measured document width equalled viewport width in all four configurations, including after opening the stepper details. The stepper disclosure summary measured 44px high in all four.
- No page errors were recorded during initial/revealed browser passes. No full test suite was run. This is a focused alignment review, not a fresh exhaustive challenge/hint/input review.

The already reported comparison-summary touch target issue was not counted again. The updated 4264 comparison remains readable; no multi-label source/excerpt regression occurs in these single-function panels.

## Existing findings, not new alignment defects

The [previous lesson review](../clarity-review-2/06-shifts.md) records these independent of the snippet work:

- **Medium, retained M7.** “For a negative `int`, the C standard leaves the result of `>>` to the implementation” and “C leaves some left shifts undefined”. The compiler's choice versus C giving no guarantee still needs an ordinary-language distinction. Smallest direction: clarify those two guarantees inside “What C says”; do not change the listing relation to address it.
- **Low, retained 06-N1.** “The figure marks the filled top bit in each case.” This sentence still follows the first prediction, whose result figure does not show both right shifts with those fill marks. Smallest direction: identify the separate investigation figure and its selection control, or correct the description of the present figure. This is unchanged surrounding prose, not a new alignment regression.

The previous M6 hint-heading issue was not re-exercised during this focused pass and is not re-reported as an independently verified finding.

## Assumed knowledge

The learner can read the front page's small C functions with `int`, `unsigned` and `return`. Module 0 explains GCC as a C compiler, `-O1` as the setting asking GCC to make code shorter and faster, operands, and the relationship between statements and instructions. Its current compiler note also explains that original line references can name the closing brace and serve debugging tools. Earlier lessons supply signed/unsigned readings, hexadecimal, register width, the top bit, `movk` and its shifted immediate; Masks introduces the C shift symbols and moving fields. These cover the new shared listing labels and the source-reference disclosure here.

The page itself explains logical and arithmetic shifting, discarded/filled bits, rounding, and the shifted operand in the division listing. I found no additional prerequisite gap introduced by the snippet changes. The existing distinction between implementation-defined and undefined C behaviour remains the M7 gap above, not a new item.

## Evidence

Temporary scripts: `/tmp/snippet06.cjs`, `/tmp/snippet06-step.cjs` (4263), `/tmp/snippet06b.cjs`, `/tmp/snippet06b-step.cjs` (4264).

Final-build screenshots use `/tmp/snippet06b-{1280,375}-{light,dark}-` with suffixes `pair.png`, `details.png`, `step-start.png`, `step1.png`, `step2.png`, `step3.png`, and `positive-details.png`. The matching `initial.txt`, `revealed.txt`, `step.html` and `steps.json` retain actual text and measured highlight/width checks. Representative images actually inspected include:

- `/tmp/snippet06b-1280-light-pair.png`
- `/tmp/snippet06b-375-dark-details.png`
- `/tmp/snippet06b-375-light-step-start.png`
- `/tmp/snippet06b-1280-light-step1.png`
- `/tmp/snippet06b-1280-dark-step2.png`
- `/tmp/snippet06b-375-light-step3.png`
- `/tmp/snippet06b-375-dark-step1.png`
