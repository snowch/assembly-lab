# Course completion: GNU assembler and QEMU validation

Run on 18 October 2026 from the completion worktree with all current corpus files:

```
AL_TOOLS=/tmp/course-tools npm run check:real-tools
```

The command exited successfully. Results:

- 191 programs, 2,256 calls, 284,666 instruction states compared, zero differences.
- 15 instruction-line files, 39,675 lines, 184 outside the course subset,
  zero assembler acceptance disagreements.

Tools were GNU assembler 2.44 and QEMU 10.0.13, extracted from Debian packages into
`/tmp/course-tools`. These are the same versions used for the preceding module
checks. The packages were downloaded directly from Debian's public mirror:
`binutils-aarch64-linux-gnu_2.44-3_amd64.deb` and
`qemu-user_10.0.13+ds-0+deb13u1_amd64.deb`.

The differential corpus compares executed A64 instructions and architectural
state. Optional A's A32 records are static compiler output and are not presented
as executable programs. Their A64 counterparts are included in these totals.
Compiler records that intentionally demonstrate diagnostics or unsupported
external calls are described in their module notes rather than run by the
course simulator.

This check establishes agreement for the recorded corpus and instruction lines.
It does not replace the independent lesson reviews or browser checks.
