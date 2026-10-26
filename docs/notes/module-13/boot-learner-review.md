# Boot and test your Pi: independent learner review

Copyright © 2026 Christopher Snow

Reviewer: `/root/pi5_boot_learner`, 26 October 2026. One lesson: `raspberry-pi-boot`.
This reviewer did not draft its prose, labels, schematics or native program.

## Scope and prior knowledge

The learner has completed the preceding course, including Module 12 and the Pi preparation
lesson. Source review covers the lesson, its prose/labels, its linked hardware-test record,
Module 12's tool installation and native-source explanations, and the preceding Pi preparation.
A build is not a physical-board test. This review does not claim to have formatted a card,
connected a Debug Probe, booted a Pi, measured its UART or verified the firmware handoff.

Required earlier knowledge checked in source:

- Module 12 explains the Linux/Ubuntu terminal, `sudo`, package installation, `make`, `unzip`,
  directory changes, assembler/linker, ELF, entry/load addresses, linker sections, stack/BSS
  startup, UART polling, the trip function and its caller's comparison.
- The preceding lesson supplies the Pi 5, spare card, separate normal OS card, official probe,
  dedicated UART connector and probe U socket, powered-off cable connection, separate power,
  selected firmware boot path and explicit hardware-pending status.
- New actions are locally introduced: `objcopy` produces the raw image; a checksum fingerprints
  bytes; the serial-device command and `$PORT` placeholder identify the probe; the complete
  `picocom` invocation supplies the line settings and the closing key sequence.

## Source findings and corrections

### BL1: preparing the spare card

Severity: medium. The earlier draft said, “Use a spare card with a first FAT32 partition”.
Earlier lessons did not teach partitions, their root directory or card preparation. Direction:
define the required filesystem region and top-level folder, then give a concrete supported
Ubuntu disk-utility path without introducing raw destructive device commands.

The revised source defines partition and root, directs the learner to Ubuntu Disks, identifies
the spare device by capacity/name, states that formatting erases the selected partition and
requires checking FAT32 before copying. It says to stop if the device or partition cannot be
identified. Built verification is recorded below.

### BL2: obtaining the test identifiers

Severity: low. The earlier reflection said, “Record your Pi model, EEPROM version, source
revision, image checksum”, without explaining how to obtain the less familiar identifiers.
Direction: connect each identifier to a taught command or visible source, and allow unknown
firmware details to remain unknown.

The revised source points to optional board/EEPROM commands in the preparation lesson, allows
unknown, identifies the footer commit and supplies `sha256sum` for the actual image. Built
verification is recorded below.

## Rejected or non-findings

- This physical task does not need another browser arithmetic quiz. Its broken/restored image
  exercise tests the native wrapper's real comparison; the browser must not pretend to boot a Pi.
- The learner is told to keep supplied device setup unchanged. This is appropriate after the
  startup/UART walkthrough in Module 12; exact clock and firmware behaviour remain separately
  qualified, not presented as measured facts.
- Repeating the wiring diagram here is unnecessary once the preceding preparation is a visible
  lesson with ordinary navigation. A build-to-card schematic locally supports the file workflow.

## Closing style passes

Sentence pass: commands are separated from explanations, placeholders are identified and
source-selected expected messages are distinguished from observed output. The lesson uses six
meaningful selected sections rather than padding the full ten-section template.

Understanding pass: the learner can explain why ELF must become a raw image, why the config/link
address and filename must agree, why editing source alone changes neither card nor running Pi,
and what working/broken/restored cold boots would demonstrate. The task asks for actual evidence
and leaves unobserved stages unverified.

## Built browser verification

Production preview checked at `http://localhost:4398/assembly-lab/`, not the development server.
Four fresh browser contexts used widths 375 and 1280, each with the theme control set to light
and dark. The actual `html[data-theme]` matched each choice.

- All four contexts showed the current visible hardware-pending statement, two-file card
  manifest, address/config explanation, complete build commands, actual quoted `$PORT` usage,
  expected-message qualification and broken/restored instructions.
- BL1 and BL2 corrections were verified in the built page. Card preparation, partition/root
  definitions, identifier guidance and unknown allowance are present before their relevant use.
- All six linked Pi bundle/source/checklist resources returned HTTP 200 in every context.
  The parent is separately checking that the final archive contains the final checklist bytes;
  this link check does not substitute for archive-content validation.
- No broken-figure or prediction-lock message appeared. No browser page error occurred.
  Document scroll/client widths were exactly 375/375 and 1280/1280; no sideways page scrolling.
- The build schematic is mounted and visible. Its arrowheads, borders, labels and direction
  remain readable in both themes. The file transformation explains a different mechanism from
  the preceding lesson's firmware/connection diagrams. Full-page screenshots and individual
  card-section screenshots were captured for all four contexts and directly inspected;
  dedicated build-figure screenshots were also inspected at 375 dark and 1280 light.

Artifacts: `/tmp/pi5-boot-learner-browser.mjs`, `/tmp/pi5-boot-learner-browser.json`,
`/tmp/pi5-boot-learner-browser.log`, `/tmp/pi5-boot-review-<width>-<theme>.png`,
`/tmp/pi5-boot-review-<width>-<theme>-card.png` and two `-build.png` figure images.

The first browser harness exited 1 after its first screenshot because an exact heading
selector omitted the rendered section-kind prefix, “Construction”. This was a harness error,
not a page defect. The selector was changed to match the meaningful heading text. The complete
four-context rerun exited 0; the original failure remains in
`/tmp/pi5-boot-learner-browser-initial-failure.log` and is not reclassified as a passing run.

Verdict for the reviewed built learner page: no open blocking finding. The physical card,
Ubuntu Disks interaction, Pi boot and serial path remain unexecuted by this reviewer.

### Final-build recheck

After the parent rebuilt the production site with the refreshed source archive and hardware
checklist (`/tmp/pi5-build-final.log`), this reviewer repeated the complete four-context browser
check against the same preview URL. The fresh contexts again used actual light/dark at
375/1280; every content, quoted-command, download-status, error, lock and overflow assertion
passed, exit 0. Final results are in `/tmp/pi5-boot-learner-final-browser.log`; screenshot paths
above now hold the final-build captures. The final rendered BL1/BL2 corrections and build
schematic remain present. Archive byte consistency is independently checked by the technical
reviewer, rather than inferred from this page's successful download responses.
