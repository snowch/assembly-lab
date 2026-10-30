# Module 10 recheck: independently completable pages

Copyright © 2026 Christopher Snow

30 October 2026. Review only; no lesson implementation changes.

**Both current Module 10 pages should split.** My earlier recommendation to retain them gave
conceptual coherence too much weight. A collection of related activities can still require an
unnecessarily long sitting. The revised Module 0 establishes a different expectation: finish a
small action, practise or check it, and reach a navigable stopping point.

This addendum supersedes the Module 10 disposition in `modules-9-11.md` for that requirement.
It leaves the original independent review intact. The earlier advice to retain each complete
trace remains valid; it does not require retaining every trace and construction on one page.

## Findings

### Medium: From C to instructions contains four completed activity cycles

The initial question asks, “How does a local variable become a register value?” The prediction
and main playground answer that question by following the product through working registers,
the local and the return register. That is a useful completed investigation. The next section
changes the learner's job: “Write the same calculation directly in assembly.” It has its own
contract, editor and tests.

After that construction, “The changed C function returns `charge` directly” starts another
prediction and another compiler playground. This is a source-change investigation, not unfinished
work in the assembly exercise. Finally, “Write `cap_charge` in C” switches to a different function,
a conditional and a different editor/grader. The unsigned product's wrapping before the cap is
also a distinct property to preserve.

The existing activities already provide useful endings. Keeping the same trip-charge setting
does not mean the learner needs to complete all of them before leaving the page.

Source: `from-c-to-instructions.prose.ts`, `investigation`, `construction`, `failureExperiment`,
`explanation` and `finalTask`; `from-c-to-instructions.ts`, the two prediction/playground pairs
and the separate `write-trip-charge` and `write-cap-charge` challenges.

### Medium: Compile a loop carries a finished reading task into two constructions and another investigation

The opening question asks, “Which generated branch makes the C loop run again?” The main
playground asks the learner to find initialisation, condition, body and update, follow the
backward branch and try count zero. That is an observable endpoint: the learner has followed
the complete loop and its empty case.

“Write the repeated addition directly in assembly” then starts an independently tested
construction. “The changed C loop uses `i <= count` where it previously used `i < count`”
starts a second prediction/run cycle with a different boundary. Its explanation reaches the
unsigned counter limit and distinguishes a tool budget from a reason for nontermination.

The generalisation then changes the operation: “The final function repeats a one-bit right
shift.” Its C construction requires both a decreasing remaining count and the distinction
between repeated valid shifts and one invalid large shift. Those ideas relate to termination,
but they are not needed to finish inspecting the repeated-addition compiler output. A short
application can become its own practice page without fragmenting that output.

Source: `compile-a-loop.prose.ts`, `investigation`, `construction`, `failureExperiment`,
`explanation`, `generalisation` and `finalTask`; `compile-a-loop.ts`, the two prediction/playground
pairs and the separate `write-accumulated-charge` and `write-c-dimming` challenges.

## Preferred compact units

I recommend **four pages from each current page, eight Module 10 pages in total**. These are the
smallest complete activity units already present, not eight equal portions of prose. Page names
below describe the scope; they are not proposed final learner prose.

The managing summary starts with six units using the consolidation option below. These eight
activity boundaries identify where to separate the combined investigations if they remain
crowded. Both recommendations replace the original two-page structure.

| Order | Unit and existing material | Completion/stopping point |
| --- | --- | --- |
| 1 | Follow a C variable into registers: opening calculation, local/working-register explanation, original prediction and full `play-from-c-to-instructions` run. | Check the prediction and follow the value into the local and return register. Finish the original run before moving on. |
| 2 | Write equivalent arithmetic in assembly: current construction and `write-trip-charge`. Move the principle that different sequences can implement the same calculation here. | Pass the existing assembly challenge. This is a short practice page using the preceding calculation. |
| 3 | Change C and inspect the generated difference: move the source-edit invitation here, then retain the changed-return prediction and `play-from-c-to-instructions-wrong` together. | Check the changed-source prediction, compile/run it and identify the removed operations. The whole changed run remains on this page. |
| 4 | Write a cap in C: unsigned product-before-comparison explanation and `write-cap-charge`. | Pass the existing C challenge, including its wrapping cases. No need to repeat either compiler walkthrough. |
| 5 | Follow a compiled loop: original loop, prediction and full `play-compile-a-loop` run, including the zero-count investigation. | Follow condition/body/update/backward branch and check the empty case. End after the complete successful investigation. |
| 6 | Write an equivalent loop in assembly: current construction and `write-accumulated-charge`. | Pass the existing assembly challenge. Counting down can implement the same contract without reproducing the compiler's counter. |
| 7 | Change a loop boundary: changed-condition prediction, full `play-compile-a-loop-wrong` run and boundary/counter-limit explanation. | Check the changed ordinary run and empty case; explain the maximum-count problem separately from the evaluator's budget. |
| 8 | Write repeated shifts in C: the repeated-single-shift explanation, decreasing-count reasoning and `write-c-dimming`. | Pass the existing C challenge, including zero repetitions and the full-width count case. |

This preserves the current broad order of investigate, construct, change, construct. It also
lets a learner finish a compiler-reading page without immediately writing an alternative
implementation in another language. Construction pages can be short: their value is deliberate
practice with a tested contract, not a quota of new explanation.

The first source-edit invitation currently appears inside the main investigation. Move that
invitation to the source-change unit so the first unit has one clear endpoint. Keep choosing
inputs and running the original calculation with the first unit. Do not require the learner
to add a local variable before they can finish their first successful compiler trace.

The two investigation-only units for each original page already include checked predictions
and observable runs; they do not currently have separate end-of-page writing challenges. A
future implementation must make their completion clear using that existing work. It should
not invent a second substantial challenge merely to make the page look complete. Persistence,
completion records, relocated prediction gates and navigation need implementation review.

## Consolidation option and boundaries

**Six pages is a reasonable lower-count option**, if the rendered result remains compact:

1. Combine arithmetic units 1 and 3 into one inspect/edit investigation; keep the assembly and
   capped-C constructions as separate pages.
2. Keep loop reading and loop assembly as separate pages, and combine the boundary investigation
   with the repeated-shift C application.

That option groups a guided activity with an application, but its compactness is unverified.
The arithmetic combination currently contains two complete playgrounds and a second prediction.
The loop combination still changes from endpoint inclusion and counter wrapping to an algorithm
with a different operation and C validity constraint. Prefer eight if those combined pages
again feel like two sittings. The existing source supports all eight stopping points; it does
not establish that six or eight newly rendered pages will have the right pacing without trying
them in the built site.

Do not split a compiled loop into condition, body, update and return pages. Those phases need
one runnable listing. Likewise, keep each prediction beside its corresponding eventual run,
and keep ordinary inputs/empty inputs within the same loop investigation. The unsigned
maximum explanation is a boundary extension of the changed condition, not a fourth phase to
run for billions of iterations.

Put only the local guidance needed for the next action before it. Explain `movz` where it first
appears; keep the subset and tested-path limitations beside compilation/run controls. Place GCC
service guidance and privacy disclosure with its optional panel. Do not repeat the complete
compiler introduction, source listing and glossary on every construction page. Retain the
complete C/instruction pairing wherever a trace is shown.

## Evidence and limits

Re-read both actual lesson prose files and activity definitions for this recheck, including
the two challenges on each page. This is an action-boundary reassessment, not a new browser
verification or an implementation. No exercise answers are reproduced.

The earlier browser evidence remains relevant: both routes were loaded on production preview
4411 at 375×812 and 1280×812 in actual light and dark. Their predictions were committed, main
local compilations run and first instructions stepped. The original traces and changed-source
playgrounds are separate mounted activities. Initial page heights were about 9,600/9,500 pixels
on the phone; after sampled commitments and main runs they were about 12,100/12,300. These are
state-dependent navigation measurements, not reading-time estimates. They support taking the
completion burden seriously, but they do not determine where a split belongs.

No additional browser run was made for this addendum. No new page boundaries have been built
or timed. Challenge passing, revised completion behaviour, reset/restoration and any external
GCC calls remain untested here. Earlier source-only and browser-state limitations remain as
recorded in `modules-9-11.md`.
