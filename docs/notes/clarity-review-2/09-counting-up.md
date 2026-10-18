<!-- Copyright © 2026 Christopher Snow -->

# Second clarity review: Counting up

Reviewed `counting-up`, Module 5 lesson 1, against [the brief](brief.md), `CLAUDE.md` and `docs/style.md`. Read the lesson independently before consulting the first review. No new issue category: one retained issue remains, and the hints supply another occurrence of a retained shared issue.

## Findings and earlier-review reconciliation

1. **Low — L10 remains unresolved: the noun “trace” is unexplained.** [Source](../../../content/lessons/counting-up.prose.ts) line 74: “The simulator limits how many instructions it runs in one trace. Reaching that limit means the trace stopped; it does not establish whether the program would eventually return.” A beginner must infer whether a trace is a record of executed instructions, the complete function run, or the figure. This affects the distinction the note is explaining. Define the bounded record or use the established vocabulary of a run and executed instructions. The earlier use “the call to trace” in `meet-the-machine.labels.ts:43` is a verb, not a definition of this noun. The corresponding `partialIterations` string in `packages/views/src/strings.loop.ts:10` also uses the noun; treat it as the same issue, not another count. That limit state was inspected in source, not triggered in the browser. Matches [first review L10](../english-review/README.md) and [Reader 09](../english-review/09-counting-up.md).

2. **Medium — additional occurrence of M6: a correct action appears under “Common mistake”.** `content/lessons/counting-up.prose.ts:35` begins “Use an unsigned comparison between `start` and `end`.” The actual page places this imperative below the heading “COMMON MISTAKE”. A reader consulting the heading can reasonably read the recommended action as something to avoid. Make the hint describe the mistake promised by its heading, or use a supported course-level heading appropriate to advice. Preserve the platform copy. This is the already retained [M6](../english-review/README.md), now with an additional location; do not count it as a new issue. The next rung at line 36 also gives a general description under “SMALLER EXAMPLE”, which belongs to that same existing heading/content issue.

No high-severity finding. No previously rejected finding is revived. No additional edit is justified merely to shorten sentences: the explanation ties the first test, the increasing tick and the stopping condition together clearly.

## Assumed knowledge

The front-page prerequisite panel explicitly includes `int`, `unsigned`, returns and C `for`/`while` loops. This lesson additionally explains `>>=` and `tick++`, and defines loop, body and iteration before their use in the tasks. Earlier lessons establish registers, GCC and `-O1`, unsigned ordering, shifts, condition codes, labels and taken/not-taken branches. The subtraction lesson defines tick and wrap. “Endpoints” is immediately made concrete through `start`, `end` and the equal/descending examples. The noun “trace” is the unsupported assumption identified above; no other unexplained prerequisite was found.

## Coverage and evidence

Read the whole `counting-up.prose.ts`, `counting-up.labels.ts` and lesson assembly in `counting-up.ts`, including both exercises, all ten hints, prediction explanations, final feedback, compiler note, reflection answer and model-versus-reality note. Read the related loop-view strings. Source review covered feedback and limit text not reached by the tested inputs.

Used Chromium on the immutable preview at `http://127.0.0.1:4253/assembly-lab/#/lesson/counting-up`, at 1280 × 900 and 375 × 900 in both light and dark themes. In all four configurations, opened the details, submitted both predictions, exposed all ten hints, ran the unchanged construction exercise, submitted the final exercise with empty fields to expose its validation, and advanced the stepper three times. Inspected rendered page text and screenshots of the hint/feedback area. No horizontal overflow appeared in these states, and no theme- or width-dependent English issue was found. Did not complete arbitrary edited programs, fill the final exercise with numerical answers, or trigger the instruction limit.

Temporary browser evidence: [script](/tmp/clarity2-09.mjs), [rendered text and observations](/tmp/clarity2-09-browser.json), [desktop light](/tmp/clarity2-09-1280-light.png), [desktop dark](/tmp/clarity2-09-1280-dark.png), [phone light](/tmp/clarity2-09-375-light.png), [phone dark](/tmp/clarity2-09-375-dark.png).

No application edits, build or commit performed.
