# Diagnostics and front-page closure

Implemented only retained L19–L21 plus stale front-page status observation.

| Finding | Change | Files |
| --- | --- | --- |
| L19 | Replace unexplained noun “an extend” with extension terminology. Memory diagnostic includes both shift and extension, matching its actual rejected forms. | packages/machine/src/strings.ts:54,68,89 |
| L20 | Identify inability to load encoded instruction bytes as this simulator's representation limit. Preserve instruction/source/address interpolation. | packages/machine/src/strings.ts:112 |
| L21 | Identify missing, invalid or extra operands after directive name. Preserve broad shared diagnostic because its only parameter is source text, used for distinct failures. | packages/machine/src/strings.ts:36 |
| Stale status | Remove sentence referring to nonexistent “other” planned modules; keep label-based published draft explanation. Static and interactive front pages share this string. | apps/course/src/strings.ts:23; strings.test.ts:39 |

## Draft and checks

Checked fact brief: diagnostics-brief.md, created before drafting. Root session drafted all six final strings independently from that brief; diagnostics agent checked against parser/run code, edited files and checked resulting messages. No claim of independent browser verification here; root's separate checking coordinator will do that after production build.

Executed actual assembler probes before and after edit for all three extension messages, `.zero`, excess `.zero` arguments, malformed global name, empty `.word` operand, and `.ascii` without operand. Verified valid extension forms assemble without errors. Executed an instruction-address load; fault message names simulator and retains correct source line, instruction and address. Parser/run behaviour unchanged.

Focused check passed: `npx vitest run packages/machine/src/assemble.test.ts packages/machine/src/memory.test.ts apps/course/src/strings.test.ts apps/course/src/static-page.test.ts` — 4 files, 240 tests. Prettier applied to the three edited files. Existing machine tests already exercise affected diagnostic keys and instruction-memory fault; updated existing exact-copy front-page test. No redundant new wording tests added.

Owned edits: three files only. No platform/content/views changes, build, broad suite or commit performed by this agent.
