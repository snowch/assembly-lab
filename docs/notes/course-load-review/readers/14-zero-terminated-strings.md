# Reader 14: Strings and the zero byte

Module 7, second lesson; course index 14 (zero based). Snapshot f1fdf35. Review only; no implementation changes.

## Prerequisites and novelty

The learner has completed the fourteen preceding registry entries, through Array addresses and moving pointers. They have practised loops, conditional/zero branches, byte loads, widths, indexed addresses, moving pointers and pre/post-index updates. Earlier array work explicitly says to check the empty case before the first load. The entry requirements supply basic C; this review does not assume later compiler, multiplication, stack or call lessons.

New ideas are a C string's zero terminator, ASCII representation, excluding the terminator from a count, and the distinction between a valid readable capacity and an expected terminator. Bounded scanning combines an existing count-controlled boundary with the new data-controlled boundary. Marker counting subsequently adds a familiar comparison/count action. No new opcode is necessary. This is appropriate synthesis, not evidence for separating every mechanism into its own lesson.

The first attempt asks “What length does label_length return in x0?” for explicit prepared bytes and capacity. It can be answered from the newly taught rule without tracing the compiler's entire control flow. Its three hexadecimal alternatives use already familiar notation. Prediction-first is appropriate here; I found no high-severity novelty overload.

## Confirmed findings

### Low: essential C control-flow explanation is optional

Evidence: the opening listing contains `if (label[length] == 0) break;`, while its explanation, “In the C loop, break exits the nearest enclosing loop”, is inside the initially closed “The C loop and its boundary” disclosure. The previous fourteen lessons' section text does not introduce `break`. The learner can understand the first answer from the string definition, so this does not block the prediction. It does make reading the worked C and relating its early exit to `cbz` depend on discovering an optional prerequisite explanation.

Reproduction: fresh context, opening section, disclosure closed; visible paired listing. Source: `content/lessons/zero-terminated-strings.prose.ts`, opening details; parsed lesson question section. Direction: place the short `break` definition beside its first visible use. This is a prerequisite placement issue, not excessive simultaneous machine novelty.

### Medium: phone byte-scan tracking requires repeated vertical travel

Evidence: after checking the first prediction and pressing Next four times, the bounded stepper reports “Ran ldrb w2, [x3, x0]. Next: cbz w2, .L1.” Below the controls are four register summaries, the eight-cell “Memory bytes” grid (three rows at 375px), repeated “Not accessed by this instruction” labels, and a further transfer explanation/bit diagram. In `/tmp/course-load-review/zero-terminated-strings-phone-stepper.png` the isolated figure is about 1,730px tall. The controls sit around 490px down and the final memory row around 1,200px down. The task is “watch which byte each load highlights”; following later byte positions while advancing instructions therefore requires scrolling between action and evidence. At 1280px the eight bytes share one row, considerably reducing this burden.

This is avoidable interface tracking, not eight new concepts. The shared memory component renders every unchanged-access label and the transfer representation on every load; the lesson asks primarily for the location of the current byte and its zero test. Direction: offer a compact byte-scan presentation with the active address/value and count near the controls, or make the repeated access explanations/transfer detail optional while preserving address and access meaning. Keep full detail available. Source: `packages/views/src/interactives/MemoryStepper.tsx` and `packages/views/src/strings.memory.ts`.

## Design recommendation, not a confirmed fault

The first construction asks “Write a scan that stops at either the first zero or the supplied capacity.” The explicit no-zero worked run, “Inspect a bounded scan with no zero byte within its capacity”, appears later in Generalisation. Moving or linking that run before construction would let a learner inspect both exit conditions before writing. However, both rules are already explained before the first prediction and the bounded source is fully visible. This is a potentially useful staging improvement, not proof that the current first construction is unreasonable.

## Keep

- The initial explanation defines string and terminator in place and distinguishes readable storage from text length. ASCII is defined, not presumed.
- Byte indexing simplifies the previous lesson's scaled element addresses: “No scaling shift is needed.” Moving-pointer scanning explicitly reuses post-index addressing.
- The main prediction gates its walkthrough; checking an incorrect choice still opens investigation, allowing feedback and exploration without forcing guessing until correct.
- The empty-string run and missing-terminator bounded run isolate different boundary cases. The failure experiment changes count/test order, then explains the mechanism rather than introducing another instruction family.
- Marker counting is a reasonable closing transfer task, with the valid-terminator assumption stated locally. ASCII character `0` versus the zero byte and bytes versus displayed characters are useful, bounded qualifications.

## Coverage and limits

Read all ten sections, challenge tasks/starting editor configuration and test descriptions, lesson programs/source associations, recorded `label_length` C/listing, MemoryPrediction, MemoryStepper, and shared memory labels. Read repository instructions and prose/visual guidance. Prerequisite assessment used only earlier parsed lessons. No challenge solutions are included here.

Browser: four fresh contexts at 375×900 and 1280×900, each with light and dark system preferences. Actual body backgrounds were light `rgb(243, 246, 245)` and dark `rgb(16, 22, 21)`; no page horizontal overflow. In all four: initial page, first prediction checked, four steps in each unlocked bounded/normal/empty/no-zero stepper, and normal details opened. Captured initial, stepped and disclosures full-page screenshots for each combination. Additional 375px light session checked the failure prediction and ran the unchanged first construction starter to inspect failure feedback. Inspected cropped phone stepper and desktop viewport to assess action/evidence spacing.

Artifacts: `/tmp/course-load-review/zero-terminated-strings-*`; browser script/log contain exact actions. The wrong-loop trace after its gate, full traces to return, Back/Reset, successful submissions, progressive hints, alternate editor mode and restored progress were not exhaustively exercised. No external compiler calls, rebuild or app edits. These are bounded expert observations, not measured learner performance.
