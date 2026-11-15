# Optional and native reference source record

Copyright © 2026 Christopher Snow

14 November 2026. Source-catalogue pass separate from the managing session's UI and
lesson-reference mapping work. Read `AGENTS.md`, `CLAUDE.md`, `docs/sources.md`, the
actual optional D, optional A32 and Modules 12/13 lesson structures, prose, labels and
recorded-listing sources. Read the earlier independent FP technical review, Module A
brief, Module 12 source and boot briefs, and Module 13 facts. This pass edits only
`content/extended-reference-catalog.ts` and this source record. It is not the final
independent review of those edits.

The catalogue supplies primary references for nine lessons. Its lesson mapping records
source relevance. It does not add instructions to the browser ISA, change prerequisite
gates, or assert that every referenced instruction is newly introduced in that lesson.
Labels identify the relevant instruction form; the official source's complete entry
name is retained in the evidence manifest.

## Reachability and content are separate checks

Artifacts are under `/workspace/output/extended-reference-catalog/`:

- `arm-verification.json`: exact source-tree labels and slugs, official service and
  public viewer URLs, status codes and hashes. Each selected page has its decoded
  text alongside the original responses. All 19 selected Arm service responses and
  support.arm.com viewer requests returned HTTP 200.
- `context-verification.json` and `supplement-verification.json`: official manual,
  standards, tool-source and vendor-source fetch results. They retain failures too.
- `pl011-verification.json`: seven retrieved PL011 chapter/register responses.
- `selected-keys.json`: the catalogue and lesson mapping as generated before code
  formatting. `fetch-arm.py`, `fetch-context.py`, `fetch-supplement.py` and
  `write-catalog.py` retain the source-fetch/generation procedure.

An Arm public viewer's HTTP 200 is a reachability result. Its JavaScript shell is not
semantic evidence. Instruction semantics were read from Arm's separate official
`documentation-service.arm.com` JSON responses, decoding their base64 HTML. Slugs
come from the actual edition's topic tree, rather than mnemonic-to-URL guesses.

The DDI0602 root identifies itself as *Arm A-profile A64 Instruction Set Architecture*,
2026-09. DDI0597 `latest` resolved to 2026-09 and identifies itself as *Arm A-profile
A32/T32 Instruction Set Architecture*. The catalogue pins that resolved edition in
both cases. These match the current edition used by the core catalogue. No older
reference was silently relabelled as this edition.

GNU, GCC, GDB and QEMU manual URLs returned HTTP 200 with the relevant content. Pinned
AAPCS32/64 and RTABI32 2025Q4, QEMU 8.2.2, Raspberry Pi documentation and Raspberry Pi
Linux source files were retrieved through their official repositories' raw endpoints.
Their catalogue URLs use the corresponding human-readable GitHub file pages; the raw
content fetch is the semantic check and does not claim a separate successful GitHub
HTML viewer probe.

Raspberry Pi's published documentation pages returned HTTP 403 in this environment.
The catalogue therefore retains the exact official pinned repository sources already
identified in the Module 13 brief. All seven selected raw documentation files and the
pinned BCM2712 device-description source returned HTTP 200. This preserves a proven
primary source instead of substituting a guessed published-page anchor.

The C23 N3096 PDF returned HTTP 503 on both attempts. Keep its established primary URL.
The conversion-clause checks are explicitly inherited from the separate 10 November
FP technical review and earlier module records, not a newly successful PDF read.
`syscall(2)` from the Linux man-pages project returned HTTP 200; it corroborates the
architecture-specific Linux entry convention in the optional native comparison.

## Checked instruction forms and introduction points

| Lesson and actual prose location | Reference keys | Checked form and boundary |
| --- | --- | --- |
| `floating-point-arm`, `PROSE.experiment` | `fp-fadd`, `fp-fmul` | Scalar FADD/FMUL, specifically the S and D register variants. The operation writes a numeric floating-point result to the floating-point bank. These are recorded native cases, not browser instructions. |
| `floating-point-conversions`, `PROSE.experiment` | `fp-fcvtzs` | **FCVTZS (scalar, integer)**, W destination and S source here. The general-purpose integer destination distinguishes it from the same-spelled SIMD destination and fixed-point forms. Rounding is towards zero. |
| Same paragraph's integer-to-float comparison | `fp-scvtf` | **SCVTF (scalar, integer)**, S destination and W source here. The source is a signed general-purpose integer, with rounding selected by FPCR. |
| Same paragraph's widening comparison | `fp-fcvt` | Scalar precision conversion, D destination and S source here; not SVE conversion or multi-vector widening. |
| Same paragraph's representation-copy comparison | `fp-fmov` | **FMOV (general)**, W destination and S source here. The contents transfer without numeric conversion; neither FMOV immediate nor floating-bank-to-floating-bank FMOV describes this listing. |
| `same-c-on-a32`, `PROSE.motivation` | `a32-bx` | A32 BX with LR as register branch target. AAPCS32 supplies the R14/LR calling-convention context. |
| `same-c-on-a32`, `PROSE.investigation` | `a32-mov-register` | A32 **MOV, MOVS (register)** includes the `MOV{c}` form used as MOVCS. This is distinct from every A64 MOV alias. MOV's operation is guarded by ConditionPassed; the linked ConditionHolds helper checks carry for CS. |
| `same-c-on-a32`, `PROSE.explanation` | `a32-movw`, `a32-movt` | The official MOVW material is **MOV, MOVS (immediate)**, A32 encoding A2. Its immediate is zero-extended to 32 bits. There is no fabricated standalone MOVW page. MOVT writes bits 31:16 and leaves 15:0 unchanged. MOVT is explained despite not being needed in the recorded constant function. |
| `same-c-on-a32`, `PROSE.generalisation` | `a32-bl` | A32 **BL, BLX (immediate)**, A1 BL form. It saves a return address in LR. `__aeabi_uidiv` is a library helper, covered by RTABI32, not another mnemonic. |
| `same-c-on-a32`, `PROSE.divisionNote` | `a32-push`, `a32-pop` | Multiple-register PUSH/POP aliases, not single-register forms. PUSH aliases STMDB and POP aliases LDM. Underlying operations store/load successive 32-bit registers, update SP and load the saved PC in the return sequence. AAPCS32 separately requires eight-byte alignment at a public interface. |
| `from-function-to-executable`, `PROSE.explanation` | `native-wfi` | WFI is explicitly explained, rather than inferred from a listing. The primary source describes a hint allowing a low-power wait and possible trapping; the reference does not promise that every WFI must sleep. |
| `from-function-to-executable`, `PROSE.deviceNote` | `native-msr-immediate` | MSR **immediate**, with PSTATE field DAIFSet. The official encoding and operation set selected mask bits. This reference does not introduce generic MSR-to-system-register or MRS forms. |
| Same supplied-device note | `native-adr` | Base ADR forms a PC-relative address in an X register. SVE ADR is a distinct entry and is excluded. |
| `from-function-to-executable`, `PROSE.explanation` | `native-str-postindex`, `gnu-aarch64` | STR immediate's post-index variant describes `str xzr, [x0], #8`; X selects an eight-byte store and writeback follows the store. GNU's distinct `ldr register, =expression` pseudo-op explains the address shorthand. It is not a new hardware LDR encoding. Both connect existing addressing knowledge to native startup. |
| `debug-native-instructions`, `PROSE.bareMetalNote` | `native-svc`, `linux-syscall-man` | SVC requests a Supervisor Call exception. The Linux convention is a separate source fact and does not give a bare-metal program Linux services. |

The instruction page text was read for its descriptions, encodings and operations.
For A32 alias/conditional details, also fetched and read the linked LDM, STMDB,
ConditionPassed and ConditionHolds official pseudocode. These extra source responses
are retained as `a32-ldm`, `a32-stmdb`, `a32-conditions` and `a32-condition-holds`.

The A32 lesson contains CMP in its listing, but its new explanation concerns MOVCS and
A32 syntax; this catalogue does not add an A32 CMP introduction from that occurrence.
A64 CSEL, UDIV, RET and other previously taught comparison instructions likewise do not
become newly introduced here. The native lesson reuses CBZ, TBNZ, LDRB, STRB, STP, LDP,
ordinary branches and the function-call convention already explained in core lessons.
References to those browser forms remain the core catalogue's responsibility.

## Checked contextual sources

`fp-pseudocode` uses the 2026-09 shared floating-point page. Read `FPUnpackBase`,
`FPBits`, `FPRoundBase` and the associated rounding helpers for single/double field
widths, biases, implied leading bits, reserved encodings and nearest-even handling.
AAPCS64's Fundamental Data Types and SIMD/Floating-Point register sections supply the
selected target's format and register-bank conventions. C23 conversion qualifications
retain the separately checked clauses noted above.

AAPCS32's core-register table, parameter/result rules, callee preservation and public
stack interface match the A32 prose. RTABI32 contains the actual unsigned division
helper prototype. GCC's ARM Options documents `-marm` and the selected architecture
feature contract; the recorded compiler responses remain evidence for exact emitted
rows, rather than the architecture reference predicting GCC's output.

GNU's AArch64 Opcodes page explicitly documents `LDR =` and a literal-pool load. The
assembler directives, linker scripts, readelf, objdump and objcopy manuals support the
commands and file transformations the native lessons explain. GDB's remote-target,
stepping and memory-examination manuals distinguish `target remote`/`continue`,
`stepi` and `x` display formats. QEMU's manuals support the virtual platform and debug
connection; its pinned 8.2.2 `hw/arm/boot.c` supports this exact direct ELF loading
path, and `hw/char/pl011.c` exposes the UART implementation's transmit-enable and
buffer-pressure limits.

The PL011 root service identifies *ARM PrimeCell UART (PL011) Technical Reference
Manual*, DDI0183G, r1p5. Its UARTDR, UARTFR, UARTIBRD, UARTFBRD, UARTLCR_H and UARTCR
entries were separately read, alongside the baud-rate generator description. They
support the device registers and line-format/control bits rather than claiming that
the QEMU run tested a physical clock. Raspberry Pi's pinned BCM2712 source supplies
the 9,216,000 Hz UART clock and UART10 device relationship.

The pinned Raspberry Pi documentation contains the Pi 5 EEPROM boot-flow differences,
firmware-selected Arm stub, `kernel`, `kernel_address`, `device_tree=` and
`uart_2ndstage` settings, dedicated UART10 connector/address, probe bridge and supplied
cable information, and read-only EEPROM-report commands. These are board/vendor
source facts. Neither the references nor this pass establish a hardware boot result.
Pi startup contains MRS, MSR-register, ISB and other privileged operations, but its
lesson does not introduce their individual semantics. None is added as a new
instruction reference on the strength of the downloadable listing alone.

## Validation boundary

The catalogue is static bibliography and lesson-key data. Every mapped key exists in
its catalogue, and TypeScript's `satisfies` checks that relationship. TypeScript
(`npx tsc --noEmit --pretty false`), the new file's Prettier check and
`git diff --check` passed. The managing session runs integration and independent
review after attaching these references to the rendered lessons. This pass did not
change lesson prose, execute a browser, run native programs or test physical hardware.
