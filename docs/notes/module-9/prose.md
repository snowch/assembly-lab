# Module 9: Calls and the stack (lesson text)

Drafted in a separate Codex session from the checked facts, compiler records and simulator results. Sources are recorded in the module brief and listings. Independent review and validation are recorded separately.

This file contains learner-facing prose, hints and labels word for word. Passage headings are editorial markers.

# Lesson 1: Calls, returns and the stack

## 0. Objectives

- follow a helper call through the link register;
- save and restore a function’s stack frame;
- preserve values according to the calling convention.

## 1. How does a function find its way back?

The trip computer's report reuses a function that halves a distance. The report must resume after that helper finishes. **How does a function remember where to return?**

The function making a call is the **caller**; the function receiving it is the **callee**. The recorded `trip_report` calls `half_distance`, then adds the reserve to the returned value.

*Closed note: The recorded compiler output*

The listings paired with C use GCC 16.1 with `-O1 -fno-inline` for little-endian AArch64 Linux. The extra setting prevents inlining: replacing a call with a copy of the called function's body. Keeping the call makes the return mechanism visible.

*End of closed note.*

## 2. Save the return address before a call

`bl half_distance` branches to the helper and puts the address of the following instruction in `x30`. Register `x30` is the **link register**. By default, `ret` branches to the address in `x30`; it does not necessarily end the whole program.

A function that calls another function must protect its own return address. `bl` replaces `x30`, so the old value must be saved somewhere before that call and restored before the function returns.

The **stack** is memory used to hold values needed by active calls. Its current boundary is the **stack pointer**, `sp`. A function reserves space by decreasing `sp` and releases it by increasing `sp` again. This stack grows towards lower addresses.

The shared register and stack rules form a **calling convention**. This course follows AAPCS64, the procedure-call standard for this target. These rules let separately written functions call one another.

**A caller that returns the helper’s result**

Follow the handwritten `relay_distance` below. It calls `half_distance` and returns the helper’s result unchanged. Press Next to follow each instruction. The simulator supplies an aligned stack and a return address that ends the outer call; startup is not part of this example.

The space reserved for one active call is its **stack frame**. `stp` stores a pair: `stp x29, x30, [sp, #-16]!` decreases `sp` by 16, then stores two 64-bit values. The saved `x29` starts at `sp`; `x30` starts at `sp + 8`. AAPCS64 requires `sp` to be a multiple of 16 for stack accesses through it. This is 16-byte alignment. Reserving 16 bytes keeps that alignment.

Here `x29` is a **frame pointer**, identifying this call’s frame. `mov x29, sp` sets it after saving its old value. `ldp` loads a pair: `ldp x29, x30, [sp], #16` restores both values, then releases the frame by increasing `sp` by 16. The final `ret` uses the restored return address.

## 3. Call the distance helper

The report receives:

- Distance 128.
- Reserve 9.

The helper halves the unsigned distance, then the report adds the reserve.

**What does `trip_report` return in `w0`?**

*After committing the prediction:*

It returns 73, or `0x00000049`. The helper returns 64 in `w0`; the report then adds the saved reserve, 9. The helper's `ret` resumes the report, whose own `ret` returns to its caller.

## 4. Inspect the saved values on the stack

Now follow `trip_report`, which keeps a reserve across the helper call. Its stack frame reserves 32 bytes. The saved pair has the same layout as before: `x29` at `sp`, then `x30` at `sp + 8`. `stp x29, x30, [sp, #-32]!` reserves this larger frame; `ldp x29, x30, [sp], #32` restores the pair and releases it.

GCC also saves `x19` at `sp + 16`, then uses `w19` to keep the reserve across the helper call. On return, it restores all three saved registers.

AAPCS64 requires a callee to preserve `x19` through `x29` and restore `sp`. Preserve all 64 bits, even if your own calculation uses only a `w` view. The stack must also be aligned to 16 bytes at public call boundaries, where separately compiled functions meet.

This is one GCC frame layout. AAPCS64 permits platform-specific frame-pointer policies, so other functions can use different layouts. We avoid `x18`, whose use also depends on the platform.

## 5. Call a helper and resume

Write a function that calls the helper and then adds one. Saving the link register lets the final `ret` reach the original caller.

### Complete report_once

Complete `report_once`. The unsigned distance arrives in `w0`. Call the supplied `half_distance`, add one to its result, and return that value in `w0`.

Preserve `x19`, `x29` and `sp`. Save and restore the incoming return address in `x30`. The helper is provided; keep it unchanged.

*Hints, in order:*

- The helper call overwrites `x30`. Save its incoming value first.
- Do not reserve an arbitrary number of bytes. Keep the stack pointer aligned by reserving a multiple of 16.
- With input zero, the helper returns zero and `report_once` adds one. Even this small case must save the original return address before the helper call.
- After the helper returns, add one to `w0`. Restore the saved pair and release the stack space before returning.
- One complete solution is:

```asm
report_once:
 stp x29, x30, [sp, #-16]!
 mov x29, sp
 bl half_distance
 add w0, w0, #1
 ldp x29, x30, [sp], #16
 ret
half_distance:
 lsr w0, w0, #1
 ret
```

## 6. Returning through an overwritten link

The changed `report_once` calls the helper without saving its incoming `x30`. The helper returns successfully, and the report executes its addition and `ret`. This recording stops after at most 20 instructions.

**Does the report return to its original caller before the recording limit?**

*After committing the prediction:*

It reaches the recording limit. The helper call left `x30` pointing to the report's addition. The report's own `ret` branches back to that same instruction, so the addition and return repeat.

The helper's return worked. The missing save lost the return address that the report needed afterwards.

## 7. Share responsibility across the call

A call instruction records one return address. It does not automatically save the previous address, allocate a frame or restore registers. The instructions around the call perform that work.

The calling convention also decides which values may survive a call. The ordinary integer arguments here use `x0` through `x7`, or their `w` views. These simple integer functions return through register 0. A caller must not expect its argument registers to keep their old values after a call.

To keep a value, the caller can save it in memory or use a register the callee must preserve, such as `x19`. If the caller itself changes `x19`, it must first save its incoming value and restore it before returning. These responsibilities apply to each function in the chain.

## 8. Protect what the caller still needs

Before each call, identify the values needed afterwards. Protect the return address and any other live values. After the call, use the returned value, restore saved registers, and release the stack space.

A **leaf function** calls no other function. It can often return using the incoming link register directly. A function that makes another call needs to account for the link register being overwritten.

The final exercise's helper also writes `w1`. That is allowed by the calling convention. The caller must preserve its reserve deliberately, even if an earlier version of the helper happened to leave `w1` unchanged.

## 9. Keep the reserve across a call

### Preserve the reserve

Complete `trip_report` using the supplied helper.

- `w0` holds an unsigned distance.
- `w1` holds an unsigned reserve.

 Return half the distance plus the original reserve in `w0`, with unsigned 32-bit wrapping.

The helper overwrites `w1`. Keep the reserve across the call, and preserve the incoming values of `x19`, `x29` and `sp`. Keep the helper unchanged.

*Hints, in order:*

- Do not rely on `w1` still holding the reserve after the call.
- Using `w19` without saving the incoming `x19` loses a value the caller expects to keep. Save all 64 bits before reusing the register.
- With distance zero and reserve 9, the helper returns zero. The final result is still 9, so the reserve must survive the call.
- Reserve 32 bytes. Save `x29` at `sp`, `x30` at `sp + 8`, and `x19` at `sp + 16`. Each saved value occupies eight bytes.
- One complete solution is:

```asm
trip_report:
 stp x29, x30, [sp, #-32]!
 mov x29, sp
 str x19, [sp, #16]
 mov w19, w1
 bl half_distance
 add w0, w0, w19
 ldr x19, [sp, #16]
 ldp x29, x30, [sp], #32
 ret
half_distance:
 lsr w0, w0, #1
 mov w1, #0
 ret
```

## 10. What you now know

- `bl` writes a return address into `x30` and branches to the callee.
- `ret` normally branches to the address in `x30`.
- Saving and restoring the return address requires instructions.
- A caller protects values it needs after a call.
- A callee restores registers the calling convention requires it to preserve.


## Figure captions and labels

trip_report and its helper in C and recorded GCC assembly.

A handwritten caller saves its return address, calls the helper and restores the saved values.

Predict the report returned after the helper call.

Follow the call, the saved registers and the return.

Inspect the active stack space as the report runs.

Write a call that returns to its original caller.

Predict whether the report returns before the recording limit.

After committing, step through the changed function and inspect its return addresses.

Keep the original reserve while the helper changes w1.

0x00000040

0x00000049

0x00000089

The recording reaches its instruction limit.

The report returns to its original caller.

Call with zero distance

Call with distance one

Call with odd distance seven

Call with distance 128

Call with the maximum unsigned distance

Keep a reserve with zero distance

Handle zero reserve

Keep the reserve for an odd distance

Keep both inputs across the helper call

Wrap the unsigned result and restore saved registers

## Originality record

A function call presented only as a jump followed by a return.

A trip report must keep both its return address and a reserve while a helper runs. A helper that legally changes an argument register exposes why preserving a value is the caller's responsibility.

# Lesson 2: Recursive calls and separate frames

## 0. Objectives

- follow saved values across recursive calls;
- explain how a base case and a changing argument stop recursion;
- complete a recursive function while preserving its caller’s state.

## 1. What does each recursive call keep?

The display repeatedly halves its brightness until it becomes dark. The trip computer can add all the nonzero brightness levels by asking the same function to handle the remaining levels. **What must each call remember while the next call runs?**

A function that calls itself uses **recursion**. It needs a **base case**: an input it can answer without making another call. In `fade_sum`, zero brightness is the base case. Every other call halves the brightness, calls `fade_sum` again, then adds its own original brightness.

*Closed note: The recorded recursive function*

The listing uses GCC 16.1 with `-O1 -fno-inline` for little-endian AArch64 Linux. Each call follows the same register-preservation rules as a call to a different function.

The brightness and sum are unsigned 32-bit values. The sum wraps if it exceeds that range. A recursive call must finish before the pending addition can use its returned value.

The displayed frames belong to this recorded compilation. Other compiler versions or settings may choose a different implementation.

*End of closed note.*

## 2. Save the current brightness

Each call saves its incoming `x19` and return address in its own stack frame. It then puts its brightness in `w19` and halves the argument in `w0` before calling itself.

The next call saves that `x19` value in its own frame before reusing the register. When it returns, it restores `x19`, so the earlier call has its brightness back in `w19`. The earlier call adds that brightness to the sum returned in `w0`.

The zero case returns without making another call. The listing still allocates and restores a frame for that invocation; a base case need not mean that no stack instructions run.

## 3. Add the fading brightness levels

`fade_sum` starts with brightness 7. Each recursive argument is the previous brightness shifted right by one place. The zero call contributes zero.

**What sum does `fade_sum(7)` return in `w0`?**

*After committing the prediction:*

It returns `0x0000000b`, or 11. The calls receive 7, 3, 1 and 0. They return in the opposite order: the zero case returns first, then each earlier call adds its own brightness.

## 4. Follow the frames down and back

This figure starts at the deepest point, with all four calls active. Use Back to inspect how the calls built the stack, or Next to follow the remaining instructions and returns. Each invocation of this GCC function reserves 32 bytes. For brightness 7, the four active frames use 128 bytes at the deepest point.

The repeated function name does not mean there is only one saved brightness or return address. Each frame holds the values for a different invocation. As calls return, those values become current again.

Restoring `sp` releases a frame's space. It does not erase the bytes that were stored there. The diagram shows the space still belonging to active calls.

## 5. Repair the base-case branch

Repair the condition that chooses between the recursive path and the base case. Every call must still restore the state it saved.

### Repair fade_sum

Repair the supplied `fade_sum`. It should return zero for zero brightness. For a nonzero brightness, it should call itself with the brightness halved, then add the original brightness to the returned sum.

The starter uses the wrong condition at the branch into the recursive path. Keep the frame saves and restores, and preserve `x19`, `x29` and `sp` for every invocation.

*Hints, in order:*

- The zero input must take the path that returns without calling again.
- Do not return immediately for a nonzero input. That path must halve the brightness and call `fade_sum`.
- For input 1, halve the brightness to zero and call `fade_sum(0)`. That call returns zero; adding the current brightness gives 1.
- The branch should be taken when `w0` is nonzero.
- One complete solution is:

```asm
fade_sum:
stp     x29, x30, [sp, -32]!
mov     x29, sp
str     x19, [sp, 16]
mov     w19, w0
cbnz    w0, .L4
.L2:
mov     w0, w19
ldr     x19, [sp, 16]
ldp     x29, x30, [sp], 32
ret
.L4:
lsr     w0, w0, 1
bl      fade_sum
add     w19, w19, w0
b       .L2
```

## 6. A recursive call that makes no progress

The changed function passes the same brightness into its next recursive call. It replaces the right shift with `mov w0, w0`. The starting brightness is 7, and this recording is limited to 32 instructions.

The simulator uses a fixed, prepared stack. It does not reproduce a real system’s response when stack space runs out.

**Does the changed function return before the recording limit?**

*After committing the prediction:*

It reaches the recording limit. Every recursive call receives the same nonzero brightness, so no call reaches the zero base case. More calls allocate more stack frames.

The limit ends this recording, not the recursive calculation. A real finite stack would eventually run out of available space; this is not a claim that the machine can make an infinite number of calls.

## 7. Finish the pending work as calls return

A base case is useful only if repeated calls move towards it. For an unsigned 32-bit brightness, shifting right by one eventually removes every set bit. Passing the unchanged brightness makes no progress.

Returning reverses the call sequence. The deepest call returns first. Its caller then finishes the addition it was waiting to perform and returns to the next caller. The saved link register identifies the instruction after each call.

The current call must keep any value needed after the recursive call. `w0` will hold the child's result, so the original brightness cannot remain there. The saved value in `w19` supplies that brightness when the addition resumes.

## 8. Define the smaller problem

To design a recursive function, specify a base case, a smaller remaining problem, and how to use its returned answer. Then account for the values and return address that must survive the call.

For a count of nonzero brightness levels, the zero case returns zero. A nonzero case returns one plus the count for half the brightness. The extra one counts the current level. Add it after the recursive call, when `w0` contains the smaller problem's result.

The count function does not need to keep the original brightness after halving it. It still needs to preserve its incoming return address while the recursive call runs.

## 9. Count the nonzero brightness levels

### Complete lit_count

Complete `lit_count`. Return the number of nonzero brightness levels reached by repeatedly halving the unsigned input in `w0`. A zero input returns zero.

Use the supplied recursive structure: for a nonzero input, call `lit_count` with half the brightness, then count the current level as well. Preserve `x19`, `x29` and `sp`. The starter already saves and restores the return address, but it omits the current level from the count.

*Hints, in order:*

- The zero path is the base case and should return zero.
- Returning the recursive result unchanged would leave the current nonzero level out of the count.
- For brightness 1, the next brightness is zero. The recursive call counts no further lit levels, so the current level must make the result 1.
- Put the addition after `bl lit_count`, so it uses the returned value in `w0`.
- One complete solution is:

```asm
lit_count:
 cbz w0, .Ldone
 stp x29, x30, [sp, #-16]!
 mov x29, sp
 lsr w0, w0, #1
 bl lit_count
 add w0, w0, #1
 ldp x29, x30, [sp], #16
.Ldone:
 ret
```

## 10. What you now know

- Each active recursive call has its own saved values and return address.
- The base case returns without making another recursive call.
- Each recursive argument must make progress towards the base case.
- A call finishes before its caller uses the returned value.
- Every invocation must restore the state required by the calling convention.


## Figure captions and labels

fade_sum in C and recorded GCC assembly.

Predict the sum returned by fade_sum(7).

Follow each recursive call and return.

Inspect the stack when the recursive calls are all active.

Repair the branch that selects the recursive path.

Predict whether an unchanged argument reaches a return.

Inspect repeated arguments and growing stack space.

Count the current brightness level after the recursive call returns.

0x00000007

0x0000000b

0x00000003

The recording reaches its instruction limit.

The function returns.

Return from the zero base case

Sum one nonzero level

Sum the levels starting at seven

Sum a longer sequence of levels

Wrap a sum from the maximum unsigned brightness

Count no levels for zero

Count one nonzero level

Count the levels starting at seven

Count the levels starting at 128

Count every possible unsigned bit position

## Originality record

Recursive factorial or Fibonacci with a call-tree drawing.

A fading display supplies a decreasing unsigned input and a useful zero base case. The computed stack separates pending brightness sums from a count that needs no saved brightness, then exposes a recursive call that makes no progress.

# Figure interface

## requiredCall

This run did not call half_distance. Use the supplied call structure so the function calls half_distance during this test.

This run did not call fade_sum. Use the supplied call structure so the function calls fade_sum during this test.

This run did not call lit_count. Use the supplied call structure so the function calls lit_count during this test.

This run did not call {function}. Use the supplied call structure so the function calls {function} during this test.

## stack

The active stack

## empty

No stack space is currently allocated by these functions.

## lower

The stack grows towards lower addresses.

## frame

{function}: 32 bytes

{function}: {bytes} bytes

## address

Address {address}

## byte

Address {address}: byte {byte}

## position

Instruction position

## depth

0 bytes of stack space currently allocated

32 bytes of stack space currently allocated

{bytes} bytes of stack space currently allocated

## active

These bytes belong to the current calls. Restoring sp releases the space; it does not erase the stored bytes.

## sp

Stack pointer (sp)

## instructions

Instructions in this call sequence


## invocation

Call {number}

## savedRegister

Saved {register}

## returnTarget

x30 points to {address}: {instruction}

## returnOutside

x30 points to {address}, outside the instructions shown.


## savedValues

Saved values in this frame

## inspectBytes

Inspect individual bytes

## noSavedValue

Other frame space

## frameRange

Addresses {first} to {last}

## slotRange

{first} to {last}

## stored

Written by this instruction

## loaded

Read by this instruction


## offsets

Slot offsets count bytes from the first address of each frame.
