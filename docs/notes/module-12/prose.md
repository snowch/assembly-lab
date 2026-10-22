# Module 12: Running ARM64 outside Assembly Lab (lesson text)

Drafted in a separate agent pass from the source brief and the existing Module 0 function. Native execution and review are recorded separately. This record contains each learner-facing string verbatim; keys are editorial markers.

# From a function to an executable

## PROSE.question

The four instructions from Module 0 can become a function in a Linux program. **What else must surround those instructions before you can run them outside this page?**

You will keep the same trip inputs and result. The new work is building a file that an execution environment can load.

## PROSE.motivation

A text file of instructions is **source**. An assembler translates it into machine instructions in an **object file**. A linker joins object files and resolves their references to names such as `trip_distance`. Its output here is an **executable**, a file prepared for loading and running.

The GNU tools below run on your Linux computer and produce AArch64 code. Producing code for another target is **cross-compilation**. QEMU user mode then executes that AArch64 Linux program by emulation. It forwards Linux requests to the host environment. It does not boot a guest Linux kernel, the operating system’s core that manages processes and provides their services.

## PROSE.setup

Use a Linux terminal, the window in which you enter commands and read their output. Each code block below contains commands to enter, without a prompt character. Run them in order. The checked reference environment is Ubuntu 24.04. On Windows, use an Ubuntu terminal in WSL2, the Windows facility for running Linux. These are Linux commands; they are not commands for PowerShell or a macOS terminal.

Install the tools first. `sudo` asks to run the package installation with administrator privileges. `apt-get update` refreshes the package list; `install` downloads and installs the named packages. This step needs a network connection.

```sh
sudo apt-get update
sudo apt-get install gcc-aarch64-linux-gnu binutils-aarch64-linux-gnu qemu-user gdb-multiarch file make unzip
```

[Download the complete source bundle](native/assembly-lab-native.zip). Save it in a folder where you can open a terminal. In that folder, extract the bundle with `unzip`, then change into its new directory with `cd`:

```sh
unzip assembly-lab-native.zip -d assembly-lab-native
cd assembly-lab-native
```

The [assembly function](native/trip_distance.s) and [C caller](native/main.c) are also available separately. Keep them in the same working directory. The other files in the bundle are used in the next lesson. Once installed and downloaded, this work needs no online compiler.

## PROSE.prediction

The downloaded `main.c` calls `trip_distance(120, 85, 42, 15)`. The function receives those four `int` arguments in `w0` to `w3`. Its two additions are followed by a subtraction and `ret`, as in Module 0.

## PROSE.predictionQuestion

**What signed value does the function return in `w0`?**

## PROSE.predictionExplain

It returns 232. The additions make 205, then 247; subtracting the correction leaves 232. `ret` transfers control to the caller without writing a new result to `w0`.

## PROSE.investigation

Build the C caller and the assembly function separately, then link them:

```sh
aarch64-linux-gnu-gcc -g -O0 -c main.c -o main.o
aarch64-linux-gnu-as -g trip_distance.s -o trip_distance.o
aarch64-linux-gnu-gcc -static -g -no-pie main.o trip_distance.o -o trip
```

The `-o` option names each output file. For GCC, `-c` stops after producing an object file. `-g` includes information that lets a debugger relate machine code to names and source lines. `-O0` asks GCC to disable most optimisation of the C caller. It does not rewrite the handwritten assembly function.

The final GCC command drives the linker and supplies the C startup code and libraries. `-static` includes the required library code in this executable, so the run needs no target shared-library installation. `-no-pie` requests an executable whose code does not need to be relocated to a different base address for each run. These settings make this small experiment easier to inspect.

The lines around the four instructions are directions to the assembler, called **directives**. The processor does not execute them. `.text` selects the code section, a group of related content in the object file. `.global` makes the function’s name available to the linker; `.type` identifies it as a function. `.p2align 2` aligns its start to a multiple of four bytes, and `.size` records its size. `.section` selects a named section; the final empty `.note.GNU-stack` section says this source needs no executable stack. Keep these lines and the `trip_distance:` label when editing the function’s instructions.

## PROSE.construction

Run the executable with QEMU user mode:

```sh
qemu-aarch64 ./trip
echo $?
```

`./trip` names the file in the current directory. `echo $?` prints the preceding command's exit status. A status of zero means success here.

Expected output for these files:

```text
trip_distance(120, 85, 42, 15) = 232
0
```

The C caller prints the assembly function's result with `printf`. It then returns zero if that result is 232, or one otherwise. The printed number and exit status are separate observations. The executable starts in C startup code, which eventually calls `main`; it does not start at `trip_distance`.

## PROSE.failureExperiment

In the browser experiment, the third instruction has been changed from `sub w0, w0, w3` to `add w0, w0, w3`. The same four inputs are used. The function still returns to its caller.

## PROSE.failureQuestion

**What signed value does this modified function return in `w0`?**

## PROSE.failureExplain

It returns 262. The first two additions still make 247, but the final addition increases it by 15. In the native caller, this result prints as 262 and makes the process exit with status one. The code builds and runs; the calculation is wrong.

## PROSE.explanation

The linker checks whether references can be resolved. It does not know whether the trip correction should be added or subtracted. QEMU executes either instruction. The C caller makes the intended result testable, so a wrong calculation can produce a clear failure.

To reproduce this failure outside the browser, edit only the third instruction in `trip_distance.s`. Repeat the assembly and link commands, then run `qemu-aarch64 ./trip` and `echo $?` again. Rebuilding matters: editing source does not alter an executable that already exists. Restore the subtraction and rebuild before the next lesson.

## PROSE.generalisation

The executable uses **ELF**, a file format that records machine code, data and instructions for loading them. Object files can use ELF too; an ELF file is not necessarily an executable. Inspect the files you just built:

```sh
file trip_distance.o trip
aarch64-linux-gnu-readelf -h trip
aarch64-linux-gnu-readelf -l trip
aarch64-linux-gnu-objdump -d --disassemble=trip_distance trip
```

`file` identifies the files. `readelf -h` reads the ELF header, including the target machine, byte order and entry address. `readelf -l` reads the loading information, including the segments placed in memory. In this build, the executable is 64-bit, little-endian AArch64 and statically linked. Its entry address belongs to startup code.

`objdump -d` translates machine instructions back into assembly text, a **disassembly**. `--disassemble=trip_distance` restricts the output to the named function. Check its two additions, subtraction and return. The executable contains much more code for startup and the C library; that code is outside this four-instruction function.

The executable file contains instructions and data. The running **process** also has live registers, a program counter, memory and operating-system resources. The next lesson inspects that live state.

## PROSE.finalTask

Repair `trip_distance`. Four signed `int` values arrive in `w0`, `w1`, `w2` and `w3`: three distances and a correction. Return the sum of the distances minus the correction in `w0`, then return to the caller. The supplied tests stay within the signed 32-bit range.

The tests check the returned values for several inputs. They do not require a particular spelling or instruction sequence. You can also put your function body into `trip_distance.s`, rebuild the native program and check its printed result and exit status.

## PROSE.finalHints

Follow the result through the three arithmetic instructions before changing anything.

The correction reduces the sum. Returning normally does not establish that the value is correct.

For distances 7, 9 and 4 with correction 2, the required result is 18.

Keep the accumulated result in w0 and subtract the correction before returning.

One solution is two additions into w0, followed by sub w0, w0, w3 and ret.

## PROSE.reflection

- An assembler produces an object file from assembly source.
- A linker joins object files and resolves their references.
- QEMU user mode executes this AArch64 Linux program.
- A printed result and an exit status provide different checks.
- Changing source requires a rebuild before the next run.

Which file must you rebuild after editing only `trip_distance.s`?

## PROSE.reflectionNoteSummary

Answer

## PROSE.reflectionNote

Assemble `trip_distance.s` again to replace `trip_distance.o`, then link again to replace `trip`. The existing `main.o` can be reused while `main.c` is unchanged.

## PROSE.modelVsReality

The browser executes its A64 instruction model. The terminal instructions build and run a Linux executable with GNU tools and QEMU user mode. QEMU is an emulator, so this is not a measurement from a physical Arm processor.

The handwritten function uses the same supported instructions in both environments. The native program also includes startup and C library code that the browser does not execute. The recorded tool output belongs to the reference build; addresses and formatting can differ with tool versions.

## PROSE.originalityNote.textbookExample

A first native assembly program that prints a greeting through a syscall.

## PROSE.originalityNote.howThisDiffers

The existing trip function first becomes a linked C-callable function. A controlled arithmetic error separates successful building and execution from passing a behavioural check.

## PROSE.troubleshootingNoteSummary

If a command fails

## PROSE.troubleshootingNote

- **`command not found`:** check the spelling, including `aarch64-linux-gnu-`. Repeat the installation command above in your Ubuntu terminal. These tools produce AArch64 code; your computer's ordinary `gcc` may target a different processor.
- **`Exec format error`:** use `qemu-aarch64 ./trip` to run this AArch64 executable. An x86 computer cannot execute its instructions directly.
- **A missing `/lib/ld-linux-aarch64.so.1`:** the executable needs an AArch64 shared-library loader. Repeat the link command with `-static`, then run the new `trip`. The static build avoids installing that target loader and its libraries.
- **An assembler error:** read the reported line in `trip_distance.s`. Check register names, commas and operands against the original file. Correct the source and repeat the assembly command. Do not link after assembly has failed.
- **Output from an earlier edit:** repeat the assembly and link commands. Editing the source does not change its object file or executable.

## LABELS.title

From a function to an executable

## LABELS.objectives

assemble and link the familiar trip function;

run an AArch64 Linux executable with QEMU;

check its result and inspect its machine code.

## LABELS.titles.question

What surrounds the four instructions?

## LABELS.titles.motivation

Build a program around the function

## LABELS.titles.prediction

Predict the function result

## LABELS.titles.investigation

Create objects and link the executable

## LABELS.titles.construction

Run the trip program

## LABELS.titles.failureExperiment

Buildable code with a wrong calculation

## LABELS.titles.explanation

Test behaviour after rebuilding

## LABELS.titles.generalisation

Inspect the executable

## LABELS.titles.challenge

Repair the native trip function

## LABELS.titles.reflection

What you now know

## LABELS.captions.listing

The familiar trip function, paired with its C calculation.

## LABELS.captions.pipeline

Follow the recorded build from source files to a running process.

## LABELS.captions.predict

Predict the result for the four labelled inputs.

## LABELS.captions.step

Follow the same function in the browser model.

## LABELS.captions.predictFailure

Predict the modified function before inspecting its output.

## LABELS.captions.stepFailure

Find the arithmetic effect of the changed instruction.

## LABELS.captions.final

Return the required result for each test case.

## LABELS.options.prediction

### value

232

### label

232

### value

247

### label

247

### value

262

### label

262

## LABELS.options.failure

### value

232

### label

232

### value

247

### label

247

### value

262

### label

262

## LABELS.challenges.final.title

Repair trip_distance

## LABELS.challenges.final.tests

Subtract the trip correction

Use a different set of distances

Handle zero distances and correction

Subtract a correction from zero

# Debug instructions and choose an execution environment

## PROSE.question

The native trip program prints one final answer. A debugger can stop it between instructions. **Can you find the first instruction at which a wrong calculation diverges from the browser model?**

Use the working `trip` executable from the previous lesson. Restore its subtraction and rebuild if you left the deliberate error in place.

## PROSE.motivation

A **debugger** inspects a running program and controls when it stops. GDB is the GNU debugger. QEMU can expose a connection through which GDB controls this emulated process. A **breakpoint** asks the debugger to stop when execution reaches a chosen location.

Open two terminals in the directory containing `trip`. Terminal 1 will run QEMU. Terminal 2 will run GDB. Keep both open while stepping.

## PROSE.connection

In Terminal 1, start QEMU with a debugger connection on port 1234. A port is a numbered endpoint for a connection.

```sh
qemu-aarch64 -g 1234 ./trip
```

A quiet terminal is expected: `-g 1234` makes QEMU wait for GDB. It has not reached the call or printed its result.

In Terminal 2, open the executable in GDB:

```sh
gdb-multiarch ./trip
```

At GDB's `(gdb)` prompt, enter:

```text
target remote localhost:1234
break trip_distance
continue
info registers x0 x1 x2 x3 pc
x/i $pc
```

`target remote` connects to the waiting QEMU process on this computer. `break trip_distance` sets a breakpoint at the function. `continue` lets startup and the C caller execute until that breakpoint. Do not use GDB's `run` command for this remote connection.

`info registers` prints the named registers. `pc` is the **program counter**, the address of the next instruction to execute. `x/i $pc` displays that instruction; it has not run yet. GDB's `$pc` expression means the current value of that register.

## PROSE.prediction

At the function breakpoint, the low 32 bits of `x0` to `x3` hold the four inputs: 120, 85, 42 and 15. The next instruction is `add w0, w0, w1`.

## PROSE.predictionQuestion

**What value will the low 32 bits of `x0` hold after one `stepi`?**

## PROSE.predictionExplain

They will hold 205. The instruction writes `w0`, adding 120 and 85. A write to `w0` also clears the upper 32 bits of `x0`. The other argument registers are not written by this instruction.

## PROSE.investigation

Enter one instruction step in GDB, then inspect the result and next instruction:

```text
stepi
info registers x0 x1 x2 x3 pc
x/i $pc
```

`stepi` executes one machine instruction. Repeat this group through the two additions, subtraction and `ret`. Use instruction stepping here; GDB's `step` follows source-level stepping rules and need not stop after each instruction.

Compare each stop with the browser trace and the recorded GDB stops below. GDB prints the 64-bit `x` views. The function uses the low 32-bit `w` views for its `int` arguments and result. The function's instructions determine later writes, but the calling convention does not generally promise zero in the upper bits of every incoming `int` argument.

Before `ret`, the program counter points at `ret`. After `ret`, it points back into the C caller. Returning does not write a new value into `w0`.

## PROSE.construction

Finish the process in GDB:

```text
continue
quit
```

Terminal 1 prints the trip result and returns to its shell. The remote connection closes when the process exits.

To stop an unfinished session, press Ctrl-C in GDB, then enter `kill` and confirm when GDB asks. Enter `quit` to leave GDB. If QEMU is still occupying Terminal 1, press Ctrl-C there too. Close the previous QEMU session before starting another on port 1234. If the port is already in use, check that both terminals from your previous attempt have finished.

## PROSE.failureExperiment

Change the third instruction to `add w0, w0, w3`, rebuild, and start a fresh QEMU and GDB session with the same commands. Stop at `trip_distance` and compare after each `stepi`.

The first two instructions and their inputs are unchanged. Predict the first differing stop before opening the recorded comparison.

## PROSE.failureQuestion

**After which arithmetic instruction do the correct and modified functions first leave different values in `w0`?**

## PROSE.failureExplain

They first differ after the third arithmetic instruction. Both runs reach 247 after the second addition. The correct subtraction then leaves 232; the modified addition leaves 262. The result is already wrong before `ret`. A debugger narrows the fault from a final output to a specific executed instruction.

## PROSE.explanation

A function return and a process exit have different jobs. `ret` returns to the address supplied by a caller. A Linux **system call** asks the operating system to perform a service, such as writing bytes or ending a process.

The downloaded [standalone source](native/standalone.s) starts at `_start`, an entry point selected explicitly by the linker. It has no C caller, `main` or C library. On AArch64 Linux, it places the syscall number in register 8 and enters the Linux kernel, the operating system’s core, with `svc #0`. The small numbers here are written with the 64-bit name `x8`; `w8` is its low 32-bit view. Syscall arguments use `x0` onwards, a separate convention from calling an ordinary function.

For the `write` syscall, number 64, this source sets `x0` to 1 for standard output, the program’s normal output destination, connected to your terminal here. It sets `x1` to the message address and `x2` to its byte count. For the `exit` syscall, number 93, it sets `x0` to the exit status. These numbers belong to AArch64 Linux, not to every machine that executes A64.

The `adr` instruction in this native source obtains a nearby label's address. `.ascii` stores the quoted message bytes; subtracting the two message labels gives their byte count. These assembly directives do not execute as instructions. The browser model does not execute this program's address calculation or `svc` instructions.

## PROSE.generalisation

Assemble and link the standalone Linux program, explicitly choosing `_start` as its entry point:

```sh
aarch64-linux-gnu-as -g standalone.s -o standalone.o
aarch64-linux-gnu-ld -e _start standalone.o -o standalone
qemu-aarch64 ./standalone
echo $?
```

Expected output for this fixed program:

```text
Assembly Lab: native ARM64
0
```

`ld` is the GNU linker; `-e _start` selects the first instruction for this executable. The source requests process exit after writing its message. `ret` cannot replace that request: this entry point has no caller-provided return address.

The example makes one write request. General output code must handle errors and writes that transfer only part of a buffer, a region of memory holding bytes to write; this short experiment does not implement that recovery.

## PROSE.bareMetalNoteSummary

Optional: run without Linux

## PROSE.bareMetalNote

This extension is not required to complete the core module. QEMU system mode emulates a whole machine. The downloaded [boot source](native/boot.s) writes to a serial device directly, without Linux services. A serial device sends bytes one after another; the PL011 UART is the device model used here. This experiment targets QEMU's `virt` machine, not a physical board.

Install the system emulator, then build the image:

```sh
sudo apt-get install qemu-system-arm
aarch64-linux-gnu-as -g boot.s -o boot.o
aarch64-linux-gnu-ld -T boot.ld boot.o -o boot.elf
aarch64-linux-gnu-readelf -h -l boot.elf
qemu-system-aarch64 -M virt -cpu cortex-a53 -m 128M -nographic -kernel boot.elf
```

The [linker script](native/boot.ld), selected by `-T`, places the program at `0x40080000` and selects `_start`. That address is inside this machine's RAM, its working memory. QEMU loads the ELF image and begins at its recorded entry; this skips a physical board's startup software. `-M virt` selects the machine, `-cpu cortex-a53` the emulated processor and `-m 128M` its RAM size. `-nographic` connects the serial console and the QEMU monitor, its control interface, to this terminal. `-kernel` supplies the image to load.

The expected serial line is:

```text
Assembly Lab: bare metal
```

The PL011 device begins at `0x09000000` on this QEMU machine. The program reads its flag register at offset `0x18`, testing bit 5, TXFF, before writing a byte to the data register at offset zero. TXFF means the transmit buffer is full. The polling loop waits while that bit is set. These are device addresses and flags; they are not Linux syscall registers.

QEMU output confirms this emulated path. It does not establish physical clock settings, serial transmission speeds or realistic buffer pressure on a board. After printing, the program waits in a loop. There is no Linux process exit. Press Ctrl-A, release it, then press X to leave QEMU. This escape works because QEMU shares this terminal between its serial console and control interface. It is a host action, not an instruction in the program.

## PROSE.finalTask

Write a revised `trip_distance` that subtracts the correction twice. Signed `int` inputs arrive in `w0` to `w3`: three distances and one correction. Return the three distances' sum minus twice the correction in `w0`, then return normally. The supplied inputs and intermediate values fit in signed 32 bits.

First inspect a known failing version. Keep the original single-correction function in `trip_distance.s`, restoring it if necessary. Build it with the revised task's test caller:

```sh
aarch64-linux-gnu-gcc -static -g -O0 -no-pie verify-challenge.c trip_distance.s -o challenge
qemu-aarch64 ./challenge
echo $?
```

The original function fails the first case because it follows the earlier contract. Before editing it, inspect that call in GDB. Close any earlier debugging session. In Terminal 1, start the test executable and wait for GDB:

```sh
qemu-aarch64 -g 1234 ./challenge
```

In Terminal 2, open that same executable:

```sh
gdb-multiarch ./challenge
```

At GDB's prompt, connect and stop at the first call:

```text
target remote localhost:1234
break trip_distance
continue
info registers x0 x1 x2 x3 pc
x/i $pc
```

Use `stepi` and `info registers x0 x1 x2 x3 pc` to follow the arithmetic through the correction. Identify which instruction writes the result register and explain how its value changes. Compare that calculation with the revised contract, then close the session using the earlier cleanup steps.

Now implement the revised function in the browser and pass its tests. Copy your function body into `trip_distance.s`, keeping the label and surrounding assembler directives. Repeat the build and run commands above to test the revision natively.

The [native test caller](native/verify-challenge.c) checks the same input/output contract as the browser tests. A passing run prints `4 cases passed` and exits with status zero. A failure names the case and shows its actual and expected result. The tests compare behaviour, so another instruction sequence can pass.

The earlier `main.c` still tests the original single-correction contract. Use `verify-challenge.c` for this revised function.

## PROSE.finalHints

Keep track of the three distance inputs and the correction separately.

The revised contract applies the same correction twice. A function that passes the earlier lesson still needs a change.

For distances 7, 9 and 4 with correction 2, the revised result is 16.

You can subtract the correction twice, or form twice its value and subtract that.

One solution adds w1 and w2 into w0, subtracts w3 twice, then executes ret.

## PROSE.reflection

- A breakpoint stops execution at a selected location.
- `stepi` executes one machine instruction; the program counter then identifies the next one.
- A controlled error can be located at the first differing register value.
- A Linux syscall requests an operating-system service.
- A standalone entry point needs an explicit way to end its process.

Which parts of the browser model helped you debug the native function, and which parts required the external tools?

## PROSE.reflectionNoteSummary

Answer

## PROSE.reflectionNote

The instruction order, register views and arithmetic results carry across. GNU tools create and inspect the executable; QEMU supplies its execution environment, and GDB controls the live process. Startup code, the C library and Linux services extend beyond the browser model.

## PROSE.modelVsReality

The comparison combines browser-model states with recorded stops from a real GNU/QEMU/GDB run. The recording is evidence of that reference run; stepping it on this page does not start a native process. Use the terminal commands to inspect your own process.

The syscall and optional UART sources are native-only experiments. The browser does not model a Linux kernel, syscall handling, devices or a complete computer. QEMU user mode and system mode provide different execution environments. Neither output is a measurement from physical Arm hardware.

## PROSE.originalityNote.textbookExample

An isolated debugger tour followed by an unrelated first bare-metal greeting.

## PROSE.originalityNote.howThisDiffers

A known trip function supplies matching browser and native instruction stops, a controlled first divergence and a revised behaviour checked by both environments. Syscall and optional UART experiments identify which execution environment provides each service.

## LABELS.title

Debug instructions and choose an execution environment

## LABELS.objectives

compare native instruction stops with the browser model;

find the first differing result in a controlled bug;

run a standalone Linux assembly program.

## LABELS.titles.question

Where does the native calculation first go wrong?

## LABELS.titles.motivation

Stop the live process with GDB

## LABELS.titles.prediction

Execute one instruction

## LABELS.titles.investigation

Compare registers and the next instruction

## LABELS.titles.construction

Finish and close the debugging session

## LABELS.titles.failureExperiment

Locate the first differing stop

## LABELS.titles.explanation

Request a Linux service

## LABELS.titles.generalisation

Start without the C runtime

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

Check the revised function with the same contract in both environments.

## LABELS.options.prediction

### value

120

### label

120

### value

205

### label

205

### value

247

### label

247

## LABELS.options.failure

### value

1

### label

After the first arithmetic instruction

### value

2

### label

After the second arithmetic instruction

### value

3

### label

After the third arithmetic instruction

## LABELS.challenges.final.title

Subtract the correction twice

## LABELS.challenges.final.tests

Apply both trip corrections

Use a different set of distances

Handle all zero inputs

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

This page steps a recording. Use GDB in your terminal to inspect a live process.

## LABELS.native.pcOffset

PC relative to the function entry

## LABELS.native.returned

Returned to the C caller

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

QEMU user mode

## LABELS.native.process

Running Linux process

## LABELS.native.copy

Copy commands

## LABELS.native.copied

Commands copied

## LABELS.native.pipeline

### name

Source

### detail

main.c and trip_distance.s

### name

Object files

### detail

GCC compiles C; GNU as assembles instructions

### name

Link

### detail

GNU tools join the function with startup code and the C library

### name

Executable file

### detail

The trip file contains machine code and loading information

### name

QEMU user mode

### detail

Emulates AArch64 instructions and forwards Linux requests

### name

Running program

### detail

Instructions execute using registers and memory

## LABELS.native.model

Browser model

## LABELS.native.stepEntries

At the function breakpoint

After the first addition

After the second addition

After the third arithmetic instruction

After returning to the C caller

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

Returned to the C caller

## LABELS.native.recordedNote

The native values are the low 32 bits of the recorded x registers. The browser values come from its instruction model.

## LABELS.native.stops

At the function breakpoint

After the first addition

After the second addition

After the third arithmetic instruction

After returning to the C caller

## LABELS.native.pc

Program counter relative to trip_distance

## LABELS.native.referenceRun

Reference run

## LABELS.native.referenceEnvironment

Reference environment

## LABELS.native.versions

Tool versions
