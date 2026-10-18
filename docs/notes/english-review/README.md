<!-- Copyright © 2026 Christopher Snow -->

# Whole-course English review

Reviewed 18 October 2026 against `d0bf76b`.

The course is generally clear and uses plain English. The remaining problems are
mostly ambiguous references, inconsistent terminology, and qualifications that
name a restriction without explaining its practical meaning. They call for local
corrections rather than a general rewrite.

The independent reader and sceptic passes retained **29 English issues: 7 medium
and 22 low**. A separate low-priority observation concerns stale front-page module
status text. Medium means wording can materially mislead the learner about a
mechanism or corrective action. Low means a local obstacle with enough surrounding
context to continue.

This is a review record. Course text and executable code are unchanged.

## Fix these first

| ID | Location | Problem | Direction |
| --- | --- | --- | --- |
| M1 | `subtracting-and-the-tick-counter.prose.ts:42,100` | “The second operand” means the mathematical subtrahend here, but the course numbers the assembly destination as operand one. A reader can therefore invert the wrong input. | Name the subtracted input consistently with the established assembly operand convention. |
| M2 | `subtracting-and-the-tick-counter.prose.ts:41,100` | “This is the full sum” describes an intermediate quantity that omits the first input. The reflection also omits that input from its account of subtraction. | Distinguish the complemented input plus one from the complete addition involving both inputs. |
| M3 | `calls-and-returns.prose.ts:18` | “The pair of 64-bit registers at consecutive addresses” conflicts with the earlier definition that consecutive addresses name consecutive bytes. | Describe adjacent register-sized regions and make their width and starting-address relationship clear. |
| M4 | `compare-and-choose.prose.ts:74` | “Equal values give the wrong one” implies that exchanging two equal inputs can repair a failed result. The feedback has not established that the source registers still contain those inputs. | Describe the failed result and direct attention to the actual source contents. |
| M5 | `division-and-remainders.prose.ts:38,40` | The exercise says to prepare a 64-bit divisor but does not explain why a value supplied through `w1` leaves the incoming upper half of `x1` unspecified. Earlier teaching concerns writes to `w1`, a different event. | Explain the narrow input guarantee and connect it to the need to prepare the wider divisor. |
| M6 | Hints in `counting-down.prose.ts:31` and `memory-and-addresses.prose.ts:34–35,59` | Correct instructions appear under “Common mistake”, which can reverse their meaning. Some “Smaller example” rungs contain another general instruction rather than an example. | Make affected hints perform the function promised by their headings. Check the same pattern across the hint ladders; preserve the platform copy. |
| M7 | `shifts.prose.ts:19` | “To the implementation”, “undefined” and repeated “GCC defines” blur two different C rules before either is explained. “A negative value among them” also gives a value the grammatical role of an operation. | Identify the compiler's role, distinguish the two guarantees in ordinary language and attach the negative-input condition to its operation. |

Unless a path is shown, lesson locations are under `content/lessons/`. These are
correction directions, not replacement learner prose. Any implementation should
preserve the separate drafting, accuracy and built-page checking stages.

## Smaller improvements

| ID | Location | Finding and direction |
| --- | --- | --- |
| L1 | `meet-the-machine.prose.ts:34–35` | Identify the execution point intended by “Where does the processor keep total?” before the prediction. The choices provide some context, so this is low rather than a blocked question. |
| L2 | `adding-and-the-flags.prose.ts:70` | Replace the overloaded meaning in “set the flags” with the existing language for calculating or writing flag values. Earlier “set a bit” means make it 1. |
| L3 | `meet-the-machine.labels.ts:36` | “Dark line-number chip” describes a bright marker in the dark theme. Identify the selected marker by a theme-independent property. |
| L4 | `packages/views/src/strings.ts:11` | The shared simulator note names flags before the first definition in Module 2. Use introduced vocabulary or supply a minimal identification at first use. This is one shared issue, not one per early lesson. |
| L5 | `masks.prose.ts:25–26`; `masks.labels.ts:69` | The prediction supplies inline C and an instruction, but calls them “the listing” when no listing figure is present. Refer to the actual inline material; another full listing is unnecessary. |
| L6 | `masks.prose.ts:65` | “The word after each [instruction]” promises the warning word, while the figure can show an intermediate in the gear register. Describe the register/value actually shown. |
| L7 | `masks.prose.ts:83` | “Status words, packed dates and colours” names applications without identifying their component values. Use one concrete representation to support transfer of the field idea. |
| L8 | `compare-and-choose.prose.ts:125` | “This is not a claim about GCC's output” appears to retract the immediately preceding GCC-output claim. Name the examples or descriptions to which the qualification applies. |
| L9 | `branches.prose.ts:71` | Corrective feedback asks about an assembly “block” before defining its extent. Use the established labelled instruction groups or explain that grouping. |
| L10 | `counting-up.prose.ts:74` | The technical noun “trace” first appears without an explanation. Identify the recorded sequence or use the established run vocabulary. |
| L11 | `counting-down.prose.ts:60–61` | “Assume termination” and “need not preserve a never-ending run” leave the compiler permission abstract. Give its practical consequence without promising what another compiler will emit. |
| L12 | `memory-and-addresses.prose.ts:71` | “A valid object of a suitable type” assumes the specialised C meaning of object and leaves suitability unspecified. Explain the storage/type requirement relevant to these accesses. |
| L13 | `loading-widths.prose.ts:77` | The limitations note assumes structures and memory allocation, although neither has been taught and the prerequisites exclude them. State the limit using known storage/field concepts or identify the new concepts briefly. |
| L14 | `products-and-widths.prose.ts:27` | “Its operands” has no instruction referent in the preceding hints. Name the instruction described by that hint. |
| L15 | `products-and-widths.labels.ts:86` | “Inputs that also fit in 32 bits” does not distinguish this case: all inputs already satisfy that width. Describe the distinguishing product width instead. |
| L16 | `calls-and-returns.prose.ts:45` | “First pair of slots” assumes a stack-slot size and ordering. Tie the hint to the taught byte/offset vocabulary or establish that local unit. |
| L17 | `from-c-to-instructions.prose.ts:11` | “16-bit immediate” introduces a new name for the already taught constant. Connect the terms or use the established one. The later A32 occurrence is covered by the same first-use correction. |
| L18 | `checked-arithmetic.prose.ts:41` | Sanitizer “recovery” can imply repair of the invalid operation. Explain what execution does after the diagnostic. |
| L19 | `packages/machine/src/strings.ts:54,68,89` | “An extend” is an untaught category noun. Use the extension terminology already taught, preserving the accepted operand forms. |
| L20 | `packages/machine/src/strings.ts:112` | “The machine does not keep instruction bytes” does not identify the simulator representation limit and can sound like a claim about real processors. Name the simulator and unavailable read operation. |
| L21 | `packages/machine/src/strings.ts:36` | “Missing something, or has too much” does not identify the directive operand/form problem. Be specific within what the diagnostic information establishes. |
| L22 | `packages/views/src/strings.ts:157` | “The chips can build” uses an unexplained visual term in a processor course; the mode is labelled Tap. Refer to the visible mode or controls. |

## Separate front-page observation

`apps/course/src/strings.ts:23` says “The other modules are planned”, but every
module currently has published draft lessons. Condition this sentence on the
computed module status, or remove it when no planned modules remain. This is a
state-dependent content claim, separate from the 29 English issues.

## Findings not retained

The sceptics rejected four candidates after reading their surrounding explanations:

- The constants hint's shorter “bits” wording follows repeated, precise set-bit
  teaching. Adding “set” would be harmless polish, but no substantive gap remains.
- The overflow caption's “result does not fit” follows an explicit explanation of
  the full sum and the kept bits. It does not claim that a stored pattern is invalid.
- “The word can be read” in invalid-input figures is immediately preceded by the
  specific input problem and corrective action. It is not an unexplained rejection.
- The optional A “baseline Armv7-A” label has its relevant processor-feature
  consequence explained locally before the exercise.

Repeated early flags findings, hint-heading findings, extension diagnostics and
later occurrences of “immediate” were merged, not counted as separate problems.
See the sceptic records for exact prior-definition evidence and severity changes.

## Coverage

Reviewed the published course: **24 lessons, 48 exercises and 240 hints**, including
lesson prose, objectives, titles, captions, closed notes, prediction choices and
explanations, test feedback, reflection answers and model limitations. Counts were
computed from the parsed lesson data at this commit. Each lesson had a separate
reader working from the front-page prerequisites and preceding lessons only.

The built snapshot was inspected at 1280 and 375 pixels, in light and dark themes.
Each reader note records the particular interactions and evidence covered; this
does not imply every test input was executed in all four configurations. The shared
pass also covered the front page, prerequisites, plan text, interface labels,
assembler faults, compiler diagnostics and runtime wording.

| Module | Lesson | Reader record |
| --- | --- | --- |
| 0 | Meet the machine | [Reader 00](00-meet-the-machine.md) |
| 1 | Same bits, two readings | [Reader 01](01-one-pattern-three-readings.md) |
| 1 | Constants and widths | [Reader 02](02-constants-and-widths.md) |
| 2 | Adding, and the four flags | [Reader 03](03-adding-and-the-flags.md) |
| 2 | Subtracting, and the tick counter | [Reader 04](04-subtracting-and-the-tick-counter.md) |
| 3 | Masks and fields | [Reader 05](05-masks.md) |
| 3 | Shifts, and the type that picks one | [Reader 06](06-shifts.md) |
| 4 | Compare, and the signed or unsigned condition | [Reader 07](07-compare-and-choose.md) |
| 4 | Branches, and the run that skips | [Reader 08](08-branches.md) |
| 5 | Counting up, and the branch backwards | [Reader 09](09-counting-up.md) |
| 5 | Counting down, and knowing when to stop | [Reader 10](10-counting-down.md) |
| 6 | Memory and addresses | [Reader 11](11-memory-and-addresses.md) |
| 6 | Loading different widths | [Reader 12](12-loading-widths.md) |
| 7 | Array addresses and moving pointers | [Reader 13](13-array-addresses.md) |
| 7 | Strings and the zero byte | [Reader 14](14-zero-terminated-strings.md) |
| 8 | Products and their widths | [Reader 15](15-products-and-widths.md) |
| 8 | Division and remainders | [Reader 16](16-division-and-remainders.md) |
| 9 | Calls, returns and the stack | [Reader 17](17-calls-and-returns.md) |
| 9 | Recursive calls and separate frames | [Reader 18](18-recursive-calls.md) |
| 10 | From C to instructions | [Reader 19](19-from-c-to-instructions.md) |
| 10 | Compile a loop and follow its branches | [Reader 20](20-compile-a-loop.md) |
| 11 | C overflow and machine results | [Reader 21](21-c-and-overflow.md) |
| 11 | Conversions and checked arithmetic | [Reader 22](22-checked-arithmetic.md) |
| A | The same C on 32-bit Arm | [Reader 23](23-same-c-on-a32.md) |

Shared text: [report 24](24-shared-text.md). Independent sceptic decisions:
[early lessons](25-sceptic-early.md) and [later lessons/shared text](26-sceptic-late.md).

The readers of array addressing, zero-terminated strings, recursion, compiling a
loop, and C overflow found no additional substantive English problems. Their clean
outcomes were also checked by the later sceptic. Other lessons contain substantial
clear material; their individual reports record that coverage alongside findings.

Model and effort were inherited from the active Codex session, with no overrides.
Reviewers were separate agents; no particular model identity is claimed beyond
what the runtime exposes. No learner text was drafted during this pass. The site
was built once for the review snapshot; a new full automated test run was unnecessary
because course content and code were unchanged. The remaining work is to implement
accepted corrections through the course's authoring process and verify their
rendered form.
