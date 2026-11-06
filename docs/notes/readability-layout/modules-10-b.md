# Published layout review: Modules 10 to Appendix B

6 November 2026. Source review and layout implementation by the late-course agent. Read
`CLAUDE.md`, `docs/style.md`, `docs/authoring.md`, the local learning-design skill and
`docs/visual-language.md`. The outcome is to make starting facts and reference entries
findable while keeping explanations of cause and effect together. This is a layout change,
not a new teaching sequence or evidence of learning from beginners.

Reviewed all 26 published routes in `/workspace/scratch/readability-layout/lessons.json`,
then checked the assembled final routes in `late-final.json`. Reviewed section prose,
figure lead/after text, tasks, existing code blocks and the source-to-published pacing joins.
All changed strings have matching canonical records. No new headings, disclosures, tables,
CSS or program changes were introduced. Browser review belongs to the independent course
review; this author's checks below are source and rendered jsdom checks.

## Route inventory

| Published route | Decision and reason |
| --- | --- |
| `from-c-to-instructions` | Accepted: list variable/register roles and the `movz`/`movk` facts. Retain the explanation of intermediate values and return-register reuse as connected prose. |
| `equivalent-trip-charge` | No change: a short contract and rationale; the existing task already separates unsigned argument registers in bullets. |
| `change-c-calculation` | No change: the editor action and its consequences form short causal paragraphs. |
| `cap-charge-in-c` | No change: the order of unsigned multiplication, wrapping and capping is the mechanism, rather than a reference list. The task keeps that qualification local. |
| `compile-a-loop` | Accepted: list the four distinct register roles. Retain the explanations of control flow and evaluator limits. Existing prediction inputs are already a short list. |
| `write-assembly-loop` | No change: the task already lists count/rate registers and separates the result and zero-count requirements. |
| `change-loop-boundary` | No change: the endpoint and wrapping-counter paragraphs explain why the changed loop runs differently. Fragmenting that reasoning would weaken the explanation. |
| `repeated-shifts-in-c` | No change: compact paragraphs explain the difference between repeated valid shifts and one invalid shift. |
| `c-and-overflow` | No change: short causal paragraphs connect the C guarantee, optimiser choice and direct A64 experiment. The tasks have only one incoming value each. |
| `checked-arithmetic` | No change: the promotion and mixed-comparison paragraphs explain conversions through individual examples. Existing prompts have one incoming value. |
| `checked-addition` | Accepted: list the wrong-report experiment's starting registers and the checked API's true/false return meanings. The optional formatting note also lists `%d`/`%u` argument types. Preserve the code and stored-result qualification. |
| `from-function-to-executable` | Accepted: list source-file roles, assembler/linker options and QEMU options; number the actual change/rebuild/restore sequence. Preserve every command block, supplied directive warning and native-only limitation. |
| `loading-and-startup` | Accepted: list section roles and assembly directives. Keep stack alignment reasoning after the section list and keep the conditional-assembly explanation on this page. |
| `runtime-startup` | Accepted: the optional device detail lists UART register configuration and output-instruction roles. The existing startup mechanism and recorded-evidence explanation stay together. Corrected the pacing join so the repair procedure belongs to the build activity. |
| `debug-native-instructions` | Accepted: list the two terminal roles and the commands used to inspect the entry point. Keep each complete command group beside its explanation. |
| `stepping-native-function` | Accepted: the shared terminal-role and GDB-command lists render here too. Preserve the complete fresh connection instructions, the step loop and shutdown procedure. |
| `diagnosing-native-failure` | Accepted: preserve the three rebuild commands and their option list, terminal-role list and complete fresh connection. No required command or explanation can be lost at a paragraph split. |
| `raspberry-pi-5` | No change: the parts checklist is already a short list. Connector instructions need their local no-power and orientation qualifications together. |
| `raspberry-pi-boot` | Accepted: list the independent load-address, filename and device-description configuration facts. Keep build commands, checksum definition and unverified-hardware qualification visible. |
| `capture-pi-boot` | Accepted: number the existing card preparation actions and list terminal settings. Keep the erase warning before the actions, the stop condition beside them and the output/verification qualifications intact. |
| `restore-pi-boot` | Accepted: number the deliberate-error build/replace/boot sequence and list the test-record fields. Preserve the expected-versus-observed distinction, actual capture, restoration and fresh-power-on requirement. |
| `same-c-on-a32` | Accepted: list the incoming argument and outgoing result registers. Keep the distinction from A64 views visible after the list. |
| `a32-conditions` | Accepted: list the two prediction inputs separately. Retain the causal explanations of the conditional move and select. |
| `a32-constants` | No change: one constant example and a short comparison explain the spelling; a list would split the mechanism into sentence fragments. |
| `a32-division-helper` | Accepted: list the three requested answer fields. Preserve target-feature and nonzero-divisor qualifications. Existing takeaway list stays unchanged. |
| `twos-complement` | No change: the published appendix already uses short reading/range lists and a numbered inversion calculation. Its algebra and width bridge need connected prose. |

No tables were added to lessons: the reference entries have qualifications that fit narrow
lists more comfortably than table cells at 375 pixels. Existing code blocks and the existing
procedural headings remain unchanged.

## Pacing join verification

Native build/layout and startup/repair now use existing prose markers rather than paragraph
counts. This retains complete Markdown groups after adding list-separating blank lines.
The debugger's reused terminal introduction also uses its existing opening marker rather than
one numbered paragraph. The independently assembled export confirms:

- Build options and the numbered repair sequence stay on `from-function-to-executable`.
- All five section roles and eight directive roles stay on `loading-and-startup`.
- The conditional-assembly explanation occurs once, with its existing diagnosis-page link.
- `runtime-startup` contains startup, not the original activity's repair steps.
- Both reused debugger introductions contain both terminal roles and the keep-open instruction
  before QEMU/GDB commands.
- `diagnosing-native-failure` includes both assembler commands and the linker command before
  starting the fresh remote session.

Independent interim findings R1–R4 identified incomplete groups caused by paragraph-index
joins; these were corrected with the marker boundaries above. R5 identified that the diagnosis
page still needed its actual rebuild block, rather than only its explanation; the full command
block was restored and a focused assertion pins all three commands in order.

## Checks

- Initial focused run: eight existing late-course files passed, 102 tests.
- Boundary assertions added to `pacing-10-a.test.tsx`; focused pacing rerun passed, 29 tests.
- Subsequent six-file focused run passed, 60 tests, including the restored diagnosis commands.
- Final two-file run after the Pi configuration and A32 requested-field lists passed, 36 tests.
- TypeScript typecheck and Prettier checks for the changed late-course files passed.
- These are focused results, not a full-suite verdict. The root session runs the final build,
  independent browser review and broad checks; final results belong in its shared review record.
- Canonical prose checks cover the exact source records, including the late pacing JSON block.
- No native binary/program changes were needed; no hardware run or beginner study was performed.
