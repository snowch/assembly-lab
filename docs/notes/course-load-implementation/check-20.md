# Compile a loop: independent learner/checker

23 October 2026. Reviewed all ten sections of `compile-a-loop` at the final built site, http://127.0.0.1:4322/assembly-lab/#/lesson/compile-a-loop. No application edits or build. This reviewer did not author the implementation.

## Prerequisites and source assessment

Read AGENTS.md/CLAUDE.md, authoring and style guidance, the lesson data, prose and labels, its generated complete C/listing, the preceding local-compiler lesson, compiler AST/generator, source-map translation and CompilerPlayground. Earlier lessons establish unsigned wrapping, comparisons and branches, increasing/decreasing loops, zero iterations, repeated dimming and shift-count validity. The preceding lesson supplies fixed variable/register allocation, working registers, movz, the local evaluator-before-machine boundary, editor modes and optional GCC disclosure. Here “A for statement supplies an initialisation, a condition and an update” introduces its relevant structure locally. No additional unexplained prerequisite identified in this bounded pass.

The AST generator assigns phase metadata while generating the actual initialiser, condition, body, update and backward branch. The rendered cue reads the next instruction's metadata; it is not a separately scripted loop animation. Source line 5 legitimately covers several phases, while the body maps to line 6 and return to line 8. The prose correctly distinguishes source association from one C line executing as one instruction, selected-path C checks from arbitrary correctness, and execution budgets from proof of nontermination.

## Final-build browser evidence

Four fresh sequential Chromium contexts: 375×900 and 1280×900, each light and dark. Actual html theme and body backgrounds matched: light rgb(243, 246, 245), dark rgb(16, 22, 21). Both playgrounds initially remained locked. A first-option prediction commitment unlocked only its corresponding playground; inspection was available after that commitment regardless of correctness.

Ran each original and changed-boundary playground through its complete ordinary trace in every context. All five local phase cues appeared. At positions 2, 4, 9, 13 and 17 of the original trace, the card respectively identified starting-value setup, condition, body, update and return to condition. The repeat cue accompanied the actual backward branch; the following position returned to the comparison's first instruction. The condition and update correctly retained the same for-header source association. Return instructions carried no loop cue. Back restored the preceding state and Reset returned to position zero in both playgrounds. Screenshots show the next-operation card distinguishes its cue from the separate “Ran” status.

Count zero ran through initialisation and condition directly to return, with no body, update or repeat phase. A representative executed division-by-zero source edit produced “Line 6, column 23: This run would divide by zero. Check the divisor before using / or %.” No machine stepper was produced for that invalid run. Restore the original C cleared the edit and a new run restored the ordinary trace.

Document scroll width equalled viewport width in all four contexts. The complete paired listing remained contained on the phone, with the local instruction/source/phase card visible beside the controls. Visually inspected phone dark and desktop light screenshots. No page errors or external requests were observed; no GCC comparison was requested.

## Findings and direction

No blocker or actionable finding identified in these states. The previous tracking obstacle associated with “find the initialisation, condition, body and update in the listing” is addressed by the accurate local cue, including the transition from the backward branch into the next comparison. Retain that cue with the next instruction and preserve the separate executed-instruction status and checked C associations.

## Limits

Focused final-build browser review, not a full-suite, native/QEMU or external compiler run. Both complete ordinary playground traces, prediction gates, Back/Reset, original zero-count run, representative invalid-source diagnostic and restore were exercised in all four contexts. Construction and final exercises, hints, answer disclosures, maximum-count/budget behaviour, arbitrary source edits, persisted reloads and keyboard-only operation were not exercised. Their specifications were read only. No challenge solutions or prediction answers are recorded here. Browser script, full measured trace logs and screenshots: `/tmp/course-load-check/check20*`. An initial harness used an absent-element text wait for optional phases; that harness was stopped and corrected before the complete four-context pass.
