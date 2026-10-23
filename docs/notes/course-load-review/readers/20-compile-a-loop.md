# Reader 20: Compile a loop and follow its branches

Copyright © 2026 Christopher Snow

Module 10, second lesson; course position 20 (zero-based assignment). Snapshot f1fdf35. Independent learning-load review, no implementation changes.

## Prerequisites and novelty

Read the ten sections and challenge specifications in the parsed registry, the lesson data/prose, CompilerPlayground, TracePrediction, CEditor and the generated program embedded in the data. Earlier lessons provide unsigned wrapping, comparisons/condition codes, conditional selection, branches, increasing/decreasing loops, zero-iteration tests and shift rules. In particular Module 5 already uses `while (ticks != 0)`, explains `ticks--`, and constructs repeated dimming in assembly. The immediately preceding lesson provides the local compiler, working registers w8/w9, fixed register allocation, movz, C evaluator followed by A64 execution, editor modes and optional GCC comparison. This is substantially synthesis, rather than simultaneous introduction of loops, C arithmetic, compiler controls and assembly.

New emphasis: following the local compiler's loop translation, finding multiple roles associated with one `for` source line, editing its boundary and relating each repeated operation to C's validity rules. The unsigned maximum/always-true comparison is a transfer from earlier unsigned-loop work. No definite untaught prerequisite found within this bounded pass. Empty `introduces` metadata does not imply no new instructional work.

The opening question asks which generated branch repeats the loop. Motivation supplies variable/register roles and explains the backward branch before the first committed prediction. That prediction asks for an overall returned total using familiar inputs; it does not require stepping every compiler move. This is a reasonable entry task. The final repeated-shift C challenge revisits Module 5's mechanism in the newly editable C direction, with the per-operation shift rule explained locally.

## Confirmed observations and findings

No high-severity learning-load finding. One low-severity tracking obstacle:

**L1, low, interface tracking rather than excessive novelty.** The investigation says, “find the initialisation, condition, body and update in the listing.” After Run with these inputs and 19 Next presses, the local current-operation card says “Recorded against C line 5” and displays the entire `for` header. That header covers initialisation, condition and update; it does not identify the active role. The six register cards use architectural names only. The learner must repeatedly recover the counter/total mapping from the earlier motivation and distinguish the parts of line 5 from instruction sequences. At 375px the contained paired listing initially shows C, with instructions horizontally outside that first view; the nearby current-instruction card helps considerably, but cannot itself show the route back through the loop. Evidence: `compile-a-loop-375-dark-play-compile-a-loop.png` and desktop light counterpart in `/tmp/course-load-review/`. The same role ambiguity is visible on desktop, although the paired panes make it easier to resolve. Smallest direction: add a compact local loop-role cue, or a nearby counter/total legend, during this investigation. Keep the complete generated listing and current-instruction card. This is an avoidable bookkeeping cost, not evidence the task is too advanced.

## Design recommendations, distinct from defects

An optional phase/path cue for the generated loop would externalise the initialisation → test → body → update → test structure, particularly since line 5 legitimately highlights across several roles. Prefer that to another full prose explanation or splitting familiar opcodes into separate lessons. The existing source-line qualification is accurate and should stay. A smaller numerical example would add little: the first task already uses small inputs and prior arithmetic.

## Treatments worth keeping

- The first prediction and changed-boundary prediction are separate commitments. Each playground remains locked until its associated commitment; tested with a first-option submission, including a mismatch. No challenge solution is required to unlock investigation.
- “Source highlighting identifies the associated line; it does not mean one C line runs as one instruction” explicitly addresses a real representational trap.
- The edit changes one relation while retaining source, inputs and interface. That focuses comparison on boundary behaviour rather than adding unrelated mechanisms.
- Zero count, maximum unsigned count and execution budget are distinguished. “That budget is a tool limit” prevents a failed run becoming an unsupported proof of nontermination.
- The repeated-shift generalisation connects a familiar loop to C's rule for each executed operation. Its explanation before the challenge is appropriate teaching, not a premature challenge answer.
- The playground shows only registers actually referenced by its program, and identifies writes even when an operation leaves bits unchanged. GCC remains optional and disclosed separately.

## Browser coverage and limits

Fresh Playwright contexts at 375×900 and 1280×900, each using light and dark preferences. Actual body backgrounds checked: light rgb(243,246,245), dark rgb(16,22,21); corresponding foregrounds differed. Document scroll widths equalled viewport widths. Visually inspected representative phone dark and desktop light interacted screenshots; screenshots of initial full page and both stepped playgrounds exist for all four contexts.

In all four contexts: initial locked states; both predictions committed; Compile C then Run with these inputs in both playgrounds; 19 instruction steps through a repeat into the next condition; both challenge starting programs tested unsuccessfully and first hint opened; normal details opened (including subset, source/compiler, reflection answer and GCC privacy disclosure). No GCC request button pressed. Additional fresh-context pass in all four configurations: count zero run, 12 steps, step Reset, Restore the original C, and Build C from statements opened. Scripts/logs and screenshots use the `compile-a-loop-` artifact prefix.

Did not solve either challenge, exhaust hints, submit a completed solution, edit the boundary text (the prepared boundary playground was exercised), test maximum-count/budget diagnostics, or complete every trace. Those extreme behaviours were reviewed in prose/source, not independently executed. No external compiler calls, rebuilds or application edits. This review does not measure learner performance or claim that all interface density is harmful.
