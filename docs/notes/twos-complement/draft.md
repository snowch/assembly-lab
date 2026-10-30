# Two’s complement prose draft

Drafted separately from the checked brief after reading the source lessons, their canonical prose records, and the paced lesson definitions. These are three local wording changes. No new activity, figure or section is proposed.

## Signed and unsigned readings

In `content/lessons/pacing-1-4.copy.ts`, `COPY.readings.investigation`, insert this paragraph immediately after the paragraph ending “the top bit counts as minus 2147483648.” It precedes the paragraph beginning “The other 31 bits”.

> This way of reading signed bits is called **two’s complement**. The top bit contributes a negative value; it is not a separate minus sign for the other bits.

Keep the existing `0xfffffff4` diagram and its top/other-bit decomposition as the worked example. Do not add another numerical example before Make −1.

Apply the same insertion to the corresponding passage in `content/lessons/one-pattern-three-readings.prose.ts`, `PROSE.investigation`, and `docs/notes/module-1/prose.md`, “Reading the bits”. Synchronise the live pacing copy record in `docs/notes/course-pacing-implementation/copy.md`. The paced `same-bits-two-readings` lesson explicitly uses `COPY.readings.investigation`, so changing only the original prose would leave the rendered explanation unchanged. Add the new term to the live term home for that lesson when implementing.

## After Make −1 passes

Replace `PROSE.constructionSolved` in `content/lessons/one-pattern-three-readings.prose.ts` and its canonical passage in `docs/notes/module-1/prose.md` with this exact text:

> With all 32 bits set, `0xffffffff`, the top bit contributes −2147483648 and the other 31 bits add to 2147483647. Their sum is −1. The unsigned reading is 4294967295.

Keep this text in the existing `make-minus-one-solved` challenge note, whose `afterChallenge` is `make-minus-one`. The paced lesson reuses that construction section. Do not move the decomposition into the investigation, construction introduction or exercise prompt.

## Beside neg and negs

In `content/lessons/subtracting-and-the-tick-counter.prose.ts`, `PROSE.failureExperiment`, insert this paragraph immediately after the existing `neg`/`negs` definition and before “The figure runs”. Mirror it in `docs/notes/module-2/prose.md`, “Negating 0x80000000”.

> In two’s complement, you can calculate the same 32 result bits by inverting every bit and adding 1. Inverting changes each 0 to 1 and each 1 to 0. Keep only the low 32 bits.

The paced `subtraction-flags-and-negation` lesson reuses this section. Keep the existing prediction, input and gated explanation unchanged. The new paragraph gives the general rule without stating the specific result or V flag. The existing post-answer explanation retains the signed-range qualification.

## Scope and review status

The new wording names the representation at its weighted-bit mechanism, explains the exercise’s completed result only after success, and connects inversion plus one to the later subtraction mechanism. Existing flow prose does not need expanding. No product files have been edited and no browser or executable checks have been run for this draft. Independent learner and technical review remain implementation work.

## Editorial refinement

The implementation uses two opening sentences for the success note: “`0xffffffff` has all 32 bits set. The top bit contributes …”. This preserves the drafted facts and makes the hexadecimal pattern explicit.
