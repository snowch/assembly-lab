<!-- Copyright © 2026 Christopher Snow -->

# Fresh clarity review: Recursive calls and separate frames

Reviewed `recursive-calls` as lesson 18 (Module 9, second lesson), using the front-page prerequisites and earlier lessons only. This is a review, not a prose change. Read the lesson independently before consulting the [first review](../english-review/18-recursive-calls.md).

## Findings

No new issue category. The main explanation is clear: it defines recursion and its stopping case, follows the saved brightness across calls, shows separate stack frames, then explains why the argument must change and why returns happen in reverse order.

**Additional occurrence of M6; low severity at this location.** Under the rendered heading **“Common mistake”**, the final exercise's second hint says:

> The recursive call counts only the levels after the current one.

Source: [`recursive-calls.prose.ts`, `finalHints[1]`, line 43](../../../content/lessons/recursive-calls.prose.ts). This is a correct description of the recursive call, but the heading presents it as a mistake. A learner could try to change what that call counts instead of using the distinction the hint explains. Direction: make this hint identify the actual misconception while retaining the existing hint heading and progression. This expands the occurrences of [retained issue M6](../english-review/README.md); do not count it as a new issue. The first exercise's second hint already starts with a concrete warning and does not have this problem.

The first review found no chapter-specific issue. That remains a fair assessment of the main prose, with the additional shared hint-pattern occurrence above. No previously rejected item was reopened.

## Assumed knowledge checked

No additional unexplained prerequisite materially obstructed this lesson.

- The previous lesson explains caller, callee, link register, stack pointer, stack frame, frame pointer, register preservation, and saved return addresses. Its compiler note explains `-fno-inline` and inlining. See [`calls-and-returns.prose.ts`](../../../content/lessons/calls-and-returns.prose.ts), `question`, `questionNote`, `motivation`, `investigation` and `explanation`.
- Earlier arithmetic and width lessons establish unsigned wrapping and the relationship between `w` and `x` register views. [`shifts.prose.ts`](../../../content/lessons/shifts.prose.ts), `motivation` and `investigation`, explicitly connects unsigned right shift to halving with the remainder discarded, so odd brightness values need no new rounding rule here.
- Earlier branches teach the zero/nonzero branch instructions, and earlier memory lessons teach byte addresses and the addressing syntax reused here.
- This lesson defines “recursion” and “base case” before asking the learner to use them. “The child's result” in the explanation has the immediately stated recursive call as its referent; a separate tree-vocabulary definition would add little.

The earlier lesson's retained M3 and L16 concerns about pair-store addresses and stack slots belong in that lesson's report. They are not new findings against this page's explanation.

## Source and browser coverage

Read all sections, compiler note, prediction wording and feedback, both tasks, all ten hints, reflection and answer, and model-versus-reality note in [`recursive-calls.prose.ts`](../../../content/lessons/recursive-calls.prose.ts); objectives, headings, captions, options and test labels in [`recursive-calls.labels.ts`](../../../content/lessons/recursive-calls.labels.ts); lesson wiring in [`recursive-calls.ts`](../../../content/lessons/recursive-calls.ts); and shared stack labels in [`strings.stack.ts`](../../../packages/views/src/strings.stack.ts). Read the displayed listings and both starter programs in the browser. Applied both style passes: wording and whether the explanation supplies the mechanism needed for the exercises.

Inspected the immutable preview at `http://127.0.0.1:4253/assembly-lab/#/lesson/recursive-calls` in Chromium at **1280 × 900** and **375 × 900**, each in **light and dark** themes. In each configuration:

- Opened all details and read the rendered text.
- Submitted every offered option for both predictions, exposing matching and nonmatching feedback.
- Ran both unchanged exercise starters and opened all five hints for each.
- Moved all three stack figures to instruction positions 0, 22 and the recording end; inspected the active frames and return/limit messages.
- Inspected screenshots of the introduction, stack and exercise states across both widths and themes. No horizontal document overflow was measured.

This was not exhaustive execution of every possible learner program; successful submissions and every assembler diagnostic were not exercised. No app build or test suite was run by this reviewer.

Temporary evidence: `/tmp/clarity2-18.mjs`, `/tmp/clarity2-18.log`, `/tmp/clarity2-18-{1280,375}-{light,dark}.txt` and matching screenshots. These local artifacts contain revealed exercise material; this report does not reproduce solutions.
