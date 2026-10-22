# Module 12 independent source brief

Checked on 22 October 2026 for issue #16. This is a fact brief for the drafting and
technical-review passes, not a native execution record. No terminal output, address or
version below is claimed to have been measured by this review. The implementation's
native verification record must supply those observations separately.

Read with `CLAUDE.md`, `docs/sources.md`, `docs/authoring.md`, `docs/style.md` and the
Module 11 brief. The learner has completed the core A64 course, including calls, the
argument/result registers, loads, stores, branches, signed arithmetic and C boundaries.
The new material is the tools and execution environment, not another arithmetic model.

## Checked sources and facts

### Function, object and executable

- [AAPCS64, release 2025Q4, Machine Registers](https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst#machine-registers):
  r0–r7 carry arguments and results. The 32-bit names are w0–w30 and the 64-bit names
  x0–x30; those names refer to views of the same registers. For the chosen four-`int`
  function, use w0–w3 for arguments and w0 for the result. Do not turn that lesson into
  a claim that every C argument or return value has this placement.
- [GNU GCC, Link Options](https://gcc.gnu.org/onlinedocs/gcc/Link-Options.html): `-c`
  stops before linking. `-static` prevents linking with shared libraries on systems
  supporting dynamic linking and overrides `-pie`. Static PIE is a separate option.
  A static executable containing a C `main` still contains startup code and library
  machinery. It does not start at the handwritten function or normally at `main`.
- [GNU ld, Setting the Entry Point](https://sourceware.org/binutils/docs/ld/Entry-Point.html):
  `ENTRY(symbol)` sets the executable entry point; `-e` takes precedence. An assembly
  label named `_start` is not itself a general promise about every executable's entry.
  State the chosen entry explicitly in the standalone link command or linker script.
- [Linux v6.8 ELF header](https://github.com/torvalds/linux/blob/v6.8/include/uapi/linux/elf.h)
  defines distinct `ET_REL`, `ET_EXEC` and `ET_DYN` file types. Use the actual `readelf`
  header record to name this build's type, machine, class and byte order. Avoid saying
  that every ELF file is an executable or every executable is ET_EXEC.
- [GNU readelf](https://sourceware.org/binutils/docs/binutils/readelf.html) documents
  `-h` for the ELF header and `-l` for program headers. [GNU objdump](https://sourceware.org/binutils/docs/binutils/objdump.html)
  documents `-d` and `--disassemble=symbol`. Limit the lesson's disassembly to the
  handwritten function so libc's unrelated code does not obscure the exercise.
- [Linux execve(2)](https://man7.org/linux/man-pages/man2/execve.2.html) describes replacing
  the calling process's program, including text, initialised and uninitialised data,
  and stack. An executable is a file; a running process has execution state. Do not
  describe a file as already holding live register values.

### QEMU user mode and GDB

- [QEMU 8.2.2 user-mode documentation](https://github.com/qemu/qemu/blob/v8.2.2/docs/user/main.rst),
  Features and Linux User space emulator: QEMU translates target syscalls for the host
  environment. It does not boot a whole guest Linux kernel in this mode. It executes
  AArch64 instructions by emulation; this is not evidence from a physical Arm CPU.
- The same source says `-g port` means “Wait gdb connection to port”. The lesson must
  explain that a quiet first terminal is expected while QEMU waits. The actual
  `qemu-aarch64` option syntax and startup state still need the reference-tool run.
- [GDB, Connecting to a Remote Target](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Connecting.html):
  load the executable in GDB before `target remote`. `run` and `attach` are not supported
  with `target remote`; use `continue`. A remote connection normally disconnects when
  the program exits. Do not copy a local `run` workflow into this exercise.
- [GDB, Continuing and Stepping](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Continuing-and-Stepping.html):
  `stepi` executes one machine instruction and stops. `display/i $pc` displays the next
  instruction when stopped. Distinguish that next instruction from the instruction
  that just ran. `step` follows source-level stepping rules, so use `stepi` for the
  browser comparison. GDB's accepted AArch64 register spellings must be checked with
  the reference tool; do not assume `$w0` is provided as a convenience register.
- [QEMU 8.2.2 GDB documentation](https://github.com/qemu/qemu/blob/v8.2.2/docs/system/gdb.rst)
  also documents its remote stub and `target remote localhost:1234`. Keep the user-mode
  lesson's `-g` distinct from system-mode `-s -S` flags.

### Standalone Linux entry and syscalls

- [Linux syscall(2), architecture tables](https://man7.org/linux/man-pages/man2/syscall.2.html):
  arm64 enters the kernel with `svc #0`; the syscall-number register is listed as
  **w8**, the result register x0, and the arguments x0–x5. Writing the small positive
  syscall number with `mov x8, #64` or `mov w8, #64` addresses the same physical register;
  do not present x8 and w8 as two separate registers or confuse x8 with an AAPCS argument.
- [Linux v6.8 arm64 unistd.h](https://github.com/torvalds/linux/blob/v6.8/arch/arm64/include/uapi/asm/unistd.h)
  includes `asm-generic/unistd.h`. [That included header](https://github.com/torvalds/linux/blob/v6.8/include/uapi/asm-generic/unistd.h)
  defines `__NR_write` as 64 and `__NR_exit` as 93. These are AArch64 Linux values,
  not universal A64 instruction constants. `exit_group` is a distinct syscall, 94.
- `svc` requests an exception; Linux's register conventions give that request its
  syscall meaning. A bare-metal UART program does not acquire Linux services merely
  by executing `svc #0`.
- An assembly-only `_start` can deliberately avoid the C runtime and `main`. Its
  explicit Linux exit syscall ends this guest program. `ret` is not a substitute
  for process exit at an entry point with no caller-provided return address.
- A minimal `write` example should describe the fixed recorded run. It must not
  promise that one `write` always writes an arbitrary whole buffer or that direct
  syscalls return libc-style `errno`. For a more general program, short writes and
  errors require handling; that is beyond this small entry-point experiment.

### Optional system-mode UART experiment

- [QEMU 8.2.2 virt.c](https://github.com/qemu/qemu/blob/v8.2.2/hw/arm/virt.c),
  `base_memmap`, `create_uart`, and machine initialisation: this `virt` machine puts
  its PL011 UART at `0x09000000` and RAM at `0x40000000`. With `-m 128M`, a chosen
  `0x40080000` image placement is within that RAM. It is not a universal Arm UART
  address, reset vector, or mandatory ELF link address.
- [Linux v6.8 AMBA serial definitions](https://github.com/torvalds/linux/blob/v6.8/include/linux/amba/serial.h)
  define the data register offset `0x00`, flag register offset `0x18`, and TXFF
  as `(1 << 5)`. [QEMU 8.2.2 PL011 implementation](https://github.com/qemu/qemu/blob/v8.2.2/hw/char/pl011.c)
  independently names `PL011_FLAG_TXFF` as `0x20`, returns UARTFR at offset `0x18`,
  and transmits a byte written to UARTDR at offset zero.
- The PL011 source's UARTDR write path contains “Check if transmitter is enabled”
  as an unimplemented check and writes through the host character backend. Successful
  output in this model does **not** validate real hardware clock/divisor setup,
  transmitter enable configuration, or realistic transmit FIFO backpressure. Polling
  TXFF is sensible device-facing code; the recorded run cannot prove that the polling
  loop saw a full transmit FIFO. Do not claim a physical-board recipe.
- [QEMU 8.2.2 arm/boot.c](https://github.com/qemu/qemu/blob/v8.2.2/hw/arm/boot.c),
  `arm_load_kernel` and `do_cpu_reset`: QEMU treats an ELF supplied as `-kernel` as
  non-Linux, obtains its ELF entry, and sets the CPU PC to that entry. Its ELF loader
  loads the image's segments. This is QEMU direct loading, not a demonstration of
  a board's firmware, flash layout or reset-handler boot chain. Check the exact
  resulting load addresses and entry in `readelf -l/-h` and the reference run.
- [QEMU 8.2.2 character multiplexer escape keys](https://github.com/qemu/qemu/blob/v8.2.2/docs/system/mux-chardev.rst.inc):
  with the multiplexer, enabled by default for `-nographic`, Ctrl-A followed by X
  exits QEMU; Ctrl-A H shows help. These are two key presses. A command that disables
  the monitor and uses plain `-serial stdio` may remove the multiplexer and its escape.
  Teach the escape belonging to the exact validated invocation.
- This optional program has no Linux process exit service. After output it must
  deliberately remain in a loop; leaving the emulator is a host action. An automated
  verifier terminating QEMU after observing output must not record that as guest exit.

## Lesson architecture and boundaries

Two ordinary ten-section lessons can carry this work. Keep the familiar trip-distance
function as the connection to earlier lessons. The C harness calls that function; it
must not contain a separate C replacement that accidentally supplies the expected
answer. A controlled wrong subtraction should alter that actual assembly function.

Use the browser's existing instruction subset for browser predictions and challenges.
The downloads and terminal records can contain native startup, Linux syscalls and UART
instructions. Label those records as external-tool evidence. Do not add invented
browser `svc`, kernel, MMIO or full-system behaviour to make the terminal story appear
inside the simulator. Every browser-runnable program still belongs in the existing
differential corpus. Native-only files need their own executable verification.

Teach each tool and flag before its first required use: shell command, source/object/
executable, cross toolchain, GNU assembler/linker, static linking, ELF, disassembly,
emulator, debug symbols, breakpoint, program counter, syscall, entry point and UART.
The learner has learned instructions and calls, not necessarily a terminal workflow.

Keep instructions copyable as commands, with output in a separate labelled block.
Name the terminal for QEMU and the terminal for GDB. Explain that the first stays
occupied, how to close the session, and how to avoid leaving a debug listener behind.
Do not reveal the wrong program's result beside a browser prediction before commitment.

## Observations still requiring executable confirmation

The implementation's reference record should name its OS/container image, package and
tool versions, sources, commands, date and exit status. It should confirm:

1. Assembly plus C harness builds with the exact stated flags; ELF header and program
   headers establish target, little-endian format, file type, entry and static linkage.
2. Correct and deliberately wrong functions produce separately recorded results under
   QEMU user mode. Test signed values within C's representable range where relevant.
3. The limited objdump view comes from the built ELF, and any C/instruction association
   shown on the page has an explicit checked mapping. Addresses are observations of
   this build, not promises for all tool versions.
4. GDB connects to the waiting QEMU process, breaks at the function, shows the specified
   incoming registers, steps its actual instruction, shows resulting bits and PC, and
   continues to process exit. Validate register expression syntax and port cleanup.
5. The `_start` ELF prints its exact recorded line and exits with the expected status,
   without libc, using the documented syscall convention.
6. The optional ELF's loadable segments and entry are in selected RAM; the exact QEMU
   system invocation emits its recorded UART bytes. Confirm the learner's interactive
   exit keys separately from timeout/process termination in an automated test.

No raw terminal output has been generated by this review. A future failing verification
must remain recorded as a failure even if a focused rerun passes after a correction.
