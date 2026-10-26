// Copyright © 2026 Christopher Snow

// Kept word for word in docs/notes/module-9/prose.md.
export const PROSE = {
  question:
    "The trip computer's report reuses a function that halves a distance. The report must resume after that helper finishes. **How does a function remember where to return?**\n\nThe function making a call is the **caller**; the function receiving it is the **callee**. The recorded `trip_report` calls `half_distance`, then adds the reserve to the returned value.",
  questionNoteSummary: "The recorded compiler output",
  questionNote:
    "The listings paired with C use GCC 16.1 with `-O1 -fno-inline` for little-endian AArch64 Linux. The extra setting prevents inlining: replacing a call with a copy of the called function's body. Keeping the call makes the return mechanism visible.",
  motivation:
    "`bl half_distance` branches to the helper and puts the address of the following instruction in `x30`. Register `x30` is the **link register**. By default, `ret` branches to the address in `x30`; it does not necessarily end the whole program.\n\nA function that calls another function must protect its own return address. `bl` replaces `x30`, so the old value must be saved somewhere before that call and restored before the function returns.\n\nThe **stack** is memory used to hold values needed by active calls. Its current boundary is the **stack pointer**, `sp`. A function reserves space by decreasing `sp` and releases it by increasing `sp` again. This stack grows towards lower addresses.\n\nThe shared register and stack rules form a **calling convention**. This course follows AAPCS64, the procedure-call standard for this target. These rules let separately written functions call one another.",
  smallCall: {
    title: "A caller that returns the helper’s result",
    prose:
      "Follow the handwritten `relay_distance` below. It calls `half_distance` and returns the helper’s result unchanged. Press Next to follow each instruction.\n\nThe space reserved for one active call is its **stack frame**. `stp` stores a pair: `stp x29, x30, [sp, #-16]!` decreases `sp` by 16, then stores two 64-bit values. The saved `x29` starts at `sp`; `x30` starts at `sp + 8`. AAPCS64 requires `sp` to be a multiple of 16 for stack accesses through it. This is 16-byte alignment. Reserving 16 bytes keeps that alignment.\n\nHere `x29` is a **frame pointer**, identifying this call’s frame. `mov x29, sp` sets it after saving its old value. `ldp` loads a pair: `ldp x29, x30, [sp], #16` restores both values, then releases the frame by increasing `sp` by 16. The final `ret` uses the restored return address.",
  },
  prediction:
    "The report receives distance 128 and reserve 9. The helper halves the unsigned distance, then the report adds the reserve.",
  predictionQuestion: "**What does `trip_report` return in `w0`?**",
  predictionExplain:
    "It returns 73, or `0x00000049`. The helper returns 64 in `w0`; the report then adds the saved reserve, 9. The helper's `ret` resumes the report, whose own `ret` returns to its caller.",
  investigation:
    "Now follow `trip_report`, which keeps a reserve across the helper call. Its stack frame reserves 32 bytes. The saved pair has the same layout as before: `x29` at `sp`, then `x30` at `sp + 8`. `stp x29, x30, [sp, #-32]!` reserves this larger frame; `ldp x29, x30, [sp], #32` restores the pair and releases it.\n\nGCC also saves `x19` at `sp + 16`, then uses `w19` to keep the reserve across the helper call. On return, it restores all three saved registers.\n\nAAPCS64 requires a callee to preserve `x19` through `x29` and restore `sp`. Preserve all 64 bits, even if your own calculation uses only a `w` view. The stack must also be aligned to 16 bytes at public call boundaries, where separately compiled functions meet.",
  construction:
    "Write a function that calls the helper and then adds one. Saving the link register lets the final `ret` reach the original caller.",
  writeTask:
    "Complete `report_once`. The unsigned distance arrives in `w0`. Call the supplied `half_distance`, add one to its result, and return that value in `w0`.\n\nPreserve `x19`, `x29` and `sp`. Save and restore the incoming return address in `x30`. The helper is provided; keep it unchanged.",
  writeHints: [
    "The helper call overwrites `x30`. Save its incoming value first.",
    "Do not reserve an arbitrary number of bytes. Keep the stack pointer aligned by reserving a multiple of 16.",
    "With input zero, the helper returns zero and `report_once` adds one. Even this small case must save the original return address before the helper call.",
    "After the helper returns, add one to `w0`. Restore the saved pair and release the stack space before returning.",
    "One complete solution is:\n\n```asm\nreport_once:\n stp x29, x30, [sp, #-16]!\n mov x29, sp\n bl half_distance\n add w0, w0, #1\n ldp x29, x30, [sp], #16\n ret\nhalf_distance:\n lsr w0, w0, #1\n ret\n```",
  ],
  failureExperiment:
    "The changed `report_once` calls the helper without saving its incoming `x30`. The helper returns successfully, and the report executes its addition and `ret`. This recording stops after at most 20 instructions.",
  failureQuestion: "**Does the report return to its original caller before the recording limit?**",
  failureExplain:
    "It reaches the recording limit. The helper call left `x30` pointing to the report's addition. The report's own `ret` branches back to that same instruction, so the addition and return repeat.\n\nThe helper's return worked. The missing save lost the return address that the report needed afterwards.",
  explanation:
    "A call instruction records one return address. It does not automatically save the previous address, allocate a frame or restore registers. The instructions around the call perform that work.\n\nThe calling convention also decides which values may survive a call. The ordinary integer arguments here use `x0` through `x7`, or their `w` views. These simple integer functions return through register 0. A caller must not expect its argument registers to keep their old values after a call.\n\nTo keep a value, the caller can save it in memory or use a register the callee must preserve, such as `x19`. If the caller itself changes `x19`, it must first save its incoming value and restore it before returning. These responsibilities apply to each function in the chain.",
  generalisation:
    "Before each call, identify the values needed afterwards. Protect the return address and any other live values. After the call, use the returned value, restore saved registers, and release the stack space.\n\nA **leaf function** calls no other function. It can often return using the incoming link register directly. A function that makes another call needs to account for the link register being overwritten.\n\nThe final exercise's helper also writes `w1`. That is allowed by the calling convention. The caller must preserve its reserve deliberately, even if an earlier version of the helper happened to leave `w1` unchanged.",
  finalTask:
    "Complete `trip_report` using the supplied helper. `w0` holds an unsigned distance and `w1` an unsigned reserve. Return half the distance plus the original reserve in `w0`, with unsigned 32-bit wrapping.\n\nThe helper overwrites `w1`. Keep the reserve across the call, and preserve the incoming values of `x19`, `x29` and `sp`. Keep the helper unchanged.",
  finalHints: [
    "Do not rely on `w1` still holding the reserve after the call.",
    "Using `w19` without saving the incoming `x19` loses a value the caller expects to keep. Save all 64 bits before reusing the register.",
    "With distance zero and reserve 9, the helper returns zero. The final result is still 9, so the reserve must survive the call.",
    "Reserve 32 bytes. Save `x29` at `sp`, `x30` at `sp + 8`, and `x19` at `sp + 16`. Each saved value occupies eight bytes.",
    "One complete solution is:\n\n```asm\ntrip_report:\n stp x29, x30, [sp, #-32]!\n mov x29, sp\n str x19, [sp, #16]\n mov w19, w1\n bl half_distance\n add w0, w0, w19\n ldr x19, [sp, #16]\n ldp x29, x30, [sp], #32\n ret\nhalf_distance:\n lsr w0, w0, #1\n mov w1, #0\n ret\n```",
  ],
  reflection:
    "- `bl` writes a return address into `x30` and branches to the callee.\n- `ret` normally branches to the address in `x30`.\n- Saving and restoring the return address requires instructions.\n- A caller protects values it needs after a call.\n- A callee restores registers the calling convention requires it to preserve.\n\nWhy is saving only `w19` insufficient when your function changes register 19?",
  reflectionNoteSummary: "Answer",
  reflectionNote:
    "The calling convention requires preservation of all 64 bits of `x19`. Saving only its low 32 bits loses any incoming upper bits; writing or restoring through `w19` clears those upper bits.",
  modelVsReality:
    "The diagram shows stack space and bytes allocated by the simulated functions. The course starts them with a prepared, aligned stack and a return address that ends the outer call. It does not show operating-system startup, operating-system protections or every rule for calls between compiled functions.\n\nAAPCS64 permits platform-specific frame-pointer policies, so this GCC frame is not a template every function must use. Register `x18` also has platform-specific uses and is avoided here.",
  originalityNote: {
    textbookExample: "A function call presented only as a jump followed by a return.",
    howThisDiffers:
      "A trip report must keep both its return address and a reserve while a helper runs. A helper that legally changes an argument register exposes why preserving a value is the caller's responsibility.",
  },
} as const;
