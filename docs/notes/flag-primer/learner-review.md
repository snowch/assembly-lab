# Independent learner and UX review: Addition and its flags

Reviewed the actual lesson at `http://localhost:4382/assembly-lab/#/lesson/adding-and-the-flags` on 12 November 2026. I did not draft or edit the lesson. I formed the initial assessment before reading implementation source or receiving the author's explanation of the changes. No production files were changed in this review.

Final decision: keep this teaching sequence. I found no supported learner or UX fault requiring correction in the final built essential route. This is an independent agent review and browser inspection, not evidence that novices have learned the material.

## Scope and evidence

Followed `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and `.agents/skills/learning-design/SKILL.md`. The root session configured this independent reviewer as `gpt-6.1-sol` with High effort in a fresh (`fork_turns: none`) agent, following the authoring guide's learner-review recommendation.

Read the complete essential route in the browser, leaving optional GCC disclosure and hardware link closed. Inspected the earlier `same-bits-two-readings` and `four-bit-arithmetic` lessons in the browser. Also inspected the earlier hexadecimal page to check notation. Read the primer component, labels, and relevant styles only after forming the initial assessment. This is a learner review, not the independent architectural correctness review.

The root signalled that build 2 was stable before final verification. All four final browser contexts used blocked service workers and fresh browser storage with an explicit saved theme before navigation. The served build marker was `ef82278fdc1309307c6e7ff09ccbf16064f9bd45456754cb13abe7acca45ac15`.

| Viewport | Requested and rendered theme | Computed body background | Computed text | Document width / scroll width |
| --- | --- | --- | --- | --- |
| 375 × 900 | light / light | rgb(243, 246, 245) | rgb(16, 26, 24) | 375 / 375 |
| 375 × 900 | dark / dark | rgb(16, 22, 21) | rgb(232, 238, 237) | 375 / 375 |
| 1280 × 900 | light / light | rgb(243, 246, 245) | rgb(16, 26, 24) | 1280 / 1280 |
| 1280 × 900 | dark / dark | rgb(16, 22, 21) | rgb(232, 238, 237) | 1280 / 1280 |

No browser page errors occurred during the final four-case pass. Full-course automated checks were outside this review; do not treat these focused browser checks as a full-suite result.

## Learning route

The observable outcome is to calculate result bits and identify the four flags for an unfamiliar addition, distinguishing the retained result from the exact signed and unsigned sums. Branches, compiler overflow idioms, and hardware implementation are deferred or optional.

| Mechanism | Definition and demonstration before composition | Practice and bridge |
| --- | --- | --- |
| N and Z read retained result bits | “N copies the top result bit” and “Z is 1 when every result bit is 0,” each beside a complete four-bit addition | A fresh small addition supplies result bits, so the learner practises flag reading before also having to perform 32-column arithmetic |
| C and V answer different range questions | Separate small examples show both input readings, their exact sums, the range judgement, retained result, carry out and all four flags | Fresh small practice requires all four choices. Its feedback gives four separate explanations and a takeaway that distinguishes range failure from result sign |
| Four bits to 32 bits | The transition explicitly says “The top bit changes from bit 3 to bit 31,” gives both new ranges and names real Arm addition | The following prediction changes width while retaining the same interpretation questions. The adder then shows the exact same run |
| Carry into versus carry out | Earlier arithmetic teaches carrying left and retaining the available places. The real-width adder labels the two top-bit carries, and the local rule connects their disagreement to V | Column, group, back and full reveal controls support inspection. Fresh 32-bit additions require applying the rules independently |

The smallest useful candidate is a complete four-bit addition with the retained bits visible. The implemented N/Z examples are that size. The C/V examples add the necessary signed/unsigned arithmetic and range comparisons, rather than asking a beginner to infer them from flags alone. The fresh small practice is a useful bridge: it combines the four rules without also requiring large hexadecimal arithmetic. Another separate miniature is unnecessary on the reviewed evidence.

The four worked examples add phone scrolling, but each has a distinct teaching job. The repeated flag rows show that every addition produces all four facts, rather than suggesting there is a special instruction per flag. The real-width prose earns its repetition by introducing bit 31 and the carry comparison. The sequence makes causes local: result bits for N/Z; exact sums and their ranges for C/V; carry marks beside the real-width flag explanation.

## Prerequisites and assumed knowledge

- The two readings of the same bits, negative highest positional weight and the fact that changing a reading does not change bits are defined, demonstrated and practised in Signed and unsigned readings.
- Binary column addition, carry passed left, discarding an extra carry beyond four retained places, and the distinction between calculation reveal and instruction execution are taught in Arithmetic with four bits.
- Hexadecimal notation is taught on the earlier hexadecimal page. Register names and ordinary instruction syntax belong to the earlier course; the present lesson locally explains the new `adds` behaviour and its contrast with `add`.
- “Flag,” “setting flags,” “overflow,” and “adder” receive local explanations. I found no new unexplained essential-route term beyond the inspected preparation.
- The GCC disclosure and linked circuit are optional and are not needed to attempt either exercise.

## Browser checks

Verified in every final width/theme combination:

- Initial miniature examples have complete input/result labels, bit positions and width qualification. Range sentences now read as complete sentences.
- Empty small submission gives a specific instruction. An incorrect submission reveals an explanation; a correct submission is acknowledged. Feedback has four flag bullets and a distinct takeaway.
- Reload restores four selected radio values and submitted feedback. Clear after reload removes all four selections and feedback. A subsequent attempt works. A separate reset probe confirmed both DOM checked state and painted empty controls.
- Radio groups expose flag names through fieldsets/legends. Native arrow-key selection works. The keyboard focus ring is visible in light and dark themes. Radio targets measured 44 × 44 pixels, with larger associated labels.
- Checking the real-width prediction reveals the calculation. The input run remains the same. Next column, Next group of four, Back, Show all and Reset work. Reset restores hidden result/flag state.
- The main challenge reports missing choices specifically. A valid submitted attempt passes and opens the second calculation. The second calculation can be revealed and reset.
- The phone examples stack; small practice and the three main challenge groups reflow into two flag columns. Controls wrap inside the card. No page-level horizontal scrolling appeared in initial or interacted states.

The 32-bit overview is dense on a phone, as expected for 32 places, but the active column's arithmetic is available as readable text and the selected group can be enlarged. Neither is needed to decode the new four-bit examples.

I found no pre-attempt worked solution to either fresh exercise in the visible route. The lower calculation remains locked until its preceding challenge passes. The optional GCC disclosure, later hint ladder and full solution ladder were not opened in this essential-route review.

## Findings and rejected suspicions

No accepted severity-ranked correction is requested.

| Location | Suspicion | Evidence and disposition | Correction direction |
| --- | --- | --- | --- |
| Header theme control | Exact Playwright label lookup failed | DOM inspection shows a real enclosing label containing Theme and its select. This was a brittle exact-text lookup, not an unlabelled control | None |
| Four-bit practice keyboard focus | Computed CSS outline is `none` | Screenshot shows the browser's native orange focus ring on the focused radio; arrow-key changes work | None |
| Optional “How GCC checks for overflow” line | Plain text extraction resembled an empty heading | Screenshot shows a closed disclosure, correctly separated from the essential route | None |
| Small practice after restoration | A rapid screenshot raised concern about stale painted selection | Focused recheck with settled rendering confirmed all four radios clear in DOM and image, and subsequent keyboard/mouse changes work | None |

## Evidence files and remaining uncertainty

Final screenshots exist for all four configurations using these exact filename forms, where width is `375` or `1280`, and theme is `light` or `dark`:

- `/workspace/scratch/flag-review-final-{width}-{theme}-examples.png`
- `/workspace/scratch/flag-review-final-{width}-{theme}-focus.png`
- `/workspace/scratch/flag-review-final-{width}-{theme}-adder.png`

Representative inspected files: `/workspace/scratch/flag-review-final-375-light-examples.png`, `/workspace/scratch/flag-review-final-1280-dark-examples.png`, `/workspace/scratch/flag-review-final-375-dark-focus.png`, `/workspace/scratch/flag-review-final-375-light-adder.png`. The separate reset screenshot is `/workspace/scratch/flag-review-reset-cleared.png`.

The repeatable browser script is `/workspace/scratch/flag-review-final.mjs`; its compact results are `/workspace/scratch/flag-review-final-checks.json`. Earlier exploratory checks are separate from this final build pass.

No human study was available. Passing four-choice flag tasks does not by itself distinguish sound reasoning from guessing or rule memorisation. The next evidence should be an uncoached beginner's first attempt on fresh inputs, followed by their explanation of why the signed and unsigned fit judgements can differ. Screen-reader interaction, physical touch use and magnified browser zoom were not tested. No claim of complete accessibility or learner validation is made.
