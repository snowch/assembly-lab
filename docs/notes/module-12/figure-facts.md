# Chapter 12 diagram facts

Copyright © 2026 Christopher Snow

Facts for the separate diagram-label drafting and independent review passes. Prerequisites and
source claims remain in `boot-facts.md`; edit learner-facing labels against `docs/style.md`.
The diagrams explain relationships using recorded data, not live native execution in the page.
`docs/visual-language.md`, “Static schematic”, permits these relationships when concrete values
come from the recorded implementation and are pinned by tests.

## Evidence contract

`content/lessons/module-12.evidence.json` now adds these members under `boot`:

- `image.sections`: `{name,address,size,fileOffset,fileSize}` for `.text`, `.rodata`, `.data`,
  `.bss`, `.stack`, in ELF section-table order. All sizes/addresses/offsets are bytes.
  `address` is where the section begins in emulated memory; `fileOffset` is the ELF section
  header's offset metadata. `.bss` and `.stack` are SHT_NOBITS, so `fileSize` is zero. Their
  offsets must **not** be drawn as file bytes that the loader copies.
- `image.segments`: `{offset,address,fileSize,memorySize}` for the two PT_LOAD segments.
  The loader follows these segment headers. Sections organise the linker output; they are
  not separate loader commands. Virtual and physical addresses match in this linked image.
- `flow`: `{entry,ready,trip,returned,output,halted}` absolute PCs measured in control-flow
  order in one GDB run: `_start`, `boot_ready`, `trip_distance`, `after_trip`, `uart_puts`, `halt`.
  These are selected stops with instructions between them, not a complete trace or equal
  durations. The `output` PC is at the start of `uart_puts`, before it configures the device.
- `stackFrame`: `{beforeSp,frameSp,frameSize}` measured at `uart_puts` entry and after one
  `stepi` executing its first `stp`. That instruction reserves and writes a 16-byte frame
  below the old stack pointer, saving `x29` and `x30`. The later `ldp` restores both and `sp`.
  Existing final startup stop checks `sp` back at `stack_top`.

The existing three `startupStops` remain unchanged. Their first result value is deliberately
injected by GDB before startup, not a claim about natural RAM contents. The last stop's result
is a prediction answer and must remain gated where the existing lesson gates its answer.
The flow PCs, ELF layout and stack addresses disclose no arithmetic answer by themselves.

## Recorded image relationships

Measured GNU binutils 2.42 ELF64 little-endian AArch64 output, Ubuntu 24.04 reference run:

| Section | In the file | In RAM | Size in RAM |
| --- | --- | --- | --- |
| `.text` | bytes at file offset `0x10000` | `0x40080000` | 216 bytes |
| `.rodata` | bytes at file offset `0x100d8` | `0x400800d8` | 82 bytes |
| `.data` | bytes at file offset `0x11000` | `0x40081000` | 4 bytes |
| `.bss` | no stored bytes | `0x40081008` | 8 bytes |
| `.stack` | no stored bytes | `0x40081010` | 4096 bytes |

The executable also has headers, debug sections and padding that the selected-section picture
need not enumerate. Do not imply that the whole ELF file is copied contiguously into RAM.
There are address gaps between these sections. Label the diagram schematic/not to scale if
section blocks have convenient equal visual sizes.

The code load segment has 298 file bytes and 298 memory bytes, covering `.text` and `.rodata`.
The writable load segment has 4 file bytes and 4112 memory bytes. The extra memory includes
alignment padding, BSS and stack reservation. QEMU's ELF loader starts the non-file-backed
part zeroed; the program nevertheless performs its own BSS-clear loop. Our memory diagram
must distinguish loader reservation/zero-fill from that explicit startup write.
The UART at `0x09000000` is a device outside the selected RAM interval; it has no bytes in
`boot.elf` and must not look like a load segment or ordinary RAM.

## Control and stack relationships

The measured selected PCs are:
`_start=0x40080000`, `boot_ready=0x40080024`, `trip_distance=0x400800c8`,
`after_trip=0x40080038`, `uart_puts=0x4008005c`, `halt=0x40080054`.
Addresses are not execution order; function calls and returns move backwards or forwards.

- For this QEMU direct-loaded ELF only, reset begins at ELF entry `_start`. There is no
  guest BIOS, UEFI or reset stub before it. QEMU's host loader prepares the memory first.
- `_start` sets the stack pointer and clears BSS, reaching `boot_ready`.
- `boot_ready` loads the four function inputs. Its `bl trip_distance` sets `x30` to
  `after_trip`. The function's `ret` returns there; it does not end the machine.
- `after_trip` stores and checks the calculation, selects a message, then calls `uart_puts`.
  That helper writes device registers and message bytes. Its `ret` reaches `halt`.
- `halt` waits and loops; Ctrl-A then X closes QEMU from the host. There is no guest Linux
  process or exit status to draw at the end of this path.
- Before the UART helper's first instruction, `sp=0x40082010`. After `stp x29,x30,[sp,#-16]!`,
  `sp=0x40082000`. The occupied frame is `[0x40082000,0x40082010)`, inside the reserved stack
  `[0x40081010,0x40082010)`. The stack grows towards lower addresses. Show the direction and
  the boundary at `stack_top`; no block above `stack_top` belongs to this reserved stack.

Physical firmware boot is a separate schematic, not evidence that this run executes firmware.
Use the already-checked source-qualified TF-A/UEFI comparison in `boot-facts.md`. A board's
ROM/firmware can initialise hardware and hand off to a loaded image; its contracts vary by board.
Never put a PC BIOS or TF-A stage on the measured QEMU ELF execution path.

## Verification

`python3 scripts/native/check.py --record` was executed in the existing Ubuntu 24.04 reference
container. It reads the ELF64 binary headers with Python `struct`, checks section type/allocation,
file bounds and unique load-segment coverage, and checks file-to-memory offset relationships
for stored sections. `readelf -SW` and the existing `readelf -h -l` checks run as well.
The new flow PCs are checked against `nm` symbols and the sequence actually reported by GDB.
The stack movement is checked against linker `stack_top` and the measured single instruction.
All former good/broken arithmetic, poisoned BSS, native challenge, UART and optional Linux
assembly checks continue to run. No downloaded source changed, so the deterministic zip
remains byte-for-byte unchanged.
