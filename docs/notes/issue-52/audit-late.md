# Issue 52: later-lesson prose audit

Copyright © 2026 Christopher Snow

Drafted by the separate `noise_late_draft` agent on 28 October 2026 from the checked
facts in `brief.md`, the existing lesson prose and canonical module notes. Read
CLAUDE.md, the style and authoring guidance, and the visual-language guidance. This
pass covers modules 5–13 and optional A. Independent review and full validation
belong to the parent task; this note does not claim that they have passed.

No instruction programs, exercises, numerical claims or recorded results changed.
Every `modelVsReality` footer in this scope is now empty. Necessary qualifications
are retained beside the relevant activity; repeated qualifications already stated
there have been removed from the footer. Reflection questions that require applying
the lesson remain. Specific directions for reading a load, following a call or
using an external debugger remain.

| Lesson | Decision and local location | Existing factual basis |
| --- | --- | --- |
| Counting up | The instruction-count prediction now defines a trace and distinguishes its length limit from termination and elapsed time. Removed the generic diagram/timing footer. | Former footer; the existing instruction-count task and bounded recorded traces in the module. |
| Counting down | Removed the footer. The zero-input failure already states its recording limit; its explanation and wrong-comparison activity distinguish that limit from an infinite run. Timing was covered with the preceding counting task. | Existing failure experiment, explanation and wrong-comparison prose; module 5 canonical notes and listings. |
| Memory and addresses | Before the first load prediction, state that memory is prepared, ordinary memory. Preserve the distinctions between readable storage, access permission and a pointer to the declared C type, plus the fact that not every processor fault is modelled. Removed generic timing and completed-instruction prose. | Former footer; local pointer, load and little-endian explanation; module 6 canonical prose. |
| Loading widths | Before the sensor-record challenge, state that its byte layout is chosen for this exercise, its bytes are supplied, and compiler layouts can differ. Removed generic internal-step/timing wording. | Former footer and the existing field-offset explanation and exercise contract. |
| Array addresses | Made the valid-index/C-array restriction visible in the motivation instead of leaving it in the compiler disclosure. Explain there that prepared-memory bounds do not enforce C array boundaries. Removed generic cache and timing qualifications already covered in the memory introduction. | Former footer and compiler note; local wrong-scale failure and one-past-array explanation. |
| Zero-terminated strings | Alongside the first scan's capacity contract, distinguish the simulator's prepared-memory check from validating capacity or the presence of a terminator. The moving-pointer activity already states its terminator precondition; the explanation already distinguishes bytes from multi-byte text. | Former footer and existing motivation, moving-pointer investigation and explanation. |
| Products and widths | Made the unsigned-wrapping/signed-C-overflow distinction visible in the motivation, rather than only in the compiler disclosure. Identify the product-halves diagram's course-written assembly where that diagram is introduced. Removed repeated generic timing prose. | Existing compiler note and footer; the recorded GCC listings and course-written product-halves example in module 8. |
| Division and remainders | Removed the footer. The exceptional-division explanation already distinguishes A64 experiments from undefined C; the constant-division discussion already qualifies the GCC settings and rejects timing conclusions. | Existing explanation, generalisation and compiler records in module 8. |
| Calls and returns | The first stack-call activity now states its prepared aligned stack and outer return address. The larger GCC frame discussion retains platform-dependent frame-pointer policy and the avoided `x18`. Removed the broad footer. | Former footer; local AAPCS64 frame discussion and module 9 source notes. |
| Recursive calls | Beside the bounded failure recording, retain the fixed prepared stack and lack of a real system's stack-exhaustion response. Retain compiler-dependent frame choices with the compiler provenance. Existing failure explanation still distinguishes the recording limit from the recursive program's behaviour. | Former footer, compiler note and unchanged failure experiment; module 9 notes. |
| From C to instructions | Before the editable compiler activity, state its single-function unsigned subset, eight-variable maximum and source/nesting/execution limits. At Compile/Run, retain that C checks apply to the tested path rather than all C or all inputs. | Former footer; existing local compiler description and evaluation order; module 10 notes. |
| Compile a loop | Made the execution-budget qualification visible beside the editable loop, rather than in a closed compiler note. Retain that a successful run establishes only those inputs. Compiler-subset limits remain in the preceding lesson; the local nontermination example still explains its actual condition. | Former footer, compiler note and existing investigation/explanation. |
| C and overflow | Retain the small compiler's limited undefined-behaviour detection with the explanation of undefined C. Other footer material duplicates the local direct-A64/recorded-C distinction and compiler provenance. | Existing footer, motivation, prediction and compiler note; module 11 recorded evidence. |
| Checked arithmetic | Before the final challenge, state that its contract is signed 32-bit inputs/output while C23 checked arithmetic supports other types. Formatting and sanitizer disclosures already identify their separate records and unavailable runtimes. | Former footer, exact exercise contract and existing reflection detail; module 11 notes. |
| From function to executable | Before the browser arithmetic activity, identify the browser's arithmetic-only scope and the need for external tools for startup/devices. Identify serial output as the reference GNU/QEMU build. Preserve transmit-buffer-pressure limits with the supplied UART setup; physical timing and board-specific setup are already explained there. | Former footer, recorded startup explanation and device note; module 12 reference build. |
| Debug native instructions | Alongside the comparison, clarify that the recording does not control the learner's QEMU machine and direct them to terminal GDB. The connection section already distinguishes the reference recording from the controlled machine; local explanation and generalisation cover browser scope and board-specific startup. Physical UART limits remain with the preceding lesson's setup. | Former footer and unchanged terminal commands, connection, explanation and generalisation. |
| Raspberry Pi 5 | The connection schematic explicitly says it is not a recorded Pi run. The page's opening already states that physical verification is pending and file checks do not establish boot or serial output; the boot-path explanation remains a schematic. | Former footer and existing visible hardware-verification warning; module 13 source-checked diagrams. |
| Raspberry Pi boot | Removed the footer. The opening already identifies expected output as source-derived, not a Pi recording. Build, entry-level reporting, physical serial setup and troubleshooting already distinguish file checks, physical observations and QEMU evidence. | Existing opening, investigation, construction and explanation; hardware-test record linked by the lesson. |
| Same C on A32 | Before the first execution activity, state that A32 listings are static and execution is A64 only. Clarify that the syntax test asks the assembler about a line without executing it. The divide-helper discussion already states optional hardware support and limits the claim about the library. | Former footer, existing prediction explanation, failure explanation and divide discussion; optional A compiler records. |

## Canonical prose and verification

Updated `docs/notes/module-5/prose.md` through `module-13/prose.md`, plus
`docs/notes/module-a/prose.md`, with the exact revised strings. Removed their obsolete
footer headings. Also removed the global simulator-model note from module 6's
interface-copy inventory, as requested by the parent runtime pass.

A direct import-and-string comparison found all 549 nonempty prose strings in the
19 lessons in their corresponding canonical files. All 19 footer values are empty.
Prettier formatted the 19 owned prose files. No tests, build or browser review were
run by this drafting agent. A search found no late-lesson test assertions directly
depending on a `modelVsReality` value; parent validation must still check rendered
prose and canonical synchronisation tests.
