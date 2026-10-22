# Issues 16 and 17 implementation and validation

22 October 2026. The implementation branch is `codex/issues-16-17`, based on the
compiler-reference disclosure follow-up in PR #20. The new review diff is intended to be
stacked on that PR; no merge is performed by this work.

## Scope and review

Issue #17 uses one `RegisterSummary` primitive for decimal/compiler and memory/stack
summaries. Callers supply complete preformatted values and recorded-write state. The
ordinary full bit, half, byte and width teaching diagrams retain their existing layout.
The [inventory](register-display-inventory.md) records every display classification;
[the independent rendered review](register-summary-review/README.md) records screenshots,
measurements, keyboard checks, accepted observations and explicit coverage limits.
The ordinary initial register area measured 115.67px. The reviewer accepted that small
variance from the approximate 90–110px target because the four values are compact on one
row and remain readable. No pixel tolerance was weakened to accommodate it.

Issue #16 adds two ten-section core lessons after Module 11 and before optional A32.
The optional lesson keeps its `same-c-on-a32` ID and stored-work key; its numeric curriculum
key moves to 13. The new module adds no browser compiler, kernel, QEMU runtime or device
model. Supported arithmetic examples retain GNU/QEMU differential coverage. Explicitly
native-only syscall/UART programs have a separate Ubuntu 24.04 CI job.

The [checked source brief](module-12/sources-brief.md) supplied authoritative facts and
prior knowledge to a separate drafting agent. Canonical prose is kept in
[module-12/prose.md](module-12/prose.md). Two independent learner reviews and a technical
review are recorded separately:

- [Function/build lesson](module-12/learner-function-review.md).
- [Debugger/native-only lesson](module-12/learner-debug-review.md).
- [Technical review and independent executable verification](module-12/technical-review.md).

Accepted findings corrected a prediction answer exposed by later static output, unexplained
pipeline/directive vocabulary, misleading comparison wording, missing recovery guidance,
missing instruction labels, missing visible version provenance, insufficient ELF/archive
assertions, and the closing task's failing-case ordering. Exact native output now stays
behind prediction commitment; the terminal workflow deliberately reproduces the unchanged
function's failing revised-contract case before repair. Reviewers confirmed fixes in the
built pages. Minor optional vocabulary was clarified in a final separate drafting pass.

## Native reference execution

The reference runs used an x86_64 Ubuntu 24.04 Docker container from image
`ubuntu:24.04`, digest
`sha256:68ee22004a9109b44973313b02ff7b1de250f1de0f5ecb628d73f579aaff33ac`.
`content/lessons/module-12.evidence.json` records actual GCC 13.3.0, Binutils 2.42,
QEMU 8.2.2 and GDB 15.1 version strings and observations. No physical Arm or fresh WSL
installation was tested; Windows instructions identify an Ubuntu WSL2 terminal rather
than claiming a second verified host platform.

`python3 scripts/native/check.py --record` passed, then an ordinary
`python3 scripts/native/check.py` passed against the published evidence/archive. An
independent technical reviewer also ran the ordinary command successfully. Checks include
separate C/assembly objects, static AArch64 ELF and disassembly, good/broken output and
exit status, five real GDB stops and first divergence, return PC in `main`, two different
passing challenge implementations, rejection of the unchanged function, standalone Linux
output/exit, optional UART output, ELF entry/load segments inside virt RAM, and actual
Ctrl-A X console exit. Normal CI compares stable observations with saved evidence and every
zip member with its source file. Full disassembly text and tool-dependent absolute PCs are
not brittle equality targets.

The first native attempt passed the core programs but failed optional UART verification:
our minimal container installation omitted the `ipxe-qemu` ROM recommendation, and QEMU
reported missing `efi-virtio.rom`. Installing that package allowed the exact documented
system-mode command to pass. The lesson/CI default apt installation includes recommendations.
QEMU output does not establish physical UART clocking or realistic FIFO pressure.

GNU/QEMU differential verification passed: **193 programs, 2264 calls, 284710 instruction
states, zero differences**. Assembler checks: **15 files, 39675 lines, 184 outside the
supported subset, zero disagreements**.

## Browser and repository checks

Focused component tests passed for shared summaries, the introductory stepper and memory
figures. The final focused browser run passed **12 tests**, covering both new lessons and
register responsiveness in desktop/phone projects and light/dark. It checks gated native
output, matching recorded/model rows through `ret`, reset, downloaded zip, challenge
failure/success and reload/regrading, the width matrix, full bit expansion and 200% text.
Independent screenshot review adds memory/stack/compiler, unchanged-bit writes, actual
keyboard focus, removal, and preserved 16/64-bit diagrams. Each review states its own limits.

Development failures were corrected rather than counted as passes: a new test initially
looked for the old toggle name after expansion; an initial jsdom fixture used the DOM URL
class for a filesystem read; Node's browser-test loader required JSON import attributes;
the instruction inventory lacked the new lesson IDs and needed a documented native-only
`adr` exception; a gated text figure initially omitted its required caption. One focused
browser run overlapped a rebuild and was stopped (3 failed, 1 interrupted, 8 did not run).
The successful 12-test rerun used a stable built site. The earlier all-unit run had 2 failures
and 2768 passes; the later full check passed all 138 files and 2770 tests.

`npm run check` is running its complete 1090-case browser suite after passing formatting,
copyright, platform integrity, strict types, all unit/integration tests and production build.
The final result will replace this paragraph when the command completes.
