// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-9/prose.md.
export const PROSE = {
  question:
    "The display repeatedly halves its brightness until it becomes dark. The trip computer can add all the nonzero brightness levels by asking the same function to handle the remaining levels. **What must each call remember while the next call runs?**\n\nA function that calls itself uses **recursion**. It needs a **base case**: an input it can answer without making another call. In `fade_sum`, zero brightness is the base case. Every other call halves the brightness, calls `fade_sum` again, then adds its own original brightness.",
  questionNoteSummary: "The recorded recursive function",
  questionNote:
    "The listing uses GCC 16.1 with `-O1 -fno-inline` for little-endian AArch64 Linux. Each call follows the same register-preservation rules as a call to a different function.\n\nThe brightness and sum are unsigned 32-bit values. The sum wraps if it exceeds that range. A recursive call must finish before the pending addition can use its returned value.\n\nThe displayed frames belong to this recorded compilation. Other compiler versions or settings may choose a different implementation.",
  motivation:
    "Each call saves its incoming `x19` and return address in its own stack frame. It then puts its brightness in `w19` and halves the argument in `w0` before calling itself.\n\nThe next call saves that `x19` value in its own frame before reusing the register. When it returns, it restores `x19`, so the earlier call has its brightness back in `w19`. The earlier call adds that brightness to the sum returned in `w0`.\n\nThe zero case returns without making another call. The listing still allocates and restores a frame for that invocation; a base case need not mean that no stack instructions run.",
  prediction:
    "`fade_sum` starts with brightness 7. Each recursive argument is the previous brightness shifted right by one place. The zero call contributes zero.",
  predictionQuestion: "**What sum does `fade_sum(7)` return in `w0`?**",
  predictionExplain:
    "It returns `0x0000000b`, or 11. The calls receive 7, 3, 1 and 0. They return in the opposite order: the zero case returns first, then each earlier call adds its own brightness.",
  investigation:
    "This figure starts at the deepest point, with all four calls active. Use Back to inspect how the calls built the stack, or Next to follow the remaining instructions and returns. Each invocation of this GCC function reserves 32 bytes. For brightness 7, the four active frames use 128 bytes at the deepest point.\n\nThe repeated function name does not mean there is only one saved brightness or return address. Each frame holds the values for a different invocation. As calls return, those values become current again.\n\nRestoring `sp` releases a frame's space. It does not erase the bytes that were stored there. The diagram shows the space still belonging to active calls.",
  construction:
    "Repair the condition that chooses between the recursive path and the base case. Every call must still restore the state it saved.",
  writeTask:
    "Repair the supplied `fade_sum`. It should return zero for zero brightness. For a nonzero brightness, it should call itself with the brightness halved, then add the original brightness to the returned sum.\n\nThe starter uses the wrong condition at the branch into the recursive path. Keep the frame saves and restores, and preserve `x19`, `x29` and `sp` for every invocation.",
  writeHints: [
    "The zero input must take the path that returns without calling again.",
    "Do not return immediately for a nonzero input. That path must halve the brightness and call `fade_sum`.",
    "For input 1, halve the brightness to zero and call `fade_sum(0)`. That call returns zero; adding the current brightness gives 1.",
    "The branch should be taken when `w0` is nonzero.",
    "One complete solution is:\n\n```asm\nfade_sum:\nstp     x29, x30, [sp, -32]!\nmov     x29, sp\nstr     x19, [sp, 16]\nmov     w19, w0\ncbnz    w0, .L4\n.L2:\nmov     w0, w19\nldr     x19, [sp, 16]\nldp     x29, x30, [sp], 32\nret\n.L4:\nlsr     w0, w0, 1\nbl      fade_sum\nadd     w19, w19, w0\nb       .L2\n```",
  ],
  failureExperiment:
    "The changed function passes the same brightness into its next recursive call. It replaces the right shift with `mov w0, w0`. The starting brightness is 7, and this recording is limited to 32 instructions.\n\nThe simulator uses a fixed, prepared stack. It does not reproduce a real system’s response when stack space runs out.",
  failureQuestion: "**Does the changed function return before the recording limit?**",
  failureExplain:
    "It reaches the recording limit. Every recursive call receives the same nonzero brightness, so no call reaches the zero base case. More calls allocate more stack frames.\n\nThe limit ends this recording, not the recursive calculation. A real finite stack would eventually run out of available space; this is not a claim that the machine can make an infinite number of calls.",
  explanation:
    "A base case is useful only if repeated calls move towards it. For an unsigned 32-bit brightness, shifting right by one eventually removes every set bit. Passing the unchanged brightness makes no progress.\n\nReturning reverses the call sequence. The deepest call returns first. Its caller then finishes the addition it was waiting to perform and returns to the next caller. The saved link register identifies the instruction after each call.\n\nThe current call must keep any value needed after the recursive call. `w0` will hold the child's result, so the original brightness cannot remain there. The saved value in `w19` supplies that brightness when the addition resumes.",
  generalisation:
    "To design a recursive function, specify a base case, a smaller remaining problem, and how to use its returned answer. Then account for the values and return address that must survive the call.\n\nFor a count of nonzero brightness levels, the zero case returns zero. A nonzero case returns one plus the count for half the brightness. The extra one counts the current level. Add it after the recursive call, when `w0` contains the smaller problem's result.\n\nThe count function does not need to keep the original brightness after halving it. It still needs to preserve its incoming return address while the recursive call runs.",
  finalTask:
    "Complete `lit_count`. Return the number of nonzero brightness levels reached by repeatedly halving the unsigned input in `w0`. A zero input returns zero.\n\nUse the supplied recursive structure: for a nonzero input, call `lit_count` with half the brightness, then count the current level as well. Preserve `x19`, `x29` and `sp`. The starter already saves and restores the return address, but it omits the current level from the count.",
  finalHints: [
    "The zero path is the base case and should return zero.",
    "Returning the recursive result unchanged would leave the current nonzero level out of the count.",
    "For brightness 1, the next brightness is zero. The recursive call counts no further lit levels, so the current level must make the result 1.",
    "Put the addition after `bl lit_count`, so it uses the returned value in `w0`.",
    "One complete solution is:\n\n```asm\nlit_count:\n cbz w0, .Ldone\n stp x29, x30, [sp, #-16]!\n mov x29, sp\n lsr w0, w0, #1\n bl lit_count\n add w0, w0, #1\n ldp x29, x30, [sp], #16\n.Ldone:\n ret\n```",
  ],
  reflection:
    "- Each active recursive call has its own saved values and return address.\n- The base case returns without making another recursive call.\n- Each recursive argument must make progress towards the base case.\n- A call finishes before its caller uses the returned value.\n- Every invocation must restore the state required by the calling convention.\n\nWhy can `lit_count` use less saved state than `fade_sum`?",
  reflectionNoteSummary: "Answer",
  reflectionNote:
    "After its recursive call, `lit_count` needs only the returned count and the constant one. `fade_sum` also needs the original brightness, so it keeps that value across the call.",
  modelVsReality: "",
  originalityNote: {
    textbookExample: "Recursive factorial or Fibonacci with a call-tree drawing.",
    howThisDiffers:
      "A fading display supplies a decreasing unsigned input and a useful zero base case. The computed stack separates pending brightness sums from a count that needs no saved brightness, then exposes a recursive call that makes no progress.",
  },
} as const;
