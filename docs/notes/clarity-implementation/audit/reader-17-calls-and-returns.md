# Independent learner review: Calls, returns and the stack

Review scope: lesson 17 only, fresh reader; no previous review notes consulted. Read CLAUDE.md, docs/style.md and docs/authoring.md; front-page prerequisites and earlier-lesson prose relevant to registers, arithmetic, branching, memory, extension and indexed addressing. Read all target prose, captions, options, challenge tasks, five-level hints, explanation feedback, reflection and model notes, plus the stack figure strings and recorded examples. Prior-lesson review covered conceptual prose rather than every earlier exercise interaction.

Browser: http://localhost:4290/assembly-lab/#/lesson/calls-and-returns. Actual Chromium inspection at 375×900 and 1280×900, light and dark. Read rendered lesson; selected and checked the first prediction and advanced the first stack stepper once in each configuration. Inspected screenshots of those controls/paired code/registers in all four configurations. Opened the first prediction's Stepped note separately on phone. No exhaustive challenge solutions or input sweep. No horizontal document overflow at either width. No application files changed.

## Findings

### 1. Medium: the first full stack investigation precedes its instruction explanations

Quote: “Follow the call, the saved registers and the return.” The prediction section immediately unlocks a full stack stepper after checking the answer. Its first step reports “Ran stp x29, x30, [sp, -32]!. Next: mov x29, sp.”

Sources: content/lessons/calls-and-returns.ts:119 (first stack stepper); content/lessons/calls-and-returns.prose.ts:18 (definitions that follow it); content/lessons/calls-and-returns.labels.ts:26 (caption).

State/setup: check the initial prediction and press Next once, before reaching Investigation. Confirmed all four configurations. The earlier Motivation has introduced the stack, sp and x30, but has not explained stp, ldp, the frame pointer, or why the report saves x19. Those explanations are in the following Investigation, which then presents a second independent stepper for the same call.

Learner effect: following the first Next prompt requires interpreting several new instructions and saved-register roles before the page teaches them. The learner must jump ahead for guidance and then encounters a second copy of the same run. The prediction question itself is fair: its immediate prose provides the calculation and explicitly asks for the returned result.

Direction: put the instruction/stack guidance before the first full walkthrough, or consolidate the walkthrough with Investigation. Retain a clear prediction gate.

### 2. Low: essential calling-convention definition is hidden as compiler provenance

Quote: “The shared register and stack rules form a calling convention. This course follows AAPCS64, the procedure-call standard for this target.” This is inside the initially closed “The recorded compiler output” note. Main prose later says “AAPCS64 requires a callee to preserve x19 through x29 and restore sp.”

Sources: content/lessons/calls-and-returns.prose.ts:7–9 and :18; content/lessons/calls-and-returns.ts:88 (question details).

State/setup: ordinary reading with optional compiler note closed, as in all four initial browser configurations.

Learner effect: the term and authority behind the core preservation rules appear in the main explanation without their introduction. A learner skipping what looks like optional compiler/version information misses foundational vocabulary needed by both exercises.

Direction: keep the short calling-convention introduction in the main explanatory path near the first preservation rule; leave compiler settings and provenance in the optional note.

### 3. Low: the recently identified prediction/stepping guidance placement recurs here

Quote: “STEPPED” above “What does trip_report return in w0?” Opening it shows “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” The card has a prediction choice and Check your prediction, with its actual stepper below.

Sources: content/lessons/calls-and-returns.ts:106–108; also :168–170 for the failure prediction. Shared wording: packages/views/src/strings.ts modelBadge/modelNote.

State/setup: uncommitted first prediction; open its Time model: Stepped button. Badge present all four configurations; expanded note confirmed on phone. Screenshot /tmp/calls-prediction-note.png.

Learner effect: the note explains a control absent from this card and duplicates guidance offered with the following actual stepper. It retains the same prediction-versus-investigation placement issue the user just identified.

Direction: apply the prediction-specific presentation consistently to these memory-prediction and loop-prediction cards; keep stepping guidance with the stepper.

## Assumed knowledge audit

The missing introductions are placement gaps above, not facts absent from the lesson. The first stepper assumes stp/ldp and saved-register roles before Investigation explains them; AAPCS64/calling convention depends on an optional provenance note.

No additional unsupported prerequisite claim found. Earlier evidence: meet-the-machine.prose.ts explains registers, instruction operands, argument/result registers and Next/Back; one-pattern-three-readings introduces hexadecimal; constants-and-widths explains w/x widths and upper-bit clearing; memory-and-addresses explains bytes, pointers, bracketed addressing and little-endian ordering; array-addresses.prose.ts Investigation explicitly defines pre-index and post-index addressing; shifts explains unsigned halving; counting-up explains that a recording limit does not establish eventual return. The front page already requires small C functions, unsigned arguments, return, conditionals, loops and arrays. Caller/callee, link register, stack, sp, stack frame, frame pointer and leaf function receive definitions in this lesson.

## Evidence files and limits

- /tmp/calls-375-light.png, /tmp/calls-375-dark.png
- /tmp/calls-1280-light.png, /tmp/calls-1280-dark.png
- /tmp/calls-prediction-note.png
- /tmp/calls-{375,1280}-{light,dark}.txt (rendered initial main text)

Target hints and feedback were read from source; challenge executions were not solved. Screenshots sample the first interaction, not every vertical region in every theme. No claim of technical ISA revalidation or exhaustive accessibility testing.
