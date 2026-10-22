# Checked brief: assembly-only direct ELF boot

Copyright © 2026 Christopher Snow

Objective: build, load and debug an assembly-only bootable ARM64 image, explain who supplies
its entry address, stack, initial memory and output device, and distinguish this experiment
from firmware on a physical board. Prior knowledge: Modules 0–11, including calls, branches,
register widths, stack frames and memory. Apply `docs/style.md`, separate drafting and independent
learner/technical review. Do not require C, GCC, Linux process startup or syscalls for this path.

## Executed source contract

All facts below were executed in Ubuntu 24.04 x86_64, GNU binutils 2.42, QEMU 8.2.2,
GDB 15.1. `python3 scripts/native/check.py --record` passed on the public download sources.
The complete, repeatable evidence is `content/lessons/module-12.evidence.json`.

- `boot.s` and `trip_distance.s` are assembled separately. `boot.ld` links both into `boot.elf`.
  `make` defaults to this ELF image. No C compiler or C runtime participates.
- `aarch64-linux-gnu-as -g boot.s -o boot.o`;
  `aarch64-linux-gnu-as -g trip_distance.s -o trip_distance.o`;
  `aarch64-linux-gnu-ld -T boot.ld boot.o trip_distance.o -o boot.elf`.
  Tool names describe the GNU target toolchain; using its assembler/linker does not require
  the output to make Linux syscalls.
- `qemu-system-aarch64 -M virt -cpu cortex-a53 -m 128M -nographic -kernel boot.elf`.
  Exit with Ctrl-A, release, X. The guest waits at `halt`; emulator exit is a host action.
- QEMU parses the ELF load segments, places their file bytes in emulated RAM and sets the
  reset PC to ELF entry. Here the first paused PC is `0x40080000`, exactly `_start`.
  This exact ELF path has no guest BIOS, UEFI or generated boot stub before `_start`.
  It is a bootable directly loaded image, not a PC boot sector or a disk image.
- Reference reset CPSR is `0x400003c5`, whose mode bits identify EL1h. `sp` starts at zero.
  This is evidence for the selected machine and options, not a portable A64 reset guarantee.
- `_start` masks debug, SError, IRQ and FIQ with `msr daifset,#0xf`. It loads the linker-defined
  `stack_top` into `sp`, then writes zero to each aligned eight-byte unit from `bss_start` up to
  but excluding `bss_end`. There is no vector table or handler for unexpected synchronous faults.
- The debugger verifier deliberately writes `0xa5a5a5a5` into `result` before startup. At
  `boot_ready`, `result` is zero; this establishes that our startup loop clears it even though
  QEMU's ELF loading also starts the reserved memory at zero. Do not say the sentinel is a
  naturally occurring RAM value. `initialized_marker` is separately loaded from `.data`
  with its recorded value `0x12345678`.
- `.text` is machine code, `.rodata` the UART messages, `.data` the initialised marker.
  `.bss` reserves memory for `result` without storing those zero bytes in the image.
  `.stack` reserves 4096 bytes; its top is aligned to 16 bytes. ELF memory size exceeds
  file size for the writable segment. The source is direct-loaded into RAM; it does not
  implement a physical board's ROM-to-RAM `.data` copy.
- Reference addresses: RAM `[0x40000000,0x48000000)`, entry `0x40080000`, BSS
  `[0x40081008,0x40081010)`, stack `[0x40081010,0x40082010)`, UART at `0x09000000`.
  Address notation in the evidence regions uses an exclusive end. Addresses of local labels
  can move when source changes. Use `nm`, `readelf -h -l` and debugger labels.
- `boot_ready` sets `w0..w3` to `120,85,42,15`, then `bl trip_distance` supplies a return address
  in `x30`. The unchanged function's four instructions are `add/add/sub/ret`.
  Their recorded low32 states match the browser: 120,205,247,232,232 in `w0`.
  `ret` reaches `after_trip`, which stores `w0` to `.bss` symbol `result`.
- The report compares the stored calculation with 232 and selects a zero-terminated message.
  The native program prints `Assembly Lab: trip check passed` or `Assembly Lab: trip check failed`.
  The deliberate third-instruction add gives 262 and prints failed.
- `uart_puts` preserves its own `x30` in a 16-byte stack frame because it returns to startup.
  PL011 memory-mapped registers: base `0x09000000`, data offset0, flags0x18, TXFF bit5,
  control0x30, integer divisor0x24, fractional0x28, line control0x2c. It configures the
  device, waits while TXFF is set, then writes each byte. QEMU output validates this device
  path, not physical baud clocks, device enable behaviour or realistic FIFO pressure.
- `halt` uses `wfi` and branches back to itself. There is no Linux process, exit status, or
  caller-provided return address for `_start`. A leaf `trip_distance` can return because `bl`
  called it. The boot entry cannot use `ret` to end the machine.

## Debugging and native challenge

- Terminal 1: same QEMU command plus `-S -gdb tcp:127.0.0.1:1234`. `-S` pauses the CPU from
  the start; `-gdb` opens a debugger endpoint bound to this computer's loopback interface.
- Terminal 2: `gdb-multiarch ./boot.elf`; then `target remote localhost:1234`.
  Initial `$pc` is already `_start`. `break boot_ready`, `continue`, `info registers sp pc`,
  `x/1wx &result` inspect startup. For the poisoned demo, `set {unsigned int}&result =
  0xa5a5a5a5` must occur before `continue` at the initial entry.
- `break trip_distance`, `continue`; `info registers x0 x1 x2 x3 pc`; `x/i $pc`.
  Each `stepi` executes one machine instruction. Four steps include `ret` to `after_trip`.
  After the first addition low32(`x0`)=205; after the second247; third232 or262.
- `break halt`, `continue`, `x/1wd &result` displays the stored signed calculation.
  `quit` GDB and confirm disconnect if prompted. Close QEMU with its Ctrl-A X escape.
  There is no remote process `kill` or Linux `continue`-until-process-exit workflow here.
- Revised challenge: signed32 sum minus twice correction, as in browser tests. `verify-boot.s`
  selects the conditional boot harness, adds a table of four tuples and expected results:
  `(120,85,42,15)->217`, `(7,9,4,2)->16`, `(0,0,0,0)->0`, `(0,0,0,1)->-2`.
  It calls the same separately assembled `trip_distance`, compares results, reports failure
  immediately or `4 cases passed` after all four. It then waits, with no process exit.
- After editing `trip_distance.s`, `make challenge.elf` rebuilds that object and the test image.
  Run the same QEMU command with `-kernel challenge.elf`. Explicit commands:
  `aarch64-linux-gnu-as -g trip_distance.s -o trip_distance.o`;
  `aarch64-linux-gnu-as -g verify-boot.s -o verify-boot.o`;
  `aarch64-linux-gnu-ld -T boot.ld verify-boot.o trip_distance.o -o challenge.elf`.
  Run all commands in the extracted source directory: `verify-boot.s` includes `boot.s`.
- Executed checks accept subtract-twice and double-register-then-subtract alternatives and
  reject the original single-correction function. The normal `boot.elf` still tests the
  original232 contract. Use `challenge.elf` for the revised contract.

## Sources and limits of transfer to a board

- [QEMU 8.2.2 arm/boot.c](https://github.com/qemu/qemu/blob/v8.2.2/hw/arm/boot.c),
  `arm_load_kernel`/`do_cpu_reset`: non-Linux ELF load and reset PC directly to ELF entry.
  [virt.c](https://github.com/qemu/qemu/blob/v8.2.2/hw/arm/virt.c) fixes the selected RAM/UART
  map. Existing `sources-brief.md` records the PL011 implementation checks and their limits.
- [Trusted Firmware-A 2.10 firmware design](https://github.com/ARM-software/arm-trusted-firmware/blob/v2.10.0/docs/design/firmware-design.rst),
  BL1: this implementation begins at a platform-dependent reset vector at EL3, usually in trusted
  ROM, then uses SRAM. Its architecture has multiple boot stages loading and transferring control
  to later images. This is an example of real Arm firmware design, not a universal sequence that
  every board runs. Do not attribute the TF-A sequence to our direct-load ELF experiment.
- [EDK II stable202402 introduction](https://github.com/tianocore/edk2/blob/edk2-stable202402/ReadMe.rst)
  identifies it as UEFI/PI firmware. Its
  [ArmVirtQemu platform](https://github.com/tianocore/edk2/blob/edk2-stable202402/ArmVirtPkg/ArmVirtQemu.dsc)
  explicitly supports AARCH64 and ARM and loads UEFI components. Thus UEFI exists for Arm;
  A64 instructions do not imply a PC BIOS. UEFI specification website returned403 in this environment;
  claims here use the checked open implementation, not an unread specification.
- [SeaBIOS 1.16.3 introduction](https://github.com/coreboot/seabios/blob/rel-1.16.3/README)
  identifies that implementation as an x86 legacy BIOS. Use “legacy PC BIOS” for this comparison;
  do not use “BIOS” as a generic name for every processor's startup software.
- Physical board adaptation requires its reset/firmware handoff contract, load addresses and
  storage layout, RAM/clock setup and device map. Firmware may initialise hardware and load a
  later image before branching to its entry. An address chosen for QEMU virt is not a board recipe.
  No physical hardware, firmware ROM, flash/disk boot, MMU setup, interrupt controller or driver
  stack is executed/verified by this capstone. These limits should be explicit, with the direct
  load path fully taught rather than labelled a simulation of unspecified firmware.
