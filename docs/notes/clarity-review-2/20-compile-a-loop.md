# Clarity review: Compile a loop and follow its branches

Copyright © 2026 Christopher Snow

Reviewed 18 October 2026 against the preview built from `5cb518c` plus the approved
Module 0 simulator sentence. Scope: lesson 20, `compile-a-loop`, following the
[review brief](brief.md). Review only; no learner text changed.

## Result

The main explanation is clear for a learner who has completed the earlier lessons.
The loop's starting state, condition, update and empty case have concrete referents.
The distinction between a run exceeding the tool's limit and a loop that cannot
finish is explained explicitly. No distinct new issue category was found.

One additional occurrence belongs to the already retained **M6** hint-heading issue:

- **Low severity at this occurrence.** In
  [`compile-a-loop.prose.ts`](../../../content/lessons/compile-a-loop.prose.ts),
  line 25, `writeHints[1]` says: “Start the total at zero and check the zero-count
  case before the body.” The browser displays this correct advice beneath
  **“Common mistake”**, whose wording comes from
  [`platform/lesson-runtime/src/strings.ts`](../../../platform/lesson-runtime/src/strings.ts),
  line 122. A reader may initially take the recommended actions as the mistake.
  Direction: make this hint identify the mistake it is warning against, consistent
  with its heading. Preserve the platform copy. Count this as an extra location
  under M6, not another independent issue.

The second hint for the C challenge does identify mistakes before giving the
correction, so the same finding does not apply there. Both third hints provide
actual smaller examples.

## Prerequisites and earlier-review reconciliation

The fresh assessment was formed before consulting
[the first review](../english-review/20-compile-a-loop.md). That report found no
lesson-specific problem. Its clean assessment of the main explanation still
holds; the hint-heading occurrence above extends
[M6 in the earlier review](../english-review/README.md).

No additional unexplained prerequisite was confirmed:

- The [front-page prerequisites](../../../apps/course/src/strings.ts) include
  unsigned parameters, returns, conditions and `for`/`while` loops.
- [Counting up](../../../content/lessons/counting-up.prose.ts), lines 12–13,
  defines body and iteration and explains initialisation, testing and updating.
- [Counting down](../../../content/lessons/counting-down.prose.ts), lines 22
  and 43–48, connects count updates with branches and distinguishes wrapping,
  long finite runs and the initial loop test.
- [The preceding compiler lesson](../../../content/lessons/from-c-to-instructions.prose.ts),
  lines 9–18 and 54, explains the local compiler, working registers, source
  highlighting and evaluating C before running the assembly.
- This lesson itself, lines 9 and 36, explains the execution budget and why the
  maximum-count loop continues. Lines 38 and 52 explain the repeated-shift rule.
  “Budget”, “boundary” and “empty case” therefore have local explanations or
  immediate concrete examples; they were considered and not retained as issues.

## Coverage and evidence

Read all fields in the lesson's
[prose](../../../content/lessons/compile-a-loop.prose.ts),
[labels](../../../content/lessons/compile-a-loop.labels.ts) and
[definition](../../../content/lessons/compile-a-loop.ts): all ten sections,
objectives, captions, notes, both prediction explanations, tasks, ten hints, test
labels, reflection and model-versus-reality note. Also read the shared C editor,
playground and grader strings in
[`strings.compiler.ts`](../../../packages/views/src/strings.compiler.ts) and
[compiler diagnostics](../../../packages/compiler/src/strings.ts).

Used the immutable preview at
`http://127.0.0.1:4253/assembly-lab/#/lesson/compile-a-loop` with independent browser
contexts at 1280 × 900 and 375 × 900, each in light and dark themes. In each context:

- Opened lesson notes and read the rendered main text; opened available details.
- Selected and checked all three options in each prediction, reading the feedback.
- Ran both unchanged challenge starts and revealed all five hints in each.
- Compiled and ran both playgrounds with their original inputs, stepping to the
  return; changed each count to zero and stepped that run to its return.
- Read the generated listing, source associations and returned-result messages.

Visually inspected the hints and compiler screenshots in all four configurations.
No document horizontal overflow was present in those states.

The optional GCC comparison was not requested. This pass did not edit C source,
exercise every compiler diagnostic, submit finished challenges, or run the
maximum-count case. The source review covered diagnostic wording without claiming
those states were all exercised in the browser.

Temporary evidence is `/tmp/clarity2-20.mjs`, `/tmp/clarity2-20.log`, and
`/tmp/clarity2-20-{1280,375}-{light,dark}.txt`. Screenshots use the same prefix with
`-hints.png` and `-compiler.png`. These local captures include the page's own
answer disclosures and are not committed. The report quotes no complete challenge
solution.
