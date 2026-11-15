# Compact global calculator

## Authorised scope and checked facts

The user approved the interactive compact calculator mock and asked for implementation and merge. The live review and mock are recorded outside the repository under `/workspace/output/calculator-ux-audit-2026-11-15/` and `/workspace/output/calculator-mock/`. Their browser evidence is distinct from production verification. No novice or assistive-technology study was performed.

The observable goal is to enter A and B at an explicit width, calculate, compare exact arithmetic with the retained word, and change its reading without re-entering values. The global tool is available before hexadecimal, signed arithmetic and flags are taught. Its basic decimal route must work without opening flag explanations. Prefix notation remains locally visible. Detailed entry/width rules, bit inspection and flags are optional.

The approved mock addresses measured production issues: long guidance before entry, an answer below the bit/carry derivation, a low-contrast Calculate hover state, lost results on reading-only changes, and errors hidden on short phone viewports. The effects on novice understanding remain hypotheses. The existing prefix parser rejects oversized entry without resizing or truncating; explicit width changes retain low bits or add upper zeros. Valid patterns and invalid drafts need different width feedback.

## Implementation boundaries

- Reuse the existing calculator model and BigInt precision. No new operators, automatic width selection, numeric sign extension or CPU execution.
- Show symmetric operand fields, one Calculate action and the numeric result before inspection. Retain exact-result qualification, reuse, 16-bit half editing and accessible keyboard bit editing.
- Keep arithmetic flags optional. The model computes N/Z from retained bits, C as carry for addition or no-borrow for subtraction, and V from the exact signed range. These describe scratch arithmetic, not changed processor state. Carry derivation remains addition-only.
- A completed result survives a reading-only change if its source patterns, width and operation still match. Its exact arithmetic value is recomputed under the new reading. Operand, width and operation edits clear stale output. Previously uncalculated input never gains a result merely by changing reading.
- Preserve the existing handoff key and validate restored traces against current inputs. Migrate the former edit view and open carry/half work to the new inspection disclosure. Saved flags are recomputed from validated model inputs.
- On explicit Calculate or half-application failure, focus and reveal the affected input and local error below the sticky dialog heading. Never move focus on ordinary typing.

## Sources and verification route

Read `CLAUDE.md`, `docs/authoring.md`, `docs/style.md`, the local learning-design skill, calculator parser/compute/carry model, workspace codec and current UI. Flag semantics follow the existing simulator's add-with-carry implementation in `packages/machine/src/run.ts` and the Arm sources recorded in `docs/sources.md`. The separate copy pass owns new strings and their canonical record.

Small complete check: signed 32-bit `0x7fffffff + 1`, then change only reading. Fresh applications include unsigned `0xffffffff + 1`, `0 - 1`, 64-bit exact arithmetic beyond Number precision, and a too-wide pasted pattern explicitly made valid at 64 bits. Check old saved work, malformed input, clear/reset, reused result, bit/half edits, shift counts, flags and shared scrolling. Browser checks cover initial, calculated, edited, restored, closed/reopened and theme states, phone/desktop, both themes and short-height errors.

Independent learner and technical reviewers must inspect the actual source and built UI before this implementation account. Record their findings and fix verification separately. Focused checks precede one fixed-HEAD full repository run and CI. Preserve failures and skips distinctly. Merge only after required checks pass; verify the published commit and representative calculator flows after deployment.

## Verification record before the full run

- Initial focused model/workspace/component verification passed all 35 tests in four files. The new model flag cases compare arithmetic conditions against the simulator at 32/64-bit boundaries; existing carry tests retain their independent bit recurrence.
- The first two focused browser invocations stopped during discovery with a Node directory-import error, before any cases ran. A JSX `key` after a spread forced the Playwright transform to import `createElement` from its absolute package directory. Moving the key before the spread preserves React semantics because the spread contains no key. Test discovery then listed all 32 cases without any dependency or resolver workaround.
- The first completed focused browser run had 28 passes and four failures. Each failure came from the new test expecting a fresh closed disclosure on its second viewport iteration after same-route navigation, which correctly retains the global workspace. Explicit reload now creates a fresh document for each initial-geometry case. The separate route/close-reopen persistence checks remain intact. The affected rerun passed all four cases; the original run remains failed.
- Independent reviews accepted the numerical/state model and identified two product corrections: restore existing signed/unsigned/hexadecimal definitions in local help, and restore native checkbox appearance and flex-label layout after the shared input reset. The half-editor heading now names A. Each accepted correction was independently checked in the built site; reviews record their actual build/assets and which flows were repeated.
- Source formatting, type checks and production builds passed during focused work. No full-suite result is claimed here. The fixed-HEAD full repository run, CI and publication evidence will be recorded separately on the pull request.
