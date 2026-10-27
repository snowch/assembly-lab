// Copyright © 2026 Christopher Snow

// Separate draft from the checked return trace; canonical copy in returning-to-caller/prose.md.
export const RETURNING_STRINGS = {
  title: "A result stays in the register",
  caller: "Caller",
  functionName: "increment_int",
  sharedRegisters: "Registers shared by caller and function",
  returnAddress: "Link register",
  beforeCallTarget: "Not yet set for this call",
  written: "Written",
  returnTarget: "Caller’s addition",
  run: "Run the instruction",
  back: "Back",
  reset: "Start again",
  next: "Runs next",
  ran: "Just ran",
  status: (step: number, w0: number, w1: number) =>
    step === 0
      ? "Run bl to call increment_int with the argument already in w0."
      : step === 1
        ? "bl saved the caller’s addition address in x30 and entered increment_int. Run the function’s addition."
        : step === 2
          ? `The function wrote ${w0} to w0. Its ret runs next.`
          : step === 3
            ? `ret returned to the caller. w0 still holds ${w0}. Run the caller’s addition.`
            : `The caller read ${w0} from w0 and wrote ${w1} to w1.`,
  complete: "The activity stops after this caller instruction.",
  callerProse: "These caller instructions were written for this course.",
} as const;
