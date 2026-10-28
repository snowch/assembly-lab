# Module 12: Boot an assembly program (lesson text)

Drafted separately from the checked native assets and source brief. This record contains the current learner-facing prose and labels verbatim. Native execution and independent reviews are recorded separately.

# Build and boot an assembly program

## PROSE.question

The trip function can run in a computer that has no operating system. **What must happen before its first instruction, and who does that work?**

You will assemble a bootable ARM64 program, give it its own startup code and run it on QEMU's `virt` machine. Its caller, calculation and serial output are all assembly.

## PROSE.motivation

A text file of instructions is **source**. An assembler translates it into machine instructions in an **object file**. A linker joins object files and resolves references to names such as `trip_distance`. Its output here is an **executable**, a file prepared for loading and running.

QEMU system mode emulates a complete computer: a processor, working memory and devices. That computer runs our program directly, without Linux or a C library. This is **bare-metal** programming. Your host computer still runs its usual operating system and uses it to run the tools and QEMU.

The GNU tools below produce AArch64 code, even if your host uses another instruction set. The `linux-gnu` part of their names does not require the program they build to use Linux.

## PROSE.setup

Use a Linux terminal, the window in which you enter commands and read their output. The checked reference environment is Ubuntu 24.04. On Windows, use an Ubuntu terminal in WSL2, the Windows facility for running Linux. These commands are for that Linux terminal.

Each command block below contains commands to enter in order, without a prompt character. Install the tools first. `sudo` asks for administrator privileges. `apt-get update` refreshes the package list; `install` downloads and installs the named packages. This step needs a network connection.

```sh
sudo apt-get update
sudo apt-get install binutils-aarch64-linux-gnu qemu-system-arm gdb-multiarch make unzip
```

[Download the complete source bundle](native/assembly-lab-native.zip). Save it in a folder where you can open a terminal. Extract it with `unzip`, then change into its new directory with `cd`:

```sh
unzip assembly-lab-native.zip -d assembly-lab-native
cd assembly-lab-native
```

Open [boot.s](native/boot.s), [trip_distance.s](native/trip_distance.s) and [boot.ld](native/boot.ld) in a text editor. The first file supplies startup and output. The second contains the familiar trip function. The last tells the linker where to place the program in memory. Keep the files together. No C compiler or online compiler is needed for this path.

## PROSE.prediction

At `boot_ready`, the assembly caller supplies:

- 120 in `w0`.
- 85 in `w1`.
- 42 in `w2`.
- 15 in `w3`.

It then calls `trip_distance`. The function adds the three distances, subtracts the correction and returns, as in Module 0.

The browser runs only this arithmetic function. Use the external tools for startup and device output; the browser does not execute that part of the boot image.

## PROSE.predictionQuestion

**What signed value does the function return in `w0`?**

## PROSE.predictionExplain

It returns 232. The additions make 205, then 247; subtracting the correction leaves 232. `ret` transfers control to the assembly caller without writing a new result to `w0`.

## PROSE.investigation

Assemble the startup code and the function separately, then link them:

```sh
aarch64-linux-gnu-as -g boot.s -o boot.o
aarch64-linux-gnu-as -g trip_distance.s -o trip_distance.o
aarch64-linux-gnu-ld -T boot.ld boot.o trip_distance.o -o boot.elf
```

`as` is the GNU assembler; `ld` is the GNU linker. `-o` names each output file. `-g` includes information that lets a debugger relate machine code to source names and lines. `-T boot.ld` selects the **linker script**, the file that defines the memory layout and first instruction.

Open `boot.ld`. `ENTRY(_start)` selects the executable's **entry point**, the address at which our startup begins. The script places the program at `0x40080000`, inside this QEMU machine's RAM, its working memory. This placement belongs to this example; it is not an ARM64 reset address.

The executable uses **ELF**, a file format that records machine code, data and loading information. Object files can use ELF too; not every ELF file is executable.

The script groups instructions in `.text`, fixed message bytes in `.rodata`, initialised writable data in `.data`, zero-initialised storage in `.bss` and stack space in `.stack`. These are **sections**, groups of related content. It reserves the stack and names its upper address `stack_top`. It aligns the stack region to 16 bytes and reserves a multiple of 16 bytes, so `stack_top` is also aligned as the calling convention requires.

The lines beginning with a dot in the assembly are **directives** for the assembler. They do not execute on the processor. `.section` selects a section; `.global` exposes a name to the linker; `.type` identifies a function; `.p2align 2` aligns to a multiple of four bytes. `.size` records a function's size. `.word` supplies a stored value, `.asciz` stores message bytes followed by zero, and `.skip` reserves space. Keep these lines and the function label when editing the trip instructions.

In `boot.s`, `.ifdef CHALLENGE`, `.else` and `.endif` choose which source block the assembler includes. With the ordinary build, `CHALLENGE` is not defined, so it includes the single-call block after `.else`. These directives do not create a runtime choice. The next lesson selects the other block for its test caller.

The ELF loader follows **LOAD segments**, regions the executable asks it to place in memory. A segment can contain several sections. Use the file-to-memory diagram to match sections to their addresses. Select a section to inspect its stored bytes or reserved space before following startup.

## PROSE.construction

Boot the linked program:

```sh
qemu-system-aarch64 -M virt -cpu cortex-a53 -m 128M -nographic -kernel boot.elf
```

`-M virt` selects QEMU's machine design. `-cpu cortex-a53` selects the emulated processor and `-m 128M` its RAM size. `-kernel` supplies the image to load; this option's name does not make the image a Linux kernel. `-nographic` connects the serial console and QEMU's control interface to this terminal.

The reference GNU/QEMU build produces this serial output:

```text
Assembly Lab: trip check passed
```

Startup calls the function, saves its result in memory at `result`, and compares it with the expected value. It chooses a message and sends its bytes to the serial device. The passing line reports that comparison; it does not print the result's digits.

The terminal stays occupied after printing. Our program waits in a loop; there is no operating-system process exit inside the emulated machine. Press Ctrl-A, release it, then press X to leave QEMU. These are host controls, not instructions executed by the program.

## PROSE.failureExperiment

In the browser experiment, the third instruction has been changed from `sub w0, w0, w3` to `add w0, w0, w3`. The same four inputs are used. The function still returns to its assembly caller.

## PROSE.failureQuestion

**What signed value does this modified function return in `w0`?**

## PROSE.failureExplain

It returns 262. The first two additions still make 247, but the final addition increases it by 15. The native caller saves that value and chooses its failure message. Building successfully does not establish that the calculation is correct.

## PROSE.explanation

Follow `_start` in `boot.s`. It has no caller that has prepared a stack or promised zeroed working storage. For this pass, follow stack setup, storage clearing and the function call. Keep the supplied device setup unchanged.

- `ldr x0, =stack_top` asks the assembler to arrange a load of the address named by the linker. The following `mov sp, x0` gives the stack pointer its initial value. The `=name` form is assembler shorthand, not an additional processor instruction.
- The zeroing loop loads `bss_start` and `bss_end`, then compares the addresses. The 64-bit zero-register name, `xzr`, reads as 0, like `wzr`. The store `str xzr, [x0], #8` clears eight bytes at a time. The final operand advances the pointer after the store. The linker makes this region a multiple of eight bytes. `b.hs` leaves the loop when its unsigned address reaches the end.
- At `boot_ready`, startup supplies the arguments and calls `trip_distance`. `bl` gives that function a return address. At `after_trip`, the caller stores the returned value. It uses `csel` to select the passing message when the comparison is equal, or the failing message otherwise.

`uart_puts` sends the selected zero-terminated string to a **UART**, a device that sends bytes serially, one after another. Its aligned stack frame preserves the frame pointer and return address. Treat this supplied routine as the output operation on the first pass; inspect its device accesses in the detail below.

The recorded startup figure shows stops before setup, after stack preparation and storage clearing, and after the calculation. Select each stop to compare the program counter, stack pointer and stored result. This is a recording from GNU/QEMU/GDB, not a machine running in this page.

After output, `wfi` waits for an interrupt, a request that can divert execution to other code. `b halt` keeps execution in the waiting loop if it resumes. `ret` would be wrong at the program entry: no caller supplied an address to return to.

To reproduce the arithmetic failure, change only the third instruction in `trip_distance.s`. Repeat the assembly and link commands, then boot the new image. Restore the subtraction and rebuild before the next lesson. Editing source does not change the executable already on disk or the running machine.

## PROSE.deviceNoteSummary

Inspect the supplied device and exception setup

## PROSE.deviceNote

`msr daifset, #0xf` sets the mask bits for debug, SError, IRQ and FIQ exceptions. SError is a system-error exception; IRQ and FIQ are interrupt requests. A handler is code that responds to an exception. Masking prevents the selected exceptions from being taken while their mask bits are set. This small program supplies no interrupt handlers. It uses **polling**: repeatedly reading device status to decide when to act.

The PL011 UART's device registers appear at memory addresses on this machine. This is **memory-mapped input/output**: a load or store at a device address talks to the device. The base address here is `0x09000000`. The setup stores configure the UART: offset `0x30` is its control register, written with zero while configuring and `0x301` to enable the UART, transmitter and receiver. Offsets `0x24` and `0x28` hold the integer and fractional baud-rate divisors; this source writes 1 and 0. A divisor sets the serial bit rate from the device’s clock. This QEMU run does not verify physical clock settings, serial timing or realistic transmit-buffer pressure. Offset `0x2c` controls the line format; `0x60` selects eight data bits. These values describe this experiment, not a board-independent serial-speed recipe. `adr` obtains the address of a nearby message label. `ldrb` reads each message byte; `cbz` detects its zero terminator. The output loop reads the UART flag register at offset `0x18`. `tbnz` tests bit 5 and branches while the transmit buffer is full. `strb` writes an available byte to the data register at offset zero.

`uart_puts` uses `stp` and `ldp` to save and restore its frame pointer and return address. Startup prepares the aligned stack before calling code that uses it.

## PROSE.generalisation

Inspect the ELF image with the GNU tools:

```sh
aarch64-linux-gnu-readelf -h -l boot.elf
aarch64-linux-gnu-objdump -d --disassemble=_start boot.elf
aarch64-linux-gnu-objdump -d --disassemble=trip_distance boot.elf
```

`readelf -h` reads the file header, including the target machine, byte order and entry address. `-l` lists its program headers, including the `LOAD` segments used by the loader. The file-to-memory figure beside the linker inspection separates stored bytes from reserved memory.

`objdump -d` translates machine instructions back into assembly text, a **disassembly**. `--disassemble=name` limits the output to that named function. Compare the four trip instructions with the source.

For this command, QEMU supplies the ELF loader before our instructions run. The control-flow schematic separates host loading from guest execution and compares it with a possible physical-board boot chain.

On a physical board, reset begins at an address determined by that processor and system. Many Arm systems first execute **boot ROM**, startup code stored in read-only memory. **Firmware** is the board’s early startup software; a **bootloader** loads the next program and transfers control to it. Their stages and handoff conditions depend on the board.

**BIOS** usually names the legacy PC firmware interface. Some Arm machines use **UEFI**, a modern firmware interface also used on PCs. Neither runs in this QEMU direct-ELF path. Our image is bootable on the chosen QEMU machine; it is not a universal disk or USB boot image.

## PROSE.finalTask

Repair `trip_distance`. Four signed 32-bit values arrive in registers:

- The first distance in `w0`.
- The second distance in `w1`.
- The third distance in `w2`.
- The correction in `w3`.

Return the sum of the distances minus the correction in `w0`, then return to the assembly caller. The supplied tests stay within the signed 32-bit range.

The browser tests check several input sets and accept any permitted instruction sequence with the required behaviour. Copy your function body into `trip_distance.s`, keeping the label and surrounding directives. Assemble it again, link `boot.elf` again and boot it. The native caller checks the original trip inputs and chooses a serial message. The next lesson inspects the stored value and instruction stops.

## PROSE.finalHints.0

Follow the result through the three arithmetic instructions before changing anything.

## PROSE.finalHints.1

The correction reduces the sum. Returning normally does not establish that the value is correct.

## PROSE.finalHints.2

For distances 7, 9 and 4 with correction 2, the required result is 18.

## PROSE.finalHints.3

Keep the accumulated result in w0 and subtract the correction before returning.

## PROSE.finalHints.4

One solution is two additions into w0, followed by sub w0, w0, w3 and ret.

## PROSE.reflection

- The assembler translates source into object files; the linker gives their contents addresses.
- ELF loading information tells QEMU where to place the program and where to begin.
- Our startup prepares the stack and zeroes `.bss` before calling the function.
- Memory-mapped stores send bytes to this machine's UART.
- Finishing the calculation leaves our bare-metal program in a waiting loop.

After editing only `trip_distance.s`, which files must you rebuild?

## PROSE.reflectionNoteSummary

Answer

## PROSE.reflectionNote

Assemble `trip_distance.s` again to replace `trip_distance.o`, then link again to replace `boot.elf`. The unchanged `boot.o` can be reused. Stop the old QEMU machine and boot the new executable.


## PROSE.originalityNote.textbookExample

A first bare-metal greeting presented without its startup and loading path.

## PROSE.originalityNote.howThisDiffers

The known trip calculation becomes an assembly-only boot image. The learner connects source, ELF loading, explicit stack and storage setup, a callable arithmetic function and a checked serial report, then follows the same state in a debugger.

## PROSE.troubleshootingNoteSummary

If a command fails

## PROSE.troubleshootingNote

- **`command not found`:** check the spelling, including `aarch64-linux-gnu-`, and repeat the installation command in your Ubuntu terminal. These tools produce AArch64 code.
- **An assembler error:** read its reported source line. Check names, commas and operands against the downloaded file. Correct it and repeat assembly. Do not link after assembly fails.
- **An undefined name at link time:** include both `boot.o` and `trip_distance.o`, with `-T boot.ld`. The script supplies names such as `stack_top`.
- **No serial output:** use the exact QEMU system command above with `-nographic`. `qemu-aarch64` user mode cannot boot this machine image. Check that linking succeeded and that `boot.elf` is the new file.
- **An earlier edit still runs:** stop QEMU, assemble and link again, then start a new machine.
- **The terminal stays occupied:** this is expected after output. Press Ctrl-A, release it, then press X. The guest's waiting loop is not a failure to exit Linux.

## LABELS.title

Build and boot an assembly program

## LABELS.objectives.0

assemble and link an ARM64 boot image without C;

## LABELS.objectives.1

explain loading, the entry point, stack setup and storage initialisation;

## LABELS.objectives.2

run a bare-metal trip check through the serial device.

## LABELS.titles.question

What runs before the trip function?

## LABELS.titles.motivation

Source, tools and the emulated machine

## LABELS.titles.prediction

Predict the function result

## LABELS.titles.investigation

Assemble and place the boot image

## LABELS.titles.construction

Boot the assembly program

## LABELS.titles.failureExperiment

Buildable code with a wrong calculation

## LABELS.titles.explanation

Prepare the machine and send bytes

## LABELS.titles.generalisation

Loading, entry and firmware

## LABELS.titles.challenge

Repair the boot image’s trip function

## LABELS.titles.reflection

What you now know

## LABELS.captions.listing

The handwritten trip function used by the boot image.

## LABELS.captions.pipeline

Follow the files from assembly source through linking to the emulated machine.

## LABELS.captions.predict

Predict the result for the four labelled inputs.

## LABELS.captions.step

Follow the assembly function in the browser model.

## LABELS.captions.predictFailure

Predict the modified function before inspecting its output.

## LABELS.captions.stepFailure

Find the arithmetic effect of the changed instruction.

## LABELS.captions.final

Repair the function, then rebuild the boot image.

## LABELS.options.prediction.0.value

232

## LABELS.options.prediction.0.label

232

## LABELS.options.prediction.1.value

247

## LABELS.options.prediction.1.label

247

## LABELS.options.prediction.2.value

262

## LABELS.options.prediction.2.label

262

## LABELS.options.failure.0.value

232

## LABELS.options.failure.0.label

232

## LABELS.options.failure.1.value

247

## LABELS.options.failure.1.label

247

## LABELS.options.failure.2.value

262

## LABELS.options.failure.2.label

262

## LABELS.challenges.final.title

Repair trip_distance

## LABELS.challenges.final.tests.0

Subtract the trip correction

## LABELS.challenges.final.tests.1

Use a different set of distances

## LABELS.challenges.final.tests.2

Handle zero distances and correction

## LABELS.challenges.final.tests.3

Subtract a correction from zero

# Follow startup and debug the boot image

## PROSE.question

The boot image reports whether the trip check passed. **Can you follow the machine from its entry point to the first incorrect arithmetic result?**

Use the working `boot.elf` from the previous lesson. Restore the subtraction and rebuild if you left the deliberate error in place. You will inspect startup, instruction execution and the result saved in RAM.

## PROSE.motivation

A **debugger** inspects a running machine and controls when it stops. GDB is the GNU debugger. QEMU exposes a connection through which GDB controls the emulated processor. A **breakpoint** asks it to stop when execution reaches a chosen location.

Open two Linux terminals in the directory containing `boot.elf`. Terminal 1 will run QEMU. Terminal 2 will run GDB. Keep both open while stepping.

## PROSE.connection

In Terminal 1, boot with the processor paused and a debugger connection available:

```sh
qemu-system-aarch64 -M virt -cpu cortex-a53 -m 128M -nographic -kernel boot.elf -S -gdb tcp:127.0.0.1:1234
```

`-S` pauses the processor before it executes guest instructions. `-gdb` opens a debugger connection on this computer at `127.0.0.1`, its loopback address, and port 1234. A **port** is a numbered connection endpoint. The quiet terminal is expected while the processor is paused.

In Terminal 2, open this executable in GDB:

```sh
gdb-multiarch ./boot.elf
```

### Connect and inspect the entry point

At GDB's `(gdb)` prompt, enter this group:

```text
target remote 127.0.0.1:1234
info registers pc sp
x/i $pc
```

`target remote` connects GDB to QEMU. `info registers` prints the named registers. For this direct-loaded ELF, the initial program counter points at `_start`. The **program counter**, `pc`, holds the address of the next instruction. `x/i $pc` displays that instruction without executing it. GDB's `$pc` expression means the current value of the register.

Check the displayed instruction before continuing. The processor is still paused at entry; no guest instruction has run.

### Mark the storage before startup

```text
set {unsigned int}&result = 0xa5a5a5a5
x/1wx &result
```

The `set` command deliberately writes a test marker into the result storage. This is a debugger action before startup runs. `x/1wx &result` reads one four-byte value in hexadecimal, so you can check the marker. QEMU's ELF loader may already have supplied zeros; the marker lets you test the startup loop itself. Check that the displayed value matches the marker before continuing.

### Run to the prepared startup stop

```text
break boot_ready
continue
info registers pc sp
x/1gx &result
```

`break boot_ready` selects the stop after stack setup and `.bss` clearing. `continue` lets startup run to that stop. Compare `sp` with `stack_top` in the recorded startup figure below. `x/1gx &result` displays one eight-byte value in hexadecimal at `result`; it is zero after clearing.

Select the prepared-startup stop in the recording and compare it with your terminal before proceeding. The recording is a reference, not the machine GDB controls.

## PROSE.functionInputs

### Run to the function inputs

```text
break trip_distance
continue
info registers x0 x1 x2 x3 pc
x/i $pc
```

This breakpoint stops at `trip_distance`, after startup supplies its arguments. Check the four inputs and the next instruction before stepping. Do not use GDB's `run` command for this remote connection: QEMU has already loaded the machine, and `continue` resumes it.

## PROSE.prediction

At the function breakpoint, the low 32 bits hold the four inputs:

- `x0`: 120.
- `x1`: 85.
- `x2`: 42.
- `x3`: 15.

The next instruction is `add w0, w0, w1`. GDB’s `stepi` command executes one machine instruction.

## PROSE.predictionQuestion

**What value will the low 32 bits of `x0` hold after one `stepi`?**

## PROSE.predictionExplain

They will hold 205. The instruction adds 120 and 85 into `w0`. A write to `w0` also clears the upper 32 bits of `x0`. The other argument registers are not written by this instruction.

## PROSE.investigation

Enter one instruction step in GDB, then inspect the result and next instruction:

```text
stepi
info registers x0 x1 x2 x3 pc
x/i $pc
```

Repeat this group through the two additions, subtraction and `ret`. Use instruction stepping here; GDB's `step` follows source-level rules and need not stop after each instruction.

Compare each stop with the browser model and the recorded GDB stops below. The recording does not control your QEMU machine; use GDB in the terminal to step that machine. GDB prints the 64-bit `x` views. This function calculates with their low 32-bit `w` views. The assembly caller explicitly supplies the inputs; later writes follow the executed instruction.

Before `ret`, the program counter points at `ret`. After it, the program counter points at `after_trip`, back in the assembly caller. The `bl` instruction supplied that return address in `x30`. Returning does not write a new value into `w0`.

## PROSE.construction

Stop after the caller has stored the result and written its serial message:

```text
break halt
continue
x/1wd &result
info registers pc sp
```

`x/1wd &result` displays one four-byte value as signed decimal. Compare the saved value with the function's returned `w0`. The caller stored it before the UART routine reused registers. Terminal 1 now shows the check's serial line.

To close this session, enter in GDB:

```text
detach
quit
```

`detach` releases the target and lets it resume. It remains in its waiting loop. In Terminal 1, press Ctrl-A, release it, then press X to stop QEMU. If GDB is still running when you need to stop, press Ctrl-C there before entering the detach commands.

Close the old QEMU session before starting another on port 1234. If the port is already in use, finish the previous session in both terminals.

## PROSE.failureExperiment

Change the third arithmetic instruction in `trip_distance.s` to `add w0, w0, w3`. Assemble and link again, then start a fresh QEMU and GDB session with the same commands. Stop at `trip_distance` and compare after each `stepi`.

The first two instructions and their inputs are unchanged. Predict the first differing stop before opening the recorded comparison.

## PROSE.failureQuestion

**After which arithmetic instruction do the correct and modified functions first leave different values in `w0`?**

## PROSE.failureExplain

They first differ after the third arithmetic instruction. Both runs reach 247 after the second addition. The subtraction leaves 232; the modified addition leaves 262. The result is already wrong before `ret`. The debugger locates the first incorrect write, before the caller stores it or chooses a message.

## PROSE.explanation

The boot image contains two kinds of work. The trip function transforms register bits. Its caller provides inputs, saves the answer and talks to the device. GDB can inspect both, but the browser model computes only the supported arithmetic function.

A passing serial report depends on the whole path: loading at the linked addresses, reaching startup, preparing memory, calling the function and reaching the UART. A missing line alone cannot identify which part failed. In a fresh paused session, inspect the initial `_start` stop. Then set breakpoints at `boot_ready`, `trip_distance`, `after_trip` and `halt` to narrow that path.

The initialised marker in `.data` provides another check. At a stop, enter:

```text
x/1wx &initialized_marker
```

`x/1wx` reads one four-byte value in hexadecimal. The value comes from bytes loaded from the ELF file. The zeroed result region and reserved stack serve different purposes: our startup clears `.bss`, and it sets `sp` to the stack's upper boundary. Loading bytes, preparing working storage and choosing the first instruction are separate steps.

## PROSE.generalisation

A loader places the program in memory and transfers control to it. Our chosen loader is QEMU's direct ELF loading path. Startup then prepares the assumptions that the rest of our program needs. Calling a function happens later, after startup has supplied arguments and a return address.

Changing the execution environment changes those responsibilities. A Linux process receives memory and services from an operating system. Firmware can instead load a program on a physical machine after board setup. A device's address, available services and entry conditions belong to that environment; the arithmetic meaning of `add` does not change.

This image deliberately supports one processor and polls one UART. It does not install interrupt handlers, translate program addresses into different physical addresses or implement an operating system. Those require additional startup code and system-specific knowledge. The next program you boot must state its entry conditions as explicitly as this one.

## PROSE.bareMetalNoteSummary

Optional: compare with a Linux entry point

## PROSE.bareMetalNote

The source bundle also contains [standalone.s](native/standalone.s), an assembly-only Linux example, and an optional C caller for the trip function. These are different execution environments from the boot image.

The Linux example asks an operating system to write bytes and end a process. It uses `svc`, an instruction that transfers control through an exception. Linux defines the register convention that turns that transfer into a system-call request. The bare-metal image has no Linux kernel, so copying that request into `boot.s` would not provide Linux output or exit services.

No Linux or C example is needed to build, boot or debug the core image. Use the assembler, linker and system-mode QEMU commands above for this capstone.

## PROSE.finalTask

Revise `trip_distance` to subtract the correction twice. Signed 32-bit inputs arrive in registers:

- The first distance in `w0`.
- The second distance in `w1`.
- The third distance in `w2`.
- The correction in `w3`.

Return the sum of the three distances minus twice the correction in `w0`, then return normally. The supplied inputs and intermediate values fit in signed 32 bits.

First inspect the original single-correction function in GDB. Restore it in `trip_distance.s`, rebuild `boot.elf` and follow one call through the subtraction. Identify the instruction that writes the result and compare its calculation with the revised contract. Close the session before rebuilding.

Now implement the revision in the browser and pass its tests. Copy the function body into `trip_distance.s`, keeping the label and surrounding directives. Use the assembly-only test caller [verify-boot.s](native/verify-boot.s) for the revised contract:

```sh
aarch64-linux-gnu-as -g trip_distance.s -o trip_distance.o
aarch64-linux-gnu-as -g verify-boot.s -o verify-boot.o
aarch64-linux-gnu-ld -T boot.ld verify-boot.o trip_distance.o -o challenge.elf
qemu-system-aarch64 -M virt -cpu cortex-a53 -m 128M -nographic -kernel challenge.elf
```

`verify-boot.s` uses `.set CHALLENGE, 1` to define the assembly-time selection, and `.include` to read `boot.s`. This selects the four-case caller inside that source. Its `.word` rows hold each case’s four inputs and expected result. Keep `boot.s` beside it. The tests use the same inputs and expected results as the browser. A passing run reports `4 cases passed`; a failure reports `Assembly Lab: trip check failed`. Stop QEMU with Ctrl-A, then X after reading the line.

The test checks behaviour rather than a particular instruction sequence. To debug a failure, use the same two-terminal commands with `challenge.elf` in both terminals, and break at `trip_distance`. Each call receives one test case.

The ordinary `boot.elf` caller still checks the original single-correction contract. Use `challenge.elf` to test the revision.

## PROSE.finalHints.0

Keep track of the three distance inputs and the correction separately.

## PROSE.finalHints.1

The revised contract applies the same correction twice. A function that passes the earlier lesson still needs a change.

## PROSE.finalHints.2

For distances 7, 9 and 4 with correction 2, the revised result is 16.

## PROSE.finalHints.3

You can subtract the correction twice, or form twice its value and subtract that.

## PROSE.finalHints.4

One solution adds w1 and w2 into w0, subtracts w3 twice, then executes ret.

## PROSE.reflection

- GDB can stop at the image's entry and inspect startup before the function runs.
- A breakpoint selects a location; `stepi` executes one instruction.
- The program counter identifies the next instruction, not the instruction that just ran.
- `ret` returns to our assembly caller; it does not finish the machine's execution.
- ELF loading, startup and device output are distinct parts of a bootable program.

Which parts of this boot path would you need to check before moving the program to a physical Arm board?

## PROSE.reflectionNoteSummary

Answer

## PROSE.reflectionNote

Check the board's reset and firmware handoff, the way it loads an image, available RAM, entry address and processor state. Check stack and storage setup, the UART's address and its clock and configuration requirements. The trip function's instruction meanings carry across; this QEMU machine's memory map and loading path are not a board specification.


## PROSE.originalityNote.textbookExample

An isolated debugger tour followed by an unrelated bare-metal greeting.

## PROSE.originalityNote.howThisDiffers

The learner inspects the same assembly-only boot image from entry through storage setup, the familiar function, its first divergence and serial reporting. A revised arithmetic contract is checked by browser tests and a bootable assembly test caller.

## LABELS.title

Follow startup and debug the boot image

## LABELS.objectives.0

inspect the entry point, prepared stack and zeroed storage in GDB;

## LABELS.objectives.1

compare booted instruction stops with the browser model;

## LABELS.objectives.2

locate a wrong result and check a revised assembly function.

## LABELS.titles.question

Where does the booted calculation first go wrong?

## LABELS.titles.motivation

Stop startup with GDB

## LABELS.titles.prediction

Execute one instruction

## LABELS.titles.investigation

Compare registers and the next instruction

## LABELS.titles.construction

Inspect the saved result and close the session

## LABELS.titles.failureExperiment

Locate the first differing stop

## LABELS.titles.explanation

Separate loading, startup and calculation

## LABELS.titles.generalisation

Check the environment’s entry conditions

## LABELS.titles.challenge

Apply the correction twice

## LABELS.titles.reflection

What you now know

## LABELS.captions.predict

Predict the low 32 bits after the first addition.

## LABELS.captions.trace

Compare a browser-model stop with the recorded GDB stop.

## LABELS.captions.step

Step the familiar arithmetic function.

## LABELS.captions.predictFailure

Identify the first differing arithmetic result.

## LABELS.captions.stepFailure

Compare recorded and modelled stops for the modified function. Use the original figure above to find where their results diverge from the original function.

## LABELS.captions.final

Check the revised function in the browser and a bootable assembly test image.

## LABELS.options.prediction.0.value

120

## LABELS.options.prediction.0.label

120

## LABELS.options.prediction.1.value

205

## LABELS.options.prediction.1.label

205

## LABELS.options.prediction.2.value

247

## LABELS.options.prediction.2.label

247

## LABELS.options.failure.0.value

1

## LABELS.options.failure.0.label

After the first arithmetic instruction

## LABELS.options.failure.1.value

2

## LABELS.options.failure.1.label

After the second arithmetic instruction

## LABELS.options.failure.2.value

3

## LABELS.options.failure.2.label

After the third arithmetic instruction

## LABELS.challenges.final.title

Subtract the correction twice

## LABELS.challenges.final.tests.0

Apply both trip corrections

## LABELS.challenges.final.tests.1

Use a different set of distances

## LABELS.challenges.final.tests.2

Handle all zero inputs

## LABELS.challenges.final.tests.3

Return a negative corrected value

## LABELS.native.recorded

Recorded GNU/QEMU/GDB run

## LABELS.native.browser

Browser model

## LABELS.native.next

Next instruction

## LABELS.native.ran

Instruction just executed

## LABELS.native.before

At the function breakpoint

## LABELS.native.after

After the instruction

## LABELS.native.notLive

This page steps a recording. Use GDB in your terminal to inspect the machine you boot.

## LABELS.native.pcOffset

PC relative to the function entry

## LABELS.native.returned

Returned to the assembly caller

## LABELS.native.good

Original function

## LABELS.native.broken

Modified third instruction

## LABELS.native.sources

Source files

## LABELS.native.objects

Object files

## LABELS.native.link

Linked ELF executable

## LABELS.native.execute

QEMU system mode

## LABELS.native.process

Booted bare-metal program

## LABELS.native.copy

Copy commands

## LABELS.native.copied

Commands copied

## LABELS.native.pipeline.0.name

Assembly sources

## LABELS.native.pipeline.0.detail

boot.s supplies startup and output; trip_distance.s supplies the calculation

## LABELS.native.pipeline.1.name

Object files

## LABELS.native.pipeline.1.detail

GNU as translates each source file into machine code and references

## LABELS.native.pipeline.2.name

Linker and memory layout

## LABELS.native.pipeline.2.detail

GNU ld joins the objects using boot.ld and chooses _start as the entry

## LABELS.native.pipeline.3.name

ELF boot image

## LABELS.native.pipeline.3.detail

boot.elf contains code, data and segment loading information

## LABELS.native.pipeline.4.name

QEMU direct ELF load

## LABELS.native.pipeline.4.detail

QEMU loads the segments into RAM and starts at the recorded ELF entry

## LABELS.native.pipeline.5.name

Startup and the program

## LABELS.native.pipeline.5.detail

Startup prepares the stack and storage; the caller checks the trip and writes UART bytes

## LABELS.native.model

Browser model

## LABELS.native.stepEntries.0

At the function breakpoint

## LABELS.native.stepEntries.1

After the first addition

## LABELS.native.stepEntries.2

After the second addition

## LABELS.native.stepEntries.3

After the third arithmetic instruction

## LABELS.native.stepEntries.4

After returning to the assembly caller

## LABELS.native.previous

Previous stop

## LABELS.native.nextStop

Next stop

## LABELS.native.reset

Reset comparison

## LABELS.native.correct

Original function

## LABELS.native.registers

Register values at this stop

## LABELS.native.returnToMain

Returned to the assembly caller

## LABELS.native.recordedNote

The native values are the low 32 bits of the recorded x registers. The browser values come from its instruction model.

## LABELS.native.stops.0

At the function breakpoint

## LABELS.native.stops.1

After the first addition

## LABELS.native.stops.2

After the second addition

## LABELS.native.stops.3

After the third arithmetic instruction

## LABELS.native.stops.4

After returning to the assembly caller

## LABELS.native.pc

Program counter relative to trip_distance

## LABELS.native.referenceRun

Reference run

## LABELS.native.referenceEnvironment

Reference environment

## LABELS.native.versions

Tool versions

## LABELS.native.boot.title

Recorded loading and startup

## LABELS.native.boot.recordedNote

These states were recorded with GNU tools, QEMU and GDB, a debugger that inspects a running machine and controls when it stops. At the entry stop, the verifier deliberately wrote 0xa5a5a5a5 to result with GDB. Startup then cleared it. The marker demonstrates the zeroing loop; it is not a claim that QEMU left uninitialised garbage. The diagram is a recording, not a machine running in this page.

## LABELS.native.boot.pc

Next instruction address (PC)

## LABELS.native.boot.sp

Stack pointer (SP)

## LABELS.native.boot.result

Stored result (32-bit word)

## LABELS.native.boot.memory

Selected address ranges on QEMU virt

## LABELS.native.boot.rangeNote

Ranges are ordered by address and are not drawn to scale. Each end address is exclusive. The code range contains instructions; the image also includes message bytes and initialised data.

## LABELS.native.boot.stops.0

At _start, after GDB writes the test marker

## LABELS.native.boot.stops.1

At boot_ready, after stack setup and storage clearing

## LABELS.native.boot.stops.2

At halt, after saving the trip result and sending its report

## LABELS.native.boot.regions.code

Program instructions in RAM

## LABELS.native.boot.regions.bss

Zero-initialised result storage

## LABELS.native.boot.regions.stack

Reserved stack space

## LABELS.native.boot.regions.uart

PL011 UART device registers

# Native diagrams

## NATIVE_DIAGRAM_LABELS.flow.title

From image loading to serial output

## NATIVE_DIAGRAM_LABELS.flow.note

This control-flow schematic uses selected recorded instruction addresses. Select a stage to inspect its role; selecting does not execute instructions.

## NATIVE_DIAGRAM_LABELS.flow.qemuTitle

This QEMU command: direct ELF boot

## NATIVE_DIAGRAM_LABELS.flow.boardTitle

Physical board: one possible boot chain

## NATIVE_DIAGRAM_LABELS.flow.boardNote

This board-dependent example groups firmware stages described by Trusted Firmware-A. The board defines its handoff convention and accepted image formats. These firmware stages do not run in our QEMU experiment.

## NATIVE_DIAGRAM_LABELS.flow.controlArrow

Transfers control

## NATIVE_DIAGRAM_LABELS.flow.loadArrow

Loads file bytes into RAM

## NATIVE_DIAGRAM_LABELS.flow.entry

ELF entry point

## NATIVE_DIAGRAM_LABELS.flow.host

Host: QEMU loading

## NATIVE_DIAGRAM_LABELS.flow.guest

Guest: our instructions

## NATIVE_DIAGRAM_LABELS.flow.nodes.0.id

loader

## NATIVE_DIAGRAM_LABELS.flow.nodes.0.title

QEMU loads boot.elf

## NATIVE_DIAGRAM_LABELS.flow.nodes.0.actor

Host: QEMU loading

## NATIVE_DIAGRAM_LABELS.flow.nodes.0.detail

The host reads the ELF load segments, places their contents in emulated RAM and sets the processor’s first instruction address to the ELF entry.

## NATIVE_DIAGRAM_LABELS.flow.nodes.1.id

entry

## NATIVE_DIAGRAM_LABELS.flow.nodes.1.title

_start

## NATIVE_DIAGRAM_LABELS.flow.nodes.1.actor

Guest: our startup

## NATIVE_DIAGRAM_LABELS.flow.nodes.1.detail

The processor begins our code at the linked entry point. No guest BIOS, UEFI or boot stub runs before it in this direct ELF path.

## NATIVE_DIAGRAM_LABELS.flow.nodes.2.id

startup

## NATIVE_DIAGRAM_LABELS.flow.nodes.2.title

boot_ready

## NATIVE_DIAGRAM_LABELS.flow.nodes.2.actor

Guest: our startup

## NATIVE_DIAGRAM_LABELS.flow.nodes.2.detail

Startup has set the stack pointer and cleared .bss. The caller supplies the trip inputs before calling the function.

## NATIVE_DIAGRAM_LABELS.flow.nodes.3.id

trip

## NATIVE_DIAGRAM_LABELS.flow.nodes.3.title

trip_distance

## NATIVE_DIAGRAM_LABELS.flow.nodes.3.actor

Guest: our function

## NATIVE_DIAGRAM_LABELS.flow.nodes.3.detail

bl supplies a return address. The function calculates in registers, then ret transfers control back to after_trip.

## NATIVE_DIAGRAM_LABELS.flow.nodes.4.id

result

## NATIVE_DIAGRAM_LABELS.flow.nodes.4.title

after_trip

## NATIVE_DIAGRAM_LABELS.flow.nodes.4.actor

Guest: our caller

## NATIVE_DIAGRAM_LABELS.flow.nodes.4.detail

The caller stores the returned value in result, compares it with the expected answer and selects the report’s message.

## NATIVE_DIAGRAM_LABELS.flow.nodes.5.id

uart

## NATIVE_DIAGRAM_LABELS.flow.nodes.5.title

uart_puts

## NATIVE_DIAGRAM_LABELS.flow.nodes.5.actor

Guest: our output routine

## NATIVE_DIAGRAM_LABELS.flow.nodes.5.detail

The routine saves its return address on the stack, writes message bytes to the UART device and returns to its caller.

## NATIVE_DIAGRAM_LABELS.flow.nodes.6.id

halt

## NATIVE_DIAGRAM_LABELS.flow.nodes.6.title

halt

## NATIVE_DIAGRAM_LABELS.flow.nodes.6.actor

Guest: our waiting loop

## NATIVE_DIAGRAM_LABELS.flow.nodes.6.detail

Execution remains in the wfi and branch loop. Leaving QEMU is a host action; our program does not request a Linux process exit.

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.0.id

rom

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.0.title

ROM and platform firmware

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.0.actor

Board startup software

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.0.detail

Reset reaches the board’s first code. Firmware stages prepare hardware and arrange the handoff to later boot software.

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.1.id

loader

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.1.title

Later loader, for example UEFI

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.1.actor

Firmware or bootloader

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.1.detail

A loader places the selected next program in memory and transfers control according to that system’s handoff convention.

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.2.id

program

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.2.title

Selected next program

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.2.actor

Program instructions

## NATIVE_DIAGRAM_LABELS.flow.boardNodes.2.detail

The program begins with the memory and processor state promised by that board’s handoff. It must use an image format the loader accepts.

## NATIVE_DIAGRAM_LABELS.memory.title

From ELF file contents to memory

## NATIVE_DIAGRAM_LABELS.memory.note

Select a section to follow the same contents from the file to the machine’s address space. The addresses and byte counts come from the checked boot.elf build. The figure shows selected regions, not every byte of the file or all of RAM.

## NATIVE_DIAGRAM_LABELS.memory.file

File: boot.elf

## NATIVE_DIAGRAM_LABELS.memory.segments

ELF load segments

## NATIVE_DIAGRAM_LABELS.memory.segmentFile

Stored file bytes

## NATIVE_DIAGRAM_LABELS.memory.segmentMemory

Memory bytes

## NATIVE_DIAGRAM_LABELS.memory.stackSave

Recorded UART stack frame

## NATIVE_DIAGRAM_LABELS.memory.ram

RAM on QEMU virt

## NATIVE_DIAGRAM_LABELS.memory.fileOffset

Offset in the file

## NATIVE_DIAGRAM_LABELS.memory.loadAddress

Address in memory

## NATIVE_DIAGRAM_LABELS.memory.bytes

bytes

## NATIVE_DIAGRAM_LABELS.memory.notStored

No section bytes stored in the file

## NATIVE_DIAGRAM_LABELS.memory.load

Load these bytes

## NATIVE_DIAGRAM_LABELS.memory.reserve

Reserve memory; no section bytes to copy

## NATIVE_DIAGRAM_LABELS.memory.bss

Startup explicitly clears .bss

## NATIVE_DIAGRAM_LABELS.memory.stack

Stack storage is reserved for calls

## NATIVE_DIAGRAM_LABELS.memory.uart

UART device

## NATIVE_DIAGRAM_LABELS.memory.select

Select a section

## NATIVE_DIAGRAM_LABELS.memory.rangeNote

Addresses increase down the rows. Each range’s end is exclusive. Rows are not drawn to scale: row height does not show byte count. Address gaps and file padding are omitted between the selected rows. Stack growth is shown separately.

## NATIVE_DIAGRAM_LABELS.memory.sectionDetails..text

Machine instructions stored in the image and loaded into RAM.

## NATIVE_DIAGRAM_LABELS.memory.sectionDetails..rodata

Fixed message bytes stored in the image and loaded into RAM.

## NATIVE_DIAGRAM_LABELS.memory.sectionDetails..data

Initialised writable bytes stored in the image and loaded into RAM.

## NATIVE_DIAGRAM_LABELS.memory.sectionDetails..bss

Result storage occupies memory without section bytes in the file. Our startup clears this region before use.

## NATIVE_DIAGRAM_LABELS.memory.sectionDetails..stack

Reserved stack space occupies memory without section bytes in the file. Startup sets sp to its aligned upper boundary.

## NATIVE_DIAGRAM_LABELS.memory.entry

Entry address: _start

## NATIVE_DIAGRAM_LABELS.memory.stackTop

Initial stack pointer: stack_top

## NATIVE_DIAGRAM_LABELS.memory.stackBefore

SP before the UART save

## NATIVE_DIAGRAM_LABELS.memory.stackAfter

SP after the UART save

## NATIVE_DIAGRAM_LABELS.memory.stackGrowth

The UART routine’s first save moves sp towards lower addresses and stores the frame pointer and return address in that stack frame. The displayed addresses come from the recorded run.

## NATIVE_DIAGRAM_LABELS.memory.uartNote

The UART’s device registers are outside RAM. No ELF section is loaded there. The running program sends bytes by storing to the device’s mapped addresses.

## NATIVE_DIAGRAM_LABELS.memory.segmentNote

The loader follows ELF LOAD segments, not the section names. The writable segment’s memory size exceeds its file size, so its extra memory is zero-filled when loaded. Our startup also explicitly clears .bss. Memory-only sections have no stored section bytes; a displayed ELF file-offset field does not give them file contents.
