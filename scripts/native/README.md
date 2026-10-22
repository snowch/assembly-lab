# Native Module 12 verification

Copyright © 2026 Christopher Snow

`npm run check:native` (or `python3 scripts/native/check.py`) checks the actual public download
sources. The separate Ubuntu 24.04 CI job installs GNU binutils, QEMU system/user mode, GDB,
`file` and Python. No C compiler is required for the boot capstone or its native verifier.

The script assembles `boot.s` and `trip_distance.s`, links both with `boot.ld`, checks the ELF
entry/loadable segments and disassembles the function. In system QEMU it connects GDB to the
CPU paused at reset, checks that this direct-loaded ELF starts at its entry, poisons the BSS
result before startup, and confirms startup clears it and sets an aligned stack. A loaded
`.data` value is checked separately. Five real GDB stops in the original and deliberately
broken functions agree with the browser arithmetic; `ret` returns to assembly label `after_trip`.
The stored232/262 values and different serial reports are both checked.

Figure evidence also records the actual ELF section and PT_LOAD segment metadata. A standard-library
ELF64 parser checks allocated section types, file bounds, segment coverage and byte-offset mappings;
NOBITS sections record zero stored bytes. Selected GDB PCs establish entry, startup-ready, call,
return, UART-helper entry and final wait order. A single step of the helper's first `stp` records
its actual downward stack movement; the final stop checks restoration. These data support labelled
schematics, not a complete instruction trace. See `docs/notes/module-12/figure-facts.md`.

The assembly-only `verify-boot.s` harness checks the same four revised-contract tuples as the
browser. Two different correct instruction sequences pass; the unchanged original fails.
The verifier also builds/runs the optional standalone Linux assembly source. The old C files
remain optional comparison sources, but the core build, exercises and verification do not use them.

UART checks read the serial line, then send the documented Ctrl-A X console escape and check
that the emulator closes cleanly. This is a host action, not guest process exit. No check claims
physical UART clocks, baud accuracy or realistic FIFO pressure. The selected direct ELF path
has no guest BIOS, firmware image or boot stub before `_start`; physical board differences and
checked sources are recorded in `docs/notes/module-12/boot-facts.md`.

`python3 scripts/native/check.py --record` additionally refreshes
`content/lessons/module-12.evidence.json` and the deterministic source zip. Run this only
in the documented reference environment; then format JSON with
`npx prettier --write content/lessons/module-12.evidence.json`. Normal CI never rewrites evidence.
The recorded PC offsets are relative to the function; after `ret`, the verifier checks that
PC equals `after_trip` instead of asserting a compiler-specific return address.

Supported A64 arithmetic programs also live in `scripts/real-tools/corpus`: they retain
the normal simulator/GNU/QEMU differential check. Boot startup and device instructions remain
native-only and have this separate executable check. No browser compiler, Linux kernel or
whole-computer device model is added.
