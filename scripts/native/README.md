# Native Module 12 verification

`npm run check:native` (or `python3 scripts/native/check.py`) needs the packages named in
Module 12, plus `qemu-system-arm`. The separate Ubuntu 24.04 CI job installs them and
checks the actual public download sources. It requires no Node dependency installation.

The script builds separate C and assembly objects, links a static executable, inspects
its ELF header and disassembly, and compares five real GDB stops in original and deliberately
broken functions. It verifies normal and failing outputs/statuses, two different valid
solutions to the final challenge and rejection of the unchanged function. It also builds
and runs the standalone Linux ELF and optional QEMU virt UART image. The UART check reads
the serial line, then sends the documented Ctrl-A X console escape and checks clean exit.
It does not claim physical UART timing or FIFO pressure.

`python3 scripts/native/check.py --record` additionally refreshes
`content/lessons/module-12.evidence.json` and the deterministic source zip. Run this only
in the documented reference environment; then format the JSON with
`npx prettier --write content/lessons/module-12.evidence.json`. Normal CI checks never rewrite evidence.
The recorded PC offsets are relative to the function; after `ret`, the verifier checks that
PC belongs to `main` instead of asserting a compiler-specific absolute address.

Supported A64 arithmetic programs also live in `scripts/real-tools/corpus`: they retain
the normal simulator/GNU/QEMU differential check. Native `_start`, syscall and UART
experiments deliberately use instructions/services outside the browser model and have
this separate executable check. No browser compiler, Linux kernel or device model is added.
