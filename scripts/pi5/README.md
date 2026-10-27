# Pi 5 build verification

Copyright © 2026 Christopher Snow

Run `python3 scripts/pi5/check.py` with GNU AArch64 binutils, QEMU user mode, Make and Python installed. The check uses the actual public sources under `apps/course/public/native/pi5`. It stages/builds in a temporary directory and does not access a block device, board, EEPROM, serial port or network.

The source zip contains the course's assembly, linker/configuration/build files and hardware checklist. It contains neither third-party firmware nor prebuilt machine images. `--record` refreshes that deterministic zip and `build-evidence.json`; normal CI verifies them without rewriting. See [the source and fact record](../../docs/notes/module-13/facts.md) for what is established and what is inherited from firmware.

The good and deliberately changed arithmetic functions are checked under a small Linux user-mode QEMU harness. Only that portable calculation runs in this checker. The Pi 5 boot code and UART are **not** executed by QEMU, and the checker never treats a QEMU `virt` device as a Pi. The unchanged calculation is also covered by Module 12's executed system-mode native tests.

Before marking the physical example verified, complete `apps/course/public/native/pi5/HARDWARE-TEST.md` on the specified Pi 5 and retain its real serial capture and image/source identity. Static image checks cannot establish that the firmware loaded the file or preserved UART10's clock/reset/routing state.
