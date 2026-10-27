# Where next: checked starter and playground facts

Copyright © 2026 Christopher Snow

Checked 27 October 2026. This is an optional transfer into independent user-program experiments,
not another processor model in Assembly Lab. No external project source code is vendored.
The starter is the course's own plain-assembly caller around its existing trip function.

## Project sources and scope

Read [the project's README](https://github.com/Abdalla-Eldoumani/aarch64-playground/blob/4f58407de46d8ca27ee41911366a2616b8e490bc/README.md),
source revision `4f58407de46d8ca27ee41911366a2616b8e490bc`, and its current live playground.
The README documents an in-browser Rust/WebAssembly interpreter, registers/stack/memory,
forward/back stepping, breakpoints, learner-written checks, simulated library calls and a
virtual filesystem. Its terminal's `gcc` assembles; it is not a C compiler. System registers
and real board boot/device behaviour are outside that runtime. These qualifications distinguish
it from the course's actual GNU/QEMU and Pi work. The project remains independently maintained;
its current UI and supported subset may change.

For exact UI behaviour, also read the project sources at that revision:

- `web/components/playground/ImportExport.tsx` and `use-workspace-import.ts`: normal source-file
  import uses a confirmation before replacing existing main code, and a file defining main is
  identified as the main program even when its filename is different. Export/save existing work
  before replacement. The accepted filename suffixes include `.s`.
- `web/components/playground/ChecksPanel.tsx`: checks compare expected output and an optional
  exit code; source fields are `stdin` and command-line `args`, not arbitrary function-register
  inputs. The expected-output field can be empty. Checks are ephemeral; preserve their settings
  before leaving or replacing the program, as the README warns.
- `web/lib/playground/share.ts`: share links use a project-specific compressed payload and
  checksum. This page uses download/import, avoiding a copied or unverified link codec.

These are source observations, not a claim that the external assembler or interpreter is a
real GNU toolchain, Linux kernel, libc implementation or physical processor.

## Our complete starter

`content/where-next.example.ts` exports `PLAYGROUND_STARTER` (complete text),
`PLAYGROUND_PROGRAM` (the same instruction/label sequence without GNU directives, for the course
model) and `PLAYGROUND_CALL` (main with no supplied arguments). The public file is
`examples/trip-playground.s`. The GNU/QEMU corpus holds identical source bytes.

The caller main saves x29/x30 in an aligned 16-byte frame, supplies the familiar four arguments,
calls trip_distance, restores the frame and returns its prepared result. The trip function's
four instructions are unchanged from Module 12. `.text` selects instruction-section assembly;
`.global main` makes main visible by name to this program's runtime. These assembler directives
are not processor instructions. There is no macro preprocessor, C source or library call in
this starter.

The fixed MOV instructions supply all four inputs. Changing the playground's command-line
arguments or stdin cannot change this calculation unless the program is extended to read them.
One fixed regression check is useful now; multiple-input checks belong after such an extension.

## Executed model and GNU/QEMU facts

Before the trip calculation, the arguments are 120, 85, 42 and 15 in w0 through w3. The function
returns 232 in w0; w1 through w3 remain 85, 42 and 15 because these instructions do not write them.
The caller restores sp and x30 before main returns. This is a property of the actual supplied
program, not a general ABI guarantee about argument-register preservation.

- Facts test: **4 passed**, 3.84 seconds; `/tmp/where-next-starter-facts-final.log`.
- GNU/QEMU differential: **1 program, 1 call, 14 compared instruction states, zero differences**,
  0.1 seconds; `/tmp/where-next-starter-native.log`.

Command:

```sh
AL_TOOLS=/tmp/operand-addition-tools node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/real-tools/check.mjs --corpus --only where-next-trip
```

The compared states include the initial state; the source has thirteen executed instructions.
The external runtime additionally supplies its own return/exit handling, so its displayed step
count is not presented as this model's instruction count.

## Actual live-playground check

`/tmp/next-starter-external-final.mjs` ran the real public site at phone width 375 and desktop
width 1280. Both complete runs exited 0; `/tmp/next-starter-external-final.log` records boolean
observations and screenshots are `/tmp/next-starter-{375,1280}-{inputs,returned-trip,finished,check}.png`.

Both runs imported the actual `.s` file through its file chooser and accepted the visible
replacement confirmation. After assemble, choosing dec shows decimal register values. Stepping
into trip_distance shows the supplied inputs; after its arithmetic and RET, X0 shows 232 and X1
still shows 85. The value selected by w0 is the low 32 bits of X0. Running the remaining caller
returns to the playground's runtime. Its console shows **exit 232**, with no printed output.
This expected exit code comes from this starter returning its calculation as main's result;
it is not a printed answer or a hardware crash. The source contains no output call.

Exact current control paths:

- Desktop: import, assemble, step/run, dec in the register pane, console and checks tabs.
- Phone: top menu exposes import; after the import close that menu and use the bottom code,
  registers and console tabs. dec is in registers. The bottom more tab exposes a checks button.
- Optional welcome walkthrough: not now dismisses it.

A real fixed-program check passed at both widths: open checks, choose add check, leave args,
stdin and expected output empty, set exit code (optional) to 232, then run checks. The visible
result is **1 of 1 check passes**. This does not demonstrate different runtime input cases.
The page must not suggest typing different stdin/args values tests different trip distances
while those initial MOV instructions remain fixed.

## Earlier verification attempts

An initial direct file-input harness silently dismissed the browser's replacement confirmation,
so the default program remained loaded. Its run was not counted as starter evidence. A later
asserted normal-import attempt failed because of that same automatically dismissed confirmation.
Adding an explicit accept handler for the actual visible confirmation corrected the harness,
without altering the site or our starter. A separate plain paste run also assembled and returned
232, but Monaco auto-indented the pasted text; the final authoritative checks imported the
exact file bytes and verified both widths, including the fixed check. An immediate checks-tab
inspection initially preceded its lazy-loaded panel; the final script waits for add check.

A phone screenshot exposed another practical detail: the external site's default follow changes
setting can scroll the register list towards X30 after BL, leaving X0 through X3 above the
visible panel. The final rerun explicitly scrolled back to X0 and asserted the first values
visible before capturing it (`/tmp/next-starter-external-final-scrolled.log`, exit 0). The draft
was given that short scrolling instruction; no program or external site was altered.

No physical Arm processor or Pi was used. GNU/QEMU, the course model and the independent live
playground are separate verification environments. External-site availability is not a CI
requirement for the Assembly Lab page; the starter remains displayed and downloadable locally.
