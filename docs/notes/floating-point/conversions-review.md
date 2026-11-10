# Conversions independent learner review

Reviewed 10 November 2026 by a separate Codex learner-review session. The reviewer did not write or edit the implementation. Model: inherited GPT-6 Codex session; no model substitution. This is an agent review, not evidence from a novice study.

## Scope and evidence

- Reviewed only the built lesson at `http://localhost:4258/assembly-lab/#/lesson/floating-point-conversions`, build ID `695b68e99ebfb2d8ae8998d1b325b65023c84d7db8eda6518c87a9dd8e410dfa` (footer commit `fc7b2a8`).
- Read AGENTS.md, CLAUDE.md, docs/authoring.md, docs/style.md and the local learning-design skill. Did not read the author's rationale or lesson notes before forming findings.
- Learner knows the preceding course and the FP bits, rounding and Arm-register lessons. Checked the front-page prerequisite strings and searched preceding lesson prose for the copy-call constructs in source only. A search also surfaced the currently edited conversions prose; findings below remain against the original built page, not that unbuilt edit.
- Used actual Chromium/Playwright at 375 × 900 and 1280 × 900, selecting Light and Dark. Verified `data-theme` and actual body colours, not merely the preference. Inspected screenshots in all four combinations.
- Exercised all five named recorded cases, Show/Hide, switching cases after a reveal, empty/wrong/correct fresh submissions, editing after feedback and reload. Tested keyboard travel from selector through the horizontally scrolling listing to the reveal control, and keyboard reveal.
- No implementation changes. No challenge answers appear in this review.

## Findings

### C1 — Medium: dark-theme action labels are nearly invisible

**Page evidence:** “Show recorded result”, “Hide recorded result” and “Check answer”. At both widths in the actual dark theme, these enabled buttons use `rgb(232, 238, 237)` text on `rgb(239, 239, 239)` backgrounds. The computed contrast is about 1.02:1. The surrounding page is dark (`rgb(16, 22, 21)`), but the controls retain a light native background. Screenshots: `/tmp/fp-conversions-375-dark.png` and `/tmp/fp-conversions-1280-dark.png`.

**Effect:** A learner cannot readily read the two main activity controls. Their appearance can also suggest they are disabled, though they work.

**Direction:** Apply the shared themed button treatment to these activity controls and verify enabled, focus and feedback states in both actual themes. Their measured 40px height is usable and not this finding; the failure is label contrast.

### C2 — Medium: the representation-copy C uses unexplained constructs

**Page evidence:** “The representation-copy case asks C’s `memcpy` to copy the bytes of a `float` into an unsigned integer of the same size.” The displayed complete C instead calls `__builtin_memcpy(&pattern, &distance, sizeof pattern);`.

**Effect:** The learner has a clear statement of the intended bit-copy operation, but cannot connect that statement to the exact C line: why the name has a different prefix, which argument receives the bytes, and what specifies the amount. The course introduction explicitly says standard-library knowledge is unnecessary. Earlier pointer teaching gives addresses, but a source search did not find a preceding explanation of `__builtin_memcpy` or `sizeof`. The GDB examples containing `&result` do not explain the C copy call.

**Direction:** Explain this compiler builtin and the destination/source/size roles locally, including the address and byte-count notation. A short bridge is sufficient; a general C library lesson is unnecessary.

### C3 — Medium: required comparisons are discoverable but not made part of the route

**Page evidence:** The prose first says “In the floating-to-integer case” and “Read the recorded starting value before revealing the result.” The selector initially shows “Convert int to float”. Its other options include “Widen float to double” and “Copy float bits into unsigned int”. After the figure, the page says only “selecting another case loads separate inputs”. The final section is “Choose the operation by its meaning”, but its fresh question explicitly requests a float-to-int truncation result.

**Effect:** The page defines widening and copying clearly, and the selector makes those cases discoverable. However, a learner who follows the visible instruction and reveals the default case has seen only integer-to-float conversion. No instruction asks them to compare the stored and widened values, or the input and copied patterns. Those two objectives therefore remain definitions unless the learner invents the investigation. The sole fresh task can be passed using the initial truncation paragraph alone; it supplies no evidence that the learner distinguishes bit copying or widening.

**Direction:** Give a short named sequence or explicit comparison prompts for the essential cases, beside the selector. Resolve the mismatch between the first explanation and default case. Include an observable comparison or fresh decision that distinguishes the two remaining objectives. This does not require a separate exercise for every mnemonic or a larger interface.

## Learning sequence and assumed knowledge

The observable outcome is to distinguish numeric conversion, widening of an already stored value and representation copying for unfamiliar inputs. FP exceptions and non-finite/out-of-range C casts are explicitly deferred.

| Mechanism | Defined | Demonstrated | Practised |
| --- | --- | --- | --- |
| Finite, in-range float-to-int truncation | Yes, with negative direction explained | Two small complete recorded functions, selected locally | Fresh negative input with computed feedback |
| Integer-to-float rounding | Yes, with C/recording qualification | Default complete recorded case | No independent task; earlier rounding preparation helps |
| Widening preserves the stored value | Yes, including inability to recover the original decimal | Complete selected case | No observable learner application |
| `fmov` representation copy versus numeric conversion | Yes | Complete selected case | No observable learner application |

A smaller first worked candidate is the positive float-to-int case already present. It matches the opening explanation and lets the learner observe truncation before comparing negative input, widening and copying. An extra miniature is unnecessary: the existing functions are already small and complete. The missing bridge is direction through those cases, not a smaller register width or a separate opcode drill.

Unsupported assumed knowledge on the original built page: GCC’s builtin copy spelling, `sizeof`, and the destination/source/address syntax of its call (C2). `-O1` is locally called an optimisation setting. The preceding FP prerequisites cover binary32/binary64, nearest-even rounding, NaN, subnormals and `s`/`d` registers; the earlier integer course covers `w`, signedness, return registers and hexadecimal. No additional unexplained assembly mnemonic is needed: the current prose states the effect of each conversion/copy instruction.

## What worked and limitations

- The finite-input and destination-range conditions appear before both instruction discussion and exercise. The page explicitly excludes infinity, NaN and out-of-range cases.
- The C conversion rule, recorded GCC choice and QEMU evidence are distinguished. The page does not suggest that the browser executed floating-point instructions.
- Widening explicitly preserves the already stored value and cannot restore the exact original decimal. The selected recording visibly preserves that value while changing its representation width.
- Numeric conversion and bit copying are explained as different operations. The selected copy recording preserves the input pattern and shows its destination integer interpretation.
- All cases have complete numbered C beside assembly and checked C-line tags. At 375px, the pair remains one contained horizontal scroller (317px viewport, 588px content), with no page overflow. Keyboard focus reaches the scroller and ArrowRight moves it. The instructions do not drop below the C. At 1280px both panes are visible together.
- Show/Hide works; switching cases hides the previous result and labels new starting inputs as an independent call. No stale result survived a case switch.
- The fresh question is visible before interacting with recordings. Empty input gets a clear request to answer. Wrong and correct submissions get mechanism-specific feedback in a status region; editing clears feedback and reload resets the exercise. No completion gate claims that the three objectives have been assessed.
- Phone prose is dense before the first recording, because four mechanisms arrive together. Explicit comparison directions would reduce what the learner must remember while operating the selector; no additional density finding is needed beyond C3.
- Essential definitions are not hidden in disclosures. The essential-route concern is the unrequested case comparisons, not a hidden optional explanation.
- Input/select labels are associated and the exercise feedback has a status role. Screen-reader output, touch-device use and a novice learning session were not tested. The reveal button changes its visible label but has no expanded state; no separate blocking finding is asserted without assistive-technology testing.

Keep the small complete cases, local cast preconditions, precise widening explanation and fresh truncation feedback. Change the dark buttons, local C bridge and required comparison route. Independent verification should judge the rebuilt page; these findings do not certify the edited source currently being prepared.

## Independent fix verification

Rechecked the actual rebuilt lesson after `/tmp/fp-build4.log` reported a successful build. Verified build ID `fde59fca615e4faaa7c78168b7d026d8dc38ee8dcbbc54ea4a7808ea52387828` at the same URL, on 375 × 900 and 1280 × 900, in selected and rendered Light and Dark themes. No implementation edits were made by the reviewer.

| Finding | Disposition | Built-page verification |
| --- | --- | --- |
| C1 dark action labels | Accepted, fixed, independently verified | Show/Hide and Check answer now use readable themed colours. Dark text is `rgb(232, 238, 237)` on `rgb(23, 30, 29)`; Light text is `rgb(16, 26, 24)` on white. Controls are about 45.9px high. Keyboard focus has a visible 3px outline in each theme. |
| C2 copy-call bridge | Accepted, fixed, independently verified | The page now names GCC’s builtin byte-copy operation and states that the first argument is the destination address, the second is the source address, and `sizeof pattern` gives the byte count. This connects the prose to the exact displayed C line. |
| C3 comparison route | Accepted, fixed, independently verified | “Use Recorded example to select each case in order” introduces four named steps. The initial selection is now the positive float-to-int function, matching the first step. The copy step asks for a starting/returned pattern comparison. A new fresh instruction-choice question tests copying versus numeric conversion alongside truncation. |

No original findings were rejected. The route fix is sufficient without requiring another separate exercise for every conversion instruction. Widening remains a directed recorded demonstration rather than an independently graded fresh application; this limits claims of assessment coverage but does not reopen C3.

All five recorded cases were selected and their complete paired C/listings, independent starting inputs, Show and Hide states checked. Switching cases while a result was visible hid the old result before presenting the new case. The phone listing remains contained, with no page-level horizontal overflow, and now has the visible instruction “Scroll the paired listing sideways to see the instructions beside the C.” Keyboard focus reaches the phone scroller, then the reveal button; on desktop it moves directly from the selector to the reveal button because no listing scroll is needed. Enter reveals the recording.

In all four viewport/theme combinations, fresh and empty submissions showed no computed outputs. Supplying either answer alone still withheld outputs. Complete wrong submissions received the revision message and explanatory comparison; complete correct submissions received the success message. “Integer pattern after numeric conversion” and “Original floating-point pattern copied unchanged” label the distinct results after checking. Changing either field cleared feedback and computed patterns. Reload restored the unanswered state and default recorded case. No early computed answer was found. The taught meaning of an instruction in the earlier explanation is preparation, not leakage of the new numeric conversion result.

Inspected screenshots `/tmp/fp-conversions-fixed-375-light.png`, `/tmp/fp-conversions-fixed-375-dark.png`, `/tmp/fp-conversions-fixed-1280-light.png` and `/tmp/fp-conversions-fixed-1280-dark.png`. No new blocking learner finding. Remaining evidence limits are unchanged: no screen-reader session, physical touch-device session or novice study. This focused browser fix check is not a full automated test-suite result.
