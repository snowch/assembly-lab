# Independent source and technical review

Copyright © 2026 Christopher Snow

## Scope and evidence

This review is independent of the prose authors. The reviewer did not edit product
prose or lesson structure. It applies `CLAUDE.md`, `docs/style.md`,
`docs/authoring.md`, `.agents/skills/learning-design/SKILL.md` and
`docs/visual-language.md`.

The preserved baseline is `/workspace/scratch/readability-layout/lessons.json`:
75 published lesson objects, not the smaller set of source lesson definitions.
Review focuses on the published objects because pacing code selects and joins prose
with paragraph and line indexes. A sound source edit can still omit or relocate a
qualification after that transformation.

Source review checks parallel list items, sequence semantics, setup/result timing,
width and signedness, causal explanations, qualification adjacency, prediction gates,
optional disclosures, compiler provenance and checked C-to-instruction associations.
It also reconciles the author audit records against the 75 published routes and the
front and Where next pages. Program, trace, input, answer, source map and gate changes
receive separate scrutiny from formatting-only text changes.

Browser evidence is recorded separately by the browser checker. Source comparison
alone does not establish phone reflow, rendered theme, scroll length, visual emphasis
or novice understanding. This is an agent review, not an observed novice study.

## Final source comparison

An independently rebuilt export, `/workspace/scratch/readability-layout/independent-current.json`,
was compared recursively with the baseline after the late pacing corrections. The 75 route
IDs and their order match. Fifty-two routes differ, in 70 string leaves: 65 `prose`, four
challenge `task` strings and one figure `intro`. All object keys, array lengths and
non-string values match. The remaining string fields match, including recorded C and
assembly, original compiler references, checked `sourceLines`, challenge tests, hints,
answers, input calls, gate identifiers, controls, objectives and introduced terms.

Every changed passage was read in its published context. Bullets express parallel facts,
choices or input roles. Numbered lists express the described program sequence or operating
procedure; independent calls still say to restart from their own inputs. The approved C
introduction keeps “On this AArch64 target, both types use 32 bits” immediately before the
two readings and the bare-`unsigned` spelling note afterwards.

Numeric-token comparison, ignoring only line-leading ordered-list markers, found no
unexplained changes. Changed inline-code tokens were checked in context. The newly explicit
`madd` operand roles, stack save locations and checked-addition input registers agree with
the exported programs and prepared inputs. Existing qualifications remain local: C versus
A64 division, signed/unsigned flags, array bounds versus simulated memory, 64-bit callee
preservation, compiler-specific choices and native recordings versus browser execution.

No learner-facing heading, section, interactive or disclosure was added or removed. The
layout edits do not move essential guidance into optional details or move answers outside
their gates. The hexadecimal and subtraction mechanisms retain connected reasoning rather
than being converted indiscriminately into lists. Actual scroll length and visual balance
require the separate browser evidence.

## Accepted findings during draft comparison

The following were found in an interim exported draft, before final author completion.
They are source findings, not claims about the browser. The correction direction is to
preserve complete semantic blocks in pacing joins and check the exported result.

| ID | Severity | Published location and evidence | Effect and correction direction | Status |
| --- | --- | --- | --- | --- |
| R1 | Medium | `stepping-native-function` and `diagnosing-native-failure`: “Open two Linux terminals in the directory containing `boot.elf`:” is followed directly by “In Terminal 1…”. | The new terminal-role list and “Keep both open while stepping” are omitted by paragraph slicing. Preserve the whole setup block. | Corrected by the late author; independently verified in the fresh export. |
| R2 | High | `from-function-to-executable`, “Assemble and place the boot image”, ends “Their options here are:”; `loading-and-startup` instead begins with the `-o`, `-g`, `-T` bullets. | Tool-option definitions are separated from their introduction and first activity. Keep the list with its tool command. | Corrected by the late author; independently verified in the fresh export. |
| R3 | High | `loading-and-startup`: “The script groups related content into **sections**:” has no section-content list. The `.ifdef CHALLENGE` explanation appears twice; the second says “The next lesson selects the other block”. | Section roles disappear and the repeated forward reference now points to the wrong lesson. Preserve the five section roles, retain one correct challenge explanation and its intended route. | Corrected by the late author; independently verified in the fresh export. |
| R4 | High | `from-function-to-executable`, “Repair and rebuild the calculation”, retains only “Editing source does not change the executable…”; its ordered reproduction steps appear at the end of `runtime-startup`. | Instructions for the current repair are moved to a later page. Keep the repair procedure beside its original activity. | Corrected by the late author; independently verified in the fresh export. |
| R5 | High | A follow-on `diagnosing-native-failure` export said “Rebuild with the commands below” but had only option definitions before QEMU/GDB setup. | The named-marker replacement began after the assembly/link command fence. Include all three build commands before their definitions. | Corrected by the late author; independently verified in the fresh export. |

All five accepted findings are closed in source. R1 retains terminal roles and the
keep-open instruction before the QEMU command; R2 retains the three option definitions
with their build command; R3 retains all five section roles and one conditional-assembly
explanation with the correct linked route; R4 retains the complete repair procedure on
its original page and excludes it from runtime startup; R5 retains the complete ordered
assembly/link command block. Browser verification must cover this corrected build.

## Considered concerns not accepted

- The shared-width C introduction does not generalise target sizes to every C
  implementation: its AArch64 qualification remains directly above the list.
- List numbers are execution/procedure markers, not newly asserted machine values. The
  numeric-fact test narrows its exclusion to line-leading numbered-list syntax; its
  actual machine-fact checks remain.
- Retaining derivations as paragraphs is consistent with the task. Splitting the adder,
  signed-shift, widening and C-undefined-behaviour reasoning into many short lists would
  separate a cause from the result it explains. No change is required solely because
  such a paragraph is longer than a parallel-facts list.

## Coverage and checks

The three author tables reconcile exactly with the published catalogue: 27 routes in
Modules 0–4, 22 in Modules 5–9 and 26 in Modules 10–Appendix B. Their 75 entries are unique,
with no missing or unknown route. Every change/no-change decision agrees with the final
object comparison: 19 + 18 + 15 changed routes, and 23 routes retained after review. The
ancillary record explicitly covers both `#/` and `#/where-next`; front-page prerequisites, existing
C self-check and course-plan discovery remain in place. Where next retains its complete
starter, caller/return-address guidance, offline preparation, emulator limits and fixed-input
qualification. Its new check steps preserve empty text fields and the existing exit code.

`npx vitest run content/source-links.test.ts content/lessons/pacing-10-a.test.tsx`
passed independently: two files, 106 tests, exit 0, no failures or skips. This checks source-link
coverage and the preserved late lesson boundaries, including the restored rebuild commands.
The managing session records canonical-copy checks and the exact full-suite result separately. See
[browser-review.md](browser-review.md) for rendered checks and their final build identity.
No external playground, native debugger or physical Pi was operated for this source review.

The final independent export was regenerated after the Pi configuration and A32 task lists.
It matches the late author's final export exactly. Both final deltas preserve their source
facts: Pi load address/filename/device-description choices retain their raw-image and
hardware qualifications, and the A32 task's requested fields remain separate from its
nonzero-divisor input contract. The front page has an explicit no-change audit decision;
Where next has an explicit change audit decision. All 77 requested routes are accounted for.

**Source decision:** accept the completed layout changes. All five accepted interim
findings are corrected; no unresolved source or technical defect was found in this scope.
The browser checker's final-build evidence remains the authority for rendered layout,
actual themes, overflow, scroll cost and interactions.

The managing session’s `final.json` also matches the independent export exactly.
