# Calls, returns and the stack: independent learner review

Reviewed the built lesson at `http://localhost:4200/assembly-lab/#/lesson/calls-and-returns` on 18 October 2026. This reviewer did not draft or implement the lesson. The review used the inherited Codex model and effort; no model override was requested. The assumed learner knows the front page's prerequisites and Modules 0–8, but no later lesson.

Read `CLAUDE.md`, `docs/style.md` and `docs/authoring.md`, the rendered page, lesson prose and labels, and earlier lessons where prerequisite terminology needed checking. This is a learner review, not the separate technical review. Findings below are proposals for the sceptic to assess; no production files were changed.

## Findings

### 1. Medium: a visible caption discloses the failure mechanism before the prediction

Exact quote: “Follow the return address that leads back to the addition.”

This caption appears beneath “Does the report return to its original caller before the recording limit?” while the associated stepper is still locked. It tells the learner where the return leads before they have worked through that question. The caption remains visible when the prediction has never been checked; locking the diagram therefore does not protect the prediction.

Evidence: `/tmp/reader-calls/initial.txt`, the initial screenshots for all four viewport/theme combinations, and `LABELS.captions.stepFailure` in `calls-and-returns.labels.ts`.

Direction: keep the pre-answer caption neutral about the return destination, or reveal the explanatory caption only after commitment. Do not remove the later explanation that helps the learner understand the result.

### 2. Medium: the link-register address cannot be matched directly to a displayed instruction

Exact quote: “`bl half_distance` branches to the helper and puts the address of the following instruction in `x30`.” The figure instruction is “Follow the call, the saved registers and the return.”

The stepper displays `x30` as a hexadecimal address, but the instruction listing has no instruction addresses or resolved return-target annotation. A learner can see that the register changes and can step until control returns, but cannot directly check which displayed instruction that address names. This weakens the visual explanation of the lesson's central mechanism, especially when comparing the incoming return address with the address written by a nested call.

Evidence: the unlocked browser listings and register displays in `/tmp/reader-calls/1280-light-body.txt`; viewport captures `1280-light-stack.png` and `375-dark-stack.png`. The listing's right column identifies C source lines, not machine addresses.

Direction: provide a model-derived connection between the link-register value and its destination, such as a resolved target marker or instruction addresses. Keep the external caller's prepared return address distinguishable from an address within the displayed listing. This is a teaching improvement, not evidence that the simulator returns incorrectly.

### 3. Low: unexplained terminology in the model-versus-reality note

Exact quote: “It does not show operating-system startup, stack guard pages or every rule of a complete ABI.”

Neither “ABI” nor “stack guard pages” is explained in this lesson or earlier lesson prose. The learner can complete the exercises without knowing them, but the note intended to explain the model's limits instead names two more unknown concepts. “ABI” is particularly opaque because the lesson otherwise uses the understandable term “calling convention”.

Evidence: the final note in `/tmp/reader-calls/initial.txt`; searches across prior `*.prose.ts` files found no earlier explanation of either term. The front page's prerequisites require basic C and arithmetic, not operating-system or binary-interface knowledge.

Direction: explain the necessary limit in ordinary language, or briefly explain a technical term if it is necessary here. Avoid expanding the note into an operating-system lesson.

## Assumed knowledge checked

- The C function syntax, arguments and return expressions are within the front page's stated prerequisites. The shift operator and unsigned arithmetic have been taught before this lesson.
- `w`/`x` register views and clearing the upper half on a `w` write have been taught. The reflection can therefore ask the learner to apply them to preserved registers.
- Byte addresses, loads/stores and little-endian byte order come from Module 6. Pre-index and post-index addressing come from Module 7, as the page says.
- `GCC`, `-O1`, the AArch64 target and compiler recordings have been introduced earlier. The new `-fno-inline` setting is explained here in the expandable compiler note.
- Caller, callee, link register, stack, stack pointer, stack frame, frame pointer and leaf function receive local explanations. The calling convention and AAPCS64 are explained in the expandable compiler note. A reader who skips that note sees AAPCS64 later without its introduction; this is a discoverability concern, not a missing definition.
- “Live values” is not explicitly named before generalisation, but the preceding sentence identifies values needed after the call. That immediate context is enough to understand the sentence; no separate finding is raised.
- ABI and stack guard pages remain the unintroduced assumptions listed in finding 3.

## Browser checks and learner experience

Used Playwright Chromium at 1280×800 and 375×812, in light and dark themes. Read the prose, diagrams, initial and committed predictions, both challenge tasks, failed-test feedback and all five hints for each challenge. Inspected full-page captures and viewport captures of the stack and tap editor. The stack byte addresses render at 11 px, meeting the repository's minimum. No horizontal page overflow or browser page error was observed.

Both prediction gates initially hid their steppers and opened after a prediction was checked. The first prediction also supplied useful feedback after an incorrect choice. Each starting exercise failed with relevant feedback. Independently composed solutions, using only the lesson's taught operations and leaving the supplied helpers intact, passed all five tests in each exercise. Completion persisted after reload. Switching those programs from text to tap and back preserved their text, including pre-index and post-index stack operands. This review did not build every instruction solely through phone taps; the dedicated browser suite covers that workflow separately.

The progression from protecting the return address to protecting a value needed after the call is understandable. The distinction between changing `w19` for the calculation and preserving all of `x19` is stated explicitly and reinforced in the reflection. The two exercises are achievable from the earlier material and the page's explanations. The stack diagram fits both screen widths and shows which bytes the current instruction touched.

Artifacts: `/tmp/reader-calls/`. The directory contains initial and unlocked full-page screenshots, stack and tap-editor viewport screenshots, rendered text, `results.json`, and the scripts used for the browser checks. Exercise output artifacts contain private verification details and are not reproduced in this review.
