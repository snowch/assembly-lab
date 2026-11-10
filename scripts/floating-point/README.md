# Recorded floating-point functions

`python3 scripts/floating-point/check.py` is a required step in the existing
`native-lessons` CI job. It requires GNU AArch64 `as`, `ld`, `objdump` and
`qemu-aarch64`; a missing tool fails the check. On Ubuntu/Debian install
`binutils-aarch64-linux-gnu qemu-user`. It runs independently of the browser ISA
and does not add floating-point instructions to that model.

The seven C files, original Compiler Explorer requests and unmodified JSON
responses are in `docs/notes/floating-point/compiler/`. They were submitted to
`https://godbolt.org/api/compiler/carm64g1610/compile` on 10 November 2026, with
`Content-Type: application/json` and `Accept: application/json`. The retained
compiler metadata came from `https://godbolt.org/api/compilers/c`: ARM64 GCC
16.1.0. Each request selects `-O1`. The response retains the service's complete
compilation options, original instruction order and debug source associations.
The regular check uses these local records and makes no network request.

The generated teaching listing appends the compiler's original `C` line tags.
Its separate `sourceLines` associations use the complete C pane's numbering,
which omits the file's copyright comment. Most compiler references point at the
closing brace. Their checked associations identify the return expression; for
`float_pattern`, the `fmov` corresponds to the representation copy, and `ret` to
the return. No instruction is reordered or substituted to make those pairs.

The checker copies the recorded assembler rows verbatim into a Linux A64 entry
harness and assembles and links them with GNU tools. Before calling the functions,
the harness sets FPCR to zero, reads it back into the output, and clears FPSR.
Each call loads its selected raw input encoding from memory, invokes the actual
compiled function, and writes the returned raw bits to a binary output buffer.
`qemu-aarch64 -cpu cortex-a53` runs the linked ELF. The check compares every output
byte with the retained evidence. Float-to-int inputs here are finite and their
truncated values fit `int`; the examples make no claim about other inputs.

`--record` refreshes `docs/notes/floating-point/native.evidence.json` and
`content/lessons/floating-point.native.ts` from an actual run. Evidence retains
source/request/response hashes, a harness hash, raw little-endian output,
disassembly and recording tool versions. It is a recording for inspection, not a
native process executing in the page. The exact numeric model tests separately
check these inputs and outputs. QEMU results do not establish physical-hardware
equivalence, NaN payload rules, trapping behaviour or other FPCR modes.

The initial recording used GNU Binutils 2.44 and QEMU 10.0.13. The environment did
not provide privileged package installation. The following official Debian trixie
packages were downloaded over HTTPS from `deb.debian.org/debian/`, checked against
the SHA-256 fields of its `dists/trixie/main/binary-amd64/Packages.xz` index and
extracted to `/workspace/scratch/fp-tools/root` with `dpkg-deb -x`:

| Package | Version | SHA-256 |
| --- | --- | --- |
| binutils-aarch64-linux-gnu | 2.44-3 | `6e5a9be38121213dda42189a525db01aad4dc52194b577d7d73d659a5843ce6c` |
| qemu-user | 1:10.0.13+ds-0+deb13u1 | `ca6ede739327a20ae5a3498230c8a3a9a072c586e131bc6bcc1201eb1725e336` |
| libsframe1 | 2.44-3 | `38f625dfdc582717029ac3a3e97c51d994ec2e7a0e9b230c6b44e40d1276311f` |

For that user-owned extraction, run the same check with:

```sh
PATH=/workspace/scratch/fp-tools/root/usr/bin:$PATH \
LD_LIBRARY_PATH=/workspace/scratch/fp-tools/root/usr/lib/x86_64-linux-gnu \
python3 scripts/floating-point/check.py
```

After refreshing records, run `npx prettier --write docs/notes/floating-point/native.evidence.json`.

Normal CI uses its installed packages and needs neither environment override.
Recording versions describe the retained run; the checker also verifies the same
raw outputs on CI's tool versions without requiring identical diagnostic text.
