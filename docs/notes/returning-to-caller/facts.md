# Returning to the caller: checked facts

Copyright © 2026 Christopher Snow. All rights reserved.

## Scope and prior knowledge

The learner has practised register and constant addition and seen one- and two-argument
integer functions. This lesson shows the call with `bl` and the change of execution position caused by `ret`.
It shows one shared set of registers before and after return and the caller using the result.
The earlier save and final cleanup execute in the model but are outside the visible activity.
Stack use and register-preservation rules remain in Module 9.

## Sources checked on 27 October 2026

- Arm Instruction Set Reference Guide 100076_0100_00_en, D2.130 RET, page D2-805:
  https://documentation-service.arm.com/static/6245c734b059dc5ff9a8bdab . Downloaded and
  extracted with pdftotext at /tmp/ret-arm-reference.txt. `RET {Xn}` uses the address in
  a 64-bit general-purpose register; absent an operand it uses X30. It branches to that
  address as a subroutine return. It does not transfer a function's result register.
- Direct modern instruction entry:
  https://support.arm.com/documentation/ddi0602/2025-12/Base-Instructions/RET--Return-from-subroutine-
  returned HTTP 200 through the configured proxy. Its HTML is an application shell, so
  semantic confirmation comes from the downloaded Arm reference and GNU/QEMU, rather than
  treating HTTP 200 as evidence of the document's text.
- AAPCS64 release 2025Q4, sections 6.1.1 General-purpose Registers, 6.8 Parameter passing,
  and 6.9 Result return:
  https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst . Raw release fetched
  to /tmp/ret-aapcs64.rst. The general-purpose bank is shared by the caller and the called
  function. Functions do not get separate banks. For the course's 32-bit `int` functions,
  the first argument and result use W0. The caller can use other general-purpose registers;
  being designated as the result location does not give W0 exclusive accessibility.
  Preservation obligations differ by register; the lesson must not imply that all previous
  values survive an arbitrary call. Reserved/platform registers remain subject to their roles.

## Executable example

`returning-to-caller.example.ts` exports the whole course-written wrapper, with the unchanged
recorded `increment_int` arithmetic/return body. It is not a compiler-generated caller and
must not be labelled as one. The original recorded function may retain its existing C pairing;
the caller continuation is assembly-only.

The full wrapper saves X29/X30, calls `increment_int`, performs `add w1, w0, w0` at
`caller_continues`, restores X29/X30 and returns to the harness. The displayed activity starts
after the first instruction, immediately before `bl increment_int`. It stops
after the caller addition. This is a view of actual model states, not a simulated handoff
between separate register banks.

Exported API:

- `RETURNING_PROGRAM`: complete model assembly, empty C string.
- `RETURNING_CALL`: entry `caller`, arguments `[7, 0]`.
- `RETURNING_START_STEP = 1`, `RETURNING_END_STEP = 5`.
- `RETURNING_CALLER_LABEL = "caller_continues"`; the actual address comes from
  `trace.program.symbols[RETURNING_CALLER_LABEL].address`.

At the activity's start W0 is 7 and W1 is 0. X30 still holds the harness return sentinel,
which the learner view labels as not yet set for this call rather than displaying its numeric
value. BL writes the address of the following caller addition into X30 and enters increment_int.
The first visible addition writes 8 to W0. RET changes the next instruction to the caller
addition without changing any general-purpose register, including W0 and X30. The caller
addition reads W0 twice and writes 16 to W1, leaving W0 equal to 8. The actual trace's written
register set is empty for RET and contains only register 1 for the caller addition.

Fresh argument 4 gives W0 equal to 5 immediately after RET; the caller addition writes 10 to
W1 and keeps W0 equal to 5. Cleanup preserves these two registers, so the existing whole-call
registers-at-return grader can check both fields without substituting arithmetic answers.
Arguments 0 and 3 are also pinned in the corpus and facts test.

## Verification and failure history

GNU/QEMU differential command:

```
AL_TOOLS=/tmp/operand-addition-tools node --experimental-strip-types --disable-warning=ExperimentalWarning scripts/real-tools/check.mjs --corpus --only returning-to-caller
```

Corrected corpus run passed: one program, four calls, 32 instruction states compared, zero
differences (0.4 seconds), /tmp/ret-facts-native-corrected.log. These are complete traces including
setup and cleanup, not just the displayed prefix. No physical hardware check is claimed.

Initial facts test run had six passes and one failure: the test used a nonexistent labels Map
instead of Program.symbols. Corrected to the actual address table. The initial native attempt
used plain numbers where corpus arguments require `[value, width]` pairs; it exited before
execution. Correcting the corpus schema produced the native pass above. The next unit attempt
could not import the views index while the concurrently authored figure's strings module was
still absent; it executed no tests. These harness/integration attempts are retained separately
from the final rerun.

Final focused facts rerun passed eight tests in one file (1.28 seconds),
/tmp/ret-facts-tests-final.log. The facts test now imports the trace and listing modules directly,
so these machine semantics checks do not depend on unrelated interactive registrations being
complete. It checks the exact native source/case identity, unchanged recorded function body,
real X30 continuation address, all general-purpose registers across RET, caller writes and
fresh arguments. Formatting and whitespace checks passed for the owned files.

## Visible BL follow-up

Checked Arm Guide D2.35 BL, page D2-705, in the same downloaded primary reference:
BL branches to the label and sets X30 to PC+4. The model facts now assert the exact saved
address, branch target, unchanged X0–X29 and X30-only write. The complete GNU/QEMU program
and call corpus are unchanged. Four visible instructions now run: BL, function ADD, RET,
caller ADD. Saved pre-change positions migrate by their original start offset to preserve the
same trace state; newly saved positions record their start offset. Reset begins before BL.

Follow-up primary-source retrieval: modern BL entry returned HTTP 200 on 27 October 2026.
Like the RET entry, it is an application shell; D2.35 in the downloaded primary PDF and
GNU/QEMU establish semantics, not the HTTP status. Focused rerun: four calls, 32 instruction
states, zero differences (0.1 s), /tmp/bl-native.log. Focused content and gate tests:
30 passed across four files (4.76 s), /tmp/bl-focused.log.
