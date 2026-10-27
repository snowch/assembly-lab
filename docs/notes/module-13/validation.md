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

## First full CI run on 79e2510

PR workflow 40420479448: native-lessons and real-tools passed. Full app check passed its
unit/build stages, then finished with **1,203 browser tests passed, 2 failed and 23 skipped**
in 29.1 minutes. Both failures were the shared phone/desktop navigation test's obsolete
expectation that the optional A32 chapter immediately followed `debug-native-instructions`.
The new learner-facing navigation correctly followed the two Pi lessons. The sibling push
workflow 40420425419 independently finished with the same two stale assertions: **1,203 passed,
2 failed and 23 skipped**, in 20.2 minutes. Its native and real-tools jobs also passed.

The test now pins the complete four-lesson tail and follows each next link from QEMU through
both Pi lessons to optional A32. It retains the first-lesson previous/next checks, A32's absent
next link and its working previous link. No product source, prose or assertion tolerance was
changed. Original CI failure is retained separately from the following focused/full reruns.

Focused navigation/shell rerun after that correction: **43 passed, 1 intentional skip**, in
57.5 seconds (`/tmp/pi5-shell-final.log`). Strict TypeScript passed. Independent technical
review approved the stronger assertion and confirmed the learner-facing navigation already
matches the requested order. The following full CI run is a separate result.

Additional committed-build checks on the unchanged product: both whole-course offline tests
passed (59.0 seconds), including never-visited lessons and every native file's bytes/hash.
The release-identity script passed eight committed-artifact contexts and verified all six Pi
downloads byte for byte. These do not supply physical-board evidence.
