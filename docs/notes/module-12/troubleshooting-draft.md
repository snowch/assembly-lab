# Troubleshooting disclosure draft

Drafted separately from the implementation from the checked commands and source brief.
Root and the independent learner reviewer must review this copy; its author cannot supply
its independent review. Place beside the first native build/run commands.

Summary: **If a command fails**

- **`command not found`:** check the command's spelling, including `aarch64-linux-gnu-`.
  Repeat the installation command above in your Ubuntu terminal. These tools produce
  AArch64 code; your computer's ordinary `gcc` may produce code for a different processor.
- **`Exec format error`:** run `qemu-aarch64 ./trip`, rather than `./trip` alone.
  The downloaded source builds an AArch64 executable. An x86 computer cannot execute
  those instructions directly.
- **A missing `/lib/ld-linux-aarch64.so.1`:** the executable needs an AArch64 shared-library
  loader. Repeat the link command with `-static`, then run the new `trip`. This course's
  static build avoids installing that target loader and its libraries.
- **An assembler error:** read the reported source line in `trip_distance.s`. Check register
  names, commas and instruction operands against the original file. Correct the source,
  then repeat the assembly command. Do not continue to link after assembly has failed.
- **The output still reflects an earlier edit:** repeat the assembly and link commands.
  Editing `trip_distance.s` does not change `trip_distance.o` or `trip` until you rebuild
  them. Use `verify-challenge.c` for the final twice-correction task; `main.c` checks the
  original single-correction function.
