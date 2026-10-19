# Independent learner review: 18 — Recursive calls and separate frames

Reviewed read-only against http://localhost:4290/assembly-lab/#/lesson/recursive-calls. No earlier review notes read. Read CLAUDE.md, docs/style.md, docs/authoring.md, the cover prerequisites, course ordering, the target's complete prose/labels/options/hints/tasks/model notes, listing data, stack/prediction components and relevant shared strings. Read the preceding calls lesson in full and preceding lesson prose for prerequisite definitions; one large combined prerequisite read was truncated, followed by targeted main-paragraph reads. This is a learner clarity review, not an independent architecture proof.

Actual Chromium coverage: 375×900 and 1280×900, light and dark, fresh contexts. Viewed initial prediction, committed a representative choice, viewed the investigation's preset state, and pressed Next once in all four configurations. Opened first construction hint and the prediction's Stepped note on phone/light. No challenge solutions entered; no exhaustive input matrix. The document had no horizontal overflow in any configuration. Screenshots/text: `/tmp/course-clarity-audit/18-*`; script `browser18.cjs`. Target source did not change.

## Findings

### 1. Low — prediction still presents instruction-stepping guidance

Quote/state: “STEPPED”, then opening it shows “Each step runs one instruction in the simulator. Between steps, the simulated processor stays as the last instruction left it.” This is directly above “What sum does fade_sum(7) return in w0?” on the untouched prediction. There is no Next control in that card: Check your prediction runs the entire calculation. The following, separate stack figure is the place where steps are available.

Location: `content/lessons/recursive-calls.ts:95`–106 (memory-prediction declares timeModel steps without a prediction role); `packages/views/src/strings.ts:10`. Failure prediction has the same pattern at its loop-prediction declaration.

Learner effect: reintroduces the guidance-placement confusion recently identified in Module 0. It blurs the distinction between predicting the final result and moving the simulator one instruction at a time.

Direction: apply the existing prediction-role treatment to these prediction cards; leave stepping guidance beside the actual stack steppers. Verified four-config badge display; expanded note verified phone/light, screenshot `18-prediction-note.png`.

### 2. Low — investigation starts partway through without stating its starting point

Quote: “Step until all the calls are active, then follow the returns.” (`content/lessons/recursive-calls.prose.ts:18`). Nearby caption: “Inspect the stack when the recursive calls are all active.” The figure is actually initialised with `initialStep: 22` (`content/lessons/recursive-calls.ts`, investigation props). Once the earlier prediction is checked, this independent figure already shows 128 bytes allocated, a midway slider and “Ran stp x29, x30, [sp, -32]!. Next: mov x29, sp.” Before touching this figure, the learner has therefore already reached the stated depth.

Learner effect: a learner following the imperative cannot tell whether to repeat the descent in the preceding figure, use Reset here, or continue from the current snapshot. The earlier figure starts at the beginning; this figure starts halfway, without prose distinguishing their states. The caption describes the intended inspection point but does not explicitly say the figure has already advanced there.

Direction: identify the preset starting moment and which figure to use for descent versus returns. Keep the existing instruction order and computed snapshot. No need to change the prediction itself: its final-return moment is explicit.

Evidence: four actual-browser initial snapshots `18-*-deep.png` and Next snapshots `18-*-next.png`, plus initialization in lesson structure. This is a guidance/state clarity finding, not a wrong simulator value claim.

## Assumed knowledge

No unsupported prerequisite knowledge found in the target's material. Recursion and base case are defined in the opening. Relevant earlier definitions:

- `calls-and-returns.prose.ts` motivation defines caller/callee, link register, stack and sp; investigation defines stack frame, stp/ldp, x29 and preservation; explanation explains saving incoming x19 before reusing it.
- The same preceding lesson's compiler note explains `-fno-inline`; Module 0's compiler note explains `-O1`.
- `shifts.prose.ts` investigation defines logical right shift and halving with dropped remainder; its question explains C `>>`.
- `memory-and-addresses.prose.ts` motivation explains little-endian ordering and w/x views; array-addresses investigation explains pre/post-index syntax.
- Module 1 and the tick-counter lesson establish hexadecimal, unsigned range and wrapping.

The motivation correctly distinguishes the current register from the next call's saved copy; I did not flag “saved value in w19” in isolation because the immediately preceding explanation establishes restoration. The final-result prediction is explicitly about the function's return, and the failure question explicitly states its instruction-limit moment. No challenge answers appear in this report.
