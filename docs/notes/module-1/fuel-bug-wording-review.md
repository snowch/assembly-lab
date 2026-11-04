# Fuel subtraction wording review

Reviewed 4 November 2026 on `docs/fuel-subtraction-bug`, independently of the drafting and editing agents. Scope: the opening paragraph in `content/lessons/one-pattern-three-readings.prose.ts` and its canonical copy in `docs/notes/module-1/prose.md`.

## Draft and clarity edit

The separate `fuel_copy` agent drafted the explanation from the checked facts. The managing session retained the existing first sentence about the amount of fuel at the start and end, rather than introducing the C identifiers there. The final paragraph says who made the mistake and what GCC compiled:

> Fuel used is the amount at the start minus the amount at the end. A developer wrote `fuel_used_wrong` with that subtraction the wrong way round in C. GCC compiles that C as written. Run `fuel_used_wrong(50, 38)`.

The two prose copies agree. No application code, listing, input or exercise answer changed.

## Learner pass

Read the complete published lesson and checked the changed paragraph against both closing passes in `docs/style.md`. No actionable finding in the change. The fuel quantities establish the intended calculation before the paragraph assigns the reversed subtraction to the developer's C. The next sentence makes GCC's role clear. The invitation to run the example and the following instruction to press Next still join naturally.

The change assumes basic C functions, arguments and `return`, included in the front page's “Before you start” panel (`apps/course/src/strings.ts`). Earlier Fundamentals prose explains “GCC, a compiler, translated the C below into an assembly listing”, the incoming argument registers, and “`sub` subtracts its third operand from its second, then writes its first operand” (`content/lessons/fundamentals.prose.ts`). Earlier Module 1 lessons teach hexadecimal and signed/unsigned readings. No newly unexplained prerequisite was found.

The added sentences introduce no computed result and reveal neither prediction's answer. On the fresh page the later addition walkthrough still asks the learner to check their prediction first. Existing result text elsewhere in the lesson was read for context; this review does not claim a new audit of every existing prediction gate.

## Technical pass

Checked `docs/notes/module-1/listings.md`: the recorded C returns `at_end - at_start`; ARM64 GCC 16.1.0 with `-O1` produced `sub w0, w1, w0`, followed by `ret`. `content/lessons/module-1.listings.ts` copies that C and listing and supplies the call's inputs. With the incoming argument mapping, the listing performs the subtraction present in the C. The attribution is therefore accurate for this example.

Considered whether “GCC compiles that C as written” incorrectly promises literal translation of arbitrary C. Rejected: “that C” refers to the displayed function, and the recorded output supports the local claim. No broader compiler or C-standard guarantee is added.

## Built-page verification

`content/lessons/pacing-1-4.ts` places the edited question on `#/lesson/arithmetic-on-register-bits`, not the source file's namesake route. Inspected the final build in Chromium at `http://localhost:4173/assembly-lab/#/lesson/arithmetic-on-register-bits` using fresh browser contexts:

| Viewport | Theme verified in rendered page | Paragraph width | Document width |
| --- | --- | --- | --- |
| 375 × 812 | Light | 343 px | 375 px |
| 375 × 812 | Dark | 343 px | 375 px |
| 1280 × 800 | Light | 704 px | 1280 px |
| 1280 × 800 | Dark | 704 px | 1280 px |

Viewed all four screenshots, retained for this session at `/tmp/fuel-wording-review/{375,1280}-{light,dark}-intro.png`. The paragraph wraps without clipping, uses 18 px text and has readable code styling. Checked actual `data-theme`, foreground and background colours, rather than relying on requested preferences. No page-level horizontal overflow or JavaScript page error occurred.

In each combination the first figure began “Before the subtraction”; Next reached “After the subtraction”; Reset restored the initial state. The browser's C and instruction text matched the recorded example. These are direct browser observations, not inferred from source tests.

No rebuild, full test suite, live GCC request or QEMU run was performed by this reviewer. The managing session owns the separate build and automated-check results. The review found no correction needed in the scoped change.
