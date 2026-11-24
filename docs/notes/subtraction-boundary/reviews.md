<!-- Copyright © 2026 Christopher Snow -->

# Carry boundary comparison: review and verification

## Change and copy process

A new comparison card sits between the existing four-bit inversion example and the original 32-bit calculation. It shows independent runs with b fixed at 8 and a set to 7, 8 and 9. The course trace supplies the calculations; the four-bit projection is labelled as a teaching view. No new processor width, instruction, control, gate or storage identity is introduced.

The checked brief and separately drafted canonical copy are beside this record. The source strings match the canonical records, including the transition back to the original 8−3 calculation at 32 bits. The existing worked example and actual-width adder retain their inputs. The current shared course fonts, header and offline-update implementation are preserved.

## Independent reviews

The independent learner reviewer followed the built lesson at 320, 390 and 1440 pixels in both actual themes with IBM Plex Sans at 17px. The cases, retained unsigned readings, equality boundary and transition back to the original inputs were checked. Existing keyboard controls, prediction gate and partial-answer reload were exercised; two additional 390px theme checks covered sibling defaults and saved elapsed-editor work.

The independent technical reviewer checked the model, source guards, real-width flags and native corpus. Final browser checks covered the same six size/theme contexts, existing controls, gates and saved work. A desktop compactness finding was accepted: the first column initially expanded across most of the card, separating the input expression from its outputs. The comparison grid is now bounded to 24rem; the narrow layout remains unchanged. Reviewers rechecked the final built geometry after that correction.

The decimal reading is below the four retained bits. Outgoing carry has a separate dashed frame; the kept bits have a solid frame. Equality is identified in words and shows carry one with a zero result. The comparison adds no assessment answers or new controls.

## Verification evidence and limits

Focused model, component and lesson checks passed: 53 tests. These include all 256 small subtraction pairs, the three boundary cases, canonical string synchronisation, card order, default/gated rendering and existing negation behaviour. The final built focused browser run passed all four project/theme cases. TypeScript, formatting, copyright and platform-integrity checks passed. The full repository check is run separately from these focused results; its eventual result belongs to the PR evidence rather than being inferred from the focused checks.

The first local native command exited 2 before any instruction comparison because GNU as was not on PATH. This was an environment startup failure, not a successful check. The independent technical reviewer then used the already available tool directory via AL_TOOLS=/workspace/native-tools: the targeted module2-subs corpus passed 27 calls and 81 instruction states with zero differences against GNU/QEMU. That corpus includes the two new below/above calls and the existing equality call. Both original and configured-run logs remain outside the repository under /workspace/work/subtraction-boundary/.

One initial learner-review harness used mismatched text representations; the reviewer corrected the harness and retained the original log. No product change was required for that harness issue. The later width correction was rechecked against the final built page.

Saved learner identities and source drafts are unchanged. No platform files were edited. These tests and independent reviews establish mathematical, content and interface consistency. They do not establish learning effectiveness; no novice learning session or real screen-reader user study is claimed.
