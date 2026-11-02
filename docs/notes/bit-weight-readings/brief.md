# Bit weights and the first comparison

2 November 2026. The author approved weights aligned with their bit positions in
separate cells (no dot separators that resemble multiplication), a fresh all-ones
example, and unsigned then signed then comparison. Use appropriately configured
subagents and complete the established review/check/merge workflow.

Prior knowledge: basic binary place values and the preceding hexadecimal lesson.
Essential teaching remains visible; named views are discoverable together and
switch readings of the same bits. The all-ones example is separate from the prior
w0 subtraction result. The original 0xfffffff4 remains when teaching that actual
subtraction and arithmetic; hexadecimal-only and scratch readers retain their roles.

Facts already defined by readings.ts and source C23 N3096 section 6.2.6.2:
- Unsigned bit n has weight 2^n. In signed two’s complement only bit31 is negative.
- A set bit contributes its weight, a clear bit contributes zero. Switching a
  reading does not change the stored bits. Weights do not become zero when a bit clears.
- All ones is 0xffffffff: unsigned4294967295, signed−1. Its top contribution is
  +2147483648 or−2147483648; lower31 bits sum2147483647. All displays derive from
  existing simulator-backed reading helpers, with tests against model results.
- The existing Make−1 exercise would be answered by this worked example. Use a
  fresh Make−3 challenge: 0xfffffffd, unsigned4294967293, signed−3. Model tests must
  establish those values; its worked solution stays behind successful completion
  (or the final hint as appropriate). Preserve rejection, hint and reset coverage.

Opt-in teachingReadings presentation: unsigned, signed and Compare controls visible
at once; unsigned initially. Retain 32 editable bits and aligned top-bit marker.
A compact strip labels bit31,30,…3,2,1,0 and their weights in separate aligned cells,
with omitted positions explicitly labelled. Use grouped decimal digits without
breaking numbers; contained scrolling on narrow screens with a visible cue.
No extra subtotal for omitted bits. Preserve full contributions in the calculation
and accessible summary. Reset restores initial bits and unsigned mode; switching
views preserves bits. Saved/updated view state must remain coherent.

Separate GPT-6.1 Medium draft; GPT-6.1 High agents implement UI and content in
separate files. Independent learner High and technical Extra High review final
built phone/desktop light/dark, controls, mapping, starting state, reset/restoration,
answer gates and sibling readers. Keep canonical prose current. Preserve original
failures separately from focused reruns, and keep HEAD fixed during full browser checks.
