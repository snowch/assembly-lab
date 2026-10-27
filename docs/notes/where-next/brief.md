# Optional Where next page

Copyright © 2026 Christopher Snow

The user approved one short optional progression page with an actual checked starter for
AArch64 Playground and separate GNU/QEMU and Raspberry Pi routes. It is an ancillary page,
not a numbered module or another mandatory lesson. Readers can use it after Module 9.

## Checked facts and learning objective

- The existing trip calculation is reused unchanged in a plain-assembly caller. The caller
  establishes a frame, saves its return address, supplies the known inputs, calls the function
  and restores its frame before returning. All instructions have been taught by Module 9.
- The actual external runtime starts at main, prepares its call environment and reports the
  returned value as the exit status. This starter deliberately returns the calculation result;
  its reported exit number is distinct from printed program output.
- Source, model, GNU/QEMU and actual external import/step/run/check facts are recorded in
  [facts.md](facts.md). Desktop and phone controls were checked separately. No external site
  is required by CI, and no whole-emulator accuracy claim follows from these checks.
- The reader should transfer a familiar function into a new workspace, find its arguments and
  result, check the fixed starter, then choose an independent extension or a native-tools path.

## Scope and presentation

Use three content headings: familiar-function transfer, building/checking a program, and the
choice of environment. Give the complete starter and its download. Define the new directive,
main-entry and exit-status conventions locally. Distinguish the fixed register initialisers
from runtime input fields; only code that reads input can respond to varied input checks.
Do not introduce M4, an untested library-call snippet, a mandatory external lesson sequence,
board support in the user-program emulator, or processor-speed conclusions from step counts.

The source record and new page remain available in the saved course; the external site's own
offline mechanisms are separate. Add visible discovery from the course plan and footer, plus
an optional link after the final Module 9 lesson. Preserve ordinary lesson sequencing and
existing companion-link landmarks. Keep the internal route outside the companion-courses nav.

## Separate passes and originality

A separate drafting agent wrote the prose and canonical copy from the source facts. A separate
learner reviews with only prior lessons through Module 9; an independent technical reviewer
checks sources, external execution, native/model facts and built presentation. Accepted early
findings concerned local definitions, fixed-input checks, phone controls and the footer landmark.
They are recorded with their final built verification in the review reports.

The example carries the course's own trip function into an independent workspace. It does not
copy the playground's macro-based demonstration or substitute an unrelated greeting. The page
teaches transfer of known code before asking for a new project or unfamiliar input/output calls.
