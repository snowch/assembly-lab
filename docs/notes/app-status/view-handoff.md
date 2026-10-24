# Per-tab simulator and editor handoff

The restart readiness callback uses `prepareViewHandoff()` from `@al/views`, alongside the existing persisted-artifact and theme checks. A failed write or readback returns false and blocks restart. Cancellation calls `clearViewHandoff()`.

The views package snapshots mounted transient figure state to one namespaced sessionStorage item. Figure scopes use book, lesson and interactive IDs; challenge scopes use book, lesson and challenge IDs. State fields have stable file/variable names. Figure props and challenge initial-artifact data form a compatibility signature, so a changed example cannot receive an incompatible old trace position. Each tab stores its own state. The snapshot includes the exact current route and is consumed only on that route.

Ordinary refresh and navigation still reset transient figures. Only a coordinated explicit restart writes the handoff. A restored field is consumed after the first committed mount, preserving React Strict Mode's repeated initialisation without making the snapshot a permanent save. Original lesson storage still owns submitted predictions, answers, editor source and achievements; the handoff neither grades nor marks a challenge complete.

Current interactive controls use `useHandoffState` for positions, selected cases, bit disclosures, unsubmitted predictions and drafts. Challenge C/assembly builder modes and partial hexadecimal input are included. Hover/focus and pending remote-request flags remain transient. The app blocks restart while a remote compiler operation is busy. Compiler-run traces contain a function for memory reads; the handoff therefore records the call and reruns the existing compiler/model to reconstruct those results. Other snapshot data retain exact BigInt/Map/Set/Uint8Array types. No DOM events are replayed.

A storage quota failure, unserialisable unexpected state, or blocked sessionStorage prevents readiness. It cannot silently discard transient work.

## Focused verification

First command:

`npx vitest run packages/views/src/update-handoff.test.tsx packages/views/src/primitive.test.tsx packages/views/src/stepper.changes.test.tsx`

Result: 22 passed, 1 failed. The new simulator test used a non-existent shared label for the decimal register bit disclosure and did not opt into decimal mode. The actual control is the Module 0 Show/Hide the bits label; the test was corrected to exercise that intended UI.

Same command after correction: 3 files, 23 tests passed. Tests cover a typed unsubmitted number across a Strict Mode restart, one-shot consumption, a stepped arithmetic instruction with open bit patterns, failed storage/readback and cancellation, exact integer/collection types, and refusal to restore another route's snapshot. Existing primitive and register-write tests pass unchanged.

Repository typecheck was run while the parent was integrating app-status source; the first complete run before integration changes passed. Subsequent runs must be assessed against the parent's final source. Independent browser verification and the full suite are recorded in the main app-status review evidence.

## Independent review follow-up: radio drafts

The technical reviewer found a missed sibling pattern: the vendored platform prediction primitive keeps its unsubmitted radio choice in private state. A scope around that primitive does not capture the choice.

The course-owned `PredictionChoice` adapter accepts the primitive's public props and retains its native radio/commit/again control semantics and CSS classes. It uses the same one-shot handoff for its draft selection. The four course prediction wrappers use this adapter; `platform/` is unchanged. A selected draft remains separate from the committed lesson slot, so restoration cannot unlock a gate or reveal a computed result.

Verification command: `npx vitest run packages/views/src/update-handoff.test.tsx packages/views/src/module0.test.tsx`.

Result: 2 files, 38 tests passed. The new actual TracePrediction test selects a radio without checking, saves/reloads through Strict Mode, verifies the same draft is selected with no committed slot and no outcome, then explicitly checks the prediction and verifies the slot/outcome appear. Existing Module 0 prediction/gating tests pass. Independent final browser verification remains in the parent review record.
