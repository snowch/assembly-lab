# Module 13 and optional A: short-page recheck

Copyright © 2026 Christopher Snow

This addendum supersedes the retain decisions for 13 and A in `modules-12-a.md`, which remains
unchanged. Connected experiments do not justify keeping several independently completable goals
on one page. Both modules should have shorter pages, closer to revised Module 0.

## Existing size evidence

These are the actual `displayedWords` values from `inventory.json`, not new source-word counts.
They count initial rendered text at 1280, including visible code, controls and labels, while
leaving details closed and prediction gates uncommitted. They underestimate content revealed
later and do not measure reading time.

| Existing page | Initial displayed words |
| --- | ---: |
| Module 0: individual-page range | 261–647 |
| Module 13: From QEMU to Raspberry Pi 5 | 815 |
| Module 13: Boot and test your Pi | 1256 |
| Optional A: The same programs on 32-bit ARM | 1678 |

There is no universal word ceiling. These pages contain practical or reading goals that can end
cleanly before the next begins. A32's 1678 initially displayed words already exclude its closed
reference panels; retaining useful references does not justify the long compulsory path.

## Module 13: recommend four practical pages

**Medium priority.** Replace the earlier recommendation to retain two pages. Preserve the
experiment, but give its preparation, build, first observation and controlled change separate
completion points.

| Proposed unit | Existing material to group | Completion and next-page starting state |
| --- | --- | --- |
| 1. Prepare and connect the Pi | `raspberry-pi-5` question, parts/host requirements, optional identification commands, cable instructions and serial-connection schematic. | Parts identified, board/EEPROM details recorded or marked unknown, cable connected with power off. Leave the Pi off. |
| 2. Build and stage the image | The preparation page's firmware/Arm-stub explanation and boot-path schematic; `raspberry-pi-boot` download, complete installation/extraction/build command block, source links, load-address comparison and build-path schematic. Move the source-comparison reflection here. | Successful build and staged `card-files`, with the filename/load-address relationship checked. No card has yet been written. |
| 3. Capture the first boot | Card/partition preparation, two-file copy, serial-device discovery, terminal settings, first power-on, saved output and terminal exit. Put first-boot troubleshooting beside these actions. | First capture saved with what it does and does not establish. Terminal closed; Pi powered off before any card change. If boot is unobserved, troubleshoot or record the unresolved stage before the deliberate-error test. |
| 4. Break, restore and record evidence | Existing `failureExperiment`, the arithmetic/image-selection troubleshooting and final test-record requirements. Keep the changed-image and restored-image runs together. | Separate original, deliberately changed and restored observations; restored cold-boot evidence or an explicit unverified stage. |

The first boundary is already signalled by “Leave the Pi powered off until the next lesson's
terminal is ready”. The current page instead continues into “The diagram follows this example's
normal microSD boot path”. Wiring and accounting for firmware handoff are separate useful goals;
the latter belongs beside the raw image and matching load/link addresses.

The second boundary follows `make card-files`. The prose explicitly says “Neither command
writes to a card”. This is a durable result the learner can leave and return to, before the next
operation introduces partitions, FAT32, copying files and host USB serial access. Keep the
entire existing install/extract/build block on the build page; do not divide its commands across
pages. Keep the source and load-address comparison beside that build, so page 2 has a small
inspection task as well as command execution.

The third boundary is between closing the first serial session and “Power the Pi off and return
the card to your computer”. A first capture is a completed observation. The next page introduces
the changed build and the evidence that restoration tests the intended image. Splitting at this
point preserves both connected sequences: card/terminal/first boot, and deliberately broken boot
through restored boot. Do not insert a page break after opening `picocom` or between the broken
and restored runs.

Distribute recording instructions where the evidence is produced: metadata on page 1, source
revision/checksum on page 2, first capture on page 3, comparison on page 4. Keep environment limits,
power/card cautions and hardware-verification status local. Measure the new rendered sizes after
redistribution, particularly build and first boot; the old totals cannot establish their lengths.

## Optional A: recommend four small reading/practice pages

**Medium priority.** Replace the earlier one-page recommendation. “Three familiar examples” is
a sound module design, but does not make the full 1678-word page a short completion unit.

| Proposed unit | Existing material to group | Small completion goal |
| --- | --- | --- |
| 1. Read A32 registers and a return | Opening target/execution-state explanation, register/argument/result rules, leaf return, static-record qualification and the initial paired listing. Keep compiler-target detail optional. | Read the incoming/result register roles and distinguish the return instruction from its operand. A short check is needed here; this is a review recommendation, not an implemented new exercise. |
| 2. Compare conditional instructions | Limit prediction, the complete A64 limit trace and its A32 comparison, existing instruction-name reading task and A32-to-A64 syntax-acceptance experiment. Provide the local paired record. | Check a condition-controlled result and distinguish understanding a calculation from submitting source for another target. |
| 3. Read a target-specific constant instruction | Service-marker explanation and paired record. Move the marker-constant field from the final mixed exercise beside this record. | Identify the instruction's role and distinguish its spelling from an A64 register-width name. |
| 4. Recognise a division helper | Division explanation and paired record, optional saved-register detail, complete A64 average trace and the remaining helper/instruction/result fields from the final exercise. End with the transfer principle. | Distinguish a helper call from an available instruction and check the A64 calculation. |

Simply making three example pages leaves six early sections together, from “Use those ideas to
read the new syntax” through limit prediction, conditional rules, mnemonic reading and syntax
rejection. The saved 1280-light rendered text contains approximately 861 whitespace-delimited
words across those sections: 368 for opening/register/return orientation, then 493 for prediction,
comparison, reading and syntax. This supplementary section extraction has a different scope from
the official 1678 total; it explains why a three-page split still leaves a large first page.

The next transitions already name new reading goals: “The service marker gives another spelling
to inspect” and “The unsigned average reveals a target feature difference”. Each has its own
short listing and can end in a local check. The final exercise currently reconnects constants
and division; it is not a trace that must stay intact. Its constant field can move to page 3,
while the other fields stay with the average on page 4. Keep each prediction with its gated
trace, and keep the division explanation, average run and result check together.

The orientation check would require a small activity change. If no new check is wanted, that
unit can end with an explicit reading task rather than silently carrying unfinished questions
onto page 2. Do not move the conditional-move question before its explanation. Avoid repeating
the full target introduction on each page; preserve local source/record limitations and reference
panels. Keep A32 execution outside the browser: these proposals introduce no second simulator.

## Scope and evidence limits

Re-read the complete Module 13 and A prose and their section/activity data for this addendum.
Used the saved initial inventory and the earlier production-preview review, including actual
375/1280 light/dark views of all three existing pages, checked prediction gates and opened A32
reference panels. Precise browser states and source limits remain recorded in
`modules-12-a.md`; no new browser run or proposed split-page rendering was performed here.
The page units above are recommendations, not implemented or validated lesson layouts.

No learner prose, lesson data, activity contracts or native sources changed. No external tools
were installed, no native program was run and no hardware was prepared or booted. Hardware
verification remains pending. The original review and unrelated Pi source brief remain intact.
