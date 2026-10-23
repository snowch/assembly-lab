# Branches: independent learner/checker review

Copyright © 2026 Christopher Snow

23 October 2026. Bounded independent review of “Branches, and the run that skips”, final production preview at `http://localhost:4322/assembly-lab/#/lesson/branches` (rendered footer: edc67a4). No application edits, rebuild, external compiler request or challenge answer submission.

## Verdict and accepted finding

**Medium opening diversion resolved.** The question now says “The paired listing below shows its C and GCC's eight instructions.” One complete numbered C/instruction pair carries the introductory example; the opening no longer repeats full raw C and assembly. “Which compiler?” is a closed optional note and contains the source-association discrepancy, including “Those original references are available in the compiler details.” “Compiler's C line references” remains a separate closed disclosure under the introductory pair. Branch/label definitions remain visible in the main path before the first prediction. This implements the earlier reader's smallest direction without altering the recorded program or pretending its source mapping is one-to-one.

No new confirmed learner-facing finding or blocker in the bounded states checked. Construction remains a substantial synthesis task, but its local directions teach zero-register testing, label syntax, inputs and output, while the immediately preceding lesson supplies unsigned condition selection. This review does not establish novice completion rates or convert that earlier design hypothesis into a defect.

## Prerequisites and source inspection

Read AGENTS.md/CLAUDE.md, all ten sections and model-versus-reality prose, lesson/challenge definitions, recorded listings/checked source associations, prior compare-and-choose prose, relevant Module 0 compiler/control explanations, source policy, and branch/stepper implementation. Prior knowledge is integer C comparisons/returns, register/operand conventions, signed/unsigned 32-bit readings, flags and their persistence, bit positions, `cmp`, `csel`, `cset` and signed/unsigned conditions. Module 0 explains GCC, Compiler Explorer and `-O1`; compare-and-choose explicitly gives the `gt`, `ge`, `lt` and `cc` rules. Local prose introduces `wzr`, label/branch/taken terminology, `cmn`, alternate branch spelling and register/bit-testing branches. No confirmed untaught prerequisite was found.

The branch view assembles/traces the recorded program and derives arrows, reached rows and ordered path from that trace. The boundary stepper retains the same checked C associations with the explicitly changed branch. Its shared flags row is suppressed when a conditions panel supplies the flags, rather than duplicating NZCV. Provenance, original debug references and eight-instruction order remain in `branches.listings.ts`; the secondary explanatory note accurately distinguishes original references from teaching associations. These are source checks, not a fresh GNU/QEMU run.

## Browser coverage and evidence

Fresh Chromium contexts at 375×900 and 1280×900, each in actual system light and dark: body backgrounds were respectively `rgb(243, 246, 245)` and `rgb(16, 22, 21)`. Document widths matched all four viewports initially and after interactions; no page errors were recorded.

In all four contexts checked the initial complete introductory pair and closed compiler disclosures; locked first stepper/path experiment; first prediction commitment; first stepper through the conditional branch; Back to the compare and Reset to the initial input/count; investigation preset changes through the boundary, negative and between cases; boundary prediction commitment and stepper through its branch. The local branch status names the instruction taken and next operation; path arrows distinguish “not taken” from “not reached”, grey skipped rows and show an ordered executed path. Back restored the earlier instruction/count and Reset restored “Press Next to run the first instruction” and zero count. The boundary view showed one “Flags after the compare” row and both conditions reading that same row. The current instruction and related C highlight remain paired, with the operation repeated near controls on phone.

Viewed representative phone dark boundary, phone light path, desktop light introductory pair and desktop dark boundary screenshots. The pair stays side by side in its contained horizontal scroller on phone, and status/conditions remain readable. Evidence: `/tmp/check08.mjs`, `/tmp/check08.json`, `/tmp/check08-{375,1280}-{light,dark}-{intro,path,boundary}.png`. An initial harness used “Step” instead of the actual “Next” control and timed out; the corrected harness completed all four contexts. That first timeout is a harness failure, not a product finding.

## Limits

Compiler-disclosure content, later optional notes and model/source attribution were read in source; the browser confirmed their initial closed placement but did not open every disclosure. No successful construction, hint ladder, final counting answers, reload restoration, keyboard/screen-reader path, exhaustive presets or full run-to-return checks were performed. No full suite or fresh differential result is claimed. No challenge answers are reproduced here.
