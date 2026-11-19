# Subtraction preparation and directional transfer guides

Copyright © 2026 Christopher Snow

## Authorised work

The author reports that the elapsed-ticks lesson reaches its circle before providing a useful reminder of subtraction through addition. Add a separate worked pane before that circle. The author also requests optional Arm-to-RISC-V and RISC-V-to-Arm appendices. Existing session authorisation includes merging completed changes and verifying publication.

Use `.agents/skills/learning-design/SKILL.md`, `CLAUDE.md`, `docs/authoring.md`, `docs/style.md` and the user's learner-clarity criteria. The new sequence is a response to author feedback; its effectiveness is not established by agent reviews or automated tests. No novice participant is available in this session.

## Subtraction outcome and preparation

Explain the retained result of a wrapped subtraction by inverting the earlier reading's bits, adding one and adding the later reading. Transfer that fixed-width rule to the original 32-bit example. Earlier Arithmetic with four bits defines, demonstrates and practises inversion and subtraction; this pane is a reminder with a counter context.

The four-bit worked example uses later = 0 and earlier = 14. The existing `fourBitSubtraction` model computes its input patterns, inversion, add-one result, final addition and retained result. Its existing `fourBitAddition` model computes the forward timeline through zero. Add meaningful tests for this newly displayed pair and its width bridge. The display is four-bit teaching arithmetic, not a claim that an Arm register is four bits or that a real 32-bit subtraction of 0 and 14 returns the miniature's value.

Place the pane before the original 32-bit prediction and ring, announcing the change of width before the real case. Keep the original prediction, graded cases, accepted instructions, saved drafts and ring gate intact. Describe the calculation as a way to obtain the result bits; the learner still writes one `sub`. Do not add flag assessment or borrow machinery here. Keep the original same-input ring and explanation after the prediction.

Success evidence: a fresh four-bit pair obeys the same inversion/addition rule; the original 32-bit prediction remains unrevealed; the existing elapsed function passes ordinary and wrapped cases. Hypotheses to challenge: reversing operands after a wrap, keeping only four bits in the real lesson, mistaking the illustration for three instructions, and inferring elapsed time without the normal-advance/less-than-one-turn bound.

## Transfer outcome and facts

After reading each directional appendix, a learner should map a small leaf function to the other ISA, identify its argument/result registers and width, and select the other lab's actual execution entry. The visible route covers portable concepts, register/ABI differences, width/flag/branch differences and the supplied runtime. One worked translation precedes a fresh task with a concrete way to run or check it. Foreign assembly must be labelled read-only in the current lab; provide real links and feasible controls rather than implying either editor accepts the other ISA.

Checked repository sources: Arm machine/trace and ABI lessons; RISC-V `docs/course-authoring.md`, `site/course/model.js`, `tools/course-data.js`; the existing `riscv-and-arm` appendix; official RISC-V ISA/psABI extracts at `/tmp/riscv-audit-{rv32,rv64,abi}.txt`. Recheck new claims and executable examples against primary sources/native tools.

- Arm A64 x0-x7 and RISC-V a0-a7 carry ordinary integer arguments; the first two carry ordinary integer results. The guides' leaf example uses just two arguments and one result.
- RISC-V x0/zero is always zero; Arm x0 is an ordinary register and an argument/result register. Arm has a separate zero-register spelling.
- Arm W writes clear the matching X register's upper half. RV64 W arithmetic sign-extends the low 32-bit result. The worked function uses 64-bit arithmetic so its width does not silently change during translation.
- Arm flag-setting arithmetic writes NZCV; ordinary add/sub preserve them. RISC-V integer arithmetic has no NZCV flags. Direct signed/unsigned branches or comparison-result registers carry the relevant relationships.
- The core Arm lessons execute supported functions in a browser simulator with prepared arguments and a return boundary. Native GNU/QEMU and board work are separate named course activities.
- RISC-V lessons assemble/link with real GNU tools and execute as xv6 user processes in a browser CPU emulator. Supplied entry/setup/capture/report/exit surrounds lesson fragments; a fragment is not a complete standalone executable. Tools exposes complete program and debugger/project inspection. Initial register setup is data, not an ISA calling convention.
- Both ABIs require appropriate preservation across calls and standard 16-byte stack alignment; register-preservation sets differ. OS services, process entry, address space and device access belong to the environment, not the mnemonic. xv6 system calls are not Linux system calls.

The Arm appendix is a new optional course entry. Build on the existing RISC-V comparison appendix without invalidating its saved example/exercise state. Add reciprocal guide links, useful destination lessons and primary references. Preserve existing starters/graders unless a concrete review finding requires a change.

## Review and verification

Separate copy drafting from implementation. Obtain independent learner and technical reviews of the built pages at phone/desktop and in actual light/dark themes. Verify original examples, requested edits, keyboard entry, prediction gates and saved work. Pin each displayed computed value to the model; check shown functions with native tools. Run required repository checks, record failed/skipped/interrupted runs separately, merge authorised changes, then verify actual public pages and published identities. None of these checks is a novice learning study.
