# Writing a lesson

How a lesson is made. Until the first lesson exists, this file says what will be copied from
digital-design and what differs; the first lesson becomes the worked example, and this file is
rewritten around it.

## What is copied unchanged

The lesson data format is the learning platform's (`platform/lesson-schema`, its contract in
`snowch/learning-platform`, `contract/README.md`): ten sections in a fixed order, interactives by
kind, challenges with tests, five hints in ladder order and a reference solution, an
`originalityNote`, `introduces` and the term gate. digital-design's `docs/authoring.md` describes
it in full; follow it, reading "the simulator" as this course's assembler and simulator.

Keep the words out of the structure file: `<lesson>.prose.ts` holds every paragraph and
`<lesson>.labels.ts` every title, objective, caption and label, as digital-design does.

## What differs

- **Challenges.** A written challenge's artifact is assembly text (later, C text). The grader
  assembles it, runs it on the simulator for each test case, and reports the registers, the flags
  and the memory the case checks, in the verdict shape the runtime renders. An answer challenge
  (predict a flag, a register's value, which branch is taken) uses the platform's `answers`
  fields, graded by the course's graders.
- **The instruction gate.** Each lesson's `introduces` lists the instructions it is the first to
  use, as well as its terms. The assembler, given a lesson, rejects an instruction no earlier
  lesson introduced, with a plain message.
- **Every program a lesson shows is in the differential test** against QEMU.
- **Every compiler listing a lesson shows is recorded** with the compiler, its version and its
  flags, and a facts test pins what the prose says about it.
