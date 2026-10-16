# CLAUDE.md

Project instructions for anyone, human or AI, working on this course. They are binding.

## What this is

*Assembly Lab*: an interactive, browser-based course in which the learner drives a real
processor's instruction set one instruction at a time, with the C that compiled to each
instruction beside it. It is built on the author's learning platform (`snowch/learning-platform`),
like `snowch/digital-design` and `snowch/metadata-systems`, and shares their interaction
vocabulary: inspect, predict, step, experiment, break, explain, drill down, replay.

**Status.** Checkpoint 1: the plan is proposed and under the author's review (`docs/plan.md`),
and the scaffold is live. No lesson is written until the author has taken the plan's four
decisions. Which modules have lessons, the front page says: it is worked out from the lessons
themselves.

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

A number in a learner-facing string is a number the model produced, or a compiler listing that
is recorded in the repository, and a test pins it. A prediction's answer comes from running the
model, never from the lesson's words.

**A figure shows only what the learner has been told or has built.** No caption, label or text
gives away a prediction's or a challenge's answer before the learner has worked for it.

**A diagram carries what prose would make the learner hold in mind**: a register's bits, a run
over time, memory laid out by address, the stack at each call, the path a branch takes. A table
beside a drawing can index it; a table in its place cannot.

## Accuracy

This course teaches a real instruction set, so every claim about it is checkable, and is checked.

- **The instruction set:** every claim is checked against Arm's architecture reference manual
  (`docs/sources.md` names the issue), or by running it under QEMU. Memory is not a source.
- **The simulator agrees with real hardware:** the differential test assembles every program the
  course shows with the GNU toolchain, runs it under QEMU's user mode, and compares registers,
  flags and memory with the simulator. A program shown on a page and not in that test is a bug.
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
- **Where the course simplifies, it says so**, in the lesson's model-versus-reality note: what the
  simulator leaves out (pipelines, caches, exceptions, most of the instruction set), and what
  that changes.

## Haiku drafts the prose; you check it

Every string a learner reads goes to a Haiku subagent to draft before it lands: lesson prose,
hints, the feedback after a failed test, model-versus-reality notes, labels inside the figures,
the front page. Haiku writes shorter, plainer sentences than a model with the whole repository in
its head. It also drops facts and copies wrong ones faithfully. So the work splits four ways:

1. **You write the brief as a list of facts**, not as prose: what the text must say, each point
   checked against the model, a recorded listing or a source *before* the brief goes out. Attach
   `docs/style.md`. A prose brief gets its wording copied.
2. **Haiku writes the sentences, a section at a time.**
3. **You check the facts, and nothing else.** Where a fact is missing, add the fewest words that
   carry it. Do not rewrite Haiku's sentences. If a draft is wrong, send it back with a note.
4. **Then read the whole lesson, start to finish**: `docs/style.md`'s second pass, where repeats
   and broken joins show, and where you ask whether the figure showed the mechanism the prose
   claims it shows.

The mechanism is the Agent tool with `model: "haiku"`. Engineering documents (this file,
`docs/plan.md`, `docs/machine.md`, `docs/sources.md`) are written directly. They still pass the
checklist.

## No verdict on your own work

A model cannot audit itself. Every change, the managing session's included, goes to an agent that
did not write it, working from a written brief and never from the author of the change's account
of it.

- **Readers** review one lesson each, as a learner who has done every earlier lesson and none
  after, in a real browser at phone and desktop widths. Every finding quotes the page, gives a
  severity, suggests a direction and never rewrites; a number or a cross-reference is checked
  before it is asserted; a review never contains a challenge's answer.
- **Sceptics** attack every finding against the page, the model, the sources and these rules, and
  recommend the smallest fix. Readers over-call; what survives goes on a ranked fix list, with the
  rejected items listed so they do not return.
- **Checkers** confirm each fix in the built site: judge the page, not the note.

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

**Length follows the material.** The ten sections stay whatever the length.

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
