<!-- Copyright © 2026 Christopher Snow -->

# Meet the machine: second clarity review

Reviewed the current built lesson independently, with only the front page's
prerequisites. Read the source and formed findings before consulting the first
English review. Scope and baseline are in [the brief](brief.md). This report does
not change learner text or supply challenge answers.

## Implemented simulator sentence: pass

The rendered investigation now begins:

> The simulator is a JavaScript program that loads with this page and runs in your browser.

This identifies what the simulator is, how it reaches the learner and where it
runs. Its surrounding paragraph still distinguishes the recorded GCC instructions
from their simulated execution. No JavaScript programming knowledge is needed to
understand the sentence.

Technical check: `apps/course/src/main.tsx` mounts the browser application;
`apps/course/vite.config.ts` builds its imported TypeScript into browser JavaScript;
`packages/views/src/trace.ts` imports `assemble`, `run` and `stateAfter` from the
local machine package and calls them to obtain the displayed execution. The
sentence accurately describes that implementation. The optional external GCC
service is a separate operation.

The changed sentence is identical in `content/lessons/meet-the-machine.prose.ts:52`
and `docs/notes/module-0/prose.md:96`. Independently ran the existing canonical
prose test: **11 tests passed**, log `/tmp/clarity2-00-canonical.log`. Inspected the
actual rendered paragraph at 1280 and 375 pixels in both themes; no clipping,
awkward joined sentence or new ambiguity. Screenshots:
`/tmp/clarity2-00-sentence-{1280,375}-{light,dark}.png`.

## Findings

### 1. Low: the first prediction's execution point remains implicit

**Location:** `content/lessons/meet-the-machine.prose.ts:38–39`.

**Quotation:** “Before you step through, commit to an answer.” followed by
“Where does the processor keep `total`?”

**Learner effect:** The immediately preceding text describes arguments on entry.
The question does not say when the learner should inspect the destination. The
choice containing “now” partly supplies the context, but requires the reader to
infer the question's timing from a proposed answer. Checked
`packages/views/src/interactives/TracePrediction.tsx:70`: this question measures
the first instruction's write, not the initial state or an arbitrary later step.

**Direction:** State the execution point before the choices while leaving the
destination and value for the learner to infer.

**Prior mapping:** retained **L1**, still present. Low severity agrees with the
first sceptic's assessment; the choices provide enough context to continue.

### 2. Low: the caption identifies the selected marker by a theme-dependent colour

**Location:** `content/lessons/meet-the-machine.labels.ts:36`.

**Quotation:** “The lit C line and the dark line-number chip mark the instruction
that just ran; the arrow marks the next one.”

**Learner effect:** In the dark theme the selected number is bright turquoise;
unselected markers have dark interiors. A learner following the caption can
choose the wrong visual indicator while distinguishing the instruction just run
from the next one.

**Direction:** Identify the selected line-number marker by a property that holds
in both themes, using familiar words for the visible control.

**Prior mapping:** retained **L3**, still present. The new dark-theme stepper
screenshot confirms it: `/tmp/clarity2-00-step-375-dark.png`.

### 3. Low: the shared explanation still names flags without identifying them

**Location:** `packages/views/src/strings.ts:11`, under “How the simulator steps”.

**Quotation:** “An instruction can read or change registers, flags or memory.”

**Learner effect:** The chapter explains registers and memory, but supplies no
meaning for flags. The front-page prerequisites do not require that knowledge.
The local explanation therefore leaves one named part of the machine unexplained.

**Direction:** Use the vocabulary introduced here or identify flags briefly at
their first appearance. No later lesson should be required to understand this
early explanatory note.

**Prior mapping:** retained shared **L4**, still present. This is one shared issue,
not an additional issue for this lesson.

### 4. Low: an additional hint occurrence belongs to the existing heading issue

**Location:** `content/lessons/meet-the-machine.prose.ts`, `traceHints[1]`.

**Quotation:** “A register no instruction writes keeps the value it arrived with.”
The built page places this under “COMMON MISTAKE”.

**Learner effect:** This is a correct principle, not a statement of a mistake.
The learner must decide whether the heading means that the principle is wrong or
that forgetting it is the mistake. The surrounding hints help, so the local
severity is low.

**Direction:** Make this rung identify the mistaken assumption, retaining the
correct principle and withholding the exercise's answer.

**Prior mapping:** additional affected occurrence of retained **M6**, whose
earlier report already asks for the same pattern to be checked across hint
ladders. Fold this into that issue rather than counting a new distinct problem.
The rendered heading and text are recorded in
`/tmp/clarity2-00-states-1280-light.txt` and the other three configuration logs.

## Prerequisites and clean material

The lesson requires small C functions, integer arguments, declarations,
assignment, return and arithmetic. These are consistent with the front-page
panel and its readiness example. The compiler note explains its options and the
backslash continuation; it does not require local compilation to use the lesson.
GCC is identified as a C compiler, Compiler Explorer as an online compiler
service. Instructions, assembly language, listings, registers, operands, program
counter and memory have local explanations. The listing caption identifies the
colon-terminated function label. The inline constant syntax is explained before
the final challenge. Flags are the remaining unsupported term identified here.

The trip scenario, source-line note, motivation, simulator paragraph, operand
explanation, fuel exercise, return-removal experiment, optimisation comparison,
odometer timing, reflection and hardware qualification are clear enough to
support their tasks. Neither their length nor ordinary variation in phrasing
justifies additional findings. The two hint ladders were inspected under their
actual headings; only the occurrence above adds to the existing review's scope.
No previously rejected finding is reopened. There is no distinct newly found
clarity issue beyond the retained issues and additional M6 occurrence.

## Actual coverage and evidence

Read all ten sections, objectives, labels, captions, C listings, compiler and
source-line notes, both prediction questions and every option, all prediction
feedback, both tasks, all ten hints, challenge-specific feedback, reflection and
its closed answer, and the simulator notes. Read lesson wiring to establish when
text appears. Used the real built page at
`http://127.0.0.1:4253/assembly-lab/#/lesson/meet-the-machine`, Chromium via the
repository's Playwright installation, at 1280 × 900 and 375 × 900, light and dark.

In each configuration opened the native disclosure notes, checked every choice
in both predictions, ran the starting fuel program and empty final-answer fields,
opened every hint, stepped the trip program to its end, and checked the delete
switch and stepped the removal experiment to its end. Read resulting text and
flow labels. Source review covered the final challenge's field-specific wrong
answer feedback, which empty fields do not trigger. This was not an exhaustive
input test, a test of every editor mode or a successful submission of each
challenge. No page horizontal overflow occurred in the four configurations.

Browser script: `/tmp/clarity2-00.mjs`; run log:
`/tmp/clarity2-00-browser.log`; full initial/interactive text:
`/tmp/clarity2-00-states-{1280,375}-{light,dark}.txt`; removal-experiment screenshots:
`/tmp/clarity2-00-step-{1280,375}-{light,dark}.png`. All four simulator-paragraph
screenshots were visually inspected; the phone dark stepper was also inspected
to check the caption's colour claim. These temporary artifacts are uncommitted.

Comparison records: [first lesson review](../english-review/00-meet-the-machine.md)
and [retained issue list](../english-review/README.md). Model and effort inherited
from the active session, without overrides.
