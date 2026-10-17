# Module 6 drafting and review, 17 October 2026

The author requested Module 6 after the Module 5 draft. Two lessons introduce memory and
addresses, then loading different widths. The plan and checked brief are in
`../module-6-plan.md` and `brief.md`. Separate agents prepared compiler evidence, runtime
support, figures, lesson structures, learner prose and browser tests. Independent agents
reviewed each complete lesson as a learner and checked the technical claims. All used their
inherited session model and effort; no overrides were set.

## Implementation and evidence

The simulator already implements the required instructions and records memory accesses.
No machine semantics or platform files changed. The view layer now accepts exact-width
arguments and separate prepared memory bytes. The grader checks register values and the
entire prepared byte array, including neighbours that an over-wide store could corrupt.
Wide values use strings and big integers rather than imprecise JavaScript numbers.

The new memory stepper draws addressed byte cells, highlights accesses, and maps each copied
byte to its register position. Its extension view distinguishes copied bits, sign or zero
fill, and the upper half cleared by writing a `w` register. Back and Reset restore memory
from the simulator's store records. Predictions compute answers only after commitment.
The tap editor offers the address operands and instruction forms configured for each exercise.

Sixteen actual GCC 16.1.0 compilations at `-O1` are recorded with source, request, response
and source-line mappings. GCC emits `and` for the unsigned-byte cast; the equivalent `uxtb`
example is explicitly course-authored. The sensor-record layout is also course-authored,
not a claim about arbitrary C structures. All shown programs, challenge references and
deliberate mistakes are in the differential corpus.

Target sizes are scoped to the selected little-endian AArch64 Linux LP64 target. N3096
section 6.3.1.3 supplies the conversion rules. An early review disagreement about narrowing
to a signed type was settled against the actual draft: paragraph 3 allows an implementation-
defined result or signal, rather than guaranteeing the unsigned wrapping rule. The lesson
distinguishes this C rule from the recorded compiler's instruction choice.

## Findings and fixes

- A source-text check for data declarations could be bypassed using assembler syntax such
  as a label before a directive or semicolon-separated statements. The runtime now checks
  the assembled sections and rejects learner declarations that conflict with supplied data.
  Regression tests cover those forms and the displayed feedback.
- The cast qualification was drafted but initially not mounted in the lesson. It is now
  available beside the cast examples. Halfword terminology is introduced in the first lesson,
  where two-byte stores first appear.
- An accessible transfer heading described register destinations even for stores. It now
  describes copying bits in either direction.
- Store diagrams labelled source-register bytes as written. They now label those bytes as
  copied to memory, while memory destinations retain the write label. Tests also check that
  the source register is unchanged.
- The shared simulator note described only register reads and writes. It now covers effects
  on registers, flags and memory, and the choice of next instruction or return.
- The front-page prerequisites still placed the first pointer explanation in Module 7. They
  now name Module 6; the main plan distinguishes this introduction from Module 7's pointer
  arithmetic. The optional target note explains AArch64 Linux, and an unused cache term was
  removed from the model note.
- The second lesson's later prose revealed its first prediction's numerical answer before
  commitment. The exact comparison is now in gated feedback. The first lesson's later wide
  example also keeps its numerical values in gated figures instead of unconditional prose.
- Register-byte diagrams split hexadecimal addresses on phones. The phone layout now uses
  two columns and keeps each address together.
- The signed-cast note used the unexplained term signal. It now describes the notification
  briefly and states that the C implementation must document its choice.
- The model note now explicitly says that only the prepared memory regions are available.

The reviews found no additional prerequisite gap preventing the exercises. Pointers,
dereferencing, `const`, `void`, byte offsets and the relevant type sizes are explained where
needed. Earlier lessons supply hexadecimal, signed readings, W/X overlap, masks and GCC
settings. A second CPU model was unnecessary: the existing instruction implementation and
store traces supply the lesson's displayed state.

## Validation

Independent learner reviews exercised all steppers, predictions, hints and challenges at
1280×800 and 375×812, in light and dark themes. They checked incorrect submissions and
successful work. Both first-lesson exercises and the final sensor-reader exercise were also
completed using phone tap controls. No page errors or horizontal overflow were found.
The technical browser review checked extension regions, unchanged source registers, narrow
stores, restored memory, mixed signed feedback and rejected data declarations in all four modes.

The complete real-tools check passed: 84 programs, 984 calls and 262,464 instruction states
compared with zero differences; 39,675 assembler lines checked with zero disagreements.
Module 6 contributes 24 programs, 182 calls and 555 compared states. GNU as 2.44 and QEMU
10.0.13 were used. All 62 Module 6 facts tests passed.

The initial focused browser suite passed 45 tests with its one expected desktop skip for a
phone-only exercise. Canonical prose checks cover both directions, including figure messages,
grader feedback and the revised shared course copy. Independent learner and technical checkers
confirmed every accepted fix in the final built pages at both widths and in both themes.
No review findings remain open.

The final `npm run check` passed formatting, copyright, platform-copy integrity, strict type
checking, all 2,144 unit and integration tests, the production build and 848 browser tests
(18 skipped). The browser run includes all earlier modules and the final Module 6 source.
