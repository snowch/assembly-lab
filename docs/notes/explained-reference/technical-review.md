# Independent technical review

Copyright © 2026 Christopher Snow

## Scope and sources

Reviewer did not author the guide families, model or UI. Read the checked brief, shared types/model, coverage generator and tests, all four guide families, original quick-reference catalog, assembler form definitions and reference-target helper. Source checks covered all83 mnemonic entries and176 named forms. The learner is a programmer with the front-page prerequisites and only lessons before the current exercise; broader instruction forms remain optional reference material.

## Findings

1. **Medium: non-updating load forms overclaimed base preservation.** Initial ordinary-offset/register-offset/pair rules said the base was unchanged. Valid `ldr x9, [x9, #8]` and `ldp x9, x10, [x9]` can also name that register as a load destination. Independently assembled and ran both: the base initially contained the data address4259840; the destination write replaced it with23 and17 respectively. Direction: distinguish absence of address writeback from a load destination write; qualify example-only unchanged-input claims. Accepted. The memory drafter corrected rules and added seven overlap checks; independent verification of that correction is recorded below.

2. **Medium: the contextual encoding rule remained off-screen.** On initial opening from the screenshot's invalid ADD, the correct immediate form was first and expanded, but its essential-rule list began at891.5px on a375×900 phone. The actual immediate limit bullet began at1035.45px and ended at1167.41px, entirely outside the viewport. Desktop1280×900 had the same list beginning at891.3px. The draft browser assertion only checked that the list's top was below900px, passing with8px visible. Direction: bring the actual failing bound into view and test its bounding box, preserving keyboard focus and the underlying page position. Accepted and corrected by root; final built verification is recorded below.

3. **Medium: extension operand help selected the wrong result-width form.** The initial form helper returned nonexistent `register` for SXT[B/H]/UXT[B/H], and the UI fell back to the first w-result guide. A source such as `sxtb x8, x9` therefore requested 32-bit-result guidance despite its explicit64-bit destination. Direction: use the destination spelling to choose x-result/x-spelling versus w-result, and pin those mappings. Accepted and corrected by root; final source/browser verification is recorded below.

## Model and coverage audit

- Each displayed program has a fixed independently prepared context, one focus instruction and safe finish code. x28 is reserved for the supplied return address. Local labels are namespaced for combined native execution.
- `stateAfter` uses an inclusive trace index. The implementation correctly takes before at focusIndex−1 and after at focusIndex. It checks a four-byte single focus instruction, exactly one visit and a returning run.
- Registers retain bigint precision with explicit signed/unsigned/hex readings. Memory is reconstructed from original bytes and only stores through the observed trace moment, excluding later continuation/cleanup. Address watches are distinct from memory-content watches and expose byte count for their UI labels.
- All original syntax strings remain represented. Coverage checks every mnemonic once, nonempty rules/examples per form, each prepared run, each rejected operand's diagnostic key and byte-exact generated native/grammar fixtures.
- Reference computation takes only authored reference data. Neither examples nor the reference UI use challenge expected values, hidden tests or reference solutions. Exercise allow-lists and persisted source remain independent.
- Full prepared listings are optional context. The main examples show only the actual instruction between its observed before/after states. Branch outcome comes from the real step, not prose assumptions.

## Independent checks before final corrections

- Focused unit command: `npx vitest run content/reference-guides/*.test.ts packages/views/src/instruction-help-target.test.ts packages/views/src/AssemblyEditor.instruction-help.test.tsx`:8 files,331 tests passed. Log `/tmp/explained-tech-unit.log`.
- GNU/QEMU: `AL_TOOLS=/workspace/native-tools node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/real-tools/check.mjs --corpus --only explained-reference-examples`:1 program,275 calls,2143 states, zero differences. Log `/tmp/explained-tech-native.log`.
- GNU/model grammar command with `--lines --only explained-reference-mistakes` checked all15 grammar files (the runner's current lines mode does not narrow by that filter):39675 lines,184 outside the browser subset, zero disagreements. Log `/tmp/explained-tech-grammar.log`.
- Initial Chromium flow at375/1280×900 in actual light/dark checked dataset theme, selected ADD immediate, computed example result, advanced-form disclosure, closed focus return, unchanged saved source, memory byte/contents distinction, address label, branch outcome, complete-program highlight and no horizontal overflow or JavaScript page errors. These interaction checks passed, but the stricter essential-rule visibility criterion failed as documented above. Root was informed of that failure rather than treating the weak assertion's pass as evidence the rule was visible.
- Screenshots `/tmp/explained-tech-initial-375-light.png` and `/tmp/explained-tech-375-light.png` document initial rendering. The initial screenshot was visually inspected.

## Limits

No full repository suite, human novice study, screen-reader session, Safari session or physical-device session was run by this reviewer. Native evidence covers the displayed scenarios and parser boundary cases, not every arbitrary operand combination or architecture overlap behaviour. Functional and agent-review evidence does not establish learning effectiveness. Parent records full-suite and publication verification separately.

## Corrections and final verification

Original findings and commands above remain separate from the successful correction checks below.

### Source and focused correction checks

The memory correction now distinguishes absence of address writeback from a load destination write, including a destination that aliases the base or index. Independently read the updated rules/example qualifiers and ran `content/reference-guides/memory.test.ts`:11 tests passed. The new test-only overlap programs cover ordinary/pair loads and do not alter any displayed scenario or native fixture.

The reference-target helper now maps signed byte/halfword x destinations to x-result, unsigned x spellings to x-spelling, w spellings to w-result, SXTW to x-result and bitfields to field. Read the corrected source, including case-insensitive destination matching. Combined model/coverage/target/memory tests independently passed:4 files,219 tests. Log `/tmp/explained-tech-final-unit.log`.

The first corrected-build browser attempt still failed the strict bound-visibility criterion:375×812 light, bound top809.3125px and height131.953125px, leaving most of it below the viewport. Parent independently identified the navigation-frame timing: it could run before the search state's matching entry committed. This original failed command remains a failure; a further effect-dependency correction is awaiting final recheck.


### Final built recheck

The final corrected build was independently driven in Chromium at375×812 and1280×812, in actual light and dark themes (root data-theme asserted in every context). All four workflows passed. Checked build ID `7db432bd50b78713ea893309c4181ad07442f7bacadd3ce220aa95823876be12`, script `assets/index-C7uUVycZ.js`, commit metadata `f940b1cbb3cd66aeef18e74902fc33ce46caf055` with the working-tree changes included. Log: `/tmp/explained-tech-final-rerun.log`; script: `/tmp/explained-tech-final.mjs`.

- Contextual ADD opened the immediate form first and brought the actual encoding-bound bullet fully into view below the sticky heading/search. On phone the bullet was y489.125px,height131.953125px; on desktop y539.953125px,height79.171875px. Both were wholly inside812px viewports. This replaces the initial weak list-top criterion.
- Search retained keyboard focus. The underlying page scroll position stayed exactly unchanged during opening and closing. Close and Escape returned focus to the exact invoking control; this included the native phone modal.
- Invalid `sxtb x8, x9` selected x-result, invalid `uxtb x8, x9` selected x-spelling (with its advanced group open), and a spilling UBFX selected field. The helper emitted only public mnemonic/form/issue identifiers; the guide model did not receive submitted code.
- Checked STRB's prepared309 and stored low-byte53, a memory-content label with one-byte size, a distinct address label for ADR, the model-derived conditional branch outcome and default RET context.
- Full prepared listings contained real newlines, one highlighted instruction, short local labels and12px computed code/mark font sizes. No dialog or page horizontal overflow and no JavaScript page errors were recorded.
- Edited source survived every reference lookup and reload unchanged. Reference browsing did not run the exercise or reveal its expected answer.
- Captured `/tmp/explained-tech-final-375-light.png`, `...375-dark.png`, `...1280-light.png` and `...1280-dark.png`. Visually inspected the final phone/light and desktop/dark screenshots.

All three medium findings are closed. No remaining technical blocker was found in this review. The independent native/grammar evidence remains valid because the subsequent accepted changes affected UI behaviour and prose, plus test-only overlap cases, without changing any displayed program, preparation or watched memory.
