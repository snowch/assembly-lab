# CLAUDE.md

Project instructions for anyone, human or AI, working on this course. They are binding.

## What this is

*Assembly Lab*: an interactive, browser-based course in which the learner drives a real
processor's instruction set one instruction at a time, with the C that compiled to each
instruction beside it. It is built on the author's learning platform (`snowch/learning-platform`),
like `snowch/digital-design` and `snowch/metadata-systems`, and shares their interaction
vocabulary: inspect, predict, step, experiment, break, explain, drill down, replay.

**Status.** The plan's four decisions are still the author's (`docs/plan.md`); at the author's
request the work goes on under its recommendations, and says so where it depends on one. The
machine is built and held to GNU as and QEMU (`docs/machine.md`). Module 0 is published as a draft
for the author to try, and is under review. Which modules have lessons, the front page says: it is
worked out from the lessons themselves.

Read `docs/plan.md` for the modules, their order, the decisions and the checkpoints;
`docs/sources.md` for what every claim about the instruction set, the compiler and C rests on;
`docs/authoring.md` for how a lesson is made; and `docs/checkpoints.md` for what each checkpoint
decided. Edit every learner-facing string against `docs/style.md`.

## The thesis every lesson serves

> The registers hold bits. The instruction decides what they mean.

A C type does not exist in the machine; it is a choice of instruction. Every lesson shows one more
place where that choice is made, and makes the learner make it.

## Where these rules came from

From the two courses on the same platform, which took them from the author's earlier works:
`snowch/sizing-and-tco` (the prose process, the style checklist, the two-half review),
`snowch/computer-systems` (originality logged per chapter, the voice), and the interactive books
`snowch/parquet-book` and `snowch/query-engine-book` (the interactive UI is a view of the
implementation, never a scripted animation; problems are tests; one check script that is exactly
what CI runs). What differs here is said where it differs: this course teaches a real,
commercial instruction set, so its accuracy rules are stricter and its originality rule is
narrower.

## Every figure is computed from the model

The model is the course's assembler and simulator (`docs/plan.md`, "The model"), and later its
small C compiler. A figure shows what the model computes: registers, flags, memory, carries, a
trace. It is never a scripted animation and never a hand-drawn picture of something the model
could compute. If a lesson needs a figure the model cannot compute, the model is where the work
goes first.

Module 12 may compare model states with explicitly labelled, recorded GNU/QEMU/GDB output.
Its assembly-only startup and UART capstone, and optional Linux syscall comparison, run outside
the browser model and must pass
`scripts/native/check.py`; they do not extend the browser ISA. Module 13 adds a Pi 5-only
physical-board extension. Its boot and wiring diagrams are
source-checked schematics, not simulated or recorded board states. Its native sources must pass
`scripts/pi5/check.py` for assembly, linked/raw image layout and source consistency. These checks
do not establish firmware handoff, UART operation or physical boot success; those require the
lesson's recorded hardware test. Supported arithmetic functions
retain the ordinary GNU/QEMU simulator differential check. Never present a recording as a live
native process running in the page.

A number in a learner-facing string is a number the model produced, recorded native output, or a compiler listing that
is recorded in the repository, and a test pins it. A prediction's answer comes from running the
model, never from the lesson's words.

**A figure shows only what the learner has been told or has built.** No caption, label or text
gives away a prediction's or a challenge's answer before the learner has worked for it.

**A diagram carries what prose would make the learner hold in mind**: a register's bits, a run
over time, memory laid out by address, the stack at each call, the path a branch takes. A table
beside a drawing can index it; a table in its place cannot.

For the shared appearance and meaning of diagrams, follow [the visual language](docs/visual-language.md);
for the section-by-section review and recent-figure harmonisation, use
[the visual audit](docs/visual-audit.md). These extend the model, term-gate, accessibility and
independent-review requirements above; they do not replace them.

## Make each activity unambiguous

Apply these checks to the question, nearby prose, caption, controls and feedback together.
They come from the [whole-course clarity review](docs/notes/clarity-implementation/README.md).

- **Name the moment and the inputs.** A question about a value or its location must say
  whether it means before execution, after a named instruction or when the function returns.
  Show starting inputs with a visible label. Keep them distinguishable from results after an
  answer is checked. Identify any preset step; a fresh or reset figure must match its caption.
- **Keep connected views consistent.** A prediction, its walkthrough and an enlarged detail
  must use the same inputs and run, unless the change is explicitly introduced. State whether
  several operations start from the same input or use each other's results.
- **Teach what the next action needs.** Put definitions and essential guidance before their
  first use, beside the relevant figure. Required knowledge must be visible without opening an
  optional note. Put stepping instructions with the investigation that uses them. Consolidate
  duplicate walkthroughs when one can carry the explanation and preserve the prediction gate.
- **Describe the actual interaction.** Figure roles and notes must distinguish predicting,
  executing an instruction, revealing arithmetic columns, experimenting and solving an exercise.
  Revealing part of a calculation does not execute another instruction. Use the controls' visible
  names in directions, and explain editor modes before asking the learner to switch modes.
- **Say what a mark means.** Label a recorded register write as a write, including when its bits
  stay the same. Use "changed" only for a comparison that found different values. Distinguish a
  C variable, the register holding its current value and reuse of that register later in the run.
- **Make hints and feedback specific.** A common-mistake hint explains a plausible mistake; a
  smaller-example hint gives a concrete smaller case. Feedback must describe the submitted code
  and observed result, including alternative valid solutions. Preserve the order in which hints
  and answers become available.
- **Make notation and diagrams usable.** Accept number notation taught by the course, or explain
  a required input format beside the field. Render code formatting rather than its markup.
  Show element boundaries and byte addresses when teaching arrays or stack storage. Keep those
  groups, addresses and before/after labels readable on phones without losing their meaning.
- **Keep technical qualifications local.** Name the operands and widths that an arithmetic
  explanation depends on. Distinguish a calling convention's incoming-value guarantees from an
  instruction's effect, and distinguish C guarantees from a particular compiler's choices.

## Pair C with its instructions

Every recorded example and local-compiler result that shows C and assembly must make their
relationship visible. The complete, numbered C sits beside the instructions at every width; on a narrow
screen the listing scrolls sideways as one contained piece rather than the instructions
dropping below the C, and the page itself never scrolls sideways. Each instruction is
tagged with the C line numbers the lesson checked for it, in the numbering the C pane
shows. The compiler's original references are shown in optional details on the introductory
example, and later only where a lesson discusses a mismatch. Routine examples omit that
disclosure; their original references remain in the recorded listing. An explanation of mismatched
line numbers does not replace this pairing.

Use checked source associations for the teaching view. Do not alter the compiler's output,
instruction order or original debug line references to arrange the pairs. Opt in to compiler
reference details only when the lesson needs them. Clearly labelled experiments may still modify
or delete instructions.
Do not assume that one C statement produces one instruction. For combined operations, repeated
source lines or alternative paths, show the relevant statements and explain the relationship
without implying that every highlighted statement executes at that step. Where excerpts repeat
or reorder C statements, keep the complete C available.

During stepping, highlight the instruction that ran and its related C statements together. Keep
the current operation visible near the controls, including in long listings, without moving
keyboard focus or scrolling the page. Preserve prediction gates and comparison markings. Check
new or changed snippets in the built site at phone and desktop widths, in both themes.

Use the shared listing renderer for these paired examples and follow the source-association
rules in [`docs/authoring.md`](docs/authoring.md). Assembly-only snippets do not need invented C
mappings. Optional raw output from the online GCC service may remain unpaired when no checked
source associations are available; never invent associations to make it align.

## Accuracy

This course teaches a real instruction set, so every claim about it is checkable, and is checked.

- **The instruction set:** every claim is checked against Arm's architecture reference manual
  (`docs/sources.md` names the issue), or by running it under QEMU. Memory is not a source.
- **The simulator agrees with real hardware:** the differential test assembles every program the
  course shows with the GNU toolchain, runs it under QEMU's user mode, and compares registers,
  flags and memory with the simulator. A supported browser program shown on a page and not in that test is a bug. The explicitly
  native-only Module 12 Linux and device programs instead pass the separate native CI job.
- **A compiler's output:** every listing a lesson shows or describes is compiled, never typed,
  and recorded with the compiler, its version and its flags. "GCC emits" is a claim about one
  compiler at one version and one optimisation level, and says so where it matters.
- **C:** every claim about what C defines, leaves to the implementation, or leaves undefined is
  checked against the standard (`docs/sources.md` names the draft) and says which.
- **Distinguish the architecture from an implementation, and the standard from a compiler.** "A64
  defines" and "QEMU does" and "GCC 16.1 at -O1 emits" are different claims, checked against
  different sources.
- **A definition is a technical claim**, and must hold for every case the course will meet, not
  only for the lesson's example.
- **Where the course simplifies, it says so beside the relevant activity**: what the
  simulator leaves out (pipelines, caches, exceptions, most of the instruction set), and what
  that changes. Keep qualifications that affect the result visible before the learner uses it.

## Draft and review in separate passes

Every string a learner reads follows this process: lesson prose, hints, feedback after a failed
test, model-versus-reality notes, labels inside figures and the front page. No particular model
is required. Short sentences alone do not show that an explanation is clear.

1. **Write a brief as a list of checked facts.** Check each point against the simulator, a
   recorded listing or a source before drafting. Include the learning objective, the learner's
   prior knowledge and `docs/style.md`.
2. **Use a separate drafting agent or session**, a section at a time. Give it the facts and
   relevant context. Avoid supplying finished sentences for it to copy.
3. **Check accuracy and edit for clarity.** Correct missing facts, awkward wording, repetition
   and broken joins. Recheck any technical claim affected by an edit. Return substantial
   problems to the drafting pass with a specific explanation.
4. **Read the whole lesson for understanding.** Can the learner explain the mechanism and use
   it in an exercise? Does the figure demonstrate what the prose claims? Run both closing
   passes in `docs/style.md`.
5. **Obtain independent learner and technical reviews**, following the review rules below.
   Give reviewers the lesson, prerequisites and sources without the author's account of why
   the lesson works. A fresh reviewer can use the same model as the author.

`docs/authoring.md` gives model and effort recommendations and the brief for each review.
Engineering documents (this file, `docs/plan.md`, `docs/machine.md`, `docs/sources.md`) may be
drafted directly. They still pass the style checklist and independent review.

## No verdict on your own work

A model cannot audit itself. Every change, the managing session's included, goes to an agent that
did not write it, working from a written brief and never from the author of the change's account
of it.

- **Readers** review one lesson each, as a learner who has done every earlier lesson and none
  after, in a real browser at phone and desktop widths, in the light and the dark theme. Every
  finding quotes the page, gives a severity, suggests a direction and never rewrites; a number or
  a cross-reference is checked before it is asserted; a review never contains a challenge's
  answer. Every reader also lists **what the page assumes the learner already knows** and the
  course has not taught: a compiler setting such as `-O1`, a tool's name, a C feature beyond the
  front page's "Before you start", a convention of assembly syntax, a word of jargon. The learner
  knows only that panel and the earlier lessons; anything else is explained where it first
  appears, or it is a finding.
- **Sceptics** attack every finding against the page, the model, the sources and these rules, and
  recommend the smallest fix. Readers over-call; what survives goes on a ranked fix list, with the
  rejected items listed so they do not return. Readers also under-call what they themselves know:
  a sceptic makes its own pass for unexplained assumed knowledge, and rejects such an item only by
  quoting where the course explains it before that point.
- **Checkers** confirm each fix in the built site: judge the page, not the note.

When a fault appears in a shared component or recurring lesson pattern, inspect its other uses
and sibling components. A correction in the first lesson alone does not close a course-wide
finding. Keep canonical prose records synchronised with the rendered lesson text.

For each accepted finding, record the correction and its independent verification. Keep rejected
findings with their reasons. Checks must cover the affected states: initial, committed, stepped,
reset or restored, as applicable. Verify the actual rendered theme as well as the requested
preference. Check the final build; if a later edit affects an earlier check, recheck that part.

Report what was checked in the browser, what was read only in source and what remains untested.
Record full-suite results separately from focused reruns, including skips and failures. A passing
rerun does not change the original command's exit status. When a test expectation becomes stale,
check the intended behaviour before updating it and preserve its meaningful assertions. A layout
tolerance needs measured evidence and must still catch a visible layout regression.

## Voice

Direct, precise, British English, active voice, short sentences. The learner is *you*. No
marketing tone, no filler, no "in this lesson we will". No em dashes.

**Say the thing. Do not perform it.** No label where a statement belongs, no withholding then
revealing, no roundabout purpose. Headings are labels, and their test is whether somebody scanning
the page can tell what the section contains.

**Terms are rationed per lesson**, and so are instructions. A term arrives when the program in
front of the learner raises the question that needs it, plain English first and the term second;
the lesson that introduces a term is the first allowed to use it. The assembler accepts only the
instructions the lessons so far have introduced, and rejects any other with a plain message, as
digital-design's HDL subset does.

**Length follows the material.** The default template has ten sections. A short introductory
lesson may explicitly select an ordered subset when the full template adds repetition. Omit
generic model notes only when the activity already explains the interaction; keep limitations
where they affect what the learner can conclude.

## Originality

The course covers ground that textbooks and tutorials cover and must be original work.

- **The instruction set is the subject, not a borrowing.** Arm's mnemonics, register names,
  encodings, condition codes and calling convention are facts about the machine, used as Arm
  defines them and cited to Arm's documents. This is the one place this course differs from
  digital-design, which invented its machine.
- **Everything else is the course's own:** the order of ideas, the running situation, every
  example program, every exercise, every figure. Do not reproduce, closely paraphrase or
  structurally mirror an existing text: not Harris and Harris's ARM edition, Patterson and
  Hennessy's ARM edition, Smith's *Programming with 64-Bit ARM Assembly Language*, Pyeatt and
  Ughetta's *ARM 64-Bit Assembly Language*, Azeria Labs' tutorials, or Arm's own learning paths;
  no "hello world" through a system call as the first program, no factorial or Fibonacci as the
  first function.
- If you notice you are reconstructing a known sequence or a well-known worked example, stop and
  design a different one. The feeling of "this is the standard way to present this" is the
  signal, not the permission.
- Every lesson carries an `originalityNote` in its data: the obvious textbook example for its
  topic and how this lesson's example differs. It is written in the same commit as the lesson, and
  the schema refuses a lesson without one.

## The real compiler on the page

The optional "compare with GCC" panel sends the learner's C to Compiler Explorer's public API.
Its rules, from that service's published API notes and privacy policy (`docs/sources.md`):

- it sends only on a press, never on a keystroke, and caches each result;
- before the first press it says the code will leave the page, and links to Compiler Explorer's
  privacy policy;
- it shows Compiler Explorer's attribution and a link to open the same code on godbolt.org;
- if the call fails, it says so in a sentence, and the lesson works fully without it. No lesson
  depends on the network.

## What no check can catch

Read for these before calling a lesson finished:

- a claim about the repository's own state, which rots silently; if the repository can compute
  it, generate it;
- a word that means two things on one page (*word*, *load*, *carry*, *extend*, *register* as a
  name and as its contents, *flag* as a bit and as all four);
- a definite article in front of a noun the lesson has not introduced;
- a term doing work before it is defined;
- knowledge the learner is assumed to have and was never given: a compiler flag (`-O1`), a tool, a
  C feature beyond "Before you start", a syntax convention (`#`, `.L9:`), a piece of jargon;
- `w0` and `x0` used as if they were different registers, or as if they were the same width;
- a table or a register list nobody chose for this lesson, rendered because the component had it;
- an idea that is a shape (a path through a program, bytes laid out in memory, the stack across
  calls) carried only in a table or in sentences;
- the same argument made twice, far apart;
- a number the model did not produce.

## Things that will break the build

`npm run check` is exactly what CI runs (`scripts/check.sh`). Each line below is a check and the
reason it exists.

- **Prettier, with `*.md` ignored.** Prose files keep their own line breaks; code does not get a
  style argument.
- **Every source file carries its author's copyright line** ("Copyright © 2026 Christopher Snow")
  near its top, and every page carries it in its footer. `node scripts/copyright.mjs --check`
  fails a file without it; `node scripts/copyright.mjs` adds it.
- **The platform copy is unedited.** `platform/` is `snowch/learning-platform`'s packages at the
  commit `platform/SOURCE.json` records; `node scripts/sync-platform.mjs --check` fails if a file
  there differs. Change the platform in its own repository, then sync.
- **`tsc` strict, with `noUncheckedIndexedAccess` and `verbatimModuleSyntax`.** An index into a
  list may be undefined and the code must say what happens then.
- **The plan's data is well formed.** Module ids are unique and numbered in order, and each has a
  title, a line and a status; the page without JavaScript lists every module.
- **The Playwright suite drives the built site at desktop and phone widths**: no console error,
  the theme control works and persists, no visible text under 11 pixels, every control at least
  40 pixels tall on a phone, no horizontal scroll on a phone, and the footer's links go where they
  say.
- **`.npmrc` sets `legacy-peer-deps`**, because npm 10's peer resolution crashes on Vitest 4's
  peer ranges.
- **Learner-facing strings live in `strings.ts` files and in the plan's data.** A string typed into
  a component skipped the prose process, and the review reads for it.

From the first lesson on, the lesson checks digital-design runs apply here too: the schema (ten
sections in order, an `originalityNote`, every challenge mounted), the term gate, every
challenge's reference passing its tests and its starting point failing them, every lesson
rendering in jsdom with no figure problem, every stated number pinned by a facts test, and the
differential test against QEMU.
