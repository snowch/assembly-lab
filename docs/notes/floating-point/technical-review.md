# Floating-point independent technical and sceptic review

10 November 2026. Separate review agent, inherited Codex model and effort. This reviewer
did not draft or implement the lessons, numeric model, recorded compiler cases or views.
The first pass read the actual changed sources, repository rules, prerequisites and primary
references before receiving the learner reviewers' findings. The author's task rationale
was not used to form that pass. This file is the reviewer's only repository edit.

## Scope and evidence

Read all four optional D lesson structures, prose and labels; the exact numeric model and
its tests; the shared numeric and recorded-evidence views, strings and CSS; all seven
compiler sources and their source associations; the native recorder/checker and CI boundary;
the plan and machine documentation. Also read AGENTS.md, CLAUDE.md, docs/authoring.md,
docs/style.md and docs/sources.md. Browser and source checks are distinguished below.

### Primary references actually retrieved

- [AAPCS64 2025Q4](https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst):
  Fundamental Data Types table, SIMD and Floating-Point registers, parameter passing C.1,
  Result Return, and C/C++ language mappings. The table specifies single and double precision
  as 4 and 8 bytes using IEEE 754; the C map associates float/double with them. The register
  section explicitly says q1, d1 and s1 name the same bank entry. C.1 allocates scalar
  floating arguments to the low bits of successive v registers; Result Return reuses the
  corresponding argument registers.
- [C23 draft N3096](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3096.pdf),
  6.3.1.4 paragraphs 1 and 3, and 6.3.1.5 paragraph 1. The first requires finite input and
  an integral part representable by the destination integer type, and discards its
  fractional part towards zero. The integer-to-standard-floating rule permits the nearer
  upper or lower representable value in an implementation-defined manner. Exactly
  representable widening preserves the value.
- Arm DDI0602, **2025-12**, [official shared floating-point pseudocode](https://developer.arm.com/documentation/ddi0602/2025-12/Shared-Pseudocode/shared-functions-float?lang=en).
  The public website shell initially hid the content; the official
  [documentation-service response](https://documentation-service.arm.com/documentation/ddi0602/2025-12/Shared-Pseudocode/shared-functions-float?lang=en)
  supplied base64-encoded HTML. This is Arm's primary text, independently corroborating
  the secondary IEEE field tables without claiming to have read the complete IEEE standard.
  The response SHA-256 is
  `f3db9398691d431da99d5af29d7b4c582c6ffdff1e16150f9fc232b7740fbd62`.
  Decoded HTML SHA-256 is
  `45221461fec3a8da770e8a4e2403cba809f7ee32cb252ac9d23d724fe84f1e0d`.
  The retained scratch copies are `/workspace/scratch/fp-review/official-float.{json,html,txt}`.

The following exact anchors in that Arm page were checked:

| Anchor | Claim checked |
| --- | --- |
| `func_FPUnpackBase_5` | binary32 sign 31, exponent 30:23, fraction 22:0; binary64 sign 63, exponent 62:52, fraction 51:0; biases 127/1023; normal implied 1; subnormal implied 0 with scales -126/-1022; zero, infinity and NaN reserved encodings |
| `shared.functions.float.fpbits.FPBits` | fraction widths 23/52 and minimum exponents -126/-1022 |
| `func_FPRoundBase_7` | nearest-even rounds up when error exceeds one half, or equals one half and the retained integer's low bit is 1; subnormal-to-normal carry and overflow behaviour |
| `func_FPDecodeRounding_1` and `func_FPRoundingMode_1` | FPCR RMode 00 chooses ties to even |
| `func_FPAdd_5` | numeric addition, same-sign zero preservation, opposite-infinity invalid result, exact cancellation to positive zero under nearest-even |
| `shared.functions.float.fpmul.FPMul` | numeric multiplication, XOR sign for zero/infinity, zero times infinity invalid |
| `func_FixedToFP_7` and `func_FPToFixed_7` | signed numeric conversion, explicit rounding input and truncation mechanism |

Also retrieved and read the official DDI0602 2025-12 scalar instruction pages for FADD,
FMUL, FCVTZS (scalar, integer), SCVTF (scalar, integer), FCVT, and FMOV (general), through
their `documentation-service.arm.com` responses. Their descriptions and operation sections
confirm source/destination banks and widths, round-towards-zero FCVTZS, FPCR-selected SCVTF
and FCVT rounding, and FMOV transferring contents without numeric conversion. Scratch
copies are `official-{fadd,fmul,fcvtzs,scvtf,fcvt,fmov}.{json,txt}` in the same directory.
No external content was copied into the lesson text.

## Numeric and native assessment

The BigInt rational model rounds directly to the selected destination format. Decimal
parsing does not pass through JavaScript binary64, avoiding the demonstrated double-rounding
cases. The normal/subnormal transition, smallest-subnormal ties, overflow midpoint,
signed zeros, exact cancellation, infinity arithmetic, NaN classification and guarded
int32 conversion match the checked rules. NaN payload propagation and exceptions are
explicitly outside this numeric model; no lesson should infer an Arm process from it.

The test oracles include independent host bit representations and arithmetic, raw input
patterns, exact midpoint constants, native QEMU raw output, and model round-trips. A
round-trip alone would not prove an encoding correct; these independent checks avoid relying
on that alone. The exponent-field sweep checks all exponent fields and three boundary
fractions, not all 2^32 or 2^64 bit patterns.

The seven compiler sources and retained JSON responses agree with their generated teaching
listings. Normal return-expression associations are displayed C line 3. In float_pattern,
the fmov association is displayed line 4's representation copy and ret is line 5's return.
Original compiler source references are retained separately. The native harness assembles
the recorded compiler rows, loads raw encodings into the correct argument banks, invokes
the unchanged functions, records FPCR=0 and emits the returned raw bits. The new native CI
step fails when its real tools are absent; it is separate from the browser ISA.

Checks run independently by this reviewer:

- `PATH=/workspace/scratch/fp-tools/root/usr/bin:$PATH LD_LIBRARY_PATH=/workspace/scratch/fp-tools/root/usr/lib/x86_64-linux-gnu python3 scripts/floating-point/check.py`:
  exit 0, seven unchanged GCC functions and nine exact-bit QEMU cases, FPCR=0.
- `npx vitest run packages/machine/src/floating-point.test.ts content/source-links.test.ts content/plan/plan.test.ts`:
  exit 0, three files and 155 tests passed. This was a focused run, not the full suite.

## Ranked accepted findings and smallest fixes

These are the initial findings. Verification status is updated after the final build.

1. **High, shared actions unreadable in actual dark theme.** Initial rendered action text
   was rgb(232,238,237) on the browser's rgb(239,239,239) ButtonFace at both 375 and 1280.
   The FP CSS sets text colour for all buttons but leaves the non-bit action background
   to the browser. This affects Apply, stepping, Add 1, Reset, recorded result reveal/hide
   and Check answer across the module. Smallest fix: theme-aware shared FP action styles,
   preserving existing bit styles. Independently confirmed the two reader reports.
2. **Medium, format changes silently preserve the already stored approximation.** In the
   rounding explorer, initial exact stored 12.3500003814697265625 remains unchanged on
   selecting binary64, while the decimal entry still says 12.35. Applying that unchanged
   entry in binary64 gives 12.3499999999999996447286321199499070644378662109375 instead.
   Both operations are legitimate but teach different mechanisms. Smallest fix: local
   visible explanation that Format converts the current stored value and Apply re-enters
   the exact decimal, plus a label identifying editable input independently of stored bits.
3. **Medium, special values are presented as ordinary ordered neighbours.** NaN currently
   displays Next smaller value: NaN and Next larger value: NaN with active stepping. At
   positive infinity Next larger value is Infinity again. Those labels assert a numerical
   order which does not exist. Smallest fix: boundary-aware labels and disabled absent
   directions, with a local NaN explanation. Keep +1 arithmetic available only when its
   displayed exact-before-rounding description remains meaningful, or qualify specials.
4. **Medium, initial fresh practice under-tests promised mechanisms.** The bits lesson
   promised normal field decoding and reserved-state distinction but tested only writing
   a decimal in binary. The conversions lesson's new task tested truncation but did not
   make the learner distinguish copied representation from numeric conversion. Smallest
   fix: a compact fresh field/classification task and a fresh copy-versus-conversion
   comparison with model-derived results. Extra exercises for every opcode are unnecessary.
5. **Medium, conversions comparisons need an explicit route (C3).** The default recording
   initially showed int-to-float while the first direction discussed float-to-int. Widening
   and bit-copy entries were discoverable but no required comparison directed the learner
   to inspect them. Smallest fix: name the cases to select, pair each with the relevant
   comparison, and align or explicitly select the first case. This is distinct from
   requiring a separate drill for every instruction.
6. **Medium, representation-copy C assumes new syntax.** The complete source uses
   `__builtin_memcpy(&pattern, &distance, sizeof pattern)` but initially explains only
   “C's memcpy”. The `__builtin_` spelling and argument purposes need a local bridge;
   a learner should understand what the shown C asks before comparing FMOV with FCVTZS.
   Smallest fix: explain the GCC builtin spelling, destination/source and byte-count role
   of sizeof. Do not expand this into a general pointer lesson.
7. **Low, rounding caption misidentifies the neighbours' centre.** The displayed neighbours
   belong to the current stored value, which can be bit-edited or stepped independently of
   the entry. Smallest fix: make that relationship explicit in the caption/local directions.
8. **Low, feedback promises a calculation which it does not display.** Initial wrong-answer
   feedback says “calculation below” but supplies place weights, an explanation and the
   expected answer. Smallest fix: name the explanation/result, or show the actual calculation
   for an affected task. Preserve the submission gate.
9. **Low, negative powers need a notation bridge.** The first `2⁻¹²⁶` assumes that a
   negative power means repeated division by two. The earlier fractional places provide
   the necessary concrete preparation but do not connect it to that notation. Smallest
   fix: one small reciprocal/halving example before the first large negative exponent.

## Rejected or bounded concerns

- **Keep a decimal alert while editing bits:** not itself a correctness defect. An invalid
  unapplied decimal remains invalid even when a different control decodes bits successfully.
  Width changes clearing that alert while retaining invalid input are a small consistency
  concern, not a blocker for the numeric mechanism.
- **Require separate practice for every mnemonic:** rejected. Distinct comparisons can
  provide evidence without an exercise per opcode. The narrower missing fresh application
  of the core copy/conversion distinction was accepted above.
- **Phone scroller is an entirely untaught interaction (ARM-L2):** rejected under the
  supplied prerequisite history. `fundamentals.prose.ts` already says, “On a narrow screen,
  scroll sideways within the listing to see the C and instructions”; meet-the-machine
  and returning-to-caller give the same direction. A short local reminder remains a
  useful optional improvement for this reference module, without changing the required
  paired horizontal layout.
- **A missing standalone register-bank exercise blocks the Arm lesson (ARM-L3):** bounded
  as low-priority assessment coverage. Bank separation is plainly defined, and format
  width is independently applied. A compact bank/view check could strengthen evidence;
  this does not justify requiring another large activity or an opcode drill.
- **The repeated full decoder makes the rounding lesson incorrect (R5):** rejected as a
  correctness claim, accepted as a low-priority phone reading-load improvement. The initial
  phone route places the entry and Add 1 controls more than two screen heights apart. A
  compact rounding view can keep current value, exact value and retained-bit evidence near
  the controls, while leaving the complete decoder as optional inspection.
- **Widening should recover the original decimal:** rejected. It must preserve the value
  already stored. The defect was explaining the width control, not its arithmetic.
- **C must always round an integer-to-float cast nearest-even:** rejected. N3096 permits an
  implementation-defined neighbouring result; the lesson correctly qualifies the recorded
  target's mode rather than making this a universal C promise.
- **Casting requires the original real input to lie inside INT_MIN..INT_MAX:** rejected.
  The standard checks the integral part after truncation. The guards and boundary tests
  correctly allow a binary64 input just beyond an integer endpoint when truncation fits.
- **All NaNs must retain their payload/sign through model arithmetic or width changes:**
  rejected within this model's stated boundary. It classifies editable NaNs but does not
  claim architecture-specific NaN propagation. Ordered-neighbour wording still needs fixing.
- **Recorded functions must execute in the browser:** rejected. The page explicitly labels
  GCC/QEMU recordings and the browser ISA exclusion; the native check supplies separate
  execution evidence. The module does not silently extend the browser CPU.
- **The retained GCC rows need reordering to align with C:** rejected. Their order is
  unchanged and the separate source associations convey their checked meaning correctly.
- **Initial result concealment leaks the fresh task's answer:** not found. The task has
  independent inputs; its computed answer is rendered only after nonempty submission.

## Browser evidence and final verification

Initial independent browser check used the production build at
`http://localhost:4258/assembly-lab/`, Chromium/Playwright, 375×812 and 1280×812,
with both **actual** `document.documentElement.dataset.theme` values verified. The rounding
route was checked initially, after width conversion, after Apply, with NaN and after reset.
Every tested state remained inside the viewport. Action controls measured at least 40px.
Scratch evidence: `/tmp/fp-technical-initial.json` and
`/tmp/fp-technical-initial-{375,1280}-{light,dark}.png`.

### Corrected production build: independent checker result

Checked build `fde59fca615e4faaa7c78168b7d026d8dc38ee8dcbbc54ea4a7808ea52387828`
at the same preview URL. All four routes were exercised at 375×812 and 1280×812,
in both actual light and dark themes: 16 route/width/theme combinations and 164 measured
states. The script completed with exit 0. No page errors, rendered figure errors or
horizontal document overflow occurred. Enabled action contrast was at least 17.75:1 in
light and 14.42:1 in dark. Every measured action control was at least 40px high.

The checker independently confirmed:

- Decimal Apply via Enter, sign-bit editing, negative zero, subnormal and reserved-value
  classification, 64-bit switching, invalid-entry alerts, and reset to original inputs.
- Width switching preserves the already stored value; Apply in the wider format instead
  encodes the exact entry. The local explanation names both operations correctly.
- Add 1 shows distinct exact and rounded sums. NaN has an unordered explanation and no
  fabricated numerical neighbours. Both its stepping controls and Add 1 are disabled.
  Each infinity disables only its missing stepping direction, labels that endpoint, and
  retains the valid step to a finite value. Both zeros step correctly through the smallest
  subnormal and back. The unchanged-value endpoint is no longer called a larger/smaller one.
- Rounding actions now follow the input/current-value display before the full decoder,
  closing the phone separation concern. The caption refers to neighbours of the stored
  value. The full bit/field calculation remains available.
- Every recorded case reveals the exact expected recorded pattern, hides it on request
  and clears it when the case changes. All nine cases retain their complete numbered C
  and the exact checked instruction/source tags. At phone width the paired listing
  scrolls within its own container; C and instructions stay side by side. The local
  scrolling reminder is visible there. At desktop width both panes fit together.
- The conversions page now starts with the positive cast recording and gives a named
  sequence for the essential comparisons. Its copy explanation explicitly identifies
  GCC's builtin, destination address, source address and byte count.
- Empty/partial practice does not reveal answer output. Wrong submissions receive the
  revised explanation/result wording. Editing clears feedback; corrected complete
  submissions pass. Fresh normal-field decoding, reserved-state classification and
  copying versus conversion are present. The latter feedback displays distinct,
  correctly computed representation and converted-integer patterns after submission.
  The actual assessment answers are deliberately not reproduced in this review.
- Ordinary reload resets these transient figures and questions. Coordinated application
  update handoff was inspected in source, not exercised in this browser pass.
- Negative-power notation now has a small reciprocal/halving bridge before its first
  use. Actual dark action controls are legible across all four lesson modes.

All nine ranked accepted findings above are corrected and independently verified in this
build. ARM-L3 remains a documented low-priority assessment-coverage limitation, not a
technical or learner blocker. The separate four learner reviewers also rechecked their
own corrected lessons; their notes retain the original findings and final dispositions.

Scratch reproducibility artifacts: `/tmp/fp-technical-final.cjs`,
`/tmp/fp-technical-final/results.json`, and initial full-page screenshots for all 16
combinations. The reviewer visually inspected the corrected phone/dark rounding and
desktop/light conversions screenshots in addition to the measured state checks.

The first attempt at this review script exited 1 because its status locator matched
both the explicit status container and the output element's implicit status role. That
was a test-locator fault after successful product interaction, not a numeric/UI failure.
It was narrowed to the explicit status container; the complete rerun passed. This does
not change the original command's exit status. The managing session was notified of
the same selector issue in the educational test.

After the fixes, independently reran the native command above: exit 0, seven functions,
nine exact-bit QEMU cases and FPCR=0. Also ran
`npx vitest run packages/machine/src/floating-point.test.ts packages/views/src/floating-point.test.ts content/source-links.test.ts content/plan/plan.test.ts`:
exit 0, four files and 157 tests passed. No skips or failures in that focused run.
Full-suite results belong to the managing session's validation record, not this review.

Separately assembled a scratch A64 harness for the fresh conversion/copy input, set FPCR
to zero, ran FCVTZS and FMOV against the same s-register bits under cortex-a53 QEMU, and
compared both raw returned patterns with the corrected feedback. Both exact-bit checks
passed. This independent two-result check is additional to the nine retained recording
cases, not a claim that the retained checker contains extra cases. Reproducible scratch
source: `/workspace/scratch/fp-review/fresh-conversion.s`.

Finally read the completed learning-design brief and added Module D sources entry after
the independent pass. Their technical boundaries and distinction between designed
evidence, agent review and novice observation agree with the implementation and this review.

Not established here: physical Arm hardware behaviour, other FPCR modes, NaN payload
propagation, traps/exception flags, screen-reader output, non-Chromium engines, touch
accuracy with a person, or novice learning. These remain outside the stated evidence.

## Post-CI navigation-test correction

The managing session reported that required core CI run
[42864330737](https://github.com/snowch/assembly-lab/actions/runs/42864330737)
for `e528d7ed7ec425c462d559828deccdeb4b16efd5` ended **failure**: 3,453 unit tests
passed; 1,469 browser tests passed, 21 skipped and two failed. Both failures were the
desktop/phone copies of the shell's terminal-lesson navigation test. The stale assertion
expected `tail.at(-3)` to be the final A32 lesson; adding four D lessons moved that index
into Module D. The full CI outcome remains failed even if a focused corrected rerun passes.
All new floating-point browser tests passed in that CI run, according to the same report.

Independently reviewed the subsequent minimal diff in `tests/educational/shell.spec.ts`.
It changes only the explanatory comment and terminal-course expectations. An exact
seven-ID suffix retains the old A32/B/C assertions and adds all four D lessons in order;
the expected module list adds exactly four entries of 17. The entire browser Next
traversal, final missing-Next assertion, final Previous label and reverse click remain
unchanged. The traversal now reaches D4 before checking the course endpoint. This
preserves the meaningful original assertions rather than deleting the stale checks.
No learner prose, numeric implementation or product build changed for this correction.

Independent focused verification uses a separate server on port 4265 and output directory:

```sh
AL_PORT=4265 npx playwright test tests/educational/shell.spec.ts \
  --grep 'each lesson foot names the lesson before it and the one after, in course order' \
  --output /tmp/fp-tail-review-results
```

The command completed with **exit 0: two passed, no failures or skips**. Desktop took
59.5s and phone 5.2s; total command time was 1.5 minutes under concurrent local checks.
The desktop result has little margin against the existing 60s test timeout, which was
reported to the managing session. This reviewer changed neither timeout nor product
behaviour. Complete output is retained at `/tmp/fp-tail-review.log`, with isolated
artifacts under `/tmp/fp-tail-review-results`. `git diff --check` also passed.

The corrected assertions and focused browser result are independently accepted. The
managing session is responsible for the requested new full check and later CI result;
neither is implied by this two-test pass. The earlier final content/browser review remains
applicable because this correction changes only the test's expectations and its comment.
