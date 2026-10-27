# Where next? Canonical prose

Copyright © 2026 Christopher Snow

Separate draft from the course prerequisites, the checked starter and the external project’s documentation. Each heading identifies the exported string used by the page or its discovery links.

## title

Where next?

## linkLabel

Where next?

## directoryText

Take a familiar function into your own project, or continue with native tools and a physical board.

## afterCalls

For an optional project using these call rules, see [Where next?](#/where-next).

## lead

Choose a small program you want to build and an environment in which to test it. These are optional routes for independent practice.

## preparation.prose

You can try the playground route after [Calls and returns](#/lesson/calls-and-returns) in Module 9. You need its rules for calling another function and preserving the return address. The GNU/QEMU and Raspberry Pi lessons can follow separately.

## playground.title

Take a familiar function into a playground

## playground.prose

[AArch64 Playground](https://aarch64-playground.com/playground) gives you an editor and debugger for your own assembly programs. You can inspect registers, stack and memory, set breakpoints and step backwards. A breakpoint pauses a run at an instruction you choose. Start with the trip calculation you already know, so you can concentrate on the new workspace.

Assembly Lab’s offline save includes this page and starter. Prepare the playground’s own offline options separately.

## playground.beforeCode

The playground starts this program at `main`, with a prepared stack and a return destination. Our supplied caller saves that return address before calling `trip_distance`, then restores it before returning, as in Module 9.

The lines beginning with a dot are **directives** for the tool preparing the program. They do not execute on the processor. `.text` begins a group of instructions. `.global main` exposes the function name `main`, which the playground uses to find where to start.

## playground.caption

The familiar trip function with an assembly caller for the playground.

## playground.downloadLabel

Download the playground starter

## playground.openLabel

Open AArch64 Playground in a new tab

## playground.steps.1

Open the playground in a new tab. If a welcome walkthrough opens, choose not now. Use the export menu to save any existing program, and record any existing checks before importing: the export does not carry those checks. On a phone, import and export are in the top menu.

## playground.steps.2

Download the starter from this page. In the playground, press import, choose that file and confirm replacing the current program. On a phone, close the menu and return to code.

## playground.steps.3

Press assemble. On a phone, use the bottom registers tab for values and code for stepping. Select dec for decimal values, then use step to follow main into trip_distance.

## playground.steps.4

After trip_distance returns, main's ldp runs next. Find X0 in the register list, scrolling back to it if needed. It should hold 232. Then press run to let main finish returning.

## playground.afterCode

The caller supplies the same trip inputs as the course example. The playground labels the full register `X0`; `w0` selects its lower 32 bits. The returned result here fits in those bits.

When `main` returns, its value becomes the program’s **exit status**, the number reported when the program finishes. Open the console tab: this starter deliberately returns the trip result, so `exit 232` is expected. It does not print the answer. Keep the saved return address and stack setup while experimenting.

## limits.prose

The playground runs its own emulator. Library calls such as `printf` are emulated, and the terminal's `gcc` command assembles assembly; it does not compile C. It runs user programs. Use the native paths below for board startup and code that talks directly to hardware devices. Instruction counts also do not measure real processor speed. Use [Arm’s instruction reference](https://support.arm.com/documentation/ddi0602/2026-09/Base-Instructions/ADD--shifted-register---Add-optionally-shifted-register-) and the GNU/QEMU tools in Module 12 to investigate unexpected instruction results. See the project's [documented limits](https://github.com/Abdalla-Eldoumani/aarch64-playground#what-it-does-not-do).

## extend.title

Build and check your own program

## extend.prose

The starter sets its trip inputs with `mov`. A check can supply text input and command-line arguments, values provided when a program starts. The starter reads neither, so those fields do not change its trip. First change the values loaded by `main`, predict the result, then assemble and step again.

To check the unchanged starter, open checks; on a phone, choose more, then checks. Press add check, leave arguments, input and expected output empty, set exit code (optional) to 232, then press run checks. The starter prints no output and returns that exit status.

For a program that reads input, make it read a trip and print its result. Use the playground’s [reference](https://aarch64-playground.com/reference) to learn the library-call conventions. Once your code reads input, write checks for several inputs and their expected printed outputs in the checks tab. If you add printing while keeping its inputs fixed, begin with one check of the printed output.

Save your program and record your checks before leaving or reloading: the check entries are temporary.

## routes.title

Choose the environment for your goal

## routes.prose

- **Write and debug your own programs:** keep using the playground. You can choose projects without repeating its lesson sequence.
- **Use real assembler and debugger tools:** continue with [Running ARM64 outside Assembly Lab](#/lesson/from-function-to-executable) in Module 12. Build the assembly image and inspect its execution with GNU tools and QEMU.
- **Boot a physical board:** follow [Running on Raspberry Pi 5](#/lesson/raspberry-pi-5) in Module 13. Check the Pi 5 and Debug Probe prerequisites first; physical verification remains pending until the hardware test is completed.
