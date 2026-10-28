# Issue 52 independent technical review

Reviewer: independent technical reader, not the drafting agent. Reviewed the source diff
against `84bd405` on 2026-10-28. Read `CLAUDE.md` and `docs/sources.md`, the relevant
lesson prose, lesson wiring, shared renderer behaviour, tests and canonical-copy changes.
No product files were edited by this reviewer.

## Source findings

No blocking technical issue found. The change removes repeated end-of-page advice while
retaining qualifications that affect how an activity's result may be interpreted. No new
instruction semantics, arithmetic facts, input contracts or model behaviour were introduced.
The retained claims come from existing course text and its recorded sources.

One documentation inconsistency was reported during review: `docs/authoring.md` still said
other lessons keep their model notes immediately before the new local-guidance policy. The
parent accepted the finding and changed it to distinguish supported section layouts from
where qualifications belong. Rechecked the revised wording: resolved.

The early learner reader also found that removing the subtraction footer exposed the phrase
“The processor subtracts by adding” as an unwarranted circuit claim. I independently agreed
and reviewed the replacement: subtraction *can be worked out* as addition, and the figures
use that calculation to explain the result and flags. This states the arithmetic identity
without prescribing the hardware implementation. Resolved.

The drafting pass discovered two pre-existing returning-to-caller canonical discrepancies.
I checked the fixes: the source now includes the already-reviewed canonical qualification
that BL overwrites the partial caller’s x30, and the canonical example now matches the actual
caller instruction `add w1, w0, w0`. Model code, inputs and answers remain unchanged.

## Lesson-by-lesson scope check

| Lesson | Independent technical assessment |
| --- | --- |
| One addition | First-use run instructions remain. Optional local note limits the simulator to completed effects, with result equivalence qualified to these examples and no timing claim. |
| Adding a constant | Existing concise local teaching remains; no footer qualification was needed. |
| A tiny function | Compiler settings and the simulator-supplied call move before the activity. No implication that the displayed callee shows a real caller instruction sequence. |
| Returning to the caller | Course-written caller versus recorded GCC callee is stated locally; the stop after the caller's addition is explicit. BL/RET semantics and program are unchanged. |
| Subtraction and reuse | Distinct starting inputs and read-before-write behaviour remain beside the activities. Removed reflection repeated those ideas without adding a new contract. |
| Instructions in sequence | Stop after subtraction is explicit. Removed reflection/generalisation added no new execution rule; omitted sections will not leave empty headings. |
| Putting it together | Full-function walkthrough and missing-return experiment retain their distinct scope. Removed footer repeated already taught sequential results. |
| One pattern, three readings | Width and interpretation remain taught in the lesson and prior register introduction; removing the repeat footer loses no input interpretation. |
| Constants and widths | Immediate limitations, assembler acceptance and MOV expansion remain in the teaching body. No claim of showing encoded instruction bits. |
| Adding and the flags | Arithmetic-versus-processor-circuit distinction moves to the calculation. Column-reveal role guidance remains separate from instruction stepping. |
| Subtracting and the tick counter | Subtraction, wrap and carry definitions remain. The former circuit-sounding claim is narrowed to an arithmetic method, so removing the footer does not imply those are hardware execution steps. |
| Masks | Alias qualification remains where bitfield operations are introduced. No encoding or execution behaviour changes. |
| Shifts | Constant-shift aliases are identified locally after their meaning is established. Input ranges and execution remain unchanged. |
| Compare and choose | CMP/SUBS and CMN/ADDS discarded-result relationships now accompany their introductions. Condition semantics unchanged. |
| Branches | Path diagram is explicitly not a timing diagram. Replacing the stale claim that every earlier listing ran straight to RET is correct now that Fundamentals shows BL. |
| Counting up | Trace defined at the first count task. Instruction counts are not time, and a trace cutoff does not prove nontermination. |
| Counting down | Existing zero-input and wrong-comparison experiments explicitly name their recording limits; prior count-versus-time guidance applies without another footer. |
| Memory and addresses | Prepared ordinary memory, access permission, declared C type and incomplete fault modelling are stated before first load prediction. Little-endian explanation remains. |
| Loading widths | Signed/unsigned extension remains precise. Sensor exercise's chosen layout and supplied bytes are stated before that exercise; it does not claim to read a sensor. |
| Array addresses | Prepared-memory bounds are distinguished from C array-object validity beside address formation. Successful simulation is not proof of valid C access. |
| Zero-terminated strings | Capacity validity, prepared memory, terminator assumptions and ASCII/byte-count limits remain locally. Moving-pointer version still requires a readable terminator. |
| Products and widths | Unsigned wrapping versus undefined signed C overflow is visible in motivation. Course-written product-halves assembly is distinguished from GCC listings locally. |
| Division and remainders | Existing body already distinguishes A64 exceptional results from undefined C division and identifies compiler-specific division-by-ten selection without timing claims. |
| Calls and returns | Prepared aligned stack and outer return address precede the first stack activity. GCC-specific frame and platform x18/frame-pointer rules remain local. |
| Recursive calls | Fixed prepared stack and finite trace are explained beside the non-progress experiment; no claim of modelling a system's stack-exhaustion response. GCC frame choice is qualified. |
| From C to instructions | Limited unsigned language, eight total declarations, fixed patterns and resource limits are present before editing. Selected-path evaluation is not arbitrary-C verification. |
| Compile a loop | Evaluator budget and input-specific evidence are stated beside the editable activity. Source-line highlighting still does not imply one instruction per C line. |
| C and overflow | A64 experiment is already explicitly separate from C semantics. Limited local compiler is not a general undefined-behaviour detector. |
| Checked arithmetic | Signed-32-bit exercise scope is local. Recorded format warnings and sanitizer output remain distinct from execution in this browser. |
| From function to executable | Browser runs only arithmetic; external tools handle startup/devices. GNU/QEMU reference output and UART physical-clock/timing/pressure limits are stated beside relevant work. |
| Debug native instructions | Recorded comparison is not the QEMU machine controlled by terminal GDB. Body retains browser arithmetic-only scope and board-specific startup/device requirements. |
| Raspberry Pi 5 | Hardware verification pending remains prominent at entry. Connection schematic is not orientation guidance or a Pi-run recording. |
| Raspberry Pi boot | Expected output remains explicitly source-derived. Physical handoff, UART clock and measured entry-level evidence remain local; build success is not hardware proof. |
| Same C on A32 | A32 is static recorded output; interactive execution is A64. Syntax acceptance is explicitly not execution; compiler/target-feature limits remain. |

## Implementation and guard review

The course book sets `timeModelNotes` to an empty map. Inspection of the unchanged platform
renderer confirms it creates the disclosure only when a note exists and creates the footer
only for nonempty notes. Empty `modelVsReality` values do not render a heading or wrapper.
Calculation-role guidance is retained because arithmetic columns are not instructions.
The full schema requires a nonempty footer, a constraint the parent found during validation.
I rechecked the fix: affected lesson objects opt into the existing `selected` layout while
retaining their section arrays. This enables empty notes without changing platform validation.
My initial renderer-only assessment had not checked this schema prerequisite.

The section-list changes remove only the redundant Fundamentals sections. No programs,
simulator code, exercise contracts, expected numerical results, gates or platform files
change. Existing guard changes replace assertions about the deliberately removed global
note/footer; they do not weaken execution assertions. The new educational regression visits
all lesson routes in actual themes, checks absent boilerplate/empty toggles/page overflow,
and opens the retained calculation guidance. Existing canonical prose checks remain, with
only the removed global-string sample removed from the Module 6 copy check.

## Built-page evidence

Reviewed the production build served at `http://localhost:4399/assembly-lab/` on
2026-10-28. Script `/tmp/issue52-technical-browser.mjs` completed successfully with
64 local-note checks: 16 routes, each at 375×812 touch/mobile and 1280×800 desktop,
in actual light and dark themes verified from the HTML attribute. Routes were One addition,
Returning to the caller, Subtracting and the tick counter, Counting up, Memory and addresses,
Array addresses, Calls and returns, Recursive calls, From C to instructions, Compile a loop,
Checked arithmetic, From function to executable, Debug native instructions, Raspberry Pi 5,
Raspberry Pi boot and Same C on A32.

Each check found the relevant qualification visible on its page, no obsolete footer wrapper,
no horizontal page overflow and no browser page errors. The first-addition disclosure opened
in all four configurations. Four additional interactions opened the retained calculation-role
explanation in Adding and the flags. All passed on the first run; there was no failed browser
attempt to omit from this record.

Evidence is in `/tmp/issue52-technical-browser/results.json` and 68 screenshots in that
same directory. I visually inspected these representative screenshots: 375/light One addition,
375/dark subtraction, 1280/light memory, 1280/dark recursion, 375/dark returning,
375/light local compiler, 1280/dark native arithmetic scope, 1280/light Pi preparation,
and the calculation disclosure in all four configurations. The retained qualifications appear
with the work they constrain; text remains legible and the disclosure is usable. The 32-bit
subtraction calculation code block retains its own narrow-screen scrolling rather than
forcing page overflow. This inspection complements the two learner readers' broader visual
walkthroughs; it does not claim all 68 screenshots were manually inspected.

Rechecked the final `CLAUDE.md` accuracy edit: it preserves the requirement to identify
simplifications and their consequences, while correctly locating relevant qualifications before
the activity instead of requiring a repeated footer. The corrected authoring guide explains
why the existing selected schema is used. Canonical-label cleanup does not alter displayed
activity semantics. No further technical findings.

## Verdict and limits

Accept from the independent technical review. No unresolved blocking finding. Source and
built-page evidence support the intended cleanup while retaining meaningful local limits.
Full automated checks and CI are the parent's responsibility; this reviewer did not run a build,
the full suite, native tools or physical Pi tests, and does not infer those results from browser
checks.
