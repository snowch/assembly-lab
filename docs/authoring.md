# Writing a lesson

How a lesson is made, drafted and reviewed. `CLAUDE.md` sets the project rules; this guide
describes how to apply them.

## Choosing a model and effort

Use GPT-6.1 with High effort as the default when it is available in Codex. The following are
working recommendations, not results of a comparison on this course. Revisit them when actual
drafts and review findings show a better choice.

| Task | Suggested model and effort |
| --- | --- |
| Plan a lesson and check its technical facts | GPT-6.1, High |
| Draft prose from a checked fact brief | GPT-6.1, Medium |
| Edit wording for plain English | GPT-6.1, Medium |
| Review as a learner for missing explanations | A separate GPT-6.1 agent or session, High |
| Review Arm and C semantics, simulator behaviour and exercise correctness | A separate GPT-6.1 agent or session, Extra High |

If GPT-6 Astra is available, consider it for difficult technical reviews or unresolved
disagreements about correctness. Greater reasoning effort does not by itself establish that
prose is clearer. Use sources and executable examples to settle technical disagreements.

Model names and effort controls depend on the Codex interface. Use only options that are
available; an unavailable model must not block the workflow. Choose an available capable
model, preserve the separate passes, and record any substitution in the review notes. These
recommendations replace the former requirement to use Haiku for drafting.

## The drafting brief

Before drafting, give the writer:

- The learning objective and what the learner should be able to explain or do afterwards.
- The prerequisites and terms already introduced in earlier lessons.
- A list of facts, with their sources, recorded compiler listings or simulator results.
- The example program and what each interactive figure actually shows.
- The relevant parts of `docs/style.md` and any limits on scope.

Draft one section at a time, then edit and read the whole lesson. Check both the sentences and
the explanation: a paragraph can use short, ordinary words and still omit a necessary step.
Editing is allowed to improve clarity as well as accuracy. Recheck technical claims after an
edit changes their meaning or qualifications.

## Independent reviews

Use reviewers who did not write or edit the material. Give each reviewer the actual lesson,
its prerequisites, sources and executable examples. Let them form their own assessment before
they read the author's explanation of the changes. A separate session or agent using the same
model is suitable; changing the model is optional.

Run two distinct reviews, which may be assigned to separate reviewers:

- **Learner review.** Read as someone who knows the stated prerequisites and earlier lessons.
  Identify unexplained terms, missing steps, repetition and ideas introduced too early. Check
  that examples support the explanation and the learner can attempt each exercise using what
  has been taught. Inspect the built page on phone and desktop, in light and dark themes.
- **Technical review.** Check claims against the named Arm and C sources, recorded compiler
  output and the executable model. Check diagrams, expected answers, feedback and edge cases.
  Distinguish what the architecture defines, what a compiler emits and what the simulator models.

For each finding, quote or locate the problem, state its effect on the learner, give the
evidence and suggest a direction for correction. Follow `CLAUDE.md`'s reader, sceptic and
checker stages: challenge findings, fix those supported by evidence, and verify the fixes in
the built page. Passing automated tests supports a review but does not establish that an
explanation is understandable.

Keep a brief record with the lesson's notes: models and effort used, findings accepted or
rejected with reasons, fixes made, and checks performed. Judge the process by whether learners
can understand the mechanism and apply it, alongside technical accuracy.

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
- **The instruction gate.** A lesson's `introduces` lists its terms only, as digital-design's do;
  an instruction's name (`adds`) can also be an ordinary English word, which the term gate would
  trip on. The instructions a learner may write are each written challenge's `allowedConstructs`,
  which the assembler is given as its gate, and the tap editor offers only those (decided at
  Module 2's build, 16 October 2026).
- **Every program a lesson shows is in the differential test** against QEMU.
- **Every compiler listing a lesson shows is recorded** with the compiler, its version and its
  flags, and a facts test pins what the prose says about it.
