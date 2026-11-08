# Constant halves overview: checked-facts brief

## Outcome and preparation

The user requests the proposed two-block diagram beneath the mov/movk introduction, with individual bits as optional detail. The learner should trace which 16-bit half an instruction writes, and construct a fresh constant while retaining its other half. Loading a constant already defines hexadecimal and the 16-bit split; One addition defines the x/w relationship. The following page develops 64-bit write effects. No additional arithmetic or architecture topic is needed here.

The existing worked sequence is mov w0, 3; movk w0, 2, lsl 16; ret. Existing machine tests and the differential corpus cover it. The states are computed by traceText, viewAt and halves16: initially 0; after mov, 0x0000 0003; after movk, 0x0002 0003. The fresh Build 1000000 challenge, hint ladder and solution gate stay intact. No worked answer to that exercise may appear before success.

## Facts and rendering contract

- w0 selects 32 bits; its upper/lower 16-bit halves correspond to four hexadecimal digits each.
- mov w0 writes both halves, even when the upper half stays zero.
- movk w0 writes its selected 16-bit half, even if its bits already match. With lsl 16 it selects the upper half; without it, the lower half. The other half is kept. Arm MOVK pseudocode and packages/machine/src/run.ts replace the selected slice. All w0 writes also clear x0's upper 32 bits, developed on the next page.
- Inspection found halves16 currently infers movk's selected half from value changes. Correct that to use the decoded instruction's shift, with regression cases for identical writes and unshifted writes. A write must not be presented as a change.
- Preserve the existing detailed w16 mode on other pages. Opt this page's worked and gated solution figures into a compact overview, reusing the trace, controls and half rendering. The two halves should remain adjacent at phone widths so the 32-bit grouping remains visible. Show explicit Written/Kept text, solid/dashed outlines, half width/position and current hexadecimal values. Optional individual-bit detail must reflect the same trace and retain its existing grouping.
- Put the introduction immediately before the figure. Keep essential lsl 16/omitted syntax guidance visible before using those instructions, rather than relegating necessary knowledge to optional detail. Minimise duplicated explanation.
- Keep initial, ran, next, Back, Reset and restored states distinguishable. Controls must remain keyboard accessible; no automatic focus/scroll movement.

## Learning and UX hypotheses

Readers currently need to compare 32 individual bits to see a simple half replacement. Two grouped hexadecimal blocks should remove that bookkeeping. This is a design hypothesis supported by the user's request, not observed novice learning. The visible route must demonstrate both mov writing the whole value and movk preserving one half. Expanding bits is enrichment, not a prerequisite for the exercise.

Potential wrong rules: mov only writes the half containing nonzero bits; movk always writes the upper half; identical bits mean no write; two displayed halves are separate registers. Model checks, one outer w0 group, labelled half positions and explicit Written/Kept should distinguish them. The existing fresh construction task provides application; clicks alone are not learning evidence.

## Authoring and verification

Use a separate Medium drafting agent for new labels and short guidance against docs/style.md. Independent High learner/UX and Extra High technical reviewers must inspect the final built page and prerequisites, without author explanations before their assessment. Cover desktop/phone, actual light/dark themes, initial/two steps/ret/Back/Reset/detail, hints, gate and saved-work restoration. Check unaffected detailed w16 and x64 sibling views. Record focused/full checks and failures separately. No novice participant or assistive-technology user study is available. Do not edit platform/.
