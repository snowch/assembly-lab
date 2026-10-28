# Returning to the caller: canonical prose

The section-flow revision joins the motivation and investigation strings under Follow the call and return. These property-path records retain both strings verbatim; see `../section-flow/audit.md` for the rendered heading order.

Copyright © 2026 Christopher Snow

Separately drafted from brief.md and the checked facts in facts.md. Tiny-function copy changes are retained in ../fundamentals/prose.md.

### prose / sections / motivation

In the previous lesson, `increment_int` left its result in `w0`. The caller and `increment_int` use the same registers, so the caller can read that value when the function returns. Follow the call below to see where execution goes and how the caller uses the result.

### prose / sections / investigation

An instruction’s address identifies its place in memory. A **branch** changes where execution continues. On AArch64, `bl` means branch with link: `bl increment_int` starts executing `increment_int` and saves the address of the instruction after `bl` in `x30`. That saved address is the **return address**. Register `x30` is also called the **link register**.

Plain `ret` continues execution at the address held in `x30`. These are AArch64 instruction rules, whether the instructions came from C or were written in assembly. Here, the instruction after `bl` is the caller’s addition.

The figure starts just before `bl`, with the argument already in `w0`. It stops after the caller’s addition, before the caller’s remaining instructions. Press Run the instruction to follow the call, the function’s addition, its return and the caller’s addition. The marker ▸ names the instruction that runs next; the highlight marks the instruction that just ran. On a narrow screen, scroll sideways within the function listing to see the C and instructions.

The caller instructions were written for this course. The paired increment_int listing is the recorded GCC output from A tiny function.

### prose / sections / explanation

`ret` left `w0` and `w1` unchanged. Execution continued in the caller, whose addition read `w0` and wrote `w1`. Both pieces of code used the same register values.

The caller can use the other general-purpose registers too. It looks in `w0` for this `int` result because caller and function follow an agreed set of rules, a **calling convention**. `ret` does not select the result register.

The rules also say which register values a function must preserve. This caller is only part of a program. A caller that must itself return would need its own return address, but `bl` just overwrote `x30`. The [later calls lesson](#/lesson/calls-and-returns) shows how that address is kept and develops the rules.

### prose / sections / challenge

Trace the same instructions with a fresh argument. Keep track of where execution goes and what stays in the registers.

### prose / references / summary

Check Arm’s references

### prose / references / prose

- [BL: branch with link](https://support.arm.com/documentation/ddi0602/2025-12/Base-Instructions/BL--Branch-with-Link-) describes how the call saves the return address in `x30`.
- [RET: return from subroutine](https://support.arm.com/documentation/ddi0602/2025-12/Base-Instructions/RET--Return-from-subroutine-) describes the instruction. Its optional register operand defaults to `x30`.
- [Arm’s procedure call standard](https://github.com/ARM-software/abi-aa/blob/2025Q4/aapcs64/aapcs64.rst) describes argument registers, result registers and the values a function must preserve.

### prose / challenge / task

Start a fresh call, `increment_int(4)`, with:

- `w0` holding 4.
- `w1` holding 0.

The caller runs `bl increment_int`. The function runs `add w0, w0, 1`, then `ret`. The caller continues with `add w1, w0, w0`.

What does `w0` hold immediately after `ret`, and what does the caller’s addition write to `w1`?

### prose / challenge / hints / 0

Follow the function’s addition, its return, then the caller’s addition.

### prose / challenge / hints / 1

Returning changes where execution continues. It does not remove the value from `w0`.

### prose / challenge / hints / 2

In the worked call, the function left 8 in `w0`. The caller then read that value twice and wrote 16 to `w1`.

### prose / challenge / hints / 3

First add one to the fresh argument. Keep that result in `w0` through the return, then add it to itself for `w1`.

### prose / challenge / hints / 4

Immediately after `ret`, `w0` holds 5. The caller’s addition writes 10 to `w1`.

### prose / originalityNote / textbookExample

A return is often introduced with a complete calling sequence and instructions that save the caller’s state.

### prose / originalityNote / howThisDiffers

A call to the familiar one-addition function shows where its return address comes from. One shared register display separates preparing a result, returning and using the result without introducing nested calls.

### labels / title

Returning to the caller

### labels / objectives / 0

Follow bl into a function and ret back to the caller.

### labels / objectives / 1

Explain how the caller uses a result held in shared registers.

### labels / titles / motivation

One set of registers

### labels / titles / investigation

Follow the call and return

### labels / titles / explanation

Where execution continues

### labels / titles / challenge

Return, then use the result

### labels / captions / figure

Call increment_int, return to the caller, then run its next instruction.

### labels / captions / challenge

A fresh argument, followed by the caller’s addition.

### labels / challenge / title

Trace the return and the next instruction

### labels / challenge / fields / w0

`w0` immediately after `ret`

### labels / challenge / fields / w1

`w1` after the caller’s addition

### figure strings / title

A result stays in the register

### figure strings / caller

Caller

### figure strings / functionName

increment_int

### figure strings / sharedRegisters

Registers shared by caller and function

### figure strings / returnAddress

Link register

### figure strings / beforeCallTarget

Not yet set for this call

### figure strings / written

Written

### figure strings / returnTarget

Caller’s addition

### figure strings / run

Run the instruction

### figure strings / back

Back

### figure strings / reset

Start again

### figure strings / next

Runs next

### figure strings / ran

Just ran

### figure strings / complete

The activity stops after this caller instruction.

### figure strings / callerProse

These caller instructions were written for this course.

### figure strings / status / 0

Run bl to call increment_int with the argument already in w0.

### figure strings / status / 1

bl saved the caller’s addition address in x30 and entered increment_int. Run the function’s addition.

### figure strings / status / 2

The function wrote 8 to w0. Its ret runs next.

### figure strings / status / 3

ret returned to the caller. w0 still holds 8. Run the caller’s addition.

### figure strings / status / 4

The caller read 8 from w0 and wrote 16 to w1.
