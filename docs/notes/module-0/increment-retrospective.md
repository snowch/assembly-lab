# Why the small function was missed

Copyright © 2026 Christopher Snow

This is a retrospective on the earlier opening redesign, not evidence from a novice learning study. The user identified the missing `increment_int` bridge after the course-wide review and implementation.

## What the records establish

The [original review brief](../course-load-review/brief.md) already asked whether first tasks combine unpractised mechanisms and whether a smaller first example would help. The process did not lack that broad question.

The [managing proposal](../course-load-review/proposals.md), proposal 1, chose addition, read-before-write and subtraction, then argument/return conventions and the complete function. The [review recommendation](../course-load-review/README.md) added sequencing but retained that final transition. Neither specified a small complete function to connect a supplied argument, a prepared result and returning control.

The [opening implementation record](../course-load-implementation/opening.md) followed that plan: five arithmetic activities, then locally taught conventions and the complete trip function. The [independent check](../course-load-implementation/check-00.md) explicitly accepted that “Function arguments/result convention, the colon label and `ret` are introduced before the C prediction.” It extensively checked interaction states, but did not identify the missing small complete-function example.

The [sceptical review](../course-load-review/sceptic-early.md) correctly cautioned that whole functions and predictions are not inherently inappropriate and that the proposed sequence was not proven best. Those qualifications do not establish that the chosen transition was the clearest available design. The final judgement remained the managing session's responsibility.

## Assessment of the miss

The redesign reduced the arithmetic task's size while leaving the assembly function-call model bundled into the larger function transition. At that transition, the recorded acceptance credits local definitions before use without recording a comparison with a smaller complete-function example. That left argument arrival, result preparation and control returning without their own small worked connection.

The opening’s follow-up checks largely verified the chosen sequence's explanations, gates, state and layout. Those checks provided useful evidence, but agreement with the plan did not validate the plan's instructional bridge. The broad review question was not carried through into a specific comparison between the chosen first complete program and a smaller complete candidate.

Automated execution and regression tests can check that `ret` preserves the result and that a caller resumes at the right moment. They cannot decide where that experience belongs in a learner's sequence. No measured novice trial was available to supply that additional evidence. More checks of the same implementation would not, by themselves, settle this design question.

## Correction and prevention

The new worked function makes the bridge explicit immediately after the first addition: one supplied argument, one arithmetic operation, and return to the caller. The later arithmetic exercises and trip function remain useful practice and composition; this does not imply one separate activity for every opcode.

The authoring review now distinguishes **defined**, **demonstrated in a small complete example**, and **practised**. When first composing mechanisms, reviewers must identify the bridge from preparation to the task and compare the chosen first example with a smaller complete candidate. They should record why an extra bridge is useful or unnecessary, using already practised knowledge and the learner's task. This is a targeted review requirement, not proof of improved learning outcomes or a requirement to fragment later synthesis.

## Independent engineering review

A separate Codex technical/sceptic session checked this retrospective and the authoring addition against the original review brief, proposal 1, review recommendation, early sceptic note, opening implementation and independent check 00. The quoted acceptance and sequence descriptions match those records. Two requested precision corrections now limit the inference to the recorded function-transition acceptance and the opening's follow-up checks; the text does not claim to know every reviewer's reasoning. It acknowledges the original brief's relevant question, retains the managing session's responsibility and makes no invented novice-outcome claim. The added criterion is a targeted comparison within learner review, allows related mechanisms and exploratory predictions, and does not mandate opcode-by-opcode activities. No further required correction was found. This was a documentation/source review; no application change, browser pass or test execution was needed or claimed.
