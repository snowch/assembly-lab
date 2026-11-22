<!-- Copyright © 2026 Christopher Snow -->

# Subtraction flags and negation: focus brief

The user accepted the live-page coverage review: remove repeated elapsed-time/counter-wrap material, keep the explanation of why subtraction carry means no borrow, then teach neg/ negs and the signed-limit exception. Replace the old elapsed-ticks question with a fresh negation-and-flags exercise. The route and existing learner storage must remain safe.

Observable outcome: predict retained 32-bit negation results and C/V, and explain why carry from a subtraction means no unsigned borrow. Assembly function writing, new constant-loading requirements, C signed-overflow guarantees and processor circuit design are deferred.

Evidence already inspected in the public browser: Arithmetic with four bits, Addition and its flags, Measuring elapsed ticks, and Subtraction flags and negation. Raw previous coverage read is /workspace/work/subtraction-coverage/live-pages.json. Read-only source inspection confirms the target currently repeats three counter adder figures, modulo/full-turn explanations and an elapsed-time quiz. Earlier four-bit arithmetic teaches inversion/add-one/retention; addition teaches NZCV; the previous counter's optional pane states C=0 borrow/C=1 no borrow but does not derive the carry equivalence.

Prerequisites: simple C and binary from the cover; hexadecimal/signed bit weights in Module1; subtraction by addition in Arithmetic with four bits; NZCV and flag preservation in the earlier Module2 pages. Familiarity with a rule is distinguished from the new derivation and application.

Proposed essential route: brief visible recap and goal; explain a+2^32-b and compare unsigned a>=b vs a<b, with one model-derived 32-bit subtraction illustration; introduce ordinary negation as zero minus a value, with a small model run; predict the existing signed-minimum case before revealing its model trace; independently answer a new negation exercise with zero and a value next to the signed minimum; finish with short reasoning about the latest flag-writing instruction. All essential rules stay visible. The old counter recap and quiz are retired from this published page, not silently relabelled.

Fresh application candidates: negs on zero (C=1, V=0), and 0x80000001 (result0x7fffffff, C=0,V=0). The worked minimum case demonstrates V=1 before these fresh cases; transfer just outside that boundary distinguishes the misconception that every negative input overflows. Zero distinguishes borrow from a negative-result sign. Require unsigned decimal result plus C/V; existing model grader derives expected outcomes. N/Z remain explained, but are not redundant input fields.

Other misconception hypotheses: treating carry as borrow; assuming negating always changes bits; reading preserved flags as a new operation's flags. These are design hypotheses, not observed novice-study findings. The user directly identified repetition.

All numeric examples must be checked in the model and covered by GNU/QEMU corpus calls. Existing compiler recordings remain unchanged; new assembly-only teaching snippets are explicitly authored and checked. No fake C associations. Reuse existing adder, stepper, prediction and grouped answer controls; avoid adding generic UI or grader logic.

Saved-state plan: retain the route and unchanged signed-limit prediction/stepper IDs. Give the replacement assessment a new challenge ID, so old elapsed answers/completion cannot satisfy it. Keep unknown historical stored entries untouched. Source provenance/native checks may retain archived old examples with a documented retired obligation in pacing tests.

Drafting and separate learner/technical reviews are required. Browser checks cover phone/desktop, actual light/dark, keyboard, prediction gate, correct/wrong/blank exercise outcomes, reload/reset and old saved state. Passing tests and agent reviews are functional evidence, not proof of learning effectiveness; no novice session is claimed.
