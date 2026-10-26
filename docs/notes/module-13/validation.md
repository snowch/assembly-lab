# Module 13 validation

Copyright © 2026 Christopher Snow

## Scope and evidence boundaries

Two visible Pi 5 lessons follow Module 12. The ordinary optional A lesson retains its ID and
stored-work identity, with numeric module key 14 after the new numbered module 13. The new
connection, boot and build figures are source-checked schematics. They are not board recordings
or a browser Pi simulator. No physical-board test has run; the lessons and downloadable checklist
say so. Existing Module 12 remains the independently executed QEMU path.

## Automated checks

- Full unit/integration run: **152 files, 2,913 tests passed**, no skips, 166.88 seconds.
  `/tmp/pi5-units.log`.
- Focused production-browser run: **8 passed**, phone/desktop and actual light/dark themes,
  26.6 seconds. `/tmp/pi5-browser-final.log`. Includes native source/archive requests,
  local prerequisites, no broken/locked figures, reload/theme persistence and design checks.
- Production build passed. Final source/archive build: 14.41 seconds,
  `/tmp/pi5-build-final.log`. Existing bundle-size warning remains.
- Strict TypeScript, complete formatting, copyright and platform-integrity checks passed.
- Pi 5 native checker passed: GNU assembly/link/ELF/raw byte layout, fixed load address,
  aligned stack/BSS, actual embedded UART base and divisor/format/control writes, identical
  portable function, two-file staging/checksums and deterministic source archive.
  Good/broken arithmetic-only QEMU calls passed. These are not Pi boot tests.
- Wrong UART address/divisor mutations in temporary copies were rejected by the checker.

## Separate drafting and independent reviews

Checked native/source brief: [facts.md](facts.md). Separate prose draft and canonical copy:
[prose.md](prose.md). Three independent closing reports:

- [Preparation learner review](prep-learner-review.md): one lesson, four built contexts.
- [Boot learner review](boot-learner-review.md): one lesson, four built contexts.
- [Technical review](technical-review.md): primary sources, actual source/binary checks, both
  lessons in eight built contexts and final download bytes.

Accepted local prerequisite findings were EEPROM's meaning, explicit stub control handoff,
partition/card preparation, and retrieving or marking unknown the hardware/build identity.
Their corrections were independently checked in the built pages. The earlier source brief's
implicit device-tree selection was replaced with the documented explicit `device_tree=`
bare-metal path. The final card contains only config and the program image.

## Earlier attempts, retained separately

- Initial focused unit command: 39 passed and 1 failed. The new canonical-copy test used the
  jsdom URL constructor with `readFileSync`; switching to Node's URL constructor fixed the
  harness. No product behaviour or meaningful assertion was weakened. Full results above
  include the corrected test.
- First complete format pass found the new generated build-evidence JSON unformatted.
  Formatting that file resolved it; the subsequent complete format check passed.
- The first targeted browser run was interrupted after one passing test when its exact
  source-download link label was stale relative to the final separate draft. The test now
  uses the actual visible label and pending-status text; all eight tests passed.
- A first review-server command passed port flags to npm's wrapper rather than Vite. It was
  stopped and replaced with the direct workspace preview command on port 4398.
- Separate drafter had one unescaped shell quote syntax error; corrected before built review.
- Native checker development initially used an absent ELF-helper key; corrected to the
  helper's checked section/entry facts. See facts.md for the separate original attempt.
- An independent native run caught the zip out of sync during the final checklist edit.
  Regenerating the zip and the final normal checks resolved it; no checker was relaxed.
- The boot reader's first browser script used an incomplete exact heading selector and
  exited 1. The selector was corrected and all four contexts passed. Product unchanged.

Hardware wiring, actual card formatting, EEPROM handoff, clock/routing and serial bytes were
not executed here. Complete `native/pi5/HARDWARE-TEST.md` with the user's actual board and
probe before describing this extension as physically verified.
