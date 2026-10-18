# Shared text follow-up

The managing session re-read the simulator note, assembler messages, compiler
diagnostics and the front-page prerequisites alongside the chapter reviews.
This is a source review; it does not claim another execution of every diagnostic
in a browser. The first review's actual diagnostic probes remain documented in
[`../english-review/24-shared-text.md`](../english-review/24-shared-text.md).

`git diff d0bf76b -- packages/machine/src/strings.ts
packages/views/src/strings.ts packages/compiler/src/strings.ts` is empty. These
messages have not changed since the first review. Their retained findings still
apply:

- L4: the shared stepping note names flags before the early lessons define them.
- L19: three assembler errors use the unexplained category noun “an extend”.
- L20: the instruction-read fault says “The machine does not keep instruction
  bytes”, obscuring that this is a simulator limitation.
- L21: a directive error says “missing something, or has too much” without
  identifying the operand/form problem.
- L22: the assembly editor refers to “the chips” although the visible mode is Tap.

The front page still says “The other modules are planned”. The parsed course
contains lessons for every planned module. This remains the first review's
separate status-text observation, not another English issue.

The new prerequisites disclosure keeps the introductory guidance visible and
makes its full details available by opening “Check what you need to know”. It
does not change the knowledge assumed by the chapter reviews. The offline footer
explains readiness, external-service limitations and browser storage removal.
No additional shared-text finding is proposed in this source pass.

Independent sceptic review must assess these retained statuses alongside the
chapter reports before the final synthesis claims them as accepted findings.
